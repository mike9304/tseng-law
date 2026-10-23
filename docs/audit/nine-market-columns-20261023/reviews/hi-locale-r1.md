# Hindi independent locale review — 669–673, round 1

Current status after repair recheck: `PASS` for all five articles at the hashes in the round-2 appendix below. R1–R3 are resolved. The original round-1 findings are retained as history; the Hindi shared-CLI limitation remains unresolved and is not represented as a numeric PASS.

Review date: 2026-10-23. Reviewer: `review_hi`, an AI editorial reviewer who did not author these articles. This is neither a human native-speaker review nor a lawyer-review claim. Only this report was written; the manuscripts were not changed.

Round-1 decision: `REQUEST_CHANGES`. Articles 669 and 670 needed narrow legal-language corrections; 673 needed a summary grammar correction. Articles 671 and 672 passed the assigned locale review, subject to the independent final legal review and the explicitly unresolved Hindi tooling limitation. No publication or screen-verification claim is made.

## Reviewed versions

Paths are relative to `/Users/son7/tseng-market-columns-20261023/repo/src/content/columns-hi/`. Line numbers refer to these hashes.

| File | Decision | SHA-256 |
| --- | --- | --- |
| `669-indian-supplier-unpaid-taiwan-invoice.md` | REQUEST_CHANGES — R1 | `2cdbb5e35fd45a6631bd5e874fde4f4f5aeb1f743ca65c570d4d7466191e311b` |
| `670-indian-buyer-taiwan-machinery-defect-notice.md` | REQUEST_CHANGES — R2 | `0de513e96daffd6efd34901c80ce8ee76e861d204fd80936ca5b9fd8ce65a22b` |
| `671-indian-engineer-taiwan-noncompete-compensation.md` | PASS — optional S4 only | `91b65d34dd613c38bd36b0fdee5f256ce5cb80264c9bd558bd3f19d836d57cf9` |
| `672-indian-resident-taiwan-rental-deposit-handover.md` | PASS | `f0056a6d267465fc94f53d4b71fd82c1a9df21c0423387a1819f8f6b6f99784b` |
| `673-indian-importer-taiwan-supplier-bank-change-fraud.md` | REQUEST_CHANGES — R3 | `0df821eb9654eb07c614979258f2f3237b6126ac43baa98eb89ac604613d7285` |

Read: task `BRIEF.md`; editorial skill and `references/review-criteria.md`; repo `AGENTS.md`, full `docs/columns/EDITORIAL-VOICE.md`; shared `COLUMN-VOICE-RULE.md`, `SENTENCE-VARIETY-RULE.md`, `LESSONS.md`; relevant India sections of `research-asia.md`; the completed `hi-author.md`; all five articles; opening/heading/ending comparisons from Hindi 016–018. The author report arrived during review and its frozen hashes agree with the independently read files.

## Required repairs

