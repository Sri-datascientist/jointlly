import { useEffect, useMemo, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
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
  Images,
  Menu,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { getProfessionalProfile, listProfessionalCapabilities } from "@/lib/api";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getBuilderPageMeta } from "@/lib/dashboardLayoutMeta";
import {
  dashboardLayoutShell,
  DashboardLayoutGreenHeader,
  sidebarNavLinkClass,
  sidebarSubNavLinkClass,
} from "@/components/dashboard/DashboardLayoutHeader";

const ACCOUNT_PREFIX = "/builder/account";

const navItems = [
  { path: "/builder/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/builder/matches", label: "Your matches", icon: Users },
  { path: "/builder/marketplace", label: "Opportunities", icon: Store },
];

const profileItems = [
  { path: "/builder/contract-construction", label: "Contract construction", icon: Hammer },
  { path: "/builder/joint-venture", label: "JV / JD developer", icon: Handshake },
  { path: "/builder/interior", label: "Interior architect", icon: Palette },
  { path: "/builder/reconstruction", label: "Renovation / repaint", icon: Wrench },
];

const BuilderLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isAuthenticated, user } = useAuth();
  const [profileId, setProfileId] = useState<string | null>(null);
  const [accountOpen, setAccountOpen] = useState(() => location.pathname.startsWith(ACCOUNT_PREFIX));
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!isAuthenticated || user?.userType !== "builder") {
      setProfileId(null);
      return;
    }
    (async () => {
      try {
        const profile = await getProfessionalProfile();
        if (cancelled) return;
        setProfileId(profile.id);
      } catch {
        if (!cancelled) setProfileId(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user?.userType]);

  useEffect(() => {
    if (location.pathname.startsWith(ACCOUNT_PREFIX)) setAccountOpen(true);
  }, [location.pathname]);

  const pathOnly = location.pathname.split("?")[0];
  const pageMeta = useMemo(() => getBuilderPageMeta(location.pathname), [location.pathname]);

  const isMainNavActive = (path: string) => {
    if (pathOnly.startsWith(ACCOUNT_PREFIX)) return false;
    if (path === "/builder/dashboard") return pathOnly === "/builder/dashboard";
    return pathOnly === path || pathOnly.startsWith(`${path}/`);
  };

  const isProfileNavActive = (path: string) => {
    if (pathOnly.startsWith(ACCOUNT_PREFIX)) return false;
    return pathOnly === path || pathOnly.startsWith(`${path}/`);
  };

  const accountSectionActive = pathOnly.startsWith(ACCOUNT_PREFIX);

  const accountSubLinks = [
    { to: `${ACCOUNT_PREFIX}/profile`, label: "Profile", icon: User },
    { to: `${ACCOUNT_PREFIX}/projects`, label: "Projects", icon: FolderOpen },
    { to: `${ACCOUNT_PREFIX}/portfolio`, label: "Portfolio", icon: Images },
    { to: `${ACCOUNT_PREFIX}/payments`, label: "Your payments", icon: CreditCard },
  ] as const;

  const mobileLinkClass =
    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium min-h-[48px] text-foreground/90 hover:bg-secondary/70";

  const profileFormPath = (itemPath: string) =>
    profileId != null ? `${itemPath}?edit=${encodeURIComponent(profileId)}` : itemPath;

  const headerAction =
    pathOnly === "/builder/dashboard" ? (
      <Link to="/builder/options">
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
              variant="builder"
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
          {profileItems.map((item) => {
            const active = isProfileNavActive(item.path);
            const targetPath = profileFormPath(item.path);
            return (
              <Link key={item.path} to={targetPath} className={sidebarNavLinkClass(active)}>
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
                    <SheetTitle className="text-base font-semibold">Builder menu</SheetTitle>
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
                        Profiles
                      </div>
                      <div className="space-y-1">
                        {profileItems.map((item) => (
                          <Link
                            key={item.path}
                            to={profileFormPath(item.path)}
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
                      <Link to="/" onClick={() => setMobileNavOpen(false)} className={mobileLinkClass}>
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
            <UserProfileDropdown variant="builder" triggerClassName="text-white shrink-0 [&_*]:text-white/90" />
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

export default BuilderLayout;
