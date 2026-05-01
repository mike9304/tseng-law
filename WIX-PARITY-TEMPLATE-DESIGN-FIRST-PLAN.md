# Wix Parity: Premium Template Design First Plan

> 작성일: 2026-04-30
> 목적: Wix 수준 편집기로 가기 전에, 현재 조잡해 보이는 템플릿 품질을 먼저 끌어올린다.
> 운영 원칙: 템플릿 디자인 완료 게이트를 통과하기 전까지 6명 코어 Wix 엔지니어 작업은 시작하지 않는다.

---

## 0. 결정

현재 우선순위는 코어 기능 확장이 아니라 템플릿 디자인 신뢰도 회복이다.

Wix가 처음 봤을 때 강한 이유는 편집기 기능만이 아니라, 사용자가 고르는 템플릿이 이미 완성된 브랜드 사이트처럼 보이기 때문이다. 지금 호정 사이트 빌더의 템플릿은 개수는 있지만, 시각적으로 같은 와이어프레임을 업종명만 바꿔 복제한 느낌이 강하다.

따라서 실행 순서는 다음으로 고정한다.

1. 템플릿 디자인 시스템과 갤러리 품질을 먼저 개선한다.
2. 대표 쇼케이스 템플릿 5개를 Wix급으로 다시 만든다.
3. 법률/전문 서비스와 로컬/라이프스타일 템플릿을 프리미엄 방향으로 확장한다.
4. 템플릿 QA, 썸네일, 라이브 프리뷰, 생성 팩토리를 붙인다.
5. 디자인 완료 게이트 통과 후 `WIX-PARITY-6-ENGINEER-WORK-ORDERS.md`의 6명 코어팀 작업을 시작한다.

---

## 1. 현재 템플릿이 허접해 보이는 이유

### 1.1 시각 방향성이 없다

현재 `PageTemplate` 메타데이터는 category, subcategory, description, thumbnail 정도만 있어, 템플릿이 어떤 브랜드 무드인지 구분할 근거가 부족하다.

추가해야 할 축:

- `visualStyle`: editorial, product, luxury, clinical, local, portfolio 등
- `paletteKey`: 업종별 팔레트 키
- `density`: minimal, editorial, commercial, dashboard, portfolio
- `layoutFamily`: cinematic hero, editorial split, bento grid, product showcase 등
- `pageType`: home, about, service, contact, portfolio, product, blog
- `tags`: 사용자가 고를 수 있는 스타일/목적 태그
- `thumbnail`: 실제 미리보기 이미지 또는 자동 렌더 방식

### 1.2 업종별 템플릿이 서로 너무 비슷하다

반복 패턴:

- `1280px` 고정 폭
- `x: 80`
- `HERO_H = 600`
- 3-4개 카드 그리드
- `#123b63`, `#e8a838`, `#f3f4f6` 반복
- placeholder 이미지
- CTA는 있지만 업종별 전환 흐름이 약함

결과적으로 법률, 식당, 스타트업, 쇼핑몰, 크리에이티브 사이트가 서로 다른 브랜드처럼 보이지 않는다.

### 1.3 썸네일이 템플릿 품질을 죽인다

`TemplateThumbnailPlaceholder.tsx`가 회색 SVG 와이어프레임을 보여주면, 실제 템플릿이 좋아져도 갤러리에서 사용자는 전문 템플릿으로 느끼지 못한다.

필수 변경:

- 실제 렌더 썸네일 우선
- 없는 경우에도 팔레트/레이아웃/텍스트/CTA를 반영한 자동 미리보기
- 16:10 비율, 200-240px 높이
- 카테고리별 추천/프리미엄 영역
- 스타일, 밀도, 페이지 타입 필터

### 1.4 이미지 정책이 없다

현재 많은 템플릿이 `/images/placeholder-*.jpg` 같은 존재하지 않거나 품질 낮은 이미지를 참조할 위험이 있다.

금지:

