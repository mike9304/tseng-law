# WO-I18N-JA-COL011 — Correct Japanese Taiwan cosmetics guidance

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Rewrite the Japanese cosmetics-market-entry column so that product
registration and the Product Information File (PIF) are clearly separated.
PIF is created, updated, and retained by the responsible manufacturer or
importer; it is not registered, uploaded, approved, or certified by TFDA.
Preserve the slug, source URL, publication/display date, category, featured
image, and `img-01.jpg`. Embedding regeneration remains deferred.

## Allowed files

1. `src/content/columns-ja/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md`
2. `src/lib/__tests__/columns-ja-investment-011.test.ts` (new)

No other edits. Do not edit embeddings, stage, commit, push, deploy, or operate
the development server.

## Frontmatter

- Title:
  `台湾化粧品市場への進出：会社・支店の選択から製品登録、PIF作成・保存、広告規制まで`
- Preserve source URL, publication/display date, category, and featured image.
- Set `lastmod` to `2026-07-24`.
- Set `read_time` to `約6分`.
- Add exactly three FAQ entries and repeat each exact answer as the immediate
  first paragraph of its matching numbered body section.

FAQ contracts:

1. Heading: `## 1. 台湾での進出形態と輸入者の選択`

   Question: `台湾で化粧品を販売するには、自社の台湾法人または支店が必須ですか？`

   Answer: `必須とは限りません。台湾の輸入業者（販売代理店を兼ねる場合を含みます）に輸入・販売を委ねる方法もあります。自社で台湾事業を運営する場合は、台湾子会社と外国会社の支店で設立・登記、責任、税務等の仕組みが異なり、外国投資の許可や会社・支店の登記に要する期間も案件と補正の有無により変わります。事業モデルと化粧品製造・輸入業者としての責任主体を先に決めてください。`

2. Heading: `## 2. 製品登録とPIFは別の制度`

   Question: `PIFとは何ですか。TFDAへの製品登録と同じ手続ですか？`

   Answer: `同じではありません。製品登録はTFDAの化粧品製品登録プラットフォームで行う別の手続です。PIFは品質、安全性、組成、機能、製造方法、試験結果、安全性評価等の資料をまとめ、化粧品製造・輸入業者が作成・更新・保存するファイルであり、PIF自体はTFDAへの事前提出を要する制度ではありません。2026年7月1日から原則として全化粧品がPIF制度の対象となり、工場登記を免除される製造場所で製造する固形手作り石けんには例外があります。`

3. Heading: `## 3. 表示・宣伝・広告の規制`

   Question: `化粧品広告では、どのような表示に注意が必要ですか？`

   Answer: `広告は文言だけでなく、名称、文字、画像、記号、音声その他の全体的な表現から判断されます。虚偽・誇大表示や医療的効能の標榜は禁止され、例えばニキビの治療、抗炎症、殺菌等の医療的な訴求には特に注意が必要です。違反時の過料は、虚偽・誇大広告が4万～20万新台湾ドル、医療的効能の標榜が60万～500万新台湾ドルです。インフルエンサー等の投稿も、実質が広告であれば同じ基準を前提に確認してください。`

## Body requirements

- Open with a neutral explanation for foreign/Korean cosmetics brands. Do not
  invent market rankings, customer dialogue, success claims, or response-time
  promises.
- Separate the following layers throughout:
  1. market-entry entity/importer choice;
  2. TFDA product registration;
  3. PIF creation, updating, and retention;
  4. labeling/advertising compliance;
  5. inspection and correction/penalty consequences.
- Explain that a local subsidiary is not always mandatory when a Taiwan
  importer/distributor assumes import and sale. A Taiwan subsidiary and a
  foreign-company branch are different legal/registration paths.
- Use the current investment agency name `経済部投資審議司`. Do not promise a
  fixed or approximate three-month completion period.
- Use the statutory actor term `化粧品製造・輸入業者`. Do not call it
  `製品登録者` or `国内責任者`.
- Explain that product registration must be completed before supply, sale,
  gift, public display, or consumer trial use. State the registration's
  three-year validity and that renewal is filed within the three months before
  expiry.
- Explain that product registration occurs on TFDA's cosmetics product
  registration platform. Do not describe PIF as registered or uploaded there.
- Explain PIF using representative categories such as quality, safety,
  composition, claimed function, manufacturing method, test results, and
  safety evaluation. Note that the governing rules organize the required
  information into 16 categories; do not describe PIF as proof that TFDA has
  certified market-sale eligibility.
- State the phase-in accurately: from 2026-07-01, the remaining cosmetics are
  included, so all cosmetics are generally covered; the exception is solid
  handmade soap manufactured at a manufacturing place exempt from factory
  registration, not every handmade soap product.
- State that a qualified third party may assist with PIF preparation, but the
  manufacturer/importer retains legal responsibility.
