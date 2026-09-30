# 專欄 013–023 繁體中文潤飾紀錄

日期：2026-09-30。依 `docs/zh-hant-polish/STYLE.md` 與本輪指示，僅調整語句，不增刪段落或新增法律論述。

本輪實際修改 013、015、017–023 共 9 篇；014、016 因整篇原始 Markdown 的 SHA-256 凍結測試而保持原樣。兩篇仍各列 2 筆建議供後續評估，**明確標示未套用**，不視為已完成的改寫。受測試鎖定的原句、FAQ、標題及字數斷言均保留，未修改任何測試。

所有 frontmatter 鍵名與固定值、數字、條號、日期、機關名稱、圖片路徑、連結及引用清單均保留。「法律AI助理」作者框由共用頁面產生，本輪未修改該元件，019–023 的 `author: "legal-ai-assistant"` 也保持原樣。013 的律師第一人稱自介保留。

## 013｜台灣公司設立：地址、銀行帳戶與審查實務Q&A

檔案：`src/content/columns-zh/013-taiwan-company-establishment-advanced-1.md`。

1. `src/content/columns-zh/013-taiwan-company-establishment-advanced-1.md:45`

   - Before：再推進申請與簽約準備
   - After：再著手申請與簽約準備
   - 理由：把抽象的「推進」改成具體動作。

2. `src/content/columns-zh/013-taiwan-company-establishment-advanced-1.md:51`

   - Before：公司帳戶的程序中，銀行
   - After：辦理公司帳戶時，各銀行
   - 理由：去掉名詞化句構，讓開戶的動作清楚。

3. `src/content/columns-zh/013-taiwan-company-establishment-advanced-1.md:61`

   - Before：申請人需要透過整體申請資料，一致說明
   - After：申請人應在完整的申請資料中，清楚說明
   - 理由：改掉「透過整體資料」的直譯搭配，保留資料完整與說明清楚的要求。

## 014｜台灣最低服務年限約定：效力、培訓費用與違約金判斷

檔案：`src/content/columns-zh/014-taiwan-mandatory-employment-period.md`。

**保持原樣**：`src/lib/__tests__/columns-zh-labor-014.test.ts:448` 鎖定整篇來源雜湊；依本輪「優先保留被鎖定的原句」指示，不改原文、不更新雜湊。以下均為建議，未套用。

1. `src/content/columns-zh/014-taiwan-mandatory-employment-period.md:27`（建議，未套用）

   - Before：閱讀這類條款時，宜依下列順序拆開判斷：
   - After（建議）：閱讀這類條款時，可依下列順序逐項判斷：
   - 理由：「拆開判斷」可改為較自然的「逐項判斷」。整篇來源凍結，因此本輪保留 Before。

2. `src/content/columns-zh/014-taiwan-mandatory-employment-period.md:56`（建議，未套用）

   - Before：通常不足以支持精確的期間與費用計算
   - After（建議）：通常不足以作為精確計算期間與費用的依據
   - 理由：將「支持計算」改為具體的「作為計算依據」。整篇來源凍結，因此本輪保留 Before。

## 015｜台灣公司設立：營業場所選擇與台北市預先查詢

檔案：`src/content/columns-zh/015-taiwan-company-setup-pitch-location.md`。

1. `src/content/columns-zh/015-taiwan-company-setup-pitch-location.md:27`

   - Before：本文以在台北市辦理公司及商業登記、經營餐廳的情境為其中一個例子
   - After：本文以在台北市辦理公司及商業登記、經營餐廳的情境作為說明的例子
   - 理由：「其中一個例子」欠缺指涉，直接說明本文取例的目的。

2. `src/content/columns-zh/015-taiwan-company-setup-pitch-location.md:31`

   - Before：是容易理解的例子
   - After：是便於說明的例子
   - 理由：調整僵硬搭配，說明為何以餐廳為例。

3. `src/content/columns-zh/015-taiwan-company-setup-pitch-location.md:89`

   - Before：確認其與土地使用分區及建築管理規定的符合性
   - After：確認是否符合土地使用分區及建築管理相關規定
   - 理由：將抽象的「符合性」改為讀者容易理解的問句結構。

## 016｜台灣繼承與親權：遺屬法律指南

檔案：`src/content/columns-zh/016-taiwan-inheritance-custody-analysis.md`。

