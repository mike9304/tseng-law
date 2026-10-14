# C5 afix1 — 2026-10-14

Edited `drafts/C5/{ko,ja,en,zh-hant}.md` directly. Both major findings in `final-astra-r3.md` are resolved, together with its remaining English long-sentence observation. No unresolved major issue remains from that review.

## Issue → change → official source

- L1, ZH: “單靠其中一項，消費借貸還沒有證明完。” treated one document as necessarily insufficient. Replaced it with an assessment of what the actual contents show about delivery and the repayment agreement; clarified that the cited provisions prescribe no document count. Retained the fictional transfer, amount/date, next-month-end promise, absent IOU, existing-debt route and both burden-of-proof exceptions. No sufficiency guarantee was added. Sources: [Civil Code 474](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=474), [Code of Civil Procedure 277](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=277).
- L2, ZH: “不論受領時價格增減” incorrectly made receipt time the condition. Changed it to “不論借用人所受領貨幣的價格如何增減” and restored “折合通用貨幣計算”. Preserved contractual priority, all three currency branches, repayment-time legal tender, and repayment-time/place market price. Source: [Civil Code 480, item 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=480).
- Sentence variety, EN: r3 §5 recorded consecutive long currency, limitation and payment-order sentences, without declaring a MONOTONY FAIL. Shortened the limitation sentence and split the payment-order explanation. Both unexercised-claim conditions, 15/five years, each periodic claim, eligible property and the demand procedure remain. The currency paragraph retains all branches in two sentences. Sources: [125](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=125), [126](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=126), [508](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=508).
- Citation placement, all four: moved the default provision's link beside its first operative claim and connected each paragraph number to its rule. Fixed-date expiry, entitlement to demand performance, receipt plus nonperformance, and expiry of a demand period are unchanged. Source: [Civil Code 229](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=229).
- Wording/citations, KO/JA/ZH: KO FAQ “그 조가 이자를 만들지는 않습니다” became “이 조에 따른 이자 지급 의무가 생기지는 않습니다”. ZH's 5% paragraph now states the prerequisites directly; JA/ZH have a link beside the repeated statutory-rate claim. Interest payable + no agreed rate + no other statutory rate are preserved. Sources: [203](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=203), [474](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=474).

## Independent verification

Fetched with curl and read all 18 distinct cited official pages: Civil Code 125, 126, 203–207, 229, 233, 474, 477, 478, 480; Obligations Enforcement Act 10-1 and 36; Code of Civil Procedure 277 and 508; Civil Code amendment history. All returned HTTP 200. Checked complete provisions against the claims, including exceptions, conjunctions, rates, periods and promulgation/commencement. The fact sheet was not treated as authority. The judgments directory is empty; no judgment is cited.

Each language retains all 18 official URLs and a complete matching sources list. The required 2026-10-13 source date remains; this independent recheck occurred on 2026-10-14. Evidence: `/private/tmp/c5-afix1-evidence/` contains fetched HTML/text, URL manifest, original copies, diffs, final hashes and command outputs.

Ran both requested commands on every final file:

| Language | Lint | Body length | Variety FAILs | CV | Very short sentences |
|---|---|---:|---:|---:|---:|
| KO | OK, exit 0 | 3,064 characters | 0 | 0.475 | 6/75 |
| JA | OK, exit 0 | 3,277 characters | 0 | 0.485 | 8/75 |
| EN | OK, exit 0 | 1,514 words | 0 | 0.611 | 15/86 |
| ZH-HANT | OK, exit 0 | 2,587 characters | 0 | 0.608 | 10/79 |

KO/JA retain register-ending WARNs (95% 합니다 / 97% です・ます), not FAILs. Section 5 self-check: no stock hypothetical first-word formula; compared C1–C6 openings; at least two very short sentences each; zero adjacent long-sentence pairs; at most one long sentence per paragraph; no paragraph opener used over twice; no three claim–citation–caveat paragraphs; citation-free scenes/questions remain; no excess contrast templates; endings return to this loan; registers, legal conditions, numbers, citations and fictional labels are preserved.

First-two-paragraph deletion check: KO retains the transfer and the ownership/return definition; JA retains the cash/IOU scene and excess-only invalidity; EN retains the monthly-rate/six-month scene and cap calculation; ZH retains the transfer/LINE scene and burden with both exceptions. No generic preview requires deletion. Compared openings, headings and endings with the three latest local entries dated through 2026-10-13 (522–524 in each language); no shared stock ending was introduced.

The requested `~/agent-library/knowledge/editorial-voice.md` is absent. Read the full supplied editorial brief and `/Users/son7/Projects/tseng-law-columns-20261013/docs/columns/EDITORIAL-VOICE.md`, plus `COLUMN-VOICE-RULE.md`, the variety rule and lessons. This was an AI editorial/legal-source check, not lawyer or native-speaker review.

Author remains `legal-ai-assistant`; image reference and image SHA-256 are unchanged. No prohibited bold, phone, address or private-party name was introduced. No git command was run.
