# C1 final review — round 3

Verdict: FIX. All four versions still need claim-level citation repairs. Several sentences also remain unsuitable for publication under the native-prose rule. The substantive procedural defects identified in round 2 have been corrected; they are not repeated as unresolved findings. Image: OK. No draft edits applied.

Reviewed on 2026-10-14, Asia/Seoul. Slug: `taiwan-unpaid-wages-insolvent-employer-payment-fund`. This is the third final-review round. Under the batch's three-round limit, C1 remains on HOLD rather than being cleared for publication.

## Scope checked

Read fully: `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C1.md`, all four `drafts/C1/{ko,ja,en,zh-hant}.md`, `drafts/C1/facts.md`, and `research/C1-statutes.md`. Checked titles, SEO fields, summaries, FAQs, body text, the comparison tables, sources and cross-language legal consistency. The fact sheet was treated as an inventory to verify, not as authority.

Read the complete `/Users/son7/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md`, including sections 5–6, and the recurring lessons in `LESSONS.md`. Also opened `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, the shared rules-bundle editorial text, and `/Users/son7/Projects/tseng-law-columns-20261014/docs/columns/EDITORIAL-VOICE.md`. The requested `~/agent-library/knowledge/editorial-voice.md` path does not exist on this machine; the supplied full brief and repository editorial text were read instead. Applied the current user's direct Codex final-review authority, without requiring Fable approval.

No judgment is cited; `research/judgments/` contains no `.txt` files. No Korean, Japanese or US legal rule is asserted. Read `topics/LINKS.md`, ran the actual link-existence lint, and compared the available C2–C4 openings. C5/C6 language drafts are absent, so the complete six-column opening distribution cannot be certified here. Compared the openings, headings and endings of local publication files 524, 523 and 522 in each language. Read the round-2 log after independently reading the current drafts and checking their official sources.

Directly viewed `images/C1.webp` and read its scene description in `images/DONE.txt`. This review concerns the supplied publication files and image, not a deployed page.

## Official sources checked independently

Opened all 15 distinct external URLs cited by the drafts with `curl -L --fail`; each returned HTTP 200. HTML, extracted text, URL/hash manifest and checker output are saved in `reviews/C1/source-check-astra-r3/`. The initial review also opened the main Act article and both BLI pages through the web tool.

| Evidence IDs | Sources and verification |
|---|---|
| 02, 05, 06 | [Labor Standards Act full text](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=N0030001), [Article 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=2), [Article 28](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=28). Saved research quotations match the live articles. Amendment header: 113-07-31, or 2024-07-31. |
| 00, 03, 07 | [Enforcement Rules full text](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=N0030002), [Article 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030002&flno=2), [official English text](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=N0030002). Excluded periods and their wages verified. Amendment: 2024-03-27. |
| 01, 04 | [Fund regulations full text](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=N0030005), [official English text](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=N0030005). The English instrument title is correct; amendment: 2015-05-20. |
| 08–12 | Fund regulations [Article 10](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030005&flno=10), [Article 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030005&flno=2), [Article 7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030005&flno=7), [Article 8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030005&flno=8), [Article 9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030005&flno=9). Agency, contributions, evidence, fallback assessment and joint filing verified. |
| 13 | [BLI worker application guidance](https://www.bli.gov.tw/0007239.html). Read substantive sections I–V, including all debt-proof alternatives. Displayed update: 2023-12-19. |
| 14 | [BLI application FAQ 7](https://www.bli.gov.tw/0015125.html). The actual body is the cited application/document question; displayed update: 2023-11-28. Its HTML title misleadingly names a different question. The preliminary wrong-link suspicion was withdrawn after reading the body; this URL is correct. |

## Findings requiring correction

### C1 — MAJOR hard-rule violation: independent legal claim groups still lack nearby official links

Original:

- KO line 44: “일수·시간·건수로 임금을 정할 때는 하한이 있습니다. … 같은 제4호의 평균임금은 그 100분의 60입니다.”
- JA line 50: “日数、時間または出来高で賃金を定める場合には下限があります。 … 同じ第4号の平均賃金はその百分の六十です。”
- EN line 50: “Day, hour, or piece-rate pay has a floor. … the same item 4 counts the average as that 60 percent.”
- ZH line 48: “按工作日數、時數或論件計薪時，有一條底線。 … 平均工資就以該百分之六十計。”

→ Problem & reason: None of these four numerical-rule paragraphs contains an official link. The preceding paragraph now links both the Act and the Enforcement Rules, so an unlinked “same item 4” is particularly poor source identification. The floor comes from Labor Standards Act Article 2(4), not item 4 of Enforcement Rules Article 2. The calculation itself is correct; the defect is the required claim-level citation. Batch hard rule 2 and the explicit review instruction require an inline official source at the claim group. A bibliography or a different paragraph's link does not clear this requirement.

Other remaining instances:

| Language / location | Original claim group | Required source |
|---|---|---|
| JA line 32; ZH line 32 | “三つの中身は、同じ条が分けています” / “工資，是本於勞動契約所積欠、未滿六個月的部分” and the three eligible-debt definitions | Act Article 28(1). These paragraphs contain only an internal severance link. |
| EN line 34 | “Those claims stand with debts secured by a first-priority mortgage, a pledge, or a lien” through the unpaid balance's priority | Act Article 28(1), at this standalone priority paragraph. |
| EN line 46 | “Pay for work is wages. Article 2 takes in …” and the regular-bonus statement | Act Article 2(3). The article number is plain text here. |
| KO line 38; JA/ZH line 34; EN line 32 | The independent paragraph distinguishing the underlying retirement/severance entitlement from Article 28's priority, including the individual-account contribution distinction | Act Article 28(1)(2)–(3), with the explanation kept within that provision's scope. |

→ Fix required: Add the [Act Article 2 single-article link](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=2) to each 60% calculation paragraph and EN's wage-definition paragraph. Add the [Article 28 single-article link](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=28) to the other identified claim groups. A clearly linked introductory or concluding sentence for each coherent group is sufficient; do not mechanically cite every repeated sentence. Keep the newly added Enforcement Rules and BLI citations. Recheck length after adding link labels: KO is exactly at its maximum and ZH has only two characters of room.

→ Facts preserved: All correct legal conditions, six-month periods, the 60% formula, sources already present, and hypothetical labels must remain. The requested repair concerns citation placement, not a different formula or priority rule. No repair applied: the reviewer is expressly prohibited from changing citations.

### V1 — Remaining native-prose defects under batch hard rule 6

These are concrete reading problems, separate from the automated monotony threshold. The broad legal content is now substantially sound, but some sentences still join unlike concepts or copy the source-language syntax. The following wording repairs should accompany C1; they are required, not applied.

| Original | Problem & reason | Fix required | Facts preserved |
|---|---|---|---|
| KO line 74: “대지급은 그 회사가 기금을 냈거나 밀린 분담을 나중에 납부한 때, 폐업 전 6개월 안의 노동계약상 체불입니다.” | The predicate says the advance itself is arrears. It awkwardly joins the contribution condition and the period of eligible wage debt. | Separate the condition from the object, e.g. “그 회사가 기금을 냈거나 밀린 분담을 나중에 납부했다면, 임금 대지급 대상은 폐업 전 6개월 안의 노동계약상 체불입니다.” Integrate within the length limit. | Contribution or later payment, the pre-closure six-month period, labor-contract wages and the separate retirement/severance cap in the next sentence. |
| JA line 30: “先に並ぶのは、使用者の財産からの弁済順です。” | An order of payment does not itself “line up first”; this is an opaque translated metaphor at the start of the priority explanation. | Replace with a direct transition such as “使用者の財産から支払いを受ける順位はどうなるのでしょうか。” Keep the linked rule that follows. | Priority from the employer's assets, followed by equal rank and proportional payment. No new priority between employee claims. |
| JA line 70: “立替に進むには、その会社が基金を納めているか後から補っており、賃金は清算の前六か月の労働契約上の未払いです。” | The conditional opening does not connect grammatically to the final predicate. | Express the contribution requirement and covered wage period as separate natural sentences, e.g. “立替には、その会社が基金を納めているか、滞納分を後から納めていることが必要です。対象となる賃金は、清算前の六か月間に労働契約に基づいて生じた未払い分です。” | Both contribution alternatives, liquidation as the reference event and the six-month wage window. |
| EN line 44: “A contractor label leaves the hiring, the wages, and that subordination to the facts.” | “Leaves … to the facts” is not an idiomatic account of how status is assessed. The intended test becomes harder to understand. | Use direct language, e.g. “A contractor label does not settle the issue; actual employment, pay and subordination determine the assessment.” Retain the existing Article 2 citation and coverage assumption. | The label is not decisive; no statement that every contractor qualifies. |
| EN line 66: “Before closure, a dispute over the wage amount itself follows [the column on labor-dispute mediation].” | A dispute cannot follow a column. This is visibly broken link-introduction prose. | “For disputes over wage amounts before closure, see [the column on labor-dispute mediation].” Preserve the existing link destination exactly. | Existing subject and timing; no new restriction on mediation after closure. |
| ZH line 68: “沒有下文，只到請求未獲清償。” | “只到” has no natural complement for describing what the unanswered demand establishes. | “沒有回覆，只能說明請求後仍未獲清償。” Integrate with the next sentence within the length limit. | The unanswered request does not replace the official closure evidence; the hypothetical remains labelled. |

→ Overall facts preserved: These directions do not authorize deleting any unique condition, number, legal source or hypothetical marker. Do not solve the tight KO/ZH limits by dropping the newly corrected procedure or average-wage qualification. The residual language finding is not a claim that all four texts are inaccurate, or that the variety checker failed.

### R1 — Supporting fact sheet remains stale; not a separate false published claim

Original: `facts.md`, “Deliberately left out”, still lists filing venue, joint filing, court-document evidence, contribution eligibility and the BLI look-back period as absent. It also retains a branch/head-office assertion no longer found in the publication text.

→ Problem & reason: All four current drafts now discuss those procedures and eligibility conditions, and also contain the Enforcement Rules qualification. The sheet no longer maps the reviewed text. R3 was therefore checked directly against the official pages rather than cleared on the sheet's assurances.

→ Fix required: Update the inventory and supporting links to match the actual drafts, including the finality certificate for both court-document routes, application/complaint copies, alternative proof routes and excluded average-wage periods. Do not treat the old omission list as evidence that these claims are absent.

→ Facts preserved: Retain accurate statutory quotations; replace only stale inventory descriptions. No edit applied because the minor-edit authorization covers column files, not this supporting sheet.

## Legal and rules checks that passed

- All languages retain the three alternative triggers, a covered labor-contract assumption, and the distinction from mere late payment or a temporary stoppage with a prospect of resumption. Foreign nationality is not treated as automatic worker status; the parent-company FAQ stays with the stated subsidiary-employment facts.
- Initial equality with the specified secured claims, proportional payment and priority for the unpaid part match Article 28. None promises full recovery. KO's labelled ratio example is correct: claims of 1 and 3 divide a pool of 2 in shares of one-quarter and three-quarters, yielding 0.5 and 1.5.
- Eligible contractual wages, Labor Standards Act retirement pay, and severance under that Act or the Labor Pension Act remain distinct. The wage-period limit is not replaced by the combined six-month-average-wage cap for retirement pay and severance. That advance cap is not imposed on their paragraph-1 priority.
- The average-wage basic definition, shorter-service rule and limited day/hour/piece-rate 60% floor are correct. R3 now states that the Enforcement Rules' specified periods and their wages are excluded. The ordinary denominator is not reduced to actual workdays. Insured salary is distinguished from the average-wage formula and separately described as a discretionary evidential fallback under regulation Article 9.
- Prior unpaid demand, contributions or later make-up, pre-event wage window, foreign-worker conditions and mandate-role exclusions match the sources. The employer must repay the fund. The statutory 15/10,000 ceiling is not presented as the current collection rate.
- Closure/debt evidence, lodging evidence for liquidation or bankruptcy, BLI filing and the joint-filing principle match the cited regulations. The special-case exception is preserved by “generally” / “原則” wording.
- R2's court-document defect is fixed in all four versions: both an order and a judgment require their own finality certificate; the application/complaint copy and the other BLI-listed routes are now included. The text does not present the court-order route as the only option.
- The three amendment dates and two BLI page-update dates match the retrieved official pages. No separate effective date is invented. Every sources section has the required 2026-10-14 check date and lists all currently linked external sources. Existing statute URLs resolve to the right article; C1 concerns missing nearby links, not broken targets.
- Required frontmatter, H1/title identity, language audience, labor topic, dates, category, three FAQs, `author: "legal-ai-assistant"` and literal `NNN` image path pass. EN title length is 72 characters, SEO title 32 and summary 157; the SEO title is required, differs from the title and satisfies its limit. The English summary has no forbidden characters. Eight-minute reading estimates are plausible for this dense material.
- Each language has two existing same-language internal column links; the lint checked their actual repository paths. None targets this batch. One permitted firm/email contact paragraph appears near the end in each language.
- No private-party names, bold, phone/hotline numbers, street addresses, messaging IDs, attorney byline, lawyer/native-review assertion, invented professional experience or unsupported foreign-law note. All scenarios remain explicitly fictional. KO maintains 합니다체 and JA です・ます. ZH uses traditional characters and Taiwan terminology; V1 is a syntax issue, not mainland vocabulary.

## Sentence-variety checks and manual sections 5–6

Executed both specified commands for each language, using the exact slug. Full commands, output and exit status are saved in the evidence directory. Every invocation returned exit code 0.

| Language | Lint | Body length | Sentences | CV | Very short sentences | Short share | Similar-length run3 | FAIL lines |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| ko | OK | 3500 characters | 103 | 0.504 | 13 | 0.126 | 0.069 | 0 |
| ja | OK | 3842 characters | 103 | 0.455 | 14 | 0.136 | 0.059 | 0 |
| en | OK | 1540 words | 101 | 0.513 | 23 | 0.228 | 0.061 | 0 |
| zh-hant | OK | 2698 characters | 94 | 0.577 | 14 | 0.149 | 0.033 | 0 |

KO has a WARN for 98% “니다.” endings; JA has a WARN for 99% desu-masu endings. Neither is a FAIL or a reason to mix registers. EN and ZH report no variety limit violated.

Manual self-check:

1. No stock hypothetical first-sentence opener. KO opens with the triggering events, JA with the fund-payment question, EN with Article 28's rule and ZH with the labelled payroll scene. Available C2–C4 openers were compared; the absent C5/C6 drafts limit whole-batch certification.
2. Every version exceeds two very short sentences. Using the checker's language-specific long-sentence thresholds, no prose paragraph contains two long sentences and no consecutive long-sentence pair was found.
3. No prose-paragraph opening word occurs three times. Maximum frequency is two in every language.
4. No three consecutive claim–statute–caveat paragraphs. The explicitly fictional scene supplies a legitimate citation-free paragraph; missing legal citations are not credited as a stylistic virtue.
5. The checker counts zero contrast templates. The remaining contrasts concern real questions in the brief: priority versus advance, contributions versus average wage, the covered wage period, and a label versus employment status. The earlier foreign-nationality strawman has been removed. No qualifying unprompted rebuttal or excess contrast-template count was established.
6. Final paragraphs return to the particular hypothetical and its wage/advance facts. They are not copied generic disclaimers or sales endings. Their awkward sentences are identified in V1 rather than falsely classified as a formula-closing failure.
7. Register, hypothetical labels and no-bold requirements hold. There were no reviewer edits that could remove facts or citations.

The automatic or two-unmet-items monotony rejection threshold was not met. There is no fabricated MONOTONY failure in this review. FIX rests on the remaining mandatory citation requirement and the concrete prose defects above.

First-two-paragraph deletion test: KO's opening adds the events and operating-business limitation; its scenario adds unpaid wages, demand, identified employer and coverage. JA's question, trigger and non-guarantee statement have distinct functions, followed by the labelled liquidation scenario. EN supplies the priority rule and wage period before its labelled scenario. ZH's scene supplies five months, the unpaid entries, closure, demand and coverage before the legal trigger paragraph. The redundant empty-account sentences flagged in R2 are gone. No sentence in these opening pairs was removed during review; fictional and coverage labels must remain.

The preceding publication comparisons did not justify reusing their wording. C1's occasional narration of what a statute does not say is still less direct than ideal, but it is not treated as a new factual error or an invented numerical monotony failure.

## Minor edits applied

None. The four column files are unchanged. C1's citation corrections are outside the permitted minor wording/typo edits; the wording directions in V1 remain required for the writer. No commit, push or publication was performed.

Reviewed SHA-256 values, verified unchanged at the end of the source/checker pass:

| File | SHA-256 |
|---|---|
| `ko.md` | `2c346455fd0fe57bd96e637d0bd8bacf0ad7bac072a93416a158bcfe958156d2` |
| `ja.md` | `f2ed4fea22ca9817427cd940e553f10c6079aafd5c3b167a4d7f28fd5752ea65` |
| `en.md` | `1f682e904b7e5f9c5e9027d47aa65edf43de08403927572da54a6e4fbabf476a` |
| `zh-hant.md` | `2353293ab0fa6417772dfc6716572c05670922d0b2ec35f21b2aa39d15e27828` |

## Image verdict

OK — directly viewed `images/C1.webp`. An empty sewing workshop with an idle machine, folded neutral fabric and empty chairs fits the employer-closure subject. The supplied fictional scene is generic, unidentifiable and respectful. No people, faces, readable text/documents, identifiable logos or flags are visible. The wall panel has no legible writing and the machine's small circular detail is not an identifiable brand logo.

Image SHA-256: `797ef5319e02226059265ccc46b9c4e1ad1b3ef13e72200653a1d1e24513b5d6`.

VERDICT: FIX
