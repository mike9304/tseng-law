# Icelandic boundary correction candidate

Prepared for root review and installation in the isolated `variety-fix-is/` directory. Shared, R, manuscripts and the previous HR/HU candidate were not edited by this agent. The candidate builds on the root-installed HR/HU correction and preserves it.

The reported IS ordinal-reference splits and merged sentence after terminal `gr.` are corrected on the frozen input. The complete 44-method test suite passes; old28 same-input regression has zero differences. Corrected IS705 now fails `len_cv`; that result is retained without changing a manuscript, cutoff, score or HARD rule. This is engineering evidence, not native-speaker, legal or publication approval.

## Baseline and design chronology

All 36 installed files match the HR/HU manifest, shared and its root installation receipt. Exact copies are in `baseline35/`; the inherited 42 methods were rerun successfully. `BASELINE35-INSTALLATION.json` binds that provenance.

Root's reported IS target fragments had been seen before this follow-up. No full IS manuscript or target score informed the rule design. Independent reviewer `/root/column_deploy` supplied ten neutral literal arrays; four additional neutral casing/title/quotation cases were fixed before code. `IS-FIXTURE-FREEZE.json` binds these 14 cases and method. No expected boundary was changed after the tests failed. `FIX-CANDIDATE-FROZEN.json` fixes the production hashes before article impact measurement.

The official [Ritreglur](https://ritreglur.arnastofnun.is/) distinguishes ordinal dots, final abbreviation dots, numbers/time and new-sentence capitalization in §§1.2.1 and 22.2–22.6; §26.1.1 also addresses acronym compounds. These rules motivate the examples, not an official segmentation algorithm or numeric readability standard. The exact interpretation and limitations are in `METHOD-IS-FIX.md`.

## Minimal production delta

Only three production files change: `profiles/is.json`, `variety_expansion.py` and `MULTILINGUAL-METHOD.md`. The other 33 installation files, including both HR/HU profiles, remain identical.

IS opts into the existing lowercase ordinal continuation branch and treats `gr` as potentially terminal. A three-line optional abbreviation-following-context check protects a finite document-compound genitive after `gr.`. Its prefix is not an ABC/XYZ name allow-list; only the declared `reglnanna` suffix is selected. A nominative compound beginning a new sentence remains split. Other profiles do not set this option. Original text and orthographic units, score, HARD and thresholds are unchanged.

| Verification | Actual result | Evidence |
|---|---|---|
| New neutral tests before modification | 2 methods, 37 assertion failures, exit 1 | `is-fix-red.txt` |
| Profile-only terminal change before context fix | 13 assertion failures expose document-title oversegmentation | `is-fix-title-red.txt` |
| Whole suite after minimum correction | 44 methods pass, exit 0 | `is-fix-green.txt` |
| Existing frozen28 comparison | 1,572 inputs; 1,541 measured + 31 unchanged Thai unavailable; no differences | `is-fix-impact.json` |
| Current R35 same-byte comparison | 1,760 inputs; 1,729 measured + 31 unavailable; only IS10 change | `is-fix-impact.json` |
| Separate batch03 snapshot | 21 inputs; only IS3 change; 6 actual before/after IS CLI calls agree | `is-fix-impact.json` |
| Wrong/missing repository roots | Exit 2 without traceback | `is-fix-path-cli.json` |

Counts above are raw checker input files in its directory scope, not professional, visible or published-column counts.

## Input changes are separate from engine changes

The R HEAD was `eb3a5fbefdd5bc626c4c7a90abf63fbf821a6093` throughout this run. Relative to the separate HR/HU impact audit, this input snapshot contains 20 added release files, the now-frozen three staged SK files, and 13 changed source files (six release RU/NB files and seven staged BG/HR/HU files). These are separately recorded source changes in `INPUT-DELTA-FROM-HRHU.json`, not metric regressions caused by this candidate.

Every selected input was hashed and copied before measuring the two implementations on identical bytes. End-of-run checks of all 1,781 original source paths found no change after this snapshot. No HE or LT manuscript was read by this 35-locale checker run; those directories are outside its supported set. All old28 comparisons continue to use their original immutable 1,572 snapshots.

Current release effects are confined to ten IS files with 13 changed boundary blocks: eight keep an existing failure and two retain no HARD failures. Other 34 locale metrics, including the installed HR/HU behavior, remain unchanged. All affected IS text and flattened word-unit arrays are preserved. The staged set has four boundary changes, matching the reported three ordinal joins and one genuine sentence split.

## Staged IS results

| File | Sentences | CV | Corrected HARD failures | Exit |
|---|---:|---:|---|---|
| 704 | 66 → 65 | 0.470 → 0.463 | none | 0 → 0 |
| 705 | 77 → 76 | 0.454 → 0.438 | len_cv | 0 → 1 |
| 706 | 79 → 79 | 0.455 → 0.451 | none | 0 → 0 |

IS706 illustrates why sentence counts alone are insufficient: joining one wrongly split reference and separating one wrongly merged pair leaves the total at 79, while the actual boundaries and CV change. The four before/after arrays were inspected after candidate freeze. Exact input SHA, full metrics/scores, failure keys and real CLI output are in `is-fix-impact.json`.

IS705 needs author-side editorial work followed by remeasurement after root's installation review. This candidate does not make an article-publication claim. The code was not changed after inspecting the article outcomes.

## Remaining limits and installation

Capitalization and finite suffix patterns remain heuristics. Unlisted document names, identically shaped genitive phrases starting a fresh sentence, lowercase brands and unusual quotation/abbreviation constructions can remain ambiguous. This is not general Icelandic parsing or universal abbreviation handling. Manual inspection of extracted boundaries remains necessary even for exit 0.

`IS-FIX-VERIFICATION.json` contains all 36 installation file SHA values; `IS-FIX-DELTA.patch` shows the three-file change. Root performs backup, separate review and installation. This agent did not install or deploy it.

Rerun with explicit roots:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s /Users/son7/tseng-all-language-columns-20261025/batch03/tooling/variety-fix-is/tests -v
PYTHONDONTWRITEBYTECODE=1 python3 /Users/son7/tseng-all-language-columns-20261025/batch03/tooling/variety-fix-is/tests/compare_is_fix.py --repo-root /Users/son7/Projects/tseng-law-all-locales-20261025 --prior-audit-root /Users/son7/tseng-all-language-columns-20261025/batch03/tooling/variety --batch-root /Users/son7/tseng-all-language-columns-20261025/batch03
```

The comparison refuses to overwrite an existing snapshot with newer source bytes. Retain this audit and use a separate snapshot/run when authors revise files later.
