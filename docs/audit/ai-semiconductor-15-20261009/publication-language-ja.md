# Integrated Japanese publication manuscripts: independent language review

Full language review date: 2026-10-08 (Asia/Seoul). Metadata-only addendum: 2026-10-09 (Asia/Taipei).
Reviewer: independent AI Japanese editorial specialist. Manually loaded `tseng-editor-ja` developer instructions and the shared `tseng-law-editorial` skill/review criteria were reapplied. The current worktree `docs/columns/EDITORIAL-VOICE.md` was read in full. This reviewer authored neither manuscript; no human native-speaker or attorney certification is claimed.

Worktree: `/Users/son7/Documents/Codex/2026-10-08/new-chat/work/tseng-publication-20261008`.
Owned writable file: this report only. Repository, manuscripts and other agents' records remain read-only. No third-party contact, publication or deployment was performed by this reviewer.

## CURRENT PASS — October 9 metadata-only freeze

| Repo-relative target | SHA256 | Verdict |
|---|---|---|
| `src/content/columns-ja/495-taiwan-ai-poc-additional-testing-commercial-order-japanese.md` | `6b843176e3c4657a2d96ee1143f403b0b149003ba6a6d8f799b2f196f040b652` | PASS |
| `src/content/columns-ja/496-taiwan-semiconductor-equipment-order-cancellation-costs-japanese.md` | `27d9d76061fdf3ea38cee0a67b53c47ddbe3979d1eb7a5f275482c0d8c88878e` | PASS |

### October 9 addendum: bounded verification

The two actual worktree files were read as bytes and their complete SHA-256 hashes were checked against both `work/publication-date-adjustment.json` and `work/publication-integration-manifest.json`. Each current hash matches both manifests.

Only these front-matter fields were reversed in memory for comparison: `published: "2026-10-09"` to `2026-10-08`, `lastmod: "2026-10-09"` to `2026-10-08`, and `date_display: "2026年10月9日"` to `2026年10月8日`. Each field occurred exactly once. The resulting full-file hashes exactly match this reviewer's October 8 frozen versions, establishing that no other metadata, body, source or disclaimer bytes changed. No file was rewritten by the check.

| Article | Full SHA256 after in-memory date reversal | Prior review match | Body SHA256 | Body/manifests match |
|---|---|---|---|---|
| 495 | `870122bb0f627d113cc8808fb0765aeb4870c626460b4474120dacce3ba58568` | Yes | `b24847330de20c4e86a5e24f50396dd9b7d2a5bc42b821020e175da39e378d01` | Yes |
| 496 | `e30bd94eee3263375242bb0562c9647f7479c4b3944df7b1f522521079519fe3` | Yes | `2fe5ff97cc2aec4d051395e78f62a9aeffa45b56f3fbeae5953c651345587ef7` | Yes |

Current Japanese publication display is `2026年10月9日` for both articles. The body still records `法令確認日：2026年10月8日`, preserving the actual legal-source review date. The prior complete language findings therefore remain applicable without reopening the prose or legal research. No manuscript edits and no new required changes. This addendum certifies the date-only transition, not publication or a fresh October 9 substantive-law review.

## HISTORICAL manuscript verdicts — October 8 freeze

| Repo-relative target | SHA256 | Verdict |
|---|---|---|
| `src/content/columns-ja/495-taiwan-ai-poc-additional-testing-commercial-order-japanese.md` | `870122bb0f627d113cc8808fb0765aeb4870c626460b4474120dacce3ba58568` | PASS |
| `src/content/columns-ja/496-taiwan-semiconductor-equipment-order-cancellation-costs-japanese.md` | `e30bd94eee3263375242bb0562c9647f7479c4b3944df7b1f522521079519fe3` | PASS |

Both hashes matched the supplied publication freeze at the start and again after the complete review and author-note readback. The verdict covers the complete integrated body and current metadata, including the new material; it is not copied from the earlier draft verdict. No material language or legal-meaning ambiguity requires repair. Separate legal/factual and release gates remain outside this language certification.

