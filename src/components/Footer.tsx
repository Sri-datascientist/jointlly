import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Facebook, Instagram, ArrowUpRight } from "lucide-react";
import logoNavbarDark from "@/assets/logo-navbar-dark.svg";
import { cn } from "@/lib/utils";

const footerSections = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Story", href: "/about#story" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Press Kit", href: "/press" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "LegalAID", href: "/legal/legal-aid" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Community", href: "/community" },
      { label: "Partners", href: "/partners" },
    ],
  },
] as const;

const socialLinks = [
  { icon: Linkedin, href: "https://linkedin.com/company/jointlly", label: "LinkedIn" },
  { icon: Facebook, href: "https://facebook.com/jointlly", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/jointlly", label: "Instagram" },
] as const;

const contactItems = [
  { icon: Mail, href: "mailto:sales@jointlly.com", label: "sales@jointlly.com" },
  { icon: Phone, href: "tel:+919611268009", label: "+91 9611268009" },
] as const;

function FooterLinkColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-primary-foreground/90 mb-4">
        {title}
      </h3>
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.href}
              className="group inline-flex items-center gap-1 rounded-md py-1.5 text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground"
            >
              <span>{link.label}</span>
              <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 transition-all group-hover:opacity-70 group-hover:translate-y-0 group-hover:translate-x-0" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-primary/20 bg-gradient-to-b from-[#0D3B21] via-[#1A5C35] to-[#0f4228] text-primary-foreground dark:from-[#0a2e1a] dark:via-[#123d24] dark:to-[#081f12]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 0%, rgba(243,178,74,0.18), transparent 42%), radial-gradient(circle at 85% 100%, rgba(82,183,136,0.15), transparent 40%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 jointlly-grid opacity-[0.08]" aria-hidden />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="grid gap-10 py-12 sm:py-14 lg:grid-cols-12 lg:gap-8 lg:py-16">
          {/* Brand + contact */}
          <div className="lg:col-span-5 xl:col-span-5">
            <Link to="/" className="inline-flex items-center">
              <img
                src={logoNavbarDark}
                alt="Jointlly"
                className="h-10 w-auto max-w-[160px] object-contain object-left sm:h-11"
              />
            </Link>

            <p className="mt-4 max-w-md text-base font-medium leading-snug text-primary-foreground sm:text-lg">
              Jointlly is an online facilitator platform
            </p>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-primary-foreground/70">
              The Validation Report is based on publicly available government records. While Jointlly
              strives for accuracy, users are advised to conduct independent legal due diligence before
              entering into any binding agreements.
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              {contactItems.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/8 px-3.5 py-2 text-sm text-primary-foreground/85 transition-colors hover:border-primary-foreground/30 hover:bg-primary-foreground/12 hover:text-primary-foreground"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{label}</span>
                </a>
              ))}
              <span className="inline-flex items-start gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/8 px-3.5 py-2 text-sm text-primary-foreground/85">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>Banshankri, Bengaluru, Karnataka, India</span>
              </span>
            </div>
          </div>

          {/* Link columns — equal width on desktop */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7 lg:gap-6 xl:col-span-7">
            {footerSections.map((section) => (
              <FooterLinkColumn key={section.title} title={section.title} links={section.links} />
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/15 py-6 sm:py-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 text-center lg:text-left">
              <p className="text-sm text-primary-foreground/80">
                © {currentYear} Jointlly. All rights reserved.
              </p>
              <p className="mt-1 max-w-xl text-xs leading-relaxed text-primary-foreground/55">
                Jointlly is a registered trademark. All product names, logos, and brands are property
                of their respective owners.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-end">
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-primary-foreground/60">
                <Link to="/legal/terms" className="hover:text-primary-foreground transition-colors">
                  Terms
                </Link>
                <span className="hidden sm:inline opacity-40">·</span>
                <Link to="/legal/privacy" className="hover:text-primary-foreground transition-colors">
                  Privacy
                </Link>
                <span className="hidden sm:inline opacity-40">·</span>
                <span>
                  Updated{" "}
                  {new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full",
                      "border border-primary-foreground/20 bg-primary-foreground/8 text-primary-foreground/80",
                      "transition-all hover:border-primary-foreground/35 hover:bg-primary-foreground/14 hover:text-primary-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
