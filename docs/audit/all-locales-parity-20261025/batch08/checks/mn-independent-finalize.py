from pathlib import Path
from hashlib import sha256
from datetime import datetime,timezone
import json
B=Path('/Users/son7/tseng-all-language-columns-20261025/batch08');C=B/'checks';Q=B/'reviews';S=B.parent/'batch06/research'
def h(x):return sha256(x if isinstance(x,bytes) else x.encode()).hexdigest()
def readj(p):return json.loads(p.read_text())
def savej(p,x):
 assert not p.exists(),p
 p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def row(p):return {'path':str(p),'sha256':h(p.read_bytes())}
p=readj(C/'mn-independent-proof.json');a=readj(C/'mn-author-manifest.json');m=readj(C/'mn-independent-metadata.json');texts={Path(r['file']).name[:3]:Path(r['file']).read_text() for r in p['rows']};paths={Path(r['file']).name[:3]:r['file'] for r in p['rows']}
for r in p['rows']:assert h(Path(r['file']).read_bytes())==r['sha256']
assert h((Q/'mn-author.md').read_bytes())=='7d79b0ed1bc777958dbf7f3256bf807fa3999318fb96c52c4e3a86b40aa9004b'
assert h((C/'mn-author-manifest.json').read_bytes())=='99cae94f51a3a1d7f4690dac71dab39af4a02e22099ee5b944beb5b633534d14'
old915='Мөнгө хүсээд, хугацаа сунгуулж, дахин мөнгө нэхэмжилсэн нь'
old916='Хувьцаа эзэмшигч компанийн тусдаа хуулийн этгээдийн байдлыг урвуулан ашигласнаас компани тодорхой өр төлбөрөө барагдуулахад илт хүндрэлтэй болсон бөгөөд нөхцөл байдал ноцтой, хариуцлага хүлээлгэх шаардлагатай бол тэр хувьцаа эзэмшигч уг өрийг төлөх үүрэг хүлээнэ.'
old918h='Банкны хугацааг барилгын компанид шууд тооцохгүй байх нь'
url='https://www.ey.gov.tw/Page/F7408A6FCA4B0A8A/40ffbcf6-e255-47b2-a208-767af361bd11'
lead=f'[2025 оны 8 дугаар сарын 25-ны гэрээний шалгалтын мэдээлэл]({url})'
old918=f'{lead} банкны нягтлан шалгалт, зээл олголтод зарцуулсан хугацааг зөрчлийн хугацаанд тооцохгүй байх асуудлыг дурдсан тул талууд банкны саатал хэзээ эхэлсэн, барилгын компанийн бэлэн байдалтай хэрхэн давхцсан тухай баримтаа тулгаж болно.'
new918=f'{lead} банкны нягтлан шалгалт, зээл олголтод зарцуулсан хугацааг хүлээлгэн өгөх тухай мэдэгдэх зургаан сарын хугацаанаас хассан гэрээний заалтуудыг зөрчил гэж тэмдэглэсэн. Талууд банкны саатал хэзээ эхэлсэн, барилгын компанийн бэлэн байдалтай хэрхэн давхцсан тухай баримтаа тулгаж болно.'
optional='Буцаасан хэсэг дахин хэлэлцэгдэхээр үлджээ.'
findings=[
 {'id':'M01','severity':'MUST','article':'915','kind':'case chronology / heading','edits':[{'old':old915,'new':'Хугацаа сунгуулах хүсэлтийн дараа мөнгө нэхэмжилсэн нь'}],'reason':'сунгуулж는 기간 연장을 실제 얻었다는 읽기를 만든다. 기록은 연장 요청·위원회 권고·기관 부동의이며 실제 연장 승인 사실을 말하지 않는다. 직후 본문이 정확해도 독립적으로 노출되는 소제목은 고쳐야 한다.','meaningPreserved':'기간 연장 요청 후 금전 청구로 되돌아간 흐름. 최초 금전 청구와 기관 부동의는 바로 아래 기존 본문에 그대로 남는다. 승인·지급·새 법적 의무를 추가하지 않는다.','source':{'path':str(S/'retained/en915-court-explanation.txt'),'originalLines':'L22, L24, L42–45','url':'https://jirs.judicial.gov.tw/GNNWS/NNWSS002.asp?id=274693'},'testScope':'소제목만 바꾸면 측정 본문 배열 불변을 확인하고 기존 CLI를 재사용할 수 있다.'},
 {'id':'M02','severity':'MUST','article':'916','kind':'current law cumulative conditions / causation','edits':[{'old':old916,'new':'Хувьцаа эзэмшигч компанийн тусдаа хуулийн этгээдийн байдлыг урвуулан ашигласны улмаас компанид тодорхой өр үүсэж, түүнийг барагдуулах нь илт хүндрэлтэй болсон бөгөөд нөхцөл байдал ноцтой, хариуцлага хүлээлгэх шаардлагатай бол тэр хувьцаа эзэмшигч уг өрийг төлөх үүрэг хүлээнэ.'}],'reason':'현재 문장은 남용 때문에 특정 채무의 상환이 곤란해졌다는 인과로만 읽힌다. 회사법154(2)는 법인격 남용으로 회사가 특정 채무를 부담하게 됨 AND 청산의 현저한 곤란 AND 중대성·필요성을 요구한다. 특정 채무 발생의 인과가 빠지면 책임 범위가 달라진다.','meaningPreserved':'주주·법인격 남용·특정 채무 발생·현저한 상환 곤란·중대성·필요성·그 채무에 대한 변제 책임을 모두 연결한다. 기존 뒤 문장 Нөхцөлүүдийг хамтад нь үнэлнэ.와 과거 사건/현행법 구분을 유지한다.','source':{'path':str(S/'recheck/official-03.json'),'originalLines':'MOJ154 L41–45','url':'https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=154'},'testScope':'916 변경 본문만 실제 shared --lang mn 재검사, 경계와 인접 조건 검수.'},
 {'id':'M03','severity':'MUST','article':'918','kind':'official inspection finding / period object / heading','edits':[{'old':old918h,'new':'Банкны ажиллагааны хугацааг хассан заалт'},{'old':old918,'new':new918}],'reason':'소제목은 은행 시간을 건설사에 산입하지 않는 것이 타당하다는 방향으로 읽히고, 본문은 공식 자료가 제외 문제를 언급했다는 중립 설명에 그친다. 공식 점검은 은행 대면 확인·대출 실행 시간을 사용허가 수령 후 6개월의 인도 통지 기간에서 제외한 계약 조항을 부당한 위반으로 적시했다. зөрчлийн хугацаа도 해당 통지 기간을 정확히 가리키지 않는다.','meaningPreserved':'2025년 점검의 실제 부정적 평가와 6개월 통지 기간을 복원한다. 2019년 사건의 계약4개월, 현행표준6개월, 은행 지연·준비상태의 사실 대조, 구매자 의무는 그대로다. 모든 은행 지연의 책임이나 2025년 자료의 소급적용을 단정하지 않는다.','source':{'path':str(S/'retained/zh-hant-presale-audit-primary-recovered.md'),'originalLines':'원 회신 L135 및 L159–160','url':url},'testScope':'918 변경 본문만 실제 shared --lang mn 재검사, 4개월/6개월 기산·기존 다음 문장·은행 시간의 문맥 확인.'},
 {'id':'S01','severity':'OPTIONAL','article':'916','kind':'MONOTONY / repeated remand explanation','edits':[{'old':' '+optional,'new':''}],'reason':'같은 문단 첫 문장이 246명 부분을 다시 심리하도록 환송했다고 이미 설명하고, 다음 문단은 환송 부분의 미결 쟁점을 설명한다. 가운데 한 문장이 새 정보를 더하지 않고 다시 심리된다는 결론을 반복한다.','meaningPreserved':'첫 문장과 다음 문단에 환송·미확정 범위가 남고, 262명 상고 기각과 구별도 유지된다. 문체 선택안이며 채택하지 않아도 별도 법률 반려 사유가 아니다.','source':{'path':str(S/'retained/en916-court-explanation-lines24-40.txt'),'originalLines':'L25, L32–40','url':'https://jirs.judicial.gov.tw/GNNWS/NNWSS002.asp?id=359523'},'testScope':'M02와 함께 916에 반영하면 같은 영향편 검사에서 확인. 기계 수치를 위해 의미 없는 새 문장을 넣지 않는다.'}
]
for f in findings:
 for e in f['edits']:
  t=texts[f['article']];assert t.count(e['old'])==1,(f['id'],e['old']);e['line']=t[:t.index(e['old'])].count('\n')+1
 f['file']=paths[f['article']];f['source']['sha256']=h(Path(f['source']['path']).read_bytes())
