# WO-I18N-JA-A03 — Japanese contact channels

Date: 2026-07-24 KST
Owner: Japanese translation worker
Reviewer: independent Japanese-language reviewer
Manager: root

## Objective

Add native Japanese labels for the shared contact-channel data used by the
About/contact blocks. This work order prepares data only; component and route
wiring are separate.

## Allowed files

- `src/data/contact-page-content.ts`
- `src/data/__tests__/contact-page-content-ja.test.ts` (new)

No other file may be edited.

## Required behavior

1. Type the content map as `Record<SiteLocale, LocaleContent>` and add `ja`.
2. Use concise natural labels:
   - LINE consultation (`LINEで相談`); do not call it official until ownership
     and receipt are verified
   - KakaoTalk channel consultation
   - `メール`
   - `電話`
3. Preserve every canonical href, email, phone, normalized `mailto:`/`tel:`
   value, platform name, and office phone exactly.
4. Preserve KO/ZH-Hant/EN objects byte-for-byte.
5. Do not add invented availability, response-time, or service claims.

## Required test contract

- Japanese labels are exact, non-empty, and contain no Hangul/English fallback
  labels.
- All Japanese canonical values/links equal the existing locale records.
- KO/ZH-Hant/EN representative labels and values remain unchanged.

## Worker gates

- Focused Vitest including the new test and relevant content regression test.
- `npm run typecheck`
- scoped ESLint on the two allowed files
- `git diff --check`

Do not stage, commit, push, deploy, or operate the dev server.

## Manager acceptance

- Independent Japanese reviewer confirms label naturalness and fidelity.
- Manager reruns all gates and verifies canonical link parity.
- Commit only the two allowed files plus this work order.
