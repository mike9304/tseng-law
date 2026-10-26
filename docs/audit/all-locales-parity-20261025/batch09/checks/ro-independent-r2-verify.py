from pathlib import Path
from hashlib import sha256
from datetime import datetime, timezone
from difflib import SequenceMatcher
import sys, json, re, yaml
sys.dont_write_bytecode = True
sys.path.insert(0, '/Users/son7/tseng-lanes-shared/variety')
import variety_metrics as vm

B=Path('/Users/son7/tseng-all-language-columns-20261025/batch09'); C=B/'checks'
def h(t): return sha256(t if isinstance(t,bytes) else t.encode()).hexdigest()
def fh(p): return h(Path(p).read_bytes())
def j(n): return json.loads((C/n).read_text())
def fm(t): return yaml.safe_load(t.split('---',2)[1])
def body(t): return t.split('---',2)[2]
def links(t): return re.findall(r'\]\(([^)]+)\)',t)
def difffields(a,b,prefix=''):
    if isinstance(a,dict) and isinstance(b,dict):
        return [z for k in sorted(set(a)|set(b)) for z in difffields(a.get(k),b.get(k),prefix+('.' if prefix else '')+str(k))]
    if isinstance(a,list) and isinstance(b,list) and len(a)==len(b):
        return [z for k,(x,y) in enumerate(zip(a,b)) for z in difffields(x,y,prefix+'.'+str(k))]
    return [] if a==b else [prefix]

m2=j('ro-author-r2-manifest.json');m3=j('ro-author-r3-manifest.json')
assert fh(C/'ro-author-r3-manifest.json')=='a47e5fd3a84e90d2aed818291d8f98763d3d89f0b3fb67826819b06fc5106173'
original=j('ro-review-r2-before.json'); edits=j('ro-review-r2-edits.json'); punct=j('ro-review-r3-punctuation.json')
findings=j('ro-independent-findings.json')['optional']; prior=j('ro-independent-proof.json')
prior_arrays=j('ro-final-proof.json'); current_author=j('ro-review-r2-proof.json'); audit=j('ro-content-audit-review-r2.json')
assert fh(B/'reviews/ro-independent.md')=='2baee72a8ee0ef3a91c213ccf308dd6207b5efe57b4c7a99b5d81e77c6c68c1f'
assert fh(C/'ro-independent-final-manifest.json')=='6a14a08a51d54038524944e6968120b64875c300c81cb8099ea57272aa040c55'
hashes={}
def collect(x):
    if isinstance(x,dict):
        if isinstance(x.get('path'),str) and isinstance(x.get('sha256'),str):assert hashes.setdefault(x['path'],x['sha256'])==x['sha256']
        for v in x.values():collect(v)
    elif isinstance(x,list):
        for v in x:collect(v)
collect(m3)
collect({k:v for k,v in m2.items() if k!='files'})
collect(original['priorEvidence'])
bindings=[]
for path,expected in sorted(hashes.items()):
    actual=fh(path);assert actual==expected,path
    bindings.append({'path':path,'sha256':actual,'match':True})
