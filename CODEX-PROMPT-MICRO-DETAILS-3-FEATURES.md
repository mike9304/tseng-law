# CODEX PROMPT — Premium Micro-Details: 3 Killer Features from Shin & Kim

These 3 specific design details separate a $500 site from a $50,000 site. Implement ALL of them.

---

## FEATURE 1: Hero Photo "Cropped Edge" + Animated Down Arrow + Section Dots

### What Shin & Kim Does:
- The hero photo doesn't just end flat — it has a **sharp diagonal or angled crop** at the bottom, creating visual tension between the photo and the white section below
- A **downward chevron arrow (∨)** sits at the bottom center of the hero, **bouncing gently** in an infinite loop animation, inviting users to scroll
- On the **right side**, vertical **dot indicators (●○○○○○)** show which section you're currently viewing. One dot is filled, the rest are hollow. As you scroll, the active dot changes.

### Implementation:

```html
<section class="hero" id="hero">
  <div class="hero-media">
    <video autoplay muted loop playsinline poster="/images/hero-poster.jpg">
      <source src="/videos/hero.mp4" type="video/mp4">
    </video>
  </div>
  <div class="hero-overlay"></div>
  
  <!-- Cropped bottom edge — angled clip or diagonal mask -->
  <div class="hero-bottom-crop"></div>
  
  <div class="hero-content">
    <p class="hero-label">── TAIWAN LEGAL</p>
    <h1 class="hero-title">대만 법률을<br>한국어로 명확하게.</h1>
    <p class="hero-subtitle">한국어, 일본어 소통에 능통한 전문가들이<br>복잡한 대만 법률 문제를 명확하게 안내해드립니다.</p>
  </div>
  
  <!-- Animated bounce arrow at bottom center -->
  <a href="#practice" class="hero-scroll-arrow" aria-label="아래로 스크롤">
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <polyline points="6,10 14,18 22,10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </a>
</section>

<!-- Section dot navigation — FIXED on right side of viewport -->
<nav class="section-dots" id="sectionDots" aria-label="섹션 탐색">
  <ul>
    <li><a href="#hero" class="dot active" data-section="hero"></a></li>
    <li><a href="#practice" class="dot" data-section="practice"></a></li>
    <li><a href="#about" class="dot" data-section="about"></a></li>
    <li><a href="#achievements" class="dot" data-section="achievements"></a></li>
    <li><a href="#results" class="dot" data-section="results"></a></li>
    <li><a href="#insights" class="dot" data-section="insights"></a></li>
    <li><a href="#contact" class="dot" data-section="contact"></a></li>
  </ul>
</nav>
```

```css
/* ================================================
   HERO BOTTOM CROP — Diagonal / angled cut effect
   The photo looks "sliced" at the bottom
   ================================================ */

.hero {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 640px;
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

.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    160deg,
    rgba(10, 10, 20, 0.7) 0%,
    rgba(10, 10, 20, 0.45) 50%,
    rgba(10, 10, 20, 0.25) 100%
  );
}

/* THE CROP EFFECT:
   A white triangle at the very bottom that makes the photo
   look like it was cut at an angle. Like ripping paper. */
.hero-bottom-crop {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  z-index: 3;
  background: #FFFFFF;
  /* Diagonal clip: flat on bottom, angled on top-left to top-right */
  clip-path: polygon(0 40%, 100% 0%, 100% 100%, 0% 100%);
}

/* Alternative approach — SVG triangle mask over photo bottom:
   Use this if clip-path doesn't work in target browsers */
/*
.hero::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 80px;
  z-index: 3;
  background: linear-gradient(
    to bottom right,
    transparent 49.5%,
    #FFFFFF 50%
  );
}
*/

/* For a SUBTLE crop (like Shin & Kim which is more minimal),
   use a thin shadow line instead of a full diagonal: */
/*
.hero-bottom-crop {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 6px;
  z-index: 3;
  background: #FFFFFF;
  box-shadow: 0 -20px 40px rgba(0, 0, 0, 0.15);
}
*/

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 700px;
  padding: 0 clamp(2rem, 6vw, 6rem);
}

/* ================================================
   ANIMATED BOUNCE ARROW — ∨ at bottom center
   Gentle up-down bounce, infinite loop
   ================================================ */

.hero-scroll-arrow {
  position: absolute;
  bottom: 100px; /* Above the crop area */
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s;
  animation: arrowBounce 2.5s ease-in-out infinite;
}

.hero-scroll-arrow:hover {
  color: rgba(255, 255, 255, 1);
}

/* THE ANIMATION — gentle float up and down */
@keyframes arrowBounce {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
    opacity: 0.6;
  }
  50% {
    transform: translateX(-50%) translateY(12px);
    opacity: 1;
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .hero-scroll-arrow {
    animation: none;
  }
}

/* ================================================
   SECTION DOT NAVIGATION — ● ○ ○ ○ ○ ○ ○
   Fixed on right side, shows current section
   ================================================ */

.section-dots {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 90;
  transition: opacity 0.3s;
}

.section-dots ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

/* Each dot — default: hollow circle */
.dot {
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1.5px solid rgba(60, 60, 60, 0.4);
  background: transparent;
  text-decoration: none;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

/* Active dot — filled, slightly larger */
.dot.active {
  background: #1A1A2E;
  border-color: #1A1A2E;
  transform: scale(1.25);
}

/* Hover */
.dot:hover:not(.active) {
  border-color: rgba(60, 60, 60, 0.8);
  transform: scale(1.1);
}

/* When hero is in view (dark bg), dots should be white */
.section-dots.on-dark .dot {
  border-color: rgba(255, 255, 255, 0.4);
}
.section-dots.on-dark .dot.active {
  background: #FFFFFF;
  border-color: #FFFFFF;
}

/* Hide on mobile — no room */
@media (max-width: 1024px) {
  .section-dots { display: none; }
}
```

