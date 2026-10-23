# Japanese ARC / visa series — author handoff

작성·확인일: 2026-10-24. 작성자 역할: AI 일본어 편집 작성자. 상태: 독립 r1의 필수 4묶음을 반영한 repair1 완료, 변경본 독립 재검토 대기. 독립 검수 PASS나 게시 완료를 뜻하지 않는다. 렌더링·게시 판단은 orchestrator에게 넘긴다. 하단 repair1 기록이 초기 저자 점검 기록보다 우선한다.

## 소유 파일과 동결 버전

기준 디렉터리: `/Users/son7/tseng-arc-visas-20261024/repo/`.

| 파일 | 제목 | SHA-256 |
|---|---|---|
| `src/content/columns-ja/704-taiwan-arc-first-application.md` | 台湾で初めてARCを申請するには：期限・必要書類・オンライン申請先 | `a7d7a46f38c608ec075e788e0cce4de878df2dd8558d5625ca6df3fa05b3e6a5` |
| `src/content/columns-ja/705-taiwan-visa-residence-work-study-family.md` | 台湾へ就職・留学・家族帯同で渡航する前に：ビザと居留の経路を選ぶ | `ff2f858456060b73de94b5b896ab0b46cea29c471cb4feae1a750309f57350f4` |
| `src/content/columns-ja/706-taiwan-arc-renewal-changes-reentry.md` | 台湾ARCの更新・住所変更・転職と再入国：満了日以外に進む手続 | `ec69f9e71c390c842b94e59f994be07cc483f14819e7cdb87f515577819e7ac4` |

위 세 원고와 이 보고서만 작성·수정했다. 다른 원고·코드·공통 설정·검사기를 수정하지 않았다. commit, push, 배포, 외부 연락, 실제 비자 신청·로그인·결제는 하지 않았다. 원고의 `published` / `lastmod`는 배치 메타데이터 2026-10-24이며 실제 공개 상태를 증명하지 않는다.

## 적용 자료와 독자 결정

