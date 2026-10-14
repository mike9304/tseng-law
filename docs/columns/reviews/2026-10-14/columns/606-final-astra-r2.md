# C1 final review — round 2

Verdict: FIX. All four language versions still need revision. The main Article 28 distinctions are substantially corrected, but the application-evidence paragraph is incomplete, the average-wage explanation omits a material qualification, claim-level citations remain missing, and several passages still fail the native-prose rule. Image: OK. No draft edits applied.

Review date: 2026-10-14, Asia/Seoul.
Column: `taiwan-unpaid-wages-insolvent-employer-payment-fund`.

## Scope checked

Read fully: `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C1.md`, all four `drafts/C1/{ko,ja,en,zh-hant}.md` files, `drafts/C1/facts.md`, and `research/C1-statutes.md`. Review included every title, summary, FAQ, body paragraph, table and source entry, with cross-language comparison. The fact sheet and round-1 review were not treated as legal authority.

Read the complete sentence-variety rule, including sections 5–6, and the recurring lessons dated 2026-10-14. Also read `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md` and `/Users/son7/Projects/tseng-law-columns-20261014/docs/columns/EDITORIAL-VOICE.md`. `/Users/son7/agent-library/knowledge/editorial-voice.md` is absent; the supplied full editorial brief and repository copy were used. Read the applicable orchestration and final-verification skills. Codex makes this final decision under the current user instruction; no separate Fable approval is required.

No judgment is cited, and `research/judgments/` has no `.txt` files. No foreign-law rule is asserted. Directly viewed `images/C1.webp` and read its description in `images/DONE.txt`.

Compared available C2/C3 openings and the opening, headings and closing of local publication files 524, 523 and 522 in each language. C4–C6 language drafts are absent, so the complete six-column opening distribution cannot be certified in this single-column review.

## Official-source verification

Retrieved every external URL cited by the four drafts with `curl -L --fail`; all 12 retrievals succeeded. Saved HTML, readable text, URL manifest and checker output in `reviews/C1/source-check-astra-r2/`. Additionally retrieved the official English Labor Standards Act and Enforcement Rules Article 2 to check terminology and the average-wage qualification independently.

