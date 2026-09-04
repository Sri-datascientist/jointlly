import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, AlertCircle, XCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import interiorHero from "@/assets/interiorhero.png";

const Interior = () => {
  const pillars = [
    {
      title: "Spatial Optimization",
      description: "Designing the 'flow' of a space to maximize every square foot for its intended purpose.",
    },
    {
      title: "Technical Integration",
      description: "Managing internal systems such as lighting, acoustics, and climate control within the architectural layout.",
    },
    {
      title: "Material Selection",
      description: "Specifying finishes and furnishings that meet durability requirements and design philosophies.",
    },
    {
      title: "Human-Centric Design",
      description: "Prioritizing ergonomics and psychological comfort to enhance the user experience.",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center py-12 sm:py-16 md:py-20 overflow-hidden bg-gradient-to-b from-[#FAF9F6] to-white dark:from-[#07150e] dark:to-background border-b border-border/20">
        <div className="absolute inset-0 bg-[#FAF9F6]/20 dark:bg-transparent pointer-events-none" />
        <div
          className="absolute right-[-10%] top-[-10%] w-[45vw] h-[45vw] opacity-10 dark:opacity-[0.03] pointer-events-none rounded-full"
          style={{
            background: "radial-gradient(circle, #1A5C35, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
              className="lg:col-span-7 space-y-6"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-times text-[#0D3B21] dark:text-white leading-[1.1] tracking-tight">
                Interior Architecture
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Transforming raw internal volumes into functional, high-value environments by balancing structural guidelines with modern spatial design.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-between rounded-full bg-gradient-to-r from-[#1A5C35] to-[#0D3B21] hover:from-[#217041] hover:to-[#0f4728] pl-6 pr-2 py-2 text-sm font-bold text-white shadow-lg transition-colors"
                >
                  <span className="font-sans tracking-wide pr-6">Get Started</span>
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                    <ArrowRight className="h-4.5 w-4.5" strokeWidth={2} />
                  </div>
                </Link>
                <Link
                  to="/auth"
                  state={{ userType: "landowner", authMode: "signup" }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white/40 dark:bg-white/5 px-6 py-2 text-xs font-bold text-foreground hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
                >
                  Explore Options
                </Link>
              </div>
            </motion.div>

            {/* Right Media Bezel */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
              className="lg:col-span-5 p-2 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10"
            >
              <div className="rounded-[calc(2.5rem-0.5rem)] relative overflow-hidden aspect-[4/3] bg-muted shadow-soft">
                <img
                  src={interiorHero}
                  alt="Premium Interior Architecture"
                  className="w-full h-full object-cover grayscale opacity-90 dark:opacity-80"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="relative py-14 sm:py-16 bg-background border-b border-border/20">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-times text-[#0D3B21] dark:text-white leading-tight">
              What is Interior Architecture?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Interior Architecture is the strategic process of transforming a building's internal volume into a functional, high-value environment tailored to specific user needs. This discipline blends technical structural knowledge with modern aesthetics to ensure that internal spaces are as operationally efficient as they are visually balanced.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pillars Grid */}
      <section className="relative py-14 sm:py-16 bg-[#FAF9F6] dark:bg-[#07150e] border-b border-border/20">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-times text-[#0D3B21] dark:text-white leading-tight">
              Key Components
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              To understand the discipline from a results-oriented perspective, it is broken down into four core pillars:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {pillars.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.32, 0.72, 0, 1] }}
                className="p-1.5 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 group transition-all duration-700 ease-spring hover:scale-[1.01]"
              >
                <div className="h-full rounded-[calc(2-0.375rem)] bg-white dark:bg-[#071f12] border border-border/40 dark:border-border/10 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-soft">
                  <div className="h-10 w-10 rounded-full bg-[#1A5C35]/10 flex items-center justify-center text-[#1A5C35] dark:text-[#52b788] text-sm font-bold shadow-inner">
                    {index + 1}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold font-times text-[#0D3B21] dark:text-white leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges & Solution Section - Single Bezel */}
      <section className="relative py-14 sm:py-16 bg-background">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-times text-[#0D3B21] dark:text-white leading-tight">
              Problem Context
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Interior design selection is often influenced by brand visibility rather than suitability.
            </p>
          </div>

          <div className="p-2 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-soft">
            <div className="rounded-[calc(2.5rem-0.5rem)] bg-white dark:bg-[#071f12] border border-border/40 dark:border-border/10 p-6 sm:p-10 shadow-soft relative overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Left Column: Context */}
                <div className="md:col-span-6 space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9952A] flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4" strokeWidth={2} />
                      <span>Key Challenges</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Interior design selection is often influenced by brand visibility rather than suitability. Pricing opacity and limited exposure to independent designers reduce informed choice, though execution responsibility remains entirely with the contracting parties.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-red-500/5 dark:bg-red-500/10 border border-red-500/10 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-foreground font-semibold">The Reality:</strong> Homeowners often settle for unvetted packaged decorators, overpaying for stock items instead of structural custom optimization.
                  </div>
                </div>

                {/* Right Column: Solution */}
                <div className="md:col-span-6 space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A5C35] dark:text-[#52b788] flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                      <span>Jointlly's Value Delivery</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Jointlly functions as a design discovery and comparison platform, helping owners explore a broader range of professionals and styles.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex gap-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        <CheckCircle2 className="h-4 w-4 text-[#1A5C35] dark:text-[#52b788] shrink-0 mt-0.5" strokeWidth={2} />
                        <span>Designer and architect profiles with declared specialization areas and portfolio references</span>
                      </li>
                      <li className="flex gap-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        <CheckCircle2 className="h-4 w-4 text-[#1A5C35] dark:text-[#52b788] shrink-0 mt-0.5" strokeWidth={2} />
                        <span>Indicative scope-based pricing ranges (non-binding, non-contractual) to aid expectation setting</span>
                      </li>
                      <li className="flex gap-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        <CheckCircle2 className="h-4 w-4 text-[#1A5C35] dark:text-[#52b788] shrink-0 mt-0.5" strokeWidth={2} />
                        <span>Material and design preference visibility to support better alignment discussions</span>
                      </li>
                    </ul>
                  </div>

                  {/* Disclaimers */}
                  <div className="p-4 rounded-xl bg-muted/80 dark:bg-muted/10 border border-border text-[11px] text-muted-foreground leading-relaxed space-y-2">
                    <p className="font-bold text-foreground">Important Guardrails:</p>
                    <ul className="space-y-1">
                      <li className="flex gap-1.5">
                        <XCircle className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0 mt-0.5" strokeWidth={2} />
                        <span>Jointlly does not fix prices or endorse design outcomes.</span>
                      </li>
                      <li className="flex gap-1.5">
                        <XCircle className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0 mt-0.5" strokeWidth={2} />
                        <span>Jointlly does not procure materials or manage execution timelines.</span>
                      </li>
                    </ul>
                    <p className="text-[10px] text-muted-foreground/75 border-t border-border/40 pt-1.5 mt-1.5">
                      Final quotations and coordination are solely between the owner and selected professionals.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Interior;
