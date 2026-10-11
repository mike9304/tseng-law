# Final review r1 — ko-007-taiwan-divorce-lawsuit-qna (Claude Fable 5.1, 2026-10-12)

## Verdict

PASS (after one tiny reviewer edit, listed below). The rewrite preserves every legal statement, qualifier, article number, date, amount, link, source entry, disclaimer and signature of the published original, adds no new fact, and no longer reads machine-written.

## Scope checked

- Read in full: orig.md, draft.md, guard.txt, notes.md, tests.patch (34 KB, non-empty), tests.txt, SENTENCE-VARIETY-RULE.md §2 and §5–6, COLUMN-VOICE-RULE.md; skimmed LESSONS.md (Top 25).
- Mechanical checks run by me (python, not just trusted from guard.txt): front matter + H1 + image line identical to the original byte for byte; the ten Article 1052(1) grounds identical; the ten official-source entries identical; the three related-links identical; `---`, disclaimer and signature identical; zero `**`; per-article citation counts identical (every 제n조/제n조의n/제n항 token appears the same number of times); link targets and link texts identical as sets (order differs only because "관련 안내" now precedes "공식 자료"); key tokens 30일, 3만 대만달러 (×2), 3년, 6개월, 2026년 10월 6일, 2026년 7월 25일, 1980년, 112年憲判字第4號 (×3), 원칙적으로 (×4), 최초 (×2), 입법기간이 지났더라도 all present with the same counts.
- guard.py (orig vs draft, ko, --today 2026-10-06): GUARD: PASS, length 5611 → 5337 (95%), monotony 21.7 → 11.3.
- variety_metrics.py check --lang ko: FAIL 0; one WARN ("95% of sentences end in 니다.") which is the 합니다체 baseline and present in the original.

## Claim-by-claim fact check

Intro (orig ¶ after image → draft ¶1–2)
- Divorce issues to separate: 혼인관계 종료 방식 / 호적 정리 / 외국에서의 효력 / 부부재산 / 손해배상 / 이혼 후 배우자 부양 / 미성년 자녀 결정·양육비 → draft ¶1, all seven present → preserved.
- Same facts may feed several claims but requirements, effects, proof and deadlines differ → draft ¶1 last sentence → preserved.
- Korea–Taiwan families: nationality or registration place alone cannot fix the procedure; check living base, existing judgments/registrations, place of documents, children's residence, asset location → draft ¶2 → preserved ("특히" dropped, no meaning change).

§1 Three routes and five cross-border questions
- 협의이혼 (서면·증인·호정 등록) / 법원 조정·화해 (조정조서·화해조서) / 재판상 이혼 (법정사유 주장·증명, 판결) → draft first section ¶1 → preserved.
- Five questions (jurisdiction; applicable law for divorce·property·children; recognition/effect of foreign divorce or judgment in Taiwan; procedure and authenticated documents for Taiwan household registration; separate filing/recognition/enforcement elsewhere) → converted to a 5-item bullet list → all five preserved, same order.

§2 협의이혼 and registration
- Art. 1050: written agreement, two or more witnesses' signatures, 호정기관 registration are each independent requirements → "셋은 각각 독립된 요건입니다" → preserved.
- Witnesses must recognise and confirm both parties' genuine intent before signing, not merely add a name → preserved.
- Private agreement signed by the parties alone: may evidence property/child terms but does not produce the status effect of 협의이혼 → preserved; the added reader question "합의서만으로 이혼이 성립할까요? 성립하지 않습니다." restates the same point (matches FAQ 1) and adds no new fact.
- Required documents per 내정부 호정사 guidance and the local 호정사무소 at the time of filing → preserved.
- Foreign documents may need authentication by Taiwan's overseas mission or a competent body depending on type and place; certified/notarised Chinese translation when the official guidance requires → preserved (split into two sentences).
- Link to taiwanese-spouse-divorce-agreement-registration with same text → preserved.
- Taiwan court judgment final or court mediation/settlement concluded → 원칙적으로 either party may register → preserved; the rewrite had dropped "대만 법원의" (see tiny edit 1, now restored).
- 호적법 제48조: 30-day general filing period runs from finality of the Taiwan judgment or the date mediation/settlement is concluded → preserved, both starting points intact.
- Service/receipt date is not a common starting point for all cases → preserved.
- Late filing must still be accepted; after written notice with no filing, 호정기관 registers ex officio under 호적법 제48조의2 → preserved.
- Missing the period does not undo an effective divorce → preserved.
- Online filing only within the statutory period → preserved.

