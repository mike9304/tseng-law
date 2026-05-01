# CODEX 발주 — Wave 3 / F3 Built-in Section Templates (+ F1 XFAIL 픽스)

> **발행일**: 2026-05-01
> **선행**: Wave 1 F2 (saved section normalize + thumbnail safe), 04-30 Section library API
> **분담**: 엔지니어 6 (Templates/Sections) 단독.
> **충돌 회피**: 신규 디렉토리 `sections/templates.ts` + `BuiltInSectionsPanel.tsx`. 다른 트랙 안 건드림.

---

## 1. 목적

Wave 1 F2가 사용자 직접 저장한 섹션을 다루는 인프라를 깔았다. F3은 그 위에 **builtin 정규화 섹션 템플릿 12+ 개**를 얹는다. 6 카테고리: hero / features / testimonials / CTA / footer / legal.

추가로: **F1 XFAIL 2건 (blog-about / blog-authors borderRadius > 64) 정리**. schema relax + XFAIL 리스트 제거.

체감 동작:
- Add 패널 상단에 "Section templates" 섹션 (Saved sections 위)
- 각 카드 클릭 시 캔버스에 즉시 삽입 (clone + id remap, F2와 같은 경로)
- 사용자가 삽입 후 자유롭게 편집 (saved sections와 동일)
- F1 vitest: XFAIL 2건이 진짜 통과 (XFAIL_TEMPLATES Map 비움)

---

## 2. 작업 범위

### 2.1 정규화된 builtin 템플릿

`src/lib/builder/sections/templates.ts` (**신규**):

12+ 템플릿 (각 카테고리당 2개 이상). 각 템플릿은 **F2의 normalizeSavedSectionSnapshot 통과 형태** — root는 x:0, y:0, descendants는 parent-local 좌표.

```ts
import { normalizeSavedSectionSnapshot } from '@/lib/builder/sections/normalize';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

export interface BuiltInSectionTemplate {
  id: string;                       // unique, kebab-case
  name: string;                     // display label
  category: 'hero' | 'features' | 'testimonials' | 'cta' | 'footer' | 'legal';
  description?: string;
  thumbnailHint?: string;           // optional emoji or short tag for placeholder
  nodes: BuilderCanvasNode[];      // pre-normalized snapshot
  rootNodeId: string;
}

export const BUILT_IN_SECTIONS: BuiltInSectionTemplate[] = [
  { id: 'hero-centered-cta', category: 'hero', ... },
  { id: 'hero-split-image', category: 'hero', ... },
  { id: 'features-3-column', category: 'features', ... },
  { id: 'features-icon-grid', category: 'features', ... },
  { id: 'testimonials-cards', category: 'testimonials', ... },
  { id: 'testimonials-quote-grid', category: 'testimonials', ... },
  { id: 'cta-banner-centered', category: 'cta', ... },
  { id: 'cta-split-with-image', category: 'cta', ... },
  { id: 'footer-3-column', category: 'footer', ... },
  { id: 'footer-minimal', category: 'footer', ... },
  { id: 'legal-disclaimer', category: 'legal', ... },
  { id: 'legal-privacy-summary', category: 'legal', ... },
];

// validation helper
export function getBuiltInSectionsByCategory(): Record<string, BuiltInSectionTemplate[]>;
```

각 템플릿의 `nodes`는 직접 typing하기 비싸므로 — 헬퍼 builder 함수 권장:

```ts
function buildSection(rootProps, ...children): { nodes, rootNodeId } { ... }
```

### 2.2 BuiltInSectionsPanel

`src/components/builder/sections/BuiltInSectionsPanel.tsx` (**신규**):

```tsx
export function BuiltInSectionsPanel({ onInsert }: { onInsert: (template: BuiltInSectionTemplate) => void }) {
  const byCategory = getBuiltInSectionsByCategory();
  return (
    <div>
      {Object.entries(byCategory).map(([category, items]) => (
        <section key={category}>
          <h4>{categoryLabel(category)}</h4>
          <div className="grid">
            {items.map((t) => (
              <SectionTemplateCard
                key={t.id}
                template={t}
                onClick={() => onInsert(t)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
```

### 2.3 SectionTemplateCard (선택, 또는 inline)

`src/components/builder/sections/SectionTemplateCard.tsx`:

- 카드: thumbnail (SVG wireframe via `buildSavedSectionThumbnailSvg` from Wave 1 F2)
- name, description
- onClick handler → 부모 onInsert

F2의 thumbnail 빌더 재사용:
```tsx
import { buildSavedSectionThumbnailSvg } from '@/lib/builder/sections/thumbnail';

const svg = useMemo(
  () => buildSavedSectionThumbnailSvg(template.nodes, template.rootNodeId),
  [template.id]
);
return <div dangerouslySetInnerHTML={{ __html: svg }} />;  // SVG는 sanitize-safe (F2)
```

