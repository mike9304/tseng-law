# PL 704–706 독립 원고 검수 — batch02

검수일: 2026-10-25 KST. 검수자: AI 에이전트 `column_voice_rules`. 작성자 `column_inventory`와 별도로 현행 정본과 폴란드어 원고를 대조했다. 결론은 아래 고정 SHA의 세 원고에서 남은 필수 의미·문체 수정 사항을 발견하지 못했다는 것이다. 공유 검사도 세 편 모두 실제 exit 0 / FAIL 0이었다. 원어민·대만 변호사 감수, 도구 자체의 독립 승인, 배포 승인 또는 공개 검증 완료를 뜻하지 않는다.

검수자는 PL 문장 profile 구현에도 참여했다. 따라서 이 보고서의 기계검사는 이미 설치된 도구를 해당 원고에 실행한 증거이며, 도구 설계자와 독립된 검증이라고 부르지 않는다. 법적 의미·문체 판단은 원고·정본·공식 자료 대조 결과로 따로 기록한다. 폴란드어 자연스러움은 AI의 언어 판단 범위이며 현지 법률 편집자의 최종 교열을 대체하지 않는다.

## 범위와 동결 버전

`B`는 `/Users/son7/tseng-all-language-columns-20261025/batch02`, `R`은 `/Users/son7/Projects/tseng-law-all-locales-20261025`, `A`는 `R/docs/audit/all-locales-parity-20261025`다. PL 제목·SEO 제목·요약·FAQ 9개·표·불릿·본문·캡션·출처를 전부 읽었다. 작성자가 수정 중임을 알려 초기 원고를 최종본으로 판정하지 않았고, 아래 freeze 이후 버전을 기준으로 최종 대조했다. 검수자는 원고를 편집하지 않았다.

| B 아래 파일 | 최종 검수 SHA256 |
|---|---|
| `src/content/columns-pl/704-taiwan-arc-first-application.md` | `67c353609d8fb1b2de6db627c0f6e2d1ce6563714261229251d8bfeba6051011` |
| `src/content/columns-pl/705-taiwan-visa-residence-work-study-family.md` | `ec5f086868aaf4409f55f4ed2aec3cccbe65fcb74b66213e133b55b171924f95` |
| `src/content/columns-pl/706-taiwan-arc-renewal-changes-reentry.md` | `1e6671e104c15ff573fb69434280258c57583e77d3a30f999da38d63d2e038bc` |

아래 줄 번호는 이 버전 기준이다. 21:41:34 KST의 직접 checker 실행 전후 SHA가 같았고, 문장 경계·메타데이터 검사에서도 같았다. 보고서 종료 시 재확인 결과는 마지막 절에 기록한다.

## 읽은 규칙과 대조 자료

