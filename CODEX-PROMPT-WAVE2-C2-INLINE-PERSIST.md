# CODEX 발주 — Wave 2 / C2 Inline Rich Text Persistence

> **발행일**: 2026-05-01
> **선행**: Wave 1 C1 (`src/lib/builder/rich-text/{types,sanitize,render}.tsx`, `richText` schema, `richTextFromPlainText` helper)
> **분담**: 엔지니어 3 (Rich Text/Links/Content) 단독.
> **충돌 회피**: `CanvasNode.tsx`는 이 트랙 단독 점유. B2 worker는 `CanvasContainer.tsx` 점유 — 부모-자식 관계지만 파일 분리됨.

---

## 1. 목적

C1에서 TipTap JSON schema와 안전 renderer를 만들었다. 그러나 인라인 편집 시 사용자가 **bold/italic/underline/링크**를 적용해도 blur 시점에 plain text로 강등되어 마크가 날아간다. 이 PR은 InlineTextEditor의 onSave를 `(richText, plainText)` 페어로 바꾸고, 렌더 path에서 `dangerouslySetInnerHTML` 대신 sanitized React tree를 쓰도록 정리한다.

체감 동작:
- 텍스트 노드 더블클릭 → 인라인 편집기 열림
- "Hello **world**" 타이핑하고 일부에 bold + 링크 추가
- blur (밖 클릭) → 저장 → 새로고침 → bold/링크 그대로 살아 있음
- publish → public page에서도 bold/링크 살아 있음
- `<script>alert(1)</script>` 같은 입력은 sanitizer가 제거

---

## 2. 작업 범위

### 2.1 InlineTextEditor onSave signature 변경

`src/components/builder/canvas/InlineTextEditor.tsx`:

기존:
```ts
onSave: (html: string, plainText: string) => void;
```

신규:
```ts
import type { BuilderRichText } from '@/lib/builder/rich-text/types';

onSave: (payload: { richText: BuilderRichText; plainText: string }) => void;
```

내부적으로:
- TipTap editor 인스턴스에서 `editor.getJSON()`을 호출해 doc 추출
- `sanitizeTipTapDoc(doc)` 통과 (link sanitizer 포함)
- `BuilderRichText` 객체 생성: `{ format: 'tiptap-json', doc, plainText, html: editor.getHTML() }`
- `onSave({ richText, plainText })` 호출
- HTML/marks/links를 절대 buffer 단계에서 폐기하지 마

### 2.2 CanvasNode 텍스트/헤딩 노드 wiring

`src/components/builder/canvas/CanvasNode.tsx`:

- text/heading 노드의 인라인 편집 commit 시:
  ```ts
  store.updateNodeContent(nodeId, {
    text: payload.plainText,         // legacy plain mirror
    richText: payload.richText,      // new
  });
  ```
- 인라인 편집 진입할 때 노드의 `content.richText`가 있으면 그걸로 editor seed
- 없으면 `richTextFromPlainText(content.text)`로 seed (마이그레이션)

### 2.3 텍스트/헤딩 렌더 path 정리

`src/components/builder/canvas/elements/TextElement.tsx` (편집 모드):
`src/lib/builder/components/heading/Element.tsx` (편집 + published):
`src/lib/builder/site/public-page.tsx`의 text/heading 렌더 분기:

- `content.richText`가 있으면 `<RichTextRenderer richText={content.richText} mode="block|heading" />` 사용
- 없으면 `content.text`를 plain text로 렌더 (legacy)
- **`dangerouslySetInnerHTML` 사용 금지** — 모든 rich text는 sanitize 후 React tree로 렌더

`src/lib/builder/rich-text/render.tsx`의 export를 정리해서 `RichTextRenderer` 컴포넌트 형태로 노출하거나, 기존 함수 export를 그대로 쓰되 `<RichTextRenderer />` wrapper를 만들어.

### 2.4 인스펙터 textarea 동작

