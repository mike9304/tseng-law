# C3 final review — Astra, round 1

Verdict: FIX. All four versions require changes before publication. Five blocking issue groups remain: defendant classification, an unsupported damages-calculation statement, the scope of the quarterly-filing exception, missing claim-adjacent citations, and sustained unnatural prose. The image is OK. Automated lint and sentence-variety checks pass; they do not resolve these findings.

Reviewed on 2026-10-14. Slug: `taiwan-false-financial-report-investor-civil-damages`. This is the independent final review, not an adoption of the writer's fact sheet or an earlier review. No lawyer or human native-speaker review is claimed.

## Scope and evidence

Read in full: `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C3.md`, all four `drafts/C3/{ko,ja,en,zh-hant}.md` files including frontmatter/FAQ/sources, `drafts/C3/facts.md`, and `research/C3-statutes.md`. Read the shared `SENTENCE-VARIETY-RULE.md`, including sections 5–6, and the recurring mistakes in `LESSONS.md`. Also read the prior-lane `COLUMN-VOICE-RULE.md` and the repository's `docs/columns/EDITORIAL-VOICE.md`.

The instructed `/Users/son7/agent-library/knowledge/editorial-voice.md` path is absent on this machine. The full supplied `brief-EDITORIAL-VOICE.md` and the repository editorial-voice document were opened instead; no editorial gate was waived. The workspace itself is not a Git repository, so the audit uses saved original files, explicit diffs, and hashes rather than a Git diff.

Opened the following official pages independently with curl; every request returned HTTP 200. Read the downloaded statutory text rather than relying on the fact sheet. The main provisions were also opened through the web tool.

- Securities and Exchange Act: [Article 3](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0400001&flno=3), [Article 14-5](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0400001&flno=14-5), [Article 20](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0400001&flno=20), [Article 20-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0400001&flno=20-1), [Article 36](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0400001&flno=36), [Chinese full text](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=G0400001), and [official English full text](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=G0400001).
- Additional reviewer cross-check: [Company Act Article 8](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=8), for the distinction between corporate legal status and a signature on a report. This source has not been added to the column.

There are no judgments, actual issuers, actual filings, foreign-law propositions, or numerical damages examples cited in these drafts. Accordingly, there is no cited judgment `.txt` or judgment holding to verify. The hypothetical investor and holding period are expressly fictional in every language. No court-search snippet was used as authority for this verdict.

Source downloads, original draft snapshots, final check outputs, metrics, and hashes are saved in `reviews/C3/source-check-astra-r1/`. Line references below refer to the reviewed files; the one applied edit did not change line numbering.

## 1. Law and facts

### M1 — MAJOR, all four languages: the report is made to determine every defendant's legal category

Original:

- KO, line 82: “상대가 발행인인지, 책임자인지, 그 보고서에 서명하거나 날인한 직원인지, 비자를 한 회계사인지는 그 서류에서 갈립니다.”
- JA, line 82: “相手が発行人か、責任者か、その報告に署名または押印した職員か、簽證をした会計士かは、その書類で分かれます。”
- EN, line 82: “Whether the defendant is the issuer, a responsible person, an employee who signed or sealed that report, or a CPA who attested it, is read off that document.”
- ZH, line 82: “對方是發行人、負責人、在該報告上簽名或蓋章的職員，還是辦理簽證的會計師，要從那份文件看。”

→ Problem & reason: Article 20-1(1)(1) names the issuer and its responsible persons without making their inclusion depend on a signature in this report. The signature-or-seal condition belongs to the employee category in (1)(2); the CPA has the separate paragraph 3 test. A report may help identify relevant people, but the cited provision does not establish that every person's legal status can be read off it. Company Act Article 8 further confirms that responsible-person status concerns corporate office and, for specified positions, the scope of duties. Lines 64 and 68 avoid defining that status, then the conclusion supplies an unsupported shortcut. This can cause a reader to overlook a responsible person who did not sign the report.

→ Fix (required; not applied): Replace the documentary shortcut with the actual distinction: issuer/responsible-person status must be determined separately; an employee must have signed or sealed the relevant document; the CPA must satisfy paragraph 3. A document can evidence signing or attestation, not conclusively classify every defendant. If explaining the statutory meaning of 負責人, verify and cite the necessary additional law; do not infer its meaning from Article 20-1's failure to repeat a definition. Keep this separate from whether any particular defendant ultimately owes damages.

