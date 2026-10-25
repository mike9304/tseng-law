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

## Task-local expansion (2026-10-25): ru/ms/fil/tr/nl/zh-hans/sv

The complete fourteen-language candidate above is preserved in `baseline14/`,
with original file digests in `RESTORED-BASELINE.json`. Root subsequently installed
this 21-locale version at `20261025-204858`; the task audit's
`checks/variety-installation.json` records the exact installed hashes. Its
profiles remain AI-authored engineering contracts, not a claim of independent
native-speaker or legal approval. The older profiles
retain their original provenance; their files, HARD limits and score function
are unchanged.

Russian, Malay, Filipino, Turkish, Dutch and Swedish count Unicode orthographic
units. Combining marks, internal apostrophes and hyphenated compounds stay
together; numeric `3-5` remains two numbers. Decimal/grouping punctuation between
digits stays inside the number, but whitespace always separates units (Swedish
`1 250,50` is two units). Currency symbols are excluded, while attached letter
codes such as `RM1,250.50` form one orthographic unit. Short/long remain 8/32.

Simplified Chinese follows the original Traditional Chinese character unit:
non-whitespace code points with ASCII/fullwidth parentheticals removed.
Punctuation and Latin letters count. This is not a word segmenter, Unicode
grapheme count, or an empirical readability calibration. Short/long are 12/60.
Its opener is a selected discourse/content prefix, otherwise the first two
characters. Other new openers use the first orthographic unit, NFC-normalized
for comparison; Turkish casing explicitly distinguishes I/ı and İ/i. Original
text and extracted sentence slices are not Unicode-normalized or rewritten.

The additional splitter is isolated in `variety_expansion.py`. It protects
decimal points, listed abbreviations and initials. Compound terminal
abbreviations retain their final sentence stop before an uppercase start;
Russian `г.` uses the preceding year to distinguish a date from a city label.
Turkish selected numeric ordinal contexts are protected. CJK full stops and
question/exclamation marks do not require spaces. Closing quotes stay with
their sentence; a lowercase reporting clause, including a Russian dash, stays
with the quotation. Single-letter sentences, unlisted abbreviations, ellipses,
unusual names and some quoted attributions are ambiguous and need inspection.

Markdown destinations and bare URLs do not count as prose. Their surrounding
terminal punctuation is retained, so URL removal cannot silently join two
sentences. Source headings are exact anchored phrases: a substantive section
about income sources or legal bases is not removed. Parenthetical text is
excluded from Chinese length only; its citations still contribute to citation
metrics. Headings, lists and tables retain the pre-existing measurement scope.

Every new locale has positive and negative neutral examples in the tests.
Contrast matches count selected constructions, not all semantic contrasts;
ordinary negation is not itself a contrast. Numeric style criteria must not
be satisfied by deleting legal qualifications, numbers, citations or prose.
Unknown locales/paths and unmeasurable new inputs remain exit 2. At this stage,
28 public locales remained unsupported pending their own contracts.

## Task-local next seven (2026-10-25): da/nb/fi/pl/cs/ro/uk

The installed 21-locale files were verified against the root installation record
and copied exactly into `baseline21/` before changes. `BASELINE21.json` freezes
their hashes and all 1,409 existing source hashes/results. The next seven
profiles and neutral examples are AI-authored engineering inputs, awaiting root
review; no independent native-speaker or legal approval is asserted. They were
defined without reading new seven-locale manuscripts or choosing limits from
their scores. `NEXT7-FIXTURES-FROZEN.json` records the fixture chronology.

### Orthographic units and fixed 8/32 boundaries

All seven use the existing Unicode orthographic scanner with `join_hyphens`.
Letters, digits and combining marks remain together. Internal straight, curly
and modifier-letter apostrophes are preserved. Hyphenated forms containing
letters stay together; digit-only ranges such as `3–5` are two units. Decimal
and grouping punctuation between digits remains internal, but every Unicode
whitespace character separates units, including NBSP and narrow NBSP. Thus
`1 250,50` is two units and `1.250,50` is one. Currency symbols do not count.
NFC and case-folding apply to comparisons and heading matching; they do not
rewrite source bytes or the returned sentence/token strings.

The count is labelled `orthographic_words`, not morphological words or equal
semantic content. Finnish inflection and long compounds can put substantial
content in one unit. Romanian hyphenated clitics also count as one written unit,
not one lexical word. Ukrainian apostrophe forms stay internal; Romanian
comma-below `ș/ț` are not silently converted to older cedilla `ş/ţ`. The 8/32
cutoffs inherit the existing engineering contract, frozen before target drafts.
They have no claimed native-language readability calibration. Neutral lengths
8, 9, 31, 32 and 4 explicitly test short/long classification. HARD limits and the
score function are unchanged.

### Language tailoring and primary references

The table lists selected supported cases and the primary reference consulted
on 2026-10-25. The sources inform orthography, not the 8/32 numeric cutoffs or
an exhaustive language implementation.

