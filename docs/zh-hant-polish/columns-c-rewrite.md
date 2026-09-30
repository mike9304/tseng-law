# zh-hant 專欄 024–031 潤飾紀錄

日期：2026年9月30日。依 `docs/zh-hant-polish/STYLE.md` 編修。各篇均為 `author: "legal-ai-assistant"`，未改為律師第一人稱；「法律AI助理」作者框元件與標示保持原樣。

保留原有段落、法律主張、條號、金額、日期、數字、機關名稱、連結與參考資料。frontmatter 僅潤飾 025、027 的 title 與 031 的 summary；faq、seoTitle 及其餘欄位均保持原樣。

## 代表性改動

### 024｜taiwan-income-tax-residency

- 位置：`src/content/columns-zh/024-taiwan-income-tax-residency.md:25`
  - before：「人資與員工很容易先看居留證期限，卻漏了稅法採用的年度和所得來源。這幾個欄位如果一開始就分開整理，申報路徑會清楚得多。」
  - after：「人資與員工往往先看居留證期限，卻忽略稅法上的課稅年度和所得來源。一開始就分別整理這些資料，會比較容易釐清如何申報。」
  - 理由：把「欄位」「申報路徑」等機械化表達，改成讀者實際會整理的資料與申報問題。

- 位置：`src/content/columns-zh/024-taiwan-income-tax-residency.md:27`
  - before：「請先列出每個課稅年度的入出境日期、實際工作地點、雇主與付款人。下文的「居住者」專指所得稅法上的身分，並非取得外僑居留證後自動產生的稱謂。」
  - after：「判斷前，可先按課稅年度列出入出境日期、實際工作地點、雇主與付款人。下文的「居住者」專指所得稅法上的身分，並不是取得外僑居留證就當然具備的資格。」
  - 理由：降低命令語氣，將「自動產生的稱謂」改為明確的稅法身分表達。

- 位置：`src/content/columns-zh/024-taiwan-income-tax-residency.md:57`
  - before：「這組方便操作的區間，仍不能取代第7條的兩項法定標準。」
  - after：「這些區間便於理解申報實務，但仍不能取代第7條的兩項法定標準。」
  - 理由：消除「方便操作的區間」的翻譯腔，保留實務區間不能取代法定標準的原意。

### 025｜taiwan-estate-tax-foreign-decedent

- 位置：`src/content/columns-zh/025-taiwan-estate-tax-foreign-decedent.md:2`
  - before：「人在海外過世，留在台灣的財產，遺產稅課到哪裡」
  - after：「人在海外過世，台灣財產的遺產稅怎麼課？」
  - 理由：收掉標題中多餘的停頓，讓提問更像台灣法律專欄標題。

- 位置：`src/content/columns-zh/025-taiwan-estate-tax-foreign-decedent.md:45`
  - before：「第1項的納稅義務人是繼承人及受遺贈人。沒有繼承人時，是遺產管理人。繳納義務以遺產為限。遺產已移轉或滅失的，按死亡時的時價。」
  - after：「第1項規定，納稅義務人為繼承人及受遺贈人；沒有繼承人時，則為遺產管理人。繳納義務以遺產為限，遺產已移轉或滅失者，按死亡時的時價計算。」
  - 理由：銜接連續短句，補足主詞與動詞；保留納稅義務人、義務範圍及時價的原有說明。

- 位置：`src/content/columns-zh/025-taiwan-estate-tax-foreign-decedent.md:53`
  - before：「有正當理由不能如期申報的，要在期限屆滿前以書面申請延長。延長以三個月為限。不可抗力或其他特殊事由，由稽徵機關按實際情形核定。法條沒有列出哪些理由一定會准。」
  - after：「有正當理由無法如期申報者，須在期限屆滿前以書面申請延長，延長以三個月為限；因不可抗力或其他特殊事由申請者，由稽徵機關按實際情形核定。法條並未列出哪些理由必定獲准。」
  - 理由：用逗號與分號銜接一般延期與特殊事由，保留期限、例外及不保證核准的原意。

### 026｜foreign-heir-taiwan-succession-law-land

- 位置：`src/content/columns-zh/026-foreign-heir-taiwan-succession-law-land.md:27`
  - before：「中間還夾著遺產稅：稅沒有處理好，地政事務所不會辦理登記。」
  - after：「此外，還須處理遺產稅；稅務程序尚未辦妥，地政事務所不會辦理登記。」
  - 理由：將「中間還夾著」「稅沒有處理好」改成較精確、自然的程序說明。

- 位置：`src/content/columns-zh/026-foreign-heir-taiwan-succession-law-land.md:29`
  - before：「本文只談繼承人是外國人時，會多出來的部分。」
  - after：「本文著重說明外國籍繼承人須另外處理的事項。」
  - 理由：把「會多出來的部分」改為具體的涉外繼承事項，不增添法律論述。

- 位置：`src/content/columns-zh/026-foreign-heir-taiwan-succession-law-land.md:51`
  - before：「哪些文件可以收、要什麼形式，建議先向不動產所在地的地政事務所確認，再去申請文件。」
  - after：「哪些文件可供替代、須以何種形式提出，宜先向不動產所在地的地政事務所確認，再申請相關文件。」
  - 理由：將「可以收」「要什麼形式」改為文件替代與提出形式，讓讀者清楚知道要向地政事務所確認什麼。

