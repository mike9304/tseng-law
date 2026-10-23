# ID 704–706 저자 인계

작성·검증일: 2026-10-24. 상태: 독립 r1 검수의 필수2건을 repair1로 반영하고 저자 재검증 완료, 수정 부분의 독립 재확인 대기. `work/reviews/id-locale-r1.md`에서705는 해당 해시의 내용·언어 범위 PASS를 받았고 이번 수정에서 유지했다. 공개 게시, 포털 로그인·신청·납부를 완료했다는 뜻이 아니다. 공용 variety FAIL 0 요건은 충족하지 못했다.

소유 범위는 아래 원고 3개와 이 보고서뿐이다. 기존 칼럼·검사기·설정 파일을 수정하지 않았고 commit/push/deploy하지 않았다.

## 원고와 동결 해시

| 파일 (`repo/src/content/columns-id/`) | 본문 단어 수 | SHA-256 |
|---|---:|---|
| `704-taiwan-arc-first-application.md` | 869 | `3e48da7b40136ea4bbf8cae215e2b177610e85fcf63619008b6cc62d9a256d37` |
| `705-taiwan-visa-residence-work-study-family.md` | 918 | `4e286b873530693a78c074225e3c00b6fd0b264691a0a95a461474a26388916a` |
| `706-taiwan-arc-renewal-changes-reentry.md` | 949 | `427ef833779a1309a5a5f423fd866809f7fd3bc12b35ca24cf5e6d3646372506` |

단어 수는 frontmatter와 `## Sumber resmi` 이후를 제외하고 Markdown 링크의 표시문자만 남긴 뒤 Node `Intl.Segmenter('id', {granularity:'word'})`의 isWordLike를 센 값이다. 제목·표는 포함한다. 원고의 `published`와 `lastmod`는 모두 2026-10-24, `author: legal-ai-assistant` 내부 출처는 유지했다.

## Repair1 — 독립 r1 필수2건

`work/reviews/id-locale-r1.md`의 정확한 지적·근거·수정안을 읽고 2026-10-24에 [이민법22](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22)와 [31](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31)을 다시 열었다. 수정한 곳은704 첫 문단과 첫 FAQ 답변,706 주소변경 문단뿐이다. 705의 선택적 문체 제안은 반영하지 않았다.

| 지적 | Repair1 반영·보존 |
|---|---|
| R1-704-1 | 별도 ARC 발급 의무가 있는 사람으로30일 규칙의 대상을 한정했다. 본문과 FAQ 모두 유효한 ARC 기능 증명 보유자의 별도 신청 예외를 명시하고 Employment Gold Card를 예로 들었다. 본문은 네 기능 통합증명도 설명한다. 30일·입국 다음 날 기산·방문객에게 자동전환 권리가 없다는 경계와22조 링크를 보존했다. |
| R1-706-1 | 첫 두 문장을 “Menurut [Pasal 31], perubahan alamat atau tempat kerja wajib dilaporkan dalam 30 hari yang dihitung mulai hari setelah perubahan terjadi.”로 합쳤다. 같은 날 기산으로 읽힐 수 있는 문장을 삭제했다. FAQ의 변경 다음 날30일과 일치하며, 후반 체류사유 변경의 사실 발생일부터30일/별도15일과 구분된다. |

수정 전후를 read-only Node로 비교했다(exit0). 세 원고 모두 대상 첫 FAQ를 제외한 frontmatter 일치, 모든 URL의 순서·내용 일치, 대상 문단을 제외한 본문 SHA 일치였다. 대상 문단 밖의 금액·기간·출처에는 변경이 없다. 705 전체 SHA가 최초 동결과 동일하다. 변경된704 FAQ에는30일·다음 날·유효한 ARC 기능 증명 예외를,706 본문과 FAQ에는30일·다음 날을 직접 검사했다. 충돌 문장 `memakai tanggal perubahan tersebut sebagai titik awal`은0건이다.

```text
704 frontExceptTargetFAQ=true allURLsUnchanged=true bodyExceptTargetParagraph=true errors=[]
705 frontExceptTargetFAQ=true allURLsUnchanged=true bodyExceptTargetParagraph=true errors=[]
706 frontExceptTargetFAQ=true allURLsUnchanged=true bodyExceptTargetParagraph=true errors=[]
```

아래 CLI 출력·구조 검사·단어 수·보조 계수·원고 해시를 repair1 결과로 갱신했다. 수동 §5를 다시 읽어 짧은 문장, 문단 시작, 대비 틀, 다른 기산점·금액 보존을 확인했다. 이는 독립 재검수 통과 판정이 아니다.

## 적용 문서와 연구 동결

