# HR 704–706 독립 의미·문체 검수

2026-10-25 KST. 판정은 필수 수정 1건(M01), 선택 문체 제안 1건(S01)이다. 705·706에서 필수 의미 오류는 발견하지 못했다. 아래 고정 원고에 대한 공유 기계검사는 세 편 모두 exit 0 / FAIL 0이며, 704의 의미 수정이 완료됐다는 뜻은 아니다. AI 독립 대조 기록으로, 사람 크로아티아어 원어민·대만 변호사 감수 또는 게시 승인이 아니다.

검수자는 원고·저자 보고서·릴리즈 R·공유 도구를 수정하지 않았다. 작성자 column_inventory가 아래 SHA를 직접 확인했고, 보고서 저장까지 원고를 동결하기로 했다. 본 검수의 유일한 출력은 이 파일이다.

## 고정 원고와 대조 기준

원고 폴더는 /Users/son7/tseng-all-language-columns-20261025/batch03/src/content/columns-hr 이다.

| 파일 | 바이트 | SHA256 |
|---|---:|---|
| 704-taiwan-arc-first-application.md | 11942 | 985ebae4fcc6c789c2dacfe813a6e5bef93b0a41f92f265d58c0a618b02a9f65 |
| 705-taiwan-visa-residence-work-study-family.md | 12726 | 86086af13bf8b01280ff46115efb94d461efad6afea70370a17d57f27dff292c |
| 706-taiwan-arc-renewal-changes-reentry.md | 15312 | b339966a41c6902cd86c6c2d066a2a692bf30fd2e4ad8f2d555d8ef96d462f93 |

세 원고의 제목·요약·본문·표·FAQ·이미지 문구·출처 목록과 hr-author.md를 전문으로 읽었다. batch03 BRIEF, R의 EN/KO/ZH 정본 9개, F01–F24, source-refresh와 문체 규칙은 같은 계속 세션에서 전문으로 읽었고 이번 검수 말미에도 파일 해시를 대조했다. source-refresh의 24일 조사와 25일 보충 직접 열람을 구분한다. 단순히 EN보다 짧거나 긴 것을 오류로 판단하지 않았다.

R은 /Users/son7/Projects/tseng-law-all-locales-20261025 이다. 정본 내용 기준 commit은 ef3b24e73d84968eea08ea9d58e991ccbbf83fa8이며, 최종 해시 확인 때 R HEAD는 e3c5a5fc4eeae8ae89c704672172aa4fbada245e였다. 아래 정본 내용은 동일했다.

| R 정본 폴더 | 704 SHA256 | 705 SHA256 | 706 SHA256 |
|---|---|---|---|
| src/content/columns-en | 610343da1255e2e873956c6de54bd0f9c72c6731aae9343bd7bae9884efdd39f | 87a4ab6e9a5e8b434a30de0dc111307fc58e878a7534cef793e2a3e27be38304 | 1ecf6acc92d181afb2820bb001d4e4d45cc4eeca823d2e32def25faebe119d71 |
| src/content/columns | cbf6b07b2d41c3b136ceac099f8d32152ca125c18478321610ffa715c29476a1 | 727377648fcc7e2bd1d8ea8202bea5fb69f01174ce51a0ee422891126011d54a | 4cd612086336cb1a3720111390ce7aca3f4eff5c7f96c5e92aea001fa7b8cfbc |
| src/content/columns-zh | 0c00bc06bf3c3c1860a95af4dbcea9eaab981300860916856295e8b947244468 | 290a50047632ad830ea98c524ffef6ed91c2b4c8d555a1844689824c3ffea7a3 | 4d70e78b9a197f4a2b81d25d61b6fa862ee849a6392d5fd905e90bcf781e721c |

