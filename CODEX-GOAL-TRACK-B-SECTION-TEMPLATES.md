# Codex /goal — Track B: Section templates 12 → 53+ expansion

## Goal (one-line)

`src/lib/builder/sections/templates.ts` 의 `BUILT_IN_SECTIONS` 배열을 12 → **53+**, 카테고리 6 → **13+**로 확장.

## 마스터 지시서

전체 컨텍스트는 `/Users/son7/Projects/tseng-law/CODEX-GOAL-TEMPLATE-DESIGN-EXPANSION.md`. 본 트랙은 그 § 2 + § 4 의 self-contained 발주판.

## 현재 상태

- `BUILT_IN_SECTION_CATEGORIES` (현재 6): `hero / features / testimonials / cta / footer / legal`
- 각 카테고리당 2개 = 총 12 항목
- F2의 `normalizeSavedSectionSnapshot` 통과 형태 (root x:0 y:0, parentId undefined, descendants parent-local)

## 확장 대상

### 기존 카테고리 보강

| 카테고리 | 현재 | 목표 | 추가 항목 예시 |
|---|---|---|---|
| hero | 2 | 5 | hero-centered-cta / split-image / video-bg / parallax / minimal-eyebrow |
| features | 2 | 5 | 3-col / 4-col / icon-grid / alternating-rows / large-feature-card |
| testimonials | 2 | 5 | quote-cards / quote-grid / single-spotlight / video / logo-grid |
| cta | 2 | 5 | banner-centered / split-with-image / gradient-bg / dark-band / newsletter |
| footer | 2 | 4 | 3-col / 4-col-with-newsletter / minimal / contact |
| legal | 2 | 3 | disclaimer / privacy-summary / cookie-banner |

### 신규 카테고리 추가

| 카테고리 | 항목 수 | 추천 항목 |
|---|---|---|
| **stats** | 4 | counter-row / metric-grid / logo-strip / award-badges |
| **pricing** | 4 | 3-tier / 2-tier-comparison / single-plan / table |
| **team** | 4 | grid-cards / horizontal-row / featured-leader / mosaic |
| **gallery** | 4 | grid / masonry / carousel-thumb / lightbox-grid |
| **faq** | 3 | accordion / 2-col-grid / category-tabs |
| **services** | 4 | 3-col-icon / list-with-image / accordion / pricing-card |
| **contact** | 3 | form-with-info / map-and-form / split-info |

**목표 합계: ≥ 53**.

## 항목 구조 룰

각 entry는 `BuiltInSectionTemplate` 형식:

```ts
{
  id: 'kebab-case-unique',          // 반드시 유일
  name: '한국어 또는 영어 displayName',
  category: BuiltInSectionCategory,  // 'hero' | 'stats' | 등
  description?: string,              // 옵션
  thumbnailHint?: string,            // emoji 또는 short tag (옵션)
  nodes: BuilderCanvasNode[],        // pre-normalized snapshot
  rootNodeId: string,                // root 노드 id (nodes[0].id 권장)
}
```

`nodes` 룰 (F2 normalize 통과 형태):
- root 노드: `x: 0, y: 0`, `parentId: undefined`
- descendants: parent-local 좌표 (root 기준 상대값)
- 각 항목 노드 12~25개 (시각 풍부도)
- root width 1280 권장, height는 콘텐츠에 따라

helper builder:

```ts
import { normalizeSavedSectionSnapshot } from '@/lib/builder/sections/normalize';
import {
  createContainerNode,
  createTextNode,
  createButtonNode,
  createImageNode,
  assignCanvasNodeZIndices,
} from '@/lib/builder/decompose/shared';
```

## 디자인 룰 (마스터 § 2)

- 색상: theme tokens 또는 brand-aligned hex
- 폰트: `--font-heading-ko` / `--font-body`
- spacing: 8 / 16 / 24 / 32 / 48 / 64 / 96 / 128
- borderRadius: 0 / 4 / 8 / 12 / 16 / 24 / 9999
- className hint 활용 (자동 entrance):
  - text/heading: `hero-title / hero-subtitle / section-label / hero-eyebrow / hero-cta`
  - container: `office-card / services-detail-card / stat-card / split-text / split-image / card-copy / card-title`

