# CODEX 발주 프롬프트 — E1 블로그/칼럼 시스템 디자인

> **발행일**: 2026-04-30
> **선행**: B3/B6/B7 디자인 시스템, C1 애니메이션, D1 템플릿 갤러리 모두 완료
> **분담**: Codex 담당 — Blog Manager admin UI 재디자인 + 블로그 위젯 시각 디자인. Claude Agent는 별 트랙으로 blog widget kinds + data adapter 진행 중.
> **충돌 회피**: E1은 admin pages 디자인 + ColumnEditor 메타 패널 시각 + blog-feed layout 4종 CSS. Claude는 schema/registry/widget render 로직. 파일 분리됨.

---

## 1. 목적

호정 사이트의 **칼럼/블로그 시스템을 Wix Blog 수준의 시각/UX**로 끌어올린다. 사용자(`tseng-law.com` 운영자)가 블로그 글을 작성·수정·발행하는 흐름을 **한 곳(Blog Manager admin)에서 우아하게** 끝낼 수 있어야 함.

**사용자 요구**:
1. 칼럼 들어가면 블로그식 글 정리 (이미 부분 가능, 시각 부족)
2. 클릭 시 본문 이동 (이미 가능)
3. **편집기에서 글 올리고 수정** ← 이게 핵심 (현재 ColumnEditor는 기능만, 디자인 부족)
4. 블로그 기능 — **카테고리/태그/저자/featured/발행일/SEO 메타 편집** 패널 필요

---

## 2. 작업 범위

### 2.1 Blog Manager Admin 재디자인 (가장 중요)

**대상 파일**:
- `/Users/son7/Projects/tseng-law/src/components/builder/columns/ColumnListView.tsx` (목록)
- `/Users/son7/Projects/tseng-law/src/components/builder/columns/ColumnEditor.tsx` (에디터)
- `/Users/son7/Projects/tseng-law/src/components/builder/columns/ColumnFrontmatterPanel.tsx` (메타)
- `/Users/son7/Projects/tseng-law/src/components/builder/columns/NewColumnModal.tsx` (신규 생성)
- `/Users/son7/Projects/tseng-law/src/app/(builder)/[locale]/admin-builder/columns/page.tsx` (라우트)
- `/Users/son7/Projects/tseng-law/src/app/(builder)/[locale]/admin-builder/columns/[slug]/edit/page.tsx`
- `/Users/son7/Projects/tseng-law/src/app/column-editor.css`

**현재 상태**: ColumnEditor가 있긴 한데 raw HTML 폼 수준. `column-editor.css`는 minimal.

**목표 디자인 (Wix Blog Manager 참고)**:

#### 2.1.1 목록 페이지 `/admin-builder/columns`
- 좌측 200px 사이드바: 카테고리 7종 (DEFAULT_BLOG_CATEGORIES) + "전체" + "+ 새 카테고리"
- 상단: 검색 input + "+ 새 칼럼" 버튼 (강조)
- 메인: 포스트 카드 그리드 (3 columns @ desktop)
  - 각 카드: featured image (또는 placeholder) 240×140 + 제목 (font-bold 16px) + excerpt 2줄 + 카테고리 chip (color from category) + 저자 + 발행일 + reading time
  - 상단 우측: featured 토글 (별 모양) / 메뉴 ⋯ (편집/발행/숨김/삭제)
  - hover: scale 1.01 + shadow elevate
- 빈 상태: "아직 칼럼이 없습니다. + 새 칼럼 클릭"

#### 2.1.2 에디터 페이지 `[slug]/edit`
- 3 컬럼 레이아웃:
  - **좌측 메타 패널 320px** (ColumnFrontmatterPanel): 발행 상태 / 카테고리 select / 태그 input chips / 저자 select / 발행일 / featured 토글 / featured image 업로드 / SEO (title/description/og image / noIndex)
  - **중앙 에디터** (ColumnEditor): 풀 너비 TipTap, 상단 sticky toolbar (B/I/U/H1~H3/리스트/링크/이미지/quote/code/separator/HTML)
  - **우측 미리보기 320px** (선택 토글): published 사이트의 본문 영역 그대로 미리보기
- 상단 sticky bar: 제목 입력 (큰 글씨) + 저장 상태 (녹색 ✓ Saved / 노랑 saving) + 발행/임시저장/미리보기/공개 페이지 열기 버튼

#### 2.1.3 신규 칼럼 모달 (`NewColumnModal.tsx`)
- 현재 단순 slug input → 더 풍부하게:
- 제목 + slug (자동 생성) + 카테고리 + 저자 + (선택) 템플릿 ("빈 글 / 회사설립 가이드 / Q&A / 사례 분석" 4종)

### 2.2 Blog Widget 시각 (4 layout)

**4 layout CSS variants** — `blog-feed` widget의 layout prop:

#### 2.2.1 `grid` layout (기본)
- 3 columns desktop, 2 tablet, 1 mobile
- 카드: featured image top (16:9), padding 16px, 제목/excerpt/메타
- gap 24px

#### 2.2.2 `list` layout
- 1 column 풀너비
- 카드: 좌측 image 240×160, 우측 content. 제목 큰 폰트 (h2), excerpt 3줄
- separator border-bottom

#### 2.2.3 `masonry` layout
- 3 columns desktop, 가변 높이 (Pinterest-style)
- 카드 내 이미지 비율 유지 (object-fit: cover, height auto)
- CSS columns 또는 grid auto-flow dense

#### 2.2.4 `featured-hero` layout
- 첫 포스트는 풀너비 hero (50vh, 큰 이미지 + overlay + 제목 위에)
- 나머지 포스트는 grid 2 columns

