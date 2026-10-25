# RO 704–706 독립 의미·문체 검수

검수일: 2026-10-25 KST. 작성자 `column_deploy`와 다른 역할인 `column_source_quality`가 검수했다. AI의 독해·자료 대조 기록이며 인간 원어민·변호사 승인 또는 공개 배포 확인이 아니다.

판정: 필수 수정 1건, 선택 문체 수정 2건. 핵심 가족·기산·예외 조건은 유지되었고, 706의 사업 종료 후 3개월 신청 창구를 명료하게 고쳐야 한다. 공유 `--lang ro` 검사는 세 편 모두 exit 0 / FAIL 0이다.

이 파일만 수정했다. 원고·검사기·작성자 리뷰를 변경하거나 커밋·배포·외부 전송을 하지 않았다.

## 고정 원고와 검수 자료

원고 디렉터리: `/Users/son7/tseng-all-language-columns-20261025/batch02/src/content/columns-ro/`.

| 원고 | 검수 시작 SHA-256 |
|---|---|
| 704-taiwan-arc-first-application.md | `18719195150cfd99bba855871a65ad19175cd53f369de4d8378f3b038c4c6e99` |
| 705-taiwan-visa-residence-work-study-family.md | `4921d36135847a3a0c3ae74e240f407fef0a5bc304ebc2c91a438b0577323053` |
| 706-taiwan-arc-renewal-changes-reentry.md | `24eff366e8e47be7449299abc85d4474b826516797c716d1ae64ca94a1338962` |

세 원고의 제목·요약·FAQ·본문·출처를 전부 읽었다. 최신 EN/KO/ZH 9편은 같은 세션에서 전문을 읽었고, 이번 검수에서도 기준 commit `ef3b24e73d84968eea08ea9d58e991ccbbf83fa8` 대비 `git diff --exit-code`가 출력 없이 exit0인 것을 확인했다. 따라서 앞서 읽은 정본과 동일하다. `arc-source-facts.md` F01–F24, source-refresh, 두 BRIEF, 공통 editorial voice·FRONTMATTER·COLUMN-VOICE-RULE·SENTENCE-VARIETY-RULE·LESSONS도 이 세션의 전문 열람에 따라 적용했다. 공통 facts SHA는 `4776f60010172120e0812d8d552123aeb5c7cc0b467cb5306ca031a1e17c2145`다.

RO 최근3편은 2026-10-24 게시일의 884·883·882이며 모두 전문을 읽었다. 작성자 `ro-author.md`는 원고 자체 독해·판정 후 읽어 SHA 및 자체 검사와 구별했다. 작성자의 통과 주장을 독립 판정으로 복사하지 않았다.

공식 1차자료는 공통 facts의 직접 확인·전일 조사 구분을 유지한다. 이번 RO 검수에서는 [현행 이민법 중문 전문](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080132)의 31조를 다시 직접 읽어 DV·이혼 후 자녀·노동쟁송·산재 조건을 확인했다. 단일31조 URL은 재접속 오류가 있어 전문을 이용했다. NIA 창업가348924 주의6과 전문인재 온라인 주의9는 바로 앞 독립검수에서 같은 세션 중 직접 재열람한 본문과 대조했다. 모든 법령·관보를 새로 전수 열람했다는 주장은 하지 않는다.

## 필수 수정 M01 — 706 종료 사업 경로의 신청 창구

- 문제 문장: `Același ghid are o cale distinctă, cu trei luni înainte de expirare, pentru continuarea rezidenței după încetarea afacerii.`
- 이유: `cu trei luni înainte de expirare`는 만료 정확히3개월 전의 시점으로 읽힐 수 있다. 같은 단락의 계속사업·GoldCard는 `în cele patru luni`로 기간을 명확히 쓰지만, 사업 종료 경로에서는 신청 창구라는 의미가 빠졌다. [NIA 창업가 안내](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/348924/)의 주의6은 기존 거류 만료 전3개월 이내에 신청할 수 있다고 한다(`得於居留期限屆滿前三個月內`).
- 수정안: `Același ghid prevede o cale distinctă pentru continuarea rezidenței după încetarea afacerii; cererea poate fi depusă în cele trei luni anterioare expirării rezidenței actuale.`
- 의미 보존: 조건부 신청 가능성을 `poate`로 유지한다. 사업유지 창업가의4개월과 종료후별도3개월을 구분하고, 만료후유예나 일반ARC전체의 창구 변경을 만들지 않는다. URL·해당 카테고리를 그대로 보존한다.

## 선택 문체 수정

### S01 — 705 취업허가 면제 문장의 관계절

