"""Summarize actual B9 executions and separate live-code whitespace from raw evidence."""
from pathlib import Path
from datetime import datetime,timezone
from collections import Counter
import difflib,hashlib,json,re,runpy,subprocess
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch09');R=Path('/Users/son7/Projects/tseng-law-all-locales-20261025');C=B/'checks'
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def entry(p):
 p=Path(p);return {'path':str(p),'sha256':sha(p),'bytes':p.stat().st_size}
def read(n):return json.loads((C/n).read_text())
def write(n,d):
 with (C/n).open('x') as f:json.dump(d,f,ensure_ascii=False,indent=2);f.write('\n')
def text(n,s):
 with (C/n).open('x') as f:f.write(s)
ready=read('integration-readiness-manifest.json');proof=read('integration-source-proof-r2.json');unit=read('integration-unit-execution.json');caption=read('integration-caption-r2-execution.json')
assert unit['exitCode']==1 and unit['inputsUnchanged'] and caption['exitCode']==0 and caption['inputUnchanged']
caption_path=caption['input']['path'];changed_unit_inputs=[]
for row in unit['inputs']:
 if sha(row['path'])!=row['sha256']:changed_unit_inputs.append(row['path'])
assert changed_unit_inputs==[caption_path],changed_unit_inputs
assert sha(caption_path)==caption['input']['sha256']
for execution in [unit,caption,read('integration-neutral-execution.json'),read('integration-checker-execution.json')]:
 for k in ['stdout','stderr']:assert sha(execution[k]['path'])==execution[k]['sha256']
unit_text=(C/'integration-unit.stdout').read_text();caption_text=(C/'integration-caption-r2.stdout').read_text()
assert re.search(r'Test Files\s+1 failed \| 27 passed \(28\)',unit_text) and re.search(r'Tests\s+1 failed \| 780 passed \(781\)',unit_text)
assert re.search(r'Test Files\s+1 passed \(1\)',caption_text) and re.search(r'Tests\s+1 passed \(1\)',caption_text)
assert read('integration-tool-neutral.json')['cases']==read('integration-tool-neutral.json')['passed']==68
for n in ['neutral','checker']:
 e=read(f'integration-{n}-execution.json');assert e['exitCode']==0 and e['inputsUnchanged']
assert 'Ran 88 tests' in (C/'integration-checker.stderr').read_text() and '\nOK\n' in (C/'integration-checker.stderr').read_text()
v=read('integration-variety.json');assert v['actualInvocations']==45 and v['failedFiles']==0 and v['toolUnchanged']
assert all(x['actualExitCode']==0 and not x['FAIL'] and sha(x['file'])==x['sha256'] for x in v['files'])
audit=read('integration-content-audit.json');meta=read('integration-metadata.json')
assert audit['selectedFiles']==meta['selectedFiles']==42 and audit['errors']==meta['errors']==0 and audit['reviewItems']==224 and meta['faqTotal']==119
warnings=[line for line in (C/'integration-unit.stderr').read_text().splitlines() if line.startswith('Warning:')]
previous=R/'docs/audit/all-locales-parity-20261025/batch08/checks/integration-unit.stderr'
assert all(w in previous.read_text() for w in warnings)
write('integration-tests-summary.json',{'atUTC':datetime.now(timezone.utc).isoformat(),'initialUnitBatch':{'files':28,'passedFiles':27,'failedFiles':1,'passedTests':780,'failedTests':1,'exitCode':1,'execution':entry(C/'integration-unit-execution.json'),'failure':'Exactly six NB source captions Fiktiv scene differ from old global expectation Oppdiktet scene.'},'targetedCaptionR2':{'files':1,'tests':1,'exitCode':0,'execution':entry(C/'integration-caption-r2-execution.json'),'scope':'Exact six B9 filenames only; old NB expectation and all source bytes retained.'},'currentCoverage':{'files':28,'tests':781,'remainingKnownFailures':0,'basis':'27 unchanged suites and 780 tests passed in original batch; only modified caption suite rerun, 1 test passed. No claim that initial batch exit became zero.','onlyChangedInitialTestInput':changed_unit_inputs},'copiedChecker':{'tests':88,'exitCode':0,'execution':entry(C/'integration-checker-execution.json')},'neutral':{'cases':68,'exitCode':0,'execution':entry(C/'integration-neutral-execution.json')},'actualArticleCLI':{'files':45,'exit0':45,'FAIL':0,'totalUnits':sum(x['metrics']['sentences'] for x in v['files']),'newArticleUnits':sum(x['metrics']['sentences'] for x in v['files'][:42]),'record':entry(C/'integration-variety.json')},'automatedContent':{'files':42,'errors':0,'REQUIRED':224,'semanticStatus':'REVIEW_REQUIRED','publicationReady':False},'metadata':{'errors':0,'faq':119,'record':entry(C/'integration-metadata.json')},'warnings':{'count':len(warnings),'distinct':sorted(set(warnings)),'sameTextInPriorB8':True,'priorLog':entry(previous)},'wholeProjectTestRun':False,'buildBrowserDeployment':False})
compact=[]
for report in audit['reports']:
 for x in report['files']:
  compact.append({k:x[k] for k in ['file','sha256','locale','slug','errors','board','classification','bodyMetrics','source','sourceUrls']}|{'reviewItemCount':len(x['reviews']),'requiredReviewCodes':dict(Counter(r['code'] for r in x['reviews']))})
