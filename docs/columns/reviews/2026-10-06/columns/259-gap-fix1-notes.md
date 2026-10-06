# G2 fix1 notes — sentence-variety rework, editor (Claude Opus), 2026-10-06

Slug: taken-taiwan-police-station-first-24-hours-not-release. Files edited: drafts/G2/{ko,ja,en,zh-hant}.md, drafts/G2/facts.md, this file. Nothing else was touched: research/G2-statutes.md is unchanged (no statute was added), no judgment is cited, no git, no repo edits, nothing sent.

## MUST VERIFY

topics/G2.md has no "## MUST VERIFY" section. There is no numbered item to report as CONFIRMED / WRONG / UNVERIFIABLE.

## Scope of this round

reviews/G2/REWORK.md overrides the default scope: a sentence-variety rewrite of the r1 PASS text in all four languages, every fact kept. The body of each file (from the first paragraph to the contact line) was rewritten. The frontmatter and the sources section of each file are byte-identical to the r1 reference (checked by script against backups/G2-r1-pass-20261006-1303/drafts-G2/).

Official source check in this round: 刑事訴訟法 第93條 (all six paragraphs), 第93-1條 (eight items plus the two closing paragraphs) and 第114條 were re-opened on their law.moj.gov.tw single-article pages on 2026-10-06 and match research/G2-statutes.md word for word (footer 法規整編資料截止日：民國115年09月24日). They were fetched with the WebFetch tool, which returns the page text through a model, so I asked for verbatim quotation and compared the quoted paragraphs one by one. The other cited articles were not re-opened, because no legal content changed and the rework order says not to re-research. The zh-hant opening now quotes eight words of 第93條第2項 verbatim; that quotation was compared with the live page.

## Checker results (before → after)

Variety checker, r1 text → this version:

- ko: sentences 26 → 36; len_cv 0.411 → 0.494; very short 3.8% → 16.7% (6 sentences); sentence-end statute parenthesis 57.7% → 30.6%; contrast 1 → 0; caveat openers 2 → 0; questions 0 → 1.
- ja: sentences 25 → 34; len_cv 0.361 → 0.471; very short 0% → 20.6% (7 sentences); caveat openers 2 → 0.
- en: sentences 35 → 43; len_cv 0.493 → 0.592; very short 11.4% → 23.3% (10 sentences); same-word paragraph openers 3 → 2 ("Article" twice, nothing three times); questions 0 → 2.
- zh-hant: sentences 26 → 39; len_cv 0.509 → 0.568; very short 3.8% → 12.8% (5 sentences); sentence-end statute parenthesis 57.7% → 28.2%; the "62% of sentences end in ）。" warning is gone; questions 0 → 2.

Final checker lines (python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check … --lang …):

- drafts/G2/ko.md [ko] sentences=36 mean=29.7 cv=0.494 short=0.167 run3=0.0 opener_rep=0.0 cite_end=0.306 cite_para=0.714 contrast=0 caveat=0 q=1 — OK, no variety limit violated
- drafts/G2/ja.md [ja] sentences=34 mean=32.6 cv=0.471 short=0.206 run3=0.0 opener_rep=0.0 cite_end=0.0 cite_para=0.714 contrast=0 caveat=0 q=0 — OK, no variety limit violated
- drafts/G2/en.md [en] sentences=43 mean=17.9 cv=0.592 short=0.233 run3=0.0 opener_rep=0.071 cite_end=0.256 cite_para=0.714 contrast=0 caveat=0 q=2 — OK, no variety limit violated
- drafts/G2/zh-hant.md [zh-hant] sentences=39 mean=28.5 cv=0.568 short=0.128 run3=0.027 opener_rep=0.0 cite_end=0.282 cite_para=0.857 contrast=0 caveat=2 q=2 — OK, no variety limit violated

Two checker blind spots, so the reviewer does not rely on the numbers alone: the ja inline citations are written 「93条」 without 第, so the checker reports cite_end 0.0 for ja whatever the text does (counted by script with the 第-less form: 12 of 34 ja sentences end in a statute parenthesis, down from 15 of 25); and Japanese questions end in 「か。」, so q=0 although the ja body has one question (「保証金を納めれば出られるのでしょうか。」).

Lint (python3 lint.py <file> <lang> taken-taiwan-police-station-first-24-hours-not-release), final run:

- ko: OK — 1,398 characters
- ja: OK — 1,399 characters
- en: OK — 798 words
- zh-hant: OK — 1,385 characters

## Feedback items → what changed

### Variety checker FAILs (reviews/G2/variety-*.txt)

