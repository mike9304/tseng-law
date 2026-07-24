# WO-JA-FULL-COLUMNS — Codex R2 Review

> Review date: 2026-07-24 KST  
> Plan: `docs/audit/WO-JA-FULL-COLUMNS-PLAN-2026-07-24.md`  
> Prior review: `docs/audit/WO-JA-FULL-COLUMNS-CODEX-REVIEW-2026-07-24.md`  
> Reviewed repository: `/Users/son7/Projects/tseng-law`  
> Reviewed branch / HEAD: `main` / `ad77d5fca9521ee06c471b0378763dea7ce73ae4`  
> Verdict: **REQUEST_CHANGES**

## Executive verdict

The requested TypeScript and focused Vitest gates are now green. The R1 fixes also correctly establish first-class Japanese page metadata, prevent Korean builder-page projection on `/ja/columns`, emit `<html lang="ja">`, retarget the reviewed guide/contact links to English shells, update the sitemap count, and align article 008's display date.

JA columns are still not launch-ready. The metadata fix stops at `buildSeoMetadata()`: the same Japanese listing/detail pages continue to emit English `WebSite`, `LegalService`, `CollectionPage`, `Article`, and `FAQPage` structured data. The unsupported-route blocker is also only partially closed: `/ja` still normalizes to Korean in the catch-all, while the header continues to expose `/ja/login`, `/ja/account`, and `/ja/account/premium` and calls the three-locale member API with `locale=ja`. In addition, the column detail converts `ja` to `en` before rendering `AttorneyAuthorityCard`, so the newly added Japanese card labels are not actually used.

These are runtime correctness issues on the launch shell, not test-only nits. The passing sitemap test currently protects only the aggregate count, not the required JA URL/hreflang contract.

## Blocking findings

### 1. P1 — Japanese pages still emit English structured data

`buildSeoMetadata()` now accepts `SiteLocale`, and the detail route correctly passes the real `ja` locale at `src/app/[locale]/columns/[slug]/page.tsx:81-100`. This fixes the canonical URL, `content-language`, Open Graph locale/site name, and hreflang set described in R1.

The JSON-LD path still converts Japanese to the builder locale:

- `src/app/[locale]/layout.tsx:45-50` calls `buildWebsiteJsonLd()` and `buildLegalServiceJsonLd()` with `widgetLocale`, which is `en` for JA;
- `src/app/[locale]/columns/page.tsx:153-169` calls the listing breadcrumb/collection builders with `toBuilderLocale(locale)`;
- `src/app/[locale]/columns/[slug]/page.tsx:158` emits JA FAQ data as `inLanguage: en`;
- `src/app/[locale]/columns/[slug]/page.tsx:173-198` calls the breadcrumb/article builders with `toBuilderLocale(locale)`.

The helper contracts remain builder-only at `src/lib/seo.ts:31-44`, `:61-71`, `:247`, `:260`, `:291`, and `:518`. The deterministic result on a JA detail is contradictory SEO:

- page metadata says canonical `/ja/columns/<slug>`, `content-language: ja`, and Open Graph `ja_JP`;
- root `WebSite`/`LegalService` JSON-LD identifies the English site and English URLs;
- `Article`, `FAQPage`, and listing `CollectionPage` JSON-LD say `inLanguage: en`;
- the article publisher is `Hovering International Law Firm`, despite the new Japanese organization name being available.

Widen the public structured-data helpers that genuinely support JA to `SiteLocale` and pass the real locale. Builder/admin-only helpers should remain on `Locale`.

### 2. P1 — `/ja` and member/account links still enter unsupported Japanese routes

Changing the JA header logo to `/ja/columns` prevents that one click from reaching the unsafe landing, but it does not fix the route itself.

`src/app/[locale]/[[...slug]]/page.tsx:42` and `:61` still call `normalizeLocale(params.locale)`. Therefore `/ja` and any unsupported `/ja/*` catch-all route normalize to KO and can render Korean builder/legacy content under the Japanese document shell.

The header continues to expose those routes:

- `src/components/Header.tsx:291` builds `/ja/login?next=...`;
- `src/components/Header.tsx:390` calls `/api/members/me?locale=ja`;
- `src/components/Header.tsx:453-458` builds `/ja/account` and `/ja/account/premium`;
- the same JA login URL is passed into `MobileNavDrawer` at `src/components/Header.tsx:632-640`.

This remains the R1 failure mode: unsupported application content is advertised under Japanese URLs. The approved columns-only shell should redirect `/ja` to `/ja/columns` and hide member/account controls and member API calls on JA, or explicitly use a supported EN application shell for every such action.

