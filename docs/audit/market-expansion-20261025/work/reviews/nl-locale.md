# Independent Dutch locale review — PASS

Reviewer: `/root/expand_locale_nl`, independent of author `/root/expand_author_nl`. This is an AI editorial review, not a claim of human native-speaker or licensed-lawyer review. Both complete frozen manuscripts, frontmatter, FAQ, source lists and actual WebP images were read or viewed. No manuscript or image was edited by this reviewer. This review does not certify deployment.

| Source path, relative to repo | Reviewed full-file SHA-256 | Verdict |
|---|---|---|
| `src/content/columns-nl/934-dutch-technicians-taiwan-installation-contract-work-permit.md` | `8427d908388f0df5adf9b172935dd14447b2afc3179fd3f79db1cf66f2b1c6de` | PASS |
| `src/content/columns-nl/935-dutch-machinery-taiwan-retention-title-registration.md` | `241a1785fea4cfd9b19cd18bff733329caff8dec8721a85ea3d75634ba28cc11` | PASS |

## Scope and completed reads

Read AUTHOR-BRIEF, REVIEW-BRIEF, repository AGENTS, complete EDITORIAL-VOICE, COLUMN-VOICE-RULE, SENTENCE-VARIETY-RULE and LESSONS, editorial skill and review criteria, west-briefs research, the author's final evidence, image-generation record and current four-language consultation copy. The two articles serve different decisions by Dutch machinery exporters: staffing contract installation work and securing a delivered asset before final payment. Neither imports Dutch legal effects into Taiwan, claims Dutch-language consultations, invents a client or promises a result. The market rationale stays in the research evidence; no search-volume or acquisition claim is in either article.

## Resolved observations before author freeze

These were sent to the author, who made the changes. The table identifies the initial draft, not an outstanding defect in the frozen version. Initial source hashes are retained in `nl-locale-original-variety.json`. No unsuccessful repair round remains.

| Initial file:line | Exact sentence or span | Reason | Author's final treatment | Legal meaning preserved? |
|---|---|---|---|---|
| `934:26` | `Voor een Nederlandse machineleverancier kan een langer verblijf van de installatiemonteur een werkvergunningaanvraag nodig maken.` | An announcement of the following concrete rule; deleting it loses no permit condition. | Removed, with Dutch supplier context included in the actual article-5 rule. | Yes; the 30-day stay, deemed-permit rule and qualifying contract context remain. |
| `934:28` | `De ruimte op de reiskalender zegt dus nog niet hoeveel installatiewerk de monteur mag uitvoeren.` | Repeats the preceding entry-versus-work-permission distinction through a metaphor. | Removed; preceding legal distinction retained. | Yes. |
| `934:4` | `eerdere werkdagen` | Dutch can read this as weekdays or days actually worked, whereas the cited test aggregates work periods. | `eerdere werkperioden`. | Yes; clarifies rather than changes the unit. |
| `935:28` | `Het contract blijft daarmee een eigen vraag.` | Abstract connector; the next sentence states the relevant validity distinction. | Removed. | Yes; non-opposability and separate contract-validity requirements remain. |
| `935:42` | `een Taiwanese 動產抵押` | The Chinese term alone does not explain the type of right to a Dutch reader. | `een Taiwanees zekerheidsrecht zonder bezitsoverdracht (動產抵押) volgens deze wet`; articles 15 and 31 linked and included in sources. | A sourced explanatory addition, not a substitution with Dutch pandrecht or hypotheek. Article 15's no-transfer-of-possession feature was independently opened and checked. |

The author's final paragraphs, metadata and affected conclusions were re-read. No material language or meaning finding remains; no unresolved MONOTONY finding remains.

## First two paragraphs: sentence deletion test

934 paragraph 1 is one sentence stating the qualifying Dutch supplier context, the entry-document equivalence and the maximum 30-day stay. Deleting it loses the legal rule. Paragraph 2 sentence 1 adds conditional Dutch eligibility for 90-day visa-free entry; sentence 2 limits the inference about regulated work. Each is needed. The removed introductory announcement and calendar metaphor added no distinct information.

