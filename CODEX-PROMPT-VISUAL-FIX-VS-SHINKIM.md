# CODEX PROMPT — Make It Look Like Shin & Kim (세종), Not a Wix Template

You are rebuilding "법무법인 호정" (Hovering Law International) website. I'm showing you exactly what's wrong by comparing our current site to Shin & Kim (shinkim.com). Fix every issue below.

---

## PROBLEM ANALYSIS: Why Our Site Looks Amateur

Looking at the two sites side-by-side:

| Element | Our Site (BAD) ❌ | Shin & Kim (GOOD) ✅ |
|---------|-------------------|----------------------|
| **Hero** | Dark purple bg, feels like a blog | Full-bleed professional PHOTO, cinematic overlay |
| **Typography** | Generic sans-serif, feels like Google Slides | Elegant serif headline, refined sans body |
| **Spacing** | Everything cramped together | Massive breathing room, luxurious whitespace |
| **Nav** | Too many items, cluttered, purple bg | Clean white bar, minimal items, generous gaps |
| **Search** | Basic input with purple "검색" button | Sophisticated full-width bar with subtle icon |
| **Content cards** | Small, cramped, tag-like buttons | Large editorial layouts with photos, like a magazine |
| **Tags/Keywords** | Exposed as pill buttons (looks like a blog) | Hidden — content is curated, not tagged |
| **Overall feel** | Wix template, $50 site | Premium law firm, $50,000 site |

---

## FIX 1: HERO SECTION — The Most Critical Difference

**Current problem:** Dark purple background with text. Looks like a PowerPoint slide.

**What Shin & Kim does:** Full-screen professional photograph (colorful law books on shelf) with a subtle dark gradient overlay and elegant white text on top. The photo creates instant credibility.

### Implementation:

```html
<section class="hero" id="hero">
  <!-- Background: full-screen video OR high-quality photo -->
  <div class="hero-media">
    <video autoplay muted loop playsinline poster="/images/hero-poster.jpg">
      <source src="/videos/hero-1.mp4" type="video/mp4">
    </video>
    <!-- Fallback: use a professional stock photo of:
         - Law books on wooden shelves (like Shin & Kim)
         - Modern office building with glass facade
         - Taipei 101 skyline at dusk
         Use Unsplash: search "law library" or "legal books shelf" -->
  </div>
  
  <!-- Gradient overlay — NOT solid purple, but a cinematic dark gradient -->
  <div class="hero-overlay"></div>
  
  <!-- Content positioned on top -->
  <div class="hero-content">
    <p class="hero-label">TAIWAN LEGAL</p>
    <h1 class="hero-title">대만 법률을<br>한국어로 명확하게.</h1>
    <p class="hero-subtitle">한국어, 일본어 소통에 능통한 전문가들이<br>복잡한 대만 법률 문제를 명확하게 안내해드립니다.</p>
    
    <!-- Search bar — Shin & Kim style -->
    <div class="hero-search">
      <input type="text" placeholder="어떻게 도와드릴까요?" />
      <button class="search-icon" aria-label="검색">
        <svg><!-- magnifying glass icon --></svg>
      </button>
    </div>
  </div>
  
  <!-- Scroll indicator at bottom -->
  <div class="hero-scroll-indicator">
    <span></span>
  </div>
</section>
```

