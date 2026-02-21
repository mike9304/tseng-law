# FRONTEND DESIGN AGENT V3.1 — Shin & Kim (세종) Purple–Inspired Design + 증준외 Lawyer Content

> **This is the DEFINITIVE design and content prompt for hoveringlaw.com.tw.**
> Design reference: https://www.shinkim.com/kor (법무법인 세종 SHIN & KIM)
> CI designed by: DESIGNFOCUS (designfocus.co.kr) — 2019/2020 CI renewal
> Previous references: https://www.kimchang.com/ko/main.kc (V2, for selective dark accents)
> Content sources: hoveringlaw.com.tw, wei-wei-lawyer.com, YouTube @weilawyer, Naver Blog wei_lawyer
> **V3.1 CORRECTION: Navy blue → Purple per actual Shin & Kim CI (confirmed via DESIGNFOCUS + 법률신문 2020)**
> This prompt contains ALL design specs, ALL real content, and ALL implementation details.

---

## TABLE OF CONTENTS

1. Design Philosophy — Shin & Kim True Style Analysis
2. Color System V3.1 (Purple-Corrected)
3. Typography V3.1
4. Shin & Kim Micro-Feature Inventory (세종 사이트 세부 UI 요소)
5. Homepage Structure (Full-Page Sections)
6. Section-by-Section Specs with REAL Content
7. Interior Pages (Services, Blog, Attorney Profile, Company Formation)
8. Navigation & Mobile Menu (Shin & Kim Style Detail)
9. Animations & Transitions
10. Responsive Rules
11. Video Acquisition Strategy
12. Font Installation Guide
13. Quality Checklist V3.1

---

## 1. DESIGN PHILOSOPHY — SHIN & KIM TRUE STYLE ANALYSIS

### Shin & Kim (세종) CI Background (2020 Renewal)

Source: DESIGNFOCUS official portfolio + 법률신문 2020.01.02

> "신규 CI의 컬러는 합리적이고 이성적인 사고를 의미하는 **푸른색(Blue)**과 열정, 에너지를 나타내는 **붉은색(Red)**의 조합인 **보라색(Purple)**을 메인컬러로 사용하여 **중도와 조화를 상징적으로 표현**하였고, 법무법인 세종을 구성하는 각 분야의 전문가들의 통찰력, 창의성과 균형있는 팀워크를 상징적으로 담았습니다."

> 로고: 소형대문자(small capital) 표기법 — "보다 낮은 자세로 고객과 소통하는 법률서비스의 시작점이 되겠다"

### Shin & Kim (세종) Observed Design DNA

**Overall Impression: 밝고 깨끗한 화이트 기반, 보라색 포인트**

- **85~90% 화이트/라이트 기반**: 어두운 섹션은 히어로 비디오와 푸터 정도로 극히 제한
- **보라색(Purple)** 메인 액센트 — 네이비 블루가 아님 (V3에서 잘못 판단 수정)
- **소형대문자(Small Caps)** 로고 — 'shin & kim' 전체 소문자 스타일
- **세리프 + 산세리프** 서체 조합 — 격식과 현대성의 균형
- **구조적 그리드 시스템** — 매우 정돈되고 체계적인 레이아웃
- **풍부한 여백(Whitespace)** — 모든 섹션에 숨 쉴 공간
- **뉴스/미디어 전면 배치** — Insights, 언론보도, 업무사례가 메인 콘텐츠
- **전문 사진** — 고품질 팀/사무실 이미지
- **절제된 애니메이션** — 화려함 없이 목적 있는 인터랙션만
- **글로벌 다사무소** 강조 — 서울, 판교, 하노이, 호치민, 싱가포르, 자카르타 등

### V3.1 Design Identity for 법무법인 호정

**"세종의 밝은 보라 구조 위에 김앤장의 시네마틱 깊이를 조금만 더한다"**

V3에서의 60/40 다크/라이트 → **V3.1에서는 25/75 다크/라이트로 전환**

