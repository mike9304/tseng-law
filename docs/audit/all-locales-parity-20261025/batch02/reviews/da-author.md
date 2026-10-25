# DA ARC 704–706 작성·자기 검수

작성·검수일: 2026-10-25 KST. 담당: `column_source_quality`(AI). 인간 원어민·변호사의 검토를 주장하지 않는다.

## 범위와 상태

배정받은 batch02 `src/content/columns-da/704–706` 세 편만 작성했다. 릴리즈 worktree에 새 원고를 쓰지 않았고 commit/push/deploy나 외부 전송을 하지 않았다. 이 기록도 배정된 `reviews/da-author.md`에만 저장했다.

세 편 모두 덴마크어 원고와 의미 자기 검수를 마쳤다. 공유 도구의 `da` 지원 설치 후 아래 세 파일을 실제 재검사하여 각각 exit 0 / FAIL 0을 확인했다. 설치 전 exit 2 이력은 아래에 보존했다. 미지원을 PASS로 간주하거나 영어·다른 언어 profile로 대신 측정하지 않았다. 독립 의미·문체 검수와 통합·공개 배포 검증은 작성자 검수와 별개다.

## 읽은 자료와 원문 선택

- batch02 `BRIEF.md`와 릴리즈의 `docs/audit/all-locales-parity-20261025/BRIEF.md` 전문.
- 릴리즈의 `docs/columns/EDITORIAL-VOICE.md`, `docs/columns/FRONTMATTER.md`, `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, 공유 `SENTENCE-VARIETY-RULE.md`, `LESSONS.md` 전문. 홈 editorial 파일은 없으며 저장소·공유 정본을 사용했다. 폐기된 Fable 자동 게이트는 적용하지 않았다.
- 현행 EN/KO/ZH 704–706 전문, `research/arc-source-facts.md` F01–F24 및 기존 `source-refresh.md`. 이 세션의 앞선 NL 작성·간체중문 검수 때 전체 정본을 읽었고 이번 batch02에서는 EN 세 편을 다시 전문으로 읽었다. 기준 commit 대비 세 언어 9파일의 diff가 없는 것도 확인했다.
- 직전 덴마크어 840–842 세 편 전문. 목록 정렬은 실제 `published: 2026-10-24`와 동일 날짜의 번호 역순을 확인했다.
- 첫 배치 NL 독립 검수와 간체중문 H01–H06·후속 검수에서 확인한 오류를 반영했다. 네덜란드어 문장 구조를 덴마크어에 복사하지 않았다.

URL·FAQ 보존의 비교 정본은 EN이다. KO/ZH와 F01–F24로 적용대상·예외를 교차 확인했다. EN의 최초 배우자 카드 1년 단정은 법정 `최장 1년`으로, 모호한 초과 체류 문장은 기존 허가의 자동 연장 부정으로 옮겼다. EN에 명시되지 않은 F22 APRC 예외, F23 지정 온라인 절차의 출국 효과, F24 일반 보완 기산도 공통 사실표에 따라 추가했다.

법률 확인은 공통 facts의 2026-10-25 공식 1차자료 직접 열람과 10월 24일 source-refresh의 구분을 따른다. 이번 DA 작성 중 이민법 제23조, 인재법 제16조, 거류규칙 제11조, NIA 0902 영어 원문과 현행 인재법 영어 전문을 다시 열어 해당 문구를 확인했다. 일부 단일 조문 페이지(31·17)는 재접속에 실패하여 앞서 직접 열람한 현행 전문·facts를 사용했다. 시행연혁 페이지 접근 한계는 facts에 기록된 그대로이며, 모든 링크를 이번 DA 작성에서 새로 직접 열었다거나 이후 관보를 전수 확인했다는 뜻이 아니다.

## 기준 원고 SHA-256

기준 저장소 commit: `ef3b24e73d84968eea08ea9d58e991ccbbf83fa8`.

| 언어 | 글 | SHA-256 |
|---|---|---|
| EN | 704 | `610343da1255e2e873956c6de54bd0f9c72c6731aae9343bd7bae9884efdd39f` |
| EN | 705 | `87a4ab6e9a5e8b434a30de0dc111307fc58e878a7534cef793e2a3e27be38304` |
| EN | 706 | `1ecf6acc92d181afb2820bb001d4e4d45cc4eeca823d2e32def25faebe119d71` |
| KO | 704 | `cbf6b07b2d41c3b136ceac099f8d32152ca125c18478321610ffa715c29476a1` |
| KO | 705 | `727377648fcc7e2bd1d8ea8202bea5fb69f01174ce51a0ee422891126011d54a` |
| KO | 706 | `4cd612086336cb1a3720111390ce7aca3f4eff5c7f96c5e92aea001fa7b8cfbc` |
| ZH | 704 | `0c00bc06bf3c3c1860a95af4dbcea9eaab981300860916856295e8b947244468` |
| ZH | 705 | `290a50047632ad830ea98c524ffef6ed91c2b4c8d555a1844689824c3ffea7a3` |
| ZH | 706 | `4d70e78b9a197f4a2b81d25d61b6fa862ee849a6392d5fd905e90bcf781e721c` |

현재 DA SHA-256(아래 최종 공유 검사 대상과 동일):

| 글 | SHA-256 |
|---|---|
| 704 | `c94d3cddab3ab1a3707449cf98e251392cca9d6b1d640f1603ac16f8c7deac2e` |
| 705 | `01ca9fe806e56bb377be8374e83c97ed39849f7e7d238e106991bc4026b461e9` |
| 706 | `97c908a410527c336c7387aa5f153f3fcf2ef58e871ebedbf22f7f020cb512df` |

## 법률·문장 대조

| 범위 | 보존한 명제와 DA 표현 |
|---|---|
| 704 F01–03 | 입국+거류허가 다음 날 30일, 국내 비자 발급일 30일, 통합증명 예외를 분리했다. 방문자에게 추가 30일을 주지 않는다. 직접 신청에는 적격 전문업무 허가/면제 및 NIA 승인이 필요하다. |
| 704 F06–08 | ARC 사진 2년과 비자 사진 6개월은 서로 다른 요구기간이며 같은 사진의 사용 자체를 금지하지 않는다. 재직·등록 증명 최근 1개월, 입학 전후, 현 학기 등록 또는 학생증, 초청자 신분·거류 자료를 유지했다. 해외 인증은 의무, 중국어 번역 요구는 NIA의 가능 권한이다. 대만 거주 AND 호적등록 배우자 첫 카드 `højst ét år`와 동행을 보존했다. |
| 704 F09–12 | NT$1.000/년, 미만도 연 단위, NT$2.200 가산, 僑生만 50% 감면. 일반 3년·특정 5년은 허가 다음 날·해당 가족 범위·Gold Card 1–3년과 조문 9를 보존했다. 일반 심사 10근무일과 보완 후 재기산, 학생 심사 5근무일, 승인일부터 납부 5근무일, 납부 후 칩 수령 3근무일, 전자 ARC 6개월 이하를 각각 구별했다. |
| 704 F24 | `15 kalenderdage fra dagen efter meddelelsen`; 부족·불일치 서류를 해외/중국대륙/홍콩/마카오에서 발급받아야 하는 경우 3개월, 15일+3개월 가산 아님, 기한 내 완전 보완하지 않으면 기각. 중국어 29996 공식 출처를 본문·목록에 추가했다. |
| 705 F04 | 일반 전문인재 AND 대만 전문업무, OR 외국특정전문인재를 별도 두 항목으로 나눴다. 두 경우 모두 NIA 거류 OR 영주 허가를 요구한다. 가족은 배우자·미성년·장애 때문에 자립 불가 성년 자녀이고 가족의 무비자/방문비자 조건을 유지했다. 부모·나머지 성년자녀를 포함하지 않는다. |
| 705 F05 | `et gyldigt visum, som tillader mindst 60 dages ophold`로 비자 유효기간과 체류허용기간을 혼동하지 않았다. 대만 거주 AND 호적등록, 연장불허 등의 제한, 일부 법정 초청자 제외를 보존했다. 이민법23의 특정移工 배우자 제외는 ESA46(1)(8)–(10) 예시로 한정했다. |
| 705 F13–14 | 일반 학생 무비자·도착비자·다른 목적 비자 전환 제외, 어학4개월+추가최소3개월·평일주15시간·휴가포함결석1/4를 유지했다. ARC와 직무의 취업허가를 분리했고 대만 호적 국민의 배우자 면제와 외국 전문인재 배우자 신청 경로를 구별했다. |
| 705 특수 경로 | Gold Card 기능과1–3년·제9조, 창업가, 국적별 워홀·디지털 노마드 조건 및 대만 기업/고용주 서비스 금지를 유지했다. NIA0915의 특정 시범 무비자·전자여행허가 제외는 다른 규정의 예외와 함께 옮겼다. |
| 706 F15–17 | 일반만료전3개월, 주소·근무지 변경 다음날30일, 이유변경 발생일부터30/15일 구별. 창업유지·금카드4개월과 사업종료후3개월을 분리했다. |
| 706 F18–21 | 사유 소멸 시 취소 의무와 법정 계속거류 승인 가능성을 구별. DV 이혼은 대만 거주·호적·재혼하지않음, 미성년자녀 호적·돌봄/친권/면접, 노동쟁송 진행·산재 치료 조건을 보존했다. 초과거류 `<30일`+기존사유계속+처벌후재신청, APRC계산1년공제, 기존허가자동연장아님을 유지했다. 전문6개월+1회총1년·졸업1년+1회총2년 모두 만료전 신청 및 종전만료다음날 기산. 어학종료를 졸업으로 바꾸지 않았고 신규졸업자 대만associate이상+NIA허가 중 취업면제를 한정했다. |
| 706 F22–23 | 일반재입국은 출국전 허가·ARC유효기간상한·말소연동, APRC는 유효여권+APRC 예외. 지정 전문인재·가족 온라인 처리 중 출국하면 심사 중단, 재입국후 적격일 때 재신청 가능. 모든 ARC 신청의 출국금지·재입국보장으로 확장하지 않았다. |

## 실제 수정 기록

| 원문/초안 문장 | 문제와 이유 | 수정 | 보존 의미 |
|---|---|---|---|
| EN `gives the first spouse-based card one-year validity` | 행정 안내의 통상 발급기간을 법정 확정기간으로 번역할 수 있음 | DA `Det første kort på dette grundlag må højst gælde ét år` | 대만 거주+호적 배우자, 최초, 최장1년; 규칙12 직접 인용 |
| EN `That provision leaves the original expiry date unchanged` | 새 허가도 이후 만료일을 가질 수 없다는 넓은 의미로 읽히지 않도록 범위 지정 | `Bestemmelsen forlænger ikke automatisk den gamle tilladelse.` | 기존허가 자동연장 아님; 재신청 승인 가능성 유지 |
| DA `fagfolkelovens artikel ...` | 덴마크어 독자에게 부자연스러운 축약 법률명 | `artikel ... i loven om udenlandske fagfolk` | 동일 법령·조문·URL 유지 |
| DA704 `relevant studiedokumentation ... med dokumentation for det aktuelle semester` | 실제 목록의 재학증명과 학기등록/학생증 관계를 구체화할 필요 | `en indskrivningsattest ... med semesterregistrering eller studiekort som angivet i NIA's liste` | 최근1개월과 허용 자료 대안 보존 |
| DA705 `At læse vejledningen på dansk betyder ikke, at kravene for danske statsborgere gælder for dig.` | 번역 검수의 국적 원칙을 독자에게 메타설명하고 이미 있는 국적·여권 조건 반복 | 삭제 | 국적/여권별 조건·담당 공관은 바로 앞 두 문장에 남음; 독자 국적 가정 없음 |
| DA705 `Den fælles godkendelse er en betingelse. Kravet ... skal ikke lægges oven i specialistkategorien.` | 조건 재진술과 번역자에게 하는 지시처럼 들리는 설명 | `For specialister stiller denne familiebestemmelse ikke et tilsvarende krav om aktuelt fagligt arbejde i Taiwan.` | 공통NIA거류/영주와 일반전문인재에게만 붙는 전문업무조건 유지 |
| DA705 `Den ønskede aktivitet har derfor betydning allerede ved valget af indrejseordning.` | MONOTONY: 도입의 범용 결론 — 앞의 어학/전문업무 차이를 반복 — 실제 두 경로만 남기는 방향 | 삭제, BOCA 비자 링크를 첫 문장으로 이동 | 출국전 어학비자·전문인재 허가/면제·제16조 인용 유지 |
| DA705 `For en planlagt virksomhed ... Et ønske om at starte virksomhed erstatter ikke ...` | MONOTONY: 세 번째 `For` 문단 시작과 불필요한 반박형 마무리 — 주체·실제자료로 한 문장화 | `BOCA offentliggør ... for ansøgere, der vil etablere virksomhed i Taiwan.` | 창업가 요구조건·공식URL 유지 |
| DA706 `Afsluttet sprogundervisning er ikke en akademisk grad.` | 거류규칙11의 모든 졸업 자격을 학위로 한정하는 듯한 부수 의미 위험 | `Et afsluttet mandarinkursus giver ikke i sig selv denne dimittendstatus.` | 어학종료 자동졸업 지위 부정; 제12조 취업면제의 별도학위 조건은 다음 문단 유지 |

