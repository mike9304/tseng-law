# Final review r1 — fact-taiwan-company-subsidiary-vs-branch-1 (Claude Fable 5.1, 2026-10-06)

Verdict: PASS. No blocking issue. No edit made to any draft.

Scope of this review: issues.md (no triage.md exists; the job is marked manual), verify.md, guard.txt, tests.patch, and the four orig/draft pairs read in full (ko, en, zh-hant drafts plus the diff against orig; ja orig and draft are byte-identical). Every official URL in verify.md was opened again with WebFetch on 2026-10-06. Each statute article was read on its single-article page and again on the full-act page (LawAll); the two readings agree with each other and with the quotations in verify.md character for character. WebFetch renders the page through a model, so this is two independent renderings of the official page, not a raw download. law.moj.gov.tw footer: 法規整編資料截止日：民國 115 年 09 月 24 日.

This is a model review. It is not a review by a lawyer or by a native-speaker editor.

## Issue 2 — source entry label vs link (5% business tax, 21% dividend withholding)

URLs opened and the sentence checked:

- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340028&flno=3 — the page is 各類所得扣繳率標準 第 3 條, not the Business Tax Act. 第1項第1款: 「非中華民國境內居住之個人，如有公司分配之股利，合作社分配之盈餘，其他法人分配或應分配之盈餘，合夥組織營利事業合夥人每年應分配之盈餘，獨資組織營利事業資本主每年所得之盈餘，按給付額、應分配額或所得數扣取百分之二十一。」 The dividend item covers non-resident individuals only.
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340028&flno=4 — 第 4 條: 「總機構在中華民國境外之營利事業，因投資於國內其他營利事業，所獲配或應獲配之股利或盈餘，由扣繳義務人於給付時，按給付額或應分配額扣取百分之二十一。」 This is the rule for a dividend paid to a foreign parent company.
- https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=G0340028 — 修正日期：民國 110 年 06 月 30 日, no abolition shown; Art. 3(1)(1) and Art. 4 identical to the single-article pages.
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0340080&flno=10 — 加值型及非加值型營業稅法 第 10 條: 「營業稅稅率，除本法另有規定外，最低不得少於百分之五，最高不得超過百分之十；其徵收率，由行政院定之。」
- https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=G0340080 — 修正日期：民國 114 年 05 月 28 日; Art. 10 identical.
- https://www.etax.nat.gov.tw/etwmain/tax-info/innotative-tax-e-reference/filing/business-tax/wMDMRl7 — 「營業稅稅率，除本法另有規定外，最低不得少於5%，最高不得超過10%，由行政院定之。目前稅率為5%。」
- https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/individual-income-tax/withheld-rule/rule/3AmWR0R — 「公司分配股利或合夥事業盈餘給非境內居住的個人或總機構在中華民國境外的營利事業時，於107年1月1日以後，按給付額，依規定扣繳率21%扣取稅款。」
- https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=G0340028 — official English title "Standards of Withholding Rates for Various Incomes", amended 2021-06-30; Art. 4 "…a profit-seeking enterprise having its head office outside the territory of the Republic of China … shall be withheld at a rate of 21%…".

Verdicts in verify.md, checked:

- 2a ko, en — CONFIRMED-ERROR: right. The live entry carries the Business Tax Act Art. 10 label on a link that opens 各類所得扣繳率標準 第 3 條.
- 2a zh-hant, ja — ORIGINAL-RIGHT: right. zh-hant labels the flno=3 link 各類所得扣繳率標準第3條; ja links 加値型及非加値型営業税法第10条 to G0340080 flno=10.
- 2b ko, en, zh-hant — PARTLY: right. The 21% rate is correct, but the entry cited for a dividend to a foreign parent company (FAQ 2, tax table, the paragraph after the table) is Art. 3(1)(1), which covers individuals. The corporate rule is Art. 4.
- 2b ja — ORIGINAL-RIGHT: right. ja cites 各類所得扣繳率標準第4条 (flno=4) in FAQ 2, in the body and in the source list.

Per-language result of the correction:

- ko — OK. 영업세법 제10조 now links to G0340080 flno=10. The old link G0340028 flno=3 is kept under 각종 소득 원천징수율 표준(各類所得扣繳率標準) 제3조. A 제4조 entry (flno=4) is added. Each label matches its page. No body sentence changed for this issue.
- en — OK. Same three entries; the two new labels use the official English title.
- zh-hant — OK. One entry added, 全國法規資料庫—各類所得扣繳率標準第4條 (flno=4), in the existing label pattern. The Art. 3 entry is unchanged.
- ja — unchanged, correct as published.

On scope: the Art. 4 entry is new, but it adds no fact to the body. It supplies the correct article for a claim the column already makes, which is what issues.md asks for ("each source entry matches its page and the claim it supports"). Art. 3 stays because the body also speaks of foreign shareholders in general (국외 주주 / "a foreign shareholder" / 國外股東), which includes non-resident individuals. No URL of the original was removed, so no REMOVED-URL line is needed; factguard confirms.

## Issue 3 — Company Act Art. 379 effect stated for every branch deregistration

URLs opened and the sentence checked:

- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=379 — 第1項: 「有下列情事之一者，主管機關得依職權或利害關係人之申請，廢止外國公司在中華民國境內之分公司登記：一、外國公司已解散。二、外國公司已受破產之宣告。三、外國公司在中華民國境內之分公司，有第十條各款情事之一。」 第2項: 「前項廢止登記，不影響債權人之權利及外國公司之義務。」
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=378 — 「外國公司在中華民國境內設立分公司後，無意在中華民國境內繼續營業者，應向主管機關申請廢止分公司登記。但不得免除廢止登記以前所負之責任或債務。」
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=380 and https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080001 — 修正日期：民國 114 年 12 月 26 日; Art. 378, 379 and 380 on the full-act page are identical to the single-article pages. Art. 380(1): 「…所有分公司，均經撤銷或廢止登記者，應就其在中華民國境內營業所生之債權債務清算了結，未了之債務，仍由該外國公司清償之。」

Verdicts in verify.md, checked:

- ko, en — CONFIRMED-ERROR: right. 「前項廢止登記」 in Art. 379(2) attaches only to the cancellation by the competent authority under Art. 379(1). The live ko and en sentences gave that effect to Art. 379 for any cancellation, including the voluntary application of Art. 378, which has its own proviso.
- zh-hant, ja — ORIGINAL-RIGHT: right. zh-hant already reads 「主管機關依《公司法》第379條第1項廢止分公司登記時，依同條第2項…」. ja gives Art. 378 its own sentence and limits Art. 379 to cancellation by the competent authority.

Per-language result of the correction:

- ko — OK. "주무기관이 회사법 제379조 제1항에 따라 지점등기를 말소하는 경우에도 채권자의 권리와 외국회사의 의무는 달라지지 않습니다. 같은 조 제2항의 내용입니다." Actor (主管機關), paragraph attribution (제1항 / 제2항) and effect match the statute. 합니다체 kept. 주무기관 is the term the column already uses in its closing notice. The two follow-up sentences (creditors keep rights arising before the cancellation; the foreign company stays liable) hold under Art. 379(2).
- en — OK. "Where the competent authority cancels a branch registration under Article 379(1) of the Company Act, Article 379(2) provides that the cancellation does not affect creditors’ rights or the foreign company’s obligations." Matches the statute; plain English; the "Article 99(1)" citation form is the column's own.
- zh-hant — unchanged, correct as published.
- ja — unchanged, correct as published.

Cross-language consistency: ko, en and zh-hant now say the same thing with the same paragraph attribution. ja names only the ex officio route (「主管機関が職権で登記を廃止する場合も」); Art. 379(1) also allows cancellation on an interested party's application. The ja sentence is true as far as it goes and does not say ex officio is the only route, so it is not a statute error and it correctly stays out of this fix.

The neighbouring paragraphs were read against the statute and need no change: the Art. 378 paragraph (voluntary application; earlier obligations do not disappear) is consistent with the Art. 378 proviso, and the Art. 380 paragraph is consistent with Art. 380(1). No FAQ answer, summary or table states the Art. 379 effect in any language.

