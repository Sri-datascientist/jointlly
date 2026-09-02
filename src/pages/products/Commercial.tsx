import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, AlertCircle, CheckCircle2, XCircle, Sparkles, Building2, Store } from "lucide-react";
import { Link } from "react-router-dom";
import commercialHero from "@/assets/commercialhero.png";
import { cn } from "@/lib/utils";

const Commercial = () => {
  const [activeScenario, setActiveScenario] = useState<0 | 1 | 2>(0);

  const categories = [
    {
      title: "Grade A Office Spaces",
      description: "High-density structures optimized for corporate operations, featuring complex MEP systems and strict fire codes.",
    },
    {
      title: "Retail Hubs",
      description: "Customer-facing physical assets designed for high footfall, requiring flexible structural plans and loading geometry.",
    },
    {
      title: "Managed Living Solutions",
      description: "Co-living and hospitality spaces combining residential scales with commercial statutory compliance.",
    },
  ];

  const scenarios = [
    {
      tabLabel: "Complex Execution",
      title: "Funded Owner Navigating Complex Commercial Execution",
      subtitle: "Building a commercial asset demands a very different supply chain and expertise than a villa:",
      challenges: [
        "Hiring contractors with purely residential experience, leading to gaps in commercial-grade steel procurement.",
        "Mismatched sub-contractor management for specialized HVAC, BMS, and fire-fighting networks.",
        "Unfamiliarity with mandatory software-based municipal approval workflows like EODB-OBPS for BBMP.",
      ],
      reality: "Residential builders lack the institutional supply chain to manage commercial MEP, leading to severe delays.",
      solutionIntro: "Jointlly provides a specialized discovery layer for commercial scale so that large capital is not placed on mismatched contractors.",
      provides: [
        "Scale-matched discovery of builders with demonstrable commercial execution history, separated from residential contractors",
        "Verification indicators about past commercial project delivery, supply-chain complexity handled, and scale",
        "Commercial context prompts around the need for specialized MEP consultants, façade specialists, and compliance pathways",
      ],
      disclaimers: [
        "Jointlly does not certify a builder’s financial health, supervise execution, or guarantee outcomes.",
        "Owners must run independent technical and financial due diligence before appointment.",
      ],
      outcome: "Stronger alignment between commercial ambitions and execution capabilities, with fewer surprises mid-project.",
    },
    {
      tabLabel: "Commercial JV/JD",
      title: "Landowner Seeking Commercial JV/JD",
      subtitle: "Prime commercial land can command strong yields, yet negotiating JD ratios is highly asymmetrical:",
      challenges: [
        "Intermediaries often understate permissible FAR or overstate conversion and development costs.",
        "Landowners are routinely forced into skewed, lowball JD ratios due to broker bias.",
        "Lack of neutral comparison metrics for corporate developer capabilities.",
      ],
      reality: "Prime commercial land is often locked into unfavorable ratios due to broker kickbacks and hidden bylaws.",
      solutionIntro: "Jointlly dismantles this information asymmetry so landowners walk into negotiations with clearer expectations of what their land can support.",
      provides: [
        "Regulatory visibility via indicative commercial FAR limits and zoning references relevant to Bangalore's master plan",
        "Neutral partner discovery connecting landowners directly with developers who have delivered comparable commercial assets",
        "Conceptual deal structures through illustrative revenue-sharing models to clarify joint development frameworks",
      ],
      disclaimers: [
        "Jointlly does not perform land valuation, compute yields, or draft legal Joint Development Agreements.",
        "All final terms must be vetted by specialized real estate attorneys and financial advisors.",
      ],
      outcome: "More balanced JV/JD conversations and reduced dependence on opaque intermediaries.",
    },
    {
      tabLabel: "Adaptive Reuse",
      title: "Adaptive Reuse & Commercial Retrofitting (Change of Land Use)",
      subtitle: "Converting residential structures for commercial retail or office operations carries high structural and legal risks:",
      challenges: [
        "Unvetted contractors knocking down structural or load-bearing columns to create modern 'open plans'.",
        "Running commercial operations without e-Khata conversion or trade licenses, risking municipal demolition.",
        "Inadequate fire safety geometry and setbacks leading to severe regulatory penalties.",
      ],
      reality: "Adaptive reuse without structural analysis and municipal approval runs the risk of building collapse or closure.",
      solutionIntro: "Jointlly helps owners find professionals equipped for the high-stakes nature of commercial retrofitting, where both legal status and structural safety must be treated carefully.",
      provides: [
        "Specialized filtering for professionals experienced in structural modification, adaptive reuse, and commercial fit-outs",
        "Experience indicators and scope disclosures that help owners identify teams familiar with change-of-use scenarios",
        "Critical prompts advising owners to engage licensed structural engineers and secure change-of-land-use approvals",
      ],
      disclaimers: [
        "Jointlly does not validate technical safety, approve structural changes, or grant municipal permissions.",
        "Owners remain fully responsible for structural integrity and statutory compliance.",
      ],
      outcome: "Clearer visibility into the risks and professional support needed before converting or retrofitting assets for commercial use.",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
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
                <span>Commercial Assets</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-times text-[#0D3B21] dark:text-white leading-[1.1] tracking-tight">
                Commercial Infrastructure
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Dismantling opacity in commercial real estate development, from Grade-A office spaces to retail hubs and adaptive mixed-use environments.
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

            {/* Right Media Bezel */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
              className="lg:col-span-5 p-2 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10"
            >
              <div className="rounded-[calc(2.5rem-0.5rem)] relative overflow-hidden aspect-[4/3] bg-muted shadow-soft">
                <img
                  src={commercialHero}
                  alt="Premium Commercial Infrastructure"
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
              What is Commercial Construction?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Commercial construction focuses on the development of buildings intended for business and public operations. These projects demand specialized engineering, heavy-duty MEP (Mechanical, Electrical, Plumbing) networks, and rigorous compliance checks due to high footfall and legal safety guidelines. Jointlly organizes unstructured developer data to help landowners identify execution capacity with absolute clarity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="relative py-14 sm:py-16 bg-[#FAF9F6] dark:bg-[#07150e] border-b border-border/20">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-times text-[#0D3B21] dark:text-white leading-tight">
              Bengaluru-Specific Business Breakdown
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              To understand how this looks in our city's current real estate climate, we categorize these structures by their specific function:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((item, index) => (
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

      {/* Challenges Section - Interactive Tab Panel */}
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

export default Commercial;
