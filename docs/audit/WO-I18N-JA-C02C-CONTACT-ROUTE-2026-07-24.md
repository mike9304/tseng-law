# WO-I18N-JA-C02C — Japanese contact route integration

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Publish `/ja/contact` as a native Japanese page by passing `ja` unchanged
through metadata, the legacy dispatcher, the page component, and every contact
child section already localized in C01/C02A/C02B.

## Allowed files

1. `src/app/[locale]/(legacy)/contact-legacy.tsx`
2. `src/app/[locale]/(legacy)/index.tsx`
3. `src/app/[locale]/(legacy)/legacy-page-bodies.tsx`
4. `src/app/[locale]/(legacy)/__tests__/contact-ja.test.tsx` (new)

No other file may be edited. Do not stage, commit, push, deploy, or operate the
development server.

## Contract

- `ContactLegacyPage`, `ContactLegacyPageBody`, and contact metadata accept
  `SiteLocale`.
- Only the contact dispatcher stops applying `asLegacyLocale`; reviews,
  privacy, disclaimer, and all unrelated legacy branches remain unchanged.
- The four child components receive the original locale:
  `ConsultationGuideSection`, `MessengerChatSection`, `ContactBlocks`, and
  `OfficeMapTabs`.
- Japanese SEO:
  - title `お問い合わせ`
  - description
    `お問い合わせ種別、連絡先、事務所所在地をまとめてご案内します。`
  - canonical `https://tseng-law.com/ja/contact`
  - content language `ja`
  - OpenGraph locale `ja_JP`
  - 4 locale alternates plus x-default
  - keywords exactly:

```ts
[
  '台湾法律相談',
  '台湾弁護士相談',
  '昊鼎国際法律事務所',
  '台湾会社設立相談',
]
```

- For KO, ZH-Hant, and EN, keep existing metadata and three-locale alternates
  unchanged.
- Do not widen builder/admin `Locale`.

## Required integration tests

- Dispatcher passes `ja` unchanged for both metadata and page body.
- Page component and all four direct child components receive `ja`.
- Static Japanese render contains exact reviewed hero, guide, messenger,
  ContactBlocks, and default Taipei office text.
- English fallback `Before You Contact Us`, `Messenger Consultation`, and
  `Office Locations` is absent; representative Chinese fallback is absent.
- No `LINE`, `lin.ee`, or `line.me`.
- KakaoTalk canonical href appears exactly once; canonical mailto and tel hrefs
  are present.
- Three office tabs render, Taipei is initially selected, Japanese iframe title
  and three Japanese photo alt values render.
- External map links keep `target="_blank"` and
  `rel="noopener noreferrer"`.
- Metadata exact assertions cover canonical, content language, OpenGraph locale,
  five language alternate entries, and keywords.
- Representative KO, ZH-Hant, and EN metadata/body behavior remains unchanged.
- `npm run typecheck`
- scoped ESLint for the four allowed files
- `git diff --check`

Sitemap and interactive browser verification are later manager/workorder gates.
