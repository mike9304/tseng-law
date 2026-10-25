# NL 704–706 독립 검수

검수일: 2026-10-25 KST. 검수자: `column_live_audit`(이 세 NL 원고를 작성하지 않은 AI 검수 역할).

판정: ITERATE — 705의 60일 조건 한 곳을 명확히 수정하면 된다. 가족 초청자 OR 범위(F04)와 해당 온라인 절차의 출국 시 심사 중단(F23)은 정확하다. 공유 문장 검사 세 편 모두 FAIL 0. 아래에서 필수 수정 1건과 선택 보완을 구분한다. 인간 변호사·독립 원어민의 승인이나 live 게시 확인으로 표시하지 않는다.

## 검수한 파일 상태

| 파일 | 검수 당시 SHA-256 |
|---|---|
| `src/content/columns-nl/704-taiwan-arc-first-application.md` | `47cb7de8d15fbbbdffe9d0bb2a0ea27e74a313e051a6ebaf8ba72455c0aab3c6` |
| `src/content/columns-nl/705-taiwan-visa-residence-work-study-family.md` | `9f27e939be8c3fbec12ea555f96c9099e4cede832f27dd2799d382835aa8cc65` |
| `src/content/columns-nl/706-taiwan-arc-renewal-changes-reentry.md` | `788fcd4f71b5b453c921edb514b48ebe678ca123d9bfac90482b269968b0c37d` |

세 원고와 FAQ·출처 목록을 모두 읽었다. 원고를 직접 수정하지 않았다. 이 단계의 유일한 작성 파일은 이 보고서다. 다른 에이전트의 변경, 검사기, 게시·배포 상태는 변경하지 않았다.

검수 기준은 저장소 AGENTS, 전체 언어 BRIEF, ARC BRIEF, `docs/columns/EDITORIAL-VOICE.md`, `FRONTMATTER.md`, 공유 문장 다양성 규칙·LESSONS, 2026-10-24 `source-refresh.md`·`final-core.md`, 현행 EN/KO/ZH 704–706이다. 공통 `research/arc-source-facts.md`의 F04 정정과 F23 추가까지 대조했다.

최근 NL 세 편 `834-dutch-company-taiwan-subsidiary-branch-office.md`, `835-dutch-employer-taiwan-first-hire-eor.md`, `836-dutch-working-holiday-taiwan-work-insurance-tax.md`도 전문을 읽고 도입·제목·문단·끝부분을 비교했다. 834의 명시된 가상 장면, 835의 실제 질문, 836의 수치 도입을 그대로 복제하지 않는다. 기존 세 편의 반복 연락·상담 언어 문단도 새 세 편 전체에 복제하지 않았다.

## 필수 수정 1건

### NL-L01 / 705: 60일은 비자 자체 유효기간이 아니라 허용 체류기간

위치: `705-taiwan-visa-residence-work-study-family.md:60`, 가족 체류 단락.

실제 문장:

> Artikel 23 van de immigratiewet biedt onder meer een aanvraag na binnenkomst met een geldig visum voor minstens 60 dagen, zonder de genoemde beperkingen zoals een verbod op verlenging.

문제: `een geldig visum voor minstens 60 dagen`는 60일을 비자 자체의 유효기간으로도 읽을 수 있다. [이민법 제23조 제1항](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080132)은 유효한 비자로 입국하되 허용 체류기간이 최소 60일이고 연장 불허 등 제한이 없는 경우를 정한다. EN의 `valid visa allowing a stay of at least 60 days`, ZH의 `停留期限達60日以上` 및 공통 F05가 구별하는 조건이다.

수정안(기존 조문 링크 유지):

> Artikel 23 van de immigratiewet biedt onder meer een aanvraag na binnenkomst met een geldig visum dat een verblijf van minstens 60 dagen toestaat, zonder een aantekening die verlenging verbiedt of een andere beperking oplegt.

의미 보존: `geldig`(유효한 비자), `minstens`(이상), `verblijf`(허용 체류기간), 연장 불허·다른 제한의 부재를 모두 유지한다. 앞 문장의 대만 실제 거주+호적등록 배우자 범위와 뒤 문장의 혼인만으로 무비자 전환을 보장하지 않는 제한도 그대로 두면 된다. 날짜·조문·출처 URL·FAQ 범위 변경은 필요 없다.

