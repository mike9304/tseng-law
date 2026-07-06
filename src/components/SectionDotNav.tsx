'use client';

// allow: SIZE_OK - pre-existing home navigation module; this FAQ parity change only disables it off-home.
import type { CSSProperties, KeyboardEvent, MouseEvent, PointerEvent } from 'react';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/locales';
import {
  orderedSectionIds,
  sectionLabelsByLocale,
  type DotItem,
} from '@/components/section-dot-nav-config';

type SectionDotNavProps = {
  readonly locale: Locale;
  readonly currentSlug?: string;
  readonly scrollRootSelector?: string;
  readonly updateHash?: boolean;
};

type DotNavStyle = CSSProperties & {
  readonly '--dot-progress': string;
};

function normalizedSlug(slug: string): string {
  return slug.trim().replace(/^\/+|\/+$/g, '');
}

function sectionTop(section: HTMLElement, root: HTMLElement | null): number {
  if (!root) return window.scrollY + section.getBoundingClientRect().top;
  return root.scrollTop + section.getBoundingClientRect().top - root.getBoundingClientRect().top;
}

function scrollTop(root: HTMLElement | null): number {
  return root?.scrollTop ?? window.scrollY;
}

function viewportHeight(root: HTMLElement | null): number {
  return root?.clientHeight ?? window.innerHeight;
}

function maxScroll(root: HTMLElement | null): number {
  return root
    ? Math.max(root.scrollHeight - root.clientHeight, 1)
    : Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
}

function scrollTo(root: HTMLElement | null, top: number, behavior: ScrollBehavior): void {
  if (root) {
    root.scrollTo({ top, behavior });
    return;
  }
  window.scrollTo({ top, behavior });
}

