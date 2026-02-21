# CODEX PROMPT — Fix Monotonous Layout: Add Asymmetric Image-Text Compositions

## THE PROBLEM

Currently, every content section on the site uses the same boring pattern:
- Same-sized cards in a uniform grid
- All cards have identical dimensions
- Everything centered, everything the same height
- No variation in background colors between sections
- Looks like a single repeated template copy-pasted over and over

**This is the #1 reason the site looks amateur.**

## THE REFERENCE: Shin & Kim (shinkim.com)

Shin & Kim uses a completely different approach:
- **Asymmetric layouts** — large image on one side, text on the other, different sizes
- **Image bleeds past its container** — the photo is oversized and extends beyond the text column
- **Alternating backgrounds** — white section → light gray section → white → dark section
- **Dot pagination indicators** (○○○●○○○○○○) for carousels
- **Arrow navigation** on sides (< >) for sliding between items
- **Text and image are NOT the same width** — the image takes ~40% and the text takes ~55%, creating visual tension
- **Section labels** like "세종소식" with a colored dash (─) before them

## IMPLEMENTATION RULES

### Rule 1: Every section must have a DIFFERENT layout pattern

Do NOT repeat the same layout. Cycle through these 5 patterns:

```
Pattern A: [IMAGE 45%] [TEXT 50%]        ← image left, text right
Pattern B: [TEXT 50%] [IMAGE 45%]        ← text left, image right (MIRROR)
Pattern C: [FULL-WIDTH IMAGE with overlay text]
Pattern D: [CARD GRID — 3 columns, varied heights]
Pattern E: [HORIZONTAL CAROUSEL with arrows]
```

Apply them in this order across the page:
- Hero → Pattern C (full-width)
- Practice Areas → Pattern D (card grid)
- About / Attorney → Pattern A (image left)
- Achievements → Pattern E (carousel)
- Case Results → Pattern B (image right, MIRROR of A)
- Insights / Blog → Pattern D (varied card grid)
- Contact → Pattern C (full-width map background)

### Rule 2: Asymmetric Image-Text Split (Patterns A & B)

This is the key layout from Shin & Kim's news/award section:

```html
<!-- Pattern A: Image LEFT (larger), Text RIGHT -->
<section class="split-section split--img-left" id="about">
  <div class="split-image">
    <img src="/images/attorney-office.jpg" alt="변호사 사무실" loading="lazy">
  </div>
  <div class="split-content">
    <span class="section-label">── ABOUT</span>
    <h2 class="split-title">세종, '2025 대한민국 베스트 로펌 &amp; 로이어' 평가에서 전문성 및 서비스 분야 '최우수상' 등 수상</h2>
    <div class="split-divider"></div>
    <p class="split-text">
      법무법인(유) 세종(이하 '세종')(우충한 대표변호사)은 지난 28일(금), 
      한국경제신문 다산홀에서 진행된 '2025 대한민국 베스트 로펌&로이어' 
      시상식에서 전문성 및 서비스 분야에서 '최우수상'을 수상하였으며...
    </p>
  </div>
</section>

<!-- Pattern B: Text LEFT, Image RIGHT (mirror) -->
<section class="split-section split--img-right" id="results">
  <div class="split-content">
    <span class="section-label">── RESULTS</span>
    <h2 class="split-title">한국 학생 헬스장 부상 사건<br>157만 TWD 승소 판결</h2>
    <div class="split-divider"></div>
    <p class="split-text">
      한국 대학생이 대만 최대 상장 헬스장에서 트레이너 지도 중 
      90kg 데드리프트로 추간판 파열 부상을 입은 사건...
    </p>
  </div>
  <div class="split-image">
    <img src="/images/gym-case.jpg" alt="헬스장 소송" loading="lazy">
  </div>
</section>
```

