# C2 final review — round 3

Verdict: FIX. The four-language package is not publishable as supplied. Material problems remain in the notice procedure, company-form scope, and the English hypothetical's legal chronology. English also has a broken inline statutory citation. The image is OK. No column file was edited.

## Scope checked

- Read fully: brief-BATCH.md, brief-EDITORIAL-VOICE.md, COLUMN-VOICE-RULE.md, topics/C2.md, drafts/C2/ko.md, ja.md, en.md, zh-hant.md, facts.md, and research/C2-statutes.md, including frontmatter, FAQs and source lists.
- Read the sentence-variety rule, including sections 5–6, and skimmed all 25 recurring lessons. Read the original COLUMN-VOICE-RULE in tseng-col-0930-work and the repository's docs/columns/EDITORIAL-VOICE.md. The alias /Users/son7/agent-library/knowledge/editorial-voice.md does not exist; the supplied complete editorial brief and repository copy supplied its rules. The repository copy matches the beginning of the supplied brief; the brief additionally includes the sentence-variety instruction.
- Independently fetched all 30 distinct external URLs appearing in the four drafts with curl, including all 25 Company Act single-article pages, the full Act, Company Registration Regulations Articles 4 and 5, and Annexes 3 and 4. All returned HTTP 200. The encoded `J00%380001` and `J00%380020` values resolve to the correct laws; percent-encoding itself is not a defect.
- Also fetched the Regulations' full text, the Company Act amendment history, and both official English versions: 34 successful initial fetches. Compared all 25 Act articles and Regulations Article 4 against the research file after removing whitespace: 26/26 match. Read Article 5 directly. Extracted the annex PDFs and viewed their first pages, including the cited registration rows.
- For the historical defect below, additionally fetched the official Taipei legal database's 2015 full text, 2015 chapter, and 2018 amended provisions. The MOJ amendment history establishes the 2018 amendment's commencement date. These are reviewer evidence, not sources already present in the column.
- Law-level amendment dates, 2025-12-26 for the Company Act and 2021-04-23 for the Registration Regulations, match the official pages. The latest Act amendment concerns Articles 387-1 and 449. The draft does not falsely describe every cited provision as amended on that date.
- No judgment is cited. The judgments directory has no applicable text to inspect. There is no monetary example requiring arithmetic; the hypothetical dates were checked for compatibility with the law then in force.
- Ran the required lint and variety checker independently for every language. Internal-link existence was checked against the local language corpus by lint: ko/ja/en each have three links; zh-hant has two. No link points to another column in this batch.
- Compared the available C1–C6 openings in all four languages and the openings, headings and endings of local columns 522–524 in each language. This is a local publication-metadata comparison, not a certification of live-site publication order.
- Viewed the exact requested images/C2.webp with the image viewing tool. Consulted round 2 only after reading the current drafts and research independently. The latest user instruction appoints this reviewer; no Fable approval requirement or two-round stop was imposed.
- Evidence directory: /private/tmp/c2-final-astra-r3/. It contains fetch.json, downloaded official pages, extracted statute text, historical pages, and hashes.json. Annex extraction/rendering files are /private/tmp/c2-r3-annex3* and /private/tmp/c2-r3-annex4*.

## 1. Law and facts — required corrections

### L01 — Website publication becomes compulsory, while the main-content duty disappears: ko, ja, en

Original: ko.md:56, “주요 내용은 증권 주무관청이나 회사 지정 사이트에 두고, 주소는 통지에 적습니다.”; ja.md:58, “主な内容は、証券主管機関か会社の指定するサイトに置き、そのアドレスを通知に書きます。”; en.md:62, “stay listed in the notice. Main content may sit on a securities-authority or company website, with that address in the notice.”
→ Problem & reason: [Article 172(5)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=172) requires both listing the specified matters and explaining their main content. It permits the main content to be placed on the specified website, in which case the notice must give the URL. Korean and Japanese turn that optional method into an unqualified instruction. English retains the optional website but no longer expressly requires an explanation of the main content when that option is not used. A bare agenda list is not the complete statutory notice rule. The zh-hant text correctly preserves both “並說明主要內容” and “可置於”.
→ Fix required: retain the agenda in the notice, require its main-content explanation, and describe website publication as an alternative for that explanation only. For example: ko “소집 사유에 열거하고 주요 내용을 설명합니다. 주요 내용은 … 사이트에 게시할 수 있으며, 이 경우 통지에 그 주소를 적습니다”; ja “招集事由に列挙し、主な内容を説明します。主な内容を…サイトに掲載する場合は、通知にそのURLを記載します”; en “The notice must list these matters and explain their main content. The explanation may instead appear on …, provided the notice gives the URL.” Not applied.
→ Facts preserved: every listed matter; the mandatory main-content explanation; the optional website route; the URL condition; and the prohibition on extempore motions. This is a legal-meaning correction, not a reviewer-authorized minor wording edit.

