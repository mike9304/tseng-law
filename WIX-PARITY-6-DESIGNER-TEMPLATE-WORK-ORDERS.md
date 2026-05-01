# Wix Parity: 6 Designer Template Work Orders

> 작성일: 2026-04-30
> 목적: Wix 수준 템플릿 품질을 먼저 만들기 위한 6명 디자이너 작업지시서
> 선행 문서: `WIX-PARITY-TEMPLATE-DESIGN-FIRST-PLAN.md`
> 후속 문서: `WIX-PARITY-6-ENGINEER-WORK-ORDERS.md`

---

## 0. 운영 결정

지금은 코어 Wix 기능 개발보다 템플릿 디자인 품질을 먼저 끌어올린다.

현재 확인된 구조:

- `PageTemplate`는 `id`, `name`, `category`, `subcategory`, `description`, `thumbnail`, `document`만 가진다.
- `TemplateGalleryModal.tsx`는 `getAllTemplates()` 전체 문서를 즉시 로드하고, 카테고리/검색 중심으로 보여준다.
- `TemplateThumbnailPlaceholder.tsx`는 회색 SVG 와이어프레임 썸네일을 렌더한다.
- 쇼케이스 대상 파일은 `law-home`, `restaurant-home`, `startup-home`, `ecommerce-home`, `creative-home`이다.

따라서 6명 디자이너는 “템플릿 개수 추가”가 아니라 “첫인상 품질 상승”에 집중한다.

작업 순서:

1. 갤러리 쇼룸 UX와 템플릿 메타데이터를 먼저 설계한다.
2. 시각 시스템, 팔레트, 타입, 썸네일 정책을 고정한다.
3. 법률/전문 서비스 프리미엄 패밀리를 만든다.
4. 로컬/라이프스타일 템플릿을 업종별로 차별화한다.
5. 반응형/모션 기준으로 desktop/tablet/mobile 품질을 잡는다.
6. QA/Ops가 점수표와 승인 게이트를 운영한다.
7. 디자인 게이트 통과 후 6명 코어 엔지니어 작업을 시작한다.

---

## 1. Designer 1: Template Gallery Showroom UX Lead

### 목표

템플릿 선택 화면을 “디버그 목록”이 아니라 Wix급 프리미엄 템플릿 쇼룸으로 만든다.

사용자는 업종, 스타일, 목적, 밀도, 품질 상태를 보고 고르고, 카드에서 첫인상을 확인한 뒤, 라이브 프리뷰에서 desktop/tablet/mobile을 검토하고 선택해야 한다.

### 담당 파일 후보

- `src/components/builder/canvas/TemplateGalleryModal.tsx`
- `src/components/builder/canvas/TemplateThumbnailPlaceholder.tsx`
- `src/components/builder/canvas/TemplateLivePreviewModal.tsx`
- `src/components/builder/canvas/template-categories.ts`
- `src/lib/builder/templates/types.ts`
- `src/lib/builder/templates/metadata.ts`
- `src/lib/builder/templates/filters.ts`
- `src/lib/builder/templates/registry.ts`
- `src/app/(builder)/template-preview/[templateId]/page.tsx`
- `scripts/generate-template-previews.ts`
- `scripts/check-template-quality.ts`

### 사용자 흐름

1. `PageSwitcher`에서 새 페이지 추가.
2. 템플릿 갤러리 오픈.
3. 상단 쇼케이스 영역에서 추천 프리미엄, 최근 추가, 업종별 인기 노출.
4. 좌측 또는 상단 필터로 업종, 페이지 타입, 스타일, 밀도, 목적 태그 선택.
5. 검색어 입력 시 템플릿명, 설명, 업종, 태그, CTA 목적까지 검색.
6. 카드 hover/focus 시 `미리보기`, `이 템플릿 사용` 액션 표시.
7. `미리보기` 클릭 시 라이브 프리뷰 모달 오픈.
8. 프리뷰 모달에서 desktop/tablet/mobile 전환.
9. `이 템플릿 사용` 클릭 시 기존 `onSelect(cloneTemplateDocument(...))` 흐름 유지.

### 필터 Taxonomy

- 업종: `law`, `restaurant`, `startup`, `ecommerce`, `creative`, `health`, `realestate`, `beauty`, `cafe`, `consulting`, `fitness`, `music`, `pet`, `photography`, `travel`, `education`, `blog`
- 페이지 타입: `home`, `about`, `service`, `contact`, `pricing`, `portfolio`, `gallery`, `blog`, `product`, `booking`, `faq`, `legal`
- 스타일: `minimal`, `editorial`, `premium`, `bold`, `warm`, `image-led`, `conversion`, `content-heavy`
- 밀도: `minimal`, `balanced`, `editorial`, `commercial`, `dashboard`, `portfolio`
- 레이아웃 패밀리: `cinematic-hero`, `editorial-split`, `bento-grid`, `product-showcase`, `directory-list`, `masonry-gallery`, `conversion-landing`
- 품질 상태: `premium`, `featured`, `new`, `under-review`, `legacy`
- CTA 목적: `consultation`, `booking`, `reservation`, `purchase`, `subscribe`, `contact`, `download`

### 카드 구조

- 16:10 실제 렌더 썸네일 우선.
- 썸네일이 없을 때만 팔레트/레이아웃/텍스트/CTA를 반영한 premium fallback 사용.
- 회색 wireframe fallback은 premium 대상에서 제외한다.
- 카드 상단 배지: `Premium`, `Featured`, `QA 92`, `Under review`.
- 제목은 1줄, 긴 이름은 말줄임.
- 보조 정보는 업종 라벨, 페이지 타입, 스타일 칩 2-3개.
- 설명은 2줄 제한, 업종별 전환 가치 중심 문구.
- 메타 정보는 포함 섹션 수, 반응형 지원 여부, 이미지 자산 상태.
- 모바일에서는 hover에 의존하지 않고 `미리보기`, `사용` 버튼을 항상 노출한다.
- 빈 페이지 카드는 일반 템플릿 카드와 분리해서 “처음부터 시작” 영역에 배치한다.

### 프리뷰 모달

