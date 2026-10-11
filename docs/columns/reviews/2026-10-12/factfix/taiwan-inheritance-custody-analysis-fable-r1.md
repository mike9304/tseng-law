# review-r1 — fact-taiwan-inheritance-custody-analysis-1 (column 016), Fable final review, round 1

Reviewer: Claude Fable 5.1, 2026-10-12. Role: last gate before the drafts replace the live pages.
Verdict: PASS. No blocking issue. No tiny edits made.

Files read in full: issues.md, verify.md, guard.txt, tests.patch, tests.txt, log, claude-tests1.log, vitest-1.log, and all four orig/draft pairs. triage.md does not exist.

## 1. STATUTE — independent check of every URL cited in verify.md

All four pages were opened again today with WebFetch. The tool only returns quotes of up to 125 characters, so the Chinese article was requested one paragraph at a time; each quote below is the tool's verbatim return.

### URL 1 — current article
https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=1030-1

Confirmed: the article has 5 paragraphs.

第2項 (verbatim): 「夫妻之一方對於婚姻生活無貢獻或協力，或有其他情事，致平均分配有失公平者，法院得調整或免除其分配額。」
- contains 有失公平: yes. contains 顯失公平: no. contains 調整或免除: yes.

第3項 (verbatim): 「法院為前項裁判時，應綜合衡酌夫妻婚姻存續期間之家事勞動、子女照顧養育、對家庭付出之整體協力狀況、共同生活及分居時間之久暫、婚後財產取得時間、雙方之經濟能力等因素。」
- six named factors: 夫妻婚姻存續期間之家事勞動 / 子女照顧養育 / 對家庭付出之整體協力狀況 / 共同生活及分居時間之久暫 / 婚後財產取得時間 / 雙方之經濟能力, closing with 等因素.

第1項 exclusions (verbatim): 「一、因繼承或其他無償取得之財產。」「二、慰撫金。」
第4項 (verbatim): 「第一項請求權，不得讓與或繼承。但已依契約承諾，或已起訴者，不在此限。」

The quotations in verify.md match these character for character.

### URL 2 — amendment history
https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0000001

Latest entry touching 1030-1 (verbatim): 「中華民國一百十年一月二十日總統華總一義字第 11000004151 號令 修正公布第 1030-1 條條文；並自公布日施行」.
Newest entry on the page (verbatim): 「中華民國一百十五年八月十七日總統華總一義字第 11500076161 號 令修正公布第 1223 條條文；並自公布六個月後施行」 — amends Art. 1223 only. So the text quoted under URL 1 is the current text of Art. 1030-1 as of today.

### URL 3 — earlier version (101.12.26)
https://law.moj.gov.tw/LawClass/LawOldVer.aspx?pcode=B0000001&lnndate=20121226&lser=001

Confirmed: 4 paragraphs. 第2項 (verbatim): 「依前項規定，平均分配顯失公平者，法院得調整或免除其分配額。」 — contains 顯失公平. No factor paragraph. This proves 顯失公平 / "manifestly unfair" is the pre-2021 wording.

### URL 4 — official English translation (terminology only)
https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=B0000001 (offset 370000)

Verbatim fragments: "The court may adjust or waive the share of distribution"; "provided that equal distribution is unfair when one party of the husband and the wife offers no contribution"; "household labor, caring and nurturing of the child, the collaboration of contribution to the family"; "the length of time of living together or separately, the time of receiving the property acquired in marriage or each party's economic ability". Consistent with the Chinese text and with the en draft's terms.

### Verdicts in verify.md — all confirmed right

| Sub-issue | ko | ja | en | zh-hant |
|---|---|---|---|---|
| 1a threshold (有失公平, not 顯失公平) | CONFIRMED-ERROR, fixed | CONFIRMED-ERROR, fixed | CONFIRMED-ERROR, fixed | CONFIRMED-ERROR, fixed |
| 1b court power (調整或免除) | CONFIRMED-ERROR, fixed | CONFIRMED-ERROR, fixed | CONFIRMED-ERROR, fixed | ORIGINAL-RIGHT, unchanged |
| 1c factor list (第3項) | PARTLY, fixed | PARTLY, fixed | PARTLY, fixed | ORIGINAL-RIGHT, unchanged |

Notes on judgment calls I agree with:
- Omitting the lead-in 「夫妻之一方對於婚姻生活無貢獻或協力，或有其他情事」 is a legitimate summary: 或有其他情事 is a catch-all, so "equal distribution is unfair" states the operative condition. Not an over-correction and not a new fact.
- zh-hant 「依婚姻共同生活及協力情形等因素」 is a shortened reference whose two items are both in 第3項; leaving it is correct. Rewriting it into the six-item list would have exceeded the issue's scope.
- Leftover check: grep of all four drafts for 현저히 / 著しく / manifestly / 顯失 / 職業上 / 직업상 / occupational / 관리 상황 / 管理の状況 / "acquired and managed" returns nothing. No confirmed error remains in any in-scope language.

