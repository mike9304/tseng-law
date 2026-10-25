# HU 704–706 저자 자체 검토

작성자: `column_source_quality` (AI), 2026-10-25 KST. 소유 파일은 batch03의 HU 세 원고와 이 보고서다. 인간 헝가리어 원어민 검수나 변호사 승인, 게시 승인을 뜻하지 않는다. R·공유 검사기·다른 작성자의 원고는 수정하지 않았다.

현재 상태: 23:08 KST, 정상 HU 서수 경계를 수정한 공유 도구로 세 편 모두 exit 0 / FAIL 0이다. 독립 검수 R1의 전일제 조건과 선택 O1–O3을 반영했고, 실제 문장 리듬도 고쳤다. 최종 SHA와 변경 이력은 맨 아래에 기록했다. 원래 독립 보고서를 수정하지 않았으며 새 SHA에 대한 독립 R2를 요청했다. 미지원 exit2, 잘못된 경계에서의 과거 PASS, 수정된 경계에서의 실제 FAIL을 모두 구별해 보존한다. 인간 검수·게시 준비 완료를 뜻하지 않는다.

## 읽은 기준과 원문 선택

- batch03/BRIEF.md 및 batch02/BRIEF.md 전문, R의 AGENTS.md, `docs/audit/all-locales-parity-20261025/BRIEF.md`, FRONTMATTER 계약, `docs/columns/EDITORIAL-VOICE.md`, `~/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, 공유 SENTENCE-VARIETY-RULE.md와 LESSONS.md를 읽었다. 공통 홈 문체 경로의 파일 부재는 상위 작업에서 확인되었으며, 실제 존재하는 지정 프로젝트 정본을 적용했다.
- 현행 R의 EN·KO·ZH 704–706 아홉 원고를 전문으로 읽었다. 간결한 EN을 정보 흐름의 기준으로 삼고, KO·ZH와 공통 facts F01–F24로 기산점·상한·가족 조건·절차 예외를 보충했다. 아홉 원문의 문장 수나 URL 합집합과 일대일로 같다고 주장하지 않는다.
- 공통 `arc-source-facts.md`와 2026-10-24 `source-refresh.md`를 대조했다. 과거 반려본이나 최신성이 확인되지 않은 구 작업트리 원고를 집필 기준으로 사용하지 않았다.
- 현행 HU 879·880·881 전문을 읽어 도입·소제목·끝문장과 용어를 비교했다. 언어를 국적으로 간주하지 않았다. HU879의 헝가리 국민 working holiday 설명을 이번 세 편의 독자 자격으로 옮기지 않았다.
- 자연스러운 헝가리어 설명을 위해 법률 행위와 행위자를 풀어 썼다. 번역을 헝가리 법률로 바꾸지 않았으며, 헝가리어 상담·통역·자격·성공사례를 새로 약속하지 않았다.

R = `/Users/son7/Projects/tseng-law-all-locales-20261025`.

| 읽은 원문 | SHA-256 |
|---|---|
| EN 704 | `610343da1255e2e873956c6de54bd0f9c72c6731aae9343bd7bae9884efdd39f` |
| EN 705 | `87a4ab6e9a5e8b434a30de0dc111307fc58e878a7534cef793e2a3e27be38304` |
| EN 706 | `1ecf6acc92d181afb2820bb001d4e4d45cc4eeca823d2e32def25faebe119d71` |
| KO 704 | `cbf6b07b2d41c3b136ceac099f8d32152ca125c18478321610ffa715c29476a1` |
| KO 705 | `727377648fcc7e2bd1d8ea8202bea5fb69f01174ce51a0ee422891126011d54a` |
| KO 706 | `4cd612086336cb1a3720111390ce7aca3f4eff5c7f96c5e92aea001fa7b8cfbc` |
| ZH 704 | `0c00bc06bf3c3c1860a95af4dbcea9eaab981300860916856295e8b947244468` |
| ZH 705 | `290a50047632ad830ea98c524ffef6ed91c2b4c8d555a1844689824c3ffea7a3` |
| ZH 706 | `4d70e78b9a197f4a2b81d25d61b6fa862ee849a6392d5fd905e90bcf781e721c` |
| facts F01–F24 | `4776f60010172120e0812d8d552123aeb5c7cc0b467cb5306ca031a1e17c2145` |
| source-refresh | `a33d5bd1439879bc7461755c3b6793f4942ec161454032dcb8cde1c4d52a6983` |
| HU 879 | `fbfca31f7a734db02dd6069f493bcb2a8e9f5cc04eae5424bdaae0c23330adf5` |
| HU 880 | `e4ab1c4aba7456c9f326c63bc848e09ccc61cc029d4b69525d4032de4cab530b` |
| HU 881 | `81a89eda419b4da98ddb783977ecb77780b3b16d0355002adaf5b05fe0c253c3` |

KO 원문 디렉터리는 `src/content/columns/`, EN은 `columns-en/`, ZH는 `columns-zh/`다. 세 파일은 각각 `704-taiwan-arc-first-application.md`, `705-taiwan-visa-residence-work-study-family.md`, `706-taiwan-arc-renewal-changes-reentry.md`이며 숫자 접두사만으로 다른 글을 선택하지 않았다. 원문 아홉 SHA는 자체 구조 검사 시 다시 계산하여 전달된 기준과 일치함을 확인했다.

## 이번 집필 중 직접 확인한 공식 자료

2026-10-25에 아래 현행 공식 본문을 다시 읽었다. 모든 인용 URL을 새로 전수 조회했다는 뜻은 아니며, 나머지는 현행 정본과 공통 직접 조사 기록을 사용했다. 법령 공포일·조문 시행일·기관 안내 수정일·이번 확인일을 구분했다.

| 직접 확인한 자료 | 이번 원고에서 확인한 명제 |
|---|---|
| [취업서비스법 영문](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=N0090001), 제50·53조 | 해당 학생의 주 20시간 제한에서 여름·겨울 방학만 시간 제한 예외. 다른 휴일 전체로 넓히지 않았다. 새 고용주의 허가는 이직·추가고용 양쪽의 일반 원칙이며, 이전 고용 종료증명은 이직의 조건이다. |
| [거류 규칙 영문](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=D0080129), 제7·9·11·12조 | BOCA 15일은 비자 수령이 아닌 신청. 일반 연장 3개월 창구, 졸업 후 1년+1회·합계 2년, 최초 대만 국민 배우자 ARC 최장 1년. |
| [인재법 영문](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295), 제8·9·16·17조 | 특정전문인재의 고용·거류 승인 구분, 가족의 거류 승인, 5년과 금카드 1–3년, F04 두 초청자 범주의 수식 범위, 추가 거류 6개월+1회·최장 1년. |
| [NIA 0902 영문](https://www.immigration.gov.tw/5475/5478/141465/141808/141970), 3(1)(d)(iv) | 등록 전 입학통지, 등록 후 최근 1개월 내 재학증명이라는 시점을 재확인했다. 현 학기 등록증명·학생증은 해당 안내에 포함되는 증빙이다. 입학 후 서류를 얻는 별도 1개월 유예로 쓰지 않았다. |

같은 세션의 앞선 독립 검수에서 직접 확인했던 [인재법 제16조 중문](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16), [NIA 0902 중문](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/29996/), [NIA 0915 영문](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news), [전문인재·가족 온라인 안내](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/)와 [현행 ARC/APRC 여권 유효기간 답변](https://www.immigration.gov.tw/5385/12162/12197/414977/)도 이 집필의 근거로 사용했다. 인재법 2026-01-01 시행일은 공통 source-refresh R11의 시행명령 대조를 사용했으며, 이번 HU 집필에서 연혁 페이지 직접 열람에 성공했다고 쓰지 않는다.

URL은 EN 정본의 704 9개·705 15개·706 13개를 전부 보존했다. HU704에는 F24 중문 0902와 첫 배우자 상한의 거류 규칙을 더했고, HU706에는 F23 특정 온라인 안내·해외 분실 안내·현행 ARC/APRC 여권 답변을 더했다. ZH 원문의 옛 `5382/5385/.../414977/` 경로를 폐기 자료라고 단정하지 않았으며, 이번 세션에서 실제 본문이 열리는 동일 NIA의 `5385/12162/12197/414977/` 경로를 사용했다. 이 차이는 원문 URL 합집합 완전일치 주장과 구별한다.

## 법률 의미 자체 대조

| 범위 | HU에서 확인한 조건과 표현 |
|---|---|
| F01–F03 / 704·705 | 거류허가를 받은 거류비자 입국자의 다음 날 30일 의무와 대만 내 비자 발급일 30일을 구분. ARC 기능 통합증명 예외. 방문·무비자 모두에게 전환권을 부여하지 않으며, 직접 경로는 해당 취업허가 또는 면제·NIA 승인 조건을 둔다. |
| F04 / 705 | `Tajvanon szakmai munkát végző külföldi szakembert, illetve különleges szaktudású külföldi szakembert`의 두 범주를 먼저 구분하고, 다음 문장 `Mindkét esetben...`으로 공통 NIA 거류 또는 영주거류 승인을 붙였다. 가족은 배우자·미성년 자녀·신체/정신 장애 때문에 자신을 돌볼 수 없는 성년 자녀. `önmagát ellátni nem képes`는 소득이 없다는 뜻으로 치환하지 않았다. 가족 자신의 허용된 입국 경로도 보존. |
| F05 / 705 | 대만 국민 배우자의 대만 거주 AND 호적, 유효 비자의 최소 60일 체류허용과 제한 부재. `A 60 nap a megengedett tartózkodásra vonatkozik.`로 비자 유효기간과 구별. 해당 이주노동자 배우자의 법정 제외도 명시. |
| F06–F08 / 704 | 2년 이내 사진, 고용·재학 자료 최근 1개월, 단계별 학생 증빙, 실제 주소, 관계와 초청자 신분 자료. 해외 문서 인증 의무와 중국어 번역을 요구할 수 있다는 강도 구분. 최초 대만 국민 배우자의 동행·혼인등록·최장 1년을 보존. |
| F09–F12 / 704·706 | 대만달러 1년당 1,000·1년 미만도 전액, 해당 직접 경로 +2,200, 僑生 반액 범위, 재발급 500. 일반 3년·특정전문인재 5년·금카드 1–3년은 법정 근거에 연결. 제8조 NIA 거류 승인 다음 날 기산과 가족 자체 승인 명시. 일반 심사 10근무일·학생 5근무일·보완 후 재계산, 학생 승인 후 납부 5근무일·납부 뒤 IC 수령 3근무일·6개월 이하 전자형을 각각 설명. |
| F13–F14 / 705 | 유학 목적 방문비자의 적격 직접 신청과 해외 거류비자를 구분. 어학 4개월 이수 AND 최소 3개월 추가등록, 주중 주 15시간, 휴가 포함 결석 1/4 이하, 증빙. 근로 허가는 ARC와 별도. 학생 20시간 예외는 여름·겨울 방학만. 국민 배우자 면제의 호적·거류 승인과 특정/고급 전문인재 배우자의 제15조 직접 허가 신청을 구분. |
| F15–F17 / 706 | 일반 만료 전 3개월 이내 창구. 주소·근무처 변경 다음 날 30일. 제23-1조 해당 사유 변경은 발생일부터 30일 NIA, 그 밖은 발생일부터 15일 BOCA/지소 신청 후 NIA. 사업 지속 적격 연장과 금카드 갱신은 만료 전 4개월, 종료사업 별도 경로는 만료 전 3개월 이내 신청 가능. |
| F18–F19 / 706 | 사유 소멸 시 NIA 취소·말소 의무와 조건별 계속 거류 허용을 구분. 가정폭력 때문에 이혼·재혼하지 않음·대만인 배우자의 대만 거주/호적. 자녀는 대만 호적 미성년·실제 양육 OR 친권·의무 OR 교류. 노동분쟁은 대만 고용주와 진행 중인 소송, 산재는 치료 중. 초과거류 30일 미만 AND 원래 사유 지속·처벌 후 재신청 가능·APRC 계산 1년 공제, 자동 연장 아님. |
| F20–F21 / 706 | 적격 전문인재와 이미 거류 승인된 해당 가족은 만료 전 신청·이전 ARC/금카드 만료 다음 날 6개월·추가 1회·합계 1년. 적격 대만 졸업자 제11조는 만료 다음 날 1년·추가 1회·합계 2년. 별도 제12조 근로 면제는 대만 전문학사 이상 취득 AND 신졸업자로 NIA 연장 승인·그 기간으로 제한. |
| F22–F23 / 706 | 출국 전 일반 재입국허가·ARC 유효기간 및 말소 연동, 유효 여권+APRC 예외. 특정 온라인 절차에서 심사 중 출국하면 심사 계속하지 않음; 재입국 후 적격일 경우 재신청 가능. `nem vizsgálják tovább` / `feltételeit teljesítő személy ismét kérelmezhet`로 필수 효과와 조건부 가능을 구분했다. 영수증을 재입국 서류로 바꾸지 않았다. |
| F24 / 704 | 일반 보완은 통지 다음 날부터 15달력일. 자료를 해외·중국대륙·홍콩·마카오에서 신청해야 할 때 3개월 대체기간. 신청인이 해외에 있다는 사실만으로 적용하지 않으며, 15일에 3개월을 더하지 않음. 지연·불완전 보완 기각과 심사 재계산을 보존. |

메타데이터와 FAQ도 별도로 읽었다. 각 제목·요약은 체류와 취업허가를 혼동하지 않고, 704 FAQ는 두 30일 기산과 직접 경로 자격을 분리한다. 705 FAQ는 모든 ARC 가족과 모든 무비자 방문자에게 전환권을 주지 않는다. 706 FAQ는 3·4개월을 만료 전 창구로 쓰고, 접수증이 입국 문서를 대체하지 않는다고 설명한다.

## 실제 수정 기록

아래는 저장한 초안에서 실제로 발견하여 수정한 문장이다. 원문·조문·숫자·URL을 삭제해 수치를 맞추는 수정은 하지 않았다.

| 번호 | 문제 문장 또는 구절 | 이유 | 실제 수정 | 의미 보존 |
|---|---|---|---|---|
| H01 / 704 | `a beiratkozás előtt felvételi igazolást, utána egy hónapon belül kiállított hallgatói igazolást...` | `utána`가 1개월과 이어져 등록 후 1개월 내 발급 의무로 오해될 수 있고, 증빙 포함관계도 흐렸다. | 등록 전 문장을 따로 끝내고 `Beiratkozás után az előző egy hónapon belül kiállított hallgatói igazolás szükséges; az útmutató az aktuális félév beiratkozási igazolását vagy a diákigazolványt is ide sorolja.`로 고쳤다. | 최근 발급기간과 등록 전/후 구분, 증빙 종류 보존. NIA 0902를 직접 재확인. |
| H02 / 705 | `A magyar nyelvű tájékoztatás önmagában nem jelent magyar állampolgárságra szabott jogosultságot.` | 독자에게 내부 작성 원칙을 설명하는 문장으로, 앞선 여권·국적별 절차 설명을 반복한다. | 이 문장을 삭제하고 여권·국적, 현재 거주국·여행 목적·서류 발행지에 따른 관할 공관 문의 문장을 남겼다. | 독자 국적 가정을 제거하는 실질 정보는 유지. 법률 조건·출처 삭제 없음. |
| H03 / 705 | `külön közvetlen munkavállalásiengedély-kérelmet tesz lehetővé` | 긴 합성 명사로 행위자가 흐려지고 번역투가 생긴다. | 제15조를 주어로 두고 `...házastársai a családi tartózkodás jóváhagyása után közvetlenül kérjenek munkavállalási engedélyt`로 풀었다. | 해당 특정/고급 전문인재 배우자, 가족 거류 승인 후, 직접 신청 가능 조건 보존. |
| H04 / 706 | `a tajvani munkáltatóval szembeni folyamatban lévő jogvita` | `jogvita`만으로는 실제 소송 절차가 진행 중이라는 법정 한정이 부족할 수 있다. | `a tajvani munkáltatóval szemben már folyamatban lévő peres eljárás`로 구체화. | 대만 고용주, 진행 중인 쟁송 조건을 명확히 보존하며 모든 불만·분쟁으로 확대하지 않음. |
| H05 / 706 | `az e szabályhoz szükséges felsőoktatási végzéssel` | 제11조 졸업 후 거류와 제12조 전문학사 이상 취업허가 면제의 범위를 섞어 전자를 불필요하게 좁힐 수 있다. | 제11조 문단은 `Az arra jogosult, Tajvanon végzett külföldieknek...`로 시작하고, 단순 어학과정 수료만으로 그 경로 적격을 입증하지 못한다고 설명했다. | 제11조 기간·기산·재신청과 단순 어학 수료 구분 유지. 전문학사 요건은 별도 제12조 문단에 남김. |
| H06 / 706 | `ügynökség útlevélcseréről szóló tájékoztatója` | NIA를 글 앞의 `Hivatal`과 다른 말로 불필요하게 바꾸었다. | `hivatal útlevélcseréről szóló tájékoztatója`로 통일. | 같은 기관·여권 정보 갱신 의무·URL 유지. |
| H07 / 705 본문·FAQ | `heti 15 tanóra` | `tanóra`가 독자에게 자국 학교의 수업 1교시 단위로 읽힐 수 있다. 원문의 시간 단위를 분명히 할 필요가 있었다. | `heti 15 óra oktatás`, 결석 문장은 `oktatási óra`로 고쳤다. | 주중 주 15시간 교육·휴가 포함 결석 1/4 한도 유지. 자기학습 시간으로 바꾸지 않음. |
| H08 / 706 | `érvényes útlevéllel és APRC-val` | 유효하다는 수식어가 여권에만 붙는 것으로 읽힐 수 있다. | `érvényes útlevéllel és érvényes APRC-val`로 명시. | F22 두 유효 문서와 별도 재입국 신청 예외를 보존. |
| H09 / 705 | `Megfelelő engedéllyel ... külföldi szakember, illetve különleges szaktudású külföldi szakember...` | 본인 신청에 관한 제16조 제1항의 허가·면제 조건이 문법상 첫 범주에만 붙는 것으로 읽힐 수 있었다. F04 가족 초청자 범주의 수식과도 구분해야 한다. | 두 전문인재 범주가 각각 직접 신청 가능하다는 문장을 두고 `Mindkét kategóriában megfelelő engedély vagy alkalmazható törvényi mentesség szükséges a szakmai munkához.`로 공통 조건을 분리했다. | 본인 신청의 두 범주 모두 취업허가/면제, 허용 입국 및 NIA 승인 조건 유지. 가족 초청자의 F04 OR 구조는 변경하지 않음. |
| H10 / 704 | `Az irányadó dokumentumok... Az eredetit...`; `Az iratokról...`; `A jóváhagyott időtartamot... A díj...` | 같은 관사로 시작하는 실제 완결 문장이 연속되는 리듬. | 제출 행위를 먼저 두는 `Be kell mutatni...`, 관련글의 기능을 소개하는 `Részletesebben...`, 승인 행위자를 주어로 삼는 `Az NIA határozza meg...`로 고쳤다. | 원본·사본/반환, 관련 영문 글 URL, NIA가 결정한 기간에 따른 수수료 모두 유지. |
| H11 / 705 | `A felvétel és...`; `A munkavállaláshoz szükséges engedélyt...`; `Az angol nyelvű Gold Card-cikk...` | 앞 문장의 A/Az와 시작이 겹쳐 결과·대상 구분을 읽기 어렵게 한다. | `Külön döntés...`, `Sem a felvételi igazolás, sem a diák-ARC...`, `Kérelmezését...`로 실제 정보의 초점을 바꿨다. | 입학/비자 결정 구분, 학생 문서가 취업허가를 대체하지 못함, Gold Card 내부 링크 유지. `43. és 50. cikke` 표기는 그대로 뒀다. |
| H12 / 706 | `Az állandó tartózkodáshoz...`; `A régi munkaviszony vége...`; `A lakcímváltozás 30 napját...` | 앞 문장과 동일 시작이 연속된다. | `E szabály alapján...`, `Külön napra is eshet...`, `Nem alkalmazható automatikusan...`로 근거·날짜 분리·기한의 적용 범위를 먼저 설명했다. | APRC 계산 1년 공제, 세 사건의 각 날짜와 증빙, 여권변경에 주소변경 30일을 일괄 적용하지 않음 유지. |

초안 SHA(수정 전): 704 `9eaf639a5a0a7767323c71d7c740ec4bd6e09ac3778f50aa7f2dc3cb4b760424`, 705 `668702684b303459acd98a6658c662fa8c68fda41d1adcee08bcef94d71faf11`, 706 `e26a3a29049cc50e15badad0372ffdbfb9dec1ed0d7d8ec4563af9182ed7d7b4`.

## 문체와 §5 자체 점검

| 항목 | 직접 확인한 내용 | 상태 |
|---|---|---|
| 1. 올바른 언어 기계 검사 | 공유 도구에 세 실제 HU 원고와 `--lang hu`를 전달했다. 최초 exit2와 서수 경계 수정 전/후 결과는 아래에 구별한다. 영어 또는 다른 언어로 측정하지 않았다. | 서수 수정 설치본에서 최종 FAIL0 |
| 2. 도입 유형 | 704는 적용대상과 30일 시작점을 밝히는 기한 도입, 705는 같은 입국 방식의 서로 다른 법적 결과, 706은 기재된 만료일까지 머물 수 있는지 묻는 질문으로 시작한다. 허구 사례 공식이나 원문 첫 문장의 문형을 연속 복제하지 않았다. | 자체 확인 |
| 3. 짧은 문장과 긴 문장 | 704 `Harminc nap áll rendelkezésére.` / `A díj ezt követi.`; 705 `Az aláírt ajánlat még nem engedély.` / `ARC-t az NIA jóváhagyása után kap.`; 706 `Maga az esemény dátuma is számít.` / `A pótlás nem ad új tartózkodási időt.` 등. 조건을 같은 문장에 연결하거나 별도 결과로 나누었다. 32단어 이상 두 문장이 한 문단에 모인 곳은 최종 세 편 모두0. | 최종 CV .465/.453/.464, short .194/.191/.233 |
| 4. 문단 시작 | 표·제목·출처 고지를 제외한 본문 18/19/25문단의 첫 낱말을 별도로 세어 같은 시작이 반복되는 구간이 없는 것을 확인했다. 공유 도구의 최종 판정은 별도다. | 자체 확인 |
| 5. 인용 리듬 | 인용을 문장 앞/주어/중간에 두고, 704 실제 주소·승인기간, 705 비자 경로 구분, 706 서류 준비 문단 등에는 앞선 근거를 받아 결과를 설명했다. 주장·괄호 조문·예외라는 세 문단 연속형을 쓰지 않았다. 본문 질문은 1/1/2개다(제목·FAQ 제외). | 자체 확인 |
| 6. 대비 | 필요한 법률 구별인 체류/근로, 이직/추가고용 증빙, 접수증/여행서류를 설명했다. 허구의 독자 주장이나 국적 가정을 세워 반박하지 않았다. `nem X, hanem Y`식 문형을 반복하지 않았다. | 현재 도구 contrast 0, 독해 별도 확인 |
| 7. 마무리 | 실질 본문은 704 다음 만료·변경신고, 705 승인된 실제 근로·학업 시작, 706 귀국 예정일에 실제 사용할 서류로 끝낸다. 범위·확인일 고지는 구조적 꼬리로 별도 표기. 이메일은 706의 실제 근로·가족 분쟁 맥락 안에 한 번만 있고 판촉 결론이 없다. | 자체 확인 |
| 8. 등록·장식·허구 | 표준 헝가리어의 설명체와 정중한 독자 지칭. 굵은 강조·공개 저자란·지어낸 1인칭·가짜 의뢰인·명령형 체크리스트 제목 없음. 이미지 캡션은 기존 HU의 `Kitalált jelenet`. | 구조 검사도 오류 0 |
| 9. 의미 보존 | 수정 전후 기간·행위자·must/may·AND/OR·금액·근거 URL·캡션을 재대조했다. 법률 근거를 지우거나 다른 언어 프로필로 통과시키지 않았다. | 자체 확인 |

최근 세 편과의 비교: HU879는 헝가리 국민의 6개월 고용계약 질문과 3개월 동일 고용주 한도로 시작하고 마지막에 입국·고용 일정을 정리한다. HU880은 자회사/지점의 법적 형태로 시작해 허가와 계약 주체의 순서로 끝난다. HU881은 상속 포기 3개월과 준거법으로 시작해 가족 연락·문서 일정을 정리한다. 새 세 편은 이 제목·문장을 복제하지 않았으며, 모든 글을 같은 경고형 도입이나 문의 요청으로 끝내지 않았다.

MONOTONY: 초안의 설명 반복 — HU705 `A magyar nyelvű tájékoztatás...` — 같은 문단의 여권·국적 판단을 되풀이하는 내부 안내 문장을 삭제하고 실제 관할 판단정보를 유지했다(H02).

MONOTONY: 같은 시작의 연속 — 704 `Az irányadó dokumentumok... Az eredetit...`, 705 `A felvétel és...`, 706 `A régi munkaviszony vége...` — 실제 행위자·행위·결과를 앞세워 문장을 다시 구성했다(H10–H12). 조문 번호 때문에 잘못 분할된 조각을 없애려고 정상 법률 인용을 삭제하지 않았다.

## 실행한 검사와 원고 상태

공유 명령:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check \
  /Users/son7/tseng-all-language-columns-20261025/batch03/src/content/columns-hu/704-taiwan-arc-first-application.md \
  /Users/son7/tseng-all-language-columns-20261025/batch03/src/content/columns-hu/705-taiwan-visa-residence-work-study-family.md \
  /Users/son7/tseng-all-language-columns-20261025/batch03/src/content/columns-hu/706-taiwan-arc-renewal-changes-reentry.md --lang hu
```

