# SL 704–706 독립 의미·문체 검수

검수일: 2026-10-26 KST. 검수자 `/root/column_voice_rules`, 작성자 primary Codex `/root`. 아래 동결 원고와 저자 기록을 읽고, 공통 EN·KO·ZH 아홉 원문, F01–F24, 최근 SL 세 편 및 문체 규칙과 대조했다. 원고·저자 기록·R·공유 도구는 수정하지 않았다.

판정: 706에 필수 수정 2항목이 있다. M1은 미재혼 자격 요건의 표현, M2는 문단 시작 반복이며 제안한 수정은 합계 세 문장이다. 705 소제목에는 선택 제안 O1을 남긴다. 704에서는 필수 오류를 발견하지 못했다. 실제 공유 검사 세 편 모두 exit0/FAIL0이지만, 이 결과만으로 M1·M2를 해소한 것으로 보지 않는다. 변경 후 해당 문장·주변 문단과 실제 측정을 재확인해야 한다.

이 검수는 모델 기반 언어·의미 대조이며 사람 원어민 교정이나 대만 변호사의 법률 승인이 아니다. 검수자가 SL 측정 프로필을 구현했으므로 원고 작성자로부터는 독립되어 있으나 도구 자체의 독립 인증으로 표현하지 않는다.

## 동결본과 검수 입력

| 파일 | SHA-256 |
|---|---|
| `src/content/columns-sl/704-taiwan-arc-first-application.md` | `a87a3ac1137b0012120a56629dccc0e0d64dcbb55a2e2a6110e2be213cde6bd6` |
| `src/content/columns-sl/705-taiwan-visa-residence-work-study-family.md` | `817393175801756e47f9ae7176d2b4336b0fdb47fca765b8dab4edcb9262cbbc` |
| `src/content/columns-sl/706-taiwan-arc-renewal-changes-reentry.md` | `c85cb2409fa70abca79392f127d2948f33684e89f9b42cde4410a569139e2243` |
| `reviews/sl-author.md` | `1e3bb5eb255f4e7b086ad616d9fbaef0535d7ffec267d7c12ba57388b72afc79` |

표는 batch05 기준이다. 저자 manifest의 현행 원문 아홉 개·최근 SL 세 개·대상 세 개의 실제 해시는 모두 일치했다. 검수에 사용한 34개 파일의 해시는 [입력 기록](../checks/sl-independent-inputs.json)에, 최종 재확인 및 산출물 해시는 [manifest](../checks/sl-independent-manifest.json)에 있다.

