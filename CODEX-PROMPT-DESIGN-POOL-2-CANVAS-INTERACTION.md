# CODEX PROMPT — D-POOL-2: Canvas Direct-Manipulation Polish

&gt; **Track**: D-POOL-2 (Canvas Direct-Manipulation)
&gt; **Repo**: `/Users/son7/Projects/tseng-law`
&gt; **Goal**: Wix 본가 1:1 패리티 수준의 캔버스 직접조작 micro-interaction. Drag ghost, resize readout, multi-selection bbox, snap distance label을 **screen-coord 오버레이** 패턴으로 통일하고, in-stage 잔여물은 `--canvas-zoom` 1px-stable로 정리한다.
&gt; **Top-level constraints**: Zustand store는 손대지 않는다 (구독만). `snap.ts`는 변경 금지. SandboxPage 쉘 / Inspector / Picker / Modal / Public 위젯은 다른 트랙 소유 — 절대 건드리지 않는다.

---

## 0. 목표

1. 드래그 중 **원본 자리는 1px dashed outline**, 이동 위치는 **opacity 0.6 ghost**로 표시 (Wix 본가 패턴).
2. 리사이즈 중 **검정 배경 / 흰색 Mono 텍스트 픽셀 readout**(`320 × 200`)을 SE 코너에 표시.
3. 다중 선택 시 **union bounding box**를 1.5px solid blue + 8 핸들로 screen-coord 오버레이 렌더.
4. 드래그 중 **인접 노드와의 거리**를 `= 16px =` 더블 화살표 라벨로 시각화.
5. 모든 in-stage 가이드/박스(`AlignmentGuides`, `SelectionBox`)를 `--canvas-zoom` 변수로 1px-stable 유지(zoom 50% / 100% / 200% 모두 1px로 보임).
6. 기존 `interactionReadout`(rounded pill)·in-stage `dragGhost`·in-stage `multiSelectionBox` JSX를 **새 오버레이로 교체**한다.

---

## 1. 변경 대상 파일

### 신규 (새로 생성)

- `src/components/builder/canvas/DragGhost.tsx`
- `src/components/builder/canvas/ResizeReadout.tsx`
- `src/components/builder/canvas/MultiSelectionBoundingBox.tsx`
- `src/components/builder/canvas/SnapDistanceLabel.tsx`
- `src/components/builder/canvas/CanvasFeedbackOverlay.tsx` (4개 통합 wiring)

### 패치

- `src/components/builder/canvas/CanvasContainer.tsx`
  - `--canvas-zoom` CSS variable을 `.stageTransform` 인라인 스타일에 추가 (≈ line 1094).
  - 기존 in-stage `dragGhost` 렌더 블록 제거 (≈ lines 1214–1225).
  - 기존 in-stage `multiSelectionBox` 렌더 블록 제거 (≈ lines 1343–1358).
  - 기존 `canvasInteractionReadout` JSX 제거 (≈ lines 1443–1455). `interactionReadout` useMemo 자체는 남겨두고, `&lt;CanvasFeedbackOverlay&gt;`가 동일 정보를 ResizeReadout으로 재구성.
  - `&lt;CanvasFeedbackOverlay&gt;`를 `&lt;SelectionToolbar&gt;` 직전에 마운트.
  - `.stage` 루트 `&lt;div&gt;`에 `data-canvas-interaction={interaction?.type ?? 'idle'}` 추가 (≈ line 1097).
- `src/components/builder/canvas/CanvasNode.tsx`
  - hover outline 트랜지션 강화 (200ms ease).
  - 기존 `nodeSizeLabel`은 코드 그대로 두되, CSS 측 `data-canvas-interaction="resizing"` rule로 숨김 처리.
- `src/components/builder/canvas/AlignmentGuides.tsx`
  - 두께를 `calc(1px / var(--canvas-zoom, 1))`로 zoom-invariant 처리.
- `src/components/builder/canvas/SelectionBox.tsx`
  - 보더 두께 `calc(1px / var(--canvas-zoom, 1))`.
- `src/components/builder/canvas/SandboxPage.module.css`
  - 기존 `.dragGhost`, `.multiSelectionBox`, `.multiSelectionBadge`, `.canvasInteractionReadout`, `.canvasInteractionReadout strong`, `.canvasInteractionReadout span` 클래스 **삭제**.
  - 신규 `.canvasOverlay*` namespace 추가.
  - `.stage[data-canvas-interaction="resizing"] .nodeSizeLabel { display: none; }` rule 추가.

### 절대 금지 (다른 트랙 소유)

- `src/components/builder/canvas/SandboxPage.tsx` (D-POOL-1)
- `SandboxInspectorPanel.tsx`, `SelectionToolbar.tsx`, `ContextMenu.tsx` (D-POOL-3)
- `*Modal.tsx` 일체 (D-POOL-4)
- `LinkPicker.tsx`, `LayerSearchInput.tsx`, `PageSwitcher.tsx` (D-POOL-5)
- `src/components/builder/canvas/elements/**` (D-POOL-6 — public 위젯)
- `src/lib/builder/canvas/store.ts` 수정 금지 (구독만 허용)
- `src/lib/builder/canvas/snap.ts` 수정 금지

