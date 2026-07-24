# WO-I18N-JA-C01 — Japanese contact data

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Establish the reviewed Japanese source text and verified contact-channel data
before wiring `/ja/contact` to the Japanese UI components.

## Allowed files

1. `src/data/page-copy.ts`
2. `src/data/site-content.ts`
3. `src/data/contact-page-content.ts`
4. `src/data/__tests__/contact-page-content-ja.test.ts`
5. `src/app/[locale]/(legacy)/__tests__/about-ja.test.tsx`

No other file may be edited. Do not stage, commit, push, deploy, or operate the
development server.

## Exact Japanese copy

### Page hero

```text
CONTACT
お問い合わせ
お問い合わせ種別、連絡先、事務所所在地をまとめてご案内します。
```

### ContactBlocks

```text
メール
電話
お問い合わせ種別
ビジネス・投資
メディア取材
採用に関するお問い合わせ
一般のお問い合わせ
メール：wei@hoveringlaw.com.tw
電話：+82-10-2992-9304
KakaoTalk：チャンネルでお問い合わせ
件名に【メディア取材】とご記入ください
件名に【採用】とご記入ください
事務所所在地
台北事務所
台中事務所
高雄事務所
お問い合わせページ
```

### Verified channel label

```text
KakaoTalkチャンネルでお問い合わせ
```

The exact canonical channel values remain:

- KakaoTalk: `https://pf.kakao.com/_hojeong/chat`
- email: `wei@hoveringlaw.com.tw`
- email href: `mailto:wei@hoveringlaw.com.tw`
- phone: `+82-10-2992-9304`
- phone href: `tel:+821029929304`

## Contract

- Change only the Japanese objects.
- Preserve every address string byte-for-byte. Only the office titles and the
  existing `locationsLabel` may be localized as specified.
- Preserve all phone, email, KakaoTalk URL, and href values byte-for-byte.
- Use full-width Japanese punctuation `：` in the Japanese inquiry detail
  labels specified above.
- Do not add LINE text or a LINE URL.
- Do not add a claim that KakaoTalk is officially verified, a legal consultation
  service by itself, or a guaranteed response channel.
- KO, ZH-Hant, and EN objects must remain exactly unchanged.

## Required verification

- Exact assertions for every Japanese string and canonical channel value above.
- Snapshot/deep-equality regression or equivalent exact assertions proving the
  three existing locale objects are unchanged.
- No `LINE`, `lin.ee`, or `line.me` in the Japanese contact data.
- Update only the stale Japanese About-page contact assertion from
  `台北オフィス` to the reviewed `台北事務所`; preserve all other About tests.
- `npm run typecheck`
- scoped ESLint for the five allowed files
- `git diff --check`

UI integration, sitemap, browser verification, and commit are manager/later
workorder gates.
