# CODEX 발주 — Wave 2 / B2 Viewport-aware drag/resize

> **발행일**: 2026-05-01
> **선행**: Wave 1 B1 (`resolveCanvasNodeAbsoluteRectForViewport`, `cancelMutationSession`, `updateNodeRectsForViewport`)
> **분담**: 엔지니어 2 (Responsive Canvas) 단독.
> **충돌 회피**: `CanvasContainer.tsx`, `SandboxPage.tsx`는 이 트랙 단독 점유. C2 worker는 `CanvasNode.tsx`/`InlineTextEditor.tsx` 점유 — 같은 컴포넌트 트리지만 파일 분리됨.

---

## 1. 목적

B1에서 `responsive.<viewport>.rect` 저장 path와 viewport-aware geometry resolver를 만들었다. 그러나 실제 pointer drag/resize는 여전히 base `rect`만 본다. **이 PR은 CanvasContainer pointer 이벤트 흐름을 viewport rect로 바꿔서, tablet/mobile에서 드래그하면 desktop이 안 망가지도록 한다.**

체감 동작:
- desktop에서 노드 W=800/H=200 배치
- tablet 뷰로 전환 → 같은 노드를 드래그해 위치 변경
- desktop으로 돌아가면 W=800/H=200 그대로
- mobile에서 width 600 → 320으로 리사이즈해도 desktop 유지
- Esc 누르면 mutation 세션 취소 (B3에서 추가 작업 — 이 PR은 cancelMutationSession 호출만 wiring)

---

## 2. 작업 범위

### 2.1 CanvasContainer interaction state

`src/components/builder/canvas/CanvasContainer.tsx`:

interaction이 시작될 때(pointerdown on selection bbox / resize handle / drag handle):
- 현재 `viewport` (desktop/tablet/mobile)를 capture해서 mutation 세션에 박는다
- mutation 세션이 살아있는 동안 viewport가 바뀌면 → 즉시 `cancelMutationSession()`

```ts
const [activeViewport, setActiveViewport] = useState<Viewport | null>(null);

const beginPointerInteraction = (e: PointerEvent, kind: 'drag' | 'resize') => {
  setActiveViewport(currentViewport);
  store.beginMutationSession(); // existing
  // ...
};

useEffect(() => {
  if (activeViewport && activeViewport !== currentViewport) {
    store.cancelMutationSession();
    setActiveViewport(null);
  }
}, [currentViewport, activeViewport]);
```

### 2.2 hit-test / selection bbox / snap / clamp / drag ghost

이 모든 계산은 **base rect 대신 viewport absolute rect**를 사용:

```ts
// 변경 전
const absRect = resolveCanvasNodeAbsoluteRect(node, nodesById);
// 변경 후
const absRect = resolveCanvasNodeAbsoluteRectForViewport(
  node, nodesById, activeViewport ?? currentViewport
);
```

대상 함수/위치:
- pointer hit-test (어느 노드 클릭됐나)
- selection bbox 그리기
- snap edge 후보 수집
- clamp(부모 경계 안에 가두기)
- drag ghost overlay 위치
- 8 resize handle 위치

### 2.3 mutation commit: viewport 분기

drag/resize commit 시점에 활성 viewport에 따라 어디에 쓸지 분기:

```ts
const finalRectsById = computeFinalRects(/* ... */);

if (activeViewport === 'desktop') {
  store.updateNodeRects(finalRectsById, 'commit');
} else {
  store.updateNodeRectsForViewport(finalRectsById, activeViewport, 'commit');
}
```

`updateNodeRects()`는 base `rect`에 쓰고, `updateNodeRectsForViewport()`는 `responsive.<viewport>.rect`에 쓴다. 후자는 base `rect`를 절대로 수정하지 마.

### 2.4 non-desktop reparenting 차단

이 PR에선 tablet/mobile에서 드래그로 노드를 **다른 컨테이너에 이동시키는 것은 금지**한다:

- pointer up 시 hit-test 결과의 parentId가 바뀌면 → tablet/mobile일 때는 commit 거부 + 토스트 "Reparenting is desktop-only in this build"
- desktop에선 기존 동작 그대로

이유: 반응형 reparenting은 정의가 복잡해서 별도 트랙(B-future)에서 결정.

### 2.5 autosave 가드

`src/components/builder/canvas/SandboxPage.tsx`:

- mutation 세션이 살아있는 동안(=`mutationBaseDocument`가 있는 동안) autosave를 **일시정지**
- mutation commit 또는 cancel 시 autosave 재개
- 이미 store에 `mutationBaseDocument`가 있으니 SandboxPage에서 `useStore` 구독해서 autosave timer를 멈췄다 재개하면 됨

### 2.6 GlobalCanvasEditor / LightboxEditor

`src/components/builder/global/GlobalCanvasEditor.tsx` (header/footer canvas)와 `src/components/builder/lightbox/LightboxEditor.tsx`도 같은 viewport-aware drag/resize 적용. 두 컴포넌트는 `CanvasContainer`를 wrapping해서 쓰니까, container 안에서 viewport state를 받게 prop으로 넘기거나 zustand store에서 직접 읽게 해.

---

## 3. 파일

**수정**:
- `src/components/builder/canvas/CanvasContainer.tsx` — pointer interaction을 viewport-aware로
- `src/components/builder/canvas/SandboxPage.tsx` — autosave 가드 + viewport 컨텍스트 전달
- `src/components/builder/global/GlobalCanvasEditor.tsx` — 동일 적용
- `src/components/builder/lightbox/LightboxEditor.tsx` — 동일 적용

**신규**: 없음

---

## 4. 비범위 (이 PR에서 안 건드림)

- Esc cancel UI (B3에서)
- 반응형 reparenting (별도 트랙)
- 반응형 가시성 토글 / Hide on viewport (Phase 2 mobile schema 결정 후)
- 성능 최적화 (60fps 보장 등)

---

## 5. 검증

### 자동
```bash
npm run typecheck
npm run lint
npm run build
BUILDER_SMOKE_TIMEOUT_MS=30000 npm run smoke:builder
```

### 수동 manual (가장 중요)

각 단계마다 desktop으로 돌아와서 base rect 변경 없는지 확인:

1. 노드 하나 선택, desktop에서 위치 W=800 H=200 X=100 Y=100 기록
2. tablet 뷰로 전환, 같은 노드 드래그해서 X=200 Y=200으로 이동 + commit
3. desktop 뷰로 돌아옴 → 노드 위치가 X=100 Y=100 그대로여야 함
4. mobile 뷰로 전환, resize 핸들로 W=320 변경
5. desktop으로 돌아옴 → W=800 그대로
6. tablet 뷰에서 다른 노드를 끌어 다른 컨테이너로 이동 시도 → 거부 + 토스트
7. mobile 드래그 시작 → viewport를 desktop으로 즉시 전환 → mutation cancel + ghost 사라짐 + base rect unchanged

### diff inspect
```bash
# B1 함수가 hit-test/snap/clamp/ghost 코드에 import됐는지
rg -n 'resolveCanvasNodeAbsoluteRectForViewport\|updateNodeRectsForViewport\|cancelMutationSession' \
  src/components/builder/canvas/CanvasContainer.tsx \
  src/components/builder/canvas/SandboxPage.tsx \
  src/components/builder/global/ \
  src/components/builder/lightbox/
```

---

## 6. 검증 통과 기준

- 자동 게이트 모두 ✅
- 수동 manual 1~7 단계 모두 명시 동작
- desktop base rect는 어떤 시나리오에서도 mutate 안 됨 (단계 3·5에서 검증)
- viewport 전환 도중 drag/resize 진행 중이면 자동 cancel
- autosave는 mutation 도중 멈췄다가 commit 후 재개 (네트워크 탭에서 확인)

작업 끝나면 SESSION.md에 결과 한 줄 추가.