§3 Court mediation, attendance, review routes
- Family cases go to court mediation before trial 원칙적으로; direct suits may be deemed mediation applications; exceptions and conversion rules exist → preserved.
- Mediation can settle property, children, payment method together; agreements disadvantageous to minor children cannot be confirmed as-is → preserved.
- 가사사건법 제13조 sanction only when the court orders the party or legal representative in person; 민사소송법 제303조 applied mutatis mutandis → fine of up to NT$30,000 for the first instance; no compulsory appearance (구인) on this basis; repeated sanction after renewed lawful notice and unjustified absence → preserved ("연속하여 제재할 수 있습니다" → "제재가 거듭될 수 있습니다", same meaning).
- Separate rooms, video, counsel-only attendance or safety measures cannot be promised in advance; inform the court and confirm directions → preserved.
- Mediation/settlement dissolves the marriage in the statutory manner and has the effect of a final judgment; otherwise trial may follow; judgment divorce turns on finality → preserved.
- 항소 vs 항고 vs separate procedure contesting mediation/settlement: different routes and periods; compute from service date, finality and procedural status; never transplant a period from one case to another → preserved.
- Marriage may dissolve before property/child issues are resolved; not a shortcut to recommend in all cases; check preservation/settlement of property, residence·care·medical·education, child support and contact, and interim measures for safety and continuity → preserved.

§4 Grounds and the at-fault spouse
- Art. 1052(1): ten grounds, list byte-identical → preserved.
- Para. 2 general ground; proviso: where the serious cause is attributable to one side only, 원칙적으로 only the other spouse may petition → preserved.
- 112年憲判字第4號: unconstitutional to the extent it wholly deprives the at-fault spouse of any chance to divorce without regard to the considerable time since the cause arose or continued, where the result in the individual case is plainly harsh → preserved verbatim in substance.
- Even if the legislative period set by the Court has passed, as of 2026-10-06 the proviso text is not deleted; courts must apply the ruling's purport in individual cases → preserved.
- Spouse out of contact or gone: do not mix grounds; police missing-person report is possible evidence but not a universal precondition; no universal requirement to sue for cohabitation first; months of absence alone establishes no ground; examine reason for leaving, justified separation, contact and support, duration → preserved; the added question "몇 달 집을 비웠다는 사실만으로 어느 사유가 성립할까요? 그렇지 않습니다." restates the original negative.

§5 Foreign marriage/divorce and Taiwan household registration
- Registering the marriage in Taiwan first or suing in Taiwan are not the only options; check effect and recognisability of existing foreign acts/judgments first; if nothing started, compare jurisdiction, applicable law, registration/enforcement effects → preserved.
- Mainland China documents and Hong Kong/Macao documents follow separate verification rules; state the place of execution precisely → preserved.
- Two column links (korea-divorce-recognition-taiwan-household-registration, taiwanese-spouse-divorce-from-abroad), same texts and targets → preserved, merged into one sentence.

§6 Property, damages, support
- Title and purchase funds are evidence; ownership/gift/명의신탁/loan/unjust-enrichment claims are distinct from Art. 1030-1 remaining-property distribution → preserved.
- Art. 1030-1 distribution claim, Art. 1056 damages for judicial divorce, Art. 1057 support of the faultless spouse in hardship, child support: different requirements, calculation and periods → preserved (second "민법" dropped as the law is named in the preceding sentence).
- Link to taiwan-divorce-property-damages-support → preserved ("에 정리했습니다").

