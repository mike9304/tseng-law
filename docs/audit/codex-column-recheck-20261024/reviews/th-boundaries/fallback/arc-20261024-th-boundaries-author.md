# Thai sentence-boundary author adjudication — 704–706

작성일: 2026-10-24 KST. 작성자: 원고 저자 `author_th`.
상태: **문장 경계 후보 동결 — 독립 경계 검토 대기.**

이번 작업은 원고를 수정하는 작업이 아니다. 동결된 Thai 704–706을 그대로 읽고 측정 입력용 문장 경계 후보만 만들었다. 새 Thai 지표, HARD 검사, 단어 수·문장 길이·CV·짧은 문장 비율을 실행하거나 보지 않았다. 기존 `work/th-author.md`에 남아 있는 과거 한국어 오분류 출력은 이번 경계 선택 근거로 사용하지 않았다.

소유·작성 파일은 이 보고서와 `work/th-boundaries-candidate/*.json`뿐이다. 원고, 공유 도구, 다른 작성자·검토자의 파일, 기존 저자 보고서는 수정하지 않았다. 후보는 AI 저자 판정이며 인간 모국어 편집자나 변호사의 검수라고 표시하지 않는다.

## 읽은 방법과 적용한 구조

`/Users/son7/tseng-lanes-shared/variety/MULTILINGUAL-METHOD.md` 전체와 `variety_multilingual.py`의 Thai map 검증 스키마를 읽었다. 실제 추출 함수는 같은 디렉터리의 `variety_metrics.py`에서 읽었다.

원문을 다음 순서로 추출했다.

```python
_, body = strip_fm(source_bytes.decode("utf-8"))
paragraphs, _, _ = body_blocks(body, "th")
texts = [unlink(paragraph) for paragraph in paragraphs]
```

원문 문단의 순서와 `unlink` 결과를 그대로 `paragraphs[].text`에 넣었다. 제목·목록·표·공식 출처 꼬리는 추출 함수의 기존 범위에 따라 제외했으며, 따로 편집하거나 재삽입하지 않았다. 반대로 추출 결과에 남은 마지막 확인일·범위 문단은 포함했다. `ค.ศ.`의 점이나 NT$ 금액, 조문 번호는 문장 경계로 사용하지 않았다.

후보 공통 필드:

```json
{
  "schema_version": 1,
  "locale": "th",
  "status": "candidate_pending_independent_review",
  "source_file": "absolute source path",
  "source_sha256": "entire source file bytes SHA-256",
  "method": "independent_review_with_author_boundary_adjudication",
  "unresolved_boundaries": [],
  "paragraphs": [
    {"text": "exact unlink paragraph", "sentences": ["source slices"]}
  ]
}
```

`method`는 요청된 후속 검토 절차 이름이며 독립 승인 완료를 뜻하지 않는다. 아직 `approval_record`를 만들거나 추가하지 않았다. 독립 검토자와 root가 승인 manifest 및 검토 증거의 경로·해시를 연결해야 최종 도구용 map이 된다.

## 후보 파일과 결합 해시

### 704

- 후보: `/Users/son7/tseng-arc-visas-20261024/work/th-boundaries-candidate/704-taiwan-arc-first-application.sentences.json`
- 원문 SHA-256: `680b7c2e7e9d8653f15c8b0e8ec46392ca122c270a73dbd1a952eea3bb3b18f0`
- 후보 파일 SHA-256: `f466ff04c34dd46de03e21fee8455763714fdbc57570f1945f3a52011c77401a`
- canonical paragraphs-array SHA-256: `bc5e151ffd1adda83dc31154544e42ddf411721d8e4baf050841da5119dc4ff9`
- 원문 추출 문단: 21개, 원래 순서 모두 포함.

### 705

- 후보: `/Users/son7/tseng-arc-visas-20261024/work/th-boundaries-candidate/705-taiwan-visa-residence-work-study-family.sentences.json`
- 원문 SHA-256: `69424f50ab80a33091f3a485a154ab41b7c2c90069b148fa041a53e23e79c017`
- 후보 파일 SHA-256: `0bb124097ddbc42b485c126b5a61f9732cceba040d642409de6195bb36596f06`
- canonical paragraphs-array SHA-256: `247a17d20239b65b27615ddc844b7154733d84a8b4851eaa4d83fa6acf615e97`
- 원문 추출 문단: 22개, 원래 순서 모두 포함.