## Integrated title, metadata and CTA — historical October 8 reading

| Field | Article 495 | Article 496 | Assessment |
|---|---|---|---|
| `title` | 台湾顧客とのAI実証実験が終わらない――追加検証費用と量産採用を分ける契約 | 台湾向け半導体装置の発注が取り消されたら――専用部材・製作途中の費用をどう定めるか | Both identify the actual Japanese supplier's transaction and decision. Neither promises a legal result. |
| `seoTitle` | Absent | Absent | Not a missing-content blocker: `src/lib/columns.ts:283–292` confirms fallback to the display title; the column page also uses `post.seoTitle || post.title`. No alternative title was invented or edited. |
| `summary` | 台湾工場でAIの追加試験を求められた日本企業向けに、PoCの作業範囲、追加費用、終了時の精算、量産導入への移行条件を台湾法から整理します。 | 台湾顧客の注文で専用部材を調達した日本の装置メーカー向けに、売買と請負の違い、製作中止後の損害、取消費用の契約と証拠を整理します。 | Faithful to each body; does not imply every extra task or cancellation cost is automatically payable. |
| Dates | `published` and `lastmod`: 2026-10-08; `date_display`: 2026年10月8日 | Same | Consistent Japanese date and legal-review date. These are proposed publication metadata, not proof of a completed deployment. |
| `read_time` | 約7分 | 約7分 | Natural Japanese approximate label. Visible text including source descriptions and disclaimer measures about 2,388 and 2,516 characters respectively after removing link URLs, whitespace and Markdown markers; seven minutes is not materially misleading for these legal articles. No precise reading-speed guarantee is implied. |
| Audience/provenance | `audience: ["ja"]`; internal `author: legal-ai-assistant` | Same | Correct locale and internal provenance; no invented human byline or public AI footer. |
| CTA | Line 52 requests transaction outline, PoC stage and response deadline; asks the reader to confirm sharing arrangements before supplying confidential originals. | Line 65 requests equipment-transaction outline, production stage, cancellation-notice date and response deadline; original drawings and orders follow only after sharing arrangements are confirmed. | Both are short, specific, and consistent with the same-day verified Japanese contact-page intake guidance. No outcome, fee, Japanese office or professional credential is asserted. |

The body has no duplicate Markdown H1 after integration. Both targets contain one contact link and zero prohibited bold-emphasis tokens. Source links and the general-information disclaimer remain present.

## Article 495: full-body review and changed decisions

The reader remains a Japanese AI developer or equipment supplier dealing with a Taiwanese customer. The article does not become a generic AI trend essay or mechanically translate a different market's purchasing role. The Japanese is professional です・ます prose; concrete terms such as 試験計画、仕様書、追加料金、量産注文 and 利用範囲 make the actions intelligible.

The new material at lines 32–34 identifies who prepares images, how many retraining/retesting rounds are included, who can approve extra charges and when to choose termination, extension or a new order. It presents these as contractual choices rather than a rule that every request from a technician binds the company. Lines 38–42 distinguish PoC payment conditions, 委任 remuneration/termination and 承攬 damages. Lines 48–50 separate evaluation acceptance, a later production order, software use and price crediting. No ownership transfer or unrestricted production licence is implied by payment for a PoC.

Taiwan/Japan boundaries are explicit: line 18 states the governing-law premise; line 22 says Taiwan's 承攬 corresponds to Japanese 請負 without identical rules; line 59 reserves Japan-law matters for separate confirmation. “PoCだから委任” is rejected, rather than imported as a Japanese model-contract assumption.

### Opening deletion test, each sentence

