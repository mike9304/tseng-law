"""Neutral tests for the task-local profiles; never reads target manuscripts."""
from pathlib import Path
import collections
import contextlib
import hashlib
import io
import json
import os
import re
import subprocess
import sys
import tempfile
import unicodedata

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT/'candidate'))
import variety_metrics as metrics
import variety_multilingual as multilingual

counts = collections.Counter()
errors = []
def eq(kind, label, actual, expected):
    counts[kind] += 1
    if actual != expected:
        errors.append({'kind':kind,'label':label,'actual':actual,'expected':expected})

baseline = json.loads((ROOT/'evidence/baseline-manifest.json').read_text())
for row in baseline['files']:
    eq('unchanged','global:'+row['relative'],hashlib.sha256(Path(row['path']).read_bytes()).hexdigest(),row['sha256'])
    if row['relative'].startswith('profiles/'):
        eq('unchanged','old-profile:'+row['relative'],hashlib.sha256((ROOT/'candidate'/row['relative']).read_bytes()).hexdigest(),row['sha256'])

for locale in multilingual.TASK_LOCAL_LANGUAGES:
    profile = multilingual.profile(locale)
    for form in ('NFC','NFD'):
        for heading in profile['source_positive']:
            text = unicodedata.normalize(form, heading)
            eq('source-positive',locale+':'+text,multilingual.source_heading(text,locale),True)
            paras, heads, items = metrics.body_blocks('Alpha text.\n\n'+text+'\n\nOmega text.\n',locale)
            eq('source-tail',locale+':'+text,paras,['Alpha text.'])
        for heading in profile['source_negative']:
            text = unicodedata.normalize(form, heading)
            eq('source-negative',locale+':'+text,multilingual.source_heading(text,locale),False)
            paras, heads, items = metrics.body_blocks('Alpha text.\n\n'+text+'\n\nOmega text.\n',locale)
            eq('body-preserved',locale+':'+text,paras[-1:],["Omega text."])
        for kind,text,expected in profile['rhetorical_fixtures']:
            text = unicodedata.normalize(form,text)
            if kind == 'contrast':
                actual = multilingual.contrasts(text,locale)
            else:
                key={'caveat':'caveat_pattern','hypo':'hypo_pattern','formula':'formula_close_pattern'}[kind]
                actual = int(bool(re.search(profile[key],unicodedata.normalize('NFC',text))))
            eq('rhetorical',locale+':'+kind+':'+form+':'+text,actual,expected)
    # Whole-metric integration of source tails and native citation labels.
    native = {'fil':'Artikulo 22','he':'סעיף 22','nl':'artikel 22',
              'pl':'art. 22','cs':'čl. 22','lt':'str. 22'}[locale]
    sentence = profile['sentence_fixtures'][0]['sentences'][0].rstrip('.') + ' ('+native+').'
    for form in ('NFC','NFD'):
        measured = metrics.metrics('\n\n'.join([unicodedata.normalize(form,sentence)]*5),locale)
        eq('citation',locale+':end:'+form,measured['cite_end_share'],1)
        eq('citation',locale+':paragraph:'+form,measured['cite_para_share'],1)
        eq('units',locale+':'+form,[measured['length_unit'],measured['short_threshold'],measured['long_threshold']],['orthographic_words',8,32])
    text='\n\n'.join(row['text'] for row in profile['sentence_fixtures'][:5])
    with tempfile.TemporaryDirectory(dir=ROOT/'evidence') as tmp:
        source=Path(tmp)/f'neutral.{locale}.md'
        source.write_text(text)
        direct=subprocess.run([sys.executable,str(ROOT/'candidate/variety_metrics.py'),'check',str(source),'--lang',locale],capture_output=True,text=True)
        guarded=subprocess.run([sys.executable,str(ROOT/'variety_metrics.py'),'check',str(source),'--lang',locale],capture_output=True,text=True)
        eq('cli',locale+':wrapper-output',guarded.stdout,direct.stdout)
        eq('cli',locale+':wrapper-exit',guarded.returncode,direct.returncode)
        eq('cli',locale+':discloses-local', 'TASK-LOCAL EXTENSION' in guarded.stderr,True)
        eq('cli',locale+':original-unavailable', 'unsupported (exit 2; not a measured PASS)' in guarded.stderr,True)
        source.write_text(profile['sentence_fixtures'][0]['sentences'][0])
        short=subprocess.run([sys.executable,str(ROOT/'candidate/variety_metrics.py'),'check',str(source),'--lang',locale],capture_output=True,text=True)
        eq('unavailable',locale+':short-input',short.returncode,2)
        source.write_bytes(b'\xff')
        invalid=subprocess.run([sys.executable,str(ROOT/'candidate/variety_metrics.py'),'check',str(source),'--lang',locale],capture_output=True,text=True)
        eq('unavailable',locale+':invalid-utf8',invalid.returncode,2)
        eq('unavailable',locale+':no-traceback','Traceback' in invalid.stderr,False)
    try:
        multilingual.split_sentences('Reserved \ue000 marker.',locale)
        eq('unavailable',locale+':reserved-marker',False,True)
    except multilingual.MeasurementError:
        eq('unavailable',locale+':reserved-marker',True,True)
    # No language-specific thresholds or manuscript substitutions are permitted.
    eq('scope',locale+':no-threshold-override',any(k in profile for k in ['HARD','short_threshold','long_threshold','excluded_paragraphs','target_sha256']),False)

report={'counts':dict(counts),'total':sum(counts.values()),'errors':errors,
        'target_manuscripts_or_scores_read':False,
        'review_status':'author technical self-test only; independent review separate'}
(ROOT/'evidence/extension-tests.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False,indent=2))
sys.exit(bool(errors))