22:28 KST 결과: exit 2, `argument --lang: invalid choice: 'hu'`. 당시 지원 목록은 28언어로 hu가 없었다. CV·짧은 문장 비율·FAIL 수를 산출하지 못했다. 검사기를 변경하지 않았다.

Node v24와 R에 이미 설치된 gray-matter로 YAML 파싱, 날짜·audience·author·topic·현지화 메타데이터·각 FAQ 3개·이미지 실재/정본 일치·허구 캡션·굵은 강조·본문 H1·영문 정본 공식 URL 포함·본문/출처 목록 상호 대응·내부 링크 대상 실재를 검사했다. H01 수정 이후 다시 실행하여 세 파일 합계 errors 0, 본문과 목록에 대응하는 공식 URL 11/15/16개, 내부 링크 3/4/3개임을 확인했다. 이후 H07–H12 수정은 아래 후속 검사로 다시 확인한다.

| 프로필 지원 전 자체 수정본 | SHA-256 (이전 기록, 최종 해시 아님) |
|---|---|
| 704 | `9f737fab34dc63afdc423cb9a743fa59e3429209099926bac9a30dbd727ba15e` |
| 705 | `6549492bdb0509ba4ea46ad2fd0998daf734aa1f13db15d7be339127bec7b4f6` |
| 706 | `9e2b4170d7a131a24b1f742086643609b17df2f044ac5a0221d2f3834b3fe59f` |

