import { useMemo } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { LandownerBuilderCompareView, type LandownerPortfolioTab } from "@/components/landowner/LandownerBuilderCompareView";
import { getCompareBuilderIds, mergeCompareIds } from "@/lib/builderCompareSession";

const VALID_TABS: LandownerPortfolioTab[] = ["contract", "jv", "interior", "renovation"];

function projectTypeToTab(projectType: string | undefined): LandownerPortfolioTab | undefined {
  if (!projectType) return undefined;
  const map: Record<string, LandownerPortfolioTab> = {
    CONTRACT_CONSTRUCTION: "contract",
    JV_JD: "jv",
    INTERIOR: "interior",
    RECONSTRUCTION: "renovation",
  };
  return map[projectType];
}

export default function LandownerBuilderPortfolio() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const locationState = location.state as {
    companyName?: string;
    defaultTab?: LandownerPortfolioTab;
    compareIds?: string[];
  } | null;

  const defaultTab =
    locationState?.defaultTab && VALID_TABS.includes(locationState.defaultTab)
      ? locationState.defaultTab
      : projectTypeToTab(searchParams.get("projectType") ?? undefined) ?? "contract";

  const builderIds = useMemo(() => {
    if (!id) return [];
    const fromQuery = searchParams.get("ids")?.split(",").filter(Boolean) ?? [];
    const fromState = locationState?.compareIds ?? [];
    const fromSession = getCompareBuilderIds();
    return mergeCompareIds(id, [...fromQuery, ...fromState, ...fromSession]);
  }, [id, locationState?.compareIds, searchParams]);

  if (!id) {
    return <div className="text-sm text-red-600">Missing builder id.</div>;
  }

  return (
    <LandownerBuilderCompareView builderIds={builderIds} defaultTab={defaultTab} primaryId={id} />
  );
}