- ko FAIL len_cv 0.411, FAIL short_share 0.038, FAIL cite_end_share 0.577 — fixed (0.494, 0.167, 0.306). Six very short sentences, among them 「맞는 절반입니다.」 「그동안은 신문할 수 없습니다.」 「불필요한 지연도 안 됩니다.」 「늘 풀려나지는 않습니다.」. Citations now sit in four positions: statute as the subject (제93조의1은…, 제95조는…), at the front (제93조에 따라, 제114조에 따라, 제101조의 요건은), inside the sentence (제93조의2로 제한할 수 없습니다, 규정은 제31조에 없습니다) and as a closing parenthesis.
- ja FAIL len_cv 0.361, FAIL short_share 0.0 — fixed (0.471, 0.206). Seven very short sentences, among them 「その間は取調べができません。」 「不必要な遅延も許されません。」 「必ずではありません。」 「出国・出海の制限は要件が別です。」.
- en FAIL top_opener_n=3 — fixed (2). Paragraph openers are now The / Counting / What / Article / Relatives / On / Article / Where / Does / For / After / Release / Overseas / A.
- zh-hant FAIL short_share 0.038, FAIL cite_end_share 0.577, WARN 62% ending in ）。 — fixed (0.128, 0.282, warning gone). Short sentences: 「警詢也一樣。」 「法條沒有這樣寫。」 「羈押由法官訊問後決定。」 「不一定。」 「出境是另一道關卡。」.

### REWORK ORDER items

1. Keep every fact — done; see "Comparison with the r1 reference" below. A script confirms that every statute link and internal link of the r1 body is still in the body of each language (ko 21, ja 21, en 23, zh-hant 22 links; none dropped, none added) and that no digit string was dropped or added. There is no hypothetical in any version, so there is no hypothetical label to keep, and topics/G2.md has no MUST VERIFY item.
2. Citation rhythm — every article is still linked once in the body (I did not move any link out to the sources section), but the position varies as listed above, and two or more sentence-end parentheses never run for more than two sentences in a paragraph. One paragraph in each language has no citation at all: the one-line consequence paragraph after the Article 93-1 paragraph (「벽시계와 법의 24시간이 어긋나는 이유입니다.」 / 「壁の時計と法律の24時間は、こうしてずれます。」 / "Relatives counting by the wall clock can reach 24 hours before the law does." / 「所以單憑牆上的時鐘，還不能判斷有沒有逾時。」). It states a consequence of the exclusions, not a new rule (facts.md K7a).
3. Rhythm — no two long sentences run back to back in any language (en had two such pairs in r1); the long requirement sentences (Article 101, Article 114) are each followed by a shorter one. The r1 paragraphs that turned on 다만 / ただし / But (Article 31 and Articles 110–114 in ko and ja, Article 114 in en) no longer do: 다만 2 → 0, ただし 2 → 0, sentence-initial But 1 → 0. zh-hant keeps one 不過 (legal aid) and one 只是 (police notice).
4. Opening — no stock hypothetical and no scene (G3 and G4 of this batch open on scenes, G1 on a question / number / plain fact). ko opens on the common belief: 「대만에서 체포되면 24시간 뒤에 풀려난다는 말은 절반만 맞습니다.」, paid off in the next paragraph by 「맞는 절반입니다.」 after the release duty of Article 93. ja opens on an image for the excluded time: 「台湾で逮捕された後の24時間は、止まることのある時計です。」. en opens on whose deadline it is: "The 24-hour clock after an arrest in Taiwan belongs to the prosecutor." zh-hant opens on the statute's own words: 「應自拘提或逮捕之時起二十四小時內」，刑事訴訟法第93條這句話是寫給檢察官的。 The as-of date (2026년 10월 현재 / 2026年10月時点 / As of October 2026 / 截至2026年10月) stays in the opening paragraph of each.
5. Ending — the last body paragraph in each language is the Article 27 sentence (family abroad may retain counsel independently). After it there is only the single contact line, then the sources section and the single general-information line. Removed: en "What happens next depends on the case."; zh-hant 「後續每件都不一樣。」; ko lead-in 「상담이 필요하면」.
6. Native voice — ko is 합니다체 in every sentence (script check: no sentence ends outside ~니다 / ~까요); 「~할 수 있습니다」 appears 4 times and 「~해야 합니다」 3 times, 「다만」 0 times. ja is です・ます in every sentence; 「〜なければなりません」 4 times (5 in r1), 「〜ことができます」 0. zh-hant: five 應 were turned into 要 where the sentence explains a duty in everyday words (要在這段時間內向法院聲請; 詢問前要先告知什麼; 就要由通譯傳譯; 筆錄要向受詢問人朗讀…要把陳述附記), which still reads as an obligation; the statute-style 應 stays in four places besides the quotation (應立即釋放, 應當場告知, 應即停止詢問, 應通知法律扶助律師到場), and r1's 「身邊沒有辯護人的人表示已經選任辯護人時」 (noted as stiff in the r1 review) is now 「沒有辯護人陪同的人表示已選任辯護人時」. No bold, no first person, no checklist heading. Frontmatter untouched.
7. Self-check — see below.