---

## 2. 핵심 아키텍처 결정

### 2-1. Screen-coord 오버레이 레이어

CanvasContainer는 두 좌표계를 가진다.

1. **Stage-coord**: `.stageTransform` 내부. `transform: translate(panX, panY) scale(zoom)`이 적용됨. `AlignmentGuides`, `SelectionBox`, 노드 본체는 여기 산다.
2. **Screen-coord**: `.stageTransform` **밖** (= `.stageViewport` 직속 자식). 줌/팬 변환의 영향을 받지 않는다. `&lt;SelectionToolbar&gt;`(line 1396), 기존 `canvasInteractionReadout`(line 1443)이 이미 이 패턴이다.

본 트랙에서 도입하는 4개 오버레이(DragGhost / ResizeReadout / MultiSelectionBoundingBox / SnapDistanceLabel)는 **모두 Screen-coord**로 산다. Stage rect → Screen rect 변환은 line 1030의 `selectionBboxScreen` 패턴 그대로 사용한다.

~~~ts
// 기존 패턴 (CanvasContainer.tsx:1030)
const selectionBboxScreen = useMemo(() =&gt; {
  if (!selectionBboxStage) return null;
  return {
    x: selectionBboxStage.x * zoomState.zoom + zoomState.panX,
    y: selectionBboxStage.y * zoomState.zoom + zoomState.panY,
    width: selectionBboxStage.width * zoomState.zoom,
    height: selectionBboxStage.height * zoomState.zoom,
  };
}, [selectionBboxStage, zoomState.panX, zoomState.panY, zoomState.zoom]);
~~~

오버레이는 stage transform 밖에 있으므로 보더 두께 1px이 항상 1px로 보인다 — zoom-invariant.

### 2-2. interaction은 CanvasContainer 로컬 state

`useState&lt;InteractionState&gt;(null)` (line 192) 그대로 사용. Zustand에 추가하지 않는다. `CanvasFeedbackOverlay`는 `interaction` 객체와 `absoluteRectById`, `zoomState` 등 props로 모두 주입받는다.

### 2-3. "원본 outline + 현재 위치 ghost" 두 단계 구성

스펙은 "원본 자리 1px dashed outline + 이동 위치 opacity 0.6 ghost"이다.

- **원본 outline rect**: `interaction.startAbsoluteRects` (move) / `interaction.startAbsoluteRect` (resize) — 이미 line 996–1005 `dragGhostRects` 메모가 사용한다. Codex는 동일 소스를 사용한다.
- **현재 위치 ghost rect**: `absoluteRectById.get(nodeId)`. 스토어가 드래그 세션 중에 rect를 mutate하기 때문에 라이브 값이다. 추가 state 트래킹 불필요.

따라서 `&lt;DragGhost&gt;`는 `startRects`(원본 outline용)와 `currentRects`(ghost용) 두 셋을 받는다.

### 2-4. nodeSizeLabel 숨김

`.stage`에 `data-canvas-interaction={interaction?.type ?? 'idle'}` 속성을 부여하고, CSS에서 `.stage[data-canvas-interaction="resizing"] .nodeSizeLabel { display: none; }`로 숨긴다. CanvasNode에 prop drilling 안 함.

### 2-5. AlignmentGuides / SelectionBox는 in-stage 유지 + 1px-stable

이 둘은 stage transform 안에 살아야 가이드 위치가 맞다(노드와 같은 좌표계). 하지만 두께는 zoom에 따라 가변이므로 `--canvas-zoom`을 `.stageTransform`에 부여하고 보더/배경 stripe를 `calc(1px / var(--canvas-zoom, 1))`로 표현한다.

### 2-6. SnapDistanceLabel은 자체 nearest-neighbor 알고리즘

`snap.ts`는 절대 수정 금지(다른 코드가 의존). `SnapDistanceLabel`은 자체 로직으로 **활성 노드의 4면(좌/우/상/하) 가장 가까운 이웃**을 찾고, 투영 범위(orthogonal range)가 겹칠 때만 라벨을 그린다. 임계값은 64px (이보다 멀면 noise). 거리 0(완전 겹침)은 그리지 않는다.

---

## 3. 신규 컴포넌트 (전체 코드 inline)

### 3-1. `src/components/builder/canvas/DragGhost.tsx`

~~~tsx
'use client';

import type { Rect } from '@/lib/builder/canvas/snap';
import styles from './SandboxPage.module.css';

interface DragGhostProps {
  startRects: Rect[];
  currentRects: Rect[];
  zoom: number;
  panX: number;
  panY: number;
  mode: 'move' | 'resize' | null;
}

