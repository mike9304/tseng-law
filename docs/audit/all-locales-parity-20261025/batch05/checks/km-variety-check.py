"""Reproduce exact shared KM CLI checks and expose every counted sentence.

No whitespace word estimate or fallback locale is used. The exported units are
the installed profile's ICU dictionary wordlike units, not native certification.
"""
import datetime
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys

B = Path(__file__).resolve().parent.parent
V = Path('/Users/son7/tseng-lanes-shared/variety')
os.environ['PATH'] = '/Users/son7/.nvm/versions/node/v24.14.1/bin:' + os.environ.get('PATH', '')
os.environ['PYTHONDONTWRITEBYTECODE'] = '1'
sys.dont_write_bytecode = True
sys.path.insert(0, str(V))
import variety_metrics as variety

hash_file = lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()
results = []
for article in sorted((B / 'src/content/columns-km').glob('70[4-6]-*.md')):
    command = ['python3', str(V / 'variety_metrics.py'), 'check', str(article), '--lang', 'km']
    run = subprocess.run(command, text=True, capture_output=True)
    raw = article.read_text()
    _, body = variety.strip_fm(raw)
    paras, heads, list_items = variety.body_blocks(body, 'km')
    sentences = []
    for p_index, paragraph in enumerate(paras, 1):
        for text in variety.sentences(paragraph, 'km'):
            sentences.append({'number':len(sentences)+1,'paragraph':p_index,'text':text,
                              'icuUnits':variety.slen(text,'km'),'opener':variety.opener(text,'km')})
    item = {'file':str(article),'sha256':hash_file(article),'command':command,
            'exitCode':run.returncode,'stdout':run.stdout,'stderr':run.stderr,
            'metrics':variety.metrics(raw,'km')}
    results.append(item)
    detail = {'file':str(article),'sha256':item['sha256'],
              'unitMethod':'ICU dictionary wordlike units from the installed Khmer profile; spaces are not counted as words.',
              'paragraphs':[{'index':i+1,'opener':variety.opener(p,'km'),'text':p} for i,p in enumerate(paras)],
              'headings':heads,'excludedListItems':list_items,'sentences':sentences}
    (B/'checks'/f'km-sentences-final-{article.name[:3]}.json').write_text(json.dumps(detail,ensure_ascii=False,indent=2)+'\n')
    (B/'checks'/f'km-variety-final-{article.name[:3]}.log').write_text(run.stdout+run.stderr)
    print(run.stdout,end='')
    if run.stderr: print(run.stderr,file=sys.stderr,end='')
report = {'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),
          'checkerSHA256':hash_file(V/'variety_metrics.py'),
          'profileSHA256':hash_file(V/'profiles/km.json'),
          'profile':json.loads((V/'profiles/km.json').read_text()),
          'results':results,
          'scope':'Rhythm diagnostics, not a legal, native-human or publication approval.'}
(B/'checks/km-variety-final.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
sys.exit(max([r['exitCode'] for r in results],default=2))
