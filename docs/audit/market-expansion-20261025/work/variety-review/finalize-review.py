#!/usr/bin/env python3
"""Bind the independent method verdict to already executed evidence."""
import collections
import datetime
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CANDIDATE = ROOT.parent / 'variety-candidate'

def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

fixtures = json.loads((ROOT / 'neutral-fixtures.json').read_text())
first = json.loads((ROOT / 'independent-results-r1.json').read_text())
second = json.loads((ROOT / 'independent-results-r2.json').read_text())
supplemental = json.loads((ROOT / 'supplemental-results.json').read_text())
manifest_path = CANDIDATE / 'evidence/candidate-manifest-repair-r1.json'
manifest = json.loads(manifest_path.read_text())
assert sha(ROOT / 'neutral-fixtures.json') == '41b6641d7f683f508b1db0a68984b46eedc903cc0aee1732b57a3191bd515511'
assert first['summary'] == dict(total=334, passed=307, failed=27)
assert second['summary'] == dict(total=334, passed=333, failed=1)
assert supplemental['summary'] == dict(total=114, passed=114, failed=0)
assert [r['id'] for r in second['records'] if r['status'] != 'PASS'] == ['fil-words-1']
assert sha(manifest_path) == supplemental['candidate_manifest_sha256']
for entry in manifest['files']:
    assert sha(CANDIDATE / entry['path']) == entry['sha256'], entry['path']
expected = {f['id']: f for f in fixtures['fixtures']}
per_locale = {}
for lang in ('fil', 'he', 'nl', 'pl', 'cs', 'lt'):
    rows = [r for r in second['records'] if r['id'] in expected and expected[r['id']]['locale'] == lang]
    per_locale[lang] = dict(status='PASS', frozen_expectations=len(rows),
                           exact_matches=sum(r['status'] == 'PASS' for r in rows),
                           accepted_method_conventions=sum(r['id'] == 'fil-words-1' for r in rows),
                           unresolved_material_findings=0)

files = {entry['path']: entry['sha256'] for entry in manifest['files']}
relevant_files = {key: value for key, value in files.items()
                  if key in ('variety_metrics.py', 'METHOD.md', 'candidate/variety_metrics.py', 'candidate/variety_multilingual.py')
                  or key in [f'candidate/profiles/{lang}.json' for lang in per_locale]}
