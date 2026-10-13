# NEXCARE — Healthcare Consulting Website

React 19 (CRA + craco, Tailwind, shadcn/ui, Framer Motion) frontend and FastAPI + MongoDB backend.

## Runtime versions
- Node.js 20, Yarn 1.22 (do not use npm)
- Python 3.11, MongoDB 6+

## Install & run (development)
```bash
cd backend && pip install -r requirements.txt && cp .env.example .env   # fill values
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
cd frontend && yarn install && cp .env.example .env && yarn start
```
All backend routes are served under `/api`. The frontend calls `${REACT_APP_BACKEND_URL}/api`.

## Deploy (Vercel + Render + MongoDB Atlas)
1. **Atlas**: M0 cluster, DB user (readWrite on one DB), Network Access `0.0.0.0/0`, copy the `mongodb+srv://` URL.
2. **Render** (backend): Root `backend`, build `pip install -r requirements.txt`, start `uvicorn server:app --host 0.0.0.0 --port $PORT`, health check `/api/health`, `PYTHON_VERSION=3.11.9`; env vars as in `render.yaml` / `backend/.env.example`. One worker only on the free plan.
3. **Vercel** (frontend): Root `frontend`, install `npm install`, build `npm run build`, output `build`. Env: `REACT_APP_RECAPTCHA_SITE_KEY`, `REACT_APP_SITE_URL`, `GENERATE_SOURCEMAP=false`. Leave `REACT_APP_BACKEND_URL` **unset**.
4. Edit `frontend/vercel.json`: replace `YOUR-RENDER-SERVICE` with the real Render hostname. `/api/*` is proxied to Render, so the browser only talks to the Vercel domain (no CORS issues, first-party admin cookie).
5. Set `CORS_ORIGINS`, `APP_BASE_URL`, `RECAPTCHA_ALLOWED_HOSTNAMES` to the final domain(s); add the domain in the reCAPTCHA admin; verify the sending domain in Resend.
6. Render's free tier sleeps after ~15 min idle; ping `https://<domain>/api/health` every 5 min (e.g. UptimeRobot) or use a paid instance.

## Production build
```bash
cd frontend && GENERATE_SOURCEMAP=false yarn build   # static files in frontend/build
cd backend && uvicorn server:app --host 0.0.0.0 --port 8001 --workers 2
```
Serve `frontend/build` behind a CDN with long cache headers for `/static/*` and `/images/*`, and an SPA fallback to `index.html`.

## Environment variables
Backend (`backend/.env`, see `.env.example`):
| Variable | Purpose |
|---|---|
| MONGO_URL, DB_NAME | MongoDB connection (server-side only) |
| CORS_ORIGINS | Comma-separated allowed frontend origins (no `*`) |
| APP_BASE_URL | Public site URL |
| JWT_SECRET | Admin session signing secret (64 hex chars) |
| IP_HASH_SALT | Salt for pseudonymising IPs |
| ADMIN_USERNAME | Admin username |
| ADMIN_PASSWORD_HASH | bcrypt hash (preferred in production) |
| ADMIN_PASSWORD | Bootstrap plain password (dev only; hashed at startup; leave empty when hash is set) |
| RESEND_API_KEY | Resend API key (server only) |
| RESEND_FROM_EMAIL | Sender for the company notification email, e.g. `Nexcare <info@nexcareconsulting.com>` |
| CONTACT_NOTIFICATION_EMAIL | Company inbox for inquiry notifications |
| N8N_WEBHOOK_URL, N8N_WEBHOOK_SECRET | Optional generic n8n webhook (not used for confirmation emails) |
| RECAPTCHA_SECRET_KEY | Google reCAPTCHA v2 (checkbox) secret key - server only |
| RECAPTCHA_ALLOWED_HOSTNAMES | Comma-separated hostnames accepted in siteverify responses (include `localhost` for local dev) |
| GEO_LOOKUP_ENABLED | `true` to derive approximate country for consented visits |

Frontend (`frontend/.env`): `REACT_APP_BACKEND_URL`, `REACT_APP_RECAPTCHA_SITE_KEY`, `REACT_APP_SITE_URL` (canonical URL used for SEO), `GENERATE_SOURCEMAP=false`.

