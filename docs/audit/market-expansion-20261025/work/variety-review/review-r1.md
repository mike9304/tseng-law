# Independent measurement review — REQUEST_CHANGES

Reviewer: `/root/measure_new_locales_review`, AI editorial measurement reviewer. This reviewer did not write the candidate, did not inspect target articles or their scores, and does not certify any article or authorize publication. Review date: 2026-10-25.

Reviewed implementation: `work/variety-candidate/candidate/variety_metrics.py` SHA-256 `f6a53d8265224b5795be95501f317eac018c23dba5b79513c6179fe1caa363c7`; `variety_multilingual.py` SHA-256 `34bca4bb031b7fa386ea1ef16014a62c9a5c140e89410f75f9ca527ad3f8e85d`. Exact profile hashes and execution timestamps are retained in `independent-results-r1.json`. The wrapper read was SHA `1244d832c4dd1de479111d0967a6da2477057786279afd6ea56d7a90534b4453`; method document was SHA `8ba38c06eebf0e172f0f059e7ce3ef230255b7935b984cb1972578e629ce5d7f`.

Frozen independent expectations: `neutral-fixtures.json`, SHA-256 `41b6641d7f683f508b1db0a68984b46eedc903cc0aee1732b57a3191bd515511`. Prepared before opening candidate code/profiles or per-fixture outputs. The author sent aggregate results and a Czech normalization issue during preparation; expected arrays were not derived from candidate output. The original frozen file remains unchanged.

Execution:

```
PYTHONDONTWRITEBYTECODE=1 python3 work/variety-review/run-independent-review.py --candidate work/variety-candidate/candidate --out work/variety-review/independent-results-r1.json
```

Result: 334 checks, 307 PASS and 27 discrepancies. The independent expectations cover 215 sentence/token/source/signal/citation cases. The remaining checks cover all fourteen existing language routes, 28 synthetic metric and 28 score comparisons, all ten old extension-profile byte hashes, unchanged HARD and 8/32 limits, source-tail integration, unsupported/invalid/short CLI outcomes and unchanged source trees. Existing-language comparisons and HARD preservation all passed. No global files or manuscripts were modified.

## Blocking measurement defects

Paths below are relative to `work/variety-candidate/candidate/`. Repairs change the measurement, not manuscript legal meaning. Do not rewrite target articles to hide segmentation defects or to fit these neutral examples.

