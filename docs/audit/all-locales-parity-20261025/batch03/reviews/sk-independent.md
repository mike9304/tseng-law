# SK 704–706 독립 의미·문체 검수

2026-10-25 KST. 검수자: `column_inventory`(AI). 원고 저자는 root이며, 이 검수자는 원고·저자 기록·공유 검사기를 수정하지 않았다. 이 문서는 사람 슬로바키아어 원어민, 대만 변호사 감수 또는 배포 승인이 아니다.

현재 판정: `R2_REVIEWED — 필수 미해결 0건 / 공유 FAIL 0`. root가 필수 2건과 선택 3건을 수정한 뒤 이 검수자가 diff·실제 문장·공유 검사·해시를 다시 확인했다. R2의 정확한 SHA와 결과는 마지막 절에 있다. 아래 R1의 `REQUEST_CHANGES`와 문제 문장은 수정 전 이력으로 보존한다. 최초의 기계 통과가 의미 오류를 대신 해결했다고 표시하지 않는다.

## 검수 대상과 근거

R1 최초 판정(수정 전 기록): `REQUEST_CHANGES` — 필수 2건(704의 서류 AND/OR, 706의 재혼 조건 주체). 당시 공유 문장 다양성 검사는 세 편 모두 exit 0 / FAIL 0이었다. 기계 통과가 두 의미 문제를 해소하지 않았으며, 705에서는 필수 의미 오류를 발견하지 못했다. R1 보고서를 root에게 전달했을 때의 파일 SHA는 `b89fac6adcc10ad366a3c619d72c33d5179c9305556ab20dd41d362ba069f92f`다.

원고 위치: `/Users/son7/tseng-all-language-columns-20261025/batch03/src/content/columns-sk/`. root가 고정한 아래 버전을 제목·요약·FAQ·본문·출처까지 전문으로 읽었다.

| 파일 | 고정 SHA256 |
|---|---|
| 704-taiwan-arc-first-application.md | `a003727aab5ba037ee58de15fe79e52951db9db909fabc7ba1f1be0c96b9a019` |
| 705-taiwan-visa-residence-work-study-family.md | `47d0a750ee13eb4e85c9252addd4fb5a95dafcb4d82c68dd9f01d3028be3159a` |
| 706-taiwan-arc-renewal-changes-reentry.md | `97d14bf5163bca654fc9c53518fc28fa467100013eb4d166a2c720a7acc861b4` |

`batch03/BRIEF.md`, R의 현재 EN/KO/ZH 704–706 아홉 정본, 공통 `arc-source-facts.md` F01–F24, `source-refresh.md`, 지정 문체 규칙을 이 연속 세션에서 전문으로 읽었다. SK 독립 검수에서 EN704와 EN706 해당 범위를 다시 대조했다. R은 `/Users/son7/Projects/tseng-law-all-locales-20261025`다. `held/`나 반려본은 사용하지 않았다.

| 근거 파일 | SHA256 |
|---|---|
| batch03/BRIEF.md | `076a5bd7220bead942bf9dcf4c649180c8036b85d5c019775f1aad1a42eb3c7e` |
| R/docs/audit/all-locales-parity-20261025/research/arc-source-facts.md | `4776f60010172120e0812d8d552123aeb5c7cc0b467cb5306ca031a1e17c2145` |
| R/docs/audit/codex-column-recheck-20261024/research/source-refresh.md | `a33d5bd1439879bc7461755c3b6793f4942ec161454032dcb8cde1c4d52a6983` |
| R/docs/columns/EDITORIAL-VOICE.md | `8b4e39550d9f9ff32b861270bad83a51a69fd71893046a54e7ffdaced9727ea3` |
| /Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md | `8d2eb1f73aeb0967350b8be90aafccfc678224f31cbbf930407462fce65b291d` |
| /Users/son7/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md | `befec7538792d2a98f8c596911667005e2a4000efc078b01db9793c88366edd5` |
| /Users/son7/tseng-lanes-shared/LESSONS.md | `ee0e37da8ffc0a50ba5fb6c6a07c1d67c379538b2e8367b2fa244450d284ca18` |
| batch03/reviews/sk-author.md (첫 열람) | `05442799cb546efb4a171931e00f4358074bfa06b12f942d2e9df5b25bdc5be4` |

