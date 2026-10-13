import { motion } from "framer-motion";

const VARIANTS = {
  up: { hidden: { opacity: 0, y: 36 }, show: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -36 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 36 }, show: { opacity: 1, x: 0 } },
  zoom: { hidden: { opacity: 0, scale: 0.94 }, show: { opacity: 1, scale: 1 } },
};

// Scroll-triggered entrance; plays once. MotionConfig reducedMotion="user" disables transforms when requested.
export const Reveal = ({ as = "div", dir = "up", delay = 0, className = "", children, ...rest }) => {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={VARIANTS[dir]} initial="hidden" whileInView="show"
      viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} {...rest}>
      {children}
    </Comp>
  );
};

export default Reveal;
