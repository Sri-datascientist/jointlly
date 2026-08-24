import { useState, useMemo } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Briefcase,
  FileText,
  Link2,
  LifeBuoy,
  CreditCard,
  Home,
  ChevronRight,
  LogOut,
  Shield,
  Menu,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getAdminPageMeta } from "@/lib/dashboardLayoutMeta";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  dashboardLayoutShell,
  DashboardLayoutGreenHeader,
  sidebarNavLinkClass,
} from "@/components/dashboard/DashboardLayoutHeader";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/users", label: "Users", icon: Users },
  { path: "/admin/landowners", label: "Landowners", icon: UserCircle },
  { path: "/admin/professionals", label: "Professionals", icon: Briefcase },
  { path: "/admin/form-submissions", label: "Form submissions", icon: FileText },
  { path: "/admin/connections", label: "Connections", icon: Link2 },
  { path: "/admin/support-tickets", label: "Support tickets", icon: LifeBuoy },
  { path: "/admin/payments-cases", label: "Payments cases", icon: CreditCard },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const pageMeta = useMemo(() => getAdminPageMeta(location.pathname), [location.pathname]);

  return (
    <div className={cn("fixed inset-0 z-[1] flex w-full m-0 p-0 overflow-hidden", dashboardLayoutShell.pageBg)}>
      <aside className={dashboardLayoutShell.sidebar}>
        <div className={dashboardLayoutShell.sidebarHeader}>
          <div className={dashboardLayoutShell.sidebarHeaderShine} />
          <div className="relative space-y-3">
            <UserProfileDropdown
              variant="admin"
              triggerClassName="text-white hover:text-white/90 [&_*]:text-white/90"
            />
            <Link
              to="/admin/settings"
              className={cn(
                "hidden lg:flex items-center gap-2 rounded-lg py-1.5 pl-[52px] pr-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors",
                isActive("/admin/settings") && "text-white bg-white/10",
              )}
            >
              <Settings className="w-4 h-4 shrink-0" />
              Change password
            </Link>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-none">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={item.path} className={sidebarNavLinkClass(active)}>
                <item.icon
                  className={cn(
                    "w-5 h-5 shrink-0",
                    active ? "text-[#1A5C35]" : "text-[#1A2E1A]/45 group-hover:text-[#1A5C35]",
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight className="w-4 h-4 text-[#1A5C35]" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#1A5C35]/10 dark:border-border space-y-1 shrink-0 bg-[#f8fcf9] dark:bg-muted/30">
          <div className="flex items-center justify-between px-3 py-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1A2E1A]/45 dark:text-muted-foreground">Theme</span>
            <ThemeToggle variant="default" />
          </div>
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#1A2E1A]/75 dark:text-muted-foreground hover:bg-[#1A5C35]/6 dark:hover:bg-primary/10 hover:text-[#0D3B21] dark:hover:text-foreground transition-all group"
          >
            <Home className="w-5 h-5 text-[#1A2E1A]/45 group-hover:text-[#1A5C35]" />
            <span>Back to site</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#1A2E1A]/75 dark:text-muted-foreground hover:bg-red-50 dark:hover:bg-destructive/10 hover:text-red-600 dark:hover:text-red-400 transition-all group"
          >
            <LogOut className="w-5 h-5 text-[#1A2E1A]/45 group-hover:text-red-600" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main — separate panel with green header */}
      <main className={dashboardLayoutShell.mainPanel}>
        <header className={dashboardLayoutShell.mobileHeader}>
          <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 min-h-[52px]">
            <div className="flex items-center gap-2 min-w-0">
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-10 w-10 touch-target text-white hover:bg-white/15 hover:text-white"
                    aria-label="Open admin menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[min(20rem,calc(100vw-env(safe-area-inset-left)-env(safe-area-inset-right)))] max-w-[100vw] p-0 flex flex-col gap-0 bg-background border-border/40 overflow-hidden [&>button]:text-foreground/90 [&>button]:hover:bg-secondary/70"
                >
                  <SheetHeader className="p-4 border-b border-border/40 text-left space-y-0 shrink-0">
                    <SheetTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                      <Shield className="w-5 h-5 text-foreground/60" />
                      Admin menu
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    <Link
                      to="/admin/settings"
                      onClick={() => setMobileNavOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium min-h-[48px] group mb-2",
                        isActive("/admin/settings")
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/90 hover:bg-secondary/70 hover:text-foreground",
                      )}
                    >
                      <Settings className="w-5 h-5 shrink-0 text-foreground/60 group-hover:text-foreground/90" />
                      Change password
                    </Link>
                    {navItems.map((item) => {
                      const active = isActive(item.path);
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileNavOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium min-h-[48px] group",
                            active
                              ? "bg-primary/10 text-primary"
                              : "text-foreground/90 hover:bg-secondary/70 hover:text-foreground"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "w-5 h-5 shrink-0",
                              active ? "text-primary" : "text-foreground/60 group-hover:text-foreground/90"
                            )}
                          />
                          {item.label}
                          {active && <ChevronRight className="w-4 h-4 ml-auto text-primary" />}
                        </Link>
                      );
                    })}
                    <div className="pt-4 mt-2 border-t border-border/40 space-y-1">
                      <Link
                        to="/"
                        onClick={() => setMobileNavOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-foreground/90 hover:bg-secondary/70 min-h-[48px] group"
                      >
                        <Home className="w-5 h-5 text-foreground/60 group-hover:text-foreground/90" />
                        Back to site
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileNavOpen(false);
                          logout();
                          navigate("/");
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-foreground/90 hover:bg-red-50 hover:text-red-600 min-h-[48px] text-left group"
                      >
                        <LogOut className="w-5 h-5 text-foreground/60 group-hover:text-red-600" />
                        Logout
                      </button>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
              <span className="font-times text-lg font-semibold text-white truncate">{pageMeta.title}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <ThemeToggle variant="dashboard" />
              <UserProfileDropdown variant="admin" triggerClassName="text-white shrink-0 [&_*]:text-white/90" />
            </div>
          </div>
        </header>

        <DashboardLayoutGreenHeader {...pageMeta} />

        <div className={dashboardLayoutShell.contentScroll}>
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
