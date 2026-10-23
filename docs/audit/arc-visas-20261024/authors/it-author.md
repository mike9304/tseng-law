# Italian 704–706 author handoff

## 현재 상태 — repair1, 2026-10-24 KST

독립 검수 [it-locale-r1.md](reviews/it-locale-r1.md)의 필수 지적 IT706-R1-01을 반영했다. 706:56의 첫 문장만 수정했다. 704와 705는 독립 R1에서 검토된 해시와 동일하다. 706의 새 버전은 독립 재확인 대기이며, 저자가 수정 건의 독립 PASS를 선언하지 않는다.

현재 검사기에서 정확한 shared CLI를 다시 실행한 결과, 세 파일 모두 `[it]`, `OK — no variety limit violated`, exit 0이다. 최초 동결 때의 `[ko]` 오분류와 `KeyError: 'it'`는 그 당시 검사기 결과이며 아래 이력에 그대로 보존한다. 이번 저자는 공유 검사기를 수정하거나 언어를 영어로 가장하지 않았다. 검사 전후 공유 검사기 SHA-256은 모두 `0491ce5e3a7bd0c3ebd9bea7aa0ed04ba3ea41c6b56d2707824455eb2ccd10fb`였다.

### repair1 변경과 근거

2026-10-24에 [NIA 0902 §6(14)](https://www.immigration.gov.tw/5475/5478/141465/141808/141970)를 다시 열었다. 정규과정 졸업자 중 다른 목적으로 연장을 신청하지 않은 사람에게 ARC 반환·출국 절차를 요구하는 조건이다. 연장을 얻지 못한 사람이라는 결과 조건으로 바꾸지 않았다.

수정 전:

> Dopo il conseguimento del titolo, la NIA indica agli studenti dei corsi regolari di ottenere l’eventuale proroga per un’altra finalità ammessa, oppure restituire l’ARC e completare le formalità di partenza.

수정 후:

> Dopo il conseguimento del titolo, la NIA richiede agli studenti dei corsi regolari che non presentano domanda di proroga per un’altra finalità ammessa di restituire l’ARC e completare le formalità di partenza.

같은 문단의 후속 두 문장, 졸업 관련 FAQ, 만료 후 자동 연장이 아니라는 마지막 안내를 다시 읽고 보존했다. 신청 자체가 체류 허가 또는 자동 연장을 보장한다는 문장은 추가하지 않았다. 독립 검수의 선택적 표현 제안은 이번 1문장 수정 범위에 포함하지 않았다.

### 현재 파일 SHA-256

| 파일 | 현재 SHA-256 | 상태 |
|---|---|---|
| 704-taiwan-arc-first-application.md | `17330774d9d70dca6978c4092437214e50729afe08caab3a3889d756361d7638` | 불변 |
| 705-taiwan-visa-residence-work-study-family.md | `ee9a0a97b53fd7873597789b6ee89dd64a366549963e8a24ff28f9ca8c662a72` | 불변 |
| 706-taiwan-arc-renewal-changes-reentry.md | `d9943c77653c3dce0d30d36ef1b54b035c1bfb377b2a846b9aec66646322b217` | repair1 |

읽기 전용 Python 검증에서 수정문을 원래 문장으로 되돌렸을 때 최초 706 해시가 정확히 재현되는지 확인했다. 따라서 원고 차이는 이 한 문장뿐이다. 명령 exit 0, 실제 출력:

```text
704-taiwan-arc-first-application.md: unchanged, SHA256=17330774d9d70dca6978c4092437214e50729afe08caab3a3889d756361d7638
705-taiwan-visa-residence-work-study-family.md: unchanged, SHA256=ee9a0a97b53fd7873597789b6ee89dd64a366549963e8a24ff28f9ca8c662a72
706: exact one-sentence repair; reverse substitution reproduces frozen R1 SHA
706: graduation FAQ and both no-automatic-extension statements retained
706 SHA256=d9943c77653c3dce0d30d36ef1b54b035c1bfb377b2a846b9aec66646322b217
shared checker SHA256=0491ce5e3a7bd0c3ebd9bea7aa0ed04ba3ea41c6b56d2707824455eb2ccd10fb
```

### repair1 정확한 shared CLI 출력

```text
$ python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-it/704-taiwan-arc-first-application.md
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-it/704-taiwan-arc-first-application.md [it] sentences=49 mean=15.6 cv=0.472 short=0.245 run3=0.043 opener_rep=0.0 cite_end=0.0 cite_para=0.312 contrast=0 caveat=0 q=1
  OK — no variety limit violated
exit_code=0
```

```text
$ python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-it/705-taiwan-visa-residence-work-study-family.md
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-it/705-taiwan-visa-residence-work-study-family.md [it] sentences=54 mean=16.7 cv=0.456 short=0.204 run3=0.038 opener_rep=0.167 cite_end=0.0 cite_para=0.444 contrast=0 caveat=0 q=2
  OK — no variety limit violated
exit_code=0
```

```text
$ python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-it/706-taiwan-arc-renewal-changes-reentry.md
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-it/706-taiwan-arc-renewal-changes-reentry.md [it] sentences=58 mean=17.1 cv=0.465 short=0.172 run3=0.054 opener_rep=0.211 cite_end=0.0 cite_para=0.474 contrast=0 caveat=0 q=1
  OK — no variety limit violated
exit_code=0
```

### repair1 구조·수동 확인

이전과 동일한 읽기 전용 Node/gray-matter/Italian ICU 점검을 실행했다. exit 0, 세 파일 모두 구조 오류·미해결 내부 링크·본문 외부출처 목록 누락 0개다. 706 본문은 1,023단어, 58문장, CV 0.465, 8단어 이하 10문장(0.172)이다. 변경 문단에 32단어 이상 문장이 두 개 이상인 경우는 없으며, 새 문단 시작·질문·마무리·조문·링크 변경도 없다. 처음 두 문단과 §5의 다른 항목은 최초 동결과 동일하다. 이 보조 수치는 위 shared CLI의 실제 결과와 구별한다.

이번 수정은 원고 706과 이 저자 보고서에만 적용했다. commit/push/deploy·신청·결제·운영사이트 검증은 수행하지 않았다.

## 최초 동결 기록 — 아래는 repair1 이전 이력

아래의 706 해시 `c984bfee...`와 이탈리아어 미지원 설명은 최초 동결 시점의 기록이다. 현재 원고·현재 검사 결과는 위 repair1 부분을 기준으로 한다.


작성자: /root/author_it. 점검일: 2026-10-24 KST. 상태: 저자 초안 동결, 독립 검수 대기. 원고의 published/lastmod 값은 배치 메타데이터이며 실제 게시 증거가 아니다. 이 보고서는 독립 검수 PASS나 게시 승인이 아니다.

수정 범위는 아래 이탈리아어 원고 3개와 이 보고서뿐이다. 다른 에이전트 파일은 수정하지 않았고 commit/push/deploy하지 않았다.

## 파일·제목·SHA-256

| 원고 | 제목 | 본문 단어 수 |
|---|---|---:|
| [704](../repo/src/content/columns-it/704-taiwan-arc-first-application.md) | Primo ARC a Taiwan: domanda, documenti e ritiro | 949 |
| [705](../repo/src/content/columns-it/705-taiwan-visa-residence-work-study-family.md) | Studiare, lavorare o raggiungere la famiglia a Taiwan: quale percorso di soggiorno | 941 |
| [706](../repo/src/content/columns-it/706-taiwan-arc-renewal-changes-reentry.md) | Rinnovare l’ARC a Taiwan: studio, lavoro, nuovi dati e reingresso | 1,021 |

단어 수는 Node ICU의 Italian word segmentation으로 frontmatter와 Fonti ufficiali 이후를 제외하고, 링크 URL 대신 링크 문구를 세었다. 영어 분량으로 오인하지 않는다.

실행한 명령: `shasum -a 256 <아래 원고 3개 절대경로>`, exit 0.

```text
17330774d9d70dca6978c4092437214e50729afe08caab3a3889d756361d7638  /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-it/704-taiwan-arc-first-application.md
ee9a0a97b53fd7873597789b6ee89dd64a366549963e8a24ff28f9ca8c662a72  /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-it/705-taiwan-visa-residence-work-study-family.md
c984bfeeac71487636342fc1a675dc7d6624ab4c761516b001c30a00dcea0d11  /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-it/706-taiwan-arc-renewal-changes-reentry.md
```

## 적용 자료와 현재 근거

집필 전에 BRIEF.md, repo/AGENTS.md, docs/columns/EDITORIAL-VOICE.md 전체, COLUMN-VOICE-RULE.md, SENTENCE-VARIETY-RULE.md, LESSONS.md, tseng-law-editorial/SKILL.md와 references/review-criteria.md를 읽었다. research-arc.md, research-paths.md, research-europe.md를 읽었으며 동결 전에 최신 A03·A13–A16, 온라인 실제 포털·납부/수령, P11–P17, Europe E04와 이탈리아 비교 코퍼스를 다시 대조했다.

현재 원문은 2026-10-24에 web 도구로 직접 열어 확인했다. 페이지의 수정일과 법령 시행일을 혼동하지 않았으며, 조문 번호·조건은 현재 중국어 법령과 공식 영어 안내를 함께 대조했다.

| 범위 | 원고에 반영한 내용과 직접 확인 자료 |
|---|---|
| 첫 ARC의 두 기산점 | [移民法 22](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22)의 거류비자 입국 다음 날부터 30일, [BOCA 국내 발급 FAQ](https://www.boca.gov.tw/fp-398-723-7b71f-1.html)의 대만 내 거류비자 발급일부터 30일을 분리했다. 유효한 ARC 기능 통합증 예외와 [전문인재법 16](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16)의 직접 NIA 경로를 보존했다. |
| 서류·사진·비용·일반 처리 | [NIA 0902](https://www.immigration.gov.tw/5475/5478/141465/141808/141970), [BOCA 거류비자](https://www.boca.gov.tw/cp-165-1878-1ff5e-2.html), [수수료 규정](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080135). NIA 사진 2년과 BOCA 사진 6개월, 연 NT$1,000와 1년 미만 1년분, 직접 전환 가산 NT$2,200, 일반 10근무일과 보완기간 제외를 구별했다. |
| 실제 온라인 창구 | [학생](https://coa.immigration.gov.tw/coa-frontend/student/entry), [전문직·가족](https://coa.immigration.gov.tw/coa-frontend/foreign-white-collar), [이주노동자](https://coa.immigration.gov.tw/coa-frontend/foreign-labor) 공개 화면을 직접 읽었다. 노동자 포털의 중개·기업·시설·가정고용주 계정과 중계기술인력 제외를 확인했다. 로그인·신청·결제는 실행하지 않았다. |
| 학생 서류·수령·어학 연장 | [2026-08-28 NIA 영어 안내](https://www.immigration.gov.tw/5475/5478/141465/141808/417829/cp_news) §3–7을 직접 확인했다. 승인 후 5근무일 납부, 납부 후 3근무일에 출력 영수증으로 지정센터 IC카드 수령을 704에 넣었다. 최초 접수일부터 3일로 쓰지 않았다. 706의 어학 연장은 1회 최대 6개월·총 체류와 거류 원칙적 2년으로 한정했다. |
| 정규 유학·어학 | [BOCA 정규 유학](https://www.boca.gov.tw/cp-166-283-c4da3-2.html), [어학 방문비자](https://www.boca.gov.tw/fp-158-260-9690c-2.html), [어학 거류](https://www.boca.gov.tw/fp-166-285-041cb-2.html), [移民法 23](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=23). 정규과정과 어학, 4개월 수학+최소 3개월 추가등록, 평일 주15시간·결석 1/4 이하를 분리했다. |
| 가족과 취업 권한 | 전문인재법 16의 배우자·미성년 자녀·장애로 자립불가인 성년 자녀, 주체의 거류/영주거류 선승인 조건을 보존했다. [Employment Service Act](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=N0090001) 43·48·50·53을 확인했다. 대만 호적국민 배우자 본인의 거류 승인과 취업허가 면제, 학생 학기 중 20시간 제한을 각각 설명했다. |
| 일반 연장과 창업가 예외 | [거류규칙 9](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129)의 만료 전 3개월은 일반 ARC로 명시했다. [창업가 안내](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/348924/) 주의사항 3·6을 직접 읽어 사업 유지 4개월과 사업 소멸 후 별도 경로 3개월을 구분했다. Gold Card의 연장 창구·기간까지 일반화하지 않았다. |
| 주소·직장·사유 변화 | [移民法 31](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31)은 주소/근무장소 변경 다음 날부터 30일. [23-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=23-1)과 거류규칙 7의 사유변경은 사실 발생일부터 30일, 그 외 경로는 15일 내 BOCA 재신청 구조로 대상 조건과 함께 적었다. |
| 새 여권·분실·재입국 | [NIA Easy Pack](https://news.immigration.gov.tw/EasyPack/Detail/DDA469F4-E2D0-4A98-847C-21432DCC040E?lang=EN), [국내·해외 분실 안내](https://www.immigration.gov.tw/5385/7229/7232/368785/), [법 34 영문](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=D0080132), [e-Gate 조건](https://www.immigration.gov.tw/5385/7445/7889/7892/50764). 여권번호 변경에 공통 30일을 만들지 않았다. 분실진술서/신고서 선택 구조, 해외 온라인/대리 창구, 계정별 인증 차이와 구형 이주노동자 카드 예외를 보존했다. 사진·접수증만으로 재입국을 약속하지 않았다. |
| 이탈리아어 독자와 범위 | [BOCA 해외대표부 목록](https://www.boca.gov.tw/sp-foof-countrylp-01-2.html)을 영사 연락의 진입점으로 사용했다. 이탈리아 2022 체크리스트의 under 20, 옛 15일 자료를 현행 조건으로 쓰지 않았다. 이탈리아어=이탈리아 국적이라고 전제하지 않고 Questura 절차를 대만에 옮기지 않았다. |

## 실제 같은 언어 3편 비교

비교 대상은 로컬 파일에서 본문 첫 두 문단·소제목·마무리를 직접 읽었다. 날짜는 로컬 date_display/lastmod이며 현재 공개 배포 확인으로 주장하지 않는다.

| 실제 파일 | 표시일 / lastmod | 읽은 구조와 새 원고에서 바꾼 방향 |
|---|---|---|
| [018](../repo/src/content/columns-it/018-taiwan-semiconductor-market-entry.md) | 2026-09-17 / 2026-10-07 | “Quando le operazioni...”로 운영역할을 길게 나열하고 번호형 긴 소제목·상담 안내로 끝난다. 새 704는 30일 숫자, 705는 입학허가의 구체적 효과, 706은 유효 카드와 사유 소멸 질문으로 시작한다. 회사 구조 비교는 복제하지 않고 705에서 실제 존재하는 018로 연결했다. |
| [011](../repo/src/content/columns-it/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md) | 2026-02-04 / 2026-07-25 | “Un marchio straniero...”에 의무·주체를 쌓고 둘째 문단에 “Di seguito si spiegano...” 개요를 둔다. 새 글은 개요 예고를 빼고 제출 자료·기산점·신청자의 선택을 직접 서술했다. 긴 교육자료 면책과 사람 byline을 복제하지 않았다. |
| [016](../repo/src/content/columns-it/016-taiwan-inheritance-custody-analysis.md) | 2025-09-13 / 2026-10-11 | “Quando un membro...” 뒤 “Deve esaminarsi / Deve ... distinguersi”로 추상적 법률 구분이 이어지고 11개 번호 절을 둔다. 새 글은 4–5개 실무 구간, 짧은 문장과 실제 질문, 서류/여행의 다음 행동을 사용했다. |

이탈리아어 폴더에는 027/028/029의 실제 파일이 없으므로 Gold Card/배우자/APRC 내부 URL을 만들어 넣지 않았다. 3편은 서로 연결되며 705의 기존 링크는 018 한 편이다. 이전 별도 배치 it684–688은 이번 수정 범위가 아니다.

## 첫 두 문단 삭제 시험

문장별로 지웠을 때 사라지는 정보를 검토했고, 독자에게 내용을 더하지 않는 예고와 중복을 실제로 줄였다.

- 704: 앞부분의 일반적인 관련 글 안내를 마지막으로 옮겼다. 남긴 첫 문단은 입국 다음 날 기산점·거류비자 경로·법 22의 대상 제한을 제공한다. 둘째 문단을 지우면 국내 비자 발급일 기산점, 직접 NIA 신청과 통합증 예외가 사라지므로 유지했다.
- 705: “Chi programma un impiego o raggiunge un familiare segue altri requisiti.”를 삭제하고, 별도 “Il fondamento è...” 문장을 법 16 링크가 있는 직접 문장으로 합쳤다. 남긴 첫 문단은 입학허가와 입국방식의 관계 및 정규과정/어학의 서로 다른 비자부터 독자를 안내한다. 둘째 문단은 전문직 직접신청 예외를 먼저 알려 유학 제한을 모든 방문자에게 확대하지 않게 하고 실제 판단 자료를 명시한다.
- 706: 일반적인 달력·구분 설명을 줄여 둘째 문단을 필요한 날짜 목록 한 문장으로 만들었다. 첫 문단을 지우면 미래 만료일이 남아 있어도 사유 소멸로 취소될 수 있다는 글의 핵심 문제가 약해진다. 날짜 목록은 뒤의 서로 다른 기산점을 적용하기 전에 독자가 준비할 실제 입력값이라 유지했다.

## SENTENCE-VARIETY-RULE §5 저자 자기 점검

| 항목 | 실제 점검 결과 |
|---|---|
| 1. 정확한 shared CLI | 세 파일 모두 실행했다. 자동 판정은 [ko], short_share FAIL, exit 1이다. --lang it는 KeyError이다. 따라서 shared 검사 FAIL 0 요건은 충족했다고 선언할 수 없다. 아래 원출력 보존. |
| 2. 오프닝 유형 | 704 숫자 “Trenta giorni”; 705 입학허가와 입국방식의 사실; 706 독자 질문. 세 편의 유형이 다르며 공식 가상사례 오프너가 없다. |
| 3. 짧은 문장·긴 문장 | Italian ICU 보조 진단은 8단어 이하 문장 12/11/10개. 각 문단에 32단어 이상 문장 2개가 있는 경우 0. “L’ARC documenta la residenza.”, “Un’offerta non è un permesso.”, “Le condizioni vanno dimostrate.” 등 내용이 있는 짧은 문장을 사용했다. |
| 4. 문단/문장 시작 | 문단 시작을 세로로 읽고 Per·La 반복을 고쳤다. 보조 진단에서 동일 시작 문단 3개 이상 0, 같은 단어로 시작하는 연속 문장 쌍은 704 1회, 705 0회, 706 0회. |
| 5. 인용·유보 리듬 | 말미 괄호 조문을 연속해 붙이지 않았다. 조문을 주어로 둔 문장과 문중 링크를 섞었다. “주장(조문)→다만” 3문단 반복 없음. 704 자료의 이름/날짜 대조, 705 출발 전 자료 준비, 706 날짜 목록처럼 법률 명제를 새로 만들지 않는 실무 문단이 있다. |
| 6. 대비·반박 | 반복적인 “not X but Y”식 수사 틀을 쓰지 않았다. 비자/거류/취업허가의 다른 기능, 기간 기산점, 자동승인이 아닌 점은 법률상 필요한 범위 제한으로 남겼다. 독자가 하지 않은 연도·제도 주장을 반박하지 않았다. |
| 7. 마지막 본문 | 704는 발급된 카드의 실제 만료일 기록, 705는 과정과 예정 비자의 일치, 706은 귀환에 사용할 문서와 출국이 신청에 미치는 효과로 끝난다. 상담 판촉 결말 없음. 출처 뒤 범위 고지는 각 글에 맞게 다르게 썼다. |
| 8. 문체·형식 | 전문적인 이탈리아어로 NIA/BOCA를 설명한다. 굵은 글씨·body H1·공개 작성자·가상 체험·명령형 체크리스트 제목 없음. 이탈리아어 상담·비자 대행·승인 보장을 약속하지 않았다. |
| 9. 조건·숫자·출처 보존 | 첫 ARC 30일의 서로 다른 기산점, 일반 연장 3개월/창업가 예외, 주소 30일/사유변경 30일·15일, 수수료와 목적별 조건을 최종 연구와 대조했다. 본문 외부 링크는 전부 끝 출처 목록에도 존재한다. |

## 정확한 공유 검사 출력

```text
$ python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-it/704-taiwan-arc-first-application.md
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-it/704-taiwan-arc-first-application.md [ko] sentences=52 mean=91.9 cv=0.468 short=0.0 run3=0.06 opener_rep=0.0 cite_end=0.0 cite_para=0.235 contrast=0 caveat=0 q=1
  FAIL short_share=0.0 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
exit_code=1
```

```text
$ python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-it/705-taiwan-visa-residence-work-study-family.md
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-it/705-taiwan-visa-residence-work-study-family.md [ko] sentences=57 mean=97.6 cv=0.482 short=0.0 run3=0.073 opener_rep=0.158 cite_end=0.0 cite_para=0.421 contrast=0 caveat=0 q=2
  FAIL short_share=0.0 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
exit_code=1
```

```text
$ python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-it/706-taiwan-arc-renewal-changes-reentry.md
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-it/706-taiwan-arc-renewal-changes-reentry.md [ko] sentences=61 mean=97.2 cv=0.485 short=0.0 run3=0.034 opener_rep=0.2 cite_end=0.0 cite_para=0.4 contrast=0 caveat=0 q=1
  FAIL short_share=0.0 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
exit_code=1
```

지원 여부 재현 명령과 결과:

```text
$ python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-it/704-taiwan-arc-first-application.md --lang it
Traceback (most recent call last):
  File "/Users/son7/tseng-lanes-shared/variety/variety_metrics.py", line 211, in <module>
    for p in a.path: rc |= check(p, a.lang or guess_lang(p))
                           ~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/Users/son7/tseng-lanes-shared/variety/variety_metrics.py", line 182, in check
    m = metrics(open(path, encoding='utf-8').read(), lang)
  File "/Users/son7/tseng-lanes-shared/variety/variety_metrics.py", line 104, in metrics
    short_th = {'ko': 15, 'ja': 18, 'zh-hant': 12, 'en': 8}[lang]
               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^
KeyError: 'it'
exit_code=1
```

영어로 가장하여 재검사하지 않았고 공유 검사기·기준을 수정하지 않았다. 다음 보조 진단은 Italian ICU의 분절을 관찰하기 위한 것이며 shared 검사 통과나 독립 언어 검수로 대신하지 않는다.

## 보조 진단과 구조·링크 확인

동일한 최종 파일에서 Node `Intl.Segmenter('it')` 및 저장소 `gray-matter`를 사용하는 읽기 전용 heredoc을 실행했다. frontmatter의 필수 13필드, FAQ3개, topic=visa/audience=[it]/author=legal-ai-assistant, 두 날짜, body H1/굵은 글씨/공개 byline, 줄 끝 공백을 확인했다. 실제 이탈리아 파일명으로 내부 slug를 해석했고, 외부 본문 링크가 출처 목록에 포함되는지도 대조했다. exit 0.

| 원고 | 문장 수 | 단어 길이 CV | 8단어 이하 비율 | 비슷한 길이 3연속 비율 | 구조 오류 / 미해결 내부 링크 / 출처 목록 누락 |
|---|---:|---:|---:|---:|---|
| 704 | 49 | 0.472 | 0.245 | 0.064 | 0 / 0 / 0 |
| 705 | 54 | 0.456 | 0.204 | 0.058 | 0 / 0 / 0 |
| 706 | 58 | 0.463 | 0.172 | 0.071 | 0 / 0 / 0 |

질문 수는 URL의 물음표와 FAQ를 제외한 본문 기준 1/2/1이다. 문장 CV·short 기준은 이탈리아어에 대해 검증된 공식 통과 기준으로 주장하지 않는다.

원출력:

```jsonl
{"file":"704-taiwan-arc-first-application.md","bodyWords":949,"paragraphs":16,"sentences":49,"meanWords":15.61,"cv":0.472,"short8":12,"shortShare":0.245,"similarLengthTriples":3,"similarLengthTripleShare":0.064,"openers":["trenta","per","nel","gli","un","una","sui","chi","quale","lo","alla","secondo","la","nia","ottenuta","l’arc"],"repeatOpeners":{},"sameStartPairs":[{"i":34,"word":"la"}],"longParagraphs":[],"bodyQuestions":1,"internal":["taiwan-visa-residence-work-study-family","taiwan-arc-renewal-changes-reentry"],"unresolved":[],"sourceLinksUnlisted":[],"errors":[]}
{"file":"705-taiwan-visa-residence-work-study-family.md","bodyWords":941,"paragraphs":18,"sentences":54,"meanWords":16.74,"cv":0.456,"short8":11,"shortShare":0.204,"similarLengthTriples":3,"similarLengthTripleShare":0.058,"openers":["una","per","nel","l’esenzione","nell’assunzione","quando","i","per","è","un","si","nel","l’articolo","una","e","la","il","prima"],"repeatOpeners":{},"sameStartPairs":[],"longParagraphs":[],"bodyQuestions":2,"internal":["taiwan-semiconductor-market-entry","taiwan-arc-first-application","taiwan-arc-renewal-changes-reentry"],"unresolved":[],"sourceLinksUnlisted":[],"errors":[]}
{"file":"706-taiwan-arc-renewal-changes-reentry.md","bodyWords":1021,"paragraphs":19,"sentences":58,"meanWords":17.05,"cv":0.463,"short8":10,"shortShare":0.172,"similarLengthTriples":4,"similarLengthTripleShare":0.071,"openers":["si","per","la","oltre","il","il","entro","cambiare","prima","quando","se","dopo","l’articolo","un","in","in","l’articolo","le","se"],"repeatOpeners":{},"sameStartPairs":[],"longParagraphs":[],"bodyQuestions":1,"internal":["taiwan-visa-residence-work-study-family","taiwan-arc-first-application"],"unresolved":[],"sourceLinksUnlisted":[],"errors":[]}
```

별도로 각 파일에 `git diff --no-index --check /dev/null <원고 절대경로>`를 실행했다. 세 명령은 모두 exit 1, 출력은 비어 있었다. 새 파일과 /dev/null 사이의 차이가 있는 비교이며, 이를 exit 0 검사로 기록하지 않는다. 줄 끝 공백은 위 Node 검사를 통해 별도로 확인했다. `git status --short -- <3파일>`는 세 파일 모두 `??`로 표시했다.

## 남은 제한과 인계

- 독립된 이탈리아어 검수자와 최종 법률 검수의 판단이 남아 있다. 저자 자기 점검은 독립 검수 승인이 아니다.
- shared variety CLI는 이탈리아어를 지원하지 않는다. 원출력의 실패와 지원 한계를 그대로 인계한다.
- 실제 게시/라우팅·브라우저 렌더링·운영사이트 readback은 수행하지 않았다. 3편 내부 링크의 존재는 로컬 파일 기준으로 확인했다.
- 포털은 공개 비로그인 화면과 공식 안내만 읽었다. 실제 신청·수수료 결제·개별 신청 자격 승인은 확인하거나 대행하지 않았다.
- 사용자가 요청한 볼트 업데이트, 통합 빌드/배포 판단은 root 담당이다. 저자 소유권 때문에 외부 노트와 다른 파일을 수정하지 않았다.

