export const SITE_URL = (process.env.REACT_APP_SITE_URL || "").replace(/\/+$/, "");
const DEFAULT_IMG = "/images/hero-hospital-planning.webp";

export const Seo = ({ title, description, path = "/", image = DEFAULT_IMG, type = "website", noindex = false, jsonLd, keywords }) => {
  const url = `${SITE_URL}${path}`;
  const img = image.startsWith("http") ? image : `${SITE_URL}${image}`;
  const fullTitle = title.includes("NEXCARE") ? title : `${title} | NEXCARE`;
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords.join(", ")} />}
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Nexcare Healthcare Consulting" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
    </>
  );
};

export default Seo;
