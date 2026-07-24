# WO-I18N-P02 — Complete Japanese videos and public-channels page

## Problem

`/ja/videos` currently normalizes Japanese to Korean and can enter the
three-language published-page/member pipeline. Japanese video/channel content
already exists, and D01 added the complete Japanese attorney profile, but the
route and its media-hub components still accept builder `Locale` only.

## Required implementation

1. Preserve KO/ZH-Hant/EN published-builder behavior exactly.
2. Treat route params as `SiteLocale` and normalize with
   `normalizeSiteLocale()`.
3. Add a Japanese static branch before builder metadata, published page,
   member, or access calls.
4. Japanese metadata must use:
   - `pageCopy.ja.videos`;
   - canonical `/ja/videos`;
   - Japanese keywords for Attorney Wei Tseng, Taiwan legal videos, and the
     WEI Lawyer channel;
   - `ja_JP`, Japanese content language, and all four public alternates.
5. Japanese body must use the same full static structure as established
   locales:
   - Japanese breadcrumb (`ホーム`);
   - CollectionPage JSON-LD from every Japanese channel item;
   - Person JSON-LD from `attorneyProfiles.ja['wei-tseng']`;
   - `VideosLegacyPageBody` with all 17 Japanese columns;
   - complete Japanese `AttorneyMediaHubView`;
   - Japanese `VideoChannel` sourced from `siteContent.ja.videos`.
6. Add natural Japanese media-hub copy for headings, stats, channels, topics,
   representative matters, profile link, and media/consultation contact.
7. Widen only the public-facing component and relevant JSON-LD helper locale
   types from `Locale` to `Locale | SiteLocale`/`SiteLocale`. Do not widen
   builder/admin authoring locales.
8. Japanese must not call:
   - `buildPublishedSitePageMetadata`;
   - `resolvePublishedSitePage`;
   - member/access helpers;
   - published render hooks.
9. Keep KO/ZH-Hant/EN copy and runtime behavior unchanged.
10. Add focused tests for Japanese metadata, builder bypass, profile/channel
    rendering, 17-column count, Japanese JSON-LD, link localization, and
    established-locale regression.

## Exact allowed files

- `src/app/[locale]/videos/page.tsx`
- `src/app/[locale]/videos/__tests__/page.test.tsx`
- `src/app/[locale]/(legacy)/legacy-page-bodies.tsx`
- `src/components/AttorneyMediaHubView.tsx`
- `src/components/VideoChannel.tsx`
- `src/components/__tests__/ja-videos-components.test.tsx` (new)
- `src/lib/seo.ts`

Read-only dependencies:

- `src/data/attorney-profiles.ts`
- `src/data/page-copy.ts`
- `src/data/site-content.ts`
- `src/lib/columns.ts`

Do not change profile data, video content data, routes other than videos,
Header/Footer, CSS, public route policy, or sitemap. Do not stage, commit, push,
deploy, or modify runtime data.

## Verification

Run from `/Users/son7/Projects/tseng-law`:

```bash
npx vitest run 'src/app/[locale]/videos/__tests__/page.test.tsx' \
  src/components/__tests__/ja-videos-components.test.tsx
npm run typecheck
npx eslint 'src/app/[locale]/videos/page.tsx' \
  'src/app/[locale]/videos/__tests__/page.test.tsx' \
  'src/app/[locale]/(legacy)/legacy-page-bodies.tsx' \
  src/components/AttorneyMediaHubView.tsx \
  src/components/VideoChannel.tsx \
  src/components/__tests__/ja-videos-components.test.tsx \
  src/lib/seo.ts
git diff --check
git status --short
```

Report exact commands and results. If another file changes, stop and report the
scope violation instead of cleaning or reverting it.
