# C4 afix1 — final-astra-r3 fixes

2026-10-14. Direct edits: ko.md, ja.md, en.md, zh-hant.md; reconciled facts.md. No git commands. Image and featured-image paths unchanged. AI review only; no lawyer or native-speaker review claimed.

Fresh curl verification: all 23 cited law.moj.gov.tw single-article pages, two Chinese full-law pages, two official English pages, and the Executive Yuan page/PDF returned HTTP 200. Read the article texts and relevant PDF provisions; visually checked PDF pages 4 and 6. Local evidence: `/private/tmp/c4-afix1-evidence/` (sources.json, extracted texts, final-checks.json). No judgment is cited; research/judgments contains no .txt files.

## Issue → change → official source

- L1, EN summary lacked contractual permission → now expressly begins “If your Taiwan lease permits early exit at will”; preserves at least one month's notice and caps only the penalty for ending without that notice. Summary: 156 characters. Source: [point 14](https://www.ey.gov.tw/File/43BC094940995CFC?A=C).
- L2, “Rent already collected” included earned rent → “The landlord must return prepaid rent if the lease ends early under paragraph 1.” Deposit set-off and shortfall retained; Article 454 remains limited to Articles 452/453 and rent falling due after termination. Sources: [point 14](https://www.ey.gov.tw/File/43BC094940995CFC?A=C), [Civil Code 454](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=454).
- L3, failed-delivery date sounded conclusive → “presumed to be the arrival date if an unreported address change prevents delivery.” All causal conditions retained. Source: [point 20](https://www.ey.gov.tw/File/43BC094940995CFC?A=C).
- C1, missing immediate citations → added Article 11 at heirs/30-day/evidence and repair-termination statements in every language, Article 8 at its repeated repair remedy, and point 14 beside every “不得” explanation. Added links to repeated Article 450 rules, employment-ground exclusions and replacement-tenant explanations. Sources: [Article 11](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060125&flno=11), [Article 8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060125&flno=8), [official terms](https://www.ey.gov.tw/Page/DFB720D019CCCB0A/478917df-7599-418f-8715-fd2716b623b4).
- Overbroad breach wording → all four “不得” paragraphs now exclude statutory termination grounds and an agreed exit before describing breach. No invented penalty amount; court reduction remains discretionary. Sources: [point 14](https://www.ey.gov.tw/File/43BC094940995CFC?A=C), [Civil Code 250](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=250), [252](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=252).

## Native wording: original → reason → replacement; meaning preserved

- KO: “앞 문단에서” → ambiguous reference → “임의 종료를 허용한 계약에서는”; “수리 다툼 전부가 빠지지는” → unclear exemption → “모든 수리 분쟁에서 사전 통지가 면제되지는”; “열쇠는 점교 기록에” → unexplained transliteration/incorrect object → record the fact of returning keys in the handover record. Permission, urgent safety/health limits and non-mandatory recordkeeping preserved. Sources: [points 14/18](https://www.ey.gov.tw/File/43BC094940995CFC?A=C), [Article 12](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060125&flno=12).
- JA: “この点は同じ額を請求しません” → provision portrayed as claimant → “第14点はこの違約金を定めていません”; “書面と証拠が付きます” → missing required action → written notice to the landlord with evidence 30 days before termination; deposit-article heading → “催告しても直らず、住めない部屋”, retaining the existing article link. Notice period, evidence and limited penalty statement preserved. Sources: [point 14](https://www.ey.gov.tw/File/43BC094940995CFC?A=C), [Article 11](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060125&flno=11).
- EN: “runs the same way” → imprecise → “provides a similar right”; “end the months” → wrong object → “does not by itself end the lease”; “keeps the wording posted” → unnatural → “The retained copy records the letter's contents.” Legal scope and evidence limitation preserved. Sources: [Civil Code 424](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=424), [point 14](https://www.ey.gov.tw/File/43BC094940995CFC?A=C), [Postal Regulations 34](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0050021&flno=34).
- ZH: “通知還在” → unclear obligation → “仍須遵守…通知規定”; exception fragments → complete sentence retaining agreement OR custom OR tenant-caused damage; “副本本身不算數” → misleading denial of evidence → copy records contents but alone does not establish arrival/termination requirements. Sources: [points 9/20](https://www.ey.gov.tw/File/43BC094940995CFC?A=C), [Civil Code 95](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=95), [Postal Regulations 34](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0050021&flno=34).

Removed redundant one-year application sentences; replaced foreign-law non-statements with a local-professional recommendation, without foreign-law assertions. Updated facts.md to remove the stale shorter-notice invalidity assertion, explain covered-lease written subletting consent, and record the verified postal definition and arrival rule. Source lists now link amendment-date pages and official English titles, and retain the original 2026-10-13 date plus the 2026-10-14 recheck.

## Verification

| Language | Lint | Length | Variety FAIL | CV |
|---|---|---:|---:|---:|
| ko | OK | 3,497 characters | 0 | 0.458 |
| ja | OK | 4,426 characters | 0 | 0.495 |
| en | OK | 1,581 words | 0 | 0.479 |
| zh-hant | OK | 2,699 characters | 0 | 0.467 |

Ran the requested lint and variety commands on each final file. KO/JA register warnings remain, without FAIL; required 합니다체/です・ます preserved. No mandatory MONOTONY finding existed in r3; all listed wording findings were corrected. Intermediate length/variety failures were resolved.

Section 5 manual check: quotation openings (KO/EN/ZH) and reader-question opening (JA) remain distinct within the current same-language batch. Compared with the three latest dated files in the available site-content snapshot, without claiming live-publication verification. Opening deletion test retained the permission/statutory-exit quotation and expiry rule; removed redundant applications. Each language has at least two genuinely short sentences and a citation-free hypothetical. No word starts three paragraphs, no three consecutive claim–citation–caveat paragraphs, and contrast templates stay within limits. Closings return to the column's notice/handover facts. Body questions are concentrated in the FAQs except JA's opening question. All body official URLs appear in the sources list; no new unverified URLs. Conditions, numbers, quotations, hypothetical labels and legal-ai-assistant author metadata retained.

Image SHA-256 remains `cee6a9e6a0c2d8bb0840f2413c7be503ad65dd829e7167771f7c023ac6627ff6`.

FIX DONE
