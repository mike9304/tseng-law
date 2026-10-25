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
and uses the unchanged dictionary-word contract. At that 28-locale stage, of the 49 public locales, the
remaining unsupported 21 were bn, bg, ca, el, et, fa, he, hr, hu, is, km, lt, lv,
mn, my, ne, sk, sl, sr, ta and ur.


## Batch03 expansion (2026-10-25): bg/ca/el/hr/hu/is/sk

The root-installed 28-locale version was matched exactly against all 29 receipt
files in both R and shared before copying. `RESTORED-BASELINE28.json` records
that provenance; `baseline28/` and `BASELINE28.json` retain immutable engine and
current-input baselines in the task audit. This section is self-contained in
the installed method file; the separate `METHOD-BATCH03.md` is the frozen
pre-implementation audit contract.

Contract recorded before profiles or new target-article measurements, 2026-10-25 KST. AI-authored engineering fixtures; root review and shared installation are separate. Orthographic references justify particular punctuation/word handling, not editorial thresholds or native/legal approval.

### Primary references read and their bounded use

| Locale | Primary reference and observation | Measurement decision |
|---|---|---|
| bg | Bulgarian Academy of Sciences Institute for Bulgarian Language: [abbreviation-final dots](https://ibl.bas.bg/ezikovispravki/vaprosi/pri-skrashcheniya-min-dfn-9), [spacing and quotation marks](https://ibl.bas.bg/pishi_pravilno/po-intervalite-posreshtat-po-zapetaite-izprashtat/). One dot can serve both abbreviation and sentence; the described closing quote is U+201C. | Listed title/reference abbreviations do not end a sentence; listed terminal forms and a year-conditioned `г.` can. Add `“` as closing quote. Whitespace separates orthographic tokens. |
| ca | IEC [preparation of originals, §§1.6–1.9](https://criteria.iec.cat/wp-content/uploads/2014/07/1-1-3_Preparaci%C3%B3-dels-originals_Any-davant_011.pdf) covers abbreviation dots, ela geminada, typographic apostrophe and numeric separators. Generalitat [ordinal abbreviations](https://aplicacions.llengua.gencat.cat/llc/AppJava/index.html?action=Principal&document=abrevia.pdf&method=criterislinguistics&pagina=31&titol=Sigles.+Apostrofaci%C3%B3) was available as an indexed primary-source excerpt; direct open returned a cache miss. | `l·l` stays within a word, but arbitrary `a·b` does not. Apostrophe/hyphen compounds use the existing orthographic policy. Bounded ordinal contexts cover `2n. pis`, `5è. capítol`, `2n. Congrés`; a terminal `1r.` still ends a sentence. |
| el | Centre for the Greek Language [Triantafyllidis grammar](https://www.greek-language.gr/greekLang/files/document/modern_greek/grammatiki.triantafyllidi.pdf), indexed punctuation section: Greek questions end with `;`. The primary [dictionary entry](https://www.greek-language.gr/greekLang/modern_greek/tools/lexica/triantafyllides/search.html?lq=%CE%B5%CF%81%CF%89%CF%84%CE%B7%CE%BC%CE%B1%CF%84%CE%B9%CE%BA%CF%8C) corroborates this in the search excerpt; direct dictionary access returned 403 and PDF text extraction was empty. [Unicode Greek/Coptic names](https://unicode.org/Public/18.0.0/charts/nameslist/0370/) identifies U+037E and U+0387. | `;` and U+037E are Greek terminators/question signs; raised U+00B7/U+0387 dots are not full stops. Apply only to el. The same contract must reach question counts, question opening and citation-tail detection. |
| hr | Institute of Croatian Language [abbreviations](https://pravopis.hr/pravilo/kratice/49/) and [period](https://pravopis.hr/pravilo/tocka/55/) explicitly describe dots after abbreviations and Arabic/Roman ordinals. | Listed abbreviations and bounded ordinal followers preserve interior dots. `itd.` may end a sentence; a cardinal or year at a real sentence end must still split. Closing `“` is supported alongside existing forms. |
| hu | Hungarian research-institute [AkH. 12](https://helyesiras.mta.hu/helyesiras/default/akh12), §§267 and 290–294, covers abbreviation/ordinal dots and number/date presentation. | Protect listed abbreviations, bounded Arabic/Roman ordinal and date contexts. Comma/period within digits is one numeric unit; spaced groups remain separate units. This does not parse Hungarian morphology. |
| is | Árni Magnússon Institute [Ritreglur](https://ritreglur.arnastofnun.is/), §§22 and 28, describes ordinal/abbreviation dots, grouped numbers/time and `„…“` quotes. A final abbreviation/ordinal does not gain a second full stop. | Explicit abbreviations and terminal currency/enumeration forms, bounded Arabic/Roman ordinal contexts, and U+201C closing quote. Neither compound richness nor inflection receives an invented weight. |
| sk | Ľudovít Štúr Institute [PSP 2013 description](https://www.juls.savba.sk/psp_2013.html) identifies the unchanged fourth edition; its accessible [text PDF](https://www.juls.savba.sk/ediela/psp2000/psp.pdf), punctuation §2.1, describes abbreviation and Arabic/Roman ordinal dots. | Listed abbreviations and bounded ordinal contexts; `atď.` can finish a sentence. Preserve accents and closing `“`. The PDF is labeled third edition 2000, not misrepresented as a new 2026 rule. |

No missing web content has been represented as fully read. The sources describe writing conventions; profiles are a finite AI-authored selection of common signals and neutral fixtures, not a complete implementation of the reference grammars. Source headings, contrasts, caveats and formula signals are separately authored editorial heuristics, not official classifications.

### Units, boundaries and exclusions

All seven count Unicode orthographic units using letter/number starts, attached combining marks, existing internal apostrophes and opted-in hyphens. Digit ranges use separate endpoints. Internal decimal/group punctuation is retained; normal, nonbreaking and narrow nonbreaking spaces all separate units, so `1 000` is two units while `1.000` is one. These are transparent conventions, not equivalent linguistic or semantic lengths.

Catalan ela geminada protection is limited to U+00B7 between two `l`/`L` letters. Precomposed `ŀ`/`Ŀ` are already letters. A middle dot between arbitrary letters stays a separator. Greek raised dots remain separators and do not inherit this Catalan option.

The 8-word short / 32-word long edges, CV 0.45, all HARD conditions and the score function remain inherited. No reference establishes those numbers, and no new target manuscript was read to choose them. A measured exit 0 means only no implemented HARD condition failed. A low score does not certify readability, legal preservation or human-language quality.

Sentence slicing preserves the original bytes' Unicode spelling (decoded text), including decomposed accents. New optional abbreviation/ordinal patterns match NFC and NFD spellings without normalizing away slice offsets. Quote endings remain attached, and the existing lower-case reporting-clause heuristic keeps a quoted question with its attribution. This is not a syntactic quotation parser; proper-name reporting clauses, unusual abbreviations, arbitrary Roman numbers, ellipsis ambiguity and unspecified ordinal followers can still need review.

Abbreviation terminal decisions use the existing next-uppercase/end heuristic. A following proper name can be ambiguous; titles are not indiscriminately made terminal. Ordinal protection is bounded by listed followers rather than a rule that swallows every number plus full stop. The same limits apply to calendar and law-number prose. New Greek terminators use opt-in fields only; other locales retain their former semicolon behavior.

Markdown link destinations are omitted while link labels and following punctuation are retained. Headings, tables, bullets, frontmatter/FAQ and recognized source tails are excluded from prose metrics by the existing contract. Source-heading patterns are anchored; each has positive and substantive-heading negative fixtures. A required source heading outside the enumerated wording needs explicit review, not a silent fuzzy match. §5 manual review must still cover excluded content and the substantive ending before structural tails.

Comparison keys use NFC plus casefold, including Greek final sigma. They are orthographic first-token keys, not lemmatization. Casefold equates case variants only; grammatical inflection can evade repetition detection. Explicit contrast templates do not count every `not` equivalent and must not match across a full stop, question, or newline. Greek question punctuation is also a regex boundary. Caveat and formula detections are partial signal counts.

### Neutral fixture and failure contract

`tests/fixtures-batch03.json` contains literal expected slices/tokens/signals authored before profiles. Library/room/book examples and abstract numbered references do not assert Taiwanese law and do not come from the new articles. NFC/NFD variants and Unicode-space tests derive only from those fixed literals, never from the implementation's own expected-value function.

Tests cover explicit locale and path dispatch, abbreviation titles/terminal forms, ordinal positive and real sentence-end negative, quote attribution, URLs, source-tail positive/negative, ordinary negation and explicit contrast, 8/9/31/32 edges, actual repetitive input failure, insufficient input, reserved markers, missing profile and unsupported CLI paths/codes. Unknown support is exit 2; no Korean/English fallback. A measured repetitive sample must remain exit 1.

The unchanged 28-locale contract is frozen against 1,572 current R files at HEAD `5e2d0f5df8c75eb4aca8304b7d9f5110ac422f90`: 1,541 measured and 31 Thai files unavailable for lack of approved boundary maps. That unavailable status is part of the baseline, not PASS. Historical BASELINE21 has 22 changed input files; their hashes are recorded independently from engine comparisons. Identical current frozen input bytes, not an old article paired with a new article, are used for regression.

### Implementation and verification notes

Three engine files gain opt-in profile handling: Greek sentence/question and
URL-tail punctuation; Catalan internal `l·l`; Unicode-canonical abbreviation
and finite ordinal matching. The new profiles opt into Unicode whitespace
after terminal abbreviations. Existing profiles have none of these new flags;
their bytes and the score/HARD definitions remain unchanged. No universal
syntax or morphology parser is introduced.

The neutral-test chronology records initial unsupported-locale failures, then
feature failures with profiles present. Later neutral edge tests were fixed
before their fixes: nonbreaking spaces after final abbreviations, U+037E after
a bare URL, and an NFD Catalan ordinal follower ending in an accent. The only
changed initial literal expectation was Greek final sigma in an opener key:
`όμως` must casefold to `όμωσ` under the declared comparison contract. Its
original fixture bytes, reason and both hashes are retained; no sentence
expectation or manuscript score was changed to obtain a pass.

`tests/compare_twenty_eight.py` requires explicit `--repo-root R` or
`TSENG_REPO_ROOT=R`, and rejects a mismatching repository. It measures the same
frozen bytes through both implementations and records current/historical
source edits separately. The installation package includes 36 production
files; task evidence, snapshots and test files stay in the audit directory.
`BATCH03-VERIFICATION.json` and `BATCH03-REPORT.md` bind final results and SHA
values after verification. Shared installation remains a root decision.

With these seven explicit profiles, 35 of 49 locale codes are routed. Thai
remains conditionally measurable with approved maps; route support is not
proof that every existing article is measurable. The 14 unsupported codes
remain bn, et, fa, he, km, lt, lv, mn, my, ne, sl, sr, ta and ur. They retain
exit 2; no fallback or unsupported-language PASS is introduced.


## HR/HU ordinal correction after boundary review (2026-10-25)

Reported target fragments exposed an oversegmentation defect after the initial
35-locale package was installed. That later exposure is disclosed; it does not
retroactively change the earlier package's no-target-reading record. The fix
was specified using newly supplied neutral HR/HU examples and the official
Croatian period rules and Hungarian AkH. §§267/292. No article or threshold was
edited and no target score selected a boundary rule.

Only HR/HU opt into `dotted_ordinal_lowercase_continuation`: a dotted Arabic or
uppercase Roman numeral stays internal before a whole lowercase word after
horizontal Unicode whitespace. This covers inflected nouns, adjectives,
coordinated ordinals and continuing dates. It leaves uppercase or mixed-case
next words and newline boundaries unchanged. HR additionally recognizes a
finite reference noun (selected forms of article, paragraph, point, chapter or
rule), followed by an ordinal/ordinal list and a capitalized genitive document
kind: Zakona, Priručnika, Pravilnika, Statuta, Ustava, Uredbe or Pravila. A
nominative document noun beginning a new sentence is not protected by that
new pattern. Returned spelling, whitespace within slices and word units are
preserved; the score, HARD limits and all other locale flags are unchanged.

These are contextual orthographic heuristics, not a parser. A lowercase brand
at a sentence start, unusual casing, a genitive document phrase beginning a
fresh sentence, unlisted title types and ambiguous Roman strings still need
human inspection. A matching title context may be ambiguous; no claim is made
that every reference or sentence boundary is settled. Selected genuine
endings, uppercase conjunctions, mixed-case names, Unicode forms and actual
Markdown preprocessing are tested separately from the positive examples.

The task audit's `METHOD-ORDINAL-FIX.md`, `ORDINAL-FIXTURE-FREEZE.json`, and
`ORDINAL-FIX-VERIFICATION.json` contain provenance, chronology, exact file SHA
values and same-input impacts. Tests passing is not native/legal approval.


## Icelandic ordinal and final `gr.` correction (2026-10-25)

A follow-up after the installed HR/HU correction addresses IS reference chains
and real sentence endings after `gr.`. Reported manuscript fragments were seen,
but the rule was fixed using independent neutral literals and official
Ritreglur §§1.2.1, 22.2–22.6 and 26.1.1 before target impact scores. IS opts into
the existing lowercase dotted-ordinal continuation branch and declares `gr`
a possible terminal abbreviation.

A new optional `nonterminal_abbreviation_followers` mapping prevents a declared
abbreviation from being terminal in a finite following context. IS uses it
only for `gr` followed by a hyphenated letter-prefix document compound ending
in the genitive `reglnanna`. The prefix is unrestricted by literal name; a
nominative `reglurnar` starting a new sentence does not match. Matching uses
NFC comparison text without rewriting original slices. Other profiles leave
this mapping unset. Quotes, semicolons, dates, times, amounts and true ordinal
endings retain their tested contracts.

This remains a finite heuristic: unlisted names and ambiguous title phrases
need manual boundary review. It does not parse Icelandic syntax or certify
all abbreviations. No word units, score, HARD limits, thresholds or manuscript
bytes change. The isolated IS audit records pre-fix failures, the capitalized
title counterexample failure after a first profile-only change, full tests,
fixed code hashes and paired same-input impacts. Native/legal approval and
publication readiness remain separate.
