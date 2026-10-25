from pathlib import Path
import json,hashlib,datetime,zoneinfo
b=Path('/Users/son7/tseng-all-language-columns-20261025/batch04')
inputs=json.loads((b/'checks/my-inputs.json').read_text())
audit=json.loads((b/'checks/my-content-audit.json').read_text())
edits=json.loads((b/'checks/my-self-edits.json').read_text())['edits']
now=datetime.datetime.now(zoneinfo.ZoneInfo('Asia/Seoul')).isoformat(timespec='seconds')
rows=[]
rows.append(f'''# MY 704–706 저자 검수 기록

기록시각: {now}. 역할: AI 직접 집필 및 저자 자체검토. 사람 원어민·변호사 감수나 게시 승인을 뜻하지 않는다.

현재 상태: 세 원고 작성 및 첫 의미·문체 수정 완료. 구조 검사 3편 errors 0. 공유 `--lang my`는 실제 exit 2 미지원으로 남아 있으므로 문장 다양성 PASS 또는 배포 준비 완료를 주장하지 않는다. 지원 설치 뒤 정확한 MY 프로필로 재측정하고 추출문장을 읽어 후속 기록한다.

## 소유권과 입력

수정은 batch04/src/content/columns-my/704–706 및 reviews/my-author.md, checks/my-*에 한정했다. R 원고·공유 검사기·다른 작업자의 파일은 수정하지 않았다. 커밋·push·배포·외부 전송을 하지 않았다.

batch04/BRIEF와 upstream batch03·batch02·최초 BRIEF, 프로젝트 AGENTS, F01–F24, R의 EDITORIAL-VOICE, COLUMN-VOICE-RULE, SENTENCE-VARIETY-RULE, LESSONS를 적용했다. EN/KO/ZH 정본 9편은 같은 연속 작업의 앞선 집필·검수에서 전문을 읽었고, 이번 MY 작업에서 현재 SHA를 다시 고정했다. EN706·facts는 이번 작업에서도 전문을 재열람했다. source-refresh와 최종 core 기록은 같은 세션의 기존 읽기 결과를 대조했다. 원래 home 공통 문체 파일은 이 작업환경에서 부재하므로 BRIEF가 지정한 저장소 문체 정본을 사용했다. 존재하지 않는 파일을 읽었다고 표시하지 않는다.

최근 MY810·811·812는 전문을 읽었다. 810의 20시간 숫자 도입, 811의 인용과 가상 장면, 812의 국적별 혼인 절차를 그대로 반복하지 않았다. 이번 704는 첫 신청의 기산점, 705는 진입 경로의 실제 차이, 706은 유효 카드와 사유 소멸의 질문으로 시작한다. 기존 MY의 မြန်မာ 국적 범위를 일반 MY 독자에게 옮기지 않았다. 관할은 대만이고 상담언어를 새로 약속하지 않았다.

## 원고 SHA

| 원고 | 현재 SHA-256 |
|---|---|
''')
for f in inputs['files']:rows.append(f"| {Path(f['file']).name} | `{f['sha256']}` |\n")
rows.append('\n정본 및 최근글 입력 SHA는 [my-inputs.json](../checks/my-inputs.json)에 모두 있다.\n\n| 입력 | SHA-256 |\n|---|---|\n')
for f in inputs['sources']+inputs['recent']:
 rows.append(f"| {Path(f['file']).parent.name}/{Path(f['file']).name} | `{f['sha256']}` |\n")