```javascript
// ================================================
// SECTION DOT NAVIGATION — Active dot follows scroll
// ================================================
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section[id]');
  const dots = document.querySelectorAll('.section-dots .dot');
  const dotsNav = document.querySelector('.section-dots');

  if (!dotsNav || sections.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Update active dot
        const sectionId = entry.target.id;
        dots.forEach(dot => {
          dot.classList.toggle('active', dot.dataset.section === sectionId);
        });

        // Switch dot color based on section darkness
        const isDark = entry.target.classList.contains('section--dark') ||
                       entry.target.id === 'hero';
        dotsNav.classList.toggle('on-dark', isDark);
      }
    });
  }, {
    threshold: 0.35,
    rootMargin: '-10% 0px -10% 0px'
  });

  sections.forEach(section => observer.observe(section));

  // Smooth scroll on dot click
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(dot.dataset.section);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
```

---

## FEATURE 2: Search Bar Overlapping Between Hero and Content Section

### What Shin & Kim Does:
The search bar sits at the **exact boundary** between the hero photo and the white content section below. It's:
- **50% on the photo, 50% on the white area** — creating a 3D floating/layered effect
- Has a **solid purple/mauve background** (#8B5E8B or similar) that contrasts both the photo above and white below
- Contains white placeholder text: "How can we help you?"
- Has a magnifying glass icon on the right
- Full width (or nearly full width within a container)

This overlap is a SUBTLE but POWERFUL technique that makes the page feel layered and 3D instead of flat sections stacked on top of each other.

### Implementation:

```html
<!-- The search bar lives at the BOTTOM of the hero section,
     but is positioned to overlap into the next section -->
<div class="hero-search-wrapper">
  <div class="container">
    <div class="hero-search-bar">
      <input 
        type="text" 
        placeholder="어떻게 도와드릴까요?" 
        class="hero-search-input"
        aria-label="검색"
      >
      <button class="hero-search-btn" aria-label="검색">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </button>
    </div>
  </div>
</div>
```

```css
/* ================================================
   OVERLAPPING SEARCH BAR
   Sits BETWEEN hero and next section, floating
   ================================================ */

.hero-search-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  /* KEY: translateY(50%) pushes it down so half is on hero, half on next section */
  transform: translateY(50%);
  padding: 0 clamp(2rem, 6vw, 6rem);
}

.hero-search-bar {
  display: flex;
  align-items: center;
  max-width: 720px;
  width: 100%;
  /* THE PURPLE BACKGROUND — matches Shin & Kim's mauve/purple bar */
  background: rgba(109, 60, 109, 0.92);
  /* Alternative: solid purple matching our brand */
  /* background: #7B4A8C; */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  /* Subtle shadow to enhance floating effect */
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: box-shadow 0.3s, background 0.3s;
}

.hero-search-bar:focus-within {
  background: rgba(109, 60, 109, 0.98);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.18),
    0 4px 12px rgba(0, 0, 0, 0.1);
}

.hero-search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font-body, 'Pretendard', sans-serif);
  font-size: clamp(0.9375rem, 1.1vw, 1.0625rem);
  font-weight: 400;
  color: #FFFFFF;
  padding: 1.125rem 1.5rem;
  letter-spacing: 0.01em;
}

.hero-search-input::placeholder {
  color: rgba(255, 255, 255, 0.55);
  font-weight: 400;
}

.hero-search-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 100%;
  padding: 1rem;
  background: none;
  border: none;
  border-left: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
}

.hero-search-btn:hover {
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.08);
}

/* CRITICAL: The next section after hero needs top padding
   to make room for the overlapping search bar */
.hero + .section,
.hero + section {
  padding-top: calc(clamp(5rem, 10vw, 8rem) + 32px);
  /* The extra 32px accounts for half the search bar height */
}

/* MOBILE: Search bar doesn't overlap, just sits at bottom of hero */
@media (max-width: 768px) {
  .hero-search-wrapper {
    transform: translateY(0);
    position: relative;
    bottom: auto;
    padding: 0 1.5rem;
    margin-top: 2rem;
  }
  .hero-search-bar {
    max-width: 100%;
  }
  .hero + .section,
  .hero + section {
    padding-top: clamp(3rem, 8vw, 5rem);
  }
}
```

### Alternative: Search bar at bottom of hero with transparent glass effect

If the purple solid background doesn't match the design, use a glass/frosted effect:

```css
/* GLASS VERSION — transparent with blur */
.hero-search-bar {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
```

---

## FEATURE 3: Grayscale City Skyline Footer with Unified Gray Tone

### What Shin & Kim Does:
The footer area has:
- A **wide panoramic grayscale photo** of city skylines (buildings from multiple cities where they have offices — churches, temples, skyscrapers, towers)
- The photo is **desaturated (grayscale)** and has a **warm gray tint**, creating a unified elegant look
- Below the photo: a **dark charcoal footer** with office location links, legal links, social media icons
- The office locations are listed horizontally: 서울 | 판교 | 북경 | 상해 | 호치민 | 하노이 | 자카르타 | 싱가포르
- Social media icons (f, b, in, youtube, instagram) are **circular outlined** on the right
- A **scroll-to-top button (↑)** floats on the right side
- Copyright text at the very bottom

### Implementation:

```html
<!-- ================================================
     FOOTER — Grayscale skyline + dark info bar
     ================================================ -->

<!-- Skyline panorama section -->
<section class="footer-skyline">
  <div class="skyline-image">
    <!-- Use a panoramic skyline image: Taipei 101, temples, modern buildings -->
    <img src="/images/skyline-panorama.jpg" alt="호정 법무법인 사무소 도시" loading="lazy">
  </div>
</section>

<!-- Dark footer with office links -->
<footer class="site-footer" id="footer">
  <!-- Office locations bar -->
  <div class="footer-offices">
    <div class="container">
      <nav class="office-links" aria-label="사무소 위치">
        <span class="office-label">사무소</span>
        <a href="#office-taipei" class="office-link">타이베이</a>
        <a href="#office-taichung" class="office-link">타이중</a>
        <a href="#office-kaohsiung" class="office-link">가오슝</a>
      </nav>
      
      <div class="footer-partners">
        <!-- Partner logos or badges if any -->
      </div>
    </div>
  </div>
  
  <!-- Bottom bar: legal links + social icons -->
  <div class="footer-bottom">
    <div class="container">
      <div class="footer-legal">
        <a href="/privacy">개인정보처리방침</a>
        <a href="/disclaimer">면책공고</a>
        <a href="/accessibility">웹접근성</a>
        <a href="/sitemap">사이트맵</a>
      </div>
      
      <div class="footer-social">
        <span class="social-label">Follow us</span>
        <div class="social-icons">
          <a href="#" class="social-icon" aria-label="Blog">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          </a>
          <a href="#" class="social-icon" aria-label="YouTube">
            <svg viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z"/></svg>
          </a>
          <a href="#" class="social-icon" aria-label="Instagram">
            <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
        </div>
      </div>
    </div>
    
    <div class="container">
      <p class="footer-copyright">
        Copyright HOVERING LAW INTERNATIONAL. All rights reserved.
      </p>
    </div>
  </div>
</footer>

<!-- Scroll to top button — fixed bottom right -->
<button class="scroll-top-btn" id="scrollTopBtn" aria-label="맨 위로">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polyline points="18,15 12,9 6,15"/>
  </svg>
</button>
```

```css
/* ================================================
   GRAYSCALE SKYLINE SECTION
   ================================================ */

.footer-skyline {
  width: 100%;
  overflow: hidden;
  background: #F0EDE8; /* warm gray fallback */
}

.skyline-image {
  width: 100%;
  max-height: 280px;
  overflow: hidden;
}

.skyline-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: bottom center;
  display: block;
  /* CRITICAL: Desaturate to grayscale + warm gray tint */
  filter: grayscale(100%) contrast(0.9) brightness(1.05);
  /* Alternative for warm sepia-gray feel: */
  /* filter: grayscale(100%) sepia(15%) contrast(0.85) brightness(1.1); */
  opacity: 0.85;
}

/* ================================================
   DARK FOOTER
   ================================================ */

.site-footer {
  background: #2A2A2A;
  color: #CCCCCC;
}

/* Office locations bar — top row */
.footer-offices {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.footer-offices .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  overflow-x: auto;
}

.office-links {
  display: flex;
  align-items: center;
  gap: 0;
  flex-wrap: nowrap;
}

.office-label {
  font-weight: 700;
  font-size: 0.875rem;
  color: #FFFFFF;
  margin-right: 1.5rem;
  white-space: nowrap;
}

.office-link {
  font-size: 0.875rem;
  color: #AAAAAA;
  text-decoration: none;
  padding: 0.5rem 1rem;
  white-space: nowrap;
  position: relative;
  transition: color 0.2s;
}
.office-link:hover {
  color: #FFFFFF;
}
/* Divider between office links */
.office-link + .office-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 12px;
  background: rgba(255, 255, 255, 0.15);
}

/* Bottom bar: legal + social */
.footer-bottom {
  padding: 1.5rem 0;
}
.footer-bottom .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-legal {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.footer-legal a {
  font-size: 0.8125rem;
  color: #888888;
  text-decoration: none;
  transition: color 0.2s;
}
.footer-legal a:hover {
  color: #FFFFFF;
}

.footer-social {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.social-label {
  font-size: 0.8125rem;
  color: #888888;
  margin-right: 0.5rem;
}

/* Social icons — CIRCULAR OUTLINE (like Shin & Kim) */
.social-icons {
  display: flex;
  gap: 0.625rem;
}
.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #AAAAAA;
  text-decoration: none;
  transition: all 0.2s;
}
.social-icon:hover {
  border-color: #FFFFFF;
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.05);
}
.social-icon svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

/* Copyright */
.footer-copyright {
  font-size: 0.75rem;
  color: #666666;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

/* ================================================
   SCROLL TO TOP BUTTON — ↑ (bottom right, square)
   ================================================ */

.scroll-top-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 80;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(26, 26, 46, 0.85);
  color: #FFFFFF;
  border: none;
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transform: translateY(12px);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.scroll-top-btn.visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.scroll-top-btn:hover {
  background: #5B3A8C;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}
```

```javascript
// ================================================
// SCROLL TO TOP BUTTON — show/hide + click behavior
// ================================================
document.addEventListener('DOMContentLoaded', () => {
  const scrollBtn = document.getElementById('scrollTopBtn');
  if (!scrollBtn) return;

  // Show button when scrolled past 400px
  const toggleScrollBtn = () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
  };
  
  window.addEventListener('scroll', toggleScrollBtn, { passive: true });
  toggleScrollBtn();

  // Smooth scroll to top on click
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
```

---

## SKYLINE IMAGE GUIDANCE

For the grayscale panoramic skyline, you need a wide image showing buildings from cities where the firm has offices.

**For 법무법인 호정 (offices in Taipei, Taichung, Kaohsiung, Pingtung):**

Create or source a panoramic composite showing:
- Taipei 101
- Traditional Taiwanese temple architecture
- Modern Taichung opera house or skyline
- Kaohsiung port/85 Sky Tower

**Image specifications:**
- Width: minimum 1920px (ideally 2560px for retina)
- Height: 400-600px
- Format: WebP preferred, JPEG fallback
- File size: under 300KB (compress aggressively since it will be grayscale)
- The image MUST be converted to grayscale via CSS filter (not in Photoshop), so the original can be color

**Free panorama sources:**
- Unsplash: search "taipei skyline panorama", "taiwan cityscape"
- Pexels: search "taipei 101 skyline"
- Wikimedia Commons: many CC-licensed Taiwan city photos

**If compositing multiple cities:** Use a tool like Canva or Photoshop to stitch 3-4 city photos side by side at equal height, then apply the CSS grayscale filter.

---

## SUMMARY: 3 FEATURES IMPLEMENTATION CHECKLIST

| Feature | Key CSS Property | Purpose |
|---------|-----------------|---------|
| ① Hero crop + arrow + dots | `clip-path`, `@keyframes arrowBounce`, `IntersectionObserver` | Photo feels "cut", arrow invites scroll, dots show position |
| ② Overlapping search bar | `transform: translateY(50%)`, `z-index: 10` | Creates 3D layered depth between hero and content |
| ③ Grayscale skyline footer | `filter: grayscale(100%)`, dark `#2A2A2A` bg, circular social icons | Unified elegant gray tone, professional closing impression |

**All 3 features must be implemented together. They create a cohesive premium experience.**
