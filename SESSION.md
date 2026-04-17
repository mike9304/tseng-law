# SESSION.md — 현재 세션 인수인계

## 세션: S-03 (다음 세션 · target TBD)
## 마지막 업데이트: 2026-04-18 (S-02 마감, S-03 대기 중)

---

## 🔥 다음 컴퓨터 켜면 바로 할 일

1. **이 파일 읽기** (SESSION.md)
2. **AGENTS.md 읽기**
3. **Wix 체크포인트.md 점수 확인** — 현재 🟢 **4 / 225** (W01, W05, W13, W16)
4. **dev 서버 띄우기**: `cd /Users/son7/Projects/tseng-law && npm run dev`
5. **S-02 브라우저 검증 먼저** (아래 §S-02 검증 대기)
6. 검증 결과에 따라 W03/W12 🟢 승격 or 보류
7. 사용자에게 **S-03 target W__ 지정** 받기
8. Manager 가 SESSION.md (이 파일) 를 S-03 계약서로 재작성 후 실행

---

## S-02 검증 대기 (S-03 첫 action)

- **W03 인라인 텍스트 편집**:
  1. `/ko/admin-builder` 접속 (admin / local-review-2026!)
  2. 홈 composite (예: home-case-results) 클릭 선택
  3. 내부 "RESULTS" 또는 "한국 학생 헬스장 부상 사건..." 텍스트 직접 클릭 (한 번)
  4. 그 자리에서 타이핑 → **Enter** (커밋) 또는 클릭 외부 (커밋) 또는 **Esc** (취소)
  5. 브라우저 새로고침 → 변경 유지 확인
  6. OK 면 W03 → 🟢

- **W12 Inspector 탭**:
  1. composite 선택 → 우측 Inspector → Layout/Style/Content/A11y/Seo 5탭
  2. Content 탭 클릭 → composite 이면 "슬롯 편집" textarea 표시
  3. surface (예: "주요 서비스") 클릭하면 Inspector 자동 Content 탭 전환 + textarea 에 현재 override 표시
  4. textarea 편집 → 캔버스 반영 → 새로고침 유지
  5. OK 면 W12 → 🟢

- **서브페이지 1:1 대조**:
  1. `/ko/about` / `/services` / `/contact` / `/lawyers` / `/faq` 각각 열기
  2. https://tseng-law.com/ko/{같은 slug} 와 시각 대조
  3. 차이 있으면 해당 `legacy-page-bodies.tsx` 의 Body 함수 조정

---

## S-02 성과 요약

### 코드
1. **베이스라인 버그 7건 fix** (/ko 렌더 가능하게 만듦):
   - composite 서버 register (use client 분리)
   - reseed 게이트 force flag + site-page-seed 지원
   - 공개 페이지 flow 레이아웃 (top-level composite relative + auto height + minHeight)
   - body scroll lock 해제 (legacy popup CSS !important + MutationObserver)
   - composite wrapper overflow visible
   - seed height 넉넉화 + SEED_VERSION `home-seed-v4`
   - InsightsArchive slice(0,7) 제거 → 17 posts → 원본 1/6 pagination 일치

2. **슬롯 편집 MVP**:
   - `src/lib/builder/surface-context.tsx` — `BuilderSurfaceProvider` + `SurfaceText`
   - `store.ts` `selectedSurfaceKey` 추가, `setSelectedNodeId` 에서 reset
   - `composite/Render.tsx` — onClickCapture surface 감지, outline, 인라인 contentEditable (Enter/blur commit, Esc revert, store 는 commit 시점에만 갱신해서 React 가 DOM 안 건드림)
   - `SandboxInspectorPanel.tsx` — composite surface textarea (Content 탭 상단)
   - 9 홈 composite 에 SurfaceText 적용 (섹션 헤더만, 동적 items 제외)