## 최근 DA 세 편과 도입·소제목·끝맺음 대조

| 기존 글 | 실제 도입·소제목·끝맺음 | 새 ARC 세 편의 처리 |
|---|---|---|
| 842 ingeniør | `90 dages visumfrit ophold ...`; `Hvornår bliver projektbesøget til arbejde?`; `Hold den planlagte første arbejdsdag op mod ...` | 국적별90일이나 현장업무 장면을 복제하지 않았다. 704는 기산일 질문,705는 어학비자의 선행 필요,706은 실제 주소변경 의무로 시작한다. |
| 841 wind components | 가상 Esbjerg 플랜지 불일치 장면; `En repareret flange viser ikke længere udgangstilstanden`; `Bevar en prøve ...` | 가상 사례를 추가하지 않았다. 증거보전형 엔딩 대신 ARC 결정·승인기간, 새 목적의 증빙, 출입국 날짜 대조로 각각 닫는다. |
| 840 company | `Hvem skal stå som leverandør ...?`; `Den part, kunden kan rejse kravet imod`; `... mere oplysende end kontorets planlagte navn.` | 704의 질문은 실제30일 기산 문제로 내용이 다르며 세 편 모두 질문형으로 맞추지 않았다. 소제목은 문서·등록·가족·학업·여행의 각 신청 쟁점에 한정했다. |

