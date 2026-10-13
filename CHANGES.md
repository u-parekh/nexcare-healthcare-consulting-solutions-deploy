# Change summary — 2026-10-10

## Implemented
- Home: dark-mode logo (`public/images/logo-dark.webp`), stronger blue/green hero glow + particle network, 3D NEXCARE emblem centrepiece with floating healthcare icons, brochure download, 10 service cards (3 new first) with gradient borders + "Explore Service", "Explore All Services", How We Work horizontal (desktop) / vertical (mobile) scroll-progress line, 6-slide testimonial carousel (10s autoplay, prev/next/pause/dots; DRAFT placeholders), FAQ accordion + FAQPage JSON-LD.
- Services: overview + 10 detail pages (hero image, scope, benefits, use cases, process, related, prev/next, breadcrumbs, inquiry CTA that pre-selects service).
- About: merged Vision content (all original sections kept), mission/values/expertise, section sub-nav, Dr. Het Limbachiya text profile + skill tags. `/vision` redirects to `/about#vision`.
- Blog: supplied article reproduced from the .docx; 4 original SEO articles; Article/Breadcrumb JSON-LD; prev/next; related; pagination-ready list.
- Careers: startup positioning, expression-of-interest CTA (no vacancies).
- Contact & Assessment: validation (frontend + backend), reCAPTCHA v2 server verification, honeypot, rate limits, MongoDB persistence, Resend acknowledgement + notification templates, n8n HMAC webhook with retries, honest delivery status.
- Admin (/admin): secure login, analytics (consented visits), inquiries/assessments management, filters, server-side pagination, xlsx export, audit log, logout.
- Cookie consent (essential/analytics), privacy policy, sitemap page, robots.txt, sitemap.xml, per-page SEO metadata.
- Chatbot: 8 options, free text, "exit", end + restart; positioned above back-to-top; floating controls lift above cookie banner on mobile.

## Key files
Backend: server.py, core.py, auth.py, admin_routes.py, validators.py, notifications.py, tests/test_validation.py, .env.example
Frontend: App.js, index.css, public/index.html, public/robots.txt, public/sitemap.xml, public/brochure/*, public/images/*, src/data/*, src/lib/{api,validation,consent,tracking}.js, src/components/{Seo,Reveal,Breadcrumbs,Recaptcha,FormField,ServiceCard,Chatbot,CookieBanner,BackToTop,Layout,Navbar,Footer,LogoMark,HeroParticles}.jsx, src/components/home/*, src/components/admin/*, src/pages/*
Other: README.md, scripts/generate_sitemap.py, .github/workflows/ci.yml

## Test results
- Backend: 27/27 automated API tests passed (testing agent) + 12 unit tests passed.
- Frontend: all public routes, theme logos, carousel, FAQ, chatbot exit/restart, cookie flows, admin flows, 390px no overflow verified. Contact and assessment submitted end-to-end via UI with reCAPTCHA test widget.
- Production build passes; no source maps; no secrets found in bundle.

## Outstanding setup
Resend key + verified domain, n8n URL/secret, production reCAPTCHA keys, admin password rotation, approved testimonials, confirmation of overlapping Het dates, real team photos, canonical domain confirmation.

# Change summary - 2026-10-11
- reCAPTCHA switched from v3 to v2 "I'm not a robot" checkbox (frontend `Recaptcha.jsx`, backend `core.verify_captcha`); v3 score/action code, `RECAPTCHA_MIN_SCORE` and the badge-hiding CSS removed; checkbox is scaled to fit narrow screens and follows light/dark theme.
- Light-mode logo replaced with the supplied full-colour logo (`public/logo.png`, transparent margins trimmed, ratio unchanged); dark-mode logo untouched.
- Favicons replaced from the supplied ZIP (ICO, 96px PNG, Apple touch icon, 192/512 manifest icons); `site.webmanifest` names set to NEXCARE; the supplied `favicon.svg` (3.3 MB, two embedded 1254 px PNGs rather than real vector art) is shipped but not linked in `index.html`; re-export a true vector SVG and add `<link rel="icon" type="image/svg+xml" href="/favicon.svg">` to use it.
- Home testimonials: six cards without photos, autoplay every 4 s, previous/next, dots, pause on hover/focus/touch; unapproved entries are labelled as drafts.