- 신규 파일: `TemplateLivePreviewModal.tsx`
- 프리뷰 route: `/template-preview/[templateId]`
- viewport: desktop `1440`, tablet `768`, mobile `390`
- 로딩 중 skeleton 표시.
- 실패 시 fallback thumbnail과 오류 메시지 표시.
- 우측 패널에는 템플릿 메타데이터, QA 체크 결과, 태그, 권장 업종, 포함 CTA 표시.
- `Esc`, backdrop close, focus trap, keyboard navigation 지원.
- 프리뷰 안에서도 바로 `이 템플릿 사용` 가능해야 한다.

### 상태 설계

- Loading: 썸네일 skeleton grid, 필터 skeleton, 프리뷰 iframe shimmer.
- Empty: 현재 선택 필터를 보여주고 `필터 초기화`, `전체 템플릿 보기` 제공.
- Thumbnail error: 템플릿 선택은 막지 않지만 `Under review` 표시.
- Preview error: fallback thumbnail과 오류 상태 표시.
- No thumbnail: 브랜드 팔레트 기반 fallback 렌더.
- Mobile: 사이드바 대신 sticky filter bar와 bottom sheet 필터.

### 완료 기준

- 갤러리 첫 화면에서 쇼케이스 5개가 실제 프리미엄 템플릿처럼 보인다.
- `law-home`, `restaurant-home`, `startup-home`, `ecommerce-home`, `creative-home`에 회색 wireframe 썸네일이 보이지 않는다.
- style/density/pageType 필터가 동작하고 검색과 조합 가능하다.
- 카드에서 업종, 스타일, 품질, 사용 목적을 3초 안에 파악할 수 있다.
- 라이브 프리뷰에서 desktop/tablet/mobile 전환이 가능하다.
- QA 85점 이상만 `Premium` 배지를 받는다.
- 기존 `PageSwitcher -> TemplateGalleryModal -> onSelect(document|null)` 흐름은 깨지지 않는다.

---

## 2. Designer 2: Visual Systems / Brand Kit Design Director

### 목표

프리미엄 템플릿 5개와 이후 170개 템플릿 확장에 공통 적용 가능한 시각 시스템을 만든다.

“업종명만 바꾼 1280px 카드 그리드”를 폐기하고, 팔레트, 타입, 간격, 섹션 리듬, 이미지 방향, 썸네일, 브랜드 키트가 한 시스템으로 연결되게 한다.

### 담당 파일 후보

- `src/lib/builder/templates/types.ts`
- `src/lib/builder/templates/design-system.ts`
- `src/lib/builder/templates/premium-helpers.ts`
- `src/lib/builder/templates/registry.ts`
- `src/lib/builder/templates/**`
- `src/components/builder/canvas/TemplateGalleryModal.tsx`
- `src/components/builder/canvas/TemplateThumbnailPlaceholder.tsx`
- `src/components/builder/canvas/template-categories.ts`
- `src/lib/builder/site/theme.ts`
- `src/components/builder/editor/BrandKitPanel.tsx`
- `src/components/builder/canvas/SiteSettingsModal.tsx`
- `public/images/templates/**`

### `PageTemplate` 시각 메타데이터 확장

기존 계약을 깨지 않도록 optional field로 시작한다.

- `visualStyle`: `editorial | executive | luxury | clinical | local | product | portfolio | high-contrast | calm | playful`
- `paletteKey`: 템플릿 팔레트 키
- `density`: `minimal | editorial | commercial | dashboard | portfolio | conversion`
- `layoutFamily`: `cinematic-hero | editorial-split | bento-grid | product-showcase | magazine-stack | service-index | booking-first`
- `pageType`: `home | about | service | contact | portfolio | product | blog | booking | legal-detail`
- `tags`: 갤러리 필터용 태그
- `qualityTier`: `premium | standard | draft`
- `thumbnail`: 실제 WebP/PNG 우선, 없으면 palette-aware fallback

### 팔레트 시스템

새 파일 후보: `src/lib/builder/templates/design-system.ts`

각 팔레트는 단순 5색이 아니라 아래 semantic role을 가진다.

- `canvas`
- `surface`
- `surfaceAlt`
- `ink`
- `mutedInk`
- `accent`
- `accentSoft`
- `line`
- `inverse`
- `focus`

필수 팔레트:

- `law-editorial`: charcoal `#171717`, ivory `#f7f2e8`, brass `#b18a4a`
- `restaurant-warm`: ink `#211814`, tomato `#b9432f`, cream `#fff4df`, olive `#5e6b3b`
- `startup-product`: graphite `#16191f`, electric blue `#116dff`, mist `#eef5ff`
- `commerce-studio`: black `#0d0d0d`, bone `#f6f0e7`, clay `#b56d4c`
- `creative-mono`: black `#050505`, white `#ffffff`, signal `#f2ff3d`
- `health-clinical`: forest `#123c32`, mint `#cfeee4`, porcelain `#f8fbfa`
- `realestate-quiet`: slate `#26313d`, stone `#d8d2c6`, warm white `#faf7f1`
- `beauty-luxe`: espresso `#2b1c18`, blush `#ead0cd`, champagne `#d5b778`
- `travel-editorial`: midnight `#101827`, sand `#e8d2aa`, sky `#9cc7dc`

기존 `DEFAULT_THEME`는 전역 fallback으로 유지하고, 템플릿은 `paletteKey`를 통해 별도 적용한다.

### 타이포그래피

타입 램프:

- `display`
- `h1`
- `h2`
- `h3`
- `lede`
- `body`
- `caption`
- `metric`
- `button`

한국어 기본 조합:

- 법률/에디토리얼: `Noto Serif KR` heading + `IBM Plex Sans KR` body
- 스타트업/제품: `Inter` heading/body + 한국어 fallback `IBM Plex Sans KR`
- 뷰티/레스토랑/여행: 업종별 serif 또는 humanist heading + sans body

규칙:

- 프리미엄 템플릿은 `letterSpacing: 0`을 원칙으로 한다.
- 영문 대문자 eyebrow만 예외적으로 소량 허용한다.
- `BrandKit` import 시 title/body font만 들어와도 type ramp 전체가 생성되어야 한다.

### 간격과 섹션 리듬

Spacing scale:

- `4, 8, 12, 16, 24, 32, 48, 64, 80, 112, 144`

섹션 리듬 예:

