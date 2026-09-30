# 核心文案第4輪處理紀錄（Grok／core-r4）

按審閱檔實際列出的23筆計算（語言意見21筆、法律實質2筆）。部分採納僅計1筆；下方關聯版位與測試同步明細不另計件數。所有未採納項目保持原文，審閱者的法律與事實判斷不代表已確認。

- src/data/site-content.ts:1437 | 並分析金融商品與投資契約爭議、代理訴訟。 → 並分析金融商品與投資契約爭議，代理相關訴訟。 | 採納：改以動詞分別連接「分析爭議」與「代理訴訟」。未照建議刪去「代理」，保留原服務內容。
- src/data/service-details.ts:169 | 台灣資遣費制度與韓國在適用事由及計算方式上不同 → 台灣與韓國的資遣費制度，在適用事由及計算方式上不同 | 採納：補齊比較兩端的句構；法定依據、年資、預告及期間敘述均保留。
- src/data/site-content.ts:1102 | 以韓、日跨境實務經驗，協助處理台灣法律問題。 → 以韓、日跨境實務經驗，協助處理台灣法律問題。 | 不採納：加入「台韓、台日」會明定跨境經驗涉及的國家組合，屬經歷事實；保留原文，追加律師待確認。
- src/data/team-members.ts:164 | 負責訴訟支援、公司設立、外國人投資核准、各類許可申請及韓台聯繫。 → 負責訴訟支援、公司設立、外國人投資核准、各類許可申請及韓台聯繫。 | 不採納：涉及法務專員實際職責，以及核准與申請的程序角色；保留原文，追加律師待確認。
- src/data/insights-archive.ts:310 | 彙整公司設立後就業簽證與居留證常見問題。 → 彙整公司設立後就業簽證與居留證常見問題。 | 不採納：「台灣沒有此簽證類別」屬法律分類判斷；刪除「就業」也會擴大摘要與關鍵字範圍。摘要及第314行關鍵字均保留，追加律師待確認。
- src/data/site-content.ts:1242 | date: '常設' → date: '常設' | 不採納：「常設」可作服務狀態標示；「長期提供」同樣不是日期，未解決所述問題，且另改服務期間的描述。第1249、1256行亦保留。
- src/data/faq-content.ts:122 | 在健身房或場所設施受傷，可以請求損害賠償嗎？ → 在健身房或其他場所受傷，可以請求損害賠償嗎？ | 採納：消除「場所設施」的疊詞；回答中的法律要件完全保留。
- src/data/firm-introduction.ts:41 | 能聆聽當事人需求，而給予適切的訴訟策略 → 能聽取需求，並提出適切的訴訟策略 | 採納：以「並」連接動作，省去前文已出現的「當事人」，保留原評述。
- src/data/attorney-profiles.ts:188 | 可以。曾雋崴律師能以韓文、中文、日文協助整理事實與文件、安排程序；事務所另提供英文諮詢，方便韓國客戶了解台灣法律程序。 → 可以。曾雋崴律師能以韓文、中文、日文協助整理事實與文件、安排程序。事務所另提供英文諮詢。 | 採納：拆句並刪除指向不清的便利性尾語；各語言及服務內容保留。此為律師頁「韓文諮詢」問答，非首頁鎖定的「諮詢方式」答案。
- src/data/firm-introduction.ts:39 | 臺中分所為工程案件、智慧財產及韓國、日本事務專所，另提供智慧財產申請與法律爭議處理。 → 台中分所專門承辦工程案件、智慧財產申請與法律爭議，以及韓國、日本事務。 | 採納：改寫「事務專所」的直譯句構，合併重複的智慧財產敘述；保留專門承辦的原意、全部領域及高雄分所原文。一般行文改用「台」。
- src/data/insights-archive.ts:243 | readTime: '8分' → readTime: '8分鐘閱讀' | 採納：依同頁既有「分鐘閱讀」格式統一；第254、265、276行同步改為「7分鐘閱讀」「3分鐘閱讀」「2分鐘閱讀」。數字未變，column-010完全相同字串的測試同步更新。
- src/data/service-details.ts:266 | 金融商品爭議事實分析與訴訟策略、投資契約違約損害賠償、股東間經營權爭議處理。 → 分析金融商品爭議的事實並擬定訴訟策略，處理投資契約違約的損害賠償，以及股東間的經營權爭議。 | 採納：補上動詞，使三項工作讀得清楚；保留事實分析、訴訟策略及全部爭議類型。
- src/data/service-details.ts:93 | CCTV、病歷、收據 → 監視器畫面、病歷、收據 | 採納：同句結尾「取得CCTV」亦改為「取得監視器畫面」，與FAQ一致。報案、調取、保全及不保證取得影像的保留語未變。
- src/data/site-content.ts:1047 | 跨境法律溝通 → 跨境法律溝通 | 不採納：「溝通」涵蓋理解需求與說明法律，與單向「說明」並非同義；原標題無明確語病，屬偏好，保留。
- src/data/site-content.ts:1440 | 台灣商標檢索與註冊代辦 → 台灣商標檢索與註冊代辦 | 不採納：「代辦」可表達受託辦理，沒有必然排除律師受任的語意；改「申請／申辦」只是偏好。service-details.ts:264及PricingCards.tsx:129、Builder定價副本均保留；既有救濟疑問已列core-r1，不重複登錄。
- src/data/site-content.ts:1450 | 曾雋崴律師，台灣在地與跨境法律的實務夥伴 → 曾雋崴律師，在地與跨境客戶的台灣法律夥伴 | 採納：統一首頁相同段落標題。HomeAttorneySplit.tsx:25已是建議字串，無須重寫；首頁鎖定的律師介紹第一句保持原樣。
- src/data/team-members.ts:163 | 曾於多家法律事務所擔任資深法務專員多年，在訴訟支援、公司法務及外國人投資等領域累積豐富的法律實務經驗。 → 曾於多家法律事務所擔任資深法務專員多年，在訴訟支援、公司法務及外國人投資等領域累積法律實務經驗。 | 採納：僅採納刪除誇大修飾語「豐富」；不照建議刪去工作領域等經歷事實。「法律實務」是否誤指律師業務的部分保留，追加律師待確認。
- src/components/Header.tsx:307 | label: '媒體中心', href: '/zh-hant/videos' → label: '影音', href: '/zh-hant/videos' | 採納：統一繁體中文導覽與快速連結名稱；頁首選單標題、頁尾及Builder共用導覽同步，href與其他語言不變；下拉「影音專區」保留。
- src/data/site-content.ts:1382 | 消費者保護與企業訴訟 → 消費者保護與企業訴訟 | 不採納：改成「企業間訴訟」會排除企業與非企業當事人的訴訟，屬服務範圍變更；保留原文，追加律師待確認。
- src/data/faq-content.ts:152 | 事先掌握產業法規，並與設立程序同步進行，可節省時間與成本。 → 事先掌握產業法規，並與設立程序同步進行。 | 採納：刪除未具體說明的省時省錢效益；產品登錄與PIF說明全部保留。
- src/data/firm-introduction.ts:40 | 屏東分所主持律師謝宛均律師 → 屏東分所主持律師謝宛均 | 採納：刪除重複稱謂，不變更人名或主持律師職稱。
- src/data/faq-content.ts:119 | 之後依序處理過失比例認定、保險理賠，以及和解或訴訟。 → 之後依序處理過失比例認定、保險理賠，以及和解或訴訟。 | 不採納：涉及程序順序；即使只刪「依序」也會變更原程序敘述。保留原文，追加律師待確認。
- src/data/service-details.ts:229 | 無工作許可在台工作被查獲者，3年內禁止入境。 → 無工作許可在台工作被查獲者，3年內禁止入境。 | 不採納：涉及禁止入境的法律適用範圍與期間；保留原文及數字，追加律師待確認。

