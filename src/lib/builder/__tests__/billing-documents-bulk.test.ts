import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Booking, BookingService, Staff } from '@/lib/builder/bookings/types';

const bookingFixtures = vi.hoisted(() => ({
  bookings: [] as Booking[],
  services: [] as BookingService[],
  staff: [] as Staff[],
  saveBooking: vi.fn(async (booking: Booking) => {
    const index = bookingFixtures.bookings.findIndex((entry) => entry.bookingId === booking.bookingId);
    if (index >= 0) bookingFixtures.bookings[index] = booking;
    else bookingFixtures.bookings.push(booking);
  }),
  saveService: vi.fn(async (service: BookingService) => {
    const index = bookingFixtures.services.findIndex((entry) => entry.serviceId === service.serviceId);
    if (index >= 0) bookingFixtures.services[index] = service;
    else bookingFixtures.services.push(service);
  }),
  saveStaff: vi.fn(async (staff: Staff) => {
    const index = bookingFixtures.staff.findIndex((entry) => entry.staffId === staff.staffId);
    if (index >= 0) bookingFixtures.staff[index] = staff;
    else bookingFixtures.staff.push(staff);
  }),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getBooking: vi.fn(async (bookingId: string) => bookingFixtures.bookings.find((entry) => entry.bookingId === bookingId) ?? null),
  getService: vi.fn(async (serviceId: string) => bookingFixtures.services.find((entry) => entry.serviceId === serviceId) ?? null),
  getStaff: vi.fn(async (staffId: string) => bookingFixtures.staff.find((entry) => entry.staffId === staffId) ?? null),
  listBookings: vi.fn(async () => bookingFixtures.bookings),
  listServices: vi.fn(async () => bookingFixtures.services),
  listStaff: vi.fn(async () => bookingFixtures.staff),
  saveBooking: bookingFixtures.saveBooking,
  saveService: bookingFixtures.saveService,
  saveStaff: bookingFixtures.saveStaff,
}));

import {
  bulkExportCsv,
  bulkIssueInvoicesForOrders,
  bulkVoidDocuments,
  parseBulkDocumentIds,
} from '@/lib/builder/billing-documents-bulk';
import { createOrder, issueOrderDocument } from '@/lib/builder/commerce/orders-engine';
import { createCommerceCheckoutQuote, normalizeCheckoutAddress } from '@/lib/builder/commerce/checkout-shared';
import { makeCartItemId, makeEmptyCart, upsertCartItem, type CommerceCartItem } from '@/lib/builder/commerce/cart-shared';
import { issueBookingBillingDocument } from '@/lib/builder/bookings/billing-documents';
import { saveBooking, saveService, saveStaff } from '@/lib/builder/bookings/storage';
import { getBillingDocument } from '@/lib/builder/billing-documents';

let commerceRoot = '';
let previousCommerceRoot: string | undefined;
let previousCommerceBackend: string | undefined;

function item(overrides: Partial<CommerceCartItem> = {}): CommerceCartItem {
  return {
    itemId: makeCartItemId('product-bulk-billing'),
    productId: 'product-bulk-billing',
    productSlug: 'product-bulk-billing',
    title: 'Bulk Billing Product',
    sku: 'BULK-SKU',
    priceCents: 12000,
    currency: 'TWD',
    quantity: 1,
    maxQuantity: 4,
    optionValues: {},
    ...overrides,
  };
}

function service(): BookingService {
  return {
    serviceId: 'svc-bulk-billing',
    slug: 'bulk-billing',
    name: { ko: '벌크 상담', 'zh-hant': '批量諮詢', en: 'Bulk consultation' },
    description: { ko: '', 'zh-hant': '', en: '' },
    durationMinutes: 30,
    priceTwd: 5000,
    priceAmount: 5000,
    priceCurrency: 'TWD',
    paymentMode: 'paid',
    category: 'consultation',
    staffIds: ['staff-bulk-billing'],
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    slotStepMinutes: 30,
    isActive: true,
    createdAt: '2026-05-20T00:00:00.000Z',
    updatedAt: '2026-05-20T00:00:00.000Z',
  };
}

function staff(): Staff {
  return {
    staffId: 'staff-bulk-billing',
    name: { ko: '벌크 담당자', 'zh-hant': '批量顧問', en: 'Bulk counsel' },
    title: { ko: '상담 담당', 'zh-hant': '諮詢顧問', en: 'Counsel' },
    bio: { ko: '', 'zh-hant': '', en: '' },
    email: 'staff-bulk@example.com',
    isActive: true,
    createdAt: '2026-05-20T00:00:00.000Z',
    updatedAt: '2026-05-20T00:00:00.000Z',
  };
}

