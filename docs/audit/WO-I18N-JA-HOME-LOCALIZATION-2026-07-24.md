# WO-I18N-JA-HOME — Remove current English leakage from Japanese home

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Remove the remaining English fallback copy and English attorney structured data
from the current `/ja` homepage without changing the Korean, Traditional
Chinese, or English homepage contracts. Reuse the Japanese data already present
in `site-content.ts`, `OfficeMapTabs`, and `attorney-profiles.ts`.

This WO does not address the root-layout application-name metadata, global
Website publisher JSON-LD, FAQ factual corrections, unsupported case-result
claims, or homepage statistics. Those are separate review units.

## Allowed files

1. `src/app/[locale]/(legacy)/home-legacy.tsx`
2. `src/components/HeroSearch.tsx`
3. `src/components/HomeContactCta.tsx`
4. `src/components/ScrollTopButton.tsx`
5. `src/app/[locale]/(legacy)/__tests__/home-legacy-localization.test.tsx`

No other edits. The implementation worker must not edit content data, builder
types, route policy, metadata/SEO helpers, assets, or embeddings; stage,
commit, push, deploy; or operate a server. Browser verification is
manager-owned after handoff.

## Exact implementation contract

### Home route and JSON-LD

In `home-legacy.tsx`:

- pass the public `SiteLocale` directly to `OfficeMapTabs`:
  `locale={locale}`;
- load the attorney profile with
  `getAttorneyProfile(locale, primaryAttorneySlug)`;
- call `buildPersonJsonLd` with `locale`, not `toBuilderLocale(locale)`;
- retain the public profile path
  `/${locale}/lawyers/${profile.slug}`;
- remove the now-unused `toBuilderLocale` import;
- do not change post loading, FAQ selection, section order, metadata, or any
  non-Japanese route behavior.

For Japanese, the rendered Person JSON-LD must use the existing Japanese
profile values, including:

- name `曾雋崴弁護士`;
- Japanese role/description from `attorney-profiles.ts`;
- page URL `/ja/lawyers/wei-tseng`;
- `worksFor.name` `昊鼎国際法律事務所`;
- `worksFor.url` ending in `/ja`.

### Hero labels

In `HeroSearch.tsx`, provide explicit four-locale labels:

- Japanese column CTA: `コラムを見る`
- Japanese scroll-arrow accessible label: `下へスクロール`

Preserve the current KO/ZH-Hant/EN labels byte-for-byte:

- `호정칼럼 보기`, `查看專欄內容`, `View Columns`
- `아래로 스크롤`, `向下滾動`, `Scroll down`

Do not change the quick menus, paths, search behavior, or builder surface IDs.

### Home contact CTA

In `HomeContactCta.tsx`, source the title and description for every locale from
the existing `siteContent[locale].homeContactCta` object instead of maintaining
a three-way local fallback.

The Japanese render must therefore show exactly:

- `台湾の法律問題を、今すぐご相談ください。`
- `ビジネス、訴訟、会社設立のご相談を案件種別に迅速に振り分けます。`

The existing KO/ZH-Hant/EN strings in `site-content.ts` must render unchanged.
Do not change the CTA link, telephone action, or any data file.

### Scroll-to-top label

In `ScrollTopButton.tsx`, add the Japanese accessible label:

- `ページ上部へ戻る`

Preserve the existing KO/ZH-Hant/EN labels byte-for-byte:

- `상단으로 이동`
- `回到頂部`
- `Back to top`

Do not change scroll behavior or visibility logic.

## Required tests

Create a focused test that verifies:

- Japanese homepage composition passes `ja` directly to `OfficeMapTabs`;
- Japanese profile lookup and `buildPersonJsonLd` use `ja`, with no
  `toBuilderLocale(locale)` remaining in `home-legacy.tsx`;
- the Japanese Person JSON-LD contract uses `曾雋崴弁護士`,
  `昊鼎国際法律事務所`, `/ja/lawyers/wei-tseng`, and `/ja`;
- all four exact hero CTA and scroll labels are preserved;
- `HomeContactCta` renders the exact existing
  `siteContent[locale].homeContactCta` values for all four locales;
- the Japanese scroll-top accessible label is exact and all other locales are
  unchanged;
- rendered Japanese output and relevant accessibility labels contain none of:
  `View Columns`, `Scroll down`, `Talk to us now about your Taiwan legal issue.`,
  `Office Locations`, `Korea Office`, or `Back to top`. Source assertions may
  verify explicit Japanese branches, but must not assert that the preserved
  English literals are globally absent from the source files.

Use behavior/render assertions where practical and source-boundary assertions
only for the crucial absence of `toBuilderLocale` in this home module.

Run focused tests, relevant existing home/office/attorney tests, typecheck,
scoped ESLint, and `git diff --check`.

## Manager browser gate

On `/ja`, at desktop 1440px and mobile 390px:

- HTTP 200, `lang=ja`, canonical `/ja`, no console/page/request errors;
- exact flags and destinations:
  - `🇰🇷 KR` → `/ko`
  - `🇯🇵 JP` → `/ja`
  - `🇹🇼 TW` → `/zh-hant`
  - `🇺🇸 EN` → `/en`;
- `コラムを見る`, `下へスクロール`,
  `台湾の法律問題を、今すぐご相談ください。`,
  `事務所所在地`, `台北事務所`, `地図を開く`, and
  `ページ上部へ戻る` are present;
- the six English leakage strings listed in the test contract are absent from
  visible Japanese UI or relevant accessibility labels;
- Person JSON-LD uses Japanese profile/organization values and JA URLs;
- all visible images load, document width does not exceed viewport width, and
  no unexpected wrong-locale content links are introduced.

Independent implementation review and manager gates are required before
commit.
