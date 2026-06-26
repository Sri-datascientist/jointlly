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
        "p-5 sm:p-6 h-full transition-all duration-300",
        path && "hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(26,92,53,0.12)] hover:border-[#1A5C35]/25",
      )}
    >
      <DashboardCardBackground />
      <div className="relative flex items-start justify-between gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1A5C35] to-[#0D3B21] shadow-sm">
          <Icon className="h-5 w-5 text-white" />
        </div>
        {path ? <ArrowRight className="h-4 w-4 text-[#1A5C35]/40" /> : null}
      </div>
      <p className="relative text-3xl font-bold tabular-nums text-[#0D3B21]">{value}</p>
      <p className="relative mt-1 text-sm font-semibold text-[#0D3B21]/80">{label}</p>
      {sub ? <p className="relative mt-2 text-xs text-[#1A2E1A]/55 leading-relaxed">{sub}</p> : null}
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
      value: stats.total_projects,
      icon: Link2,
      path: "/admin/connections",
      sub: "Marketplace selection records",
    },
  ];

  return (
    <div className="pb-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {cards.map((item, index) => (
          <AdminStatCard key={item.label} {...item} index={index} />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
