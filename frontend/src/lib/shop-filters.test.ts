import { describe, expect, it } from "vitest";

import { catalogSummary, filtersAreActive } from "@/lib/shop-filters";

describe("catalogSummary", () => {
  it("handles empty, singular, and plural counts", () => {
    expect(catalogSummary(0)).toBe("No bars match these filters");
    expect(catalogSummary(1)).toBe("Showing 1 bar");
    expect(catalogSummary(12)).toBe("Showing 12 bars");
  });
});

describe("filtersAreActive", () => {
  it("is inactive on the default name sort with no tags", () => {
    expect(filtersAreActive([], "name")).toBe(false);
  });

  it("is active when a tag is selected or the sort is not name", () => {
    expect(filtersAreActive(["dark"], "name")).toBe(true);
    expect(filtersAreActive([], "price_asc")).toBe(true);
  });
});
