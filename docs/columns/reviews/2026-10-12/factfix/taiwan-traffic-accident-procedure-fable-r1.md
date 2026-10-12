# review-r1 — fact-taiwan-traffic-accident-procedure-1 (Fable final review, round 1)

Reviewer: Claude Fable 5.1. Date: 2026-10-12. Every URL below was opened by me with WebFetch on 2026-10-12, independently of verify.md.

## Verdict

PASS. Both triaged issues are real, the corrections match the official titles on law.moj.gov.tw, no language was over-corrected, the diffs contain nothing beyond the label corrections and the ko lastmod, all source entries and URLs are kept, and tests.patch only re-anchors the ko lastmod.

## Issue 1 — name of the vehicle-accident appraisal / review regulation

URLs opened and what I checked:

- https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0040045 — 法規名稱「車輛行車事故鑑定及覆議作業辦法」, 修正日期 民國 108 年 12 月 31 日, 法規類別 行政 ＞ 交通部 ＞ 公路目, 20 articles (第一章 總則 1–2, 第二章 鑑定 3–10, 第三章 覆議 11–16, 第四章 附則 17–20). 第 1 條「本辦法依公路法第六十七條第二項規定訂定之。」
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040045&flno=3 — 「鑑定會受理行車事故鑑定案件以經警察機關處理，並經行車事故當事人或其繼承人或法定代理人、車輛所有人申請，或經現場處理機關移送、司法機關囑託為限。但下列案件不予受理鑑定：一、鑑定案件進入偵查或審判程序中，且非經司法機關囑託者。二、申請或警（憲）機關移送之案件距肇事日期逾六個月以上。…」 Matches the body statements (who may apply, referral / judicial commission, six months, pending investigation or trial needs judicial commission) in all four languages. Body statements were not changed.
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040045&flno=10 — 「…得於收受鑑定意見書之翌日起三十日內敘明理由向該轄區覆議會申請覆議，但以一次為限。其已進入司法程序者，應向該管司法機關聲請轉送該轄區覆議會覆議」. Matches the 30-day / reasons / once-only / judicial-route statements.
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040045&flno=11 — 第1項「…得向該轄區覆議會申請覆議，對於鑑定覆議不得再申請覆議。覆議案件其已進入司法程序者，應向該管司法機關聲請轉送覆議會覆議。」第2項「鐵公路混合性行車肇事案件鑑定事項，由交通部公路總局覆議會受理。」 Matches.
- https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=K0040045 — seven entries from 民國 92 年 8 月 5 日 (enactment) to 民國 108 年 12 月 31 日 (第 15 條 amended); no name change; 112 年 9 月 13 日 Executive Yuan notice moving 公路總局 powers in 第 2 條 and 第 11 條第 2 項 to 交通部公路局 from 112 年 9 月 15 日. verify.md's history summary is accurate.
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040001&flno=67 — 公路法第 67 條第 2 項「前項車輛行車事故鑑定及覆議作業辦法，由交通部會同內政部、法務部定之。」 Confirms the enabling statute is 公路法, not 道路交通管理處罰條例, and the instrument is a 辦法 issued jointly by 交通部・內政部・法務部.
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030133&flno=3 — 中央法規標準法第 3 條「各機關發布之命令，得依其性質，稱規程、規則、細則、辦法、綱要、標準或準則。」 「規則」 and 「辦法」 are distinct names, so calling this instrument 「…規則」 misnames it.
- https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=K0040045 — empty page; no official English title exists. Confirms verify.md.
- https://mojlaw.moj.gov.tw/LawContentExtent.aspx?LSID=FL025820&LawNo=3 — same regulation, same title and 修正日期, 第 3 條 text identical to law.moj.gov.tw. Link is right.
- https://mojlaw.moj.gov.tw/LawContent.aspx?TypeSort=2&lawNumber=10&lsid=FL025820&media=print — same regulation and title; the page shows only 第 10 條 (see non-blocking note below).

Verdicts per language (all agree with verify.md):

- ja — PARTLY, correct. Live text used two invented names for one instrument (「車両事故鑑定・覆議の手続規定」 in Q6 body, 「車両事故鑑定・覆議規則」 in the Q6–Q10 list), and 「規則」 names a different kind of order. Draft uses the official title 「車輛行車事故鑑定及覆議作業辦法」 in all four places, short form 「作業辦法第10条・第11条」 in the second body cite, which mirrors the zh-hant reference 「作業辦法第10、11條」. Article numbers, links and legal content unchanged. The column already cited 強制汽車責任保險法 by its original title in the body (pinned by columns-ja-traffic-003.test.ts line 1000), so original-title citation is this column's established style.
- ko — PARTLY, correct. Body already said "절차 규정"; only the two list labels said "규칙". Draft aligns the list with the body ("차량사고 감정·재심의 절차 규정 제3조 / 제10조부터 제15조"). No official Korean title exists; "절차 규정" is a descriptive rendering of 作業辦法 and does not collide with 規則. Minimal and supported.
- en — ORIGINAL-RIGHT, accepted. One consistent name in body and list; no official English title to contradict it. The Highway Act English text calls the instrument "regulations", but "rules" is a generic word for subordinate legislation and nothing official shows the label to be an error. Not a FIX item.
- zh-hant — ORIGINAL-RIGHT, confirmed. Official title in both body and list.

## Issue 2 — title of the compulsory automobile liability insurance statute

URLs opened and what I checked:

