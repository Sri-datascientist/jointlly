import { type ComponentProps, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Inbox, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export const adminPanelShell = "theme-panel overflow-hidden";

export function AdminLoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 theme-muted">
      <Loader2 className="h-10 w-10 animate-spin theme-brand" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

export function AdminErrorState({ message }: { message: string }) {
  return (
    <div className={cn(adminPanelShell, "p-6")}>
      <p className="text-destructive font-medium">{message}</p>
    </div>
  );
}

type AdminDataPanelProps = {
  toolbar?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function AdminDataPanel({ toolbar, footer, children, className }: AdminDataPanelProps) {
  return (
    <div className={cn(adminPanelShell, className)}>
      {toolbar ? (
        <div className="flex flex-col gap-3 border-b border-[#1A5C35]/10 dark:border-border bg-[#fafcfb] dark:bg-muted/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          {toolbar}
        </div>
      ) : null}
      {children}
      {footer ? (
        <div className="border-t border-[#1A5C35]/10 dark:border-border theme-surface-soft px-5 py-3 text-xs theme-muted">
          {footer}
        </div>
      ) : null}
    </div>
  );
}

export function AdminToolbarTitle({
  label,
  count,
}: {
  label: string;
  count?: number;
}) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <span className="text-sm font-semibold theme-heading">{label}</span>
      {count != null ? (
        <span className="inline-flex rounded-full bg-[#1A5C35]/10 dark:bg-primary/15 px-2.5 py-0.5 text-xs font-semibold tabular-nums theme-brand">
          {count}
        </span>
      ) : null}
    </div>
  );
}

export function AdminToolbarActions({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2 sm:justify-end">{children}</div>;
}

export function AdminTableWrap({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto">{children}</div>;
}

export function AdminTable({ className, ...props }: ComponentProps<typeof Table>) {
  return (
    <Table className={cn("min-w-[720px]", className)} {...props} />
  );
}

export function AdminTableHeader({ className, ...props }: ComponentProps<typeof TableHeader>) {
  return <TableHeader className={cn("[&_tr]:border-[#1A5C35]/10 dark:[&_tr]:border-border", className)} {...props} />;
}

export function AdminTableHead({ className, ...props }: ComponentProps<typeof TableHead>) {
  return (
    <TableHead
      className={cn(
        "h-11 bg-[#f4f9f6] dark:bg-muted/50 px-4 text-[11px] font-bold uppercase tracking-[0.08em] text-[#1A5C35]/75 dark:text-primary whitespace-nowrap",
        className,
      )}
      {...props}
    />
  );
}

export function AdminTableBody({ className, ...props }: ComponentProps<typeof TableBody>) {
  return <TableBody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function AdminTableRow({ className, ...props }: ComponentProps<typeof TableRow>) {
  return (
    <TableRow
      className={cn(
        "border-b border-[#1A5C35]/8 dark:border-border hover:bg-[#1A5C35]/[0.04] dark:hover:bg-muted/40 transition-colors",
        className,
      )}
      {...props}
    />
  );
}

export function AdminTableCell({
  muted,
  className,
  ...props
}: ComponentProps<typeof TableCell> & { muted?: boolean }) {
  return (
    <TableCell
      className={cn(
        "px-4 py-3.5 align-middle text-sm text-[#1A2E1A] dark:text-foreground",
        muted && "text-[#1A2E1A]/60 dark:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function AdminTableEmpty({
  colSpan,
  message = "No records found.",
}: {
  colSpan: number;
  message?: string;
}) {
  return (
    <AdminTableRow className="hover:bg-transparent">
      <AdminTableCell colSpan={colSpan} className="py-16 text-center">
        <div className="flex flex-col items-center gap-2 theme-muted">
          <Inbox className="h-8 w-8 text-[#1A5C35]/30 dark:text-primary/35" />
          <p className="text-sm font-medium">{message}</p>
        </div>
      </AdminTableCell>
    </AdminTableRow>
  );
}

export function AdminTableAction({
  to,
  onClick,
  label = "View",
}: {
  to?: string;
  onClick?: () => void;
  label?: string;
}) {
  const content = (
    <>
      {label}
      <ArrowRight className="h-3.5 w-3.5" />
    </>
  );

  if (to) {
    return (
      <Button
        variant="outline"
        size="sm"
        asChild
        className="h-8 gap-1.5 border-[#1A5C35]/20 dark:border-primary/25 text-[#1A5C35] dark:text-primary hover:bg-[#1A5C35]/8 dark:hover:bg-primary/10 hover:text-[#0D3B21] dark:hover:text-foreground"
      >
        <Link to={to}>{content}</Link>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="h-8 gap-1.5 border-[#1A5C35]/20 dark:border-primary/25 text-[#1A5C35] dark:text-primary hover:bg-[#1A5C35]/8 dark:hover:bg-primary/10 hover:text-[#0D3B21] dark:hover:text-foreground"
    >
      {content}
    </Button>
  );
}

export function formatAdminDate(value?: string | null): string {
  if (!value) return "—";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function formatAdminDateTime(value?: string | null): { date: string; time: string } {
  if (!value) return { date: "Never", time: "" };
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return { date: "—", time: "" };
  return {
    date: dt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
    time: dt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
  };
}

export function AdminDateTimeCell({ value }: { value?: string | null }) {
  const { date, time } = formatAdminDateTime(value);
  return (
    <div className="min-w-[7.5rem]">
      <div className="font-medium text-[#1A2E1A]/85 dark:text-foreground">{date}</div>
      {time ? <div className="text-xs theme-muted">{time}</div> : null}
    </div>
  );
}

type RoleKey = "ADMIN" | "LANDOWNER" | "PROFESSIONAL" | string;

export function AdminRoleBadge({ role }: { role: RoleKey }) {
  const styles: Record<string, string> = {
    ADMIN: "bg-[#0D3B21] text-white border-[#0D3B21]",
    LANDOWNER: "bg-[#eef6f1] dark:bg-primary/15 text-[#1A5C35] dark:text-primary border-[#1A5C35]/20 dark:border-primary/25",
    PROFESSIONAL: "bg-[#fdf4e8] dark:bg-accent/15 text-[#8a6420] dark:text-accent border-[#C9952A]/30 dark:border-accent/30",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        styles[role] ?? "bg-[#f4f4f4] dark:bg-muted text-[#1A2E1A]/70 dark:text-muted-foreground border-[#1A2E1A]/10 dark:border-border",
      )}
    >
      {role}
    </span>
  );
}

export function AdminActiveBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
        active ? "bg-[#1A5C35]/12 dark:bg-primary/15 text-[#1A5C35] dark:text-primary" : "bg-[#1A2E1A]/8 dark:bg-muted text-[#1A2E1A]/55 dark:text-muted-foreground",
      )}
    >
      {active ? "Yes" : "No"}
    </span>
  );
}

export function AdminStatusBadge({
  status,
  variant = "neutral",
}: {
  status: string;
  variant?: "success" | "warning" | "danger" | "neutral";
}) {
  const styles = {
    success: "bg-[#1A5C35]/12 dark:bg-primary/15 text-[#1A5C35] dark:text-primary border-[#1A5C35]/20 dark:border-primary/25",
    warning: "bg-[#fdf4e8] dark:bg-accent/15 text-[#8a6420] dark:text-accent border-[#C9952A]/30 dark:border-accent/30",
    danger: "bg-red-50 dark:bg-destructive/15 text-red-700 dark:text-red-300 border-red-200 dark:border-destructive/30",
    neutral: "bg-[#f4f4f4] dark:bg-muted text-[#1A2E1A]/70 dark:text-muted-foreground border-[#1A2E1A]/10 dark:border-border",
  };
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold", styles[variant])}>
      {status}
    </span>
  );
}

