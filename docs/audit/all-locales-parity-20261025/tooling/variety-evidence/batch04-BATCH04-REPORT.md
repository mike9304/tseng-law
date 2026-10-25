# Batch04 measurement candidate — ready for root review

The isolated candidate explicitly supports `he/bn/ur/fa/my/ta/ne`, bringing the
checker from 35 to 42 locales. Its 43 installation files are enumerated with
SHA-256 in `BATCH04-VERIFICATION.json`. This agent did not install shared files,
edit R, change any manuscript, commit or publish. No target text or target
score in the seven new locales was read for this work. The package is an AI
measurement-method implementation, not native-speaker or legal approval.

## Exact baseline and code delta

All 36 files in the installed IS-fix receipt matched both its frozen candidate
and the shared checker before copying. `baseline35/` retains those exact bytes;
`BASELINE35-INSTALLATION.json` records receipt, file and inherited-test hashes.
Existing 31 JSON profiles, the four inline legacy definitions, score function
and HARD limits are unchanged. There are no relaxed thresholds or target-text
exceptions. The 8/32 thresholds remain uncalibrated operational heuristics.

Four former installation files change: `variety_metrics.py`,
`variety_multilingual.py`, `variety_expansion.py`, and `MULTILINGUAL-METHOD.md`.
Seven profiles are added; the other 32 installation files are identical.
`BATCH04-DELTA.patch` contains the full delta. New behavior is opt-in:

- Seven explicit locale/path routes, native source headings, citation labels,
  rhetorical signals and finite abbreviation lists.
- Native hard terminators may separate sentences without whitespace and stop
  bare URL consumption. Selected quoted reporting clauses remain attached.
  Return values preserve original text slices, including NFC/NFD spellings.
- Hebrew geresh/gershayim/ASCII abbreviation marks stay in written units;
  maqaf still splits and attached prefixes remain attached.
- Burmese uses a separate Node/ICU `my` wordlike cache. Unicode whitespace
  delimits input phrase chunks, then the dictionary segments inside them.
  It does not count whitespace pieces as words and does not use a Thai fallback.
  Missing/invalid backend support returns exit 2. Thai's source/review binding,
  cache and existing backend implementation remain unchanged.

## Reproducible test evidence

Every command here used:

```sh
export PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH
export PYTHONDONTWRITEBYTECODE=1
```

The runtime is Node 24.14.1 / ICU 78.2 / Unicode 17.0. Python details are in the
manifest. The upstream root installation's earlier default-Node SIGABRT and
successful Node24 rerun are retained in its receipt; neither was overwritten.
This task initially tried a nonexistent Homebrew Node24 path before finding
the actual nvm path. No tests or measurements used that nonexistent path.

| Stage | Actual result | Retained evidence |
| --- | --- | --- |
| Copied existing suite, before changes | 44 methods PASS | `baseline35-tests.txt` |
| New neutral tests, unsupported baseline | 51 failing assertions across 11 methods | `batch04-red-support.txt` |
| Profiles/registry only, before segmentation/unit implementation | 116 failures and 1 missing-backend-field error | `batch04-red-boundaries.txt` |
| First complete implementation | 55 methods, 4 MY Unicode-space failures | `batch04-green-attempt.txt` |
| Unicode-space correction | 55 methods PASS, Python regex-string warning | `batch04-green-with-warning.txt` |
| Raw-string correction and additional invalid-backend cases | 56 methods PASS, no warning | `batch04-green.txt` |
| Actual CLI, including success/failure/too-short/unknown/missing backend | 34/34 invocations matched expected exits | `batch04-cli.json` |
| Incorrect explicit repository argument | Exit 2 before comparison | `regression-wrong-root.txt` |

The own 69 literal sentence cases, Unicode word/token arrays and linguistic
positive/negative controls were fixed before implementation. Ten separately
authored Burmese examples were also fixed before candidate execution. No
expected array was changed to obtain a pass. Tests include native numerals,
decimal dots, ordinary numeric sentence ends, abbreviations, quotes, source-only
versus substantive headings, Markdown/URL preprocessing, Unicode spaces and
NFC/NFD preservation. Repeated neutral inputs genuinely return exit 1; short
new-locale inputs and unsupported codes return 2. The varied CLI inputs are
deliberately synthetic token stress tests, not publishable natural-language
examples or evidence that an article reads well.

The four MY failures exposed raw ICU's treatment of narrow NBSP as an internal
connector. `MY-WHITESPACE-DECISION.json` preserves the diagnosis and general
phrase-chunk correction; `METHOD-BATCH04-initial.md` preserves the prior method.
The original text, frozen expected arrays and all thresholds remained unchanged.

```sh
cd /Users/son7/tseng-all-language-columns-20261025/batch04/tooling/variety
python3 -m unittest discover -s tests -p 'test_*.py'
python3 tests/verify_batch04_cli.py
python3 tests/compare_thirty_five.py \
  --repo-root /Users/son7/Projects/tseng-law-all-locales-20261025 \
  --previous-impact-manifest /Users/son7/tseng-all-language-columns-20261025/batch03/tooling/variety-fix-is/IMPACT-INPUTS-FROZEN.json
```

## Same-input old35 regression

`BASELINE35-INPUTS.json` freezes R at
`47ad0c93b3235fd8a5d7af41511f75014931e7e2`. The comparison uses the snapshot
bytes, not mutable working files and not an inferred repository parent path.

| Comparison | Result |
| --- | --- |
| Raw Markdown files selected by the existing 35 directory routes | 1,781 |
| Measured files | 1,750 |
| Thai unavailable, unchanged missing reviewed boundary maps | 31 |
| Metric/default-score/corpus-median-score/HARD/exit differences | 0 |
| Paragraph/sentence boundary differences | 0 |
| Extended-locale token-array differences | 0 |
| Existing profile/score/HARD integrity differences | 0 |
| Frozen/current source drift during and after comparison | 0 |

These are raw checker-input counts, not substantive professional-column or
publication counts. All 35 locales are represented. The preceding IS audit
selected 1,760 release files; root subsequently added 21 batch03 articles.
There are zero changes to common input bytes and zero removals. This input
addition is reported separately from the paired engine regression. No new
batch04 target-language files were selected. Full before/after metrics,
errors, exits and scores are retained in `batch04-regression.json`.

## Practical limits and handoff

`METHOD-BATCH04.md`, also appended to the installable method file, identifies
unit definitions, exact reference/access status and finite-pattern limitations.
Unicode/ICU/W3C primary references support script treatment; none validates the
numerical editorial thresholds. The W3C layout source is a draft. National
materials that timed out or were blocked are not represented as fully read.

MY's `icu_dictionary_wordlike_units` are not natural-word gold counts. The
neutral `စင်္ကြံ` example is split into three ICU pieces, and compounds/new
words can be imperfect. Runtime changes require re-audit. Zawgyi conversion,
unpunctuated prose and literary U+104F sentence decisions are out of scope.
Do not insert whitespace, delete qualifications, rewrite normal punctuation
or add empty sentences to manipulate a result. Quote/abbreviation ambiguity
and finite rhetorical coverage remain in every new profile.

Root should review this exact frozen code and method, rerun with the stated
Node24 PATH, then decide on shared installation. Only after installation
should authors run the exact new locale and inspect extracted boundaries on
their frozen manuscripts. Section-5 editorial and independent meaning review
remain separate. This report gives no article, publication or deployment PASS.
