# All-locale sentence measurement plan

This work owns only `tooling/variety/` and this plan. The full fourteen-locale candidate from commit `ef3b24e73d84968eea08ea9d58e991ccbbf83fa8` is restored byte-for-byte in `variety/baseline14/`; `RESTORED-BASELINE.json` records every original SHA-256. The working copy began from those exact files. Root installed the subsequent 21-locale version at `20261025-204858`, recorded in `../checks/variety-installation.json`. The next seven additions below are task-local only; this worker has not changed the shared installation.

## First six additions and requested Swedish follow-up

The first requested locales were ru, ms, fil, tr, nl and zh-hans. Neutral fixture expectations were frozen in `variety/tests/fixtures-six.json` before new-batch article metrics were read. These fixtures and profiles are AI-authored engineering inputs, not human-native or lawyer review. Root's later installation record supersedes the original pending-installation status.

The coordinating agent subsequently requested Swedish for the root-authored articles. `tests/fixtures-sv.json` was fixed and its unsupported-locale failures recorded before adding the Swedish profile. It uses the same orthographic-unit contract as the other new whitespace languages, with Swedish abbreviations, NFC comparisons and discourse expressions.

- ru/ms/fil/tr/nl count Unicode orthographic units, keeping combining marks, internal apostrophes and hyphenated orthographic compounds. Numeric ranges remain separate numbers. The established short/long cutoffs stay 8/32; these are operational heuristics, not equal semantic load or a readability calibration.
- zh-hans counts non-whitespace code points after excluding ASCII/fullwidth parentheticals, as the existing zh-hant character measurement does. Punctuation and Latin characters count; this is not lexical word segmentation. The existing Chinese 12/60 cutoffs apply. Opener comparisons use explicit Simplified Chinese discourse prefixes, otherwise the first two characters; they are labelled prefix comparisons, not word tokenization.
- No existing fourteen-language profile, HARD threshold or score formula changes. New segmentation tailoring is isolated to the seven new locales.
- Unknown language/path, invalid text, missing profile, and new-language inputs too short to measure return exit 2. A skipped or unavailable measurement never becomes PASS.
- Source tails use anchored headings. Substantive headings about income sources or legal bases stay in the measured body. Markdown destinations and bare URLs are excluded from length while terminal punctuation stays available to the splitter.
- Sentence segmentation protects locale abbreviations, initials, decimal/grouping points and URL interiors; quoted reporting clauses and terminal abbreviations need fixtures. This remains a heuristic: uncommon names, ambiguous abbreviation-final sentences, ellipses and quotations require actual sentence inspection.

## Validation sequence

1. Run the new tests against the untouched restored candidate and retain the expected unsupported-locale failures.
2. Add isolated profiles/segmentation, then rerun all neutral fixtures, preprocessor/CLI rejection contracts and original fourteen-language profile fixtures.
3. Compare every existing supported article's metrics and score with the immutable baseline. Thai unavailable inputs remain unavailable; engine metadata changes are disclosed rather than hidden.
4. Record SHA verification, test output, all regression differences and unresolved limits. Root reviews the result and decides whether to install it in the shared path.

## Next seven: da/nb/fi/pl/cs/ro/uk

Before implementation, all 22 production files matched the root installation record and the shared tool byte-for-byte. `variety/baseline21/` preserves those exact files. `variety/BASELINE21.json` freezes their digests and the source SHA, metrics and scores/errors of all 1,409 existing 21-locale articles. It does not include manuscripts in the seven new locales.

`variety/NEXT7-FIXTURES-FROZEN.json` records the neutral fixture and test digests. The final preimplementation fixture set has 58 literal sentence cases, 14 Unicode word arrays, 14 opener cases, 14 source-tail positives and 14 negatives, and 21 contrast cases. Each locale also has actual URL, citation, caveat, hypothetical and formula-ending checks. Two terminal-abbreviation/closing-quote cases were added before production changes; their earlier fixture hash and reason are retained. A later comment-only correction removes an inaccurate human-authored label; no fixture or executable test statement changed.

These seven profiles retain the existing 8/32 orthographic-unit cutoffs, all HARD limits and the score formula. They use explicit source-heading and rhetorical patterns, locale abbreviations, numeric contexts and Unicode comparisons. `nb` means Bokmål; `no` and `nn` remain unavailable. Ukrainian has its own profile. The only splitter extension is an optional closing-quote field for Danish `«` and Czech `“`; profiles without that field execute the same prior behavior. See `variety/MULTILINGUAL-METHOD.md` for language-specific primary references, unit decisions and limitations.