935 paragraph 1 sentence 1 states non-opposability to third parties in good faith; sentence 2 adds the written-contract requirement. Paragraph 2 sentence 1 limits the registration rule's consequence between the contracting parties; sentence 2 ties the two separate checks to accepting payment after installation. Deletion would respectively lose the good-faith condition, written form, validity distinction or concrete pre-delivery planning action. The removed abstract connector was unnecessary.

## Three actual recent Dutch comparators

All were read in full from the current repository, published 24 October 2026. Paths, exact hashes and detailed notes are in `nl-locale-comparators.json`.

| Comparator | Actual opening and form | Difference in the new pair |
|---|---|---|
| `src/content/columns-nl/834-dutch-company-taiwan-subsidiary-branch-office.md` | Labelled fictional maintenance supplier; question about contract party and corporate form; headings on incorporation, investment, treaty and first workday. | 934 states a narrow contract-worker rule before a later labelled fictional delay. 935 states a third-party registration consequence. Both avoid repeating company setup. |
| `src/content/columns-nl/835-dutch-employer-taiwan-first-hire-eor.md` | Recruitment-order question, immediate statutory restriction, then EOR, wage/insurance and tax-presence analysis. | 934 concerns the supplier's dispatched personnel rather than selecting a Taiwanese employee; 935 concerns the asset and seller's registration position. |
| `src/content/columns-nl/836-dutch-working-holiday-taiwan-work-insurance-tax.md` | Quota and age facts, followed by holiday-purpose limits; application, stay, insurance and taxation sections. | Neither new article uses a quota opening or the working-holiday route. The endings concern a revised installation dossier and the registration record/payment schedule, respectively. |

934 and 935 use subject-specific headings and connected Dutch paragraphs rather than a repeated numbered checklist. Their factual openings have different legal consequences. The full 24-article opening-type distribution is outside this two-article locale review and remains a root integration check.

## Independent measurements and section-5 review

The original command was actually executed on both final source hashes:

`python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <absolute source path> --lang nl`

Both return exit 2 because Dutch is unsupported. This is not a measured PASS. The task-local wrapper was then independently executed for each final source:

`python3 /Users/son7/tseng-market-expansion-20261025/work/variety-candidate/variety_metrics.py check <absolute source path> --lang nl`

Wrapper SHA: `44c287ea5f6e26b694881418acebf4c9c115b87b2a965ea0c10a43fb1830e2e5`. Its independent method review is `work/variety-review/review-final.json`, SHA `f0cfcfea6e841dd0ed59df3b2727fd74bb236604d0991e124b88bceb12c3659c`. The review and method limitations were read. Every extracted sentence and paragraph opener was inspected; dates, article references and the email address were not incorrectly split. `## Bronnen` correctly ends measured prose without removing source text from the manuscript.

| File | Sentences | CV | Short share | Similar-length runs | Result |
|---|---:|---:|---:|---:|---|
| 934 | 36 | .483 | .139 | .029 | task-local exit 0, 0 FAIL |
| 935 | 49 | .469 | .184 | .085 | task-local exit 0, 0 FAIL |

Full commands, stdout/stderr, final source hashes, metrics, sentence texts and unit counts: `nl-locale-variety.json`.

1. The shared unsupported status and task-local numerical result remain separate. The numerical limits were not relaxed.
2. Neither article begins with a stock hypothetical formula. 934's later delayed-installation example is explicitly fictional; 935 invents no case.
3. There are five short sentences in 934 and nine in 935. They state the clock's origin, location identification, cumulative-period effect, mandatory contract data, default term or concrete next action. No artificial event or experience was added for rhythm. Longer statutory clauses retain their conditions; no consecutive long-sentence passage was found.
4. Paragraph openers were read vertically. 934 repeats `Voor` and `Een` twice each; 935 repeats `De`, `Zonder` and `Bij` twice each. None exceeds the bound. There is no paragraph-by-paragraph identical setup.
5. Citation positions vary; there is no three-paragraph claim/citation/caveat chain. Each article has practical planning paragraphs without new unreferenced legal assertions. Citations and source lists remain complete for the manuscript's claims.
6. Necessary distinctions are expressed without repeated not-X-but-Y rhetoric. Entry permission versus work permission and contract validity versus third-party effect are legal scope distinctions, not invented reader misconceptions.
7. The final body paragraphs return to the original entry date and revised dossier, or the registration proof and postponed payment. Contact appears once before that ending; there is no generic sales conclusion.
8. Professional Dutch register is consistent. `werkperioden`, `gemachtigde`, `derden te goeder trouw`, `eigendomsvoorbehoud` and `bezitsoverdracht` convey their local reader meanings without claiming Dutch-law equivalence. Titles, summaries, FAQ and image text agree with the body. No bold, public byline, invented first person or guarantee appears.
9. Conditions and numbers were checked in context: stay up to 30 days; 31–90-day stay and filing within 30 days of entry; previous-year plus requested-period aggregation; good faith; written form; ownership condition; existing specific security right; one-year default and a 30-day pre-expiry renewal window. No qualification, source, fictional label or legal strength was lost in the repairs.