이 변경은 새로운 법률 쟁점을 추가하는 작업이 아니다. 필수 수정 후 그 문장과 해당 파일의 문장 검사·해시만 확인하면 되며, 세 편 전부의 조사·검수를 처음부터 반복할 필요는 없다.

## 핵심 법률 의미 대조

| 공통 명제 | 검수 결과 |
|---|---|
| F01–F02 / 첫 ARC | 거류비자+거류허가 입국의 30일은 다음 날부터, 대만 내 발급은 비자 발급일부터. 표·본문·FAQ가 같은 기준. 유효한 통합 ARC 기능 문서 예외도 유지. |
| F03 / 전문직 | 취업허가 OR 법정 면제, NIA 승인 뒤 ARC를 구별한다. 취업 제안서를 허가로 대체하지 않고 다른 이주노동자 절차를 분리한다. |
| F04 / 가족의 OR 범위 | `een buitenlandse professional zijn die daar professionele werkzaamheden verricht, of een buitenlandse professional met erkende bijzondere deskundigheid. Die persoon moet toestemming voor verblijf of permanent verblijf hebben.`는 [(일반 전문인재 AND 대만 전문업무) OR 특정전문인재] AND (거류 OR 영주거류)를 보존한다. 특정전문인재에게도 실제 업무를 일률 요구하는 문장이 아니다. 배우자·미성년·장애로 자립불가한 성년 자녀 및 해당 입국 조건도 유지. |
| F05 / 일반 가족 경로 | 대만 실제 거주+호적등록 배우자, 제한 없는 비자, 일반 이주노동자 일부 제외, 혼인만으로 무비자 전환 불가를 유지. 단, 60일이 허용 체류기간이라는 NL-L01 수정 필요. |
| F06–F08 / 서류·첫 배우자 ARC | ARC 사진 2년과 BOCA 학생비자 사진6개월 구별. 재직·등록 뒤 재학 자료 최근1개월. 해외 문서 인증과 중국어 번역 요구 가능성 구별. 첫 대만인 배우자 ARC는 `maximum van één jaar`로 정확하며 거주+호적·동행·혼인등록 범위를 유지. |
| F09–F10 / 요금·기간 | NT$1,000/승인 연도, 미만1년도 1년분, 해당 경로 NT$2,200, 재발급NT$500, 일반 ARC 최장3년을 정확히 기술. 僑生 할인과 전문인재 별도 기간은 존재·적용범위를 유지하되 일부 정확한 수치는 축약했음. 아래 선택 보완 참고. |
| F11–F12 / 학생·심사 | 일반10근무일·학생5근무일, 보완 후 재기산, 승인 후5근무일 납부, 납부 후3근무일 IC수령, 전자형최대6개월을 각각 구별. 다른 신청자에게 학생 절차를 확대하지 않음. |
| F13 / 유학·어학 | 정규학생은 적절한 입국 목적과 직접 신청 자격을 요구한다. 일반 무비자·도착비자·다른 목적 방문비자 전환을 배제. 어학4개월 이수+최소3개월 추가등록, 주중15시간, 휴가 포함 결석1/4 이하 유지. |
| F14 / 근로 | ARC와 취업허가를 구별. 대만 호적 국민과 혼인+거류 승인된 외국인의 면제와 특정·고급전문인재 배우자의 직접 허가신청을 구별. 모든 외국인 가족에게 취업면제를 확장하지 않음. |
| F15–F17 / 변경 기산점 | 일반 연장 만료 전3개월. 주소·직장 다음 날부터30일. 제23-1조 사유변경 발생일부터30일, 그 밖 발생일부터15일 BOCA 후 NIA. 사업 유지 창업가·Gold Card4개월, 사업 중단 별도3개월. FAQ와 표 일치. |
| F18–F19 / 근거 소멸·초과거류 | 근거 소멸 시 취소 원칙과 NIA가 허용할 수 있는 요건별 예외를 구별. 30일 미만 AND 원사유 계속 AND 처벌 후 재신청을 유지하고 무불이익 유예로 쓰지 않음. 영주거류 계산 불이익은 있다고 적되 1년 수치는 축약. |
| F20–F21 / 졸업·추가 거류 | 전문인재6개월+한 번 추가/총1년과 적격 졸업생1년+한 번 추가/총2년을 구별. 만료 전 신청·종전 만료 다음 날 기산 보존. 이미 대만 전문학사 이상 취득+당해 졸업생+NIA 승인 연장 중 취업허가 면제를 한정. 어학 수료자를 일반 졸업 경로에 포함하지 않음. |
| F22 / 재입국 | 출국 전 허가, ARC 유효기간과 연동·취소 시 소멸, 유효 여권+APRC 예외, 영수증이 여행서류를 대신하지 않는 점 유지. |
| F23 / 심사 중 출국 | `bepalen dat de behandeling stopt wanneer de aanvrager tijdens die aanvraag vertrekt`로 해당 온라인 절차의 필수 효과를 보존. 재량적 ‘종결될 수도 있음’으로 약화하지 않았고 모든 ARC의 출국 금지로 확대하지도 않음. 재입국 후 적격성 충족·재신청의 세부는 생략했지만 자동 재개를 약속하지 않음. |

