'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/locales';
import type { BuilderNavItem, BuilderSiteSettings } from '@/lib/builder/site/types';

function getLabel(item: BuilderNavItem, locale: Locale): string {
  if (typeof item.label === 'string') return item.label;
  return (item.label as Record<string, string>)[locale] || (item.label as Record<string, string>).ko || '';
}

export default function SiteHeader({
  siteName,
  settings,
  navItems,
  locale,
  currentSlug,
}: {
  siteName: string;
  settings?: BuilderSiteSettings;
  navItems: BuilderNavItem[];
  locale: Locale;
  currentSlug: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{
      maxWidth: 1200,
      margin: '0 auto',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #e5e7eb',
      position: 'relative',
    }}>
      {/* Logo + Firm Name */}
      <a href={`/${locale}/p/`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        {settings?.logo && (
          <img src={settings.logo} alt={siteName} style={{ height: 32, width: 'auto' }} />
        )}
        <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>{settings?.firmName || siteName}</strong>
      </a>

      {/* Desktop Nav */}
      <nav style={{ display: 'flex', gap: 24 }} className="site-header-desktop-nav">
        {navItems.map((item) => {
          const isActive = item.href === `/${locale}/p/${currentSlug}` || (currentSlug === '' && item.href === '/');
          return (
            <a
              key={item.id}
              href={item.href}
              style={{
                color: isActive ? '#116dff' : '#374151',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: isActive ? 700 : 500,
                borderBottom: isActive ? '2px solid #116dff' : '2px solid transparent',
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
          color: '#374151',
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
            background: '#fff',
            borderBottom: '1px solid #e5e7eb',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            zIndex: 1000,
            animation: 'fadeIn 150ms ease',
          }}
        >
          {navItems.map((item) => {
            const isActive = item.href === `/${locale}/p/${currentSlug}` || (currentSlug === '' && item.href === '/');
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  color: isActive ? '#116dff' : '#374151',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: isActive ? 700 : 500,
                  padding: '8px 0',
                  borderBottom: '1px solid #f3f4f6',
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}
