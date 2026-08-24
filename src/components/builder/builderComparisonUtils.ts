export type ComparisonRecentProject = {
  name_location?: string;
  location?: string;
  built_up_sft?: string;
  type?: string;
  duration_months?: string;
  image_urls?: string[];
  /** Optional display fields when available */
  units?: string;
  deal_value?: string;
  arrangement?: string;
  completion_year?: string;
};

export type BuilderComparisonColumnData = {
  id: string;
  companyName: string;
  locationLine: string;
  tags: string[];
  jdProjects: number | null;
  totalDelivered: number | null;
  avgDeliveryMonths: number | null;
  maxFloors: string | null;
  areasServed: string | null;
  revenueShareModel: string | null;
  pastProjects: ComparisonRecentProject[];
};

const HEADER_GRADIENTS = [
  "linear-gradient(135deg, #1e4d3a 0%, #2d6a4f 45%, #40916c 100%)",
  "linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #0ea5e9 100%)",
  "linear-gradient(135deg, #3f6212 0%, #65a30d 50%, #84cc16 100%)",
  "linear-gradient(135deg, #7c2d12 0%, #ea580c 55%, #fbbf24 100%)",
];

const PLACEHOLDER_GRADIENTS = [
  "linear-gradient(160deg, #14532d 0%, #166534 40%, #22c55e 100%)",
  "linear-gradient(160deg, #0c4a6e 0%, #0369a1 45%, #38bdf8 100%)",
  "linear-gradient(160deg, #365314 0%, #4d7c0f 50%, #a3e635 100%)",
  "linear-gradient(160deg, #134e4a 0%, #0f766e 55%, #2dd4bf 100%)",
];

export function companyInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "BC";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase();
}

export function parseProjectsCompleted(value: string | undefined | null): number | null {
  if (!value?.trim()) return null;
  const match = value.match(/\d+/);
  return match ? Number.parseInt(match[0], 10) : null;
}

export function averageDeliveryMonths(projects: ComparisonRecentProject[]): number | null {
  const values = projects
    .map((p) => Number.parseFloat(String(p.duration_months ?? "").replace(/[^\d.]/g, "")))
    .filter((n) => !Number.isNaN(n) && n > 0);
  if (!values.length) return null;
  const avg = values.reduce((sum, n) => sum + n, 0) / values.length;
  return Math.round(avg * 10) / 10;
}

export function avatarTone(index: number): "blue" | "green" {
  return index % 2 === 0 ? "blue" : "green";
}

export function headerGradientForIndex(index: number): string {
  return HEADER_GRADIENTS[index % HEADER_GRADIENTS.length];
}

export function placeholderGradientForIndex(index: number): string {
  return PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length];
}

export function projectTitle(project: ComparisonRecentProject, fallbackIndex: number): string {
  const raw = (project.name_location ?? project.location ?? "").trim();
  if (!raw) return `Project ${fallbackIndex + 1}`;
  const parts = raw.split(/[·,|–-]/).map((s) => s.trim()).filter(Boolean);
  return parts[0] || raw;
}

export function projectHeaderCaption(project: ComparisonRecentProject): string {
  const raw = (project.name_location ?? project.location ?? "").trim();
  if (!raw) return project.type?.trim() || "Past project";
  const parts = raw.split(/[·,|–-]/).map((s) => s.trim()).filter(Boolean);
  if (parts.length > 1) return parts.slice(1).join(" · ");
  return [project.type, project.built_up_sft ? `${project.built_up_sft} SFT` : ""].filter(Boolean).join(" · ") || raw;
}

export function projectMetaLine(project: ComparisonRecentProject): string {
  const parts: string[] = [];
  if (project.units?.trim()) parts.push(project.units.trim());
  else if (project.built_up_sft?.trim()) parts.push(`${project.built_up_sft} SFT`);
  if (project.deal_value?.trim()) parts.push(project.deal_value.trim());
  const arrangement = project.arrangement?.trim() || project.type?.trim();
  if (arrangement) parts.push(arrangement);
  if (project.duration_months?.trim()) {
    const months = project.duration_months.replace(/[^\d.]/g, "");
    parts.push(months ? `${months} months` : project.duration_months.trim());
  }
  return parts.join(" · ") || "Details not specified";
}

