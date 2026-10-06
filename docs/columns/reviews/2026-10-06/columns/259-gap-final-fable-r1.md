# G2 final review — Claude Fable 5.1 (rework round, sentence-variety rewrite, 2026-10-06)

Slug: taken-taiwan-police-station-first-24-hours-not-release

## Verdict

PASS — ko, ja, en and zh-hant are publishable as they now stand; image OK. No major issue. No fact, condition, exception, period, number, article or source URL was lost against the r1 PASS reference. Variety checker: no FAIL in any language; no unmet self-check item that reaches the two-item threshold. Two minor wording edits applied by me (one ja, one en); lint and the variety checker stay OK after them.

This is a model review. It is not a lawyer review or a native-speaker review, and no file says otherwise.

## MUST VERIFY

topics/G2.md has no "## MUST VERIFY" section. There is no numbered item to report.

## Scope checked

Read in full: brief-BATCH.md, brief-EDITORIAL-VOICE.md, COLUMN-VOICE-RULE.md, THREADS-VIRAL-BRIEF-20261005.md (style reference only), SENTENCE-VARIETY-RULE.md, LESSONS.md, topics/G2.md, topics/LINKS.md, drafts/G2/{ko,ja,en,zh-hant}.md, drafts/G2/facts.md, research/G2-statutes.md, reviews/G2/{check-grok.md, fix1-notes.md, REWORK.md, REWORK-REVIEW.md}, reviews/G2/r1-pass/final-fable-r1.md, the r1 reference backups/G2-r1-pass-20261006-1303/drafts-G2/{ko,ja,en,zh-hant}.md, and images/G2.webp (opened).

Official sources re-opened by me on 2026-10-06 (raw HTML fetched from law.moj.gov.tw, article lines extracted by script and compared with research/G2-statutes.md after whitespace normalisation):

- 刑事訴訟法 (pcode C0010001) 第27, 31, 31-1, 41, 43-1, 71-1, 89, 93, 93-1, 93-2, 93-3, 93-5, 95, 99, 100-2, 101, 101-1, 101-2, 110, 114, 245條 — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=N — every line of every article is in the research file word for word (0 lines not found). Footer on each page: 法規整編資料截止日：民國 115 年 09 月 24 日.
- 中華民國刑法 第185-3條 — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=185-3 — matches.
- 刑事訴訟法 沿革 — https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=C0010001 — header 修正日期 民國 115 年 05 月 13 日; entry 55 「中華民國一百十五年五月十三日總統華總一義字第 11500042671 號令修正公布第 101-1 條條文」; entry 54 is 114年11月11日 (第116-2、205-2條 修正, 第205-3、205-4條 增訂). No later amendment touches a cited article. (History entries read through WebFetch, which answers through a model; the header date and the two entry dates were also seen in the raw HTML.)

No judgment is cited in any version; research/judgments/ is correctly empty.

Also checked: frontmatter and sources section of each language are byte-identical to the r1 reference (script); every body link of r1 is still in the body (ko 21, ja 21, en 23, zh-hant 22; none dropped, none added); digit strings compared (en: one "93" became "same article", two "24" added in "hour 24" and "reach 24 hours"; zh-hant: one "24" replaced by the quoted 「二十四小時」 and one 第93條 link added in the opening; ko, ja: no change); the en version is still consistent with published en columns 032 and 033 on the 24 hours, the 6-hour and 4-hour exclusions and the 8 + 4 + 2 month limits; internal link targets exist (031 in all four languages, 032 and 033 in en; lint OK); the opening lines of G1, G3 and G4 in drafts/ (for the batch opening-type check).

Not done: a side-by-side comparison with the last three published columns per language for a repeated template (editorial-voice procedure step 2); only the batch columns and the linked columns were looked at.

## 1. Law and facts (all four languages)

Every legal sentence was read against the article text. All correct; the four versions do not contradict each other.

