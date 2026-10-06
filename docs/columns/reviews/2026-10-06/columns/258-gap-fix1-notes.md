# G1 fix round 1 — editor notes (Claude Opus) — slug `taiwan-dui-reach-beyond-drivers-seat`

Date: 2026-10-06. Files edited: drafts/G1/{ko,ja,en,zh-hant}.md, drafts/G1/facts.md, research/G1-statutes.md (Part 4 appended), this file. Nothing else was edited; the repo was not touched; nothing was sent.

## MUST VERIFY

topics/G1.md has no `## MUST VERIFY` section, so there is no item to report as CONFIRMED / WRONG / UNVERIFIABLE.

## Lint after this round (all four end OK)

- ko: OK, 1,392 characters
- ja: OK, 1,393 characters
- en: OK, 789 words
- zh-hant: OK, 1,372 characters

ko and ja sit close to the 1,400 ceiling. Any later addition in those two needs an equal cut.

## Sources opened in this round (2026-10-06)

- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040012&flno=35 — default 第35條 = 2026-08-17 text, banner 「※本法規部分或全部條文尚未生效，最後生效日期：未定」, item 3 lists 第 21、21-1、35、67、73、85-2、85-3條.
- https://law.moj.gov.tw/LawClass/LawOldVer.aspx?pcode=K0040012&lnndate=20260114&lser=001 — 修正日期 民國 115 年 01 月 14 日; 第35條, 第67條, 第67-1條, 第85條, 第69條, 第92條 read in full. I checked that the `lnndate` parameter really selects the version (the same URL with `lnndate=20251119` returns the 民國114年11月19日 compilation), so this dated URL does not drift when a later amendment is compiled. The undated URL the drafts used does drift.
- https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=K0040012 — entries 48–50.
- https://gazette.nat.gov.tw/egFront/e_detail.do?metaid=163376 — commencement on 2026-01-31.
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040012&flno=67 (default = uncommenced 2026-08-17 text, compared against the in-force one).
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=185-3, https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=32, https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=93-2.
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040001&flno=34 and https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=K0040001 (公路法, added statute).
- The other articles (行政罰法 7、26; 刑法 38、95; 入出國及移民法 33; 道路交通安全規則 114; 處罰條例 85) were read from research/G1-statutes.md Part 2, fetched from law.moj.gov.tw at ingest today.
- Web search of official sites for an Executive Yuan order commencing the 2026-08-17 amendment: none found. The MOJ compilation cut-off shown on the page is 民國 115 年 09 月 24 日, so the final reviewer may want to recheck on the ship date.

Statutes added to research/G1-statutes.md (Part 4): in-force 處罰條例 第35條、第67條、第67-1條 (115.01.14 compilation), the not-yet-effective banner, history entries 48–50, the gazette line, 刑法 第185-3條 (missing from Part 2), 公路法 第34條. No judgment is cited; research/judgments/ is unchanged.

## FACTS items from check-grok.md