- `/images/placeholder-hero.jpg`
- `/images/placeholder-restaurant-hero.jpg`
- `/images/placeholder-product-screenshot.png`
- 존재하지 않는 `placeholder-*` 경로

원칙:

- 완성 템플릿은 `public/images/templates/<category>/<template>.webp` 계열 사용
- 법률 템플릿은 현재 사이트의 실제 고급 이미지 자산을 재사용 가능
- 제품/공간/사람/상태가 보이는 이미지 사용
- 어둡고 흐릿한 장식용 이미지는 금지

---

## 2. 디자인 완료 게이트

아래를 모두 통과해야 “템플릿 디자인 완료”로 본다.

- 대표 쇼케이스 5개가 갤러리에서 서로 다른 전문 브랜드처럼 보인다.
- 쇼케이스 5개에 회색 와이어프레임 썸네일이 없다.
- 쇼케이스 5개에 깨진 이미지, placeholder 이미지, 빈 alt가 없다.
- 템플릿 갤러리에 style, density, pageType 필터가 있다.
- 템플릿 카드에 실제 썸네일, 태그, 품질 배지가 보인다.
- 쇼케이스 템플릿 QA 점수 85점 이상.
- desktop/tablet/mobile에서 텍스트와 버튼이 눈에 띄게 넘치지 않는다.
- Home 첫 화면만 봐도 업종과 브랜드 수준이 즉시 드러난다.
- 법률/식당/스타트업/쇼핑몰/크리에이티브가 같은 레이아웃으로 보이지 않는다.
- 이 게이트가 통과되기 전에는 6명 코어 Wix 팀을 시작하지 않는다.

---

## 3. 5명 템플릿 디자인팀 작업 지시

### Engineer T1: Visual Art Director / Template Design System

목표: 템플릿이 “업종명만 바꾼 카드 그리드”처럼 보이지 않도록 전체 디자인 언어를 만든다.

담당 파일 후보:

- `src/lib/builder/templates/design-system.ts`
- `src/lib/builder/templates/types.ts`
- `src/lib/builder/decompose/shared.ts`
- `src/components/builder/canvas/TemplateGalleryModal.tsx`
- `src/components/builder/canvas/TemplateThumbnailPlaceholder.tsx`

구현 지시:

- `PageTemplate`에 visual metadata를 확장한다.
- 업종별 팔레트 키를 정의한다.
- 레이아웃 패밀리와 템플릿 밀도를 정의한다.
- 반복되는 heading, eyebrow, lede, card, media, metric, CTA helper를 만든다.
- 기존 템플릿 helper는 무작정 삭제하지 말고 새 premium helper를 병행 추가한다.
- 갤러리 미리보기가 회색 와이어프레임으로 보이지 않게 교체한다.

필수 팔레트 예시:

- `law-editorial`: charcoal, ivory, brass
- `restaurant-warm`: ink, tomato, cream, olive
- `startup-product`: graphite, electric blue, mist
- `commerce-studio`: black, bone, clay
- `creative-mono`: black, white, signal accent
- `health-clinical`: forest, mint, porcelain
- `realestate-quiet`: slate, stone, warm white
- `beauty-luxe`: espresso, blush, champagne
- `travel-editorial`: midnight, sand, sky

완료 기준:

- 쇼케이스 템플릿 5개가 같은 컴포넌트 복제처럼 보이지 않는다.
- 갤러리에서 색/레이아웃/밀도 차이가 즉시 보인다.
- 기존 템플릿 API가 깨지지 않는다.

---

### Engineer T2: Law / Professional Services Premium Templates

목표: 호정 사이트의 핵심 업종인 법률/전문 서비스 템플릿을 Wix 프리미엄 템플릿처럼 만든다.

담당 파일 후보:

- `src/lib/builder/templates/law/`
- `src/lib/builder/templates/law/premium-shared.ts`
- `src/lib/builder/templates/registry.ts`
- `public/images/templates/law-premium/`

새 프리미엄 세트:

1. `law-apex-cross-border`
   - 주제: Taiwan/Korea cross-border corporate counsel
   - 무드: editorial, executive, international
   - 페이지: Home, Practice Areas, Taiwan Company Setup, Contracts & M&A, Attorneys, Case Notes, Insights, Contact

2. `law-vanguard-litigation`
   - 주제: disputes, investigation, urgent response
   - 무드: high-contrast, litigation, focused
   - 페이지: Home, Disputes, Investigation Response, Case Results, Litigation Process, Team, FAQ, Urgent Intake

3. `law-harbor-private-client`
   - 주제: family, inheritance, immigration, private client
   - 무드: calm, confidential, human
   - 페이지: Home, Private Client Services, Family & Divorce, Inheritance, Immigration, Attorney Profile, Client Stories, Contact

4. `law-regulatory-advisory`
   - 주제: compliance, regulatory, retained advisory
   - 무드: structured, precise, enterprise
   - 페이지: Home, Compliance Services, Industries, Retainers, Case Studies, Team, Resources, Contact

디자인 원칙:

- 저울, 망치, generic courthouse 클리셰 금지.
- 사무실, 도시, 회의, 문서, 지도, 전문 인물 이미지 중심.
- CTA는 “상담하기”만 반복하지 말고 “사안 검토 요청”, “긴급 대응 문의”, “자문 범위 확인”처럼 맥락화한다.
- practice cards는 단순 카드가 아니라 jurisdiction badge, risk level, process step, expected deliverable을 포함한다.
- form은 legacy `contactForm`보다 현재 schema의 `form`, `form-input`, `form-select`, `form-textarea`, `form-submit`을 우선 사용한다.

완료 기준:

- 법률 카테고리에서 기존 템플릿보다 프리미엄 세트가 먼저 눈에 띈다.
- 각 세트는 같은 법률업이라도 전혀 다른 고객층과 무드를 가진다.
- 한국어 CTA와 서비스 문구가 실제 로펌 사이트 수준으로 구체적이다.

---

### Engineer T3: Local / Lifestyle Template Families

목표: 로컬 비즈니스와 라이프스타일 템플릿을 “업종이 바로 보이는” 전문 템플릿으로 바꾼다.

대상 업종:

- beauty
- cafe
- restaurant
- fitness
- pet
- travel
- photography
- music

각 업종별 10개 페이지 패턴:

- Home
- About
- Services/Menu/Classes/Packages
- Gallery/Portfolio
- Reviews
- FAQ
- Blog/News
- Contact
- Booking/Reservation
- Landing 또는 Campaign

업종별 필수 차별화:

- Beauty: 시술 메뉴, 가격대, 예약 CTA, before/after 갤러리, 프리미엄 살롱 무드
- Cafe: 메뉴, 공간 사진, 원두/디저트, 로열티, 이벤트
- Restaurant: 대표 메뉴, 예약, 코스/단품, 단체/케이터링, 위치
- Fitness: 클래스 시간표, 트레이너, 멤버십, 체험권 CTA
- Pet: 진료/미용/호텔, 응급 안내, 가격 투명성, 보호자 리뷰
- Travel: 목적지, 일정, 패키지, 현지 이미지, 상담 CTA
- Photography: 포트폴리오, 촬영 패키지, 작업 방식, 예약 문의
- Music: 공연 일정, 디스코그래피, press kit, merch, fan CTA

디자인 원칙:

- 모든 업종이 4-card grid로 끝나면 실패.
- Home hero는 업종별 실제 장면을 보여줘야 한다.
- 갤러리는 정사각 카드 반복보다 masonry, overlap collage, editorial crop을 사용한다.
- 최소 1개 이상의 hover/entrance/scroll interaction을 포함한다.
- 모바일에서 메뉴/가격/CTA가 바로 읽혀야 한다.

완료 기준:

- 8개 업종 home 템플릿 첫 화면만 보고 업종을 맞힐 수 있다.
- placeholder 이미지 사용률 0.
- 업종별 CTA 문구가 모두 다르다.
- 가격/메뉴/예약/갤러리 같은 전환 요소가 실제 사업자에게 쓸모 있다.

---

### Engineer T4: Template Gallery / Thumbnail / Live Preview / QA

목표: 템플릿을 많이 만들어도 사용자가 고르기 어렵거나 썸네일이 조잡하면 Wix급이 아니다. 갤러리와 검수 체계를 먼저 세운다.

담당 파일 후보:

- `src/lib/builder/templates/metadata.ts`
- `src/lib/builder/templates/filters.ts`
- `src/lib/builder/templates/template-categories.ts`
- `src/components/builder/canvas/TemplateGalleryModal.tsx`
- `src/components/builder/canvas/TemplateLivePreviewModal.tsx`
- `src/app/(builder)/template-preview/[templateId]/page.tsx`
- `src/components/builder/published/PublishedCanvasDocument.tsx`
- `scripts/check-template-quality.ts`
- `scripts/generate-template-previews.ts`

구현 지시:

- 기존 170개 파일을 한 번에 다 고치지 말고 metadata overlay로 시작한다.
- `getTemplateCatalog()`를 만들어 갤러리가 무거운 document 전체를 들고 있지 않게 한다.
- 스타일 필터를 추가한다: minimal, editorial, premium, bold, warm, image-led, conversion, content-heavy.
- 실제 렌더 기반 screenshot thumbnail pipeline을 만든다.
- `/template-preview/{templateId}` route를 만들어 desktop/tablet/mobile 미리보기를 지원한다.
- 템플릿 QA script를 만들어 점수화한다.

QA 체크:

- schema parse 성공
- duplicate node id 없음
- parent reference 정상
- image path 존재
- alt text 존재
- placeholder 금지
- button href `#` 금지
- stage bounds 초과 감지
- text overflow 추정
- mobile/tablet rect 존재 여부
- CTA min height 44px 이상

완료 기준:

- 갤러리가 debug list가 아니라 template showroom처럼 보인다.
- 쇼케이스 5개는 실제 썸네일이 표시된다.
- QA 점수 85점 이상만 premium badge를 받는다.
- 실패 템플릿은 갤러리에서 under review로 분류할 수 있다.

---

### Engineer T5: Template Factory / Deterministic Generation

목표: 170개 템플릿을 수작업 복제 파일로 계속 늘리면 Wix 수준까지 확장할 수 없다. 디자인 recipe에서 deterministic하게 `PageTemplate`을 생성하는 구조를 만든다.

담당 파일 후보:

- `src/lib/builder/templates/factory/schema.ts`
- `src/lib/builder/templates/factory/nodes.ts`
- `src/lib/builder/templates/factory/layout.ts`
- `src/lib/builder/templates/factory/build.ts`
- `src/lib/builder/templates/factory/validate.ts`
- `src/lib/builder/templates/recipes/`
- `src/lib/builder/templates/generated/`

핵심 원칙:

- UI/API 계약은 유지한다. 최종 export는 계속 `PageTemplate`이어야 한다.
- `normalizeCanvasDocument()` fallback에 기대지 말고 `builderCanvasDocumentSchema.parse()`로 실패를 잡는다.
- `Date.now()` 같은 비결정적 id 금지.
- 템플릿 id 규칙: `{category}-{familyId}-{pageRole}-{variant}`
- node id 규칙: `tpl-{category}-{familyId}-{pageRole}-{sectionKey}-{slotKey}-{index}`
- legacy id는 alias map으로 유지한다.

Recipe model:

- `TemplateRecipe`
- `TemplateFamilyRecipe`
- `TemplateSectionRecipe`
- `TemplateSlot`
- `TemplateTokenPack`
- `GeneratedTemplateArtifact`

Layout primitives:

- `stackSections`
- `splitHero`
- `cardGrid`
- `mediaMosaic`
- `quoteRail`
- `contactPanel`
- `pricingMatrix`
- `timelineBand`
- `logoStrip`

