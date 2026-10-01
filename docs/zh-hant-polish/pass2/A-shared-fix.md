2026-10-01｜008・009 共用測試同步修訂｜Codex

依本次使用者總括授權，採用 A-r1-fix.md 末節「共用檔案需要」的六筆008與四筆009方案。已完整閱讀 docs/columns/EDITORIAL-VOICE.md、共用文體正本、STYLE.md 與 A-r1-fix.md。下列正文行號均指修訂前檔案；新增本紀錄之外，只改008・009及 columns-zh-labor-related-tails.test.ts。未 commit、未 push。

## 文句修訂

- src/content/columns-zh/008-taiwan-labor-severance-law.md:25 | 今天想和大家聊聊台灣的資遣費。 → 刪除 | 理由：僅預告題目，未提供法律條件；正式姓名首句與韓台制度比較保留。
- src/content/columns-zh/008-taiwan-labor-severance-law.md:29 | 先來看看韓國怎麼規定。 → 刪除 | 理由：下一句已交代韓國規定，刪導語不減少資訊。
- src/content/columns-zh/008-taiwan-labor-severance-law.md:51 | 我用一個簡單的表格為大家整理如下。 → 刪除 | 理由：表格直接呈現比較，不需第一人稱預告；整張表格及所列第11、12條原文保留。
- src/content/columns-zh/008-taiwan-labor-severance-law.md:79 | 員工必須小心謹慎，／／不要落入公司的圈套。 → 宜留意公司是否以施壓換取自願離職。 | 理由：以原有的施壓、自願離職情節取代恐嚇及訓誡口吻；此處是一般提醒，未減弱法定義務，也未新增資遣條件。
- src/content/columns-zh/008-taiwan-labor-severance-law.md:191 | **一定要留存證據。** → 刪除 | 理由：前文已有同句提醒；出勤、加班、業績、規章、郵件與對話錄音等證據項目全部保留。
- src/content/columns-zh/008-taiwan-labor-severance-law.md:217 | 大家在台灣也要保護好自己的權益。 → 刪除 | 理由：空泛勸語未增加權利條件；正文以原有「公司理應支付。」結束，相關文章連結保留。
- src/content/columns-zh/009-taiwan-voluntary-resignation-severance.md:16 | 如同前一篇所說的，在台灣員工要領到資遣費並不容易。 → 刪除 | 理由：依賴前篇的泛論沒有例外條件；直接從自願離職及第18條起筆。
- src/content/columns-zh/009-taiwan-voluntary-resignation-severance.md:20 | 尤其是在員工自願提出離職時，／／無法領取資遣費（勞動基準法第18條），／／這和韓國不同。 → 員工自願提出離職時，依勞動基準法第18條無法領取資遣費，這一點和韓國不同。 | 理由：合併斷裂句，刪空泛起語；離職條件、第18條及韓台比較不變。
- src/content/columns-zh/009-taiwan-voluntary-resignation-severance.md:28 | 但是有**例外情形**。 → 刪除 | 理由：下段直接說明例外與第14條準用第17條，無需重複預告；六款法定事由保留。
- src/content/columns-zh/009-taiwan-voluntary-resignation-severance.md:94 | 大多數情況下，事先做好準備的一方才能保障自己的權利。 → 刪除 | 理由：抽象準備勸語沒有新增期限或條件；前段終止契約的敘述與「時間」原句保留。

## 測試及閱讀時間期待值

| 檔案:行 | 原文 → 修改後 | 理由 |
| --- | --- | --- |
| src/content/columns-zh/008-taiwan-labor-severance-law.md:6 | read_time: "5分鐘閱讀" → read_time: "4分鐘閱讀" | 依修訂後漢字數重算，ceil(1538 / 400) = 4；僅閱讀時間例外更新，其餘前置資料保持原樣。 |
| src/lib/__tests__/columns-zh-labor-related-tails.test.ts:18 | finalBodyParagraph: '大家在台灣也要保護好自己的權益。' → '公司理應支付。' | 精確匹配008刪除勸語後的末段，保留 endsWith 與完整尾段精確相等斷言。 |
| src/lib/__tests__/columns-zh-labor-related-tails.test.ts:19 | visibleHanCount: 1_601 → 1_538 | 以 gray-matter 的 parsed.content 與原有 /\p{Script=Han}/gu 實測；精確 toBe 不變。 |
| src/lib/__tests__/columns-zh-labor-related-tails.test.ts:20 | readTime: '5分鐘閱讀' → '4分鐘閱讀' | ceil(1538 / 400) = 4；前置資料與 getColumnPost 的閱讀時間一致。 |
| src/lib/__tests__/columns-zh-labor-related-tails.test.ts:25 | finalBodyParagraph: '大多數情況下，事先做好準備的一方才能保障自己的權利。' → '「**時間**」非常重要。' | 精確匹配009刪除勸語後的末段，連 Markdown 加粗標記也逐字比對。 |
| src/lib/__tests__/columns-zh-labor-related-tails.test.ts:26 | visibleHanCount: 646 → 591 | 使用相同計數範圍與正則實測，保持精確 toBe。 |
| src/lib/__tests__/columns-zh-labor-related-tails.test.ts:27 | readTime: '2分鐘閱讀' → '2分鐘閱讀'（不變） | ceil(591 / 400) = 2；009前置資料維持2分鐘。 |

目前儲存庫沒有獨立的 columns-zh-labor-008.test.ts 或 columns-zh-labor-009.test.ts；008・009專用檢查即為上述共用檔案中各 target 的兩項測試，共四項。已同步所有會受本次修改影響的期待值，未新增測試檔、未改其他語言測試。describe 以下的斷言邏輯、正則、400字公式與 HEAD 逐位元相同；沒有刪除或放寬檢查。columns-zh-content.test.ts 的008正式姓名檢查未修改且執行通過。

## 文體與保全覆核

008開頭「您好，我是台灣律師曾雋崴。」依指示保留，下一個文字段落直接交代韓國退職金。009前兩個文字段落分別交代自願離職的一般敘述與第14條例外；逐句刪除會失去法律依據或韓台對照，故保留。已刪的導語均不提供額外條件。

對照 A-r1-fix.md 所用最近三篇同語言文章050、047、046的開頭與結尾：各自從事故處理、購屋資格及跨國夫妻財產起筆，未套用統一模板。本次008維持比較與案例敘事，009直接說明離職與例外，未增設問答小標、清單或諮詢宣傳。此為AI文體覆核，不標示真人原語者或律師認證。

修訂前後檢查：兩篇除008 read_time之外的前置資料完全一致；正文數字序列、URL／圖片路徑、相關文章尾段逐字不變；既有姓名及AI標記的出現次數不變，未新增電話號碼。008第11、12條表格、0.5個月／6個月／第17條年資計算，009六款事由、兩處30日及各自知悉起點均保留。已知「公司理應支付」、第14條分類及先終止契約等待確認法律敘述，依本次純文體範圍保留，不藉本紀錄確認其正確性；LAWYER-REVIEW.md、嵌入資料及其他回合變更未修改。

## 執行結果

`npx vitest run src/lib/__tests__/columns-zh`：exit 0，17個檔案通過，228項測試通過；其中008・009共用檔案四項全部通過。指定三個修改檔案的 `git diff --check` 通過。完整檢查測試差異，只有五個期待值常數更新。

測試輸出最後一個非空白行：

   Duration  964ms (transform 132ms, setup 20ms, collect 525ms, tests 141ms, environment 1ms, prepare 399ms)
