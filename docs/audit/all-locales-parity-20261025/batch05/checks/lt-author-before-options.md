# LT 704–706 저자 기록

작성: column_deploy, 2026-10-26 KST. 범위는 batch05의 LT 원고 세 편, 이 기록, `checks/lt-*`이다. R 원고·앱·공유 도구를 수정하거나 R로 복사하지 않았으며 commit/push/배포도 하지 않았다.

최종 상태: 공유 LT 프로필 설치 후 아래와 같은 원고 SHA에 실제 CLI exit0/FAIL0을 확인하고74/77/92개 추출 문장을 전부 읽었다. 프로필 설치 뒤 원고 수정은 없었다. 세부 수치는 말미 후속 검사 기록에 있다.

00:22 KST 중간 상태: 세 편 집필과 아래 의미·문체·구조 검사는 마쳤지만 당시 LT 공유 프로필이 없어 기계 판정은 미완료였다. 실제 `--lang lt` 호출 세 편 모두 exit2였던 원문을 보존했다. 당시 결과를 FAIL0이나 게시 승인으로 소급해 바꾸지 않는다.

## 읽은 계약과 정본

batch05 BRIEF와 상위 batch04·03·02 및 R의 all-locales BRIEF, R AGENTS, EN/KO/ZH704–706 아홉 정본, `arc-source-facts.md` F01–F24, `source-refresh.md`, FRONTMATTER, 최근 LT945·944·899 세 편을 전문으로 읽었다. 기존 작업에서 읽은 문체 정본과 이번에 다시 읽은 SENTENCE-VARIETY-RULE·LESSONS를 적용했다. 홈 `agent-library/knowledge/editorial-voice.md`는 부재하므로 읽었다고 주장하지 않고 R `docs/columns/EDITORIAL-VOICE.md`를 정본으로 사용했다. COLUMN-VOICE-RULE의 정본 참조도 따랐다. 폐기된 Fable 자동 하청·고정 게이트는 적용하지 않았다.

입력 20파일의 경로·바이트·전체 SHA는 [lt-inputs.json](../checks/lt-inputs.json)에 고정했다. 최종 구조 검사 때 이 20개 입력이 모두 동일했다. 최근 LT는 번호가 더 높은 945 펌웨어 저작권·소스코드, 944 레이저 평가 샘플·시험 데이터, 899 상표 출원 명의 글이며, 오래된 897–899를 최신 세 편으로 가정하지 않았다.

## 이번 원고 SHA256

00:22 KST 현재 의미·문체 수정 뒤 동결본이다. 아래 SHA에서 구조 검사와 실제 미지원 CLI를 실행했다.

| 원고 | SHA256 | 본문 공백 단어수, 출처 목록 제외 | 공식 URL |
|---|---|---:|---:|
| 704 | 51188308b2cc93faedf23524d48597d0da663229893ed7f1c0b447babc2e444e | 1020 | 15 |
| 705 | ca974db0271c49c33ac808f095e8c7708ad89e205828e7ce8b2dedef14048bc9 | 1056 | 15 |
| 706 | 4b2d935fa2496bf95b6e304f976e937221a6ab696ab9aa7cf526e2811c7cf1c6 | 1338 | 16 |

published·lastmod는 모두 2026-10-26, date_display는 `2026 m. spalio 26 d.`이다. 기존 조사 기반인 본문 출처 확인일 24–25일을 새 공개일로 바꾸지 않았다. 세 원본 v2 이미지 경로, 내부 author `legal-ai-assistant`, audience `[lt]`, FAQ 각 3개, 정확한 가상 캡션 `Išgalvota scena`를 유지했다. 원고에 공개 byline·굵은 글씨·허위 상담언어 약속은 없다.

## 법률 조건·요약·FAQ 자체 대조

