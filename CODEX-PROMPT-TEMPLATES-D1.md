# CODEX 발주 프롬프트 — D1 템플릿 갤러리 통합 + 디자인

> **발행일**: 2026-04-29
> **선행**: B3/B6/B7 디자인 완료, C1 애니메이션 완료, B8 위젯 팩, B9 Lightbox, C2 Forms, C3 Header/Footer
> **분담**: Codex 담당 (디자인 + UI 통합 작업). Claude는 다른 트랙 (Phase 2 모바일 결정 / Anchor 메뉴 위젯 / 기능 추가) 진행.
> **충돌 회피**: D1 = `templates/registry.ts` import 보강 + `TemplateGalleryModal.tsx` 전면 재작성 + 새 PreviewPlaceholder 컴포넌트 + (선택) 썸네일 생성 스크립트. Claude 영역과 파일 분리 명확.

---

## 1. 목적

호정 사이트 빌더의 템플릿 시스템을 **Wix 패리티 수준**으로 끌어올린다.

**현재 상태 (검증 필수)**:
- `/Users/son7/Projects/tseng-law/src/lib/builder/templates/` 디스크에 **170개 템플릿 파일** 존재 (17 카테고리 × 10 페이지: beauty/blog/cafe/consulting/creative/ecommerce/education/fitness/health/law/music/pet/photography/realestate/restaurant/startup/travel)
- `registry.ts`에는 **6 카테고리 (law/restaurant/health/realestate/education/creative) = 60개만 import + 등록**. 나머지 11 카테고리 110개는 disk에 있지만 wiring 누락
- `TemplateGalleryModal.tsx`는 **inline hardcoded 3개 (starter-landing/contact/attorney)만 노출**. `getAllTemplates()` 호출 안 함. 카테고리 필터/검색/썸네일 없음

**Wix 비교**:
| 항목 | Wix | 현재 호정 | 목표 |
|---|---|---|---|
| 템플릿 수 | 800+ | 데이터 170 / UI 3 | **UI 170 노출** |
| 카테고리 | 100+ | 데이터 17 / 등록 6 | **17 모두 등록 + 필터** |
| 썸네일 | 실제 미리보기 이미지 | 없음 | SVG 자동 생성 placeholder (실 이미지는 후속 작업) |
| 카테고리 탭 | 좌측 사이드바 | 없음 | **있음** |
| 검색 | 키워드 검색 | 없음 | **있음** |
| 미리보기 | hover 시 큰 미리보기 | 없음 | hover scale/elevation만 (큰 미리보기는 후속) |

---

## 2. 작업 범위

### 2.1 Registry 보강 (110개 임포트 + 등록 추가)

**현재 누락된 11 카테고리**:
- beauty (10)
- blog (10)
- cafe (10)
- consulting (10)
- ecommerce (10)
- fitness (10)
- music (10)
- pet (10)
- photography (10)
- startup (10)
- travel (10)

**작업**:
1. `/Users/son7/Projects/tseng-law/src/lib/builder/templates/`의 각 누락 카테고리 폴더 안 모든 `.ts` 파일 리스트업 (글로브 또는 직접 ls)
2. 각 파일이 export하는 template 변수명 확인 (예: `beautyHomeTemplate`, `cafeMenuTemplate`)
3. `registry.ts` 상단에 import 추가 (약 110개 import 라인)
4. `allTemplates` 배열에 11 카테고리 그룹별로 주석 + 추가 (`// Beauty (10)` 등)
5. 만약 어떤 파일이 아직 export 안 됐으면 `// TODO: missing export` 주석으로 표시 후 skip

**예시 추가 패턴**:
```typescript
import { beautyHomeTemplate } from './beauty/beauty-home';
import { beautyServicesTemplate } from './beauty/beauty-services';
// ... 나머지 8개
import { blogHomeTemplate } from './blog/blog-home';
// ... 등
```

```typescript
const allTemplates: PageTemplate[] = [
  // ... 기존 60개 ...

  // Beauty (10)
  beautyHomeTemplate,
  // ...

  // Blog (10)
  // ...

  // ... 11 카테고리 모두
];
```