```css
/* ============================================
   ASYMMETRIC SPLIT LAYOUT
   The KEY to looking professional
   ============================================ */

.split-section {
  display: grid;
  min-height: 500px;
  overflow: hidden;
}

/* Pattern A: Image LEFT 45%, Text RIGHT 55% */
.split--img-left {
  grid-template-columns: 45fr 55fr;
}

/* Pattern B: Text LEFT 55%, Image RIGHT 45% */
.split--img-right {
  grid-template-columns: 55fr 45fr;
}

/* IMAGE — bleeds to edge, no container padding on image side */
.split-image {
  position: relative;
  overflow: hidden;
}
.split-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* CRITICAL: image fills entire column, edge to edge */
  display: block;
}

/* HOVER: subtle zoom on image */
.split-section:hover .split-image img {
  transform: scale(1.03);
  transition: transform 0.8s cubic-bezier(0.25, 0, 0.25, 1);
}

/* TEXT — has generous internal padding */
.split-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(3rem, 6vw, 6rem);
  /* On image-left layout, text has left padding from image */
  /* On image-right layout, text has right padding from image */
}

/* Section label — like Shin & Kim's "세종소식" with dash */
.split-content .section-label {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-caption, #8A8A9A);
  margin-bottom: 1.5rem;
}

/* Title — large, serif, commanding */
.split-title {
  font-family: 'Nanum Myeongjo', Georgia, serif;
  font-size: clamp(1.5rem, 2.5vw, 2.25rem);
  font-weight: 700;
  line-height: 1.35;
  color: var(--text-heading, #1A1A2E);
  word-break: keep-all;
  margin-bottom: 1.5rem;
}

/* Colored divider line under title — like Shin & Kim */
.split-divider {
  width: 40px;
  height: 3px;
  background: #5B3A8C;
  margin-bottom: 1.5rem;
}

/* Body text */
.split-text {
  font-family: var(--font-body, 'Pretendard', sans-serif);
  font-size: clamp(0.9375rem, 1.1vw, 1rem);
  line-height: 1.8;
  color: var(--text-secondary, #6A6A7A);
  word-break: keep-all;
  max-width: 520px;
}

/* MOBILE: stack vertically */
@media (max-width: 768px) {
  .split--img-left,
  .split--img-right {
    grid-template-columns: 1fr;
  }
  .split-image {
    aspect-ratio: 16 / 10;
    max-height: 300px;
  }
  /* On mobile, image always comes first regardless of desktop order */
  .split--img-right .split-image {
    order: -1;
  }
}
```

### Rule 3: Alternating Section Backgrounds

**NEVER use the same background for two adjacent sections.** Alternate like this:

```css
/* Pattern: white → gray → white → dark → white → gray ... */

/* Light sections (default) */
.section--light {
  background: #FFFFFF;
}

/* Gray sections — subtle warmth */
.section--gray {
  background: #F8F7FA;  /* very light purple-gray tint */
}

/* Dark sections — for dramatic contrast */
.section--dark {
  background: #1A1A2E;
  color: #E8E8F0;
}
.section--dark .section-label { color: rgba(255, 255, 255, 0.5); }
.section--dark .split-title { color: #FFFFFF; }
.section--dark .split-divider { background: #C4A265; }
.section--dark .split-text { color: rgba(255, 255, 255, 0.65); }

/* Apply to sections in order: */
/* 
  #hero         → has its own photo bg
  #practice     → .section--light (white)
  #about        → .section--gray  (light gray)
  #achievements → .section--light (white)
  #results      → .section--dark  (dark navy)   ← DRAMATIC
  #insights     → .section--gray  (light gray)
  #offices      → .section--light (white)
  #contact      → .section--dark  (dark navy)
*/
```

### Rule 4: Carousel with Arrow Navigation & Dot Indicators

Shin & Kim's carousel has:
- `<` left arrow button on far left
- `>` right arrow button on far right
- Dot indicators below: ○○○●○○○○○○
- Cards slide horizontally
- Image on one side, text on other (asymmetric WITHIN the carousel card)

