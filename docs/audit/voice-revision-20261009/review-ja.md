# Independent Japanese voice review — articles 495 and 496

## Current decision: PASS — all round-1 findings resolved

| Article | Final reviewed staged path | Latest reviewed SHA-256 | Current decision |
|---|---|---|---|
| 495 | `work/voice-revision/staged/src/content/columns-ja/495-taiwan-ai-poc-additional-testing-commercial-order-japanese.md` | `0c87876d9782110fd38e5583864534fd21b1664884225afb236636fabe118ab6` | PASS |
| 496 | `work/voice-revision/staged/src/content/columns-ja/496-taiwan-semiconductor-equipment-order-cancellation-costs-japanese.md` | `bca4c14cbe9911483793a9ba839ee78d3cbafdbc9a6c0e9a707a8c92ce7e45d4` | PASS |

No unresolved material locale-review issues remain for these hashes. The REQUEST_CHANGES entries below are retained history for superseded versions; every finding was resolved and reread, as recorded under “Repair verification and final decisions.” This editorial PASS is not a deployment claim or a human/attorney certification.

### October 10 metadata-only equivalence binding

Date-binding review: 2026-10-10 (Asia/Taipei). Root authorized changing the actual revision date from `lastmod: "2026-10-09"` to `lastmod: "2026-10-10"` after the date rollover. I independently read the bytes of both staged Japanese files, confirmed exactly one new lastmod line in each, reversed only that field in memory, and calculated the restored SHA-256. Both restored hashes exactly match my sealed October 9 PASS versions below. The resulting new hashes in the current PASS table also match the 495/496 rows of `work/voice-revision/date-equivalence.json`.

| Article | Sealed pre-date-change SHA-256 | SHA-256 after reversing only lastmod | Reverse-date exact match |
|---|---|---|---|
| 495 | `98ff38b6c6487c2e670eac443f8d490fbf8d2001cbdd04ec457e526a24ead2b3` | `98ff38b6c6487c2e670eac443f8d490fbf8d2001cbdd04ec457e526a24ead2b3` | true |
| 496 | `b5840946fed055f691b142b5d2bf6b1f84bfd60d93d017d2b3d1bc31e675c73d` | `b5840946fed055f691b142b5d2bf6b1f84bfd60d93d017d2b3d1bc31e675c73d` | true |

This proves byte-for-byte preservation of the body and all other metadata, including `published`, `date_display`, internal author and source-check dates. The October 9 prose/legal review is carried forward solely by this verified equivalence; no new prose/legal review or source-date update is claimed. Manuscripts were not modified by this reviewer. The new current hashes above supersede only the file-level hashes in the historical October 9 final-decision table below.

Review date: 2026-10-09 (Asia/Taipei). Reviewer: manually loaded `tseng-editor-ja` AI editorial specialist, independent of both authors. I did not draft or edit either manuscript. This is editorial and bounded legal-preservation review, not a claim of human native-speaker or attorney certification. Manuscripts remained read-only; this report is my only owned file.

Read in full: shared editorial skill and `references/review-criteria.md`, the frozen repository's `docs/columns/EDITORIAL-VOICE.md`, both published originals, both revised texts, and the three recent Japanese comparators below. The writer's self-review was read only after the revised manuscripts and was not treated as independent certification.

## Historical round 1 decisions — resolved, superseded by current PASS above

| Article | Reviewed staged path | SHA-256 | Decision |
|---|---|---|---|
| 495 | `work/voice-revision/staged/src/content/columns-ja/495-taiwan-ai-poc-additional-testing-commercial-order-japanese.md` | `36e6cfc598a3e76e9c7971e8a561e7ff2f7a8e02e726e747c0ea56a8470382ad` | REQUEST_CHANGES |
| 496 | `work/voice-revision/staged/src/content/columns-ja/496-taiwan-semiconductor-equipment-order-cancellation-costs-japanese.md` | `d28b259f78e0541635e0570f5a75478d2d69de5921c060d1b3b9068b82515b85` | REQUEST_CHANGES |

