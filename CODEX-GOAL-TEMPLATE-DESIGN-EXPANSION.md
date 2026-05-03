# CODEX /goal 작업 지시서 — 디자인 템플릿 Wix급 확장

> **발행일**: 2026-05-03 매니저 (Claude Opus)
> **목적**: 호정 빌더의 디자인 템플릿(Page + Section)을 Wix급 시각 풍부도로 확장.
> **현재 상태**:
> - **Page templates**: 19 카테고리 × 10 = 170 (portfolio 0). 각 페이지 평균 5~6 노드.
> - **Section templates** (`BUILT_IN_SECTIONS`): 12개 (6 카테고리 × 2).
> - 시각 풍부도가 Wix 평균(50~150 노드/페이지) 대비 **20~30% 수준**.
> - quality 향상 후 마스터 플랜 점수: 호정 데모 75 → 80~85, Wix-replacement 30 → 40~45.

---

## 0. /goal 사용 룰 (사용자 → Codex)

이 문서는 **사용자가 Codex `/goal`로 직접 던질 수 있는 self-contained 지시서**이다. Codex는 goal을 받으면 자동으로:
1. 현재 코드 / 마스터 플랜 / 검증 기준 읽기
2. 각 트랙 별 work breakdown
3. 단위 작업 실행 + 자동 게이트 (typecheck / lint / test:unit / security / build)
4. 끝나면 SESSION.md 갱신

**사용자는 트랙별로 별도 /goal 인스턴스 발주 가능** (Track A·B·C disjoint 디렉토리라 동시 진행 안전).

---

## 1. 트랙 구조 (3 트랙, disjoint)

| 트랙 | 영역 | 디렉토리 | 충돌 가능성 |
|---|---|---|---|
| **A** | 기존 19 카테고리 × 10 페이지 quality 향상 | `src/lib/builder/templates/{cat}/*.ts` | 없음 (각 카테고리 disjoint) |
| **B** | Section templates 12 → 50+ expansion | `src/lib/builder/sections/templates.ts` 단일 파일 | A와 disjoint (sections 디렉토리만) |
| **C** *(옵션)* | 신규 카테고리 +10~15 추가 | `src/lib/builder/templates/{new-cat}/*.ts` (신규 디렉토리) | A와 무충돌 (새 디렉토리만) |

권장 순서: **A 먼저** → 그 동안 사용자가 C(신규 카테고리) 발주 → 두 트랙 끝나면 B.

---

## 2. 공통 디자인 룰 (모든 트랙 공통)

### 2.1 디자인 토큰

기존 token 그대로 활용. 새 색상/폰트 정의 금지.

```
색상: 카테고리 카테고리별 BuilderTheme.colors 활용
  - primary / secondary / accent / text / background / muted
  - 직접 hex 사용 시 반드시 brand-aligned (호정 #123b63 / #1e5a96 / #e8a838 톤)
폰트: --font-heading-ko / --font-body / Google Fonts (이미 등록된 것)
spacing: 8 / 16 / 24 / 32 / 48 / 64 / 96 / 128 px rhythm
borderRadius: 0 / 4 / 8 / 12 / 16 / 24 / 9999 (원형 — Wave3 F3에서 max(9999) 풀림)
```

### 2.2 시각 풍부도 목표 (페이지당)

**기존**: 5~10 노드. 평탄. 시각 hierarchy 약함.

**목표**: 페이지당 **40~70 노드**, 섹션 **5~7개**, 각 섹션 **6~12 노드**.

