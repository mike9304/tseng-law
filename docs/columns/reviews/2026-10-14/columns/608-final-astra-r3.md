# C3 final review — Astra, round 3

Verdict: FIX. The previously identified substantive and citation defects have been repaired, but the four versions still fail the batch's native-prose and non-templating editorial gate. The remaining major issue is R3-V1 below, with examples and required directions for each language. This is not a rejection based on an automated variety warning. All four lint checks pass; all four variety checks have zero FAILs. Image: OK.

Reviewed on 2026-10-14. Slug: `taiwan-false-financial-report-investor-civil-damages`. No publication approval is given. This is round 3; under the batch's three-round limit, the coordinator should HOLD this column rather than publish these files as is.

## Scope checked

Read fully: `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C3.md`, all four `drafts/C3/{ko,ja,en,zh-hant}.md` files, including metadata and FAQs, `drafts/C3/facts.md`, and `research/C3-statutes.md`. Read `SENTENCE-VARIETY-RULE.md`, including sections 5–6, and skimmed all 25 recurring-error entries in `LESSONS.md`.

Also read the earlier lane's `COLUMN-VOICE-RULE.md` and the repository's `docs/columns/EDITORIAL-VOICE.md`. The requested `/Users/son7/agent-library/knowledge/editorial-voice.md` is absent on this machine. The supplied full `brief-EDITORIAL-VOICE.md` and repository document provide the applicable editorial instructions; the missing path was not treated as a waiver. Earlier review logs were consulted after the independent draft/source comparison, not accepted as verification of this revision.

Fetched these official pages independently with curl. All seven returned HTTP 200, and their contents were read:

- Securities and Exchange Act: [Article 3](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0400001&flno=3), [Article 14-5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0400001&flno=14-5), [Article 20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0400001&flno=20), [Article 20-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0400001&flno=20-1), and [Article 36](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0400001&flno=36).
- [Chinese full text and amendment header](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=G0400001) and [official English full text](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=G0400001).

Articles 20-1, 14-5 and 36 were also opened through the web tool. The writer's fact sheet was checked against these texts. No judgment, actual issuer, actual filing, foreign-law proposition, monetary example, or damages arithmetic is cited in the four drafts. There is therefore no cited judgment text or judgment holding to verify.

Evidence is saved in `reviews/C3/source-check-astra-r3/`: downloaded HTML and extracted text, HTTP results, fresh lint/variety output, detailed metrics, and snapshots of the reviewed drafts. The workspace is not a Git repository. Hashes confirm that the four drafts did not change during this review. No lawyer or human native-speaker review is claimed.

## 1. Law and facts — each language checked

| Statutory proposition | KO | JA | EN | ZH-Hant |
| --- | --- | --- | --- | --- |
| Article 20(1): offering, issuance, private placement and trading; prohibited misleading conduct | Verified | Verified | Verified | Verified |
| Article 20(3): breach of paragraph 1, good-faith acquirer/seller and resulting loss; no holder category added | Verified | Verified | Verified | Verified |
| Article 20(4): customer using a broker acting in its own name deemed acquirer/seller | Verified | Verified | Verified | Verified |
| Article 20(2): issuer's filed or announced financial reports and financial/business documents | Verified | Verified | Verified | Verified |
| Article 20-1(1): relevant documents, essential content, falsity or concealment, good-faith acquirer/seller/holder and causally resulting loss | Verified | Verified | Verified | Verified |
| Separate issuer/responsible-person and signing/sealing employee categories | Verified | Verified | Verified | Verified |
| Paragraph 2: due care AND justified reasonable belief; issuer excluded | Verified | Verified | Verified | Verified |
| Paragraph 3: attesting CPA's misconduct or breach/neglect of professional duty and causation | Verified | Verified | Verified | Verified |
| Paragraph 4: court-mediated working-paper access and no refusal by CPA/firm | Verified | Verified | Verified | Verified |
| Paragraphs 5–6: negligent non-issuer proportionate liability and broker-rule incorporation | Verified | Verified | Verified | Verified |
| Article 36(1): annual/quarterly defaults, fiscal-period starting points, special-circumstances exception, sign/seal and review/attestation distinctions | Verified | Verified | Verified | Verified |
| Article 14-5(4): supervisor-recognition rule inapplicable to companies with an audit committee | Verified | Verified | Verified | Verified |

