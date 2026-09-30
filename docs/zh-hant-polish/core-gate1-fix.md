# core-gate1 修正紀錄（Fable／Astra 核心文案第1道把關）

審閱來源：core-gate1-fable.md（語言6筆、法律實質2筆、備註1則）、core-gate1-astra.md（語言5筆）。兩位審閱者重複指出的3處（faq-content.ts:139、152，archive-copy.ts:13）合併為一筆，共10筆。行號為修正後的現行行號。

- src/data/faq-content.ts:139 | 在台灣被牽涉刑事案件該怎麼辦？ → 在台灣捲入刑事案件該怎麼辦？ | 採納（Fable＋Astra）：「被牽涉」後直接接名詞，不成句。韓文原文「형사 사건에 연루되면」即「捲入」，答案談陪偵、緘默權，是以涉案人的角度寫的，「捲入」比「涉及」貼切。
- src/data/faq-content.ts:152 | 事先掌握產業法規，並與設立程序同步進行。 → 宜事先掌握產業法規，並讓相關申請與設立程序同步進行。 | 採納（Fable＋Astra）：原句沒有主語，也看不出「同步進行」的是什麼。韓文、英文版都是建議把行業許可等程序與設立程序並行，所以用「宜」保留建議語氣。不採 Astra 的「應」，因為「應」會把建議寫成義務。用「相關申請」而不用 Fable 的「相關許可」，因為同段的產品登錄不是許可，許可分類已列入 core-r5 待律師確認，不應藉由用字替它分類。
- src/components/AttorneyProfileSection.tsx:30 | 所屬律師與同仁 → 本所律師與同仁 | 採納（Fable）：「所屬律師」直譯自日文「所属弁護士」、韓文「소속 변호사」，台灣事務所網站習慣寫「本所律師」。字數不變。
- src/lib/builder/canvas/decompose-page-shared.ts:80 | 所屬律師與同仁 → 本所律師與同仁 | 採納（上一筆的連帶修正，不另計）：Builder 律師頁 seed 使用同一組標籤，一併修改以維持全站一致。已確認這個字串不在 home-zh-hant-parity 鎖定群組內，也沒有測試逐字斷言。
- src/app/[locale]/(legacy)/legacy-page-bodies.tsx:119 | 資格與所屬 → 資格與現職 | 採納（Fable）：「所屬」單獨作欄名是日韓用法。這一欄的內容是「具備台灣律師資格的〇〇事務所代表律師」，即資格加上目前職位。台灣律師簡介常用「現職」，字數與原文相同。「代表律師」職稱本身已列入 core-r1 待律師確認，本筆只改欄名。
- src/app/[locale]/lawyers/[slug]/page.tsx:59 | 代表業務與案例 → 主要業務與代表案例 | 採納（Fable）：「代表業務」不成詞。這張卡片列出1件案例與2項業務類型，改後可以涵蓋兩者，「代表案例」也與 AttorneyMediaHubView.tsx:43 一致。標題多2字，仍是短卡片標題。
- src/lib/insights/archive-copy.ts:13 | 以下內容直接對應已整理的專欄原文與圖片素材。 → （不改） | 不採納（Fable＋Astra）：這不是前台顯示的文案。它位於 `LEGACY_ARCHIVE_INTRO_COPY`，是比對舊版已發布 Builder 首頁殘留文字用的鍵。`projectPublishedHomeInsightsArchiveIntro` 找到完全相同的字串時，會改顯示 `ARCHIVE_INTRO_COPY['zh-hant']`（「查看台灣公司設立、投資與爭議處理所需的法律資訊。」）。若修改這個鍵，已存舊字串的頁面就不會再被替換，讀者反而會看到這句舊文案。archive-copy.test.ts 與 published-insights-copy.test.tsx 也以舊字串驗證這個替換，兩者都通過。Fable 提問「是否應公開顯示」，答案是：目前不會公開顯示。
- src/data/service-details.ts:183 | 新制年資因法定事由終止契約時，原則上每滿一年發給二分之一個月平均工資 → 新制年資部分，契約因法定事由終止時，原則上每滿一年發給二分之一個月平均工資 | 採納（Astra）：原句會讀成「年資」終止契約。改為「新制年資部分」作主題、「契約……終止」作條件，與勞工退休金條例第12條「於勞動契約依……規定終止時」的句構一致。條件仍只修飾新制這一段，不擴及分號後的舊制；二分之一個月、未滿一年按比例、六個月上限、舊制一個月都沒有改。不採 Astra 把條件移到句首的寫法，因為那樣會讓條件同時修飾舊制，改變原句的範圍。
- src/data/attorney-profiles.ts:191 | 如何開始與曾雋崴律師的諮詢？ → 如何向曾雋崴律師諮詢？ | 採納（Astra）：「開始與某人的諮詢」是外語句構。答案內容（先提供案件背景與文件，再做初步評估）不變。這不是首頁 FAQ「諮詢方式」的鎖定答案，也沒有測試逐字斷言。
- src/data/site-content.ts:1354、1357 | 公司型態選擇（子公司、分公司、有限公司）／公司型態比較：子公司、分公司、有限公司 → （不改） | 不採納，轉律師（Fable 法律實質）：公司型態分類屬法律內容，已追加 LAWYER-REVIEW.md（core-gate1），併入 core-r1 的 faq-content.ts:92、service-details.ts:40 一起確認。
- src/data/service-details.ts:41 | 委託書公證 → （不改） | 不採納，轉律師（Fable 法律實質）：委託書、委任書、授權書是不同文件，公證與認證也是不同程序，名稱統一涉及法律內容。已追加 LAWYER-REVIEW.md（core-gate1），與 t2-r1 第6筆（floating-ai-quick-replies.ts:118）、公司設立指南第237、271行一起確認。