페이지 1장에 다음 구조 권장 (카테고리에 따라 가감):
1. **Header** (logo / nav / CTA) — 글로벌 헤더 외 인페이지 sticky 옵션
2. **Hero** — 타이틀 + 서브 + CTA 1~2 + 백그라운드 이미지 / 그라디언트 / 도형 액센트
3. **Value props / Features** — 3~4 카드 (icon + title + body)
4. **Stats / Counter** — 4 metric (number + label + delta) 또는 logo grid
5. **Showcase** — 카드 / 갤러리 / case study / portfolio
6. **Testimonial / Social proof** — 1~3 quote + avatar + role
7. **CTA banner** — 큰 행동 유도
8. **Footer** — 글로벌 푸터 외 인페이지 contact
9. (옵션) Pricing / Team / FAQ / Blog teaser / Newsletter signup

### 2.3 컴포넌트 사용

신규 위젯 **kind 추가 금지**. 기존 30+ kind 활용:
- container / section / text / heading / image / button / divider / spacer / icon
- columnCard / columnList / attorneyCard / blogPostCard / blogFeed / featuredPosts
- contactForm / formInput / form / formSelect / formTextarea / formCheckbox / formRadio / formSubmit
- ctaBanner / faqList / gallery / map / videoEmbed / customEmbed
- bookingWidget

### 2.4 헤더/푸터

페이지 템플릿에는 헤더/푸터 **인라인 노드 포함하지 마**. 글로벌 `headerCanvas` / `footerCanvas`가 별도 처리. 페이지 템플릿의 `stageHeight`는 **Hero ~ 마지막 인페이지 섹션까지**.

### 2.5 이미지

기존 placeholder 패턴 유지: `/public/images/{slug}/featured-XX.jpg` 같은 경로 또는 `https://images.unsplash.com/...` 형태 (현재 다른 템플릿이 이미 사용하는 패턴 따라가기).

**alt 텍스트 필수**. 빈 alt 금지 (publish-gate가 잡음).

### 2.6 className hint 활용

heuristic-defaults가 자동 entrance/hover 적용:
- 텍스트 노드 `className: 'hero-title' | 'hero-subtitle' | 'hero-eyebrow' | 'section-label' | 'hero-cta'` → slide-up 자동
- 컨테이너 `className: 'office-card' | 'services-detail-card' | 'stat-card' | 'split-text' | 'split-image' | 'card-copy' | 'card-title'` → slide-up 자동
- button kind → hover lift 자동
- 큰 이미지 (≥400×240) → fade-in 자동

이 className 적극 활용해서 자동 모션 받게 작성.

---

## 3. Track A — 기존 19 카테고리 페이지 quality 향상

### 3.1 Goal (one-line)

> 19 카테고리 × 10 페이지 (총 170 페이지 템플릿)을 평균 5~6 노드 → **40~70 노드**로 확장. 시각 풍부도 +5~10배.

### 3.2 In scope

- 카테고리: blog / law / restaurant / ecommerce / health / beauty / cafe / consulting / creative / education / fitness / music / pet / photography / realestate / startup / travel
- portfolio (현재 0개)는 **Track C로 미룸**
- 각 페이지: home / about / contact / services or menu or attorneys or shop / pricing or rates / blog or article / testimonials or reviews / faq / privacy 또는 카테고리 특수 페이지

### 3.3 Out of scope (이 트랙에서 안 함)

- 신규 카테고리 추가 (Track C)
- 신규 위젯 kind 추가 (별도 트랙)
- Section templates 추가 (Track B)
- 글로벌 헤더/푸터 변경 (이미 시스템 있음)
- 다국어 콘텐츠 (현재 ko 콘텐츠 위주, en/zh-hant는 별도)

### 3.4 작업 단위

**카테고리당 1 단위** (총 17 단위 — portfolio 제외, 1개씩 자율 break-down).

각 단위:
1. 카테고리 폴더 (`src/lib/builder/templates/{cat}/`) 10 파일 모두 read
2. 카테고리 톤 정의 (modern / classic / bold / minimal / editorial 중 1)
3. 10 페이지 모두 위 § 2.2 구조로 재작성
   - 노드 수 목표: 페이지당 40~70
   - 섹션 6+
