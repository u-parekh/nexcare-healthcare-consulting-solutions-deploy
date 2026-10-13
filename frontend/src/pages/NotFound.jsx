import { Link } from "react-router-dom";
import Seo from "../components/Seo";

const NotFound = () => (
  <section className="min-h-[60vh] grid place-items-center px-6 py-24 text-center" data-testid="not-found">
    <Seo title="Page not found" description="The page you are looking for does not exist." path="/404" noindex />
    <div>
      <p className="font-display font-extrabold text-7xl text-brand">404</p>
      <h1 className="font-display font-bold text-2xl mt-4">This page doesn't exist.</h1>
      <p className="text-muted-foreground mt-2">Try the homepage or browse the sitemap.</p>
      <div className="mt-6 flex gap-3 justify-center">
        <Link to="/" className="px-5 py-3 bg-brand text-white rounded-md font-semibold">Go home</Link>
        <Link to="/sitemap" className="px-5 py-3 border border-border rounded-md font-semibold hover:border-brand">Sitemap</Link>
      </div>
    </div>
  </section>
);

export default NotFound;