### L02 — Company form is lost at substantive transitions: principally en and zh-hant; align ko

Original: en.md:40, “One government or corporate shareholder means the board exercises shareholders' meeting powers”; en.md:42, “Two directors and a sole foreign parent mean each year's approval is a dated board resolution”; zh-hant.md:40, “政府或法人股東一人時，董事會行使股東會職權”; zh-hant.md:44, “董事至少三人，股東會就有行為能力者選任”; zh-hant.md:66, “董事任期不得逾三年”. Korean's corresponding transition at ko.md:42 also starts “정부나 법인 주주 한 명이면” without naming the company form.
→ Problem & reason: [Article 128-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=128-1) expressly concerns a 股份有限公司 organized by a sole government or corporate shareholder. Sole ownership, or having two directors, does not alone move a 有限公司 from [Article 110](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=110)'s shareholder-approval procedure to that rule. English has just discussed both company forms. Chinese switches directly from the sole-corporate-shareholder exception to “董事至少三人” and shareholder election, without a heading or sentence identifying the switch to the ordinary share-company structure. Its later unqualified term statement follows discussion of limited companies. Article 108's one-to-three-director regime and omission of Article 195 from its cross-reference list must remain distinct. Japanese expressly names 股份有限公司 at the sole-owner transition and identifies the multiple-shareholder branch.
→ Fix required: explicitly name the share-company form where Article 128-1 is introduced; make the multiple-shareholder/default-board transition in zh-hant explicit; identify 股份有限公司 when stating its term ceiling. Use short company-specific subheads if helpful, but do not rely on a distant FAQ to supply the operative scope. Align the Korean sole-owner paragraph for clarity. Not applied.
→ Facts preserved: 有限公司 versus 股份有限公司; sole corporate/government ownership; the default board and charter alternatives; shareholder election versus appointment; annual approvals; and the supported three-year/holdover rules. Do not introduce a three-year limit for limited-company directors.

### L03 — The English hypothetical uses a structure not available in its stated formation year