- B의 `BRIEF.md`, A의 `BRIEF.md`와 `research/arc-source-facts.md` 전체(F04 정정 및 F23–F24 포함).
- R의 `docs/columns/EDITORIAL-VOICE.md`, `FRONTMATTER.md` 전체와 프로젝트 `AGENTS.md`.
- `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, `/Users/son7/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md`, `LESSONS.md` 전문. 폐기된 Fable 의무·고정 승인 게이트는 적용하지 않았다.
- R의 `docs/audit/codex-column-recheck-20261024/research/source-refresh.md`, `docs/audit/arc-visas-20261024/BRIEF.md`, 현행 EN/KO/ZH 704–706 아홉 편 전문. 과거 core 보고서는 관련 종료 기록을 참고했으며 전부 읽었다고 주장하지 않는다.
- 작성자 보고서 `B/reviews/pl-author.md`는 원고·정본 대조와 직접 측정 후에 읽었다. 보고서 해시는 `489aa708b458cda88a35670e4d06e3da03ea326364eb76d4312e06f1263a1b5c`이며, 그 자체를 독립 판정의 대체물로 삼지 않았다.

홈 정본 `/Users/son7/agent-library/knowledge/editorial-voice.md` 및 주 체크아웃의 같은 문체 파일은 이 환경에서 확인되지 않았다. 해당 파일을 읽었다고 표시하지 않고, BRIEF가 지정한 R의 읽을 수 있는 전문을 적용했다. R 문체 SHA는 `8b4e39550d9f9ff32b861270bad83a51a69fd71893046a54e7ffdaced9727ea3`, 공통 facts SHA는 `4776f60010172120e0812d8d552123aeb5c7cc0b467cb5306ca031a1e17c2145`다.

| 실제 대조한 현행 정본 | SHA256 |
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

위 파일명은 PL과 같고 R의 `src/content/columns-en`, `columns`, `columns-zh`에 있다. 오래된 초안이나 `held/` 파일을 정본으로 쓰지 않았다.

이번 검수 중 직접 연 공식 본문은 [인재법 영문 전문](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295)의 제8·12·15·16·17조, [이민법 중문 전문](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080132)의 제31·34조, [중문 NIA 0902](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/29996/)의 보완 조건, [전문인재·가족 온라인 안내](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/) 주의 9항이다. 나머지 세부는 위 현행 9편 및 공통 조사표와 대조했다. 모든 공식 URL을 새로 열었거나 10월 17–25일 관보를 전수 조사했다는 의미는 아니다. MOJ 자료 정비 기준일 2026-10-16 및 facts의 직접 열람/기존 조사 구분을 유지한다.

## 의미 대조 결과

현재 세 편은 대만 관할을 유지한다. 폴란드어 사용자를 폴란드 국적자로 단정하거나 대만의 요건을 폴란드 이민법·인증 관행으로 바꾼 문장을 발견하지 못했다. 일반 외국인 체계와 중국대륙·홍콩·마카오 주민 및 ROC 무호적 국민의 별도 체계도 말미에 구분한다. 아래는 공통 facts와 현행 원문을 대조한 결과다.

| 명제 / 위치 | 확인한 조건·효과 |
|---|---|
| F01–F02 / 704:19,26,28,34–38 | 입국 시 거류허가를 받은 경로의 30일은 입국 다음 날, 대만 내 거류비자 발급 경로는 발급일부터다. 통합증명 예외는 본문에 있고 무비자 방문자 전원의 30일 전환권으로 넓히지 않는다. FAQ·표도 같은 구분이다. |
| F03 / 704:40, 705:36–44 | 적격 전문인재, 해당 전문업무에 대한 허가 OR 면제, 적격 입국방식, NIA 승인 뒤 ARC 발급을 구분한다. 취업 제안서가 허가를 대신하지 않으며 일반 이주노동 직종을 이 경로에 흡수하지 않는다. 0915의 입국방식 제외 및 다른 규정에 따른 예외도 남아 있다. |
| F04 / 705:50–52 | `foreign professional ... wykonującego pracę specjalistyczną na Tajwanie albo ... foreign specialist professional` 뒤에 `W każdej z tych sytuacji NIA musi już zatwierdzić jej pobyt lub pobyt stały.`가 따른다. 전문업무 요건은 일반 범주에만 붙고, 두 범주 모두 NIA 거류 OR 영주거류 승인을 요구한다. 배우자·미성년 자녀·장애로 자립 불가능한 성년 자녀 및 가족의 적격 입국조건을 보존한다. |
| F05 / 705:48 및 FAQ3 | 대만 거주 AND 호적등록 배우자, 유효 비자가 허용하는 60일 이상 체류, 연장 불허 등 제한 부재를 유지한다. 비자 자체의 60일 유효기간으로 오역하지 않는다. 혼인이나 ARC 하나만으로 모든 가족 초청을 보장하지 않는다. |
| F06–F07 / 704:44–54 | 최근 2년 사진, 최근 1개월 내 발급된 재직·재학 자료, 입학/등록 단계, 실제 주소, 적절한 가족 신분/거류 증빙을 구분한다. 초청자 여권을 보편적 필수로 만들지 않는다. 해외 발급 문서 인증은 의무, 중국어 번역은 NIA가 요구할 수 있는 사항이다. 범죄경력·건강 자료의 범주별 조건을 남긴다. |
| F08 / 704:52 | 대만 거주·호적등록 국민의 첫 배우자 ARC는 `najwyżej na rok`이다. 최장 1년과 첫 신청 시 배우자 출석을 유지하며 모든 외국인 배우자 공통 기간으로 확대하지 않는다. |
| F09–F10 / 704:68–70, 706:51,83 | NT$1 000/승인 1년, 1년 미만도 1년분, 해당 경로 NT$2 200, 僑生 50% 감면, 재발급 NT$500이다. 일반 최장 3년과 고용된 특정전문인재 최장 5년을 구별한다. 제8조 기간은 NIA 거류 승인 다음 날이며 근로허가일이 아니다. 가족의 NIA 거류 승인도 명시한다. |
| F11–F12 / 704:74–76 | 일반 심사 10근무일과 제외기간·보완 후 재계산, 학생 심사 5근무일, 승인 후 납부 5근무일을 나눈다. IC 수령은 납부 후 3근무일·출력 영수증·신청 시 고른 센터, 전자 ARC는 6개월 이하·납부 후 인쇄로 구별한다. 학생 일정을 모든 신청자에게 적용하지 않는다. |
| F13 / 705:60–66 및 FAQ2 | 정규유학의 적격 경로, 어학의 해당 visitor 비자·인정 대학 부설기관·4개월 이수 AND 최소 3개월 추가등록·주중 주 15시간·휴가 포함 결석 1/4 이하를 유지한다. 등록금 납부 또는 입학만으로 적격이 된다고 하지 않는다. |
| F14 / 세 편, 특히 705:54–56,68 | 실제 직무·고용주의 허가 OR 면제와 거류권을 구분한다. 대만 호적 국민 배우자 제48조 면제와 특정·고급 전문인재 배우자 제15조 직접 근로허가 신청은 별도다. 후자의 NIA 가족 거류승인 및 허가기간 상한을 남긴다. 학생 주 20시간은 제50조 대상과 여름·겨울방학 예외에 한정한다. |
| F15–F16 / 706:19–21,34–39 | 일반 연장 3개월은 만료 전이다. 주소·업무장소 변경 30일은 사건 다음 날, 제23-1조 사유 변경 30일 및 그 밖의 BOCA 재신청 15일은 사건 당일부터다. 30/15일을 선택지로 바꾸지 않는다. |
| F17 / 706:41 및 FAQ1 | 계속 사업하는 적격 창업가 4개월, 사업 종료 뒤 별도 계속거류 3개월, Gold Card 자체 갱신 4개월은 모두 만료 전이다. 일반 ARC 전체의 기간을 4개월로 바꾸지 않는다. |
| F18–F19 / 706:26,53,65–69 | 사유 소멸 시 NIA 말소 의무와 법정 계속거류 재량을 구별한다. 가정폭력 이혼의 상대 배우자 거주·호적/이혼 원인/미재혼, 자녀 호적·미성년, 노동쟁송 진행 중, 산재 치료 중을 유지한다. 초과거류는 30일 미만 AND 원래 사유 계속, 처벌 후 재신청 및 영주 산입 1년 공제다. 옛 허가의 자동연장은 부정하되 새 허가의 장래 만료일을 금지하지 않는다. |
| F20–F21 / 706:71–75 | 제17조 적격 전문인재·가족의 선행 거류승인, 만료 전 신청, 종전 ARC/Gold Card 만료 다음 날부터 6개월·1회 추가·합계 1년을 유지한다. 적격 졸업생 1년+1회/합계 2년은 별도다. 제12조 근로허가 면제에는 대만 전문학사 이상 학위 AND 당해 졸업생의 NIA 졸업 후 연장거류 승인 AND 그 승인기간이 필요하다. 단순 어학 종료·학위만으로 확대하지 않는다. |
| F22 / 706:89–95 및 FAQ3 | 출국 전 재입국허가, 일반 허가와 ARC 기간의 연동 및 말소를 유지한다. 유효 여권 AND APRC로 돌아올 수 있는 영주거류 예외도 있다. 접수증·카드 사진·해외 재발급 가능성을 탑승/입국 보장으로 바꾸지 않는다. |
| F23 / 706:91 | `powoduje zakończenie rozpatrywania sprawy przez NIA`는 지정 온라인 경로에서의 필수 출국 효과다. `można ... jeżeli ...`로 재입국 후 적격자의 재신청 가능성을 조건부로 쓴다. 마지막 문장에서 해당 온라인 절차 한정임을 재확인한다. 본문·말미 출처가 모두 있고 보편적 출국금지로 확대하지 않는다. |
| F24 / 704:64,74 | 통지 다음 날부터 15일, 해외·중국대륙·홍콩·마카오에서 부족/부정확한 문서를 받아야 하면 3개월이다. 신청자 소재지와 문서 발급지를 구별하고 15근무일 또는 15일+3개월로 바꾸지 않는다. 미보완·불완전 보완 기각 및 보완 뒤 심사 재계산도 유지한다. |

제목·요약은 각 글의 실제 주제를 설명하며 신청 가능성이나 효력을 본문보다 넓게 확정하지 않는다. FAQ1/2/3은 각각 첫 신청·비용·근로, 직접 신청·어학·가족, 연장·변경·재입국이라는 정본의 실용 질문을 유지한다. FAQ가 모든 본문 예외를 다시 열거하지 않았다는 이유만으로 필수 오류로 판정하지 않았다. 짧은 EN이 요약한 정확한 추가 수치를 모두 반복할 의무도 새로 만들지 않았다.

여권 변경은 정보 갱신 의무를 유지하되 주소의 30일을 보편적으로 전용하지 않는다(706:81). 분실·훼손 증빙은 대안들을 제시하며 경찰 신고를 언제나 필수로 만들지 않는다(706:83). 705의 Gold Card 네 기능·1–3년, 디지털 노마드의 자격·대만 사업자/고용주 서비스 제외도 대만 제도 범위 안에 있다.

## 검수 중 제안한 문장과 반영 확인

두 건은 주체·결합을 명확히 하는 선택 제안이었다. 작성자가 반영했고 최종 SHA에서 확인했다. 검수자가 원고를 직접 수정하지 않았다. 이 밖의 현재 필수 수정 요청은 없다.

| 원래 문장 / 위치 | 문제·이유 | 제안 및 현재 문장 | 의미 보존 |
|---|---|---|---|
| `Nowy pracodawca może wymagać odrębnego zezwolenia na pracę` / 706 FAQ2 | 고용주가 임의로 허가를 요구한다는 행위 주체로 읽힐 여지가 있다. | `Praca u nowego pracodawcy może wymagać odrębnego zezwolenia na pracę` / 현재 21행 | 새 고용에 별도 근로허가가 필요할 수 있다는 조건부 의미와 별도 거류 절차를 유지한다. |
| `Aktualizacja danych w banku, na uczelni lub u pracodawcy nie wykonuje obowiązku z art. 31` / 706 본문 | 정보 갱신이 의무를 “수행한다”는 결합이 부자연스럽고 NIA 신고와의 관계가 흐리다. | `Aktualizacja danych w banku, na uczelni lub u pracodawcy nie zastępuje zgłoszenia wymaganego przez art. 31.` / 현재 57행 | 다른 기관 갱신이 법정 NIA 신고를 대신하지 않는다는 의미와 기존 조문 링크를 보존한다. |

작성자의 추가 리듬 수정도 최종 원고에서 읽었으며 기간·조문·기관·may/must의 소실을 발견하지 못했다. 초기 CV 미달이 최종본에도 남았다고 기재하지 않는다. 초안의 완전한 변경 이력은 작성자 보고서 범위이며 여기서는 실제 전달한 두 제안과 현재 버전을 구분한다.

## 최근 PL 세 편 및 단조로움 검수

R의 최근 PL 872·871·870은 제목, 첫 두 실질 문단, 모든 소제목, 고지 전 마지막 두 실질 문단을 직접 비교했다. 이 세 편의 법률 내용 전체를 새로 검증했다는 의미는 아니다.

| 최근 비교 대상 | SHA256 | 비교한 도입·구성·결말 |
|---|---|---|
| 872 `polish-exporter-taiwan-unpaid-euro-invoices` | `835f0602bb3ecdbc73d5e04e09dca49eba7da392356dda7e05fa7c6b1b028dc9` | 가상 수출 송장 사례 → 채무자·시효·송달·자산 → 오래된 송장과 독촉의 두 날짜. 새 세 편에 같은 가상 사례 공식이나 폴란드 국적 가정을 복사하지 않았다. |
| 871 `polish-working-holiday-taiwan-six-month-work` | `d2799eae87cdcd2b211a9ebf8b3567784dfd911099c959bfa8e7e1421b1c5cd7` | 6개월 근로·1년 체류 수치 → 신청·비자·고용·보험/세금 → 남은 근로기간과 계약 질문. 새 704는 서로 다른 기산점을 직접 제시하고 다른 법적 기간을 쓴다. |
| 870 `polish-company-taiwan-subsidiary-branch-office` | `fff46006998d18c39230a261cd2c652c7f60a95bbea2237035561519f9e9d0da` | 계약 당사자 질문 → 조직·자금·근로권·세금 → 계약 이름과 수취인 일치. 새 706은 카드 날짜와 거류 사유의 소멸을 묻는 구체적 질문이며 실질 결말도 여행 문서다. |

MONOTONY: 도입 — 704 `Osoba, która otrzymała wizę rezydencką dopiero na Tajwanie...`, 705 `Przyjęcie na kurs mandaryńskiego nie usuwa...`, 706 `Czy data na ARC nadal pozwala zostać...` — 구체적인 기산 사실/입국 제한에 관한 오해/독자 질문으로 구분된다. 현재 반려할 동일 도입 공식은 발견하지 못했다.

MONOTONY: 결말 — 704 `Termin następnego zgłoszenia może nadejść wcześniej niż data wydrukowana na nowej karcie.`, 705 `W dokumentach przedstawionych NIA powinien już być widoczny cel...`, 706 `Przy zaplanowanej podróży trzeba ustalić, czy dokumenty rzeczywiście dostępne w dniu powrotu...` — 각각 다음 신고·NIA 신청 목적·실제 귀환일의 문서로 닫힌다. 실질 결말 뒤의 적용범위·확인일·출처는 구조적 꼬리다. 동일 판촉형 끝맺음으로 반려할 이유는 발견하지 못했다.

§5 항목별 재확인:

1. 명시적 `--lang pl` 실행은 세 편 모두 FAIL 0이다. 아래에 실제 수치를 기록한다. 다른 언어 fallback 또는 미지원 exit 2를 통과로 사용하지 않았다.
2. 세 도입은 각각 사실·오해·질문이며 하나의 유형이 배치의 절반을 넘지 않는다. 공식 가상사례 도입도 없다. 제목/소제목은 신청·기관·서류·기간·여행을 지칭하고 명령형 체크리스트가 아니다.
3. 8단위 이하 문장은 704/705/706 각각 13/17/16개다. 32단위 이상 문장은 각각 2/2/1개이며 한 문단에 둘 이상인 곳은 0개다. `Urząd zwraca oryginały po porównaniu.`, `Rodzice nie należą do tej grupy.`, `Liczy się data zdarzenia.`처럼 실제 의미가 있는 짧은 문장을 확인했다. 법적 긴 조건을 끊으며 조건의 범위를 바꾸지 않았다.
4. 문단 첫 단어를 실제 세로 목록으로 읽었다. 최대 반복은 704 `na`/`po` 각 2회, 705 각 1회, 706 `przy` 2회다. 연속 문장의 동일 시작은 0/0/1회다.
5. 세 문단 연속의 주장→괄호 조문→예외 공식은 발견하지 못했다. 704의 접수번호·파일 보관 문단, 705의 입국방식에 따른 절차 설명, 706의 고용/허가/이사 날짜 문단은 인용 중심 문단 사이의 실무 효과를 설명한다. 무인용 문단이 있다는 사실로 새 법적 주장에 대한 출처 의무를 면제하지 않았다.
6. 자동 `contrast=0`은 profile이 정의한 일부 표현의 검출 수일 뿐, 본문에 대조가 전혀 없다는 뜻이 아니다. 수동으로 704의 문서 발급지/신청자 소재지 및 僑生/일반학생, 705의 체류허용기간/비자유효기간, 706의 승인기간/납부금액 및 Gold Card 갱신/추가거류를 확인했다. FAQ의 근로권·가족 범주·유예 구분도 읽었다. 직접적인 X/Y 대조는 각 글에서 3회 이내로 판단했으며, 법적 부정·조건 문장 전체를 자의적으로 삭제할 이유는 없다. 독자의 의도나 위법 시도를 지어내 반박하는 문장은 발견하지 못했다.
7. 실질 결말은 위 MONOTONY 기록과 같다. 706의 이메일 안내는 본문 중간의 실제 문의 자료 설명 1회이며 마지막 판촉 문구가 아니다. 복사한 동일 영업 결론은 없다.
8. KO/JA 경어 검사는 PL에 적용하지 않는다. PL 설명 문체에서 존칭/1인칭 경험의 불필요한 전환을 발견하지 못했다. 굵은 강조·우회 HTML·본문 H1·가짜 의뢰인 경험·공개 작성자 표시는 없다. 법정 영문 범주 명칭을 남긴 부분은 임의로 동일 범주로 합치지 않았다.
9. 조문·단위·기산·금액·공식 출처와 가상 이미지 캡션을 최종본에서 다시 대조했다. 선택 제안은 법적 조건을 덜어내지 않았다. 704 본문 질문 0개는 기산표와 신청절차 및 FAQ 3개로 실용 질문을 다루기 때문에 허용할 만하다. 705·706 본문에는 각각 실제 질문 1개가 있다.

이 수동 점검에서 §5의 2–7 중 두 항목 이상의 미충족을 확인하지 못했고, 현재 단조로움에 대한 필수 반려 사유를 남기지 않는다. 이는 모든 폴란드어 독자가 같은 자연스러움 평가를 한다는 보장이 아니다.

## 직접 기계 실행 및 전처리 확인

2026-10-25 21:41:34 KST에 다음 명령을 각 파일에 별도로 실행했다.

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-all-language-columns-20261025/batch02/src/content/columns-pl/704-taiwan-arc-first-application.md --lang pl
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-all-language-columns-20261025/batch02/src/content/columns-pl/705-taiwan-visa-residence-work-study-family.md --lang pl
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-all-language-columns-20261025/batch02/src/content/columns-pl/706-taiwan-arc-renewal-changes-reentry.md --lang pl
```