export function approvalBadgeVariant(
  status: string,
): "success" | "warning" | "danger" | "neutral" {
  if (status === "APPROVED") return "success";
  if (status === "REJECTED") return "danger";
  return "warning";
}

export function AdminBackLink({ to, label }: { to: string; label: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      asChild
      className="mb-4 gap-2 border-[#1A5C35]/20 dark:border-primary/25 text-[#1A5C35] dark:text-primary hover:bg-[#1A5C35]/8 dark:hover:bg-primary/10 hover:text-[#0D3B21] dark:hover:text-foreground"
    >
      <Link to={to}>
        <ArrowLeft className="h-4 w-4" />
        {label}
      </Link>
    </Button>
  );
}

export function AdminSectionPanel({
  title,
  count,
  actions,
  children,
  className,
}: {
  title: string;
  count?: number;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <AdminDataPanel
      className={className}
      toolbar={
        <>
          <AdminToolbarTitle label={title} count={count} />
          {actions ? <AdminToolbarActions>{actions}</AdminToolbarActions> : null}
        </>
      }
    >
      <div className="p-4 sm:p-5">{children}</div>
    </AdminDataPanel>
  );
}

export function AdminDetailGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2", className)}>{children}</div>
  );
}

export function AdminDetailField({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-[#1A5C35]/12 dark:border-border theme-surface-soft p-3.5", className)}>
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#1A5C35]/65 dark:text-primary/70">{label}</p>
      <div className="mt-1.5 text-sm font-medium theme-heading break-words">{value}</div>
    </div>
  );
}

export function AdminInlineEmpty({ message = "No records." }: { message?: string }) {
  return <p className="text-sm theme-muted py-2">{message}</p>;
}

export function AdminCellPrimary({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("font-medium theme-heading", className)}>{children}</div>;
}

export function AdminCellSecondary({
  children,
  className,
  title,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <div className={cn("text-xs theme-muted truncate", className)} title={title}>
      {children}
    </div>
  );
}

export function AdminCellStack({
  primary,
  secondary,
  secondaryTitle,
}: {
  primary: ReactNode;
  secondary?: ReactNode;
  secondaryTitle?: string;
}) {
  return (
    <>
      <AdminCellPrimary>{primary}</AdminCellPrimary>
      {secondary != null && secondary !== "" ? (
        <AdminCellSecondary title={secondaryTitle}>{secondary}</AdminCellSecondary>
      ) : null}
    </>
  );
}
