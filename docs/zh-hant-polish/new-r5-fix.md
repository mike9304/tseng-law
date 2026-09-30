# 新增文案第5輪修正紀錄（new-r5）

依 STYLE.md、LAWYER-REVIEW.md 與 new-r5-grok.md 逐筆處理，並按已讀全文的 `~/agent-library/knowledge/editorial-voice.md` 複核語序、指涉與意義保留。審閱檔雖標示「ISSUES 15」，實際另有2筆法律實質意見，共17筆；以下依原順序記錄，行號以本輪處理後檔案為準。「不採納」表示本輪不修改，不代表已判定審閱者的法律意見錯誤。

- src/data/traffic-hub.ts:61 | 區分保險給付、和解金與放棄請求的條款，並確認各程序的期限。 → 區分保險給付與和解金，檢視放棄請求的條款，並確認各程序的期限。 | 採納：將款項與條款分開敘述，保留原有事項與期限提醒。
- src/content/columns-zh/046-taiwan-marital-property-regime-international-couples.md:34 | 外國法適用的夫妻，若就台灣境內的財產與善意第三人交易 → 原文保留 | 不採納：審閱者同時質疑第49條的適用主體；改為「夫妻財產制適用外國法時」涉及適用前提，列入 LAWYER-REVIEW.md 確認。
- src/content/columns-zh/047-foreigner-buy-sell-taiwan-real-estate-tax.md:77 | 是否取得第20條的核准，或申請已經被受理 → 是否取得第20條的核准，或申請是否已經被受理 | 採納：僅補「是否」，使兩個查核事項都呈疑問語氣；不改核准、受理的法律意義、條號或原有「或」的關係。
- src/content/columns-zh/050-taiwan-accident-police-records.md:24 | 記下處理員警聯絡方式及案件識別資訊 → 原文保留 | 不採納：以「報案或事故編號」取代全部識別資訊會限縮資料種類，且未確認現場實際提供的編號名稱；列入 LAWYER-REVIEW.md。
- src/content/columns-zh/044-taiwan-payment-order-provisional-attachment.md:38 | 若只異議一部分，沒有異議的部分，法律效果就不同 → 原文保留 | 不採納：建議明寫部分異議的效力範圍，屬程序法律效果，列入 LAWYER-REVIEW.md，不能僅依同段前文自行補成法律結論。
- src/content/columns-zh/042-taiwan-investment-scam-recovery.md:17 | 警察機關開立的受理案件證明 → 警察機關開立的受（處）理案件證明 | 採納：統一同篇第62行已有的文件名稱寫法；不增減應備文件或發還條件。搜尋其他繁體中文文案，未見需同步修正的同名舊寫法。
- src/content/columns-zh/047-foreigner-buy-sell-taiwan-real-estate-tax.md:77 | 前述契稅、土地相關稅及非居住者所得稅 → 原文保留 | 不採納：建議另列房屋稅並指定土地稅項，涉及查核清單的稅目範圍；房屋稅不能直接視為「土地相關稅」的同義詞，列入 LAWYER-REVIEW.md。
- src/content/issues/zh-hant/ISSUE-20260930-07-marriage-leave-fourteen-days-employer-subsidy.md:26 | 同事的喜帖早就發了，對方來問人資 → 同事的喜帖早就發了，這位同事來問人資 | 採納：明確指回前半句的同事，不改情境、日期或婚假規定。
- src/content/columns-zh/046-taiwan-marital-property-regime-international-couples.md:17 | 要先檢視是否符合第48條的框架。……能否對台灣的第三人主張，還要另外確認。 → 原文保留 | 不採納：建議改用「對抗」並說明約定與第三人效力的關係，涉及法律效力及判斷基準；整筆列入 LAWYER-REVIEW.md，不以刪除保留語代替法律確認。
- src/content/columns-zh/046-taiwan-marital-property-regime-international-couples.md:66 | 在哪個國家辦理結婚登記與戶政登記 → 原文保留 | 不採納：建議把戶政登記明確限定為台灣戶籍登記，會改變諮詢資料的地域與程序範圍；列入 LAWYER-REVIEW.md，不自行推定原清單只指台灣。
- src/content/columns-zh/042-taiwan-investment-scam-recovery.md:62 | 金額則從最後一筆轉入的款項往前推算。 → 原文保留 | 不採納：建議新增第53條的法條歸屬並指定為可發還金額，涉及法定計算對象與方式，列入 LAWYER-REVIEW.md；不新增條號或補推算終點。
- src/content/columns-zh/044-taiwan-payment-order-provisional-attachment.md:19 | 日後有不能執行或甚難執行之虞，並要釋明 → 原文保留 | 不採納：補上請求及執行困難作為釋明對象，涉及假扣押要件及舉證要求，列入 LAWYER-REVIEW.md。這是第19行FAQ的新疑問，與既有第44行支付命令釋明事項分開記錄。
- src/content/issues/zh-hant/ISSUE-20260930-07-marriage-leave-fourteen-days-employer-subsidy.md:54 | 用來審核天數的登記日證明、核准日期的紀錄 → 原文保留 | 不採納：尚未確認核准日期指婚假或補助；改為「婚假核准紀錄」會指定紀錄種類，並省略原有日期內容，涉及資料事實與範圍，列入 LAWYER-REVIEW.md。
- src/content/columns-zh/042-taiwan-investment-scam-recovery.md:40 | 應向原通報機關提出，銀行在必要時協助。 → 應向原通報機關提出，必要時由銀行協助。 | 採納：僅調整語序與介詞，使協助者清楚；保留提出對象與「必要時」的條件，不新增協助事項。
- src/content/columns-zh/012-taiwan-overtaking-accident-liability.md:56 | 該文屬次級資料 → 原文保留 | 不採納：「次級資料」是資料分類用語，後句已提醒以現行官方規定為準；審閱者所述閱讀感受屬偏好，且本段為引用來源說明，依 STYLE.md 保持原樣。
- src/content/columns-zh/047-foreigner-buy-sell-taiwan-real-estate-tax.md:58 | 繼承或受贈取得的房地 → 原文保留 | 不採納：受贈與遺贈的成本及持有期間是否同範圍，屬稅法實質，列入 LAWYER-REVIEW.md。既有 new-r2 登錄的是成本排除例外，本輪只追加受贈／遺贈的適用範圍疑問。
- src/content/columns-zh/047-foreigner-buy-sell-taiwan-real-estate-tax.md:65 | 若房子是繼承或遺贈取得 → 原文保留 | 不採納：與上筆一併確認持有期間併計的取得原因，不把受贈與遺贈直接統一；列入 LAWYER-REVIEW.md 作為關聯版位。

驗證：搜尋 `src`、`tests`、`scripts` 的測試檔，未找到需同步更新的舊字串斷言。執行 `npm run test:unit -- src/lib/__tests__/traffic-hub.test.ts src/lib/__tests__/expertise-columns-20260930.test.ts src/lib/__tests__/issue-board-20260930.test.ts src/lib/__tests__/columns-zh-content.test.ts`，4個測試檔、94個測試全部通過；本輪範圍的 `git diff --check` 通過。

修改前後對照確認：4個文案檔只有上述5處繁體中文替換；數字、條號、日期、人名、地址、Email、URL、連結、引文及參考資料未變。AI作者欄位與其他語言未變，10個受保護或未採納的對照檔雜湊相同。LAWYER-REVIEW.md 僅追加本輪11筆，既有紀錄保留。未 commit、push 或執行 build。

採納 5 筆，不採納 12 筆
