# G9 fix1 notes — Claude Opus 5.5 (editor), 2026-10-12

Slug: taiwan-criminal-appeal-twenty-days-third-instance-barred. Files edited: drafts/G9/{ko,ja,en,zh-hant}.md, drafts/G9/facts.md, research/G9-statutes.md (Part 4 appended). No judgment is cited, so nothing was saved under research/judgments/. No lawyer or native-speaker review is claimed; the voice edits are a model's.

How the sources were opened: every article below was fetched from law.moj.gov.tw on 2026-10-12 with fetch-law.py (official LawAll pages, exact text) and the five MUST VERIFY articles were also opened as single-article pages with WebFetch. The amendment history page was fetched the same day.

## MUST VERIFY

MUST VERIFY 1: CONFIRMED — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=376 — Para. 1 bars a third-instance appeal after a second-instance judgment for nine items: (1) 最重本刑為三年以下有期徒刑、拘役或專科罰金之罪; (2) 刑法第277條第1項 injury; (3) 第320條、第321條 theft; (4) 第335條、第336條第2項 embezzlement; (5) 第339條、第341條 fraud; (6) 第342條 breach of trust; (7) 第346條 恐嚇罪; (8) 第349條第1項 receiving stolen property; (9) 毒品危害防制條例第10條第1項 (using first-grade narcotics) and 第11條第4項 (possessing 20 g or more, pure net weight, of second-grade narcotics). Proviso: where the second instance sets aside a first-instance judgment of 無罪、免訴、不受理 or 管轄錯誤 and convicts, 被告或得為被告利益上訴之人 may appeal. Para. 2: after such a proviso appeal, a judgment given after the third instance sets aside and 發回原審法院 or 發交其他第二審法院 cannot be appealed to the third instance. All four versions now say this: "three years or less", the article-numbered slices for injury, embezzlement and fraud, the two named drug offences, all four judgment types, "the defendant or a person who may appeal for the defendant's benefit", and both remand and transfer limited to a proviso appeal. Removed: "basic fraud / 단순 사기 / 単純な詐欺 / 普通詐欺", "some drug offences", the unconditional "cannot appeal" openings and summaries, and the general "a remanded case cannot be appealed again".

MUST VERIFY 2: CONFIRMED — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=361 and https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=382 — Art. 361 para. 3: 「上訴書狀未敘述上訴理由者，應於上訴期間屆滿後二十日內補提理由書於原審法院。逾期未補提者，原審法院應定期間先命補正。」 Art. 382 para. 1: 「上訴書狀應敘述上訴之理由；其未敘述者，得於提起上訴後二十日內補提理由書於原審法院；未補提者，毋庸命其補提。」 All four versions now say must (應) for the second-instance brief, followed by the original court's correction order, and may (得) for the third-instance brief, with "the court does not order supplementation" in the same passage. Removed: "can / may / 補えます / 보충할 수 있어서" for Art. 361.

MUST VERIFY 3: CONFIRMED — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=344 and https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=3 — Art. 344 para. 1 gives the appeal to 當事人; Art. 3: 「本法稱當事人者，謂檢察官、自訴人及被告。」; Art. 344 para. 3: 「告訴人或被害人對於下級法院之判決有不服者，亦得具備理由，請求檢察官上訴。」 All four versions say the appeal belongs to the parties (prosecutor, private prosecutor, defendant), that a complainant or victim cannot appeal directly, and that the request concerns a lower court's judgment and needs reasons. No deadline for the request is stated (the article sets none).

## Facts removed

- "About 40 days from service" (ko 최대 40일 안팎, ja 最長でおよそ40日, zh 最長大約四十日): removed in all four. No article states it; it was a sum of two periods and could be read as time to file the appeal.
- "Basic fraud" labels and "some drug offences": replaced by what Art. 376 names (see MUST VERIFY 1).
- The Supreme Court as the destination in FAQ 2 (ko 대법원, ja 最高裁判所, en Supreme Court): replaced by "third instance". Art. 375 does send appeals from High Court judgments to 最高法院 (read, text in research Part 4), but the column now also covers summary judgments, whose second instance is a district-court bench, and it does not discuss a third instance for those.
- en "jail": replaced by "prison (監獄) or detention center (看守所)".
- ja 懲役 and 拘留 for Taiwan penalties: replaced by the statute's 有期徒刑 and 拘役.
- Nothing else was removed as unverifiable. Arts. 349, 350, 351, 358, 3, 344, 377 stay in all four languages; Arts. 352 and 362 stay in en and zh-hant, where the drafts had them.

## Facts added (each opened on law.moj.gov.tw; texts appended to research/G9-statutes.md Part 4)