text/heading inspector의 plain textarea 입력 시:
- 옵션 A (이 PR): textarea 변경은 `text`만 갱신하고, `richText`는 자동 regenerate (`richTextFromPlainText`로 paragraph doc 재생성). 단, **이 동작 시 사용자가 인지하도록** textarea 옆에 `⚠ 텍스트만 편집하면 서식이 사라집니다. 캔버스에서 직접 편집하세요.` 안내 표시.
- 옵션 B (다음 PR): textarea를 read-only "preview"로 만들어 인라인 편집만 허용.

이 PR은 옵션 A 권장 (안내 + auto regen).

### 2.5 schema 가드

`src/lib/builder/canvas/types.ts`의 text/heading content schema가 이미 `richText: textRichTextSchema` 와 `richText.plainText must match text` validation을 가지고 있다. 이 PR에서:
- `updateNodeContent` 액션이 text와 richText 동시 갱신 시 plainText 일관성 자동 보장
- 만약 호출자가 text만 갱신하면 store 내부에서 richText도 regen하도록 store 액션을 손봐도 OK (단, B2와 충돌 안 나게 store.ts 변경 최소화)

---

## 3. 파일

**수정**:
- `src/components/builder/canvas/InlineTextEditor.tsx` — onSave signature, getJSON, sanitize
- `src/components/builder/canvas/CanvasNode.tsx` — onSave 핸들러 + seed
- `src/components/builder/canvas/elements/TextElement.tsx` — richText 렌더 path
- `src/lib/builder/components/heading/Element.tsx` — richText 렌더 path
- `src/lib/builder/site/public-page.tsx` — published 렌더 분기
- `src/lib/builder/components/text/Inspector.tsx` — plain textarea 안내
- `src/lib/builder/components/heading/Inspector.tsx` — 동일

**선택**:
- `src/lib/builder/rich-text/render.tsx` — `<RichTextRenderer />` 컴포넌트 wrapper export (없으면 추가)
- `src/lib/builder/canvas/store.ts` — `updateNodeContent` 시 `text`만 들어오면 `richText` 자동 regen (충돌 회피 위해 minimal한 수정)

**신규**: 없음 (C1에서 이미 만들어둠)

---

## 4. 비범위

- LinkPicker UI (C3에서)
- LinkValue 통합 (C3에서)
- 표(table) / 이미지 인라인 / 코드블록 (Wave 3+)
- 단축키 확장 (Cmd+B/I/U는 TipTap 기본만)

---

## 5. 검증

### 자동
```bash
npm run typecheck
npm run lint
npm run security:builder-routes
npm run build
BUILDER_SMOKE_TIMEOUT_MS=30000 npm run smoke:builder
```

### 수동 manual

1. 빌더에서 텍스트 노드 더블클릭 → 인라인 편집 진입
2. "안녕하세요 **굵게** *이탤릭* [링크](https://example.com)" 입력
3. 외부 클릭으로 blur → 저장
4. Cmd+R 새로고침 → bold/italic/링크가 그대로 보임
5. Publish → public page (`/ko`) 방문 → 동일하게 보임
6. `javascript:alert(1)` 링크 입력 시도 → sanitizer가 제거하거나 빈 href로 무력화
7. `<script>alert(1)</script>` 입력 → 텍스트로만 보이고 실행 안 됨
8. 인스펙터 textarea로 텍스트만 변경 → 서식 사라짐 안내 보임 + 저장 시 plain paragraph로 정렬

### Element 단위 확인

```bash
# dangerouslySetInnerHTML 잔재 확인
rg -n 'dangerouslySetInnerHTML' \
  src/components/builder/canvas/ \
  src/lib/builder/components/text \
  src/lib/builder/components/heading \
  src/lib/builder/site/public-page.tsx
```

→ rich text 렌더 path에는 0 건이어야 함. (legacy iframe/embed 등은 무관)

---

## 6. 검증 통과 기준

- 자동 게이트 모두 ✅
- 수동 manual 1~8 단계 통과
- save → reload → bold/link 살아있음 (4단계가 핵심)
- publish 후에도 bold/link 살아있음
- `dangerouslySetInnerHTML`이 rich text path에 0
- `javascript:` 링크 차단

작업 끝나면 SESSION.md에 결과 한 줄 추가.
