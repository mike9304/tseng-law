# WO-EN-FULL-COLUMNS — Full English Column Translation Implementation Plan

> Date: 2026-07-24 KST  
> Repository: `/Users/son7/Projects/tseng-law`  
> Status: **IMPLEMENTATION PLAN ONLY**  
> Authorization boundary: create this plan file only; do not implement product/content changes in this work order  
> Prohibited throughout this plan and its implementation handoff: **no git commit, no git push, no deploy**

## 1. Outcome and definition of done

Replace the generated English column stubs with 17 complete, lawyer-reviewable English Markdown articles. Each English file must have filename/slug parity with its Korean source, preserve the source article's complete legal substance and Markdown structure, and be written for Korean individuals and companies dealing with Taiwan law or doing business in Taiwan.

This work is complete only when all of the following are true:

1. `src/content/columns-en/` contains exactly 17 Markdown files with one-to-one filename and slug parity with `src/content/columns/`.
2. `getAllColumnPosts('en')` reads those files directly; it no longer synthesizes `Overview + Key Focus Areas + Consultation` content through `buildEnglishColumnContent()`.
3. All 17 English bodies, titles, summaries, and translated FAQs pass the content-integrity gates in this plan.
4. The five Korean files that contain `faq` have English FAQ arrays with the same item count and order.
5. `/en/columns/<slug>` renders a complete English article for every one of the 17 slugs.
6. The 17 complete English articles are indexable and participate in reciprocal `ko`, `zh-Hant`, `en`, and `x-default` hreflang sets.
7. English column detail routes without a canonical file translation remain excluded/noindex; this work must not accidentally index unrelated builder/Blob English drafts or stubs.
8. Targeted unit tests, metadata tests, sitemap tests, typecheck, lint, isolated build, and browser checks pass.
9. No Japanese route, locale, translation, or hreflang is added.
10. No commit, push, deploy, Blob write, CMS publish, or production mutation occurs.

## 2. Verified baseline

The plan is based on the repository state inspected on 2026-07-24:

- Supported locales are exactly `ko | zh-hant | en` in `src/lib/locales.ts`; there is no `ja`.
- Korean source bodies: `src/content/columns/*.md`, 17 files.
- Traditional Chinese bodies: `src/content/columns-zh/*.md`, 17 files.
- There is no `src/content/columns-en/`.
- `src/lib/columns.ts` maps `zh-hant` to `columns-zh` and all other locales to the Korean directory.
- For `en`, `getAllColumnPosts()` overlays English archive titles/summaries and calls `buildEnglishColumnContent()`, producing only three short sections.
- The live English detail route therefore renders thin content and usually reports a one-minute read.
- `src/app/[locale]/columns/[slug]/page.tsx` currently sets English column details to `noindex` and limits alternates to Korean and Traditional Chinese.
- `src/app/sitemap.ts` skips English column detail entries and removes English detail hreflang through `isEnglishNoindexPath()`.
- The five Korean files with FAQ frontmatter are `001`, `002`, `004`, `008`, and `011`.
- The shared worktree is already dirty with unrelated lanes. Implementers must not reset, clean, stage, reformat, or adopt unrelated changes.
- Runtime page reads merge file, builder-storage, and Blob columns, with builder/Blob records able to shadow file records by slug. A read-only collision check is required before any later release; changing that precedence is outside this work order.

## 3. Scope

### In scope

- Full English translation of all 17 Korean column files.
- Traditional Chinese articles as terminology/reference material only, not as re-translation targets.
- English frontmatter, English FAQ translation where the Korean source has FAQ, and localized internal links.
- Direct English directory selection in `src/lib/columns.ts`.
- Removal of the English stub-generation path from `src/lib/columns.ts`.
- Category parsing needed for English frontmatter.
- English FAQ rendering and FAQ JSON-LD for the five translated FAQ articles.
- Indexability, sitemap, canonical, and hreflang policy for the 17 file-backed complete English articles.
- Automated content-integrity tests and representative browser render checks.

### Out of scope

