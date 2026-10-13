# G7 final review — Claude Fable 5.1, round 1 (2026-10-12 KST)

Slug: taiwan-summons-defendant-witness-warrant-wanted-notice. Files reviewed: drafts/G7/ko.md, ja.md, en.md, zh-hant.md (state after fix round 1), drafts/G7/facts.md, research/G7-statutes.md, reviews/G7/check-grok.md, reviews/G7/fix1-notes.md, images/G7.webp. Briefs read in full: brief-BATCH.md, brief-EDITORIAL-VOICE.md, COLUMN-VOICE-RULE.md, SENTENCE-VARIETY-RULE.md, LESSONS.md, THREADS-VIRAL-BRIEF-20261005.md (style reference only), topics/G7.md.

## Verdict

PASS. All four languages are publishable as they stand (one minor Japanese wording edit applied by me, listed below). Image OK.

## Scope checked

1. Law and facts. Every article cited in the columns was re-opened by me on 2026-10-12 as a single-article page on law.moj.gov.tw (刑事訴訟法 pcode C0010001): Arts. 71, 71-1, 72, 75, 76, 77, 78, 84, 85, 87, 175, 176, 176-1, 178, plus the amendment history page. The live text is identical to research/G7-statutes.md Part 2. Every statement in the four versions was matched sentence by sentence against the article text (conditions, 得/應, who signs, who executes, both limbs of Art. 72, all four items of Art. 76, all three paragraphs of Art. 87, paras. 1–4 of Art. 178, the 24-hour rule and its exception in Art. 175 para. 4). No judgment, statistic, case number or foreign-law rule is cited anywhere. The amendment line (latest entry 55: 中華民國一百十五年五月十三日 … 修正公布第 101-1 條條文 = 13 May 2026, Art. 101-1 only) is correct in all four versions and none of the cited articles is touched by it. Arithmetic: only the NT$30,000 ceiling and the 24-hour rule; both match. The four versions do not contradict each other on any point of law; zh-hant alone adds the Art. 176 cross-reference (witness summons quasi-applying Art. 72), which is correct and does not conflict with the other three.
2. Citations. Inline links sit right after the claims and point to the correct single-article URL in all four versions (checked each flno against the claim). Sources section is the last `##` heading in each file, lists every article used (zh-hant additionally lists Art. 176, which it cites), plus the history page, with the check date 2026-10-12 in the page's date format. Internal links: /<lang>/columns/taiwan-criminal-witness-summons-refuse-testimony (401) and /<lang>/columns/taken-taiwan-police-station-first-24-hours-not-release (259) exist in ko, ja, en and zh-hant per topics/LINKS.md lines 238 and 284; lint confirms.
3. Rules. No private-party names, no invented cases, statistics or quotes, no first-person case stories. The ko and en openings are hypothetical and labeled in-sentence (「(가상의 상황입니다)」 / "(an invented scene)") with no real names; ja and zh-hant open with the statutory wording and contain no scene. Grep for bold (`**`, `__`, `<b>`, `<strong>`), emoji, phone-number patterns, LINE/Kakao and lawyer/native-review claims: no matches. Contact: one soft paragraph per language, firm name + wei@hoveringlaw.com.tw only, no street address, non-confidential outline suggested. author: "legal-ai-assistant" in all four. Foreign law: none stated. Frontmatter: en title 82 chars so seoTitle required and present (36 chars, ≠ title); en summary 158 chars, no banned characters, no ellipsis, no URL; ko/ja/zh-hant seoTitle 19/16/14 chars and ≠ title; one FAQ each, answers consistent with the body (may-language, lawful summons, justified reason, NT$30,000 ceiling with the as-of date, the "not confirmed abroad" caveat). Lint OK on all four: ko 1390, ja 1398 (after my edit), en 718 words, zh-hant 1063.
4. Voice. See per-language notes below. No checklist/imperative headings (there are no body headings), no generic intro, no AI filler, no sales tone, no moralising.
5. Image. See image verdict.

## MUST VERIFY (topics/G7.md)

