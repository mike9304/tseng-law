# WO-I18N-JA-SERVICE-CIVIL — Approve Japanese civil-service content

Date: 2026-07-25 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Add a fact-checked, natural Japanese `civil` record to
`src/data/service-details-ja.ts`.

This work approves data only. It does not publish `/ja/services/civil`; route,
language-switch and sitemap changes belong to the next separately reviewed
work unit.

## Allowed files

1. `src/data/service-details-ja.ts`
2. `src/data/__tests__/service-details-ja-investment.test.ts`
3. `src/data/__tests__/service-details-ja-civil.test.ts` (new)

No other file may be modified.

## Exact Japanese contract

Add this exact `civil` entry after `investment`:

```ts
civil: {
  title: '台湾の民事訴訟・損害賠償',
  subtitle: '契約紛争、損害賠償、消費者トラブルなど、台湾の民事案件を日本語で支援',
  intro:
    '昊鼎国際法律事務所は、台湾における契約紛争、損害賠償、消費者トラブルなどの民事案件について、事実関係の整理、交渉、訴訟対応まで日本語で支援します。請求できる損害の範囲や手続期限は事案ごとに異なるため、初動での証拠確保と法的見通しの確認が重要です。',
  keyPoints: [
    '民法上の不法行為では、故意または過失による違法な権利侵害、損害および因果関係などが争点になります。損害項目としては、医療費、介護費、交通費、休業損害、逸失利益、慰謝料などが問題となり、請求の可否と範囲は受傷内容、治療経過および証拠によって異なります。',
    '交通事故では、現場写真・映像、相手方情報、診断書、領収書などを早期に保存することが重要です。台湾の「道路交通事故処理規則」（道路交通事故處理辦法）では、当事者または利害関係人は、警察機関に対し、事故発生日の7日後から現場図・現場写真の交付を、30日後から「道路交通事故初期分析判断表」（道路交通事故初步分析研判表）の交付を申請できます。同表は初期的な分析資料であり、責任の最終確定を直接意味するものではありません。',
    '消費者保護法に基づく訴訟では、事業者の故意による損害については損害額の5倍以下、重大な過失については3倍以下、過失については1倍以下の懲罰的損害賠償を請求できる場合があります。適用を受けるには、当該紛争に同法が適用されることなど、所定の要件を満たす必要があります。',
    '同一の事案について、刑事告訴と民事請求を併せて検討する場合もあります。ただし、告訴の可否と期間制限、民事請求の消滅時効、刑事付帯民事訴訟（刑事附帶民事訴訟）の利用可否および費用負担は、請求原因と手続段階に応じて個別に確認する必要があります。',
    '示談・和解は、当事者が互いに譲歩し、紛争を終結させ、またはその発生を防止するための契約です。署名前に、対象となる請求、権利放棄の範囲、支払条件および違反時の対応を確認し、治療継続中の傷害については、将来発生し得る損害も検討する必要があります。',
  ],
},
```

## Factual boundaries

- Do not state or imply that the firm obtained a TWD 1.57M result in this
  service summary. That public case may be handled separately with its source
  and first-instance/settlement context.
- Do not reproduce the old four-stage accident-liability sequence or call an
  initial police analysis a final determination.
- Do not say every criminal complaint has a six-month limit.
- Do not say criminal-attached civil litigation always waives all costs or is
  always available.
- Do not add fixed civil limitation periods; they depend on the cause of
  action and facts.
- Do not import labor, divorce, custody, inheritance, minimum-wage or
  minimum-service-period rules into the civil detail.
- Do not promise an outcome, response time, or exact fee.

## Official sources

- Taiwan Civil Code Article 184:
  `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=184&pcode=B0000001`
- Taiwan Civil Code Article 736:
  `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=736&pcode=B0000001`
- Consumer Protection Act Article 7:
  `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=7&pcode=J0170001`
- Consumer Protection Act Article 51:
  `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=51&pcode=J0170001`
- National Police Agency accident-document FAQ:
  `https://www.npa.gov.tw/ch/app/faq/view?id=2144&module=faq&serno=A1084129`
- National Police Agency accident-document application:
  `https://tm2.npa.gov.tw/NM105-505ClientRWD2/TM01A01Q_01.jsp?level=1&node=36`

## Investment regression

Update the existing investment test only as required to reflect the approved
second record:

- `Object.keys(japaneseServiceDetails)` becomes exactly
  `['investment', 'civil']`.
- `civil` is removed from the list expected to return `undefined`.
- All exact investment copy, eight points, legal probes, column relationships
  and forbidden-regression assertions remain byte-for-byte unchanged.
- `family`, `labor`, `criminal`, `ip`, unknown and prototype-like keys remain
  undefined.

## Civil regression test

Create `src/data/__tests__/service-details-ja-civil.test.ts` and prove:

1. `getJapaneseServiceDetail('civil')` equals the exact title, subtitle, intro
   and ordered five points above.
2. The record has exactly five substantial Japanese points, no Hangul and no
   English/Korean fallback body.
3. It contains these required distinctions:
   - `故意または過失による違法な権利侵害`
   - `損害および因果関係`
   - `7日後`, `30日後`, `初步分析研判表`
   - `責任の最終確定を直接意味するものではありません`
   - `5倍以下`, `3倍以下`, `1倍以下`
   - `当該紛争に同法が適用されること`, `所定の要件`
   - `請求原因と手続段階に応じて個別に確認`
   - `刑事付帯民事訴訟（刑事附帶民事訴訟）`
   - `当事者が互いに譲歩し、紛争を終結`
   - `権利放棄の範囲`
   - `治療継続中`
4. It excludes:
   - `157万`, `1.57M`
   - `4段階`, `実質的な最終判断`
   - `刑事告訴期限は6か月`, `告訴期限は6か月`
   - `裁判費用を支払う必要がありません`, `裁判費用は免除`
   - `必ず請求できます`, `必ず勝訴`, `保証します`
   - labor/family anchors such as `最低勤務期間`,
     `残余財産差額分配請求`, `親権`, `相続`
   - `曾俊瑋`, `법무법인 호정`, Hangul and representative English copy
5. `getJapaneseServiceDetail()` remains prototype-safe for `__proto__` and
   `constructor`.

## Forbidden scope

- Route, language switcher, sitemap or visible service-list changes
- Investment-copy edits
- KO, ZH-Hant or EN service-copy edits
- Column, attorney, FAQ, SEO, builder, asset or embedding edits
- stage, commit, push, deploy or server operation by the worker

## Required gates

```bash
npx vitest run \
  src/data/__tests__/service-details-ja-investment.test.ts \
  src/data/__tests__/service-details-ja-civil.test.ts
npm run -s typecheck
npx eslint \
  src/data/service-details-ja.ts \
  src/data/__tests__/service-details-ja-investment.test.ts \
  src/data/__tests__/service-details-ja-civil.test.ts
git diff --check
git status --short
```

Independent factual and Japanese editorial review are required before the
manager commits this content unit. Browser verification is deferred until the
separate civil-route publication WO.
