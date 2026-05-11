import Link from 'next/link';
import type { Locale } from '@/lib/locales';

type Active = 'campaigns' | 'subscribers';

const TABS: Array<{ key: Active; label: string; href: (l: Locale) => string }> = [
  { key: 'campaigns', label: '캠페인', href: (l) => `/${l}/admin-builder/marketing` },
  { key: 'subscribers', label: '구독자', href: (l) => `/${l}/admin-builder/marketing/subscribers` },
];

export default function MarketingNav({ locale, active }: { locale: Locale; active: Active }) {
  return (
    <nav style={{ display: 'flex', gap: 8, borderBottom: '1px solid #e2e8f0', padding: '12px 24px' }}>
      <strong style={{ fontSize: 14, marginRight: 16 }}>Marketing</strong>
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href(locale)}
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            background: active === tab.key ? '#0f172a' : 'transparent',
            color: active === tab.key ? '#fff' : '#475569',
            fontSize: 13,
            textDecoration: 'none',
            fontWeight: 700,
          }}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
