# WO-I18N-JA-FAQ — Correct all Japanese public FAQ answers

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Replace all 13 Japanese FAQ entries with fact-checked, natural Japanese. The
same data is shown on `/ja` and `/ja/faq` and is serialized into FAQPage
JSON-LD, so question order, exact answers, and legal qualifications must be
locked by a focused regression test.

## Allowed files

1. `src/data/faq-content.ts`
2. `src/data/__tests__/faq-content-ja-factual-consistency.test.ts` (new)
3. `src/data/__tests__/faq-divorce-legal-consistency.test.ts`

In the existing divorce-consistency test, update only the JA expected phrases
to the new answer:

- Article 1050 elements: `書面で行い`, `2名以上の証人が署名`,
  `戸政機関で離婚登記`
- cross-border guidance: `国際離婚`, `どの法が適用`,
  `台湾で手続できるか`, `財産分与`, `親権`

Preserve all KO, ZH-Hant, and EN test cases byte-for-byte. No other edits.
Preserve KO, ZH-Hant, and EN FAQ data byte-for-byte. Do not edit page routes,
metadata, pricing/contact data, builder types, assets, or embeddings; stage,
commit, push, deploy; or operate a server. Browser verification is
manager-owned.

## Exact Japanese FAQ contract

Replace `faqContent.ja` with exactly these 13 entries in this order:

1. Question:
   `台湾での会社設立はどのような手続きで進みますか？`

   Answer:
   `外国投資による台湾子会社では、一般に①会社の中国語名称・営業項目の予備審査、②該当する外国投資許可、③設立準備口座の開設と国外からの資金送金、④資本額の確認・投資額審定、⑤会社設立登記、⑥税籍登記、⑦口座の正式切替えを行います。業種別許認可、投資者の属性、銀行審査などにより順序や追加書類は変わるため、これはすべての案件に共通する固定的な順序ではありません。`

2. Question:
   `台湾子会社と台湾支店（分公司）は、どのように選べばよいですか？`

   Answer:
   `台湾子会社は台湾法上の独立法人で、株主は原則として出資額を限度に責任を負います。台湾支店（分公司）は外国会社の一部で独立法人格を持たず、支店の債務は外国会社の債務となり、台湾での営業に用いる資金を本店から割り当て、その資金を台湾での営業にのみ使用する必要があります。税務、利益送金、共同出資、資金調達、許認可、撤退方法まで比較して選びます。`

3. Question:
   `会社設立後、資本金はどのように回収できますか？`

   Answer:
   `払込済みの資本金を株主が自由に引き出すことはできません。会社を存続させる場合は、会社形態に応じた減資、適法な配当、実在する借入金の返済など、それぞれの法的・税務上の要件を確認します。持分譲渡による退出は、会社からの資本金返還とは別です。事業を恒久的に終了する場合は、原則として解散・清算を行い、債務と租税を処理した後の残余財産を株主へ分配し、外国投資・送金・銀行手続を別途確認します。`

4. Question:
   `専用オフィスがなくても台湾で会社を設立できますか？`

   Answer:
   `会社登記には本店所在地が必要で、賃貸借契約書、所有者の使用同意書など、その住所を使用できることを示す資料が求められます。シェアオフィス等を利用できる場合もありますが、登記住所を借りただけで全ての事業を行えるわけではありません。土地使用分区、建築・消防、賃貸条件および業種別の実際の営業場所要件を事前に確認してください。台北市では対象となる登記について営業場所事前照会も必要です。`

5. Question:
   `台湾で従業員との労働契約を終了する場合、退職金（資遣費）は必ず必要ですか？`

   Answer:
   `必ずではありません。雇用主が労働基準法第11条、第13条但書または第20条等に基づいて契約を終了する場合や、労働者が同法第14条の法定事由に基づいて契約を終了する場合は、資遣費が必要となります。一方、同法第12条の懲戒解雇では原則として資遣費は不要で、通常の自己都合退職も直ちに資遣費の対象にはなりません。終了理由、予告、支払期限および新旧退職金制度の適用を個別に確認してください。`