```html
<section class="carousel-section section--light" id="achievements">
  <div class="container">
    <div class="carousel-header">
      <span class="section-label">── ACHIEVEMENTS</span>
      <h2 class="section-title">주요 실적</h2>
    </div>
    
    <div class="carousel-wrapper">
      <!-- Left arrow -->
      <button class="carousel-arrow carousel-prev" aria-label="이전">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polyline points="15,4 7,12 15,20"/>
        </svg>
      </button>
      
      <!-- Slides container -->
      <div class="carousel-viewport">
        <div class="carousel-track" id="achievementTrack">
          
          <!-- Slide 1: Image LEFT + Text RIGHT (like Shin & Kim) -->
          <div class="carousel-slide">
            <div class="slide-image">
              <img src="/images/achievement-1.jpg" alt="수상 실적">
            </div>
            <div class="slide-content">
              <h3 class="slide-title">세종, '2025 대한민국 베스트 로펌&로이어' 전문성 및 서비스 분야 '최우수상' 등 수상</h3>
              <div class="slide-divider"></div>
              <p class="slide-text">법무법인(유) 세종은 지난 28일(금), 한국경제신문 다산홀에서 진행된 시상식에서 전문성 및 서비스 분야에서 '최우수상'을 수상하였으며, 베스트 로이어는 9명이 꼽히며, 역대 최다 수상자를 배출하는 명예를 안았습니다.</p>
            </div>
          </div>
          
          <!-- Slide 2 -->
          <div class="carousel-slide">
            <div class="slide-image">
              <img src="/images/achievement-2.jpg" alt="Chambers 선정">
            </div>
            <div class="slide-content">
              <h3 class="slide-title">Chambers Asia-Pacific Guide 2026 발표, 총 11개 분야 'Band 1' 선정</h3>
              <div class="slide-divider"></div>
              <p class="slide-text">Chambers Asia-Pacific Guide 2026 발표에서 총 19개 업무 분야 중 11개 분야에서 최우수(Band 1) 등급의 로펌으로 선정되었습니다.</p>
            </div>
          </div>
          
          <!-- More slides... -->
        </div>
      </div>
      
      <!-- Right arrow -->
      <button class="carousel-arrow carousel-next" aria-label="다음">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polyline points="9,4 17,12 9,20"/>
        </svg>
      </button>
    </div>
    
    <!-- Dot indicators -->
    <div class="carousel-dots" id="achievementDots">
      <!-- JS generates dots based on slide count -->
    </div>
  </div>
</section>
```

```css
/* ============================================
   CAROUSEL — Asymmetric image+text slides
   ============================================ */

.carousel-wrapper {
  display: flex;
  align-items: stretch;
  position: relative;
}

.carousel-arrow {
  flex-shrink: 0;
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid var(--border-light, #E8E8EE);
  cursor: pointer;
  color: var(--text-secondary, #6A6A7A);
  transition: all 0.2s;
}
.carousel-arrow:hover {
  background: var(--gray-50, #F8F7FA);
  color: var(--text-heading, #1A1A2E);
  border-color: var(--text-heading, #1A1A2E);
}

.carousel-viewport {
  flex: 1;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  transition: transform 0.6s cubic-bezier(0.25, 0, 0.25, 1);
}

/* EACH SLIDE: image on left (40%), text on right (60%) */
.carousel-slide {
  flex: 0 0 100%;
  display: grid;
  grid-template-columns: 40fr 60fr;
  min-height: 400px;
}

.slide-image {
  overflow: hidden;
}
.slide-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.slide-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(2rem, 4vw, 4rem);
}

.slide-title {
  font-family: 'Nanum Myeongjo', Georgia, serif;
  font-size: clamp(1.25rem, 2vw, 1.75rem);
  font-weight: 700;
  line-height: 1.4;
  color: var(--text-heading, #1A1A2E);
  word-break: keep-all;
  margin-bottom: 1rem;
}

.slide-divider {
  width: 32px;
  height: 2.5px;
  background: #5B3A8C;
  margin-bottom: 1rem;
}

.slide-text {
  font-size: 0.9375rem;
  line-height: 1.8;
  color: var(--text-secondary, #6A6A7A);
  word-break: keep-all;
}

/* DOT INDICATORS — ○○○●○○○○○○ */
.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.carousel-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1.5px solid #CCCCCC;
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s;
}
.carousel-dot.active {
  background: #1A1A2E;
  border-color: #1A1A2E;
}
.carousel-dot:hover:not(.active) {
  border-color: #888;
}

/* MOBILE */
@media (max-width: 768px) {
  .carousel-slide {
    grid-template-columns: 1fr;
  }
  .slide-image {
    aspect-ratio: 16 / 10;
    max-height: 250px;
  }
  .carousel-arrow {
    display: none;
  }
  /* Enable swipe on mobile */
  .carousel-track {
    scroll-snap-type: x mandatory;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .carousel-track::-webkit-scrollbar { display: none; }
  .carousel-slide {
    scroll-snap-align: start;
  }
}
```