function toScreen(rect: Rect, zoom: number, panX: number, panY: number) {
  return {
    left: rect.x * zoom + panX,
    top: rect.y * zoom + panY,
    width: rect.width * zoom,
    height: rect.height * zoom,
  };
}

export default function DragGhost({
  startRects,
  currentRects,
  zoom,
  panX,
  panY,
  mode,
}: DragGhostProps) {
  if (!mode) return null;
  if (startRects.length === 0) return null;

  return (
    &lt;&gt;
      {startRects.map((rect, index) =&gt; {
        const s = toScreen(rect, zoom, panX, panY);
        return (
          &lt;div
            key={`origin-${index}`}
            className={styles.canvasOverlayDragOrigin}
            style={{
              left: `${s.left}px`,
              top: `${s.top}px`,
              width: `${s.width}px`,
              height: `${s.height}px`,
            }}
            aria-hidden
          /&gt;
        );
      })}

      {mode === 'move' &amp;&amp;
        currentRects.map((rect, index) =&gt; {
          const s = toScreen(rect, zoom, panX, panY);
          return (
            &lt;div
              key={`ghost-${index}`}
              className={styles.canvasOverlayDragGhost}
              style={{
                left: `${s.left}px`,
                top: `${s.top}px`,
                width: `${s.width}px`,
                height: `${s.height}px`,
              }}
              aria-hidden
            /&gt;
          );
        })}
    &lt;/&gt;
  );
}
~~~

### 3-2. `src/components/builder/canvas/ResizeReadout.tsx`

~~~tsx
'use client';

import type { Rect } from '@/lib/builder/canvas/snap';
import styles from './SandboxPage.module.css';

interface ResizeReadoutProps {
  currentRect: Rect | null;
  zoom: number;
  panX: number;
  panY: number;
}

export default function ResizeReadout({
  currentRect,
  zoom,
  panX,
  panY,
}: ResizeReadoutProps) {
  if (!currentRect) return null;

  const screenRight = (currentRect.x + currentRect.width) * zoom + panX;
  const screenBottom = (currentRect.y + currentRect.height) * zoom + panY;

  const left = screenRight + 8;
  const top = screenBottom + 8;

  const w = Math.round(currentRect.width);
  const h = Math.round(currentRect.height);

  return (
    &lt;div
      className={styles.canvasOverlayResizeReadout}
      style={{ left: `${left}px`, top: `${top}px` }}
      aria-live="polite"
    &gt;
      {w} &lt;span className={styles.canvasOverlayResizeReadoutTimes}&gt;×&lt;/span&gt; {h}
    &lt;/div&gt;
  );
}
~~~

### 3-3. `src/components/builder/canvas/MultiSelectionBoundingBox.tsx`

~~~tsx
'use client';

import styles from './SandboxPage.module.css';

interface MultiSelectionBoundingBoxProps {
  bbox: { x: number; y: number; width: number; height: number } | null;
  selectedCount: number;
}

const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as const;

export default function MultiSelectionBoundingBox({
  bbox,
  selectedCount,
}: MultiSelectionBoundingBoxProps) {
  if (!bbox || selectedCount &lt; 2) return null;

  return (
    &lt;div
      className={styles.canvasOverlayMultiBbox}
      style={{
        left: `${bbox.x}px`,
        top: `${bbox.y}px`,
        width: `${bbox.width}px`,
        height: `${bbox.height}px`,
      }}
      aria-hidden
    &gt;
      &lt;span className={styles.canvasOverlayMultiBboxBadge}&gt;
        {selectedCount} selected · {Math.round(bbox.width)} × {Math.round(bbox.height)}
      &lt;/span&gt;
      {HANDLES.map((h) =&gt; (
        &lt;span
          key={h}
          className={`${styles.canvasOverlayMultiBboxHandle} ${
            styles[`canvasOverlayMultiBboxHandle_${h}`]
          }`}
          aria-hidden
        /&gt;
      ))}
    &lt;/div&gt;
  );
}
~~~

### 3-4. `src/components/builder/canvas/SnapDistanceLabel.tsx`

~~~tsx
'use client';

import { useMemo } from 'react';
import type { Rect } from '@/lib/builder/canvas/snap';
import styles from './SandboxPage.module.css';

interface SnapDistanceLabelProps {
  activeRect: Rect | null;
  otherRects: Rect[];
  zoom: number;
  panX: number;
  panY: number;
  enabled: boolean;
}

const SHOW_THRESHOLD_PX = 64;

interface DistanceMeasurement {
  axis: 'horizontal' | 'vertical';
  from: { x: number; y: number };
  to: { x: number; y: number };
  distance: number;
}