| 항목 | 실제 보존 방식 |
|---|---|
| F01–F02 | 704 본문·FAQ에서 거류비자와 허가 전제, 입국 다음 날30일 및 대만 내 발급일부터30일을 구별. 유효 통합문서의 별도 ARC 신청 면제를 의무 예외로 쓰고 모든 방문자에게30일 전환권을 주지 않음. |
| F03 | 704 적격 전문인재 요약, 705 두 전문인재 범주 모두 전문 업무 허가 또는 면제 조건. 일반 경로의 신청 주체는 고용주. 고용 제안과 허가·NIA 거류승인 후 ARC 발급을 구별. 가족 초청자에게 필요한 실제 대만 업무 조건을 본인 신청의 일반인재 한쪽에 옮기지 않음. |
| F04 | 705는 `(일반 전문인재 + 대만 전문업무) OR 특정 전문인재`를 먼저 쓰고, `Abiejų kategorijų ... NIA ... gyventi arba nuolat gyventi`로 양 범주의 거류 OR 영주승인을 명시. 배우자·미성년자녀·신체/정신장애로 자기 돌봄 불가능한 성년자녀 한정 및 그들의 적격 입국 보존. 부모·다른 성년자녀 제외는 장애 예외를 덮지 않음. |
| F05·F08 | 대만 거주와 호적등록을 함께 둠. 705 60일은 비자 사용기간이 아니라 허용 체류기간. 704 첫 배우자 ARC는 최장1년이며 보장된 고정1년 아님; 대만 배우자 동행·대만 혼인등록을 보존. |
| F06–F07 | ARC사진2년/BOCA비자사진6개월 구별. 취업·등록후 재학 최근1개월, 등록 전 입학 증명, 실제 주소, 가족 관계·초청자 자료. 재학 표는 EN 수준의 짧은 증빙 설명으로, 여러 종류의 서류를 누적 AND 의무로 만들지 않음. 해외문서 인증 의무와 일반0902 중국어 번역 요구 가능을 구별하며 학생0929는 별도 규칙으로 연결. |
| F09–F10 | 1년당NT$1,000, 미만도1년, 적격 경로+2,200, 僑生 50%를 전학생으로 확대하지 않음. 일반최장3년/고용된 특정인재와 적격가족최장5년/NIA거류승인 다음 날/금카드1–3년. 더 낸 수수료가 기간을 구매하지 않음. |
| F11–F12 | 704 학생 승인부터5근무일 납부, 전자ARC≤6개월은 납부후 다운로드·출력 의무. 칩 카드 영수증 출력·납부후3근무일 뒤 지정센터 수령. 일반10/학생5근무일, 보완후 재계산, 일반 반환·보완·면담 제외. 보장된 수령일로 쓰지 않음. |
| F13·학생근로 | 705 nuolatinės studijos로 full-time, 유학전용 방문비자와 일반 무비자/도착/타목적 제외. 어학 적격 대학부설기관4개월완료+최소3개월추가등록/월–금15시간/휴가포함결석≤1/4/서류. 43·50조와 해당 학생 주20시간, 여름·겨울방학의 시간 예외만 명시. |
| F14 | 48조 면제의 주체는 호적 대만국민과 혼인하고 거류승인 받은 외국인. 외국전문인재의 배우자와 구별. 특정/고급인재 배우자는 가족거류 승인 후15조 직접 취업허가 신청. |
| F15–F17 | 706 본문표·FAQ에서 일반 만료전3개월의 신청 창, 주소·근무지 다음 날30일 내 등록 신청, 23-1 사유변경 발생일부터30일 NIA, 기타 발생일부터15일 BOCA/지소 비자 신청 뒤 NIA. 기관의 등록·발급 완료 기한으로 바꾸지 않음. 창업계속4개월/사업종료3개월/금카드갱신4개월도 정확한 사전 신청 창. |
| F18–F19 | 사유소멸시 NIA취소 의무와 조건부 계속거류 가능을 구별. DV 예시는 대만거주·호적 국민의 외국인 배우자, 폭력으로 이혼, 외국인 신청자의 재혼 없음. 노동쟁송 진행중·산재 치료중 보존. 초과거류<30일 AND 종전사유계속 AND 처벌후 재신청, APRC계산1년공제. |
| F20–F21 | 전문인재17조는 만료전신청/승인시 기존ARC·GC만료 다음날6개월/추가1회/총1년. 적격졸업생11조는 만료전신청 후 승인시 다음날1년/추가1회/총2년. 승인 완료까지 만료전에 강제하지 않음. 12조는 대만associate이상 이미취득·새졸업생·NIA승인연장 중 취업면제, 전학생·모든구직ARC로 확대하지 않음. |
| F22–F23 | 출국전 재입국허가·ARC유효기간/말소 연동·유효여권+APRC 예외. 특정 전문인재·가족 온라인 절차에서 신청 도중 출국하면 심사 종료, 실제 재입국 후 적격이면 새로 신청 가능. 모든 ARC의 출국금지나 재입국 보장으로 바꾸지 않음. |
| F24 | 중국어0902 직접 링크로 통지 다음 날15일, 필요한 미비자료를 해외/중국대륙/HK/Macau에서 받아야 할 때3개월 대체, 기간내 전부 보완 못하면 기각. 신청자가 해외에 있다는 사유나15일+3개월로 쓰지 않음. |
| 기타 | 여권 갱신의 개별절차와 주소변경30일을 구별. 분실자료는 경찰증명만 일률필수 아님, 재발급500과 거류연장 구별. 유효ARC/APRC의 여권 입국일유효 FAQ는 잃거나 만료된 카드·접수증에 확대하지 않음. 언어를 리투아니아 국적으로 가정하지 않음. |