The revisions improve the commercial sequence and identify the payer more clearly. They do not yet pass simply because imperative endings have been reduced. Some original instructions became longer explanations of why the reader should follow instructions, without adding useful information. Article 496 also makes one practical accounting observation unnecessarily absolute. These are bounded repairs, not a request to rewrite every paragraph again.

## Required repairs and exact observations

Line references below identify the reviewed round-1 staged files. Proposed text is editorial advice; the author owns implementation and must preserve the surrounding qualifications.

| File:line | Exact reviewed sentence | Reason | Proposed rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| 495:29 | 契約書と仕様書に、試験する品種、使用するデータ、試験環境、調整回数、提出する報告を記載するのは、作業量を数えるためだけではありません。何をすれば契約上の仕事を果たしたといえるかを、双方で共有するためです。 | This doubles the instruction with a generic contrast and purpose. The useful point is how the reader decides whether the later request belongs to the already priced trial. | 契約書と仕様書に試験する品種、使用するデータ、試験環境、調整回数、提出する報告を定めておけば、追加の依頼がその範囲に含まれるかを比べられます。 | Yes. Same work-scope items and documents, no new entitlement or formal writing requirement. Keep the following customer-delay and approval arrangements. |
| 495:49 | 報酬を精算しても、データや利用権限がどこまで残るのか分からなければ、契約上の後始末は残るからです。 | Repeats the immediately preceding return/deletion/account-closing sentence, while the vague phrase 後始末 adds no decision-relevant content. | Delete this sentence; retain the records, stop date and contractual return/deletion/account provisions before it. | Yes. No operative clause, exception or legal condition is lost. |
| 496:27 | 「準備してほしい」という一言から、際限なく調達を進めてよいとは読み取れないからです。 | Repeats the paragraph's earlier scope/amount/cancellation allocation and the L23 discussion of the preparation request. It adds an inflated caution after the point has been made. | Delete this sentence. | Yes. Earlier sentences still limit the inquiry to the actual agreement, identify the procurement cap and cancellation allocation, and avoid presuming a purchase obligation. |
| 496:52 | 予定利益を請求する場合にも、原価の内訳がなければ売上と利益を区別できません。 | The original asked the reader not to confuse sales and profit and to retain cost records. This now says the concepts cannot be distinguished without an itemized cost breakdown; that is broader than the original and needlessly categorical. | 予定利益の計算には、売上見込みと原価の内訳が必要になります。 | Yes as a correction back to the original practical calculation context. This is not a new statutory documentary prerequisite and must not be described as one. The Civil Code 216/216-1 qualifications remain. |

One additional tightening was recommended at 495:17: `試験を続けてほしいという現場の要望と、その費用を顧客が支払う合意は、同時に確かめたいところです。依頼した技術者が、追加料金まで承認できる立場とは限らないからです。` can become `試験を依頼した技術者が、追加料金まで承認できる立場とは限りません。` The vague wish to check matters simultaneously adds less than the concrete authority problem. This is not an assertion that the actual customer's technician lacks authority.

## Before → problem → revised observation → preserved meaning

The following compares the original published manuscript to round 1. It records actual improvements as well as unresolved problems; it is not a word-count or forbidden-word pass.

### 495

