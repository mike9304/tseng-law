# HR 704–706 작성자 검수 기록

작성·수동 대조: 2026-10-25 KST. 역할은 AI 작성자 자기검수다. 사람 원어민·대만 변호사의 승인이나 게시 승인이 아니다. 현재 상태는 `AUTHOR_REVIEWED / SHARED_FAIL_0 / INDEPENDENT_R2_REQUIRED_FINDINGS_RESOLVED`다. 최초 공유 검사기의 `hr` 미지원, 전용 profile 설치 뒤 발견한 조문·연도 경계 과분리, 그 후 공유 보완본 설치와 정상 경계 재측정의 순서를 아래에 남겼다. 독립 검수 M01을 최소 수정한 현재 원고도 공유 검사 세 편 모두 FAIL 0이며 독립 검수자가 미해결 필수 0건을 확인했다. 새 SHA와 실제 수정은 말미에 기록했다.

소유 원고는 batch03의 `src/content/columns-hr/704-taiwan-arc-first-application.md`, `705-taiwan-visa-residence-work-study-family.md`, `706-taiwan-arc-renewal-changes-reentry.md`뿐이다. 릴리즈 R(`/Users/son7/Projects/tseng-law-all-locales-20261025`)에는 쓰지 않았다. 커밋·push·배포·외부 모델 전송·공유 도구 변경을 하지 않았다. 게시 메타데이터는 모두 2026-10-25이며, 날짜가 바뀐 뒤 게시한다면 root와 조정해야 한다.

## 현재 원고와 읽은 기준

| 원고 | 현재 SHA256 |
|---|---|
| 704 | `f5ae1cb6a378e2c5c6fe7f1cb3137e00bd0bad50da39c3bbea21669a6f72cee3` |
| 705 | `86086af13bf8b01280ff46115efb94d461efad6afea70370a17d57f27dff292c` |
| 706 | `b339966a41c6902cd86c6c2d066a2a692bf30fd2e4ad8f2d555d8ef96d462f93` |

현재 batch03 BRIEF와 최근 HR 세 편은 이번 배정에서 전문을 읽었다. 아래 정본 9개·법률표·규칙도 같은 계속 세션에서 전문을 읽었으며, HR 작업 시작과 이번 작성자 대조 말미에 정본 해시가 동일함을 확인했다. 숫자 접두어가 같은 다른 주제를 정본으로 택하지 않았다. 비교 기준 commit은 `ef3b24e73d84968eea08ea9d58e991ccbbf83fa8`이다. 긴 KO/ZH와 짧은 EN의 세부가 같다고 주장하지 않는다.

| R 정본 | 704 SHA256 | 705 SHA256 | 706 SHA256 |
|---|---|---|---|
| `src/content/columns-en/` | `610343da1255e2e873956c6de54bd0f9c72c6731aae9343bd7bae9884efdd39f` | `87a4ab6e9a5e8b434a30de0dc111307fc58e878a7534cef793e2a3e27be38304` | `1ecf6acc92d181afb2820bb001d4e4d45cc4eeca823d2e32def25faebe119d71` |
| `src/content/columns/` | `cbf6b07b2d41c3b136ceac099f8d32152ca125c18478321610ffa715c29476a1` | `727377648fcc7e2bd1d8ea8202bea5fb69f01174ce51a0ee422891126011d54a` | `4cd612086336cb1a3720111390ce7aca3f4eff5c7f96c5e92aea001fa7b8cfbc` |
| `src/content/columns-zh/` | `0c00bc06bf3c3c1860a95af4dbcea9eaab981300860916856295e8b947244468` | `290a50047632ad830ea98c524ffef6ed91c2b4c8d555a1844689824c3ffea7a3` | `4d70e78b9a197f4a2b81d25d61b6fa862ee849a6392d5fd905e90bcf781e721c` |

| 기준 | SHA256 |
|---|---|
| batch03 `BRIEF.md` | `076a5bd7220bead942bf9dcf4c649180c8036b85d5c019775f1aad1a42eb3c7e` |
| batch02 `BRIEF.md` | `104c4c4df457e5627b6970599661be78182d7101cbb9090df549670501846105` |
| R `AGENTS.md` | `fde1152de13f36b3d5703c1e7fa3f3eae7c5b43632d090c528dd8e5d6a856e19` |
| R `docs/audit/all-locales-parity-20261025/BRIEF.md` | `a8546e8a19f911b16c07f29ff874fb4ad70bb04d087a16354ad2adc8a57246f7` |
| R `docs/audit/all-locales-parity-20261025/research/arc-source-facts.md` | `4776f60010172120e0812d8d552123aeb5c7cc0b467cb5306ca031a1e17c2145` |
| R `docs/audit/codex-column-recheck-20261024/research/source-refresh.md` | `a33d5bd1439879bc7461755c3b6793f4942ec161454032dcb8cde1c4d52a6983` |
| R `docs/columns/EDITORIAL-VOICE.md` | `8b4e39550d9f9ff32b861270bad83a51a69fd71893046a54e7ffdaced9727ea3` |
| R `docs/columns/FRONTMATTER.md` | `7a2590f33ba49c55f539f1fade51fed1290808352b16247445a714333593a364` |
| `~/tseng-col-0930-work/COLUMN-VOICE-RULE.md` | `8d2eb1f73aeb0967350b8be90aafccfc678224f31cbbf930407462fce65b291d` |
| `~/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md` | `befec7538792d2a98f8c596911667005e2a4000efc078b01db9793c88366edd5` |
| `~/tseng-lanes-shared/LESSONS.md` | `ee0e37da8ffc0a50ba5fb6c6a07c1d67c379538b2e8367b2fa244450d284ca18` |

