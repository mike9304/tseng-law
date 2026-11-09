# 베트남어 칼럼·이슈 18편 보강 검수 기록 (2026-11-09)

사용자 요청: tseng-law.com 베트남어 칼럼을 형사·민사·상속·세무·회사·이슈 분야로 채운다. 워킹 에이전트 Cursor Composer 2.5·Grok 4.7, 법률 내용·말투·지시 준수 최종 검수는 Claude(Opus 5.5).

## 절차
- 법령 원문: 주 에이전트가 law.moj.gov.tw에서 2026-11-09 직접 받은 현행 조문(개정일·沿革 포함)을 워커에게 '출처 묶음'으로 제공. 워커 샌드박스는 인터넷 차단 → 묶음 밖 법률 진술 금지.
- 법령 DB 밖 사실(2026 세액 기준, 113憲判3, 토지 호혜국 표, 뉴스)은 별도 Claude 조사 에이전트가 공식 페이지 원문 인용으로 수집.
- 집필(Composer 또는 Grok) → 다른 모델 교차검수(조문 대조표) → 주 에이전트 r1 검수(문제 문장·이유·수정안·보존) → 워커 수정 → 주 에이전트 최종 대조·직접 수정 → 승인 SHA 기록.
- 모든 원고: variety_metrics.py check --lang vi FAIL 0, 굵은 강조·전화번호·작성자 표기·내부 작업 문구 없음, 연락처 이메일·주소 1회, 이미지는 Grok image_gen 가상 장면(글자·얼굴·번호판 없음)·캡션 'Cảnh hư cấu'.

## 첫 두 문단·최근 글 비교
- 직전 vi 칼럼 1120~1122는 결론 문장(조건 포함)으로 시작하고 질문형·서술형 소제목을 섞는다. 이번 18편도 첫 문장에 독자 질문의 답(조건 포함)을 두되 시작 유형을 나눴다: 결론형(C1·L1·L3·I2·T2·T3·Co3·X1), 상황형(C3·Co2), 법리 범위형(C2·I1·I3), 수치형(L2·T1), 뉴스 계기형(X2·X3).
- 각 원고의 첫 두 문단 삭제 테스트에서 예고·범위 메타 문장, 독자가 하지 않은 주장 반박 문장을 삭제했다(L2 2문단, C1 2문단, C3 2문단, Co3 2문단 등).

