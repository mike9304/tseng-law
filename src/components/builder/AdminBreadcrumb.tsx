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

const SEGMENT_LABEL: Record<string, string> = {
  'admin-builder': '빌더',
  cms: 'CMS',
  collections: 'Collections',
  records: 'Records',
  apps: 'Apps',
  commerce: 'Commerce',
  bookings: 'Bookings',
  crm: 'CRM',
  translations: 'Translations',
  workspace: 'Workspace',
  ops: 'Ops',
  '_dev': 'Dev',
  '%5Fdev': 'Dev',
  functions: 'Functions',
  logs: 'Logs',
  sdk: 'SDK',
  secrets: 'Secrets',
  webhooks: 'Webhooks',
  members: 'Members',
  domains: 'Domains',
  backups: 'Backups',
  migrations: 'Migrations',
  marketing: 'Marketing',
  forms: 'Forms',
  'forms-flow': 'Forms · Flow',
  events: 'Events',
  faq: 'FAQ',
  portfolio: 'Portfolio',
  columns: 'Columns',
  search: 'Search',
  seo: 'SEO',
  errors: 'Errors',
  experiments: 'Experiments',
  inbox: 'Inbox',
  sandbox: 'Sandbox',
  lightboxes: 'Lightboxes',
  footer: 'Footer',
  header: 'Header',
  'ai-generator': 'AI Generator',
  'custom-code': 'Custom Code',
};

interface Crumb {
  label: string;
  href: string | null;
}

function labelFor(segment: string): string {
  return SEGMENT_LABEL[segment] ?? decodeURIComponent(segment);
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
    crumbs.push({ label: labelFor(segment), href: isLast ? null : acc });
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