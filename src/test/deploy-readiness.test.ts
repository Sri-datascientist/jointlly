import { describe, it, expect, beforeEach } from "vitest";
import {
  addCompareBuilderId,
  getCompareBuilderIds,
  mergeCompareIds,
  MAX_COMPARE_BUILDERS,
  setCompareBuilderIds,
} from "@/lib/builderCompareSession";
import {
  buildComparisonColumnFromPayload,
  companyInitials,
  parseProjectsCompleted,
} from "@/components/builder/builderComparisonUtils";

describe("builderCompareSession", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("stores up to MAX_COMPARE_BUILDERS unique ids", () => {
    setCompareBuilderIds(["a", "b", "c", "d"]);
    expect(getCompareBuilderIds()).toEqual(["a", "b", "c"]);
  });

  it("mergeCompareIds puts primary first and dedupes", () => {
    setCompareBuilderIds(["old1", "old2"]);
    const merged = mergeCompareIds("primary", ["old2", "new3"]);
    expect(merged[0]).toBe("primary");
    expect(new Set(merged).size).toBe(merged.length);
    expect(merged.length).toBeLessThanOrEqual(MAX_COMPARE_BUILDERS);
  });

  it("addCompareBuilderId appends without duplicates", () => {
    addCompareBuilderId("b1");
    addCompareBuilderId("b2");
    const ids = addCompareBuilderId("b1");
    expect(ids.filter((id) => id === "b1")).toHaveLength(1);
    expect(ids[ids.length - 1]).toBe("b1");
  });
});

describe("builderComparisonUtils", () => {
  it("companyInitials handles empty and multi-word names", () => {
    expect(companyInitials("")).toBe("BC");
    expect(companyInitials("M.K. Infra Developers")).toBe("MI");
  });

  it("parseProjectsCompleted extracts first number", () => {
    expect(parseProjectsCompleted("12 projects")).toBe(12);
    expect(parseProjectsCompleted("")).toBeNull();
  });

  it("buildComparisonColumnFromPayload maps payload fields", () => {
    const col = buildComparisonColumnFromPayload(
      "prof-1",
      {
        company_name: "Test Builders",
        years_experience: "9",
        projects_completed: "15",
        preferred_locations: "North Bengaluru, Hebbal",
        recent_projects: [{ name_location: "Hebbal Residences", duration_months: "17" }],
      },
      "jv",
    );
    expect(col).not.toBeNull();
    expect(col!.companyName).toBe("Test Builders");
    expect(col!.totalDelivered).toBe(15);
    expect(col!.areasServed).toContain("North Bengaluru");
  });
});