- 第93條第2、3項: 24 hours from 拘提 or 逮捕 is the prosecutor's deadline to apply for 羈押; no application → release at once, with 具保/責付/限制住居 possible where a detention ground exists and an application is unnecessary. Correct in all four (zh-hant names all three measures and the 無聲請必要 condition; ko, ja 「등 / など」; en "bail or a residence restriction").
- 第93條第5、6項: timely application → court questioning, not release; application received in 深夜 (11 p.m. to 8 a.m.) → questioned in the daytime of the next day. Correct.
- 第93-1條: interpreter wait up to 6 hours, counsel wait up to 4 hours, marked as examples (등 / など / "eight kinds … including" / 「八種，例如」); 在途解送 (zh-hant); no questioning during those periods; no unnecessary delay. Correct; "eight" matches the eight items.
- 第71-1條 (zh-hant only): attending on a police notice is not yet 拘提 or 逮捕. Correct.
- 第89條, 第95條第1、2項, 第100-2條, 第245條第2項, 第99條, 第41條第2、3項 with 第43-1條: correct, including who designates the relative or friend, the "already retained / unless agrees to continue" pair, and 附記.
- 第31條第5項 (no nationality-based rule; disability and indigenous status), 第95條第1項第3款 (legal aid for those eligible), 第31-1條第1項 ("in principle"; proviso signalled, not misstated). Correct.
- 第101條第1項 three-part test, judge decides after questioning; en "Foreign nationality is not itself a listed ground" is an accurate textual statement. 第101-1條 as a separate ground with fraud (第7款) and 刑法第185-3條 (第1款) on the current list. Correct.
- 第110條第1項, 第114條 (3 years, 5 months, 2 months; exception flagged by "누범 등 제외 / 累犯などを除く / repeat offenders and others excepted / 累犯等除外"), 第101-2條後段. Correct.
- 第93-2條第1項 (own grounds; 拘役/專科罰金 proviso scoped to that article), 第93-3條第1、2項 (8 months; court extension twice, up to 4 then up to 2 months; trial stage separate), 第93-5條第1項. Correct.
- 第27條第2項: spouse, parent, sibling may retain counsel independently. Correct.
- zh-hant opening quotation 「應自拘提或逮捕之時起二十四小時內」 is verbatim from 第93條第2項.
- Time marker (2026년 10월 현재 / 2026年10月時点 / As of October 2026 / 截至2026年10月) in the opening and FAQ of each version; check date 2026-10-06 in the sources section and the closing line.

## 2. Comparison with the r1 PASS reference (rework check a)

Result: nothing dropped or changed in meaning in any language.

- Frontmatter (title, seoTitle, summary, FAQ, topic, featured_image, audience, author): identical.
- Sources section (20 刑事訴訟法 articles, 21 in zh-hant with 第71-1條; 刑法第185-3條; 沿革 page; check date; general-information line): identical.
- Body: every r1 statement is present with its conditions and numbers — 24 hours and its starting point; release duty and the alternatives; hearing instead of release; 11 p.m.–8 a.m.; 6 hours / 4 hours as examples; no questioning, no unnecessary delay; 第89條 notice; 第95條 notice and the stop rule with its exception; police stage; counsel's attendance and its statutory limit; interpreter; record read/shown/appended; no foreigner-based appointed lawyer, legal aid, appointed counsel at the detention hearing in principle; 第101條 elements; 第101-1條; 第110條, 第114條 (3 years, 5 months, 2 months, exception flag), 第101-2條; exit restriction (own grounds, 拘役/fine proviso under 第93-2條, 8 months, two extensions of up to 4 and up to 2 months by the court, trial stage separate, application to lift or change); 第27條; contact line. en keeps "eight kinds", "Foreign nationality is not itself a listed ground", "at any time", "take notes and state opinions", and both internal links; zh-hant keeps 第71-1條, 在途解送, 責付, 拘役或專科罰金, 隨時.
- Recast legal sentences (listed in fix1-notes.md) keep their force: duties stay duties (해야 합니다 / なければなりません / must / 應·要), 得 stays "may".
- No version had a hypothetical in r1 and none has one now; there is no hypothetical label to keep.
- Removed, and correctly so: en "What happens next depends on the case.", zh-hant 「後續每件都不一樣。」, ko lead-in 「상담이 필요하면」 — formula wording, not facts.

