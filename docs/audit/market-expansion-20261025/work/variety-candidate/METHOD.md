# Task-local measurement extension, 2026-10-25

Scope: `fil`, `he`, `nl`, `pl`, `cs`, `lt`. This directory contains a candidate,
not an installation of the shared official checker. The original fourteen
locales and their profiles remain in the baseline snapshot. No target
manuscripts or article scores were read to construct this extension.

## Invocation and verdicts

```
python3 /Users/son7/tseng-market-expansion-20261025/work/variety-candidate/variety_metrics.py check FILE --lang fil
```

Replace `fil` with one of the six languages. The wrapper first invokes the
original `/Users/son7/tseng-lanes-shared/variety/variety_metrics.py`. Only its
explicit unsupported-language exit 2 allows the task-local extension to run.
The wrapper labels both the original unavailable result and the local scope.
It does not convert unavailable measurement into PASS. If the shared checker
gains support, this wrapper withholds its local result and asks the operator
to use the current official checker. Existing locales are sent directly to
the official checker. Corpus mode is deliberately unavailable through this
guarded entrypoint; the copied implementation retains its existing corpus API
for technical comparison, which never certifies HARD limits.

Candidate check exits are unchanged: 0 means measured without a HARD failure,
1 means a HARD failure, and 2 means measurement unavailable. The six new
locales return 2 for fewer than five measured sentences. Neither a numerical
PASS nor this technical review is a native-speaker, lawyer or editorial PASS.
Final prose/legal reviews remain necessary and independent.

## Frozen units and thresholds

The original HARD dictionary is unchanged: length CV at least 0.45; short
share at least 0.08; similar-length runs at most 0.30; paragraph-opener count
at most `max(2, paragraphs // 8)`; consecutive identical starts at most 2;
citation endings at most 0.45; selected contrast formulae at most 3. No new
language has a threshold override, body exception, article fingerprint or
target-specific sentence substitution. Short and long cutoffs remain 8 and
32 orthographic units. These are operational heuristics, not validated
cross-language equivalence or a readability calibration.

Letters, numbers and combining marks stay together. Internal apostrophes and
decimal/grouping punctuation retain the original lexical rules; currency
symbols are not units. Whitespace, including narrow or nonbreaking spaces,
separates units. Filipino retains written hyphenated compounds/reduplication,
following the same operational option already used for Indonesian. Numeric
ranges still split. Dutch, Polish, Czech and Lithuanian hyphens split; long
Dutch compounds remain a single unit. Hebrew maqaf splits, and attached
prefixes/clitics are not morphologically separated. Hebrew geresh/gershayim
and ASCII quotes inside Hebrew letters stay within an orthographic unit;
trailing geresh/ASCII apostrophe is preserved. This can make quoted Hebrew
words ambiguous; quote punctuation is not a syntactic parser. The practice
follows the tailoring permitted by UAX #29, not a claim to implement all of
UAX #29's default word-boundary rules.

## Sentences, source tails and rhetorical signals

Each new JSON profile specifies its own abbreviations, terminal abbreviations,
strictly anchored standalone source headings, contrast patterns, caveat
openers, hypothetical openers, formula closings, and native article labels.
Substantive headings such as funding sources or a claim's legal basis are
negative fixtures and stay in the measured body. Headings, lists, tables,
frontmatter and sources retain the prior metric scope; source URLs are never
removed from manuscripts or rewritten by this tool.

Czech calendar ordinals before a named month, spaced numeric dates and numeric
ordinals before lowercase common nouns are protected. Treating a dot after a
digit before a lowercase word as ordinal punctuation is heuristic; an unusual
lowercase sentence after a bare terminal number needs manual inspection.
Czech/Lithuanian closing quotes and selected Hebrew quote/reporting
verbs are recognized. Terminal multi-dot abbreviations can end a sentence
before a capitalized next sentence; internal abbreviation periods remain
protected. Hebrew has no capitalization, so Latin terminal abbreviations in
otherwise Hebrew prose remain ambiguous. Initials, ellipses, unusual quoted
attributions, uncommon abbreviations and punctuation without expected spacing
still require inspection of actual extracted sentences.

The new profiles normalize NFC for linguistic comparisons. Sentence splitting
matches an NFC view and maps boundaries back through canonical decomposition
lengths to untouched original slices. Token arrays and source bytes preserve
the input; no manuscript normalization occurs. The four original locales and
the ten prior extensions retain their previous normalization behavior.

