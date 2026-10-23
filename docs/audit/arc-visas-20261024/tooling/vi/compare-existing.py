"""Verify every existing supported locale is unchanged; never score VI targets."""
from pathlib import Path
import json
import subprocess
import sys

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent.parent / 'repo'
program = r'''
from pathlib import Path
import json,sys
sys.path.insert(0,sys.argv[1])
import variety_metrics as m
import variety_multilingual as x
repo=Path(sys.argv[2]); rows=[]
for file in sorted((repo/'src/content').glob('columns*/*.md')):
    try: lang=m.guess_lang(str(file))
    except x.MeasurementError: continue
    if lang=='vi': continue
    text=file.read_text()
    try:
        mapping=x.sentence_map(file,text,lang) if lang=='th' else None
        result=m.metrics(text,lang,mapping)
    except x.MeasurementError as e: result={'unavailable':str(e)}
    rows.append({'path':str(file.relative_to(repo)),'locale':lang,'metrics':result})
print(json.dumps(rows,ensure_ascii=False,sort_keys=True))
'''
outputs=[]
for directory in ['shared-before','candidate']:
    run=subprocess.run([sys.executable,'-c',program,str(ROOT/directory),str(REPO)],capture_output=True,text=True,check=True)
    rows=json.loads(run.stdout)
    (ROOT/(directory+'-existing-metrics.json')).write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
    outputs.append(rows)
old,new=outputs
errors=[]
if len(old)!=len(new): errors.append('row count changed')
for a,b in zip(old,new):
    if a!=b: errors.append({'path':a['path'],'before':a,'after':b})
result={'articlesCompared':len(old),'locales':sorted({r['locale'] for r in old}),
        'measured':sum(bool(r['metrics']) and 'unavailable' not in r['metrics'] for r in old),
        'unavailableSame':sum(bool(r['metrics']) and 'unavailable' in r['metrics'] for r in old),
        'errors':errors,'scope':'All original thirteen locales; VI target articles excluded'}
(ROOT/'existing-regression.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(result,ensure_ascii=False))
raise SystemExit(bool(errors))
