# 新增 zh-hant 內容潤飾紀錄

日期：2026-09-30。依 `STYLE.md` 與 `round-0-rewrite.md` 用詞，只處理 `NEW-FILES.txt` 所列內容。共審閱 16 個檔案，潤飾 10 篇文章與 2 個文案資料檔；另新增本紀錄。

清單未列入 043，因此未修改。4 個 TSX 檔的文字均來自文案資料檔、文章或既有作者模組，沒有需要另改的繁體中文字串，故保留原檔。`issue-board.ts` 的既定看板名稱「時事法律解析」亦保留。

frontmatter 的鍵名及非文案值、條號、金額、日期、數字、人名、機關名稱、網址與圖片路徑均保留；未增刪正文段落，參考資料段落完整保留。「法律AI助理」作者框與 byline 模組未修改。保留文章原有敘事人稱，未將 AI 作者文章改寫成律師第一人稱。

## 每篇代表性改動

### traffic-hub.ts

- `src/data/traffic-hub.ts:50`：1 白色前車 · 2 黃色車輛 · A 綠色機車 → 1 白色前車、2 黃色車輛、A 綠色機車。理由：以頓號表示並列，保留車輛識別。
- `src/data/traffic-hub.ts:59`：先確保安全與救護，留下報案、就醫紀錄及現場資料。 → 先確保安全、救護傷者，保存報案、就醫紀錄及現場資料。理由：補明救護的對象，動詞更具體。
- `src/data/traffic-hub.ts:73`：聯絡事務所 → 電子郵件諮詢。理由：沿用前輪諮詢用詞。

### issue-board.ts

- `src/data/issue-board.ts:60`：從近期新聞切入，簡要說明相關的台灣法律實務重點。各文內容以發布日當時的資訊為準。 → 從近期新聞出發，簡要說明相關的台灣法律與實務。各篇專欄以發布日的資訊為準。理由：簡化抽象表達，沿用「專欄」。
- `src/data/issue-board.ts:70`：預約諮詢 → 電子郵件諮詢。理由：與電子郵件諮詢管道一致。
- `src/data/issue-board.ts:76`：本文以新聞事件為引，發布日之後情況或法令可能已有變動。 → 本文從新聞事件談相關法律，發布後情況或法令可能已有變動。理由：消除「以…為引」的生硬語氣。

### 012-taiwan-overtaking-accident-liability.md

- `src/content/columns-zh/012-taiwan-overtaking-accident-liability.md:16`：超車常被視為平常的選擇，但這項操作本身伴隨相當風險 → 駕駛人往往會考慮超車，但超車本身也伴隨相當程度的風險。理由：以駕駛人為主語，改善抽象句構。
- `src/content/columns-zh/012-taiwan-overtaking-accident-liability.md:48`：此種依個案作出的鑑定結果 → 這種針對個案的鑑定結果。理由：簡化名詞化語句；兩筆改動合計維持測試鎖定的漢字數。

### 041-taiwan-crypto-exchange-vasp-dispute.md

- `src/content/columns-zh/041-taiwan-crypto-exchange-vasp-dispute.md:16`：服務台灣用戶 → 服務台灣使用者。理由：採台灣用語。
- `src/content/columns-zh/041-taiwan-crypto-exchange-vasp-dispute.md:28`：先把眼前看得到的東西存下來。 → 先保存目前還能取得的資料。理由：用「資料」取代含糊的「東西」。
- `src/content/columns-zh/041-taiwan-crypto-exchange-vasp-dispute.md:52`：判決若打錯公司，實際上幫助不大。 → 若告錯公司，即使取得判決，也未必有實際幫助。理由：修正「判決打錯公司」的主詞與動詞。

### 042-taiwan-investment-scam-recovery.md

- `src/content/columns-zh/042-taiwan-investment-scam-recovery.md:4`：自己或爸媽把錢匯給假投資平台、老師帶單群組或假虛擬貨幣網站後，先報案、留好轉帳紀錄；能否追回款項，除了帳戶是否仍有餘額，也取決於通報、發還條件與個案中的求償程序；報案與保留證據應先進行。 → 自己或爸媽把錢匯給假投資平台、老師帶單群組或假虛擬貨幣網站後，應先報案並保留轉帳紀錄。能否追回款項，除了帳戶是否仍有餘額，也取決於通報、發還條件與個案的求償程序。理由：合併重複提醒，保留摘要原意。
- `src/content/columns-zh/042-taiwan-investment-scam-recovery.md:34`：要記得：圈存只是短暫的保留，不等於警示帳戶。 → 圈存只是暫時保留款項，並不等於帳戶已列為警示。理由：直接說明制度差異，減少說教語氣。
- `src/content/columns-zh/042-taiwan-investment-scam-recovery.md:74`：協助檢視台灣這一側的轉帳紀錄、協助準備報案資料，並一起討論保全措施是否有實現的可能。 → 協助檢視在台灣的轉帳紀錄、準備報案資料，並討論保全措施的可行性。理由：刪除直譯與重複動詞。

