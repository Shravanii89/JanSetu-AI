# JanSetu AI - Production Deployment & Migration Guide

Comprehensive deployment architecture and configuration guide for JanSetu AI:
- **Database**: Supabase PostgreSQL
- **Backend API**: Render Web Service (FastAPI + Python)
- **Frontend App**: Vercel (Next.js 15)

---

## 1. Supabase PostgreSQL Architecture

### Connection Topology: Pooled vs. Direct

| Connection Mode | Host & Port | Driver Compatibility | Recommendation |
| :--- | :--- | :--- | :--- |
| **Supavisor Session Pooler** | `aws-0-<region>.pooler.supabase.com:5432` | `postgresql+asyncpg://` | **Recommended for Render & FastAPI**. Supports IPv4 globally, full prepared statements, DDL schema creation, and transaction pooling. |
| **Supavisor Transaction Pooler** | `aws-0-<region>.pooler.supabase.com:6543` | `postgresql+asyncpg://` | Supported with `prepared_statement_cache_size=0`. Ideal for serverless/edge functions. |
| **Direct Database Connection** | `db.<project-ref>.supabase.co:5432` | Standard PostgreSQL | IPv6 only on standard Supabase infrastructure. Fails on IPv4-only networks or Render instances without IPv6 add-on. |

### Engine & Connection Pool Configuration
In `backend/app/db/session.py`, the engine is configured with:
- **Driver**: `asyncpg` via `postgresql+asyncpg://`
- **SSL**: Enforced (`ssl="require"`)
- **Query Sanitization**: Automatically strips incompatible `sslmode` parameters that cause `asyncpg` `TypeError` crashes.
- **Resilience**: `pool_pre_ping=True`, `pool_recycle=300`, `pool_size=10`, `max_overflow=20`
- **Automatic Timezone Normalization**: Automatically converts timezone-aware datetimes to naive UTC for PostgreSQL `TIMESTAMP WITHOUT TIME ZONE`.

---

## 2. Backend Deployment on Render

### Step 1: Create a Web Service
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Web Service**.
3. Connect your Git repository (`JanSetu-AI`).
4. Configure service settings:
   - **Name**: `jansetu-ai-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Region**: Closest to Supabase database (e.g., `Singapore` or `Frankfurt/Oregon`).
   - **Branch**: `main`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Step 2: Environment Variables
Configure the following in the Render service **Environment** tab:

```ini
ENVIRONMENT=production
PORT=8000
HOST=0.0.0.0
DEBUG=False

# CORS: Comma-separated list of allowed origins (include your Vercel frontend URL)
CORS_ORIGINS=https://your-jansetu-app.vercel.app,http://localhost:3000

# Database: Supabase PostgreSQL Session Pooler URL
DATABASE_URL=postgresql://postgres.<project-ref>:<db-password>@aws-0-<region>.pooler.supabase.com:5432/postgres?sslmode=require

# Supabase Keys
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_ANON_KEY=<your-supabase-publishable-key>

# JWT Security (Generate a secure 64-char random string)
JWT_SECRET=<your-production-jwt-secret-min-32-chars>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480

# Optional Google Gemini AI Key
GEMINI_API_KEY=<your-gemini-api-key>
GEMINI_MODEL=gemini-1.5-flash
```

---

## 3. Frontend Deployment on Vercel

### Step 1: Import Project
1. Log in to [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Select your Git repository.
4. Set the **Root Directory** to `frontend`.
5. Framework Preset: `Next.js` (automatically detected).

### Step 2: Configure Environment Variables
Add the following in Vercel project settings:

```ini
# Backend API Base URL (Pointing to your deployed Render service)
NEXT_PUBLIC_API_URL=https://jansetu-ai-backend.onrender.com/api/v1

# Supabase Public Integration (Optional)
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-supabase-publishable-key>
```

### Step 3: Deploy
- Click **Deploy**.
- Next.js will compile the 28 static/dynamic routes.
- Once deployed, copy your production Vercel URL and add it to `CORS_ORIGINS` in your Render backend configuration.

---

## 4. Verification & Health Monitoring

1. **Backend Health Check**:
   - Query `GET https://your-backend.onrender.com/api/v1/health`
   - Expect HTTP 200: `{"status": "ok"}` (actively tests `SELECT 1;` on Supabase).

2. **Automated Live Flow Verification**:
   - Run `python scripts/test_live_flows.py` against the deployed backend to verify all 4 official flows (Citizen intake, Department queue, Municipal Admin, Collector oversight).