MUST VERIFY 1: CONFIRMED — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=178 ; https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=175 ; https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=71 — Live Art. 178 para. 1: 「證人經合法傳喚，無正當理由而不到場者，得科以新臺幣三萬元以下之罰鍰，並得拘提之；再傳不到者，亦同。」 Art. 175 para. 2 item 4: 「無正當理由不到場者，得處罰鍰及命拘提。」 Art. 71 para. 2 item 4: 「無正當理由不到場者，得命拘提。」 The text must say: witness summons warns of fine plus compulsory production, defendant summons warns of compulsory production only; the fine ceiling is NT$30,000 or less under Art. 178 (not printed in the summons wording), both consequences as "may", conditioned on lawful summons and no justified reason. All four versions say exactly this: ko 「과태료(罰鍰)를 물리고 구인을 명할 수 있다는 문구」 vs 「구인(拘提)…을 명할 수 있다는 문구」, 「3만 대만달러 이하(2026년 10월 기준)의 과태료를 물릴 수 있고 구인도 가능하며」; ja 「不出頭の一文に過料（罰鍰）が加わります」, 「3万台湾ドル以下（2026年10月時点）の過料を科すことができ、拘提もできます」; en "compulsory production alone, or a fine plus compulsory production", "may be fined up to NT$30,000 (as of October 2026) and may also be brought in"; zh-hant 「得命拘提」 vs 「得處罰鍰及命拘提」, 「得科新臺幣三萬元以下罰鍰（截至2026年10月），並得拘提」. The zh-hant summary places the ceiling on the fine, not inside the summons wording (corrected in fix round 1; verified).

MUST VERIFY 2: CONFIRMED — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=76 — Live text: 「被告犯罪嫌疑重大，而有下列情形之一者，必要時，得不經傳喚逕行拘提：一、無一定之住、居所者。二、逃亡或有事實足認為有逃亡之虞者。三、有事實足認為有湮滅、偽造、變造證據或勾串共犯或證人之虞者。四、所犯為死刑、無期徒刑或最輕本刑為五年以上有期徒刑之罪者。」 The text must say: serious suspicion AND any one of the four items AND "when necessary", with item 2 covering actual flight or facts indicating a risk of flight, item 3 covering destruction/forgery/alteration of evidence or collusion with accomplices or witnesses on facts, and item 4 describing the offence's statutory punishment. All four versions present the items as alternatives with 必要時: ko 「다음 넷 중 하나가 있으면, 필요한 때」; ja 「次のいずれかがあり、必要なときは」; en "when necessary, in any one of four situations"; zh-hant 「有下列情形之一，必要時」. Items 2–4 are complete in every language (checked each limb).

## Issues

No major issue found. Items below are the only observations; none changes a fact.

1. Original (ja, Art. 87 paragraph): 「利害関係人も、自ら逮捕して両者に引き渡すか、逮捕を求めることができます。」 → Problem & reason: 「両者に引き渡す」 reads as "hand over to both", whereas Art. 87 para. 2 is 「送交檢察官、司法警察官」, delivery to a prosecutor or a judicial police officer; the sentence before names both ranks, so a pronoun pointing to "either of them" is the natural reading. → Fix (applied): 「自ら逮捕してそのいずれかに引き渡すか」. → Facts preserved: Art. 87 link, the two alternatives (deliver / request arrest), the ranks named in the previous sentence. Lint after edit: OK, 1398 chars; variety: OK.

2. Observation, no change (en): "a district prosecutors office" without an apostrophe matches the English naming used by Taiwan's district prosecutors offices; left as is.

3. Observation, no change (zh-hant only): the Art. 176 cross-reference (witness summons quasi-applying Art. 72) appears only in zh-hant. It is correct (live text 「第七十二條及第七十三條之規定，於證人之傳喚準用之。」), is listed in the zh-hant sources, and its absence from the other three versions is an omission for length, not a contradiction. Acceptable.

4. Observation, no change (ja, en): the body contains no reader question (variety q=0). The rule allows 0 with a reason: both versions open on the statutory warning / an invented scene and move straight to the split, and the checker and all other self-check items are met. Not a monotony item.