**保持原樣**：`src/lib/__tests__/columns-zh-family-016.test.ts:323` 鎖定整篇來源雜湊；依本輪「優先保留被鎖定的原句」指示，不改原文、不更新雜湊。以下均為建議，未套用。

1. `src/content/columns-zh/016-taiwan-inheritance-custody-analysis.md:25`（建議，未套用）

   - Before：家庭成員死亡後，開始的並非單一程序。
   - After（建議）：家庭成員死亡後，須處理的不只一項法律程序。
   - 理由：「開始的並非單一程序」較生硬，可直接表達待處理事項。整篇來源凍結，因此本輪保留 Before。

2. `src/content/columns-zh/016-taiwan-inheritance-custody-analysis.md:53`（建議，未套用）

   - Before：完成夫妻財產制層次的結算後
   - After（建議）：完成夫妻財產制的結算後
   - 理由：去掉不必要的「層次」，不更動結算與繼承的先後。整篇來源凍結，因此本輪保留 Before。

## 017｜台灣物流業與「汽車貨運業」許可：新設、收購與委外

檔案：`src/content/columns-zh/017-taiwan-logistics-business-setup.md`。

1. `src/content/columns-zh/017-taiwan-logistics-business-setup.md:27`

   - Before：以及車輛與駕駛實際由誰管理等實際營運方式
   - After：以及車輛與駕駛由誰負責管理等實際營運方式
   - 理由：消除「實際」重複，明確指出車輛與駕駛的管理責任。

2. `src/content/columns-zh/017-taiwan-logistics-business-setup.md:43`

   - Before：如有再委託，持有許可的業者實際執行哪些範圍的業務
   - After：如有再委託，持有許可的業者實際負責哪些部分的業務
   - 理由：「執行哪些範圍」搭配不順，改成「負責哪些部分」。

3. `src/content/columns-zh/017-taiwan-logistics-business-setup.md:55`

   - Before：個人經營小貨車貨運業是不同於一般公司新設的狹義制度
   - After：個人經營小貨車貨運業另有規定，與一般公司新設制度不同
   - 理由：拆開直譯句構，保留兩種制度有別的意思。

## 018｜半導體零組件企業進入台灣市場：在台子公司、分公司與代理商，該如何評估？

檔案：`src/content/columns-zh/018-taiwan-semiconductor-market-entry.md`。

1. `src/content/columns-zh/018-taiwan-semiconductor-market-entry.md:60`

   - Before：若決定要在台灣設立獨立的法人，則亦要選擇法人的型態。在台灣有分成有限公司及股份有限公司。
   - After：若決定在台灣設立獨立法人，還要選擇公司型態，可考慮有限公司或股份有限公司。
   - 理由：修正「則亦要」「有分成」的翻譯腔，保留原文列出的兩種公司型態。

2. `src/content/columns-zh/018-taiwan-semiconductor-market-entry.md:80`

   - Before：外國人在台灣工作，必須擁有合法的工作證，若要長時間待在台灣，亦需要申請居留證。基本上，需要由雇主為外國員工申請工作證及相對應的居留證。
   - After：外國人在台灣工作，必須有合法的工作許可；若要長期停留，也需要申請居留證。一般而言，由雇主為外國員工申請工作許可及相應的居留證。
   - 理由：改用「工作許可」及自然的台灣行文，保留原有申請敘述，例外問題另列待確認。

3. `src/content/columns-zh/018-taiwan-semiconductor-market-entry.md:82`

   - Before：外國公司的台灣子公司及分公司的經理人，申請工作證較容易。惟要為第2人以上之外國人申請工作證，則依照不同的業種，勞動部有要求公司須達成資本額、營業額等之門檻。故若有使外國職員於台灣工作的計畫，於設立台灣公司前，就必須要預先確認資本額的設定是否有達到一定門檻。
   - After：外國公司在台子公司及分公司的經理人，申請工作許可較容易。但為第2人以上的外國人申請工作許可時，依產業別不同，勞動部要求公司達到資本額、營業額等門檻。因此，若計畫安排外國員工在台灣工作，設立台灣公司前就必須確認規劃的資本額是否達到門檻。
   - 理由：去掉「惟……則……故……」及「有要求」等直譯句構，保留第2人門檻的原主張，另列待律師確認。

## 019｜與台灣配偶協議離婚：簽字前先整理文件、證人與登記安排

