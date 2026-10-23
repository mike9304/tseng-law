# pt-PT 704–706 저자 인계

상태: 독립 보고서 `work/reviews/pt-locale-r1.md`에서 704·705 PASS, 706의 PT706-R1 보완 요청을 받았다. 706 repair1을 반영했고 변경 부분의 독립 재검수를 기다린다. 공개 게시·배포·커밋·푸시하지 않았다. `published`/`lastmod`의 2026-10-24는 원고 메타데이터이며 게시 증거가 아니다. 최초 r0 공용 검사는 pt 미지원으로 실패했지만, repair1에서 현행 공용 도구가 pt를 인식해 706은 exit 0을 반환했다. 이전 실패와 현재 출력은 아래에 구분해 보존한다. 저자 자체 판단으로 독립 PASS를 선언하지 않는다.

작업일: 2026-10-24 KST. 소유 범위는 아래 세 원고와 이 보고서뿐이다. 타 언어·코드·공용 검사기를 수정하지 않았다.

## 현재 인계 파일 — 706 repair1

기준 디렉터리: `/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-pt/`

| 파일 | 제목 | SHA-256 |
|---|---|---|
| `704-taiwan-arc-first-application.md` | Primeiro ARC em Taiwan: prazo, documentos e apresentação do pedido | `8fb040a119c50849c6fe9511d12c3c4c18165e003e9cf39104447055ba51a147` |
| `705-taiwan-visa-residence-work-study-family.md` | Trabalhar, estudar ou reunir a família em Taiwan: escolher o percurso de residência | `bb411e5b88654f5d0532256739627cb8f7d15ab96b212b3131ec1973b84e796c` |
| `706-taiwan-arc-renewal-changes-reentry.md` | ARC em Taiwan: renovação, mudança de morada ou emprego e reentrada | `b6d5666179d9695d12eac4bce8145e3acb01254ce62708d38328915b47e7f3a1` |

해시는 다음 명령으로 최종 파일에서 읽었다(exit 0).

```sh
shasum -a 256 /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-pt/704-taiwan-arc-first-application.md /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-pt/705-taiwan-visa-residence-work-study-family.md /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-pt/706-taiwan-arc-renewal-changes-reentry.md
```

## 읽은 규칙과 최종 연구

