# C7 final review — round 1 — 2026-10-16

Verdict: FIX. One unresolved MAJOR finding concerns the treatment of a late-served notice and its printed appearance date. Image: OK. All four edited files pass lint and the variety checker. This is a review of local publication candidates, not a publication or deployment record.

## Scope checked and independence

I did not write these drafts. I read every requested file in full: `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C7.md`, the four `drafts/C7/*.md` articles, `drafts/C7/facts.md`, and `research/C7-statutes.md`. I also read `SENTENCE-VARIETY-RULE.md`, `LESSONS.md`, `topics/LINKS.md`, and `reviews/C7/voice-sol.md`; inspected `images/C7.webp` with the image-viewing tool; and read its generation brief in `prompts/images.txt`.

This is Astra round 1: no earlier Astra findings or fixer resolution table existed for C7. The preceding Sol review was read as a record, not accepted as proof. Its article links, mandatory/permissive wording, penalty terminology, authority ranges, hypothetical labels and factual core were rechecked in the actual files. The canonical path referenced by `COLUMN-VOICE-RULE.md`, `/Users/son7/agent-library/knowledge/editorial-voice.md`, was absent; the supplied full `brief-EDITORIAL-VOICE.md` was available and read.

I fetched, opened and compared the official Chinese single-article pages for [Article 7-2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040012&flno=7-2), [Article 8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040012&flno=8), [Article 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040012&flno=9), [Article 85](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040012&flno=85) and [Article 92](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040012&flno=92), plus the [full Chinese text](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0040012), [legislative history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=K0040012), and [official English title](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=K0040012). Every cited article's research-file text matches the live Chinese text after whitespace normalization. All pages were retrieved with curl on 2026-10-16 and saved in the evidence directory. No judgment or foreign-law proposition is cited by these columns, so no judgment text or foreign-law source required review.

The law's whole-law amendment date is 2026-08-17, as stated only in the sources sections. The database warns that some amendments have not commenced; the listed uncommenced provisions are not Articles 7-2, 8, 9, 85 or the Article 92 provisions used here. History confirms the relevant earlier commencements. The English database is dated 2025-05-28 and is used only for the Act's English name, as the article expressly says; it was not treated as the current Chinese legal text.

## Unresolved MAJOR finding

### M1 — Late service: the printed appearance date is presented without the relevant qualification

Status: REQUIRED, not applied. Primary location: `en.md:24`; connected deadline/consequence passages: `en.md:15–17,32–34,48,57–59`; the parallel summary/FAQ, deadline comparison and lateness passages in ko, ja and zh-hant need the same qualification when repaired.

Original → “The appearance date (應到案日期) on a Taiwan traffic notice can arrive before or after the end of the 30 days counted from receipt.” The next sentence commands identification of the other person “before the appearance date.” The FAQ and table then say that failure to follow the process by that date leaves the penalty applicable. Comparable consequences are “통지서를 받은 사람이 기한까지 규정대로 하지 않으면 해당 위반 조항에 따라 처벌됩니다”, “期限までに規定どおりに行わなかった人は、違反した条項に従って処罰されます”, and “若受處罰人逾期未依規定辦理，仍依本條例各該違反條款處罰”.

Problem & reason → Articles 85(1) and 9(1) support distinct requirements, but do not establish the English opening's account of how an operative appearance deadline can precede the receipt-based period. In particular, that account brings late service into scope while omitting the actual rule for it. The official handling rules expressly address a notice received with fewer than 30 days remaining, or after its stated date. A reader cannot safely infer from the printed date alone that the available time has expired. The other three versions correctly reproduce the basic Article 85 wording, but their unconditional date/consequence restatements should not preserve the same gap when the English explanation is corrected.

