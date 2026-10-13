import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Chatbot from "./Chatbot";
import CookieBanner from "./CookieBanner";
import BackToTop from "./BackToTop";
import { useVisitTracking } from "../lib/tracking";

const Layout = () => {
  const { pathname, hash } = useLocation();
  useVisitTracking(pathname);

  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" }), 80);
      return () => clearTimeout(t);
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand focus:text-white focus:rounded-md">Skip to content</a>
      <Navbar />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <div className="floating-controls fixed right-4 sm:right-6 z-50 flex flex-col items-end gap-4" data-testid="floating-controls">
        <Chatbot />
        <BackToTop />
      </div>
      <CookieBanner />
    </div>
  );
};

export default Layout;
