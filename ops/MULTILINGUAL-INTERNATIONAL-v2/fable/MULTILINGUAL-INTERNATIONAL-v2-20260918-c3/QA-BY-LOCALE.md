# QA-BY-LOCALE — MULTILINGUAL-INTERNATIONAL-v2-20260918-c3 (c2 대비 변경분)

reviewer: Claude Opus 5 (son7-a0) · 2026-09-18 · 후보 해시 시작=종료 93/93. 아래에 없는 행은 c2 `QA-BY-LOCALE.md` 결과를 유지한다(관련 파일 바이트 동일 확인).

| test_id | locale | page_role | actual_url | source_path | c2 | c3 | evidence / 비고 |
|---|---|---|---|---|---|---|---|
| ML01 | all9 | inventory | — | `ops/.../LOCALE-PAGE-MAP.md` | FAIL | PASS | 역할×URL×소스×상태 표 복원, de/es 404·GAP 명시 |
| ML02 | core4·guidance4 | policy | — | `ops/.../POLICY-MATRIX.md` | FAIL | PASS | 정책 파일 경로·조항 표 |
| ML02 | ar | policy | `/ar` | `multilingual-international-v2.ts` ar 주석, `docs/seo/mena-plan/AR-LOCALE-INVENTORY.md` | BLOCKED | PASS | 인용 파일 실재, 신규 국가 규칙 없음 |
| ML04 | tree | preservation | — | ops | FAIL | FAIL | CONTENT-DIFF·BASELINE 부재(C3-02) |
| ML06 | ja | P03 | `/ja/columns/taiwan-company-establishment-basics` | columns-ja/001:43,117,119,123 | FAIL | PASS | 韓国関連 한정 표시 3곳+제목. 문체 P2(C3-05) |
| ML07 | ko/zh-hant | P01 | `/{l}/guides/taiwan-company-setup` | content.ts KO/ZH 비용표 | FAIL | PASS | 2023.12.27 발효·2024.1.1 적용 |
| ML07 | zh-hant | P04 | `/zh-hant/services/investment` | service-details.ts:20,25 | FAIL | PASS(추적) | CLAIM-REGISTER C-ZH-DUAL 변호사 검토 대기 |
| ML08 | en | P01 CTA | `/en/guides/taiwan-company-setup` | content.ts:502 | — | FAIL(P2) | 새 응대 주체 주장(C3-03) |
| ML09 | ja/ko/zh-hant | P02·P05 | `/{l}/taiwan-company-setup-lawyer`, `/{l}/taiwan-litigation-lawyer` | intent-pages.ts | FAIL | PASS | 相談案内/상담 안내/諮詢說明, ZH 제목 法律諮詢, JA planHeading |
| ML10 | core4 | P06 | `/{l}/services/civil` | CivilCommercialBlock | PASS | PASS | 독자 문장화, 상해 안내 유지 |
| ML11 | ja/ko/zh-hant | P05→P07 | `/{l}/taiwan-litigation-lawyer` | IntentLandingPage.tsx | FAIL | PASS | 1440·390 첫 화면, 클릭 이동(`logs/30`) |
| ML15 | ja/zh-hant | P07 title | `/{l}/taiwan-debt-recovery-lawyer` | P07 content.ts | FAIL | PASS | 브랜드 1회 |
| ML22 | core4 | 공통 템플릿·테스트 | — | 단위 테스트 | FAIL | FAIL | 신규 회귀 1건 `intent-pages-en-growth.test.ts:17`(C3-01). 가드 약화 대체 단언 없음 P2(C3-04) |
| ML22 | ja | 문자 | P07 | content.ts | FAIL | PASS | 公証 |
| ML23 | core4 | 배지·초안 문구 | civil, P07 | services page.tsx, P07 reviewNote | FAIL | FAIL(P2) | 미해소(V2-12) |
| ML23 | core4 | 출처 | CLAIM-REGISTER | ops | FAIL | PASS | 근거 URL·확인일 기재 |
| ML24 | candidate | 해시·증거·상태 | — | manifest·ops | FAIL | FAIL | 해시 PASS, 증거 산출물·QA 갱신 부재(C3-02) |
| ML11 | core4 | P07 제목 계층 | P07 | page.tsx | P2 | PASS | 상황별 h3 |

## 고객 시나리오 (에이전트 과제 수행)
A EN PASS · **B JA PASS** · **C KO PASS** · **D ZH-Hant PASS** · E 안내형 PASS(c2 유지) · **F AR PASS**(정책 인용) · G 상해 PASS · H 언어 전환 FAIL(P2, V2-13 이월)
