# SR ARC 704–706 저자 기록

작성자: Codex `column_existing_drafts`. 작성·검증일: 2026-10-26 KST. 소유 범위는 B5 `src/content/columns-sr/704–706`, 이 기록과 `checks/sr-*`다. R과 다른 작업자의 원고·도구는 수정하지 않았다. commit/push/deploy 또는 외부 모델 호출은 없었다.

현재 아래 세 SHA로 원고를 동결했다. 정확한 공유 SR 검사에서 세 편 모두 exit 0 / FAIL 0, 자동 구조 오류 0이다. 저자의 의미·문체 검토와 기계 검사를 구별하며, 독립 의미검수와 root 통합·실제 페이지 확인은 남아 있다. 인간 세르비아어 원어민이나 변호사 승인으로 표시하지 않는다.

## 입력·날짜·언어

B5 BRIEF 전문, B4 및 연결된 상위 계약, R AGENTS, FRONTMATTER, EDITORIAL-VOICE, COLUMN-VOICE-RULE, SENTENCE-VARIETY-RULE과 LESSONS를 읽고 적용했다. 공통 규칙과 LESSONS 전문은 SR 집필 직전에 다시 읽었다. 오래된 Fable 자동 의무는 사용자의 폐기 결정에 따라 적용하지 않았다. 홈 `agent-library/knowledge/editorial-voice.md`는 해당 경로에 없어 읽었다고 주장하지 않으며, 실제 존재하는 R의 문체 정본을 사용했다.

현행 EN/KO/ZH 704–706 아홉 정본은 이 연속 세션에서 전문을 읽은 동일 SHA이고, SR 집필 때 EN 세 편과 F01–F24 표를 다시 전문으로 읽었다. 원문 내용 commit은 `ef3b24e73d84968eea08ea9d58e991ccbbf83fa8`이다. 정본·계약·문체·최근 세 편의 실제 경로와 SHA 25개를 [집필 입력](../checks/sr-inputs.json)에 남겼고, [최종 manifest](../checks/sr-final-manifest.json)에서 변경 입력 0을 확인했다.

현재 R의 실제 최신 SR 891·892·893 전문과 metadata를 읽었다. 모두 라틴 문자·에카비아 표기여서 새 원고도 `vreme`, `sledeći`, `mesec`, `izveštaj` 계열의 세르비아어 관행을 따른다. 법률명은 기존의 `Zakon o ulasku, izlasku i imigraciji`, `Zakon o privlačenju i zapošljavanju stranih stručnjaka`, `Zakon o službama zapošljavanja`와 일관되게 썼다. 대상 법률은 대만법이다. 최근 글의 세르비아 여권·귀국·수출기업 전제를 새 일반 SR 안내에 옮기지 않았다.

발행일·lastmod는 B5 계약의 2026-10-26, `date_display`는 `26. oktobra 2026.`이다. 원자료 확인일 24일과 기존 보완 확인일 25일은 유지했다. 26일 작성 중 공식 인재법 제16조, 중문 NIA 0902, 학생 0929 관련 부분을 선택적으로 다시 열었으나 이를 법령 전체의 새 전수 확인일로 광고하지 않았다. 원본 v2 이미지와 정확한 가상 캡션 `Izmišljeni prizor`, 내부 `author: legal-ai-assistant`를 유지했다.

## 실제 자기 수정

초안 세 편을 `checks/sr-initial-704/705/706.md`로 남겼다. 이후 실제 치환 18개는 [수정 영수증](../checks/sr-self-edits.json)에 before/after·이유·의미 보존 여부로 기록했다. 초기부터 최종까지의 diff는 [704](../checks/sr-self-edits-704.diff), [705](../checks/sr-self-edits-705.diff), [706](../checks/sr-self-edits-706.diff)다.