3. **서브페이지 composite 전환** (Codex 워커):
   - `types.ts` 에 `legacy-page-*` 9 kind 추가
   - `legacy-page-bodies.tsx` — 9 legacy Body 함수 client-safe 추출
   - `seed-pages.ts` — 각 서브페이지 단일 composite (`site-page-seed-v2`), self-heal reseed, dup-slug cleanup
   - `composite/Render.tsx` switch 에 `legacy-page-*` 케이스 추가
   - `public-page.tsx` dup-slug → published/latest 우선

### 검증
- `npx tsc --noEmit` exit 0
- `curl /ko` → 9 composite, `/ko/{about,...,disclaimer}` 각 1 composite
- Inspector textarea 경로 user 확인
- 브라우저 full flow 검증 남음 (위 §검증 대기)

### Commits
- `65b1403` (Home composite publish + scroll + editor overflow fixes)
- `1244e12` (Slot editing MVP + sub-page composite conversion)

---

## 마스터 플랜 스코프 (SESSION 간 불변)

**에디터 1:1 패리티 + Motion 풀 세트 + Wix Bookings** (상담 예약)

체크포인트: W01~W225 (`/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md`)

### Phase 로드맵

| Phase | 범위 | W | 상태 |
|---|---|---|---|
| 0 | F0 메인 사이트 → 빌더 전환 | — | 🟢 홈 + 9 서브페이지 composite publish 완료 |
| 1 | 에디터 코어 + **슬롯 편집** | W01~W30 | 🟡 4/30 green, 슬롯 편집 인프라 완성 (커버리지 확장 남음) |
| 2 | 모바일 & 반응형 | W31~W45 | 🔴 |
| 3 | 위젯 라이브러리 70개 | W46~W135 | 🔴 |
| 4 | 폼 빌더 | W136~W150 | 🔴 |
| 5 | Motion | W151~W175 | 🔴 |
| 6 | 디자인 시스템 | W176~W185 | 🔴 |
| 7 | SEO/Publish maturity | W186~W195 | 🔴 |
| 8 | Wix Bookings | W196~W215 | 🔴 |
| 9 | 에디터 고도화 | W216~W225 | 🔴 |

---

## S-03 잠재 target (사용자 선택)

### Phase 1 커버리지 확장 (composite 내부 슬롯 편집 완성)
- **W03 verify + 확장** — 텍스트 인라인 편집을 dynamic 리스트 (service 6카드, FAQ 12, insights 7, offices 3, stats 4, attorney) 까지 확장. 각 items.map 내부에 동적 surfaceKey 부여 필요. 스키마/registry 재설계 필요. **Codex 발주 감 (1~2 세션)**.
- **W22/W23 이미지 편집** — 이미지 surface 클릭 시 asset library 열고 교체 + crop/alt 편집.
- **W25 폰트 피커** — 텍스트 surface 에 폰트 변경.
- **W24 컬러 피커** — 배경/텍스트 색 편집.

### Phase 1 에디터 코어 (개별 요소 편집)
- **W02 선택 핸들** — 모든 요소에 8 corner/edge handle + 회전 핸들.
- **W06 드래그 이동** — 선택 후 위치 이동, 스냅 가이드.
- **W07 리사이즈** — 코너 핸들 Shift=비율 유지.
- **W09 Delete/Backspace** — 선택 요소 삭제.
- **W10 Undo/Redo** — Ctrl+Z/Y.
- **W11 Autosave 인디케이터**.

### 진짜 Wix decomposer (큰 투자, 3~5 세션)
- 각 composite 을 여러 독립 builder 노드 (text/image/button/container) 로 쪼개는 파이프라인
- parentId + flex/grid container children 실제 동작 구현 (지금 "껍데기")
- 이후 사용자가 섹션 순서 바꾸기/삭제/새 섹션 추가 가능

---

## 금지 범위 (SESSION 간 불변)

- `git push --force`, `--no-verify`
- 브라우저 검증 없이 "Green" 선언
- `tree.ts` 건드림 (블랙박스)
- `node.rect` 를 절대 좌표로 다시 바꾸기
- 컴포지트 내부 이벤트 직접 핸들링 (overlay / surface-context 로만)
- SESSION.md 범위 밖 작업
- 계획이 계속 바뀌게 하는 충동적 피벗 — 사용자가 명시적으로 target W__ 를 바꾸지 않는 한 **선택된 W 만** 판다

