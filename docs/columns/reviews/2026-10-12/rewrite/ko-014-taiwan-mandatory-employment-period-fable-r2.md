# FINAL REVIEW r2 — ko-014 taiwan-mandatory-employment-period (Claude Fable)

Verdict: PASS

## Scope checked

- orig.md and draft.md read in full and compared claim by claim, section by section (my own pass, not a re-read of review-r1).
- guard.txt: GUARD: PASS (length 7498 → 6864, 92 %; monotony 24.9 → 17.1; contrast 2 → 0).
- notes.md including the "fix round review-1" block; review-r1.md (one blocking issue B1: read_time 13분 vs formula 12분 and a tests.patch that hardcoded 13분).
- tests.patch (30,248 bytes, non-empty), tests.txt, vitest-1.log: 80 files / 1092 tests passed with the patch applied at 12:30.
- Front matter diff run mechanically: only `lastmod` (2026-07-25 → 2026-10-12) and `read_time` (14분 → 12분) differ. H1 and image line byte-identical.
- Eojeol count emulated with the test's own `extractPublicText` logic: 2,132 → ceil(2132/180) = 12, matching `read_time: "12분 분량"`, the patch pin `toBe(2_132)` and `toBe(12)`.
- `variety_metrics.py check … --lang ko`: FAIL 0, one WARN (99 % of sentences end in 니다., which is the register itself). cv 0.462, short 9.5 %, contrast 0, opener_rep 0.02, q 2.
- SENTENCE-VARIETY-RULE.md sections 5–6, COLUMN-VOICE-RULE.md, LESSONS.md top items.
- Guard re-run after my one edit: GUARD: PASS (same numbers as above).

## 1. Fact preservation — claim by claim

### Front matter / H1 / image
| Original | Rewrite | Status |
|---|---|---|
| title, url, date_display, categories, featured_image, four FAQ q/a | byte-identical | preserved |
| lastmod 2026-07-25 | 2026-10-12 | expected |
| read_time 14분 분량 | 12분 분량 | matches repo formula (B1 of r1 resolved) |
| H1, image line | identical | preserved |

### 도입
| Original point | Rewrite | Status |
|---|---|---|
| 약정 = 일정 기간 근무 약속; 조기 퇴사 시 훈련비·계약금·근속보너스 반환 의무 여부와 별도 위약금 청구 가능 여부를 정하는 형태 | 도입 1문단 ("실무에서는 … 반환할 의무와 별도의 위약금 청구 가능 여부까지 함께 정해 둡니다") | preserved; see minor note A below (no legal shift) |
| 서명 문구만으로 효력·반환액 미확정; 명칭보다 법정 요건과 실제 지급·교육·종료 경위를 단계별 확인 | 도입 1문단 | preserved |
| 네 질문 ① 제15조의1 법정 요건 ② 기간·부담 합리성 ③ 종료 사유 귀속 ④ 퇴사 예고·반환 범위 | 도입 2문단, 같은 순서 | preserved |
| 적용 조문·필요 증거가 다름 | 도입 2문단 | preserved |
| 유효성·퇴사 효력 시점·반환 책임·별도 손해를 나누어 본다 (원문에 3회 반복) | 8절 마지막 문단 1회 | preserved, repetition cut |
| 새 수사의문 "조기 퇴사하면 … 돌려줘야 할까요?" | 도입 첫 문장 | added question only, no new claim |

