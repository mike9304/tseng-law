# Round 0 — zh-hant 核心頁面改寫紀錄

範圍：CORE-FILES.txt 所列檔案之 zh-hant 字串；另為全站用詞一致，連帶修改同句文案所在的 `header-mega.ts`、`decompose-page-pricing.ts`、`decompose-page-shared.ts`、`decompose-contact.ts`、`decompose-case-results.ts`、`decompose-offices.ts`、`ButtonElement.tsx`（aria-label）、`search/page.tsx`（「洞見」分頁名）。對應單元測試／Playwright 僅同步更新字串常數。

## 代表性改動

- src/data/site-content.ts:1038 | 勞資/刑民/家事 → 勞資/民刑/家事 | 台灣慣用「民刑事」順序，「刑民」不自然；同步修改 heroHighlights、keywords、majorNews、featured 共 6 處
- src/data/site-content.ts:1042 | 投資與訴訟全流程協助／並為相關訴訟提供全流程支援 → 投資與訴訟全程協助／並全程處理相關訴訟 | 「全流程」「提供支援」為大陸用語與名詞化翻譯腔
- src/data/site-content.ts:1102 | 具備韓國、日本跨境實務經驗的專業團隊，協助處理台灣法律議題。 → 以韓國、日本跨境實務經驗，協助您處理台灣法律問題。 | 刪除「專業團隊」套話；「法律議題」改台灣慣用「法律問題」
- src/data/site-content.ts:1174 | 醫療糾紛被害家屬獲大學醫院賠償300萬 TWD。 → 醫療糾紛被害人家屬獲大學附設醫院賠償新台幣300萬元。 | 「大學醫院」為韓文直譯（대학병원）；中文行文不寫「TWD」，金額數字不變
- src/data/site-content.ts:1182 起 | 多名投資人取得數百萬 TWD補償／交通事故被害人取得290萬 TWD損害賠償 → 獲得新台幣數百萬元補償／獲賠新台幣290萬元 | 同上，統一幣別寫法（badge 的 amount 欄位維持原樣）
- src/data/site-content.ts:1353 | 投資·公司設立（另 民事訴訟·損害賠償、勞動法·僱傭爭議、智慧財產·金融爭議） → 投資與公司設立／民事訴訟與損害賠償／勞動與僱傭爭議／智慧財產與金融爭議 | 以「·」表示並列是韓文排版習慣；同步 service-details、Header、header-mega、footer
- src/data/site-content.ts:1354 | …全程協助外國投資人（包含韓國企業）在台落地。涵蓋化妝品… → …全程協助外國投資人（含韓國企業）在台設立營運據點。另處理化妝品… | 「落地」為大陸商業用語；句構重排使「從…到…」完整
- src/data/site-content.ts:1377 | 以事務所諮詢語言（中文、韓文、日文、英文）全程支援外國當事人之台灣訴訟程序。 → 外國當事人在台灣的訴訟程序，可全程以中文、韓文、日文或英文溝通。 | 「以事務所諮詢語言…支援」為直譯；改為主語清楚的平實句
- src/data/site-content.ts:1399 | 親權（監護權）與探視權 → 親權（監護權）與會面交往 | 台灣家事實務與法條用語為「會面交往」
- src/data/site-content.ts:1400 | 台灣繼承法：配偶與子女應繼分計算 → 民法繼承編：配偶與子女應繼分計算 | 台灣無「繼承法」單行法，規定於民法繼承編
- src/data/site-content.ts:1401 | 剩餘財產分配請求權（婚姻存續期間差異） → 剩餘財產分配請求權（婚後財產差額） | 原括號語意不明；民法第1030條之1 的標的是婚後財產差額
- src/data/site-content.ts:1410 | 處理台灣法下的解僱…依個案區分契約終止的法定依據…並按新舊制年資計算，檢視… → 處理解僱…依個案釐清終止契約的法定依據…按新舊制年資分別計算；並檢視… | 「台灣法下的」為韓文直譯（대만법상）；拆分過長單句
- src/data/site-content.ts:1413 | 勞工依第14條終止契約 → 勞工依勞基法第14條終止契約 | 補足法規名稱，避免條號無所依附（條號不變）
- src/data/site-content.ts:1426 | 提供法規違反刑事風險預檢（非法提取資本最高5年有期徒刑…） → 並事先評估違反法規的刑事風險（如違法抽回資本最重可處5年有期徒刑…） | 「法規違反」「預檢」為韓文語序／用語；刑度用「最重」；與 service-details 統一為「違法抽回資本」
- src/data/site-content.ts:1440 | 台灣商標先申請確認與註冊代辦 → 台灣商標檢索與註冊代辦 | 台灣實務稱「商標檢索」
- src/data/site-content.ts:1456 | 一審判賠157萬TWD，二審和解 → 一審判賠新台幣157萬元，二審和解 | 幣別寫法；同步 HomeCaseResultsSplit、decompose-case-results（description／summary 亦改：「因而提起損害賠償請求」→「提起損害賠償訴訟」，免責語縮短）
- src/data/site-content.ts:1584 | 法律簡報／投資法規簡報（準備中） → 法律快訊／投資法規快訊（準備中） | 台灣「簡報」多指投影片簡報，Newsletter 宜作「快訊」
- src/data/site-content.ts:1651 | 若遇到疑似冒名或釣魚訊息，請勿開啟連結或檔案，並透過官方管道確認。 → 如收到疑似冒名或釣魚訊息，請勿點選連結或開啟附件，並透過本所官方管道查證。 | 動詞具體化，符合台灣防詐宣導用語
- src/data/site-content.ts:1727 | 台灣法律議題，立即諮詢。 → 台灣法律問題，歡迎來信諮詢。 | 「立即諮詢」行銷語氣過強；本站唯一管道為電子郵件
- src/data/site-content.ts:1777 | 洞見 → 專欄 | 「洞見」為 Insights 直譯；全站統一稱「專欄」（hero quickLinks、search 分頁、section-dot-nav、search/page.tsx 同步）
- src/data/service-details.ts:43 | 若由韓國銀行匯出，公開說明記載本人臨櫃與海外直接投資申報，此為韓國相關例外… → 若由韓國銀行匯出，依公開資料須由本人臨櫃辦理並申報海外直接投資；此為韓國方面的規定… | 「公開說明記載」語意不通，重寫為完整句
- src/data/service-details.ts:227 | 非法抽逃資金：公司法第9條——最高5年有期徒刑或50萬至250萬TWD罰金。 → 違法抽回資本（公司法第9條）：最重5年有期徒刑，或新台幣50萬元至250萬元罰金。 | 「抽逃資金」為大陸用語；幣別與刑度寫法；條號、金額、「或」字不變
- src/data/service-details.ts:264 | 商標申請、審查、註冊一站式代辦；侵權時可發警告函… → 代辦商標申請、審查至註冊；遭侵權時，可寄發警告函… | 刪除「一站式」套話
- src/data/attorney-profiles.ts:174 | 可用韓文、中文、日文直接對接韓國客戶與台灣在地程序 → 能以韓文、中文、日文直接與韓國客戶溝通，並處理台灣在地程序 | 「對接」為大陸用語
- src/data/team-members.ts:118 | …涵蓋公司設立、訴訟與合規顧問。 → …範圍涵蓋公司設立、訴訟與法令遵循顧問。 | 「合規」為大陸用語，台灣稱「法令遵循（法遵）」
- src/data/team-members.ts:163 | 曾於多家法律事務所擔任資深法務專員多年，累積…多元法律實務經驗，是一位經驗豐富的法務專員。 → 曾於多家法律事務所擔任資深法務專員多年，在訴訟支援、公司法務及外國人投資等領域累積豐富的法律實務經驗。 | 刪除重複的自我評價句；保留原意與字數（about／lawyers 頁的 builder 版面高度依字數估算，縮短會使 baseline 少一行）
- src/data/faq-content.ts:97 | 將剩餘資產匯回本國 → 將剩餘資產匯回母國 | 對台灣讀者「本國」即台灣，語意相反
- src/data/faq-content.ts:130 | 財產分割 → 夫妻財產分配 | 「財產分割」為韓文直譯（재산분할）
- src/components/PricingCards.tsx:92 起 | NTD (新台幣)／韓語·英語·中文·日語諮詢皆可／報價諮詢／含投資許可 + 公司登記 + 營業登記 → 新台幣（NTD）／可使用韓語、英語、中文、日語／個案報價／含投資許可、公司登記及營業登記 | 全形標點、並列用頓號；價格數字未動；同步 decompose-page-pricing
- src/components/IntentLandingPage.tsx:78 | 最適合處理此搜尋主題的律師 → 承辦此類案件的律師 | 律師倫理：避免「最」字自我宣稱
- src/app/[locale]/services/[slug]/page.tsx:88 | 聯絡我們 → 電子郵件諮詢 | 按鈕為 mailto，與全站 CTA 用詞一致（專欄頁、律師頁、律師卡、404 頁同步）
- src/components/HeroSearch.tsx:65 | 向下滾動 → 向下捲動 | 「滾動」為大陸用語，台灣介面用「捲動」（ButtonElement 預設 aria-label 同步）
- src/data/page-copy.ts:120 | 服務費用說明 → 收費標準 | 與導覽列「收費標準」一致

