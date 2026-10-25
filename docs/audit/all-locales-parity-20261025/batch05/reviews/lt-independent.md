# LT 704–706 독립 의미·문체 검수

검수일: 2026-10-26 KST. 작성자와 다른 검수자 `/root/column_voice_rules`가 동결 원고 전체, 제목·SEO 제목·요약·FAQ·표·출처를 대조했다. 원고, 저자 기록, R, 공유 도구는 수정하지 않았다.

판정: 이 동결본에서 확인한 필수 수정 0건, 선택 문구 개선 2건. 실제 공유 검사 세 편 모두 exit 0 / FAIL 0이며, 추출된 본문 문장 243개를 원문과 순서대로 대조해 확인 범위에서 오분할·미분할을 발견하지 못했다. 이 결과는 원어민 사람의 교정, 대만 변호사의 법률 승인, 공개 렌더링 또는 배포 완료를 뜻하지 않는다. 검수자는 LT 측정 프로필 구현자이므로 이번 실행을 도구 자체에 대한 독립 검증이라고 부르지 않는다.

## 검수본과 입력 고정

| 파일 | SHA-256 |
|---|---|
| `src/content/columns-lt/704-taiwan-arc-first-application.md` | `51188308b2cc93faedf23524d48597d0da663229893ed7f1c0b447babc2e444e` |
| `src/content/columns-lt/705-taiwan-visa-residence-work-study-family.md` | `ca974db0271c49c33ac808f095e8c7708ad89e205828e7ce8b2dedef14048bc9` |
| `src/content/columns-lt/706-taiwan-arc-renewal-changes-reentry.md` | `4b2d935fa2496bf95b6e304f976e937221a6ab696ab9aa7cf526e2811c7cf1c6` |
| `reviews/lt-author.md` | `ff31f23245966285099cc6a34afd0a55fe3d9e949e746489fe9754def2ae81aa` |

위 경로는 batch05 기준이다. 작성자 `/root/column_deploy`가 검수 동안 네 파일을 동결한다고 확인했다. 시작 때 저자 입력 20개를 실제 파일과 비교해 차이 0개, 검수 말미 28개 고정 입력을 다시 비교해 차이 0개였다. 최종 확인과 산출물 해시는 [manifest](../checks/lt-independent-manifest.json)에 기록한다.