| 글 | 문장/문단 | mean | CV | short | run3 | opener_rep | cite_end | cite_para | contrast/caveat/q | exit / FAIL |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| 704 | 59/19 | 14.3 | 0.468 | 0.220 | 0.000 | 0.105 | 0.000 | 0.316 | 0/0/0 | 0 / 0 |
| 705 | 75/23 | 14.0 | 0.488 | 0.227 | 0.014 | 0.000 | 0.000 | 0.478 | 0/0/1 | 0 / 0 |
| 706 | 82/27 | 15.2 | 0.455 | 0.195 | 0.075 | 0.037 | 0.000 | 0.481 | 0/0/1 | 0 / 0 |

세 실행 모두 `OK — no variety limit violated`, stderr 없음이었다. PL의 단위는 `orthographic_words`, 짧음 8/김 32이며 유니코드 문장부호·명시적 PL 약어를 사용하는 휴리스틱이다. 폴란드어의 언어학적 단어·통사 분석이나 원어민 자연스러움 척도로 부르지 않는다. 706 CV 0.455는 기준 0.45에 가깝지만 현재 버전은 기준을 충족한다. 후속 수정에는 기존 결과를 이월하지 말고 다시 실행해야 한다.

실제 추출 문장 59+75+82=216개를 모두 읽었다. `Art. 16 ust. 2`, `Art. 31 ust. 3`, `NT$1 000`, 이메일·링크 표시 문구 및 일반 종결부에서 부적절한 분할/병합을 발견하지 못했다. 각 문단의 추출 문장을 이어 붙인 결과는 공백을 정규화한 표시 본문과 일치했다(불일치 0). 세 편 모두 정확한 `## Źródła urzędowe` 뒤 목록이 측정에서 제외되고, 그 앞의 확인일·적용범위 문단은 포함된다. 표·목록·frontmatter/FAQ는 검사기 산출에서 제외되므로 별도로 직접 읽었다. 이 원고의 경계 확인이 모든 PL 입력에 대한 도구 검증을 뜻하지 않는다.