```css
.hero {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-media {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.hero-media video,
.hero-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* CRITICAL: The overlay is what makes it look cinematic, NOT a solid color */
.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  /* Shin & Kim style: dark gradient from left, lighter on right */
  background: linear-gradient(
    135deg,
    rgba(10, 10, 20, 0.75) 0%,
    rgba(10, 10, 20, 0.55) 40%,
    rgba(10, 10, 20, 0.3) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 700px;
  padding: 0 clamp(2rem, 6vw, 6rem);
  /* Push content to left side, like Shin & Kim */
}

.hero-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.hero-label::before {
  content: '';
  width: 32px;
  height: 1px;
  background: rgba(255, 255, 255, 0.4);
}

/* THE KEY: Shin & Kim uses a beautiful serif font for the main headline */
.hero-title {
  font-family: 'Nanum Myeongjo', 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2.5rem, 5.5vw, 4.5rem);
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin-bottom: 1.5rem;
  word-break: keep-all;
}

.hero-subtitle {
  font-family: var(--font-body);
  font-size: clamp(0.9375rem, 1.2vw, 1.0625rem);
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
  margin-bottom: 2.5rem;
  word-break: keep-all;
  max-width: 480px;
}

/* Search bar — Shin & Kim has an elegant full-width search with subtle border */
.hero-search {
  display: flex;
  align-items: center;
  max-width: 520px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 0;
  transition: all 0.3s;
}
.hero-search:focus-within {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.3);
}
.hero-search input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font-body);
  font-size: 1rem;
  color: #FFFFFF;
  padding: 1rem 1.25rem;
}
.hero-search input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}
.hero-search .search-icon {
  background: none;
  border: none;
  padding: 1rem 1.25rem;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.5);
  transition: color 0.2s;
}
.hero-search .search-icon:hover {
  color: #FFFFFF;
}

/* Scroll indicator — bouncing chevron at bottom center */
.hero-scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}
.hero-scroll-indicator span {
  display: block;
  width: 24px;
  height: 24px;
  border-right: 1.5px solid rgba(255, 255, 255, 0.4);
  border-bottom: 1.5px solid rgba(255, 255, 255, 0.4);
  transform: rotate(45deg);
  animation: scrollBounce 2s infinite;
}
@keyframes scrollBounce {
  0%, 100% { transform: rotate(45deg) translateY(0); opacity: 0.4; }
  50% { transform: rotate(45deg) translateY(6px); opacity: 0.8; }
}
```

**CRITICAL PHOTO GUIDANCE:**
If you don't have professional photos yet, use these free Unsplash images as placeholders:
- Law library: https://unsplash.com/photos/colorful-law-books (search "law books shelf colorful")
- Office building: search "modern office taipei"
- Skyline: search "taipei 101 night"

The photo quality is 80% of what makes it look premium. A solid color background will NEVER look professional.

---

## FIX 2: NAVIGATION — Clean and Spacious Like Shin & Kim

**Current problem:** Too many nav items crammed together, purple background, "검색 KO 中文 EN" all squeezed in.

**What Shin & Kim does:**
- White/transparent background
- Only 5-6 main nav items with GENEROUS spacing (40-50px between items)
- Utility items (language, search) separated to the far right
- Logo is clean text, not a graphic logo
- Thin border-bottom appears only on scroll

```css
.nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 0; /* Initially invisible over hero */
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(2rem, 4vw, 4rem);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* On hero: transparent, white text */
.nav--transparent {
  background: transparent;
  height: 80px;
}
.nav--transparent .nav-link { color: rgba(255, 255, 255, 0.85); }
.nav--transparent .nav-logo { color: #FFFFFF; }

/* After scroll: white bg, dark text — like Shin & Kim */
.nav--solid {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  height: 64px;
  border-bottom: 1px solid #E8E8EE;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
}
.nav--solid .nav-link { color: #4A4A5A; }
.nav--solid .nav-logo { color: #1A1A2E; }

/* Logo — text-based like Shin & Kim */
.nav-logo {
  font-family: 'Nanum Myeongjo', serif;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-decoration: none;
  white-space: nowrap;
}

/* Nav links — KEY: generous spacing */
.nav-links {
  display: flex;
  align-items: center;
  gap: 2.5rem;  /* THIS IS THE SECRET — 40px between items, not 16px */
}

.nav-link {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  text-decoration: none;
  padding: 0.25rem 0;
  position: relative;
  transition: color 0.2s;
  white-space: nowrap;
}

/* Hover: text goes darker, NOT purple */
.nav-link:hover { color: #1A1A2E; }

/* Active: thin bottom line in purple */
.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #5B3A8C;
}

/* Utility area: search icon + language + CTA button */
.nav-utils {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* Language: simple text toggle, not a box */
.lang-toggle {
  font-size: 0.8125rem;
  font-weight: 500;
  color: inherit;
  opacity: 0.6;
  cursor: pointer;
  background: none;
  border: none;
  transition: opacity 0.2s;
}
.lang-toggle:hover { opacity: 1; }
.lang-toggle.active { opacity: 1; font-weight: 600; }

/* CTA button in nav */
.nav-cta {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.5rem 1.25rem;
  background: #5B3A8C;
  color: #FFFFFF;
  border: none;
  border-radius: 0;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: background 0.2s;
}
.nav-cta:hover { background: #3D2266; }
```