다음을 읽고 적용했다: `work/BRIEF.md`, repo `AGENTS.md`, `docs/columns/EDITORIAL-VOICE.md` 전체, `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, `/Users/son7/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md`, `LESSONS.md`, `/Users/son7/.codex/skills/tseng-law-editorial/SKILL.md` 및 `references/review-criteria.md`. 볼트 index → 웹·사업 MOC → tseng 프로젝트 노트를 읽었다. 볼트 갱신은 할당된 쓰기 범위 밖이므로 root에게 남긴다. 필수 하청·Fable 고정 게이트는 적용하지 않았다.

최종 연구 대조 버전:

- `work/research-arc.md`: `3bbcaf47776b133e8a7b9d637a10baefad08d7fe2b98d0a1077eb360990e5cb4`. A03의 창업가 4개월 / 사업 소멸 후 별도 3개월 보완까지 반영했다.
- `work/research-paths.md`: `9ef30ffe724fa2c7ae6439d79ddc59f8e9167d87c5d24fb395f79e69e8816f4d`.
- `work/research-asia.md`: `0923eaf0116ea5cabb72e4686455aad248b0f7ae921197983885ebbc49d52084`. 공통·JA·업무범위·유보사항을 다시 읽었다. 다른 언어의 시장 가설을 일본 독자의 사실로 옮기지 않았다.

704는 회사·학교 서류를 받은 본인이 기산점부터 수령까지 확인하는 글이다. 705는 일본에서 입학 허가를 받은 사람의 입국방식 질문으로 시작하고, 취업·유학·가족의 직접 NIA 신청 가능 여부를 구분한다. 706은 이사·전직·일시 귀국을 카드 만료와 분리한다. 언어만으로 일본 국적을 가정하지 않았고, 일본의 재류자격 제도를 대만 법률로 가져오지 않았다.

## 공식 출처 원장

아래 원문을 2026-10-24 웹 도구로 직접 열어 해당 명제를 확인했다. 시행일과 개정 범위는 공통 법률 연구 원장의 연혁 대조도 사용했다. 행정 페이지 갱신일은 법 시행일로 표시하지 않았다. 초안·시행 전 법안·정책 발표를 현행 권리로 사용하지 않았다.

| 근거 | 원고에서 사용한 내용·효력 구분 |
|---|---|
| [入出國及移民法 제22조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22), [제23조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=23), [제23-1조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=23-1), [제31조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31), [제34조 포함 현행 전문](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080132) | 입국 다음 날 30일, 직접 거류 분기, 사유변경, 만료·주소/근무지·사유 소멸, 출국 전 재입국허가. 제22·23·23-1·31조 해당 개정은 2023-06-28 공포 / 2024-01-01 시행. 제34조 단일 URL 열기 실패 때 현행 전문에서 직접 확인했다. |
| [外国人停留居留及永久居留辦法 전문](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129) | 제5·6조 서류, 제7조 사유발생일 30일/15일, 제9조 일반 연장 3개월, 제10·11조 대상별 연장, 제12조 대만인 배우자 첫 카드 등. 제9조 현행 개정은 2024-01-01 시행; 2025-12-30 개정 제3·10·19조는 2026-01-01 시행. |
| [入出國及移民許可證件規費收費標準 전문](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080135) | 제3조 연간 NT$1,000, 1년 미만도 1년분, 방문/무비자 경로 NT$2,200 가산, 僑生 감면의 한계; 제7조 분실·파손 NT$500. 제3조 해당 개정은 2024-03-01 시행, 기타 해당 개정 2024-01-01 시행. 주소·여권 변경 전부 NT$500이라는 초기 표현은 삭제했다. |
| [外國專業人才延攬及僱用法 제8조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=8), [제9조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=9), [제16조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | 특정전문인재 특례, 금카드 4증 통합, 전문인재·가족의 직접 거류 경로. 2025-09-24 전면 개정, 해당 조항 2026-01-01 시행. 일반 전문인재 가족의 기초가 되는 본인은 대만 내 전문업무 종사 요건까지 명시했다. 구 안내의 제12조를 현재 법률 번호로 재사용하지 않았다. |
| [就業服務法 제43조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=43), [제48조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=48), [雇主聘僱外國人許可及管理辦法 전문](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=N0090027) 제53·73조 | ARC와 근로허가 분리, 호적 있는 대만 국민의 배우자에게 거류허가가 있는 경우의 제48조 예외, 학생 근로허가 신청. 고용관리辦法은 2025-12-30 최종 개정 표시와 제73조의 시행 규정을 직접 확인했다. 연혁 단일 페이지는 도구 오류였으나 현행 제53·73조 본문 확인은 성공했다. 근로시간·일률적인 배우자 취업권을 확장하지 않았다. |
| [BOCA ARC 신청기한 FAQ](https://www.boca.gov.tw/fp-398-723-7b71f-1.html) | 2024-01-02 게시 행정 안내. 대만 내 거류비자 발급일 30일을 입국 다음 날 30일과 분리했다. |
| [BOCA 일반 거류비자](https://www.boca.gov.tw/cp-165-1878-1ff5e-2.html), [정규유학](https://www.boca.gov.tw/cp-166-283-c4da3-2.html), [중국어 학습](https://www.boca.gov.tw/fp-166-285-041cb-2.html) | 각각 2026-08-13 갱신, 2024-05-01 갱신, 2024-01-01 게시 안내. 비자 사진 6개월, 일반 학생 경로에서 입국 목적 제한, 어학 4개월 이수+3개월 이상 계속등록·주15시간·결석1/4 요건. 전문인재의 별도 NIA 직접 경로까지 막는 일반화 없음. |
| [NIA 0902](https://www.immigration.gov.tw/5475/5478/141465/141808/141970) | 2026-04-14 갱신 행정 안내. 거류비자 입국자의 첫 신청·갱신·목적증빙·주소·서류 인증·배우자 동행·10근무일(보완 등 제외)·분실 신청. 옛 조문 번호는 현행 법·시행규칙으로 교정해 사용했다. |
| [NIA 0915](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) | 2026-04-14 갱신 행정 안내. repair1에서 주의7(1)을 다시 직접 열었다. 시험적 무비자·TAC 등 입국방식 제한을 전문인재 본인/가족에게 명시하고 `別段の規定がある場合を除いて` 예외를 보존했다. 현행 제16조와 구별해 행정 안내로 인용하며 7(3)에 남은 구 제12조를 가져오지 않는다. |
| [NIA 0929 현행 영어 안내](https://www.immigration.gov.tw/5475/5478/141465/141808/417829/cp_news), [학생 포털](https://coa.immigration.gov.tw/coa-frontend/student/entry) | 2026-08-28 갱신 안내. 학생 대상·서류·신청, 승인 후 5근무일 납부, 납부 완료 3근무일 뒤 지정센터 IC카드 수령, 6개월 이하 전자ARC 인쇄, 어학 연장 최장6개월. 전체 심사기간을 3일이라고 쓰지 않았다. 로그인이나 제출을 실행하지 않았다. |
| [NIA 전문직·가족 안내](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/), [이주노동자 안내](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/181964/) | 2024-01-01 표시의 현행 신청 안내. 각각 다른 시스템의 대상·업무를 구분했다. 목록0931/파일0927 표기 차이를 법 조문처럼 쓰지 않았다. 이주노동자가 모두 학생처럼 개인계정을 만드는 절차라고 쓰지 않았다. |
| [NIA 국내·해외 만료/분실 안내](https://www.immigration.gov.tw/5385/7229/7232/368785/) | 2024-05-17 행정 공고. 해외 본인·대리인 온라인 또는 대만 내 대리인 창구, 계정별 인증 차이, 구형 이주노동자 ARC 예외. 접수증·사진·온라인 접수만으로 탑승·재입국을 보장하지 않는다. |
| [NIA 창업가 안내](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/348924/), [영어 안내](https://www.immigration.gov.tw/5475/5478/141465/141469/367189/cp_news), [금카드 갱신 안내](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/406403/) | 창업가 2025-02-17, 금카드 2026-02-10 갱신. 사업유지 연장 4개월·사업소멸 후 별도 연장 3개월·금카드 연장 4개월을 직접 확인했다. 706은 일반 ARC 3개월의 범위를 명시하고 특례 안내로 분리하며 이 별도 숫자를 일반화하지 않았다. 705는 회사 설립만으로 거류가 자동 허가되지 않는다는 경계만 설명한다. |
| [日本台湾交流協会의 일본 내 영사·증명업무 안내](https://www.koryu.or.jp/publications/tabid3892.html) | 일본의 대만 비자·인증 문의가 台北駐日経済文化代表処로 향한다는 원문을 확인했다. 공관별 서류·금액·국적별 무비자 일수를 만들어 넣지 않았다. 페이지 자체 갱신일은 확인되지 않았다. |
| [사무소 일본어 문의 페이지](https://tseng-law.com/ja/contact) | 실재 문의 페이지와 업무/언어 범위를 확인했다. 706만 대만의 고용분쟁·가족 문제와 기한이 겹칠 때 상담 범위 확인을 제안한다. 일본 변호사 자격·현지 사무소·비자 전종 대행·승인 보장·무료상담을 주장하지 않았다. 최초 연락에 여권번호·신분증 사진을 요구하지 않는다. |

## 최근 일본어 칼럼 3편과 중복 비교

세 편 모두 현재 repo에서 본문을 읽었다. `published` / `lastmod`는 모두 2026-10-22다. 각 공개 URL을 모두 독자적으로 검증했다는 주장은 하지 않는다. 비교 불가한 로컬 원고는 없었다.

| 비교 파일 | 구체적 문장·구조 증거 | 새 원고에 적용한 판단 |
|---|---|---|
| `columns-ja/650-taiwan-mixed-family-baby-surname-chinese-name-passport-home-registration.md` | 29행은 `3か月。`로 시작해 일본 출생신고·국적유보의 시계를 설명한다. 33·47행은 일본/대만 기관과 규칙을 분리한다. | 704는 입국 자격과 제출 행동, 705는 실제 입학허가 질문으로 시작한다. 706은 기간으로 시작하되 `満了前3か月以内が、一般の外国人ARCを更新する申請期間です。`라는 완결문으로 적용 범위를 밝힌다. 일본의 재류제도나 국적기한을 가져오지 않는다. |
| `columns-ja/651-taiwan-contract-penalty-clause-reduction-civil-code-252-2026-judgments.md` | 29행은 일본 제조사의 특정 대만 판결·금액으로 시작한다. 31행부터 준거법, 다음으로 실제 감액 주장을 분석한다. | 704–706에는 확인한 실제 의뢰 사건이 없으므로 사례·의뢰인·결과를 만들지 않았다. 704의 서류 표, 705의 가족관계 표, 706의 발생일 표는 각각 다른 신청 결정을 돕는다. 사례 판결형 도입을 복제하지 않는다. |
| `columns-ja/652-taiwan-hospital-death-autopsy-request-complaint-medical-mediation.md` | 29행은 일본 반송/대만 화장이라는 선택과 되돌릴 수 없는 시점을 제시한다. 33·37행은 신청인·권한자·병원 의무를 나누고, 39·45행은 문답을 섞는다. | 704는 발급·수령 단계, 705는 비자 발급기관/거류/근로허가, 706은 고용주 통보와 NIA 변경등록을 각각 분리한다. 상담 판매문구가 아니라 704 보관할 기록, 705 기관에 전달할 정보, 706 변경일과 귀환일 자료로 본문을 끝냈다. |

기존 027·028·029의 골드카드·배우자·영주권 상세를 이 시리즈에 다시 풀지 않았다. 028의 무비자 관련 표현을 새 705의 일반 규칙과 혼동할 여지가 있어 그 내부 링크는 생략했다. 기존 원고의 수정·독립 법률감사를 했다는 뜻은 아니다. 세 새 원고는 서로의 실제 파일/slug로만 각각 2개씩 연결했다. 607의 학생 근로시간 상세도 반복하지 않는다.

## 첫 두 문단 삭제 테스트

실제 파일을 삭제하지 않고 첫 두 산문 문단을 제외한 독서를 했다. 결과는 다음과 같다.

- 704: 24·26행을 빼면 첫 ARC의 입국 다음 날 30일과 대만 내 비자 발급일 30일의 구별이 사라지고 곧바로 서류 준비로 넘어간다. 이 두 문단은 글의 고유한 기산점 답변이어서 유지했다. 추상적 이주·국제화 서론은 없다.
- 705: 24·26행을 빼면 학생 무비자 전환 제한과 전문인재 직접신청 예외가 독자의 입국 결정과 연결되지 않고 기관 설명부터 시작한다. 두 경로를 대조하는 실제 질문을 유지했고, 뒤의 각 분기에서는 자격과 서류를 더한다. 다른 칼럼에서도 통할 일반 도입이 아니다.
- 706: 24·26행을 빼면 일반 3개월 갱신 구간과 카드 인쇄 만료 전에도 사유 소멸이 문제된다는 답이 사라진다. 금카드·창업가 특례 연결부터 시작하게 되므로 일반 독자의 기준점을 유지했다. 원고 말미에는 기한 자료와 귀환일을 준비하는 구체적 행동이 남는다.

## §5 직접 자기점검

1. 지정 shared CLI를 일본어 모드 그대로 실행했다. 최종 세 파일 모두 exit 0 / FAIL 0이다. 아래 원출력을 기록했다.
2. 도입 유형은 704 입국 법률기한, 705 입학허가를 받은 독자의 질문, 706 일반 갱신 기간이다. `例えば…とします`식 가상 장면이나 국적명 교체형 서두는 없다.
3. 짧은 문장이 각각 2개 이상이다. 704 `申請先は移民署です。`·`まず旅券を開きます。`, 705 `ARCだけでは決まりません。`·`アルバイトの許可は別です。`, 706 `日付だけでは判断できません。`·`翌日が起点です。` 등을 실제 문맥에서 썼다. 긴 조건문 뒤에는 행동이나 적용 범위를 짧게 놓았으며 긴 문장을 연속 나열하지 않았다.
4. 문단 첫머리를 세로로 읽고 동일 시작어의 기계적 3연속이 없음을 확인했다. 학생·가족·회사라는 주체를 필요한 곳에 다시 밝혀 목적어가 흐려지지 않게 했다.
5. `주장(조문)→다만` 세 문단 반복이 없다. 704 수령 기록, 705 회사와의 자료 공유, 706 사내 연락과 제출 확인 등 인용 없는 실무 문단이 있다. 조문명은 문두·중간·괄호에 분산했다.
6. 대비 틀은 CLI상 704=1, 705=0, 706=1이다. 그 용도는 입국기한이나 신청/허가 구분으로 한정했다.
7. 본문 마지막 문단은 각각 수령번호·납부/허가 기록, 학교·고용주에게 전달할 입국 정보, 변경일·귀환일 자료로 끝난다. 확인일·일반정보 한계는 별도의 공식 자료 절에 두었다. 광고 CTA를 세 편 말미에 복사하지 않았다.
8. です・ます체를 유지했다. 장 제목과 표의 명사구는 산문 문체 혼용으로 보지 않았다. bold 0, body H1 0, 지어낸 1인칭 0, 실제로 하지 않은 변호사/원어민 검수 표시 0. CLI의 polite-ending WARN을 없애기 위해 だ・である체로 바꾸지 않았다.
9. 다듬으면서 기산점·금액·예외·출처를 다시 대조했다. 특히 사건 발생 다음 날과 발생일, 허가와 신청, 학생 승인 후 납부와 납부 후 수령, 해외분실 계정별 인증을 보존했다. 학생 취업 허가 및 가족 sponsor 조건 보완은 법적 의미에 관한 수정으로 아래 최종 검수 항목에 명시했다.

## 초기 저자 점검 실행 기록 — repair1 이전

각 명령을 별도로 실행했다. 검사기 수정·언어 우회·기준 완화 없음.

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-ja/704-taiwan-arc-first-application.md
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-ja/704-taiwan-arc-first-application.md [ja] sentences=60 mean=37.8 cv=0.51 short=0.167 run3=0.052 opener_rep=0.05 cite_end=0.067 cite_para=0.3 contrast=1 caveat=0 q=0
  WARN 92% of sentences end in 'desu-masu' — vary endings within the register
exit_code=0

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-ja/705-taiwan-visa-residence-work-study-family.md
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-ja/705-taiwan-visa-residence-work-study-family.md [ja] sentences=57 mean=41.0 cv=0.451 short=0.158 run3=0.036 opener_rep=0.056 cite_end=0.053 cite_para=0.5 contrast=0 caveat=0 q=0
  WARN 93% of sentences end in 'desu-masu' — vary endings within the register
exit_code=0

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-ja/706-taiwan-arc-renewal-changes-reentry.md
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-ja/706-taiwan-arc-renewal-changes-reentry.md [ja] sentences=66 mean=41.2 cv=0.523 short=0.167 run3=0.031 opener_rep=0.125 cite_end=0.076 cite_para=0.542 contrast=1 caveat=0 q=0
  WARN 88% of sentences end in 'desu-masu' — vary endings within the register
exit_code=0
```

