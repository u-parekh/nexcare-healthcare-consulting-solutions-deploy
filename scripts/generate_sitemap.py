"""Regenerates frontend/public/sitemap.xml from the service and blog data files.
Usage: SITE_URL=https://nexcareconsulting.com python3 scripts/generate_sitemap.py"""
import os
import re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "frontend"
SITE = os.environ.get("SITE_URL", "https://nexcareconsulting.com").rstrip("/")
STATIC = ["/", "/about", "/services", "/projects", "/blog", "/career", "/assessment", "/contact", "/privacy-policy", "/sitemap"]


def slugs(file: str):
    text = (ROOT / "src" / "data" / file).read_text()
    return re.findall(r'^\s*slug: "([a-z0-9-]+)"', text, re.M)


urls = STATIC + [f"/services/{s}" for s in slugs("services.js")] + [f"/blog/{s}" for s in slugs("blog.js")]
today = date.today().isoformat()
body = "\n".join(f"  <url><loc>{SITE}{u}</loc><lastmod>{today}</lastmod></url>" for u in urls)
(ROOT / "public" / "sitemap.xml").write_text(
    f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{body}\n</urlset>\n')
print(f"wrote {len(urls)} urls")
