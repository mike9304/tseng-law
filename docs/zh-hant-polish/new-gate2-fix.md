# new-gate2 修正紀錄

2026-09-30。依 STYLE.md、LAWYER-REVIEW.md、new-gate2-fable.md 與 new-gate2-astra.md 逐筆處理。行號為本輪修改後位置。計件以兩份審閱意見的11筆為準，同一筆的關聯版位與測試同步不另計件。只修繁體中文語言；未改法律實質、事實、數字、條號、人名、地址、Email、href、引用與「法律AI助理」作者框，也未改鎖定字串。

## Fable：一般意見

- src/content/columns-zh/044-taiwan-payment-order-provisional-attachment.md:40 | 這個規定在2015年修正時改變，[司法院公報]有說明；依司法院公報說明， → 這個規定在2015年修正時改變；依[司法院公報]的說明， | 採納：刪除同一句內重複的來源說明。原連結完整保留，2015年修正與2015年7月3日以後確定的適用限定均未變。
- src/content/columns-zh/012-taiwan-overtaking-accident-liability.md:20 | 同時規定超車禁止條件，以及在同一車道超車時應遵守的順序。 → 同時規定禁止超車的情形，以及同一車道超車時應遵守的程序。 | 採納（改寫方式不同）：解除名詞堆疊，與同篇「禁止超車的情形」「程序」一致；省略不影響語意的「在」。未改超車條件或步驟。關聯版位 src/data/insights-archive.ts:347 的「第101條的禁止超車條件」同步改為「第101條所列禁止超車的情形」，src/data/__tests__/column-012-public-reference-sync.test.ts:85 的相同字串同步更新；未改測試邏輯或數字常數。
- src/content/columns-zh/047-foreigner-buy-sell-taiwan-real-estate-tax.md:77 | 在訂金難以拿回之前……再讀一次登記簿上的所有權人與權利記載。 → 原文保留 | 不採納：審閱者建議「付出訂金之前（訂金付了往往難以取回）」會指定查核時點，並新增訂金付後通常難以取回的概括敘述，超出純語言潤飾。已追加 LAWYER-REVIEW.md，請律師確認時點及訂金返還問題；同段「再讀一次」併同保留，待確認後再調整銜接。
- src/content/columns-zh/050-taiwan-accident-police-records.md:6 | 閱讀約4分鐘 → 約4分鐘閱讀 | 採納：統一同批專欄的閱讀時間語序；4分鐘及「約」均保留。

## Fable：法律實質

- src/content/columns-zh/042-taiwan-investment-scam-recovery.md:62 | [防制詐欺辦法第52條]針對存款警示帳戶，同樣用「得」這個字，並且是在書面通知（副本送帳戶持有人）之後。 → 原文保留 | 不採納：通知的發出者、受通知者及通知與發還的前提或時點關係，均涉及程序要件，不能由語言潤飾自行補寫。已追加 LAWYER-REVIEW.md；與既有第53條金額推算疑問分開確認，條號、連結與「得」保持原樣。
- src/content/issues/zh-hant/ISSUE-20260930-09-taiwan-mainland-travel-permission-family-company.md:59 | 是否在前述職務離職或受委託終止未滿三年之內？ → 原文保留 | 不採納：審閱者已要求併同律師確認三年限制的適用範圍及起算表述。本行已列 LAWYER-REVIEW.md 的 new-r2 第10筆關聯版位（既有第184行），本輪不重複登錄或先行修改。

## Astra

- src/content/issues/zh-hant/ISSUE-20260930-09-taiwan-mainland-travel-permission-family-company.md:28 | 累計 449 件，並呼籲國人審慎評估赴中的必要性、做好安全準備。 → 累計 449 件。報導另轉述了審慎評估赴中必要性、做好安全準備的呼籲。 | 採納：分開統計數字與呼籲，避免把「數字」誤接成呼籲的主詞；沿用媒體轉述的來源層次，未新增呼籲者。各分類件數、累計449件、原報導連結及未查核卷宗的限定均保留。
- src/content/issues/zh-hant/ISSUE-20260930-09-taiwan-mainland-travel-permission-family-company.md:36 | 第 4 項則要經內政部會同國家安全局、法務部、陸委會及相關機關組成的審查會審查許可，適用對象是： → 第 4 項規定，下列人員須經內政部會同國家安全局、法務部、陸委會及相關機關組成的審查會審查許可： | 採納：將原句已列出的適用對象接為主詞，補明法條是規定來源。「要」改為「須」仍表達同一義務；審查機關、許可要求、後接人員清單及例外均未變，不判斷或增刪適用要件。
- src/content/columns-zh/042-taiwan-investment-scam-recovery.md:26 | 一個網站、一支App → 一個網站、一款App | 採納：修正App的量詞；投資情境及敘述事實不變。
- src/content/columns-zh/046-taiwan-marital-property-regime-international-couples.md:58 | 扣除婚姻關係存續所負債務後如有剩餘 → 扣除婚姻關係存續期間所負債務後，如有剩餘 | 採納：補足「存續」與「所負債務」間漏寫的期間詞並加逗號；沿用原文婚姻關係存續的時間限定，不增刪債務種類、分配要件或例外。
- src/content/columns-zh/047-foreigner-buy-sell-taiwan-real-estate-tax.md:15 | 第20條另須經地方政府核准 → 第20條另規定須經地方政府核准 | 採納（改寫方式不同）：只補「規定」，使法條作為規定來源，避免讀成法條本身須經核准；保留原句的核准義務與地方政府，不增補程序或適用條件。

## 驗證

執行 `node_modules/.bin/vitest run src/lib/__tests__/columns-zh-traffic-012.test.ts src/data/__tests__/column-012-public-reference-sync.test.ts src/lib/__tests__/columns-zh-content.test.ts src/lib/__tests__/traffic-hub.test.ts src/lib/builder/search/__tests__/column-012-native-search-sync.test.ts`：5個測試檔、37項測試全數通過（exit 0）。`git diff --check` 通過。

以本輪修改前快照比對7個文章檔：數字序列、Markdown連結目標、網址與Email、author欄位、引用區塊、官方參考資料段落均未變。gray-matter解析正常；frontmatter僅050的read_time語序與047第一筆FAQ答案的上述用語變更，其餘欄位相同。全庫搜尋舊片段後，只有上述專欄列表及其測試需要同類用語同步；訂金與第52條通知的保留原文屬待確認項目。

本輪保留工作樹原有修改；未修改其他語言、程式邏輯或其他工作樹，未新增電話，未 commit、push，未執行 npm run build。

採納 8 筆，不採納 3 筆