| Location and exact sentence | Information lost if removed | Decision |
|---|---|---|
| 495:16 — 台湾の顧客から「別の品種でも試してほしい」と依頼されても、その作業が当初のPoC料金に含まれるかは契約内容によります。 | The actual request and scope/fee issue. | Retain. |
| 495:16 — 日本のAI開発会社や装置メーカーは、見積書、試験計画、依頼のメールを突き合わせ、追加作業を引き受ける前に対象と費用を確かめます。 | The Japanese supplier, evidence to compare and pre-acceptance decision point. | Retain. |
| 495:18 — PoCは実現可能性を確かめる実証実験ですが、その名称だけでは、何を完成させ、どこまで作業する約束かは決まりません。 | PoC definition and the limit of classifying work from its label. | Retain. |
| 495:18 — 本稿は台湾法が契約に適用される場合を扱いますが、台湾企業との取引でも、準拠法は当事者の合意などにより判断します。 | Governing-law premise and the reason a Taiwanese customer does not automatically select Taiwan law. | Retain with the statutory link. The scope condition is not empty introductory rhetoric. |

## Article 496: full-body review and changed decisions

The reader is consistently the Japanese supplier that has placed orders with component vendors. The opening distinguishes that supplier's Taiwanese customer contract from its upstream procurement commitments. Forecast and PO are explained in the next sentences rather than left as unexplained translated jargon. The contract discussion preserves 売買 versus 承攬; Japanese commercial terms describe Taiwanese rules without importing Japanese doctrine.

The new cancellation-stage paragraph at line 36 identifies design approval, manufacture/assembly, cancellable procurement, safety and the date work stops. It does not direct the supplier to abandon performance regardless of its contract. The table's heading and line 42 expressly limit it to a documentation example, not a statutory schedule of guaranteed recoveries.

Lines 51–55 distinguish three different questions: benefits arising from the same causal facts, actual accounting items and duplicate costs, and the counterparty's separate setoff assertion. The article does not equate every refund or possible resale with an automatic deduction; line 53 requires examining the claim basis and cost relationship. It does not equate a claimed delay penalty with an established setoff right. The words 原則的な要件, 債務の性質 and 特約 preserve the limitations of Article 334. The 1-year sentence at line 63 still concerns the specified 承攬人 claim and does not give the same period to every receivable.

### Opening deletion test, each sentence

| Location and exact sentence | Information lost if removed | Decision |
|---|---|---|
| 496:16 — 台湾の顧客から半導体装置の製作中止を告げられても、既に発注した専用部材の代金まで支払わずに済むとは限りません。 | The continuing upstream procurement-cost issue triggered by the customer's stop-work notice. | Retain. This integrated sentence is clear without the earlier draft's awkward double reference to payment. |
| 496:16 — AI検査機や特注治具を供給する日本企業は、顧客との契約と、部材メーカーへの注文を分けて確認する必要があります。 | The Japanese supplier's role and the separate contracts. | Retain. |
| 496:18 — 顧客にどの費用を請求できるかは、確定注文があったか、何を完成・納入する契約か、取消条件をどう定めたかによります。 | Conditions for a recoverable claim rather than assumed reimbursement. | Retain. |
| 496:18 — 本稿は台湾法が適用される場合を扱います。 | The jurisdictional premise. | Retain. |
| 496:18 — 取引相手が台湾企業というだけでは準拠法は決まらず、当事者の合意などを確認します。 | Explanation of the premise and the linked legal basis. | Retain with source. |

## Three recent Japanese comparators

The earlier full-body comparator readings in `work/four-market-language-jp.md` are reused only after byte-for-byte comparison with commit `58e184f648f966438c83b9ce95f0a268323e4894`. All three worktree files are unchanged. They share the latest observed publication date, 2026-10-08; descending number was the prior reproducible tie-break within that same-day group. No comparator was unavailable. These are editorial examples, not legal authorities for the commercial articles.

