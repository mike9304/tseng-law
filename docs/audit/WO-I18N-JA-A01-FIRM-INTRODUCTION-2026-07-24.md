# WO-I18N-JA-A01 — Japanese firm introduction

Date: 2026-07-24 KST
Owner: Japanese translation worker
Reviewer: independent Japanese-language reviewer
Manager: root

## Objective

Add a complete, natural Japanese translation for the About page's firm
introduction. This work order covers only the firm history/introduction block,
not team profiles, contact blocks, route wiring, metadata, or sitemap.

## Allowed files

- `src/data/firm-introduction.ts`
- `src/data/__tests__/firm-introduction-ja.test.ts` (new)

No other file may be edited.

## Source and translation rules

1. Change the content map to `Record<SiteLocale, FirmIntroductionContent>` and
   add a real `ja` branch. Do not use an EN/KO fallback.
2. Preserve the existing KO, ZH-Hant, and EN objects byte-for-byte.
3. Translate the complete seven-part history represented by the KO/EN branch:
   - 2016 founding and the meaning of `昊鼎`;
   - firm practice strengths and office focus;
   - 2017 Pingtung office;
   - 2020 accounting-office addition;
   - 2024 integrated business-support office;
   - 2024 attorney `曾雋崴` joining and Korea/Japan client services;
   - continuing public-interest/pro bono work.
4. Use professional Japanese legal-office prose:
   - firm: `昊鼎国際法律事務所`
   - attorney: `曾雋崴弁護士`
   - lawyer title: `弁護士`
   - accountant title: `公認会計士`
5. Avoid literal Korean syntax, unexplained Korean text, machine-translation
   artifacts, exaggerated marketing, and invented credentials.
6. Use the Traditional Chinese firm logo and an accurate Japanese alt label.
   Use an existing official About source URL and `出典：hoveringlaw.com.tw`.

## Required test contract

- `firmIntroductionContent.ja` exists and has seven non-empty paragraphs.
- The section/title/source labels and identity terms above are present.
- All seven required historical milestones/topics are represented.
- Japanese paragraphs contain no Hangul and do not equal the EN/KO paragraphs.
- Existing KO/ZH-Hant/EN paragraph counts and representative text remain
  unchanged.

## Worker gates

- Focused Vitest including the new test and existing content regression test.
- `npm run typecheck`
- scoped ESLint on the two allowed files
- `git diff --check`
- report translation choices that need reviewer attention

Do not stage, commit, push, deploy, or operate the dev server.

## Manager acceptance

- Independent Japanese reviewer checks every sentence for meaning, legal tone,
  names, chronology, naturalness, and omission.
- Worker applies any concrete review corrections within the same two files.
- Manager reruns all gates and verifies the data contract directly.
- Commit only the two allowed files plus this work order.
