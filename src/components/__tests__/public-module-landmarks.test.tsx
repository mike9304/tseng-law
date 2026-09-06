import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CommerceProduct } from '@/lib/builder/commerce/products-shared';
import type { BuilderEvent } from '@/lib/builder/events/events-shared';
import type { PortfolioProject } from '@/lib/builder/portfolio/portfolio-shared';
import { locales, siteLocales, type Locale, type SiteLocale } from '@/lib/locales';

const { listEvents, findEventBySlug, listProjects, findProjectBySlug, currentMember, billingDocuments } = vi.hoisted(() => ({
  listEvents: vi.fn(), findEventBySlug: vi.fn(), listProjects: vi.fn(),
  findProjectBySlug: vi.fn(), currentMember: vi.fn(), billingDocuments: vi.fn(),
}));

vi.mock('next/navigation', async (importOriginal) => ({
  ...await importOriginal<typeof import('next/navigation')>(),
  usePathname: () => '/en/events',
}));
vi.mock('@/lib/builder/events/events-engine', async (importOriginal) => ({
  ...await importOriginal<typeof import('@/lib/builder/events/events-engine')>(),
  listEvents, findEventBySlug,
}));
vi.mock('@/lib/builder/portfolio/portfolio-engine', async (importOriginal) => ({
  ...await importOriginal<typeof import('@/lib/builder/portfolio/portfolio-engine')>(),
  listProjects, findProjectBySlug,
}));
vi.mock('@/lib/builder/members/current-member', () => ({ getCurrentSiteMember: currentMember }));
vi.mock('@/lib/builder/billing-customer-portal', async (importOriginal) => ({
  ...await importOriginal<typeof import('@/lib/builder/billing-customer-portal')>(),
  listCustomerBillingDocuments: billingDocuments,
}));

import CinematicRouteShell from '@/components/CinematicRouteShell';
import MemberAuthClient from '@/components/members/MemberAuthClient';
import { BillingPortalView } from '@/components/members/BillingPortalView';
import PublicStorefront from '@/components/builder/commerce/PublicStorefront';
import PublicProductDetail from '@/components/builder/commerce/PublicProductDetail';
import PublicCheckout from '@/components/builder/commerce/PublicCheckout';
import EventsPage from '@/app/[locale]/events/page';
import EventDetailPage from '@/app/[locale]/events/[slug]/page';
import PortfolioPage from '@/app/[locale]/portfolio/page';
import PortfolioDetailPage from '@/app/[locale]/portfolio/[slug]/page';
import LocalizedBillingPage from '@/app/[locale]/account/billing/page';
import StandaloneBillingPage from '@/app/(public)/account/billing/page';

function renderPublic(node: ReactNode, locale: SiteLocale = 'en') {
  return renderToStaticMarkup(
    <CinematicRouteShell locale={locale} header={null} footer={null} scrollTop={null}>
      {node}
    </CinematicRouteShell>,
  );
}

function expectPublicLandmark(html: string, attribute: string) {
  expect(html.match(/<main\b/g)).toHaveLength(1);
  expect(html).toContain('<main id="main">');
  expect(html).toMatch(new RegExp(`<section\\b[^>]*${attribute}`));
  expect(html).toContain('<h1');
}

function product(locale: Locale): CommerceProduct {
  return {
    productId: 'landmark-product', locale, slug: 'landmark-product', title: 'Landmark product',
    description: 'Synthetic product description', body: 'Synthetic product details', status: 'active',
    sku: 'LANDMARK', priceCents: 10000, currency: 'TWD',
    inventory: { trackInventory: false, quantity: 0, lowStockThreshold: 0, allowBackorder: false },
    media: [], options: [], variants: [], categoryIds: [], tags: [], seo: {},
    createdAt: '2026-09-06T00:00:00.000Z', updatedAt: '2026-09-06T00:00:00.000Z',
  };
}

function event(locale: Locale): BuilderEvent {
  return {
    eventId: 'landmark-event', slug: 'landmark-event', title: 'Landmark event',
    description: 'Synthetic event description', date: '2099-01-01', time: '10:00', location: 'Online',
    capacity: 10, registeredCount: 0, category: 'seminar', locale, status: 'published',
    rsvpEnabled: true, ticketType: 'free', ticketPriceTwd: 0, ticketCurrency: 'TWD',
    createdAt: '2026-09-06T00:00:00.000Z', updatedAt: '2026-09-06T00:00:00.000Z',
  };
}