### 044-taiwan-payment-order-provisional-attachment.md

- `src/content/columns-zh/044-taiwan-payment-order-provisional-attachment.md:38`：沒有異議的那部分處境就不一樣 → 沒有異議的部分，法律效果就不同。理由：以法律效果取代擬人表達。
- `src/content/columns-zh/044-taiwan-payment-order-provisional-attachment.md:46`：所以債務人人在國外 → 所以債務人在國外。理由：修正重複字。
- `src/content/columns-zh/044-taiwan-payment-order-provisional-attachment.md:48`：才能請求執行法院動作 → 才能聲請執行法院強制執行。理由：修正「法院動作」的翻譯腔。

### 045-taiwan-overseas-income-us-stocks-crypto-amt.md

- `src/content/columns-zh/045-taiwan-overseas-income-us-stocks-crypto-amt.md:2`：海外所得什麼時候會被最低稅負制計入？ → 海外所得何時納入最低稅負制？理由：修正被動句的語序；title 與 H1 同步。
- `src/content/columns-zh/045-taiwan-overseas-income-us-stocks-crypto-amt.md:28`：這篇文章想陪你把幾件事弄清楚：這些所得算到哪裡去、什麼時候會變成要繳的稅，以及平常該留什麼資料。 → 這篇專欄說明這些所得如何歸類、何時需要繳稅，以及平常應保留哪些資料。理由：刪除擬人套話，沿用「專欄」。
- `src/content/columns-zh/045-taiwan-overseas-income-us-stocks-crypto-amt.md:74`：我們目前沒有查到財政部或國稅局有哪一頁能把這幾點講清楚。 → 我們目前未查到財政部或國稅局對這些問題的明確說明。理由：改為平實的資料查核表達。

### 046-taiwan-marital-property-regime-international-couples.md

- `src/content/columns-zh/046-taiwan-marital-property-regime-international-couples.md:26`：事情會多一層：先要弄清楚，該適用哪一國的法律。 → 還得先釐清，該適用哪一國的法律。理由：刪除直譯的「事情多一層」。
- `src/content/columns-zh/046-taiwan-marital-property-regime-international-couples.md:48`：登記向法院辦理。 → 夫妻財產制契約須向法院辦理登記。理由：明確說明登記的對象。
- `src/content/columns-zh/046-taiwan-marital-property-regime-international-couples.md:70`：外國法律下的財產分割 → 依外國法律進行的夫妻財產分配。理由：改善翻譯腔，與前輪用詞一致。

### 047-foreigner-buy-sell-taiwan-real-estate-tax.md

- `src/content/columns-zh/047-foreigner-buy-sell-taiwan-real-estate-tax.md:4`：先要過土地法的互惠檢查 → 須先確認是否符合土地法的互惠原則。理由：採台灣法律慣用語。
- `src/content/columns-zh/047-foreigner-buy-sell-taiwan-real-estate-tax.md:14`：外國人個人都可以在台灣買房嗎？ → 外國個人都可以在台灣買房嗎？理由：修正重複名詞。
- `src/content/columns-zh/047-foreigner-buy-sell-taiwan-real-estate-tax.md:77`：如果您在台灣的居留天數可能讓您成為居住者，在指望35%之前，請先看居住者身分的說明。 → 如果在台灣的居留天數可能符合居住者條件，就不能逕以35%估算，應先確認居住者身分的判斷方式。理由：刪除重複敬稱與「指望」的生硬口語，保留稅率數字。

### 050-taiwan-accident-police-records.md

- `src/content/columns-zh/050-taiwan-accident-police-records.md:20`：## 先救護、報警，再保全紀錄。 → ## 救護、報警與現場紀錄。理由：將命令式小標改為主題標題。
- `src/content/columns-zh/050-taiwan-accident-police-records.md:30`：## 先確認線上系統適用條件。 → ## 哪些事故可線上申請？理由：以讀者問題呈現小標。
- `src/content/columns-zh/050-taiwan-accident-police-records.md:38`：等待警方資料與請求期限是不同問題。 → 等待警方資料，仍須留意各項請求的期限。理由：改善抽象句構，保留原有期限提醒。

### ISSUE-20260930-07-marriage-leave-fourteen-days-employer-subsidy.md

