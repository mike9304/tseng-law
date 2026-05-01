# CODEX 발주 프롬프트 — C1 애니메이션 시스템 (Phase 5 시작)

> **발행일**: 2026-04-29
> **선행**: B3, B6, B7 디자인 시스템 (color/font/preset/hover/background/dark mode)
> **분담**: Codex 담당. Claude는 별 트랙으로 Forms 빌더 + Header/Footer 글로벌 변환 진행 중.
> **충돌 회피**: C1 = 애니메이션. Claude의 Forms는 새 node kinds (form/input/textarea/submit). Claude의 Header/Footer는 site composite 변환. **types.ts에서**: C1은 `baseCanvasNodeSchema`에 `animation` 필드 1개만 추가. Forms agent는 `builderCanvasNodeKinds` 배열에 4 kinds 추가. 영역 분리됨.

---

## 1. 목적

호정 사이트 빌더에 **Wix 수준 애니메이션 시스템**을 추가. Phase 5(W151~W175) 시작 단계.

목표: 사용자가 노드 인스펙터에서 entrance/scroll/hover 애니메이션을 클릭 한 번으로 적용. 게시 사이트에서 실제 동작 (IntersectionObserver 기반).

---

## 2. 작업 범위

### 2.1 Animation schema (`baseCanvasNodeSchema` 확장)

```typescript
// types.ts
export const animationConfigSchema = z.object({
  entrance: z.object({
    preset: z.enum([
      'none',
      'fade-in',
      'slide-up', 'slide-down', 'slide-left', 'slide-right',
      'zoom-in', 'zoom-out',
      'bounce-in',
      'flip-x', 'flip-y',
      'reveal-left', 'reveal-right',
      'spin-in',
      'float-up',
    ]).default('none'),
    duration: z.number().int().min(100).max(3000).default(600),
    delay: z.number().int().min(0).max(3000).default(0),
    easing: z.enum(['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear']).default('ease-out'),
    triggerOnce: z.boolean().default(true),
  }).optional(),
  scroll: z.object({
    effect: z.enum([
      'none',
      'parallax-y',
      'fade-on-scroll',
      'scale-on-scroll',
      'rotate-on-scroll',
      'pin', // sticky during scroll range
    ]).default('none'),
    intensity: z.number().min(-100).max(100).default(20), // px/% depends on effect
  }).optional(),
  hover: z.object({
    preset: z.enum([
      'none',
      'lift',         // translateY(-4px) + shadow
      'pulse',        // scale 1.05
      'glow',         // box-shadow color
      'rotate-3d',    // perspective rotation
      'tint',         // overlay color
    ]).default('none'),
    transitionMs: z.number().int().min(0).max(2000).default(200),
  }).optional(),
}).optional();

// baseCanvasNodeSchema에 추가:
animation: animationConfigSchema,
```

기존 `hoverStyle`(B6)와 별개로 두 가지 다른 추상화 — `hoverStyle`은 색/크기 정밀 조정, `hover.preset`은 미리 만들어둔 8종 라이브러리. 인스펙터에서 둘 다 노출 (Style 탭은 hoverStyle, Animations 탭은 hover preset).

### 2.2 Animations Inspector 탭 신규

**의도 동작**:
- 인스펙터에 "Animations" 탭 신규 추가 (현재 Layout/Style/Content/A11y/SEO 옆)
- 3 섹션:
  1. **Entrance** — preset dropdown (visual preview thumbnail 옆에), duration slider, delay slider, easing select, "Trigger only once" 체크
  2. **Scroll** — effect select, intensity slider, 미리보기 hint
  3. **Hover** — preset dropdown, transition slider
- 각 preset 선택 시 노드에 즉시 미리보기 (인스펙터에서 "Play preview" 버튼 누르면 reset 후 entrance 재생)

**파일**:
- 수정: `src/components/builder/canvas/SandboxInspectorPanel.tsx` (Animations 탭 추가)
- 신규: `src/components/builder/editor/AnimationsTab.tsx`
- 신규: `src/lib/builder/animations/presets.ts` — preset → CSS keyframes/transitions 매핑
- 신규: `src/lib/builder/animations/animation-render.ts` — 노드에 적용할 CSS 생성

### 2.3 Editor preview

**의도 동작**:
- 캔버스에서 노드 선택 시 entrance 애니메이션 자동 재생 1회 (옵션, 기본 OFF — 사용자가 인스펙터의 "Play preview" 버튼 눌렀을 때만)
- Hover preset은 캔버스에서 마우스 오버 시 즉시 동작
- Scroll effects는 게시 모드에서만 작동 (편집 모드에선 indicator만)

**파일**:
- 수정: `src/components/builder/canvas/CanvasNode.tsx` (애니메이션 적용 로직 — animation field 읽어서 transition/transform/opacity CSS 생성)

### 2.4 Published runtime (가장 중요)

**의도 동작**:
- IntersectionObserver로 viewport 진입 감지 → entrance preset 재생
- Scroll effect: scroll listener → translate/scale/rotate 적용
- Hover: CSS transitions (정적 정의)
- Page transitions: 사이트 전체 옵션 (옵션, 시간 남으면)

**구현 포인트**:
- 신규 client component: `src/components/builder/published/AnimationsRoot.tsx`
  - IntersectionObserver 한 개 글로벌 인스턴스로 모든 `[data-anim-entrance]` 관찰
  - `data-anim-state="visible"` 토글
- CSS는 inline 또는 styled component로 노드에 직접 주입
- public-page.tsx에서 노드 렌더 시 entrance/scroll data attr 부여 + AnimationsRoot 마운트