- 문장: `Un străin căsătorit cu un cetățean taiwanez cu înregistrare în registrul gospodăriilor, căruia i s-a aprobat rezidența, beneficiază de scutirea de permis prevăzută de articolul 48.`
- 이유: 문맥상 허가 대상은 외국인임을 알 수 있으나 `căruia`와 외국인 주어 사이에 대만 국민 설명이 길게 들어가 있다. 관계절을 바로 주어 뒤로 옮기면 행위 대상이 더 빨리 드러난다. 문맥 전체가 잘못된 승인 대상을 단정한다고 보지는 않아 선택 개선으로 분류했다.
- 수정안: `Un străin căruia i s-a aprobat rezidența și care este căsătorit cu un cetățean taiwanez înscris în registrul gospodăriilor beneficiază de scutirea de permis prevăzută de articolul 48.`
- 의미 보존: 외국인의 승인거류 AND 대만호적국민과 혼인이라는 요건과 기존48조 링크를 유지한다. 외국전문인재 배우자에게 면제를 확대하지 않는다.

### S02 — 704 접수기록 단락의 추가 반박

- MONOTONY: 반복되는 비대체 설명 — `Mesajul unui intermediar că „actele au fost trimise” nu înlocuiește dovada primirii de către NIA.` — 이미 제시한 접수번호·제출사본·보완통지를 중심으로 정리하는 방향.
- 이유: 앞의 `Păstrați numărul dosarului și copiile actelor depuse`와 통지내용 설명만으로 기록 보관 행동이 구체적이다. 중개자의 가상 메시지를 추가하면 이 글에서 이미 필요한 여러 법적 부정과 같은 반박형 설명을 하나 더 만든다. 실제 의뢰인 사례로 단정하는 문장은 아니지만 새 대화가 없어도 절차 설명이 완결된다.
- 수정안: 이 마지막 문장만 삭제한다.
- 의미 보존: 접수번호·제출사본·보완통지·기한과 NIA 접수절차는 그대로다. 법적 의무·권한·기한·출처를 삭제하는 제안이 아니며 전체 문체 반려 사유로 확대하지 않는다.

## 핵심 명제 대조

| 항목 | 결과 |
|---|---|
| F01–03 | 704 입국+거류허가 다음날30일과 국내비자발급일부터30일, 유효통합증명 면제가 본문·FAQ에서 분리됐다. 방문자에게 보편적30일을 주지 않는다. 705 직접신청은 적격전문인재·허가OR면제·무비자/방문비자·NIA승인 조건이다. 취업제안은 허가가 아님을 명시했다. |
| F04 | `un profesionist străin care desfășoară activitate profesională în Taiwan sau un profesionist străin din categoria specială` 후 두 경우 모두NIA거류OR영주허가를 명시했다. 가족은 배우자·미성년·장애로자립불가성년자녀이며 부모/다른성년자녀를 제외한다. 전문업무를특정전문인재전체에확장하지 않았다. |
| F05 | 배우자는 대만거주AND호적등록 국민. `viză ... permite o ședere de cel puțin 60 de zile`는 체류허용기간이고 비자유효기간이 아니다. 제한표시와법정제외를 유지했다. 일부근로자부양제외의전체열거가없다는이유로추가를강제하지 않았다. |
| F06–08 | 사진2년, 재직/재학최근1개월, 입학/등록 구분, 관계·초청자신분/거류자료,실제주소. 인증의무와 번역요구가능을 구별했다. 대만거주·호적배우자 최초ARC `cel mult un an`·동행·혼인등록을 보존했다. 사진6개월비교나문서대안전체목록을단순히없다는이유로필수추가하지 않았다. |
| F09–12 | 연1.000NT$,1년미만연단위,가산2.200NT$,僑生한정50%. 일반3년,적격특정5년·NIA허가다음날,GoldCard705의1–3년과9조. 일반10근무일·반환/보완/면담제외·보완후재기산. 학생심사5근무일·승인후납부5근무일·납부후IC수령3근무일·전자6개월이하를구별했다. |
| F13–14 | 어학4개월+추가최소3개월,주중15시간,휴가포함1/4한도;학생일반무비자·도착비자·타목적전환불가. ARC와취업허가,대만호적국민배우자면제와전문인재배우자직접신청을구별했다. S01은명제수정이아닌관계절배치제안이다. |
| F15–17 | 일반만료전3개월,주소/근무지변경다음날30일,사유변경발생일30/15일. 계속사업·GoldCard4개월은정확하다. 종료사업3개월문구만M01이다. |
| F18 | NIA취소·카드말소와조건부계속거류를구별했다. DV는폭력때문이혼·대만거주/호적국민·재혼없음. 자녀문단은이혼후·대만호적미성년·양육/권리의무/면접교섭의대안을유지한다. 노동쟁송은대만고용주와절차진행중,산재는치료중이다. 실제31조와대조했다. |
| F19–21 | `<30일`AND기존사유계속·제재후재신청·APRC계산1년공제. 기존허가자동연장아님이새허가기간을금지하지 않는다. 전문6개월+1회총1년,졸업1년+1회총2년,만료전신청·이전만료다음날기산. 대만associate이상취득·신규졸업·NIA연장승인중취업면제,졸업예정자/어학종료와구별했다. |
| F22 | 출국전일반재입국허가·ARC기간상한·말소연동. APRC+유효여권예외를본문에명시하고접수증/카드사진을여행문서로만들지 않았다. FAQ의일반답에본문예외를다시모두열거하도록요구하지 않았다. |
| F23 | 지정온라인 `examinarea cererii încetează`;재입국후2항자격충족시 `se poate`재신청. 모든ARC출국금지로확대하지 않았다. 출처목록 `nota 9`도정확하다. |
| F24 | 일반보완 `15 zile din ziua următoare notificării`;앞뒤심사기간은명시적으로 `zile lucrătoare`여서15일을근무일로바꾸지 않았다. 해당지역에서부족/불일치서류를발급받아야할때3개월이며15일에가산한다고하지 않는다. 불완전/기한내미보완기각을보존했다. |