| Before | Problem | Revised observation | Preserved facts/conditions |
|---|---|---|---|
| 日本のAI開発会社や装置メーカーは、見積書、試験計画、依頼のメールを突き合わせ、追加作業を引き受ける前に対象と費用を確かめます。 | A document-reading instruction follows the opening without saying why the estimate alone may be insufficient. | L15: 見積書では品種を限定していても、試験計画やメールで対象を広げていれば、見積書だけでは費用負担を判断できません。 The conditional disagreement makes the document comparison intelligible. | The agreement's scope governs; no single document is declared dispositive. The scenario is expressly conditional. |
| 報告書を出せば終わるのか、性能未達なら調整を続けるのかを、契約書と仕様書でそろえます。 | Compresses two different promised performances into a procedural instruction. | L25 explains the difference between reporting a trial and producing agreed performance, then the possibility that the parties see a later test differently. | Neither trial reporting nor performance achievement is presumed as the default obligation; contract classification remains fact-dependent. |
| 契約案では、試験する品種、使用するデータ、試験環境、調整回数、提出する報告を具体化できます。 | Relevant detail, but another item list in a succession of contract-writing instructions. | L29 retained all items but added an abstract “not only counting work” contrast. Required repair above gives those same items a concrete comparison purpose. | All listed performance variables, customer data/time delay and approval provisions are retained. |
| PoCを低額で受け、後の量産販売で開発費を回収する計画なら、不採用時にその費用をどう扱うかも交渉事項です。 | A central commercial risk appeared too late, immediately before the CTA. | L35–39 now develops production-adoption pricing before describing payment timing under remunerated mandate. | Payment regardless of adoption and crediting to purchase price remain negotiated alternatives, not statutory guarantees. |

### 496

| Before | Problem | Revised observation | Preserved facts/conditions |
|---|---|---|---|
| 台湾の顧客から半導体装置の製作中止を告げられても、既に発注した専用部材の代金まで支払わずに済むとは限りません。 | The payer is not explicit, so the reader may briefly think this means the Taiwanese customer's debt. | L15 names `日本のメーカー` and follows with the distinction between customer and supplier contracts. | No automatic supplier release and no automatic customer reimbursement are claimed; L17 expressly denies automatic recovery. |
| 承攬人の損害賠償請求権について、…原因発生後1年間行使しないと消滅する規定があります。 | The time-sensitive issue came after the proposed next-contract terms. | L37 now places the same one-year limitation alongside the current cancellation response. | Article 514(2), the contractor's claim, cause-based starting point and need to check legal basis/type remain; it does not become a universal one-year period for equipment claims. |
| 請求を検討する際は、次のように費用と記録を分けます。 | Generic preparation lead-in detached from the cost differences. | L43 contrasts customer-specific parts, reusable stock and supplier cancellation before the table. | Costs remain examples for evaluation, not assured awards. The table keeps the same four categories and evidence. |
| 予定利益を検討する場合も、売上と利益を混同せず、原価の内訳を残します。 | Useful caution stated as another instruction. | L52 changed this into an overbroad impossibility statement. Required repair narrows it to calculation, rather than approving a stronger proposition merely because it reads assertively. | No stricter proof rule or new statute-based document requirement is accepted. |

## Independent first-two-paragraph deletion test

Tests refer to round-1 paragraphs, excluding metadata. Each sentence was considered separately, not just the paragraph as a unit.

### 495

1. `台湾の工場でAI検査の試験を終えた後、…その試験まで当初の料金に含まれるのでしょうか。` Keep the scenario. It identifies a later request after the original trial and the disputed fee, not merely an AI trend. The question form is dispensable stylistically, but deleting the scenario would make the next estimate limitation abrupt.
2. `見積書では品種を限定していても、試験計画やメールで対象を広げていれば、見積書だけでは費用負担を判断できません。` Keep. Deletion loses a concrete reason for reading more than the initial estimate, conditioned on later scope expansion.
3. `別の製品の画像を集め直すには時間がかかりますし、他工場へ移れば照明条件に合わせた調整も必要になります。` Keep. This supplies the actual additional work behind the new test, including both image collection and changed lighting.
4. `試験を続けてほしいという現場の要望と、その費用を顧客が支払う合意は、同時に確かめたいところです。` Delete/merge with sentence 5. On its own it adds a vague recommended stance; the concrete authority distinction in the following sentence supplies the substance.
5. `依頼した技術者が、追加料金まで承認できる立場とは限らないからです。` Retain as a standalone sentence after removing the causal ending. It supplies the actor-specific reason a request does not settle payment.

