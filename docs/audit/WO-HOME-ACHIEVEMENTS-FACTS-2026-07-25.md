# WO-HOME-ACHIEVEMENTS-FACTS — Correct dormant achievement records

Date: 2026-07-25 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Correct the six ordered `siteContent[locale].achievements.items` records in
KO, ZH-Hant, EN and JA so every amount is attached to the matter described by
the official attorney profile.

This is a data-only integrity unit. `AchievementsCarousel` is not mounted on
the current public homepage, so this work must not integrate, redesign or
publish that dormant component. The visible homepage case-result panel was
corrected separately.

## Allowed files

1. `src/data/site-content.ts`
2. `src/data/__tests__/home-achievements-factual-claims.test.ts` (new)

No other file may be modified.

## Exact four-language contract

Preserve each locale's existing achievements `label` and `title`. Preserve
each ordered item's current `image` and localized `href`. Replace only
`title`, `amount`, `summary` and `tag` with the following exact values.

### Korean

```ts
[
  {
    title: '헬스장 부상 손해배상',
    amount: '1심 157만 TWD',
    summary: '1심에서 157만 TWD 배상 판결 후 항소심에서 화해로 종결된 사례.',
    tag: '민사',
  },
  {
    title: '의료분쟁 손해배상',
    amount: '300만 TWD',
    summary: '의료분쟁 피해자 가족이 대학병원으로부터 300만 TWD 손해배상을 받은 사례.',
    tag: '의료',
  },
  {
    title: '마이너스 유가 선물 분쟁',
    amount: '수백만 TWD',
    summary: '2020년 마이너스 유가 선물 사건에서 여러 투자자가 수백만 TWD 규모의 보상을 받은 사례.',
    tag: '금융',
  },
  {
    title: '교통사고 손해배상',
    amount: '290만 TWD',
    summary: '교통사고 피해자가 290만 TWD 손해배상을 받은 사례.',
    tag: '교통사고',
  },
  {
    title: '부부 잔여재산 분배',
    amount: '600만 TWD',
    summary: '일본인 배우자가 전 배우자로부터 600만 TWD의 부부 잔여재산 분배금을 받은 사례.',
    tag: '가사',
  },
  {
    title: '제3자 상대 위자료',
    amount: '30만 TWD',
    summary: '일본인 배우자가 제3자로부터 30만 TWD의 위자료를 받은 사례.',
    tag: '가사',
  },
]
```

### Traditional Chinese

```ts
[
  {
    title: '健身房受傷求償',
    amount: '一審157萬 TWD',
    summary: '一審判賠157萬 TWD，其後於二審和解結案。',
    tag: '民事',
  },
  {
    title: '醫療糾紛求償',
    amount: '300萬 TWD',
    summary: '醫療糾紛被害家屬獲大學醫院賠償300萬 TWD。',
    tag: '醫療',
  },
  {
    title: '負油價期貨爭議',
    amount: '數百萬 TWD',
    summary: '2020年負油價期貨事件中，多名投資人取得數百萬 TWD補償。',
    tag: '金融',
  },
  {
    title: '交通事故求償',
    amount: '290萬 TWD',
    summary: '交通事故被害人取得290萬 TWD損害賠償。',
    tag: '交通',
  },
  {
    title: '夫妻剩餘財產分配',
    amount: '600萬 TWD',
    summary: '日本籍配偶自前配偶取得600萬 TWD夫妻剩餘財產分配。',
    tag: '家事',
  },
  {
    title: '對第三人慰撫金請求',
    amount: '30萬 TWD',
    summary: '日本籍配偶向第三人取得30萬 TWD慰撫金。',
    tag: '家事',
  },
]
```

### English

```ts
[
  {
    title: 'Gym Injury Damages',
    amount: 'TWD 1.57M · First Instance',
    summary: 'A TWD 1.57M damages ruling was issued at first instance; the matter later settled on appeal.',
    tag: 'Civil',
  },
  {
    title: 'Medical Dispute Damages',
    amount: 'TWD 3M',
    summary: 'A victim’s family received TWD 3M in damages from a university hospital.',
    tag: 'Medical',
  },
  {
    title: 'Negative-Price Oil Futures',
    amount: 'Multi-Million TWD',
    summary: 'Multiple investors received multi-million-TWD compensation in the 2020 negative-price oil futures matter.',
    tag: 'Finance',
  },
  {
    title: 'Traffic Accident Damages',
    amount: 'TWD 2.9M',
    summary: 'A traffic accident victim received TWD 2.9M in damages.',
    tag: 'Traffic',
  },
  {
    title: 'Marital Residual-Property Distribution',
    amount: 'TWD 6M',
    summary: 'A Japanese spouse received TWD 6M in marital residual-property distribution from a former spouse.',
    tag: 'Family',
  },
  {
    title: 'Third-Party Non-Pecuniary Damages',
    amount: 'TWD 0.3M',
    summary: 'A Japanese spouse received TWD 0.3M in non-pecuniary damages from a third party.',
    tag: 'Family',
  },
]
```