| Locale/register | Selected boundary and rhetoric contract | Reference |
|---|---|---|
| da, Standard Danish | `f.eks.`, `bl.a.`, terminal `osv.`, number + `kr.`; selected ordinal/date followers; `»…«`; `ikke … men/derimod` | [Dansk Sprognævn: period, ordinals and abbreviations](https://sproget.dk/typiske-problemer/punktum/) |
| nb, Norwegian Bokmål | `f.eks.`, `bl.a.`, terminal `osv.`/`m.m.`; selected ordinals; `«…»`; `ikke … men`; `no` and `nn` are not aliases | [Språkrådet: abbreviation list distinguishing Bokmål/Nynorsk](https://sprakradet.no/godt-og-korrekt-sprak/rettskriving-og-grammatikk/forkortelser/) |
| fi, Standard Finnish | `esim.`, `mm.`, terminal `jne.`/`tms.`; selected inflected month/ordinal followers; `”…”`; `ei/en/et/emme/ette/eivät … vaan`; `22 §` | [Kotus: dotted abbreviations and final punctuation](https://kielitoimistonohjepankki.fi/ohje/lyhenteet-pisteelliset/) |
| pl, Standard Polish | `m.in.`, `np.`, terminal `itd.`/`itp.`; year + `r.`; selected ordinals; `„…”`; `nie … lecz/ale` | [University of Gdańsk language advice: abbreviations](https://fil.ug.edu.pl/wydzial/instytuty/instytut-filologii-polskiej/dzialalnosc-instytutu/porady-jezykowe/ortografia/skroty-i-skrotowce?kontrast=1&page=1) |
| cs, Standard Czech | `JUDr.`, `např.`, terminal `atd.`/`Sb.`; year + `r.`; selected ordinals; `„…“`; `není/nejde … ale/nýbrž` | [ÚJČ: quotation marks](https://prirucka.ujc.cas.cz/?id=162), [periods](https://m.prirucka.ujc.cas.cz/?id=160) |
| ro, Standard Romanian | `art.`, `alin.`, `nr.`, `ș.a.m.d.`, numeric dates; `„…”`; hyphenated written forms; `nu … ci` | [Romanian Academy, DOOM3: graphic signs](https://doom.lingv.ro/studiu_introductiv/semne_grafice) |
| uk, Standard Ukrainian | `ст.`, `п.`, `див.`, spaced/unspaced `т. ін.`/`т. д.`; four-digit year + `р.`/`рр.`; `«…»` and dash attribution; `не … а` | [Official Ukrainian orthography, 2026 edition, §§7, 62–64](https://mon.gov.ua/static-objects/mon/sites/1/zagalna%20serednya/Pravopys.2019/ukrayinskii-pravopis-oficiine-vidannia-2026.pdf) |

Abbreviations are explicit, finite lists. An abbreviation's spelling may be
protected while its semantic use remains ambiguous. Only listed terminal
abbreviations recover a sentence stop before a capitalized next sentence or the
end of text. Selected year/currency contexts refine that decision. Ordinal
followers are finite lexical patterns, not a morphology parser; unlisted
inflections, Roman numerals, unknown abbreviations, single-letter sentences,
ellipsis and unusual names still require inspection of extracted sentences.

Closing quotes stay attached to their sentence. A lowercase reporting clause
following a closing quote remains part of the same sentence, with an optional
dash. This cannot decide every attribution by a capitalized name or every nested
quotation. The only new engine branch is the optional
`additional_closing_quotes` profile field: Danish adds `«`, Czech adds `“`.
The original 21 profiles do not set it and retain their previous behavior.

### Sources, URLs and actual preprocessing

Anchored source headings recognize selected standalone `Kilder`, `Lähteet`,
`Źródła`, `Zdroje`, `Surse` and `Джерела` forms, including explicit official-source
and checked-date variants. Optional heading numbers and terminal colons are
supported. Unicode normalization permits decomposed diacritics. Each locale
has positive source tails and negative substantive headings: a heading about
sources of income or legal bases must remain in the measured body. This is a
finite heading vocabulary, not a guess that every occurrence of “sources” ends
the article. It never deletes source text from the manuscript.

The actual body preprocessing is tested with frontmatter, Markdown destinations,
bare URLs and terminal punctuation. URLs are omitted from prose length while
their surrounding sentence boundaries remain. Rhetorical detectors have native
script positives and ordinary-negation negatives; they detect selected formulae,
not all semantic contrasts or every inflected phrasing. No metric can certify
legal meaning, natural prose, accurate citations or editorial variety by itself.

### Evidence and unavailable inputs

`tests-next7-red.txt` records the initial unsupported-locale failures;
`tests-next7-quotes-red.txt` records four quotation failures after profiles were
added but before the quote-tail change. `tests-next7-green.txt` records the full
25-method suite. This includes 58 literal boundary cases for the next seven,
Unicode units and whitespace, all prior fixtures, real rejection/failure cases,
and the existing Thai reviewed-map requirements. `existing21-regression.json`
records the same-input comparison of all 1,409 existing articles, with changed
source hashes reported separately. `NEXT7-VERIFICATION.json` binds current
artifact hashes, runtime versions and the recorded results.

Unknown locales and paths, missing profiles, and inputs too short to measure
return exit 2 for these additions. They never fall back to Korean or English.
Legacy four-locale short-input skips retain their old compatibility behavior;
a skip is not a measured PASS. Thai still needs its reviewed, hash-bound maps
and uses the unchanged dictionary-word contract. Of the 49 public locales, the
remaining unsupported 21 are bn, bg, ca, el, et, fa, he, hr, hu, is, km, lt, lv,
mn, my, ne, sk, sl, sr, ta and ur.