### 2.2 portfolio 카테고리 처리

`/templates/portfolio/` 폴더는 **비어있음** (확인됨). 

**옵션 A**: Skip — `portfolio` 카테고리는 빼고 17 → 16 카테고리로 진행
**옵션 B**: 빈 portfolio 폴더에 portfolio-home, portfolio-projects, portfolio-about, portfolio-contact 등 4-10개 템플릿 신규 작성 (creative와 photography 참고해서 만듦)

**권장**: 옵션 A로 빠르게 진행. 옵션 B는 별도 D2 후속 배치.

### 2.3 TemplateGalleryModal 전면 재작성

**파일**: `/Users/son7/Projects/tseng-law/src/components/builder/canvas/TemplateGalleryModal.tsx`

**현재 구조 제거**:
- inline `STARTER_TEMPLATES` 배열 (3개) 제거
- inline `buildStarterDocument()` 함수 제거 (registry 데이터로 대체)

**새 구조**:

```typescript
import { getAllTemplates, getTemplatesByCategory } from '@/lib/builder/templates/registry';
import type { PageTemplate } from '@/lib/builder/templates/types';
```

**UI 레이아웃**:
- 좌측 200px: 카테고리 탭 (All / Beauty / Blog / ... 17개) — 클릭 시 필터링, 활성 카테고리는 강조
- 상단: 검색 input (placeholder "템플릿 검색...") — name + description + subcategory 필드 검색
- 우측: 카드 그리드 (3-4 columns, gap 16px)
  - 각 카드: 썸네일 (240×160) + 이름 + 카테고리 칩 + description (2줄)
  - hover 시 scale(1.02) + shadow 강화 + "이 템플릿 사용" 버튼 등장
  - 클릭 시 onSelect(template.document) 호출

**기능**:
- 카테고리 필터 (All은 전체, 카테고리 클릭 시 해당 카테고리만)
- 검색 (실시간, debounce 200ms)
- 카드 hover preview (scale + shadow, 썸네일 + 정보)
- 클릭 시 부모 콜백으로 `BuilderCanvasDocument` 전달 (기존 `onSelect` prop 유지)
- 빈 결과 상태: "조건에 맞는 템플릿이 없습니다"

**유지 호환**:
- 기존 props: `{ onSelect: (doc: BuilderCanvasDocument | null) => void; onClose: () => void }`
- "빈 페이지로 시작" 옵션은 maintain (검색 결과 위 또는 카테고리 "All" 옆에 별도 카드)

### 2.4 SVG 자동 생성 썸네일 (Placeholder 시스템)

각 템플릿마다 실제 디자인 이미지는 후속 작업. 이번엔 **template content를 분석해서 자동 생성 SVG placeholder**로 대체.

**파일**: `/Users/son7/Projects/tseng-law/src/components/builder/canvas/TemplateThumbnailPlaceholder.tsx` (신규)

**의도 동작**:
- props: `{ template: PageTemplate, width: 240, height: 160 }`
- template.document.nodes를 240×160 캔버스에 비례 축소해서 SVG로 그림 (text는 회색 직사각형, image는 darker gray, button은 blue rect, 등)
- Wix 템플릿 카드의 wireframe 미리보기와 비슷한 시각

**구현 힌트**:
```typescript
const aspect = template.document.stageWidth / template.document.stageHeight;
const renderWidth = 240;
const renderHeight = 240 / aspect;
const scale = renderWidth / template.document.stageWidth;

return (
  <svg viewBox={`0 0 ${renderWidth} ${renderHeight}`}>
    <rect width="100%" height="100%" fill="#f8fafc" />
    {template.document.nodes.map(node => {
      const x = node.rect.x * scale;
      const y = node.rect.y * scale;
      const w = node.rect.width * scale;
      const h = node.rect.height * scale;
      const color = NODE_KIND_PLACEHOLDER_COLOR[node.kind] ?? '#e2e8f0';
      return <rect key={node.id} x={x} y={y} width={w} height={h} fill={color} rx={2} />;
    })}
  </svg>
);
```

