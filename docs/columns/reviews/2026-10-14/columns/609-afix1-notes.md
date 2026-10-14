# C4 afix1 — changes and verification

2026-10-14. Revised `drafts/C4/ko.md`, `ja.md`, `en.md`, and `zh-hant.md` directly. Addressed every major issue and both MONOTONY findings in `final-astra-r4.md`. No git commands. Image bytes unchanged.

## Issue → change → source

- C1, EN missing adjacent citation → the application paragraph now links its moral-obligation and knowing-payment tests to Article 180, items 1 and 3. Payment to discharge a debt, knowledge at payment, all four exclusions, and the recipient-only exception remain. → https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=180
- V1, “The reply was one line” / “回覆只有一句” and equivalents → integrated the one-line detail into each expressly fictional scene; removed the immediately repeated sentence. The reply still concerns living expenses. This is hypothetical content, not a sourced event.
- V1, “兩個條件要同時有。兩個都要有。” and parallel exemption/date repetition → stated the two cumulative exemption conditions once in the substantive explanation. Preserved release from both return and value repayment. Kept the reply's arrival date with its evidentiary limitation in one passage. Both knowledge branches, interest and conditional damages remain. → https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=182
- V2, KO “알 수 없는 사실의 문제이고”, JA “決まらない事実の問題”, EN overlapping further-gain clauses, and parallel ZH prose → separated what the confirmation cannot establish from the rule requiring return of anything further obtained from the benefit. Preserved value repayment when the benefit's nature or other circumstances prevent return; did not narrow further gains to bank interest. Removed the advance summary immediately before this explanation. → https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=181
- V2, ZH “拿第179條來對這句話” → explained directly that a relative's withdrawal does not, on that reply alone, establish the relative as the beneficiary or transfer the repayment duty. All versions retain the account-name/withdrawer distinction and leave disputed facts unresolved. → https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=179
- MONOTONY, duplicated short assertions and three consecutive proposition–statute–limitation paragraphs → gave the identity analysis, documentary comparison, and knowledge analysis separate functions; removed the premature Article 182 recap from the identity section. Reworked transitions separately in each language; ZH introduces bank inquiry earlier, while JA develops the spending question across the return and knowledge sections. → https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=179 and https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=182
- Citation coverage → added local official links to FAQ answers; retained all four authorities in each final source list. No judgment is cited; `research/judgments/` contains no `.txt` source.
- I1, internal fact-sheet cautions → verified independently and did not adopt the stale formulations. Identifying who received the original benefit is distinct from determining what later remains (Article 179 / 182); Article 181 defines return of the benefit, further acquisitions and substitute value, not a general reduction rule. This reconciliation is recorded here; the input `facts.md` was not edited. → https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=179 and https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=181

## Checks

Fresh curl retrievals of Articles 179–183 and the Civil Code history all returned HTTP 200. Compared the operative Chinese text, including AND/OR, exclusions and the two knowledge branches. No rate, deadline or amount was invented. The history's pending-effect notices concern Articles 166-1 and 1223, not the four cited provisions: https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0000001

| File | Required lint | Body length | Variety FAILs | Length CV |
|---|---|---:|---:|---:|
| ko.md | OK | 2,551 characters | 0 | 0.467 |
| ja.md | OK | 3,065 characters | 0 | 0.469 |
| en.md | OK | 1,168 words | 0 | 0.476 |
| zh-hant.md | OK | 2,101 characters | 0 | 0.476 |

Ran both requested commands on each final file; all eight exited 0. Also checked YAML, three FAQs, `legal-ai-assistant`, source-list coverage, correct pcode/article URLs, and the image hash. KO/JA retain register WARNs. KO also triggers the checker's broad hypothetical-label WARN because “가상의 사례입니다” appears early; the actual opening is a concrete scene, not the prohibited stock formula.

Section-5 manual check: all versions have more than two useful short sentences, no consecutive long sentences, no paragraph opener used three times, citation-free factual paragraphs, no three consecutive claim–statute–caveat paragraphs, and at most one counted contrast template. Hypotheticals remain labelled. Endings return to the transfer's specific missing facts. KO/JA registers and all statutory conditions are preserved. Compared openings with C1–C6 and openings/headings/endings with preceding columns 522–524 in each language. First-two-paragraph deletion check removed duplicate scene detail; the remaining sentences supply the transaction, legal conditions or hypothetical status.

The missing global `~/agent-library/knowledge/editorial-voice.md` was replaced for reading by the full supplied voice brief, shared `rules/EDITORIAL-VOICE.md`, and repository `docs/columns/EDITORIAL-VOICE.md`. No lawyer or native-speaker review claim was added.

Retrievals, original snapshots, final hashes and exact command outputs: `/private/tmp/tseng-C4-afix1-20261014-_vqlcalc/` (`checks.json`).
