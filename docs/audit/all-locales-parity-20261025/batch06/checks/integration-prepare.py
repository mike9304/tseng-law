"""Verify B6 frozen inputs and capture the pre-integration R baseline; no R writes."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import subprocess

B = Path('/Users/son7/tseng-all-language-columns-20261025/batch06')
R = Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
EXPECTED_HEAD = '1ef3a9fe1a8702cda57949c5c53d3b713cc20b64'
LOCALES = ['de', 'it', 'ar', 'pt', 'hi', 'ms', 'ru']
AUTHOR = dict(zip(LOCALES, ['de-author-manifest.json', 'it-author-manifest.json', 'ar-final-manifest-r2.json', 'pt-author-manifest.json', 'hi-final-manifest.json', 'ms-final-manifest.json', 'ru-author-final-manifest.json']))
CLOSURE = dict(zip(LOCALES, ['de-independent-r2-manifest.json', 'it-independent-r2-manifest.json', 'ar-independent-r2-final-manifest.json', 'pt-independent-r2-manifest.json', 'hi-independent-r2-final-manifest.json', 'ms-independent-r2-manifest.json', 'ru-independent-r2-manifest.json']))
CHANGES = {
    'de': {'changed': [916, 920, 921], 'scope': 'Five reviewed replacements: 921 summary removes unsupported already-used assertion; 920 precise law name twice; 916 grammar and concrete report question.', 'retained_optional': []},
    'it': {'changed': [918, 921], 'scope': 'Two summary-only replacements separate case disposition from current rules and practical reconstruction from legal duty; body and FAQ byte-identical.', 'retained_optional': ['916 S01', '916 S02']},
    'ar': {'changed': [918, 920, 921], 'scope': 'Eight replacements: presale means before completion, clearer message subject, court attribution, minimum rather than permanent record retention.', 'retained_optional': ['915 S03']},
    'pt': {'changed': [920, 921], 'scope': 'One replacement each: Article 6(1)(4) identification; natural dismissal wording. Numeric conditions and FAQ preserved.', 'retained_optional': []},
    'hi': {'changed': [916, 918, 920, 921], 'scope': 'Five replacements: exposure grammar, no appeal permitted, docket word order, unused condition applies to both paid points and game fees including FAQ2.', 'retained_optional': []},
    'ms': {'changed': [915, 919, 920, 921], 'scope': 'Six replacements: mediation chronology, penalty-notice title and specific hearing sentence, court attribution, unused paid points or unused game fees including FAQ2.', 'retained_optional': []},
    'ru': {'changed': [919, 920, 921], 'scope': 'Four replacements: prevention duty rather than guaranteed result, contract cost allocation, unused game fees including FAQ2.', 'retained_optional': []},
}

def digest(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def entry(p):
    p = Path(p)
    return {'path': str(p), 'sha256': digest(p), 'bytes': p.stat().st_size}

def nodes(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from nodes(child)
    elif isinstance(value, list):
        for child in value:
            yield from nodes(child)

def bound_rows(value):
    return {str(row.get('path', row.get('file'))): row['sha256'] for row in nodes(value)
            if isinstance(row.get('path', row.get('file')), str) and 'sha256' in row}

def write(name, value):
    (B/'checks'/name).write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n')

head = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=R, text=True).strip()
origin = subprocess.check_output(['git', 'rev-parse', 'origin/main'], cwd=R, text=True).strip()
status = subprocess.check_output(['git', 'status', '--porcelain'], cwd=R, text=True)
assert head == origin == EXPECTED_HEAD and status == '', (head, origin, status)
source_freeze = json.loads((B/'research/source-freeze.json').read_text())
sources = {}
for row in source_freeze['canonical_rows']:
    p = Path(row['canonical_path'])
    assert digest(p) == row['current_sha256']
    assert digest(B/'research'/row['current_snapshot']) == row['current_sha256']
    assert digest(B/'research'/row['approved_snapshot']) == row['approved_sha256']
    clusters = sorted(q.parent.name for q in (R/'src/content').glob('columns*/'+p.name))
    assert len(clusters) == 1, clusters
    sources[p.name] = {**row, 'verified_current': True, 'existing_cluster_directories': clusters}

files, locale_evidence, source_map = [], [], {}
for locale in LOCALES:
    author_path, closure_path = B/'checks'/AUTHOR[locale], B/'checks'/CLOSURE[locale]
    author, closure = json.loads(author_path.read_text()), json.loads(closure_path.read_text())
    author_rows = bound_rows(author)
    closure_rows = bound_rows(closure)
    if locale == 'it':
        checks_path = B/'checks/it-independent-r2-checks.json'
        assert digest(checks_path) == closure_rows[str(checks_path)]
        closure_rows.update(bound_rows(json.loads(checks_path.read_text())))
    report_path = B/'reviews'/f'{locale}-independent-r2.md'
    report_sha = digest(report_path)
    expected_report = closure.get('report_sha256', closure.get('current_report_sha256', closure_rows.get(str(report_path))))
    assert report_sha == expected_report, (locale, 'report binding')
    if locale == 'de':
        assert closure['must_open'] == 0 and closure['author_manifest_sha256'] == digest(author_path)
    if locale == 'it':
        assert closure['newRequiredFindings'] == 0 and closure['currentAuthorManifestSHA256'] == digest(author_path)
    if locale == 'ar':
        assert digest(closure_path) == '8b4f76d9d86f4a654e5dbfd805ae406aeb59b1e6c4bd89909256298f46f8a184'
        assert report_sha == '2f48ff33f73dda4907b284a20736f968968e3cce268f37bb11f2d403ebe9ec84'
        assert closure['mandatoryRemaining'] == 0 and closure_rows[str(author_path)] == digest(author_path)
    if locale == 'pt':
        assert closure['required_open'] == 0
    if locale == 'hi':
        assert closure['verdict'] == 'R1_M01_AND_O01_O02_O03_CLOSED'
    if locale == 'ms':
        assert 'zero remaining mandatory' in closure['decision']
        assert closure_rows[str(author_path)] == digest(author_path)
    if locale == 'ru':
        assert closure['mandatory_open'] == 0
    selected = sorted((B/'src/content'/f'columns-{locale}').glob('*.md'))
    assert {p.name for p in selected} == set(sources) and len(selected) == 6
    for p in selected:
        sha = digest(p)
        assert author_rows.get(str(p)) == sha, (locale, p.name, 'author SHA')
        assert closure_rows.get(str(p)) == sha, (locale, p.name, 'independent SHA')
        destination = R/p.relative_to(B)
        assert not destination.exists(), ('destination already exists', destination)
        source = sources[p.name]
        files.append({**entry(p), 'locale': locale, 'destination': str(destination),
                      'canonical_path': source['canonical_path'], 'canonical_sha256': source['current_sha256'],
                      'canonical_approved_sha256': source['approved_sha256'],
                      'faq_count_expected': 2 if p.name.startswith('915-') else 3,
                      'author_manifest': str(author_path), 'independent_manifest': str(closure_path),
                      'author_sha_matches': True, 'independent_sha_matches': True,
                      'publication_date': '2026-10-26', 'lastmod': '2026-10-26'})
        source_map[str(destination.relative_to(R))] = source['canonical_path']
    locale_evidence.append({'locale': locale, 'author_manifest': entry(author_path),
                            'independent_manifest': entry(closure_path), 'independent_report': entry(report_path),
                            'mandatory_open': 0, 'reviewed_R2_changes': CHANGES[locale],
                            'scope_note': 'Author status may predate closure. The later bound independent R2 is the closure authority; neither is human-native or lawyer approval.'})

assert len(files) == 42
tracked = subprocess.check_output(['git', 'ls-files', '-z', 'src', 'scripts'], cwd=R).decode().split('\0')
before = {p: digest(R/p) for p in tracked if p and (R/p).is_file()}
write('integration-before.json', {'at': datetime.now(timezone.utc).isoformat(), 'head': head, 'originMain': origin,
                                'gitStatus': status, 'trackedSourceAndScripts': before,
                                'note': 'One pre-integration baseline; existing artifacts and old source are not modified by this preparation.'})
write('integration-source-map.json', source_map)
write('integration-readiness-manifest.json', {'at': datetime.now(timezone.utc).isoformat(), 'status': '42_FROZEN_FILES_AND_7_INDEPENDENT_CLOSURES_VERIFIED',
                                           'baseCommit': head, 'sourceFreeze': entry(B/'research/source-freeze.json'),
                                           'sourceFiles': list(sources.values()), 'localeEvidence': locale_evidence,
                                           'files': files, 'count': 42, 'allDestinationsAbsent': True,
                                           'freshVarietyRun': False,
                                           'varietyProvenance': 'Existing actual CLI and boundary checks belong to the exact final manuscript SHA or exact body-preservation delta established in the author and R2 records. No redundant whole-corpus rerun claimed.',
                                           'humanNativeOrLegalApproval': False})
print(json.dumps({'files': len(files), 'locales': len(locale_evidence), 'canonicalSources': len(sources),
                  'baseCommit': head, 'trackedSourceAndScripts': len(before), 'errors': 0,
                  'manifestSHA256': digest(B/'checks/integration-readiness-manifest.json')}, ensure_ascii=False))