전문 열람: `work/BRIEF.md`, `repo/AGENTS.md`, `repo/docs/columns/EDITORIAL-VOICE.md`, `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, `/Users/son7/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md`, `/Users/son7/tseng-lanes-shared/LESSONS.md`, `/Users/son7/.codex/skills/tseng-law-editorial/SKILL.md` 및 `references/review-criteria.md`.

공유 연구와 보완 사항을 읽고, 동결 후 A03 일반 ARC/창업가 예외·수령 절차·해외 분실 항목 및 P11–P19·ID/TAC 보완을 재확인했다.

| 연구 파일 | 확인 시 SHA-256 |
|---|---|
| `work/research-arc.md` | `3bbcaf47776b133e8a7b9d637a10baefad08d7fe2b98d0a1077eb360990e5cb4` |
| `work/research-paths.md` | `9ef30ffe724fa2c7ae6439d79ddc59f8e9167d87c5d24fb395f79e69e8816f4d` |
| `work/research-asia.md` | `0923eaf0116ea5cabb72e4686455aad248b0f7ae921197983885ebbc49d52084` |

## 실제 최근 ID 3편 비교

다음 실제 파일의 본문과 frontmatter를 읽었다. 세 편 모두 published 2026-09-27, lastmod 2026-09-28이다. 공개 URL 3개의 현재 렌더링을 모두 확인했다는 주장은 하지 않는다.

| 파일 | 관찰한 전개 | 새 원고에 반영한 차이 |
|---|---|---|
| `021-taiwanese-spouse-divorce-cross-border-parenting.md` | 인도네시아 가족의 양육 지원 상황으로 시작, 국경을 넘는 양육·면접교섭 설명, 상담 결말 | 706은 고용 종료와 실제 접수 확인으로 시작. 기존 가족분쟁 설명을 반복하지 않는다. |
| `022-marrying-taiwanese-national-registration-checklist.md` | 결혼식 장소와 혼인신고의 질문으로 시작, 인도네시아 혼인서류·상담 결말 | 705는 취업·학업·가족 경로 선택에 집중. 혼인신고 상세는 이 기존 글로 연결한다. |
| `023-baby-taiwan-nationality-birth-registration.md` | 출생증명서 질문에서 국적·호적·여권을 구분, 상담 결말 | 704는 입국 다음 날과 대만 내 비자 발급일의 기산점을 먼저 제시. 장면·질문 오프닝과 판촉 결말을 복제하지 않는다. |

ID에는 기존 Gold Card/APRC 상세 글이 없어 가상의 ID 내부 링크를 만들지 않았다. 해당 경로는 확인한 공식 자료에 연결했다.

## 실무·법률 경계

- 704: 별도 ARC를 발급받아야 하는 입국 후 거류 허가자의30일은 입국 다음 날부터다(이민법22). 유효한 네 기능 통합증명 또는 ARC 기능 증명 보유자의 별도 신청 예외를 본문과 FAQ에 반영했다. 대만 내 resident visa 변경 발급자는 BOCA의 발급일부터30일 안내를 분리했다. 직접 NIA 신청은 별도 요건을 갖추어야 하므로 모든 visitor/TAC 입국자에게30일 전환 기회를 부여하지 않았다.
- 최초 서류는 일반 목록과 이주노동자·전문직·학생·가족 목적별 증빙을 구분했다. 이주노동자 온라인 계정은 고용주/지정 중개인, 학생·전문직은 해당 본인 계정 경로로 구분했다. 대만인 배우자 최초 동행·첫1년 조건은 해당 배우자 경로에 한정했다.
- 납부는 해당 온라인 노동자·학생 안내의 승인 후5근무일을 사용했다. 결제 후3근무일 수령은 이를 명시한2026 학생 안내로 범위를 한정했다. 노동자 영어 안내의 after submission 표현과 중국어0926 PDF의 영수증 후3근무일 표현을 같은 정확한 기산점이라고 단정하지 않았다. 노동자는 시스템의 지정 수령 통지를 따르도록 했다.
- 비용은 일반 연간 NT$1,000,1년 미만은1년 계산, visitor/무비자 직접 ARC 추가 NT$2,200, 僑生 할인은 해당 신분에 한정했다. 분실·손상 재발급 NT$500을 모든 의무적 데이터 변경 비용으로 확대하지 않았다.
- 705: 공장노동자·가정 간병인·전문직은 허가 분류로 판단한다. 현행 전문인재법16의 직접 NIA 및 가족 경로를 일반 이주노동자에게 확대하지 않았다. 이민법23의 취업서비스법46(1)8–10 제외를 명시했다.
- WNI라는 이유만으로 무비자 또는 TAC 적격이라고 쓰지 않았다. BOCA2026 TAC 연결 페이지와 현행 NIA 포털을 사용했다. 오래된2023 BOCA 페이지의 노동 경력·FL/X 제외를 현행 상세 조건으로 옮기지 않았다.
- 학생은 정규과정과 Mandarin을 분리했다. Mandarin4개월 완료+추가3개월 등록, 주15시간·월–금, 결석1/4 조건과 입국 목적을 보존했다. 학생 근로20시간은 방학 제외와 취업허가 요건을 함께 제시했다.
- 706: 일반 ARC 연장 신청 창을 만료 전3개월로 한정했다. 사업 유지에 따른 창업가 연장4개월은 직접 열람한 NIA348924에 연결했다. 모든 창업가 연장이4개월이라고 쓰지 않았다. Gold Card는 별도 절차로 확인하도록 했다.
- 주소/근무지 변경30일은 변경 다음 날,23-1 체류사유 변경30일은 사실 발생일부터라는 차이를 보존했다. 규칙7의 다른 경로15일은 조건부 BOCA 절차로 제시하고 보편적 유예기간처럼 쓰지 않았다.
- 근거 소멸 때 이민법31에 따른 취소와 계속 거류 예외를 구분했다. 재입국은34조, 해외 분실은 NIA2024 공고의 온라인/대리 경로와 서류 차이를 사용했다. 접수증·사진만으로 입국 가능하다는 보장은 하지 않았다.
- 실제 상담언어에 인도네시아어가 확인되지 않아 ID 상담 가능·대행·승인을 약속하는 CTA를 넣지 않았다. 읽기 언어와 국적을 분리했다.

원고의 법률 주장에는 해당 MOJ·NIA·BOCA·WDA·공식 Gold Card 원문 링크를 배치했다. 포털은 공개 안내/주소 확인 수준이며 실제 로그인·제출·납부를 수행하지 않았다. 인도네시아 TETO 학생·혼인 PDF는 연구자가403으로 확인하지 못한 범위여서 특정 서류 인증 예외를 주장하지 않았다.

## 첫 두 문단 삭제 시험

| 원고 | 실제 수정 및 보존 이유 |
|---|---|
| 704 | 추상적인 목적별 분류 도입을 없애고 입국 다음 날30일과 국내 비자 발급일부터30일을 첫 두 문단에 배치했다. Repair1은 첫 문단에 유효한 ARC 기능 증명의 별도 신청 예외도 보존했다. 두 문단을 삭제하면 서로 다른 기산점과 이 적용 범위가 사라진다. |
| 705 | 일반적인 선택 질문을 resident visa 경로와 전문직 직접 NIA 경로로 바꿨다. 둘째 문단은 WNI/TAC 현재 적격 확인을 담당한다. 두 문단 삭제 시 경로 선택의 출발점과 국적만으로는 TAC 적격이 아니라는 설명이 사라진다. |
| 706 | 추상적인 만료일 주의를 고용 종료의 ARC 영향과 WDA ID 접수 경로로 바꿨다. 두 문단 삭제 시 카드 날짜 이전에도 원인이 소멸할 수 있다는 출발점과 중개인 접수일/접수번호 확인 행동이 사라진다. |

## 문장 다양성 규칙 §5 자체 점검

| 항목 | 결과·근거 |
|---|---|
| 1. 공용 CLI FAIL0 | 미충족. 아래 원문 결과처럼 ID 미지원·ko 오판정이다. 704/705 각1FAIL,706은2FAIL. 영어로 재분류하거나 검사기를 바꾸지 않았다. |
| 2. 오프닝 | 가상 상황 공식 없음. 704는 기한,705는 경로 선택,706은 고용 종료의 결과로 시작한다. |
| 3. 짧은 문장·길이 | 각 편 최소2개 확인. 704 “Catat tanggal masuk Anda.” / “Kontrak sewa dapat menjadi bukti alamat.”;705 “Simpan salinannya sendiri.” / “Susun visa belajar sebelum berangkat.”;706 “Simpan bukti pembayaran.” / “Catat tanggal peristiwanya.” 아래 ID 보조 계수는 정식 통과 판정이 아니다. |
| 4. 문단 첫 단어 | 수직 점검 및 보조 세기에서 동일 단어3회 이상0. 706의 추가 조건 문단을 `Perpanjangan...`으로 고쳐 `Untuk` 반복을 제거했다. |
| 5. 주장→다만 | 조문→유보3문단 연속 구조 없음. 각 편에 서류 보관·다음 행동 등 인용 없는 문단을 두었다. |
| 6. 대비 틀 | `bukan/melainkan/alih-alih` 등을 실제 검색하고 맥락을 읽었다. 본문에서704의 `bukan`2회,705의 해당 틀0회,706의 `bukan`1회. 기산점·처리기간의 실질적 구별이다. FAQ 포함704도3회다. |
| 7. 결말 | 본문은 카드 확인·다음 신청 경로·여행 날짜 정리로 끝낸다. 공통 판촉 문구 없음. 출처 뒤 범위 고지는 각 글의 국적/절차 범위에 맞춰 작성했다. |
| 8. 언어·형식 | 인도네시아어 경어 `Anda` 사용. KO/JA 문체 항목은 비해당. 본문H1·굵게·가공의1인칭·명령형 체크리스트 제목 없음. |
| 9. 사실 보존 | 위 기산점·금액·분류·출처를 최종 대조했다. 단조로움 보완 때문에 법적 조건이나 근거를 삭제하지 않았다. 가상 사례를 사용하지 않았다. |

자체 점검은 저자의 주장이다. 독립 검수자의 MONOTONY 지적과 원문 법률 검토를 대체하지 않는다.

## 실제 공용 CLI 실행

각 명령을 정확히 실행했다. 아래 최종 원고의 출력과 종료코드는 exit1이다.

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-id/704-taiwan-arc-first-application.md
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-id/705-taiwan-visa-residence-work-study-family.md
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-id/706-taiwan-arc-renewal-changes-reentry.md
```

