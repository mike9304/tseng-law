# SESSION.md — 현재 세션 인수인계

## 세션: S-05 (Phase 1 W 녹색 스윕 — Codex 주도)
## 마지막 업데이트: 2026-04-18

---

## 🔥 컴퓨터 다시 켜면 바로 할 일

1. **이 파일 읽기** (SESSION.md)
2. **AGENTS.md 읽기**
3. **Wix 체크포인트.md 점수 확인** — 현재 🟢 **4 / 225**
4. **dev 서버 띄우기**: `cd /Users/son7/Projects/tseng-law && npm run dev`
5. **S-05 Codex 프롬프트 (§ 하단) 그대로 발주** → 결과 검수 → 사용자 브라우저 검증

---

## 목표 & target

**S-05 target**: Phase 1 W 체크포인트 8개 (W02, W03, W06, W07, W09, W10, W11, W12) 에 대해 코드 감사 + 버그픽스 + 브라우저 테스트 가이드 완성 → 가능한 한 많은 항목 녹색 승격.

**맥락**: S-04 끝에 홈 전체가 384 개 개별 builder 노드로 decompose 됨. 이제 각 노드에 대해:
- 선택 핸들 (W02)
- 인라인 편집 (W03)
- 드래그 이동 + 스냅 (W06)
- 리사이즈 (W07)
- 삭제 (W09)
- Undo/Redo (W10)
- Autosave 인디케이터 (W11)
- Inspector 탭 기본 동작 (W12)

이 모두 이론상 이미 구현돼 있다 (코드 기반 기능). 실제로 각 W 가 **브라우저에서 끝까지 돌고 새로고침 후 상태 유지**되는지 검증·버그픽스가 목표.

**예상 결과**: 녹색 4 → **10+** (최소 6 항목 승격 기대).

---

## 성공 기준 (녹색 조건, 각 W 별)

- **W02**: 임의 노드 (예: hero-title) 클릭 → 파란 테두리 + 8 corner/edge 핸들 (nw/n/ne/e/se/s/sw/w) 표시됨 + 회전 핸들 별도로 보임
- **W03**: 텍스트 노드 더블클릭 → 커서 + 키보드 입력 → 블러 or Enter → 내용 변경 저장 → 새로고침 유지
- **W06**: 노드 드래그 → 이동 + 스냅 가이드 선 표시 → 드롭 → 위치 저장 → 새로고침 유지
- **W07**: 선택 노드의 SE 코너 드래그 → 크기 조정 + Shift 누르면 비율 유지 → 저장 유지
- **W09**: 노드 선택 → Delete (또는 Backspace) → 노드 사라짐 → 새로고침 후 사라진 상태 유지
- **W10**: 편집 몇 번 → Ctrl/Cmd+Z 반복 → 롤백 → Ctrl/Cmd+Y → 복구
- **W11**: 편집하면 1초 뒤 "Draft saved" 토스트/인디케이터 "saving → saved" 상태 전환
- **W12**: 노드 선택 → 우측 Inspector 에 Layout / Style / Content 탭 3개 이상 표시, 각 탭 필드 편집 즉시 반영

---

## 금지 범위

- `tree.ts` 건드림
- `node.rect` 를 절대 좌표로 되돌리기
- 새 Phase 2+ 기능 추가 (모바일/위젯/Motion 등)
- S-04 까지의 decompose 구조 건드림 (seed-home.ts, decompose-*.ts 등)
- `git push --force`, `--no-verify`
- 브라우저 검증 없이 "Green" 선언
- **S-05 범위 밖 작업 금지.** 발견된 버그가 Phase 2+ 요구면 메모만 하고 넘김.

---

## Codex 발주 프롬프트 (S-05)

````
## 작업: Phase 1 W 체크포인트 감사 + 버그픽스 (홈 decompose 기준)

### 배경
S-04 끝에 홈 전체가 384개 개별 builder 노드로 decompose 됨 (`src/lib/builder/canvas/decompose-*.ts`, `seed-home.ts` SEED_VERSION `home-seed-v6`).
이제 Phase 1 에디터 코어 W01~W30 중 아래 8 개 항목이 실제로 브라우저에서 돌아가는지 감사 + 버그픽스 필요.

### 검증할 W (Wix 체크포인트.md 기준)