- Adding `ja` to the locale union, middleware, routes, navigation, metadata, sitemap, or builder.
- Translating into Japanese. Japanese is an optional Phase 2 only if a separate, attributable Japanese content set appears and a distinct locale work order is approved.
- Importing or reconstructing alleged Air translations that are not present in this repository.
- Re-translating or stylistically rewriting `src/content/columns-zh/*.md`.
- Editing Korean source content, correcting Korean legal claims, or changing Korean frontmatter.
- Design redesign, typography changes, component redesign, navigation redesign, or column-card redesign.
- Changing Blob/builder precedence, publishing CMS records, or mutating production content.
- New statutes, case citations, case numbers, factual claims, examples, guarantees, disclaimers, or CTAs that do not exist in the source.
- SEO work outside the 17 canonical English column detail pages.
- Commit, push, deploy, or production verification.

## 4. Exact file whitelist

No implementation file outside this list may be created or modified. If implementation reveals a genuine need for another file, stop and obtain a revised whitelist before editing it.

### 4.1 New English content files — exact naming parity

Create these 17 files:

1. `src/content/columns-en/001-taiwan-company-establishment-basics.md`
2. `src/content/columns-en/002-withdraw-capital-taiwan-company.md`
3. `src/content/columns-en/003-taiwan-traffic-accident-procedure.md`
4. `src/content/columns-en/004-taiwan-company-subsidiary-vs-branch.md`
5. `src/content/columns-en/005-taiwan-company-establishment-advanced-2.md`
6. `src/content/columns-en/006-taiwan-massage-history-law.md`
7. `src/content/columns-en/007-taiwan-divorce-lawsuit-qna.md`
8. `src/content/columns-en/008-taiwan-labor-severance-law.md`
9. `src/content/columns-en/009-taiwan-voluntary-resignation-severance.md`
10. `src/content/columns-en/010-taiwan-gym-injury-lawsuit.md`
11. `src/content/columns-en/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md`
12. `src/content/columns-en/012-taiwan-overtaking-accident-liability.md`
13. `src/content/columns-en/013-taiwan-company-establishment-advanced-1.md`
14. `src/content/columns-en/014-taiwan-mandatory-employment-period.md`
15. `src/content/columns-en/015-taiwan-company-setup-pitch-location.md`
16. `src/content/columns-en/016-taiwan-inheritance-custody-analysis.md`
17. `src/content/columns-en/017-taiwan-logistics-business-setup.md`

### 4.2 Loader and public SEO behavior

- `src/lib/columns.ts`
- `src/app/[locale]/columns/[slug]/page.tsx`
- `src/app/sitemap.ts`

### 4.3 Tests

- `src/lib/__tests__/columns-en-content.test.ts` — new
- `src/app/[locale]/columns/[slug]/__tests__/metadata.test.ts` — new
- `src/app/__tests__/sitemap.test.ts` — modify
- `tests/builder-editor/en-columns-full-content.playwright.ts` — new

### 4.4 Explicitly forbidden nearby files

- `src/content/columns/**`
- `src/content/columns-zh/**`
- `src/data/insights-archive.ts`
- `src/lib/locales.ts`
- `src/lib/seo.ts`
- `src/lib/consultation/columns-blob-reader.ts`
- `src/components/ColumnContent.tsx`
- `src/app/[locale]/columns/page.tsx`
- `src/app/robots.ts`
- all CSS/design files
- all builder persistence, Blob, CMS, and publish files
- `package.json` and lockfiles

## 5. English frontmatter contract

Every English file must parse with `gray-matter` and use the same field structure as its Korean counterpart.

### Required fields

| Field | English rule |
| --- | --- |
| `title` | Complete, natural English translation; no Hangul; no clickbait embellishment beyond the source. |
| `url` | Preserve the Korean source file's original external provenance URL exactly; do not fabricate an English source URL. |
| `lastmod` | Preserve the Korean source ISO value exactly. This represents the underlying legal article's content date, not the translation work date. |
| `date_display` | Render the same `lastmod` in English, e.g. `September 13, 2025`; never `Date pending`. |
| `read_time` | Recalculate from the final rendered English body at 200 words/minute, rounded up, formatted exactly as `N min read`. |
| `categories` | One English semantic category using the controlled vocabulary below. |
| `featured_image` | Preserve the Korean source value exactly. |
| `faq` | Present only when it exists in the Korean source; translate every `q` and `a`, preserving item count/order. |

Controlled category vocabulary:

- Korean `대만 법인설립` → English `Taiwan Company Formation`
- Korean `대만 법률정보` → English `Taiwan Legal Information`
- Korean `소송사례 분석` → English `Case Analysis`

`categoryFromString()` must recognize these English values and continue to map them to the existing internal `formation | legal | case` union. Do not change the union or public category labels.

