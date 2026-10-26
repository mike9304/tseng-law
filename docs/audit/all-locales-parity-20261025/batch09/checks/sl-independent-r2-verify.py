from pathlib import Path
from hashlib import sha256
from datetime import datetime, timezone
from difflib import SequenceMatcher
from html.parser import HTMLParser
import json, re, yaml

B = Path('/Users/son7/tseng-all-language-columns-20261025/batch09')
C = B / 'checks'
def h(t): return sha256(t if isinstance(t, bytes) else t.encode()).hexdigest()
def fh(p): return h(Path(p).read_bytes())
def j(n): return json.loads((C / n).read_text())
def norm(t): return re.sub(r'\s+', ' ', t).strip()
def urls(t): return re.findall(r'\]\(([^)]+)\)', t)
def metadata(t): return yaml.safe_load(t.split('---', 2)[1])
class ParagraphReader(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.active = False; self.buf = []; self.paragraphs = []
    def handle_starttag(self, tag, attrs):
        if tag == 'p': self.active = True; self.buf = []
    def handle_endtag(self, tag):
        if tag == 'p': self.paragraphs.append(''.join(self.buf)); self.active = False
    def handle_data(self, value):
        if self.active: self.buf.append(value)

m = j('sl-final-manifest-r2.json')
assert fh(C / 'sl-final-manifest-r2.json') == '9a1d4430dd97c12585a162d610e0f5230e3ccb1467bea2c05f6876050e2eb9fa'
assert fh(B / 'reviews/sl-author-r2.md') == '4e806ec59848a86f353ba41aef9826351e9c5eed00cdc120ccc5d7fc4d6a2014'
old_proof = j('sl-independent-proof.json')
assert fh(C / 'sl-independent-proof.json') == 'bf06b6806994e382c8aeb2706eca628c1e4bbe0700bc286e35341231ec1ed89b'
changes = j('sl-review-r1-edits.json')['edits']
findings = j('sl-independent-findings.json')['findings']
integrity = j('sl-review-r2-integrity.json')
render = j('sl-render-metadata-review-r2.json')
audit = j('sl-content-audit-review-r2.json')
assert len(changes) == 2 and audit['errors'] == 0
hashes = {}
def collect(value):
    if isinstance(value, dict):
        if isinstance(value.get('path'), str) and isinstance(value.get('sha256'), str):
            assert hashes.setdefault(value['path'], value['sha256']) == value['sha256']
        for x in value.values(): collect(x)
    elif isinstance(value, list):
        for x in value: collect(x)
collect(m)
bindings = []
for path, expected in sorted(hashes.items()):
    actual = fh(path); assert actual == expected, path
    bindings.append({'path': path, 'sha256': actual, 'match': True})
rows = []
same = total = 0
for file_record in m['files']:
    ident = file_record['id']; p = Path(file_record['path']); text = p.read_text()
    old = next(x for x in old_proof['rows'] if x['id'] == ident)
    es = [x for x in changes if x['article'] == ident]
    restored = text
    for e in reversed(es):
        f = next(x for x in findings if x['id'] == e['id'])
        assert e['before'] == f['before'] and e['after'] == f['after']
        assert h(restored) == e['afterSHA']
        k = e['offset']; assert restored[k:k+len(e['after'])] == e['after']
        restored = restored[:k] + e['before'] + restored[k+len(e['after']):]
        assert h(restored) == e['beforeSHA'] == f['sha256']
    assert h(restored) == old['sha256']
    replay = restored
    for e in es:
        k = e['offset']; assert replay[k:k+len(e['before'])] == e['before']
        replay = replay[:k] + e['after'] + replay[k+len(e['before']):]
    assert replay == text and h(text) == file_record['sha256']
    assert text.split('---', 2)[1] == restored.split('---', 2)[1]
    assert metadata(text) == metadata(restored)
    assert urls(text) == urls(restored) and re.findall(r'\d+', text) == re.findall(r'\d+', restored)
    assert len(metadata(text)['faq']) == old['FAQcount']
    cli_path = Path(file_record['actualCLIRecord'])
    assert fh(cli_path) == file_record['actualCLIRecordSHA']
    cli = next(x for x in json.loads(cli_path.read_text())['rows'] if x['id'] == ident)
    assert cli['sha256'] == h(text) and cli['exit_code'] == 0 and 'OK — no variety limit violated' in cli['stdout']
    assert cli['metrics'] == file_record['metrics']
    arrays = [s['text'] for para in cli['paragraphs'] for s in para['sentences']]
    assert len(arrays) == file_record['metrics']['sentences']
    delta = []; eq = 0
    for tag, a, b, c, d in SequenceMatcher(None, old['actualSentences'], arrays, autojunk=False).get_opcodes():
        if tag == 'equal': eq += b-a
        else: delta.append({'kind': tag, 'before': old['actualSentences'][a:b], 'after': arrays[c:d]})
    assert len(delta) == (1 if es else 0)
    rr = next(x for x in render['rows'] if x['id'] == ident)
    assert rr['sha256'] == h(text) and rr['frontmatter'] == metadata(text)
    changed = []
    if es:
        parser = ParagraphReader(); parser.feed(rr['html'])
        assert list(map(norm, parser.paragraphs)) == list(map(norm, rr['renderedParagraphs']))
        raw_paras = [z.strip() for z in re.split(r'\n\s*\n', text.split('---', 2)[2].split('\n## Uradni viri', 1)[0]) if z.strip() and not z.lstrip().startswith(('#', '|'))]
        assert raw_paras == [z['text'] for z in cli['paragraphs']]
        assert [norm(' '.join(s['text'] for s in z['sentences'])) for z in cli['paragraphs']] == list(map(norm, parser.paragraphs))
        assert [norm(re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', z)) for z in raw_paras] == list(map(norm, parser.paragraphs))
        ir = next(x for x in integrity['rows'] if x['id'] == ident)
        for cp in ir['changedParagraphs']:
            assert cp['after'] in raw_paras
            ci = raw_paras.index(cp['after'])
            actual = cli['paragraphs'][ci]['sentences']
            assert [(s['text'], s['length']) for s in actual] == [(s['text'], s['units']) for s in cp['sentences']]
            changed.append({'raw': cp['after'], 'rendered': parser.paragraphs[ci], 'sentences': actual,
                            'modelReadWithAdjacentParagraphs': True})
    same += eq; total += len(arrays)
    rows.append({'id': ident, 'path': str(p), 'sha256': h(text), 'r1SHA256': h(restored), 'exactChanges': es,
        'forwardExact': True, 'reverseExact': True, 'metadataFAQBytesUnchanged': True, 'URLAndNumericSequencesUnchanged': True,
        'actualCLI': str(cli_path), 'actualCLIRecordSHA256': fh(cli_path), 'actualExit': cli['exit_code'], 'stdout': cli['stdout'],
        'metrics': cli['metrics'], 'sameSentences': eq, 'currentSentences': len(arrays), 'actualDelta': delta,
        'changedParagraphsDirectlyRead': changed, 'unchangedArraysReusedFromR1': not bool(es),
        'changedFileSavedRenderedHTMLIndependentlyParsed': bool(es)})
assert same == 249 and total == 252
assert sum(len(r['exactChanges']) for r in rows) == 2
assert sum(len(p['sentences']) for r in rows for p in r['changedParagraphsDirectlyRead']) == 7
result = {'atUTC': datetime.now(timezone.utc).isoformat(), 'status': 'TARGETED_OPTIONAL_CLOSURE_PASS',
    'closed': ['O01', 'O02'], 'mandatoryRemaining': 0, 'optionalRemaining': 0,
    'reviewer': 'column_live_audit model; no human native/lawyer approval', 'verifiedBindings': bindings,
    'bindingCount': len(bindings), 'rows': rows, 'sixOriginalR1SHAReconstructed': True,
    'currentSentences': 252, 'sameR1Sentences': 249, 'newSentencesRead': 3,
    'changedParagraphsRead': 2, 'changedParagraphSentencesRead': 7,
    'freshVarietyCLIRuns': 0, 'freshRenderRuns': 0, 'freshStructureRuns': 0,
    'freshWebRequests': 0, 'originalR1Preserved': True,
    'limits': ['Only the adopted two optional changes were reopened; unchanged full semantic review remains the R1 record.',
               'Actual author runs for two affected files bound by current SHA; no new full CLI pass claimed.',
               'Saved ReactMarkdown HTML of affected files parsed; no public browser, deployment, card, JSON-LD or feed verification.']}
proof_path = C / 'sl-independent-r2-proof.json'; assert not proof_path.exists()
proof_path.write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n')
report = f'''# SL6 독립 R2 — 채택된 선택2건의 표적 종결

{result['atUTC']}. 검수자 column_live_audit의 모델 기반 독립 검수이며 사람 원어민·변호사 감수 표시는 아니다.

O01/O02를 닫는다. 남은 필수0·선택0. 이번 작업은 R1의 선택 명료화를 root가 채택한 뒤 변경 부분만 재확인한 것이며, 기존 문장을 필수 법률 오류로 재분류하지 않았다. 원고·저자 기록·R·공유 도구는 수정하지 않았다.

R1 보고서 `reviews/sl-independent.md` SHA `a52d61c75547b82f1ba3d9a8b27341cd354b90622610a635dc3173bb3109a505`, R1 manifest `d62b58291c2ace2cc922c5e08ad31e83fcab0adcfb1618780859c58eff65419f`, findings `be52cffada336d5cf1e0e714c041c17f026e4747964ed7383a28586db0290b85`는 바이트 그대로 유지됐다. 이번 저자 R2는 `4e806ec59848a86f353ba41aef9826351e9c5eed00cdc120ccc5d7fc4d6a2014`, 저자 manifest R2는 `9a1d4430dd97c12585a162d610e0f5230e3ccb1467bea2c05f6876050e2eb9fa`다.

## 실제 문장과 의미 보존

916 O01은 제안한 문자열 그대로다. 현재 문단은 양측의 투자 촉진 의향을 먼저 밝히고, 미국 측이 적절한 경우 대만의 핵심 분야 투자에 대해 미국 민간 파트너와 협력하고 적용법에 따라 금융지원을 고려하겠다고 설명한다. 개별 금융승인 아님·모든 협정 조항 발효 증거 아님이라는 다음 두 문장도 그대로다. 지원 대상의 국적을 슬로베니아어 독자에게 자동 적용하거나 지원금을 보장하지 않는다. 동결 USTR 공식 응답의 조건과 일치한다.

920 O02는 `Tudi pogodba z monterjem lahko začetek del veže na pridobitev potrebnih soglasij in določi, kdo nosi stroške, če je prošnja zavrnjena.`로 바뀌었다. 사적 계약의 착공을 필요한 동의와 연결할 수 있다는 조언과 거절 시 비용 배분이다. 뒤의 `Tak dogovor ne nadomesti odločitve pristojnega organa stavbe.`를 보존해, 계약이 공동체의 권한 있는 기관 결정을 대신한다는 의미가 생기지 않는다. 모든 충전기에 새로운 획일적 절차를 만드는 문장도 아니다.

두 현재 문단과 앞뒤 문맥을 직접 읽었다. 916은14/30/5/12 단위의4문장,920은21/8/8 단위의3문장이다. 현재 전체252분절 중249개는 R1과 동일하고 새3문장은 이 두 문단 안에 있다. 긴 조건을 독립적인 짧은 결과와 연결하며 §5의 도입·질문·결말·기존 사실관계를 바꾸지 않았다. MONOTONY: 새 반려 사유0 — 두 변경이 과도한 같은 시작이나 기계적 문장 분할을 만들지 않았다.

## 독립 검증 근거

`sl-independent-r2-verify.py`가 실제 현재파일에서 두 after 문자열을 해당 offset으로 되돌려 원래6SHA를 모두 재현했다. 원래 문자열을 다시 적용해 현재6파일과도 바이트 일치했다. 저자의 reverseExact 값만 신뢰한 것이 아니다. 두 치환은 R1 findings의 before/after와 정확히 같고 다른 네 파일은 처음부터 바이트 불변이다.

6편의 frontmatter/FAQ17 바이트, URL 값·순서, 숫자 토큰·순서가 R1과 같다. 실제 저자의916/920 CLI 기록은 현재SHA·공유4파일SHA와 연결되어 두 편 exit0/FAIL0, CV.470/.478이다. 구조 오류0 기록도 영향2편에 연결된다. 나머지4편은 같은SHA의 R1 검사 근거를 재사용했다. 검수자가 새 전수 variety/구조 검사를 실행하지 않았다.

영향2편의 보관 ReactMarkdown HTML을 독립 파싱해 현재 Markdown 문단·CLI 배열의 합친 문자열과 비교했고 모두 같았다. 새 렌더를 실행한 것으로 표시하지 않는다. 원고·저자·R1 기록·입력·이미지·도구·R2 근거 {len(bindings)}개 경로의 SHA가 현재 실제 바이트와 일치했다.

| 원고 | 현재 SHA256 | 이번 의미 확인 |
|---|---|---|
'''
for r in rows:
    report += f'| {r["id"]} | `{r["sha256"]}` | {"선택 변경 문단 직접 확인" if r["exactChanges"] else "동일 SHA R1 재사용"} |\n'
report += f'''
독립 proof: `checks/sl-independent-r2-proof.json`, SHA `{fh(proof_path)}`. 원R1 전문 검수는 유지하며, 이번에는 선택2건만 재개했다. 사람 원어민/법률 승인, 새 공식 HTTP, 공개 브라우저·모바일·카드·JSON-LD·feed·배포 검증은 범위가 아니다.
'''
report_path = B / 'reviews/sl-independent-r2.md'; assert not report_path.exists()
report_path.write_text(report)
for entry in bindings: assert fh(entry['path']) == entry['sha256']
manifest = {'atUTC': datetime.now(timezone.utc).isoformat(), 'status': result['status'], 'closed': ['O01', 'O02'],
    'mandatoryRemaining': 0, 'optionalRemaining': 0, 'r1Report': m['independentR1'],
    'r2Author': m['authorReport'], 'r2AuthorManifest': {'path': str(C/'sl-final-manifest-r2.json'), 'sha256': fh(C/'sl-final-manifest-r2.json')},
    'files': [{'path': r['path'], 'sha256': r['sha256']} for r in rows],
    'artifacts': [{'path': str(p), 'sha256': fh(p)} for p in [report_path, proof_path, Path(__file__)]],
    'verifiedBindings': bindings, 'reviewerNewCLIRuns': 0, 'unchangedR1PlusTargetedMeaning': True}
out = C / 'sl-independent-r2-manifest.json'; assert not out.exists()
out.write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n')
print(json.dumps({'report': {'path': str(report_path), 'sha256': fh(report_path)}, 'manifest': {'path': str(out), 'sha256': fh(out)},
    'bindings': len(bindings), 'reversed': 6, 'exactChanges': 2, 'sameSentences': same, 'newSentences': total-same,
    'mandatoryRemaining': 0, 'optionalRemaining': 0}, ensure_ascii=False, indent=2))