1. **W02 선택 핸들** — 어떤 요소든 클릭 시 8 corner/edge 핸들 + 회전 핸들
2. **W03 인라인 편집** — 텍스트 더블클릭 → 커서 → 키보드 → 저장
3. **W06 드래그 + 스냅** — 드래그 이동 + 스냅 가이드 선 + 위치 persist
4. **W07 리사이즈** — 코너 핸들 드래그 + Shift 비율 유지
5. **W09 Delete** — 선택 + Delete/Backspace 키 → 삭제
6. **W10 Undo/Redo** — Cmd/Ctrl+Z / Cmd/Ctrl+Shift+Z
7. **W11 Autosave** — 편집 후 saving → saved 인디케이터
8. **W12 Inspector 탭** — Layout/Style/Content 탭별 필드 편집

### 작업 절차

#### Phase A — 코드 감사
각 W 당 관련 코드 파일 열어 현재 구현 상태 확인. 각각 아래 세 가지로 분류:
- **OK**: 코드 있고 동작할 것으로 판단 → 사용자 브라우저 테스트 가이드에 추가
- **부분**: 코드 있으나 버그 의심 또는 가장자리 케이스 누락 → 버그픽스
- **없음**: 코드 부재 → 최소 구현 추가 (단, 범위 폭발 주의)

주요 파일:
- `src/components/builder/canvas/CanvasContainer.tsx` — 드래그/스냅/리사이즈/선택핸들/우클릭 메뉴/키보드 단축키
- `src/components/builder/canvas/CanvasNode.tsx` — 노드별 pointer 이벤트/핸들
- `src/components/builder/canvas/SandboxInspectorPanel.tsx` — Layout/Style/Content/A11y/Seo 탭
- `src/lib/builder/canvas/store.ts` — undo/redo, autosave 상태
- `src/components/builder/canvas/SandboxTopBar.tsx` — saving/saved 인디케이터
- `src/lib/builder/canvas/snap.ts` — 스냅 계산
- `src/lib/builder/components/text/Inspector.tsx` / `heading/Inspector.tsx` / `button/Inspector.tsx` / `container/Inspector.tsx` — Content 탭
- `src/components/builder/canvas/InlineTextEditor.tsx` — 인라인 편집기
- `src/components/builder/editor/StyleTab.tsx` — Style 탭

#### Phase B — 버그픽스
코드 감사에서 발견된 버그 고치기. 각 수정은 **개별 W 단위로 커밋 메시지 분리**.

가능한 버그 카테고리:
- W02: decompose 된 container 자식 노드의 선택 핸들이 부모 container 에 가려지는 문제 (z-index, overflow)
- W03: InlineTextEditor 가 decompose 된 text 노드 (className 있음) 에서 제대로 뜨는지
- W06: snap guide 가 child-of-container 좌표계 (local-to-parent) 와 stage 좌표계 변환 문제
- W07: container 의 자식 리사이즈 시 부모 경계 체크
- W09: parentId 있는 노드 삭제 시 자식까지 cascading 삭제 여부
- W10: 트랜잭션 단위 (drag 중 간계 mutation vs commit 시점)
- W11: 자동 저장 debounce 타이밍, 네트워크 에러 처리
- W12: Content 탭이 각 kind 별 올바른 Inspector 렌더하는지

범위 폭발 방지:
- W 하나당 **1~3개 파일 수정** 안에서 해결. 구조 리팩터 필요하면 포기하고 "W__ 부분 WIP" 로 리포트.
- 새 dependency 설치 금지.
- 실패한 W 는 🔴 로 두고 다른 W 로 넘어가기.

#### Phase C — 사용자 브라우저 테스트 가이드
각 W 마다 아래 형식으로 간단한 테스트 스크립트 생성:

```
### W02 테스트
1. /ko/admin-builder 접속 (admin / local-review-2026!)
2. 홈 hero 섹션의 "대만 법률을 한국어로 명확하게" 텍스트 클릭
3. 파란 테두리 + 8 corner/edge 핸들 + 회전 핸들 표시 확인
4. 결과: OK / 부분 (핸들 일부 누락) / 안 나옴
```

최종 리포트에 8 W × 테스트 스크립트 포함.

#### Phase D — Wix 체크포인트.md 업데이트
확정된 녹색만 🟢 로 변경 (사용자 브라우저 검증 대기 항목은 🟡 유지 + 주석 "S-05 코드 감사 OK, 브라우저 검증 대기"). 점수 총합 업데이트.