- https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=G0390060 — 法規名稱「強制汽車責任保險法」, 修正日期 民國 111 年 06 月 15 日, 法規類別 行政 ＞ 金融監督管理委員會 ＞ 保險目. 第 6 條第 1 項「應訂立本保險契約之汽車所有人應依本法規定訂立本保險契約。…」; 第 3 項 user / manager as 投保義務人 in the three listed cases; 第 28 條「受害人或其他請求權人有下列情事之一，致被保險汽車發生汽車交通事故者，保險人不負保險給付責任：一、故意行為所致。二、從事犯罪行為所致。」; 第 27 條第 2 項 delegates the benefit standard to the competent authority with the transport authority. Body statements in Q15 (owner has the duty, user or manager in specified cases, insurer not liable for intentional or criminal acts, Art. 28) match in all four languages and were not changed.
- https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=G0390060 — official English title "Compulsory Automobile Liability Insurance Act", Amended Date 2022-06-15.
- https://law.fsc.gov.tw/LawContent.aspx?id=FL006889 (column link) — 法規名稱「強制汽車責任保險法」, 修正日期 民國 111 年 06 月 15 日. Link is right.
- https://law.fsc.gov.tw/LawContent.aspx?id=FL006901&kw=1200 (column link) — 法規名稱「強制汽車責任保險給付標準」, 修正日期 民國 115 年 05 月 29 日; 第 1 條「本標準依強制汽車責任保險法（以下簡稱本法）第二十七條第二項規定訂定之。…」 Link is right; the 2026-05-29 amendment date in Q15 matches.

Verdicts per language (all agree with verify.md):

- ja — PARTLY, correct. Body already had 「強制汽車責任保險法第6条」; the list said 「強制自動車責任保険法」 and 「強制自動車責任保険給付基準」, neither the title of the linked instrument. Draft: 「強制汽車責任保險法」, 「強制汽車責任保險給付標準」. Correcting the second entry together with the first is right; leaving it would keep two names for one statute on adjacent lines. The common noun 給付基準 in Q15 body prose stays, correctly.
- ko — ORIGINAL-RIGHT, confirmed. One consistent Korean rendering; no official Korean title.
- en — ORIGINAL-RIGHT, confirmed against the official English title.
- zh-hant — ORIGINAL-RIGHT, confirmed.

## Scope (diff of every pair)

- ko: lastmod 2026-10-06 → 2026-10-12; two Q6–Q10 list labels. Nothing else.
- ja: two Q6 body link labels, two Q6–Q10 list labels, two Q11–Q15 list labels. lastmod already 2026-10-12 in the live text. Nothing else.
- en: identical to live. zh-hant: identical to live. Their lastmod correctly stays 2026-10-06.
- All URLs unchanged in every language; no source entry added or removed; no new facts.
- factguard re-run by me: `python3 -I factguard.py <jobdir> 2026-10-12` → NOTE ko 8 chars (0.1%), ja 36 chars (0.3%), en unchanged, zh-hant unchanged, FACTGUARD: PASS. guard.txt ends FACTGUARD: PASS.

## Language

- ja: 「関連規定（車輛行車事故鑑定及覆議作業辦法第3条）」 and 「（作業辦法第10条・第11条）」 read as a normal Japanese citation of a Taiwanese instrument by its original title, with the Japanese 条; the surrounding sentences keep です・ます. List labels are title-only, as the rest of the list.
- ko: "차량사고 감정·재심의 절차 규정 제3조 / 제10조부터 제15조" are natural label forms matching the body.
- No translationese introduced. Sentence-variety check: draft-ja no FAIL; draft-ko shows the same two FAILs (len_cv 0.422, short_share 0.044) with identical figures as orig-ko, so they are pre-existing in the published text and outside this job's scope (edits are link labels only).

## Tests

- tests.patch changes only two pinned ko lastmod values ('2026-10-06' → '2026-10-12') in columns-ko-traffic-003.test.ts and columns-publication-date.test.ts. No .skip / .only / .todo. No assertion loosened.
- Fact-locking assertions still lock: ko test pins '강제자동차책임보험법 제6조' (body, unchanged); ja test pins 強制汽車責任保險法…第6条…所有者…使用人…管理者 and the once-only 覆議 statement (body, unchanged); zh test pins 強制汽車責任保險法第6條 (unchanged). No test pins the corrected list labels, so none needed re-anchoring.
- vitest-1.log: Test Files 85 passed (85), Tests 1440 passed (1440). tests.txt: PASS, sync rounds 1.
- Tests verdict: PASS.

## Blocking issues

None.

## Non-blocking notes (outside triage; not changed, for a later job)

- Q6–Q10 list, second entry, all four languages (zh-hant reference included): label says Articles 10–15 (第10条から第15条 / 제10조부터 제15조 / Articles 10–15 / 第10條至第15條) but the mojlaw print page it links to shows only 第 10 條 (confirmed by my fetch). Consider linking the full text (law.moj.gov.tw LawAll K0040045) or relabelling to 第 10 條.
- Q6–Q10 list, third entry: en label "Directorate General of Highways"; the agency's powers moved to 交通部公路局 on 2023-09-15 (history page). ja/ko/zh-hant already say 公路局 / 도로국. Pre-existing, out of scope.
- The checkout at ~/Projects/tseng-law/src/content currently shows older label text for this column (e.g. "第11条から第15条", lawNumber=11) that differs from the orig-*.md staged from origin/main 278ff91e3. The drafts should be applied against the staged base, not that working tree, if it is behind.
- ja site precedent is mixed: 007 and 002 columns render 辦法 as 「規則」 with the original in parentheses. This column's draft uses original titles alone, consistent with its own body citation of 強制汽車責任保險法. Style only, not a fact issue.

## Tiny edits by the reviewer

None.

VERDICT: PASS
