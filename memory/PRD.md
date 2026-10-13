# NEXCARE — Product Requirements

## Original problem statement
Update the existing project provided in `nexcare-main-updated-new-main.zip` (full brief supplied by the customer, 20 sections): preserve design/typography/colours; dark-mode logo swap; stronger hero animations + NexCare 3D logo centrepiece with floating healthcare icons; brochure download; Framer Motion scroll animations; services (3 new first: MRD/Medical Record Digitization, Surgical & Biomedical Equipment + Outsourced Pharmacy, Hospital Website Development & Digital Planning) with dedicated pages; How We Work horizontal scroll-progress line; 6 testimonials carousel (10s, prev/next, no images, no fabricated quotes); SEO FAQ; chatbot above back-to-top with options + "exit"; footer sitemap/privacy; About+Vision merge with Dr. Het Limbachiya profile (flag date overlaps); featured supplied article + 4 SEO blogs; careers (no invented vacancies); contact form with strict validation, CAPTCHA, MongoDB, Resend (info@nexcareconsulting.com → umangparekh99@gmail.com), n8n; assessment contact form after 5 questions; secure /admin with real analytics, CRUD, filters, pagination, xlsx export, audit; cookie consent + privacy policy; SEO (metadata, robots, sitemap, structured data); security, CI/CD, docs; deliver `nexcare-main-updated.zip`.

User choices: Google reCAPTCHA; own Resend key (later); n8n URL/secret later via env; keep Het dates as supplied and flag; stock/AI visuals + CSS/Framer 3D logo (no new 3D libs).

## Architecture
- Frontend: React 19 (CRA/craco), Tailwind, shadcn/ui, Framer Motion, embla, recharts. Data in `src/data/*` (services, blog, faqs, testimonials). SEO via `components/Seo.jsx` (React 19 metadata hoisting).
- Backend: FastAPI under `/api` — `server.py` (public), `admin_routes.py`, `auth.py`, `validators.py`, `notifications.py` (Resend + n8n HMAC), `core.py` (db, rate limit, captcha, geo).
- MongoDB collections: contacts, quiz_submissions, visits, heartbeats, brochure_downloads, admin_users, admin_sessions (TTL), login_attempts, audit_log.

## User personas
Hospital promoters/owners, hospital administrators & quality managers, clinic owners, NEXCARE admin team.

## Implemented (2026-10-10)
- All public pages + 10 service detail pages + 5 blog posts, breadcrumbs, prev/next nav, 404, /vision → /about#vision
- Hero centrepiece, particle field, scroll reveals, reduced-motion support
- Contact + assessment with client/server validation, reCAPTCHA (server-verified), honeypot, rate limiting, delivery status tracking + admin retry
- Admin: JWT httpOnly session, CSRF header, lockout, analytics, records CRUD/filter/pagination, xlsx export (formula-safe), audit log
- Consent-gated analytics (incl. PostHog snippet), privacy policy, sitemap page/xml, robots.txt, JSON-LD
- README, .env.example files, CI workflow, backend unit tests

## Backlog
- P0: Add Resend API key + verify domain; set n8n URL/secret; replace reCAPTCHA test keys with production keys; rotate admin password (use ADMIN_PASSWORD_HASH)
- P1: Replace draft testimonials with approved quotes; confirm Het dates; real team photos; confirm canonical domain (REACT_APP_SITE_URL)
- P2: Prerendering for SEO; Redis-backed rate limit for multi-instance; Resend delivery webhooks

## Next tasks
Configure external credentials, then retest email/n8n delivery end-to-end.