export function projectYearLabel(project: ComparisonRecentProject, index: number): string {
  if (project.completion_year?.trim()) return project.completion_year.trim();
  const yearsAgo = index + 1;
  return String(new Date().getFullYear() - yearsAgo);
}

export function capabilityTagsFromPayload(payload: Record<string, unknown> | undefined, tab: string): string[] {
  if (!payload) return [];
  const tags: string[] = [];
  if (tab === "contract" || tab === "jv") {
    const caps = payload.project_caps as string[] | undefined;
    const types = payload.project_types as string[] | undefined;
    if (caps?.some((c) => /jv|jd|joint/i.test(c))) tags.push("JV/JD");
    if (types?.length || caps?.some((c) => /contract|construction/i.test(c))) tags.push("Contract");
    if (payload.jv_arrangements && Array.isArray(payload.jv_arrangements) && payload.jv_arrangements.length) {
      if (!tags.includes("JV/JD")) tags.push("JV/JD");
    }
  }
  if (tab === "interior") tags.push("Interior");
  if (tab === "renovation") tags.push("Renovation");
  if (!tags.length) {
    if (tab === "jv") tags.push("JV/JD");
    if (tab === "contract") tags.push("Contract");
  }
  return tags;
}

import type { BuilderMarketplaceCard, BuilderPortfolioLatest, FormSubmissionDetail } from "@/lib/api";

function strFromPayload(payload: Record<string, unknown> | undefined, ...keys: string[]): string | null {
  if (!payload) return null;
  for (const key of keys) {
    const v = payload[key];
    if (v === null || v === undefined || v === "") continue;
    if (Array.isArray(v)) {
      const joined = v.map(String).filter(Boolean).join(", ");
      if (joined) return joined;
    } else {
      const s = String(v).trim();
      if (s) return s;
    }
  }
  return null;
}

function parseNumericField(payload: Record<string, unknown> | undefined, ...keys: string[]): number | null {
  const raw = strFromPayload(payload, ...keys);
  if (!raw) return null;
  const match = raw.match(/\d+/);
  return match ? Number.parseInt(match[0], 10) : null;
}

function mapRecentProjects(
  fromPayload: ComparisonRecentProject[] | undefined,
  fromCard: BuilderMarketplaceCard["recent_portfolio"] | undefined,
): ComparisonRecentProject[] {
  if (fromPayload?.length) return fromPayload.slice(0, 4);
  if (!fromCard?.length) return [];
  return fromCard.slice(0, 4).map((item) => ({
    name_location: item.project_name,
    location: item.location ?? undefined,
    built_up_sft: item.area_sqft != null ? String(item.area_sqft) : undefined,
    type: item.project_type ?? undefined,
    completion_year: item.completion_date
      ? String(new Date(item.completion_date).getFullYear())
      : undefined,
    image_urls: item.images ?? undefined,
  }));
}

function previewForTab(
  builder: BuilderMarketplaceCard,
  tab: string,
): BuilderMarketplaceCard["contract_portfolio_preview"] {
  switch (tab) {
    case "jv":
      return builder.jv_portfolio_preview;
    case "interior":
      return builder.interior_portfolio_preview;
    case "renovation":
      return builder.renovation_portfolio_preview;
    default:
      return builder.contract_portfolio_preview;
  }
}

export function portfolioSubmissionForCompareTab(
  data: BuilderPortfolioLatest | null | undefined,
  tab: string,
): FormSubmissionDetail | null {
  if (!data) return null;
  switch (tab) {
    case "jv":
      return data.joint_venture;
    case "interior":
      return data.interior;
    case "renovation":
      return data.renovation_repaint;
    default:
      return data.contract_construction;
  }
}

