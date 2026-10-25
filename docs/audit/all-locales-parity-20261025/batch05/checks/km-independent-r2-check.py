"""Independent read-only KM R2 audit; outputs only this reviewer's check files."""
from pathlib import Path
import datetime
import difflib
import hashlib
import json
import os
import re
import subprocess
import sys

sys.dont_write_bytecode = True
B = Path('/Users/son7/tseng-all-language-columns-20261025/batch05')
R = Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
V = Path('/Users/son7/tseng-lanes-shared/variety')
NODE = '/Users/son7/.nvm/versions/node/v24.14.1/bin/node'
os.environ['PATH'] = str(Path(NODE).parent) + ':' + os.environ.get('PATH', '')
os.environ['PYTHONDONTWRITEBYTECODE'] = '1'
sys.path.insert(0, str(V))
import variety_metrics as v

sha = lambda raw: hashlib.sha256(raw).hexdigest()
file_sha = lambda path: sha(Path(path).read_bytes())
read_json = lambda name: json.loads((B / 'checks' / name).read_text())
edits = {
    '704': [
        ('M01-body', 'អ្នកកាន់ឯកសាររួមដែលមានមុខងារ ARC រួចហើយ ស្ថិតក្នុងករណីលើកលែង។', 'អ្នកកាន់ឯកសាររួមដែលមានសុពលភាព និងមានមុខងារ ARC រួចហើយ ស្ថិតក្នុងករណីលើកលែង។'),
        ('M01-FAQ1', 'អ្នកដែលមានឯកសាររួមបញ្ចូលមុខងារ ARC មានករណីលើកលែង។', 'អ្នកដែលមានឯកសាររួមដែលមានសុពលភាព និងបញ្ចូលមុខងារ ARC មានករណីលើកលែង។'),
    ],
    '705': [],
    '706': [
        ('S01', 'កាលបរិច្ឆេទលើកាតនៅតែមួយ។ មូលហេតុដែលធ្លាប់គាំទ្រវាអាចបានបញ្ចប់ទៅហើយ។', 'ថ្ងៃផុតសុពលភាពលើកាតនៅដដែល ប៉ុន្តែមូលហេតុស្នាក់នៅអាចបានបញ្ចប់ទៅហើយ។'),
        ('S02', 'ចំពោះវិវាទការងារ នីតិវិធីបណ្តឹងត្រូវកំពុងដំណើរការ; ចំពោះគ្រោះថ្នាក់ការងារ ត្រូវកំពុងព្យាបាល។', 'ចំពោះវិវាទការងារជាមួយនិយោជកតៃវ៉ាន់ នីតិវិធីបណ្តឹងត្រូវកំពុងដំណើរការ; ចំពោះគ្រោះថ្នាក់ការងារ ត្រូវកំពុងព្យាបាល។'),
    ],
}
baseline = read_json('km-independent-r1-originals.json')
r1_sentences = read_json('km-independent-sentences.json')
inputs = read_json('km-independent-inputs.json')
report = B / 'reviews/km-independent.md'
r1_prefix = report.read_bytes()[:22598]
assert sha(r1_prefix) == 'e730c2ac777a27d3fecdbd7b3144944d492bfd97ab872c201c3bf6f39021603b'
result = {'at': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'r1ReportSha256': sha(r1_prefix), 'r1ReportBytes': len(r1_prefix), 'checkerSha256': file_sha(V/'variety_metrics.py'), 'profileSha256': file_sha(V/'profiles/km.json'), 'authorSha256': file_sha(B/'reviews/km-author.md'), 'runs': [], 'commonInputChanges': [], 'expectedAuthorInputChanges': [], 'errors': [], 'scope': 'Independent exact-byte comparison with self-collected R1 baseline; manuscripts, author, R and shared tools are read-only.'}
for x in inputs['inputs']:
    h = file_sha(x['path'])
    if h != x['sha256']:
        item = {'path': x['path'], 'before': x['sha256'], 'after': h}
        expected = x['path'] in [str(B/'reviews/km-author.md'), str(B/'checks/km-final-manifest.json')]
        result['expectedAuthorInputChanges' if expected else 'commonInputChanges'].append(item)