function booking(overrides: Partial<Booking> = {}): Booking {
  return {
    bookingId: 'bk-bulk-billing-1',
    serviceId: 'svc-bulk-billing',
    staffId: 'staff-bulk-billing',
    customer: { name: 'Bulk Client', email: 'bulk@example.com', locale: 'ko' },
    startAt: '2026-05-21T09:00:00.000Z',
    endAt: '2026-05-21T09:30:00.000Z',
    status: 'confirmed',
    source: 'admin',
    paymentStatus: 'unpaid',
    paymentAmount: 5000,
    paymentCurrency: 'TWD',
    billingDocuments: [],
    reminders: [],
    createdAt: '2026-05-20T00:00:00.000Z',
    updatedAt: '2026-05-20T00:00:00.000Z',
    ...overrides,
  };
}

async function makeOrder(suffix: string, customerEmail = `bulk-${suffix}@example.com`) {
  const address = normalizeCheckoutAddress({
    country: 'TW',
    region: 'Taipei',
    city: 'Taipei',
    postalCode: '100',
    addressLine1: `No. ${suffix} Road`,
  });
  const cart = upsertCartItem(makeEmptyCart('ko', 'TWD'), item({ itemId: makeCartItemId(`product-bulk-${suffix}`) }), 1);
  const quote = createCommerceCheckoutQuote(cart, 'ko', 'pickup', address);
  return createOrder({
    confirmationNumber: `TSENG-BULK-${suffix}`,
    locale: 'ko',
    currency: 'TWD',
    customer: { name: `Bulk Order ${suffix}`, email: customerEmail },
    shippingAddress: address,
    lineItems: cart.items,
    shipping: quote.shipping,
    tax: quote.tax,
    totals: quote.totals,
    payment: {
      adapter: 'manual-invoice',
      status: 'requires_manual_payment',
      label: 'Manual invoice',
      stub: true,
      referenceId: `pi_bulk_${suffix}`,
    },
    now: '2026-05-20T00:00:00.000Z',
  });
}

beforeEach(async () => {
  previousCommerceRoot = process.env.BUILDER_COMMERCE_ROOT;
  previousCommerceBackend = process.env.BUILDER_COMMERCE_BACKEND;
  commerceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'billing-bulk-commerce-'));
  process.env.BUILDER_COMMERCE_ROOT = commerceRoot;
  process.env.BUILDER_COMMERCE_BACKEND = 'local';
  bookingFixtures.bookings = [];
  bookingFixtures.services = [];
  bookingFixtures.staff = [];
  bookingFixtures.saveBooking.mockClear();
  bookingFixtures.saveService.mockClear();
  bookingFixtures.saveStaff.mockClear();
});

afterEach(async () => {
  if (previousCommerceRoot === undefined) delete process.env.BUILDER_COMMERCE_ROOT;
  else process.env.BUILDER_COMMERCE_ROOT = previousCommerceRoot;
  if (previousCommerceBackend === undefined) delete process.env.BUILDER_COMMERCE_BACKEND;
  else process.env.BUILDER_COMMERCE_BACKEND = previousCommerceBackend;
  await fs.rm(commerceRoot, { recursive: true, force: true });
});

describe('parseBulkDocumentIds', () => {
  it('parses triples, object form, drops invalid entries', () => {
    const parsed = parseBulkDocumentIds([
      'order:order-1:doc-1',
      { source: 'booking', ownerId: 'bk-1', documentId: 'bdoc-1' },
      { source: 'booking', ownerId: 'bk-2' },
      'invalid',
      'bogus:source:value',
      { source: 'order', ownerId: '' } as never,
    ]);
    expect(parsed).toEqual([
      { source: 'order', ownerId: 'order-1', documentId: 'doc-1' },
      { source: 'booking', ownerId: 'bk-1', documentId: 'bdoc-1' },
      { source: 'booking', ownerId: 'bk-2', documentId: undefined },
    ]);
  });
});

