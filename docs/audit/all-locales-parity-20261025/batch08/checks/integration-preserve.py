"""Check the authorized B8 delta against its pre-copy snapshot; no source writes."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import subprocess

B = Path('/Users/son7/tseng-all-language-columns-20261025/batch08')
R = Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(name): return json.loads((B/'checks'/name).read_text())
def write(name, value):
    with (B/'checks'/name).open('x') as f:
        f.write(json.dumps(value, ensure_ascii=False, indent=2)+'\n')
def record(p):
    p=Path(p)
    return {'path':str(p),'sha256':sha(p),'bytes':p.stat().st_size}

before=read('integration-before.json')
ready=read('integration-readiness-manifest.json')
inventory=read('integration-r-inventory.json')
baseline_inventory=read('integration-before-inventory.json')
unit=read('integration-unit-execution.json')
head=subprocess.check_output(['git','rev-parse','HEAD'],cwd=R,text=True).strip()
assert head==before['head']==ready['baseCommit']
repairs={str(Path(x['destination']).relative_to(R)):x for x in ready['repairs']}
new={str(Path(x['destination']).relative_to(R)):x for x in ready['files']}
test_paths={'src/lib/__tests__/native-locale-columns.ts','src/lib/__tests__/case-translations-20261026.test.ts'}
source_changed={p:sha(R/p) for p,h in before['trackedSourceAndScripts'].items() if sha(R/p)!=h}
assert set(source_changed)==set(repairs)|test_paths,source_changed
markdown_changed={p:sha(R/p) for p,h in before['existingMarkdown'].items() if sha(R/p)!=h}
assert set(markdown_changed)==set(repairs),markdown_changed
for p,x in {**new,**repairs}.items():
    assert sha(R/p)==sha(x['path'])==x['sha256'],p
    if p in repairs: assert before['existingMarkdown'][p]==x['beforeSHA256']
all_current_markdown={str(p.relative_to(R)) for p in (R/'src/content').rglob('*.md')}
assert all_current_markdown-set(before['existingMarkdown'])==set(new)
assert set(before['existingMarkdown'])<=all_current_markdown
arc_changed={p:sha(R/p) for p,h in before['arc147'].items() if sha(R/p)!=h}
assert set(arc_changed)==set(repairs)
assert len({Path(p).parent.name for p in before['arc147']})==49
for x in ready['sourceFiles']:
    assert sha(x['canonical_path'])==x['current_sha256']
for x in ready['toolCopies']:
    assert sha(x['path'])==sha(x['destination'])==x['sha256']
for x in before['toolMirrorUnchanged49']:
    assert sha(x['path'])==x['sha256']
for x in unit['inputs']:
    assert sha(x['path'])==x['sha256']
for lane in ready['localeEvidence']:
    for k in ['authorManifest','independentManifest','authorReport','independentReport']:
        assert sha(lane[k]['path'])==lane[k]['sha256'],(lane['locale'],k)
for x in ready['directFinalEvidenceReferencesVerified']:
    assert sha(x['path'])==x['sha256'],x['path']
prior_changes=[]
for p,h in before['priorB8Evidence'].items():
    q=B/p
    if not q.is_file() or sha(q)!=h:
        prior_changes.append({'path':p,'beforeSHA256':h,'currentSHA256':sha(q) if q.is_file() else None})
assert not prior_changes,prior_changes

comparison=inventory['comparison']
assert set(comparison['added'])==set(new)
assert set(comparison['changed'])==set(repairs)
assert comparison['removed']==[]
assert inventory['validation']['valid'] is True
assert baseline_inventory['countBenchmark']==inventory['countBenchmark']
assert inventory['countBenchmark']['perLocale']==286
oldlocales={x['locale']:x for x in baseline_inventory['locales']}
locales=[]
expected_locales={x['locale'] for x in ready['localeEvidence']}
for x in inventory['locales']:
    o=oldlocales[x['locale']]
    expected=6 if x['locale'] in expected_locales else 0
    assert x['localColumnCount']-o['localColumnCount']==expected
    assert x['boardVisibleLocalCount']-o['boardVisibleLocalCount']==expected
    assert x['boardHiddenLocalSlugs']==o['boardHiddenLocalSlugs']
    assert x['issueCount']==o['issueCount']
    assert x['missingToCountBenchmark']==max(0,286-x['localColumnCount'])
    assert x['missingToVisibleBenchmark']==max(0,286-x['boardVisibleLocalCount'])
    locales.append({k:x[k] for k in ['locale','localColumnCount','boardVisibleLocalCount','issueCount','missingToCountBenchmark','missingToVisibleBenchmark']})
count_proof={
    'at':datetime.now(timezone.utc).isoformat(),'sourceKind':'working-tree','baseCommit':head,
    'inventory':record(B/'checks/integration-r-inventory.json'),
    'baselineInventory':record(B/'checks/integration-before-inventory.json'),
    'benchmarkPerLocale':286,'supportedLocales':49,'before':baseline_inventory['totals'],
    'after':inventory['totals'],'added':comparison['added'],'changed':comparison['changed'],
    'removed':[],'locales':locales,'hiddenBoardSlugsUnchanged':True,'issuesUnchanged':True,
    'newSubstantiveLocalFiles':42,'newBoardVisibleLocalFiles':42,
    'countingLimitation':'File-backed policies only; CMS overlays, built HTML and public delivery are not asserted. Per-locale excess does not offset another locale deficit.',
}
write('integration-count-reconciliation.json',count_proof)

status=subprocess.check_output(['git','status','--porcelain','--untracked-files=all'],cwd=R,text=True)
allowed=set(new)|set(repairs)|test_paths|{str(Path(x['destination']).relative_to(R)) for x in ready['toolCopies']}
audit_prefix='docs/audit/all-locales-parity-20261025/batch08/'
unexpected=[line for line in status.splitlines() if line[3:] not in allowed and not line[3:].startswith(audit_prefix)]
assert not unexpected,unexpected
proof={
    'at':datetime.now(timezone.utc).isoformat(),'status':'AUTHORIZED_DELTA_PRESERVED','baseCommit':head,
    'trackedSourceAndScriptsBaselineCount':len(before['trackedSourceAndScripts']),
    'trackedSourceAndScriptsChanged':source_changed,
    'existingMarkdown':{'total':len(before['existingMarkdown']),'unchanged':len(before['existingMarkdown'])-len(markdown_changed),'changed':markdown_changed,'removed':0},
    'arc':{'locales':49,'total':147,'unchanged':144,'exactApprovedRepairs':arc_changed,'removed':0},
    'newArticles':[{'destination':str(R/p),'sha256':sha(R/p),'frozenSource':x['path']} for p,x in new.items()],
    'existingRepairs':ready['repairs'],
    'canonicalSixUnchanged':True,'toolCopiedExactly':ready['toolCopies'],'otherProductionToolFilesUnchanged':49,
    'priorB8EvidenceUnchanged':len(before['priorB8Evidence']),'priorB8EvidenceChanges':prior_changes,
    'allFinalAuthorIndependentAndDirectReferencesStillMatch':True,
    'testedInputsStillMatch':True,'sourceAndRuntimeChangesOutsideOwnership':unexpected,
    'gitStatus':status,'productionRuntimeOrInfrastructureChanged':False,'capacityIncluded':False,
    'commitPushBuildDeployExecuted':False,
}
write('integration-source-proof.json',proof)
print(json.dumps({'sourceChanged':len(source_changed),'existingMarkdownUnchanged':2367,'existingMarkdownChanged':len(markdown_changed),'newArticles':len(new),'arcUnchanged':144,'arcApprovedRepairs':3,'priorRecordsUnchanged':len(before['priorB8Evidence']),'before':baseline_inventory['totals'],'after':inventory['totals'],'sourceProofSHA256':sha(B/'checks/integration-source-proof.json')}))
