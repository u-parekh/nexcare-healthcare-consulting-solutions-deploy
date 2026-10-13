# Resend + reCAPTCHA setup (contact confirmation)

## Flow
Visitor submits form → backend validates fields → verifies the reCAPTCHA v2 checkbox token (server-side, hostname check) → de-duplicates identical submissions (same email + message within 15 min) → saves to MongoDB `contacts` → emits Resend event `contact.inquiry` → Resend Automation sends the published confirmation template. The backend also sends a company notification email directly to `CONTACT_NOTIFICATION_EMAIL`.

Delivery status is stored per inquiry in `delivery.acknowledgement` (`event_accepted` / `failed` / `not_configured`) and `delivery.notification` (`sent` / `failed`). `event_accepted` means Resend accepted the event — it does not prove the email was delivered (check Resend → Emails). Admins can retry failed channels from the inquiry dialog; channels that already succeeded are skipped, so retries never duplicate confirmations.

Event sent by `backend/notifications.py → trigger_confirmation()`:
```json
{"event": "contact.inquiry", "email": "<visitor email>", "payload": {"name": "...", "email": "...", "message": "..."}}
```
Payload values are HTML-escaped by the backend because the template uses unescaped `{{{triple-brace}}}` variables.

## Status checked on 2026-10-10 (read-only, via the Resend API)
| Item | Status |
|---|---|
| Domain `nexcareconsulting.com` | verified |
| Event `contact.inquiry` | exists |
| Template "Inquiry Confirmation" | published, but **no variables declared**; subject is "Inquiry Confirmation " |
| Automation "Nexcare" | enabled; trigger `contact.inquiry` → send email with that template; from `Nexcare Healthcare Consulting<info@nexcareconsulting.com>`; **no subject override, no variable mapping** |
| Test event | accepted; email delivered to the test inbox, but **name/email/message rendered empty** ("Hello ,") |

## Required dashboard fixes
1. Resend → Templates → "Inquiry Confirmation" → Variables: add `name`, `email`, `message` (type string). In the HTML use `{{{name}}}`, `{{{email}}}`, `{{{message}}}`. Set subject `We received your inquiry | Nexcare`. Click **Publish**.
2. Resend → Automations → "Nexcare" → Send Email step: template = the published "Inquiry Confirmation"; From = `Nexcare <info@nexcareconsulting.com>`; Subject = `We received your inquiry | Nexcare`; map variables `name → event.name`, `email → event.email`, `message → event.message`. Save, keep the automation **enabled**.
3. Disable or delete the unused "Untitled Automation" copies so they never fire on the same event.
4. Submit a test inquiry on the live site and confirm in Resend → Emails that the message shows the visitor's name and message.

## reCAPTCHA (v2 checkbox)
The form shows Google's "I'm not a robot" checkbox. Put the **site key** in `frontend/.env` (`REACT_APP_RECAPTCHA_SITE_KEY`) and the **secret key** in `backend/.env` (`RECAPTCHA_SECRET_KEY`). In https://www.google.com/recaptcha/admin add the domains `nexcareconsulting.com`, `www.nexcareconsulting.com` and `localhost`, and keep `RECAPTCHA_ALLOWED_HOSTNAMES` in the backend environment in sync. If the backend log shows `invalid-input-secret`, the secret does not match the site key.

## Secrets
The Resend API key, reCAPTCHA secret and MongoDB URI were shared in chat. Rotate them (Resend → API Keys; reCAPTCHA admin → regenerate; Atlas → Database Access → edit password), then set the new values only in the hosting provider's secret settings: `RESEND_API_KEY`, `RECAPTCHA_SECRET_KEY`, `MONGO_URL`, `DB_NAME`.