1. Art. 35 link and date label — CHANGED. All four now link the dated in-force page for 第35條 and 第67條, say “as of October 6, 2026” in the page language, and carry one sentence that the 2026-08-17 第35條 raises the fines and has no commencement date (en and zh-hant print the new ranges NT$18,000–120,000 / NT$36,000–150,000; ko and ja say only “raised”, for length). Not done exactly as asked: Grok wanted the reader pointed at the in-force paragraphs rather than a whole earlier-version act. No official single-article URL shows the in-force 第35條 (the single-article page shows the uncommenced text), so the whole-act dated page is the only official link; the paragraph numbers are named in the text and the sources section labels both pages.
2. Serious injury or death = revocation plus lifetime bar — CHANGED in all four (第35條第1項 + 第67條第1項). Not stated for a positive test that only draws a suspension. The 第67-1條 exclusion is recorded in facts.md; the columns say “never / 평생 / 終身” and do not describe the reapplication route.
3. Refusal — CHANGED in all four: base NT$180,000, impoundment, revocation, three-year bar (第67條第2項), education or treatment before re-licensing (第67條第5項), two-year plate suspension (第35條第9項), lifetime bar when the refusal case involves serious injury or death (第35條第4項後段 + 第67條第1項). The NT$270,000 figure is not used.
4. Impoundment missing in ko / ja positive-test paragraph — CHANGED (ko 「차량 보관」, ja 「車の保管」).
5. Suspension periods looked universal — CHANGED in all four: labelled as the first violation; one sentence adds that a second violation within ten years (第35條第3項) or driving a 營業大客車 (第35條第2項) means revocation. The four-year bar for bus drivers and the third-violation surcharge are left out for length (recorded in facts.md scope).
6. Passenger fault — CHANGED in all four: 行政罰法 第7條 kept, 第85條第3項 presumption added. I state the presumption from the text and hedge its effect (“may have to show / 밝혀야 할 수 있습니다 / 示すことになり得ます / 可能得…提出反證”) because no court decision on its application to passengers was opened.
7. Statutory exception classes — CHANGED: ko 「심지장애(心智障礙)」, ja 「心智障礙のある人」, en “what it calls 心智障礙 (mental or intellectual disability)”, and 汽車運輸業 glossed as taxis and buses on the basis of 公路法 第34條 (newly added source). 70-or-over exemption added where it was missing.
8. en “including scooters” — REMOVED. en now says “motorcycle (機車)”. The Japanese opening scene, which I had first written with a scooter, uses a rental car for the same reason.
9. en death / serious-injury figures — handled differently: instead of adding the 第3項 repeat range, I removed the figures. en now says the penalties are heavier where someone is killed or seriously injured, as the other three do. Reason: word budget, and no version now prints a ceiling that 第3項 would contradict.
10. Shortfall and license wording — CHANGED: all four say the difference must be paid (第35條第12項 應). ko and ja now say other kinds of administrative sanction “may” still be imposed (行政罰法 第26條第1項 得), not that the license measure always remains.
11. Immigration wording — CHANGED: ja follows 一年有期徒刑以上之刑 (「1年以上の有期徒刑かそれより重い刑」); all four add cancellation of the residence card (註銷).
12. ko exit restriction — CHANGED: names the prosecutor or judge, the three grounds, necessity, and leaving by air or sea; keeps “may”. Same structure in ja / en / zh-hant.
13. Firm name, email, sources, general-information line — CHANGED in all four: prescribed firm name, wei@hoveringlaw.com.tw, a non-confidential outline first, no address, no phone, no attorney name; sources section last with 2026-10-06; one general-information line at the very end.
14. Frontmatter — CHANGED: one FAQ each (answers restate body facts only), seoTitle for ko / ja / zh-hant (≤ 32) and for en (45 characters, required because title + “ | Hovering Law” is 62), en summary 151 characters, read_time adjusted. topic, featured_image, audience, author unchanged. The `tags` line written by ingest is kept (lint allows it).

Grok's side note that order number 1151002056 was not on the gazette page: the number is on the MOJ history page (「中華民國一百十五年一月二十九日行政院院臺交字第 1151002056 號令」). It is in facts.md and not in any column.

## VOICE items

Shared problem (one outline in four languages, each beat closed by “not X”): the legal distinctions stay, the repeated hinge is gone, and the versions no longer share one order. ko opens on a hypothetical passenger and ends on what remains after the fine; ja opens on the night before a flight home and puts exit and residence first, the passenger rule last; en opens on the passenger statement; zh-hant keeps its own order.

### ko
- 한다체 body → rewritten in 합니다체 throughout.
- 「운전자만의 사건으로 끝나지 않는다는 뜻이다.」 → deleted. The opening is now a marked hypothetical (가령) that carries the passenger rule.
- Three 「것은 아니다」 hinges → replaced by direct statements: 「동승자에게 고의도 과실도 없으면 처벌하지 않습니다」 plus the presumption; 「운전자 소유의 차는 법원이 … 몰수할 수도 있습니다」; 「형이 그보다 가벼워도 징역형을 선고받은 외국인은 형 집행 뒤 추방될 수 있습니다」. Grok's third suggestion (「다른 출국 조치까지 닫히지는 않습니다」) was not used as written: “다른 출국 조치” names no rule, and its art. 36 / art. 18 basis was removed as unverifiable, so the sentence states 刑法 第95條 instead.
- Closing sentence → one contact sentence with the prescribed name and email. Grok's two-sentence shape was merged into one for length.

