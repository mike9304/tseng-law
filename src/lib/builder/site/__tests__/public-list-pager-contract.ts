import { describe, expect, it } from "vitest";
import expectedCopy from "./public-list-pager-expected-copy.json";

type ListUiState = "empty" | "populated" | "filtered";

export function registerListUiTests(
  render: (locale: string, state: ListUiState) => Promise<string>,
) {
  const decode = (t: string) =>
    t
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&apos;/g, "'")
      .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));

  const surface = (html: string) => {
    const visible = decode(
      html
        .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
        .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " "),
    );
    const extras: string[] = [];
    const re = /(?:aria-label|placeholder|title)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
    for (let m; (m = re.exec(html)); ) extras.push(decode(m[1] ?? m[2] ?? ""));
    return `${visible} ${extras.join(" ")}`.replace(/\s+/g, " ").trim();
  };

  const includes = (hay: string, parts: string[]) => {
    for (const p of parts) expect(hay, hay).toContain(p);
  };

  describe("public list localized controls", () => {
    for (const locale of ["en", "ko", "zh-hant"] as const) {
      const copy = expectedCopy[locale];
      for (const state of ["empty", "populated", "filtered"] as const) {
        it(`${locale} ${state}: visible controls and exact accessible names`, async () => {
          const html = await render(locale, state);
          const text = surface(html);
          includes(text, [copy.search, copy.sortBy, copy.defaultOrder,
            `Synthetic Field ${copy.ascending}`, `Synthetic Field ${copy.descending}`,
            state === "populated" ? copy.showingPopulated : copy.showingEmpty]);
          expect(html).toMatch(new RegExp(`<button[^>]*>${copy.search}</button>`));
          expect(html).toMatch(new RegExp(`<strong[^>]*>${copy.sortBy}</strong>`));
          for (const label of [copy.searchFormLabel, copy.searchRecords, copy.sortLabel, copy.paginationLabel]) {
            expect(html).toContain(`aria-label="${label}"`);
          }
          expect(html).toContain(`placeholder="${copy.searchRecords}"`);
          expect(html).not.toMatch(/aria-label="[^"]*(?:Dynamic list|visitor|動態|訪客)[^"]*"/);
          if (state === "populated") {
            includes(text, [copy.previous, copy.next]);
          }
          if (state === "filtered") {
            includes(text, [copy.clearSearch, copy.activeFilters, copy.clearFilters,
              `${copy.searchSummary} needle`, `title ${copy.contains} needle`, `${copy.sortSummary} title:asc`]);
            expect(html).toContain(`aria-label="${copy.filtersLabel}"`);
            expect(html).toMatch(new RegExp(`<strong[^>]*>${copy.activeFilters}</strong>`));
          }
        });
      }
    }
  });
}
