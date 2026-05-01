# CODEX 발주 — Wave 2 / E2 Card / Form Variants

> **발행일**: 2026-05-01
> **선행**: B7 (`8c5fb81` button 8 variants + `component-variants.ts` token), Wave 1 E1 (theme bindings indicator)
> **분담**: 엔지니어 5 (Design System) 단독.
> **충돌 회피**: `canvas/types.ts`는 **append-only**로만 수정 (A2 worker도 envelope 타입 추가 중). 기존 enum/export 수정 금지.

---

## 1. 목적

B7에서 `component-variants.ts`에 button 8종 + card 4종 + form input 3종 token을 정의했다. 그러나 **card와 form input은 token만 있고 실제 렌더에 연결 안 됨**. 이 PR은:

1. CARD_VARIANTS를 container/card-like 컴포넌트 렌더에 wiring
2. FORM_INPUT_VARIANTS를 form-input/textarea/select/date/file 5종 렌더에 wiring
3. 인스펙터에 variant dropdown 추가
4. legacy 필드(`cardStyle`, form submit `style`) adapter 유지

체감 동작:
- container 노드 선택 → 인스펙터 Style 탭에 "Card variant" dropdown (Flat / Elevated / Floating / Glass)
- form-input 노드 선택 → 인스펙터에 "Input variant" dropdown (Default / Underline / Filled)
- 변경 즉시 캔버스에서 시각 변화
- publish 후 public page에 동일 적용
- 기존 `cardStyle: 'subtle'` 같은 legacy 값을 가진 노드는 자동으로 가까운 variant로 매핑

---

## 2. 작업 범위

### 2.1 CARD_VARIANTS wiring

`src/lib/builder/site/component-variants.ts` (수정 — token 정의는 이미 있음):

```ts
export const CARD_VARIANTS = {
  flat: { background: 'surface', border: '1px solid border-soft', shadow: 'none', radius: 8 },
  elevated: { background: 'surface', border: 'none', shadow: 'sm', radius: 10 },
  floating: { background: 'surface', border: 'none', shadow: 'lg', radius: 14 },
  glass: { background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.4)', radius: 12 },
} as const;
export type CardVariantKey = keyof typeof CARD_VARIANTS;
export function normalizeCardVariantKey(input: unknown): CardVariantKey;
export function legacyCardStyleToVariant(legacy: string | undefined): CardVariantKey;
```

container/card 컴포넌트에 적용:
- `src/lib/builder/components/container/index.ts` (있으면) 또는 캔버스 container 렌더 위치
- `src/lib/builder/components/columnCard/Element.tsx` (있으면)
- `src/lib/builder/components/blogPostCard/` (Element 또는 index)
- `src/lib/builder/components/attorneyCard/` (Element)
- 그 외 `card`처럼 쓰이는 composite

각 위치에서:
```ts
const variantKey = normalizeCardVariantKey(content.variant ?? legacyCardStyleToVariant(content.cardStyle));
const variantStyle = resolveCardVariantStyle(variantKey, theme);
```

### 2.2 FORM_INPUT_VARIANTS wiring

```ts
export const FORM_INPUT_VARIANTS = {
  default: { /* border 1px */ },
  underline: { /* border-bottom only */ },
  filled: { /* background tint, no border */ },
} as const;
```

대상 컴포넌트:
- `src/lib/builder/components/formInput/`
- `src/lib/builder/components/formTextarea/`
- `src/lib/builder/components/formSelect/`
- `src/lib/builder/components/formDate/`
- `src/lib/builder/components/formFile/`

각 Element/render에서 variant 적용. focus/disabled/error 상태도 variant별로 정의.

form-submit은 button variant를 그대로 쓰므로 변경 없음 (B7에서 처리됨).

### 2.3 schema 키 추가 (append-only)

`src/lib/builder/canvas/types.ts`:

container content content 스키마에:
```ts
variant: cardVariantKeySchema.optional(),
```

formInput/textarea/select/date/file content 스키마에:
```ts
variant: formInputVariantKeySchema.optional(),
```

**기존 키는 절대 수정 금지** (A2 worker가 envelope 타입 추가 중). 새 schema는 같은 파일에 append.

### 2.4 인스펙터 dropdown