| 실제 원문·위치 | 문제와 수정 | 의미 보존 |
|---|---|---|
| 704 `Za opšti postupak [NIA navodi deset radnih dana]...` | `Za` 문단 시작이 세 번 반복되어 `[NIA za opšti postupak navodi deset radnih dana]...`로 기관을 주어에 놓았다. | 일반 심사·10근무일·같은 공식 URL 유지. |
| 705 `Za studentski rad relevantni su [članovi 43 i 50...]` | 세 번째 `Za`를 `Studentski rad uređuju [članovi 43 i 50...]`로 고쳤다. | 학생 범위·조문·이어지는 허가/20시간/여름겨울 예외 유지. |
| 706 `Za preduzetnika koji nastavlja poslovanje...` | 자격을 갖추고 대만 사업을 계속하는 신청인을 주어로 `Preduzetnik ... može [podneti zahtev ... tokom četiri meseca pre isteka]`로 재구성했다. | 대만 사업 계속 AND 자격, 만료 전 4개월 신청 기간, NIA URL 유지. |
| 706 `Za selidbu...`, `Za početni upit...`, `[Član 34...] zahteva...` | `Posle selidbe...`, `Početni upit ... pošaljite...`, `Dozvola ... mora biti pribavljena pre odlaska, prema [članu 34...]`로 사건·행동·의무를 앞에 놓았다. | 변경등록 신청·주소증빙·30일, 1회 이메일·민감자료 제외, 출국 전 허가 의무와 바로 뒤 APRC 예외 유지. |
| 704 `kategorije i njenog izuzetka` | `kategorije i primenljivih izuzetaka`로 복수 예외 관계를 정리했다. | 건강/범죄경력 자료는 범주별 조건과 면제에 따름. |
| 704 `Odluku i račun čuvajte...` | `račun`을 `potvrdu uplate`로 바꾸어 보관할 것이 납부영수증임을 명확히 했다. | 결정·납부 증빙의 같은 거류 파일 보관. |
| 704 출처 설명 `prvi ARC tajvanskog supružnika` | `prvi ARC supružnika tajvanskog državljanina`로 고쳤다. | 카드 소지자는 대만 국민의 외국인 배우자라는 주체. 본문은 처음부터 정확했다. |
| 705 `Ovaj pregled ne polazi od određenog pasoša.` | 독자에게 보이는 편집 원칙이어서 삭제했다. | 바로 앞 국적·사용 여권·활동에 따른 자격과 담당 공관 설명 유지. |
| 705 `vizom za posetu posebno izdatom radi studiranja stranog studenta` | `vizom za posetu izdatom za studiranje u svojstvu stranog studenta`로 고쳤다. | 외국인 학생 신분의 유학 목적 비자이며 외국인 전용 교육과정이라는 뜻을 만들지 않음. |
| 705 `Porodica stranog stručnjaka ima drugi osnov. U [članu 16 stav 2...], to može biti...` | 추상적 예고와 모호한 `to`를 `Porodična prijava iz [člana 16 stav 2...] može se zasnivati na statusu...`로 연결했다. | 일반 인재 AND 대만 전문업무 OR 특정 인재의 수식 범위와 다음 문장 양쪽 공통 NIA 거류/영주거류 조건 유지. |
| 706 FAQ `Pasošu, boravišnom statusu i pravu ... moraju odgovarati stvarni datumi...` | 어색한 여격 구문을 `Važenje pasoša, boravišni status i pravo ponovnog ulaska proveravaju se prema stvarnim datumima putovanja.`로 바꿨다. | 실제 여행 날짜에 맞춰 여권·거류·재입국 자격을 별도 확인. 본문의 출국 전 허가 의무는 유지. |
| 706 `Potvrda banke ili univerziteta da je promenio vaš zapis...` | 은행/대학 선택주어에 붙은 남성 동사를 피하고 `Promena adrese u evidenciji banke ili univerziteta...`로 정리했다. | 은행/대학 주소 갱신이 NIA 변경등록 신청을 대체하지 않는다는 법적 구별. |
| 704 `Datum ranijeg ulaska ovde nije početni datum.`, `To su dve različite faze.`, `Broj predmeta ostaje veza sa podnetom dokumentacijom.` | 삭제 시험에서 새로운 정보가 없어 제거했다. | 비자 발급일 기산, 별도 학생 심사 5일/납부 5일, 앞의 접수번호·제출자료 보관 문장은 모두 유지. |
| 706 `Svaki slučaj ima uslove. NIA može dati odobrenje kada su oni ispunjeni.` | `NIA može odobriti nastavak kada su uslovi konkretnog osnova ispunjeni.`로 합쳤다. | 근거별 조건과 NIA의 허용 가능성을 유지하고 공허한 단문을 제거했다. |

이 수정은 수치용 문장 삽입이나 법적 내용 삭제가 아니다. 첫 기계 검사에서 잡힌 실제 반복을 고친 뒤에도 전문을 읽어 불필요한 단문을 삭제했고, 그 결과 CV가 낮아진 경우까지 그대로 기록했다. 도구나 임계값은 바꾸지 않았다.