describe('bulkIssueInvoicesForOrders', () => {
  it('issues invoices for each order and skips duplicates without double-counting', async () => {
    const order1 = await makeOrder('1');
    const order2 = await makeOrder('2');

    const first = await bulkIssueInvoicesForOrders([
      { source: 'order', ownerId: order1.orderId },
      { source: 'order', ownerId: order2.orderId },
    ]);
    expect(first.issued).toHaveLength(2);
    expect(first.skipped).toHaveLength(0);
    expect(first.errors).toHaveLength(0);
    expect(first.issued.map((row) => row.type).sort()).toEqual(['invoice', 'invoice']);

    const repeat = await bulkIssueInvoicesForOrders([
      { source: 'order', ownerId: order1.orderId },
    ]);
    expect(repeat.issued).toHaveLength(0);
    expect(repeat.skipped).toHaveLength(1);
    expect(repeat.skipped[0]?.reason).toBe('invoice_already_issued');
    expect(repeat.skipped[0]?.row?.source).toBe('order');
    expect(repeat.errors).toHaveLength(0);

    const missing = await bulkIssueInvoicesForOrders([
      { source: 'order', ownerId: 'order-does-not-exist' },
    ]);
    expect(missing.issued).toHaveLength(0);
    expect(missing.errors).toHaveLength(1);
    expect(missing.errors[0]?.error).toBe('order_not_found');
  });

  it('issues booking invoices and reports booking-not-found errors', async () => {
    await saveService(service());
    await saveStaff(staff());
    await saveBooking(booking());

    const result = await bulkIssueInvoicesForOrders([
      { source: 'booking', ownerId: 'bk-bulk-billing-1' },
      { source: 'booking', ownerId: 'bk-missing' },
    ]);
    expect(result.issued).toHaveLength(1);
    expect(result.issued[0]?.source).toBe('booking');
    expect(result.issued[0]?.type).toBe('invoice');
    expect(result.errors[0]?.error).toBe('booking_not_found');
  });

  it('accepts wire string identifier triples', async () => {
    const order = await makeOrder('wire');
    const result = await bulkIssueInvoicesForOrders([
      `order:${order.orderId}`,
    ]);
    expect(result.issued).toHaveLength(1);
    expect(result.issued[0]?.ownerId).toBe(order.orderId);
  });
});

describe('bulkVoidDocuments', () => {
  it('voids issued documents and skips already-voided ones', async () => {
    const order = await makeOrder('void-1');
    const issued = await issueOrderDocument(order.orderId, { type: 'invoice', actor: 'admin' });
    expect(issued.document).toBeTruthy();

    const result = await bulkVoidDocuments(
      [{ source: 'order', ownerId: order.orderId, documentId: issued.document!.documentId }],
      'client requested cancellation',
    );
    expect(result.voided).toHaveLength(1);
    expect(result.voided[0]?.status).toBe('voided');
    expect(result.voided[0]?.voidReason).toBe('client requested cancellation');

    const second = await bulkVoidDocuments(
      [{ source: 'order', ownerId: order.orderId, documentId: issued.document!.documentId }],
      'already cancelled',
    );
    expect(second.voided).toHaveLength(0);
    expect(second.skipped).toHaveLength(1);
    expect(second.skipped[0]?.reason).toBe('already_voided');
    expect(second.skipped[0]?.row?.status).toBe('voided');
  });

  it('reports missing documents and document_id_missing errors', async () => {
    const result = await bulkVoidDocuments(
      [
        { source: 'order', ownerId: 'order-missing', documentId: 'doc-missing' },
        { source: 'order', ownerId: 'order-missing' },
      ],
      'cleanup',
    );
    expect(result.voided).toHaveLength(0);
    expect(result.errors.map((entry) => entry.error).sort()).toEqual(
      ['document_id_missing', 'document_not_found'].sort(),
    );
  });
});

describe('bulkExportCsv', () => {
  it('produces an RFC-4180 escaped CSV with one row per document', async () => {
    const order = await makeOrder('csv-1', 'csv-customer@example.com');
    await issueOrderDocument(order.orderId, { type: 'invoice', actor: 'admin' });

    const csv = await bulkExportCsv({});
    const lines = csv.trim().split(/\r\n/);
    expect(lines[0]).toContain('source,ownerId,ownerLabel');
    expect(lines.length).toBeGreaterThanOrEqual(2);
    const dataLine = lines.find((line) => line.includes('csv-customer@example.com'));
    expect(dataLine).toBeTruthy();
    expect(dataLine).toContain('order');
    expect(dataLine).toContain('invoice');
  });

  it('escapes commas, quotes, and newlines in fields', async () => {
    const order = await makeOrder('csv-2', 'csv-fields@example.com');
    const issued = await issueOrderDocument(order.orderId, {
      type: 'invoice',
      actor: 'admin',
      notes: 'Line one, with comma\nLine "two"',
    });
    expect(issued.document).toBeTruthy();
    const row = await getBillingDocument('order', order.orderId, issued.document!.documentId);
    expect(row).toBeTruthy();

    const csv = await bulkExportCsv({ source: 'order' });
    expect(csv).toContain('"Line one, with comma\nLine ""two"""');
  });

  it('filters by source', async () => {
    await saveService(service());
    await saveStaff(staff());
    await saveBooking(booking({ bookingId: 'bk-csv-only' }));
    await issueBookingBillingDocument('bk-csv-only', { type: 'invoice' });
    const order = await makeOrder('csv-3', 'csv-source@example.com');
    await issueOrderDocument(order.orderId, { type: 'invoice', actor: 'admin' });

    const ordersOnly = await bulkExportCsv({ source: 'order' });
    expect(ordersOnly).toContain('csv-source@example.com');
    expect(ordersOnly).not.toContain('bk-csv-only');

    const bookingsOnly = await bulkExportCsv({ source: 'booking' });
    expect(bookingsOnly).toContain('bk-csv-only');
    expect(bookingsOnly).not.toContain('csv-source@example.com');
  });
});