function computeDistances(active: Rect, others: Rect[]): DistanceMeasurement[] {
  const result: DistanceMeasurement[] = [];

  const aLeft = active.x;
  const aRight = active.x + active.width;
  const aTop = active.y;
  const aBottom = active.y + active.height;
  const aMidX = active.x + active.width / 2;
  const aMidY = active.y + active.height / 2;

  let rightBest: { rect: Rect; gap: number } | null = null;
  for (const o of others) {
    const oLeft = o.x;
    const oTop = o.y;
    const oBottom = o.y + o.height;
    const verticalOverlap = oBottom &gt; aTop &amp;&amp; oTop &lt; aBottom;
    if (!verticalOverlap) continue;
    if (oLeft &lt; aRight) continue;
    const gap = oLeft - aRight;
    if (gap &lt;= 0 || gap &gt; SHOW_THRESHOLD_PX) continue;
    if (!rightBest || gap &lt; rightBest.gap) rightBest = { rect: o, gap };
  }
  if (rightBest) {
    result.push({
      axis: 'horizontal',
      from: { x: aRight, y: aMidY },
      to: { x: aRight + rightBest.gap, y: aMidY },
      distance: rightBest.gap,
    });
  }

  let leftBest: { rect: Rect; gap: number } | null = null;
  for (const o of others) {
    const oRight = o.x + o.width;
    const oTop = o.y;
    const oBottom = o.y + o.height;
    const verticalOverlap = oBottom &gt; aTop &amp;&amp; oTop &lt; aBottom;
    if (!verticalOverlap) continue;
    if (oRight &gt; aLeft) continue;
    const gap = aLeft - oRight;
    if (gap &lt;= 0 || gap &gt; SHOW_THRESHOLD_PX) continue;
    if (!leftBest || gap &lt; leftBest.gap) leftBest = { rect: o, gap };
  }
  if (leftBest) {
    result.push({
      axis: 'horizontal',
      from: { x: aLeft - leftBest.gap, y: aMidY },
      to: { x: aLeft, y: aMidY },
      distance: leftBest.gap,
    });
  }

  let bottomBest: { rect: Rect; gap: number } | null = null;
  for (const o of others) {
    const oTop = o.y;
    const oLeft = o.x;
    const oRight = o.x + o.width;
    const horizontalOverlap = oRight &gt; aLeft &amp;&amp; oLeft &lt; aRight;
    if (!horizontalOverlap) continue;
    if (oTop &lt; aBottom) continue;
    const gap = oTop - aBottom;
    if (gap &lt;= 0 || gap &gt; SHOW_THRESHOLD_PX) continue;
    if (!bottomBest || gap &lt; bottomBest.gap) bottomBest = { rect: o, gap };
  }
  if (bottomBest) {
    result.push({
      axis: 'vertical',
      from: { x: aMidX, y: aBottom },
      to: { x: aMidX, y: aBottom + bottomBest.gap },
      distance: bottomBest.gap,
    });
  }

  let topBest: { rect: Rect; gap: number } | null = null;
  for (const o of others) {
    const oBottom = o.y + o.height;
    const oLeft = o.x;
    const oRight = o.x + o.width;
    const horizontalOverlap = oRight &gt; aLeft &amp;&amp; oLeft &lt; aRight;
    if (!horizontalOverlap) continue;
    if (oBottom &gt; aTop) continue;
    const gap = aTop - oBottom;
    if (gap &lt;= 0 || gap &gt; SHOW_THRESHOLD_PX) continue;
    if (!topBest || gap &lt; topBest.gap) topBest = { rect: o, gap };
  }
  if (topBest) {
    result.push({
      axis: 'vertical',
      from: { x: aMidX, y: aTop - topBest.gap },
      to: { x: aMidX, y: aTop },
      distance: topBest.gap,
    });
  }

  return result;
}