```text
704 [ko] sentences=55 mean=86.5 cv=0.476 short=0.0 run3=0.038 opener_rep=0.0 cite_end=0.0 cite_para=0.278 contrast=0 caveat=0 q=1
  FAIL short_share=0.0 (limit >= 0.08): need at least ~1 in 12 sentences that is very short

705 [ko] sentences=62 mean=96.6 cv=0.453 short=0.0 run3=0.05 opener_rep=0.1 cite_end=0.0 cite_para=0.35 contrast=0 caveat=0 q=1
  FAIL short_share=0.0 (limit >= 0.08): need at least ~1 in 12 sentences that is very short

706 [ko] sentences=66 mean=92.6 cv=0.437 short=0.0 run3=0.047 opener_rep=0.182 cite_end=0.0 cite_para=0.455 contrast=0 caveat=0 q=1
  FAIL len_cv=0.437 (limit >= 0.45): sentence-length variation (stdev/mean) too low — mix very short and long sentences
  FAIL short_share=0.0 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
```

ID를 명시한 추가 확인은 최초 동결 때 실제 실행했다. Repair1에서는 위 기본 명령3개를 재실행했으며 검사기는 변경하지 않았다.

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-id/704-taiwan-arc-first-application.md --lang id
```

```text
exit 1
File "/Users/son7/tseng-lanes-shared/variety/variety_metrics.py", line 104, in metrics
  short_th = {'ko': 15, 'ja': 18, 'zh-hant': 12, 'en': 8}[lang]
