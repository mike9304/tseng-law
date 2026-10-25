# Existing Hindi columns — targeted style repair

Date: 2026-10-25. Repair author: `/root/repair_existing_hi` (AI editorial role). Independent reviewer: `/root/recheck_market_changes`. This is an author self-check and frozen-version handoff, not an independent approval or publication claim.

Ownership: only `src/content/columns-hi/669-*.md`, `670-*.md`, `672-*.md`, `673-*.md` in `/Users/son7/tseng-case-trends-20261025/repo`, plus these `existing-hi-repair-*` records. Other agents’ changes were preserved. No commit, push or deployment performed.

## Inputs and boundary

- Read the complete current four manuscripts, their `a188e620 → HEAD` diffs, repo `EDITORIAL-VOICE.md`, shared `SENTENCE-VARIETY-RULE.md`, `LESSONS.md`, and `COLUMN-VOICE-RULE.md` plus the editorial skill and review criteria. The home voice alias is missing on this machine; the current repository copy was read as AGENTS.md expressly permits.
- Read the prior independent Hindi report at `/Users/son7/tseng-arc-revision-20261024/work/reviews/market-hi-independent.md`, including H-F1 and H-F2. Neither the mandatory deemed-acceptance consequence nor the dedicated-purpose government institution qualification was weakened.
- Reviewer identified no material legal change in the current historical diff and supplied the specific rhythm regressions. This repair addresses those passages; it does not certify all historical changes.
- The first repair passed 672. The second and final targeted repair passed 669, 670 and 673. No third attempt, filler warning, invented scenario or metric-only punctuation change was used.

## Frozen hashes

| ID | Before SHA256 | Final SHA256 | Repair passes |
|---|---|---|---|
| 669 | `2aedb05871c6f5c5d561e33786740a54e179932a6aaba9fb7dce9822e0efa48e` | `81a291e8a6e4fe627ef088aaef1db7cff07ff9728d893b6a51f4f993cd3704a3` | 2 |
| 670 | `06a92c0a8939a853b7131b8f30e5797f29c2b61563852c858002dbf11e0f667d` | `b85718d854d5b9887aed2613a01585c8f72d6f23fae977d21c2feff4cd3dcb57` | 2 |
| 672 | `e11b8bc0b1bef8ebd64907e0e9226823953ee1d0d544dcc281b126617f1d93f6` | `3973fb9f67f20198b09f191293062e701ef8430913a06b4d6403911bb38e10ee` | 1 |
| 673 | `40bf733c1bd926171ecd716e2b91246a34828e6dd9b8c77dad37344a264f0b37` | `7568b307e743bb799e899a9b3a11f32de846c8b0fa00d271755989066c8c98c9` | 2 |

Initial checkout HEAD: `ef3b24e73d84968eea08ea9d58e991ccbbf83fa8`. Exact source paths and command arrays are in `existing-hi-repair-checks-final.json`.

## Changed passages and preservation reasons

Every exact intermediate before/after passage is in `existing-hi-repair-passages-r1.json` and `existing-hi-repair-passages-r2.json`. The complete final before/after comparison is `existing-hi-repair-final.diff`. These records retain the original wording rather than merely naming the changes.