- Code of Criminal Procedure Art. 65 and Civil Code Art. 120 para. 2: the service day is not counted.
- Art. 455-1 paras. 1–3 and Art. 451-1: summary-judgment appeals go to the district court's collegiate bench, Art. 361 is not applied, and a sentence imposed on an Art. 451-1 request cannot be appealed. The one-clause description of Art. 451-1 follows its paras. 1 and 3 (the prosecutor's request rests on the sentence the defendant said they would accept).
- Criminal Code Art. 339-4: aggravated fraud is not in the Art. 376 list (item 5 names only Arts. 339 and 341; Art. 339-4 carries one to seven years, so it is not inside item 1). The drafts' "basic fraud" was trying to say this; the column now says it directly and says nothing about whether such a case will be accepted by the third instance.
- Standards Art. 3 item 3: all seven regions, including Antarctica 72 days, in all four languages.

## check-grok.md FACTS

1. Art. 376 list too broad, opening and summaries absolute → fixed in all four bodies, summaries and FAQs as in MUST VERIFY 1. en now says "heaviest penalty is imprisonment of three years or less". ko and ja give article numbers for embezzlement and fraud and leave theft, breach of trust, extortion and receiving stolen property as names (the reviewer allowed that); en and zh-hant give every Criminal Code article number (zh-hant also the two 毒品危害防制條例 paragraphs). Openings and summaries carry "원칙적으로 / 原則として / normally" plus the proviso.
2. Proviso limited to the defendant; judgment types dropped → every body and every FAQ now names the four judgments and "the defendant or a person who may appeal for the defendant's benefit". The class is not spelled out (the reviewer asked for Arts. 345 and 344 para. 4 only if it was), so no interpretation is added. en renders 免訴 / 不受理 / 管轄錯誤 with the Chinese beside each.
3. 發交 dropped; para. 2 stated as a general rule → all four now tie it to an appeal under the proviso and state both remand to the original court and transfer to another second-instance court. en and zh-hant show 發回 / 發交; ko and ja state both in their own words.
4. High Court blanket; Art. 367 → the High Court route is limited to an ordinary (통상 / 通常 / ordinary / 通常程序) first-instance judgment; a summary-judgment paragraph was added (Art. 455-1, Art. 451-1); the dismissing court is "the second-instance court"; the Art. 367 proviso is in all four.
5. Art. 349 scope and day count → "송달 다음 날부터 / 送達の翌日から / the day after service / 送達的翌日" with Art. 65 and Civil Code Art. 120 para. 2; the general first-day rule is stated in ko, en and zh-hant. ja states the result (翌日から) with the same two citations but not the general sentence, for length. The later periods are worded as the statute words them ("after the appeal period ends", "after filing"). All four say a third-instance appeal has the same twenty days; ko and ja use the generic 상소 / 上訴 for the period. The 40-day figure was removed rather than relabeled.
6. 應 / 得 split and 毋庸命其補提 → fixed in all four bodies and in FAQ 1 (see MUST VERIFY 2).
7. Travel-period table → seven regions in all four, "as of October 2026" attached, hedge kept as a research limit ("no court decision … was found"), single-article URL for Art. 3. Mainland China, Hong Kong and Macau are not mentioned.
8. en "jail"; en Art. 362 → "prison (監獄) or detention center (看守所)"; Art. 362 now says "by a ruling (裁定)" and gives all three grounds. Art. 352 is kept in en. ko and ja still do not state Arts. 352 and 362 (no shortened version added).
9. "Lower court" → added in all four.

## check-grok.md VOICE

ko
- "기한부터 봅니다." → deleted. The paragraph starts "기한은 20일입니다."
- Opening → not the reviewer's sentence. His rewrite ("형법 제277조 제1항의 상해는, 2심 판결이 나면 상고가 막힙니다.") still states the bar without the proviso, which FACTS 1 rules out. Kept the offence-list opening the best-of judge rated higher, tagged injury with Art. 277(1), dropped 단순 사기, and added "원칙적으로" and "예외는 단서 하나뿐입니다". The duplicate third sentence is gone.
- "최대 40일 안팎" → removed, not rewritten as "그 숫자는 조문에 없습니다" (that would rebut a number the reader never raised).

ja
- 「まず期限です。」 → deleted; 「期限は20日です。」
- Opening question → kept as a question, narrowed to 傷害 and 刑法第277条第1項. 「最高裁まで」 became 「三審まで」 for the reason given under "Facts removed"; 「原則として」 and the ただし書 were added.
- 「誰が控訴できるのか。」 → 「告訴人は控訴できるのでしょうか。」
- 懲役 → 有期徒刑; also 拘留 → 拘役.

en
- Statute-index opening and stacked first paragraph → the deadline now has its own paragraph and Arts. 350, 352, 351, 358 follow in the next. The reviewer's "Twenty days, and the service day does not count." was not used as the first line because G5 en in this batch already opens on a number ("Ten days."); the column opens on a reader question and the twenty days come in paragraph two.
- "whose maximum is three years' imprisonment" → "whose heaviest penalty is imprisonment of three years or less, detention (拘役) or a fine only".
- "The exception:" label → a paragraph that states the proviso in full.