`work/BRIEF.md`, repo `AGENTS.md`, `docs/columns/EDITORIAL-VOICE.md` 전체, `~/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, `~/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md` 전체와 §5, `~/tseng-lanes-shared/LESSONS.md`, `~/.codex/skills/tseng-law-editorial/SKILL.md`, 그 `references/review-criteria.md`를 읽었다. 필수 L1 볼트 index·웹/사업 MOC·tseng-law 프로젝트 노트도 확인했다. 과거 Fable 의무 절차는 적용하지 않았다.

동결 전에 최신 `research-arc.md`, `research-paths.md`, `research-europe.md`를 다시 읽고 관련 원문과 대조했다. 최종 읽기 시점의 연구 해시:

- `research-arc.md`: `3bbcaf47776b133e8a7b9d637a10baefad08d7fe2b98d0a1077eb360990e5cb4`
- `research-paths.md`: `9ef30ffe724fa2c7ae6439d79ddc59f8e9167d87c5d24fb395f79e69e8816f4d`
- `research-europe.md`: `534c45fd0660ce3e440a50daf46fba08943ca59b26145da3bc1858169908253f`

root의 최종 A03 보완도 반영했다. 일반 ARC의 3개월 창구를 Gold Card·창업가 전체에 확대하지 않는다. 최종 원고는 Gold Card 4개월, 창업가 사업유지 연장 4개월과 사업 소멸 후 별도 연장 3개월을 짧게 구분하고 공식 안내를 연결한다.

## 현재 근거와 집필 경계

원고의 법률·행정 수치에 사용한 NIA, BOCA, MOJ 원문은 2026-10-24 직접 열었다. 전체 원장·본문의 URL이 추적 경로이며 검색 요약은 법률 근거를 대신하지 않는다.

| 원고 | 확인·반영한 핵심 |
|---|---|
| 704 | 입국 거류비자는 입국 다음 날부터 30일(移民法22), 대만 내 거류비자 전환은 발급일부터 30일(BOCA FAQ), 유효한 4증 통합 예외. 일반 0902/직접거류 0915/학생 0929/이주노동 0926을 구분. 목적별 증빙, 국외 문서 인증·번역, 신청번호·보완·납부·수령, 표준 연 NT$ 1 000·직접 거류 가산 NT$ 2 200, 일반 최대 3년과 개별심사. 10근무일과 학생 5근무일을 보완기간·보장과 구분. |
| 705 | 현행 전문인재법16조 직접 NIA 경로와 연구 원장의 2026-01-01 시행 근거, 일반 이주노동 별도. 학위/어학, 적절한 visitor visa/무비자 등 입국방식, 어학 4개월 완료+최소 3개월 추가 등록·주 15시간·결석 1/4 한도. 대만인 배우자와 전문인재 가족을 구분. 취업서비스법43·48·50의 일반허가·해당 대만인배우자 예외·학생 20시간 범위. Gold Card/창업은 짧은 별도 경로. |
| 706 | 일반 갱신 3개월과 특례를 분리. 주소/근무장소는 사실 다음 날 30일, 체류사유 변경은 해당 규정상 사실일부터 30일 또는 15일+BOCA 절차. 사유 소멸의 취소와 개별 예외, 새 여권 업데이트, 분실·훼손 NT$ 500, 해외분실 공식 신청 경로, 재입국허가와 접수증 구분. 어학 연장 6개월·총 2년 원칙, 졸업 후 연장 1년+1년과 전문인재법12조의 대만 associate degree 이상·NIA 승인 졸업후 연장기간 취업허가 면제만 설명. |

주요 마지막 교차 확인:

- 학생 수령은 [최신 2026-08-28 영어 0929](https://www.immigration.gov.tw/5475/5478/141465/141808/417829/cp_news)를 우선했다. 승인일부터 5근무일 내 납부, 전자허가 다운로드/인쇄, IC카드 결제 후 3근무일·지정센터·인쇄 영수증을 구분했다. 구형 영어 367180의 submission 기준 문장을 사용하지 않았다. 일반 센터 전체의 수령기간으로 확대하지 않았다.
- [창업가 안내 348924](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/348924/) 주의사항3·6, [Gold Card 안내 406403](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/406403/)의 별도 연장 창구를 확인했다.
- [해외 ARC 만료/분실 공고](https://www.immigration.gov.tw/5385/7229/7232/368785/)는 온라인 또는 대만 내 대리신청과 인증 차이, 구형 이주노동자 카드의 별도 절차를 확인한다. 원고는 개별 탑승/입국을 보장하지 않는다.
- [BOCA visa-exempt 목록](https://www.boca.gov.tw/cp-149-4486-7785a-2.html)에서 Portugal 90일, 해당 여권 유효기간·귀국/제3국 항공권 요건을 확인했다. 이 문장은 포르투갈 국적·적격 여권에 한정한다. 브라질이나 다른 포르투갈어권에 같은 규칙을 적용하지 않는다.
- [BOCA 관할 목록](https://www.boca.gov.tw/lp-206-2.html)을 실제 열어 국적·거주지·문서 발행국을 구별하는 진입점으로 썼다. 포르투갈 대표부 홈페이지 직접 열기는 403이었으므로 해당 공관의 개별 인증 순서를 확인했다고 하지 않는다.
- 705의 전문인재법 시행일은 직접 읽은 현행 법문과 최종 연구자의 법령 연혁 확인을 함께 사용한다. 저자의 해당 `LawHistory` 직접 열기는 실패했다는 한계를 남긴다. 원문 링크를 제거하거나 공포일을 시행일로 바꾸지 않았다.

pt-PT 표현은 `pedido`, `morada`, `registo`, `reagrupamento familiar`, `entidade empregadora`, `levantamento` 중심이다. 포르투갈 AIMA/브라질 CRNM 절차를 대만에 이식하지 않았다. 포르투갈어 상담·통번역·신청대행·승인보장 문구는 없다. 민감한 여권번호나 원본을 일반 이메일로 보내도록 요구하지 않는다.

## 기존 pt 실제 세 편 비교

비교 대상은 현재 로컬 pt 코퍼스의 실제 본문이며 공개 URL의 현재 노출을 검증한 결과는 아니다. 기존 pt001–018은 새 `published` 필드가 없는 글이 있어 `date_display`의 게시일을 읽었다. 같은 옛 게시일이 다수인 경우 `lastmod`가 가장 늦은016을 세 번째 표본으로 골랐다. 최종 유럽 연구의 표본도 일치한다.

| 실제 파일 | 날짜와 읽은 특징 | 새 원고에 적용 |
|---|---|---|
| `018-taiwan-semiconductor-market-entry.md` | 표시 게시일 2026-09-17, lastmod 2026-10-07. 본사·대만 고객 역할과 운영 요소를 긴 문장으로 열고 회사설립 질문, 번호형 절, 상담 CTA로 이어짐. | 705는 법인 구조·대금 문제를 반복하지 않고 개인의 입국·업무허가와 체류 경로를 판단. 첫 문장은 짧은 법적 결과, 끝은 다음 신청 선택. |
| `011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md` | 표시 게시일 2026-02-04, lastmod 2026-07-25. `a quem… quando… quem…` 책임 나열, `A seguir explicam-se…` 예고, 번호형 규제 절과 교육자료 고지/사람 이름. | 704는 예고문 대신 정확한 기산점에서 출발. 실제 제출 순서에만 번호 목록 사용. 기존의 이름·고지·CTA를 복사하지 않음. |
| `016-taiwan-inheritance-custody-analysis.md` | 표시 게시일 2025-09-13, lastmod 2026-10-11. 가족 사망 이후 상속·배우자재산·친권·후견을 한 문단에서 나열하고 번호형 법률 구분·체크리스트 결말. | 706은 거류근거 소멸의 효과와 문서 날짜에서 시작. 서로 다른 사건의 기산점 표로 구분하며 상속/재산·임금청구 내용으로 확대하지 않음. |

014·017처럼 파일번호가 큰 것을 더 최신 게시일이라고 추정하지 않았다. pt에 Gold Card/배우자/APRC 상세 파일이 없음을 파일목록으로 확인했으므로 존재하지 않는 pt 링크를 만들지 않았다. 세 신규 원고는 서로 두 개씩 실제 파일 링크를 갖는다. 미게시 이전 pt694–698 배치의 변제·사기·중재·소송대리·미지급 임금 주제도 새 시리즈와 분리했다.

## 첫 두 문단 삭제 시험

각 문장을 삭제했을 때 기산점·예외·선택 행동이 사라지는지 다시 읽었다.

| 원고 | 첫 문단 | 둘째 문단 |
|---|---|---|
| 704 | 입국 다음 날 30일, 법적 근거와 4증 통합 예외가 모두 필요해 유지. | visitor/waiver 입국자의 직접거류 자격 확인, 언어≠자격, 705 이동을 유지. 무비자 입국자에게 보편적 전환권을 주지 않게 함. |
| 705 | 무비자 방문과 거류/취업의 효과 차이를 바로 설명. 불필요한 도입 `O motivo da viagem tem consequências no pedido seguinte.` 삭제. | Portugal 90일의 여권·입국조건과 브라질/다른 포르투갈어권 경계 유지. 중복하는 `Esse enquadramento é relativo à nacionalidade portuguesa.` 삭제. |
| 706 | 사유 소멸의 취소 원칙과 법정 예외가 기능. 뒤의 일반론 `Uma alteração familiar ou profissional pode, por isso, exigir uma decisão antes da renovação habitual.` 삭제. | ARC·여권·허가·관계자료와 사실발생일/통지문을 대조하는 행동, 문서별 유효일 차이를 유지. |

## §5 저자 수동 점검 — 최초 r0 및 repair1 보충

1. 최초 r0의 공용 검사 명령은 세 파일 모두 pt 미지원으로 각 1 FAIL이었다. 그 출력을 보존했다. repair1에서는 현행 공용 도구의 pt 지원을 확인했으며 706 exact CLI는 exit 0이다. 어느 단계에서도 저자가 영어 relabel, 검사기 수정, 기준 완화를 하지 않았다. 새 자동 결과는 독립 내용 재검수를 대신하지 않는다.
2. 704는 신청기한, 705는 입국의 법적 효과, 706은 사유 소멸의 결과로 시작한다. 가상인물·`Suponha…` 도입이 없고 세 첫 문장의 기능을 구분했다.
3. 짧은 독립 문장 두 개 이상을 각각 확인했다. 704 `Guarde uma cópia do processo completo.`/`Confirme qual dos títulos foi autorizado.`; 705 `Peça uma cópia da decisão aplicável.`/`Depois confirme o percurso de residência.`; 706 `Acrescente qualquer notificação recebida da NIA.`/`Guarde o documento que o demonstra.`. 긴 법률 문장 사이에 짧은 문장이 있으며 의미 없는 축약은 하지 않았다.
4. 본문 설명 문단의 시작어를 세로로 읽고 반복 시작을 수정했다. 세 글 모두 같은 첫 단어 최대2, 같은 시작 3연속0. 705의 가족 문단은 pt-PT의 `reagrupamento`로 마지막 교정했다.
5. 조문 주장 뒤 상투적인 예외문을 붙이는 구조가 3회 연속하지 않는다. 서류 준비·HR 질문·날짜 대조 같은 인용 없는 행동 문단이 있다. 법률 명제의 출처를 리듬 때문에 지우지 않았다.
6. `não… mas…`/`em vez de…`식 기계적 대비를 반복하지 않는다. 허가와 ARC, 입국과 거류를 나누는 문장은 실제 신청 단계의 차이를 설명한다. 독자가 하지 않은 주장을 길게 반박하지 않는다.
7. 본문 마무리는 704의 수령정보 확인/다음 변경일, 705의 선택 경로와 첫 신청/변경, 706의 새 근거와 필요한 문서로 끝난다. 확인일·범위 고지는 출처 절에 구분했으며 기존 칼럼의 교육자료 고지나 홍보문을 복사하지 않았다.
8. pt-PT 문체로 직접 작성. body H1·굵은 글씨·지어낸 1인칭·공개 AI/변호사 저자표시가 없다. 소제목은 정보형이며 `체크리스트를 확인하세요` 유형이 아니다. 실제 접수의 번호형 5단계는 704 한 곳뿐이다.
9. 수정 후 30일의 입국 다음 날/발급일/변경 사실일, 15일, 3/4개월 적용대상, NT$ 1 000/2 200/500, 최신 학생 수령 기준, 법조문과 공식 링크를 재대조했다. 가상사례는 쓰지 않았다.

저자의 수동 판단이며 독립 검수 결과가 아니다.

## 실제 자동 검사 — 최초 r0 기록

다음은 최초 r0 동결 원고에서 실행한 정확한 필수 명령이다. 당시 세 명령 모두 exit 1이었다. repair1의 최신 706 결과는 맨 아래에 별도로 기록한다.

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-pt/704-taiwan-arc-first-application.md
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-pt/705-taiwan-visa-residence-work-study-family.md
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-pt/706-taiwan-arc-renewal-changes-reentry.md
```