### ja
- である調 → です・ます調 throughout, no 体言止め sentences in the body.
- Summary 「〜を解説します」 → rewritten as statements of fact. Grok's suggested summary ended in 「書きます」, which is still a preview, so I did not use it.
- 「台湾の飲酒検問は、ハンドルを握っていない人にも無関係ではない。」 → deleted; the passenger rule is stated directly in its own section.
- 「ただし精神・知的障害のある人や運送事業の乗客は対象外。」 → full sentence with the statutory classes. Grok's shape (「法令が除く乗客までは対象になりません」) hides who is exempt, so the classes are listed instead.
- Title kept; the body keeps the restriction conditional (grounds + necessity) and says payment is not part of the art. 93-2 test.

### en
- Roadmap sentence after the opening → deleted. “Next comes the distinction…” → deleted; the paragraph starts with “Impoundment is not forfeiture.”
- “not a safe harbor / not automatic” cadence → replaced with direct statements (“A lower reading, or no reading because the driver refused, can still be the offense if…”, “A shorter sentence leaves another route open…”). “None of this makes deportation automatic upon arrest” → deleted (no sentence now suggests it).
- Summary → Grok's 151-character line adopted. seoTitle added.

### zh-hant
- Voice was OK; the two opening sentences and the two spoken lines Grok singled out are kept. Changes are the fact items above, three fact-stating `##` headings (lint requires headings), the contact / sources / general-information lines, and article numbering in the official form (第185條之3、第93條之2).

Deletion test on the first two paragraphs (per the voice rule):
- ko ¶1: removing the hypothetical loses the scene only, but removing the second sentence loses the passenger rule and thresholds; both kept, merged from three sentences to two. ¶2: each sentence carries a rule (art. 7, art. 85(3)); kept.
- ja ¶1: one sentence, the hypothetical that the title answers; kept. ¶2: thresholds, offense, penalty; kept.
- en ¶1–2: each sentence carries a number, a class or a rule; kept.
- zh-hant ¶1: both sentences kept, as Grok found.

## Facts removed as unverifiable (or wrong)

- 「법무법인 호정」 — wrong entity name; replaced with the prescribed name.
- en “motorcycles, including scooters” — no official text opened here defines scooters; removed.
- “Other removal grounds” for a sentence under one year via 入出國及移民法 第36條第2項第1款 and 第18條第1項第7款、第13款 — the reading that a drunk-driving record acquired after entry is a ground “found after entry” is not confirmed by any official source opened; removed from all four. 第36條 is no longer cited; the point now rests on 刑法 第95條 alone.
- en “Paying money does not restore a suspended license” and “payment does not itself lift that restriction” — inferences with no passage behind them; removed / reworded to what the art. 93-2 text contains.
- ko / ja / en paraphrases of the exemption (정신·지적 장애, 運送事業, mental disabilities) — replaced by the statutory terms.

Verified but not carried (length or precision, not doubt): the death / serious-injury sentence ranges, 行政罰法 第21條、第22條, 入出國及移民法 第21條, the Taipei City database URL. Details are in facts.md.

## Left for the final reviewer

- Recheck commencement of the 2026-08-17 amendment on the ship date; if an order has issued, the fines, the forfeiture wording, the links and 第67條 all change.
- The 第85條第3項 presumption is stated from the statute with a hedge. A public administrative-court decision applying it to a passenger would let the hedge be dropped; none was opened in this round.
- 心智障礙 is given as the statute's own term with a short gloss in en only. No official definition was opened.
- Internal links: ko / ja / zh-hant → taiwan-permanent-residence-aprc (029, exists in all four); en → taiwan-exit-ban-foreigners (032, en). Lint confirmed the files exist.
- Voice in ja, en and zh-hant is my own judgment as a model, not a native speaker's review.