assert len(compact)==42 and sum(x['reviewItemCount'] for x in compact)==224
write('integration-content-audit-summary.json',{'atUTC':audit['at'],'original':entry(C/'integration-content-audit.json'),'selectedFiles':42,'errors':0,'reviewItems':224,'semanticStatus':'REVIEW_REQUIRED','publicationReady':False,'files':compact,'interpretation':'Original semantic/public-output prompts remain required. Frozen independent reviews are separate, not rendering/native-human/legal/publication approval.'})
tracked=sorted(proof['trackedChanged']);patch=subprocess.check_output(['git','diff','--',*tracked],cwd=R,text=True)
for x in ready['toolCopies']:
 if x['beforeSHA256'] is None:
  p=Path(x['destination']);patch+=''.join(difflib.unified_diff([],p.read_text().splitlines(keepends=True),fromfile='/dev/null',tofile='b/'+str(p.relative_to(R))))
text('integration-source-and-tool.patch',patch)
new_patch=''
for x in ready['files']:
 p=Path(x['destination']);new_patch+=''.join(difflib.unified_diff([],p.read_text().splitlines(keepends=True),fromfile='/dev/null',tofile='b/'+str(p.relative_to(R))))
text('integration-new-articles.patch',new_patch)
commands=[['git','diff','--check','--',*tracked]]+[['git','diff','--no-index','--check','/dev/null',x['destination']] for x in ready['files']]+[['git','diff','--no-index','--check','/dev/null',x['destination']] for x in ready['toolCopies'] if x['beforeSHA256'] is None]
live=[]
for cmd in commands:
 p=subprocess.run(cmd,cwd=R,text=True,capture_output=True);r={'command':cmd,'exitCode':p.returncode,'stdout':p.stdout,'stderr':p.stderr};live.append(r)
 assert p.returncode in ([0,1] if '--no-index' in cmd else [0]) and not p.stdout and not p.stderr,r
cfg=runpy.run_path(str(C/'integration-audit-selection.py'));files=[p for p in B.rglob('*') if p.is_file() and not p.is_symlink() and cfg['select'](p)];raw=[]
for p in files:
 cmd=['git','diff','--no-index','--check','/dev/null',str(p)];x=subprocess.run(cmd,cwd=R,text=True,capture_output=True)
 assert x.returncode in [0,1,2,3] and not x.stderr,(str(p),x.returncode,x.stderr)
 if x.returncode not in [0,1] or x.stdout:raw.append({'path':str(p),'sha256':sha(p),'exitCode':x.returncode,'stdout':x.stdout,'stderr':x.stderr})
write('integration-whitespace-check.json',{'atUTC':datetime.now(timezone.utc).isoformat(),'liveSourceAndToolCommands':live,'liveSourceAndToolAllPass':True,'auditsInspected':len(files),'rawAuditWarnings':raw,'rawWarningFileCount':len(raw),'historicalBytesSanitized':False,'meaning':'Live tracked changes and untracked manuscript/tool additions have no whitespace diagnostics. No-index exit1 means a difference, not failure. Frozen raw patches/logs have separate unchanged diagnostics. New final JSON/Markdown/reproduction scripts checked again at freeze.'})
print(json.dumps({'currentCoveredFiles':28,'currentCoveredTests':781,'actualArticleCLI':45,'units':sum(x['metrics']['sentences'] for x in v['files']),'neutral':68,'checkerUnit':88,'rawAuditWarnings':len(raw),'liveWhitespaceCommands':len(live)}))
