# Existing SK 014 / 877 / 878 — copy-only author repair

2026-10-26 KST · 작성·자가검수: column_existing_drafts.

배정 범위인 B9/existing-repairs 사본 세 편에서 실제 문장 8곳을 수정했다. 현재 공유 검사기의 정확한 `--lang sk` 실제 CLI는 세 편 모두 exit 0 / FAIL 0이다. 초기 실패·중간 결과·날짜 경계 결함·가드에서 중지된 시도는 그대로 보존했다. R의 원고 세 편은 초기 SHA 그대로이며 이번 기록은 배포·전체 법률 재조사·사람 원어민 또는 변호사 승인에 해당하지 않는다.

## 입력과 검수 범위

`checks/sk-existing-inputs.json`의 R 원고 세 편을 전문 읽고, metadata와 FAQ 10개, 목록·공식 URL·끝 문구까지 대조했다. 공통 문체, 프로젝트 문체, 다양성 규칙 및 최신 전문을 읽은 LESSONS(19:05, SHA 56120b79d5f6a483f760f2a470dab7753ca7d14d1c727ce8e8bbd721da773f97)를 적용했다. 이번 좁은 편집은 기존의 공식 근거와 법률 명제를 유지하는 작업이며, 원문 판결·공식 법령 전부를 새로 웹 열람했다고 주장하지 않는다. 홈의 editorial-voice 파일은 현재 없어서 읽었다고 기록하지 않았고 프로젝트 정본을 적용했다.

014는 기존 형식으로 published/author/audience가 없고 lastmod 2026-07-25, date_display 13. septembra 2025와 기존 변호사 이름 줄이 있다. 이 배정에서 이를 새 발행 메타데이터로 바꾸거나 저자 승인을 새로 주장하지 않았다. 877/878의 2026-10-24 발행일과 legal-ai-assistant 표기는 그대로다.

## 실제 변경과 의미

### 014 / r1

문제 문장:

> Samotná skutočnosť, že existuje podpísaný text, však neurčuje platnosť dohody ani sumu na vrátenie.

이유: 긴 도입의 종속절을 걷어내고 계약의 유효성과 반환액이라는 서로 다른 판단을 두 짧은 실제 설명으로 분리한다.

수정:

> Podpísaný text ešte neurčuje platnosť dohody. Rovnako neurčuje sumu na vrátenie.

의미 보존: 서명만으로 유효성이나 반환액이 결정되지 않는다는 동일 범위. 법적 요건·금액·날짜·FAQ 변경 없음.

### 877 / r1

문제 문장:

> Faktúra za zariadenie, potvrdenie dodania a protokol o uvedení do prevádzky môžu mať rôzne dátumy. Slovenský dodávateľ pri vymáhaní potrebuje zistiť, na ktorý z nich zmluva viaže zaplatenie.

이유: 15/13단어 독립 나열을 날짜가 다를 때 계약상 지급기산을 확인한다는 조건·행동 관계로 연결한다.

수정:

> Keď sa líšia dátumy na faktúre za zariadenie, potvrdení dodania a protokole o uvedení do prevádzky, slovenský dodávateľ potrebuje pri vymáhaní zistiť, na ktorý z nich zmluva viaže zaplatenie.

의미 보존: 송장·인도확인·시운전기록이라는3자료 및 각 날짜와 계약상 지급조건을 보존. 모든 송장에 같은 기산일을 단정하지 않으며 다음 기술적 인도조건/시험자료 조언은 그대로.

### 878 / r1

문제 문장:

> Výnimka sa týka spoločníka, ktorý zneužitím právnej subjektivity spôsobí spoločnosti konkrétny dlh, s ktorého splatením má spoločnosť zjavné ťažkosti. Spoločník musí tento dlh uhradiť, ak sú zároveň okolnosti závažné a uloženie takej povinnosti nevyhnutné.

이유: 같은 주어·채무를 되풀이하던 두 문장을 누적 요건 전체와 상환의무가 연결되는 한 문장으로 정리한다.

수정:

> Výnimka zaväzuje spoločníka uhradiť konkrétny dlh, ktorý spoločnosti spôsobil zneužitím jej právnej subjektivity, ak má spoločnosť so splatením zjavné ťažkosti a zároveň sú okolnosti závažné a uloženie tejto povinnosti nevyhnutné.

의미 보존: 주체는 해당 spoločník, 남용으로 회사의 특정채무 발생 AND 회사의 현저한 변제곤란 AND 중대한 사정/의무부과 필요성 모두 유지. 단순 미변제·지분소유만으로 책임을 만들지 않는다.

