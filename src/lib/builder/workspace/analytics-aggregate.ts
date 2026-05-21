/**
 * Workspace analytics aggregation (v1 — single-site rollup).
 *
 * Wraps the per-site payment analytics builder so the workspace dashboard
 * can show a single rolled-up KPI summary plus a per-site breakdown. The
 * underlying `listOrders` / `listBookings` / `listServices` calls are
 * site-agnostic today, so the "rollup" iterates only over the workspace's
 * one known site. The shape is forwards-compatible: when per-site listing
 * APIs land, only `loadSiteSnapshot` needs to grow a siteId parameter.
 */

import { listOrders } from '@/lib/builder/commerce/orders-engine';
import { listBookings, listServices } from '@/lib/builder/bookings/storage';
import {
  buildPaymentAnalytics,
  type PaymentAnalyticsSummary,
} from '@/lib/builder/payment-analytics';
import { listWorkspaceSites } from './workspace-store';

export interface WorkspaceAnalyticsSitePayload {
  siteId: string;
  siteName: string;
  payment: PaymentAnalyticsSummary;
  orderCount: number;
  bookingCount: number;
}

export interface WorkspaceAnalyticsRollup {
  generatedAt: string;
  totalOrders: number;
  totalBookings: number;
  totalGrossCollectedCents: number;
  totalOutstandingCents: number;
  primaryCurrency: string;
  sites: WorkspaceAnalyticsSitePayload[];
}

async function loadSiteSnapshot(): Promise<{
  orders: Awaited<ReturnType<typeof listOrders>>;
  bookings: Awaited<ReturnType<typeof listBookings>>;
  services: Awaited<ReturnType<typeof listServices>>;
}> {
  const [orders, bookings, services] = await Promise.all([
    listOrders().catch(() => []),
    listBookings({ includeCancelled: true }).catch(() => []),
    listServices(true).catch(() => []),
  ]);
  return { orders, bookings, services };
}

export async function buildWorkspaceAnalyticsRollup(): Promise<WorkspaceAnalyticsRollup> {
  const sites = await listWorkspaceSites();
  const generatedAt = new Date().toISOString();
  if (sites.length === 0) {
    return {
      generatedAt,
      totalOrders: 0,
      totalBookings: 0,
      totalGrossCollectedCents: 0,
      totalOutstandingCents: 0,
      primaryCurrency: 'TWD',
      sites: [],
    };
  }

  const payloads: WorkspaceAnalyticsSitePayload[] = [];
  for (const site of sites) {
    const { orders, bookings, services } = await loadSiteSnapshot();
    const payment = buildPaymentAnalytics({ orders, bookings, services, now: generatedAt });
    payloads.push({
      siteId: site.siteId,
      siteName: site.name,
      payment,
      orderCount: orders.length,
      bookingCount: bookings.length,
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
    sites: payloads,
  };
}