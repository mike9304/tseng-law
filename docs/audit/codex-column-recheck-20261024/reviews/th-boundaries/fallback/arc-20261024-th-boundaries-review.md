# Thai 704–706 독립 문장 경계 검토

검토일: 2026-10-24

검토자: `/root/review_th` — 태국어 편집 검토를 수행하는 AI. 원고와 후보 sentence map의 저자가 아니며, 사람 원어민 또는 변호사의 인증을 뜻하지 않는다.

## 판정 및 승인 범위

**704, 705, 706의 아래 동결 후보를 모두 APPROVED 한다.** 전체 추출 문단과 모든 sentence slice를 읽고, 실제 원고·저자 판정과 대조했다. 필요한 경계 수정은 없고, 원고나 후보 JSON을 수정하지 않았다.

- `approved_method`: `independent_review_with_author_boundary_adjudication`
- `unresolved_boundaries`: `[]` (각 원고 및 전체 검토)
- Required findings: 없음.
- 승인 대상은 아래 source SHA와 canonical paragraphs SHA로 특정한 문장 경계다. 이 보고서 자체가 점수 통과 판정 또는 최종 출판 승인은 아니다.
- root가 이 보고서와 저자 보고서를 실제 해시로 바인딩하여 approval manifest를 만들 수 있다. 검토자는 manifest나 임의의 승인 값을 생성하지 않았다.

동결 저자 판정 보고서:

`/Users/son7/tseng-arc-visas-20261024/work/th-boundaries-author.md`

SHA-256: `d43fda9aceec042c24de7350e320bf12c43588aaf718332a3c18f0c0d690f3ff`

저자 보고서를 전부 읽었고, 이 SHA가 실제 파일 바이트와 일치함을 독립 확인했다.

## 정확한 승인 대상

### 704 — APPROVED

- Source: `/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-th/704-taiwan-arc-first-application.md`
- Source SHA-256: `680b7c2e7e9d8653f15c8b0e8ec46392ca122c270a73dbd1a952eea3bb3b18f0`
- Candidate: `/Users/son7/tseng-arc-visas-20261024/work/th-boundaries-candidate/704-taiwan-arc-first-application.sentences.json`
- Candidate file SHA-256: `f466ff04c34dd46de03e21fee8455763714fdbc57570f1945f3a52011c77401a`
- Canonical `paragraphs` SHA-256: `bc5e151ffd1adda83dc31154544e42ddf411721d8e4baf050841da5119dc4ff9`
- `method`: `independent_review_with_author_boundary_adjudication`
- `unresolved_boundaries`: `[]`

### 705 — APPROVED

- Source: `/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-th/705-taiwan-visa-residence-work-study-family.md`
- Source SHA-256: `69424f50ab80a33091f3a485a154ab41b7c2c90069b148fa041a53e23e79c017`
- Candidate: `/Users/son7/tseng-arc-visas-20261024/work/th-boundaries-candidate/705-taiwan-visa-residence-work-study-family.sentences.json`
- Candidate file SHA-256: `0bb124097ddbc42b485c126b5a61f9732cceba040d642409de6195bb36596f06`
- Canonical `paragraphs` SHA-256: `247a17d20239b65b27615ddc844b7154733d84a8b4851eaa4d83fa6acf615e97`
- `method`: `independent_review_with_author_boundary_adjudication`
- `unresolved_boundaries`: `[]`

### 706 — APPROVED

- Source: `/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-th/706-taiwan-arc-renewal-changes-reentry.md`
- Source SHA-256: `7544dfe49600005b2583e27e625c13458e829a3f1e7daebb55470b4964108915`
- Candidate: `/Users/son7/tseng-arc-visas-20261024/work/th-boundaries-candidate/706-taiwan-arc-renewal-changes-reentry.sentences.json`
- Candidate file SHA-256: `690961b5ecb500c41033d2d8a5ae64091a08720a2e9a56ac25c141a648aec62b`
- Canonical `paragraphs` SHA-256: `869ef790ff3be655b2f0860e9b494fc33dadb7b723a6e92aab9184204e5d4ea3`
- `method`: `independent_review_with_author_boundary_adjudication`
- `unresolved_boundaries`: `[]`

## 검토 방법과 점수 차단

