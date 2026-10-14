# C6 final review — round 1

Verdict: FIX. The four versions are not publishable as submitted. Required changes are identified below; no column files were edited by this reviewer.

## Scope checked

Review performed on 2026-10-14 KST, against the requested publication/check date of 2026-10-13. This is an independent final review, not adoption of the writer's fact sheet or the previous voice review.

Read in full: `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C6.md`, all four `drafts/C6/{ko,ja,en,zh-hant}.md` files including frontmatter/FAQ/sources, `drafts/C6/facts.md`, and `research/C6-statutes.md`. Read `SENTENCE-VARIETY-RULE.md` including sections 5–6 and the recurring mistakes in `LESSONS.md`. Also read the older column-voice pointer in `~/tseng-col-0930-work/COLUMN-VOICE-RULE.md` and the shared `rules/EDITORIAL-VOICE.md` copy. The requested home canonical `~/agent-library/knowledge/editorial-voice.md` is absent on this machine; the complete local batch voice document and shared copy were available and read. The latest user instruction authorizes this reviewer to make the final decision without Fable approval.

Opened all 38 distinct official URLs used in the column/fact sheet with `curl -L`; all returned HTTP 200 with the expected content. This includes the seven full statutes, cited single articles, WDA eligibility/document/FAQ/graduate pages, and the application portal. Compared 22 research-file article texts against the live single-article text after whitespace normalization: no differences. The research file also supplies Employment Service Act Article 73; no judgment is cited in any version, so there is no cited judgment `.txt` to open. Additional official checks included the NIA residence-extension instructions, the student-registration page, the foreign-professionals Act's commencement history, and all seven official English statute titles. Source captures and URL/status index are in `/tmp/c6-astra-sources/`.

The requested `images/C6.webp` does not exist. Found and viewed `images/C6.jpg` instead; image findings and the delivery limitation are recorded below.

Compared each language's opening, subheads and ending with the three latest dated local publication files, 522–524, and the C1–C5 batch openings. This was a comparison against the local publication repository used by lint, not a claim that the live site's chronological ordering was independently verified.

Reviewed input SHA-256:

| File | SHA-256 |
|---|---|
| ko.md | 89c45f7c83b915393949bdf6ff31a7a62eec90b35cf9293a5fe6b93f4be7724e |
| ja.md | 458db90831339c0f183594249bc28bdc08ce54185f83b044203343c2c435f008 |
| en.md | 0ba8a9d32ab2a74613d45a823664dd488874437b5395a37f267d4688ab6d8f49 |
| zh-hant.md | 4af4d4adc1d335da9b1a6a24f6597796aafb49b8cfe7b7b70b14e1e9803224ab |
| C6.jpg | cb419f6f038348c868a8a8a7b4ce83604977d4329754b231b154cf8c263ff559 |

## 1. Law and facts — required changes

### L1 — Article 50 is incomplete; school qualifications differ across languages

Original: KO line 28, “제2호는 고등학교 이상에 다니는 교포 학생과 그 밖의 화예 학생입니다”; JA line 36, “同じ条の第2号は、高校以上に在学する僑生とその他の華裔学生です”; EN line 38, “Item 2 covers overseas Chinese students and other ethnic Chinese students at senior high level or above.” All four versions discuss the cap without stating Article 50's exemption from Article 46(1)'s job-category restrictions.
→ Problem & reason: Article 50 item 2 also requires the school to be public or a registered private institution. ZH line 38 preserves that condition; KO/JA/EN omit it in their item-2 descriptions. The exemption from Article 46(1) is explicitly required by `topics/C6.md` and is absent from every version. EN's “Public colleges and universities ... may have foreign students hired” also obscures the statutory subject: employers hire students enrolled at those institutions.
→ Fix required: State the employer/student relationship and both categories accurately; restore the public/registered-private qualifier for item 2 in KO/JA/EN. Add the Article 46(1) job-category exemption in every language, without turning it into exemption from a work permit or from other professional laws. Keep the [Article 50 citation](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=50) adjacent.
→ Facts preserved: Both student categories, their school levels, the 20-hour maximum and winter/summer-vacation exception; restore the omitted restrictions and permission.

### L2 — English Article 51 compresses away material qualifications