**NAV ITEMS (maximum 7):**
```
법인소개  |  업무분야  |  변호사  |  칼럼  |  영상  |  FAQ  |  연락처
```
Then on the right side:
```
KO  中文  EN  |  🔍  |  [상담 문의]
```

**CRITICAL RULE: The gap between nav items must be at least 2.5rem (40px). This single change makes the biggest visual difference.**

---

## FIX 3: REMOVE ALL "BLOG-LIKE" ELEMENTS

**Current problem:** Our site has pill-shaped tag buttons ("대만 투자", "회사 설립", "비자 신청", etc.) and category buttons ("업무분야", "변호사", "칼럼", "영상", "FAQ"). These look like a WordPress blog, not a law firm.

**What Shin & Kim does:** No visible tags. Content is organized into clean editorial sections with large photos, headlines, and brief descriptions. Like a magazine, not a blog.

### Remove these elements entirely:
- ❌ "추천 키워드" section with pill buttons
- ❌ "추천 분류" section with category pills
- ❌ "업무분야 보기 / 문의하기" text links at bottom
- ❌ Any element that looks like tag clouds, pill buttons, or WordPress categories

### Replace with:
Professional content sections like Shin & Kim's news/achievements carousel:

```html
<section class="news-section">
  <div class="container">
    <div class="section-header">
      <span class="section-label">── 05 — INSIGHTS</span>
      <h2 class="section-title">호정칼럼</h2>
    </div>
    
    <!-- Large featured article card, like a magazine -->
    <div class="news-grid">
      <article class="news-featured">
        <div class="news-image">
          <img src="/images/article-gym.jpg" alt="헬스장 부상 소송" loading="lazy">
          <span class="news-category">소송사례</span>
        </div>
        <div class="news-body">
          <time class="news-date">2025.09.13</time>
          <h3 class="news-title">대만 헬스장 부상 소송 — 157만 TWD 승소</h3>
          <p class="news-excerpt">한국 대학생이 대만 최대 상장 헬스장에서 트레이너 지도 중 부상을 당한 사건...</p>
          <a class="news-link" href="#">자세히 보기 →</a>
        </div>
      </article>
      
      <!-- Smaller article list -->
      <div class="news-list">
        <article class="news-item">
          <time>2025.02.04</time>
          <h4>대만 화장품 시장 진출: 법인 설립부터 PIF 등록까지</h4>
          <span class="news-cat-tag">법인설립</span>
        </article>
        <!-- more items... -->
      </div>
    </div>
  </div>
</section>
```

```css
.news-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 3rem;
  align-items: start;
}

.news-featured {
  border: 1px solid var(--border-light);
}
.news-featured .news-image {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 10;
}
.news-featured .news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}
.news-featured:hover .news-image img {
  transform: scale(1.03);
}
.news-category {
  position: absolute;
  top: 1rem;
  left: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #FFFFFF;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  padding: 0.25rem 0.75rem;
}
.news-body {
  padding: 1.5rem;
}
.news-date {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-caption);
}
.news-title {
  font-family: var(--font-heading-ko);
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0.5rem 0 0.75rem;
  line-height: 1.4;
}
.news-excerpt {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 1rem;
}
.news-link {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-heading);
  text-decoration: none;
  transition: color 0.2s, gap 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}
.news-link:hover { color: #5B3A8C; gap: 0.625rem; }

/* Small news items list */
.news-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.news-item {
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--border-light);
  cursor: pointer;
  transition: padding-left 0.2s;
}
.news-item:hover {
  padding-left: 0.5rem;
}
.news-item:first-child {
  padding-top: 0;
}
.news-item time {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-caption);
}
.news-item h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0.375rem 0 0.25rem;
  line-height: 1.5;
  color: var(--text-heading);
}
.news-item .news-cat-tag {
  font-size: 0.75rem;
  color: #5B3A8C;
  font-weight: 500;
}
```

