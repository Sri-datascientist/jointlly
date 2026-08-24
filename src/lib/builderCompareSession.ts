const STORAGE_KEY = "jointlly:compare-builder-ids";
export const MAX_COMPARE_BUILDERS = 3;

export function getCompareBuilderIds(): string[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string" && id.length > 0).slice(0, MAX_COMPARE_BUILDERS);
  } catch {
    return [];
  }
}

export function setCompareBuilderIds(ids: string[]): void {
  const unique = [...new Set(ids.filter(Boolean))].slice(0, MAX_COMPARE_BUILDERS);
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(unique));
}

export function addCompareBuilderId(id: string): string[] {
  const next = [...getCompareBuilderIds().filter((x) => x !== id), id].slice(-MAX_COMPARE_BUILDERS);
  setCompareBuilderIds(next);
  return next;
}

export function mergeCompareIds(primaryId: string, extra: string[] = []): string[] {
  const merged = [primaryId, ...extra, ...getCompareBuilderIds()].filter(Boolean);
  const unique = [...new Set(merged)].slice(0, MAX_COMPARE_BUILDERS);
  setCompareBuilderIds(unique);
  return unique;
}