## 공유 hu 설치 후 실측

root의 설치 통보 후 공유 경로를 사용했다. 설치 기록은 `batch03/tooling/variety/root-installation.json`이며, 이 작성자는 도구·프로필·fixture를 수정하지 않았다.

첫 hu 실측 입력 SHA는 704 `9f737fab34dc63afdc423cb9a743fa59e3429209099926bac9a30dbd727ba15e`, 705 `59bea0a4e0c84cc8be76eda2cf1e51c2b2d14489b5448e05b8c1548109b7afe1`, 706 `5a550899150ba8d03de5370112d4ec575d31de2ad61ac9a3702ff66633e7edaa`다. 위 지원 전 해시 이후 H07–H08을 적용하고 측정했다.

| 단계 | 704 | 705 | 706 | 종료 |
|---|---|---|---|---|
| 첫 공유 hu 실행 | CV .494, 같은 시작 연속 6 | CV .524, 같은 시작 연속 5 | CV .533, 같은 시작 연속 5 | exit 1, 각 FAIL 1 |
| H10–H12 리듬 수정 후 | CV .494 | CV .525 | CV .533 | exit 0, 모두 FAIL 0 |
| H09 법률 수식 명확화 후, 22:39 KST | 78문장, CV .494, short .256, run3 .066 | 80문장, CV .513, short .300, run3 .000 | 104문장, CV .533, short .327, run3 .059 | exit 0, 모두 FAIL 0 |

