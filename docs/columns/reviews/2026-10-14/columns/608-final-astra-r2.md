# C3 final review — Astra, round 2

Verdict: FIX. None of the four language files is ready for publication as submitted. The statutory core has improved since round 1, but the eligibility wording, identification of the financial document, remaining citation gaps, and native prose still require changes. Image: OK. All four lint runs returned OK; all four sentence-variety runs returned zero FAILs. Those checks do not resolve the substantive findings below.

Reviewed: 2026-10-14. Slug: `taiwan-false-financial-report-investor-civil-damages`.

## Scope checked and evidence

Read in full: `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C3.md`, `drafts/C3/ko.md`, `ja.md`, `en.md`, `zh-hant.md`, `facts.md`, and `research/C3-statutes.md`. The review includes every title, summary, FAQ, body paragraph, contact paragraph and sources section. Read the shared `SENTENCE-VARIETY-RULE.md`, especially sections 5–6, and skimmed all 25 recurring-error entries in `LESSONS.md`. Also opened the earlier lane's `COLUMN-VOICE-RULE.md`, the shared rules copy of `EDITORIAL-VOICE.md`, and `/Users/son7/Projects/tseng-law-columns-20261014/docs/columns/EDITORIAL-VOICE.md` in full. The instructed `/Users/son7/agent-library/knowledge/editorial-voice.md` is absent; the supplied brief and repository copy supply the full applicable voice rules. The newer batch restrictions govern contact details and author presentation.

Independently downloaded and read these official pages with curl; all seven returned HTTP 200. The fact sheet was not accepted as proof:

- Securities and Exchange Act: [Article 3](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0400001&flno=3), [Article 14-5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0400001&flno=14-5), [Article 20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0400001&flno=20), [Article 20-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0400001&flno=20-1), and [Article 36](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0400001&flno=36).
- [Chinese full text and amendment header](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=G0400001) and [official English text](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=G0400001).

Articles 20-1 and 14-5 were additionally opened through the web tool. Fresh downloaded HTML, extracted text, HTTP results, lint output and variety metrics are in `reviews/C3/source-check-astra-r2/`. No judgment is cited in any language, so no judgment text or holding is applicable. No actual issuer, public filing, foreign-law proposition, damages calculation, or monetary example is presented for verification. The central example is expressly hypothetical in all four versions; the separate English opening has the problem identified below.

The workspace is not a Git repository. This review changed no column file; the reviewed hashes appear below. The earlier review and writer's fix notes were checked only after independently reading the columns and source material.

## 1. Law and facts

### R2-L1 — MAJOR, all four languages: the general test is narrowed to an incorrect number

Original, line 44:

- KO: “어느 숫자가 틀렸는지, 그 숫자가 주요 내용인지…”
- JA: “どの数字が誤っていたか、その数字が主要内容か…”
- EN: “The claimant still has to show which figure was wrong, whether it was essential content…”
- ZH: “哪個數字錯了、那個數字算不算主要內容…”

→ Problem & reason: This paragraph answers a general question about a person who has not sold the shares, before the expressly fictional revenue example. Its mandatory formulation makes an incorrect numerical figure part of the legal test. Article 20-1(1) concerns falsity or concealment in the document's essential content; it is not confined to erroneous numbers. A claim based on concealed essential information is not necessarily a claim that a reported figure is wrong. The later reference to “concealment” does not repair the initial numerical prerequisite.

→ Fix (required; not applied): Describe the allegedly false or concealed content and whether it is essential, retaining good faith and causally resulting loss. If discussing a revenue number, expressly limit that illustration to the hypothetical example instead of stating it as the general requirement. Attach the Article 20-1 link to that explanation.

→ Facts preserved: Falsity OR concealment; essential content; good-faith acquirer/seller/holder status; loss caused by that defect; price movement alone is insufficient. This correction must broaden the wording to the statute's actual scope, not remove an element.

### R2-L2 — MAJOR, EN and ZH: claimant status is confused with the conditions for compensation; EN summary also omits causal loss

Original, line 56:

- EN: “Becoming the bona fide holder in Article 20-1 still requires misrepresentation or concealment in the essential content of that annual report, and loss caused by it.”
- ZH: “依第20條之1成為善意持有人，還得該年報的主要內容有虛偽或隱匿，且因此受有損害。”

Original, EN summary, line 4: “A good-faith buyer, seller, or holder may claim civil damages if a Taiwan issuer's filed report misstates or hides essential content.”

→ Problem & reason: Falsity and resulting loss are conditions for liability to a qualifying claimant, not conditions for becoming a good-faith holder. A person can hold securities in good faith without any false report or loss. KO and JA correctly say that these elements are required to claim as a good-faith holder, so EN/ZH also diverge from those versions. Separately, the English summary states a sufficient-looking condition for damages without saying that the claimant suffered loss because of the defect. Its next sentence, “A price drop is not proof,” does not supply that missing causal-loss requirement. Article 20-1(1) expressly requires resulting loss.

→ Fix (required; not applied): Use “To claim damages as a bona fide holder…” / “善意持有人要依第20條之1請求賠償，還須…”, retaining all existing elements and the separate warning that next-day purchase does not establish good faith. Rewrite the 150–160-character English summary to include loss caused by the false or concealed essential content. Do not remove causation to meet the character limit.

→ Facts preserved: Good faith remains a separate claimant condition; the report defect and resulting loss remain compensation conditions; purchase timing alone does not prove good faith; the English summary must match the body and other languages.

### R2-L3 — MAJOR terminology issue, ZH: 年報 is used for 年度財務報告

Original: heading at line 46 “年報公告的隔天”; line 54 “和年報一樣…” and “年報要求的查核簽證…”; line 56 “該年報”; line 68 “在年報和季報上簽名或蓋章”. English likewise repeatedly shortens “annual financial report” to “annual report,” including its heading and first sentence.

→ Problem & reason: Article 36 itself distinguishes the annual financial report in paragraph 1(1), 年度財務報告, from the 年報 prepared for distribution at the regular shareholders' meeting in paragraph 4. Calling the former 年報 is particularly misleading in a Taiwanese legal column whose brief expressly requires exact identification of the document. The three-month filing, signatures and audit/attestation explanation concerns the paragraph 1 financial report. The law does not collapse the two documents. The English example initially identifies the correct document, but its repeated shorthand unnecessarily recreates the same ambiguity.

→ Fix (required; not applied): Use 年度財務報告, or a clearly defined 年度財報, for this example and the related obligations throughout ZH; use “annual financial report” consistently in EN where the document's identity matters. Do not transfer the filing requirements to the separate shareholders' annual report or expand this column into a discussion of that report.

→ Facts preserved: Article 36(1)(1), the annual financial report, the correct default deadline and exception, signatures/seals, audit/attestation and approval requirements, and the example's purchase/holding chronology.

### Statutory points confirmed, separately from the defects

The four versions correctly preserve Article 20(1)'s four transaction settings; paragraph 3's good-faith acquirer/seller claimant classes; paragraph 4's commission-agent deeming rule; and paragraph 2's prohibition concerning filed/announced financial and business documents. Article 20-1 covers holders as well as acquirers and sellers. Its defendant groups, employee signature OR seal, two cumulative non-issuer defense requirements, distinct CPA misconduct/duty/causation test, court-mediated access to working papers, negligence-based proportionate liability excluding the issuer, and paragraph 6 cross-reference are substantially stated correctly. No automatic liability of every officer or CPA is asserted.

The previous claim that a signature page determines every defendant's legal status has been removed. The tax sentence is now neutral navigation, not a damages-calculation rule. The special-circumstances exception now expressly accompanies both annual and quarterly deadlines. The three-month and 45-day defaults match Article 36(1). The audit-committee exception to supervisor recognition matches Article 14-5(4); the limited reference to audited second-quarter reports matches paragraph 1(10), without purporting to explain the entire approval procedure. These are not new unresolved findings.

The official amendment header is 2024-08-07 / 民國113年08月07日. The columns identify it as the Act's latest amendment, not the amendment or effective date of every cited provision. No separate effective date is asserted. The general check date is supplied. No arithmetic error is applicable.