| ID / file:line | Exact passage | Reason and evidence | Proposed rewrite | Legal meaning preserved? |
| --- | --- | --- | --- | --- |
| R1 — `669-indian-supplier-unpaid-taiwan-invoice.md:57` | `फिर भी देनदार ऋण के अस्तित्व को चुनौती देकर, अदालत की अनुमति और उचित सुरक्षा के साथ, वसूली रुकवाने का आवेदन कर सकता है।` | The Hindi makes court permission/security sound like conditions for making the application, while leaving the required declaratory action implicit. [CPC §521](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=521), opened in this review, places the debtor's action seeking a declaration that the claim does not exist before the court's discretionary stay on the debtor's application and security. Retain the distinction between filing, permission and actual stay. | `देनदार आदेश में दर्ज दावा मौजूद न होने की न्यायिक घोषणा के लिए मुकदमा दायर कर सकता है। उसके आवेदन पर अदालत उपयुक्त और सुनिश्चित सुरक्षा देने की शर्त पर जबरन वसूली रोक सकती है।` Keep the existing §521 link, preferably on the second sentence or both sentences together. | Substantive clarification: restores the express procedural condition and the court's discretion. Do not record this as purely stylistic. The final legal reviewer should check the security wording against `相當並確實之擔保`. |
| R2 — `670-indian-buyer-taiwan-machinery-defect-notice.md:43` | `इसमें मूल्य, सामान्य उपयोग या सहमत उपयोग को प्रभावित करने वाला दोष और आश्वस्त गुणवत्ता का अभाव आते हैं; महत्वहीन कमी दोष के मानक में नहीं आती।` | The combined sentence can extend the insignificant-diminution exception to the separately guaranteed quality obligation. [Civil Code §354](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=354), reopened here, separates the value/use diminution rule and its exception from the second paragraph's guaranteed-quality obligation. A machine acceptance dispute should retain that separation. | `मूल्य, सामान्य उपयोग या सहमत उपयोग को प्रभावित करने वाले दोष धारा 354 के पहले अनुच्छेद में आते हैं; मूल्य या उपयोग में नगण्य कमी को उसमें दोष नहीं माना जाता। उसी धारा के दूसरे अनुच्छेद के अनुसार, जोखिम हस्तांतरित होते समय वह गुणवत्ता भी मौजूद होनी चाहिए जिसकी विक्रेता ने गारंटी दी थी।` Keep the preceding risk-transfer sentence, §354 link and following causation sentence. | Substantive clarification of the exception's scope; retains the positive value/use rule, risk-transfer timing and guarantee obligation. Final legal reviewer to recheck. |
| R3 — `673-indian-importer-taiwan-supplier-bank-change-fraud.md:4` | `बदले बैंक विवरण पर भुगतान के बाद भारतीय आयातक को बैंक से तुरंत संपर्क, मूल ईमेल सुरक्षित और सप्लायर की अनुमति जाँचनी चाहिए।` | The three coordinated items do not share a grammatically valid predicate: `संपर्क` requires `करना`, `ईमेल सुरक्षित` requires `रखने`, and `अनुमति` requires `की जाँच करनी`. This is a visible card/summary defect, not an objection to ordinary English business terms. | `बदले बैंक विवरण पर भुगतान के बाद भारतीय आयातक को तुरंत अपने बैंक से संपर्क करना चाहिए, मूल ईमेल सुरक्षित रखने चाहिए और सप्लायर की अनुमति की जाँच करनी चाहिए।` Keep the second sentence of the summary. | Yes. Same three actions, same urgency and no new legal obligation or recovery promise. |

Final-review cross-check received from root: `final_asia` independently agrees that R2 is a material §354 exception-scope issue. Its alternative wording explicitly separates the first and second statutory paragraphs (`पहले अनुच्छेद ... दूसरे अनुच्छेद ... अलग दायित्व`). The proposed rewrite above retains that separation while using `गारंटी दी थी` for accessible Hindi. The original risk-transfer sentence must remain.

Additional cross-check from `final_asia`: after reopening §521(3), it confirms R1 must retain the declaratory action, debtor's application, security and court discretion, and accepts `उपयुक्त और सुनिश्चित सुरक्षा` as preserving the adequacy/certainty of `相當並確實之擔保`. This verifies the proposed correction, not an as-yet-unwritten repaired manuscript.

## Optional, bounded language improvements

These are not additional blockers. Do not expand them into a full rewrite or remove useful business terms simply to make the text more Sanskritized.