홈에서 지정한 `~/agent-library/knowledge/editorial-voice.md`는 현재 파일이 없다. 읽었다고 주장하지 않으며, 사용 가능한 R의 문체 정본과 COLUMN-VOICE-RULE·공유 다양성 규칙·LESSONS를 적용했다. 폐기된 Fable 고정 승인 절차를 새 요구로 부활시키지 않았다.

## 법률 의미·FAQ 대조

| 사실표 | HR에 남긴 조건과 대조 결과 |
|---|---|
| F01–02 | 거류허가 전제의 입국은 입국 다음 날부터30일, 입국 후 대만 안에서 발급된 거류비자는 발급일부터30일이다. 704 도입·표·FAQ에서 기산을 구분한다. Art22 의무와 ARC 기능이 있는 유효 통합증명 예외를 함께 썼다. 무비자 방문자 모두에게 새30일을 부여하지 않는다. |
| F03 | 적격 전문인재의 허가 OR 적용 가능한 면제, 전문 업무, 허용된 입국 방식, NIA의 별도 거류승인 뒤 ARC 발급을 유지했다. 채용제안과 실제 근로권을 합치지 않았다. 0915의 시범 무비자·도착비자·일부 TAC·ABTC·Working Holiday 제외와 다른 규정상 예외를 명시했다. |
| F04 | `status stranog stručnjaka koji na Tajvanu obavlja stručni rad ili status stranog stručnjaka s posebnim kvalifikacijama`로 두 범주를 OR로 연결했다. 다음 문장 `U oba slučaja NIA mu mora prethodno odobriti boravak ili stalni boravak.`는 공통 승인 조건이다. 전문 업무 수식을 특정전문인재 범주까지 넓히지 않았다. 배우자·미성년 자녀·신체/정신 장애로 자신을 돌볼 수 없는 성년 자녀와 적격 가족의 입국 방식이 남아 있다. 자립불능을 무소득으로 바꾸지 않았다. |
| F05 | 60일 이상은 방문비자의 허용 체류기간이다. 비자 자체 유효기간60일로 쓰지 않았다. 유효 비자, 연장금지 등의 제한 부재, 대만 국민 배우자의 대만 거주 AND 호적등록을 보존했다. 혼인이나 ARC 소지만으로 모든 가족의 전환을 보장하지 않는다. |
| F06–08 | 사진은2년 이내, 재직·재학 증명은 해당 단계의 최근1개월 자료다. 입학허가와 등록 후 재학증명을 구분했다. 해외문서 인증은 의무, 적절한 중국어 번역은 NIA가 요구할 수 있음이다. 첫 대만 국민 배우자 신청의 동행·대만 혼인등록과 최장1년을 해당 거주·호적등록 배우자에 한정했다. 모든 외국인 배우자에게1년을 적용하지 않는다. |
| F09–10 | NT$1.000/승인1년,1년 미만도1년분, 해당 경로의 추가NT$2.200, 僑生 지위의 절반 요금, 일반 재발급NT$500을 구분했다. 일반최장3년과 전문 업무에 고용되고 NIA 거류승인을 받은 특정전문인재·규정상 승인 가족의 최장5년, NIA 거류승인 다음 날 기산을 보존했다. 금카드는705에서1–3년이다. |
| F11–12 | 학생 심사5근무일과 승인일부터 납부5근무일은 별개다. IC 수령은 납부3근무일 후, 인쇄한 온라인 영수증과 선택한 NIA센터가 필요하다. 유효6개월 이하 전자ARC는 납부 후 내려받아 인쇄한다. 일반10근무일의 반환·보완·면담 제외, 보완 뒤 재계산과 학생 심사의 보완 제외·재계산도 구분했다. 학생 일정을 모든 신청자에게 적용하지 않는다. |
| F13 | 정규유학의 해외 공관 경로와 특정 유학 목적 방문비자의 적격 직접 경로를 나눴다. 무비자·도착비자·다른 목적 방문비자는 일반 학생 경로의 전환을 보장하지 않는다. 어학은 인정 대학 부설센터·적절한 비자·4개월 이수·최소3개월 추가등록·평일주15시간·허가휴가 포함 결석1/4이하를 유지했다. |
| F14 | 실제 직무·고용주에 맞는 허가 OR 면제를 구별했다. Art48의 대만 호적국민 배우자+거류승인 면제와 외국 전문인재 배우자를 합치지 않았다. Art15 특정·고급 전문인재 배우자의 NIA 가족거류승인 뒤 직접 MOL 허가신청, 거류기간 이내 허가를 유지했다. 학생 주20시간 예외는 여름·겨울 방학만이며, 일반 휴가 전체로 넓히지 않았다. |
| F15–17 | 일반 연장창구는 만료 전3개월 안이다. 주소/근무장소는 변경 다음 날30일, Art23-1 사유변경은 사건일30일, 그 밖은 사건일15일 내 BOCA/지소에 비자를 신청한 뒤 NIA 절차다.15일 안에 비자를 발급받아야 한다고 쓰지 않았다. 사업지속 창업가4개월, 그 사업종료 뒤 별도경로3개월, 금카드 자체갱신4개월을 각각 만료 전 신청창구로 썼다. |
| F18–19 | 사유소멸 시 NIA의 허가폐지·카드말소는 의무, 예외적 계속거류는 재량이다. DV로 이혼한 대만 거주·호적국민의 외국인 배우자와 미재혼 조건, 자녀의 미성년·호적 등 조건, 소송/치료 진행 중을 유지했다. 초과거류는30일 미만 AND 사유존속 AND 처벌 후 재신청 가능, 영주거류 계산1년 공제를 보존했다. |
| F20–21 | 적격 전문인재·규정상 가족의 Art17은 만료 전 신청, 승인 시 종전 ARC/Gold Card 만료 다음 날6개월, 추가1회·합계최장1년이다. 적격 졸업생 Art11은1년+1회·합계최장2년으로 별도이며 단순 어학종료는 부족하다. Art12 근로면제는 대만 전문학사 이상 학위와 당해 졸업생 지위의 NIA 연장거류승인 및 그 승인기간에 한정된다. |
| F22 | 출국 전 재입국허가, ARC 유효기간 연동, 카드말소 시 함께 종료, 유효 여권 AND APRC를 가진 영주거류 승인자의 예외를 썼다. 접수증·카드사진·해외 재발급 가능성을 탑승/입국 보장으로 만들지 않았다. |
| F23 | 706의 지정 전문인재·가족 온라인 절차에만 `odlaskom podnositelja ... prestaje njegovo razmatranje`라는 필수 심사종료 효과를 썼다. 재입국 뒤 `može ... ako ... ispunjava uvjete`로 가능성과 적격조건을 보존했다. 해당 공식 URL이 본문과 말미 모두 있다. 일반적인 모든 ARC 출국금지나 단순 심사 지연 가능성으로 바꾸지 않았다. |
| F24 | 704 일반0902 보완은 통지 다음 날부터15일이다. 부족/부정확한 문서를 해외·중국대륙·홍콩·마카오에서 받아야 하면3개월이며, 신청자 소재지만으로 늘어나지 않는다.15근무일 또는15일+3개월로 쓰지 않았다. 기한 내 불완전 보완도 거부되며 보완 뒤10근무일 재계산을 남겼다. |

