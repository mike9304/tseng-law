'use client';

import { useEffect, useState } from 'react';
import type { SiteLocale } from '@/lib/locales';

const scrollTopLabels: Record<SiteLocale, string> = {
  ko: '상단으로 이동',
  'zh-hant': '回到頂部',
  en: 'Back to top',
  ja: 'ページ上部へ戻る',
};

export default function ScrollTopButton({ locale }: { locale: SiteLocale }) {
  const [visible, setVisible] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const label = scrollTopLabels[locale];

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();

    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    media.addEventListener('change', updateMotion);

    return () => {
      window.removeEventListener('scroll', onScroll);
      media.removeEventListener('change', updateMotion);
    };
  }, []);

  // R6 (2026-09-07): the fixed 44px button sits over the right-most footer
  // legal link on 390px phones. Hide it while the footer is in the viewport;
  // the scroll threshold above is unchanged.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const footer = document.querySelector<HTMLElement>('footer, .site-footer');
    if (!footer) return undefined;

    const observer = new IntersectionObserver((entries) => {
      const latest = entries[entries.length - 1];
      if (latest) setNearFooter(latest.isIntersecting);
    });
    observer.observe(footer);

    return () => observer.disconnect();
  }, []);

  return (
    <button
      className="scroll-top"
      type="button"
      data-visible={visible && !nearFooter}
      data-near-footer={nearFooter ? 'true' : undefined}
      aria-label={label}
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: reducedMotion ? 'auto' : 'smooth'
        })
      }
    >
      ↑
    </button>
  );
}
