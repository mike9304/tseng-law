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
  billingDocumentFileName,
  billingDocumentCanPay,
  billingDocumentPaymentTokenMatches,
  billingDocumentTokenSecretConfigured,
  createBillingDocumentPaymentLink,
  createBillingDocumentShareLink,
  getBillingDocument,
  listBillingDocuments,
  renderBillingDocumentHtml,
  renderBillingDocumentPdf,
  revokeBillingDocumentPaymentLink,
  revokeBillingDocumentShareLink,
  settleBillingDocumentPaymentLink,
  settleBillingDocumentHostedPayment,
  trackBillingDocumentAccess,
  validateBillingDocumentPaymentToken,
  validateBillingDocumentShareToken,
  supersedeBuilderBillingDocument,
  voidBuilderBillingDocument,
} from '@/lib/builder/billing-documents';
import {
  buildBillingDocumentStripeCheckoutRequest,
  createBillingDocumentStripeCheckoutSession,
  normalizeBillingDocumentStripeWebhookPayload,
} from '@/lib/builder/billing-document-hosted-payments';
import {
  listBillingDocumentWebhookEvents,
  receiveBillingDocumentWebhookEvent,
  replayBillingDocumentWebhookEvent,
  summarizeBillingDocumentWebhookEvents,
} from '@/lib/builder/billing-document-webhooks';
import {
  listBillingDocumentNumberReservations,
  reserveBillingDocumentNumber,
} from '@/lib/builder/billing-document-numbering';
import {
  BILLING_DOCUMENT_AUTOMATION_VERSION,
  billingManualPaymentInstructionsForTarget,
  loadBillingDocumentAutomationSettings,
  runBookingBillingAutomation,
  runOrderBillingAutomation,
  saveBillingDocumentAutomationSettings,
} from '@/lib/builder/billing-document-automation';
import { createOrder, issueOrderDocument, recordOrderManualPayment, updateOrderState } from '@/lib/builder/commerce/orders-engine';
import { listNotificationEvents } from '@/lib/builder/commerce/notifications-engine';
import { createCommerceCheckoutQuote, normalizeCheckoutAddress } from '@/lib/builder/commerce/checkout-shared';
import { makeCartItemId, makeEmptyCart, upsertCartItem, type CommerceCartItem } from '@/lib/builder/commerce/cart-shared';
import { issueBookingBillingDocument } from '@/lib/builder/bookings/billing-documents';
import { recordBookingManualPayment } from '@/lib/builder/bookings/payments';
import { saveBooking, saveService, saveStaff } from '@/lib/builder/bookings/storage';

let commerceRoot = '';
let previousCommerceRoot: string | undefined;
let previousCommerceBackend: string | undefined;
let previousStripeSecret: string | undefined;
let previousBillingDocumentShareSecret: string | undefined;
let previousNextAuthSecret: string | undefined;
let previousCmsAdminPassword: string | undefined;
let previousNodeEnv: string | undefined;

function setNodeEnvForTest(value: string | undefined): void {
  const env = process.env as Record<string, string | undefined>;
  if (value === undefined) delete env.NODE_ENV;
  else env.NODE_ENV = value;
}

function item(overrides: Partial<CommerceCartItem> = {}): CommerceCartItem {
  return {
    itemId: makeCartItemId('product-billing-docs'),
    productId: 'product-billing-docs',
    productSlug: 'product-billing-docs',
    title: 'Billing Docs Product',
    sku: 'BD-SKU',
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
    serviceId: 'svc-billing-docs',
    slug: 'billing-docs',
    name: { ko: '문서 상담', 'zh-hant': '文件諮詢', en: 'Document consultation' },
    description: { ko: '', 'zh-hant': '', en: '' },
    durationMinutes: 30,
    priceTwd: 5000,
    priceAmount: 5000,
    priceCurrency: 'TWD',
    paymentMode: 'paid',
    category: 'consultation',
    staffIds: ['staff-billing-docs'],
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
    staffId: 'staff-billing-docs',
    name: { ko: '문서 담당자', 'zh-hant': '文件顧問', en: 'Document counsel' },
    title: { ko: '상담 담당', 'zh-hant': '諮詢顧問', en: 'Counsel' },
    bio: { ko: '', 'zh-hant': '', en: '' },
    email: 'staff@example.com',
    isActive: true,
    createdAt: '2026-05-20T00:00:00.000Z',
    updatedAt: '2026-05-20T00:00:00.000Z',
  };
}

function booking(overrides: Partial<Booking> = {}): Booking {
  return {
    bookingId: 'bk-billing-docs',
    serviceId: 'svc-billing-docs',
    staffId: 'staff-billing-docs',
    customer: { name: 'Booking Client', email: 'booking@example.com', locale: 'ko' },
    startAt: '2026-05-21T09:00:00.000Z',
    endAt: '2026-05-21T09:30:00.000Z',
    status: 'confirmed',
    source: 'admin',
    paymentStatus: 'paid',
    paymentAmount: 5000,
    paymentCurrency: 'TWD',
    billingDocuments: [],
    reminders: [],
    createdAt: '2026-05-20T00:00:00.000Z',
    updatedAt: '2026-05-20T00:00:00.000Z',
    ...overrides,
  };
}

beforeEach(async () => {
  previousCommerceRoot = process.env.BUILDER_COMMERCE_ROOT;
  previousCommerceBackend = process.env.BUILDER_COMMERCE_BACKEND;
  previousStripeSecret = process.env.STRIPE_SECRET_KEY;
  previousBillingDocumentShareSecret = process.env.BILLING_DOCUMENT_SHARE_SECRET;
  previousNextAuthSecret = process.env.NEXTAUTH_SECRET;
  previousCmsAdminPassword = process.env.CMS_ADMIN_PASSWORD;
  previousNodeEnv = process.env.NODE_ENV;
  commerceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'billing-docs-commerce-'));
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
  if (previousStripeSecret === undefined) delete process.env.STRIPE_SECRET_KEY;
  else process.env.STRIPE_SECRET_KEY = previousStripeSecret;
  if (previousBillingDocumentShareSecret === undefined) delete process.env.BILLING_DOCUMENT_SHARE_SECRET;
  else process.env.BILLING_DOCUMENT_SHARE_SECRET = previousBillingDocumentShareSecret;
  if (previousNextAuthSecret === undefined) delete process.env.NEXTAUTH_SECRET;
  else process.env.NEXTAUTH_SECRET = previousNextAuthSecret;
  if (previousCmsAdminPassword === undefined) delete process.env.CMS_ADMIN_PASSWORD;
  else process.env.CMS_ADMIN_PASSWORD = previousCmsAdminPassword;
  setNodeEnvForTest(previousNodeEnv);
  await fs.rm(commerceRoot, { recursive: true, force: true });
});