Official source passage → [違反道路交通管理事件統一裁罰基準及處理細則 Article 15(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080029&flno=15):

> 前項通知單應載明受通知人收受通知單時應到案日期不足三十日或已逾應到案日期者，得於送達生效日後三十日內到案。

The same article's paragraph 1 sets a 45-day interval from citation for the listed no-stop cases, illustrating why the printed date is not itself a 30-day-from-receipt calculation. [Handling rules Article 36(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080029&flno=36) separately retains the attribution requirement “應於通知單記載之應到案日期前” with the evidence and identifying documents. Both provisions were fetched with curl and read; the [rules' history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=D0080029) shows the current whole-regulation amendment date as 2026-05-26. Evidence: `rules-15.txt`, `rules-36.txt`, `rules-history.txt` and their saved HTML.

This finding does not assert that Article 15(2), by itself, automatically extends every Article 85 attribution filing. Its express subject is attendance after effective service. That interaction must be handled accurately instead of either inventing an automatic extension or treating an earlier printed date as invariably controlling. This is a substantive source/qualification gap, not a demand to add unrelated traffic penalties or an exhaustive service-law survey.

Fix required → In one bounded repair:

1. Remove the unsupported, unqualified “before or after” opening. Lead with the two distinct statutory requirements already supported by Articles 85(1) and 9(1).
2. Add Articles 15 and 36 of pcode D0080029 to `research/C7-statutes.md` using the supplied fetch tool, and update `facts.md`. Add one short, directly linked late-service paragraph in each language, including both conditions, the permissive force and the effective-service trigger of Article 15(2). A precise source-bounded formulation is: “If the notice arrives with fewer than 30 days remaining before its stated appearance date, or after that date, Article 15(2) allows attendance within 30 days after service takes effect. In that situation, have the service record and the deadline applicable to the Article 85 submission checked promptly with the penalty authority; do not assume from the printed date alone that it is already too late.” Do not turn this into a general 30-day attribution deadline.
3. Qualify the deadline/consequence entries in the FAQ and table by pointing to that late-service paragraph; ensure the summaries do not state an exception-free printed-date forfeiture. Keep the English summary within 150–160 characters by generalizing it if necessary. In the lawyer closing, make the service-record/deadline review concrete for a late-arriving notice. There is no need to add a fine schedule, judicial appeal, criminal law or a new hypothetical date.
4. Add the new official sources to each sources list with the check date, then rerun lint and variety. If the fixer instead wants to state a specific automatic extension of the attribution deadline, obtain a directly supporting official interpretation before doing so.

Facts preserved → Attribution remains conditional on the cited person's position that an identifiable other person was responsible; both evidence and that person's supporting documents go to the penalty authority; Article 85's statutory wording and late-noncompliance consequence remain, with the operative-deadline qualification; Article 9's factual objection remains a distinct receipt-based 30-day requirement. No promise of acceptance or cancellation is added.

Why not directly repaired → The supplied research file contains only K0040012. Incorporating D0080029 and explaining the service/attribution interaction changes the legal analysis. The user's final-review instructions reserve that substantive repair for the fixer. The source evidence and exact limited correction above are supplied so the repair need not become a fresh topic expansion.

## Direct repairs applied

All changes below are applied. Full original/replacement pairs and counts are in `applied-edits.json`; original article snapshots and four unified diffs are retained. No original URL, number or hypothetical label was removed. Three existing Article 85 links were repeated at the precise recipient claims; no new legal source was inserted into a column by this reviewer.