```text
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-pt/704-taiwan-arc-first-application.md [ko] sentences=57 mean=86.1 cv=0.512 short=0.0 run3=0.036 opener_rep=0.1 cite_end=0.0 cite_para=0.2 contrast=0 caveat=0 q=1
  FAIL short_share=0.0 (limit >= 0.08): need at least ~1 in 12 sentences that is very short

/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-pt/705-taiwan-visa-residence-work-study-family.md [ko] sentences=54 mean=98.4 cv=0.512 short=0.0 run3=0.0 opener_rep=0.211 cite_end=0.0 cite_para=0.368 contrast=0 caveat=0 q=1
  FAIL short_share=0.0 (limit >= 0.08): need at least ~1 in 12 sentences that is very short

/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-pt/706-taiwan-arc-renewal-changes-reentry.md [ko] sentences=63 mean=89.0 cv=0.519 short=0.0 run3=0.0 opener_rep=0.19 cite_end=0.0 cite_para=0.333 contrast=0 caveat=0 q=2
  FAIL short_share=0.0 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
```

지원 여부를 확인하는 별도 명령도 실행했다(exit 1).

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-pt/704-taiwan-arc-first-application.md --lang pt
```

```text
Traceback (most recent call last):
  File "/Users/son7/tseng-lanes-shared/variety/variety_metrics.py", line 211, in <module>
    for p in a.path: rc |= check(p, a.lang or guess_lang(p))
                           ~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/Users/son7/tseng-lanes-shared/variety/variety_metrics.py", line 182, in check
    m = metrics(open(path, encoding='utf-8').read(), lang)
  File "/Users/son7/tseng-lanes-shared/variety/variety_metrics.py", line 104, in metrics
    short_th = {'ko': 15, 'ja': 18, 'zh-hant': 12, 'en': 8}[lang]
               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^