### 1절 효력
| Original point | Rewrite | Status |
|---|---|---|
| 자동 무효 아님 (FAQ1) | "자동으로 무효는 아닙니다." | preserved |
| 제15조의1 제1항: 두 요건 선택적 — 전문기술 훈련+비용 부담 / 합리적 보상 | 1절 1문단, 제1항 명시 | preserved |
| 둘 다 필요 없음; 하나만 형식적으로 적어도 자동 유효 아님 | 1절 1문단 | preserved |
| 명칭보다 실제 근거 | 1절 1문단 | preserved |
| 제2항 합리성 별도 심사; 훈련 기간·비용, 대체인력 가능성, 보상 금액·범위 등 전체 사정 | 1절 2문단, 제2항 명시 | preserved (FAQ1 후반 문장이 제2항 문단으로 이동, 내용 동일) |
| 제1항 또는 제2항 위반 → 제3항 무효 | 1절 2문단 | preserved |
| 개별 심사 기준이지 일괄 유효·무효 규정 아님 | 1절 2문단 | preserved |
| 서명은 합의 자료일 뿐 요건 대체 못 함; 장기간만으로 결론 못 냄; 투자·보상과 기간 설정 이유 확인 | 1절 3문단 | preserved |
| 원문 3문단 (하나+별도 합리성 심사; 동시 제공 불요; 형식 기재로 자동 유효 아님) | 1·2문단에 흡수 | preserved, duplicate cut |

### 2절 전문기술 훈련
| Original point | Rewrite | Status |
|---|---|---|
| 실제 제공+비용 부담; 계획서 명칭·예상비용 기재만으로 부족; 주제·전문성·기간·이수·실제 지출 자료 연결 | 2절 1문단 | preserved |
| 외부 강사비·수강료·교재·장비 사용료"처럼" 직접 확인 가능한 비용 + 내부비용 산정 근거 | 2절 2문단 | preserved after my edit (draft had closed the list; see §7) |
| 내부 인력 시간, 통상 감독·인수인계와 차이, 귀속 근거; 추정액·일괄 배부액 불충분 | 2절 2문단 | preserved |
| 과정표·일정·출석부·평가·수료증·청구서·영수증; 기관 계약·전표·환불 조건; 근로자 일부 부담·제3자 지원 시 최종 부담자 | 2절 3문단 | preserved |
| 경계는 장소·운영 주체로 안 나뉨; 사내도 가능, 외부 장기도 입문교육일 수 있음; 일률 배제·고액 장기만으로 인정 금지 | 2절 4문단 | preserved |
| 기간–투자 관계; 역량·직무 관련성·왜 그 기간; 교육 후 실제 수행·기근무 기간도 자료 | 2절 5문단 | preserved |

### 3절 합리적 보상
| Original point | Rewrite | Status |
|---|---|---|
| 통상임금·근로 대가와 구별되는 목적·구조; 명세 표시만으로 성격 미확정 | 3절 1문단 | preserved |
| 지급 목적(임금 조건/근속 대가/성과) 계약서·고지자료에서 분명; 지급일·금액·귀속·근속 연결·반환 사유·산식 사전 제시 | 3절 2문단 | preserved |
| 2026년 6월 5일 노동부 지침: 역할 명확 고지; 사후 재해석·재분류로 대체 어려움 | 3절 3문단 | preserved |
| 합리성은 금액만 아님: 추가 이익·조건 명확·기근무분 귀속·반환 범위; 보상 있어도 무제한 허용 아님 | 3절 4문단 | preserved |
| 문구–실제 지급 일치: 지연·분할·조건부·세후 수령액·서면 고지 | 3절 5문단 ("…여기서 드러납니다") | preserved (원문 "판단하는 데 도움이 됩니다"보다 단정적이나 법적 주장 아님) |

### 4절 네 요소
| Original point | Rewrite | Status |
|---|---|---|
| 요건 있어도 기간·책임은 합리적 범위 | 1절 2문단 "심사는 거기서 끝나지 않습니다…" | preserved, duplicate cut |
| 제2항: 명칭·직종 고정 답 없음; 네 요소 ①훈련 기간·비용 ②동일·유사 직무 대체 가능성 ③보상 금액·범위 ④그 밖의 사정 | 4절 1문단, 같은 순서, 제2항 명시 | preserved |
| ① 총액만 부족: 항목별 증빙·근로자별 귀속액·역량·회수된 투자 | 4절 2문단 | preserved |
| ② 채용 난이도 주장만으로 불가: 인력 구득·자격·숙련·충원기간·객관 자료 | 4절 3문단 | preserved |
| ③ 지급 시점·확정 귀속 조건·기간 대응·중도 종료 시 이행분 반영; 같은 이름 보너스도 평가 상이 | 4절 4문단 | preserved |
| ④ 체결 경위·업무 성격·설명 내용·실제 근무기간·종료 사유; 중요도 사안별; 예시 한정 아님; 기록 사실 누락 금지 | 4절 5문단 | preserved |
| 비례관계; 직종만으로 효력 선정 금지; 다른 사건 결론 전용 금지; 체결 설계+종료 시 이행 정도 | 4절 6문단 | preserved |

