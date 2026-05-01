'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/locales';
import type { BuilderNavItem, BuilderSiteSettings, BuilderTheme } from '@/lib/builder/site/types';
import { buildSitePagePath, comparableSitePath, normalizeSiteHref } from '@/lib/builder/site/paths';
import { resolveBrandLogo } from '@/lib/builder/site/theme';

function getLabel(item: BuilderNavItem, locale: Locale): string {
  if (typeof item.label === 'string') return item.label;
  return (item.label as Record<string, string>)[locale] || (item.label as Record<string, string>).ko || '';
}

export default function SiteHeader({
  siteName,
  settings,
  theme,
  navItems,
  locale,
  currentSlug,
  onNavigate,
}: {
  siteName: string;
  settings?: BuilderSiteSettings;
  theme?: BuilderTheme;
  navItems: BuilderNavItem[];
  locale: Locale;
  currentSlug: string;
  onNavigate?: (href: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const primaryColor = theme?.colors.primary || '#116dff';
  const textColor = theme?.colors.text || '#374151';
  const backgroundColor = theme?.colors.background || '#ffffff';
  const borderColor = theme?.colors.muted || '#e5e7eb';
  const headingFont = theme?.fonts.heading;
  const bodyFont = theme?.fonts.body;
  const currentPath = buildSitePagePath(locale, currentSlug);
  const logoLight = resolveBrandLogo({
    logoLight: settings?.logo,
    logoDark: settings?.logoDark,
    assets: settings?.assets,
  }, 'light');
  const logoDark = resolveBrandLogo({
    logoLight: settings?.logo,
    logoDark: settings?.logoDark,
    assets: settings?.assets,
  }, 'dark');
  const hasDarkLogo = Boolean(logoDark);

  const handleNavigate = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!onNavigate || /^(https?:|mailto:|tel:|#)/.test(href)) return;
    event.preventDefault();
    setMenuOpen(false);
    onNavigate(href);
  };

  return (
    <header style={{
      maxWidth: 1200,
      margin: '0 auto',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${borderColor}`,
      position: 'relative',
      fontFamily: bodyFont,
      color: textColor,
      background: backgroundColor,
      transition: 'background 200ms ease, color 200ms ease, border-color 200ms ease',
    }}>
      {/* Logo + Firm Name */}
      <a
        href={buildSitePagePath(locale, '')}
        onClick={(event) => handleNavigate(event, buildSitePagePath(locale, ''))}
        style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
      >
        {logoLight && (
          <img
            src={logoLight}
            alt={siteName}
            className="site-header-logo-light"
            data-has-dark-logo={hasDarkLogo ? 'true' : undefined}
            style={{ height: 32, width: 'auto' }}
          />
        )}
        {logoDark && (
          <img
            src={logoDark}
            alt={siteName}
            className="site-header-logo-dark"
            style={{ height: 32, width: 'auto', display: 'none' }}
          />
        )}
        <strong style={{ fontSize: '1.1rem', color: textColor, fontFamily: headingFont }}>{settings?.firmName || siteName}</strong>
      </a>

      {/* Desktop Nav */}
      <nav style={{ display: 'flex', gap: 24 }} className="site-header-desktop-nav">
        {navItems.map((item) => {
          const href = normalizeSiteHref(item.href, locale);
          const isActive = comparableSitePath(href, locale) === comparableSitePath(currentPath, locale);
          return (
            <a
              key={item.id}
              href={href}
              onClick={(event) => handleNavigate(event, href)}
              style={{
                color: isActive ? primaryColor : textColor,
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: isActive ? 700 : 500,
                borderBottom: isActive ? `2px solid ${primaryColor}` : '2px solid transparent',
                paddingBottom: 4,
                transition: 'color 150ms ease, border-color 150ms ease',
              }}
            >
              {getLabel(item, locale)}
            </a>
          );
        })}
      </nav>

      {/* Mobile Hamburger */}
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className="site-header-hamburger"
        aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          padding: 4,
          color: textColor,
        }}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="site-header-mobile-menu"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: backgroundColor,
            borderBottom: `1px solid ${borderColor}`,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            zIndex: 1000,
            animation: 'fadeIn 150ms ease',
            fontFamily: bodyFont,
          }}
        >
          {navItems.map((item) => {
            const href = normalizeSiteHref(item.href, locale);
            const isActive = comparableSitePath(href, locale) === comparableSitePath(currentPath, locale);
            return (
              <a
                key={item.id}
                href={href}
                onClick={(event) => handleNavigate(event, href)}
                style={{
                  color: isActive ? primaryColor : textColor,
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: isActive ? 700 : 500,
                  padding: '8px 0',
                  borderBottom: `1px solid ${borderColor}`,
                }}
              >
                {getLabel(item, locale)}
              </a>
            );
          })}
        </div>
      )}

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .site-header-desktop-nav { display: none !important; }
          .site-header-hamburger { display: block !important; }
        }
        html[data-theme='dark'] .site-header-logo-light[data-has-dark-logo='true'] {
          display: none !important;
        }
        html[data-theme='dark'] .site-header-logo-dark {
          display: block !important;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}
