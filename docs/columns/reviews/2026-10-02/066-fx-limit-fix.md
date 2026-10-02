# Column 066 FX settlement-limit correction review

Date: 2026-10-02 (Asia/Seoul)

## Official verification

The correction is confirmed by the Central Bank of the Republic of China (Taiwan):

- CBC press release (2024-10-30): https://www.cbc.gov.tw/tw/cp-302-178539-47467-1.html
  - Groups and individuals: USD 5 million -> USD 10 million annually.
  - Companies and firms: USD 50 million -> USD 100 million annually.
  - Effective 2024-11-01.
- CBC order notice (order issued 2024-10-31; notice published 2024-11-01): https://www.cbc.gov.tw/tw/cp-379-178543-bd6c4-1.html
  - Adjusts the amounts in Regulations Articles 4(1)(3) and 6(1)(1), effective 2024-11-01.
- Taiwan Laws & Regulations Database Article 7: https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0450009&flno=7
  - Authorizes the CBC to adjust those amounts. The MOJ page still displays the 2022 baseline text; the CBC order is the official adjustment establishing the current figures.

The separate per-conversion documentation thresholds (USD 500,000 for groups/individuals and USD 1 million for companies/firms) were not changed.

## Changes

Updated every annual-limit occurrence in the KO, EN, Traditional Chinese and JA column 066 files, including FAQ frontmatter, body passages, and source lists. Added the CBC press-release and order-notice citations. FAQ answers contain plain text only because the renderer/FAQ JSON-LD does not parse Markdown links; inline body citations and the source lists retain links.

## Claude Opus review

Three real Claude Opus reviews were run on the MacBook Air. Rounds 1 and 2 found issues; those were fixed. Round 3 passed:

- `066-fx-limit-fix-r1.raw.md`: FAIL — fixed Japanese sentence, Chinese wording, legal-basis links.
- `066-fx-limit-fix-r2.raw.md`: FAIL — found Markdown links in FAQ answers that would render raw in visible FAQ/JSON-LD; removed them and polished consistency.
- `066-fx-limit-fix-r3.raw.md`: **VERDICT: PASS** — no blocking factual, voice, or formatting issues.

