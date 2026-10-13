import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="h-11 w-11">
      <AnimatePresence>
        {visible && (
          <motion.button
            initial={{ opacity: 0, y: 16, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-testid="back-to-top" aria-label="Back to top"
            className="grid place-items-center w-11 h-11 rounded-full bg-gradient-to-br from-[#0E4A8A] to-[#2E8B3A] dark:from-[#4A90E2] dark:to-[#3FB549] text-white border-2 border-white dark:border-background shadow-[0_10px_28px_-6px_rgba(14,74,138,0.55)] hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-6px_rgba(14,74,138,0.7)] active:translate-y-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40 transition-[transform,box-shadow] duration-200"
          >
            <ArrowUp className="w-5 h-5" strokeWidth={2.5} aria-hidden />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BackToTop;
