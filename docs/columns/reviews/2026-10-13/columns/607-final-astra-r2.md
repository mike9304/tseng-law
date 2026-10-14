# C6 final review, round 2

Verdict: FIX. Do not publish these four files as they stand. Substantive eligibility and procedure issues remain; automatic lint success does not resolve them. No column file was edited in this review. This is the requested final review, not a lawyer-review or native-speaker certification.

Reviewed on 2026-10-14 against the requested column check date, 2026-10-13. The batch's two-round limit remains applicable; this report does not authorize an additional publication/review cycle.

## Scope and evidence

Read fully: brief-BATCH.md, brief-EDITORIAL-VOICE.md, COLUMN-VOICE-RULE.md, topics/C6.md, all four drafts/C6 language files including frontmatter and FAQs, drafts/C6/facts.md, and research/C6-statutes.md. Read SENTENCE-VARIETY-RULE.md, including sections 5–6, and the recurring lessons in LESSONS.md. Read the requested Fable legacy skill; the newer user instruction assigns final authority to the current reviewer.

The canonical path /Users/son7/agent-library/knowledge/editorial-voice.md does not exist on this machine. I read the complete repository copy at /Users/son7/Projects/tseng-law-columns-20261013/docs/columns/EDITORIAL-VOICE.md and the complete supplied brief copy instead. Their diff consists only of the brief's added sentence-variety section, which was also read. Also read /Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md.

Independently fetched with curl all 42 distinct official URLs appearing in the four columns. All returned successfully. Read the cited article bodies and law amendment headers, the WDA qualification/document/FAQ/graduate pages, the application portal, the NIA residence instructions, and the WDA handbook. Also opened the official English versions of all seven laws/regulations to check terminology. No judgment is cited, so there is no applicable judgment text or judgment-party identity to check.

The WDA handbook was downloaded afresh, extracted with pdftotext, and its printed pages 3 and 5 were rendered and viewed: respectively the foreign-student eligibility table and the NT$100 application/reissue fee table. Its cover says L-114-V01, April 2025. The fact sheet is not sufficient evidence by itself; for example, it says the professional-qualification sentence is not used, although the current columns do use it.

Temporary fetch evidence and manifest: /var/folders/x7/w92bx9bd09l65n9hpcq81b8h0000gn/T/c6-final-astra-r2-8x1wefek/.

Compared C6's openings against C1–C5 in each language. For the editorial comparison with three preceding available published columns, examined the openings, headings, and endings of KO 535/530/526, JA 529/525/516, EN 531/515/507, and ZH 539/538/537 in the repository. This was a structural comparison, not a new legal review of those columns.

## 1. Law and facts — required corrections

### L1 — MAJOR, EN: exchange-student eligibility omits the two-semester restriction

Original → en.md:58: “An exchange term inside a department can be the enrollment branch.” The hypothetical at line 44 identifies an American exchange student but never gives the duration of the exchange.