| ID / file:line | Exact passage | Reason | Proposed rewrite | Legal meaning preserved? |
| --- | --- | --- | --- | --- |
| S1 — `669-indian-supplier-unpaid-taiwan-invoice.md:27` | `माल की कीमत माँगने के लिए दो साल भी पूरी समय-सीमा हो सकती है।` | `भी पूरी समय-सीमा` is a slightly awkward literal construction. The next sentence correctly supplies the conditional Taiwan-law scope. | `माल की कीमत वसूलने का दावा करने की समय-सीमा केवल दो साल हो सकती है।` | Yes; retain the following governing-law condition and §127(8) scope. |
| S2 — `669-indian-supplier-unpaid-taiwan-invoice.md:65` | `समीक्षा के लिए भुगतान की नियत तारीख और आखिरी माँग की तारीख अलग-अलग तैयार रखें।` | The body correctly rejects indefinite renewal by reminders, but a reader collecting only the latest demand could miss earlier relevant events. Make the evidence instruction cover the whole sequence, without declaring which event legally interrupted time. | `समीक्षा के लिए भुगतान की नियत तारीख और पहली माँग से अब तक के संदेशों की तारीखें, उनके पहुँचने के प्रमाण सहित, तैयार रखें।` | Yes as an evidence recommendation. It does not announce a new limitation rule. [§130](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=130) was reopened; its six-month requirement remains unchanged. |
| S3 — `670-indian-buyer-taiwan-machinery-defect-notice.md:55` | `दो घड़ियाँ: पहली सूचना और अधिकार का प्रयोग` | `दो घड़ियाँ` imports the English “two clocks” metaphor and is less direct than the otherwise practical headings. | `खराबी की सूचना और अधिकार इस्तेमाल करने की अलग समय-सीमाएँ` | Yes. The body must continue distinguishing immediate notice from six months/five years and §361. |
| S4 — `671-indian-engineer-taiwan-noncompete-compensation.md:68` | `बिना रहस्य वाला छोटा सार` | Understandable, but `रहस्य` can mean any secret/mystery. A professional intake instruction should say confidential information explicitly. | `गोपनीय जानकारी के बिना संक्षिप्त विवरण` | Yes; no change to intake scope. |
| S5 — `673-indian-importer-taiwan-supplier-bank-change-fraud.md:29` | `उपलब्ध स्थिति को उसी नाम से दर्ज करें।` | The referent of `उसी नाम` is unclear; paragraph 1 already requires recording the bank's answer. The sentence is removable under the opening deletion test. If retained, make the difference concrete. | Delete this sentence; alternatively: `बैंक ने केवल अनुरोध दर्ज किया है या वास्तव में रकम रोकी है, उसके जवाब के अनुसार ही लिखें।` | Yes. Deletion preserves the prior bank-record instruction and explicit no-guarantee sentence; the alternative adds no guarantee. |
| S6 — `673-indian-importer-taiwan-supplier-bank-change-fraud.md:64` | `यह कंपनी का सुझाया नियंत्रण है, कोई ऐसी वैधानिक सूची नहीं जिसे पूरा करते ही हर भुगतान सुरक्षित हो जाए।` | `कंपनी का सुझाया नियंत्रण` is a literal “company control” construction and its possessor is unclear. | `स्वतंत्र पुष्टि कंपनी की आंतरिक जाँच प्रक्रिया का हिस्सा हो सकती है; इससे हर भुगतान की सुरक्षा की कानूनी गारंटी नहीं बनती।` | Yes. Maintains recommendation versus legal guarantee; does not turn CIB guidance into a mandatory statutory checklist. |

The dense English document vocabulary in 670:33–41, 671:42–58 and 673:41–48 is comprehensible for the stated commercial/engineering audience. `purchase order`, `serial number`, `non-compete`, `headers` and `logs` can identify the actual records the reader needs. No material meaning is lost through that mixing. If polishing later, explain `electronic export` once as `ईमेल की मूल डिजिटल प्रति (export)` and use `नियोक्ता` instead of the isolated `employer`; these are optional readability choices.

## First-two-paragraph deletion test

Sentence numbering resets per paragraph. The test was performed independently before reading the author's own deletion table. Required repairs above affect later legal text and the summary; S1/S5 concern the opening.

| Article | Paragraph 1: information lost if deleted | Paragraph 2: information lost if deleted |
| --- | --- | --- |
| 669 | S1 is the immediate two-year warning; retain with optional S1 rewrite. S2 identifies qualifying sellers, Taiwan-law scope and source. S3 supplies accrual and the due-date record. | S1 explains choice/closest connection; S2 connects limitation to that law; S3 makes the buyer-location limitation explicit. The short S3 is useful despite following from the rule. |
| 670 | S1 supplies the pending-final-report dilemma; S2 answers it with inspection/notice duties; S3 distinguishes an internal complaint from notice to the seller. | S1 identifies the actual contractual records; S2 prevents automatic Taiwan-law application; S3 preserves sales-versus-mixed-contract scope; S4 limits the Indian import/safety/tax scope. No generic preview paragraph is needed. |
| 671 | S1 establishes the salary/bonus exclusion; S2 gives a conditional package-language problem rather than invented client history and identifies what to compare. | S1 limits the analysis to covered employment; S2 keeps nationality from deciding applicable law; S3 identifies deputation/status/place questions; S4 preserves the India enforcement boundary. |
| 672 | S1 is an explicitly labelled fictional departure/deposit scene; S2 turns it into the two necessary records. Keeping it does not imply an actual client story. | S1 gives the scoped cap; S2 gives the cumulative return conditions; S3 preserves lawful setoff; S4 tells the reader how to distinguish paid deposit and refundable balance. |
| 673 | S1 gives the urgent bank step; S2 supplies transfer identity/recall request; S3 records the bank's answer; S4 prevents waiting for allocation of liability. | S1 gives the Indian reporting route; S2 anchors it in a dated official statement; S3 bars freeze/refund guarantees. S4 is dispensable or needs concrete rewriting: S5 above. |

