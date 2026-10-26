"""Read-only targeted verification of the author's one approved Khmer edit."""
from pathlib import Path
import datetime
import difflib
import hashlib
import json
import re

B = Path('/Users/son7/tseng-all-language-columns-20261025/batch08')
C = B / 'checks'
sha = lambda data: hashlib.sha256(data).hexdigest()
record = lambda p: {'path': str(p), 'sha256': sha(p.read_bytes())}
out = C / 'km-independent-r2-verification.json'
assert not out.exists()
mp = C / 'km-author-final-manifest-r2.json'
assert sha(mp.read_bytes()) == 'fdcc558dee6d755383b48cea4e922191fc5d1ef49fb04291de034d18372d6e81'
m = json.loads(mp.read_text())
guard = [record(p) for folder in [C, B / 'reviews'] for p in sorted(folder.glob('km-*'))
         if p.is_file() and p != Path(__file__)]
for entry in m['evidence'] + [m[k] for k in ['original_author_preserved','original_final_manifest_preserved','independent_R1_preserved','independent_R1_manifest_preserved','authorReport']]:
    assert sha(Path(entry['path']).read_bytes()) == entry['sha256']
for path, expected in m['toolHashes'].items():
    assert sha(Path(path).read_bytes()) == expected
preserved = json.loads((C / 'km-review-r1-preserved.json').read_text())
old_files = {r['path']: r for r in preserved['files']}
r1 = json.loads((C / 'km-independent-final-manifest.json').read_text())
edits = json.loads((C / 'km-review-r2-edits.json').read_text())
proposal = json.loads((C / 'km-independent-findings.json').read_text())['optional'][0]
assert edits['edit'] == proposal
old, new = proposal['old'], proposal['new']
rows = []
faq = 0
for row in m['files']:
    p = Path(row['file'])
    assert p.parent == B / 'src/content/columns-km'
    current = p.read_text()
    original = old_files[str(p)]['text']
    assert sha(original.encode()) == old_files[str(p)]['sha256']
    assert sha(p.read_bytes()) == row['sha256']
    old_review_row = next(r for r in r1['files'] if r.get('path', r.get('file')) == str(p))
    assert old_files[str(p)]['sha256'] == old_review_row['sha256']
    changed = p.name.startswith('918')
    if changed:
        assert original.count(old) == 1 and current.count(new) == 1
        assert original.replace(old, new, 1) == current
        assert current.replace(new, old, 1) == original
        assert sha(original.encode()) == edits['before_sha256']
        assert sha(p.read_bytes()) == edits['after_sha256']
        diff = ''.join(difflib.unified_diff(original.splitlines(True), current.splitlines(True),
                                         fromfile='R1/' + p.name, tofile='R2/' + p.name))
        assert diff == edits['actual_diff'] + '\n'
    else:
        assert original == current
    assert original.split('\n---\n', 1)[0] == current.split('\n---\n', 1)[0]
    assert re.findall(r'\]\(([^)]+)\)', original) == re.findall(r'\]\(([^)]+)\)', current)
    assert re.findall(r'\d+', original) == re.findall(r'\d+', current)
    faq += len(re.findall(r'^  - q:', current.split('\n---\n',1)[0], re.M))
    rows.append({'file': str(p), 'oldSHA256': sha(original.encode()), 'currentSHA256': sha(p.read_bytes()),
                 'changed': changed, 'frontmatterFAQBytesUnchanged': True,
                 'URLSequenceUnchanged': True, 'numericDigitSequenceUnchanged': True})
assert faq == 17
cli = json.loads((C / 'km-variety-review-r2.json').read_text())
assert cli['exitCode'] == 0 and cli['stderr'] == ''
assert 'OK — no variety limit violated' in cli['stdout']
assert cli['command'][-2:] == ['--lang', 'km']
assert cli['files'][0]['sha256'] == edits['after_sha256']
assert cli['toolHashes'] == m['toolHashes']
assert len(cli['extraction']) == 1
new_extraction = cli['extraction'][0]
assert new_extraction['sha256'] == edits['after_sha256']
assert new_extraction['metrics']['word_segmenter']['node'] == '24.14.1'
assert new_extraction['metrics']['word_segmenter']['icu'] == '78.2'
baseline = json.loads((C / 'km-final-boundaries.json').read_text())
old_extraction = next(r for r in baseline['records'] if r['file'] == proposal['file'])
assert old_extraction['currentSHA256'] == edits['before_sha256']
flatten = lambda r: [s for p in r['paragraphs'] for s in p['sentences']]
before, after = flatten(old_extraction), flatten(new_extraction)
assert len(before) == len(after) == 39
changed = [{'indexOneBased': i+1, 'old': a, 'new': b} for i,(a,b) in enumerate(zip(before,after)) if a != b]
assert len(changed) == 1 and changed[0]['old']['text'] == old and changed[0]['new']['text'] == new
assert changed[0]['old']['units'] == 30 and changed[0]['new']['units'] == 27
assert new_extraction['headings'] == old_extraction['headings']
assert new_extraction['listItems'] == old_extraction['listItems']
assert [r['opener'] for r in new_extraction['paragraphs']] == [r['opener'] for r in old_extraction['paragraphs']]
assert sum(len(flatten(r)) for r in baseline['records']) == 236
structure = json.loads((C / 'km-content-audit-review-r2.json').read_text())
assert structure['selected'] == 1 and structure['errors'] == 0 and structure['semanticStatus'] == 'REVIEW_REQUIRED'
assert structure['groups'][0]['files'][0]['sha256'] == edits['after_sha256']
for r in guard:
    assert sha(Path(r['path']).read_bytes()) == r['sha256']
for path, expected in m['toolHashes'].items():
    assert sha(Path(path).read_bytes()) == expected
idx = changed[0]['indexOneBased'] - 1
result = {'at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
          'scope': 'Independent narrow closure of optional O1 only; no manuscript or author-record edit and no new CLI.',
          'status': 'O1_CLOSED', 'remainingMandatoryFindings': 0, 'remainingOptionalFindings': 0,
          'files': rows, 'newAuthorManifest': record(mp), 'fourToolHashes': m['toolHashes'],
          'newActualCLIByReviewer': False, 'authorActualCLIReused': record(C/'km-variety-review-r2.json'),
          'newMetrics': new_extraction['metrics'], 'changes': changed,
          'surroundingSegments': after[max(0,idx-1):idx+2], 'oldSegments':236,'newSegments':236,'unchangedOrderedSegments':235,
          'forwardAndReverseWholeBytesMatch':True,'exactSingleReplacement':True,'FAQCount':17,
          'authorStructureSelected':1,'authorStructureErrors':0,'semanticReviewRequiredPreserved':True,
          'evidenceFlagNote':'The nested edit.applied=false is byte-identical to the frozen R1 proposal object copied into the R2 edits record. It is not used as a current-state result: direct original/current bytes, exact forward/reverse replay and after SHA independently establish the one edit was applied. Author evidence is preserved.',
          'preservedInputs':guard,'allPreservedInputsUnchangedAtEnd':True,
          'limits':['Model language/meaning review, not human native or legal approval.','The reviewer implemented the KM profile earlier; this is not independent validation of the tool itself.','No public-page, deployment or fresh official-source fetch in this targeted pass.']}
out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'output':record(out),'guardedRecords':len(guard),'changed':changed,'surrounding':result['surroundingSegments'],'metrics':{'sentences':new_extraction['metrics']['sentences'],'cv':new_extraction['metrics']['len_cv'],'short':new_extraction['metrics']['short_share']}},ensure_ascii=False,indent=2))
