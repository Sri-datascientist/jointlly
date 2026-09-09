"""
Email sending utilities (verification & password reset) using ZeptoMail SMTP.
"""
from html import escape
from typing import Optional
from email.message import EmailMessage
from email.utils import formataddr
from urllib.parse import quote as urlquote

import aiosmtplib

from app.config import settings
import logging

logger = logging.getLogger("jointlly.email")


def _marketplace_logo_url() -> str:
    raw = (getattr(settings, "email_logo_url", None) or "").strip()
    if raw:
        return raw
    base = (settings.frontend_base_url or "https://jointlly.in").rstrip("/")
    return f"{base}/image/IMG-20260323-WA0012-removebg-preview.png"


def _marketplace_email_shell(*, preheader: str, heading: str, body_html: str) -> str:
    """Table-based layout for email clients; includes logo in header."""
    logo = escape(_marketplace_logo_url(), quote=True)
    fe = escape((settings.frontend_base_url or "https://jointlly.in").rstrip("/"))
    h_pre = escape(preheader)
    h_head = escape(heading)
    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f0f5f2;font-family:'Segoe UI',Roboto,-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f0f5f2;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" width="560" style="max-width:560px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #d5e4dc;box-shadow:0 12px 40px rgba(13,59,33,0.08);">
        <!-- Header with Jointlly Brand Gradient -->
        <tr>
          <td style="padding:32px 28px 24px;background:linear-gradient(135deg, #0d3b21 0%, #1a5c35 60%, #2e7d4a 100%);text-align:center;">
            <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto;">
              <tr>
                <td style="background:rgba(255,255,255,0.95);padding:10px 18px;border-radius:14px;box-shadow:0 4px 12px rgba(0,0,0,0.15);">
                  <img src="{logo}" alt="Jointlly" height="48" style="display:block;height:48px;width:auto;border:0;outline:none;" />
                </td>
              </tr>
            </table>
            <p style="margin:14px 0 0;font-size:11px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:#a8e0bd;">Real Estate &amp; Construction Marketplace</p>
          </td>
        </tr>
        <!-- Content Body -->
        <tr><td style="padding:28px 32px 8px;">
          <p style="margin:0;color:#2e6b47;font-size:13px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;">{h_pre}</p>
        </td></tr>
        <tr><td style="padding:6px 32px 12px;">
          <h1 style="margin:0;font-size:24px;line-height:1.3;color:#0d3b21;font-weight:700;">{h_head}</h1>
        </td></tr>
        <tr><td style="padding:8px 32px 32px;color:#334e3e;font-size:15px;line-height:1.65;">
          {body_html}
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:20px 32px;background:#f6faf7;border-top:1px solid #e2ebe5;font-size:12px;color:#5a7364;line-height:1.6;text-align:center;">
          Jointlly Real Estate Advisory &amp; Marketplace Platform
          <br />
          <a href="{fe}" style="color:#1a5c35;font-weight:700;text-decoration:none;">Visit jointlly.in</a>
          <br /><span style="color:#8a9e91;font-size:11px;">This is an automated notification. Please do not reply directly.</span>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""


def _detail_table(title: str, rows: list[tuple[str, str]]) -> str:
    """rows: (label, cell_inner_html) — cell content is trusted HTML we build."""
    inner = ""
    for label, cell_html in rows:
        cell = cell_html or '<span style="color:#9aaa9f;font-weight:500;">Not on file</span>'
        inner += (
            f'<tr><td style="padding:8px 14px;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;'
            f'color:#6b7c72;border-bottom:1px solid #e8efe9;vertical-align:top;width:34%;">{escape(label)}</td>'
            f'<td style="padding:8px 14px;font-size:15px;color:#1a2e22;font-weight:600;border-bottom:1px solid #e8efe9;">'
            f"{cell}</td></tr>"
        )
    return (
        f'<p style="margin:20px 0 8px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6b7c72;">'
        f"{escape(title)}</p>"
        f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;'
        f'background:#f8faf9;border-radius:12px;border:1px solid #dfe8e3;overflow:hidden;">{inner}</table>'
    )