→ Facts preserved: All statutory defendant groups; signature OR seal for employees; CPA misconduct/duty/causation requirements; the non-issuer defenses; no automatic liability of every officer or accountant. The drafts remain unchanged on this issue.

### M2 — MAJOR, all four languages: an editorial cross-link becomes an unsupported rule about calculating damages

Original, line 78:

- KO: “주식을 팔 때의 세금은 이 배상과 한 계산으로 보지 않습니다.”
- JA: “株を売るときの税金は、この賠償と一つの計算にはしません。”
- EN: “Tax on a sale of shares does not enter this damages calculation.”
- ZH: “賣掉股票的稅，不放進這個賠償裡算。”

→ Problem & reason: The English and Chinese sentences expressly exclude tax from the damages calculation; the other versions convey the same exclusion. None of the cited provisions establishes such a calculation rule. The fact sheet calls this merely a scope distinction, but the published wording says more. The internal tax article is not official authority for damages methodology. This review does not conclude that any particular tax must be included; it concludes that the categorical exclusion has not been supported.

→ Fix (required; not applied): Remove the calculation proposition and retain a neutral navigation sentence saying that the related column discusses taxation when shares are sold. Do not replace it with another damages formula. Keep the existing valid same-language internal link.

→ Facts preserved: Civil recovery remains this column's subject, taxation remains a separately linked subject, and no new statement about recoverable loss is introduced. No draft change applied.

### M3 — MAJOR, all four languages: the exception is attached only to annual reporting, leaving the quarterly deadline unconditional

Original, line 54:

- KO: “제1분기와 제2분기, 제3분기가 끝난 뒤 45일 안에 공고·신고합니다.”
- JA: “各四半期が終わってから45日以内に公告し、主管機関へ申告します。”
- EN: “Within 45 days after the quarter ends, the company publicly announces and files a report…”
- ZH: “各季終了後四十五日內公告並申報…”

→ Problem & reason: Article 36(1)'s introductory exception for special circumstances otherwise provided by the competent authority governs its subparagraphs, including the quarterly report rule in subparagraph 2. The drafts state the exception in line 50 inside the annual-report sentence, then introduce a separate quarterly rule after the audit-committee paragraph. That wording leaves readers with an unqualified quarterly deadline. The default 45-day number and the first/second/third-quarter coverage are correct; the problem is the lost qualification.

→ Fix (required; not applied): State that the quarterly rule is also subject to the Article 36(1) exception, or put the exception in a clearly common introductory sentence governing both annual and quarterly reporting. A tighter alternative, consistent with the topic brief, is to retain only the Article 36 document context needed for the hypothetical annual financial report and remove the unnecessary quarterly-calendar excursion. Do not change or invent deadlines to repair this.

→ Facts preserved: The annual three-month and quarterly 45-day default periods, their fiscal-period end starting points, the competent authority's exception, and the distinction between audit/attestation and review. No numerical or legal edit applied.

### Verified legal core and limits

The following findings apply to KO, JA, EN and ZH individually, not merely to the fact sheet:

| Claim checked | Finding |
| --- | --- |
| Article 20(1), prohibited conduct and offering/issuance/private-placement/trading coverage | Correct substantive enumeration. |
| Article 20(3), breach of paragraph 1 and good-faith acquirers/sellers with resulting damage | Correct; holders are not added to this paragraph. |
| Article 20(4), broker acting as commission agent in its own name | Correct deeming rule; the principal is treated as acquirer/seller. |
| Article 20(2), issuer's filed OR announced financial reports and financial/business documents | Correct in the substantive explanation. |
| Article 20-1(1), document classes, essential content, falsity OR concealment, issuer's securities, good-faith acquirer/seller/holder, resulting damage | Core conditions are present in every version. A price decline alone is not presented as sufficient. |
| Article 20-1(1)(2), employee signature OR seal | Correct express rule; KO's later loose “이름을 올리거나” should be made precise during revision. |
| Article 20-1(2), due care AND good cause for reasonable belief | Correct conjunction; the issuer is excluded from this defense. |
| Article 20-1(3)–(4), CPA wrongdoing/duty breach or neglect, resulting loss, and court access to working papers | Core rule correctly distinguished from paragraph 2. Documents are requested through the court, not by a free-standing direct demand to the CPA. |
| Article 20-1(5)–(6), negligent non-issuer proportionate liability and incorporation of Article 20(4) | Correct substantive account. The issuer remains subject to paragraph 1's elements. |
| Article 36(1)(1), annual document and default period/formalities | Matches the official text, including the special-circumstances qualification. |
| Article 14-5(4), inapplicability of supervisor recognition where an audit committee exists | Correct paragraph and effect. |
| Article 14-5(1)(10), audited second-quarter reports | The drafts correctly refrain from claiming these two provisions alone identify every report requiring audit. This tangent adds little to the intended civil-claim scope and should be shortened during revision. |
| Competent authority; latest amendment | Article 3 identifies the FSC. The Chinese and English full-text pages both show 2024-08-07. The drafts call this the Act's latest amendment date, not the effective date of each cited provision. |

