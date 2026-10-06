# en-003 Fable 검수 r1 — `work/en-003/draft.md` (2026-10-06 16:42판, md5 4689f94a4fb71617c2ed875493d638e1)

판정: **FIX** — 법적 내용(1)(2)(4)와 링크(3)는 PASS. 수정 목록은 기록·구조·언어 간 일관성 4건(아래 F1–F4). 파일 수정 없음.
확인 방법: 원문↔초안 전체 diff, URL 정규화 전수 비교, 출처 블록 항목 비교, law.moj.gov.tw 원문 열람(刑法 §41·§185-4·§276·§284·§287, 刑訴 §237·§238, 道交條例 §62, 民法 §188·§196; 2026-10-06 16:3x–16:4x).

## (1) Q16–Q20 흡수 — 법적 사실 누락 없음 (PASS)
| 원문 사실 | 원 위치 | 초안 위치 | 원문 대조 |
|---|---|---|---|
| 과실치사 = 刑法 §276 | Q17 S1 | Q4 P1 "Negligent homicide is addressed by Criminal Code Article 276." | §276 「因過失致人於死者…」 일치 |
| 양형은 사건별, 고정 개월 수 없음 | Q17 S2 | Q4 P1 글자 그대로 | — |
| §41 易科罰金 요건·예외 | Q17 S3 | Q4 P1 (+"Criminal Code") | §41① 최중본형 5년 이하·6월 이하 선고, 단서 예외 → "eligibility requirements and exceptions" 일치 |
| 과실치상·중상 = §284, §287 告訴乃論 | Q17 S1 / Q18 링크 | Q3 P1(원래 있음) | §287 열거 277①·281·284, §276 미포함 → "such as negligent homicide" 정확 |
| §238 1심 변론종결 전 취하, 재고소 불가 | Q18 S1 | Q5 P3(원래 있음) | §238①② 일치 |
| 사적 합의 ≠ 비친고죄 공소 종료 | Q18 S3 | Q5 P3 ", such as negligent homicide," 삽입 | 일치 |
| 지급·취하 조건 구별 | Q18 S2 | Q5 P1 "relationship between payment and complaint withdrawal" | 동치 |
| §185-4 부상·사망 사고 도주 | Q19 S1 | Q1 P4(원래 있음) | §185-4 일치 |
| 물피 사고도 道交條例 §62 처리 의무·행정 제재 | Q19 S2 | Q1 P3 끝 "administrative sanctions under … Article 62" + 링크 | §62① 無人受傷或死亡而未依規定處置 1,000–3,000 TWD 罰鍰·逃逸 吊扣 1–3月 → 물피 문단에 붙인 것이 정확 |
| 보험사 처리 범위·서류·통지 기한, 합의 전 기지급 보험금·추가 치료비·포기 범위 | Q16 | 삭제. 남은 곳 Q5 P1(보험·향후 치료·유보 청구), Q15 P4(약관 개별 확인) | 조문 없음. "notice deadlines" 어구만 소실(허용, 선택 S1) |
| 결과·배상액 비보장 | Q20 S2 | **삭제**(ko는 도입으로 이동) | → F3 |

## (2) 옮긴 문장의 의미 — 변화 없음 (PASS)
- Q4 P1에 Q17 3문장이 붙어 과실 상계 문단이 양형으로 흐르지만 사실 왜곡은 없음(문체 라운드에서 2문단 분리 권고, 선택 S2).
- 순서 변경 4건(Q2 P3, Q3 P2, Q13 P1, Q14 P2) 의미 동일. 단 Q14 P2 어순은 테스트 approved 문장과 어긋남(F1).
- 리드 지시 사실정정 2건 원문 대조 PASS:
  - F-006 Q14 P3 "if the victim applies … order the employer to pay all or part" ↔ §188② 「法院因其聲請，得斟酌…令僱用人為全部或一部之損害賠償」 일치.
  - F-007 Q7 재산 불릿 "reduction in the vehicle's value … repair costs … only to the extent necessary … depreciation … new parts" ↔ §196 「…所減少之價額」 일치. 수리비 기준·신품 감가는 最高法院77年度第9次民庭決議(2차). ja·zh 원문이 이미 같은 서술이라 ko·en 정렬로 타당. 다만 결의 출처는 4언어 어디에도 링크 없음(선택 S3).