def _mailto_tel_links(email: Optional[str], phone: Optional[str]) -> tuple[str, str]:
    e = (email or "").strip()
    p = (phone or "").strip()
    email_html = (
        f'<a href="mailto:{urlquote(e)}" style="color:#1f4a36;text-decoration:none;font-weight:600;">{escape(e)}</a>'
        if e
        else ""
    )
    digits = "".join(c for c in p if c.isdigit() or c == "+")
    phone_html = (
        f'<a href="tel:{escape(digits)}" style="color:#1f4a36;text-decoration:none;font-weight:600;">{escape(p)}</a>'
        if p
        else ""
    )
    return email_html, phone_html


def _build_frontend_link(path: str, token: str) -> str:
    base = settings.frontend_base_url.rstrip("/")
    if not path.startswith("/"):
        path = "/" + path
    return f"{base}{path}?token={token}"


def _get_from_email() -> str:
    # Prefer explicit SMTP_FROM_EMAIL, fallback to SMTP_USERNAME
    return str(settings.smtp_from_email or settings.smtp_username or "no-reply@localhost")


def _plain_contact(v: Optional[str]) -> str:
    s = (v or "").strip()
    return s if s else "Not on file"


def _plain_project_field(v: Optional[str]) -> str:
    s = (v or "").strip()
    return s if s else "Not specified"


def _marketplace_plain_footer() -> str:
    base = (settings.frontend_base_url or "https://jointlly.in").rstrip("/")
    return (
        f"\n--\nJointlly · {base}\n"
        "Automated notification about marketplace activity on Jointlly."
    )


async def send_email(
    to_email: str,
    subject: str,
    html_body: str,
    *,
    from_email: Optional[str] = None,
    text_body: Optional[str] = None,
    reply_to: Optional[str] = None,
) -> bool:
    """
    Send a single HTML email.
    """
    if not settings.smtp_host or not settings.smtp_username or not settings.smtp_password:
        missing = []
        if not settings.smtp_host:
            missing.append("SMTP_HOST")
        if not settings.smtp_username:
            missing.append("SMTP_USERNAME")
        if not settings.smtp_password:
            missing.append("SMTP_PASSWORD")
        if settings.environment.lower() == "production":
            raise RuntimeError(
                "SMTP is not configured but email send was requested. Missing: "
                + ", ".join(missing)
            )
        logger.warning(
            "Email send skipped (missing SMTP config: %s). To=%s Subject=%s ENVIRONMENT=%s",
            ", ".join(missing),
            to_email,
            subject,
            settings.environment,
        )
        return False

    message = EmailMessage()
    addr_raw = str(from_email or _get_from_email()).strip()
    if "<" in addr_raw and "@" in addr_raw:
        message["From"] = addr_raw
    else:
        message["From"] = formataddr(("Jointlly", addr_raw))
    message["To"] = to_email
    message["Subject"] = subject
    message["Auto-Submitted"] = "auto-generated"
    effective_reply = reply_to if reply_to is not None else (
        str(settings.smtp_reply_to) if settings.smtp_reply_to else None
    )
    if effective_reply:
        message["Reply-To"] = effective_reply

    plain = text_body or (
        "This is a transactional message from Jointlly.\n\n"
        "If the formatted version does not display correctly, open this email in a browser or another mail app "
        "that supports HTML.\n"
    )
    message.set_content(plain, charset="utf-8")
    message.add_alternative(html_body, subtype="html", charset="utf-8")

    try:
        await aiosmtplib.send(
            message,
            hostname=settings.smtp_host,
            port=settings.smtp_port,
            username=settings.smtp_username,
            password=settings.smtp_password,
            start_tls=True,
        )
    except Exception:
        logger.exception("SMTP send failed to=%s subject=%s host=%s", to_email, subject, settings.smtp_host)
        raise

    logger.info("Email sent successfully to=%s subject=%s", to_email, subject)
    return True