The English “filed or publicly disclosed” description in Article 20-1's scope follows the official English text. Article 36 filing duties are separately expressed as announcement AND filing. I am not flagging the official English scope formulation as a translation error.

## 2. Citations

### R2-C1 — MAJOR hard-rule failure, all four languages: two legal explanations still lack the correct nearby source

Original → Line 44 links only Article 20(3), then states the report-based elements governed by Article 20-1. Line 54 gives the first/second/third-quarter deadline, signatories, CPA review and board reporting, but contains links only to Articles 20-1 and 14-5. It has no Article 36 link. The immediately preceding paragraph discusses Article 14-5(4), so “the same paragraph 1” / “同じ第1項” / “同一項” is also an unclear cross-reference.

→ Problem & reason: The link next to the legal explanation must support that explanation. Article 20(3) is not the report-based holder provision; neither Article 20-1 nor Article 14-5 sets the quarterly 45-day deadline. A sources list and a link two paragraphs earlier do not meet the requested claim-adjacent citation rule. This is a remaining part of the previous citation finding, not a claim that every legal paragraph is still unlinked.

→ Fix (required; not applied): Place an Article 20-1(1) citation immediately with the general report-claim elements, and identify/link Article 36(1)(2) directly with the quarterly requirements if that passage remains. Preserve the separate links for CPA liability and audit-committee matters. Integrated article-as-subject links are acceptable; another link is not needed after every short sentence in a tightly grouped explanation.

→ Facts preserved: Existing statutory numbers, default periods and exceptions, sign/seal alternatives, CPA review versus attestation, and all current official URLs. The repair must not conceal legal claims in an uncited “variety” paragraph.

All existing single-article URL targets match their labels. Each sources section lists all six official pages cited in that version and has the localized 2026-10-14 check date. Each version has exactly one valid same-language internal link, to repository column `342-selling-shares-taiwan-company-securities-transaction-tax-agreements.md`; existence was verified by lint and by finding the corresponding file in all four content directories. There are no judgment links or links to another column in this batch.

## 3. Rules, scope and frontmatter

### R2-R1 — Required, EN opening: the actor and fictional status are unclear

Original, line 26: “A published annual report later calls its own revenue figure false, and the buyer still holds the shares. Price is not enough. That drop proves neither the statutory elements nor the amount.”

→ Problem & reason: A previously published report does not later make a corrective announcement about itself. The actor should be the issuer or a later disclosure. The passage reads as an event involving a buyer, but has neither a local hypothetical label nor a conditional formulation. “That drop” has no stated price-drop antecedent. The invented-example label much later in the article does not clearly label this separate opening. This is not verified evidence of an actual filing.

→ Fix (required; not applied): State the legal point conditionally, with the correct actor and financial-report terminology, or explicitly mark this opening as fictional and supply the coherent chronology. Keep the price-alone limitation. Do not introduce an actual company or announcement.

→ Facts preserved: Reported revenue later alleged/shown false in a hypothetical setting; continuing ownership; price decline alone does not establish the claim or amount; no invented real-world event.

Frontmatter checks pass for all four languages: exact allowed fields, `author: "legal-ai-assistant"`, language-only audience, `topic: "litigation"`, correct categories, dates and date displays, three FAQs, title/H1 match, and literal NNN image paths. EN title is 62 characters; its 35-character SEO title is therefore required and valid. EN summary is 160 characters with no forbidden punctuation; its legal omission is R2-L2. Read-time labels are plausible.

No private-party names, bold, phone/hotline numbers, street addresses, messaging IDs, attorney byline, lawyer/native-review claims, invented professional experience, criminal-law discussion, investment recommendation or outcome guarantee were found. Each language has one short email-only firm contact paragraph near the end. The main fictional example's document, next-day purchase and continued holding period are identifiable. No foreign-law note needs verification. The article keeps tax discussion to the permitted internal link.

Scope warning for the required rewrite: `topics/C3.md` asks for Article 36 as document context, not a reporting calendar. The lengthy quarterly deadline/review/audit-committee detour adds little to the annual-report holder example and ends with an admission that the audited second-quarter class has not been identified. Tighten that excursion while retaining the legal distinctions actually needed. Do not merely drop an exception or citation to shorten a retained assertion.

