# C6 final review — round 3

Verdict: FIX. Two eligibility statements still require correction before publication: the English exchange-student passage and the first FAQ in Korean, Japanese and English. Nine minor wording/grammar edits were applied. All four final files pass lint and the automated variety checker. Image: OK.

Reviewed on 2026-10-14 against the requested source-check date of 2026-10-13. This is the expressly requested third review; the current user instruction assigns final review authority to this reviewer and supersedes the older Fable-dependent workflow. No publication or deployment was performed.

## Scope checked

Read each required file fully: `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C6.md`, all four `drafts/C6` language files including frontmatter/FAQ, `drafts/C6/facts.md`, and `research/C6-statutes.md`. Read `SENTENCE-VARIETY-RULE.md`, including sections 5–6, and the recurring reviewer lessons. The named `~/agent-library/knowledge/editorial-voice.md` is absent on this machine; read the complete supplied brief and the repository canonical copy at `/Users/son7/Projects/tseng-law-columns-20261013/docs/columns/EDITORIAL-VOICE.md`, plus `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md` and the shared rules copy. Applied the current direct-review instructions, not retired subcontracting requirements.

Independently opened with curl all 42 distinct official URLs cited across the four files. All returned HTTP 200, including the application portal's redirect. The 23 article texts in `research/C6-statutes.md` match the freshly fetched official article texts after whitespace normalization. Also opened the seven official English law pages to verify the English names. Read the additional fee provisions, Article 46, residence Article 11, WDA qualification/document/FAQ/graduate pages, and NIA instructions. Downloaded the WDA PDF handbook anew; read its relevant tables and viewed rendered PDF pages 4 and 6, printed pages 3 and 5. The cover identifies L-114-V01, April 2025. No judgment is cited, so there is no applicable judgment text to open.

Fetched pages, readable extracts, URL/status manifest, before-edit copies, exact minor diffs and verification outputs are in [evidence-r3](./evidence-r3/). The fact sheet was treated as an index of claims, not proof.

Checked C1–C5 openings in each language, and compared available preceding published-column structures: KO 535/530/526, JA 529/525/516, EN 531/515/507, ZH 539/538/537. This comparison was for voice and structure, not a new legal review of those other columns.

## 1. Law and facts — required corrections

### L1 — MAJOR, EN: the two-semester condition is expressed as a limit on exchange study

Original → `en.md:54`: “The Agency handbook limits exchange students to two semesters in Taiwan. A shorter exchange stays outside that limit.”

Problem & reason → The handbook's student-work-permit eligibility table includes exchange students with the qualification “交換學生（限在臺就學期間2學期者）”. It restricts the eligible category; it does not impose a maximum duration on exchange study itself. “Limits exchange students to two semesters” reads as that unsupported duration cap, while the following shorter-exchange sentence points in the opposite direction. The new hypothetical does now specify two semesters, and the separate school-certification requirement is retained; those parts of the prior correction are resolved. The remaining problem is the stated scope of the rule, not a missing number. See the [official WDA handbook, printed page 3](https://ws.wda.gov.tw/Download.ashx?u=LzAwMS9VcGxvYWQvMzIwL2NrZmlsZS9iMzE3ZTYzNS1jNmNiLTRmYWMtYmY0ZC04OWVhMDVlNDM1MjYucGRm&n=5aSW5ZyL55WZ5a2455Sf44CB5YOR55Sf44CB6I%2bv6KOU5a2455Sf55Sz6KuL5bel5L2c6Kix5Y%2bv5a%2bp5p%2bl5L2c5qWt5omL5YaKLTExNOW5tDTmnIjnt6jljbAucGRm&icon=.pdf).

Fix (required, not applied) → Make eligibility the explicit subject: for example, “The Agency handbook includes exchange students studying in Taiwan for two semesters in the eligible category. A shorter exchange does not meet that condition.” Retain the existing inline handbook link, hypothetical duration and label, separate school-certified fact, and permit requirement. Do not introduce “at most”, “at least”, or a general exchange-residence limit that the quoted source does not state.

Facts preserved → Two semesters; work-permit eligibility rather than exchange-program duration; school certification remains independently necessary. This changes the scope of a purported legal rule, so it was not silently edited as a grammar correction.

### L2 — MAJOR, KO/JA/EN FAQ 1: the alternative enrollment branches are not clearly preserved