실패 이력도 남긴다: 초고 704 CV=0.393 / 706 CV=0.361로 exit1이었다. 문서 확인·수령·해외분실 설명을 구체화하고 같은 길이 문장을 정리해 통과했다. 705는 초고 CV=0.455로 통과했으나 학생 근로허가와 sponsor 조건 보완 뒤 CV=0.442로 재차 실패했다. `採用通知は許可書ではありません。`과 회사·본인의 신청 준비 문장을 자연스럽게 정리한 r1 검토 대상 버전은 CV=0.451이었다. 현재 repair1의 값은 아래 새 실행 기록을 따른다.

추가 실행:

- Python inline assertion: 필수 frontmatter 13개, FAQ 3개, 내부 author, 2026-10-24 날짜, topic/audience, body H1 0, bold 0, locale 내부 링크 각 2/2 실제 파일 존재. 세 파일 모두 exit0.
- `node --input-type=module` inline 검사에서 repo의 실제 `gray-matter`로 세 파일 YAML 파싱 성공, FAQ 타입/내용·형식·미완성 placeholder·줄끝 공백 확인 성공. 출처 절 이전의 실제 첫 두 문단과 마지막 문단을 출력하여 위 삭제 테스트 및 맺음말 점검에 사용했다. SHA-256을 `node:crypto`로 계산했고 Python `hashlib` 결과와 일치했다.
- repo에서 `git diff --check -- src/content/columns-ja/704-taiwan-arc-first-application.md src/content/columns-ja/705-taiwan-visa-residence-work-study-family.md src/content/columns-ja/706-taiwan-arc-renewal-changes-reentry.md`: exit0, 출력 없음. 새 untracked 파일은 이 명령만으로 검증되지 않으므로 위 inline 원문 공백 검사도 했다.
- 전체 42편을 읽고 결과 파일을 쓰는 `work/check-content.mjs`는 읽기만 했다. 할당 밖 검사 산출물을 덮어쓰지 않았다. 앱 테스트·빌드·렌더링·공개 URL 검증은 이 작성자 범위에서 실행하지 않았다.