No arithmetic error or inconsistent amount was found; there is no numerical damages calculation. No conflicting four-language statement of the core statutory claimant/defense categories was found. The shared overstatements above remain publication blockers even though they are repeated consistently.

## 2. Citations

### M4 — MAJOR hard-rule violation, all four languages: most substantive legal paragraphs have no adjacent official link

Original → The entire defendant section, lines 62–76, explains Article 20-1(1)–(5) without an inline official link. For example, KO line 70 begins “제2항은 발행인을 제외한 사람들의 면책 요건을 정합니다”; JA line 74 explains the court's access to working papers; EN line 76 gives proportionate liability; ZH line 72 states the CPA liability test. The same omission occurs in lines 26, 32, 34, 42, 44, 50, 54, 56, 58 and 82.

→ Problem & reason: An Article 20-1 link in line 40 and a list at the end do not satisfy the batch's requirement for a claim-adjacent inline link. In particular, the annual/quarterly deadlines, broker deeming rule, defendants, defense, CPA procedure and responsibility proportions cannot be traced immediately from the paragraphs containing them. The lint only requires some MOJ citation; it does not certify citation placement. Even the introductory Article 20 link in line 30 precedes several distinct claims rather than following them as instructed.

→ Fix (required; not applied): Add the correct single-article links immediately after the relevant claim or tightly grouped explanation, preserving the paragraph/subparagraph references. Use Article 20 for its paragraphs 1–4, Article 20-1 for its paragraphs 1–6, Article 36 for reporting requirements, and Article 14-5 for the audit-committee statements. Consolidating related legal explanations can avoid a mechanical link after every short sentence, but leaving whole independent legal paragraphs unlinked is not acceptable. Preserve a genuinely non-legal, citation-free hypothetical paragraph for variety; do not obtain citation variety by leaving legal claims unsupported.

→ Facts preserved: No fact, condition, number, citation target or hypothetical label may be removed in this repair. No citation edit was made by the reviewer, in accordance with the reviewer's limited editing authority.

Existing URL destinations are correct: all five single-article links match their labels. Each sources section lists all sources actually linked in that draft and carries the correct localized 2026-10-14 check date. No judgment-link mismatch exists. Each version links exactly one existing related column, `342-selling-shares-taiwan-company-securities-transaction-tax-agreements.md`, in its own language; the lint checks the corresponding repository file. No link targets this batch or another language.

## 3. Rules and metadata

All four files pass frontmatter and length lint. Independently checked: exact author `legal-ai-assistant`, correct language-only audience, topic `litigation`, required category, dates, three FAQs, matching title/H1, and the literal `NNN` image path. English title length is 62 characters, so a separate SEO title is required; its 35 characters pass the 30–45 limit. The English summary is 160 characters and contains none of the prohibited punctuation or URLs.

No bold formatting, private-party name, office street address, phone/hotline number, messaging ID, lawyer/native-review claim, invented professional experience, criminal-law discussion, outcome guarantee, investment recommendation, or foreign-law assertion was found. Each language has one short email-only firm contact paragraph. Every scenario remains explicitly fictional. Read-time labels are plausible. The tax link is valid; its preceding calculation claim is the separate M2 defect.

The FAQs reflect the main statutory structure. They are included in the required terminology revision below, especially KO FAQ 3 and JA FAQ 3. They do not cure missing citations or overstatements in the body.

## 4. Voice in each language

### M5 — MAJOR editorial gate: substantial literal, statute-narrating prose remains

This is a native-prose failure, not an assertion about how the writer generated the files. All four versions have the same four subsection positions and the same sequence of 25 body paragraphs, including the same detour into the database header, the same quarterly-report digression, the same defendant-by-defendant blocks, and the same recap. Shared legal content is necessary; these repeated structures and the examples below show that the prose has not been sufficiently recast for its readers. Numerical variety alone does not resolve that.