`MULTILINGUAL-METHOD.md` 전체, `variety_multilingual.py`의 `normalized`, `paragraphs_sha256`, `_bound_artifact`, `_validate_sentence_review`, `sentence_map` 검증 스키마, 그리고 `variety_metrics.py`의 `strip_fm`, `body_blocks`, `unlink` 추출 정의를 읽었다. canonical digest는 `paragraphs` 배열 전체를 `json.dumps(..., ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode('utf-8')`로 직렬화한 SHA-256이다. 이 배열에는 원문 `text`와 `sentences`가 모두 포함된다.

이번 경계 판정 전에 신설 Thai 지원의 target metrics, HARD 결과, 단어 단위 길이, CV 또는 분포를 실행하거나 열람하지 않았다. 방법 문서의 사전 정의는 읽었다. 이전 locale 검토에 남아 있는 구형 ko fallback 결과는 Thai 경계 결정의 근거로 사용하지 않았다. `check`, metric 계산, `prepare_words`, `words`, `split_sentences`, `sentence_map` 실행 및 승인 전 검증 우회도 하지 않았다.

실행한 코드는 SHA 계산과 추출/문자열 보존 확인뿐이다. Python import 전에 `sys.dont_write_bytecode = True`를 설정했다. 검토 시 도구 파일은 저자 보고서의 추출 버전과 같았다.

| 파일 | 실제 SHA-256 |
| --- | --- |
| `MULTILINGUAL-METHOD.md` | `ccc2011ea3a388cd244ea8ca0cd71bd53f9cd5cbb1c62cd34ea6f66d0ed3a26b` |
| `variety_metrics.py` | `0491ce5e3a7bd0c3ebd9bea7aa0ed04ba3ea41c6b56d2707824455eb2ccd10fb` |
| `variety_multilingual.py` | `53fe3e3dbf3f151e06e2629672ce0c57ccea9484b14433d220bfd53d4e5c35b4` |
| `profiles/th.json` | `8410261b606d60f367bb43ec9588d6b90d916abc4f877aeb2bec4587b62c4254` |

## 원문 보존 및 누락 확인

각 원고의 실제 바이트 SHA를 후보의 `source_sha256` 및 저자 보고서와 대조했다. 같은 원고에서 `strip_fm → body_blocks(body, 'th') → unlink`로 다시 추출한 문단 배열을 후보 `paragraphs[*].text` 전체와 순서까지 비교했다. 헤딩·목록·표·출처 꼬리의 제외는 기존 extractor의 범위이며, 후보가 임의로 제외한 것이 아니다. extractor에 남는 마지막 확인일/적용 범위 문단도 전부 포함되어 있다.

실행 결과는 세 후보 각각 모두 다음과 같았다.

```text
source_sha_matches = True
paragraph_text_and_order_match = True
all_normalized_joins_match = True
all_nonempty_strings = True
exact_space_join_matches_all_paragraphs = True
mismatched_paragraphs = []
schema_version = 1
locale = th
status = candidate_pending_independent_review
method = independent_review_with_author_boundary_adjudication
unresolved_boundaries = []
approval_record_present = False
```

`normalized(' '.join(sentences)) == normalized(text)`뿐 아니라 각 문단에서 `text == ' '.join(sentences)`도 직접 확인했다. 따라서 문장 순서 변경, 누락, 중복 삽입, 단어·수치·문장부호 변경 또는 결합 시 공백 변경도 없다. 위 후보 상태 및 approval_record 부재는 독립 검토 전 동결 자료의 상태로 적절하다. 실제 측정에는 root의 후속 manifest 바인딩이 필요하다.

## 문장 경계의 독립 판정

P 번호는 각 후보 JSON의 `paragraphs` 순서(1부터)다. 모든 문단의 전체 원문과 각 sentence slice를 읽었다. 단독으로 성립하는 서술·질문·명령은 문장이 될 수 있고, 태국어의 자연스러운 주어 생략도 허용했다. 조건절만 떼거나, 명사 나열을 잘라 문장으로 삼거나, 하나의 예외·인과관계를 점수를 위해 분할한 부분은 발견하지 않았다.

### 704: P1–P21 전부 검토

