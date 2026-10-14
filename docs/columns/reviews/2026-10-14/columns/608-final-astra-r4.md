# C3 final review — Astra, round 4

Verdict: FIX. The English opening overstates what the cited statute says about price evidence (R4-L1). All four versions also retain a substantial native-prose problem (R4-V1), despite changed paragraph order and passing automated checks. A Japanese citation antecedent needs repair (R4-C1). Image: OK. These files are not approved for publication as is.

Reviewed on 2026-10-14. Slug: `taiwan-false-financial-report-investor-civil-damages`. This fourth review was expressly requested; the older batch limit was not used to refuse the review. No draft, fact sheet, source extract, or image was edited.

## Scope checked

Read fully: `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C3.md`, all four `drafts/C3/{ko,ja,en,zh-hant}.md` files including frontmatter and FAQs, `drafts/C3/facts.md`, and `research/C3-statutes.md`. Read the sentence-variety rule including sections 5–6 and all 25 recurring-error summaries in `LESSONS.md`.

Also opened the earlier lane's `COLUMN-VOICE-RULE.md` and read the full repository `docs/columns/EDITORIAL-VOICE.md` at `/Users/son7/Projects/tseng-law-columns-20261014/`. `/Users/son7/agent-library/knowledge/editorial-voice.md` is absent; the supplied full brief and repository copy provided the rules. This absence was not treated as a waiver. The previous review and fix notes were consulted after independently reading the current drafts and running checks.

Independently fetched with curl, received HTTP 200, and read the relevant official text:

- Securities and Exchange Act [Article 3](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0400001&flno=3), [Article 14-5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0400001&flno=14-5), [Article 20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0400001&flno=20), [Article 20-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0400001&flno=20-1), and [Article 36](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0400001&flno=36).
- [Chinese full text and amendment header](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=G0400001) and [official English full text](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=G0400001), including the relevant articles and Article 183's commencement provisions.
- [Company Act Article 8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=8), as a reviewer cross-check of the discussion of responsible persons, not an additional source claimed by the drafts.

Article 20-1 and Company Act Article 8 were also opened through the web tool. No judgment is cited in any version, so no judgment-text file or holding was applicable. There are no actual issuer filings, foreign-law claims, monetary examples, or damages calculations to verify.

Evidence is saved in `reviews/C3/source-check-astra-r4/`: fresh HTML/text downloads, fetch results, exact reviewed drafts, hashes, lint and variety outputs, metadata/link checks, and voice-comparison excerpts. Viewed `images/C3.webp` with the image viewing tool.

## 1. Law and facts

The following statutory core was checked separately in KO, JA, EN and ZH-Hant, including each FAQ:

| Subject | Result in all four, subject to issues below |
|---|---|
| Article 20(1), (3) | The prohibited conduct covers offering, issuance, private placement and trading; the compensation provision names good-faith acquirers and sellers. |
| Article 20(2), Article 20-1(1) | The report/document prohibition is distinguished from the civil claim; essential-content falsity/concealment, good faith, causally resulting loss, and holders are retained. |
| Defendants and employee signatures | Issuer/responsible persons and signing or sealing employees are separated. Signature OR seal is preserved. |
| Article 20-1(2) | Both due care and justified reasonable belief are required for the defense; the issuer is excluded. |
| Article 20-1(3)–(6) | CPA attestation, misconduct or professional-duty breach/neglect, causation, court-mediated working-paper access, non-refusal, negligent non-issuer proportional liability, and incorporation of the broker rule are retained. |
| Article 36(1) | Annual three-month and quarterly 45-day defaults, fiscal-period starting points, special-circumstances exception, signatures/seals, and annual audit/attestation versus quarterly review are stated consistently. |
| Article 14-5 | Paragraph 4 supports the supervisor-recognition exception. Paragraph 1(10) supports the limited reference to audited second-quarter reports. The drafts do not claim to identify all reports in that category or give the complete committee/board voting procedure. |