KeyError: 'pt'
```

당시 검사기 `DIRLANG`과 `guess_lang`을 읽어 pt 폴더가 매핑되지 않아 ko로 폴백함을 확인했다. 위 역사적 FAIL은 숨기거나 PASS로 변환하지 않았다. 현재 도구의 지원 상태와 해시는 repair1 절을 따른다.

### 보조 진단과 구조 확인

읽기 전용 Node here-document로 repo의 `gray-matter`와 `Intl.Segmenter('pt-PT')`를 사용했다. 파일/공용 검사기는 쓰지 않았다. 아래는 포르투갈어 문장 리듬을 수동 점검하기 위한 진단값일 뿐 공용 variety PASS 대체물이 아니다. 제목·표·목록·출처를 제외한 설명 문단을 진단하고 링크는 앵커 텍스트로 읽었다. 단어 수는 별도로 표/목록 포함 본문 전체, 출처 제외다. 704·705는 불변인 r0, 706은 repair1에서 다시 읽은 값이다.

| 원고 | 본문 단어 | 문장 | 평균 단어 | CV | 8단어 이하 문장 | 동일 문단 시작어 최대 | 같은 시작 3연속 |
|---|---:|---:|---:|---:|---:|---:|---:|
| 704 | 1037 | 55 | 16.436 | 0.502 | 7 | 2 | 0 |
| 705 | 1003 | 51 | 19.000 | 0.494 | 7 | 2 | 0 |
| 706 | 1149 | 61 | 17.262 | 0.481 | 9 | 2 | 0 |

최종 읽기 전용 구조 검사: 필수 metadata, 날짜, topic, audience, 내부 author, FAQ3개, body H1 없음, bold 없음, public AI byline 없음, 행말 공백 없음, 내부 링크 실제 파일, 본문 외부출처가 출처목록에도 있음의 12항목을 검사했다. 최종 출력(exit 0):

```text
704-taiwan-arc-first-application.md: checks=12, failed=[]
705-taiwan-visa-residence-work-study-family.md: checks=12, failed=[]
706-taiwan-arc-renewal-changes-reentry.md: checks=12, failed=[]
STRUCTURE_FAILURES=0
705 diagnostic only: sentences=51, meanWords=19.000, cv=0.494, short8=7, openers=entrar,para,o,no,esta,a,para,quem,um,é,durante,no,depois,também,profissionais,quem,reúna,o
```

다음 명령은 exit 0, 출력 없음이었다. 파일이 untracked라 이 명령만으로 공백 검증을 주장하지 않는다. 위 별도 원문 검사가 실제 공백 확인이다.

```sh
git diff --check -- src/content/columns-pt/704-taiwan-arc-first-application.md src/content/columns-pt/705-taiwan-visa-residence-work-study-family.md src/content/columns-pt/706-taiwan-arc-renewal-changes-reentry.md
```

`git status --short -- src/content/columns-pt`는 세 새 파일만 `??`로 표시했다. 기존 pt 원고는 수정하지 않았다.

## 남은 제한

- 최초 r0의 pt 미지원 실패는 역사적 기록이다. 현행 도구의 706 repair1 검사는 아래와 같이 exit 0이며, 706 변경 부분의 독립 재검수는 아직 대기한다. 이 보고서는 저자가 자기 원고에 부여한 PASS가 아니다.
- 실제 신청 로그인·제출·납부·카드수령을 수행하지 않았다. 공식 절차 확인과 실제 신청완료를 구분한다.
- 포르투갈 대표부의 개별 문서 인증 순서, 공통 여권번호 변경 법정기한, 해외분실자의 개별 항공사 탑승/입국 결과는 확정하지 않았다.
- 현재 공개 pt 목록/개별 URL과 신규 내부 링크의 배포 후 라우팅은 이 저자 작업에서 검증하지 않았다. 현재 비교 증거는 로컬 본문이다.
- 내부 author만 남겼다. 공개 UI의 AI 라벨/작성자 노출 여부는 콘텐츠 파일 검사를 넘어서는 통합 검증 사항이다.
- 메모리 `MEMORY.md:550–557`은 내부 provenance·현재 corpus 확인 방향에만 사용했다. 현행 법률 사실은 위 직접 확인과 동결 연구로 작성했다. 연계 rollout IDs: `01a0fd9e-4fb7-7710-a095-b3a75eae5929`, `01a10169-8632-72c2-aea0-63c905035c9f`.

## Repair1 — PT706-R1, 2026-10-24

독립 보고서 `work/reviews/pt-locale-r1.md` 전체를 읽고, 706:42의 졸업 후 연장 대상이 바로 앞 Mandarin 문단과 혼동되는 문제 하나만 수정했다. 정규 학업 졸업자의 경로로 좁히는 법적 범위 명료화이며 단순 문체 교정으로 처리하지 않는다. 704·705 원고는 수정하지 않았다.

기존 문단 첫 두 문장을 아래 세 문장으로 교체했다. 이어지는 한 차례 추가 연장·최대 총 2년과 대만 associate degree 이상/NIA 승인 졸업후 연장기간의 취업허가 예외 문장은 그대로 보존했다.

> Quem conclui um programa de ensino formal em Taiwan pode pedir, antes de a residência expirar, a prorrogação prevista no [artigo 11.º do regulamento](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129). A simples conclusão de um curso de mandarim não dá acesso a esta via. Se o pedido for aprovado, a residência é prorrogada por um ano a contar do dia seguinte ao termo anterior.

근거를 다시 직접 열었다: [거류규칙11조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080129&flno=11)는 졸업 후, 만료 전 신청, 승인 후 기존 만료 다음 날부터 1년, 필요시 1회 추가·총 2년을 규정한다. [NIA0902](https://www.immigration.gov.tw/5475/5478/141465/141808/141970) §6(10)(b), (11), (14)는 정규 학업 졸업과 비정규 수료를 구분하고 Mandarin center 학생을 해당 비정규 수료 경로에서 제외한다. 원고의 기존 NIA0902/규칙 전체 링크를 보존하고 새 문장에 규칙11조 앵커를 달았다.

읽기 전용 Python 검증은 다음을 확인했다(exit 0).

```text
704-taiwan-arc-first-application.md: UNCHANGED 8fb040a119c50849c6fe9511d12c3c4c18165e003e9cf39104447055ba51a147
705-taiwan-visa-residence-work-study-family.md: UNCHANGED bb411e5b88654f5d0532256739627cb8f7d15ab96b212b3131ec1973b84e796c
706: ONLY_APPROVED_THREE_SENTENCE_REPLACEMENT=true
706: REQUIRED_GRADUATION_AND_WORK_CONDITIONS=7/7
706 SHA256=b6d5666179d9695d12eac4bce8145e3acb01254ce62708d38328915b47e7f3a1
```

`ONLY_APPROVED_THREE_SENTENCE_REPLACEMENT`는 메모리상의 비교가 아니다. 현재 706 문자열에서 새 세 문장만 옛 두 문장으로 되돌려 SHA-256을 계산했고 기존 동결 해시 `9e40d5778fa669a9b42033fa54591907e5a985d05499a58363658c079107e94b`와 일치했다. 7개 조건은 정규교육·Mandarin 단순수료 제외·만료 전·1년 다음 날 기산·총2년·대만 associate degree 이상·NIA 승인 졸업후 연장이다.

요청된 정확한 공용 명령을 언어 override 없이 실행했다.

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-pt/706-taiwan-arc-renewal-changes-reentry.md
```

