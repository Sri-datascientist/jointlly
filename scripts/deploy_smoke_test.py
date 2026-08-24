#!/usr/bin/env python3
"""
Pre-deploy smoke tests for Jointlly API.

Usage:
  python scripts/deploy_smoke_test.py
  python scripts/deploy_smoke_test.py --base-url https://back.jointlly.in
  python scripts/deploy_smoke_test.py --base-url http://127.0.0.1:8001 --email admin@jointlly.local --password 'Admin@12345'

Exits 0 when all required checks pass.
"""
from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.parse
import urllib.request
from typing import Any

PASS = 0
FAIL = 1


class CheckResult:
    def __init__(self, name: str, ok: bool, detail: str = ""):
        self.name = name
        self.ok = ok
        self.detail = detail


def request(
    method: str,
    url: str,
    *,
    headers: dict[str, str] | None = None,
    data: bytes | None = None,
    form: dict[str, str] | None = None,
) -> tuple[int, dict[str, str], Any]:
    hdrs = dict(headers or {})
    body = data
    if form is not None:
        body = urllib.parse.urlencode(form).encode("utf-8")
        hdrs.setdefault("Content-Type", "application/x-www-form-urlencoded")
    req = urllib.request.Request(url, data=body, headers=hdrs, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            raw = resp.read()
            ctype = resp.headers.get("content-type", "")
            parsed: Any = None
            if "application/json" in ctype and raw:
                parsed = json.loads(raw.decode("utf-8"))
            elif raw:
                parsed = raw.decode("utf-8", errors="replace")[:500]
            return resp.status, dict(resp.headers), parsed
    except urllib.error.HTTPError as e:
        raw = e.read()
        parsed: Any = None
        try:
            parsed = json.loads(raw.decode("utf-8")) if raw else None
        except json.JSONDecodeError:
            parsed = raw.decode("utf-8", errors="replace")[:500]
        return e.code, dict(e.headers), parsed


def login(base: str, email: str, password: str) -> str | None:
    status, _, body = request(
        "POST",
        f"{base}/api/v1/auth/login",
        form={"username": email, "password": password},
    )
    if status != 200 or not isinstance(body, dict):
        return None
    return body.get("access_token")


def main() -> int:
    parser = argparse.ArgumentParser(description="Jointlly deploy smoke tests")
    parser.add_argument("--base-url", default="https://back.jointlly.in", help="API base URL")
    parser.add_argument("--email", default="", help="Admin email for authenticated checks")
    parser.add_argument("--password", default="", help="Admin password")
    args = parser.parse_args()
    base = args.base_url.rstrip("/")
    results: list[CheckResult] = []

    # --- Public / unauthenticated ---
    status, _, body = request("GET", f"{base}/health")
    results.append(CheckResult("GET /health", status == 200, f"status={status} body={body!r}"))

    status, _, _ = request("GET", f"{base}/api/v1/admin/stats")
    results.append(
        CheckResult(
            "GET /admin/stats without auth rejected",
            status in (401, 403),
            f"status={status}",
        )
    )

    status, _, _ = request("GET", f"{base}/api/v1/marketplace/builders?page_size=1")
    results.append(
        CheckResult(
            "GET /marketplace/builders (auth-gated)",
            status in (200, 401, 403),
            f"status={status} (403/401 expected without login)",
        )
    )

    status, _, _ = request(
        "POST",
        f"{base}/api/v1/auth/login",
        form={"username": "invalid@jointlly.test", "password": "wrong-password-xyz"},
    )
    results.append(
        CheckResult(
            "POST /auth/login invalid credentials rejected",
            status in (401, 422),
            f"status={status}",
        )
    )

    token: str | None = None
    if args.email and args.password:
        token = login(base, args.email, args.password)
        results.append(
            CheckResult(
                "POST /auth/login admin",
                token is not None,
                "token received" if token else "login failed",
            )
        )
    else:
        results.append(
            CheckResult(
                "POST /auth/login admin",
                True,
                "skipped (pass --email and --password for authenticated suite)",
            )
        )

    if token:
        auth = {"Authorization": f"Bearer {token}"}

        admin_gets = [
            ("GET /admin/stats", f"{base}/api/v1/admin/stats"),
            ("GET /admin/users", f"{base}/api/v1/admin/users?limit=5"),
            ("GET /admin/landowners", f"{base}/api/v1/admin/landowners?limit=5"),
            ("GET /admin/professionals", f"{base}/api/v1/admin/professionals?limit=5"),
            ("GET /admin/form-submissions", f"{base}/api/v1/admin/form-submissions?limit=5"),
            ("GET /admin/connections", f"{base}/api/v1/admin/connections?limit=5"),
            ("GET /admin/support/tickets", f"{base}/api/v1/admin/support/tickets?limit=5"),
            ("GET /admin/payments/transactions", f"{base}/api/v1/admin/payments/transactions?limit=5"),
        ]
        for label, url in admin_gets:
            status, _, body = request("GET", url, headers=auth)
            ok = status == 200
            extra = ""
            if label == "GET /admin/stats" and isinstance(body, dict):
                extra = f" keys={sorted(body.keys())}"
                if "total_connections" not in body:
                    ok = False
                    extra += " MISSING total_connections"
            results.append(CheckResult(label, ok, f"status={status}{extra}"))

        # PATCH route existence: landowner profile (404/422 ok if no id; 405/404 bad if route missing)
        status, _, body = request(
            "PATCH",
            f"{base}/api/v1/admin/users/00000000-0000-0000-0000-000000000001",
            headers={**auth, "Content-Type": "application/json"},
            data=json.dumps({"name": "Smoke Test"}).encode("utf-8"),
        )
        results.append(
            CheckResult(
                "PATCH /admin/users/{id} route exists",
                status in (404, 400, 422, 200),
                f"status={status} detail={body!r}",
            )
        )

        status, _, body = request(
            "PATCH",
            f"{base}/api/v1/admin/landowners/00000000-0000-0000-0000-000000000001/profile",
            headers={**auth, "Content-Type": "application/json"},
            data=json.dumps({"city": "Test"}).encode("utf-8"),
        )
        results.append(
            CheckResult(
                "PATCH /admin/landowners/{id}/profile route exists",
                status in (404, 400, 422, 200),
                f"status={status}",
            )
        )

    # --- Report ---
    failed = [r for r in results if not r.ok]
    print(f"\nJointlly API smoke tests — {base}\n{'=' * 60}")
    for r in results:
        mark = "PASS" if r.ok else "FAIL"
        line = f"[{mark}] {r.name}"
        if r.detail:
            line += f" — {r.detail}"
        print(line)
    print(f"\n{len(results) - len(failed)}/{len(results)} passed")
    return PASS if not failed else FAIL


if __name__ == "__main__":
    sys.exit(main())