## 컴포넌트 사용 룰

**신규 위젯 kind 추가 금지.** 기존 30+ kind만 사용. 인라인 헤더/푸터 금지 (글로벌 시스템 별도).

이미지 alt 필수.

## Out of scope

- 신규 위젯 kind 추가
- 페이지 templates 변경 (Track A)
- 새 카테고리 directory (Track C)
- 글로벌 헤더/푸터 변경

## 충돌 회피

본 트랙은 **`src/lib/builder/sections/templates.ts` 단일 파일만 수정**.

부수 변경 가능:
- `src/components/builder/sections/BuiltInSectionsPanel.tsx` (카테고리 렌더 로직, 기존 자동 처리되니 변경 불필요할 가능성 큼)
- `src/lib/builder/sections/__tests__/normalize.test.ts` (snapshot count 검증 추가, optional)

다른 트랙과 disjoint:
- Track A는 `src/lib/builder/templates/{기존-cat}/` 만
- Track C는 `src/lib/builder/templates/{new-cat}/` 신규 디렉토리

## 작업 단위

**카테고리 1개 = 1 commit** (총 ~13 단위). 한 카테고리 안에서:

1. 기존 카테고리면 추가 entry 작성 (기존 entry 수정 X — append만)
2. 신규 카테고리면 `BUILT_IN_SECTION_CATEGORIES` 배열에 추가 + entry 작성
3. 단위 게이트:
   ```bash
   npx tsc --noEmit --incremental false
   npm run test:unit
   ```
4. commit

자동으로 다음 카테고리로 넘어감.

## Commit 메시지 규칙

```
sections(track-b): add {category} templates ({n} items)

BUILT_IN_SECTIONS {old-total} → {new-total}.
{기존|신규} 카테고리 '{category}' 보강.
각 항목 노드 ~{N} (시각 풍부도).

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

## Success criteria

- `BUILT_IN_SECTIONS.length >= 53`
- `BUILT_IN_SECTION_CATEGORIES.length >= 13`
- 모든 entry id 유일
- 각 entry node F2 normalize 통과 (root x:0 y:0)
- `npm run test:unit` 통과
- `npm run build` 통과

## 검증 명령

### 단위 (각 카테고리)
```bash
npx tsc --noEmit --incremental false
npm run test:unit
```

### 카테고리/카운트 확인
```bash
node -e "
  const { BUILT_IN_SECTIONS, BUILT_IN_SECTION_CATEGORIES } = require('./src/lib/builder/sections/templates');
  console.log('total:', BUILT_IN_SECTIONS.length);
  console.log('cats:', BUILT_IN_SECTION_CATEGORIES);
  const byCat = {};
  for (const s of BUILT_IN_SECTIONS) byCat[s.category] = (byCat[s.category] || 0) + 1;
  console.log('per cat:', byCat);
"
```

### 트랙 끝
```bash
npm run typecheck && npm run lint && npm run test:unit && \
  npm run security:builder-routes && npm run build
```

## SESSION.md 갱신 (트랙 끝)

```
## YYYY-MM-DD Track B: Section templates 12 → 53+ 완료
- BUILT_IN_SECTIONS 12 → {N}
- 카테고리 6 → {M} (기존 + stats/pricing/team/gallery/faq/services/contact)
- 각 항목 node 12~25
- 검증: typecheck / lint / test:unit / build 모두 통과
```

## 참조

- `src/lib/builder/sections/templates.ts` — 본 트랙 대상 파일
- `src/lib/builder/sections/normalize.ts` — snapshot 형식
- `src/lib/builder/sections/thumbnail.ts` — SVG thumbnail 자동 생성 (entry는 nodes 정의만)
- `src/components/builder/sections/BuiltInSectionsPanel.tsx` — 렌더링
- `src/lib/builder/decompose/shared.ts` — node helper
