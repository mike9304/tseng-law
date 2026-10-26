"""Verify final B9 scope, executions and audit bytes; create a root-handoff freeze."""
from pathlib import Path
from datetime import datetime,timezone
import difflib,hashlib,json,shutil,subprocess
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch09');C=B/'checks';R=Path('/Users/son7/Projects/tseng-law-all-locales-20261025');A=R/'docs/audit/all-locales-parity-20261025/batch09'
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def entry(p):
 p=Path(p);return {'path':str(p),'sha256':sha(p),'bytes':p.stat().st_size}
def read(n):return json.loads((C/n).read_text())
before=read('integration-before.json');ready=read('integration-readiness-manifest.json');proof=read('integration-source-proof-r2.json');audit=read('integration-audit-copy-manifest.json');portable=read('integration-pl-portability.json');tests=read('integration-tests-summary.json')
assert before['gitStatus']=='' and subprocess.check_output(['git','rev-parse','HEAD'],cwd=R,text=True).strip()==before['head']
changed={p:sha(R/p) for p,h in before['trackedSHA256'].items() if not (R/p).is_file() or sha(R/p)!=h}
assert changed==proof['trackedChanged'] and len(changed)==14
for row in ready['files']+ready['repairs']+ready['toolCopies']:
 assert sha(row['path'])==sha(row['destination'])==row['sha256'],row['destination']
 if row.get('beforeSHA256'):
  rel=str(Path(row['destination']).relative_to(R));original=subprocess.check_output(['git','show',before['head']+':'+rel],cwd=R)
  assert hashlib.sha256(original).hexdigest()==row['beforeSHA256'],rel
for lane in ready['localeEvidence']:
 assert lane['mandatoryOpen']==0
 for k in ['authorManifest','independentManifest','authorReport','independentReport']:assert sha(lane[k]['path'])==lane[k]['sha256']
for row in ready['directFinalEvidenceReferencesVerified']+ready['toolInstallationReceipts']+[ready['repairClosure'],ready['repairAuthorManifest'],ready['sourceFreeze']]+before['rules']:assert sha(row['path'])==row['sha256'],row['path']
for row in ready['sourceFiles']:assert sha(row['canonical_path'])==row['current_sha256']
for p,h in before['priorB9Evidence'].items():assert sha(B/p)==h,p
assert all(sha(R/p)==h for p,h in before['arc147'].items())
assert {p for p,h in before['existingMarkdown'].items() if sha(R/p)!=h}=={str(Path(x['destination']).relative_to(R)) for x in ready['repairs']}
assert {str(p.relative_to(R)) for p in (R/'src/content').rglob('*.md')}-set(before['existingMarkdown'])=={str(Path(x['destination']).relative_to(R)) for x in ready['files']}
for row in audit['copied']:assert sha(row['source'])==sha(row['destination'])==row['sha256'],row['path']
for row in audit['retainedOutsideAudit']:assert sha(row['source'])==row['sha256'],row['path']
for row in audit['preexistingPortableBindings']:assert sha(row['path'])==row['sha256']
copy_index=C/'integration-audit-copy-manifest.json';assert sha(A/'checks'/copy_index.name)==sha(copy_index)
expected_audit={Path(x['destination']) for x in audit['copied']}|{Path(x['path']) for x in audit['preexistingPortableBindings']}|{A/'checks'/copy_index.name}
assert {p for p in A.rglob('*') if p.is_file()}==expected_audit
assert not any(p.is_symlink() for p in A.rglob('*'))
for row in portable['maps']:assert sha(row['portableMap']['path'])==row['portableMap']['sha256']
for row in portable['originals']:assert sha(row['source']['path'])==sha(row['copy']['path'])==row['source']['sha256']
unit=read('integration-unit-execution.json');caption=read('integration-caption-r2-execution.json')
assert unit['exitCode']==1 and unit['inputsUnchanged'] and caption['exitCode']==0 and caption['inputUnchanged']
assert [x['path'] for x in unit['inputs'] if sha(x['path'])!=x['sha256']]==[caption['input']['path']]
assert sha(caption['input']['path'])==caption['input']['sha256']
for execution in [unit,caption,read('integration-neutral-execution.json'),read('integration-checker-execution.json')]:
 for key in ['stdout','stderr']:assert sha(execution[key]['path'])==execution[key]['sha256']
for n in ['neutral','checker']:
 e=read(f'integration-{n}-execution.json');assert e['exitCode']==0 and e['inputsUnchanged']
 for row in e['inputs']:assert sha(row['path'])==row['sha256'],row['path']
v=read('integration-variety.json');assert v['actualInvocations']==45 and v['failedFiles']==0 and v['toolUnchanged']
for row in v['files']:assert row['actualExitCode']==0 and not row['FAIL'] and sha(row['file'])==row['sha256']
tracked=sorted(changed);patch=subprocess.check_output(['git','diff','--',*tracked],cwd=R,text=True)
for x in ready['toolCopies']:
 if x['beforeSHA256'] is None:
  p=Path(x['destination']);patch+=''.join(difflib.unified_diff([],p.read_text().splitlines(keepends=True),fromfile='/dev/null',tofile='b/'+str(p.relative_to(R))))
assert patch==(C/'integration-source-and-tool.patch').read_text()
new_patch=''
for x in ready['files']:
 p=Path(x['destination']);new_patch+=''.join(difflib.unified_diff([],p.read_text().splitlines(keepends=True),fromfile='/dev/null',tofile='b/'+str(p.relative_to(R))))