1. KO, `ko.md:32`: “증거와 그 사람에 관한 서류가 함께 갑니다.” → note-like phrasing → “두 종류의 자료가 모두 필요합니다.” → the AND requirement for evidence and the responsible person's documents is preserved.
2. KO, `ko.md:40`: “실제 운전자를 알리는 서면을 받는 곳은 처벌기관입니다.” → the paragraph linked Articles 8 and 7-2, but this filing-recipient rule comes from Article 85 → inserted the existing Article 85(1) link immediately before this sentence → recipient and duty unchanged.
3. KO, `ko.md:52`: “두 서면을 각각의 기한에 맞춰 준비하게 됩니다.” → may suggest a statutory requirement for exactly two separate documents → “각 절차의 요건과 기한에 맞춰 자료를 준비해야 합니다.” → both statutory requirements and their distinct time bases remain; no claim that a combined submission is necessarily accepted.
4. KO, `ko.md:69`: “제출하는 일도 맡길 만한 일입니다.” → awkward evaluative ending → “제출하는 일도 맡길 수 있습니다.” → the same authorized lawyer task and no promised outcome.
5. JA, `ja.md:24`: “車を貸した日の違反通知書が、運転した人ではなく所有者に届くことがあります。” → a generic declarative opening repeated the setup; the batch already has several rule-first openings → “運転したのは別の人なのに、なぜ車の所有者に通知書が届くのでしょうか。” → the owner/driver question and subsequent legal explanation remain.
6. JA, `ja.md:24`: “列挙された行為を止めずに取り締まる” → literally suggests not stopping the conduct, instead of the vehicle → “列挙された違反行為について、車を止めずに取り締まる” → the listed-conduct limitation and no-stop procedure remain.
7. JA, `ja.md:28`: “赤信号を無視したとして止められずに取り締まられた、という通知書” → difficult nested passive wording → a red-light notice sentence followed by “現場で車を止めての取締りはありませんでした。” → the hypothetical red-light allegation, no roadside stop, addressee and “架空の例です” remain.
8. JA, `ja.md:42`: “運転者を知らせる書面の宛先は処罰機関です。” → its immediate paragraph lacked the Article 85 basis for that recipient → “第85条第1項による運転者の届出先は処罰機関です”, with the existing official link → addressee unchanged.
9. JA, `ja.md:50`: “処罰機関が本人抜きで裁決することができます。” → overly casual wording → “処罰機関は本人の出頭を待たずに裁決することができます。” → the preceding conjunctive conditions and discretionary できます remain.
10. JA, `ja.md:54`: “二つの書面をそれぞれの期限に合わせて用意することになります。” → same document-count implication as item 3 → “それぞれの手続の要件と期限に合わせて資料を用意する必要があります。” → both requirements and deadlines preserved, without an invented document-count rule.
11. EN, `en.md:17`: “If you believe the violation belongs to someone else” → unnatural ownership metaphor → “If you believe the violation should be attributed to someone else” → the belief/attribution condition is unchanged.
12. EN, `en.md:34`: “after receiving the attribution” → an abstract noun stands in for the actual information received → “after receiving this information” → the authority's immediate, mandatory separate notification remains.
13. EN, `en.md:61`: “requires a separate notice to the penalty authority” → avoid making the word separate look like an additional statutory filing-form requirement → “requires her to identify him to the penalty authority” → the named person, recipient, both attachments, deadline and mandatory force remain. The lawyer may still prepare a separate factual-objection statement as a practical task.
14. ZH-HANT, multiple hypothetical references: “阿凱” → unnecessary personal name in a no-private-party-names review → “車主” throughout → the example is still expressly fictional; the same Taipei owner, classmate, loan and notice remain. This is not a finding that the original nickname identified a real person.
15. ZH-HANT, `zh-hant.md:36`: “訊息是否足以說明那次借車，仍要看內容；不能把它當成自動成立的證據。” → the second half is unnatural and repeats the first half's uncertainty → retained “訊息是否足以說明那次借車，仍要看內容。” → no evidentiary sufficiency or acceptance is promised.
16. ZH-HANT, `zh-hant.md:42`: “告知應歸責人應送交該條分配的處罰機關” → the addressee rule needs Article 85 in addition to Article 8's allocation → added the existing Article 85(1) link and identified Article 8 as the allocation provision → the same recipient and enumerated ranges remain.
17. ZH-HANT, `zh-hant.md:54`: “兩份文件就要各自趕在自己的期限內” → same unsupported emphasis on document count → “就要分別符合兩項程序的要件與期限” → the two substantive requirements and their periods remain.
18. ZH-HANT, `zh-hant.md:67`: “一串跟同學借車的訊息” → can reverse the direction of the loan, making the owner the borrower → “一串把車借給同學的對話紀錄” → restored the direction already explicit in the hypothetical: the owner lent the car to the classmate.