홈 `agent-library/knowledge/editorial-voice.md`는 확인 시 존재하지 않았다. 이를 읽었다고 표시하지 않고 R의 문체 정본과 위 공통 규칙을 적용했다. 저자 기록도 별도로 읽었으나 저자의 자체 통과 판정을 독립 결과로 대신하지 않았다.

| 언어 정본 | 704 SHA256 | 705 SHA256 | 706 SHA256 |
|---|---|---|---|
| EN | `610343da1255e2e873956c6de54bd0f9c72c6731aae9343bd7bae9884efdd39f` | `87a4ab6e9a5e8b434a30de0dc111307fc58e878a7534cef793e2a3e27be38304` | `1ecf6acc92d181afb2820bb001d4e4d45cc4eeca823d2e32def25faebe119d71` |
| KO | `cbf6b07b2d41c3b136ceac099f8d32152ca125c18478321610ffa715c29476a1` | `727377648fcc7e2bd1d8ea8202bea5fb69f01174ce51a0ee422891126011d54a` | `4cd612086336cb1a3720111390ce7aca3f4eff5c7f96c5e92aea001fa7b8cfbc` |
| ZH | `0c00bc06bf3c3c1860a95af4dbcea9eaab981300860916856295e8b947244468` | `290a50047632ad830ea98c524ffef6ed91c2b4c8d555a1844689824c3ffea7a3` | `4d70e78b9a197f4a2b81d25d61b6fa862ee849a6392d5fd905e90bcf781e721c` |

최근 SK 세 편도 각각 전문을 읽어 문체와 비교했다.

| 기존 글 | SHA256 | 비교 결과 |
|---|---|---|
| 876-slovak-working-holiday-taiwan-six-month-work-limit.md | `d5a9ed52938c446615ea9adbbe25ef09c7ed2ba92432b89a2fd803e4749e118a` | 특정 슬로바키아 국적의 워킹홀리데이 조건을 일반 ARC 독자에게 옮기지 않았다. 기존 6개월 사실 도입과 새 30일 도입은 모두 수치에서 출발하지만 쟁점·구성이 다르다. |
| 877-slovak-exporter-taiwan-unpaid-invoice-recovery.md | `35625a51f5d40d08db8a5498c1754c84c41bb057397da6262faedeb8dbda9b31` | 기존 송장·납품·검수 날짜의 구체적 서술과 같은 설명 문체다. 새 글은 서류·입국 조건·변경 사건으로 전개하며 수출 사례를 재활용하지 않았다. |
| 878-slovak-business-taiwan-subsidiary-branch-office.md | `f91f40cedcb38c6b094d630434c690d9ec84ba54fb03dfc74ba0d685bba532ba` | 사업 주체·청구 관계의 질문과 706의 카드 날짜 질문은 구체적 쟁점이 다르다. 기존 국적별 투자·협정 설명을 치환하지 않았다. |

## 필수 수정

### SK-01 — 704, 등록 후 재학 서류의 AND/OR

실제 문장:

> Po zápise sa predkladá aktuálne potvrdenie o štúdiu vydané počas posledného mesiaca a doklad o zápise na daný semester.