## 최종 독립 검수에 넘길 항목과 한계

다음은 법적 의미를 수반하는 저자 수정이므로 단순 유창성 수정으로 취급하지 말고 최종 법률·출처 검수에서 대조한다.

1. 704:24,26 / 706:44,56–60 — 입국 다음 날 30일, 대만 내 비자 발급일 30일, 주소·근무장소 변경 다음 날 30일, 거류사유 변경 발생일 30일/15일을 각각 유지했다.
2. 704:79 — 학생의 승인 후 5영업일 납부와 납부 후 3영업일 수령을 분리했다. 모든 온라인/일반 창구에 같은 수령 방법을 적용하지 않는다.
3. 705:52,64 — 학생 근로허가 경계 추가와 제16조 제2항 sponsor의 전문업무·승인 요건 명시. 일반 전문인재 가족과 특정전문인재 가족의 조건을 뭉개지 않았는지 대조한다.
4. 706:24,30,40 — 일반 ARC의 3개월 갱신 범위, 금카드/창업가 별도 안내, 중국어학습 연장 최장6개월을 구분했다. 창업가 모두에게 4개월을 일괄 적용하지 않는다.
5. 706:74,76,78 — 새 여권의 보편적인 30일 기한을 만들지 않았다. NT$500은 분실·파손으로 좁히고 정보변경은 종류별 확인으로 수정했다. 해외 신청 경로와 귀환 증빙 확인은 별개다.