22:39 실측의 같은 시작 연속은 세 편 각각 2건, 도구의 대비 패턴은 모두 0, 본문 질문은 1/1/2개다. 다음 값은 그 설치본의 실제 수치이지 정확한 언어학적 문장 수를 보증하는 값이 아니다. 진단 과정에서 정상 HU 조문 병기 `43. és 50. cikke`를 `43.`에서 분할하는 한계를 발견하여 root에게 알렸다. 원고의 정상 조문 표기는 유지했으며, 중립 fixture로 분할 경계를 고친 도구가 설치되면 같은 원고를 다시 측정한다.

22:39 측정 도구 SHA: `variety_metrics.py` = `69ceb7202a6e716ba1666ec08f4757daea8bc43289448dcffa8446c830ecd6fb`; `variety_multilingual.py` = `042037e93c6a78459d1e7ea85b9b6bdb0b8aa1038ca9dc0f54c8239e76d4d6d1`; `variety_expansion.py` = `b78d8303aa128e61eff3ff715b8fc35f57b7928d374603256970ce2fa7bd007f`; `profiles/hu.json` = `e47f2ddab3e4a328a412714d12804972c68d1dacfa0bbffa57b8d437abb3329c`.

| 22:39 이전 동결 원고 — 현재 최종본 아님 | SHA-256 |
|---|---|
| 704 | `9bcb998db9ca40191e6ac0fcdb85829ac4cf9cff538906e935e6f407f467be01` |
| 705 | `2255891fce8e59e822091c114240a70a55c59d0671bae830359a55f26c11bd38` |
| 706 | `1a48f8c460feb798b7f4d3410bc614fbbad45c145e51f8885e8800f41b873bbb` |

