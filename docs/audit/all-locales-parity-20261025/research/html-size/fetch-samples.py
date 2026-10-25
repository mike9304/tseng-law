#!/usr/bin/env python3
"""Read-only public GET samples for the HTML payload investigation. No deployment/API credentials."""
import concurrent.futures
import datetime
import gzip
import hashlib
import json
from pathlib import Path
import urllib.request

OUT = Path(__file__).resolve().parent
BASE = 'https://tseng-law.com'
SAMPLES = {
    'en-arc': '/en/columns/taiwan-arc-first-application',
    'ko-arc': '/ko/columns/taiwan-arc-first-application',
    'zh-hant-arc': '/zh-hant/columns/taiwan-arc-first-application',
    'ja-arc': '/ja/columns/taiwan-arc-first-application',
    'nl-semiconductor': '/nl/columns/taiwan-semiconductor-market-entry',
    'ru-gym': '/ru/columns/taiwan-gym-injury-lawsuit',
    'ta-traffic': '/ta/columns/taiwan-traffic-accident-procedure',
    'zh-hans-judgment': '/zh-hans/columns/mainland-chinese-judgment-arbitral-award-taiwan-recognition',
    'en-board': '/en/columns',
    'nl-board': '/nl/columns',
}


def get(route):
    request = urllib.request.Request(BASE + route, headers={
        'User-Agent': 'tseng-law-authorized-capacity-audit/1.0',
        'Accept-Encoding': 'gzip',
    })
    with urllib.request.urlopen(request, timeout=45) as response:
        data = response.read()
        if response.headers.get('Content-Encoding') == 'gzip':
            data = gzip.decompress(data)
        return data, response.status, response.headers.get('Content-Type'), response.geturl()


def sample(item):
    name, route = item
    data, status, content_type, final_url = get(route)
    if status != 200 or 'text/html' not in content_type:
        raise RuntimeError(f'{route}: {status}, {content_type}')
    (OUT / f'{name}.html').write_bytes(data)
    return {'name': name, 'url': BASE + route, 'finalUrl': final_url, 'status': status,
            'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}


before = json.loads(get('/build-info.json')[0])
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    rows = list(pool.map(sample, SAMPLES.items()))
after = json.loads(get('/build-info.json')[0])
result = {'measuredAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
          'publicBuildBefore': before, 'publicBuildAfter': after,
          'buildUnchanged': before == after, 'samples': rows}
(OUT / 'fetch-metadata.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'samples': len(rows), 'buildUnchanged': before == after,
                  'commit': after.get('commit'), 'htmlBytes': sum(r['bytes'] for r in rows)}, indent=2))
