# C4 final review — round 3

Verdict: FIX. The four-language package is not publishable as submitted. Three English legal-scope/meaning corrections remain, together with inline-citation and editorial corrections below. Image: OK. No draft edits were applied.

Reviewed on 2026-10-14, Asia/Seoul. Slug: `taiwan-tenant-early-lease-termination-notice-penalty`. The current user's final-review assignment overrides the historical Fable requirement and batch round limit. This is an AI review, not a lawyer-review or human native-speaker certification.

## Scope checked

Read fully: `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C4.md`, all four language drafts, `drafts/C4/facts.md`, and `research/C4-statutes.md`. Also read the shared sentence-variety rule, including sections 5–6, the recurring lessons, the 0930 column-voice rule, and the available site repository's `docs/columns/EDITORIAL-VOICE.md`. The referenced `/Users/son7/agent-library/knowledge/editorial-voice.md` is absent; the supplied full editorial brief and repository copy provide the available rules. Read the preceding review and fix notes after reading the current drafts; neither was treated as proof.

For each language, checked law/facts first, then citations, hard rules/frontmatter, native prose and sentence variety, and the image. No judgment is cited; no judgment text was therefore applicable. No actual private-party case or arithmetic calculation is presented. The remaining months and the English teacher's November event are explicitly hypothetical.

Fresh curl requests opened 29 official URLs: all 23 cited single-article pages, the two Chinese full-law pages used for amendment dates, two English law pages used for official terminology, and the Executive Yuan page and PDF. Every request returned HTTP 200. Read the relevant official article text and PDF provisions; visually inspected PDF pages 4 and 6, including the point 14 boxes, point 18 exception and point 20. The 20 cited articles reproduced in the research file match the live article text after whitespace normalization. Rental Act Article 4, Civil Code Article 95 and Postal Regulations Article 34 were independently checked from their official pages.

Evidence is saved in `reviews/C4/evidence-astra-r3/`: URL/status/hash manifest `sources.json`, original responses and extracted text, PDF renders, reviewed draft snapshots, fresh lint/variety outputs, `research-live-comparison.json`, `manual-checks.json`, `voice-comparison.json`, and `image.json`.

## Law and facts — required corrections, not applied

### L1 — EN summary omits the contractual permission condition

Original — `drafts/C4/en.md:4`: “Early exit at will needs at least one month of notice. Skipping it costs at most one month of rent.”

