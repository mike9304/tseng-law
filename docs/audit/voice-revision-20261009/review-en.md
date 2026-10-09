# Independent English editorial review — voice revision

## Current PASS binding — October 10, 2026 metadata-only check

Actual date of this independent metadata check: October 10, 2026, Asia/Taipei. Both current staged files were read as bytes and hashed independently. Reversing exactly the single `lastmod: "2026-10-10"` value to `lastmod: "2026-10-09"` reproduces the corresponding sealed PASS hash below. Every other byte, including the body, title, summary, publication date and source-check date, is therefore unchanged. The current hashes agree with `work/voice-revision/date-equivalence.json`; that record was corroborated against the actual files, not merely accepted as evidence.

| Article under `work/voice-revision/staged/` | Current SHA-256 | Previous sealed PASS SHA-256 | Decision |
|---|---|---|---|
| `src/content/columns-en/493-us-ai-chip-taiwan-packaging-capacity-prepayment-refund.md` | `8388b33dc7bb92ac4f89b37af3f983503bae58f7b93da0e4dadb67fa84928bf7` | `68a64ce724f1613a83b1b3fa438e4b816926fb57672e8a3ef4a2f0dd80ad44ef` | PASS — exact date-only equivalence |
| `src/content/columns-en/494-us-buyer-taiwan-ai-chip-startup-investment-approval-closing.md` | `0a0dc7574349d6ae543a3059628f9555e1779e50e073fb26ef7ec286fc60c6a0` | `b2074d4657f300a9e53d18032ea7381a0464eea2c8ff9aa282f2949a792dbda6` | PASS — exact date-only equivalence |

The prior editorial judgment below binds to these current versions through the verified byte equivalence. No manuscript edit or repeated prose/legal review was performed in this metadata-only check. Publication and the separately owned final legal gate are not certified by this addendum.

Reviewer: `/root/voice_editorial_lead/reviewer_en`, manually loaded `tseng-editor-en-us` review role. This reviewer did not author either manuscript and did not edit the manuscripts. Review performed October 9, 2026. This is an AI editorial review, not human-native or attorney certification.

Read in full: shared editorial skill, review criteria, repository `docs/columns/EDITORIAL-VOICE.md`, both original articles, both staged revisions, and the three same-locale comparators below. The older publication PASS is not treated as proof that the prose satisfies the user's present criticism.

## October 9 decision: PASS after one bounded repair

| Article under `work/voice-revision/staged/` | Final SHA-256 independently read back | Decision |
|---|---|---|
| `src/content/columns-en/493-us-ai-chip-taiwan-packaging-capacity-prepayment-refund.md` | `68a64ce724f1613a83b1b3fa438e4b816926fb57672e8a3ef4a2f0dd80ad44ef` | PASS |
| `src/content/columns-en/494-us-buyer-taiwan-ai-chip-startup-investment-approval-closing.md` | `b2074d4657f300a9e53d18032ea7381a0464eea2c8ff9aa282f2949a792dbda6` | PASS |

The writer applied exactly the six deletions/trims requested below. I read the affected paragraphs, the remaining opening sentences, surrounding transitions, final analytical paragraphs and CTAs. Independently reinserting only those six removed spans reproduces each round 1 hash exactly; no other byte changed. The final external-URL multisets remain identical to the originals and both summaries remain 160 characters.

The two short second paragraphs now each make a separate legal point, rather than explaining their own relevance again. The unfair-terms paragraph ends at its actual limitation; the replacement-slot discussion ends on the claims the agreement must address. The ownership paragraph no longer repeats the same first-layer warning, and the merger section finishes with the real filing/approval distinction. These are connected explanatory articles with concrete commercial decisions, not a series of work instructions. No material editorial or meaning-preservation finding remains within this review's scope. The legal-review and publication gates remain separately owned.

## Round 1 record: REQUEST_CHANGES (all six findings resolved)

| Article under `work/voice-revision/staged/` | SHA-256 reviewed | Decision |
|---|---|---|
| `src/content/columns-en/493-us-ai-chip-taiwan-packaging-capacity-prepayment-refund.md` | `1c313c698baa577e8b5bba877b28c79dd84b5fdd0dcf0f18567467ba3d986ad4` | REQUEST_CHANGES — three redundant passages |
| `src/content/columns-en/494-us-buyer-taiwan-ai-chip-startup-investment-approval-closing.md` | `aa21cd8eb812478fe6d3150c9517bdc5bd4825f9062578bd94f2356ff4f144fa` | REQUEST_CHANGES — three redundant passages |

Both revisions now explain commercial consequences in connected prose. The old repeated instructions to identify, check, ask and negotiate no longer drive almost every paragraph. The remaining problem is explanatory padding: sentences say again what the preceding facts have already established. The six changes below are the bounded repair required; a broader rewrite is not requested.

