# WO-I18N-JA-COL017 — Correct Japanese Taiwan logistics guidance

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Rewrite the Japanese logistics column so that the broad commercial term
“logistics” is not equated with the licensed Taiwan motor-freight-carrier
business (`汽車貨運業`). Accurately distinguish new establishment, share
acquisition, business/asset transfer, and outsourcing to a licensed carrier.
Preserve the slug, source URL, publication/display date, category, featured
image, and `img-01.jpg`. Embedding regeneration remains deferred.

## Allowed files

1. `src/content/columns-ja/017-taiwan-logistics-business-setup.md`
2. `src/lib/__tests__/columns-ja-investment-017.test.ts` (new)

No other edits. Do not edit embeddings or assets, stage, commit, push, deploy,
or operate the development server. The implementation worker must not operate
a server. The browser gate is manager-owned and may use a clean local preview
after worker handoff.

## Frontmatter

- Title:
  `台湾の物流事業と「汽車貨運業」許可：新設・買収・委託`
- Preserve source URL, publication/display date, category, and existing image
  paths.
- Set `lastmod` to `2026-07-24`.
- Set `read_time` to `約8分`.
- Add exactly four FAQ entries and repeat each exact answer as the immediate
  first paragraph of its matching numbered body section.

FAQ and heading contracts:

1. Heading: `## 1. 物流事業と「汽車貨運業」の範囲`

   Question: `台湾で物流関連事業を行うと、必ず「汽車貨運業」の許可が必要ですか？`

   Answer: `必ずしもそうではありません。「物流」は広い実務用語であり、会社名や登記上の営業項目だけで許可の要否は決まりません。自社が報酬を得て貨物自動車で他人の貨物を運送する場合は「汽車貨運業」に該当し得ますが、倉庫、梱包、システム運営、荷主としての発送、運送取次等は、契約関係、運送責任、報酬の内容および車両運行の実態に基づく個別判断が必要です。`

2. Heading: `## 2. 汽車貨運業を新設する場合`

   Question: `一般の汽車貨運業を新設するための資本額・車両要件と手続は何ですか？`

   Answer: `一般の汽車貨運業は、最低資本金2,500万新台湾ドルと新車の貨物自動車20両以上が原則です。ただし、引越運送に限定する事業は1,000万新台湾ドル・8両以上、金門・馬祖地区の事業は1,000万新台湾ドル・5両以上とされ、後者には営業地域の制限があります。個人経営の小型貨物運送には、本人所有の小型貨物自動車1両、車齢2年以内、小型車の職業運転免許、所轄区域内の戸籍等を要する別の狭い例外があります。外国投資、交通部の承認、籌設、会社・商業登記、車両・施設の準備、営業免許、公会加入等を分けて確認してください。`

3. Heading: `## 3. 既存事業者を買収する場合`

   Question: `許可を持つ会社を買収すれば、汽車貨運業の免許も自動的に取得できますか？`

   Answer: `株式取得では免許を取得・移転するのではなく、許可主体である対象会社が免許を保持したまま存続します。事業・資産の譲受では、対象会社の免許が譲受人へ当然に移転することはありません。営業免許の有効性と業種範囲、車両・営業用ナンバープレート、駐車施設、公会加入、違反・未納、保険、担保、契約上の変更条項等を確認し、外国投資承認と必要な公路主管機関の承認・変更手続を行ってください。`

4. Heading: `## 4. 輸配送を委託する場合と外国人の就労`

   Question: `許可を持つ台湾業者に実運送を委託すれば、自社には許可も就業許可も不要ですか？`

   Answer: `一律には判断できません。委託元が荷主・取次人なのか、自ら運送契約上の運送人として報酬を受けるのかで評価が変わります。相手方の営業免許と営業用車両を確認し、免許の名義貸しや無許可運送にならないよう、契約上の役割と実際の運用を一致させてください。また、株主・投資家であることだけで台湾での就労権が生じるわけではなく、実際に就労・経営管理を行う外国人は、業務開始前に就業許可の要否と在留資格を別途確認する必要があります。`

## Body requirements

- Remove all unsupported Coupang/Korean-client market sentiment, recruiting,
  volume, matching, success, and market-entry-speed claims.
