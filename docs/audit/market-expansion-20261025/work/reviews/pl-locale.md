# PL independent locale review — 940–941

Reviewer: `/root/expand_locale_pl`. Role: locale. Independent of author `/root/expand_author_pl`; this reviewer did not write or edit either manuscript. Checked 25 October 2026. The complete manuscripts, frontmatter, FAQ, alt text and captions were read again after the first repair.

Status: PASS for both exact final source versions below. The final task-local CLI runs each exited 0 with no variety failure; changed prose, metadata/FAQ and actual image files were independently checked. No unresolved material locale finding remains. Earlier CV failures are preserved below. The shared variety CLI still returns exit 2; this PASS uses the independently reviewed task-local method and does not claim global Polish support. Publication is outside this review.

## Versions reviewed

| Source path | Full-file SHA-256 | Image SHA-256 |
| --- | --- | --- |
| `src/content/columns-pl/940-polish-importer-taiwan-invoice-bank-change-payment.md` | `06813fc5597240ed39d513e1e88df483dec85cd8f277f89d1baaa41003b6f4ca` | `f695325dd0624188a9de25dab62c5f2830f090d528e1b50c265cbb989d00ffbd` |
| `src/content/columns-pl/941-polish-brand-taiwan-consumer-injury-importer-recall.md` | `17382511050d47b947e9ff81276b2b5f8cb5999ebe62aa86f679eb0546c580e7` | `6357ffc8fbd81c105b8c941b95328e95ecafc3945a65860ae4dd7f8da38e8227` |

## Required reading and scope

