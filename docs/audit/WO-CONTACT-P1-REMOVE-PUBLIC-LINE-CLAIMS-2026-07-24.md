# WO-CONTACT-P1 — Remove residual public LINE contact claims

Date: 2026-07-24 KST
Owner: implementation worker
Reviewer: independent read-only reviewer
Manager: root

## Evidence and scope

The former public LINE URL returns HTTP 404 and no verified replacement exists.
The verified public channels are:

- KakaoTalk: `https://pf.kakao.com/_hojeong/chat`
- email: `wei@hoveringlaw.com.tw`
- phone: `+82-10-2992-9304`

This work order removes only user-facing claims that the firm can be contacted
through LINE. It does not remove generic LINE platform integrations or legal
article references to LINE messages as evidence.

## Allowed files

- `src/components/ConsultationGuideSection.tsx`
- `src/data/intent-pages.ts`
- `src/app/api/consultation/submit/route.ts`
- `src/components/floating-ai-quick-replies.ts`
- `src/lib/consultation/copy.ts`
- `src/lib/consultation/__tests__/verified-contact-copy.test.ts` (new)

No other file may be edited.

## Required behavior

1. Remove LINE from the three localized public consultation-guide channel
   statements. Preserve KakaoTalk, email, and phone.
2. Remove LINE from the two KO/ZH remote-consultation FAQ answers in
   `intent-pages.ts`; preserve email, KakaoTalk, video consultation, and all
   other wording.
3. Remove LINE from the three localized consultation-submit fallback messages;
   preserve KakaoTalk, phone, and the verified email value.
4. Remove LINE from the three localized floating-AI “contact channels”
   questions; preserve email, KakaoTalk, and phone.
5. In all three locale objects in `consultation/copy.ts`:
   - remove LINE from fallback, channel, submit-failure, placeholder, and field
     prompt copy;
   - remove the `{ value: 'line', label: 'LINE' }` visible preferred-contact
     option;
   - preserve the Email, Phone, and KakaoTalk options and all non-contact copy.
6. Do not alter consultation request types, stored historical values, generic
   builder LINE integrations, `/api/line`, social widgets, or column prose.

## Test contract

The new focused test must:

- assert the three runtime consultation-copy objects contain no public `LINE`
  claim or `value: 'line'` preferred option;
- assert preferred-contact values remain exactly `email`, `phone`, `kakao`;
- assert the five product source files contain no uppercase `LINE`;
- assert representative localized replacement phrases still contain the
  verified channel names and are non-empty;
- leave `contactPageContent` contract testing to the existing verified-channel
  test.

## Gates

- focused consultation/contact copy tests
- `npm run -s typecheck`
- scoped ESLint on the six allowed files
- `git diff --check`
- repository search confirming uppercase `LINE` is absent from the five product
  files

Do not stage, commit, push, deploy, or operate the dev server.
