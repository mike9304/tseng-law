# WO-I18N-JA-L01 — Publish native Japanese lawyer list and profile

Date: 2026-07-24 KST
Owner: implementation worker
Reviewer: independent read-only reviewer
Manager: root

## Objective

Connect the already-reviewed Japanese team and attorney-profile data to
`/ja/lawyers` and `/ja/lawyers/wei-tseng`. Remove the current EN fallback on
the list and KO coercion on the detail route without changing builder/admin
locale behavior.

## Allowed files

- `src/app/[locale]/(legacy)/index.tsx`
- `src/app/[locale]/(legacy)/lawyers-legacy.tsx`
- `src/app/[locale]/(legacy)/legacy-page-bodies.tsx`
- `src/app/[locale]/lawyers/[slug]/page.tsx`
- `src/app/sitemap.ts`
- `src/app/[locale]/(legacy)/__tests__/lawyers-ja.test.tsx` (new)
- `src/app/[locale]/lawyers/[slug]/__tests__/ja-page.test.tsx` (new)
- `src/app/__tests__/sitemap.test.ts`

No other file may be edited.

## Existing approved data

- `teamContent.ja` in `src/data/team-members.ts`
- `attorneyProfiles.ja['wei-tseng']` in
  `src/data/attorney-profiles.ts`
- official portrait `/images/team/wei-tseng-official.png`
- canonical email `wei@hoveringlaw.com.tw`
- approved `sameAs` external profiles

Do not rewrite these source records in this work order.

## Required behavior

1. `/ja/lawyers`
   - passes `ja` directly to page copy, team data, profile data, PageHeader, and
     JSON-LD;
   - skips builder visibility reads for JA and renders all three list blocks;
   - emits canonical `/ja/lawyers`, `content-language: ja`, `ja_JP` OpenGraph,
     and four-language alternates;
   - links the lead profile to `/ja/lawyers/wei-tseng`.
2. `/ja/lawyers/wei-tseng`
   - must not call the builder source loader with `ja`, because that loader is
     authoring-locale-only and normalizes to KO;
   - instead adapts the approved file-backed JA attorney profile for the
     existing detail renderer, using the existing default image alt/focal
     helpers if needed;
   - skips builder visibility reads for JA and shows hero/body/SEO;
   - emits native JA metadata, breadcrumb, ProfilePage/Person, and FAQ JSON-LD;
   - preserves official portrait, email, internal links, and `sameAs`.
3. Add exact Japanese detail UI labels:
   - page label `弁護士プロフィール`
   - facts `基本情報`
   - education `学歴`
   - experience `経歴`
   - representative work `主な取扱業務・実績`
   - internal links `関連サービス・コンテンツ`
   - external profiles `外部プロフィール・チャンネル`
   - contact `相談を申し込む`
   - search terms `よく検索されるテーマ`
   - breadcrumb home `ホーム`
   - breadcrumb list `弁護士紹介`
4. Add `/ja/lawyers` and `/ja/lawyers/wei-tseng` exactly once to sitemap with
   four-language alternates.
5. Preserve KO/ZH-Hant/EN builder overlays, visibility controls, metadata,
   detail redirects, source overrides, and static params.
6. Do not change `toBuilderLocale()`, `normalizeLocale()`, builder source
   schemas, admin authoring locales, or unrelated JA route policy.

## Test contract

- JA list metadata/body/JSON-LD are Japanese and contain no EN/KO fallback.
- JA list does not call builder visibility storage.
- JA list lead link is `/ja/lawyers/wei-tseng`.
- JA detail uses the approved Japanese profile and all exact UI labels.
- JA detail does not call the builder source loader or builder visibility
  storage.
- JA detail metadata canonical/OpenGraph/hreflang and JSON-LD paths/language
  are correct.
- Official portrait, email, `sameAs`, and Japanese internal links are
  preserved.
- Sitemap contains both JA URLs exactly once.
- Representative KO/ZH-Hant/EN list/detail behavior remains unchanged.

## Gates

- focused list/detail/sitemap/profile tests
- `npm run -s typecheck`
- scoped ESLint on all eight allowed files
- `git diff --check`
- browser desktop/mobile checks for both JA routes, list-to-detail navigation,
  four flag targets, metadata, images, and console errors

Do not stage, commit, push, deploy, or operate the dev server.
