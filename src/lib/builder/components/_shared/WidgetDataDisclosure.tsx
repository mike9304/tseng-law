'use client';

import type { Locale } from '@/lib/locales';

const labels: Record<Locale, string> = {
  ko: 'DEMO DATA — 빌더 미리보기용 샘플 데이터입니다.',
  'zh-hant': 'DEMO DATA — 此為建置器預覽用的範例資料。',
  en: 'DEMO DATA — Sample data shown for builder preview only.',
};

export function WidgetDataDisclosure({ locale = 'en' }: { locale?: Locale }) {
  return (
    <aside
      aria-label="Demo data disclosure"
      data-builder-demo-disclosure
      style={{
        border: '1px solid #f59e0b',
        borderRadius: 6,
        color: '#92400e',
        background: '#fffbeb',
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: '0.02em',
        padding: '6px 8px',
      }}
    >
      {labels[locale] ?? labels.en}
    </aside>
  );
}