```javascript
// ============================================
// CAROUSEL CONTROLLER
// ============================================
class Carousel {
  constructor(trackId, dotsId, prevBtn, nextBtn) {
    this.track = document.getElementById(trackId);
    this.dotsContainer = document.getElementById(dotsId);
    this.slides = this.track ? this.track.children : [];
    this.current = 0;
    this.total = this.slides.length;
    this.autoplayInterval = null;

    if (!this.track || this.total === 0) return;

    // Generate dots
    this.generateDots();

    // Arrow buttons
    if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => this.next());

    // Autoplay every 6 seconds
    this.startAutoplay();

    // Pause on hover
    this.track.closest('.carousel-wrapper')?.addEventListener('mouseenter', () => this.stopAutoplay());
    this.track.closest('.carousel-wrapper')?.addEventListener('mouseleave', () => this.startAutoplay());
  }

  generateDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';
    for (let i = 0; i < this.total; i++) {
      const dot = document.createElement('button');
      dot.className = `carousel-dot${i === 0 ? ' active' : ''}`;
      dot.setAttribute('aria-label', `슬라이드 ${i + 1}`);
      dot.addEventListener('click', () => this.goTo(i));
      this.dotsContainer.appendChild(dot);
    }
  }

  goTo(index) {
    this.current = ((index % this.total) + this.total) % this.total;
    this.track.style.transform = `translateX(-${this.current * 100}%)`;
    
    // Update dots
    const dots = this.dotsContainer?.querySelectorAll('.carousel-dot');
    dots?.forEach((d, i) => d.classList.toggle('active', i === this.current));
  }

  next() { this.goTo(this.current + 1); }
  prev() { this.goTo(this.current - 1); }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => this.next(), 6000);
  }
  stopAutoplay() {
    if (this.autoplayInterval) clearInterval(this.autoplayInterval);
  }
}

// Initialize after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const achievementCarousel = new Carousel(
    'achievementTrack',
    'achievementDots',
    document.querySelector('#achievements .carousel-prev'),
    document.querySelector('#achievements .carousel-next')
  );
});
```

### Rule 5: Content Cards with VARIED Sizes (Not Uniform)

The current site shows all cards at the same size. Shin & Kim and other premium sites use **masonry-like varied heights** or a **featured + small grid** layout.

