# WO-JA-FULL-COLUMNS — Codex Final Review

> Review date: 2026-07-24 KST  
> Evidence: `docs/audit/WO-JA-AIR-SEARCH-EVIDENCE-2026-07-24.md`  
> Plan: `docs/audit/WO-JA-FULL-COLUMNS-PLAN-2026-07-24.md`  
> Reviewed repository: `/Users/son7/Projects/tseng-law`  
> Reviewed branch / HEAD: `main` / `ad77d5fca9521ee06c471b0378763dea7ce73ae4`  
> Verdict: **REQUEST_CHANGES**

## Executive verdict

The Japanese translation corpus itself clears the requested static checks: all 17 canonical files exist with exact KO filename parity, every file contains kana, visible-content Hangul is zero, the only Hangul occurrences are the preserved `url` values in 008 and 009, and article 016 contains no `Harlem Yu` misidentification. The targeted JA and EN content Vitest files also pass.

The public implementation is not deploy-ready. Typecheck fails with 14 JA locale-boundary errors, the JA detail metadata deliberately converts `ja` to `en`, the JA listing can project a published Korean builder page instead of using `columns-ja`, and several visible links enter unsupported `/ja/...` routes that the catch-all normalizes to Korean. The root document also emits `lang="ko"` for JA requests. A sitemap regression test remains red.

The known partial MobileNavDrawer/Footer/fonts/Playwright scope is not, by itself, the reason for rejection. The blockers below are active correctness failures on the approved `/ja/columns` listing/detail surface or mandatory build/test gates.

## Blocking findings

### 1. P1 — Typecheck fails with 14 JA locale-boundary errors

`npm run typecheck` exits nonzero with 14 errors:

- four in `src/app/[locale]/columns/[slug]/page.tsx`;
- seven in `src/app/[locale]/columns/page.tsx`;
- one in `src/app/sitemap.ts`;
- two in `src/components/Header.tsx`.

The implementation widens route values to `SiteLocale`, but still passes possible `ja` values into builder-only `Locale` APIs and components. Examples include published-page resolution, SEO/JSON-LD builders, `PageHeader`, `ColumnsGrid`, `AttorneyAuthorityCard`, `SearchOverlay`, and `MobileNavDrawer`.

This is a hard deploy blocker. The boundary should be resolved explicitly: public SEO/column render helpers that genuinely support JA should accept `SiteLocale`; builder-only resolution should be bypassed or receive an intentional builder locale without unsafe casts. `as never` at `src/app/[locale]/columns/[slug]/page.tsx:100` and `src/app/[locale]/layout.tsx:52` must not be used to conceal an unresolved locale contract.

### 2. P1 — JA detail canonical, content language, Open Graph locale, and hreflang are emitted as English/incomplete

`src/app/[locale]/columns/[slug]/page.tsx:81-100` calls:

```ts
buildSeoMetadata({
  locale: toBuilderLocale(locale),
  // ...
  alternateLocales: ['ko', 'zh-hant', 'en'] as never,
});
```

`toBuilderLocale('ja')` returns `en` at `src/lib/locales.ts:27-29`. `buildSeoMetadata()` derives canonical URL, `content-language`, Open Graph URL/site name/locale, and alternates from that value.

Therefore a Japanese detail is described as `/en/columns/<slug>`, `en`, and `en_US`, while its language set omits `ja`. This directly contradicts the sitemap's JA URL and the intended reciprocal KO/ZH-Hant/EN/JA/x-default set.

The SEO input types and JA organization/Open Graph values need first-class `SiteLocale` support. The detail route must pass the real `ja` locale and include `ja` in its alternate set.

### 3. P1 — `/ja/columns` can render a projected Korean builder page

`src/app/[locale]/columns/page.tsx:63-66` and `:86-119` call builder published-page metadata/resolution before reaching the file-backed JA branch.

The builder projection rules at `src/lib/builder/site/persistence.ts:1265-1279` project default-locale KO pages to a non-default locale when no locale-equivalent page exists. `resolvePublishedSitePage()` blocks this projection only for English at `src/lib/builder/site/public-page.tsx:186-189`; it has no JA guard.

On a site with a published KO `columns` page, `/ja/columns` can therefore return the projected KO builder page and KO metadata instead of the 17 `columns-ja` posts.

The JA listing must skip builder-published page resolution and metadata, just as the detail implementation already skips the Blob reader for JA, unless a real JA builder document is introduced later.

### 4. P1 — The JA column surface advertises unsupported `/ja/...` routes that render Korean content

The shared catch-all still runs `normalizeLocale(params.locale)` at `src/app/[locale]/[[...slug]]/page.tsx:42` and `:61`. Since builder `Locale` intentionally excludes `ja`, any unsupported `/ja/...` path becomes KO internally.

The JA column UI nevertheless creates these paths:

- header logo: `/ja` at `src/components/Header.tsx:490`;
- consultation button: `/ja/contact` at `src/app/[locale]/columns/[slug]/page.tsx:246`;
- related-topic links: `/ja/taiwan-lawyer`, `/ja/taiwan-company-setup-lawyer`, and `/ja/taiwan-litigation-lawyer` at `src/app/[locale]/columns/[slug]/page.tsx:130-144`;
- member/account links also interpolate `ja` in `src/components/Header.tsx`.

This serves or attempts to serve Korean/builder content under a Japanese URL, and several related labels fall back to English. For the declared columns-focused launch, these links must point to approved EN/KO destinations with explicit language labeling, or to the safe JA archive. `/ja` itself should safely redirect/render `/ja/columns`, not normalize to KO.

### 5. P1 — JA requests emit `<html lang="ko">`

`src/app/layout.tsx:13-17` recognizes only `zh-hant` and `en`; every other request returns `ko`. Consequently `/ja/columns` and all JA details emit `lang="ko"`.

This is not only a Japanese font omission. It is incorrect document-language metadata affecting accessibility, browser behavior, and search engines. `DocumentLanguage`, request-language resolution, and the chosen JA font fallback must represent `ja` explicitly before release.

### 6. P1 — Sitemap regression test is red and does not verify the new JA contract

`npx vitest run src/app/__tests__/sitemap.test.ts` reports:

- 1 passed;
- 1 failed;
- actual counts `147 → 138`, nine removals;
- expected counts `129 → 120`, nine removals.

The 18-entry delta is the JA archive plus 17 detail entries, but `src/app/__tests__/sitemap.test.ts:103-110` was not updated for it.

The test also lacks direct assertions for the 17 JA detail URLs, the `/ja/columns` entry, exact reciprocal KO/ZH-Hant/EN/JA/x-default alternates, and absence of JA alternates on unsupported paths. These assertions are needed to protect the new indexable surface.

## Content finding

### 7. P2 — Article 008 displays a date different from its preserved `lastmod`

`src/content/columns-ja/008-taiwan-labor-severance-law.md:4-5` contains:

```yaml
lastmod: "2025-09-18"
date_display: "2025年9月13日"
```

The Japanese natural-language rendering of the preserved date should be `2025年9月18日`. The current content test checks only that a Japanese date-shaped string exists, so it misses this mismatch.

## Verified passes

### Requested corpus checks

- KO Markdown files: **17**.
- JA Markdown files: **17**.
- Sorted basenames: **exact match**.
- `getAllColumnPosts('ja')`: **17 posts**.
- Kana: **present in every JA file**.
- Hangul: **zero outside preserved `url` values**.
- Preserved Hangul occurrences: exactly the 008 and 009 source URLs.
- Article 016: **no `Harlem Yu`, `ハーレム・ユー`, or `庾澄慶` occurrence**; the file identifies `具俊曄（クー・ジュンヨプ）`.
- Frontmatter parity script: `url`, `lastmod`, `featured_image`, and FAQ counts match KO in all 17 files; only the 008 display-date mismatch above was found.
- Normalized JA/KO body-length ratios: **1.05–1.14** for every article.
- Markdown structure signatures checked for headings, lists, tables, blockquotes, links, and images: **matched KO for all 17 files**.

These checks support completeness and structural fidelity. They do not replace the plan's Japanese legal-language and Taiwan-law owner review.

### Requested Vitest

Command:

```bash
npx vitest run \
  src/lib/__tests__/columns-ja-content.test.ts \
  src/lib/__tests__/columns-en-content.test.ts
```

Result:

- `columns-ja-content.test.ts`: **PASS**, 5/5;
- `columns-en-content.test.ts`: **PASS**, 4/4;
- aggregate: **9/9 passed**.

### Hygiene

- `git diff --check` on the JA implementation paths: **PASS**.
- The shared worktree remains dirty with unrelated lanes; none were reverted, staged, or adopted by this review.
- No product source, translation, or test file was edited during this review.

## Required changes before rereview

1. Make `npm run typecheck` pass without `as never` locale suppression.
2. Emit real JA detail canonical, content-language, Open Graph locale/site data, and reciprocal JA hreflang.
3. Bypass KO builder-page projection for the JA listing and its metadata.
4. Remove or safely retarget unsupported `/ja`, `/ja/contact`, related-topic, account, and other non-column links from the JA shell.
5. Emit `<html lang="ja">` with an intentional Japanese font fallback.
6. Correct article 008 `date_display`.
7. Update sitemap tests and add direct JA metadata/sitemap assertions, then rerun typecheck and the relevant Vitest suites.
8. Run an 18-route browser smoke before deploy; Playwright coverage may remain a follow-up file if the same flows are evidenced another way, but no browser evidence exists in this review.

No commit, push, deploy, Blob write, CMS publish, or production mutation was performed.