6. Question:
   `最低勤務期間（台湾法上の「最低服務年限」）の合意は有効ですか？`

   Answer:
   `雇用主が専門技術訓練を行って費用を負担した場合、または勤務継続のための合理的な補償を提供した場合に限り、最低勤務期間を定めることができます。さらに、訓練の期間・費用、同種人材の代替可能性、補償の金額・範囲その他の事情から合理的な範囲内でなければならず、要件に反する合意は無効です。労働者の責めに帰すことのできない理由で期間満了前に契約が終了した場合、違約責任や訓練費返還責任は負いません。`

7. Question:
   `台湾で交通事故が起きたら、まず何をすべきですか？`

   Answer:
   `安全の確保と負傷者の救護を優先し、警察へ通報して、法令に従って車両位置・現場痕跡・写真・映像・相手方情報を保全してください。負傷がある場合は医療機関を受診し、診断書や費用資料も保管します。警察資料は所定の時期に申請して取得し、保険会社への通知、事故鑑定、示談または訴訟は事故状況に応じて検討します。これらは常に一律の順序で進むわけではありません。`

8. Question:
   `台湾のジムや施設でけがをした場合、損害賠償を請求できますか？`

   Answer:
   `施設が提供するサービスが合理的に期待される安全性を欠き、その欠陥または管理上の過失によって負傷・損害が生じた場合、消費者保護法や民法に基づく賠償請求を検討できます。責任の成否は、安全性の欠如・過失、因果関係、損害の立証などにより決まります。CCTV、現場写真、診断書、領収書、利用規約、当日の連絡記録を早めに保全してください。`

9. Question:
   `韓国人が台湾で離婚するには、どのような手続きが必要ですか？`

   Answer:
   `台湾法が適用される合意離婚は、書面で行い、2名以上の証人が署名し、戸政機関で離婚登記をする必要があります。裁判による離婚は、原則として裁判前に家事調停を経ます。韓国・台湾間の国際離婚では、台湾で手続できるか、どの法が適用されるか、両地域での届出・承認、財産分与、未成年の子の親権・扶養を個別に確認してください。`

10. Question:
    `台湾で未成年の子の親権・監護はどのように決まりますか？`

    Answer:
    `台湾の裁判所は子の最善の利益を基準に、子の年齢・健康・意思・人格発達上の必要、父母の職業・健康・経済状況・養育の意思、親子関係、他方の親の関与を妨げる行為の有無など一切の事情を考慮します。経済力だけで決まるものではありません。国際案件では、準拠法、管轄、外国判決の承認・執行なども個別に確認します。`

11. Question:
    `台湾で刑事事件に関与した場合、どうすればよいですか？`

    Answer:
    `被疑者（台湾法上の「犯罪嫌疑人」）は捜査段階から弁護人を選任できます。警察・検察の取調べ前には、被疑事実と罪名、黙秘できること、弁護人を選任できること、有利な証拠の調査を求められることが告知されます。言語が通じない場合は通訳の対象となります。出国・出海の制限（台湾法上の「限制出境・出海」）や勾留（同「羈押」）は、外国人であるだけで自動的に行われるものではなく、法定要件と個別の処分を要するため、早い段階で事実と証拠を整理してください。`

12. Question:
    `相談はどのような方式で行われますか？`

    Answer:
    `台北事務所での対面相談またはビデオ通話による相談に対応しており、韓国語・中国語・日本語で相談できます。一般法律相談は事前予約制で、現在の料金案内では1時間単位です。まずお問い合わせページから案件の概要と主な資料を送り、日程、相談方法、担当言語および費用をご確認ください。連絡はKakaoTalk、メールまたは電話から行えます。`

