"""Freeze B7 integration inputs and R baseline. Does not modify R."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import subprocess

B = Path('/Users/son7/tseng-all-language-columns-20261025/batch07')
B6 = B.parent / 'batch06'
R = Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
HEAD = 'f66daa9f153537c000d23486e8be638472251012'
PREVIOUS_MAIN = 'eca6d3d77b24e06ff85cbe4608aec76bf5762d76'
CONFIG = {
    'bg': ('bg-author-r2-manifest.json', 'bg-independent-r2-final-manifest.json', 'reviews/bg-author-r2.md', 'reviews/bg-independent-r2.md'),
    'bn': ('bn-final-manifest-r2.json', 'bn-independent-r2-final-manifest.json', 'checks/bn-author-r2.md', 'checks/bn-independent-r2.md'),
    'ca': ('ca-final-manifest-r2.json', 'ca-independent-r2-manifest.json', 'checks/ca-author-r2.md', 'checks/ca-independent-r2.md'),
    'da': ('da-author-final-manifest.json', 'da-independent-r2-manifest.json', 'reviews/da-author-r2.md', 'reviews/da-independent-r2.md'),
    'el': ('el-final-manifest.json', 'el-independent-r2-manifest.json', 'reviews/el-author.md', 'reviews/el-independent.md'),
    'et': ('et-r3-final-manifest.json', 'et-independent-r3-manifest.json', 'reviews/et-author-r3.md', 'reviews/et-independent-r3.md'),
    'fa': ('fa-author-final-manifest.json', 'fa-independent-r2-manifest.json', 'reviews/fa-author-after-independent.md', 'reviews/fa-independent-r2.md'),
}
LIMITS = {
    'bg': ['O2 date readability retained.', 'BG915 normal г. after year is falsely split by the unchanged shared checker. Actual CLI PASS and manual 42-sentence CV .540685 are separately recorded; no checker fix claimed.'],
    'et': ['R2 M03 was closed by R3 at 918 SHA 18706d6b788879e3f3d6dff97136cee18f65321163adadb58d6bd23215fc4a05.', 'Optional S03 date readability retained.'],
    'fa': ['Unchanged current-SHA rows report OK in original batch commands whose overall exit was 1 due to other then-current files. Do not relabel these batch exits as 0.'],
    'da': ['921 summary changed; exact body-byte preservation connects prior shared PASS without a fresh CLI.'],
}

def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def entry(path):
    p = Path(path)
    return {'path': str(p), 'sha256': sha(p), 'bytes': p.stat().st_size}

def nodes(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from nodes(child)
    elif isinstance(value, list):
        for child in value:
            yield from nodes(child)

def bounds(value):
    result = {}
    for row in nodes(value):
        path = row.get('path', row.get('file'))
        digest = row.get('sha256', row.get('current_sha256'))
        if isinstance(path, str) and digest:
            result[str(Path(path) if Path(path).is_absolute() else B / path)] = digest
        for key, val in row.items():
            if isinstance(val, str) and len(val) == 64 and key.startswith(('reviews/', 'checks/')):
                result[str(B / key)] = val
    return result

def write(name, value):
    (B / 'checks' / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')

head = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=R, text=True).strip()
status = subprocess.check_output(['git', 'status', '--porcelain'], cwd=R, text=True)
assert head == HEAD and not status, (head, status)
freeze = json.loads((B6 / 'research/source-freeze.json').read_text())
sources = {}
for source in freeze['canonical_rows']:
    p = Path(source['canonical_path'])
    assert sha(p) == source['current_sha256']
    assert sha(B6 / 'research' / source['current_snapshot']) == source['current_sha256']
    assert sha(B6 / 'research' / source['approved_snapshot']) == source['approved_sha256']
    clusters = sorted(q.parent.name for q in (R / 'src/content').glob('columns*/' + p.name))
    assert len(clusters) == 8, clusters
    sources[p.name] = {**source, 'current_sha_verified': True, 'existing_cluster_directories': clusters}

files, evidence = [], []
for locale, (author_name, independent_name, author_report, independent_report) in CONFIG.items():
    ap, ip = B / 'checks' / author_name, B / 'checks' / independent_name
    author, independent = json.loads(ap.read_text()), json.loads(ip.read_text())
    arows, irows = bounds(author), bounds(independent)
    if locale == 'el':
        ep = B / 'checks/el-independent-r2-verification.json'
        assert sha(ep) == irows[str(ep)]
        irows.update(bounds(json.loads(ep.read_text())))
    if locale == 'fa':
        ep = B / 'checks/fa-independent-r2-evidence.json'
        assert sha(ep) == irows[str(ep)]
        irows.update(bounds(json.loads(ep.read_text())))
    assert sha(B / author_report) == arows[str(B / author_report)], (locale, 'author report')
    assert sha(B / independent_report) == irows[str(B / independent_report)], (locale, 'independent report')
    if str(ap) in irows:
        assert sha(ap) == irows[str(ap)], (locale, 'manifest binding')
    elif locale == 'ca':
        assert sha(ap) == independent['author_r2_manifest_sha256']
    else:
        assert locale in ['et', 'fa'], (locale, 'unhandled manifest connection')
    zero_fields = {'bg': 'remaining_mandatory_in_reviewed_change_scope', 'ca': 'remaining_mandatory', 'da': 'unresolvedMandatory', 'el': 'mandatoryRemaining', 'et': 'unresolvedMust', 'fa': 'mandatory_count'}
    if locale == 'bn':
        assert independent['status'] == 'TARGETED_R2_CLOSED_MUST0_OPTIONAL0'
    else:
        assert independent[zero_fields[locale]] == 0
    selected = sorted((B / 'src/content' / f'columns-{locale}').glob('*.md'))
    assert len(selected) == 6 and {p.name for p in selected} == set(sources)
    for p in selected:
        digest = sha(p)
        assert arows.get(str(p)) == digest, (locale, p.name, 'author hash')
        assert irows.get(str(p)) == digest, (locale, p.name, 'independent hash')
        dest = R / p.relative_to(B)
        assert not dest.exists(), str(dest)
        files.append({**entry(p), 'locale': locale, 'destination': str(dest), 'canonical_path': sources[p.name]['canonical_path'],
                      'canonical_sha256': sources[p.name]['current_sha256'], 'canonical_approved_sha256': sources[p.name]['approved_sha256'],
                      'faq_count_expected': 2 if p.name.startswith('915-') else 3,
                      'author_manifest': str(ap), 'independent_manifest': str(ip), 'author_sha_matches': True, 'independent_sha_matches': True})
    evidence.append({'locale': locale, 'author_manifest': entry(ap), 'independent_manifest': entry(ip),
                     'author_report': entry(B / author_report), 'independent_report': entry(B / independent_report),
                     'mandatory_open': 0, 'limitations_retained': LIMITS.get(locale, []),
                     'scope': 'Bound final author evidence plus latest independent targeted closure; not human-native or lawyer approval.'})
assert len(files) == 42
tracked = subprocess.check_output(['git', 'ls-files', '-z', 'src', 'scripts'], cwd=R).decode().split('\0')
baseline = {p: sha(R / p) for p in tracked if p and (R / p).is_file()}
external = subprocess.check_output(['git', 'diff', '--name-status', PREVIOUS_MAIN, HEAD], cwd=R, text=True)
write('integration-before.json', {'at': datetime.now(timezone.utc).isoformat(), 'head': head,
                                'gitStatus': status, 'trackedSourceAndScripts': baseline,
                                'publicationBefore': entry(R / 'docs/audit/all-locales-parity-20261025/PUBLICATION.md'),
                                'externalSinceB6Push': external, 'externalBase': PREVIOUS_MAIN,
                                'note': 'Read-only baseline captured before authorized B7 integration. Colleague commits are already part of HEAD.'})
write('integration-readiness-manifest.json', {'at': datetime.now(timezone.utc).isoformat(), 'status': '42_FROZEN_FILES_AND_7_FINAL_CLOSURES_VERIFIED',
                                           'baseCommit': head, 'sourceFreeze': entry(B6 / 'research/source-freeze.json'),
                                           'sourceFiles': list(sources.values()), 'localeEvidence': evidence, 'files': files, 'count': 42,
                                           'allDestinationsAbsent': True, 'freshVarietyRun': False,
                                           'varietyProvenance': 'Same-SHA actual shared CLI evidence and independently verified body-only preservation are reused. Known BG915 boundary limitation and FA batch exit distinction remain explicit.',
                                           'humanNativeOrLegalApproval': False})
print(json.dumps({'files': len(files), 'locales': len(evidence), 'sources': len(sources), 'errors': 0,
                  'trackedSourceAndScripts': len(baseline), 'readinessSHA256': sha(B / 'checks/integration-readiness-manifest.json')}, ensure_ascii=False))
