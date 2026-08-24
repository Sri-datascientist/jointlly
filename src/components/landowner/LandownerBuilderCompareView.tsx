import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Loader2, Plus } from "lucide-react";
import {
  getBuilderMarketplace,
  getBuilderMarketplacePortfolio,
  type BuilderMarketplaceCard,
  type BuilderPortfolioLatest,
} from "@/lib/api";
import { BuilderComparisonTable } from "@/components/builder/BuilderComparisonTable";
import {
  buildComparisonColumnFromMarketplace,
  portfolioSubmissionForCompareTab,
  type BuilderComparisonColumnData,
} from "@/components/builder/builderComparisonUtils";
import { BuilderPortfolioTypePanel } from "@/components/BuilderPortfolioPayloadView";
import { MAX_COMPARE_BUILDERS, mergeCompareIds } from "@/lib/builderCompareSession";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type LandownerPortfolioTab = "contract" | "jv" | "interior" | "renovation";

const TAB_LABELS: Record<LandownerPortfolioTab, string> = {
  contract: "Contract construction",
  jv: "JV / JD",
  interior: "Interior",
  renovation: "Renovation / Repaint",
};

type LandownerBuilderCompareViewProps = {
  builderIds: string[];
  defaultTab: LandownerPortfolioTab;
  primaryId?: string;
};

export function LandownerBuilderCompareView({
  builderIds,
  defaultTab,
  primaryId,
}: LandownerBuilderCompareViewProps) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<LandownerPortfolioTab>(defaultTab);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [builders, setBuilders] = useState<BuilderMarketplaceCard[]>([]);
  const [portfolios, setPortfolios] = useState<Record<string, BuilderPortfolioLatest>>({});
  const [detailColumn, setDetailColumn] = useState<BuilderComparisonColumnData | null>(null);

  const ids = useMemo(
    () => [...new Set(builderIds.filter(Boolean))].slice(0, MAX_COMPARE_BUILDERS),
    [builderIds],
  );

  useEffect(() => {
    if (primaryId) mergeCompareIds(primaryId, ids.filter((id) => id !== primaryId));
  }, [primaryId, ids]);

  const loadData = useCallback(async () => {
    if (!ids.length) {
      setBuilders([]);
      setPortfolios({});
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const [cards, ...portfolioRows] = await Promise.all([
        getBuilderMarketplace({ professional_ids: ids, page_size: MAX_COMPARE_BUILDERS }),
        ...ids.map((id) => getBuilderMarketplacePortfolio(id)),
      ]);
      const cardById = new Map(cards.map((c) => [c.id, c]));
      const orderedCards = ids
        .map((id) => cardById.get(id))
        .filter((c): c is BuilderMarketplaceCard => !!c);
      const portfolioMap: Record<string, BuilderPortfolioLatest> = {};
      ids.forEach((id, index) => {
        portfolioMap[id] = portfolioRows[index];
      });
      setBuilders(orderedCards);
      setPortfolios(portfolioMap);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load builder profiles");
    } finally {
      setLoading(false);
    }
  }, [ids]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const columns = useMemo(
    () =>
      builders.map((builder) =>
        buildComparisonColumnFromMarketplace(
          builder,
          portfolioSubmissionForCompareTab(portfolios[builder.id], tab),
          tab,
        ),
      ),
    [builders, portfolios, tab],
  );

  const detailPortfolio = detailColumn ? portfolios[detailColumn.id] : null;

  const openComparePicker = () => {
    navigate("/landowner/marketplace", { state: { pickForCompare: true, compareTab: tab } });
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2 text-[#5c6b5f]">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading builder comparison…
      </div>
    );
  }

  if (error) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>;
  }

  return (
    <div className="space-y-5 pb-6">
      <nav className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex flex-wrap items-center gap-1.5 text-[#5c6b5f]">
          <Link to="/landowner/marketplace" className="font-medium text-[#1A5C35] hover:underline">
            Back to marketplace
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0 opacity-50" />
          <span className="font-semibold text-[#0D3B21]">Compare builders</span>
        </div>
        {ids.length < MAX_COMPARE_BUILDERS ? (
          <button
            type="button"
            onClick={openComparePicker}
            className="inline-flex items-center gap-1.5 font-semibold text-[#1A5C35] hover:underline"
          >
            <Plus className="h-4 w-4" />
            Add {ids.length === 1 ? "another builder" : "third builder"}
          </button>
        ) : null}
      </nav>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#1A5C35]/80">
            Builder comparison view
          </p>
          <h1 className="mt-1 font-times text-2xl sm:text-3xl text-[#0D3B21]">
            {columns.length === 1 ? columns[0]?.companyName : "Side-by-side comparison"}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-[#1A2E1A]/65">
            Review delivery stats, service areas, and past projects. Sensitive contact fields stay hidden —
            open full details for complete registration data.
          </p>
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(v as LandownerPortfolioTab)}>
          <TabsList className="flex h-auto flex-wrap gap-1 bg-[#eef3ef] dark:bg-muted p-1">
            {(Object.keys(TAB_LABELS) as LandownerPortfolioTab[]).map((key) => (
              <TabsTrigger key={key} value={key} className="rounded-lg px-3 py-1.5 text-xs sm:text-sm">
                {TAB_LABELS[key]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {columns.length ? (
        <BuilderComparisonTable columns={columns} onViewDetails={setDetailColumn} />
      ) : (
        <div className="rounded-xl border border-[#1A5C35]/15 bg-white p-8 text-center text-sm text-[#5c6b5f]">
          No builder profiles to compare yet.
        </div>
      )}

      {ids.length < MAX_COMPARE_BUILDERS ? (
        <div className="flex justify-center">
          <Button variant="outline" className="border-[#1A5C35]/25 text-[#1A5C35]" onClick={openComparePicker}>
            <Plus className="mr-2 h-4 w-4" />
            Add builder to compare
          </Button>
        </div>
      ) : null}

      <Dialog open={!!detailColumn} onOpenChange={(open) => !open && setDetailColumn(null)}>
        <DialogContent className="flex max-h-[min(90vh,720px)] max-w-2xl flex-col gap-0 overflow-hidden p-0">
          <DialogHeader className="shrink-0 space-y-1 border-b border-border px-6 py-4 text-left">
            <DialogTitle className="pr-8 text-lg">
              {detailColumn?.companyName ?? "Builder"} — registration details
            </DialogTitle>
            <DialogDescription className="text-left text-xs sm:text-sm">
              Full submitted fields for this construction type. Phone, email, and exact address may be withheld.
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            {detailPortfolio ? (
              <Tabs defaultValue={tab} className="w-full">
                <TabsList className="mb-4 flex h-auto flex-wrap gap-1">
                  {(Object.keys(TAB_LABELS) as LandownerPortfolioTab[]).map((key) => (
                    <TabsTrigger key={key} value={key} className="text-xs sm:text-sm">
                      {TAB_LABELS[key]}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {(Object.keys(TAB_LABELS) as LandownerPortfolioTab[]).map((key) => (
                  <TabsContent key={key} value={key}>
                    <BuilderPortfolioTypePanel
                      title={TAB_LABELS[key]}
                      submission={portfolioSubmissionForCompareTab(detailPortfolio, key)}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            ) : null}
          </div>
          <DialogFooter className="shrink-0 border-t border-border px-6 py-3">
            <Button variant="outline" onClick={() => setDetailColumn(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