| Repo-relative comparator | SHA256 / unchanged status | Specific comparison with the integrated manuscripts |
|---|---|---|
| `src/content/columns-ja/436-taiwan-shoplifting-found-property-japanese.md` | `34100024eb1c74fe2f20aff4b3a8b1687e725034efd3c4bf1a942501cfc93d8c` — unchanged | Opens with an actual dispute and records to compare. Both new articles do likewise, then follow their own commercial sequence. Article 495 moves from added tests to approval and payment; 496 moves from order evidence to cancellation and loss. Neither copies the criminal-procedure headings or ending. |
| `src/content/columns-ja/435-taiwan-sexual-assault-medical-reporting-japanese.md` | `35ced5e232ab5a83c1836545086344794612a6085c5573298f044c9339a7d7df` — unchanged | Carefully separates the actor bearing an obligation from other participants and preserves conditions. The new 495 approval paragraph separates technician requests from fee approval; 496 separates deduction of benefits from a debtor's claimed setoff and preserves the actor/claim subject to a deadline. |
| `src/content/columns-ja/434-taiwan-search-warrant-consent-home-office-japanese.md` | `5e20b564b88cd7ee10fe74ef9f9b658b2ff096b4d200e98efb941ef1e16153ab` — unchanged | Defines Taiwanese legal terminology and links company action to the actual rule's scope. Both new articles explain 承攬 and avoid applying it to all equipment sales. They end with a relevant, modest consultation step, not the comparator's unrelated procedural-link structure. |

## Legal-strength spot checks for the new text

These language checks supplement, but do not replace, the separate full legal/factual review.

- The same-day official-text checks recorded in `work/four-market-language-jp.md` support Articles 490, 511, 529, 548, 549, 216 and 514, and the law-selection premise in Article 20. The added Article 511 discussion in 495:42 preserves the conditions that the contract is 承攬 and the work is not yet complete. It retains the obligation to compensate loss caused by termination.
- [民法第216条の1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=216-1) was opened afresh. Article 496:51 preserves the same-causal-facts condition and deduction of the benefit from damages. It does not state that all benefits from any source must be deducted.
- [民法第334条](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=334) was opened afresh. Article 496:55 preserves mutual debts, same-kind performance, maturity and limits based on the debt or agreement. The current paragraph addresses the original counterparties; it does not make claims about an agreement's effect on a good-faith third party.
- [民法第252条](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=252) was opened successfully. The earlier draft-review full-page retrieval limitation is resolved for this integrated review. Article 496:61 correctly uses the court's ability to reduce an excessive penalty without promising automatic reduction or full recovery.
- Source pages' pending-provision notice concerns Articles 166-1 and 1223; it is not applied to the contract rules cited here. Source and manuscript review dates are both 2026-10-08.

## Material findings

No required changes. There is no unresolved material language issue or identified change to legal scope requiring a rewritten sentence. Preference-only changes are not proposed.

| File:line | Exact sentence | Reason and evidence | Proposed rewrite | Legal meaning preserved? |
|---|---|---|---|---|
| Both complete integrated targets | No material defective sentence found. | Full body/metadata review, opening deletion tests, byte-confirmed comparators and new-rule modality checks above. | None. | Yes; manuscripts were not edited. |

## Evidence limits and next bounded step

The completed author note `work/publication-jp-two.md` was read in full after the author supplied its path. Its record of change-order approval, the 委任/承攬 termination split, production-use conditions, cancellation stages, benefit deduction and setoff matches the integrated text. The current-law/history checks, preserved-original hashes and distinct source-output hashes are recorded there. The author's self-check was used as evidence of intent and source coverage, not as independent approval. The actual frozen manuscripts, integration manifest, prior Japanese source ledger and new primary-law passages were read directly. The final target hashes remain unchanged.

No rendered-page, build, production readback or inquiry-submission result is claimed. Hand the frozen targets and this report to the independent final legal reviewer and release owner. Reopen this language review only for a material amendment affecting the reviewed Japanese, then record its replacement hash.
