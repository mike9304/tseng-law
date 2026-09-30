# 次要頁面第1輪審閱處理紀錄

日期：2026-09-30。提出者：Grok，t2-r1（第1輪）。依 STYLE.md 逐筆處理，共27筆。行號為本回合處理後的原始碼行號。混合意見僅修改語言部分，計為採納1筆；未採納的法律或事實建議另列 LAWYER-REVIEW.md，不代表已確認審閱者的法律判斷。

機關名稱依[經濟部投資審議司官方網站](https://www.moea.gov.tw/Mns/dir/home/Home.aspx)統一；未因此改動程序、適用範圍或數字。

- src/app/[locale]/guides/taiwan-company-setup/content.ts:319 | 有台灣合夥人時為其三分之一（約17萬元），且公司年營業額須超過新台幣300萬元 → 有台灣合夥人時為其三分之一（約17萬元），且公司年營業額須超過新台幣300萬元 | 不採納：涉及工作許可的雇主資格、持股門檻、資本額及營業額條件，屬法律實質，且會刪改數字。第235、308、319行均保留，已列入 LAWYER-REVIEW.md。
- src/app/[locale]/guides/taiwan-company-setup/content.ts:268 | 外國人須向投資審議委員會提出投資計畫書，接受審查。投審會將確認資本額確實用於投資；核准後，須於1年內匯入資本額。 → 外國人須向經濟部投資審議司提出投資計畫書，接受審查。經濟部投資審議司將確認資本額確實用於投資；核准後，須於1年內匯入資本額。 | 採納（僅機關名稱）：依官方名稱統一為「經濟部投資審議司」，同步處理同頁第224、229、237、267、268行與全站其他繁中說明。適用對象、資金審定及名稱預查順序均不採納修改，已列入 LAWYER-REVIEW.md。
- src/components/floating-ai-quick-replies.ts:147 | 經濟性解僱（歇業、轉讓、虧損等）— 新制按年資每年 0.5 個月平均工資，最高 6 個月；非可歸責於勞工的解僱 — 同上，另加預告期間工資 → 經濟性解僱（歇業、轉讓、虧損等）— 新制按年資每年 0.5 個月平均工資，最高 6 個月；非可歸責於勞工的解僱 — 同上，另加預告期間工資 | 不採納：涉及解僱分類、預告期間工資、新舊制年資與資遣費規則，屬法律實質。已列入 LAWYER-REVIEW.md。
- src/components/floating-ai-quick-replies.ts:139 | 過失傷害罪須於 6 個月內提出告訴；民事損害賠償請求權的時效為 2 年。 → 過失傷害罪須於 6 個月內提出告訴；民事損害賠償請求權的時效為 2 年。 | 不採納：涉及告訴期間、侵權行為時效的起算點及新增10年期間，屬法律實質，不能補寫數字。已列入 LAWYER-REVIEW.md。
- src/app/[locale]/guides/taiwan-company-setup/content.ts:323 | 可以。投資人如需在台經營管理公司，可向勞動部申請外國人工作許可 → 可以。投資人如需在台經營管理公司，可向勞動部申請外國人工作許可 | 不採納：涉及公司設立、工作許可及居留資格之間的法律關係與核准順序，屬法律實質。已列入 LAWYER-REVIEW.md。
- src/components/floating-ai-quick-replies.ts:119 | 向投資審議司申請外國人投資 → 向經濟部投資審議司申請外國人投資 | 採納（僅機關名稱）：補齊「經濟部」並與其他頁一致。第118行「委任書認證」改成「授權書公證或認證」涉及文件及程序，第119行新增適用對象亦屬法律實質，均保留並列入 LAWYER-REVIEW.md。
- src/components/floating-ai-quick-replies.ts:127 | 平均約需 6 至 10 週。 → 平均約需 6 至 10 週。 | 不採納：6至10週改為3個月會改動時程數字及服務事實；不以另一頁的估計推定本則錯誤。已列入 LAWYER-REVIEW.md。
- src/app/[locale]/taiwan-debt-recovery-lawyer/content.ts:625 | 會直接起訴、凍結資產或聲請強制執行嗎？ → 會直接起訴、凍結資產或聲請強制執行嗎？ | 不採納：「凍結資產」換成特定的「聲請假扣押」會限縮程序種類，不能視為純同義替換。已列入 LAWYER-REVIEW.md。
- src/app/[locale]/guides/taiwan-company-setup/content.ts:331 | 即使沒有居留證，也可向移民署申請「統一證號基本資料表」辦理開戶。 → 即使沒有居留證，也可向移民署申請「統一證號基本資料表」辦理開戶。 | 不採納：涉及統一證號文件的法律用途與銀行開戶條件，屬法律實質。已列入 LAWYER-REVIEW.md。
- src/data/intent-pages.ts:634 | 從協商到訴訟都會處理。 → 可以從協商談起，必要時再評估訴訟。 | 採納：刪除一路處理到訴訟的概括服務承諾，改為必要時評估訴訟，不新增結果保證。
- src/app/[locale]/guides/taiwan-company-setup/content.ts:349 | 提供資料後，我們將安排與曾雋崴律師的諮詢。 → 請提供資料，我們確認後會說明如何與曾雋崴律師諮詢。 | 採納：將自動安排諮詢的承諾改為確認資料後說明諮詢方式；律師姓名保留。
- src/app/[locale]/taiwan-debt-recovery-lawyer/content.ts:573 | 是否已有期限正在進行。 → 是否有須留意的期限。 | 採納（僅句構）：同頁第573、601行改為「是否有須留意的期限」。不自行新增時效、除斥期間或契約期限的分類，該部分列入 LAWYER-REVIEW.md。
- src/data/intent-pages.ts:618 | 預計派遣來台的技術人員人數與停留期間，以及預計在台聘僱人數 → 預計派遣來台的技術人員人數與停留期間，以及預計在台聘僱人數 | 不採納：意見以勞務派遣的法律分類為理由，建議改寫會重新界定人員來源及派駐／聘僱安排，屬法律或服務事實，須先確認。已列入 LAWYER-REVIEW.md。
- src/data/legal-pages.ts:176 | 即以難以復原的方式銷毀，不予遲延 → 即以難以復原的方式銷毀 | 採納：刪除與「即」重複的「不予遲延」，保留立即銷毀、難以復原及法定保存義務。不採「不無故拖延」，避免放寬原有承諾。
- src/app/[locale]/korean-lawyer-in-taiwan/content.ts:111 | 承辦台灣公司設立、民刑事案件及投資顧問 → 承辦台灣公司設立、民刑事案件及投資顧問 | 不採納：「投資顧問」改為「外人投資事務」會重新界定實際服務範圍，不能只依本頁其他服務項目推定。第111、124、153行保留，已列入 LAWYER-REVIEW.md。
- src/app/[locale]/guides/taiwan-company-setup/content.ts:86 | 台灣公司設立：資本金匯款、銀行帳戶與外國人聘僱實務Q&A → 台灣公司設立：資本金匯款、銀行帳戶與外國人聘僱實務Q&A | 不採納：原文為所引專欄的標題；STYLE.md明定引用保持原樣，且無錯字。「資本金」的用語偏好不足以改動引用與所引標題，兩者均保留。
- src/data/intent-pages.ts:378 | 從初步整理事實、審閱文件、規劃程序到實際進行訴訟，都能一併檢視。 → 可一併檢視初步事實整理、文件審閱、程序規劃及訴訟階段的相關事項。 | 採納（僅句構）：將「檢視」的受詞改為各階段的相關事項；同改 korean-lawyer-in-taiwan/content.ts:125。未改成「都可以處理」，避免將檢視範圍擴成承辦承諾；該服務範圍疑問列入 LAWYER-REVIEW.md。
- src/data/intent-pages.ts:515 | 初期事實整理與證據保全速度，常會左右結果。 → 初期事實整理與證據保全宜及早進行。 | 採納（僅刪除結果暗示）：刪除「左右結果」，保留及早整理事實與保全證據的建議。未新增「影響之後還能主張的範圍」，該權利範圍說明屬法律實質，列入 LAWYER-REVIEW.md。
- src/app/[locale]/guides/taiwan-company-setup/content.ts:313 | 2023.12.27生效，自2024.1.1起適用；未透過固定營業場所取得的營業利潤免稅，股利稅率上限10% → 2023年12月27日生效，自2024年1月1日起適用；未透過固定營業場所取得的營業利潤免稅，股利稅率上限10% | 採納（僅日期格式）：日期值及10%均不變，將點號格式改為年月日。固定營業場所的判斷標準、免稅範圍及新增「原則上」涉及法律實質，保留原文並列入 LAWYER-REVIEW.md。
- src/app/[locale]/taiwan-debt-recovery-lawyer/content.ts:602 | 本頁不列出固定的訴訟預算或後酬比例。 → 本頁不列出固定的訴訟預算或後酬比例。 | 不採納：原句不足以確認「後酬」的計價與給付條件；直接改成「成功報酬」可能改變約定性質。保留並列入 LAWYER-REVIEW.md，請確認實際酬金用語。
- src/data/intent-pages.ts:396 | 諮詢後，將可立即處理的事項與仍須補件確認的部分分開進行。 → 諮詢後，區分可立即處理的事項與仍須補件確認的部分。 | 採納：以具體動詞「區分」取代受詞不明的「分開進行」，保留仍須補件確認的意思。
- src/data/intent-pages.ts:406 | 只做翻譯卻忽略文件格式或委任要求，常導致重工。 → 只做翻譯卻忽略文件格式或委任要求，常須重新處理。 | 採納：改為「常須重新處理」，降低工業用語色彩；不採「整份重做」，避免擴大原文所述程度。
- src/components/floating-ai-quick-replies.ts:299 | 拒絕合意離職／公司要求合意離職，但我不願意，該怎麼處理？ → 拒絕合意離職／公司要求合意離職，但我不願意，該怎麼處理？ | 不採納：「合意離職」與「自願離職」不是可直接互換的分類，且建議新增簽署文件的情境。涉及終止契約的法律性質及事實，已列入 LAWYER-REVIEW.md。
- src/app/[locale]/taiwan-debt-recovery-lawyer/content.ts:568 | 已記錄的交易影響（不等於已確定的損害） → 已記錄的交易影響（不等於已確定的損害） | 不採納：交易影響不必然已構成損失，將清單直接改成「損失紀錄」會重新描述事實及損害性質。已列入 LAWYER-REVIEW.md。
- src/data/legal-pages.ts:182 | 網站託管與私有物件儲存使用 Vercel → 網站託管與非公開的檔案儲存使用 Vercel | 採納：將雲端儲存術語改為「非公開的檔案儲存」，保留Vercel、OpenAI及郵件服務敘述。
- src/data/foreign-matter-router.ts:86 | 居留與移民／請簡述與台灣相關的情況，以便確認是否能協助。 → 居留與移民／與在台居留或停留有關的問題，請簡述情況，以便確認是否能協助。 | 採納：讓說明與「居留與移民」主題銜接，保留確認能否協助的界線；href不變。
- src/data/legal-pages.ts:254 | 閱讀對比 → 色彩對比 | 採納：以「色彩對比」清楚表達無障礙改善項目；同步更新 accessibility/__tests__/ja-page.test.tsx:114 的繁中文字串。

同類語言問題同步修正：機關名稱另更新 src/data/intent-pages.ts:632、674、src/app/[locale]/korean-lawyer-in-taiwan/content.ts:130、157、src/data/service-details.ts:25、41、src/data/site-content.ts:1354、1358，以及 src/content/columns-zh/018-taiwan-semiconductor-market-entry.md:70 的正文小標題。相關測試字串同步更新 src/data/__tests__/intent-pages-semiconductor.test.ts:292 與 src/lib/__tests__/seo-howto-jsonld.test.ts:62。其他語言中的原有機關名稱、禁止舊稱的測試案例、引用標題及法律AI助理作者資訊均保留。

驗證：相關10個測試檔共104項測試通過；本輪12個TS／TSX檔的ESLint通過；TypeScript語法樹差異檢查確認僅31處繁中文字串改動，程式邏輯、鍵名、其他語言區塊、數字與日期值、URL及Email均保留。另核對專欄僅更換正文機關名稱，作者與引用段落未動；LAWYER-REVIEW.md既有內容保留，新增32列均對得上現行文字與行號。git diff --check通過。未執行npm run build，未commit或push。

採納 14 筆，不採納 13 筆