Native article labels are additional citation signals, including Lithuanian
number-before-article forms. Nested parentheses, other suffix-style article
numbering and citations with nonnumeric Hebrew letters are not exhaustive
here. A source link supported by the existing shared
citation recognizer can still count. Formula counts detect selected surface
patterns only; zero is not proof that a paragraph has no contrast or boilerplate.
General-information and email-contact phrases flag formula closings, as in the
original English implementation. They are prompts for contextual inspection,
not grounds to remove a useful email next step or a required disclaimer.

## Fixture provenance and review boundary

`fixtures/author_profiles.py` manually specifies neutral expected sentences,
tokens, source-tail positives/negatives and rhetorical positives/negatives.
It does not call the candidate. `evidence/fixture-freeze.json` was written
before first candidate execution. The fresh reviewer proposed preserving
trailing Hebrew geresh before the first run; the initial expected arrays are
retained and the amendment is separately recorded. The new fixture examples
are about stationery, not target legal prose.

Existing neutral fixtures and fail-closed Thai contracts were copied from the
previous independently reviewed VI measurement task. Their source files and
hashes are in `evidence/provenance.json`; original profile files are copied
byte-for-byte. The synthetic Thai approvals in tests are neutral fixtures,
never approvals for any manuscript. Thai production map/review hash bindings
remain unchanged.

The first technical run found one new defect: decomposed Czech `čl.` was not
protected as an abbreviation, lowering citation-ending recognition. The input
and expected result were preserved; the NFC-to-original boundary mapping fixed
the candidate. Initial failure and later results are both retained.

The author runs `test_candidate.py`, `test_extension.py`, and
`test_regression.py`. The latter compares metrics, scores, stdout and exit
codes on neutral text for all fourteen existing languages. It is not a replay
of the current article corpus. Full old-language behavior is supported by
isolated new-language branches, unchanged profile hashes, existing fixture
contracts and the independent code review; tests alone cannot prove all
possible inputs equivalent.

A fresh reviewer independently froze 215 additional fixtures before opening
candidate code/profiles or individual outputs. Its expected-array hash and
review are stored outside this author's owned directory in
`work/variety-review/`. This document does not self-certify that review.

The first independent run recorded 334 checks with 27 discrepancies. One
Filipino hyphen-token case was a different defensible counting convention;
the frozen compound-preserving convention remains, with the reviewer's
adjudication separate. The remaining findings produced a bounded repair to
new-language patterns: Czech non-date ordinals; number-first Lithuanian
citations; missing native contrast, source-heading and opening/closing forms.
Original expected fixtures were not changed. The before/after profile hashes
and unchanged expectations are recorded in
`evidence/independent-review-r1-repairs.json`.

## Primary references consulted

- [Unicode UAX #29](https://www.unicode.org/reports/tr29/), especially language
  tailoring, Hebrew marks, and the limits of default word/sentence boundaries.
- [KWF Manwal sa Masinop na Pagsulat](https://kwfwikaatkultura.ph/download/21720/?tmstv=1710437195),
  chapters on hyphens and abbreviations. Dotted variants encountered in prose
  can be recognized without recommending them as the preferred orthography.
- [Vlaanderen Team Taaladvies: afkortingen](https://www.vlaanderen.be/team-taaladvies/taaladviezen/teksten-schrijven/formulering/afkortingen-gebruik),
  native Dutch abbreviation forms and ambiguity cautions.
- [Ústav pro jazyk český: graphical abbreviations](https://prirucka.ujc.cas.cz/?id=780),
  abbreviation punctuation and sentence-final abbreviation periods.
- [University of Gdańsk: Polish abbreviations](https://fil.ug.edu.pl/wydzial/instytuty/instytut-filologii-polskiej/dzialalnosc-instytutu/porady-jezykowe/ortografia/skroty-i-skrotowce),
  including single-final-period `itd.` and exceptional multi-dot forms.
- [Lithuanian Court of Appeal language guidance](https://www.apeliacinis.lt/ar-gali-atskirose-eilutese-likti-t.-y.-buti-nesujungti-jungiamuoju-tarpu-skaitmenys-ir-zodziai-pvz.-straipsnis-dalis-punktas/1496),
  examples of date/article and multiword abbreviations in institutional prose.
- The Hebrew Academy punctuation page was found in search, but direct opening
  returned an internal error. Hebrew technical tailoring is grounded here in
  the accessible Unicode source and separately reviewed neutral spelling
  examples; no claim of a fresh full Academy-document read is made.

These references support orthographic choices. They do not validate the
numerical editorial thresholds or current law, and are not article citations.