### 5절 근거 안 되는 교육
| Original point | Rewrite | Status |
|---|---|---|
| 2026-06-05 지침: 정례·일반 직무·신입 적응·법정 의무교육 비용은 근거 불가; 명칭 아닌 과정·내용·기간·실제 비용·증빙 (FAQ2) | 5절 1문단 | preserved (소제목은 네 유형 중 둘만 들지만 본문은 넷 모두) |
| 勞動關2字第1150141814號 지침의 네 유형; 운영·법정 의무에 수반 → 근속 의무·제재 근거 전환 불가 | 5절 2문단 | preserved |
| 규칙 설명·조직 소개·인수인계·기본 안전절차는 통상 과정, 실질 확인; 일반 채용·관리·인수인계 비용을 투자라 이름 붙여 반환 대상 불가 | 5절 3문단 | preserved |
| 사내라는 이유만으로 항상 배제 아님; 혼합 프로그램은 과정별 주제·시간·비용·법정 의무 여부 분리; 주장 측이 자료로 설명 | 5절 4문단 | preserved |
| 표지 아닌 목차·운영기록 대조; 정례/자격·장비/법령 필수/실제 참여/청구액–증빙 일치 | 5절 5문단 | preserved |

### 6절 보너스 반환
| Original point | Rewrite | Status |
|---|---|---|
| 항상 전액 반환 아님; 합리적 보상이면 목적 명확 고지; 지침: 미이행 기간 비례, 전액 요구 불가; 목적·약정·기근무·종료 사유 종합 (FAQ3) | 6절 1문단 | preserved |
| 고지는 분쟁 후 최초 제시 불가; 어떤 금원·전체 기간·귀속 시점·정산 산식을 체결·지급 시점에 알 수 있어야 | 6절 2문단 | preserved |
| 비례 원칙: 시작일·종료일·실제 근무일·기준액 확정; 이행분 미반영 고정액은 비례 기준 검토; 분할·단계별 귀속은 지급분별 계산 | 6절 3문단 | preserved ("예를 들어" 표지 삭제; 가상 사례가 아니라 검토 항목이므로 손실 없음) |
| 순서: 효력 → 금원 성격 → 기근무 → 종료 사유 → 산식; ‘위약금’ 표현만으로 청구액 미확정 | 6절 4문단 | preserved |
| 전액 반환 문구·고정 위약금·일방 공제는 별개; 각 법적 근거·합의·노동법 제한·공제 적법성; 요구서 액수·일부 지급 사실로 확정 안 됨 | 6절 5문단 | preserved |
| 훈련비 반환 vs 선급성 급부 반환 구별; 중복 계산·증빙 별도 대조 | 6절 6문단 | preserved |

### 7절 귀책 없는 종료
| Original point | Rewrite | Status |
|---|---|---|
| 제15조의1 제4항: 귀책 없는 사유로 기간 전 종료 시 약정 위반 책임·훈련비 반환 책임 없음; 종료 사유·귀속은 해고 통지·사직 의사표시·근로조건 위반 자료 등 증거로 판단 (FAQ4) | 7절 1문단, 제4항 명시 | preserved (질문 문장 추가, 새 주장 없음) |
| 기간 전 종료 사실만으로 위반 인정 불가; 의사표시 주체·법적 근거·실제 사정 귀속 | 7절 2문단 | preserved |
| 자료 6종; 건강·업무 사정 언급만으로 단정 금지 | 7절 3문단 | preserved |
| 해고·합의 종료·근로조건 위반은 예시, 한정 열거 아님; 명칭–실제 불일치 가능 | 7절 4문단 | preserved |
| 종료 원인 → 반환 범위 직접 영향; 제4항 적용 시 책임 불가; 귀속 먼저, 산식 다음; 별도 청구는 성격·근거 구분 | 7절 5문단 | preserved |

