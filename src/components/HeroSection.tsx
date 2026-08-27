import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import heroBgImg from "@/assets/bengaluru_carrara.png";
import dayVideo from "@/assets/jointlly-day-theme.mp4";
import nightVideo from "@/assets/jointlly-night-theme.mp4";

const HeroSection = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const bgVideo = isDark ? nightVideo : dayVideo;

  return (
    <section className="hero-redesigned relative min-h-screen overflow-hidden flex flex-col bg-black">
      {/* ── Navbar overlays the hero ── */}
      <Navbar variant="hero" />

      {/* ── Background Video Layer (absolute, starts at top:0) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {mounted ? (
          <video
            key={isDark ? "dark" : "light"}
            src={bgVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center scale-[1.02]"
          />
        ) : (
          <img
            src={heroBgImg}
            alt="Bengaluru Carrara Hero Background"
            className="w-full h-full object-cover object-center scale-[1.02]"
          />
        )}
        {/* Subtle atmospheric overlay */}
        <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />
        {/* Top gradient for navbar blending */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/20 to-transparent" />
        {/* Bottom gradient for section transition */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background/80 via-background/30 to-transparent" />
      </div>

      {/* ── Hero Content (relative, z-10, padded below navbar) ── */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 text-center pt-28 sm:pt-32 md:pt-36">
        {/* Pre-headline tagline */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="hero-pre-headline font-sans text-sm sm:text-base md:text-lg tracking-[0.35em] sm:tracking-[0.45em] uppercase mb-6 sm:mb-8"
        >
          Building Trust. Creating Value.
        </motion.p>

        {/* Decorative divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex items-center gap-3 mb-6 sm:mb-8"
        >
          <span className="block w-12 sm:w-16 md:w-20 h-[1px] bg-white/50" />
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C9952A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-90"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
          <span className="block w-12 sm:w-16 md:w-20 h-[1px] bg-white/50" />
        </motion.div>

        {/* Main headline — JOINTLLY */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
          className="hero-main-title font-times text-[3.2rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem] xl:text-[9.5rem] font-light tracking-[0.18em] sm:tracking-[0.22em] md:tracking-[0.28em] leading-[0.9] mb-6 sm:mb-8 select-none"
        >
          <span className="hero-main-title-text">JOINT</span>
          <span className="hero-main-title-accent">L</span>
          <span className="hero-main-title-text">LY</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="hero-sub-headline font-sans text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto mb-8 sm:mb-10 px-4"
        >
          A neutral decision platform connecting landowners, builders, and professionals
          <br className="hidden sm:block" />
          to build{" "}
          <span className="hero-highlight-word">transparent</span>,{" "}
          <span className="hero-highlight-word">efficient</span>, and{" "}
          <span className="hero-highlight-word">future-ready</span>{" "}
          real estate partnerships.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
        >
          <a
            href="/products"
            className="hero-cta-btn group inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-medium tracking-wide uppercase transition-all duration-300"
          >
            Explore Platform
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
