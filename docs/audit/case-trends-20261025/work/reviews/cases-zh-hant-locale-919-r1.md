# PASS — 919 繁體中文獨立語文審稿（r1）

- 審查日：2026-10-25。
- 角色：/root/review_zh_case_trends，AI 繁體中文獨立編輯角色；未撰寫或修改本稿，不宣稱人類母語或律師審查。
- 稿件：`/Users/son7/tseng-case-trends-20261025/repo/src/content/columns-zh/919-taiwan-workplace-bullying-investigation-hearing-judgment.md`
- SHA-256：`9696db15f3510d1f1d5b3f0dda3f0471d2e70a25b1bce625ca2fb3a49cceb390`
- 判定範圍：全文、標題／摘要／FAQ、臺灣用語、法律敘述界線、三篇近期同語文章比較、實際圖片與 alt/caption、句型檢查。PASS 不是發布或部署證明。

## 實質結論

本篇以公務員免職案的程序及調查缺失為中心，再明確將私人雇主的直接義務放回現行職安法。第27、39、41、53行未把撤銷處分寫成「沒有霸凌」、刑事無罪、已復職、確定判決或私人公司懲處當然無效。人物匿名，沒有事務所承辦／勝訴或外國執照暗示。

第41、43行對客觀、公正、公平、陳述答辯、利益迴避、保護與調查並行及協調未成續查的敘述，符合本次重新開啟的現行職安法第22條之2。法規沿革及職安署2026-06-23說明均支持2026-07-01施行；不是僅憑公布日推定施行。未將按人數分級的特定調查小組門檻擴及所有雇主。

## 阻擋問題

無。

| File:line | 原句 | 問題／理由 | 建議 | 法律意義保留？ |
| --- | --- | --- | --- | --- |
| 919:49 | 答辯需要回應的標的。 | 可選語感修整；「回應的標的」較抽象，但下一句已說明通知須指出爭議行為與時間，不構成理解障礙。 | 如再修稿，可作「通知要說清楚待查事項。」；本次不要求因可選修辭改動已通過版本。 | 是；僅把同一程序建議寫具體，沒有增減法定義務。 |

## 前兩段逐句刪除試驗

1. 第25行第一句：刪除會失去案件結果及處分性質，保留。
2. 第25行第二句：刪除會只剩撤銷結果，讀者無從知道後文處理哪些程序與證據問題，保留。
3. 第27行第一句：提供法院、案號、日期及公務員身分；刪除會失去識別與適用制度，保留。
4. 第27行「新聞稿載明可以上訴。」：提供審級／終局限制，保留。
5. 第27行末句：避免將行政撤銷讀成全面否定指控或復職證明，保留。它有具體法律範圍，非單純反駁修辭。

沒有「本文將說明」等可刪的前置介紹。第33行短句銜接已公開宣布懲處的事實，第43行短句提出可立即採取的保護，不以無資訊的填充句湊數。

## 三篇近期同語比較

三篇均已完整讀取，published / lastmod 均為2026-10-24：

- `src/content/columns-zh/704-taiwan-arc-first-application.md`：從入境後申請期限起筆，標題沿文件、窗口、規費、領卡排列，結尾連到後續異動。919 從已遭撤銷的行政處分及理由起筆，正文由案件推理到適用制度與報告證據，沒有複製申請流程架構。
- `src/content/columns-zh/705-taiwan-visa-residence-work-study-family.md`：以聘書／入學許可的入境問題提問，按工作、學習、家庭分流。919 的「審議還能改變結果嗎？」針對考績會能否實質評量，並未套用多身分類型導覽。
- `src/content/columns-zh/706-taiwan-arc-renewal-changes-reentry.md`：搬家期限起筆、按異動事件分類，末段列居留事件日期。919 同樣保留簡短信箱入口，但結尾明確回到通知、陳述紀錄及採信理由；沒有複製居留文的日期清單或一般性宣傳。

用語採「人資、勞資爭議、考績委員會、復審、個資、陳述及答辯、利益迴避」，無簡體、陸法概念或逐字翻譯語序。全文無粗體、虛構第一人稱、命令式檢查清單標題、結果保證。行47的三個標籤用於區分陳述／佐證／判斷，具有實際推理目的。

## 圖片與第5節自檢

實際開啟 `public/images/columns/919-case-trends-20261025.webp`：空會議室、圓桌、素面文件夾、三張座椅；alt與所見相符，caption為「虛構情境」。無可辨識人物、文字、商標或真實事件照片暗示。

- CLI 退出碼：0；FAIL 0。
- 非假設公式起筆；本篇是裁判結果型。
- 四個極短句，至少兩句；長短句穿插，未有連續冗長的條號堆疊。
- 段首未三次使用同詞，無「主張（條文）→但書」三連段。
- 有無引文的解釋段落；不以刪來源換句型。
- CLI 明示問句0：實際讀者問題已由「審議還能改變結果嗎？」及第33行的間接問句承擔，未為量化目的添問句。
- 對比句只是公務員／私人雇主與撤銷效果的必要界線，無三次以上修辭反駁。
- 最後實質段回到通知、陳述及證據，不是制式推銷。
- 法律強度、日期、案號、引用與圖像虛構標示完整。

命令：`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-case-trends-20261025/repo/src/content/columns-zh/919-taiwan-workplace-bullying-investigation-hearing-judgment.md --lang zh-hant`

```text
/Users/son7/tseng-case-trends-20261025/repo/src/content/columns-zh/919-taiwan-workplace-bullying-investigation-hearing-judgment.md [zh-hant] sentences=31 mean=34.8 cv=0.459 short=0.129 run3=0.0 opener_rep=0.091 cite_end=0.0 cite_para=0.182 contrast=0 caveat=0 q=0
  OK — no variety limit violated
```

## 來源與證據限制

本次直接開啟並對照：
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0060001&flno=22-2
- https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=N0060001
- https://www.osha.gov.tw/48110/48417/48419/206967/?cprint=pt
- https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=N0060085 （核對按規模分級背景；稿件未額外展開未引述門檻）

法院新聞稿本次重新開啟逾時；逐句對照的是本輪研究保存的實際官方工具回傳 `work/research/zh-hant-source-captures.json` 的 `zh-case-pass2`，第213–237行，包含理由、撤銷主文、2026-09-03及得上訴記載。未宣稱本審另行讀得完整判決卷證或後續上訴結果。此限制已在稿件第53行正確反映。

剩餘實質問題：無。下一步：同一SHA交獨立最終法律審查；如作者／法律審查改動此稿，僅複核受影響部分及最終SHA。