Frontmatter parity assertions:

- filename and slug are identical across KO and EN;
- `lastmod`, `featured_image`, and `url` equal the Korean source;
- the English title, date display, read time, and category contain no Hangul;
- FAQ presence matches exactly: five EN files, matching `001`, `002`, `004`, `008`, and `011`;
- each FAQ file has the same number of entries as KO, in the same order;
- no unrecognized or extra workflow fields such as `translation_status`, reviewer notes, or model names are written into public frontmatter.

## 6. Translation quality contract for legal content

### 6.1 Fidelity and non-invention

1. Translate the complete Korean body. Do not summarize, compress, merge sections, omit repetitive-looking passages, or replace the body with a general explainer.
2. Preserve the source's order and Markdown structure: H1, paragraphs, Q&A numbering, bold labels, lists, tables, blockquotes, separators, link positions, and conclusion/related-links section.
3. Preserve every legally meaningful number exactly: statute article/paragraph numbers, time limits, dates, percentages, currency amounts, thresholds, counts, and process order.
4. Never invent a case number, court, statute, article, agency, filing deadline, remedy, penalty, eligibility rule, factual example, or outcome.
5. If the Korean and Traditional Chinese files conflict, do not silently reconcile them. Translate the Korean claim faithfully, record the conflict in the worker report, and require attorney review before release.
6. If a source statement appears outdated, mistranslated, internally inconsistent, or legally uncertain, do not “fix” it in English. Flag the exact passage in the worker report. Source-law corrections require a separate lawyer-approved work order covering all locales.
7. Do not convert legal conclusions into guarantees. Preserve qualifications such as “may,” “generally,” “depending on the circumstances,” and “consult a lawyer.”
8. Do not add a generic AI-written introduction, SEO filler, keyword list, disclaimer, or consultation CTA. Translate a CTA only where one exists in the source.

### 6.2 Taiwan terminology and names

1. Use the official English name of a Taiwan statute or agency when it is reliably identifiable. Keep the Traditional Chinese official name in parentheses on first use when that helps disambiguation.
2. Use Taiwan-specific terminology, not US/UK substitutes. Examples include New Taiwan dollar/NTD, household registration office, company limited by shares, limited company, branch office, Ministry of Economic Affairs, Ministry of Labor, National Immigration Agency, and Taiwan Food and Drug Administration where those entities are present in the source.
3. Preserve Traditional Chinese legal terms in parentheses when the source includes them, such as `戶政事務所`, `借名登記`, or `剩餘財產分配請求權`; translate the surrounding explanation into clear English.
4. Keep Taiwan place names accurate and consistently romanized: Taipei City, Datong District, Taichung, Kaohsiung, and other source locations.
5. Romanize Korean personal and company names consistently. The target is zero Hangul in the English body; a proper noun is not an automatic exception.
6. If an exceptional proper noun truly cannot be represented without Hangul, stop and request an explicit exact-string allowlist. Do not weaken the Hangul test or add a broad Unicode exception.
7. Do not translate Taiwan into “China,” conflate NTD with RMB, or replace Taiwan statutes with Korean statutes.

### 6.3 Audience and English style

- Audience: Korean founders, companies, employees, families, and travelers handling matters in Taiwan, reading in English.
- Register: professional, direct, plain legal English; preserve the lawyer's first-person voice where present.
- Explain Taiwan institutions sufficiently for a cross-border reader without adding new legal substance.
- Prefer short, readable sentences, but do not sacrifice conditions, exceptions, or causal relationships.
- Preserve Korean-client comparisons where the source compares Taiwan and Korea.
- Avoid Americanisms that imply US procedure, such as “district attorney,” “LLC,” or “alimony,” unless they precisely fit the Taiwan concept and are explained.

### 6.4 Links and media

- Preserve the lead H1 and lead featured image in Markdown; the existing loader will strip duplicated lead display elements at runtime.
- Preserve inline-image references and their relative paths even though the current loader strips inline images during rendering. Do not delete source structure during translation.
- Translate image alt text to English.
- Change internal locale links from `/ko/...` to the equivalent `/en/...` only when that English route exists.
- Preserve external URLs exactly unless the source URL is visibly malformed; malformed links are reported, not silently replaced.
- Do not add `/ja/` links.

## 7. Loader implementation plan

All work in this section is confined to `src/lib/columns.ts`.

