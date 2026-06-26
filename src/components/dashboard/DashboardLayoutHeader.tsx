import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { DashboardPageMeta } from "@/lib/dashboardLayoutMeta";

export const dashboardLayoutShell = {
  pageBg: "bg-[#eef3ef]",
  sidebar:
    "hidden lg:flex w-[17.5rem] shrink-0 flex-col min-h-0 m-3 ml-4 mb-3 rounded-2xl border border-[#1A5C35]/12 bg-white shadow-[0_8px_32px_rgba(26,92,53,0.1)] overflow-hidden",
  mainPanel:
    "flex-1 flex flex-col min-w-0 min-h-0 m-3 mr-4 mb-3 rounded-2xl border border-[#1A5C35]/12 bg-white shadow-[0_8px_32px_rgba(26,92,53,0.08)] overflow-hidden",
  contentScroll: "flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-[#FAF9F6] px-4 sm:px-6 lg:px-8 py-6 pb-[max(1rem,env(safe-area-inset-bottom))]",
  sidebarHeader:
    "relative shrink-0 border-b border-[#1A5C35]/15 bg-gradient-to-br from-[#0D3B21] via-[#1A5C35] to-[#2d6e48] px-5 py-5 min-h-[8rem] flex flex-col justify-center",
  sidebarHeaderShine:
    "absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.1)_0%,transparent_50%)]",
  mobileHeader:
    "lg:hidden shrink-0 border-b border-[#1A5C35]/15 bg-gradient-to-r from-[#0D3B21] via-[#1A5C35] to-[#2d6e48] z-50 pt-[env(safe-area-inset-top,0px)]",
};

export function sidebarNavLinkClass(active: boolean) {
  return cn(
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all group",
    active
      ? "bg-[#1A5C35]/12 text-[#0D3B21] shadow-sm border border-[#1A5C35]/15"
      : "text-[#1A2E1A]/75 hover:bg-[#1A5C35]/6 hover:text-[#0D3B21] border border-transparent",
  );
}

export function sidebarSubNavLinkClass(active: boolean) {
  return cn(
    "flex items-center gap-3 rounded-xl py-2 pl-7 pr-3 text-sm font-medium transition-all",
    active
      ? "bg-[#1A5C35]/10 text-[#1A5C35] border border-[#1A5C35]/10"
      : "text-[#1A2E1A]/70 hover:bg-[#1A5C35]/6 hover:text-[#0D3B21] border border-transparent",
  );
}

export function DashboardLayoutGreenHeader({
  title,
  subtitle,
  action,
}: Omit<DashboardPageMeta, "badge"> & { action?: ReactNode }) {
  return (
    <div className="hidden lg:block shrink-0 relative border-b border-[#1A5C35]/20 bg-gradient-to-r from-[#0D3B21] via-[#1A5C35] to-[#2d6e48] min-h-[8rem]">
      <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.1)_0%,transparent_45%)]" />
      <div className="relative h-full min-h-[8rem] px-5 py-5 flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="font-times text-lg !text-white tracking-wide truncate">{title}</h1>
          <p className="mt-0.5 text-xs text-white/70 truncate">{subtitle}</p>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