## Scope (diff of each pair)

- ko: line 160 (the Art. 379 sentence pair) and the source list (1 line → 3 lines). lastmod was already "2026-10-06" in the live file.
- en: lastmod "2026-07-25" → "2026-10-06", line 166 (the Art. 379 sentence), the source list (1 line → 3 lines).
- zh-hant: lastmod "2026-07-25" → "2026-10-06", one added source line.
- ja: identical to the live file; lastmod stays "2026-07-25".

Nothing else changed. Front matter (FAQ, summary), H1, images and internal links are identical. No bold markup in any draft.

factguard re-run by me: `python3 /Users/son7/tseng-rewrite-1006/factfix/factguard.py <job> 2026-10-06` → FACTGUARD: PASS (ko 275 body characters changed, 1.9%; ja unchanged; en 467, 1.2%; zh-hant 94, 0.9%; URLs added only: G0340080 flno=10 and G0340028 flno=4 in ko and en, G0340028 flno=4 in zh-hant; no original URL missing).

## Language

- ko: the edited sentences read as natural 합니다체. No translationese.
- en: plain and idiomatic.
- zh-hant: only a source label was added, in the existing pattern and with the official regulation name.
- ja: no edit.

Sentence-variety tool (`variety_metrics.py check`, explicit --lang), orig vs draft: ko 0 FAIL before and after (cv 0.466 → 0.467). en has the same four FAIL lines in the live file and in the draft (len_cv 0.332 → 0.333, short_share 0.01, top_opener_n 7, contrast 4). zh-hant has the same three FAIL lines in both (len_cv 0.376, short_share 0.015, contrast 4). ja OK. The fact fix adds no variety problem. The en and zh-hant FAILs belong to the published text and are outside what a fact fix may rewrite; they are not a reason to hold back a statute correction.

## Blocking issues

None.

## Tests verdict: OK

tests.patch touches only the three pinned test files of this column (columns-en-investment-004, columns-ko-investment-004, columns-zh-investment-004). Changes:

- the officialLinks lists follow the corrected source lists exactly (en and ko: Art. 10 link corrected, Art. 3 and Art. 4 entries added; zh: Art. 4 entry added); the tests still compare the full link list with toEqual, so the source list stays locked;
- lastmod / date "2026-07-25" → "2026-10-06" in en and zh (ko was already 2026-10-06);
- the pinned Art. 379 sentence in en and ko is replaced by the corrected sentence, so the assertion now locks the Art. 379(1)/(2) attribution in place of the over-broad statement;
- pinned visible-length counts: en 5,505 → 5,544 words, ko 2,958 → 2,983 eojeol, zh 7,935 → 7,953 Han characters. The deltas match the edits (zh +18 is exactly the Han characters of the added label; en +39 is the longer sentence plus two labels). Read-time assertions are unchanged and still computed from the count.

No .skip / .only / .todo / xit / xdescribe added, and no assertion loosened or removed. The ja test is untouched because ja did not change. vitest-1.log: Test Files 79 passed (79), Tests 1092 passed (1092).

## Tiny edits

None. The drafts are exactly as the fixer left them, so tests.patch and guard.txt still describe the files that ship.

## Non-blocking notes (no action required for this job)

- ko label wording: the draft renders 各類所得扣繳率標準 as "각종 소득 원천징수율 표준"; ko column 238 (korea-taiwan-tax-agreement-dispatched-engineers-permanent-establishment) uses "각종 소득 원천징수율 기준(各類所得扣繳率標準)", and ko column 048 uses the Chinese name alone. Both renderings are acceptable and the Chinese name in parentheses removes any ambiguity. I did not change it here: an edit after review would send re-synced tests live without a review. It can be aligned in a later editorial pass.
- zh-hant has no Business Tax Act Art. 10 entry in its source list, while ko and en do. The 5% statement in the zh-hant body is correct (Art. 10 plus the MOF page above), and a source that was never listed is not a statute error, so leaving it is right for a fact fix.
- ja names only the ex officio route of Art. 379(1) (see Issue 3). True, narrower than the statute; candidate for a later editorial pass if wanted.

VERDICT: PASS