1. Add `COLUMNS_EN_DIR = path.join(process.cwd(), 'src/content/columns-en')`.
2. Change `getColumnsDir(locale)` to an explicit three-way mapping:
   - `ko` → `src/content/columns`
   - `zh-hant` → `src/content/columns-zh`
   - `en` → `src/content/columns-en`
3. Do not silently fall back from a supported locale to Korean. A missing supported content directory must fail tests/build visibly rather than leak Korean content into English.
4. Update `categoryFromString()` to recognize the controlled English category values without changing Korean or Traditional Chinese behavior.
5. Remove the English overlay branch from `getAllColumnPosts()`. English title, summary, date display, read time, content, and FAQ must come from English Markdown exactly as KO/ZH content comes from their directories.
6. Remove `buildEnglishColumnContent()`, `toEnglishDateDisplay()`, `toEnglishReadTime()`, `REAL_SLUG_TO_INSIGHT_ID`, and the now-unused `insightsArchive`/`InsightPost` import.
7. Keep common transformations unchanged: slug extraction, image-path normalization, lead H1/image removal at runtime, inline-image stripping, summary extraction, FAQ normalization, sorting, and aliases.
8. Export a small file-backed translation predicate or canonical EN slug set from this module, e.g. symbolically `isFullEnglishColumnTranslationSlug(slug)`. It must be based on `columns-en` filenames, not archive metadata or Blob records. The detail metadata and sitemap use it to avoid indexing unrelated English CMS stubs.
9. Keep `getColumnSlugs()` based on KO as the canonical route list; parity tests guarantee that EN covers the same 17 slugs.

Expected data behavior after this change:

- `getAllColumnPosts('ko')`: unchanged.
- `getAllColumnPosts('zh-hant')`: unchanged.
- `getAllColumnPosts('en')`: 17 complete English file-backed posts.
- Unknown/missing EN file: no Korean fallback and no fabricated English stub.
- Runtime builder/Blob overlays: unchanged by this work order; a same-slug collision is a release blocker to inspect separately.

## 8. English FAQ rendering plan

Confined to `src/app/[locale]/columns/[slug]/page.tsx`:

1. Replace the current locale restriction on FAQ rendering with a content rule: show FAQ whenever `post.faq` contains valid items.
2. This enables English FAQ HTML and `FAQPage` JSON-LD for the five translated FAQ articles.
3. Keep FAQ absent for the other 12 articles.
4. Remove/update the stale comment saying only KO/ZH have hand-authored FAQ.
5. Do not change FAQ markup, styling, JSON-LD builder, or Korean/Traditional Chinese behavior.

## 9. Sitemap, indexability, and hreflang policy decision

### Decision

Once all 17 English files pass content and legal-review gates, the 17 canonical English column details become indexable first-class translations.

For each canonical slug:

- canonical: the current locale's own URL;
- alternates: `ko`, `zh-Hant`, `en`, and `x-default`;
- `x-default`: Korean, following the existing site default;
- sitemap: one detail entry for each of KO, ZH-Hant, and EN;
- `lastModified`: read from that locale's file frontmatter;
- robots: index/follow for the complete English file-backed route.

This policy must be activated only after the content gate is green. Partial delivery must retain the old noindex/exclusion behavior.

### Detail metadata changes

In `src/app/[locale]/columns/[slug]/page.tsx`:

1. Resolve whether the slug has a canonical file-backed EN translation using the predicate from `src/lib/columns.ts`.
2. For those 17 translations, set `noindex: false` and pass all three locales as alternates.
3. For an English detail without a canonical EN file, retain `noindex: true` and exclude `en` from alternates.
4. KO/ZH pages for the 17 translated slugs must advertise EN; nontranslated/unrelated dynamic columns must not gain a false EN alternate.

### Sitemap changes

In `src/app/sitemap.ts`:

1. Generate file-backed column entries from each locale's own `getAllColumnPosts(locale)` result instead of using the KO array for both KO and ZH.
2. Remove the unconditional `if (locale === 'en') continue` for canonical translated columns.
3. Include all three locales in `alternateLocales` for the 17 parity slugs.
4. Preserve the English noindex filter for unknown/untranslated `/columns/<slug>` routes. Refine `isEnglishNoindexPath()`/`applyLocaleIndexabilityRules()` so only the canonical EN file slug set is exempt.
5. When filtering an untranslated English detail, continue removing its English hreflang from the KO/ZH sitemap entry.
6. Do not change `/en/columns` listing policy; it is already indexable.
7. Do not alter FAQ, portfolio, events, or store noindex rules.
8. Keep URL deduplication and builder sitemap failure handling unchanged.