### check-grok.md (resolved at r1; status after the rewrite)

FACTS 1 to 12 were all resolved at r1 and none was reversed by the rewrite:

1. 拘提 or 逮捕 as the start, no "continued" — held (ko 구인(拘提)되거나 체포(逮捕)된 때부터; ja 拘提（強制的な連行）または逮捕の時; en compulsory production (拘提) or arrest (逮捕); zh-hant 自拘提或逮捕時起算).
2. Exit-restriction limits — held in all four: own grounds, 拘役/fine-only proviso scoped to Article 93-2, 出境 and 出海, 8 months, two extensions of up to 4 and up to 2 months by court ruling, trial stage separate.
3. No "Chinese transcript through an interpreter" — held; the record rule (Articles 41, 43-1) and the interpreter rule (Article 99) remain separate sentences.
4. Why a person can still be held — held: timely application leads to a judge's hearing, late-night (11 p.m. to 8 a.m.) receipt means a next-day daytime hearing, the 6-hour and 4-hour waits are marked as examples (ko 「등」, ja 「など」, en "eight kinds … including", zh-hant 「八種，例如」).
5. Article 101 test — held with all three elements and "after questioning by the judge".
6. Money does not always release; Article 114 cases; Article 101-2 — held with every number (3 years, 5 months, 2 months) and the "repeat offenders and others excepted" flag.
7. Article 101-1 as a separate ground, fraud and drunk driving as examples — held.
8. ja Article 89 (the person designates; the writing states the reason) — held.
9. Article 95 paragraph 2 in ja and zh-hant — held, both conditions.
10. Legal aid next to the denial — held in all four.
11. Firm name and contact line — held; one line, email only, no address, no phone.
12. As-of date, sources section, general-information line — held; sources section and closing line byte-identical to r1.

The one point where r1 did not follow the reviewer is unchanged: the Article 31-1 exception is signalled by "in principle / 원칙적으로 / 原則として / 原則上" and not spelled out (reason in reviews/G2/r1-pass/fix1-notes.md; proviso quoted in facts.md K17). There is still no room for it: ko is 2 characters and ja 1 character under the cap.

VOICE items of check-grok.md were resolved at r1 and remain so (register, no sales close, no signpost sentences, headings that state a fact or a question). en "A little conversational Mandarin is no reason to guess at a written statement." and zh-hant 「聽不懂時的點頭，不能當成內容確認。」 and 「單憑牆上的時鐘，還不能判斷有沒有逾時」 are kept, as that review allowed.

r1 final review, non-blocking observation 5 (name the Article 101-1 exception inside the Article 114 parenthesis in en) — not applied. It would add legal content in one language during a wording-only round, and en is 2 words under the cap. The exception stays flagged by "and others excepted" and is quoted in full in facts.md K21.

## Comparison with the r1 reference, item by item

Same result in every language unless a language is named. "Kept" means the statement, its conditions and its numbers are all in the new text.

