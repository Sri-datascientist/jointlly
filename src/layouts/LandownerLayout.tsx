import { useEffect, useMemo, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Store,
  Hammer,
  Handshake,
  Palette,
  Wrench,
  Home,
  ChevronRight,
  ChevronDown,
  LogOut,
  User,
  CreditCard,
  Building2,
  Menu,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getLandownerPageMeta } from "@/lib/dashboardLayoutMeta";
import {
  dashboardLayoutShell,
  DashboardLayoutGreenHeader,
  sidebarNavLinkClass,
  sidebarSubNavLinkClass,
} from "@/components/dashboard/DashboardLayoutHeader";

const LANDOWNER_ACCOUNT_PREFIX = "/landowner/account";

const navItems = [
  { path: "/landowner/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/landowner/matches", label: "Your matches", icon: Users },
  { path: "/landowner/marketplace", label: "Opportunities", icon: Store },
];

const projectItems = [
  { path: "/landowner/contract-construction", label: "Contract construction", icon: Hammer },
  { path: "/landowner/joint-venture", label: "Joint venture", icon: Handshake },
  { path: "/landowner/interior", label: "Interior architecture", icon: Palette },
  { path: "/landowner/reconstruction", label: "Renovation / repaint", icon: Wrench },
];

const LandownerLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [accountOpen, setAccountOpen] = useState(() =>
    location.pathname.startsWith(LANDOWNER_ACCOUNT_PREFIX)
  );
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (location.pathname.startsWith(LANDOWNER_ACCOUNT_PREFIX)) setAccountOpen(true);
  }, [location.pathname]);

  const pathOnly = location.pathname.split("?")[0];
  const pageMeta = useMemo(() => getLandownerPageMeta(location.pathname), [location.pathname]);

  const isMainNavActive = (path: string) => {
    if (pathOnly.startsWith(LANDOWNER_ACCOUNT_PREFIX)) return false;
    if (path === "/landowner/dashboard") return pathOnly === "/landowner/dashboard";
    return pathOnly === path || pathOnly.startsWith(`${path}/`);
  };

  const isProjectNavActive = (path: string) => {
    if (pathOnly.startsWith(LANDOWNER_ACCOUNT_PREFIX)) return false;
    return pathOnly === path || pathOnly.startsWith(`${path}/`);
  };

  const accountSectionActive = pathOnly.startsWith(LANDOWNER_ACCOUNT_PREFIX);

  const accountSubLinks = [
    { to: `${LANDOWNER_ACCOUNT_PREFIX}/profile`, label: "Profile", icon: User },
    { to: `${LANDOWNER_ACCOUNT_PREFIX}/properties`, label: "Properties", icon: Building2 },
    { to: `${LANDOWNER_ACCOUNT_PREFIX}/payments`, label: "Your payments", icon: CreditCard },
  ] as const;

  const mobileLinkClass =
    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium min-h-[48px] text-foreground/90 hover:bg-secondary/70";

  const headerAction =
    pathOnly === "/landowner/dashboard" ? (
      <Link to="/landowner/options">
        <Button className="gap-1.5 h-8 px-3 text-xs bg-white text-[#0D3B21] hover:bg-white/90 shadow-sm border-0">
          <Plus className="w-4 h-4" />
          Post listing
        </Button>
      </Link>
    ) : null;

  return (
    <div className={cn("fixed inset-0 z-[1] flex w-full m-0 p-0 overflow-hidden", dashboardLayoutShell.pageBg)}>
      <aside className={dashboardLayoutShell.sidebar}>
        <div className={dashboardLayoutShell.sidebarHeader}>
          <div className={dashboardLayoutShell.sidebarHeaderShine} />
          <div className="relative">
            <UserProfileDropdown
              variant="landowner"
              triggerClassName="text-white hover:text-white/90 [&_*]:text-white/90"
            />
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-none">
          {navItems.map((item) => {
            const active = isMainNavActive(item.path);
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

          <Collapsible open={accountOpen} onOpenChange={setAccountOpen} className="mt-2">
            <CollapsibleTrigger
              className={cn(
                sidebarNavLinkClass(accountSectionActive),
                "w-full outline-none focus-visible:ring-2 focus-visible:ring-[#1A5C35]/30",
              )}
            >
              <User
                className={cn(
                  "w-5 h-5 shrink-0",
                  accountSectionActive ? "text-[#1A5C35]" : "text-[#1A2E1A]/45 group-hover:text-[#1A5C35]",
                )}
              />
              <span className="flex-1 text-left">Account</span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 shrink-0 transition-transform text-[#1A2E1A]/45",
                  accountOpen && "rotate-180",
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pt-1">
              {accountSubLinks.map((sub) => {
                const subActive = pathOnly === sub.to || pathOnly.startsWith(`${sub.to}/`);
                return (
                  <Link key={sub.to} to={sub.to} className={sidebarSubNavLinkClass(subActive)}>
                    <sub.icon
                      className={cn(
                        "w-4 h-4 shrink-0",
                        subActive ? "text-[#1A5C35]" : "text-[#1A2E1A]/45",
                      )}
                    />
                    <span className="flex-1">{sub.label}</span>
                    {subActive && <ChevronRight className="w-4 h-4 text-[#1A5C35]" />}
                  </Link>
                );
              })}
            </CollapsibleContent>
          </Collapsible>

          <div className="mt-3 border-t border-[#1A5C35]/10 pt-1" aria-hidden />
          {projectItems.map((item) => {
            const active = isProjectNavActive(item.path);
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

        <div className="p-4 border-t border-[#1A5C35]/10 space-y-1 shrink-0 bg-[#f8fcf9]">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#1A2E1A]/75 hover:bg-[#1A5C35]/6 hover:text-[#0D3B21] transition-all group"
          >
            <Home className="w-5 h-5 text-[#1A2E1A]/45 group-hover:text-[#1A5C35]" />
            <span>Back to home</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#1A2E1A]/75 hover:bg-red-50 hover:text-red-600 transition-all group"
          >
            <LogOut className="w-5 h-5 text-[#1A2E1A]/45 group-hover:text-red-600" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className={dashboardLayoutShell.mainPanel}>
        <header className={dashboardLayoutShell.mobileHeader}>
          <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 min-h-[52px]">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-10 w-10 touch-target text-white hover:bg-white/15 hover:text-white"
                    aria-label="Open navigation menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[min(20rem,calc(100vw-env(safe-area-inset-left)-env(safe-area-inset-right)))] max-w-[100vw] p-0 flex flex-col gap-0 overflow-hidden [&>button]:top-3"
                >
                  <SheetHeader className="p-4 border-b text-left space-y-0 shrink-0">
                    <SheetTitle className="text-base font-semibold">Landowner menu</SheetTitle>
                  </SheetHeader>
                  <nav className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-6">
                    <div>
                      <div className="text-xs font-semibold text-foreground/55 uppercase tracking-wider mb-2 px-1">
                        Main
                      </div>
                      <div className="space-y-1">
                        {navItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileNavOpen(false)}
                            className={mobileLinkClass}
                          >
                            <item.icon className="w-5 h-5 shrink-0 text-foreground/60" />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground/55 uppercase tracking-wider mb-2 px-1">
                        Account
                      </div>
                      <div className="space-y-1">
                        {accountSubLinks.map((sub) => (
                          <Link
                            key={sub.to}
                            to={sub.to}
                            onClick={() => setMobileNavOpen(false)}
                            className={mobileLinkClass}
                          >
                            <sub.icon className="w-5 h-5 shrink-0 text-foreground/60" />
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground/55 uppercase tracking-wider mb-2 px-1">
                        New project
                      </div>
                      <div className="space-y-1">
                        {projectItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileNavOpen(false)}
                            className={mobileLinkClass}
                          >
                            <item.icon className="w-5 h-5 shrink-0 text-foreground/60" />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1 pt-2 border-t border-border">
                      <Link
                        to="/"
                        onClick={() => setMobileNavOpen(false)}
                        className={mobileLinkClass}
                      >
                        <Home className="w-5 h-5 shrink-0 text-foreground/60" />
                        Back to home
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setMobileNavOpen(false);
                          logout();
                          navigate("/");
                        }}
                        className={cn(mobileLinkClass, "w-full text-left hover:text-red-600 hover:bg-red-50")}
                      >
                        <LogOut className="w-5 h-5 shrink-0" />
                        Logout
                      </button>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
              <span className="font-semibold text-white truncate">{pageMeta.title}</span>
            </div>
            <UserProfileDropdown variant="landowner" triggerClassName="text-white shrink-0 [&_*]:text-white/90" />
          </div>
        </header>

        <DashboardLayoutGreenHeader {...pageMeta} action={headerAction} />

        <div className={dashboardLayoutShell.contentScroll}>
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandownerLayout;