| 실행 도구 파일 | SHA256 |
|---|---|
| `variety_metrics.py` | `0ff4f2b8d68a71fc16e1e9505c83ebcc22de0b01ad4742d0ad126bf81220f532` |
| `variety_multilingual.py` | `a73c18243d935aa0e54024c4eea3d279572a2b595a549025d71e90fd2613a682` |
| `variety_expansion.py` | `e6e2a37261c6708b924c5393355ea01dd7af957fa7e1a3a1d1b5662f505e8359` |
| `profiles/pl.json` | `00b4d91b84026bda2a8f76f963302865311f3ca3600fbd1d1a4267a7ff7dd0fa` |

## 메타데이터·링크와 남은 통합 범위

Node 24.14.1과 R의 `gray-matter`로 세 frontmatter를 실제 파싱했다. FAQ는 각각 3개이고 `audience: [pl]`, `topic: visa`, 내부 `author: legal-ai-assistant`, `published`/`lastmod: 2026-10-25`를 확인했다. 이미지 경로는 각각 EN의 v2 이미지와 같으며 R/public에 존재한다. 대체텍스트는 동일 소재를 폴란드어로 설명하고 `Scena fikcyjna` 캡션을 보존한다. 이 검수에서 이미지를 새로 생성하거나 시각적 품질을 재심사하지 않았다.