세 편의 제목·요약·각3개 FAQ를 본문과 다시 읽었다. 704는 첫 신청/비용/근로,705는 직접 경로/어학/가족,706은 연장/변경/재입국의 EN 실용 범위와 대응한다. FAQ에서 본문의 적격 조건을 반대로 단정하거나 특정 절차를 모든 신청자에게 확대하는 문장은 발견하지 못했다. F04의 모든 가족 세부를 FAQ에 반복하지는 않는다. 원문에 없는 선택 세부를 모두 추가해야 한다고 판단하지 않았고 Art53의 전 고용종료 증명 세부도 추가 고용 전체에 요구하지 않았다.

크로아티아어 독자를 크로아티아 국민으로 가정하지 않았다. 크로아티아 국내법·영사업무·무비자/Working Holiday 자격을 새로 넣지 않는다. 필요한 영어 법정 범주 이름은 그대로 병기해 특정·고급 전문인재를 임의로 합치지 않았다. 표준 크로아티아어의 `putovnica`, `tjedno`, `visoko učilište`, `zahtjev`, `tajvanski`를 썼으며 다른 언어 원고를 표지명만 바꿔 재사용하지 않았다.

## 실제 문장 수정

| 실제 초안 문장/표현 | 문제 | 반영한 수정 | 의미 보존 |
|---|---|---|---|
| 704 `Za studij se prije registracije prilaže potvrda o upisu odnosno primitku na studij. Nakon registracije...` | 입학허가와 실제 등록 단계가 어휘상 뒤섞임. | `Prije upisa na visoko učilište prilaže se potvrda o prihvatu na studij. Nakon upisa...` | 등록 전 허가와 등록 후 최근1개월 재학자료·학기등록/학생증 구분을 유지. |
| 704 `Zaposleni strani stručnjak s posebnim kvalifikacijama ... kojemu je NIA odobrila boravak...` | 고용이 전문 업무인지 연결이 약함. | `...zaposlen za stručni rad i s NIA-inim odobrenjem boravka...` | 전문 업무 고용·NIA 거류승인·그 다음 날부터최장5년을 명시. |
| 704 `Za redovni zahtjev [NIA navodi ...]` | MONOTONY: 문단 시작 — 세 번째 `Za` — 담당기관을 주어로 이동. | `[NIA za redovni zahtjev navodi deset radnih dana obrade]...` | 일반 심사10근무일·제외·보완 뒤 재계산과 URL 유지. |
| 704 소제목 `Datum na vizi i zapis ulaska` | `zapis ulaska`가 직역투로 읽힘. | `Datum na vizi i evidencija ulaska` | 비자 발급일과 입국 기록이라는 실제 대조 대상 유지. |
| 704 `Izuzeće od jednog priloga ne rješava drugi.` | 앞선 건강·범죄자료의 개별 적용 설명 뒤 추상적 경고를 덧붙임. | 해당 문장 삭제. | 건강/범죄증명은 신청범주·입국 방식에 달린다는 구체 조건을 유지. |
| 705 F04 `...predviđa dva položaja člana obitelji na Tajvanu: običan strani stručnjak...` | 법적 지위를 일상어 `običan`과 두 위치라는 표현으로 설명해 어색함. | `osnova ... može biti status stranog stručnjaka koji ... ili status ... . U oba slučaja...` | 두 범주 OR와 공통 NIA 승인 AND를 더 명확히 함. |
| 705 `Dokument izdan u jednoj državi ne treba automatski pripremati prema pravilima za drugu.` | 구체 신청요건 없이 반복되는 훈계. | 삭제하고 국적·여권·계획과 관할 공관의 문서 요구를 남김. | 국적마다 동일하다고 단정하지 않으며 인증·공관 확인은 보존. |
| 705 `Upis i pravo boravka zasebna su pitanja.` / `Dokaz upisa mora odgovarati nastavku učenja.` | 이미 설명한 기관/입학 분리와 계속학습 조건을 추상적으로 반복. | 두 문장 삭제. | NIA의 거류결정,4개월+최소3개월 및 관련 증거를 그대로 둠. |
| 705 `Put vrijedi samo ...; svaki kratki posjet ne može se pretvoriti...` | 경로가 유효하다는 직역과 광범위한 부정문이 이어짐. | `Izravni zahtjev dopušten je samo pod uvjetima odgovarajuće kategorije.` | 무조건 전환권을 부정하는 범주 제한을 긍정형 조건문으로 보존. |
| 705 `Strani redovni student` / `za drugi cilj` | 외국인 학생의 정규 과정과 방문 목적의 결합이 부자연스러움. | `Strani student na redovnom studiju` / `za drugu svrhu` | 정규유학과 다른 목적 방문비자 제외 유지. |
| 705 `Kod mandarinskog redoslijed počinje ...` / `nastava mora imati...` | 어학 절차의 주체와 교육시간 표현이 어색함. | `Polaznici mandarinskog u pravilu prije dolaska pribavljaju...` / `nastava mora obuhvaćati...` | 원칙적 입국 전 비자 준비, 인정기관4+최소3개월·주15시간을 보존. |
| 706 제목 `ARC nakon promjene posla, selidbe i putovanja iz Tajvana` | 연장·재입국이라는 중심 주제가 제목에서 흐림. | `Produljenje ARC-a, nova adresa i povratak na Tajvan` | 본문의 연장·변경·여행 범위를 직접 표시. |
| 706 `Za promjenu ili dodatnog poslodavca...` | 변경과 추가 고용을 같은 문법 형태로 연결하지 못함. | `Pri promjeni poslodavca ili dodatnom zaposlenju...` | Art53의 범주별 허가/면제 구분 유지. |
| 706 `[članka 31.](URL).` / `[članka 23-1.](URL).` | 링크 문구의 서수 점과 문장 끝 점이 공개 텍스트에서 중복됨. | 링크 밖의 중복 점만 제거. | 링크 문구의 마지막 점이 문장 종결도 담당하며 조문 번호·URL·신고/사유변경 내용은 동일. |
| 706 `Za obuhvaćene osobe koje su završile studij ... predviđa drukčiji raspored: zahtjev prije isteka može, ako se odobri, donijeti godinu dana...` | MONOTONY: 문단 시작·긴 수식 — `Za` 반복과 신청·승인 조건이 한 문장에 늘어짐 — 신청 시점과 승인 효과 분리. | `Diplomanti obuhvaćeni ... podnose zahtjev prije isteka... . Odobreno produljenje traje godinu dana od dana nakon prvotnog isteka...` | 적격·만료 전 신청·승인 후 효과·만료 다음 날·1년+추가1회·최장2년 모두 유지. |