### 8절 퇴사 예고
| Original point | Rewrite | Status |
|---|---|---|
| 약정은 퇴사를 물리적·법적으로 막는 장치 아님; 예고 = 종료 시점 문제, 약정·반환 = 재산상 책임 문제 | 8절 1문단 | preserved |
| 기간 정함 없는 계약: 제15조에 따라 제16조 제1항 예고기간 준용; 제16조는 사용자 종료 조항 | 8절 2문단 | preserved, articles attached correctly |
| 3개월 이상 1년 미만 10일 / 1년 이상 3년 미만 20일 / 3년 이상 30일 | 8절 2문단, 세 문장 | preserved, brackets identical |
| 특정 업무 기간제 3년 초과: 제15조 별도 규정, 3년 근무 후 30일 전 예고; 계속근로기간별 규정과 구분 | 8절 3문단 | preserved |
| 3개월 미만·다른 정기계약·즉시종료 사유는 개별 검토; 더 긴 예고기간·즉시 인수인계 요구만으로 결론 불가 | 8절 4문단 | preserved |
| 의사표시 내용·전달일·수령일·마지막 근무일 통신 보존; 네 질문 분리 | 8절 5문단 | preserved (네 항목 순서만 도입 순서로 정렬) |

### 9절 점검표 → "교육·지급·근무·종료 자료는 시간순으로 정리합니다"
| Original point | Rewrite | Status |
|---|---|---|
| 계약서만 읽지 말고 시간순 자료; 이행/잔여 기간·비용·보상 대응 자료 표 정리 | 9절 1문단 | preserved ("쟁점이 갈립니다"는 원문 "도움이 됩니다"보다 단정적, 법적 주장 아님) |
| 체결일·교육 시작·종료일·지급일·근무 시작·종료일·통지 전달일 함께 표시 (원문 말미) | 9절 1문단으로 이동 | preserved |
| 사용자 1 요건 특정 | "어느 법정 요건에 기대는지부터 특정" + "훈련이라면…/보상이라면…" | preserved |
| 사용자 2 교육 구분 / 3 자료 보존·외부·내부 분리 | 1문단 (2·3 순서 바뀜) | preserved |
| 사용자 4 보상 서면 연결 | 1문단 | preserved |
| 사용자 5 기간 근거·대체·운영 필요 문서화 / 6 비례·기근무 반영 / 7 종료 귀속 후 기간 계산 / 8 공제 전 대조 | 2문단 | preserved |
| 표준계약서 기계적 적용 금지; 투자·보상·대체 반영; 목적·산식 사전 고지 | 3문단 | preserved |
| 근로자 1~6, 8 | 근로자 쪽 자료 1~2문단 | preserved (8은 두 문장으로) |
| 근로자 7 (효력·퇴사·반환·손해 각각 검토) | 8절 마지막 문단에 동일 내용 | repetition cut, point retained |
| 일부 자료가 사용자에게만 있을 때 | 9절 마지막 문단 | preserved |

