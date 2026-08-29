import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Compass, BarChart3, Lock, FileText, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import aerialUrbanDevelopmentImg from "@/assets/pillars/aerial_urban_development.jpeg";
import analyzingLandParcelImg from "@/assets/pillars/analyzing_land_parcel.jpeg";
import modernMixedUseImg from "@/assets/pillars/modern_mixed_use.jpeg";
import undevelopedUrbanLandImg from "@/assets/pillars/undeveloped_urban_land.jpeg";

const pillars = [
  {
    icon: Compass,
    title: "Neutral Discovery",
    tag: "Unbiased Matching",
    description:
      "Structured profiles of builders and developers built entirely on verified project histories and market-visible execution records, with zero paid ads or sponsored listings.",
    image: modernMixedUseImg,
    imageAlt: "Modern mixed-use development transaction",
  },
  {
    icon: BarChart3,
    title: "Decision Enablement",
    tag: "Technical Analytics",
    description:
      "Empowering landowners to compare project scales, blueprint specifications, and builder bids under a standardized analytical matrix.",
    image: analyzingLandParcelImg,
    imageAlt: "Analyzing land parcel for development",
  },
  {
    icon: Lock,
    title: "Structured Contract Governance",
    tag: "Legal Security",
    description:
      "Standardized joint-venture and construction contract frameworks that protect both landowners and builders with transparent, enforceable terms.",
    image: undevelopedUrbanLandImg,
    imageAlt: "Undeveloped urban land aerial view",
  },
  {
    icon: FileText,
    title: "Regulatory Validation",
    tag: "Risk Mitigation",
    description:
      "Comprehensive background screening covering landowner title search, regulatory approvals, and builder historical litigation tracking to eliminate real estate transaction risk.",
    image: aerialUrbanDevelopmentImg,
    imageAlt: "Aerial view of urban development",
  },
] as const;

const FeaturesSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const navbarHeight = 80;
      
      // The section is in focus if its top is near the navbar or occupying viewport
      const isInView = rect.top <= navbarHeight + 20 && rect.bottom >= window.innerHeight - 20;

      if (isInView) {
        const isScrollingDown = e.deltaY > 0;
        const isScrollingUp = e.deltaY < 0;

        if (
          (isScrollingDown && activeStep < 4) ||
          (isScrollingUp && activeStep > 0)
        ) {
          // Prevent natural page scroll
          e.preventDefault();

          // Auto-align the section content window with the top of the navbar for a clean focus
          if (Math.abs(rect.top - navbarHeight) > 10) {
            window.scrollTo({
              top: window.scrollY + rect.top - navbarHeight,
              behavior: "smooth"
            });
          }

          // Throttle transition triggers for responsive but controlled scroll
          const now = Date.now();
          if (now - lastScrollTime.current > 800) {
            if (isScrollingDown) {
              setActiveStep((prev) => Math.min(prev + 1, 4));
            } else {
              setActiveStep((prev) => Math.max(prev - 1, 0));
            }
            lastScrollTime.current = now;
          }
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      (window as any)._touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const navbarHeight = 80;
      const isInView = rect.top <= navbarHeight + 20 && rect.bottom >= window.innerHeight - 20;

      if (isInView) {
        const touchEndY = e.touches[0].clientY;
        const deltaY = ((window as any)._touchStartY || 0) - touchEndY;
        const isScrollingDown = deltaY > 30;
        const isScrollingUp = deltaY < -30;

        if (
          (isScrollingDown && activeStep < 4) ||
          (isScrollingUp && activeStep > 0)
        ) {
          e.preventDefault();

          const now = Date.now();
          if (now - lastScrollTime.current > 800) {
            if (isScrollingDown) {
              setActiveStep((prev) => Math.min(prev + 1, 4));
            } else {
              setActiveStep((prev) => Math.max(prev - 1, 0));
            }
            lastScrollTime.current = now;
          }
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [activeStep]);

  return (
    <div ref={sectionRef} className="w-full">
      <section className="relative min-h-screen w-full flex flex-col justify-center bg-background overflow-hidden border-t border-border/20 z-10 pt-24 pb-12">
        {/* Background blurs */}
        <div className="absolute inset-0 bg-background pointer-events-none" />
        <div
          className="absolute right-[-10%] top-1/3 w-[35vw] h-[35vw] opacity-10 dark:opacity-[0.05] pointer-events-none rounded-full"
          style={{
            background: "radial-gradient(circle, #52b788, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col justify-center h-full">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#1A5C35]/15 dark:border-[#52b788]/20 bg-[#1A5C35]/5 dark:bg-[#52b788]/5 text-[10px] uppercase tracking-[0.2em] font-medium text-[#1A5C35] dark:text-[#52b788] mb-3"
            >
              <span>Core Pillars</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-times text-[#0D3B21] dark:text-white leading-[1.1] tracking-tight">
              Ecosystem Capabilities
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Jointlly restructures fragmented construction data to safeguard transactions and build absolute confidence.
            </p>
          </div>

          {/* Cards container with dynamic animated transitions */}
          <div className="w-full flex items-center justify-center min-h-[460px] sm:min-h-[500px]">
            {activeStep < 4 ? (
              <div className="flex flex-col md:flex-row gap-6 items-stretch w-full">
                {/* Left Active Card */}
                <motion.div
                  key={`active-${pillars[activeStep].title}`}
                  layoutId={`card-${pillars[activeStep].title}`}
                  layout
                  transition={{ layout: { duration: 0.8, ease: [0.32, 0.72, 0, 1] } }}
                  className="flex-[2] p-2 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 group transition-colors duration-1000 shadow-md min-h-[420px] sm:min-h-[460px] flex flex-col"
                >
                  <div className="h-full flex-1 rounded-[calc(2.5rem-0.5rem)] bg-white dark:bg-[#071f12] border border-border/40 dark:border-border/10 p-6 sm:p-8 md:p-10 shadow-soft flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,transparent_50%)] pointer-events-none" />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center h-full">
                      <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6">
                        <div>
                          <div className="flex items-center justify-between mb-6">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9952A]">
                              {pillars[activeStep].tag}
                            </span>
                            <div className="h-10 w-10 rounded-2xl bg-[#1A5C35]/10 dark:bg-[#52b788]/10 flex items-center justify-center text-[#1A5C35] dark:text-[#52b788]">
                              {(() => {
                                const Icon = pillars[activeStep].icon;
                                return <Icon className="h-5 w-5" strokeWidth={1.25} />;
                              })()}
                            </div>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold font-times text-[#0D3B21] dark:text-white mb-3 leading-snug">
                            {pillars[activeStep].title}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {pillars[activeStep].description}
                          </p>
                        </div>
                        <div className="pt-4 border-t border-border/20 dark:border-border/10 flex items-center gap-2 text-[11px] font-semibold text-[#1A5C35] dark:text-[#52b788]">
                          <CheckCircle className="h-4 w-4" strokeWidth={1.5} />
                          <span>Verified Jointlly Standard</span>
                        </div>
                      </div>

                      <div className="lg:col-span-5 relative w-full h-48 sm:h-56 lg:h-64 rounded-2xl overflow-hidden border border-border/30 dark:border-white/10 shadow-sm">
                        <img
                          src={pillars[activeStep].image}
                          alt={pillars[activeStep].imageAlt}
                          className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-medium text-white/90">
                          {pillars[activeStep].tag}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Right Preview Card */}
                {activeStep + 1 < 4 && (
                  <motion.div
                    key={`preview-${pillars[activeStep + 1].title}`}
                    layoutId={`card-${pillars[activeStep + 1].title}`}
                    layout
                    transition={{ layout: { duration: 0.8, ease: [0.32, 0.72, 0, 1] } }}
                    className="hidden md:block flex-[1] p-2 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 group transition-colors duration-1000 shadow-sm opacity-60 hover:opacity-85 flex flex-col"
                  >
                    <div className="h-full flex-1 rounded-[calc(2.5rem-0.5rem)] bg-white dark:bg-[#071f12] border border-border/40 dark:border-border/10 p-6 sm:p-8 shadow-soft flex flex-col justify-between space-y-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,transparent_50%)] pointer-events-none" />
                      
                      <div>
                        <div className="flex items-center justify-between mb-5">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9952A]">
                            {pillars[activeStep + 1].tag}
                          </span>
                          <div className="h-10 w-10 rounded-2xl bg-[#1A5C35]/10 dark:bg-[#52b788]/10 flex items-center justify-center text-[#1A5C35] dark:text-[#52b788]">
                            {(() => {
                              const Icon = pillars[activeStep + 1].icon;
                              return <Icon className="h-5 w-5" strokeWidth={1.25} />;
                            })()}
                          </div>
                        </div>

                        <div className="relative w-full h-32 sm:h-36 rounded-2xl overflow-hidden border border-border/30 dark:border-white/10 shadow-sm mb-4">
                          <img
                            src={pillars[activeStep + 1].image}
                            alt={pillars[activeStep + 1].imageAlt}
                            className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-medium text-white/90">
                            {pillars[activeStep + 1].tag}
                          </div>
                        </div>

                        <h3 className="text-lg font-bold font-times text-[#0D3B21] dark:text-white mb-2 leading-snug">
                          {pillars[activeStep + 1].title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                          {pillars[activeStep + 1].description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-border/20 dark:border-border/10 flex items-center gap-2 text-[11px] font-semibold text-[#1A5C35] dark:text-[#52b788]">
                        <CheckCircle className="h-4 w-4" strokeWidth={1.5} />
                        <span>Verified Standard</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              /* Step 4: Final grid view containing all 4 cards shown small */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 auto-rows-auto w-full">
                {pillars.map((p) => {
                  const Icon = p.icon;
                  return (
                    <motion.div
                      key={p.title}
                      layoutId={`card-${p.title}`}
                      layout
                      className="p-2 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 group transition-all duration-500 shadow-sm flex flex-col"
                    >
                      <div className="h-full flex-1 rounded-[calc(2.5rem-0.5rem)] bg-white dark:bg-[#071f12] border border-border/40 dark:border-border/10 p-6 shadow-soft flex flex-col justify-between space-y-4 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,transparent_50%)] pointer-events-none" />
                        
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#C9952A]">
                              {p.tag}
                            </span>
                            <div className="h-8 w-8 rounded-xl bg-[#1A5C35]/10 dark:bg-[#52b788]/10 flex items-center justify-center text-[#1A5C35] dark:text-[#52b788]">
                              <Icon className="h-4 w-4" strokeWidth={1.25} />
                            </div>
                          </div>

                          <div className="relative w-full h-28 rounded-xl overflow-hidden border border-border/30 dark:border-white/10 shadow-sm mb-3">
                            <img
                              src={p.image}
                              alt={p.imageAlt}
                              className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                          </div>

                          <h3 className="text-base font-bold font-times text-[#0D3B21] dark:text-white mb-2 leading-snug">
                            {p.title}
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                            {p.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-border/20 dark:border-border/10 flex items-center gap-1.5 text-[10px] font-semibold text-[#1A5C35] dark:text-[#52b788]">
                          <CheckCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
                          <span>Verified Pillar</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesSection;
