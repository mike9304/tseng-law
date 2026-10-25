# All-language column inventory — 2026-10-25

Source commit: `ef3b24e73d84968eea08ea9d58e991ccbbf83fa8`; mode: `git-commit`.

The completion benchmark is at least 286 substantive professional columns in each of the 49 supported languages, matching the largest initial primary-language collection (zh-hant). The 135 subjects shared by the four primary languages are a first milestone, not the completion target.

This snapshot contains 1,976 professional articles and 125 separate issue articles. It lacks 12,038 local articles to reach the count benchmark and 12,305 board-visible local articles to reach the same visible benchmark. These numbers are scope measures, not permission to publish duplicate or unsuitable articles.

There are 628 distinct professional slugs, 459 in the primary-language union, 135 common to ko/zh-hant/en/ja, and 18 common to all languages. Other languages lack 5,189 translations of the primary common set.

| Locale | Local professional | Board-visible local | Hidden from board | Issues | Gap to 286 | Visible gap |
|---|---:|---:|---:|---:|---:|---:|
| ko | 207 | 207 | 0 | 29 | 79 | 79 |
| zh-hant | 286 | 286 | 0 | 4 | 0 | 0 |
| en | 208 | 208 | 0 | 31 | 78 | 78 |
| ja | 220 | 220 | 0 | 29 | 66 | 66 |
| vi | 43 | 43 | 0 | 28 | 243 | 243 |
| id | 31 | 21 | 10 | 0 | 255 | 265 |
| th | 31 | 20 | 11 | 0 | 255 | 266 |
| fil | 26 | 21 | 5 | 0 | 260 | 265 |
| ar | 26 | 14 | 12 | 0 | 260 | 272 |
| de | 26 | 12 | 14 | 0 | 260 | 274 |
| es | 46 | 41 | 5 | 2 | 240 | 245 |
| fr | 29 | 21 | 8 | 2 | 257 | 265 |
| pt | 26 | 15 | 11 | 0 | 260 | 271 |
| zh-hans | 26 | 21 | 5 | 0 | 260 | 265 |
| ms | 21 | 16 | 5 | 0 | 265 | 270 |
| ru | 21 | 16 | 5 | 0 | 265 | 270 |
| tr | 21 | 16 | 5 | 0 | 265 | 270 |
| it | 26 | 15 | 11 | 0 | 260 | 271 |
| nl | 21 | 16 | 5 | 0 | 265 | 270 |
| pl | 21 | 16 | 5 | 0 | 265 | 270 |
| hi | 26 | 16 | 10 | 0 | 260 | 270 |
| sv | 21 | 16 | 5 | 0 | 265 | 270 |
| da | 21 | 16 | 5 | 0 | 265 | 270 |
| nb | 21 | 16 | 5 | 0 | 265 | 270 |
| fi | 21 | 16 | 5 | 0 | 265 | 270 |
| cs | 21 | 16 | 5 | 0 | 265 | 270 |
| hu | 21 | 16 | 5 | 0 | 265 | 270 |
| ro | 21 | 16 | 5 | 0 | 265 | 270 |
| uk | 21 | 16 | 5 | 0 | 265 | 270 |
| el | 21 | 16 | 5 | 0 | 265 | 270 |
| he | 21 | 16 | 5 | 0 | 265 | 270 |
| bn | 21 | 16 | 5 | 0 | 265 | 270 |
| ur | 21 | 16 | 5 | 0 | 265 | 270 |
| fa | 21 | 16 | 5 | 0 | 265 | 270 |
| my | 21 | 16 | 5 | 0 | 265 | 270 |
| ta | 21 | 16 | 5 | 0 | 265 | 270 |
| ne | 21 | 16 | 5 | 0 | 265 | 270 |
| km | 21 | 16 | 5 | 0 | 265 | 270 |
| mn | 21 | 16 | 5 | 0 | 265 | 270 |
| sk | 21 | 16 | 5 | 0 | 265 | 270 |
| bg | 21 | 16 | 5 | 0 | 265 | 270 |
| hr | 21 | 16 | 5 | 0 | 265 | 270 |
| sr | 21 | 16 | 5 | 0 | 265 | 270 |
| sl | 21 | 16 | 5 | 0 | 265 | 270 |
| lt | 21 | 16 | 5 | 0 | 265 | 270 |
| lv | 21 | 16 | 5 | 0 | 265 | 270 |
| et | 21 | 16 | 5 | 0 | 265 | 270 |
| ca | 21 | 16 | 5 | 0 | 265 | 270 |
| is | 21 | 16 | 5 | 0 | 265 | 270 |

