# C1 final review — Astra, round 1

Verdict: FIX. None of the four versions is publishable as submitted. The automated checks pass, but substantive conditions, a deadline trigger, citation placement, and publication rules still need correction. No column files were edited by this reviewer.

Review date: 2026-10-13. Slug: `taiwan-sick-leave-half-pay-ten-day-protection`. This is an independent final review, not a lawyer-review or native-speaker-review certification. The user's current instruction authorizes Codex to make the final decision; the older Fable requirement in the batch brief does not control this review.

## Scope and evidence

Read in full: `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C1.md`, all four `drafts/C1/{ko,ja,en,zh-hant}.md` files, `drafts/C1/facts.md`, and `research/C1-statutes.md`. Also read `topics/LINKS.md`, the shared sentence-variety rule including sections 5–6, and the recurring lessons. There are no judgments cited in any version, so no judgment text or holding needed verification.

The requested `~/agent-library/knowledge/editorial-voice.md` does not exist here. I used the complete supplied `brief-EDITORIAL-VOICE.md`, also opened the repository's `docs/columns/EDITORIAL-VOICE.md` and the shared `rules/EDITORIAL-VOICE.md`, and read `~/tseng-col-0930-work/COLUMN-VOICE-RULE.md`. The supplied brief contains the newer author-disclosure instructions. No bridge inbox file matched this task.

Independently fetched with curl all 24 distinct official URLs cited by the columns: the 23 single-article pages and the Leave Rules history. Also fetched all four Chinese full-law pages to check amendment dates, the official English Leave Rules page to check the English title, two MOL pages to confirm the pregnancy-rest condition, and BLI's ordinary-sickness FAQ. The 22 cited articles already in the research file match the freshly fetched single-article texts after whitespace normalization. Labor Standards Act article 38, absent from the research extract, was opened separately and checked. Source responses are retained in `/private/tmp/c1-astra-r1-sources/`; its `manifest.json` records the initial 29 statute-page fetches, with zero fetch errors.

The Chinese Leave Rules text and history confirm the September 30, 2026 amendment, October 1, 2026 commencement, and 14-day marriage leave. They also confirm the December 9, 2025 amendment and January 1, 2026 commencement of articles 7, 9 and 9-1. The English database still shows the older December 9, 2025 version and eight-day marriage leave; I did not use that stale translation to override the current Chinese text. The other displayed amendment dates match the columns: Labor Standards Act July 31, 2024; Labor Insurance Act January 21, 2026; Gender Equality in Employment Act August 16, 2023.

Official sources used for the findings below:

- [Leave Rules article 4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030006&flno=4), [article 5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030006&flno=5), [article 8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030006&flno=8), [article 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030006&flno=9), [article 9-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030006&flno=9-1), [article 10](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030006&flno=10), [article 12](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030006&flno=12), and [history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=N0030006).
- [Labor Standards Act article 38](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=38), [article 74](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=74), and [article 79](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=79).
- [Labor Insurance Act article 33](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0050001&flno=33) and [article 35](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0050001&flno=35).
- [Gender Equality in Employment Act article 14](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030014&flno=14), [article 21](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030014&flno=21), and [article 38](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030014&flno=38).
- [MOL measures for equality at work, updated March 11, 2026](https://www.mol.gov.tw/1607/28162/28166/28284/48173/33616/) and [MOL pregnancy and childbirth benefits](https://www.mol.gov.tw/2623/2632): explicitly require a physician's diagnosis that pregnancy rest is needed.
- [BLI FAQ on short hospital stays, outpatient care and post-discharge rest](https://www.bli.gov.tw/0101530.html): ordinary outpatient-only treatment does not qualify. This supports the ordinary outpatient examples; it does not justify treating every pregnancy-rest period as necessarily non-hospitalized.

## 1. Law and facts — required substantive corrections

L1 — MAJOR, all four languages: physician diagnosis is lost for pregnancy rest.

Original: KO line 32, “임신 중 안태(安胎)를 위해 쉬는 기간도”; JA line 32, “妊娠中の安胎（流産を避けるための安静）で休む期間も”; EN line 38, “So does rest to protect a pregnancy, called 安胎”; ZH line 34, “懷孕期間安胎休養，也併入。” → Problem & reason: each version explicitly attaches physician diagnosis to cancer, then presents pregnancy rest as an independent unconditional category. Article 4(2)'s opening `經醫師診斷` also qualifies the need for pregnancy rest; MOL expressly confirms this requirement. A reader could otherwise assume self-selected pregnancy rest obtains the longer leave ceiling. → Fix required: explicitly say, in every language, that a physician has diagnosed the need for pregnancy rest. Retain the distinction between the leave-day classification and insurance eligibility. → Facts preserved: carcinoma in situ, outpatient cancer treatment, pregnancy-rest category, the combined ceilings, and the existing article-4 citation; the missing eligibility condition must be restored, not replaced by a generic recommendation to see a doctor.

L2 — MAJOR, ZH line 34: categorical insurance exclusion exceeds the source.

Original: “依第4條第2項併入的這些日數，仍不符合勞保條例的住院診療要件。” → Problem & reason: `這些日數` includes pregnancy-rest periods without stating that they involve no actual hospitalization. Counting leave under article 4(2) does not itself establish insurance eligibility, but it also does not establish ineligibility. Article 33 asks whether the insured person actually receives hospital treatment and meets its other conditions. The English version correctly uses “does not, by itself, satisfy”; ZH changes that into a categorical denial. → Fix required: limit the exclusion to outpatient/non-hospitalized periods, or state that being counted as hospitalized leave does not by itself satisfy article 33. Add the article-33 link at this comparison. Also attach the following half-pay sentence to article 4(3), rather than leaving “這項” pointing at paragraph 2. → Facts preserved: leave classification is distinct from actual hospital treatment; genuine outpatient-only days in the invented example do not qualify; article 33's remaining conditions must remain intact.

L3 — MAJOR, all four languages: the 60-day clock lacks its starting event.

Original: KO line 105, “조사한 뒤 60일 안에 처리 상황을 서면으로 알립니다”; JA line 105, “調査したうえ、60日以内に処理の状況を書面で知らせます”; EN line 103, “Written notice follows within 60 days”; ZH line 105, “六十日內應以書面通知處理情形。” → Problem & reason: article 74(4) ties the authority/inspection agency's investigation and written status notification to receipt of the complaint. KO and JA can instead be read as starting the 60 days after investigation; EN and ZH omit both the trigger and the responsible body in the deadline sentence. A statutory deadline without its trigger is incomplete. → Fix required: identify receipt of the complaint by the competent authority or inspection agency as the event from which the 60-day period runs, and identify that body's duty to notify the worker in writing of handling status. Do not promise that the dispute itself will be resolved in 60 days. → Facts preserved: 60 days, written status notification, necessary investigation, complaint routes, confidentiality, retaliation prohibition, and invalidity of retaliatory measures.

L4 — MAJOR, EN line 72: OR becomes AND.

Original: “if personal leave and the special leave in Article 38 ... still leave the worker unrecovered” → Problem & reason: article 5 says `經以事假或特別休假抵充後仍未痊癒者`. The body substitutes “and” for “or”, although the English FAQ and the other three versions preserve the alternative. This can imply that both categories must be exhausted. → Fix required: preserve “personal leave or special/annual leave” and state that the worker remains unrecovered after the relevant offset. → Facts preserved: exceeding the article-4(1) ceiling, the offset, continuing illness, permissive `得予`, and the one-year maximum unpaid leave of absence. Do not add a termination rule after that year.

L5 — MAJOR, EN line 105 and ZH line 107: unsupported foreign-law assertions.

Original: EN “Korea, Japan, and the United States do not share this half-wage rule, and inside the United States it varies by state”; ZH “韓國、日本和美國各有自己的法定病假工資，美國內部還因州而異。” → Problem & reason: these are substantive assertions about foreign statutory regimes, not merely a boundary on this Taiwan column. ZH positively asserts that all three have their own statutory sick pay; EN categorically excludes a shared rule. No foreign official source was opened or cited by the writer, as the fact sheet expressly acknowledges. Referring the reader to a professional in the next sentence does not establish the preceding assertion. → Fix required: replace with a neutral scope note directing readers to a local professional for any home-country entitlement, without asserting the content or existence of a foreign regime; alternatively verify and cite an appropriate official source while keeping the note short. KO/JA lines 107 are less categorical, but should use the same neutral scope approach if no source is added. → Facts preserved: this column concerns Taiwan and must not be used to determine overseas entitlements; no Taiwan condition or figure is to be deleted.

L6 — Required legal precision, EN lines 95 and 97: official leave duration.

Original: “As long as the law requires” and “for as long as the requiring statute needs” → Problem & reason: article 8 distinguishes the legal entitlement to official leave from duration, which is determined by actual need (`其假期視實際需要定之`). The draft instead suggests a period prescribed by the requiring statute. ZH states the actual-need criterion correctly. → Fix required: state that legally required official leave is paid in full and its duration is determined by actual need. → Facts preserved: statutory basis for entitlement and full wages; no invented number of days.

L7 — Required modality/eligibility clarity, JA line 82 and EN line 46.

Original JA: “女性の被用者は、生理で勤務が難しければ、月に生理休暇を一日請求します。” → Problem & reason: this describes requesting leave as the action the employee takes rather than expressly stating the entitlement in article 14 (`得請`). → Fix required: use the natural permission wording “月に一日、生理休暇を請求できます” with the existing difficulty-working condition. → Facts preserved: optional entitlement, one day a month, annual first-three-day treatment and half pay; do not convert a right into an obligation.

Original EN: “Coverage of one year already in place before the injury or illness adds another six months.” → Problem & reason: article 35 uses accumulated insurance seniority of at least one year before the event (`年資合計已滿一年`); “coverage of one year already in place” is unnecessarily ambiguous about accumulation and can sound like an existing one-year policy term. → Fix required: say insurance periods before the injury or illness total at least one year. → Facts preserved: pre-event accumulation, the six-month initial maximum and additional six months, with no new uninterrupted-coverage condition.

L8 — Fact-sheet mismatch; internal correction required.

Original in `facts.md`: “fever Tuesday through Thursday, back Friday, four days”. Actual KO line 48: Monday through Thursday, returning Friday. → Problem & reason: Tuesday–Thursday is three days; the fact sheet misdescribes the reviewed hypothetical. The published KO version's Monday–Thursday count is correct. → Fix required: update the internal fact sheet to match Monday–Thursday; do not introduce its mistaken Tuesday into the column. For ZH's Monday-to-next-Monday five-day example, explicitly identify five scheduled working days if it is retained, since a weekly schedule is not otherwise stated. → Facts preserved: invented status and the intended KO four-day / ZH five-workday examples. No monetary arithmetic is presented in the drafts.

Other legal checks: the three sick-leave ceilings, half-pay and top-up distinction, article-33 requirements in the main insurance paragraphs, payment frequency and six-month limits, the ten-day protection with statutory exceptions, employer burden of proof, appraisal factors beyond ten days, hourly family-care personal leave, seven-day family-care leave, menstrual-leave figures, bereavement relationships and days, marriage-leave dates, article-79(1)(3) base fine, and article-38 equality-law fine match the official texts, subject to the corrections above. Article 13 has not been wrongly extended to ordinary sick leave, and the drafts do not invent a dismissal entitlement after unpaid leave. Hypothetical day counts intentionally differ by audience; that is permitted and is not a cross-language contradiction.

## 2. Citations

C1 — MAJOR hard-rule failure, all four languages: several complete legal paragraphs have no inline source.

Original examples: KO/JA line 30 (the three statutory ceilings); EN line 36 (same); ZH line 32 (same). KO line 62, JA line 58, EN line 30 and ZH line 62 state the burden-of-proof/appraisal rules without a link in those paragraphs. EN line 38 gives paragraph-2 cancer/pregnancy treatment and paragraph-3 wage scope without an inline link. The final hypothetical application paragraphs, KO/JA/ZH line 111 and EN line 109, make several legal claims without any inline citation. → Problem & reason: the batch requires a link at the claim. A linked article elsewhere above, or only in the final source list, does not satisfy this requirement for a new substantive paragraph. → Fix required: place article-4 links at the ceilings/half-pay propositions, article-9-1 links at burden/appraisal propositions, and the corresponding article-4/9/9-1/33 links at the closing applications. Retain economical grouping where several sentences explain one provision, but do not leave the legal paragraph unsourced. Move redundant “the article says” citation-carrier sentences into useful claim sentences instead of adding more filler. → Facts preserved: existing URLs, article and paragraph numbers, conditions and dates; this is not authorization for the reviewer to change citations, so no such change was applied.

C2 — ZH FAQ 2 needs a self-contained exception reference.

Original, line 17: “第2款以外的普通傷病假” → Problem & reason: the FAQ never identifies which article/paragraph contains this item or what it covers. A standalone FAQ answer leaves the reader unable to identify the miscarriage exception. → Fix required: identify article 9(1)(2) and its substantive exception, or state that exception directly in readable language. → Facts preserved: pregnancy under three months, miscarriage, no maternity leave taken, ordinary sick leave, and the separate proportional-deduction rule.

Citation checks that passed: every external URL actually included in the body is included in its language's final official-source list; each list has the requested October 13, 2026 check date. The cited pcode/flno pairs point to the intended laws/articles, including 9-1, and all were opened. No judgment URL needs repair. All existing internal links resolve to a same-language file in the repository, as independently checked by lint; none links to C1–C6. No BLI application procedure is asserted, so its omission under the topic brief's statute-only fallback is acceptable.

## 3. Batch and format rules

R1 — MAJOR hard-rule failure, ZH: four internal links where only one to three are allowed.

Original: lines 44, 56, 74 and 105 link to payroll, maternity/parental leave, annual-leave scheduling, and labor mediation. → Problem & reason: all four exist, but brief-BATCH hard rule 8 caps the count at three. `lint.py` checks existence, not this count, which explains its OK result. → Fix required: retain at most three related links. Remove one entire link/transition only after choosing the most useful three; preserve any independent legal proposition in its paragraph. → Facts preserved: no legal claim relies on the internal link as its sole official source.

R2 — Required scope correction, all four languages: ancillary leave exceeds “table plus one sentence”.

Original: KO/JA/ZH lines 88–99 and EN lines 86–97 use a multi-sentence preface, a table, and a further prose restatement. EN additionally uses two sentences for occupational-injury leave at line 76. → Problem & reason: `topics/C1.md` explicitly limits the other leave to the table plus one sentence and occupational-injury leave to one sentence. Repeating the table's numbers also consumes space needed for omitted legal conditions. → Fix required: integrate article links and amendment/effective dates into the small comparison table or its single accompanying sentence, remove duplicate prose, and combine the English occupational-leave explanation into one sentence. → Facts preserved: 14 paid marriage days and both 2026 dates; paid bereavement 8/6/3 with all relative categories; up to 14 unpaid personal days; official leave with actual-need duration; article-6 disability/injury/illness and treatment/recuperation scope.

Other hard-rule results: no private-party names, bold markup, phone/hotline numbers, street address, messaging-app ID, invented first-person professional experience, attorney byline, lawyer-review claim or native-review claim. Each language has one short contact paragraph, the stipulated firm name, and one occurrence of `wei@hoveringlaw.com.tw`. All four have `author: "legal-ai-assistant"`, the correct audience, topic `labor`, category, dates, three FAQ items, literal NNN image path and matching title/H1. Non-English seoTitle values differ from their titles. English title is 91 characters, so seoTitle is needed; the supplied seoTitle is 37 characters and summary is 159 characters, with no forbidden summary characters. Read-time labels are plausible. The physical WebP asset remains missing, as discussed below.

## 4. Voice and sentence variety

V1 — Publication-blocking voice revision, KO/JA/EN/ZH. This is a manual naturalness finding, not a falsely reported automated FAIL.

KO original: “제4조 제1항이 나눕니다” (30), “제3항이 이 절반과 보전을 같이 적습니다” (26), “같은 규칙에 병가 옆의 휴가가 있습니다” (88), “진정을 열어 둡니다” (105). → Problem & reason: translated predicates and repeated descriptions of what a provision “writes” replace direct explanations of a worker's entitlement or employer's duty. “병가 옆의 휴가” is not natural Korean legal prose. → Fix required: use direct subjects and actions, e.g. “같은 규칙은 혼인·상례·개인 사유로 쓰는 휴가와 공가도 정합니다”; fold the article-4 citation into the entitlement sentence and describe the complaint as an available act by the worker. Keep 합니다체. → Facts preserved: all legal conditions, statutory labels and links; do not merely delete the clause that happens to carry a condition.

JA original: “雇用主の半額がかかる区間” (26), “六か月を限度に置きます” (42), “規則の沿革が日を書いています” (48), “単位を時間で選べると書いています” (66), “病欠の隣の休暇があります” (88), “申訴を開いています” (105), “皆勤手当を動かすなら” (111). → Problem & reason: these are recurring literal translations, not natural Japanese practitioner-to-reader prose. The problem spans the article and cannot be solved as one isolated typo. → Fix required: use normal expressions such as “半額支給の対象は…”, “支給期間は最長六か月です”, “時間単位で取得できます”, “申訴できます”, and “皆勤手当を減額する場合…”, with the original qualifications and links attached. Keep です・ます and explain unfamiliar Taiwan terms once. → Facts preserved: payment base, cap, hourly option, complaint right and proportional deduction; no factual broadening through smoother wording.

EN original: “Hospital treatment is the gate” (44), “Clinic days miss Article 33” (48), “The hour is that paragraph's unit” (64), “Articles 2 and 12 are the pair listed in the history” (86), and “Article 12 was revised too” (26). → Problem & reason: opaque metaphors, unnecessary commentary about the drafting of laws, and short fragments assembled to meet sentence-length targets do not produce plain active prose. The very short example sequence “No emergency room. No admission. Two days.” (52) is especially mechanical when repeated beside other chopped-up explanations. → Fix required: explain the benefit requirements and leave options directly; connect related clauses where a fragment adds no independent information. Keep genuinely useful short sentences. → Facts preserved: hospital requirement, ordinary outpatient exclusion, hourly choice, exact amendment/effective dates and all hypothetical facts/labels. Do not improve the metrics by deleting conditions.

ZH original: “門診日進不了第33條” (44), “第10條是這句” (50), “舉證那段沒有寫「前項」” (62), “小時只在第2項” (66), “第12條也改了” (54). → Problem & reason: these read as research/editing notes addressed to another drafter, not as a Taiwan column explaining what the reader may do. Several one-clause fragments omit the subject or substantive rule. → Fix required: write the entitlement, requirement or burden directly, cite it, and keep the interpretive explanation only when it resolves an actual ambiguity. For the burden-of-proof paragraph, directly state its scope rather than discussing absence of the words `前項`. → Facts preserved: article references, the burden not being limited to ten days, hourly family-care scope, and amendment dates. Taiwan vocabulary and Traditional Chinese characters otherwise pass.

First-two-paragraph deletion test, performed separately in each language:

- KO: the opening wage window and top-up carry information and must remain. “제3항이 이 절반과 보전을 같이 적습니다” repeats the preceding two claims; remove the narration while retaining its link at those claims. The next prose paragraph's injury/illness/physiological-condition trigger and all three ceilings must remain, but “범위는 ... 나눕니다” should be made direct.
- JA: the wage base / insured-salary distinction and 30-day qualification must remain, with a direct article-35 citation for the insured-salary claim. The phrase about the provision writing both rules adds no substantive information and should be folded into the actual claim. The following paragraph's eligibility trigger and all three ceilings must remain.
- EN: retain commencement, amendment date and the actual protection/exception. The opening paragraph's separate “Article 12 was revised too” and explanation that the source “records the dates” can be combined with the dated amendment statement without losing article numbers or links. The second paragraph's “Ten days is the line” repeats the opening threshold; the substantive exception and attendance-bonus qualification must remain.
- ZH: the opening proportional-deduction rule and favorable-agreement exception must remain. “條文沒有寫成整月取消” and the next sentence repeating the same proportional rule add no additional legal condition; combine them with the citation. The next paragraph's “第3項寫折半與補足” repeats the preceding half-pay/top-up statement; retain the link, remove the narration. Coverage under the Labor Standards Act remains necessary.

The first paragraphs deliver topic information, the main titles are specific rather than imperative/clickbait, and the final paragraphs return to the invented sick-leave examples rather than a copied disclaimer. I compared the openings, headings and closings of the repository's three latest same-date entries by published date and filename (522, 523, 524) in each language. These are repository samples, not a verified live-site publication sequence. C1 does not copy their generic closing disclaimer. Available C2/C3 batch openings were also inspected; C4–C6 were not yet available, so no completed six-column batch-opening distribution is certified.

Automated checks rerun independently on the reviewed files:

| Language | lint.py | Body length | variety result | CV | Very-short ratio | Similar-length run ratio |
|---|---|---:|---|---:|---:|---:|
| ko | OK, exit 0 | 3,494 characters | 0 FAIL; register-ending WARN | 0.456 | 0.101 | 0.103 |
| ja | OK, exit 0 | 3,724 characters | 0 FAIL; register-ending WARN | 0.468 | 0.179 | 0.075 |
| en | OK, exit 0 | 1,587 words | OK, exit 0 | 0.607 | 0.342 | 0.055 |
| zh-hant | OK, exit 0 | 2,700 characters | OK, exit 0 | 0.547 | 0.252 | 0.044 |

Commands executed for every language:

```text
python3 /Users/son7/tseng-col-1013-work/lint.py /Users/son7/tseng-col-1013-work/drafts/C1/<lang>.md <lang> taiwan-sick-leave-half-pay-ten-day-protection
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1013-work/drafts/C1/<lang>.md
```

Sections 5–6 manual self-check: no stock hypothetical opening; at least two very short sentences per language; no independently established three-identical-word paragraph-opening violation; no three consecutive claim–citation–caveat paragraphs; at least one nonlegal uncited scene/question paragraph; no excess contrast-template count; endings are tied to the example; KO/JA registers are consistent. Full-batch opening distribution remains unverified as stated above. I did not find two established unmet self-check items and did not manufacture a `MONOTONY` failure from the register WARNs. The separate naturalness/translationese failure V1 remains blocking under batch hard rule 6. Recheck these metrics after substantive repair: KO, EN and especially ZH are close to their upper length limits, so remove redundant prose rather than required facts.

## 5. Minor edits and image

Minor edits applied: none. The requested changes affect legal conditions, deadline triggers, citations, scope or recurring prose across whole passages and were left for the writer. No facts, figures, citations or hypothetical labels were removed by the reviewer. The wording examples above are required/recommended revisions, not applied changes.

Image verdict: REDO for the requested deliverable. `/Users/son7/tseng-col-1013-work/images/C1.webp` does not exist; the image tool returned file-not-found. I can view images and did view `/Users/son7/tseng-col-1013-work/images/C1.jpg` instead. Its visual content is OK: an empty chair, blanket, hot-water bottle and cup suggest recuperation; no faces, people, readable documents, text, logos, flags or identifying details are visible, and the tone is respectful. Supply and inspect the actual WebP deliverable before granting image OK. This finding does not require a different creative concept or regeneration of the acceptable JPG scene.

Reviewed column SHA-256 values (no edits applied):

```text
ko      49a359b2c78acec38199991274845b3bc6ad79bb4a2ba46a02ab43596fec65e8
ja      ec676b092da0de6455edbfa7fab77745f8fc559b65e4e05a56803783c44334c2
en      84a6e1eb3b1ef62df861f3d90ab4fe3c2e316fff36865e695959477c8b15488f
zh-hant ebbdadbf48dcf882da5e4b912a157b671155ecf72b71cca20615fe80cffa71b1
```

VERDICT: FIX
