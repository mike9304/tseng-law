# C5 afix2 — 2026-10-14

Edited `drafts/C5/{ko,ja,en,zh-hant}.md` directly. Addressed the latest Sol blocking finding and rechecked both earlier Astra major findings. No unresolved major or MONOTONY item remains from those reviews.

| Issue → change | Official source |
|---|---|
| JA: 「現金を渡した日付のメモと借用書」 introduced a separate receipt memo, contradicting the opening → the hypothetical now consistently has one signed IOU containing the cash-delivery date, amount and repayment date, with a blank interest field; explicitly no separate receipt memo. Removed the memo from the evidence and contact paragraphs. The cash loan and fictional label remain. | [Civil Code 474](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=474), [Civil Procedure 277](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=277) |
| JA proof wording and earlier ZH L1: document descriptions could become automatic proof or a mandatory two-document rule → all four versions now explain evaluation of the actual contents, with the court's assessment of the arguments and examined evidence, the special-provision exception, and logic/experience constraints. ZH's earlier categorical insufficiency sentence was already absent and remains absent. No delivery or repayment finding is guaranteed. | [Civil Procedure 222(1), (3)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=222) |
| Earlier ZH L2: price movement incorrectly tied to the moment of receipt → verified and retained the existing correction, 「借用人所受領貨幣的價格如何增減」. Contractual priority and all three currency branches remain. | [Civil Code 480](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=480) |
| Unqualified statements that principal and within-cap interest “remain” → all four bodies and FAQs now say Article 205 does not invalidate them on this ground. EN explicitly labels 2% × 12 as annualization without compounding. | [Civil Code 205](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=205) |
| EN added a general “not yet fallen due” description beyond Article 204's text → removed that extension; retained above 12%, one year, one month's notice and the prohibition on contractual restriction, alongside the hypothetical's six-month maturity. | [Civil Code 204](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=204) |
| FAQ legal answers lacked inline links → linked their claims directly, preserved the conditions for 5%, the distinction between promulgation and commencement, older-agreement transition, the reasonable period of at least one month and the default starting point. Added Article 222 to every final source list and recorded the October 14 recheck. | [203](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=203), [history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0000001), [36](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000003&flno=36), [10-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000003&flno=10-1), [478](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=478), [229](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=229) |

Independently fetched all 19 cited official pages with curl: 18 single-article pages and the Civil Code history, all HTTP 200. Read the complete provisions and checked rates, dates, AND/OR conditions and exceptions against all four versions. Every inline official URL is in its version's source list. `research/judgments/` is empty; no judgment is cited. Evidence, before/final copies and non-Git diffs: `/private/tmp/c5-afix2-evidence/`.

Final checks, each exit 0:

| Language | lint.py | Body length | Variety FAILs | Very short sentences |
|---|---|---:|---:|---:|
| ko | OK | 3,157 characters | 0 | 7 |
| ja | OK | 3,324 characters | 0 | 10 |
| en | OK | 1,487 words | 0 | 16 |
| zh-hant | OK | 2,634 characters | 0 | 10 |

Ran the requested absolute-path `lint.py <file> <lang> taiwan-private-loan-interest-cap-iou-repayment` and `variety_metrics.py check <file>` commands on every final file. KO/JA retain register-ending WARNs only, without register mixing.

Section 5 self-check: no stock hypothetical opener; C5 remains the scene opening among C1–C6. First-two-paragraph deletion review retained the scenario facts and distinct legal conditions. Compared local recent columns' openings and headings. At least two very short sentences in each version; no adjacent long-sentence pair, including the EN passage noted in the earlier review; no paragraph opener occurs more than twice. No three consecutive claim–citation–caveat paragraphs, excess contrast pattern or invented rebuttal. Citation-free scenes/questions remain. Closings stay tied to the repayment terms. All hypothetical labels, legal conditions, author values and image references remain.

The canonical `~/agent-library/knowledge/editorial-voice.md` is absent; read the supplied complete `brief-EDITORIAL-VOICE.md`, the repository's `docs/columns/EDITORIAL-VOICE.md`, COLUMN-VOICE-RULE, SENTENCE-VARIETY-RULE and LESSONS instead. No lawyer/native-review claim was added. Image SHA-256 is unchanged. No Git command was run.
