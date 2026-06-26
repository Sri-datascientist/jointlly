# Jointlly

Real-estate collaboration platform — React frontend + FastAPI backend.

## Local development

See [CONNECT.md](./CONNECT.md) for full frontend ↔ backend setup.

```sh
# Frontend (repo root)
npm install
npm run dev

# Backend
cd jointlly_backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
cp .env.example .env       # configure secrets locally — never commit .env
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

## Deploy on AWS EC2

See **[docs/DEPLOY_EC2.md](./docs/DEPLOY_EC2.md)** for Nginx, systemd, migrations, and production env setup.

## Stack

- **Frontend:** Vite, React, TypeScript, shadcn-ui, Tailwind CSS
- **Backend:** FastAPI, SQLAlchemy, Alembic, MySQL, Razorpay

## Secrets

Copy `.env.example` files to `.env` locally. All `.env` files are gitignored and must not be pushed to GitHub.