## 10. Parallel translation execution

### 10.1 Lane safety

Translation workers must not write to the shared repository directly. Each worker receives read-only copies of its assigned KO files and matching ZH reference files, then writes only to a dedicated scratch output directory such as:

```text
/tmp/tseng-law-en-columns-2026-07-24/
  worker-a/
  worker-b/
  worker-c/
  worker-d/
  worker-e/
```

The coordinator reviews outputs and copies approved files into `src/content/columns-en/` one at a time. No worker edits `columns.ts`, sitemap, page metadata, tests, or another worker's files. Scratch outputs are not commits and are not deployed.

### 10.2 Balanced five-worker shard

The shard is balanced by inspected Korean body size and topic complexity:

| Worker | Assigned posts | Approx. KO source characters | Special review focus |
| --- | --- | ---: | --- |
| A | `007`, `009`, `015` | 27.5k | divorce/family Q&A, severance exception, business premises |
| B | `003`, `005`, `012` | 27.1k | traffic procedure/deadlines, company setup, accident liability |
| C | `010`, `008`, `014` | 23.6k | litigation narrative, labor severance/statutes, mandatory service period |
| D | `016`, `001`, `004` | 24.0k | personal names/inheritance/custody, formation FAQ, subsidiary vs branch/tax |
| E | `011`, `017`, `013`, `006`, `002` | 27.2k | cosmetics/PIF, logistics licensing, formation, massage law/history, liquidation |

Each worker returns, without editing the repository:

- its completed English Markdown files;
- a per-file source-to-output structure checklist;
- a list of every statute/article, time limit, percentage, currency amount, agency, and place name checked;
- any KO/ZH conflict or suspected source issue, quoted by short exact passage;
- calculated English word count and `read_time`;
- confirmation that no facts, citations, sections, or CTAs were added.

### 10.3 Cross-review

After translation:

1. A read-only terminology reviewer checks all 17 files for consistent Taiwan statute, agency, business-form, currency, and place-name terminology.
2. A separate legal-fidelity reviewer checks every number/citation and all five FAQ arrays against KO, consulting ZH only to confirm Taiwan terminology.
3. The coordinator runs automated gates before copying any file that failed review.
4. The code/test integrator starts only after all 17 content files are approved. There must be one writer for shared TypeScript/test files.
5. The SEO switch is integrated last, after content, loader, and content tests pass.

## 11. Implementation order and gates

| Order | Work | Exit gate |
| --- | --- | --- |
| 0 | Record `git status --short`, HEAD, 17 KO filenames, 17 ZH filenames, and target whitelist | No overlap with active lanes; target plan remains the only current change |
| 1 | Prepare controlled terminology sheet and per-file legal-number checklist outside the repo | Reviewer agrees on Taiwan English terminology; no public file changed |
| 2 | Run five translation shards in scratch directories | 17 outputs present; exact filename parity |
| 3 | Cross-review translations and FAQs | No omissions/inventions; all conflicts explicitly flagged |
| 4 | Add the 17 approved files to `columns-en` | Frontmatter and static content-integrity tests pass |
| 5 | Update `src/lib/columns.ts` and loader tests | EN reads files directly; stub builder is absent; KO/ZH regressions pass |
| 6 | Enable English FAQ render/metadata behavior | Metadata unit tests and FAQ assertions pass |
| 7 | Activate sitemap/index/hreflang policy for the canonical 17 | Sitemap tests prove 51 localized detail entries and reciprocal alternates |
| 8 | Typecheck, lint, isolated build, and browser verification | All commands and sample routes pass with no console/page errors |
| 9 | Produce a diff/evidence report only | Whitelist exact; no commit/push/deploy; unresolved legal issue means STOP |

The implementation must not proceed to order 7 with 16/17 translations. SEO activation is atomic across the canonical parity set.

## 12. Automated test plan

### 12.1 New content-integrity unit test

Create `src/lib/__tests__/columns-en-content.test.ts` with tests that:

1. Assert KO and EN directories each contain exactly 17 `.md` files.
2. Assert sorted KO and EN basenames are identical.
3. Assert `getAllColumnPosts('en')` returns 17 posts and the same slug set as KO.
4. Assert every EN title, extracted summary, cleaned body content, category display input, FAQ question, and FAQ answer contains zero Hangul (`[\uAC00-\uD7AF]`).
5. Assert every EN body is non-empty and does not match the complete old stub fingerprint (`## Overview`, `## Key Focus Areas`, and `## Consultation` together).
6. Assert `Date pending` occurs zero times in EN frontmatter and loaded posts.
7. Assert `dateDisplay` is non-empty English text and `readTime` matches `^\d+ min read$`.
8. Parse KO and EN frontmatter and assert required key parity, exact `url`/`lastmod`/`featured_image` equality, and controlled English categories.
9. Assert FAQ presence, item count, and order parity for `001`, `002`, `004`, `008`, and `011`; assert no unexpected FAQ on the other 12 files.
10. Normalize each body by removing frontmatter, Markdown syntax, zero-width characters, and repeated whitespace; require EN normalized character length to be at least `max(1,200, 75% of KO normalized characters)`.
11. Compare structure signatures per file: lead H1 count, numbered Q/A or numbered-section count, list-item count, table-row count, blockquote count, and internal-link count. A mismatch must fail or be covered by a narrow per-file reviewed exception with a written reason in the test.
12. Assert English internal links contain no `/ko/` or `/zh-hant/` target and no `/ja/` target.
13. Assert every `lastmod` parses as a valid date and every frontmatter `date_display` avoids Korean date suffixes.
14. Assert `isFullEnglishColumnTranslationSlug()` is true for all 17 canonical slugs and false for an unknown slug.

The length floor is a truncation detector, not proof of translation quality. Manual structure and legal-number review remains mandatory.

### 12.2 Metadata unit test

Create `src/app/[locale]/columns/[slug]/__tests__/metadata.test.ts`:

- use a canonical translated slug and call `generateMetadata()` for `en`;
- assert canonical is the EN URL;
- assert robots are index/follow;
- assert alternates contain `ko`, `zh-Hant`, `en`, and `x-default`;
- assert title/description have no Hangul and description is not the old stub;
- use a controlled noncanonical slug/mocked fallback case to prove an English non-file translation remains noindex and does not advertise EN as a completed translation;
- verify an FAQ-bearing EN post exposes translated FAQ through the loader; browser coverage validates rendered FAQ JSON-LD.

### 12.3 Sitemap test

Modify `src/app/__tests__/sitemap.test.ts`:

- keep the existing per-post `lastModified` test;
- assert all 17 EN detail URLs are present;
- assert KO/ZH/EN detail sets have identical 17 slugs;
- assert each of the 51 canonical detail entries has `ko`, `zh-Hant`, `en`, and `x-default` alternates;
- assert locale-specific `lastModified` is taken from that locale's frontmatter;
- update brittle total-count expectations affected by the additional 17 URLs;
- retain a fixture such as `/en/columns/client-alert` to prove unrelated English builder content remains excluded/noindex;
- retain FAQ/portfolio/events/store English noindex assertions unchanged;
- assert the EN columns listing remains included.

### 12.4 Existing regression tests to run without modifying

- `src/app/[locale]/(legacy)/__tests__/home-legacy-localization.test.tsx`
- `src/lib/__tests__/columns-faq.test.ts`
- `src/lib/builder/__tests__/columns-backend.test.ts`

These protect the EN home mapping, FAQ normalization, and file/Blob merge behavior.

## 13. Browser and render verification

Create `tests/builder-editor/en-columns-full-content.playwright.ts`.

### All-route smoke

For all 17 EN slugs:

- response is below 400;
- page has one English H1;
- `.blog-body` is present and exceeds an article-specific minimum derived from the unit-test floor;
- rendered body contains no Hangul and no `Date pending`;
- title/body do not exhibit the complete old three-section stub fingerprint;
- canonical points to `/en/columns/<slug>`;
- robots permit indexing;
- hreflang includes reciprocal KO, ZH-Hant, EN, and x-default URLs;
- there are no page errors or failed same-origin content requests.

### Representative deep render checks

Inspect these six pages at desktop and 390 px mobile width:

1. `001-taiwan-company-establishment-basics` — formation category, translated FAQ, statute/tax figures.
2. `003-taiwan-traffic-accident-procedure` — long Q&A, deadlines, process sequence.
3. `007-taiwan-divorce-lawsuit-qna` — longest article, family-law terminology, numbered questions.
4. `010-taiwan-gym-injury-lawsuit` — case-analysis category and litigation narrative.
5. `011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide` — newest date, PIF/TFDA terminology, FAQ, lists, `/en/` related links.
6. `016-taiwan-inheritance-custody-analysis` — personal-name romanization and inheritance/custody terminology.

For `001` and `011`, assert visible English FAQ items and an English `FAQPage` JSON-LD block. For `003`, assert no FAQ section is invented. On all six, verify no horizontal overflow, intact lists/Q&A hierarchy, readable paragraphs, correct category/read-time/date display, working previous/next navigation, and localized related links.

## 14. Verification commands

Run from an isolated implementation workspace containing only the whitelisted changes. Do not run a release build from the dirty shared worktree and treat it as clean evidence.

```bash
git diff --name-only
# expected: only the exact whitelist; the plan file may also be present

npx vitest run \
  src/lib/__tests__/columns-en-content.test.ts \
  'src/app/[locale]/columns/[slug]/__tests__/metadata.test.ts' \
  src/app/__tests__/sitemap.test.ts \
  'src/app/[locale]/(legacy)/__tests__/home-legacy-localization.test.tsx' \
  src/lib/__tests__/columns-faq.test.ts \
  src/lib/builder/__tests__/columns-backend.test.ts
# expected: all pass

npm run typecheck
# expected: exit 0

npm run lint
# expected: exit 0 with no new warnings in whitelisted files

NEXT_DIST_DIR=.next-en-columns npm run build
# expected: clean isolated build exit 0

npx playwright test \
  --config=playwright.config.ts \
  tests/builder-editor/en-columns-full-content.playwright.ts \
  --project=chromium-builder \
  --workers=1
# expected: all 17 route smokes and six representative deep checks pass

git diff --check
# expected: exit 0

git status --short
# expected: no staged changes; no commit; no unrelated file adopted
```

Additional static checks:

```bash
rg -n "buildEnglishColumnContent|Key Focus Areas" src/lib/columns.ts src/content/columns-en
# expected: zero matches

rg -n "[가-힣]" src/content/columns-en
# expected: zero matches unless an exact proper-noun exception was separately approved

rg -n "Date pending|/ko/|/zh-hant/|/ja/" src/content/columns-en
# expected: zero matches

find src/content/columns-en -maxdepth 1 -type f -name '*.md' | wc -l
# expected: 17
```

## 15. Manual legal-fidelity review

Automated gates cannot validate law. Before declaring the content ready:

1. Compare each EN file side-by-side with KO, with ZH open only as a Taiwan terminology reference.
2. Check every numeral and symbol, including article numbers, paragraph numbers, years, days/months, limitation periods, percentages, NTD amounts, tax rates, and party counts.
3. Check business-form distinctions: subsidiary vs branch vs representative office and limited company vs company limited by shares.
4. Check named statutes and agencies against Taiwan's official English naming where available.
5. Check all personal names, places, and source-specific facts.
6. Check that cautionary language and factual uncertainty have not become categorical advice.
7. Check that FAQ answers do not introduce facts absent from the Korean FAQ/body.
8. Check that each source conclusion, CTA, and related link is present once and only once.
9. Record unresolved issues as blockers. Do not place reviewer notes in public Markdown.
10. Require a Taiwan-qualified attorney or designated content owner to approve legal accuracy before any later deployment request.

## 16. Runtime/Blob collision gate

The public route uses `getAllColumnPostsIncludingBlob(locale)`, and current architecture lets builder/Blob content shadow a file with the same slug. This work order does not change that rule.

Before a future release:

- perform a read-only inventory of EN builder-storage and Blob published slugs;
- compare them with the 17 canonical file slugs;
- if there is no collision, record `0 collisions`;
- if a collision exists, compare the actual public body with the approved file and stop release;
- resolve any collision through a separately authorized CMS/persistence work order, not by changing precedence here;
- never print credentials or write/delete Blob records during this check.

Local tests should force the file-only backend so translation verification is deterministic. File-only success is not evidence that a production Blob overlay is absent.

## 17. Failure handling and rollback boundary

