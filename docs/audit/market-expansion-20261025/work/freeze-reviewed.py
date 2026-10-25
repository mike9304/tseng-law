#!/usr/bin/env python3
"""Bind each publication source and image to independent locale/final reports."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import subprocess

ROOT = Path(__file__).resolve().parent.parent
REPO = ROOT / 'repo'

def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

inventory = json.loads((ROOT / 'work/research/publication-inventory.json').read_text())['records']
assert len(inventory) == 24
assert len({r['route'] for r in inventory}) == 24
assert {r['id'] for r in inventory} == set(range(922, 946))
groups = {'vi':'asia','id':'asia','fil':'asia', 'hi':'southwest','ar':'southwest','he':'southwest',
          'nl':'west','fr':'west','pt':'west','pl':'east','cs':'east','lt':'east'}
finals = {}
locales = {}
for group in set(groups.values()):
    p = ROOT / f'work/reviews/{group}-final.json'
    obj = json.loads(p.read_text())
    assert obj['independentOfAuthor'] is True, str(p)
    finals[group] = (p, obj)
for locale in groups:
    p = ROOT / f'work/reviews/{locale}-locale.json'
    obj = json.loads(p.read_text())
    assert obj['independentOfAuthor'] is True, str(p)
    locales[locale] = (p, obj)

node = r'''
const fs=require('fs'),path=require('path');
const root=process.argv[1],repo=path.join(root,'repo');
const matter=require(require.resolve('gray-matter',{paths:[repo]}));
const rows=JSON.parse(fs.readFileSync(path.join(root,'work/research/publication-inventory.json'),'utf8')).records;
console.log(JSON.stringify(rows.map(r=>({source_path:r.source_path,...matter(fs.readFileSync(path.join(repo,r.source_path),'utf8')).data}))));
'''
meta = {r['source_path']: r for r in json.loads(subprocess.check_output(['node','-e',node,str(ROOT)],text=True))}
verified = []
for row in inventory:
    source = REPO / row['source_path']
    digest = sha(source)
    lp, locale = locales[row['locale']]
    fp, final = finals[groups[row['locale']]]
    assert locale['reviewer'] != final['reviewer'], row['source_path']
    def match(report):
        matches = [r for r in report['records'] if r['source_path'] == row['source_path']]
        assert len(matches) == 1, row['source_path']
        result = matches[0]
        assert result['verdict'] == 'PASS', (row['source_path'], result['verdict'])
        assert result['sha256'] == digest, (row['source_path'], 'stale manuscript review')
        return result
    lr, fr = match(locale), match(final)
    assert fr['locale_report_sha256'] == sha(lp), (row['source_path'], 'stale locale report')
    m = meta[row['source_path']]
    assert m['author'] == 'legal-ai-assistant'
    assert row['locale'] in m['audience']
    expected_image = f'/images/columns/{row["id"]}-market-expansion-20261025.webp'
    assert m['featured_image'] == expected_image
    assert m['featured_image_alt'].strip() and m['featured_image_caption'].strip()
    image = REPO / 'public' / expected_image.lstrip('/')
    image_sha = sha(image)
    assert lr['image_sha256'] == image_sha and fr['image_sha256'] == image_sha, (str(image), 'image review mismatch')
    assert lr['variety_exit_code'] == 0 and fr['variety_exit_code'] == 0
    verified.append({**row, 'sha256':digest, 'image':expected_image, 'image_sha256':image_sha,
                     'title':m['title'], 'published':str(m['published']),
                     'locale_verdict':'PASS','locale_report':str(lp.relative_to(ROOT)), 'locale_report_sha256':sha(lp),
                     'final_verdict':'PASS','final_report':str(fp.relative_to(ROOT)), 'final_report_sha256':sha(fp)})
out = ROOT / 'work/checks/reviewed-publication-manifest.json'
out.write_text(json.dumps({'at':datetime.now(timezone.utc).isoformat(), 'scope':'24 new original market articles',
                          'publication':'Reviewed locally; publication not inferred', 'records':verified},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'reviewBound':len(verified),'images':len({r['image'] for r in verified}),'report':str(out)}))
