# WO-I18N-COL012-PUBLIC-SYNC

## Goal

After all four column 012 articles have passed, synchronize only the public
references that still expose shortened or stale overtaking-accident copy:
four-locale civil-service related cards, the KO/ZH-Hant/EN insights archive,
and the public search href. Keep consultation embeddings in a later,
independent unit.

## Accepted article titles

```ts
{
  ko: '대만 추월 사고의 책임은 어떻게 판단하나요?',
  'zh-hant': '台灣超車事故的責任如何判斷？',
  en: 'Who Is Liable in an Overtaking Accident?',
  ja: '台湾の追い越し事故、責任はどう判断されるか',
}
```

Accepted article slug:
`taiwan-overtaking-accident-liability`

Existing archive/loader alias:
`overtaking-accident`

## Allowed files

- `src/data/site-content.ts`
- `src/data/insights-archive.ts`
- `src/lib/search.ts`
- new `src/data/__tests__/column-012-public-reference-sync.test.ts`

No other file may be edited by the implementation worker.

In particular, do not edit the four accepted articles,
`src/data/blog-posts.ts`, `src/data/service-details.ts`, `next.config.mjs`,
shared loader/SEO/sitemap code, or `src/content/column-embeddings.json`.

## Four civil-service related cards

In `src/data/site-content.ts`, change only the title of the
`taiwan-overtaking-accident-liability` related column under the civil-service
item for each locale. Use the exact accepted title for that locale. Preserve
the slug and every other service field and related card.

## Exact KO archive record

Preserve the existing alias `id` and `href`, category, and image. Replace the
record with this exact object:

```ts
{
  id: 'overtaking-accident',
  title: '대만 추월 사고의 책임은 어떻게 판단하나요?',
  summary:
    '대만 도로교통안전규칙 제101조의 추월 금지 조건과 같은 차로에서의 추월 절차, 익명 사고 사례를 통한 과실 판단 요소를 결과 보장 없이 정리합니다.',
  href: '/ko/insights/overtaking-accident',
  category: 'legal',
  readTime: '4분 분량',
  image: '/images/012-taiwan-overtaking-accident-liability/featured-01.jpg',
  keywords: [
    '대만 추월 사고',
    '도로교통안전규칙 제101조',
    '교통사고 과실',
    '사고 감정',
  ],
}
```

## Exact ZH-Hant archive record

```ts
{
  id: 'overtaking-accident',
  title: '台灣超車事故的責任如何判斷？',
  summary:
    '整理台灣《道路交通安全規則》第101條的禁止超車條件、同車道程序及匿名事故案例的責任判斷因素，不保證個案結果。',
  href: '/zh-hant/insights/overtaking-accident',
  category: 'legal',
  readTime: '3分鐘閱讀',
  image: '/images/012-taiwan-overtaking-accident-liability/featured-01.jpg',
  keywords: [
    '台灣超車事故',
    '道路交通安全規則第101條',
    '交通事故過失',
    '事故鑑定',
  ],
}
```

## Exact EN archive override and final record

Update only `englishPostCopy['overtaking-accident']` to:

```ts
{
  title: 'Who Is Liable in an Overtaking Accident?',
  summary:
    "A guide to Article 101's overtaking prohibitions and same-lane procedure, plus the fact-specific factors used to assess fault in an anonymized Taiwan collision, without guaranteeing an outcome.",
  readTime: '4 min read',
  keywords: [
    'Taiwan overtaking accident',
    'Road Traffic Safety Regulations Article 101',
    'traffic accident fault',
    'accident appraisal',
  ],
}
```

The generated final English archive record must preserve:

```ts
{
  id: 'overtaking-accident',
  href: '/en/insights/overtaking-accident',
  category: 'legal',
  image: '/images/012-taiwan-overtaking-accident-liability/featured-01.jpg',
}
```

and use the exact override title, summary, read time, and keywords.

## Search canonicalization

The three archive records intentionally keep their public insights alias href.
When `getSearchIndex` converts `id: 'overtaking-accident'`, however, the search
result href must be the canonical column route:

```ts
`/${locale}/columns/taiwan-overtaking-accident-liability`
```

Preserve the existing `divorce-qna` canonicalization and every other archive
href transformation. A narrow alias-id-to-canonical-slug mapping is acceptable;
do not change unrelated search behavior.

## Independent regression test

The new
`src/data/__tests__/column-012-public-reference-sync.test.ts` must record
expected values independently rather than deriving expectations from the
implementation strings. It must prove at least:

1. the four article frontmatter titles equal the four accepted titles;
2. the four civil-service related cards equal exact `{ slug, title }` objects;
3. the KO, ZH-Hant, and generated EN archive records equal the exact objects
   above;
4. no Japanese insights archive is created and no
   `/ja/insights/overtaking-accident` appears in `insightsArchive`;
5. search emits exact archive copy/tags and the canonical column href for KO,
   ZH-Hant, and EN;