## 원고별
| ID | 파일 | 집필 → 교차검수 | 주요 정정 |
|---|---|---|---|
| VI-C1 | `src/content/columns-vi/1301-taiwan-first-time-shoplifting-deferred-prosecution.md` | r1 13항 + Grok xcheck 반영 확인 | 직접 수정: 불필요 문단 삭제, 기소 후 문장 정정, 용어 통일, 단문 추가. |
| VI-C2 | `src/content/columns-vi/1302-taiwan-facebook-group-insult-defamation-complaint.md` | Grok 초고 → Composer 교차검수 겸 재작성 | 직접 수정: 헌법판결 소개 문장 정리, 요지의 비공식성 문장 간결화, 연락 문단 재작성. |
| VI-C3 | `src/content/columns-vi/1303-taiwan-drunk-scooter-riding-criminal-fines-2026.md` | r1 13항 + 시행일 추가 지적 반영(Composer revise) | 직접 수정: 도입부 재작성(시행일 명시), 내부 표현 삭제, 67 문장 명확화. |
| VI-L1 | `src/content/columns-vi/1304-taiwan-loan-to-friend-without-contract-payment-order.md` | Grok 초고 → Composer xcheck → Composer 전면 재작성(root r1) | 직접 수정: 출처 목록 내부 표기 삭제, 중복 문장 삭제, 단문 보강. |
| VI-L2 | `src/content/columns-vi/1305-taiwan-small-claims-procedure-under-100000.md` | r1 FIX 14항 + Grok xcheck 반영(Composer revise) 확인 | alt를 실제 이미지에 맞게 수정. approved sha 25d721c12420e317 |
| VI-L3 | `src/content/columns-vi/1306-taiwan-online-shopping-seven-day-return.md` | Grok 초고 → Composer 전면 재작성(root r1 반영) | 직접 수정: 對價 오설명 삭제, 소제목 정정. |
| VI-I1 | `src/content/columns-vi/1307-vietnamese-heir-inherit-taiwan-land-house.md` | Composer 초고 → Grok xcheck(법률오류 15) → Composer revise | 직접 수정: 내부 메타 삭제, 내정부 해석 문장 정리, T3 링크로 교체(T3와 함께 게시해야 함). |
| VI-I2 | `src/content/columns-vi/1308-taiwan-will-excludes-spouse-reserved-share.md` | Grok 초고 → Composer xcheck → Composer revise | 직접 수정: summary·첫 문단의 1173 오설명 정정, 1225를 "지정상속분·분할방법에는 적용 안 됨"으로 단정한 부분 완화(실무상 쟁점, 자기판단 금지 안내), 58 단서 난문 삭제, 용어 정정. |
| VI-I3 | `src/content/columns-vi/1309-taiwanese-father-child-born-vietnam-acknowledgment-inheritance.md` | r1 10항 + Grok xcheck 반영 | 직접 수정: summary 재작성(준거법), 스크래핑 잔여 문장·메타 문장 삭제, 1144 배우자 공동상속 추가. / alt를 실제 이미지에 맞게 수정. approved sha 01c1c37bd0fa5684 |
| VI-T1 | `src/content/columns-vi/1310-vietnamese-worker-leaving-taiwan-mid-year-income-tax.md` | Grok 초고 → Composer 교차검수 겸 재작성 | 직접 수정: 출처 목록 개정일·본문 끝 이미지 고지 중복 삭제. |
| VI-T2 | `src/content/columns-vi/1311-taiwan-facebook-live-seller-tax-registration.md` | Composer 초고 → Grok xcheck(법률오류 7) → Composer revise | 직접 수정: 출처 한계에 관한 메타 문장 4곳 삭제, 업종 목록 문장 정리, 출처 목록 개정일 삭제. |
| VI-T3 | `src/content/columns-vi/1312-taiwan-family-death-estate-tax-filing-2026.md` | Composer 초고 → Grok xcheck(법률오류 11+) → Composer revise | 직접 수정: summary 축약(예외 조건은 본문·FAQ에 유지). |
| VI-Co1 | `src/content/columns-vi/1313-vietnamese-spouse-open-restaurant-taiwan-business-registration.md` | Composer 초고 → 주 에이전트 1차 정리 → Grok xcheck(법률오류 13) → Composer revise | 직접 수정: 내부 문구 4곳 삭제, 세무 문단 재작성(28조 근거). |
| VI-Co2 | `src/content/columns-vi/1314-taiwan-company-tax-arrears-director-exit-ban.md` | Composer 초고 → 주 에이전트 1차 정리 → Grok xcheck(법률오류 13) → Composer revise | 직접 수정: summary·FAQ1 난문 재작성, 기관명·법령명 표기 통일, 군더더기 삭제. |
| VI-Co3 | `src/content/columns-vi/1315-taiwan-limited-company-partner-exit-capital-transfer.md` | r1 13항 + Grok xcheck 반영 확인 | 직접 수정: 내부 문구 6곳 삭제, 101 과태료 오귀속 정정(103만 해당), 108 관련 무의미 문장 삭제, 침묵·강제집행 문단 재작성. |
| VI-X1 | `src/content/issues/vi/ISSUE-20261109-41-taiwan-drug-driving-penalties-oct-31-borrowed-vehicle.md` | Grok 초고 → Composer 교차검수 겸 재작성(중복 회피: 빌린 차 몰수·차주 면책 중심, 기존 이슈 2편 링크) | 직접 수정: 기관명, 소제목성 질문 문장 정정. |
| VI-X2 | `src/content/issues/vi/ISSUE-20261109-42-taiwan-transporting-housing-missing-migrant-workers-penalty.md` | Composer 초고 → Grok xcheck(법률오류 13) → Composer revise | 직접 수정: 첫 문단 63조 재범 징역 상한(3년) 정정, 이슈 내부 링크 형식 수정, 메타·난문 정리. 당사자 이름 없음 확인. |
| VI-X3 | `src/content/issues/vi/ISSUE-20261109-43-taiwan-broker-held-arc-phone-number-fraud-acquittal.md` | Composer 초고 → Grok xcheck(법률오류 다수) → Composer revise | alt를 실제 이미지(뒷모습 인물)에 맞게 수정. approved sha 3bf955eca85a7451 |

## 남은 확인 사항(변호사 확인 권장)
- I1: 비호혜국(베트남) 상속인의 부동산 상속등기 실무 처리 — 공식 해석 원문 미확보, 원고는 지정사무소 문의로 안내.
- I2: 지정상속분·분할방법 지정에 대한 특류분 扣減 적용(1225 유추) — 원고는 단정하지 않음.
- X1: 차량 몰수의 차주 면책(行政罰法22) — 행정원 초안 설명 근거, 최종 입법이유 미확인으로 그 범위만 기술.
- X3: 판결번호·확정 여부 미확인(보도 기준 1심).
- T1: 2027년 비거주자 6% 기준액은 재정부 공고 전이라 기재하지 않음.

작업 산출물(조사·교차검수·검수 원문): Mac Studio `~/tseng-vi-1109/{research,reviews}`.