- 법률: cinematic hero -> proof strip -> jurisdiction/service matrix -> attorney authority -> intake CTA
- 레스토랑: image-led hero -> menu teaser -> reservation band -> hours/location -> reviews
- 스타트업: product hero -> logo/proof row -> feature bento -> workflow -> pricing CTA
- 커머스: product story -> collection grid -> editorial product detail -> reviews -> shipping trust
- 크리에이티브: full-bleed portfolio -> asymmetric case studies -> process -> contact

### 이미지 정책

금지:

- `placeholder-*`
- 빈 `src`
- 빈 `alt`
- generic courthouse
- 저울/망치 같은 법률 클리셰
- 흐릿한 장식용 배경

자산 경로:

- `public/images/templates/<category>/<template-id>/<asset-name>.webp`

이미지 방향:

- 법률: 사무실, 도시, 회의, 문서, 지도, 전문 인물
- 로컬/라이프스타일: 제품, 공간, 사람, 메뉴, 예약 상황
- 스타트업/커머스: 실제 제품 화면, 컬렉션, 사용 상태
- 크리에이티브/사진: 결과물 중심 portfolio crop

### Brand Kit v2

현재 v1 `BrandKit`은 로고, 5색, 제목/본문 폰트, radius 중심이다.

v2 확장안:

- `version: 2`
- `paletteKey`
- `semanticColors`
- `typeRamp`
- `spacingScale`
- `thumbnailStyle`
- `preferredImageMood`

요구:

- `normalizeBrandKit`은 v1 JSON을 계속 받아야 한다.
- `createThemeFromBrandKit`은 v2가 있으면 semantic color와 type ramp를 우선 적용한다.
- v2가 없으면 현재 로직으로 fallback한다.
- export JSON은 템플릿 시각 시스템 재사용에 필요한 최소 토큰을 포함한다.

### 완료 기준

- 쇼케이스 5개 템플릿이 서로 다른 팔레트, 타입, 레이아웃 리듬을 가진다.
- 쇼케이스 템플릿에 `placeholder-*`, 빈 이미지, 빈 alt가 없다.
- 갤러리에서 style, density, pageType, qualityTier 필터가 가능하다.
- 썸네일은 회색 wireframe이 아니며 16:10 비율로 실제 또는 palette-aware preview를 보여준다.
- BrandKit v1 import가 깨지지 않는다.
- BrandKit v2 export/import는 palette/type/spacing 토큰을 손실 없이 왕복한다.
- desktop/tablet/mobile에서 텍스트와 CTA가 눈에 띄게 넘치지 않는다.

---

## 3. Designer 3: Legal / Professional Services Template Designer

### 목표

기존 법률 템플릿의 placeholder 이미지, 반복 색상 `#123b63/#e8a838`, 4-card grid 중심 구성을 제거하고, Wix 프리미엄급 법률/전문 서비스 템플릿 4개 패밀리를 설계한다.

같은 법률 카테고리 안에서도 고객층, 리스크 상황, 전환 흐름, 시각 무드가 즉시 구분되어야 한다.

### 담당 파일 후보

- `src/lib/builder/templates/law/`
- `src/lib/builder/templates/law/premium-shared.ts`
- `src/lib/builder/templates/registry.ts`
- `public/images/templates/law-premium/`
- `src/components/builder/canvas/TemplateGalleryModal.tsx`
- `src/components/builder/canvas/TemplateThumbnailPlaceholder.tsx`

### 공통 제작 원칙

- 저울, 망치, 법원 기둥, generic courthouse 이미지는 금지한다.
- 이미지 방향은 사무실, 도시, 회의, 문서, 지도, 전문 인물, 케이스 보드, 규제 체크리스트 중심으로 한다.
- 기존 실제 자산은 임시 활용 가능하다: `/images/header-skyline-ratio.webp`, `/images/header-skyline-buildings.webp`, `/images/taipei101-scroll.webp`, `/images/footer-ground-skyline-v2.webp`, `/images/team/tseng-junwei.png`.
- 최종 프리미엄 자산은 `public/images/templates/law-premium/<family>/...webp`에 둔다.
- 폼은 legacy `contactForm`보다 현재 builder schema의 `form`, `form-input`, `form-select`, `form-textarea`, `form-submit` 조합을 우선한다.
- 각 템플릿은 `visualStyle`, `paletteKey`, `density`, `layoutFamily`, `pageType`, `tags`, `thumbnail` 메타데이터 확장을 전제로 설계한다.
- 법률 CTA는 “상담하기” 반복 금지. 사안별로 “사안 검토 요청”, “긴급 대응 문의”, “자문 범위 확인”, “설립 일정 확인”, “증거 보전 체크”처럼 구체화한다.

### `law-apex-cross-border`

주제: Taiwan/Korea cross-border corporate counsel

고객층: 한국 기업, 스타트업, 브랜드, 투자자, 대만 진출 담당 임원

무드: editorial, executive, international

팔레트: charcoal `#171717`, ivory `#f7f2e8`, brass `#b98b45`, muted blue-gray `#6f7d8c`

페이지 맵:

- Home: 대만 진출 법률 파트너 첫 화면
- Practice Areas: 투자/법인설립, 계약, IP, 비자, 고용 리스크
- Taiwan Company Setup: 설립 절차, 투자 승인, 자본금, 은행, 주소 검토
- Contracts & M&A: 계약 검토, 주주계약, 지분양수도, DD
- Attorneys: 한국어/중국어/일본어 가능 변호사 프로필
- Case Notes: 회사설립, 물류, 화장품, 투자 회수 케이스
- Insights: 대만 진출 가이드형 칼럼 아카이브
- Contact: 사업 개요 기반 intake form

Hero:

- 좌측 headline: “대만 진출의 첫 법률 구조를 정확하게 설계합니다.”
- 우측은 Taipei skyline + 문서/지도/미팅 이미지를 겹친 editorial collage.
- proof strip: “한국어 상담”, “투심회·법인등기”, “계약·비자·IP 연계”.
- CTA: “설립 가능성 검토 요청”, “진출 체크리스트 보기”.

핵심 섹션:

- 진출 전 먼저 정해야 할 4가지: 법인 형태, 주주 구조, 자본금, 영업 주소
- 대만 회사설립 흐름: 회사명 예약 -> 투자 승인 -> 계좌 -> 송금 -> 등기 -> 세무등록
- 업종별 리스크: 화장품 PIF, 물류 면허, 고용허가, 상표 선출원
- Executive brief: 예상 기간, 필요 서류, 의사결정 포인트
- Related insights: 실제 칼럼 카드와 태그

