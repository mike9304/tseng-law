# WO-I18N-ZH-COL011 — 台灣化粧品法規全面現地化

Date: 2026-07-25 KST  
Manager: Codex `/root`

## 目標

將繁體中文版 011 專欄全面改寫為台灣法律實務使用的繁體中文。
產品登錄與 PIF 的建立、更新及保存必須明確分開，並刪除舊機關名稱、
固定辦理期間、PIF 上傳／登錄／核准、文件缺漏即自動回收及把行政
罰鍰寫成罰金等錯誤。

事實範圍以已完成現行法審查的 JA011 與 KO011 為準，但不得逐句翻譯。

- `src/content/columns-ja/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md`
- `src/content/columns/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md`
- `docs/audit/WO-I18N-JA-COL011-COSMETICS-2026-07-24.md`
- `docs/audit/WO-I18N-KO-COL011-COSMETICS-2026-07-25.md`

## 執行者允許修改

1. `src/content/columns-zh/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md`
2. `src/lib/__tests__/columns-zh-investment-011.test.ts`（新增）

不得修改 WO、其他語言、共用程式、圖片或 embeddings。不得 stage、
commit、push、deploy 或操作伺服器。

## Frontmatter

- title 與 H1：
  `進入台灣化粧品市場：進口主體、產品登錄、PIF 的建立與保存及廣告規範`
- 保留 source URL、分類 `台灣公司設立` 與 featured image。
- `lastmod: "2026-07-25"`
- `date_display: "2026年2月4日"`
- FAQ 僅限下列三組。
- 對 frontmatter 外公開本文，圖片只保留 alt、連結只保留標籤，
  移除 URL 與 Markdown 語法後，以 `/\p{Script=Han}/gu` 計算可見
  漢字，`Math.ceil(hanCount / 400)`，格式 `N分鐘閱讀`。
  完稿後在測試固定實際漢字數與分鐘數；至少 2,500 個漢字。

## 固定 FAQ、H2 與本文位置

每一 FAQ 答案必須逐字重複為對應 H2 後的第一段，中間不得插入圖片、
引言或其他文字。

### FAQ 1

- Heading: `## 1. 進入台灣市場的方式與進口主體`
- Q:
  `在台灣銷售化粧品，是否一定要設立子公司或分公司？`
- A:
  `不一定。若由台灣進口業者（包括同時擔任銷售代理商者）負責進口及銷售，外國品牌可以不另設台灣子公司或分公司。若品牌要自行在台灣經營，台灣子公司與外國公司在台分公司的設立或登記、責任及稅務架構不同；僑外投資核准及公司或分公司登記所需時間，也會依個案及補件情形而異。應先確定商業模式，以及由誰擔任化粧品製造或輸入業者並承擔法定責任。`

### FAQ 2

- Heading: `## 2. 產品登錄與 PIF 是不同制度`
- Q:
  `PIF 是什麼？與向 TFDA 辦理產品登錄是同一程序嗎？`
- A:
  `不是。產品登錄是化粧品製造或輸入業者透過 TFDA 化粧品產品登錄平台辦理的獨立程序。PIF 是彙整產品品質、安全、成分、功能、製造方法、試驗結果及安全性評估等資料的產品資訊檔案，由化粧品製造或輸入業者建立、更新並保存；PIF 本身無須事前提交 TFDA。自 2026 年 7 月 1 日起，其餘化粧品也納入 PIF 制度，原則上所有化粧品均受規範；僅免辦理工廠登記之化粧品製造場所生產的固態手工香皂例外。`

### FAQ 3

- Heading: `## 3. 標示、宣傳及廣告規範`
- Q:
  `化粧品廣告應注意哪些表現？`
- A:
  `化粧品廣告不能只看個別用詞，而須就品名、文字敘述、圖案、符號、影像、聲音及其他訊息的相互關聯，依整體表現綜合判斷。不得有虛偽、誇大或醫療效能，例如宣稱治療痘痘、抗發炎或殺菌，均應特別審慎。行政罰鍰方面，虛偽或誇大廣告為新臺幣 4 萬元以上 20 萬元以下；涉及醫療效能者為新臺幣 60 萬元以上 500 萬元以下。網紅或評論者的貼文如依內容及商業脈絡實質上屬於廣告，也應按同一標準檢視。`

## 本文契約

### 導言

中立說明外國／韓國化粧品品牌必須分別決定進口主體、產品登錄、PIF、
標示廣告及查核處分的安排。不得加入市場排名、消費力、客戶對話、
成功案例或諮詢招攬。

### 1. 進口主體

