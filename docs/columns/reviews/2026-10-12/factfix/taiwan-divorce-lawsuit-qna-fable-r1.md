# review-r1 — fact-taiwan-divorce-lawsuit-qna-2 (Claude Fable, final gate)

Reviewed 2026-10-12. Files read in full: issues.md, triage.md, verify.md, guard.txt, tests.patch, tests.txt, orig/draft for ko, ja, en, zh-hant. Every law.moj.gov.tw URL in verify.md was opened again with WebFetch; every page showed 法規整編資料截止日：民國 115 年 10 月 02 日.

## Verdict

PASS. One sentence in the Japanese file was corrected; the correction is supported by the statute, the other three languages were rightly left unchanged, scope is clean, factguard passes, and the test patch only re-anchors pinned text.

## Issue 1 — 戸籍法第48条: start of the 30-day period and the receipt-date condition (triage item 1)

URLs opened and the sentence checked on each:

- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0030006&flno=48 — 「戶籍登記之申請，應於事件發生或確定後三十日內為之。但出生登記至遲應於六十日內為之。前項戶籍登記之申請逾期者，戶政事務所仍應受理。戶政事務所查有不於法定期間申請者，應以書面催告應為申請之人。」 Matches verify.md verbatim.
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0030006&flno=48-2 — item 九「經法院裁判確定、調解或和解成立之身分登記」 under 「經催告仍不申請者，戶政事務所應逕行為之」. Matches.
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0030006&flno=34 — 「離婚登記，以雙方當事人為申請人。但經法院裁判離婚確定、調解或和解離婚成立或其他離婚已生效者，得以當事人之一方為申請人。」 Matches.
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010048&flno=30 — 第1項「…經當事人合意，並記載於調解筆錄時成立。但離婚及終止收養關係之調解，須經當事人本人表明合意，始得成立。」第2項「前項調解成立者，與確定裁判有同一之效力。」 Matches.
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010048&flno=45 — 第1項「…得為訴訟上和解。但離婚或終止收養關係之和解，須經當事人本人表明合意，始得成立。」第2項「前項和解成立者，於作成和解筆錄時，發生與確定判決同一之效力。」 Matches.
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010048&flno=32 — 第3項「調解程序，除本法另有規定者外，準用民事訴訟法第二編第二章調解程序之規定。」 Matches.
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010048&flno=51 — 「家事訴訟事件，除本法別有規定者外，準用民事訴訟法之規定。」 Matches.
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=421 — 第3項「調解成立者，應於十日內以筆錄正本，送達於當事人及參加調解之利害關係人。」 Matches.
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=379 — 第3項「和解筆錄，應於和解成立之日起十日內，以正本送達於當事人及參加和解之第三人。」 Matches.
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=398 — 「判決，於上訴期間屆滿時確定。但於上訴期間內有合法之上訴者，阻其確定。不得上訴之判決，於宣示時確定；不宣示者，於公告時確定。」 Matches.
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=440 — 「提起上訴，應於第一審判決送達後二十日之不變期間內為之。但宣示或公告後送達前之上訴，亦有效力。」 Matches.
- https://www.ris.gov.tw/documents/html/2/3/1/384.html — states no period and no start date; carries 「離婚登記經我國法院裁判確定、調解或和解成立者，經催告仍不申請者，依戶籍法第48條之2規定，戶政事務所應逕為登記。」 and, for court divorces, 「得以當事人之一方為申請人」. Matches verify.md.

Verdict 1a (thirty days from finality of the judgment or establishment of mediation / settlement): ORIGINAL-RIGHT in all four languages — agreed. 第48條第1項 keys the period to 事件發生或確定; for a judgment the registrable event is 確定, for mediation / settlement it is 成立 (家事事件法第30條, 第45條). The "一般に / 일반 / general / 一般" qualifier is justified by the sixty-day birth proviso.