The general test now concerns false or concealed content, rather than requiring an incorrect number. EN and ZH now distinguish being a good-faith holder from satisfying the conditions for compensation. The EN summary includes causally resulting loss. EN and ZH now consistently identify the annual financial report, avoiding confusion with the separate shareholders' annual report. The EN opening is conditional and identifies the issuer as the actor making the later announcement.

All four preserve signature OR seal for employees, and the two cumulative requirements of the non-issuer defense. They do not impose automatic liability on every officer or CPA. The distinction between corporate status and evidence of signing/attestation is preserved. The statements about responsible persons are read as warnings against treating every officer label as sufficient, not as an independently sourced definition of 負責人; no such definition is supplied.

The price-alone and next-day-purchase limitations are appropriately presented as insufficiency of those facts alone. They do not assert a damages formula or a verified judicial holding. The illustrative investor, document, purchase date and continued holding period are identifiable and expressly fictional in every language.

The three-month annual and 45-day quarterly defaults match Article 36(1), with the competent-authority exception now attached to both. Article 14-5(1)(10) supports the limited reference to audited second-quarter reports; the drafts do not claim to have identified every such report or stated the entire committee/board procedure. The quarterly detour remains an editorial scope concern below, not a newly discovered wrong deadline.

The official amendment header is 2024-08-07 / 民國113年08月07日. All four call it the Act's latest amendment, not the effective date or amendment date of each cited article. No separate effective date is asserted. The stated check date is 2026-10-14. Article 3 supports the FSC identification.

The EN scope wording “filed or publicly disclosed” follows the official English Article 20-1 text. Its later explanation of Article 36 duties says announcement AND filing. This is not recorded as a new AND/OR error. No remaining major discrepancy in the statutory core or cross-language legal requirements was established in this review.

## 2. Citations

All five single-article destinations match the article labels. The previously missing Article 20-1 citation at line 44 and Article 36 citation at line 54 are now present in every language. Integrated article-as-subject links support their tightly grouped legal explanations; an identical link after every short sentence is unnecessary. Each sources section lists all six official pages used in that draft and includes the localized 2026-10-14 check date.

Each draft has one same-language internal link, to `selling-shares-taiwan-company-securities-transaction-tax-agreements`. Lint confirmed existence, and the corresponding `342-...md` file was independently located in all four repository content directories. No internal link targets this batch or another language. The tax sentence is neutral navigation, not a claim about calculating recoverable damages. No judgment URL needs verification.

## 3. Rules, scope and metadata

All four satisfy the inspected metadata rules: required fields, matching H1/title, `author: "legal-ai-assistant"`, language-only audience, `topic: "litigation"`, correct category, dates, three FAQs and literal NNN image path. The English title is 62 characters, so a separate SEO title is required; its length is 35. The English summary is 156 characters and contains no prohibited punctuation. Read-time estimates are plausible.

No private-party name, bold formatting, phone/hotline number, street address, messaging ID, attorney byline, lawyer/native-review claim, invented professional experience, criminal-law discussion, outcome guarantee or investment recommendation was found. Each version has one short firm/email contact paragraph near the end. The FAQs are consistent with the body and verified statutory conditions. There is no foreign-law note to assess.

Scope direction for the required editorial revision: `topics/C3.md` calls for Article 36 as the report-filing context. Lines 50–54 devote substantial space to annual and quarterly filing mechanics, the supervisor exception and an unresolved second-quarter audit classification. This interrupts the annual-report holder example. Keep the document identity and distinctions needed for the civil claim; do not expand the reporting calendar further. Any retained deadline or procedure must retain its qualification and source. This is not a direction to delete legal conditions merely to improve rhythm.

## 4. Voice — remaining major issue

### R3-V1 — MAJOR, all four: the native-prose/non-templating gate remains unmet

Original → All four have four corresponding subheads and 25 prose paragraphs, with essentially the same progression: price decline; Article 20 transactions; broker; document prohibition; database date; document classes; holder distinction; the holder distinction again as a question; an investor buying the next day; annual formalities; audit committee; quarterly detour; continued holding; broker again; defendant introduction; responsible persons; employees; signatories; defense; CPA; working papers; proportion; tax link; contact; recap. Changing the investor's residence does not materially change this explanatory structure.

