# Additional-language measurement contract

The original ko/ja/en/zh-hant calculations and HARD limits are preserved. A
regression comparison covered all 875 current source articles in those four
directories and found no metric, score, or directory-routing differences.

New routing covers th/id/hi/fr/de/it/es/pt/ar. Unknown paths need an explicit
`--lang`; an unknown language must not silently become Korean. Exit 2 means
measurement is unavailable and cannot be reported as an editorial PASS.

## Units and thresholds

For the additional languages, sentence length is a count of orthographic lexical
units. A very short sentence has at most 8 units; a long one has at least 32.
These operational cutoffs were fixed before running the candidate on the 45
target articles, and independently assessed using neutral language examples.
They are heuristics, not an empirical calibration or proof of equal semantic
load across languages. German compounds, Arabic attached clitics, and Thai
dictionary segmentation have explicit limits. The existing numerical HARD
limits are not relaxed: CV >= 0.45, short share >= 0.08, even runs <= 0.30,
repeated paragraph opener limit, consecutive same starts <= 2, citation-ending
share <= 0.45, and contrast expressions <= 3.

Letters, digits, and combining marks stay together. Internal straight/curly
apostrophes stay within a unit. Decimal/grouping punctuation between digits is
retained; currency symbols are excluded. Whitespace always separates units,
including narrow spaces inside French thousands. Indonesian hyphenated
orthographic compounds/reduplication are retained by its profile; other new
Latin-script profiles split hyphens. These conventions are in the frozen token
fixtures. A metric failure is a prompt for a meaningful editorial repair;
legal conditions, amounts, exceptions, citations, and truthful service limits
take precedence over numerical style.

## Sentence boundaries and source tails

Non-Thai languages use Unicode punctuation and independently supplied locale
abbreviations. The splitter handles Hindi danda without following whitespace,
Arabic question marks, decimals, German calendar ordinals, and quoted text.
Sentence-final abbreviations such as etc./ecc./usw./dsb. retain a boundary before
a new capitalized sentence. Ambiguous abbreviations and quotation syntax remain
heuristic; fixtures and actual extracted sentences require review.

Anchored source-heading profiles remove only the structural source tail from
measurements. They do not remove or rewrite the manuscript's sources. Headings,
lists, and tables retain the existing metric scope. First-word comparisons for
the new languages use case-folded lexical units, not Latin-only regexes or the
first two code points of a script.

Thai does not use a punctuation-only fallback. Each original paragraph needs
independently reviewed sentence slices whose normalized concatenation exactly
preserves that paragraph. The review record is tied to the SHA-256 of the entire
source file. Missing, stale, incomplete, unapproved, or unresolved maps produce exit 2. The source SHA covers original file bytes, including newline encoding.
Source-only date labels in a map never re-enter a body already cut at its source
heading. Maps are discovered at FILE.sentences.json or, inside a Git worktree,
`docs/audit/variety-segments/SOURCE_SHA256.json`; `--sentences MAP` can supply a
specific reviewed record explicitly. Every map also binds an approval manifest by path and SHA-256; that manifest identifies the exact source SHA, canonical paragraphs-array SHA, approved method, independent reviewer, and no unresolved boundaries. Its independent review report and any required author adjudication report are also hash-checked at execution. Relative artifact paths are resolved from the referring file. These bindings detect stale or altered artifacts; they do not cryptographically authenticate reviewer identity.

Thai word units use the already-installed Node `Intl.Segmenter('th')` dictionary
engine, not a downloaded dependency. Only `isWordLike` tokens are counted. Engine
Node/ICU/Unicode versions are recorded. The independent neutral fixtures used
Node 25.9.0 / ICU 78.3 / Unicode 17.0; changes to those outputs require review.
The other languages use Python's standard library. Thai ICU units are not a gold
linguistic lexicon: common compounds can split differently by context.

## Evidence and limits

Independent profile reviewers did not inspect target article scores. Thai
boundary ambiguity is adjudicated by the original drafter and independently
reviewed before article-level hard verdicts. This is AI editorial work, not a
claim of human native-speaker or lawyer review. Existing independent article
reviews and final legal-source reviews remain separate from the automatic tool.

The candidate's 162 fixture/contract checks include independent expected sentence
and word arrays, source-tail extraction, all nine language routes, unchanged
HARD values, missing/stale/truncated/unresolved Thai map rejection. They do not
constitute visual QA, current remote integration, or public publication.

Technical references: Unicode UAX #29 (https://www.unicode.org/reports/tr29/)
documents the need for language-specific tailoring; PyThaiNLP's sentence-tokenizer
documentation (https://pythainlp.org/docs/5.3.4/api/tokenize.html) illustrates why
Thai sentence detection requires more than Latin punctuation rules. No external
model or package was installed to bypass unavailable command networking.

Numeric ranges separated by a hyphen remain separate numbers, including in Indonesian. New-language citation-end recognition includes Hindi danda and Italian singular/plural article labels. Invalid UTF-8 and new-language inputs too short to measure return exit 2 in check or corpus mode. Legacy four-language short-input skips retain exit 0 for compatibility; a skip is never a measured PASS. Corpus mode produces metrics and reports measurement errors; it does not certify HARD limits.


## Vietnamese addition (2026-10-24)

Routing now also includes `vi` / `columns-vi`. A separate Vietnamese editorial
author supplied 15 neutral sentence examples, 14 orthographic-unit examples,
18 positive/negative source-tail cases, and 16 rhetorical-signal examples before
seeing any of the target articles or their scores. A fresh independent Vietnamese
reviewer approved the exact profile and expected arrays. The author and reviewer
are AI editorial roles, not a human-native or lawyer certification.

Vietnamese counts are explicitly labelled `orthographic_syllabic_units`. Spaces
often separate tiếng within a multi-syllable semantic word; foreign words,
numbers and abbreviations are not all syllables. The existing operational 8/32
cutoffs and every HARD value remain unchanged. They do not establish equal
semantic load or an empirical Vietnamese readability calibration.

VI-only tailoring preserves terminal `v.v.` / `v. v.` boundaries before a new
capitalized sentence, treats a short named speaker plus an explicit reporting
verb after a quotation as an attribution clause, and normalizes NFC only for
linguistic comparisons/source-heading matching. Original source bytes, extracted
sentences, combining marks and token arrays are preserved. The quotation rule
is a heuristic for short subjects, not a syntactic parser; sentence-final title
abbreviations, unusual names, ellipses and ambiguous reporting clauses still
need editorial inspection. No target-specific sentence substitutions exist.

The technical candidate passed 247 neutral fixture/contract checks, including
all prior fixtures, unchanged HARD values, unknown-language and invalid-map
rejections, Unicode normalization checks and the independently supplied VI
positives/negatives. Exact language review evidence is in the task-local
`tseng-arc-visas-20261024/work/vi-measurement/` profile author/review records and
installation receipt. Existing-locale regression results are recorded separately;
unsupported/missing-boundary inputs are never counted as measured passes.

Source-tail recognition deliberately accepts only standalone reviewed headings;
it leaves substantive headings such as “Nguồn vốn của dự án” and “Cơ sở pháp lý”
in the body. Contrast signals are selected formula detectors and can miss an
unmarked contrast; count zero is not proof that prose contains no contrast.