Original: EN line 58, “or a teaching or research unit needs the student's help”; line 62, “Or graduate research tied to the courses, with the school's consent.”
→ Problem & reason: Article 51(1)(2)(ii) specifies a teaching/research unit of the school the student attends. “A ... unit” is wider. Article 51(2)(2) requires the person to be enrolled in a graduate institute, as well as school consent and research related to their coursework. A type of research described as “graduate research” does not state the student's enrollment qualification. KO/JA/ZH state graduate enrollment more explicitly. These are eligibility conditions, not optional stylistic details.
→ Fix required: Express “a teaching or research unit at the student's own school” and “students enrolled in a graduate institute who, with their school's consent, undertake research related to their coursework,” retaining the full AND/OR structure and [Article 51](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=51).
→ Facts preserved: Formal enrollment OR at least six months of language study, PLUS the school-certified fact; either paragraph-2 exception; Ministry of Education approval where required; the continuing statutory hours limit.

### L3 — Graduate work permission drops the official professional-qualification caveat

Original: KO line 93, “그 기간의 업무 종류에 제한이 없고”; JA line 99, “その期間の仕事の種類に制限がなく”; EN line 119, “No limit on the kind of job during that period”; ZH line 103, “工作類別無限制”.
→ Problem & reason: The cited [WDA fresh-graduate page](https://ezworktaiwan.wda.gov.tw/cp.aspx?n=511766BD9E956242) immediately explains that occupations requiring professional qualification or practice registration under other laws still require that qualification. The fact sheet expressly says this second sentence was not used. Unqualified language about unrestricted job types omits a material condition of the source.
→ Fix required: Preserve the work-permit exemption and add a concise sentence that other legally required professional qualifications/practice registrations still apply. Cite that same page next to the qualification. Do not claim unlimited working hours.
→ Facts preserved: Taiwan associate degree or higher, fresh-graduate status, lawful NIA-approved extension, no work-permit application during that extension, and the two-year maximum. Add the omitted qualification rather than broadening the exception.

### L4 — Extra gloss on Article 74 exceeds the brief's exact-text limit

Original: EN line 92, “The work bar stays.” ZH line 82, “不得再工作的那一句還在。”
→ Problem & reason: The article correctly distinguishes Article 74(3)(1)'s immediate-departure exception from Article 68(3). But these stand-alone conclusions invite the reader to understand ordinary permit expiry as a continuing personal disqualification from future employment. The topic brief specifically requires sticking to the statutory text and not paraphrasing beyond it. Article 74(1) also has the “unless otherwise provided by this Act” qualification; these glosses detach the conclusion from it. This finding does not assert that Article 74(3) itself authorizes work, nor prescribe the result of a new permit application.
→ Fix required: Remove the extra glosses and use a precise, attributed rendering of [Article 74(1) and (3)(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=74), keeping the expiry/revocation triggers, statutory exception, relevant student categories and Article 73 items 1–5. Keep [Article 68(3)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=68) separately tied to Article 43 violations. If explaining future applications, independently source that explanation; do not infer a permanent ban or automatic permission from these sentences.
→ Facts preserved: The actual statutory work prohibition and the limited immediate-departure exception, without adding an unsupported duration or future-eligibility conclusion.

### Other legal and numerical checks

The following substantive figures and provisions were verified: six months of language study; both Article 51(1) requirements and the two paragraph-2 exceptions, subject to L2; student application under category 4; application/receipt/other documents; announced online filing and the justified-reason exception; five-year retention expressly assigned to employers, not converted into a student duty; one-year permit maximum; 20 hours outside winter/summer vacations; refusal for false material or failure to cure a noncompliant application by the deadline; NT$100; NT$30,000–150,000; NT$150,000–750,000; repeat within five years with the stated three-year/NT$1,200,000 criminal alternatives; Articles 29 and 36(2)(4), including discretionary deportation/order within ten days rather than automatic deportation; school action/reporting under Articles 23–24; and Article 11's one-year extension plus one further extension if needed, maximum two years. No arithmetic example requires calculation.

The seven law-wide amendment dates agree with the official headers. The fee standards' amended provisions take effect on 2026-01-01, as stated. The 2025-09-24 foreign-professionals amendment is a promulgation/amendment date; the official [history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=A0030295) confirms Article 12 took effect on 2026-01-01. Do not rewrite the amendment date as Article 12's effective date, or a law-wide amendment date as the amendment date of every quoted article.

The WDA document-page date 2024-11-14 and FAQ update/check dates 2025-09-01 / 2026-07-15 agree with the pages. The official [student-registration page](https://ezwp.wda.gov.tw/wcfonline/wSite/Control?_action=acct30%2Facct30_ap.xml&function=RunAction) includes exchange students in its foreign-student explanation. I therefore do not reject the English example merely because it concerns an exchange student. It still needs the applicable enrollment, school certification and permit conditions, not assumed eligibility from an exchange label alone.

## 2. Citations and required source provenance

### C1 — Two topic-specific agency-source requirements are unmet

Original: All four fee sections source NT$100 to fee-standard Articles 2/4/6; all four residence-extension sections source one year plus a possible second year to residence-regulation Article 11 and a WDA graduate page. No `immigration.gov.tw` source appears in any column's sources list.
→ Problem & reason: The numbers are corroborated by the official statutes. Nevertheless, `topics/C6.md` explicitly requires the fee to be taken from an opened official WDA page and the extension length from an opened official immigration.gov.tw page. None of the WDA pages cited for this column states the fee amount; the FAQ explains payment methods but does not give the amount. The writer's fact sheet confirms that it elected to use Article 11 for the length instead of an NIA page. This is noncompliance with the source specification, not a finding that NT$100 or two years is numerically wrong.
→ Fix required: Open and cite a WDA source that actually states the student's fee. For the extension, the reviewer opened the [NIA residence/extension instructions](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/29996/), updated 2026-01-19; “申請須知或注意事項” item 10(2) supports one year, one further extension if necessary, and a two-year total under Article 11. Add the required agency sources inline and to each language's sources section, retaining the requested check date and the statutory support.
→ Facts preserved: Fee amount, extension duration, commencement point under Article 11 and conditions; only the missing required provenance is supplied.

### C2 — Key legal propositions are separated from their supporting links

Original: The paragraph beginning “제2항은 제1항의 제한을 받지 않는 사람을 적습니다” (KO 52), “第2項は、第1項の制限を受けない人を二つ書きます” (JA 58), “Paragraph 2 steps past paragraph 1 in two cases” (EN 62), and “第2項不受前項限制的” (ZH 60) has no Article 51 link beside the exemption claims. EN 28, “Students file that permit,” and JA 26/ZH 28 state the applicant rule without adjacent Article 53 support. EN 82 states the Article 54(1) term beside a link to Article 55, while its Article 54 link is several paragraphs earlier.
→ Problem & reason: The reader must hunt back or forward to identify the legal basis. A link to Article 54 for hours does not substantiate Article 51 eligibility exceptions; an Article 43 link states the general employer-application rule, not the special applicant route. The batch requires inline links at the relevant claims.
→ Fix required: Attach Article 51 directly to the exemption paragraph in every version, Article 53 to the early personal-application claim where used, and Article 54 to the English permit-term claim. Sweep all versions for the same separation, especially isolated numeric paragraphs and uncited reiterations. Existing statutory URLs resolve to the correct article; preserve them rather than replacing them with generic homepages. The newly required sources in C1 must also be listed at the end.
→ Facts preserved: All legal propositions and numbers; citation placement/support repaired only.

Sources lists otherwise identify all the statute families and agency pages currently used and carry 2026-10-13 in the page language. The seven English statute names match the official English database. Each version has three internal links, all to existing same-language files; lint independently confirmed existence. No batch-to-batch link or judgment-link problem was found.

## 3. Hard format/contact rules

All four currently pass the supplied lint. Frontmatter has the required keys, `topic: "visa"`, matching audience, `author: "legal-ai-assistant"`, the literal NNN featured-image path, publication/lastmod date and three FAQs. EN's summary is 150 characters and its SEO title meets the required range. Titles/H1s match. No bold, phone/hotline number, street address, private-party name, lawyer/native-review claim or invented professional byline was found. Each has one email-only contact paragraph with the permitted firm name. Hypotheticals are expressly labeled. The foreign-law sentence is a scope note, not an unsupported statement of foreign law. Criminal consequences are confined to the brief's short repeat-offense clause.

These passes do not cure L1–L4, C1–C2 or the voice/image findings.

## 4. Voice and sentence variety

### V1 — Publication-level naturalness requires a coordinated rewrite

These are pervasive sentence/concept problems, not a small typo pass. No broad rewrite was applied at this final gate.

- KO original: “이번에 가져온 조문에는”, “유학생으로 세는 사람”, “여기서 갈립니다”, “신타이비”, “증조비”, “응계 졸업생”, and FAQ “주 20시간은 ... 문장입니다.” → Problem & reason: internal research narration, literal Chinese-derived terms without useful Korean explanation, an empty transition, and discussion of a statute's “sentence” instead of the reader's rule. “한 건에 100원입니다” and the table's bare “원” also make the currency harder to read in Korean despite the surrounding Taiwan context. → Fix required: Describe the student eligibility and actions directly; explain the statutory 應屆畢業生 qualification in natural Korean, retaining the Chinese term where necessary rather than inventing a calendar-year or elapsed-time definition. Consistently identify NT$/대만달러 without conversion. Replace “여기서 갈립니다” with the actual distinction or integrate it into the next sentence. → Facts preserved: Every legal condition, original amount, unit, date, link and hypothetical label; no change to the fresh-graduate eligibility rule.
- JA original: “外国籍留学生に数える人”, “二つとも満たすように書きます”, “第2号の認定まで埋まりません”, “人を二つ書きます”, “第2項 ... の文です”, and repeated “と書きます”. → Problem & reason: these are calques and descriptions of writing, not natural Japanese legal guidance. “学業と生活を続けられない資力” is an awkward way to express inadequate financial means. → Fix required: Use constructions such as “外国人留学生に当たる人”, “次の両方を満たす必要があります”, “大学院に在籍しているだけでは、同項第2号の要件まで満たしたことにはなりません”, and describe the two exceptions as cases/qualifications. Maintain natural です・ます and avoid piling up こと fragments. → Facts preserved: Required conditions and all qualifications, particularly AND versus OR; original citations retained.
- EN original: “Students file that permit”, “Work without a permit is the fine”, “Both items share the hour sentence”, “Only U.S. nationality ... usually starts at item 1”, “Paragraph 2 steps past paragraph 1”, “Article 55 refuses false materials”, and “One year” immediately after the same limit. → Problem & reason: incorrect collocations, fragments, personification of provisions and research-note prose. Students file an application; unlawful work can attract a fine; the authority refuses an application. These patterns recur throughout body and FAQ. → Fix required: Use plain subjects and verbs, e.g. “Students apply for the permit themselves”; “Working without a permit can result in the fine specified ...”; “The same weekly limit applies to both groups”; “The authority must refuse an application ...”. Recast the paragraph-2 exceptions with the conditions in L2 and remove empty repetition without losing the actual limit. → Facts preserved: Legal force, eligible persons, numbers, exceptions and all supporting links; no automatic permit entitlement added.
- ZH original: “第50條把同一句時數用在”, “寒暑假那幾週沒有第二個時數”, “該款的人”, “第12條和該頁沒有重寫每週時數”, and FAQ “沒有許可就工作，是...的罰鍰”. → Problem & reason: metatext and unnatural predicates obscure otherwise simple Taiwan legal concepts. “開班之前” also describes opening a class, not beginning the breakfast-shop shift. Several law names are shortened before being introduced in full in the body. → Fix required: Use Taiwan prose about the people and rules, e.g. “這兩類學生都適用同一工時上限”, identify the full law at its first substantive appearance, and use “開始工作前”. Explain which student rule applies instead of saying a page did not “rewrite” hours. → Facts preserved: The distinction between student work and the graduate extension, exact limits, cited laws and hypothetical status.

First-two-paragraph deletion test: KO's “주 20시간입니다” repeats the next paragraph's fully qualified limit; JA's opening applicant sentence is repeated in paragraph 2; EN's two opening facts are useful but the second needs the correct “apply” verb and Article 53; ZH's question supplies the shop-reader frame and the answer supplies the permit distinction, but the applicant statement is repeated immediately afterward. Integrate redundant opening sentences into a sourced opening. Do not delete the only occurrence of a condition or use short filler solely to pass the variety metric.

### V2 — Manual MONOTONY gate fails despite zero automatic FAIL lines

MONOTONY: EN section 5 item 4, repeated paragraph starter — “Article 43 ...”, “Article 53 asks ...”, “Article 4 ...” (lines 30, 70, 74; rendered link labels counted) — start at least one with the relevant actor or application step while keeping the article/link at the claim. The tool allows a higher dynamic threshold for long pieces; the user's manual three-paragraph test still applies.

MONOTONY: EN section 5 item 6, rebutting an unmade claim — “Paid tutoring is not a word those paragraphs use. Tuesday's lessons are not automatically the research in paragraph 2, item 2.” (line 64) — no claim that this exchange student's tutoring is graduate research was made. Explain the actual research exception and the permit/eligibility question for this student's offered work without constructing that argument.

MONOTONY: ZH section 5 item 4, repeated paragraph starter — “管理辦法第50條要求”, “管理辦法第51條第1項要”, “管理辦法第7條規定” (lines 50, 56, 72) — vary the grammatical subject with the student, school or application step; retain all three statute citations.

MONOTONY: ZH section 5 item 6, rebutting an unmade claim — “週末早班不會自動變成研究那一款。” (line 62) — the shop owner never claimed breakfast-shop shifts were research. State the actual school-certification requirement and its applicable exceptions, without the invented rebuttal.

EN and ZH therefore each have at least two unmet manual self-check items and require changes under sections 5–6. Do not report their automatic OK as a manual variety PASS. JA's three statute-title openings beginning “外國” are also a rhythm concern; because the complete law names differ, I have not treated that two-character heuristic alone as a decisive same-word failure.

Self-check coverage:

| Item | KO | JA | EN | ZH |
|---|---|---|---|---|
| Automated checker: zero FAIL | Yes, warning only | Yes, warning only | Yes | Yes |
| No stock hypothetical opener | Yes | Yes | Yes | Yes |
| At least two very short sentences | 8 | 17 | 38 | 13 |
| No three paragraphs with same starter | Met | See title-prefix note | Unmet | Unmet |
| No three claim/citation/caveat paragraphs; at least one uncited scene/question paragraph | Met | Met | Met | Met |
| Contrast count at most 3; no invented rebuttal | Met | Rewrite awkward metatext | Unmet | Unmet |
| Last paragraph tied to column facts | Yes, but recap is mechanical | Yes, but recap is mechanical | Yes, but recap is mechanical | Yes, but recap is mechanical |
| KO/JA register; no bold/invented first person/checklist heading | Met | Met, notwithstanding awkward fragments | Met | Met |
| Facts/citations/hypothetical markers preserved by reviewer | No edits | No edits | No edits | No edits |

Batch comparison: C6 uses a numeric lead in KO, a short applicant assertion in JA, an ARC/permission distinction in EN, and a shop-reader question in ZH. It does not use the stock hypothetical opening; C1–C5 also include numerical, question, quoted-document and hypothetical-scene forms. The short assertion and the repeated contact-plus-recap construction still need the naturalness work above; I do not certify literal uniqueness of broad “fact” openings across the batch.

### V3 — Hypothetical timing contradicts itself in ZH

Original: ZH line 44, “排進週末早班（虛構情境）。時薪寫在訊息裡，下週一開始。”
→ Problem & reason: A proposed weekend morning shift is then said to begin on Monday, with no explanation of a different shift or training day.
→ Fix required: Make the proposed starting day consistent with the weekend scenario. This changes a stated scenario fact, so the final reviewer has not silently edited it.
→ Facts preserved: Fictional breakfast-shop context, six months of language study, proposed paid work, and explicit 虛構情境 marker; only the inconsistent scheduling detail needs writer correction.

## 5. Image

Image verdict: REDO for delivery/completion, not a demand to regenerate the artwork.

Original: requested `images/C6.webp` → Problem & reason: file is absent, so that exact publishable asset could not be inspected or approved → Fix required: supply the intended WebP and verify it is the approved image; inspect the final exported file before release → Facts preserved: no article or image content changed by reviewer.

Available `images/C6.jpg`: viewed with the image tool. Visual content is OK: a fictional-looking, unidentifiable person seen from behind tying an apron in an unbranded café; no identifiable face, readable documents, text, logo or flag; relevant to student café work and respectful. The batch image manifest describes the same scene. This visual OK for the JPG is not confirmation that the missing WebP exists or has identical content.

## Verification and minor edits applied

Minor edits applied: none. Required substantive, citation and coordinated voice repairs remain with the writer. No source, number, condition, hypothetical label or file outside this review log was changed.

Executed for each language:

`python3 /Users/son7/tseng-col-1013-work/lint.py /Users/son7/tseng-col-1013-work/drafts/C6/<lang>.md <lang> taiwan-foreign-student-part-time-work-permit-hours`

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1013-work/drafts/C6/<lang>.md`

| Language | Lint | Length | Variety result |
|---|---|---|---|
| KO | OK, exit 0 | 3,499 characters | exit 0; cv .499, short .096; warning: 93% ending in 니다 |
| JA | OK, exit 0 | 3,845 characters | exit 0; cv .529, short .185; warning: 95% です・ます endings |
| EN | OK, exit 0 | 1,600 words | exit 0; cv .602, short .333; no automatic violation |
| ZH | OK, exit 0 | 2,700 characters | exit 0; cv .577, short .141; no automatic violation |

The ending warnings alone are not register failures. EN and ZH fail the separate manual gate. KO, EN and ZH sit at or almost at the maximum length; repairs must be followed by fresh lint and variety checks. Do not meet the length limit by dropping legal conditions or sources.

VERDICT: FIX