### 706

- 후보: `/Users/son7/tseng-arc-visas-20261024/work/th-boundaries-candidate/706-taiwan-arc-renewal-changes-reentry.sentences.json`
- 원문 SHA-256: `7544dfe49600005b2583e27e625c13458e829a3f1e7daebb55470b4964108915`
- 후보 파일 SHA-256: `690961b5ecb500c41033d2d8a5ae64091a08720a2e9a56ac25c141a648aec62b`
- canonical paragraphs-array SHA-256: `869ef790ff3be655b2f0860e9b494fc33dadb7b723a6e92aab9184204e5d4ea3`
- 원문 추출 문단: 25개, 원래 순서 모두 포함.

원고 SHA는 원래 저자 동결본과 일치한다. 후보는 원문 파일 전체 바이트 해시에 결합됐으므로 원고에 한 글자라도 변경되면 새 source SHA와 경계 재검토가 필요하다.

## 저자가 적용한 경계 기준

문단을 직접 읽고 독립된 진술·질문·지시가 새로 시작되는 곳을 골랐다. 자동 Thai sentence detector나 모든 공백을 자르는 방식은 사용하지 않았다. 선택한 시작 문자열을 코드로 찾아 원문 부분 문자열을 복사했을 뿐, 분할 위치는 저자가 지정했다.

- 주어·화제가 바뀌면서 새 주장이나 행동이 완결되면 새 문장으로 구분했다.
- 조건절과 그 결론, 관계절과 수식 대상, 예외와 해당 원칙, 한 서류 목록 및 같은 절 안의 시간·금액은 갈라놓지 않았다.
- `จึง`가 같은 인과 구조의 결론인 경우 앞 이유와 묶었다. `จึง`라는 단어가 있다는 이유만으로 일괄 결합하지는 않았다. 예를 들어 새 주어가 있는 `จดหมายเสนองานอย่างเดียวจึง...`는 별도 진술이다.
- `ส่วน`, `ขณะที่`, `แต่`는 기계적 경계가 아니다. 각각 독립 절인지, 앞 절과 한 비교를 이루는지, 공통 인용의 범위가 어디인지에 따라 판정했다.
- 문장부호를 새로 쓰지 않았다. 띄어쓰기·법조문·기한·출처의 링크 표시문구를 고치지 않았다.
- 확인일 문구는 원문에 남은 완결 진술 또는 같은 문장의 일부로 처리했다. 출처 제목 뒤 내용은 되살리지 않았다.

## 여러 해석이 가능한 경계와 저자의 판정 이유

아래 P 번호는 각 JSON의 `paragraphs` 배열을 1부터 센 번호다. 선택이 가능했던 지점은 원래 Thai 무문장부호 산문의 성격에서 생긴 것이다. 아래에서 저자의 선택을 확정했으므로 후보의 `unresolved_boundaries`는 빈 배열이다. 이는 독립 검토자의 동의를 미리 선언한 것이 아니다. 검토자가 다른 자연스러운 해석을 제시하면 판정 근거와 후보를 함께 다시 동결해야 한다.