```html
<!-- Featured card (larger) + side list (smaller) -->
<div class="content-grid">
  <!-- Featured: takes 60% width, full height -->
  <article class="card card--featured">
    <div class="card-image">
      <img src="/images/blog-cosmetics.jpg" alt="화장품 시장 진출">
      <span class="card-badge">GUIDE</span>
    </div>
    <div class="card-body">
      <h3>대만 화장품 시장 진출: 법인 설립부터 PIF 등록까지</h3>
      <p>세련된 한국 뷰티 브랜드들이 대만 시장의 소비력을 높게 평가하며...</p>
    </div>
  </article>
  
  <!-- Right column: 2 smaller stacked cards -->
  <div class="card-stack">
    <article class="card card--small">
      <div class="card-image"><img src="/images/blog-logistics.jpg" alt="물류업"></div>
      <div class="card-body">
        <span class="card-badge">GUIDE</span>
        <h4>대만에서 물류업을 경영하는 방법</h4>
      </div>
    </article>
    <article class="card card--small">
      <div class="card-image"><img src="/images/blog-realestate.jpg" alt="부동산 분쟁"></div>
      <div class="card-body">
        <span class="card-badge">GUIDE</span>
        <h4>부동산·건설 분쟁</h4>
        <p>매매·임대·공사 분쟁 대응.</p>
      </div>
    </article>
  </div>
</div>
```

```css
.content-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 1.5rem;
  align-items: stretch;
}

/* Featured card — large */
.card--featured {
  display: flex;
  flex-direction: column;
}
.card--featured .card-image {
  flex: 1;
  min-height: 280px;
  position: relative;
  overflow: hidden;
}
.card--featured .card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}
.card--featured:hover .card-image img {
  transform: scale(1.03);
}
.card--featured .card-body {
  padding: 1.5rem;
  border: 1px solid var(--border-light);
  border-top: none;
}
.card--featured h3 {
  font-family: 'Nanum Myeongjo', serif;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

/* Right column: stacked smaller cards */
.card-stack {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card--small {
  display: grid;
  grid-template-columns: 140px 1fr;
  border: 1px solid var(--border-light);
  overflow: hidden;
  transition: border-color 0.2s;
}
.card--small:hover {
  border-color: #5B3A8C;
}
.card--small .card-image {
  overflow: hidden;
}
.card--small .card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.card--small .card-body {
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.card--small h4 {
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.4;
}

.card-badge {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #5B3A8C;
  margin-bottom: 0.375rem;
}

/* MOBILE */
@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  .card--small {
    grid-template-columns: 120px 1fr;
  }
}
```

---

## COMPLETE SECTION ORDER WITH LAYOUT PATTERNS

Apply these patterns to the full page in this exact order:

```
SECTION              LAYOUT           BACKGROUND
─────────────────────────────────────────────────
1. Hero              Full-screen photo  Photo + overlay
2. Practice Areas    Card grid (3×2)    White #FFFFFF
3. Attorney Profile  Split A (img L)    Gray #F8F7FA
4. Achievements      Carousel (< > ●)  White #FFFFFF
5. Case Results      Split B (img R)    Dark #1A1A2E
6. Blog / Insights   Featured + stack   Gray #F8F7FA
7. Statistics         Counter numbers   White #FFFFFF
8. FAQ               Accordion          Gray #F8F7FA
9. Office Locations  Map tabs           White #FFFFFF
10. Contact / CTA    Full-width         Dark #1A1A2E
```

**THE CRITICAL RULE: No two adjacent sections should have the same background color AND the same layout pattern. Every section must feel visually distinct from the one above and below it.**

---

## VISUAL RHYTHM SUMMARY

Think of the page like music. It needs rhythm — loud/quiet, big/small, dark/light:

```
BIG    (hero full-screen photo)
small  (practice area cards on white)
BIG    (attorney profile, asymmetric split on gray)
medium (carousel with arrows on white)
BIG    (case results, asymmetric split on DARK)
small  (blog cards on gray)
medium (stats counter on white)
small  (FAQ accordion on gray)
medium (map with tabs on white)
BIG    (contact CTA on dark, full-width)
```

This alternation of scale, color, and layout is what makes premium sites feel "alive" instead of "flat".
