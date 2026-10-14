# C1 final review — Astra, round 3

Verdict: FIX. The column is not ready for publication as is. The half-pay explanation can overstate the employer's payment obligation, most clearly in KO and JA; EN also uses wording that adds an apparent physical-attendance requirement to a leave request. These legal-meaning issues are returned to the writer. Four minor language edits were applied. All four files pass lint and the sentence-variety checker after those edits. Image: OK.

Reviewed on 2026-10-14 against the requested column check date, 2026-10-13. Slug: `taiwan-sick-leave-half-pay-ten-day-protection`. This third review was expressly requested by the user, overriding the batch's ordinary two-round limit. Codex conducts the final review under the current user instruction; this is not a lawyer-review or human native-speaker certification.

## Scope checked

Opened and read fully: `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C1.md`, all four `drafts/C1/{ko,ja,en,zh-hant}.md` files including titles, summaries and FAQ, `drafts/C1/facts.md`, and `research/C1-statutes.md`. Also read the shared `SENTENCE-VARIETY-RULE.md`, including sections 5–6, and `LESSONS.md`; opened `~/tseng-col-0930-work/COLUMN-VOICE-RULE.md` and the repository's `docs/columns/EDITORIAL-VOICE.md`. The original `~/agent-library/knowledge/editorial-voice.md` path is absent; the supplied complete brief and repository copy provided the rules. Read `topics/LINKS.md`, compared C2–C6 openings in each language, and inspected openings/headings/endings of three recent existing columns per language. The preceding review and writer's fix notes were consulted after the independent source comparison.

Fresh curl requests successfully retrieved all 24 distinct official URLs cited by the columns: 23 single-article pages and the Leave Rules history. Four full Chinese law pages were fetched to verify amendment dates. All 22 cited articles present in the research extract exactly match the fetched article bodies after whitespace normalization. Labor Standards Act article 38, absent from that extract, was opened separately. The English Leave Rules page was also fetched to verify the official English title and terminology; its older amendment date was not used to override current Chinese law.

BLI FAQs on hospitalization, waiting days, original wages, annual leave and major illness, and MOL's 2026 attendance-bonus Q&A were opened with curl for independent checks. A supplementary MOL historical offset-interpretation page timed out; it is not treated as a successfully fetched source or as necessary evidence for the findings below. No private secondary source supplies a legal conclusion in this review.

Evidence: [r3-evidence](r3-evidence/), especially `official-fetch-index.json`, `statute-comparison.json`, `format-link-audit.json`, before/after checks, original draft snapshots and SHA-256 manifests. No column cites a judgment, and `research/judgments/` contains no `.txt` files, so no judgment holding or URL required validation. The actual requested `images/C1.webp` was opened with the image viewing tool.

## 1. Law and facts — required corrections

### L1 — MAJOR: half wages and the shortfall must not read as cumulative employer payments

Original → KO, line 26: “고용주가 임금의 절반을 지급하고, 노공보험 보통상병급부가 그 절반에 못 미치면 차액도 보탭니다.” JA, line 26: “雇用主が賃金の半額を払います。労工保険の普通傷病給付がその半額に届かなければ、差額も雇用主が補います。” The comparable EN line 34 starts “Half wages come from the employer” and then adds the shortfall sentence; ZH line 28 likewise places “半薪由雇主發” beside the employer's top-up. Summaries and FAQ 1 repeat the same two propositions.

Problem & reason → [Leave Rules article 4(3)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030006&flno=4) sets half wages for the annual portion within 30 days and requires the employer to make up an insurance benefit's shortfall against that half-wage amount. It does not impose an additional shortfall payment on top of an already satisfied half-wage obligation. KO “차액도” and JA “差額も,” following an unqualified employer half-payment, expressly invite that cumulative reading. This concerns the amount owed and the central question of who pays, so it is material. EN and ZH are less explicitly additive, but their corresponding summary/body/FAQ wording should be aligned so that the four versions explain the same payment relationship.

Fix required; not applied → State the half-wage entitlement first, then say that where the relevant ordinary sickness insurance benefit is below half wages, the employer supplies the amount needed to reach that half-wage level. Clearly identify the top-up as the shortfall component of that obligation. For periods without the relevant insurance benefit, retain the employer's half-wage payment. Review the opening, summary and FAQ 1 together in all four versions. Do not introduce an automatic clawback, an unrestricted right to withhold wages before an insurance decision, or an uncited reimbursement procedure.