## 關聯版位與測試同步（不另計件數）

- src/data/site-content.ts:1025 | { label: '媒體中心', href: '/zh-hant/videos' } → { label: '影音', href: '/zh-hant/videos' } | 採納：同步同一繁體中文用詞或完全相同字串的測試斷言；不變更程式或測試邏輯。
- src/data/site-content.ts:1753 | { label: '影音內容', href: '/zh-hant/videos' } → { label: '影音', href: '/zh-hant/videos' } | 採納：同步同一繁體中文用詞或完全相同字串的測試斷言；不變更程式或測試邏輯。
- src/data/insights-archive.ts:254 | readTime: '7分' → readTime: '7分鐘閱讀' | 採納：同步同一繁體中文用詞或完全相同字串的測試斷言；不變更程式或測試邏輯。
- src/data/insights-archive.ts:265 | readTime: '3分' → readTime: '3分鐘閱讀' | 採納：同步同一繁體中文用詞或完全相同字串的測試斷言；不變更程式或測試邏輯。
- src/data/insights-archive.ts:276 | readTime: '2分' → readTime: '2分鐘閱讀' | 採納：同步同一繁體中文用詞或完全相同字串的測試斷言；不變更程式或測試邏輯。
- src/components/Header.tsx:405 | title: '媒體中心' → title: '影音' | 採納：同步同一繁體中文用詞或完全相同字串的測試斷言；不變更程式或測試邏輯。
- src/components/HeroSearch.tsx:35 | label: '影音/頻道', href: '/zh-hant/videos' → label: '影音', href: '/zh-hant/videos' | 採納：同步同一繁體中文用詞或完全相同字串的測試斷言；不變更程式或測試邏輯。
- src/components/builder/published/SiteHeader.tsx:48 | 'zh-hant': '媒體中心' → 'zh-hant': '影音' | 採納：同步同一繁體中文用詞或完全相同字串的測試斷言；不變更程式或測試邏輯。
- src/lib/builder/site/public-header-navigation.ts:15 | 'zh-hant': '媒體中心' → 'zh-hant': '影音' | 採納：同步同一繁體中文用詞或完全相同字串的測試斷言；不變更程式或測試邏輯。
- src/lib/builder/site/header-mega.ts:73 | 'zh-hant': '媒體中心' → 'zh-hant': '影音' | 採納：同步同一繁體中文用詞或完全相同字串的測試斷言；不變更程式或測試邏輯。
- src/data/__tests__/column-010-public-reference-sync.test.ts:48 | readTime: '7分' → readTime: '7分鐘閱讀' | 採納：同步同一繁體中文用詞或完全相同字串的測試斷言；不變更程式或測試邏輯。
- src/data/__tests__/column-010-public-reference-sync.test.ts:90 | CCTV、病歷 → 監視器畫面、病歷 | 採納：同步同一繁體中文用詞或完全相同字串的測試斷言；不變更程式或測試邏輯。
- src/data/__tests__/column-010-public-reference-sync.test.ts:90 | 取得CCTV。 → 取得監視器畫面。 | 採納：同步同一繁體中文用詞或完全相同字串的測試斷言；不變更程式或測試邏輯。
- src/data/__tests__/column-012-public-reference-sync.test.ts:181 | CCTV、病歷 → 監視器畫面、病歷 | 採納：同步同一繁體中文用詞或完全相同字串的測試斷言；不變更程式或測試邏輯。
- src/data/__tests__/column-012-public-reference-sync.test.ts:181 | 取得CCTV。 → 取得監視器畫面。 | 採納：同步同一繁體中文用詞或完全相同字串的測試斷言；不變更程式或測試邏輯。
- src/data/__tests__/column-014-public-reference-sync.test.ts:52 | 台灣資遣費制度與韓國在適用事由及計算方式上不同， → 台灣與韓國的資遣費制度，在適用事由及計算方式上不同， | 採納：同步同一繁體中文用詞或完全相同字串的測試斷言；不變更程式或測試邏輯。

