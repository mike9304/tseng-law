# WO-I18N-JA-COL012-OVERTAKING

## Goal

Rewrite Japanese column 012 as natural, restrained legal information for
Japanese readers in Taiwan. The page must explain the current requirements of
Road Traffic Safety Regulations Article 101, distinguish prohibited-overtaking
conditions from the same-lane signaling and yielding procedure, and present the
firm's accident account as an anonymized, fact-specific appraisal result.

## Evidence and accepted baselines

- Current Japanese source:
  `src/content/columns-ja/012-taiwan-overtaking-accident-liability.md`
- Accepted English sibling:
  `src/content/columns-en/012-taiwan-overtaking-accident-liability.md`
- Accepted Traditional Chinese sibling:
  `src/content/columns-zh/012-taiwan-overtaking-accident-liability.md`
- Current official consolidated regulations:
  `https://laws.gov.taipei/Law/LawSearch/LawArticleContent/FL012455`
  - the consolidated entry was revised on June 26, 2026;
  - Article 101 is the controlling source for the propositions below.
- The Gonews article at `https://gonews.com.tw/car/daily/21934/` may remain
  only as clearly labeled supplementary material.

The sibling pages are structural and factual baselines, not permission to copy
their syntax mechanically. The Japanese article must read as native
professional Japanese.

## Allowed files

- `src/content/columns-ja/012-taiwan-overtaking-accident-liability.md`
- new `src/lib/__tests__/columns-ja-traffic-012.test.ts`

No other file may be edited by the implementation worker.

## Exact frontmatter

Use these values exactly, except that `read_time` must be calculated after the
final body is complete:

```yaml
title: "台湾の追い越し事故、責任はどう判断されるか"
url: "https://www.wei-wei-lawyer.com/post/taiwan-overtaking-accident-liability"
lastmod: "2026-07-26"
date_display: "2025年9月13日"
read_time: "約N分"
categories:
  - "台湾法律情報"
featured_image: "../images/012-taiwan-overtaking-accident-liability/featured-01.jpg"
```

Use the same exact title for the single H1.

## Exact structure and fixed strings

Use exactly three H2 headings, in this order:

1. `道路交通安全規則第101条が定める追い越しの要件`
2. `当事務所が扱った匿名の事故事例`
3. `追い越し事故の責任を判断するときに確認すべき点`

Use these exact image blocks:

```md
![台湾での追い越し事故の責任判断と安全な追い越し手順を説明する画像](../images/012-taiwan-overtaking-accident-liability/featured-01.jpg)
![山道でオートバイと前方2台の自動車が関与した追い越し衝突の模式図](../images/012-taiwan-overtaking-accident-liability/img-01.jpg)
```

The incident diagram must appear inside the anonymized-case section. Remove
every `img-02.jpg` reference and every claim that a Korean-language image was
translated.

Use exactly one official-law link:

```md
[台湾の「道路交通安全規則」第101条](https://laws.gov.taipei/Law/LawSearch/LawArticleContent/FL012455)
```

Use exactly one supplementary link:

```md
[追い越し法規と手順の図解](https://gonews.com.tw/car/daily/21934/)
```

State next to it, in natural Japanese, that it is a secondary source and the
current official regulation takes priority when confirming legal requirements.

End the article with this exact related-link block followed by the exact
disclaimer:

```md
> 関連リンク:
> - [台湾訴訟弁護士ガイド](/ja/taiwan-litigation-lawyer)
> - [韓国語対応の台湾弁護士](/ja/korean-lawyer-in-taiwan)
> - [台湾交通事故の処理手続](/ja/columns/taiwan-traffic-accident-procedure)

本稿は、台湾の追い越し規則および追い越し事故後の責任判断に関する一般的な法律情報であり、個別事案に対する法律意見や結果の保証ではありません。実際の過失・責任は、事故地点、車両の動き、速度、合図、証拠、鑑定結果および現行法規により異なり得るため、具体的な事案は関連資料に照らして個別に検討する必要があります。
```

No visible content may follow the disclaimer.

## Required Article 101 content

Explain all of the following in accurate, natural Japanese:

1. Overtaking is prohibited on road sections marked for bends, steep slopes,
   narrow bridges, tunnels, or intersections, and at railroad crossings or
   roadwork sections.
2. Overtaking is also prohibited at school or hospital signs, at other
   no-overtaking signs or markings, when an oncoming vehicle is approaching,
   or when two or more vehicles are traveling continuously ahead.
3. Before passing a vehicle in the same lane, the following vehicle must sound
   two short horn signals or flash the headlights once.
4. The driver must not repeatedly sound the horn or flash the headlights to
   force the vehicle ahead to yield.
5. Passing may begin only after the vehicle ahead slows and moves aside, or
   indicates yielding by a hand signal or right turn signal.