- 삭제된 유보문(Q3 P4 S2, Q5 P2 S2, Q6 P1 이유절·P3 S2 뒷절, Q7 P1 S2, Q8 P3 S2, Q11 P3 S2 전체, Q14 P4 전체, Q2 P2 S3, Q4 P3 S2): 각각 ledger의 "남은 곳"이 실제로 그 사실을 담고 있음을 확인.

## (3) 출처 — 누락 없음 (PASS)
- 외부 URL 43종 전부 보존(원문 55표기→초안 51표기, 사라진 4표기는 Q17–Q19의 [284][238][287][185-4]로 같은 URL이 출처 블록에 있음), 새 URL 0, 내부 링크 3개 동일.
- 세 블록 항목 17/14/13 개·순서·링크 동일(1차 검사의 "Q11–Q15 14개"는 뒤따르는 `---`를 항목으로 센 오탐).
- §276·§41은 인라인만: 원문도 인라인만이었으므로 회귀 아님.

## (4) connectors — 새 법률 주장 없음 (PASS)
1·2·3·4번은 Q17–Q19 원문 조각, 5번은 제목. F-006·F-007은 FINDINGS 근거 있음.

## FIX 목록
- **F1 (기록 오류·테스트)** notes.md 31행 "이 글의 en 본문을 검사하는 테스트 없음"은 틀림. `src/lib/__tests__/columns-en-traffic-003.test.ts`(2026-09-30 교통 보드 리뷰)가 ①Q16 제목을 섹션 경계 마커로 사용(q16Marker), ②`### Q1–Q5 Official Sources`가 Q5 뒤·Q6 앞 섹션 안에 정확히 1회 있고 그 안에 소스 URL 17개가 각 1회 있어야 함(445–448행, 560행대 `markdownLinks…toEqual(officialSourceUrls)`), Q6–Q10·Q11–Q15 블록도 같은 식, ③"approved" 문장 고정: 도입의 claim deadline→fault→settlement 순서와 "general sequence … Taiwan law … official guidance", Q2 recording 문장 1회, Q3 "no universally best route", Q4 "full body of evidence" 1회, Q11 earning-capacity 문장(Q12 절 포함), Q14 joint-claim 문단 어순, Q15 policy 문단. 초안은 이 중 도입 2문장·Q2·Q3·Q4·Q11·Q14 어순 7개를 삭제·변경함 → 테스트 재고정은 단순 재앵커가 아니라 09-30 승인 문장의 잠금을 푸는 결정. ko/ja/zh `columns-*-traffic-003.test.ts`도 같은 구조(Q16 마커·출처 H3 위치·approved 문장).
- **F2 (구조, 리드 결정)** 출처 블록 3개를 글 끝 `## Official Sources`로 옮긴 것은 TRIM에 필요하지 않고 4언어 테스트의 구조 고정(②)과 정면 충돌. 권고: 블록을 원래 자리(Q5·Q10·Q15 뒤)에 둠 → connectors 5번도 사라짐. 끝으로 모으는 쪽을 택하면 결정 사유를 ledger에 기록.
- **F3 (ko↔en 일관성)** 같은 slug·같은 TRIM인데 처리가 다름: 도입 S2·S3(en 삭제 / ko 유지), Q20 결과 비보장(en 삭제 / ko 도입 끝으로 이동), Q3 P4 S1 요인 나열(en 유지 / ko 삭제), Q4 P3 S2·Q11 P3 S2·Q14 P4(en 삭제 / ko 유지). 권고: 도입·결과 비보장은 ko 방식(유지)으로 — en 파일에는 면책 박스·서명이 없어 그 문장을 지우면 면책 기능이 도입 뒷절 하나만 남음. 문항 간 중복 3건은 한 기준을 정해 4언어에 똑같이.
- **F4 (원칙)** 2,400 words에 맞추려고 "The choice of civil defendants is distinct from criminal liability."를 추가 삭제했음(notes 25행). POLICY는 정확성>분량이고 9 words 초과는 무의미 → 복원.

## 선택(비차단)
- S1 Q15 P4 끝에 Q16의 "notice deadlines" 어구 이동(원문 어구 재배치, 새 주장 아님).
- S2 Q4 P1을 "Negligent homicide…" 앞에서 2문단으로 분리.
- S3 F-007 근거(77年第9次民庭決議 또는 판결 1건)를 열어 확인한 뒤 출처 목록에 추가 — 4언어 공통.