---

## FIX 4: SECTION DOT NAVIGATION (Shin & Kim's Right Side)

Shin & Kim has a vertical dot navigation on the right side that shows which section you're viewing. This is a premium UX pattern.

```html
<nav class="section-dots" aria-label="섹션 탐색">
  <ul>
    <li><a href="#hero" class="dot active" data-section="hero"><span>메인</span></a></li>
    <li><a href="#about" class="dot" data-section="about"><span>소개</span></a></li>
    <li><a href="#practice" class="dot" data-section="practice"><span>업무분야</span></a></li>
    <li><a href="#attorney" class="dot" data-section="attorney"><span>변호사</span></a></li>
    <li><a href="#results" class="dot" data-section="results"><span>실적</span></a></li>
    <li><a href="#insights" class="dot" data-section="insights"><span>칼럼</span></a></li>
    <li><a href="#contact" class="dot" data-section="contact"><span>연락처</span></a></li>
  </ul>
</nav>
```

```css
.section-dots {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 90;
}
.section-dots ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 0;
  margin: 0;
}
.dot {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  text-decoration: none;
}
.dot::after {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(150, 150, 150, 0.3);
  border: 1.5px solid rgba(150, 150, 150, 0.5);
  transition: all 0.3s;
  flex-shrink: 0;
}
.dot.active::after {
  background: #5B3A8C;
  border-color: #5B3A8C;
  transform: scale(1.3);
}
.dot span {
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: transparent;
  transition: color 0.2s;
  white-space: nowrap;
}
.dot:hover span { color: var(--text-secondary); }
.dot.active span { color: var(--text-heading); }

/* On dark sections, dots should be white */
.section-dots.on-dark .dot::after {
  border-color: rgba(255, 255, 255, 0.4);
}
.section-dots.on-dark .dot.active::after {
  background: #C4A265;
  border-color: #C4A265;
}
.section-dots.on-dark .dot:hover span { color: rgba(255, 255, 255, 0.6); }

/* Hide on mobile */
@media (max-width: 1024px) {
  .section-dots { display: none; }
}
```

```javascript
// Section dot navigation — update active dot based on scroll position
const sections = document.querySelectorAll('section[id]');
const dots = document.querySelectorAll('.section-dots .dot');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      dots.forEach(dot => dot.classList.remove('active'));
      const activeDot = document.querySelector(`.dot[data-section="${entry.target.id}"]`);
      if (activeDot) activeDot.classList.add('active');
      
      // Switch dot colors based on section background
      const sectionDots = document.querySelector('.section-dots');
      const isDark = entry.target.classList.contains('section--dark');
      sectionDots.classList.toggle('on-dark', isDark);
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => observer.observe(section));
```

---

## FIX 5: NEWS/ACHIEVEMENTS CAROUSEL (Like Shin & Kim's Bottom Section)

Shin & Kim has a horizontal carousel at the bottom of their hero showing news/awards (like "Chambers Asia-Pacific Guide 2026"). Our site should have something similar.

```html
<section class="achievements-carousel">
  <div class="container">
    <div class="carousel-wrapper">
      <button class="carousel-arrow carousel-prev" aria-label="이전">
        <svg width="20" height="20"><polyline points="14,4 6,10 14,16" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
      </button>
      
      <div class="carousel-track">
        <article class="achievement-card">
          <div class="achievement-image">
            <img src="/images/sbs-news.jpg" alt="SBS 모닝와이드">
          </div>
          <div class="achievement-body">
            <h3 class="achievement-title">SBS 모닝와이드 '대만 법률 전문가' 출연</h3>
            <p class="achievement-desc">대만에 거주하는 한국인들의 법률 문제에 대해 전문가로 초청되어 방송에 출연하였습니다.</p>
          </div>
        </article>
        
        <article class="achievement-card">
          <div class="achievement-image">
            <img src="/images/gym-case.jpg" alt="헬스장 소송">
          </div>
          <div class="achievement-body">
            <h3 class="achievement-title">한국 학생 헬스장 부상 사건 157만 TWD 승소</h3>
            <p class="achievement-desc">대만 최대 상장 헬스장을 상대로 손해배상을 청구하여 대만 법률계에 큰 반향을 일으켰습니다.</p>
          </div>
        </article>
        
        <!-- More cards -->
      </div>
      
      <button class="carousel-arrow carousel-next" aria-label="다음">
        <svg width="20" height="20"><polyline points="6,4 14,10 6,16" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
      </button>
    </div>
  </div>
</section>
```