---

## 중요 파일 위치

- **AGENTS.md**: `/Users/son7/Projects/tseng-law/AGENTS.md`
- **Wix 체크포인트**: `/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md` (W01~W225)
- **계획서**: `/Users/son7/Desktop/ai memory save 계획/사이트 빌더 계획서.md` (§16 Changelog)
- **Bookings 초안**: `/Users/son7/Desktop/ai memory save 계획/Bookings 데이터 모델 초안.md`
- **W02~W30 검증**: `/Users/son7/Desktop/ai memory save 계획/W02~W30 검증 가이드.md`
- **Phase 2 모바일**: `/Users/son7/Desktop/ai memory save 계획/Phase 2 모바일 스키마 초안.md`

---

## 핵심 코드 이정표

| 파일 | 역할 | 주의 |
|---|---|---|
| `src/lib/builder/canvas/seed-home.ts` | 9 composite seed + `SEED_VERSION = 'home-seed-v4'` | SEED bump 시 v5, v6... |
| `src/lib/builder/canvas/seed-pages.ts` | 9 서브페이지 seed + `updatedBy = 'site-page-seed-v2'` | 홈 seed 와 독립 |
| `src/lib/builder/canvas/types.ts` | `compositeComponentKeys` (9 홈 + 9 legacy-page-*) | kind 추가 시 여기 + composite/Render.tsx switch |
| `src/lib/builder/components/composite/index.tsx` | server register (`defineComponent`) | client 만들지 말 것 |
| `src/lib/builder/components/composite/Render.tsx` | `'use client'` — 9 홈 + 9 legacy Body 렌더 + 인라인 편집 contentEditable | |
| `src/lib/builder/surface-context.tsx` | `BuilderSurfaceProvider` + `SurfaceText` | 모든 SurfaceText 대상 컴포넌트는 여기서 import |
| `src/lib/builder/canvas/store.ts` | `selectedSurfaceKey` 추가됨 | `setSelectedNodeId` 호출 시 reset |
| `src/lib/builder/canvas/tree.ts` | `resolveCanvasNodeAbsoluteRect` / `resolveCanvasNodeLocalRect` | **블랙박스 — 건드리지 말 것** |
| `src/app/(builder)/[locale]/admin-builder/page.tsx` | reseed 로직 (force 플래그, legacy seed 탐지) | SEED_VERSION 과 동기 |
| `src/app/[locale]/[[...slug]]/page.tsx` | catch-all: published → legacy fallback | F0 엔트리 |
| `src/lib/builder/site/public-page.tsx` | 공개 페이지 렌더 — top-level composite flow, 나머지 absolute | |
| `src/app/[locale]/(legacy)/legacy-page-bodies.tsx` | 9 서브페이지 client-safe body | 원본 legacy*.tsx 에서 추출 |
| `src/components/HomeCaseResultsSplit.tsx` (등 9개) | SurfaceText 적용된 섹션 헤더 | dynamic items 확장 필요 |
| `src/components/builder/canvas/SandboxInspectorPanel.tsx` | Inspector — Content 탭 상단에 composite surface editor | |
| `src/components/builder/canvas/CanvasNode.tsx` | 에디터 노드 (Wix-click UX) | `isInteractive = !isDimmedRoot` |

---

## 역할 (AGENTS.md 동기)

- **Claude Opus = Manager / Architect**: SESSION 작성, 검수, 스펙 설계, 다음 Codex 프롬프트 초안, 세션 종료 문서 정리
- **Codex = Worker**: Manager 가 주는 프롬프트만 실행. 자기 주도 작업 금지
- **User 예외**: "너가 해줘" 하면 Manager 가 직접 코드도 씀 (이번 S-02 세션에도 그렇게 진행)

---

## 한줄 요약

"서브페이지 포함 전 페이지 composite publish + 슬롯 편집 MVP (Context + 인라인 contentEditable) 완성. S-03 은 브라우저 검증 → target W__ 확정 → 실행."
