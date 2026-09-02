import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, TrendingUp, Award, Heart, ArrowRight, Sparkles, ChevronDown, CheckCircle, Home, Building, Warehouse } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const About = () => {
  const [activeTab, setActiveTab] = useState<"residential" | "commercial" | "industrial">("residential");
  const [expandedStep, setExpandedStep] = useState<number | null>(0);

  const values = [
    {
      icon: Shield,
      title: "Dual-Engine Validation",
      description: "We combine automated algorithmic data indexing with manual expert review. Every initial property profile is mapped by AI and cross-verified by real estate professionals to ensure operational accuracy.",
    },
    {
      icon: TrendingUp,
      title: "Technical Compliance First",
      description: "Innovation without compliance causes project delays. We leverage machine learning to scan regulatory databases, turning complex building codes into clear, actionable development strategies.",
    },
    {
      icon: Award,
      title: "Risk Mitigation",
      description: "We establish a baseline of accountability by benchmarking developer delivery timelines, public dispute records, and past structural audits before introductions are made.",
    },
    {
      icon: Heart,
      title: "Ecosystem Alignment",
      description: "Building transparent real estate partnerships by matching underutilized land with the precise execution capability required to complete the development cycle.",
    },
  ] as const;

  const steps = [
    {
      title: "Step 1: Define your development intent",
      description: "Select your project category: residential, commercial, or industrial. By specifying your intent (self-build, joint venture, or renovation), the platform tailors the data environment to your specific regulatory and engineering needs.",
    },
    {
      title: "Step 2: Access indicative context",
      description: "Before you speak to a builder, understand your land’s potential. Jointlly surfaces high-level indicators relevant to your category, focusing on functional constraints and regulatory nuances that determine long-term viability and legal safety: the silent deal breakers experienced builders know, but owners often overlook.",
    },
    {
      title: "Step 3: Discover scale-matched partners",
      description: "Browse a curated ecosystem of builders and developers whose profiles are structured around self-disclosed data and market-visible signals. Filter by project type experience, review scale alignment, and explore portfolios that emphasize technical delivery over marketing fluff.",
    },
    {
      title: "Step 4: Comparative shortlisting",
      description: "Use non-promotional comparison views to evaluate professionals side by side, looking past brand names to compare execution patterns, specialized MEP capabilities, and historical project scales.",
    },
    {
      title: "Step 5: Engage with professional clarity",
      description: "Armed with Jointlly’s contextual prompts and structured data, you can engage independently. Use our technical inquiry guides to ask sharper questions during site visits and meetings, supporting rigorous, independent legal, technical, and commercial due diligence.",
    },
  ] as const;

  const categories = {
    residential: {
      label: "Residential",
      icon: Home,
      methodology: "Bridging the expertise gap. For private owners, residential construction is deeply personal but technically daunting. Jointlly simplifies the search for “hidden gem” builders and small-scale professionals who deliver high-quality work by providing a structured filtering layer that prioritizes objective track records over marketing budgets.",
      realitiesTitle: "Beyond cost and height",
      realitiesDesc: "The viability of a development layout depends heavily on strict local compliance. Jointlly highlights critical technical baselines including Occupancy Certificate eligibility thresholds, open-to-sky percolation requirements, and mandatory staircase accessibility dimensions. By bringing these granular constraints forward early, we ensure owners identify hidden structural bottlenecks long before the final approval or physical handover stage.",
    },
    commercial: {
      label: "Commercial",
      icon: Building,
      methodology: "High-performance infrastructure. Commercial builds are high-stakes business assets. Jointlly helps owners navigate the complexities of Grade A office spaces, retail hubs, and managed living by connecting them with professionals capable of handling heavy-duty MEP systems and stringent statutory safety codes.",
      realitiesTitle: "Beyond FAR and zoning",
      realitiesDesc: "Commercial assets are valued on efficiency ratios, not just built-up area. We surface insights around premium FAR and TDR loading, fire tender access geometry, and ventilated basement rules so that design and compliance decisions preserve long-term leasability.",
    },
    industrial: {
      label: "Industrial",
      icon: Warehouse,
      methodology: "Precision-engineered performance. In the industrial sector, the structure is a high-performance shell. A minor miscalculation in floor leveling or structural load can render a facility unusable. Jointlly facilitates the discovery of specialized PEB experts and industrial civil contractors who understand the rigorous demands of modern logistics and manufacturing.",
      realitiesTitle: "Beyond clear heights and floor loads",
      realitiesDesc: "Industrial shells are tools for machinery. Jointlly emphasizes soil bearing capacity, point loading, high-precision flooring standards, and HT power and buffer zone requirements so that the building’s performance envelope truly matches the process it must support.",
    },
  } as const;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-12 sm:pb-16 bg-[#FAF9F6] dark:bg-[#07150e] overflow-hidden border-b border-border/20">
        <div className="absolute inset-0 bg-[#FAF9F6]/20 dark:bg-transparent pointer-events-none" />
        <div
          className="absolute right-[-10%] top-[-10%] w-[45vw] h-[45vw] opacity-10 dark:opacity-[0.03] pointer-events-none rounded-full"
          style={{
            background: "radial-gradient(circle, #1A5C35, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            className="space-y-6 text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#1A5C35]/15 dark:border-[#52b788]/20 bg-[#1A5C35]/5 dark:bg-[#52b788]/5 text-[10px] uppercase tracking-[0.2em] font-medium text-[#1A5C35] dark:text-[#52b788]">
              <Sparkles className="h-3 w-3" />
              <span>About Us</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-times text-[#0D3B21] dark:text-white leading-[1.1] tracking-tight">
              Neutral Ecosystem for Real Estate Development
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Jointlly is a neutral information and discovery platform designed to dismantle the opacity of the construction industry, serving as a trust layer by structuring fragmented market data.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Corporate Summary & Pillars */}
      <section className="relative py-16 sm:py-20 bg-background border-b border-border/20">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            
            {/* Info Summary */}
            <div className="md:col-span-5 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold font-times text-[#0D3B21] dark:text-white leading-tight">
                Our Strategic Purpose
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We provide landowners and property seekers with the data-driven clarity needed to move from <strong className="text-foreground font-semibold">owning land</strong> to <strong className="text-foreground font-semibold">building assets</strong> with confidence.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                In an industry often clouded by biased referrals and complex regulatory hurdles, Jointlly serves as a trust layer by structuring fragmented market data into comparable, high-level insights.
              </p>
            </div>

            {/* Pillars Bezel Card */}
            <div className="md:col-span-7 p-2 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
              <div className="rounded-[calc(2.5rem-0.5rem)] bg-white dark:bg-[#071f12] border border-border/40 dark:border-border/10 p-6 sm:p-8 space-y-6 shadow-soft">
                <h3 className="text-lg font-bold font-times text-[#0D3B21] dark:text-white border-b border-border/40 pb-3">
                  Our Structural Pillars
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground">Neutral Discovery</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      We provide structured profiles of builders and developers based on self-disclosed data and market-visible signals, not paid promotions.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground">Decision Enablement</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      We empower owners to ask better technical and commercial questions through non-promotional comparisons of project scales and execution patterns.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground">Regulatory Context</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      We bridge the knowledge gap by providing indicative public regulatory frameworks, from FAR ranges to zoning references.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Category Tabs (Clicking Types) */}
      <section className="relative py-16 sm:py-20 bg-[#FAF9F6] dark:bg-[#07150e] border-b border-border/20">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-times text-[#0D3B21] dark:text-white leading-tight">
              Solving Ground Realities
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground">
              Explore how we translate high-stakes construction complexities into objective data across sectors.
            </p>
          </div>

          {/* Interactive tab selector pills */}
          <div className="flex items-center justify-center gap-3 mb-10 max-w-lg mx-auto p-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
            {(Object.keys(categories) as Array<keyof typeof categories>).map((key) => {
              const cat = categories[key];
              const CatIcon = cat.icon;
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-full text-xs font-bold transition-all duration-500 ease-spring",
                    isActive
                      ? "bg-gradient-to-r from-[#1A5C35] to-[#0D3B21] text-white shadow-md scale-105"
                      : "text-muted-foreground hover:text-[#1A5C35] dark:hover:text-[#52b788]"
                  )}
                >
                  <CatIcon className="h-4 w-4" strokeWidth={isActive ? 2 : 1.5} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab content panel */}
          <div className="p-2 rounded-[2.5rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
            <div className="rounded-[calc(2.5rem-0.5rem)] bg-white dark:bg-[#071f12] border border-border/40 dark:border-border/10 p-8 sm:p-10 shadow-soft relative overflow-hidden min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
                >
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold font-times text-[#0D3B21] dark:text-white border-b border-border/40 pb-3">
                      The Methodology
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {categories[activeTab].methodology}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold font-times text-[#C9952A] border-b border-border/40 pb-3">
                      {categories[activeTab].realitiesTitle}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {categories[activeTab].realitiesDesc}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </section>

      {/* How Jointlly Works (Expandable Accordion) */}
      <section className="relative py-16 sm:py-20 bg-background border-b border-border/20">
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-times text-[#0D3B21] dark:text-white leading-tight">
              How Jointlly Works
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground">
              From land to asset, explore our strategic workflow designed to safeguard your transaction.
            </p>
          </div>

          {/* Vertical Accordion */}
          <div className="space-y-4">
            {steps.map((step, idx) => {
              const isOpen = expandedStep === idx;
              return (
                <div
                  key={step.title}
                  className="p-1 rounded-[1.5rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 overflow-hidden"
                >
                  <div className="rounded-[calc(1.5rem-0.25rem)] bg-white dark:bg-[#071f12] border border-border/40 dark:border-border/10 overflow-hidden">
                    <button
                      onClick={() => setExpandedStep(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left font-times text-base sm:text-lg font-bold text-[#0D3B21] dark:text-white focus:outline-none"
                    >
                      <span>{step.title}</span>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-muted-foreground transition-transform duration-500 ease-spring",
                          isOpen && "rotate-180 text-[#1A5C35] dark:text-[#52b788]"
                        )}
                      />
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                        >
                          <div className="p-5 pt-0 border-t border-border/20 dark:border-border/10 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {step.description}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Mission Section */}
      <section className="relative py-16 sm:py-20 bg-[#FAF9F6] dark:bg-[#07150e] border-b border-border/20">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            
            {/* Mission core */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#1A5C35]/10 dark:border-[#52b788]/10 bg-[#1A5C35]/5 dark:bg-[#52b788]/5 text-[10px] uppercase tracking-[0.2em] font-medium text-[#1A5C35] dark:text-[#52b788]">
                <span>Our Philosophy</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-times text-[#0D3B21] dark:text-white leading-[1.2]">
                Our Mission
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                To deconstruct the opacity of the construction industry by providing a neutral, data-driven trust layer for property development.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                At Jointlly, we believe that the journey from owning land to building a high-performing asset should not be a gamble. Our mission is to empower landowners and investors with decision enablement tools that replace blind referrals and intermediary bias with structured discovery.
              </p>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#071f12] border border-border/40 dark:border-border/10 shadow-soft">
                <h4 className="font-bold text-sm text-[#0D3B21] dark:text-white mb-2">Our Why</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Whether it is a private villa, a Grade-A corporate hub, or a high-precision industrial shell, structural integrity is a multi-generational commitment. Jointlly exists to ensure that every stakeholder has access to a transparent marketplace built on verified professional signals.
                </p>
              </div>
            </div>

            {/* Three pillars of the mission list */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold font-times text-[#0D3B21] dark:text-white border-b border-border/40 pb-3">
                Mission Foundations
              </h3>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="h-6 w-6 rounded-full bg-[#1A5C35]/10 flex items-center justify-center text-[#1A5C35] dark:text-[#52b788] shrink-0 mt-1">
                    <CheckCircle className="h-4.5 w-4.5" strokeWidth={2} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground">Dismantling information asymmetry</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      We provide indicative regulatory context from FAR ranges to zoning references, ensuring landowners understand the true potential of their property before entering negotiations.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-6 w-6 rounded-full bg-[#1A5C35]/10 flex items-center justify-center text-[#1A5C35] dark:text-[#52b788] shrink-0 mt-1">
                    <CheckCircle className="h-4.5 w-4.5" strokeWidth={2} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground">Highlighting “hidden gems”</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Our platform provides a stage for high-quality, small-to-mid-scale builders who deliver honest work and technical excellence but are often overshadowed by large marketing budgets.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-6 w-6 rounded-full bg-[#1A5C35]/10 flex items-center justify-center text-[#1A5C35] dark:text-[#52b788] shrink-0 mt-1">
                    <CheckCircle className="h-4.5 w-4.5" strokeWidth={2} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground">Enabling professional independence</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      We do not replace the owner’s responsibility; we sharpen it. By providing comparative project scale data and technical prompts, we help owners ask the right questions and conduct better independent due diligence.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-16 sm:py-20 bg-background border-b border-border/20">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-times text-[#0D3B21] dark:text-white leading-tight">
              Our Operational Values
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              The fundamental principles that guide every discovery matching and regulatory context we compile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="p-2 rounded-[2rem] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 group transition-all duration-700 ease-spring hover:scale-[1.01]"
                >
                  <div className="h-full rounded-[calc(2rem-0.5rem)] bg-white dark:bg-[#071f12] border border-border/40 dark:border-border/10 p-6 sm:p-8 flex items-start gap-4 shadow-soft">
                    <div className="h-10 w-10 rounded-xl bg-[#1A5C35]/10 flex items-center justify-center text-[#1A5C35] dark:text-[#52b788] shrink-0">
                      <Icon className="h-5 w-5" strokeWidth={1.25} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base font-bold font-times text-[#0D3B21] dark:text-white">
                        {v.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {v.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 sm:py-20 bg-[#FAF9F6] dark:bg-[#07150e] overflow-hidden">
        <div className="absolute inset-0 bg-[#FAF9F6]/20 dark:bg-transparent pointer-events-none" />
        <div
          className="absolute left-1/2 bottom-[-10%] w-[35vw] h-[35vw] opacity-10 dark:opacity-[0.03] pointer-events-none rounded-full -translate-x-1/2"
          style={{
            background: "radial-gradient(circle, #F3B24A, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-times text-[#0D3B21] dark:text-white leading-tight">
            Ready to build with absolute transparency?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Join thousands of property owners and verified builders who rely on Jointlly to secure real estate construction pipelines.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Button-in-button */}
            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-between rounded-full bg-gradient-to-r from-[#1A5C35] to-[#0D3B21] hover:from-[#217041] hover:to-[#0f4728] pl-6 pr-2 py-2 text-sm font-bold text-white shadow-lg transition-colors"
            >
              <span className="font-sans tracking-wide pr-6">Contact Us</span>
              <div className="h-8 h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowRight className="h-4.5 w-4.5" strokeWidth={2} />
              </div>
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto text-xs font-bold text-[#0D3B21] dark:text-white hover:underline uppercase tracking-wider"
            >
              Explore Platform
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