### 027｜taiwan-employment-gold-card

- 位置：`src/content/columns-zh/027-taiwan-employment-gold-card.md:2`
  - before：「就業金卡是申請人自己向移民署提出的」
  - after：「就業金卡由申請人自行向移民署申請」
  - 理由：刪去標題的口語贅詞，保留由申請人自行向移民署申請的原意。

- 位置：`src/content/columns-zh/027-taiwan-employment-gold-card.md:37`
  - before：「## 要掛在哪個領域」
  - after：「## 申請時如何選擇專業領域？」
  - 理由：將「掛在哪個領域」改成台灣申請程序常用的「選擇專業領域」。

- 位置：`src/content/columns-zh/027-taiwan-employment-gold-card.md:35`
  - before：「出發前再讀一次這段。送件不會讓免簽證或短期停留的期限停下來。」
  - after：「出發前宜再次確認領卡規定；提出金卡申請，不會暫停計算免簽證或短期停留的期限。」
  - 理由：合併突兀的命令碎句，清楚表達送件不會暫停停留期限的原有提醒。

### 028｜taiwan-foreign-spouse-residence

- 位置：`src/content/columns-zh/028-taiwan-foreign-spouse-residence.md:27`
  - before：「如果您是台灣配偶、家人或聘僱外籍配偶的雇主，也可以用這篇確認配偶居留與工作的基本規定。」
  - after：「台灣配偶、家人或聘僱外籍配偶的雇主，也可參考本文，了解配偶居留與工作的基本規定。」
  - 理由：省略不必要的「您」，改由台灣配偶、家人與雇主作主詞。

- 位置：`src/content/columns-zh/028-taiwan-foreign-spouse-residence.md:43`
  - before：「居留許可核准前不適用，順序要留意。」
  - after：「居留許可核准前，尚不適用。」
  - 理由：刪去「順序要留意」的泛泛提醒，保留工作許可例外須先取得居留許可的條件。

- 位置：`src/content/columns-zh/028-taiwan-foreign-spouse-residence.md:71`
  - before：「階段與期間都不同，請不要直接套用本文，而應另行查閱該條例與移民署的說明。」
  - after：「申請階段與期間都不同，不能直接套用本文，須另行查閱該條例與移民署的說明。」
  - 理由：將命令式提醒改成平實說明，保留大陸地區配偶須適用不同規定的原意。

### 029｜taiwan-permanent-residence-aprc

- 位置：`src/content/columns-zh/029-taiwan-permanent-residence-aprc.md:25`
  - before：「如果您身邊有外籍配偶、家人或員工，已經持外僑居留證（ARC）在台灣住了好幾年，遲早會問到：」
  - after：「外籍配偶、家人或員工持外僑居留證（ARC）在台灣住了好幾年後，常會問：」
  - 理由：移除「如果您身邊有」「遲早會問到」的套話，以具體讀者處境帶入問題。

- 位置：`src/content/columns-zh/029-taiwan-permanent-residence-aprc.md:44`
  - before：「同一項在連續居留5年的路徑之外，另以「或」為在台灣有戶籍的國民之外籍配偶或子女列出一項標準：」
  - after：「同一項除了連續居留5年的途徑，也以「或」列出在台灣有戶籍國民之外籍配偶或子女的另一項標準：」
  - 理由：調整過長的句構，保留「或」連接另一途徑的說明及原有年數標準。

- 位置：`src/content/columns-zh/029-taiwan-permanent-residence-aprc.md:62`
  - before：「第3項、第4項另設路徑，雖不具第1項的居留期間要件，也包括」
  - after：「第3項、第4項另設申請途徑，讓不具第1項居留期間要件者亦可申請，適用對象包括」
  - 理由：補足原句不清楚的主詞與適用對象銜接，不變更居留期間例外的範圍。

### 030｜enforce-foreign-judgment-in-taiwan

- 位置：`src/content/columns-zh/030-enforce-foreign-judgment-in-taiwan.md:27`
  - before：「先把外國判決與原訴訟的程序資料找齊。判決是否確定、敗訴被告有沒有收到起訴通知，往往比列出一個財產地址更早成為爭點。」
  - after：「準備在台灣執行前，宜先備齊外國判決與原訴訟的程序資料。判決是否確定、敗訴被告有沒有收到起訴通知，往往比財產地址更早成為爭點。」
  - 理由：將開頭的命令句改成自然的實務準備提醒，刪去「列出一個」的贅詞。

- 位置：`src/content/columns-zh/030-enforce-foreign-judgment-in-taiwan.md:44`
  - before：「不能只憑國名就宣稱一定承認或一定不承認。」
  - after：「不能單憑國名就斷言一定承認或一定不承認。」
  - 理由：以「斷言」取代生硬的「宣稱」，保留相互承認須依個案評估的原意。