Original → `ko.md:15`: “정식 학과 입학과 언어 과정 6개월 이상을 같은 요건으로 둡니다.” `ja.md:15`: “学科への正式入学と、語学課程を6か月以上学ぶことを同じ要件に置いています。” `en.md:15`: “pairs six months or more of language study with formal enrollment in a department or graduate program.”

Problem & reason → [Article 51(1)(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=51) expressly uses 或: formal enrollment in the specified courses OR language study for six months or more. That alternative is then combined with the separate school-certified condition in item 2. “The same requirement” / “同じ要件” / “pairs … with” does not clearly communicate that disjunction and can suggest a combined enrollment-and-six-month requirement. These FAQs can be read independently of the body, where the OR is correctly retained. ZH says the alternatives are in the same numbered item, rather than calling them the same requirement, and its language-course context is explicit; it does not have the same defect.

Fix (required, not applied) → State the alternatives explicitly in the three FAQs: “정식 학과 입학 또는 언어 과정 6개월 이상”, “学科への正式入学または語学課程の6か月以上の履修”, and “either formal enrollment in a department or graduate program, or at least six months of language study”. Keep the following explanation directed to the question's language-course student and keep item 2 as an additional requirement. This is a clarification of legal qualification, not an invitation to remove the six-month condition or the Article 51(2) exceptions explained in the body.

Facts preserved → OR within item 1; AND between item 1 and item 2; six months attaches to language study, not to ordinary formal enrollment. No substantive FAQ correction was applied by the reviewer.

### Verified core and resolved prior issues

For each language, checked the student group, applicant, qualification branches, exceptions, hours, permit validity, fee, refusal grounds, sanctions and graduate extension against the official text. Apart from L1–L2 above:

- Articles 43 and 48 retain the starting permit rule and the spouse-with-household-registration plus permitted-residence exception. KO/JA now describe permission obtained through an application, not merely filing an application.
- The Article 50 student groups and exemption from Article 46(1) job categories are correctly limited. Twenty hours is the maximum outside winter and summer vacations. The vacation observation is now expressly about Articles 50 and 54, not an assertion that all vacation working-hours restrictions disappear.
- The body of every language preserves Article 51(1)'s AND/OR structure. Article 51(2)'s language expertise, MOE case approval, specified teaching activities, graduate enrollment, school consent and study-related research are retained. KO/JA now use 대학원/大学院. The qualification exception is distinguished from the hours provisions.
- Category 4 and student self-application, Article 53 documents, school review/consent and conditional omission of the original receipt, announced online filing with the justified-reason exception, employer-specific five-year document retention, maximum one-year validity, and Article 55 refusal grounds match the sources.
- NT$100 for application/reissue is supported by the WDA handbook and fee provisions; the column does not charge it twice. The fee standard was amended 2025-12-31, with amended provisions effective 2026-01-01 under Article 6.
- Student fine NT$30,000–150,000; Article 68(3)'s departure/work prohibition; and Article 74(3)(1)'s exception only from Article 74(1)'s immediate-departure provision are accurately distinguished. No version says that exception removes the work prohibition.
- Immigration Article 29 and Article 36(2)(4) retain the specified activity violation, discretionary deportation or departure order within ten days, and the expired-order condition for the later deportation power. School handling and status reporting match study-regulation Articles 23–24.
- Employer prohibitions and NT$150,000–750,000 fine are supported by Articles 44, 57(1) and 63. The short repeat-within-five-years sentence retains the three-year imprisonment limit, short-term imprisonment and NT$1,200,000 criminal-fine limit/combination.
- Article 12 retains the Taiwan associate-degree-or-higher, fresh-graduate status and lawful NIA extension conditions. Residence Article 11 and NIA instructions item 10(2) support one year from the day after the previous residence expires, one further extension if needed, two years total, and the specified family members. Work-type freedom is qualified by required professional qualifications/registration. No version invents an unlimited post-graduation weekly-hours rule.
- Amendment dates checked: Employment Service Act 2025-01-20; management regulation 2025-12-30; foreign-professionals act 2025-09-24; student regulation 2025-09-19; Immigration Act 2023-06-28; residence regulation 2025-12-30. Agency dates match the pages: documents 2024-11-14; FAQ updated 2025-09-01/check 2026-07-15; graduate page 2026-01-30; NIA instructions 2026-01-19.
- The hypothetical examples contain no arithmetic calculation. Repeated fine ranges in the tables agree with the body. Unpaid work/volunteering/internships are left for inquiry, without inventing a pay-based legal test. Foreign-law text excludes those systems from scope and states no foreign rule requiring further sourcing.

Internal fact-sheet note → “The same page's next sentence, about obtaining a professional qualification … is not used in the column” is stale: all four current bodies use that qualification. Update the fact sheet to reflect the actual draft. The qualification itself was independently verified on the cited WDA page, so this documentation discrepancy is not an additional publication blocker. Facts preserved: the exception remains in the columns.

## 2. Citations and hard rules

All cited statute URL pcode/flno pairs were opened and matched the named articles. The final source lists include all seven laws and every additional official source used, with check date 2026-10-13. The previously detached claims now have their source in the same paragraph or an immediately attached citation. The handbook's exchange-student claim has a valid citation but misstates its scope as described in L1.

All four versions have three same-language existing internal-column links. Lint checks their actual files under `/Users/son7/Projects/tseng-law-columns-20261013/src/content`; all twelve passed. None points to another column in this batch. No judgment is cited.

Frontmatter, matching H1/title, dates, category, `topic: visa`, language-only audience, three FAQs, literal NNN featured-image path and `author: legal-ai-assistant` are present. EN title is 78 characters, required seoTitle 41, summary 156; the summary has no forbidden characters. Read times are plausible for these dense medium-length legal columns.

No private-party name, bold markup, phone/hotline number, street address, LINE/Kakao ID, attorney byline, lawyer-review claim or native-review claim is present. Each file has one short email-only firm-contact paragraph before its final substantive paragraph. Each invented scene is labeled. No invented professional experience or outcome guarantee appears. The excluded topics are not developed beyond permitted internal links.

## 3. Voice and sentence variety

Titles identify student work permits/hours and are not clickbait or imperative checklists. The openings provide the specific limit, ARC distinction or the breakfast-shop question. KO uses 합니다체; JA uses です・ます without だ・である mixing; ZH uses traditional script and Taiwan institutions/usage. Some dense source-note phrasing remains, but the concrete publication blockers are L1–L2, not a renewed request to rewrite already-correct statutory content.

First-two-paragraph deletion test: KO/JA's first paragraph supplies the numerical ceiling, vacation exception, covered groups and job-category exemption; deleting those sentences loses conditions or the antecedent for “상한/上限”. Their second paragraph supplies the student applicant. EN's first two paragraphs separately supply the ARC distinction and self-application. ZH's first question establishes the shop-owner/shift context; its next paragraph answers it with the permit rule, spouse exception and student applicant. No generic “this article will explain” introduction remains.

Manual sections 5–6 audit after the edits:

| Self-check | KO | JA | EN | ZH-HANT |
|---|---|---|---|---|
| Automated FAIL count | 0 | 0 | 0 | 0 |
| No stock hypothetical opener; varied batch approach | Number-first | Number-first | ARC misconception | Shop-owner question |
| At least two very short sentences | Yes | Yes | Yes | Yes |
| Three paragraphs opening with the same word | No breach established | No breach established | No breach established | No breach established |
| No three claim/citation/caveat paragraphs in succession; citation-free scene/question exists | Met | Met | Met | Met |
| Contrast templates within limit; no invented strawman | Met | Met | Met | Met |
| Substantive ending rather than contact/disclaimer formula | Met | Met | Met | Met |
| Register and fact/citation/hypothetical preservation | Met | Met | Met | Met |

KO/JA now open with the isolated numerical maximum, rather than the earlier rule-and-citation opening. C1 uses an ordinary wage-rule statement; the revised approach is distinguishable under the rule's own opening categories. EN's optional body-question count is zero; its answer-led explanation supplies the reader's question without requiring an artificial extra question. No two-item manual monotony failure was established. The KO/JA ending-frequency warnings do not authorize changing their required registers and are not FAIL results. No MONOTONY rejection is issued in this round.

## Minor edits applied

Each row records Original → problem and reason → applied replacement → preserved facts. Exact full-line diffs are saved in `evidence-r3/*-minor.diff`.

| Location | Original | Problem and reason | Applied replacement | Facts preserved |
|---|---|---|---|---|
| KO:56 | 네트워크로 내야 하고 | Literal rendering of online filing | 온라인으로 신청해야 하고 | Mandatory online filing and exception unchanged |
| KO:56 | 입학 보고를 마친 경우는 빼 둡니다. | Unnatural procedural wording | 입학 등록을 마친 경우는 예외입니다. | Completed enrollment and the same graduation exception |
| KO:58 | 제1항이 유효기간의 최장을 1년으로 둡니다. | Awkward nominal construction | 제1항의 유효기간은 최장 1년입니다. | Same paragraph, validity and one-year maximum |
| JA:42 | 日本国籍の学位課程や語学センターは、ふつう第1号から見ます。 | Nationality incorrectly modifies the course/center | 日本国籍で学位課程や語学センターに通う学生は、通常、第1号の対象かを確認します。 | Same students and qualification category; no guarantee of eligibility |
| JA:56 | ネットワークで出さなければならず | Translationese for filing an application | オンラインで申請しなければならず | Mandatory filing method unchanged |
| JA:87 | 例は医師です。 | Clipped source-note phrase | 医師がその例です。 | Physician example unchanged |
| EN:32 | Marriage to a national with household registration in Taiwan, plus permission to reside, needs no permit. | “Marriage” is the grammatical subject needing a work permit | Foreigners married to nationals with household registration in Taiwan and permitted to reside need no work permit. | Same foreigner, registered-national spouse, residence permission and work-permit exception |
| EN:88 | …lets the National Immigration Agency …, and may deport the person who remains after that deadline. | Broken coordination makes the article itself the subject of “may deport” | …lets the National Immigration Agency …, and deport the person who remains after that deadline. | Same discretionary agency power, person and expired departure deadline |
| ZH:88 | 延期期間的每週時數，第12條和本頁沒有。 | Incomplete source-note construction | 第12條與該頁未規定延期期間每週工時。 | Same two sources and limited observation about what they prescribe |

No numbers, URLs, legal conditions or hypothetical labels were removed by these edits. The URL sequence and digit sequence were programmatically compared before and after, and the surrounding legal meaning was manually checked. L1 and L2 were left unchanged for the writer/coordinator.

## Verification of the reviewed files

After editing each file, ran the required absolute-path lint command with language and slug `taiwan-foreign-student-part-time-work-permit-hours`. Ran the required variety command on each final file. EN was rechecked after its final grammar adjustment.

| Language | Final lint | Final variety |
|---|---|---|
| KO | OK; 3499 characters | Exit 0; 85 sentences; CV .501; short .094; 0 FAIL; ending-frequency WARN 96% |
| JA | OK; 4046 characters | Exit 0; 93 sentences; CV .495; short .129; 0 FAIL; ending-frequency WARN 97% |
| EN | OK; 1599 words | Exit 0; 100 sentences; CV .571; short .270; 0 FAIL |
| ZH-HANT | OK; 2699 characters | Exit 0; 87 sentences; CV .516; short .092; 0 FAIL |

Final SHA-256 values:

```text
ko.md       2f1e2f5733e5b9fe4ee5ea20e565612bf9e5fe43a70257ca3266b511e05cd9a5
ja.md       c83480568f017e3dedea2c0aa667329ae97231e77a190584e6cfcf6ee2531919
en.md       4eb5e6c97ef0b43d9fe7620d09250d174cfa5d52f13e2880b8271a632ed3a0f9
zh-hant.md  44d8b4b4b9a3bd8cfbedfaaa315035d8e54294f1172a31ff20ef14c1c0321115
```

## 4. Image

Image verdict: OK. Viewed the specifically requested `/Users/son7/tseng-col-1013-work/images/C6.webp` directly with the image-viewing tool. It depicts an unidentifiable person from behind tying an apron, wearing a backpack beside café equipment. It fits student part-time work and presents a generic illustrative scene. No visible face, readable text/document, logo or flag; the treatment is respectful. No regeneration requested. This round's finding applies to the actual WebP, not merely the JPG reviewed previously.

Image SHA-256: `e9c8784a28f3bbb5d9041bd9aa3f619f5fb8d56c69b4ba7cb4259dd7013c5c2c`.

VERDICT: FIX
