# WO-JA-FULL-COLUMNS — Full Japanese Locale and Column Implementation Plan

> Date: 2026-07-24 KST  
> Repository: `/Users/son7/Projects/tseng-law`  
> Evidence: `docs/audit/WO-JA-AIR-SEARCH-EVIDENCE-2026-07-24.md`  
> Status: **IMPLEMENTATION PLAN ONLY**  
> Authorization boundary: create this plan file only; do not implement product or translation changes in this step  
> Prohibited throughout the later implementation handoff: **no commit, no push, no deploy, no Blob/CMS publish**

## 1. Outcome and definition of done

Create a first-class Japanese public column experience at `/ja/columns` with 17 complete, net-new Japanese translations of the Korean canonical articles. There is no Air corpus to import: the evidence file records a successful Air connection and exhaustive searches that found zero Japanese column files or credible Japanese legal-article candidates.

This work is complete only when:

1. `src/content/columns-ja/` contains exactly 17 Markdown files with one-to-one filename and slug parity with `src/content/columns/`.
2. Every Japanese title, summary, body, category, date/read-time label, visible link label, image alt, and applicable FAQ is a complete natural-Japanese translation, not a stub or machine-summary substitute.
3. The five Korean articles containing FAQ frontmatter (`001`, `002`, `004`, `008`, `011`) have Japanese FAQ arrays with the same item count and order.
4. `getAllColumnPosts('ja')` reads `src/content/columns-ja` directly, never silently falling back to Korean, Chinese, or English.
5. The public locale substrate recognizes `ja` without widening the builder/admin authoring locale contract or requiring Japanese builder chrome.
6. `/ja/columns` and all 17 `/ja/columns/<slug>` routes return HTTP 200 and render Japanese UI plus the approved Japanese file body.
7. The Japanese language switcher preserves the current route on the column listing/detail family and provides a safe Japanese landing target elsewhere.
8. The canonical 17 detail pages participate in reciprocal `ko`, `zh-Hant`, `en`, `ja`, and `x-default` hreflang sets; unrelated Japanese CMS/Blob drafts are not advertised.
9. Content-integrity, locale, metadata, sitemap, typecheck, lint, isolated build, and real-browser gates pass.
10. A Japanese legal-language reviewer and a Taiwan-law fidelity reviewer approve all 17 files before any later release request.

## 2. Evidence-backed baseline

- The Air evidence file confirms that `100.93.15.89` was reachable with `~/.ssh/mac_studio_to_air`.
- Air has 17 KO and 17 ZH files, but no `columns-ja`, no runtime-data hiragana hits, and no credible Japanese law-column corpus in the searched home trees or archive.
- Studio also has no `src/content/columns-ja`.
- Therefore this is **net-new translation work**, not import, cleanup, or review of a pre-existing Japanese set.
- Current public/runtime locales are `ko | zh-hant | en` in `src/lib/locales.ts`.
- The current builder code imports the same `Locale` type in many administrator and editor modules. Adding `ja` directly to that type would create an unrelated, very large builder-localization migration.
- Korean, Traditional Chinese, and newly added English column directories each contain 17 canonical filenames on the current Studio worktree.
- `src/lib/columns.ts` currently has direct KO/ZH/EN directory handling and must gain an explicit JA branch with no existence-based fallback.
- `src/app/[locale]/columns/[slug]/page.tsx`, `src/app/[locale]/columns/page.tsx`, `src/app/sitemap.ts`, `src/lib/seo.ts`, and the public navigation currently know only the three existing public locales.
- `src/middleware.ts` already has a locale-agnostic public matcher. Its hard-coded locale regexes are for authenticated admin routes, not ordinary public routes.
- The shared worktree is dirty and contains active EN and unrelated lanes. The later implementation must use an isolated worktree/snapshot and must not reset, clean, stage, or absorb unrelated changes.

## 3. Locale architecture decision

### 3.1 Separate the public site locale from the builder locale

In `src/lib/locales.ts`:

- Preserve the existing builder/core authoring contract:
  - `locales = ['ko', 'zh-hant', 'en']`
  - `Locale = 'ko' | 'zh-hant' | 'en'`
  - existing `isLocale()` and `normalizeLocale()` behavior remains available to builder/admin code.
- Add a public-site contract:
  - `siteLocales = ['ko', 'zh-hant', 'en', 'ja']`
  - `SiteLocale = Locale | 'ja'`
  - `isSiteLocale(value)`
  - `normalizeSiteLocale(value)`
- Public layout, public SEO, public navigation, and file-backed column functions migrate to `SiteLocale`.
- Builder routes, builder schemas, builder translations, CMS locale types, and admin chrome remain on `Locale`.

This prevents a Japanese public-column launch from falsely claiming that the full Wix builder/admin product is Japanese-localized.

### 3.2 Japanese route scope

The launch-critical Japanese routes are:

- `/ja/columns`
- the 17 canonical `/ja/columns/<slug>` routes
- `/ja` as the Japanese public landing entry; it may route to the Japanese column archive using existing page composition, but must not render a Korean/English body under a Japanese shell.

