'use client';

/**
 * M175 — Derives a breadcrumb trail from the current pathname.
 *
 * `/ko/admin-builder/cms/collections/insights` →
 *   빌더 → CMS → Collections → insights
 *
 * Lookup table maps known admin segments to their localized labels so we
 * don't show ugly slugs in the breadcrumb. Unknown segments fall through
 * with their raw text.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getAdminBreadcrumbLabel } from '@/lib/builder/admin-nav/nav-copy';

interface Crumb {
  label: string;
  href: string | null;
}

function labelFor(locale: string, segment: string): string {
  return getAdminBreadcrumbLabel(locale, segment);
}

export function buildAdminBreadcrumb(pathname: string): Crumb[] {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return [];
  const [locale, ...rest] = parts;
  if (!/^(ko|en|zh-hant)$/.test(locale)) return [];
  if (rest.length === 0 || rest[0] !== 'admin-builder') return [];

  const crumbs: Crumb[] = [];
  let acc = `/${locale}`;
  for (let i = 0; i < rest.length; i += 1) {
    const segment = rest[i];
    acc += `/${segment}`;
    const isLast = i === rest.length - 1;
    crumbs.push({ label: labelFor(locale, segment), href: isLast ? null : acc });
  }
  return crumbs;
}

export default function AdminBreadcrumb() {
  const pathname = usePathname() ?? '';
  const crumbs = buildAdminBreadcrumb(pathname);
  if (crumbs.length <= 1) return null;

  return (
    <nav
      data-builder-admin-breadcrumb="true"
      aria-label="Breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
        padding: '10px 16px',
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        fontSize: 12,
        color: '#475569',
      }}
    >
      {crumbs.map((crumb, index) => (
        <span key={`${crumb.label}-${index}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {index > 0 ? (
            <span aria-hidden style={{ color: '#94a3b8' }}>
              ›
            </span>
          ) : null}
          {crumb.href ? (
            <Link href={crumb.href} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
              {crumb.label}
            </Link>
          ) : (
            <span style={{ color: '#0f172a', fontWeight: 700 }}>{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