| 기준 파일 | 읽은 버전 SHA256 |
|---|---|
| batch03/BRIEF.md | 076a5bd7220bead942bf9dcf4c649180c8036b85d5c019775f1aad1a42eb3c7e |
| batch03/reviews/hr-author.md, 경계 보완 후 추가 기록 포함 | 86c3a42fbe135d35208ab5cd96e993d38e95ccb2481fae441963f92fe5c92811 |
| R/docs/audit/all-locales-parity-20261025/research/arc-source-facts.md | 4776f60010172120e0812d8d552123aeb5c7cc0b467cb5306ca031a1e17c2145 |
| R/docs/audit/codex-column-recheck-20261024/research/source-refresh.md | a33d5bd1439879bc7461755c3b6793f4942ec161454032dcb8cde1c4d52a6983 |
| R/docs/columns/EDITORIAL-VOICE.md | 8b4e39550d9f9ff32b861270bad83a51a69fd71893046a54e7ffdaced9727ea3 |
| R/docs/columns/FRONTMATTER.md | 7a2590f33ba49c55f539f1fade51fed1290808352b16247445a714333593a364 |
| /Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md | 8d2eb1f73aeb0967350b8be90aafccfc678224f31cbbf930407462fce65b291d |
| /Users/son7/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md | befec7538792d2a98f8c596911667005e2a4000efc078b01db9793c88366edd5 |
| /Users/son7/tseng-lanes-shared/LESSONS.md, 23:04 KST 생성본 전문 재독 | 92c572987cbc3c03eeb934fbfd2de6cf42d7e4b2e441cc39fb009c0e11f0e71a |

홈에서 지정한 /Users/son7/agent-library/knowledge/editorial-voice.md는 현재 없다. 없는 파일을 읽었다고 기록하지 않으며, 위 R 문체 정본과 COLUMN-VOICE-RULE을 적용했다. 폐기된 Fable의 고정 승인 절차를 새 요구로 적용하지 않는다.

## 필수 수정 M01 — 재학자료의 포함관계를 추가 제출 의무로 변경

대상: 704, 「Dokazi za posao, studij i obitelj」의 학업 불릿(현재 49행).

실제 문장: “Nakon upisa potrebna je potvrda o studiranju izdana unutar posljednjih mjesec dana, uz dokaz upisa semestra ili studentsku iskaznicu.”

문제: uz는 앞의 재학증명서에 학기등록 증명 또는 학생증을 덧붙이는 관계로 읽힌다. [NIA 중문 0902의 應備文件·就學](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/29996/)은 등록 후 자료를 “一個月內在學證明(含當學期註冊證明或學生證)”이라고 한다. 최근 1개월 재학자료에 해당 학기 등록 증명 또는 학생증이 포함된다는 설명을 별도 서류의 누적 의무로 바꾸면 제출 부담을 추가한다. 2026-10-25 이 공식 페이지를 직접 열어 해당 항목과 등록 전 입학허가 항목을 확인했다. F06과 EN704의 “recent enrollment evidence once registered”도 추가 세트를 의무화하지 않는다.

최소 수정안: “Nakon upisa potrebna je potvrda o studiranju izdana unutar posljednjih mjesec dana.” 앞 문장의 등록 전 입학허가 요건은 유지한다. 학기등록/학생증 예시를 남기려면 별도 첨부를 뜻하는 uz 대신 NIA가 열거한 재학자료에 포함된다는 관계를 명시한다.

의미 보존: 최근 1개월과 등록 전/후 단계 구분을 유지하고, 정본 EN 수준의 정확한 요약으로 돌아간다. 상세 예시를 전부 반복하도록 강제하는 제안이 아니다. 작성자는 지적을 수용했지만 이 보고서의 SHA는 수정 전이며, 실제 수정·새 해시·재검사는 별도 확인해야 한다.

## 선택 S01 — 수수료 설명의 같은 경고 반복

MONOTONY: 시리즈 안 같은 반박의 반복 — 704 “Veća uplata ne daje pravo na dulji rok.”와 706 “Veća uplata ne produljuje dopušteni rok.” — 한 곳을 앞의 긍정형 기간 결정 설명과 합치거나 중복 단문을 줄일 수 있다.

706의 최소 제안은 바로 앞 “Duljinu određuju kategorija i NIA-ino odobrenje.”를 유지하고 다음 단문만 생략하는 것이다. 요율·기간·NIA 승인과 범주별 한도는 남으므로 의미가 보존된다. 다만 서로 독립적으로 읽는 안내이고 EN 정본에도 해당 한정이 있으므로 이를 필수 오류나 단조로움 반려로 삼지는 않는다. ARC가 무제한 근로허가가 아니라는 설명, 부모/성년 자녀의 법정 범위, 재입국 보장 부정까지 함께 삭제하면 안 된다.

## 법적 주체·효력·기산점·범위 대조