The Japanese option in header/mobile/footer must be route-aware:

- on `/columns` and `/columns/<canonical-slug>`, preserve the path and switch to `/ja/...`;
- on a public path without approved Japanese body parity, link to the safe Japanese landing (`/ja` or `/ja/columns`) rather than fabricate a same-path Japanese alternate;
- do not expose Japanese admin-builder, admin-consultation, account, checkout, booking-management, or CMS routes.

### 3.3 Middleware decision

`src/middleware.ts` is **not** modified:

- its final public matcher already covers `/ja`, `/ja/columns`, and `/ja/columns/<slug>`;
- the `ko|zh-hant|en` regexes protect admin-only routes, and this work does not authorize Japanese admin surfaces;
- adding `ja` to the admin regexes would expose untranslated builder/admin paths and expand scope.

`src/middleware.test.ts` is modified only to prove that a Japanese public path receives `x-tseng-pathname` and is not challenged by admin auth. Existing admin matcher expectations remain three-locale.

## 4. Exact implementation file whitelist

No implementation file outside this list may be created or modified. If implementation reveals a genuine additional dependency, stop and revise this plan before editing it.

### 4.1 New Japanese content — exact KO filename parity

Create:

1. `src/content/columns-ja/001-taiwan-company-establishment-basics.md`
2. `src/content/columns-ja/002-withdraw-capital-taiwan-company.md`
3. `src/content/columns-ja/003-taiwan-traffic-accident-procedure.md`
4. `src/content/columns-ja/004-taiwan-company-subsidiary-vs-branch.md`
5. `src/content/columns-ja/005-taiwan-company-establishment-advanced-2.md`
6. `src/content/columns-ja/006-taiwan-massage-history-law.md`
7. `src/content/columns-ja/007-taiwan-divorce-lawsuit-qna.md`
8. `src/content/columns-ja/008-taiwan-labor-severance-law.md`
9. `src/content/columns-ja/009-taiwan-voluntary-resignation-severance.md`
10. `src/content/columns-ja/010-taiwan-gym-injury-lawsuit.md`
11. `src/content/columns-ja/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md`
12. `src/content/columns-ja/012-taiwan-overtaking-accident-liability.md`
13. `src/content/columns-ja/013-taiwan-company-establishment-advanced-1.md`
14. `src/content/columns-ja/014-taiwan-mandatory-employment-period.md`
15. `src/content/columns-ja/015-taiwan-company-setup-pitch-location.md`
16. `src/content/columns-ja/016-taiwan-inheritance-custody-analysis.md`
17. `src/content/columns-ja/017-taiwan-logistics-business-setup.md`

### 4.2 Public locale, loader, shell, and route integration

Modify:

- `src/lib/locales.ts`
- `src/lib/path-utils.ts`
- `src/lib/columns.ts`
- `src/data/site-content.ts`
- `src/data/page-copy.ts`
- `src/data/attorney-profiles.ts`
- `src/app/layout.tsx`
- `src/app/fonts.ts`
- `src/app/globals.css`
- `src/app/[locale]/layout.tsx`
- `src/app/[locale]/[[...slug]]/page.tsx`
- `src/app/[locale]/columns/page.tsx`
- `src/app/[locale]/columns/[slug]/page.tsx`
- `src/components/Header.tsx`
- `src/components/MobileNavDrawer.tsx`
- `src/components/Footer.tsx`
- `src/components/Breadcrumbs.tsx`
- `src/components/PageHeader.tsx`
- `src/components/ColumnsGrid.tsx`
- `src/components/AttorneyAuthorityCard.tsx`
- `src/components/ScrollTopButton.tsx`
- `src/components/YearEndEventPopup.tsx`

### 4.3 SEO and sitemap

Modify:

- `src/lib/seo.ts`
- `src/app/sitemap.ts`

### 4.4 Tests

Create:

- `src/lib/__tests__/columns-ja-content.test.ts`
- `src/lib/__tests__/site-locales-ja.test.ts`
- `src/components/__tests__/ja-public-shell.test.tsx`
- `src/app/[locale]/columns/[slug]/__tests__/metadata-ja.test.ts`
- `tests/builder-editor/ja-columns-full-content.playwright.ts`

Modify:

- `src/middleware.test.ts`
- `src/app/__tests__/sitemap.test.ts`

### 4.5 Explicitly not whitelisted

- `src/middleware.ts`
- `src/content/columns/**`
- `src/content/columns-zh/**`
- `src/content/columns-en/**`
- `src/lib/consultation/columns-blob-reader.ts`
- all builder/admin files under `src/app/(builder)`, `src/components/builder`, and `src/lib/builder`
- all booking, account, store, portfolio, events, CMS, translation-provider, and publish files
- `package.json` and all lockfiles
- `SESSION.md`, the Wix checkpoint, plan, changelog, and handoff documents

## 5. Japanese frontmatter contract

