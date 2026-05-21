# 🚀 Deployment Guide

This guide walks through deploying **Accountant Hub** to a **100% free** production setup:

| Layer | Platform | Notes |
|---|---|---|
| Web (Next.js) | **Vercel** | Free forever, instant deploys from GitHub |
| API (Laravel) | **Render** | Free forever (sleeps when idle, ~50s cold-start), 750 hrs/month |
| Database | **SQLite** on Render's persistent disk | Zero-setup, demo data re-seeds on first boot |

No credit card required for any of this.

---

## ✅ Step 1 — Deploy the API to Render

The repository already includes [`render.yaml`](./render.yaml), so Render auto-configures the service with one click.

### 1.1 Sign up

1. Go to https://render.com
2. Click **Get Started** → **Sign up with GitHub** (no email setup needed)

### 1.2 Create the Blueprint

1. On the Render dashboard click the **`+ New`** button (top right) → **`Blueprint`**
2. Click **Connect a repository** → authorize Render to read your GitHub account
3. Select **`AliSalahNabil/Accountant-Hub`** → **Connect**
4. Render reads `render.yaml` and shows: **`accountant-hub-api`** as a Web Service. Click **Apply**.
5. Wait ~5–7 minutes for the first Docker build to finish. ☕

### 1.3 Set the FRONTEND_URL after Vercel is deployed

After you finish Step 2 (Vercel), come back here:
1. Open the API service in Render → **Environment** tab
2. Set **`FRONTEND_URL`** to your Vercel URL, e.g. `https://accountant-hub.vercel.app`
3. Set **`APP_URL`** to your Render URL, e.g. `https://accountant-hub-api.onrender.com`
4. Save — Render redeploys automatically.

### 1.4 Verify the API is live

Open: `https://<your-service>.onrender.com/api/v1/categories`

You should see JSON with 8 categories. The first request after a long idle period takes ~30-60s because the service wakes from sleep.

---

## ✅ Step 2 — Deploy the Web to Vercel

### 2.1 Sign up

1. Go to https://vercel.com
2. Click **Continue with GitHub**

### 2.2 Import the repository

1. Click **`Add New...`** → **`Project`**
2. Find **`Accountant-Hub`** → click **Import**
3. **Configure Project:**
   - **Root Directory:** `web`  ← click *Edit* and select `web`
   - **Framework Preset:** Next.js (auto-detected)
   - **Build / Output / Install:** leave at defaults

### 2.3 Set environment variables

Click **Environment Variables** and add:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://<your-render-service>.onrender.com/api/v1` |
| `NEXT_PUBLIC_APP_NAME` | `Accountant Hub` |

Replace `<your-render-service>` with the actual Render URL from Step 1.

### 2.4 Deploy

Click **Deploy**. Vercel builds and gives you a URL like `https://accountant-hub-xxx.vercel.app`.

### 2.5 Loop back to Render

Copy your Vercel URL and paste it as `FRONTEND_URL` on the Render service (see Step 1.3 above) so CORS allows it.

---

## ✅ Step 3 — Final Verification

1. Visit your Vercel URL. The landing page should load with seeded jobs.
2. Click **Browse jobs** → jobs listing loads with filters working.
3. Open any job → details load.
4. Sign in with `accountant@demo.com` / `password123`.
5. Submit a bid on any open job → success toast.
6. Open `/dashboard` → see your seeded bids + the one you just submitted.

If anything 401/403/CORS-errors, double-check `FRONTEND_URL` on Render matches your Vercel URL exactly (https included, no trailing slash).

---

## 🔧 Troubleshooting

### Render service won't start

- Check **Logs** tab on the Render service
- Common: missing `APP_KEY` — Render auto-generates this from `render.yaml`, but if not, run `php artisan key:generate --show` locally and paste the value

### "CORS error" in browser console

- Verify `FRONTEND_URL` env var on Render exactly matches your Vercel URL
- The `.vercel.app` pattern is already whitelisted in `api/config/cors.php`, so any *.vercel.app subdomain should work

### "401 Unauthenticated" when logging in

- Verify `NEXT_PUBLIC_API_URL` on Vercel ends with `/api/v1`
- Open the network tab and check that `POST /auth/login` goes to your Render API, not localhost

### First API call takes 30-60s

- Normal on Render's free tier — the service sleeps after 15 minutes of inactivity
- Stays warm afterwards for normal browsing

### Reseed data on Render

- Render's persistent disk keeps the SQLite file across deploys
- To force-re-seed: open the Render shell (paid feature) OR change the Dockerfile CMD to include `migrate:fresh --seed` temporarily, then revert

---

## 💰 Cost

| Service | Cost |
|---|---|
| Vercel hobby | **$0/month** forever (commercial use needs Pro plan) |
| Render free web service | **$0/month** forever (sleeps when idle) |
| Render 1 GB persistent disk | **$0/month** (free tier includes 1 GB) |
| SQLite | $0 (file on disk) |

After 90 days of zero traffic, Render may pause the service — just push a commit to wake it back up.

---

## 📦 Alternative: MySQL (if you want to match the spec literally)

If a reviewer specifically wants to see MySQL in production:

1. Sign up at **https://aiven.io** (1-month free trial, no credit card)
2. Create a MySQL service
3. On Render, swap these env vars:
   ```
   DB_CONNECTION=mysql
   DB_HOST=<from-aiven>
   DB_PORT=<from-aiven>
   DB_DATABASE=defaultdb
   DB_USERNAME=avnadmin
   DB_PASSWORD=<from-aiven>
   ```
4. Save → Render redeploys → migrations run against the new MySQL DB

The schema, queries, and Eloquent code are 100% MySQL-compatible — only the driver changes.