제목·summary·FAQ도 위 조건과 함께 읽었다. 요약에서 선택적인 세부 전부를 반복하지 않는 것을 완전한 자격 열거로 표현하지 않았다. 가족 FAQ는 각 경로의 조건을 확인해야 한다는 요약이며 모든 ARC 보유자의 초청권을 보장하지 않는다.

## 실제 자체 수정

| 위치 | 이전 문장·표현 | 이유와 실제 수정 | 의미 보존 |
|---|---|---|---|
| 704 학생 수령 | `Gavus elektroninę ARC, ... po apmokėjimo ją reikia atsisiųsti ir atsispausdinti.` | 다운로드 전에 이미 전자ARC를 받았다는 순서 혼선을 피하려고 `Elektroninę ARC, kurios galiojimas neviršija šešių mėnesių, po apmokėjimo reikia atsisiųsti ir atsispausdinti.`로 정리. | ≤6개월·납부후·다운로드와 출력의 의무 모두 유지. |
| 704 재학 표 | `... studijų įrodymas pagal NIA sąrašą, kuriame numatytas einamojo semestro registracijos patvirtinimas arba studento pažymėjimas.` | `kuriame`의 긴 수식과 목록 번역투를 줄여 `... per pastarąjį mėnesį išduotas studijų patvirtinimas pagal NIA dokumentų sąrašą.`로 정리. | 최근1개월·등록 전후는 유지. 짧은 EN 수준의 증빙 설명이며 등록증명과 학생증을 모두 요구하지 않음. |
| 706 근로 | `nauja veikla turi būti padengta taikomu leidimu...` | 영어 covered를 직역한 `padengta`를 없애고 `Prieš pradedant dirbti pas naują ar papildomą darbdavį, būtinas tai veiklai taikomas darbo leidimas arba įstatyme nustatyta išimtis.`로 수정. | 실제 새/추가고용의 사전허가 또는 법정면제 조건 유지. |
| 706 온라인 출국 | `pareiškėjui išvykus nagrinėjimo metu` | `pareiškėjui išvykus dar vykstant prašymo procedūrai`로 바꿔 공식 申請過程 범위를 심사 활동에만 한정하지 않음. | 특정 온라인 절차/심사 종료/재입국 후 적격이면 may 유지. |
| 706 문단 시작 | `Darbo pabaigą patvirtinantis pranešimas...`, `Darbo pabaiga...` | MONOTONY: 시작 반복 — Darbo로 시작하는 문단4개 — 두 곳을 `Pranešimas apie darbo pabaigą...`, `Seno darbo pabaiga...`로 고침. | 서류·종료·허가·이사 날짜의 내용 그대로. 수치통과용 문장 삭제·도구 수정 아님. |

## 최근 세 편 비교와 §5