KO originals → “그 주식을 아직 가진 사람의 손해배상은 조문에서 갈립니다” (26); “회계사가 핵열(核閱)한 뒤” (54); “작업 저고를 법원에 가져오는 절차” (74), also “작업 저고” in FAQ 3; repeated “비자” without an intelligible Korean explanation → “조문에서 갈립니다” supplies no useful criterion, and “작업 저고/핵열/비자” imports Chinese legal/accounting wording without giving Korean readers normal working terminology → Fix (required): state the holder rule directly; use an explained Korean term such as “감사조서(工作底稿)” for the working papers and explain “검토(核閱)” separately from the relevant 감사·증명/簽證 terminology. Preserve the audit-versus-review distinction rather than replacing every term with “감사.” Replace “이름을 올리거나” with the already-stated signing requirement, not merely having one's name printed on a document → Facts preserved: documentary scope, signature OR seal, the CPA's role and court procedure; no proposed removal of any legal condition.

JA originals → “保有者は第3項の文言にいません” (30); “同じ条第2項が財務報告です” (34); “誰が賠償するかは、第20条の1第1項の二つの号が分けます” (62); “作業底稿” and unexplained “簽證／核閱” → These sentences give statutory text human location/action and retain Chinese expressions as if they were ordinary Japanese. For example, a paragraph is not itself a financial report → Fix (required): use natural constructions such as “第3項には保有者が挙げられていません” and “第2項は財務報告の内容について定めています”; explain 監査調書（工作底稿） and the Taiwanese accounting terms on first use. Keep です・ます and distinguish audit/attestation from review → Facts preserved: the same article, excluded holder wording, and accounting procedures; this is not permission to change legal categories.

EN originals → “Civil liability for the report is Article 20-1” (40); “Article 14-5 … places beside those rules…” (54); “Issuers stay outside this proportion” (76) → These are awkward mappings of concepts to article numbers and percentages, not plain explanations of who owes what. The repeated “paragraph 1 damage” and paragraph-location narration further burden the reader → Fix (required): use direct subjects and verbs, for example “Article 20-1 governs civil liability for these reports” and “Paragraph 5's proportionate-liability rule does not apply to the issuer.” Recast the longer explanations around the reader's claim while retaining all elements and source references → Facts preserved: the specified provisions, defendant groups, issuer exclusion and causal loss. One unrelated grammar correction was applied below; the larger voice problem remains.

ZH originals → “誰該賠償，由第20條之1第1項的兩款分開” (62); “簽過名，並不因此就把會計主管固定成負責人” (68); “發行人也不在這個比例裡。…這些第1項要件對發行人仍然在” (76) → “兩款分開／固定成／要件仍然在” are unnatural renderings of classification and continuing applicability. Taiwan vocabulary and traditional characters alone do not make this natural Taiwanese prose → Fix (required): explain the legal relation directly, e.g. “發行人不適用第5項的比例責任規定，但請求賠償仍須符合第1項要件。” Recast the surrounding paragraph without dropping the negligence condition or the separate CPA test → Facts preserved: issuer exclusion from paragraph 5, continuing paragraph 1 requirements, and the distinction between a responsible person and a signing employee.

Titles are specific and non-clickbait, headings are not imperative checklists, and the KO/JA registers are consistent. The failures concern intelligibility and repeated literal exposition, not a demand to make every title or paragraph more conversational.

### First-two-paragraph deletion test

| Language | Opening paragraph | Next prose paragraph, beginning the Article 20 section |
| --- | --- | --- |
| KO | Retain the false annual revenue/continuing-holder context and the price-alone limit. The final “누가 청구할 수 있는지…그 조문에 따라 달라집니다” repeats the preceding distinction without stating the answer; fold it into a direct explanation during M5. | The prohibition, resulting-loss claimant rule, and absence of holders each add information; retain all three. |
| JA | The holder context and price-alone limit add information. The final “適用される条文によって異なります” merely repeats the preceding separation; replace the vague framing with the actual distinction. | Each of the three legal propositions adds information. Keep them, rewriting the unnatural “文言にいません.” |
| EN | The four sentences contain the price-alone limit, separate routes, buyer/seller coverage and holder coverage. The tail “the defendants are listed one by one” adds presentation commentary rather than a useful rule. | “Four paragraphs … draw the line” can go if its link is moved to the actual legal claim. Preserve the prohibition, claimant class and holder exclusion. |
| ZH | The first sentence supplies the price-alone limit. The following context is relevant, but “取決於…哪一條” should deliver the actual holder rule rather than defer it. | Prohibited conduct, claimant class/resulting loss, and holder exclusion are all substantive and must remain. |

