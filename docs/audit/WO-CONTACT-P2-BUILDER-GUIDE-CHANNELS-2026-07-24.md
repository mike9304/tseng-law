# WO-CONTACT-P2 — Keep builder consultation guide on verified channels

Date: 2026-07-24 KST
Owner: implementation worker
Reviewer: independent read-only reviewer
Manager: root

## Objective

Prevent future builder decomposition from reintroducing a public claim that the
firm accepts consultations through LINE.

## Allowed files

- `src/lib/builder/canvas/decompose-page-shared.ts`
- `src/lib/builder/canvas/__tests__/verified-consultation-guide-channels.test.ts`
  (new)

No other file may be edited.

## Required exact replacements

- KO:
  `카카오톡, 이메일, 전화로 문의를 접수할 수 있습니다.`
- ZH-Hant:
  `可透過 KakaoTalk、電子郵件與電話提出詢問。`
- EN:
  `You can reach us through KakaoTalk, email, or phone.`

Change only these three decomposed consultation-guide strings. Preserve all
node IDs, surface keys, order, visibility, layout, and every other string.

Do not touch generic LINE platform integrations, `/api/line`, social widgets,
floating-chat providers, security config, or legal column prose.

## Test contract

- source contains the three exact verified-channel strings;
- source contains no uppercase `LINE`;
- representative decomposition tests still pass;
- existing public runtime copy remains outside this work order.

## Gates

- focused new and existing decomposition tests
- `npm run -s typecheck`
- scoped ESLint on the two allowed files
- `git diff --check`

Do not stage, commit, push, deploy, or operate the dev server.
