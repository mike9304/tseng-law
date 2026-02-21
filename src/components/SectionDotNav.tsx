'use client';

import type { CSSProperties } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/locales';

type DotItem = {
  id: string;
  label: string;
};

const orderedSectionIds = ['hero', 'insights', 'practice', 'about', 'results', 'stats', 'faq', 'offices', 'contact'];

const sectionLabelsByLocale: Record<Locale, Record<string, string>> = {
  ko: {
    hero: '메인',
    insights: '칼럼',
    practice: '업무',
    about: '변호사',
    results: '사례',
    stats: '성과',
    faq: 'FAQ',
    offices: '오시는길',
    contact: '연락처'
  },
  'zh-hant': {
    hero: '首頁',
    insights: '洞見',
    practice: '服務',
    about: '律師',
    results: '案例',
    stats: '成果',
    faq: '常見問題',
    offices: '據點',
    contact: '聯絡'
  },
  en: {
    hero: 'Home',
    insights: 'Columns',
    practice: 'Services',
    about: 'Lawyers',
    results: 'Cases',
    stats: 'About',
    faq: 'FAQ',
    offices: 'Offices',
    contact: 'Contact'
  }
};

export default function SectionDotNav({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const labels = useMemo(() => sectionLabelsByLocale[locale], [locale]);
  const [items, setItems] = useState<DotItem[]>([]);
  const [active, setActive] = useState('');
  const [onDark, setOnDark] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const dragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartScroll = useRef(0);
  const towerRef = useRef<HTMLUListElement>(null);

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
  }, [isHome, labels, pathname]);

  /* ---- Scroll tracking for section dots (homepage) ---- */
  useEffect(() => {
    if (!isHome || items.length === 0) return;
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));
    if (!sections.length) return;
    const orderedSections = [...sections].sort((a, b) => a.offsetTop - b.offsetTop);
    let rafId = 0;

    const applyActiveSection = () => {
      if (dragging.current) return;
      const probeY = window.scrollY + window.innerHeight * 0.38;
      let current = orderedSections[0];

      for (const section of orderedSections) {
        if (probeY >= section.offsetTop - 2) {
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
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [isHome, items]);

  /* ---- Scroll progress for 101 tower (all pages) ---- */
  useEffect(() => {
    let rafId = 0;

    const updateProgress = () => {
      if (dragging.current) return;
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      setScrollProgress(Math.min(window.scrollY / maxScroll, 1));
    };

    const requestUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        updateProgress();
      });
    };

    updateProgress();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [pathname]);

  /* ---- Drag-to-scroll for the Taipei 101 tower ---- */
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    dragging.current = true;
    dragStartY.current = e.clientY;
    dragStartScroll.current = window.scrollY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const deltaY = e.clientY - dragStartY.current;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const trackHeight = towerRef.current?.clientHeight ?? window.innerHeight * 0.4;
    const scrollDelta = (deltaY / trackHeight) * maxScroll;
    const newScroll = Math.max(0, Math.min(maxScroll, dragStartScroll.current + scrollDelta));
    window.scrollTo(0, newScroll);
    setScrollProgress(newScroll / maxScroll);
  }, []);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }, []);

  const navLabel = locale === 'ko' ? '섹션 탐색' : locale === 'zh-hant' ? '區段導覽' : 'Section navigation';
  const navStyle = { '--dot-progress': `${scrollProgress}` } as CSSProperties;
  const hasDots = isHome && items.length > 0;

  return (
    <nav className={`section-dots${onDark ? ' on-dark' : ''}`} aria-label={navLabel} style={navStyle}>
      <ul ref={towerRef}>
        {hasDots && items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className={`dot${active === item.id ? ' active' : ''}`} data-section={item.id}>
              <span>{item.label}</span>
            </a>
          </li>
        ))}
        <li
          className="taipei101-thumb"
          role="scrollbar"
          aria-controls="main"
          aria-valuenow={Math.round(scrollProgress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={locale === 'ko' ? '페이지 스크롤' : locale === 'zh-hant' ? '頁面滾動' : 'Page scroll'}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
      </ul>
    </nav>
  );
}
