import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { Locale } from '@/lib/locales';
import {
  publicUnavailableCopy,
  type PublicUnavailableModuleKind,
} from '@/components/PublicUnavailableState';

const storage = vi.hoisted(() => {
  const failSync = (name: string) => vi.fn(() => {
    throw new Error(`${name} should not run for JA public module routes`);
  });
  const failAsync = (name: string) => vi.fn(async () => {
    throw new Error(`${name} should not run for JA public module routes`);
  });
  return {
    listEvents: failAsync('listEvents'),
    findEventBySlug: failAsync('findEventBySlug'),
    filterEventsByLocale: failSync('filterEventsByLocale'),
    filterEventsByStatus: failSync('filterEventsByStatus'),
    filterEventsByTime: failSync('filterEventsByTime'),
    sortEvents: failSync('sortEvents'),
    listProjects: failAsync('listProjects'),
    findProjectBySlug: failAsync('findProjectBySlug'),
    filterProjectsByCategory: failSync('filterProjectsByCategory'),
    filterProjectsByLocale: failSync('filterProjectsByLocale'),
    filterProjectsByStatus: failSync('filterProjectsByStatus'),
    sortProjects: failSync('sortProjects'),
    categoryLabel: failSync('categoryLabel'),
    listProducts: failAsync('listProducts'),
    findProductBySlug: failAsync('findProductBySlug'),
    listProductCategories: failAsync('listProductCategories'),
    findProductCategoryBySlug: failAsync('findProductCategoryBySlug'),
    listActiveProductsForCategory: failAsync('listActiveProductsForCategory'),
    filterProductsByLocale: failSync('filterProductsByLocale'),
    filterProductsByStatus: failSync('filterProductsByStatus'),
    sortProducts: failSync('sortProducts'),
    getCurrentSiteMember: failAsync('getCurrentSiteMember'),
    getMemberPortalEmails: failSync('getMemberPortalEmails'),
    listCustomerBillingDocuments: failAsync('listCustomerBillingDocuments'),
  };
});

vi.mock('@/lib/builder/events/events-engine', () => ({
  DEFAULT_EVENT_CATEGORIES: [],
  listEvents: storage.listEvents,
  findEventBySlug: storage.findEventBySlug,
  filterEventsByLocale: storage.filterEventsByLocale,
  filterEventsByStatus: storage.filterEventsByStatus,
  filterEventsByTime: storage.filterEventsByTime,
  sortEvents: storage.sortEvents,
}));

vi.mock('@/lib/builder/portfolio/portfolio-engine', () => ({
  DEFAULT_PORTFOLIO_CATEGORIES: [],
  listProjects: storage.listProjects,
  findProjectBySlug: storage.findProjectBySlug,
  filterProjectsByCategory: storage.filterProjectsByCategory,
  filterProjectsByLocale: storage.filterProjectsByLocale,
  filterProjectsByStatus: storage.filterProjectsByStatus,
  sortProjects: storage.sortProjects,
  categoryLabel: storage.categoryLabel,
}));

vi.mock('@/lib/builder/commerce/products-engine', () => ({
  listProducts: storage.listProducts,
  findProductBySlug: storage.findProductBySlug,
  listProductCategories: storage.listProductCategories,
  findProductCategoryBySlug: storage.findProductCategoryBySlug,
  listActiveProductsForCategory: storage.listActiveProductsForCategory,
  filterProductsByLocale: storage.filterProductsByLocale,
  filterProductsByStatus: storage.filterProductsByStatus,
  sortProducts: storage.sortProducts,
}));

vi.mock('@/lib/builder/members/current-member', () => ({
  getCurrentSiteMember: storage.getCurrentSiteMember,
}));

vi.mock('@/lib/builder/members/members-engine', () => ({
  getMemberPortalEmails: storage.getMemberPortalEmails,
}));

vi.mock('@/lib/builder/billing-customer-portal', () => ({
  listCustomerBillingDocuments: storage.listCustomerBillingDocuments,
}));

vi.mock('@/lib/builder/components/eventRsvp/Element', () => ({
  default: function EventRsvpElement() {
    throw new Error('EventRsvpElement should not render for JA');
  },
}));