## 법률 명제·FAQ 대조

- F01–F03: 거류비자 입국 AND 거류허가 다음 날부터 30일, 대만 내 비자 발급일 30일, 유효 통합증명 예외를 분리했다. 본인 직접신청은 두 전문인재 범주 모두 전문업무 허가 OR 면제와 적격 입국이 필요하며 NIA 승인 후 ARC가 나온다. 제안서가 허가를 대신하지 않는다.
- F04–F05: 가족 초청자는 `(일반 인재 AND 대만 전문업무) OR 특정 인재`, 양쪽 공통으로 NIA 거류 OR 영주거류 승인이 있다. 배우자·미성년자·신체/정신장애로 자립생활이 어려운 성년자와 해당 입국 조건을 보존했다. 대만인 배우자는 대만 거주 AND 호적등록, 60일 이상 체류를 허용하는 유효 비자와 제한 부재라는 별도 경로다.
- F06–F08: ARC 사진 최근 2년/BOCA 비자 사진 6개월, 재직과 등록 후 재학자료 최근 1개월, 등록 전 입학허가를 유지했다. 재학증명과 학기 증명·학생증을 누적 의무로 만들지 않았다. 해외문서 인증 의무와 번역 요구 가능을 구별했고, 대만 거주·호적 국민 배우자 첫 신청의 동행·혼인등록·최장 1년을 보존했다.
- F09–F12: 통화는 새로운 대만달러이며 1년당 1.000, 미만 기간도 1년분, 해당 경로 추가 2.200, 교포학생 僑生의 관련 ARC 요금 50%, 재발급 500이다. 僑生를 모든 국제학생으로 넓히지 않았다. 일반 최대 3년, 고용된 특정 인재 및 승인된 가족의 최대 5년·NIA 승인 다음 날을 보존했다. 일반 심사 10근무일과 제외 기간·보완 후 재계산, 학생 심사/승인 후 납부 각 5근무일·IC 납부 후 3근무일·6개월 이하 전자 ARC의 납부 후 다운로드/출력 의무를 구별했다.
- F13–F14: 정규 학위 과정과 언어 과정의 입국·비자 조건을 나눴다. Mandarin의 인정 대학 부설센터, 이수 4개월 AND 추가 최소 3개월, 월–금 주 15시간·휴가 포함 결석 1/4 상한과 증빙을 보존했다. 학생 주 20시간은 여름·겨울방학 예외와 함께다. 대만 호적 국민 배우자의 취업면제와 특정/고급 인재 배우자의 NIA 가족거류 승인 후 MOL 직접 허가 신청·거류기간 상한은 다르다.
- F15–F17: 일반 3개월, 계속 사업의 적격 기업가와 Gold Card 4개월, 사업 종료 별도 3개월은 모두 만료 전 신청 기간이다. 주소/근무처 변경은 다음 날부터 30일 안에 등록을 신청할 의무이며 기관 처리 완료를 요구하지 않았다. 제23-1조 사유변경은 사건일 30일 NIA, 조문 밖 변경은 사건일 15일 BOCA/분처 신청 후 NIA다. 15일 안에 비자가 발급되어야 한다고 쓰지 않았다.
- F18–F21: 근거 소멸 시 취소 의무와 법정 조건부 계속 허가 가능성을 함께 썼다. DV 이혼의 미재혼은 외국 신청인에게, 대만 거주·호적은 전 대만 배우자에게 붙였다. 미성년 호적 자녀·계속 중 소송·산재 치료 범위를 유지했다. 초과체류 30일 미만 AND 원근거 존속·처벌 후 재신청·APRC 계산 1년 차감, 전문인재 6+6개월 총1년과 적격 졸업생 1+1년 총2년을 보존했다. 두 연장은 만료 전에 신청하고 승인 시 종전 만료 다음 날부터 계산한다. 졸업생 근로면제는 대만 associate degree 이상·신졸업 상태·NIA 승인 연장기간에 한정했다.
- F22–F24: 출국 전 재입국허가, ARC 유효기간 상한·말소 연계, 유효 여권+APRC 예외, 영수증/사진의 비대체를 유지했다. 특정 전문인재/가족 온라인 경로의 출국 시 심사 중단과 재입국 후 적격이면 새 신청 가능을 주의사항 9에 연결했다. 일반 보완은 통지 다음 날부터 달력일 15일, 해당 지역에서 서류를 구해야 할 때 3개월, 기한 내 미완료/불완전 시 거절이다. 신청인 위치나 ‘15일+3개월’로 바꾸지 않았다.