945는 지급한 비용과 권리귀속의 차이를 열고 버전·권한·재빌드 자료로 닫는다. 944는 실제 레이저 파일·교정 자료의 인도 목록으로 시작하고 일련번호·파일 버전·반환/삭제 조건으로 끝낸다. 899는 상표 출원인 필드로 시작해 출원·공고일별 기한으로 끝낸다. 새 ARC 글에 그 산업 장면이나 반복적인 문의 권유를 옮기지 않았다. 리투아니아어 정중한 설명체, 자연스러운 diacritics와 `„…“`, 구체적인 서류·날짜 중심을 이어간다.

| §5 | 실제 점검 |
|---|---|
| 1 공유 검사 | 최초 `--lang lt` 미지원 exit2를 보존한 뒤, 실제 지원 프로필 설치 후 같은 SHA에 exit0/FAIL0 확인. 다른 언어로 위장하거나 임의 문장분할 CV를 PASS 근거로 쓰지 않음. |
| 2 도입 | 704는30일이라는 기한, 705는 직접신청에 관한 독자 질문, 706은 사유소멸의 결과로 시작. stock 가상사례·범용 예고 없음. 첫 문단을 지우면 각각 기산·경로 차이·취소 효과가 사라짐. |
| 3 짧은 문장 | 704 `Originalai grąžinami po patikros.` / `Mokestis apskaičiuojamas pagal leistą laikotarpį.`; 705 `Priėmimo laiškas yra tik dalis dokumentų.` / `ARC išduodama tik patvirtinus šį prašymą.`; 706 `Išsaugokite jų datas.` / `Didesnė įmoka jo nepailgina.` 등 실제 완결된 정보 문장을 확인. 처음 측정 불가였던 short비율·CV는 말미 후속 검사에서 확인. |
| 4 시작 | 고지 포함20/21/25문단을 세로로 읽고 문자열 첫단어도 확인. 같은 첫단어 최다2/1/2회. 706의 실제 반복 수정은 위 표에 기록. 이 문자열 확인을 LT 문장 경계 검사라고 부르지 않음. |
| 5 인용 | 근거를 주어·문장 중간·절차 설명에 분산. 청구 문장 뒤 매번 단서를 복사하지 않음. 704수수료 결과,705방문자 경로,706서류 기간 등 인용 없는 설명 문단도 있음. |
| 6 대비 | 실제 권한·기간·수령 단계의 구별을 보존. 독자가 말하지 않은 국가나 날짜를 반박하는 문장 없음. 지원 프로필의 후속 contrast는 세 편 모두0. |
| 7 결말 | 704수령후확인과다음신청,705실제업무·학업·가족일정에맞춘제출,706실제귀환일을덮는서류로 끝남. 확인일·범위·공식출처는 구조적 꼬리로 분리. |
| 8 문체 | 경어를 섞은 설명체, 명령형 소제목·굵은강조·지어낸1인칭없음. 번역투 covered는 실제고침. |
| 9 의미·출처 | 공식URL EN기준9/9·15/15·13/13보존, 본문URL의끝목록누락0. KO/ZH공식URL합집합전체를동일복제했다고주장하지않음. 금액·기산·가상캡션검사. |

## 직접 재열람과 검사 증거