→ Problem & reason: The batch expressly requires native writing for each audience, and the full voice brief says not to copy Korean sentence order, subheads and sentence counts into the other languages. Shared statutory content and a similar broad organization are acceptable; the near paragraph-for-paragraph reproduction here also carries over the same redundant explanations and unnatural constructions. The repair has replaced several bad phrases, but has not resolved this substantive editorial finding from the previous rounds. Passing numerical sentence-length thresholds does not satisfy this separate hard rule.

→ Fix (required, not applied): Rework the explanatory prose for each audience, consolidating duplicated explanations and giving each version natural transitions and emphasis. Keep every distinct statutory element, cited source, number, exception and fictional label. Do not satisfy the rule by merely shuffling paragraphs or adding more very short filler sentences. This is beyond isolated reviewer typo/naturalness edits.

→ Facts preserved: The shared civil-claim core remains common to all four languages. The required change concerns the presentation of that core, not the introduction of new legal claims, cases or local-law comparisons.

Concrete language-specific evidence and directions:

- KO, lines 42–44: “제20조 제3항만 펼치면 보유자가 빠집니다. 재무보고에서는 제20조의1 제1항이 보유자를 적어 둡니다.” Immediately followed by “팔지 않고 들고만 있다면 제20조 제3항으로 충분한가요? 충분하지 않습니다.” → The next paragraph asks and answers the point just settled; the reader is led through the numbering again rather than into a new issue. The opening and line 30 already make this distinction as well. → Required: state the difference clearly once, then use the next passage for the report defect, good faith and causal loss, with the necessary links retained. → Facts preserved: Article 20(3)'s acquirer/seller classes, Article 20-1's holder class, and every claim element.

- KO, lines 56 and 72: “나중 공고가 나올 때까지 앞의 사람은 주식을 들고 있습니다.” / “부당 행위도 없고 의무 위반이나 해태도 없는 증명에도 미치지 않습니다.” → “앞의 사람/나중 공고” is an awkward repeated reference to the example; the latter sentence attaches the liability provision to “증명” after already giving the CPA's complete test. → Required: refer naturally to “사례의 투자자” and the issuer's later announcement; state the CPA rule with the accountant as the actor, consolidating the redundant negative restatement. → Facts preserved: the holding chronology, attestation requirement, misconduct/duty alternatives and causation. Do not imply that attestation alone creates liability.

- JA, lines 42, 56 and 68: “保有者を書き込んでいるのは…第1項です。” / “あとの公告のときも、先の人は株を持っていました。” / “署名しただけでは、会計主管が責任者に固定されるわけではありません。” → “書き込んでいる”, the paired “あとの/先の”, and “責任者に固定” reproduce the source-language explanation instead of natural Japanese legal prose. The first also repeats the immediately preceding claimant distinction. → Required: use direct formulations such as “保有者も請求権者に含まれます”, refer to “この例の投資家”, and explain that signing alone does not establish status as 負責人. Integrate these into connected です・ます prose rather than making another row of disconnected short assertions. → Facts preserved: holder coverage, hypothetical chronology and the difference between legal status and signature evidence.

- EN, lines 30, 34, 58 and 68: “owes the damage sustained”; “The paragraph states the prohibition and stops”; “Continued holding leaves the holder claim in paragraph 1”; “A signature does not, by itself, fix the accounting officer as a responsible person.” → The first uses an unnatural compensation collocation; the other phrases narrate the statute's layout or use unnatural verbs for entitlement/status. Together with the repeated holder explanation in lines 26, 30, 42 and 44, these do not read as the requested plain, active English. → Required: use “is liable for the resulting loss”, explain directly what a continuing holder may claim, and use “establish” for status. Consolidate the repeated distinction while preserving the specific paragraph governing each rule. → Facts preserved: causal loss, claimant categories, continuing holding and independent responsible-person status. No expansion of eligibility is authorized.

- ZH-Hant, lines 42–44, 54 and 82: “財務報告的爭議若只讀那一項，持有人會被漏掉。持有人寫在…第1項。” followed by “只拿著股票、沒有賣出的人…第3項夠不夠用？不夠。”; “核閱是審閱。年度財務報告要求的查核簽證，是會計師查核並簽證”; “它決定不了每一個被告是發行人、負責人、簽過名或蓋過章的職員，還是符合第3項的會計師。” → The first pair repeats the same explanation; the 核閱/查核 sentences largely restate their words; the closing's document-as-decision-maker and long classification list are cumbersome translated prose. Traditional characters alone do not establish natural Taiwan usage. → Required: explain holder coverage directly, retain a concise and accurate distinction between review and audit/attestation where needed, and close with a concrete sentence about the example's evidence instead of reciting the defendant taxonomy again. → Facts preserved: both CPA procedures remain distinct; all defendant groups, signature/seal alternatives, CPA conditions, good faith and causally resulting loss remain in the article.

