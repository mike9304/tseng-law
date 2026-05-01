# CODEX Wave 3 Dispatch — 2026-05-01

> **발행**: 2026-05-01 매니저 (Claude Opus)
> **선행 웨이브**: Wave 1 (A1/B1/C1/D1/E1/F2) + Wave 2 (D2/A2/B2/C2/E2/F1) — 모두 분할 커밋 완료, 풀 게이트 통과
> **현재 위치**: `WIX-PARITY-6-ENGINEER-WORK-ORDERS.md` 기준 24 PR 중 12 완료 (~50%)
> **이번 웨이브 목적**: 각 엔지니어 우선순위 2번 PR로 foundation을 "신뢰 가능 단계"까지 끌어올린다. 운영 신뢰성(A3 publish transaction) + 사용성(B3 Esc cancel + C3 link picker) + 운영 가시성(D3 audit) + 브랜드/다크(E3) + 콘텐츠 자산(F3).

---

## 1. 발주 목록

| # | 트랙 | PR 파일 | 핵심 |
|---|---|---|---|
| 1 | A3 Publish Transaction | `CODEX-PROMPT-WAVE3-A3-PUBLISH-TRANSACTION.md` | publish 5단계 트랜잭션 (draft 검증 → checks → revision write → meta pointer → site doc). revision write 실패 시 publish fail-closed. |
| 2 | B3 Esc Cancel | `CODEX-PROMPT-WAVE3-B3-ESC-CANCEL.md` | drag/resize/rotate 도중 Esc → mutationBaseDocument 복원, deselect로 fall-through 안 함. |
| 3 | C3 LinkValue / LinkPicker | `CODEX-PROMPT-WAVE3-C3-LINK-PICKER.md` | 공용 `LinkValue` 타입 + `LinkPicker` 컴포넌트. button/image/container 인스펙터 통일. javascript:/data:/protocol-relative 차단. |
| 4 | D3 Audit Foundation | `CODEX-PROMPT-WAVE3-D3-AUDIT-LOG.md` | builder mutation/publish/asset 이벤트 기록. PII/credential 저장 금지. |
| 5 | E3 Brand Kit Assets + Dark Mode | `CODEX-PROMPT-WAVE3-E3-BRAND-KIT-DARK-MODE.md` | brand kit이 logo/favicon/OG image를 asset library에서 선택. dark mode `data-theme` 인라인 script + visitor toggle 옵션. |
| 6 | F3 Built-in Section Templates | `CODEX-PROMPT-WAVE3-F3-BUILT-IN-SECTIONS.md` | 12+ 정규화된 섹션 템플릿 (hero/features/testimonials/CTA/footer/legal). saved sections와 같은 clone/id-remap 경로. **F1 XFAIL 2건 borderRadius schema relax 포함**. |

---

## 2. 파일 충돌 매트릭스

| 파일 | 건드리는 트랙 | 처리 |
|---|---|---|
| `src/lib/builder/site/types.ts` | A3 (publishedRevisionId 메타) + E3 (BrandKit / darkMode) | 두 트랙 **append-only**. 기존 export 수정 금지. |
| `src/lib/builder/site/public-page.tsx` | A3 (revision pointer 사용) + E3 (data-theme inline script + brand logo) | 분기 다름. 충돌 가능성 낮으나 A3가 SSR cache key 변경, E3가 head insert. 두 트랙 PR을 같은 시점에 머지하지 마 — 한 명 끝나고 다음. |
| `src/components/builder/canvas/CanvasContainer.tsx` | B3 (Esc handler) + C3 (link picker는 SelectionToolbar 통해 접근, CanvasContainer 거의 안 건드림) | B3가 주요 점유. C3는 1~2 라인만 wiring. 안전. |
| `src/components/builder/canvas/SelectionToolbar.tsx` | C3 단독 | 안전 |
| `src/lib/builder/site/persistence.ts` | A3 단독 (recordRevision 강화) | 안전 |
| `src/lib/builder/canvas/store.ts` | B3 단독 (mutationBaseDocument 복원 액션) | 안전 |
| `src/lib/builder/audit/` | D3 신규 디렉토리 | 안전 |
| `src/lib/builder/sections/templates.ts` | F3 신규 | 안전 |
| `src/lib/builder/canvas/types.ts` | F3 (borderRadius schema relax) | F1 XFAIL 픽스. 다른 트랙 안 건드림. |

기본적으로 6트랙 모두 disjoint. 단 A3+E3는 types.ts/public-page.tsx 양쪽에 append하니 머지 순서 주의.

---

## 3. 발사 전 사전 점검 (사용자)

**A2 manual 검증 권장**: Wave 2 A2 CAS는 라이브 curl로 200/409/428 검증됨. 두 탭 동시 저장 manual은 미진행. **A3는 A2 위에 얹으니 A2가 깨져 있으면 A3도 깨짐**. 5분 내로 manual 한 번 돌리고 발사 권장.

브라우저 동선:
1. `/ko/admin-builder` 두 탭 열기 (같은 페이지)
2. 탭 A: 텍스트 수정 → 저장 (자동)
3. 탭 B: 다른 텍스트 수정 → 저장 시도
4. 탭 B에 "Conflict — 다른 탭에서 저장됨" 빨간 배너 + 새로고침 버튼

배너 떠야 통과. 안 뜨면 발사 보류 + 매니저에게 신호.

---

## 4. 발사 후 매니저 검증 절차

```bash
# 자동 게이트
npm run typecheck && npm run lint && npm run test:unit && \
  npm run security:builder-routes && \
  BUILDER_SMOKE_TIMEOUT_MS=30000 npm run smoke:builder

# 트랙별 수동 점검 (발사 후 권장)
# A3: blocker → 422 (publish 안 됨), stale draft → 409, revision write 실패 → 500 + publish 비성공
# B3: drag 시작 → Esc → ghost 사라짐 + base rect unchanged
# C3: 버튼 인스펙터 link 입력 → javascript:alert(1) 차단
# D3: asset upload → audit log 한 줄 기록 (request body는 저장 안 됨)
# E3: brand kit panel에 logo/favicon/OG asset selector. /ko에 dark mode 토글 (visitor toggle 옵션 활성화 시)
# F3: Add 패널 상단에 "Section templates" → 12+ 템플릿 → 클릭 시 캔버스에 삽입
```

---

## 5. 잔여 미발주 (Wave 4 후보)

| 엔지니어 | 잔여 PR |
|---|---|
| E5 | E4 Media Validation / Crop / Focal Point |
| E6 | F4 Animation Runtime Coverage / Scroll Optimization |

이 둘만 남으면 24 PR foundation 100% 완료. 그 다음은 G/H/I (vertical apps, ops, longtail).

---

## 6. SESSION.md 갱신 양식

Wave 3 종료 시:

```markdown
## 2026-05-?? Wave 3 결과 (6 PR)

| 트랙 | 결과 |
|---|---|
| A3 Publish Transaction | ... |
| B3 Esc Cancel | ... |
| C3 LinkPicker | ... |
| D3 Audit log | ... |
| E3 Brand kit + Dark mode | ... |
| F3 Built-in section templates (+ F1 XFAIL 픽스) | ... |

검증: typecheck/lint/test:unit/security/build/smoke 통과.
다음 웨이브: E4 + F4 (foundation 클로즈) → G1+ vertical apps.
```
