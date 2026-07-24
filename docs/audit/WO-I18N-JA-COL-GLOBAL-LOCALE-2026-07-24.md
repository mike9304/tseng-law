# WO-I18N-JA-COL-GLOBAL — Remove English fallback from Japanese column surfaces

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Make Japanese column and related home-card surfaces use the existing Japanese
attorney profile, Japanese routes, and Japanese structured-data locale. Remove
the intentional `ja → en` fallback now that the Japanese profile, contact,
services, lawyers, and columns routes are public.

## Allowed files

1. `src/app/[locale]/columns/[slug]/page.tsx`
2. `src/app/[locale]/columns/page.tsx`
3. `src/components/AttorneyAuthorityCard.tsx`
4. `src/components/InsightsArchiveSection.tsx`
5. `src/components/HomeAttorneySplit.tsx`
6. `src/lib/seo.ts`
7. `src/app/globals.css`
8. `src/components/__tests__/ja-column-locale-integrity.test.tsx` (new)

Do not edit any other file. Do not stage, commit, push, deploy, or operate the
development server.

## Detail page

- Use `getAttorneyProfilePath(locale)` for the hero author and Article JSON-LD.
- The Japanese hero author must link to `/ja/lawyers/wei-tseng`.
- The consultation card must always link to `/${locale}/contact`, including
  `/ja/contact`.
- Remove `linkLocale` and its comment.
- For Japanese guide cards, use only public safe routes:
  - formation:
    - `台湾投資・会社設立` → `/ja/services#investment`
    - `曾雋崴弁護士` → `/ja/lawyers/wei-tseng`
  - case:
    - `台湾の民事紛争` → `/ja/services#civil`
    - `曾雋崴弁護士` → `/ja/lawyers/wei-tseng`
  - legal:
    - `取扱業務` → `/ja/services`
    - `曾雋崴弁護士` → `/ja/lawyers/wei-tseng`
- Preserve existing KO, ZH-Hant, and EN guide destinations and labels.
- Pass `locale`, not `toBuilderLocale(locale)`, to:
  - `buildBreadcrumbJsonLd`
  - `buildArticleJsonLd`
  - `buildFaqJsonLd`
- Japanese breadcrumb home label: `ホーム`.
- Japanese Article JSON-LD must emit:
  - `inLanguage: ja`
  - Japanese organization/publisher name
  - author URL `/ja/lawyers/wei-tseng`
- Japanese FAQ JSON-LD must emit `inLanguage: ja`.
- Keep builder-only template visibility and typography calls on
  `toBuilderLocale(locale)`; those APIs do not support Japanese authoring.

## List page

- Pass `locale` directly to `buildBreadcrumbJsonLd` and
  `buildCollectionPageJsonLd`.
- Japanese breadcrumb home label: `ホーム`.
- Japanese CollectionPage JSON-LD must emit `inLanguage: ja` and preserve
  Japanese titles, bylines, paths, and description.
- Keep builder-only template visibility on `toBuilderLocale(locale)`.

## Attorney card

- In `AttorneyAuthorityCard`, use `getAttorneyProfile(locale, ...)` and
  `getAttorneyProfilePath(locale, ...)`.
- Remove the builder-locale conversion from this public-site component.
- Japanese render must use:
  - `曾雋崴弁護士`
  - `台湾弁護士・代表弁護士`
  - Japanese summary, practice areas, and external-profile labels
  - `/ja/lawyers/wei-tseng`
  - `/ja/contact`
- KO, ZH-Hant, and EN renders must remain unchanged.
- Browser QA found that the longer Japanese name, role, and summary overflow
  the 300px desktop column card because the global `word-break: keep-all`
  combines with grid-item minimum sizing. In `globals.css`:
  - add `min-width: 0` to `.authority-card-copy`;
  - allow `.authority-card-name`, `.authority-card-role`, and
    `.authority-card-summary` to wrap inside the grid column with
    `overflow-wrap: anywhere` and an appropriate Japanese-capable word-break;
  - do not change the mobile one-column card layout.

## Home attorney and insights cards

- `HomeAttorneySplit` must use `teamContent[locale]` and
  `getAttorneyProfilePath(locale)`.
- Japanese home attorney content and link must no longer use English data.
- `InsightsArchiveSection` must use `getAttorneyProfilePath(locale)` for the
  reviewed-by author link. Japanese link:
  `/ja/lawyers/wei-tseng`.
- Preserve all other locale behavior.

## SEO helper types

- Change `ArticleJsonLdInput.locale` from builder-only `Locale` to
  `SiteLocale`.
- Change the optional locale accepted by `buildFaqJsonLd` from `Locale` to
  `SiteLocale`.
- Do not widen builder/admin locale types or the `locales` constant.

## Forbidden Japanese fallback

On the Japanese surfaces covered by this work order:

- `/en/lawyers/wei-tseng`
- `/en/contact`
- `/en/taiwan-company-setup-lawyer`
- `/en/taiwan-lawyer`
- `Attorney Wei Tseng`
- `Hovering official profile`
- `Personal profile website`
- English attorney role, summary, or practice-area labels
- Article/FAQ/Collection JSON-LD `inLanguage: en`
- public-profile calls that pass `toBuilderLocale(locale)`

External profile URLs may point to authoritative Chinese/English source pages;
the forbidden rule applies to their visible Japanese labels and internal site
routes, not authoritative external URLs.

## Required tests

Create a focused test that:

1. server-renders `AttorneyAuthorityCard` for `ja` and asserts the Japanese
   name, role, summary/profile labels, `/ja/lawyers/wei-tseng`, and
   `/ja/contact`; asserts no English fallback copy/internal route;
2. server-renders `HomeAttorneySplit` for `ja` and asserts Japanese team data
   and `/ja/lawyers/wei-tseng`;
3. server-renders `InsightsArchiveSection` for `ja` and asserts
   `曾雋崴弁護士監修` links to `/ja/lawyers/wei-tseng`;
4. calls `buildArticleJsonLd` and `buildFaqJsonLd` with `ja` and asserts
   Japanese `inLanguage`, publisher, and author URL;
5. reads the detail/list page sources and asserts direct `locale` use for
   public SEO/profile/contact paths while builder-only visibility/typography
   still use `toBuilderLocale(locale)`;
6. asserts the exact Japanese safe guide routes and labels;
7. asserts the Japanese surfaces contain none of the forbidden internal
   English routes/fallback text.
8. reads the scoped CSS and asserts the authority-card copy and text wrapping
   rules that prevent desktop document overflow.

Run the existing attorney-profile, column, insights, SEO FAQ, and Japanese
homepage/component tests as regressions, plus typecheck, scoped ESLint, and
diff checks.

Manager browser QA must cover one Japanese formation column on desktop and
mobile, including hero author, sidebar consultation, attorney card, guide
links, Article/FAQ JSON-LD, flags, overflow, images, and console.