- Translation omission, unsupported legal change, invented citation, filename mismatch, Hangul hit, `Date pending`, or length-floor failure: reject that file and return it to its translation lane.
- KO/ZH disagreement: block only the affected article, document the exact conflict, and request legal review; do not guess.
- One missing article: do not activate EN indexability or sitemap changes for the set.
- Loader regression affecting KO/ZH: revert only the whitelisted loader diff in the implementation workspace; do not reset the shared worktree.
- Sitemap regression: keep EN detail noindex/excluded until tests are corrected and all translations pass.
- Blob collision: no production action under this plan.
- Since this plan authorizes no commit or deployment, implementation rollback is simply removal/revision of the uncommitted whitelisted changes by the authorized implementer after reviewing exact paths. Never use broad reset/clean commands.

## 18. Evidence and handoff report

The implementer should return a report in chat or an explicitly approved follow-up document; do not create additional repository files outside the whitelist. The report must contain:

- exact `git diff --name-only`;
- 17/17 filename and slug parity result;
- per-worker article assignments and reviewer outcome;
- per-file normalized KO/EN length ratio and English word/read-time count;
- Hangul hit count, `Date pending` hit count, and old-stub fingerprint count;
- five FAQ parity results;
- all test/build/browser commands with exit status;
- screenshots or trace paths for the six representative pages, stored outside the repo unless separately authorized;
- unresolved legal/terminology issues;
- runtime/Blob collision status as `not checked`, `0`, or an explicit blocker;
- explicit statement: `No commit, push, deploy, Blob write, or CMS publish performed.`

## 19. Ten-line executive summary

1. Create 17 complete English Markdown columns with exact KO filename/slug parity under `src/content/columns-en/`.
2. Translate every body and applicable FAQ in full; preserve structure, numbers, citations, Taiwan terminology, images, and links.
3. Do not invent or silently correct statutes, case numbers, deadlines, penalties, agencies, facts, or legal outcomes.
4. Match KO frontmatter fields, preserve source URL/lastmod/image, localize date/category, and recalculate `N min read`.
5. Change `src/lib/columns.ts` to read the EN directory directly and delete the generated three-section English stub path.
6. Enable English FAQ HTML/JSON-LD only from the five translated FAQ frontmatters.
7. Make only the 17 canonical file-backed EN details indexable and add reciprocal KO/ZH-Hant/EN/x-default hreflang.
8. Shard translations across five scratch-directory workers, then run independent terminology and legal-fidelity review before integration.
9. Require 17-route tests, Hangul=0, Date pending=0, a 75% KO length floor, metadata/sitemap checks, build, and browser QA.
10. Japanese, design changes, ZH rewriting, Blob mutation, commit, push, and deploy are outside scope and prohibited.

## 20. Implementer file list

New English content:

- `src/content/columns-en/001-taiwan-company-establishment-basics.md`
- `src/content/columns-en/002-withdraw-capital-taiwan-company.md`
- `src/content/columns-en/003-taiwan-traffic-accident-procedure.md`
- `src/content/columns-en/004-taiwan-company-subsidiary-vs-branch.md`
- `src/content/columns-en/005-taiwan-company-establishment-advanced-2.md`
- `src/content/columns-en/006-taiwan-massage-history-law.md`
- `src/content/columns-en/007-taiwan-divorce-lawsuit-qna.md`
- `src/content/columns-en/008-taiwan-labor-severance-law.md`
- `src/content/columns-en/009-taiwan-voluntary-resignation-severance.md`
- `src/content/columns-en/010-taiwan-gym-injury-lawsuit.md`
- `src/content/columns-en/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md`
- `src/content/columns-en/012-taiwan-overtaking-accident-liability.md`
- `src/content/columns-en/013-taiwan-company-establishment-advanced-1.md`
- `src/content/columns-en/014-taiwan-mandatory-employment-period.md`
- `src/content/columns-en/015-taiwan-company-setup-pitch-location.md`
- `src/content/columns-en/016-taiwan-inheritance-custody-analysis.md`
- `src/content/columns-en/017-taiwan-logistics-business-setup.md`

Modified product/SEO files:

- `src/lib/columns.ts`
- `src/app/[locale]/columns/[slug]/page.tsx`
- `src/app/sitemap.ts`

New/modified tests:

- `src/lib/__tests__/columns-en-content.test.ts`
- `src/app/[locale]/columns/[slug]/__tests__/metadata.test.ts`
- `src/app/__tests__/sitemap.test.ts`
- `tests/builder-editor/en-columns-full-content.playwright.ts`
