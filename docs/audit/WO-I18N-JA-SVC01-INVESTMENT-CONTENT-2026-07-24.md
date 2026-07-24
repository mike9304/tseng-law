# WO-I18N-JA-SVC01 — Japanese investment service-detail content

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Prepare the complete, fact-checked Japanese content record for the
`investment` service detail. Do not publish `/ja/services/investment` yet.
All six Japanese service records will be completed and independently reviewed
before the shared route/SEO/sitemap enablement pass.

## Allowed files

1. `src/data/service-details-ja.ts` (new)
2. `src/data/__tests__/service-details-ja-investment.test.ts` (new)

Do not edit any other file. Do not stage, commit, push, deploy, or operate the
development server.

## Data model

Create an isolated Japanese-detail source so partial preparation cannot affect
the currently published three-locale route:

- a six-slug literal union for:
  `investment | civil | family | labor | criminal | ip`;
- a Japanese content type containing only `title`, `subtitle`, `intro`, and
  `keyPoints`;
- a `Partial<Record<...>>` initially containing only `investment`;
- a safe lookup helper returning `undefined` for an absent/unknown slug.

Do not widen the builder `Locale`, mutate `serviceAreas`, or add routing in this
work order.

## Exact content contract

Title:

`台湾投資・会社設立`

Subtitle:

`韓国企業の台湾進出を、組織形態の選定から設立・許認可まで一貫支援`

Intro:

`昊鼎国際法律事務所は、韓国企業の台湾進出に際し、台湾子会社・台湾支店・代表者事務所等の組織形態の選定、必要に応じた経済部投資審議司への投資申請、投資資金の送金・投資額審定、会社・支店等の登記、銀行口座開設、営業場所の適法性確認および業種別許認可を支援します。`

Eight key points, in this exact order:

1. `外国企業の台湾進出拠点は、一般に、台湾子会社（有限公司または股份有限公司）、外国会社の台湾支店、代表者事務所に区分されます。子会社と支店は営利活動が可能ですが、代表者事務所は法律行為および連絡業務に限られます。法人格、責任、税務、投資・登記手続および政府調達への参加資格は、組織形態と個別の招標文書に応じて確認する必要があります。`
2. `台湾子会社の設立では、通常、会社名・営業項目の予備審査、投資許可、国外からの投資資金送金、投資額審定、会社設立登記および税籍登記を行い、必要に応じて輸出入、工場または業種別の許認可手続を追加します。手続数と所要期間は、組織形態、投資額、業種、審査内容、銀行対応および書類補正の有無により異なります。`
3. `外国投資事業の外国籍主管に関する就業許可では、華僑または外国人が保有する当該事業の株式または出資額の合計が、その株式総数または資本総額の3分の1を超える会社の経理人、外国会社の台湾支店の経理人、代表者事務所の代表者等が対象となります。このうち、会社または支店の雇用主が設立1年未満の場合は、実収資本額または台湾における運転資金50万新台湾ドル以上、売上高300万新台湾ドル以上、輸出入実績50万米ドル以上、または代理手数料20万米ドル以上のいずれかが原則です。設立1年以上の場合は、台湾における直近1年または直近3年平均について、売上高300万新台湾ドル以上、輸出入実績50万米ドル以上、または代理手数料20万米ドル以上のいずれかが原則です。代表者事務所は、設立1年以上であれば台湾における業務実績が必要です（設立1年未満は免除）。国内経済の発展に実質的な貢献がある場合または事情が特殊な場合には、特別認定の余地もあります。`
4. `投資許可後は、許可内容に従って国外から台湾へ投資資金を送金し、台湾側で投資額の審定を受けます。韓国における海外直接投資申告、送金名義、本人来店の要否、インターネットバンキングまたは代理手続の可否は、韓国法および利用する送金銀行の最新取扱いを個別に確認してください。`
5. `台北市で会社・商業（支店および分支機構を含む）の設立、所在地移転、または営業項目追加の登記を申請する場合は、「営業場所事前照会」システムにより、営業場所と営業項目が土地使用分区および建築管理規定に適合するか事前審査を受け、適合結果を登記申請に添付する必要があります。`
6. `2026年7月1日以降、工場登記を免除された製造場所で生産される固形手作り石けんを除き、一定規模の化粧品製造・輸入業者は、対象製品の供給・販売等の前に製品登録を完了し、PIF（化粧品製品情報ファイル）を作成・保存しなければなりません。PIF自体を登録する制度ではありません。虚偽・誇大な表示・宣伝・広告には4万～20万新台湾ドル、医療効能を標榜する場合には60万～500万新台湾ドルの過料が科され得ます。`
7. `最低資本額2,500万新台湾ドルおよび全新貨車20両以上という基準は、一般的な物流業全体ではなく、「自動車貨物運送業」を新規に籌設する場合の原則的な基準です。規定に適合する車両、停車場その他の設備も必要です。引越専業、金門・連江地域、個人小貨車貨運業等には別基準または例外があります。既存事業者の買収には投資・会社・運輸関係の許認可確認が必要であり、免許を有する事業者への配送委託は、自社が自動車貨物運送業を営むこととは区別されます。`
8. `会社を恒久的に終了する場合は、解散登記を行い、合併・分割・破産による解散を除き、清算手続を経る必要があります。会社法第9条の5年以下の有期刑等は、未払込の株金を払込済みと表示した場合、または払込後に会社責任者が株金を株主へ返還し、もしくは株主による回収を許した場合に適用されるものであり、通常の適法な会社資金の使用一般を指すものではありません。債務・税務を処理した後に分配されるのは「資本金」そのものではなく残余財産です。`