## 總結

**改了哪些類型的問題**
1. 韓文直譯與韓式排版：以「·」表並列、「台灣法下的」、「法規違反…預檢」、「大學醫院」、「財產分割」、「事務所諮詢語言」等。
2. 大陸用語：全流程、落地、對接、合規、抽逃資金、滾動等。
3. AI／行銷套話與自我評價：專業團隊、一站式、是一位經驗豐富的…、立即諮詢、「最適合」。
4. 名詞化翻譯腔：「提供…等協助」「進行…」「爭議應對」「方向建議」改為動詞句。
5. 台灣法律用語：會面交往、民法繼承編、商標檢索、法令遵循、「最重」刑度、勞基法條號補法規名。
6. 幣別與標點：中文句內「157萬 TWD」改「新台幣157萬元」（數字不變；卡片 badge 的 amount 欄位保留原樣），半形括號與「+」改全形／頓號。
7. 全站用詞統一：專欄（取代「洞見」「部落格」指稱 /columns）、收費標準、電子郵件諮詢（mailto 按鈕）、服務領域名稱統一為「A與B」。

**刻意不改（需要另行決定）**
- `home-zh-hant-parity.ts` 的 `STOCK_LANGUAGE_TEXT` 鎖住三句：stats.description（「…英文4種語言的台灣法律諮詢。並依官方律師簡介整理…」，句首「並」不順）、team-members 的 intro[0]（「專精企業與個人案件。事務所可提供…法律溝通。」）、FAQ「諮詢方式如何進行？」答案。July 發布首頁以 before/priorAfter/after 三組完整文字比對＋fingerprint 判定；若只改 `after`，已存成現行 `after` 的文件將不再被辨識，projection 失效。要改需新增一組歷史 group（屬程式邏輯變更），本輪未動。建議版本：「事務所以中文、韓文、日文、英文4種語言提供台灣法律諮詢；依官方律師簡介整理：4個台灣辦公據點、7項主要執業領域，以及TOPIK 6級與JLPT N1兩項最高級別語言資格。」
- `hero.searchPlaceholder`／`search.placeholder`「我們可以如何協助您？」：`published-home-editorial.ts` 的 `julySearchControlMismatch` 以此字串比對已儲存 July 首頁的搜尋框 placeholder，改了會讓 zh-hant 首頁失去 editorial hero 呈現，故保留。
- HeroSearch／decompose-hero／home-zh-hant-parity 的「申請電子郵件諮詢」：parity 插入節點的 label 會進入 July fingerprint，改字會破壞比對，保留。
- 受 public-reference-sync 測試與專欄原文綁定的法律內容（civil／family／labor keyPoints、civil／labor intro、insights-archive 內 007/010/012/014/016 對應卡片與其他卡片的雜湊）未改；本輪曾修改 insights-archive 的物流、自願離職摘要與「解雇」關鍵字，但 column-012 測試凍結其他卡片的 SHA，改動會被視為非預期變更，故已還原。
- stats 標題「從官方資料看跨境服務基礎」為審閱過的 factual-claims 合約，保留；僅將計數標籤「業務溝通語言」改為與律師頁一致的「諮詢語言」。
- firm-introduction.ts 為官網原文引用（含「全方面」等），只修「來源:」為全形冒號。
- `scripts/patch-zh-hero-2026-07-21.mjs` 為歷史一次性腳本，未改。