## Same-locale comparison

These are the three accessible high-ID Hindi comparators. None has `published`, so neither this report nor the author report establishes that they are the three most recently published live articles. Their date-display and modification dates differ. No old metadata was changed.

| Comparator | Observed dates | Concrete comparison with the new batch |
| --- | --- | --- |
| `repo/src/content/columns-hi/016-taiwan-inheritance-custody-analysis.md` | `lastmod: 2026-10-11`; display `13 सितंबर 2025`; no published field | Opens by dividing many family-law questions and repeats distinctions in paragraph 2; has 11 numbered headings and a broad disclaimer. New 669–673 are narrower, use document-specific actions and non-numbered issue headings. |
| `repo/src/content/columns-hi/017-taiwan-logistics-business-setup.md` | `lastmod: 2026-10-07`; display `13 सितंबर 2025`; no published field | Opens with licensing categories and an explicit three-scenario article preview; headings organize formation/acquisition/outsourcing. New articles avoid that preview structure and start with a deadline, reader question, compensation rule, labelled scene or urgent action. |
| `repo/src/content/columns-hi/018-taiwan-semiconductor-market-entry.md` | `lastmod: 2026-10-07`; display `17 सितंबर 2026`; no published field | Has long, formal numbered entity-choice headings and an inquiry paragraph listing operational facts. The new batch uses more ordinary business Hindi and preserves the useful non-sensitive first-inquiry/four-language limitation without copying the entry-structure topic. |

The raw 016/017 files include an attorney footer. This review did not inspect the site's attribution-stripping code and does not claim those raw footers are currently public. The five new files have no such footer.

## Sentence variety and section 5 independent check