- State the retention rule precisely: PIF must be kept for at least five years
  beginning on the day after the product's final market supply. It is retained
  at the Article 7 address of the manufacturer/importer; retrievable originals
  maintained by the original manufacturer or in secure electronic/cloud
  storage may be explained with appropriate qualification.
- If mentioning inspections, explain the general seven-day advance-notice rule
  and that statutory exceptions may permit inspection without that notice.
- Distinguish consequences:
  - false product-registration or PIF information can result in an
    NT$10,000–1,000,000 administrative fine;
  - an incomplete PIF ordinarily receives a correction deadline and the fine
    follows if the deficiency is not corrected within that period;
  - recall or destruction is not automatic for every documentation defect and
    must be tied to the applicable statutory conditions.
- Explain that advertising is assessed from the overall presentation, not
  isolated wording alone. Include the prohibition on medical claims and safe
  examples such as acne treatment, anti-inflammatory effect, or sterilization.
- Use `過料`, not criminal-sounding `罰金`, for the administrative penalties:
  - false/exaggerated advertising: NT$40,000–200,000;
  - claims of medical efficacy: NT$600,000–5,000,000.
- Explain that influencer or reviewer content can qualify as advertising based
  on its substance and commercial context; do not assert that every personal
  post is automatically the company's advertisement.
- Preserve both existing image paths.
- Use `曾雋崴` only if naming the attorney.

## Sources and closing

Primary official sources:

- Cosmetic Hygiene and Safety Act:
  `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0030013`
- Regulations Governing the Notification of Cosmetic Products:
  `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0030097`
- Regulations Governing Product Information Files for Cosmetics:
  `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0030098`
- TFDA product-registration scope announcement:
  `https://www.fda.gov.tw/tc/newsContent.aspx?cid=3&id=30612`
- TFDA PIF phased-implementation announcement:
  `https://www.fda.gov.tw/tc/newsContent.aspx?cid=3&id=30614`
- TFDA PIF guidance PDF:
  `https://www.fda.gov.tw/tc/includes/GetFile.ashx?id=f639179794512621908&iid=13384`
- TFDA cosmetics product-registration area:
  `https://www.fda.gov.tw/TC/siteContent.aspx?sid=3435`
- TFDA PIF information area:
  `https://www.fda.gov.tw/TC/site.aspx?sid=12523`
- Criteria for cosmetic labeling, promotion, and advertising:
  `https://law.moj.gov.tw/LawClass/LawAll.aspx?PCODE=L0030099`
- Official criteria attachment:
  `https://law.moj.gov.tw/LawClass/LawGetFile.ashx?FileId=0000249593&lan=C`
- MOHW advertising-rule announcement:
  `https://www.mohw.gov.tw/cp-4256-48110-1.html`
- Invest Taiwan Japanese investment overview:
  `https://investtaiwan.nat.gov.tw/showPage?lang=jpn&search=InvestmentStatus01`
- MOEA Investment Review Department:
  `https://mnscdn.moea.gov.tw/Mns/dir/content/Content.aspx?menu_id=42879`

Safe internal links:

- `/ja/services#investment`
- `/ja/lawyers/wei-tseng`
- `/ja/columns/taiwan-company-establishment-basics`

Use neutral educational disclaimer copy. Do not promise availability, speed,
approval, registration, market access, or a case result.

## Forbidden

- `PIF登録`
- `PIFを登録`
- `PIF.*アップロード`
- `PIF.*承認`
- `PIF.*認証`
- `市場販売資格を証明`
- `製品登録者`
- `国内責任者`
- `投資審議委員会`
- `約3か月`
- blanket handmade-soap exception
- claim that every influencer post is automatically an advertisement
- claim that every PIF defect automatically causes recall/destruction
- unqualified criminal-sounding `罰金`
- `/ko/`
- Hangul

## Required tests

- Parse the raw and normalized Japanese post.
- Assert exact title/date/read time/URL/category, exactly three FAQs, and exact
  ordered heading/immediate-answer pairs.
- Assert the entity/importer distinction, `経済部投資審議司`,
  `化粧品製造・輸入業者`, separate product-registration/PIF concepts,
  registration platform, three-year validity, renewal window, 16 PIF
  categories, 2026-07-01 phase, precisely limited soap exception, third-party
  assistance with retained responsibility, five-year retention start/address,
  inspection notice qualification, correction-first rule, and precise
  administrative fine ranges.
- Assert advertising's overall-presentation test, medical-claim examples,
  influencer qualification, all official sources, all safe Japanese links,
  and both image paths.
- Assert all forbidden terms/claims, Hangul, and wrong-locale links are absent.
- Assert substantial Japanese content and canonical/alias slug resolution.
  The required alias is `cosmetics-market-entry`.
- Run full Japanese-column corpus regression, typecheck, scoped ESLint, and
  diff checks.

Independent factual, Japanese editorial, browser, and manager gates are
required before commit.