## 4. Native voice and editorial review

### R2-V1 — MAJOR editorial gate, all four languages: repeated literal constructions remain

Original → problem & reason → fix (required, not applied) → facts preserved:

- KO lines 26 and 30: “배상 상대는 … 선의의 취득자와 매도인입니다” / “금지의 자리는 네 곳입니다” → “배상 상대” can be read as the party from whom compensation is sought, and “금지의 자리” is an unnatural way to introduce transaction categories → Say directly who may seek compensation and which transactions Article 20(1) covers → Preserve the claimant/defendant distinction, all four settings, and sources.
- KO line 58: “자기 명의로 샀다면 준용을 기다릴 필요가 없습니다” → Statutory application is not a waiting step; the metaphor adds a nonexistent chronology → Explain directly that the person's own-name acquisition does not need the broker deeming rule → Preserve acquisition status and the separate Article 20-1(6)/20(4) broker rule.
- JA lines 58 and 66: “みなしを待たずに取得者です” / “両方なければ、この号の外です” → Literal location/waiting language obscures a legal classification → Use “みなし規定によらず取得者に当たります” and explain that an employee who neither signed nor sealed is outside that provision's対象 → Preserve the two alternatives and the limited statutory scope; retain です・ます.
- JA line 64: “この項は、責任者が誰かをここで定義し直していません” → “ここで…し直して” narrates the writer's reading process → State simply that this paragraph does not define 負責人, then keep the separate status inquiry → Do not supply an unverified definition or make signature the definition.
- EN lines 26, 32 and 34: “Misleading conduct in a trade is Article 20”; “Commission-agent orders are Article 20, paragraph 4”; “Filed papers are Article 20, paragraph 2” → Conduct, orders and papers are not article numbers; these repeated equations are not plain legal English → Use verbs such as prohibits, treats, and requires, with the actor and rule stated directly → Preserve the three different provisions and legal functions.
- EN line 36: “October 14, 2026 is the date of the text on the Laws and Regulations Database” → This confuses the review/check date with the document's date → Identify October 14 as the date on which the statutory text was checked; keep August 7, 2024 as the amendment date → Preserve both dates and their distinct meanings.
- ZH line 64: “只看職稱，放不進這一款的全部” → The object of 放不進 is unclear and this is not natural Taiwanese explanatory prose → Explain that an officer's label alone does not establish that the person belongs to this statutory class → Preserve the limited proposition; do not claim all responsible persons are exempt or define 負責人 without authority.
- ZH lines 66 and 82: “才進這一款…就在第2款之外” / “把每一個被告分進某一款” → Repeated spatial/classification metaphors make the reader translate the prose into its legal meaning → Explain directly when the employee rule applies and what a signature page can establish → Preserve the separate issuer/responsible-person/employee/CPA inquiries and all conditions.

These are concrete intelligibility defects, not a demand for a preferred literary style. Technical terms corrected since round 1—KO 감사조서/검토/증명 and JA 監査調書/レビュー/証明—are improvements and need not be reverted. Titles are specific, non-clickbait and non-imperative. There are no checklist headings or stacked body lists. KO and JA registers are consistent. ZH uses traditional characters and no detected mainland vocabulary, but vocabulary compliance alone does not resolve the constructions above.

All four versions still follow the same four subheads and the same 25-paragraph progression, often sentence for sentence. Shared law is necessary; mechanically preserving the source-language explanatory scaffolding is not. The requested rewrite should repair the cited passages in each language without creating new facts or turning every paragraph into short, disconnected fragments.

### First two prose paragraphs: deletion test