raws = []
for source in baseline['files']:
    p = Path(source['path'])
    before = source['text']; after = p.read_text()
    assert sha(before.encode()) == source['sha256']
    expected = before
    for label, old, new in edits[p.name[:3]]:
        assert expected.count(old) == 1, label
        expected = expected.replace(old, new, 1)
    exact = after == expected
    restored = after
    for label, old, new in reversed(edits[p.name[:3]]):
        if restored.count(new) != 1:
            result['errors'].append(p.name + ': missing/duplicate replacement ' + label)
        restored = restored.replace(new, old, 1)
    if not exact or sha(restored.encode()) != source['sha256']:
        result['errors'].append(p.name + ': changes differ from four accepted exact replacements')
    command = ['python3', str(V/'variety_metrics.py'), 'check', str(p), '--lang', 'km']
    proc = subprocess.run(command, text=True, capture_output=True, env=os.environ)
    metrics = v.metrics(after, 'km')
    _, body = v.strip_fm(after)
    paragraphs, headings, items = v.body_blocks(body, 'km')
    sentences = [s for paragraph in paragraphs for s in v.sentences(paragraph, 'km')]
    old_ss = next(x['sentences'] for x in r1_sentences['files'] if Path(x['file']).name == p.name)
    changes = []
    for tag, a, b, c, d in difflib.SequenceMatcher(a=old_ss, b=sentences, autojunk=False).get_opcodes():
        if tag != 'equal': changes.append({'operation': tag, 'beforeIndices': [a,b], 'afterIndices': [c,d], 'before': old_ss[a:b], 'after': sentences[c:d]})
    urls = lambda text: re.findall(r'\]\(([^\s)]+)\)', text)
    url_equal = urls(before) == urls(after)
    if proc.returncode != 0 or not url_equal:
        result['errors'].append(p.name + ': checker or URL sequence failed')
    result['runs'].append({'path': str(p), 'sha256': file_sha(p), 'r1Sha256': source['sha256'], 'exactAcceptedReplacementsOnly': exact, 'reverseSha256': sha(restored.encode()), 'reverseMatchesR1': sha(restored.encode()) == source['sha256'], 'URLSequenceUnchanged': url_equal, 'diff': ''.join(difflib.unified_diff(before.splitlines(True), after.splitlines(True), fromfile='R1/'+p.name, tofile='R2/'+p.name)), 'edits': [{'finding': label, 'before': old, 'after': new} for label,old,new in edits[p.name[:3]]], 'command': command, 'exitCode': proc.returncode, 'stdout': proc.stdout, 'stderr': proc.stderr, 'metrics': metrics, 'sentences': sentences, 'paragraphs': paragraphs, 'headings': headings, 'listItems': items, 'sentenceChanges': changes})
    raws.extend([before, after])

node_code = "const fs=require('fs'); const matter=require('/Users/son7/Projects/tseng-law-all-locales-20261025/node_modules/gray-matter'); const texts=JSON.parse(fs.readFileSync(0,'utf8')); process.stdout.write(JSON.stringify(texts.map(t=>matter(t).data)));"
parsed = subprocess.run([NODE, '-e', node_code], input=json.dumps(raws,ensure_ascii=False), text=True, capture_output=True, check=True)
metadata = json.loads(parsed.stdout)
structures = []
for i, run in enumerate(result['runs']):
    before, after = metadata[2*i:2*i+2]
    expected = json.loads(json.dumps(before))
    if Path(run['path']).name.startswith('704'):
        _, old, new = edits['704'][1]
        expected['faq'][0]['a'] = expected['faq'][0]['a'].replace(old,new,1)
    errors = []
    if expected != after: errors.append('Unexpected metadata difference')
    for key, expected_value in [('published','2026-10-26'),('lastmod','2026-10-26'),('date_display','26 តុលា 2026'),('author','legal-ai-assistant'),('audience',['km']),('topic','visa'),('featured_image_caption','ឈុតឆាកប្រឌិត')]:
        if after.get(key) != expected_value: errors.append('Metadata: '+key)
    image = R / 'public' / after['featured_image'].lstrip('/')
    text = raws[2*i+1]
    _, body = v.strip_fm(text)
    flags = {'bodyH1': bool(re.search(r'^# ',body,re.M)), 'bold': bool(re.search(r'\*\*|__|<strong\b|<b\b',text)), 'manualBidi': bool(re.search('[\u202a-\u202e\u2066-\u2069]',text)), 'invisibleWordControls': bool(re.search('[\u200b-\u200d\u2060]',text)), 'htmlWrappers': bool(re.search(r'<(?:div|p|span)\b',text))}
    if any(flags.values()): errors.append('Formatting/control flag')
    if not image.exists() or len(after['faq']) != 3: errors.append('Image or FAQ count')
    old_struct = next(x for x in read_json('km-independent-structure.json')['files'] if x['file'] == Path(run['path']).name)
    if file_sha(image) != old_struct['imageSha256']: errors.append('Image changed')
    structures.append({'file': Path(run['path']).name, 'sha256': run['sha256'], 'metadata': after, 'metadataMatchesR1ExceptM01FAQ1': expected == after, 'imageSha256': file_sha(image), 'imageUnchanged': file_sha(image) == old_struct['imageSha256'], 'URLSequenceUnchanged': run['URLSequenceUnchanged'], 'flags': flags, 'errors': errors})
    result['errors'].extend(Path(run['path']).name+': '+e for e in errors)
result['structure'] = structures
out = B/'checks/km-independent-r2.json'
out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'artifact': str(out), 'artifactSha256': file_sha(out), 'commonInputChanges': result['commonInputChanges'], 'expectedAuthorInputChanges': result['expectedAuthorInputChanges'], 'errors': result['errors'], 'files': [{'file': Path(x['path']).name, 'sha256': x['sha256'], 'exactAcceptedReplacementsOnly': x['exactAcceptedReplacementsOnly'], 'reverseMatchesR1':x['reverseMatchesR1'], 'exitCode': x['exitCode'], 'metrics': {k:x['metrics'].get(k) for k in ['sentences','len_cv','short_share','even_run3','length_unit']}, 'sentenceChanges': x['sentenceChanges']} for x in result['runs']]},ensure_ascii=False,indent=2))
if result['errors'] or result['commonInputChanges']:
    raise SystemExit(1)