13. Question:
    `物流・化粧品などの規制業種でも台湾で会社を設立できますか？`

    Answer:
    `会社を設立できるかと、当該事業を開始できるかは別に確認します。「物流」は広い概念で、倉庫・梱包・取次ぎなどと、自ら報酬を受けて貨物自動車で運送する「自動車貨物運送業」（汽車貨運業）では規制が異なります。自動車貨物運送業には、道路運送を所管する機関（公路主管機関）による設立準備許可（籌設許可）・営業免許等が必要です。化粧品は、対象となる製造・輸入業者が供給等の開始前に製品登録を行い、対象製品のPIFを作成・更新して法定の住所に保存します。PIFは当局へ登録・届出するものではありません。`

## Official sources

- company setup flow:
  `https://investtaiwan.nat.gov.tw/showPage?lang=cht&search=InvestmentStatus01`
- Company Act:
  `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080001`
- Taipei business-location inquiry:
  `https://www.businesslocationinfo.gov.taipei/BLBQS/Home/Notice`
- limited-company setup documents:
  `https://gcis.nat.gov.tw/F/t70044_p`
- Ministry of Labor severance guidance:
  `https://www.mol.gov.tw/1607/28162/28540/28564/`
- Ministry of Labor termination types:
  `https://www.mol.gov.tw/1607/28162/28296/81778/81784/81912/`
- Labor Standards Act Article 15-1:
  `https://laws.mol.gov.tw/FLAW/FLAWDOC01.aspx?flno=15-1&id=FL014930`
- Road Traffic Management and Penalty Act Article 62:
  `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=62&pcode=K0040012`
- Regulations Governing Road Traffic Accidents Article 10:
  `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=10&pcode=D0080090`
- Consumer Protection Act Article 7:
  `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=7&pcode=J0170001`
- Civil Code Article 184:
  `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=184&pcode=B0000001`
- Civil Code Articles 1050 and 1055-1:
  `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=1050&pcode=B0000001`
  `https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=1055-1&pcode=B0000001`
- Judicial Yuan family mediation:
  `https://www.judicial.gov.tw/tw/cp-165-123027-1420b-1.html`
- Code of Criminal Procedure:
  `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=C0010001`
- Cosmetics product registration and PIF:
  `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0030097`
  `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0030098`
- Highway Act:
  `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0040001`

## Forbidden regressions

- `①投資許可の申請 → ②会社名`
- `支社（分公司）`
- `商業用登記住所`
- `解雇時には資遣費の支払いが原則`
- `自発的な退職であっても`
- `義務在職約定`
- `事故報告書を受け取り`
- `養育権・親権`
- `子の常居所地`
- `外国人の場合、出国禁止`
- `Zoom/Google Meet`
- `物流業は運送業許可`
- `PIF登録`
- `PIF届出`
- `PIF承認`
- `FDA届出`
- Hangul

## Required tests

- Snapshot exact `faqContent.ja` as the ordered 13-question/answer contract.
- Assert KO, ZH-Hant, and EN content is unchanged by hashing or exact sentinel
  checks sufficient to catch accidental edits.
- Assert all legal distinctions above and all forbidden regressions.
- Assert exactly 13 Japanese entries, substantial Japanese text, no Hangul,
  and unique questions.
- Assert public `/ja/faq` data and generated FAQPage schema remain the same
  ordered 13 entries by running the existing page test.
- Run:

```bash
npx vitest run \
  src/data/__tests__/faq-content-ja-factual-consistency.test.ts \
  src/data/__tests__/faq-divorce-legal-consistency.test.ts \
  'src/app/[locale]/faq/__tests__/ja-page.test.tsx'
npm run -s typecheck
npx eslint \
  src/data/faq-content.ts \
  src/data/__tests__/faq-content-ja-factual-consistency.test.ts
git diff --check
```

Independent factual/editorial review and manager browser gates on `/ja` and
`/ja/faq` are required before commit.