The annual financial report is not confused with the separate shareholders' annual report. The examples identify the purchase as the day after disclosure and continued holding until the issuer's later disclosure of falsity. Every example is expressly fictional. Neither the example's dates nor mere price decline establish all the claim requirements. The EN opening, however, goes materially beyond that last proposition.

The official amendment header is 2024-08-07 / 民國113年08月07日. All four identify it as the Act's latest amendment, not the amendment or effective date of each individual provision. No unsupported commencement date is asserted. The checking date is 2026-10-14. Article 3 supports the FSC identification.

EN's description of covered reports as “filed or publicly disclosed” follows the official English Article 20-1 text. Its description of the Article 36 filing duty uses announcement AND filing. This is not an AND/OR defect.

The responsible-person passages do not supply a Company Act definition. Read narrowly, they warn against treating every officer label or report signature as enough; they do not establish that a legally appointed director falls outside the category. Company Act Article 8 should prevent any revision from turning that warning into a categorical denial of director status. No new requirement to add a full corporate-status discussion is imposed here.

### R4-L1 — MAJOR, EN: an insufficiency warning has become a prohibition on using evidence

Original → `en.md:26`: “A buyer who still holds the shares cannot use the price decline for either one.” “Either one” refers to the statutory elements and the amount in the preceding sentence.

→ Problem & reason: Article 20-1 specifies the claim's conditions; it does not say a holder cannot use price-change evidence to help establish resulting loss or its amount. The topic brief says a price fall alone is not proof. The current sentence excludes use of that evidence altogether, without an official source for that exclusion. This is also stronger than the EN FAQ's “by itself” and the KO opening's “주가 하락만으로.” The first sentence should likewise distinguish failure to establish every element from an announcement having no evidentiary relevance.

→ Fix (required, not applied): Restore the limited proposition, for example: “A price decline alone does not establish every element of the claim or the recoverable amount.” Keep a clear holder reference and the adjacent Article 20-1 citation. Rework the preceding sentence so it does not categorically dismiss the issuer's admission of falsity. Review the compressed summary “Price is not proof” for the same qualification while preserving its 150–160-character limit. Do not add an unverified damages formula or a new claim about admissibility.

→ Facts preserved: Good faith, essential-content falsity/concealment, causation, holder eligibility and the need to establish recoverable loss remain. Restoring the qualification changes the present overstatement of legal meaning, so it was not treated as an authorized reviewer typo edit.

## 2. Citations

All five single-article URLs resolve to the correct articles. Each version's six distinct official URLs are present in its sources section; none is missing. All source sections carry the localized 2026-10-14 check date. Integrated article-as-subject links generally support the connected explanation without needing the same URL after every short sentence.

Each language has one internal link to its own `selling-shares-taiwan-company-securities-transaction-tax-agreements` column. Lint verified existence, and the four `342-...md` repository files were independently located. None links to another language or this batch. The tax sentence is navigation, not an attempt to calculate damages using tax rules.

### R4-C1 — Required citation repair, JA: the annual-filing paragraph changes articles before “同項”

Original → `ja.md:52`: after citing Article 20-1 paragraph 1 for good faith and loss, the paragraph continues: “この法律により有価証券を発行した会社は、事情が特殊で主管機関が別に定めた場合を除き、同項各号に従って公告し、主管機関へ申告しなければなりません。”

→ Problem & reason: The immediately preceding paragraph number is Article 20-1(1), whose subparagraphs identify defendants. The filing duties and three-month period belong to Article 36(1), cited much earlier in this long paragraph. The reader must guess that “同項” jumps back over the intervening Article 20-1 citation.

→ Fix (required, not applied): Start the reporting-duty sentence with an explicit linked “第36条第1項” or put the report-formality explanation in its own clearly attributed paragraph. Keep the special-circumstances exception, three-month period, three signatories, audit/attestation and approval requirements.

→ Facts preserved: The reporting rules themselves match Article 36. This repair changes citation placement/identification, which the reviewer was not authorized to change directly.

## 3. Batch rules and metadata

