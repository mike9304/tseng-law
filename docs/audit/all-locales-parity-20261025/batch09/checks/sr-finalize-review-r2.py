from pathlib import Path
from hashlib import sha256
from datetime import datetime, timezone
from difflib import SequenceMatcher
from html.parser import HTMLParser
import json, re, copy, yaml

B = Path('/Users/son7/tseng-all-language-columns-20261025/batch09')
C = B/'checks'
def h(t): return sha256(t if isinstance(t, bytes) else t.encode()).hexdigest()
def fh(p): return h(Path(p).read_bytes())
def j(n): return json.loads((C/n).read_text())
def record(p): return {'path': str(p), 'sha256': fh(p)}
def norm(t): return re.sub(r'\s+', ' ', t).strip()
class HTMLParagraphs(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True); self.active=False; self.buf=[]; self.rows=[]
    def handle_starttag(self, tag, attrs):
        if tag=='p': self.active=True; self.buf=[]
    def handle_endtag(self, tag):
        if tag=='p': self.rows.append(''.join(self.buf)); self.active=False
    def handle_data(self, data):
        if self.active: self.buf.append(data)

old_manifest=j('sr-final-manifest.json'); old_proof=j('sr-final-proof-current.json')
edits=j('sr-review-r1-edits.json'); cli=j('sr-variety-review-r2.json')
render=j('sr-metadata-render-review-r2.json'); audit=j('sr-content-audit-review-r2.json')
assert cli['exitCode']==0 and len(cli['files'])==len(cli['extraction'])==1
assert 'OK — no variety limit violated' in cli['stdout'] and 'FAIL ' not in cli['stdout']
assert audit['selected']==1 and audit['errors']==0 and render['errors']==[] and len(render['rows'])==1
p=Path(edits['path']);text=p.read_text();assert text==edits['afterText'] and h(text)==edits['afterSHA256']
finding=edits['finding'];restored=text.replace(finding['exact_after'],finding['exact_before'],1)
assert restored==edits['beforeText'] and h(restored)==edits['beforeSHA256']
assert restored.replace(finding['exact_before'],finding['exact_after'],1)==text
for r in edits['preservedR1']:assert fh(r['path'])==r['sha256']
for r in edits['beforeSix']:
    if r['path']!=str(p):assert fh(r['path'])==r['sha256']
assert text.split('---',2)[1]==restored.split('---',2)[1]
assert re.findall(r'\]\(([^)]+)\)',text)==re.findall(r'\]\(([^)]+)\)',restored)
assert re.findall(r'\d+',text)==re.findall(r'\d+',restored)
cr=cli['extraction'][0];rr=render['rows'][0]
assert cr['sha256']==rr['sha256']==h(text) and cli['files'][0]['sha256']==h(text)
for path,expected in cli['toolHashes'].items():assert fh(path)==expected
ar=audit['groups'][0]['files'][0];assert ar['sha256']==h(text) and ar['errors']==[]
parser=HTMLParagraphs();parser.feed(rr['renderedBodyHTML'])
new_sentences=[s['text'] for para in cr['paragraphs'] for s in para['sentences']]
lengths=[s['units'] for para in cr['paragraphs'] for s in para['sentences']]
assert [norm(' '.join(s['text'] for s in para['sentences'])) for para in cr['paragraphs']]==list(map(norm,parser.rows))
raw_body=text.split('---',2)[2].split('\n## Zvanični izvori',1)[0]
raw_paras=[x.strip() for x in re.split(r'\n\s*\n',raw_body) if x.strip() and not x.lstrip().startswith(('#','|'))]
assert [norm(re.sub(r'\[([^\]]+)\]\([^)]+\)',r'\1',x)) for x in raw_paras]==list(map(norm,parser.rows))
previous=next(r for r in old_proof['rows'] if r['file']==str(p))
delta=[];same=0
for tag,a,b,c,d in SequenceMatcher(None,previous['actual_source_sentences'],new_sentences,autojunk=False).get_opcodes():
    if tag=='equal':same+=b-a
    else:delta.append({'kind':tag,'before':previous['actual_source_sentences'][a:b],'after':new_sentences[c:d]})
assert same==37 and len(delta)==1 and len(delta[0]['before'])==len(delta[0]['after'])==1
assert len(new_sentences)==38
changed_para=next(x for x in cr['paragraphs'] if any('Kancelarija američkog' in s['text'] for s in x['sentences']))
assert [s['units'] for s in changed_para['sentences']]==[42,7,9]
current_rows=copy.deepcopy(old_proof['rows'])
new_row=next(r for r in current_rows if r['file']==str(p))
new_row.update({'sha256':h(text),'r1_sha256':edits['beforeSHA256'],'actual_cli_evidence':'sr-variety-review-r2.json',
    'observed_batch_exit':0,'observed_file_status':'OK — no variety limit violated','metrics':cr['metrics'],
    'actual_source_sentences':new_sentences,'actual_rendered_sentences':new_sentences,
    'actual_rendered_paragraphs':parser.rows,'lengths':lengths,'source_paragraphs':raw_paras,
    'current_segment_count':38,'r2_exact_change':finding,'r2_reverse_to_r1_exact':True})
