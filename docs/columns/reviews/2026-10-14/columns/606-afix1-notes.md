# C1 afix1 change log

Checked 2026-10-14. Resolved the remaining mandatory issue in `final-astra-r4.md`. That review lists no MONOTONY failure. Edited all four publication files and reconciled the supporting `facts.md`; no git command was run.

| Issue → change | Official source |
|---|---|
| R4 C1: ZH 「同一則勞保局說明」 was unlinked → linked those words beside the temporary-stoppage rule. Preserved both conditions: only a stoppage, with a possibility of resumption. Kept the separate Article 7 contribution citation. | https://www.bli.gov.tw/0007239.html — I(1); https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030005&flno=7 |
| Repeated legal claims in tables and closing paragraphs lacked nearby links → added claim-level links in KO/JA/EN/ZH for the pre-event wage window, contributions, documentary proof, combined advance cap and priority; also linked the average-wage distinction and KO's hypothetical priority illustration. Existing URLs and the complete source lists remain. | https://www.bli.gov.tw/0007239.html ; https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=2 ; https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=28 ; https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030005&flno=8 ; https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030005&flno=9 |
| KO 「개인 전용 계좌에 매월 넣는 금액은 퇴직급여가 아닙니다」 could read beyond this provision → 「개인 계좌의 월 납입액은 이 항목에 들지 않습니다」. The exclusion now expressly concerns Article 28's retirement-pay item, matching the other languages. | https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=28 |
| KO closing 「정문 안내문은 그 증명이 아닙니다」 had an unclear referent → 「폐업 증명은 별도로 필요합니다」; named the closing cap as a 대지급 cap. Compressed ZH's repeated hypothetical recap to accommodate citation markup within the length ceiling. The hypothetical label, demand, nonpayment, proof requirements and limits remain. JA/EN visible wording is unchanged. | https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030005&flno=8 ; https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=28 |
| R4 supporting-record issue: facts.md described included material as omitted and retained an unused branch assertion → removed that assertion, updated actual omissions, and recorded average-wage exclusions, contributions, the BLI look-back, foreign-worker scope, filing, joint applications, evidence alternatives, finality certificates and application/complaint copies. Preserved the verified statutory quotations. | https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030002&flno=2 ; https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=N0030002 ; https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030005&flno=2 ; https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030005&flno=10 ; https://www.bli.gov.tw/0007239.html ; https://www.bli.gov.tw/0015125.html |

Fresh source check: curl fetched all 15 distinct external URLs successfully (HTTP 200). Read all eight cited single articles: Labor Standards Act 2/28, Enforcement Rules 2, fund regulations 2/7/8/9/10. Checked the official Chinese conditions, alternatives, exclusions and limits; the English instrument names/texts; all three amendment dates; and both BLI page bodies/update dates. The research-file quotations match the retrieved Articles 2 and 28. No judgment is cited; `research/judgments/` contains no .txt files. Source HTML/text, manifest, before-copies and diffs: `/private/tmp/c1-afix1-official/`.

Executed for each language:

`python3 /Users/son7/tseng-col-1014-work/lint.py /Users/son7/tseng-col-1014-work/drafts/C1/<lang>.md <lang> taiwan-unpaid-wages-insolvent-employer-payment-fund`

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1014-work/drafts/C1/<lang>.md`

| Language | Lint | Length | Variety CV | Very short sentences | FAIL |
|---|---|---:|---:|---:|---:|
| ko | OK | 3,488 characters | 0.510 | 14 | 0 |
| ja | OK | 3,917 characters | 0.455 | 13 | 0 |
| en | OK | 1,557 words | 0.520 | 22 | 0 |
| zh-hant | OK | 2,698 characters | 0.562 | 12 | 0 |

All eight commands exited 0. KO/JA each retain a 98% register-ending WARN; no FAIL. Section 5 self-check: no stock hypothetical opening; compared C1–C6 openings and the preceding local 524/523/522 openings, headings and endings. C1 retains its own trigger/question/statutory/payroll opening and factual closing. First-two-paragraph deletion checks preserve their distinct trigger, scenario, coverage and demand information. Every version has at least two very short sentences and a citation-free fictional scene; no three repeated paragraph starts or three consecutive claim–citation–caveat paragraphs. Contrast count is zero. KO remains 합니다체, JA remains です・ます. No MONOTONY item remains.

Frontmatter, author `legal-ai-assistant`, existing URLs and Arabic-number sequences are preserved. No bold, phone/street address, private-party names, invented professional experience, lawyer-review or native-review claim was added. Image bytes are unchanged: SHA-256 `797ef5319e02226059265ccc46b9c4e1ad1b3ef13e72200653a1d1e24513b5d6`. This was a local draft repair; no publication was performed.