| 위치 | 경계가 애매한 이유 | 저자 판정 |
|---|---|---|
| 704 P1 | 법조문 표시가 앞 30일 규칙과 뒤 통합증 예외 사이에 있고 물리적 마침표가 없음 | `ผู้มีเอกสารที่รวมหน้าที่ของ ARC` 앞에서 구분. 첫 문장에 기산점과22조를 묶고, 두 번째는 독립적인 통합증 소지자 예외로 읽음 |
| 704 P2 | `โดยแนวทาง NIA 0915`가 별도 설명으로도 읽힘 | 분리하지 않음. `กำหนดข้างต้น...`의 제한을 뒷받침하는 같은 설명문으로 유지. 조건부 첫 행동 `ถ้าเข้ามา...`만 먼저 완결 |
| 704 P3–4 | Resident Visa 신청과 직접 NIA 신청이 `ส่วน`로 대비됨 | P3에서는 정의, 비자 입국자 행동, 직접 신청자 행동, 구체 예를 각각 완결문으로 구분. P4는 BOCA 발급일부터30일과 `จึงต้องแยก...`를 묶고 직접 NIA 경로의 독립 설명을 분리 |
| 704 P5·P8 | 사실 뒤 `จึงควร...`가 새로운 지시로도 읽힘 | 날짜 불일치→기록 필요, 번역 양식 존재→해당 목록 확인이라는 같은 인과문으로 유지. P5의 `หากยังไม่รู้...`와 P8의 `หน้าเดียวกัน...`은 각각 새 문장 |
| 704 P6 | 긴 서류 나열의 여러 공백을 분할점으로 오인할 수 있음 | 한 주어·서술어와 그 목적어 목록이므로 전체를 한 문장으로 유지 |
| 704 P9 | `เมื่อยื่นขอ ARC...`에서 동행과 카드기간 두 결론이 이어짐 | 조건절, 배우자 동행, 최초1년, NIA0902 근거를 한 문장으로 유지. 외국인 배우자 경로는 다음 문장 |
| 704 P10 | 질문 뒤 짧은 지시, 두 행정 안내와 번역 전 행동이 공백으로 이어짐 | 질문, `ให้ตรวจทีละรายการ`, NIA0902 규칙, 학생 안내, 번역비 지출 전 확인을 각각 완결된 발화로 구분. 짧다는 이유로 앞 질문에 합치지 않음 |
| 704 P11·P15 | 각 유형의 온라인/수령 경로가 `ส่วน`와 새 주어로 이어짐 | 신청자·문서종류가 바뀌는 독립 절에서 구분. 각 종류의 요건·시점은 그 문장 안에 함께 유지 |
| 704 P18 | 10일·5일 안내 뒤 일반 일정 지시와 보완 결과가 이어짐 | 일반10일, 온라인5일, 실제 경로의 여유시간 지시, 보완→시작일 재계산과 비보장 결론을 구분. 마지막 인과 부분은 쪼개지 않음 |
| 705 P1 | 학업과 취업의 대비 뒤 BOCA/16조 공통 인용이 붙음 | 첫 질문만 분리. `สำหรับการเรียน...`부터 학업·취업 대비와 공통 인용을 한 문장으로 유지해 그 인용 범위를 흐리지 않음 |
| 705 P5 | NIA 예외와 BOCA 제한이 `และ`로 이어짐 | 두 기관의 제한을 하나의 병렬 설명문으로 유지. 이어지는 전문직 본인의 확인 행동, 다른 국적 경험을 대입하지 말라는 지시는 각각 별도 문장 |
| 705 P7 | 긴 자격조건 뒤 `ต้องเข้าเงื่อนไขครบ`가 보충 강조로도 읽힘 | 모든 자격·허가 조건과 직접 신청 결과는 한 문장. 다음 짧은 문장은 독립된 완결 강조. 마지막 법적 용어의 범위 설명도 별도 문장 |
| 705 P8 | `ขณะที่` 뒤 가족의 자격 구분이 독립 화제로 읽힐 수 있음 | NIA0926 노동자 경로 설명과 NIA0915 가족 비교는 하나의 연결된 비교문으로 유지. 앞의 노동자 허가·비자 확인 문장은 별도 |
| 705 P10–13 | 서류 나열·인증 조건·조건부 직접 신청·전환 제한이 섞여 있음 | 한 서류 목록은 나누지 않음. 조건과 결론도 함께 둠. 신청 대상이나 행동이 바뀌는 `ชุดเอกสาร...`, `หากใช้เงิน...`, `ส่วนการเข้า...`, `BOCA ระบุว่า...`에서 새 문장으로 구분 |
| 705 P16–18 | 가족의 자격과 취업 예외에서 `แต่` 또는 `และ`가 여러 조건을 잇고 있음 | 23조의 대상·제한,16조 가족 목록,48조 혼인·호적·승인거류 조건을 각각 해당 문장 안에 유지. 조건을 숫자 앞이나 접속사만 보고 잘라내지 않음 |
| 705 P22 | 확인일과 용도 설명이 이어지며 `ค.ศ.`가 마침표를 포함 | 확인일과 `ใช้ประกอบ...`를 같은 정보 설명문으로 유지. 비자/거류 개별 심사, 별도 신분 체계는 새 문장. 약어 점은 무시 |
| 706 P2 | 3개월 규칙 뒤 `จึงควรเก็บ...`가 행동 권고로 전환됨 | 일반 기한과 사건 날짜 분리 필요를 같은 인과문으로 유지. `แต่ละวัน...`의 추가 설명만 별도 문장 |
| 706 P5 | 노동자/학생 안내의 짧은 비교 뒤 자격상실자의 행동과 금지 지시가 이어짐 | 두 안내 위치는 하나의 병렬문. `ผู้เรียนจบ...`는 대상·행동이 바뀌는 새 문장, `ไม่ควรยื่นเสมือน...`는 독립된 완결 지시로 구분 |
| 706 P7 | 창업가와 어학 경로의 기간 뒤 일반화 금지 결론이 이어짐 | 첫 짧은 원칙, 창업가4개월, 어학6개월과 `จึงไม่ควรสมมติ...`를 구분. 마지막은 어학 갱신을 계기로 도출하는 같은 인과문 |
| 706 P10 | 온라인5일과 창구10일을 `ส่วน`로 이음 | 같은 처리기간을 직접 비교하는 한 문장으로 유지. 두 기간 모두를 가리키는 `จำนวนวันนี้...`는 다음 문장이며 `จึงควรถาม...`와 묶음 |
| 706 P12 | `แต่เมื่อเปลี่ยนนายจ้าง...`가 예외적 행동을 추가함 | 주소/근무지 신고와 고용주 변경 시 노동허가 확인을 하나의 대비문으로 유지. 43조 일반 금지와 ARC정보 변경의 한계는 각 새 진술 |
| 706 P14 | 질문 뒤 취소 규정, 예외, 예시가 긴 목록을 이룸 | 질문은 독립. 31조 원칙과 예외·예시는 한 문장. `ต้องตรวจข้อเท็จจริง...`의 개별 확인 지시를 별도 문장으로 구분 |
| 706 P16–18 | 절차 순서·서류·기한 오해 방지가 공백으로 이어짐 | `แล้วจึงยื่นต่อ NIA`는 앞 조건부 절차와 유지. 새 주어/서술어가 시작하는 신청자 확인, 금지 지시, 준비서류, 분실 수수료, 여권도 잃은 조건부 행동을 각각 완결문으로 구분 |
| 706 P19 | `ตามประกาศ NIA...`가 앞 “해외에서도 경로가 있다”의 근거로 붙을 수 있음 | 첫 일반 사실을 완결문으로 두고, 공고가 열거하는 실제 온라인/대리 경로는 새 설명문. 인증 방식→사전 확인은 하나의 인과문 |
| 706 P20–21 | 구형 카드/단수허가의 예외와 e-Gate 설명에 조건·금지·확인 행동이 함께 있음 | 구형 카드 일반 사실, 만료/분실 조건부 절차, 일반 온라인 대입 금지, NIA/공관 확인 행동은 각 완결문. 34조 원칙/영주 예외와 e-Gate표시/자동연장 부정은 각각 같은 문장에 유지 |
| 706 P22·P24–25 | `แล้ว`, `หาก`, `ส่วน` 및 날짜가 문장의 범위를 바꿀 수 있음 | P22의 출입국일 통지→필요문서 확인은 같은 행동 순서. P24는 사전 서류 비교, 사유변경 조건부 제출, 첫 카드 안내를 독립문으로 구분. P25 확인일·안내 범위·개별 판단은 세 완결 진술 |

