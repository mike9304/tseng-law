# WO-CONTACT-P0 — Remove dead LINE channel

Date: 2026-07-24 KST
Owner: implementation worker
Reviewer: independent read-only reviewer
Manager: root

## Evidence

- `https://lin.ee/hojeong` returns HTTP 404 and no official replacement was
  found on the owned Hovering/Wei sites.
- `https://pf.kakao.com/_hojeong/chat` returns HTTP 200.
- `wei@hoveringlaw.com.tw` and `+82-10-2992-9304` are corroborated by owned
  public pages.

## Objective

Remove the dead/unverified LINE destination from public and consultation
surfaces. Keep KakaoTalk as the single verified messenger channel and preserve
the verified phone/email.

## Allowed files

- `src/data/contact-page-content.ts`
- `src/components/MessengerChatSection.tsx`
- `src/components/consultation/AiConsultationSection.tsx`
- `src/data/__tests__/contact-page-content-ja.test.ts`
- `src/components/__tests__/verified-contact-channels.test.tsx` (new)

No other file may be edited.

## Required behavior

1. Remove the LINE constant/data and simplify messenger data to one required
   KakaoTalk `primary` channel for all four locales.
2. Use existing localized KakaoTalk labels; keep the verified Kakao URL
   byte-for-byte.
3. Render one KakaoTalk card/link in `MessengerChatSection` and consultation
   fallback UI. Remove LINE icon/code and LINE-specific copy.
4. Preserve all verified email/phone values and links.
5. Do not invent a replacement LINE URL or claim official LINE ownership.
6. Do not change unrelated consultation logic or locale support.

## Test contract

- No `lin.ee/hojeong`, LINE channel label, or LINE icon remains in the five
  allowed files.
- All four locales expose exactly the verified KakaoTalk primary channel.
- Messenger static markup contains KakaoTalk once and no LINE link/card.
- Consultation source/render contract uses only the verified primary channel.
- Phone/email parity and existing locale labels remain correct.

## Worker gates

- Focused Vitest for contact data, messenger render, and consultation surface.
- `npm run typecheck`
- scoped ESLint on all five allowed files
- `git diff --check`
- repo search proving the dead URL is absent from `src`

Do not stage, commit, push, deploy, or operate the dev server.

## Manager acceptance

- Independent review confirms no dead link, duplicate messenger, or regression.
- Manager reruns gates and browser-checks a live messenger surface.
- Commit only the five allowed files plus this work order.