rows.append(f"| arc-source-facts.md | `{inputs['facts']['sha256']}` |\n")
rows.append('''
## 법률·범위·FAQ 대조

| 항목 | 실제 확인한 보존 내용 |
|---|---|
| F01–F03 / 704 | 입국 다음 날 30일과 국내 거류비자 발급일 30일을 구별한다. 통합증명 예외, 전문업무 허가 또는 면제, 승인 뒤 ARC, 무비자 방문자의 보편 전환권 아님을 보존했다. |
| F04 / 705 | 일반 인재 AND 대만 전문업무와 특정전문인재를 별도 두 항목으로 썼다. 두 범주 모두 NIA 거류 OR 영주거류 승인. 배우자·미성년·신체/정신장애 때문에 자립 불가능한 성년자녀, 가족 본인의 입국 조건을 보존한다. 전문업무 요건을 특정전문인재에게 일률 확장하지 않는다. |
| F05·F08 | 대만 거주 AND 호적등록 국민의 배우자, 허용체류 60일 이상과 제한 부재. 최초 배우자 ARC는 고정 1년이 아니라 최장 1년이다. |
| F06–F07 | 2년 이내 사진, 1개월 이내 재직·재학 자료, 등록 전 입학허가/등록 후 현학기 등록증 OR 학생증 구별. 가족초청자 여권을 보편 필수로 만들지 않았다. 해외문서 인증 의무와 중국어 번역 요구 가능을 구별했다. |
| F09–F12 | NT$1,000/년, 1년 미만 1년분, 해당경로 NT$2,200, 僑生에 한정한 감면. 일반 최장3년·고용된 특정인재 최장5년·Gold Card1–3년. 5년의 기산은 NIA 거류승인 다음 날이며 가족도 본인 승인을 쓴다. 심사10/5근무일, 보완 뒤 재계산, 학생 승인일부터5근무일 납부·6개월 이하 eARC·납부3근무일 뒤 chip 수령을 구별했다. |
| F13–F14 | full-time 외국학생의 해외공관 경로 명시. 어학4개월 이수+최소3개월 계속등록, 월–금 주15시간, 휴가 포함 결석1/4 이하. 학생 주20시간의 여름·겨울방학 한정 예외, 다른 취업요건 존속. 시민 배우자 면제와 외국인재 가족의 별도 취업허가를 구별했다. |
| F15–F17 | 일반 만료 전3개월, 창업사업 지속4개월/사업종료 별도3개월, Gold Card 갱신4개월. 주소·근무지 변경 다음 날30일과 사유변경 사건일부터30/15일을 구별했다. BOCA15일은 신청기한이지 발급완료기한이 아니다. 이직 종료증명은 이직에만 한정하며 겸업에 일률 요구하지 않는다. |
| F18–F19 | 사유 소멸 시 NIA 철회·말소 의무와 재량 계속거류 예외. DV 이혼의 미재혼 주체는 외국인 신청인, 전 대만 배우자의 대만거주·호적 조건 별도. 미성년 자녀의 호적 및 양육/권리의무/교섭, 노동소송 계속·산재 치료중. 초과30일 미만 AND 원사유 계속, 처벌 후 재신청 가능·APRC 계산1년 공제·자동연장 아님. |
| F20–F21 | 적격 인재·기허가 가족은 만료 전 신청, 이전 만료 다음 날6개월+1회, 총1년. 적격 졸업생1년+1회 총2년·단순 어학수료 아님. 대만 전문학사 이상 취득 AND 당해 졸업생 NIA 연장허가 기간의 취업허가 면제. |
| F22–F23 | 출국 전 재입국허가, ARC 유효기간 및 말소 연동, 유효여권+APRC 예외. 접수증의 자동 여행증명 효과 없음. 해당 전문인재·가족 온라인절차에서 신청중 출국하면 심사 종료, 재입국 뒤 대상 자격을 갖추면 새 신청 가능. 보편 출국금지나 의무 재신청으로 바꾸지 않았다. |
| F24 | 일반0902 통지 다음 날15달력일. 자료를 해외·중국대륙·HK·MO에서 발급받아야 하는 경우3개월로 대체, 15일에 추가하지 않음. 미보완·불완전 보완 시 기각, 보완 후 심사 재계산. |
| 9 FAQ | 704 기산·요금·취업, 705 무비자·어학·가족, 706 갱신·변경등록·접수증을 본문과 대조했다. 705 첫 FAQ의 취업허가 수식이 가족에 걸리지 않도록 실제 수정했다. |

본 작업에서 직접 다시 연 공식 페이지: [인재법 현행 영문](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295) 제8·16·17조, [NIA 중문0902](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/29996/)의 보완·문서, [BOCA full-time 학생](https://www.boca.gov.tw/cp-166-283-c4da3-2.html), [거류규칙 중문](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129) 제7·9·11·12조, [NIA 해당 온라인절차](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/) 주의9·10. 나머지 세부 출처는 F01–F24 및 10월24일 조사표와 정본을 대조했으며 오늘 모든 URL을 전수 재확인했다고 주장하지 않는다. 법령 DB 정비 기준일과 글의 확인일을 구별하며 10월17–25일 관보 전수조사 주장은 없다.

## 실제 문장 → 문제 → 수정 → 의미

아래는 파일에 실제 적용한 수정이다. 정확한 위치·횟수·중간 SHA는 [my-self-edits.json](../checks/my-self-edits.json), 초안 전문은 [my-initial-manuscripts.json](../checks/my-initial-manuscripts.json), 전후 역검증은 [my-self-edit-integrity.json](../checks/my-self-edit-integrity.json)에 남겼다. 최초 단순 전체 문자열 역변환은 이미 올바른 철자까지 잡는 assertion에 걸렸고, 실제 각 before 상태의 위치를 고정한 재검증에서 모든 forward/reverse SHA가 일치했다.
''')
for e in edits:
 rows.append(f"\n### {e['id']} / {Path(e['file']).name[:3]}\n\n원문: {e['before']}\n\n문제·방향: {e['reason']}\n\n수정: {e['after'] or '(해당 중복 문장 삭제; 바로 앞의 동일 기산·기한 문장은 보존)'}\n\n의미 보존: 확인. 실제 치환 {e['occurrences']}곳.\n")