Facts preserved → Preserve the shared annual 30-day wage window, the employer's responsibility, insurance eligibility conditions, the distinction between actual wages and average monthly insured salary, and all article 4/33/35 links. This is a clarification of the legal payment relationship, not permission to remove the top-up or to lower the half-wage entitlement.

### L2 — MAJOR: EN leave-request wording implies physical presence

Original → EN, line 54: “Before the leave, the worker states the reason and the number of days in person, orally or in writing, under Article 10.”

Problem & reason → In ordinary English, “in person” means physically present. [Article 10](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030006&flno=10) requires the worker personally to state the reason and duration in advance, orally or in writing, and allows another person to handle the request in a sudden illness or emergency. It does not require the sick worker to attend a workplace or office physically to submit it. The other versions use 本人/본인/親自 without adding a place-of-submission requirement. A procedure affecting a sick employee must not be narrowed by this translation.

Fix required; not applied → Use “the worker personally states the reason and the number of days, orally or in writing” or equivalent wording. Keep the advance-request obligation, the sudden-illness/emergency delegation rule, and the employer's ability to request relevant documents. No new remote-submission entitlement or particular accepted document needs to be invented.

Facts preserved → Same actor, advance timing, oral OR written alternatives, reason AND duration, emergency exception, supporting-document discretion and article 10 citation. The writer must resolve the procedural meaning; the reviewer has not silently changed it as a stylistic edit.

### Other legal checks, separately completed for all four languages

| Subject | KO / JA / EN / ZH result |
|---|---|
| Coverage and article 4 ceilings | Labor Standards Act coverage is stated. Non-hospitalized 30 days in one year; hospitalized one year within two years; combined one year within two years. Physician-diagnosed cancer, including carcinoma in situ, and required pregnancy rest are included in the hospitalized leave calculation. All match the Chinese text. |
| Insurance articles 33 and 35 | Insured person, ordinary injury/illness, hospitalization, inability to work, consequential loss of original wages and continuing treatment appear in each body. Fourth-day commencement, half the average monthly insured salary, half-monthly payment, six months plus six for at least one year of pre-event coverage agree. The KO wording “기간을 합쳐 1년이면” should preferably say “1년 이상이면” when L1 is revised, to make the threshold unmistakable. |
| Leave Rules articles 7, 9 and 9-1 | Fourteen unpaid personal days; hourly family-care personal leave and statutory qualifications; protected attendance-bonus categories; the miscarriage-before-three-months AND no-maternity-leave exception; proportional deduction if made and more favorable agreements; annual ten-day protection with statutory exceptions; employer's proof burden not limited to ten days; multifactor appraisal beyond ten days are retained. |
| Leave Rules articles 5, 6 and 10 | Personal OR annual leave offset, continued illness, permissive unpaid leave of absence with one-year maximum; no invented automatic termination after that year. Occupational injury leave remains one sentence. Request and evidence rules match, subject to L2. |
| Labor Standards Act articles 13, 38 and 43 | The limited article 13 periods and approved force-majeure exception are stated without extending that article to ordinary illness. Annual leave is correctly identified through article 38; no accrual table is invented. Article 43 supplies the regulatory basis. |
| Enforcement | Article 79(1)(3)'s base range is NT$20,000–1,000,000. Article 74 complaint routes, anti-retaliation, invalidity, necessary investigation, written notice of handling within 60 days of authority/inspection-agency receipt, and confidentiality agree. The text does not purport to enumerate article 79's separate aggravation provision. |
| Gender Equality in Employment Act | Articles 14, 20, 21 and 38 support the monthly menstrual day, first three annual days outside sick leave, remaining days included, half pay, family-care eligibility and seven-day cap counted toward personal leave, refusal/adverse-treatment ban, NT$20,000–300,000 fine, publication, correction order and repeated punishment. |
| Other leave table | Marriage: 14 paid days. Bereavement: correct relatives and paid 8/6/3 days. Personal: 14 unpaid days per year. Official leave: statutory entitlement for the actual necessary period, full wages. One table plus one marriage/date sentence. |

Both amendment/effective-date pairs match the freshly opened [history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=N0030006) and [article 12](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030006&flno=12): 2025-12-09 → 2026-01-01; 2026-09-30 → 2026-10-01. Full-law amendment headers agree with the source lists: Leave Rules 2026-09-30, Labor Standards Act 2024-07-31, Labor Insurance Act 2026-01-21, Gender Equality in Employment Act 2023-08-16. The English database still shows the earlier eight-day marriage provision; current Chinese article 2 supports the drafts' fourteen days.

