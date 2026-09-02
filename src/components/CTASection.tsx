import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { optionsPathForUserType } from "@/lib/api";
import { cn } from "@/lib/utils";

type PremiumCtaCardProps = {
  title: string;
  subtitle: string;
  onClick: (e: React.MouseEvent) => void;
  accent?: "primary" | "gold";
  delay?: number;
};

const PremiumCtaCard = ({
  title,
  subtitle,
  onClick,
  accent = "primary",
  delay = 0,
}: PremiumCtaCardProps) => {
  const isGold = accent === "gold";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.985 }}
      className={cn(
        "group relative w-full text-left rounded-[1.35rem] text-white",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
    >
      {/* Hover ambient glow */}
      <div
        className={cn(
          "absolute -inset-3 rounded-[1.5rem] opacity-40 blur-2xl transition-opacity duration-700 group-hover:opacity-100",
          isGold
            ? "bg-[radial-gradient(circle_at_50%_50%,rgba(201,149,42,0.4),rgba(26,92,53,0.15)_70%)]"
            : "bg-[radial-gradient(circle_at_50%_50%,rgba(82,183,136,0.45),rgba(26,92,53,0.2)_70%)]",
        )}
      />

      {/* Gradient border frame */}
      <div
        className={cn(
          "absolute inset-0 rounded-[1.35rem] p-[1px] transition-opacity duration-500 opacity-90 group-hover:opacity-100",
          isGold
            ? "bg-gradient-to-br from-[#C9952A]/70 via-[#7ec99a]/50 to-[#0D3B21]/80"
            : "bg-gradient-to-br from-[#7ec99a]/60 via-[#C9952A]/25 to-[#0D3B21]/70",
        )}
      />

      {/* Card surface — premium green gradient */}
      <div
        className={cn(
          "relative overflow-hidden rounded-[1.34rem] backdrop-blur-xl transition-all duration-500",
          isGold
            ? "bg-[linear-gradient(145deg,#0a2e1a_0%,#1A5C35_42%,#245c38_78%,#1a4a2e_100%)] shadow-[0_4px_6px_rgba(13,59,33,0.25),0_18px_50px_rgba(26,92,53,0.28),inset_0_1px_0_rgba(255,255,255,0.15)] group-hover:shadow-[0_10px_20px_rgba(13,59,33,0.3),0_30px_64px_rgba(26,92,53,0.35),inset_0_1px_0_rgba(255,255,255,0.22)]"
            : "bg-[linear-gradient(145deg,#0D3B21_0%,#1A5C35_38%,#3d8f5c_72%,#52b788_100%)] shadow-[0_4px_6px_rgba(13,59,33,0.25),0_18px_50px_rgba(26,92,53,0.28),inset_0_1px_0_rgba(255,255,255,0.15)] group-hover:shadow-[0_10px_20px_rgba(13,59,33,0.3),0_30px_64px_rgba(26,92,53,0.35),inset_0_1px_0_rgba(255,255,255,0.22)]",
        )}
      >
        {/* Depth + soft vignette (keeps text readable) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/15 via-transparent to-black/25" />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a2e1a]/70 via-[#0a2e1a]/15 to-transparent"
        />
        {/* Inner glass shine — subtle, not washing out text */}
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.04)_32%,transparent_50%)]"
        />
        <div
          className={cn(
            "pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full blur-3xl transition-opacity duration-500 opacity-40 group-hover:opacity-65",
            isGold
              ? "bg-[radial-gradient(circle,rgba(201,149,42,0.35)_0%,transparent_70%)]"
              : "bg-[radial-gradient(circle,rgba(168,230,196,0.35)_0%,transparent_70%)]",
          )}
        />

        {/* Hover sweep */}
        <div
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/12 to-transparent skew-x-12 transition-transform duration-700 group-hover:translate-x-full"
        />

        <div className="relative flex min-h-[136px] sm:min-h-[152px] items-center justify-between gap-4 px-5 sm:px-7 py-5 sm:py-6">
          <div className="min-w-0 space-y-2.5">
            <h3
              className="font-times text-[1.35rem] sm:text-[1.55rem] leading-tight tracking-[0.02em] !text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.35)]"
            >
              {title}
            </h3>
            <p
              className="inline-flex items-center rounded-full border border-white/30 bg-white/20 px-3.5 py-1 font-westack text-xs sm:text-sm font-medium !text-white backdrop-blur-md [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]"
            >
              {subtitle}
            </p>
          </div>

          {/* Arrow control */}
          <div
            className={cn(
              "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
              "border border-white/35 backdrop-blur-sm transition-all duration-400",
              "group-hover:scale-110",
              isGold
                ? "bg-gradient-to-br from-[#e8c06a] to-[#9a7228] shadow-[0_4px_18px_rgba(201,149,42,0.5)] group-hover:shadow-[0_6px_24px_rgba(201,149,42,0.65)]"
                : "bg-white/22 shadow-[0_4px_18px_rgba(0,0,0,0.2)] group-hover:bg-white/30 group-hover:shadow-[0_6px_24px_rgba(82,183,136,0.45)]",
            )}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/25 to-transparent opacity-60" />
            <svg
              className="relative h-5 w-5 text-white transition-transform duration-300 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className={cn(
            "mx-6 h-px bg-gradient-to-r from-transparent to-transparent transition-all duration-500",
            isGold
              ? "via-[#C9952A]/50 group-hover:via-[#d4a84a]/70"
              : "via-[#7ec99a]/45 group-hover:via-[#a8e6c4]/65",
          )}
        />
      </div>
    </motion.button>
  );
};

const CTASection = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleBuilderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/auth", { state: { userType: "builder" } });
    } else if (user) {
      navigate(optionsPathForUserType(user.userType));
    }
  };

  const handleLandownerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/auth", { state: { userType: "landowner" } });
    } else if (user) {
      navigate(optionsPathForUserType(user.userType));
    }
  };

  return (
    <section className="relative py-20 sm:py-24 md:py-32 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 jointlly-grid opacity-35" />

      <motion.div
        className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full bg-glow-gradient blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full blur-3xl"
        style={{ background: "var(--gradient-accent-glow)" }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#1A5C35]/20 dark:border-[#52b788]/25 bg-[#1A5C35]/8 dark:bg-[#52b788]/10 text-xs uppercase tracking-[0.18em] font-semibold text-[#1A5C35] dark:text-[#52b788] mb-4">
            <span>Regulatory & Governance Norms</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="text-foreground">Building Norms &</span>
            <br />
            <span className="text-accent">Government Guidelines</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-1 leading-relaxed">
            Stay compliant with active municipal master plans, BBMP & BDA setback rules, RERA project registration requirements, and FAR loading limits before initiating development contracts.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground/80">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1A5C35] dark:text-[#52b788]" />
              BBMP & BDA Setback Compliance
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground/80">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1A5C35] dark:text-[#52b788]" />
              RERA Project Registration
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-foreground/80">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1A5C35] dark:text-[#52b788]" />
              FAR & TDR Calculation Rules
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-3xl mx-auto">
          <PremiumCtaCard
            title="Landowner"
            subtitle="Property Owner"
            onClick={handleLandownerClick}
            accent="primary"
            delay={0.1}
          />
          <PremiumCtaCard
            title="Construction Company"
            subtitle="Builder"
            onClick={handleBuilderClick}
            accent="gold"
            delay={0.2}
          />
        </div>
      </div>
    </section>
  );
};

export default CTASection;
