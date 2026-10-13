# verify — fact-home-leak-defect-notice-repair-evidence-taiwan-1 (round 0)

Column: home-leak-defect-notice-repair-evidence-taiwan. In scope: zh-hant only.
Retrieval date for every URL below: 2026-10-12.

## Issue 1 — 民法第354條第1項的轉述（漏「滅失」、把「效用」寫成「用途」、把「預定」寫成「約定」）

Claim as the column states it (zh-hant, body, section 「賣方要負責，還要核對瑕疵存在的時點」):

> 「[民法第354條]第1項的瑕疵擔保，著重於危險移轉時，房屋是否已有減少價值、通常用途或契約約定用途的瑕疵；價值或效用減少的程度無關重要者，不得視為瑕疵。」

The same paraphrase does not appear in the front matter (summary) or anywhere else in the file. The later mention 「對於第354條第1項所稱的瑕疵」 and the source-list label 「瑕疵擔保、已知瑕疵、檢查通知與故意不告知的例外」 do not restate the definition.

Official source: 全國法規資料庫, 民法第354條 — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=354 (retrieved 2026-10-12 with WebFetch, fetched twice with different prompts; both returned the same text).

Statute text (current):

> 第 354 條
> 物之出賣人對於買受人，應擔保其物依第三百七十三條之規定危險移轉於買受人時無滅失或減少其價值之瑕疵，亦無滅失或減少其通常效用或契約預定效用之瑕疵。但減少之程度，無關重要者，不得視為瑕疵。
> 出賣人並應擔保其物於危險移轉時，具有其所保證之品質。

Checked against the page: 「滅失」 appears twice in paragraph 1 (滅失或減少其價值；滅失或減少其通常效用或契約預定效用); the article uses 「效用」 and never 「用途」; the phrase is 「契約預定效用」, not 「契約約定…」.

Source notes:
- The English page https://law.moj.gov.tw/ENG/LawClass/LawSingle.aspx?pcode=B0000001&flno=354 returned an empty body to WebFetch on 2026-10-12, so it was not used. The verdict rests on the Chinese official page only.
- The page's 生效狀態 note lists only the 第166-1條 施行日期 note and the 115年8月17日 amendment of 第1223條; neither concerns 第354條.

Verdict: PARTLY.

- Wrong: the description of the defect covered by 第354條第1項.
  - 「減少價值」 omits 「滅失」. The statute covers defects that 滅失或減少 the value or the utility.
  - 「通常用途」 → the statute says 「通常效用」.
  - 「契約約定用途」 → the statute says 「契約預定效用」. 「約定」 (agreed in the contract) is narrower than 「預定」 (contemplated by the contract), and 「用途」 is not the statute's term. The same sentence already uses 「效用」 in its second half (「價值或效用減少的程度」), so the first half was also inconsistent with the column's own wording.
- Right, left unchanged:
  - 「著重於危險移轉時」 — matches 「依第三百七十三條之規定危險移轉於買受人時」.
  - The proviso 「價值或效用減少的程度無關重要者，不得視為瑕疵」 — matches 「但減少之程度，無關重要者，不得視為瑕疵」. The triage question whether the proviso also needs to be stated: it is already in the column.
  - 「同條第2項另要求，房屋於危險移轉時，具有賣方所保證的品質」 — matches paragraph 2.

Correct statement: 第354條第1項 concerns whether, at the time the risk passes, the house has a defect that 滅失或減少其價值、通常效用或契約預定效用.

## Not in scope

- issues.md second bullet (house-format lint notes: no contact email in the body, final heading 「法規依據」) — not a factual item and not in triage.md (TRIAGE: FACTUAL 1). Left as is.

## Changes

zh-hant (draft-zh-hant.md):
- Body, section 「賣方要負責，還要核對瑕疵存在的時點」: 「房屋是否已有減少價值、通常用途或契約約定用途的瑕疵」 → 「房屋是否已有滅失或減少其價值、通常效用或契約預定效用的瑕疵」. The rest of the sentence, the link and the following sentences are unchanged.
- Front matter: lastmod "2026-10-04" → "2026-10-12". No other front-matter change (summary did not carry the error).
- No URL added or removed.

## Checks run

- `python3 factfix/factguard.py <jobdir> 2026-10-12` → `NOTE [zh-hant] body characters changed: 9 (0.3%)` / `FACTGUARD: PASS`.
- `variety_metrics.py check draft-zh-hant.md --lang zh-hant` → 2 FAIL (len_cv=0.334, short_share=0.0) + 1 WARN (stock hypothetical opener). The live text orig-zh-hant.md gives the same 2 FAIL + 1 WARN (len_cv=0.329, short_share=0.0), so they are pre-existing and not caused by this edit. Not fixed here: this job allows only the smallest edit that corrects the statute paraphrase, with wording and structure otherwise unchanged.