### `law-vanguard-litigation`

주제: disputes, investigation, urgent response

고객층: 사고/분쟁 당사자, 기업 분쟁 담당자, 형사/민사 리스크가 있는 외국인

무드: high-contrast, litigation, focused

팔레트: near-black `#101114`, bone `#f4efe6`, alert red `#b6402a`, steel `#6b7280`

페이지 맵:

- Home: 긴급 분쟁 대응 랜딩
- Disputes: 민사소송, 손해배상, 계약 분쟁
- Investigation Response: 형사 수사, 고소, 진술 대응
- Case Results: 157만 TWD 손해배상 등 결과 중심 사례
- Litigation Process: 증거 확보, 감정, 조정, 소송 단계
- Team: 담당 변호사와 대응 역할
- FAQ: 대만 소송 기한, 한국 체류 중 진행 가능 여부
- Urgent Intake: 긴급 사실관계 접수 폼

Hero:

- 사건 타임라인, 증거 체크리스트, 문서 스택 이미지를 사용.
- 첫 문장: “첫 48시간의 증거 정리가 소송 방향을 바꿉니다.”
- 우측 패널: 사고일, 상대방 정보, 진단서, CCTV, 경찰 기록 체크리스트.
- CTA: “긴급 대응 문의”, “증거 보전 체크하기”.

핵심 섹션:

- 사건 유형별 즉시 조치
- 소송 전 판단: 과실, 손해, 증거, 회수 가능성
- 대표 사례: 한국 유학생 헬스장 부상 157만 TWD 판결
- Process ladder: 상담 -> 증거 확보 -> 조정/고소 -> 소송 -> 집행
- Urgent intake form

### `law-harbor-private-client`

주제: family, inheritance, immigration, private client

고객층: 국제결혼, 이혼, 상속, 체류/비자, 개인 자산 이슈가 있는 한국인

무드: calm, confidential, human

팔레트: warm white `#faf7f0`, deep green `#263d35`, clay `#a8755b`, soft gray `#d9d5cc`

페이지 맵:

- Home: 개인 의뢰인을 위한 조용한 상담 랜딩
- Private Client Services: 이혼, 상속, 친권, 체류, 생활 법률
- Family & Divorce: 협의/조정/재판이혼, 재산분할
- Inheritance: 배우자/자녀 상속, 국제 상속
- Immigration: 비자, 거류증, 취업허가
- Attorney Profile: 담당 변호사 신뢰 형성
- Client Stories: 익명 처리된 상황별 스토리
- Contact: 비공개 상담 문의

Hero:

- 밝은 상담실, 창가, 문서, 차분한 인물 실루엣 중심.
- Headline: “가족과 체류 문제는 절차보다 먼저 상황을 이해해야 합니다.”
- confidentiality note: “상담 내용은 비공개로 접수되며, 필요한 자료만 단계적으로 요청합니다.”
- CTA: “비공개 상담 요청”, “이혼·상속 절차 확인”.

핵심 섹션:

- 상황별 안내: 국제이혼, 친권, 상속, 체류, 노동/생활 분쟁
- 처음 준비할 자료
- Decision map: 협의 가능 / 조정 필요 / 소송 필요
- Attorney trust
- Private contact

### `law-regulatory-advisory`

주제: compliance, regulatory, retained advisory

고객층: 한국 기업의 대만 법무/컴플라이언스/HR/운영팀

무드: structured, precise, enterprise

팔레트: ink `#111827`, porcelain `#f8fafc`, teal `#2f7d7c`, amber `#c58b2b`

페이지 맵:

- Home: 기업 자문/규제 대응 랜딩
- Compliance Services: 규제 검토, 계약, 광고, 고용, 개인정보
- Industries: 화장품, 물류, 외식, 플랫폼, 제조
- Retainers: 월 자문 범위와 SLA
- Case Studies: 규제 리스크 사전 차단 사례
- Team: 담당 변호사와 협업 구조
- Resources: 체크리스트, 가이드, 법률 업데이트
- Contact: 자문 범위 확인 폼

Hero:

- risk matrix, compliance calendar, document status UI.
- Headline: “대만 운영 리스크를 사후 대응이 아닌 관리 체계로 전환합니다.”
- risk chips: 광고 규제, 고용, 계약, 인허가, 개인정보.
- CTA: “자문 범위 확인”, “규제 체크리스트 요청”.

핵심 섹션:

- Retainer model
- Industry matrix
- Deliverables: 검토 메모, 계약 수정본, 리스크 표, 실행 일정
- Compliance timeline
- Enterprise form

### 법률 완료 기준

- 법률 카테고리에서 4개 프리미엄 패밀리가 기존 `law-home`, `law-services`보다 먼저 노출된다.
- Home 첫 화면만 봐도 cross-border corporate, litigation, private client, regulatory advisory가 구분된다.
- 모든 프리미엄 템플릿에 `placeholder-*` 이미지 경로가 없다.
- 썸네일은 회색 와이어프레임이 아니며 실제 레이아웃/팔레트/CTA/이미지를 반영한다.
- 각 패밀리는 최소 8개 페이지 맵과 Home + Contact/Intake 전환 흐름을 가진다.
- 각 practice/service card에는 jurisdiction, risk level, process step, deliverable 중 최소 2개 이상이 포함된다.
- CTA 문구는 패밀리별로 다르고 “상담하기” 단독 반복 사용이 없다.
- Desktop/tablet/mobile에서 긴 한국어 제목, 버튼, 카드 본문이 넘치지 않는다.
- `form`, `form-input`, `form-select`, `form-textarea`, `form-submit` 기반 intake가 최소 1개 이상 포함된다.

---

## 4. Designer 4: Local Business / Lifestyle Template Designer

### 목표

restaurant, cafe, beauty, fitness, pet, travel, photography, music 템플릿을 실제 로컬 사업자가 바로 쓸 수 있는 프리미엄 라이프스타일 사이트로 재설계한다.

### 담당 카테고리

- `src/lib/builder/templates/restaurant/`
- `src/lib/builder/templates/cafe/`
- `src/lib/builder/templates/beauty/`
- `src/lib/builder/templates/fitness/`
- `src/lib/builder/templates/pet/`
- `src/lib/builder/templates/travel/`
- `src/lib/builder/templates/photography/`
- `src/lib/builder/templates/music/`