### 496

1. `台湾の顧客からAI検査機や特注治具の製作を止めるよう言われても、日本のメーカーが既に発注した専用部材の代金まで消えるわけではありません。` Keep. Deletion loses the product, manufacturer and outstanding supplier payment problem.
2. `顧客との契約がどう終わるかと、仕入先への注文を取り消せるかは、それぞれの契約の問題です。` Keep. It explains the two contracts without assuming either contract's terms. It supplies a legal/commercial distinction, not just a second statement that a bill exists.
3. `部材を買った事実があっても、その代金を顧客に請求できるとは限りません。` Keep. It prevents supplier-facing exposure from being confused with a recoverable amount against the customer.
4. `顧客から確定注文を受けていたのか、どの仕様で製作する約束だったのか、先行調達を求めたのは誰か。` Keep. This adds the facts needed to understand the order-formation section; the elliptical question is grammatical and has a clear referent.
5. `注文に至るやり取りによって、同じ支出でも顧客に負担を求める根拠が変わるためです。` Keep. This explicitly connects the factual alternatives to the recovery issue. Unlike the redundant L27 ending, it adds the reason for the immediately preceding questions at their first introduction.

## Comparison with three recent Japanese firm articles

All three were read in full from `work/tseng-publication-20261008/`; all have published/lastmod `2026-10-08`. These are the latest other Japanese articles accessible in the frozen checkout. All three comparators exist; none is fabricated or unavailable. They are comparison evidence, not endorsed templates.

| Comparator path in frozen repository | Concrete evidence | Comparison with 495/496 |
|---|---|---|
| `src/content/columns-ja/436-taiwan-shoplifting-found-property-japanese.md` | Opening compares remembered payment with receipts/transaction records. Later paragraphs start `通訳の希望を伝えます` and `届けた記録を残します`. End focuses on return travel and records. | 495 starts with a conflict between an initial fee and a later test; 496 distinguishes two contracts. The old procedural sentence pattern was not an adequate model. The current repairs remove additional task-management commentary rather than copying it. |
| `src/content/columns-ja/435-taiwan-sexual-assault-medical-reporting-japanese.md` | Direct first sentence answers whether medical care is available before deciding to report. Headings track examination, notification, accompaniment and complaint rules. Ends with protections and returning home, without repeating every section. | 495/496 have direct transaction questions and distinct commercial developments. The body sections do not reuse this comparator's procedure sequence. Legal limitations remain beside the relevant proposition, rather than being confined to a generic footer. |
| `src/content/columns-ja/434-taiwan-search-warrant-consent-home-office-japanese.md` | Begins with actual contents of a search warrant. Detached `住所だけでなく範囲を見ます` and `同意の範囲を確かめます` are instruction fragments. Closing is an equipment/record response and link. | Both revised openings add usable facts. 495's work/payment/termination sequence and 496's order/cancellation/loss/future terms sequence differ from one another; no universal five-step layout was imposed. A CTA is short and appears only once in each, but is not used to compensate for thin analysis. |

The two requested articles use the same source-section format because they cite overlapping civil-law provisions. The actual bodies have different section counts and reasoning paths. Article 496's table is retained because it compares different cost classes and evidence; it is not a decorative checklist added to every article.

## Bounded legal-preservation and source review

Directly reopened on 2026-10-09:

- [Taiwan Civil Code article 548](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=548): remunerated mandate; contrary agreement exception; BOTH termination and clear report before requesting payment; separate non-attributable early termination rule.
- [Article 549](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=549): either party may terminate; unfavorable timing can produce damages; exception requires non-attributable circumstances forcing termination.
- [Article 514](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=514): paragraph 2 retains the contractor's damages/termination right and one-year nonexercise period from the cause arising. The column deals with the damages claim, not a universal deadline for every contract.

