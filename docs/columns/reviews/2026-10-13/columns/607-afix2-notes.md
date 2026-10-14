# C6 afix2 — 2026-10-14

Edited all four drafts directly. Independently fetched all 42 distinct official source URLs with curl: 28 single-article pages, seven full laws, and seven agency/portal/handbook sources; all returned HTTP 200. Compared conditions, exceptions, AND/OR, amounts and periods with the Chinese originals. The handbook's printed pages 3 and 5 were also rendered and inspected. No judgment is cited; research/judgments contains no .txt judgment files.

## Issue → change → source

- Sol major 1, FAQ citation syntax displayed as text → retained the drafts' inline official citations and repaired the publication renderer to produce safe inline anchors. FAQPage JSON-LD now contains readable answer text, identical to the rendered answers. Raw HTML is skipped and unsafe Markdown URL schemes are filtered. Applied the two source changes and regression tests listed below; the tested patch is saved in [evidence-afix2/faq-rendering.patch](./evidence-afix2/faq-rendering.patch). All 52 final FAQ citations render as links. The legal sources remain unchanged, including [management regulation Article 51](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=51).
- Sol major 2, EN “department, faculty, or graduate program/school” → “academic department, program, or graduate institute,” with formal enrollment stated in both FAQ 1 and the body. Preserved formal enrollment OR six months of language study, AND the school-certified ground, subject to paragraph 2's exceptions. Source: [Article 51](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=51).
- Astra r3 L1–L2 → the incoming drafts already corrected the exchange-student statement and FAQ enrollment alternatives. Reverified and retained them: two semesters concerns work-permit eligibility, not a cap on exchange study; school certification remains separate. Source: the official WDA handbook linked in each draft, printed page 3, and Article 51 above.
- FAQ 2 began with the no-permit violation rather than answering the expiry question → reordered all four answers around the student exception, and expressly stated that the work prohibition remains. Kept Article 68's separate departure rule. Sources: [Article 74](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=74), [Article 73](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=73), [Article 68](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=68), [Article 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43).
- FAQ 3's shorthand 20-hour statement omitted the vacation qualification → explicitly added winter/summer vacation exclusions in every language. Made lawful graduate residence extension explicit and rewrote EN's awkward eligibility sentence. Preserved the degree, fresh-graduate status, one-year starting point, further application and two-year maximum. Sources: [Article 50](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=50), [Article 54](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=54), [Article 12](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=12), [residence Article 11](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080129&flno=11).
- EN body wording/length → replaced “requires both” with the two requirements and shortened the category-4 definition without changing its scope. Source: [management regulation Article 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=2).
- Fact-sheet discrepancy → its assertion that the professional-qualification proviso is unused is stale. The proviso remains in all four bodies and was verified against the [WDA graduate page](https://ezworktaiwan.wda.gov.tw/cp.aspx?n=511766BD9E956242); facts.md was not edited.

## Publication files necessarily changed for Sol major 1

Under `/Users/son7/Projects/tseng-law-columns-20261013/`:

- `src/app/[locale]/columns/[slug]/ColumnDetailView.tsx`
- `src/lib/seo.ts`
- `src/app/[locale]/columns/[slug]/__tests__/column-view-visibility.test.tsx`
- `src/lib/__tests__/seo-faq-jsonld.test.ts`

## Verification

| Language | Required lint | Variety FAIL | Body length |
|---|---|---|---|
| ko | OK | 0 | 3,497 characters |
| ja | OK | 0 | 4,056 characters |
| en | OK | 0 | 1,595 words |
| zh-hant | OK | 0 | 2,699 characters |

Both reviews listed no MONOTONY rejection. Section 5 self-check: at least two very short sentences per language; no stock hypothetical opening, prohibited paragraph-opener repetition, repeated claim/citation/caveat sequence or excess contrast; citation-free hypothetical/question retained; substantive endings and required registers preserved. KO/JA ending-frequency WARNs remain within the required 합니다체/です・ます registers. EN answers the reader directly without adding an artificial body question. Compared C1–C5 openings and the same preceding three published columns per language identified in r3. C6's openings remain distinct. Deleting its first two paragraphs would lose the hours/applicant rules (KO/JA), ARC/applicant distinction (EN), or shop-owner question and permit explanation (ZH).

Six regression assertions failed before the rendering fix; final related suite: 51 tests passed. TypeScript and scoped ESLint passed in an isolated source copy. Actual final FAQ output was inspected at 390px and 1200px: three answers per language, all citation targets preserved, no raw Markdown or horizontal overflow. Visible answers equal JSON-LD text. These are local FAQ previews, not a deployed-page or full-site-build claim.

Every draft's distinct official URL set and complete source list are preserved. Evidence and final command outputs: [evidence-afix2](./evidence-afix2/). The requested 2026-10-13 article/source date is retained; this independent recheck occurred on 2026-10-14. Author metadata, hypothetical labels and image reference remain intact. Image SHA-256 remains `e9c8784a28f3bbb5d9041bd9aa3f619f5fb8d56c69b4ba7cb4259dd7013c5c2c`. No image edit, git command, publication or deployment was performed.
