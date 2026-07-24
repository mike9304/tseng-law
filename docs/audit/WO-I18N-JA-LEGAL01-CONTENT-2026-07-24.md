# WO-I18N-JA-LEGAL01 — Japanese legal-page content

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Add complete, professional Japanese source content for the privacy policy,
disclaimer, and accessibility statement. This work order changes source data
only; route integration is a separate manager-gated work order.

## Allowed files

1. `src/data/legal-pages.ts`
2. `src/data/__tests__/legal-pages-ja.test.ts` (new)

Do not edit any other file. Do not stage, commit, push, deploy, or operate the
development server.

## Contract

- Change the legal content record to support all `SiteLocale` values and add a
  direct `ja` record. Preserve KO, ZH-Hant, and EN byte-for-byte except for the
  minimal type import/type declaration needed to admit `ja`.
- Translate every existing section, paragraph, and item without omission or
  expansion. Do not add claims about statutory compliance, certifications,
  governing law, response times, data deletion periods, client verification,
  or guaranteed accessibility.
- Use the firm name `昊鼎国際法律事務所`.
- Preserve the effective date exactly as `2026-03-10`.
- Preserve the public contact email exactly as
  `wei@hoveringlaw.com.tw`.
- Use natural Japanese legal-site wording and the following structure:
  - privacy: `プライバシーポリシー`
    - `収集する情報`
    - `利用目的`
    - `保管および第三者への提供`
    - `お問い合わせ`
  - disclaimer: `免責事項`
    - `一般情報について`
    - `ご相談および委任関係`
    - `外部リンクおよび結果の非保証`
  - accessibility: `アクセシビリティについて`
    - `アクセシビリティへの取り組み`
    - `改善のご要望`
- Do not use English or Korean body-copy fallback.
- Do not translate or alter the `PRIVACY`, `DISCLAIMER`, or `ACCESSIBILITY`
  labels.

## Required tests

Add a focused data-contract test proving:

- all three Japanese pages exist;
- title, section titles, effective-date label/date, firm name, and contact email
  are exact;
- Japanese section/paragraph/item counts equal the existing ZH-Hant source for
  the corresponding page;
- no Korean firm name, legacy attorney name, English fallback titles, or Korean
  body markers occur in serialized Japanese content;
- KO, ZH-Hant, and EN representative sentinel strings remain unchanged.

## Verification

- focused Vitest suite passes;
- `npm run typecheck`;
- scoped ESLint for allowed files;
- `git diff --check`.

Independent Japanese copy review and commit are manager gates.
