# All-language column inventory — 2026-10-25

Source commit: `1ef3a9fe1a8702cda57949c5c53d3b713cc20b64`; mode: `working-tree`.

The completion benchmark is at least 286 substantive professional columns in each of the 49 supported languages, matching the largest initial primary-language collection (zh-hant). The 135 subjects shared by the four primary languages are a first milestone, not the completion target.

This snapshot contains 2,163 professional articles and 125 separate issue articles. It lacks 11,855 local articles to reach the count benchmark and 12,122 board-visible local articles to reach the same visible benchmark. These numbers are scope measures, not permission to publish duplicate or unsuitable articles.

There are 668 distinct professional slugs, 475 in the primary-language union, 135 common to ko/zh-hant/en/ja, and 21 common to all languages. Other languages lack 5,084 translations of the primary common set.

| Locale | Local professional | Board-visible local | Hidden from board | Issues | Gap to 286 | Visible gap |
|---|---:|---:|---:|---:|---:|---:|
| ko | 211 | 211 | 0 | 29 | 75 | 75 |
| zh-hant | 290 | 290 | 0 | 4 | 0 | 0 |
| en | 212 | 212 | 0 | 31 | 74 | 74 |
| ja | 224 | 224 | 0 | 29 | 62 | 62 |
| vi | 45 | 45 | 0 | 28 | 241 | 241 |
| id | 33 | 23 | 10 | 0 | 253 | 263 |
| th | 31 | 20 | 11 | 0 | 255 | 266 |
| fil | 31 | 26 | 5 | 0 | 255 | 260 |
| ar | 34 | 22 | 12 | 0 | 252 | 264 |
| de | 32 | 18 | 14 | 0 | 254 | 268 |
| es | 46 | 41 | 5 | 2 | 240 | 245 |
| fr | 31 | 23 | 8 | 2 | 255 | 263 |
| pt | 34 | 23 | 11 | 0 | 252 | 263 |
| zh-hans | 29 | 24 | 5 | 0 | 257 | 262 |
| ms | 30 | 25 | 5 | 0 | 256 | 261 |
| ru | 30 | 25 | 5 | 0 | 256 | 261 |
| tr | 24 | 19 | 5 | 0 | 262 | 267 |
| it | 32 | 21 | 11 | 0 | 254 | 265 |
| nl | 26 | 21 | 5 | 0 | 260 | 265 |
| pl | 26 | 21 | 5 | 0 | 260 | 265 |
| hi | 34 | 24 | 10 | 0 | 252 | 262 |
| sv | 24 | 19 | 5 | 0 | 262 | 267 |
| da | 24 | 19 | 5 | 0 | 262 | 267 |
| nb | 24 | 19 | 5 | 0 | 262 | 267 |
| fi | 24 | 19 | 5 | 0 | 262 | 267 |
| cs | 26 | 21 | 5 | 0 | 260 | 265 |
| hu | 24 | 19 | 5 | 0 | 262 | 267 |
| ro | 24 | 19 | 5 | 0 | 262 | 267 |
| uk | 24 | 19 | 5 | 0 | 262 | 267 |
| el | 24 | 19 | 5 | 0 | 262 | 267 |
| he | 26 | 21 | 5 | 0 | 260 | 265 |
| bn | 24 | 19 | 5 | 0 | 262 | 267 |
| ur | 24 | 19 | 5 | 0 | 262 | 267 |
| fa | 24 | 19 | 5 | 0 | 262 | 267 |
| my | 24 | 19 | 5 | 0 | 262 | 267 |
| ta | 24 | 19 | 5 | 0 | 262 | 267 |
| ne | 24 | 19 | 5 | 0 | 262 | 267 |
| km | 24 | 19 | 5 | 0 | 262 | 267 |
| mn | 24 | 19 | 5 | 0 | 262 | 267 |
| sk | 24 | 19 | 5 | 0 | 262 | 267 |
| bg | 24 | 19 | 5 | 0 | 262 | 267 |
| hr | 24 | 19 | 5 | 0 | 262 | 267 |
| sr | 24 | 19 | 5 | 0 | 262 | 267 |
| sl | 24 | 19 | 5 | 0 | 262 | 267 |
| lt | 26 | 21 | 5 | 0 | 260 | 265 |
| lv | 24 | 19 | 5 | 0 | 262 | 267 |
| et | 24 | 19 | 5 | 0 | 262 | 267 |
| ca | 24 | 19 | 5 | 0 | 262 | 267 |
| is | 24 | 19 | 5 | 0 | 262 | 267 |

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
- The JSON report stores every article path/hash, all 668 translation clusters with available/missing locales, and per-locale common-four/English/core-union missing slug lists.

## Reproduction and present-state comparison

```bash
python3 docs/audit/all-locales-parity-20261025/inventory.py > /tmp/tseng-column-baseline-reproduced.json
cmp docs/audit/all-locales-parity-20261025/baseline.json /tmp/tseng-column-baseline-reproduced.json
python3 docs/audit/all-locales-parity-20261025/inventory.py --worktree --compare docs/audit/all-locales-parity-20261025/baseline.json > /tmp/tseng-column-current.json
```

`--ref SHA` audits another immutable commit. `--worktree` includes untracked current articles and reads the current policy modules; partial writes or malformed frontmatter are reported. `--output FILE` and `--markdown FILE` are explicit report outputs. The script does not modify repository content, fetch, stage, commit or deploy. It requires the repository gray-matter and TypeScript packages and defaults to the verified NVM Node runtime.

Validation: 0 YAML parse errors; 0 duplicate slugs within a locale and board; 0 empty bodies; 0 missing titles. Editorial, legal and deployed-page review remain separate.