savej(C/'mn-independent-findings.json',{'at':datetime.now(timezone.utc).isoformat(),'status':'REQUEST_CHANGES','mandatory':3,'optional':1,'manuscriptsModified':False,'findings':findings})
savej(C/'mn-independent-r1-originals.json',{'at':datetime.now(timezone.utc).isoformat(),'scope':'Reviewer read-only current R1 six-file snapshots for later exact delta checks','rows':[{'file':r['file'],'sha256':r['sha256'],'text':texts[Path(r['file']).name[:3]]} for r in p['rows']]})
report='''# MN6 독립 의미·문체 검수 R1 — 2026-10-26

판정: REQUEST_CHANGES. 필수 의미 수정 3건(M01–M03), 선택 문체 1건(S01)이다. `/root/column_source_quality`가 동결된 915·916·918·919·920·921과 FAQ 17개, 제목·요약·캡션·출처를 검토했다. 원고와 저자 기록은 수정하지 않았다. AI 독립 대조이며 인간 원어민 승인, 변호사 감수, 공개 화면·배포 승인이 아니다.

## 읽은 자료와 동결 범위

저자 보고서 SHA `7d79b0ed1bc777958dbf7f3256bf807fa3999318fb96c52c4e3a86b40aa9004b`, 저자 manifest SHA `99cae94f51a3a1d7f4690dac71dab39af4a02e22099ee5b944beb5b633534d14`를 직접 대조했다. 시작 당시 저자는 본문을 고정했고 보고서 연결 작업 중이었다. 그 사실을 `mn-independent-start.json`에 예비 읽기로 적었으며, 정식 author 동결을 받은 뒤 현재6SHA를 다시 확인했다. 문안은 시작과 종료가 같다.

B8/B7 BRIEF와 프로젝트 EDITORIAL-VOICE·COLUMN-VOICE-RULE·SENTENCE-VARIETY-RULE의 앞선 전문 읽기를 동일 SHA에서 재사용했다. LESSONS는 17:05판 전문을 이번 준비에서 읽었고 SHA `86710ef330b108a916a7bb92a75f1ffa62dea53412e8a75f38472d9fa9b33130`를 고정했다. 홈 공통 문체 파일은 이 환경에 없어 읽었다고 하지 않는다. 최근 몽골어 글은 번호가 아닌 published로 고른 2026-10-26의 704–706 세 편 전문을 읽었다.

정본 EN915/916 및 ZH918/919/920/921은 연구 작성과 앞선 검수에서 직접 읽은 여섯 전문을 동일 SHA로 재사용하고 이번 문안·FAQ의 해당 조건과 대조했다. current snapshot과 R 정본6의 SHA도 다시 확인했다. B6 facts/register/contract/source-freeze의 동결 범위, 25일 확보 판결과 26일 재확인 법령·정책을 구별했다. 이번에 보관된 EN915 법원 설명 전문, EN916 L24–40, 918의 2025년 공식 계약점검 회신, MOJ154·85-1 해당 부분, USTR 정책문 및 게임서비스 표준 조항의 관련 부분을 다시 읽었다. 새로 모든 링크에 접근하거나 416쪽 판결 모음 전체를 다시 읽었다고 주장하지 않는다. 이미지 alt·허구 고지는 문안과 지정 이미지 경로를 대조했으며 이번 검수에서 새 화면 렌더·RTL·공개 HTML을 확인한 것은 아니다.

## 필수 수정

'''
for f in findings[:3]:
 report+=f"### {f['id']} · {f['article']} · {f['kind']}\n\n"
 for e in f['edits']:
  report+=f"문제 문구(현재 {e['line']}행):\n\n> {e['old']}\n\n수정안:\n\n> {e['new']}\n\n"
 report+=f"이유: {f['reason']}\n\n의미 보존: {f['meaningPreserved']}\n\n근거: [{Path(f['source']['path']).name}]({f['source']['path']}), {f['source']['originalLines']} 및 [공식 원문]({f['source']['url']}). {f['testScope']}\n\n"