Original: en.md:96, “In 2017 a Delaware parent formed a Hsinchu company limited by shares, took every share, and named two directors and no supervisor (a hypothetical).” Korean ko.md:96 uses 2018 without a month for the same two-director/no-supervisor structure.
→ Problem & reason: the [official pre-amendment text](https://www.laws.taipei.gov.tw/Law/LawSearch/LawArticleContent/FL011292?date=20150701) did not contain the current Article 128-1(2)–(3) charter options. Article 192 then required at least three directors and Article 216 provided for supervisors. The [2018 amendment text](https://laws.gov.taipei/law/LawSearch/LawArticleAmend/FL011292?date=20180801) added the one/two-director and no-supervisor alternatives; the [MOJ legislative history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=J0080001) records commencement on 2018-11-01. The English example presents that structure at formation in 2017 as the ordinary premise for an annual-approval problem. Calling it hypothetical does not make the historical legal premise accurate. Korean's 2018 date is not necessarily wrong, but leaves the commencement boundary unresolved.
→ Fix required: use a clearly post-commencement hypothetical formation date, or expressly identify a later, lawful charter change. If the writer intends an originally unlawful structure, that defect must be explained rather than silently treated as valid. For Korean, specify a post-2018-11-01 date or another unambiguous post-commencement year. Preserve the hypothetical label and verify any resulting tenure chronology. Not applied: the reviewer is not authorized to change dates or facts.
→ Facts preserved: the foreign sole corporate parent, Taiwan share-company form, charter-dependent two-director/no-supervisor structure, elapsed terms, missing annual approvals, and board-minute obligations. Japanese's 2019 and Chinese's 2020 examples do not have this historical defect.

### Otherwise supported legal core

The following were checked separately in each version, including summaries and FAQs: Article 20 annual documents and the NT$10,000–50,000 range; Article 108 director number/qualification/vote and the absence of Article 195 from paragraph 4; Article 110's six-month dispatch and one-month silence rules; Articles 170–174's annual-meeting default, approved-good-cause exception, 20/30-day notice periods, correctly enumerated fine triggers and ordinary quorum; Articles 228/230's 30-day submission, distribution and public-company announcement alternative; Article 231's company-release wording and unlawful-act exception; Articles 112/232/237's losses, taxes, 10% reserve and distinct capital thresholds; Articles 195/217's holdover and ordered-election deadline; Articles 183/207/210's minutes/retention/record-location rules and correction orders; and the 15-day registration-application and first-board-meeting rules with their stated exceptions. The material qualifications to this confirmation are L01–L03 and the drafting defects below.

Round-2 corrections to Article 172's fine-trigger enumeration, Article 203's English exception sentence, the registration application/completion distinction, the summaries' Article 170 exception, the annex representative's director/supervisor role, and the reconciliation recommendation are present. Article 230's public-text fine reference is paragraph 4. The source dates and fine amounts match the opened statutes. No unsupported foreign-law deadline or foreign court practice is asserted.

## 2. Citations — required correction

### C01 — Broken Article 170 inline link: en

Original: en.md:42, `[Article 170], do not apply(https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J00%380001&flno=170)`.
→ Problem & reason: this is not a Markdown link. It leaves the article label unlinked and exposes a raw URL in the prose, violating the inline-citation rule. Lint does not parse Markdown well enough to catch this.
→ Fix required: restore `[Article 170](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J00%380001&flno=170)` and place “do not apply” in the sentence outside the link. Not applied because the user forbids reviewer changes to citations.
→ Facts preserved: the same official URL, Article 170, the Article 128-1 exemption and the six-month period. Recheck English length after repair; it is currently exactly 1,600 words under lint.

Otherwise, the cited single-article URLs resolve to the correct articles and the source lists include the external sources used, with the required 2026-10-13 check date. No judgment URL is present. All internal links exist in the corresponding local language corpus.

## 3. Rules and internal evidence

### R01 — Traditional Chinese lacks any substantive subhead

Original: zh-hant.md:25–91 consists of the entire body without a `##` subhead; the sole `##` heading is the sources heading at line 93.
→ Problem & reason: brief-BATCH hard rule 6 calls for natural, topic-specific subheads. The current 2,700-character body moves repeatedly between company forms, meetings, reserves, terms, minutes and registration without signaling those changes. This contributes directly to L02. The lint only checks that some `##` heading exists, so the sources heading hides the omission.
→ Fix required: add a few natural subheads identifying those substantive transitions, and trim duplicated explanations rather than deleting legal conditions to stay within the limit. Not applied.
→ Facts preserved: all company-form distinctions, legal duties, exceptions, periods, amounts, sources and hypothetical labeling.

### E01 — facts.md is still an obsolete claim map (internal evidence defect)

Original: facts.md says the Article 172 website method and Article 230 public-company announcement exception were not written; its Article 230 distribution-fine entry identifies “제1항·제3항”; other entries still describe earlier wording such as “표지”.
→ Problem & reason: those statements do not match the reviewed public drafts, and the fine is in Article 230(4), not (3). The sheet's internal inconsistencies cannot be used as verification evidence. The public paragraph number is now correct.
→ Fix required: regenerate the claim map against the final drafts and the official paragraph text. Not applied; this reviewer was permitted to make minor edits only in the four columns.
→ Facts preserved: the actual public text and official source content. This internal defect is not counted as a new public legal error.

Other hard-rule checks: no private-party names, bold markup, telephone/hotline numbers, messaging IDs, street address, invented professional experience, or lawyer/native-review claim. Each version contains one firm/email contact line, one explicitly fictional example, the correct internal author and audience, correct date/category/topic/image-path keys, and three FAQs. English title is 67 characters, seoTitle 45, summary 160; its SEO title is required and within range. The foreign-law note stays general and directs readers to local checking. No excluded tax-filing deadline, annual Article 22-1 filing discussion or video-meeting discussion was added.

## 4. Voice and sentence variety

### V01 — Korean compression obscures the action and record

Original: ko.md:38, “제2항은 송부를 회계연도 종료 후 6개월 안에 두고”; ko.md:44, “매년 승인은 날짜 있는 이사회 의사록입니다”; ko.md:94, “얻은 표의 선거권이 가장 많은 이사”.
→ Problem & reason: these are compressed translations, not ordinary Korean explanatory prose. A provision sets a dispatch deadline; approval is a decision recorded in minutes; the convener is identified by the election voting rights represented by the votes received. The last phrase especially leaves that relationship unclear.
→ Fix required: explain the deadline with “회계연도 종료 후 6개월 안에 보내도록 정하고”; distinguish “이사회 결의” from the dated minutes recording it; express the election-vote criterion explicitly, keeping the Article 203 conditions. Not applied: coordinated revision with the legal corrections and length limit is needed.
→ Facts preserved: the deadline and its starting event, the approval actor, the record/date duty, the designated convener, both 15-day periods and the fallback. Korean otherwise maintains 합니다체 and its title/opening identify this column's issue.

### V02 — English still reads as compressed statutory notes

Original: en.md:28, “The form decides who approves”; en.md:36, “A manager is one within those duties”; en.md:62, “Main content may sit”; en.md:72, “Skipping it fines each responsible person” and “Each responsible person is again fined”; en.md:100, “Korea, Japan, and the relevant US state need a local check”.
→ Problem & reason: antecedents and actions are under-specified, and “Skipping it fines” is unnatural English. The limited-company fine sentence also needs to state explicitly that it concerns failure to set aside the required reserve, rather than merely following a sentence describing compliant distribution. Countries do not themselves “need a local check.” The abrupt move from the term ceiling to unspecified approval in the opening does not connect the two subjects.
→ Fix required: use ordinary subjects and verbs, identify the company form and accounts, state the manager's role within the performance of those duties, and tie each reserve fine to the statutory failure. Make the foreign-law note concern the relevant local meeting requirements. Resolve L01 at the same time. Not applied.
→ Facts preserved: the three-year share-company term ceiling, annual approval, responsible persons, Article 172 notice conditions, reserve thresholds and penalties, and the general/local-check-only foreign-law scope.

### V03 — Japanese still has literal, unhelpful phrasing

Original: ja.md:40, “第170条の六か月もこの会社にはありません”; ja.md:84, “記載、二十日以内の配布、存続中の保存は、必要な読み替えで董事会の議事録に使います”; ja.md:96, “残すなら実務上の目安です”.
→ Problem & reason: a deadline is inapplicable, not something a company “does not have”; the second sentence treats duties as objects to “use”; the last does not naturally explain the status of a recommended record. These phrases remain closer to drafting notes than a Japanese column.
→ Fix required: say the six-month deadline does not apply; describe the minute rules as applying with necessary adaptations; clearly distinguish required annual approval from the recommendation to retain a dated record in the sole-director example. Not applied. Preserve the です・ます register, which is otherwise consistent.
→ Facts preserved: the Article 128-1 exemption, Article 20 obligation, Article 207 quasi-application where applicable, and the sole-director example's exclusion from board provisions. Do not turn a recommended record into a statutory board-minute duty.

### V04 — Traditional Chinese has missing referents and note-like sentences

Original: zh-hant.md:38, “董事分送各股東”; line 42, “每年的承認是有日期的董事會議事錄” and “第20條仍要做”; line 48, “每年至少一次”; line 91, “此前按公司形式承認決算”.
→ Problem & reason: readers must reconstruct what is sent, what Article 20 requires, and which event occurs annually. Approval is not itself a document. The final sentence's “此前”/“公司形式” formulation is abrupt and abstract. Taiwan vocabulary and traditional characters alone do not establish natural Taiwan prose.
→ Fix required: name the 表冊, annual approval and 股東常會 where needed; describe a resolution recorded in dated minutes; explain the closing in terms of the applicable company type and its approval record. Add the substantive transitions in R01 and correct L02 together. Not applied.
→ Facts preserved: documents, company forms, actors, approval and records obligations, all numerical/legal conditions and links. Do not remove qualifications merely to hit 2,700 characters.

### Required checker results

Commands executed for each language:

    python3 /Users/son7/tseng-col-1013-work/lint.py /Users/son7/tseng-col-1013-work/drafts/C2/<lang>.md <lang> taiwan-subsidiary-annual-shareholders-meeting-director-term
    python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1013-work/drafts/C2/<lang>.md

| Language | Lint | Body length | Variety FAILs | CV | Short ratio | Run3 | Citation-end ratio |
|---|---|---:|---:|---:|---:|---:|---:|
| ko | OK | 3,500 characters | 0 | 0.452 | 0.175 | 0.109 | 0.340 |
| ja | OK | 4,498 characters | 0 | 0.477 | 0.179 | 0.036 | 0.321 |
| en | OK | 1,600 words | 0 | 0.607 | 0.336 | 0.072 | 0.195 |
| zh-hant | OK | 2,700 characters | 0 | 0.538 | 0.196 | 0.044 | 0.402 |

The zh-hant checker reports a WARN: 53% of sentences end in `）。`. It is not a FAIL. All four versions are at or extremely near their length ceilings; substantive correction requires removing repetition, not conditions or sources.

### Sections 5–6 manual self-check

- First-two-paragraph deletion test: Korean's opening supplies the sole-parent question and form distinction; the next substantive paragraph supplies the annual documents and penalty. Japanese's opening supplies term/holdover facts and the next supplies annual documents. English's first “Three years” is completed by its next paragraph, but the final sentence about approval needs the connection described in V02. Chinese's first paragraph supplies form-specific deadlines/exemption and the next supplies annual documents. Legal facts were not removed for rhythm.
- No stock hypothetical opening. C2 uses a reader question in ko, a scoped term statement in ja, a number in en and company-form/deadline facts in zh-hant. Available batch openings include questions, quotations, concrete rules, numbers and scenes; no prohibited majority of one opening type or excess scene share was established. The recent local comparison did not reveal a copied C2 opening/subheading/closing template.
- At least two genuine very short sentences exist in every language, beyond bare citation fragments. Examples include ko “한 명은 이사장입니다” / “연임도 됩니다”; ja “通知は20日前です” / “再任もできます”; en “Three years” / “No surplus, no dividend”; zh-hant “每年至少一次” / “連選得連任”. Some need context improvements under V01–V04; shortness alone is not quality.
- Manual item 4 is unmet in en: three paragraphs start with “The” (“The board calls…”, “The chair signs…”, “The director who received…”), and three with “A” (“A company limited…”, “A share company…”, “A late application…”). It is also unmet in zh-hant: three start with “有限公司” (“有限公司與…”, “有限公司沒有…”, “有限公司董事…”), and three with “董事” (“董事分送…”, “董事至少…”, “董事任期…”). The checker permits more repetitions in long articles, which is why it did not report FAIL; the requested manual rule is stricter.
- MONOTONY: repeated paragraph opening, manual item 4 (en) — “The board calls the meeting”; “The chair signs or seals the minutes”; “The director who received votes…” — vary the starting focus without losing the actor or duty.
- MONOTONY: repeated paragraph opening, manual item 4 (zh-hant) — “有限公司與股份有限公司的負責人是董事”; “有限公司沒有召集股東會的條文”; “有限公司董事的準用清單沒有第195條” — reorganize the company-form discussion and vary the opening without dropping its scope.
- No three consecutive claim–statute–caveat paragraphs were identified. Each version has an uncited hypothetical paragraph (and ko an uncited opening question). Contrast/rebuttal templates are within the limit; the endings return to tenure, approvals and records, rather than a copied disclaimer or sales pitch. Korean/Japanese register mixing was not found. The absence of body questions in ja/en/zh-hant is not a standalone violation: their concrete rule-based openings and hypothetical examples carry the explanation.
- Only one manual threshold item was established as unmet in en and zh-hant, and none of the tools returned FAIL. Therefore there is no separate automatic/manual MONOTONY FAIL under the two-item threshold. Publication is nevertheless FIX for the legal, citation and native-prose defects above. The paragraph-opening shortfalls must be addressed during revision; they are not represented as a two-item failure.
- No reviewer edit dropped a fact, number, citation or hypothetical label: none was applied.

## 5. Image

Image verdict: OK. Viewed the exact C2.webp. Blank cloth-bound ledgers, an unmarked seal and a closed ink pad on a plain wooden shelf fit the records/minutes subject. It is a respectful, non-identifying illustrative scene, with no people or faces, text, logos, flags or readable documents. There is no visual suggestion of an identifiable real party or case. No image edit is required.

## Applied edits and final disposition

Minor edits applied: none. The required corrections affect legal scope, procedure, dates, citations or coordinated prose; they are left to the writer as instructed. No draft, fact sheet or image was changed. Only this review log was created.

| Language | Publication status | Principal remaining grounds |
|---|---|---|
| ko | FIX | L01; scope clarification and Korean prose under L02/V01; clarify hypothetical date under L03 |
| ja | FIX | L01 and remaining literal prose under V03 |
| en | FIX | L01–L03, C01 and V02 |
| zh-hant | FIX | L02, R01 and V04 |

Reviewed SHA-256 (confirmed unchanged before recording the verdict):

    ko.md      6c42b812d565e300eef877e28a76798411a30a005c3d81b6f10679093d9e7002
    ja.md      deea60a16866545adf8e9c059637691fd337150cb9f13fb25c57d15d9727252c
    en.md      7a2e41f6d814e813b6f236e91d01b0a30bfb9ccd9b3f0f577dcce8c01c9c03d3
    zh-hant.md 48dca89f20164e530a5016bb8917a8a7c81beed89d456125eb9fda6dd1bfa250
    facts.md   90a79d63541c94e34620f7c514081244144815adc667cd08f4fac401353fae23
    C2.webp    71bd55601ad4af50e57d64bca8c305292275d9291432c0c57d49bf1e9f2c0df2

VERDICT: FIX      (major issues remain; listed in the log)
