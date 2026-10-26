"""Summarize executed checks and capture review diffs/whitespace without source edits."""
from pathlib import Path
from datetime import datetime, timezone
from collections import Counter
import difflib
import hashlib
import json
import re
import runpy
import subprocess
import sys

B=Path('/Users/son7/tseng-all-language-columns-20261025/batch08')
R=Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
C=B/'checks'
RESUME_WHITESPACE=sys.argv[1:]==['--whitespace-only']
assert not sys.argv[1:] or RESUME_WHITESPACE
def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def entry(p): return {'path':str(p),'sha256':sha(p),'bytes':Path(p).stat().st_size}
def read(name): return json.loads((C/name).read_text())
def write(name,value):
    if RESUME_WHITESPACE and (C/name).exists():
        old=read(name)
        assert {k:v for k,v in old.items() if k!='at'}=={k:v for k,v in value.items() if k!='at'},name
        return
    with (C/name).open('x') as f:f.write(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
def text(name,value):
    if RESUME_WHITESPACE and (C/name).exists():
        assert (C/name).read_text()==value,name
        return
    with (C/name).open('x') as f:f.write(value)

if RESUME_WHITESPACE:
    for row in read('integration-package-initial-error.json')['alreadyWrittenArtifacts']:
        assert sha(row['path'])==row['sha256']

ready=read('integration-readiness-manifest.json')
source=read('integration-source-proof.json')
unit=read('integration-unit-execution.json')
neutral=read('integration-neutral-execution.json')
cases=read('integration-tool-neutral.json')
audit=read('integration-content-audit.json')
metadata=read('integration-metadata.json')
for execution in [unit,neutral]:
    assert execution['exitCode']==0 and execution['inputsUnchanged']
    for k in ['stdout','stderr']:
        assert sha(execution[k]['path'])==execution[k]['sha256']
unit_text=(C/'integration-unit.stdout').read_text()
assert re.search(r'Test Files\s+28 passed \(28\)',unit_text)
assert re.search(r'Tests\s+774 passed \(774\)',unit_text)
assert cases['cases']==cases['passed']==68
assert audit['selectedFiles']==metadata['selectedFiles']==42
assert audit['errors']==metadata['errors']==0 and metadata['faqTotal']==119
warnings=[line for line in (C/'integration-unit.stderr').read_text().splitlines() if line.startswith('Warning:')]
previous=R/'docs/audit/all-locales-parity-20261025/batch07/checks/integration-affected-tests.log'
old_text=previous.read_text()
assert all(w in old_text for w in warnings)
write('integration-tests-summary.json',{
    'at':datetime.now(timezone.utc).isoformat(),'unit':{'files':28,'tests':774,'exitCode':0,'execution':entry(C/'integration-unit-execution.json')},
    'neutral':{'cases':68,'passed':68,'exitCode':0,'repositoryMirrorExecuted':True,'execution':entry(C/'integration-neutral-execution.json')},
    'automatedContent':{'selected':42,'errors':0,'requiredReviewItems':225,'semanticStatus':'REVIEW_REQUIRED','publicationReady':False,'fullOriginal':entry(C/'integration-content-audit.json')},
    'metadata':{'errors':0,'faqTotal':119,'evidence':entry(C/'integration-metadata.json')},
    'warnings':{'count':len(warnings),'distinct':sorted(set(warnings)),'sameWarningTextInPriorB7Log':True,'priorLog':entry(previous)},
    'newArticleCLIRuns':0,'wholeProjectTestRun':False,'buildOrBrowserRun':False,
})
compact=[]
for report in audit['reports']:
    for x in report['files']:
        compact.append({
            'file':x['file'],'sha256':x['sha256'],'locale':x['locale'],'slug':x['slug'],
            'errors':x['errors'],'reviewItemCount':len(x['reviews']),
            'requiredReviewCodes':dict(Counter(r['code'] for r in x['reviews'])),
            'board':x['board'],'classification':x['classification'],'bodyMetrics':x['bodyMetrics'],
            'source':x['source'],'sourceUrls':x['sourceUrls'],
        })
assert len(compact)==42 and sum(x['reviewItemCount'] for x in compact)==225
write('integration-content-audit-summary.json',{
    'at':audit['at'],'original':entry(C/'integration-content-audit.json'),'selectedFiles':42,'errors':0,
    'reviewItems':225,'semanticStatus':'REVIEW_REQUIRED','publicationReady':False,'files':compact,
    'interpretation':'Required semantic/public-output prompts remain separate from machine errors. Seven frozen independent closure chains are indexed in readiness; no build/browser/native-human/legal approval is inferred.',
})

tracked_paths=sorted(source['trackedSourceAndScriptsChanged'])+[
    str(Path(x['destination']).relative_to(R)) for x in ready['toolCopies'] if x['beforeSHA256'] is not None]
patch=subprocess.check_output(['git','diff','--',*tracked_paths],cwd=R,text=True)
for x in ready['toolCopies']:
    if x['beforeSHA256'] is None:
        p=Path(x['destination']);rel=str(p.relative_to(R))
        patch+=''.join(difflib.unified_diff([],p.read_text().splitlines(keepends=True),fromfile='/dev/null',tofile='b/'+rel))
text('integration-source-and-tool.patch',patch)
new_patch=''
for x in ready['files']:
    p=Path(x['destination']);rel=str(p.relative_to(R))
    new_patch+=''.join(difflib.unified_diff([],p.read_text().splitlines(keepends=True),fromfile='/dev/null',tofile='b/'+rel))
text('integration-new-articles.patch',new_patch)

# Check tracked live changes normally, then untracked additions explicitly.
# Do not stage files merely to make git diff --check see them.
live_commands=[['git','diff','--check','--',*tracked_paths]]
live_commands += [['git','diff','--no-index','--check','/dev/null',x['destination']] for x in ready['files']]
live_commands += [['git','diff','--no-index','--check','/dev/null',x['destination']] for x in ready['toolCopies'] if x['beforeSHA256'] is None]
live=[]
for cmd in live_commands:
    p=subprocess.run(cmd,cwd=R,text=True,capture_output=True)
    live.append({'command':cmd,'exitCode':p.returncode,'stdout':p.stdout,'stderr':p.stderr})
for result in live:
    allowed=[0,1] if '--no-index' in result['command'] else [0]
    assert result['exitCode'] in allowed and not result['stdout'] and not result['stderr'],result
cfg=runpy.run_path(str(C/'integration-audit-selection.py'))
audits=[p for p in B.rglob('*') if p.is_file() and not p.is_symlink() and cfg['select'](p)]
raw=[]
for p in audits:
    cmd=['git','diff','--no-index','--check','/dev/null',str(p)]
    result=subprocess.run(cmd,cwd=R,text=True,capture_output=True)
    assert result.returncode in [0,1,2,3] and not result.stderr,(str(p),result.returncode,result.stderr)
    if result.returncode not in [0,1] or result.stdout:
        raw.append({'path':str(p),'sha256':sha(p),'exitCode':result.returncode,'stdout':result.stdout,'stderr':result.stderr})
write('integration-whitespace-check.json',{
    'at':datetime.now(timezone.utc).isoformat(),'liveSourceAndToolCommands':live,
    'liveSourceAndToolAllPass':True,'auditsInspected':len(audits),'rawAuditWarnings':raw,
    'rawWarningFileCount':len(raw),'historicalBytesSanitized':False,
    'meaning':'Live tracked deltas and untracked manuscript/tool additions passed git whitespace checks. No-index exit1 means a difference and is retained; only exit0/1 with empty diagnostics passes. Frozen audit patches, logs and historical evidence are checked separately and retained exactly, including their whitespace diagnostics. Later final report/index files are verified at freeze.',
})
print(json.dumps({'unitFiles':28,'unitTests':774,'neutral':68,'warningCount':len(warnings),'existingB7WarningText':True,'liveWhitespaceChecks':len(live),'rawAuditWhitespaceFiles':len(raw),'compactAuditBytes':(C/'integration-content-audit-summary.json').stat().st_size,'patchBytes':len(patch.encode()),'newArticlesPatchBytes':len(new_patch.encode())}))