§7 Minor children
- Correct concept: exercise and burden of rights and duties over minor children (residence, daily care, education/medical decisions, property management, legal representation); 친권/양육권 are shorthand that do not translate the whole → preserved.
- Art. 1055: parents may agree who exercises; absent agreement the court decides; court may modify an agreement disadvantageous to the child → preserved (citation moved to end parenthesis; subject 법원 carried from the preceding clause).
- Art. 1055-1 factors (age·sex·number·health; child's wishes and developmental needs; parents' age·occupation·conduct·health·economic capacity·living situation; intent and attitude toward care; emotional bond; obstruction of the other parent's relationship); hearing the child in the statutory manner; reports of agencies or child-welfare experts; income or marital fault is one fact, not a sole criterion or a reward/punishment → preserved.
- Contact obstruction: review existing agreement/judgment and enforceability, circumstances, child's wishes·safety·schedule; possible determination/modification, enforcement or interim measure; 가사사건법 제194조 enforcement method chosen in the child's best interests, direct or indirect compulsion depending on the case; no guarantee of immediate force, handover, punishment or change of rights; support and contact are not retaliatory bargaining chips → preserved.
- Art. 1116-2: support duty continues after divorce; unperformed part of an existing support judgment or court settlement may be modified where changed circumstances make it manifestly unfair (가사사건법 제102조 제1항, 제107조 제2항); link to taiwan-child-support-enforcement-cross-border → preserved.

New heading "자녀를 데리고 국경을 넘을 때" (split from §7, text unchanged in substance)
- Who decides residence and travel; other parent's consent or applicable court order; link to taiwanese-spouse-divorce-cross-border-parenting → preserved.
- 1980 Hague Convention not to be presumed applicable to Taiwan; removal or retention against agreements/orders not advised; confirm lawful consent or judgment and emergency protection before moving; link to child-taken-to-taiwan-non-hague-korean-parent → preserved.

§8 Evidence (8-item numbered list → three prose paragraphs)
- Items 1–8 mapped: (1) marriage proof, household data, nationality·domicile·habitual residence·current address; (2) written agreement and witness-confirmation circumstances, court papers, service records, 조정조서·화해조서·판결·확정증명; (3) foreign records/judgments, authentication, Chinese translation and certification, recognition/effect/registration status in Taiwan; (4) neutral timeline of alleged grounds, lawfully obtained communications, medical/police records, originals preserved; (5) each child's age·health·education·residence, care history, age-appropriate wishes, relationship and safety data from the best-interests viewpoint; (6) current agreements/judgments, support paid and actual costs, contact history, travel documents, movement schedule and relocation plan; (7) every date tied to its exact triggering event; do not conflate pronouncement·service·finality, mediation/settlement conclusion, date of knowledge and dissolution of the property regime; (8) ID numbers, addresses, medical·education·financial data shared only as needed, with access·transfer·disposal plan → all eight present, same order.
- Prohibition on unlawful surveillance, account access, device intrusion, location tracking, unlawful recording, disclosure of children's private information → preserved verbatim.

Sources, related links, tail
- "2026년 7월 25일 기준" source note and re-check advice → preserved (wording lightly changed, meaning same).
- Ten official sources (texts and URLs) → identical. Three related links → identical. "관련 안내" now precedes "공식 자료" (structural choice; both complete).
- `---`, disclaimer sentence, signature "증준외 변호사(曾雋崴, Wei Tseng)" → identical. No contact line existed in the original; none added.

Nothing added: no new facts, examples, cases, numbers, first-person stories, promises or sales lines. The two reader questions are restatements of existing negatives.

## Blocking issues

None.

## MONOTONY items (rule §5 self-check, re-verified)

1. Tool: FAIL 0 (cv 0.492, short 9.6%, run3 2.9%, cite_end 2.9%, contrast 2, questions 2).
2. Opening is a plain fact sentence ("대만 이혼사건에서는 풀어야 할 문제가 한꺼번에 따라붙습니다."), not a stock hypothetical formula → met.
3. Very short sentences present ("성립하지 않습니다.", "그렇지 않습니다.", "사유는 열 가지입니다.", "판결 이혼은 확정이 핵심입니다.") → met. The contact-obstruction paragraph still carries three long sentences in a row, inherited from the original; noted, not counted as a second unmet item because the sentences are dense legal qualifiers that the fact rule forbids cutting.
4. Paragraph openers: "가사사건법" ×2 consecutive, "민법" ×2, "대만…" ×3 across 32 paragraphs (within the long-text allowance of paragraphs/8 = 4; tool opener_rep 0.067) → met.
5. No three consecutive "claim (article) → 다만" paragraphs; several citation-free paragraphs (intro, §5, cross-border) → met.
6. Contrast templates: 2 by tool count, none rebutting a claim the reader did not make → met.
7. Last body paragraph ends on this column's facts (the evidence-collection prohibition); the one-sentence disclaimer and signature are the house tail carried over unchanged → met.
8. 합니다체 throughout, no bold, no emoji, no invented first person, headings are topic phrases not imperative checklists → met.
9. No article number, deadline, amount, link or label lost (verified by token counts above) → met.

Result: 0 of items 2–7 unmet (item 3 partially inherited). Not a FIX.

Native-reader notes: no translationese found; "그와 별개로 따져야 하는 문제", "보복하듯 맞바꿀 수 있는 수단이 아닙니다", "단어 하나가 … 온전히 옮기지는 못합니다" read as natural Korean legal prose.

## Length / padding

5611 → 5337 lint characters (95%). Cuts are merges of duplicated connectors and the two previews ("…를 다룹니다" repetitions); no legal point removed (see table). Rhythm sentences added are restatements, not padding.

## Tests verdict

tests.patch touches only src/lib/__tests__/columns-ko-family-007.test.ts. It re-anchors: the heading array (10 → 11, new heading "자녀를 데리고 국경을 넘을 때", "관련 안내"/"공식 자료" swapped); the intro assertion (one merged paragraph → two paragraphs, same three locked sentences in new wording); exact phrases for Art. 1050 elements, the 30-day rule and both starting points, late filing, 제48조의2 ex-officio registration, online filing, 가사사건법 제13조 / 민사소송법 제303조 / NT$30,000 / no 구인 / repeated sanction, Art. 1052 para. 2 and the 112年憲判字第4號 + 2026-10-06 status sentence, foreign-record checks, Art. 1030-1/1056/1057 sentence, Art. 1055/1055-1, Art. 1116-2, 가사사건법 제102조·107조·194조, Hague sentences, the eight evidence categories in order, link order (inline 7 → internal 3 → official 10), exactEnding (now the 10th official link + `---` + disclaimer + author), and the eojeol count 1,670 → 1,662 with read_time still 10. Every fact/number/citation/link assertion still locks that fact under the new wording. No .skip/.only/.todo, no it() removed (+4/−4 are renames), no other column's assertions touched. tests.txt reports vitest PASS, 84 files. Verdict: acceptable.

Note for the pipeline: my tiny edit below changes one locked phrase ('법원 판결로 이혼이 확정되거나…' → '대만 법원의 판결로…') and the eojeol count by +1, so draft.md is newer than .tests-ok and item.sh's finish step will re-run the tests sync. That is expected.

## Tiny edits applied (by reviewer)

1. draft.md, 협의이혼 section, third paragraph: "법원 판결로 이혼이 확정되거나 법원 조정·화해가 성립하면" → "대만 법원의 판결로 이혼이 확정되거나 법원 조정·화해가 성립하면". Restores the original's "대만 법원의" qualifier; without it a Korean reader could read the one-party registration rule as covering a Korean court judgment, which the original and the separate recognition column treat differently. Guard re-run: GUARD: PASS (length 5611 → 5337). Variety re-run: FAIL 0.

## Original issues (not blocking)

- The sources note is dated 2026년 7월 25일 while the proviso-status sentence says 2026년 10월 6일 현재; two different as-of dates in one column (carried over unchanged; the rewriter flagged it too).
- No contact line (email/address) in the original; lint tolerates this as house format for this column.