첫 두 문단 삭제 시험:

- 704: 첫 질문은 두 기산일을 직접 제시한다. 이어지는 입국+허가·다음날·NIA의무·ARC명칭은 각각 정보가 있다. 둘째 문단은 통합증명예외, 방문자자격, 보편적30일 부정이다. 단순 예고 문장은 없다.
- 705: 초안 첫 문단의 BOCA 설명·범용 결론은 삭제·통합했다. 남은 두 문장은 어학비자 선행과 전문인재 예외를 담는다. 둘째는 국적·여권과 담당공관으로, 언어=국적 메타문장을 삭제했다.
- 706: 첫 문단은 변경 다음날30일·카드만료와 독립·다른 기관 신고로 대체불가를 담는다. 둘째는 주소 이외 사유소멸, NIA취소 의무와 예외, 날짜자료를 담아 삭제 시 구체 내용이 사라진다.

## 규칙 §5 자기 점검

1. 공유 도구 설치 전에는 da 미지원/exit2였으며, 설치 후 정확한 `--lang da`로 세 편 모두 exit0/FAIL0을 확인했다. 실제 수치는 아래에 기록했다.
2. 정형 가상 도입 없음. 704 질문 /705 사전 비자조건 /706 주소변경 의무로 세 편의 도입을 다르게 했다.
3. 짧은 의미 있는 문장 각각 최소2개: 704 `Godkendelse er nødvendig.` / `En lejekontrakt kan bruges som adressebevis.`; 705 `Nationalitet og pas har også betydning.` / `Jobtilbuddet er ikke en arbejdstilladelse.`; 706 `Kontakt straks NIA.` / `Et erstatningskort forlænger ikke opholdet.` 긴 문장의 조건을 억지로 쪼개거나 새 경고로 채우지 않았다. 지원 profile의 짧은 문장 비율도 각각 .234/.232/.268로 확인했다.
4. 본문 문단 시작을 직접 세로 읽고 단순 추출했다. 현재 같은 첫 단어는 편당 최대2회다. 705의 세 번째 `For`를 위 기록대로 고쳤다. 이 추출은 공식 다양성검사 대체가 아니다.
5. 조문→예외의 동일3단락 연속이 없다. 704 인쇄/보관,705 공관문서,706 신청시점 기록 등에 인용 없는 실무 문단이 있다. 실제 법률 주장은 근접한 공식 인용을 남겼다.
6. 수사적 `not X but Y` 대비를 반복하지 않는다. `ikke`가 있는 문장은 대부분 법적 제외·권한범위·불허 조건이며, 문체를 위해 법적 부정을 지우지 않았다. 705 창업 희망 반박은 삭제했다.
7. 마지막 실질 문단은 각각 승인기간, 신규 목적의 증빙, 카드·변경·출입국 날짜로 끝난다. 출처 날짜·적용대상 고지는 구조적 꼬리로 구별했다. 이메일은706에만1회다.
8. 표준 덴마크어의 일관된 `du` 문체. 굵은 강조·본문H1·가짜 경험·공개 작성자·가짜 인간검수 표기·명령형 체크리스트 제목 없음. 서비스 언어를 DA로 약속하지 않았다.
9. EN 정본의 공식 URL 전부 유지. F조건·기간·통화·의무·허용·예외를 표와FAQ까지 대조했다. 704/705추가 조문9, 706APRC예외 및F23를 포함했고 이미지 경로·가상 캡션·내부author를 유지했다.

