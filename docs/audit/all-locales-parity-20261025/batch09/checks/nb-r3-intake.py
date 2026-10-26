from pathlib import Path
import json,hashlib,datetime,difflib,re
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch09');K=Path('/private/tmp/tseng-kimi-nb-cases-20261026');sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();ht=lambda s:hashlib.sha256(s.encode()).hexdigest()
now=datetime.datetime.now(datetime.timezone.utc).isoformat();pre=json.loads((B/'checks/nb-r3-preflight.json').read_text());assert not pre['errors'];start=json.loads((B/'kimi-nb/r3-run-start.json').read_text());assert sha(K/'TASK-R3.md')==start['taskSHA256']
original=json.loads((B/'kimi-nb/input-manifest.json').read_text());revision=json.loads((B/'kimi-nb/revision-r2-inputs.json').read_text());inputs=[]
for x in original['files']+revision['files']:
 p=K/x['file'];actual=sha(p);assert actual==x['sha256'];inputs.append({'file':str(p),'sha256':actual,'priorExpected':x['sha256'],'matches':True})
inputs.append({'file':str(K/'TASK-R3.md'),'sha256':sha(K/'TASK-R3.md'),'priorExpected':start['taskSHA256'],'matches':True,'scope':'new R3 task equals root run-start, not a prior R2 input'})
provider_preserved=[]
for name in ['author-review.md','author-review-r2.md','edits-r2.json']:
 p=K/'output'/name;q=B/'kimi-nb/raw-output-r2'/name;assert p.read_bytes()==q.read_bytes();provider_preserved.append({'file':str(p),'sha256':sha(p),'r2Record':str(q),'unchanged':True})
edits=json.loads((K/'output/edits-r3.json').read_text())['edits'];assert len(edits)==19
expected_names={r['kimiFile'] for r in pre['files']}|{'author-review.md','author-review-r2.md','edits-r2.json','author-review-r3.md','edits-r3.json'}
assert {p.name for p in (K/'output').iterdir() if p.is_file()}==expected_names
rows=[]
for x in pre['files']:
 target=B/'src/content/columns-nb'/x['file'];oldraw=B/'kimi-nb/raw-output-r2'/x['kimiFile'];newraw=K/'output'/x['kimiFile'];before=target.read_text();after=newraw.read_text();assert sha(target)==x['oldSHA256'];assert before==oldraw.read_text();assert sha(newraw)==x['newSHA256'];chosen=[e for e in edits if e['filename']==x['kimiFile']];fwd=before
 for e in chosen:
  assert fwd.count(e['old_string'])==1,(x['file'],'forward');fwd=fwd.replace(e['old_string'],e['new_string'],1)
 rev=after
 for e in reversed(chosen):
  assert rev.count(e['new_string'])==1,(x['file'],'reverse');rev=rev.replace(e['new_string'],e['old_string'],1)
 assert fwd==after and rev==before
 urls=lambda s:re.findall(r'https?://[^\s)]+',s)
 assert urls(before)==urls(after)
 rows.append({'file':str(target),'rawFile':x['kimiFile'],'beforeSHA256':ht(before),'afterSHA256':ht(after),'edits':len(chosen),'forwardExact':True,'reverseExact':True,'URLSequenceUnchanged':True,'metadataChanged':x['metadataChanged'],'FAQ':x['FAQ'],'diff':''.join(difflib.unified_diff(before.splitlines(True),after.splitlines(True),fromfile=x['file']+'@KimiR2',tofile=x['file']+'@KimiR3'))})
# All validation precedes the first manuscript mutation.
snapshot=B/'kimi-nb/r3-r2-snapshot';snapshot.mkdir();(snapshot/'manuscripts').mkdir();(snapshot/'records').mkdir()
for r in rows:
 p=Path(r['file']);(snapshot/'manuscripts'/p.name).write_bytes(p.read_bytes())
old_records=['kimi-nb/input-manifest.json','kimi-nb/revision-r2-inputs.json','kimi-nb/r2-intake-manifest.json','kimi-nb/run-receipt.json','kimi-nb/raw-output-r2/author-review.md','kimi-nb/raw-output-r2/author-review-r2.md','kimi-nb/raw-output-r2/edits-r2.json','checks/nb-variety-kimi-r2.json','checks/nb-content-audit-kimi-r2.json','reviews/nb-independent.md','checks/nb-independent-final-manifest.json']
receipts=[]
for n in old_records:
 p=B/n;dest=snapshot/'records'/p.name;assert not dest.exists();dest.write_bytes(p.read_bytes());receipts.append({'file':str(p),'sha256':sha(p),'preservedCopy':str(dest)})
rawdir=B/'kimi-nb/raw-output-r3';rawdir.mkdir()
for name in sorted(expected_names):(rawdir/name).write_bytes((K/'output'/name).read_bytes())
for r in rows:
 p=Path(r['file']);assert sha(p)==r['beforeSHA256'];p.write_bytes((rawdir/r['rawFile']).read_bytes());assert sha(p)==r['afterSHA256']
logs=[]
for n in ['run-r4.stdout','run-r4.stderr']:
 p=K/n;logs.append({'file':str(p),'bytes':p.stat().st_size,'sha256':sha(p),'contentRead':False})
out={'atUTC':now,'status':'RAW_R3_COPIED_AFTER_EXACT_VALIDATION; CHECKS_AND_TARGETED_REVIEW_PENDING','modelAlias':'kimi-code/k3.1-pro','actualExecSession':59721,'actualExitCode':0,'exitEvidence':'Root reported its completed write_stdin for session59721 (exit0) in assignment; this intake did not invoke or repoll Kimi','runStartSHA256':sha(B/'kimi-nb/r3-run-start.json'),'taskSHA256':sha(K/'TASK-R3.md'),'priorInputCount':len(inputs)-1,'totalInputsIncludingR3Task':len(inputs),'inputs':inputs,'providerRecordsUnchanged':provider_preserved,'rawOutput':str(rawdir),'rawOutputFileCount':len(expected_names),'files':rows,'exactEdits':19,'forwardExact':6,'inverseExact':6,'preservedR2Records':receipts,'logs':logs,'authorR3SHA256':sha(rawdir/'author-review-r3.md'),'editsR3SHA256':sha(rawdir/'edits-r3.json'),'noFurtherExternalRun':True}
p=B/'kimi-nb/r3-intake-manifest.json';assert not p.exists();p.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'intakeSHA256':sha(p),'files':[(Path(r['file']).name[:3],r['afterSHA256']) for r in rows],'inputs':len(inputs),'edits':len(edits),'forwardExact':6,'inverseExact':6},ensure_ascii=False))