본문의 공식 URL을 말미 출처 URL 집합과 비교해 누락 0개를 확인했다. 같은 언어 링크는 B의 704–706 세 정확한 slug로 해결된다. EN 배우자·Gold Card·APRC 링크는 R의 해당 원고가 존재하고 문구에 `po angielsku`가 있다. 로컬 파일 해결은 실제 공개 HTTP 응답을 확인한 것과 다르다. 이메일은 706의 `wei@hoveringlaw.com.tw` 1회이며 폴란드어 상담·통역이나 검수 자격을 새로 약속하지 않는다.

공개 카드·페이지·FAQ JSON-LD·피드에 내부 저자 토큰이 노출되지 않는지, 최종 게시일, 빌드, 실제 공개 commit 및 세 PL 경로의 응답은 root의 통합·배포 검증 범위로 남는다. 이 에이전트는 이 보고서 하나만 작성했고 원고·공유 도구·다른 리뷰·배포 상태를 변경하지 않았다.

## 종료 시 파일 무변경 확인

최종 SHA 재확인 결과는 아래 실행 기록으로 보충한다. 위 결론은 이 고정 원고에 한정한다.

2026-10-25T21:52:37+09:00에 SHA256을 다시 계산했다. PL 3편은 작성자가 전달한 freeze 및 21:41:34 직접 검사 버전과 모두 일치했다. 현행 EN/KO/ZH 9편, 공통 facts, R 문체 정본, 최근 PL 3편, 실행 도구 4개 파일, 작성자 보고서도 위에 기록한 해시와 모두 일치했다(총 22개 대조, 불일치 0). 이 재확인은 파일의 동일성 확인이며 새로운 법률·원어민 감수나 공개 배포 검증을 뜻하지 않는다.