Each Japanese file must parse with `gray-matter` and retain the Korean source field shape.

| Field | Japanese rule |
| --- | --- |
| `title` | Complete natural Japanese title; no visible Hangul; no sensational embellishment absent from KO. |
| `url` | Preserve the KO provenance URL byte-for-byte, including Hangul in the immutable URLs of `008` and `009`. |
| `lastmod` | Preserve the KO ISO value exactly. Do not use the translation date. |
| `date_display` | Render the same date naturally in Japanese, e.g. `2025年9月13日`. |
| `read_time` | Recalculate from the final Japanese visible body and format as `約N分`. Use one documented formula consistently. |
| `categories` | Use one controlled Japanese category value. |
| `featured_image` | Preserve the KO value exactly. |
| `faq` | Present only when KO has it; translate every question/answer with identical item count and order. |

Controlled category values:

- KO `대만 법인설립` → JA `台湾会社設立`
- KO `대만 법률정보` → JA `台湾法律情報`
- KO `소송사례 분석` → JA `訴訟事例分析`

`categoryFromString()` must recognize these values and continue mapping to the existing internal `formation | legal | case` union.

Frontmatter gates:

- filename and slug equality across KO and JA;
- exact equality for `url`, `lastmod`, and `featured_image`;
- valid Japanese `date_display`;
- `read_time` matching `^約[1-9][0-9]*分$`;
- exactly five FAQ-bearing JA files: `001`, `002`, `004`, `008`, `011`;
- no workflow fields such as model name, translator, prompt, `translation_status`, or reviewer notes in public frontmatter.

## 6. Japanese legal-translation quality contract

### 6.1 Audience and writing quality

- Primary audience: Japanese-reading Korean individuals, founders, companies, employees, and families handling Taiwan matters.
- Secondary audience: Japanese-speaking cross-border clients who need a Taiwan-law explanation.
- Write idiomatic professional Japanese, not Korean word order rendered with Japanese vocabulary.
- Preserve the source lawyer’s first-person voice where it exists.
- Prefer clear, restrained legal prose using `です・ます` consistently unless the source section is a quoted/formal rule.
- Retain Korea–Taiwan comparisons that matter to Korean clients; do not rewrite the audience as Japan-based clients.
- Avoid unexplained Japan-law analogies. A Japanese reader’s familiarity with Japanese institutions is not authority to substitute a Japanese legal concept.

### 6.2 Fidelity and non-invention

1. Translate the complete KO body. Do not summarize, compress, merge sections, omit repetition, or replace a long article with an overview.
2. Preserve heading order, paragraph order, numbered questions, lists, tables, blockquotes, separators, links, conclusion, and related-links structure.
3. Preserve every legally meaningful number exactly: statute articles/paragraphs, deadlines, dates, years, percentages, currency amounts, thresholds, counts, and procedural sequence.
4. Do not invent a statute, article, case number, court, agency, filing deadline, remedy, penalty, eligibility rule, factual example, quotation, or outcome.
5. Do not silently correct a questionable KO proposition. Flag it for Taiwan-qualified attorney review.
6. If KO and ZH conflict, KO remains the translation source and ZH is only a terminology cross-check. Record the exact conflict and block the affected article.
7. Preserve qualifications such as “in principle,” “generally,” “may,” “depending on the circumstances,” and “legal advice should be obtained.”
8. Do not add SEO filler, a generic AI introduction, a new disclaimer, or a consultation CTA not present in the source.

### 6.3 Taiwan terminology rules

- Use `台湾` consistently in Japanese prose. Do not replace Taiwan with China or conflate NTD with RMB.
- On first use, pair a reliable Japanese description with the Traditional Chinese official term when ambiguity matters:
  - `台湾会社法（公司法）`
  - `労働基準法（勞動基準法）`
  - `経済部（經濟部）`
  - `台湾食品薬物管理署（TFDA／衛生福利部食品藥物管理署）`
- Preserve a Traditional Chinese statutory or institutional term in parentheses when no stable official Japanese equivalent exists.
- Do not map Taiwan entity forms mechanically to Japanese domestic forms:
  - `有限公司` is not automatically a Japanese `合同会社`;
  - `股份有限公司` is not automatically a Japanese `株式会社`;
  - describe the Taiwan form accurately and retain the Chinese term where needed.
- Distinguish subsidiary, branch, and representative/liaison office exactly as the source does.
- Render currency as `新台湾ドル（NTD）` or `NTD` consistently; keep every amount unchanged.
- Use accurate Taiwan place and agency names, e.g. Taipei/台北, Taichung/台中, Kaohsiung/高雄, Ministry/agency names appropriate to Taiwan.
- Personal names must use an attributable Japanese/Latin/Traditional Chinese form. Do not guess Japanese readings of Korean or Chinese names.
- For article `016`, preserve the identity distinction and source facts concerning 구준엽/具俊曄 and 徐熙媛; if an authoritative Japanese rendering is unavailable, use the verified Traditional Chinese or Latin form rather than invent furigana.
- Statute titles should be checked against reliable Taiwan government or established Japanese-language Taiwan legal usage. Absence of an official Japanese translation must be disclosed to the reviewer, not hidden.