## 최근 HR 세 편 및 §5 자기 점검

R의 최근 HR 세 편(2026-10-24 게시)을 전문으로 읽고 도입·소제목·실질 결말을 비교했다.

| 기존 글 | SHA256 | 새 글과 비교 |
|---|---|---|
| 890 `croatian-traveler-taiwan-accident-return-home` | `15b8a385f1791c0aae6a0119409dd25c75bf5074e6fcada86a9f6919fa5cc79e` | 경찰 문서가 나오기 전 귀국 후 사건을 어떻게 진행할지 묻는 도입. 경찰/두 나라 치료/시효/위임·합의로 전개하고 첫 대만 의료기록의 후속 진료 효용으로 끝난다. 새705 질문은 무비자 입국 뒤 가능한 법적 경로라는 다른 사실에 한정한다. |
| 889 `croatian-professionals-taiwan-work-permit-residence` | `e71d77c4698e49ed74ed86261adbb5b2762c7f970e190b81ca274ba21d524824` | 크로아티아 국민의90일 무비자 숫자로 시작하며 실제직무/Gold Card/직접신청/가족을 다룬다. 새 글은 그 국민별 자격을 복사하지 않는다. 첫 근무일과 채용제안·허가를 잇는 기존 결론 대신 다음 변경신고·갱신자료·귀환 문서로 끝난다. |
| 888 `croatian-buyer-taiwan-defective-machine-evidence` | `33f306395f3e1339a6f9407b3cf69123406979bd25ebad7cb80f35cdd9cca890` | 결함부품을 반환하면 증거에 접근하기 어려워지는 구체 상황으로 시작하고 검사/통지/구제/6개월을 다룬다. 반환 전 부품 상태기록이라는 결론을 ARC 사례로 치환하지 않았다. |