**不確定、請律師確認**
- 「大學醫院」→「大學附設醫院」：若原案為特定醫學中心，請確認用語。
- 「交換聽講生」（首頁學歷）與律師頁「交換」並存，未統一；是否為交換學生或聽講生需依官方簡歷確認。
- 「勞資/民刑/家事」中「民刑」縮寫是否符合事務所偏好（亦可用「民刑事」）。
- 已存於 Builder（Blob/DB）的首頁與頁面文件保存當時的文字；本輪只改程式預設、seed 與非 Builder 頁面。已發布的 Builder 頁面需重新 seed 或在編輯器內手動更新，才會顯示新文案。

**測試同步與驗證**
- 以完全相同字串斷言舊文案的測試（單元測試 20 個檔案、Playwright 4 個檔案）只更新字串常數。
- 例外一件請審閱：`src/data/__tests__/faq-content-ja-factual-consistency.test.ts` 以 SHA-256 凍結整份 zh-hant FAQ（原為日文作業時防止誤改 zh-hant 的護欄）。本輪有意修改 zh-hant FAQ，故將期望雜湊更新為新內容的 digest（`01f33b92…`）；測試邏輯未動。
- `npx vitest run`（全套）：1351 files／13142 tests passed，14 skipped，exit 0。變更的 src 檔案 `eslint --max-warnings=0`：exit 0。未執行 build／typecheck（依指示）。