The site's partial-non-effective banner identifies articles 166-1 and 1223; it is not evidence that 548, 549 or 514 are pending. The shown compilation cutoff is October 2, 2026. This is a bounded source recheck, not an assurance about all unpublished developments. The writer separately documented a broader same-day source check; I did not treat that as my independent legal certification. The final legal reviewer must assess the actual frozen revisions.

In the full-text comparison, the following were preserved: Taiwan-law applicability and no assumption from counterparty nationality; express/implied agreement; sale versus 承攬/委任 distinctions and mixed-contract uncertainty; 548's conditions; 549's exception; 511's pre-completion ending and damages; no automatic commercial order from PoC acceptance; no uniform statutory PoC fee. In 496, the law/contract exception and lost-profit scope in 216, same-cause benefit deduction in 216-1, all three baseline setoff conditions and nature/agreement limits in 334, excessive-penalty reduction in 252, and the limited 514(2) period remain explicit.

The retained consultation links assert no foreign office, foreign-law licensure or guaranteed outcome. There are no invented cases, identities or personal experience claims. The conditional examples remain examples. Internal `author: legal-ai-assistant`, dates, citations and disclaimers are preserved. No public AI byline or decorative bold was added. The final round must verify exact repaired hashes and source/metadata equality; this report is not publication permission.

## Repair verification and final decisions

The author made the four required repairs and the 495 opening tightening. The latter was initially offered as an additional change, then required after the independent opening deletion test confirmed that it supplied no additional information. The coordinator expressly authorized that final sentence-level repair. No manuscript was edited by this reviewer.

The repaired passages were read again within their surrounding sections, not accepted from the author's report alone. The final 495 opening now has four sentences across its first two paragraphs. The fee scenario, estimate limitation and concrete additional work remain; the fourth sentence is `試験を依頼した技術者が、追加料金まで承認できる立場とは限りません。` Removing it would lose the approval-authority issue. The redundant preference sentence is gone. The five opening sentences in 496 remain unchanged and retain the distinct information identified in the independent deletion test above.

495:29 now ties the specified work directly to comparing a later request against the agreed scope. 495:49 ends with actual records and closing arrangements without adding the vague “後始末” rationale. 496:27 ends after the agreed scope/amount/cancellation arrangement. 496:52 now speaks specifically about calculating expected profit, without claiming that sales and profits cannot be conceptually distinguished without itemized records. No new evidentiary condition is attributed to the statute.

| Article | Final reviewed staged path | Final SHA-256 | Decision |
|---|---|---|---|
| 495 | `work/voice-revision/staged/src/content/columns-ja/495-taiwan-ai-poc-additional-testing-commercial-order-japanese.md` | `98ff38b6c6487c2e670eac443f8d490fbf8d2001cbdd04ec457e526a24ead2b3` | PASS |
| 496 | `work/voice-revision/staged/src/content/columns-ja/496-taiwan-semiconductor-equipment-order-cancellation-costs-japanese.md` | `b5840946fed055f691b142b5d2bf6b1f84bfd60d93d017d2b3d1bc31e675c73d` | PASS |

Verified from the actual final files: all frontmatter except the authorized title and summary changes equals the published originals; source URL sets match exactly; internal author and publication/legal-check dates remain; no Markdown or HTML decorative bold is present. The revised legal passages continue to preserve the conditions, exceptions and numerical period listed above. The report's earlier REQUEST_CHANGES verdicts remain as history and apply only to their listed earlier hashes.

The final texts read as explanations of two particular commercial disputes. They still contain contract terms and some necessary preparation advice, but the headings and paragraphs no longer form a repeated series of isolated instructions or generic justifications. The judgment follows the sentence and sequence review recorded here, not AI detection, a numerical score or a list of banned phrases.

Unresolved material locale-review issues: none for the two final hashes. Remaining evidence limits: this AI editorial review is not human-native or attorney certification, and the bounded official-source recheck has the displayed compilation cutoff noted above. The next step is the separately assigned independent final legal review of these exact hashes, followed by the root's authorized release procedure. PASS does not itself claim deployment or grant publication authorization.