convention = {
    'fixture_id': 'fil-words-1',
    'status': 'ACCEPTED_CONVENTION_DIFFERENCE_NOT_ERASED',
    'original_reviewer_expected': ['siya’y', 'pag', 'ibig', 'araw', 'araw'],
    'accepted_author_preexecution_convention': ['siya’y', 'pag-ibig', 'araw-araw'],
    'reason': 'The author froze hyphen-preserving Filipino orthographic units before any candidate execution; independent review accepted the choice after opening KWF §§11.1 and 11.3. Numeric ranges remain split and HARD/8/32 limits unchanged. No target scores informed this decision.',
    'source': 'https://kwfwikaatkultura.ph/download/21720/?tmstv=1710437195',
    'frozen_file_unchanged': True,
    'separate_accepted_expectation_test': 'supplemental-results.json: accepted-fil-hyphen-convention',
}
report = {
    'schema_version': 1,
    'reviewed_at_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
    'status': 'PASS',
    'scope': 'Independent editorial measurement method for task-local fil/he/nl/pl/cs/lt extension only; not article review, shared installation or publication authority.',
    'reviewer': '/root/measure_new_locales_review',
    'independence': dict(authored_candidate=False, target_articles_read=False, target_article_scores_read=False,
                         human_native_or_attorney_claim=False, own_writes='work/variety-review/** only'),
    'candidate_root': str(CANDIDATE),
    'candidate_manifest': dict(path=str(manifest_path), sha256=sha(manifest_path)),
    'reviewed_files': relevant_files,
    'per_locale': per_locale,
    'independent_checks': dict(frozen_expectations=215, frozen_exact_matches=214,
                               full_recheck_total=334, full_recheck_exact_matches=333,
                               supplemental_total=114, supplemental_exact_matches=114,
                               combined_total=448, combined_exact_matches=447,
                               accepted_method_conventions=1, unresolved_material_findings=0),
    'accepted_convention': convention,
    'repairs': dict(independent_review_passes=2, author_targeted_repairs=1,
                    first_pass_discrepancies=27, corrected_discrepancies=26, accepted_conventions=1,
                    hard_threshold_changes=0),
    'existing14': dict(neutral_metric_comparisons=28, neutral_score_comparisons=28,
                       directory_routes=14, old_extension_profile_byte_hashes=10,
                       observed_differences=0, all_inputs_equivalence_claim=False,
                       current_article_corpus_replayed=False),
    'original_checker_support_for_new6': 'unsupported; wrapper labels original exit 2 and separate local measurement',
    'evidence': {name: sha(ROOT / name) for name in ('neutral-fixtures.json', 'independent-results-r1.json', 'review-r1.md',
                                                  'independent-results-r2.json', 'supplemental-results.json',
                                                  'run-independent-review.py', 'run-supplemental.py')},
    'limits': [
        'Finite AI editorial idiom and segmentation fixtures, not human native-speaker certification, full syntax parsing or exhaustive coverage.',
        'Orthographic units differ in semantic load; unchanged 8/32 and HARD limits are operational heuristics, not empirically validated equal readability.',
        'Actual extracted sentences and section-5 prose/legal self-check remain necessary for each article; no target manuscripts or actual article scores were read.',
        'Hebrew single quotes can be ambiguous, Latin terminal abbreviations in Hebrew lack a capitalization cue, Czech lowercase continuation after a bare terminal number is heuristic, uncommon abbreviations/initials/quotes need inspection.',
        'Source-tail recognition is restricted to standalone headings. Headings/lists/tables remain outside prose metric scope as before.',
        'Formula/email cues are review signals; do not remove a necessary disclaimer, citation, legal condition or useful document-delivery step to satisfy style.',
        'Existing14 synthetic regressions and code isolation were checked; no full current-article-corpus equivalence claim.',
        'Global checker remains unchanged. Unsupported languages and missing/invalid Thai boundaries remain unavailable; this PASS grants no installation or publication authority.',
    ],
}
(ROOT / 'review-final.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
rows = '\n'.join(f"| {lang} | PASS | {data['exact_matches']}/{data['frozen_expectations']} | {data['accepted_method_conventions']} |" for lang, data in per_locale.items())
hash_rows = '\n'.join(f'| `{name}` | `{digest}` |' for name, digest in relevant_files.items())
text = f'''# Independent measurement-method review — PASS

Reviewed at {report['reviewed_at_utc']}. Reviewer: `/root/measure_new_locales_review`, an AI reviewer independent of the candidate author. This review covers only the task-local Filipino, Hebrew, Dutch, Polish, Czech and Lithuanian measurement method. No target manuscript or target article score was read. No claim of human-native or attorney review is made. This result is not article approval, global installation approval or publication authority.

## Decision and exact version

All material r1 findings were resolved in one targeted repair. The exact candidate identified below may be used for task-local measurement alongside independent article/locale/legal review and section-5 self-check. The shared checker still reports these six languages unsupported; keep that exit-2 result distinct from the task-local result.

| Reviewed file, relative to `work/variety-candidate/` | SHA-256 |
|---|---|
{hash_rows}

The full checked manifest is `evidence/candidate-manifest-repair-r1.json`, SHA-256 `{sha(manifest_path)}`. Every entry was rehashed after execution; a later code/profile change requires checking the new version rather than reusing this PASS.

## Independent execution

The reviewer froze 215 expected examples before opening candidate code/profiles or individual outputs. The author supplied aggregate progress and one normalization issue during preparation; no expected arrays were derived from its outputs. The original frozen JSON remains SHA-256 `41b6641d7f683f508b1db0a68984b46eedc903cc0aee1732b57a3191bd515511`.

First run: 334 checks, 307 exact passes and 27 discrepancies. Recheck after repair: 334 checks, 333 exact passes and one explicitly accepted convention difference. An additional 114 boundary, CLI, manifest and fail-closed checks all passed. Combined: 447 exact matches out of 448 checks, one accepted method convention, zero unresolved material defects. These numbers are not article counts.

| Locale | Method verdict | Frozen expectation exact matches | Accepted convention differences |
|---|---|---:|---:|
{rows}

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
'''
(ROOT / 'review-final.md').write_text(text, encoding='utf-8')
print(json.dumps({'status': report['status'], 'per_locale': per_locale, 'checks': report['independent_checks'],
                  'report': str(ROOT / 'review-final.md'), 'json_sha256': sha(ROOT / 'review-final.json')}))