- src/lib/builder/canvas/decompose-hero.ts:43 | label: '影音/頻道', href: '/zh-hant/videos' → label: '影音', href: '/zh-hant/videos' | 採納：同步Builder首頁快速連結的繁體中文名稱；不變更href與其他語言。

## 驗證

執行 `npm run test:unit --`，指定 column-010／012／014-public-reference-sync、home-editorial-presentation、ja-videos-components、home-zh-hant-parity、seed-home-zh-hant-parity、site-header-nav、published-site-header-copy、header-mega-intro 共10個測試檔：98項通過、1項失敗（總計99項）。

唯一失敗是 `src/data/__tests__/column-012-public-reference-sync.test.ts:522` 的全批繁體中文索引固定SHA-256斷言。用本輪修改前快照計算，已為 `a6e0f44434456231a78db4cf3ff26904995ec1b49db6674636e496eb9effe4b8`，與測試預期 `923cb38dd5a2dc43133b073846c92c9b59e9fe68b38091b5c9698cd7df1beeb5` 不符；本輪更新四筆閱讀時間後為 `86228a23f949ad80ad073ed4a8a44cbc3d129b6023380f9877a38426e0fda40d`。因此此固定斷言本輪開始前即已過時。韓文、英文索引雜湊與修改前相同，繁體中文索引本輪只有四筆readTime字串改動。雜湊值非繁體中文字串，不屬「完全相同中文」的測試同步範圍，本輪保留該斷言，不調整測試邏輯或雜湊常數。

TypeScript語法樹檢查確認16個來源／測試檔的改動均限於字串；7個鎖定來源／測試檔與快照相同，首頁鎖定文案保持原樣。16個來源／測試檔的 scoped ESLint（`--max-warnings=0`）及 `git diff --check` 通過，已搜尋被採納的舊字串並確認正式文案無遺漏。法律AI助理作者框、引用與其他語言未改。不執行 build、commit 或 push。

採納 14 筆，不採納 9 筆