async def send_verification_email(
    to_email: str,
    name: Optional[str],
    token: str,
) -> None:
    """
    Send email verification link to new user.
    """
    verify_link = _build_frontend_link("/verify-email", token)
    display_name = escape(name or to_email)

    subject = "Verify your Jointlly account"
    body_content = f"""
        <p style="margin:0 0 16px;color:#334e3e;line-height:1.65;">
          Welcome <strong>{display_name}</strong>! Thank you for joining Jointlly.
        </p>
        <p style="margin:0 0 24px;color:#334e3e;line-height:1.65;">
          Please verify your email address to activate your account and start exploring verified real estate and construction partnerships.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0;">
          <tr>
            <td align="center" style="border-radius:50px;background:linear-gradient(135deg, #1a5c35 0%, #2e7d4a 100%);">
              <a href="{escape(verify_link, quote=True)}" target="_blank"
                 style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:50px;letter-spacing:0.02em;">
                Verify Email Address
              </a>
            </td>
          </tr>
        </table>
        <p style="margin:24px 0 8px;font-size:13px;color:#607869;">
          Or copy and paste this link into your browser:
        </p>
        <p style="margin:0 0 24px;font-size:13px;word-break:break-all;color:#1a5c35;">
          <a href="{escape(verify_link, quote=True)}" style="color:#1a5c35;text-decoration:underline;">{escape(verify_link)}</a>
        </p>
        <p style="margin:24px 0 0;font-size:12px;color:#8a9e91;">
          If you did not create an account on Jointlly, you can safely ignore this email.
        </p>
    """
    html_body = _marketplace_email_shell(
        preheader="Account Verification",
        heading="Verify Your Email Address",
        body_html=body_content,
    )
    await send_email(to_email=to_email, subject=subject, html_body=html_body)


async def send_verification_otp_email(
    to_email: str,
    name: Optional[str],
    otp: str,
) -> None:
    """
    Send an email OTP for account verification.
    """
    display_name = escape(name or to_email)
    subject = "Your Jointlly verification code"
    body_content = f"""
        <p style="margin:0 0 16px;color:#334e3e;line-height:1.65;">
          Hi <strong>{display_name}</strong>, use the secure 6-digit code below to complete your email verification.
        </p>
        <div style="text-align:center;margin:28px 0;">
          <div style="display:inline-block;padding:16px 28px;border-radius:14px;background:#0d3b21;color:#ffffff;letter-spacing:8px;font-size:28px;font-weight:700;box-shadow:0 4px 16px rgba(13,59,33,0.15);">
            {escape(otp)}
          </div>
        </div>
        <p style="margin:24px 0 0;font-size:13px;color:#607869;text-align:center;">
          This code will expire in 10 minutes for security reasons.
        </p>
    """
    html_body = _marketplace_email_shell(
        preheader="Security Verification",
        heading="Verification Code",
        body_html=body_content,
    )
    await send_email(to_email=to_email, subject=subject, html_body=html_body)


async def send_password_reset_email(
    to_email: str,
    name: Optional[str],
    token: str,
) -> None:
    """
    Send password reset link to existing user.
    """
    reset_link = _build_frontend_link("/reset-password", token)
    display_name = escape(name or to_email)

    subject = "Reset your Jointlly password"
    body_content = f"""
        <p style="margin:0 0 16px;color:#334e3e;line-height:1.65;">
          Hi <strong>{display_name}</strong>, we received a request to reset the password for your Jointlly account.
        </p>
        <p style="margin:0 0 24px;color:#334e3e;line-height:1.65;">
          Click the button below to secure your account and set up a new password. This link is valid for 1 hour.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0;">
          <tr>
            <td align="center" style="border-radius:50px;background:linear-gradient(135deg, #1a5c35 0%, #2e7d4a 100%);">
              <a href="{escape(reset_link, quote=True)}" target="_blank"
                 style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:50px;letter-spacing:0.02em;">
                Reset Password
              </a>
            </td>
          </tr>
        </table>
        <p style="margin:24px 0 8px;font-size:13px;color:#607869;">
          Or copy and paste this link into your browser:
        </p>
        <p style="margin:0 0 24px;font-size:13px;word-break:break-all;color:#1a5c35;">
          <a href="{escape(reset_link, quote=True)}" style="color:#1a5c35;text-decoration:underline;">{escape(reset_link)}</a>
        </p>
        <p style="margin:24px 0 0;font-size:12px;color:#8a9e91;">
          If you did not request a password reset, your password will remain unchanged and you can safely ignore this email.
        </p>
    """
    html_body = _marketplace_email_shell(
        preheader="Account Security",
        heading="Password Reset Request",
        body_html=body_content,
    )
    await send_email(to_email=to_email, subject=subject, html_body=html_body)