- 位置：`src/content/columns-zh/030-enforce-foreign-judgment-in-taiwan.md:60`
  - before：「這是**另外的暫時保全程序**，有自己的聲請和證明問題。」
  - after：「這是**另外的暫時保全程序**，須另行聲請並提出證明。」
  - 理由：將「有自己的聲請和證明問題」改為具體程序動詞，保留假扣押是另外程序的說明。

### 031｜hire-taiwan-lawyer-from-abroad

- 位置：`src/content/columns-zh/031-hire-taiwan-lawyer-from-abroad.md:4`
  - before：「人在海外委任台灣律師時，先查律師證書與律師公會登錄，再確認酬金怎麼算。民事訴訟的委任、送達代收人，以及在國外簽名的文件，都要照條文準備。」
  - after：「人在海外委任台灣律師，可先查核律師證書與律師公會登錄，再確認酬金計算方式。民事訴訟委任、送達代收人的指定，以及在國外簽署的文件，都須依法準備。」
  - 理由：讓摘要的程序與動詞更精確，保留律師資格、酬金、委任、送達及文件準備事項。

- 位置：`src/content/columns-zh/031-hire-taiwan-lawyer-from-abroad.md:25`
  - before：「人在國外，台灣的民事案件、公司登記、土地或移民申請卻先動起來。對方能不能做這件事、酬金怎麼算、法院文件在台灣由誰收，是三件不同的事。信寫得順，不代表這三件事已經完成。」
  - after：「人在國外，卻有台灣的民事案件、公司登記、土地或移民申請需要處理。受委任者是否有資格承辦、酬金如何計算，以及法院文件在台灣由誰收受，是三件須分別確認的事。即使電子郵件往來順利，這三件事也未必已經安排妥當。」
  - 理由：改掉「申請卻先動起來」「信寫得順」等生硬句子，保留須分別確認的三件事。

- 位置：`src/content/columns-zh/031-hire-taiwan-lawyer-from-abroad.md:39`
  - before：「法條沒有酬金表，本文也不寫金額。委任開始之前，先問是按時、按階段，還是固定範圍，數額多少、包含什麼。」
  - after：「法條並未訂定酬金表，本文也不列具體金額。開始委任前，宜確認是按時計費、按階段收費，還是就固定範圍約定酬金，以及數額與包含的服務。」
  - 理由：將逐句問話改成完整的酬金約定說明，不新增計費方式或金額。

## 驗證

- 以專欄編號與 slug 搜尋相關測試，未找到 024–031 的正文精確字串斷言或正文雜湊凍結；不需修改測試字串。
- 八篇的 frontmatter 鍵名與受保護值、faq、阿拉伯數字序列、法律條號、網址序列、參考資料全文、段落數與標題層級均與編修前一致。中文數字所表達的年數、日數、金額與數量另逐項核對。
- 相關 Vitest：9 個測試檔、88 項測試全部通過；`git diff --check` 通過。
- 未執行 build、commit 或 push。

執行命令：

```sh
./node_modules/.bin/vitest run \
  src/lib/__tests__/columns-new-four-locales.test.ts \
  src/lib/__tests__/columns-publication-date.test.ts \
  src/lib/__tests__/new-column-hero-images-20260929.test.ts \
  src/lib/__tests__/column-audience-and-ai-author-20260929.test.tsx \
  src/lib/__tests__/family-columns-20260927.test.ts \
  src/lib/__tests__/divorce-columns-20260927.test.ts \
  src/lib/builder/__tests__/columns-backend.test.ts \
  src/lib/builder/__tests__/columns-blob-audience-backfill.test.ts \
  src/lib/builder/canvas/__tests__/home-insights-publication-order.test.ts
git diff --check -- src/content/columns-zh/02[4-9]-*.md src/content/columns-zh/03[01]-*.md docs/zh-hant-polish/columns-c-rewrite.md
```

## 不確定、需律師確認的地方

下列是原文已有、此次未作法律判斷或更動的事項。本次為文案潤飾，並未重新查核官方頁面的現行內容。

- **025｜修法與官方網頁的時間差：** 原文記載第23條於民國115年9月11日修正，並指出稅務入口網仍有「死亡日起6個月內」的舊文。修法日期、施行與適用時點，以及申報機關頁面是否已更新，仍請律師確認。
- **026｜準據法與反致：** 原文對涉外民事法律適用法第6條前段、但書與「反致」的區分，以及遺囑指定準據法的適用，涉及法律評價。此次僅調整句構，保留原有主張，請律師確認其表述是否足夠精確。
- **027｜金卡與專業人才規定：** 原文所引官方問答的第20條／第22條不一致、永久居留一年途徑的公告條件，以及延期申請的開放期間，需確認是否仍符合現行法與實際受理作法。
- **028、029｜外籍配偶永久居留途徑：** 原文保留一般5年途徑與配偶10年途徑並存、配偶不一定須等10年的說明；實際適用途徑及期間計算，仍請律師依居留紀錄確認。
- **031｜海外訴訟委任文件：** 原文保留跨審級委任的公證與國外文書驗證說明；特定文件是否需公證、驗證或適用免除重複驗證協定，仍須由律師向承辦法院確認。