The hospital-day-four headings are not rejected: [BLI FAQ 2](https://www.bli.gov.tw/0017647.html) expressly uses that formulation. That page also supports the outpatient-only examples. [BLI FAQ 7](https://www.bli.gov.tw/0017652.html) explains why using paid annual leave while hospitalized can still qualify for insurance; the drafts paraphrase article 33 and do not expressly deny that specific entitlement, so omission of this separate situation is not made into another blocker. MOL's [attendance-bonus Q&A](https://www.mol.gov.tw/1607/28162/28166/28180/86983/87103/) corroborates proportionality and the favorable-agreement interpretation.

Example arithmetic is correct in the actual columns: KO Monday–Thursday = four days; JA Wednesday–Friday = three days; EN Wednesday–Thursday, returning Friday = two days; ZH expressly states five Monday–Friday workdays. All are labeled hypothetical, and no private parties are identified. There are no invented monetary computations.

F1 — Internal fact-sheet discrepancy, not an additional publication blocker:

Original → `facts.md` calls the KO scene “fever Tuesday through Thursday, back Friday, four days.” → Problem & reason → Tuesday–Thursday is three days and differs from the current Monday–Thursday column. → Fix required, not applied → Synchronize the internal fact sheet to Monday–Thursday, four days. → Facts preserved → Keep the correct published hypothetical and its label; no column day count needs changing.

## 2. Citations

Every existing statute URL has the correct pcode/flno. All 24 distinct official body URLs appear in each language's final sources section, with the required 2026-10-13 check date. Links placed in the subject or immediately around a connected legal explanation retain a clear claim/source relationship. The detached-paragraph gaps and ambiguous article-4/33 references identified in round 2 have been repaired. No new missing source-list item was found.

Each file contains exactly three related internal links, all in its own language. Existence was checked by the prescribed lint against the repository and against `topics/LINKS.md`. None links to this batch. There is no judgment citation. The foreign-law note directs readers to a professional in the relevant country and asserts no foreign-law rule; this is permitted by batch rule 10 without adding an unconsulted foreign statute.

## 3. Rules and frontmatter

Checked in every language: exact frontmatter key set; `author: "legal-ai-assistant"`; `topic: "labor"`; correct audience/category; publication, last-modified and display dates; three FAQ entries; literal NNN image path; H1 matching title; distinct non-English seoTitle; plausible reading times. EN title is 91 characters, so seoTitle is required; its seoTitle is 37 characters and summary is 159, with no forbidden summary characters.

No private-party names, bold markup, phone/hotline numbers, street address, messaging ID, attorney byline, lawyer-review claim, native-review claim or invented first-person experience appears. Each version has one short contact paragraph with the required localized firm name and email. All four FAQs were included in the legal review; L1 therefore covers their payment wording as well as the body. Hypothetical labels and internal author metadata remain intact.

## 4. Voice and sentence variety

Titles identify sick leave, half wages and the 2026 protection without clickbait or imperatives. Openings deliver substantive rules immediately. KO maintains 합니다체 and JA maintains です・ます. EN uses active, generally plain prose, apart from L2 and the compression noted in the minor edits. ZH uses Taiwan terminology and Traditional Chinese. Its citations sometimes form abrupt short fragments, but that is not itself evidence of a failed monotony threshold. No wholesale rewriting is required on that basis.

First-two-paragraph deletion check: KO introduces wages/top-up, regulatory basis, coverage and the three limits; JA also distinguishes insured salary; EN gives the effective-date history and separates the protection from attendance-bonus deductions; ZH begins with the protected miscarriage category, other-leave proportionality and favorable agreements, then wages and coverage. Removing the substantive sentences loses a condition, source relationship or date. The problematic payment wording is returned under L1 rather than erased to shorten the opening. No generic preview sentence needs deletion.

Compared the batch's openings: C1 uses specific legal facts, while other columns include questions, quotations, numbers, misconceptions and labeled scenes. No stock hypothetical opener appears in C1; fact-led openings do not occupy more than half the six-column batch in any language. Recent existing columns' opening/headings/closing patterns were also inspected (KO 535/530/526; JA 529/525/516; EN 531/515/507; ZH 539/538/537). C1 does not copy their disclaimer ending or their heading sequence.

Fresh post-edit results:

| Language | lint | Body length | Variety | Length CV | Very short share | Similar-length triple share |
|---|---|---:|---|---:|---:|---:|
| ko | OK, exit 0 | 3,484 characters | 0 FAIL | 0.517 | 0.133 | 0.023 |
| ja | OK, exit 0 | 3,899 characters | 0 FAIL | 0.465 | 0.175 | 0.063 |
| en | OK, exit 0 | 1,593 words | 0 FAIL | 0.508 | 0.215 | 0.011 |
| zh-hant | OK, exit 0 | 2,700 characters | 0 FAIL | 0.552 | 0.229 | 0.021 |

Sections 5–6 self-check: every version has more than two very short sentences, with substantive examples such as KO “한도는 6개월입니다,” JA “支給期間は最長六か月です,” EN “Six months is the cap,” and ZH “不能只看日數。” Maximum repeated paragraph opener is two in each language. There are no three successive claim–citation–caveat paragraphs; questions and fictional scenes supply uncited paragraphs. Contrast-template count is zero, and there is no rebuttal of an invented reader assertion. The final substantive paragraphs return to each hypothetical's specific days and protections. Polite registers are consistent. No fact, numeral, link or hypothetical label was dropped by the applied edits.

KO and JA each receive a WARN for 94% polite endings. These are not FAILs, and there are not two unmet manual self-check items. No MONOTONY rejection is asserted. Legal findings L1/L2, not the variety score, determine FIX. Further corrections must preserve length limits: EN has seven words of room and ZH is at its maximum.

## 5. Minor edits applied

M1 — KO line 42:

Original → “한 해 30일 안에 있는 통원일의 절반은 고용주가” → Problem & reason → The ellipsis makes the employer appear to pay half of the days rather than half of the wages for them. → Fix applied → “한 해 30일 안에 있는 통원일 임금의 절반은 고용주가”. → Facts preserved → Same outpatient period, 30-day condition, half-wage statement, employer and article 4 link; the missing wage noun was restored.

M2 — JA line 42:

Original → “一年で30日以内の通院日の半額は” → Problem & reason → A day has no monetary face value; the wage noun is missing. → Fix applied → “一年で30日以内の通院日の賃金の半額は”. → Facts preserved → Same annual 30-day condition, outpatient context, half wage, payer and citation.

M3 — EN line 34:

Original → “for that slice falls short of half wages” → Problem & reason → “Slice” is a distracting metaphor for the eligible period. → Fix applied → “for that period falls short of half wages”. → Facts preserved → No amount, condition, source or payment relationship was changed; L1 remains unresolved.

M4 — ZH line 36:

Original → “只看門診，勞保的普通傷病給付會啟動嗎？” → Problem & reason → “給付會啟動” sounds like a system-state description rather than a reader's benefits question. → Fix applied → “只看門診，可以請領勞保普通傷病給付嗎？” → Facts preserved → Same outpatient-only question and insurance benefit; the following legal answer and citations are unchanged.

After each file's edit, the exact prescribed lint command was run for that file and language with this slug; all returned OK. The variety checker was also rerun on all four. Automated preservation checks confirm identical ordered URLs, digit sequences and frontmatter before/after. Original snapshots and edit records are in `r3-evidence/`.

## 6. Image verdict

Image: OK. Viewed the actual `images/C1.webp`, not a different format. It shows an empty rattan chair, blanket, covered hot-water bottle, cup and curtains, fitting recuperation and sick leave. The scene is generic and unidentifiable. No person, face, text, readable document, logo or flag is visible. The treatment is respectful; there is no visual basis for associating it with a real client or employer. No image edit was made.

Image SHA-256: `81376c7d41771977e532ac067583b290c88f4cebd08084c992f8fedb8eedbb27`.

Final reviewed draft SHA-256 values:

```text
ko      654a6886278287e7fbecbb38a50178be554da2afc50a79057462450106bc801c
ja      0855f37e192900b25173d9520dffca9cc44b0e75fa70d7b651757c003920c290
en      36864c9cc3b5656cfd08beecc924f0a8021477072630e682d90f57b21407103b
zh-hant 31fe4a7fd413454edd5e1f6e8fd48c5ea4e8c01c9ba7e711ad1257663799058d
```

VERDICT: FIX