```text
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-pt/706-taiwan-arc-renewal-changes-reentry.md [pt] sentences=61 mean=17.3 cv=0.481 short=0.148 run3=0.034 opener_rep=0.15 cite_end=0.0 cite_para=0.45 contrast=0 caveat=0 q=2
  OK — no variety limit violated
exit: 0
```

이번 호출은 실제로 `[pt]`를 인식했다. 현행 `variety_metrics.py`가 `variety_multilingual`의 언어를 `DIRLANG`에 더하는 코드와 `profiles/pt.json`, `MULTILINGUAL-METHOD.md`를 읽어 변경된 지원 상태를 확인했다. 저자는 공용 도구·프로필·기준을 수정하지 않았다. 방법 문서는 정서법상 단어 수와 휴리스틱이라는 한계를 명시하므로 이 결과를 인간 원어민 검수나 법률 정확성의 증명으로 확대하지 않는다. 실행 당시 파일 해시:

- `variety_metrics.py`: `0491ce5e3a7bd0c3ebd9bea7aa0ed04ba3ea41c6b56d2707824455eb2ccd10fb`
- `variety_multilingual.py`: `53fe3e3dbf3f151e06e2629672ce0c57ccea9484b14433d220bfd53d4e5c35b4`
- `profiles/pt.json`: `f963d707450b0eb85408e8ca916e11f02d858545eac3b316baa2f4934ed293b9`

본문 구조 12항목도 변경된 706에서 다시 검사했다(exit 0).

```text
706-taiwan-arc-renewal-changes-reentry.md: checks=12, failed=[]
```

§5의 영향 범위는 해당 문단과 이웃 문단을 다시 읽었다. 새 문단은 `Quem`으로 시작해 동일 시작어 최대2와 같은 시작3연속0을 유지한다. 첫 두 문단·마무리·FAQ는 변경하지 않았다. 의미 없는 짧은 문장 추가 없이 정규학업과 어학의 경계를 명시했으며 모든 법적 기간·조건·출처를 보존했다. 현재 요청은 완료했고 새 해시에 대한 독립 재판정을 root에 넘긴다.