| 사실표 | 실제 확인한 HR 문구와 조건 |
|---|---|
| F01–02 | 704 도입·표·FAQ는 거류비자로 입국하고 거류허가를 받은 경우 입국 다음 날부터 30일, 입국 후 대만 안에서 발급된 거류비자는 발급일부터 30일로 구분한다. “nalaže podnošenje zahtjeva”로 Art22 의무를 남겼고, ARC 기능이 있는 유효 통합증명 예외도 있다. 무비자 방문자에게 일괄 새 30일을 주지 않는다. |
| F03 | 704/705는 적격 전문인재와 특정전문인재, 허가 OR 적용 가능한 면제, 전문 업무, 해당 입국 방식, NIA의 별도 거류승인을 구분한다. 705의 0915 제외는 시범 무비자·도착비자·해당 TAC·ABTC·Working Holiday와 다른 규정상 예외다. 모든 무비자 입국을 배제하지 않는다. |
| F04 | 705의 “status stranog stručnjaka koji na Tajvanu obavlja stručni rad ili status stranog stručnjaka s posebnim kvalifikacijama” 뒤 “U oba slučaja NIA mu mora prethodno odobriti boravak ili stalni boravak.”를 대조했다. [(일반 전문인재 AND 대만 전문 업무) OR 특정전문인재] AND [NIA 거류 OR 영주거류 승인]이 보존된다. 배우자·미성년 자녀·신체/정신 장애로 자기 돌봄이 불가능한 성년 자녀가 대상이며, 수입 부재만으로 자립불능을 판단하지 않는다. 부모를 자동 포함하지 않는다. |
| F05 | 705는 대만에 살며 호적등록한 대만 국민의 배우자, 유효 비자, 최소 60일 허용 방문기간, 연장금지 등의 제한 부재를 유지했다. 비자 자체 유효기간이 60일이라고 바꾸지 않았고, 혼인만으로 무비자 전환을 보장하지 않는다. |
| F06 | 704 사진 2년 이내, 재직증명 최근 1개월, 등록 전 입학허가와 등록 후 재학자료의 단계는 맞다. 등록 후 자료의 누적 의무로 읽히는 접속은 M01이다. 고용 증명·면제 설명은 정확한 EN 요약 범위를 유지하며, 다른 새로운 서류 세트를 요구하지 않는다. |
| F07–08 | 704 해외문서 인증은 “zahtijeva”, 중국어 번역은 “može zatražiti”로 의무와 가능성을 구분한다. 건강·범죄증명은 범주별이다. 대만 거주 AND 호적등록 국민의 배우자 최초 신청에서 동행·대만 혼인등록과 “najdulje godinu dana”를 확인했다. EN의 간략한 고정 1년 표현보다 KO/ZH·거류 규칙12조의 최장 1년을 정확히 따랐다. |
| F09–10 | NT$1.000/년과 1년 미만의 1년분, 해당 경로 추가 NT$2.200, 僑生 지위의 절반 요금, 재발급 NT$500이 구별된다. 영어 범주명을 병기한 僑生을 대만 출신 학생으로 바꾸지 않았다. 통상 최장 3년, 전문 업무에 고용되고 NIA 거류승인을 받은 특정전문인재와 법정 승인 가족의 최장 5년 및 승인 다음 날 기산, Gold Card 1–3년을 구분한다. |
| F11–12 | 704 일반 심사 10근무일은 반환·보완·면담 제외 및 보완 뒤 재계산이다. 학생 심사 5근무일과 승인일부터 납부 5근무일은 별도다. IC는 납부 3근무일 후 선택한 NIA센터·인쇄한 납부 영수증으로 수령한다. 전자 ARC는 6개월 이하·납부 후 내려받아 인쇄하는 경우다. 학생 일정을 전체 신청자에게 확대하지 않는다. |
| F13 | 705 정규 학생의 해외 공관 경로와 적격 유학 목적 방문비자의 직접 경로를 구분한다. 일반 학생 경로의 무비자·도착비자·다른 목적 방문비자 제한을 유지했다. 어학은 적절한 방문비자·인정 대학 부설센터·4개월 완료·최소 3개월 추가등록, 월–금 주15시간과 승인휴가 포함 결석 1/4 이하 조건이다. 706 어학 연장은 1회 최장6개월·체류와 거류 합계 원칙2년이며 정규 학위 전체의 상한이 아니다. |
| F14 | 705 Art48의 대만 호적국민 배우자+거류승인 면제와 외국 전문인재의 배우자를 구분한다. Art15는 특정 OR 고급 전문인재 배우자가 NIA 가족거류승인 뒤 직접 MOL에 신청하고 허가가 거류기간을 넘지 않는 경로다. 학생 Art50의 주20시간 예외는 여름·겨울 방학이며 일반 휴가 전체가 아니다. |
| F15–16 | 706 표·FAQ의 일반 연장은 만료 전 3개월 동안이다. 주소/근무장소는 변경 다음 날30일, Art23-1 사유변경은 사건일부터30일이다. 그 밖은 사건일부터15일 이내 BOCA/지소에 비자를 신청한 뒤 NIA 절차이며, 15일 안에 비자를 발급받아야 한다고 쓰지 않았다. 신고기관을 선택제로 바꾸지 않는다. |
| F17 | 706의 계속 사업 창업가4개월, 사업 종료 후 별도 경로3개월, Gold Card 자체 갱신4개월이 모두 만료 전 신청기간으로 읽힌다. “tijekom četiriju mjeseci”와 “razdoblje od triju mjeseci prije isteka”를 확인했다. 정확히 만료3개월 전 하루만 신청할 수 있다는 표현이 아니다. |
| F18–19 | 706 Art31의 “NIA mora ukinuti”와 예외의 “može dopustiti”를 구분한다. DV 때문에 이혼한 대만 거주·호적등록 국민의 외국인 배우자와 미재혼, 대만 호적의 미성년 자녀 관련 개별 요건, 노동소송/산재치료 진행 중이 남아 있다. 초과거류는 30일 미만 AND 원래 사유 존속 AND 처벌 후 재신청 가능이며, 영주거류 계산에서 1년 공제도 있다. |
| F20–21 | 706 Art17은 적격 전문인재·규정상 승인 가족, 만료 전 신청·승인 조건, 종전 ARC/Gold Card 만료 다음 날6개월, 추가1회·최장1년이다. 졸업생의 별도 경로는 만료 전 신청·승인 시 종전 만료 다음 날1년+1회·최장2년이다. 어학 종료만으로 적용하지 않는다. Art12 근로면제는 대만 전문학사 이상·당해 졸업생 지위·NIA 승인 연장기간으로 제한되며 졸업장만으로 자동 허가하지 않는다. |
| F22 | 706 출국 전 재입국허가, 일반 허가의 ARC 유효기간 연동·카드말소 시 종료, 유효 여권 AND APRC를 가진 영주거류 허가자의 예외가 있다. “veže ... uz valjanost ARC-a”는 정확한 간결 설명이므로 상한을 다시 자세히 풀어 쓰지 않았다는 이유로 반려하지 않는다. 영수증·카드사진·해외 재발급은 탑승·재입국 보장이 아니다. |
| F23 | 706은 지정 전문인재·가족 온라인 절차에 한정해 출국 시 “prestaje njegovo razmatranje”로 심사 종료 효과를 남긴다. 재입국 뒤에는 “može ... ako osoba ispunjava uvjete”로 가능성 AND 자격을 유지한다. 출처 목록은 공식 주의사항9항이다. 일반 ARC 전체의 출국금지 또는 재신청 의무로 확대하지 않는다. |
| F24 | 704 일반0902 보완은 통지 다음 날부터15일, 자료를 해외·중국대륙·홍콩·마카오에서 받아야 하면3개월이다. 15근무일·15일+3개월·신청자 해외 체류만으로 연장이라고 쓰지 않았다. 기한 내 불완전 보완도 기각이며 일반 심사10근무일 재계산도 남아 있다. |

