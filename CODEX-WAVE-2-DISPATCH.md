# CODEX Wave 2 Dispatch — 2026-05-01

> **발행**: 2026-05-01 매니저 (Claude Opus)
> **선행 웨이브**: Wave 1 (2026-05-01) — A1 / B1 / C1 / D1 / E1 / F2 foundation 6개 통과 (dirty, 미커밋)
> **현재 위치**: `WIX-PARITY-6-ENGINEER-WORK-ORDERS.md` 기준 24 PR 중 6 완료 (~25%)
> **이번 웨이브 목적**: 각 엔지니어 우선순위 1번 PR로 foundation을 "사용 가능 단계"까지 끌어올린다. 운영 안전망(A2 CAS) + 보안 클린업(D2) + 반응형 실사용(B2) + 인라인 편집 영속성(C2)이 핵심.

---

## 1. 발주 목록

| # | 트랙 | PR 파일 | 핵심 |
|---|---|---|---|
| 1 | A2 Draft Save Revision / CAS | `CODEX-PROMPT-WAVE2-A2-DRAFT-CAS.md` | 두 탭 동시 저장 손실 방지. revision envelope + 409/428. |
| 2 | B2 Viewport-aware drag/resize | `CODEX-PROMPT-WAVE2-B2-VIEWPORT-DRAG.md` | B1 foundation을 CanvasContainer pointer events에 wiring. tablet/mobile은 responsive override에만 씀. |
| 3 | C2 Inline rich text persistence | `CODEX-PROMPT-WAVE2-C2-INLINE-PERSIST.md` | InlineTextEditor `onSave({richText, plainText})`. bold/underline/link 살아남음. dangerouslySetInnerHTML 제거. |
| 4 | D2 Guard coverage | `CODEX-PROMPT-WAVE2-D2-GUARD-COVERAGE.md` | 4개 auth-only mutation을 `guardMutation`으로 격상. `guardBuilderRead()` 신규. asset list admin-only. |
| 5 | E2 Card/Form variants | `CODEX-PROMPT-WAVE2-E2-CARD-FORM-VARIANTS.md` | CARD_VARIANTS / FORM_INPUT_VARIANTS를 실제 렌더에 연결. legacy adapter. |
| 6 | F1 Template registry tests | `CODEX-PROMPT-WAVE2-F1-TEMPLATE-TESTS.md` | `npm run test:unit`이 진짜 검증하도록 vitest 테스트 추가. 170 templates 무결성. |

---

## 2. 파일 충돌 매트릭스

high-risk shared 파일을 동시에 건드리는 트랙 없음. 다만 **두 곳만 주의**:

| 파일 | 건드리는 트랙 | 처리 |
|---|---|---|
| `src/lib/builder/canvas/types.ts` | A2(envelope 타입 추가), E2(variant 키 추가) | 두 트랙 모두 **append-only**. 기존 export 수정 금지. |
| `vitest.config.ts` | F1만 수정 | D1이 이미 깔아둔 config에 `setupFiles` 또는 `coverage` 옵션 추가 가능 |

이 외 모든 PR은 disjoint 파일 집합. 병렬 안전.

---

## 3. 발사 전 사전 작업 (사용자 / 매니저)

**커밋 정리**: 현재 working tree가 04-30 배치(8 트랙) + 05-01 Wave 1(6 트랙)이 겹쳐 263개 dirty. Wave 2를 쏘기 전에 **트랙별 분할 커밋 권장** — Wave 2 발사 후 한꺼번에 커밋하면 어느 트랙에서 문제가 터졌는지 분리가 어려움. 최소한 Wave 1 6 커밋은 분리 후 Wave 2 발사.

**04-30 배치 미커밋 트랙 (8개)**:
- E1 Blog admin / F1 Responsive·Layers / F4 Translations / F5 Forms+ / G1 Bookings + booking-widget / Blog widget CSS / Layers cross-parent drag

**05-01 Wave 1 미커밋 트랙 (6개)**:
- A1 Canonical site id / B1 Responsive geometry / C1 Rich text / D1 QA harness / E1 Theme indicators / F2 Saved section

---

## 4. 발사 후 매니저 검증 절차

각 worker 종료 시 매니저(Claude)가 수행:

```bash
# 1. tree 차이 확인
git diff --check
git status --short | wc -l

# 2. QA 게이트
npm run typecheck
npm run lint
npm run test:unit            # F1 종료 후엔 진짜 테스트 실행됨
npm run security:builder-routes
npm run build

# 3. dev 띄우고 smoke
npm run dev &                # 3000 포트
BUILDER_SMOKE_TIMEOUT_MS=30000 npm run smoke:builder

# 4. 트랙별 수동 점검
# A2: 두 탭 동시 저장 → 두 번째가 409
# B2: tablet 뷰에서 드래그 → desktop rect 안 바뀜
# C2: 텍스트 bold + 링크 → 저장 → 새로고침 → 살아있음
# D2: security:builder-routes 출력에서 "auth-only" 0 건
# E2: Card 4종 / Form input 3종이 인스펙터 dropdown에 노출
# F1: vitest run에서 templates.test.ts 실제 통과
```

---

## 5. 잔여 미발주 (Wave 3 후보)

| 엔지니어 | 잔여 PR |
|---|---|
| E1 | **A3** Publish transaction (A2 후속) |
| E2 | **B3** Esc cancel during drag |
| E3 | **C3** Shared LinkValue / LinkPicker |
| E4 | **D3** Audit log foundation |
| E5 | **E3** Brand kit assets / **E4** Media crop·focal point |
| E6 | **F3** Built-in section templates / **F4** Animation runtime coverage |

Wave 2 닫히면 Wave 3에서 A3+B3+C3+D3+E3+F3 가능. E4와 F4는 Wave 4까지 미룰 수 있음.

---

## 6. SESSION.md 갱신 양식

Wave 2 종료 시 `/Users/son7/Projects/tseng-law/SESSION.md`에 추가:

```markdown
## 2026-05-?? Wave 2 결과 (6 PR)

| 트랙 | 결과 |
|---|---|
| A2 Draft CAS | ... |
| B2 Viewport drag/resize | ... |
| C2 Inline rich text persistence | ... |
| D2 Guard coverage | ... |
| E2 Card/Form variants | ... |
| F1 Template registry tests | ... |

검증:
- typecheck / lint / test:unit / security / build / smoke 모두 통과
- 4 auth-only → 0
- 첫 진짜 vitest 테스트 ?? 케이스 통과

다음 웨이브: A3 → B3 → C3 → D3 → E3 → F3
```
