# Remove public column authors — 2026-10-20

User decision: 2026-10-20 19:07 KST. Worktree: `~/tseng-air-1011/fix016`, branch `air/remove-byline-20261020`. This change is local only: no build, push, deployment, production-data edit or audio playback.

## Public policy and implementation

All expert, issue and traffic/criminal-board articles are unbylined, including the original lawyer-written columns. Internal frontmatter/provenance remains. No substitution of a lawyer or Organization as `author` is permitted. Organization `publisher` is retained.

- Detail hero, archive cards, home featured/list cards and collection JSON-LD omit attribution for every locale.
- Root and locale layouts no longer supply inherited author/creator meta fields. Article JSON-LD builders, including legacy CMS/dynamic-item helpers, cannot emit authors.
- Public blog JSON omits author objects before filtering/search; authenticated `scope=all` retains the internal CMS field. Public widgets suppress authors even when a saved `showAuthor` flag is true. Public author filters are ignored and no filter chip exposes a query value.
- Public search indexing omits internal author names/titles. `llms.txt` and sitemap sources were checked; no RSS/Atom/JSON Feed standard endpoint exists in this checkout. The existing public blog JSON endpoint is covered separately.
- Old decomposed home byline nodes are excluded at render time without changing stored canvases; newly generated archive nodes omit bylines.
- General-information disclaimers are retained, with no AI or author names. Consultation cards identify consultation contacts, not article writers/reviewers. Firm/team/profile and service-contact information remain intact.
- Image attribution was checked separately from scene descriptions. Existing fictional/AI-generated-media notices are not article author attribution and remain intact.
- Legacy manuscripts also contain inline signatures and self-introductions. `column-attribution.ts` removes 142 reviewed exact legacy lines plus explicit byline labels and six old AI labels at the file, CMS/Blob, public blog JSON and search boundaries. The observed file corpus has 526 affected lines in 521 manuscripts; only 49 openings change. Two mixed paragraphs retain their legal conditions verbatim after the author introduction is removed. Fifteen AI-authorship endnotes retain their public-judgment/statute basis and original check dates while omitting the writer identity. Raw manuscripts remain unchanged apart from the four deletions below. Named consultation contacts, quotations, code and the attorney's role in a reported case remain. `~/tseng-byline-1020/legacy-body-attribution-audit.json` records each public projection, actual first two paragraphs and preceding three same-language comparators.
- Repo voice instructions and their generated API-prompt copy now prohibit public authors. Existing frontmatter author fields and the optional CMS author schema remain internal. Two browser QA scripts now assert author absence instead of requiring an AI byline.

## Manuscript changes and opening review

Only the standalone line `作者：法律 AI 助理` was deleted from these four Traditional Chinese manuscripts. Exact comparison against HEAD proves that this deletion is the entire content diff; frontmatter, source URLs, quotes, numbers, headings, legal conditions, media descriptions and the first two substantive paragraphs are otherwise byte-identical.

| File number | First paragraph starts | Second paragraph starts | Previous three zh-hant articles compared |
| --- | --- | --- | --- |
| 188 | 高速公路交流道南港出口往舊宗路的車道上 | 被擋的車準備左轉，對方也跟著左轉 | 182, 183, 184 |
| 191 | 2025年3月10日19時47分10秒 | 兩個時刻相減，是2分56秒 | 188, 189, 190 |
| 194 | 2023年7月3日中午12時 | 這段碰撞前的影像，後來成了白車駕駛上訴時的一個爭點 | 189, 190, 191 |
| 204 | 2025年6月3日上午7時14分 | 同年11月25日下午5時13分 | 198, 199, 201 |

Comparator ordering uses publication date, then filename for same-day ties. The openings convey distinct incident movements, timing or evidentiary issues. Removing an opening sentence would lose case context, unlike removing the author label. No new stock introduction, consultation pitch or legal assertion was introduced. This was an attribution-only review, not a fresh legal-source verification or a claim of native/human review. Full excerpt/comparator evidence is in `~/tseng-byline-1020/content-audit.json`.

## Verification and handoff

The new `column-no-public-authors.test.tsx` renders actual file-backed expert articles and archives for all 49 locales; issue/criminal boards for five locales; traffic boards/articles for four locales; and checks HTML, inherited metadata via Next's BasicMeta, nested JSON-LD, cards, custom/AI/missing author input, author-query handling, body labels/signatures, image alt and locale discovery catalogs. `column-attribution.test.ts` checks manuscript and CMS HTML handling, condition preservation, quotes and code. Related existing tests cover the 29 Folio article shells, public API vs authenticated scope, fetched blog cards and saved canvas fallback.

Final commands, counts, logs, commit and remaining external-lane changes are recorded in `~/tseng-byline-1020/REPORT.md`. Build and production/browser readback remain for Grok Bot and the deployment owner; no release claim is made here.
