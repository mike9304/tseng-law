# NB 704–706 독립검수

검수일: 2026-10-25 KST. 검수자: AI 에이전트 `column_inventory`. 판정: REQUEST_CHANGES. 의미·용어 수정 5건과 문장 반복 수정 2건이 남아 있다. 아래 출처 URL·교차언어 표기 항목도 통합 전에 처리해야 한다. 인간 원어민·법률전문가 감수나 배포 승인을 뜻하지 않는다.

원고, Kimi 작성자 기록, 공용 도구는 읽기만 했다. 소유 출력은 이 파일 하나다. 수정은 root가 맡으며, 아래 제안의 적용 및 수정 후 검사를 이 보고서가 대신하지 않는다.

## 검수 대상과 provenance

기준 디렉터리 `B`: `/Users/son7/tseng-all-language-columns-20261025/batch02`.

| 파일 | 검수 시작 SHA256 |
|---|---|
| `B/src/content/columns-nb/704-taiwan-arc-first-application.md` | `e5fabde50a16dd23558043c58302a1f84734dbf01df0673bc557dd069a8f7fb2` |
| `B/src/content/columns-nb/705-taiwan-visa-residence-work-study-family.md` | `18b87e92d2717657968e5d2dddfc7c39f457c54c1d2a70a9b0dabfce6e695369` |
| `B/src/content/columns-nb/706-taiwan-arc-renewal-changes-reentry.md` | `e54089f212709b52ac806babe4e5f7abe7e8ef1b59791c840735ebf06c39a07e` |
| `B/reviews/nb-kimi-author.md` | `d82fec8691249dd9e8573ea0c220b995c9289c9de414dd488fa13d4cb89c500c` |
| `B/reviews/nb-kimi-provenance.json` | `4bc711a06ff50fc05ee7f34d6deded56ccbfc1d3d1775a2c0116aa6e74c4d9ec` |

원고 세 해시는 provenance에 기록된 Kimi 원본 출력 해시와 일치한다. 해당 기록은 `kimi-code/k3.1-pro`, exit0, 같은 사용자 승인 입력20개만 사용, 추가 비공개 문서 없음으로 표시한다. 입력 manifest SHA는 `50618882d83894e85796c6eb810f6ecbc5588c525e18d1d8ae26ff4e3a0ac82c`, task SHA는 `cad06dea22a126920444175dd659a0032bd3addd9be5b37698600af2ed0df8bb`, run SHA는 `d32f3ddbcef322bd2bffbd03e477e81fd4fd3b891dfeaaa6ff7ca0d32f47a713`다. 이는 root 전달 및 provenance 기록의 확인이며, 검수자가 외부 실행을 재수행하거나 승인 범위를 넓힌 것이 아니다.

## 필수 의미·용어 수정

### NB705-L01 — 학생 근로의 방학 예외 범위 / P2

실제 문장, 705:58:

> For studenter som faller under artikkel 50 er hovedgrensen 20 timer per uke utenom ferier, med de regler og unntak som følger av artikkel 53.

문제: `utenom ferier`는 여름·겨울방학 밖의 주20시간이라는 예외를 일반 휴가·다른 방학으로 넓혀 읽히게 한다. Art53의 이직/복수 고용 규정을 시간 제한의 예외 근거처럼 붙인 것도 부정확하다. [취업서비스법50 중문](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=50)과 [영문50·53](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=N0090001)을 이번 검수에서 직접 열었다.50조는 겨울·여름방학만 시간 제한의 예외로 명시한다.

수정안:

> For studenter som omfattes av artikkel 50, er grensen 20 arbeidstimer per uke, bortsett fra i sommer- og vinterferien.

의미 보존: 적용 학생 범위, 주20시간, 여름·겨울방학 예외를 보존한다. 학생 ARC가 근로허가를 대체하지 않는다는 앞뒤 문장을 유지한다.53조의 고용 변경 규정은706에서 조건을 맞춰 설명하면 되며,705의 시간 제한에 새 예외를 연결하지 않는다.

### NB705-L02 — 성년 자녀의 자립/자기돌봄 조건 / P2

실제 구절, 705:71:

> voksne barn som ikke kan forsørge seg selv på grunn av fysisk eller psykisk funksjonsnedsettelse

문제: `forsørge seg selv`는 자신의 생계·부양을 감당한다는 뜻으로 읽힌다. 이민 자격은 단순한 경제적 자립 능력이 아니라 장애 때문에 스스로 생활을 돌볼 수 없는 조건이다. [Art16 중문](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16)의 `無法自理生活`과 [영문](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295)의 자기돌봄 능력 조건을 직접 대조했다. [Bokmålsordboka의 forsørge](https://ordbokene.no/bm/fors%C3%B8rge) 역시 생활에 필요한 것을 공급·부양하는 용례다.

수정안:

> voksne barn som på grunn av fysisk eller psykisk funksjonsnedsettelse ikke er i stand til å ta vare på seg selv

의미 보존: 성년, 신체 OR 정신 장애, 그 장애로 인한 자기돌봄 불능을 함께 보존한다. 소득 부족이나 무직을 새 자격으로 만들지 않는다. 최근 NB844의 `ikke kan klare seg selv`도 같은 취지로 참고할 수 있다.

### NB705-V01 — 전일제 학생의 용어 / P2

실제 문장, 705:50:

> Helsidestudenter som søker fra utlandet, kan søke om oppholdsvisum ved en taiwansk utenriksrepresentasjon.

문제: `Helsidestudenter`는 전일제 학생을 나타내는 말이 아니다. 원문의 full-time 학생이라는 대상 한정이 손상됐다. [NAOB의 heltidsstudent](https://naob.no/ordbok/heltidsstudent)를 확인했다.

수정안:

> Utenlandske heltidsstudenter som søker fra utlandet, kan søke om oppholdsvisum ved en taiwansk utenriksrepresentasjon.

의미 보존: 외국인 전일제 학생, 해외 신청, 해외 공관 거류비자 경로를 보존한다. 이어지는 특정 유학 visitor 비자에 따른 적격 NIA 직접 신청과 합치지 않는다.

### NB706-L01 — 추가 고용과 이직의 종료증명 의무 / P2

실제 문장, 706:59:

> Ved ny eller tilleggsarbeidsgiver stiller artikkel 53 i Employment Service Act krav som varierer med arbeiderkategorien. Under hovedregelen må den nye arbeidsgiveren søke om tillatelse og legge ved dokumentasjon på at det tidligere arbeidsforholdet er avsluttet.

문제: 처음에 새 고용주 또는 추가 고용주를 함께 놓고 다음 문장에서 둘 모두에게 종전 고용 종료증명을 요구한다. [Art53 제1항 중문](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=53)과 [영문](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=N0090001)을 직접 대조했다. 새 고용주의 허가 신청은 이직·복수 고용을 다루지만, 종료증명 첨부는 이직 신청에 연결된다.

수정안:

> Ved arbeidsgiverskifte eller arbeid for flere arbeidsgivere må den nye arbeidsgiveren som hovedregel søke om tillatelse etter artikkel 53. Ved arbeidsgiverskifte skal søknaden også inneholde dokumentasjon på at det tidligere arbeidsforholdet er avsluttet.

또는 EN의 짧은 범위를 유지하려면 상세 종료증명 문장을 생략하고 범주별 허가/면제 및 NIAs 등록과의 구분을 유지해도 된다. 채택한 법률 세부가 틀린 조건으로 제시된 점이 필수 수정 사유이며, 모든 원고에 종료증명 내용을 새로 추가하라는 요구가 아니다.

의미 보존: 허가의 주체, 적용되는 주원칙, 종료증명의 이직 한정, 개인 허가·법정 예외와 이주노동자 범주의 별도 규칙, 근로 시작 전 허가·면제를 보존한다. 아래 MONOTONY 수정과 함께 첫 단어를 바꿔도 된다.

### NB706-L02 — 15일 안에 해야 하는 행위 / P2

실제 문구, 표 706:37와 본문706:63:

> Nytt oppholdsvisum fra BOCA innen 15 dager fra hendelsen, deretter oppholdssøknad til NIA.

> Utenfor bestemmelsens område krever oppholdsreglene nytt oppholdsvisum fra BOCA innen 15 dager, fulgt av NIAs prosess.

문제: 15일 안에 BOCA에서 비자를 발급받아야 한다고 읽힌다. 표의 열 이름은 신청기간이지만, 본문까지 `nytt ... fra BOCA`라고 반복하므로 신청과 발급의 구분을 명시해야 한다. [거류 규칙7조](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=D0080129)의 의무는 사건 발생일부터15일 안에 BOCA 또는 지소에 거류비자를 다시 신청한 뒤 NIA 절차를 거치는 것이다.

수정안, 표:

> Søknad om nytt oppholdsvisum til BOCA eller et avdelingskontor innen 15 dager fra hendelsen, deretter oppholdssøknad til NIA.

수정안, 본문:

> Utenfor bestemmelsens område må det søkes om nytt oppholdsvisum hos BOCA eller et avdelingskontor innen 15 dager fra hendelsen. Deretter søkes det om opphold hos NIA.

의미 보존: 사건 당일 기산15일, BOCA/지소와 NIA 순서를 유지한다. 주소 변경의 다음 날 기산30일이나 Art23-1의 발생일 기산30일과 섞지 않는다. 관청의15일 발급 보장을 만들지 않는다.

## MONOTONY: 실제 추출 문장과 수정 방향

공유 검사기를 직접 실행했다. `consec_same_start`는 최대 연속 길이가 아니라 같은 시작을 가진 인접 문장 쌍의 누적 수다.705의4는 네 문장이 모두 연속해 같다는 뜻이 아니다. 도구 엔진을 읽고 실제 추출 문장을 대조했다.

### NB705-M01 — 같은 시작의 인접 문장 / 필수

MONOTONY: 같은 시작 인접 쌍4건 — 다음 실제 문장 — 법적 관계를 읽히게 연결하거나 대상 명사로 시작한다.

| 인접 쌍 | 실제 문장 | 제안 |
|---|---|---|
| 1·2, `Et` 세 문장 | `Et jobbtilbud, et opptaksbrev eller en ekteskapsattest dokumenterer formålet, men erstatter ikke innreise- og oppholdsvilkårene.` → `Et besøksvisum gjelder kortere opphold.` → `Et oppholdsvisum brukes for lengre opphold og følges vanligvis av en ARC-søknad etter ankomst.` | 마지막 두 문장을 `Besøksvisum gjelder kortere opphold. For lengre opphold brukes oppholdsvisum, som vanligvis følges av en ARC-søknad etter ankomst.`로 정리한다. 비자 목적과 일반적인 후속 ARC 순서는 그대로다. |
| 3, `Artikkel` | `Artikkel 4 og 5 i fagpersonloven definerer profesjonelt arbeid og tillatelsessystemet.` → `Artikkel 43 i Employment Service Act fastsetter hovedregelen om tillatelse.` | `Profesjonelt arbeid og tillatelsessystemet er definert i artikkel 4 og 5 i fagpersonloven, mens hovedregelen om tillatelse følger av artikkel 43 i Employment Service Act.`처럼 관계를 연결한다. 두 URL 및 각 조문 역할 유지. |
| 4, `Den` | `Den som har reist inn med besøksvisum spesifikt for utenlandske studenter, kan ved oppfylte vilkår søke direkte til NIA om opphold.` → `Den ordinære ordningen i BOCAs studentveiledning utelukker ...` | 뒤 문장을 `BOCAs ordinære studentordning utelukker ...`로 시작해 실제 안내를 주어로 둔다. 무비자/도착비자/다른 목적 비자 제외 모두 유지. |

705의 서술 문단 첫 단어 `For`도 세 번이다: `For de fleste profesjonelle ansettelser...`, `For mandarinstudenter...`, `For familie til utenlandske fagpersoner må flere ledd leses sammen.` 긴 글의 동적 도구 한도에서는3을 허용하지만 §5.4의 수동 점검도 고려한다. 마지막 문단의 메타 도입은 `Familieordningen i artikkel 16 annet ledd krever at den støttende personen enten:`로 바꿀 수 있다. 뒤의 두 법정 범주 불릿과 공통 NIA 거류/영주거류 조건은 그대로 보존한다.

제안 적용 후 CV·짧은 문장 비중을 포함해 전체 원고를 다시 측정해야 한다. 이 보고서는 제안이 이미 검사기를 통과했다고 주장하지 않는다.

### NB706-M01 — `Ved` 문단 시작4회 / 필수

MONOTONY: 동일 문단 시작 — `Ved flytting...`(57), `Ved ny eller tilleggsarbeidsgiver...`(59), `Ved en arbeids- eller familietvist...`(71), `Ved mistet eller skadet ARC...`(77) — 두 곳 이상을 실제 주체·사건으로 고쳐 시작을 나눈다.

제안:

- 59행은 법률 오류 수정과 결합해 `En ny eller ekstra arbeidsgiver må som hovedregel søke om tillatelse etter artikkel 53.`로 시작하고, 다음 문장에 이직 시에만 종전 고용 종료증명을 붙인다. 이미 뒤에 있는 허가/면제·범주별 예외 설명은 보존한다.
- 77행은 `Hvis ARC går tapt eller blir skadet, krever NIAs veiledning søknad, bilde, pass og dokumentasjon som passer til situasjonen: det skadede kortet, en tapsmelding, politianmeldelse eller andre relevante bevis.`처럼 정리한다. 손상카드/분실진술/경찰신고/기타 증거를 모두 AND로 요구하지 않는다. 경찰신고가 모든 경우 필수는 아니라는 뒤 문장도 유지한다.

이 두 방향으로 `Ved`는 이사와 상담 문단의2회가 된다. 의미·짧은 문장·길이 변동을 재확인한 뒤 최종 판단해야 한다.

## 출처·링크 자동검사의 해석

읽기 전용 링크 overlay를 `/var/folders/x7/w92bx9bd09l65n9hpcq81b8h0000gn/T/tseng-nb-review-20261025-u7hjohd7/content`에 만들었다. 릴리즈49언어 콘텐츠 디렉터리와 외부 NB 세 원고를 연결했으며, 릴리즈 파일은 수정하지 않았다. 릴리즈의 `content-audit.mjs`에서 `auditBatch`를 실행한 보고서는 같은 임시 디렉터리의 `report.json`에 있다.

원시 결과: automated FAIL, errors4, semantic REVIEW_REQUIRED, publicationReady false. 네 오류를 법률 오류4개나 끊어진 링크4개로 세지 않는다.

1. 704·705 각각 `https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295`가 없어 `source-url-missing`이다. 중국어 전문/개별 조문을 대신 추가했지만 EN 정본의 원래 공식 URL이 빠진 것은 사실이다. 원래 영문 전문 링크를 해당 법률의 말미 출처 항목에 보존하는 최소 수정이 가능하다. 공식 중문 조문을 인라인에 유지하는 데 문제가 없다. 중문을 사용했다는 이유 자체를 잘못된 법령 인용으로 판정하지 않는다.
2. 706의 Art34 오류는 `?pcode=D0080132&flno=34`와 `?flno=34&pcode=D0080132`의 쿼리 순서 차이다. 같은 조문이며 법적 출처가 사라진 사례가 아니다. 원문 URL 순서로 정리하면 원시 경고도 제거할 수 있다. 공유 도구를 이 보고서에서 수정하지 않았다.
3. 706의 `https://tseng-law.com/en/contact`는 App Router 정적 패턴 검사에서 `internal-link-missing`이다. 이번 웹 열람에서 [공개 문의 페이지](https://tseng-law.com/en/contact)의 본문과4개 상담언어 안내가 실제로 열렸다. 따라서404로 판정하지 않는다. 다만 원고 링크 문구 `Kontaktinformasjon for Hovering International Law Firm`에는 영어 페이지 표시가 없다. `Kontaktinformasjon for Hovering International Law Firm (på engelsk)`로 밝히거나, 원문에 없는 추가 문의언어 문장·말미 문의 링크를 함께 줄일 수 있다. 현재 본문이 존재한다는 사실은 다음 배포의 응답까지 보증하지 않는다.

세 편의 같은 언어 내부 칼럼 링크는 함께 준비하는704–706뿐이다. 제목·요약·FAQ·캡션은 NB로 작성됐고 audience는nb, 내부 author는legal-ai-assistant다. 본문 H1·굵은 강조·가짜 저자 자격은 발견하지 않았다. 이미지 경로와 `Fiktiv scene` 가상 표시는 유지됐다. 각 FAQ는3개다. NB706의 법률상 의무 주체와 본문을 고칠 때 FAQ도 함께 다시 확인해야 한다.

## 의미 대조에서 보존된 부분과 선택적 보완

F04의 초청자 논리식은 보존됐다. 일반 foreign professional에만 대만 전문업무 종사 한정을 붙인 OR 구조, 두 범주의 공통 NIA 거류 OR 영주거류 허가, 가족 자신의 적격 입국방식을 구별한다. 성년 자녀의 조건은 위 NB705-L02에 따라 정확하게 고쳐야 한다.

F23은706에서 지정 전문인재·가족 온라인 절차에 한정하여 출국 시 심사 종료를 단정하고, 재입국 뒤 적격자가 새 신청을 할 수 있다는 조건부 가능성을 유지했다. 본문·출처에 해당 공식 링크가 있으며 일반 ARC 출국금지나 재입국 보장으로 넓히지 않았다.

F24는704 본문에15일/3개월/불완전 보완 기각이라는 세부 규칙 자체가 없다. 중국어0902 링크는 말미 목록에 있으며, 일반10근무일 심사 제외·보완 후 재계산은 설명한다. EN 정본 역시 보완 요구에 맞춰 자료를 제출한다는 짧은 개요 수준이므로, 기존 문장이 틀리지 않은 상태에서 F24의 전체 문단 추가를 이 독립검수의 필수 확장 요구로 삼지 않는다. root가 보완기간까지 설명하기로 하면 반드시 통지 다음 날부터15일, 문서를 해외/중국대륙/HK/Macau에서 발급받아야 하는 경우3개월, 불완전 보완 시 기각, 보완 뒤10근무일 재계산을 함께 쓰고 달력일과 근무일을 섞지 않아야 한다.

다음도 본문·FAQ를 대조했다.

- F01/02: 입국 다음 날30일과 대만 내 거류비자 발급일30일, 허가 전제와 통합증명 예외가 유지된다. 모든 무비자 방문객에게30일 전환권을 만들지 않는다.
- F06–08: 최근2년 사진, 최근1개월 내 재직·재학 자료, 단계별 학교 문서, 가족 관계와 초청자의 적절한 신분/거류 자료가 있다. 초청자의 여권을 일률적 필수로 만들지 않았다. 대만 거주·호적등록 국민의 첫 배우자 ARC는 최장1년이며 대만 배우자 출석을 유지한다.
- F09/10: NT$1 000/승인1년,1년 미만도1년분, 해당 입국 경로의 NT$2 200, 僑生 신분의 감면과 일반 국제학생을 구분한다. 원문도 구체50%를 쓰지 않는 짧은 감면 설명이어서 그 숫자 추가만을 필수로 요구하지 않는다. 특정전문인재5년은 NIA 거류승인 다음 날이며 취업승인일과 구분한다.
- F11/12: 학생 납부5근무일은 승인부터, IC 수령3근무일은 납부부터, 선택센터·출력 영수증을 유지한다. 전자 ARC는6개월 이하, 일반 심사10근무일과 학생5근무일을 구별한다. 학생의 보완 후 심사기간 재계산까지 새로 모두 풀어 쓰라는 요구는 아니다.
- F05/13: 거류변경용60일은 허용 체류기간이며 대만 국민 배우자의 거주·호적 조건을 유지한다. 어학은 해당visitor 비자, 대학 부설 인정기관,4개월 이수+최소3개월 추가등록, 주중 주15시간과 허가받은 결석 포함1/4 이하를 유지한다. 본문 전일제 대상 용어는 NB705-V01 수정 필요.
- F14/15–17: 거류와 근로허가를 구별하며 Art48 대만 국민 배우자 면제와 Art15 적격 전문인재 배우자 직접 신청을 합치지 않는다. 일반 연장3개월, 사업 계속 창업가와 Gold Card4개월, 사업 종료 뒤 별도3개월은 만료 전 창구다. 주소/업무장소는 다음 날30일, 사유변경은 당일30/15일이다. 실제 신청 행위는 NB706-L02로 명확히 해야 한다.
- F18–21: 사유 소멸에 따른 말소 의무와 조문상 계속거류 가능성을 구별한다. Art31은 `visse tilfeller`, `Hver grunn har egne vilkår`로 예외를 짧게 소개하므로, 가정폭력·자녀 등 모든 하위 조건을 새로 열거하지 않았다는 이유만으로 반려하지 않는다. 초과거류는30일 미만 AND 종전 사유 계속 AND 처벌 후이며 옛 허가 자동연장이 아니다. APRC 산입1년 공제도 있다. 전문인재6개월+추가1회/최장1년, 졸업생1년+추가1회/최장2년을 구분한다. Art12 졸업생 면제는 학위·NIA 졸업 후 연장·승인기간 조건에 연결된다.
- F22: 유효여권+APRC 예외, ARC와 재입국허가의 유효기간 연결, 카드 말소 시 효력 상실, 영수증의 한계를 유지했다. 추가된 [NIA 여권 잔여기간 FAQ](https://www.immigration.gov.tw/5385/12162/12197/414977/)는 이번 검수에서 직접 열어 확인했다. 유효ARC/APRC 소지자에게 도착 시 유효여권이면 된다는 한정과 입국심사를 남겼다.

선택적 문장 개선:

- 706 요약과 해외 분실 문단의 `hjemreisen`는 귀국지와 대만 귀환을 혼동할 여지가 있다. `tilbakereisen til Taiwan` 또는 `returen til Taiwan`로 구체화하면 독자의 국적·거주지를 가정하지 않는다.
- 706 FAQ의 `En ny arbeidsgiver kan også kreve ny arbeidsgodkjenning`은 `Arbeid hos en ny arbeidsgiver kan kreve egen arbeidstillatelse`가 법적 요건의 주체를 더 분명히 한다.
- 705 F04의 `Arbeidsvilkåret i det første alternativet skal ikke pålegges...`는 검수용 메타 설명처럼 읽힌다. OR 불릿과 NIA 공통 조건이 이미 분명하므로 이 문장을 줄여도 된다. 가족 초청자의 논리식을 직접 근로자의 Art16 제1항에 그대로 옮기지 않도록 한다.
- `landingvisum`은 `visum ved ankomst`, `første ARC-trinn`은 `veiledningen om første ARC`가 매끄럽다.705·706의 `avgangsstudent`는 학위 취득·졸업 후 승인이라는 문맥상 조건이 있지만 `nyutdannet`로 통일하면 졸업예정자로 읽힐 여지를 줄인다.
- 적용범위 고지의 `personer fra fastlands-Kina, Hongkong eller Macao`는 출신지로만 읽힐 수 있다. 해당 지역 거주자 신분에 적용되는 별도 법체계임을 드러내는 표현으로 다듬으면 좋다. 본문은 노르웨이어 독자를 노르웨이 국민·노르웨이 여권 소지자로 전제하지 않는다.
- 상담언어는 공개 페이지의4개 언어 안내와 부합하지만 `norsk konsultasjon er ikke tilbudt`는 추가 단정이다. EN 원문처럼 이 문장을 생략하거나, 노르웨이어 상담이 보장되지 않아 연락 방법을 확인해야 한다는 공개 페이지의 범위에 맞출 수 있다.

## 최근 NB 세 편 비교와 §5

Kimi 입력에 최근 NB가 없었다는 작성자 기록을 확인하고, 아래 세 편을 검수자가 전문으로 읽었다. 모두2026-10-24 게시본이다.

| 글 | SHA256 | 도입/소제목/실질 결말 |
|---|---|---|
| 845 `norwegian-traveller-taiwan-traffic-accident-return-home` | `4c8ad463565566294d1f10f3e40b76579896dc8ab6339d0349b0e93eae4b6850` | 사고 후30일 자료 신청 시점, 증거·노르웨이 치료·보험·서로 다른 기산, 사건번호·경찰·차기 치료와 문서수령을 묶는 결말. |
| 844 `norwegian-professional-taiwan-work-permit-residence` | `3e37b15f1c329b612f5d46a3c01000abf2e7013d6d4cd12bcc29d1153a815e6a` | 노르웨이 여권 입국 후 바로 일할 수 있는지 질문, 고용주 신청·Gold Card·거류·배우자 근로, 가족별 근거·서류·여행기간의 결말. |
| 843 `norwegian-seafood-exporter-taiwan-unpaid-invoices` | `d07f5db534e1c334914fd57a11d492bbf53431c9119f9f089e083e1912bfef37` | 가상 수산물 납품과 온도 클레임, 송장·법선택/시효·송달·재산, 가장 오래된 송장의 별도 만기로 끝남. |

1. 기계검사:704는 통과,705/706은 실패다. 아래 수치를 참조한다. 전체 배치를 PASS로 처리할 수 없다.
2. 새704 숫자 기산/705 입국방식별 효과/706 카드 효력 질문으로 도입을 달리했다. 이전845도30일로 시작하지만 다른 사건·기산을 설명하며, 전체가 같은 가상사례 공식으로 시작하지 않는다. 이전844의 질문 형식이706에서도 쓰인다는 이유만으로 문장 복제를 판정하지 않는다.
3. 짧은 문장 두 개 이상:704 `Fristen regnes fra dagen etter ankomst.` / `NIA fastsetter oppholdsperioden.`;705 `Andre må ha riktig visum før innreise.` / `Et signert arbeidstilbud er ikke arbeidsgodkjenning.`;706 `Den forskjellen betyr noe.` / `Erstatningskortet forlenger ikke oppholdet.`. 긴 조건문과 짧은 효과 설명이 섞여 있다.705/706의 문제는 짧은 문장 자체보다 시작 반복이다.
4.705 인접 문장 첫 단어 및 `For`3회,706 `Ved`4회를 실제 추출문으로 확인했다. 위 MONOTONY 항목대로 수정 필요하다. 작성자 기록의 시작 반복이 없다는 자기평가는 최종 기계·수동 대조로 보완된다.
5. 주장→조문→예외가 세 문단 연속하는 틀은 발견하지 않았다.704의 보관자료/주소증거,705의 일반 방문 경로,706의 변화 날짜·서류 등의 무인용 설명이 있다.
6. 도구 대비틀은704=1,705=0,706=0이다. 법적 제한을 밝히는 부정문과 수사적 반박을 구별했다. 취업허가·입국허가·초과거류의 한계를 설명하는 문장을 지표만 낮추려고 삭제해서는 안 된다.
7. 고지 직전 실질 결말은704의 카드 만료 전 새 신고기한,705의 새 목적에 대한 자격판단,706의 실제 귀환일 문서다. 판촉 결말이 복사되지 않았다.704는 마지막 문장이 연결 안내로 끝나므로 실제 기한 문장으로 순서를 바꾸는 것은 선택적 개선이다. 필수 적용범위·기준일 고지와 출처 목록은 실질 결말과 분리해 보았다.
8. 대체로 Bokmål이지만 `Helsidestudenter`는 수정해야 한다. 공개 저자·전문가 승인 주장, 가짜1인칭·실제 고객 사례, 굵은 강조는 없다. 소제목은 절차와 법적 쟁점에 맞으며 `Jobbtilbudet er bare begynnelsen`은 다소 일반적이므로 허가/직종을 드러내는 제목으로 다듬을 수 있다.
9. 보존된 숫자·조건과 수정할 의미를 위에 구분했다. NOK/유로 환산이나 독자 국적 가정을 추가하지 않았다. 법적 조건의 정확성이 문장 다양성보다 우선하며, 수정 후 출처·FAQ·부정문·기간을 다시 읽어야 한다.

## 사용한 정본과 최종 기계 증거

릴리즈 정본 경로 `R`: `/Users/son7/Projects/tseng-law-all-locales-20261025`. batch02 BRIEF 및 R의 BRIEF·AGENTS, 저장소 EDITORIAL-VOICE/FRONTMATTER, COLUMN-VOICE-RULE, SENTENCE-VARIETY-RULE과21:04 LESSONS 전문을 이 세션에서 읽었다. 홈 `agent-library/knowledge/editorial-voice.md`는 부재하여 읽었다고 주장하지 않는다. 현재 EN/KO/ZH 아홉 편을 이 세션에서 전문으로 읽고, NB 검수 말미에 다음 해시가 바뀌지 않았음을 확인했다.

| 원문 | SHA256 |
|---|---|
| EN704 | `610343da1255e2e873956c6de54bd0f9c72c6731aae9343bd7bae9884efdd39f` |
| EN705 | `87a4ab6e9a5e8b434a30de0dc111307fc58e878a7534cef793e2a3e27be38304` |
| EN706 | `1ecf6acc92d181afb2820bb001d4e4d45cc4eeca823d2e32def25faebe119d71` |
| KO704 | `cbf6b07b2d41c3b136ceac099f8d32152ca125c18478321610ffa715c29476a1` |
| KO705 | `727377648fcc7e2bd1d8ea8202bea5fb69f01174ce51a0ee422891126011d54a` |
| KO706 | `4cd612086336cb1a3720111390ce7aca3f4eff5c7f96c5e92aea001fa7b8cfbc` |
| ZH704 | `0c00bc06bf3c3c1860a95af4dbcea9eaab981300860916856295e8b947244468` |
| ZH705 | `290a50047632ad830ea98c524ffef6ed91c2b4c8d555a1844689824c3ffea7a3` |
| ZH706 | `4d70e78b9a197f4a2b81d25d61b6fa862ee849a6392d5fd905e90bcf781e721c` |

기준 commit `ef3b24e73d84968eea08ea9d58e991ccbbf83fa8`. 공통 사실표 SHA `4776f60010172120e0812d8d552123aeb5c7cc0b467cb5306ca031a1e17c2145`, 10월24일 source-refresh SHA `a33d5bd1439879bc7461755c3b6793f4942ec161454032dcb8cde1c4d52a6983`. Kimi의 기존 조사와 검수자의25일 직접 웹 확인을 혼동하지 않는다. MOJ 자료 정비 기준일은2026-10-16이며 이후 관보 전수조사는 하지 않았다.

실제 명령:

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check \
  /Users/son7/tseng-all-language-columns-20261025/batch02/src/content/columns-nb/704-taiwan-arc-first-application.md \
  /Users/son7/tseng-all-language-columns-20261025/batch02/src/content/columns-nb/705-taiwan-visa-residence-work-study-family.md \
  /Users/son7/tseng-all-language-columns-20261025/batch02/src/content/columns-nb/706-taiwan-arc-renewal-changes-reentry.md \
  --lang nb
```

| 글 | 문장/mean/CV | short/run3/opener_rep | cite_end/cite_para | contrast/caveat/q | 결과 |
|---|---|---|---|---|---|
| 704 | 67 /12.6 /.452 | .284 /.031 /.100 | .000 /.300 |1/0/0 | FAIL0 |
| 705 | 77 /13.5 /.532 | .234 /.053 /.125 | .000 /.500 |0/0/1 | `consec_same_start=4`, 한도2 |
| 706 | 91 /13.3 /.467 | .253 /.045 /.125 | .000 /.542 |0/0/1 | `top_opener_n=4`, 이 길이의 동적 한도3 |

종료코드1. 엔진 SHA `0ff4f2b8d68a71fc16e1e9505c83ebcc22de0b01ad4742d0ad126bf81220f532`, NB profile SHA `d354bc18f20fe062ec564e90cf5a654b70038e91f1ca9047499a0acd16b8faa4`. 미지원 언어를 다른 언어 profile로 검사하지 않았고 threshold를 변경하지 않았다. 수치는 문장 도구의 휴리스틱이며 법률·원어민 승인과 다르다.

2026-10-25 22:03:25 KST에 위 NB 세 원고와 Kimi 작성자/provenance 기록의 시작 해시를 다시 대조해 모두 변경 없음을 확인했다. 수정 원고의 재검수·렌더링·메타데이터 공개 출력·공개 commit/배포는 이 최초 독립검수 범위에서 아직 완료되지 않았다.
