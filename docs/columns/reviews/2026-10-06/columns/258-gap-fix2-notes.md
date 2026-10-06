# G1 fix round 2 — editor notes (Claude Opus) — slug `taiwan-dui-reach-beyond-drivers-seat`

Date: 2026-10-06. Feedback applied: reviews/G1/final-fable-r1.md (Fable final review, round 1). Files edited: drafts/G1/{ko,ja,en,zh-hant}.md, drafts/G1/facts.md, this file. research/G1-statutes.md is unchanged (no statute added). No judgment is cited; research/judgments/ is unchanged. Nothing else was edited; the repo was not touched; git was not run; nothing was sent.

## MUST VERIFY

topics/G1.md has no `## MUST VERIFY` section, so there is no item to report as CONFIRMED / WRONG / UNVERIFIABLE.

## Results after this round

Lint (`python3 lint.py drafts/G1/<lang>.md <lang> taiwan-dui-reach-beyond-drivers-seat`):

- ko: OK, 1,399 characters
- ja: OK, 1,398 characters
- en: OK, 797 words
- zh-hant: OK, 1,335 characters

Variety checker (`variety_metrics.py check`), all four print "OK — no variety limit violated":

| File | len_cv (≥ 0.45) | short_share (≥ 0.08) | run3 (≤ 0.30) | same paragraph opener (≤ 2) | cite_end (≤ 0.45) | contrast (≤ 3) | Before this round |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ko | 0.487 | 0.171 | 0.03 | 1 | 0.229 | 0 | no FAIL, WARN stock opener |
| ja | 0.485 | 0.25 | 0.0 | 2 | 0.0 | 0 | FAIL len_cv 0.416, WARN stock opener |
| en | 0.536 | 0.154 | 0.0 | 1 | 0.179 | 0 | FAIL len_cv 0.421, short_share 0.029, top_opener_n 4 |
| zh-hant | 0.523 | 0.152 | 0.032 | 1 | 0.273 | 0 | FAIL short_share 0.037 |

No WARN line remains in any language. ko and ja sit close to the 1,400 ceiling and en close to 800; any later addition needs an equal cut.

## Sources re-opened in this round (2026-10-06)

- https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=K0040012 — entry 50 (115.08.17, 第 21、21-1、35、67、73、85-2、85-3 條) still reads 「施行日期，由行政院以命令定之」 with no commencement order under it; entry 48 and the 115.01.31 commencement order unchanged; 法規整編資料截止日 民國 115 年 09 月 24 日.
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=K0040012&flno=35 — banner 「※本法規部分或全部條文尚未生效，最後生效日期：未定」 and the three numbered lines unchanged; the default text is still the 115.08.17 one.
- https://law.moj.gov.tw/LawClass/LawOldVer.aspx?pcode=K0040012&lnndate=20260114&lser=001 — header 「修正日期：民國 115 年 01 月 14 日」; 第35條、第67條、第85條 read in full from the raw page text. They match research/G1-statutes.md Part 4 word for word.
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=32 and flno=33 — item 3 and its 但書 (過失犯罪, 緩刑) as quoted in facts.md (issue L1).
- https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=93-2 and https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=185-3 — unchanged.

One caution for whoever checks next: an automated page summary of the dated page returned 第35條第8項 as starting 「汽機車駕駛人駕車發生交通事故，經測試檢定…」 and without its 但書. That wording is not on the page. The raw page text reads 「汽機車駕駛人，駕駛汽機車經測試檢定吐氣所含酒精濃度達每公升零點二五毫克或血液中酒精濃度達百分之零點零五以上，年滿十八歲之同車乘客處新臺幣六千元以上一萬五千元以下罰鍰。但年滿七十歲、心智障礙或汽車運輸業之乘客，不在此限。」 The passenger rule has no accident element, and the columns were left as they were on that point.

## Feedback items

### L1 — ko summary states the residence rule without its exceptions (required) — CHANGED

- Before: 「1년 이상의 징역형이 확정된 외국인은 거류허가가 취소됩니다」
- After: 「1년 이상의 징역형이 확정된 외국인은 과실범이거나 집행유예를 받은 경우가 아니면 거류허가가 취소됩니다」
- Source: 入出國及移民法 第32條第3款 「經判處一年有期徒刑以上之刑確定。但因過失犯罪或經宣告緩刑者，不在此限。」 The one-year threshold, 확정 and 거류허가 취소 are unchanged. In the same summary the refusal clause now says 「과태료가 기본 18만 대만달러」, matching the body (第35條第5項 raises a repeat refusal).

### L2 — ko "측정을 거부했어도 같습니다" (required) — CHANGED