for r in current_rows:
    assert fh(r['file'])==r['sha256']
    if r['file']!=str(p):assert r==next(x for x in old_proof['rows'] if x['file']==r['file'])
bindings=[]
for group in ['inputs','source_images']:
    for r in old_manifest[group]:
        assert fh(r['path'])==r['sha256']
        bindings.append(record(Path(r['path'])))
for r in old_manifest['evidence']:
    assert fh(r['path'])==r['sha256'];bindings.append(record(Path(r['path'])))
proof={'atUTC':datetime.now(timezone.utc).isoformat(),'scope':'Author targeted optional S01 correction, not independent closure.',
    'rows':current_rows,'exactChanges':1,'r1SixSHAReconstructed':True,'r1Preserved':edits['preservedR1'],
    'changedFile':str(p),'beforeSHA256':edits['beforeSHA256'],'afterSHA256':h(text),
    'changedParagraphDirectlyRead':changed_para,'actualSentenceDelta':delta,'unchangedCurrentSentences':237,
    'currentSentences':238,'newSentences':1,'metadataFAQURLNumbersPreserved':True,
    'affectedActualCLI':record(C/'sr-variety-review-r2.json'),'affectedCLIExit':0,'affectedMetrics':cr['metrics'],
    'affectedStructure':record(C/'sr-content-audit-review-r2.json'),'affectedStructureErrors':0,
    'affectedActualRender':record(C/'sr-metadata-render-review-r2.json'),'savedActualRenderArraysEqual':True,
    'otherFiveCLIRerun':False,'unchanged921HistoricalBatchExit':1,'unchanged921IndividualStatus':'OK — no variety limit violated',
    'sourceAndPriorEvidenceHashBindings':bindings,'sharedToolHashes':cli['toolHashes'],
    'limits':['Model author review only, no human native/lawyer approval.','Independent R2 closure pending.','No public browser/build/deployment verification.']}