6. `filterSearchIndex` finds the exact record for native queries
   `대만 추월 사고`, `台灣 超車`, and `Taiwan overtaking`;
7. the canonical and `overtaking-accident` loaders resolve to the same accepted
   slug and title in all four locales;
8. `next.config.mjs` retains permanent column and insights redirects for the
   alias in all four locales;
9. sitemap output contains each four-locale canonical route exactly once with
   the same four language alternates and Korean x-default;
10. column metadata uses each accepted title, its canonical URL, and the four
    alternates;
11. article JSON-LD uses the accepted headline, canonical
    `mainEntityOfPage`, and `ko`, `zh-Hant`, `en`, or `ja` `inLanguage`;
12. the civil service area's `columnSlugs` still contains the canonical slug,
    without changing its key points or other service data;
13. stale public copy is absent from the three allowed data/search files and
    their public results:
    - `추월하다 사고 나면 누구 책임?`
    - `추월 사고 책임 분석`
    - `超車事故責任如何判斷`
    - `超車事故責任分析`
    - `Overtaking Accident Liability`
    - `追越し事故の責任`
    - exact former KO summary:
      `대만 추월 규칙과 사고 발생 시 과실·책임 판단 기준을 정리했습니다.`
    - exact former KO keywords:
      `['교통사고', '추월', '과실책임']`
    - exact former ZH-Hant summary:
      `整理台灣超車規則與事故責任判斷實務。`
    - exact former ZH-Hant keywords:
      `['交通事故', '超車', '過失責任']`
    - exact former EN summary:
      `Practical standards for overtaking rules and fault allocation in Taiwan traffic accidents.`
    - exact former EN keywords:
      `['traffic accident', 'overtaking', 'fault allocation']`;
14. archive post counts, IDs, home-featured IDs, and all non-target archive
    records remain unchanged, using the literal baselines below.

## Independent unchanged-archive baselines

The new test must freeze these values literally:

```ts
const expectedPostCount = 17;
const expectedOrderedPostIds = [
  'gym-injury-lawsuit',
  'cosmetics-market-entry',
  'company-advanced-2',
  'withdraw-capital',
  'logistics-business',
  'company-location',
  'company-advanced-1',
  'subsidiary-vs-branch',
  'company-basics',
  'inheritance-custody',
  'overtaking-accident',
  'severance-exception',
  'divorce-qna',
  'massage-law',
  'mandatory-employment',
  'labor-severance',
  'traffic-accident-procedure',
];
const expectedHomeFeaturedIds = [
  'gym-injury-lawsuit',
  'cosmetics-market-entry',
  'company-advanced-2',
];
const expectedOtherPostsSha256 = {
  ko: '8b7026cc91aafe732dbc3746619abef94f56319c940d4f084aa312640e48d112',
  'zh-hant':
    '0bf53f9c8b0d584ccf459e5188310f61a5e05191a50afba6a7b2fe417e241e67',
  en: '84ba6b5d10cb66e9e5006a9638baafb90cea3b35c51503ed6ef38385a58a38ed',
};
```

For each locale, hash
`JSON.stringify(archive.posts.filter(post => post.id !== 'overtaking-accident'))`
with SHA-256 and compare it to the literal locale baseline. Do not calculate
the expected hash from the current implementation during the test.

The test may use the established mocks for builder sitemap sources so its
results are deterministic.

## Manager verification gates

Run from the repository root:

```sh
npx vitest run src/data/__tests__/column-012-public-reference-sync.test.ts
npx vitest run src/lib/__tests__/columns-ko-traffic-012.test.ts src/lib/__tests__/columns-zh-traffic-012.test.ts src/lib/__tests__/columns-en-content.test.ts src/lib/__tests__/columns-ja-traffic-012.test.ts
npm run -s typecheck
npx eslint src/data/__tests__/column-012-public-reference-sync.test.ts src/lib/search.ts
git diff --check -- src/data/site-content.ts src/data/insights-archive.ts src/lib/search.ts src/data/__tests__/column-012-public-reference-sync.test.ts
```

After the implementation commit, Codex owns the clean production build and
browser checks for:

- four-locale civil-service related cards;
- KO/ZH-Hant/EN archive cards;
- KO/ZH-Hant/EN search results and canonical hrefs;
- four canonical articles and the existing aliases;
- desktop/mobile overflow and console/page/request errors.

## Embeddings are a separate unit

Do not edit or rebuild `src/content/column-embeddings.json` in this work order.
After public synchronization passes and is committed, the manager will rebuild
the KO/ZH-Hant/EN embeddings through the official local API, verify exact
column-012 titles/snippets and vector integrity, and commit that generated file
separately. Japanese is not part of the current consultation embedding schema.

## Non-goals

- No article rewrite.
- No change to the dormant legacy `src/data/blog-posts.ts`.
- No service-detail legal-copy rewrite.
- No new Japanese archive/search surface.
- No push, deployment, or production publication.
