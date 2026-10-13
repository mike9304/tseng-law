# Independent Taiwan Traditional Chinese review — A-209 / A-210

Review date: 2026-10-11 (Asia/Taipei). Reviewer: independent AI Taiwan Traditional Chinese editorial role; not the author of either article. This is not a certification by a human native speaker or licensed practitioner.

Scope: the two assigned manuscripts, their frontmatter and linked statutory propositions, the opening deletion test, comparison with 502–504, and representative-image/alt/caption consistency. Only this audit file is owned by the reviewer; no manuscript, registry, shared configuration, canonical checkout, commit or deployment was changed.

## Decision and exact versions

| Result | Article | SHA-256 of bytes reviewed |
|---|---|---|
| PASS | `src/content/columns-zh/520-fraud-induced-contract-rescission-one-year-taiwan.md` | `afaa394d8b1fe8fad568d7fc9e53c2d94e263e47fe43a707b7ddef50bdc68b24` |
| PASS after one bounded wording repair | `src/content/columns-zh/521-rented-home-sale-lease-continuation-taiwan.md` | `bf9ce16a8b43d377b732ebe1af73e882b0fa22c13350c2543c8cfe214309084a` |

The first prose read occurred while the author was finishing edits. A subsequent single-read byte/hash capture was used for this report. Two repetitive opening sentences observed before the freeze had already been removed by the author; they are not outstanding findings or reviewer-authored repairs.

Required materials read in full: `/Users/son7/tseng-air-1011/RULES.md`, `AGENTS.md`, `docs/columns/EDITORIAL-VOICE.md`, `docs/columns/FRONTMATTER.md`, the `tseng-law-editorial` skill and its `references/review-criteria.md`. The current user/lane rule requires a separate Claude Code shipping review; this locale result does not authorize publication.

The completed author source/revision record at `/Users/son7/tseng-air-1011/lanes/columns/work/A-209-210.md` was also read. Its self-check is kept distinct from this independent review. Final reread confirmed 520 was unchanged; reversing only the two reported replacements in final 521 reproduces its initial frozen SHA-256 `2920fa6a99adc8f51520560e943084442bf13a66df6ab5128fb917c31be759a3`. Both replacement passages and the related notarized-lease and mortgage paragraphs were rechecked against the official text.

## Findings — resolved in the final version

No unsupported case, invented judgment, fabricated consultation experience, foreign-law credential, guaranteed outcome or public AI-author footer was found. No substantive change to the articles' stated legal conclusions is requested.

