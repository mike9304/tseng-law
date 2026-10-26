from pathlib import Path
import json, hashlib, difflib
from datetime import datetime, timezone
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch09')
edits=[
('915','nabavke električne energije i mrežne opreme na Tajvanu','nabavke za tajvanski elektroenergetski sektor i mrežu','발전·망 조달을 전력 상품 구매처럼 좁혀 읽지 않도록 대상 설명을 명확히 함','예정된 대만 조달·미국 공급자·2026/2027·자격 미확정 보존'),
('916','Povoljan zaključak pregovora ne pokazuje sam po sebi šta je preduzeto povodom nalaza.','Povoljan sažetak pri zaključenju posla sam ne pokazuje kako je odgovoreno na tehničke nalaze.','협상 결과라는 추상 문구를 정본의 거래 종결 요약자료와 기술적 발견에 대한 실제 대응으로 구체화','새 문서 작성 의무나 결과 보장 없음'),
('918','U [rezultatima kontrole ugovora od 25. avgusta 2025.](https://www.ey.gov.tw/Page/F7408A6FCA4B0A8A/40ffbcf6-e255-47b2-a208-767af361bd11), potrošački organ je kao nedopuštenu označio klauzulu koja iz roka za obaveštenje izuzima vreme bankarske potvrde kredita i isplate.','Potrošački organ je u [rezultatima kontrole ugovora objavljenim 25. avgusta 2025.](https://www.ey.gov.tw/Page/F7408A6FCA4B0A8A/40ffbcf6-e255-47b2-a208-767af361bd11) označio kao nedopuštenu klauzulu koja iz roka za obaveštenje izuzima vreme bankarske potvrde kredita i isplate.','MONOTONY: U 문단 시작3회. 공고의 행위 주체를 앞세워 통지기간 제외조항을 지적한 주체를 직접 전달','공고 날짜·URL·은행 확인/지급기간 제외 위법성·과거 판결과의 구분 보존'),
('919','Iz poništenja se ne može zaključiti da nije bilo nijednog prijavljenog postupka niti da je rukovodilac zaista vraćen na posao.','Iz poništenja se ne može zaključiti da nije bilo zlostavljanja niti da je rukovodilac zaista vraćen na posao.','postupka가 사건/절차로도 읽히므로 판결 취소가 괴롭힘 부재를 증명하지 않는다는 대상을 명시','실제 복직 미확인·상소 가능·모든 비위 부재로 일반화 금지 보존'),
('919','Pre nego što je nadležna komisija razmatrala slučaj, rukovodilac organa javno je najavio dve teške disciplinske zabeleške. Zatim je o tome raspravljao nadređeni organ, pa tek onda komisija organizacije u kojoj je zaposleni radio. Sud je ocenio da je time narušena uloga komisije da zaista proceni slučaj.','Rukovodilac organa javno je najavio dve teške disciplinske zabeleške pre rasprave nadležne komisije, a zatim je nadređeni organ razmatrao slučaj pre komisije organizacije u kojoj je zaposleni radio. Sud je u tom redosledu video narušavanje stvarne uloge komisije.','MONOTONY: 같은 중간 길이의 시간순서 문장들을 실제 선후관계로 연결하고 법원 평가를 별도 결과문으로 둠','사전 발표→상급기관 심의→소속기관 심의 및 법원 평가를 유지, 두 징계를 두 사건으로 바꾸지 않음'),
('919','[Član 22-2 tajvanskog Zakona o bezbednosti i zdravlju na radu](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0060001&flno=22-2) nalaže objektivnu, pravičnu i nepristrasnu istragu ili postupak usaglašavanja. Pri istrazi strane moraju dobiti odgovarajuću priliku za izjavu i odbranu, uz poštovanje pravila o izuzeću. Javno utvrđivanje krivice pre završetka tog postupka otežava ispunjenje tih zahteva.','[Član 22-2 tajvanskog Zakona o bezbednosti i zdravlju na radu](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0060001&flno=22-2) nalaže objektivnu, pravičnu i nepristrasnu istragu ili postupak usaglašavanja; pri istrazi strane moraju dobiti odgovarajuću priliku za izjavu i odbranu, uz poštovanje pravila o izuzeću. Javno utvrđivanje odgovornosti pre završetka istrage otežava poštovanje tih pravila.','MONOTONY: 한 조문이 정하는 기준과 그 조사 단계의 절차를 연결. 형사적 krivice 대신 책임 판단이라는 중립어로 정리','조율/조사 공정성, 조사에서의 진술·방어·회피 의무 보존. 진술 의무를 조율 전체에 무조건 확장하지 않음'),
('920','Ugovor sa izvođačem može unapred urediti početak radova pre saglasnosti i raspodelu troškova ako zahtev za saglasnost ne bude prihvaćen.','U ugovoru sa izvođačem može se jasno vezati početak radova za potrebnu saglasnost i odrediti ko snosi troškove ako zahtev ne bude prihvaćen.','동의 전 착공을 계약으로 허용할 수 있다는 오독을 막고 필요한 동의와 착공의 관계를 명시','필수 동의 유지, 거절 시 비용분담은 실무 계약 조언이며 분쟁 방지 보장 없음'),
]
out=B/'checks/sr-self-edits.json'
assert not out.exists()
sha=lambda t:hashlib.sha256(t.encode()).hexdigest()
before={p:p.read_text() for p in (B/'src/content/columns-sr').glob('*.md')}
records=[]
for i,(ident,old,new,reason,meaning) in enumerate(edits,1):
 p=next(p for p in before if p.name.startswith(ident+'-'));t=p.read_text();assert t.count(old)==1,(ident,old);newt=t.replace(old,new,1);p.write_text(newt)
 records.append({'id':f'S{i:02d}','article':ident,'path':str(p),'before':old,'after':new,'reason':reason,'meaning_preserved':meaning,'state_before_sha256':sha(t),'state_after_sha256':sha(newt)})
files=[]
for p,old in sorted(before.items()):
 now=p.read_text();rev=now
 for e in reversed(records):
  if e['path']==str(p):assert rev.count(e['after'])==1;rev=rev.replace(e['after'],e['before'],1)
 assert rev==old
 files.append({'path':str(p),'before_sha256':sha(old),'after_sha256':sha(now),'changed':old!=now,'inverse_exact':True,'diff':'\n'.join(difflib.unified_diff(old.splitlines(),now.splitlines(),fromfile='initial/'+p.name,tofile='self-reviewed/'+p.name,lineterm=''))})
out.write_text(json.dumps({'at':datetime.now(timezone.utc).isoformat(),'edits':records,'files':files,'no_tool_or_threshold_change':True},ensure_ascii=False,indent=2)+'\n')
print('actual prose changes',len(records),'changed files',sum(x['changed'] for x in files))