Executed on every frozen file:

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-market-columns-20261023/repo/src/content/columns-hi/<file>
```

The actual result was exit 1 for all five, with language `[ko]`. The script does not support Hindi or segment Hindi danda as Hindi sentences. These are neither valid Hindi PASS results nor evidence that the Hindi prose has zero short sentences.

| ID | Shared reported sentences / cv / short | Shared FAIL |
| --- | --- | --- |
| 669 | 16 / 0.495 / 0.0 | short_share |
| 670 | 18 / 0.424 / 0.0 | len_cv, short_share |
| 671 | 16 / 0.272 / 0.0 | len_cv, short_share |
| 672 | 20 / 0.505 / 0.0 | short_share |
| 673 | 16 / 0.303 / 0.0 | len_cv, short_share |

Independent diagnostic: remove frontmatter, source tail, headings/tables/list paragraphs and Markdown link destinations; split prose at `।?!`; count whitespace words. This is transparent rhythm evidence, not a validated Hindi pass threshold. The English eight-word short-sentence threshold is only a descriptive reference.

| ID | Sentences | Mean words | CV | Sentences ≤8 words |
| --- | ---: | ---: | ---: | ---: |
| 669 | 44 | 15.82 | 0.436 | 10 (22.7%) |
| 670 | 56 | 15.79 | 0.430 | 7 (12.5%) |
| 671 | 51 | 14.98 | 0.441 | 11 (21.6%) |
| 672 | 54 | 15.59 | 0.425 | 9 (16.7%) |
| 673 | 50 | 15.92 | 0.406 | 7 (14.0%) |

The diagnostic CVs would not meet 0.45 if that numerical threshold were mechanically imported. No such PASS is asserted. There is no calibrated Hindi metric in the shared tool; root must retain the limitation instead of silently calling the mandatory CLI successful. My actual-reading assessment finds usable short/long variation and no blocking monotony defect in this batch. It cannot resolve the numerical tooling requirement.

| Section 5 item | Independent assessment |
| --- | --- |
| 1. CLI | Unsupported for hi; actual failures retained above. No shared-tool edit or score gaming. |
| 2. Opening variety | Number/consequence (669), question (670), compensation rule (671), labelled scene (672), conditional urgent step (673). No stock hypothetical opener; one labelled scene in five. |
| 3. Short sentences | Each has at least two actual short sentences, e.g. `पूरा संदेश बचाएँ।`, `सुरक्षा जरूरी है।`, `अधिकतम अवधि दो साल है।`, `तारीख सहित मीटर रीडिंग लें।`, `दोनों बिल अलग रखें।`. Legal conditions remain connected. |
| 4. Paragraph starts | In the prose diagnostic, the most repeated initial token occurs twice in every article. No repeated three-paragraph identical opener found. |
| 5. Citation rhythm | Rule paragraphs alternate with records/actions/questions. No three consecutive claim-citation-caveat paragraphs identified. Several practical paragraphs have no citations because they describe evidence preparation, not a new rule. |
| 6. Contrasts | The contrasts address real issues: sending money versus discharging a debt, salary versus restriction compensation, flight versus lease end, notice versus remedy exercise. No unsupported imaginary reader position or historical-year rebuttal found. |
| 7. Endings | Each substantive CTA ends on its own evidence: payment chronology, replaced parts, clause/compensation date, itemized deductions or both invoices. Source/disclaimer tails are structural. The uniform language-availability warning conveys a necessary service limit. |
| 8. Register/prohibitions | Calm professional Hindi, ordinary commercial terms, no bold or body H1, no invented first-person experience, no public human/AI byline. No repeated command-heading formula. |
| 9. Preservation | Proposed language changes preserve numbers and URLs. R1/R2 are explicitly substantive clarifications requiring final legal confirmation, rather than covert style edits. |

MONOTONY: no blocking repeated-pattern finding from the independent Hindi reading. Optional local rhythm concern — 670:33 (`मशीन का serial number और ऑर्डर लिखें। डिलीवरी और विफल परीक्षण की तारीख भी दें। ... सूचना में वास्तविक खराबी बताएँ।`) stacks several instructions, but they are an actual first-notice sequence and serve distinct evidence functions; rewriting solely to raise CV is not recommended.

## Legal meaning, source and CTA checks

The following official sources were reopened during this locale review on 2026-10-23, in addition to the supplied ledger. The MOJ pages displayed consolidation through 2026-10-16; this is not proof of later unpublished amendments.

- [Civil Code §130](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=130): demand-based interruption and six-month consequence. Article 669 correctly conditions the two-year goods-price rule on governing law and does not apply it to all commercial claims. R1 concerns a different procedural passage.
- [CPC §521](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=521): the specific R1 sequence. Final review should retain the separate issuance/service/objection periods elsewhere in 669 and check the declaratory-action wording after repair.
- [Civil Code §§354](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=354) and [365](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=365): R2 is a narrow exception-scope correction. The six-month and five-year limits in 670 concern rescission/price reduction, and the deliberate-nondisclosure exception is correctly limited to the six-month limb. Immediate initial notice is not replaced with a six-month grace period.
- [LSA §9-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=9-1) and [Enforcement Rules §7-3](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030002&flno=7-3): 671 preserves the four cumulative conditions, two-year maximum/reduction, exclusion of ordinary employment-period payments, and post-departure payment arrangement. Fifty percent of one month's statutory average wage is not described as independently sufficient. India enforcement and confidentiality remain separate.
- [Rental Housing Act §7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060125&flno=7) and [§12](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060125&flno=12): 672 preserves the deposit cap, cumulative return conditions, lawful balance after setoff, joint handover/reasonable notice, and separate leftover-property procedure. No promised refund by the flight date. Final review still needs its broader scope check of exclusions/mediation.
- [Civil Code §310](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=310): 673's ratification/benefit examples are not presented as an exhaustive list. Sending the transfer, supplier-debt discharge and loss allocation remain distinct.
- [India MHA/PIB statement of 12 August 2026](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2298336&lang=2&reg=48): confirms the NCRP route and financial-fraud reporting mechanism. 673 does not claim a successfully tested submission, freeze, reimbursement or guaranteed recovery. The portal's actual submission UI was not tested by this reviewer.

All five provide one email route, same-locale contact link and a relevant existing Hindi link. Titles and FAQs identify the actual question. Related-reading links are sometimes adjacent because the old Hindi inventory lacks direct counterparts; 672 explicitly distinguishes its commercial-location link from the residential subject. No invented office, Indian licensure, result, client or experience claim found. The consultation limitation explicitly lists English, Chinese, Japanese and Korean and does not promise Hindi service. Initial contact is limited to non-sensitive facts, opposing-party identity and relevant dates; no immediate upload of sensitive originals is requested. Internal `author: legal-ai-assistant` remains.

Image descriptions/captions are linguistically appropriate and explicitly illustrative. I did not independently inspect the pixels; the author's image inspection and root's asset checks are separate evidence.

## Additional UI wording requested by root

`हिन्दी पाठकों के लिए सुझाए गए लेख` is grammatical and fits a Hindi recommendations section. For consistency with the articles' spelling, prefer `हिंदी पाठकों के लिए सुझाए गए लेख`. A shorter UI option is `हिंदी में सुझाए गए लेख`. Both mean recommended articles in/for Hindi without implying a Hindi-speaking lawyer or India-law practice. No UI code was changed by this reviewer.

## Next bounded check and remaining limits

Author/root should repair R1–R3, optionally adopt S1–S6, and supply the new hashes. This reviewer should then recheck the changed passages and affected FAQs/conclusions. The independent final legal reviewer should specifically confirm R1's declaratory-action/security formulation and R2's guaranteed-quality distinction, then complete the broader official-source checks.

This report does not resolve the shared tool's lack of Hindi support, live chronology of comparator publication, full browser typography/mobile behavior, live internal routes, remote source collisions, deployment or public readback. Those remain root integration/release responsibilities. A local language PASS is not publication readiness by itself.

## Round-2 appendix — independent repaired-version check, 2026-10-23

Decision: `PASS` for all five assigned articles in the locale-review scope. Reviewer `review_hi` remains independent of the author and did not edit the manuscripts. No material locale finding remains. Optional S1–S6 were not adopted; they remain non-blocking suggestions and are not silently reclassified as defects.

The author confirmed the repair freeze and recorded it in `hi-author.md`. I reread the three changed passages, the surrounding legal explanation, all five current FAQ sets and each current final substantive paragraph. R1 now expressly identifies the declaratory action and separates the debtor's application from the court's discretionary stay on appropriate/certain security. R2 now separates §354 paragraph 1's value/use diminution exception from paragraph 2's guaranteed-quality obligation, retaining both the preceding risk-transfer sentence and following causation sentence. R3 supplies the appropriate Hindi predicate for each summary action and preserves the second sentence. The FAQs and endings do not contradict those repairs; all four confirmed consultation languages, sensitive-document limits and no-guarantee statements remain.

| File | Current locale decision | Independently recomputed SHA-256 |
| --- | --- | --- |
| `669-indian-supplier-unpaid-taiwan-invoice.md` | PASS — R1 resolved | `0982417534e2e25830e311e4510f9bb594a0f509bff80cf82572db97e185d63f` |
| `670-indian-buyer-taiwan-machinery-defect-notice.md` | PASS — R2 resolved | `128e52e87248c9f69384ef259497edcf615a15e7276f15b1a541ee2be03c086c` |
| `671-indian-engineer-taiwan-noncompete-compensation.md` | PASS — unchanged | `91b65d34dd613c38bd36b0fdee5f256ce5cb80264c9bd558bd3f19d836d57cf9` |
| `672-indian-resident-taiwan-rental-deposit-handover.md` | PASS — unchanged | `f0056a6d267465fc94f53d4b71fd82c1a9df21c0423387a1819f8f6b6f99784b` |
| `673-indian-importer-taiwan-supplier-bank-change-fraud.md` | PASS — R3 resolved | `e31af5e8b7d41a77ab50b8bce8defa9a2a296fa0c1a33ebdfd327e33668a454f` |

Bounded-change evidence: a read-only Python check reversed only the exact R1, R2 and R3 replacements in memory and SHA-256 hashed each reconstructed version. Each hash exactly matched the corresponding original r1 hash. The same check directly confirmed unchanged hashes for 671/672 and printed `BOUNDED_REPAIR_CHECK 5/5 PASS`. Thus there are no other manuscript changes hidden within this repair pass. No file was reverted or rewritten by that check.

The mandatory shared CLI was independently rerun on the three changed files; 671/672 retain their identical r1 result because their bytes are unchanged. All still select `[ko]` and exit 1:

| ID | Current shared sentences / mean / cv / short | Actual shared FAIL |
| --- | --- | --- |
| 669 | 16 / 190.9 / 0.490 / 0.0 | short_share |
| 670 | 18 / 220.1 / 0.435 / 0.0 | len_cv, short_share |
| 673 | 16 / 223.7 / 0.303 / 0.0 | len_cv, short_share |

These are recorded unsupported-language results, not a Hindi numerical PASS. The r1 danda diagnostics describe the original r1 text, not a fresh post-repair metric run. The repairs did not alter openings, paragraph starts, endings or the batch's repeated-pattern assessment; R1/R2 were substantive precision changes and R3 was frontmatter grammar.

Final handoff: root and `final_asia` should use the current hashes above for final legal/integration checks. The independent final legal decision, unsupported CLI resolution/acceptance, browser reading checks, publication and public verification are separate from this completed locale review.