## 실행한 검사

2026-10-25 설치 전, 세 편 각각:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <batch02/src/content/columns-da/각 파일> --lang da
exit 2: argument --lang: invalid choice: 'da'
supported list: ko,ja,en,zh-hant,th,id,hi,fr,de,it,es,pt,ar,vi,ru,ms,fil,tr,nl,zh-hans,sv
```

2026-10-25 도구 담당의 중립 fixture 기반 profile 설치 후, 동일 명령의 올바른 `--lang da`로 실제 재실행했다. 원고나 도구를 수치에 맞춰 바꾸지 않고 그대로 통과했다.

| 글 | 문장 수 | 평균 단어 | CV | short | run3 | opener_rep | cite_end | cite_para | contrast / caveat / q | 결과 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| 704 | 64 | 13.1 | .470 | .234 | .081 | .050 | .000 | .350 | 0 / 0 / 1 | exit 0, FAIL 0 |
| 705 | 69 | 13.6 | .472 | .232 | .045 | .130 | .000 | .478 | 0 / 0 / 1 | exit 0, FAIL 0 |
| 706 | 82 | 13.2 | .497 | .268 | .037 | .154 | .000 | .462 | 0 / 0 / 2 | exit 0, FAIL 0 |

세 CLI 모두 `OK — no variety limit violated`를 반환했다. 이는 기계적 다양성 제한 통과이며 덴마크어 사람 원어민·법률가의 승인 표기가 아니다.

실행한 공유 `variety_metrics.py` SHA-256: `0ff4f2b8d68a71fc16e1e9505c83ebcc22de0b01ad4742d0ad126bf81220f532`. `profiles/da.json`: `d97cb6ecf083d3a000d9e68c9aca35be606afcc262cf676723f9fc06ba3352df`.

Node24+저장소 gray-matter로 세 파일을 실제 파싱했다. 결과: FAQ각3개, audience `[da]`, internalauthor `legal-ai-assistant`, topic `visa`, published/lastmod `2026-10-25`, 본문H1/굵은강조0. 세 이미지 파일은 현재 릴리즈 public 폴더에 존재한다. EN 공식 URL 누락0, 본문 공식 URL의 끝목록 누락0, 끝목록만 있는 공식URL0. 내부 링크는 새DA3편 상호연결 또는 실제 EN원고 경로에 대응하고 영어 링크는 독자에게 언어를 밝혔다. 이 확인은 공개URL 배포 성공을 뜻하지 않는다.

검사 스크립트·profile을 원고에 맞춰 수정하지 않았다. 이 파일에 기록한 기계검사는 의미·자연스러움의 독립 검수를 대체하지 않는다.