All four have the exact applicable frontmatter keys, matching H1/title, three FAQs, correct locale/category/topic, `author: "legal-ai-assistant"`, 2026-10-14 dates, and literal NNN featured-image path. EN title: 62 characters; SEO title: 35; summary: 156. The SEO title is required because the full title plus site suffix exceeds 60. The summary has no forbidden characters. Reading-time estimates are plausible.

No private-party name, bold formatting, telephone/hotline, street address, messaging ID, lawyer/native-review claim, attorney byline, fabricated professional experience, result guarantee, criminal-law discussion, or trading recommendation was found. Each version uses one short firm/email paragraph near the end. The FAQs preserve the core statutory conditions. No foreign-law note needs a source.

Article 36 remains a disproportionately long detour in a report-based civil-claim column, especially at the start of ZH. This is an editorial focus problem, not a finding that its deadlines are wrong. Do not expand it into a reporting calendar. When repairing the prose, retain the distinction between audit/attestation and review and every retained legal qualification.

## 4. Native prose and sentence variety

### R4-V1 — MAJOR editorial issue, all four: recurring drafting-note constructions and redundant restatement

The revised versions now have different broad orders: JA starts with signatures and defendants, ZH with report formalities, and KO/EN with the holder's position. That improvement is recognized. The remaining objection is not that every language must have an entirely different legal outline. It is that numerous sentences still describe where words sit in an article, use mismatched subjects and predicates, or repeat the immediately preceding proposition. These are visible native-prose defects under hard rule 6, not a numerical AI-detection score. The following are concrete repair targets within that one editorial issue.

#### KO

Original → `ko.md:26`, “보는 곳은 … 제1항의 주요 내용의 허위·은닉, 선의, 그로 인한 손해입니다”; `:56`, “누구에게 물을지는 … 제1항의 두 호입니다”; `:66`, “회계사가 배상하는 경우는 회계사를 주어로 한 … 제3항이 정합니다.”

→ Problem & reason: A “place to look” is equated with legal elements, “whom to ask” with two subparagraphs, and the reader is told which grammatical subject the statute uses. This is compressed drafting commentary rather than fluent Korean explanation of the claimant, defendant and conduct.

→ Fix (required, not applied): State the elements directly, introduce the two defendant groups with a natural predicate, and explain when an attesting CPA is liable without “회계사를 주어로 한.” For example, “제20조의1 제1항은 배상 책임을 질 수 있는 사람을 두 부류로 나눕니다” is a natural structural transition. Preserve the qualifications in the following sentences.

→ Facts preserved: The two defendant groups, separate CPA provision, relevant article numbers, essential-content requirement, good faith and resulting loss must remain.

Original → `ko.md:50`, “신고하거나 공고한 서류의 내용은 같은 조 제2항이 금지합니다.”

→ Problem & reason: Grammatically, this says the document's contents are prohibited. The next sentence supplies the intended object, falsity or concealment, but the opening is malformed and repeats that next sentence's function.

→ Fix (required, not applied): Combine the linked introduction with the actual prohibition on falsity/concealment in the issuer's specified documents. Keep the distinction between Article 20(2)'s prohibition and Article 20-1's compensation rule.

→ Facts preserved: The document classes, issuer, filing/disclosure condition, prohibition and source all remain; do not delete the operative condition to shorten the paragraph.

#### JA

Original → `ja.md:32`, “賠償する側の第1号は”; `:36`, “三人の役名は署名欄の話です”; `:40`, “会計士を主語にした…第3項の場合です”; `:62`, “届け出または公告された書類の中身は、…第2項です.”

→ Problem & reason: People and document contents are equated with numbered provisions; “役名” and discussion of the statute's grammatical subject sound like translated editing notes. The CPA paragraph then restates its positive test in a lengthy negative sentence. Maintaining です・ます alone does not make these constructions natural.

→ Fix (required, not applied): Name the responsible actors and explain what the cited paragraph requires. A transition such as “第1項第1号は、発行人とその負責人を賠償責任の対象としています” preserves the legal role of the provision. Integrate the signing requirement and the separate responsible-person classification instead of repeatedly returning to “the signature-column story.” Keep the CPA's attestation, conduct and causation requirements together.