## Specific findings and before/problem/after records

Line references in this section identify the round 1 hashes above.

| File:line | Exact sentence or span | Problem and reason | Proposed repair | Legal meaning preserved? |
|---|---|---|---|---|
| 493:18 | “A refund claim needs a contractual or legal basis beyond the buyer’s missed forecast.” | The paragraph already explains the limited capacity promise. The same refund qualification appears with the actual rescission rule at line 50; stating it here adds a preview rather than another fact. | Delete this sentence. Retain line 50's Article 259 explanation and qualification. | Yes. No refund right or legal condition is removed from the article. |
| 493:42 | “The wording and circumstances remain part of the assessment.” | The paragraph has just explained that Article 247-1 depends on specified terms being manifestly unfair in the circumstances. This abstract closing sentence repeats that condition. | Delete. End the paragraph with the concrete limit that not every fee or liability limit is invalid. | Yes. The statutory conditions and nonautomatic result remain. |
| 493:52 | “Otherwise, a solution to the production problem can leave the financial dispute unresolved.” | The preceding sentence already identifies exactly what the replacement schedule must settle. The generalized lesson weakens that concrete ending and sounds like a managerial summary. | Delete. End with whether the schedule settles earlier delay, the prepayment balance and accrued claims. | Yes. Every issue and the negotiated nature of the arrangement remain. |
| 494:18 | “The ownership of the acquisition vehicle therefore matters alongside the shares being bought in the Taiwan target.” | The first sentence already states why a US entity's ownership/control can put it in a different legal regime. This sentence adds no condition or consequence. | Delete. Keep the specific Mainland Area classification point. | Yes. Investor/target distinctions are developed precisely at lines 22 and 48. |
| 494:24 | “Those holdings are assessed under the Ministry’s [interpretation on indirect ownership](https://www.moea.gov.tw/Mns/dir_e/investment/wHandDirApply_File.ashx?file_id=372), rather than by assuming the first layer of the chart settles the classification.” | The first sentence has already explained why immediate shareholders are insufficient. The final contrast restates that explanation instead of advancing it. | End the sentence after the linked words “interpretation on indirect ownership.” | Yes. The official interpretation, upstream ownership inquiry and relevant percentages remain. |
| 494:50 | “Keeping both processes on the closing schedule avoids relying on one authority’s paperwork to answer the other authority’s question.” | The section opening separates the two regimes, and the immediately preceding sentence distinguishes filing from approval. A further scheduling moral repeats both. | Delete. The paragraph can end with the filing/approval distinction. | Yes. Notification assessment, FTC communications, waiting restrictions and separate investment approval all remain. |

These are three concrete before/problem/after observations for each article. They are stylistic deletions, not substantive legal corrections.

## First two paragraphs: sentence-by-sentence deletion test

### 493

1. “A Taiwan supplier’s promise to reserve packaging capacity can leave the shipment date for tested chips unsettled.” Retain. It supplies the exact difference between the purchased commitment and the buyer's needed outcome. Removing it would make the next sentence less concrete.
2. “A US AI-chip developer may be paying for a place in the production schedule while still negotiating the commitments on which its launch depends.” Retain. It connects the contractual distinction to payment timing and the launch dependency. It overlaps the first sentence but adds the buyer's financial exposure; it is not merely an announcement of the article.
3. “If the supplier has promised only to make capacity available, a missed launch date may say little about whether it has broken that promise.” Retain. This adds the breach question and its conditional limitation; those do not follow automatically from delivery being unsettled.
4. “A refund claim needs a contractual or legal basis beyond the buyer’s missed forecast.” Delete at this position. The supported, more precise version remains with Article 259 later in the text.

### 494

1. “Even a small stake in a private Taiwan AI-chip company can require a foreign-investment application before the investment proceeds.” Retain. It supplies the article's immediate transaction issue without a generic AI introduction.
2. The Ministry guidance sentence beginning “The Ministry of Economic Affairs’ official guidance applies that requirement regardless of the amount invested...” Retain. It provides the source and identifies the excluded listed/OTC/emerging-stock markets. Deletion would lose the scope condition.
3. “A company incorporated in the United States may fall within Taiwan’s separate regime for Mainland Area investors because of its ownership or control.” Retain. It introduces the second independent issue without assuming US incorporation decides the Taiwan classification.
4. “The ownership of the acquisition vehicle therefore matters alongside the shares being bought in the Taiwan target.” Delete. It repeats sentence 3, while the later precise test distinguishes the relevant relationships.

## Three recent same-language comparators

All are accessible complete local firm articles in `work/tseng-publication-20261008/src/content/columns-en/`. All were published October 8, 2026, immediately before the original October 9 batch. They are comparison evidence, not a quality standard to copy mechanically. No comparator is missing.

| Comparator and date | Specific evidence and comparison |
|---|---|
| `412-taiwan-short-sentence-fine-community-service-suspension.md` — 2026-10-08 | Opens with the actual judgment phrase 如易科罰金 and explains the execution prosecutor's role. Its last body paragraph identifies the completion record instead of summarizing all sections. Revised 493 similarly starts with the exact packaging promise; revised 494 starts with the application requirement. The proposed deletions let both end their analysis on actual records/conditions, instead of adding a lesson. This comparator still uses terse imperatives in procedural sections; those are not a template for commercial prose. |
| `411-taiwan-shoplifting-found-property-theft.md` — 2026-10-08 | Opens by distinguishing a store item from a found wallet. The next paragraph gives concrete evidence rather than an industry preamble. Its headings follow substantive questions (intent, found property, settlement, departure), and the ending explains what each document proves. 493's capacity/start/delivery distinction and 494's investor/target distinction have comparable concrete work to do. The old 493 question sequence and table were more like an intake checklist; the revision now explains why those inputs change the bargain. Neither revised article should copy 411's incidental rhetorical questions. |
| `410-taiwan-sexual-assault-report-adult-foreign-victim.md` — 2026-10-08 | The first sentence immediately answers whether medical care must wait for police investigation. The safety paragraph is short because it adds a separate urgent need; its omission would lose information. The ending gives safe service/contact arrangements instead of a generic recap. By that same test, 493's breach limitation deserves its short paragraph, while 494's second ownership sentence does not. The revised three-section commercial structures do not imitate the comparator's four-stage care/reporting sequence. |

## Tone, structure and meaning check

493 has a recognizable progression from what was purchased, through where the money goes, to when the buyer can leave the contract. Inputs such as dies, substrates and technical files appear because their lateness changes responsibility, rather than as unexplained list items. The title is a plain commercial question; it is not matched mechanically by the declarative 494 title. A table has been removed without losing the difference among access to capacity, a production start and tested output. Longer explanatory paragraphs alternate with short conditions. The final record paragraph remains dense but each document or changed term has an identified purpose.

494 follows the actual acquisition dependency: classify the buyer, obtain approval for the transaction being completed, then address a separate merger-control timetable. It is appropriately more formal than 493 because it explains classifications and statutory tests. Terms such as “acquisition vehicle,” “cap table” and “outside date” fit the specified US deal audience. It does not pretend Taiwan law is US law. The final paragraph's unnecessary scheduling moral is the clearest remaining manual-like ending; removing it leaves the specific filing/waiting distinction as the conclusion.

Both summaries are 160 characters. The revision retains every external URL with the same multiplicity as the original. Internal `author: legal-ai-assistant`, publication/review dates, factual scope, source notices and disclaimer remain. No decorative bold, public AI attribution or invented human byline appears. Neither article invents clients, negotiations actually handled, wins, licensure or personal experience. Contact is limited to a transaction outline, with confidential document transfer arranged separately.

Meaning preservation checked against the complete originals: 493 keeps Taiwan governing law conditional, contract terms distinct from automatic rights, default Article 250 treatment subject to agreement, Article 252 discretion, Article 247-1's conditional unfair-term rule, Article 230 responsibility, reasonable demand under Article 254, the narrow Article 255 exception, and Article 259's contrary-law/agreement qualification. 494 keeps strictly more than 30% OR control, exactly 30% exclusion only from the ownership limb, indirect ownership/control sources, joint transfer application, private-company scope, agency routing, at least one third for merger definition, separate notification triggers/exemptions, and waiting restrictions without a guaranteed closing date. No amount, deadline, percentage or source date was altered.

## Bounded live-source check and evidence limits

Reopened the official current [Civil Code Article 250](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=250), [Foreign Nationals Investment Act Article 8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0040002&flno=8) and [Mainland-investor rules Article 3](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=Q0040015&flno=3). These support, respectively, the agreement-dependent default damages rule, application/decision-period starting point, and alternative greater-than-30%/control tests retained in the revision. The Civil Code page's pending-effect notice concerns other provisions, not Article 250. This narrow check does not certify all statutes afresh; the separate final legal reviewer owns broader legal validation. No substantive correction is proposed here.

No public revision or deployment has been verified by this reviewer. These decisions concern only the hash-bound staged manuscripts, not the site's current rendered text.

Round 1 next step was the six bounded deletions/trims. That step and the independent readback are now complete. Remaining next step: the final reviewer checks the current PASS hashes alongside the legal evidence. No additional prose repair is requested.