## MongoDB
Collections: `contacts`, `quiz_submissions` (assessments), `visits`, `heartbeats`, `brochure_downloads`, `admin_users`, `admin_sessions` (TTL), `login_attempts`, `audit_log`. Indexes are created automatically at startup (`server.py` → `startup`). Use a database user with readWrite on this database only; never enable public network access.

## Resend (confirmation via Events + Automations)
The visitor confirmation is sent by a Resend Automation triggered by the backend event `contact.inquiry` (resend Python SDK 2.49.1, `resend.Events.send`). Full setup, the current dashboard status and required fixes are in `docs/RESEND_SETUP.md`.

## n8n (optional)
If `N8N_WEBHOOK_URL` and `N8N_WEBHOOK_SECRET` are set, the backend also posts `contact.created` with headers `X-NexCare-Timestamp` and `X-NexCare-Signature: sha256=<HMAC_SHA256(secret, "<timestamp>.<raw body>")>`. It is not used for confirmation emails.

## reCAPTCHA
The site uses Google reCAPTCHA **v2 - "I'm not a robot" checkbox** on the contact form and the assessment form. The frontend shows the checkbox (`REACT_APP_RECAPTCHA_SITE_KEY`, public) and sends its token with the form. The backend verifies the token with Google using `RECAPTCHA_SECRET_KEY` (server only), and rejects missing, invalid, expired or reused tokens with a clear message. The checkbox resets after every failed or completed submission because a v2 token works only once.

In https://www.google.com/recaptcha/admin open the key's **Domains** and add `nexcareconsulting.com`, `www.nexcareconsulting.com` and `localhost` (development). The key type must be **reCAPTCHA v2 - "I'm not a robot" Checkbox**.

## Admin provisioning & password rotation
Generate a hash: `python -c "import bcrypt;print(bcrypt.hashpw(b'NEW_PASSWORD', bcrypt.gensalt(12)).decode())"`, set `ADMIN_PASSWORD_HASH`, clear `ADMIN_PASSWORD`, restart. The seed updates the stored hash. Rotate the supplied bootstrap password before going live. Sessions last 8 hours; logout revokes the session server-side.

## Security notes
httpOnly SameSite=Strict session cookie scoped to `/api`; CSRF header check on admin mutations; login lockout; in-memory rate limits (per process — use a shared store such as Redis if running multiple instances); 64 KB request limit; security headers; regex-escaped searches; Excel formula-injection escaping; raw IPs never stored.

## SEO
Per-page title/description/canonical/OG via `src/components/Seo.jsx` (React 19 metadata hoisting). JSON-LD: Organization (index.html), WebSite + FAQPage (home), BreadcrumbList, Service, Article. `public/robots.txt` and `public/sitemap.xml` — regenerate with `SITE_URL=https://nexcareconsulting.com python3 scripts/generate_sitemap.py` after adding services/posts. This is a client-rendered SPA; consider prerendering for best crawler coverage.

## Testing
```bash
cd backend && python -m pytest -q tests
cd frontend && npx eslint src --ext .js,.jsx && yarn build
```
CI: `.github/workflows/ci.yml`. Configure deployment to run only after CI passes; store secrets in the hosting platform's secret settings, separately for development and production.

## Backups & recovery
Enable automated MongoDB backups (Atlas continuous backup or daily `mongodump --uri "$MONGO_URL" --archive=nexcare-$(date +%F).gz --gzip`). Restore with `mongorestore --gzip --archive=<file>`. Test a restore quarterly. Rollback the app by redeploying the previous Git tag.

## Known limitations / pending setup
- Resend template variables/automation mapping need the dashboard fixes in `docs/RESEND_SETUP.md`.
- The reCAPTCHA v2 key must list every serving domain (production and `localhost`).
- Production MongoDB (`MONGO_URL`/`DB_NAME`) must be set in the hosting provider's secrets.
- No verified testimonials yet; the section shows a feedback request.
- Team photos on the About page are stock images from the original project.
- Dr. Het Limbachiya's employment dates overlap and need confirmation before publication.
