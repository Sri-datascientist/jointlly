import { useState, useEffect } from "react";
import { Hammer, Handshake, Palette, Wrench, FileText, CheckCircle2, Users, Store, Sparkles } from "lucide-react";
import { BuilderProfileCard } from "../../components/BuilderProfileCard";
import { useAuth } from "@/hooks/useAuth";
import { getProfessionalProfile, listProfessionalCapabilities } from "@/lib/api";
import type { BuilderProfile } from "@/components/BuilderProfileCard";
import {
  DashboardLoadingState,
  DashboardPromoBanner,
  DashboardQuickActionCard,
  DashboardSectionHeader,
  DashboardStatCard,
} from "@/components/dashboard/DashboardUI";

const CAPABILITY_TO_FORM_TYPE: Record<string, string> = {
  CONSTRUCTION: "contract-construction",
  JV_JD: "joint-venture",
  INTERIOR: "interior",
  RECONSTRUCTION: "reconstruction",
};

const quickActions = [
  { path: "/builder/contract-construction", slug: "contract-construction", label: "Contract construction", icon: Hammer, desc: "Register or update your contract construction profile." },
  { path: "/builder/joint-venture", slug: "joint-venture", label: "JV / JD developer", icon: Handshake, desc: "Register or update your JV/JD developer profile." },
  { path: "/builder/interior", slug: "interior", label: "Interior architect", icon: Palette, desc: "Register or update your interior design profile." },
  { path: "/builder/reconstruction", slug: "reconstruction", label: "Renovation / repaint", icon: Wrench, desc: "Register or update your repair & painting profile." },
];

const BuilderDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [profiles, setProfiles] = useState<BuilderProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (isAuthenticated && user?.userType === "builder") {
        try {
          const [profile, capabilities] = await Promise.all([
            getProfessionalProfile(),
            listProfessionalCapabilities(),
          ]);
          if (cancelled) return;
          const apiProfiles: BuilderProfile[] = capabilities.map((cap) => ({
            profileId: profile.id,
            type: CAPABILITY_TO_FORM_TYPE[cap.capability_type] || cap.capability_type.toLowerCase(),
            companyName: profile.company_name,
            address: profile.city ?? undefined,
            yearsExperience: profile.experience_years?.toString(),
            submittedAt: profile.updated_at,
            verified: false,
          }));
          setProfiles(apiProfiles);
        } catch {
          if (cancelled) return;
          setProfiles([]);
        } finally {
          if (!cancelled) setLoading(false);
        }
      } else {
        const stored = localStorage.getItem("builderProfiles");
        if (stored) {
          const parsed = JSON.parse(stored);
          const withIds = parsed.map((p: Record<string, unknown>, i: number) => ({
            ...p,
            profileId: (p.profileId as string) || `builder-${i}-${String(p.type || "profile")}-${String((p.submittedAt as string) || "")}`,
          }));
          setProfiles(withIds);
        } else {
          setProfiles([]);
        }
        setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [isAuthenticated, user?.userType]);

  const getProfileStatus = (type: string) => profiles.some((p) => p.type === type);

  const stats = [
    { label: "Active profiles", value: profiles.length, icon: FileText, accent: "green" as const },
    { label: "Published on platform", value: profiles.length, icon: CheckCircle2, accent: "mint" as const },
    { label: "Your matches", value: 0, icon: Users, accent: "gold" as const, href: "/builder/matches" },
  ];

  if (loading) {
    return <DashboardLoadingState label="Loading your profiles…" />;
  }

  return (
    <div className="pb-4">
      <DashboardPromoBanner
        title="Create your opportunity listing"
        description="Complete the form for your service type — contract construction, JV/JD, interior, or renovation — to appear on Opportunities."
        icon={Sparkles}
        ctaLabel="Fill the form"
        ctaTo="/builder/options"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-10 sm:mb-12">
        {stats.map((stat, index) => (
          <DashboardStatCard key={stat.label} {...stat} index={index} />
        ))}
      </div>

      {profiles.length > 0 ? (
        <section className="mb-10 sm:mb-12">
          <DashboardSectionHeader
            title="Featured profiles"
            subtitle="Your registered service capabilities"
            viewAllTo="/builder/my-projects"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {profiles.slice(0, 6).map((profile, index) => (
              <BuilderProfileCard key={profile.profileId ?? index} profile={profile} index={index} variant="compact" />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mb-10 sm:mb-12">
        <DashboardSectionHeader
          title="Register or update profile"
          subtitle="Select your area of expertise to submit or refresh your details"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {quickActions.map((action, i) => (
            <DashboardQuickActionCard
              key={action.path}
              to={action.path}
              label={action.label}
              description={action.desc}
              icon={action.icon}
              completed={getProfileStatus(action.slug)}
              index={i}
            />
          ))}
        </div>
      </section>

      <DashboardPromoBanner
        variant="light"
        title="Browse landowner opportunities"
        description="Explore published requests and evaluate projects matched to your profile and location."
        icon={Store}
        ctaLabel="Open opportunities"
        ctaTo="/builder/marketplace"
      />
    </div>
  );
};

export default BuilderDashboard;