1. 24 hours = the prosecutor's deadline to apply to a court for 羈押, not a release time; as of October 2026 — kept. ko now says the belief is "half right" and identifies the right half as the release duty when no application is made.
2. Clock starts at 拘提 or 逮捕 — kept. en "Arrival at the prosecutor's office does not restart it." replaces "not on arrival at the prosecutor's office" (same fact, stated without the contrast form).
3. Prosecutor who considers detention necessary must apply within the 24 hours; no application → release at once — kept.
4. Even then, bail (具保), residence restriction and so on where a detention ground exists — kept (zh-hant names 具保、責付或限制住居 and the "無聲請必要" condition as before).
5. Timely application → judge's hearing, not release — kept (ko 「석방 없이 판사의 심문으로」, ja 「釈放はなく、裁判官の審問に進みます」, en "A court hearing comes next. Release does not.", zh-hant 「接下來是法官訊問，人不會先放出來」).
6. Application received in 深夜, 11 p.m. to 8 a.m. → heard in the daytime of the next day, Article 93 — kept, with a "same article" reference in ko, ja and en.
7. Article 93-1: interpreter wait up to 6 hours, counsel wait (after saying they want to retain one) up to 4 hours, as examples; no questioning during that time; no unnecessary delay — kept. en and zh-hant keep "eight kinds"; zh-hant keeps 在途解送. en "They are pauses, not an automatic extension" is now "These pauses are not extra time".
8. zh-hant only: attending on a police notice (Article 71-1) is not 拘提 or 逮捕 — kept (「只是收到通知書到場說明…還不算拘提或逮捕」).
9. Article 89: reason and rights stated on the spot; reason in writing to the person and the relative or friend they designate — kept.
10. Article 95: offence, silence, counsel (en and zh-hant also favourable evidence) before questioning; questioning stops when a person without counsel says counsel is already retained, unless they agree to continue — kept.
11. Article 100-2 (police questioning) and Article 245 (counsel may attend unless a statutory ground for restriction applies; en and zh-hant: take notes, state opinions) — kept.
12. Article 99 interpreter; Articles 41 and 43-1 record read out or shown, accuracy asked, requested changes appended — kept. ko and ja now say the request "is appended" without repeating "to the record" inside a sentence whose subject is the record.
13. Article 31 has no rule giving a foreigner counsel from the police stage (en and zh-hant: it covers disability preventing a full statement and indigenous status); legal aid for those eligible (Article 95); appointed counsel in principle at the investigation-stage detention hearing (Article 31-1) — kept. ko 「선임한 변호인이 없으면」 is now 「변호인이 없으면」.
14. Article 101: judge decides after questioning; serious suspicion; a listed ground such as flight or evidence destruction; prosecution, trial or enforcement manifestly difficult without detention — kept. en keeps "Foreign nationality is not itself a listed ground." en "A judge, not the prosecutor, orders detention" is now "For detention, the prosecutor can only ask. A judge orders it, and only after questioning the person."
15. Article 101-1: listed offences such as fraud and drunk driving, risk of repeating the same offence as a separate ground — kept.
16. Article 110: application for suspension of detention on bail after detention (en, zh-hant: at any time); the court reviews; payment does not always release — kept.
17. Article 114: court may not reject where the maximum penalty is 3 years' imprisonment or less (repeat offenders and others excepted; zh-hant also 拘役或專科罰金), 5 months pregnant or within 2 months after birth, illness hard to cure without treatment outside — kept.
18. Article 101-2: in those cases detention only where bail and similar measures cannot be used — kept.
19. Articles 93-2, 93-3, 93-5: own grounds; no restriction under Article 93-2 where the maximum penalty is 拘役 or a fine only; 出境 and 出海; prosecutor's restriction during investigation at most 8 months; extension by court ruling, twice, up to 4 then up to 2 months; trial stage separate; the person and counsel may apply to lift or change it — kept. en keeps "Release is not permission to fly home." and the two internal links.
20. Article 27: spouse, parents and siblings abroad may retain a Taiwan defence lawyer independently; internal link to hire-taiwan-lawyer-from-abroad — kept.
21. Contact: firm name, wei@hoveringlaw.com.tw, non-confidential outline first — kept, one line.
22. Sources section (20 articles; 21 in zh-hant with Article 71-1; 刑法第185-3條; history page), check date 2026-10-06, general-information line — byte-identical.
23. Frontmatter (title, seoTitle, summary, FAQ, topic, featured_image and the rest) — byte-identical.

Changed outside the body text: one ja heading, 「24時間の起点と算入されない時間」 → 「24時間の起点と数えない時間」 (same meaning, three characters shorter).

## Sentences whose legal wording was recast (for the reviewer's meaning check)

