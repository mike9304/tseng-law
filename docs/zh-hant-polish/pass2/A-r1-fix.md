2026-10-01｜審閱檔案：docs/zh-hant-polish/pass2/A-r1-grok.md｜修訂模型：GPT-6.1 Sol（Codex）

行號以修訂前 HEAD（3ccc5131）的實際位置為準；審閱檔案部分句子合併引述或行號已有落差，下列保留實際原文。採納修訂案不表示逐字照用審閱者的提案；不採納包含語意判斷、凍結及禁止修改共用檔案所致的本輪保留。002與003沒有審閱意見，原檔保留。

- src/content/columns-zh/001-taiwan-company-establishment-basics.md:2 | 台灣公司設立基礎：子公司、分公司、代表人辦事處、設立程序與工作許可 → 保留原題（title 與 H1） | 不採納：建議的「先分」仍是指示語氣，且把題目縮為組織分類，省略本篇實際涵蓋的設立程序與工作許可；原題的比較項目有內容依據。
- src/content/columns-zh/001-taiwan-company-establishment-basics.md:29 | 本文先區分進入台灣的組織形式，再依序說明設立子公司的一般流程、行業與場所的事前確認、外國人的工作與居留及資本額問題，以及主要稅負。 → 刪除 | 採納：僅預告章節；同段的事業模式、投資人所在地、交易、資金、人力與場所評估仍在，各節法律內容未刪。
- src/content/columns-zh/004-taiwan-company-subsidiary-vs-branch.md:29 | 以下依法人格、稅務、責任、資金籌措、投資抵減、所得稅協定與退場的順序比較。 → 刪除 | 採納：小標已呈現比較項目；前文的法人區別、選擇因素與韓國程序提醒全部保留。
- src/content/columns-zh/005-taiwan-company-establishment-advanced-2.md:29 | 曾雋崴律師（Wei Tseng）以問答說明各項制度容易混淆的地方。 → 刪除 | 採納：僅介紹問答形式；前文的五項問題與適用差異、文末律師姓名均保留。
- src/content/columns-zh/005-taiwan-company-establishment-advanced-2.md:98 | 申請前，依類別逐項核對職務、外國人本人的資格、雇主資格、薪資、契約期間及應備文件，十分重要。 → 申請前，依類別核對職務、外國人本人的資格、雇主資格、薪資、契約期間及應備文件。 | 採納：採修訂案：刪空泛強調，保留「外國人本人的資格」，避免「本人」所指不明；申請前的時點、類別與六項資料不變。
- src/content/columns-zh/005-taiwan-company-establishment-advanced-2.md:100 | 辦理程序前的確認 → 匯款、帳戶轉換與聘僱許可的時程 | 採納：採修訂案：用具體事項取代通用小標；不採「要各對各」的口語命令。正文仍分別確認匯款、銀行與許可，未新增法定先後順序；專用測試同步精確比對新小標。
- src/content/columns-zh/006-taiwan-massage-history-law.md:2 | 台灣按摩歷史與法律資訊 → 保留原題（title 與 H1） | 不採納：「只准視障者經營」把正文的從業限制改成經營資格，涉及適用範圍；不能當作純標題潤飾，另列 A-lawyer-additions.md。
- src/content/columns-zh/006-taiwan-massage-history-law.md:20 | 當時理髮廳的洗髮方式很有特色。 → 刪除；下一句接為「當時的理髮廳不僅提供理髮服務，還有刮鬍子、臉部護理等各種服務。」 | 採納：刪除尚未說明特色的空句，下一句補回原有時間與主詞；刮鬍、臉部護理、坐著洗頭及頭皮肩頸按摩的事實保留。
- src/content/columns-zh/006-taiwan-massage-history-law.md:32 | （不小心暴露年齡了吧？） → 刪除 | 採納：作者年齡玩笑不提供沿革或法律資訊，也不應為 AI 文字暗示個人年齡；前句的文化記憶仍在。
- src/content/columns-zh/006-taiwan-massage-history-law.md:42 | 大家可以依自己的喜好，選擇適合的按摩方式舒壓。 → 刪除 | 採納：無條件、例外或史實的消費勸語；按摩種類、釋憲經過與後文安全提醒均保留。
- src/content/columns-zh/006-taiwan-massage-history-law.md:96 | 原本只是單純想透過按摩舒壓，卻因遭受性騷擾而留下一輩子心理創傷的案例時有所聞。 → 刪除 | 採納：沒有出處的個案及終身心理後果不宜用來渲染；性騷擾與猥褻警示、要求停止及報案文字保留，未動既有報案方式待確認事項。
- src/content/columns-zh/007-taiwan-divorce-lawsuit-qna.md:31 | 才能減少重複程序與執行上的空窗 → 保留原文 | 不採納：專用測試以整篇 SHA-256 與可見漢字數逐字凍結，不能改或更新凍結值；建議新增「登記或裁判做了、卻接不上執行」也涉及登記、裁判與執行的關係，另列 A-lawyer-additions.md。
- src/content/columns-zh/008-taiwan-labor-severance-law.md:23 | 您好，我是台灣律師曾雋崴。 → 保留原文 | 不採納：寒暄確可刪，但這是本篇唯一的「曾雋崴」字樣；共用 columns-zh-content.test.ts 要求008保留正式姓名，直接刪除會破壞身分檢查。不能移除該斷言，也不自行另造作者署名；漢字數亦被共用測試固定。
- src/content/columns-zh/008-taiwan-labor-severance-law.md:25 | 今天想和大家聊聊台灣的資遣費。 → 保留原文（建議刪除，待共用檔案調整） | 不採納：同意它只是題目預告。本篇與009共用 columns-zh-labor-related-tails.test.ts，正文漢字數被精確固定；本輪禁止改共用測試，因此正文保留，具體方案見末節。
- src/content/columns-zh/008-taiwan-labor-severance-law.md:29 | 先來看看韓國怎麼規定。 → 保留原文（建議刪除，待共用檔案調整） | 不採納：下一句已直接說韓國規定，導語沒有新資訊。本篇與009共用 columns-zh-labor-related-tails.test.ts，正文漢字數被精確固定；本輪禁止改共用測試，因此正文保留，具體方案見末節。
- src/content/columns-zh/008-taiwan-labor-severance-law.md:51 | 我用一個簡單的表格為大家整理如下。 → 保留原文（建議刪除，待共用檔案調整） | 不採納：表格本身足以引入比較，介紹語可刪。本篇與009共用 columns-zh-labor-related-tails.test.ts，正文漢字數被精確固定；本輪禁止改共用測試，因此正文保留，具體方案見末節。
- src/content/columns-zh/008-taiwan-labor-severance-law.md:79 | 員工必須小心謹慎，／／不要落入公司的圈套。 → 保留原文（建議「宜留意公司是否以施壓換取自願離職。」） | 不採納：「圈套」帶有恐嚇口吻；建議沿用前文的施壓事實，不變動資遣條件。本篇與009共用 columns-zh-labor-related-tails.test.ts，正文漢字數被精確固定；本輪禁止改共用測試，因此正文保留，具體方案見末節。
- src/content/columns-zh/008-taiwan-labor-severance-law.md:191 | **一定要留存證據。** → 保留原文（建議刪除此處重複句） | 不採納：前文已有留證提醒；出勤、加班、業績、規章、郵件與錄音項目可全部保留。本篇與009共用 columns-zh-labor-related-tails.test.ts，正文漢字數被精確固定；本輪禁止改共用測試，因此正文保留，具體方案見末節。
- src/content/columns-zh/008-taiwan-labor-severance-law.md:217 | 大家在台灣也要保護好自己的權益。 → 保留原文（建議刪除，待共用檔案調整） | 不採納：沒有新增權利條件，但共用測試同時固定此結尾及漢字數；既有「資遣費是員工的法定權利／公司理應支付」待確認句不動。
- src/content/columns-zh/009-taiwan-voluntary-resignation-severance.md:16 | 如同前一篇所說的，在台灣員工要領到資遣費並不容易。 → 保留原文（建議刪除，待共用檔案調整） | 不採納：導語依賴前篇，又未交代例外；同意刪除方向，但共用測試精確固定本篇646字，不能越界改測試。
- src/content/columns-zh/009-taiwan-voluntary-resignation-severance.md:20 | 尤其是在員工自願提出離職時，／／無法領取資遣費（勞動基準法第18條），／／這和韓國不同。 → 保留原文（建議合為「員工自願提出離職時，依勞動基準法第18條無法領取資遣費，這一點和韓國不同。」） | 不採納：同意合段，法條及韓台對照可保留；但新文字會改動共用測試的漢字數，故本輪不改。第14條與第15條的既有待確認分類不動。
- src/content/columns-zh/009-taiwan-voluntary-resignation-severance.md:28 | 但是有**例外情形**。 → 保留原文（建議刪除，待共用檔案調整） | 不採納：下一段已明示特殊情況與第14條，可直接銜接；刪除會改動共用固定漢字數，故暫留，未動法定事由。
- src/content/columns-zh/009-taiwan-voluntary-resignation-severance.md:94 | 大多數情況下，事先做好準備的一方才能保障自己的權利。 → 保留原文（建議刪除，待共用檔案調整） | 不採納：抽象勸語沒有新的期限或文件內容，但共用測試精確固定此結尾及646字，故本輪保留；法定30日期限及既有先後終止疑問不動。
- src/content/columns-zh/010-taiwan-gym-injury-lawsuit.md:112 | 協商、消費申訴或調解、刑事告訴與民事求償，都是依具體事實選擇的途徑，並非每件事件都必須全部進行。 → 保留原文 | 不採納：除重述途徑，也包含依具體事實選擇及不必全部進行的法律限定；依保全規則不刪。第1節未完整重列協商、消費申訴或調解，不能視為全句無資訊；另列 A-lawyer-additions.md。
- src/content/columns-zh/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md:2 | 進入台灣化粧品市場：進口主體、產品登錄、PIF 的建立與保存及廣告規範 → 保留原題（title 與 H1） | 不採納：建議的「四件事」過度概括本篇的主體、程序及持續義務，且省掉題目中的 PIF 建立與保存。這裡列出並行制度有比較功能，不必把有用的法規項目一律改為口語數目。
- src/content/columns-zh/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md:25 | 以下將進入台灣的型態與法定責任主體、TFDA 產品登錄、PIF 的建立、更新與保存、標示與廣告，以及查核與改正措施分別說明。 → 刪除 | 採納：只預告章節；同段產品別及最新指引提醒、下文的建立／更新／保存與查核措施均保留。
- src/content/columns-zh/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md:103 | 上市前的確認順序 → 產品登錄、PIF 與廣告的分別檢視 | 採納：採修訂案：指出各制度分別檢視，避免「別把……混成一步」命令口吻；六項順序、登錄時點及 PIF 建立更新保存義務不變，專用測試同步精確比對新小標。