F04·F20·F21·배우자 근로허가 조건은 [현행 인재법 공식 영문](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295)의 12·15·16·17조를 이번 HR 검수에서도 직접 열어 대조했다. F06·F24는 위 NIA 중문0902를 직접 열었다. 나머지는 같은 계속 세션에서 읽은 공식 원문·정본9개·검증표를 이용했다. 모든 링크를 매 검수마다 새 네트워크 요청으로 다시 열었다거나 10월16일 이후 관보를 전수 조사했다고 주장하지 않는다.

FAQ는 각3개다. 704의 기산·요금·근로, 705의 직접신청·어학·가족, 706의 연장창구·주소변경·재입국 범위가 본문과 대응한다. FAQ를 모든 법정 세부를 반복하는 체크리스트로 확장하지 않아도 요약은 정확하다. 크로아티아어 독자를 크로아티아 국적으로 단정한 문장이나 크로아티아 법으로 대체한 절차는 없다.

## 최근 HR 세 편·실질 결말·§5

R의 최근 HR888·889·890을 전문으로 읽었다.

| 비교 원고 | SHA256 | 실제 도입·전개·결말 비교 |
|---|---|---|
| 888-croatian-buyer-taiwan-defective-machine-evidence.md | 33f306395f3e1339a6f9407b3cf69123406979bd25ebad7cb80f35cdd9cca890 | 결함 부품 반환이 직접 증거 접근을 줄이는 결과로 시작하며 검사·판매자 통지·구제기한을 지나 반환 전 상태기록으로 끝난다. 새706도 결과형이지만 카드 만료보다 거류 사유가 먼저 끝나는 실제 법적 문제이며 사례 치환은 아니다. |
| 889-croatian-professionals-taiwan-work-permit-residence.md | e71d77c4698e49ed74ed86261adbb5b2762c7f970e190b81ca274ba21d524824 | 크로아티아 여권의90일 조건에서 실제 직무·Gold Card·ARC·가족으로 이어지고 첫 근무일과 허가를 연결한다. 새704–706은 그 국적별 무비자·Working Holiday 자격을 복사하지 않는다. |
| 890-croatian-traveler-taiwan-accident-return-home.md | 15b8a385f1791c0aae6a0119409dd25c75bf5074e6fcada86a9f6919fa5cc79e | 경찰 자료가 아직 안 나온 상태의 귀국 후 사건 진행 질문이다. 두 나라 치료·시효·위임으로 전개하고 대만 최초 진료기록의 후속 의미로 끝난다. 새705의 질문은 이미 무비자 입국한 사람의 거류 경로로 한정된다. |