| Evidence files | Official source | Result |
|---|---|---|
| `04`, `05` | [Labor Standards Act Article 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=2), [Article 28](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=28) | Match the saved research text. Definitions, triggers, priority, two advance limits, demand and reimbursement checked. |
| `02`, `14-lsa-en` | [Chinese Act](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=N0030001), [official English Act](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=N0030001) | Chinese amendment header is 113-07-31, correctly converted to 2024-07-31. Chinese statutory text controls the legal comparison. |
| `03`, `01` | [Fund regulations](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=N0030005), [official English text](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=N0030005) | Amendment date 104-05-20 / 2015-05-20 and English instrument title verified. |
| `07`, `08`, `09`, `10`, `06` | Fund regulations [Article 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030005&flno=2), [7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030005&flno=7), [8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030005&flno=8), [9](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030005&flno=9), [10](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030005&flno=10) | Agency, contributions/make-up, closure evidence, debt/lodging evidence, fallback assessment and joint filing checked against each linked article. |
| `11`, `11-main.txt` | [BLI application guidance](https://www.bli.gov.tw/0007239.html) | Contribution condition, pre-event wage period, foreign-worker treatment and application evidence checked. Displayed update: 2023-12-19. |
| `12`, `12-main.txt` | [BLI application FAQ 7](https://www.bli.gov.tw/0015125.html) | Actual page body is FAQ 7 about applications and documents, despite its misleading HTML title. This is not a wrong-URL finding. Displayed update: 2023-11-28. |
| `13-average-exclusions` | [Labor Standards Act Enforcement Rules Article 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030002&flno=2) | Mandatory excluded days/periods apply when calculating Article 2(4) average wage; see L2. |

## Required corrections, in review order

### L1 — All languages: incomplete debt-proof requirements when the employer will not confirm the arrears

Original:

- KO line 66: “노동보험국은 지급명령 정본, 또는 민사 판결과 확정증명서 정본을 채권 증명으로 요구합니다.”
- JA line 64: “労工保険局は支払命令の正本、または民事判決と確定証明の正本を債権の証明として求めます。”
- EN line 64: “the Bureau asks for an original payment order, or a civil judgment plus a certificate that it is final.”
- ZH line 62: “勞保局要求以支付命令正本，或民事判決暨確定證明書正本，作為債權證明。”

→ Problem & reason: The punctuation and wording attach the finality certificate only to the judgment. The detailed BLI guidance, section III(5), requires the payment order or judgment together with its certificate and a copy of the relevant court application. It also permits specified mediation/arbitration enforcement documents or an execution creditor certificate. Presenting only an order or judgment as what the Bureau requires excludes those alternatives. The abbreviated FAQ does not justify disregarding the more detailed application instructions already cited by this column. This can cause an incomplete application or unnecessary court proceedings.

→ Fix required: State the court-order/judgment route accurately, including the certificate for either route, and identify it as one accepted route. Link directly to the detailed BLI evidence section and mention that other listed evidence routes are available, or summarize those routes concisely. The full application checklist need not be reproduced. Preserve the employer-unavailable/refusal condition and the separate requirement to lodge claims in liquidation/bankruptcy. Recheck all four versions together.

→ Facts preserved: The statutory unpaid-demand condition, the need to prove the debt, BLI filing and the joint-application principle remain. This changes procedural content, so no reviewer edit was applied.

### L2 — All languages, most explicit in EN: average wage is presented as an unqualified all-days calculation

Original:

- KO line 42: “분모는 그 기간의 총일수입니다. 실제 일한 날만 세는 산수가 아닙니다.”
- JA line 40: “分母は、その期間の総日数です。実際に働いた日だけを数える計算ではありません。”
- EN line 40: “Take total wages in the six months … and divide by the total number of days in that period. The denominator is every day in the period.”
- ZH line 40: “分母是該期間的總日數，不是只數實際出勤日。”

→ Problem & reason: These paragraphs correctly reproduce the Act's basic definition, but then turn it into a calculation instruction without the exclusions required by Enforcement Rules Article 2. “Every day” is expressly too broad. The rule excludes specified periods, including ordinary sickness leave, occupational-injury treatment and unpaid leave, with additional listed conditions for other absences. A reader following the unqualified formula could calculate the wrong average and therefore the wrong retirement/severance advance limit. The distinction from actual working days remains valid; the defect is treating the six-month calendar period as having no statutory exclusions.

→ Fix required: Describe Article 2(4) as the basic rule and add a concise, sourced qualification that the periods specified in Enforcement Rules Article 2 are excluded in the actual calculation. Do not replace total days with actual workdays, add an invented monthly conversion, or alter the day/hour/piece-rate 60% comparison. Add the new source inline and to the sources section. A complete leave-law discussion is unnecessary.

→ Facts preserved: The six-month reference period, shorter-service rule, 60% floor and its limited applicability, and the distinction from insured salary remain. This is a substantive qualification, not a minor wording edit. The earlier review's acceptance of the basic statutory paraphrase does not clear the now-verified exclusions issue.

### C1 — All languages: important claim groups still lack their own nearby official citation

Original:

- Eligible-claim definitions and their statutory bases: KO lines 36–38; JA/EN/ZH lines 34–36. These paragraphs contain only an internal severance link, not an official Article 28 link.
- Average-wage calculation and 60% floor: KO lines 42–44; JA/EN/ZH lines 40–42. “같은 조 / 同じ条 / the same article / 同條” refers back to a link in the preceding wage-definition paragraph; neither calculation paragraph has a link.
- The distinction between the two limits: KO line 46; JA/EN/ZH line 44. The table and the additional cap summary before it also have no source attached to the comparison.
- Foreign-worker eligibility and excluded mandate roles: KO line 52; JA/EN/ZH line 50. These are a separate paragraph relying on “the guidance” without a linked source at those claims.

→ Problem & reason: Batch hard rule 2 requires claim-level inline official links. The revision added useful links at the opening priority, contribution, demand and procedure passages, but an earlier paragraph's article link and the final bibliography still do not satisfy the requirement for these distinct numerical/eligibility explanations. The internal severance article does not substitute for the official source of the priority rule.

→ Fix required: Attach the appropriate single-article links to the relevant claim groups: Act Article 28 for eligible debts and the two limits; Act Article 2 plus Enforcement Rules Article 2 for the qualified average-wage explanation; BLI guidance for eligibility. The table may have one immediate source line or a clearly linked introduction. Retain all correct existing links. There is no need to attach a separate citation to every repeated sentence.

→ Facts preserved: No change to correct legal propositions, numbers, article numbers or hypothetical labels. Adding/moving citations is outside the reviewer's minor-edit authorization and was not applied.

### V1 — All languages: the remaining prose is still too literal and repetitive for publication

This is a hard-rule-6 voice finding, separate from the automated variety result. Short sentence lengths do not cure translated phrasing or repeated narration of what a statute does and does not write. Substantial stretches after the different openings remain almost sentence-for-sentence parallel across the four languages. The following are concrete examples, not a request to remove legal qualifications.

| Language / original | Problem & reason | Fix required | Facts preserved |
|---|---|---|---|
| KO line 48: “대지급은 기금을 청구 뒤에도 못 받았을 때 … 대신 내는 절차입니다.” | The object “기금을” makes the sentence read as an unpaid claim for the fund itself; the sentence has no clear subject for “대신 내는”. | State plainly that the worker requested payment from the employer, remained unpaid, and the fund advances within paragraph 2. | Correct claimant, debtor, prior demand and limited advance; do not create a different claim procedure. |
| KO lines 50/76: “신청은 열립니다” / “노동계약상 체불로 돌아봅니다” | Literal metaphors do not naturally describe application eligibility or the wage window in Korean. “보족” is also unnecessarily opaque here. | Use direct Korean for making up unpaid contributions, being able to apply and the pre-event wage period. | Contribution/make-up condition and pre-event six-month window. |
| JA line 48: “申請はできます” / “案内は、その賃金を…と見ます”; line 74: “未払いとして見ます” | Repeated “見ます” describes looking at words instead of explaining the rule. The long closing sentence joins application conditions and the wage window awkwardly. | Explain the covered wage period and application condition directly in natural です・ます prose. | Both conditions and the statutory/guidance distinction. |
| JA line 62: “返事がない請求は、その条件の入口です。書類は別です。” | “返事がない請求” and “条件の入口” are translated abstractions, followed by a fragment with little content. | Connect the unanswered demand to the additional evidence actually required. | No assumption that silence alone proves eligibility. |
| EN line 30: “Foreign status alone does not make a worker. Neither does the label ‘contractor.’” | This rebuts the implausible proposition that foreign status or a contractor label itself creates employee status, rather than explaining the relevant employment test. | Explain employment/subordination directly and clarify that a contractual label is not decisive. | Actual worker status, nationality neutrality and no automatic contractor coverage. |
| EN line 34: “Wages come first among the three.” / “The arithmetic sits in…” | “Come first” is unnecessarily ambiguous in a passage about priority; “arithmetic sits” is unnatural link scaffolding. | Say that wages are the first category listed, and use an ordinary descriptive severance link. | No new priority of wages over the other two employee claims; the linked calculation remains separate. |
| EN lines 48/62/64: “A later makeup … opens an application”; “Silence answers only that first condition. Papers are separate”; “will not sign to the arrears” | These are not plain idiomatic English. “Sign to” does not express confirming the arrears. | Use ordinary verbs for paying arrears in contributions, supplying evidence and signing a confirmation of the debt; incorporate L1. | Contribution condition, evidence requirements and employer noncooperation. |
| ZH line 32: “不從那些擔保債權的前面起算” | “起算” naturally describes calculating a period, not a claim's payment priority. The equal-rank sentence already conveys the point. | Express the equal initial rank once in natural Taiwan usage. | Equal rank, proportional payment and the unpaid balance's priority. |
| ZH lines 30/60: “單憑外籍身分不會變成勞工” / “沒有回覆，只走到已經請求、尚未清償。文件是另一件事。” | The first rebuts an unasserted claim; the latter two are translated, clipped abstractions. | State the employment test and then explain which evidence is still needed. | Worker definition, hypothetical label and proof requirements. |

Shared repetition also needs revision:

- KO line 46 asks “같은 한도일까요? 아닙니다.”, line 54 ends “한도는 둘입니다.”, the next table repeats the limits, and line 76 repeats them again. JA lines 44/52/74 and EN lines 44/52/74 use the same sequence. ZH line 44 repeats “上限有兩道” immediately after explaining both limits, before the table and the final recap.
- The rate paragraph in every language explains that Article 28 does not give the actual collected rate and then that it does not give the processing days. The repayment paragraph similarly narrates that paragraph 5 gives no number of days. These narrow statements are factually correct, but repeated statute-absence commentary makes the column read like a research memo. The current draft already links the delegated rules.
- The opening hypothetical's final “empty account is insufficient” sentence repeats the operating-business/late-payment limitation rather than adding a new circumstance. See the deletion test below.

→ Fix required: Consolidate repeated explanations and use the table to do actual comparison work. Retain the wage-period limit and the distinct combined monetary cap in a clearly sourced place. State useful limitations once; do not replace repeated wording with new filler. Rewrite each language around its readers rather than reproducing the same paragraph sequence. Keep the substantive statutory/delegated-rule distinction without repeatedly reporting the boundaries of the writer's research. Re-run lint and the variety checks after revision; EN is only three words below its maximum and ZH only ten characters below its maximum.

→ Facts preserved: All unique legal conditions, numbers, existing citations and hypothetical labels must survive. Redundant wording may be consolidated, but no fact may disappear merely to meet length or variety. No broad prose rewrite was applied by this reviewer.

MONOTONY: self-check 6, rebutting a claim the reader did not make — “외국인이라는 사실만으로 노동자가 되지는 않습니다.” / “外国人だというだけで労工になるわけでも、請負という名前だけで労工になるわけでもありません。” / “Foreign status alone does not make a worker.” / “單憑外籍身分不會變成勞工。” — explain actual employment/subordination and the limited significance of the contract label directly.

MONOTONY: repeated cap explanation and artificial short fragments — “한도는 둘입니다.” / “上限は二つです。” / “Two limits.” / “上限有兩道。” — consolidate the duplicated prose around the sourced comparison table while retaining both limits.

These are manual observations. The checker reported zero FAIL lines. I do not claim that its contrast counter exceeded three, or that two separate numerical self-check items failed. The FIX rests on L1, L2, C1 and the concrete native-prose hard-rule failures above; the automatic monotony threshold is not fabricated.

### R1 — Internal supporting material: the fact sheet is stale

Original: `facts.md`, “Deliberately left out”, says application venue, joint filing, employer signature/payment-order evidence, the contribution condition and BLI's look-back period are not in the column.

→ Problem & reason: The current drafts now contain these subjects. The sheet also retains a branch/head-office assertion removed from the publication text. It is therefore not a reliable map of this revision's claims. This is an internal evidence-maintenance issue, not an additional false statement in the published body.

→ Fix required: Update the claim inventory to match the revised drafts, with the actual procedural sources and L1/L2 qualifications. Do not use the old sheet to sign off the next revision.

→ Facts preserved: Correct statutory quotations remain; stale descriptions of what the drafts omit must change. No edit applied because the authorized minor-edit scope was the column files.

## What passed or was corrected from round 1

- Article 2 is no longer presented as conclusively allocating every wage debt, and the branch/head-office either/or sentence is gone. The parent-company FAQ is confined to the specified Taiwan-subsidiary hiring; it does not establish liability merely from share ownership.
- The covered-employment assumption is explicit in every hypothetical. The three Article 28 triggers remain alternatives; mere delayed pay while operating is insufficient.
- All four versions describe equal initial rank with the specified first-priority security claims, proportional payment and priority for the unpaid balance. They now say full recovery is not guaranteed, rather than saying full payment is impossible.
- Labor-contract wages, retirement pay under the Labor Standards Act and severance under that Act or the Labor Pension Act remain distinct. The retirement/severance combined advance cap is not imposed on the paragraph-1 priority itself. The actual contribution rate is not confused with the 15/10,000 statutory ceiling.
- Contribution or subsequent make-up, the pre-event wage window, and the distinction between a temporary stoppage and the statutory events have been added. Closure/debt evidence and lodging a claim with the liquidator/administrator are now covered.
- Demand before advance, employer reimbursement, delegated agency responsibilities and the exceptional assessment using insured salary/years are substantially consistent with the sources. L1 concerns the separate court-document description.
- The basic Article 2 average-wage definition and 60% comparison are transcribed correctly; L2 concerns the missing implementing-rule qualification, not the mathematical comparison itself.
- KO's labelled ratio example is correct: claims of 1 and 3 divide a pool of 2 into shares of 1/4 and 3/4, giving 0.5 and 1.5. No invented real estate or actual worker's result is presented.
- The Act and regulation amendment dates and both BLI page-update dates match the retrieved pages. No separate, unsupported effective date is asserted. Sources show the required 2026-10-14 check date.
- Existing statute links resolve to the correct pcode/article. The sources list covers all currently cited external URLs, including the additional English regulation text in EN. C1 concerns missing nearby citations, not missing bibliography entries for existing URLs.
- Two existing, same-language internal column links per version; lint checked the actual local repository files. No current-batch link or wrong-language target.
- Required frontmatter keys and values, H1/title match, dates, audience, labor topic, category, three FAQs, `author: "legal-ai-assistant"` and literal `NNN` image path pass. EN title: 72 characters; SEO title: 32; summary: 157. Its SEO title is required and the summary character restrictions pass. Read times are plausible for the dense legal material.
- No private-party names, bold, phone/hotline numbers, street addresses, messaging IDs, attorney byline, lawyer/native-review claim, fabricated practice experience or unsupported foreign-law note. One permitted firm/email contact paragraph per language. Fictional examples remain labelled.
- KO maintains 합니다체, with one polite “지요”; JA maintains です・ます. ZH has no detected simplified characters or prohibited mainland vocabulary. These checks do not clear the phrasing issues in V1.

## Automated checks and manual variety review

Executed for each language:

`python3 /Users/son7/tseng-col-1014-work/lint.py /Users/son7/tseng-col-1014-work/drafts/C1/<lang>.md <lang> taiwan-unpaid-wages-insolvent-employer-payment-fund`

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1014-work/drafts/C1/<lang>.md`

| Language | Lint | Body length | Sentences | CV | Very-short share | Similar-length run3 | FAIL lines |
|---|---|---:|---:|---:|---:|---:|---:|
| ko | OK | 3480 characters | 107 | 0.535 | 0.196 | 0.057 | 0 |
| ja | OK | 3662 characters | 102 | 0.512 | 0.186 | 0.020 | 0 |
| en | OK | 1597 words | 105 | 0.580 | 0.276 | 0.068 | 0 |
| zh-hant | OK | 2690 characters | 101 | 0.602 | 0.218 | 0.030 | 0 |

KO warning: 97% of sentences end in “니다.” JA warning: 98% desu-masu endings. These are WARN, not FAIL, and are not a reason to break the required registers. EN/ZH report no variety limit violated.

Manual sections 5–6:

1. No stock hypothetical first-sentence opener. KO starts with the triggering events; JA with a fund-payment question; EN with Article 28's priority rule; ZH with a labelled payroll scene. Available batch openings were compared; absent C4–C6 prevent complete batch-distribution certification.
2. Each language has well over two very short sentences. No long-sentence/run-length numerical failure. Some short fragments are nevertheless empty or awkward under V1.
3. Vertical reading finds no opening word used by three prose paragraphs. The measured maximum is two in every language.
4. No three consecutive claim–statute–caveat paragraphs. Citation-free hypothetical/question paragraphs exist. Uncited legal paragraphs are not a legitimate way to satisfy this item; C1 remains.
5. The tool counts zero contrast templates. The unprompted status rebuttal fails the qualitative part of self-check 6; necessary legal limits and eligibility conditions were not counted indiscriminately as forbidden contrasts.
6. Final paragraphs end on the specific hypothetical, wage period and caps. No copied generic disclaimer or sales ending. The repetition is a prose issue, not a falsely asserted formula-closing failure.
7. KO/JA register, no-bold and hypothetical labelling pass. No reviewer edit removed a fact, number, citation or label.

First-two-paragraph deletion test:

- KO: the first paragraph adds the three events, statutory rule and operating-business limitation. The second provides distinct hypothetical facts, demand, employer and coverage assumption. Its final “빈 통장만으로는 부족합니다” repeats the late-pay limitation; consolidate in the V1 revision, retaining the scenario and label.
- JA: the opening question, trigger and no-guarantee qualification have distinct functions. The second paragraph's coverage assumption must remain; its added “口座が空だというだけでは…” repeats the opening limitation and can be consolidated without dropping the assumption.
- EN: the formerly empty “Six months” opener is gone. The opening supplies the rule and qualifications. The second paragraph's final “An empty account does not itself open the fund” adds no new legal condition; remove or consolidate it in the rewrite, preserving the explicit coverage assumption and fictional label.
- ZH: the payroll scene's five-month fact, missing entries, closure, foreign worker, demand, employer and hypothetical/coverage labels add information. “沒入帳，還不是墊償要件” repeats the following paragraph's limitation; consolidate. The second paragraph's no-guarantee statement now has the correct legal force.

Comparison with files 524/523/522 found the same recurring habit of saying a statute does not supply a rule or number. C1 should not repeat that research-memo style merely because it appears in earlier publications. No claim is made that the other columns themselves passed a fresh legal review here.

## Minor edits applied

None. The four column files were left unchanged. Legal qualifications and citations require writer correction, and the broader language revision should accompany those changes. All fixes above are required directions, not applied edits. No commit, push or publication performed.

Reviewed SHA-256 values:

| File | SHA-256 |
|---|---|
| `ko.md` | `3516eec13eb021b7629959cf1a39a0708e5583e8f84e7caa1daa3568ac72dd34` |
| `ja.md` | `656ceba21dde538c1ea7295b8d85b2d51c2e49530536e5d4a76bd8e151a09d8f` |
| `en.md` | `8b405608805aeb229e994decd600d0f1fccef573a6428ded0d9afcdfa93890ce` |
| `zh-hant.md` | `205a566f7460923cc3b48c319b9634f5d22fb5766123e26561f40cf58cda6cdb` |

## Image verdict

OK — directly viewed `images/C1.webp`. The empty sewing workshop, idle machine, folded fabric and empty chairs fit an employer-closure column. The scene is generic, fictional in its supplied generation context, unidentifiable and respectful. No people/faces, readable text or documents, identifiable logos or flags are visible. The wall panel has no legible writing; the machine has no identifiable brand. This checks the image content, not a live site's final rendering.

Image SHA-256: `797ef5319e02226059265ccc46b9c4e1ad1b3ef13e72200653a1d1e24513b5d6`.

VERDICT: FIX
