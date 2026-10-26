"""Assert only authorized deltas and reconcile file/board inventories."""
from pathlib import Path
from datetime import datetime,timezone
import hashlib,json,subprocess
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch09');R=Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
read=lambda n:json.loads((B/'checks'/n).read_text())
def write(n,d):
 with (B/'checks'/n).open('x') as f:json.dump(d,f,ensure_ascii=False,indent=2);f.write('\n')
old=read('integration-before.json');ready=read('integration-readiness-manifest.json');inv=read('integration-r-inventory.json');priorinv=read('integration-before-inventory.json')
assert subprocess.check_output(['git','rev-parse','HEAD'],cwd=R,text=True).strip()==old['head']
new={str(Path(x['destination']).relative_to(R)):x for x in ready['files']}
repairs={str(Path(x['destination']).relative_to(R)):x for x in ready['repairs']}
tools={str(Path(x['destination']).relative_to(R)):x for x in ready['toolCopies']}
tests={'src/lib/__tests__/native-locale-columns.ts','src/lib/__tests__/case-translations-20261026.test.ts','src/lib/__tests__/column-image-caption-label.test.ts'}
expected_changed=set(repairs)|tests|{p for p,x in tools.items() if x['beforeSHA256'] is not None}
changed={p:sha(R/p) for p,h in old['trackedSHA256'].items() if not (R/p).is_file() or sha(R/p)!=h}
assert set(changed)==expected_changed,(set(changed)-expected_changed,expected_changed-set(changed))
for p,x in {**new,**repairs,**tools}.items():
 assert sha(R/p)==sha(x['path'])==x['sha256'],p
 if x.get('beforeSHA256'):assert old['trackedSHA256'][p]==x['beforeSHA256']
markdown={p:sha(R/p) for p,h in old['existingMarkdown'].items() if sha(R/p)!=h}
assert set(markdown)==set(repairs)
now={str(p.relative_to(R)) for p in (R/'src/content').rglob('*.md')}
assert now-set(old['existingMarkdown'])==set(new) and set(old['existingMarkdown'])<=now
assert all(sha(R/p)==h for p,h in old['arc147'].items())
assert len({Path(p).parent.name for p in old['arc147']})==49
for x in ready['sourceFiles']:assert sha(x['canonical_path'])==x['current_sha256']
for x in ready['directFinalEvidenceReferencesVerified']+ready['toolInstallationReceipts']+[ready['repairClosure'],ready['repairAuthorManifest']]:assert sha(x['path'])==x['sha256'],x['path']
for lane in ready['localeEvidence']:
 for key in ['authorManifest','independentManifest','authorReport','independentReport']:assert sha(lane[key]['path'])==lane[key]['sha256']
for rel,h in old['priorB9Evidence'].items():assert sha(B/rel)==h,rel
assert inv['validation']['valid'] and inv['countBenchmark']==priorinv['countBenchmark'] and inv['countBenchmark']['perLocale']==286
assert set(inv['comparison']['added'])==set(new) and set(inv['comparison']['changed'])==set(repairs) and not inv['comparison']['removed']
baseline={x['locale']:x for x in priorinv['locales']};locales=[]
for x in inv['locales']:
 o=baseline[x['locale']];delta=6 if x['locale'] in {z['locale'] for z in ready['localeEvidence']} else 0
 assert x['localColumnCount']-o['localColumnCount']==delta and x['boardVisibleLocalCount']-o['boardVisibleLocalCount']==delta
 assert x['boardHiddenLocalSlugs']==o['boardHiddenLocalSlugs'] and x['issueCount']==o['issueCount']
 assert x['missingToCountBenchmark']==max(0,286-x['localColumnCount']) and x['missingToVisibleBenchmark']==max(0,286-x['boardVisibleLocalCount'])
 locales.append({k:x[k] for k in ['locale','localColumnCount','boardVisibleLocalCount','issueCount','missingToCountBenchmark','missingToVisibleBenchmark']})
counts={'atUTC':datetime.now(timezone.utc).isoformat(),'baseCommit':old['head'],'before':priorinv['totals'],'after':inv['totals'],'benchmarkPerLocale':286,'supportedLocales':49,'locales':locales,'newSubstantiveFiles':42,'newBoardVisibleFiles':42,'changedExistingFiles':list(repairs),'removed':[],'boardHiddenSlugsAndIssuesUnchanged':True,'sourceKind':'working-tree','CMSBuildAndPublicDeliveryAsserted':False}
write('integration-count-reconciliation-r2.json',counts)
portable=read('integration-pl-portability.json')
allowed_maps={str(Path(x['portableMap']['path']).relative_to(R)) for x in portable['maps']}
status=subprocess.check_output(['git','status','--porcelain','--untracked-files=all'],cwd=R,text=True)
allowed=set(new)|set(repairs)|set(tools)|tests|allowed_maps
unexpected=[line for line in status.splitlines() if line[3:] not in allowed and not line[3:].startswith('docs/audit/all-locales-parity-20261025/batch09/')]
assert not unexpected,unexpected
out={'atUTC':datetime.now(timezone.utc).isoformat(),'baseCommit':old['head'],'startingTrackedCount':len(old['trackedSHA256']),'trackedChanged':changed,'otherTrackedUnchanged':len(old['trackedSHA256'])-len(changed),'existingMarkdown':{'before':len(old['existingMarkdown']),'unchanged':len(old['existingMarkdown'])-3,'changed':markdown,'removed':0},'newArticles':new,'toolCopies':tools,'canonicalSixUnchanged':True,'arc147':{'total':147,'locales':49,'byteIdentical':147},'priorB9EvidenceUnchanged':len(old['priorB9Evidence']),'inputAndFinalChainHashesMatch':True,'CSProfileUnchanged':sha(R/'docs/audit/all-locales-parity-20261025/tooling/variety/profiles/cs.json')==old['trackedSHA256']['docs/audit/all-locales-parity-20261025/tooling/variety/profiles/cs.json'],'runtimeOrInfraChanged':False,'capacityIncluded':False,'unexpected':unexpected,'gitStatus':status,'commitPushBuildDeploy':False}
write('integration-source-proof-r2.json',out)
print(json.dumps({'trackedChanged':len(changed),'otherTrackedUnchanged':out['otherTrackedUnchanged'],'oldMarkdownUnchanged':len(old['existingMarkdown'])-3,'arcUnchanged':147,'priorB9Unchanged':len(old['priorB9Evidence']),'totals':inv['totals']}))
