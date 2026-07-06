import { defaultLocale } from '@/lib/locales';
import { listOrders } from '@/lib/builder/commerce/orders-engine';
import { listBookings, listServices } from '@/lib/builder/bookings/storage';
import {
  buildPaymentAnalytics,
  type PaymentAnalyticsSummary,
} from '@/lib/builder/payment-analytics';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { summarizeSharedAssets, type SharedAssetSummary } from './shared-assets';
import { listMembers, listWorkspaceSites } from './workspace-store';

export interface WorkspaceOperationalAnalytics {
  siteCount: number;
  memberCount: number;
  sharedAssetCount: number;
  sharedAssetBytes: number;
  cmsCollectionCount: number;
  cmsRecordCount: number;
  latestCmsUpdatedAt: string | null;
  latestSharedAssetUploadedAt: string | null;
}

export interface WorkspaceAnalyticsSitePayload {
  siteId: string;
  siteName: string;
  payment: PaymentAnalyticsSummary;
  orderCount: number;
  bookingCount: number;
  cmsCollectionCount: number;
  cmsRecordCount: number;
  latestCmsUpdatedAt: string | null;
}

export interface WorkspaceAnalyticsRollup {
  generatedAt: string;
  totalOrders: number;
  totalBookings: number;
  totalGrossCollectedCents: number;
  totalOutstandingCents: number;
  primaryCurrency: string;
  operations: WorkspaceOperationalAnalytics;
  sites: WorkspaceAnalyticsSitePayload[];
}

interface SiteCmsSnapshot {
  collectionIds: string[];
  collectionCount: number;
  recordCount: number;
  latestUpdatedAt: string | null;
}

async function loadOrEmpty<T>(loader: () => Promise<T[]>): Promise<T[]> {
  try {
    return await loader();
  } catch (error) {
    if (error instanceof Error) return [];
    throw error;
  }
}

async function loadCommerceSnapshot(): Promise<{
  orders: Awaited<ReturnType<typeof listOrders>>;
  bookings: Awaited<ReturnType<typeof listBookings>>;
  services: Awaited<ReturnType<typeof listServices>>;
}> {
  const [orders, bookings, services] = await Promise.all([
    loadOrEmpty(() => listOrders()),
    loadOrEmpty(() => listBookings({ includeCancelled: true })),
    loadOrEmpty(() => listServices(true)),
  ]);
  return { orders, bookings, services };
}

function mergeTimestamp(current: string | null, next: string | null | undefined): string | null {
  if (!next) return current;
  if (!current) return next;
  return next > current ? next : current;
}

async function loadSiteCmsSnapshot(siteId: string): Promise<SiteCmsSnapshot> {
  try {
    const site = await readSiteDocument(siteId, defaultLocale);
    const collections = site.cmsCollections ?? [];
    let recordCount = 0;
    let latestUpdatedAt: string | null = null;
    for (const collection of collections) {
      latestUpdatedAt = mergeTimestamp(latestUpdatedAt, collection.updatedAt);
      for (const record of collection.records) {
        recordCount += 1;
        latestUpdatedAt = mergeTimestamp(latestUpdatedAt, record.updatedAt);
      }
    }
    return {
      collectionIds: collections.map((collection) => collection.collectionId),
      collectionCount: collections.length,
      recordCount,
      latestUpdatedAt,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        collectionIds: [],
        collectionCount: 0,
        recordCount: 0,
        latestUpdatedAt: null,
      };
    }
    throw error;
  }
}

function emptySharedAssetSummary(): SharedAssetSummary {
  return { count: 0, totalBytes: 0, latestUploadedAt: null };
}

async function summarizeSharedAssetsSafely(): Promise<SharedAssetSummary> {
  try {
    return await summarizeSharedAssets();
  } catch (error) {
    if (error instanceof Error) return emptySharedAssetSummary();
    throw error;
  }
}