## 3. Sentence variety (rework check b)

Checker lines (python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check … --lang …), final state after my two edits:

- drafts/G2/ko.md [ko] sentences=36 mean=29.7 cv=0.494 short=0.167 run3=0.0 opener_rep=0.0 cite_end=0.306 cite_para=0.714 contrast=0 caveat=0 q=1 — OK, no variety limit violated
- drafts/G2/ja.md [ja] sentences=34 mean=32.2 cv=0.46 short=0.206 run3=0.0 opener_rep=0.0 cite_end=0.0 cite_para=0.714 contrast=0 caveat=0 q=0 — OK, no variety limit violated
- drafts/G2/en.md [en] sentences=43 mean=17.9 cv=0.592 short=0.233 run3=0.0 opener_rep=0.143 cite_end=0.256 cite_para=0.714 contrast=0 caveat=0 q=2 — OK, no variety limit violated
- drafts/G2/zh-hant.md [zh-hant] sentences=39 mean=28.5 cv=0.568 short=0.128 run3=0.027 opener_rep=0.0 cite_end=0.282 cite_para=0.857 contrast=0 caveat=2 q=2 — OK, no variety limit violated

Checker blind spot confirmed by reading: ja inline citations are written 「93条」 without 第, so cite_end shows 0.0. Counted by hand, 13 of the 34 ja sentences (38%) end in a statute parenthesis, 「（同条）」 included (under the 45% limit) and no paragraph has more than two such sentences in a row.

Self-check items 2–7 (SENTENCE-VARIETY-RULE.md section 5), read by me, not taken from the editor's notes:

2. Opening — met. ko: a common belief (「…24시간 뒤에 풀려난다는 말은 절반만 맞습니다.」, paid off by 「맞는 절반입니다.」). ja: an assertion with an image (「…止まることのある時計です。」). en: a short assertion ("…belongs to the prosecutor."). zh-hant: the statute's own words. None is a stock hypothetical or a generic intro, and none is a scene (G3 and G4 of this batch open on scenes; G1 on a question, a number and plain facts).
3. Very short sentences — met (ko 6, ja 7, en 10, zh-hant 5); long sentences do not run back to back.
4. Paragraph openers — met; no word opens three paragraphs in any language (en: "Article" twice, "A" twice after my edit).
5. Claim–(statute)–caveat — met. In each language the paragraphs that still have that shape are the 第93條 paragraph, the 第95條 paragraph and the 第110/114條 paragraph; they are not consecutive and are a minority of the thirteen body paragraphs. Each language has a citation-free paragraph (the wall-clock line; plus the opening in ko, ja, en).
6. Contrast templates — met. Body count 0 by the checker; by reading, one deliberate contrast in each opening (not a release time but a filing deadline), which is the premise of the column and of its slug, not a rebuttal of something the reader did not say.
7. Closing — met. The last body paragraph is the 第27條 sentence; after it only the single contact line, the sources section and the single general-information line.

No MONOTONY item to report.

Stated plainly: the column is still statute-dense (about 70% of paragraphs carry a link), which the short format with twenty articles makes hard to avoid. The rhythm, the citation positions and the openings now vary enough that it no longer reads as one repeated sentence frame. Rule 2-8 (at most two numbers in the first two sentences) is not fully met in ko, ja and en because lane rule 10 requires the as-of date next to the 24-hour figure; the SPEC wins and 2-8 is not one of the section 6 threshold items.

## 4. Issues

Format: Original → problem & reason → fix (applied or required) → facts preserved.

1. ja, 第93-1條 sentence — 「[93条の1]によれば、通訳を待った時間は6時間まで、弁護人の選任を申し出て待った時間は4時間までなどが計算から外れます。」 → 「〜は4時間までなどが外れます」 is clumsy Japanese (two 「は…まで」 clauses hung on 「などが」) → applied: 「[93条の1]では、通訳を待った時間（6時間まで）、弁護人の選任を申し出て待った時間（4時間まで）などが計算から外れます。」 → both caps, the examples marker 「など」, the link and the article number unchanged; now parallel with the FAQ wording. Length stays 1,399; ja cv 0.471 → 0.46 (limit 0.45, still OK).