Migration 순서:

1. registry baseline tests 추가
2. factory schema/validator 추가
3. node/layout helper 추가
4. law pilot 10개를 generated template으로 생성
5. legacy id alias로 기존 선택 흐름 보존
6. 쇼케이스 5개를 factory recipe로 전환
7. 나머지 카테고리를 batch conversion
8. manual template cleanup은 마지막에 수행

완료 기준:

- 같은 recipe는 항상 같은 template output을 만든다.
- 생성된 template도 기존 `getAllTemplates()`와 갤러리에서 정상 동작한다.
- 170개 템플릿 전체를 QA script로 검사할 수 있다.

---

## 4. 실행 순서

### Phase T0: Baseline Lock

목표: 현재 상태를 부수지 않고 템플릿 개선의 기준선을 만든다.

작업:

- `npm run lint`
- `npx tsc --noEmit --incremental false`
- 현재 template registry 개수 기록
- placeholder image reference 목록 생성
- 대표 템플릿 5개 현재 screenshot 저장

대표 쇼케이스 5개:

- `law-home`
- `restaurant-home`
- `startup-home`
- `ecommerce-home`
- `creative-home`

산출물:

- 현재 문제 목록
- 깨진 이미지 목록
- 템플릿 QA 초안

---

### Phase T1: Design Metadata + Gallery Showroom

목표: 템플릿이 갤러리에서 전문 제품처럼 보이게 만든다.

작업:

- `PageTemplate` metadata 확장
- metadata overlay 추가
- style/density/pageType filter 추가
- premium/featured template 영역 추가
- gray thumbnail fallback 제거 또는 premium fallback으로 대체

완료 기준:

- 갤러리에서 카테고리만이 아니라 스타일로 고를 수 있다.
- 회색 와이어프레임이 기본 경험이 아니다.

---

### Phase T2: Real Preview Route + Thumbnail Pipeline

목표: 실제 템플릿 렌더 결과를 썸네일과 라이브 프리뷰로 보여준다.

작업:

- published renderer 추출
- `/template-preview/[templateId]` route 추가
- desktop/tablet/mobile iframe preview 추가
- preview image manifest 생성
- screenshot generator script 추가

완료 기준:

- 쇼케이스 5개는 실제 렌더 썸네일을 가진다.
- 갤러리에서 click하면 live preview가 열린다.

---

### Phase T3: Showcase 5 Templates Redesign

목표: “이 정도면 고객에게 보여줄 수 있다” 수준의 첫 5개를 만든다.

작업 대상:

- `law-home`: editorial authority 로펌
- `restaurant-home`: warm reservation-driven restaurant
- `startup-home`: product-led SaaS launch
- `ecommerce-home`: premium collection commerce
- `creative-home`: portfolio/editorial studio

디자인 요구:

- 5개 모두 다른 hero structure
- 5개 모두 다른 palette
- 5개 모두 다른 CTA language
- 5개 모두 실제 이미지 또는 신뢰 가능한 로컬 이미지 사용
- 5개 모두 tablet/mobile rect 확인

완료 기준:

- 디자인 완료 게이트 통과.
- 이 시점부터 6명 코어팀을 병행 시작할지 판단 가능하다.

---

### Phase T4: Law Premium Expansion

목표: 법률 카테고리를 이 빌더의 대표 품질 샘플로 만든다.

작업:

- 4개 law premium family
- family당 8페이지
- 총 32페이지 템플릿
- practice, attorney, case, insight, contact flow 강화

완료 기준:

- 법률 카테고리는 Wix의 professional services 템플릿과 나란히 비교 가능한 수준이어야 한다.

---

### Phase T5: Local / Lifestyle Upgrade

목표: 로컬 사업자용 템플릿이 실제 사업 사이트처럼 보이게 만든다.

작업:

- 8개 업종 family spec 작성
- 업종별 home부터 우선 redesign
- menu/pricing/booking/gallery/review 흐름 강화
- 이미지 자산 정책 적용

완료 기준:

- 8개 업종 home 템플릿이 서로 다른 브랜드로 보인다.

---

### Phase T6: Template Factory Migration

목표: 수작업 템플릿 복제를 줄이고 장기 확장성을 만든다.

작업:

- recipe schema
- deterministic node builder
- layout primitives
- validator
- generated templates
- legacy alias map

완료 기준:

- 새 premium family는 recipe 기반으로 추가 가능하다.
- QA script로 generated/manual 템플릿을 모두 검사한다.

---

## 5. 6명 코어팀 투입 조건

`WIX-PARITY-6-ENGINEER-WORK-ORDERS.md`의 6명 코어팀은 아래 조건 이후 시작한다.

최소 시작 조건:

- Phase T0 완료
- Phase T1 완료
- Phase T2 완료
- Phase T3 완료
- 쇼케이스 5개 디자인 완료 게이트 통과

이후 6명 코어팀 병행 가능:

- Core Architecture / Persistence
- Responsive Canvas / Editor Trust
- Rich Text / Links / Content Editing
- QA / Security / Release
- Design System / Media
- Templates / Sections / Animations Runtime

주의:

- 6명 코어팀을 너무 일찍 시작하면, 기능은 늘어나지만 사용자가 처음 보는 템플릿 품질은 계속 낮아 보인다.
- Wix parity는 편집기 기능과 템플릿 품질이 같이 올라가야 한다.
- 지금은 템플릿이 판매 페이지 역할을 하므로 먼저 고급화한다.

---

## 6. 바로 다음 실행 프롬프트

아래 프롬프트로 실제 구현을 시작한다.

```text
지금부터 Wix parity의 템플릿 디자인 우선 작업을 시작한다.

목표:
- 기존 170개 템플릿 전체를 한 번에 고치지 말고, 먼저 쇼케이스 5개(law-home, restaurant-home, startup-home, ecommerce-home, creative-home)를 Wix급으로 보이게 만든다.
- 갤러리 썸네일/필터/메타데이터를 개선해서 템플릿 선택 화면이 debug wireframe이 아니라 premium showroom처럼 보이게 만든다.

우선 순서:
1. 현재 template registry, PageTemplate type, TemplateGalleryModal, TemplateThumbnailPlaceholder, 대표 5개 템플릿 파일을 읽어라.
2. placeholder image reference와 반복 레이아웃/팔레트 문제를 목록화해라.
3. PageTemplate metadata를 backward-compatible하게 확장해라.
4. template design-system 파일과 premium helper를 추가해라.
5. 갤러리에서 style/density/pageType 필터와 premium thumbnail fallback을 구현해라.
6. 쇼케이스 5개 템플릿의 hero, palette, section rhythm, CTA copy, image usage를 서로 다르게 redesign해라.
7. lint, typecheck, template QA를 실행하고 깨진 부분을 고쳐라.

중요:
- 기존 사용자 변경을 되돌리지 마라.
- template API를 깨지 마라.
- 회색 와이어프레임 썸네일을 기본 경험으로 두지 마라.
- 존재하지 않는 placeholder image를 사용하지 마라.
- 디자인 완료 게이트를 통과하기 전까지 6명 코어팀 작업은 시작하지 마라.
```

---

## 7. 최종 판단

지금 필요한 것은 “템플릿 개수 추가”가 아니라 “템플릿의 첫인상 품질 상승”이다.

Wix와 1:1 비교했을 때 사용자는 먼저 템플릿 갤러리와 첫 화면을 본다. 그 순간 조잡해 보이면 편집기 내부 기능이 좋아도 제품 신뢰도가 떨어진다.

따라서 다음 스프린트는 템플릿 디자인 스프린트로 잡고, 디자인 완료 게이트 통과 후 6명 코어 Wix 엔지니어 작업으로 넘어간다.
