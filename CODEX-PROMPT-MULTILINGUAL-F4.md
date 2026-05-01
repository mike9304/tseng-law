# CODEX 발주 프롬프트 — F4 다국어 콘텐츠 Sync 시스템

> **발행일**: 2026-04-30
> **선행**: B/C/D/E 시리즈 + F1/F2/F3 진행 중
> **분담**: Codex 담당 (Translation Manager 디자인 + 매트릭스 UI + AI 번역 통합). Claude Agent는 별 트랙으로 다른 P0/P1 진행.
> **Wix 디자인 참조**: Wix Multilingual / Translation Manager — 좌측 source 언어, 우측 target 언어 매트릭스. translator role + 진행률 바 + per-string sync 상태.

---

## 1. 목적

호정 사이트는 **ko / zh-hant / en 3개 locale 운영 중**. 현재 locale 전환 UI만 있고 콘텐츠는 수동 동기화. 운영자가 한국어로 작성 후 중문/영문 매번 별도 작업 = daily pain.

목표: **한 번 작성 → 자동/AI 번역 → 검토 → 게시** 흐름.

---

## 2. Wix 디자인 패턴 참조

### 2.1 Translation Manager (Wix 본가)
- **좌측 사이드바 240px**: 페이지 트리 / 사이트 콘텐츠 카테고리 (Pages / Menu / Site name / Blog posts / Forms)
- **우측 매트릭스**:
  - 헤더: source 언어 (ko 🇰🇷) + 추가 언어 컬럼 (zh-hant 🇹🇼 / en 🇺🇸)
  - 행: 각 콘텐츠 (페이지 제목/본문 단락/메뉴 항목 등)
  - 셀: 번역 텍스트 + 상태 dot (녹: translated / 노: outdated / 빨: missing / 회: manual)
  - 클릭 시 인라인 textarea 편집
- **상단 toolbar**: 진행률 바 (`zh-hant: 78% (45/58)`) + "AI translate all missing" 버튼 + "Export PO" + filter (translated/outdated/missing)

### 2.2 Quick locale switcher (in-context)
- 페이지 에디터 우상단에 `🇰🇷 ko ▼` 드롭다운
- 클릭 시 다른 locale 페이지로 즉시 전환 (현재 노드 ID 매칭되는 경우 같은 위치 유지)

### 2.3 Outdated indicator
- 원본(ko) 수정 시 다른 locale의 매핑된 string은 자동 "outdated" 상태로 전환. UI에 노란 점 + "원본이 변경됨" tooltip.

---

## 3. 작업 범위

### 3.1 데이터 모델

```typescript
// src/lib/builder/translations/types.ts (신규)

export type TranslationStatus = 'translated' | 'outdated' | 'missing' | 'manual';

export interface TranslationEntry {
  key: string;                         // unique id (page-id:field-path)
  sourceLocale: Locale;                // 원본 locale (보통 'ko')
  sourceText: string;
  sourceHash: string;                  // sha256, source 변경 감지
  translations: Partial<Record<Locale, {
    text: string;
    status: TranslationStatus;
    sourceHashAtTranslation: string;   // outdated 감지용
    translatedBy: 'manual' | 'ai-openai' | 'ai-deepl';
    translatedAt: string;
    reviewedBy?: string;
  }>>;
}

export interface TranslationContent {
  pageId?: string;
  contentType: 'page-title' | 'page-meta' | 'node-text' | 'node-button-label' | 'menu-item' | 'site-name' | 'column-title' | 'column-body';
  contentRef: string;                  // node id, slug, etc
}

// Site doc 추가:
// BuilderSiteDocument.translations: TranslationEntry[]
```

### 3.2 Translation Manager Admin

**라우트**: `/admin-builder/translations` (server component)

**UI 구조** (Wix 패턴 미러):
- 좌측 사이드바 (240px): 카테고리 트리
  - "전체" + 진행률
  - "페이지" → 각 페이지 (홈/about/services/...)
  - "사이트 메뉴"
  - "사이트 메타" (sitename/description/seo)
  - "블로그 칼럼" → 각 칼럼
  - "Forms" → 폼 라벨/플레이스홀더
- 메인 (남은 폭):
  - 상단 sticky toolbar: locale 컬럼 토글 + 진행률 바 + "AI 번역 일괄" + filter
  - 매트릭스 테이블: 각 행 = 1 string. 컬럼 = source + targets. 상태 dot. 인라인 편집.
  - 빈 상태 / 검색 / 일괄 선택

**파일**:
- `src/app/(builder)/[locale]/admin-builder/translations/page.tsx`
- `src/components/builder/translations/TranslationManagerView.tsx`
- `src/components/builder/translations/TranslationMatrix.tsx`
- `src/components/builder/translations/TranslationCell.tsx`
- `src/components/builder/translations/TranslationProgress.tsx`
- `src/components/builder/translations/TranslationCategoryTree.tsx`

### 3.3 AI 번역 통합

**제공자 옵션**:
- **OpenAI** (`gpt-4o-mini`) — 가장 다국어 자연스러움, env `OPENAI_API_KEY` 필요
- **DeepL** — 번역 품질 최고, env `DEEPL_API_KEY` 필요 (선택)
- **Google Translate** — 무료 한도 있음 (선택)