1. §5-1: 설치 알림 후 공유 경로의 실제 hr 검사에서 모두 FAIL0. 아래 수치와 실제 경계 관찰을 함께 기록한다. 구형 경계의 일찍 나온 PASS는 최종 근거로 쓰지 않았다.
2. §5-2: 704는 대만 국내 비자 발급과30일 기산 사실,705는 이미 무비자 입국한 독자의 질문,706은 직장 종료가 카드 만료보다 먼저 발생하는 결과로 시작한다. 범용 예고형·정형 가상사례·꾸며낸 경험 도입은 없다.
3. §5-3: 704 “Izvornici se vraćaju nakon provjere.”와 “O trajanju odlučuje NIA.”,705 “NIA zasebno odlučuje o boravku.”와 “ARC se izdaje nakon odobrenja.”,706 “Svaki datum ima svoj dokaz.”와 “Zamjena ne produljuje boravak.”를 확인했다. 긴 조건문은 다음 단문과 길이를 달리한다. 기산·자격을 덜어 짧게 만들 필요가 없다.
4. §5-4: 서술 문단 첫 단어를 직접 세로로 읽었다. 최대 반복은 각2회이며, 같은 시작의 연속 문장은704 1회·705/706 0회다. 표·문서 불릿·공식 출처 목록을 서술 문단으로 부풀리지 않았다.
5. §5-5: 세 문단 연속 주장→조문→다만 구조는 발견하지 못했다. 704 접수기록,705 개별 비자/직접신청의 전개,706 서로 다른 사건일을 증명서에 연결하는 문단에는 독립 실무 설명이 있다. 법률 주장의 인용은 가까이 보존되어 있다.
6. §5-6: 기계의 대비0은 표면 탐지값이다. 실제 부정문도 읽어 법정 범위와 허구의 반박을 구분했다. 무제한 근로·부모/성년자녀 범위·자동연장·영수증의 입국 보장에 대한 한정은 실질 조건이다. 같은 요금 경고의 반복은 선택 S01로 남긴다.705 본문 질문은1개,704/706은 각각 날짜표와 사건별 절차가 질문 기능을 하므로 억지 질문을 추가하지 않는다.
7. §5-7: 필수 확인일·적용범위 고지 직전 실질 결말은704 “Sljedeći rok za prijavu može nastupiti prije datuma otisnutog na novoj iskaznici.”,705 “U novoj dokumentaciji mora biti vidljiv razlog zbog kojeg se boravak nastavlja.”,706 “Za planirani povratak odlučujuće su isprave koje će tada stvarno biti dostupne i valjane.”다. 다음 신고·계속거류 증명·실제 귀환문서에 연결된다. 고지 자체의 구조적 반복을 판촉 결말로 오인하지 않았다.
8. §5-8: 표준 크로아티아어 설명체이며 putovnica, tjedno, visoko učilište, zahtjev 등의 표현과 법적 주체가 일관된다. KO/JA 경어 검사 항목은 해당하지 않는다. 굵은 강조·본문 H1·꾸며낸 1인칭·개인 식별정보·명령형 체크리스트 제목은 없다.706 이메일 안내는1회이고 크로아티아어 상담·통역을 약속하지 않는다. 사람 원어민 문체 보증은 아니다.
9. §5-9: 이 검수에서 원고를 수정하지 않았다. 숫자·기산일·단위·may/must·AND/OR·출처·가상 이미지 캡션을 수동으로 대조했고 M01의 접속 관계만 필수 수정이다. 후속 수정 뒤에는 새 SHA에 대한 관련 검사와 의미 확인이 필요하다.