- KO: The opening's false-revenue/holding context and price-alone limitation matter. “요건도, 액수도 그렇습니다” is elliptical; fold its two distinct targets into a clear sentence rather than lose either. Retain the two claimant routes. In the next paragraph, “금지의 자리는 네 곳입니다” adds no information beyond the immediately following complete list and can be absorbed. Prohibition, causal loss and holder exclusion remain.
- JA: “要件も、額もです” has the same elliptical problem; retain both concepts in natural syntax. “募集、発行、私募、売買の四つです” followed by “この四つの場面” can be integrated, retaining the entire list and subsequent substantive rules.
- EN: Correct the opening actor and hypothetical/conditional status under R2-R1. “Price is not enough” duplicates the following price-alone conclusion and can be combined with it. “Four settings are covered” adds no fact once the four settings are named. Preserve all four, the prohibition, causal compensation and holder exclusion.
- ZH: “股價跌了，還不夠” is repeated by the next sentence's precise rule; the precise rule and example context suffice. “四個場合都在禁止之列” is redundant beside the full list. Keep the prohibition, claimant classes, resulting harm and absence of holders in Article 20(3).

These are rewrite directions, not reviewer-applied deletions; no facts, links or hypothetical labels were removed.

Compared opening, subheadings and closing against the three highest-numbered same-language columns dated 2026-10-13: 524, 523 and 522. C3's ending returns to its own holder/document facts instead of copying their generic email ending. Also read the available C1, C2 and C3 openings in all languages. C4–C6 drafts are absent, so this single-column review does not certify the eventual six-column opening-type distribution.

### Sentence variety: sections 5–6

Executed for each language:

`python3 /Users/son7/tseng-col-1014-work/lint.py /Users/son7/tseng-col-1014-work/drafts/C3/<lang>.md <lang> taiwan-false-financial-report-investor-civil-damages`

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1014-work/drafts/C3/<lang>.md`

| Language | Lint / body length | Variety | CV | Very short sentences | Maximum repeated paragraph opener |
| --- | --- | --- | --- | --- | --- |
| ko | OK / 3,097 characters | exit 0, 0 FAIL | 0.503 | 11/91 | 1 |
| ja | OK / 3,420 characters | exit 0, 0 FAIL | 0.514 | 12/88 | 2 |
| en | OK / 1,468 words | exit 0, 0 FAIL | 0.479 | 21/103 | 2 |
| zh-hant | OK / 2,496 characters | exit 0, 0 FAIL | 0.515 | 12/88 | 2 |

KO has a 97% 니다 ending WARN; JA a 96% です・ます ending WARN. Neither is a FAIL or a reason to mix registers. All have at least two very short sentences and a genuine citation-free fictional-scene paragraph. There are no three paragraphs with the same opening token, no three consecutive claim–citation–caveat paragraphs, no excess contrast-template pattern, and no copied disclaimer/sales ending. Necessary limitations of legal liability were not miscounted as invented reader positions. Each body has a genuine reader question. No edit has removed a number, citation, condition or hypothetical marker.

Result: no automatic FAIL and no two-item manual failure establishing a mandatory MONOTONY rejection. Do not invent a MONOTONY finding from the ending WARNs or from the separate native-prose finding. The substantive and editorial issues above independently require FIX.

## Minor edits applied

None. The four column files, fact sheet and image are unchanged. Issues affecting legal scope, eligibility, document identity or citations were left for the writer as instructed. Proposed wording in this log is not a claim that the fixes have been applied.

Reviewed SHA-256:

- ko: `b90d47bb31a1807e3468e2e84003c5bf021c94700e146a681d6130d7e99e52f8`
- ja: `d7b59fe8b5018199836074f145e33e854e81357ce6ddb74976c209b78431ec5b`
- en: `6772d46e5da8e5cdd4897dd2baf5eac2d138f73ba00e69f38bd0d6729b8b336e`
- zh-hant: `496c1586b332609d10b6e6c8a483afacf6c347df8db4dfcadde53bb834f3472a`

## 5. Image

Image verdict: OK. Viewed `/Users/son7/tseng-col-1014-work/images/C3.webp` with the image-viewing tool. It shows a closed, unmarked blue document folder on a wet stone bench between generic glass office buildings. This restrained corporate/document illustration fits the subject. No people, faces, text, logos, flags, readable documents or identifiable issuer are visible. Nothing presents it as a photograph of an actual dispute. No REDO is required.

VERDICT: FIX      (major issues remain; listed in the log)