`NODE_KIND_PLACEHOLDER_COLOR`:
- text/heading → `#cbd5e1`
- image → `#94a3b8`
- button → `#3b82f6`
- container/section → `#f1f5f9` 테두리 dashed
- form/form-input/form-textarea/form-submit → `#10b981`
- divider/spacer → `#e5e7eb`
- icon → `#fbbf24`
- video-embed → `#8b5cf6`
- composite → linear-gradient (#cbd5e1 → #94a3b8) — gradient는 SVG defs로

### 2.5 메타데이터 정비 (선택, 시간 남으면)

각 카테고리에 한글 표시명 + 아이콘 매핑:
```typescript
// constants/template-categories.ts (신규)
export const TEMPLATE_CATEGORIES = [
  { key: 'all', label: '전체', icon: '📁', count: 0 /* 자동 계산 */ },
  { key: 'law', label: '법률', icon: '⚖️' },
  { key: 'restaurant', label: '음식점', icon: '🍴' },
  { key: 'health', label: '의료', icon: '🏥' },
  { key: 'realestate', label: '부동산', icon: '🏘️' },
  { key: 'education', label: '교육', icon: '🎓' },
  { key: 'creative', label: '크리에이티브', icon: '🎨' },
  { key: 'beauty', label: '뷰티', icon: '💄' },
  { key: 'cafe', label: '카페', icon: '☕' },
  { key: 'fitness', label: '피트니스', icon: '💪' },
  { key: 'travel', label: '여행', icon: '✈️' },
  { key: 'photography', label: '사진', icon: '📸' },
  { key: 'music', label: '음악', icon: '🎵' },
  { key: 'pet', label: '반려동물', icon: '🐾' },
  { key: 'startup', label: '스타트업', icon: '🚀' },
  { key: 'consulting', label: '컨설팅', icon: '💼' },
  { key: 'ecommerce', label: '쇼핑몰', icon: '🛍️' },
  { key: 'blog', label: '블로그', icon: '📝' },
];
```

---

## 3. 디자인 톤 (Wix 참고)

- **모달**: 풀 스크린에 가깝게 (90vw × 88vh, 둥근 모서리 16px). 진입 fadeIn 200ms
- **헤더**: 좌측 "템플릿 갤러리" + 우측 X 닫기. 아래 검색 input (full-width, 큰 사이즈)
- **좌측 사이드바**: width 200px, 카테고리 리스트 (icon + label + count). 활성: 좌측 4px primary border + bg `#eff6ff` + text `#123b63`
- **중앙 그리드**: 3 columns (1024px+), 2 columns (768~1023), 1 column (모바일). gap 16px
- **카드**: border-radius 12px, white bg, 1px border `#e2e8f0`, shadow none → hover시 elevate (`shadow-lg`)
- **카드 내부**: 썸네일 240×160 (radius 8px on top), 아래 padding 16px, name (font-bold 16px), category chip (small primary bg), description (gray 13px 2-line ellipsis)

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
2. 좌측 레일 "Pages" → "+ New" 클릭 → 템플릿 갤러리 모달 오픈
3. **170개 (또는 160개 portfolio 제외) 카드** 그리드로 노출 확인
4. 좌측 카테고리 탭 클릭 → 해당 카테고리만 필터링 (예: "법률" 클릭 → 10개 표시)
5. 검색창에 "law" 입력 → 검색 결과 좁혀짐
6. 카드 hover → scale + shadow 동작
7. 카드 클릭 → 새 페이지 생성 + 템플릿 도큐먼트로 캔버스 시드
8. 새로고침 후 페이지 유지 확인

---

## 5. 작업 규칙 (`AGENTS.md` 준수)

- **types.ts node kinds 건드리지 말 것** (Phase 3+ 위젯 등록은 다른 트랙)
- **`CanvasContainer.tsx`, `SelectionToolbar.tsx`, `MoveToPageModal.tsx` 건드리지 말 것** (Claude 영역)
- **`SiteHeader.tsx`/`SiteFooter.tsx` 건드리지 말 것** (legacy fallback 보존)
- **lightbox 관련 파일 건드리지 말 것** (B9 Claude 영역)
- legacy-*.tsx 본문 수정 금지
- composite/Render.tsx legacy 폴백 제거 금지
- `tree.ts` / `seed-home v` 변경 금지
- `git push --force`, `--no-verify` 금지

---

## 6. 단계별 작업 (이 순서로)

### Step 1: registry.ts 보강
- 11 카테고리 폴더 ls → 각 파일 export명 확인 → import + array 추가
- 110개 추가 (각 카테고리 10개)

### Step 2: TEMPLATE_CATEGORIES 메타 정의
- 신규 파일: `src/components/builder/canvas/template-categories.ts` (또는 적절한 위치)

### Step 3: TemplateThumbnailPlaceholder 컴포넌트
- SVG 자동 wireframe 렌더

### Step 4: TemplateGalleryModal 전면 재작성
- 좌측 카테고리 + 상단 검색 + 우측 그리드
- `getAllTemplates()` 호출 + filter/search 적용
- "빈 페이지" 카드도 추가 (옵션 A: 카테고리 "All"의 첫 카드)

### Step 5: 호환성 검증
- PageSwitcher.tsx에서 TemplateGalleryModal 호출 패턴 확인 → 기존 prop 유지 (`onSelect(doc | null)`, `onClose()`)

### Step 6: lint/build/tsc + 브라우저

---

## 7. Definition of Done

- [ ] `registry.ts` 17 (또는 16) 카테고리 모두 import + array
- [ ] `getAllTemplates()` 반환 ≥ 160 템플릿
- [ ] `TemplateGalleryModal` 카테고리 사이드바 + 검색 + 그리드 + 썸네일 동작
- [ ] `TemplateThumbnailPlaceholder` 컴포넌트로 노드 wireframe 표시
- [ ] hover/click/필터/검색 모두 정상
- [ ] 빈 결과 empty state
- [ ] lint/build/tsc 통과
- [ ] 브라우저 검증 8단계 통과
- [ ] SESSION.md commit + 한줄 요약 갱신
- [ ] 인수인계 § D1 신설

---

## 8. 인수인계

작업 완료 시:
1. commit (분할 권장):
   - `D1-1 wire 11 missing template categories to registry`
   - `D1-2 template categories metadata + thumbnail placeholder component`
   - `D1-3 rewrite TemplateGalleryModal with sidebar/search/grid`
2. SESSION.md 갱신 (분담 표 + Codex S-09):
   ```
   ## 작업 분담 갱신
   | D1 템플릿 갤러리 | Codex | ✅ 완료 (`<hash>`) — 16 카테고리 × 10 = 160 템플릿 노출, 사이드바/검색/SVG 썸네일 |
   ```
3. 한줄 요약 갱신, "Wix 체감" 점수 추정 갱신
4. (선택) 후속 D2 제안: portfolio 폴더 채우기, 실제 썸네일 이미지 생성, site-level 템플릿(여러 페이지 묶음)

---

## 9. 후속 (D2 / D3 후보, 이번 배치 범위 외)

- **D2 portfolio 카테고리 신규** — creative/photography 참고하여 portfolio-home/projects/about/contact/process 등 10개 작성
- **D3 site-level 템플릿** — `BuilderSiteTemplate = { id, name, pages: PageTemplate[] }` 타입 신설. "법률사무소 풀 사이트" 같이 10개 페이지 한 번에 생성
- **D4 실제 썸네일 이미지 생성** — Playwright headless로 각 템플릿 렌더 후 240×160 PNG 캡처 → CDN 업로드. 또는 design tool에서 수작업
- **D5 템플릿 즐겨찾기 + 최근 사용** — localStorage 기반

---

이 프롬프트: `/Users/son7/Projects/tseng-law/CODEX-PROMPT-TEMPLATES-D1.md`. Codex 던질 때 경로만 알려주면 됨.