rows=[];total_same=0;total_current=0
for r in m3['files']:
    path=Path(r['path']); ident=path.name[:3];text=path.read_text()
    old=next(x for x in original['files'] if x['path']==str(path))
    er=next(x for x in edits['files'] if x['path']==str(path))
    r1=next(x for x in prior['rows'] if x['path']==str(path))
    assert h(old['text'])==old['sha256']==r1['sha256']==er['beforeSHA256']
    assert old['text']==er['before']
    intermediate=old['text']
    for e in er['edits']:
        f=next(x for x in findings if x['id']==e['id'])
        assert e['old']==f['old'] and e['new']==f['new'] and intermediate.count(e['old'])==1
        intermediate=intermediate.replace(e['old'],e['new'],1)
    assert intermediate==er['after'] and h(intermediate)==er['afterSHA256']
    final=intermediate
    if ident=='915':
        assert intermediate==punct['beforeText'] and h(intermediate)==punct['beforeSHA256']
        assert intermediate.count(punct['exactBefore'])==1
        final=intermediate.replace(punct['exactBefore'],punct['exactAfter'],1)
        assert final==punct['afterText'] and len(final.encode())==len(intermediate.encode())+1
        assert final.replace(punct['exactAfter'],punct['exactBefore'],1)==intermediate
    assert final==text and h(text)==r['sha256']
    restored=intermediate
    for e in reversed(er['edits']):
        assert restored.count(e['new'])==1;restored=restored.replace(e['new'],e['old'],1)
    assert restored==old['text']
    assert links(text)==links(restored) and re.findall(r'\d+',text)==re.findall(r'\d+',restored)
    fields=difffields(fm(restored),fm(text))
    assert fields==(['faq.1.a'] if ident=='920' else [])
    if ident!='915':assert body(text)==body(restored)
    old_array_row=next(x for x in prior_arrays['rows'] if x['path']==str(path))
    old_arrays=[s['text'] for p in old_array_row['sentencesByParagraph'] for s in p]
    author=next(x for x in current_author['rows'] if x['path']==str(path))
    new_arrays=author['sentences']
    cli_data=json.loads(Path(author['actualCLI']).read_text())
    cli=next(x for x in cli_data['rows'] if x['file']==str(path))
    assert cli['exit']==0 and 'OK — no variety limit violated' in cli['stdout']
    assert cli['metrics']==author['metrics']
    metric_bridge=None;changed_paragraph=[]
    if ident=='915':
        assert cli['sha256']==h(intermediate)
        # New punctuation is a genuinely changed input. Use the unchanged
        # API only for this affected file; do not rerun any CLI or other files.
        mb=vm.metrics(intermediate,'ro');ma=vm.metrics(text,'ro')
        assert mb==ma==cli['metrics']==punct['metrics']
        pb=vm.body_blocks(vm.strip_fm(intermediate)[1],'ro')[0]
        pa=vm.body_blocks(vm.strip_fm(text)[1],'ro')[0]
        sb=[[{'text':s,'units':vm.slen(s,'ro')} for s in vm.sentences(p,'ro')] for p in pb]
        sa=[[{'text':s,'units':vm.slen(s,'ro')} for s in vm.sentences(p,'ro')] for p in pa]
        assert sb==[p['sentences'] for p in cli['paragraphs']]
        assert [[s['units'] for s in p] for p in sb]==[[s['units'] for s in p] for p in sa]
        new_arrays=[s['text'] for p in sa for s in p]
        changes=[i for i,(a,b) in enumerate(zip(sb,sa)) if a!=b];assert len(changes)==1
        k=changes[0];changed_paragraph=sa[k]
        assert [s['units'] for s in changed_paragraph]==[34,4,19]
        assert changed_paragraph[0]['text']==sb[k][0]['text'].replace('ITA prezintă','ITA, prezintă',1)
        metric_bridge='Actual R2 CLI measured pre-comma SHA. Current one-comma input independently re-extracted through unchanged shared API: same paragraph/sentence count, corresponding units and all metrics; one sentence literal differs.'
    elif ident=='920':
        assert cli['sha256']==r1['sha256']
        assert cli['metrics']==r1['metrics'] and author['sentences']==old_arrays
        metric_bridge='Only FAQ answer changed; complete body bytes unchanged from measured R1, so body CLI/arrays remain applicable.'
    else:
        assert h(text)==r1['sha256']
        assert author['sentences']==old_arrays
        metric_bridge=r1.get('918Bridge')
    same=0;delta=[]
    for tag,a,b,c,d in SequenceMatcher(None,old_arrays,new_arrays,autojunk=False).get_opcodes():
        if tag=='equal':same+=b-a
        else:delta.append({'kind':tag,'before':old_arrays[a:b],'after':new_arrays[c:d]})
    total_same+=same;total_current+=len(new_arrays)
    rows.append({'path':str(path),'sha256':h(text),'r1SHA256':h(restored),'interimR2SHA256':h(intermediate),
      'exactR1ProposalsApplied':er['edits'],'reviewerPunctuationCorrectionApplied':ident=='915',
      'forwardExact':True,'reverseToR1Exact':True,'metadataChangedFields':fields,
      'currentFAQ':fm(text)['faq'],'linksAndNumericSequenceUnchanged':True,
      'bodyBytesEqualR1':body(text)==body(restored),'metrics':author['metrics'],
      'actualCLI':author['actualCLI'],'actualCLISHA256':fh(author['actualCLI']),'actualCLIExit':cli['exit'],
      'actualCLIMeasuredFileSHA256':cli['sha256'],'measurementBridge':metric_bridge,
      'sameR1Sentences':same,'currentSentences':len(new_arrays),'actualDelta':delta,
      'changedParagraphDirectlyRead':changed_paragraph})
assert total_same==227 and total_current==228
assert audit['selected']==2 and audit['errors']==0
structure_bindings=[]
for g in audit['groups']:
    for ar in g['files']:
        ident=Path(ar['file']).name[:3];r=next(x for x in rows if Path(x['path']).name.startswith(ident))
        assert ar['sha256']==r['interimR2SHA256'] and ar['errors']==[]
        structure_bindings.append({'id':ident,'measuredSHA256':ar['sha256'],'currentSHA256':r['sha256'],
            'historicalErrors':0,'newStructureCLI':False,'bridge':'one restored ASCII comma only; all metadata, links, numbers preserved' if ident=='915' else 'same current SHA'})
