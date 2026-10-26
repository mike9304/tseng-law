from pathlib import Path
from hashlib import sha256
from datetime import datetime,timezone
import json,re
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch09');R=Path('/Users/son7/Projects/tseng-law-all-locales-20261025');S=B.parent/'batch06/research';C=B/'checks'
def row(p):return {'path':str(p),'sha256':sha256(p.read_bytes()).hexdigest()}
freeze=json.loads((S/'source-freeze.json').read_text());canonical=[]
for r in freeze['canonical_rows']:
 p=S/r['current_snapshot'];assert row(p)['sha256']==r['current_sha256'];q=Path(r['canonical_path']);assert row(q)['sha256']==r['current_sha256'];target=B/'src/content/columns-ro'/q.name;assert not target.exists();assert not (R/'src/content/columns-ro'/q.name).exists();canonical.append({'snapshot':row(p),'R':row(q),'target':str(target),'sameSHAAsPriorFullRead':True})
rows=[];legacy=[]
for p in (R/'src/content/columns-ro').glob('*.md'):
 m=re.search(r'^published:\s*"?([^"\n]+)',p.read_text(),re.M)
 if m:rows.append((m.group(1).strip(),p.name,p))
 else:legacy.append({'path':str(p),'lastmod':re.search(r'^lastmod:\s*"?([^"\n]+)',p.read_text(),re.M).group(1).strip()})
recent=sorted(rows,reverse=True)[:3];assert {p.name[:3] for d,n,p in recent}=={'704','705','706'}
images=[{**row(R/f'public/images/columns/{id}-case-trends-20261025.webp'),'viewImageActuallyOpenedThisAuthorTask':True} for id in [915,916,918,919,920,921]]
paths=[B/'BRIEF.md',B.parent/'batch08/BRIEF.md',B.parent/'batch07/BRIEF.md',R/'docs/columns/EDITORIAL-VOICE.md',Path('/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md'),Path('/Users/son7/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md'),Path('/Users/son7/tseng-lanes-shared/LESSONS.md')]+[S/n for n in ['authoring-contract-draft.md','six-source-facts.md','source-register.md','source-freeze.json']]
result={'at':datetime.now(timezone.utc).isoformat(),'owner':'/root/column_source_quality','status':'Prepared; not authored or approved','canonical':canonical,'inputs':list(map(row,paths)),'priorFullReadReuse':'Same author prepared B6 frozen research; source6/facts/register/contract/freeze full readings reused only at verified identical SHA. EN915/916 also reread in full now; no new court web success claimed.','rules':'B9/B8/B7 and actual project rules read in full; current17:05LESSONS read. Clipped combined output repaired by separate full SENTENCE read.','homeVoiceFileExists':Path('/Users/son7/agent-library/knowledge/editorial-voice.md').exists(),'recentSelection':'Explicit published descending, filename descending tie-break; legacy18 lack published and have earlier date_display/lastmod. Current R values override generic BRIEF date description.','existingMarkdownCount':len(rows)+len(legacy),'legacyWithoutPublished':legacy,'recentFullRead':[dict(row(p),published=d) for d,n,p in recent],'recentReadNotes':'704 full;705 separately reread after clipped combined output;706 body/footer and missing frontmatter separately read. Actual published dates are25October, not26 as generic BRIEF description suggests.','images':images,'openingsPlan':{'915':'single award amount','916':'reader question about report recipients and decisions','918':'actual letter content/date','919':'case disposition and hearing sequence','920':'actual cable route from judgment, not invented client experience','921':'reader question about remaining coins'},'noEditsToRSharedOthers':True}
p=C/'ro-inputs.json';assert not p.exists();p.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'path':str(p),'sha256':row(p)['sha256'],'recent':result['recentFullRead'],'sixTargetsAbsent':True},ensure_ascii=False,indent=2))