## 測試同步

- src/data/__tests__/faq-content-ja-factual-consistency.test.ts:78 | zh-hant 雜湊 c697bebe…af704919 → 5b99ede1…3e073c47a9 | 同步（不計件）：faq-content.ts 第139、152行已改，zh-hant FAQ 的 byte-stable 雜湊隨之更新。只改常數，未改測試邏輯。

## 備註：Fable 提到的 site-content.ts:1217 統計段說明（不計件、未改）

- 現行 site-content.ts:1217「事務所以中文、韓文、日文、英文4種語言提供台灣法律諮詢。以下依官方律師簡介整理：…」與 home-zh-hant-parity.ts:314 的鎖定 `after`「事務所提供中文／韓文／日文／英文4種語言的台灣法律諮詢。並依官方律師簡介整理：…」確實不同。site-content 的版本是 commit 90907510 為符合 home-stats-factual-claims.test.ts 而還原的；parity 的 `after` 屬鎖定字串。依 STYLE 規定，兩邊都沒有改。
- 實測兩者不一致會造成失敗：`home-zh-hant-editor-read.test.ts` 有4項測試失敗（預期讀到 site-content 版本，實際投影出 parity `after` 版本）。我把本輪8處修改暫時還原後重跑，這4項仍然失敗，所以不是本輪造成的，屬於既有問題，需要有人決定以哪一版為準。
- 同樣在本輪修改前就已失敗的還有 decompose-about.test.ts 與 zh-hant-standalone-baseline.test.ts 的 about 版面高度（stageHeight 預期 5315，實際 5221）。原因推測是工作區中尚未 commit 的 firm-introduction.ts（core-r5）縮短了段落，與本輪修改無關。

## 驗證

`npx vitest run`：以引用 faq-content、attorney-profiles、service-details、decompose-page-shared、AttorneyProfileSection、legacy-page-bodies、lawyers/[slug]、archive-copy 及 seed-pages 的95個測試檔路徑作篩選條件，含方括號的路徑改用檔名尾段比對，實際跑了350個測試檔。結果 347 個檔案通過、3 個失敗；3384 項測試中 3378 項通過、6 項失敗。這6項就是上面備註中本輪修改前已存在的失敗；本輪造成的 FAQ 雜湊失敗已經同步修正。未執行 build、commit、push。

採納 7 筆，不採納 3 筆