```css
.achievements-carousel {
  background: var(--white);
  padding: 0;
  border-top: 1px solid var(--border-light);
}

.carousel-wrapper {
  display: flex;
  align-items: stretch;
}

.carousel-arrow {
  flex-shrink: 0;
  width: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-right: 1px solid var(--border-light);
  cursor: pointer;
  color: var(--text-secondary);
  transition: color 0.2s, background 0.2s;
}
.carousel-arrow:last-child {
  border-right: none;
  border-left: 1px solid var(--border-light);
}
.carousel-arrow:hover {
  background: var(--gray-50);
  color: var(--text-heading);
}

.carousel-track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.carousel-track::-webkit-scrollbar { display: none; }

.achievement-card {
  flex: 0 0 50%;
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  border-right: 1px solid var(--border-light);
  scroll-snap-align: start;
}

.achievement-image {
  flex-shrink: 0;
  width: 180px;
  height: 130px;
  overflow: hidden;
}
.achievement-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.achievement-title {
  font-family: var(--font-heading-ko);
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}
.achievement-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.65;
}
```

---

## FIX 6: WHITESPACE — THE BIGGEST SINGLE IMPROVEMENT

Shin & Kim's #1 design principle: **Massive whitespace between everything.**

```css
/* Section vertical padding — DOUBLE what you think is enough */
.section {
  padding: clamp(5rem, 10vw, 8rem) 0;
}

/* Between section label and title */
.section-label { margin-bottom: 1rem; }

/* Between title and content */
.section-header { margin-bottom: clamp(3rem, 5vw, 5rem); }

/* Between cards in a grid */
.card-grid {
  gap: clamp(1.5rem, 2.5vw, 2rem);
}

/* Paragraph spacing */
p + p { margin-top: 1.25rem; }

/* Between list items */
li + li { margin-top: 0.75rem; }

/* Hero content spacing */
.hero-content > * + * { margin-top: 1.5rem; }
```

**THE RULE:** When you think you have enough space, add 50% more. Professional sites always have MORE whitespace than you expect.

---

## FIX 7: IMAGE QUALITY

Every image on the site must be:
- At least 1200px wide for hero/section backgrounds
- At least 600px wide for article thumbnails
- Properly compressed (WebP format preferred, <200KB per image)
- Professionally shot or high-quality stock

**Placeholder image sources (free, commercial-use):**
- Unsplash: https://unsplash.com (search: "law firm", "legal books", "office taiwan", "conference room")
- Pexels: https://www.pexels.com (search same terms)

**For attorney photo:** Use the existing photos but apply consistent treatment:
- Desaturate slightly (saturation: 0.9)
- Add subtle warm tone
- Consistent background (neutral gray or office)
- Consistent crop (square or 3:4 portrait)

---

## SUMMARY: THE 7 CHANGES THAT MATTER MOST

In order of impact:

1. **HERO: Replace solid purple bg with full-screen professional photo + cinematic overlay** (50% of the improvement)
2. **NAV: Increase spacing between items to 40px, use white/transparent bg** (15%)
3. **WHITESPACE: Double all vertical padding between sections** (10%)
4. **REMOVE: All tag pills, category buttons, blog-like elements** (8%)
5. **TYPOGRAPHY: Enforce Nanum Myeongjo serif for all Korean headings** (7%)
6. **ADD: Section dot navigation on right side** (5%)
7. **ADD: News/achievement carousel with real photos** (5%)

Do these 7 things and the site will go from "Wix template" to "premium law firm" instantly.
