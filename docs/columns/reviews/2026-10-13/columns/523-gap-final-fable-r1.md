# G9 final review — Claude Fable 5.1 (final gate), 2026-10-12

Slug: taiwan-criminal-appeal-twenty-days-third-instance-barred. Files reviewed: drafts/G9/ko.md, ja.md, en.md, zh-hant.md (state after Opus fix1), facts.md (treated as unverified), research/G9-statutes.md, reviews/G9/check-grok.md, reviews/G9/fix1-notes.md, images/G9.webp. Reviewer is a model; no lawyer or native-speaker review is claimed.

## Verdict

PASS — all four languages publishable now; image OK. No major issue found. Three minor wording edits applied (listed below); lint and variety checker re-run and OK.

## Scope checked

1. Law and facts. Every article cited in the four versions was re-opened on law.moj.gov.tw on 2026-10-12 as a single-article page (刑事訴訟法 3, 65, 66, 344, 349, 350, 351, 352, 358, 361, 362, 367, 376, 377, 382, 451-1, 455-1; 刑法 277, 339-4; 民法 120; 毒品危害防制條例 11; 法院訴訟當事人在途期間標準 1, 3, 4 and the LawAll header; 刑事訴訟法 沿革 page). Every statement in the four versions was matched to that live text, including conditions, AND/OR, who/when, modality (應 vs 得), the nine items of Art. 376 para. 1, the proviso and para. 2, the two different 20-day reasons windows, the parties list, the travel-period table (all seven regions), and the amendment dates in the sources sections. The four versions do not contradict each other; ko and ja omit Arts. 352 and 362 (no shortened version, no false implication), which is an omission, not a conflict.
2. Citations. Inline links sit right after the claims and point to the correct single-article URL (pcode and flno checked for every link). No judgment is cited, so no research/judgments file is required. Sources sections list every article used, with the check date 2026-10-12 in the page's date format. Internal link /en/columns/ and /zh-hant/columns/taiwan-non-prosecution-reconsideration-deadline: slug 403 exists in both languages in the repo (columns-en, columns-zh); lint OK.
3. Rules. No private-party name, no invented case, statistic or quote, no first-person case story, no hypothetical at all (so no label needed), no bold, no emoji, no phone number, no street address, email-only contact in one soft paragraph, author legal-ai-assistant, no lawyer-review or native-review claim, no foreign-law statement. Frontmatter: en title + " | Hovering Law" = 111 chars so seoTitle is required and is 44 chars and differs from the title; en summary 151 chars, no forbidden characters; ko/ja/zh-hant seoTitles 22/20/19 chars and differ from titles; 2 FAQs per language, consistent with the body; featured_image keeps literal NNN; the tags key follows the convention of published columns (e.g. 403). Lint OK on all four (ko 1393, ja 1399, zh-hant 1396 chars; en 796 words).
4. Voice per language (see below).
5. Image (see below).

## MUST VERIFY (topics/G9.md)

MUST VERIFY 1: CONFIRMED — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=376 — Live text: para. 1 bars a third-instance appeal after a second-instance judgment for items 1–9 (一 最重本刑為三年以下有期徒刑、拘役或專科罰金之罪; 二 刑法第277條第1項傷害罪; 三 第320、321條竊盜罪; 四 第335條、第336條第2項侵占罪; 五 第339、341條詐欺罪; 六 第342條背信罪; 七 第346條恐嚇罪; 八 第349條第1項贓物罪; 九 毒品危害防制條例第10條第1項施用第一級毒品罪、第11條第4項持有第二級毒品純質淨重二十公克以上罪). Proviso: 第一審法院所為無罪、免訴、不受理或管轄錯誤之判決，經第二審法院撤銷並諭知有罪之判決者，被告或得為被告利益上訴之人得提起上訴. Para. 2: 依前項但書規定上訴，經第三審法院撤銷並發回原審法院或發交其他第二審法院判決者，不得上訴於第三審法院. All four versions state this correctly: "three years or less / 3년 이하 / 3年以下 / 三年以下", injury limited to Art. 277(1), embezzlement as Arts. 335 and 336(2), fraud as Arts. 339 and 341, the two named drug offences with the 20 g condition, all four first-instance judgment types, "the defendant or a person who may appeal for the defendant's benefit", and para. 2 limited to a proviso appeal and covering both 發回 and 發交. Summaries and FAQs carry the proviso. 沿革 entry 50 (民國112年6月21日) lists 376 among the amended articles, so "amended 2023-06-21" in the sources sections is correct.