The neutral contract failed first because the locales were unsupported (`tests-next7-red.txt`, 42 assertion failures). Adding the seven profiles exposed four quotation-boundary failures (`tests-next7-quotes-red.txt`), then the isolated closing-quote change resolved those failures. The complete suite now has 25 test methods. Expected sentence arrays, real preprocessing, unknown-code exit 2, unmeasurable-input exit 2, actual repetitive-prose failure, and exact 8/32 classification edges are checked without target manuscript scores.

`variety/existing21-regression.json` compares the old and new implementations on the same bytes of all 1,409 baseline-listed articles: 1,378 measured, 31 Thai unavailable in both, zero engine metric/score differences. Six source files changed during parallel manuscript work (fil704/706, tr704/705/706, zh-hans706); their old/current hashes are recorded separately. Unchanged source files reproduce their frozen results. All 22 baseline copies, all 22 shared files, all 17 old profiles, the neutral fixtures, and HARD/score ASTs are verified. This is engineering regression evidence, not article publication or human-language approval.

Root reviews the task-local 28-locale candidate and alone decides whether to install it. New 7-locale ARC manuscripts remain a separate staging activity, outside this tooling task.

## Remaining 21 locales

The overall registry has 49 locales. This candidate supports 28; 21 remain explicit unavailable inputs: bn, bg, ca, el, et, fa, he, hr, hu, is, km, lt, lv, mn, my, ne, sk, sl, sr, ta, ur.

For whitespace languages, each next addition needs a fixed variety/register, neutral expected sentence/unit arrays, abbreviation and source-tail positives/negatives, native-script opener/contrast expressions and numeric/citation tests before target scores. Unicode punctuation differs: Greek `;` can end a question; Hindi/other Indic danda rules are not automatically valid for every Indic language. Persian/Urdu need their own letterforms, joiner and punctuation handling; Hebrew/Arabic-script direction does not change logical character order. Russian support is not a substitute for Ukrainian, Bulgarian or Mongolian profiles.

Khmer and Burmese require an explicit segmentation decision and reviewed neutral evidence. Do not apply space-delimited Latin units or Thai dictionaries to them. If reliable sentence boundaries cannot be produced, keep exit 2 and use source-hash-bound reviewed maps, preserving the complete text. Any word-unit engine must be named/versioned and assessed independently of target article scores.

No target-specific boundary patch, threshold relaxation, ignored legal text, fabricated reviewer approval or English/Korean fallback is permitted. Measurement is one input to the sentence-variety self-check, not legal or native editorial approval.

## Earlier 14-to-21 verification

- `variety/tests-red.txt`: the restored baseline failed the requested six-locale tests because those locales were unsupported (55 assertion failures), before implementation.
- `variety/tests-sv-red.txt`: the Swedish addition failed before implementation; a real source-handle `ResourceWarning` was also captured and then fixed using a context manager. This does not change measured output.
- `variety/tests-green.txt`: all 18 test methods passed, including all original language-profile sentence/unit/body fixtures, new neutral fixtures, unknown/invalid input rejection, preserved Thai missing/unapproved-map rejection, and actual repeated-prose failure.
- `variety/existing-regression.json`: all 1,231 existing fourteen-locale articles compared; 1,200 measured, 31 Thai inputs unavailable in both implementations, zero metric/score differences. All 14 restored baseline files and all 10 existing profiles match their frozen SHA-256 values. HARD and score ASTs are identical.
- New article scores were not used to define the profiles. No article-level native-language, legal, or publication PASS is claimed here. The root installation record documents the later installation of this first expansion.

Reproduce from `tooling/variety/` using the working Node runtime:

```sh
PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -v
PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH PYTHONDONTWRITEBYTECODE=1 python3 tests/compare_twenty_one.py
PYTHONDONTWRITEBYTECODE=1 python3 variety_metrics.py check <article.md> --lang da
```

Use the exact target locale; the latest new values are `da nb fi pl cs ro uk`. `NEXT7-VERIFICATION.json` and `tests-next7-green.txt` record the latest execution and artifact digests. `tests/compare_existing.py` retains the earlier fourteen-locale comparison; the new comparison adds the installed 21-locale snapshot, rather than replacing that history.
