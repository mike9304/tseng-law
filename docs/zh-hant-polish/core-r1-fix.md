# 核心文案第1輪審閱處理紀錄

日期：2026-09-30。審閱者：Grok，core-r1。依 STYLE.md 僅處理語言；法律實質與事實意見不採納修改，追加 LAWYER-REVIEW.md。行號為本回合處理後的原始碼行號。審閱檔第一筆接在開頭句尾，已一併計入，共40筆。

- src/data/service-details.ts:230 | 刑事告訴期限為6個月，逾期僅能提起民事訴訟，因此事故發生後應儘速諮詢律師。 → 刑事告訴期限為6個月，逾期僅能提起民事訴訟，因此事故發生後應儘速諮詢律師。 | 不採納：涉及告訴期間的適用範圍、起算點及民事時效，屬法律實質。已列入 LAWYER-REVIEW.md。
- src/data/service-details.ts:228 | 肇事逃逸（刑法第185條之4）：1年以上7年以下有期徒刑。 → 肇事逃逸（刑法第185條之4）：1年以上7年以下有期徒刑。 | 不採納：涉及肇事逃逸的法定刑與結果區分，屬法律實質，不能調整刑度數字。已列入 LAWYER-REVIEW.md。
- src/data/faq-content.ts:87 | ①投資許可申請 → ②公司名稱預查 → ③資本額匯入及審計報告 → ④公司登記 → ⑤營業登記 → ⑥銀行開戶 → ①投資許可申請 → ②公司名稱預查 → ③資本額匯入及審計報告 → ④公司登記 → ⑤營業登記 → ⑥銀行開戶 | 不採納：涉及設立程序順序、投資審定、帳戶與文件要求，屬法律實質。已列入 LAWYER-REVIEW.md。
- src/data/faq-content.ts:130 | ②裁判離婚（調解→訴訟） → ②裁判離婚（調解→訴訟） | 不採納：涉及離婚程序分類與調解、和解的法律效果，屬法律實質。已列入 LAWYER-REVIEW.md。
- src/data/faq-content.ts:92 | 子公司（有限公司）是獨立的台灣法人 → 子公司（有限公司）是獨立的台灣法人 | 不採納：涉及子公司的組織型態與法人地位，屬法律實質。已列入 LAWYER-REVIEW.md。
- src/data/faq-content.ts:124 | 若能證明設施管理者違反安全管理義務，即可請求損害賠償。 → 若能證明設施管理者違反安全管理義務，即可請求損害賠償。 | 不採納：涉及損害賠償成立要件及適用法律，屬法律實質；不以刪改「即可」代替法律審核。已列入 LAWYER-REVIEW.md。
- src/data/site-content.ts:1426 | 被告與被害人代理 → 被告與被害人代理 | 不採納：涉及刑事辯護人與告訴代理人的程序身分，屬法律實質。已列入 LAWYER-REVIEW.md。
- src/data/site-content.ts:1457 | 其後雙方於二審和解。 → 其後雙方於二審和解。 | 不採納：涉及二審和解是否已發生、結案及資訊來源可信度，屬案件結果事實。已列入 LAWYER-REVIEW.md。
- src/data/service-details.ts:227 | 最重5年有期徒刑，或新台幣50萬元至250萬元罰金。 → 最重5年有期徒刑，或新台幣50萬元至250萬元罰金。 | 不採納：涉及公司法第9條法定刑與科刑方式，屬法律實質。已列入 LAWYER-REVIEW.md。
- src/data/firm-introduction.ts:38 | 能完整提供客戶最專業的法律服務，亦是最堅實可信任的合作夥伴 → 提供客戶專業的法律服務，並作為可信任的合作夥伴 | 採納：刪除「最」與誇大修飾，保留專業服務及合作夥伴的原意。
- src/data/site-content.ts:1397 | 協議離婚：兩位證人與戶政登記 → 協議離婚：兩位證人與戶政登記 | 不採納：涉及協議離婚的書面及證人要件，也會改動人數表述，屬法律實質。已列入 LAWYER-REVIEW.md。
- src/data/site-content.ts:1399 | 親權（監護權） → 親權（監護權） | 不採納：涉及親權與監護的制度區別，屬法律實質。已列入 LAWYER-REVIEW.md。
- src/data/faq-content.ts:133 | 台灣的親權（監護權）如何判定？ → 台灣的親權（監護權）如何判定？ | 不採納：涉及親權與監護的制度區別及問句涵蓋範圍，屬法律實質。已列入 LAWYER-REVIEW.md。
- src/data/service-details.ts:40 | 公司型態分為子公司（股份/有限公司）、分公司及聯絡處 → 公司型態分為子公司（股份/有限公司）、分公司及聯絡處 | 不採納：涉及公司種類、投資架構與辦事處法律地位，屬法律實質。已列入 LAWYER-REVIEW.md。
- src/data/service-details.ts:44 | 營業場所須先透過台北市「營業場所預查系統」 → 營業場所須先透過台北市「營業場所預查系統」 | 不採納：涉及營業場所法規適用地域與主管機關要求，屬法律實質。已列入 LAWYER-REVIEW.md。
- src/data/service-details.ts:264 | 提起行政救濟或民刑事訴訟 → 提起行政救濟或民刑事訴訟 | 不採納：涉及侵權救濟、行政救濟及異議評定的程序選擇，屬法律實質。已列入 LAWYER-REVIEW.md。
- src/data/site-content.ts:1426 | 違法抽回資本最重可處5年有期徒刑、無照營業等 → 違法抽回資本最重可處5年有期徒刑、無照營業等 | 不採納：涉及未取得許可營業的刑事責任及法規適用，屬法律實質。已列入 LAWYER-REVIEW.md。
- src/data/service-details.ts:226 | 外籍被告的韓語口譯與訴訟協助 → 外籍被告的韓文口譯與訴訟協助 | 不採納：涉及通譯安排、辯護角色及事務所服務範圍，屬法律及服務事實；僅另將「韓語」統一為「韓文」，不改「口譯」內容。已列入 LAWYER-REVIEW.md。
- src/data/site-content.ts:1372 | 資本額回收方法 → 資本額回收方法 | 不採納：涉及股本抽回與解散清算後財產分配，改題名也會改變法律內容。已列入 LAWYER-REVIEW.md。
- src/data/site-content.ts:1182 | 獲得新台幣數百萬元補償 → 獲得新台幣數百萬元補償 | 不採納：涉及案件給付的賠償或補償性質，刪除「補償」會改動案件結果描述。已列入 LAWYER-REVIEW.md。
- src/data/firm-introduction.ts:41 | 曾雋崴律師除有多年訴訟經驗，並致力為日、韓客戶提供包含公司設立、簽證申請、商標專利申請、法律風險評估、公司稅務諮詢等全方面法律服務。 → 曾雋崴律師有多年訴訟經驗，並為日、韓客戶辦理公司設立、簽證申請、商標專利申請、法律風險評估與公司稅務諮詢。 | 採納：修正「除…並」句構，刪除「致力」「全方面」；保留原有服務項目，包括商標專利申請。
- src/data/site-content.ts:1476 | 國立政治大學金融系 學士 → 國立政治大學金融系 學士 | 不採納：涉及雙主修及學位數量的學歷事實，不能僅依其他頁面合併。已列入 LAWYER-REVIEW.md。
- src/data/site-content.ts:1488 | 日本神戶大學、早稻田大學交換聽講生 → 日本神戶大學、早稻田大學交換聽講生 | 不採納：涉及交換學生或聽講生的身分事實，須核對正式簡歷或證明文件。已列入 LAWYER-REVIEW.md。
- src/data/site-content.ts:1470 | 國立台灣大學財務金融研究所 碩士 → 國立臺灣大學財務金融研究所碩士 | 採納：使用學校官方名稱並刪除多餘空格，不改學位事實。
- src/data/attorney-profiles.ts:132 | 台灣律師 · 代表律師 → 台灣律師 · 代表律師 | 不採納：涉及律師登記職稱、代表人身分及履歷事實，不能依加入年份推定職稱。已列入 LAWYER-REVIEW.md。
- src/data/site-content.ts:1043 | 投資與訴訟全程協助；協助韓國、日本企業來台投資，並全程處理相關訴訟。 → 投資與訴訟協助；協助韓國、日本企業來台投資，並處理相關訴訟。 | 採納：刪除「全程」服務承諾；同檔公司設立說明的「全程協助」一併改為「協助」。
- src/data/attorney-profiles.ts:140 | 事務所可使用韓文、中文、日文、英文溝通，從諮詢、申請到爭議解決，採取一貫的策略。 → 事務所可使用韓文、中文、日文、英文溝通，辦理諮詢、申請與爭議處理。 | 採納：刪除空泛的「一貫的策略」；不採用「可以連續辦理」，避免新增服務承諾。
- src/data/faq-content.ts:141 | 並及早擬定法律策略，對案件結果影響重大。 → 並及早擬定法律策略。 | 採納：僅刪除結果暗示，保留原有權利說明與建議，不改刑事程序內容。
- src/data/faq-content.ts:102 | 也可使用共享辦公室或借址登記 → 也可使用共享辦公室或借址登記 | 不採納：涉及共享辦公室、借址登記的法定條件與受理範圍，屬法律實質。已列入 LAWYER-REVIEW.md。
- src/data/service-details.ts:209 | 刑事程序應對、偵查階段策略與代理 → 刑事程序應對、偵查階段策略與代理 | 不採納：建議同時變更刑事辯護與被害人代理的程序角色，屬法律實質；不拆出「應對」單獨修改。已列入 LAWYER-REVIEW.md。
- src/data/site-content.ts:1102 | 以韓國、日本跨境實務經驗，協助您處理台灣法律問題。 → 以韓、日跨境實務經驗，協助處理台灣法律問題。 | 採納：精簡國別及多餘主語，保留原有跨境實務經驗描述。
- src/data/site-content.ts:1217 | 事務所提供中文／韓文／日文／英文4種語言的台灣法律諮詢。並依官方律師簡介整理： → 事務所以中文、韓文、日文、英文4種語言提供台灣法律諮詢。以下依官方律師簡介整理： | 採納：修正主語與句間銜接；所有數字、資格及後續列舉保持原樣，同步目前版首頁輸出字串。
- src/data/firm-introduction.ts:39 | 另有提供智慧財產申請、法律爭端解決 → 另提供智慧財產申請與法律爭端解決 | 採納：修正冗贅句構，明確連接兩項服務。
- src/data/site-content.ts:1048 | 以韓語、日語、英語及中文 → 以韓文、日文、英文及中文 | 採納：統一全站繁體中文語言名稱；其他語言不改。
- src/data/faq-content.ts:147 | 韓語、中文、日語、英語皆可諮詢；可使用韓語、英語、中文、日語 → 韓文、中文、日文、英文皆可諮詢；可使用韓文、英文、中文、日文 | 採納：諮詢與收費文案用語一致；同步相關繁體中文顯示字串與相同字串測試。
- src/data/faq-content.ts:150 | 物流業、化妝品等特殊產業 → 物流業、化粧品等特殊產業 | 採納：與同則答案及法規用字一致；相關繁體中文服務、文章卡片及諮詢標示一併統一，不改分類比對詞。
- src/data/site-content.ts:1393 | 家事訴訟 → 家事事件 | 採納：以共同服務標示涵蓋既有訴訟及非訴訟事項；同步繁體中文服務頁、導覽與選單，不改程序或要件。
- src/data/site-content.ts:1437 | 協助查詢台灣商標先申請情形 → 協助查詢台灣商標申請情形 | 採納：採納語句不清的意見，刪除多餘「先」；不新增「相同或近似」「註冊」查詢範圍，避免變更服務事實。
- src/data/site-content.ts:1109 | 我們可以如何協助您？ → 請輸入法律問題或關鍵字 | 採納：改為明確的搜尋操作提示；同檔第1774行同步，長度保持接近。
- src/data/site-content.ts:1290 | meta: '頻道' → meta: '部落格' | 採納：更正 Naver 部落格的媒介標示，YouTube「頻道」保持原樣，href 不改。