MUST VERIFY 2: CONFIRMED — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=361 and https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=382 — Art. 361 para. 3: 上訴書狀未敘述上訴理由者，應於上訴期間屆滿後二十日內補提理由書於原審法院。逾期未補提者，原審法院應定期間先命補正. Art. 382 para. 1: 上訴書狀應敘述上訴之理由；其未敘述者，得於提起上訴後二十日內補提理由書於原審法院；未補提者，毋庸命其補提. All four versions: second instance = must (내야 하고 / 出す必要があり / must file / 應…補提) within 20 days after the appeal period ends, then the original court sets a correction period; third instance = may (낼 수 있습니다 / 出せます / may be filed / 得…補提) within 20 days after filing, and the court does not order supplementation (보충을 명하지 않습니다 / 補充を命じません / need not order one / 毋庸命補提). FAQ 1 in each language keeps the 應 side only, correctly. Art. 455-1 para. 3 (Art. 361 not applied to summary-judgment appeals) is also stated correctly in all four.

MUST VERIFY 3: CONFIRMED — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=344 and https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=3 — Art. 344 para. 1: 當事人對於下級法院之判決有不服者，得上訴於上級法院; Art. 3: 本法稱當事人者，謂檢察官、自訴人及被告; Art. 344 para. 3: 告訴人或被害人對於下級法院之判決有不服者，亦得具備理由，請求檢察官上訴; para. 4: 檢察官為被告之利益，亦得上訴. All four versions say the appeal belongs to the parties (prosecutor, private prosecutor, defendant), that a complainant cannot appeal directly, that a complainant or victim may ask the prosecutor to appeal a lower court's judgment with reasons, and that the prosecutor may appeal for the defendant's benefit. No deadline for the request is invented.

## Other facts checked (all CONFIRMED against the live page)

