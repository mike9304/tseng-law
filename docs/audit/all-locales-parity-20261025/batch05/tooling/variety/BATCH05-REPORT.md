# Batch05: explicit 49-locale candidate

Status: prepared for root review and installation. No R/shared write, manuscript write, git action, installation or deployment was performed. The new km/mn/sr/sl/lt/lv/et target manuscripts and their scores were not read. Profiles and tests are AI-authored engineering work; neither native nor legal approval is claimed.

## Frozen base and exact change

The baseline is the exact 43 production files from B4 manifest `a48da1a2c3b62ffbb9254eaa1db1c4c6bd041707e0f7fe9f93103945753239fd`. `BASELINE42-CANDIDATE.json` records that no root receipt was present at copy time. A later read found the root42 installation receipt and verified all 43 hashes against both that candidate and shared. See `BASELINE42-INSTALLED-CONFIRMATION.json`; receipt SHA `f2b0849e08e43f8006b4ae1ad482307972e39275487675129723c4425a448f42`.

The candidate has 50 installation files: seven new profiles, four changed prior files, and 39 byte-identical files. All 38 pre-existing JSON profiles are unchanged. The changed prior files are:

- `variety_expansion.py`: seven explicit locale entries; opt-in Arabic-only ordinal continuation for SR/LV/ET, flexible Unicode spaces in listed abbreviations, and conservative Khmer compound-abbreviation handling. Original text is returned through original-string offsets; markers are length preserving and forbidden in input.
- `variety_multilingual.py`: separate Khmer cache/backend plus explicit dispatch. Existing Myanmar function is AST-identical. Thai's code body is retained; only the new early dispatch is added ahead of it.
- `variety_metrics.py`: explicit Khmer runtime metadata. Score/HARD AST and 8/32 cutoffs remain unchanged.
- `MULTILINGUAL-METHOD.md`: adds the B5 method, sources, unit conventions and limits. The same B5 section is available in `METHOD-BATCH05.md`.

`batch05-production.diff` contains the exact baseline-to-candidate delta. `INSTALL-FILES.sha256` and `BATCH05-VERIFICATION.json` give the complete installation list and per-file SHA256; install only those files after root review.

## Measurement limits that matter

KM units are ICU dictionary wordlike segments inside Unicode White_Space phrase chunks. They are not whitespace words, linguistic gold words, syllables or graphemes. The runtime reports Node24.14.1 / ICU78.2 / Unicode17.0 and requires an exact `km` resolution and a neutral dictionary capability probe. ICU may segment names/compounds imperfectly, count the repetition mark as a unit, or split a time into numeric parts. U+200B is preserved. These are declared method characteristics, not claims of readability calibration.

KM supports explicit `។`/`៕` boundaries and keeps `៖`/`ៗ` nonterminal. It does not infer sentence breaks from bare spaces. The multi-character `។ល។` / `។បេ។` abbreviations are recognized at a paragraph end or before a disambiguating comma/colon/semicolon/separate stop. When lexical prose follows without such disambiguation, the checker returns exit2 instead of inventing a sentence boundary. The separate author fixture's semantic array remains intact; its fourth case is declared unavailable, not silently changed into a pass. The author acknowledged this limit without supplying target manuscript text or scores.

MN is the modern Cyrillic register. SR accepts explicit Latin/Cyrillic spelling pairs; three existing non-target public articles were audited by character counts only and used Latin. SL supports Arabic/Roman dotted ordinal contexts; SR/LV/ET normally dotted Arabic ordinals are tailored separately. Lowercase continuation is an orthographic heuristic, not syntax analysis; capitalized titles and lowercase new sentences remain ambiguous. Finite abbreviation lists and quote-attribution patterns cannot cover all names or nested quotations. These six profiles use orthographic units with hyphens split. LT preserves independently researched neutral examples while adding explicit terminal page/time/article cases.

All seven retain the inherited 8/32 cutoffs. No new manuscript was scored to select or relax them. A mechanical pass says nothing about factual correctness, native prose quality or legal review.

## RED → GREEN evidence

The 95 neutral sentence cases, token arrays, source-heading positive/negative cases and rhetoric controls were fixed before production implementation. A separate KM author supplied ten school/library cases before writing manuscripts. Nine are supported exactly; one is explicitly unavailable as described above. NFC/NFD and ordinary/NBSP/narrow-NBSP variants exercise the real preprocessing pipeline. Numeric dates, actual terminal numbers, mixed-case next sentences, abbreviations, quotes, links and source tails are tested.