| File:line | Exact span / final direction | Problem and reason | Meaning preserved |
|---|---|---|---|
| 669:27 | `इसलिए हर बिल की तय भुगतान तारीख मायने रखती है।` → `हर बिल की तय भुगतान तारीख लिखें।` | Abstract importance wording became the actual record the supplier needs; surrounding limitation/accrual rules are untouched. | Yes. Same agreed payment date; no period or starting point changed. |
| 669:35 | `साथ में हर राशि की मुद्रा भी` → `हर राशि की मुद्रा भी लिखें।` | Currency was buried in a long balance calculation. It is a distinct accounting field, so it has its own concise sentence. | Yes. Original price, received payment, credit note, disputed deduction, balance and currency all remain. |
| 669:37 | `छह महीने की मोहलत` → `छह महीने की शर्त` | “Grace period” can suggest an unconditional extension. The heading now names the six-month condition already explained by Article 130. | Yes; six months remains, and the full legal paragraph is unchanged. |
| 669:63 | `संभालकर रखना उपयोगी है` / `रहे तो बेहतर है` → `बैंक रिकॉर्ड बचाएँ` / separate known-source list and `अनुमान को अनुमान ही लिखें।` | Removed two layers of advisory padding and separated records from uncertain information. | Yes. Prior payments, goods location, known incoming-funds sources, adviser audience and uncertainty label remain; Indian-law boundary untouched. |
| 670:33 | Machine identification and delivery/test dates separated; `कारण अस्पष्ट हो तो बताएँ। अनुमानित डिजाइन दोष को तथ्य न बनाएँ।` | One long instruction had combined identity, dates and uncertainty. Identification, actual test conditions and uncertain cause now remain distinct without an extra warning. | Yes. Serial/order number, both dates, output/tolerance/speed, actual measurement, material/settings/power and no assumption of established design defect remain. |
| 670:35 | `पूरी ईमेल शृंखला बचाएँ।` | The complete chain is distinct from the sent notice, its attachments and receipt record. | Yes. All four records retained; contractual recipient/method and correct seller cautions unchanged. |
| 670:37 | `धारा 356 निरीक्षण के लिए` → `निरीक्षण के लिए धारा 356` | Third paragraph opening with धारा broke the repetition limit. Inspection is the reader’s subject here. | Yes. Only word order changed; prompt inspection, both notice-failure branches, mandatory consequence and concealment exception are intact. |
| 670:41 | Evidence list connected to its function; `हर रिकॉर्ड अलग रहे।` | Earlier prose repeated similarly sized record instructions. The photos/video/logs/signed sheet now directly explain how timing and changes are reconstructed, followed by the separate storage instruction. | Yes. Port arrival, factory unloading, installation, commissioning and every evidence type retained. No new proof presumption. |
| 670:61 | `तब तक ... संभालकर रखना काम आएगा।` → `परीक्षण में बदले पुर्जों की सूची बचाएँ।` | Generic usefulness padding hid the useful final action. | Yes. Test-replaced parts list retained; consultation languages, secure technical-file handling and engagement boundaries unchanged. |
| 672:47 | Separate comparison photos, same-angle explanation, `मीटर रीडिंग की तारीख भी दर्ज हो।`, and keys/access cards record | The long combined instruction hid the date and recipient/count fields. | Yes. Photos at entry/return; wall/floor/furniture/equipment; same angle; dated meter reading; returned keys/cards count and recipient; disputed items and Chinese-language comprehension all retained. |
| 672:57 | `हिसाब छोटा ही रहे` removed; `मूल रकम NT$ में लिखें।` | A statement about the writing shape added little. Actual agreed deductions and currency remain useful distinct fields. | Yes. Deposit less agreed debt, disputed items, NT$ and partial-refund waiver inquiry remain. |
| 673:27 | `पहला फ़ोन ... जाना चाहिए:` → immediate bank notification plus transfer/recall question; `जिम्मेदारी तय होने तक संपर्क न टालें।` | Replaced a long noun list with two concrete actions; removed the prediction that responsibility will later be resolved. | Yes. Immediate bank contact, suspected fraud, transfer details, available recall action, reference/answer preservation and no delay pending liability resolution remain. |
| 673:35 | `ईमेल का display name निर्णायक नहीं है।` | Reduced padding around a precise proof limitation. | Yes. Does not make a display name conclusive. Article 310 creditor-approval and actual-benefit branches remain verbatim. |
| 673:37 | `अनुबंध का governing-law clause पहले देखें।` | A third ताइवान paragraph start repeated the established jurisdiction question. The contract document now leads the sentence. | Yes. Article 20 choice/closest-connection rules and separate Indian advice remain verbatim. |
| 673:41 | `दोनों बिल अलग रखें।` / source and receipt time / `पुरानी फ़ाइल को overwrite न करें।` | Invoice preservation, provenance and non-overwriting are separate actions; they had been compressed into a similar-length explanatory sentence. | Yes. Both originals/changed invoices, each version’s source/time and the original-file preservation rule remain. No new legal duty asserted. |
| 673:64 | `ईमेल से प्रतिनिधित्व अपने-आप शुरू नहीं होता।` followed by secure later delivery of requested bank records | Engagement status and document transmission are different boundaries. Both read more clearly as their own sentences. | Yes. Same non-automatic engagement, later request and secure delivery conditions. |

## Actual CLI results

Command for each exact file: `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <absolute-file> --lang hi`. Full command/output/exit and frozen source text are in `existing-hi-repair-checks-final.json`.

| ID | Sentences | CV before → final | Final short share | Final run3 | Exit / result |
|---|---:|---|---:|---:|---|
| 669 | 45 | .435 → .453 | .200 | .023 | 0 / `OK — no variety limit violated` |
| 670 | 53 | .354 → .457 | .151 | .059 | 0 / `OK — no variety limit violated` |
| 672 | 52 | .429 → .454 | .154 | .060 | 0 / `OK — no variety limit violated` |
| 673 | 49 | .387 → .471 | .245 | .021 | 0 / `OK — no variety limit violated` |

`git diff --check -- <the four owned paths>` also exited 0 with no output. No code/build or public verification is claimed by this manuscript-only worker.

## Preservation checks

All four files passed exact programmatic equality checks for (1) frontmatter excluding lastmod, (2) ordered Markdown URL sequence, and (3) ordered numeric tokens in the body. All were free of bold markup. FAQ, title/summary/SEO title, published/date_display, internal author, image path/alt/caption and all other metadata remain byte-identical to the repair-start versions. Only `lastmod` became `2026-10-25`. Prior source-review dates were not upgraded to imply a new complete legal audit.

Written-out time periods and conditional meanings were also read manually: 669 two years/accrual/six months/three months/20 days and provisional-attachment criteria unchanged; 670 prompt inspection/notice, mandatory deemed acceptance, deliberate concealment, six months/five years and generic-goods replacement unchanged; 672 two months/under 30 days, dedicated government-body exception, return/deduction/handover conditions unchanged; 673 actual creditor/authorized recipient and Article 310 alternatives unchanged. The six-month heading still says six months.