These examples form one sustained editorial issue, not a claim that each isolated phrase would independently justify a major verdict. Correct statutory terminology and consistent registers should be retained. Titles are specific and non-imperative; there are no checklist headings or stacked body lists.

### Opening deletion test and comparison

The first two prose paragraphs were checked in each version. Their false-revenue/continued-holding context, price-alone limitation, claimant routes, four transaction settings and resulting-loss requirement carry information. EN's second sentence supplies “elements” and “amount”, so deleting it without integrating those concepts would lose precision. No new legally significant omission is requested. The repeated holder distinction becomes the editorial problem through its additional restatements in lines 42–44, not because the opening lacks any content.

Compared openings, subheads and endings with the three latest same-language repository columns dated 2026-10-13: 524, 523 and 522. C3 does not copy their generic disclaimer ending. Also inspected the available C1 and C2 openings in all four languages. C4–C6 drafts are absent, so the eventual six-column opening-type distribution is not certified. C3's conditional legal opening is not an unlabeled actual-client story or a stock “Suppose/假設” opener.

### Sentence variety — sections 5–6

Executed for each language:

`python3 /Users/son7/tseng-col-1014-work/lint.py /Users/son7/tseng-col-1014-work/drafts/C3/<lang>.md <lang> taiwan-false-financial-report-investor-civil-damages`

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1014-work/drafts/C3/<lang>.md`

| Language | Lint / body length | Variety | Length CV | Very short sentences | Maximum repeated paragraph opener |
| --- | --- | --- | --- | --- | --- |
| ko | OK / 3,164 characters | exit 0; 0 FAIL | 0.496 | 8/89 | 1 |
| ja | OK / 3,442 characters | exit 0; 0 FAIL | 0.496 | 9/85 | 2 |
| en | OK / 1,491 words | exit 0; 0 FAIL | 0.479 | 14/97 | 2 |
| zh-hant | OK / 2,565 characters | exit 0; 0 FAIL | 0.502 | 10/86 | 2 |

KO has a 97% 니다-ending WARN; JA has a 95% です・ます-ending WARN. These are not FAILs and do not justify mixing registers.

Manual self-check: every version has at least two very short sentences, a genuine citation-free hypothetical paragraph and one body question. No three paragraphs share the same opening token. No three consecutive claim–statute–caveat paragraphs, excessive contrast-template pattern, invented opposing reader position, or copied disclaimer/sales closing was found. The final paragraph returns to this article's facts, although its redundant recap is part of R3-V1. KO and JA maintain their required registers. No reviewer edit removed a fact, number, source, condition or hypothetical label.

No automatic FAIL or two-item manual failure triggers the specified mandatory MONOTONY rejection. Do not relabel the ending WARNs as “MONOTONY: FAIL”. R3-V1 is the independently applicable native-prose/non-templating editorial gate, supported by the passages above.

## Minor edits applied

None. The four column files, fact sheet and image were left unchanged. The remaining work is a substantive editorial revision, so the reviewer did not attempt a partial rewrite. All proposed corrections above are required directions, not applied edits.

Reviewed SHA-256:

- ko: `e608d76859b8a2752966527097ef9ec7981c9944475af004ee57d38d8ef1d762`
- ja: `3546470865055fd2a374604b69e89240cc3458b68717566ad1a2b2dee5a5b43d`
- en: `2357ed11ab7d4c51ec22e57632a58407d7c4bcddf4a47cab5e84edca746fcc08`
- zh-hant: `29849e3b5f0957baf438ac162cf433ffd6aa7da6e5b1c49cc9ea01ebb986ba33`

## 5. Image

Image verdict: OK. Viewed `/Users/son7/tseng-col-1014-work/images/C3.webp` with the image-viewing tool. It shows an unmarked closed blue folder on a wet stone bench between generic glass office buildings. The corporate/document setting fits the column and is respectful. No people, faces, text, logos, flags, readable documents or identifiable issuer appear. It functions as a fictional, unidentifiable illustration rather than evidence of an actual dispute. No REDO is required.

VERDICT: FIX      (major issues remain; listed in the log)
