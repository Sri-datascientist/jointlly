# Deploy Jointlly on AWS EC2

This guide deploys the **React frontend** (static `dist/`) and **FastAPI backend** (`jointlly_backend/`) on a single EC2 instance behind Nginx.

## Prerequisites

- Ubuntu 22.04+ EC2 instance (t3.small or larger recommended)
- Security group: ports **22**, **80**, **443** open
- RDS MySQL (or MySQL on the instance) — connection string in backend `.env`
- Domain pointed at the instance (optional but recommended for HTTPS)

## 1. Clone the repository

```bash
git clone https://github.com/Sri-datascientist/jointlly.git
cd jointlly
```

## 2. Backend setup

```bash
cd jointlly_backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env: DATABASE_URL, JWT_SECRET_KEY, Razorpay, SMTP, Cloudinary, etc.
alembic upgrade head
```

Run a quick smoke test:

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8001
```

## 3. Frontend build

From the repo root:

```bash
npm ci
cp .env.example .env
# Set VITE_API_URL to your public API URL, e.g. https://api.yourdomain.com
npm run build
```

The production bundle is in `dist/`.

## 4. Systemd service (backend)

Create `/etc/systemd/system/jointlly-api.service`:

```ini
[Unit]
Description=Jointlly FastAPI
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/jointlly/jointlly_backend
EnvironmentFile=/home/ubuntu/jointlly/jointlly_backend/.env
ExecStart=/home/ubuntu/jointlly/jointlly_backend/.venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8001
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now jointlly-api
```

## 5. Nginx

Example `/etc/nginx/sites-available/jointlly`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /home/ubuntu/jointlly/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/jointlly /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Add TLS with Certbot: `sudo certbot --nginx -d yourdomain.com`

## 6. Environment files (never commit)

| File | Purpose |
|------|---------|
| `jointlly_backend/.env` | Database, JWT, Razorpay, SMTP, Cloudinary |
| `.env` (repo root) | `VITE_API_URL` for frontend build |

Both are listed in `.gitignore`. Use `.env.example` as templates only.

## 7. Updates

```bash
cd ~/jointlly
git pull
cd jointlly_backend && source .venv/bin/activate && alembic upgrade head
cd .. && npm ci && npm run build
sudo systemctl restart jointlly-api
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| API 502 | Check `sudo systemctl status jointlly-api` and backend `.env` |
| CORS / wrong API | Rebuild frontend with correct `VITE_API_URL` |
| DB connection | Verify RDS security group allows EC2 private IP |
| Missing migrations | Run `alembic upgrade head` in `jointlly_backend` |

See also [CONNECT.md](../CONNECT.md) for local development wiring.