## 문체·최근3편·§5

884는 `Șapte zile după accident...`라는 경찰자료 신청 개시일, 883은 루마니아 여권·취업 질문, 882는 가상 목재 패널 미지급 장면으로 시작한다. 새 704는 입국 거류 신청 의무와 기산, 705는 입학서와 무비자 학생 전환의 구체적 제한, 706은 사유가 끝났을 때 만료일까지 체류할 수 있는지 묻는 질문으로 다르게 시작한다. 기존의 국적별 조건이나 가상 장면을 복제하지 않았다. 소제목도 첫 신청의 문서·수령, 705의 분류별 자격, 706의 변경·여행으로 주제에 맞는다.

첫 두 문단을 문장별로 보았다. 704는 의무·기산·기관·면제와 국내 비자 발급 기산, 705는 학생 절차 제한·전문인재 예외와 국적·여권·관할 공관, 706은 실제 질문·취소·조건부 예외와 사건일·증빙을 담고 있다. 범용 예고로 삭제할 첫 문장은 없다.

실질 끝맺음은 704의 발급 사항과 보관 자료, 705의 새 활동 시작일과 그 승인, 706의 실제 귀환일과 유효 문서다. 상담은 706에 한 번이며 루마니아어 상담을 약속하지 않는다. 구조적 출처 날짜·외국인 적용 범위 고지는 실질 끝맺음과 구분한다.

§5: 실제 도구 FAIL 0, 정형 가상 도입 없음, 짧은 문장 각 2개 이상(`Adresa trebuie dovedită.`, `NIA stabilește durata.`, `Oferta acceptată nu autorizează munca.` 등), 같은 문단 첫 단어 과잉 없음, 인용 없는 서류·보관 문단 존재, 주장-조문-단서 3단락 연속 없음을 확인했다. 대비틀 검출은 0이지만 법적 부정은 별도 독해로 보존을 확인했다. RO 복수 존칭과 ș/ț 표기, 내부 author·가상 캡션이 일관되며 굵은 강조·본문 H1·가짜 신분이나 의뢰인이 없다. 704 본문 질문 0은 기한·서류·수령을 직접 설명하는 구성이므로 자동 반려하지 않는다. S02의 국소적 반복만 선택 제안으로 기록했다.

## 실제 검사

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-ro/704-taiwan-arc-first-application.md src/content/columns-ro/705-taiwan-visa-residence-work-study-family.md src/content/columns-ro/706-taiwan-arc-renewal-changes-reentry.md --lang ro
```

| 글 | 문장수 | 평균 | CV | short | run3 | opener_rep | cite_end | cite_para | contrast / caveat / q | 결과 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| 704 | 65 | 15.1 | .485 | .231 | .048 | .050 | .000 | .300 | 0 / 0 / 0 | exit0 / FAIL0 |
| 705 | 67 | 16.5 | .489 | .194 | .031 | .095 | .000 | .571 | 0 / 0 / 1 | exit0 / FAIL0 |
| 706 | 80 | 16.1 | .479 | .175 | .090 | .074 | .000 | .444 | 0 / 0 / 1 | exit0 / FAIL0 |

세 편 모두 `OK — no variety limit violated`. 도구는 수정하지 않았다. 수치 통과를 법률·사람원어민승인으로 치환하지 않는다.

별도 Node24/gray-matter로 직접 확인: FAQ 각 3, audience `[ro]`, internal author `legal-ai-assistant`, topic `visa`, published/lastmod `2026-10-25`. 본문 H1·굵은 강조 0, 이미지의 현재 public 폴더 존재, EN 공식 URL 누락 0, 본문→끝목록 누락 0, 목록에만 있는 공식 URL 0을 확인했다. 내부 링크는 준비된 RO 3편의 정확한 실제 파일로 연결된다. 이는 공개 URL 배포 검증이 아니다.

## 검수 종료 시 원고 불변 확인

보고서 저장 후 세 파일 SHA를 다시 계산해 시작값과 모두 동일함을 assert로 확인했다. 이 판정은 위 SHA 원고에만 적용되며, 수정 후에는 M01과 선택 수정의 변경분 및 공유 검사 결과를 재확인해야 한다.