## Per-language checks, in the requested order

| Language | Law and facts | Citations | Hard rules | Voice | Image |
|---|---|---|---|---|---|
| ko | Articles 7-2(1)(1),(7), 7-2(5), 8(1), 85(1),(3), 9(1), 92(4) checked; basic core correct. M1 qualification remains for the common deadline explanation. | Paragraph/source fit checked; Article 85 recipient citation added; sources complete for present article content. | Metadata, exact firm/email/address, no bold/phone/byline/review claim, hypothetical label and one existing Korean internal link checked. | 합니다체; bounded wording repairs applied; variety passes. | OK |
| ja | Same core and modal forces checked. M1 qualification remains for the common deadline explanation. | Same; Article 85 recipient citation added. | Exact Japanese address, firm/email, metadata and Japanese internal target checked; no prohibited claims. | です・ます; no mixed narrative register; no-stop wording clarified; variety passes. | OK |
| en | Same core checked. M1 is most explicit in the opening and remains blocking. | Correct article URLs; English translation used only for the name; other rule paragraphs and sources checked. | Title 81 characters; seoTitle 44; summary 158; exact full English address and “English-speaking lawyer in Taipei”; author and date keys correct. | Plain active prose after small repairs; variety passes. | OK |
| zh-hant | Same core checked; loan direction clarified against the existing hypothetical. M1 qualification remains for the common deadline explanation. | Article 85 recipient citation added; all current sources listed. | Taiwan Traditional Chinese; exact 臺北 address; no private-party name after edit; fictional label retained. | Taiwan usage; no simplified characters/mainland vocabulary; variety passes. | OK |

The common legal checks specifically preserved: cannot OR inappropriate to stop; listed no-stop grounds as examples, not a complete list; owner OR designated main driver; the rental-business application and at-least-one-year proviso; both attachments for attribution; mandatory authority notification; negligence as a presumption rather than driver identity; payment as an option; objection as a duty when the cited facts are disputed; and nonattendance AND neither timely payment nor a timely statement for discretionary direct adjudication. The missing late-service qualification is not hidden by these otherwise correct transcriptions.

No fine amounts, exchange rates, arithmetic examples, actual case histories, foreign-law analysis or judgment holdings appear. Article 8's references to article ranges are quotations of jurisdiction allocation, not unsourced descriptions of each driving offence. The rental proviso states who receives a notice, not rental-contract law. Collision response is one separate-regime link sentence in each language. No appeal, insurance, points, licence-suspension or criminal-law analysis was introduced.

Each sources section has the check date 2026-10-16 in its locale's format. Every LawSingle URL presently cited is in the C7 research file. The one internal slug, `taiwan-traffic-accident-procedure`, exists in the corresponding locale in `/Users/son7/Projects/tseng-law-columns-20261016/src/content/columns{,-ja,-en,-zh}`; lint checked this filesystem existence. This is not a claim of live public URL testing. Contact strings were checked against batch rule 5 exactly, including “103, Taiwan” in English.

## Sentence variety and opening/closing review

Both before and after edits, all four checker runs exited 0 with no FAIL line. KO and JA have register-ending WARNs, not mixed-register FAILs. The manual checks do not identify two unmet items. Therefore there is no unresolved MONOTONY finding.

| Language | Body length | CV | Very short sentences | Three-sentence length runs | Repeated paragraph opener maximum | Checker contrast count | Result |
|---|---:|---:|---:|---:|---:|---:|---|
| ko | 2815 characters | 0.495 | 7/56, 12.5% | 0.019 | 2 | 0 | lint OK; variety FAIL 0 |
| ja | 3109 characters | 0.486 | 7/56, 12.5% | 0.019 | 2 | 2 | lint OK; variety FAIL 0 |
| en | 1247 words | 0.524 | 8/53, 15.1% | 0.020 | 2 | 0 | lint OK; variety FAIL 0 |
| zh-hant | 2293 characters | 0.539 | 5/45, 11.1% | 0.023 | 2 | 0 | lint OK; variety FAIL 0 |

