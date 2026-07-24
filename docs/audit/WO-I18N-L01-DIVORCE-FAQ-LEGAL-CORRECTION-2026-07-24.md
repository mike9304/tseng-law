# WO-I18N-L01 — Four-language mutual-consent divorce FAQ correction

## Verified legal issue

The KO, ZH-Hant, EN, and JA divorce FAQ answers currently say that a Taiwanese
mutual-consent divorce requires court notarization. That conflicts with Taiwan
Civil Code Article 1050 and with this repository's service-detail content.

Taiwan Ministry of Justice official source:

- Civil Code Article 1050:
  <https://mojlaw.moj.gov.tw/LawContentExtent.aspx?LawNo=1050&lsid=FL001351>
- Official English Civil Code:
  <https://mojlaw.moj.gov.tw/ENG/LawContentE.aspx?LSID=fl001351>

Article 1050 requires a written mutual-consent divorce, signatures of at least
two witnesses, and divorce registration at the household administration
authority. It does not require court notarization.

## Required implementation

1. Correct only the mutual-consent-divorce parenthetical in the matching FAQ
   answer for each locale:
   - KO: 서면, 2명 이상 증인 서명, 호정기관(戶政機關) 이혼등기;
   - ZH-Hant: 書面、2 人以上證人簽名、向戶政機關辦理離婚登記;
   - EN: written agreement, signatures of at least two witnesses, divorce
     registration with the household administration authority;
   - JA: 書面、2名以上の証人の署名、戸政機関での離婚登記.
2. Preserve the remainder of each answer: judicial divorce, cross-border
   governing law/jurisdiction, property division, custody, and consultation
   guidance.
3. Do not introduce claims beyond the official Article 1050 requirements.
4. Add focused tests proving all four answers:
   - no longer contain the court-notarization wording;
   - contain their three required Article 1050 elements;
   - retain the cross-border legal-issues guidance.

## Exact allowed files

- `src/data/faq-content.ts`
- `src/data/__tests__/faq-divorce-legal-consistency.test.ts` (new)

All other files are read-only. Do not change unrelated FAQ answers, service
details, page routes, UI, SEO, or styling. Do not stage, commit, push, deploy,
or modify runtime data.

## Verification

Run from `/Users/son7/Projects/tseng-law`:

```bash
npx vitest run src/data/__tests__/faq-divorce-legal-consistency.test.ts \
  'src/app/[locale]/faq/__tests__/ja-page.test.tsx'
npm run typecheck
npx eslint src/data/faq-content.ts \
  src/data/__tests__/faq-divorce-legal-consistency.test.ts
git diff --check
git status --short
```

Report exact commands and results. If another file changes, stop and report the
scope violation instead of cleaning or reverting it.