읽은 기준은 batch02–05 BRIEF와 R의 AGENTS·all-locales BRIEF, F01–F24, source-refresh, 현행 EN·KO·ZH 704–706 전문, FRONTMATTER, 최신 SL 896·895·894 전문이다. 공통 편집 정본·문장 다양성 규칙·LESSONS는 연속 LT/SL 검수에서 전문을 읽어 적용했다. 종료 확인에서 34개 입력 중 33개는 동일했고, 자동 생성되는 LESSONS만 2026-10-26 01:04 KST 버전으로 바뀌어 새 전문을 다시 읽고 [사본](../checks/sl-independent-lessons-current.md)을 보존했다. 새 교훈은 이 검수의 결론을 바꾸지 않았다. 홈 `~/agent-library/knowledge/editorial-voice.md`는 없으므로 그 파일을 읽었다고 기록하지 않는다. 확인 가능한 `R/docs/columns/EDITORIAL-VOICE.md` 전문과 `~/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, 공유 `SENTENCE-VARIETY-RULE.md`·`LESSONS.md`를 사용했다. 폐기된 Fable 강제 절차는 적용하지 않았다.

## M1 — 706 65행: 미재혼 상태를 재혼 금지로 읽히지 않게 수정

- 문제 문장: `Pri izjemi zaradi razveze po nasilju v družini mora iti za tujega zakonca tajvanskega državljana, ki prebiva na Tajvanu in ima gospodinjsko registracijo; tuji prosilec se po razvezi zaradi tega nasilja ne sme ponovno poročiti.`
- 이유: 주체는 외국인 신청자로 정확하지만 `ne sme ponovno poročiti`는 앞으로 재혼해서는 안 된다는 금지로 읽힌다. [이민법 제31조 제4항 제2호](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080132)의 조건은 가정폭력 때문에 이혼했고 재혼하지 않은 상태다. 이 거류 예외가 별도의 일반적 재혼 금지 의무를 만든다는 설명으로 바꾸지 않아야 한다.
- 수정안: `Pri izjemi zaradi razveze po nasilju v družini mora iti za tujega zakonca tajvanskega državljana, ki prebiva na Tajvanu in ima gospodinjsko registracijo; pogoj je tudi, da se tuji prosilec po razvezi zaradi tega nasilja ni ponovno poročil.`
- 의미 보존: 대만인 상대방의 대만 거주 AND 호적등록, 외국인 신청자의 가정폭력 이혼 AND 미재혼을 모두 유지한다. 바로 다음 문단의 NIA가 허용할 수 있다는 재량·조건별 심사는 그대로 둔다. 새 결혼을 금지하는 독립 의무나 법원 판결만 가능한 추가 조건을 만들지 않는다.

언어 판단을 보조하기 위해 공식 Fran의 SSKJ² `sméti` 항목을 읽었다. 부정형이 금지의 의미를 나타낸다는 사전 설명과도 부합한다. [해당 사전 항목](https://fran.si/133/sskj2-slovar-slovenskega-knjiznega-jezika-2/4532045/smeti)의 본문은 Fran 검색 화면에 표시된 항목에서 확인했고, 개별 항목 URL은 도구에서 접근 오류가 났다. 이 사전은 슬로베니아어 표현의 근거일 뿐 대만 법률의 근거는 아니다.

## M2 — 706: 수동 문체 기준의 문단 시작 반복

MONOTONY: 같은 문단 시작어 반복 — `Za spremembo naslova …`(57행), `Za upravičene strokovnjake …`(69행), `Za prvo vprašanje o sporu …`(75행); `Pri menjavi delodajalca …`(59행), `Pri otrocih …`(67행), `Pri določenem spletnem postopku …`(89행) — 문의를 받는 사무소와 심사를 처리하는 NIA를 먼저 써서 반복을 줄인다.

실제 도구는 §5(1)의 긴 글 예외에 따라 25개 문단의 한도인 문단 수/8을 적용해 3회를 통과시켰다. 이를 FAIL로 바꿔 기록하지 않는다. 다만 [문장 다양성 규칙](/Users/son7/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md)의 §2-3은 같은 시작어 두 문단까지, §5(4)는 세 번 이상 여부의 수동 점검을 요구한다. 수동 항목 하나의 지적을 §6의 전체 문체 자동 FAIL로 표현하지 않는다. 실제로 남은 반복에 대한 수정 요청이며, 임계값 조정 대신 아래 두 문장만 재배열하는 방향을 제안한다.

### M2a — 75행 문의 문단

- 문장: `Za prvo vprašanje o sporu, ki vpliva na prebivanje, lahko pisarni Hovering International Law Firm na wei@hoveringlaw.com.tw navedete dogodek, pomembne datume in neobčutljiv povzetek.`
- 이유: 세 번째 `Za` 문단이며, 이미 최근 SL896의 문의 문단도 같은 `Za … vprašanje` 구조를 쓴다. 기관을 먼저 두면 실제 문의 대상이 바로 보인다.
- 제안: `Pisarni Hovering International Law Firm lahko na wei@hoveringlaw.com.tw pošljete prvo vprašanje o sporu, ki vpliva na prebivanje, z navedbo dogodka, pomembnih datumov in neobčutljivega povzetka.`
- 의미 보존: 같은 이메일 링크를 유지한다. 문의 가능성, 사건·날짜·비민감 요약의 범위와 뒤의 개인정보·상담언어·관계 성립 제한은 그대로다. 대행·승인·추가 언어 서비스를 약속하지 않는다.

### M2b — 89행 온라인 신청 문단

- 문장: `Pri določenem spletnem postopku za tuje strokovnjake in njihove družine NIA po odhodu prosilca med prijavo obravnave ne nadaljuje.`
- 이유: 세 번째 `Pri` 문단이다. 심사를 중단하는 행정기관을 먼저 써서 주체도 명확히 할 수 있다.
- 제안: `NIA v določenem spletnem postopku za tuje strokovnjake in njihove družine po odhodu prosilca med prijavo obravnave ne nadaljuje.`
- 의미 보존: `določenem spletnem postopku …`에 붙은 동일 NIA 링크를 유지한다. 특정 온라인 경로에서 신청 중 출국하면 심사가 계속되지 않는 F23 효과는 그대로이며, 다음 문장의 재입국 후 IF 적격 THEN MAY 재신청도 그대로 둔다. 전면 출국 금지로 확대하지 않는다.

## O1 — 선택: 705 36행 소제목의 허가 대상

- 제목: `Ponudba za delo potrebuje ustrezno dovoljenje`
- 이유: 제목만 읽으면 채용 제안 자체에 허가가 필요하다는 뜻으로도 보인다. 본문은 제안과 실제 근로 권한을 정확히 구별하므로 본문의 필수 의미 오류로 판정하지 않는다.
- 제안: `Začetek dela zahteva dovoljenje ali zakonsko izjemo`
- 의미 보존: 허가가 필요한 대상은 실제 근로이며, 법정 면제도 함께 보존한다. 채용 제안의 효력이나 고용주의 신청 절차를 새로 바꾸지 않는다.

## 의미 대조 결과

| 범위 | 확인한 내용과 결과 |
|---|---|
| F01–F02 / 704 요약·FAQ1·26–42행 및 표 | 거류비자와 거류허가를 전제로 입국 다음 날부터 30일, 대만 내 비자 발급일부터 30일을 구별한다. 유효 통합증명 예외가 있고 모든 방문자에게 30일 전환권을 주지 않는다. |
| F03 / 704 40행·705 38–44행·FAQ1 | 본인의 전문업무 허가 OR 면제, 두 전문인재 범주, 적격 입국, NIA 승인 후 ARC 발급이다. 제안서가 취업허가를 대체하지 않는다. 시범 입국 등의 제외와 다른 규정의 예외, 별도 노동자 체계를 유지한다. |
| F04 / 705 60–62행 | 일반 외국전문인재 AND 대만 전문업무 OR 특정전문인재로 나누고, 두 범주 모두 NIA 거류 OR 영주허가를 요구한다. 전문업무 조건을 특정전문인재에게 추가하지 않았다. 배우자·미성년·장애로 자립할 수 없는 성년 자녀, 가족 입국과 승인 조건도 있다. |
| F05 / 705 58행·FAQ3 | 대만인 초청자의 대만 거주·호적등록을 유지한다. 60일은 유효 비자가 허용하는 체류기간이며, 비자 자체 유효기간으로 바뀌지 않았다. 연장 금지 등 제한 부재를 함께 적었다. |
| F06–F08 / 704 46–56행·문서 목록 | 사진 최근 2년, 재직 최근 1개월, 등록 전 입학자료와 등록 후 최근 재학자료 OR 학생증을 구별한다. 학생증과 증명서를 누적 의무로 만들지 않았다. 대만 거주·호적 국민과의 최초 배우자 ARC 최장 1년 및 배우자 동행, 해외문서 인증 의무와 번역 요구 가능성을 보존한다. |
| F09–F10 / 704 68–70행·FAQ2, 705 68행, 706 51·81행 | NT$1.000/년, 미만 1년분, 해당 경로 NT$2.200, 僑生 한정 절반, 재발급 NT$500다. 점은 천 단위 표기이며 금액이 바뀌지 않았다. 일반 3년·특정전문인재와 적격 가족 5년·금카드 1–3년을 구분한다. 704는 제8조의 개별 기산일을 별도로 단정하지 않으므로 취업허가일로 잘못 옮겨진 표현도 없다. |
| F11–F12 / 704 72–74행 | 일반 심사 10근무일의 제외기간·보완 후 재계산, 학생 심사 5근무일, 승인부터 납부 5근무일과 납부 뒤 IC 수령 3근무일을 구별한다. 전자 ARC 6개월 이하에는 납부 후 다운로드 AND 인쇄 의무가 있다. 학생 수령 절차를 모두에게 적용하지 않는다. |
| F13 / 705 48–54행·FAQ2 | 정규 full-time 학업과 어학 경로, 비자 목적 제한을 유지한다. 어학 4개월 이수와 최소 3개월 추가 등록, 월–금 주15시간, 허가된 결석 포함 1/4 이하가 정확하다. 학생의 주20시간 규칙과 여름·겨울방학 예외를 정했고, ARC만으로 근로 허가가 생긴다는 설명은 없다. |
| F14 / 704 FAQ3·76행, 705 64행, 706 59·73행 | 거류와 실제 업무·고용주의 근로 권한을 구별한다. 대만 호적 국민과 혼인한 허가 거주자의 제48조 면제와, 적격 특정·고급 전문인재 배우자의 제15조 자체 허가 신청을 구별한다. 제15조 문단은 짧은 EN 정본처럼 ‘유자격 배우자’로 요약하며, 근로허가가 허가된 가족 거류기간을 넘지 않는다는 설명도 있다. |
| F15–F17 / 706 FAQ1–2·34–41행·57행 | 만료 전 3개월 범위, 주소·근무장소 변경 다음 날부터 30일 신청, 사유변경 발생일 30일 NIA와 그 밖의 발생일 15일 BOCA 신청을 구별한다. 만료 전 정확히 한 날짜를 지정하거나 기관 처리 완료기한으로 만들지 않는다. 사업 유지 창업가 4개월·사업 종료 별도 경로 3개월·금카드 갱신 4개월도 구별한다. |
| F18–F19 / 706 26·53·65–67행 | 사유 소멸 시 NIA 취소와 법정 계속거류 재량을 구별하고 노동분쟁 절차 진행·산재 치료 중 조건을 유지한다. 가정폭력 이혼의 외국인 신청자와 대만인 상대의 거주·호적은 정확하나 미재혼 표현은 M1 수정이 필요하다. 초과 30일 미만 AND 사유 존속, 처벌 후 재신청과 영주 산입 1년 공제를 유지한다. |
| F20–F21 / 706 69–73행 | 제17조 만료 전 신청·승인 시 종전 만료 다음 날부터 6개월·추가1회·총1년과 졸업생 1년·추가1회·총2년을 구별한다. 신청 전에 승인까지 완료해야 한다는 조건을 만들지 않았다. 어학 수료와 법정 졸업을 구분하며, 추가 거류기간의 근로에 별도 근거가 필요하다는 문단이 있다. 대만 associate degree 이상 기취득·신규 졸업생·NIA 승인 기간이라는 제12조 면제 조건을 모두 유지한다. |
| F22–F23 / 706 FAQ3·81–91행 | 출국 전 재입국허가, ARC 유효기간·말소와의 관계, 유효 여권+APRC 예외를 보존한다. 접수증·사진·해외 처리 가능성을 탑승·입국 보장으로 쓰지 않는다. 특정 전문인재·가족 온라인 경로의 출국 시 심사 중단과 적격 재입국자의 새 신청 가능성도 정확하다. M2b는 이 효과를 그대로 보존하는 문체 수정이다. |
| F24 / 704 64·72행 | 통지 다음 날부터 달력 15일, 해당 지역에서 자료를 받아야 하는 경우 3개월 대체기간, 기한 내 불완전 보완도 기각, 보완 뒤 일반 심사 재계산을 유지한다. 15근무일 또는 15일+3개월이 아니다. |

제목·요약·아홉 FAQ와 704의 문서 목록·기산 표, 706의 기한 표를 본문과 따로 읽었다. 이민법을 슬로베니아 법으로 바꾸거나 언어만으로 독자의 시민권을 단정하지 않았다. 짧은 EN 원문에 없는 더 상세한 숫자·하위 절차를 빠뜨렸다는 이유만으로 새 필수 차단을 만들지 않았다.

법률 대조에는 연속 검수 중 직접 읽은 [인재법 제16조 중문](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16), [인재법 영문 제12·15·16·17조](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295), [이민법 현행 중문 제31·34조](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080132), [거류 규칙 제11·12조](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=D0080129), [NIA 0902 중문](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/29996/), [학생 0929](https://www.immigration.gov.tw/5475/5478/141465/141808/417829/cp_news), [온라인 전문인재·가족 주의9항](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/)을 사용했다. 단일조문 접근 실패와 현행 전문으로의 확인 등 범위는 [출처 기록](../checks/sl-independent-sources.json)에 있다. 법무부 데이터 기준일은 2026-10-16 표시였으며 이후 관보 전수조사를 주장하지 않는다.

706의 이메일 및 네 상담언어는 실제 [현재 contact 본문](https://tseng-law.com/en/contact)의 영어·중국어·한국어·일본어와 일치한다. 슬로베니아어 상담이나 승인 보장은 없다. 사이트의 문서 존재 확인을 개별 사건 자문 가능 여부나 문의 전송으로 확대하지 않았다.

## 최신 SL 세 편과 비교

최신은 실제 발행일·같은 날 번호 기준으로 896·895·894이며 저자 manifest와 파일 해시가 일치했다. 세 편 전문을 읽었고 제목·도입·실질 결말을 다시 뽑아 비교했다.

| 최근 글 | 실제 도입·결말 | 새 세 편과의 차이 |
|---|---|---|
| 896 `Dedič v Sloveniji, zapuščina na Tajvanu: listine in roki` | 계좌정보 조회 위임과 계좌폐쇄·금전수령 위임의 범위로 시작한다. 끝은 상속권을 안 날짜와 이를 증명하는 기록이다. | 704는 비자 발급일·입국일, 705는 입학허가와 입국 상태, 706은 임대·고용 변경의 절차다. 같은 위임 장면은 없다. 단, 706 문의 문단의 `Za … vprašanje` 시작 반복은 M2a에 기록했다. |
| 895 `Iz Slovenije na delo na Tajvan: dovoljenje, ARC in družina` | 허가 심사 중 근무를 시작할 수 있는지 묻고, 가족별 거류 승인·관계서류를 기록하며 끝난다. | 전문인재·가족이라는 법률 주제는 겹치나 새705는 학생과 가족별 입국 선택을 다룬다. 기존 질문 도입을 그대로 재사용하지 않고, 고용 허가·체류 허가 용어는 필요한 곳에 유지했다. |
| 894 `Menjava distributerja na Tajvanu: zaloge, servis in odpoved` | 허구의 전동기 공급자가 유통사를 교체하는 상황이다. 끝은 주문별 담당자와 서비스 인수일이다. | 새 ARC 세 편은 가짜 고객·사건 장면을 만들지 않았다. 제목도 기산 질문, 입국 지위 질문, 변경·귀환 절차로 나뉜다. |

실질 결말은 704의 승인 데이터와 카드 대조·후속 변경, 705의 현재와 변경 뒤 목적, 706의 실제 귀환일에 유효한 증명으로 다르다. 뒤의 출처 확인일 및 별도 신분제도 고지는 필요한 적용 범위 표기로 취급했다.

## 실제 공유 검사와 경계

다음 명령을 검수자가 직접 실행했다. Node24 PATH와 `PYTHONDONTWRITEBYTECODE=1`을 사용했고 실행 전후 원고 SHA가 같았다.

```sh
PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH PYTHONDONTWRITEBYTECODE=1 python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check --lang sl /Users/son7/tseng-all-language-columns-20261025/batch05/src/content/columns-sl/704-taiwan-arc-first-application.md
PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH PYTHONDONTWRITEBYTECODE=1 python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check --lang sl /Users/son7/tseng-all-language-columns-20261025/batch05/src/content/columns-sl/705-taiwan-visa-residence-work-study-family.md
PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH PYTHONDONTWRITEBYTECODE=1 python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check --lang sl /Users/son7/tseng-all-language-columns-20261025/batch05/src/content/columns-sl/706-taiwan-arc-renewal-changes-reentry.md
```

| 항목 | 704 | 705 | 706 |
|---|---:|---:|---:|
| exit / FAIL | 0 / 0 | 0 / 0 | 0 / 0 |
| 본문 추출 단위 | 60 | 69 | 82 |
| 문단 | 18 | 21 | 25 |
| 길이 CV | 0.577 | 0.480 | 0.483 |
| 짧은 단위 비율 | 0.333 | 0.246 | 0.159 |
| 같은 길이 3연속 | 0.017 | 0.060 | 0.050 |
| 최다 시작어 횟수 | 2 | 2 | 3 |
| 같은 시작어 연속 | 0 | 0 | 2 |
| 문장 끝 괄호 인용 | 0.017 | 0 | 0 |
| 도구 대비식 계수 | 0 | 0 | 0 |

공백·정서법 기반 `orthographic_words`, 짧음8·긺32의 고정 휴리스틱이다. 문장·단위·리듬 수치는 자연언어 단어의 정답이나 원어민 가독성 교정치가 아니다. 같은 프로필을 다른 언어의 승인 척도로 해석하지 않는다. 전체 실제 출력·추출 배열은 [검사 기록](../checks/sl-independent-variety.json)에 있다.

211개 추출 단위를 전부 원문과 비교했다. `22. člen`, `43. in 48. členu`, `4. in 5. člen`, `7. in 9. člen`, `23-1. členu`, `24. in 25. oktobra 2026.`, `NT$1.000`, `NT$2.200`, 이메일 주소가 해당 문장 안에 유지된다. 새 문장이 앞 문장에 합쳐지거나 숫자·서수에서 잘못 분리된 사례는 찾지 못했다. 704의 #19 `Del dokumentacije je vezan na razlog prijave:`는 콜론으로 끝나는 목록 도입 문단도 한 단위로 세는 현행 방식의 사례다. 목록 항목·표·FAQ는 본문 지표에서 제외하므로 별도로 대조했다. `Uradni viri` 이하 출처 목록은 측정에 섞이지 않았다.

저자의 최초 시작어 FAIL 및 수정 이력은 저자 기록의 증거로 보존한다. 검수자가 그 과거 실행을 독립 재실행했다고 주장하지 않는다. 이번 검수에서 미지원 exit2는 발생하지 않았으며 만들어 기록하지 않았다.

## §5 수동 점검

| 항목 | 결과 |
|---|---|
| 1 실제 측정 | 세 편 올바른 locale로 exit0/FAIL0. 706의 기계 통과와 M2 수동 지적을 구별했다. |
| 2 도입 | 세 글 모두 공식 가정·가짜 상담 장면이 없다. 날짜, 입학과 입국, 변경 근거의 실제 사안으로 시작한다. |
| 3 길이 | 704 `ARC dobijo po odobritvi.`·`Gre za koledarske dni.`; 705 `Nekateri obiskovalci lahko zaprosijo neposredno pri NIA.`·`Plačana šolnina teh pogojev ne nadomesti.`; 706 `Novo razmerje je treba dokazati.`·`Takoj se obrnite na NIA.` 등 짧은 문장이 있다. 긴 문장 세 개의 연속은 관찰하지 못했다. |
| 4 시작어 | 704·705는 최대2회다. 706은 `Za`·`Pri` 각각3회로 M2 수정 필요. `consec_same_start=2`는 도구의 별도 측정치이며 이 문단 횟수 지적을 없애지 않는다. |
| 5 주장·단서 | ‘주장→조문→다만’ 세 문단 연속은 관찰하지 못했다. 서류 보관·현실 일정·실제 귀환 등의 인용 없는 문단이 있다. |
| 6 대비 | 도구 대비식0. 근로허가·거류허가와 일반/특정 경로의 구별은 실제 법적 의미를 위해 필요하며 가상의 독자 반론을 반복하지 않는다. |
| 7 결말 | 카드 대조, 목적 변경, 귀환 증명으로 실질 결말을 구별했다. 706 문의 문단은 마지막이 아니며, 범위 고지를 판촉 결말로 바꾸지 않았다. |
| 8 문체 | 공개 저자·AI 표기, 굵은 강조, 수동 bidi, 허구 경력은 없다. KO/JA 종결형 규칙을 SL에 기계적으로 적용하지 않는다. 705 소제목 O1은 허가 대상의 명확화 제안이다. |
| 9 의미 | 표·FAQ·본문의 단위·기산·AND/OR·허가 주체와 출처를 대조했다. M1을 고쳐야 하며 수치 통과로 이를 면제하지 않는다. |

## 구조와 다음 확인 범위

[구조 검사 기록](../checks/sl-independent-structure.json)은 실제 gray-matter 파싱과 파일 확인 결과 오류0이다. 메타 날짜는 2026-10-26·`26. oktobra 2026`, audience=[sl], topic=visa, 내부 author=legal-ai-assistant, FAQ3개, 원본 이미지·`Izmišljen prizor`가 맞다. 본문 공식 URL10/15/14개는 각 말미에도 모두 있다. 강조·숨은 방향 제어 문자는 없다.

내부 링크10개 중 SL 상호 링크6개는 현재 batch05 파일로 확인했고 아직 R에는 없다는 상태를 기록했다. EN 링크4개는 R의 실제 파일과 영어라는 표시를 확인했다. 이는 공개 HTTP·렌더·검색 노출 검증이 아니다.

M1과 M2를 고친 뒤 원고 SHA와 실제 검사 결과, 바뀐 문장 및 주변 문단을 재확인하면 된다. 기존 기록과 이번 동결본 보고서는 그대로 남긴다. root 통합 및 공개 검증, 사람 원어민·변호사의 검토는 이 보고서가 대신하지 않는다.