export function buildComparisonColumnFromMarketplace(
  builder: BuilderMarketplaceCard,
  submission: FormSubmissionDetail | null | undefined,
  tab: string,
): BuilderComparisonColumnData {
  const payload = submission?.payload as Record<string, unknown> | undefined;
  const fromPayload = payload ? buildComparisonColumnFromPayload(builder.id, payload, tab) : null;
  const preview = previewForTab(builder, tab);

  const companyName =
    fromPayload?.companyName ||
    String(preview?.company_name ?? builder.company_name ?? "").trim() ||
    "Builder";

  const city =
    builder.city?.trim() ||
    strFromPayload(payload, "preferred_location", "preferred_locations", "address") ||
    preview?.location_summary?.trim() ||
    (builder.location_preferences ?? []).join(", ");

  const experience =
    strFromPayload(payload, "years_experience") ||
    (builder.experience_years != null ? String(builder.experience_years) : "") ||
    preview?.years_experience?.trim() ||
    "";

  const locationLine = [city, experience ? `${experience} yrs` : ""].filter(Boolean).join(" · ") || "—";

  const recentFromPayload = (payload?.recent_projects as ComparisonRecentProject[] | undefined) ?? [];
  const pastProjects = mapRecentProjects(recentFromPayload, builder.recent_portfolio);

  const totalDelivered =
    fromPayload?.totalDelivered ??
    parseProjectsCompleted(preview?.projects_completed ?? undefined) ??
    parseNumericField(payload, "projects_completed", "jd_projects", "total_projects");

  const jdProjects =
    parseNumericField(payload, "jd_projects", "jv_projects") ??
    (tab === "jv" && totalDelivered != null ? totalDelivered : null);

  const areasServed =
    strFromPayload(payload, "preferred_locations", "preferred_location", "service_areas", "areas_served") ||
    (builder.location_preferences?.length ? builder.location_preferences.join(", ") : null) ||
    preview?.location_summary?.trim() ||
    null;

  const revenueShareModel =
    strFromPayload(payload, "revenue_share_model", "jv_revenue_share", "revenue_sharing") ||
    (Array.isArray(payload?.jv_arrangements)
      ? (payload!.jv_arrangements as string[]).join(", ")
      : null);

  const maxFloors =
    strFromPayload(payload, "max_floors", "floors_allowed", "maximum_floors", "typical_floors") || null;

  let tags = fromPayload?.tags ?? capabilityTagsFromPayload(payload, tab);
  if (!tags.length && builder.capability_types?.length) {
    tags = builder.capability_types.map((c) => {
      if (c === "JV_JD") return "JV/JD";
      if (c === "CONSTRUCTION") return "Contract";
      if (c === "INTERIOR") return "Interior";
      if (c === "RECONSTRUCTION") return "Renovation";
      return c;
    });
  }
  if (builder.construction_project_types?.length) {
    for (const t of builder.construction_project_types) {
      if (!tags.some((x) => x.toLowerCase() === t.toLowerCase())) tags.push(t);
    }
  }

  return {
    id: builder.id,
    companyName,
    locationLine,
    tags: [...new Set(tags)].slice(0, 4),
    jdProjects,
    totalDelivered,
    avgDeliveryMonths: fromPayload?.avgDeliveryMonths ?? averageDeliveryMonths(pastProjects),
    maxFloors,
    areasServed,
    revenueShareModel,
    pastProjects,
  };
}

export function buildComparisonColumnFromPayload(
  id: string,
  payload: Record<string, unknown> | undefined,
  tab: string,
): BuilderComparisonColumnData | null {
  if (!payload) return null;
  const companyName = String(payload.company_name ?? "").trim();
  if (!companyName) return null;

  const recent = (payload.recent_projects as ComparisonRecentProject[] | undefined) ?? [];
  const location =
    String(payload.preferred_location ?? payload.preferred_locations ?? payload.address ?? "").trim() ||
    String((payload.location as Record<string, unknown> | undefined)?.address ?? "").trim();
  const experience = String(payload.years_experience ?? "").trim();
  const locationLine = [location, experience ? `${experience} yrs experience` : ""].filter(Boolean).join(" · ");

  const pastProjects = recent.slice(0, 4);

  return {
    id,
    companyName,
    locationLine: locationLine || "Location not specified",
    tags: capabilityTagsFromPayload(payload, tab),
    jdProjects: parseNumericField(payload, "jd_projects", "jv_projects"),
    totalDelivered: parseProjectsCompleted(String(payload.projects_completed ?? "")),
    avgDeliveryMonths: averageDeliveryMonths(pastProjects),
    maxFloors: strFromPayload(payload, "max_floors", "floors_allowed", "maximum_floors"),
    areasServed: strFromPayload(payload, "preferred_locations", "preferred_location", "service_areas"),
    revenueShareModel:
      strFromPayload(payload, "revenue_share_model", "jv_revenue_share") ||
      (Array.isArray(payload.jv_arrangements) ? (payload.jv_arrangements as string[]).join(", ") : null),
    pastProjects,
  };
}
