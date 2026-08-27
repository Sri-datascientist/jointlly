import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, AlertCircle, Users, Wrench, Search, CheckCircle2, XCircle, Sparkles, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import resdentialHero from "@/assets/resdentialhero.png";
import { cn } from "@/lib/utils";

const Residential = () => {
  const [activeScenario, setActiveScenario] = useState<0 | 1 | 2>(0);

  const strategicBreakdown = [
    {
      title: "Private Estates (Villas)",
      description:
        "High-value, standalone structures focused on lifestyle amenities and private land ownership.",
    },
    {
      title: "Income-Generating Assets (Duplexes/Apartments)",
      description:
        "Multifunctional designs that allow owners to occupy one unit while leveraging the remaining units for cash flow.",
    },
    {
      title: "Low-Rise Urban Density",
      description:
        "Scalable structures that maximize land utility without the complexity of high-rise engineering.",
    },
  ];

  const scenarios = [
    {
      tabLabel: "Funding, No Expertise",
      title: "Property Owner with Funds but No Construction Expertise",
      subtitle: "If someone owns land and has money to build but lacks construction know-how, options are limited and blind:",
      challenges: [
        "Ask friends or family for referrals based on past experience, handing over the project without vetting the builder firsthand.",
        "Walk into a nearby ongoing construction site with naive expectations.",
        "Endlessly browse online portals and forums hunting for a trustworthy, experienced builder near their property.",
      ],
      reality: "There are excellent small-scale or solo builders who deliver honest work with top-quality products and on-time completion at affordable prices but online searches and social media spotlight only big companies, overshadowing these hidden gems.",
      solutionIntro: "Jointlly functions as a decision-enablement and discovery platform, helping owners make more informed shortlisting decisions before engaging independently with any builder.",
      provides: [
        "Structured profiles of builders and construction professionals, based on self-disclosed data, past work signals, and market-visible indicators",
        "Non-promotional comparisons across parameters such as project type experience, scale alignment, and indicative execution patterns",
        "Contextual information to help owners ask better technical and commercial questions during their own evaluation",
      ],
      disclaimers: [
        "Jointlly does not recommend, certify, appoint, or supervise builders.",
        "It does not validate execution quality or guarantee outcomes.",
        "Owners are advised to conduct independent technical, legal, and contractual due diligence before final engagement.",
      ],
      outcome: "Reduced search opacity and improved decision clarity without replacing the owner's responsibility or professional advisors.",
    },
    {
      tabLabel: "Joint Venture (JV/JD)",
      title: "Property Owner Seeking Revenue via Joint Venture/Development (JV/JD)",
      subtitle: "For owners without full funds who want revenue or a higher-value constructed property through JV/JD, finding a reliable builder is a gamble:",
      challenges: [
        "Rely on brokers or mediators (charging 2-3% commissions in Bangalore), where the landowner pays half (or full) upfront based on urgency yet remains unsure about work quality, timelines, or key government laws. Brokers often push builders who pay them higher kickbacks, sidelining better-quality options that won't pay extra.",
        "Cold-call builders online, who often lowball the property value with flimsy excuses, hide critical rules like FAR, height restrictions, setbacks, and bylaws (to tweak plans in their favor, risking deviations during Construction Certificate approval).",
        "No dedicated websites or apps exist just for JD/JV online marketplaces focus only on buy/sell or rentals.",
      ],
      reality: "Brokers and unvetted online developer pitches lack structural neutral matching, making landowner decisions highly risky.",
      solutionIntro: "Jointlly acts as a neutral information and matching facilitator, enabling landowners to understand development possibilities and partner profiles before entering discussions.",
      provides: [
        "Indicative regulatory context (such as FAR ranges, zoning references, and high-level planning constraints) sourced from publicly available government frameworks",
        "Structured partner discovery based on stated development preferences, project scale alignment, and prior JV/JD participation signals",
        "Comparable high-level deal structures (illustrative only) to improve conceptual understanding not legal or financial advice",
      ],
      disclaimers: [
        "Jointlly does not value land or projects.",
        "Jointlly does not advise on deal terms.",
        "Jointlly does not negotiate, mediate, or conclude agreements.",
        "Jointlly does not replace legal, financial, or planning consultants.",
      ],
      outcome: "Better-informed partner exploration with reduced dependence on opaque intermediaries while preserving full owner control and accountability.",
    },
    {
      tabLabel: "Partial Renovation",
      title: "House/Flat Owner Needing Partial Renovation/Repaint",
      subtitle: "Renovating part of an existing house or flat often means settling for unvetted small-scale operators:",
      challenges: [
        "Ask nearby under-construction workers, who may override engineers for quick cash lacking real expertise in load-bearing beams/columns, they alter walls or add weight to slab roofs without support, causing major structural damage.",
        "Turn to a \"known circle\" builder, who exploits the trust to charge inflated prices, hiking overall costs and leaving the owner at a loss.",
      ],
      reality: "Unverified modifications risk building safety and structural alignment. Homeowners lack tools to filter specific micro-renovation credentials.",
      solutionIntro: "Jointlly provides a discovery and filtering layer to help owners identify professionals whose declared experience aligns with the stated nature of work.",
      provides: [
        "Categorized discovery of professionals based on renovation type (non-structural, interior-only, structural modification, etc.)",
        "Experience indicators and scope disclosures shared by professionals to help owners assess relevance",
        "Information prompts that encourage owners to seek structural engineers, approvals, and drawings where applicable",
      ],
      disclaimers: [
        "Jointlly does not approve structural changes.",
        "Jointlly does not validate technical safety.",
        "Jointlly does not replace structural engineers, architects, or statutory authorities.",
        "Jointlly does not supervise on-site work.",
      ],
      outcome: "Owners remain fully responsible for ensuring compliance with building laws, society rules, and local authority approvals.",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      <section className="relative min-h-[90vh] flex items-center pt-24 pb-10 overflow-hidden bg-gradient-to-b from-[#FAF9F6] to-white dark:from-[#07150e] dark:to-background border-b border-border/20">
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#1A5C35]/15 dark:border-[#52b788]/20 bg-[#1A5C35]/5 dark:bg-[#52b788]/5 text-[10px] uppercase tracking-[0.2em] font-medium text-[#1A5C35] dark:text-[#52b788]">
                <span>Asset Categories</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-times text-[#0D3B21] dark:text-white leading-[1.1] tracking-tight">
                Residential Construction
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Structured decision enablement for low-rise properties—from single-family private estates (villas) to duplexes and multi-unit investment apartments.
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
                  state={{ userType: "landowner", authMode: "login" }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white/40 dark:bg-white/5 px-6 py-2 text-xs font-bold text-foreground hover:bg-white/60 dark:hover:bg-white/10 transition-colors"
                >
                  Explore Options
                </Link>
              </div>
            </motion.div>

            {/* Right Media Cover Bezel */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
              className="lg:col-span-5 p-2 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10"
            >
              <div className="rounded-[calc(2.5rem-0.5rem)] relative overflow-hidden aspect-[4/3] bg-muted shadow-soft">
                <img
                  src={resdentialHero}
                  alt="Premium Residential Construction"
                  className="w-full h-full object-cover grayscale opacity-90 dark:opacity-80"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* What is Residential Overview */}
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
              What is Residential Construction?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Residential construction focuses on the development of low-rise structures, typically two to three stories in height, designed for private ownership or investment. This category encompasses diverse housing models, including villas optimized for single-family privacy and multi-unit dwellings such as duplexes or low-rise apartments. These assets are strategically built to serve as primary residences or to generate consistent rental yields for the owner.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Strategic Breakdown Steps */}
      <section className="relative py-14 sm:py-16 bg-[#FAF9F6] dark:bg-[#07150e] border-b border-border/20">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-times text-[#0D3B21] dark:text-white leading-tight">
              Strategic Breakdown
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              How we categorize and structure residential development opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {strategicBreakdown.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.32, 0.72, 0, 1] }}
                className="p-1.5 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 group transition-all duration-700 ease-spring hover:scale-[1.01]"
              >
                <div className="h-full rounded-[calc(2rem-0.375rem)] bg-white dark:bg-[#071f12] border border-border/40 dark:border-border/10 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-soft">
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

      {/* Common Challenges Selector (Interactive Tab Panels) */}
      <section className="relative py-14 sm:py-16 bg-background border-b border-border/20">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-times text-[#0D3B21] dark:text-white leading-tight">
              Common Challenges
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Select a scenario below to explore its specific challenges and Jointlly's neutral matching solutions.
            </p>
          </div>

          {/* Scenario Tab Selectors */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 max-w-2xl mx-auto p-1.5 rounded-2xl sm:rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
            {scenarios.map((sc, idx) => {
              const isActive = activeScenario === idx;
              return (
                <button
                  key={sc.tabLabel}
                  onClick={() => setActiveScenario(idx as 0 | 1 | 2)}
                  className={cn(
                    "w-full sm:flex-1 py-2 px-4 rounded-xl sm:rounded-full text-xs font-bold transition-all duration-500 ease-spring",
                    isActive
                      ? "bg-gradient-to-r from-[#1A5C35] to-[#0D3B21] text-white shadow-md scale-105"
                      : "text-muted-foreground hover:text-[#1A5C35] dark:hover:text-[#52b788]"
                  )}
                >
                  <span>{sc.tabLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Scenario Content Panel */}
          <div className="p-2 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-soft">
            <div className="rounded-[calc(2.5rem-0.5rem)] bg-white dark:bg-[#071f12] border border-border/40 dark:border-border/10 p-6 sm:p-10 shadow-soft relative overflow-hidden min-h-[450px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeScenario}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                  className="space-y-8"
                >
                  {/* Title & subtitle */}
                  <div className="space-y-2 border-b border-border/40 pb-4">
                    <h3 className="text-xl sm:text-2xl font-bold font-times text-[#0D3B21] dark:text-white leading-tight">
                      {scenarios[activeScenario].title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {scenarios[activeScenario].subtitle}
                    </p>
                  </div>

                  {/* Two column detail: Challenges vs Solution */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    
                    {/* Left Column: Challenges & Reality */}
                    <div className="md:col-span-6 space-y-6">
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9952A] flex items-center gap-1.5">
                          <AlertCircle className="h-4 w-4" strokeWidth={2} />
                          <span>Key Risks</span>
                        </h4>
                        <ul className="space-y-3">
                          {scenarios[activeScenario].challenges.map((ch, idx) => (
                            <li key={idx} className="flex gap-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              <span className="text-[#C9952A] font-bold shrink-0">•</span>
                              <span>{ch}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl bg-red-500/5 dark:bg-red-500/10 border border-red-500/10 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        <strong className="text-foreground font-semibold">The Ground Reality:</strong> {scenarios[activeScenario].reality}
                      </div>
                    </div>

                    {/* Right Column: Jointlly's Solution */}
                    <div className="md:col-span-6 space-y-6">
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A5C35] dark:text-[#52b788] flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                          <span>Jointlly's Value Delivery</span>
                        </h4>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {scenarios[activeScenario].solutionIntro}
                        </p>
                        <ul className="space-y-2">
                          {scenarios[activeScenario].provides.map((pr, idx) => (
                            <li key={idx} className="flex gap-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              <CheckCircle2 className="h-4 w-4 text-[#1A5C35] dark:text-[#52b788] shrink-0 mt-0.5" strokeWidth={2} />
                              <span>{pr}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Disclaimers list */}
                      <div className="p-4 rounded-xl bg-muted/80 dark:bg-muted/10 border border-border text-[11px] text-muted-foreground leading-relaxed space-y-2">
                        <p className="font-bold text-foreground">Important Guardrails:</p>
                        <ul className="space-y-1">
                          {scenarios[activeScenario].disclaimers.map((dc, idx) => (
                            <li key={idx} className="flex gap-1.5">
                              <XCircle className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0 mt-0.5" strokeWidth={2} />
                              <span>{dc}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="text-[10px] text-muted-foreground/75 border-t border-border/40 pt-1.5 mt-1.5">
                          Outcome: {scenarios[activeScenario].outcome}
                        </p>
                      </div>
                    </div>

                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Residential;
