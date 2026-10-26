from pathlib import Path
import datetime, hashlib, json, subprocess

B = Path('/Users/son7/tseng-all-language-columns-20261025/batch08')
R = Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
A = R / 'docs/audit/all-locales-parity-20261025'
sha = lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()
read = lambda n: json.loads((B/'checks'/n).read_text())
freeze = read('integration-ready-freeze.json')
assert sha(B/'checks/integration-ready-freeze.json') == '21e686eaf8f3d6422f9db32cea86e650b66db7ce66c4661a32d4e37cee11d7f3'
assert subprocess.check_output(['git','rev-parse','HEAD'],cwd=R,text=True).strip() == freeze['baseCommit']
verified = set()
def bind(node):
    if isinstance(node,dict):
        p = node.get('path')
        if isinstance(p,str) and p.startswith('/') and 'sha256' in node:
            assert sha(p) == node['sha256'], p
            verified.add(p)
        for value in node.values(): bind(value)
    elif isinstance(node,list):
        for value in node: bind(value)
bind(freeze)
copies = read('integration-copy-manifest.json')['copies']
for row in copies:
    assert sha(row['path']) == sha(row['destination']) == row['sha256']
    if row.get('canonical_path'): assert sha(row['canonical_path']) == row['canonical_sha256']
audit = read('integration-audit-copy-manifest.json')
for row in audit['copied']:
    assert sha(row['source']) == sha(row['destination']) == row['sha256'], row['source']
for row in audit['retainedOutsideAudit']:
    assert sha(row['source']) == row['sha256'], row['source']
before = read('integration-before.json')
changed = {str(Path(row['path']).relative_to(R)) for row in freeze['sourceFiles'] + freeze['testFiles']}
source_delta = {p for p,h in before['trackedSourceAndScripts'].items() if sha(R/p) != h}
assert source_delta <= changed
md_delta = {p for p,h in before['existingMarkdown'].items() if sha(R/p) != h}
arc_delta = {p for p,h in before['arc147'].items() if sha(R/p) != h}
repairs = {str(Path(row['destination']).relative_to(R)) for row in copies if row['kind'] == 'repairs'}
assert md_delta == arc_delta == repairs and len(repairs) == 3
for p,h in before['priorB8Evidence'].items(): assert sha(B/p) == h, p
for row in before['toolMirrorUnchanged49']: assert sha(row['path']) == row['sha256']
report = {
    'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),
    'baseCommit':freeze['baseCommit'],'reviewer':'root AI coordinator',
    'freezeSHA256':sha(B/'checks/integration-ready-freeze.json'),
    'verifiedDirectBindings':len(verified),'exactCopies':len(copies),
    'auditCopies':len(audit['copied']),'retainedEvidence':len(audit['retainedOutsideAudit']),
    'sourceScriptsBaseline':len(before['trackedSourceAndScripts']),
    'sourceScriptsChanged':sorted(source_delta),'existingRepairs':sorted(repairs),
    'existingMarkdownUnchanged':len(before['existingMarkdown'])-len(md_delta),
    'priorB8EvidenceUnchanged':len(before['priorB8Evidence']),
    'totals':freeze['totals'],
    'reviewed':'Current tracked source/test/tool diff and integration report; prior full FI/HU candidate review and exact current tool SHA; frozen author/independent chains.',
    'testsRepeated':False,'fullBuildPending':True,'publicVerificationPending':True,
    'capacityIncluded':False,'overall49LocaleGoalComplete':False
}
for target in [B/'checks/ROOT-INTEGRATION-REVIEW.json',A/'batch08/checks/ROOT-INTEGRATION-REVIEW.json']:
    with target.open('x') as f: f.write(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False))