저자가 아직 선택하지 못해 남겨 둔 경계는 없다. 독립 검토에는 특히 705 P1/P8,706 P10/P19의 결합·분리 판단을 우선 확인해 달라고 인계한다. 비교 접속사를 항상 같은 방식으로 처리하지 않은 것은 위의 의미 범위 차이 때문이다.

## 원문 보존 검증

실행한 검증은 지표 검사가 아니다. Python에서 위 세 추출 함수와 `normalized`, `paragraphs_sha256`만 호출했다. Thai word segmentation, `metrics`, `check`, `sentence_map` 승인 판정 함수는 호출하지 않았다. `sys.dont_write_bytecode=True`를 설정해 공유 도구 디렉터리에 import bytecode를 쓰지 않았다.

확인 내용:
1. 각 후보의 source_sha256이 현재 원고 전체 바이트 SHA와 동일.
2. 후보의 paragraphs[].text 배열이 새로 추출한 unlink 문단 전체와 같은 순서로 정확히 동일.
3. 모든 문장 조각이 비어 있지 않음.
4. 모든 문단에서 `normalized(" ".join(sentences)) == normalized(text)`.
5. 후보에 독립 승인 완료를 뜻하는 approval_record가 없음.
6. 원문 출처 표기·조건·날짜·금액을 재작성하지 않음.