### 3. P1 — Japanese attorney-card copy is added but erased at the caller

`src/components/AttorneyAuthorityCard.tsx:32-39` contains Japanese labels, and `:49-50` correctly maps only the profile-data lookup through `toBuilderLocale()`.

However, the JA column detail passes `toBuilderLocale(locale)` into the component at `src/app/[locale]/columns/[slug]/page.tsx:253`. For JA this is `en`, so `cardLabels[locale]` resolves to English and the Japanese labels are unreachable on the launch surface. Only the separately supplied heading remains Japanese.

Pass the real `SiteLocale` to the card and map only the profile-data and unsupported destination paths inside the component. Do not create `/ja/contact` while doing so.

### 4. P1 — The sitemap gate is green but does not verify the JA contract

`src/app/__tests__/sitemap.test.ts:103-109` correctly updates the brittle aggregate expectation from `129 → 120` to `147 → 138`, accounting for the 18 JA archive/detail entries. It does not assert any Japanese URL or alternate directly.

The R1/plan-required checks are still absent:

- `/ja/columns` exists;
- all 17 JA detail URLs exist;
- KO/ZH/EN/JA canonical detail slug sets are identical;
- every canonical detail has exactly `ko`, `zh-Hant`, `en`, `ja`, and `x-default`;
- JA `lastModified` comes from JA frontmatter;
- unsupported static/builder paths do not receive a false JA alternate.

The implementation also builds JA entries from `getAllColumnPosts('ko')` at `src/app/sitemap.ts:136` and `:183-191`, rather than the file-backed JA corpus. Current 17/17 parity masks that contract error. Source the JA entries from `getAllColumnPosts('ja')` (or the canonical JA file-backed predicate) and replace the aggregate-only assertion with the explicit launch invariants.

## Verified R1 fixes

| R1 area | R2 result | Evidence |
| --- | --- | --- |
| TypeScript locale boundary | **PASS** | `npm run typecheck` exits 0 |
| JA metadata locale/canonical/OG/hreflang | **PASS** | `buildSeoMetadata({ locale, alternateLocales: ['ko', 'zh-hant', 'en', 'ja'] })` uses real `ja` |
| JA listing builder projection | **PASS** | metadata and page resolution both skip builder published-page lookup when `locale === 'ja'` |
| Guide/contact destinations | **PASS** | JA detail uses `linkLocale = 'en'` |
| Root document language | **PASS** | `DocumentLanguage` contains `ja`; request resolution emits `<html lang="ja">` |
| JA listing/grid/breadcrumb copy | **PASS** | Japanese copy is present and the breadcrumb home target is `/ja/columns` |
| Header overlay/drawer locale boundary | **PASS** | `SearchOverlay` and `MobileNavDrawer` receive `toBuilderLocale(locale)` |
| JA logo target | **PASS** | desktop JA logo points to `/ja/columns` |
| Sitemap aggregate expectation | **PASS** | focused sitemap test now passes at `147 → 138`, nine removals |
| Article 008 display date | **PASS** | `date_display: "2025年9月18日"` matches `lastmod: "2025-09-18"` |

## Requested verification

### TypeScript

Command:

```bash
npm run typecheck
```

Result: **PASS**, exit code 0.

### JA columns and sitemap Vitest

Command:

```bash
npx vitest run \
  src/lib/__tests__/columns-ja-content.test.ts \
  src/app/__tests__/sitemap.test.ts
```

Result:

- `columns-ja-content.test.ts`: **PASS**, 5/5;
- `sitemap.test.ts`: **PASS**, 2/2;
- aggregate: **7/7 passed**, 2/2 test files, exit code 0.

## Non-blocking cleanup

- `src/app/[locale]/layout.tsx:52` still passes `locale as never` even though `Header` now accepts `SiteLocale`. The cast is unnecessary and bypasses the locale contract R1 asked to make explicit.
- `src/app/[locale]/columns/[slug]/page.tsx:151-154` retains a stale comment claiming translated EN FAQ data is skipped, while the code now renders FAQ for every locale with data.
- `src/lib/seo.ts:3` imports `siteLocales` but does not use it.
- `src/app/fonts.ts:55-60` recognizes `ja` at the type level but maps it to the KR font pair. This is weaker than the plan's dedicated JP font gate and should be browser-checked for kana/kanji glyph fallback before release.

## Remaining release evidence

No 18-route browser smoke, isolated production build, Japanese legal-language review, or Taiwan-law fidelity approval was performed in this R2 review. Those remain required before a release request even after the code blockers above are fixed.

No product source, translation, or test file was edited by this review. No commit, push, deploy, Blob/CMS write, or production mutation was performed.