### 2.4 Catalog Panel 통합

`src/components/builder/canvas/SandboxCatalogPanel.tsx`:

기존 saved sections 위에 BuiltInSectionsPanel 마운트:

```tsx
<BuiltInSectionsPanel onInsert={(template) => onInsertSection(template.nodes, template.rootNodeId)} />
<SavedSectionsPanel ... />
```

`onInsertSection`은 F2의 `insertSection(nodes, rootNodeId, dropOffset?)` 같은 경로 사용. id remap (uuid 새로 생성) + cascade offset 계산.

### 2.5 F1 XFAIL 픽스 (사이드 트랙)

**문제**: `blog-about.ts:56` `borderRadius: 140`, `blog-authors.ts:68` `borderRadius: 100` (schema max 64 위반 — 원형 아바타 의도).

**fix**: schema relax. `src/lib/builder/canvas/types.ts:213`:

```ts
// 변경 전
borderRadius: z.number().int().min(0).max(64),
// 변경 후
borderRadius: z.number().int().min(0).max(9999),
```

(Tailwind 관행: `border-radius: 9999px`로 완전 원형. 64 cap은 보수적이었음.)

다른 두 곳 (line 408, 431 max(48))은 다른 키에 대한 별도 제한 — 일단 그대로 두고, 추후 별도 트랙에서 검토.

`src/lib/builder/templates/__tests__/registry.test.ts`:

```ts
// XFAIL_TEMPLATES Map 비우기 (또는 지우기)
const XFAIL_TEMPLATES = new Map<string, string>();
// 또는
const XFAIL_TEMPLATES = new Map([
  // 비어 있음 — F3에서 schema relax로 정상 통과
]);
```

테스트 재실행 시 345개 그대로 통과. blog-about / blog-authors가 진짜 통과로 격상.

---

## 3. 파일

**신규**:
- `src/lib/builder/sections/templates.ts`
- `src/components/builder/sections/BuiltInSectionsPanel.tsx`
- `src/components/builder/sections/SectionTemplateCard.tsx` (선택)

**수정**:
- `src/components/builder/canvas/SandboxCatalogPanel.tsx` — BuiltInSectionsPanel 마운트
- `src/lib/builder/canvas/types.ts` — borderRadius max 9999 relax
- `src/lib/builder/templates/__tests__/registry.test.ts` — XFAIL_TEMPLATES 비움

---

## 4. 비범위

- 사용자 정의 템플릿 카테고리 추가 UI (admin)
- 템플릿 다국어 (현재는 ko 콘텐츠 위주)
- 템플릿 search / filter
- 템플릿 즐겨찾기
- 템플릿 marketplace

---

## 5. 검증

### 자동
```bash
npm run typecheck
npm run lint
npm run test:unit              # 345 → 345 그대로 + XFAIL 0
npm run security:builder-routes
npm run build
BUILDER_SMOKE_TIMEOUT_MS=30000 npm run smoke:builder
```

`test:unit` 출력에서 다음 확인:
- "blog-about canvas document parses" 통과 (XFAIL 0)
- "blog-authors canvas document parses" 통과
- 총 케이스 345

### Manual

1. `/ko/admin-builder` → Add 패널 → "Section templates" 섹션 보임 (Saved sections 위)
2. 카테고리별 카드 12+ 노출 (hero 2, features 2, testimonials 2, cta 2, footer 2, legal 2)
3. 각 카드에 thumbnail (SVG wireframe)
4. 클릭 → 캔버스 우상단 또는 cascade offset 위치에 섹션 삽입
5. 삽입된 섹션의 모든 노드가 새 id (clone + remap)
6. 편집 가능 (텍스트 수정, 위치 변경, 삭제 모두 정상)
7. publish → public page에 반영

8. F1 XFAIL 픽스:
   - blog-about / blog-authors 템플릿을 D1 갤러리에서 클릭 → 캔버스에 정상 삽입 (borderRadius 100/140 그대로)
   - 캔버스에 원형 아바타 정상 렌더

### Inspection
```bash
# 12개 이상 builtin templates
rg -c "id:.*'" src/lib/builder/sections/templates.ts

# borderRadius schema 9999
rg -n 'borderRadius.*max\(' src/lib/builder/canvas/types.ts
```

---

## 6. 검증 통과 기준

- 자동 게이트 모두 ✅
- 12+ 템플릿 6 카테고리 분포
- Manual 1~7 통과
- F1 XFAIL_TEMPLATES Map 비어 있음 (XFAIL 0)
- 345 테스트 그대로 통과 (XFAIL 처리됐던 2건도 정상 parse)
- borderRadius max(9999) relax — 다른 곳 회귀 없음

작업 끝나면 SESSION.md에 결과 한 줄.
