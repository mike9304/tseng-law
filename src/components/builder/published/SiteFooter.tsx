import type { BuilderNavItem, BuilderSiteSettings } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';

function getLabel(item: BuilderNavItem, locale: Locale): string {
  if (typeof item.label === 'string') return item.label;
  return (item.label as Record<string, string>)[locale] || '';
}

export default function SiteFooter({
  siteName,
  settings,
  navItems,
  locale,
}: {
  siteName: string;
  settings?: BuilderSiteSettings;
  navItems: BuilderNavItem[];
  locale: Locale;
}) {
  return (
    <footer style={{
      maxWidth: 1200,
      margin: '0 auto',
      padding: '40px 24px 24px',
      borderTop: '1px solid #e5e7eb',
      fontSize: '0.85rem',
      color: '#6b7280',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 32,
        marginBottom: 24,
      }}>
        {/* Column 1: Firm Info */}
        <div>
          <strong style={{ color: '#1f2937', fontSize: '1rem', display: 'block', marginBottom: 12 }}>
            {settings?.firmName || siteName}
          </strong>
          {settings?.address && <p style={{ margin: '4px 0' }}>{settings.address}</p>}
          {settings?.businessHours && <p style={{ margin: '4px 0' }}>영업시간: {settings.businessHours}</p>}
          {settings?.businessRegNumber && <p style={{ margin: '4px 0' }}>사업자등록: {settings.businessRegNumber}</p>}
        </div>

        {/* Column 2: Quick Links */}
        {navItems.length > 0 && (
          <div>
            <strong style={{ color: '#1f2937', display: 'block', marginBottom: 12 }}>바로가기</strong>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                style={{ display: 'block', color: '#6b7280', textDecoration: 'none', padding: '3px 0', transition: 'color 150ms' }}
              >
                {getLabel(item, locale)}
              </a>
            ))}
          </div>
        )}

        {/* Column 3: Contact */}
        <div>
          <strong style={{ color: '#1f2937', display: 'block', marginBottom: 12 }}>연락처</strong>
          {settings?.phone && <p style={{ margin: '4px 0' }}>Tel: {settings.phone}</p>}
          {settings?.email && (
            <p style={{ margin: '4px 0' }}>
              <a href={`mailto:${settings.email}`} style={{ color: '#116dff', textDecoration: 'none' }}>{settings.email}</a>
            </p>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid #f3f4f6',
        paddingTop: 16,
        textAlign: 'center',
        fontSize: '0.75rem',
        color: '#9ca3af',
      }}>
        © {new Date().getFullYear()} {settings?.firmName || siteName}. All rights reserved.
      </div>
    </footer>
  );
}