rows.append('''
## §5 자체점검

| 번호 | 점검 및 한계 |
|---|---|
| 1 | 정확한 공유 `--lang my`로 실행했으나 exit2 미지원. [원본 stdout/stderr](../checks/my-variety-unsupported.json) 보존. 지원 설치 후 FAIL0·추출문장 확인 전 미완료. 다른 언어 점수를 대체하지 않았다. |
| 2 | 704 기산점 사실, 705 경로 비교, 706 카드 유효기간 관련 질문으로 도입을 구별했다. 가상 인물·Suppose 공식 없음. 최근3편과 동일 도입을 복제하지 않았다. |
| 3 | 짧은 실제 문장 예: 704 `လိပ်စာမှာ တကယ်နေသောနေရာ ဖြစ်ရမည်။`, `ရုံးဖွင့်ရက်သာ ရေတွက်ခြင်းမဟုတ်ပါ။`; 705 `ရက် 60 သည် ခွင့်ပြုနေချိန် ဖြစ်သည်။`, `မိဘများနှင့် အခြားအရွယ်ရောက်သားသမီးများ မပါပါ။`; 706 `စတွက်သည့်နေ့ မတူပါ။`, `ကတ်အသစ်ပြန်ထုတ်ခြင်းက နေထိုင်ခွင့်သက်တမ်းကို မတိုးပေးပါ။`. 길어진 법적 조건 뒤에 실제 결과·시간 설명을 배치했다. ICU 길이 수치는 아직 미확정. |
| 4 | 문단 첫 구절을 읽어 기산·서류·주체·질문·결과의 출발을 구별했다. Burmese 공백 구절을 단어라고 세지 않았다. 정확한 프로필의 시작단위 추출 및 반복 수치 확인은 대기. |
| 5 | 주장→조문→다만을 연속3문단 쓰지 않았다. 실제 주소·서류가 기간을 뒷받침하는 이유·접수증/이메일 내용 등 무인용 실무 문단이 있다. 법적 근거 링크를 점수용으로 삭제하지 않았다. |
| 6 | ‘허가와 카드’, ‘사건일과 다음 날’, ‘신청과 발급’, ‘자동연장 아님’은 오해 시 법적 효과가 달라지는 한정이다. 실제 704 중복 기산과 706 DV 주체 설명 반복을 고쳤다. 법적 부정 조건을 모두 불필요 대비로 취급하지 않았다. |
| 7 | 고지 직전 결말은 각각 카드상 인적사항·만료/후속변경, 실제 업무·수업 시작일, 실제 귀환일에 유효한 여권·카드·재입국허가로 닫는다. 뒤의 적용범위·확인일 고지는 LESSONS의 필요한 구조적 꼬리 예외로 남겼다. |
| 8 | 공개 본문은 Burmese `သည်` 문체. 영문은 기관 약칭·고유제도명·associate 개념 등 필요한 경우만 사용한다. 굵은 강조·H1·가짜 1인칭·공개 AI/사람 작성자·훈계형 체크리스트 제목 없음. 내부 author 토큰만 유지한다. |
| 9 | EN 공식 URL 누락0, 현재 원본 이미지3개 일치, 정확한 가상 캡션 보존, 현지화 메타데이터와 3×3 FAQ 유지. 숫자·조문·허가 종류·기산점은 위 F01–F24 표로 의미 대조했다. |

## 자동 검증과 공개 범위

[my-content-audit.json](../checks/my-content-audit.json): 3개 선택, errors0, semanticStatus=REVIEW_REQUIRED. 소유 `my-overlay-content`에서 R의 실제 locale/audience/category 계약을 읽었으며 R에는 복사하지 않았다. 공식 URL은 704 11개(EN9+0902중문·거류규칙), 705 15개(EN15), 706 14개(EN13+온라인절차)다. 모든 EN URL을 보존했고 추가 출처는 직접 열람한 위 문서와 대응한다. EN 교차링크는 라벨에 영어임을 표시했다. 필요한 두 신규 MY 상호링크는 이 세 원고로 해소된다.

이 검사는 공개 배포·HTTP·브라우저 렌더링·모바일 글꼴의 증거가 아니다. 원고에서 보이지 않는 byline 계약은 현행 코드상 확인이며 통합 릴리즈의 실제 출력 검사는 별도다. MY 프로필의 dictionary 기반 wordlike 단위는 자연어 단어의 정답과 같다고 주장할 수 없고, 아래 중립 관측 한계를 유지한다.

## 미얀마어 경계 협업

원고·목표 점수를 주지 않은 중립 도서관/학교/기차 예문10개를 [my-neutral-orthography.json](../checks/my-neutral-orthography.json)에 먼저 고정한 뒤 Node24.14.1/ICU78.2로 [관측](../checks/my-neutral-icu-observation.json)했다. U+104B 뒤 공백 없는 종결, U+104A 문중 목록, 9:30·3.5·၃.၅, Dr.와 인용 뒤 `ဟု` 서술을 포함한다. ICU 기본 sentence 결과는 문중 U+104A, Dr., 인용 뒤 서술을 잘못 분리했다. `စင်္ကြံ`의 wordlike 분할도 언어적 단어와 일치하지 않는 사례다.

[Unicode17 §16.3](https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-16/)의 phrase spacing 설명, [Unicode Myanmar FAQ](https://www.unicode.org/faq/myanmar.html)의 문자·음절 구별, [ICU dictionary 경계 문서](https://unicode-org.github.io/icu/userguide/boundaryanalysis/#dictionary-based-breakiterator)를 도구 담당에게 전달했다. 이는 사람 원어민 검증이 아닌 저자 작성 중립 fixture다. 본문에 점수용 공백·ZWSP를 삽입하거나 정상 숫자·문장부호를 바꾸지 않았다.
''')
p=b/'reviews/my-author.md';p.parent.mkdir(exist_ok=True);p.write_text(''.join(rows))
print(str(p));print(hashlib.sha256(p.read_bytes()).hexdigest())