**파일**:
- 신규: `src/components/builder/published/AnimationsRoot.tsx` (client)
- 수정: `src/lib/builder/site/public-page.tsx` (마운트 + data attrs + style)
- 신규: `src/lib/builder/animations/preset-keyframes.css` 또는 styled-jsx로 일괄 정의

### 2.5 Page transitions (선택, 시간 남으면)

- 페이지 이동 시 fade/slide 전환
- Next.js App Router의 `loading.tsx` 또는 `template.tsx` 활용
- 이번 배치는 hook만 만들고 실제 전환은 다음 배치

---

## 3. Animation preset 라이브러리

각 preset의 CSS 정의 예시 (`presets.ts`):

```typescript
export const ENTRANCE_PRESETS = {
  'fade-in': { keyframes: 'opacity: 0 → 1', initial: 'opacity:0' },
  'slide-up': { keyframes: 'translateY(40px) → 0; opacity 0→1', initial: 'translateY(40px); opacity:0' },
  'slide-down': { keyframes: 'translateY(-40px) → 0', initial: 'translateY(-40px); opacity:0' },
  'slide-left': { keyframes: 'translateX(40px) → 0', initial: 'translateX(40px); opacity:0' },
  'slide-right': { keyframes: 'translateX(-40px) → 0', initial: 'translateX(-40px); opacity:0' },
  'zoom-in': { keyframes: 'scale(0.6) → 1', initial: 'scale(0.6); opacity:0' },
  'zoom-out': { keyframes: 'scale(1.2) → 1', initial: 'scale(1.2); opacity:0' },
  'bounce-in': { keyframes: 'cubic-bezier(0.34, 1.56, 0.64, 1) scale 0.3→1' },
  'flip-x': { keyframes: 'rotateX(90deg) → 0' },
  'flip-y': { keyframes: 'rotateY(90deg) → 0' },
  'reveal-left': { keyframes: 'clip-path inset(0 100% 0 0) → 0' },
  'reveal-right': { keyframes: 'clip-path inset(0 0 0 100%) → 0' },
  'spin-in': { keyframes: 'rotate(180deg) scale(0.5) → 0 scale(1)' },
  'float-up': { keyframes: 'translateY(80px) ease-out 1.2s' },
};
```

### 3.1 Hover preset 라이브러리

```typescript
export const HOVER_PRESETS = {
  'lift': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.15)' },
  'pulse': { transform: 'scale(1.05)' },
  'glow': { boxShadow: '0 0 24px var(--primary-color, #3b82f6)' },
  'rotate-3d': { transform: 'perspective(800px) rotateY(8deg)' },
  'tint': { filter: 'brightness(1.1) saturate(1.2)' },
};
```

---

## 4. 검증 방법

```bash
cd /Users/son7/Projects/tseng-law
npm run lint
npm run build
npx tsc --noEmit --incremental false
```

**브라우저**:
1. `/ko/admin-builder` Basic Auth: `admin / local-review-2026!`
2. 노드 선택 → Inspector → Animations 탭 → Entrance "fade-in" 선택 → "Play preview" 클릭 → 캔버스에서 페이드인 재생
3. Hover "lift" 선택 → 캔버스 마우스 오버 시 살짝 떠오르며 그림자
4. Scroll "parallax-y" 선택 → intensity 30 → 게시 페이지 스크롤 시 노드 시차
5. 게시 페이지 (https://localhost:3000/ko 또는 /ko/p/about) 열기 → 노드들이 viewport 진입 시 자동 entrance 재생
6. 새로고침 → 다시 entrance 재생 (triggerOnce=true 면 한 번만)

---

## 5. 작업 규칙 (`AGENTS.md` 준수)

- **types.ts node kinds 건드리지 말 것** (Forms agent 영역)
- **`SiteHeader.tsx`, `SiteFooter.tsx` 건드리지 말 것** (Header/Footer agent 영역)
- legacy-*.tsx 본문 수정 금지
- composite/Render.tsx legacy 폴백 제거 금지
- `tree.ts` / `seed-home v` 변경 금지
- Phase 2+ 스키마 확장 금지 — 단, 이 배치는 애니메이션이라 Phase 2 mobile-responsive 영역과 무관
- `git push --force`, `--no-verify` 금지

---

## 6. Definition of Done

- [ ] `animationConfigSchema` 추가 + `baseCanvasNodeSchema.animation` 필드
- [ ] `AnimationsTab.tsx` (3 섹션: Entrance/Scroll/Hover)
- [ ] `presets.ts` 14 entrance + 5 hover 정의
- [ ] CanvasNode editor preview ("Play preview" 버튼 → 재생)
- [ ] `AnimationsRoot.tsx` published runtime (IntersectionObserver)
- [ ] public-page.tsx 마운트 + data attrs
- [ ] (선택) Page transitions
- [ ] lint/build/tsc 통과
- [ ] 브라우저 검증 6단계 통과
- [ ] SESSION.md commit hash + 항목 추가

---

## 7. 인수인계

작업 완료 시:
1. commit (분할 권장):
   - `C1-1 animation schema + presets library`
   - `C1-2 animations tab inspector + editor preview`
   - `C1-3 published animations runtime + public-page integration`
   - `C1-4 (optional) page transitions`
2. SESSION.md 갱신, 한줄 요약 갱신
3. Claude 트랙 (Forms + Header/Footer)와 충돌 없음 확인

---

이 프롬프트: `/Users/son7/Projects/tseng-law/CODEX-PROMPT-ANIMATIONS-C1.md`. Codex 던질 때 경로만 알려주면 됨.