Read the full task `AUTHOR-BRIEF.md` and `REVIEW-BRIEF.md`, repo `AGENTS.md`, full `docs/columns/EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `SENTENCE-VARIETY-RULE.md`, `LESSONS.md`, editorial skill and independent review criteria. Read the PL sections of `work/research/east-briefs.md`. Checked current consultation copy in `src/data/international-inquiry-copy.ts` (PL entry) and `src/data/en-service-scope.ts`: English, Chinese, Japanese and Korean only. No claim of Polish consultation, foreign-law licensure, successful recovery, free service, or retainer acceptance appears in the articles. Internal `legal-ai-assistant` metadata is retained without a public author statement.

940 addresses the effect of a Polish buyer's payment to a substituted bank account. 941 addresses Taiwan consumer-product safety, the importer's role, recall and the separate allocation of costs with a Polish producer. They are distinct editorial decisions, not translations of each other.

## Three actual recent Polish comparators

All three were read in full from the current repo; each is dated `2026-10-24`.

| Comparator | Opening, shape and ending compared with this pair |
| --- | --- |
| `src/content/columns-pl/870-polish-company-taiwan-subsidiary-branch-office.md` | Opens with who signs a Taiwan contract, then a business-flow sketch. Four sections compare entity choice, investment money, work and tax. Ends with a diagram's party/payment match. 940 opens with the legal effect of a transfer and concentrates on the recipient/authority evidence. 941 opens with the importer's statutory role and uses a genuinely comparative role table. Neither repeats 870's entity-choice survey. |
| `src/content/columns-pl/871-polish-working-holiday-taiwan-six-month-work.md` | A six-month number opens an immigration and employment timeline. Its ending asks how a new contract fits remaining lawful time. Neither new article borrows the visa timeline or the numeric opening. Their only in-body questions concern paying twice and waiting for recall-cost agreement. |
| `src/content/columns-pl/872-polish-exporter-taiwan-unpaid-euro-invoices.md` | Opens with a labelled hypothetical seller's unpaid invoice and repair set-off. Its debt-recovery structure moves through limitation, payment order and attachment; it ends on two dates. 940 concerns a buyer who already sent money and whether that performance discharged the debt; 941 concerns safety and injured consumers. Currency preservation in 940 is useful transaction evidence, not a duplicate collection guide. Both new endings identify evidence specific to their own dispute. |

## Opening deletion tests

940 paragraph 1: deleting the first sentence loses the exact mismatch between bank-transfer proof and discharge of the price debt. Deleting the second loses the Taiwan-law condition and the creditor/authorized-recipient requirement under article 309. Both provide information immediately.

940 paragraph 2: the first sentence supplies the immediate bank and genuine-supplier contact action; the second supplies the previously verified contact channel and official Europol support; the third preserves the difference between requesting bank intervention and guaranteed recovery. The author's pre-freeze removal of the additional sentence about a reply returning to the scammer removes a repeated explanation without losing that contact rule.

941 paragraph 1: the first sentence gives the importer's statutory position despite Polish manufacture; the second identifies which actual businesses must be distinguished after an injury report; the third prevents a brand name from standing in for those roles. Deleting this paragraph would leave the Polish reader without the local liability relationship.

941 paragraph 2: the first sentence separates current safety action from compensation; the second explains why a cost dispute cannot change the statutory recall trigger; the third connects batch records to both tasks. This is a concrete safety/compensation distinction, not an outline announcing what the article will cover.

## First repair — completed

The author made the changes; the reviewer re-read both complete files and all affected conclusions. No second failed repair pass occurred.

| File:line at initial review | Exact wording | Finding and proposed repair | Meaning |
| --- | --- | --- | --- |
| 940:24 | `uregulował cenę wobec tajwańskiego dostawcy` | An awkward verb/preposition pairing. Replaced with `zapłacił cenę należną tajwańskiemu dostawcy`. | Legal effect, payee and uncertainty preserved. |
| 940:32 | `prawo zobowiązania umownego` | The Polish legal term is `prawo właściwe dla zobowiązania umownego`; the author supplied it. | Choice-of-law substance preserved. |
| 941:44 | `Ustawa rozróżnia importera od dystrybutora` | Mixed Polish constructions. Replaced `rozróżnia` with `odróżnia`. | Roles and statutory distinction preserved. |
| 941:58 | `jeśli zabrakło widocznego ostrzeżenia oraz informacji o postępowaniu w razie niebezpieczeństwa` | Could be read as requiring both components to be entirely absent. Replaced with `jeśli nie spełniono obowiązku zamieszczenia widocznego ostrzeżenia wraz z informacjami o postępowaniu w razie niebezpieczeństwa`. | Substantive precision clarification, not merely stylistic. Direct official article 10(2) inspection supports the combined notice duty; independent final reviewer `/root/expand_final_east` independently inspected it and agreed. No newly invented exception. |
| 941:68 | `Polisa wymaga osobnego odczytania` | Unnatural abstract formulation. Replaced with `Polisę trzeba sprawdzić osobno`. | Separate policy and notification-condition review preserved. |

The first repair removed the five identified wording issues. Subsequent actual measurement revealed the numerical sentence-variation failures below; these were returned to the author for a targeted natural-language repair, without reopening otherwise clear paragraphs.

## Actual approved-method run and bounded numerical repairs

Read `work/variety-review/review-final.md` and JSON, and `work/variety-candidate/METHOD.md`; verified wrapper SHA `44c287ea5f6e26b694881418acebf4c9c115b87b2a965ea0c10a43fb1830e2e5` and independent review JSON SHA `f0cfcfea6e841dd0ed59df3b2727fd74bb236604d0991e124b88bceb12c3659c`. The root approved this exact task-local method. It does not install Polish support globally or change the HARD limits.

Executed `python3 /Users/son7/tseng-market-expansion-20261025/work/variety-candidate/variety_metrics.py check <absolute article path> --lang pl` first on pre-metric-repair SHAs `a163e85a051394b23172d1a77c57fee5b810a17f91da0fac036f015995f44820` and `5a4608ffd47e23663005ba9c77500e263b422d3907ff3b149ee6d39ff8ac8bc5`. Raw initial failures: `pl-locale-local-variety-r1.json`. Read all 44 extracted sentences in 940 and all 52 in 941; `pl-locale-extraction-r1.json` preserves them. Article/paragraph abbreviations, the email address and source-tail stopping behaved as intended; no erroneous boundary was found.

- MONOTONY: sentence-length variation — 940 CV 0.441, with the evidence/authority paragraph's three sentences at 16/15/16 orthographic units — rearrange the related authority-evidence and distinct damages questions naturally, without inventing a rule or deleting a limitation.
- MONOTONY: sentence-length variation — 941 CV 0.426; its evidence-preservation/safety paragraph uses 20/11/8/9 units — the connected proof-preservation and hazard-removal explanation is a possible local restructuring site. The author chooses a semantically faithful repair; no empty short sentence or padded modifier is acceptable.

All other HARD metrics passed on those initial inputs. Those numerical failures remain preserved. The separate legal reviewer independently obtained the same failures.

The first measurement repair made 940 pass (CV 0.464); 941's first repair still failed (CV 0.421) and its actual measured bytes were preserved. The second repair made 941 pass (CV 0.457). The preservation record explicitly discloses that concurrent caption normalization required reconstruction of the measured 941 failure from the preserved baseline and exact repair paragraph; the resulting SHA matches the actual failed run. No failed result was erased, relabelled or given a third unsuccessful repair.

The final 940 evidence paragraph now connects the approval history, employee role and agreed account-change procedure with the compromised mailbox, then states that breach location alone does not establish authority. It still keeps payment validity and a possible damages claim separate. The final 941 paragraph connects the incident report's exact fields with the purpose of comparing the account to photographs and the examined item; the original separate sentences requiring simultaneous hazard removal and prohibiting continued sale remain. These are substantive links between existing information, not empty short sentences or new legal assertions. All other substantive source passages and FAQs are unchanged.

The root normalized both captions to `Scena fikcyjna`. This is natural Polish, preserves the fictional status and contains no author or actual-incident claim. The final full-file hashes include that metadata change.

Reviewer independently reran the approved wrapper on the final files and inspected final extraction. Results in `pl-locale-local-variety-final.json` and `pl-locale-extraction-final.json`:

| Article | Sentences | CV | Short share | Similar runs | Exit | HARD failures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 940 | 44 | 0.464 | 0.205 | 0.048 | 0 | 0 |
| 941 | 51 | 0.457 | 0.216 | 0.000 | 0 | 0 |

Of the final 95 extracted sentences, 89 are byte-identical to already read extraction; the six sentences in the two changed paragraphs were read again. The 941 list-and-purpose sentence has 36 orthographic units and is followed by eight- and nine-unit sentences; it does not form a run of long sentences. Images were rehashed and are unchanged from the actual visual inspection.

## Sentence-variety §5 review

1. Shared CLI: actual exit 2 for both files; raw initial commands/output are in `pl-locale-shared-variety.json`, with pre-metric-repair inferred-locale and explicit `--lang pl` runs in `pl-locale-shared-variety-final-source.json`. Each final wrapper run also executes the original checker and labels its unsupported exit 2 separately. The final approved task-local measurements both exit 0 with zero HARD failures, as recorded above.
2. Neither opens with a stock hypothetical formula. 940 begins with a payment/discharge consequence; 941 begins with the importer's statutory role. Across the broader 24-article batch, the root reviewer must assess the distribution of opening types.
3. Both contain useful short sentences, for example 940's `Znaczenie ma wybór stron.` and `To szczególna kategoria prawna.`, and 941's `Jeden podmiot może pełnić kilka ról.` and `Sam e-mail nie oznacza przyjęcia zlecenia.` They identify legal distinctions or service boundaries, not decorative filler. Final short shares and CV both pass, with the long-to-short sequence examined in context above.
4. Paragraph beginnings were read vertically. They move among evidence, actors, statutes, questions and transaction steps. No repeated run of the same lead-in or three-step generic checklist was identified.
5. Neither has three consecutive claim–citation–caveat paragraphs. Statutory paragraphs are interleaved with evidence and practical-action paragraphs without a legal citation. Links remain next to the rule they support.
6. Negative sentences preserve real boundaries: receipt of transfer versus authorized receipt; lack of fault versus automatic release; internal cost allocation versus an injured person's claim. They do not rebut an invented reader claim. No repeated ornamental contrast template found.
7. 940 ends on the account-change/confirmation chronology. 941 ends on tracing the same batch through complaint, examination and recall. Required general-information notices are in the source tail; neither ending is a sales pitch.
8. Polish register remains restrained, professional and reader-facing. No bold markup, invented first-person experience, public authorship assertion or imperative checklist headings. The role table and source lists serve actual comparisons or citation inventory.
9. Repair comparison preserves article numbers, choice-of-law conditions, uncertainty, the exception for adequate hazard removal, potential court reduction rather than automatic exemption, causation and third-party protection. No invented deadline, fee, customer, judgment or consultation language.

## Image inspection

Both final WebP files were opened with `view_image`, not inferred from filenames. Both are 1536×1024, visibly distinct, with no people, faces, identity documents, logos, flags or readable document text.

940: open folder with blank sheets, closed unbranded laptop and a security key on a wooden desk overlooking a port. The setting connects trading paperwork with payment-security review. The Polish alt describes the visible objects accurately; the caption clearly calls the scene fictional.

941: plain electric kettles and cartons on a metal inspection table; one kettle is on a tray beside an unplugged cord, with gloves and a measuring tool nearby. This is a relevant consumer-product inspection scene, not evidence of an actual recalled brand or incident. The Polish alt and explicit fictional-scene caption match it.

## Source and review limitations

Direct official opens on 25 October 2026: Civil Code article 310, Consumer Protection Act article 10, and choice-of-law act article 26. `pl-locale-opened-sources.json` preserves the actual tool responses. Article 310's page lists commencement warnings for other Civil Code provisions, not the rule reviewed here. The warning/handling conjunction was escalated rather than silently altered as a style change.

The reviewer’s direct Europol PDF open timed out. The successful official PDF tool response preserved by the author in `pl-author-source-evidence.json`, `results[3]`, was then read: page 3 describes supplier impersonation and using previously known contact details. This is a review of saved official output, not a claim that this reviewer's direct fetch succeeded. The separate final reviewer retains responsibility for the complete legal/source check. No claim of human native-speaker or lawyer review is made.
