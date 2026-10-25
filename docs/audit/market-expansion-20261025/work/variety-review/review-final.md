# Independent measurement-method review — PASS

Reviewed at 2026-10-25T13:18:37.346935+00:00. Reviewer: `/root/measure_new_locales_review`, an AI reviewer independent of the candidate author. This review covers only the task-local Filipino, Hebrew, Dutch, Polish, Czech and Lithuanian measurement method. No target manuscript or target article score was read. No claim of human-native or attorney review is made. This result is not article approval, global installation approval or publication authority.

## Decision and exact version

All material r1 findings were resolved in one targeted repair. The exact candidate identified below may be used for task-local measurement alongside independent article/locale/legal review and section-5 self-check. The shared checker still reports these six languages unsupported; keep that exit-2 result distinct from the task-local result.

| Reviewed file, relative to `work/variety-candidate/` | SHA-256 |
|---|---|
| `variety_metrics.py` | `44c287ea5f6e26b694881418acebf4c9c115b87b2a965ea0c10a43fb1830e2e5` |
| `METHOD.md` | `7696ab4bccaee2990a1040bb95a70e8ccef2c1c1c97b0e5b7e42fa140f7e9839` |
| `candidate/variety_metrics.py` | `f6a53d8265224b5795be95501f317eac018c23dba5b79513c6179fe1caa363c7` |
| `candidate/variety_multilingual.py` | `776ab3e4364d2684e0d2b913933e7acc19fc6f01008b5ba042dbc7080e05f531` |
| `candidate/profiles/cs.json` | `07aca997353f22983df868222e0aac634ca1c70f3b3e68cd2553bc075618b8b7` |
| `candidate/profiles/fil.json` | `9bb87f92fde0d17ec521c2c7b22e40c6eeb272f0b53405d480f07a4b5886cd66` |
| `candidate/profiles/he.json` | `ae6d8b60d6546a0adc9813cb16d4a11de8d7158a0fb93b45a11712bf49662983` |
| `candidate/profiles/lt.json` | `f536d937faf4c26eadb19d5c8e5a0078dcfbce901501a4a8544c456d2cd02965` |
| `candidate/profiles/nl.json` | `8ee2b7074e1ad3778998e87a1a566dff023a3c98c2525200d86c96050cf9dc2e` |
| `candidate/profiles/pl.json` | `4137b957699be3977230e27533fcfcd27fb5a3cf5a04cc930ebf4f4c55c81f1d` |

The full checked manifest is `evidence/candidate-manifest-repair-r1.json`, SHA-256 `a495573c7986ac17c8212fefeee51bad1e07f8ea53444eb6424e35ecc481f275`. Every entry was rehashed after execution; a later code/profile change requires checking the new version rather than reusing this PASS.

## Independent execution

The reviewer froze 215 expected examples before opening candidate code/profiles or individual outputs. The author supplied aggregate progress and one normalization issue during preparation; no expected arrays were derived from its outputs. The original frozen JSON remains SHA-256 `41b6641d7f683f508b1db0a68984b46eedc903cc0aee1732b57a3191bd515511`.

First run: 334 checks, 307 exact passes and 27 discrepancies. Recheck after repair: 334 checks, 333 exact passes and one explicitly accepted convention difference. An additional 114 boundary, CLI, manifest and fail-closed checks all passed. Combined: 447 exact matches out of 448 checks, one accepted method convention, zero unresolved material defects. These numbers are not article counts.

| Locale | Method verdict | Frozen expectation exact matches | Accepted convention differences |
|---|---|---:|---:|
| fil | PASS | 34/35 | 1 |
| he | PASS | 37/37 | 0 |
| nl | PASS | 34/34 | 0 |
| pl | PASS | 35/35 | 0 |
| cs | PASS | 37/37 | 0 |
| lt | PASS | 37/37 | 0 |