vi.mock('@/components/builder/commerce/PublicStorefront', () => ({
  default: function PublicStorefront() {
    throw new Error('PublicStorefront should not render for JA');
  },
}));

vi.mock('@/components/builder/commerce/PublicProductDetail', () => ({
  default: function PublicProductDetail() {
    throw new Error('PublicProductDetail should not render for JA');
  },
}));

vi.mock('@/components/builder/commerce/PublicCheckout', () => ({
  default: function PublicCheckout() {
    throw new Error('PublicCheckout should not render for JA');
  },
}));

vi.mock('@/components/members/BillingPortalView', () => ({
  BillingPortalView: function BillingPortalView() {
    throw new Error('BillingPortalView should not render for JA');
  },
}));

vi.mock('@/components/builder/bookings/BookingManageClient', () => ({
  default: function BookingManageClient() {
    throw new Error('BookingManageClient should not render for JA');
  },
}));

vi.mock('@/components/JsonLd', () => ({
  default: function JsonLd() {
    throw new Error('JsonLd should not render for JA');
  },
}));

vi.mock('@/components/Breadcrumbs', () => ({
  default: function Breadcrumbs() {
    return null;
  },
}));

vi.mock('@/components/SectionLabel', () => ({
  default: function SectionLabel({ children }: { children?: ReactNode }) {
    return <p>{children}</p>;
  },
}));

vi.mock('@/components/OrnamentDivider', () => ({
  default: function OrnamentDivider() {
    return null;
  },
}));

import EventsPage, { generateMetadata as eventsMetadata } from '@/app/[locale]/events/page';
import EventDetailPage, { generateMetadata as eventDetailMetadata } from '@/app/[locale]/events/[slug]/page';
import PortfolioPage, { generateMetadata as portfolioMetadata } from '@/app/[locale]/portfolio/page';
import PortfolioDetailPage, { generateMetadata as portfolioDetailMetadata } from '@/app/[locale]/portfolio/[slug]/page';
import StorePage, { generateMetadata as storeMetadata } from '@/app/[locale]/store/page';
import StoreProductPage, { generateMetadata as storeProductMetadata } from '@/app/[locale]/store/products/[slug]/page';
import StoreCategoryPage, { generateMetadata as storeCategoryMetadata } from '@/app/[locale]/store/categories/[slug]/page';
import StoreCheckoutPage, { generateMetadata as storeCheckoutMetadata } from '@/app/[locale]/store/checkout/page';
import LocalizedCustomerBillingPortalPage, {
  generateMetadata as billingMetadata,
} from '@/app/[locale]/account/billing/page';
import BookingManagePage, { generateMetadata as bookingMetadata } from '@/app/[locale]/bookings/manage/[token]/page';

type RouteCase = {
  name: string;
  kind: PublicUnavailableModuleKind;
  extra: Record<string, string>;
  searchParams?: Promise<{ category?: string }>;
  page: (props: {
    params: Promise<{ locale: Locale; slug: string; token: string }>;
    searchParams?: Promise<{ category?: string }>;
  }) => Promise<JSX.Element> | JSX.Element;
  metadata: (props: {
    params: Promise<{ locale: Locale; slug: string; token: string }>;
  }) => Promise<Metadata>;
};

const hiddenValues = {
  eventSlug: 'ko-only-event-slug',
  portfolioSlug: 'ko-only-portfolio-slug',
  productSlug: 'taiwan-startup-guide',
  categorySlug: 'digital-guides',
  bookingToken: 'secret-booking-token',
  portfolioCategory: 'should-not-appear-category',
};