- `src/content/issues/zh-hant/ISSUE-20260930-07-marriage-leave-fourteen-days-employer-subsidy.md:2`：婚假 10 月 1 日起延長為 14 天：雇主與人資的第一份檢查清單 → 婚假 10 月 1 日起延長為 14 天：雇主給薪與補助申請。理由：移除制式檢查清單語氣，保留日期與天數；title 與 H1 同步。
- `src/content/issues/zh-hant/ISSUE-20260930-07-marriage-leave-fourteen-days-employer-subsidy.md:42`：最好個別給一份書面餘額 → 宜逐一以書面告知剩餘婚假天數。理由：修正「書面餘額」的不自然搭配。
- `src/content/issues/zh-hant/ISSUE-20260930-07-marriage-leave-fourteen-days-employer-subsidy.md:66`：把工作規則、請假餘額與補助紀錄，跟 10 月 1 日的新制對齊。 → 依 10 月 1 日的新制，檢視工作規則、剩餘婚假天數與補助紀錄。理由：改善「對齊新制」的翻譯腔。

### ISSUE-20260930-09-taiwan-mainland-travel-permission-family-company.md

- `src/content/issues/zh-hant/ISSUE-20260930-09-taiwan-mainland-travel-permission-family-company.md:2`：赴中國大陸前，先弄清楚三件事：要不要許可、家人能找誰、公司該檢查什麼 → 赴中國大陸的三個法律問題：許可、家屬求助與公司派員責任。理由：改為自然的專欄標題，保留「三」與原有主題；title 與 H1 同步。
- `src/content/issues/zh-hant/ISSUE-20260930-09-taiwan-mainland-travel-permission-family-company.md:26`：這兩種情況，都有臺灣端可以先做的事。 → 這兩種情況，都可先在台灣尋求協助。理由：修正「臺灣端」的直譯用語。
- `src/content/issues/zh-hant/ISSUE-20260930-09-taiwan-mainland-travel-permission-family-company.md:65`：## 家人可以找誰？這些管道不會保證什麼？ → ## 家屬求助管道與協助範圍。理由：刪除拗口問句，保留本節界線。

## 測試與保留項目

- 012 保留跨頁同步的 title、H1、H2、法規原句、匿名事故的鎖定敘述、圖片 alt、連結文字與完整免責文字。全文可見漢字數仍為 1,072，閱讀時間仍為 3分鐘閱讀；未變更字數常數或雜湊。
- 無須同步更新測試字串；未修改任何測試邏輯。
- 以編號、slug、traffic hub 與 issue board 搜尋相關測試後執行以下 Vitest，13 個檔案、173 項測試全部通過（exit 0）：

```text
src/data/__tests__/column-012-public-reference-sync.test.ts
src/lib/__tests__/columns-zh-traffic-012.test.ts
src/lib/builder/search/__tests__/column-012-native-search-sync.test.ts
src/lib/__tests__/expertise-columns-20260930.test.ts
src/lib/__tests__/issue-board-20260930.test.ts
src/lib/__tests__/traffic-hub.test.ts
src/lib/__tests__/columns-publication-date.test.ts
src/lib/__tests__/column-embeddings-content-sync.test.ts
src/lib/__tests__/columns-en-content.test.ts
src/lib/__tests__/columns-ja-traffic-012.test.ts
src/lib/__tests__/columns-ko-traffic-012.test.ts
src/data/__tests__/site-content-ja-services.test.ts
src/app/[locale]/services/[slug]/__tests__/ja-civil-page.test.tsx
```

- 16 檔保留項目檢查：frontmatter 非文案值、段落邊界、數字序列、網址與圖片路徑、參考資料均與修改前一致；TS/TSX 的非字串 token 與其他語言區塊保持原樣。`git diff --check` 通過。
- 未執行 npm run build、commit 或 push。

## 不確定、需律師確認

- 012 的「規定示意」語意不清，可能是指「依規定示意」或「燈號示意」。本輪因原有漢字數與法規敘述的測試限制保留，請確認原意。
- 議題 07 同時引用修正草案對照表與修正公告，並註明法規資料庫於 9 月 30 日仍顯示舊文。正式發布版本、生效日期、新舊規定銜接與補助預算時程，仍宜由律師確認；本輪完整保留原有事實與日期。
- 041 對虛擬資產服務法公布與尚未施行的敘述具有時點限制。是否仍符合文章確認日的正式法規狀態，以及後續更新需求，請律師確認；本輪未改原法律主張。
- 045 原文已明示，美國券商對帳單能否作為海外稅額扣抵文件，以及虛擬貨幣所得來源地與經常性買賣的判斷，官方資料仍不足以作出定論。本輪保留這些界線，請依個案確認。
- 046 原文未查得台灣法院登記處如何處理依外國法訂立的夫妻財產約定之明確官方說明。本輪未補入推論，仍須向承辦登記處與外國律師確認。
- 047 原文購買文件清單中的「非都市土地以外的使用分區證明」表達有歧義，所指土地類別及應備文件請律師核對引用的內政部問答，本輪保留原句。