## 공유 검사와 실제 문장 경계

2026-10-25 23:03 KST, 다음 명령을 704·705·706 각각에 실제 실행했다.

    python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <위 표의 절대경로> --lang hr

| 원고 | 문장 | 평균 단어 | CV | 짧은 문장 | 유사길이3연속 | 최대 같은 문단 첫 단어 | 같은 시작 연속 | 문장 끝 괄호 인용 | 인용 문단 | 대비/질문 | 결과 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| 704 | 59 | 14.3 | .539 | .220 | .018 | 2 | 1 | 0 | .316 | 0 / 0 | exit0 / FAIL0 |
| 705 | 67 | 14.5 | .528 | .239 | .046 | 2 | 0 | 0 | .478 | 0 / 1 | exit0 / FAIL0 |
| 706 | 81 | 14.8 | .486 | .247 | .089 | 2 | 0 | 0 | .481 | 0 / 0 | exit0 / FAIL0 |

실제 실행 도구 SHA256:

- variety_metrics.py: 69ceb7202a6e716ba1666ec08f4757daea8bc43289448dcffa8446c830ecd6fb
- variety_expansion.py: f52177c31d0d0d161d78f5b578ede8e6213dc090b116d6ca7dfaf2115e1c49f9
- profiles/hr.json: d139e9980abbcfc79177de7d87b0269d2e837f990e08691ba93fee35894cde71
- batch03/tooling/variety-fix/root-installation.json: 97a8c4d5c29e67b4926e12c77d40041cbf39acc47367d974a8c25cc96b698671

설치 기록은 root의42 unittest 통과와36개 파일 identity 검증을 기록한다. 본 검수자는 이 전체 시험을 다시 실행하지 않았고 세 원고의 실제 CLI·metrics·추출문장을 독립 확인했다. 정상 서수 점을 없애거나 다른 언어 profile로 위장하지 않았다.

구체적으로 704 “Članak 22. Zakona … nalaže podnošenje zahtjeva.”, “člancima 43. i 48. Zakona …”,705 “Prema članku 16. stavku 2. posebnog zakona …”는 한 문장 안에 유지된다.704 “24. listopada 2026. i dopunsku … 25. listopada.”도 연도 뒤에서 잘못 갈라지지 않는다. 반대로706 “... registraciju iz članka 31.” 다음 “Potvrda predaje …”, “... iz članka 23-1.” 다음 “Datum na postojećoj iskaznici …”는 실제 별도 문장으로 나온다. NT$1.000/2.200 천 단위도 분리되지 않았다. 이 한정된 경계 확인이 크로아티아어의 모든 모호한 경계를 해결한다는 뜻은 아니다.

## 메타데이터·출처·현지화 검사와 한계

Node v24.14.1과 R의 gray-matter로 현재 세 파일을 읽기 전용 파싱했다. audience는 hr, 내부 author는 legal-ai-assistant, topic은 visa, 날짜는 모두2026-10-25, 표시 날짜는25. listopada 2026., 읽기시간은6/6/7 min čitanja, FAQ는 각3개다. 제목·SEO 제목·요약·분류·FAQ·이미지 대체텍스트·가상 캡션은 HR이며, 태그의 영문 slug는 분류 토큰으로 남아 있다. 실제 카드·FAQ·JSON-LD·피드 렌더링의 모든 문자열을 검사한 것은 아니다.

