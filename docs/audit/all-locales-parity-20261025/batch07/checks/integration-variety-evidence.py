"""Connect current B7 files to saved actual shared CLI rows; no CLI rerun."""
from pathlib import Path
import hashlib
import json
from datetime import datetime, timezone

B = Path('/Users/son7/tseng-all-language-columns-20261025/batch07')
M = json.loads((B / 'checks/integration-readiness-manifest.json').read_text())
S = Path('/Users/son7/tseng-lanes-shared/variety')

def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def nodes(v):
    if isinstance(v, dict):
        yield v
        for x in v.values():
            yield from nodes(x)
    elif isinstance(v, list):
        for x in v:
            yield from nodes(x)

assert sha(S / 'variety_multilingual.py') == '4af341932757be7a6b83f84a56ea24792f963653c9c3d008aacade2b79a084de'
assert sha(S / 'variety_metrics.py') == '5abf02f52e35c45f921084106b6acf3c0caf0ca02f09649de1c1eb6977019b3e'
rows = []
for lane in M['localeEvidence']:
    locale = lane['locale']
    a = json.loads(Path(lane['author_manifest']['path']).read_text())
    items = a.get('files', a.get('rows', a.get('outputs')))
    for item in items:
        manuscript = item.get('path', item.get('file'))
        manuscript = Path(manuscript) if Path(manuscript).is_absolute() else B / manuscript
        digest = sha(manuscript)
        assert digest == item['sha256']
        ev = next(item[k] for k in ['varietyEvidence', 'sharedEvidence', 'shared_evidence', 'measurementFile', 'actual_CLI_evidence', 'actualCLIRecord', 'evidence'] if isinstance(item.get(k), str))
        ep = Path(ev)
        if not ep.is_absolute():
            ep = B / ep if ep.parts[0] == 'checks' else B / 'checks' / ep
        raw_text = ep.read_text()
        raw = json.loads(raw_text)
        expected_hash = item.get('varietyEvidenceSha256', item.get('sharedEvidenceSha256'))
        if expected_hash:
            assert sha(ep) == expected_hash
        same_full_sha = digest in raw_text
        body_reuse = (locale, manuscript.name[:3]) in [('da', '921'), ('et', '915')]
        assert same_full_sha or body_reuse, (locale, manuscript.name, 'unconnected SHA')
        owners = [node for node in nodes(raw) if isinstance(node.get('stdout'), str) and manuscript.name in node['stdout']]
        assert owners, (locale, manuscript.name, 'actual stdout absent')
        matched = None
        for owner in owners:
            lines = owner['stdout'].splitlines()
            for i, line in enumerate(lines):
                if manuscript.name in line and f'[{locale}]' in line:
                    block = '\n'.join(lines[i:i+2])
                    if 'OK — no variety limit violated' in block:
                        matched = (owner, block)
                        break
            if matched:
                break
        assert matched, (locale, manuscript.name, 'no matching actual OK row')
        owner, block = matched
        exit_code = next((owner[k] for k in ['exit', 'exit_code', 'exitCode'] if k in owner), None)
        assert exit_code == 0 or (locale in ['da', 'fa'] and exit_code == 1), (locale, manuscript.name, exit_code)
        metrics = item.get('metrics', {})
        rows.append({'file': str(manuscript), 'sha256': digest, 'locale': locale,
                     'savedCLIRecord': str(ep), 'savedCLIRecordSHA256': sha(ep),
                     'actualBatchOrSingleExit': exit_code, 'actualFileStdout': block,
                     'sameFullSHAInSavedCLIRecord': same_full_sha,
                     'bodyOnlyReuse': body_reuse,
                     'bodyOnlyReuseProof': lane['independent_manifest'] if body_reuse else None,
                     'lenCV': metrics.get('len_cv', item.get('CV', item.get('lengthCV', item.get('len_cv')))),
                     'newCLIExecuted': False})
assert len(rows) == 42
out = {'at': datetime.now(timezone.utc).isoformat(), 'files': rows, 'count': 42,
       'sameFullSHAInActualCLIRecords': sum(x['sameFullSHAInSavedCLIRecord'] for x in rows),
       'bodyOnlyReuseCount': sum(x['bodyOnlyReuse'] for x in rows),
       'currentFileReportedFAIL': 0, 'newCLIRuns': 0,
       'tools': [{'path': str(S / n), 'sha256': sha(S / n)} for n in ['variety_metrics.py', 'variety_multilingual.py']],
       'limitations': ['BG915 normal г. false split remains; manual sensitivity is in the author/independent evidence.', 'DA/FA saved batch exit1 remains exit1, even though each selected current-SHA row is OK.', 'Machine measurements do not replace meaning review, human native/legal approval or rendering.']}
(B / 'checks/integration-variety-evidence.json').write_text(json.dumps(out, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({k: v for k, v in out.items() if k not in ['files', 'tools', 'limitations']}, ensure_ascii=False))