固定子標題：

- `### 委由台灣進口業者處理`
- `### 由品牌自行在台灣經營`

必須說明：

- 台灣進口業者或銷售代理商負責進口及銷售時，外國品牌可不設自有
  子公司或分公司。
- 代理／經銷名稱不決定法定責任；契約應處理進口、產品登錄、PIF
  資料提供與移交、標示、廣告預審、安全資訊、回收合作、費用及終止。
- 子公司與外國公司在台分公司的設立／登記、法人格、本公司責任、
  會計稅務、盈餘移轉與代表權不同。
- 使用現名 `經濟部投資審議司`，不得承諾固定期間。
- 法定責任主體寫作 `化粧品製造或輸入業者`，不得改為
  `產品登錄者` 或 `國內負責人`。

### 2. 產品登錄與 PIF

固定子標題：

- `### 產品登錄的時點與效期`
- `### PIF 的內容與分階段施行`
- `### PIF 的更新與保存`
- `### 查核、限期改正與行政處分`

必須包含：

- 產品登錄須在供應、販賣、贈送、公開陳列或提供消費者試用前完成。
- 登錄效期三年；延續供應者於效期屆滿前三個月內辦理展延。
- 完成產品登錄不代表 PIF 齊備或標示、廣告已確認合法。
- PIF 法定資料共 16 類。
- 自 2026 年 7 月 1 日起，其餘化粧品也納入，原則上全部適用；
  例外僅限免辦工廠登記的製造場所生產之固態手工香皂。
- 合格第三人可協助，但化粧品製造或輸入業者的責任不移轉。
- 原料、配方、製造方法／場所、標示、功能或安全資訊變更時更新。
- PIF 自產品最後上市日之次日起至少保存五年；此期間依 PIF 管理辦法
  第 7 條。
- 保存場所依同辦法第 8 條，為《化粧品衛生安全管理法》第 7 條
  第 1 項第 7 款所定之製造或輸入業者標示地址。
- 原製造者原本或安全電子／雲端儲存仍須完整、可迅速調取，並管理
  權限、備份、版本及契約終止後移交。
- 查核原則上七日前通知；情況緊急或公共利益需要時例外。
- 產品登錄或 PIF 資料不實：新臺幣 1 萬元以上 100 萬元以下罰鍰。
- PIF 不完整通常先限期改正，屆期不改正才進入罰鍰規定。
- 下架、回收、沒入或銷毀須連結各自法定條件，不能將所有資料缺漏
  寫成自動結果。

### 3. 廣告

固定子標題：

- `### 依整體表現綜合判斷`
- `### 網紅、評論者與銷售夥伴`
- `### 上市前的確認順序`

必須包含：

- 品名、文字、圖案、符號、影像、聲音、前後關係及消費者整體印象。
- 痘痘治療、抗發炎、殺菌等醫療效能案例。
- 虛偽或誇大廣告罰鍰新臺幣 4 萬元以上 20 萬元以下。
- 醫療效能罰鍰新臺幣 60 萬元以上 500 萬元以下。
- 網紅、評論者或銷售夥伴貼文是否屬廣告，依對價、商品提供、銷售
  連結、發文指示、反覆合作、內容與品牌參與個案判斷；不得一概而論。
- 上市前固定確認順序：
  進口架構 → 法定責任主體 → 產品登錄 → PIF 建立、更新及保存 →
  標示與廣告 → 查核、改正及安全資訊應對。

## 台灣法律用語

統一使用：

- `化粧品`
- `化粧品製造或輸入業者`
- `化粧品產品登錄`
- `化粧品產品資訊檔案（PIF）`
- `建立、更新、保存`
- `衛生福利部食品藥物管理署（TFDA）`
- `經濟部投資審議司`
- `標示、宣傳及廣告`
- `虛偽或誇大`、`醫療效能`
- `查核`、`限期改正`、`屆期不改正`
- `罰鍰`、`新臺幣`

## 官方資料與內部連結

依下列順序使用全部 13 個官方 URL，標籤須為自然繁中：