**파일**:
- 신규: `src/lib/builder/components/blogFeed/BlogFeed.module.css` (또는 styled-jsx)
- 또는 inline style + classnames

### 2.3 Post Card 디자인 polish

각 카드 공통 디자인 (`blog-post-card` widget):
- **카테고리 chip**: 카테고리 color, white text, padding 4px 10px, radius 20px, font-size 11px
- **reading time**: clock icon (⏱️) + "5분 읽기"
- **저자**: avatar (32px circle) + name + (옵션) 짧은 직책
- **발행일**: 한국어 포맷 ("2026.04.30")
- **featured 표시**: 우상단 별 ⭐ 또는 "FEATURED" 라벨
- hover: featured image scale 1.05 + elevate shadow + 제목 underline

### 2.4 카테고리 chip 디자인

`DEFAULT_BLOG_CATEGORIES` 7종 + 사용자 추가:
- 회사설립 #3b82f6 (blue)
- 교통사고 #ef4444 (red)
- 노동법 #10b981 (emerald)
- 이혼/가사 #f59e0b (amber)
- 형사 #8b5cf6 (violet)
- 상속 #06b6d4 (cyan)
- 일반 #6b7280 (gray)

각 카테고리에 한국어 + 중문 + 영문 표시 (locale 따라).

### 2.5 디자인 토큰 통합

기존 `BuilderTheme` (B7)와 통합:
- 카드 background → `theme.colors.background` (light) / `theme.darkColors.background` (dark)
- 텍스트 → `theme.colors.text`
- 카테고리 chip의 white text는 다크모드에서도 그대로 (가독성)
- featured image overlay → `rgba(0,0,0,0.4)` (light) / `rgba(0,0,0,0.6)` (dark)

### 2.6 애니메이션 (C1 활용)

블로그 위젯에 자동 entrance 적용:
- 카드 entrance: `slide-up` 200ms stagger 50ms (위에서 아래로)
- featured-hero: `fade-in` 600ms
- hover: `lift` (B7 hover preset 사용)

---

## 3. 검증 방법

```bash
cd /Users/son7/Projects/tseng-law
npm run lint
npm run build
npx tsc --noEmit --incremental false
```

**브라우저**:
1. `/ko/admin-builder/columns` → 새 디자인 목록 (사이드바/카드 그리드)
2. 카드 hover → scale + shadow + featured image zoom
3. + 새 칼럼 → 풍부한 모달 (카테고리/저자 선택)
4. `/ko/admin-builder/columns/test-001/edit` → 3 컬럼 레이아웃 (메타/에디터/미리보기)
5. 메타 패널에서 카테고리/태그/저자/featured/SEO 편집 → 자동 저장
6. 발행 후 `/ko/columns` → 블로그 위젯이 적용된 페이지 (Claude agent 작업과 통합)
7. 카드 클릭 → `/ko/columns/[slug]` 본문
8. 다크모드 토글 → 카드 색 자동 전환

---

## 4. 작업 규칙 (`AGENTS.md` 준수)

- **Claude Agent 영역 건드리지 말 것**:
  - `src/lib/builder/canvas/types.ts` 신규 blog kinds 추가 (Claude 영역)
  - `src/lib/builder/components/blogFeed/`, `blogPostCard/`, `blogCategories/`, `blogArchive/`, `featuredPosts/` 폴더 안의 Element/index.ts (Claude 영역)
  - `src/lib/builder/components/registry.ts` blog widget 등록 (Claude)
  - `src/lib/builder/blog/column-adapter.ts` (Claude)
- **Codex 자유 영역**: ColumnListView/ColumnEditor/ColumnFrontmatterPanel/NewColumnModal **시각** + admin pages 레이아웃 + blogFeed/blogPostCard 등의 Inspector 컴포넌트 + CSS + 카테고리 색/chip 디자인
- legacy-*.tsx 본문 수정 금지
- composite/Render.tsx legacy 폴백 제거 금지
- `tree.ts` / `seed-home v` 변경 금지
- `git push --force`, `--no-verify` 금지

---

## 5. Definition of Done

- [ ] ColumnListView 카드 그리드 + 카테고리 사이드바 + 검색
- [ ] ColumnEditor 3컬럼 레이아웃 (메타 좌 / 에디터 중 / 미리보기 우)
- [ ] ColumnFrontmatterPanel — 카테고리/태그/저자/featured/발행일/SEO 모두 시각 편집
- [ ] NewColumnModal 풍부한 폼
- [ ] blog-feed 4 layout CSS (grid/list/masonry/featured-hero)
- [ ] post card 디자인 (chip/reading time/저자/featured 라벨)
- [ ] 카테고리 chip 7색 + 다크모드 호환
- [ ] entrance 애니메이션 자동 적용 (C1 활용)
- [ ] lint/build/tsc 통과
- [ ] 브라우저 검증 8단계 통과
- [ ] SESSION.md commit hash + 항목 추가
- [ ] 인수인계 § 3.1G E1 신설

---

## 6. 인수인계

작업 완료 시:
1. commit (분할 권장):
   - `E1-1 column manager admin redesign (list + sidebar + cards)`
   - `E1-2 column editor 3-column layout (meta/editor/preview)`
   - `E1-3 blog feed 4 layouts visual design`
   - `E1-4 post card + category chips design tokens`
2. SESSION.md 갱신 + 한줄 요약 갱신
3. Claude Agent 영역(blog kinds + adapter) 충돌 없음 확인 (파일 분리됨)
4. 다음 세션 후보 제안 (`E2 댓글 시스템`, `E3 RSS feed`, `E4 SEO 추가 기능` 등)

---

이 프롬프트: `/Users/son7/Projects/tseng-law/CODEX-PROMPT-BLOG-DESIGN-E1.md`. Codex 던질 때 경로만 알려주면 됨.