문제: `a doklad`가 최근 재학 증명과 해당 학기 등록증을 반드시 함께 제출하는 것으로 읽힌다. [NIA 0902 중문](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/29996/)의 ‘요구 서류’ 1(4)4(b)와 [영문 3(1)d(iv)(b)](https://www.immigration.gov.tw/5475/5478/141465/141808/141970)를 10월 25일 다시 직접 열었다. 공식 안내는 최근 1개월 재학 증명을 설명하면서 해당 학기 등록증 또는 학생증을 포함한다. 원고의 추가된 상세 표현은 그 대안을 없앴다. F06/원문에 없는 모든 세부를 덧붙이라는 요구가 아니라, 이미 쓴 의무의 범위를 바로잡는 수정이다.

최소 수정 방향: EN 정본처럼 등록 후 최근 재학 증명을 설명하는 수준으로 줄이거나, 남길 세부에 `alebo študentský preukaz`를 포함하고 누적 의무를 만들지 않는다.

간결한 수정안:

> Po zápise sa predkladá aktuálne potvrdenie o štúdiu vydané počas posledného mesiaca podľa požiadaviek NIA.

세부를 남길 경우의 수정안:

> Po zápise NIA požaduje potvrdenie o štúdiu vydané počas posledného mesiaca; jej zoznam pri tomto doklade uvádza potvrdenie zápisu na aktuálny semester alebo študentský preukaz.

의미 보존: 입학 전/등록 후 구별과 최근 1개월 조건은 유지한다. 두 대체 증빙을 모두 필수로 만들지 않는다. 구체적인 문서 형식은 연결된 NIA 안내를 따른다.

### SK-02 — 706, 재혼하지 않았다는 조건의 주체

실제 문장:

> Výnimka pre rozvod pre domáce násilie sa týka manžela taiwanského občana žijúceho na Taiwane s registráciou domácnosti, ktorý po rozvode neuzavrel nové manželstvo.

문제: `ktorý`가 외국인 배우자 또는 바로 앞의 대만 국민 중 누구를 지시하는지 모호하다. 이는 의도된 뜻이 틀렸다고 단정하는 지적이 아니라, 거류 예외의 재혼 조건이 다른 사람에게 붙을 수 있다는 주체 명확성 문제다. [현행 이민법 중문 제31조 제4항 제2호](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080132)는 외국인 배우자 자신이 가정폭력으로 이혼하고 재혼하지 않았어야 한다. 단일 조문 URL은 이번 열람에서 timeout이 났고, 같은 공식 사이트의 현행 전문에서 해당 항을 직접 확인했다.

수정안:

> Táto výnimka sa týka cudzinca, ktorý sa pre domáce násilie rozviedol s taiwanským občanom žijúcim na Taiwane s registráciou domácnosti. Cudzinec po rozvode nesmie mať uzavreté nové manželstvo.

의미 보존: 외국인 본인의 이혼 사유·재혼 부재와 전 배우자의 대만 거주·호적등록을 분리한다. 앞 문장의 `môže`를 유지해 자동 계속거류 권리로 만들지 않는다. 법원 판결만으로 이혼해야 한다는 새 조건도 넣지 않는다.

## 선택 문장 개선과 강제하지 않은 확장

| 실제 문장·위치 | 판단과 수정 방향 | 의미 보존 |
|---|---|---|
| 704 소제목 `Poplatok a deň, keď bude karta pripravená` | 처리 예상기간을 설명하는 절의 제목이 확정 수령일을 약속하는 듯하다. 본문은 재계산·경로 차이를 밝혀 필수 오류로 보지는 않았다. `Poplatky, vybavenie a prevzatie karty`가 더 정확하다. | 금액·기간·수령 조건은 바꾸지 않는다. |
| 704 `päť pracovných dní na posúdenie s príslušnými výnimkami pre dopĺňanie` | 포괄적인 `výnimkami`보다 `po doplnení dokladov sa päťdňová lehota počíta znova`가 학생 처리기간을 이해하기 쉽다. 바로 앞 일반 신청은 재계산을 명확히 밝혔다. 학생 심사기간 자체를 추가한 문단의 구체성 개선이며, EN의 짧은 안내에 없는 모든 보완 세부를 새로 요구하지 않는다. | 심사 5근무일과 승인 후 납부 5근무일을 계속 구별한다. |
| 704 마지막 실질 문단의 `...; nadväzuje [prehľad predĺženia a zmien ARC]` | 마지막 구절이 후속 글 링크 소개로 끝난다. 그 링크를 앞에 두고, 이사·일자리 변화가 카드 날짜 이전에도 새 신청을 일으킨다는 기존 사실로 끝내면 §5(7)에 더 잘 맞는다. 실제 사안의 결말이 이미 있으므로 MONOTONY 반려 사유로 세지 않았다. | 링크와 변경신고의 의무·기산은 유지한다. |

僑生 감면을 모든 국제학생에게 확대하지 않았고 EN처럼 감면의 존재를 설명하므로, 50% 수치를 새로 추가하지 않았다는 이유만으로 반려하지 않았다. 제17조의 정확한 적격 전문인재 개요에 법정 가족 전원을 새로 열거하도록 강제하지도 않았다. 일반 독자를 위한 요약 범위와 원고에 실제로 쓰인 의무의 오류를 구별했다.

## 의미·FAQ·출처 대조

| 항목 | 확인 결과 |
|---|---|
| F01–F03, 704 입국·국내 발급·직접 신청 | 거류허가 전제, 입국 다음 날 30일과 국내 비자 발급일부터 30일, 유효 통합카드 예외, 허가/면제 및 NIA 승인을 구별한다. FAQ 1도 같은 기산이다. |
| F04, 705 가족 경로 | 일반 전문인재+대만 전문업무 OR 특정전문인재를 두 항목으로 분리했다. 공통 NIA 거류 OR 영주허가를 뒤에 두어 수식 범위가 정확하다. 배우자·미성년·장애로 자기돌봄 불가 성년 자녀 및 가족 자신의 입국 조건을 보존한다. |
| F05, 705 대만인 배우자 | 대만 거주와 호적등록, 허용 체류 60일 이상과 제한 부재를 유지한다. 60일을 비자 사용 가능기간으로 오해하지 않도록 구별한다. 모든 ARC 보유자가 가족을 초청할 수 있다는 FAQ 결론도 없다. |
| F06–F08, 704 서류·혼인 | 최근 2년 사진, 재직 1개월, 인증 의무/번역 요구 가능, 첫 배우자 신청 동행·대만 혼인등록·최장 1년을 보존한다. 학생 서류 AND/OR는 SK-01 수정 대상이다. |
| F09–F10, 금액·기간 | NT$1,000/년, 1년 미만도 1년분, 해당 경로 NT$2,200 가산, 재발급 NT$500을 확인했다. 일반 최장 3년, 고용 특정전문인재·해당 가족 최장 5년의 NIA 승인 다음 날, Gold Card 1–3년을 구별한다. |
| F11–F12, 학생·일반 처리 | 승인→납부 5근무일, 납부→IC수령 3근무일, 온라인 영수증 인쇄·지정 창구, 6개월 이하 전자형 다운로드/인쇄를 유지한다. 일반 10근무일에서 반환·보완·면담 제외와 보완 후 재계산이 명확하다. 학생 재계산 명시화는 선택 개선으로 분리했다. |
| F13–F14, 705 학업·취업 | 학위 과정의 해외/적격 국내 경로, 무비자·도착·다른 목적 방문비자 제한, 어학 4개월 이수+최소 3개월 계속, 평일 주15시간·휴가 포함 결석 1/4 이하를 확인했다. 학생 주20시간의 방학 예외와 실제 취업허가/면제, 대만 국민 배우자의 제48조와 특정/고급 전문인재 배우자의 제15조 직접신청을 혼동하지 않는다. |
| F15–F17, 706 기산·신청행위 | 일반 만료 전3개월, 주소/근무처 변경 다음 날30일, 제23-1조 해당 사건일부터30일, 그 밖 BOCA 신청 사건일부터15일을 구별했다. BOCA 비자 발급을15일 내 보장하지 않는다. 계속 창업4개월·종료사업 별도3개월·Gold Card4개월 모두 만료 전이다. |
| F18–F19, 706 사유 소멸·초과거류 | NIA의 원칙적 허가 폐지/카드말소와 예외적 계속허용 가능을 구별한다. DV 재혼 조건 주체는 SK-02. 미성년자 호적·돌봄/권리/접촉, 진행 중 노동쟁송·치료 중 산재를 유지한다. 초과30일 미만 AND 사유 지속, 제재 후 재신청 가능 및 APRC 산정1년 공제를 확인했다. |
| F20–F21, 추가 거류·졸업생 | 만료 전 신청, 전문인재 원래 만료 다음 날6개월+추가1회/합계1년, 적격 졸업생1년+1회/합계2년을 구별한다. 대만 associate degree 이상·당해 졸업·NIA 승인 연장 중 근로면제는 모든 구직카드로 일반화하지 않는다. |
| F22–F23, 706 여행 | 일반 사전 재입국허가·ARC 유효기간/말소 연동, 유효 여권+APRC 예외를 보존한다. 지정 전문인재·가족 온라인 경로에서 출국은 심사 종료, 재입국 후 적격자는 새 신청 가능이다. 해당 링크가 본문과 출처에 모두 있다. FAQ는 접수증을 여행문서로 대체하지 않으며 ARC에 관한 질문으로 한정된다. |
| F24, 704 일반 보완 | 통지 다음 날15달력일, 해당 해외/대륙/HK/Macao 지역에서 자료를 발급받아야 할 때3개월, 15일과 비가산, 미보완/불완전 보완 기각을 보존했다. 신청인 소재지만으로3개월을 부여하지 않는다. |
| 제목·요약·국적 | 목적별 제목과 본문의 범위가 대응한다. `národnostné`→`štátne občianstvo`의 수정된 705 고정본을 확인했다. Slovak 언어 독자를 슬로바키아 국적자로 단정하거나 새 상담 언어를 약속하지 않았다. |

외부 HTTPS 링크를 EN 정본과 파싱 비교한 결과 세 편 모두 누락 0개였다. 각 편 FAQ는 3개이며 본문 조건을 뒤집지 않는다. `audience: ["sk"]`, `author: "legal-ai-assistant"`, 게시일 2026-10-25, 기존 세 이미지 파일과 `Vymyslená scéna` 표시를 확인했다. 장식 굵은 글씨는 없었다. 704/705/706의 상호 링크는 같은 SK 경로이고, 그 밖 영문 링크는 영어 글임을 표시한다.

## 문장 다양성·§5

직접 실행한 명령:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <SK704 절대경로> <SK705 절대경로> <SK706 절대경로> --lang sk
```

공유 engine SHA256 `69ceb7202a6e716ba1666ec08f4757daea8bc43289448dcffa8446c830ecd6fb`; 실제 profile 경로 `profiles/sk.json`, SHA256 `bdaceac0a3767ca53432736996a1d70f04af43d7bb1fef941b6b08cc746bb04a`. 지원 설치 근거는 `batch03/tooling/variety/root-installation.json`이다. 프로필 내부의 선행 `root review/install pending` 문구는 제작 당시 기록이며, 현재 실행 지원 여부는 설치 기록과 실제 명령 결과로 확인했다.

| 글 | 문장 | 평균 단어 | CV | 짧은 문장 비율 | 유사 길이3연속 | 반복 오프너 비율 | 문장 끝 괄호 인용 | 인용 문단 비율 | 대비 | 질문 | 결과 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 704 | 61 | 12.7 | .454 | .246 | .051 | .056 | 0 | .333 | 0 | 0 | FAIL 0 |
| 705 | 69 | 13.6 | .547 | .290 | .015 | .136 | 0 | .500 | 0 | 1 | FAIL 0 |
| 706 | 85 | 13.7 | .469 | .235 | .024 | .040 | 0 | .440 | 0 | 1 | FAIL 0 |

실제 추출 문장과 문단 시작을 읽었다. HR에서 보고한 조문 번호 점의 가짜 짧은 문장 문제는 이 SK 입력에서 발견하지 못했다. 문장수는 도구가 정한 본문 포함/제외 범위를 따른다. 표·목록·FAQ 전체의 문체를 이 숫자가 대신 측정하지 않는다.

1. 올바른 `--lang sk`로 직접 실행했고 다른 언어 fallback을 쓰지 않았다.
2. 첫 문장은 각각 구체적 30일 기산, 입국 방식에 따른 경로 차이, 사유 소멸 전후의 카드 날짜 질문이다. 최근 876–878과 문장/사례를 복제하지 않았다.
3. `Nemusia byť totožné.`, `Dĺžku pobytu určuje NIA.`, `Podpísaná ponuka povolenie nenahrádza.`, `Náhradná karta pobyt nepredĺži.` 등 실질적인 짧은 문장과 조건이 긴 문장이 섞여 있다.
4. 문단 첫말을 세로로 비교했다. 705의 `Pri`가 여러 번 나오나 장문 기준을 넘거나 연속하지 않는다. 새 글의 같은 시작 3연속, 조문 주장→예외 문단3연속은 발견하지 못했다.
5. 서류 보관·신규 업무 시작·실제 여행일의 효과를 다루는 인용 없는 문단이 있다. 모든 문장을 기관명이나 조문으로 열지 않는다.
6. 법적 비자동 효과를 설명하는 `nenahrádza`, `nezakladá`는 뜻을 위해 보존할 수 있다. 독자가 한 적 없는 주장을 반박하는 장식 대비나 출처를 뒤에 몰아붙이는 연속 패턴은 반려할 정도로 발견하지 못했다.
7. 고지 직전 실질 결말은 704의 후속 변경, 705의 새 활동을 덮는 승인, 706의 실제 귀환일 문서다. 704의 마지막 링크 안내를 사실 앞에 옮기는 선택 개선은 위에 분리했다. 판촉 결말을 복제하지 않았다.
8. 설명 문체와 자연스러운 독자 지시가 유지된다. 명령형 체크리스트 제목·가짜 1인칭 경험·굵은 강조가 없다. Slovak/Czech 어휘 혼용이나 언어→국적 치환이 뚜렷한 문장은 발견하지 못했다. 이 판단은 원어민 인증이 아니다.
9. 법적 주체·AND/OR의 두 필수 지적을 수치 통과보다 우선한다. 수정 뒤 새 SHA와 같은 공유 검사 재실행이 필요하다.

MONOTONY: 현재 고정본에서 별도의 반려 항목은 발견하지 못함. 수치와 수동 검토의 범위를 위처럼 구별하며, 이후 필수 수정으로 달라지는 문장 배열은 다시 확인한다.

## 한계와 후속

이번 독립 검수에서 NIA 0902 영어·중국어, 학생 0929 및 MOJ 이민법 제31조를 공식 웹에서 직접 확인했다. 나머지 명제의 공식자료 최신성은 10월24일 조사와 10월25일 공통 사실표의 확인 범위를 따른다. 모든 원자료를 10월25일에 새로 전수 확인했다는 뜻은 아니다. MOJ의 정비 기준일 이후 관보 전수조사, 개인 신청 적격 판단, 브라우저 표시·배포 검증은 수행하지 않았다.

저자는 SK-01/02 반영 여부와 새 SHA를 보내야 하며, 이 보고서의 현재 `REQUEST_CHANGES`를 수정 후 통과로 자동 간주할 수 없다. 독립 검수자는 그 버전에서 의미 보존·문장 다양성·해시를 다시 확인한다.

2026-10-25 22:58:52 KST 종료 해시 대조: SK 세 편은 위 고정 SHA와 모두 같았고, 현재 EN/KO/ZH 아홉 정본도 위 기록과 일치했다. 현재 지적은 수정 전 고정본에 대한 판정이다.

## R2 — 수정 후 독립 재검수

2026-10-25 23:05:59 KST. root의 수정 완료 통보 뒤 파일을 읽고, 실제 R1 도구 출력에 보관된 원문을 임시 파일로 복원해 R1 SHA가 맞는지 먼저 확인했다. 그 텍스트와 R2 파일의 diff 전체를 대조했다. 704는 SK-01 및 선택 3건, 706은 SK-02만 바뀌었고 705는 R1과 동일하다. 원고나 저자 기록을 검수자가 수정하지 않았다.

| 원고 | R2 SHA256 |
|---|---|
| 704-taiwan-arc-first-application.md | `32162857995b9336edabd034c3f511a625e1cddbf90c9d7536485d1f682aa509` |
| 705-taiwan-visa-residence-work-study-family.md | `47d0a750ee13eb4e85c9252addd4fb5a95dafcb4d82c68dd9f01d3028be3159a` |
| 706-taiwan-arc-renewal-changes-reentry.md | `8fa19db348cf21a5220cb5295c0aa38f42f84bc075eaf0ac366a60af99c9ee51` |

| R1 지적 | 실제 R2 문장·반영 | 재검수 결과 |
|---|---|---|
| SK-01 | `Po zápise sa predkladá aktuálne potvrdenie o štúdiu vydané počas posledného mesiaca podľa požiadaviek NIA.` | 최근 1개월·등록 후 단계·NIA 요구를 남기고 별도 학기등록증 누적 의무를 삭제했다. EN 수준의 정확한 간결 설명이므로 학생증 대안을 다시 열거하도록 강제하지 않는다. 해소. |
| SK-02 | `Výnimka pri rozvode sa týka cudzinca, ktorý sa pre domáce násilie rozviedol s taiwanským občanom žijúcim na Taiwane s registráciou domácnosti. Cudzinec po rozvode nesmie mať uzavreté nové manželstvo.` | 재혼 조건을 외국인 본인에게 명시적으로 붙였다. 가정폭력 이혼, 상대방의 대만 거주·호적, 앞 문장의 계속허용 가능을 유지한다. 해소. |
| 선택 소제목 | `Poplatky, vybavenie a prevzatie karty` | 확정 준비일처럼 보이던 표현을 처리와 수령의 주제로 바꿨다. 반영. |
| 선택 학생 재계산 | `päť pracovných dní na posúdenie bez času na doplnenie dokladov. Po doplnení sa päťdňová lehota počíta znova.` | 바로 앞의 근무일 단위와 연결해 보완 후 5근무일 재계산을 명확히 한다. 이후 승인 후 납부5/납부 후 수령3은 그대로다. 반영. |
| 선택 마지막 실질 결말 | 후속 링크 설명 뒤 `Sťahovanie, zmena práce a cestovanie môžu vyvolať nové podania ešte pred dátumom na karte.` | 링크를 보존하며 카드 날짜 이전의 변경 관련 신청이라는 글의 실질 사실로 끝난다. 반영. |

704/706의 frontmatter 전체는 R1과 같고, 외부·내부 링크의 추가/삭제는 모두 0개다. 따라서 제목·요약·FAQ·게시일·내부 author·이미지 표시는 동일하다. 변경 부분의 실제 문장 추출도 읽었다. 서류의 조건을 삭제해 검사 수치를 맞추거나, 가짜 짧은 문장을 넣지 않았다. 추가된 짧은 문장은 보완 뒤 재계산과 미재혼 조건이라는 실질 내용을 담는다. F04/F23/F24를 포함한 나머지 본문은 위 R1에서 검수한 정확한 텍스트와 동일하다.

같은 공유 절대경로 명령에 `--lang sk`를 명시해 이 검수자가 다시 실행했다. 결과는 exit 0 / FAIL 0이다. 23:01의 HR/HU 경계 보완 후 공유 도구를 사용했으며 `variety_expansion.py` SHA는 `f52177c31d0d0d161d78f5b578ede8e6213dc090b116d6ca7dfaf2115e1c49f9`이고 SK profile SHA는 R1과 같다. 변경 범위의 도구 적용이 원고 의미 승인을 대체하지 않는다.

| 글 | 문장 | 평균 단어 | CV | 짧은 문장 비율 | 유사 길이3연속 | 반복 오프너 비율 | 문장 끝 괄호 인용 | 인용 문단 비율 | 대비 | 질문 | 결과 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 704 | 63 | 12.5 | .455 | .270 | .049 | .056 | 0 | .333 | 0 | 0 | FAIL 0 |
| 705 | 69 | 13.6 | .547 | .290 | .015 | .136 | 0 | .500 | 0 | 1 | FAIL 0 |
| 706 | 86 | 13.6 | .469 | .244 | .024 | .040 | 0 | .440 | 0 | 1 | FAIL 0 |

R2에서 남은 필수 의미 수정이나 MONOTONY 반려 항목은 발견하지 못했다. 이 판정은 위 세 SHA에 한정된다. root가 갱신한 `sk-author.md`(SHA256 `6b765c436cea4c127ceded2ef5e0fab76f1e99f3d323fd249a5ff6096a79791b`)의 실제 수정표·새 SHA도 읽어 대조했다. 빌드·공개 렌더링·배포는 root의 후속 범위이며, 사람 원어민 또는 변호사 감수로 승격되지 않는다.