읽은 기준은 batch02–05 BRIEF, R의 AGENTS와 all-locales BRIEF, F01–F24 facts, source-refresh, 현행 EN·KO·ZH 704–706 아홉 편 전문, 최신 LT 945·944·899 전문, FRONTMATTER, 편집 및 문장 다양성 규칙이다. 정확한 원문·최근 글·규칙·공유 도구의 해시는 [입력 기록](../checks/lt-independent-inputs.json)에 있다. `~/agent-library/knowledge/editorial-voice.md`는 이 환경에 없어서 그 경로의 전문을 읽었다고 주장하지 않는다. 확인 가능한 프로젝트 정본 `R/docs/columns/EDITORIAL-VOICE.md` 전문, `~/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, 공유 `SENTENCE-VARIETY-RULE.md`·`LESSONS.md`를 적용했다. 폐기된 Fable 강제 절차는 적용하지 않았다.

## 필수 수정

현재 동결본에서 필수 의미·문체 오류는 발견하지 못했다. 짧은 EN 정본에 없는 세부사항의 추가나, 정확한 요약의 불필요한 확장을 통과 조건으로 만들지 않았다. F01–F24는 공통 점검 목록이며, 모든 세부가 모든 글에 각각 들어 있어야 한다는 뜻으로 적용하지 않았다.

## 선택 문구 개선

아래 제안은 적용하지 않았다. 현재 문맥에서 법적 의미를 반대로 서술한 오류로 판정한 것은 아니며, 수치 통과를 위한 문장 변경도 아니다. 채택할 경우 바뀐 문장과 실제 지표·경계를 다시 확인해야 한다.

### O1 — 704, 72행: 체류기간의 대상을 명확히

- 문장: `Didesnė sumokėta suma nesukuria teisės į ilgesnį gyvenimą.`
- 이유: 앞 문장과 문단이 허가기간을 설명해 뜻은 파악되지만, `ilgesnį gyvenimą`만 떼면 ‘더 긴 삶’으로도 읽힌다. 법률 용어를 바꾸기보다 기간이 ARC 허가기간임을 바로 지칭하는 편이 명확하다.
- 제안: `Didesnė sumokėta suma nesuteikia teisės į ilgesnį ARC galiojimo laikotarpį.`
- 의미 보존: 더 낸 수수료로 더 긴 허가기간을 얻는 것은 아니라는 F09·F10을 유지한다. 앞 문단의 일반 3년, 적격 특정전문인재 5년, NIA 허가 다음 날 기산은 그대로 둔다. 새로운 자격이나 금액을 추가하지 않는다.

### O2 — 705, 42행: 제외 대상과 법령 예외를 구별

- 문장: `Tarp išimčių taip pat yra atvykimo vizos, ABTC verslo kelionių kortelė ir darbo atostogų viza.`
- 이유: 직전 문장의 `nebent taikoma kita taisyklė` 다음에 `išimčių`를 쓰면 ‘다른 법령에 의한 예외’와 ‘이 직접 신청 절차에서 제외되는 입국 방식’의 지시 대상이 잠시 겹친다. 문단 전체와 마지막 문장은 제외 취지를 유지하고 있다.
- 제안: `Ši tvarka taip pat netaikoma atvykus su atvykimo metu išduodama viza, ABTC verslo kelionių kortele ar darbo atostogų viza, nebent teisės aktai numato kitaip.`
- 의미 보존: NIA 0915의 제외 목록과 다른 법령의 예외를 모두 유지한다. `atvykimo metu išduodama viza`는 visa on arrival를 명시한다. 가족 제16조의 자격, 허가 종류, 입국 후 신청의 승인 조건에는 손대지 않는다. 근거는 [NIA 0915 주의 7(1)](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news)이다.

## 의미 대조 기록

| 명제 | 확인한 LT 문장·범위 | 결과 |
|---|---|---|
| F01–F02 | 704 요약·FAQ1·26–34행 | 거류비자 입국과 거류허가 전제, 입국 다음 날부터 30일, 유효 통합증명 예외를 유지한다. 대만 내 비자 발급은 발급일 기산으로 구분한다. 무비자 방문자 모두에게 30일 전환권을 주지 않는다. |
| F03 | 704 34행; 705 FAQ1·38–44행 | 두 전문인재 범주, 전문업무 허가 OR 면제, 적격 입국, NIA 신청 후 승인과 ARC 발급을 구분한다. 채용 제안·ARC만으로 취업 허가가 생기지 않는다. 일반 이주노동자는 별도 체계다. |
| F04 | 705 60–62행 | `[(일반 전문인재 AND 대만 전문업무) OR 특정전문인재] AND (NIA 거류 OR 영주허가)`가 두 문장으로 명확히 보존됐다. 전문업무 종사를 특정전문인재 범주에 추가하지 않는다. 배우자·미성년·장애로 자립 불가인 성년 자녀와 가족의 적격 입국 조건을 유지한다. |
| F05 | 705 58행·FAQ3 | 대만 거주 AND 호적등록, 체류허용 60일 이상인 유효 비자, 연장 등의 제한 부재를 함께 적었다. 비자의 단순 유효기간 60일로 바꾸지 않는다. |
| F06 | 704 38–48행 표 포함 | 사진 최근 2년과 BOCA 비자 사진 6개월을 구별한다. 재직·재학 증명은 최근 한 달 내 발급이다. 등록 전 입학자료와 등록 후 재학자료를 나누고, 학생증과 재학증명을 누적 필수로 만들지 않았다. |
| F07 | 704 54–56행 | 해외문서 인증은 `turi būti`, 중국어 번역 요구 가능성은 `gali pareikalauti`로 구분한다. 학생 시스템의 별도 번역 기준을 가리킨다. 리투아니아 인증 관행이나 아포스티유 수용을 추정하지 않는다. |
| F08 | 704 50행 | 대만 거주·호적 국민과의 최초 배우자 거류에 한정해 최장 1년과 배우자 동행을 유지한다. 모든 외국인 배우자의 공통 기간으로 확대하지 않는다. |
| F09–F10 | 704 FAQ2·68–72행, 705 68행, 706 51·79행 | NT$1,000/년, 미만 1년분, 해당 직접 경로 NT$2,200, 僑生 한정 50%, 재발급 NT$500를 보존한다. 일반 3년·특정전문인재와 적격 가족 5년·금카드 1–3년을 구별한다. 제8조는 NIA 거류허가 다음 날 기산이다. O1은 표현상 선택 제안이다. |
| F11–F12 | 704 76–78행 | 일반 심사 10근무일의 제외기간과 재계산, 학생 심사 5근무일을 구별한다. 승인일부터 납부 5근무일, 납부 뒤 전자 ARC 다운로드 AND 인쇄, IC 영수증 인쇄와 납부 3근무일 뒤 지정센터 수령을 유지한다. 전자형 6개월 이하와 학생 절차 한정도 있다. |
| F13 | 705 FAQ2·48–54행 | 정규학위와 어학 경로를 분리하고 적격 비자 목적을 유지한다. 어학 4개월 이수 AND 최소 3개월 계속 등록, 주중 주15시간, 휴가 포함 결석 1/4 이하가 정확하다. `bent`를 초과로 번역하지 않았다. |
| F14 | 704 FAQ3·80행; 705 54·64행; 706 59행 | ARC와 근로허가를 구별한다. 학생의 방학 외 20시간 상한, 방학에도 다른 허가 요건이 남는 점, 대만 국민 배우자의 제48조 면제와 특정·고급 전문인재 배우자의 제15조 직접 허가 신청을 구별한다. |
| F15–F16 | 706 FAQ1–2·34–39행 표 | 일반 연장은 만료 전 3개월 범위다. 주소·근무장소는 다음 날부터 30일 신청, 제23-1조 사유 변경은 발생일부터 30일 NIA 신청, 그 밖은 발생일부터 15일 BOCA 재신청 후 NIA 절차다. 기관이 기한 안에 발급을 완료해야 한다는 표현이 아니다. |
| F17 | 706 41행·FAQ1 | 사업 유지 창업가 4개월과 사업 소멸 후 별도 경로 3개월, 금카드 자체 갱신 4개월을 구별한다. 만료 뒤 유예기간으로 만들지 않는다. |
| F18–F19 | 706 26·53·67행 | 사유 소멸 시 NIA 취소 의무와 예외의 재량을 구별한다. 가정폭력 이혼 후 미재혼의 주체는 외국인 신청자다. 대만 전 배우자의 거주·호적 조건도 있다. 노동분쟁의 절차 진행·산재 치료 중 조건을 유지한다. 30일 미만 AND 원래 사유 존속, 처벌 후 재신청·영주 산입 1년 공제를 유지한다. |
| F20 | 706 69–71행 | 적격 전문인재 6개월·추가1회·총1년과 적격 졸업생 1년·추가1회·총2년을 분리한다. 만료 전에는 신청해야 하며, 그 전에 승인까지 완료돼야 한다는 조건을 만들지 않는다. 승인된 기간은 종전 만료 다음 날부터이고, 종전 근로 권한이 자동 연장되지 않는다. |
| F21 | 706 73행 | 대만 associate degree 이상을 이미 취득하고, 새 졸업생으로 NIA 연장거류 허가를 받은 사람이 그 허가기간에 근로허가 면제를 받는 세 조건을 유지한다. 졸업예정자·모든 구직 ARC로 확대하지 않는다. |
| F22 | 706 FAQ3·81·85–91행 | 일반 재입국허가의 출국 전 요건과 ARC 효력 한계, APRC 예외를 보존한다. 유효 여권과 APRC, 유효 ARC/APRC가 있는 경우의 도착일 여권 유효성 및 입국 심사를 구별한다. 영수증·사진·해외 재발급 가능성을 탑승·입국 보장으로 쓰지 않는다. |
| F23 | 706 89행 | 특정 전문인재·가족 온라인 경로의 출국 시 심사 중단은 `nenagrinėjamas`로 명시됐다. 재입국 AND 적격일 때 새 신청 MAY이며, 모든 ARC 신청에 대한 출국 금지로 넓히지 않는다. |
| F24 | 704 64·76행 | 통지 다음 날부터 15일, 해당 지역에서 자료를 받아야 하는 경우 3개월 대체기간, 불완전 보완도 기각, 이후 10근무일 재계산을 보존한다. 15근무일 또는 15일+3개월로 바꾸지 않는다. |

수치가 덜 나온 제목·요약·FAQ는 본문과 반대되는 자격이나 자동 승인을 약속하지 않는다. 705의 `nuolatinės studijos`는 해당 문맥에서 학위과정의 정규/전일제 학업을 뜻하며, 영주거류로 옮겨진 문장이 아니다. 글 전체의 거류·일시 체류·근로허가 주체는 대만이다. 언어를 독자의 국적이나 리투아니아 법 적용으로 간주하지 않았다.

## 공식 본문 재확인과 한계

이번 검수에서 [인재법 제16조 중문](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16)과 [현행 영문 전문의 제12·15·16·17조](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295), [이민법 현행 중문 전문의 제31·34조](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080132), [거류 규칙 영문 전문의 제11·12조](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=D0080129)를 실제 열어 관련 문단을 읽었다. 추가로 [NIA 0902 중문 보완·처리시간과 주의사항](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/29996/), [학생 0929 문서·납부·수령·심사 조항](https://www.immigration.gov.tw/5475/5478/141465/141808/417829/cp_news), [전문인재·가족 온라인 경로 주의 9항](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/), [0915 주의 7(1)](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news)을 확인했다.

인재법 제12조 중문 단일조문, 이민법 제34조 단일조문은 도구에서 접근 오류가 났고, 제31조 단일조문은 timeout이었다. 각각 공식 현행 전문의 관련 조문으로 확인했다. NIA 0902의 `find`는 본문에 있는 단어를 찾지 못했으나 191행의 실제 보완기간을 열어 읽었다. 실패를 근거 부재로 취급하지 않았다. 모든 말미 링크의 현행 웹 본문을 이번에 전수 재열람했다는 주장은 하지 않는다. 그 밖의 대조는 고정된 아홉 원문과 F01–24·source-refresh의 근거 범위다.

법무부 사이트의 데이터 정비 기준일 표시는 2026-10-16이었다. 이후 관보를 전수 조사하거나 접수기관·공관의 개별 답변을 얻은 검수는 아니다. 공개 원고의 10월24–25일 출처 확인일은 10월26일 발행 메타와 분리되어 있다. 접근 기록은 [공식 출처 확인 기록](../checks/lt-independent-sources.json)에 남긴다.

## 최근 LT 세 편과 문체 비교

최근 실제 파일은 발행일 및 같은 날 번호 순으로 945·944·899다. 897–899를 최신 세 편으로 가정하지 않았다.

| 비교 글 | 도입·제목·결말의 실제 구조 | 새 LT 세 편과의 비교 |
|---|---|---|
| 945, `Taivane užsakyta lazerio valdymo programa: teisės ir pirminis kodas` | 지불이 모든 저작권을 이전하지 않는다는 구체 법률 결론으로 시작한다. 마지막은 인수팀에 전달할 프로그램 버전·권리·빌드 자료다. | 704는 최초 기산점, 705는 비자 전환 질문, 706은 거류 근거 소멸의 효과로 시작한다. 945의 대금·권리 대조를 옮긴 문단은 없다. |
| 944, `Lazerio bandymai Taivane: nustatymai, duomenys ir įrangos grąžinimas` | 레이저와 함께 전달되는 설정·방법 자료로 시작한다. 마지막은 장비번호·파일버전·반환자료가 일치하는 인계 첨부물이다. | 제목에 콜론과 구체 항목을 쓰는 공통점은 있지만, 새 글의 대상·행위·마감이 실제 각 ARC 절차에 맞는다. 같은 가상 장면·훈계 문구를 재사용하지 않는다. |
| 899, `Lietuvos prekės ženklo registracija Taivane per platintoją` | 상표 출원인이 누구인지 확인하는 실제 출원자료로 시작한다. 마지막은 각 등록의 공고일을 따로 기록하는 행동이다. | 새 글의 말미는 각각 카드 정보와 이후 신고, 서류상 업무·학업·가족 날짜, 실제 귀환일에 유효한 증명으로 끝난다. 일반적인 ‘전문가와 상담’ 문장으로 수렴하지 않는다. |

MONOTONY: 필수 반려 항목 없음. 실제 문장 `Terminas prasideda kitą dieną po atvykimo.` / `Ar atvykus į Taivaną be vizos galima čia pat prašyti leidimo gyventi?` / `Vien kortelės data atsakymo neduoda.`는 각각 기산·질문·효과 확인의 기능이 다르다. 방향: 법정 용어와 근거 설명을 유지하고, 단조로움이 확인되지 않은 곳을 점수 목적으로 합치거나 늘리지 않는다. 세 편의 출처 확인일·별도 신분제도 고지는 필요한 범위 표기로 남긴다.

## 문장 다양성 실행과 §5 재확인

실제 명령은 각 파일에 대해 다음과 같이 실행했다. 원고 SHA는 실행 전후 동일했다.

```sh
PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH PYTHONDONTWRITEBYTECODE=1 python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check --lang lt /Users/son7/tseng-all-language-columns-20261025/batch05/src/content/columns-lt/704-taiwan-arc-first-application.md
PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH PYTHONDONTWRITEBYTECODE=1 python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check --lang lt /Users/son7/tseng-all-language-columns-20261025/batch05/src/content/columns-lt/705-taiwan-visa-residence-work-study-family.md
PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH PYTHONDONTWRITEBYTECODE=1 python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check --lang lt /Users/son7/tseng-all-language-columns-20261025/batch05/src/content/columns-lt/706-taiwan-arc-renewal-changes-reentry.md
```

| 항목 | 704 | 705 | 706 |
|---|---:|---:|---:|
| exit / FAIL | 0 / 0 | 0 / 0 | 0 / 0 |
| 본문 문장 | 74 | 77 | 92 |
| 길이 CV | 0.478 | 0.451 | 0.482 |
| 짧은 문장 비율 | 0.324 | 0.247 | 0.283 |
| 같은 길이 3연속 비율 | 0.069 | 0.093 | 0.078 |
| 최다 문단 시작어 횟수 | 2 | 1 | 2 |
| 같은 시작어 연속 | 0 | 0 | 0 |
| 문장 끝 괄호 인용 비율 | 0 | 0 | 0 |
| 도구 대비식 계수 | 0 | 0 | 0 |

LT 길이는 공백·정서법 기반 단위(`orthographic_words`)이며 짧음 8, 긺 32의 고정 휴리스틱이다. 가독성 교정치, 어휘 난이도 점수 또는 다른 언어와 동등한 품질 척도가 아니다. 공유 `variety_metrics.py` SHA는 `5abf02f52e35c45f921084106b6acf3c0caf0ca02f09649de1c1eb6977019b3e`, LT 프로필 SHA는 `a91bc6f0a6d80aada83de9c463836b6c4c4d724eddc32ff18905b573642d3694`다. 실행 전문·문단·문장·단위 배열은 [실행 기록](../checks/lt-independent-variety.json)에 있다.

| §5 항목 | 독립 재확인 |
|---|---|
| 1 실제 검사 | 올바른 `--lang lt`, 세 편 exit0/FAIL0. 지표와 실제 의미·경계 검수는 별도다. |
| 2 도입 | 704는 30일 기산, 705는 적격 입국 질문, 706은 사유 소멸 효과다. 공식 가정 도입이나 가짜 상담 경험이 없다. |
| 3 길이·리듬 | 각 글에 매우 짧은 실제 문장이 여럿 있다. 704 `Originalai grąžinami po patikros.` / `Mokestis apskaičiuojamas pagal leistą laikotarpį.`; 705 `Pasirašytas pasiūlymas dar nesuteikia teisės dirbti.` / `O darbas po paskaitų?`; 706 `Išsaugokite jų datas.` / `Bendra riba — vieni metai.` 긴 문장 세 개가 연속하는 구간을 발견하지 못했다. |
| 4 문단 시작 | 실제 문단들을 세로로 읽었고 최다 시작어는 2/1/2회다. 세 문단이 같은 말로 시작하는 반복은 없다. |
| 5 주장·출처·예외 | ‘조문 주장→다만’ 틀을 세 번 연속 쓰지 않는다. 자료 수령·주소·비용 결과·여행 일정 등 인용 없는 문단도 있다. |
| 6 대비 | 도구 대비식 0이며, 의미 검수에서도 상상의 반론을 반복하지 않는다. 허가/면제·일시 체류/거류 구별은 필요한 법적 차이다. |
| 7 결말 | 실질적 말미는 카드 정보와 후속 신고(704), 실제 신청일과 활동 날짜(705), 예정 귀환일의 증명 유효성(706)으로 다르다. 뒤의 확인일·적용 신분 고지는 별도 법률 범위 표시이며 판촉 결말이 아니다. |
| 8 문체·강조 | LT에 KO/JA 종결형 기준을 억지 적용하지 않는다. 명령형 체크리스트 제목, 굵은 강조, 지어낸 1인칭 경력, 공개 AI·사람 저자가 없다. 선택 어휘 개선은 O1·O2에만 남긴다. |
| 9 의미·자료 | 위 F01–24 대조 및 표·FAQ 수동 확인을 했다. 날짜·금액·근거·가상 이미지 표기 보존을 지표보다 우선했다. |

243개 배열을 모두 읽었으며, 날짜 `2026 m. … d.`와 705의 인용 뒤 마침표, 706의 제23-1조 번호에서 잘못 끊기거나 다음 문장이 합쳐진 사례는 관찰하지 못했다. 출처 제목 `Oficialūs šaltiniai` 뒤 목록은 측정 본문에 들어가지 않는다. 704 문서 표·706 기한 표와 아홉 FAQ는 본문 문장 지표의 대상이 아니므로 별도로 직접 읽었다. `cite_end=0`은 인용이 없다는 뜻이 아니다. 실제 본문 인용 문단 비율은 0.35/0.476/0.52다.

## 메타·링크·인계

[구조 기록](../checks/lt-independent-structure.json)의 실제 gray-matter 검사에서 오류 0개다. 세 편 모두 `audience: [lt]`, `topic: visa`, 내부 `author: legal-ai-assistant`, 2026-10-26 발행·수정일과 LT 날짜, FAQ 3개, 원본 대표 이미지 경로, `Išgalvota scena`를 유지한다. 강조 및 숨은 방향 제어 문자를 발견하지 못했다. 본문 공식 URL 15/15/16개는 각 말미 목록에도 있다.

내부 링크 아홉 개 중 LT 상호 링크 여섯 개는 이 batch05의 세 파일로 확인했고, R에 아직 없다는 상태도 기록했다. EN 링크 세 개는 R의 실제 대상 파일과 `anglų kalba` 표시를 확인했다. 이 파일 존재 확인은 공개 HTTP 상태 확인이 아니다. 신규 상담 언어·성공 보장·사무소 경험을 추가하지 않았다.

원고는 그대로 인계한다. root의 통합 후 렌더링, 검색/추천/목록 노출, 공개 커밋과 실제 페이지 확인은 이 보고서에서 수행하지 않았다. 리투아니아어 판단은 모델 기반 대조이며 사람 원어민 교정의 확신 수준으로 확대하지 않는다.