## 2. CORRECTNESS — corrected sentences against the statute

- ko §3 ¶4: 「균등 분배의 결과가 불공평하면 법원이 분배액을 조정하거나 면제할 수 있다는 내용도 제1030조의1에 있습니다. 혼인 기간 중의 가사노동, 자녀 돌봄과 양육, 가정에 대한 전반적인 기여·협력 상황, 공동생활 기간과 별거 기간의 길이, 혼인 후 재산을 취득한 시기, 쌍방의 경제적 능력 등 …」 — threshold, power, and all six factors in statutory order; 등 mirrors 等因素. Correct.
- ja §3 last ¶: 「調整または免除できる」「不公平となるときです（第1030条の1）」「婚姻中の家事労働、子の世話と養育、家庭に対する全体的な貢献・協力の状況、共同生活と別居の期間の長短、婚姻後の財産の取得時期、双方の経済的能力など」 — correct, same six factors, same order.
- en §3 last ¶: "adjust or waive … if an equal distribution would be unfair" and the six factors "household work during the marriage, the care and upbringing of children, the overall contribution and cooperation given to the family, how long the spouses lived together and apart, when property was acquired during the marriage, and each party's economic capacity" — correct and matches the official English terminology.
- zh-hant §3 ¶4: 「平均分配有失公平時，法院得依婚姻共同生活及協力情形等因素調整或免除分配額」 — uses the statute's exact term. Correct.
- Article attribution (제1030조의1 / 第1030条の1 / Article 1030-1 / 第1030條之1) unchanged and right in all four. Cross-language consistency: the three rewritten factor lists are the same six items in the same order.

## 3. SCOPE — diff of each pair

Each diff contains exactly two hunks: the lastmod line and one paragraph in §3.
- ko: lastmod 2026-10-06 → 2026-10-12; one paragraph (two sentences edited, third sentence untouched).
- ja: lastmod 2026-10-06 → 2026-10-12; one paragraph (three sentences edited, fourth untouched).
- en: lastmod 2026-10-06 → 2026-10-12; one paragraph (two sentences edited, third untouched).
- zh-hant: lastmod 2026-07-25 → 2026-10-12; one character pair 顯→有 in one sentence.
No change to FAQ, summary, headings, links, or the sources section. All five source links kept in every language. No URL added or removed, so no REMOVED-URL line is required. No new fact beyond 第2項/第3項.
guard.txt ends FACTGUARD: PASS; I re-ran factguard.py today and got the same result (ko 105 chars 1.1%, ja 56 0.6%, en 201 0.8%, zh-hant 1 0.0%, PASS).

## 4. LANGUAGE

- ko: 합니다체 kept; 「조정하거나 면제할 수 있다는」 and 「쌍방의 경제적 능력」 read as natural Korean legal prose. No translationese.
- ja: です・ます kept; 「調整または免除できる場合もあります」「共同生活と別居の期間の長短」 natural.
- en: plain, one sentence per idea; "adjust or waive" matches the official translation.
- zh-hant: 有失公平 is the statute's own Taiwan wording.
variety_metrics.py check (with --lang): ko WARN (96% 니다 endings), ja WARN (94% desu-masu), en OK, zh-hant 2 FAIL (len_cv 0.42, short_share 0.035). The zh-hant FAILs and both WARNs are identical, figure for figure, on orig-*.md, so they belong to the live text and not to this fix. Fixing them would mean rewriting sentences, which the SCOPE rule forbids in a fact fix. Not blocking; noted for a future voice pass.

## 5. TESTS — tests.patch

Touches only the four column-016 test files. Changes: lastmod/date 2026-10-06 (zh: 2026-07-25) → 2026-10-12; the Art. 1030-1 required phrases re-anchored to the corrected sentences; the new six-factor sentence added as a required phrase in ko, ja, en (so the corrected facts are now locked too); zh phrase re-anchored to 有失公平; counts and SHA-256 pins updated. The en test's read-time assertion became stricter (calculated 19 equals the frontmatter "19 min read"), not looser. No .skip / .only / .todo (grep of the patch: none). No assertion that locked a fact was removed.
Independent hash check: SHA-256 of draft-en.md = e1010362…aa4893, draft-ja.md = 9cfa275d…6c6f72, draft-zh-hant.md = 9842d44c…e08e0f — each equals the new pin in tests.patch, so the tests lock exactly these drafts. vitest-1.log: 79 files, 1029 tests passed.
Tests verdict: OK.

## Blocking issues

None.

## Tiny edits

None. The drafts are left byte-identical to what the tests pin (any wording edit would also have invalidated the SHA-256 and count pins in tests.patch).

VERDICT: PASS
