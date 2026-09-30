# 專欄B第5輪審閱處理紀錄

依 STYLE.md、LAWYER-REVIEW.md 與 colsB-r5-grok.md 逐筆處理。原審閱的「ISSUES 18」指一般意見；另有1筆法律實質意見，共19筆，以下依原順序記錄。行號以處理後檔案為準；未採納項目的 after 與 before 相同。

- src/content/columns-zh/013-taiwan-company-establishment-advanced-1.md:53 | 這並不表示備齊這些文件，任何銀行都會受理 → 備齊這些文件，並不表示任何銀行都會受理 | 採納：將備齊文件的前提移至句首，使否定範圍清楚；保留銀行未必受理及可能要求補充文件的警告，未改受理條件。同步更新 src/lib/__tests__/columns-zh-investment-013.test.ts:160 的字串斷言。
- src/content/columns-zh/014-taiwan-mandatory-employment-period.md:125 | 不必。 → 不必。 | 不採納：此段為雜湊凍結內容，STYLE.md 明定不可修改；保留原文及後續返還責任說明，僅記錄指涉不明的意見。
- src/content/columns-zh/016-taiwan-inheritance-custody-analysis.md:95 | 不可以。 → 不可以。 | 不採納：此段為雜湊凍結內容，依鎖定規範保留；未刪除否定語或變動子女財產保護的法律說明。
- src/content/columns-zh/014-taiwan-mandatory-employment-period.md:38 | 不是。 → 不是。 | 不採納：此段為雜湊凍結內容；即使開頭與非問句標題銜接不佳，仍依鎖定規範保留。
- src/content/columns-zh/016-taiwan-inheritance-custody-analysis.md:51 | 不同。 → 不同。 | 不採納：此段為雜湊凍結內容，保留原文；僅記錄比較對象不明的意見，不改剩餘財產請求與繼承權的說明。
- src/content/columns-zh/013-taiwan-company-establishment-advanced-1.md:41 | 外國投資申請與公司登記，在所在地確認的階段與文件上並不相同。 → 外國投資申請與公司登記，確認所在地的時間點與應備文件並不相同。 | 採納：以具體的確認時間與文件取代「在……上」的拗口句構，保留兩項程序要求不同的意思；同段已待律師確認的「使用權限」原樣保留。同步更新 src/lib/__tests__/columns-zh-investment-013.test.ts:142 的字串斷言。
- src/content/columns-zh/013-taiwan-company-establishment-advanced-1.md:63 | 不得誇大與職務關聯不大的經歷 → 不得誇大與職務關係不大的經歷 | 採納：將不自然的名詞搭配改為「與職務關係不大」，只改語感，不變動經歷事實、職務範圍或禁止誇大的強度；「取得許可的計畫」保留，既有確認事項不重複登錄。
- src/content/columns-zh/020-taiwanese-spouse-divorce-from-abroad.md:25 | 雙方雖有離婚意向 → 雙方雖有離婚意向 | 不採納：將雙方意向改為對方曾提過分開，涉及假設情境中的當事人意向及事實範圍，不屬純潤飾；原文保留，新疑問已追加 LAWYER-REVIEW.md，交律師確認。
- src/content/columns-zh/017-taiwan-logistics-business-setup.md:35 | 負責派車、車輛營運及貨運事故 → 負責派車、車輛營運及事故處理 | 採納：補明事故對應的是處理工作，使三個並列事項語意完整；上下文仍指貨運事故，不另增責任要件、承擔主體或免責結論。同篇已有「貨損事故處理」，用語一致。
- src/content/columns-zh/016-taiwan-inheritance-custody-analysis.md:63 | 仍須配合法定程序及例外理解 → 仍須配合法定程序及例外理解 | 不採納：此段為雜湊凍結內容，依鎖定規範保留；未改有限責任的程序或例外。
- src/content/columns-zh/018-taiwan-semiconductor-market-entry.md:84、94 | ## 7. 依業務發展階段，比較適合的架構；## 8. 初次諮詢，先準備營運概況，不必先交出全部機密資料 → ## 7. 依業務發展階段，比較適合的架構；## 8. 初次諮詢，先準備營運概況，不必先交出全部機密資料 | 不採納：已確認前節為第5節，跳號確實存在；但建議須把7、8改為6、7，違反 STYLE.md「不改任何……數字」及本任務只改繁體中文字串的限制。屬編排問題，僅記錄，不列為法律疑問。
- src/content/columns-zh/021-taiwanese-spouse-divorce-cross-border-parenting.md:45 | 夫妻剩餘財產分配 → 夫妻剩餘財產分配 | 不採納：補上「差額」會指定法律制度及請求範圍，不能僅以016篇用語為由認定可直接替換；原文保留，新疑問已追加 LAWYER-REVIEW.md，交律師確認。
- src/content/columns-zh/014-taiwan-mandatory-employment-period.md:131 | 封閉清單 → 封閉清單 | 不採納：此段為雜湊凍結內容，依鎖定規範保留；只記錄翻譯腔意見，不變動不可歸責事由的說明。
- src/content/columns-zh/013-taiwan-company-establishment-advanced-1.md:45 | 再著手申請與簽約準備。 → 再準備申請與簽約。 | 採納：刪去動作堆疊，改成直接的準備動作；仍在確認地址及相關事項後準備申請與簽約，未改程序順序。「出租人權限」保留，既有確認事項不重複登錄。
- src/content/columns-zh/016-taiwan-inheritance-custody-analysis.md:57 | 可供檢查 → 可供檢查 | 不採納：此段為雜湊凍結內容，依鎖定規範保留；「追加計算」與法律規範的作用均未更動。
- src/content/columns-zh/013-taiwan-company-establishment-advanced-1.md:55 | 公司設立前用於收受資本額等的籌備處帳戶 → 公司設立前用來收取資本額等款項的籌備處帳戶 | 採納：以「等款項」補足「等的」的修飾對象，並改用自然的「用來收取」；保留設立前的帳戶用途及與正式公司帳戶程序可能不同的保留，未改資金程序。
- src/content/columns-zh/014-taiwan-mandatory-employment-period.md:56 | 可以回答勞工實際接受多少培訓 → 可以回答勞工實際接受多少培訓 | 不採納：此段為雜湊凍結內容，依鎖定規範保留；僅記錄動詞搭配意見，未變動培訓紀錄的證明內容。
- src/content/columns-zh/023-baby-taiwan-nationality-birth-registration.md:53 | 符合適用的定居類型並取得所需許可文件後 → 符合所適用定居類型的條件並取得所需許可文件後 | 採納：讓「符合」對應條件，「適用」對應定居類型，消除搭配不清；保留適用類型及取得許可文件兩項前提，未新增資格、變更30日期限或辦理程序。
- src/content/columns-zh/018-taiwan-semiconductor-market-entry.md:68 | 或未達該資本額但營業收入達1億元或參加勞保員工人數達100人 → 或未達該資本額但營業收入達1億元或參加勞保員工人數達100人 | 不採納：意見涉及公司財務報表查核門檻的要件關係；標點也可能改變「或」的範圍，不在潤飾中判定。原文與數字保留，新疑問已追加 LAWYER-REVIEW.md；原審閱行號66，現行為68。

同類字串已用 rg 搜尋 src、tests、scripts；可改的原片段僅出現在上述正文及013測試，未發現其他需同步的繁體中文版位。首頁鎖定字串、home parity 字串與測試、014／016凍結段落、其他語言、數字、條號、人名、地址、Email、href、作者標示及引用來源均保持原樣。法律疑問共新增3筆，未將審閱建議寫成已確認的法律結論。

驗證：013、017專欄、20260927家事專欄及014／016公開引用同步，共5個測試檔、47項測試全數通過；本輪差異、凍結檔案、保留資料與 git diff --check 檢查通過。未 commit、push，未執行 npm run build。

採納 7 筆，不採納 12 筆
