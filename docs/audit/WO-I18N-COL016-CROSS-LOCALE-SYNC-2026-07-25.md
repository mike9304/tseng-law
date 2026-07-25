# WO-I18N-COL016 — Public Reference and Alias Synchronization

Date: 2026-07-25 KST
Manager: Codex `/root`

## Goal

Synchronize every current public reference to column 016 with the four approved
titles and the anonymized generic image. Add Japanese parity to the permanent
legacy column/insights redirects.

The writer owns only:

1. `src/data/site-content.ts`
2. `src/data/insights-archive.ts`
3. `next.config.mjs`
4. `src/data/__tests__/site-content-ja-services.test.ts`
5. new `src/data/__tests__/column-016-public-reference-sync.test.ts`

Do not edit column Markdown, column tests, other data files, shared components,
embeddings, images, or this work order. Do not stage, commit, push, deploy,
publish, or operate a server.

## Exact service related-column titles

For slug `taiwan-inheritance-custody-analysis`, use exactly:

- KO: `대만 상속과 친권: 남은 가족을 위한 법률 안내`
- ZH-Hant: `台灣繼承與親權：遺屬法律指南`
- EN: `Taiwan Inheritance and Parental Rights: A Guide for Surviving Families`
- JA: `台湾の相続と親権：遺された家族のための法律ガイド`

Change no other `siteContent` copy. Update the stale JA expectation in
`site-content-ja-services.test.ts` to the exact approved JA title.

## Exact insights archive records

For `id: 'inheritance-custody'`, preserve the existing canonicalized href
behavior, category, and date/read-time fields, but use:

### KO

- title: `대만 상속과 친권: 남은 가족을 위한 법률 안내`
- summary:
  `대만의 상속순위, 배우자 재산청구, 친권상 권리·의무와 미성년자 재산보호를 익명 사례 없이 설명합니다.`
- image:
  `/images/016-taiwan-inheritance-custody-analysis/featured-generic.webp`
- keywords: `['상속', '친권', '미성년자 재산']`
- href:
  `/ko/insights/taiwan-inheritance-custody-analysis`

### ZH-Hant

- title: `台灣繼承與親權：遺屬法律指南`
- summary:
  `說明台灣法下的繼承順位、配偶剩餘財產請求、親權權利義務及未成年人財產保護。`
- image:
  `/images/016-taiwan-inheritance-custody-analysis/featured-generic.webp`
- keywords: `['繼承', '親權', '未成年人財產']`
- href:
  `/zh-hant/insights/taiwan-inheritance-custody-analysis`

### EN overlay

In `englishPostCopy['inheritance-custody']`, use:

- title:
  `Taiwan Inheritance and Parental Rights: A Guide for Surviving Families`
- summary:
  `A guide to Taiwan succession, spousal residual-property claims, parental rights and duties, and protection of a minor’s property.`
- keywords: `['inheritance', 'parental rights', 'minor property']`

The EN record inherits the corrected generic image and produces
`/en/insights/taiwan-inheritance-custody-analysis` from the KO base record.

## Japanese permanent redirect parity

Change the `next.config.mjs` locale list from KO/ZH-Hant/EN to exactly:

```js
const locales = ['ko', 'zh-hant', 'en', 'ja'];
```

This must generate permanent redirects for both:

- `/ja/columns/inheritance-custody`
  → `/ja/columns/taiwan-inheritance-custody-analysis`
- `/ja/insights/inheritance-custody`
  → `/ja/columns/taiwan-inheritance-custody-analysis`

Preserve every existing alias and redirect for KO/ZH-Hant/EN. Do not alter the
runtime route or loader alias.

## New regression test

`column-016-public-reference-sync.test.ts` must:

1. collect the related-column record for the canonical slug from all four
   `siteContent` locales and assert the exact four titles;
2. assert KO, ZH-Hant, and EN `insightsArchive` records have the exact title,
   summary, generic image, keywords, and canonicalized search href;
3. call `getSearchIndex()` for KO, ZH-Hant, and EN and assert that the
   `insight-post-inheritance-custody` result has the exact localized title,
   exact summary, and canonical `/columns/taiwan-inheritance-custody-analysis`
   href;
4. read or import `next.config.mjs`, execute `redirects()`, and assert the two
   exact Japanese redirects above are present with `permanent: true`;
5. assert equivalent KO/ZH-Hant/EN alias redirects remain;
6. serialize the three owned runtime files (`site-content.ts`,
   `insights-archive.ts`, and `next.config.mjs`) and forbid all former public
   reference strings:
   - `유산·친권 이슈 분석`
   - `구준엽 씨와 서희원씨 간 유산·친권 이슈 분석`
   - `遺產與親權分析`
   - `遺產與親權議題案例分析`
   - `Inheritance & Custody Analysis`
   - `Inheritance and Custody Issue Analysis`
   - `具俊曄氏と徐熙媛氏の遺産・親権問題の分析`
   - `featured-01.jpg` only when it occurs in the 016 archive record
7. assert no named-person or SBS variant occurs in the synchronized records.

Do not require removal of unrelated 016 legacy data from `blog-posts.ts`,
builder presets, or embeddings; those are outside this unit.

## Writer verification

```bash
npx vitest run \
  src/data/__tests__/column-016-public-reference-sync.test.ts \
  src/data/__tests__/site-content-ja-services.test.ts \
  'src/app/[locale]/services/[slug]/__tests__/ja-family-page.test.tsx' \
  src/lib/__tests__/columns-ko-family-016.test.ts \
  src/lib/__tests__/columns-zh-family-016.test.ts \
  src/lib/__tests__/columns-en-family-016.test.ts \
  src/lib/__tests__/columns-ja-family-016.test.ts
npm run -s typecheck
npx eslint \
  src/data/__tests__/column-016-public-reference-sync.test.ts \
  src/data/__tests__/site-content-ja-services.test.ts
git diff --check -- \
  src/data/site-content.ts \
  src/data/insights-archive.ts \
  next.config.mjs \
  src/data/__tests__/site-content-ja-services.test.ts \
  src/data/__tests__/column-016-public-reference-sync.test.ts
```

Report exact test files/counts, typecheck, ESLint, and diff-check. Do not stage
or commit.

## Manager browser QA

At desktop and mobile, verify the exact related title and link on:

- `/ko/services/family`
- `/zh-hant/services/family`
- `/en/services/family`
- `/ja/services/family`

Verify the canonical column title at each locale’s
`/columns/taiwan-inheritance-custody-analysis` route.

Request both Japanese alias URLs and confirm permanent redirect behavior reaches
the canonical JA column URL. Check no former person/media title or old 016 image
is rendered, no horizontal overflow, and no console/page error.

After all gates pass, only the manager commits the five owned files plus this
work order. No push or deployment.