Problem & reason → The cited WDA handbook, printed page 3, expressly limits exchange students to those studying in Taiwan for two semesters: “交換學生(限在臺就學期間2學期者)”. A generic exchange term in a department does not establish this eligibility. The current wording invites a one-semester exchange student to treat departmental enrollment as sufficient for the enrollment branch. This is an omitted application condition, not merely awkward English. [Official WDA handbook](https://ws.wda.gov.tw/Download.ashx?u=LzAwMS9VcGxvYWQvMzIwL2NrZmlsZS9iMzE3ZTYzNS1jNmNiLTRmYWMtYmY0ZC04OWVhMDVlNDM1MjYucGRm&n=5aSW5ZyL55WZ5a2455Sf44CB5YOR55Sf44CB6I%2bv6KOU5a2455Sf55Sz6KuL5bel5L2c6Kix5Y%2bv5a%2bp5p%2bl5L2c5qWt5omL5YaKLTExNOW5tDTmnIjnt6jljbAucGRm&icon=.pdf).

Fix (required, not applied) → State the handbook's two-semester qualification with its inline citation and make the hypothetical expressly satisfy it, or replace the unsupported application to an exchange term with a direction to establish the student's eligibility first. Do not imply that school certification alone cures an ineligible exchange duration.

Facts preserved → Formal enrollment versus six months of language study; the separate school-certified condition; the need to obtain a permit; the hypothetical label. Changing the example's duration is a factual edit and therefore belongs to the writer/coordinator.

### L2 — MAJOR, KO/JA: Article 43 is reduced to whether an application was submitted

Original → ko.md:30: “고용주가 허가를 신청하지 않은 외국인의 대만 안 근무를 막습니다.” ja.md:28: “雇用主が許可を申請しない外国人は、この法律に別段の定めがなければ台湾で働けません。”

Problem & reason → These formulations describe absence of an application, rather than absence of permission obtained through the application. Filing alone is not authorization to start work. The surrounding references to working without a permit help, but do not make this purported statement of Article 43 accurate. The official English text expressly refers to obtaining an employment permit through the application process. The WDA FAQ also describes issuance after receipt and examination. [Article 43](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43), [official English Act](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=N0090001), [WDA FAQ, A7](https://ezworktaiwan.wda.gov.tw/News_Content.aspx?n=77054B15FD1F5128&sms=2E02279676D3E77B&s=5C73DC0C790B04D9).

Fix (required, not applied) → Express the rule as work being prohibited without permission obtained through the employer's application, unless the Act provides otherwise. Then retain the separately explained student self-application route. For example, use “고용주의 신청으로 허가를 받지 않은 외국인은 … 일할 수 없습니다” / “雇用主の申請により許可を受けていない外国人は … 働けません”, with the statutory exception retained.

Facts preserved → Article 43's exception, the employer-application starting rule, and Article 53's student applicant. This must not be changed into a claim that the student's employer files the student application.

### L3 — MAJOR, KO/JA: graduate-school enrollment is rendered as a research institute

Original → ko.md:46/50: “학과·학부·연구소에 정식 입학했거나” and “연구소에 다니며 학교의 동의로 수강과 관련된 연구 일을 하는 경우도 같습니다.” ja.md:52/56: “学科・学部・研究所の課程” and “研究所に在学し、学校の同意を得て、履修と関連する研究に従事する場合です。”

Problem & reason → In these student-qualification provisions, Taiwan's 研究所 means graduate school. Korean 연구소 and Japanese 研究所 ordinarily mean a research institute. This leaves the education/status condition for the Article 51(2)(2) exception misleadingly broad or obscure, especially when read apart from the hypothetical. The official English version expressly says graduate school, and the topic brief requires graduate students. [Article 51](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=51), [official English regulation](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=N0090027).

Fix (required, not applied) → Use 대학원 and 大学院 for the educational institution and state that the student is enrolled there. Preserve school consent and the relationship between the research work and the student's studies. Apply this consistently to both the ordinary enrollment branch and the research exception.

Facts preserved → Enrollment, school consent, study-related research, the exception only from Article 51(1), and the continuing Article 50/54 hours rule. This affects who qualifies, so I did not treat it as an unrestricted cosmetic edit.

### L4 — MAJOR, EN: the second deportation power loses its deadline condition

Original → en.md:92: “the National Immigration Agency may order departure within ten days or deportation, and deportation again if the person has not left.”

Problem & reason → Article 36(2)'s second power applies when the person remains after the ordered departure deadline. “If the person has not left” drops that trigger; “deportation again” incorrectly suggests a repeated deportation. The other three versions retain the expired-deadline condition. [Immigration Act Article 36](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=36).

Fix (required, not applied) → State that, for the specified violation, the NIA may deport the person or order departure within ten days, and may deport the person if they remain after the deadline in that order. Preserve the connection to Article 29(1), rather than presenting this as a power over every student.

Facts preserved → Discretionary “may”, the Article 29(1) violation, the ten-day limit, and the expiration of the departure order as the later trigger. Do not make deportation automatic.

### L5 — MAJOR, ZH: an unqualified vacation-hours statement exceeds the cited provisions

Original → zh-hant.md:40: “寒暑假沒有另一個時數，只拿掉二十小時的上限。”

Problem & reason → Articles 50 and 54 exempt winter/summer vacations from this student-specific twenty-hour cap. Their silence does not establish that no other working-hours limit exists. The English version carefully says “Those articles set no second number”; the Chinese version omits that restriction and reads as a general statement about vacation working hours. [Employment Service Act Article 50](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=50), [management regulation Article 54](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=54).

Fix (required, not applied) → Limit the statement expressly to what these two provisions prescribe, retain the vacation exception, and attach the relevant inline source. Do not add an unsourced replacement hours figure or describe vacation work as unrestricted.

Facts preserved → Twenty hours outside winter/summer vacations; these provisions do not specify a replacement vacation-hours number.

### L6 — Required clarification, KO/ZH: ambiguous paragraph reference after the hours rule

Original → ko.md:50, after citing Article 54(2): “제2항은 다른 상한을 두지 않고, 방학 중 시수도 적지 않습니다.” zh-hant.md:62, after citing Article 54(2): “第2項沒有另定時數。”

Problem & reason → The paragraph reference immediately follows Article 54(2), which expressly specifies twenty hours. The intended discussion also concerns Article 51(2), which does not prescribe a special cap. Readers should not have to infer which paragraph is meant; the JA/EN versions identify the Article 51 exception more clearly.

Fix (required, not applied) → Explicitly name the provision meant by each observation: Article 51(2) supplies the qualification exception, while Article 50 of the Act and Article 54(2) supply the student hours rule. Keep the observation about no replacement vacation figure limited to those hours provisions.

Facts preserved → No exemption from the hours rule is created; both citations and the winter/summer exception remain.

### Verified legal core and dates

The following were checked directly and are not grounds for rejection:

- All four versions correctly retain the AND between the enrollment/language-duration branch and one school-certified fact in Article 51(1), and the OR between financial hardship with evidence and the school's teaching/research need. The language-teaching exception retains language expertise, MOE approval, and the specified teaching settings; the graduate-research translation issue is separately identified above.
- Student self-application, the statutory documents, the school's review/consent, conditional omission of the original fee receipt, mandatory online filing for announced items with the justified-reason exception, the employer-specific five-year original-document retention rule, maximum one-year permit duration, and the two Article 55 refusal grounds match their sources.
- NT$100 for application/reissue is supported by the WDA handbook and the fee standards. There is no statement that the student pays it twice. The current fee standard's amendment date is 2025-12-31 and its amended provisions take effect on 2026-01-01 under Article 6.
- The student's NT$30,000–150,000 fine, Article 68(3)'s departure/work prohibition, and Article 74(3)(1)'s limited exclusion of immediate departure match the fetched Chinese text. None of the four versions says Article 74 removes the further-work prohibition. The two provisions are kept distinct.
- Employer prohibitions under Articles 44 and 57(1), the NT$150,000–750,000 range, the five-year repeat period, and the criminal maximum of three years / NT$1,200,000 match Article 63. There are no numerical calculations in the hypothetical examples to recompute.
- Article 29's petition/lawful-assembly exception and Article 23/24 school action/reporting provisions are covered. The EN procedural defect under Article 36 is identified above.
- The graduate exemption retains a Taiwan associate degree or higher, fresh-graduate status, lawful NIA extension, and the duration of that extension. Article 11 supports one year from the day after the original residence expires, one further extension if necessary, and two years total, with the listed family categories. The NIA page's item 10(2) supports the periods. The WDA graduate page supports unrestricted job categories subject to other professional-qualification laws; it does not supply a weekly-hours figure.
- Official whole-law amendment headers match: Employment Service Act 2025-01-20; management regulation 2025-12-30; foreign-professionals Act 2025-09-24; student-study regulation 2025-09-19; Immigration Act 2023-06-28; residence regulation 2025-12-30. These are whole-law amendment dates, not proof that every cited article was amended on that date.
- WDA document-page update 2024-11-14; FAQ update 2025-09-01 and site check 2026-07-15; graduate-page update 2026-01-30; NIA instructions update 2026-01-19 all match the opened pages. The column's own sources check date is correctly 2026-10-13 in every language.
- The unpaid-help/volunteering/internship passages do not invent a pay-only test. The foreign-law sentence is only a scope exclusion; it does not purport to state Korean, Japanese or US law.

## 2. Citations

All existing statute URL pcode/flno pairs were opened and lead to the provision named. All seven laws and the other official sources used in the body appear in every version's final source list. No judgment citation is present. Each file has three same-language internal links, and lint confirmed all twelve destinations exist in the repository. No same-batch column is linked.

### C1 — Required: detached legal propositions lack the brief's immediate inline citation

Original → EN opening “An alien resident certificate (ARC) does not authorize a foreign student to work”; EN:86 “Paragraph 3 orders a foreigner who violated Article 43 to leave at once and bars further work in Taiwan”; ZH:40 vacation-hours paragraph; KO:56 standalone NT$100 paragraph; JA:93 standalone “最長は2年です。”

Problem & reason → Their support is elsewhere in an adjacent or later paragraph, rather than immediately attached to the legal proposition. The brief specifically requires inline links right after claims. The source list is complete, but completeness does not cure these detached claims. The variety rule allows citation-free scenes/questions, not citation-free legal assertions used to improve the rhythm score.

Fix (required, not applied) → Attach the existing correct official source to the claim or integrate the sentence into its sourced paragraph; keep citation-free paragraphs for the labeled hypothetical or actual reader question. Audit analogous standalone limits throughout the four versions. Keep the same sources and rerun lint after the resulting length changes.

Facts preserved → ARC/permit distinction, NT$100, two-year maximum, Article 68(3) scope and consequence, and the qualified vacation-hours observation. This requires citation changes, which the reviewer's direct-edit permission excludes.

## 3. Format and other hard rules

All four files have the required frontmatter keys, matching H1/title, visa topic, language-specific audience, author legal-ai-assistant, dates and literal NNN image path. Each has three FAQs. EN title is 78 characters; its required alternative seoTitle is 41 characters; summary is 156 characters and passes the forbidden-character rule.

No private-party names, bold markup, phone/hotline numbers, street address, LINE/Kakao ID, attorney byline, lawyer-review claim or native-review claim was found. Each includes one email-only firm contact paragraph. Each hypothetical is explicitly labeled. No real client experience or judgment outcome is invented. The criminal repeat-violation consequence remains a short subsidiary point. Excluded topics are not developed beyond permitted related-column links.

The titles identify student work permission and the twenty-hour limit; none is clickbait or an imperative checklist. The Japanese title's “学期中” is less precise than “冬休み・夏休みを除く”, but the summary and body correctly state the vacation exception. Prefer that precision when revising the title.

## 4. Voice and sentence variety

### V1 — Required native-prose revision, all languages

Original → KO: “학과·학부·연구소에 정식 입학했거나, 언어 과정을 6개월 이상 배운 것.” / “끝나기 전에 한 번 더입니다.” / “그 금액으로 둡니다.” JA: “第1項は、次の両方を満たす必要があります。” / “その延長が終わる前に、必要があればもう1回です。” / “罰金を書き、併科も書きます。” EN: “Two conditions sit together” / “Neither branch, by itself, supplies the school's certified fact” / “the residence regulations runs the certificate”. ZH: “第四類見…” / “第53條要申請書…” / “例子是醫師。”

Problem & reason → These are source-note constructions, incomplete procedural statements, unnatural subjects, or literal renderings of statutory organization. Very short fragments have sometimes been added at the expense of readable prose. The reader should learn who applies, what the school certifies, and what the authority permits, without decoding references such as “the branch” or “one more”. This is recurring across sections, not one isolated typo. The four versions also follow almost the same section sequence and closely mirror these constructions, despite the instruction to write natively for each audience.

Fix (required, not applied) → Rewrite the affected paragraphs with the person or authority as subject and a complete action: e.g. “연장 기간이 끝나기 전에 필요하면 한 번 더 신청할 수 있습니다”; “必要があれば、延長期間が終わる前にもう一度申請できます”; “Article 51(1) requires both…”; “第53條規定申請時應備…”. Use 대학원/大学院 as required by L3. Preserve short sentences where they communicate a complete fact rather than an unfinished source note. Recheck each language's own flow instead of copying the revised KO sentence order.

Facts preserved → Every legal requirement, AND/OR, actor, number, citation and hypothetical label must remain. The examples above are revision directions, not applied replacements for entire paragraphs. KO/EN/ZH have only 2/1/1 units of lint headroom respectively, so a proper rewrite must balance length without cutting conditions.

### V2 — Required: end on the subject matter, not the firm contact

Original → KO: “다음 주 카페 근무 전의 허가는 … 문의하면 됩니다.” JA: “次の土曜日に始める家庭教師の許可は、…メールで問い合わせられます。” EN: “For Tuesday's rate and the enrollment letter, write to Hovering International Law Firm…” ZH: “週末早班開始前的許可，可寄信至昊鼎國際法律事務所…”。

Problem & reason → Each final body paragraph ends in a consultation instruction, not the column's facts. Mentioning the hypothetical shift does not turn a sales/contact ending into the substantive ending required by section 5(7). The English “For Tuesday's rate and the enrollment letter” also fails to say what the reader is asking the firm to assess.

Fix (required, not applied) → Retain at most one short, soft contact paragraph before the last substantive paragraph; finish on the student's still-required permission/eligibility or the defined graduate-extension condition. Do not imply that emailing the firm issues a permit or guarantees permission by the proposed start date.

Facts preserved → The firm's prescribed name/email, the labeled hypothetical, and the actual permission conditions. Do not add a generic disclaimer or a second solicitation.

MONOTONY: section 5(7), contact ending — “For Tuesday's rate and the enrollment letter, write to Hovering International Law Firm…” — place the brief contact before a final paragraph that conveys a fact specific to this student-work issue; apply the same correction in KO/JA/ZH.

### Manual sections 5–6 audit

| Item | KO | JA | EN | ZH-HANT |
|---|---|---|---|---|
| Automated checker has zero FAIL | Yes, one register-ending WARN | Yes, one register-ending WARN | Yes | Yes |
| No stock hypothetical opener | Yes | Yes | Yes | Yes |
| Batch opening type not reused, strict brief rule | Not met: factual rule opening also used in C1 | Not met: factual rule opening also used in C1/C2 | ARC misconception opening distinct | Breakfast-shop question opening distinct |
| At least two very short sentences | Yes | Yes | Yes | Yes |
| No three paragraphs with the same opening word | No breach established | No breach established | No breach established | No breach established |
| No three successive claim/citation/caveat paragraphs; at least one citation-free scene/question | Met | Met | Met | Met |
| At most three contrast templates; no invented strawman | Met | Met | Met | Met |
| Final paragraph is substantive, not contact/sales formula | Not met | Not met | Not met | Not met |
| Formal KO / polite JA register | No plain-form register mixing; fragments need V1 revision | No だ・である mixing; fragments need V1 revision | N/A | Taiwan traditional script; V1 covers clipped prose |
| No facts/citations lost through reviewer edits | No edits | No edits | No edits | No edits |

KO and JA therefore fail the user's strict manual two-item test, even though their automated checks have no FAIL. This applies the brief's explicit no-reused-opening-type requirement; I am not claiming that the broader rule allowing a type in up to half the batch was exceeded. EN and ZH have one established unmet manual item here, so I do not label them automatic two-item monotony failures. Their substantive/citation/voice corrections above still prevent PASS. EN has no body question, but its direct answer-led structure is a sufficient reason under the optional-question rule; question count alone is not a failure.

MONOTONY: section 5(2), KO repeated batch opening type — “고용주가 공립이거나 인가된 사립 대학·전문대학의 외국인 유학생을 고용하면…” — use a different opening approach from C1's rule-and-citation opening while retaining the student group and twenty-hour exception.

MONOTONY: section 5(2), JA repeated batch opening type — “申請者は、学生本人です” — distinguish the opening approach from the batch's factual-rule openings; retain the applicant fact and its citation.

First-two-paragraph deletion check: KO's first paragraph supplies covered student groups, hours and the Article 46 exception; its second supplies the applicant and ARC distinction. JA's first supplies the applicant; its second supplies the starting prohibition, date and ARC distinction. EN's first supplies the ARC distinction and its second the applicant. These contain information and are not generic filler. In ZH, the opening question sets up the breakfast-shop reader; “不能” alone adds no independent legal information beyond the following ARC sentence and needs qualification in light of the later statutory exception. The opening should be rewritten as a clear statement that an ARC alone does not establish work authorization, preserving that exception rather than deleting it.

## 5. Verification results

Commands actually run for each of ko, ja, en and zh-hant:

```text
python3 /Users/son7/tseng-col-1013-work/lint.py /Users/son7/tseng-col-1013-work/drafts/C6/<lang>.md <lang> taiwan-foreign-student-part-time-work-permit-hours
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1013-work/drafts/C6/<lang>.md
```

| Language | Lint result / body length | Variety result |
|---|---|---|
| KO | OK; 3498 characters | Exit 0; 83 sentences; CV .499; short .096; 0 FAIL; WARN 95% end in 니다 |
| JA | OK; 3974 characters | Exit 0; 95 sentences; CV .505; short .147; 0 FAIL; WARN 94% desu-masu |
| EN | OK; 1599 words | Exit 0; 101 sentences; CV .559; short .257; 0 FAIL; no warning |
| ZH-HANT | OK; 2699 characters | Exit 0; 87 sentences; CV .523; short .092; 0 FAIL; no warning |

The register warnings are not themselves failures and do not justify changing KO to plain form or JA to だ・である. No site build or deployment was performed: this is a source-column review, with publication blocked.

Reviewed file SHA-256 values:

```text
ko.md       8c198b964fdeb1721a2be6175cf7bb8c337099398d9546e911b5d1c71a477cd4
ja.md       2775061fd83d17d86a834f9e53d51cbf13d52e47908a4ed229e58d70ea20532e
en.md       fada35be9f034146ffd9520be44b5d8a21b2ba645f85ae1d5e144288fbcee3da
zh-hant.md  9043b4b4b6434472223191b9a6451917ba824e951c10e335dbbde61665d887ac
```

## Minor edits applied

None. The significant corrections concern legal qualifications, procedural triggers, citations, or recurring prose structure. They are reported for correction rather than silently rewritten under the minor-wording permission. All original facts and source links remain unchanged in the reviewed files.

## Image

Image verdict: OK for the actual available C6.jpg, which I viewed directly. It depicts a generic person from behind putting on an apron in a café, with a backpack, cups and an unbranded espresso machine. It fits student part-time work, presents no recognizable face, readable text/document, logo or flag, and is respectful. No visual regeneration is requested.

Delivery discrepancy: the specifically requested /Users/son7/tseng-col-1013-work/images/C6.webp does not exist. images/DONE.txt identifies C6.jpg as this batch's café image. The visual finding applies to that JPG only; the coordinator must supply/verify the intended WebP publication asset. I did not substitute an identically named C6.webp from a different batch or claim to have viewed the missing file.

VERDICT: FIX
