'use client';

/**
 * M175 — Unified admin sidebar rail.
 *
 * Renders the navigation tree from `nav-config.ts` and highlights the
 * active entry based on the current pathname. The rail is hidden on the
 * admin-builder root (`/<locale>/admin-builder`) so the editor canvas
 * keeps full bleed.
 *
 * Mobile: below 900px the rail collapses to a top hamburger button that
 * toggles an off-canvas drawer.
 *
 * Inline styles match the existing builder admin look (no Tailwind, no
 * CSS modules per the codebase pattern).
 */

import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ADMIN_NAV_TREE,
  adminHref,
  findActiveItem,
  type AdminNavItem,
  type AdminNavTree,
} from '@/lib/builder/admin-nav/nav-config';
import {
  getAdminNavCopy,
  getAdminNavItemLabel,
  getAdminNavSectionLabel,
} from '@/lib/builder/admin-nav/nav-copy';

interface AdminNavRailProps {
  /** Override the nav tree (useful for tests / permission filtering). */
  tree?: AdminNavTree;
  /** Locale derived from URL — falls back to `ko`. */
  locale?: string;
}

const PATHNAME_REGEX = /^\/(ko|en|zh-hant)\/admin-builder(?:\/(.*))?$/;

export default function AdminNavRail({ tree = ADMIN_NAV_TREE, locale: localeProp }: AdminNavRailProps) {
  const pathname = usePathname() ?? '';
  const match = pathname.match(PATHNAME_REGEX);
  const locale = localeProp ?? match?.[1] ?? 'ko';
  const rest = match?.[2] ?? '';
  const copy = getAdminNavCopy(locale);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 899px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const activeItem = useMemo(() => findActiveItem(tree, locale, pathname), [tree, locale, pathname]);

  // Hide rail entirely on the admin-builder root (editor canvas keeps full bleed).
  if (!match || rest === '') return null;

  const editorHref = `/${locale}/admin-builder`;
  const railContent = (
    <nav
      data-builder-admin-nav-rail="true"
      aria-label={copy.ariaLabel}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        padding: isMobile ? '64px 12px 18px' : '18px 12px',
        minWidth: 220,
        width: 220,
        background: '#0f172a',
        color: '#e2e8f0',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}
    >
      <a
        href={editorHref}
        data-builder-admin-rail-back="true"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          borderRadius: 8,
          background: '#1e293b',
          color: '#f8fafc',
          fontSize: 13,
          fontWeight: 700,
          textDecoration: 'none',
        }}
      >
        <span aria-hidden style={{ fontSize: 14 }}>←</span>
        <span>{copy.backLabel}</span>
      </a>

      {tree.sections.map((section) => (
        <div key={section.heading} data-builder-admin-rail-section={section.heading}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.6,
              textTransform: 'uppercase',
              color: '#94a3b8',
              padding: '4px 10px',
              marginBottom: 4,
            }}
          >
            {getAdminNavSectionLabel(locale, section.heading)}
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {section.items.map((item) => (
              <NavLink key={`${section.heading}:${item.href}`} item={item} locale={locale} active={activeItem === item} />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );

  if (isMobile) {
    return (
      <>
        <button
          type="button"
          aria-expanded={drawerOpen}
          aria-label={drawerOpen ? copy.closeMenuLabel : copy.openMenuLabel}
          data-builder-admin-rail-toggle="true"
          onClick={() => setDrawerOpen((open) => !open)}
          style={{
            position: 'fixed',
            top: 12,
            left: 12,
            zIndex: 10600,
            border: 0,
            borderRadius: 999,
            padding: '10px 14px',
            background: '#0f172a',
            color: '#f8fafc',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.35)',
          }}
        >
          {drawerOpen ? copy.closeMenuButton : copy.openMenuButton}
        </button>
        {drawerOpen ? (
          <div
            data-builder-admin-rail-drawer="true"
            onClick={() => setDrawerOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10500,
              background: 'rgba(15, 23, 42, 0.55)',
              display: 'flex',
            }}
          >
            <div onClick={(event) => event.stopPropagation()}>{railContent}</div>
          </div>
        ) : null}
      </>
    );
  }

  return railContent;
}

interface NavLinkProps {
  item: AdminNavItem;
  locale: string;
  active: boolean;
}

function Badge({ kind, locale }: { kind: 'beta' | 'new'; locale: string }) {
  const copy = getAdminNavCopy(locale);
  const background = kind === 'beta' ? '#fde68a' : '#bbf7d0';
  const color = kind === 'beta' ? '#92400e' : '#166534';
  const label = kind === 'beta' ? copy.betaBadge : copy.newBadge;
  return (
    <span
      style={{
        background,
        color,
        fontSize: 9,
        fontWeight: 800,
        padding: '2px 6px',
        borderRadius: 999,
        letterSpacing: 0.5,
      }}
    >
      {label}
    </span>
  );
}

function NavLink({ item, locale, active }: NavLinkProps) {
  const href = adminHref(locale, item.href);
  const label = getAdminNavItemLabel(locale, item.label);
  return (
    <li>
      <Link
        href={href}
        data-builder-admin-rail-link={item.href || 'root'}
        data-active={active ? 'true' : 'false'}
        aria-current={active ? 'page' : undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 10px',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: active ? 700 : 500,
          textDecoration: 'none',
          background: active ? '#2563eb' : 'transparent',
          color: active ? '#ffffff' : '#cbd5e1',
        }}
      >
        {item.icon ? (
          <span aria-hidden style={{ fontSize: 14, width: 18, textAlign: 'center' }}>
            {item.icon}
          </span>
        ) : null}
        <span style={{ flex: 1 }}>{label}</span>
        {item.badge ? <Badge kind={item.badge} locale={locale} /> : null}
      </Link>
    </li>
  );
}