**프롬프트 템플릿** (OpenAI):
```
You are translating Korean (ko) legal content to {target}. Maintain:
- Tone (professional, formal)
- Legal terminology (e.g. "민법" → traditional Chinese 民法 / English "Civil Law")
- Brand: 호정국제 → 浩正國際 (zh-hant) / Hojeong International (en)
Return JSON: { "text": "..." }

Source: {sourceText}
```

**API**:
- `POST /api/builder/translations/translate` — Body `{ sourceLocale, targetLocale, sourceText, provider }` → return translated text
- `POST /api/builder/translations/translate-batch` — 일괄

### 3.4 Sync 로직

**자동 등록**:
- ColumnEditor / 페이지 텍스트 노드 / Menu item / SiteSettings 변경 시 → 자동 TranslationEntry 등록 또는 sourceHash 갱신
- sourceHash 갱신 시 다른 locale 번역들 status='outdated'로 자동 변경

**수동 적용**:
- TranslationMatrix에서 사용자가 인라인 편집 → 즉시 저장 + status='manual'
- "AI translate" 버튼 → API 호출 → 결과 채우기 + status='translated'

### 3.5 Quick locale switcher (페이지 에디터 통합)

`SandboxPage.tsx` 우상단 (또는 toolbar)에 LocaleSwitcher 컴포넌트 (이미 `LocaleSwitcher.tsx` 존재 — 재활용 또는 강화):
- 클릭 시 드롭다운: ko / zh-hant / en + 각 locale의 진행률 small badge
- 선택 시 `/{newLocale}/admin-builder` 또는 `/{newLocale}/admin-builder/columns/[slug]/edit` 등 매핑된 라우트로 이동

### 3.6 Outdated 자동 표시

ColumnEditor / 페이지 노드 inspector에서 현재 source(ko) 수정 시:
- 다른 locale 매핑된 항목 status='outdated' 자동
- 페이지 우상단에 작은 alert: "이 페이지의 영문/중문 번역이 outdated. Translation Manager에서 갱신 필요"
- 클릭 시 Translation Manager의 해당 카테고리로 이동

### 3.7 Export / Import (선택)

- Export PO file (gettext 표준) — 외부 번역 서비스 활용 가능
- Import PO file → translations 일괄 갱신

---

## 4. 디자인 톤 (Wix 패턴)

- 매트릭스 테이블: minimal, white bg, 행 높이 48px, hover 시 `#f8fafc` bg
- 상태 dot: 8px circle. 녹 `#10b981`, 노 `#f59e0b`, 빨 `#ef4444`, 회 `#94a3b8`
- 진행률 바: blue gradient, animated fill on update
- 카테고리 트리: caret + 들여쓰기, 활성 시 primary border-left
- 인라인 편집: 셀 클릭 → textarea expand (자동 height) + Esc 취소 / Enter 저장
- 빈 상태: 친근한 일러스트 + "아직 번역할 콘텐츠가 없습니다"
- 다크모드 호환

---

## 5. 검증 방법

```bash
cd /Users/son7/Projects/tseng-law
npm run lint
npm run build
npx tsc --noEmit --incremental false
```

**브라우저**:
1. `/ko/admin-builder/translations` 진입 → 카테고리 트리 + 진행률
2. 카테고리 "페이지" → "홈" 선택 → 모든 string 매트릭스
3. zh-hant 컬럼 셀 클릭 → 인라인 편집 → 저장
4. "AI 번역" 클릭 → OpenAI 호출 → 셀 채워짐
5. ColumnEditor에서 한국어 칼럼 수정 → translations에 outdated 마크
6. 우상단 LocaleSwitcher → zh-hant 클릭 → 같은 페이지의 zh-hant 버전 진입
7. 게시 사이트 → 다른 locale 진입 시 번역된 콘텐츠 표시

---

## 6. 작업 규칙

- **F1/F2/F3 영역 건드리지 말 것**: TopBar viewport switcher / Layers Panel / responsive schema / registry 정합성
- **E1 영역 건드리지 말 것**: ColumnEditor 본문, ColumnFrontmatterPanel — 단, ColumnEditor 우상단에 "outdated" alert는 추가해야 하면 별도 컴포넌트로 mount
- legacy-*.tsx 본문 수정 금지
- composite/Render.tsx legacy 폴백 제거 금지
- `git push --force`, `--no-verify` 금지

## 7. Definition of Done

- [ ] TranslationEntry 스키마 + Site doc 통합
- [ ] Translation Manager admin UI (카테고리 + 매트릭스 + 진행률 + AI 일괄)
- [ ] AI 번역 API (OpenAI 우선, DeepL 선택)
- [ ] sourceHash 변경 감지 → outdated 자동
- [ ] 인라인 편집 + 즉시 저장
- [ ] LocaleSwitcher 강화 (진행률 표시)
- [ ] ColumnEditor outdated alert
- [ ] lint/build/tsc 통과
- [ ] 브라우저 검증 7단계 통과
- [ ] SESSION.md commit hash + 항목 추가

---

이 프롬프트: `/Users/son7/Projects/tseng-law/CODEX-PROMPT-MULTILINGUAL-F4.md`
