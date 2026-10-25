# Batch03 28 → 35 locale measurement candidate

Prepared for root engineering review, 2026-10-25. Candidate only; shared installation, publication and deployment were not performed. Ownership was limited to this tooling directory and `../VARIETY-PLAN.md`.

The candidate explicitly adds bg, ca, el, hr, hu, is and sk. All 39 unittest methods pass. Identical frozen inputs for the existing 28 locales show zero metric/score differences. A 40-case real CLI matrix has the expected exit codes. These are engineering checks, not native-speaker approval, legal review, a readability calibration, or a claim that any article passes editorial review.

## Baseline and input separation

- R: `/Users/son7/Projects/tseng-law-all-locales-20261025`.
- Frozen/current HEAD: `5e2d0f5df8c75eb4aca8304b7d9f5110ac422f90`, including case16 and repaired current inputs.
- All 29 production files matched R, shared and `checks/variety-next7-installation.json` before copy. The final comparison still matches them. `baseline28/` preserves those exact files; `RESTORED-BASELINE28.json` records all hashes.
- `BASELINE28.json` binds 1,572 original source hashes, byte snapshots and full original metrics/scores. The same snapshots were measured by both versions: 1,541 measured results and 31 identical Thai missing-map errors. Missing maps were actually re-executed; these are unavailable, not PASS.
- No frozen source bytes changed. Historical BASELINE21 has 22 different input files; those are input edits, not engine drift.
- Root subsequently added 21 DA/NB/FI/PL/CS/RO/UK ARC inputs. Current inventory is 1,593 files across the old 28 locales. The added paths and SHA values are listed in `existing28-regression.json` under `added_inputs_not_measured`; they were not measured or added to the frozen regression set.
- No bg/ca/el/hr/hu/is/sk target manuscript was read, scored or used to choose a rule, threshold or expected value.

## Measurement contract and production changes

All seven use Unicode orthographic units, 8-word short / 32-word long edges and the inherited score/HARD rules. These are written-form heuristics, not equal semantic lengths. Finite local-language abbreviations, source titles, citation forms, caveats, hypothetical openings and contrasts are listed in each profile. Ordinary negation and substantive headings have negative fixtures. Original sentence/token spelling is preserved, including NFD text.

| Locale | Selected tailoring |
|---|---|
| bg | Cyrillic abbreviations; year-conditioned `г.`; bounded ordinal followers; closing `“` |
| ca | `l·l` within words; apostrophes/hyphens; bounded letter-suffixed ordinals, including NFD `edició` |
| el | `;` and U+037E questions/terminators, including URL and citation tails; raised dots stay nonterminal |
| hr | Explicit abbreviated titles/references and Arabic/Roman ordinals; quoted attribution |
| hu | Finite ordinal/date contexts, Roman district/chapter forms and numbered `§` references |
| is | Abbreviations, numeric/Roman ordinal and time forms; closing `“`; numbered `gr.` citations |
| sk | Accented abbreviations, Arabic/Roman ordinals, year context and closing `“` |

`variety_expansion.py` adds seven dispatch codes and opt-in abbreviation, ordinal, Greek punctuation and URL-tail handling. `variety_multilingual.py` adds only the Catalan middle-dot word option. `variety_metrics.py` passes punctuation options through real preprocessing/question/citation calculations and updates the locale count. `MULTILINGUAL-METHOD.md` includes the full new contract and primary-reference access limitations. Seven profiles are new. The 24 earlier profiles and `build-rewrite-queue.py` remain byte-identical. Score and HARD ASTs are unchanged.

The complete production delta is in `BATCH03-DELTA.patch`; every one of the 36 proposed install-file SHA values is in `BATCH03-VERIFICATION.json`. Only those production files are installation candidates. Frozen snapshots, manifests, logs and tests are audit evidence.

## Red → green evidence