export default function SectionDotNav({
  locale,
  currentSlug,
  scrollRootSelector,
  updateHash = true,
}: SectionDotNavProps) {
  const pathname = usePathname();
  const isPreviewHome = currentSlug === undefined ? undefined : normalizedSlug(currentSlug) === '';
  const isHome = isPreviewHome ?? (pathname === `/${locale}` || pathname === `/${locale}/`);
  const labels = useMemo(() => sectionLabelsByLocale[locale], [locale]);
  const [items, setItems] = useState<DotItem[]>([]);
  const [active, setActive] = useState('');
  const [onDark, setOnDark] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollControlId, setScrollControlId] = useState<string | undefined>(undefined);
  const generatedScrollRootId = useId().replace(/:/g, '');
  const dragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartScroll = useRef(0);
  const towerRef = useRef<HTMLDivElement>(null);
  const getScrollRoot = useCallback(() => {
    if (!scrollRootSelector) return null;
    const root = document.querySelector(scrollRootSelector);
    return root instanceof HTMLElement ? root : null;
  }, [scrollRootSelector]);

  useEffect(() => {
    const root = getScrollRoot();
    const target = root ?? document.querySelector('main') ?? document.documentElement;
    if (!(target instanceof HTMLElement)) return;
    if (!target.id) {
      target.id = `section-dot-scroll-root-${generatedScrollRootId}`;
    }
    setScrollControlId(target.id);
  }, [generatedScrollRootId, getScrollRoot, pathname]);

  /* ---- Detect sections on homepage ---- */
  useEffect(() => {
    if (!isHome) {
      setItems([]);
      setActive('');
      return;
    }

    const sectionItems = orderedSectionIds
      .filter((id) => Boolean(document.getElementById(id)))
      .map((id) => ({ id, label: labels[id] }));

    setItems(sectionItems);
    setActive((prev) => (sectionItems.some((item) => item.id === prev) ? prev : sectionItems[0]?.id ?? ''));
  }, [isHome, labels]);

  /* ---- Scroll tracking for section dots (homepage) ---- */
  useEffect(() => {
    if (!isHome || items.length === 0) return;
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));
    if (!sections.length) return;
    const root = getScrollRoot();
    const getSectionTop = (section: HTMLElement) => sectionTop(section, root);
    const orderedSections = [...sections].sort((a, b) => getSectionTop(a) - getSectionTop(b));
    let rafId = 0;

    const applyActiveSection = () => {
      if (dragging.current) return;
      const probeY = scrollTop(root) + viewportHeight(root) * 0.38;
      let current = orderedSections[0];

      for (const section of orderedSections) {
        if (probeY >= getSectionTop(section) - 2) {
          current = section;
          continue;
        }
        break;
      }

      setActive(current.id);
      setOnDark(current.dataset.tone === 'dark');
    };

    const requestUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        applyActiveSection();
      });
    };

    applyActiveSection();
    const scrollTarget = root ?? window;
    scrollTarget.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      scrollTarget.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [getScrollRoot, isHome, items]);

  /* ---- Scroll progress for 101 tower (all pages) ---- */
  useEffect(() => {
    const root = getScrollRoot();
    let rafId = 0;

    const updateProgress = () => {
      if (dragging.current) return;
      setScrollProgress(Math.min(scrollTop(root) / maxScroll(root), 1));
    };

    const requestUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        updateProgress();
      });
    };

    updateProgress();
    const scrollTarget = root ?? window;
    scrollTarget.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      scrollTarget.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [getScrollRoot, pathname]);

  /* ---- Drag-to-scroll for the Taipei 101 tower ---- */
  const onPointerDown = useCallback((e: PointerEvent<HTMLElement>) => {
    const root = getScrollRoot();
    e.preventDefault();
    dragging.current = true;
    dragStartY.current = e.clientY;
    dragStartScroll.current = scrollTop(root);
    e.currentTarget.setPointerCapture(e.pointerId);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
  }, [getScrollRoot]);

  const onPointerMove = useCallback((e: PointerEvent<HTMLElement>) => {
    if (!dragging.current) return;
    const root = getScrollRoot();
    const deltaY = e.clientY - dragStartY.current;
    const rootMaxScroll = maxScroll(root);
    const trackHeight = towerRef.current?.clientHeight ?? viewportHeight(root) * 0.4;
    const scrollDelta = (deltaY / trackHeight) * rootMaxScroll;
    const newScroll = Math.max(0, Math.min(rootMaxScroll, dragStartScroll.current + scrollDelta));
    scrollTo(root, newScroll, 'auto');
    setScrollProgress(newScroll / rootMaxScroll);
  }, [getScrollRoot]);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }, []);

  const scrollToRatio = useCallback((ratio: number) => {
    const root = getScrollRoot();
    const rootMaxScroll = maxScroll(root);
    const nextProgress = Math.max(0, Math.min(1, ratio));
    scrollTo(root, rootMaxScroll * nextProgress, 'auto');
    setScrollProgress(nextProgress);
  }, [getScrollRoot]);

  const onThumbKeyDown = useCallback((event: KeyboardEvent<HTMLElement>) => {
    const step = 0.08;
    const pageStep = 0.24;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollToRatio(scrollProgress - step);
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      scrollToRatio(scrollProgress + step);
    } else if (event.key === 'PageUp') {
      event.preventDefault();
      scrollToRatio(scrollProgress - pageStep);
    } else if (event.key === 'PageDown') {
      event.preventDefault();
      scrollToRatio(scrollProgress + pageStep);
    } else if (event.key === 'Home') {
      event.preventDefault();
      scrollToRatio(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      scrollToRatio(1);
    }
  }, [scrollProgress, scrollToRatio]);

  const onDotClick = useCallback((event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const section = document.getElementById(id);
    if (!section) return;

    event.preventDefault();
    const root = getScrollRoot();
    const header = document.querySelector('.builder-site-header, .header');
    const headerHeight = header instanceof HTMLElement ? header.getBoundingClientRect().height : 96;
    const targetY = Math.max(0, sectionTop(section, root) - headerHeight - 12);

    if (updateHash) {
      const nextUrl = new URL(window.location.href);
      nextUrl.hash = id;
      window.history.pushState(null, '', nextUrl.toString());
    }
    scrollTo(root, targetY, 'smooth');
    setActive(id);
    setOnDark(section.dataset.tone === 'dark');
  }, [getScrollRoot, updateHash]);

  const navLabel = locale === 'ko' ? '섹션 탐색' : locale === 'zh-hant' ? '區段導覽' : 'Section navigation';
  const navStyle: DotNavStyle = { '--dot-progress': `${scrollProgress}` };
  const hasDots = isHome && items.length > 0;
  if (!isHome) return null;

  return (
    <nav className={`section-dots${onDark ? ' on-dark' : ''}`} aria-label={navLabel} style={navStyle}>
      <div className="section-dots-track" ref={towerRef}>
        {hasDots ? (
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`dot${active === item.id ? ' active' : ''}`}
                  data-section={item.id}
                  onClick={(event) => onDotClick(event, item.id)}
                >
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        <div
          className="taipei101-thumb"
          role="scrollbar"
          tabIndex={0}
          aria-controls={scrollControlId}
          aria-orientation="vertical"
          aria-valuenow={Math.round(scrollProgress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={locale === 'ko' ? '페이지 스크롤' : locale === 'zh-hant' ? '頁面滾動' : 'Page scroll'}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onThumbKeyDown}
        />
      </div>
    </nav>
  );
}