f=findings[3]
report+=f"""## 선택 문체 S01 및 MONOTONY

MONOTONY: 환송 결과 재설명 — 916의 `{optional}` — 같은 문단의 첫 환송 문장과 다음 문단의 미결 쟁점을 이어 읽으면 이 문장은 새 정보를 더하지 않는다. 해당 문장과 앞 공백 한 칸을 삭제하는 것이 최소 제안이다. {f['meaningPreserved']} 삭제 제안은 정확 문자열로 `mn-independent-findings.json`에 있다. 916 M02와 같은 영향편에서 실제 문장 배열·리듬을 확인하면 된다. 문장 수나 CV를 맞추기 위한 의미 없는 추가는 제안하지 않는다.

기계 대비0을 수동 대비0으로 해석하지 않았다. 기관이 거부할 수 없는 누적 요건, 246/262의 다른 결과, 현재법/과거판결 구분, 미사용 유상 포인트의 범위 등 법률상 필요한 부정·구별은 유지해야 한다. 위 반복 한 곳 외에 독자가 하지 않은 주장을 반박하는 틀 때문에 별도 필수 문체 반려를 추가하지 않았다.

## 6편 조건과 FAQ의 대조 결과

- 915: 44,417,150대만달러는 취소된 중재판정 금액이며 실제 지급으로 바뀌지 않았다. 기관은 취소소송 원고, 도급자는 상고인이라는 결과 관계와 2017-07-12 상고 기각·확정, Art40(1)(2)를 보존했다. 85-1은 공사 OR 기술서비스, 위원회 권고 OR 안, 기관 부동의에 따른 조정 실패, 공급자의 중재 요청을 누적으로 연결한다. 별도 중재 합의와 모든 청구 변경이 새 분쟁은 아니라는 범위도 남았다. ITA 전망은 미국 공급자 맥락·장래 계획이며 보장으로 확대하지 않았다. M01은 실제 승인으로 읽히는 소제목에 한정한다.
- 916: 실제 지배·오염 인지·경고/제거 조치 부재·자본감소와 국외 이전의 논거, 246명 부분 환송과 262명 관련 상고 기각, 전 사건 확정이 아니라는 범위를 확인했다. 현행154를 과거 판결의 단일 근거로 소급하지 않았다. USTR는 미국 주체·미국 민간 파트너·대만 중요 부문·법 준수·금융 지원 검토의 범위에 머문다. M02는 현재법의 특정 채무 발생 인과를 복원하는 요청이다.
- 918: 타이중 고등법원 사건과 항소·추가청구 기각, 상고 불가 표시가 보존됐다. 2019-02-23 은행 서신과 실제 준비·인도는 구별했다. 7월 승강기 설치 미완료, 8월 인테리어·청소 출입, 11월5일 대출·28일 보증서/인도 순서가 남았다. 사건 계약4개월과 현행표준6개월 모두 사용허가 수령 뒤 인도 통지 기산이며 구매자의 협조·지급 의무도 유지했다. 2026-09-18 대출정책을 과거 판결에 귀속하지 않는다. M03은 2025년 점검의 부당 조항 판단과 제외 대상 기간을 바로잡는다.
- 919: 공무원에게 한 번에 두 중대징계 기록을 부과해 면직한 사건, 처분 및 행정심사 결정 취소, 항소 가능성, 괴롭힘 사실 전부 부정으로 확대하지 않는 범위를 확인했다. 선결론·상급회의와 하급회의의 역순·진술 기회·불일치 보고서·사후심사만으로 치유되지 않는 이유가 남았다. 민간법 2026-07-01 시행과 공무원 사건을 분리했고 22-2의 보호·조사·의사에 따른 조율 가능·불성립 시 계속 조사 조건을 확인했다.
- 920: 가오슝 고등법원 판결의 항소 기각과 확정 여부 미확인이 구별된다. 계량기 연결을 공용부 소유권으로 바꾸지 않았다. Art11의 구분소유자 회의, 공동규약의 위원회 허가 AND 전력사 안전심사, 6(1)(5)/6(3)의 조율 후 계속 위반과 법원 청구 가능, 6(1)(4) 분류에 대한 법원 판단이 남았다. 사용 중단·잠금·열쇠 등은 주민 주장 및 설령 사실이어도라는 조건이지 확정 사실이 아니다. 2026-05-29 보조금은 공용 케이블 트레이이고 9월30일 기한은 이미 경과했다. 정확한 원문 요약에 별도 선택 세부가 없다는 이유로 필수 추가를 요구하지 않았다.
- 921: 243,548대만달러 청구의 불인용, 유상 포인트는 미사용 잔액이 없다는 당사자간 다툼 없는 사실, 남은 코인의 게임 내 경쟁용 칩 기능을 구별했다. 모든 칩이 이미 소비됐다는 뜻으로 바꾸지 않았다. 특정 게임의 현금화 제한·소비자 자신의 해지·모든 사업자 제재 적법성으로 확대하지 않는 범위도 유지했다. 18조의 미사용 유상 포인트 OR 미사용 게임비, 필요 비용, 해지 후30일 OR 합의한 방식; 최초 시작 뒤7일 철회와 그 뒤의 일반 해지권; 기록 최소30일·신청 수령 후7일; 사업자 자료만 유일 근거로 삼는 조항 금지와 2022개정/2023시행·2021판결 구분을 확인했다. 2025년 민원 순위를 시장점유율로 바꾸지 않았다.

FAQ17은 질문과 답변의 범위를 함께 읽었다. 현재 요약이 정확한데 선택 세부가 없다는 이유만으로 추가 필수 반려를 만들지 않았다. 법령·판결 명제, 시장자료, 기록 준비에 관한 조언도 구별했다.

## 실제 문장·구조 증거 및 §5

`mn-independent-proof.py/json`에서 저자의 22개 본문 치환, 후속6개 본문 치환, 19개 FAQ 필드를 각 offset으로 직접 정·역재생했다. 초안부터 현재6파일 전체 바이트가 일치한다. 5편의 마지막 FAQ 교정은 본문 바이트를 바꾸지 않았으므로 실제 CLI가 측정한 전체 SHA와 현재 전체 SHA를 본문 SHA로 연결했다. 실제 측정한 적 없는 최종 전체 SHA에 과거 CLI 실행을 붙이지 않았다. 920은 전체 SHA도 같다.

915/920은 `mn-variety-edited-r1.json`, 나머지4편은 `mn-variety-r2.json`의 실제 exit0/FAIL0를 사용했다. 리뷰어는 불필요한 전수 CLI를 다시 실행하지 않고 현행 공유 함수로 현재 본문을 직접 추출·계산해 저장된 실제 배열·지표와 정확 일치함을 확인했다. metrics `5abf02f5…`, multilingual `4af34193…`, expansion `ea03abaa…`, MN profile `f55713d7…`의 전체 SHA는 proof/manifest에 있다. 임계값·HARD·언어 단위 변경은 없다.

| 글 | 실제 구간 | CV | 짧은 구간 비율 | 실제 CLI |
|---|---:|---:|---:|---|
| 915 | 38 | .487 | .237 | exit0 / FAIL0 |
| 916 | 39 | .493 | .231 | exit0 / FAIL0 |
| 918 | 40 | .547 | .300 | exit0 / FAIL0 |
| 919 | 38 | .498 | .289 | exit0 / FAIL0 |
| 920 | 41 | .459 | .244 | exit0 / FAIL0 |
| 921 | 46 | .455 | .196 | exit0 / FAIL0 |

현재242개 추출 구간 전부를 직접 읽었다. 금액의 천단위 쉼표, 중문 사건번호, 몽골어 날짜·조문 표기, 링크 주변과 긴 조건을 실제 경계에서 확인했다. 알려진 별도 미해결 분절 오류를 발견하지 않았으나 이는 몽골어 문장 경계의 gold standard 인증이 아니다. 표·FAQ·소제목·출처 꼬리는 통계 밖이므로 별도 읽었다. 초안6 FAIL·첫 편집 래퍼 오류·수정 전 중복 CLI·역복원 래퍼 실패 기록은 보존했다.

§5 수동 점검: 금액/질문/서신/처분/배선/잔액의 도입이 구체적이고 최근 ARC 절차 안내와 구별된다. 상투적 가정과 가상1인칭은 없고, 각 글에 짧은 문장 두 개 이상·한 문단의 긴 문장 연속 부재를 확인했다. 문단 시작 반복·인용/유보의 기계적 연쇄·일반 판촉 결말은 보이지 않았다. 실제 필요한 법적 부정은 위와 같이 보존했다. 목록 명령형 제목·굵은 강조 우회는 없다. 한국어/일본어 경어 항목은 몽골어에 직접 적용하지 않는다. 단조로움은 S01의 실제 반복문으로 남겼으며 기계 PASS로 문체를 자동 승인하지 않았다.

현재6파일 메타데이터를 별도 파싱한 `mn-independent-metadata.json`은 오류0이다. published/lastmod26일·몽골어 표시 날짜·audience mn·내부 AI author·주제·허구 캡션·지정 이미지·FAQ17을 확인했다. 정본의 공식 URL은 글별합계23/고유22개이며 모두 보존됐다. 영어 연결은 영어 라벨이 있고 몽골어 상담·미국 정책상 새 자격을 약속하지 않는다. 현재 전체SHA에 맞는 저자의 실제 구조 검사6행도 오류0이며 REQUIRED33·publicationReady false를 유지한다. 공개 카드·JSON-LD·피드·실제 HTTP 상태 확인은 이 의미 검수 범위가 아니다.

## 인계

원고6·저자 보고서·저자 manifest·검수 입력의 종료 SHA 불변을 `mn-independent-manifest.json`에 기록한다. 정확한 수정 문자열과 근거는 `mn-independent-findings.json`, 현재 전체 원본은 `mn-independent-r1-originals.json`에 보존했다. 저자가 M01–M03 및 선택 S01을 판단·수정한 뒤 변경 범위의 의미·정/역복원·새 SHA를 표적으로 재확인해야 한다. 이 R1 판정을 새 원고에 자동 승계하지 않는다.
"""
reportPath=Q/'mn-independent.md';assert not reportPath.exists();reportPath.write_text(report)
extra=[S/'six-source-facts.md',S/'source-register.md',S/'authoring-contract-draft.md',S/'source-freeze.json',S/'retained/en915-court-explanation.txt',S/'retained/en916-court-explanation-lines24-40.txt',S/'retained/zh-hant-presale-audit-primary-recovered.md',S/'retained/zh-hant-ev-primary-recovered.md',S/'recheck/official-03.json',S/'recheck/official-04.json',S/'recheck/official-06.json']
expected={'six-source-facts.md':'7f1d32e0aa17706c006f0b4fca8a88653dc7cad4637b1369e00ab6607884462a','source-register.md':'4d3de5ee5b5af0d2724c705886a6b6cb0ea65e32b096a1665381c389ac95f09d','authoring-contract-draft.md':'b0c6b86677719c8966bcf85af979574fca7c97f6a778d80627eaabc74c246c4e','source-freeze.json':'e21b247b6897c580b464611cbfae4acd52728c71c65ccd055dd68c563dbf9127'}
for q in extra:
 if q.name in expected:assert h(q.read_bytes())==expected[q.name]