각 공식 URL의 집합은704 12개·705 15개·706 15개다. EN 정본 공식 URL의 정확한 문자열 누락은 모두0, 본문 공식 URL의 말미 목록 누락도 모두0이다. 쿼리 순서를 바꿔 같은 법조문을 다른 링크로 만들지 않았다. F23의 주의9항과 F24의 중문0902가 해당 본문과 목록에 있다. 숫자 표기 NT$1.000/2.200/500은 대만달러이며 크로아티아 통화로 바뀌지 않았다.

원본 v2 이미지 경로가 EN과 같고 R/public 아래 파일이 존재한다. 캡션 “Izmišljena scena”를 유지했다. 실제 이미지의 새 시각 감정 또는 공개 렌더링 재검사는 하지 않았다. HR 상호 링크는 batch03의 실제 세 slug에, 영어 배우자·Gold Card·APRC 링크는 R의028·027·029 파일에 각각 대응한다. 영어 연결에는 na engleskom 표시가 있다. 파일 존재 확인은 공개 HTTP200이나 배포 완료를 뜻하지 않는다.

남은 작업은 M01 수정 후 새 SHA의 재검사·의미 재확인 및 root의 게시일/렌더링/빌드/배포 판단이다. 현재 판정에서 수치 PASS와 법률·언어 검토를 분리한다. 704의 M01이 해결되기 전 세 편 전체를 최종 의미 승인으로 표기하지 않는다.

## R2 추가 확인 — M01 해결

2026-10-25 KST, 작성자의 최소 수정 뒤 재확인했다. 위 R1 본문은 수정하지 않고 이 항목만 덧붙였다. 추가 전 R1 보고서 SHA256은 f7cb070083f765ca9193b33eae804db58be19a14ca3f4f377a4034ca16abbb09다.

704의 실제 수정 문장은 “Nakon upisa potrebna je potvrda o studiranju izdana unutar posljednjih mjesec dana.”다. 등록 전 입학허가 문장과 등록 후 최근1개월 재학자료, NIA 출처를 유지하고 누적 제출로 읽히는 uz 이하만 삭제했다. 수정된 문자열에 원래 uz 구절을 복원했을 때 전체 파일 SHA가 R1의985ebae4…와 정확히 같음을 확인했다. 따라서 메타데이터·FAQ·출처·기타 문장을 함께 바꾼 수정이 아니다. 705·706의 SHA도 R1과 같다.

| 원고 | R2 SHA256 | 필수 상태 |
|---|---|---|
| 704 | f5ae1cb6a378e2c5c6fe7f1cb3137e00bd0bad50da39c3bbea21669a6f72cee3 | M01 해결 |
| 705 | 86086af13bf8b01280ff46115efb94d461efad6afea70370a17d57f27dff292c | 불변, 미해결 필수0 |
| 706 | b339966a41c6902cd86c6c2d066a2a692bf30fd2e4ad8f2d555d8ef96d462f93 | 불변, 미해결 필수0 |

같은 공유 절대경로에 --lang hr를 명시해 세 편을 다시 직접 실행했다. exit0/FAIL0, 문장59/67/81, CV .539/.528/.486으로 R1의 정상 경계 측정과 같다. 바뀐 문장은 불릿이어서 서술 본문 길이 통계에 포함되지 않는다. 통계가 같다는 사실을 의미 검토의 대용으로 삼지 않고 수정 문장을 따로 읽었다. 범용 기한·요금·법적 자격을 삭제해 통과한 수정도 아니다.

작성자 최신 기록 2ca328ef7fdc599c0aadfa05d712b6559bb6fa492623a2991141a207787e8a76의 M01 수용·수정표·실행 결과를 읽었다. 선택 S01은 독립적으로 읽는 두 안내와 EN의 승인 범위 한정을 유지한다는 이유로 남겼다. 원래 필수 반려가 아니었고 이 판단을 수용한다. R2의 미해결 필수는0이며, 결론의 범위는 위 세 파일의 의미·출처·문체 대조다. 렌더링·게시일·빌드·배포·공개 확인과 사람 원어민/법률 승인은 이 추가 확인에 포함되지 않는다.