검증 종료코드: 0. 실제 출력:

```json
[
  {
    "candidate": "/Users/son7/tseng-arc-visas-20261024/work/th-boundaries-candidate/704-taiwan-arc-first-application.sentences.json",
    "candidate_sha256": "f466ff04c34dd46de03e21fee8455763714fdbc57570f1945f3a52011c77401a",
    "source_sha256": "680b7c2e7e9d8653f15c8b0e8ec46392ca122c270a73dbd1a952eea3bb3b18f0",
    "paragraphs_sha256": "bc5e151ffd1adda83dc31154544e42ddf411721d8e4baf050841da5119dc4ff9",
    "paragraphs": 21,
    "preservation": "exact ordered paragraphs and normalized sentence joins match",
    "unresolved_boundaries": []
  },
  {
    "candidate": "/Users/son7/tseng-arc-visas-20261024/work/th-boundaries-candidate/705-taiwan-visa-residence-work-study-family.sentences.json",
    "candidate_sha256": "0bb124097ddbc42b485c126b5a61f9732cceba040d642409de6195bb36596f06",
    "source_sha256": "69424f50ab80a33091f3a485a154ab41b7c2c90069b148fa041a53e23e79c017",
    "paragraphs_sha256": "247a17d20239b65b27615ddc844b7154733d84a8b4851eaa4d83fa6acf615e97",
    "paragraphs": 22,
    "preservation": "exact ordered paragraphs and normalized sentence joins match",
    "unresolved_boundaries": []
  },
  {
    "candidate": "/Users/son7/tseng-arc-visas-20261024/work/th-boundaries-candidate/706-taiwan-arc-renewal-changes-reentry.sentences.json",
    "candidate_sha256": "690961b5ecb500c41033d2d8a5ae64091a08720a2e9a56ac25c141a648aec62b",
    "source_sha256": "7544dfe49600005b2583e27e625c13458e829a3f1e7daebb55470b4964108915",
    "paragraphs_sha256": "869ef790ff3be655b2f0860e9b494fc33dadb7b723a6e92aab9184204e5d4ea3",
    "paragraphs": 25,
    "preservation": "exact ordered paragraphs and normalized sentence joins match",
    "unresolved_boundaries": []
  }
]
```

## 도구 버전 근거와 후속 순서

읽고 추출할 때의 파일 해시:

```text
MULTILINGUAL-METHOD.md ccc2011ea3a388cd244ea8ca0cd71bd53f9cd5cbb1c62cd34ea6f66d0ed3a26b
variety_metrics.py 0491ce5e3a7bd0c3ebd9bea7aa0ed04ba3ea41c6b56d2707824455eb2ccd10fb
variety_multilingual.py 53fe3e3dbf3f151e06e2629672ce0c57ccea9484b14433d220bfd53d4e5c35b4
profiles/th.json 8410261b606d60f367bb43ec9588d6b90d916abc4f877aeb2bec4587b62c4254
```

다음 단계는 reviewer_th의 독립 경계 검토다. 저자가 선택한 불확실성 판정이 수용되거나 수정되어 경계가 승인된 뒤에만 root가 approval manifest를 만들고 지표 검사를 진행할 수 있다. 이 보고서와 후보는 자동 HARD 통과, 독립 내용 검수, 공개 게시 또는 실제 신청 결과의 증거가 아니다.