1. `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0030013`
2. `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0030097`
3. `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=L0030098`
4. `https://www.fda.gov.tw/tc/newsContent.aspx?cid=3&id=30612`
5. `https://www.fda.gov.tw/tc/newsContent.aspx?cid=3&id=30614`
6. `https://www.fda.gov.tw/tc/includes/GetFile.ashx?id=f639179794512621908&iid=13384`
7. `https://www.fda.gov.tw/TC/siteContent.aspx?sid=3435`
8. `https://www.fda.gov.tw/TC/site.aspx?sid=12523`
9. `https://law.moj.gov.tw/LawClass/LawAll.aspx?PCODE=L0030099`
10. `https://law.moj.gov.tw/LawClass/LawGetFile.ashx?FileId=0000249593&lan=C`
11. `https://www.mohw.gov.tw/cp-4256-48110-1.html`
12. `https://investtaiwan.nat.gov.tw/showPage?lang=jpn&search=InvestmentStatus01`
13. `https://mnscdn.moea.gov.tw/Mns/dir/content/Content.aspx?menu_id=42879`

內部連結恰為以下三個且依此順序：

- `[台灣公司設立基礎](/zh-hant/columns/taiwan-company-establishment-basics)`
- `[台灣投資及公司設立服務](/zh-hant/services#investment)`
- `[曾雋崴律師簡介](/zh-hant/lawyers/wei-tseng)`

## 圖片、結尾與作者

保留 featured 與 `img-01.jpg`。featured 使用有意義繁中 alt；
`img-01.jpg` 使用空 alt 作為裝飾圖片。

三個內部連結後加入水平線，並以下列文字結尾；作者後不得有內容：

`本文僅供一般法律資訊與教育參考，不構成就任何個案提供的法律意見，亦不保證取得許可、完成登錄、得以銷售或在特定期間內完成程序。進入市場前，仍應依產品資料、進口架構、標示與廣告內容，以及主管機關最新法規與實務，就個案另行確認。`

`**曾雋崴律師（Wei Tseng）**`

## 禁止

- `PIF登錄`、`PIF 登錄`、`登錄PIF`，或 PIF 上傳、核准、認證、
  代辦登錄。
- PIF `證明市場銷售資格`。
- `產品登錄者`、`國內負責人`。
- `投資審議委員會`、`投資審查委員會`、`投審會`。
- 一般約需三個月、任何固定期間或核准／銷售保證。
- 所有手工香皂均例外、所有網紅貼文均自動成為品牌廣告、所有 PIF
  缺漏均自動回收／銷毀。
- 行政處分寫作 `罰金`。
- 消費力、客戶對話、快速進軍、品牌掌控、完善代理合約、身分證兼
  健康檢查報告、行銷避雷、繳學費、招攬諮詢或快速回覆。
- `登록`、`曾俊瑋`、`/ko/`、`/ja/`、`/en/`、Hangul、假名、
  U+FEFF、U+00A0、emoji。

## 測試與 Manager gates

新測試同時讀取 raw Markdown、gray-matter 與
`getColumnPost(..., 'zh-hant')`，驗證：

- exact title、URL、lastmod、display date、read time、category、
  featured、H1、FAQ 3 組。
- H2 後第一段與 FAQ 逐字一致。
- 進口主體、子公司、分公司、現行機關、法定責任主體。
- 登錄時點、平台、三年、屆滿前三個月。
- PIF 16 類、2026-07-01、狹義香皂例外、第三人協助／責任。
- 第 7 條保存期間、第 8 條及母法地址、五年起算、七日查核及例外。
- 不實資料／限期改正／回收銷毀區分及三組罰鍰。
- 廣告整體表現、醫療案例、網紅個案判斷。
- 13 個官方 URL、恰三個內部連結、兩張圖片、免責及作者。
- 禁止內容、錯誤語言連結、Hangul／假名、BOM／NBSP 均不存在。
- 至少 2,500 可見漢字、精確 400 字／分鐘公式、canonical slug 與
  `cosmetics-market-entry` alias。

Manager：

1. `npx vitest run src/lib/__tests__/columns-zh-investment-011.test.ts src/lib/__tests__/columns-ko-investment-011.test.ts src/lib/__tests__/columns-ja-investment-011.test.ts src/lib/__tests__/columns-faq.test.ts`
2. `npm run -s typecheck`
3. `npx eslint src/lib/__tests__/columns-zh-investment-011.test.ts`
4. `git diff --check -- src/content/columns-zh/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md src/lib/__tests__/columns-zh-investment-011.test.ts`
5. 獨立台灣中文與現行法審查；修正後重審至 PASS。
6. Playwright 以 1440×1000、390×844 檢查
   `/zh-hant/columns/taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide`：
   200、`lang=zh-Hant`、exact H1/canonical/date/read time、FAQ JSON-LD 3、
   官方來源 13、內部連結 3、四個國旗連結、其他語言／禁用字串／
   console/page error／horizontal overflow 為 0，並人工查看 screenshot。

embeddings 等全部來源完成後另行重建，不得手動修改向量。