export default function SnapDistanceLabel({
  activeRect,
  otherRects,
  zoom,
  panX,
  panY,
  enabled,
}: SnapDistanceLabelProps) {
  const measurements = useMemo(() =&gt; {
    if (!enabled || !activeRect) return [];
    return computeDistances(activeRect, otherRects);
  }, [enabled, activeRect, otherRects]);

  if (measurements.length === 0) return null;

  return (
    &lt;&gt;
      {measurements.map((m, i) =&gt; {
        const fromScreen = {
          x: m.from.x * zoom + panX,
          y: m.from.y * zoom + panY,
        };
        const toScreen = {
          x: m.to.x * zoom + panX,
          y: m.to.y * zoom + panY,
        };
        const midScreen = {
          x: (fromScreen.x + toScreen.x) / 2,
          y: (fromScreen.y + toScreen.y) / 2,
        };
        const length = m.axis === 'horizontal'
          ? toScreen.x - fromScreen.x
          : toScreen.y - fromScreen.y;

        return (
          &lt;div
            key={`snap-dist-${i}`}
            className={styles.canvasOverlaySnapDistanceWrapper}
            style={{
              left: `${m.axis === 'horizontal' ? fromScreen.x : fromScreen.x - 0.5}px`,
              top: `${m.axis === 'horizontal' ? fromScreen.y - 0.5 : fromScreen.y}px`,
              width: m.axis === 'horizontal' ? `${length}px` : '1px',
              height: m.axis === 'vertical' ? `${length}px` : '1px',
            }}
            aria-hidden
          &gt;
            &lt;svg
              className={styles.canvasOverlaySnapDistanceLine}
              width={m.axis === 'horizontal' ? length : 1}
              height={m.axis === 'vertical' ? length : 1}
              viewBox={
                m.axis === 'horizontal'
                  ? `0 0 ${Math.max(length, 1)} 1`
                  : `0 0 1 ${Math.max(length, 1)}`
              }
              preserveAspectRatio="none"
            &gt;
              {m.axis === 'horizontal' ? (
                &lt;line x1="0" y1="0.5" x2={length} y2="0.5" /&gt;
              ) : (
                &lt;line x1="0.5" y1="0" x2="0.5" y2={length} /&gt;
              )}
            &lt;/svg&gt;
            &lt;span
              className={styles.canvasOverlaySnapDistanceLabel}
              style={{
                left: m.axis === 'horizontal'
                  ? `${midScreen.x - fromScreen.x}px`
                  : '50%',
                top: m.axis === 'vertical'
                  ? `${midScreen.y - fromScreen.y}px`
                  : '50%',
              }}
            &gt;
              {Math.round(m.distance)}px
            &lt;/span&gt;
          &lt;/div&gt;
        );
      })}
    &lt;/&gt;
  );
}
~~~

### 3-5. `src/components/builder/canvas/CanvasFeedbackOverlay.tsx` (통합 wiring)

~~~tsx
'use client';

import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { Rect } from '@/lib/builder/canvas/snap';
import DragGhost from './DragGhost';
import ResizeReadout from './ResizeReadout';
import MultiSelectionBoundingBox from './MultiSelectionBoundingBox';
import SnapDistanceLabel from './SnapDistanceLabel';

export type CanvasInteractionType = 'move' | 'resize' | 'pan' | null;

interface CanvasFeedbackOverlayProps {
  interactionType: CanvasInteractionType;
  activeNodeIds: string[];
  startAbsoluteRects: Rect[];
  absoluteRectById: Map&lt;string, Rect&gt;;
  allVisibleNodes: BuilderCanvasNode[];
  multiSelectionBboxScreen:
    | { x: number; y: number; width: number; height: number }
    | null;
  selectedCount: number;
  zoom: number;
  panX: number;
  panY: number;
}

export default function CanvasFeedbackOverlay({
  interactionType,
  activeNodeIds,
  startAbsoluteRects,
  absoluteRectById,
  allVisibleNodes,
  multiSelectionBboxScreen,
  selectedCount,
  zoom,
  panX,
  panY,
}: CanvasFeedbackOverlayProps) {
  const currentRects: Rect[] = [];
  for (const id of activeNodeIds) {
    const rect = absoluteRectById.get(id);
    if (rect) currentRects.push(rect);
  }

  const dragMode: 'move' | 'resize' | null =
    interactionType === 'move' || interactionType === 'resize'
      ? interactionType
      : null;

  const resizePrimaryRect =
    interactionType === 'resize' &amp;&amp; currentRects[0] ? currentRects[0] : null;

  const snapActiveRect =
    (interactionType === 'move' || interactionType === 'resize') &amp;&amp;
    currentRects[0]
      ? currentRects[0]
      : null;

  const snapOtherRects: Rect[] = [];
  if (snapActiveRect) {
    const activeIdSet = new Set(activeNodeIds);
    for (const node of allVisibleNodes) {
      if (activeIdSet.has(node.id)) continue;
      const r = absoluteRectById.get(node.id);
      if (r) snapOtherRects.push(r);
    }
  }

  return (
    &lt;&gt;
      &lt;DragGhost
        startRects={startAbsoluteRects}
        currentRects={currentRects}
        zoom={zoom}
        panX={panX}
        panY={panY}
        mode={dragMode}
      /&gt;
      &lt;ResizeReadout
        currentRect={resizePrimaryRect}
        zoom={zoom}
        panX={panX}
        panY={panY}
      /&gt;
      &lt;SnapDistanceLabel
        activeRect={snapActiveRect}
        otherRects={snapOtherRects}
        zoom={zoom}
        panX={panX}
        panY={panY}
        enabled={dragMode !== null}
      /&gt;
      {!dragMode &amp;&amp; (
        &lt;MultiSelectionBoundingBox
          bbox={multiSelectionBboxScreen}
          selectedCount={selectedCount}
        /&gt;
      )}
    &lt;/&gt;
  );
}
~~~

---

## 4. 기존 파일 패치 (디프)

### 4-1. `CanvasContainer.tsx`

#### (a) import 추가 — 파일 상단

~~~tsx
import CanvasFeedbackOverlay from '@/components/builder/canvas/CanvasFeedbackOverlay';
~~~

