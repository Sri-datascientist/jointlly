import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  UserCircle,
  Briefcase,
  FileText,
  FolderOpen,
  Link2,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { getAdminStats, type AdminStats } from "@/lib/api";
import {
  DashboardCardBackground,
  DashboardLoadingState,
  dashboardCardShell,
} from "@/components/dashboard/DashboardUI";
import { cn } from "@/lib/utils";

type AdminStatCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  sub?: string;
  path?: string;
  index: number;
};

function AdminStatCard({ label, value, icon: Icon, sub, path, index }: AdminStatCardProps) {
  const card = (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={cn(
        dashboardCardShell,
        "rounded-xl p-3.5 sm:p-4 h-full transition-all duration-300",
        path && "hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(26,92,53,0.1)] dark:hover:shadow-[0_6px_24px_rgba(0,0,0,0.35)] hover:border-[#1A5C35]/25 dark:hover:border-primary/30",
      )}
    >
      <DashboardCardBackground />
      {path ? (
        <ArrowRight className="absolute right-3.5 top-3.5 h-3.5 w-3.5 theme-brand opacity-50" />
      ) : null}
      <div className="relative flex flex-col items-center text-center">
        <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#1A5C35] to-[#0D3B21] shadow-sm">
          <Icon className="h-4 w-4 text-white" />
        </div>
        <p className="text-2xl font-bold tabular-nums theme-heading">{value}</p>
        <p className="mt-0.5 text-xs font-semibold theme-body">{label}</p>
        {sub ? (
          <p className="mt-1.5 text-[11px] theme-muted leading-relaxed">{sub}</p>
        ) : null}
      </div>
    </motion.div>
  );

  return path ? (
    <Link to={path} className="block h-full">
      {card}
    </Link>
  ) : (
    card
  );
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getAdminStats()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load stats");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <DashboardLoadingState label="Loading admin overview…" />;
  }

  if (error) {
    return (
      <div className={cn(dashboardCardShell, "p-6")}>
        <DashboardCardBackground />
        <p className="relative text-destructive font-medium">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  const cards: Array<{
    label: string;
    value: number;
    icon: LucideIcon;
    path?: string;
    sub?: string;
  }> = [
    {
      label: "Total users",
      value: stats.total_users,
      icon: Users,
      path: "/admin/users",
      sub: `${stats.users_landowner} landowners · ${stats.users_professional} professionals`,
    },
    { label: "Landowners", value: stats.total_landowners, icon: UserCircle, path: "/admin/landowners" },
    { label: "Professionals", value: stats.total_professionals, icon: Briefcase, path: "/admin/professionals" },
    {
      label: "Projects",
      value: stats.total_projects,
      icon: FolderOpen,
      path: "/admin/landowners",
      sub: `${stats.projects_draft} draft · ${stats.projects_published} published`,
    },
    {
      label: "Form submissions",
      value: stats.total_form_submissions,
      icon: FileText,
      path: "/admin/form-submissions",
    },
    {
      label: "Connections",
      value: stats.total_connections,
      icon: Link2,
      path: "/admin/connections",
      sub: "Marketplace selection records",
    },
  ];

  return (
    <div className="pb-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
        {cards.map((item, index) => (
          <AdminStatCard key={item.label} {...item} index={index} />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
