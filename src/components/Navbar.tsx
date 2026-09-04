import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, UserPlus, LogOut, User, LayoutDashboard, ChevronDown, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { dashboardPathForUserType } from "@/lib/api";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const Logo = ({ isDark }: { isDark: boolean }) => {
  const leftColor = isDark ? "white" : "#1A5C35";
  const rightColor = "#C9952A";
  const overlapColor = isDark ? "#0D2B18" : "#FAF9F6";
  const textColor = isDark ? "white" : "#0D3B21";

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 64" className="h-8 sm:h-9 md:h-10 w-auto max-w-[140px] sm:max-w-none object-contain object-left">
      {/* J-LEFT */}
      <rect x="8" y="10" width="18" height="36" rx="3" fill={leftColor}/>
      <rect x="8" y="6"  width="7"  height="8"  rx="2" fill={leftColor} opacity="0.85"/>
      <rect x="18" y="7" width="5"  height="7"  rx="1" fill={leftColor} opacity="0.45"/>
      <path d="M17 46 Q17 58 11 60 Q5 62 2 54 Q0 48 2 44"
            fill="none" stroke={leftColor} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>

      {/* J-RIGHT */}
      <rect x="26" y="7"  width="18" height="39" rx="3" fill={rightColor}/>
      <rect x="26" y="3"  width="7"  height="8"  rx="2" fill={rightColor}/>
      <rect x="36" y="4"  width="5"  height="7"  rx="1" fill={rightColor} opacity="0.5"/>
      <path d="M35 46 Q35 59 29 61 Q23 63 20 55 Q18 49 20 45"
            fill="none" stroke={rightColor} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>

      {/* Overlap */}
      <rect x="26" y="10" width="9" height="36" rx="0" fill={overlapColor}/>

      {/* Wordmark */}
      <text x="52" y="42"
        fontFamily="Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif"
        fontSize="32" fontWeight="700" letterSpacing="1.2"
        fill={textColor}>jointlly</text>
    </svg>
  );
};

type NavbarProps = {
  variant?: "default" | "hero";
};