- Art. 349 (20 days from service; appeal after pronouncement before service effective); Art. 65 + 民法 120 para. 2 (first day not counted → "day after service"). Art. 349 sits in the general chapter, so "the third-instance appeal has the same 20 days" is supported.
- Art. 350 (file with original court, copies per opposing party); Art. 351 para. 1 (prison or detention centre, head of facility); Art. 352 (clerk serves copies; en, zh-hant only); Art. 358 para. 1 (waiver/withdrawal in writing, oral on trial date); Art. 362 (ruling, three grounds, curable formality first; en, zh-hant only); Art. 367 (second-instance court dismisses by judgment; proviso).
- Art. 455-1 paras. 1–3 and Art. 451-1 paras. 1 and 3 (one-clause description matches: prosecutor's request built on the sentence the defendant said they would accept).
- Art. 377 (third instance only for violation of law).
- 刑法 277 para. 1 wording and that para. 2 is outside Art. 376; 刑法 339-4 (1–7 years, not in Art. 376 item 5 or item 1).
- 毒品危害防制條例 11 para. 4 (持有第二級毒品純質淨重二十公克以上).
- Art. 66 (trigger: 住、居所或事務所不在法院所在地; period set by the highest judicial administrative authority); 在途期間標準 Art. 1 (basis includes 刑事訴訟法 66 para. 2), Art. 3 item 3 (亞洲 37, 歐洲/北美洲/南美洲/大洋洲 44, 非洲/南極洲 72), header 修正日期 民國107年6月29日, Art. 4 (effective 2018-07-01). "2018년 6월 29일 개정 / as of October 2026" lines correct.
- 沿革: entry 55 (2026-05-13, Art. 101-1 only); entry 50 (2023-06-21 incl. 376); entry 45 (2020-01-15 incl. 344, 349, 382). The sources-section history lines in all four are correct. The research-limit sentence about case application of the travel period is honestly labelled and no judgment is implied.

## Issues (none major)

1. ja summary and body paragraph 6 → Original: 「検察官に上訴を求められます」 → problem & reason: 求められます reads equally as passive ("are asked to appeal") and as potential; a Japanese reader can misread who asks whom. → fix (applied): 「検察官に上訴を求めることができます」 in both places. → facts preserved: Art. 344 para. 3 content, "理由を添えて", "下級審の判決", citations unchanged. ja now 1399 chars (cap 1400), lint OK; ことができます count 2 (limit 3).
2. ja FAQ 1 question → Original: 「何日以内に控訴しますか？」 → problem & reason: unnatural as a search-style question (reads like "how many days do you appeal in?"). → fix (applied): 「何日以内に控訴する必要がありますか？」 → facts preserved: answer unchanged.
3. en paragraph 7 → Original: "using Category one narcotics … of Category two narcotics" → problem & reason: spelled-out lowercase ordinals are not how the Act's official English names the categories ("Category 1/2 narcotics"); inconsistent with the numerals used elsewhere in the sentence. → fix (applied): "Category 1 narcotics … Category 2 narcotics". → facts preserved: 20 grams, pure net weight, act name, Art. 376 link unchanged; word count 796.
4. All four, proviso paragraph → "(제376조 제2항) / （第376条第2項） / (Art. 376, para. 2) / （第376條第2項）" is a plain-text citation without a link; Art. 376 is linked at its first mention in the opening (ko, ja, en) or in the list paragraph (zh-hant) and in the sources section. → no change (first-mention link present; adding a repeated link is optional). Minor, noted only.
5. ko/ja → Art. 66 trigger (residence or office outside the court's locality) is not spelled out, only "해외에 살면 / 海外在住なら"; en and zh-hant have it. The ko/ja sentence is a true subset, not a misstatement. → no change (length cap).
6. ja paragraph 7 → 「第二級毒品の純質量20g以上の所持」 compresses 純質淨重; meaning (pure net weight) is still recoverable and the number is right. → no change; acceptable.

## Minor edits applied

- ja.md line 4 (summary): 求められます → 求めることができます.
- ja.md line 34 (body): 求められます → 求めることができます.
- ja.md line 15 (FAQ 1 q): 控訴しますか → 控訴する必要がありますか.
- en.md line 36: Category one/two → Category 1/2.

Checks after edits (2026-10-12): lint ko OK 1393 chars; ja OK 1399 chars; en OK 796 words; zh-hant OK 1396 chars. Variety checker: ko cv=0.588 short=0.286 opener_rep=0 cite_end=0.2 contrast=0 caveat=0 OK; ja cv=0.547 short=0.235 opener_rep=0.091 cite_end=0.206 contrast=0 caveat=1 OK; en cv=0.847 short=0.275 opener_rep=0.182 cite_end=0.275 contrast=0 caveat=0 OK; zh-hant cv=0.96 short=0.257 opener_rep=0.1 cite_end=0.343 contrast=0 caveat=0 OK.

## Voice (per language)

- Self-check (SENTENCE-VARIETY-RULE §5 items 2–9): no stock hypothetical opener (no hypothetical at all); opening types differ (ko offence list, ja question, en question, zh-hant number); very short sentences ≥2 in every file; no word opens three paragraphs (checked the paragraph-start column in each file); no three consecutive claim-(statute)-caveat paragraphs; the contact paragraph is citation-free; contrast templates 0; "가중사기는 목록에 없습니다" answers a question a fraud defendant actually has, not a rebuttal of an unmade claim; last body paragraph ends on this column's fact (date and manner of service); ko 합니다체 and ja です・ます throughout; nothing lost. No MONOTONY item.
- ko: calm 합니다체; "3심의 문은 더 좁습니다", "간이판결은 길이 다릅니다", "고소인도 항소할 수 있을까요? 직접은 못 합니다" read as native practitioner prose. Title specific, not imperative. Opening gives the finding at once.
- ja: natural です・ます; opening question then the rule; 有期徒刑/拘役 kept as Taiwan statutory terms. After edit no ambiguous 求められます. Title names the reader's situation.
- en: plain and active; short sentences ("No.", "Living abroad adds days.", "Plan around the twenty days."); no AI filler; Chinese terms glossed where a reader must recognise them on the judgment.
- zh-hant: Taiwan usage only (地方法院、高等法院、書狀、法律上之程式、監所長官); no simplified characters or mainland vocabulary; "沒寫怎麼辦？", "簡易判決走另一條路", "人在國外，在途期間另計" are spoken Taiwanese register, not 官腔; 應 kept only where the statute uses it.

## Image

images/G9.webp: a small terracotta bowl of still water on a flat stone ledge above a misty green hillside, soft dawn light, muted palette, wide negative space. No faces, people, text, numbers, logos, flags, documents or screens; nothing that depicts a real case; respectful; not one of the site's listed motifs. Fit to the column is loose (stillness at an edge, a deadline's quiet), consistent with the lane's generic editorial-photo brief.

Image verdict: OK.

VERDICT: PASS
