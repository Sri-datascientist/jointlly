import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { DashboardPageMeta } from "@/lib/dashboardLayoutMeta";

export const dashboardGreenHeaderHeight = "h-[9rem]";

export const dashboardLayoutShell = {
  pageBg: "bg-[#eef3ef] dark:bg-background",
  sidebar:
    "hidden lg:flex w-[17.5rem] shrink-0 flex-col min-h-0 m-3 ml-4 mb-3 rounded-2xl border border-[#1A5C35]/12 bg-white dark:bg-card dark:border-border shadow-[0_8px_32px_rgba(26,92,53,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)] overflow-hidden",
  mainPanel:
    "flex-1 flex flex-col min-w-0 min-h-0 m-3 mr-4 mb-3 rounded-2xl border border-[#1A5C35]/12 bg-white dark:bg-card dark:border-border shadow-[0_8px_32px_rgba(26,92,53,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden",
  contentScroll:
    "flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-[#FAF9F6] dark:bg-background px-4 sm:px-6 lg:px-8 py-6 pb-[max(1rem,env(safe-area-inset-bottom))]",
  sidebarHeader: cn(
    "relative shrink-0 border-b border-[#1A5C35]/15 bg-gradient-to-br from-[#0D3B21] via-[#1A5C35] to-[#2d6e48] px-5 py-6 flex flex-col justify-center",
    dashboardGreenHeaderHeight,
  ),
  sidebarHeaderShine:
    "absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.1)_0%,transparent_50%)]",
  mobileHeader:
    "lg:hidden shrink-0 border-b border-[#1A5C35]/15 bg-gradient-to-r from-[#0D3B21] via-[#1A5C35] to-[#2d6e48] z-50 pt-[env(safe-area-inset-top,0px)]",
};

export function sidebarNavLinkClass(active: boolean) {
  return cn(
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all group",
    active
      ? "bg-[#1A5C35]/12 text-[#0D3B21] dark:bg-primary/20 dark:text-foreground shadow-sm border border-[#1A5C35]/15 dark:border-primary/25"
      : "text-[#1A2E1A]/75 dark:text-muted-foreground hover:bg-[#1A5C35]/6 dark:hover:bg-primary/10 hover:text-[#0D3B21] dark:hover:text-foreground border border-transparent",
  );
}

export function sidebarSubNavLinkClass(active: boolean) {
  return cn(
    "flex items-center gap-3 rounded-xl py-2 pl-7 pr-3 text-sm font-medium transition-all",
    active
      ? "bg-[#1A5C35]/10 text-[#1A5C35] dark:bg-primary/15 dark:text-primary border border-[#1A5C35]/10 dark:border-primary/20"
      : "text-[#1A2E1A]/70 dark:text-muted-foreground hover:bg-[#1A5C35]/6 dark:hover:bg-primary/10 hover:text-[#0D3B21] dark:hover:text-foreground border border-transparent",
  );
}

export function DashboardLayoutGreenHeader({
  title,
  subtitle,
  action,
}: Omit<DashboardPageMeta, "badge"> & { action?: ReactNode }) {
  return (
    <div
      className={cn(
        "hidden lg:block shrink-0 relative border-b border-[#1A5C35]/20 bg-gradient-to-r from-[#0D3B21] via-[#1A5C35] to-[#2d6e48]",
        dashboardGreenHeaderHeight,
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.1)_0%,transparent_45%)]" />
      <div
        className={cn(
          "relative flex items-center justify-center px-5 py-6",
          dashboardGreenHeaderHeight,
        )}
      >
        <div className="min-w-0 max-w-full text-center">
          <h1 className="font-times text-2xl sm:text-3xl xl:text-4xl !text-white tracking-wide leading-tight">
            {title}
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-white/75 max-w-2xl mx-auto line-clamp-2">{subtitle}</p>
        </div>
        {action ? (
          <div className="absolute right-5 top-1/2 shrink-0 -translate-y-1/2">{action}</div>
        ) : null}
      </div>
    </div>
  );
}
