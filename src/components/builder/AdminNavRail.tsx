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

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ADMIN_NAV_TREE,
  adminHref,
  findActiveItem,
  type AdminNavBadge,
  type AdminNavItem,
  type AdminNavTree,
} from '@/lib/builder/admin-nav/nav-config';

interface AdminNavRailProps {
  /** Override the nav tree (useful for tests / permission filtering). */
  tree?: AdminNavTree;
  /** Locale derived from URL — falls back to `ko`. */
  locale?: string;
}

const PATHNAME_REGEX = /^\/(ko|en|zh-hant)\/admin-builder(?:\/(.*))?$/;

const BADGE_STYLE: Record<AdminNavBadge, { background: string; color: string; label: string }> = {
  beta: { background: '#fde68a', color: '#92400e', label: 'BETA' },
  new: { background: '#bbf7d0', color: '#166534', label: 'NEW' },
};

export default function AdminNavRail({ tree = ADMIN_NAV_TREE, locale: localeProp }: AdminNavRailProps) {
  const pathname = usePathname() ?? '';
  const match = pathname.match(PATHNAME_REGEX);
  const locale = localeProp ?? match?.[1] ?? 'ko';
  const rest = match?.[2] ?? '';

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

  const railContent = (
    <nav
      data-builder-admin-nav-rail="true"
      aria-label="빌더 관리 내비게이션"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        padding: '18px 12px',
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
      <Link
        href={`/${locale}/admin-builder`}
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
        <span>편집기로 돌아가기</span>
      </Link>

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
            {section.heading}
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
          aria-label={drawerOpen ? '관리 메뉴 닫기' : '관리 메뉴 열기'}
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
          {drawerOpen ? '✕ 메뉴 닫기' : '☰ 관리 메뉴'}
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

function NavLink({ item, locale, active }: NavLinkProps) {
  const href = adminHref(locale, item.href);
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
        <span style={{ flex: 1 }}>{item.label}</span>
        {item.badge ? <Badge kind={item.badge} /> : null}
      </Link>
    </li>
  );
}

function Badge({ kind }: { kind: AdminNavBadge }) {
  const { background, color, label } = BADGE_STYLE[kind];
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