#### (b) `.stageTransform` 인라인 스타일에 `--canvas-zoom` 부여 (≈ line 1091-1095)

**Before**:
~~~tsx
&lt;div
  className={styles.stageTransform}
  style={{
    transform: `translate(${zoomState.panX}px, ${zoomState.panY}px) scale(${zoomState.zoom})`,
  }}
&gt;
~~~

**After**:
~~~tsx
&lt;div
  className={styles.stageTransform}
  style={{
    transform: `translate(${zoomState.panX}px, ${zoomState.panY}px) scale(${zoomState.zoom})`,
    ['--canvas-zoom' as string]: String(zoomState.zoom),
  } as React.CSSProperties}
&gt;
~~~

#### (c) `.stage` 루트 div에 `data-canvas-interaction` 추가 (≈ line 1097-1103)

~~~tsx
&lt;div
  ref={containerRef}
  className={styles.stage}
  data-canvas-interaction={interaction?.type ?? 'idle'}
  style={{ width: `${stageWidth}px`, height: `${stageHeight}px` }}
  role="application"
  aria-label="Canvas editor"
  aria-roledescription="freeform canvas"
~~~

#### (d) 기존 in-stage `dragGhostRects.map(...)` 블록 제거 (≈ lines 1214-1225)

`dragGhostRects` useMemo 자체(line 996-1005)는 **유지** — `CanvasFeedbackOverlay`에 `startAbsoluteRects` prop으로 전달.

#### (e) 기존 in-stage `selectionBboxStage` 다중 선택 박스 제거 (≈ lines 1343-1358)

`selectionBboxStage` / `selectionBboxScreen` useMemo (line 1012-1038)는 유지.

#### (f) 기존 `canvasInteractionReadout` JSX 제거 (≈ lines 1443-1455) + `interactionReadout` useMemo(line 1040-1076) 삭제

`ResizeReadout`이 동일 책임을 더 정확한 사양으로 대체.

#### (g) `&lt;CanvasFeedbackOverlay&gt;` 마운트 — `&lt;SelectionToolbar&gt;` **직전**에 추가 (≈ line 1396)

~~~tsx
&lt;CanvasFeedbackOverlay
  interactionType={interaction?.type === 'pan' ? null : (interaction?.type ?? null)}
  activeNodeIds={
    interaction?.type === 'move'
      ? interaction.nodeIds
      : interaction?.type === 'resize'
        ? [interaction.nodeId]
        : []
  }
  startAbsoluteRects={
    interaction?.type === 'move'
      ? Object.values(interaction.startAbsoluteRects)
      : interaction?.type === 'resize'
        ? [interaction.startAbsoluteRect]
        : []
  }
  absoluteRectById={absoluteRectById}
  allVisibleNodes={visibleNodes}
  multiSelectionBboxScreen={selectionBboxScreen}
  selectedCount={selectedNodes.length}
  zoom={zoomState.zoom}
  panX={zoomState.panX}
  panY={zoomState.panY}
/&gt;
~~~

### 4-2. `CanvasNode.tsx`

기능 변경은 거의 없다. hover transition 강화는 CSS만 (4-5 참고).

### 4-3. `AlignmentGuides.tsx` — 1px-stable 보더 (전체 교체)

~~~tsx
'use client';

import type { AlignmentGuide } from '@/lib/builder/canvas/snap';

interface AlignmentGuidesProps {
  guides: AlignmentGuide[];
}

const STROKE = 'calc(1px / var(--canvas-zoom, 1))';

export default function AlignmentGuides({ guides }: AlignmentGuidesProps) {
  if (guides.length === 0) return null;

  return (
    &lt;&gt;
      {guides.map((g, i) =&gt; {
        const key = `${g.axis}-${g.position}-${i}`;
        if (g.axis === 'vertical') {
          return (
            &lt;div
              key={key}
              style={{
                position: 'absolute',
                left: g.position,
                top: g.from,
                width: STROKE,
                height: g.to - g.from,
                backgroundColor: '#ef4444',
                pointerEvents: 'none',
                zIndex: 9999,
              }}
            /&gt;
          );
        }
        return (
          &lt;div
            key={key}
            style={{
              position: 'absolute',
              left: g.from,
              top: g.position,
              width: g.to - g.from,
              height: STROKE,
              backgroundColor: '#ef4444',
              pointerEvents: 'none',
              zIndex: 9999,
            }}
          /&gt;
        );
      })}
    &lt;/&gt;
  );
}
~~~

### 4-4. `SelectionBox.tsx` — 1px-stable 보더 (전체 교체)

~~~tsx
'use client';

import styles from './SandboxPage.module.css';

export default function SelectionBox({
  left,
  top,
  width,
  height,
}: {
  left: number;
  top: number;
  width: number;
  height: number;
}) {
  return (
    &lt;div
      className={styles.selectionBox}
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        ['borderWidth' as string]: 'calc(1px / var(--canvas-zoom, 1))',
      } as React.CSSProperties}
    /&gt;
  );
}
~~~