result={'atUTC':datetime.now(timezone.utc).isoformat(),'status':'TARGETED_CLOSURE_PASS_WITH_REVIEWER_ERRATUM',
    'closed':['O01','O02','reviewer-appositive-comma-correction'],'mandatoryRemaining':0,'optionalRemaining':0,
    'rows':rows,'verifiedBindings':bindings,'bindingCount':len(bindings),
    'allSixR1Reconstructed':True,'currentSentences':228,'sameR1Sentences':227,'newBodySentences':1,
    'changedFAQFields':['920:faq.1.a'],'FAQ':17,'freshVarietyCLIRuns':0,
    'freshSharedAPIFileScope':['915 before/after final comma'], 'structureBindings':structure_bindings,
    'freshStructureCLI':0,'freshWebRequests':0,'publicRenderInspected':False,
    'reviewerErratum':{'path':str(C/'ro-independent-r2-punctuation-erratum.json'),'sha256':fh(C/'ro-independent-r2-punctuation-erratum.json')},
    'limitations':['No new full semantic review; unchanged R1 findings reused.', 'No human native/lawyer approval.', 'No new public/browser/layout/deployment validation.']}
proof_path=C/'ro-independent-r2-proof.json';assert not proof_path.exists();proof_path.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
report=f'''# RO 독립 R2 — 선택2건과 검수자 문장부호 정정 종결

{result['atUTC']}. O01/O02와 쉼표 정정을 닫는다. 남은 필수0·선택0. 기존 독립R1과 저자R1/R2/R3 기록을 모두 보존했다. 모델 기반 표적 의미·문체 검수이며 사람 원어민·변호사 승인이나 공개 배포 완료가 아니다.

## 제안 정정 경위

검수자가 R1 O02에서 자료 제목 뒤의 쉼표를 불필요한 주어·동사 사이 쉼표로 설명한 부분은 부정확했다. 앞의 쉼표가 기관 약칭 `ITA`를 동격어로 소개하므로 뒤 쉼표는 그 표현을 닫는 기능이 있다. 이 판단을 원 R1에서 지우지 않고 `ro-independent-r2-punctuation-erratum.json`에 기록했으며 Root 승인으로 작성자가 한 글자만 복원했다. 최종 조달 대상 명료화는 유지된다. 저자의 원래 법률 내용 오류로 책임을 돌리지 않는다.

실제 단계는 R1→저자R2의 제안2치환, R2→저자R3의 ASCII 쉼표1개 복원이다. 중간915 SHA `688c9eaa19ea1fa85cd2940f0294aa1beb6a1a6868fa655207b1053acb122fd2`와 새915 SHA `e34e3ffd9df098598a2d317366b371d978ea88a37a03516389e1ca5277111cc7`를 구별한다. R1 선택안이 처음부터 완전했다고 표시하지 않는다.

## 현재 문장과 의미 보존

O01,920 FAQ2: `Locatarul a invocat oprirea și încuierea echipamentului, precum și disponibilitatea de a preda cheia comitetului.`를 본문44행과 함께 다시 읽었다. 정지·잠금과 위원회에 열쇠를 넘길 의향을 보존하며 실제 인도 완료를 새 사실로 만들지 않는다. 다음 문장의 ‘가정적으로 참이어도’ 철거·원상회복 의무, 해당 사건 한정도 그대로다. 이 FAQ 변화는 `faq.1.a` 하나이고 본문 전체 바이트는 같다.

O02,915: 현재 문장은 `..., ITA, prezintă achiziții pentru infrastructura energetică și rețelele electrice din Taiwan, anticipate pentru sfârșitul anului și pentru 2027, inclusiv oportunități pentru furnizori americani.`로 읽힌다. 조달 대상은 대만 에너지 인프라·전력망이며 자료일·연말/2027 전망·미국 공급자 범위가 같다. 뒤의 `Sunt perspective de piață.`와 특정 입찰 개시·회사 자격·85-1 분류의 비보장 문장도 유지했다. 이를 실제 입찰 승인이나 국적별 자동 자격으로 바꾸지 않았다.

S09 보관 L32/L44와 ITA 보관 L13–15/L19는 R1 때 직접 읽은 동일 SHA 근거를 재사용했다. 이번에 새 공식 HTTP를 요청하거나 판결 전체를 새로 확보했다고 표시하지 않는다.

## 독립 재현과 실제 검사 연결

검수자가 R1 전에 저장한 proof SHA와 저자의 before6 전문을 대조한 뒤, 제안2치환과 추가 쉼표1개를 정방향으로 적용해 현재6파일을 재현했다. 역방향으로도 R1의6SHA가 모두 일치했다. 나머지4파일은 전체 바이트 불변이다.6편 URL 값/순서와 숫자 토큰/순서도 같다. 메타데이터 변경은920 `faq.1.a`만이며 FAQ 총17개를 유지한다.

915의 실제 R2 CLI는39문장·CV.545·exit0/FAIL0이며 당시 측정 SHA는 쉼표 복원 전이다. 최종 쉼표가 추가된 현재 입력을 이 검수자가 공유 API로 표적 재추출해 전후 문단/문장 수, 대응하는 단어 수와 모든 지표가 그 실제 CLI와 같음을 확인했다. 문자 그대로의 배열은 한 문장에 쉼표가 추가되어 다르며, 배열 바이트까지 동일하다고 쓰지 않는다. 새 CLI는 실행하지 않았다.

920의 이전 실제 CLI는 본문 바이트가 동일하므로 그대로 적용된다(CV.450).918의 출처 꼬리와 초기 측정 본문 동일 연결도 R1 기록대로 유지한다. 다른4편을 새 전체 검수·새 CLI PASS로 포장하지 않는다.

전체228분절 중227개가 R1과 같고915의 조달 문장 하나만 바뀌었다. 최종 변경 문단은34/4/19단위 세 문장으로 직접 읽었다. 정상 날짜/수치 표기와 문장 경계를 바꾸지 않았다. MONOTONY: 새 반려0 — 한 긴 조달 문장 뒤 짧은 전망 문장이 유지되고 도입·질문·실질 결말은 그대로다. §5의 변경 없는 부분은 R1 평가를 재사용한다.

저자가 실제 실행한 영향915/920 구조 오류0·REQUIRED11은 R2 시점 기록이다.920은 최종 현재SHA와 같고915은 이후 쉼표1개만 바뀌었다는 정확한 연결을 남겼다. 새 구조 CLI를 실행한 것으로 표시하지 않으며, metadata/링크/숫자 불변은 직접 파싱해 확인했다.

| 원고 | 최종 SHA256 |
|---|---|
'''
for r in rows:report+=f'| {Path(r["path"]).name[:3]} | `{r["sha256"]}` |\n'
report+=f'''
저자R2 `c405f52f130773922e7f1abe6e9c3df966d9247772b5527d3c3a823a34edbe92`, 저자R3 `8058b78701c15a967c659399b41490b78cfb48220ea4c7387e79ec88bc7fbf7f`, R3 manifest `a47e5fd3a84e90d2aed818291d8f98763d3d89f0b3fb67826819b06fc5106173`를 현재 바이트에 연결했다. R1 보고서 `2baee72a8ee0ef3a91c213ccf308dd6207b5efe57b4c7a99b5d81e77c6c68c1f`와 기존 모든 근거는 보존됐다. 독립 proof SHA `{fh(proof_path)}`. 총 {len(bindings)}개 근거 경로 해시를 확인했다.

검수자는 원고·저자 기록·R·공유 도구를 수정하지 않았다. 새 전체 독서·사람 감수·공개 화면·모바일·카드·JSON-LD·feed·배포 완료는 이번 범위가 아니다.
'''
report_path=B/'reviews/ro-independent-r2.md';assert not report_path.exists();report_path.write_text(report)
for r in bindings:assert fh(r['path'])==r['sha256']
manifest={'atUTC':datetime.now(timezone.utc).isoformat(),'status':result['status'],'mandatoryRemaining':0,'optionalRemaining':0,
    'closed':result['closed'],'files':[{'path':r['path'],'sha256':r['sha256']} for r in rows],
    'authorR3':m3['authorReport'],'authorR3Manifest':{'path':str(C/'ro-author-r3-manifest.json'),'sha256':fh(C/'ro-author-r3-manifest.json')},
    'r1Report':m2['priorIndependentReport'],'r1Manifest':m2['priorIndependentManifest'],
    'artifacts':[{'path':str(p),'sha256':fh(p)} for p in [report_path,proof_path,Path(__file__),C/'ro-independent-r2-punctuation-erratum.json']],
    'verifiedBindings':bindings,'reviewerNewCLIRuns':0,'reviewerAPIReextractionScope':['915 only'],
    'currentSentences':228,'sameR1Sentences':227,'FAQ':17,'metadataChangedFields':['920:faq.1.a']}
out=C/'ro-independent-r2-manifest.json';assert not out.exists();out.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'report':{'path':str(report_path),'sha256':fh(report_path)},'manifest':{'path':str(out),'sha256':fh(out)},
    'bindings':len(bindings),'r1Restored':6,'remainingMandatory':0,'remainingOptional':0,'same':227,'total':228},ensure_ascii=False,indent=2))