### 공통 원칙

- Home 첫 화면만 봐도 업종을 맞힐 수 있어야 한다.
- 업종별 핵심 전환 행동을 다르게 설계한다: 예약, 주문, 상담, 체험권, 견적, 티켓, 팬 가입.
- 모든 업종을 4-card grid + generic CTA로 끝내면 실패다.
- Home hero는 반드시 실제 장면 중심이어야 한다.
- 갤러리는 masonry, editorial crop, overlap collage, before/after, tour poster wall, contact sheet 같은 업종별 형식을 사용한다.
- CTA 문구는 “문의하기” 반복 금지.
- 모바일에서는 가격, 메뉴, 예약 CTA, 위치, 영업시간이 첫 2스크롤 안에서 읽혀야 한다.
- `/images/placeholder-*` 계열 및 존재하지 않는 이미지 경로 사용 금지.
- 이미지 경로는 `public/images/templates/<category>/<family-or-page>.webp` 규칙으로 정리한다.
- 각 업종 Home에는 최소 1개 이상의 hover, entrance, scroll interaction을 포함한다.
- desktop/tablet/mobile rect를 모두 확인한다.

### 업종별 작업 지시

| 업종 | 페이지 맵 | 전환 섹션 | 비주얼 무드 / 이미지 요구 | 모바일 / 예약 흐름 | 완료 기준 |
|---|---|---|---|---|---|
| Restaurant | Home, About, Menu, Gallery, Reviews, FAQ, Blog, Contact, Reservation, Catering/Event Landing | 대표 메뉴, 코스/단품 가격, 예약 가능 시간, 단체석/케이터링, 위치/주차, 리뷰 | warm dining, chef-led, tomato/cream/olive/ink. 음식 클로즈업, 홀 분위기, 셰프 손동작, 테이블 세팅 | 하단 sticky `예약하기`, 인원/날짜/시간 선택, 전화 예약 fallback | 첫 화면에 레스토랑이 즉시 보이고 Menu와 Reservation이 독립 전환 섹션으로 작동 |
| Cafe | Home, About, Menu, Gallery, Reviews, FAQ, Blog, Contact, Loyalty, Events/Catering Landing | 오늘의 원두, 시그니처 음료, 디저트, 멤버십, 이벤트 예약, 단체 주문 | local cozy, editorial cafe, espresso/butter/paper/forest. 바리스타, 원두, 디저트, 좌석 | 모바일 첫 화면에 메뉴/영업시간/지도. 멤버십 가입 CTA 고정 | 메뉴판이 가격표처럼 읽히고 공간 사진만으로 카페 무드가 구분됨 |
| Beauty | Home, About, Services, Pricing, Gallery, Testimonials, Blog, Contact, Booking, Product/Campaign Landing | 시술 메뉴, 가격대, 디자이너 선택, before/after, 예약금 안내, 추천 제품 | beauty-luxe, blush/champagne/espresso/porcelain. 시술 장면, 살롱 인테리어, before-after | 시술 선택 -> 디자이너 선택 -> 날짜/시간 -> 고객 정보 | 가격/소요시간/시술 결과가 명확하고 고급 살롱처럼 보임 |
| Fitness | Home, About, Classes, Trainers, Pricing, Gallery, Testimonials, Blog, Contact, Trial Booking, Nutrition Landing | 무료 체험권, 클래스 시간표, 트레이너 프로필, 멤버십 비교, PT 상담 | kinetic, bold, charcoal/lime/steel/white. 운동 동작, 그룹 클래스, 트레이너 코칭 | 모바일 상단 `무료 체험 신청`, 시간표 horizontal scroll | 운동 종목과 체험 전환이 즉시 보이고 시간표가 실제 사용 가능 |
| Pet | Home, About, Services, Pricing, Gallery, Testimonials, FAQ, Contact, Booking, Emergency Landing | 진료/미용/호텔, 응급 안내, 가격 투명성, 보호자 리뷰, 예방접종 안내 | warm clinical, sage/cream/coral/ink. 수의사 진료, 미용, 호텔 공간 | 모바일 sticky `진료 예약` + `응급 전화` | 응급/일반 예약이 구분되고 보호자가 안심할 정보가 충분함 |
| Travel | Home, About, Destinations, Packages, Gallery, Reviews, FAQ, Blog/Guides, Contact, Consultation, Campaign Landing | 목적지 카드, 일정표, 패키지 가격, 현지 가이드, 상담 CTA, 후기 | travel-editorial, midnight/sand/sky/sun. 실제 목적지, 일정 지도, 현지 음식/숙소/체험 | 목적지 필터, 패키지 요약, `여행 상담 요청` 폼 | 목적지와 일정이 구체적이며 여행 상품처럼 보임 |
| Photography | Home, About, Portfolio, Services, Pricing, Gallery Wedding, Gallery Portrait, Testimonials, Blog, Contact/Booking | 촬영 패키지, 포트폴리오 카테고리, 작업 방식, 예약 문의, 납품 일정 | portfolio-led, mono/warm gray/soft accent. 실제 결과물 중심, contact sheet | portfolio swipe, 패키지 선택 -> 날짜 문의 -> 촬영 종류/장소 입력 | 사진 결과물이 텍스트보다 먼저 보이고 가격/예약 흐름이 명확함 |
| Music | Home, About, Discography, Tour, Videos, Gallery, Lyrics, Press, Merch, Contact/Booking | 공연 일정, 티켓 CTA, 음원 링크, press kit, merch, 팬 가입, 섭외 문의 | stage/editorial, black/signal red/electric blue/silver. 공연 장면, 앨범 커버, 포스터 | sticky `티켓 보기` 또는 `음원 듣기` | 아티스트 사이트처럼 보이고 팬/프레스/섭외 흐름이 분리됨 |

### 공통 섹션 요구

- Home: 업종 장면 hero, 핵심 CTA 2개, 신뢰 요소, 대표 상품/서비스, 후기, 위치/예약.
- About: 브랜드 스토리, 사람/공간 이미지, 차별점, 운영 철학.
- Services/Menu/Classes/Packages: 가격, 소요시간, 포함 내역, 추천 대상, CTA.
- Gallery/Portfolio: 업종별 비정형 레이아웃.
- Reviews: 고객 상황, 선택 서비스, 결과 포함.
- Contact: 위치, 영업시간, 전화, 이메일, 지도 영역.
- Booking/Reservation: 단계형 입력 UI, 모바일 44px 이상 CTA, 실패/대체 연락 수단 포함.
- Landing/Campaign: 시즌 메뉴, 웨딩 패키지, 무료 체험, 투어 발표, 이벤트 예약 등 단기 전환용.