describe('builder billing documents', () => {
  it('lists order and booking documents, renders downloads, and validates share tokens', async () => {
    const address = normalizeCheckoutAddress({
      country: 'TW',
      region: 'Taipei',
      city: 'Taipei',
      postalCode: '100',
      addressLine1: 'No. 1 Road',
    });
    const cart = upsertCartItem(makeEmptyCart('ko', 'TWD'), item(), 1);
    const quote = createCommerceCheckoutQuote(cart, 'ko', 'pickup', address);
    const order = await createOrder({
      confirmationNumber: 'TSENG-20260520-BDOC',
      locale: 'ko',
      currency: 'TWD',
      customer: { name: 'Order Client', email: 'order@example.com' },
      shippingAddress: address,
      lineItems: cart.items,
      shipping: quote.shipping,
      tax: quote.tax,
      totals: quote.totals,
      payment: { adapter: 'sandbox-card', status: 'authorized_stub', label: 'Sandbox', stub: true },
      now: '2026-05-20T00:00:00.000Z',
    });
    await updateOrderState(order.orderId, { paymentStatus: 'paid', actor: 'admin' });
    const orderReceipt = await issueOrderDocument(order.orderId, { type: 'receipt', actor: 'admin' });
    expect(orderReceipt.document?.number).toMatch(/^RCT-\d{4}-000001$/);

    await saveService(service());
    await saveStaff(staff());
    await saveBooking(booking());
    const bookingInvoice = await issueBookingBillingDocument('bk-billing-docs', { type: 'invoice' });
    expect(bookingInvoice.document.number).toMatch(/^INV-\d{4}-000001$/);

    const rows = await listBillingDocuments({ locale: 'ko' });
    expect(rows.map((row) => row.number).sort()).toEqual([
      bookingInvoice.document.number,
      orderReceipt.document?.number,
    ].sort());
    expect(rows.map((row) => row.source).sort()).toEqual(['booking', 'order']);

    const initialOrderRow = await getBillingDocument('order', order.orderId, orderReceipt.document!.documentId);
    expect(initialOrderRow?.shareStatus).toBe('not_created');
    expect(initialOrderRow?.sharePath).toBe('');

    const sharedOrderRow = await createBillingDocumentShareLink('order', order.orderId, orderReceipt.document!.documentId, {
      expiresAt: '2099-01-01T00:00:00.000Z',
    });
    expect(sharedOrderRow?.shareStatus).toBe('active');
    expect(sharedOrderRow?.sharePath).toContain('/api/billing-documents/order/');

    const orderRow = await getBillingDocument('order', order.orderId, orderReceipt.document!.documentId);
    expect(orderRow?.downloadPath).toContain('/api/builder/billing-documents/order/');
    expect(orderRow && validateBillingDocumentShareToken(orderRow, new URL(`http://localhost${orderRow.sharePath}`).searchParams.get('token'))).toBe(true);
    expect(orderRow && validateBillingDocumentShareToken(orderRow, 'bad-token')).toBe(false);
    expect(orderRow && billingDocumentFileName(orderRow)).toMatch(/RCT-\d{4}-000001\.html/);
    expect(orderRow && renderBillingDocumentHtml(orderRow)).toContain('Order Client');
    expect(orderRow && renderBillingDocumentPdf(orderRow).subarray(0, 5).toString('utf8')).toBe('%PDF-');

    await trackBillingDocumentAccess('order', order.orderId, orderReceipt.document!.documentId, 'viewed');
    await trackBillingDocumentAccess('order', order.orderId, orderReceipt.document!.documentId, 'downloaded');
    const trackedOrderRow = await getBillingDocument('order', order.orderId, orderReceipt.document!.documentId);
    expect(trackedOrderRow?.viewCount).toBe(1);
    expect(trackedOrderRow?.downloadCount).toBe(1);

    const revokedOrderRow = await revokeBillingDocumentShareLink('order', order.orderId, orderReceipt.document!.documentId);
    expect(revokedOrderRow?.shareStatus).toBe('revoked');
    expect(revokedOrderRow && validateBillingDocumentShareToken(revokedOrderRow, new URL(`http://localhost${orderRow!.sharePath}`).searchParams.get('token'))).toBe(false);

    const bookingRows = await listBillingDocuments({ locale: 'ko', source: 'booking', q: 'booking@example.com' });
    expect(bookingRows).toHaveLength(1);
    expect(renderBillingDocumentHtml(bookingRows[0])).toContain('문서 상담');
  });

  it('requires an explicit billing token secret for production share and payment links', async () => {
    const address = normalizeCheckoutAddress({
      country: 'TW',
      region: 'Taipei',
      city: 'Taipei',
      postalCode: '100',
      addressLine1: 'No. 2 Production Road',
    });
    const cart = upsertCartItem(makeEmptyCart('ko', 'TWD'), item({ itemId: makeCartItemId('product-prod-secret') }), 1);
    const quote = createCommerceCheckoutQuote(cart, 'ko', 'pickup', address);
    const order = await createOrder({
      confirmationNumber: 'TSENG-20260520-PRODSECRET',
      locale: 'ko',
      currency: 'TWD',
      customer: { name: 'Prod Secret Client', email: 'prod-secret@example.com' },
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
        referenceId: 'pi_prod_secret',
      },
      now: '2026-05-20T00:00:00.000Z',
    });
    const invoice = await issueOrderDocument(order.orderId, { type: 'invoice', actor: 'admin' });

    setNodeEnvForTest('production');
    delete process.env.BILLING_DOCUMENT_SHARE_SECRET;
    delete process.env.NEXTAUTH_SECRET;
    process.env.CMS_ADMIN_PASSWORD = 'admin-password-is-not-a-billing-token-secret';

    expect(billingDocumentTokenSecretConfigured()).toBe(false);
    await expect(createBillingDocumentShareLink('order', order.orderId, invoice.document!.documentId)).resolves.toBeNull();
    await expect(createBillingDocumentPaymentLink('order', order.orderId, invoice.document!.documentId)).resolves.toBeNull();

    const blockedRow = await getBillingDocument('order', order.orderId, invoice.document!.documentId);
    expect(blockedRow?.sharePath).toBe('');
    expect(blockedRow?.paymentLinkPath).toBe('');
    expect(blockedRow && validateBillingDocumentShareToken(blockedRow, 'bad-token')).toBe(false);
    expect(blockedRow && validateBillingDocumentPaymentToken(blockedRow, 'bad-token')).toBe(false);

    process.env.BILLING_DOCUMENT_SHARE_SECRET = 'production-billing-share-secret';
    expect(billingDocumentTokenSecretConfigured()).toBe(true);

    const shared = await createBillingDocumentShareLink('order', order.orderId, invoice.document!.documentId);
    const paymentLink = await createBillingDocumentPaymentLink('order', order.orderId, invoice.document!.documentId);
    expect(shared?.sharePath).toContain('/api/billing-documents/order/');
    expect(paymentLink?.paymentLinkPath).toContain('/api/billing-documents/order/');
    expect(shared && validateBillingDocumentShareToken(shared, new URL(`http://localhost${shared.sharePath}`).searchParams.get('token'))).toBe(true);
    expect(paymentLink && validateBillingDocumentPaymentToken(paymentLink, new URL(`http://localhost${paymentLink.paymentLinkPath}`).searchParams.get('token'))).toBe(true);
  });

  it('saves automatic issuance policy and issues order and booking documents without duplicates', async () => {
    const defaults = await loadBillingDocumentAutomationSettings();
    expect(defaults.orders.invoiceOnCreate.enabled).toBe(false);
    expect(defaults.bookings.receiptOnPaid.enabled).toBe(false);

    const settings = await saveBillingDocumentAutomationSettings({
      orders: {
        invoiceOnCreate: { enabled: true, email: false },
        receiptOnPaid: { enabled: true, email: false },
      },
      bookings: {
        invoiceOnCreate: { enabled: true, email: false },
        receiptOnPaid: { enabled: true, email: false },
      },
      manualPayments: {
        orders: {
          bank_transfer: { enabled: true, title: 'Wire transfer', instructions: 'Bank: Test Trust\nMemo: invoice number' },
        },
        bookings: {
          cash: { enabled: true, title: 'Office cash desk', instructions: 'Pay at reception before the consultation.' },
        },
      },
    });
    expect(settings.version).toBe(BILLING_DOCUMENT_AUTOMATION_VERSION);
    expect(settings.orders.invoiceOnCreate.enabled).toBe(true);
    expect(settings.orders.receiptOnPaid.enabled).toBe(true);
    expect(billingManualPaymentInstructionsForTarget(settings, 'orders')).toMatchObject([
      { method: 'bank_transfer', title: 'Wire transfer', instructions: 'Bank: Test Trust\nMemo: invoice number' },
    ]);
    expect(billingManualPaymentInstructionsForTarget(settings, 'bookings')).toMatchObject([
      { method: 'cash', title: 'Office cash desk' },
    ]);

    const address = normalizeCheckoutAddress({
      country: 'TW',
      region: 'Taipei',
      city: 'Taipei',
      postalCode: '100',
      addressLine1: 'No. 2 Road',
    });
    const cart = upsertCartItem(makeEmptyCart('ko', 'TWD'), item({ itemId: makeCartItemId('product-auto-docs') }), 1);
    const quote = createCommerceCheckoutQuote(cart, 'ko', 'pickup', address);
    const order = await createOrder({
      confirmationNumber: 'TSENG-20260520-AUTO',
      locale: 'ko',
      currency: 'TWD',
      customer: { name: 'Auto Order Client', email: 'auto-order@example.com' },
      shippingAddress: address,
      lineItems: cart.items,
      shipping: quote.shipping,
      tax: quote.tax,
      totals: quote.totals,
      payment: { adapter: 'sandbox-card', status: 'authorized_stub', label: 'Sandbox', stub: true, referenceId: 'pi_auto_docs' },
      now: '2026-05-20T00:00:00.000Z',
    });

    const createdOrderAutomation = await runOrderBillingAutomation(order.orderId, { trigger: 'created' });
    expect(createdOrderAutomation?.actions.map((action) => `${action.type}:${action.created}:${action.skipped ?? ''}`)).toEqual([
      'invoice:true:',
      'receipt:false:receipt_requires_paid_order',
    ]);

    const invoiceAction = createdOrderAutomation?.actions.find((action) => action.type === 'invoice');
    expect(invoiceAction?.number).toMatch(/^INV-\d{4}-000001$/);
    const invoiceRow = invoiceAction?.documentId
      ? await getBillingDocument('order', order.orderId, invoiceAction.documentId)
      : null;
    expect(invoiceRow?.paymentLinkStatus).toBe('not_created');
    expect(invoiceRow?.paymentLinkPath).toBe('');
    expect(invoiceRow && renderBillingDocumentHtml(invoiceRow)).not.toContain('Pay invoice');

    const paymentLink = await createBillingDocumentPaymentLink('order', order.orderId, invoiceAction!.documentId!);
    expect(paymentLink?.paymentLinkStatus).toBe('active');
    expect(paymentLink?.paymentLinkPath).toContain('/api/billing-documents/order/');
    expect(paymentLink?.paymentLinkEvents).toEqual([
      expect.objectContaining({
        type: 'created',
        actor: 'admin',
        paymentLinkId: paymentLink?.paymentLinkId,
        balanceDue: paymentLink?.balanceDue,
      }),
    ]);
    const firstPaymentToken = new URL(`http://localhost${paymentLink!.paymentLinkPath}`).searchParams.get('token');
    expect(billingDocumentPaymentTokenMatches(paymentLink!, firstPaymentToken)).toBe(true);
    expect(validateBillingDocumentPaymentToken(paymentLink!, firstPaymentToken)).toBe(true);
    expect(renderBillingDocumentHtml(paymentLink!)).toContain('Pay invoice');
    const instructionOptions = { manualInstructions: billingManualPaymentInstructionsForTarget(settings, 'orders') };
    expect(renderBillingDocumentHtml(paymentLink!, instructionOptions)).toContain('Manual payment instructions');
    expect(renderBillingDocumentHtml(paymentLink!, instructionOptions)).toContain('Wire transfer');
    expect(renderBillingDocumentPdf(paymentLink!, instructionOptions).toString('latin1')).toContain('Wire transfer');

    const samePaymentLink = await createBillingDocumentPaymentLink('order', order.orderId, invoiceAction!.documentId!);
    expect(samePaymentLink?.paymentLinkPath).toBe(paymentLink?.paymentLinkPath);
    expect(samePaymentLink?.paymentLinkEvents).toHaveLength(1);

    const revokedPaymentLink = await revokeBillingDocumentPaymentLink('order', order.orderId, invoiceAction!.documentId!);
    expect(revokedPaymentLink?.paymentLinkStatus).toBe('revoked');
    expect(revokedPaymentLink?.paymentLinkRevokedReason).toBe('admin_revoked');
    expect(revokedPaymentLink?.paymentLinkEvents).toEqual([
      expect.objectContaining({ type: 'created' }),
      expect.objectContaining({
        type: 'revoked',
        actor: 'admin',
        reason: 'admin_revoked',
        balanceDue: revokedPaymentLink?.balanceDue,
      }),
    ]);
    expect(revokedPaymentLink?.paymentReconciliationStatus).not.toBe('renew_required');
    expect(revokedPaymentLink?.paymentLinkRenewalNeeded).toBe(false);
    expect(revokedPaymentLink?.paymentLinkPath).toBe('');
    expect(revokedPaymentLink && billingDocumentPaymentTokenMatches(revokedPaymentLink, firstPaymentToken)).toBe(true);
    expect(revokedPaymentLink && validateBillingDocumentPaymentToken(revokedPaymentLink, firstPaymentToken)).toBe(false);

    const renewedPaymentLink = await createBillingDocumentPaymentLink('order', order.orderId, invoiceAction!.documentId!);
    expect(renewedPaymentLink?.paymentLinkStatus).toBe('active');
    expect(renewedPaymentLink?.paymentLinkEvents.map((event) => event.type)).toEqual(['created', 'revoked', 'renewed']);
    const renewedPaymentToken = new URL(`http://localhost${renewedPaymentLink!.paymentLinkPath}`).searchParams.get('token');
    expect(renewedPaymentToken).not.toBe(firstPaymentToken);
    expect(validateBillingDocumentPaymentToken(renewedPaymentLink!, firstPaymentToken)).toBe(false);
    expect(validateBillingDocumentPaymentToken(renewedPaymentLink!, renewedPaymentToken)).toBe(true);

    const rotatedPaymentLink = await createBillingDocumentPaymentLink('order', order.orderId, invoiceAction!.documentId!, { renew: true });
    const rotatedPaymentToken = new URL(`http://localhost${rotatedPaymentLink!.paymentLinkPath}`).searchParams.get('token');
    expect(rotatedPaymentToken).not.toBe(renewedPaymentToken);
    expect(validateBillingDocumentPaymentToken(rotatedPaymentLink!, renewedPaymentToken)).toBe(false);
    expect(rotatedPaymentLink?.paymentLinkEvents.map((event) => event.type)).toEqual(['created', 'revoked', 'renewed', 'renewed']);

    const settled = await settleBillingDocumentPaymentLink(
      'order',
      order.orderId,
      invoiceAction!.documentId!,
      rotatedPaymentToken,
    );
    expect(settled.order?.payment.status).toBe('paid');
    const paidOrderAutomation = await runOrderBillingAutomation(order.orderId, { trigger: 'paid' });
    expect(paidOrderAutomation?.actions).toMatchObject([{ type: 'receipt', created: true }]);

    const repeatedOrderAutomation = await runOrderBillingAutomation(order.orderId, { trigger: 'paid' });
    expect(repeatedOrderAutomation?.actions).toMatchObject([{ type: 'receipt', created: false }]);

    await saveService(service());
    await saveStaff(staff());
    await saveBooking(booking({
      bookingId: 'bk-billing-pay',
      paymentStatus: 'unpaid',
      paymentIntentId: 'pi_booking_pay_link',
      billingDocuments: [],
    }));
    const bookingInvoice = await issueBookingBillingDocument('bk-billing-pay', { type: 'invoice' });
    const bookingInvoiceRow = await getBillingDocument('booking', 'bk-billing-pay', bookingInvoice.document.documentId);
    expect(bookingInvoiceRow?.paymentLinkStatus).toBe('not_created');
    expect(bookingInvoiceRow?.paymentLinkPath).toBe('');

    const bookingPaymentLink = await createBillingDocumentPaymentLink('booking', 'bk-billing-pay', bookingInvoice.document.documentId);
    expect(bookingPaymentLink?.paymentLinkStatus).toBe('active');
    expect(bookingPaymentLink?.paymentLinkPath).toContain('/api/billing-documents/booking/');
    const bookingPaymentToken = new URL(`http://localhost${bookingPaymentLink!.paymentLinkPath}`).searchParams.get('token');
    expect(validateBillingDocumentPaymentToken(bookingPaymentLink!, bookingPaymentToken)).toBe(true);
    expect(renderBillingDocumentHtml(bookingPaymentLink!)).toContain('Pay invoice');

    const revokedBookingPaymentLink = await revokeBillingDocumentPaymentLink('booking', 'bk-billing-pay', bookingInvoice.document.documentId);
    expect(revokedBookingPaymentLink?.paymentLinkStatus).toBe('revoked');
    expect(revokedBookingPaymentLink?.paymentLinkRevokedReason).toBe('admin_revoked');
    expect(revokedBookingPaymentLink?.paymentReconciliationStatus).not.toBe('renew_required');
    expect(revokedBookingPaymentLink?.paymentLinkRenewalNeeded).toBe(false);
    expect(revokedBookingPaymentLink?.paymentLinkPath).toBe('');
    expect(revokedBookingPaymentLink && validateBillingDocumentPaymentToken(revokedBookingPaymentLink, bookingPaymentToken)).toBe(false);

    const renewedBookingPaymentLink = await createBillingDocumentPaymentLink('booking', 'bk-billing-pay', bookingInvoice.document.documentId);
    const renewedBookingPaymentToken = new URL(`http://localhost${renewedBookingPaymentLink!.paymentLinkPath}`).searchParams.get('token');
    expect(renewedBookingPaymentToken).not.toBe(bookingPaymentToken);
    expect(validateBillingDocumentPaymentToken(renewedBookingPaymentLink!, renewedBookingPaymentToken)).toBe(true);

    const settledBooking = await settleBillingDocumentPaymentLink(
      'booking',
      'bk-billing-pay',
      bookingInvoice.document.documentId,
      renewedBookingPaymentToken,
    );
    expect(settledBooking.booking?.paymentStatus).toBe('paid');
    const paidBookingAutomation = await runBookingBillingAutomation('bk-billing-pay', { trigger: 'paid' });
    expect(paidBookingAutomation?.actions).toMatchObject([{ type: 'receipt', created: true }]);
    const paidBookingInvoiceRow = await getBillingDocument('booking', 'bk-billing-pay', bookingInvoice.document.documentId);
    expect(paidBookingInvoiceRow?.paymentLinkStatus).toBe('unavailable');
    expect(paidBookingInvoiceRow?.paymentLinkPath).toBe('');

    await saveBooking(booking());
    const bookingAutomation = await runBookingBillingAutomation('bk-billing-docs', { trigger: 'created' });
    expect(bookingAutomation?.actions).toMatchObject([
      { type: 'invoice', created: true },
      { type: 'receipt', created: true },
    ]);
    expect(bookingAutomation?.actions.find((action) => action.type === 'invoice')?.number).toMatch(/^INV-\d{4}-000003$/);
    const repeatedBookingAutomation = await runBookingBillingAutomation('bk-billing-docs', { trigger: 'created' });
    expect(repeatedBookingAutomation?.actions).toMatchObject([
      { type: 'invoice', created: false },
      { type: 'receipt', created: false },
    ]);

    const rows = await listBillingDocuments({ locale: 'ko' });
    const orderRows = rows.filter((row) => row.ownerId === order.orderId);
    const bookingRows = rows.filter((row) => row.ownerId === 'bk-billing-docs');
    expect(orderRows.map((row) => row.type).sort()).toEqual(['invoice', 'receipt']);
    expect(bookingRows.map((row) => row.type).sort()).toEqual(['invoice', 'receipt']);
  });

  it('builds hosted Stripe invoice sessions and settles paid webhooks idempotently', async () => {
    await saveBillingDocumentAutomationSettings({
      orders: {
        invoiceOnCreate: { enabled: false, email: false },
        receiptOnPaid: { enabled: true, email: false },
      },
      bookings: {
        invoiceOnCreate: { enabled: false, email: false },
        receiptOnPaid: { enabled: false, email: false },
      },
    });

    const address = normalizeCheckoutAddress({
      country: 'TW',
      region: 'Taipei',
      city: 'Taipei',
      postalCode: '100',
      addressLine1: 'No. 4 Road',
    });
    const cart = upsertCartItem(makeEmptyCart('ko', 'TWD'), item({ itemId: makeCartItemId('product-hosted-docs') }), 1);
    const quote = createCommerceCheckoutQuote(cart, 'ko', 'pickup', address);
    const order = await createOrder({
      confirmationNumber: 'TSENG-20260520-HOST',
      locale: 'ko',
      currency: 'TWD',
      customer: { name: 'Hosted Pay Client', email: 'hosted-pay@example.com' },
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
        referenceId: 'pi_hosted_invoice_seed',
      },
      now: '2026-05-20T00:00:00.000Z',
    });
    const invoice = await issueOrderDocument(order.orderId, { type: 'invoice', actor: 'admin' });
    const paymentLink = await createBillingDocumentPaymentLink('order', order.orderId, invoice.document!.documentId);
    expect(paymentLink?.paymentLinkStatus).toBe('active');

    const checkoutRequest = buildBillingDocumentStripeCheckoutRequest(paymentLink!, 'https://law.example.test');
    expect(checkoutRequest.body.get('mode')).toBe('payment');
    expect(checkoutRequest.body.get('success_url')).toContain('/pay?token=');
    expect(checkoutRequest.body.get('success_url')).toContain('&payment=return');
    expect(checkoutRequest.body.get('cancel_url')).toContain('&payment=cancel');
    expect(checkoutRequest.body.get('customer_email')).toBe('hosted-pay@example.com');
    expect(checkoutRequest.body.get('line_items[0][price_data][unit_amount]')).toBe(String(paymentLink!.balanceDue));
    expect(checkoutRequest.body.get('metadata[billing_payment_link_id]')).toBe(paymentLink!.paymentLinkId);
    expect(checkoutRequest.body.get('payment_intent_data[metadata][billing_document_id]')).toBe(invoice.document!.documentId);
    expect(checkoutRequest.idempotencyKey).toContain(paymentLink!.paymentLinkId);

    process.env.STRIPE_SECRET_KEY = 'sk_test_hosted_invoice';
    const stripeFetch = vi.fn(async (_url: RequestInfo | URL, init?: RequestInit) => {
      expect(String(_url)).toBe('https://api.stripe.com/v1/checkout/sessions');
      expect(init?.headers).toMatchObject({
        Authorization: 'Bearer sk_test_hosted_invoice',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Idempotency-Key': checkoutRequest.idempotencyKey,
      });
      expect(String(init?.body)).toContain(`metadata%5Bbilling_document_id%5D=${encodeURIComponent(invoice.document!.documentId)}`);
      return new Response(JSON.stringify({
        id: 'cs_test_hosted_invoice',
        url: 'https://checkout.stripe.com/c/pay/cs_test_hosted_invoice',
      }), { status: 200 });
    });
    await expect(createBillingDocumentStripeCheckoutSession(paymentLink!, {
      origin: 'https://law.example.test',
      fetchImpl: stripeFetch,
    })).resolves.toMatchObject({
      ok: true,
      sessionId: 'cs_test_hosted_invoice',
      url: 'https://checkout.stripe.com/c/pay/cs_test_hosted_invoice',
    });
    expect(stripeFetch).toHaveBeenCalledTimes(1);

    const webhook = normalizeBillingDocumentStripeWebhookPayload({
      id: 'evt_hosted_invoice_paid',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_hosted_invoice',
          payment_status: 'paid',
          amount_total: paymentLink!.balanceDue,
          currency: paymentLink!.currency.toLowerCase(),
          payment_intent: 'pi_stripe_hosted_invoice',
          metadata: {
            billing_source: 'order',
            billing_owner_id: order.orderId,
            billing_document_id: invoice.document!.documentId,
            billing_payment_link_id: paymentLink!.paymentLinkId,
            billing_document_number: paymentLink!.number,
          },
        },
      },
    });
    expect(webhook).toMatchObject({
      source: 'order',
      status: 'paid',
      amount: paymentLink!.balanceDue,
      currency: paymentLink!.currency,
      providerPaymentId: 'pi_stripe_hosted_invoice',
    });

    const settled = await settleBillingDocumentHostedPayment(webhook!);
    expect(settled.changed).toBe(true);
    expect(settled.order?.payment).toMatchObject({
      status: 'paid',
      label: 'Stripe Checkout',
      stub: false,
      referenceId: 'pi_stripe_hosted_invoice',
    });
    const paidRow = await getBillingDocument('order', order.orderId, invoice.document!.documentId);
    expect(paidRow?.paymentLinkStatus).toBe('unavailable');
    expect(paidRow?.paymentLinkPath).toBe('');
    const paymentEvents = await listNotificationEvents({ locale: 'ko', type: 'billing.payment_received.customer' });
    expect(paymentEvents).toHaveLength(1);
    expect(paymentEvents[0]).toMatchObject({
      type: 'billing.payment_received.customer',
      recipient: { email: order.customer.email },
      payload: {
        source: 'order',
        ownerId: order.orderId,
        documentId: invoice.document!.documentId,
        documentNumber: invoice.document!.number,
        paymentId: 'evt_hosted_invoice_paid',
        paymentMethod: 'hosted',
        provider: 'stripe',
        amount: paymentLink!.balanceDue,
      },
    });

    const automation = await runOrderBillingAutomation(order.orderId, { trigger: 'paid' });
    expect(automation?.actions).toMatchObject([{ type: 'receipt', created: true }]);

    const duplicate = await settleBillingDocumentHostedPayment(webhook!);
    expect(duplicate.changed).toBe(false);
    expect(duplicate.error).toBeUndefined();
    expect(await listNotificationEvents({ locale: 'ko', type: 'billing.payment_received.customer' })).toHaveLength(1);

    const failedWebhook = normalizeBillingDocumentStripeWebhookPayload({
      id: 'evt_hosted_invoice_failed',
      type: 'payment_intent.payment_failed',
      data: {
        object: {
          id: 'pi_stripe_failed_invoice',
          amount: paymentLink!.balanceDue,
          currency: paymentLink!.currency.toLowerCase(),
          metadata: {
            billing_source: 'order',
            billing_owner_id: order.orderId,
            billing_document_id: invoice.document!.documentId,
            billing_payment_link_id: paymentLink!.paymentLinkId,
          },
        },
      },
    });
    expect(failedWebhook?.status).toBe('failed');
  });

  it('stores, deduplicates, and replays billing document Stripe webhook events', async () => {
    const address = normalizeCheckoutAddress({
      country: 'TW',
      region: 'Taipei',
      city: 'Taipei',
      postalCode: '100',
      addressLine1: 'No. 5 Webhook Road',
    });
    const cart = upsertCartItem(makeEmptyCart('ko', 'TWD'), item({ itemId: makeCartItemId('product-billing-webhook') }), 1);
    const quote = createCommerceCheckoutQuote(cart, 'ko', 'pickup', address);
    const order = await createOrder({
      confirmationNumber: 'TSENG-20260520-BDWH',
      locale: 'ko',
      currency: 'TWD',
      customer: { name: 'Billing Webhook Client', email: 'billing-webhook@example.com' },
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
        referenceId: 'pi_billing_webhook_seed',
      },
      now: '2026-05-20T00:00:00.000Z',
    });
    const invoice = await issueOrderDocument(order.orderId, { type: 'invoice', actor: 'admin' });
    const paymentLink = await createBillingDocumentPaymentLink('order', order.orderId, invoice.document!.documentId);
    const webhook = normalizeBillingDocumentStripeWebhookPayload({
      id: 'evt_billing_document_webhook_paid',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_billing_document_webhook',
          payment_status: 'paid',
          amount_total: paymentLink!.balanceDue,
          currency: paymentLink!.currency.toLowerCase(),
          payment_intent: 'pi_billing_document_webhook',
          metadata: {
            billing_source: 'order',
            billing_owner_id: order.orderId,
            billing_document_id: invoice.document!.documentId,
            billing_payment_link_id: paymentLink!.paymentLinkId,
            billing_document_number: paymentLink!.number,
          },
        },
      },
    });

    const received = await receiveBillingDocumentWebhookEvent(webhook!, { signatureVerified: true });
    expect(received.duplicate).toBe(false);
    expect(received.changed).toBe(true);
    expect(received.event).toMatchObject({
      status: 'processed',
      changed: true,
      replayCount: 0,
      signatureVerified: true,
      providerEventId: 'evt_billing_document_webhook_paid',
    });
    expect(received.document).toMatchObject({
      source: 'order',
      ownerId: order.orderId,
      documentId: invoice.document!.documentId,
      paymentLinkStatus: 'unavailable',
    });
    expect(await listNotificationEvents({ locale: 'ko', type: 'billing.payment_received.customer' })).toHaveLength(1);

    const duplicate = await receiveBillingDocumentWebhookEvent(webhook!, { signatureVerified: true });
    expect(duplicate.duplicate).toBe(true);
    expect(duplicate.changed).toBe(false);
    expect(duplicate.reason).toBe('duplicate_event');
    expect(await listNotificationEvents({ locale: 'ko', type: 'billing.payment_received.customer' })).toHaveLength(1);

    let events = await listBillingDocumentWebhookEvents();
    expect(events).toHaveLength(1);
    expect(summarizeBillingDocumentWebhookEvents(events)).toMatchObject({
      total: 1,
      processed: 1,
      failed: 0,
      ignored: 0,
      replayed: 0,
    });

    const replayed = await replayBillingDocumentWebhookEvent(received.event.eventId);
    expect(replayed.event).toMatchObject({
      eventId: received.event.eventId,
      status: 'processed',
      replayCount: 1,
    });
    expect(replayed.changed).toBe(false);
    expect(await listNotificationEvents({ locale: 'ko', type: 'billing.payment_received.customer' })).toHaveLength(1);

    const failedWebhook = normalizeBillingDocumentStripeWebhookPayload({
      id: 'evt_billing_document_webhook_failed',
      type: 'payment_intent.payment_failed',
      data: {
        object: {
          id: 'pi_billing_document_webhook_failed',
          amount: paymentLink!.balanceDue,
          currency: paymentLink!.currency.toLowerCase(),
          metadata: {
            billing_source: 'order',
            billing_owner_id: order.orderId,
            billing_document_id: invoice.document!.documentId,
            billing_payment_link_id: paymentLink!.paymentLinkId,
          },
        },
      },
    });
    const ignored = await receiveBillingDocumentWebhookEvent(failedWebhook!, { signatureVerified: true });
    expect(ignored.changed).toBe(false);
    expect(ignored.event).toMatchObject({
      status: 'ignored',
      error: 'failed',
    });

    events = await listBillingDocumentWebhookEvents();
    expect(events).toHaveLength(2);
    expect(summarizeBillingDocumentWebhookEvents(events)).toMatchObject({
      total: 2,
      processed: 1,
      ignored: 1,
      replayed: 1,
    });
  });

  it('revokes order payment links after partial manual payment', async () => {
    const address = normalizeCheckoutAddress({
      country: 'TW',
      region: 'Taipei',
      city: 'Taipei',
      postalCode: '100',
      addressLine1: 'No. 6 Road',
    });
    const cart = upsertCartItem(makeEmptyCart('ko', 'TWD'), item({ itemId: makeCartItemId('product-order-partial-docs') }), 1);
    const quote = createCommerceCheckoutQuote(cart, 'ko', 'pickup', address);
    const order = await createOrder({
      confirmationNumber: 'TSENG-20260520-OPART',
      locale: 'ko',
      currency: 'TWD',
      customer: { name: 'Order Partial Client', email: 'order-partial@example.com' },
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
        referenceId: 'pi_order_partial_paylink',
      },
      now: '2026-05-20T00:00:00.000Z',
    });
    const invoice = await issueOrderDocument(order.orderId, { type: 'invoice', actor: 'admin' });
    const paymentLink = await createBillingDocumentPaymentLink('order', order.orderId, invoice.document!.documentId);
    expect(paymentLink?.paymentLinkStatus).toBe('active');
    const staleToken = new URL(`http://localhost${paymentLink!.paymentLinkPath}`).searchParams.get('token');
    expect(validateBillingDocumentPaymentToken(paymentLink!, staleToken)).toBe(true);

    const partial = await recordOrderManualPayment(order.orderId, {
      amountCents: 4000,
      idempotencyKey: 'order-partial-manual-key',
      method: 'bank_transfer',
      reference: 'ORDER-WIRE-1',
    });
    expect(partial.error).toBeUndefined();
    expect(partial.order?.payment.status).toBe('partially_paid');
    const duplicate = await recordOrderManualPayment(order.orderId, {
      amountCents: 4000,
      idempotencyKey: 'order-partial-manual-key',
      method: 'bank_transfer',
      reference: 'ORDER-WIRE-1',
    });
    expect(duplicate.manualPayment?.paymentId).toBe(partial.manualPayment?.paymentId);
    expect(duplicate.order?.manualPayments).toHaveLength(1);

    const row = await getBillingDocument('order', order.orderId, invoice.document!.documentId);
    expect(row?.balanceDue).toBe(order.totals.grandTotalCents - 4000);
    expect(row?.paymentLinkStatus).toBe('revoked');
    expect(row?.paymentLinkRevokedReason).toBe('balance_changed');
    expect(row?.paymentLinkRevokedBalanceDue).toBe(order.totals.grandTotalCents - 4000);
    expect(row?.paymentLinkRevokedByPaymentId).toBe(partial.manualPayment?.paymentId);
    expect(row?.paymentReconciliationStatus).toBe('renew_required');
    expect(row?.paymentReconciliationStatusLabel).toBe('Balance changed; renew pay link');
    expect(row?.paymentLinkRenewalNeeded).toBe(true);
    expect(row?.paymentLinkRenewalReason).toBe('balance_changed');
    expect(row?.paymentLinkPath).toBe('');
    expect(row?.paymentLinkEvents).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'created', paymentLinkId: paymentLink?.paymentLinkId }),
      expect.objectContaining({
        type: 'revoked',
        actor: 'system',
        reason: 'balance_changed',
        balanceDue: order.totals.grandTotalCents - 4000,
        paymentId: partial.manualPayment?.paymentId,
      }),
    ]));
    expect(row && billingDocumentCanPay(row)).toBe(false);
    expect(row && validateBillingDocumentPaymentToken(row, staleToken)).toBe(false);

    const renewed = await createBillingDocumentPaymentLink('order', order.orderId, invoice.document!.documentId, { renew: true });
    expect(renewed?.paymentLinkStatus).toBe('active');
    expect(renewed?.paymentReconciliationStatus).toBe('current');
    expect(renewed?.paymentLinkRenewalNeeded).toBe(false);
    expect(renewed?.paymentLinkRevokedReason).toBeUndefined();
    expect(renewed?.paymentLinkPath).toContain('/api/billing-documents/order/');
    expect(renewed?.paymentLinkEvents.map((event) => event.type)).toEqual(['created', 'revoked', 'renewed']);
  });

  it('revokes booking payment links after partial manual payment and rejects stale hosted settlements', async () => {
    await saveService(service());
    await saveStaff(staff());
    await saveBooking(booking({
      bookingId: 'bk-partial-paylink',
      paymentStatus: 'unpaid',
      paymentIntentId: 'pi_booking_partial_paylink',
      billingDocuments: [],
    }));

    const invoice = await issueBookingBillingDocument('bk-partial-paylink', { type: 'invoice' });
    const paymentLink = await createBillingDocumentPaymentLink(
      'booking',
      'bk-partial-paylink',
      invoice.document.documentId,
    );
    expect(paymentLink?.paymentLinkStatus).toBe('active');
    expect(paymentLink && billingDocumentCanPay(paymentLink)).toBe(true);

    const staleToken = new URL(`http://localhost${paymentLink!.paymentLinkPath}`).searchParams.get('token');
    expect(validateBillingDocumentPaymentToken(paymentLink!, staleToken)).toBe(true);

    const partial = await recordBookingManualPayment('bk-partial-paylink', {
      amountCents: 2000,
      idempotencyKey: 'booking-partial-manual-key',
      method: 'bank_transfer',
      reference: 'WIRE-PARTIAL-1',
    });
    expect(partial.error).toBeUndefined();
    expect(partial.booking?.paymentStatus).toBe('partially_paid');
    const duplicate = await recordBookingManualPayment('bk-partial-paylink', {
      amountCents: 2000,
      idempotencyKey: 'booking-partial-manual-key',
      method: 'bank_transfer',
      reference: 'WIRE-PARTIAL-1',
    });
    expect(duplicate.manualPayment?.paymentId).toBe(partial.manualPayment?.paymentId);
    expect(duplicate.booking?.manualPayments).toHaveLength(1);

    const row = await getBillingDocument('booking', 'bk-partial-paylink', invoice.document.documentId);
    expect(row?.balanceDue).toBe(3000);
    expect(row?.paymentLinkStatus).toBe('revoked');
    expect(row?.paymentLinkRevokedReason).toBe('balance_changed');
    expect(row?.paymentLinkRevokedBalanceDue).toBe(3000);
    expect(row?.paymentLinkRevokedByPaymentId).toBe(partial.manualPayment?.paymentId);
    expect(row?.paymentReconciliationStatus).toBe('renew_required');
    expect(row?.paymentLinkRenewalNeeded).toBe(true);
    expect(row?.paymentLinkPath).toBe('');
    expect(row?.paymentLinkEvents).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'created', paymentLinkId: paymentLink?.paymentLinkId }),
      expect.objectContaining({
        type: 'revoked',
        actor: 'system',
        reason: 'balance_changed',
        balanceDue: 3000,
        paymentId: partial.manualPayment?.paymentId,
      }),
    ]));
    expect(row && billingDocumentCanPay(row)).toBe(false);
    expect(row && validateBillingDocumentPaymentToken(row, staleToken)).toBe(false);

    const staleHostedSettlement = await settleBillingDocumentHostedPayment({
      source: 'booking',
      ownerId: 'bk-partial-paylink',
      documentId: invoice.document.documentId,
      paymentLinkId: paymentLink!.paymentLinkId!,
      amount: 5000,
      currency: 'TWD',
      provider: 'stripe',
      providerEventId: 'evt_booking_stale_amount',
      providerPaymentId: 'pi_stale_amount',
    });
    expect(staleHostedSettlement.changed).toBe(false);
    expect(staleHostedSettlement.error).toBe('amount_mismatch');
    expect(staleHostedSettlement.booking).toBeNull();

    const matchingAmountSettlement = await settleBillingDocumentHostedPayment({
      source: 'booking',
      ownerId: 'bk-partial-paylink',
      documentId: invoice.document.documentId,
      paymentLinkId: paymentLink!.paymentLinkId!,
      amount: 3000,
      currency: 'TWD',
      provider: 'stripe',
      providerEventId: 'evt_booking_revoked_link',
      providerPaymentId: 'pi_revoked_link',
    });
    expect(matchingAmountSettlement.changed).toBe(false);
    expect(matchingAmountSettlement.error).toBe('payment_link_not_payable');

    const unchanged = await getBillingDocument('booking', 'bk-partial-paylink', invoice.document.documentId);
    expect(unchanged?.paymentStatus).toBe('partially_paid');
    expect(unchanged?.balanceDue).toBe(3000);
  });

  it('keeps number reservations auditable and supports void/supersede lifecycle', async () => {
    await saveService(service());
    await saveStaff(staff());
    await saveBooking(booking({
      bookingId: 'bk-number-lifecycle',
      paymentStatus: 'unpaid',
      paymentIntentId: 'pi_booking_number_lifecycle',
      billingDocuments: [],
    }));

    bookingFixtures.saveBooking.mockRejectedValueOnce(new Error('save failed'));
    await expect(issueBookingBillingDocument('bk-number-lifecycle', { type: 'invoice' })).rejects.toThrow('save failed');
    const failedReservation = (await listBillingDocumentNumberReservations()).find((entry) => entry.type === 'invoice');
    expect(failedReservation).toMatchObject({
      number: expect.stringMatching(/^INV-\d{4}-000001$/),
      status: 'voided',
      voidReason: 'booking_document_save_failed',
    });

    const bookingInvoice = await issueBookingBillingDocument('bk-number-lifecycle', { type: 'invoice' });
    expect(bookingInvoice.document.number).toMatch(/^INV-\d{4}-000002$/);
    const bookingShare = await createBillingDocumentShareLink('booking', 'bk-number-lifecycle', bookingInvoice.document.documentId);
    expect(bookingShare?.shareStatus).toBe('active');
    const bookingPay = await createBillingDocumentPaymentLink('booking', 'bk-number-lifecycle', bookingInvoice.document.documentId);
    expect(bookingPay?.paymentLinkStatus).toBe('active');

    const voidedBooking = await voidBuilderBillingDocument('booking', 'bk-number-lifecycle', bookingInvoice.document.documentId, {
      reason: 'client cancelled invoice',
    });
    expect(voidedBooking?.status).toBe('voided');
    expect(voidedBooking?.shareStatus).toBe('revoked');
    expect(voidedBooking?.paymentLinkStatus).toBe('unavailable');
    expect(voidedBooking?.paymentLinkPath).toBe('');

    const replacementBookingInvoice = await issueBookingBillingDocument('bk-number-lifecycle', { type: 'invoice' });
    expect(replacementBookingInvoice.document.number).toMatch(/^INV-\d{4}-000003$/);
    const bookingSupersede = await supersedeBuilderBillingDocument(
      'booking',
      'bk-number-lifecycle',
      replacementBookingInvoice.document.documentId,
      { reason: 'corrected booking recipient' },
    );
    expect(bookingSupersede.supersededDocument?.status).toBe('superseded');
    expect(bookingSupersede.supersededDocument?.supersededByDocumentId).toBe(bookingSupersede.document?.documentId);
    expect(bookingSupersede.document?.number).toMatch(/^INV-\d{4}-000004$/);
    expect(bookingSupersede.document?.supersedesDocumentId).toBe(replacementBookingInvoice.document.documentId);

    const address = normalizeCheckoutAddress({
      country: 'TW',
      region: 'Taipei',
      city: 'Taipei',
      postalCode: '100',
      addressLine1: 'No. 3 Road',
    });
    const cart = upsertCartItem(makeEmptyCart('ko', 'TWD'), item({ itemId: makeCartItemId('product-lifecycle-docs') }), 1);
    const quote = createCommerceCheckoutQuote(cart, 'ko', 'pickup', address);
    const order = await createOrder({
      confirmationNumber: 'TSENG-20260520-LIFE',
      locale: 'ko',
      currency: 'TWD',
      customer: { name: 'Lifecycle Order Client', email: 'lifecycle-order@example.com' },
      shippingAddress: address,
      lineItems: cart.items,
      shipping: quote.shipping,
      tax: quote.tax,
      totals: quote.totals,
      payment: { adapter: 'sandbox-card', status: 'authorized_stub', label: 'Sandbox', stub: true, referenceId: 'pi_lifecycle_docs' },
      now: '2026-05-20T00:00:00.000Z',
    });
    const orderInvoice = await issueOrderDocument(order.orderId, { type: 'invoice', actor: 'admin' });
    expect(orderInvoice.document?.number).toMatch(/^INV-\d{4}-000005$/);
    const orderSupersede = await supersedeBuilderBillingDocument('order', order.orderId, orderInvoice.document!.documentId, {
      reason: 'corrected order totals note',
    });
    expect(orderSupersede.supersededDocument?.status).toBe('superseded');
    expect(orderSupersede.document?.number).toMatch(/^INV-\d{4}-000006$/);

    const reservations = await listBillingDocumentNumberReservations();
    expect(reservations.filter((entry) => entry.type === 'invoice').map((entry) => entry.status)).toEqual([
      'voided',
      'issued',
      'issued',
      'issued',
      'issued',
      'issued',
    ]);
  });

  it('serializes concurrent invoice number reservations', async () => {
    const issuedAt = '2026-05-20T00:00:00.000Z';
    const reservations = await Promise.all(
      Array.from({ length: 20 }, () => reserveBillingDocumentNumber('invoice', issuedAt)),
    );
    const numbers = reservations.map((entry) => entry.number).sort();
    const sequences = reservations.map((entry) => entry.sequence).sort((left, right) => left - right);

    expect(new Set(numbers).size).toBe(20);
    expect(sequences).toEqual(Array.from({ length: 20 }, (_, index) => index + 1));
    expect(numbers[0]).toBe('INV-2026-000001');
    expect(numbers[19]).toBe('INV-2026-000020');

    const ledger = await listBillingDocumentNumberReservations();
    expect(ledger.filter((entry) => entry.type === 'invoice')).toHaveLength(20);
  });
});
