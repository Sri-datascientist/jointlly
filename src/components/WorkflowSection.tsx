import { motion } from "framer-motion";
import { ClipboardList, ShieldCheck, GitPullRequest, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Define Project Details",
    description: "Input land dimensions, zoning, preferred construction style (Residential, Commercial, Industrial, Interior), and budget parameters.",
  },
  {
    icon: ShieldCheck,
    step: "02",
    title: "Neutral Validation Check",
    description: "Jointlly performs baseline identity and ownership data alignment, compiles builder litigation history, and aggregates public property records on demand.",
  },
  {
    icon: GitPullRequest,
    step: "03",
    title: "Algorithmic Matchmaking",
    description: "Receive pre-screened developer matches based on capacity, locality credentials, past ratings, and verified bidding metrics.",
  },
  {
    icon: FileCheck,
    step: "04",
    title: "Transparent Contract Sign-off",
    description: "Deploy standardized legal contract templates and structure clear, verified milestone checkpoints for seamless project execution.",
  },
] as const;

const WorkflowSection = () => {
  return (
    <section className="relative py-16 sm:py-20 md:py-24 bg-[#FAF9F6] dark:bg-[#07150e] overflow-hidden border-t border-border/20">
      {/* Background blurs */}
      <div className="absolute inset-0 bg-[#FAF9F6]/20 dark:bg-transparent pointer-events-none" />
      <div
        className="absolute left-[-5%] bottom-0 w-[40vw] h-[40vw] opacity-15 dark:opacity-[0.04] pointer-events-none rounded-full"
        style={{
          background: "radial-gradient(circle, #F3B24A, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#F3B24A]/25 dark:border-[#F3B24A]/20 bg-[#F3B24A]/5 text-[10px] uppercase tracking-[0.2em] font-medium text-[#9a7228] dark:text-[#F3B24A] mb-4"
          >
            <span>The Protocol</span>
          </motion.div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-times text-[#0D3B21] dark:text-white leading-[1.1] tracking-tight">
            The Matchmaking Process
          </h2>
          <p className="mt-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
            How Jointlly coordinates landowners and construction companies under a verified, secure agreement flow.
          </p>
        </div>

        {/* Steps Grid - Asymmetric horizontal cascade */}
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Connector line for desktop */}
          <div className="absolute top-1/2 left-[12%] right-[12%] h-[1px] bg-gradient-to-r from-[#1A5C35]/25 via-[#F3B24A]/40 to-[#1A5C35]/25 hidden md:block -translate-y-16" />

          {steps.map((s, idx) => {
            const Icon = s.icon;
            // Introduce slight staggered rotations/translations on hover to create haptic depth
            const translateOffset = idx % 2 === 0 ? "hover:-translate-y-1" : "hover:translate-y-1";

            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.32, 0.72, 0, 1] }}
                className={cn(
                  "h-[22rem] [perspective:1000px] group cursor-pointer",
                  translateOffset
                )}
              >
                {/* Flipping container */}
                <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  
                  {/* FRONT SIDE (Green Gradient) */}
                  <div className="absolute inset-0 w-full h-full rounded-[2.5rem] bg-gradient-to-br from-[#0D3B21] to-[#1A5C35] border border-[#52b788]/20 p-6 sm:p-8 flex flex-col justify-center items-center text-center space-y-6 shadow-xl [backface-visibility:hidden]">
                    {/* Step Icon circle */}
                    <div className="relative h-18 w-18 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-[#F3B24A] shadow-inner">
                      <Icon className="h-7 w-7" strokeWidth={1.5} />
                      <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-[#C9952A] border border-[#FAF9F6] text-white text-[10px] font-extrabold flex items-center justify-center shadow-md">
                        {s.step}
                      </div>
                    </div>
                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-extrabold font-times text-white leading-snug tracking-tight">
                      {s.title}
                    </h3>
                    <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#F3B24A]/80 flex items-center gap-1">
                      <span>Hover to reveal</span>
                      <span className="animate-pulse">→</span>
                    </div>
                  </div>

                  {/* BACK SIDE (Yellow/Gold Gradient) */}
                  <div className="absolute inset-0 w-full h-full rounded-[2.5rem] bg-gradient-to-br from-[#9a7228] via-[#C9952A] to-[#F3B24A] border border-[#F3B24A]/40 p-6 sm:p-8 flex flex-col justify-center items-center text-center space-y-4 shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div className="h-8 w-8 rounded-full bg-[#0D3B21] text-white text-xs font-black flex items-center justify-center shadow-sm mb-2">
                      {s.step}
                    </div>
                    <h3 className="text-lg font-extrabold font-times text-[#0D3B21] leading-snug">
                      {s.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#0D3B21] font-bold leading-relaxed max-w-xs">
                      {s.description}
                    </p>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WorkflowSection;