### 완료 기준

- 8개 업종 Home을 썸네일만 보고도 서로 다른 업종으로 식별 가능하다.
- placeholder 이미지 참조 0개.
- 업종별 CTA 문구가 모두 다르다.
- 각 업종마다 가격/메뉴/예약/갤러리/후기 중 최소 3개 전환 요소가 실제 사업자에게 쓸 수 있는 수준이다.
- desktop/tablet/mobile에서 텍스트 overflow, CTA 잘림, 이미지 깨짐이 없다.
- button href `#` 금지.
- 이미지 alt는 업종/장면/목적이 드러난다.
- QA script 기준 85점 이상을 premium 후보로 본다.

---

## 5. Designer 5: Responsive + Motion Interaction Designer

### 목표

프리미엄 템플릿이 desktop/tablet/mobile에서 각각 의도된 브랜드 사이트처럼 보이게 만들고, Wix 수준의 hover/entrance/scroll interaction polish를 적용한다.

자동 모바일 스택에 기대지 않고, 쇼케이스 5개와 이후 premium family 템플릿에 명시적 breakpoint override와 모션 규칙을 부여한다.

### 참고 구현 기준

- Editor viewport: desktop `1280`, tablet `768`, mobile `375`
- Responsive schema: `responsive.tablet/mobile.rect`, `hidden`, `fontSize`
- Cascade: desktop -> tablet -> mobile
- Published breakpoint: tablet `768-1023px`, mobile `<=767px`
- Animation presets는 기존 `src/lib/builder/animations/presets.ts` 기준 사용
- Reduced motion runtime은 `AnimationsRoot`의 `prefers-reduced-motion: reduce` 정책과 일치시킨다.

### 담당 파일 후보

- `src/lib/builder/templates/law/`
- `src/lib/builder/templates/restaurant/restaurant-home.ts`
- `src/lib/builder/templates/startup/startup-home.ts`
- `src/lib/builder/templates/ecommerce/ecommerce-home.ts`
- `src/lib/builder/templates/creative/creative-home.ts`
- `src/lib/builder/templates/*/*-home.ts`
- `src/lib/builder/templates/factory/layout.ts`
- `src/lib/builder/templates/factory/nodes.ts`
- `src/lib/builder/canvas/responsive.ts`
- `src/lib/builder/animations/presets.ts`
- `src/lib/builder/animations/animation-render.ts`
- `src/components/builder/published/AnimationsRoot.tsx`

### Desktop 규칙

- 기준 캔버스는 `1280px`로 유지한다.
- 기본 콘텐츠 안전 영역은 `x: 80`, `width: 1120`을 기준으로 하되, premium template은 업종별 rhythm을 다르게 둔다.
- Hero는 첫 viewport에서 업종과 브랜드 수준이 즉시 드러나야 한다.
- 카드 그리드는 desktop에서만 4열을 허용한다.
- 모든 업종이 동일한 4-card grid로 보이면 실패다.
- 버튼 높이는 최소 `48px`, 주요 CTA는 `52-56px` 권장.
- 텍스트 박스는 한글 기준 실제 줄 수보다 20-30% 여유 높이를 둔다.
- scroll animation은 큰 visual anchor에만 제한적으로 적용한다.

### Tablet 규칙

- 기준 폭은 `768px`.
- 콘텐츠 안전 여백은 `32px`.
- desktop 4열 카드 그리드는 tablet에서 2열로 재배치한다.
- Hero split layout은 유지 가능하지만, 텍스트가 크게 밀리면 vertical stack으로 전환한다.
- CTA 그룹은 가능하면 inline, 불가능하면 2행 stack.
- 긴 testimonial, menu, pricing, service card는 tablet에서 2 columns 또는 featured + list 패턴으로 바꾼다.
- Tablet override는 주요 section root, hero title, lede, CTA, 주요 image/card에 명시적으로 작성한다.
- Tablet에서는 `scroll.pin` 사용 금지.
- `parallax-y`는 intensity `-12~12` 범위만 허용한다.

### Mobile 규칙

- 기준 폭은 `375px`.
- 콘텐츠 안전 여백은 `16px`.
- 모든 핵심 콘텐츠는 single column으로 재배치한다.
- Hero는 모바일 첫 화면에서 제목, 핵심 설명, CTA가 보이게 한다.
- 장식 이미지는 아래로 내리거나 `hidden` 처리한다.
- 카드, 메뉴, 가격, 서비스 항목은 `width <= 343px`를 기본으로 한다.
- CTA 버튼은 최소 `44px`, 권장 `48-52px`.
- CTA 간 세로 간격은 최소 `10px`.
- Hover에 의존하는 정보 노출 금지.
- 과도한 collage, overlap, rotated element는 mobile에서 단순 stack으로 재구성한다.
- 긴 headline은 mobile `fontSize` override를 반드시 둔다.
- Mobile에서는 `scroll.parallax-y`, `rotate-on-scroll`, `pin`, `flip`, `spin` 금지.

### Breakpoint composition

- Hero:
  - Desktop: cinematic split, editorial overlay, product showcase 중 템플릿별로 다르게 구성
  - Tablet: split 유지 또는 image-under-text
  - Mobile: text -> CTA -> trust proof -> image 순서 우선
- Service/Menu/Feature grids:
  - Desktop: 3-4열
  - Tablet: 2열
  - Mobile: 1열, card 간격 `12-16px`
- Media mosaic/gallery:
  - Desktop: masonry, overlap collage, editorial crop
  - Tablet: 2열 crop
  - Mobile: 대표 이미지 1개 + vertical list 또는 hidden
- Forms/contact:
  - Desktop: form + office/contact panel split
  - Tablet: form full width + contact cards
  - Mobile: input/button 높이 `44px` 이상
- CTA strips:
  - Desktop: headline + button horizontal
  - Tablet/mobile: headline, supporting text, CTA 순서로 vertical stack

### Motion 규칙

Entrance:

- 기본: section title `fade-in`, card/list `slide-up`
- 법률/에디토리얼: `fade-in`, `slide-up`, `reveal-left/right`만 사용
- Restaurant/beauty/travel/photography: image `reveal-left/right`, card `slide-up`
- Startup/product: hero copy `fade-in`, screenshot `float-up`, feature cards `slide-up`
- Creative/portfolio: gallery item `reveal-left/right`, CTA `fade-in`

Stagger:

- delay는 `0, 80, 160, 240ms`까지만 사용.
- 전체 entrance duration은 `500-800ms`, hero는 최대 `900ms`.

Hover:

- Cards/buttons 기본은 `lift`.
- 이미지 중심 템플릿은 `tint`.
- Startup/product CTA나 dashboard card는 `glow` 제한 사용.
- `pulse`, `bounce-in`, `flip`, `spin`은 playful category가 아니면 금지.

Scroll:

- Desktop 큰 이미지나 product mockup에만 `parallax-y` intensity `8-20`.
- `fade-on-scroll`은 editorial divider나 large quote에만 사용.
- `scale-on-scroll`, `rotate-on-scroll`, `pin`은 쇼케이스 5개에서 기본 금지.

Reduced motion:

- `prefers-reduced-motion: reduce`에서 모든 entrance/scroll/hover transform은 제거된다.
- 콘텐츠는 즉시 visible이어야 한다.
- 지속 루프, 자동 pulse, 반복 bounce 금지.
- IntersectionObserver 실패 시 콘텐츠가 숨겨진 상태로 남으면 실패다.

### 완료 기준

- 쇼케이스 5개가 desktop/tablet/mobile preview에서 브랜드 의도를 유지한다.
- 375px mobile에서 가로 스크롤, 겹친 텍스트, 잘린 CTA, 읽을 수 없는 카드가 없다.
- 768px tablet에서 4열 desktop grid가 그대로 압축되어 보이지 않는다.
- 모든 주요 CTA touch target은 `44px` 이상이다.
- Hover-only 정보가 mobile에 없다.
- Entrance animation은 section당 1-2종으로 제한된다.
- Reduced motion 환경에서 콘텐츠가 즉시 보인다.
- Placeholder image, `href: '#'`, 빈 alt, mobile/tablet rect 누락은 premium badge 실패 조건이다.

---

## 6. Designer 6: Template QA / Design Ops Lead

### 목표

템플릿 디자인팀 6명이 병렬로 작업해도 품질 기준, 스크린샷 리뷰, 결함 분류, 승인 게이트가 흔들리지 않게 운영한다.

엔지니어는 QA 기준과 자동 리포트만 소비하고, 디자인 리뷰 병목에 묶이지 않게 한다.

### QA 점수 루브릭: 100점

- 브랜드 차별성 20점: 첫 화면에서 업종, 고객층, 무드가 즉시 구분되는가.
- 레이아웃 완성도 20점: hero 구조, section rhythm, 시선 흐름, 여백, CTA 위치가 실제 판매 가능한 사이트 수준인가.
- 이미지/미디어 품질 15점: placeholder, 깨진 경로, 흐릿한 장식 이미지가 없고 업종의 실제 장면을 보여주는가.
- 반응형 안정성 15점: desktop/tablet/mobile에서 텍스트, 버튼, 카드, 이미지가 겹치거나 잘리지 않는가.
- 전환 설계 10점: CTA가 업종 맥락에 맞고 `href: '#'` 없이 실제 경로, anchor, lightbox, form flow로 연결되는가.
- 접근성/콘텐츠 품질 10점: 이미지 alt, H1 1개, 읽을 수 있는 대비, 버튼 44px 이상, 빈 텍스트 없음.
- 갤러리 표현력 10점: 실제 썸네일, style/density/pageType 태그, premium/under review 상태가 명확한가.

판정:

- 90점 이상: Premium ready
- 85-89점: Showcase 승인 가능, 단 P1 결함 0개
- 70-84점: Under review
- 69점 이하: Redesign required

### 리뷰 체크리스트

- `builderCanvasDocumentSchema.parse()` 통과
- duplicate node id 없음
- parentId가 존재하지 않는 노드를 참조하지 않음
- root node가 stage bounds를 눈에 띄게 초과하지 않음
- image `src`가 실제 `public/images/templates/...` 또는 검증된 기존 자산을 가리킴
- `placeholder-*`, `/images/placeholder-*.jpg`, 회색 wireframe 썸네일 없음
- 모든 비장식 이미지에 의미 있는 alt 존재
- 모든 button/CTA의 `href`가 `#`가 아님
- H1은 1개
- 제목 계층은 H1 -> H2 -> H3 순서 유지
- CTA/button 높이 44px 이상
- desktop 1280, tablet 768, mobile 375 기준으로 텍스트 overflow/겹침 없음
- 업종별 필수 전환 요소 존재

### 스크린샷 리뷰 프로세스

1. Baseline 촬영: `law-home`, `restaurant-home`, `startup-home`, `ecommerce-home`, `creative-home`을 desktop/tablet/mobile 3종으로 저장한다.
2. PR 또는 작업 단위마다 동일 viewport로 Before/After를 생성한다.
3. 리뷰어는 한 템플릿당 90초 안에 1차 판정한다.
4. 1차 판정 질문: 업종이 보이는가, 프리미엄으로 보이는가, 깨진 부분이 보이는가.
5. 상세 리뷰는 hero, 이미지, CTA, 모바일 첫 화면, 갤러리 썸네일만 본다.
6. 결함은 스크린샷 파일명과 viewport를 붙여 기록한다.
7. layout family나 palette가 바뀐 경우 3 viewport 전체를 다시 본다.

### Preview / Thumbnail 운영

예정 스크립트:

- `scripts/generate-template-previews.ts`

입력:

- `getTemplateCatalog()`의 template id 목록

출력:

- `public/images/templates/previews/{templateId}-desktop.webp`
- `public/images/templates/previews/{templateId}-tablet.webp`
- `public/images/templates/previews/{templateId}-mobile.webp`
- `public/images/templates/previews/manifest.json`

렌더 기준:

- desktop: `1440x1100` capture, 16:10 crop
- tablet: `768x1024` capture
- mobile: `375x812` capture

갤러리 카드:

- desktop thumbnail 우선
- 없으면 premium fallback
- 회색 SVG wireframe은 premium badge 대상에서 제외

### 결함 분류