### 6.4 Hangul and Japanese-script policy

Visible Japanese content must have zero Hangul.

The only allowed Hangul locations are:

1. the immutable KO `url` frontmatter values copied exactly from KO, notably `008` and `009`;
2. a Markdown link destination copied exactly from the KO source when changing it would break provenance.

Hangul is not allowed in:

- title, headings, paragraphs, list/table/blockquote text;
- categories, dates, read-time labels;
- FAQ questions or answers;
- image alt text;
- link labels;
- author labels or UI strings.

Every Japanese file must contain hiragana or katakana in its visible title/body (`[\u3041-\u309F\u30A0-\u30FF]`). A file containing only kanji, Latin text, or copied Traditional Chinese fails.

### 6.5 Links and media

- Preserve the lead H1 and lead featured image in Markdown; current loader behavior removes duplicate display elements at runtime.
- Preserve inline image references and translate alt text.
- Change `/ko/`, `/zh-hant/`, or `/en/` internal links to `/ja/` only when that Japanese route is part of the approved launch surface.
- If no Japanese equivalent route exists, keep the source destination only when necessary and label the link language explicitly; do not create a false Japanese URL.
- Preserve external URLs unless visibly malformed. Report malformed links instead of silently replacing them.

## 7. Loader implementation

Confined to `src/lib/columns.ts` and the public locale type from `src/lib/locales.ts`:

1. Add `COLUMNS_JA_DIR = path.join(process.cwd(), 'src/content/columns-ja')`.
2. Make `getColumnsDir(locale: SiteLocale)` an explicit exhaustive mapping:
   - `ko` → `src/content/columns`
   - `zh-hant` → `src/content/columns-zh`
   - `en` → `src/content/columns-en`
   - `ja` → `src/content/columns-ja`
3. Do not use `existsSync()` to fall back to KO. A missing supported directory is a test/build failure.
4. Extend `categoryFromString()` and `categoryLabelFn()` for the controlled Japanese values and Japanese labels.
5. `getAllColumnPosts('ja')`, `getColumnPost(slug, 'ja')`, and `getFeaturedColumns(count, 'ja')` read Japanese files directly.
6. Keep KO/ZH/EN behavior unchanged. Do not re-edit the English translations or resurrect/remove EN code in this work order.
7. Export a canonical file-backed predicate, e.g. `isFullJapaneseColumnTranslationSlug(slug)`, derived from `columns-ja` filenames.
8. Keep KO as the canonical slug list. JA parity tests prove coverage.
9. Keep builder/Blob precedence unchanged for existing locales.
10. Japanese public pages use file-backed JA posts only in this work order. They must not call the three-locale builder/Blob reader with an unsafe cast.

## 8. Public Japanese shell and navigation

### 8.1 `site-content.ts`

Add `buildJapaneseSiteContent(baseSiteContent.ko): SiteContent` and register `ja`.

The function must provide natural Japanese for:

- metadata;
- primary navigation, mega-menu labels, search/language labels, and CTA;
- column/insight labels used on the Japanese launch surface;
- footer labels and legal line;
- search labels;
- any home/landing copy actually rendered at `/ja`.

Do not mechanically reuse English strings for Japanese. Do not translate factual claims beyond the KO source.
The JA shell must expose only the approved Japanese landing/column routes plus verified external contact/channel destinations. It must not create `/ja/services`, `/ja/contact`, `/ja/account`, or similar same-path links unless that page is separately approved and localized.

### 8.2 Header, mobile drawer, and footer

- Add `JA` / `日本語` entries to desktop, mobile, and footer language controls.
- Generate all locale URLs through the route-aware locale path helper rather than hard-coded `koPath`, `zhPath`, `enPath` objects.
- Preserve query string where the current implementation does so; preserve the column slug.
- Set `aria-current="page"` correctly for JA.
- Add Japanese accessibility labels for menu, search, home, primary/utility navigation, close, account-independent shell controls, and back-to-top.
- Add Japanese brand rendering: `昊鼎国際法律事務所` unless the firm approves another official Japanese display name.
- Hide member/account controls and the AI quick-contact widget on JA until those application flows have a separate Japanese localization work order; do not call three-locale member/chat APIs with `ja`.
- Do not redesign the navigation or change its CSS geometry.

### 8.3 Root language and fonts

- `src/app/layout.tsx` recognizes `/ja` and renders `<html lang="ja">`.
- `src/app/fonts.ts` adds locale-gated Noto Sans JP / Noto Serif JP or the existing project-approved Japanese font pair.
- `src/app/globals.css` binds Japanese font variables under `html[lang='ja']` without changing spacing, colors, typography scale, or component layout.
- This is script coverage, not a redesign.

### 8.4 Japanese landing behavior

`src/app/[locale]/[[...slug]]/page.tsx` must special-case the public `SiteLocale` safely:

- never pass `ja` into builder-only functions typed as `Locale`;
- do not normalize `ja` back to KO;
- `/ja` must resolve to an approved Japanese landing composition or a route-level handoff to `/ja/columns` that ends on a Japanese HTTP-200 page;
- no Japanese hreflang is emitted for an unsupported same-path page.

## 9. Japanese column UI strings

### Listing page and grid

Add Japanese values for:

- archive label/title/description;
- categories: all, company formation, legal information, case analysis;
- search label, placeholder, submit, clear, result count;
- reviewed-by line;
- open-column link hint;
- empty state;
- load-more button and remaining count;
- breadcrumb and page-header accessibility labels.

In `src/app/[locale]/columns/page.tsx`, branch before builder/Blob calls: existing KO/ZH/EN behavior remains unchanged, while JA reads only `getAllColumnPosts('ja')` and does not unsafe-cast `ja` to `Locale`.

Recommended stable terminology:

- `コラム`
- `すべて`
- `台湾会社設立`
- `台湾法律情報`
- `訴訟事例`
- `コラムを検索`
- `曾俊瑋弁護士監修`

### Detail page

Add Japanese values for:

- back to columns;
- reviewing attorney;
- related topics;
- consultation heading/text/button;
- FAQ heading;
- previous/next column;
- breadcrumb home/columns labels;
- author name and category/read-time display.

FAQ rendering remains content-driven: show FAQ HTML and `FAQPage` JSON-LD whenever valid translated FAQ exists.

For the authority card:

- add Japanese UI labels and an attributable Japanese attorney profile entry;
- do not invent credentials, education, practice areas, or name readings;
- external profile links remain unchanged.

In `src/app/[locale]/columns/[slug]/page.tsx`, JA must use the file-backed loader and default template visibility without calling three-locale builder dynamic-template or Blob readers. KO/ZH/EN keep their existing runtime behavior.

## 10. Sitemap, canonical, and hreflang policy

### Policy

Only the complete file-backed Japanese column set becomes indexable.

For each canonical slug:

- canonical is the current locale URL;
- alternates are `ko`, `zh-Hant`, `en`, `ja`, and `x-default`;
- `x-default` remains Korean;
- sitemap contains one entry per locale: 17 × 4 = 68 canonical detail entries;
- each locale entry uses that locale file’s `lastmod`;
- Japanese robots policy is index/follow only after 17/17 content gates are green.

For `/columns`:

- include all four locale listing URLs and reciprocal alternates.

For unrelated routes:

- do not add JA hreflang merely because `siteLocales` contains `ja`;
- Japanese same-path alternates are allowed only where an approved Japanese page exists;
- non-file-backed Japanese builder/Blob column drafts stay excluded/noindex.

### Implementation details

In `src/lib/seo.ts`:

- accept `SiteLocale` on public SEO helpers;
- map `ja` to language tag `ja`, Open Graph locale `ja_JP`, Japanese organization name/address, and Japanese `inLanguage`;
- allow callers to pass an explicit alternate-locale set.

In `src/app/sitemap.ts`:

- parse `ja` as a public localized route;
- generate columns from each locale’s own file list;
- add JA only to approved paths;
- use the JA file-backed slug predicate for indexability;
- preserve existing English-only noindex rules and builder sitemap failure handling;
- keep deduplication unchanged.

## 11. Parallel translation execution

### 11.1 Lane safety

Translation workers do not write into the shared repository. Each receives read-only KO source plus matching ZH terminology reference and writes only to:

```text
/tmp/tseng-law-ja-columns-2026-07-24/
  worker-a/
  worker-b/
  worker-c/
  worker-d/
  worker-e/
```

The coordinator copies only reviewed outputs into `src/content/columns-ja/`. One integrator owns all shared TypeScript and test files. No worker stages or commits.

### 11.2 Five-worker shard — same balancing as the EN plan

| Worker | Assigned posts | Approx. KO source characters | Special review focus |
| --- | --- | ---: | --- |
| A | `007`, `009`, `015` | 27.5k | divorce/family Q&A, severance exception, business premises |
| B | `003`, `005`, `012` | 27.1k | traffic procedure/deadlines, company setup, accident liability |
| C | `010`, `008`, `014` | 23.6k | litigation narrative, labor severance/statutes, mandatory employment period |
| D | `016`, `001`, `004` | 24.0k | personal names/inheritance/custody, formation FAQ, subsidiary vs branch/tax |
| E | `011`, `017`, `013`, `006`, `002` | 27.2k | cosmetics/PIF, logistics licensing, formation, massage law/history, liquidation |

Each worker returns:

- its Japanese Markdown files;
- a KO→JA structure checklist per file;
- a list of every number, statute/article, time limit, percentage, currency amount, agency, legal form, and place name checked;
- all KO/ZH conflicts or suspected source issues;
- normalized KO/JA character counts and calculated `read_time`;
- a list of Hangul-containing source URLs intentionally preserved;
- confirmation that no facts, citations, sections, or CTAs were added.