→ Problem and reason — The summary presents notice and a one-month cap without saying that the lease must permit at-will early termination. In [point 14](https://www.ey.gov.tw/File/43BC094940995CFC?A=C), these provisions follow the agreement permitting termination. The alternative is expressly “不得”; the mandatory terms do not provide that route with the same monetary cap. “At will” alone does not tell a reader that the contract must grant the right. The other three summaries expressly distinguish the selected permission, and the English body and FAQ also do so. A standalone search summary must not imply that any fixed-term tenant can leave for at most one month's rent.

→ Fix required — State explicitly that this notice/cap rule applies when the lease permits early termination at will. Retain “at least” and make the cap a penalty for missing that notice, not a cap on all outstanding lease debts. Keep the summary within 150–160 characters. The fixed-term-expiry rule may remain in the body if space is needed in the summary.

→ Facts preserved — Preserve the permission condition, one-month minimum notice, one-month maximum notice-default penalty, and distinction from “不得”. Not applied because this changes the legal scope of a published summary.

### L2 — EN changes prepaid rent into all rent already collected

Original — `drafts/C4/en.md:46`: “Rent already collected is returned if the lease ends early under paragraph 1.”

→ Problem and reason — [Point 14, paragraph 4](https://www.ey.gov.tw/File/43BC094940995CFC?A=C) identifies “已預收之租金”: rent received in advance. “Rent already collected” also encompasses rent for occupation that has already occurred. It is a materially broader refund statement. The next paragraph's discussion of Civil Code Article 454 does not repair this sentence's independent description of point 14. KO, JA and ZH retain advance receipt in their corresponding wording.

→ Fix required — Restore the object as “rent received in advance” or “prepaid rent” in the point 14 sentence. Do not imply a refund of all rent paid during the lease. Retain the point 14 route and link, and the separate Article 454 explanation with its existing scope.

→ Facts preserved — Preserve paragraph 1's termination condition, paragraph 4's prepaid-rent object, the deposit/set-off/shortfall provisions, and the Article 452/453 limits of Article 454. Not applied because the refund's legal scope must be corrected by the writer.

### L3 — EN omits the express presumption in the failed-delivery rule

Original — `drafts/C4/en.md:88`: “Only if someone changes the address, says nothing, and the notice cannot arrive does the point treat the first mailing date as the arrival date.”

→ Problem and reason — [Point 20](https://www.ey.gov.tw/File/43BC094940995CFC?A=C) says the first mailing date is “推定為到達日”, a presumed arrival date. The English sentence does not preserve that evidentiary qualification; it states the date as the resulting arrival date. KO says “추정”, JA “推定”, and ZH “推定”. The English version should be equally precise, especially in a section distinguishing dispatch from effective receipt. This finding does not allege that EN expressly says “irrebuttable”; it concerns the omitted qualification.

→ Fix required — Say that the first mailing date is “presumed to be the arrival date” in the specified circumstances. Preserve the causal condition: an address change was not communicated and consequently the notice could not arrive. Do not add a new court procedure or a general rule that posting is receipt.

→ Facts preserved — Preserve all address-change/non-notification/non-arrival conditions, the first mailing date, the presumption, and the separate Civil Code Article 95 arrival principle. Not applied because this is legal meaning, not merely idiom.

## Verified legal core and cross-language comparison

Except for L1–L3 and the citation-placement findings below, the reviewed provisions support the core explanation in KO, JA, EN and ZH:

| Subject | Official provisions checked | Result |
|---|---|---|
| Fixed-term expiry and contractually reserved early termination | Civil Code 450, 453 | Expiry, indefinite-term distinction, customary notice, and landlord-only calendar-period proviso are retained. |
| Covered residential leases and mandatory standard terms | Rental Act 4, 5; Consumer Protection Act 17 | Excluded categories, consumer relationship, approval/announcement, invalid conflicting clauses, and omitted mandatory terms are stated. KO now retains operation/management in Article 4. |
| Permitted at-will termination | Mandatory point 14 and point 5 reference | At least one month's notice; no more than one month's rent as the notice-default penalty; deposit set-off and shortfall; no invented amount for “不得”. EN summary/refund object need L1/L2. |
| Agreed penalty and excessive amount | Civil Code 250, 252 | Default treatment as total damages and possible court reduction are stated without promising an outcome. |
| Prepaid rent under Civil Code | Civil Code 452–454 | Article 454 is confined to termination under the preceding two articles and rent falling due after termination. Article 11 is not misquoted as containing a prepaid-rent provision. |
| Tenant grounds and heirs | Rental Act 11 | Four grounds, relevant conditions, heirs, 30 days' written notice and evidence are preserved. Job loss/transfer/departure is described as absent from the list, not as a judicial holding. |
| Safety/health defect and urgent exception | Mandatory point 18; Civil Code 424 | Knowledge/waiver does not remove the right; 30-day notice/evidence default and the urgent item-3-first-part exception are retained. ZH no longer categorically excludes every repair dispute. |
| Repairs and access | Rental Act 8, 11; Civil Code 423, 429, 430; mandatory point 9 | Landlord responsibility and stated exceptions, reasonable repair demand, reimbursement/deduction or termination, advance repair-access notice and justifiable refusal qualification are present. |
| Subletting/replacement | Rental Act 9; Civil Code 443; mandatory point 8 | Written consent for all/part subletting in the covered leases; Civil Code partial-house proviso is not offered as a bypass; finding a replacement is not automatic release. |
| Handover and deposit | Rental Act 7, 12; mandatory point 15 | Joint check and deemed completion after an unanswered reasonable demand; lease termination, return, and debt settlement/set-off now appear in every deposit-return sentence. |
| Notice methods and evidence | Mandatory point 20 and prohibited point 8; Civil Code 95; Postal Regulations 34 | Bilaterally agreed electronic methods, no exclusive printed-checkbox requirement, telephone-only clause prohibition, dispatch/arrival distinction, and postal-copy definition are supported. EN presumption needs L3. |
| Dispute route | Rental Act 16 | Free municipal/county/city government 調處; small-claims details are left to an existing internal link. |

The Japanese deposit article linked in the draft exists and contains the four Article 11 grounds, the 30-day written-notice requirement and repair-and-deduct discussion. C4 builds on that material as the topic brief requests. The other languages spell out the four grounds. No conflicting cross-language rule was found beyond the English scope/qualification issues above.

The Civil Code full page currently shows ROC 115-08-17, and the Rental Act page ROC 112-02-08, matching the drafts' source notes. The Civil Code's pending-effect notice concerns Articles 166-1 and 1223, not the cited lease provisions. The Executive Yuan page and PDF confirm the point 18 amendment by 台內地字第1140113583號 on 2025-04-18, effective that day; page date 114-04-18 is correct. The official English law titles and “legal attest letter” terminology match MOJ's English pages. No unsupported foreign-law doctrine is asserted.

## Citations and hard rules

### C1 — all languages: remaining legal propositions need their own immediate source

Original — The heirs/30-day-notice paragraph at KO `:64`, JA `:66`, EN `:62`, ZH `:66` states Rental Act Article 11(2)–(3), but its only link is Civil Code Article 452. The repair paragraph at KO `:76`, JA `:78`, EN `:74`, ZH `:78` restates the Article 11(1)(2) 30-day/evidence requirement without linking Article 11 there. The “不得” paragraph at KO `:54`, JA `:56`, EN `:52`, ZH `:56` has no immediate point 14 source.

→ Problem and reason — These claims are substantively verifiable, but the batch requires an inline link immediately with the claim. Article 452 does not state Article 11's 30-day written-notice/evidence rule; Article 430 does not supply it either. A previous paragraph or the final sources list is not the requested immediate attribution. The prior round's point 14 set-off and electronic-notice links have been added, but these gaps remain.

→ Fix required — Link [Rental Act Article 11](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060125&flno=11) at the heirs/30-day and repair-route notice statements in all four languages. Put the [official point 14 source](https://www.ey.gov.tw/Page/DFB720D019CCCB0A/478917df-7599-418f-8715-fd2716b623b4) with the “不得” explanation. Where the repair paragraph newly restates Article 8(3), attach its Article 8 link as well. Consolidating the related explanation is acceptable if no legal condition disappears. Keep the existing correct links rather than substituting one provision for another.

→ Facts preserved — All durations, written form, evidence, responsible parties, and distinctions between provisions remain unchanged. Citation edits were not applied under the reviewer's wording-only edit authority.

All cited single-article URLs resolve to the intended pcode/flno. Every external body URL is represented in the final sources section; each section has the required 2026-10-13 check date. Internal links exist in the appropriate language in the lint repository: KO 2, JA 3, EN 3, ZH 2. None links to another C1–C6 draft.

Frontmatter keys, dates, categories, topic `litigation`, audience, `author: legal-ai-assistant`, H1/title match, literal NNN featured-image path and three FAQs pass structural checks. EN title: 52 characters; title plus brand suffix requires the provided 39-character seoTitle. Summary: 155 characters, with no forbidden syntax; semantic correction L1 is still required. Read-time values are plausible for these lengths.

No bold, private-party names, phone/hotline numbers, street address, LINE/Kakao identifier, attorney byline, lawyer/native-review claim, or outcome guarantee was found. JA's mention of LINE as a notification method is not a contact identifier. Each file has one short firm/email paragraph and one contact-email occurrence. Every hypothetical has its label. No separate public AI byline was added.

## Voice findings — required wording changes, not applied

The titles identify the particular lease-exit issue and are not clickbait or imperative checklists. KO consistently uses 합니다체 and JA です・ます. ZH uses Traditional Chinese and Taiwan vocabulary. The current revisions still contain compressed source-note language and literal metaphors that are not finished native prose. These are editorial findings independent of the numerical variety gate.

| Language / location | Original → problem and reason → required fix → facts preserved |
|---|---|
| KO `:44` | “앞 문단에서 끝낼 수 있다고 약정한 쪽은” → “앞 문단” can refer to the preceding editorial paragraph about amendment dates rather than the preceding paragraph of point 14 → use “임의 종료를 허용한 계약에서는” or explicitly identify the source paragraph → preserve permission and at least one month's notice. |
| KO `:70` | “수리 다툼 전부가 빠지지는 않습니다.” → unclear what the disputes are being excluded from → “모든 수리 분쟁에서 사전 통지가 면제되는 것은 아닙니다.” → preserve the urgent safety/health limitation and exact quotation. |
| KO `:102` | “열쇠는 점교 기록에 남기면 됩니다.” → unexplained transliteration “점교” and the suggestion that a key itself goes in a record → describe recording the return of the keys in the handover record → preserve practical advice, without inventing a compulsory sequence. |
| JA `:48` | “1か月を守って知らせた人に、この点は同じ額を請求しません。” → a provision does not itself make a payment demand; “1か月を守って” is an awkward rendering of the notice period → “1か月前までに通知した場合について、第14点はこの違約金を定めていません。” → preserve the limited statement about this notice-default penalty, not a blanket release from other debts. |
| JA `:78` | “第11条第1項第2号で終えるなら、30日前の書面と証拠が付きます。” → documents do not simply “come attached”; the sentence should identify the required act → say that termination under that provision requires written notice with evidence 30 days before termination → retain the provision, period, written notice and evidence. |
| JA `:62` | “賠償なしで終了できる道は、すでに敷金の記事にあります” → a heading about where the site put information instead of this article's issue → use a heading about termination for an unrepaired dwelling, retaining the existing deposit-article pointer in the paragraph → preserve the JA differentiation and all linked statutory detail. |
| EN `:66` | “Article 424 runs the same way” → unnatural and imprecise idiom → “Article 424 provides a similar right for houses and other residential premises.” → retain the statute link and the preceding safety/health and knowledge/waiver explanation. |
| EN `:78` | “A replacement tenant does not end the months that remain.” → months are not what a tenant terminates → “Finding a replacement tenant does not by itself end the lease.” → preserve the no-automatic-release point. |
| EN `:92` | “The copy keeps the wording posted.” → compressed, unnatural description → “The retained copy records the letter's contents.” → preserve the postal-evidence point and the following arrival/termination qualification. |
| ZH `:32` | “承租人依勾選欄或條例的通知還在。” → literal shorthand, with “通知還在” obscuring the continuing obligation → “承租人仍須遵守契約或條例的通知規定。” → preserve the tenant/landlord distinction and continuing notice requirements. |
| ZH `:76` | “可歸責於承租人的損壞、另有約定、習慣，同一點第1項除外。” → a list of exceptions lacks a natural predicate → state that point 9(1) excepts a different agreement, custom, or damage attributable to the tenant → retain all three alternatives and the source. |
| ZH `:96` | “到達和終止要件，副本本身不算數。” → colloquial “不算數” can sound as though the retained copy has no evidential value at all → explain that the copy alone does not establish arrival or satisfaction of termination requirements → preserve its stated evidence-of-content role and do not add a new evidentiary rule. |

The one-sentence foreign-country notes (“How Korea, Japan, and U.S. states treat an early exit is not stated here” and equivalents) give no useful guidance. When revising, replace them with a brief recommendation to check the applicable local law with a local professional for a lease outside Taiwan. This follows the brief's allowed general-note route and does not require inventing or asserting foreign doctrine.

Opening deletion check: the point 14 quotation supplies the contractual permission and statutory-exit carve-out; it should not be removed as filler. The following checkbox explanation gives its relevance. JA's first paragraph now supplies the cap's contractual context and immediate source. The separate “1年契約も同じです”, “A one-year lease is that case”, and “一年期租約也適用第1項” in the next fixed-term paragraph add no condition beyond the fixed-term rule and one-year setting already established; integrate that application into the preceding sentence when revising. KO already does so. Do not delete the statutory rule or alter the quotation merely to save space.

Compared C4's opening with all six currently available C1–C6 drafts in each language. C4's quotation opening in KO/EN/ZH and question opening in JA are distinct within their respective language batches. Compared openings, headings and endings with the three latest dated same-language files in the available site-content snapshot, 522–524. This is a comparison against that snapshot, not a certification that those other articles are currently live or legally correct. The C4 closing stays with the hypothetical's notice/handover situation rather than copying those articles' contact ending.

## Sentence-variety gate — sections 5–6

Fresh commands executed for each language:

```text
python3 /Users/son7/tseng-col-1013-work/lint.py /Users/son7/tseng-col-1013-work/drafts/C4/<lang>.md <lang> taiwan-tenant-early-lease-termination-notice-penalty
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1013-work/drafts/C4/<lang>.md
```

| Language | Lint | Length | Variety FAIL | CV | Measured very short sentences | Warning |
|---|---|---:|---:|---:|---:|---|
| KO | OK | 3,498 characters | 0 | 0.470 | 9/93 | 87% 니다 endings |
| JA | OK | 4,419 characters | 0 | 0.499 | 16/110 | 94% desu-masu endings |
| EN | OK | 1,596 words | 0 | 0.508 | 23/97 | None |
| ZH | OK | 2,700 characters | 0 | 0.506 | 17/95 | None |

Manual checks, applied independently of the tool:

- No stock hypothetical opener; C4's opening type is distinct in each current same-language batch.
- Every language has at least two actual very short sentences, even after excluding mechanically split quotation fragments from the tool's counts. Examples include KO “실직은 목록에 없습니다”, JA “失職は一覧にありません”, EN “Job loss is not on the list”, and ZH “失業不在這四款”.
- No paragraph-opening word occurs three times; each measured maximum is two. No sustained three-paragraph claim–citation–caveat sequence was found. Each language has a citation-free hypothetical paragraph.
- No more than three contrast templates were found manually. The distinctions between statutory/contractual exit, posting/arrival and repair/urgent danger address the article's actual questions; they do not rebut an invented reader position.
- Each closing remains on the topic's facts, with the contact paragraph before it. It is not a copied disclaimer/sales ending. Some closing language still needs the editorial correction above.
- KO and JA retain the specified registers; no invented first-person professional experience or imperative checklist heading was found.
- No fact, number, citation or hypothetical label was lost through reviewer edits, because none were made.

No mandatory MONOTONY failure is asserted. The KO/JA register warnings are not FAIL lines and do not justify mixing registers. Numerical success does not resolve the separate native-wording or legal findings. After revision, rerun both commands; KO, EN and ZH are particularly close to their upper length limits. Remove redundant prose rather than a condition, source or hypothetical label.

## Writer fact sheet

Original — `facts.md` still describes a categorical shorter-notice-clause invalidity claim that is absent from the draft; says subletting priority was not stated although the draft now says the Civil Code proviso does not bypass written consent; and describes the old “commonly used” postal sentence instead of the current Article 34 definition.

→ Problem and reason — It is an outdated claim map and cannot substantiate the current revision. These inconsistencies were not used to manufacture additional legal rules or to reject facts that the actual official sources support.

→ Fix required — Reconcile the fact sheet with the final corrected four-language text and its current sources. Do not restore deleted claims just to make the draft match the old sheet.

→ Facts preserved — Preserve verified current claims and their real statutory qualifications; remove stale descriptions from the internal sheet. No edit applied. This housekeeping issue is additional to, not the basis for, L1–L3.

## Minor edits applied

None. All four draft files remain byte-for-byte identical to their reviewed snapshots. The reviewer created only this log and its evidence files. The proposed wording changes are required or suggested directions, not completed edits; no legal fact, number, citation, or image was changed.

## Image verdict

OK — actually viewed `/Users/son7/tseng-col-1013-work/images/C4.webp` with the image tool. It is a valid 1,280 × 720 WebP, 27,912 bytes. It shows an anonymous residential interior with packed boxes, a rolled mat, slippers and a plant. The scene fits moving out of a rental home and is respectful. There are no people/faces, readable text or documents, logos, flags or identifying details. It is suitable as the supplied fictional illustration; no actual person or property is identified. Production provenance cannot be inferred from pixels alone.

The previous missing-WebP finding is resolved: this review inspected the requested WebP itself, not just the JPEG. No regeneration is requested. SHA-256: `cee6a9e6a0c2d8bb0840f2413c7be503ad65dd829e7167771f7c023ac6627ff6`.

VERDICT: FIX      (major issues remain; listed in the log)
