from pathlib import Path
import datetime
import hashlib
import json
import subprocess
import sys
import shutil
import re

root = Path('/Users/son7/tseng-arc-visas-20261024')
checker = Path('/Users/son7/tseng-lanes-shared/variety/variety_metrics.py')
locales = ['ko','en','ja','vi','zh-hant','th','id','hi','fr','de','it','es','pt','ar']
sys.path.insert(0, str(checker.parent))
import variety_metrics
supported = set(variety_metrics.SUPPORTED)
tool_files = [checker, checker.with_name('variety_multilingual.py'), checker.with_name('MULTILINGUAL-METHOD.md'), *sorted(checker.parent.glob('profiles/*.json'))]
tool_hashes = {str(p): hashlib.sha256(p.read_bytes()).hexdigest() for p in tool_files}
rows = []
for locale in locales:
    directory = root/'repo/src/content'/({'ko':'columns','zh-hant':'columns-zh'}.get(locale, 'columns-'+locale))
    for file in sorted(directory.glob('70[456]-*.md')):
        command = ['python3',str(checker),'check',str(file)]
        result = subprocess.run(command,text=True,capture_output=True)
        row = dict(locale=locale,path=str(file.relative_to(root/'repo')),sha256=hashlib.sha256(file.read_bytes()).hexdigest(),command=command,exitCode=result.returncode,stdout=result.stdout,stderr=result.stderr,supported=locale in supported)
        row['status'] = ('PASS' if re.search(r'\['+re.escape(locale)+r'\] sentences=\d+ .*cv=', result.stdout) and 'FAIL' not in result.stdout else 'SKIPPED') if locale in supported and result.returncode == 0 else ('MEASUREMENT_UNAVAILABLE' if result.returncode == 2 else 'FAIL')
        if locale not in supported:
            probe = subprocess.run(command+['--lang',locale],text=True,capture_output=True)
            row['explicitLanguageProbe'] = dict(command=command+['--lang',locale],exitCode=probe.returncode,stdout=probe.stdout,stderr=probe.stderr)
            row['limit'] = 'Locale is not supported by the current checker. No relabelling or threshold change applied.'
        rows.append(row)
out = dict(checkedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),checker=str(checker),checkerSha256=hashlib.sha256(checker.read_bytes()).hexdigest(),toolHashes=tool_hashes,supportedLocales=sorted(supported),expected=42,actual=len(rows),passCount=sum(r['status']=='PASS' for r in rows),failCount=sum(r['status']=='FAIL' for r in rows),unavailableCount=sum(r['status']=='MEASUREMENT_UNAVAILABLE' for r in rows),skippedCount=sum(r['status']=='SKIPPED' for r in rows),toolUnchanged=all(hashlib.sha256(Path(p).read_bytes()).hexdigest()==h for p,h in tool_hashes.items()),rows=rows)
target=root/'work/checks/variety-audit.json'
target.parent.mkdir(exist_ok=True)
if target.exists():
    prior=json.loads(target.read_text())
    history=target.with_name('variety-audit-'+prior['checkedAt'].replace(':','-')+'.json')
    if not history.exists(): shutil.copy2(target,history)
target.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:out[k] for k in ['expected','actual','passCount','failCount','unavailableCount','skippedCount','toolUnchanged']}))
sys.exit(1 if len(rows)!=42 or out['passCount']!=42 or not out['toolUnchanged'] else 0)