일본 발급 문서의 모든 공관별 인증 절차, 여권 변경의 보편적인 법정 기한, 일반 창구별 우편/대리 수령, 개인별 항공 탑승·입국 가능성은 이번 원고에서 확정하지 않았다. 개별 자격은 해당 기관·현재 허가로 확인하는 경계를 유지한다. 검색량·순위·문의 실적·독자 전환율은 측정하지 않았고 작성하지 않았다.

남은 다음 단계는 현재 repair1 SHA 버전 3편의 독립 재검토와 최종 법률·통합 검수다. 필요 수정이 발생하면 해당 소유 파일만 고치고 shared CLI 및 해시를 갱신한다. 볼트 기록과 공개 배포 여부는 root가 통합 상태에 맞춰 처리한다.

## Repair1 — 독립 r1 필수 4묶음 처리

수정일 2026-10-24. 입력은 `work/reviews/ja-locale-r1.md`이며 원고와 이 저자 보고서를 읽은 뒤 부분 수정했다. r1의 원고 SHA는 검수 보고서에 보존되어 있고, 이 보고서 상단 표는 현재 repair1 SHA로 갱신했다. 원고 3개와 `work/ja-author.md`만 수정했다. 검수 보고서에는 쓰지 않았다.

| 요청 | 실제 수정 | 법적 의미 |
|---|---|---|
| 704-S1 | 말미 목록에 외국전문인재법 제8조, 일본대만교류협회 문의처 안내, 실제 수령 근거인 학생0929 영어판을 추가했다. | 보존. 본문·FAQ·메타데이터는 바이트 기준으로 동일하다. |
| 705-L1 | 26행의 일반 예고문을 입국방식 제한으로 교체했다. 전문인재 본인·가족을 명시하고 시험적 무비자와 TAC 등을 예로 들며 `別段の規定がある場合を除いて`를 보존했다. 제16조 문장과 링크는 유지했다. | 실질 보완. NIA0915 주의7(1)과 현행 제16조의 관계를 최종 법률 검수자가 다시 대조해야 한다. 무조건 금지로 바꾸지 않았다. |
| 705-S1 | 말미에 고용관리辦法 제53조, 창업가0928 및 새 본문 근거0915를 추가했다. | 기존 명제 보존. 학생 취업시간·자격이나 창업가 요건을 새로 확대하지 않았다. |
| 706-S1 | 말미에 금카드 갱신, 창업가 연장, 국내·해외 만료/분실 공고, 학생0929 영어판을 추가했다. | 보존. 본문·FAQ·메타데이터는 바이트 기준으로 동일하다. |