文體與保全覆核：已讀 EDITORIAL-VOICE.md、STYLE.md、COLUMN-VOICE-RULE.md、共用正本及 LAWYER-REVIEW.md 的既有待確認項目。第一、二段逐句刪除檢視：001 的業務模式及程序區分、004 的獨立法人及組織選擇因素、005 的五項問題與申請差異、011 的責任主體及適用義務差異，均提供後文所需背景而保留。006 第一句是銜接理髮廳沿革的回憶問句，專用測試精確比對，予以保留；第二句的「很有特色」無額外事實，刪除並將原有主詞接回服務說明。沒有刪改既有的法律條件或待確認內容。

對照目前儲存庫按 lastmod 排序最近的三篇同語言文章（050、047、046；均為2026-09-30）：050從事故處理起筆，047區分購屋資格與不同階段稅負，046從跨國夫妻財產情境起筆，開頭及收尾並非單一模板。本輪五篇維持各自的比較、問答及歷史敘事，不增設統一提問小標、清單或諮詢段落。此為儲存庫文案比對，非正式原語者或律師認證。

五篇已修改檔案的全部前置資料、數字序列、URL／href／圖片路徑、Email，以及「法律AI助理／獨立／自動／無過失／必要性」與修訂前一致。003、007、014、016及未修改的002、008、009、010逐位元不變。LAWYER-REVIEW.md、嵌入資料與共用測試未修改。本工作樹另有其他回合的變更，未納入、修改或還原。