### 검증

1. `npx tsc --noEmit -p tsconfig.json` → exit 0
2. `curl -u admin:local-review-2026! http://localhost:3000/ko/admin-builder` → HTTP 200 (에디터 진입 회귀 없음)
3. `curl -u admin:local-review-2026! http://localhost:3000/ko` → builder-pub-node 384 (회귀 없음)
4. 각 W 버그픽스 후 해당 플로우 dev log 에 에러 없음

### 금지

- `src/lib/builder/canvas/tree.ts` 건드림
- `decompose-*.ts` / `seed-home.ts` 수정 (S-05 범위 밖)
- Phase 2+ 기능 추가 (W31 이상)
- 새 npm dependency 설치
- `git push --force`, `--no-verify`

### 리턴 포맷

1. W 별 상태 표:
   ```
   | W | 코드감사 | 버그픽스 | 예상판정 |
   | W02 | OK | - | 녹색 가능 |
   | W06 | 부분 | snap guide fix (line 400 CanvasContainer) | 녹색 가능 |
   | W10 | 없음 | 전체 구현 필요 | 🟡 유지 |
   ```
2. 커밋 목록 (W 별로 분리)
3. typecheck / curl 검증 결과
4. 사용자 브라우저 테스트 가이드 (위 Phase C 형식)
5. Wix 체크포인트.md 변경 diff
````

---

## 마스터 플랜 스코프 (SESSION 간 불변)

**에디터 1:1 패리티 + Motion 풀 세트 + Wix Bookings** (상담 예약)

체크포인트: W01~W225 (`/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md`)

### Phase 로드맵

| Phase | 범위 | W | 상태 |
|---|---|---|---|
| 0 | F0 메인 사이트 → 빌더 전환 | — | 🟢 홈 decompose 완료, 서브페이지는 1 composite 당 1 페이지 |
| 1 | 에디터 코어 + 슬롯 편집 | W01~W30 | 🟡 4/30 green, S-05 에서 10+ 목표 |
| 2~9 | 모바일/위젯/폼/Motion/Design/SEO/Bookings/고도화 | W31~W225 | 🔴 |

---

## 핵심 코드 이정표

| 파일 | 역할 | 최근 변경 |
|---|---|---|
| `src/lib/builder/canvas/seed-home.ts` | 홈 9 섹션 decompose seed, `SEED_VERSION='home-seed-v6'` | S-04-C |
| `src/lib/builder/canvas/decompose-{hero,insights,...,contact}.ts` | 섹션별 노드 트리 생성기 | S-04-C |
| `src/lib/builder/canvas/decompose-home-shared.ts` | 공통 노드 생성 헬퍼 | S-04-C |
| `src/lib/builder/canvas/decompose-case-results.ts` | 파일럿 decompose | S-03 |
| `src/lib/builder/components/container/Element.tsx` | children prop 렌더 | S-03 |
| `src/components/builder/canvas/elements/{TextElement,ButtonElement}.tsx` | className/as pass-through | S-03/S-04-N |
| `src/lib/builder/components/button/Inspector.tsx` | Label/Href/Target/Variant/As/className UI | S-04-N |
| `src/components/builder/canvas/CanvasContainer.tsx` | 드래그/스냅/선택핸들/우클릭, "링크 편집" 액션 | S-04-N |
| `src/components/builder/canvas/SandboxInspectorPanel.tsx` | 탭 + composite surface editor + focus-href-input listener | S-02/S-04-N |
| `src/lib/builder/canvas/tree.ts` | **블랙박스** | — |

---

## 역할

- **Claude Opus = Manager / Architect**: S-05 Codex 발주 감독, 결과 검수, 사용자 브라우저 테스트 가이드 전달
- **Codex = Worker**: S-05 W 감사 + 버그픽스 + 체크포인트 초안 (위 프롬프트 수행)
- **User**: 브라우저 테스트 + W 녹색 최종 승격 판정

---

## 한줄 요약

"홈이 384 노드로 decompose 된 상태에서 Phase 1 에디터 코어 (W02/W03/W06/W07/W09/W10/W11/W12) 가 실제로 돌아가는지 Codex 가 감사·버그픽스, 사용자가 브라우저로 최종 녹색 판정."