檔案：`src/content/columns-zh/019-taiwanese-spouse-divorce-agreement-registration.md`。

1. `src/content/columns-zh/019-taiwanese-spouse-divorce-agreement-registration.md:29`

   - Before：婚姻在哪裡登記、有沒有進行中的案件，也會影響後續還要辦哪些程序。
   - After：婚姻在哪裡登記、是否已有案件進行中，也會影響後續須辦理的程序。
   - 理由：「進行中的案件」改為自然語序，讓後續程序的說明順暢。

2. `src/content/columns-zh/019-taiwanese-spouse-divorce-agreement-registration.md:35`

   - Before：實際匯款時仍可能為幣別、付款日或匯費由誰負擔起爭執
   - After：實際匯款時，仍可能因幣別、付款日或匯費的負擔起爭執
   - 理由：修正「為……起爭執」的搭配，保留金錢條款的三項問題。

3. `src/content/columns-zh/019-taiwanese-spouse-divorce-agreement-registration.md:39`

   - Before：都要另外確認，無法從雙方同意離婚直接推出。
   - After：都要另外確認，不能僅憑雙方同意離婚就認定可以移居。
   - 理由：將推論式的「直接推出」改為明確的移居結論，保留另行確認的要求。

## 020｜配偶在台灣、自己住海外：離婚諮詢前先整理地址與既有案件

檔案：`src/content/columns-zh/020-taiwanese-spouse-divorce-from-abroad.md`。

1. `src/content/columns-zh/020-taiwanese-spouse-divorce-from-abroad.md:25`

   - Before：這時雙方雖有離婚的意向，手續要怎麼完成仍沒有著落，財產與孩子的安排也可能還有爭議。
   - After：這時雙方雖有離婚意向，卻還沒確定如何辦理手續，財產與孩子的安排也可能仍有爭議。
   - 理由：保留親切口吻，修正「手續……沒有著落」的搭配。

2. `src/content/columns-zh/020-taiwanese-spouse-divorce-from-abroad.md:35`

   - Before：保留退件郵件及相關紀錄，可以呈現查找的經過。
   - After：保留遭退回的郵件及相關紀錄，可以說明查找經過。
   - 理由：把「退件郵件」及「呈現」改成較自然、具體的說法。

## 021｜與台灣配偶離婚後想帶孩子住海外：先做可執行的親職計畫

檔案：`src/content/columns-zh/021-taiwanese-spouse-divorce-cross-border-parenting.md`。

1. `src/content/columns-zh/021-taiwanese-spouse-divorce-cross-border-parenting.md:21`

   - Before：這個決定既涉及法律上由誰決定孩子的住所，也會改變孩子每天的生活。
   - After：移居既涉及法律上由誰決定孩子的住所，也會改變孩子每天的生活。
   - 理由：避免「決定……決定」重複，讓主語明確。

2. `src/content/columns-zh/021-taiwanese-spouse-divorce-cross-border-parenting.md:25`

   - Before：原本晚上通話的時間，正好變成孩子的上課時段。
   - After：原本晚上的通話時間，正好落在孩子的上課時段。
   - 理由：改掉時間「變成」時段的不順搭配。

3. `src/content/columns-zh/021-taiwanese-spouse-divorce-cross-border-parenting.md:37`

   - Before：並詢問可以聲請的保護措施。
   - After：並詢問可聲請哪些保護措施。
   - 理由：將名詞化的詢問對象改為直接問題。

## 022｜與外籍伴侶結婚：先在台灣還是海外登記？文件驗證、面談與依親要分開看

檔案：`src/content/columns-zh/022-marrying-taiwanese-national-registration-checklist.md`。

1. `src/content/columns-zh/022-marrying-taiwanese-national-registration-checklist.md:24`

   - Before：在台灣成立婚姻，還是把海外已成立的婚姻登記進台灣戶籍？
   - After：在台灣成立婚姻，還是將海外已成立的婚姻登記在台灣戶籍中？
   - 理由：修正「登記進」的搭配，保留兩種程序的區別。

2. `src/content/columns-zh/022-marrying-taiwanese-national-registration-checklist.md:26`

   - Before：以下以在台灣設有戶籍的國民與一般外籍伴侶為主。
   - After：以下主要說明在台灣設有戶籍的國民與一般外籍伴侶結婚的情形。
   - 理由：補足「以……為主」省略的內容，使適用範圍清楚。