2. en, 第27條 sentence — "Overseas, a spouse, parent or sibling may independently retain a defense lawyer in Taiwan for the person" → the fronted "Overseas," reads oddly → applied: "A spouse, parent or sibling overseas may independently retain a defense lawyer in Taiwan for the person" (the r1 wording) → same persons, "independently", link and article unchanged; 798 words; paragraph opener "A" now twice (limit two).

Non-blocking observations (no change required for publication):

3. ko 「그 안에 청구해야 하고」 and ja 「その間に請求し」 (第93條 paragraph) — after the rewrite the preceding sentence is about the starting point (「시계는 … 갑니다」 / 「起点は … です」), so the pronoun leans on the heading and the opening for "24 hours". Clear in context; ko is 2 characters and ja 1 character under the cap, so I left it.

4. all four, 第114條第1款 exception — "누범 등 제외" and equivalents remain compressed; the "others" include a person detained under 第101-1條第1項, the ground the preceding paragraph illustrates with drunk driving. Nothing false is stated. Carried over from r1; naming the exception would add legal content and needs a matching cut.

5. Length margins are thin (ko 1,398 / 1,400; ja 1,399 / 1,400; en 798 / 800; zh-hant 1,385) and ja cv is 0.46 against a 0.45 floor. Any later edit must re-run lint and the checker.

6. en subject overlap with published column 033 remains (same angle difference as noted at r1; consistent on law; links to 033 and 032).

## 5. Citations and rules

- Inline links sit next to the claims; every statute link is the single-article URL for the article named; "(같은 조) / （同条） / (same article)" back-references follow a linked 第93條 in the paragraph above. Sources section is the last ## heading, lists every cited article plus 刑法第185-3條 and the 沿革 page, with the check date in the page's date format.
- No judgment, private-party name, invented case, statistic, quote, first-person story or hypothetical. No bold, emoji, phone number, messenger ID or street address. One contact line with the firm name and wei@hoveringlaw.com.tw, asking for a non-confidential outline. author is legal-ai-assistant. No lawyer-review or native-review claim. No Korean, Japanese or US law statement (ja 「勾留に近い身柄拘束」 is a gloss).
- Frontmatter unchanged from r1 and within the brief's limits (en seoTitle 36 characters, en summary within 150–160; one FAQ per language, consistent with the body).
- Lint (python3 lint.py … taken-taiwan-police-station-first-24-hours-not-release), final: ko OK 1,398 · ja OK 1,399 · en OK 798 words · zh-hant OK 1,385.

## 6. Voice

- ko: 합니다체 in every sentence, no 해라체; 「시계는 … 갑니다」「맞는 절반입니다」「늘 풀려나지는 않습니다」 give it a spoken pace without slang.
- ja: です・ます throughout; one real question (「保証金を納めれば出られるのでしょうか。」); glosses for 拘提 and 羈押 kept.
- en: plain and active; "A court hearing comes next. Release does not." and "Release is not permission to fly home." carry the points without filler.
- zh-hant: Taiwan usage (警局、通譯、筆錄、具保、責付、限制住居); everyday 要 in place of stacked 應 where the sentence explains a duty, statute-style 應 kept where it quotes one; no simplified characters or mainland terms.
- Titles are specific and unchanged; headings state a fact or a question; no checklist heading, no signpost sentence, no sales close.

## Minor edits applied

- ja.md: 第93-1條 sentence reworded (issue 1).
- en.md: 第27條 sentence restored to the r1 word order (issue 2).
- ko.md, zh-hant.md: not edited.

## Image verdict

OK. images/G2.webp (unchanged from r1) shows an empty pale wooden bench with a glass of water against a plain plaster wall and a patch of afternoon light on a terrazzo floor. It reads as a quiet waiting space and fits the theme of waiting out the hours. No people, faces, text, logos, flags, uniforms, documents or screens; nothing identifies a real place or case; respectful.

VERDICT: PASS