Manual sections 5–6 check: no stock hypothetical first sentence; at least two very short sentences in each language; no paragraph opener repeated three times; no run of three claim–citation–caveat paragraphs; an uncited labelled hypothetical paragraph exists in every version; necessary contrasts concern actual owner/driver and procedure distinctions, with no fabricated reader belief being rebutted; closing contact paragraphs end with the notice's appearance date or the identity of its driver, rather than a generic disclaimer or sales promise. The mandatory contact block was retained. The Japanese checker reports zero questions because its question sentences use Japanese full stops; “なぜ…でしょうか” and “知らせる先はどこでしょうか” are reader questions on manual reading.

I compared C1–C8 openings available in this batch. C7 uses a concrete recipient question in ko/ja, a deadline distinction in en, and the owner/driver consequence in zh-hant. Its fictional scene is not the lead, and it does not copy the stock scene lead used elsewhere. These are observations about the available batch snapshots, not certification of the other columns.

First-two-paragraph deletion test, sentence by sentence: KO paragraph 1 supplies the no-stop trigger, examples, recipient and rental proviso; paragraph 2 establishes the labelled loan/driver facts used later. JA paragraph 1 poses the actual recipient question and supplies the no-stop trigger/examples; paragraph 2 supplies the required recipient rule/proviso and answers that question. EN paragraph 1 supplies the intended deadline distinction but contains M1; paragraph 2 supplies the no-stop/recipient rules. ZH paragraph 1 supplies attribution attachments/addressee and the two time bases; paragraph 2 supplies why the owner receives the notice. Wholesale deletion would lose operative legal conditions or the factual setup. The bounded JA opening rewrite is item 5; the EN defect remains openly recorded rather than silently deleted.

Recent same-locale comparison material was read from the current read-only checkout (publication dates are file metadata, not independent publication verification):

- ko: `/Users/son7/Projects/tseng-law-columns-20261016/src/content/columns/628-taiwan-parked-car-collision-external-video-evidence.md` (2026-10-15); `/Users/son7/Projects/tseng-law-columns-20261016/src/content/columns/627-taiwan-oneway-wrongway-head-on-collision.md` (2026-10-15); `/Users/son7/Projects/tseng-law-columns-20261016/src/content/columns/626-taiwan-red-signal-straight-stop-line-collision.md` (2026-10-15).
- ja: `/Users/son7/Projects/tseng-law-columns-20261016/src/content/columns-ja/610-taiwan-subsidiary-annual-shareholders-meeting-director-term.md` (2026-10-15); `/Users/son7/Projects/tseng-law-columns-20261016/src/content/columns-ja/609-taiwan-mistaken-bank-transfer-unjust-enrichment.md` (2026-10-14); `/Users/son7/Projects/tseng-law-columns-20261016/src/content/columns-ja/608-taiwan-false-financial-report-investor-civil-damages.md` (2026-10-14).
- en: `/Users/son7/Projects/tseng-law-columns-20261016/src/content/columns-en/611-taiwan-scooter-outer-lane-left-turn-dashcam.md` (2026-10-15); `/Users/son7/Projects/tseng-law-columns-20261016/src/content/columns-en/610-taiwan-subsidiary-annual-shareholders-meeting-director-term.md` (2026-10-15); `/Users/son7/Projects/tseng-law-columns-20261016/src/content/columns-en/609-taiwan-mistaken-bank-transfer-unjust-enrichment.md` (2026-10-14).
- zh-hant: `/Users/son7/Projects/tseng-law-columns-20261016/src/content/columns-zh/628-taiwan-parked-car-collision-external-video-evidence.md` (2026-10-15); `/Users/son7/Projects/tseng-law-columns-20261016/src/content/columns-zh/627-taiwan-oneway-wrongway-head-on-collision.md` (2026-10-15); `/Users/son7/Projects/tseng-law-columns-20261016/src/content/columns-zh/626-taiwan-red-signal-straight-stop-line-collision.md` (2026-10-15).