- P0 Blocker: schema parse 실패, broken image, 런타임 에러, template 선택 불가, preview route crash
- P1 Release Blocker: placeholder 이미지, CTA `href: '#'`, 모바일 주요 텍스트 겹침, H1 없음/중복, premium badge 오표시
- P2 Quality Defect: 업종 차별성 약함, CTA 문구 일반적, 썸네일 crop 부자연, alt 부실, 버튼 터치 영역 부족
- P3 Polish: 간격 미세 조정, hover 느낌, section rhythm, 태그 문구, 썸네일 색 보정
- Ops Defect: manifest 누락, 스크린샷 stale, QA 점수 미기록, 리뷰 owner 없음

### Sign-off Gates

Gate A: Baseline Lock

- registry 개수 기록
- placeholder 목록 기록
- `href: '#'` 목록 기록
- 쇼케이스 5개 스크린샷 저장

Gate B: Template QA Ready

- QA script가 schema, node id, parent, image, alt, href, bounds, responsive를 점수화한다.

Gate C: Showcase Design Ready

- 쇼케이스 5개가 각각 85점 이상이다.
- P0/P1 결함 0개다.

Gate D: Gallery Showroom Ready

- 실제 thumbnail 또는 premium fallback이 보인다.
- style/density/pageType 필터가 동작한다.
- premium/under review badge가 보인다.

Gate E: Engineer Handoff

- 디자인 변경 요청은 frozen backlog로 넘긴다.
- 코어 엔지니어는 QA script와 manifest 계약만 기준으로 작업한다.

### 병렬 운영 규칙

- 디자이너는 template id 단위로 ownership을 가진다.
- 같은 template id를 동시에 수정하지 않는다.
- 엔지니어에게 넘기는 계약은 `PageTemplate`, preview manifest, QA score JSON으로 제한한다.
- 디자인 리뷰는 매일 2회 batch로만 연다.
- 엔지니어는 리뷰 회의 참석 없이 결과 리포트만 받는다.
- P0/P1은 즉시 owner 지정.
- P2/P3는 다음 디자인 batch로 예약.
- 코어 엔지니어 작업은 Gate C 이후 시작한다.
- Gate C 이후 디자인 변경은 API/renderer 계약을 깨지 않는 범위에서만 허용한다.

---

## 7. 전체 실행 순서

### Step 1: Baseline Lock

담당: Designer 6, Designer 1

작업:

- 현재 registry template 개수 기록.
- placeholder image reference 목록 생성.
- `href: '#'` 목록 생성.
- 쇼케이스 5개 desktop/tablet/mobile baseline screenshot 저장.
- 현재 갤러리 screenshot 저장.

완료:

- baseline report가 생긴다.
- 쇼케이스 5개 문제 목록이 P0/P1/P2/P3로 분류된다.

### Step 2: Metadata + Visual System

담당: Designer 2, Designer 1

작업:

- `PageTemplate` optional metadata 확장.
- `design-system.ts` 추가.
- palette/type/spacing/image mood 정의.
- metadata overlay 추가.
- gallery filters 추가.

완료:

- 갤러리가 style/density/pageType/qualityTier를 읽을 수 있다.
- 기존 템플릿 선택 흐름이 깨지지 않는다.

### Step 3: Gallery Showroom

담당: Designer 1, Designer 6

작업:

- 템플릿 카드 anatomy 개선.
- premium fallback thumbnail 교체.
- 라이브 프리뷰 모달 설계.
- preview route와 manifest 계약 정의.
- empty/loading/error 상태 설계.

완료:

- 회색 wireframe이 기본 경험이 아니다.
- 쇼케이스 5개가 카드에서 프리미엄처럼 보인다.

### Step 4: Showcase 5 Redesign

담당: Designer 2, Designer 3, Designer 4, Designer 5

작업:

- `law-home`: editorial authority 로펌
- `restaurant-home`: reservation-driven warm restaurant
- `startup-home`: product-led SaaS launch
- `ecommerce-home`: premium collection commerce
- `creative-home`: portfolio/editorial studio

완료:

- 5개 모두 서로 다른 hero, palette, CTA, image direction, section rhythm을 가진다.
- 5개 모두 desktop/tablet/mobile QA 85점 이상.

### Step 5: Legal Premium Expansion

담당: Designer 3, Designer 5, Designer 6

작업:

- `law-apex-cross-border`
- `law-vanguard-litigation`
- `law-harbor-private-client`
- `law-regulatory-advisory`

완료:

- 4개 패밀리 각각 8페이지 맵 완성.
- Home + Contact/Intake 전환 흐름 완성.

### Step 6: Local / Lifestyle Upgrade

담당: Designer 4, Designer 5, Designer 6

작업:

- restaurant, cafe, beauty, fitness, pet, travel, photography, music home 우선 개선.
- 이후 page map 확장.

완료:

- 8개 업종 home을 썸네일만 보고도 구분 가능.
- 업종별 전환 요소가 실제 사업자에게 쓸 수 있다.

### Step 7: Engineer Handoff

담당: Designer 6

작업:

- QA score JSON 계약 고정.
- preview manifest 계약 고정.
- `PageTemplate` metadata 계약 고정.
- P0/P1 결함 0개 확인.

완료:

- `WIX-PARITY-6-ENGINEER-WORK-ORDERS.md`의 6명 코어팀 작업 시작 가능.

---

## 8. 최종 완료 기준

템플릿 디자인 완료는 아래 조건을 모두 만족해야 한다.

- 쇼케이스 5개가 Wix 템플릿 갤러리에 넣어도 어색하지 않은 첫인상을 가진다.
- 갤러리 첫 화면이 debug list가 아니라 premium showroom처럼 보인다.
- 회색 wireframe thumbnail이 기본 경험에서 제거된다.
- 템플릿 카드에서 업종, 스타일, 품질, 목적이 즉시 보인다.
- style/density/pageType/qualityTier 필터가 동작한다.
- 쇼케이스 5개 QA 점수 85점 이상.
- P0/P1 결함 0개.
- placeholder image 0개.
- CTA `href: '#'` 0개.
- desktop/tablet/mobile overflow 0개.
- BrandKit v1 호환 유지.
- 코어 엔지니어가 사용할 metadata/manifest/QA score 계약이 고정된다.

이 기준을 통과한 뒤에만 6명 코어 엔지니어 작업을 시작한다.