LT 집필 중 [NIA 학생0929](https://www.immigration.gov.tw/5475/5478/141465/141808/417829/cp_news), [인재법16조 중문](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16), [BOCA 어학거류](https://www.boca.gov.tw/fp-166-285-041cb-2.html)를 직접 열었다. 후속 집필에서는 [거류규칙 영문7·9·11·20조](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=D0080129), [인재법 영문8·9·12·15·16·17조](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295), [전문인재·가족 온라인9항](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/) 해당 본문도 다시 열었다. 직전 같은 세션에서 확인한 중국어0902·31조·여권FAQ 근거와 공통 사실표를 함께 썼다. 모든 링크의 26일 전수 새조사나 최신 관보 전수확인으로 표현하지 않는다.

- [lt-structure.mjs](../checks/lt-structure.mjs)를 Node24.14.1로 실행: [lt-structure.json](../checks/lt-structure.json), exit0/errors0. YAML실제파싱, 메타·원본이미지존재·FAQ·장식·공식출처집합·실제내부slug 확인.
- [lt-variety-before-profile.json](../checks/lt-variety-before-profile.json): 초안의 첫 실제 미지원 호출을 보존.
- [lt-variety-current.json](../checks/lt-variety-current.json): 위 동결SHA 세 편의 호출. 모두 exit2, stderr에 `invalid choice: 'lt'`. 검사전후SHA동일. 공유 도구 SHA는 `98056d054aadf197d953bbde78cfb4498dded0e11ca5bc724c61286184feb3ad`; `profiles/lt.json` 부재.

정본 아홉 편 SHA256:

| 원본 | SHA256 |
|---|---|
| EN704 | 610343da1255e2e873956c6de54bd0f9c72c6731aae9343bd7bae9884efdd39f |
| EN705 | 87a4ab6e9a5e8b434a30de0dc111307fc58e878a7534cef793e2a3e27be38304 |
| EN706 | 1ecf6acc92d181afb2820bb001d4e4d45cc4eeca823d2e32def25faebe119d71 |
| KO704 | cbf6b07b2d41c3b136ceac099f8d32152ca125c18478321610ffa715c29476a1 |
| KO705 | 727377648fcc7e2bd1d8ea8202bea5fb69f01174ce51a0ee422891126011d54a |
| KO706 | 4cd612086336cb1a3720111390ce7aca3f4eff5c7f96c5e92aea001fa7b8cfbc |
| ZH704 | 0c00bc06bf3c3c1860a95af4dbcea9eaab981300860916856295e8b947244468 |
| ZH705 | 290a50047632ad830ea98c524ffef6ed91c2b4c8d555a1844689824c3ffea7a3 |
| ZH706 | 4d70e78b9a197f4a2b81d25d61b6fa862ee849a6392d5fd905e90bcf781e721c |

한계: 작성자의 AI 자체 의미·문체 점검이다. 독립검수, 인간 원어민·변호사의 감수 승인, 브라우저·배포 확인을 대신하지 않는다. 처음 미해결이던 LT 지원 검사와 실제 경계 확인은 아래 후속 기록으로 닫았다.

## 후속 — LT 프로필 설치 후 실제 검사, 00:34–00:36 KST

root 검토를 거친 shared49 설치 통지를 받은 뒤 정확한 공유 경로의 `--lang lt`를 실행했다. [lt-variety-after-profile.json](../checks/lt-variety-after-profile.json)에 실제 stdout/stderr/exit/검사전후SHA를 저장했다. 세 원고는 앞 표의 SHA와 동일하며 이번 설치를 이유로 문장·법률조건·출처를 수정하지 않았다.

| 원고 | 실제 문장 | 평균 단어 | CV | short | run3 | opener_rep | 결과 |
|---|---:|---:|---:|---:|---:|---:|---|
| 704 | 74 | 12.3 | .478 | .324 | .069 | .050 | exit0 / FAIL0 |
| 705 | 77 | 13.3 | .451 | .247 | .093 | .000 | exit0 / FAIL0 |
| 706 | 92 | 13.1 | .482 | .283 | .078 | .040 | exit0 / FAIL0 |

공유 `strip_fm`→`body_blocks`→`sentences`를 직접 호출해 [lt-shared-extracted.json](../checks/lt-shared-extracted.json)을 남기고243개 실제 추출을 전부 읽었다. `2026 m. sausio 1 d.; ...`와 `2026 m. spalio 24–25 d. patikrintais šaltiniais.`가 날짜 약어에서 잘못 끊기지 않고, 문장 끝 인용부호·의문문·NIA/ARC·NT$1,000/NT$2,200/NT$500·23-1이 정상 단위로 남는 것을 확인했다. 법적 표·FAQ·목록은 추출 통계 밖이므로 위 별도 전문 의미검토에 포함했다. 원고에 맞춘 경계표나 검사기 변경은 없었다.

검사기 SHA256: `5abf02f52e35c45f921084106b6acf3c0caf0ca02f09649de1c1eb6977019b3e`. LT profile SHA256: `a91bc6f0a6d80aada83de9c463836b6c4c4d724eddc32ff18905b573642d3694`. Node24 경로와 `PYTHONDONTWRITEBYTECODE=1`을 사용했으며 공유 파일을 쓰지 않았다. 이 숫자는 의미·자연스러움에 대한 인간 승인과 구별한다.