### 11.3 Independent review

1. A native-level Japanese legal editor reviews naturalness, register, Korean calques, name handling, and consistency.
2. A separate Taiwan-law fidelity reviewer checks every number/citation, Taiwan term, legal-form distinction, and the five FAQ arrays against KO.
3. ZH is used only to validate Taiwan official terms, not as an alternative source article.
4. Any unresolved legal issue blocks that file.
5. The shared-code integrator begins only after all 17 content files pass both reviews.
6. SEO/indexability changes are integrated last and atomically.

## 12. Implementation order and exit gates

| Order | Work | Exit gate |
| --- | --- | --- |
| 0 | Record HEAD, `git status`, current KO/ZH/EN parity, and active-lane overlaps | Isolated workspace selected; whitelist frozen |
| 1 | Add failing locale/content/SEO tests | Tests fail for missing JA for the expected reasons only |
| 2 | Prepare terminology sheet and legal-number checklist outside repo | Japanese editor and Taiwan-law reviewer accept the rules |
| 3 | Run five scratch-directory translation shards | 17 exact outputs exist |
| 4 | Cross-review all translations and FAQs | No omissions, inventions, or unresolved conflicts |
| 5 | Integrate 17 JA files | Static integrity gates pass |
| 6 | Add `SiteLocale`, JA loader, and file-backed predicate | `getAllColumnPosts('ja')` returns 17; KO/ZH/EN unchanged |
| 7 | Add Japanese shell, path switching, fonts, and column UI copy | Shell/component tests pass; no English/Korean UI leakage on JA columns |
| 8 | Add metadata/sitemap/hreflang | 68 canonical detail entries with reciprocal alternates |
| 9 | Typecheck, lint, isolated build, all-route browser smoke | All commands and 18 JA column routes pass |
| 10 | Produce evidence report only | Exact whitelist; no commit/push/deploy/Blob mutation |

Do not activate JA sitemap/hreflang with 16/17 translations. The launch is atomic.

## 13. Automated verification gates

### 13.1 `columns-ja-content.test.ts`

The test must:

1. Assert KO and JA each contain exactly 17 `.md` files.
2. Assert sorted basenames and loaded slug sets are identical.
3. Assert `getAllColumnPosts('ja')` returns 17 posts.
4. Assert every JA file contains hiragana or katakana in visible title/body.
5. Assert visible title/body/category/date/read-time/FAQ/alt/link labels contain zero Hangul.
6. Permit Hangul only in exact KO-preserved `url` frontmatter and exact preserved Markdown href destinations.
7. Assert no whole article/body equals KO, ZH, or EN content after normalization.
8. Assert required frontmatter and exact `url`/`lastmod`/`featured_image` parity.
9. Assert five-file FAQ presence, count, and order parity.
10. Require normalized visible JA body length to be at least `max(1,200 characters, 75% of normalized KO characters)`.
11. Compare per-file structure signatures: headings, ordered sections/Q&A, list items, table rows, blockquotes, and links.
12. Assert Japanese internal links do not claim unsupported `/ja/` destinations.
13. Assert `date_display` and `read_time` match the Japanese format.
14. Assert the JA file-backed predicate is true for all 17 canonical slugs and false for an unknown slug.

The 75% floor detects truncation; it does not prove legal or language quality.

### 13.2 Locale and public-shell tests

`site-locales-ja.test.ts`:

- `isSiteLocale('ja')` is true;
- builder/core `isLocale('ja')` remains false;
- `normalizeSiteLocale('ja')` returns `ja`;
- the public locale list has four unique values;
- the builder locale list remains three;
- locale path switching preserves canonical column slugs and does not create unsupported Japanese same-path links.

`ja-public-shell.test.tsx`:

- desktop/mobile/footer each expose one Japanese locale link;
- Japanese navigation and accessibility labels contain kana and no Hangul;
- Japanese active state is correct;
- Japanese column shell has no English fallback labels;
- Japanese font/document language plumbing is selected.

`src/middleware.test.ts`:

- `/ja/columns` and a JA detail path pass public middleware without auth challenge;
- `x-tseng-pathname` preserves the JA path;
- authenticated admin matcher expectations remain `ko|zh-hant|en`.

### 13.3 Metadata test

`metadata-ja.test.ts` must:

- call `generateMetadata()` for a canonical JA slug;
- assert JA canonical URL;
- assert robots index/follow;
- assert `ko`, `zh-Hant`, `en`, `ja`, and `x-default` alternates;
- assert title/description contain kana and no Hangul;
- prove an unknown/non-file-backed JA slug is not advertised as a completed translation;
- verify an FAQ-bearing JA post exposes translated FAQ through the file loader.

### 13.4 Sitemap test

Modify `src/app/__tests__/sitemap.test.ts` to:

- assert all 17 JA detail URLs are present;
- assert KO/ZH/EN/JA detail slug sets are identical;
- assert exactly 68 canonical file-backed detail entries;
- assert reciprocal five-key alternates (`ko`, `zh-Hant`, `en`, `ja`, `x-default`) on every canonical detail;
- assert locale-specific `lastModified`;
- assert `/ja/columns` is present;
- assert no false JA alternate on unsupported static/builder paths;
- retain existing English noindex tests;
- replace brittle total counts with explicit category/locale counts where practical.

## 14. Browser and route verification

Create `tests/builder-editor/ja-columns-full-content.playwright.ts`.

### All-route smoke

For `/ja/columns` and all 17 canonical details:

- final response status is 200;
- `<html lang="ja">`;
- Japanese header/mobile/footer locale controls exist;
- one Japanese H1 is visible;
- visible title/body includes kana;
- visible body, UI labels, and FAQ contain zero Hangul;
- article body exceeds the per-file integrity floor;
- no KO/ZH/EN body fallback or old English stub fingerprint;
- canonical and hreflang are correct;
- same-origin requests do not fail;
- page errors and serious console errors are zero.

### Representative deep checks

Check desktop and 390px mobile:

1. `001` — company formation terminology and FAQ.
2. `003` — traffic procedure, deadlines, and long Q&A structure.
3. `007` — longest divorce/family article and qualification language.
4. `010` — litigation narrative and TWD 1.57M facts.
5. `011` — PIF/TFDA terminology, lists, links, and FAQ.
6. `016` — personal-name handling, inheritance, and parental-rights terminology.

For `001` and `011`, verify visible Japanese FAQ and Japanese `FAQPage` JSON-LD. For `003`, verify that no FAQ was invented. Check previous/next navigation, Japanese date/read time/category, related links, no horizontal overflow, and no clipped kana at both widths.

## 15. Verification commands

Run in an isolated implementation workspace containing only whitelisted changes:

```bash
git diff --name-only
# expected: exact whitelist only, plus this plan if present in the isolated snapshot

find src/content/columns-ja -maxdepth 1 -type f -name '*.md' | wc -l
# expected: 17

npx vitest run \
  src/lib/__tests__/columns-ja-content.test.ts \
  src/lib/__tests__/site-locales-ja.test.ts \
  src/components/__tests__/ja-public-shell.test.tsx \
  'src/app/[locale]/columns/[slug]/__tests__/metadata-ja.test.ts' \
  src/middleware.test.ts \
  src/app/__tests__/sitemap.test.ts \
  src/lib/__tests__/columns-en-content.test.ts \
  src/lib/__tests__/columns-faq.test.ts
# expected: all pass

npm run typecheck
# expected: exit 0 without widening builder/admin locale failures

npm run lint
# expected: exit 0, no new warnings in whitelist

NEXT_DIST_DIR=.next-ja-columns npm run build
# expected: clean isolated build exit 0

npx playwright test \
  --config=playwright.config.ts \
  tests/builder-editor/ja-columns-full-content.playwright.ts \
  --project=chromium-builder \
  --workers=1
# expected: listing + 17 detail smokes and representative deep checks pass

git diff --check
# expected: exit 0

git status --short
# expected: no staged changes; no commit; no unrelated files adopted
```

Additional static checks:

```bash
rg -L '[ぁ-んァ-ヶー]' src/content/columns-ja/*.md
# expected: no filenames printed

rg -n '[가-힣]' src/content/columns-ja
# expected: hits only inside exact preserved URL/href destinations documented by the test

rg -n 'Date pending|Key Focus Areas|## Overview|/ko/|/zh-hant/' src/content/columns-ja
# expected: no visible-content/stub hits; preserved hrefs require exact reviewed exceptions
```

## 16. Manual legal and language review

Before any release request:

1. Compare every JA file side-by-side with KO.
2. Keep ZH open only for official Taiwan terminology.
3. Check every numeral, article/paragraph reference, date, period, percentage, NTD amount, tax rate, and party count.
4. Check company-form distinctions and agency names.
5. Check all personal names, place names, and source-specific facts.
6. Check that uncertainty and qualifications did not become categorical advice.
7. Check FAQ item count/order and ensure answers introduce no new facts.
8. Check that each source conclusion, CTA, and related link appears once.
9. Check Japanese naturalness, particles, register, punctuation, full-/half-width symbols, and consistent terms across all 17.
10. Require a Taiwan-qualified attorney or designated legal-content owner to approve legal accuracy.

Reviewer notes stay outside public Markdown.

## 17. Out of scope and failure handling

### Out of scope

- design, layout, component, color, spacing, typography-scale, or information-architecture redesign;
- Blob write/delete, builder publish, CMS publish, or changing file/Blob precedence;
- re-editing or stylistically rewriting the newly added English articles;
- rewriting KO or ZH source articles;
- Japanese builder/admin chrome, Japanese CMS authoring, Japanese account/store/booking application flows;
- new laws, citations, case numbers, legal conclusions, examples, guarantees, or marketing claims;
- commit, push, deploy, production mutation, or production credential use.

### Failure handling