專用測試僅同步小標字串與實測漢字數：001 4_320→4_260、004 7_931→7_900、005 3_699→3_678、011 3_777→3_734；精確相等斷言、法規條件檢查、每分鐘400字公式及所有閱讀時間均保留。首輪修訂後失敗4項均為上述字數差異，同步專用測試後重新執行通過。未刪斷言、未放寬正則、未修改凍結雜湊。

採納 11 筆，不採納 16 筆

測試：`npx vitest run src/lib/__tests__/columns-zh`，exit 0，17個檔案及228項測試全部通過。A不是議題組，無須執行 issue-board。輸出最後一個非空白行：

```text
   Duration  1.02s (transform 130ms, setup 23ms, collect 563ms, tests 142ms, environment 1ms, prepare 421ms)
```

## 共用檔案需要（공용 파일 필요）

本輪不修改下列共用檔案；008、009正文也未套用這些候選案。

- `src/lib/__tests__/columns-zh-labor-related-tails.test.ts`：若後續開放共用測試與008閱讀時間更新，可在保留008正式姓名首句的前提下，刪「今天想……」「先來看看……」「我用一個……」三句、第二個加粗「一定要留存證據。」及末句「大家在台灣……」，並把「員工必須小心謹慎，／不要落入公司的圈套。」改為「宜留意公司是否以施壓換取自願離職。」。僅以記憶體模擬這六筆，008目標的 `finalBodyParagraph` 應由 `大家在台灣也要保護好自己的權益。` 改為 `公司理應支付。`，`visibleHanCount` 由 `1_601` 改為 `1_538`，`readTime` 由 `5分鐘閱讀` 改為 `4分鐘閱讀`；精確斷言與400字公式不動。相應008前置資料 `read_time` 也須由 `5分鐘閱讀` 改為 `4分鐘閱讀`，這超出本輪保留數字的範圍，不能自行執行。此處只是條件式技術方案，不批准既有「公司理應支付」法律結論；相關既有律師待確認句照原規則保留。
- 同一共用測試：若後續允許採用009四筆文體案，刪首句、刪「但是有**例外情形**。」、合併自願離職與第18條、韓台對照三段為本記錄的提案，並刪最後空泛準備句。記憶體模擬所得009目標 `finalBodyParagraph` 應由 `大多數情況下，事先做好準備的一方才能保障自己的權利。` 改為 `「**時間**」非常重要。`，`visibleHanCount` 由 `646` 改為 `591`；`readTime: '2分鐘閱讀'` 不動。保留尾段連結、精確相等與閱讀時間公式；此方案不更動既有第14條分類、30日期限或先終止的法律待確認句。
- `src/lib/__tests__/columns-zh-content.test.ts`：008的正式姓名斷言應保留，不刪 `zhIdentityFiles` 中的008、不刪 `toContain('曾雋崴')`。審閱者要求刪除008唯一署名的提案不採用，不能靠削弱共用身分檢查來完成。
- `src/content/column-embeddings*.json`、`docs/zh-hant-polish/LAWYER-REVIEW.md`：無需變更；新增法律疑問已寫入本組專用 `docs/zh-hant-polish/pass2/A-lawyer-additions.md`。