1. 최초 공유 `--lang hr`는 미지원 exit2였다. root의 첫 설치 뒤 세 편 모두 exit0/FAIL0이었지만 조문·연도 과분리로 그 최초 수치를 유효한 최종 측정으로 삼지 않았다. 23:01:53 KST 공유 경계 보완 설치 후 같은 원고를 다시 실행해 정상 경계에서도 세 편 모두 exit0/FAIL0임을 확인했다. 다른 언어 profile로 바꾸거나 정상적인 크로아티아어 서수 점을 지워 수치를 우회하지 않았다.
2. 704는 대만 안에서 거류비자를 발급받은 사건과 발급일30일,705는 이미 무비자 입국한 사람의 절차 질문,706은 직장이 끝나도 카드 만료일이 남는 결과로 시작한다. 정형 가상사례나 범용 예고형 도입을 쓰지 않았다.
3. 짧은 문장을 직접 확인했다.704: `Izvornici se vraćaju nakon provjere.` / `O trajanju odlučuje NIA.` / `To je studentski raspored.`705: `Drugima prethodno treba odgovarajuća viza.` / `ARC se izdaje nakon odobrenja.` / `Roditelji nisu obuhvaćeni tom odredbom.`706: `Svaki datum ima svoj dokaz.` / `Zamjena ne produljuje boravak.` 긴 조건문은 해당 조건이 필요한 곳에 두었다.
4. 언어 중립 첫 단어 추출과 실제 문단 세로 읽기를 함께 했다. 서술문단의 같은 첫 단어는 현재 모두2회 이하다.704의 `Za`3회,705 F04의 `Za`3회,706 졸업생 문단의 `Za`3회를 각각 수정했다. 표·불릿·공식 출처 항목을 서술문단으로 세지 않았다. 이 보조 읽기는 HR 기계검사 PASS가 아니다.
5. 주장→조문→다만 예외의 세 문단 연속은 발견하지 못했다. 무인용 문단은704 접수번호·송부파일,705 일반 방문 경로,706 고용종료/승인/이사의 서로 다른 날짜 연결이다. 법률명제는 가까운 공식 출처에 연결되어 있다.
6. 수동으로 법적 효력의 한정과 꾸며낸 반박을 구분했다. ARC가 근로권 전부가 아니라는 점, 초과거류의 자동연장 부정, 접수증의 입국 보장 부정은 정본의 실제 조건이다. 별도 추상적 경고는 위 수정표대로 줄였다.705의 실제 본문 질문1개를 유지했고,704/706에는 날짜표·구체 사례가 있어 수치를 위한 질문을 억지로 넣지 않았다. 자동 대비틀 수치는 지원 후 별도로 기록한다.
7. 고지 직전의 실질 결말은704 `Sljedeći rok za prijavu može nastupiti prije datuma otisnutog na novoj iskaznici.`,705 새 문서에 계속거류 이유가 나타나야 한다는 문장,706 `Za planirani povratak odlučujuće su isprave koje će tada stvarno biti dostupne i valjane.`다. 필수 관할·확인일 고지와 공식 출처 목록을 실질 결말로 오인하지 않았다. 동일 판촉 결말을 복사하지 않았다.
8. 표준 크로아티아어 설명체, 구체 쟁점 소제목을 사용했다. KO/JA 경어 항목은 HR에 적용하지 않는다. 장식용 `**`, `__`, `<strong>`, `<b>`와 본문 H1은0이다. 꾸며낸1인칭·고객·자격이 없다. 원문의 이메일 안내만706에1회 두고 크로아티아어 상담 제공을 약속하지 않았다.
9. 수정 뒤 조문·기산일·달력일/근무일·개월·금액·FAQ와 URL을 재대조했다. 이미지는 정본 v2 파일이며 캡션은 `Izmišljena scena`다. 내부 `author: legal-ai-assistant`는 유지하고 공개 작성자·검수자 직함을 추가하지 않았다.