| Element | Shin & Kim (세종) Influence | Kim & Chang (김앤장) Influence | Our V3.1 |
|---------|---------------------------|-------------------------------|----------|
| Overall Tone | 85% white/light | 90% dark | **75% light, 25% dark** |
| Primary Accent | Purple (보라색) | Gold (#C4A265) | **Purple on light, Gold on dark only** |
| Hero | Full-width rotating news | Full-screen video | Full-screen video (dark, 유일한 다크 히어로) |
| Grid | Structured 12-col grid | Full-bleed cinematic | Structured grid (세종 스타일) |
| Typography | Serif headings, Sans body | Korean serif dominant | Serif headings + Sans body |
| Cards | White cards, subtle border | Dark floating cards | White cards, purple left-border hover |
| Sections | Alternating white/off-white | All dark | White → Cream → White → Dark(가끔) |
| Footer | Clean, minimal, light gray | Dramatic dark | Dark footer (김앤장 스타일 유지) |
| Navigation | White bg, purple accent | Dark transparent overlay | White bg, purple accent (세종 스타일) |

---

## 2. COLOR SYSTEM V3.1 (PURPLE-CORRECTED)

```css
:root {
  /* ═══════════════════════════════════════════════
     PRIMARY: PURPLE (세종 CI DNA)
     Blue(이성) + Red(열정) = Purple(중도·조화)
     ═══════════════════════════════════════════════ */
  --accent-purple: #5B3A8C;          /* Main brand purple — 메인 액센트 */
  --accent-purple-light: #7B5EAD;    /* Hover / lighter variant */
  --accent-purple-dark: #3D2266;     /* Pressed / darker variant */
  --accent-purple-bg: #F5F0FA;       /* Ultra-light purple tint for card backgrounds */
  --accent-purple-border: #D4C4E8;   /* Subtle purple border for cards */

  /* ═══════════════════════════════════════════════
     SECONDARY: GOLD (김앤장 DNA — 다크 섹션 전용)
     ═══════════════════════════════════════════════ */
  --accent-gold: #C4A265;            /* Gold accent on dark sections ONLY */
  --accent-gold-light: #D4B67A;      /* Gold hover */
  --accent-gold-dim: #8B7342;        /* Gold muted */

  /* ═══════════════════════════════════════════════
     LIGHT SPECTRUM (주 배경 — 전체의 75%)
     세종 스타일: 순백 + 웜 오프화이트 교차
     ═══════════════════════════════════════════════ */
  --bg-white: #FFFFFF;               /* Primary page background */
  --bg-off-white: #FAFAFA;           /* Alternate section bg */
  --bg-cream: #F8F7F5;               /* Warm off-white for variation */
  --bg-light-purple: #F9F7FC;        /* Very subtle purple-tinted bg */
  --bg-card: #FFFFFF;                /* Card background */
  --bg-card-hover: #FDFBFF;          /* Card hover bg */

  /* ═══════════════════════════════════════════════
     DARK SPECTRUM (히어로, 푸터, 특별 섹션 — 전체의 25%)
     ═══════════════════════════════════════════════ */
  --bg-dark: #1A1A2E;               /* Deep dark with hint of purple-blue */
  --bg-dark-secondary: #16162A;     /* Slightly darker variation */
  --bg-dark-card: #22223A;          /* Cards on dark bg */

  /* ═══════════════════════════════════════════════
     TEXT HIERARCHY
     ═══════════════════════════════════════════════ */
  /* On Light backgrounds */
  --text-primary: #1A1A2E;           /* Main heading text (dark purple-black) */
  --text-body: #4A4A5A;             /* Body text (warm dark gray) */
  --text-secondary: #6B6B7B;        /* Secondary / muted text */
  --text-caption: #9A9AAA;          /* Captions, labels */
  --text-link: #5B3A8C;             /* Link text = brand purple */
  --text-link-hover: #7B5EAD;       /* Link hover */

  /* On Dark backgrounds */
  --text-on-dark: #F0EDF5;          /* Main text on dark (soft white) */
  --text-on-dark-secondary: #B8B0C8; /* Secondary text on dark */
  --text-on-dark-muted: #8A8098;    /* Muted text on dark */
  --text-on-dark-gold: #C4A265;     /* Gold accent text on dark */

  /* ═══════════════════════════════════════════════
     BORDERS & DIVIDERS
     ═══════════════════════════════════════════════ */
  --border-light: #E8E8EE;          /* Default border on light bg */
  --border-medium: #D0D0DC;         /* Stronger border */
  --border-purple: #D4C4E8;         /* Purple tinted border */
  --border-dark: #2E2E4A;           /* Border on dark bg */
  --divider: #F0F0F4;               /* Section divider line */

  /* ═══════════════════════════════════════════════
     SHADOWS
     ═══════════════════════════════════════════════ */
  --shadow-sm: 0 1px 3px rgba(91, 58, 140, 0.04);
  --shadow-md: 0 4px 12px rgba(91, 58, 140, 0.06);
  --shadow-lg: 0 8px 24px rgba(91, 58, 140, 0.08);
  --shadow-card-hover: 0 8px 30px rgba(91, 58, 140, 0.12);
}
```

### Color Usage Rules — STRICTLY FOLLOW

| Context | Primary Accent | Secondary | Text | Background |
|---------|---------------|-----------|------|------------|
| Light sections | `--accent-purple` | `--accent-purple-light` | `--text-primary` / `--text-body` | `--bg-white` or `--bg-cream` |
| Dark sections (hero, footer) | `--accent-gold` | `--accent-gold-light` | `--text-on-dark` | `--bg-dark` |
| Cards on light | Purple left-border on hover | — | `--text-primary` | `--bg-card` with `--shadow-sm` |
| Cards on dark | Gold left-border on hover | — | `--text-on-dark` | `--bg-dark-card` |
| Navigation | `--accent-purple` for active | — | `--text-primary` | `--bg-white` |
| Buttons (CTA) | `--accent-purple` bg, white text | — | White | `--accent-purple` |
| Links | `--text-link` → `--text-link-hover` on hover | — | — | — |

**CRITICAL: Gold accent (#C4A265) is ONLY used on dark backgrounds. Purple accent (#5B3A8C) is the PRIMARY brand color used everywhere else. Never use gold on light backgrounds.**

---

## 3. TYPOGRAPHY V3.1

### Font Stack

```css
/* Korean serif — 격식과 권위 (headings) */
--font-display-ko: 'Nanum Myeongjo', 'Batang', serif;

/* Chinese Traditional serif — 대만 고객용 (headings) */
--font-display-zh: 'Noto Serif TC', serif;

/* English serif — 서양 격식 (headings) */
--font-display-en: 'Cormorant Garamond', 'Georgia', serif;

/* Body text — 모든 언어 공통 산세리프 */
--font-body-ko: 'Pretendard', 'Noto Sans KR', sans-serif;
--font-body-zh: 'Noto Sans TC', sans-serif;
--font-body-en: 'Pretendard', sans-serif;

/* Monospace — 숫자, 통계, 코드 */
--font-mono: 'JetBrains Mono', 'SF Mono', monospace;
```

### Font CDN Links

```html
<!-- Pretendard (Korean body) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />

<!-- Google Fonts (serif headings + Chinese) -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Noto+Serif+TC:wght@400;600;700&family=Noto+Sans+TC:wght@400;500;700&display=swap" rel="stylesheet" />
```

### Type Scale

```css
/* Heading sizes */
.hero-title      { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 800; line-height: 1.15; letter-spacing: -0.02em; }
.section-title   { font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 700; line-height: 1.25; letter-spacing: -0.015em; }
.card-title      { font-size: clamp(1.125rem, 1.5vw, 1.375rem); font-weight: 700; line-height: 1.35; }
.subtitle        { font-size: clamp(1rem, 1.25vw, 1.125rem); font-weight: 400; line-height: 1.5; }

/* Body sizes */
.body-lg         { font-size: 1.125rem; line-height: 1.75; }  /* 18px */
.body-md         { font-size: 1rem; line-height: 1.7; }       /* 16px */
.body-sm         { font-size: 0.875rem; line-height: 1.6; }   /* 14px */

/* Utility */
.section-label   { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; }
.stat-number     { font-family: var(--font-mono); font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 700; }
.caption         { font-size: 0.8125rem; color: var(--text-caption); }
```

---

## 4. SHIN & KIM MICRO-FEATURE INVENTORY (세종 사이트 세부 UI 요소)

> 이 섹션은 세종(shinkim.com) 사이트에서 관찰된 세부 UI 패턴과 마이크로인터랙션을 상세 기술합니다.
> 호정 사이트에 적용 가능한 요소들을 선별하여 구현 스펙까지 포함합니다.

### 4.1 Global Navigation Bar (글로벌 네비게이션)

**세종 관찰:** 상단에 흰색 배경 고정 네비, 스크롤 시에도 유지. 보라색 로고 좌측, 메뉴 우측 수평 배치.

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo: shin & kim]     업무분야  구성원  미디어센터  사무소  연락처  KOR|ENG │
│                                                          [🔍]  │
└─────────────────────────────────────────────────────────────────┘
```

**호정 적용 스펙:**

```
INITIAL STATE (top):
├── Height: 80px
├── Background: transparent (hero 위에서는 glass-morphism 또는 투명)
├── Logo: 'shin & kim' 스타일 소문자 → 호정은 '법무법인 호정' (Nanum Myeongjo, 1.25rem)
├── Menu items: Pretendard 500, 0.9375rem, --text-primary
├── Language switcher: KO | 繁中 | EN (0.75rem, pill tabs, active=purple bg)
└── Search icon: 24×24, --text-secondary, hover → --accent-purple

SCROLLED STATE (scroll > 100px):
├── Height: 64px (shrink)
├── Background: white with border-bottom: 1px solid var(--border-light)
├── Box-shadow: var(--shadow-sm)
├── Logo: scale 0.9
└── Transition: all 0.3s ease

HOVER EFFECT on menu items:
├── Color: --text-primary → --accent-purple (0.2s)
├── Bottom border: 2px solid --accent-purple
├── Border animation: width 0→100% from left (0.3s ease-out)
└── No background change (clean)

ACTIVE PAGE indicator:
├── Color: --accent-purple
├── Font-weight: 600
└── Bottom border: 2px solid --accent-purple (always visible)
```

### 4.2 Mega Dropdown (메가 드롭다운)

**세종 관찰:** '업무분야' 호버 시 카테고리별/산업별 리스트 드롭다운. '구성원' 호버 시 이름 검색 input 포함.

**호정 적용:**

```
업무분야 HOVER → Mega dropdown:
┌──────────────────────────────────────────────────┐
│  카테고리별                    산업별              │
│  ──────────                 ──────────          │
│  대만 내 투자 관련 업무         건설               │
│  대만 형사소송                 지식재산권           │
│  대만 민사소송                 금융·보험           │
│  대만 가정사건                 부동산              │
│  지적재산권                                      │
│  금융·보험 분쟁                                   │
└──────────────────────────────────────────────────┘
CSS:
├── Width: max-content, min 500px
├── Background: white
├── Border: 1px solid var(--border-light)
├── Border-top: 3px solid var(--accent-purple)
├── Shadow: var(--shadow-lg)
├── Padding: 32px 40px
├── Animation: opacity 0→1, translateY(-8px→0), 0.25s ease
├── Column gap: 48px
├── Category label: section-label style, --accent-purple, uppercase, 0.7rem
└── Item: Pretendard 400, 0.9375rem, hover → --accent-purple + translateX(4px)
```

### 4.3 Search Overlay (검색 오버레이)

**세종 관찰:** 우상단 돋보기 아이콘 클릭 → 전체화면 or 헤더 영역 검색 입력 패널 확장.

**호정 적용:**

```
TRIGGER: 🔍 icon click
OVERLAY:
├── Background: rgba(255,255,255,0.97) + backdrop-filter: blur(20px)
├── Full-width, height: auto (max 200px)
├── Border-bottom: 1px solid var(--border-light)
├── Animation: height 0→auto, 0.3s ease
├── Input field:
│   ├── Width: 60%, centered
│   ├── Font: Pretendard 400, 1.25rem
│   ├── Border: none, border-bottom: 2px solid var(--accent-purple)
│   ├── Placeholder: "검색어를 입력하세요" (--text-caption)
│   ├── Focus: border-bottom color transition
│   └── Autofocus: true
├── Close: ✕ button, 24×24, top-right
└── Search scope tags (optional):
    ├── 전체 | 업무분야 | 구성원 | 미디어
    └── Pill buttons, active = --accent-purple bg white text
```

### 4.4 Member/Attorney Search & Filter (구성원 검색 필터)

**세종 관찰:** /kor/member 페이지에 구성원 검색 기능, 분야별 필터, 이름 키워드 검색.

**호정 적용 (간소화):**

```
MEMBER PAGE (/about):
┌──────────────────────────────────────────────┐
│  구성원소개                                    │
│                                              │
│  [이름으로 검색... 🔍]                          │
│                                              │
│  필터: [전체] [변호사] [사무장] [회계사]           │
│  사무소: [전체] [타이중] [까오슝] [핑둥]           │
│                                              │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐        │
│  │ 사진  │  │ 사진  │  │ 사진  │  │ 사진  │        │
│  │ 이름  │  │ 이름  │  │ 이름  │  │ 이름  │        │
│  │ 역할  │  │ 역할  │  │ 역할  │  │ 역할  │        │
│  └─────┘  └─────┘  └─────┘  └─────┘        │
└──────────────────────────────────────────────┘

FILTER PILLS:
├── Default: border: 1px solid var(--border-light), bg: white
├── Active: bg: var(--accent-purple), color: white, border: none
├── Hover: bg: var(--accent-purple-bg), border-color: var(--accent-purple)
├── Transition: all 0.2s ease
├── Border-radius: 4px (not rounded pill)
├── Padding: 8px 16px
└── Font: Pretendard 500, 0.8125rem

MEMBER CARD:
├── Background: white
├── Border: 1px solid var(--border-light)
├── Border-radius: 0 (square, not rounded)
├── Shadow: none → var(--shadow-md) on hover
├── Photo: aspect-ratio 3:4, grayscale(0.1) → grayscale(0) on hover
├── Name: Pretendard 600, 1rem, --text-primary
├── Role: Pretendard 400, 0.8125rem, --text-secondary
├── Office: Pretendard 400, 0.75rem, --accent-purple
├── Hover: border-top: 3px solid var(--accent-purple), translateY(-2px)
└── Click: → individual profile page
```

### 4.5 Media Center / News Feed (미디어센터)

**세종 관찰:** 탭 기반 — 세종소식 / 언론보도 / 업무사례 / 뉴스레터 / 기고·연구자료. 목록형 리스트 + 페이지네이션.

**호정 적용:**

```
MEDIA TAB BAR:
├── Style: text tabs, bottom-border active indicator
├── Items: 호정칼럼 | 대만 법인설립 | 대만 법률정보 | 소송사례
├── Active tab: --accent-purple, font-weight 600, border-bottom 2px solid
├── Inactive: --text-secondary, font-weight 400
├── Hover: --text-primary
└── Transition: color 0.2s, border 0.3s (slide from left)

NEWS LIST ITEM:
┌──────────────────────────────────────────────┐
│  [Category Tag]  2024.03.15                   │
│  대만 화장품 시장 진출: 법인 설립부터 PIF 등록까지  │
│  대만에서 화장품 시장에 진출하기 위해서는...        │
│  ─────────────────────────────────────────── │
│  [Category Tag]  2024.02.20                   │
│  대만 헬스장 부상 소송 (157만 TWD 승소)           │
│  ...                                         │
└──────────────────────────────────────────────┘

LIST ITEM:
├── Padding: 24px 0
├── Border-bottom: 1px solid var(--divider)
├── Category tag: inline-block, bg: var(--accent-purple-bg), color: --accent-purple
│   ├── Font: 0.75rem, 500
│   ├── Padding: 4px 10px
│   └── Border-radius: 2px
├── Date: 0.8125rem, --text-caption, float right
├── Title: 1.125rem, 600, --text-primary
│   └── Hover: --accent-purple, 0.2s
├── Excerpt: 0.875rem, --text-body, max 2 lines (line-clamp: 2)
└── Hover: 전체 row bg: var(--bg-off-white), 0.2s

PAGINATION:
├── Style: 1 2 3 ... 10 [→]
├── Current: --accent-purple bg, white text
├── Default: border: 1px solid var(--border-light)
├── Hover: border-color: var(--accent-purple)
├── Size: 36×36px each
└── Font: 0.875rem, 500
```

### 4.6 Breadcrumb (브레드크럼 내비게이션)

**세종 관찰:** 내부 페이지 상단에 위치 경로 표시. 홈 > 업무분야 > 대만 민사소송

**호정 적용:**

```
BREADCRUMB:
├── Position: 내부 페이지 히어로 아래, 콘텐츠 시작 전
├── Font: Pretendard 400, 0.8125rem
├── Color: --text-caption
├── Separator: > (0.75rem, --text-caption)
├── Current page: --text-primary, font-weight 500
├── Link hover: --accent-purple
├── Margin-bottom: 32px
└── Example: 홈 > 업무분야 > 대만 민사소송
```

### 4.7 Side Dot Navigation (우측 도트 네비게이션)

**세종과는 다르게 김앤장 요소 — 홈페이지 풀페이지 스크롤용**

```
POSITION: fixed, right: 24px, top: 50%, transform: translateY(-50%)
ONLY VISIBLE: homepage, desktop (>1024px)

DOT STATES:
├── Inactive: 8×8 circle, bg: var(--border-medium), opacity: 0.5
├── Active: 8×24 rounded pill, bg: var(--accent-purple)
├── Hover: opacity: 1, bg: var(--accent-purple-light)
├── Transition: all 0.3s ease

TOOLTIP on hover:
├── Show section name to the left of dot
├── Background: var(--bg-dark)
├── Color: var(--text-on-dark)
├── Font: 0.75rem, 500
├── Padding: 4px 10px
├── Border-radius: 4px
├── Animation: opacity 0→1, translateX(4px→0), 0.2s
└── Arrow: right-pointing, same bg color
```

### 4.8 Scroll-to-Top Button (상단으로 이동 버튼)

**세종 관찰:** 우하단 고정, 스크롤 일정량 이상 시 나타남.

```
TRIGGER: scroll > 500px
POSITION: fixed, bottom: 32px, right: 32px
SIZE: 48×48px
SHAPE: circle
BACKGROUND: var(--accent-purple)
ICON: ↑ arrow, white, 20×20
SHADOW: var(--shadow-md)
HOVER: bg: var(--accent-purple-dark), shadow: var(--shadow-lg), scale(1.05)
TRANSITION: opacity 0→1, translateY(16px→0), 0.3s ease
Z-INDEX: 50
MOBILE: bottom: 24px, right: 16px, 44×44px
```

### 4.9 Cookie Consent & Accessibility Banner

**세종 관찰:** 하단에 쿠키 동의 배너, 웹접근성 준수 안내.

```
COOKIE BANNER (최초 방문 시):
├── Position: fixed bottom, full-width
├── Background: white
├── Border-top: 1px solid var(--border-light)
├── Shadow: 0 -4px 16px rgba(0,0,0,0.08)
├── Padding: 16px 24px
├── Layout: flex, text left, buttons right
├── Text: 0.8125rem, --text-body
├── Accept button: bg: var(--accent-purple), white text, 0.8125rem
├── More info: text link, --text-link
├── Z-index: 100
└── Animation: slideUp from bottom, 0.4s ease
```

### 4.10 Office/Location Interactive Map (사무소 인터랙티브 맵)

**세종 관찰:** 각 사무소별 탭, 구글맵 연동, 발렛파킹 안내까지 상세.

**호정 적용:**

```
OFFICE TABS:
├── Horizontal tab bar
├── Items: 타이중 사무소 | 까오슝 사무소 | 핑둥 사무소
├── Active: --accent-purple, border-bottom 2px
├── Tab content:
│   ├── Left (60%): Google Maps embed
│   │   └── Map style: default (light — 세종 스타일)
│   └── Right (40%): Office info card
│       ├── Office name: 1.125rem, 700
│       ├── Address: 0.875rem, --text-body, icon: 📍
│       ├── Tel: 0.875rem, icon: 📞, click-to-call
│       ├── Fax: 0.875rem, icon: 📠
│       ├── Directions button: outlined, --accent-purple
│       └── 카카오맵/구글맵 open links
└── Transition: fade 0.3s between tabs
```

### 4.11 YouTube Embed Section (동영상 섹션)

**세종 관찰:** YouTube 채널 연동, 동영상 임베드 섹션 (사이판 워크샵 Vlog 등).

**호정 적용:**

```
YOUTUBE SECTION (optional, in profile or media page):
├── Embed: responsive 16:9 iframe
├── Thumbnail overlay: play button ▶ circle (white bg, --accent-purple icon)
├── Below: video title + date
├── Channel link: YouTube @weilawyer → "채널 바로가기" button
└── Max-width: 720px, centered
```

### 4.12 Hover Card Patterns (공통 카드 인터랙션)

```
CARD PATTERN A — 라이트 섹션용 (업무분야, 법인설립):
├── Background: white
├── Border: 1px solid var(--border-light)
├── Border-radius: 0 (square corners — 세종 스타일, 둥글지 않음!)
├── Padding: 32px
├── DEFAULT: shadow: var(--shadow-sm)
├── HOVER:
│   ├── border-left: 4px solid var(--accent-purple)
│   ├── shadow: var(--shadow-card-hover)
│   ├── translateY(-2px)
│   └── transition: all 0.3s ease
└── Title on hover: color → --accent-purple

CARD PATTERN B — 다크 섹션용 (히어로, 블로그):
├── Background: var(--bg-dark-card)
├── Border: 1px solid var(--border-dark)
├── Border-radius: 0
├── Padding: 24px
├── DEFAULT: no shadow
├── HOVER:
│   ├── border-left: 4px solid var(--accent-gold)
│   ├── background: lighten 5%
│   ├── translateY(-2px)
│   └── transition: all 0.3s ease
└── Title on hover: color → --accent-gold
```

### 4.13 Button System (버튼 체계)

```
PRIMARY BUTTON (메인 CTA):
├── Background: var(--accent-purple)
├── Color: white
├── Font: Pretendard 600, 0.9375rem
├── Padding: 14px 32px
├── Border: none
├── Border-radius: 2px (nearly square)
├── Shadow: 0 2px 8px rgba(91, 58, 140, 0.2)
├── Hover: bg: var(--accent-purple-dark), shadow: 0 4px 12px rgba(91, 58, 140, 0.3)
├── Active: scale(0.98)
└── Transition: all 0.2s ease

SECONDARY BUTTON (보조):
├── Background: transparent
├── Color: var(--accent-purple)
├── Border: 1px solid var(--accent-purple)
├── Hover: bg: var(--accent-purple), color: white
└── Same sizing as primary

GHOST BUTTON (다크 섹션용):
├── Background: transparent
├── Color: var(--accent-gold)
├── Border: 1px solid var(--accent-gold)
├── Hover: bg: var(--accent-gold), color: var(--bg-dark)
└── Same sizing as primary

TEXT BUTTON (inline):
├── Background: none
├── Color: var(--text-link)
├── Padding: 0
├── Border: none
├── Text-decoration: none → underline on hover
├── Font-weight: 500
└── Arrow: → appended, translateX(0→4px) on hover
```

### 4.14 Form Elements (폼 요소)

```
TEXT INPUT:
├── Height: 48px
├── Border: 1px solid var(--border-medium)
├── Border-radius: 2px
├── Padding: 0 16px
├── Font: Pretendard 400, 0.9375rem
├── Placeholder: --text-caption
├── Focus: border-color: var(--accent-purple), box-shadow: 0 0 0 3px var(--accent-purple-bg)
├── Error: border-color: #D93025, shadow with red tint
└── Transition: border-color 0.2s, box-shadow 0.2s

SELECT DROPDOWN:
├── Same as text input
├── Custom arrow icon: chevron-down, --text-secondary
├── Options dropdown: white bg, shadow-lg, max-height: 240px overflow scroll
└── Option hover: bg: var(--accent-purple-bg)

TEXTAREA:
├── Min-height: 120px
├── Resize: vertical
└── Same styling as text input

LABEL:
├── Font: Pretendard 500, 0.8125rem
├── Color: --text-primary
├── Margin-bottom: 6px
└── Required: red asterisk (color: #D93025)
```

### 4.15 Loading & Skeleton States (로딩 상태)

```
PAGE LOADER (initial):
├── Full screen overlay, bg: white
├── Center: 법무법인 호정 logo
├── Below logo: thin purple progress bar (width 0→100%)
├── Animation: logo fadeIn 0.5s, bar fills 1.5s
└── Exit: fadeOut 0.3s

SKELETON CARDS (content loading):
├── Card shape with rounded-rect placeholders
├── Background: linear-gradient(90deg, #f0f0f4 25%, #e8e8ee 50%, #f0f0f4 75%)
├── Animation: shimmer — background-position slides (1.5s infinite)
└── Border-radius: 2px for text blocks, 0 for cards
```

### 4.16 Section Label / Number Pattern (섹션 레이블)

**세종 관찰:** 섹션 시작 시 번호 + 키워드 라벨.

```
SECTION LABEL:
├── Format: "01 — Expertise" or "02 — Profile"
├── Font: var(--font-mono), 0.75rem, 600
├── Letter-spacing: 0.15em
├── Color: var(--accent-purple) on light, var(--accent-gold) on dark
├── Text-transform: uppercase
├── Margin-bottom: 16px
├── Left decorative line (optional):
│   ├── Width: 40px
│   ├── Height: 1px
│   ├── Color: same as text
│   └── Margin-right: 12px, vertically centered
└── Example: ── 01 — EXPERTISE
```

### 4.17 Accessibility Features (접근성)

**세종 관찰:** 웹접근성 준수 명시, WAI-ARIA 적용.

```
ARIA REQUIREMENTS:
├── All images: alt text (한국어 + 중국어)
├── Nav: role="navigation", aria-label="주 메뉴"
├── Buttons: aria-label when icon-only
├── Skip-to-content: first focusable element
├── Focus indicators: 3px outline, var(--accent-purple), offset 2px
├── Color contrast: WCAG AA minimum (4.5:1 for body text)
├── Keyboard navigation: full tab support
├── Language: lang="ko" default, hreflang for alternates
└── Reduced motion: @media (prefers-reduced-motion: reduce) { all animations: none }
```

---

## 5. HOMEPAGE STRUCTURE (FULL-PAGE SECTIONS)

### Section Flow — V3.1 (Light-Dominant)

```
Section 0: VIDEO HERO          (100vh, ★DARK★, 3 rotating videos)
Section 1: PHILOSOPHY + STATS  (auto, LIGHT cream bg)
Section 2: PRACTICE AREAS      (auto, LIGHT white bg, 2×3 grid)
Section 3: ATTORNEY PROFILE    (auto, LIGHT off-white bg, split layout)
Section 4: KEY ACHIEVEMENTS    (auto, LIGHT white bg, horizontal scroll)
Section 5: INSIGHTS / BLOG     (auto, ★DARK★, stacked cards)
Section 6: COMPANY FORMATION   (auto, LIGHT cream bg, infographic)
Section 7: OFFICES + MAP       (auto, LIGHT white bg, tabbed map)
Section 8: FOOTER + CONTACT    (auto, ★DARK★)
```

**Dark sections (3 of 9):** Hero, Blog, Footer
**Light sections (6 of 9):** Philosophy, Practice, Attorney, Achievements, Formation, Offices

Scroll behavior:
- Desktop: **smooth scroll** (NOT snap scroll — 세종은 snap scroll 안 씀)
- Mobile: normal scroll
- Dot nav: 우측, desktop only

---

## 6. SECTION-BY-SECTION SPECS WITH REAL CONTENT

### Section 0: VIDEO HERO (100vh, DARK)

```
LAYOUT: Full-screen video background with centered overlay text

VIDEO:
├── Source: 3 rotating videos (8s each, crossfade 1s)
│   ├── Video 1: Taipei 101 skyline at dusk/night (Pexels)
│   ├── Video 2: Business meeting / handshake scene (Pexels)
│   └── Video 3: Legal books / scales of justice (Pexels)
├── Overlay: linear-gradient(to bottom, rgba(26,26,46,0.5), rgba(26,26,46,0.75))
├── Fallback: Ken Burns effect on team-photo-new.jpg
├── Autoplay, muted, loop, playsinline
└── Object-fit: cover

TEXT OVERLAY (centered):
├── Line 1: 법무법인 호정
│   ├── Font: Nanum Myeongjo, 800
│   ├── Size: hero-title (clamp 2.5~4rem)
│   ├── Color: var(--text-on-dark) (#F0EDF5)
│   └── Animation: fadeInUp, 0.8s, delay 0.3s
├── Line 2: 昊鼎國際法律事務所
│   ├── Font: Noto Serif TC, 600
│   ├── Size: 1.5rem
│   ├── Color: var(--text-on-dark-secondary)
│   └── Animation: fadeInUp, 0.8s, delay 0.5s
├── Line 3: Hovering Law International
│   ├── Font: Cormorant Garamond, 400, italic
│   ├── Size: 1.125rem
│   ├── Color: var(--text-on-dark-muted)
│   └── Animation: fadeInUp, 0.8s, delay 0.7s
├── Divider: ──── 대만 유일의 한국어 법률사무소 ────
│   ├── Lines: 40px, 1px, var(--accent-gold)
│   ├── Text: Pretendard 400, 0.875rem, var(--accent-gold)
│   └── Animation: fadeIn, 0.8s, delay 1.0s
└── CTA Button: "상담 예약" (ghost button, gold border)
    └── Animation: fadeIn, 0.8s, delay 1.2s

BOTTOM:
├── Scroll indicator: "SCROLL" text + animated line (bounce-slow 2s infinite)
│   ├── Color: var(--text-on-dark-muted)
│   └── Font: var(--font-mono), 0.625rem, letter-spacing: 0.2em
└── Video progress: 3 dots/bars, bottom-right, gold active indicator
```

### Section 1: PHILOSOPHY + STATS (auto, LIGHT — bg-cream)

```
SECTION LABEL: ── 01 — ABOUT (--accent-purple)
PADDING: 120px 0

LAYOUT: max-width 960px, centered

TITLE: "복잡한 대만 법률을 명확하게 안내합니다"
├── Font: Nanum Myeongjo, section-title
├── Color: --text-primary
├── '명확하게': color: var(--accent-purple), font-weight: 800
└── Text-align: center

BODY TEXT (below title, 24px gap):
"'호'(昊)는 '광대한 하늘'을 의미하고, '정'(鼎)은 '안정된 기초'를 뜻합니다.
높은 목표와 견고한 기반을 지향하며, 한국어·일본어에 능통한 전문가들이
대만 내 투자, 법인설립, 소송 등 모든 법률 문제를 원스톱으로 해결합니다."
├── Font: Pretendard, body-lg
├── Color: --text-body
├── Text-align: center
├── Max-width: 720px
└── Line-height: 1.85

STATS ROW (below text, 64px gap):
├── Layout: 4 columns, centered
├── Divider: 1px solid var(--border-light) between columns
├── Each stat:
│   ├── Number: var(--font-mono), stat-number, --accent-purple
│   ├── Label: Pretendard 400, 0.875rem, --text-secondary
│   ├── CountUp animation: 0 → target, 2s, on viewport entry
│   └── Gap between number and label: 8px

10+ 년 경력 | 500+ 처리 사건 | 5 사무소 | 4 개국어 지원
```

### Section 2: PRACTICE AREAS (auto, LIGHT — bg-white)

```
SECTION LABEL: ── 02 — EXPERTISE (--accent-purple)
PADDING: 120px 0

TITLE: "업무분야"
├── Font: Nanum Myeongjo, section-title
└── Subtitle: "대만 투자부터 소송까지, 분야별 전문가가 함께합니다" (body-lg, --text-secondary)

GRID: 2 columns × 3 rows (desktop), 1 col (mobile)
GAP: 24px

EACH CARD (Card Pattern A):
├── Background: white
├── Border: 1px solid var(--border-light)
├── Padding: 32px
├── Number: section-label style, --accent-purple (e.g., "01")
├── Title: card-title, --text-primary
├── Description: body-sm, --text-body, margin-top: 12px
├── HOVER: purple left-border 4px, shadow-card-hover, translateY(-2px)
└── Click → /services/[slug]

CARD CONTENT:
01: 대만 내 투자 관련 업무
    회사 설립, 비자 신청, 상표·특허 신청, 법적 위험 분석, 계약 심사, 세무 상담

02: 대만 형사소송
    시먼딩 칼부림 한국 유학생 합의, 의료분쟁 300만 TWD, 사기 무혐의 다수

03: 대만 민사소송
    마이너스 유가 수백만 TWD, 교통사고 290만 TWD, 헬스장 157만 TWD 승소

04: 대만 가정사건
    이혼·재산분할, 상속, 친권, 상간자. 일본 배우자 600만 TWD 재산분할

05: 지적재산권
    특허, 상표, 저작권 소송 및 등록. 한국 기업 대만 브랜드 보호

06: 금융·보험 분쟁
    금융 소비, 보험 청구, 투자 손실. 선물·옵션 손해배상 전문
```

### Section 3: ATTORNEY PROFILE — 증준외 (auto, LIGHT — bg-off-white)

```
SECTION LABEL: ── 03 — ATTORNEY (--accent-purple)
PADDING: 120px 0

LAYOUT: split — Left 40% photo, Right 60% bio (세종 member page 스타일)

LEFT (photo):
├── 증준외 professional headshot
├── Aspect ratio: 3:4
├── Width: 100% of column
├── Filter: none (full color — 세종 스타일, 그레이스케일 아님)
├── Border: none
├── Below photo:
│   ├── Name: 증준외(曾雋崴) — Nanum Myeongjo, 1.5rem, 700
│   ├── English: TSENG, CHUN-WEI (WEI) — Cormorant Garamond, 0.875rem, italic
│   └── Title: 타이중사무소 변호사 — Pretendard 400, 0.875rem, --accent-purple

RIGHT (bio):
├── Intro paragraph:
│   "증준외(曾雋崴) 변호사는 대만 변호사로서 기업과 개인 고객을 위해
│   다양한 분야에서 전문적이고 신뢰할 수 있는 법률 서비스를 제공하고 있습니다."
│   ├── Font: body-lg, --text-body

├── Key detail paragraph:
│   "국립 타이완 대학교 재무금융연구소 석사, 국립 정치 대학교 법학과·금융학과 복수전공.
│   일본 고베 대학교, 와세다 대학교 교환 학생.
│   유창한 한국어·일본어 능력(TOPIK 6급, JLPT N1)을 바탕으로
│   한국 및 일본 고객을 위한 대만 내 투자 및 소송 업무 전문."

├── Highlight box (bg: var(--accent-purple-bg), border-left: 4px solid --accent-purple):
│   "대표 사례: 한국 유학생 대리, 대만 최대 상장 헬스장 상대
│   157만 대만달러(약 6600만원) 배상 판결. 주요 언론 조명.
│   SBS 모닝와이드 '사건 X-ray' 출연: 김수현 팬미팅 위약금,
│   구준엽·서희원 재산 문제 등 대만 법률 전문 의견 제공."

├── Education list (compact, icon + text):
│   🎓 국립 타이완 대학교 재무금융연구소 석사
│   🎓 국립 정치 대학교 법학과·금융학과 복수전공 학사
│   🎓 일본 고베 대학교, 와세다 대학교 교환 학생

├── Career list:
│   ⚖ 추세법률사무소
│   ⚖ 법무법인 호정
│   ⚖ 법률지원재단 타이중지부 지원 변호사

├── Language badges (inline pills):
│   한국어 TOPIK 6급 | 日本語 JLPT N1 | 中文 Native | English
│   ├── Style: bg: var(--accent-purple-bg), color: --accent-purple
│   ├── Padding: 6px 14px
│   └── Font: 0.8125rem, 500

└── CTA row:
    ├── "상담 예약" → primary button → /book-online
    ├── Email: wei@hoveringlaw.com.tw (text link)
    └── Phone: +82-10-2992-9304 (text link, click-to-call)
```

### Section 4: KEY ACHIEVEMENTS (auto, LIGHT — bg-white)

```
SECTION LABEL: ── 04 — RESULTS (--accent-purple)
PADDING: 100px 0

TITLE: "주요 실적" (section-title, centered)

LAYOUT: horizontal scroll carousel (desktop: 5 visible, mobile: 1.2 visible)

EACH ACHIEVEMENT CARD:
├── Width: 280px (fixed)
├── Background: white
├── Border: 1px solid var(--border-light)
├── Padding: 32px 24px
├── Number: stat-number, --accent-purple (e.g., "157만")
├── Currency: "TWD" — 0.875rem, --text-secondary
├── Title: card-title, --text-primary
├── Description: body-sm, --text-body
├── Bottom tag: category pill (e.g., "민사소송")
└── Hover: Card Pattern A

CAROUSEL DATA:
Card 1: "157만 TWD 승소"
  한국 유학생, 대만 상장 헬스장 상대 손해배상 승소
  TAG: 민사소송

Card 2: "SBS 모닝와이드 출연"
  '사건 X-ray' 대만 법률 전문가 출연
  TAG: 미디어

Card 3: "수백만 TWD"
  2020 마이너스 유가 사건, 투자자 수십 명 대리
  TAG: 금융분쟁

Card 4: "300만 TWD"
  대학 병원 상대 의료분쟁 배상
  TAG: 형사소송

Card 5: "600만 TWD"
  일본 배우자 재산분할 성사
  TAG: 가정사건

Card 6: "시먼딩 사건"
  칼부림 사건 한국 유학생 피해자 원만한 합의
  TAG: 형사소송

CAROUSEL CONTROLS:
├── Left/Right arrow buttons: 48×48, circle, border: 1px solid var(--border-light)
├── Hover: bg: var(--accent-purple), color: white
├── Scroll indicator: dots below (active = --accent-purple)
├── Swipe enabled: mobile
└── Auto-scroll: off (manual only)

EXTERNAL LINKS ROW (below carousel):
├── YouTube: 📺 @weilawyer → "채널 바로가기"
├── Naver Blog: 📝 wei_lawyer → "블로그 방문"
├── Personal: 🌐 wei-wei-lawyer.com → "개인 사이트"
├── Style: inline text links, --text-link, hover underline
└── target="_blank" rel="noopener noreferrer"
```

### Section 5: INSIGHTS / BLOG (auto, ★DARK★ — bg-dark)

```
SECTION LABEL: ── 05 — INSIGHTS (--accent-gold)
PADDING: 120px 0

TITLE: "호정칼럼" (section-title, --text-on-dark)
SUBTITLE: "대만 법률 최신 소식과 실무 가이드" (--text-on-dark-secondary)

LAYOUT: left (40%) title area + right (60%) card list

BLOG CARDS (stacked, Card Pattern B):

1. 대만 화장품 시장 진출: 법인 설립부터 PIF 등록까지
   Category: 대만 법인설립 | Date: 2024.03.15

2. 대만 헬스장 부상 소송 (157만 TWD 승소)
   Category: 소송사례 | Date: 2024.02.20

3. 구준엽·서희원 유산·친권 이슈 분석
   Category: 대만 법률정보 | Date: 2024.01.10

4. 대만 이혼 조정·소송 Q&A
   Category: 대만 법률정보 | Date: 2023.11.05

5. 대만 회사설립 기초편
   Category: 대만 법인설립 | Date: 2023.09.20

CARD LAYOUT:
├── Padding: 24px
├── Border-bottom: 1px solid var(--border-dark)
├── Category tag: 0.75rem, var(--accent-gold-dim), uppercase
├── Title: card-title, --text-on-dark
├── Title hover: --accent-gold
├── Date: 0.8125rem, --text-on-dark-muted, float right
├── Hover: border-left 4px solid --accent-gold
└── Click → /blog/[slug]

BOTTOM: "칼럼 전체 보기 →" ghost button (gold)
```

### Section 6: COMPANY FORMATION (auto, LIGHT — bg-cream)

```
SECTION LABEL: ── 06 — FORMATION (--accent-purple)
PADDING: 120px 0

TITLE: "대만 법인설립"
SUBTITLE: "한국 기업의 대만 진출, 법무법인 호정이 함께합니다"

LAYOUT: 2-column comparison → 7-step timeline → note

COMPARISON (side by side, Card Pattern A):

LEFT CARD — 자회사 (Subsidiary):
├── Icon: 🏢 or abstract building SVG
├── Title: "자회사 (子公司)" — card-title
├── Badge: "독립 법인격" (pill, --accent-purple-bg)
├── List:
│   ├── 대만 회사와 동등한 권리·의무
│   ├── 영업소득세 20%
│   ├── 배당금 21% (이중과세방지약정 적용 시 10%)
│   └── 상장 가능
└── Bottom note: "가장 일반적인 선택"

RIGHT CARD — 지사 (Branch):
├── Icon: 🔗 or abstract link SVG
├── Title: "지사 (分公司)" — card-title
├── Badge: "법인격 없음" (pill, --border-light bg)
├── List:
│   ├── 영업 자격만 부여
│   ├── 영업소득세 20%
│   ├── 이익 외국 본사 송금 가능
│   └── 한국 기업 100% 소유, 대만인 주주 불가
└── Bottom note: "빠른 진출 시 유리"

TIMELINE (below, 7 steps, horizontal):
├── Line: 2px solid var(--accent-purple), connecting all dots
├── Each step:
│   ├── Circle: 40×40, border: 2px solid --accent-purple
│   ├── Number inside: var(--font-mono), 0.875rem, --accent-purple
│   ├── Label below: 0.8125rem, --text-primary
│   └── Hover: fill circle --accent-purple, number white

Steps:
1. 회사 중문명 예약
2. 투자심의위원회 투자 신청
3. 자본금 송금 (외화 → TWD)
4. 법인 등록 (경제부 상업사)
5. 세무 등기 (국세국)
6. 은행 계좌 개설
7. 사업 개시

Mobile: vertical timeline, steps stacked

NOTE BOX:
├── Background: var(--accent-purple-bg)
├── Border-left: 4px solid var(--accent-purple)
├── Padding: 20px 24px
├── Icon: ℹ️ or info circle
├── Text: "2023년 12월 2일 발효 — 한국-대만 이중과세 방지 약정으로
│         배당금 원천세율 21% → 10%로 인하되었습니다."
└── Font: body-sm, --text-body

CTA: "법인설립 상담 →" primary button
```

### Section 7: OFFICES + MAP (auto, LIGHT — bg-white)

```
SECTION LABEL: ── 07 — OFFICES (--accent-purple)
PADDING: 120px 0

TITLE: "오시는길"
SUBTITLE: "타이중 · 까오슝 · 핑둥 — 대만 전역에서 만나실 수 있습니다"

LAYOUT: Tab bar above, content below (map left 60% + info right 40%)
(See 4.10 Office/Location Interactive Map for detailed specs)

TAB DATA:

Tab 1: 타이중 사무소 (DEFAULT ACTIVE)
├── Address: 6F.-1, No. 19, Guanqian Rd., North Dist., Taichung City 40453
├── Korean: 타이중시 북구 관첸로 19호 6층의1
├── Tel: 04-23261862
├── Fax: 04-23261863
├── Map center: 24.1477, 120.6736
└── Marker: purple pin

Tab 2: 까오슝 사무소
├── Address: No. 233, Anji St., Zuoying Dist., Kaohsiung City 81358
├── Korean: 까오슝시 쭤잉구 안지로 233호
├── Tel: 07-5579797
├── Fax: 07-5577171
├── Map center: 22.6727, 120.2935
└── Marker: purple pin

Tab 3: 핑둥 사무소
├── Address: No. 46, Sec. 3, Jiuru Rd., Jiuru Township, Pingtung County 90443
├── Korean: 핑둥현 주루향 주루로 3단 46호
├── Tel: 08-7391689
├── Fax: 08-7397362
├── Map center: 22.7277, 120.4891
└── Marker: purple pin

MAP STYLE: Default (light theme — 세종 스타일, 다크맵 아님)
```

### Section 8: FOOTER + CONTACT (auto, ★DARK★ — bg-dark)

```
PADDING: 80px 0 40px

LAYOUT: 4-column grid (desktop), stacked (mobile)

COLUMN 1 — Brand:
├── 법무법인 호정 (Nanum Myeongjo, 1.25rem, --text-on-dark)
├── 昊鼎國際法律事務所 (Noto Serif TC, 0.875rem, --text-on-dark-secondary)
├── Hovering Law International (Cormorant Garamond, 0.8125rem, italic, --text-on-dark-muted)
└── Margin-bottom: 16px

COLUMN 2 — Quick Links:
├── Label: "바로가기" (section-label, --accent-gold)
├── Links: 업무분야, 구성원소개, 호정칼럼, 법인설립, 오시는길
├── Font: 0.875rem, --text-on-dark-secondary
├── Hover: --accent-gold
└── Line-height: 2.0

COLUMN 3 — Contact:
├── Label: "연락처" (section-label, --accent-gold)
├── 한국: +82-10-2992-9304 (click-to-call)
├── 대만: +886-4-2326-1862 (click-to-call)
├── Email: wei@hoveringlaw.com.tw (mailto)
├── Font: 0.875rem, --text-on-dark-secondary
└── Icons: 📞 🏢 ✉️ (small, inline)

COLUMN 4 — External:
├── Label: "외부채널" (section-label, --accent-gold)
├── YouTube: @weilawyer → 📺 icon link
├── Naver Blog: wei_lawyer → 📝 icon link
├── Personal: wei-wei-lawyer.com → 🌐 icon link
├── All: target="_blank" rel="noopener noreferrer"
└── Font: 0.875rem

BOTTOM BAR (border-top: 1px solid var(--border-dark), padding-top: 24px):
├── Left: © 2025 법무법인 호정. All Rights Reserved.
├── Right: KO | 繁中 | EN (language pills, small)
└── Font: 0.75rem, --text-on-dark-muted
```

---

## 7. INTERIOR PAGES

### 7.1 Service Detail (/services/[slug])

```
HERO: 30vh, LIGHT (bg-cream), breadcrumb + title + description
CONTENT: 2-column (8+4 grid)
├── Left (8): prose content, case examples
├── Right (4): sidebar — 관련 업무분야 links, CTA card
BOTTOM: related services (3-col cards)
```

### 7.2 Blog Post (/blog/[slug])

```
HERO: 20vh, LIGHT (bg-cream), breadcrumb + category + title + date + author
CONTENT: single column, max-width 720px, centered prose
BOTTOM: related posts (3-col cards), CTA banner
```

### 7.3 Attorney Profile (/about/[slug])

```
HERO: 50vh, split (photo 40% left, bio 60% right), LIGHT bg
SPECIALTIES: LIGHT (bg-white), tag cloud + description
CASES: LIGHT (bg-cream), achievement cards
EDUCATION + CAREER: LIGHT (bg-white), timeline
```

### 7.4 Company Formation (/formation)

```
Full dedicated page expanding Section 6 content
HERO: 30vh, LIGHT, title + subtitle
COMPARISON TABLE: detailed 자회사 vs 지사
PROCESS TIMELINE: expanded 7 steps with detail text
TAX OVERVIEW: 이중과세방지약정 설명
FAQ: accordion style (purple border on active)
CTA: "법인설립 상담 예약" banner
```

### 7.5 Booking (/book-online)

```
LAYOUT: 2-column form (left 60%) + info card (right 40%)

FORM FIELDS (see 4.14 Form Elements for styling):
├── 이름 (text input)
├── 이메일 (email input)
├── 전화번호 (tel input, with country code selector)
├── 상담 분야 (select dropdown: 투자/소송/법인설립/가정/기타)
├── 선호 언어 (select: 한국어/日本語/English/中文)
├── 상담 희망 일시 (date picker + time picker)
├── 상세 내용 (textarea)
└── Submit: "예약하기" primary button

INFO CARD (right):
├── 증준외 변호사 mini profile
├── Phone, Email
├── Available hours
└── Office address
```

---

## 8. NAVIGATION & MOBILE MENU (SHIN & KIM STYLE)

### Desktop Navigation (see 4.1, 4.2 for detailed specs)

```
STRUCTURE:
┌──────────────────────────────────────────────────────────────┐
│                    ┌─ Utility bar (optional) ─┐              │
│                    │ KO | 繁中 | EN    [🔍]  │              │
│                    └────────────────────────────┘              │
│ ┌────────────────────────────────────────────────────────┐    │
│ │ 법무법인 호정    업무분야  구성원소개  호정칼럼  법인설립  오시는길 │ [상담 예약] │
│ └────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘

Logo: Nanum Myeongjo, 1.25rem, --text-primary (on scroll) / --text-on-dark (on hero)
Menu: Pretendard 500, 0.9375rem
CTA Button: bg: var(--accent-purple), white text, 0.875rem
```

### Mobile Navigation

```
TRIGGER: hamburger icon (24×24, 3 lines, --text-primary)

OVERLAY:
├── Full-screen, bg: white (세종 스타일 — 다크 오버레이 아님!)
├── Animation: slideInFromRight, 0.3s ease
├── Close: ✕ button, top-right, 24×24
├── Logo: top-left
├── Menu items: stacked vertically
│   ├── Font: Nanum Myeongjo, 1.5rem, --text-primary
│   ├── Padding: 20px 24px each
│   ├── Border-bottom: 1px solid var(--divider)
│   ├── Active: --accent-purple
│   └── Stagger animation: each item fadeInUp, delay += 0.05s
├── Language switcher: bottom of menu, centered
│   ├── KO | 繁中 | EN
│   └── Active: --accent-purple, underline
├── CTA: "상담 예약" full-width button at bottom
│   ├── bg: var(--accent-purple)
│   └── Margin: 24px
└── Background overlay (behind): rgba(0,0,0,0.3), click to close
```

---

## 9. ANIMATIONS & TRANSITIONS

```css
/* Scroll reveal — 요소가 뷰포트에 들어올 때 */
.reveal-up {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal-up.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger — 그리드 카드들에 순차 딜레이 */
.stagger-item:nth-child(1) { transition-delay: 0s; }
.stagger-item:nth-child(2) { transition-delay: 0.1s; }
.stagger-item:nth-child(3) { transition-delay: 0.2s; }
.stagger-item:nth-child(4) { transition-delay: 0.3s; }
.stagger-item:nth-child(5) { transition-delay: 0.4s; }
.stagger-item:nth-child(6) { transition-delay: 0.5s; }

/* Hero video crossfade */
.video-crossfade {
  transition: opacity 1s ease-in-out;
}

/* CountUp numbers — 통계 카운터 */
/* Use IntersectionObserver + requestAnimationFrame */

/* Scroll indicator bounce */
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 10. RESPONSIVE RULES

```
BREAKPOINTS:
├── Mobile: < 768px
├── Tablet: 768px ~ 1024px
├── Desktop: > 1024px

MOBILE (< 768px):
├── NO snap scroll — normal smooth scroll
├── NO dot navigation
├── Hero: 100vh, stacked text, smaller sizes
├── Practice areas: single column, swipeable horizontal
├── Attorney: stacked — photo full-width, bio below
├── Stats: 2×2 grid
├── Achievements: horizontal scroll (1.2 cards visible)
├── Blog: stacked cards
├── Formation: stacked (comparison cards → vertical timeline)
├── Offices: stacked tabs → accordion
├── Footer: single column, stacked
├── Nav: hamburger → full-screen overlay (white)
├── Padding: 60px 20px per section
└── Font sizes: use clamp() minimums

TABLET (768px ~ 1024px):
├── Practice areas: 2×3 grid (smaller cards)
├── Attorney: side-by-side (35/65 split)
├── Blog: 2 columns
├── Padding: 80px 40px per section
└── Dot navigation: hidden

DESKTOP (> 1024px):
├── Full layouts as specified
├── Dot navigation: visible
├── Max-width container: 1200px, centered
├── Padding: 120px 0 per section
└── Smooth scroll with scroll-behavior: smooth
```

---

## 11. VIDEO ACQUISITION STRATEGY

```bash
# Pexels.com free stock videos:
# 1. "taipei city skyline night" or "taiwan city aerial"
# 2. "business meeting professional"
# 3. "legal books library"

# Compress with ffmpeg:
ffmpeg -i input.mp4 -vcodec h264 -acodec none -b:v 2M \
  -filter:v "eq=brightness=-0.1:saturation=0.7,scale=1920:-2" \
  -movflags +faststart -t 15 output.mp4

# Target: < 5MB each, 10-15 sec loop, no audio, H.264

# WebM alternative for smaller size:
ffmpeg -i input.mp4 -c:v libvpx-vp9 -b:v 1.5M -an \
  -filter:v "scale=1920:-2" -t 15 output.webm

# Fallback: Ken Burns zoom on team-photo-new.jpg
# CSS animation: scale(1) → scale(1.1) over 20s, alternate
```

---

## 12. FONT INSTALLATION GUIDE

```bash
# Pretendard (Korean body — must be installed first)
# CDN: https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css

# Google Fonts (add to <head>)
# Nanum Myeongjo: 400, 700, 800
# Cormorant Garamond: 400, 600, 700 (+ italic 400)
# Noto Serif TC: 400, 600, 700
# Noto Sans TC: 400, 500, 700

# Preconnect for performance:
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

# Font-display: swap for all (prevent FOIT)
```

---

## 13. QUALITY CHECKLIST V3.1

### Design (세종 퍼플 스타일)
- [ ] 전체 톤: 75% light / 25% dark sections
- [ ] Primary accent: Purple (#5B3A8C) — NOT navy, NOT blue
- [ ] Gold accent: ONLY on dark sections (hero, blog, footer)
- [ ] No pure white bg — use #FFFFFF for cards, #F8F7F5 for section alternate
- [ ] Border-radius: 0~2px maximum (세종은 square corners)
- [ ] No rounded corners > 2px anywhere
- [ ] No bright colors, playful elements, emoji in UI (content은 OK)
- [ ] Shadows: purple-tinted (rgba 91,58,140)
- [ ] Card hover: purple left-border 4px on light sections
- [ ] Card hover: gold left-border 4px on dark sections

### Typography
- [ ] Nanum Myeongjo loads for all KO headings
- [ ] Noto Serif TC loads for all ZH headings
- [ ] Cormorant Garamond loads for EN headings
- [ ] Pretendard loads for all body text
- [ ] Section labels: monospace, uppercase, letter-spacing: 0.15em

### Navigation (세종 스타일)
- [ ] White background nav (NOT dark/transparent on scroll)
- [ ] Purple hover underline on menu items (left→right animation)
- [ ] Active page indicator: purple text + bottom border
- [ ] Search icon → overlay with input field
- [ ] Language switcher: KO | 繁中 | EN (pill style)
- [ ] Mobile: white full-screen overlay (NOT dark overlay)
- [ ] Mega dropdown: border-top 3px purple

### Homepage Sections
- [ ] Video hero: 3 rotating videos, 8s interval, crossfade
- [ ] Fallback: Ken Burns on team photo
- [ ] Philosophy: centered, stats with countUp animation
- [ ] Practice: 2×3 grid, purple left-border hover
- [ ] Attorney: split layout (photo left 40%, bio right 60%)
- [ ] Achievements: horizontal scroll carousel
- [ ] Blog: dark section, gold accents, stacked cards
- [ ] Formation: comparison cards + 7-step timeline
- [ ] Offices: tabbed map (LIGHT theme map, not dark)
- [ ] Footer: 4-column, dark, gold accents

### Micro-Features (세종 세부 요소)
- [ ] Breadcrumbs on all interior pages
- [ ] Side dot navigation (homepage desktop only)
- [ ] Scroll-to-top button (purple, 500px trigger)
- [ ] Section number labels (── 01 — EXPERTISE)
- [ ] Member filter/search on attorney page
- [ ] Category tabs on blog page
- [ ] Cookie consent banner
- [ ] Loading skeleton states
- [ ] Form focus: purple border + purple glow shadow

### Content Accuracy
- [ ] 증준외 data matches hoveringlaw.com.tw/kr/wei.html
- [ ] All case results accurate (157만, 300만, 수백만, 290만, 600만, 30만 TWD)
- [ ] SBS 모닝와이드 출연 mentioned
- [ ] YouTube @weilawyer, Naver Blog wei_lawyer links correct
- [ ] Company formation info matches wei-wei-lawyer.com
- [ ] Blog posts from wei-wei-lawyer.com/blog
- [ ] All 3 office addresses, phone, fax correct
- [ ] Email: wei@hoveringlaw.com.tw
- [ ] Korean phone: +82-10-2992-9304
- [ ] Firm name in 3 languages correct

### Technical
- [ ] Next.js `<Image>` with proper priority/sizes
- [ ] Fonts preloaded via `<link rel="preconnect">`
- [ ] Videos compressed < 5MB with ffmpeg
- [ ] Google Maps light styling (NOT dark theme)
- [ ] Mobile-first responsive
- [ ] Lighthouse performance > 90
- [ ] External links: target="_blank" rel="noopener noreferrer"
- [ ] SEO: Korean + Chinese meta tags
- [ ] Structured data (JSON-LD) for LegalService, Attorney, Organization
- [ ] ARIA roles, alt texts, focus indicators
- [ ] prefers-reduced-motion respected

---

## TEAM MEMBERS COMPLETE DATA

```
증준외 (曾雋崴) — TSENG, CHUN-WEI (WEI)
  Role: 타이중사무소 변호사
  Email: wei@hoveringlaw.com.tw
  Phone: +82-10-2992-9304 (Korea) / +886-4-2326-1862 (Taiwan)
  Education: 타이완대 석사, 정치대 법학·금융 복수전공, 고베대·와세다대 교환
  Languages: 한국어 (TOPIK 6급), 日本語 (JLPT N1), 中文 (Native), English
  Specialties: 대만 투자, 금융소비, 부동산, 지적재산권, 형사·민사·가사·노사
  External: YouTube @weilawyer, Naver wei_lawyer, wei-wei-lawyer.com

장용선 — Taiwan Lawyer (타이중사무소)
손정민 — Korean Manager (한국 사무장)
황승평 — Taiwan Accountant (대만 회계사)
```

Other attorneys in 법무법인 호정:
원유륜, 서가준 (타이중) / 유가굉, 임가백, 증완정, 임규우, 장청개, 왕정상 (까오슝) / 사완균 (핑둥)

---

## CHANGE LOG: V3 → V3.1

| Item | V3 (Wrong) | V3.1 (Corrected) |
|------|-----------|------------------|
| Primary accent | Navy #1B2A4A | **Purple #5B3A8C** |
| Dark/Light ratio | 60/40 dark dominant | **25/75 light dominant** |
| Nav background | Dark transparent → white | **White always** (shrink on scroll) |
| Mobile menu | Dark full-screen overlay | **White full-screen overlay** |
| Google Map theme | Dark styled map | **Default light map** |
| Card corners | Mix of rounded | **0~2px only (square)** |
| Snap scroll | Enabled on desktop | **Smooth scroll only** (no snap) |
| Shadows | Neutral gray | **Purple-tinted rgba** |
| Section count dark | 5+ dark sections | **3 dark sections** (hero, blog, footer) |
| Button style | Navy bg | **Purple bg** |
| Mega dropdown | Not specified | **Detailed spec added** |
| Search overlay | Not specified | **Full spec added** |
| Member filter | Not specified | **Full spec added** |
| Breadcrumbs | Not specified | **Added** |
| Scroll-to-top | Not specified | **Added** |
| Cookie consent | Not specified | **Added** |
| Loading states | Not specified | **Added** |
| Form elements | Not specified | **Full spec added** |
| Accessibility | Minimal | **WCAG AA spec added** |

---

**END OF V3.1 SPEC — Ready for frontend build agent.**
**No placeholder text — all content verified from source.**
**All UI micro-features documented with implementation specs.**