async def send_password_reset_otp_email(
    to_email: str,
    name: Optional[str],
    otp: str,
) -> None:
    """
    Send an email OTP for password reset.
    """
    display_name = name or to_email

    subject = "Your Jointlly password reset OTP"
    html_body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 24px;">
        <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 24px;">
          <h2 style="color: #1f2933; margin-bottom: 12px;">Reset your password</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Hi {display_name}, use this OTP to reset your Jointlly account password.
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <div style="display: inline-block; padding: 14px 18px; border-radius: 10px; background: #0b1220; color: #ffffff; letter-spacing: 6px; font-size: 24px; font-weight: 700;">
              {otp}
            </div>
          </div>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            This code expires soon. If you did not request a password reset, you can safely ignore this email.
          </p>
        </div>
      </body>
    </html>
    """

    await send_email(to_email=to_email, subject=subject, html_body=html_body)


async def send_marketplace_connection_email(
    *,
    to_email: str,
    recipient_name: Optional[str],
    recipient_role: str,
    selector_side: str,
    selector_name: str,
    selector_email: Optional[str],
    selector_phone: Optional[str],
    other_party_name: str,
    other_party_email: Optional[str],
    other_party_phone: Optional[str],
    project_type: Optional[str],
    project_city: Optional[str],
    payment_reference: Optional[str] = None,
) -> bool:
    """Send contact-sharing email after marketplace selection/connection. Returns True if SMTP accepted the message."""
    display_name = recipient_name or to_email
    side_label = "landowner" if selector_side == "landowner" else "builder"

    payment_html = ""
    if payment_reference:
        payment_html = (
            "<p style=\"margin:16px 0 0;color:#3d5247;line-height:1.6;font-size:14px;\">"
            f"Payment reference: <strong>{escape(payment_reference)}</strong></p>"
        )

    # Landowner chose a builder → email to builder
    if selector_side == "landowner" and recipient_role == "builder":
        subject = (
            "A landowner wants to discuss their project with you on Jointlly"
            if not payment_reference
            else "Marketplace connection confirmed after payment"
        )
        le, lp = _mailto_tel_links(selector_email, selector_phone)
        body = (
            f'<p style="margin:0 0 16px;">Hi <strong>{escape(display_name)}</strong>, a landowner on Jointlly has '
            f"chosen your company to explore a <strong>property development / construction</strong> opportunity. "
            f"They agreed to share contact details so you can follow up directly.</p>"
            f'{_detail_table("Landowner contact", [("Name", escape(selector_name)), ("Email", le), ("Phone", lp)])}'
            f'{_detail_table("Project", [("Type", escape(project_type or "Not specified")), ("Location", escape(project_city or "Not specified"))])}'
            f"{payment_html}"
            f'<p style="margin:20px 0 0;font-size:13px;color:#5c6b5f;line-height:1.55;">'
            f"Reach out using the details above. Keep key milestones on Jointlly when possible.</p>"
        )
        html_body = _marketplace_email_shell(
            preheader="New landowner lead — contact details inside",
            heading="You have a new landowner lead",
            body_html=body,
        )
        text_body = (
            f"Hi {display_name},\n\n"
            "A landowner on Jointlly chose your company to explore a property development or construction opportunity.\n"
            "They agreed to share contact details so you can follow up directly.\n\n"
            "Landowner contact\n"
            f"  Name: {_plain_contact(selector_name)}\n"
            f"  Email: {_plain_contact(selector_email)}\n"
            f"  Phone: {_plain_contact(selector_phone)}\n\n"
            "Project\n"
            f"  Type: {_plain_project_field(project_type)}\n"
            f"  Location: {_plain_project_field(project_city)}\n"
        )
        if payment_reference:
            text_body += f"\nPayment reference: {payment_reference}\n"
        text_body += (
            "\nReach out using the details above. Keep key milestones on Jointlly when possible."
            + _marketplace_plain_footer()
        )
        return await send_email(to_email=to_email, subject=subject, html_body=html_body, text_body=text_body)

    # Copy to landowner after they selected
    if selector_side == "landowner" and recipient_role == "landowner":
        subject = (
            "We notified your chosen builder on Jointlly"
            if not payment_reference
            else "Marketplace connection confirmed after payment"
        )
        be, bp = _mailto_tel_links(other_party_email, other_party_phone)
        body = (
            f'<p style="margin:0 0 16px;">Hi <strong>{escape(display_name)}</strong>, thanks for confirming your '
            f"choice. We emailed <strong>{escape(other_party_name)}</strong> with your contact details.</p>"
            f'{_detail_table("Builder", [("Company", escape(other_party_name)), ("Email", be), ("Phone", bp)])}'
            f'{_detail_table("Your project", [("Type", escape(project_type or "Not specified")), ("Location", escape(project_city or "Not specified"))])}'
            f"{payment_html}"
            f'<p style="margin:20px 0 0;font-size:13px;color:#5c6b5f;">'
            f"If you did not mean to share your details, contact support right away.</p>"
        )
        html_body = _marketplace_email_shell(
            preheader="Your builder has been notified",
            heading="Selection confirmed",
            body_html=body,
        )
        text_body = (
            f"Hi {display_name},\n\n"
            f"Thanks for confirming your choice. We emailed {other_party_name} with your contact details.\n\n"
            "Builder\n"
            f"  Company: {_plain_contact(other_party_name)}\n"
            f"  Email: {_plain_contact(other_party_email)}\n"
            f"  Phone: {_plain_contact(other_party_phone)}\n\n"
            "Your project\n"
            f"  Type: {_plain_project_field(project_type)}\n"
            f"  Location: {_plain_project_field(project_city)}\n"
        )
        if payment_reference:
            text_body += f"\nPayment reference: {payment_reference}\n"
        text_body += (
            "\nIf you did not mean to share your details, contact support right away."
            + _marketplace_plain_footer()
        )
        return await send_email(to_email=to_email, subject=subject, html_body=html_body, text_body=text_body)

    subject = (
        "New marketplace connection on Jointlly"
        if not payment_reference
        else "Marketplace connection confirmed after payment"
    )
    se, sp = _mailto_tel_links(selector_email, selector_phone)
    oe, op = _mailto_tel_links(other_party_email, other_party_phone)
    body = (
        f'<p style="margin:0 0 16px;">Hi <strong>{escape(display_name)}</strong>, a <strong>{escape(side_label)}</strong> '
        f"selection was confirmed on Jointlly.</p>"
        f'{_detail_table("Who selected", [("Name", escape(selector_name)), ("Email", se), ("Phone", sp)])}'
        f'{_detail_table("Other party", [("Name", escape(other_party_name)), ("Email", oe), ("Phone", op)])}'
        f'{_detail_table("Project", [("Type", escape(project_type or "Not specified")), ("Location", escape(project_city or "Not specified"))])}'
        f"{payment_html}"
        f'<p style="margin:20px 0 0;font-size:13px;color:#5c6b5f;">Continue important steps through Jointlly when possible.</p>'
    )
    html_body = _marketplace_email_shell(
        preheader="Marketplace connection update",
        heading="Connection update",
        body_html=body,
    )
    text_body = (
        f"Hi {display_name},\n\n"
        f"A {side_label} selection was confirmed on Jointlly.\n\n"
        "Who selected\n"
        f"  Name: {_plain_contact(selector_name)}\n"
        f"  Email: {_plain_contact(selector_email)}\n"
        f"  Phone: {_plain_contact(selector_phone)}\n\n"
        "Other party\n"
        f"  Name: {_plain_contact(other_party_name)}\n"
        f"  Email: {_plain_contact(other_party_email)}\n"
        f"  Phone: {_plain_contact(other_party_phone)}\n\n"
        "Project\n"
        f"  Type: {_plain_project_field(project_type)}\n"
        f"  Location: {_plain_project_field(project_city)}\n"
    )
    if payment_reference:
        text_body += f"\nPayment reference: {payment_reference}\n"
    text_body += (
        "\nContinue important steps through Jointlly when possible." + _marketplace_plain_footer()
    )
    return await send_email(to_email=to_email, subject=subject, html_body=html_body, text_body=text_body)

