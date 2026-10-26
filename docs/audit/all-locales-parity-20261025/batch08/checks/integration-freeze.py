"""Verify the copied audit and current authorized delta, then freeze root handoff."""
from pathlib import Path
from datetime import datetime, timezone
import difflib
import hashlib
import json
import shutil
import subprocess

B=Path('/Users/son7/tseng-all-language-columns-20261025/batch08')
R=Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
A=R/'docs/audit/all-locales-parity-20261025/batch08'
C=B/'checks'
def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def entry(p):
    p=Path(p)
    return {'path':str(p),'sha256':sha(p),'bytes':p.stat().st_size}
def read(name): return json.loads((C/name).read_text())

before=read('integration-before.json')
ready=read('integration-readiness-manifest.json')
proof=read('integration-source-proof.json')
audit=read('integration-audit-copy-manifest.json')
assert subprocess.check_output(['git','rev-parse','HEAD'],cwd=R,text=True).strip()==before['head']
for row in audit['copied']:
    assert sha(row['source'])==sha(row['destination'])==row['sha256'],row['path']
for row in audit['retainedOutsideAudit']:
    assert sha(row['source'])==row['sha256'],row['path']
copy_manifest=C/'integration-audit-copy-manifest.json'
assert sha(A/'checks'/copy_manifest.name)==sha(copy_manifest)
assert not any('capacity-independent' in row['destination'] for row in audit['copied'])
expected_audit={Path(x['destination']) for x in audit['copied']}|{A/'checks'/copy_manifest.name}
assert {p for p in A.rglob('*') if p.is_file()}==expected_audit
assert not any(p.is_symlink() for p in A.rglob('*'))

changed={p:sha(R/p) for p,h in before['trackedSourceAndScripts'].items() if sha(R/p)!=h}
assert changed==proof['trackedSourceAndScriptsChanged']
for row in ready['files']+ready['repairs']+ready['toolCopies']:
    assert sha(row['path'])==sha(row['destination'])==row['sha256'],row['destination']
    if row.get('beforeSHA256'):
        rel=str(Path(row['destination']).relative_to(R))
        original=subprocess.check_output(['git','show',before['head']+':'+rel],cwd=R)
        assert hashlib.sha256(original).hexdigest()==row['beforeSHA256'],rel
for lane in ready['localeEvidence']:
    for k in ['authorManifest','independentManifest','authorReport','independentReport']:
        assert sha(lane[k]['path'])==lane[k]['sha256']
for row in ready['directFinalEvidenceReferencesVerified']+ready['repairClosures']+[ready['toolInstallationReceipt']]+before['toolMirrorUnchanged49']:
    assert sha(row['path'])==row['sha256']
for row in ready['sourceFiles']:
    assert sha(row['canonical_path'])==row['current_sha256']
for p,h in before['priorB8Evidence'].items():
    assert sha(B/p)==h,p
for name in ['integration-unit-execution.json','integration-neutral-execution.json']:
    execution=read(name)
    assert execution['exitCode']==0 and execution['inputsUnchanged']
    for row in execution['inputs']+[execution['stdout'],execution['stderr']]:
        assert sha(row['path'])==row['sha256']

tracked_paths=sorted(proof['trackedSourceAndScriptsChanged'])+[
    str(Path(x['destination']).relative_to(R)) for x in ready['toolCopies'] if x['beforeSHA256'] is not None]
patch=subprocess.check_output(['git','diff','--',*tracked_paths],cwd=R,text=True)
for x in ready['toolCopies']:
    if x['beforeSHA256'] is None:
        p=Path(x['destination']);rel=str(p.relative_to(R))
        patch+=''.join(difflib.unified_diff([],p.read_text().splitlines(keepends=True),fromfile='/dev/null',tofile='b/'+rel))
assert patch==(C/'integration-source-and-tool.patch').read_text()
new_patch=''
for x in ready['files']:
    p=Path(x['destination']);rel=str(p.relative_to(R))
    new_patch+=''.join(difflib.unified_diff([],p.read_text().splitlines(keepends=True),fromfile='/dev/null',tofile='b/'+rel))
assert new_patch==(C/'integration-new-articles.patch').read_text()

final_artifact_checks=[]
for row in audit['copied']:
    p=Path(row['source'])
    if p.parent==C and p.name.startswith('integration-') and p.suffix in ['.py','.mjs','.json','.md']:
        if p.suffix=='.py':compile(p.read_text(),str(p),'exec')
        if p.suffix=='.json':json.loads(p.read_text())
        cmd=['git','diff','--no-index','--check','/dev/null',str(p)]
        result=subprocess.run(cmd,cwd=R,text=True,capture_output=True)
        assert result.returncode in [0,1] and not result.stdout and not result.stderr,(p,result.returncode,result.stdout,result.stderr)
        final_artifact_checks.append({'path':str(p),'sha256':sha(p),'exitCode':result.returncode,'stdout':result.stdout,'stderr':result.stderr})