- Explain that permit scope depends on actual contracts, remuneration,
  transport responsibility, and vehicle operations. Warehousing, packing,
  software, forwarding/transport intermediation, or shipping one's own cargo
  are not automatically the same as `汽車貨運業`.
- State the ordinary corporate thresholds and statutory alternatives:
  - general freight: NT$25 million and at least 20 new trucks;
  - moving-only business: NT$10 million and at least 8 trucks;
  - Kinmen/Matsu business: NT$10 million and at least 5 trucks, with the
    applicable geographic operating restriction;
  - individual small-truck freight is a narrow separate route requiring the
    applicable local household registration, occupational driver licence, and
    one personally owned small truck no more than two years old, and is not the
    ordinary route for a foreign corporation.
- State the one-year rule exactly:
  `新設事業者に交付された営業用ナンバープレート（車両牌照）は、交付日から1年間、返納による抹消（繳銷）または車両登録上の名義変更・譲渡（過戶轉讓）を行うことができません。`
  Clarify that this rule concerns plate surrender/deregistration and registered
  vehicle ownership transfer; do not mistranslate it as administrative
  cancellation or transfer of the plate itself.
- Identify `交通部` as the central highway authority under Highway Act Article
  3, and describe `交通部公路局` as the application/administrative-guidance
  body. State that a non-ROC national or entity may apply to invest in
  `汽車貨運業` only after central-highway-authority approval under Article 35;
  do not describe this merely as an “approval issue.” Link both the official
  establishment-preparation page and filing/document page.
- Use the current foreign-investment agency name `経済部投資審議司`.
- Do not state that every foreign investment follows one identical route.
  Mention that listed securities, foreign-company branches, science/industrial
  park authority cases, and PRC investment can involve different or separate
  regimes. For foreign investment in motor freight, explain the sector
  approval issue under Highway Act Article 35.
- Explain the establishment flow without guaranteeing duration:
  1. determine business scope and investment route;
  2. obtain applicable foreign-investment and sector approvals;
  3. obtain `籌設許可`;
  4. complete company/business registration and approved office, parking,
     maintenance, vehicle, insurance, and organizational preparation;
  5. apply for the operating licence, join the relevant association, and open
     in accordance with the approved scope.
- Explain that an approved office/parking facility and proof of ownership/use
  are required as applicable; do not say that every operator must lease a
  dedicated parking lot. Cover representative documents neutrally: charter,
  shareholder list, parking approval, ownership/use proof, maintenance
  contract, vehicle purchase proof/list, and the authority's current checklist.
- State timing accurately:
  - preparation is generally completed within six months after `籌設許可`;
  - special-circumstances extension may be up to six additional months;
  - after operating-licence issuance, operation generally starts within one
    month and association-membership proof is filed;
  - investment-law review periods, if discussed, are administrative review
    targets and not the total carrier-establishment duration.
- Separate investment, work authorization, and residence. A shareholder or
  investor does not obtain work rights automatically.
- If explaining unauthorized work consequences, use qualified wording:
  administrative fines and departure measures may apply; current NIA
  directions generally prescribe a three-year entry ban for illegal work,
  subject to the exemptions or period reductions specified in those
  administrative directions. Do not say that a report itself mechanically
  causes a three-year ban or call the directions' exceptions statutory.
- Distinguish share acquisition from business/asset acquisition:
  - use `買収代金`, not `資本金`, for share-purchase payment;
  - cover applicable MOEA prior approval, Highway Act Article 35 sector
    approval, post-remittance investment-amount determination, company
    changes, and road-authority approvals;
  - do not say a licence transfers automatically or that operation may begin
    immediately after generic acquisition steps.
- Require substantive due diligence: licence scope/status, vehicles and plates,
  parking, association membership, violations, taxes, employment, insurance,
  liens, contracts, and change-of-control conditions.
- State that a transfer and the organizational, name, address,
  responsible-person, capital/asset, and parking changes listed in Article 23
  of the Motor Transportation Enterprise Regulations must be reported to the
  competent highway authority for approval.