## Targeted current official checks

Official pages actually opened on 2026-10-25 for the wording-sensitive safeguards. This is a bounded check, not a replacement for the independent final review of every claim:
- [Civil Code 130](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=130): the demand-based interruption is treated as not having occurred if proceedings are not brought within six months. Supports the conditional heading wording.
- [Civil Code 356](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=356): ordinary prompt inspection, immediate notice, ordinary-inspection latent-defect exception and later-discovery notice/deemed-acceptance rule. The operative consequence in the manuscript remains mandatory.
- [Rental Housing Act 4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060125&flno=4): the government-established body/institution exception is expressly dedicated-purpose. The already-correct FAQ and body were untouched.
The Civil Code page-wide pending-commencement banner concerns Articles 166-1 and 1223, not the two operative provisions checked here.

## Section 5 author self-check

1. Real CLI on all four: exit 0 and FAIL 0, with final hashes above. This is not a language-quality verdict by itself.
2. Openings remain distinct: 669 limitation period; 670 immediate technical-notice question; 672 one expressly hypothetical departure/handover scenario; 673 actual conditional bank-contact problem. No stock hypothetical first phrase was introduced.
3. Each keeps multiple meaningful short sentences: currency/complete message (669), uncertain cause/full email chain/parts list (670), dated meter reading/currency (672), bank notification/display name/original-file preservation (673). The longer 670 evidence sentence is followed by the related short preservation instruction.
4. Paragraph starts were read vertically. No start exceeds the actual tool limit; 670’s third धारा and 673’s third ताइवान start were removed by moving the reader’s document or action first.
5. Citation-free practical paragraphs remain. The edits did not create three consecutive claim–citation–caveat paragraphs; no source link was removed or moved to a different claim.
6. No new rhetorical contradiction or unasked rebuttal was added. Display-name, governing-law, deemed-acceptance and scope distinctions are actual legal/record questions, not decorative contrast.
7. Endings still identify the relevant final material: agreed payment/last-demand dates, replaced-parts list, agreed/disputed deposit deductions, and original/changed invoices. No new sales ending or success guarantee.
8. Professional Hindi remains. Necessary concrete instructions are retained without turning headings into checklists. No bold, fabricated experience, named private party, public author, human-native review or lawyer-review claim.
9. Exact URL and numeric token preservation plus manual reading of conditions and written-out periods completed. Existing images/FAQ unchanged.

## First-two-paragraph deletion check

- 669: opening states the possible two-year period, the Taiwan-law sale-price scope, accrual and agreed due-date record. Paragraph two supplies valid choice/closest connection and limitation law. Deleting them loses necessary conditions. The last sentence now names the needed date directly.
- 670: opening answers whether to wait for the final test report and preserves inspection/notice duties. Paragraph two limits the discussion to Taiwan-governed sales and distinguishes mixed installation/design contracts and Indian regulatory questions. Both retained.
- 672: the expressly hypothetical departure/deposit scene identifies why termination and handover records are needed; paragraph two supplies the deposit cap and return/deduction conditions. Both unchanged.
- 673: opening gives immediate bank contact, transfer identification, recall inquiry and preservation before allocation of loss. Paragraph two supplies the Indian reporting route and no-freeze/refund-guarantee limitation. Both remain substantive; only opening padding was shortened.

## Three recent Hindi comparator reads

Compared actual openings, headings and final substantive paragraphs of these current manuscripts, each with `published: 2026-10-24` (metadata date, not a new independent publication-time determination):

| Comparator | Observation | Distinction from the repaired four |
|---|---|---|
| `src/content/columns-hi/704-taiwan-arc-first-application.md` | Starts with a 30-day duty and its starting point; route/fee/card headings; ends with card details and date records. | 669 also opens with a concrete period, but immediately anchors sale-price accrual and invoice-specific records rather than copying the immigration sequence. |
| `src/content/columns-hi/705-taiwan-visa-residence-work-study-family.md` | Starts with a direct route question, then entry-purpose scope; headings follow residence bases; ending asks for the correct mission’s document list. | 670’s question concerns immediate seller notice, then testing evidence and contractual remedies, so its question opening does not reproduce the route-comparison structure. |
| `src/content/columns-hi/706-taiwan-arc-renewal-changes-reentry.md` | Starts from changed work/study/family facts; separates renewal, record change and residence-basis change; final action records event/card/travel dates. | 672 uses one explicitly hypothetical handover scene, while 673 begins with urgent bank contact. Their endings retain deposit deductions and invoice versions rather than a shared generic checklist. |

Comparators were not edited. Their source claims, public layout and full legal validity are outside this narrow repair.

## Handoff

Final hashes and evidence sent to `/root` and `/root/recheck_market_changes`. Manuscripts are frozen pending independent review. No unresolved author-side CLI or preservation finding remains; the independent reviewer may still identify a substantive or linguistic issue. This author does not certify its own independent approval, native-human review, legal licensure, deployment or browser QA.
