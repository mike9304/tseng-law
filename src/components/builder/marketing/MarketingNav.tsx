import Link from 'next/link';
import type { Locale } from '@/lib/locales';

type Active = 'campaigns' | 'templates' | 'subscribers';

const copy = {
  ko: { title: '마케팅', campaigns: '캠페인', templates: '템플릿', subscribers: '구독자' },
  'zh-hant': { title: '行銷', campaigns: '活動', templates: '範本', subscribers: '訂閱者' },
  en: { title: 'Marketing', campaigns: 'Campaigns', templates: 'Templates', subscribers: 'Subscribers' },
} as const;

const TABS: Array<{ key: Active; href: (l: Locale) => string }> = [
  { key: 'campaigns', href: (l) => `/${l}/admin-builder/marketing` },
  { key: 'templates', href: (l) => `/${l}/admin-builder/marketing/templates` },
  { key: 'subscribers', href: (l) => `/${l}/admin-builder/marketing/subscribers` },
];

export default function MarketingNav({ locale, active }: { locale: Locale; active: Active }) {
  const text = copy[locale];
  return (
    <nav style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', borderBottom: '1px solid #e2e8f0', padding: '12px 24px' }}>
      <strong style={{ fontSize: 14, marginRight: 16 }}>{text.title}</strong>
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
          {text[tab.key]}
        </Link>
      ))}
    </nav>
  );
}
