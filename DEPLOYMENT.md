# Deployment Guide

The recommended deployment is **Vercel (web) + Railway (api + MySQL)**.
Both have generous free tiers and integrate with GitHub.

---

## 1. Push to GitHub

```bash
# From the repo root
git init
git add .
git commit -m "Initial commit: Accountant Hub"
git branch -M main
git remote add origin https://github.com/<your-username>/accountant-hub.git
git push -u origin main
```

---

## 2. Deploy the API to Railway

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**.
2. Pick your repo and set the **Root Directory** to `api`.
3. Add a **MySQL** service to the same project (Railway dashboard → **+ New** → **Database** → **MySQL**).
4. Railway will auto-detect the Laravel project. Set the following **environment variables** on the API service:

   ```env
   APP_NAME="Accountant Hub"
   APP_ENV=production
   APP_DEBUG=false
   APP_KEY=                # Use: `php artisan key:generate --show` locally and paste here
   APP_URL=https://<your-api>.up.railway.app
   FRONTEND_URL=https://<your-web>.vercel.app

   LOG_CHANNEL=stderr
   LOG_LEVEL=info

   DB_CONNECTION=mysql
   DB_HOST=${{MySQL.MYSQLHOST}}
   DB_PORT=${{MySQL.MYSQLPORT}}
   DB_DATABASE=${{MySQL.MYSQLDATABASE}}
   DB_USERNAME=${{MySQL.MYSQLUSER}}
   DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}

   SESSION_DRIVER=database
   SANCTUM_STATEFUL_DOMAINS=<your-web>.vercel.app
   SESSION_DOMAIN=.vercel.app

   CACHE_STORE=database
   QUEUE_CONNECTION=sync
   ```

5. Add a **Custom start command** so the migrations run on every deploy:

   ```sh
   php artisan migrate --force --no-interaction && php artisan db:seed --force --no-interaction && php artisan serve --host=0.0.0.0 --port=$PORT
   ```

   > After the first successful deploy, drop the `db:seed` part so you don't reset demo data.

6. Wait for the deploy → grab the public URL (e.g. `https://accountant-hub-api.up.railway.app`).

---

## 3. Deploy the Web to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → import the same repo.
2. Set the **Root Directory** to `web`.
3. **Build & Output Settings:** Vercel detects Next.js automatically. No changes needed.
4. Add the **environment variable**:

   ```env
   NEXT_PUBLIC_API_URL=https://<your-api>.up.railway.app/api/v1
   NEXT_PUBLIC_APP_NAME=Accountant Hub
   ```

5. Deploy. Once live, copy the Vercel URL (e.g. `https://accountant-hub.vercel.app`).

---

## 4. Wire CORS & Sanctum

Back on the Railway API service, update **`FRONTEND_URL`** and **`SANCTUM_STATEFUL_DOMAINS`** to match your real Vercel URL, then redeploy.

The CORS config in [`api/config/cors.php`](./api/config/cors.php) already:
- Allows `FRONTEND_URL`, `localhost:3000`, and any `*.vercel.app`
- Allows credentials so cookies/auth headers work

---

## 5. Verify

1. Visit `https://<your-web>.vercel.app` → home page loads with seeded jobs.
2. Browse `/jobs` → list, filter, search all work.
3. Open a job → details load.
4. Sign in with `accountant@demo.com / password123` → dashboard shows your seeded bids.
5. Submit a new bid → success.

---

## Alternative platforms

- **Render / Fly.io / DigitalOcean App Platform** all work for the Laravel API with similar env vars.
- **Netlify** works for the Next.js app as a Vercel alternative.
- **PlanetScale / Aiven / Neon** work for MySQL if you'd rather host the DB separately.
