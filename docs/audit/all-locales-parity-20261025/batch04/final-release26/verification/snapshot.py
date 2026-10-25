from pathlib import Path
from datetime import datetime
import hashlib,json,subprocess,sys

R=Path('/Users/son7/Projects/tseng-law-all-locales-20261025')
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch04')
D=B/'final-release26'
O=R/'out-all-locales-batch04-release26-final'
EXPECTED='e990fd45165b73724ef870ecc80cd6dd9910cd05'
phase=sys.argv[1]
assert phase in ('before','after')
destination=D/('checks/snapshot-'+phase+'.json')
assert not destination.exists(), 'Preserve prior snapshot'
def record(p,root):
    digest=hashlib.sha256()
    with p.open('rb') as handle:
        while chunk:=handle.read(1024*1024):digest.update(chunk)
    return {'path':str(p.relative_to(root)),'bytes':p.stat().st_size,'sha256':digest.hexdigest()}
def tree(root):return [record(p,root) for p in sorted(root.rglob('*')) if p.is_file()]
canonical=lambda value:json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()
hash_data=lambda data:hashlib.sha256(data).hexdigest()
head=subprocess.check_output(['git','rev-parse','HEAD'],cwd=R,text=True).strip()
build=json.loads((O/'build-info.json').read_text())
assert head==build['commit']==EXPECTED
slugs=['taiwan-arc-first-application','taiwan-visa-residence-work-study-family','taiwan-arc-renewal-changes-reentry']
sources=[]
for locale in ['he','bn','ur','fa','my','ta','ne']:
    for number,slug in enumerate(slugs,704):
        rel=Path('src/content')/('columns-'+locale)/(str(number)+'-'+slug+'.md')
        repository=record(R/rel,R)
        assert repository['sha256']==record(B/rel,B)['sha256']
        sources.append(repository)
metadata=[]
receipt=json.loads((B/'checks/case-topic-normalization.json').read_text())
for row in receipt['rows']:
    item=record(R/row['file'],R)
    assert item['sha256']==row['after_sha256']
    metadata.append(item)
all_sources=[record(p,R) for p in sorted((R/'src/content').rglob('*.md'))]
artifacts=tree(O)
preserved_roots=[
    B.parent/'batch03/release26',B/'release26',
    R/'out-all-locales-batch03-release26',
    R/'out-all-locales-batch04-release26',
    R/'out-all-locales-batch04-release26-with-local-media',
]
preserved={str(root):tree(root) for root in preserved_roots}
result={'at':datetime.now().astimezone().isoformat(),'phase':phase,'head':head,'buildInfo':build,'artifact':str(O),'sources':sources,'metadataSources':metadata,'allSources':all_sources,'sourceTreeSha256':hash_data(canonical(all_sources)),'artifacts':artifacts,'artifactCount':len(artifacts),'artifactBytes':sum(row['bytes'] for row in artifacts),'artifactTreeSha256':hash_data(canonical(artifacts)),'preserved':preserved}
if phase=='after':
    before=json.loads((D/'checks/snapshot-before.json').read_text())
    result['comparison']={key:result[key]==before[key] for key in ['head','buildInfo','sources','metadataSources','allSources','artifacts','preserved']}
    assert all(result['comparison'].values()),result['comparison']
destination.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({key:result[key] for key in ['head','artifactCount','artifactBytes','sourceTreeSha256','artifactTreeSha256']},indent=2))
print(json.dumps({'preservedFiles':{root:len(rows) for root,rows in preserved.items()},'comparison':result.get('comparison')},indent=2))