4. 단일 카테고리 단위 게이트:
   - `npx tsc --noEmit --incremental false`
   - `npm run test:unit -- src/lib/builder/templates/__tests__/registry.test.ts`
   - registry test 모두 통과 (170 templates parse + node id unique + parent ref valid)
5. 카테고리 commit

### 3.5 Success criteria

- 모든 카테고리 작업 후 `npm run test:unit` 통과 (XFAIL 0 — 추가로 실패 0)
- `npm run build` 통과
- 평균 노드 수 ≥ 40 (각 카테고리 별 측정)
- 새 import / 새 위젯 kind 추가 0
- registry export count 그대로 170 + 0개 (제거 / 추가 0)

### 3.6 검증 명령

```bash
# 단위 검증 (각 카테고리 끝날 때마다)
npx tsc --noEmit --incremental false
npm run test:unit -- src/lib/builder/templates

# 노드 수 평균 측정 (sanity check)
for cat in blog law restaurant ecommerce health beauty cafe consulting creative \
           education fitness music pet photography realestate startup travel; do
  total=0
  for f in src/lib/builder/templates/$cat/*.ts; do
    n=$(grep -cE "^\s*createContainerNode|^\s*createTextNode|^\s*createButtonNode|^\s*createImageNode|^\s*heading\(" "$f" 2>/dev/null)
    total=$((total + n))
  done
  echo "$cat avg ~$((total / 10)) nodes/page"
done

# 전체 게이트 (트랙 끝)
npm run typecheck && npm run lint && npm run test:unit && \
  npm run security:builder-routes && npm run build
```

### 3.7 commit 권장 단위

각 카테고리 1 commit:
```
templates(cat): expand {category} 10 pages to 40~70 node Wix-grade quality

- {category} 10 페이지 모두 hero+value+stats+showcase+testimonial+cta 구조
- node count 평균 ~50 (이전 ~5~6)
- className hint 활용으로 heuristic entrance/hover 자동 적용
- registry test pass (170 templates 그대로)
```

---

## 4. Track B — Section templates 50+ expansion

### 4.1 Goal (one-line)

> `src/lib/builder/sections/templates.ts`의 `BUILT_IN_SECTIONS` 12 → **50+**, 카테고리 6 → **10+**.

### 4.2 In scope

기존 6 카테고리 × 2 (= 12)에서 다음으로 확장:

| 카테고리 | 현재 | 목표 | 신규 항목 예시 |
|---|---|---|---|
| hero | 2 | 5 | hero-centered-cta / split-image / video-bg / parallax / minimal-eyebrow |
| features | 2 | 5 | 3-col / 4-col / icon-grid / alternating-rows / large-feature-card |
| testimonials | 2 | 5 | quote-cards / quote-grid / single-spotlight / video / logo-grid |
| cta | 2 | 5 | banner-centered / split-with-image / gradient-bg / dark-band / newsletter |
| footer | 2 | 4 | 3-col / 4-col-with-newsletter / minimal / contact |
| legal | 2 | 3 | disclaimer / privacy-summary / cookie-banner |
| **stats** *(신규)* | 0 | 4 | counter-row / metric-grid / logo-strip / award-badges |
| **pricing** *(신규)* | 0 | 4 | 3-tier / 2-tier-comparison / single-plan / table |
| **team** *(신규)* | 0 | 4 | grid-cards / horizontal-row / featured-leader / mosaic |
| **gallery** *(신규)* | 0 | 4 | grid / masonry / carousel-thumb / lightbox-grid |
| **faq** *(신규)* | 0 | 3 | accordion / 2-col-grid / category-tabs |
| **services** *(신규)* | 0 | 4 | 3-col-icon / list-with-image / accordion / pricing-card |
| **contact** *(신규)* | 0 | 3 | form-with-info / map-and-form / split-info |

**목표 합계: ≥ 53.**

### 4.3 작업 단위

`BUILT_IN_SECTIONS` 배열에 항목 추가. 한 번에 1 카테고리 분 (~3~5 항목) 단위로 commit.