proof_path=C/'sr-review-r2-proof.json';assert not proof_path.exists();proof_path.write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n')
report=f'''# SR 저자 R2 — 916 S01 선택 명료화

{proof['atUTC']}. Root가 독립 R1의 선택 S01을 채택하여 정확히 한 문자열만 바꿨다. 원 독립 R1·저자·manifest·기존 검사 기록을 그대로 보존했고, 기존 문장을 필수 오류로 재분류하지 않는다. 사람 원어민·변호사 감수 표시는 아니다.

## 실제 수정과 의미

전: `{finding['exact_before']}`

후: `{finding['exact_after']}`

전체 변경 문장:

> {finding['proposed_sentence']}

미국이 금융지원을 고려하는 주체이고 투자 대상지는 대만이라는 점을 명시했다. `tajvanskih privatnih ulaganja`를 대만 투자자의 투자로 읽을 가능성을 줄였다. 미국 민간 파트너와 협력·적용법 조건을 보존하며 지원금 지급이나 개별 투자권을 보장하지 않는다. 다음 `Reč je o nameri i mogućoj podršci.`와 `Dokument ne daje svakom pojedinačnom investitoru pravo na finansiranje.`도 그대로다. 영문 상담 페이지 안내 역시 불변이며 세르비아어 상담 보장을 추가하지 않았다.

B6 동결 EN916과 공식 USTR 보관 응답 `research/recheck/official-04.json`의 L23을 실제 다시 읽어 미국 측 지원 고려·대만 투자·미국 민간 파트너·적용법의 관계를 대조했다. 새 HTTP 조회나 협정 발효 확인을 했다는 뜻은 아니다. 공통 규칙/문체 정본/정본6은 같은 SHA에서 계속 작업하며 전문을 읽은 기록을 재사용했고, 현재 LESSONS17:05 SHA `86710ef330b108a916a7bb92a75f1ffa62dea53412e8a75f38472d9fa9b33130`도 확인했다.

## 실제 바이트와 검사

916 전 SHA `{edits['beforeSHA256']}` → 후 SHA `{h(text)}`.

`sr-review-r1-edits.json`에 전체 전후 텍스트·exact 위치·diff·역복원·원R1 해시를 남겼다. 수정 후 실제파일에서 한 구절을 되돌리면 이전916 SHA가 정확히 복원되며 다른5편은 바이트 불변이다.6편의 원R1 SHA를 모두 재현했다. Frontmatter/FAQ17, URL 값·등장 순서, 숫자 토큰·순서는 그대로다.

Node24 PATH와 실제 공유 `--lang sr`로916만 실행했다. exit0/FAIL0,38문장, CV.518, short.158, run3.028이다. 직전916 CV.504가 .518로 바뀌었지만 수치를 위한 추가 문장 조작은 하지 않았다. 원고의 정확한 선택 문구를 한 번 적용한 결과다. 구조도916만 검사하여 errors0, semanticStatus REVIEW_REQUIRED를 보존했다.

실제 ReactMarkdown/remarkGfm 렌더도916만 새로 실행했다. 메타데이터·FAQ3·그림/캡션/공식 URL·굵은 강조/내부 저자 노출 검사는 오류0이다. 표시문을 독립 파싱하여 실제38개 배열을 다시 합친 문단과 비교했고 모두 같다. 다른5편의 같은 SHA 검사·렌더 근거는 재사용했다. 특히921의 실제 근거는 초기 배치 exit1 안에서 해당파일 개별 OK였음을 유지하고, 별도921 exit0 실행을 새로 주장하지 않는다.

전체238분절 중237개가 그대로이고916의 한 문장만 바뀌었다. 변경 문단3문장과 앞뒤 문맥을 직접 읽었다.42/7/9단위의 흐름으로 한 긴 조건 문장 뒤에 짧은 의향/가능성 문장과 개별권리 제한이 이어진다. `2026.`의 날짜 마침표가 문장을 나누지 않는 기존 실제 경계도 유지했다. §5의 도입·질문·실질 결말·문단 시작·숫자·출처·가상 표시를 바꾸지 않았다. MONOTONY: 새 반려 사유0; 해당 문단에 긴 문장은1개다.

원저자 SHA `0520baa492ca270252fa4161faa9f399dd0ddfa33a3ff76a79a160f68c3a1f41`, 원manifest `3679a1bb60e2606dc9a4c38022ea6b55bd35ca0f0d23cc746a0808a1a780dc07`, 독립R1 `ca68e8e54a6e0e5430676ce528c6549295dbae4e958c6a4e9efb66dd30dba03f`는 불변이다. 현재 증거는 `sr-review-r2-proof.json` SHA `{fh(proof_path)}`와 새 최종manifest로 연결했다.

독립 검수자에게 이 한 변경의 표적 종결을 요청한다. R·공유 도구·타인 파일은 수정하지 않았으며 공개 브라우저·카드·JSON-LD·feed·빌드·배포를 새로 확인하지 않았다.
'''
author=B/'reviews/sr-author-r2.md';assert not author.exists();author.write_text(report)
new_manifest=copy.deepcopy(old_manifest)
new_manifest['atUTC']=datetime.now(timezone.utc).isoformat()
new_manifest['status']='AUTHOR_R2_FROZEN_OPTIONAL_S01_AWAITING_TARGETED_CLOSURE'
new_manifest['author']=record(author)
new_manifest['r1Author']=old_manifest['author']
new_manifest['r1Manifest']=record(C/'sr-final-manifest.json')
new_manifest['independentR1']=record(B/'reviews/sr-independent.md')
new_manifest['current_proof']='checks/sr-review-r2-proof.json'
mr=next(r for r in new_manifest['manuscripts'] if r['path']==str(p))
mr.update({'sha256':h(text),'r1_sha256':edits['beforeSHA256'],'metrics':cr['metrics'],'actual_cli_evidence':'sr-variety-review-r2.json','observed_batch_exit':0,'observed_file_status':'OK — no variety limit violated'})
new_manifest['actual_cli_invocations']=3
new_manifest['actual_cli_file_measurements']=12
new_manifest['adoptedOptional']='S01'
new_manifest['r1EvidencePreserved']=old_manifest['evidence']
new_manifest['evidence']=[record(q) for q in [C/'sr-apply-review-r2.py',C/'sr-review-r1-edits.json',C/'sr-variety-review-r2.json',C/'sr-content-audit-review-r2.json',C/'sr-metadata-render-review-r2.mjs',C/'sr-metadata-render-review-r2.json',proof_path,Path(__file__)]]
out=C/'sr-final-manifest-r2.json';assert not out.exists();out.write_text(json.dumps(new_manifest,ensure_ascii=False,indent=2)+'\n')
for r in edits['preservedR1']:assert fh(r['path'])==r['sha256']
for r in current_rows:assert fh(r['file'])==r['sha256']
print(json.dumps({'author':record(author),'manifest':record(out),'proof':record(proof_path),'changedSHA256':h(text),
    'actualCLIExit':0,'CV':cr['metrics']['len_cv'],'changedSentences':1,'unchangedSentences':237,'otherFiveUnchanged':True},ensure_ascii=False,indent=2))
