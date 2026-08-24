import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const dashboardCardShell = "theme-panel relative overflow-hidden";

export function DashboardCardBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8fcf9] via-white to-[#eef6f1] dark:from-card dark:via-card dark:to-muted/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(82,183,136,0.08),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(82,183,136,0.14),transparent_55%)]" />
    </>
  );
}

export function DashboardLoadingState({ label = "Loading dashboard…" }: { label?: string }) {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 theme-muted">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#1A5C35]/20 border-t-[#1A5C35] dark:border-primary/30 dark:border-t-primary" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

type DashboardPageHeaderProps = {
  title: string;
  subtitle: string;
  badge?: string;
  action?: ReactNode;
};

export function DashboardPageHeader({ title, subtitle, badge, action }: DashboardPageHeaderProps) {
  return (
    <div className="mb-8 sm:mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {badge ? (
          <span className="inline-flex mb-3 rounded-full bg-[#1A5C35]/10 border border-[#1A5C35]/20 dark:bg-primary/15 dark:border-primary/25 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] theme-brand">
            {badge}
          </span>
        ) : null}
        <h1 className="font-times text-3xl sm:text-4xl theme-heading tracking-tight">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm sm:text-base theme-body leading-relaxed">
          {subtitle}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

type DashboardStatCardProps = {
  label: string;
  value: number | string;
  icon: LucideIcon;
  index?: number;
  href?: string;
  accent?: "green" | "gold" | "mint";
};

const statAccents = {
  green: "from-[#1A5C35] to-[#0D3B21]",
  gold: "from-[#C9952A] to-[#8a6420]",
  mint: "from-[#52b788] to-[#1A5C35]",
};

export function DashboardStatCard({
  label,
  value,
  icon: Icon,
  index = 0,
  href,
  accent = "green",
}: DashboardStatCardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={cn(
        dashboardCardShell,
        "rounded-xl p-3.5 sm:p-4 transition-all duration-300",
        href && "hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(26,92,53,0.1)] dark:hover:shadow-[0_6px_24px_rgba(0,0,0,0.35)] hover:border-[#1A5C35]/25 dark:hover:border-primary/30",
      )}
    >
      <DashboardCardBackground />
      <div className="relative flex items-start justify-between gap-2">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br shadow-sm",
            statAccents[accent],
          )}
        >
          <Icon className="h-4 w-4 text-white" />
        </div>
        <p className="text-2xl font-bold tabular-nums theme-heading">{value}</p>
      </div>
      <p className="relative mt-2 text-xs font-medium theme-body">{label}</p>
      {href ? (
        <span className="relative mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold theme-brand">
          View details <ArrowRight className="h-3 w-3" />
        </span>
      ) : null}
    </motion.div>
  );

  if (href) {
    return (
      <Link to={href} className="block">
        {content}
      </Link>
    );
  }
  return content;
}

type DashboardPromoBannerProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  ctaLabel: string;
  ctaTo: string;
  variant?: "light" | "gradient";
};

export function DashboardPromoBanner({
  title,
  description,
  icon: Icon,
  ctaLabel,
  ctaTo,
  variant = "gradient",
}: DashboardPromoBannerProps) {
  if (variant === "gradient") {
    return (
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative mb-8 sm:mb-10 overflow-hidden rounded-2xl border border-[#1A5C35]/25 shadow-[0_8px_32px_rgba(26,92,53,0.15)]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D3B21] via-[#1A5C35] to-[#2d6e48]" />
        <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.12)_0%,transparent_50%)]" />
        <div className="relative flex flex-col gap-5 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 border border-white/25 backdrop-blur-sm">
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-times text-xl sm:text-2xl !text-white">{title}</h2>
              <p className="mt-1 text-sm text-white/80 leading-relaxed max-w-xl">{description}</p>
            </div>
          </div>
          <Link
            to={ctaTo}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#0D3B21] shadow-lg transition hover:bg-[#f0fdf4] min-h-[44px]"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(dashboardCardShell, "mb-8 sm:mb-10 p-6 sm:p-8")}
    >
      <DashboardCardBackground />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1A5C35]/10 border border-[#1A5C35]/15 dark:bg-primary/15 dark:border-primary/25">
            <Icon className="h-5 w-5 theme-brand" />
          </div>
          <div>
            <h2 className="font-semibold text-lg theme-heading">{title}</h2>
            <p className="mt-1 text-sm theme-body">{description}</p>
          </div>
        </div>
        <Link
          to={ctaTo}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1A5C35] to-[#0D3B21] px-5 py-2.5 text-sm font-semibold text-white shadow-md min-h-[44px]"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.section>
  );
}

type DashboardSectionHeaderProps = {
  title: string;
  subtitle?: string;
  viewAllTo?: string;
  viewAllLabel?: string;
};

export function DashboardSectionHeader({
  title,
  subtitle,
  viewAllTo,
  viewAllLabel = "View all",
}: DashboardSectionHeaderProps) {
  return (
    <div className="mb-5 sm:mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-times text-xl sm:text-2xl theme-heading">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm theme-muted">{subtitle}</p> : null}
      </div>
      {viewAllTo ? (
        <Link
          to={viewAllTo}
          className="inline-flex items-center gap-1 text-sm font-semibold theme-brand hover:underline"
        >
          {viewAllLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}

type DashboardQuickActionCardProps = {
  to: string;
  label: string;
  description: string;
  icon: LucideIcon;
  completed?: boolean;
  index?: number;
};

export function DashboardQuickActionCard({
  to,
  label,
  description,
  icon: Icon,
  completed = false,
  index = 0,
}: DashboardQuickActionCardProps) {
  return (
    <Link to={to} className="block h-full group">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.06 }}
        className={cn(
          dashboardCardShell,
          "flex h-full min-h-[220px] flex-col p-5 sm:p-6 transition-all duration-300",
          "hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(26,92,53,0.12)] dark:hover:shadow-[0_12px_36px_rgba(0,0,0,0.4)]",
          completed ? "border-[#52b788]/50 ring-1 ring-[#52b788]/20" : "hover:border-[#1A5C35]/30 dark:hover:border-primary/35",
        )}
      >
        <DashboardCardBackground />
        {completed ? (
          <div className="absolute left-0 top-4 bottom-4 w-1 rounded-full bg-gradient-to-b from-[#52b788] to-[#1A5C35]" />
        ) : null}
        <div className="relative flex flex-1 flex-col">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#1A5C35] to-[#0D3B21] shadow-md transition group-hover:scale-105">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="font-semibold theme-heading mb-2 line-clamp-2">{label}</h3>
          <p className="text-sm theme-muted line-clamp-3 flex-1">{description}</p>
          {completed ? (
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide theme-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-[#52b788]" />
              Profile complete
            </p>
          ) : (
            <p className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#1A5C35]/70 dark:text-primary/70 group-hover:text-[#1A5C35] dark:group-hover:text-primary">
              Get started <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