function buildOperations(input: {
  siteCount: number;
  memberCount: number;
  sharedAssets: SharedAssetSummary;
  cmsCollectionCount: number;
  cmsRecordCount: number;
  latestCmsUpdatedAt: string | null;
}): WorkspaceOperationalAnalytics {
  return {
    siteCount: input.siteCount,
    memberCount: input.memberCount,
    sharedAssetCount: input.sharedAssets.count,
    sharedAssetBytes: input.sharedAssets.totalBytes,
    cmsCollectionCount: input.cmsCollectionCount,
    cmsRecordCount: input.cmsRecordCount,
    latestCmsUpdatedAt: input.latestCmsUpdatedAt,
    latestSharedAssetUploadedAt: input.sharedAssets.latestUploadedAt,
  };
}

export async function buildWorkspaceAnalyticsRollup(): Promise<WorkspaceAnalyticsRollup> {
  const [sites, members, sharedAssets] = await Promise.all([
    listWorkspaceSites(),
    listMembers(),
    summarizeSharedAssetsSafely(),
  ]);
  const generatedAt = new Date().toISOString();
  if (sites.length === 0) {
    return {
      generatedAt,
      totalOrders: 0,
      totalBookings: 0,
      totalGrossCollectedCents: 0,
      totalOutstandingCents: 0,
      primaryCurrency: 'TWD',
      operations: buildOperations({
        siteCount: 0,
        memberCount: members.length,
        sharedAssets,
        cmsCollectionCount: 0,
        cmsRecordCount: 0,
        latestCmsUpdatedAt: null,
      }),
      sites: [],
    };
  }

  const commerceSnapshot = await loadCommerceSnapshot();
  const emptyPayment = buildPaymentAnalytics({
    orders: [],
    bookings: [],
    services: [],
    now: generatedAt,
  });
  const primarySiteId = sites[0].siteId;
  const cmsCollectionIds = new Set<string>();
  let cmsRecordCount = 0;
  let latestCmsUpdatedAt: string | null = null;
  const payloads: WorkspaceAnalyticsSitePayload[] = [];
  for (const site of sites) {
    const siteCms = await loadSiteCmsSnapshot(site.siteId);
    for (const collectionId of siteCms.collectionIds) cmsCollectionIds.add(collectionId);
    cmsRecordCount += siteCms.recordCount;
    latestCmsUpdatedAt = mergeTimestamp(latestCmsUpdatedAt, siteCms.latestUpdatedAt);

    const ownsWorkspaceCommerceSnapshot = site.siteId === primarySiteId;
    const payment = ownsWorkspaceCommerceSnapshot
      ? buildPaymentAnalytics({ ...commerceSnapshot, now: generatedAt })
      : emptyPayment;
    payloads.push({
      siteId: site.siteId,
      siteName: site.name,
      payment,
      orderCount: ownsWorkspaceCommerceSnapshot ? commerceSnapshot.orders.length : 0,
      bookingCount: ownsWorkspaceCommerceSnapshot ? commerceSnapshot.bookings.length : 0,
      cmsCollectionCount: siteCms.collectionCount,
      cmsRecordCount: siteCms.recordCount,
      latestCmsUpdatedAt: siteCms.latestUpdatedAt,
    });
  }

  let totalOrders = 0;
  let totalBookings = 0;
  let totalGross = 0;
  let totalOutstanding = 0;
  let primaryCurrency = 'TWD';
  let bestCurrencyGross = -1;

  for (const payload of payloads) {
    totalOrders += payload.orderCount;
    totalBookings += payload.bookingCount;
    for (const bucket of payload.payment.totals.currencyTotals) {
      totalGross += bucket.grossCollected;
      totalOutstanding += bucket.outstanding;
      if (bucket.grossCollected > bestCurrencyGross) {
        bestCurrencyGross = bucket.grossCollected;
        primaryCurrency = bucket.currency;
      }
    }
  }

  return {
    generatedAt,
    totalOrders,
    totalBookings,
    totalGrossCollectedCents: totalGross,
    totalOutstandingCents: totalOutstanding,
    primaryCurrency,
    operations: buildOperations({
      siteCount: sites.length,
      memberCount: members.length,
      sharedAssets,
      cmsCollectionCount: cmsCollectionIds.size,
      cmsRecordCount,
      latestCmsUpdatedAt,
    }),
    sites: payloads,
  };
}
