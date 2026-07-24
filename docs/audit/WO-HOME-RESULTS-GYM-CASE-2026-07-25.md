# WO-HOME-RESULTS-GYM-CASE — Qualify the homepage case result

Date: 2026-07-25 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Correct the visible homepage `#results` feature so it accurately distinguishes
the TWD 1.57 million first-instance damages ruling from the later settlement
on appeal.

Remove `win`, `승소` and `勝訴` framing and add a concise past-results
qualification in KO, ZH-Hant, EN and JA. Keep the public component,
`siteContent.homeResults` and builder decomposition synchronized.

## Allowed files

1. `src/components/HomeCaseResultsSplit.tsx`
2. `src/data/site-content.ts`
3. `src/lib/builder/canvas/decompose-case-results.ts`
4. `src/components/__tests__/home-case-results-editorial.test.tsx`
5. `src/components/__tests__/home-case-results-factual-copy.test.tsx` (new)

No other file may be modified.

## Exact four-language contract

### Korean

```ts
{
  label: '사례 분석',
  title: '한국 유학생 헬스장 부상 사건\n1심 157만 TWD 판결·항소심 화해',
  description:
    '대만 헬스장에서 트레이너의 지도를 받아 운동하던 중 다친 한국인 대학생이 손해배상을 청구한 사건입니다. 1심에서 157만 TWD의 배상을 인정하는 판결이 내려졌고, 이후 항소심에서 당사자 간 화해로 종결되었습니다.',
  summary:
    '사건 결과는 구체적인 사실관계와 증거에 따라 달라질 수 있으며, 이 사례는 과거 한 사건의 진행 경과를 소개합니다.',
  cta: '소송사례 분석 보기',
}
```

### Traditional Chinese

```ts
{
  label: '案例解析',
  title: '韓國留學生健身房受傷案\n一審判賠157萬TWD，二審和解',
  description:
    '韓國大學生在台灣健身房接受教練指導運動時受傷，因而提起損害賠償請求。一審判決賠償157萬TWD，其後於二審由雙方和解結案。',
  summary:
    '案件結果會因具體事實與證據而異；本案例僅說明一件過往案件的處理經過。',
  cta: '查看訴訟案例',
}
```

### English

```ts
{
  label: 'CASE STUDY',
  title: 'Korean Student Gym Injury Case\nTWD 1.57M Ruling, Then Appeal Settlement',
  description:
    'A Korean university student sought damages after being injured while training under an instructor’s supervision at a Taiwan gym. The first-instance court issued a TWD 1.57 million damages ruling; the case later concluded through a settlement on appeal.',
  summary:
    'Outcomes depend on the specific facts and evidence; this case study describes the course of one past matter.',
  cta: 'View Case Studies',
}
```

### Japanese

```ts
{
  label: '事例紹介',
  title: '韓国人留学生のジム負傷事件\n一審157万TWD判決後、控訴審で和解',
  description:
    '台湾のジムでトレーナーの指導を受けて運動中に負傷した韓国人大学生が、損害賠償を請求した事例です。一審では157万TWDの損害賠償を認める判決が出され、その後、控訴審で当事者間の和解により終結しました。',
  summary:
    '結果は具体的な事実関係や証拠により異なります。本事例は、過去の一案件の経過を紹介するものです。',
  cta: '取扱事例を見る',
}
```

Apply the exact same contract to:

- `HomeCaseResultsSplit` (`cta` field);
- `siteContent[locale].homeResults` (`ctaLabel` field);
- builder `decompose-case-results` for its supported KO, ZH-Hant and EN
  builder locales (`cta` field).

Do not widen the builder-only `Locale` type to Japanese.

## Factual boundaries

- TWD 1.57 million is the amount of the first-instance damages ruling.
- The later disposition was a settlement on appeal. Do not state or infer a
  settlement amount.
- Do not describe the first-instance ruling as a current final win, victory or
  guaranteed result.
- Preserve the distinction between the first-instance ruling and later appeal
  settlement in the title and description.
- Preserve the past-matter qualification in the summary.
- Do not identify the client, add medical details, name the gym, or add a
  success rate, duration, fee or outcome promise.

## First-party sources

- Official attorney profile, which states first-instance success followed by
  settlement on appeal:
  `https://www.hoveringlaw.com.tw/zh/wei.html`
- First-party case article and cited public reporting for the TWD 1.57 million
  first-instance amount and later appeal settlement:
  `https://www.wei-wei-lawyer.com/post/taiwan-gym-injury-lawsuit`
- File-backed source:
  `src/content/columns/010-taiwan-gym-injury-lawsuit.md`

## Regression requirements

### New factual-copy test

Prove:

1. `siteContent.homeResults` matches the exact reviewed contract in all four
   locales, mapping `cta` to `ctaLabel`;
2. server-rendered `HomeCaseResultsSplit` matches the exact title,
   description, summary, CTA and localized `/columns` href for all four
   locales;
3. each rendered title and description contains the first-instance amount and
   the later appeal settlement as separate stages;
4. builder-decomposed KO, ZH-Hant and EN text/button nodes match their exact
   contract and no Japanese builder locale is introduced;
5. component, data and builder serialized copy excludes:
   - `승소`, `勝訴`, `First-Instance Win`, `win`, `victory`;
   - an appeal-settlement amount;
   - success rate, guarantee and same-result implications.

### Existing editorial test

Preserve every image, layout, path and CSS assertion. Strengthen the Korean
copy probes to require:

- `사례 분석`;
- `1심 157만 TWD 판결·항소심 화해`;
- `항소심에서 당사자 간 화해로 종결`;
- the past-results qualification;
- `/ko/columns`.

Explicitly reject `승소`.

## Forbidden scope

- Achievements carousel data/component
- Attorney summary or homepage stats
- Column body, attorney profile, service, FAQ, pricing, review or legal copy
- Layout, CSS, image, link target or component structure
- Builder locale widening or unrelated seed/layout changes
- Header, footer, flags, SEO, JSON-LD, asset or embedding changes
- Stage, commit, push, deploy or server operation by the worker

## Required automated gates

```bash
npx vitest run \
  src/components/__tests__/home-case-results-editorial.test.tsx \
  src/components/__tests__/home-case-results-factual-copy.test.tsx
npm run -s typecheck
npx eslint \
  src/components/HomeCaseResultsSplit.tsx \
  src/data/site-content.ts \
  src/lib/builder/canvas/decompose-case-results.ts \
  src/components/__tests__/home-case-results-editorial.test.tsx \
  src/components/__tests__/home-case-results-factual-copy.test.tsx
git diff --check
git status --short
```

Independent factual and four-language copy review are required before commit.
The manager owns four-language browser verification and the checkpoint commit.