const routes: RouteCase[] = [
  { name: 'events list', kind: 'events', extra: {}, page: EventsPage, metadata: eventsMetadata },
  {
    name: 'event detail',
    kind: 'events',
    extra: { slug: hiddenValues.eventSlug },
    page: EventDetailPage,
    metadata: eventDetailMetadata,
  },
  {
    name: 'portfolio list',
    kind: 'portfolio',
    extra: {},
    searchParams: Promise.resolve({ category: hiddenValues.portfolioCategory }),
    page: PortfolioPage,
    metadata: portfolioMetadata,
  },
  {
    name: 'portfolio detail',
    kind: 'portfolio',
    extra: { slug: hiddenValues.portfolioSlug },
    page: PortfolioDetailPage,
    metadata: portfolioDetailMetadata,
  },
  { name: 'store list', kind: 'store', extra: {}, page: StorePage, metadata: storeMetadata },
  {
    name: 'store product',
    kind: 'store',
    extra: { slug: hiddenValues.productSlug },
    page: StoreProductPage,
    metadata: storeProductMetadata,
  },
  {
    name: 'store category',
    kind: 'store',
    extra: { slug: hiddenValues.categorySlug },
    page: StoreCategoryPage,
    metadata: storeCategoryMetadata,
  },
  { name: 'store checkout', kind: 'checkout', extra: {}, page: StoreCheckoutPage, metadata: storeCheckoutMetadata },
  {
    name: 'account billing',
    kind: 'billing',
    extra: {},
    page: LocalizedCustomerBillingPortalPage,
    metadata: billingMetadata,
  },
  {
    name: 'booking manage',
    kind: 'booking',
    extra: { token: hiddenValues.bookingToken },
    page: BookingManagePage,
    metadata: bookingMetadata,
  },
];

const storageReads = [
  storage.listEvents,
  storage.findEventBySlug,
  storage.listProjects,
  storage.findProjectBySlug,
  storage.listProducts,
  storage.findProductBySlug,
  storage.listProductCategories,
  storage.findProductCategoryBySlug,
  storage.listActiveProductsForCategory,
  storage.getCurrentSiteMember,
  storage.getMemberPortalEmails,
  storage.listCustomerBillingDocuments,
];

function assertJaUnavailable(
  html: string,
  metadata: Metadata,
  kind: PublicUnavailableModuleKind,
  hidden: string[] = [],
) {
  const copy = publicUnavailableCopy('ja', kind);
  expect(html).toContain('<h1');
  expect(html).toContain(copy.title);
  expect(html).toContain(copy.description);
  expect(html).toContain('href="/ja"');
  expect(html).toContain('href="/ja/contact"');
  expect(html).toContain(copy.home);
  expect(html).toContain(copy.contact);
  expect(html).toContain(`data-public-unavailable="${kind}"`);
  expect(html).not.toMatch(/\p{Script=Hangul}/u);
  expect(html).not.toMatch(/\bcart\b/i);
  expect(html).not.toMatch(/\bprice\b/i);
  expect(html).not.toMatch(/\bcustomer\b/i);
  expect(html).not.toMatch(/\btoken\b/i);
  expect(html).not.toContain('カート');
  expect(html).not.toContain('価格');
  expect(html).not.toContain('顧客');
  expect(html).not.toContain('<main');
  for (const value of hidden) {
    expect(html).not.toContain(value);
  }

  expect(metadata.title).toBe(copy.title);
  expect(metadata.description).toBe(copy.description);
  expect(metadata.robots).toEqual({ index: false, follow: true });
  expect(metadata.alternates).toBeUndefined();
  const metaText = JSON.stringify(metadata);
  expect(metaText).not.toMatch(/\p{Script=Hangul}/u);
  expect(metaText).not.toContain('/ko/');
  expect(metaText.toLowerCase()).not.toContain('canonical');
  for (const value of hidden) {
    expect(metaText).not.toContain(value);
  }
}

describe('JA public module unavailable routes', () => {
  it.each(routes)('$name renders honest Japanese unavailable UI and metadata without storage reads', async (route) => {
    const params = Promise.resolve({ locale: 'ja' as Locale, slug: hiddenValues.productSlug, token: hiddenValues.bookingToken, ...route.extra });
    const metadata = await route.metadata({ params });
    const html = renderToStaticMarkup(await route.page({
      params,
      searchParams: route.searchParams,
    }));
    const hidden = Object.values(route.extra);
    if (route.searchParams) hidden.push(hiddenValues.portfolioCategory);
    assertJaUnavailable(html, metadata, route.kind, hidden);
    for (const read of storageReads) {
      expect(read).not.toHaveBeenCalled();
    }
  });
});