- Missing file, basename mismatch, structure omission, unsupported legal change, invented fact/citation, kana absence, disallowed Hangul, or length-floor failure: reject the file to its worker.
- KO/ZH conflict: block that article and request legal review; do not guess.
- One incomplete article: do not enable JA sitemap/indexability for any of the 17.
- KO/ZH/EN loader regression: reject the loader diff; do not weaken existing tests.
- Builder locale/type regression: confirm `SiteLocale` separation; do not mass-edit builder files.
- Unsupported Japanese same-path link: route it to the approved Japanese landing or remove it from the JA switcher; do not publish a false hreflang.
- Dirty shared worktree contamination: stop and move to an isolated workspace; never use broad reset/clean commands.
- Blob collision is not resolved here. Record it as a release blocker without writing or deleting Blob content.

## 18. Ten-line executive summary

1. Air was reachable but contained no Japanese column corpus, so all 17 JA articles must be translated net-new from KO.
2. Create `src/content/columns-ja` with exact KO filename/slug parity and complete Japanese bodies plus the five matching FAQ arrays.
3. Preserve all legal substance, numbers, Taiwan terms, structure, URLs, images, and qualifications; invent nothing.
4. Use natural professional Japanese for Japanese-reading Korean clients, while avoiding Japanese-law substitutions for Taiwan concepts.
5. Add a four-value public `SiteLocale` including `ja` while keeping the builder/admin `Locale` contract at KO/ZH-Hant/EN.
6. Wire the JA directory directly in `getColumnsDir`; missing JA content must fail rather than fall back to another language.
7. Add Japanese shell, language switching, fonts, listing/detail strings, attorney card, canonical, sitemap, and reciprocal hreflang.
8. Reuse the EN plan’s five balanced worker shards, then require independent Japanese-language and Taiwan-law reviews.
9. Gate on 17 files, kana in every article, Hangul=0 outside exact preserved URLs, a 75% KO length floor, loader success, and 18 JA route smokes.
10. Design redesign, Blob/CMS publish, EN re-editing, commit, push, and deploy are explicitly prohibited.

## 19. Implementer file list

New Japanese content:

- `src/content/columns-ja/001-taiwan-company-establishment-basics.md`
- `src/content/columns-ja/002-withdraw-capital-taiwan-company.md`
- `src/content/columns-ja/003-taiwan-traffic-accident-procedure.md`
- `src/content/columns-ja/004-taiwan-company-subsidiary-vs-branch.md`
- `src/content/columns-ja/005-taiwan-company-establishment-advanced-2.md`
- `src/content/columns-ja/006-taiwan-massage-history-law.md`
- `src/content/columns-ja/007-taiwan-divorce-lawsuit-qna.md`
- `src/content/columns-ja/008-taiwan-labor-severance-law.md`
- `src/content/columns-ja/009-taiwan-voluntary-resignation-severance.md`
- `src/content/columns-ja/010-taiwan-gym-injury-lawsuit.md`
- `src/content/columns-ja/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md`
- `src/content/columns-ja/012-taiwan-overtaking-accident-liability.md`
- `src/content/columns-ja/013-taiwan-company-establishment-advanced-1.md`
- `src/content/columns-ja/014-taiwan-mandatory-employment-period.md`
- `src/content/columns-ja/015-taiwan-company-setup-pitch-location.md`
- `src/content/columns-ja/016-taiwan-inheritance-custody-analysis.md`
- `src/content/columns-ja/017-taiwan-logistics-business-setup.md`

Modified public locale/content/route files:

- `src/lib/locales.ts`
- `src/lib/path-utils.ts`
- `src/lib/columns.ts`
- `src/data/site-content.ts`
- `src/data/page-copy.ts`
- `src/data/attorney-profiles.ts`
- `src/app/layout.tsx`
- `src/app/fonts.ts`
- `src/app/globals.css`
- `src/app/[locale]/layout.tsx`
- `src/app/[locale]/[[...slug]]/page.tsx`
- `src/app/[locale]/columns/page.tsx`
- `src/app/[locale]/columns/[slug]/page.tsx`
- `src/components/Header.tsx`
- `src/components/MobileNavDrawer.tsx`
- `src/components/Footer.tsx`
- `src/components/Breadcrumbs.tsx`
- `src/components/PageHeader.tsx`
- `src/components/ColumnsGrid.tsx`
- `src/components/AttorneyAuthorityCard.tsx`
- `src/components/ScrollTopButton.tsx`
- `src/components/YearEndEventPopup.tsx`

Modified SEO files:

- `src/lib/seo.ts`
- `src/app/sitemap.ts`

New tests:

- `src/lib/__tests__/columns-ja-content.test.ts`
- `src/lib/__tests__/site-locales-ja.test.ts`
- `src/components/__tests__/ja-public-shell.test.tsx`
- `src/app/[locale]/columns/[slug]/__tests__/metadata-ja.test.ts`
- `tests/builder-editor/ja-columns-full-content.playwright.ts`

Modified tests:

- `src/middleware.test.ts`
- `src/app/__tests__/sitemap.test.ts`