FAQ 9개도 전문을 읽었다. 704는 첫 신청의 기산·수수료·근로 범위, 705는 직접신청·Mandarin·가족 근거, 706은 만료 전 신청창구·변경등록 신청의무·실제 귀국서류를 각각 다룬다. 요약·FAQ에서 생략한 모든 본문 세부를 새 의무로 강제하지 않았고, 요약이 상세 조건과 모순되는지도 대조했다.

공식 URL은 정본과 같이 본문 주장 옆과 말미에 두었다. 특히 [공식 인재법 제16조](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=A0030295), [중문 0902](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/29996/)와 [학생 0929](https://www.immigration.gov.tw/5475/5478/141465/141808/417829/cp_news)의 실제 관련 문구를 다시 대조했다. 새 직접 확인과 기존 24–25일 조사표의 확인 범위를 혼동하지 않는다.

## 최근 세 편과 §5

| 비교 원고 | 실제 도입·끝맺음과 새 글의 차이 |
|---|---|
| 891 `serbian-professional-taiwan-work-permit-residence` | 세르비아 여권으로 채용 제안 직후 출국 가능한지 묻고, 동반자별 입국·직장·가족 근거와 날짜표로 끝난다. 새 704는 비자 발급일과 입국 다음 날의 기산을 먼저 다루며 국적을 가정하지 않는다. |
| 892 `serbian-fruit-exporter-taiwan-unpaid-invoices` | 가상 냉동과일 납품 분쟁으로 시작하고 가장 오래된 미수금의 만기증빙으로 끝난다. 새 세 편에는 가상 상담·사례를 만들지 않았다. |
| 893 `serbian-resident-taiwan-police-summons-interpreter` | 중국어 소환 신분 표시로 시작하고 요청한 언어·변경 기일·귀국일을 실제 통지에 묶어 끝낸다. 새 706은 거류근거 소멸의 효과와 변경별 기산, 실제 귀국일의 문서 효력을 다룬다. |

최근 세 파일의 정확한 SHA는 입력/최종 manifest에 있다. 새 704는 특정 기산 사실, 705는 입국 후 신청 가능성 질문, 706은 근거 소멸의 효과로 시작한다. 원문 EN의 전체 문장 배열이나 최근 SR의 국적별 서사를 복제하지 않았다. 세 글의 하위 구조는 제출서류·입국/자격 비교·사건별 변경과 여행에 맞춰 나눴다.

| §5 | 실제 확인 |
|---|---|
| 1 자동검사 | 아래와 같이 세 파일 정확한 SR profile에서 최종 FAIL 0. 최초 반복 실패를 보존했다. |
| 2 도입 | 상투적 가상 도입 없음. 삭제 시험에서 704의 발급일을 다시 부정형으로 설명한 단문과 705의 작성 원칙 문장을 제거했다. 남은 첫 두 문단을 지우면 각각 기산/기관, 신청 가능성/여권 조건, 취소 효과/증빙이 사라진다. |
| 3 문장 길이·경계 | 중간 추출 68/72/89 전체를 읽고, 최종 65/71/88과 비교해 새로 생긴 4구간도 모두 읽었다. 최종 224구간의 문장 경계를 확인했다. `1.000`, `2.200`, `24. oktobra`, `1. januara`, `23-1`, NIA/BOCA, 이메일을 오분리하지 않았다. 표·FAQ·출처는 수치 밖이라 별도 전문 대조했다. |
| 4 시작어 | 실제 19/22/27개 서술 문단을 세로로 읽었다. `Za` 3/3/5회의 반복은 행위자·사건·직접 동사로 고쳤다. 동일 표면 첫 단어의 반복은 최종 두 번 이하로 정리했다. |
| 5 인용 | 법률을 주어로 한 문장, 문장 앞/중간/끝 링크를 섞었다. 접수파일·현재 기록·사건별 날짜 등 인용 없는 실무 문단도 있다. 같은 주장→조문→예외가 3문단 연속 이어지지 않는다. |
| 6 대비 | 자동 contrast 0/0/0. 카드/근로허가, 접수증/여행서류, 15일 신청/발급 같은 범위 구별은 법적 이유가 있어 보존했다. |
| 7 실질 결말 | 고지 직전 704는 후속 변경과 발생일 증빙, 705는 새 목적을 보여 주는 거류파일, 706은 실제 귀국일까지 유효한 서류로 끝난다. 정형 출처 고지 자체를 실질 결말로 세지 않았다. 판촉 결말 없음. |
| 8 문체·서식 | 표준 SR 라틴 문자, 본문 H1·굵은 강조·HTML wrapper·수동 bidi 0. 경험·변호사 신분·SR 상담 약속 없음. KO/JA 종결 규칙은 적용 대상 아님. |
| 9 의미 | 조문·기산·금액·출처·의무/가능·가상 이미지 표기를 최종 구조 기록과 직접 의미 대조로 확인했다. |

MONOTONY: 문단 첫 단어 — `Za opšti postupak...`, `Za studentski rad...`, 706의 `Za...` 다섯 문단 — 기관·신청인·변경 사건을 앞으로 이동하여 실제 주체와 동사를 드러냈다. 단어만 동의어로 기계 교환하지 않았다.

MONOTONY: 내용 없는 확인 — `To su dve različite faze.` / `Svaki slučaj ima uslove.` — 실제 두 5근무일 규칙과 NIA의 조건부 허가 설명을 보존하고 빈 확인만 제거했다.

## 실제 검사와 한계

SR 초안 작성 중 공유 49언어 설치 알림을 받았다. 첫 실행은 설치 이후였으므로 SR 미지원 exit 2를 실제로 겪지 않았고 그런 기록을 만들지 않았다. 설치 영수증 `tooling/variety/ROOT-INSTALLATION.json` SHA는 `c9340b9ced8aafd9c392a6aaebbad4f17a9cf558f68616db08747c4a542b7a39`다. 엔진과 SR profile SHA도 최종 manifest에 있다.

[첫 실제 실행](../checks/sr-variety-initial.json)은 세 편 모두 문단 시작 반복으로 FAIL, 전체 exit 1이었다. [첫 수정 후](../checks/sr-variety-after-self-edit.json)는 세 편 FAIL 0이다. 이후 의미·문체 전문 검토에서 중복 단문을 정리한 [최종 실행](../checks/sr-variety-final.json)도 다음과 같이 FAIL 0이다.

| 파일 | 추출 수 | 평균 길이 | CV | 짧은 문장 비율 | 3연속 비율 | 결과 |
|---|---:|---:|---:|---:|---:|---|
| 704 | 65 | 13.3 | .555 | .354 | .000 | exit 0 / FAIL 0 |
| 705 | 71 | 14.1 | .460 | .197 | .087 | exit 0 / FAIL 0 |
| 706 | 88 | 14.0 | .453 | .182 | .093 | exit 0 / FAIL 0 |

원고의 수치만 보고 문체·법률·원어민 승인을 주장하지 않는다. [최종 실제 추출](../checks/sr-shared-extracted-final.json)은 공유 엔진의 `strip_fm`/`body_blocks`/`sentences`를 그대로 사용했다. 표·목록·FAQ를 포함한 전체 문장 수라고 표시하지 않는다.

[구조 검사](../checks/sr-structure.json)는 오류 0이다. frontmatter 파싱, audience sr, 날짜26, 내부 author, visa topic, FAQ 각3, 원본 이미지 파일과 정확한 캡션을 대조했다. EN 공식 URL 누락 0, 본문 공식 링크의 말미 누락 0, 수정 중 공식 URL 삭제 0이며 고유 공식 URL 수는 13/15/15다. 새 SR 상호 링크는 세 파일 모두 존재한다. 배우자·Gold Card·APRC의 같은 언어 대응 글은 없으므로 실제 EN 파일에 연결하고 영어임을 명시했다.

이 검증은 로컬 원고·문장 추출·구조 수준이다. 배포 화면·운영 접근성·검색 노출·법률 적용의 개별 사건 결과는 검증하지 않았다. 독립 의미검수에서 필요한 수정은 이 동결 SHA를 기준으로 추적해야 한다.

## 최종 SHA-256

| 파일 | SHA-256 |
|---|---|
| 704-taiwan-arc-first-application.md | `15229f8e599464d507976f6d91818d441c6a1c8be1448af31f79fd79b8730dac` |
| 705-taiwan-visa-residence-work-study-family.md | `9057c2a83ef6e71ab6f576702943fdf604ae345b627b94d98986baf4a6b7d6b2` |
| 706-taiwan-arc-renewal-changes-reentry.md | `1e5a3547ce8437f9ddb4f3a3b61dd62261a4a1dccaa63683d43d9692b73331d9` |