## Minor edits applied

- ja.md: 「両者に引き渡すか」 → 「そのいずれかに引き渡すか」 (item 1 above). No other file edited.

## Voice per language

- ko: Natural 합니다체 throughout, no 해라체. Opening is a one-line labeled scene followed by the reader's actual question (「나가지 않으면 어떻게 될까요?」) and the answer; it is the only scene-type opener in the ko batch (G1–G10 checked). Terms are glossed on first use (소환장(傳票), 구인(拘提, 강제로 데려오는 처분), 과태료(罰鍰), 지명수배(通緝)). Title names the split and is not imperative. Last body paragraph ends on this column's facts (kind of paper and its date).
- ja: です・ます throughout (checker: no だ・である). Opens with the statute's own line, then explains it; the only quotation-type opener in the ja batch. 「急迫の場合は別です」「警察が使うのは通知書です」 are good short sentences. Contact line is a plain "you may send", not a pitch.
- en: Plain and active. "Witnesses owe their attendance." "Sometimes there is no summons at all." give rhythm. The one contrast-shaped line Grok flagged ("not one document with one meaning") is gone; contrast count 0. Title specific, not a listicle.
- zh-hant: Taiwan usage only (地檢署, 罰鍰, 拘票, 聲請, 筆錄, 日費); no simplified characters, no mainland terms, no 官腔 stacking of 應/必須. 「被告呢？」「警察用的是通知書。」「有些情形連傳喚都免了。」 read as a Taiwan practitioner writing to a general reader. Title restored the condition so it is not broader than the body.

## Sentence variety (SENTENCE-VARIETY-RULE sections 5–6)

Checker (variety_metrics.py check), all OK, no FAIL or WARN:
- ko: sentences 30, cv 0.559, short 0.10, run3 0.0, opener_rep 0.0, cite_end 0.333, contrast 0, caveat 0, q 1
- ja: sentences 33, cv 0.525, short 0.182, run3 0.129, opener_rep 0.091, cite_end 0.303, contrast 0, caveat 0, q 0
- en: sentences 33, cv 0.655, short 0.121, run3 0.129, opener_rep 0.182, cite_end 0.303, contrast 0, caveat 0, q 0
- zh-hant: sentences 29, cv 0.789, short 0.241, run3 0.074, opener_rep 0.0, cite_end 0.31, contrast 0, caveat 0, q 1

Self-check items: (2) no stock opener (가령/例えば…とします/Suppose/假設) in any version; opening types do not repeat within the batch in the same language (ko and en scene openers are the only ones of their type; ja and zh-hant quotation openers are unique in their language, zh-hant G2 also quotes a statute but that is 2 of 10). (3) ≥2 very short sentences in every version (ko 3, ja 6, en 4, zh-hant 7). (4) Paragraph first words read vertically: no word appears three times in any version. (5) No three consecutive claim-(statute)-caveat paragraphs (caveat 0); every version has at least one paragraph without a citation (opening / not-confirmed / contact). (6) Contrast templates 0; no rebuttal of a claim the reader never made. (7) Last body paragraph ends on this column's facts; the contact sentences differ across the four languages and the general-information line is one sentence after the sources. (8) ko 합니다체, ja です・ます throughout. (9) No fact, number, citation or hypothetical label lost in fix round 1 or in my edit (compared against check-grok.md items 1–10 and the live articles).

MONOTONY: none.

## Image verdict

OK. images/G7.webp (16:9, landscape): a closed grey metal courtyard gate in a weathered concrete wall, a terracotta pot with a plant, vines, damp pavement, overcast sky. No faces, people, text, numbers, logos, flags, documents or screens; no police, courtroom or violence; not a recreation of any identifiable case; calm editorial tone fitting a column about a summons that goes unanswered. Not among the site's listed existing motifs.

## Provenance of this review

Reviewer: Claude Fable 5.1 (a model). No lawyer or native-speaker review is claimed. Files changed by this review: drafts/G7/ja.md (one wording edit) and this log.