### 4-5. `SandboxPage.module.css` 패치

#### (a) 삭제할 클래스

- `.dragGhost` — line 1341 부근 (10줄)
- `.multiSelectionBox` — line 991 부근 (13줄)
- `.multiSelectionBadge` — line 1005 부근 (20줄)
- `.canvasInteractionReadout` 일가 — line 1026 부근
- `@keyframes ghostPulse` — `.dragGhost` 직후

#### (b) `.selectionBox` 패치 (line 982-989)

~~~css
.selectionBox {
  position: absolute;
  border-style: dashed;
  border-color: rgba(37, 99, 235, 0.8);
  /* border-width: 인라인 calc(1px / var(--canvas-zoom)) */
  background: rgba(37, 99, 235, 0.08);
  box-shadow: inset 0 0 0 1px rgba(147, 197, 253, 0.45);
  pointer-events: none;
  z-index: 2;
}
~~~

#### (c) hover transition 강화 (line 1331)

~~~css
.node {
  transition: box-shadow 200ms ease, outline-color 200ms ease;
}

.node:hover:not(.nodeSelected) {
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.35), 0 12px 28px rgba(15, 23, 42, 0.08);
}
~~~

#### (d) `nodeSizeLabel` 숨김

~~~css
.stage[data-canvas-interaction="resizing"] .nodeSizeLabel {
  display: none;
}
~~~

#### (e) 신규 `.canvasOverlay*` 클래스 추가

~~~css
/* === D-POOL-2 Canvas Overlay (screen-coord, zoom-invariant) === */

.canvasOverlayDragOrigin {
  position: absolute;
  border: 1px dashed rgba(110, 130, 255, 0.6);
  background: transparent;
  border-radius: 8px;
  pointer-events: none;
  z-index: 9994;
}

.canvasOverlayDragGhost {
  position: absolute;
  border: 1px solid rgba(17, 109, 255, 0.6);
  background: rgba(17, 109, 255, 0.12);
  border-radius: 8px;
  opacity: 0.6;
  pointer-events: none;
  z-index: 9995;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.18);
}

.canvasOverlayResizeReadout {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(15, 23, 42, 0.95);
  color: #ffffff;
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", "Menlo", "Consolas", monospace;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.01em;
  white-space: nowrap;
  pointer-events: none;
  z-index: 9999;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.35);
}

.canvasOverlayResizeReadoutTimes {
  opacity: 0.7;
  margin: 0 1px;
}

.canvasOverlayMultiBbox {
  position: absolute;
  border: 1.5px solid rgba(17, 109, 255, 0.92);
  background: transparent;
  border-radius: 2px;
  pointer-events: none;
  z-index: 9996;
}

.canvasOverlayMultiBboxBadge {
  position: absolute;
  top: -28px;
  left: 0;
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 4px;
  background: rgba(15, 23, 42, 0.95);
  color: #eff6ff;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  pointer-events: none;
}

.canvasOverlayMultiBboxHandle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #ffffff;
  border: 1.5px solid rgba(17, 109, 255, 0.92);
  border-radius: 1px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.2);
  pointer-events: none;
}

.canvasOverlayMultiBboxHandle_nw { top: -5px; left: -5px; cursor: nwse-resize; }
.canvasOverlayMultiBboxHandle_n  { top: -5px; left: calc(50% - 4px); cursor: ns-resize; }
.canvasOverlayMultiBboxHandle_ne { top: -5px; right: -5px; cursor: nesw-resize; }
.canvasOverlayMultiBboxHandle_e  { top: calc(50% - 4px); right: -5px; cursor: ew-resize; }
.canvasOverlayMultiBboxHandle_se { bottom: -5px; right: -5px; cursor: nwse-resize; }
.canvasOverlayMultiBboxHandle_s  { bottom: -5px; left: calc(50% - 4px); cursor: ns-resize; }
.canvasOverlayMultiBboxHandle_sw { bottom: -5px; left: -5px; cursor: nesw-resize; }
.canvasOverlayMultiBboxHandle_w  { top: calc(50% - 4px); left: -5px; cursor: ew-resize; }

.canvasOverlaySnapDistanceWrapper {
  position: absolute;
  pointer-events: none;
  z-index: 9993;
}

.canvasOverlaySnapDistanceLine {
  position: absolute;
  inset: 0;
  stroke: rgba(255, 70, 110, 0.92);
  stroke-width: 1;
  shape-rendering: crispEdges;
}

.canvasOverlaySnapDistanceLine line {
  stroke: rgba(255, 70, 110, 0.92);
  stroke-width: 1;
}