→ Facts preserved: Responsible-person status must not become automatic liability; signature OR seal and the distinction between employee and responsible-person status remain. Preserve all CPA conditions and citations.

Original → `ja.md:52`, “どの報告をいつまで持っていたか.”

→ Problem & reason: The example concerns holding shares, not holding a report. The inserted sentence also separates the Article 36 introduction from its actual reporting requirements.

→ Fix (required, not applied): Say which financial report is at issue and during which period the investor held the shares, with those two objects clearly separated; repair the citation antecedent as R4-C1 requires.

→ Facts preserved: The annual-report identity, next-day purchase, later disclosure and continued shareholding remain. No new reliance fact or transaction date is needed.

#### EN

Original → `en.md:26`, “is where a holder claims for false or concealed essential content, good faith, and the resulting loss”; `:34`, “a sale is a seller's claim”; `:48`, “is the actor in Article 20-1, paragraph 3.”

→ Problem & reason: A claimant claims compensation, not “good faith”; a sale is not a claim; “the actor in” describes the draft's grammar rather than the legal rule. These are substantive readability problems in the central explanation, not merely a preference for synonyms.

→ Fix (required, not applied): Explain the holder's claim and its conditions with a subject and verb; distinguish a person selling from the existence of a compensable claim; state the CPA test directly. In the CPA paragraph, consolidate the repeated positive/negative formulations while keeping attestation, misconduct OR professional-duty violation/neglect, and causally resulting loss. Repair the separate evidentiary overstatement under R4-L1.

→ Facts preserved: Do not imply that every seller necessarily has a successful claim, that attestation alone is enough, or that a non-attesting CPA falls within this particular paragraph. Keep the official links and qualifications.

#### ZH-Hant

Original → `zh-hant.md:30`, “季度報告在這裡只用來分開會計師的程序” and “這兩條沒有說完”; `:52`, “可能要賠償的人，…第1項分成兩款”; `:62`, “看…第3項裡他做了什麼.”

→ Problem & reason: “分開會計師的程序” is not a natural account of distinguishing review from audit/attestation; “沒有說完” sounds as though the legislation is an unfinished narration; the defendant and CPA introductions retain a drafting-note perspective. The answer to “公告隔天買進，就是善意嗎？” at line 38 also jumps directly back to price movement instead of first answering what the purchase date establishes. The legal content can be understood, but the presentation is not publication-ready native explanatory prose.

→ Fix (required, not applied): Explain the procedure distinction directly, describe the limited scope of the two provisions plainly, and name the people to whom each liability rule applies. For the question, say that the purchase date alone does not establish good faith, then connect any price discussion to resulting loss. Consolidate the repeated employee-signature statements at line 56 without losing the OR condition or the exclusion of mere preparation/name printing.

→ Facts preserved: Keep 核閱 distinct from 查核簽證, retain the uncertainty about the audited second-quarter category, and preserve the report scope, employee condition, CPA test, good faith, causation and all sources. No mainland terminology or simplified-character defect was found.

### First-two-paragraph deletion test and comparison

- KO: the opening contains useful holder/Article 20 distinctions, but “보는 곳은” needs direct phrasing. The next prose paragraph supplies residence, broker, purchase timing, holding period and the fictional label; these are not filler to delete.
- JA: the first two sentences repeat the signatories, though the second adds the quarterly scope and citation. They can be combined while preserving both. The next paragraph supplies the claim elements and claimant distinction. Its “第1項で見ます” needs a natural predicate, not deletion of the elements.
- EN: the opening's second sentence is the legal overstatement in R4-L1, not a harmless short sentence inserted for rhythm. The next paragraph supplies the fictional scenario and chronology. Its label and chronology must remain.
- ZH: the first paragraph supplies the annual formalities; the second gives the audit-committee exception. The second paragraph states that exception twice. Integrate the citation into a single explanation while retaining the exact exception. Leading with three filing-procedure paragraphs delays the civil-claim question.