- After: 「크게 다치거나 숨지면 면허가 취소됩니다. 평생 다시 딸 수 없습니다. 측정을 거부한 운전자가 그런 사고를 내도 같습니다.」
- The lifetime bar in a refusal case is now tied to the accident (第35條第4項後段, 第67條第1項). The three-year rule for a plain refusal stays in the paragraph above.
- Same point made explicit in the other versions: en 「the same applies when the driver had refused the test」, zh-hant 「拒測的駕駛肇事致人重傷或死亡，也一樣」; ja 「検査拒否の場合も含め」 was already clear and is kept.

### M1 — MONOTONY, en — CHANGED

- Sentence length and short sentences: six sentences of eight words or fewer now carry a fact each (「The driver's reading decides it.」「The passenger may have to show otherwise.」「The license is revoked.」「No accident is required.」「Impoundment is not forfeiture.」「Negligent offenses and suspended sentences are excepted.」). The 30-word passenger sentence and the refusal sentence were split.
- Paragraph openers: A / The / What / Refusing / Drivers / Carrying / At / Impoundment / When / For / Under / These / Hovering. 「A」 opens one paragraph instead of four.
- The opening hook is now its own two-sentence paragraph without a citation; the rule and its citation follow at once. A reader's question was added (「What if the passenger did not know the driver had been drinking?」).
- 「revoked rather than suspended」 and 「revocation instead of suspension」 were restated positively. No figure, citation or the "as of October 6, 2026" label was dropped.

### M2 — MONOTONY, ja — CHANGED

- Stock opener removed. The reviewer suggested keeping the scene and moving the label. I removed the scene instead: the two other columns of this batch whose drafts are in (G3, G4) open on a scene in all four languages, and the variety rule caps scene openers at a third of a batch. ja now opens on the number 「呼気1リットルあたり0.25mg。」. With no hypothetical left, no hypothetical label is needed; none was lost.
- Sentence length: the number-heavy sentence was split (「初回の過料はバイクが1万5,000～9万台湾ドルです。自動車は3万～12万台湾ドル。車の保管、免許停止1～2年、プレート停止2年が付きます。」), the passenger amount has its own sentence, and short sentences were added (「血中なら0.05％以上です。」「そうとは限りません。」「免許は取消しです。」「保管と没収は別です。」).
- A citation-free paragraph now exists: the reader's question under the first heading (「罰金を納めれば、予定の便で帰国できるのでしょうか。そうとは限りません。」).
- The 0.15 mg/L driving ban moved from the opening to the licence section, where the fines it triggers are listed.
- 「同35条」 became 「處罰條例35条」 in two places, because the 道路交通安全規則 citation now stands between them and 「同」 would have pointed at the wrong law.
- Cuts made to stay under 1,400: 「を問わず」→「とも」, 「必要なとき、」→「必要なら」, 「科すことができます」→「科せます」, a few commas. No number, condition or citation was cut; です・ます throughout, two 体言止め.

### M3 — MONOTONY, zh-hant — CHANGED

- Short sentences: 「駕照直接吊銷。」「沒有肇事，同樣成罪。」「這是乘客自己的行政罰。」「移置保管與沒入不同。」「過失犯罪及緩刑例外。」 (five of 33). The semicolon chains in the refusal and first-violation paragraphs were split.
- Contrast templates, by reading: two remain in the body (「移置保管與沒入不同」, 「交完錢不代表就能搭機」) and none in the headings. Removed or restated: 「拒測不是把事情留到以後再說」 (deleted; it answered a claim the reader had not made), 「是吊銷而不是吊扣」→「駕照也是直接吊銷」, 「不能把「沒有撞到人」當成只有罰單的保證」→「沒有肇事，同樣成罪。」, 「…不是替駕駛分攤刑責」 (clause deleted), heading 「車被拖走不等於沒入，繳了錢也不等於能出境」→「車輛沒入、限制出境與居留，各看各的條文」.
- A reader's question was added (「乘客說「不知道他有喝」，有用嗎？」). The opening paragraph is kept as the reviewer asked.

### M4 — MONOTONY, ko — CHANGED

- Stock opener removed. As in ja, I did not keep a relabelled scene (batch scene share). ko opens on the reader's question: 「대만에서는 술을 마시지 않은 동승자에게도 음주운전 과태료가 나올까요? 나올 수 있습니다.」 ko and ja no longer share an opening type. This paragraph is also the citation-free paragraph the reviewer asked for.
- The six-number sentence was split into three (the two thresholds; age and amount; the exemptions).
- Citations: 행정벌법 제7조, 형법 제185조의3, 행정벌법 제26조 and 형법 제95조 are now inside their sentences (as the basis or the subject), and 조례 제35조 제4항·제9항 opens its sentence. Sentences ending on a parenthetical citation: 8 of 35.
- 「정지가 아니라 취소」 (twice) was restated positively; one deliberate contrast remains (「차량 보관은 몰수가 아닙니다」). 「다만」 no longer opens a sentence.
- The contact sentence now ends 「보내시면 됩니다」 so the body is 합니다체 throughout.

### C1 — unlinked repeat citations (minor) — CHANGED

- The first 제67조 / art. 67 mention is linked to the dated in-force page in ko and en; ja and zh-hant already carried it inside the linked label (「…35条4項・9項、67条」, 「…第35條第4項、第9項及第67條」).
- en defines the short form once: 「…of the Road Traffic Management and Penalty Act (the Traffic Act)」. 「the traffic statute」 is gone from the body and the FAQ.
- Not done: I did not link every later 「조례 제35조」 / 「處罰條例35条」 mention. Each one sits in a paragraph or section that already links the same dated page, and the sources list labels that page with both articles.

### V1 — ja 「没入」 (minor) — CHANGED

- 「重傷・死亡事故では行政機関が車を取り上げる処分（沒入）ができ（處罰條例35条9項）」. 得, serious injury or death and the article are unchanged.

### V2 — zh-hant 「駕駛測得上述刑事數值門檻」 (minor) — CHANGED

- 「駕駛的酒測值達到前面的刑事門檻」. The 0.25 mg/L or 0.05% trigger is unchanged.

### Reviewer's own minor edits 1–5 — KEPT

en 「as of October 6」, 「at or above 0.15 mg/L」, 「0.05% or more」; ja 「自動車運輸業」 and the summary's 「車両の没収」 are all still in place.

## Reviewer suggestions not followed as written

- M2 / M4: keep the opening scene with the label moved behind it. Not followed, for the batch reason above. The result still meets what the item asked for: no stock opener, and no unlabelled hypothetical, because there is no hypothetical.
- L2 example wording 「측정을 거부한 운전자가 낸 사고도 같습니다」: I wrote 「그런 사고를 내도」 so that it points back to the serious-injury-or-death accident rather than to any accident.

## Other changes made while editing

- ko: 「만 18세」「만 70세」 → 「18세」「70세」 in the body and FAQ (length; the statute's 年滿 is full age either way).
- ko: 「음주측정을 거부하면」 → 「측정을 거부하면」 under the heading 「측정 거부는…」 (length).
- en: the internal link moved onto the statutory sentence (「bar a defendant from leaving Taiwan」 → /en/columns/taiwan-exit-ban-foreigners); the separate "See also" sentence was cut for the word budget.
- en: the Immigration Act citation moved to the front of its sentence so that 「Negligent offenses and suspended sentences are excepted.」 stands alone.
- Frontmatter: only the ko summary (L1), the ko FAQ ages and the en FAQ short form changed. title, seoTitle, topic, featured_image, audience, author, categories, tags, dates and read_time are as they were. One FAQ per file; each answer restates body facts only.

## Facts removed as unverifiable

None in this round. Every legal statement in the four versions was already matched to an official text in round 1 and by the Fable review, and the passages touched by L1 and L2 were re-opened today.

Not facts, but removed: the ko and ja opening hypotheticals and the zh-hant rhetorical contrasts listed under M3. The round-1 removals stand (「법무법인 호정」; en 「including scooters」; the 入出國及移民法 第36條 / 第18條 "other removal grounds" reading; en 「Paying money does not restore a suspended license」); details are in drafts/G1/facts.md.

## Self-check (SENTENCE-VARIETY-RULE section 5)

1. Checker: no FAIL and no WARN in any of the four files (table above).
2. Openings: ko question, ja number, en and zh-hant a concrete result. None uses 가령 / 例えば…とします / Suppose / 假設. In this batch G2 opens on a common misconception and G3 and G4 on a scene; G1 uses neither.
3. Very short sentences: ko 6, ja 9, en 6, zh-hant 5.
4. Paragraph openers: the only repeat is 「運転」 twice in ja.
5. No run of three claim–(statute)–caveat paragraphs. Each file has a citation-free paragraph besides the contact line (ko, en and zh-hant: the opening; ja: the question under the first heading).
6. Contrast templates by reading: ko 1, ja 1 in the body plus the first heading, en 1 in the body plus the last heading, zh-hant 2. None rebuts a claim the reader did not make.
7. The last body paragraph in each file is the one-sentence contact line, tied to this column's facts (date of the stop, the reading, residence status). No copied disclaimer and no sales line.
8. ko 합니다체 and ja です・ます throughout. No bold, no emoji, no invented first person, no imperative or checklist heading.
9. Numbers, article numbers, links, the "as of October 6, 2026" labels and the pending-amendment sentence are all present in each language.

## Left for the final reviewer

- Recheck the history page on the ship date. If the Executive Yuan has set a commencement date for the 2026-08-17 amendment, the fines, the forfeiture wording, the 第67條 periods and the links all change.
- The 第85條第3項 presumption is still stated from the statute with a hedge; no court decision applying it to a passenger was opened.
- Voice in ja, en and zh-hant is my own reading as a model, not a native speaker's or a lawyer's review.