## Factual safeguards

Reject these stale or overbroad formulations:

- `投資審議委員会`, `投審会`;
- universal `10 steps`, fixed `3 months`;
- “single-shareholder minimum capital” as a universal work-permit rule;
- Korean-bank in-person/no-online/no-proxy claims stated as fact;
- PIF described as a registration;
- TWD 5M stated as every cosmetics-ad violation;
- TWD 25M/20 trucks generalized to all logistics;
- Company Act Article 9 generalized to any company-fund withdrawal;
- liquidation distribution described as return of capital rather than residual
  assets.

## Official source basis

- MOEA Department of Investment Review and Foreign Investment Act
- Invest Taiwan entity/process guidance
- Ministry of Labor Articles 38–39 and WDA guidance
- Taipei Business Premises Advance Inquiry
- TFDA PIF/product-registration guidance and MOHW advertising penalties
- MOTC motor-carrier establishment rules
- Taiwan Company Act Articles 9 and 24

The manager's fact-verification report is already available in the active
project record. Do not browse or replace it with secondary marketing sources.

## Required tests

- Exact title/subtitle/intro and all eight key points.
- Only `investment` is present; the other five lookups return `undefined`.
- The base `investment` record still has its existing eight related column
  slugs and every slug resolves in the Japanese column corpus.
- Required official terms and numerical qualifications are present.
- All prohibited stale/overbroad phrases are absent.
- Prohibited-phrase tests must reject representative evasions including
  `10段階で完了`, `単独株主には最低資本金`,
  `本人による銀行訪問が必須`, `PIFを登録する必要`,
  `化粧品広告の違反には一律500万`,
  `会社の預金を引き出すと5年以下`, and `資本金を回収`, while
  allowing the correct negative sentence
  `PIF自体を登録する制度ではありません`.
- The same probes must catch wording already present in related legacy
  Japanese columns: `本人が直接韓国の銀行に出向き…求めます`,
  `PIF登録まで`, and `会社資金を直接持ち出すと、5年以下`.
- Required-term assertions include `華僑`, `外国会社の台湾支店`,
  `代表者事務所`, `台湾における業務実績`,
  `PIF自体を登録する制度ではありません`, and the logistics qualifier
  `一般的な物流業全体ではなく`.
- No Korean text, English fallback sentences, legacy attorney name, or wrong
  firm identity in serialized Japanese content.

## Verification

- focused Vitest;
- `npm run typecheck`;
- scoped ESLint;
- `git diff --check`.

Independent Japanese/legal-fact review and commit are manager gates.
