# Hindi ARC revision — independent locale review

Status: PASS after the verified author repairs R1 (706 Article 7 duty) and R2 (705 Article 16(2) sponsor eligibility). No unresolved material locale finding remains.

Reviewer: independent AI Hindi editorial reviewer `/root/review_rev2_hi`. I did not author or edit the three manuscripts. This is not a human native-speaker, lawyer, browser-rendering or publication certification. I own only this report. The full originals at `174454bd4bb8d9e05627d71f9ef0af646540b3e4` and the three complete rewrites were read independently.

## Exact reviewed versions

| Manuscript | SHA-256 | Locale finding |
|---|---|---|
| `src/content/columns-hi/704-taiwan-arc-first-application.md` | `6a17e788f35639e42a6d37cc02aae592422dc81ab1df6b54e9b8deeacedabe01` | PASS |
| `src/content/columns-hi/705-taiwan-visa-residence-work-study-family.md` | `955f9855c3eb48753a41e480788d5cd72d641eb7ac2c5ba3971f4667af145f52` | PASS after R2 |
| `src/content/columns-hi/706-taiwan-arc-renewal-changes-reentry.md` | `190de9e4ae9b984959b0346b85579c698b3952c0f1aa3d8abdd180e4db609fae` | PASS after R1 |

Read in full: `REVISION-BRIEF.md`, `INDEPENDENT-REVIEW.md`, repository `AGENTS.md`, `docs/columns/EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `SENTENCE-VARIETY-RULE.md`, `LESSONS.md`, the editorial skill and its complete review criteria, `hi-author.md`, and `work/research/source-refresh.md` (2026-10-24 06:28:50 UTC version). Retired Fable workflow instructions were not applied.

## Closed finding and bounded repair R1

The initial review returned REQUEST_CHANGES for 706 at SHA-256 `f7bf9724a2a0258a8f613222199c8d50336344b1b18890ea2ae09ed86fb1871b`. The author, not this reviewer, repaired the sentence. The table preserves the finding and proposed direction as review history.

| File:line | Exact sentence/span | Reason and evidence | Proposed repair | Legal meaning preserved? |
|---|---|---|---|---|
| `src/content/columns-hi/706-taiwan-arc-renewal-changes-reentry.md:46` | `नियमों का अनुच्छेद 7 संबंधित पात्रता पूरी करने वाले व्यक्ति को घटना से 15 दिन के भीतर BOCA या उसकी शाखा में नया निवासी वीज़ा माँगने का रास्ता देता है।` | `रास्ता देता है` describes an available permission while the official Article 7(2) directs an applicant changing to a basis outside Article 23-1(1) to apply within 15 days. The deadline must retain mandatory force. The preceding original merely described the procedure; this rewrite should not make it sound optional. I reopened the current official [residence regulations](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129) and read Article 7(2), including `應自事實發生之日起算十五日內`. The source-refresh R07 agrees. | Retain the Article 23-1 exclusion, eligibility qualification and BOCA/branch → NIA sequence, but make the 15-day application a duty: `… संबंधित पात्रता पूरी करने वाले व्यक्ति को घटना की तारीख से 15 दिन के भीतर BOCA या उसकी शाखा में नए निवासी वीज़ा के लिए आवेदन करना होता है।` The author can split the preceding condition into its own sentence for Hindi flow. Keep the existing no-automatic-approval/no-extra-stay sentence. | This is a substantive modality clarification restoring the source's binding force, not a style-only synonym change. No amount, period, class, exception or agency sequence changes. Record it explicitly in the author report. |

R1 now reads: `… नियमों के अनुच्छेद 7 के अनुसार संबंधित पात्रता पूरी करने वाले व्यक्ति को घटना की तारीख से गिनकर 15 दिन के भीतर BOCA या उसकी शाखा में निवासी वीज़ा के लिए दोबारा आवेदन करना होता है।` I reread the full repaired paragraph, deadline table, opening, FAQ and ending. The binding application duty is restored, with the exclusion, eligibility condition, event-date start, 15 days, BOCA/branch and subsequent NIA application preserved. No automatic-approval or extra-stay entitlement was introduced. The author report explicitly records this as a substantive legal-strength correction.

An independent reconstruction check replaced only this new sentence with the prior reviewed sentence and recovered exactly the original `f7bf…` hash. Thus the rest of 706 is byte-identical to the complete version already reviewed. At R1, 704 and 705 hashes were unchanged; the later 705 change is recorded separately below. The actual 706 CLI was rerun and passes; the scoped `git diff --check` also exits 0.

## Closed final-review finding and author repair R2

The final Asia reviewer identified an omitted eligibility condition in 705:67 and the corresponding family FAQ at 28. I independently reopened the current [professionals Act Article 16(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) and confirmed the distinction. The prior wording `विदेशी पेशेवर के परिवार के लिए उस पेशेवर का निवास या स्थायी निवास स्वीकृत होना जरूरी है।` did not specify an ordinary foreign professional currently doing professional work in Taiwan, as distinct from a foreign special professional. This was a substantive scope correction, not a style-only revision.

The author changed only the family FAQ and body passage. The current body says `ताइवान में पेशेवर काम कर रहे विदेशी पेशेवर, या विदेशी विशेषज्ञ पेशेवर` and requires that the sponsor already have NIA residence or permanent-residence approval. The Hindi `या` preserves the two alternative sponsor classes; `कर रहे` describes current work in Taiwan for the ordinary-professional class. The following paragraph keeps the covered spouse, minor children, and adult children unable to care for themselves because of physical or mental disability, plus visa-free/visitor entry and entry-scheme conditions. The matching FAQ contains the same sponsor and family-entry conditions. No ordinary professional's mere label or expired work relationship is presented as sufficient.

I reread both revised passages, the surrounding Taiwanese-spouse/work-permission discussion, opening, summary and ending. The longer eligibility sentence is necessary and intelligible Hindi; separating sponsor eligibility from the relatives makes the paragraph easier to follow without weakening the conditions. No promotional filler or new qualification claim was added. The author report expressly records the substantive correction.

Reconstruction of only the revised FAQ/body back to their preceding text exactly recovered the prior independently reviewed 705 hash `1207ca2c47c33e8e9e4288a93e6c12cdaf95e6801d591fe4125585f986858995`. All other bytes are unchanged. All 19 link targets and the official-source list remain identical. The actual CLI rerun is recorded below and exits 0 with no warnings; scoped `git diff --check` exits 0. Final 704 and repaired 706 hashes were re-read and remain those in the top table. R2 is closed; no further locale repair is requested.

## Why this rewrite is materially better

This judgment is based on the prose, not just the metric result. The texts now usually attach the condition or consequence to the operative rule, with fewer detached directions to “check” or “understand” something. Necessary negative limits remain where they prevent an actual visa or work-permission error. There is no reason to erase those simply to reduce negative sentences.

| Original → current | Actual improvement and retained meaning |
|---|---|
| 704: `हिंदी पढ़ने से किसी व्यक्ति की नागरिकता तय नहीं होती।` → `किस कार्यालय में प्रमाणीकरण होगा, यह पासपोर्ट और उस कार्यालय के क्षेत्राधिकार पर निर्भर करता है।` (51) | The reader no longer receives an irrelevant rebuttal about speaking Hindi. The paragraph states what determines the relevant authentication office. The foreign-national limitation and special-population exclusions remain at 75. |
| 704: `फोटो की अवधि भी संबंधित आवेदन से देखें।` → the actual ARC two-year photo period and BOCA student-resident-visa six-month period (49). | Removing the preliminary instruction leaves a concrete comparison. Neither photo period nor agency/application scope was lost. |
| 704: `ये छात्र प्रक्रिया के निर्देश हैं। दूसरी श्रेणी में अपने पोर्टल की सूचना देखें।` → `छात्र पोर्टल पर मंज़ूरी की तारीख से पाँच कार्यदिवस के भीतर भुगतान करना होता है।` (69), with the card collection rule in the same paragraph. | Scope is carried by “student portal” rather than repeated as detached cautions. Five working days from approval and three working days after payment remain distinct. |
| 705: `मंदारिन के लिए अलग तैयारी है। पहले … देखें।` → the qualifying institution/admission proof and Chinese-study visitor visa followed by the completed four-month and further three-month requirements (59). | An empty transition becomes the application sequence itself. The minimum, weekly class-hours and attendance limits remain. |
| 706: `बैंक, विश्वविद्यालय या कंपनी का रिकॉर्ड बदलने के बाद भी NIA का पंजीकरण बच सकता है।` → `बैंक, विश्वविद्यालय या कंपनी के रिकॉर्ड में नया पता दर्ज होने से NIA का रिकॉर्ड अपने आप नहीं बदलता।` (58). | The old “registration may remain” construction was unnatural and imprecise. The new version explains the separate NIA record without losing the registration duty. |
| 706: four short statements asking about travel effect and warning against generalization → a sentence specifying the NIA 0915 pending-application departure consequence and one request using the actual category/travel dates (84). | The reader gets the rule before the follow-up action. It remains confined to that direct-residence procedure. The current NIA 0915 page was reopened for this targeted comparison. |

The use of `है` is not itself an AI-style defect. The surrounding predicates vary (`जारी करती`, `गिनी जाती`, `निर्भर करती`, `लगता`, `मिलता`, `आवेदन होता`), and practical imperatives occur where the reader actually has a document or filing action. I did not request artificial tense changes or meaningless short sentences to suppress an ending warning.

## Opening deletion test

704 paragraphs 1–2 (30–32): the first sentence supplies the resident-visa holder's duty and 30 days; the next supplies the next-day start. The ARC definition explains an unfamiliar abbreviation. The NIA sentence identifies the issuing authority and the integrated-document exception. The second paragraph distinguishes a resident visa issued inside Taiwan, whose 30 days run from issuance, and names the records used to determine the applicable date. Each component has a distinct role. No “this article explains” opening remains.

705 paragraphs 1–2 (31–33): the opening question identifies the real choice between obtaining a resident visa and making a direct ARC application. The next sentence answers for the eligible professional route; the third keeps study/family eligibility tied to the entry visa. The next paragraph makes the passport nationality/purpose/entry scheme condition and official passport-list source explicit. Removing those would lose an application choice or a material eligibility condition, rather than remove empty scenery.

706 paragraphs 1–2 (30–32): the first sentence gives the events that make the printed card date insufficient; the next identifies the cancellation/revocation rule; the short exception sentence avoids presenting it as universal. The second paragraph distinguishes renewal, record change and a new residence basis. Its final sentence supplies the event-date/expiry-date framework. No separate instruction to “consider the issue now” remains. The limited opening exception is developed later in the family paragraph rather than repeatedly restated.

## Three independently read recent Hindi comparators

These are comparisons of actual prose, not endorsements of every sentence in the earlier articles. Each is dated 2026-10-23; all three full files were read.

| Comparator | Opening, heading and ending comparison |
|---|---|
| `src/content/columns-hi/671-indian-engineer-taiwan-noncompete-compensation.md` | Opens with salary/bonus not counting as compensation for a post-employment restriction, followed by Taiwan-law applicability. Headings focus on four legal conditions, the two-year ceiling and the half-average-wage threshold. The final substantive instruction is to keep the signed clause and compensation due date. 704 similarly ends with a specific document/date, but starts with its affirmative filing deadline, not the comparator's rebuttal frame. The comparator's long contact paragraph was not copied. |
| `src/content/columns-hi/672-indian-resident-taiwan-rental-deposit-handover.md` | Opens with a clearly labelled fictional move-out scene, then gives the two-month deposit limit and return conditions. Headings concern accommodation type, flight versus lease date, key handover and deductions. The substantive closing asks for agreement/objection beside each deduction. The ARC batch does not copy that scene-opening shape or invent an applicant; its document/date endings remain tied to its own filing tasks. |
| `src/content/columns-hi/673-indian-importer-taiwan-supplier-bank-change-fraud.md` | Opens with urgent bank contact after payment to a changed account and India's reporting route. Headings ask what a receipt proves, preserve both instructions and consider a second demand. The last substantive sentence preserves both invoices. The ARC headings follow real filing issues, and the urgent fraud tone is absent. 706's ending instead supplies expiry/change/return dates to NIA. |

## Title, summary, FAQ and ending read separately

- 704 title promises application, papers and card timing, all covered. Its summary begins with the actual 30-day rule. FAQ 1 retains the integrated-document exception and excludes a general tourist conversion entitlement; FAQ 3 keeps annual fee, sub-year treatment and the eligible direct-route surcharge. The ending is card details, correction and the renewal calendar, not a promotional restatement.
- 705 title and summary name the actual employment, study and family routes. The three FAQs address the direct professional route, Mandarin threshold and defined family classes. The ending supplies the records needed to identify the route, plus the changed-basis deadline link. It does not claim consultation in Hindi or access to every visa category.
- 706 title and summary cover renewal/change/travel without promising permission. The FAQs retain the pre-expiry three-month window, next-day 30-day address/workplace rule and receipt/reentry distinction. The ending contains the less-than-30-days overstay condition, continuing original basis and penalty before reapplication; there is no guarantee. The Article 7 modality finding above is closed by the author repair.

## Source, numeric and scope preservation

An independent script compared the originals and current Markdown. Results: 704 has 16 unique retained Markdown link targets, 705 has 19 and 706 has 17. No original URL is missing; no URL was added. Each official-source list is byte-for-byte unchanged. Excluding URL strings and the new featured-image metadata, no original numeric token is missing and none was added. This inventory is only a support check; the conditions were read manually.

Manual comparison retained:

- 704: 30 days from the day after entry versus domestic resident-visa issuance; integrated-document exemption; permit/exemption and recent employment proof; admission versus registration/study proof; family/address proof; two-year ARC photo versus six-month BOCA photo; authentication/possible verified Chinese translation; specified Taiwanese spouse residence/home-registration/presence and first-card one-year cap; NT$1,000 per year including sub-year periods; eligible NT$2,200 surcharge; restricted overseas-compatriot-student fee exception; ordinary three-year cap and professional exceptions; ten working days with exclusions/restart; student approval/payment/collection stages and electronic ARC at six months or less; Article 43 exceptions.
- 705: special-entry exclusions and applicable-law exception; eligible professionals' permit or exemption; separate migrant-worker route; actual work rather than company registration; study-purpose visitor eligibility; four completed Mandarin months, at least three further registered months, 15 weekly hours Monday–Friday and at most one-quarter absence including leave; relevant student work permission and 20-hour cap outside winter/summer holidays; Taiwanese spouse conditions; 60-day visitor/visa-restriction condition; after R2, the ordinary professional currently working professionally in Taiwan or the foreign special professional, with prior NIA residence/permanent-residence approval for either, and spouse/minor/qualifying adult child scope; limited family work exemption; four Gold Card functions and entrepreneur eligibility.
- 706: continued-basis renewal; three-month ordinary versus four-month Gold Card/continuing-business entrepreneur window and separate ended-business three-month route; next-day 30-day address/workplace clock versus event-date change-of-basis clock; mandatory 15-day BOCA then NIA route after the modality repair; recent study proof and Mandarin six-month limit; annual fee; employer permission/exemption; graduation extension one year plus one additional year, maximum two and no automatic Mandarin inclusion; conditional family exceptions; passport update; NT$500 loss/damage reissue and nonexclusive evidence choices; overseas own-account/other-account/representative distinctions; special older migrant-card/single-reentry cases; Article 34/APRC exception; narrow departure consequence; less-than-30-days overstay with the original basis continuing, penalty and no guarantee.

No wording was added that says an eligible recent graduate with approved post-graduation extended residence always needs an employer permit. The separate source-refresh warning about current professionals Act Article 12 was considered. No new foreign-law jurisdiction, licensing, consultation-language, attorney/native review or public-author claim is present. Internal `author: legal-ai-assistant`, article dates and routes are unchanged.

## Image inspection

I opened all three actual local WebP images with `view_image`, not just the filenames. 704 shows the blank passport-like booklet, folder, small plain card and pen; 705 shows the closed laptop, books, two mugs and blank travel booklet; 706 shows an open blank notebook, booklet, plain card, house keys and travel bag. Taipei is visible through the window in all three illustrations. No real identity card, readable official form, person, logo or flag is visible. The Hindi alts name visible objects and do not claim official authenticity; omission of secondary decorative objects is not a mismatch. Captions explicitly identify illustrative scenes. Each assigned featured-image path exists and there is no duplicate inline image markup. Actual site rendering remains integration work.

## Exact variety CLI and section 5 manual review

Executed separately from the repository root:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-hi/704-taiwan-arc-first-application.md
[hi] sentences=50 mean=17.1 cv=0.456 short=0.1 run3=0.0 opener_rep=0.0 cite_end=0.0 cite_para=0.312 contrast=0 caveat=0 q=1
WARN 66% of sentences end in 'है' — vary endings within the register
exit 0

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-hi/705-taiwan-visa-residence-work-study-family.md
[hi] sentences=61 mean=19.3 cv=0.467 short=0.098 run3=0.034 opener_rep=0.0 cite_end=0.0 cite_para=0.421 contrast=0 caveat=0 q=2
OK — no variety limit violated
exit 0

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-hi/706-taiwan-arc-renewal-changes-reentry.md
[hi] sentences=69 mean=18.7 cv=0.493 short=0.087 run3=0.0 opener_rep=0.048 cite_end=0.029 cite_para=0.619 contrast=1 caveat=0 q=1
WARN 51% of sentences end in 'है' — vary endings within the register
exit 0
```