status=subprocess.check_output(['git','status','--porcelain','--untracked-files=all'],cwd=R,text=True)
allowed=set(proof['trackedSourceAndScriptsChanged'])|{str(Path(x['destination']).relative_to(R)) for x in ready['files']+ready['toolCopies']}
unexpected=[line for line in status.splitlines() if line[3:] not in allowed and not line[3:].startswith(str(A.relative_to(R))+'/')]
assert not unexpected,unexpected
names=['integration-report.md','integration-plan.md','integration-prepare.py','integration-prepare-initial-error.json',
       'integration-before.json','integration-readiness-manifest.json','integration-copy.py','integration-copy-manifest.json',
       'integration-run-check.py','integration-tests-summary.json','integration-unit-execution.json','integration-neutral-execution.json',
       'integration-tool-neutral.json','integration-content-audit.mjs','integration-content-audit-summary.json','integration-metadata.json',
       'integration-variety-evidence.py','integration-variety-evidence.json','integration-preserve.py','integration-source-proof.json',
       'integration-count-reconciliation.json','integration-r-inventory.md','integration-package-evidence.py',
       'integration-package-initial-error.json','integration-whitespace-exit-repro.json','integration-whitespace-check.json',
       'integration-source-and-tool.patch','integration-new-articles.patch','integration-audit-selection.py','integration-copy-audit.py',
       'integration-audit-copy-manifest.json','integration-freeze.py']
manifest={
    'at':datetime.now(timezone.utc).isoformat(),'status':'B8_LOCAL_INTEGRATION_READY_FOR_ROOT_REVIEW',
    'repository':str(R),'baseCommit':before['head'],'headUnchanged':True,'startClean':before['gitStatus']=='',
    'report':entry(C/'integration-report.md'),'evidence':[entry(C/name) for name in names],
    'localeFinalChains':ready['localeEvidence'],'sourceFiles':[entry(x['destination']) for x in ready['files']+ready['repairs']],
    'testFiles':[entry(R/p) for p in sorted(changed) if '/__tests__/' in p],
    'toolFiles':[entry(x['destination']) for x in ready['toolCopies']],
    'totals':{'newArticles':42,'existingRepairs':3,'faq':119,'actualVersionsPerCase':22,'hreflangIncludingXDefault':23,
              'affectedTestFiles':28,'affectedTests':774,'neutralPassed':68,'automatedContentErrors':0,'metadataErrors':0,
              'requiredReviewPromptsRetained':225,'existingMarkdownUnchanged':2367,'arcLocales':49,'arcTotal':147,
              'arcUnchanged':144,'arcApprovedRepairs':3,'priorB8EvidenceUnchanged':len(before['priorB8Evidence']),
              'professional':2277,'boardVisible':2010,'professionalDeficitTo286':11747,'visibleDeficitTo286':12014},
    'allCopyBytesAndFinalChainsVerified':True,'allRetainedRawEvidenceHashesVerified':True,'diffMatchesCurrentFiles':True,
    'finalArtifactWhitespace':final_artifact_checks,'unexpectedChangedPaths':unexpected,
    'auditCopy':{'count':audit['copiedCount'],'bytes':audit['copiedBytes'],'retainedOutsideCount':audit['retainedCount'],
                 'index':entry(copy_manifest),'selfIndexExcludedFiles':['integration-audit-copy-manifest.json','integration-ready-freeze.json']},
    'limitations':['File-backed counts do not include CMS overlays or assert public HTML.',
                   'Author/independent and machine checks are not native-human/legal approval.',
                   'No whole-project rerun, new article CLI, build or browser run in this integration.',
                   'Historical nonzero batch exits, profile-record correction, helper failures and raw whitespace are retained.',
                   'No commit, push or deployment performed. Public B7/B8 completion is not claimed.',
                   'Capacity candidate excluded. The 49 by 286 objective remains incomplete.'],
    'commitPushBuildDeployExecuted':False,'capacityIncluded':False,'capacityProven':False,'publicationReady':False,
}
out=C/'integration-ready-freeze.json'
with out.open('x') as f:f.write(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
target=A/'checks'/out.name
with target.open('xb') as dest,out.open('rb') as src:shutil.copyfileobj(src,dest)
assert sha(target)==sha(out)
print(json.dumps({'status':manifest['status'],'reportSHA256':sha(C/'integration-report.md'),'manifestSHA256':sha(out),'auditCopiedFiles':audit['copiedCount'],'auditCopiedBytes':audit['copiedBytes'],'finalSourceFiles':len(manifest['sourceFiles']),'currentHead':before['head']}))
