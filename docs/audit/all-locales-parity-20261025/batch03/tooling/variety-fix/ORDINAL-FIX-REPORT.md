# HR/HU ordinal boundary correction candidate

Prepared for root review and installation. This agent changed only `batch03/tooling/variety-fix/`; installed shared, R, the previous candidate package and article files were not edited.

The new candidate resolves the reported class of numeric ordinal/date oversegmentation in HR/HU using contextual language rules. All 42 unittest methods pass after 116 pre-fix assertion failures. The existing 28-locale frozen regression has zero metric/score differences. Current 35-locale impacts are reported below without changing any threshold or tuning against article scores. Passing these engineering tests is not native-speaker, legal or publication approval.

## Provenance and scope

The installed 36 files were checked against both the prior candidate and root's `root-installation.json`, then copied unchanged into `baseline35/`. The original 39-method suite was rerun and passed. `BASELINE35-INSTALLATION.json` records each SHA and the receipt SHA.

Unlike the earlier package's design stage, this engineer had now seen the reported HR/HU target fragments. That fact is explicitly recorded; the earlier package's historical no-target-reading record was not changed. HR and HU authors then provided independent neutral library/manual/classroom examples and real sentence-ending counterexamples. The candidate's 36 SHA values were frozen in `FIX-CANDIDATE-FROZEN.json` before current article impact was measured. No target score selected a boundary rule or threshold. An additional HU reviewer message arrived after that freeze and caused no code change.

The fix changes four production files: `variety_expansion.py`, `profiles/hr.json`, `profiles/hu.json`, and `MULTILINGUAL-METHOD.md`. All other 32 installation files are unchanged. Word-count definitions, 8/32 cutoffs, the score function and HARD conditions remain unchanged. The other 29 profile files and other 33 locale behaviors are preserved in the comparisons.

## Rule and test basis