## 023｜孩子有台灣父母就有戶籍嗎？國籍、出生登記、定居與護照的四個確認點

檔案：`src/content/columns-zh/023-baby-taiwan-nationality-birth-registration.md`。

1. `src/content/columns-zh/023-baby-taiwan-nationality-birth-registration.md:24`

   - Before：出生證明證明的是出生事實，戶籍則要依孩子的身分與出生地辦理。
   - After：出生證明記載的是出生事實，戶籍登記則須依孩子的身分與出生地辦理。
   - 理由：避免「證明證明」重複，補足戶籍登記的動作。

2. `src/content/columns-zh/023-baby-taiwan-nationality-birth-registration.md:38`

   - Before：孩子的年齡、孩子出生時父母的戶籍，以及入境時使用的身分，決定能否依該項規定申請。
   - After：孩子的年齡、出生時父母的戶籍，以及入境時使用的身分，決定能否依該項規定申請。
   - 理由：去掉連續重複的「孩子」，不更動判斷因素。

3. `src/content/columns-zh/023-baby-taiwan-nationality-birth-registration.md:45`

   - Before：孩子雖然還未滿一歲，申請時間也可能已經不夠。
   - After：即使孩子還未滿一歲，也可能已來不及申請。
   - 理由：保留原來的期限提醒，改成自然的讓步句。

## 驗證

- 相關 Vitest：15 個測試檔、145 項測試全部通過。涵蓋 013–017 繁中內容契約、014／016 公開引用同步、019–023 離婚／婚姻／出生系列、作者與圖片、發布日期及半導體專欄。
- 比對本輪開始時的原文：frontmatter 固定值、阿拉伯數字序列、條號／項次、機關名稱、連結文字與網址、圖片路徑、段落數及官方資料段落均一致；014、016 全檔一致。
- 013、015、017 的凍結漢字數與閱讀時間斷言仍通過；014、016 的來源雜湊仍通過。
- 未執行 build、commit、push。

執行命令：

```sh
./node_modules/.bin/vitest run \
  src/lib/__tests__/columns-zh-investment-013.test.ts \
  src/lib/__tests__/columns-zh-labor-014.test.ts \
  src/lib/__tests__/columns-zh-investment-015.test.ts \
  src/lib/__tests__/columns-zh-family-016.test.ts \
  src/lib/__tests__/columns-zh-investment-017.test.ts \
  src/data/__tests__/column-014-public-reference-sync.test.ts \
  src/data/__tests__/column-016-public-reference-sync.test.ts \
  src/lib/__tests__/divorce-columns-20260927.test.ts \
  src/lib/__tests__/family-columns-20260927.test.ts \
  src/lib/__tests__/family-column-hero-images.test.ts \
  src/lib/__tests__/column-audience-and-ai-author-20260929.test.tsx \
  src/lib/__tests__/columns-publication-date.test.ts \
  src/lib/__tests__/semiconductor-public-board.test.ts \
  src/lib/__tests__/semiconductor-drafts.test.ts \
  src/lib/__tests__/semiconductor-drafts-import.test.ts
```

## 不確定、需律師確認的地方

以下是原文待確認事項，本輪未查核或變更其法律主張，也未將推測寫入專欄：

1. **018，第 4 節標題與正文的機關名稱不一致**：標題仍寫「經濟部投資審議委員會」，正文寫「經濟部投資審議司」。依本輪不得更動機關名稱的限制保留，請律師確認是否另案修正。
2. **018，工作許可與居留的概括敘述**：原文稱外國人工作必須有工作許可、由雇主申請相應居留證，並稱經理人申請較容易、第2人以上依產業有資本額與營業額門檻。各種身分、豁免及申請類別是否須進一步區分，請律師確認。本輪只修詞句，未增補例外。
3. **018，分公司責任及設立時程的敘述**：原文表格稱總公司直接承擔「所有責任義務」，第 4 節稱分公司「設立時程較快」。其範圍及比較前提是否過於概括，請律師確認。第 4 節末尾「以上是契約設計建議」與該節內容的銜接也不明，原文保留。
4. **014、016，解除來源凍結前的編輯處理**：正文某些非問句標題下仍以「不是。」「不同。」「不可以。」開頭，另有名詞化或生硬句構。須先決定如何處理全檔雜湊契約，才能套用本紀錄的建議；本輪未改動雜湊或測試。
