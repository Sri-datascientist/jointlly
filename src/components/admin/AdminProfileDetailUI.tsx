import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AdminStatusBadge, adminPanelShell } from "@/components/admin/AdminTableUI";
import { cn } from "@/lib/utils";

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function capabilityLabel(type: string): string {
  const map: Record<string, string> = {
    CONSTRUCTION: "Contract",
    JV_JD: "JV/JD",
    INTERIOR: "Interior",
    RECONSTRUCTION: "Renovation",
  };
  return map[type] ?? type.replace(/_/g, " ");
}

export function projectStatusVariant(status: string): "success" | "warning" | "neutral" {
  const s = status.toUpperCase();
  if (s.includes("PUBLISH") || s.includes("COMPLETE") || s.includes("DELIVER") || s === "APPROVED") {
    return "success";
  }
  if (s.includes("DRAFT") || s.includes("PROGRESS") || s.includes("PENDING")) return "warning";
  return "neutral";
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1A5C35]/70 dark:text-primary/70 mb-3">{children}</h2>
  );
}

export function ProfileStat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="text-center sm:text-left">
      <p className="font-times text-2xl sm:text-3xl theme-heading tabular-nums leading-none">{value}</p>
      <p className="mt-1.5 text-xs theme-muted">{label}</p>
    </div>
  );
}

export function HistoryRow({
  title,
  meta,
  status,
  accent = "green",
}: {
  title: string;
  meta: string;
  status: string;
  accent?: "green" | "gold";
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#1A5C35]/8 dark:border-border last:border-0">
      <div
        className={cn(
          "mt-0.5 h-9 w-9 shrink-0 rounded-lg",
          accent === "green" ? "bg-[#eef6f1] dark:bg-primary/15" : "bg-[#fdf4e8] dark:bg-accent/15",
        )}
      />
      <div className="min-w-0 flex-1">
        <p className="font-medium theme-heading text-sm">{title}</p>
        <p className="mt-0.5 text-xs theme-muted">{meta}</p>
      </div>
      <AdminStatusBadge status={status} variant={projectStatusVariant(status)} />
    </div>
  );
}

export function ContextRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5 border-b border-[#1A5C35]/8 dark:border-border last:border-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <span className="text-xs theme-muted shrink-0">{label}</span>
      <span className="text-sm font-medium theme-heading text-left sm:text-right break-words">{value}</span>
    </div>
  );
}

export function ProfileBreadcrumb({
  backTo,
  backLabel,
  current,
}: {
  backTo: string;
  backLabel: string;
  current: string;
}) {
  return (
    <nav className="mb-5 flex items-center gap-2 text-sm theme-muted">
      <Link
        to={backTo}
        className="inline-flex items-center gap-1 font-medium theme-brand transition-colors hover:text-[#0D3B21] dark:hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        {backLabel}
      </Link>
      <span className="text-[#1A2E1A]/30 dark:text-muted-foreground/40">/</span>
      <span className="truncate font-medium theme-heading">{current}</span>
    </nav>
  );
}

export function ProfileHeroCard({
  displayName,
  subtitle,
  tags,
  stats,
}: {
  displayName: string;
  subtitle: string;
  tags?: ReactNode;
  stats: Array<{ value: string | number; label: string }>;
}) {
  return (
    <div className={cn(adminPanelShell, "mb-6 p-5 sm:p-6")}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#F9F1E7] dark:bg-accent/15 font-times text-xl font-semibold text-[#8a6420] dark:text-accent">
          {getInitials(displayName)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-times text-2xl tracking-tight theme-heading sm:text-3xl">{displayName}</h1>
            {tags}
          </div>
          <p className="mt-1.5 text-sm theme-muted">{subtitle}</p>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {stats.map((stat) => (
              <ProfileStat key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileSection({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn(adminPanelShell, "p-5 sm:p-6", className)}>{children}</section>;
}

export function AreasServed({ areas }: { areas: string[] }) {
  if (areas.length === 0) return null;
  return (
    <ProfileSection>
      <SectionLabel>Areas served</SectionLabel>
      <div className="flex flex-wrap gap-2">
        {areas.map((area) => (
          <span
            key={area}
            className="inline-flex rounded-lg border border-[#1A5C35]/15 dark:border-border theme-surface-soft px-3 py-1.5 text-sm theme-heading"
          >
            {area}
          </span>
        ))}
      </div>
    </ProfileSection>
  );
}

export function SpecialisationsList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ProfileSection>
      <SectionLabel>Specialisations</SectionLabel>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm theme-body">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1A5C35]" />
            {item}
          </li>
        ))}
      </ul>
    </ProfileSection>
  );
}

export function DetailRecordsPanel({
  title,
  defaultOpen = false,
  open,
  onOpenChange,
  children,
  id,
}: {
  title: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  id?: string;
}) {
  return (
    <div id={id} className="mt-8 space-y-4">
      <Collapsible
        open={open}
        onOpenChange={onOpenChange}
        defaultOpen={open === undefined ? defaultOpen : undefined}
      >
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className={cn(
              adminPanelShell,
              "group flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-[#fafcfb] dark:hover:bg-muted/40",
            )}
          >
            <span className="font-semibold theme-heading">{title}</span>
            <ChevronDown className="h-5 w-5 theme-brand transition-transform group-data-[state=open]:rotate-180" />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">{children}</CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export function CapabilityTag({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-full bg-[#eef6f1] dark:bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide theme-brand">
      {label}
    </span>
  );
}
