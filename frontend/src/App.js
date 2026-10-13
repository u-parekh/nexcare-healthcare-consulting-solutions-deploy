import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/ThemeProvider";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Career from "./pages/Career";
import Contact from "./pages/Contact";
import Quiz from "./pages/Quiz";
import Privacy from "./pages/Privacy";
import SitemapPage from "./pages/SitemapPage";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";

function App() {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/vision" element={<Navigate to="/about#vision" replace />} />
                {/*<Route path="/projects" element={<Projects />} />*/}
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/career" element={<Career />} />
                <Route path="/careers" element={<Navigate to="/career" replace />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/assessment" element={<Quiz />} />
                <Route path="/privacy-policy" element={<Privacy />} />
                <Route path="/sitemap" element={<SitemapPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </BrowserRouter>
          <Toaster richColors position="top-right" />
        </div>
      </MotionConfig>
    </ThemeProvider>
  );
}

export default App;
