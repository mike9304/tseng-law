# WO-HOME-ATTORNEY-SUMMARY — Remove unsupported years claim

Date: 2026-07-25 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Replace the unsupported exact `10+ years` claim in the visible homepage
attorney summary with verified experience and publishing facts in KO,
ZH-Hant, EN and JA.

Keep the public component, `siteContent.homeAttorney` and builder
decomposition synchronized without changing the attorney identity, profile
link, portrait, layout or other biography copy.

## Allowed files

1. `src/components/HomeAttorneySplit.tsx`
2. `src/data/site-content.ts`
3. `src/lib/builder/canvas/decompose-attorney.ts`
4. `src/lib/builder/canvas/__tests__/seed-home-layout.test.ts`
5. `src/components/__tests__/home-attorney-factual-copy.test.tsx` (new)

No other file may be modified.

## Exact four-language summary contract

### Korean

```text
법원 소송 실무와 기업 법률고문 경험을 바탕으로, SBS 뉴스에 법률 의견과 해설을 제공하고 WEI Lawyer를 통해 법률정보를 꾸준히 발행하고 있습니다.
```

### Traditional Chinese

```text
具備法院訴訟實務與企業法律顧問經驗，曾為 SBS 新聞提供法律意見與解說，並持續透過 WEI Lawyer 發布法律資訊。
```

### English

```text
With experience in court litigation and corporate legal advisory work, Attorney Wei Tseng has provided legal commentary and advice to SBS News and continues to publish legal information through WEI Lawyer.
```

### Japanese

```text
裁判所での訴訟実務と企業の法律顧問としての経験を有し、SBSニュースに法律上の意見・解説を提供するとともに、WEI Lawyerを通じて法律情報を継続的に発信しています。
```

Apply the exact same summary to:

- `HomeAttorneySplit` for all four public `SiteLocale` values;
- `siteContent[locale].homeAttorney.summary` for all four locales;
- builder `decompose-attorney` for its KO, ZH-Hant and EN `Locale` values.

Do not widen the builder-only `Locale` type to Japanese.

## Factual boundaries

- The official profile supports court-litigation background and corporate
  legal-adviser experience.
- The profile supports providing legal commentary/opinions to SBS News.
- The profile and linked channels support ongoing WEI Lawyer legal-information
  publishing.
- Do not state or imply an exact or approximate number of years.
- Do not turn SBS activity into a permanent role beyond the verified legal
  commentary/advice.
- Do not add outcome, case-count, success-rate, award, ranking or guarantee
  language.

## Official primary sources

- Official attorney profile:
  `https://www.hoveringlaw.com.tw/zh/wei.html`
- Korean attorney profile:
  `https://www.wei-wei-lawyer.com/lawyertseng`

## Regression requirements

### New factual-copy test

Prove:

1. `siteContent.homeAttorney.summary` exactly matches the reviewed sentence in
   all four locales;
2. server-rendered `HomeAttorneySplit` contains the exact reviewed summary,
   canonical attorney name and localized profile href for all four locales;
3. builder-decomposed `home-attorney-summary` matches KO, ZH-Hant and EN;
4. builder locales remain exactly KO, ZH-Hant and EN, with no JA widening;
5. the component, data and builder summary surfaces exclude:
   - `10+`, `10년`, `10 年`, `10年`;
   - any other numeric-year phrasing;
   - success-rate, case-count, ranking, award or guarantee wording;
   - wrong attorney identities.

### Existing builder layout test

Update only the exact Traditional Chinese
`home-attorney-summary` expectation to the reviewed sentence. Preserve every
layout, node, responsive, identity and portrait assertion.

## Forbidden scope

- Attorney title, descriptions, team-member introduction, profile data or
  credentials
- Homepage stats, results feature, achievements or other section copy
- Layout, CSS, portrait, link, button or component structure
- Builder locale widening or unrelated seed/layout changes
- Service, column, FAQ, pricing, review, contact or legal-page copy
- Header, footer, flags, SEO, JSON-LD, asset or embedding changes
- Stage, commit, push, deploy or server operation by the worker

## Required automated gates

```bash
npx vitest run \
  src/components/__tests__/home-attorney-factual-copy.test.tsx \
  src/lib/builder/canvas/__tests__/seed-home-layout.test.ts
npm run -s typecheck
npx eslint \
  src/components/HomeAttorneySplit.tsx \
  src/data/site-content.ts \
  src/lib/builder/canvas/decompose-attorney.ts \
  src/lib/builder/canvas/__tests__/seed-home-layout.test.ts \
  src/components/__tests__/home-attorney-factual-copy.test.tsx
git diff --check
git status --short
```

Independent factual and four-language copy review are required before commit.
The manager owns four-language browser verification and the checkpoint commit.