.canvasOverlaySnapDistanceLabel {
  position: absolute;
  transform: translate(-50%, -50%);
  display: inline-flex;
  align-items: center;
  height: 18px;
  padding: 0 6px;
  border-radius: 3px;
  background: rgba(255, 70, 110, 0.95);
  color: #ffffff;
  font-family: ui-monospace, "SF Mono", "JetBrains Mono", "Menlo", "Consolas", monospace;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  letter-spacing: 0.02em;
}

.canvasOverlaySnapDistanceLabel::before,
.canvasOverlaySnapDistanceLabel::after {
  content: '=';
  display: inline-block;
  margin: 0 4px;
  opacity: 0.85;
}
~~~

---

## 5. 디자인 토큰

~~~css
.stageSurface {
  --canvas-overlay-blue: rgba(17, 109, 255, 0.92);
  --canvas-overlay-blue-soft: rgba(110, 130, 255, 0.6);
  --canvas-overlay-pink: rgba(255, 70, 110, 0.92);
  --canvas-overlay-ink: rgba(15, 23, 42, 0.95);
  --canvas-overlay-snow: #ffffff;
  --canvas-readout-font: ui-monospace, "SF Mono", "JetBrains Mono", "Menlo", "Consolas", monospace;
  --canvas-readout-size: 11px;
}
~~~

`--canvas-zoom`은 `.stageTransform`에서 매 렌더 갱신되는 dynamic CSS variable.

---

## 6. Zoom-invariant 패턴 설명

### 6-1. Stage transform이 망가뜨리는 것

`.stageTransform`은 `transform: scale(zoom)`. 이 안의 모든 px(border 1px 포함)이 zoom 200%에서 2px, 50%에서 0.5px로 보임.

### 6-2. 두 가지 회피 전략

**(A) Screen-coord 오버레이로 빼기** — Drag ghost / Resize readout / Multi-bbox / Snap distance. 1px = 항상 1px.

**(B) `--canvas-zoom` 역수 보정** — AlignmentGuides, SelectionBox dashed 보더는 stage 안에 살아야 좌표 일치. `border-width: calc(1px / var(--canvas-zoom, 1))`.

### 6-3. CanvasNode 핸들 크기 보정 (선택)

기존 `.resizeHandle*`은 stage 단위 14×14. zoom 50%에서 7×7 → 클릭 어려움.

~~~css
.resizeHandle {
  width: calc(14px / var(--canvas-zoom, 1));
  height: calc(14px / var(--canvas-zoom, 1));
}
.resizeHandleNW { top: calc(-7px / var(--canvas-zoom, 1)); left: calc(-7px / var(--canvas-zoom, 1)); }
~~~

---

## 7. 검증

### 수동 시각 체크리스트 (zoom 50% / 100% / 200% 모두)

1. **Drag**: 원본 1px dashed outline + 이동 위치 opacity 0.6 ghost. 놓으면 사라짐. 드래그/리사이즈 중 nodeSizeLabel 숨김.
2. **Resize**: SE 코너 바깥 8px에 검정/흰 mono "320 × 200" readout. 폰트 11px 등폭, zoom-invariant.
3. **Multi-bbox**: 2+ 선택 시 1.5px solid blue + 8 핸들 + 좌상단 검정 배지 "N selected · WxH". drag/resize 중 사라짐.
4. **Snap distance**: 인접 64px 이내 + 투영 겹침 시 핑크 "= 16px =" 라벨. 0 또는 64px 초과면 없음.
5. **AlignmentGuides + SelectionBox**: zoom 50/200%에서도 1px.
6. **Zoom 핸들 보정** (옵션 적용 시): zoom 50%에서 14×14 유지.
7. **Performance**: 60fps drag, 100ms 이내 ghost mount/unmount.

### Lint / TypeScript

- `pnpm lint` 통과
- `pnpm tsc --noEmit` 통과
- 신규 컴포넌트 5개 모두 `'use client';`

---

## 8. 금지 범위 (재확인)

- `src/lib/builder/canvas/store.ts` — Zustand store. 구독만.
- `src/lib/builder/canvas/snap.ts` — 스냅 엔진.
- `src/lib/builder/canvas/tree.ts` — 좌표 resolver. 호출만.
- `SandboxPage.tsx` (D1), Inspector/SelectionToolbar/ContextMenu (D3), `*Modal.tsx` (D4), Picker류 (D5), `elements/**` (D6).

---

## 9. 작업 순서

1. 신규 5개 컴포넌트 생성.
2. `SandboxPage.module.css` 신규 클래스 추가, 기존 클래스 삭제, `.selectionBox` border-width 분리, nodeSizeLabel 숨김 룰 추가.
3. `AlignmentGuides.tsx` / `SelectionBox.tsx` 1px-stable 패치.
4. `CanvasContainer.tsx` 패치.
5. `pnpm tsc --noEmit &amp;&amp; pnpm lint` 통과 확인.
6. `pnpm dev`로 zoom 50/100/200% 수동 검증.

---

**End of CODEX PROMPT — D-POOL-2**