- ko: 「판사는 … 때 구속할 수 있습니다(제101조)」 → 「구속은 판사가 본인을 심문한 뒤 정합니다. 제101조의 요건은 중대한 혐의, … 현저히 어렵다는 점입니다.」; 「…반복할 우려를 이유로도 구속할 수 있습니다」 → 「…반복할 우려도 구속 사유입니다」; 「처음부터 … 대신할 수 없을 때만 구속할 수 있습니다」 → 「이때는 처음부터 … 대신할 수 없을 때만 구속이 허용됩니다」; 「신문 전에는 … 알려야 합니다」 → 「제95조는 신문 전에 … 알리도록 정합니다」; 「물어야 하며」 → 「묻게 되어 있고」; 「…처럼 이 계산에 넣지 않는 시간도 있습니다」 → 「제93조의1은 … 등을 계산에서 뺍니다」.
- ja: 「裁判官は本人を審問し、… ときに羈押できます（101条）」 → 「羈押を決めるのは本人を審問した裁判官です。101条の要件は、重大な嫌疑、… という事情です。」; 「取調べの前には … 告げなければなりません」 → 「95条は取調べの前に … の告知を求めています」; 「納めれば必ず出られるわけではありません」 → 「保証金を納めれば出られるのでしょうか。必ずではありません。」; 「裁判所は請求を退けられず（114条）」 → 「退けられないのは、… の場合です（114条）」.
- en: "Before questioning, a suspect must be told …" → "Article 95 requires that, before questioning, a suspect be told …"; "Being a foreigner does not by itself bring a free lawyer to the police station" → "Does a foreign passport bring a free lawyer to the station? Not by itself."; "But the court may not reject it where …" → "Article 114 lists when the court may not reject the application: …".
- zh-hant: 「…和已經被拘提或逮捕，不是同一件事」 → 「…還不算拘提或逮捕」; 「接下來是法官訊問而不是釋放」 → 「接下來是法官訊問，人不會先放出來」; 「法院會審查，交得出錢不代表一定放人」 → 「錢交得出來，就一定放人嗎？不一定。…但法院會審查。」; 「…「外國人」這個身分不在其中」 is now preceded by 「外國人在警局會自動有免費律師嗎？法條沒有這樣寫。」.

Mandatory force was kept in each case (duty stays a duty, 得 stays "may"); none of these adds a condition or drops one.

## Self-check (SENTENCE-VARIETY-RULE.md section 5)

1. Checker: no FAIL and no WARN in any of the four files.
2. First sentence: no 가령 / 例えば…とします / Suppose / 假設; none of the four is a scene. Opening types: ko common belief, ja image for a fact, en short assertion, zh-hant a line of the statute. The other columns of this batch as they stand in drafts/: G1 question (ko), number (ja), plain fact (en, zh-hant); G3 and G4 scenes in every language. The en opening is the same broad type as G1's en opening (a plain statement); it is not a scene and not a hypothetical.
3. Very short sentences: ko 6, ja 7, en 10, zh-hant 5. No two long sentences run back to back (script count 0 in all four; long = ko 70+, ja 80+, zh-hant 60+ characters, en 32+ words).
4. Paragraph openers read down the page: no word three times in any language (ko 제93조의1은 / 제95조는 and 구속은 / 구속된 are the closest pairs; en "Article" twice).
5. No three consecutive claim–statute–caveat paragraphs; one citation-free consequence paragraph in each language, besides the opening paragraph in ko, ja and en.
6. Contrast templates in the body: checker count 0 in all four. The titles, the summaries and the FAQ answers still carry the column's one deliberate contrast (not a release time, but a filing deadline), which is the subject of the column and of its slug, not a rebuttal of something the reader did not say.
7. Last body paragraph ends on Article 27; no "depends on the facts" sentence; contact is one line; the general-information line is the last line of the file.
8. ko 합니다체 and ja です・ます throughout; no bold, no emoji, no first person, no checklist heading, no phone number, no address, no lawyer-review or native-review claim.
9. No article number, period, number, link or condition lost (script comparison plus the list above).

Not met in full, stated plainly: rule 2-8 asks for at most two numbers in the first two sentences; ko, ja and en have "24" and the as-of date "2026 / 10" there, because lane rule 10 requires the date next to the figure and the SPEC wins.

## Facts removed as unverifiable

None in this round. The three removals are formula or lead-in wording, not facts: en "What happens next depends on the case."; zh-hant 「後續每件都不一樣。」; ko 「상담이 필요하면」. The list of facts removed at fix1 (r1) is kept in drafts/G2/facts.md.

## facts.md

Rewritten so that each row quotes the Korean sentence as it now stands (K1 to K29, plus K7a for the citation-free paragraph), with the same official passages and URLs; the table of points that appear only in other languages was updated for the new en, ja and zh-hant wording (the zh-hant quotation of 第93條第2項, en "Arrival at the prosecutor's office does not restart it.", en "the prosecutor can only ask", the wall-clock sentences, the ja and en images). A section records what this round removed; the fix1 removals and the "verified but left out" list are kept.

## Limits and points for the final reviewer

- Length margins are thin: ko 2 characters, ja 1 character and en 2 words under the cap; zh-hant has 15 characters of room. Any addition needs a matching cut.
- ko len_cv 0.494 and ja 0.471 are above the 0.45 limit but not by much; merging two short sentences during a later edit could push ja below it.
- This is an editor's read by a model. It is not a native-speaker or lawyer review, and no file says otherwise.
- en still overlaps in subject with existing column 033 (taiwan-police-questioning-foreigner-rights); it links to 033 and 032 as before.