Compared the openings, subheads and endings of the repository's three most recent pre-batch dated columns in each language (524, 523, 522; all dated 2026-10-13), and the available C1–C6 openings. Excerpts and file identities are in `voice-comparison.json`. No copied closing disclaimer or recycled prior-column subheading was found. C3 does not use a stock hypothetical first sentence. Broad opening categories can overlap (notably EN C2/C3 both caution against treating one fact as sufficient); that alone is not used as a blocking finding here. Publication order within the same date was not independently established; the comparison uses date then file number.

### Sentence-variety checks and manual self-check

Fresh commands, for each language:

```text
python3 /Users/son7/tseng-col-1014-work/lint.py /Users/son7/tseng-col-1014-work/drafts/C3/<lang>.md <lang> taiwan-false-financial-report-investor-civil-damages
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1014-work/drafts/C3/<lang>.md
```

| Language | Lint | Body length | Variety exit / FAILs | CV | Very short sentences |
|---|---|---:|---|---:|---:|
| KO | OK | 2,819 characters | 0 / 0 | 0.489 | 7 of 75 |
| JA | OK | 3,026 characters | 0 / 0 | 0.473 | 9 of 74 |
| EN | OK | 1,189 words | 0 / 0 | 0.466 | 12 of 75 |
| ZH-Hant | OK | 2,034 characters | 0 / 0 | 0.529 | 9 of 69 |

KO and JA each have a 96% register-ending WARN. It is not a FAIL and is not a reason to introduce register mixing. KO uses 합니다체 and JA uses です・ます. All four have at least two very short sentences, a citation-free fictional-scene paragraph, no clearly established threefold repetition of a paragraph's first word, and a factual closing tied to the example. The contrast-template limit is not exceeded; the questions concern plausible reader misunderstandings. No fact, number, citation or hypothetical label was removed because no draft edits were made.

There is one manual rhythm concern in all four: the consecutive responsible-person, employee and signatory paragraphs each state a rule, cite an article, then close with a negative limitation. This is recorded under section 5 item 5. Their genuine legal distinctions must survive consolidation:

- MONOTONY: §5.5, KO — “발행인인지, 책임자인지는 이 보고서에 서명이 있는지로 정하지 않습니다” / “둘 다 없는 직원은 제2호 밖입니다” / “서명했다는 사정만으로 회계주관이 책임자가 되지는 않습니다” — integrate the three connected status/signature explanations so consecutive paragraphs do not repeat rule–citation–limitation.
- MONOTONY: §5.5, JA — “この報告に署名があるかどうかとは別に見ます” / “名前が印刷されているだけでは足りません” / “署名しただけでは、会計主管が負責人であることは確定しません” — combine the overlapping signature discussion and retain each distinct limitation.
- MONOTONY: §5.5, EN — “A signature on this report does not establish issuer or responsible-person status” / “A printed name is not enough” / “A signature does not, by itself, establish the accounting officer as a responsible person” — make the relation between status and signature clear once, retaining the employee requirement.
- MONOTONY: §5.5, ZH — “不因這份報告上有沒有他的簽名而確定” / “光印著名字，不算” / “會計主管簽了名，不會因此成為負責人” — consolidate the repeated contrast between legal status and signing while preserving both defendant categories.

One clear unmet manual item per language does not by itself trigger the stipulated two-item automatic monotony rejection. No automatic FAIL is claimed. R4-V1 is the separate native-prose hard-rule failure, supported by the specific malformed/translated constructions above; R4-L1 independently prevents PASS.

## 5. Minor edits applied and image

Minor edits applied: none. All four draft hashes remain identical to the reviewed snapshots. The scale of R4-V1 exceeds isolated typo polishing, and legal/citation changes were reserved for the writer as instructed.

Image verdict: OK. The viewed 1280×720 image depicts an anonymous glass office setting with a closed blue folder. No person or face, text, logo, flag, readable document, or identifiable party is visible. The business/report association fits the column and is respectful. It does not present a particular issuer or actual dispute as the pictured subject.

VERDICT: FIX
