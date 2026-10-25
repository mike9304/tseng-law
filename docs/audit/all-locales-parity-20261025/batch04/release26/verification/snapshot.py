from pathlib import Path
import hashlib, json, datetime, subprocess, sys

R = Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
B = Path('/Users/son7/tseng-all-language-columns-20261025/batch04')
D = B / 'release26'
phase, artifact_arg, expected_commit = sys.argv[1:4]
O = Path(artifact_arg).resolve()
if phase not in ('before', 'after'):
    raise ValueError('phase must be before or after')
if O.parent != R or O.name != 'out-all-locales-batch04-release26' or not (O / '.static-site-out').exists():
    raise ValueError('Expected final B4 static artifact')
if len(expected_commit) != 40 or any(c not in '0123456789abcdef' for c in expected_commit):
    raise ValueError('Explicit final content commit required')

hash_bytes = lambda data: hashlib.sha256(data).hexdigest()

def record(p, root):
    data = p.read_bytes()
    return {'path': str(p.relative_to(root)), 'bytes': len(data), 'sha256': hash_bytes(data)}

slugs = ['taiwan-arc-first-application', 'taiwan-visa-residence-work-study-family', 'taiwan-arc-renewal-changes-reentry']
sources = []
for lang in ['he', 'bn', 'ur', 'fa', 'my', 'ta', 'ne']:
    for num, slug in enumerate(slugs, 704):
        rel = Path('src/content') / ('columns-' + lang) / (str(num) + '-' + slug + '.md')
        repo, staged = record(R / rel, R), record(B / rel, B)
        if repo['sha256'] != staged['sha256']:
            raise RuntimeError('R/B4 source mismatch ' + str(rel))
        sources.append(repo)
topic_receipt = json.loads((B / 'checks/case-topic-normalization.json').read_text())
metadata_sources = []
for item in topic_receipt['rows']:
    current = record(R / item['file'], R)
    if current['sha256'] != item['after_sha256']:
        raise RuntimeError('ZH metadata source differs from reviewed final SHA: ' + item['file'])
    metadata_sources.append(current)
all_sources = [record(p, R) for p in sorted((R / 'src/content').rglob('*.md'))]
artifacts = [record(p, O) for p in sorted(O.rglob('*')) if p.is_file()]
previous = B.parent / 'batch03' / 'release26'
original_evidence = [record(p, previous) for p in sorted(previous.rglob('*')) if p.is_file()]
canonical = lambda value: json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()
head = subprocess.check_output(['git', '-C', str(R), 'rev-parse', 'HEAD'], text=True).strip()
build = json.loads((O / 'build-info.json').read_text())
if build['commit'] != head or head != expected_commit:
    raise RuntimeError('Build, HEAD and explicit final content commit must agree')
result = {
    'at': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'phase': phase,
    'head': head, 'artifact': str(O), 'buildInfo': build,
    'sources': sources, 'metadataSources': metadata_sources, 'allSources': all_sources,
    'sourceTreeSha256': hash_bytes(canonical(all_sources)),
    'originalEvidenceRoot': str(previous), 'originalEvidence': original_evidence,
    'artifactCount': len(artifacts), 'artifactBytes': sum(item['bytes'] for item in artifacts),
    'artifactTreeSha256': hash_bytes(canonical(artifacts)), 'artifacts': artifacts,
}
if phase == 'after':
    before = json.loads((D / 'checks/browser-snapshot-before.json').read_text())
    result['comparison'] = {key: result[key] == before[key] for key in ('sources', 'metadataSources', 'allSources', 'originalEvidence', 'artifacts', 'head', 'buildInfo')}
    if not all(result['comparison'].values()):
        raise RuntimeError('Frozen inputs or previous evidence changed: ' + str(result['comparison']))
target = D / ('checks/browser-snapshot-' + phase + '.json')
if target.exists():
    raise RuntimeError('Refusing to overwrite snapshot: ' + str(target))
target.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({key: value for key, value in result.items() if key not in ('artifacts', 'sources', 'allSources', 'originalEvidence')}, indent=2))