- P1–P5: P1의 30일 규칙과 통합 문서 소지자 예외는 각각 독립 서술이다. P2의 `ถ้า...ต้อง...`와 P4의 `หาก...BOCA กำหนด...จึงต้อง...`는 조건·결과가 붙어 있다. P3의 정의·입국 후 신청·직접 신청·구체적 예는 각각 완결된 주어/서술 구조다. P5의 날짜 차이와 기록 지시는 하나의 인과문으로 유지됐다.
- P6–P9: P6의 긴 서류 나열은 `ได้แก่`가 이끄는 한 문장의 일부라서 나뉘지 않았다. P8은 예외적 대체서류 허용과 해당 페이지의 서식/확인 지시가 각각 완결된다. P9는 첫 신청 조건, 동반 출석 및 첫 카드 유효기간을 같은 문장에 묶었다.
- P10: 질문 뒤 `ให้ตรวจทีละรายการ`는 목적어를 갖춘 독립 명령이다. 그 뒤 NIA 일반 규칙, 학생 규칙, 결제 전 확인 지시는 각기 완결된다. `และอาจเรียก...`를 독립 문장으로 자르지 않은 점도 적절하다.
- P11–P15: 대상별 신청 경로는 새 주어와 새 서술이 시작되는 곳에서 나뉜다. P12의 `ใช้ระบบนักศึกษาเพียงเพราะเคยเรียนในไต้หวันไม่ได้`는 독립 금지 서술이며, 뒤 `หาก...ให้...`는 온전한 조건문이다. P13의 목록 도입문도 주어와 서술이 완결된다. P14의 파일 제한, P15의 카드 종류별 절차와 각 기산점은 끊기지 않았다.
- P16–P21: 수수료 액수 및 예외, 유효기간 상한의 부정 설명은 해당 규칙과 붙어 있다. P18의 `ต้องเผื่อเวลาตามช่องทางจริง`는 독립 지시이고, 보완서류→재기산→수령일 보장 불가의 인과관계는 한 문장이다. P19의 새 주어 `นักศึกษาและผู้ติดตาม`가 이끄는 결론은 앞 조문 설명 뒤 별도 문장으로 자연스럽다. P20의 `เมื่อ...ให้...`와 P21의 범위/제외 설명은 내부에서 절단되지 않았다.

### 705: P1–P22 전부 검토

- P1은 저자가 따로 지목한 모호성 검토 대상이다. 질문은 독립하고, 뒤의 `สำหรับการเรียน...ส่วนการทำงาน...ตามคำแนะนำ...`는 학업/취업을 비교하고 양쪽 근거를 끝에 함께 붙인 복문으로 유지하는 것이 자연스럽다. `ส่วน` 앞에서 반드시 나눌 이유가 없다. 근거만 따로 떼어내지 않았다.
- P2–P6: 정보 항목 나열, 여권·항공권 조건, 시점, 제한과 예외의 범위가 유지된다. P5에서 `และ BOCA...`는 앞 NIA 제한과 연결된 병렬 규칙이다. 다음 `ผู้มีงานวิชาชีพ...จึงควร...`는 새 주어의 완결된 행동 지시다.
- P7: 긴 법정 대상·입국 방식·취업 허가 조건과 직접 신청 결과를 하나로 유지했다. `ต้องเข้าเงื่อนไขครบ`는 주어가 문맥상 생략된 완결 지시로서 독립 문장 판정이 가능하다. 앞 문장의 관계절 조각을 떼어낸 것이 아니다. 이 표현의 문체상 선택 여부는 동결된 내용 검토의 범위이며, 경계 승인 때문에 원고를 고치지 않는다.
- P8은 저자의 또 다른 모호성 검토 대상이다. 첫 문장은 해당 근로자의 허가·비자 확인 의무를 완결한다. 다음 `แนวทาง NIA 0926...ขณะที่ข้อยกเว้น...NIA 0915...`는 `ขณะที่`가 이끄는 비교 복문이므로 한 문장 유지에 동의한다.
- P9–P15: P9의 `จึงควร...ก่อน...`는 선행 문단을 받는 완결 지시다. P10의 서류 목록, P11의 친척 지원금 조건, P12의 입국 방식별 규칙, P13의 서류 준비 후 제출 순서, P15의 기다리는 기간에 대한 지시는 내부 의존절을 보존한다. P14는 목록을 소개하는 완결 서술이다.
- P16–P18: 60일 비자 조건과 제한, 전문직 가족의 법정 대상 목록, 배우자 취업 예외의 혼인·호적·거류 허가 조건을 각각 해당 문장 안에 보존했다. 새 주어를 가진 주의문은 독립 가능하다.
- P19–P22: Gold Card 구성 목록, 창업 경로의 관계절, 서류 예시 및 실제 허용 기간을 맞추는 지시를 잘라내지 않았다. P22 첫 문장은 확인일과 자료 용도를 연결하므로 `ค.ศ.`나 연도 뒤를 임의로 문장 경계로 삼지 않는 현재 판정에 동의한다. 이어지는 개별 심사와 별도 제도 안내는 새 서술이다.