KeyError: 'id'
```

## 추가 구조 점검과 ID 보조 계수

최종3파일을 읽는 Node heredoc을 실제 실행했다(exit0). `gray-matter` 파싱 후 필수13항목·FAQ3·ID audience/visa topic·날짜·내부author·본문H1/굵게 금지·행끝 공백·공식출처/확인일·본문외부URL의출처목록포함·실재하는 ID 내부slug를 검사했다.

```text
704 structuralErrors=[] faq=3 internalLinks=3 sourceURLs=16
705 structuralErrors=[] faq=3 internalLinks=3 sourceURLs=17
706 structuralErrors=[] faq=3 internalLinks=2 sourceURLs=12
STRUCTURAL_ERRORS=0
```

같은 read-only 진단에서 표·헤딩·출처목록을 제외한 산문을 `Intl.Segmenter('id')`로 문장/단어 분할했다. 길이 단위는 단어, 짧은 문장은8단어 이하로 따로 세었다. 지원되지 않는 공용 검사기를 대체하거나 정식 문체 PASS를 주장하기 위한 도구가 아니다.

| 글 | 산문 단어 | 문장 | 평균 단어 | CV | 8단어 이하 | 문단 첫 단어3회 이상 |
|---|---:|---:|---:|---:|---:|---:|
| 704 | 708 | 52 | 13.62 | 0.457 | 9 | 0 |
| 705 | 889 | 59 | 15.07 | 0.481 | 8 | 0 |
| 706 | 918 | 64 | 14.34 | 0.457 | 14 | 0 |

```sh
# repo에서 실행. exit0, 출력 없음.
git diff --check -- src/content/columns-id/704-taiwan-arc-first-application.md src/content/columns-id/705-taiwan-visa-residence-work-study-family.md src/content/columns-id/706-taiwan-arc-renewal-changes-reentry.md
```

새 untracked 원고는 git diff만으로 내용 검증이 되지 않으므로 위 Node 검사에서 실제 파일을 직접 읽고 행끝 공백까지 별도로 검사했다. 전체 사이트 loader/build/보호 파일 해시·공개 화면 확인은 부모 통합 검증 범위이며 이 보고서가 완료를 주장하지 않는다.