| File:line | Exact sentence or minimum relevant span | Reason and evidence | Proposed rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| `521-rented-home-sale-lease-continuation-taiwan.md:5` | 「未經公證且超過五年或未定期限的租約有例外」 | In a standalone summary, `A且B或C` can be read as `(A AND B) OR C`, incorrectly extending the exclusion to notarized indefinite leases. [Civil Code 425(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=425) requires absence of notarization AND (a term exceeding five years OR an indefinite term). The body correctly states this, so the summary should make the shared qualifier explicit. | Applied and rechecked: 「未經公證的租約，若期限超過五年或未定期限，則有例外」 | Yes. Makes the intended joint condition unambiguous; does not change the legal position correctly stated at lines 22 and 34. Required wording repair, not a new substantive legal theory. |
| `521-rented-home-sale-lease-continuation-taiwan.md:34` | 「未公證的六年租約，或未定期限租約，則屬於該項排除的情形。」 | The first modifier can appear to attach only to the six-year example. The next sentence correctly says notarized indefinite leases are outside this exception, but the example should independently preserve the same grouping. Same official source. | Applied and rechecked: 「未公證的租約，若約定六年或未定期限，則屬於該項排除的情形。」 | Yes. Preserves the examples and both statutory conditions; resolves modifier scope. |

## First two paragraphs: sentence-by-sentence deletion test

Rendered sentence text is quoted below; Markdown links remain in the manuscript.

| Article and location | Sentence | What deletion loses / action |
|---|---|---|
| 520:19, paragraph 1, sentence 1 | 「因詐欺而簽約，撤銷的期間從發現詐欺起算，不是等刑事判決確定才開始。」 | Loses the distinction between civil discovery and a final criminal judgment. Retain; it directly answers a timing mistake and is not a title-only restatement. |
| 520:19, paragraph 1, sentence 2 | 「民法第93條規定，應在發現詐欺後一年內撤銷；自原意思表示後經過十年，即使發現受騙還不到一年，也不得撤銷。」 | Loses the numeric one-year period and independent ten-year outer limit with their different starting events. Retain. |
| 520:21, paragraph 2, sentence 1 | 「民法第116條要求撤銷以意思表示為之，相對人確定時，應向該相對人作成。」 | Loses the legal mechanism and intended recipient. Retain. |
| 520:21, paragraph 2, sentence 2 | 「向警方敘述經過，不能直接代替這項通知，也不能只因報案就把撤銷期間當成已停止。」 | Loses the practical difference between police reporting, civil notice and the running period. Retain. |
| 521:20, paragraph 1, sentence 1 | 「房東已交付房屋，房客仍在占有中，房東才將所有權移轉給買方，依民法第425條第1項，原租約原則上對新屋主繼續存在。」 | Loses the central consequence and the delivery/continued-possession/ownership-transfer sequence. Retain. |
| 521:20, paragraph 1, sentence 2 | 「只有簽約在先，尚未受領房屋，不能直接套用這項規定。」 | Loses the concrete distinction between signing a lease and receiving the premises. Retain. |
| 521:22, paragraph 2, sentence 1 | 「同條第2項規定，未經公證的不動產租約，期限超過五年或未定期限時，不適用前項。」 | Loses the non-notarization condition and both alternative term conditions. Retain; this sentence groups them correctly. |

The frozen openings have no additional detachable announcement such as 「本文將帶您了解」. In the pre-freeze text, 「報案不等於已向契約相對人行使撤銷權。」 and 「這項原則有公證與租期的例外。」 duplicated immediately following information. Their already-completed removal preserved all legal conditions. The author also replaced 521's repeated explanatory sentence and removed its opening recap; the operative rule and exception remain explicit above.

## Three recent same-locale comparisons

All three repository articles have `published: 2026-10-10`; `git log` associates them with `63efbfd9` (2026-10-10, twelve market-specific articles). This is a current worktree/source comparison, not a claim of new public-URL readback. Full texts were read.

| Comparator | Concrete comparison with 520 | Concrete comparison with 521 |
|---|---|---|
| `src/content/columns-zh/502-limited-company-shareholder-exit-transfer-taiwan.md` — 2026-10-10 | 502 opens with the shareholder's planned exit, price, consent and personal guarantee, then a hypothetical short exit agreement. 520 begins immediately with two statutory clocks and recipient requirements; it does not copy that two-stage transaction setup. 502 ends with a linked consultation invitation; 520 ends with notice effect and defined procedural exclusions, without promotional copy. | 502's headings follow agreement, payment, registration and guarantee release. 521 instead separates date evidence, the exact five-year boundary, and mortgage enforcement. Both distinguish relationships that readers could confuse, but 521 does not repeat 502's list of commercial deliverables or consultation ending. |
| `src/content/columns-zh/503-parent-capacity-guardianship-assistance-authority-taiwan.md` — 2026-10-10 | 503 opens by separating possession of a parent's seal/passbook from legal authority, then distinguishes ability from a diagnosis. 520 similarly corrects a specific mistaken inference (reporting does not replace notice) but uses different facts and organization: discovery evidence, third-party fraud and notice arrival. It does not imitate the guardianship/assistance/advance-guardianship sequence. | 503 distinguishes an authorization's existence and scope and then multiple court measures. 521's single controlling sale/lease rule is followed by its own exception and separate mortgage rule. Its ending concerns the actual move-out demand and documents rather than 503's request for family/medical information. |
| `src/content/columns-zh/504-ai-product-open-source-license-delivery-taiwan.md` — 2026-10-10 | 504 opens with software, packages and external models and the missing delivery documents, then assigns delivery responsibilities. It includes a comparison table and the named Apache 2.0 example. 520 uses continuous prose, no standard checklist/table or business analogy, and no invented real case. The short notification heading is specific to civil notice. | 504's headings proceed through version matching, Apache conditions, model weights and updates; its conclusion asks about the product and delivery method. 521 stays with landlord/tenant vocabulary, signed/received/transferred dates and actual court documents. Both have source/scope text, which is necessary provenance rather than copied promotional structure. |

## Legal and numerical alignment checked live

Every official link below was opened during this review on 2026-10-11. MOJ displayed a codification cutoff of 2026-10-02. Its Civil Code pending-commencement banner identifies Articles 166-1 and 1223; none of the seven provisions used here is among those pending provisions. This report does not treat the Code-wide banner as making the cited operative articles ineffective.

| Article | Official text and consequential point checked | Result |
|---|---|---|
| 520 | [Civil Code 93](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=93): discovery of fraud starts the one-year period; the declaration starts the separate ten-year ceiling. | Both triggers and periods are preserved. The text does not substitute judgment, report or mailing date. |
| 520 | [Civil Code 116](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=116): revocation by declaration, directed to the determined other party. | Correctly distinguishes notice to that party from reporting facts to police. It does not claim a mandatory notarial or registered-mail form. |
| 520 | [Civil Code 92](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=92): third-party fraud requires the other party's knowledge or ability to know; revocation cannot oppose a good-faith third party. | Both different third-party rules remain separate. A salesperson/intermediary is not automatically classified as the statutory third party. Nonperformance is not treated as proof of formation-stage fraud. |
| 520 | [Civil Code 95(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=95): non-dialogue declaration takes effect on arrival, subject to earlier/simultaneous withdrawal notice. | Arrival and dispatch remain distinct. The withdrawal exception is retained; receipt of any intermediary's message is not declared sufficient. |
| 520 | [Civil Code 114(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=114): valid revocation has retrospective invalidity. | The short quotation matches. No claim that asserting fraud automatically secures a refund; restoration/compensation issues remain case-dependent. |
| 521 | [Civil Code 425(1)–(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=425) and [official reasons, 1999-04-21](https://mojlaw.moj.gov.tw/LawContentReason.aspx?LSID=fl001351&LawNo=425). | Delivery, tenant possession and subsequent ownership transfer are all stated. Exactly five years is distinguished from more than five. Absence of notarization is required for the long/indefinite-term exception; the two repaired passages now also express this grouping clearly. Lack of notarization is not treated as automatically invalidating the lease between original parties. |
| 521 | [Civil Code 866](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=866): mortgage predates the lease, enforcement is affected, and court may terminate the lease before auction. | The chronology, interference condition and court's `得` power are preserved. A mortgage or sale alone is not equated with automatic lease termination, and general sale rules are not offered as an answer to every auction. |

The practical evidence suggestions use `可以`, `可能`, `須判斷` or contextual wording rather than inventing legal filing requirements. The general nature of the information is stated. 520 expressly excludes court mediation and litigation settlements; 521 leaves deposits, rent recipient, special residential arrangements and individual auction procedures outside its short scope. There are no asserted judgments to verify.

## Locale, metadata, length and image checks

- The manuscripts use Taiwan legal vocabulary consistently: `契約`, `意思表示`, `相對人`, `撤銷` versus `撤回`, `公證`, `租賃`, `占有`, `抵押權` and `點交`. No Mainland-law institution, Simplified Chinese term or imported Korean/Japanese syntax was found.
- Titles identify the respective one-year starting event and lease continuation question. Headings identify actual distinctions rather than ordering the reader through a checklist. Paragraph lengths vary; there is no compulsory three-point list or repeated consultation template.
- Substantive body length at the final reviewed hashes: 520 = 1,037 non-whitespace characters; 521 = 973. Counts exclude frontmatter, Markdown heading lines, link destinations and the source/scope footer, and retain displayed link labels and punctuation. Both meet the assigned comparable 900–1,400-character short-body band.
- `audience: ["zh-hant"]`, internal `author: "legal-ai-assistant"`, dated source scope and AI-image disclosure are present. No bold marker or HTML substitute, fake human byline, address or unsupported firm-service promise appears.
- Both referenced WebP files were visually opened. The scenes are calm home/document editorial illustrations, with cropped faces, no identifiable person or visible brand, and indistinct paperwork rather than a presented real contract. Alt text describes the visible cards/papers, folder, keys, envelope and cups. Captions explicitly state generation and fictional document/case status. Image-generation provenance and any separate media shipment manifest remain the orchestrator's checks.

## Remaining work and limits

Neither article has an unresolved finding in this review scope. The bounded next step is for the orchestrator to use these exact versions in the separate final review and lane verification. This review did not run registry tests, build/render the site, verify all-corpus topic uniqueness, perform production readback or replace the independent final/legal and Claude Code shipping reviews. A subsequent manuscript change invalidates the matching hash-specific result until rechecked.