### 706: P1–P25 전부 검토

- P1–P4: 신고 조건·기산일·예외와 법적 근거를 하나로 유지했다. P2의 일반 갱신 기간→날짜를 따로 기록하라는 인과문도 끊기지 않았다. P3에서 현재 증빙 필요성과 과거 증빙의 한계는 각각 독립된다. P4는 완결된 목록 도입 서술이다.
- P5–P9: P5의 근로자/학생 안내는 짧은 병렬 비교로 함께 두고, 졸업·고용 종료와 금지 지시를 따로 둔 판정은 자연스럽다. P7의 창업 기간, 중국어 학습 기간 및 일반화 금지는 내용 연결에 맞는다. P8의 두 접수 경로 나열과 P9의 증빙 요청 목록은 각각 내부 절단이 없다.
- P10은 저자가 지목한 모호성 검토 대상이다. `ระบบออนไลน์...ส่วนการยื่นที่ศูนย์บริการ...`는 같은 처리기간을 채널별로 비교하는 한 복문이다. 다음 `จำนวนวันนี้...จึงควรถาม...`는 그 수치의 범위와 행동 지시를 묶은 별도 인과문이다. 조건문 `หากผู้ดำเนินการ...`도 결과와 함께 있다. 현재 경계에 동의한다.
- P11–P15: 주소 증빙 준비 후 신고 순서는 연결되어 있고, P12의 근무지 변경과 고용주 변경의 대조도 `แต่เมื่อ...` 이하와 함께 유지됐다. P13 조건문, P14 질문/조문 규칙·예외·예시/확인 지시, P15 기산일 차이에서 잘린 종속절이 없다.
- P16–P18: `แล้วจึงยื่นต่อ NIA`는 앞 비자 발급 절차에 붙어 있어 순서를 훼손하지 않는다. 여권 변경 조건과 결과, 준비 지시, 잘못된 기한 적용 금지, 분실 재발급·증빙·수수료·여권 동시 분실 조건은 각각 완결된다.
- P19는 저자가 지목한 모호성 검토 대상이다. `ARC หายขณะอยู่ไทยยังมีช่องทางขอออกใหม่`는 단독으로 완결된 일반 서술이다. 뒤 `ตามประกาศ NIA...อาจยื่น...`는 출처를 서두에 둔 별도 절차 설명으로 읽히며, 주어 생략은 문맥상 명확하다. 다음 문장은 인증 방법과 확인 지시를 인과관계로 묶는다. 이 분할에 동의한다.
- P20–P22: 구형 카드 예외, 만료/분실 조건과 처리, 금지 지시, 출국 전 확인 지시는 절차별로 완결된다. P21은 APRC 예외를 원칙과 붙이고, e-Gate 사실과 자동 갱신이 아니라는 대조도 붙였다. P22의 출국/귀국일 통지→필요서류 확인 순서는 같은 문장이다.
- P23–P25: 체류기간 경과 지시, 통상 갱신 및 유예가 아니라는 설명, 여행 전 비교, 거류 사유 변경 조건, 첫 카드 안내는 모두 완결된다. 마지막 확인일은 `ค.ศ. 2026`까지 유지되고, 일반 정보 범위와 개별 상황 판단은 별도 완결 서술이다.

## 잔여 사항

미해결 문장 경계: `[]`.

제안한 후보 경계 변경: 없음. 원문 수정: 없음. shared tool 수정: 없음.

이 검토는 세 원고의 내용 PASS 동결을 보존한 채 문장 경계만 확정했다. root가 정확한 보고서/저자 보고서 해시를 사용해 승인 자료를 구성한 뒤에야 Thai 정량 측정을 실행할 수 있다. 이후 원고 바이트 또는 canonical `paragraphs`가 바뀌면 이 정확한 해시의 승인 범위를 벗어난다.