### Japanese

```ts
[
  {
    title: 'ジム負傷の損害賠償',
    amount: '一審157万TWD',
    summary: '一審で157万TWDの損害賠償を認める判決後、控訴審で和解により終結した事例。',
    tag: '民事',
  },
  {
    title: '医療紛争の損害賠償',
    amount: '300万TWD',
    summary: '医療紛争の被害者家族が大学病院から300万TWDの損害賠償を受けた事例。',
    tag: '医療',
  },
  {
    title: '原油先物価格マイナス事件',
    amount: '数百万TWD',
    summary: '2020年の原油先物価格マイナス事件で、複数の投資家が数百万TWDの補償を受けた事例。',
    tag: '金融',
  },
  {
    title: '交通事故の損害賠償',
    amount: '290万TWD',
    summary: '交通事故の被害者が290万TWDの損害賠償を受けた事例。',
    tag: '交通事故',
  },
  {
    title: '夫婦残余財産の分配',
    amount: '600万TWD',
    summary: '日本人配偶者が元配偶者から600万TWDの夫婦残余財産分配を受けた事例。',
    tag: '家事',
  },
  {
    title: '第三者への慰謝料請求',
    amount: '30万TWD',
    summary: '日本人配偶者が第三者から30万TWDの慰謝料を受けた事例。',
    tag: '家事',
  },
]
```

## Factual boundaries

- Card 1: TWD 1.57 million is the first-instance damages ruling. The later
  disposition was settlement on appeal. Do not state or imply a settlement
  amount.
- Card 2: the official profile says the victim's family obtained TWD 3
  million in damages from a university hospital. Do not add a judgment stage.
- Card 3: the official profile identifies the 2020 negative-price oil futures
  matter, multiple investors and multi-million-TWD compensation.
- Card 4: TWD 2.9 million belongs to a traffic-accident victim, not medical
  malpractice.
- Card 5: TWD 6 million belongs to marital residual-property distribution
  obtained by a Japanese spouse from a former spouse.
- Card 6: TWD 0.3 million belongs to consolation/non-pecuniary damages
  obtained by a Japanese spouse from a third party, not a cosmetics dispute.
- All six are descriptions of past matters listed on the official attorney
  profile. Do not add client identities, court names, case numbers, dates
  beyond 2020 for card 3, success rates, guarantees or predicted outcomes.
- Do not use `win`, `victory`, `승소` or `勝訴`.

## First-party sources

- Official attorney profile and representative-matter list:
  `https://www.hoveringlaw.com.tw/zh/wei.html`
- First-party gym case article for the first-instance amount and later appeal
  settlement:
  `https://www.wei-wei-lawyer.com/post/taiwan-gym-injury-lawsuit`
- File-backed gym source:
  `src/content/columns/010-taiwan-gym-injury-lawsuit.md`

## Regression requirements

The new test must prove for all four locales:

1. exactly six ordered records match the reviewed `title`, `amount`,
   `summary` and `tag` contract;
2. the existing ordered images remain exactly
   `/images/feature-1.svg`, `/images/feature-2.svg`,
   `/images/feature-3.svg`, `/images/feature-2.svg`,
   `/images/feature-1.svg`, `/images/feature-3.svg`;
3. all hrefs remain the locale's `/columns` archive;
4. card 1 separately states the first-instance amount and later appeal
   settlement, and never states a settlement amount;
5. the TWD 2.9 million card is traffic-accident only;
6. the TWD 0.3 million card is third-party consolation/non-pecuniary damages
   only;
7. serialized records exclude old wrong mappings and prohibited framing:
   medical-malpractice/medical-negligence language on card 4,
   cosmetics/trade language on card 6, and `win`, `victory`, `승소`, `勝訴`,
   guarantee or success-rate phrases anywhere.

## Forbidden scope

- Mounting, editing or deleting `AchievementsCarousel`
- Visible homepage `HomeCaseResultsSplit`, attorney summary or stats
- Builder decomposition or builder locale widening
- Service, column, FAQ, pricing, review, contact or legal-page copy
- Layout, CSS, image assets, links, header, footer, flags, SEO, JSON-LD or
  embeddings
- Stage, commit, push, deploy or server operation by the worker

## Required automated gates

```bash
npx vitest run src/data/__tests__/home-achievements-factual-claims.test.ts
npm run -s typecheck
npx eslint \
  src/data/site-content.ts \
  src/data/__tests__/home-achievements-factual-claims.test.ts
git diff --check
git status --short
rg -n "AchievementsCarousel" src
```

Independent factual and four-language copy reviews are required before commit.
Because the component is dormant, browser verification is not applicable to
this data-only unit. The final `rg` command must return only the component's
own declaration in `src/components/AchievementsCarousel.tsx`, with no imports
or usages elsewhere.