同類用語同步（併入上述16筆採納，不另計筆數）：

| 檔案與行號 | before → after | 原因 |
| --- | --- | --- |
| src/app/[locale]/design-preview/DesignPreview.tsx:175 | 家事訴訟 → 家事事件 | 用詞一致；程式邏輯不改 |
| src/app/[locale]/guides/taiwan-company-setup/content.ts:342 | 韓語／日語／英語 → 韓文／日文／英文（僅繁體中文） | 用詞一致；程式邏輯不改 |
| src/app/[locale]/korean-lawyer-in-taiwan/content.ts:111、123、124、137、139、140、152、153、157、161、168、169、180 | 韓語／日語／英語 → 韓文／日文／英文（僅繁體中文） | 用詞一致；程式邏輯不改 |
| src/components/CinematicOpening.tsx:447 | 韓語／日語／英語 → 韓文／日文／英文（僅繁體中文） | 用詞一致；程式邏輯不改 |
| src/components/Header.tsx:392 | 家事訴訟 → 家事事件 | 用詞一致；程式邏輯不改 |
| src/components/HomeAttorneySplit.tsx:27 | 韓語／日語／英語 → 韓文／日文／英文（僅繁體中文） | 用詞一致；程式邏輯不改 |
| src/components/IntentLandingPage.tsx:202、231、269 | 韓語／日語／英語 → 韓文／日文／英文（僅繁體中文） | 用詞一致；程式邏輯不改 |
| src/components/PricingCards.tsx:101 | 韓語／日語／英語 → 韓文／日文／英文（僅繁體中文） | 用詞一致；程式邏輯不改 |
| src/components/ReviewBoard.tsx:95 | 家事訴訟 → 家事事件 | 用詞一致；程式邏輯不改 |
| src/components/__tests__/cinematic-opening.test.tsx:66 | 舊中文斷言 → 與文案相同的新中文斷言 | 用詞一致；程式邏輯不改 |
| src/components/builder/canvas/ai-section-generator-copy.ts:62 | 韓語／日語／英語 → 韓文／日文／英文（僅繁體中文） | 用詞一致；程式邏輯不改 |
| src/components/builder/canvas/seo-panel-basics-copy.ts:42 | 韓語／日語／英語 → 韓文／日文／英文（僅繁體中文） | 用詞一致；程式邏輯不改 |
| src/components/floating-ai-quick-replies.ts:317、318 | 化妝品 → 化粧品 | 用詞一致；程式邏輯不改 |
| src/data/__tests__/column-007-public-reference-sync.test.ts:516 | 舊中文斷言 → 與文案相同的新中文斷言 | 用詞一致；程式邏輯不改 |
| src/data/__tests__/home-stats-factual-claims.test.ts:30 | 舊中文斷言 → 與文案相同的新中文斷言 | 用詞一致；程式邏輯不改 |
| src/data/__tests__/intent-pages-semiconductor.test.ts:322 | 舊中文斷言 → 與文案相同的新中文斷言 | 用詞一致；程式邏輯不改 |
| src/data/insights-archive.ts:260、267 | 化妝品 → 化粧品 | 用詞一致；程式邏輯不改 |
| src/data/intent-pages.ts:445、468、568 | 化妝品 → 化粧品 | 用詞一致；程式邏輯不改 |
| src/data/service-details.ts:117、226 | 家事訴訟 → 家事事件；韓語 → 韓文（口譯服務實質待律師確認） | 用詞一致；程式邏輯不改 |
| src/lib/ai-intake/copy.ts:153、164、206 | 化妝品 → 化粧品 | 用詞一致；程式邏輯不改 |
| src/lib/builder/canvas/__tests__/home-zh-hant-desktop-parity.test.ts:84、112 | 舊中文斷言 → 與文案相同的新中文斷言 | 用詞一致；程式邏輯不改 |
| src/lib/builder/canvas/decompose-page-pricing.ts:90 | 韓語／日語／英語 → 韓文／日文／英文（僅繁體中文） | 用詞一致；程式邏輯不改 |
| src/lib/builder/canvas/home-zh-hant-parity.ts:314 | 諮詢。並依 → 諮詢。以下依（同步目前版輸出） | 用詞一致；程式邏輯不改 |
| src/lib/builder/components/container-gallery-copy.ts:345 | 韓語／日語／英語 → 韓文／日文／英文（僅繁體中文） | 用詞一致；程式邏輯不改 |
| src/lib/builder/components/gallery/__tests__/gallery-render-localization.test.tsx:115 | 舊中文斷言 → 與文案相同的新中文斷言 | 用詞一致；程式邏輯不改 |
| src/lib/builder/site/header-mega.ts:46 | 家事訴訟 → 家事事件 | 用詞一致；程式邏輯不改 |
| src/lib/consultation/copy.ts:271 | 化妝品 → 化粧品 | 用詞一致；程式邏輯不改 |
| src/lib/consultation/engine.ts:1163 | 化妝品 → 化粧品 | 用詞一致；程式邏輯不改 |

保留項目：舊版首頁比對表的 `before`、`priorAfter`、舊版 FAQ 相容性字串及歷史測試資料保持原樣；諮詢分類器中的「化妝品」比對詞、日文的「家事訴訟」、文章來源引用亦不改。這些字串牽涉舊資料比對、分類邏輯、其他語言或引用，不納入一般顯示文案置換。

驗證結果：相關11個測試檔、233項測試全部通過（Vitest）；`git diff --check` 通過。以本回合編輯前快照核對32個原始碼／測試檔的70個中文字串差異，非字串程式碼、物件鍵名、其他語言、數字、網址、Email及受保護作者文字均未變更；24筆法律／事實原文保留（第18筆僅統一韓文用詞）。紀錄共40筆，律師確認清單含24筆及6個關聯版位。未 commit、push，未執行 `npm run build`。

採納 16 筆，不採納 24 筆
