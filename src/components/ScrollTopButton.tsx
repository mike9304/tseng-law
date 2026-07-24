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

  return (
    <button
      className="scroll-top"
      type="button"
      data-visible={visible}
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
