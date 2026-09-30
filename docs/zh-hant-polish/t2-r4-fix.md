# 次要頁面第4輪審閱處理紀錄

日期：2026-09-30。提出者：Sol，t2-r4（第4輪）。依 STYLE.md 逐筆處理，共13筆。行號為處理後的原始碼行號。只改繁體中文用語與句構；法律條件、數字、條號、人名、地址、Email、href 與引用標題未改。沒有新增電話。「法律AI助理」作者框與引用未動。沒有列入新的律師確認事項。

- src/data/intent-pages.ts:401 | 事件發生日期、目前進度、緊急時程 → 事件發生日期、目前進度、急迫事項的期限 | 採納：「緊急時程」看不出要提供哪一種時間。改成急迫事項的期限，仍是請當事人準備的時間資訊，沒有新增法定期限或時效。全檔沒有第二處「緊急時程」。
- src/data/intent-pages.ts:617 | 目前使用的供應契約、NDA、代理商契約（母公司語言版本及英文版本） → 目前使用的供應契約、NDA、代理商契約（母公司使用的語言版本及英文版本） | 採納：「母公司語言」不是語言名稱。改成母公司使用的語言版本。文件種類與英文版本都保留。
- src/data/intent-pages.ts:394 | 先整理案件或商業目的，確認契約與證據目前掌握到什麼程度。 → 先整理案件或商業目的，確認目前已掌握哪些契約與證據。 | 採納：「掌握到什麼程度」沒有說要盤點手上的契約與證據。改成確認目前已有哪些，沒有新增應備文件或證據方法。
- src/app/[locale]/guides/taiwan-company-setup/content.ts:297 | 合資（其他股東參股） → 合資（其他股東參與投資） | 採納：「參股」偏大陸用語。括號改成其他股東參與投資。比較結果「可以／不可」與「外國總公司100%持有」未改。全站沒有第二處「參股」。
- src/data/legal-pages.ts:182 | 網站託管與非公開的檔案儲存使用 Vercel；AI 諮詢功能啟用時，由 OpenAI 產生回覆內容。電子郵件則透過本所使用的郵件服務寄送。 → 網站代管與非公開的檔案儲存使用 Vercel；AI 諮詢功能啟用時，由 OpenAI 產生回覆內容。電子郵件則透過本所使用的郵件服務寄送。 | 採納：網站服務的「託管」改為台灣較常用的「代管」。Vercel、OpenAI 與郵件服務未改。付款畫面的「託管付款」、AI 端點的「託管 AI 客戶端」是 hosted 的技術標示，不改。
- src/app/[locale]/taiwan-debt-recovery-lawyer/content.ts:607 | 本所不承諾全程無須到場，也不承諾完全不需辦理在台程序。所需文件、到場、翻譯、公證及在台程序，須確認事實後再說明。 → 本所不承諾全程無須到場，也不承諾完全不需辦理在台程序。所需文件、到場、翻譯、公證及在台程序，須確認事實後再說明。 | 不採納：建議句「不保證全程無須到場或免辦在台程序」的「或」，可能讀成免辦在台程序。t2-r3 已因此分成兩次「不承諾」。同段開頭「人在台灣以外，通常也可先以電子郵件或視訊討論」保留。「到場」與前句「無須到場」對應，維持原並列。
- src/lib/semiconductor-public.ts:67 | 機密資料請待利益衝突確認後再提供。 → 機密資料請待確認有無利益衝突後再提供。 | 採納：寫明確認的是有無利益衝突，與 foreign-matter-router、IntentLandingPage 的「有無利益衝突」一致。同語另改 src/lib/email/send-jhsu-intake-email.ts:90「對方當事人（利益衝突確認用）」→「對方當事人（確認有無利益衝突）」、第95行「受任前請先進行利益衝突確認」→「受任前請先確認有無利益衝突」。收件人與 Email 未改。「利益衝突檢查」動詞已清楚，不改。
- src/app/[locale]/taiwan-debt-recovery-lawyer/content.ts:527 | 預付款後未交貨 → 預付貨款後未交貨 | 採納：「預付款」直接接「後」，容易看成款項名稱。本節是未交貨，同頁第504行已用「預付貨款」。同頁第500行「預付後未交貨」、src/data/multilingual-international-v2.ts:688「預付款後未交貨」一併改為「預付貨款後未交貨」。第532行「預付款或進度款證明」是文件名稱，沒有接「後」，不改。日文、韓文未動。
- src/app/[locale]/guides/taiwan-company-setup/content.ts:303 | 以下數值整理自本所專欄公開的一般要件、稅率與時程；實際費用依行業、資本額與代辦費用而有不同。 → 以下內容整理自本所公開專欄，涵蓋一般要件、稅率與時程；實際費用依行業、資本額與代辦費用而有不同。 | 採納：「一般要件」不全是數值，來源與整理內容也黏在一起。後半句的實際費用保留。表內資本額、稅率、日期與10%未改。工作許可條件仍待 LAWYER-REVIEW 的 t2-r1 第1筆，這次不改法律內容。
- src/data/intent-pages.ts:624 | 只把海外母公司範本翻譯後直接使用，品質保證範圍或交期延誤條款，可能與台灣客戶的採購條件不一致。 → 若直接翻譯並使用海外母公司範本，其中的品質保證範圍或交期延誤條款，可能與台灣客戶的採購條件不一致。 | 採納：補上條件連接，並用「其中的」標明條款屬於範本。仍寫「可能不一致」，沒有改成一定無效，也沒有增刪條款類型。
- src/data/intent-pages.ts:535 | 若情緒先行，和解與訴訟策略都容易失衡。 → 若受情緒影響，容易在和解與訴訟策略上失去判斷。 | 採納：「情緒先行」「策略失衡」沒有說出情緒和判斷的關係。仍是提醒，沒有新增和解或起訴條件。
- src/components/FloatingAiChat.tsx:1259 | 律師將親自審閱後回覆 → 律師將親自審閱後回覆 | 不採納：「審閱後回覆」的「後」已經連接先審閱、再回覆。建議的「再予回覆」是公文腔，聊天按鈕的說明維持現句。前一輪已把這個元件統一成「審閱」。
- src/data/legal-pages.ts:247 | 說明本站為讓不同使用者都能順利瀏覽，持續進行的無障礙改善方向。 → 說明本站持續改善無障礙使用的方向，協助不同使用者順利瀏覽。 | 採納：「進行」不能接「方向」。仍是在說明無障礙改善方向。生效日期與內文項目未改。

驗證：`npx vitest run src/components/__tests__/multilingual-international-v2.test.tsx src/data/__tests__/intent-pages-semiconductor.test.ts src/data/__tests__/legal-pages-ja.test.ts src/data/__tests__/privacy-policy-operational-facts.test.ts src/app/[locale]/taiwan-debt-recovery-lawyer/__tests__/page.test.tsx src/app/[locale]/guides/taiwan-company-setup/__tests__/content.test.ts src/app/[locale]/accessibility/__tests__/ja-page.test.tsx src/lib/email/__tests__/send-jhsu-intake-email.test.ts src/lib/__tests__/semiconductor-public-board.test.ts`，9 個檔、93 項通過。沒有單元測試以舊字串做完全相同斷言，故未改測試。未執行 npm run build，未 commit 或 push。

採納 11 筆，不採納 2 筆