These are required directions for the writer's substantive revision; the reviewer did not delete or relocate legal text/citations under the minor-edit permission.

Compared opening/headings/closing against the three highest-numbered columns dated before this batch in each language: 524, 523 and 522, all dated 2026-10-13. C3 does not copy their generic email ending; its last paragraph returns to the investor, albeit with M1's legal defect. Also inspected the available C1/C2/C3 openings in each language. There is no stock hypothetical opener in C3. C4–C6 language drafts were not available, so the completed six-column batch's opening-type distribution cannot be certified by this one-column review.

### Sentence variety: checks and manual sections 5–6

Final executed commands for every language:

`python3 /Users/son7/tseng-col-1014-work/lint.py /Users/son7/tseng-col-1014-work/drafts/C3/<lang>.md <lang> taiwan-false-financial-report-investor-civil-damages`

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1014-work/drafts/C3/<lang>.md`

| Language | Lint | Body length | Variety exit/FAIL | CV | Very short sentences | Warning |
| --- | --- | --- | --- | --- | --- | --- |
| ko | OK, exit 0 | 2,943 characters | exit 0 / 0 FAIL | 0.496 | 8 of 80 | 96% end in 니다; preserve 합니다체 while improving prose. |
| ja | OK, exit 0 | 3,235 characters | exit 0 / 0 FAIL | 0.478 | 11 of 82 | 95% desu-masu; no register-mixing failure. |
| en | OK, exit 0 | 1,424 words after the edit | exit 0 / 0 FAIL | 0.520 | 10 of 82 | None from checker. |
| zh-hant | OK, exit 0 | 2,323 characters | exit 0 / 0 FAIL | 0.507 | 6 of 75 | None from checker. |

Manual self-check: no stock hypothetical opener; at least two very short sentences in each version; maximum two occurrences of any paragraph-opening token in each; no three consecutive claim–citation–caveat paragraphs; the fictional-scene paragraph provides a legitimate citation-free paragraph; no excessive contrast template or invented reader position requiring a MONOTONY rejection; no copied disclaimer ending; consistent KO/JA register. All original hypothetical labels remain. English line 54 has two sentences exceeding 32 words in one paragraph and should be split or shortened during revision; this is a local rhythm warning, not two failed mandatory self-check items. Necessary legal limitations were not counted mechanically as forbidden contrasts.

Result: no automatic FAIL and no two-item manual failure establishing a mandatory MONOTONY rejection. Do not report a nonexistent checker failure. The verdict remains FIX for M1–M5, including the separate native-prose requirement.

## Minor edit actually applied

EN line 72 only:

Original → “So is an attestation that involved neither misconduct nor a violation or neglect of duty.”

→ Problem & reason: “So is” does not grammatically continue the preceding verb phrase “fall outside the paragraph.”

→ Fix (applied): “An attestation that involved neither misconduct nor a violation or neglect of duty also falls outside the paragraph.”

→ Facts preserved: Same attestation, same absence of misconduct/duty violation/neglect, same paragraph scope and negation. No factual proposition, number, citation, hypothetical label or frontmatter field changed. All extracted numbers and link targets compare identically before/after. The required English lint was run immediately after the edit and returned OK; all four lint and variety checks were then rerun and saved.

No edits were applied to KO, JA, ZH, the fact sheet, or major issues. No publication action was taken.

Final draft SHA-256 values:

- ko: `b00324f2e0296d0fc311db2f219af468b8958a98e32d4c2f8075383ddb00d188`
- ja: `546f4b8f995c38c009e939f3ff85ad26598e23e61e290f653fd3cccfeeb94444`
- en: `a565c9885f2a6780172cfbed378e79982eb6e61dce000928108cb7f5ca949fb8`
- zh-hant: `428479fe58759ea94511e32717c648ff00975486babb7f93abe4691f05197c80`

## 5. Image

Image verdict: OK. Opened and visually inspected `/Users/son7/tseng-col-1014-work/images/C3.webp` with the image-viewing tool. It shows a closed, unmarked blue document folder on a wet stone bench between generic glass office buildings. The corporate/document setting fits the financial-report subject. No people or faces, readable documents, text, logos, flags, identifiable issuer, or recognizable private-party information are visible. The illustration is restrained and respectful; no REDO is required.

VERDICT: FIX      (major issues remain; listed in the log)