function project(locale: Locale): PortfolioProject {
  return {
    projectId: 'landmark-project', slug: 'landmark-project', title: 'Landmark project',
    summary: 'Synthetic summary', description: 'Synthetic description', body: 'Synthetic body',
    category: 'company-setup', completedAt: '2026-09-06', tags: [], locale, status: 'published',
    featured: false, order: 1, gallery: [],
    createdAt: '2026-09-06T00:00:00.000Z', updatedAt: '2026-09-06T00:00:00.000Z',
  };
}

describe('public module main landmarks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentMember.mockResolvedValue(null);
    billingDocuments.mockResolvedValue([]);
  });

  it.each(siteLocales)('keeps one public main around the native %s login form', (locale) => {
    const html = renderPublic(<MemberAuthClient locale={locale} nextPath={`/${locale}/account`} />, locale);
    expectPublicLandmark(html, 'data-member-login-page');
    expect(html).toContain('data-public-signup-enabled="false"');
    expect(html).toContain('autoComplete="current-password"');
  });

  it.each(locales)('keeps one main for %s storefront, product, and checkout roots', (locale) => {
    for (const products of [[], [product(locale)]]) {
      const html = renderPublic(
        <PublicStorefront locale={locale} title="Store" description="Store description" eyebrow="Store" products={products} categories={[]} />,
        locale,
      );
      expectPublicLandmark(html, 'data-commerce-storefront');
      expect(html).toContain('data-commerce-category-route="all"');
    }
    const detail = renderPublic(<PublicProductDetail locale={locale} product={product(locale)} categories={[]} relatedProducts={[]} />, locale);
    expectPublicLandmark(detail, 'data-commerce-product-detail');
    expect(detail).toContain('data-commerce-product-slug="landmark-product"');
    const checkout = renderPublic(<PublicCheckout locale={locale} />, locale);
    expectPublicLandmark(checkout, 'data-commerce-checkout');
    expect(checkout).toContain('data-commerce-checkout-recovery-state="idle"');
  });

  it.each(locales)('keeps one main for %s populated and empty event/portfolio pages', async (locale) => {
    const params = Promise.resolve({ locale });
    for (const populated of [false, true]) {
      listEvents.mockResolvedValue(populated ? [event(locale)] : []);
      listProjects.mockResolvedValue(populated ? [project(locale)] : []);
      const events = renderPublic(await EventsPage({ params }), locale);
      const portfolio = renderPublic(await PortfolioPage({ params }), locale);
      expectPublicLandmark(events, 'data-public-events-page');
      expectPublicLandmark(portfolio, 'data-public-portfolio-page');
      if (populated) {
        expect(events).toContain(`href="/${locale}/events/landmark-event"`);
        expect(portfolio).toContain(`href="/${locale}/portfolio/landmark-project"`);
      }
    }
    findEventBySlug.mockResolvedValue(event(locale));
    findProjectBySlug.mockResolvedValue(project(locale));
    const eventDetail = renderPublic(await EventDetailPage({ params: Promise.resolve({ locale, slug: 'landmark-event' }) }), locale);
    const portfolioDetail = renderPublic(await PortfolioDetailPage({ params: Promise.resolve({ locale, slug: 'landmark-project' }) }), locale);
    expectPublicLandmark(eventDetail, 'data-public-event-detail');
    expectPublicLandmark(portfolioDetail, 'data-public-portfolio-detail');
    expect(eventDetail).toContain(`href="/${locale}/events"`);
    expect(portfolioDetail).toContain(`href="/${locale}/portfolio"`);
  });

  it.each([true, false])('preserves standalone billing and demotes localized billing (signedOut=%s)', async (signedOut) => {
    for (const locale of locales) {
      currentMember.mockResolvedValue(signedOut ? null : { email: 'member@example.test', locale });
      const expectedState = signedOut ? 'signed-out' : 'signed-in';
      const standalone = renderToStaticMarkup(await StandaloneBillingPage());
      expect(standalone.match(/<main\b/g)).toHaveLength(1);
      expect(standalone).toContain(`data-billing-portal-state="${expectedState}"`);
      const localized = renderPublic(await LocalizedBillingPage({ params: Promise.resolve({ locale }) }), locale);
      expectPublicLandmark(localized, 'data-billing-portal-state');
      expect(localized).toContain(`data-billing-portal-state="${expectedState}"`);
      const isolated = renderToStaticMarkup(<BillingPortalView locale={locale} documents={[]} signedOut={signedOut} />);
      expect(isolated.match(/<main\b/g)).toHaveLength(1);
    }
  });
});