The mismatch retained in the raw output is `fil-words-1`. It expected a split at the hyphens in `pag-ibig` and `araw-araw`, whereas the author's pre-execution convention preserves those orthographic compounds. Independent review accepted this deliberate choice using [KWF Manwal §§11.1 and 11.3](https://kwfwikaatkultura.ph/download/21720/?tmstv=1710437195). Numeric ranges still split. The original fixture was not edited to create a pass; `supplemental-results.json` separately tests the accepted token array, and `review-final.json` records both readings. The authority supports orthographic spelling, not the numerical readability thresholds.

## What was checked and repaired

- Sentence/token/source/rhetorical positive and negative examples, including Hebrew geresh/gershayim and ASCII forms, preserved terminal geresh, Hebrew quoted attribution versus a new sentence, Czech dates and ordinary ordinals, Lithuanian abbreviations, and Dutch/Polish/Filipino legal-citation punctuation.
- The repair stops splitting Czech `2. čtení`, counts ordinary Lithuanian number-before-article citations including parenthetical endings, adds missing central contrast forms and two standalone source aliases, and broadens ancillary hypothetical/formula signals. The [Czech Language Institute's period rules](https://prirucka.ujc.cas.cz/?id=160) and [Lithuanian Court of Appeal language guidance](https://www.apeliacinis.lt/ar-gali-atskirose-eilutese-likti-t.-y.-buti-nesujungti-jungiamuoju-tarpu-skaitmenys-ir-zodziai-pvz.-straipsnis-dalis-punktas/1496) support the relevant punctuation/order findings. Exact r1 file:line findings and examples remain in `review-r1.md`.
- Supplemental additive-versus-contrast negatives, no-cross-sentence contrast counting, substantive headings after the new source aliases, NFC/NFD sentence slicing that preserves original input, Lithuanian full/genitive/abbreviated citation endings and their table-number negative controls.
- Every original HARD value and the 8/32 cutoffs; all fourteen old routes; 28 original-versus-candidate synthetic metric comparisons and 28 score comparisons; all ten old extension-profile byte hashes. No differences were observed. Code inspection found new behavior isolated to the six new locales; Thai review-map/hash validation is unchanged. No current article corpus was opened or replayed.
- Actual wrapper CLI runs for each new language on a varied neutral sample (exit 0) and a deliberately monotonous sample (exit 1), with both official-unsupported and task-local labels. Unsupported language, unknown path, invalid UTF-8, too-short new-language input and missing Thai map return exit 2. Corpus is explicitly unavailable through the wrapper. Two clearly identified mocked future shared-checker states verify that an unrelated official error or newly supported locale does not silently invoke a local fallback.
- Exact wrapper/code/profile/method manifest hashes and unchanged shared source files. All reviewer writes stayed within `work/variety-review/`.

## Limits

This is a finite heuristic reviewed by AI. It does not claim complete syntax, native idiom coverage, full UAX #29 conformance, human native-speaker review, or empirical equivalence of semantic load across languages. [Unicode UAX #29](https://www.unicode.org/reports/tr29/) permits language tailoring; it does not validate these editorial thresholds.

Filipino hyphen compounds and Dutch compounds count as written units; Hebrew prefixes/clitics remain attached and maqaf splits. Quote/abbreviation ambiguity remains, including Hebrew's lack of capitalization and Czech unusual lowercase continuations after a terminal number. A source-only heading must be standalone; substantive funding/legal-analysis headings stay in the body. Counts of selected contrast formulas can miss unmarked contrasts.

Actual extracted sentences and the full section-5 editorial check remain necessary for every article. Do not add empty short sentences, delete legal conditions or sources, or remove necessary disclaimers/email instructions to improve a number. No article, deployment, live page, visual behavior or current law was reviewed here.

## Reproducible records

```
PYTHONDONTWRITEBYTECODE=1 python3 work/variety-review/run-independent-review.py --candidate work/variety-candidate/candidate --out work/variety-review/independent-results-r2.json
# 334 checks: 333 exact matches; fil-words-1 retained as the declared convention difference
PYTHONDONTWRITEBYTECODE=1 python3 work/variety-review/run-supplemental.py
# 114 checks: 114 PASS, 0 FAIL
```

Machine-readable conclusion and exact evidence hashes: `review-final.json`. Initial failure record and all frozen expectations are preserved.
