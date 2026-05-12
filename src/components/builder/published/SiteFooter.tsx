import type { BuilderNavItem, BuilderSiteSettings, BuilderTheme } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';
import { normalizeSiteHref } from '@/lib/builder/site/paths';
import { filterNavigationForLocale } from '@/lib/builder/site/navigation';

function getLabel(item: BuilderNavItem, locale: Locale): string {
  if (typeof item.label === 'string') return item.label;
  return (item.label as Record<string, string>)[locale] || (item.label as Record<string, string>).ko || '';
}

export default function SiteFooter({
  siteName,
  settings,
  theme,
  navItems,
  locale,
}: {
  siteName: string;
  settings?: BuilderSiteSettings;
  theme?: BuilderTheme;
  navItems: BuilderNavItem[];
  locale: Locale;
}) {
  const primaryColor = theme?.colors.primary || '#116dff';
  const textColor = theme?.colors.text || '#1f2937';
  const secondaryColor = theme?.colors.secondary || '#6b7280';
  const backgroundColor = theme?.colors.background || '#ffffff';
  const mutedColor = theme?.colors.muted || '#f3f4f6';
  const bodyFont = theme?.fonts.body;
  const headingFont = theme?.fonts.heading;
  const visibleNavItems = filterNavigationForLocale(navItems, locale);

  return (
    <footer style={{
      maxWidth: 1200,
      margin: '0 auto',
      padding: '40px 24px 24px',
      borderTop: `1px solid ${mutedColor}`,
      fontSize: '0.85rem',
      color: secondaryColor,
      fontFamily: bodyFont,
      background: backgroundColor,
      transition: 'background 200ms ease, color 200ms ease, border-color 200ms ease',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 32,
        marginBottom: 24,
      }}>
        {/* Column 1: Firm Info */}
        <div>
          <strong style={{ color: textColor, fontSize: '1rem', display: 'block', marginBottom: 12, fontFamily: headingFont }}>
            {settings?.firmName || siteName}
          </strong>
          {settings?.address && <p style={{ margin: '4px 0' }}>{settings.address}</p>}
          {settings?.businessHours && <p style={{ margin: '4px 0' }}>영업시간: {settings.businessHours}</p>}
          {settings?.businessRegNumber && <p style={{ margin: '4px 0' }}>사업자등록: {settings.businessRegNumber}</p>}
        </div>

        {/* Column 2: Quick Links */}
        {visibleNavItems.length > 0 && (
          <div>
            <strong style={{ color: textColor, display: 'block', marginBottom: 12, fontFamily: headingFont }}>바로가기</strong>
            {visibleNavItems.map((item) => (
              <a
                key={item.id}
                href={normalizeSiteHref(item.href, locale)}
                style={{ display: 'block', color: secondaryColor, textDecoration: 'none', padding: '3px 0', transition: 'color 150ms' }}
              >
                {getLabel(item, locale)}
              </a>
            ))}
          </div>
        )}

        {/* Column 3: Contact */}
        <div>
          <strong style={{ color: textColor, display: 'block', marginBottom: 12, fontFamily: headingFont }}>연락처</strong>
          {settings?.phone && <p style={{ margin: '4px 0' }}>Tel: {settings.phone}</p>}
          {settings?.email && (
            <p style={{ margin: '4px 0' }}>
              <a href={`mailto:${settings.email}`} style={{ color: primaryColor, textDecoration: 'none' }}>{settings.email}</a>
            </p>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: `1px solid ${mutedColor}`,
        paddingTop: 16,
        textAlign: 'center',
        fontSize: '0.75rem',
        color: secondaryColor,
      }}>
        © {new Date().getFullYear()} {settings?.firmName || siteName}. All rights reserved.
      </div>
    </footer>
  );
}
