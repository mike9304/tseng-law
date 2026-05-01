# CODEX 발주 — Wave 3 / B3 Esc Cancel during interaction

> **발행일**: 2026-05-01
> **선행**: Wave 1 B1 (mutationBaseDocument + cancelMutationSession), Wave 2 B2 (CanvasContainer pointer wiring)
> **분담**: 엔지니어 2 (Responsive Canvas) 단독.
> **충돌 회피**: `CanvasContainer.tsx`는 이 트랙 단독 점유. C3 worker는 SelectionToolbar.tsx만 건드림 — 충돌 X.

---

## 1. 목적

drag/resize/rotate 진행 중 사용자가 Esc 키 누르면 **mutation을 깔끔히 취소**하고 base document 복원. 현재는 Esc가 그대로 deselect로 fall-through해서 사용자가 잘못 끈 드래그를 되돌릴 수 없다.

체감 동작:
- 노드를 드래그 시작 → 위치 X=200까지 이동 (중간) → Esc 누름
- ghost 사라짐, 가이드 사라짐, hover 상태 사라짐
- 노드는 **드래그 시작 전 위치(X=100)로 복원**
- 선택 상태는 유지 (deselect 아님)
- 같은 시나리오를 resize/rotate에도 적용

---

## 2. 작업 범위

### 2.1 store 액션 강화

`src/lib/builder/canvas/store.ts`:

기존 `cancelMutationSession()`이 mutationBaseDocument를 그대로 store.document로 복원하는지 확인. 그렇지 않으면 강화:

```ts
cancelMutationSession: () => {
  const { mutationBaseDocument } = get();
  if (!mutationBaseDocument) return;
  set({
    document: mutationBaseDocument,
    mutationBaseDocument: null,
  });
}
```

(기존 wiring이 이미 이렇게 돼 있으면 변경 없음.)

### 2.2 CanvasContainer pointer 흐름

`src/components/builder/canvas/CanvasContainer.tsx`:

interaction 상태 (drag/resize/rotate 진행 중) 동안 **Esc keydown listener** 등록:

```tsx
useEffect(() => {
  if (!activeInteraction) return undefined;
  const handler = (e: KeyboardEvent) => {
    if (e.key !== 'Escape') return;
    e.preventDefault();
    e.stopPropagation();        // deselect로 fall-through 차단
    cancelMutationSession();
    setActiveInteraction(null);
    setActiveViewport(null);
    setGuides([]);
    setHoverState(null);
    setDragGhost(null);
  };
  window.addEventListener('keydown', handler, true);  // capture phase
  return () => window.removeEventListener('keydown', handler, true);
}, [activeInteraction, cancelMutationSession]);
```

**중요**: capture phase로 listen하고 stopPropagation. 그래야 같은 keydown이 deselect / shortcut handler로 도달하지 않음.

### 2.3 CanvasNode interaction state 정리

`src/components/builder/canvas/CanvasNode.tsx`:

mutation 도중 hover/visual feedback이 노드 단에 있다면 (e.g., `data-mutating` attr, drag opacity), `mutationBaseDocument === null` 상태에서 자동으로 정리되도록 dependent 처리. 보통 store 구독으로 자연 해결.

### 2.4 shortcuts.ts에 명시 등록 (선택)

`src/lib/builder/canvas/shortcuts.ts`:

기존 단축키 맵에 Esc가 등록돼 있으면 **interaction 도중에는 disable**되도록 분기. 또는 CanvasContainer의 capture-phase listener로 가로채기에 의존.

권장: capture-phase listener 우선, shortcuts.ts는 그대로 (deselect 등 평소 Esc 동작 유지).

---

## 3. 파일

**수정**:
- `src/components/builder/canvas/CanvasContainer.tsx` — Esc keydown listener (capture phase, interaction 중 활성)
- `src/components/builder/canvas/CanvasNode.tsx` — mutation visual cleanup (필요 시)
- `src/lib/builder/canvas/store.ts` — cancelMutationSession 동작 검증 (필요 시 강화)
- `src/lib/builder/canvas/shortcuts.ts` — Esc 행위 분기 (필요 시)

**신규**: 없음

---

## 4. 비범위

- Cmd+Z (undo)와 Esc 동작 분리 — undo는 commit된 mutation 되돌리기, Esc는 진행 중 mutation 취소. 이 PR은 후자.
- multi-step 드래그 (snap → reorder → 재배치) 중간 단계 취소
- Esc로 인한 모달/menu 닫기 (이미 다른 곳에서 처리)

---

## 5. 검증

### 자동
```bash
npm run typecheck
npm run lint
npm run build
BUILDER_SMOKE_TIMEOUT_MS=30000 npm run smoke:builder
```

### 수동 manual

가장 중요. 각 단계 후 노드 위치/사이즈가 시작값과 같은지 확인:

1. **Drag cancel**:
   - 노드 X=100 위치 기록
   - 드래그 시작 → X=300까지 끌고 가는 도중 Esc
   - ghost/가이드 사라짐
   - 노드 위치 X=100 그대로 (캔버스 + 인스펙터 모두 확인)
   - 노드는 여전히 selected

2. **Resize cancel**:
   - 노드 W=200 H=100 기록
   - resize 핸들로 W=500 H=300 끌고 가는 도중 Esc
   - 노드 W=200 H=100 그대로

3. **Rotate cancel** (rotation 기능 있으면):
   - 노드 rotation=0 기록
   - rotate 시작 → 45도까지 가는 도중 Esc
   - rotation=0 복원

4. **Tablet/mobile drag cancel** (B2와 통합):
   - tablet 뷰에서 노드 드래그 → Esc
   - desktop base rect 안 바뀜 (B2 invariant)
   - tablet override도 안 들어감

5. **Esc deselect 정상 동작 (회귀 X)**:
   - 노드 selected 상태에서 (interaction 없음) Esc → deselect 정상
   - 즉 interaction이 없을 때만 Esc가 deselect로 동작

### Diff inspect
```bash
rg -nE 'Escape|cancelMutationSession' src/components/builder/canvas/ src/lib/builder/canvas/
```

---

## 6. 검증 통과 기준

- 자동 게이트 모두 ✅
- 수동 1~5 모두 통과
- Esc capture-phase로 interaction 도중 deselect로 fall-through 안 함
- Esc는 selection 유지 (drag 시작 전 selected였다면 selected로 남음)
- B2 invariant 유지 (desktop rect 안 바뀜)

작업 끝나면 SESSION.md에 결과 한 줄.