각 새 entry는 F2의 `normalizeSavedSectionSnapshot` 통과 형태:
- root 노드는 x:0, y:0
- descendants는 parent-local 좌표
- root는 detached (parentId undefined)

### 4.4 Success criteria

- `BUILT_IN_SECTIONS.length >= 53`
- `BUILT_IN_SECTION_CATEGORIES` 13개 이상 (기존 6 + 신규 7+)
- `getBuiltInSectionsByCategory()` 기존 6에 신규 7 카테고리 추가
- `npm run test:unit` 통과 (XFAIL 0)
- `npm run build` 통과

### 4.5 검증 명령

```bash
npm run typecheck
npm run test:unit
npm run build

# 카테고리/카운트 확인
node -e "
  const { BUILT_IN_SECTIONS, BUILT_IN_SECTION_CATEGORIES } = require('./src/lib/builder/sections/templates');
  console.log('total:', BUILT_IN_SECTIONS.length);
  console.log('cats:', BUILT_IN_SECTION_CATEGORIES);
"
```

### 4.6 commit 권장 단위

카테고리당 1 commit:
```
sections(track-b): add {category} templates ({n} items)

BUILT_IN_SECTIONS 12 → {new-total}.
신규 카테고리 'stats' 또는 기존 'hero' 카테고리 확장.
node count: 각 항목 ~12~25.
```

---

## 5. Track C *(옵션)* — 신규 카테고리 +10~15

### 5.1 Goal

> 19 카테고리 → **30+ 카테고리**.

### 5.2 신규 카테고리 후보

| 카테고리 | 사용 예 | 페이지 sub-set 추천 |
|---|---|---|
| agency | 마케팅/디자인/개발 에이전시 | home/about/services/work/team/process/contact |
| saas | SaaS landing | home/features/pricing/integrations/changelog/customers/contact |
| nonprofit | 비영리 단체 | home/mission/programs/donate/volunteer/events/contact |
| conference | 컨퍼런스 / 세미나 | home/agenda/speakers/sponsors/venue/register/faq |
| podcast | 팟캐스트 | home/episodes/about/subscribe/contact |
| magazine | 매거진 | home/issue/articles/about/subscribe |
| dental / medical | 치과 / 의원 | home/about/services/team/booking/insurance/contact |
| yoga / pilates | 요가 스튜디오 | home/classes/instructors/schedule/pricing/about/contact |
| portfolio | 개인 포트폴리오 (현재 0) | home/about/work/case-study/contact/cv |
| 기타 | freelancer / wedding / car-rental / event-planner / app-landing | (각 7~10 페이지) |

### 5.3 작업 단위

카테고리당 1 단위:
1. 신규 디렉토리 `src/lib/builder/templates/{new-cat}/` 생성
2. 7~10 페이지 (홈 + 보조)
3. `src/lib/builder/templates/registry.ts`에 import + export 등록
4. `src/lib/builder/templates/metadata.ts`에 카테고리 default 추가
5. 단위 commit

### 5.4 Success criteria

- 신규 카테고리 ≥ 10개, 페이지 ≥ 70개 (전체 합계 170 → 240+)
- registry test 갱신 (170 → 새 합계로 expectation 변경)
- 각 페이지 시각 풍부도 § 2.2 룰 따름

### 5.5 검증

```bash
# Track C 끝났을 때 registry test의 expected count 업데이트 필수
# src/lib/builder/templates/__tests__/registry.test.ts 의:
#   it('returns 170 active templates', () => { expect(all).toHaveLength(170); });
# 를 실제 새 합계로 변경
```

---

## 6. 트랙 발주 카피-페이스트 (사용자 → Codex /goal)

