# WO-HOME-STATS-FACTS — Replace unsupported homepage counters

Date: 2026-07-25 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Replace the unsupported four-language homepage counters (`10+`, `500+`,
five offices and four languages) with four exact numeric facts supported by
the current official attorney and firm profiles.

This unit covers only the `#stats` section. The achievements carousel, case
result panel and attorney summary are separate reviewed units.

## Allowed files

1. `src/data/site-content.ts`
2. `src/components/__tests__/home-stats-ssr.test.tsx`
3. `src/lib/builder/canvas/__tests__/seed-home-zh-hant-parity.test.ts`
4. `src/data/__tests__/home-stats-factual-claims.test.ts` (new)

No other file may be modified.

## Exact four-language contract

Preserve each locale's existing `stats.label`. Replace only `stats.title`,
`stats.description`, `stats.highlightWords` and `stats.items` as follows.

### Korean

```ts
title: '공식 프로필로 확인하는 국제 업무 기반',
description:
  '대만 4개 사무소와 중국어·한국어·일본어 실무 대응, 7개 주요 업무 분야, TOPIK 6급·JLPT N1 자격을 기준으로 정리했습니다.',
highlightWords: [
  '대만 4개 사무소',
  '중국어',
  '한국어',
  '일본어',
  '7개 주요 업무 분야',
  'TOPIK 6급',
  'JLPT N1',
],
items: [
  { target: 4, label: '대만 사무소' },
  { target: 3, label: '실무 대응 언어' },
  { target: 7, label: '주요 업무 분야' },
  { target: 2, label: '최상위급 어학 자격' },
],
```

### Traditional Chinese

```ts
title: '從官方資料看跨境服務基礎',
description:
  '依官方律師簡介整理：4個台灣辦公據點、中文／韓文／日文3種業務溝通語言、7項主要執業領域，以及TOPIK 6級與JLPT N1兩項最高級別語言資格。',
highlightWords: [
  '4個台灣辦公據點',
  '中文',
  '韓文',
  '日文',
  '7項主要執業領域',
  'TOPIK 6級',
  'JLPT N1',
],
items: [
  { target: 4, label: '台灣辦公據點' },
  { target: 3, label: '業務溝通語言' },
  { target: 7, label: '主要執業領域' },
  { target: 2, label: '最高級別語言資格' },
],
```

### English

```ts
title: 'Cross-Border Practice at a Glance',
description:
  'Based on the official attorney profile: four Taiwan offices, three working languages—Chinese, Korean, and Japanese—seven principal practice areas, and two top-level language qualifications, TOPIK Level 6 and JLPT N1.',
highlightWords: [
  'four Taiwan offices',
  'three working languages',
  'Chinese',
  'Korean',
  'Japanese',
  'seven principal practice areas',
  'TOPIK Level 6',
  'JLPT N1',
],
items: [
  { target: 4, label: 'Taiwan Offices' },
  { target: 3, label: 'Working Languages' },
  { target: 7, label: 'Principal Practice Areas' },
  { target: 2, label: 'Top-Level Language Qualifications' },
],
```

### Japanese

```ts
title: '公式プロフィールで見る国際業務の基盤',
description:
  '公式弁護士プロフィールに基づき、台湾4拠点、中国語・韓国語・日本語の3言語、7つの主要取扱分野、TOPIK 6級・JLPT N1の2つの最上位級資格をまとめています。',
highlightWords: [
  '台湾4拠点',
  '中国語',
  '韓国語',
  '日本語',
  '7つの主要取扱分野',
  'TOPIK 6級',
  'JLPT N1',
],
items: [
  { target: 4, label: '台湾の事務所' },
  { target: 3, label: '業務対応言語' },
  { target: 7, label: '主要取扱分野' },
  { target: 2, label: '最上位級の語学資格' },
],
```

No counter has a `suffix`.

## Factual boundaries

- `4` means the four Taiwan offices named on the official profile: Taipei,
  Taichung, Kaohsiung and Pingtung. It must not imply that every worldwide or
  partner location has been counted.
- `3` means the attorney's working languages: Chinese, Korean and Japanese. It
  is not a claim about the website's number of locales.
- `7` means the seven principal practice categories listed on the official
  attorney profile. It is not a case count or outcome metric.
- `2` means the two top-level language qualifications explicitly named on the
  official profile: TOPIK Level 6 and JLPT N1. It is not a language count.
- Remove every `10+`, `500+`, five-office, four-language and `one-stop`
  statement from this stats record.
- Do not introduce a success rate, case count, response time, guarantee or
  unqualified global-office count.

## Official primary sources

- Official attorney profile, language qualifications and seven practice
  categories:
  `https://www.hoveringlaw.com.tw/zh/wei.html`
- The same profile's office list (Taipei, Taichung, Kaohsiung, Pingtung):
  `https://www.hoveringlaw.com.tw/zh/wei.html`
- Korean attorney profile:
  `https://www.wei-wei-lawyer.com/lawyertseng`

## Regression requirements

### New factual test

For every locale, prove:

1. exact title, description, highlight words and four ordered item objects;
2. targets are exactly `[4, 3, 7, 2]`, all suffixes are absent and labels are
   unique;
3. descriptions explicitly identify Taiwan offices, the three named working
   languages, seven practice areas, TOPIK 6 and JLPT N1;
4. serialized stats exclude:
   - `10+`, `500+`, `target: 10`, `target: 500`;
   - five offices / `5 Office Locations` / `5 辦公據點` / `5 オフィス`;
   - four languages / `4 Languages` / `4 語言` / `4 対応言語`;
   - `원스톱`, `一站式`, `one-stop`, `ワンストップ`;
   - outcome, success-rate and guarantee phrases.

### Existing SSR test

Update the exact SSR number expectation from `['10+', '500+', '5', '4']`
to `['4', '3', '7', '2']`. Change the locale fixture from the builder-only
`Locale` type and three locales to `SiteLocale`/`siteLocales`, so KO,
ZH-Hant, EN and JA are all exercised. The exact nonzero target assertion is
the SSR safety gate; do not add unrelated client-hydration behavior to this
unit.

### Existing builder parity test

Update the exact Traditional Chinese stats title to
`從官方資料看跨境服務基礎`, and update the exact values and labels to:

```text
4 — 台灣辦公據點
3 — 業務溝通語言
7 — 主要執業領域
2 — 最高級別語言資格
```

Preserve all layout, node-kind and responsive assertions.

## Forbidden scope

- Achievements carousel or case-result copy
- Attorney-summary `10+` copy
- Service, column, FAQ, pricing, review, contact or legal-page copy
- Stats component behavior, animation, layout, CSS or builder decomposition
- Header, footer, flags, SEO, JSON-LD, asset or embedding changes
- Stage, commit, push, deploy or server operation by the worker

## Required automated gates

```bash
npx vitest run \
  src/data/__tests__/home-stats-factual-claims.test.ts \
  src/components/__tests__/home-stats-ssr.test.tsx \
  src/lib/builder/canvas/__tests__/seed-home-zh-hant-parity.test.ts
npm run -s typecheck
npx eslint \
  src/data/site-content.ts \
  src/data/__tests__/home-stats-factual-claims.test.ts \
  src/components/__tests__/home-stats-ssr.test.tsx \
  src/lib/builder/canvas/__tests__/seed-home-zh-hant-parity.test.ts
git diff --check
git status --short
```

Independent factual and four-language copy review are required before commit.
The manager owns browser verification and the checkpoint commit.
