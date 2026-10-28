export function catalogSummary(count: number): string {
  if (count === 0) return "No bars match these filters";
  if (count === 1) return "Showing 1 bar";
  return `Showing ${count} bars`;
}

export function filtersAreActive(tags: readonly string[], sort: string): boolean {
  return tags.length > 0 || sort !== "name";
}