## Counting and limits

- Direct .md children of the registered column directory; slug is filename minus exactly three digits and hyphen.
- Separate ISSUE_BOARD_LOCALES directory corpus; not added to professional parity.
- The production Markdown loader does not filter status/draft; explicit flags are reported, not treated as proof of withholding.
- Executed normalizeColumnAudience and filterMarketBoardColumns from the same source snapshot. These are file-backed policy counts, not an assertion about deployed HTML or CMS overlays.
- Source-language links, English fallback pages and external sources are not local columns. Source-link count follows the guidance index condition.
- No automated inventory certifies language quality, unique legal subjects, legal review, deployment or live navigation.
- Records explicitly marked draft by `draft: true` or `status: draft`: 0. `published` means a publication date, not a publication switch. The old `src/content/semiconductor-drafts` package (three Korean articles and one service draft) is outside these loaders and totals.
- The local-language board policy is evaluated from the same snapshot as the content. Hidden shared articles retain direct URLs and sitemap entries. The guidance policy reports 0 untranslated Korean-source link entries; these are excluded from local totals. Vietnamese has its own board, and market-curated guidance boards suppress that source listing.
- Core ko/zh-hant/en can receive builder/CMS overlays at runtime. This file inventory does not count or inspect those overlays; actual static delivery must be checked separately.
- A shared slug identifies a translation cluster. A numeric prefix alone does not: match the full slug and legal subject. No inventory can certify that different slugs are substantively distinct.

## Source and registration paths

- `src/lib/public-guidance.ts`: the 49-member `PUBLIC_LOCALES_8` registry (historical name).
- `src/lib/column-locales.ts`: locale-to-directory mapping.
- `src/lib/columns.ts`: direct Markdown loading; exactly three numeric prefix digits removed for professional slugs.
- `src/lib/column-audience.ts`, `src/data/market-column-curation.ts`: recommendations and actual file-backed board visibility.
- `src/lib/column-language-links.ts`: same-slug language switch and alternate cluster.
- `src/app/[locale]/columns/page.tsx`, `[slug]/page.tsx`, `src/app/sitemap.ts`: index, article and sitemap consumers.
- The JSON report stores every article path/hash, all 628 translation clusters with available/missing locales, and per-locale common-four/English/core-union missing slug lists.

## Reproduction and present-state comparison

```bash
python3 docs/audit/all-locales-parity-20261025/inventory.py > /tmp/tseng-column-baseline-reproduced.json
cmp docs/audit/all-locales-parity-20261025/baseline.json /tmp/tseng-column-baseline-reproduced.json
python3 docs/audit/all-locales-parity-20261025/inventory.py --worktree --compare docs/audit/all-locales-parity-20261025/baseline.json > /tmp/tseng-column-current.json
```

`--ref SHA` audits another immutable commit. `--worktree` includes untracked current articles and reads the current policy modules; partial writes or malformed frontmatter are reported. `--output FILE` and `--markdown FILE` are explicit report outputs. The script does not modify repository content, fetch, stage, commit or deploy. It requires the repository gray-matter and TypeScript packages and defaults to the verified NVM Node runtime.

Validation: 0 YAML parse errors; 0 duplicate slugs within a locale and board; 0 empty bodies; 0 missing titles. Editorial, legal and deployed-page review remain separate.
