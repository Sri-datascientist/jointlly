import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, AlertCircle, CheckCircle2, XCircle, Sparkles, Warehouse } from "lucide-react";
import { Link } from "react-router-dom";
import industrialHero from "@/assets/industrialhero.png";
import { cn } from "@/lib/utils";

const Industrial = () => {
  const [activeScenario, setActiveScenario] = useState<0 | 1 | 2>(0);

  const components = [
    {
      title: "Pre-Engineered Buildings (PEB)",
      description: "Optimized structural steel envelopes designed for high clear heights, modular assembly, and high durability.",
    },
    {
      title: "High-Tolerance Industrial Floors",
      description: "Laser-leveled FM2/FM3 concrete floors engineered to withstand racking loads, heavy forklifts, and static machinery.",
    },
    {
      title: "Heavy MEP Integration",
      description: "Complex networks for ventilation, high-voltage power, and industrial-grade water management systems.",
    },
  ];

  const scenarios = [
    {
      tabLabel: "Greenfield Projects",
      title: "Funded Owner Navigating Industrial Execution (Greenfield Projects)",
      subtitle: "Building a factory or Grade-A warehouse requires highly specialized engineering and material handling:",
      challenges: [
        "Hiring standard commercial builders who cast regular floor slabs that crack under heavy dynamic racking.",
        "Incorrect calculations of soil bearing capacity (SBC) leading to structural settlement under heavy equipment.",
        "Inability to navigate regulatory pathways for HT power sanctions and pollution control board (KSPCB) approvals.",
      ],
      reality: "Standard commercial builders cast slabs that fail under racking stress or VNA forklifts, halting logistics.",
      solutionIntro: "Jointlly functions as a decision-enablement platform tailored for heavy-duty execution, ensuring capital is directed toward specialized industrial expertise.",
      provides: [
        "Specialized contractor discovery with profiles of PEB manufacturers, industrial civil contractors, and flooring experts",
        "A layer of verification based on self-disclosed clear-height capabilities, structural tonnage handled, and floor tolerance standards",
        "Industrial context prompts outlining soil bearing capacity testing, fire clearance codes, and industrial architect roles",
      ],
      disclaimers: [
        "Jointlly does not certify structural integrity or supervise on-site execution.",
        "Owners must conduct rigorous technical due diligence and engage licensed structural engineers and PMCs.",
      ],
      outcome: "Better alignment between industrial intent and execution capability, reducing the risk of non-usable floors.",
    },
    {
      tabLabel: "Highway JV/JD",
      title: "Landowner Seeking Industrial JV/JD (Warehousing & Logistics Parks)",
      subtitle: "Highway-corridor land can support high-yield logistics parks, but structuring deal terms is complex:",
      challenges: [
        "Intermediaries pushing low-clearance shed developments that command suboptimal rent yields.",
        "Lack of visibility into industrial zoning restrictions (yellow versus purple zones) and local master plans.",
        "Unfair deal ratios proposed by corporate developers due to landowner information asymmetry.",
      ],
      reality: "Highway land yields are often diluted because landowners accept low-spec shed structures from developers.",
      solutionIntro: "Jointlly acts as a neutral information and matching facilitator, equipping landowners to understand the true yield potential of their industrial land.",
      provides: [
        "Regulatory visibility via indicative industrial zoning context and Grade-A infrastructure planning constraints",
        "Direct connection to developers with a track record in building and leasing industrial and logistics parks",
        "Illustrative examples of industrial JV/JD frameworks, comparing built-to-suit leases with standard revenue share",
      ],
      disclaimers: [
        "Jointlly does not value land, calculate industrial yield, or advise on deal terms.",
        "All land conversions, leases, and agreements must be independently assessed by qualified professionals.",
      ],
      outcome: "Better-informed exploration of industrial JV/JD options, with reduced dependence on opaque intermediaries.",
    },
    {
      tabLabel: "Capacity Expansion",
      title: "Industrial Retrofitting & Capacity Expansion (Brownfield Projects)",
      subtitle: "Expanding an active manufacturing plant (adding overhead cranes or heavier machinery) carries severe physical risks:",
      challenges: [
        "Unvetted contractors welding extra members or modifying structural columns without dynamic load analysis.",
        "Major structural failure or collapse once machinery is commissioned due to incorrect stress estimates.",
        "Operational downtime during Live structural modification due to poor phasing schedules.",
      ],
      reality: "Welding structural columns in live factories without certified load testing risks structural failure.",
      solutionIntro: "Jointlly provides a specialized discovery layer to identify professionals equipped for high-risk industrial modifications while minimizing operational disruption.",
      provides: [
        "Categorized discovery of contractors experienced in structural strengthening, mezzanines, and heavy MEP upgrades",
        "Disclosures about executing within live, operational factories where safety, downtime, and phasing are critical",
        "Prompts reminding owners to perform dynamic load testing and secure revised factory inspectorate approvals",
      ],
      disclaimers: [
        "Jointlly does not validate structural safety, approve modifications, or replace statutory authorities.",
        "Facility owners remain fully responsible for compliance, worker safety, and structural integrity.",
      ],
      outcome: "More informed selection of retrofitting partners and clearer awareness of the technical checks required.",
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
                Industrial Engineering
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Structured decision enablement for heavy-duty facilities, from pre-engineered steel envelopes (PEB) to high-tolerance warehouse floors.
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
                  src={industrialHero}
                  alt="Premium Industrial Infrastructure"
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
              What is Industrial Construction?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Industrial construction involves building facilities engineered specifically for manufacturing, warehousing, and logistics. A minor failure in slab leveling or soil compaction can halt operational machinery. Jointlly simplifies the discovery of specialized contractors who understand industrial civil works, clear heights, and structural loading capacity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Structural Components Grid */}
      <section className="relative py-14 sm:py-16 bg-[#FAF9F6] dark:bg-[#07150e] border-b border-border/20">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-times text-[#0D3B21] dark:text-white leading-tight">
              Key Structural Components
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              The essential elements that make industrial buildings capable of handling extreme physical stress:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {components.map((item, index) => (
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

      {/* Challenges Section - Interactive Tab Panels */}
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

export default Industrial;