F04는 이번 검수에서 [공식 중문 인재법 제16조 제2항](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=A0030295)과 [공식 영문](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295)을 직접 대조했다. F23은 이번 세션에 실제 읽은 [NIA 시범 온라인 안내 주의9항](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/)에 따른다.

## 비차단 선택 보완

다음은 현재 EN 정본처럼 간략히 기술한 부분의 구체화 제안이다. 잘못된 숫자로 번역했거나 반대 의미로 썼다는 판정은 아니며, NL-L01과 같은 필수 수정으로 계산하지 않는다.

| 실제 문장 | 보완 이유 | 선택 수정안·의미 보존 |
|---|---|---|
| 704: `De korting voor studenten met de specifieke status 僑生 geldt niet voor alle internationale studenten.` | 공통 F09와 ZH는 절반 할인까지 명시. 할인 대상 제한은 현재도 정확하다. | `De korting van 50% voor studenten met de specifieke status 僑生 geldt niet voor alle internationale studenten.` [수수료 기준3조](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080135)의 정확한 수치를 더하면서 대상을 넓히지 않는다. |
| 704: `Het wettelijke maximum voor een gewone ARC is drie jaar; bepaalde specialistische professionals vallen onder een afzonderlijke regeling.` | 일반3년과 별도 제도 구별은 정확하지만 공통 F10의 특정전문인재 최장5년은 독자가 링크를 열어야 알 수 있다. | 필요한 경우 현 문장 뒤에 적격 고용된 특정전문인재의 제8조상 최장5년·허가 다음 날 기산을 한 문장으로 추가한다. [제8조](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295)의 고용·허가 전제를 빼고 모든 전문직5년으로 쓰면 안 된다. |
| 706: `De regeling heeft bovendien gevolgen voor de berekening van het verblijf voor een latere aanvraag tot permanent verblijf.` | F19·[이민법31조3항](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080132)의 실제 불이익은 1년 공제다. 현재 문장도 불이익이 있음을 정확히 알린다. | `Bij een latere aanvraag tot permanent verblijf wordt volgens deze bepaling één jaar van de mee te tellen verblijfsduur afgetrokken.` 앞의 30일 미만·원사유 계속·처벌 후 재신청 문맥에 붙여 적용 범위를 보존한다. |

## 자연스러움·최근 세 편·문체 규칙 §5

Dutch의 `u` 설명체가 일관되고 법률 요건을 읽기 쉬운 문장과 표로 분리했다. 네덜란드어 독자를 네덜란드 국적자로 간주하지 않는다. 705는 국적·여권이 자격을 정한다고 명시하고, 704는 서류 발급국에 따라 절차가 달라질 수 있다고 구분한다. 네덜란드법을 대만법 대신 적용하거나 Dutch 상담을 약속하지 않는다.