assert new_patch==(C/'integration-new-articles.patch').read_text()
check=subprocess.run(['git','diff','--check'],cwd=R,text=True,capture_output=True)
assert check.returncode==0 and not check.stdout and not check.stderr
final_artifact_checks=[]
for row in audit['copied']:
 p=Path(row['source'])
 if p.parent==C and p.name.startswith('integration-') and p.suffix in ['.py','.mjs','.json','.md']:
  if p.suffix=='.py':compile(p.read_text(),str(p),'exec')
  if p.suffix=='.json':json.loads(p.read_text())
  q=subprocess.run(['git','diff','--no-index','--check','/dev/null',str(p)],cwd=R,text=True,capture_output=True)
  assert q.returncode in [0,1] and not q.stdout and not q.stderr,(p,q.returncode,q.stdout,q.stderr)
  final_artifact_checks.append({'path':str(p),'sha256':sha(p),'exitCode':q.returncode,'stdout':q.stdout,'stderr':q.stderr})
allowed=set(changed)|{str(Path(x['destination']).relative_to(R)) for x in ready['files']+ready['toolCopies']}|{str(Path(x['portableMap']['path']).relative_to(R)) for x in portable['maps']}
status=subprocess.check_output(['git','status','--porcelain','--untracked-files=all'],cwd=R,text=True)
unexpected=[line for line in status.splitlines() if line[3:] not in allowed and not line[3:].startswith(str(A.relative_to(R))+'/')]
assert not unexpected,unexpected
manifest={'atUTC':datetime.now(timezone.utc).isoformat(),'status':'B9_LOCAL_INTEGRATION_READY_FOR_ROOT_REVIEW','repository':str(R),'baseCommit':before['head'],'headUnchanged':True,'startClean':True,'report':entry(C/'integration-report.md'),'evidence':[entry(p) for p in sorted(C.glob('integration-*')) if p.is_file() and p.name!='integration-ready-freeze.json'],'localeFinalChains':ready['localeEvidence'],'sourceFiles':[entry(x['destination']) for x in ready['files']+ready['repairs']],'testFiles':[entry(R/p) for p in tracked if '/__tests__/' in p],'toolFiles':[entry(x['destination']) for x in ready['toolCopies']],'portablePLMaps':[x['portableMap'] for x in portable['maps']],'totals':{'newArticles':42,'existingRepairs':3,'newFAQ':119,'oldRepairFAQ':10,'actualVersionsPerCase':29,'hreflangIncludingXDefault':30,'affectedTestFiles':28,'currentCoveredTests':781,'initialUnitBatchExit':1,'targetedCaptionExit':0,'checkerUnitPassed':88,'neutralPassed':68,'actualArticleCLIPassed':45,'measuredUnits':1944,'automatedContentErrors':0,'metadataErrors':0,'requiredReviewPromptsRetained':224,'mandatoryIndependentOpen':0,'optionalIndependentOpen':1,'existingMarkdownUnchanged':2409,'arcLocales':49,'arcTotal':147,'arcUnchanged':147,'priorB9EvidenceUnchanged':len(before['priorB9Evidence']),'professional':2319,'boardVisible':2052,'professionalDeficitTo286':11705,'visibleDeficitTo286':11972},'checksSummary':entry(C/'integration-tests-summary.json'),'allCopyBytesAndFinalChainsVerified':True,'allRetainedRawEvidenceHashesVerified':True,'diffMatchesCurrentFiles':True,'trackedChanged':changed,'otherTrackedUnchanged':len(before['trackedSHA256'])-len(changed),'finalArtifactWhitespace':final_artifact_checks,'unexpectedChangedPaths':unexpected,'auditCopy':{'count':audit['copiedCount'],'bytes':audit['copiedBytes'],'preexistingPLArtifacts':len(audit['preexistingPortableBindings']),'retainedOutsideCount':audit['retainedCount'],'index':entry(copy_index),'selfIndexExcluded':['integration-audit-copy-manifest.json','integration-ready-freeze.json']},'limitations':['Initial 28-suite execution remains exit1. 27 unchanged suites plus one targeted caption rerun cover the current 781 tests; no new full-batch exit0 claimed.','REQUIRED224 is retained. Author/independent and machine checks are not native-human/legal or rendering approval.','File-backed counts do not include CMS overlays or assert public delivery.','Historical nonzero exits and raw whitespace remain unchanged.','Portable PL artifact graph was actually relocated; checker code remained at R. Other historical/reproduction absolute paths remain.','No whole-project test, commit, push, build, browser or deployment run in this integration.','Capacity opt-in is excluded; Sites runtime capacity and the49by286 goal remain unproven.'],'commitPushBuildDeployExecuted':False,'capacityIncluded':False,'capacityProven':False,'publicationReady':False}
out=C/'integration-ready-freeze.json'
with out.open('x') as f:json.dump(manifest,f,ensure_ascii=False,indent=2);f.write('\n')
with out.open('rb') as src,(A/'checks'/out.name).open('xb') as dest:shutil.copyfileobj(src,dest)
assert sha(A/'checks'/out.name)==sha(out)
print(json.dumps({'status':manifest['status'],'reportSHA256':sha(C/'integration-report.md'),'freezeSHA256':sha(out),'auditFiles':audit['copiedCount'],'auditBytes':audit['copiedBytes'],'sourceFiles':45,'head':before['head']}))