zh-hant
- Title → 「刑事判決的上訴期間是二十日，第二審後不能上訴第三審的罪」 (reviewer's wording); H1 matches.
- Opening → 「上訴期間是二十日。以日計算的期間，始日不算入，所以從判決送達的翌日起算，上訴第三審也一樣」.
- Proviso passage → reviewer's wording adopted, with 發回 and 發交. 應 is kept for the Art. 361 brief and the Art. 367 presiding judge; other duties are written with 要 to avoid stacking 應.

## bestof-judge.md (ko)

- Four sentences in a row ending in a citation → the filing paragraph now has one sentence-end citation, one article as the sentence opener (제351조에 따라) and one more at the end; cite_end 0.345 → 0.2.
- Art. 376 link attached late → the link is in the first paragraph, where the bar is first stated.
- Shared omissions the judge listed (persons who may appeal for the defendant, Art. 367 carve-out, Art. 382 "no order", remand rule limited to proviso appeals) → all four are now in the text.
- Art. 66 linked inline (it was only in the reference list).
- The alt version's "기간은 송달받은 날부터입니다" was not taken; the day after service is the accurate start.

## INGEST.md

Nothing was left open by the ingest except the editor's pass. Front matter kept as ingested (topic, featured_image, dates, tags, audience, author), with summary, FAQ and the zh-hant title rewritten. en seoTitle kept (title + " | Hovering Law" is over 60 characters; seoTitle is 44). en summary is 151 characters. en read_time changed to 4 min (796 words).

## Other edits

- Internal link added in en and zh-hant only: /en/columns/taiwan-non-prosecution-reconsideration-deadline and /zh-hant/columns/taiwan-non-prosecution-reconsideration-deadline (slug 403 in LINKS.md; lint confirms the files exist). ko and ja have no internal link (length).
- Sources sections: Arts. 65, 451-1, 455-1, Criminal Code Art. 339-4, Civil Code Art. 120 added; the standard now links to its Art. 3 page; the history line gives the amendment dates of Arts. 376, 349 and 382 (entries 50 and 45) and the latest entry 55 (2026-05-13, Art. 101-1). Source-check date and the closing general-information line are 2026-10-12.
- Contact paragraph: one paragraph, email only, ends on the date and manner the judgment was received.
- facts.md rewritten: 23 rows mapping each claim in the Korean text to the quoted official passage and URL, plus the removed wording and what is deliberately not claimed.

## Limits and open points for the final review

- The versions sit close to the caps (ko 1,393, ja 1,395, zh-hant 1,396 characters; en 796 words). The reviewer's required additions took the room; any further addition needs a matching cut.
- ja does not carry the general "periods in days skip the first day" sentence, and ko and ja do not spell out the Art. 66 trigger (residence or office outside the court's locality); en and zh-hant do. The numbers, citations and conclusions are the same in all four.
- The official English translation on law.moj.gov.tw/ENG is dated 2020-01-15 and predates the current Art. 376; the en wording follows the current Chinese text. The Standards have no official English title; the en sources line says the title is rendered from the Chinese.
- No judgment was searched for the travel-period question; the columns say so.

## Checks run after the last edit (2026-10-12)

`python3 lint.py drafts/G9/<lang>.md <lang> taiwan-criminal-appeal-twenty-days-third-instance-barred`
- ko: OK [length 1393 chars]
- ja: OK [length 1395 chars]
- en: OK [length 796 words]
- zh-hant: OK [length 1396 chars]

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check drafts/G9/<lang>.md`
- ko: cv=0.588 short=0.286 run3=0.0 opener_rep=0.0 cite_end=0.2 contrast=0 caveat=0 q=1 — OK
- ja: cv=0.547 short=0.235 run3=0.0 opener_rep=0.091 cite_end=0.206 contrast=0 caveat=1 q=0 — OK (the two questions end in か。, which the checker does not count)
- en: cv=0.847 short=0.275 run3=0.0 opener_rep=0.182 cite_end=0.275 contrast=0 caveat=0 q=2 — OK
- zh-hant: cv=0.96 short=0.257 run3=0.03 opener_rep=0.1 cite_end=0.343 contrast=0 caveat=0 q=2 — OK

Self-check, section 5 items 2–9: no stock hypothetical opener and no hypothetical at all; opening types are an offence list (ko), a question (ja, en) and a number (zh-hant). In this batch the question type is also used by G3 ja and G6 en, so it is 2 of 10 in each language; the ja question was the draft's own opening and the reviewer asked to keep it; each file has well over two very short sentences; no word opens more than two paragraphs; caveat openers 0–1; the contact paragraph is the citation-free paragraph in each file; contrast templates 0; the last paragraph ends on the date and manner of receipt; ko is 합니다체 and ja です・ます throughout; no bold, emoji, phone number, address, private name or first-person story.