1. 정확한 공유 경로로 세 파일을 실행했다. 아래 기계 결과처럼 모두 `[nl]` 인식, FAIL 0.
2. 도입은 704 신청 요건 질문, 705 입국 방식의 구체적 결과, 706 카드 날짜와 체류 근거 종료일의 차이다. 가상 상황 공식 도입이나 범용 예고 없음.
3. 각 글에 아주 짧은 문장 두 개 이상. 예: 704 `Originelen én kopieën zijn nodig.` / `Na aanvulling begint de behandeltijd opnieuw.`; 705 `De toelatingsbrief is één bewijsstuk.` / `Alleen het lesgeld betalen is onvoldoende.`; 706 `Ontbrekende stukken kosten tijd.` / `Uw verblijfsduur verandert daardoor niet.`
4. 표·제목·목록을 제외한 본문 문단 시작을 대조했다. 같은 첫 단어 최대 빈도는 세 편 모두2. 연속 시작과 길이 검사도 통과.
5. 주장(조문)→단서 틀3연속 없음. 서류 보관, 입학 자료, 근로 기간 등 인용 없는 실무 설명 문단이 있다.
6. 대비 틀 기계계수0. 신청·취업·출국 요건을 구별하는 부정문은 필요한 법적 한정이며, 상대가 하지 않은 주장에 대한 반복적인 반박이 아니다.
7. 마지막의 확인일·적용범위 문단은 필요한 구조적 고지로 보고 LESSONS의 예외를 적용한다. 고지 직전 실질 결말은 704 다음 신청을 위한 자료, 705 출국 전 자격 증명 서류, 706 실제 귀국일을 덮는 서류로 각각 구체적이다. 고지 반복만으로 MONOTONY 반려를 만들지 않는다. 고지를 앞쪽으로 옮기는 것은 선택 문체 변경이며 내용 삭제는 제안하지 않는다.
8. 굵은 강조·꾸민1인칭·공개 작성자/AI 표시·명령형 체크리스트 제목 없음. 명시적 영어 글 링크에는 `Engelstalige` 안내가 있어 Dutch 원문인 것처럼 위장하지 않는다.
9. 법률조건·기산점·금액·공식 링크·가상 이미지 표시를 대조했다. 필수 수정 NL-L01을 제외하고 이번 검수에서 의미 반전이나 기간 기산 오류를 발견하지 못했다. 기계검사 성공을 이 판단의 대체물로 사용하지 않았다.

## 기계·구조 확인

실제 명령:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-nl/704-taiwan-arc-first-application.md src/content/columns-nl/705-taiwan-visa-residence-work-study-family.md src/content/columns-nl/706-taiwan-arc-renewal-changes-reentry.md
```

| 파일 | 문장 수 | 길이 CV | 짧은 문장 | 유사 길이3연속 | 끝 괄호 인용 | 대비 틀 | 결과 |
|---|---:|---:|---:|---:|---:|---:|---|
| 704 | 71 | 0.452 | 0.254 | 0.014 | 0.000 | 0 | FAIL 0, exit 0 |
| 705 | 75 | 0.453 | 0.160 | 0.027 | 0.000 | 0 | FAIL 0, exit 0 |
| 706 | 85 | 0.482 | 0.200 | 0.024 | 0.000 | 0 | FAIL 0, exit 0 |

Node v24.14.1과 프로젝트 `gray-matter`로 frontmatter를 파싱했다. 세 편 모두 2026-10-25 날짜, `audience: ["nl"]`, FAQ3, 이미지 파일 존재를 확인했다. 본문 공개 byline과 장식용 굵은 표기는 없다. EN별 공식 외부 URL 누락0, 로컬 파일 기준 내부 링크 누락0이다. 영어 링크는 704 배우자 글, 705 배우자·Gold Card 글, 706 APRC 글이며 모두 영어라는 안내와 실제 대상 파일이 있다.

## 확인의 한계와 후속

공식 중문 인재법8·9·12·16·17조, 이민법22·23·31·34조와 수수료 기준3·7조를 이번 세션에 직접 열어 대조했다. 거류 규칙과 BOCA 최초 ARC·학생 안내, NIA 전문인재 온라인 지침도 같은 세션의 실제 열람을 사용했다. 그 밖에는 10월24일 공식 갱신표와 현행 EN/KO/ZH 정본 및 10월25일 공통 표의 확인 범위를 구별해 사용했다. 모든 외부 문서나 관보를 전수 조사했다고 주장하지 않는다.

이 검수는 AI의 독립 의미·문장 검토이며 외부 원어민/인간 변호사 인증은 아니다. 전체 빌드, 브라우저 렌더링, 발행·live 상태는 검증하지 않았다. NL-L01의 한정 수정과 해당 파일의 후속 검사·SHA 기록 뒤 주 에이전트가 통합·배포 판단을 이어갈 수 있다.