### 877 / r2

문제 문장:

> Taiwanský platobný rozkaz, 支付命令, možno žiadať pre určitú peňažnú sumu podľa [článku 508 Civilného sporového poriadku Taiwanu](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=508). Veriteľ musí nárok predbežne osvedčiť a opísať aj splnenie svojho vzájomného plnenia, ak sa vyžaduje ([článok 511](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=511)).

이유: 동일17단어 절차설명 두 문장을 신청 가능한 대상과 그 신청자가 입증할 내용을 이어 읽도록 연결한다. 뒤의8단어 시험/인수기록 설명과 호흡을 달리한다.

수정:

> Taiwanský platobný rozkaz, 支付命令, možno žiadať pre určitú peňažnú sumu podľa [článku 508 Civilného sporového poriadku Taiwanu](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=508), pričom veriteľ musí nárok predbežne osvedčiť a opísať aj splnenie svojho vzájomného plnenia, ak sa vyžaduje ([článok 511](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=511)).

의미 보존: 일정금전의 절차 may, 채권자의 소명·필요한 경우 반대급부 이행설명 must,508·511조와 두URL의 순서 및 다음509예외를 모두 유지.

### 878 / r2

문제 문장:

> [Invest Taiwan porovnáva](https://investtaiwan.nat.gov.tw/showPageengInvestmentStatus01?lang=eng&menuNum=7&search=InvestmentStatus01) dcérsku spoločnosť a pobočku, ktoré môžu obchodovať, so zastupiteľskou kanceláriou určenou na právne a kontaktné úkony. Plán miestneho predaja a plateného servisu preto vyžaduje inú úvahu než samotné prepájanie taiwanských zákazníkov so slovenskou centrálou.

이유: 19/18단어 설명을 공식 비교의 차이가 실제 영업·서비스 계획에 미치는 관계로 재구성한다. 중복된 비교·별도검토 표현을 줄인다.

수정:

> Podľa [Invest Taiwan](https://investtaiwan.nat.gov.tw/showPageengInvestmentStatus01?lang=eng&menuNum=7&search=InvestmentStatus01) môžu dcérska spoločnosť a pobočka obchodovať, kým zastupiteľská kancelária slúži na právne a kontaktné úkony; miestny predaj a platený servis preto treba plánovať odlišne od prepájania taiwanských zákazníkov so slovenskou centrálou.

의미 보존: 자회사/지사의 영업 가능, 대표사무소의 법률·연락 활동과 현지 판매·유상서비스/고객연결의 구별 및 공식URL 그대로. 별도 허가·등록 예외나 새로운 국적 자격을 만들지 않음.

### 014-R3-01 / r3

문제 문장:

> Dohoda nie je automaticky neplatná. Podľa článku 15-1 taiwanského zákona o pracovných normách (勞動基準法) môže splniť zákonné predpoklady, ak zamestnávateľ poskytne špecializované technické školenie (專業技術培訓) a nesie jeho náklady, alebo poskytne primeranú náhradu (合理補償), aby pracovník dodržal minimálnu dobu trvania pracovného pomeru. Nie je nutné splniť oba predpoklady zároveň, avšak aj keď existuje jeden, dohoda nesmie prekročiť primeraný rozsah vo svetle všetkých okolností, ako sú doba a náklady školenia, možnosť nahradiť personál (人力替補可能性) a výška a rozsah náhrady.

이유: 두 연속 장문 중 OR 대안 요건과 별도 비례성 심사를 분리한다.

수정:

> Dohoda nie je automaticky neplatná. Podľa článku 15-1 taiwanského zákona o pracovných normách (勞動基準法) môže splniť zákonné predpoklady, ak zamestnávateľ poskytne špecializované technické školenie (專業技術培訓) a nesie jeho náklady, alebo poskytne primeranú náhradu (合理補償), aby pracovník dodržal minimálnu dobu trvania pracovného pomeru. Oba predpoklady nemusia byť splnené súčasne. Aj pri splnení jedného však dohoda musí zostať primeraná všetkým okolnostiam vrátane doby a nákladov školenia, možnosti nahradiť personál (人力替補可能性) a výšky a rozsahu náhrady.

의미 보존: 교육 제공 AND 비용 부담 OR 적정 보상, 하나 충족 후에도 별도 비례성 심사 및 교육기간/비용·인력대체·보상액/범위 유지. FAQ의 동일 문장은 불변.

### 014-R3-02 / r3

문제 문장:

> Okolnosť, že pracovník zmluvu podpísal, môže byť podkladom, ktorý potvrdzuje existenciu dohody, ale nenahrádza zákonné predpoklady.

이유: 서명의 겹종속절을 증명할 수 있는 범위와 대체하지 못하는 요건으로 분리한다.

수정:

> Podpis môže preukazovať, že dohoda existuje. Zákonné predpoklady však nenahrádza.

의미 보존: 합의 존재 증명이 될 수 있다는 may와 법적 요건을 대신하지 않는다는 부정 모두 보존.

### 014-R3-03 / r3

문제 문장:

> Článok 16 je ustanovenie o skončení zmluvy zamestnávateľom a na odchod pracovníka sa táto výpovedná doba uplatní prostredníctvom článku 15.

이유: 제16조 자체의 종료 주체와 제15조를 통한 근로자 준용을 나눈다.

수정:

> Článok 16 upravuje skončenie zo strany zamestnávateľa. Na výpoveď pracovníka sa príslušná lehota vzťahuje prostredníctvom článku 15.

의미 보존: 제16조 사용자 종료·제15조 근로자 통지기간 적용 유지. 앞 무기계약 전제 및 뒤3개월/1년/3년과10/20/30일 목록 불변.

## 측정과 실제 경계

| 기사 | 초기 실제 CV | 최종 실제 문장 수 / CV | 최종 CLI |
|---|---:|---:|---|
| 014 | .449 (옛 숫자 날짜 오분리 포함) | 126 / .452 | exit 0, FAIL 0 |
| 877 | .408 | 51 / .479 | exit 0, FAIL 0 |
| 878 | .381 | 54 / .464 | exit 0, FAIL 0 |

초기 r1에서 014의 .460은 정상 날짜가 조각난 이전 경계의 수치였다. 새 숫자 날짜 profile로 실제 검사한 installed-before는 .427 / FAIL이었다. 정상 날짜 `5. 6. 2026` 자체를 변경하지 않고 OR 전제·별도 비례성·서명의 효력·조문 준용 주체를 읽기 쉽게 나눈 세 곳의 실질 편집 후 .452가 되었다. 마지막 `r3-applied`가 현재 014 SHA에 대한 실제 검사이며, 877/878은 `final`에 현재 공유 검사 결과가 있다. `r3` 로그는 중복 대상 가드가 FAQ까지 변경할 위험을 차단하여 원고를 쓰기 전 중지한 뒤의 미변경 원고 검사다. 이를 편집 후 성공으로 사용하지 않는다.

공유 도구: metrics c96c303b… / multilingual 0b4af8c4… / expansion ae6cca9e… / SK profile 2ea68f2ea8e9a6876c35ea895d8469bcf2c9e6091bb9c64f5bf0270c015bd9af. 설치 영수증은 B10/tooling/sk-tr-root-install/ROOT-INSTALLATION.json(SHA 4a71e4966c7eabc64828cda77ca6161b007a8a794525c88e1fda1d8dd192fbe9)이다. PL 도구를 옛 엔진으로 되돌리지 않았다. B9 신규 SK6의 동일 SHA 전수 CLI를 재실행하지 않았다.

세 원고의 최종 231개 양수 단위 문장을 검수 범위로 연결했다. 이전 전문·전체 배열 독해를 재사용한 정확 동일 문단은 45/14/14개이며, 달라진 7/2/2개 문단을 현재 추출로 다시 모두 읽었다. 014의 그중 3개는 원문 변화 없이 숫자 날짜 경계만 정상화된 문단이다. `---`의 0단위 구획은 짧은 문장으로 세지 않았다. 본문 측정에 포함되지 않는 FAQ 10개·제목·목록은 별도로 읽었다. 브라우저/SSR 검사를 했다는 주장이 아니다. 공유 body_blocks의 softwrap 숫자 날짜 목록 오인 문제는 독립 checker 보고에 남은 기존 한계이며 이 세 편의 변경 문단에 그 줄바꿈 패턴은 없다.

## §5 자기 점검과 MONOTONY

1. 실제 최신 공유 CLI 세 편 FAIL 0이며 toolHashes와 toolEndHashes가 일치한다. 최종 SHA와 결과가 연결되어 있다.
2. 첫 문장은 014 법률 대상 정의, 877 서류 날짜 불일치의 조건, 878 현지 활동 범위를 묻는 질문이다. 새 가상 상담·경험담을 만들지 않았다.
3. 각 편에 8단어 이하의 실제 짧은 문장이 2개 이상 있다. 최종 문단 안에서 32단어 이상 장문 2연속은 없다. 014의 기존 핵심 조건이 긴 문장인 사실을 감추지 않았고 다른 조건을 삭제해 짧게 만들지 않았다.
4. 문단 시작을 세로로 확인했다. 긴 014의 `Pri` 4회는 52문단에서 떨어져 있으며 적용되는 긴 글 상한(문단 수/8)을 넘지 않고 동일 시작 연속도 1이다. 877/878은 반복 수 2/1이다. 짧은 글 상한을 014에 기계적으로 적용하거나 반복 자체가 전혀 없다고 주장하지 않는다.
5. 주장·조문 뒤 예외만 세 번 연속하는 새 틀은 없다. 날짜·자료·계산·거래 실행 문단으로 전환된다. 인용 없는 구체적 설명 문단이 있다.
6. 대비 틀은 1/0/0이고, 수정에서 독자가 하지 않은 주장을 새로 반박하지 않는다. 014의 서명·전액 반환·교육유형 대조는 실제 쟁점과 연결되어 있다.
7. 877은 각 지급분의 기산 증거, 878은 첫 주문의 판매자·수령인·서비스 주체로 실질 결말이 끝난다. 014는 공식자료·관련링크·기존 고지 및 이름 줄을 제외하면 계약/교육/지급/근로/통지 날짜와 보유 자료를 맞추는 문단으로 끝난다. 기존 법률 고지·서명은 보존 대상이라 삭제하지 않았고 이를 새 저자의 사실 결말이라고 오인하지 않는다.
8. 굵은 강조/HTML strong/b, 새 1인칭 경험담은 없다. 014의 기존 34개 목록 항목과 제목 구조는 보존했다. 따라서 이번 결과를 legacy 014 전체를 신작 구조로 재편한 전면 문체 승인으로 부풀리지 않는다.
9. 조문·기한·금액·URL·이미지·가상 표시·FAQ·메타데이터 보존은 byte/순서 비교로 확인했다. 신규 현지법·국적·상담 언어 주장을 추가하지 않았다.

MONOTONY: 014 겹종속절/유사 장문 — `Nie je nutné splniť oba predpoklady zároveň, avšak…` — OR 전제와 충족 후 별도 비례성 심사를 분리했다. `Okolnosť, že pracovník zmluvu podpísal, môže byť podkladom…`은 서명이 증명할 수 있는 범위와 대체할 수 없는 요건으로 나눴다. 짧은 허구 문장이나 내용 없는 표어를 추가하지 않았다.

MONOTONY: 877 같은 길이 설명 — `Faktúra…`/`Slovenský dodávateľ…`, 이어지는 508/511 절차 — 조건과 행동, 신청대상과 소명 의무의 관계를 연결해 길이에 차이를 냈다. 509 예외와 뒤의 짧은 시험 기록 설명은 유지했다.

MONOTONY: 878 반복 주어/비교 나열 — `Výnimka sa týka spoločníka… Spoločník musí…` — 채무와 누적 예외 요건을 한 흐름으로 읽게 정리했다. Invest Taiwan의 비교도 실제 판매·서비스 계획과 연결했으며 별도 의무를 새로 만들지 않았다.

## 보존 증거와 한계

초기·r1·r2 사본과 8개 실제 old/new, 각 diff가 보존되어 있다. 최초 세 편에서 8개 변경을 순서대로 적용하면 현재 세 편이 정확히 재현되며 역순 복원은 초기 SHA 3/3에 일치한다. R 원고 SHA 3/3도 초기와 같다. 메타데이터와 FAQ는 byte 동일이고 gray-matter 파싱·deep equality도 3/3, 숫자 및 URL 순서·Markdown 링크·본문 이미지·제목/목록 줄도 모두 동일하다. `sk-existing-final-integrity.json` 및 `sk-existing-final-structure.json` 오류 0이다.

이는 현행 공유 도구를 통한 문장 다양성 수치와 AI의 실제 문장 의미·경계 독해 결과다. 사람 원어민/변호사 검수, 공식 원문 신규 전수 조사, 렌더링, 배포 또는 공개 확인과 구별한다. 원문 014의 장문의 법률 FAQ와 목록을 수치 통과를 위해 삭제하지 않았다.

## 최종 사본 SHA

- `014-taiwan-mandatory-employment-period.md` — `631c8e1ba003b6bc0268a09e76e67af95fea57384be4826484850c3399a68ef6`
- `877-slovak-exporter-taiwan-unpaid-invoice-recovery.md` — `60638adf443098093688db12bb8be6374d858783382548fb91afd5a0e963d911`
- `878-slovak-business-taiwan-subsidiary-branch-office.md` — `f9998228d7d54128519262cc1884a86e8d62906e66db27189b515c9cba7d9da2`