각 컴포넌트의 Inspector에 variant dropdown 추가 (Style 탭 또는 Content 탭, 어느 쪽이 자연스러운지 판단):

```tsx
<select value={content.variant ?? 'default'} onChange={(e) => updateContent({ variant: e.target.value })}>
  {Object.keys(CARD_VARIANTS).map(k => <option key={k} value={k}>{labelFor(k)}</option>)}
</select>
```

E1 indicator(linked/detached)와 충돌 안 나게, variant는 "preset" 개념이라 `linked`로 표시할 수 있으면 좋음. 시간 부족하면 indicator 없이 단순 dropdown OK.

### 2.5 defaults / updateNodeContent

`src/lib/builder/canvas/store.ts`의 `updateNodeContent`가 새 키(`variant`)를 drop하지 않게 schema 업데이트 후 store 동작 확인. 보통 zod schema에 추가만 하면 통과.

기본값:
- container/card: `variant: 'flat'` (가장 보수적)
- form input: `variant: 'default'`

`defineComponent` 의 `defaultContent`에 variant 추가.

### 2.6 legacy adapter

기존 노드가 `cardStyle: 'subtle' | 'elevated' | ...` 같은 키를 갖고 있다면:
- 렌더 시 `legacyCardStyleToVariant` 매핑 적용 (read-time adapter)
- 사용자가 인스펙터에서 variant를 바꾸면 새 `variant` 키에 저장 (legacy 키는 남겨둠 — 이 PR에서 마이그레이션 안 함)

form submit의 legacy `style` 키도 기존 동작 보존 (B7에서 button 8 variants로 정리됨).

---

## 3. 파일

**수정**:
- `src/lib/builder/site/component-variants.ts` — `resolveCardVariantStyle`, `resolveFormInputVariantStyle`, `legacyCardStyleToVariant` helpers
- `src/lib/builder/canvas/types.ts` — variant 키 append (절대 수정 금지)
- `src/lib/builder/components/{container,columnCard,blogPostCard,attorneyCard,...}/index.ts|Element.tsx` — CARD variant 적용
- `src/lib/builder/components/{formInput,formTextarea,formSelect,formDate,formFile}/Element.tsx` — FORM_INPUT variant 적용
- 각 컴포넌트의 `Inspector.tsx` — variant dropdown 추가
- `src/lib/builder/site/public-page.tsx` 만약 published 렌더에서 별도 처리 필요하면 추가

**신규**: 없음

---

## 4. 비범위

- Brand kit asset wiring (E3에서)
- Media crop / focal point (E4에서)
- Card composite "전체 위젯" (Phase 3 위젯 라이브러리에서 별도)
- Card 4종 외 신규 추가 (Pricing card, Profile card 등은 후속)

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

1. 빈 컨테이너 추가 → 인스펙터에 "Card variant" dropdown 보임
2. Flat → Elevated → Floating → Glass 순서로 바꿔보며 캔버스에서 그림자/배경 변화 확인
3. form-input 추가 → "Input variant" dropdown 보임 → Default/Underline/Filled 변화
4. 페이지 publish → public page (`/ko`) 방문 → variant 동일하게 반영
5. 기존 column-card 또는 attorney-card 노드의 legacy `cardStyle: 'elevated'` → variant 미설정 상태에서 elevated로 렌더 (legacy adapter)
6. 사용자가 variant를 'flat'으로 변경 → flat 렌더 + content.variant 저장됨

### diff inspect
```bash
rg -n 'CARD_VARIANTS|FORM_INPUT_VARIANTS|resolveCardVariantStyle|resolveFormInputVariantStyle' \
  src/lib/builder/components \
  src/lib/builder/site
```
→ token이 실제 렌더 path에 import됐는지 확인 (10+ 위치 예상).

---

## 6. 검증 통과 기준

- 자동 게이트 모두 ✅
- 수동 manual 1~6 단계 통과
- Card 4종 / Form input 3종이 인스펙터에 dropdown으로 노출
- variant 변경 즉시 시각 반영
- publish 후 public page에서 동일
- legacy 노드(`cardStyle`)는 자동 매핑되어 깨지지 않음
- 기존 button 8 variants는 영향 없음 (regress 없는지 button inspector 한 번 확인)

작업 끝나면 SESSION.md에 결과 한 줄 추가.
