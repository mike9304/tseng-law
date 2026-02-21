# CODEX PROMPT — Premium Mega Menu Navigation (Shin & Kim Style)

## THE PROBLEM

Current navigation is a flat boring menu. When you click/hover, either nothing happens or a basic dropdown appears and disappears instantly. This feels cheap.

## WHAT SHIN & KIM DOES (REFERENCE)

When you hover a top nav item like "업무분야":
1. A **full-width dropdown panel** slides down smoothly with an animation
2. The left side shows the **section title in large text** ("업무분야")
3. The right side shows **sub-categories** as a clean list with `>` chevrons
4. A **colored line (pink/mauve)** appears under the active nav item and **slides** to follow your mouse between nav items
5. When you move your mouse away, the dropdown **waits ~300ms before closing** — it doesn't vanish instantly, giving you time to move your cursor down into the dropdown
6. The dropdown background is **light gray (#F5F4F0)** — not white, creating depth
7. All nav items share the **exact same dropdown pattern** — consistent sizing, font, spacing

---

## IMPLEMENTATION

### HTML Structure

```html
<header class="site-header" id="siteHeader">
  <!-- Top utility bar (small links) -->
  <div class="header-utility">
    <div class="container">
      <nav class="utility-nav" aria-label="보조 메뉴">
        <a href="/social">사회공헌</a>
        <a href="/seminars">세미나</a>
        <a href="/contact">연락처</a>
        <a href="/directions">오시는 길</a>
        <div class="lang-switcher">
          <select aria-label="언어 선택">
            <option value="ko" selected>한국어</option>
            <option value="zh">中文</option>
            <option value="en">English</option>
            <option value="ja">日本語</option>
          </select>
        </div>
      </nav>
    </div>
  </div>

  <!-- Main navigation -->
  <div class="header-main">
    <div class="container">
      <a href="/" class="header-logo" aria-label="법무법인 호정 홈">
        <span class="logo-en">HOJEONG</span>
        <span class="logo-kr">법무법인 호정</span>
      </a>

      <nav class="main-nav" id="mainNav" aria-label="주 메뉴">
        <!-- The sliding underline indicator -->
        <div class="nav-indicator" id="navIndicator"></div>

        <ul class="nav-list">
          <li class="nav-item" data-menu="practice">
            <a href="/practice" class="nav-link">업무분야</a>
          </li>
          <li class="nav-item" data-menu="attorney">
            <a href="/attorney" class="nav-link">변호사 소개</a>
          </li>
          <li class="nav-item" data-menu="media">
            <a href="/media" class="nav-link">미디어센터</a>
          </li>
          <li class="nav-item" data-menu="insights">
            <a href="/insights" class="nav-link">호정칼럼</a>
          </li>
          <li class="nav-item" data-menu="about">
            <a href="/about" class="nav-link">법인소개</a>
          </li>
        </ul>
      </nav>

      <!-- Mobile hamburger -->
      <button class="nav-hamburger" id="navHamburger" aria-label="메뉴 열기">
        <span></span><span></span><span></span>
      </button>
    </div>
    
    <!-- Accent line under entire nav -->
    <div class="header-accent-line"></div>
  </div>

  <!-- ================================================
       MEGA MENU DROPDOWNS
       One panel per nav item, all same structure
       ================================================ -->
  <div class="mega-menu" id="megaMenu" aria-hidden="true">
    
    <!-- Panel: 업무분야 -->
    <div class="mega-panel" data-panel="practice">
      <div class="container">
        <div class="mega-layout">
          <h2 class="mega-title">업무분야</h2>
          <ul class="mega-links">
            <li><a href="/practice/corporate">회사설립<span class="mega-chevron">›</span></a></li>
            <li><a href="/practice/labor">노동법<span class="mega-chevron">›</span></a></li>
            <li><a href="/practice/traffic">교통사고<span class="mega-chevron">›</span></a></li>
            <li><a href="/practice/realestate">부동산·건설<span class="mega-chevron">›</span></a></li>
            <li><a href="/practice/divorce">이혼·가사<span class="mega-chevron">›</span></a></li>
            <li><a href="/practice/cosmetics">화장품·식품<span class="mega-chevron">›</span></a></li>
            <li><a href="/practice/visa">비자·거류증<span class="mega-chevron">›</span></a></li>
            <li><a href="/practice/all">전체 보기<span class="mega-chevron">›</span></a></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Panel: 변호사 소개 -->
    <div class="mega-panel" data-panel="attorney">
      <div class="container">
        <div class="mega-layout">
          <h2 class="mega-title">변호사 소개</h2>
          <ul class="mega-links">
            <li><a href="/attorney/wei">대표 변호사<span class="mega-chevron">›</span></a></li>
            <li><a href="/attorney/team">소속 변호사<span class="mega-chevron">›</span></a></li>
            <li><a href="/attorney/staff">전문 스태프<span class="mega-chevron">›</span></a></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Panel: 미디어센터 -->
    <div class="mega-panel" data-panel="media">
      <div class="container">
        <div class="mega-layout">
          <h2 class="mega-title">미디어센터</h2>
          <ul class="mega-links">
            <li><a href="/media/news">언론보도<span class="mega-chevron">›</span></a></li>
            <li><a href="/media/broadcast">방송출연<span class="mega-chevron">›</span></a></li>
            <li><a href="/media/video">영상 자료<span class="mega-chevron">›</span></a></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Panel: 호정칼럼 -->
    <div class="mega-panel" data-panel="insights">
      <div class="container">
        <div class="mega-layout">
          <h2 class="mega-title">호정칼럼</h2>
          <ul class="mega-links">
            <li><a href="/insights/corporate">법인설립 가이드<span class="mega-chevron">›</span></a></li>
            <li><a href="/insights/legal">대만 법률정보<span class="mega-chevron">›</span></a></li>
            <li><a href="/insights/cases">소송사례 분석<span class="mega-chevron">›</span></a></li>
            <li><a href="/insights/all">전체 보기<span class="mega-chevron">›</span></a></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Panel: 법인소개 -->
    <div class="mega-panel" data-panel="about">
      <div class="container">
        <div class="mega-layout">
          <h2 class="mega-title">법인소개</h2>
          <ul class="mega-links">
            <li><a href="/about/overview">법인 개요<span class="mega-chevron">›</span></a></li>
            <li><a href="/about/philosophy">경영 철학<span class="mega-chevron">›</span></a></li>
            <li><a href="/about/offices">사무소 안내<span class="mega-chevron">›</span></a></li>
            <li><a href="/about/directions">오시는 길<span class="mega-chevron">›</span></a></li>
          </ul>
        </div>
      </div>
    </div>

  </div>
  
  <!-- Dark overlay behind mega menu -->
  <div class="mega-overlay" id="megaOverlay"></div>
</header>
```

### CSS

```css
/* ================================================
   HEADER — Two-tier: utility bar + main nav
   ================================================ */

.site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  background: #FFFFFF;
  transition: box-shadow 0.3s;
}

/* When scrolled — add shadow */
.site-header.scrolled {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

/* ---- Top utility bar ---- */
.header-utility {
  background: #FAFAFA;
  border-bottom: 1px solid #F0F0F0;
}
.header-utility .container {
  display: flex;
  justify-content: flex-end;
}
.utility-nav {
  display: flex;
  align-items: center;
  gap: 0;
}
.utility-nav a {
  font-size: 0.75rem;
  color: #888888;
  text-decoration: none;
  padding: 0.625rem 0.875rem;
  transition: color 0.2s;
}
.utility-nav a:hover { color: #333333; }

.lang-switcher select {
  font-size: 0.75rem;
  color: #888888;
  background: transparent;
  border: 1px solid #E0E0E0;
  padding: 0.25rem 0.5rem;
  border-radius: 2px;
  cursor: pointer;
  margin-left: 0.5rem;
}

/* ---- Main navigation bar ---- */
.header-main .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

/* Logo */
.header-logo {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  gap: 2px;
}
.logo-en {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1A1A2E;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.logo-kr {
  font-family: 'Nanum Myeongjo', serif;
  font-size: 0.6875rem;
  color: #8A8A9A;
  letter-spacing: 0.05em;
}

/* ---- Accent line under header (pink/mauve like Shin & Kim) ---- */
.header-accent-line {
  height: 3px;
  background: linear-gradient(90deg, #5B3A8C, #8B5E8B);
  /* Alternative: solid color */
  /* background: #8B5E8B; */
}

/* ================================================
   NAV LIST + SLIDING UNDERLINE INDICATOR
   ================================================ */

.main-nav {
  position: relative;
}

.nav-list {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 0;
  margin: 0;
  padding: 0;
}

.nav-link {
  display: block;
  font-family: var(--font-body, 'Pretendard', sans-serif);
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1A1A2E;
  text-decoration: none;
  padding: 1.5rem 1.75rem;
  position: relative;
  transition: color 0.2s;
  white-space: nowrap;
}

.nav-link:hover {
  color: #5B3A8C;
}

/* Active nav item — when its mega menu is open */
.nav-item.active .nav-link {
  color: #5B3A8C;
}

/* THE SLIDING UNDERLINE INDICATOR
   This is a colored bar that slides horizontally
   under whichever nav item you're hovering.
   It animates smoothly from one item to another. */
.nav-indicator {
  position: absolute;
  bottom: 0;
  height: 3px;
  background: #5B3A8C;
  transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.2s;
  opacity: 0;
  pointer-events: none;
  z-index: 2;
}

/* Show indicator when hovering nav */
.main-nav:hover .nav-indicator,
.main-nav.menu-open .nav-indicator {
  opacity: 1;
}

/* ================================================
   MEGA MENU DROPDOWN PANEL
   Full-width, slides down with animation
   ================================================ */

.mega-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 99;
}

/* Individual panels — hidden by default */
.mega-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  /* KEY BACKGROUND: Light warm gray, NOT white */
  background: #F7F6F3;
  border-bottom: 1px solid #E8E7E3;
  padding: 3rem 0;
  opacity: 0;
  transform: translateY(-12px);
  visibility: hidden;
  transition: 
    opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    visibility 0s 0.35s;
  pointer-events: none;
}

/* ACTIVE panel — visible with animation */
.mega-panel.active {
  opacity: 1;
  transform: translateY(0);
  visibility: visible;
  pointer-events: auto;
  transition: 
    opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    visibility 0s 0s;
}

/* When any panel is active, the mega-menu wrapper accepts pointer events */
.mega-menu.open {
  pointer-events: auto;
}

/* Dark overlay behind mega menu */
.mega-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 98;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0s 0.3s;
  pointer-events: none;
}
.mega-overlay.visible {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transition: opacity 0.3s, visibility 0s 0s;
}

/* ---- Panel internal layout: Title LEFT + Links RIGHT ---- */
.mega-layout {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 3rem;
  align-items: start;
  max-width: 900px;
}

/* Large section title on left */
.mega-title {
  font-family: 'Nanum Myeongjo', Georgia, serif;
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 400; /* Light weight, elegant */
  color: #AAAAAA; /* Deliberately light/faded — like Shin & Kim */
  letter-spacing: -0.01em;
  line-height: 1.3;
  padding-top: 0.5rem;
}

/* Sub-links on right */
.mega-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mega-links li {
  border-bottom: 1px solid #E8E7E3;
}
.mega-links li:first-child {
  border-top: 1px solid #E8E7E3;
}

.mega-links a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0.5rem;
  font-family: var(--font-body, 'Pretendard', sans-serif);
  font-size: 0.9375rem;
  font-weight: 500;
  color: #444444;
  text-decoration: none;
  transition: color 0.2s, padding-left 0.2s;
}

.mega-links a:hover {
  color: #5B3A8C;
  /* Subtle indent on hover — feels interactive */
  padding-left: 0.75rem;
}

/* Chevron arrow on right side */
.mega-chevron {
  font-size: 1.125rem;
  color: #CCCCCC;
  transition: color 0.2s, transform 0.2s;
}
.mega-links a:hover .mega-chevron {
  color: #5B3A8C;
  transform: translateX(4px);
}

/* ================================================
   MOBILE: Full-screen slide-out menu
   ================================================ */

.nav-hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}
.nav-hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: #1A1A2E;
  transition: all 0.3s;
}

@media (max-width: 1024px) {
  .main-nav { display: none; }
  .nav-hamburger { display: flex; }
  
  /* Mobile nav overlay — implement separately */
  .main-nav.mobile-open {
    display: flex;
    position: fixed;
    inset: 0;
    background: #FFFFFF;
    flex-direction: column;
    padding: 6rem 2rem 2rem;
    z-index: 200;
  }
  .main-nav.mobile-open .nav-list {
    flex-direction: column;
    gap: 0;
    width: 100%;
  }
  .main-nav.mobile-open .nav-link {
    padding: 1.25rem 0;
    border-bottom: 1px solid #F0F0F0;
    font-size: 1.125rem;
    width: 100%;
  }
  
  /* Hide mega menu on mobile — use accordion instead */
  .mega-menu, .mega-overlay { display: none; }
}
```

### JavaScript — The Critical Hover Logic

```javascript
// ================================================
// MEGA MENU CONTROLLER
// Key behaviors:
// 1. Hover delay — menu stays open 300ms after mouse leaves
// 2. Sliding indicator — colored bar follows mouse between nav items
// 3. Smooth panel transitions — fade + slide animation
// ================================================

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('siteHeader');
  const mainNav = document.getElementById('mainNav');
  const megaMenu = document.getElementById('megaMenu');
  const megaOverlay = document.getElementById('megaOverlay');
  const indicator = document.getElementById('navIndicator');
  const navItems = document.querySelectorAll('.nav-item');
  const panels = document.querySelectorAll('.mega-panel');

  let closeTimeout = null;   // For hover delay
  let currentPanel = null;   // Track which panel is open

  // ---- SLIDING INDICATOR POSITION ----
  function moveIndicator(navItem) {
    const link = navItem.querySelector('.nav-link');
    if (!link || !indicator) return;
    
    const navRect = mainNav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    
    indicator.style.left = (linkRect.left - navRect.left) + 'px';
    indicator.style.width = linkRect.width + 'px';
  }

  // ---- OPEN A MEGA PANEL ----
  function openPanel(menuKey) {
    // Cancel any pending close
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }

    // Hide all panels first
    panels.forEach(p => p.classList.remove('active'));

    // Show the target panel
    const targetPanel = megaMenu.querySelector(`[data-panel="${menuKey}"]`);
    if (targetPanel) {
      targetPanel.classList.add('active');
      megaMenu.classList.add('open');
      megaOverlay.classList.add('visible');
      currentPanel = menuKey;
    }

    // Mark active nav item
    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.menu === menuKey);
    });

    mainNav.classList.add('menu-open');
  }

  // ---- CLOSE MEGA MENU (with delay) ----
  function closePanelDelayed() {
    // KEY: Don't close immediately! Wait 300ms.
    // If mouse re-enters nav or panel within 300ms, cancel the close.
    closeTimeout = setTimeout(() => {
      panels.forEach(p => p.classList.remove('active'));
      megaMenu.classList.remove('open');
      megaOverlay.classList.remove('visible');
      navItems.forEach(item => item.classList.remove('active'));
      mainNav.classList.remove('menu-open');
      currentPanel = null;
      closeTimeout = null;
    }, 300); // ← 300ms grace period
  }

  // ---- Cancel pending close ----
  function cancelClose() {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }
  }

  // ================================================
  // EVENT LISTENERS
  // ================================================

  // Hover on nav items → open panel + move indicator
  navItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const menuKey = item.dataset.menu;
      moveIndicator(item);
      openPanel(menuKey);
    });

    item.addEventListener('mouseleave', () => {
      closePanelDelayed();
    });
  });

  // Hover on mega menu panels → keep open
  megaMenu.addEventListener('mouseenter', () => {
    cancelClose();
  });

  megaMenu.addEventListener('mouseleave', () => {
    closePanelDelayed();
  });

  // Click overlay → close immediately
  megaOverlay.addEventListener('click', () => {
    cancelClose();
    panels.forEach(p => p.classList.remove('active'));
    megaMenu.classList.remove('open');
    megaOverlay.classList.remove('visible');
    navItems.forEach(item => item.classList.remove('active'));
    mainNav.classList.remove('menu-open');
    currentPanel = null;
  });

  // ---- INDICATOR: Reset when mouse leaves entire nav ----
  mainNav.addEventListener('mouseleave', () => {
    // If no panel is open, hide indicator
    if (!currentPanel) {
      indicator.style.opacity = '0';
    }
  });

  // ---- HEADER SCROLL BEHAVIOR ----
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  // ---- KEYBOARD ACCESSIBILITY ----
  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    if (!link) return;

    link.addEventListener('focus', () => {
      moveIndicator(item);
      openPanel(item.dataset.menu);
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentPanel) {
      cancelClose();
      panels.forEach(p => p.classList.remove('active'));
      megaMenu.classList.remove('open');
      megaOverlay.classList.remove('visible');
      navItems.forEach(item => item.classList.remove('active'));
      mainNav.classList.remove('menu-open');
      currentPanel = null;
    }
  });
});
```

---

## KEY BEHAVIORS SUMMARY

| Behavior | How | Why |
|----------|-----|-----|
| **Hover delay (300ms)** | `setTimeout` in `closePanelDelayed()` | Mouse can travel from nav to dropdown without it closing |
| **Sliding indicator** | `moveIndicator()` calculates position, CSS `transition` animates | Colored bar smoothly slides between menu items |
| **Panel animation** | CSS `opacity` + `translateY(-12px)` → `translateY(0)` | Dropdown slides down gracefully, not just appearing |
| **Title LEFT, links RIGHT** | `grid-template-columns: 1fr 1.5fr` | Matches Shin & Kim's exact layout pattern |
| **Faded section title** | `color: #AAAAAA` | Large but deliberately light — creates depth hierarchy |
| **Chevron slides on hover** | `transform: translateX(4px)` on hover | Subtle motion feedback on each link |
| **Dark overlay** | `.mega-overlay` with `rgba(0,0,0,0.25)` | Focuses attention on dropdown, dims page behind |
| **Accent line** | `.header-accent-line` with gradient | Consistent brand color across all states |

---

## DESIGN CONSISTENCY RULES

**Every menu panel MUST follow these identical patterns:**

1. Same light gray background (`#F7F6F3`) — NOT white
2. Same grid layout (title left, links right)
3. Same font sizes and weights throughout
4. Same border-bottom on each link with `1px solid #E8E7E3`
5. Same chevron `›` on every link
6. Same hover behavior (color change + indent + chevron slide)
7. Same opening/closing animation timing

**This consistency is what makes it feel "expensive". Every interaction follows the same choreography.**