선택 O1/O2의 반복문장은 요청 범위에 따라 수정하지 않았다. 705의 새 TAC 설명은 `所定の国籍向けのオンライン渡航認証`로 두어 독자 언어를 여권 국적으로 대체하지 않고, 국가별 적용 목록이나 무비자 일수를 새로 확정하지 않는다. 0915는 행정 안내이며 해당 페이지의 2026-04-14 갱신일을 법 시행일로 표시하지 않았다.

705:26 새 문장:

> 入国方式にも制限があります。専門人材本人や家族の直接申請について、移民署の[0915案内](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news)は、試行的なビザ免除やTAC（所定の国籍向けのオンライン渡航認証）などによる入国を、別段の規定がある場合を除いて申請対象外としています。

### Repair1 실행 증거

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-ja/704-taiwan-arc-first-application.md
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-ja/704-taiwan-arc-first-application.md [ja] sentences=60 mean=37.8 cv=0.51 short=0.167 run3=0.052 opener_rep=0.05 cite_end=0.067 cite_para=0.3 contrast=1 caveat=0 q=0
  WARN 92% of sentences end in 'desu-masu' — vary endings within the register
exit_code=0

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-ja/705-taiwan-visa-residence-work-study-family.md
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-ja/705-taiwan-visa-residence-work-study-family.md [ja] sentences=58 mean=41.4 cv=0.463 short=0.172 run3=0.036 opener_rep=0.056 cite_end=0.052 cite_para=0.5 contrast=0 caveat=0 q=0
  WARN 93% of sentences end in 'desu-masu' — vary endings within the register
