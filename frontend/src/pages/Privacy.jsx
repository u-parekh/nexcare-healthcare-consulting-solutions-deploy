import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import Breadcrumbs, { breadcrumbLd } from "../components/Breadcrumbs";
import { OPEN_PREFS_EVENT } from "../lib/consent";

const UPDATED = "10 October 2026";
const crumbs = [{ to: "/", label: "Home" }, { to: "/privacy-policy", label: "Privacy Policy" }];

const S = ({ id, title, children }) => (
  <section id={id} className="scroll-mt-24"><h2>{title}</h2>{children}</section>
);

const Privacy = () => (
  <div data-testid="privacy-page">
    <Seo title="Privacy Policy" path="/privacy-policy" jsonLd={breadcrumbLd(crumbs)}
      description="How NEXCARE collects, uses, stores and protects personal information submitted through our website, contact form and assessment." />
    <section className="relative border-b border-border py-16 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="relative max-w-3xl mx-auto px-6">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl mt-8">Privacy Policy</h1>
        <p className="mt-3 text-muted-foreground">Last updated: {UPDATED}</p>
      </div>
    </section>
    <div className="max-w-3xl mx-auto px-6 py-14 prose-nx">
      <p>This policy explains how Nexcare Healthcare Consulting Solutions("Nexcare", "we", "us") handles personal information collected through this website. It describes what the website actually collects today, and separately notes data that would only be collected if a specific optional feature is enabled.</p>

      <S id="collect" title="1. Information we collect">
        <h3>Contact form</h3>
        <p>When you submit an Inquiry we collect your full name, email address, phone number, the service you select and your message. A one-way pseudonymised hash of your IP address is stored with the inquiry for abuse prevention; the raw IP address is not stored.</p>
        <h3>Assessment</h3>
        <p>When you take the assessment we collect your answers, your recommended services, and the full name, email address and phone number you provide after question five, along with device type (desktop, mobile or tablet) and a pseudonymised IP hash.</p>
        <h3>Security and request logs</h3>
        <p>Our servers process your IP address transiently to apply rate limits, verify human-verification (CAPTCHA) responses and protect the site. Hosting infrastructure may keep standard request logs for security and reliability.</p>
        <h3>Analytics (only with your consent)</h3>
        <p>If you accept analytics cookies, we record pages visited, a random visitor identifier stored in your browser, referrer, device type, browser family, time on page and approximate country/region. Approximate location is derived from your IP address via a third-party IP lookup service at the time of the visit; the IP address itself is not stored. If you choose "Essential only", none of this is recorded.</p>
        <h3>Admin access</h3>
        <p>For authorised administrators only, we store login session records and an audit log of administrative actions.</p>
      </S>

      <S id="cookies" title="2. Cookies and browser storage">
        <ul>
          <li><strong>Essential:</strong> theme preference, your consent choice, assessment progress (session storage) and, for administrators, a secure httpOnly session cookie.</li>
          <li><strong>Analytics (optional):</strong> a random visitor ID in local storage and, if enabled by the site operator, product analytics scripts loaded only after consent.</li>
        </ul>
        <p>You can change your choice at any time: <button type="button" className="text-brand underline underline-offset-2" onClick={() => window.dispatchEvent(new Event(OPEN_PREFS_EVENT))} data-testid="privacy-cookie-prefs">open cookie preferences</button>.</p>
        <p>Google reCAPTCHA, used on our forms, may set its own cookies and process device information when the forms are displayed, subject to Google's Privacy Policy and Terms.</p>
      </S>

      <S id="purposes" title="3. Why we use your information">
        <ul>
          <li>To respond to inquiries and provide requested information or consultations.</li>
          <li>To send an acknowledgement email and notify our team of new inquiries.</li>
          <li>To provide assessment recommendations and follow up if you request it.</li>
          <li>To protect the website against spam, abuse and unauthorised access.</li>
          <li>To understand aggregate website usage, only where you have consented.</li>
        </ul>
      </S>

      <S id="providers" title="4. Service providers">
        <ul>
          <li><strong>MongoDB</strong> database hosting — stores inquiries, assessments and analytics records.</li>
          <li><strong>Resend</strong> — sends acknowledgement and notification emails (when configured).</li>
          <li><strong>n8n</strong> — workflow automation that may receive inquiry details for internal processing (when configured).</li>
          <li><strong>Google reCAPTCHA</strong> — human verification on forms.</li>
          <li><strong>IP geolocation lookup (ipapi.co)</strong> — approximate country/region for consented analytics visits.</li>
          <li><strong>Hosting provider</strong> — serves the website and API.</li>
        </ul>
        <p>We do not sell personal information.</p>
      </S>

      <S id="retention" title="5. Retention and deletion">
        <p>Inquiries and assessments are retained for as long as needed to respond and maintain a business relationship, and are deleted by an administrator when no longer required or on a valid request. Admin sessions expire automatically after 8 hours. Analytics records are retained in aggregate form for trend reporting.</p>
      </S>

      <S id="security" title="6. Security">
        <p>We use HTTPS, server-side validation, rate limiting, CAPTCHA verification, hashed admin passwords, httpOnly session cookies, role-restricted admin APIs and audit logging. No method of transmission or storage is completely secure, but we work to protect your information.</p>
      </S>

      <S id="rights" title="7. Your rights and requests">
        <p>Subject to applicable law, including India's Digital Personal Data Protection Act, 2023 as and when its provisions apply, you may request access to, correction of, or deletion of your personal information, or withdraw consent. Email <a href="mailto:info@nexcareconsulting.com">info@nexcareconsulting.com</a> with the subject "Privacy request". We may need to verify your identity before acting on a request.</p>
      </S>

      <S id="contact" title="8. Contact">
        <p>Nexcare Healthcare Consulting — Email: <a href="mailto:info@nexcareconsulting.com">info@nexcareconsulting.com</a>, Phone: +91 9664662760. You can also reach us through our <Link to="/contact">contact page</Link>.</p>
      </S>

      <S id="law" title="9. Governing law and changes">
        <p>This policy is governed by the laws of India. We may update it as our services or legal requirements change; the "last updated" date above reflects the latest version. This policy is provided for transparency and should be reviewed by the company for applicability to its actual operations.</p>
      </S>
    </div>
  </div>
);

export default Privacy;