const Navbar = ({ variant = "default" }: NavbarProps) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHero = variant === "hero";
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const isTransparentHero = isHero && !scrolled;
  const isDarkForLogo = isTransparentHero ? true : isDark;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  /* ── Shared nav-link classes ── */
  const navLinkBaseClass = cn(
    "navbar-link text-[13px] sm:text-[14px] px-3.5 py-2 rounded-md transition-colors duration-200 font-bold tracking-[0.05em] uppercase",
    isTransparentHero
      ? "text-white/90 hover:text-white"
      : "text-[#0D3B21] dark:text-white/90 hover:text-[#1A5C35] dark:hover:text-[#52b788]"
  );
  const navLinkActiveClass = isTransparentHero
    ? "text-white font-extrabold"
    : "text-[#1A5C35] dark:text-[#52b788] font-extrabold";

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        isHero ? "fixed top-0 left-0 right-0 z-50" : "sticky top-0 z-50",
        "transition-all duration-300",
        isTransparentHero
          ? "bg-transparent py-1 sm:py-2"
          : isDark
            ? "bg-[#050b14]/92 border-b border-white/10 shadow-lg backdrop-blur-md py-0 sm:py-1"
            : "bg-[#FAF9F6]/92 border-b border-[#1A5C35]/15 shadow-md backdrop-blur-md py-0 sm:py-1 text-[#0D3B21]"
      )}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-[env(safe-area-inset-top,0px)]">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
          {/* ── Logo ── */}
          <Link to="/" className="flex items-center shrink-0 min-h-[44px] min-w-[44px]">
            <Logo isDark={isDarkForLogo} />
          </Link>

          {/* ── Desktop Navigation (centered) ── */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <NavigationMenu>
              <NavigationMenuList className="gap-0">
                <NavigationMenuItem>
                  <Link
                    to="/"
                    className={cn(
                      navLinkBaseClass,
                      location.pathname === "/" && navLinkActiveClass
                    )}
                  >
                    Home
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      "navbar-link text-[13px] sm:text-[14px] px-3.5 py-2 bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent tracking-[0.05em] uppercase font-bold",
                      isTransparentHero
                        ? "text-white/90 hover:text-white"
                        : "text-[#0D3B21] dark:text-white/90 hover:text-[#1A5C35] dark:hover:text-[#52b788]",
                      location.pathname.startsWith("/products") && (isTransparentHero ? "text-white font-extrabold" : "text-[#1A5C35] dark:text-[#52b788] font-extrabold")
                    )}
                  >
                    Products
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-3 p-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/products/residential"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            )}
                          >
                            <div className="text-sm font-medium leading-none">Residential</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Low-rise structures like villas and duplexes
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/products/commercial"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            )}
                          >
                            <div className="text-sm font-medium leading-none">Commercial</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Office hubs, hotels, and rental complexes
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/products/industrial"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            )}
                          >
                            <div className="text-sm font-medium leading-none">Industrial</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              High-performance structures for machinery
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/products/interior"
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            )}
                          >
                            <div className="text-sm font-medium leading-none">Interior</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Efficient and visually refined spaces
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    to="/about"
                    className={cn(
                      navLinkBaseClass,
                      location.pathname === "/about" && navLinkActiveClass
                    )}
                  >
                    About Us
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    to="/pricing"
                    className={cn(
                      navLinkBaseClass,
                      location.pathname === "/pricing" && navLinkActiveClass
                    )}
                  >
                    Pricing
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    to="/contact"
                    className={cn(
                      navLinkBaseClass,
                      location.pathname === "/contact" && navLinkActiveClass
                    )}
                  >
                    Contact Us
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    to="/faq"
                    className={cn(
                      navLinkBaseClass,
                      location.pathname === "/faq" && navLinkActiveClass
                    )}
                  >
                    FAQ
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* ── Right side: Theme toggle + Auth ── */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle
              variant="navbar"
              className={
                isTransparentHero
                  ? "text-white/90 hover:bg-white/10 hover:text-white"
                  : "text-[#0D3B21] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#0D3B21] dark:hover:text-white"
              }
            />

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "flex items-center gap-2 px-5 py-2 rounded-full border transition-all duration-200 outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
                      isTransparentHero
                        ? "border-white/30 text-white hover:bg-white/10"
                        : "border-[#1A5C35]/25 dark:border-white/30 text-[#0D3B21] dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
                    )}
                  >
                    <User className="w-4 h-4 animate-pulse-subtle" />
                    <span className="text-[13px] font-medium tracking-[0.06em] uppercase">
                      {user?.name || "Admin"}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link
                      to={user ? dashboardPathForUserType(user.userType) : "/auth"}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/auth", { state: { userType: "builder", authMode: "login" } })}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-2 text-[13px] tracking-[0.06em] uppercase",
                    isTransparentHero
                      ? "text-white/90 hover:text-white hover:bg-white/10"
                      : "text-[#0D3B21]/80 dark:text-white/80 hover:text-[#0D3B21] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
                  )}
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
                <Button
                  onClick={() => navigate("/auth", { state: { userType: "builder", authMode: "signup" } })}
                  size="sm"
                  className={cn(
                    "gap-2 text-[13px] tracking-[0.06em] uppercase rounded-full border bg-transparent px-5 py-2 transition-all duration-200",
                    isTransparentHero
                      ? "border-white/40 text-white hover:border-white/70 hover:bg-white/10"
                      : "border-[#1A5C35]/30 dark:border-white/30 text-[#0D3B21] dark:text-white hover:border-[#1A5C35] dark:hover:border-white/60 hover:bg-[#1A5C35]/10 dark:hover:bg-white/10"
                  )}
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* ── Mobile Menu Button ── */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle
              variant="navbar"
              className={
                isTransparentHero
                  ? "text-white/90 hover:bg-white/10 hover:text-white"
                  : "text-[#0D3B21] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#0D3B21] dark:hover:text-white"
              }
            />
            <MobileMenu isTransparentHero={isTransparentHero} />
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const MobileMenu = ({ isTransparentHero }: { isTransparentHero?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-2.5 -mr-1 rounded-md transition-colors touch-target flex items-center justify-center",
          isTransparentHero
            ? "text-white hover:bg-white/10"
            : "text-[#0D3B21] dark:text-white hover:bg-black/5 dark:hover:bg-white/10"
        )}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg md:hidden max-h-[85vh] overflow-y-auto"
        >
          <div className="px-4 py-4 space-y-1">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block py-3 px-2 text-[13px] font-medium tracking-[0.06em] uppercase text-foreground hover:text-primary transition-colors min-h-[44px] flex items-center"
            >
              Home
            </Link>
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-2">Products</div>
              <Link
                to="/products/residential"
                onClick={() => setIsOpen(false)}
                className="block py-3 px-2 text-[13px] text-foreground hover:text-primary transition-colors min-h-[44px] flex items-center"
              >
                Residential
              </Link>
              <Link
                to="/products/commercial"
                onClick={() => setIsOpen(false)}
                className="block py-3 px-2 text-[13px] text-foreground hover:text-primary transition-colors min-h-[44px] flex items-center"
              >
                Commercial
              </Link>
              <Link
                to="/products/industrial"
                onClick={() => setIsOpen(false)}
                className="block py-3 px-2 text-[13px] text-foreground hover:text-primary transition-colors min-h-[44px] flex items-center"
              >
                Industrial
              </Link>
              <Link
                to="/products/interior"
                onClick={() => setIsOpen(false)}
                className="block py-3 px-2 text-[13px] text-foreground hover:text-primary transition-colors min-h-[44px] flex items-center"
              >
                Interior
              </Link>
            </div>
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className="block py-3 px-2 text-[13px] font-medium tracking-[0.06em] uppercase text-foreground hover:text-primary transition-colors min-h-[44px] flex items-center"
            >
              About Us
            </Link>
            <Link
              to="/pricing"
              onClick={() => setIsOpen(false)}
              className="block py-3 px-2 text-[13px] font-medium tracking-[0.06em] uppercase text-foreground hover:text-primary transition-colors min-h-[44px] flex items-center"
            >
              Pricing
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="block py-3 px-2 text-[13px] font-medium tracking-[0.06em] uppercase text-foreground hover:text-primary transition-colors min-h-[44px] flex items-center"
            >
              Contact Us
            </Link>
            <Link
              to="/faq"
              onClick={() => setIsOpen(false)}
              className="block py-3 px-2 text-[13px] font-medium tracking-[0.06em] uppercase text-foreground hover:text-primary transition-colors min-h-[44px] flex items-center"
            >
              FAQ
            </Link>

            {/* Mobile Auth */}
            <div className="pt-4 border-t border-border space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 mb-2">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">{user?.name || "User"}</span>
                  </div>
                  <Link
                    to={user ? dashboardPathForUserType(user.userType) : "/auth"}
                    onClick={() => setIsOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-3 text-sm font-medium hover:bg-accent min-h-[44px]"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 min-h-[44px]"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      navigate("/auth", { state: { userType: "builder", authMode: "login" } });
                      setIsOpen(false);
                    }}
                    variant="ghost"
                    size="sm"
                    className="w-full gap-2 min-h-[44px]"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      navigate("/auth", { state: { userType: "builder", authMode: "signup" } });
                      setIsOpen(false);
                    }}
                    size="sm"
                    className="w-full gap-2 btn-navbar min-h-[44px]"
                  >
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Navbar;