6. The passing vehicle signals left, passes on the left while keeping at least
   0.5 meters from the vehicle ahead, establishes a safe distance, signals
   right, and returns to its original path of travel.
7. This same-lane signaling and yielding sequence never authorizes overtaking
   where another Article 101 prohibition applies.

Do not reduce the rule to universal `前車の同意`, and do not substitute
general slogans about right-side passing or double yellow lines for the
Article 101 requirements.

## Required anonymized-case content

Preserve only the accepted case skeleton:

- motorcyclist A carried passenger B on a mountain road;
- two passenger cars were traveling ahead, with Vehicle 1 moving slowly;
- A attempted to pass both vehicles, entered the oncoming lane, and
  accelerated;
- Vehicle 2 also prepared to pass Vehicle 1 and entered the oncoming lane less
  than one second after activating its turn signal;
- the motorcycle lacked adequate braking margin and collided with Vehicle 2;
- B suffered a severe head injury and died at the scene; A lost consciousness
  and was taken to a hospital;
- A's and B's families initially believed Vehicle 2's rapid lane movement was
  the main cause;
- the matter proceeded to litigation and multiple accident appraisals;
- those appraisals identified A as the primary causal party in that matter.

State explicitly that the appraisal result was limited to that matter and was
based on the circumstances considered together: attempting to pass two
vehicles traveling in line, entering the oncoming lane, insufficient braking
margin at the chosen speed, omission of the prescribed signal, Vehicle 2's
movement, road/lane layout, and other evidence.

State explicitly that one omitted signal does not always determine fault and
that compliance with Article 101 neither guarantees accident avoidance nor
predetermines a later appraisal or litigation outcome.

## Prohibited legacy content

Remove and regression-test the absence of:

- the triple-question-mark title and clickbait expressions;
- first-person `先日私が扱った事件`;
- `前の車の同意` as a universal legal rule;
- claims about A's insurance, financial loss, residual disability, permanent
  emotional torment, or guaranteed avoidance of excessive liability;
- the untranslated Traditional Chinese Gonews link label;
- Korean-image translation claims and `img-02.jpg`;
- `/ko/`, `/zh-hant/`, or `/en/` internal routes;
- U+200B, U+FEFF, U+00A0, Hangul, or work-in-progress markers.

## Japanese length and read-time rule

The completed article must contain at least 1,500 visible Japanese script
characters and at least 600 visible kana characters, without repetition used
only to inflate length.

The dedicated test must extract public text using the established Japanese
column convention:

```ts
function extractPublicText(content: string) {
  return content
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^---$/gm, '')
    .replace(/[「」『』“”‘’*_`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
```

Count Han, Hiragana, and Katakana characters with Unicode script properties,
count kana separately, and calculate:

```ts
const calculatedMinutes = Math.ceil(visibleJapaneseCount / 500);
```

After writing, freeze the exact visible-Japanese count, exact kana count, exact
`read_time`, and the source SHA-256 in the dedicated test.

## Dedicated regression requirements

The new test must prove:

1. exact frontmatter, single H1, three exact H2s, and exact final disclaimer;
2. exact official and supplementary links once each;
3. exact image blocks and removal of `img-02.jpg`;
4. all seven Article 101 proposition groups in raw and loaded public content;
5. the accepted anonymized case facts, multi-factor appraisal attribution,
   case-specific limitation, and non-guarantee language;
6. exact three Japanese internal links once each and no other-locale route;
7. absence of all prohibited legacy claims, Hangul, invisible characters, and
   WIP markers;
8. exact visible-Japanese count, kana count, calculated reading time, and
   source SHA-256;
9. canonical and `overtaking-accident` alias loaders resolve to the identical
   accepted Japanese article, title, metadata, category, and featured image.

## Verification gates

Manager-run from the repository root:

```sh
npx vitest run src/lib/__tests__/columns-ja-traffic-012.test.ts
npm run -s typecheck
npx eslint src/lib/__tests__/columns-ja-traffic-012.test.ts
git diff --check -- src/content/columns-ja/012-taiwan-overtaking-accident-liability.md src/lib/__tests__/columns-ja-traffic-012.test.ts
```

Manager-owned browser verification at desktop 1440×1000 and mobile 390×844:

- `/ja/columns/taiwan-overtaking-accident-liability` returns HTTP 200 with
  `lang="ja"`, the exact H1, canonical link, H2s, law/case/disclaimer text, and
  five accepted links;
- the `overtaking-accident` legacy alias resolves to the same accepted article;
- no visible Hangul, Traditional Chinese legacy label, Korean-image claim, or
  cross-locale internal route;
- no horizontal overflow, console error, uncaught page error, or actionable
  failed request.

## Non-goals

- No other locale, article, public surface, embedding, dependency, or
  configuration change.
- No claim about a specific appraisal report not present in the repository.
- No worker staging, commit, push, deployment, or server management.