exit_code=0

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-ja/706-taiwan-arc-renewal-changes-reentry.md
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-ja/706-taiwan-arc-renewal-changes-reentry.md [ja] sentences=66 mean=41.2 cv=0.523 short=0.167 run3=0.031 opener_rep=0.125 cite_end=0.076 cite_para=0.542 contrast=1 caveat=0 q=0
  WARN 88% of sentences end in 'desu-masu' — vary endings within the register
exit_code=0
```

705의 제한 설명 첫 버전은 CV=0.446으로 exit1이었다. 새 문장 안에서 `入国方式にも制限があります。`와 본인·가족에 적용되는 구체적 제한 설명으로 호흡을 나누어 최종 CV=0.463 / exit0을 확인했다. 기존 단락이나 법적 조건을 바꾸지 않았고 기준·검사기를 수정하지 않았다.

수정 전 원문을 읽기 전용 세션 저장값으로 보관한 뒤 수정본과 비교했다. 결과: 704·706의 출처 절 이전 전체가 동일하며, 705도 위 26행의 지정된 일반 예고문 교체를 제외하면 출처 절 이전 전체가 동일했다. 따라서 3편 메타데이터·FAQ, 기존 제16조 본인/가족 문장, 기존 금액·기한·나머지 링크가 보존됐음을 확인했다. 독립 검수자의 글이나 다른 파일을 비교 기준으로 덮어쓰지 않았다.

본문의 공식 법률·기관 링크와 말미 목록을 대조한 결과 각 3편의 누락 배열은 `[]`였다. 같은 법령의 전문 링크는 그 법령의 단일 조문 링크를 포괄하는 것으로 비교했다. 신청 사이트 입구와 사무소 문의는 탐색 링크로 구분했다. 보조 검사 첫 실행은 functions JavaScript 환경에 `URL` 생성자가 없어 실패했으나, URL 문자열의 법령 코드 비교로 수정해 세 편 모두 완료했다. 검사 실패를 내용 검증 성공으로 세지 않았다.

`git diff --check -- src/content/columns-ja/704-taiwan-arc-first-application.md src/content/columns-ja/705-taiwan-visa-residence-work-study-family.md src/content/columns-ja/706-taiwan-arc-renewal-changes-reentry.md`는 exit0 / 출력 없음이었다. §5의 도입·짧은 문장·문체·맺음말·사실보존을 변경 범위에서 다시 확인했다. 705의 첫 두 문단 삭제 시 새 입국방식 제한도 사라지므로 해당 문단의 실질적 기능이 추가됐다. 최근 650·651·652 비교 결과와 나머지 한계는 그대로 유지한다.

미해결: 저자 기준으로 r1 필수 4묶음은 반영됐으나 독립 재검토 PASS는 아직 없다. 검수자는 현재 SHA와 말미 누락 해소, 705:26의 본인/가족·입국방식·별도 규정 예외를 대조하면 된다. 공개 게시·실화면·전체 빌드·볼트 통합 기록은 수행하지 않았다.