1. All three genuinely measured; FAIL 0, no skipped-input result.
2. Opening types vary: affirmative deadline (704), route-choice question (705), changed-basis consequence (706). No fictional stock opener.
3. Each has more than two short sentences. Short definitions, jurisdiction/authority facts and concrete document actions carry useful information. Long legal-condition sentences were not turned into slogans. No material chain of empty short filler warrants a MONOTONY finding.
4. Paragraph starts were read vertically. Neither the text nor the measured repetition result shows a repeated opener driving the structure.
5. No three-paragraph claim/citation/caveat formula. Practical record/action paragraphs without statutory citation occur alongside sourced legal rules. Citations occur within and at the front of sentences, not only as repeated terminal brackets.
6. Remaining negative clauses concern actual eligibility limits, fees, permissions or record effects. They are not repeated rebuttals of invented reader claims. Measured contrast counts: 0/0/1.
7. Each substantive ending uses the article's own documents or dates. Dated scope notices and source lists are structural tails. No copied sales ending or consultation promotion.
8. Consistent professional Hindi, with ordinary loan terms where needed. No bold, invented experience, public author attribution or imperative checklist headings. Hindi auxiliary endings were judged grammatically, not penalized automatically.
9. Source/numeric preservation passes. The Article 7 duty and Article 16(2) sponsor condition are explicit after the verified substantive author repairs. Accuracy took priority over rhythm metrics.

## Evidence limits and next step

The complete source-refresh report supplied the wider current-law ledger. I independently reopened the current official residence regulations, NIA 0915 and professionals Act Article 16 for the specific duty/departure/sponsor questions; I did not duplicate the researcher's full 22-proposition live-law audit. Final legal review remains independent. I did not test a real applicant, an authenticated portal, mobile layout or production deployment. The author corrected 706:46 and 705's family passage/FAQ, updated its author record, and I completed the targeted re-reviews and final hash/CLI verification. These three exact hashes can proceed to the independent final reviewer. No further locale repair is requested.