### 공식 자료 / 관련 안내 / 고지 / 서명
| Original | Rewrite | Status |
|---|---|---|
| 공식 자료 4 링크 (제15조의1, 제15조, 제16조, 노동부 지침 URL) | identical | preserved |
| 관련 안내 3 링크 | identical | preserved |
| 순서 공식 자료 → 관련 안내 | 관련 안내 → 공식 자료 (guard lint: last ## must be sources) | swapped, content intact, tests re-anchored |
| 고지 문단 | byte-identical | preserved |
| 서명 증준외 변호사(曾雋崴, Wei Tseng) | identical | preserved |

Nothing added: no new fact, example, case, number, first-person line, promise or sales line. The two added rhetorical questions carry no claim.

## 2. Front matter
Mechanical diff: only lastmod and read_time lines differ. read_time 12분 equals ceil(2132/180). H1 and image unchanged.

## 3. Blocking issues
None.

r1's B1 is resolved: draft read_time is 12분; the regenerated tests.patch restores both formula assertions (`toBe(\`${calculatedMinutes}분 분량\`)` for `parsed.data.read_time` and `post?.readTime`), pins 2_132 / 12, and the metadata blocks say '12분 분량'. No hardcoded 13분 and no "estimate" comment remain.

## 4. MONOTONY
Tool: FAIL 0. Section 5 self-check: 2 opener is a reader question, not a stock hypothetical; 3 many very short sentences ("금액이 전부는 아닙니다." "귀속 문제가 먼저입니다. 산식은 그다음입니다."); 4 no paragraph-start word appears 3 times (only "실무에서는" twice); 5 no 조문→다만 chain, citation-free paragraphs present; 6 contrast templates 0; 7 last body paragraph ends on this column's facts, disclaimer unchanged from the original; 8 합니다체 throughout, no bold, no emoji, no first person, no imperative checklist headings. Zero unmet items → no MONOTONY finding.

Non-blocking observations: "봅니다" closes 12 sentences and "…가 먼저입니다" appears twice (3절, 7절). Within tolerance for a 169-sentence legal column; not worth another round.

## 5. Length / padding
7498 → 6864 characters (92 %). Cuts: the preview sentence, the duplicated four-question list, 1절 3문단 (restated in 1·2문단), 4절 first sentence (restated in 1절), worker item 7 (restated in 8절), and list numbering. No condition, exception, number, article, link or list item dropped.

## 6. Tests verdict
PASS. tests.patch touches only `columns-ko-labor-014.test.ts`. It re-anchors headings (11 H2, 2 H3), the FAQ-in-body test (now anchors on the carried legal facts and asserts each FAQ answer appears exactly once in raw), intro sentence and four questions, exact phrases per section, list-to-prose items, link order, EOF block, eojeol pin and read_time, metadata date/readTime. Every lock on a legal fact, number, citation or link survives with new wording: 제15조의1 제1~4항, 제15조, 제16조 제1항, 10/20/30일, 3년/30일, 2026년 6월 5일 지침, 勞動關2字第1150141814號, four official URLs, three internal links, disclaimer, author. Removed assertions correspond only to intentionally removed structure (verbatim FAQ repetition, numbered lists, worker item 7). No `.skip`/`.only`; no other column's test changed. Full vitest run passed (80 files, 1092 tests). I verified every Korean string added by the patch is present in the edited draft.

## 7. Tiny edits applied to draft.md
1. 2절 2문단 first sentence: "직접 확인할 수 있는 비용은 외부 강사비, 교육기관 수강료, 교재·장비 사용료입니다." → "외부 강사비, 교육기관 수강료, 교재·장비 사용료는 직접 확인할 수 있는 비용입니다." Reason: the original listed these as examples ("…처럼 직접 확인할 수 있는 비용"); the draft's wording read as a closed definition. The reorder restores the illustrative sense with the same words. Eojeol count unchanged (11 → 11; total still 2,132), character count unchanged, pinned phrase '외부 강사비, 교육기관 수강료, 교재·장비 사용료' intact. Guard re-run: GUARD: PASS. variety_metrics: FAIL 0.

## 8. Original issues (not blocking)
- A. 도입 sentence "…반환할 의무와 별도의 위약금 청구 가능 여부까지 함께 정해 둡니다" phrases the repayment obligation as something the clause stipulates rather than the original's "whether there is an obligation". Describes drafting practice, not a legal rule, and the next sentence says signing alone settles nothing. Left as is because the sentence is pinned in tests.patch.
- Article numbers (제15조의1 제1~4항, 제15조, 제16조 제1항) and the 2026-06-05 Ministry of Labor guidance number (勞動關2字第1150141814號) were not re-verified against the law database in this round; carried over unchanged from the published original.
- The original has no contact e-mail line (guard notes it as pre-existing lint). Not added, per rules.
- The original's sections 1, 5, 6, 7 opened with FAQ answers pasted verbatim; the rewrite fixes this in the body while keeping front-matter FAQ text identical.