- Explain outsourcing neutrally:
  - a licensed Taiwan carrier may perform actual transport;
  - the principal's role as shipper, intermediary, or contractual carrier
    matters;
  - verify the counterparty's operating licence and commercial vehicles;
  - prohibit licence lending and unlicensed carriage;
  - fixed investment may be lower, but cover carrier dependence, service
    levels, cargo accidents, insurance, personal/logistics data,
    subcontracting, indemnity, and termination handover risks.
- Preserve the featured image and `img-01.jpg`.
- End with a neutral educational disclaimer and `曾雋崴（Wei Tseng）`.

## Sources and closing

Primary official sources:

- Highway Act:
  `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0040001`
- Regulations for Examining Motor Transportation Enterprises:
  `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0040004`
- Motor Transportation Enterprise Regulations:
  `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0040003`
- Highway Bureau establishment-preparation filing:
  `https://www.thb.gov.tw/cp.aspx?n=392`
- Highway Bureau registration application/documents:
  `https://www.thb.gov.tw/cp.aspx?n=507`
- Highway Bureau freight standards overview:
  `https://cyi2.thb.gov.tw/cp.aspx?n=1962`
- Highway Bureau enterprise changes:
  `https://www.thb.gov.tw/cl.aspx?n=259`
- Highway Bureau commercial-vehicle transfer:
  `https://www.thb.gov.tw/cp.aspx?n=356`
- Parking-space standard attachment:
  `https://www.mvdis.gov.tw/webMvdisLaw/Download.aspx?ID=22746&type=Law`
- Statute for Investment by Foreign Nationals:
  `https://law.moea.gov.tw/LawContent.aspx?id=FL011158&media=print`
- MOEA Department of Investment Review:
  `https://mnscdn.moea.gov.tw/Mns/dir/content/Content.aspx?menu_id=42885`
- MOEA foreign-investment filing guide:
  `https://www.moea.gov.tw/Mns/dir/investment/wHandDirApply_File.ashx?file_id=49`
- Employment Service Act Article 43:
  `https://laws.mol.gov.tw/FLAW/FLAWDOC01.aspx?flno=43&id=FL015128`
- Employment Service Act Article 68:
  `https://laws.mol.gov.tw/flaw/FLAWDOC01.aspx?flno=68&id=FL015128`
- NIA entry-ban directions:
  `https://www.immigration.gov.tw/5475/5478/141478/141482/148796/cp`

Safe internal links:

- `/ja/services#investment`
- `/ja/lawyers/wei-tseng`
- `/ja/contact`

Use no unsupported client, transaction, matching, recruitment, or response-time
claims.

## Forbidden

- `物流会社を設立するには、「自動車貨物運送業」`
- `すべての外国人投資`
- `投資審議委員会`
- `20台を購入し、1年間保有`
- `1年間保有しなければならず`
- `1年間.*処分できません`
- `ライセンス取得の悩みがありません`
- any statement that a licence transfers automatically with a company/business
  sale
- `資本金を送金する`
- `取得するのが安全`
- `通報された場合、3年間`
- `投資が最も少なくリスクが最も小さい`
- `物量委託`
- `クーパンの物量`
- `完璧な契約`
- `会社の体質`
- `市場を飲み込む`
- unsupported Coupang/client-success/recruiting/matching claims
- `/ko/`
- `曾俊瑋`
- Hangul

## Required tests

- Parse the raw and normalized Japanese post.
- Assert exact title/date/read time/URL/category, exactly four FAQs, and exact
  ordered heading/immediate-answer pairs.
- Assert scope distinction, ordinary thresholds, moving/Kinmen/Matsu/individual
  exceptions, exact plate rule, six-month preparation and extension,
  one-month opening rule, current agency, qualified foreign-investment routes,
  Highway Act Article 35 issue, facilities/documents, acquisition distinctions,
  due diligence, Article 23 change approval, outsourcing qualifications, and
  work/residence qualification.
- Assert every official source, every safe Japanese internal link,
  `曾雋崴（Wei Tseng）`, and both existing image paths.
- Assert all forbidden claims/terms, Hangul, and wrong-locale links are absent.
- Assert substantial Japanese content and canonical slug plus alias
  `logistics-business` resolution.
- Run full Japanese-column corpus regression, typecheck, scoped ESLint, and
  diff checks.

Independent factual, Japanese editorial, browser, and manager gates are
required before commit.