## 출처·수치·자동 구조 검사

공식 EN 원고 URL은 세 편 모두 누락0이다. 본문에서 인용한 공식 URL은 말미 목록에도 있다. 704의 추가 자료는 [BOCA 국내 발급 비자 FAQ](https://www.boca.gov.tw/fp-398-723-7b71f-1.html), [거류 규칙 영문 전문 Art12](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=D0080129), [중국어0902](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/29996/)다. 706은 [NIA 해외분실](https://www.immigration.gov.tw/5385/7229/7232/368785/), [지정 전문인재·가족 온라인 안내](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/)를 추가했다. 해당 공식 본문은 같은2026-10-25 계속 세션에서 직접 읽었다. F04 중국어16조, 취업서비스법50/53조, 거류규칙7/11/12/20조도 대조했다.

24일 source-refresh의 기존 조사와25일 보충 직접 확인을 구분했다. MOJ 정비 자료 기준일은2026-10-16이며, 그 뒤 관보 전수조사나 모든 링크의 새 네트워크 재검사를 수행했다고 주장하지 않는다. 현재 공개 고지도 이 조사 범위와 확인일을 구분한다.

숫자 토큰 차이는 의미 대조를 보조하는 자료다. 글자로 적은 수량은 자동 추출로 전부 검증할 수 없어 수동 대조를 병행했다.

- 704의 `1,000`/`2,200`→`1.000`/`2.200`은 크로아티아어 천 단위 표기로 같은 대만달러 금액이다. Art22 반복 인용은 한 번 줄었지만 조문이 사라진 것이 아니다. 추가30은 국내발급 도입/반복,12는 배우자 최장기간 조문,0902/15/19는 보완 안내/기한/안내 수정일,2026/25는 자료 확인일이다.
- 705의 추가0915/50/20/2/9는 안내번호, 학생 Art50·주20시간, Art16제2항, Gold Card Art9다.25는 확인일이다. EN 숫자 토큰의 누락은 없다.
- 706의 추가30은 여권 일반기한으로 오해하지 않도록 범위를 설명한 문장,9는 온라인 주의9항,3은 Art31제3항,12는 졸업생 근로면제 조문,25는 확인일이다. `1.000`은 같은 수수료다.

릴리즈 쓰기를 피하기 위해 임시 읽기 전용 심볼릭 링크 overlay `/var/folders/x7/w92bx9bd09l65n9hpcq81b8h0000gn/T/tseng-hr-author-20261025-9qo2nhd4/content`에서 R의49언어 기존 파일과 새HR3편을 함께 조회했다. R의 `docs/audit/all-locales-parity-20261025/tooling/content-audit.mjs`에 `auditBatch({repoRoot, contentRoot, files, sourceLocale:'en', publicationDate:'2026-10-25'})`를 실행했다. Node는 `/Users/son7/.nvm/versions/node/v24.14.1/bin/node`다.

- 704/705의 현재 SHA와706의 중복 마침표 정리 전 SHA `67e45bf164fa5041bbb03e925b89c0b17d98e989a911c481b985deb544828aa8`에 대한 `author-report.json`: `automatedStatus: PASS`, 오류0. `semanticStatus: REVIEW_REQUIRED`, `publicationReady: false`다. 실행 스크립트 자체는 exit0이며, 자동 의미승인으로 읽지 않는다. 최종 원고 고정 뒤 재실행한다.
- 2026-10-25 22:59:55 KST 같은 overlay에서 현재 세 SHA(706 `b339966a41c6902cd86c6c2d066a2a692bf30fd2e4ad8f2d555d8ef96d462f93` 포함)로 재실행했다. `final-report.json`의 SHA256은 `b988b0d53992e1204f2dcfc872b6f40d5d559d5226b42440f020734ac9399794`이며 `automatedStatus: PASS`, 오류0, `semanticStatus: REVIEW_REQUIRED`, `publicationReady: false`다. 원고는 이 재검사 중 바꾸지 않았다. HR 문장 경계의 최종 측정은 별도로 남아 있다.
- 검수 항목은704의9개,705의7개,706의8개다. 법률·숫자·국적·추가출처·표제/FAQ·공개 출력·교차언어 링크를 요구한다. 이 기록은 작성자 대조이며 독립검수와 공개 렌더링을 대신하지 않는다.
- `audience: [hr]`, 내부 저자, `topic: visa`, 각FAQ3개, HR 날짜·읽기시간6/6/7분·분류·캡션과 이미지 경로 존재를 확인했다.
- EN 내부 연결은704 배우자,705 배우자/Gold Card,706 APRC이며 모두 `na engleskom`을 표시했다. 현재 HR에 같은 주제 원고가 없는 것을 확인했고, 상호 HR 링크는 이번에 함께 준비하는 정확한 세 slug다. 공개200응답이나 배포완료를 뜻하지 않는다.

공유 명령(2026-10-25 실행)은 아래와 같다. 최초 세 파일 모두 `invalid choice: 'hr'`, exit2였고 이를 PASS로 처리하지 않았다. 22:34:51 KST root 설치 뒤 아래 명령을 실제로 다시 실행했다.

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check \
  /Users/son7/tseng-all-language-columns-20261025/batch03/src/content/columns-hr/704-taiwan-arc-first-application.md \
  /Users/son7/tseng-all-language-columns-20261025/batch03/src/content/columns-hr/705-taiwan-visa-residence-work-study-family.md \
  /Users/son7/tseng-all-language-columns-20261025/batch03/src/content/columns-hr/706-taiwan-arc-renewal-changes-reentry.md \
  --lang hr
```

설치 receipt는 batch03 `tooling/variety/root-installation.json`이다. root 기록상39 unit tests 재실행PASS, 기존1572입력 측정변화0, 중립 fixture 기반이다. 실행한 엔진 SHA는 `69ceb7202a6e716ba1666ec08f4757daea8bc43289448dcffa8446c830ecd6fb`, HR profile은 `de6b002e2dba71bc3a9f397d4e52904b9f63962dbdacdf606cf8a21cdead5ec4`다. 작성자가 이 도구를 바꾸지는 않았다.

관측 CLI는704 문장68/CV.538,705 문장83/CV.574,706 문장93/CV.562로 모두 exit0/FAIL0이었다. 그러나 추출문장을 직접 읽으면 `Članak 22.`와 `Zakona ...`, `Prema članku 16.` / `stavku 2.` / `posebnog zakona...`, `člancima 43.` / `i 48.` / `Zakona...`가 잘못 분리된다.704의 `24. listopada 2026. i dopunsku...`도 연도 뒤에서 갈라졌다. 실제 경계는 `/tmp/tseng-hr-extracted-sentences-20261025.json`에 저장했다. 이는 아주 짧은 문장 비율과 CV에 영향을 주므로 위 수치를 정상 경계에 따른 PASS로 확정하지 않는다. root와 도구 담당자에게 알렸으며 도구 검토 후 다시 측정한다.

## 공유 경계 보완 후 재검사와 독립 검수 전달

root는 2026-10-25 23:01:53 KST 경계 보완본을 공유 경로에 설치했다. `batch03/tooling/variety-fix/root-installation.json`은 root가 42 unittest를 직접 재실행해 통과했고 36개 파일의 identity를 확인했으며, 실제 변경은 경계 처리·HR/HU profile·방법 기록 네 파일에 한정된다고 기록한다. 작성자는 도구나 임계값을 수정하지 않았다. 도구 담당자에게 문제 구간을 알린 뒤 책·방·목록·날짜의 별도 중립 예문을 제공했으며, 그 사후 원고 구간 열람은 도구 감사 기록에서 선행 비열람 기록과 구별한다.

같은 공유 명령을 현재 세 원고에서 직접 실행했다. `variety_metrics.py` SHA는 앞과 같고, 변경된 `variety_expansion.py` SHA256은 `f52177c31d0d0d161d78f5b578ede8e6213dc090b116d6ca7dfaf2115e1c49f9`, 실제 `profiles/hr.json` SHA256은 `d139e9980abbcfc79177de7d87b0269d2e837f990e08691ba93fee35894cde71`이다.

| 원고 | 문장 | 평균 단어 | CV | 짧은 문장 비율 | 유사 길이3연속 | 반복 오프너 비율 | 문장 끝 괄호 인용 | 인용 문단 비율 | 대비 | 질문 | 실제 결과 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 704 | 59 | 14.3 | .539 | .220 | .018 | .105 | 0 | .316 | 0 | 0 | exit 0 / FAIL 0 |
| 705 | 67 | 14.5 | .528 | .239 | .046 | .174 | 0 | .478 | 0 | 1 | exit 0 / FAIL 0 |
| 706 | 81 | 14.8 | .486 | .247 | .089 | .111 | 0 | .481 | 0 | 0 | exit 0 / FAIL 0 |

추출문장도 직접 읽었다. `Članak 22. Zakona...`, `Prema članku 16. stavku 2. posebnog zakona...`, `člancima 43. i 48. Zakona...`, `24. listopada 2026. i dopunsku...`는 각각 정상 문장 안에 유지된다. 706에서 문장 끝에 오는 `članka 31.` 다음의 `Potvrda...`, `članka 23-1.` 다음의 `Datum...`는 새 문장으로 남는다. 검사값을 올리기 위해 원고의 조문·연도 표기를 바꾸지 않았다.

재측정 추출물은 `/tmp/tseng-hr-final-boundaries-20261025.json`, SHA256 `5cdac0c5129981e12f30dfe8f09fca28834f42d8eaa7d754c27c847b2aafb2ca`다. 한정된 표기 휴리스틱이 크로아티아어의 모든 경계 모호성을 해결하는 것은 아니며, 위 현재 원고의 문제 구간과 실제 종결을 확인한 것이다. 23:02 KST 위 세 원고 SHA가 바뀌지 않았음을 확인하고 `column_existing_drafts`에게 공유했다. 독립 검수자는 `reviews/hr-independent.md`만 소유한다.

## 독립 검수 M01의 최소 수정과 재검사

`reviews/hr-independent.md`의 수정 전 보고서(SHA256 `f7cb070083f765ca9193b33eae804db58be19a14ca3f4f377a4034ca16abbb09`) 전문을 읽고 M01을 수용했다. 그 보고서와 세 원고가 고정됐다는 검수자의 통보 뒤에만 수정했다. 수정 직전에는 새로 생성된 23:04 KST `LESSONS.md` 전문도 읽었다(SHA256 `92c572987cbc3c03eeb934fbfd2de6cf42d7e4b2e441cc39fb009c0e11f0e71a`). 독립 보고서 자체는 수정하지 않았다.

| 구분 | 실제 문장 / 판단 |
|---|---|
| 수정 전 704 | `Nakon upisa potrebna je potvrda o studiranju izdana unutar posljednjih mjesec dana, uz dokaz upisa semestra ili studentsku iskaznicu.` |
| 문제 | `uz`가 재학자료에 학기등록증 또는 학생증을 별도 추가로 제출하는 의무로 읽힌다. 공식 안내의 포함관계를 정확한 OR 예시만으로 충분히 지켰다고 판단했던 자기검수의 한계다. |
| 수정 후 704 | `Nakon upisa potrebna je potvrda o studiranju izdana unutar posljednjih mjesec dana.` |
| 의미 보존 | EN 정본의 간결한 최근 재학자료 범위로 돌아갔다. 앞 문장의 등록 전 입학허가, 등록 후 단계, 최근1개월, 기존 NIA 체크리스트 URL은 유지했다. 더 많은 서류를 요구하지 않으며 기산·요금·FAQ를 바꾸지 않았다. |
| SHA 변화 | 704 `985ebae4fcc6c789c2dacfe813a6e5bef93b0a41f92f265d58c0a618b02a9f65` → `f5ae1cb6a378e2c5c6fe7f1cb3137e00bd0bad50da39c3bbea21669a6f72cee3`. 705/706은 위 현재 SHA 그대로다. |

선택 S01의 수수료 반박 단문은 이번 최소 수정에서 유지했다. 각 글이 독립적으로 읽히며 EN에도 있는 ‘더 내면 더 긴 기간을 받는 것은 아님’이라는 승인 범위의 설명이다. 독립 검수도 이를 필수 오류나 MONOTONY 반려로 분류하지 않았다. 이 선택을 도구 수치를 올릴 이유로 사용하지 않았다.

2026-10-25 23:11:16 KST 같은 공유 절대경로에 `--lang hr`를 명시해 세 편을 다시 실행했다. 결과는 모두 exit0/FAIL0, CV `.539 / .528 / .486`이다. 변경 문장은 불릿이므로 도구의 본문 문장 통계는 위 표와 같고, 실제 문장 의미는 별도로 대조했다. 불릿이 자동 길이 통계에서 빠진다는 점을 숨기지 않는다. §5의 실질 결말·오프너·인용 리듬·법적 숫자와 출처는 그대로이며, 불필요한 문장 추가나 정상 서수 표기 변경은 없다.

같은 시각 임시 overlay에서 새 세 SHA로 구조 검사도 다시 실행했다. `revised-report.json`(SHA256 `e86d2140869eecc1a33ce675a487004e387a05d37596be8cc2aec36eef67a524`)은 자동 오류0/PASS, `semanticStatus: REVIEW_REQUIRED`, `publicationReady: false`다. 이 자동 결과를 독립 의미 승인으로 바꾸지 않는다. 현재 원고를 다시 동결해 검수자에게 보냈다.

독립 검수자는 R1 원문을 보존한 `reviews/hr-independent.md`의 R2에서 M01 해소·미해결 필수0과 직접 공유 검사 FAIL0을 확인했고 S01 유지 사유도 수용했다. 해당 R2 보고서 SHA256은 `5635a374d160fdc0165340042d8b958890bf24fdd9475105c7acba2e856eca08`이며, 이 작성자는 그 후속 기록을 읽었다. 원고는 위 현재 세 SHA로 고정되어 있다.

## 남은 범위

실제 카드·제목·요약·FAQ·JSON-LD·피드의 언어와 내부 저자 비노출, 최종 게시일, 빌드·배포·공개 확인은 root의 후속 범위다. 도구 threshold나 profile을 원고에 맞춰 수정하지 않는다. 모델 자기검수·AI 독립 검수·자동 구조 PASS를 원어민·변호사 승인으로 칭하지 않는다.