독립 의미 검수·빌드·실제 렌더·게시 결과는 이 자체 검토로 대체하지 않는다. 원고를 R로 복사하거나 커밋·배포하지 않았다.

22:42 KST 후속 구조 검사: H07–H12까지 적용한 위 22:39 해시의 세 원고에 gray-matter 검사 전체를 재실행했다. 각 FAQ 3개, 공식 URL 11/15/16개, 내부 링크 3/4/3개, 총 errors 0, exit 0. 세 해시도 동일했다. 원고는 이 상태로 고정하고 경계 수정본 설치를 기다린다.

독립 검수 후속 대기: `column_live_audit`가705의 `Külföldről jelentkező hallgató ... a megfelelő felsőoktatási képzéshez.`에 EN의 full-time 한정이 명시되지 않은 점을 지적했다. 작성자도 [BOCA 학생 거류비자 안내](https://www.boca.gov.tw/cp-166-283-c4da3-2.html)의 Notice5를 직접 열어 확인했다. 제안 수정은 `A teljes idejű felsőoktatási képzésre külföldről jelentkező hallgató tajvani külképviseleten kérhet tartózkodási vízumot.`다. 검수 중 해시를 바꾸지 않기 위해 아직 원고에는 반영하지 않았으며, 이 시점에는 미해결 필수 보완1건으로 남긴다.


## 23:08 KST — 독립 지적 반영 및 서수 수정 후 최종 검사

원래 `hu-independent.md` SHA `f53462308bcc32c29ac2fded7cce55a10829ec3d179d18e0eb1cab72f6d2f1c3`를 변경하지 않았다. 검수자가 보고서 동결을 알린 뒤 root가 승인한 소유 원고 수정만 수행했다. 아래 전후 문자열로 수정본을 역변환하여 22:39 동결 SHA 세 개가 정확히 복원되는 것을 메모리 안에서 검증했다. 따라서 원래 원고를 식별하는 해시와 재구성 가능한 변경 증거를 함께 보존한다. 옛 판정을 새 SHA에 자동 승계하지 않았으며 별도 `hu-independent-r2.md` 검수를 요청했다.

| 변경 | 문제·수정 및 의미 보존 |
|---|---|
| H13 / 705 / 필수 R1 | `megfelelő felsőoktatási képzés`에 full-time이 없었다. `teljes idejű`와 `külföldi hallgató`를 명시했다. 해외 공관 신청 가능성과 입학 전 신청을 보존하며, 다음 문장의 유학목적 방문비자 경로와 일반 무비자/도착/다른 목적 제외는 유지. BOCA Notice5를 직접 확인한 근거다. |
| H14 / 704 / 선택 O1·O3 | 보완을 전혀 하지 않은 경우와 불완전 보완을 함께 명시했다. `az ő értesítésében`의 중복 대명사는 `a saját értesítésében`으로 정리. 기각·15달력일·특정 해외자료3개월 대체·학생 전용 일정과 타 신청자 구별을 유지. |
| H15 / 706 / 선택 O2 | `friss végzősként`를 `frissen végzettként`로 바꿔 졸업반이 아닌 이미 졸업한 사람임을 더 명확히 했다. 대만 associate 이상 취득 AND NIA 신졸업자 연장 승인·그 기간 근로 면제를 보존. |
| H16 / 704 / 실제 리듬 | 발급 뒤 30일을 설명하는 문장과 그 대상의 관계를 연결했다. 첫 배우자 ARC는 대만거주/호적 조건과 최장1년을 한 조건문에 놓았다. 10근무일의 제외 기간은 같은 문장에, 보완 후 재계산은 짧은 독립 문장에 두었다. 정상 `12. cikke`, `43. és 48. cikke`를 보존. |
| H17 / 705·706 / 실제 시작어 반복 | 고용주 신청과 업무별 관할·예외를 연결하고, 학생 직접 신청과 디지털노마드 허용업무 범위를 행위·대상으로 시작하게 고쳤다. 706은 예외적 계속거류의 가능성과 분실 후 자료제시 목적을 앞세움. 법정 must/may·입국 방식·업무범위·관할과 출처를 유지. |
| H18 / 704 / 추가 리듬 보완 | H13–H17 후에도 CV .429가 남았다. 직접 거류 신청 가능성과 그 전제인 전문업무 허가/면제를 하나의 `ha` 조건문으로 연결했다. 신청 가능성이 조건과 떨어져 읽히지 않게 했고, 일반 외국인 누구나 직접 신청 가능하다고 확대하지 않았다. 출처·후속 링크는 그대로다. |

MONOTONY: 실제 완결 문장 길이 편중 — 704/705 수정 전 CV .405/.436 — 조건과 법적 결과가 붙어야 할 곳을 연결하고 재계산 등 짧은 결과는 분리했다. 단지 길이를 늘리기 위한 수식어·내용 삭제는 하지 않았다.

MONOTONY: 실제 동일 시작 — 704 `A BOCA... A két helyzetet...`, 705 `Az illetékes... Az aláírt...`, 706 `A bevándorlási törvény... A törvény...` — 행위·조건·결과의 관계를 드러내는 H16–H18을 적용했다. 조문 숫자 조각은 문장으로 세지 않았다.

| 단계 | 704 | 705 | 706 | 실제 명령 종료 |
|---|---|---|---|---|
| 경계 수정 설치 후, 원래 동결본 | 70문장, CV .405, 같은시작3 | 69문장, CV .436, 같은시작4 | 90문장, CV .461, 같은시작3 | exit1: FAIL2/2/1 |
| H13–H17 후 | 68문장, CV .429, 길이 FAIL1 | 68문장, CV .453, FAIL0 | 90문장, CV .464, FAIL0 | exit1 |
| H18 후 최종 | 67문장, CV .465, short .194, run3 .031, 같은시작2 | 68문장, CV .453, short .191, run3 .000, 같은시작2 | 90문장, CV .464, short .233, run3 .045, 같은시작1 | exit0, FAIL0/0/0 |

정확히 공유 경로의 동일 명령과 `--lang hu`를 실행했다. root 설치 receipt는 `batch03/tooling/variety-fix/root-installation.json`이다. 원고 비열람 중립 fixture와 42tests 검수는 root/도구담당의 기록이며 내가 실행한 검사로 대신 표기하지 않는다. 이번 작성자가 측정 기준이나 프로필을 고치지 않았다.

직접 추출 확인: 704의 `43. és 48. cikke`, 705의 `43. és 50. cikke`와 단일 `48. cikke`, 706의 `23-1. cikkében`이 완결문장 안에 남았다. 본문·표·FAQ·출처를 다시 읽어 조문 숫자나 단위를 삭제하지 않았음을 확인했다. 32단어 이상 문장이 한 문단에 두 개 이상인 곳은0/0/0. 최다 문단 시작은2/1/1회, question1/1/2, contrast0/0/0. §5의 도입·서류 중심 결말·일관된 설명체·허구 캡션·문장 외 FAQ 검토도 유지한다.

최종 구조 검사: Node24/gray-matter로 날짜·audience·internal author·topic·각FAQ3개·이미지실재/EN일치·캡션·bold/H1·공식URL/목록·내부경로를 재검사해 errors0/0/0. 공식URL11/15/16·내부링크3/4/3, EN 공식 URL 누락0. 이 파일 검사와 공유 FAIL0은 법률·원어민 승인이나 렌더/게시 검증이 아니다.

최종 도구 SHA: metrics `69ceb7202a6e716ba1666ec08f4757daea8bc43289448dcffa8446c830ecd6fb`, multilingual `042037e93c6a78459d1e7ea85b9b6bdb0b8aa1038ca9dc0f54c8239e76d4d6d1`, expansion `f52177c31d0d0d161d78f5b578ede8e6213dc090b116d6ca7dfaf2115e1c49f9`, HU profile `cef85b13e94e3fd08f23d3aa4fba80ab51c116adf3c7d30cb8e4e59d00b1279b`.

| 최종 동결 원고 | SHA256 |
|---|---|
| 704 | `85f5e774de55aa774e9a3d1167d8a17d8930ec0f82a210f2fbd75c6b618c5146` |
| 705 | `766f08472e4184f4b5d9d96011e1b9c1a4a2f25d38cda28ae50823cfd2d11d16` |
| 706 | `36e5d579f34d279f8263e7d8feca990c82db574fcb0183e3a3462e0bbc4f07df` |

### 원래 동결 원고를 재구성할 수 있는 전후 문자열

아래 각 쌍은 `[수정 전, 수정 후]`다. 최신 원고에서 각 파일 배열을 역순으로 적용해 수정 후 문자열 한 번을 수정 전 문자열로 되돌리면 22:39 SHA가 복원된다. 이 역변환은 메모리에서만 확인했으며 실제 원고를 되돌리지 않았다.

```json
{
  "704": [
    [
      "vízumot. A [BOCA szakembereknek szóló vízumtájékoztatója]",
      "vízumot: a [BOCA szakembereknek szóló vízumtájékoztatója]"
    ],
    [
      "engedélyezését. Ehhez a szakmai munkát engedélynek vagy alkalmazható mentességnek kell lefednie a [külföldi szakemberek",
      "engedélyezését, ha szakmai munkáját megfelelő engedély vagy alkalmazható mentesség fedi le a [külföldi szakemberek"
    ],
    [
      "Első házastársi kérelemnél külön szabály érvényesül, ha a tajvani házastárs Tajvanon él és szerepel a tajvani háztartási nyilvántartásban. Az első ARC legfeljebb egy évre szólhat",
      "Ha a tajvani házastárs Tajvanon él és szerepel a tajvani háztartási nyilvántartásban, az első házastársi ARC legfeljebb egy évre szólhat"
    ],
    [
      "Az NIA előírja a tajvani házastárs személyes jelenlétét és a Tajvanon bejegyzett házasság igazolását.",
      "Az NIA a tajvani házastárs személyes jelenlétét és a Tajvanon bejegyzett házasság igazolását is előírja."
    ],
    [
      "Határidőn túli vagy hiányos pótlás esetén a kérelmet elutasítják.",
      "Ha a hiányokat határidőn belül nem vagy nem teljesen pótolják, a kérelmet elutasítják."
    ],
    [
      "Tíz munkanapot jelöl meg az [NIA az általános elbírálásra](https://www.immigration.gov.tw/5475/5478/141465/141808/141970). Ebbe az iratvisszaadás, hiánypótlás és személyes meghallgatás ideje nem számít bele; hiánypótlás után az elbírálási idő újraindul.",
      "Az általános elbírálásra az [NIA tíz munkanapot](https://www.immigration.gov.tw/5475/5478/141465/141808/141970) határoz meg, amelybe az iratvisszaadás, a hiánypótlás és a személyes meghallgatás ideje nem számít bele. Hiánypótlás után újraindul a számítás."
    ],
    [
      "Más kérelmező az ő értesítésében szereplő átvételi rendet követi.",
      "A többi kérelmező a saját értesítésében szereplő átvételi rendet követi."
    ]
  ],
  "705": [
    [
      "szükséges engedélyt. Az illetékes hatóság és a kivételek",
      "szükséges engedélyt; az illetékes hatóság és a kivételek"
    ],
    [
      "Külföldről jelentkező hallgató tajvani külképviseleten kérhet tartózkodási vízumot a megfelelő felsőoktatási képzéshez.",
      "A teljes idejű felsőoktatási képzésre jelentkező külföldi hallgató külföldről, a tajvani külképviseleten kérhet tartózkodási vízumot."
    ],
    [
      "A kifejezetten külföldi hallgatói tanulmányokra kiadott látogatói vízummal belépő személy a feltételek teljesülésekor közvetlen NIA-kérelemmel is élhet.",
      "Kifejezetten külföldi hallgatói tanulmányokra kiadott látogatói vízummal történő belépés után a feltételeket teljesítő hallgató közvetlenül az NIA-hoz is fordulhat."
    ],
    [
      "A [szakemberekről szóló törvény 14. cikke](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295) szerinti távoli munkavégzés nem jelenthet szolgáltatásnyújtást tajvani vállalkozásoknak vagy munkáltatóknak.",
      "Tajvani vállalkozásoknak vagy munkáltatóknak nem nyújthat szolgáltatást a [szakemberekről szóló törvény 14. cikke](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295) szerinti távoli munkavégzés keretében."
    ]
  ],
  "706": [
    [
      "A törvény meghatározott helyzetekben lehetővé teszi a további tartózkodás engedélyezését.",
      "Meghatározott helyzetekben ugyanakkor engedélyezhető a további tartózkodás."
    ],
    [
      "friss végzősként engedélyeznie",
      "frissen végzettként engedélyeznie"
    ],
    [
      "Az NIA-nak és az [illetékes tajvani külképviseletnek](https://www.boca.gov.tw/sp-foof-countrylp-01-2.html) az útlevéladatokat, a tervezett visszatérési napot és a rendelkezésre álló ARC-másolatot kell megadni a megfelelő eljárás tisztázásához.",
      "A megfelelő eljárás tisztázásához az NIA-nak és az [illetékes tajvani külképviseletnek](https://www.boca.gov.tw/sp-foof-countrylp-01-2.html) az útlevéladatokat, a tervezett visszatérési napot és a rendelkezésre álló ARC-másolatot kell megadni."
    ]
  ]
}
```
