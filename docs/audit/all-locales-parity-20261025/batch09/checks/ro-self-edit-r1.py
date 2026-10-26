from pathlib import Path
from hashlib import sha256
from datetime import datetime,timezone
import json,re,difflib
from collections import Counter
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch09');C=B/'checks'
def h(t):return sha256(t.encode()).hexdigest()
initial=json.loads((C/'ro-initial-drafts.json').read_text());files={Path(r['file']).name[:3]:r for r in initial['rows']}
edits=[]
def add(id,old,new,reason,preserve):edits.append({'id':id,'old':old,'new':new,'reason':reason,'meaningPreserved':preserve})
add('915','nu exista nici o convenție arbitrală încheiată de părți','nu exista nicio convenție arbitrală încheiată de părți','부정 형용사 nicio의 루마니아어 철자 교정.','합의 부존재, 법률상 의제 합의와의 병렬 부정 유지.')
add('916','cauzând asumarea acelei datorii','determinând societatea să își asume acea datorie','Art154의 특정 채무를 부담하는 주체가 회사임을 문법상 명시.','법인격 남용→회사 특정 채무 발생, 현저한 변제 곤란, 중대성·필요성, 주주 책임 모두 유지.')
add('918','Hotărârea și materialele oficiale au fost verificate la 25 octombrie 2026, iar normele și informațiile actuale au fost reconfirmate în cercetarea din 26 octombrie.','Hotărârea și materialele oficiale au fost verificate la 25 octombrie 2026, iar normele și informațiile actuale au fost reconfirmate la 26 octombrie.','공개 꼬리의 내부 작업과정 명사를 덜고 실제 확인일 유지.','25일 판결 자료와26일 현행자료 확인 범위 그대로. 측정 제외 꼬리만 수정.')
add('919','Instanța a anulat atât destituirea unui funcționar cu funcție de conducere, cât și decizia care o menținuse la reexaminare. Sancțiunea constase în înscrierea, printr-o singură măsură, a două abateri disciplinare majore, denumite 記兩大過 în sistemul taiwanez, cu consecința destituirii.','Instanța a anulat destituirea și decizia de reexaminare. Funcționarul cu funcție de conducere fusese destituit în urma a două penalizări disciplinare majore, dispuse printr-o singură măsură și denumite 記兩大過 în sistemul taiwanez.','abateri는 위반행위2개로 읽힐 수 있어 penalizări로 교정. 비슷한 길이 도입을 취소 결과와 징계 사유로 나누어 주체·처분을 직접 설명.','공무원·관리직·한 번에 두 중대징계·면직 결과·원처분과재심결정 모두 취소 유지. 두 차례 별도 처분이나 두 개 위반행위 확정으로 바꾸지 않음.')
add('919','Dacă reclamantul dorește, poate încerca soluționarea amiabilă.','Dacă reclamantul dorește, angajatorul poate încerca soluționarea amiabilă.','종속절 신고인과 주절 주체가 혼동되지 않도록 실제 조율을 시도하는 사용자 명시.','신고인의 의사 조건 AND 사용자 may, 불성립 시 조사 속행 must 유지.')
old920='Cutia de încărcare era pe peretele din spatele locului de parcare. Cablurile urcau prin plafon spre tabloul electric comun și contorul locatarului. Acesta este traseul descris în [hotărârea taiwaneză](https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=KSHV%2C111%2C%E4%B8%8A%2C132%2C20220622%2C1), care a obligat instanța să examineze mai mult decât suprafața delimitată pentru mașină.'
new920='Cutia de încărcare era pe peretele din spatele locului de parcare, iar cablurile treceau prin plafon spre tabloul electric comun și contorul locatarului. Traseul folosea părți comune. [Hotărârea taiwaneză](https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=KSHV%2C111%2C%E4%B8%8A%2C132%2C20220622%2C1) a examinat dacă locatarul obținuse aprobările pentru aceste lucrări.'
add('920',old920,new920,'배선의 연속 경로를 한 문장으로 연결하고 공용부 사용·동의 판단을 짧게 구분. instanța가 강제됐다는 불필요한 피동 설명 제거.','벽·천장·공용전기함·거주자계량기, 공용부, 동의 필요 쟁점 모두 유지. 계량기 소유권 판단 추가 없음.')
add('920','Acela era regulamentul clădirii. Articolul 15 invocat nu era o regulă națională identică pentru orice parcare.','Regulamentul acelui ansamblu era un temei suplimentar.','MONOTONY: 방금 명시한 단지규약이라는 사실을 짧은 재진술과 가정적 반박으로 반복. 추가 근거라는 역할 한 문장으로 정리.','직전 문장의 단지규약15조·위원회 AND 전력사 검사, 다음 법6(1)(5)의 준수의무 보존.')
add('920',' Exista astfel o legătură între obligația încălcată, încercarea de coordonare și cererea judiciară.','','MONOTONY: 앞 두 문장이 이미 협의 시도·계속위반·법원청구를 연결하므로 추상적 재요약 삭제.','위반 AND 협의 후 계속 위반→법원에 청구할 수 있음은 앞 두 문장에 유지.')
add('921','Un jucător a convertit monedele rămase într-o cerere de 243.548 NT$, pe care instanța nu a admis-o.','Un jucător evaluase monedele rămase la 243.548 NT$. Cererea sa a fost respinsă.','monede를 cerere로 변환했다는 번역투를 평가액과 청구 불인용으로 직접 표현. 중간길이3연속 도입에 의미별 호흡을 줌.','243548은 청구의 평가액이며 실제 환급액 아님. 이미 쓴 코인이라는 사실 추가 없음.')
add('921',' Este o măsură practică de pregătire a probelor, nu o nouă condiție legală generală pentru orice rambursare.','','MONOTONY: 앞 문장의 poate가 이미 실무 조언임을 밝히므로 독자가 하지 않은 새 법정조건 주장을 반박하는 꼬리 삭제.','조기 기록 요청 가능·실무효용과 법9의 사업자 보존/제공 의무, 환급18조 조건 불변.')
rows=[]
for id,r in files.items():
 p=Path(r['file']);before=p.read_text();assert h(before)==r['sha256'];after=before;applied=[]
 for e in edits:
  if e['id']!=id:continue
  assert after.count(e['old'])==1,(id,e['old']);pos=after.index(e['old']);after=after[:pos]+e['new']+after[pos+len(e['old']):];applied.append(dict(e,offset=pos))
 assert after.split('\n---\n',1)[0]==before.split('\n---\n',1)[0]
 assert re.findall(r'\]\(([^)]+)\)',after)==re.findall(r'\]\(([^)]+)\)',before)
 oldnums=re.findall(r'\d+',before);newnums=re.findall(r'\d+',after)
 if id=='920':
  assert Counter(oldnums)-Counter(newnums)==Counter({'15':1}) and not Counter(newnums)-Counter(oldnums)
 else:assert newnums==oldnums
 reverse=after
 for e in reversed(applied):
  pos=e['offset'];assert reverse[pos:pos+len(e['new'])]==e['new'];reverse=reverse[:pos]+e['old']+reverse[pos+len(e['new']):]
 assert reverse==before
 rows.append({'file':str(p),'beforeSHA256':h(before),'afterSHA256':h(after),'beforeText':before,'afterText':after,'edits':applied,'exactForwardInverse':True,'FMFAQUnchanged':True,'URLSequenceUnchanged':True,'numericSequenceUnchanged':newnums==oldnums,'numericOccurrenceNote':'One redundant repeat of Article15 deleted; first full rule with committee AND electric-company approval remains' if id=='920' else None,'diff':''.join(difflib.unified_diff(before.splitlines(True),after.splitlines(True),fromfile=p.name+'.initial',tofile=p.name+'.r1'))})
for r in rows:Path(r['file']).write_text(r['afterText'])
out=C/'ro-self-edits-r1.json';assert not out.exists();out.write_text(json.dumps({'at':datetime.now(timezone.utc).isoformat(),'count':len(edits),'scope':'Own six RO manuscripts only; exact edits preserve initial draft and initial failures','rows':rows},ensure_ascii=False,indent=2)+'\n');print(json.dumps({'edits':len(edits),'changedFiles':len(rows),'measureOnlyBodyChanged':['915','916','919','920','921'],'918SourceFooterOnly':True}))