| Stage | Actual result | Evidence |
|---|---|---|
| New tests before registration | 10 methods, 58 intended assertion failures, exit 1 | `tests-batch03-red.txt` |
| Profiles present before boundary features | 10 methods, 28 assertion failures, exit 1 | `tests-batch03-features-red.txt` |
| New Unicode-space / Greek URL edges before fix | 3 methods, 16 assertion failures, exit 1 | `tests-batch03-edges-red.txt` |
| Catalan accented-final ordinal before fix | 1 method, NFD assertion failure, exit 1 | `tests-batch03-ordinal-red.txt` |
| Final complete suite | 39 methods, no failures, exit 0 | `tests-batch03-final-green.txt` |
| Existing 28 locales on identical snapshots | 1,572 compared, 0 differences, exit 0 | `existing28-regression.json`, `tests-batch03-regression.txt` |
| Real checker CLI matrix | 40 expected outcomes | `cli-batch03.json` |
| All active comparison path guards | 9 expected exit-2 outcomes | `regression-path-cli.json` |

The profile-present red includes one mistaken literal expected opener key: Greek `όμως` was expected without casefolding its final sigma. Python's declared NFC+casefold contract produces `όμωσ`; that expectation alone was corrected before implementing the boundary features. The original fixture, original/new hashes and reason remain in `BATCH03-FIXTURES-FROZEN.json`. This was not a score or sentence-boundary adjustment. Later neutral edge fixtures were added before their corresponding fixes, with their own freeze manifest.

The previous next-seven test used bg as an unsupported code; it now uses still-unsupported et. No old supported-language expectation was changed. The baseline fixtures, all earlier unit methods, original-four samples, invalid UTF-8 and Thai boundary rejection checks still pass.

## Explicit repository paths

`tests/compare_twenty_eight.py` requires `--repo-root` or `TSENG_REPO_ROOT`, validates it against the frozen R path, and rejects missing/wrong values before reading a corpus. Its comparison is always against frozen snapshots; current input edits/additions are reported separately.

The two copied historical comparison scripts had inferred `ROOT.parents[4]`. Reproduction found an empty-corpus exit-0 false success in `compare_existing.py` and a missing-file traceback/exit 1 in `compare_twenty_one.py`. Both task-local scripts now require the same explicit repository contract. Their original text copies and red results are retained, and the old result artifact overwritten by the reproduction was restored byte-for-byte. The active 28-locale comparison is the current evidence; historical scripts and records are not new regression claims.

Root can rerun:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s /Users/son7/tseng-all-language-columns-20261025/batch03/tooling/variety/tests -v
PYTHONDONTWRITEBYTECODE=1 python3 /Users/son7/tseng-all-language-columns-20261025/batch03/tooling/variety/tests/compare_twenty_eight.py --repo-root /Users/son7/Projects/tseng-law-all-locales-20261025
```

## Limits retained

Abbreviations, inflections, ordinal followers and source-heading vocabulary are finite. A capitalized next word is an ambiguous abbreviation-ending signal; quotation attribution is a lowercase heuristic, not parsing. Greek punctuation and Catalan middle-dot rules are opt-in; other locales retain their former defaults. NFC/NFD matching is covered for the fixed cases but is not general Unicode text segmentation. Selected contrast expressions are partial detectors, not a complete semantic judgment.

Headings, lists, tables, frontmatter/FAQ and recognized source tails retain the original metric scope; manual §5 review must cover excluded content. No legal conditions should be removed or sentence fragments invented to meet metrics. Thai still needs approved source-bound boundaries. The 14 remaining unsupported codes are bn, et, fa, he, km, lt, lv, mn, my, ne, sl, sr, ta and ur; the real CLI returns exit 2 for all of them, with no English/Korean fallback. A supported repetitive sample returns exit 1, and insufficient input or a missing profile returns exit 2.

Root review and shared installation are still pending. This package does not certify the new articles or their authors' language proficiency.