Verdict 1b (receipt date versus finality / establishment): PARTLY for ja only; ko, en, zh-hant ORIGINAL-RIGHT — agreed. The live Japanese clause 「確定や成立より前だというだけなら」 added a condition the statute does not contain, and the condition is factually backwards for a 調停調書 or 和解筆錄, which is served within ten days after 成立 (民事訴訟法第421條第3項 via 家事事件法第32條第3項; 第379條第3項). For an appealable judgment receipt precedes finality (第398條第1項, 第440條); for a non-appealable one finality precedes receipt (第398條第2項). The clause also implicitly licensed counting from a later receipt date. Removing it is the minimal fix and is not an over-correction.

Per-language result:
- ja: draft L55 「判決書や調停調書を受け取った日を、一律に起算日にしてはいけません。」 now states the same rule as the other languages (receipt / service date is not the common start; the period runs from 確定 or 成立). Correct against 第48條第1項.
- ko: orig L47 「판결문이나 조서를 송달·수령한 날은 모든 사건에 공통되는 기산점이 아닙니다.」 unchanged, correct.
- en: orig L65 "The date on which a judgment or record is served or received is not the common triggering date in every case." unchanged, correct.
- zh-hant: orig L39 「判決書或筆錄之送達、收受日，並非全部事件共通之起算點。」 unchanged, correct.

Cross-language consistency: all four now say the same thing. The ja wording 「一律に起算日にしてはいけません」 and the ko/en/zh "not the common starting point" are equivalent in effect; none claims a receipt-based start in any case, which is what the statute supports.

Non-blocking observation (not a statute error, out of scope): ja names 「判決書や調停調書」 while zh-hant says 「判決書或筆錄」 and ko 「판결문이나 조서」, which also cover a 和解筆錄. This wording predates the fix and the surrounding sentence already names 調停・和解 as the start events, so no change is required here.

Issues.md items 2 (two "as of" dates) and 3 (dropped non-legal words) were not triaged as factual and are untouched. Correct handling.

## Scope

- ko: diff empty. lastmod 2026-10-06 unchanged (no edit, so no bump needed).
- en: diff empty. lastmod unchanged.
- zh-hant: diff empty. lastmod unchanged.
- ja: diff is exactly one line (L55), the corrected sentence. lastmod was already 2026-10-12 in the live file and stays. No front matter, FAQ, link, or source-list change. All ten source entries present in every language; no REMOVED-URL needed.

factguard, re-run by me: NOTE [ja] body characters changed: 22 (0.3%), other three unchanged, FACTGUARD: PASS.

## Language

ja draft L55 reads as natural です・ます prose; the sentence is shorter and clearer than the live one. No translationese. No edits needed.

## Tests

tests.patch touches only src/lib/__tests__/columns-ja-family-007.test.ts:
- swaps the pinned sentence in the Article 1050 / Article 48 phrase list for the corrected sentence; the adjacent assertions that lock the 30-day period, the 確定 / 成立 start, 第48条の2, late acceptance and online filing are unchanged;
- re-freezes frozenH2BodySha256, frozenVisibleJapaneseCount (4,921 → 4,901), frozenVisibleKanaCount (2,208 → 2,194), frozenSourceSha256;
- leaves frozenNormalizedSection4Sha256 and frozenSection5OnwardSha256 as they were, consistent with an edit confined to section 2.

Independent check: sha256 of draft-ja.md = 894cdb7e65890f9e18b61adf3fecbff1ca25fb29c23ab1ebc6cfc595a4bfdd1e (the patch's new frozenSourceSha256); sha256 of orig-ja.md = 940dba373db72fe58afeca2a57ea8bead215cf90912b9b9534ea2432f2ef7da3 (the old value). No .skip / .only / .todo in the patch or the test file. vitest-1.log: Test Files 84 passed (84), Tests 1108 passed (1108), run in /Users/son7/Projects/tseng-law-rewrite-1006-wfix. Tests verdict: OK.

## Blocking issues

None.

## Tiny edits by the reviewer

None.

VERDICT: PASS