The ko/zh collision articles open on vehicle motion, road direction or signal timing; C7 concerns the notice recipient and attribution filing. The ja comparators address director terms, mistaken payment and financial-report signatures; the revised C7 question and document-specific headings differ. The en comparators use a collision scene, an isolated three-year figure and a mistaken-payment scene; C7 leads on the deadlines. C7's ending requests the notice and identifies its driver rather than recycling their crash-record or financial-record endings. Excerpts and headings are retained in `comparators.json`.

## Image verdict

Image: OK. I viewed `images/C7.webp`, a 16:9 image of an unbranded parked scooter with two plain helmets in a quiet shaded lane. It has no people or faces, no readable plate or documents, no text/signage, logo or flag. The plate area is blank. The generation brief expressly specifies a fictional, unidentifiable illustration; the actual image is consistent with it. Two helmets and a shared vehicle fit the driver-identity issue without depicting wrongdoing or a real incident. No image replacement or edit was made.

## Points for lawyer confirmation

1. 늦게 송달된 통지서에 처리세칙 제15조 제2항이 적용될 때, 제85조 귀책자 고지의 실제 마감일과 송달 효력 발생일을 어떻게 확인하는지 확인이 필요합니다.
2. 해당 처벌기관이 외국인 운전자의 신원을 특정·통지하기 위해 받는 증명서류와 차량 사용 메시지의 보완 범위를 확인하면 좋습니다.
3. 이미 납부했거나 통지서에 적힌 날짜가 지난 사건에서 귀책자 고지와 사실관계 의견 진술을 어떤 방식으로 접수·처리하는지 확인이 필요합니다.

## Validation and reviewed versions

After each file edit I ran `python3 /Users/son7/tseng-col-1016-work/lint.py /Users/son7/tseng-col-1016-work/drafts/C7/<lang>.md <lang> taiwan-traffic-ticket-other-driver-notice`; every run was OK. The final four lint runs and all four `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <file>` runs also exited 0. `final-checks.json` records command outputs, final SHA-256 values, unchanged hypothetical labels, zero removed original URLs and zero removed numeric tokens. Added numeric tokens are the repeated Article 85/Article 8 references documented above.

- `/Users/son7/tseng-col-1016-work/drafts/C7/ko.md` — SHA-256 `3650440512fe12d35d26ac9d4f6e12e68b0d5ec93bc3fa874aee464215c8d977`.
- `/Users/son7/tseng-col-1016-work/drafts/C7/ja.md` — SHA-256 `d20201de86e442d7a7e7c125644c26d699b32417b3f6f45ee95957efc84d1262`.
- `/Users/son7/tseng-col-1016-work/drafts/C7/en.md` — SHA-256 `bb501280865a3829cfa1341090695ddfa9fd0b35d314b164299ccb2868020f07`.
- `/Users/son7/tseng-col-1016-work/drafts/C7/zh-hant.md` — SHA-256 `3f6d148f93b446829ef29eb9a093a7c52a9316f1f2ca0b91f43b56cc9fd253a8`.
- `images/C7.webp` — SHA-256 `72642566ac596498d5e6f3d015f6e95f45e7398aa3dc30f508a3c05595e54fa6`.

Evidence directory: `reviews/C7/final-astra-r1-evidence/`. It contains the original four drafts, original-to-final diffs, curl-fetched official HTML/text, the statute comparison, the edit ledger, comparator excerpts, manual variety support and initial/final check outputs. The writer's fact sheet and shared research file were not silently amended. M1 is the only outstanding publication blocker.

VERDICT: FIX
