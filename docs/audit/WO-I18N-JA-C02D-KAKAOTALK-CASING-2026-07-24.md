# WO-I18N-JA-C02D — Preserve KakaoTalk casing

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Browser finding

The Japanese source text is `KakaoTalkチャンネルでお問い合わせ`, but the
shared `.messenger-card-platform { text-transform: uppercase; }` rule causes the
visible browser text to become `KAKAOTALKチャンネルでお問い合わせ`.

## Allowed files

1. `src/components/MessengerChatSection.tsx`
2. `src/components/__tests__/verified-contact-channels.test.tsx`

No other file may be edited. Do not stage, commit, push, deploy, or operate the
development server.

## Contract

- For Japanese only, render the platform heading with `text-transform: none` so
  visible browser text preserves the exact brand casing `KakaoTalk`.
- Keep the existing class and every KO/ZH-Hant/EN style and rendered value
  unchanged.
- Do not change any Japanese copy or href.
- Add a focused static-markup assertion for the Japanese override and an
  absence/regression assertion for the three existing locales.
- Run focused tests, `npm run typecheck`, scoped ESLint, and `git diff --check`.

Browser verification and commit are manager gates.