### Track A 시작
```
/goal /Users/son7/Projects/tseng-law/CODEX-GOAL-TEMPLATE-DESIGN-EXPANSION.md 의
Track A를 실행. 19 카테고리 (portfolio 제외) × 10 페이지를 § 2.2 구조로 확장.
카테고리 1개 끝날 때마다 commit. 트랙 전체 끝나면 SESSION.md 갱신.
```

### Track B 시작
```
/goal /Users/son7/Projects/tseng-law/CODEX-GOAL-TEMPLATE-DESIGN-EXPANSION.md 의
Track B를 실행. BUILT_IN_SECTIONS를 12 → 53+로 확장. 신규 카테고리
stats/pricing/team/gallery/faq/services/contact 추가.
카테고리 1개 끝날 때마다 commit. 트랙 끝나면 SESSION.md 갱신.
```

### Track C 시작 (옵션)
```
/goal /Users/son7/Projects/tseng-law/CODEX-GOAL-TEMPLATE-DESIGN-EXPANSION.md 의
Track C를 실행. 신규 카테고리 ≥10개 추가 (§ 5.2 후보 중 선택).
registry.ts / metadata.ts / registry.test.ts 갱신.
```

---

## 7. 트랙 간 충돌 매트릭스

| 파일 | A | B | C | 충돌? |
|---|---|---|---|---|
| `src/lib/builder/templates/{기존-cat}/` | ✅ rewrite | ❌ | ❌ | 없음 |
| `src/lib/builder/sections/templates.ts` | ❌ | ✅ append | ❌ | 없음 |
| `src/lib/builder/templates/{new-cat}/` | ❌ | ❌ | ✅ create | 없음 |
| `src/lib/builder/templates/registry.ts` | ❌ | ❌ | ✅ import 추가 | C 단독 |
| `src/lib/builder/templates/metadata.ts` | ❌ | ❌ | ✅ 추가 | C 단독 |
| `src/lib/builder/templates/__tests__/registry.test.ts` | ❌ | ❌ | ✅ count 업데이트 | C 단독 |

A, B, C 동시 진행 안전 (사용자가 두 Codex 인스턴스에 A·B 동시 발주, C는 별도).

---

## 8. 매니저(Claude) 가능한 동시 작업

Codex가 트랙 실행하는 동안 매니저는 disjoint 영역에서:

- 분할 commit 정리 (134 dirty 누적분)
- 검증 인프라 추가 (sections templates 자체 unit test, page templates schema test 보강)
- Playwright `design-pool.playwright.ts` 실행 + 결과 분석
- SESSION.md 갱신 / push

---

## 9. 잠재적 회귀 위험 + 완화

| 위험 | 완화 |
|---|---|
| 페이지 노드 늘리면서 zod schema reject → 5-node sandbox fallback | 카테고리 1개 끝날 때마다 registry test 통과 확인 필수 |
| 기존 SiteHeader/SiteFooter 가 인라인 헤더/푸터 노드와 z-index 충돌 | § 2.4 룰: 페이지 템플릿에 인라인 헤더/푸터 금지 |
| 새 button variant / form input variant 추가 욕구 | § 2.3: 기존 30+ kind만 사용. 새 kind 별도 트랙 |
| className hint 오타로 heuristic 자동 모션 미발동 | § 2.6의 정확한 keyword 사용 |
| stageHeight 계산 어긋나서 published page에서 빈 공간 | 마지막 섹션 y + height + 80px = stageHeight 룰 |

---

## 10. 끝 — 지시서 자체 무결성

이 문서는 self-contained: Codex가 read 한 번으로 트랙 실행 가능. 추가 컨텍스트 필요 시 다음 파일들 참조:
- `WIX-PARITY-ROADMAP.md` (전체 마스터 플랜)
- `src/lib/builder/sections/normalize.ts` (snapshot 형식)
- `src/lib/builder/templates/types.ts` (PageTemplate 형식)
- `src/lib/builder/decompose/shared.ts` (createContainerNode 등 helper)
- `SESSION.md` (현재 진행 상태)