## Images

Both actual final WebPs were opened with `view_image`, not inferred from prompts. `nl-locale-images.json` records observations and hashes.

| Image | SHA-256 | Observation |
|---|---|---|
| `public/images/columns/934-market-expansion-20261025.webp` | `0642ee36a4fb08d9d189c3b1563d77de7eb929f93beebe81ea38a10f046b9f55` | Cool installation bay, opened machine enclosure, tool case, torque wrench and gloves. Directly relevant; Dutch alt accurately identifies visible objects. |
| `public/images/columns/935-market-expansion-20261025.webp` | `228564814ce94325a15636b897ef9d744f9bd05cd649db6b1370ad558da83a61` | Warm warehouse delivery scene, machine on wooden base, open crate, closed folder and key. Distinct from 934 and relevant to delivery/security. |

No people, readable documents, flags or identifiable logos were observed. Decorative glove marks and distant shelf labels do not identify a brand or disclose information. Captions explicitly say the scenes are fictional; there is no claim that they show a real case or were authored by a lawyer.

## Sources checked and remaining limits

Independent official opens are preserved in `nl-locale-opened-sources-1.json` through `-4.json`. They cover current employment-permission articles 5, 9 and 12; qualification article 7; Employment Service Act article 51; the movables law including articles 4, 5, 9, 15, 26–31; IPR article 38; FSC implementing rules; and BOCA's Dutch eligibility and restricted-activity caution. This spot-check preserves the legal meaning during locale review; the separate final reviewer still checks law and commencement comprehensively.

Direct single-article opens for ESA 51 and movables 31 failed, but their current official full texts opened and contained the provisions. The B1 registration instruction page returned 503 for this reviewer. The accessible FSC rules independently support the applicant, document and machine-identification statements; the author reports a successful direct B1 read. No successful B1 retrieval, authenticated filing or portal-operation test is claimed here.

The task-local metric is an AI-reviewed orthographic heuristic, not validated equal readability across languages or human-native certification. No whole-site visual, hydration, interaction or live-publication test was performed by this reviewer. Final legal review and root publication readback are separate.

## Caption normalization rebind — 2026-10-25T13:34:56.114174+00:00

Root changed only the two `featured_image_caption` values to the existing canonical Dutch label `Fictieve scène`. The label is natural Dutch, expressly fictional, and remains consistent with both images and their unchanged descriptive alt text. Restoring only the old caption line in each current file reconstructs the exact prior approved full-file SHA. All other bytes, including body, FAQ, metadata, sources and alt text, therefore match that prior review; image hashes also match. Independent evidence and exact one-line diffs are in `nl-locale-caption-rebind.json`.

The original PASS records remain unchanged as `nl-locale-pre-caption-r0.md/json` and the earlier measurement as `nl-locale-variety-pre-caption-r0.json`. Current report-table hashes and JSON bind the normalized source files. The approved wrapper was actually rerun for both current files: exit 0, FAIL 0; the shared checker again returned unsupported exit 2. Extracted sentences and all metrics match the prior review exactly. The substantive section-5, legal-meaning and image observations above remain applicable.

After root integrated main `5e2d0f5d`, the titles, publication metadata and first two paragraphs of newly added NL704–706 were also read. They concern first ARC registration, work/study/family residence routes and residence renewal/changed grounds. The new pair addresses installation contract staffing and asset registration; no generic copied opening was found in this bounded comparison. This is a new supplemental opening check, not a claim those three files were present or fully read during the original NL834–836 comparison. No full legal re-review of NL704–706 is claimed.