inputs={r['path']:r for r in p['inputs']}
for r in map(row,extra):inputs[r['path']]=r
for r in inputs.values():assert h(Path(r['path']).read_bytes())==r['sha256'],r['path']
for r in p['rows']:assert h(Path(r['file']).read_bytes())==r['sha256']
evidence=[row(q) for q in sorted(C.glob('mn-independent-*')) if q.is_file() and q.name!='mn-independent-manifest.json']
manifest={'at':datetime.now(timezone.utc).isoformat(),'owner':'/root/column_source_quality','status':'REQUEST_CHANGES','mandatory':3,'optional':1,'scope':'Full six manuscripts / FAQ17 / metadata / 242 actual extracted body segments; no source-author manuscript changes','report':row(reportPath),'files':[{'path':r['file'],'sha256':r['sha256']} for r in p['rows']],'author':row(Q/'mn-author.md'),'authorManifest':row(C/'mn-author-manifest.json'),'evidence':evidence,'inputs':list(inputs.values()),'initialGuardUnchanged':True,'authorRecordsUnchanged':True,'allInputHashesMatchAtEnd':True,'FAQ':17,'actualBodySegments':242,'automatedErrors':0,'requiredReviewItemsPreserved':33,'currentTools':a['tools'],'actualCLINewRunByReviewer':False,'actualCLIReuse':'Original exact measured file SHA plus current identical body; current direct extraction/metrics equal stored CLI arrays','newLiveWebRetrieval':False,'publicRenderedOutputReviewed':False,'humanNativeOrLegalApproval':False}
savej(C/'mn-independent-manifest.json',manifest)
print(json.dumps({'report':row(reportPath),'findings':row(C/'mn-independent-findings.json'),'manifest':row(C/'mn-independent-manifest.json'),'status':'REQUEST_CHANGES','MUST':3,'OPTIONAL':1,'files':6,'inputCount':len(inputs)},ensure_ascii=False,indent=2))
