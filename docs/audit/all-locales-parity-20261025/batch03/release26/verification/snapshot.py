from pathlib import Path
import hashlib,json,datetime,subprocess,sys
R=Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch03')
D=B/'release26'
phase=sys.argv[1]
O=Path(sys.argv[2]).resolve()
if phase not in ('before','after'): raise ValueError('phase must be before or after')
if O.parent != R or not (O/'.static-site-out').exists(): raise ValueError('Expected completed R static artifact')
hash_bytes=lambda b:hashlib.sha256(b).hexdigest()
def record(p,root):
 b=p.read_bytes();return {'path':str(p.relative_to(root)),'bytes':len(b),'sha256':hash_bytes(b)}
slugs=['taiwan-arc-first-application','taiwan-visa-residence-work-study-family','taiwan-arc-renewal-changes-reentry']
sources=[]
for lang in ['bg','ca','el','hr','hu','is','sk']:
 for num,slug in enumerate(slugs,704):
  rel=Path('src/content')/('columns-'+lang)/(str(num)+'-'+slug+'.md')
  a=record(R/rel,R);b=record(B/rel,B)
  if a['sha256']!=b['sha256']:raise RuntimeError('R/B source mismatch '+str(rel))
  sources.append(a)
for lang in ['ms','fil','nl']:
 rel=Path('src/content')/('columns-'+lang)/'704-taiwan-arc-first-application.md'
 sources.append(record(R/rel,R))
all_sources=[record(p,R) for p in sorted((R/'src/content').rglob('*.md'))]
artifacts=[record(p,O) for p in sorted(O.rglob('*')) if p.is_file()]
original_files=[]
for directory in [B/'verification',B/'pack']:
 original_files.extend(p for p in directory.rglob('*') if p.is_file())
original_files.extend(p for p in (B/'checks').rglob('*') if p.is_file() and p.relative_to(B/'checks').parts[0].startswith('browser-'))
original_evidence=[record(p,B) for p in sorted(set(original_files))]
canonical=lambda x:json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()
head=subprocess.check_output(['git','-C',str(R),'rev-parse','HEAD'],text=True).strip()
build=json.loads((O/'build-info.json').read_text())
if build['commit']!=head:raise RuntimeError('Build commit differs from current HEAD')
if head!='3b4cc3f4793e1b3593c9621cc8733019a8078e5d':raise RuntimeError('Unexpected batch03 release26 commit')
x={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'phase':phase,'head':head,'artifact':str(O),'buildInfo':build,'sources':sources,'allSources':all_sources,'sourceTreeSha256':hash_bytes(canonical(all_sources)),'originalEvidence':original_evidence,'artifactCount':len(artifacts),'artifactBytes':sum(x['bytes'] for x in artifacts),'artifactTreeSha256':hash_bytes(canonical(artifacts)),'artifacts':artifacts}
if phase=='after':
 before=json.loads((D/'checks/browser-snapshot-before.json').read_text())
 x['comparison']={key:x[key]==before[key] for key in ('sources','allSources','originalEvidence','artifacts','head','buildInfo')}
 if not all(x['comparison'].values()):raise RuntimeError('Frozen inputs or original evidence changed: '+str(x['comparison']))
out=D/('checks/browser-snapshot-'+phase+'.json')
if out.exists():raise RuntimeError('snapshot already exists: '+str(out))
out.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in x.items() if k not in ('artifacts','sources','allSources','originalEvidence')},indent=2))
