# WO-I18N-JA-SERVICE-IP — Approve Japanese IP and financial-disputes content

Date: 2026-07-25 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Add a current, primary-source-checked and professionally edited Japanese
`ip` record to `src/data/service-details-ja.ts`.

This unit approves data only. It does not publish `/ja/services/ip`. Route,
language-switch, related-column and sitemap changes belong to a later reviewed
unit.

## Allowed files

1. `src/data/service-details-ja.ts`
2. `src/data/__tests__/service-details-ja-investment.test.ts`
3. `src/data/__tests__/service-details-ja-ip.test.ts` (new)

No other file may be modified.

## Exact Japanese contract

Add this exact `ip` entry after `criminal`:

```ts
ip: {
  title: '台湾の知的財産・金融紛争',
  subtitle:
    '商標・特許・著作権の保護と、金融商品・投資契約をめぐる民事紛争への対応を日本語で支援',
  intro:
    '昊鼎国際法律事務所は、台湾における商標・特許・著作権の取得・管理および侵害対応、金融商品・投資契約をめぐる民事紛争について、日本語で支援します。対象となる権利・契約、当事者の立場、適用される制度および利用できる手続は案件ごとに異なるため、出願・取引・紛争の各段階で資料と証拠を確認し、対応方針を整理します。',
  keyPoints: [
    '台湾における商標権は登録によって発生し、原則として先願主義と属地主義が採用されています。韓国その他の国・地域で登録された商標も、その登録だけで台湾における商標権が生じるものではありません。台湾で使用を予定する名称・ロゴと指定商品・役務を整理し、先行商標の調査、出願する区分、使用時期および登録可能性を検討します。出願後は、台湾の経済部智慧財産局による方式・実体審査を経るため、補正や意見書が必要となる場合もあります。',
    '台湾商標法第69条に基づき、商標権者は侵害の停止・予防を請求でき、故意または過失による侵害について損害賠償を請求できる場合があります。侵害品等の廃棄請求や、同法第72条・第75条に基づく税関における輸出入の差止めには、それぞれ要件、担保、通知、期限その他の手続があります。警告書、行政手続、民事・刑事手続または税関措置のどれを用いるかは、登録範囲、使用態様、混同のおそれ、証拠および事業への影響を確認して判断し、差止めや損害賠償が当然に認められるものではありません。',
    '特許は商標・著作権とは別の制度です。台湾特許法第31条では、同一の発明について複数の特許出願がある場合、優先権に関する規定等を前提に、原則として最先の出願人のみが特許を受けることができます。公開・販売・共同開発の前に、発明者・出願人、権利帰属、先行技術、出願時期、優先権および秘密保持を確認し、侵害が疑われる場合には、特許請求の範囲、対象製品・方法、実施行為、特許の有効性および技術資料を個別に検討します。',
    '台湾著作権法第10条では、著作者は著作物の完成時に著作権を取得し、登録を権利発生の要件としていません。ただし、同法第10条の1により保護は表現に及び、基礎となる思想、手順、工程、システム、操作方法、概念、原理または発見には及びません。著作者・権利者、制作過程、契約上の帰属、利用許諾の範囲および原稿、制作データその他の資料を確認し、要件を満たす場合には、同法第84条の侵害停止・予防、第88条の損害賠償、または第90条の1の税関措置を検討します。',
    '金融商品・投資契約をめぐる紛争では、まず当事者と取引の性質を区別します。金融消費者保護法上の金融消費者と金融サービス事業者との間の、金融商品・サービスをめぐる民事紛争に該当する場合には、勧誘・広告、適合性の確認、重要事項とリスクの説明、契約内容および損害を確認し、原則として金融サービス事業者に対する苦情申立てを先に行ったうえで、要件と期限に応じて金融消費者紛争を扱う評議機関への評議申立てを検討します。一般の投資契約や事業者間取引はこの手続の対象外となる場合があるため、契約条項、資金の流れ、履行状況、損害、交渉・訴訟その他の手段を個別に整理します。',
  ],
},
```

## Factual boundaries

- Do not say a Korean or other foreign registration automatically protects a
  trademark in Taiwan. Preserve first-to-file, territoriality, Taiwan
  registration and examination.
