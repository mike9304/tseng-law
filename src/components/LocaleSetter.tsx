'use client';

import { useEffect } from 'react';
import type { Locale } from '@/lib/locales';

export default function LocaleSetter({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale === 'zh-hant' ? 'zh-Hant' : locale;
  }, [locale]);

  return null;
}
