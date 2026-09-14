import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { notFound } from 'next/navigation';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import {
  DEFAULT_PORTFOLIO_CATEGORIES,
  filterProjectsByLocale,
  listProjects,
  sortProjects,
} from '@/lib/builder/portfolio/portfolio-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';
import PortfolioAdminClient from '@/components/builder/portfolio/PortfolioAdminClient';

export const dynamic = 'force-dynamic';

export default async function PortfolioAdminPage(props: { params: Promise<{ locale: Locale }> }) {
  const request = new NextRequest('http://builder.internal/admin-builder', {
    headers: new Headers(await headers()),
  });
  const access = await guardBuilderReadWithPermission(request, 'edit-pages');
  if (access instanceof NextResponse) notFound();

  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const site = await readSiteDocument(DEFAULT_BUILDER_SITE_ID, locale);
  const projects = sortProjects(filterProjectsByLocale(await listProjects(), locale), 'order-asc');

  return (
    <PortfolioAdminClient
      locale={locale}
      siteTitle={site.name}
      initialProjects={projects}
      categories={DEFAULT_PORTFOLIO_CATEGORIES}
    />
  );
}