- Do not say injunction, damages, destruction or customs suspension is
  automatic. Preserve the relevant conditions, intent/negligence limitation
  for damages, security and procedural requirements.
- Keep trademark, patent and copyright as separate systems.
- Preserve Patent Act Article 31's same-invention and priority qualifications;
  do not promise that the first filer always obtains a valid patent.
- Preserve that copyright arises on completion without registration, but
  protects expression rather than the underlying ideas, procedures, methods
  and related concepts.
- Do not characterize every investment or financial dispute as a Financial
  Consumer Protection Act or Financial Ombudsman Institution matter. Preserve
  the qualifying parties, civil-dispute scope, first complaint and potential
  exclusion of ordinary investment or business-to-business contracts.
- Do not add unsupported shareholder-control, result-guarantee, automatic
  registration, one-stop or outcome claims.

## Official primary sources

- TIPO, Basic Principles of the Trademark Act:
  `https://www.tipo.gov.tw/en/tipo2/392-2457.html`
- Trademark Act, especially Articles 2, 14, 19, 69, 72 and 75:
  `https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=J0070001`
- Patent Act, Article 31:
  `https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=J0070007`
- Copyright Act, especially Articles 10, 10-1, 84, 88 and 90-1:
  `https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=J0070017`
- Financial Consumer Protection Act, especially Articles 3–5, 8–11 and 13:
  `https://law.fsc.gov.tw/EngLawContent.aspx?id=1598&lan=E`

## Existing-record regression

Update the investment test only as required for the sixth approved record:

- `Object.keys(japaneseServiceDetails)` becomes exactly
  `['investment', 'civil', 'family', 'labor', 'criminal', 'ip']`.
- `ip` is removed from the undefined list.
- Investment, civil, family, labor and criminal content/tests remain untouched.
- Unknown and prototype-like keys remain undefined.

## IP regression test

Create `src/data/__tests__/service-details-ja-ip.test.ts` and prove:

1. exact title, subtitle, intro and ordered five points;
2. exactly five substantial Japanese points, no Hangul or representative
   English/Korean fallback;
3. required anchors:
   - `先願主義`, `属地主義`, no automatic Taiwan right from foreign
     registration, TIPO examination;
   - `台湾商標法第69条`, `第72条・第75条`, intent/negligence, security,
     deadlines and no automatic result;
   - `台湾特許法第31条`, same invention, priority and earliest application;
   - `台湾著作権法第10条`, `第10条の1`, completion, no registration
     requirement, expression/idea distinction, Articles 84, 88 and 90-1;
   - qualifying financial consumer/services enterprise/civil dispute,
     solicitation, suitability, risk disclosure, first complaint and possible
     exclusion of ordinary investment or B2B contracts;
4. forbidden automatic protection/remedy, every-financial-dispute,
   shareholder-control, one-stop, guarantee, fallback and wrong-identity copy;
5. prototype-safe `__proto__` and `constructor`.

## Forbidden scope

- Route, language switcher, sitemap, visible service list or related-column
  changes
- Editing prior approved Japanese service copy/tests
- KO, ZH-Hant or EN service-copy corrections
- Column, attorney, FAQ, pricing, review, SEO, builder, asset or embedding
  edits
- Stage, commit, push, deploy or server operation by worker

## Required gates

```bash
npx vitest run \
  src/data/__tests__/service-details-ja-investment.test.ts \
  src/data/__tests__/service-details-ja-civil.test.ts \
  src/data/__tests__/service-details-ja-family.test.ts \
  src/data/__tests__/service-details-ja-labor.test.ts \
  src/data/__tests__/service-details-ja-criminal.test.ts \
  src/data/__tests__/service-details-ja-ip.test.ts
npm run -s typecheck
npx eslint \
  src/data/service-details-ja.ts \
  src/data/__tests__/service-details-ja-investment.test.ts \
  src/data/__tests__/service-details-ja-ip.test.ts
git diff --check
git status --short
```

Independent factual and native-Japanese review are required before commit.
Browser QA is deferred to the separate IP-route publication unit.