| File:line | Exact neutral sentence / observed result | Reason and evidence | Bounded repair | Legal meaning preserved? |
|---|---|---|---|---|
| `variety_multilingual.py:325` and `profiles/cs.json:44` | `Jde o 2. čtení návrhu.` becomes `Jde o 2.` + `čtení návrhu.` | Czech ordinal dots apply beyond calendar months. The split invents a short sentence and distorts every length-based HARD statistic. The [Czech Language Institute, Tečka §Řadové číslovky](https://prirucka.ujc.cas.cz/?id=160) explicitly describes ordinal periods before nouns. Frozen fixture `cs-sentences-ordinal-not-date` fails; the integer-at-end negative control already passes. | Protect unambiguous ordinal contexts, retain the actual boundary in `Číslo spisu je 2. Další položka je prázdná.`, and document ambiguous cases. | Yes: no text change; correct measurement scope. |
| `profiles/lt.json:38` | `5 straipsnis nurodytas tekste.` gives citation paragraph share 0 instead of .2. | Numeral-before-article is an ordinary Lithuanian citation order. The [Lithuanian Court of Appeal language guidance](https://www.apeliacinis.lt/ar-gali-atskirose-eilutese-likti-t.-y.-buti-nesujungti-jungiamuoju-tarpu-skaitmenys-ir-zodziai-pvz.-straipsnis-dalis-punktas/1496) itself gives number-before-`straipsnis`. Declaring suffix numbering incomplete is insufficient for this central local form; the same omission affects parenthetical citation endings, a HARD statistic. | Add bounded number + full/abbreviated article forms in both orders, preserve negative `5 lentelė`, test full-word and `str.` sentence endings. | Yes; no legal proposition changes. |
| `profiles/nl.json:39` | `Het is geen boete maar een betaling.` → contrast 0 | `geen … maar` is a central nominal negative contrast, parallel to the chosen `niet … maar` detector. Missing it understates the contrast HARD count. Frozen `nl-contrasts-contrast-1`. | Cover `geen … maar` with word boundaries and preserve an additive negative control. | Yes; detector only. |
| `profiles/he.json:26` | `זה אינו קנס אלא תשלום.` → contrast 0 | The negated predicate `אינו … אלא` has the same contrast function as the supported `לא … אלא`; common inflections should not all disappear. Frozen `he-contrasts-contrast-1`. | Add the bounded predicate forms and retain `לא רק … אלא גם` as additive, not a contrast. | Yes; detector only. |
| `profiles/cs.json:61` | `Nejde o pokutu, ale o platbu.` and `Není to pokuta, nýbrž platba.` → contrast 0 | Exact standalone `ne`/`nikoli` misses ordinary Czech negative verb forms. Two independently supplied central patterns fail while the no-contrast negative passes. | Add specific bounded `nejde`/`není` constructions; avoid classifying every negative verb as contrast without its counterpart. | Yes; detector only. |
| `profiles/lt.json:41` | `Tai ne bauda, bet mokestis.` → contrast 0 | The chosen paired negative pattern only admits `o`, omitting `bet`. Frozen `lt-contrasts-contrast-2`. | Cover bounded `ne … bet` while preserving additive `ne tik … bet ir` exclusion. | Yes; detector only. |
| `profiles/fil.json:35` | `Ang petsa ay iba sa halaga.` → contrast 0 | `iba sa` is a direct difference construction alongside the chosen `kaiba sa`; repeated use can otherwise evade the contrast HARD count. Frozen `fil-contrasts-contrast-2`. | Add bounded `iba sa`; do not include unrelated `iba-iba` by substring. | Yes; detector only. |
| `profiles/nl.json:4`, `profiles/pl.json:4` | `## Referenties`, `### Źródła urzędowe` → false | Both are standalone bibliography/official-source headings. The corresponding source content can enter the measured body even though substantive funding headings remain correctly retained. | Add only these complete heading aliases, with the existing start/end anchoring and negative substantive-heading tests. | Yes; sources remain in the manuscript. |

## Signal coverage advisories

These sixteen mismatches affect ancillary hypothetical/formula signals rather than the unchanged HARD thresholds. They expose that formula recognition is currently a few near-exact complete sentence templates. A numerical PASS still requires independent section-5 editorial review. Prefer bounded phrase coverage; do not invent a claim of exhaustive rhetoric detection.

| File:line | Exact neutral sentences not recognized | Proposed scope-preserving repair |
|---|---|---|
| `profiles/fil.json:39` | `Pangkalahatang impormasyon lamang ang paliwanag.` / `Maaaring ipadala ang tala sa email.` | Match the core general-information phrase and relevant email/contact cue, not one full sentence only. |
| `profiles/he.json:31` | `לדוגמה, יש שני מכתבים.` | Admit the ordinary example opener alongside `למשל`. |
| `profiles/he.json:32` | `זהו מידע כללי בלבד.` / `אפשר לשלוח את המסמך בדוא״ל.` | Cover core general-information and email spellings, with limitations explicit. |
| `profiles/nl.json:44` | `Neem bijvoorbeeld twee brieven.` | Admit the direct example construction without treating every `neem` verb as hypothetical. |
| `profiles/nl.json:45` | `Dit is algemene informatie.` / `U kunt de stukken per e-mail sturen.` | Cover core information and email/contact cues. |
| `profiles/pl.json:42` | `To informacje ogólne.` / `Dokumenty można wysłać e-mailem.` | Recognize both common adjective orders and email inflection. |
| `profiles/cs.json:67` | `Například existují dva dopisy.` | Add the ordinary example opener. |
| `profiles/cs.json:68` | `Jde o obecné informace.` / `Podklady lze poslat e-mailem.` | Cover core information and email/contact cues. |
| `profiles/lt.json:46` | `Įsivaizduokite du laiškus.` | Include the ordinary reader-directed form alongside `Įsivaizduokime`. |
| `profiles/lt.json:47` | `Tai bendro pobūdžio informacija.` / `Dokumentus galima siųsti el. paštu.` | Cover common general-information and email phrases. |

No legal conclusion changes are suggested in these advisory repairs. A formula flag is not a judgment that a required disclaimer or a document-delivery sentence must be deleted.

## Accepted operational difference — Filipino hyphens

The frozen reviewer fixture `fil-words-1` expected splitting `pag-ibig` and `araw-araw`; the author independently froze hyphen-preserving Filipino units before running the candidate. This difference is not a defect. The [KWF Manwal, §§11.1 and 11.3](https://kwfwikaatkultura.ph/download/21720/?tmstv=1710437195) treats hyphens in repeated words and between affix/syllable parts as ordinary spelling. Preserving the written compound is a reasonable orthographic-unit convention, consistent with the existing Indonesian option. Numeric ranges must continue to split, and 8/32/HARD values must remain unchanged. This is not proof of equal semantic load or empirical threshold calibration.

Do not erase or silently amend the frozen failed expectation. Keep it, record an independently reasoned accepted-convention exception, and test the accepted token array separately. No target score was inspected to make this decision.

## Limits and next step

Hebrew geresh/gershayim, ASCII variants, Hebrew quote attribution positive/negative cases, Czech dates, Lithuanian abbreviations, citation abbreviations, Unicode marks and source-tail negatives otherwise passed the independent examples. Native idiom selection remains a finite AI-reviewed heuristic, not a human-native judgment, semantic parser or full UAX conformance. The six languages are explicitly task-local; original unknown-language and Thai missing-map states remain unavailable. No article-level publication QA or current-law review was done here.

Return one bounded repair for the blocking measurement defects, preserve the initial evidence and original fixture, and supply a fresh exact manifest for re-review. The optional ancillary signal improvements can be made in the same isolated profiles if they retain negative controls. No threshold relaxation or global installation is approved by this report.