1. Exact copied42 baseline: `baseline42-tests.txt`, 56 tests PASS.
2. Missing-support RED: `batch05-red-support.txt`, 44 failures in nine new methods. Separate KM fixture addition: `batch05-red-support-author.txt`, 45 failures in ten methods.
3. Profiles plus registry, before boundary/backend implementation: `batch05-red-boundaries.txt`, 61 failures and one missing-runtime-metadata error.
4. Initial implementation: `batch05-first-implementation.txt`, seven failures. These were an error in the new test expectation: unparenthesized references were expected to count as parenthesized sentence-final citations. The original test is preserved, production scoring was not changed, and both direct-reference `cite_end_share=0` and parenthesized-reference `=1` controls were added. See `TEST-CONTRACT-CHANGES.json`.
5. Final full suite: `batch05-green-tests.txt`, 66 methods PASS in 3.822 seconds, no warnings. Old tests that used et/lt/sl as unsupported codes now use genuinely unsupported codes; exact original files remain in `baseline42-tests/` and replacements are logged.

The methods include actual failure/short-input behavior, source-tail preservation, ordinary negation versus replacement/additive contrast, runtime/malformed-output paths, old profile hashes and score/HARD invariants. They do not merely assert that new configuration keys exist.

Actual entrypoints: `batch05-cli.json`, 34/34 expected outcomes. This includes seven synthetic unit-stress pass cases, seven uniform-rhythm failures, seven insufficient-input exit2 cases, seven baseline42 unsupported-language exit2 cases, a missing-backend failure and unsupported/unknown routes. The stress cases are deliberately nonpublishable sequences with the lengths fixed before CLI execution; they are not target prose or calibration data.

Additional actual CLI fault injection: `batch05-errors.json`, 16/16 exit2 without traceback, including ambiguous native abbreviation, reserved markers for every new locale, deliberately missing ICU locale, wrong resolved locale, failed dictionary probe, malformed output, nonzero backend exit, missing profile, malformed JSON and profile-locale mismatch. Fault injection uses an isolated preload/wrapper and temporary copies; production files are untouched. Wrong explicit repository path also fails with exit2 in `batch05-wrong-repo.json`.

## Same-input old42 regression

`BASELINE42-INPUTS.json` freezes 1,930 raw `.md` files directly under the baseline42 route directories. This is the checker's full file scope, not the number of professional columns. Each input has exact bytes and SHA256. Snapshot repository HEAD was `47ad0c93b3235fd8a5d7af41511f75014931e7e2`, but the working tree was not assumed clean: `BASELINE42-WORKTREE.json` identifies 21 snapshot files whose bytes differ from their HEAD blobs.

The comparison uses an explicit `--repo-root` equal to the frozen real R path; no parent-depth inference is allowed. `batch05-regression.json` records 1,930 paired comparisons across all42 locales: 1,899 measured and 31 Thai files still unavailable because their required reviewed sentence maps are absent. Metrics, default and corpus-median score, HARD failures, exit codes, paragraph/sentence arrays and unit arrays have zero differences. Baseline/candidate integrity failures are zero.

Compared with B4's old35 input snapshot, the input set has 149 additions, 21 changed common files and zero removals. Those are input differences, not checker regressions. While this regression ran, current R MS/FIL/NL704 changed after our snapshot; three source-input hash drifts are explicitly recorded. Frozen comparisons keep using the original identical bytes and do not claim to have reviewed those edits. No new7 target route was included.

## Reproduce

Run from this directory with the real Node24 path:

```sh
PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -p 'test_*.py'
PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH PYTHONDONTWRITEBYTECODE=1 python3 tests/verify_batch05_cli.py
PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH PYTHONDONTWRITEBYTECODE=1 python3 tests/verify_batch05_errors.py
PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH PYTHONDONTWRITEBYTECODE=1 python3 tests/compare_forty_two.py --repo-root /Users/son7/Projects/tseng-law-all-locales-20261025
```

Python used here: 3.14.6. Changing ICU may change dictionary results and requires a new audit. R/shared installation remains root's responsibility. Full source explanations and directly consulted official/institutional materials are in the method, with draft/descriptive sources identified as such.