The [Croatian institute's period rules](https://pravopis.hr/pravilo/tocka/55/) distinguish ordinal dots from sentence stops and retain one dot when the two roles coincide. [Hungarian AkH. §§267/292](https://helyesiras.mta.hu/helyesiras/default/akh12#292) requires a dot after a written ordinal. Coordinated ordinals and inflected followers are grammatical applications of those rules, not a segmentation algorithm specified by the references. Full bounded reasoning and author provenance are in `METHOD-ORDINAL-FIX.md`.

Only HR/HU opt into a dotted Arabic/uppercase Roman numeral continuing before a lowercase letter/mark/number token, across horizontal Unicode whitespace. Uppercase conjunctions, mixed-case tokens and newline boundaries do not trigger this added rule. HR also has a finite reference-noun + ordinal list + capitalized genitive document-kind pattern. It does not protect every number or every capitalized follower.

The fixed fixture has 20 HR and 13 HU two-sentence pairs. Positives include ordinary adjectives and inflected nouns, conjunctions, postposed ordinals, document titles and mid-clause years. Negatives include genuine cardinal/ordinal/year endings, uppercase conjunctions and mixed-case next-sentence names. NFC/NFD, NBSP/narrow NBSP, exact slices, actual frontmatter/Markdown processing and unchanged prior contracts are exercised.

| Check | Result | Evidence |
|---|---|---|
| Installed baseline | 36 exact file hashes; 39 methods pass | `BASELINE35-INSTALLATION.json`, `baseline35-tests.txt` |
| New neutral tests before production fix | 3 methods, 116 assertion failures, exit 1; no errors | `ordinal-fix-red.txt` |
| Whole candidate suite | 42 methods pass, exit 0 | `ordinal-fix-green.txt` |
| Explicit comparison roots | Missing/wrong repository rejected with exit 2 | `ordinal-fix-path-cli.json` |
| Real staged HR/HU CLI | 12 before/after invocations agree with recorded verdicts | `ordinal-fix-impact.json` |

Before implementation, two integration-test API details were corrected (`paras` key and one-decimal `mean_len`). Original test bytes, hashes and reason remain in the fixture freeze record. No literal sentence expectation was changed; the corrected test still produced 116 red assertions before the production fix.

## Same-input comparisons

These are raw checker input file counts, including the files found in the supported content directories. They are not professional-column counts, publication counts or completion metrics.

| Input set | Compared | Measured | Unavailable | Change |
|---|---:|---:|---:|---|
| Prior frozen 28 locales | 1,572 | 1,541 | 31 Thai | No metrics/scores/error-outcome differences |
| Current R, 35 locale directories | 1,740 | 1,709 | 31 Thai | HR 20 + HU 20 files change; all other locales unchanged |
| Separate staged batch03 snapshot | 18 | 18 | 0 | HR 3 + HU 3 change; BG/CA/EL/IS unchanged |

R was `fd744f544ca092379785e5b2962ae5fc930efe37` at both ends of the run. Release and staging inputs were copied into separate `impact-inputs/` folders and hashed before comparison. No source changed during measurement. Three staged SK files were excluded because root reported them as in progress when the comparison was scoped; only their inventory-time SHA values are recorded. Root later confirmed the same hashes frozen, but this report continues to exclude them and makes no SK staged-verdict claim.

All compared HR/HU sentence changes preserve the full non-whitespace text and the flattened orthographic-unit arrays. The release set has 212 changed boundary blocks; the staged set has 57. That is evidence of boundary-only change, not a claim that every possible linguistic ambiguity has been solved. The 57 changed staged blocks were inspected after candidate freeze and restore the reported reference/date clauses without dropping their text. The 212 release blocks are retained for further inspection; no complete native judgment is claimed.

## Staged HR/HU verdicts on the frozen bytes

All six had no HARD failures with the installed oversegmentation. The corrected boundaries expose failures in HU. These outcomes are preserved; neither manuscripts nor thresholds were adjusted.

| File | Sentence count | CV | Corrected HARD failures | Exit |
|---|---:|---:|---|---|
| hr 704 | 68 → 59 | 0.538 → 0.539 | none | 0 → 0 |
| hr 705 | 83 → 67 | 0.574 → 0.528 | none | 0 → 0 |
| hr 706 | 93 → 81 | 0.562 → 0.486 | none | 0 → 0 |
| hu 704 | 78 → 70 | 0.494 → 0.405 | len_cv, consec_same_start | 0 → 1 |
| hu 705 | 80 → 69 | 0.513 → 0.436 | len_cv, consec_same_start | 0 → 1 |
| hu 706 | 104 → 90 | 0.533 → 0.461 | consec_same_start | 0 → 1 |

The complete per-file source SHA, metrics, scores, failure keys, extracted boundary changes and actual CLI output are in `ordinal-fix-impact.json`. HR's no-FAIL result still needs the separate meaning/style review. HU requires author-side editorial work and remeasurement after root installs the reviewed candidate; this package does not certify those articles.

In the existing release corpus, three formerly no-FAIL inputs become failures under corrected boundaries:

- `src/content/columns-hr/010-taiwan-gym-injury-lawsuit.md`: len_cv, short_share
- `src/content/columns-hr/012-taiwan-overtaking-accident-liability.md`: len_cv, short_share
- `src/content/columns-hr/017-taiwan-logistics-business-setup.md`: len_cv, short_share

## Limits and installation

The next-token test is not a general word or syntax parser. Lowercase brands, intentional lowercase sentence starts, mixed casing after apostrophes/hyphens, unusual Roman strings and unlisted titles can remain ambiguous. A genitive document phrase can itself begin a new sentence; the finite title-context heuristic cannot prove that distinction in every construction. No all-reference or native-speaker guarantee is made. Manual inspection of extracted boundaries remains necessary even when the CLI reports no failures.

`ORDINAL-FIX-VERIFICATION.json` lists all 36 installation file SHA values and each evidence artifact; `ORDINAL-FIX-DELTA.patch` shows the exact four-file delta. Root performs separate review, backup and installation. Neither this candidate nor its article results were deployed by this agent.

Reproduce the current paired comparison with explicit roots:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s /Users/son7/tseng-all-language-columns-20261025/batch03/tooling/variety-fix/tests -v
PYTHONDONTWRITEBYTECODE=1 python3 /Users/son7/tseng-all-language-columns-20261025/batch03/tooling/variety-fix/tests/compare_ordinal_fix.py --repo-root /Users/son7/Projects/tseng-law-all-locales-20261025 --prior-audit-root /Users/son7/tseng-all-language-columns-20261025/batch03/tooling/variety --batch-root /Users/son7/tseng-all-language-columns-20261025/batch03
```

The snapshot guard refuses to overwrite an existing frozen input with newer bytes. If authors edit later, retain this comparison as historical evidence and create a separate new snapshot/run rather than silently replacing it.
