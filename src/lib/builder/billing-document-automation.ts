import { promises as fs } from 'fs';
import path from 'path';
import { get, put } from '@vercel/blob';
import {
  issueOrderDocument,
  loadOrder,
  markOrderDocumentEmailed,
  type CommerceOrder,
  type CommerceOrderDocument,
  type CommerceOrderDocumentType,
} from '@/lib/builder/commerce/orders-engine';
import { queueOrderDocumentNotification } from '@/lib/builder/commerce/notifications-engine';
import {
  BookingBillingDocumentError,
  issueBookingBillingDocument,
  markBookingBillingDocumentEmailed,
} from '@/lib/builder/bookings/billing-documents';
import { sendBookingBillingDocument } from '@/lib/builder/bookings/notifications';
import { getBooking, getService, getStaff } from '@/lib/builder/bookings/storage';
import type { Booking, BookingBillingDocument, BookingBillingDocumentType, BookingService } from '@/lib/builder/bookings/types';

type CommerceBackend = 'blob' | 'file';
export type BillingAutomationTarget = 'orders' | 'bookings';
type BillingAutomationRuleKey = 'invoiceOnCreate' | 'receiptOnPaid';
export type BillingManualPaymentMethod = 'bank_transfer' | 'cash' | 'check' | 'other';

export const BILLING_DOCUMENT_AUTOMATION_VERSION = 1;

export interface BillingDocumentAutomationRule {
  enabled: boolean;
  email: boolean;
}

export interface BillingManualPaymentInstruction {
  enabled: boolean;
  title: string;
  instructions: string;
}

export type BillingManualPaymentInstructionMap = Record<BillingManualPaymentMethod, BillingManualPaymentInstruction>;

export interface BillingDocumentAutomationSettings {
  version: typeof BILLING_DOCUMENT_AUTOMATION_VERSION;
  orders: Record<BillingAutomationRuleKey, BillingDocumentAutomationRule>;
  bookings: Record<BillingAutomationRuleKey, BillingDocumentAutomationRule>;
  manualPayments: Record<BillingAutomationTarget, BillingManualPaymentInstructionMap>;
  updatedAt: string;
}

export interface BillingDocumentAutomationAction {
  source: 'order' | 'booking';
  ownerId: string;
  type: 'invoice' | 'receipt';
  documentId?: string;
  number?: string;
  created: boolean;
  emailed: boolean;
  skipped?: string;
  error?: string;
}

export interface BillingDocumentAutomationResult<T> {
  owner: T;
  actions: BillingDocumentAutomationAction[];
}

export interface BillingManualPaymentInstructionEntry extends BillingManualPaymentInstruction {
  method: BillingManualPaymentMethod;
}

const SETTINGS_BLOB = 'builder-commerce/billing-documents/settings.json';
const DEFAULT_COMMERCE_ROOT = path.join(process.cwd(), 'runtime-data', 'builder-commerce');
const MANUAL_PAYMENT_METHODS: BillingManualPaymentMethod[] = ['bank_transfer', 'cash', 'check', 'other'];

function manualPaymentMethodTitle(method: BillingManualPaymentMethod): string {
  switch (method) {
    case 'bank_transfer':
      return 'Bank transfer';
    case 'cash':
      return 'Cash';
    case 'check':
      return 'Check';
    case 'other':
    default:
      return 'Other';
  }
}

function defaultInstructionMap(): BillingManualPaymentInstructionMap {
  return MANUAL_PAYMENT_METHODS.reduce((settings, method) => ({
    ...settings,
    [method]: {
      enabled: false,
      title: manualPaymentMethodTitle(method),
      instructions: '',
    },
  }), {} as BillingManualPaymentInstructionMap);
}

export const DEFAULT_BILLING_DOCUMENT_AUTOMATION_SETTINGS: BillingDocumentAutomationSettings = {
  version: BILLING_DOCUMENT_AUTOMATION_VERSION,
  orders: {
    invoiceOnCreate: { enabled: false, email: false },
    receiptOnPaid: { enabled: false, email: false },
  },
  bookings: {
    invoiceOnCreate: { enabled: false, email: false },
    receiptOnPaid: { enabled: false, email: false },
  },
  manualPayments: {
    orders: defaultInstructionMap(),
    bookings: defaultInstructionMap(),
  },
  updatedAt: '2026-05-20T00:00:00.000Z',
};

function getBackend(): CommerceBackend {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return 'file';
  if (process.env.CONSULTATION_LOG_BACKEND === 'local') return 'file';
  if (process.env.BUILDER_COMMERCE_BACKEND === 'local') return 'file';
  if (process.env.NODE_ENV !== 'production' && process.env.BUILDER_USE_BLOB_IN_DEV !== '1') return 'file';
  return 'blob';
}

function commerceRoot(): string {
  return process.env.BUILDER_COMMERCE_ROOT?.trim() || DEFAULT_COMMERCE_ROOT;
}

function settingsFilePath(): string {
  return path.join(commerceRoot(), 'billing-documents', 'settings.json');
}

async function writeJson(blobPath: string, filePath: string, data: unknown): Promise<void> {
  const body = JSON.stringify(data, null, 2);
  if (getBackend() === 'blob') {
    await put(blobPath, body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, body, 'utf8');
}

async function readJson<T>(blobPath: string, filePath: string): Promise<T | null> {
  try {
    if (getBackend() === 'blob') {
      const result = await get(blobPath, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        return JSON.parse(await new Response(result.stream).text()) as T;
      }
      return null;
    }

    return JSON.parse(await fs.readFile(filePath, 'utf8')) as T;
  } catch {
    return null;
  }
}

function normalizeRule(input: unknown, defaults: BillingDocumentAutomationRule): BillingDocumentAutomationRule {
  const source = input && typeof input === 'object' ? input as Partial<BillingDocumentAutomationRule> : {};
  const enabled = typeof source.enabled === 'boolean' ? source.enabled : defaults.enabled;
  return {
    enabled,
    email: enabled && typeof source.email === 'boolean' ? source.email : defaults.email,
  };
}

function normalizeTarget(
  input: unknown,
  defaults: Record<BillingAutomationRuleKey, BillingDocumentAutomationRule>,
): Record<BillingAutomationRuleKey, BillingDocumentAutomationRule> {
  const source = input && typeof input === 'object'
    ? input as Partial<Record<BillingAutomationRuleKey, unknown>>
    : {};
  return {
    invoiceOnCreate: normalizeRule(source.invoiceOnCreate, defaults.invoiceOnCreate),
    receiptOnPaid: normalizeRule(source.receiptOnPaid, defaults.receiptOnPaid),
  };
}

function trimBounded(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function normalizeInstruction(input: unknown, method: BillingManualPaymentMethod): BillingManualPaymentInstruction {
  const source = input && typeof input === 'object' ? input as Partial<BillingManualPaymentInstruction> : {};
  const title = trimBounded(source.title, 80) || manualPaymentMethodTitle(method);
  return {
    enabled: Boolean(source.enabled),
    title,
    instructions: trimBounded(source.instructions, 900),
  };
}

function normalizeInstructionMap(input: unknown): BillingManualPaymentInstructionMap {
  const source = input && typeof input === 'object'
    ? input as Partial<Record<BillingManualPaymentMethod, unknown>>
    : {};
  return MANUAL_PAYMENT_METHODS.reduce((settings, method) => ({
    ...settings,
    [method]: normalizeInstruction(source[method], method),
  }), {} as BillingManualPaymentInstructionMap);
}

function normalizeManualPaymentInstructions(
  input: unknown,
): Record<BillingAutomationTarget, BillingManualPaymentInstructionMap> {
  const source = input && typeof input === 'object'
    ? input as Partial<Record<BillingAutomationTarget, unknown>>
    : {};
  return {
    orders: normalizeInstructionMap(source.orders),
    bookings: normalizeInstructionMap(source.bookings),
  };
}

export function normalizeBillingDocumentAutomationSettings(
  input: unknown,
  now = new Date().toISOString(),
): BillingDocumentAutomationSettings {
  const source = input && typeof input === 'object' ? input as Partial<BillingDocumentAutomationSettings> : {};
  const defaults = DEFAULT_BILLING_DOCUMENT_AUTOMATION_SETTINGS;
  return {
    version: BILLING_DOCUMENT_AUTOMATION_VERSION,
    orders: normalizeTarget(source.orders, defaults.orders),
    bookings: normalizeTarget(source.bookings, defaults.bookings),
    manualPayments: normalizeManualPaymentInstructions(source.manualPayments),
    updatedAt: typeof source.updatedAt === 'string' ? source.updatedAt : now,
  };
}

export function billingManualPaymentInstructionsForTarget(
  settings: BillingDocumentAutomationSettings,
  target: BillingAutomationTarget,
): BillingManualPaymentInstructionEntry[] {
  return MANUAL_PAYMENT_METHODS
    .map((method) => ({
      method,
      ...settings.manualPayments[target][method],
    }))
    .filter((entry) => entry.enabled && entry.instructions.trim().length > 0);
}

export async function loadBillingDocumentAutomationSettings(): Promise<BillingDocumentAutomationSettings> {
  const parsed = await readJson<BillingDocumentAutomationSettings>(SETTINGS_BLOB, settingsFilePath());
  return normalizeBillingDocumentAutomationSettings(parsed ?? DEFAULT_BILLING_DOCUMENT_AUTOMATION_SETTINGS);
}

export async function saveBillingDocumentAutomationSettings(input: unknown): Promise<BillingDocumentAutomationSettings> {
  const next = normalizeBillingDocumentAutomationSettings(input, new Date().toISOString());
  const saved = { ...next, updatedAt: new Date().toISOString() };
  await writeJson(SETTINGS_BLOB, settingsFilePath(), saved);
  return saved;
}

function ruleForTrigger(
  settings: BillingDocumentAutomationSettings,
  target: BillingAutomationTarget,
  trigger: 'created' | 'paid',
): Array<[CommerceOrderDocumentType, BillingDocumentAutomationRule]> {
  const group = settings[target];
  if (trigger === 'created') {
    return [
      ['invoice', group.invoiceOnCreate],
      ['receipt', group.receiptOnPaid],
    ];
  }
  return [['receipt', group.receiptOnPaid]];
}

async function emailOrderDocument(
  order: CommerceOrder,
  document: CommerceOrderDocument,
): Promise<{ document: CommerceOrderDocument; order: CommerceOrder; emailed: boolean }> {
  if (document.status === 'emailed_stub') {
    return { order, document, emailed: false };
  }
  const notification = await queueOrderDocumentNotification(order, document);
  const emailed = await markOrderDocumentEmailed(order.orderId, document.documentId, {
    notificationEventId: notification.eventId,
    actor: 'system',
  });
  return {
    order: emailed.order ?? order,
    document: emailed.document ?? document,
    emailed: true,
  };
}

async function emailBookingDocument(
  booking: Booking,
  document: BookingBillingDocument,
  service: BookingService | null = null,
): Promise<{ booking: Booking; document: BookingBillingDocument; emailed: boolean }> {
  if (document.status === 'emailed_stub') {
    return { booking, document, emailed: false };
  }
  const [resolvedService, staff] = await Promise.all([
    service ? Promise.resolve(service) : getService(booking.serviceId),
    getStaff(booking.staffId),
  ]);
  await sendBookingBillingDocument(booking, document, { service: resolvedService, staff });
  const emailed = await markBookingBillingDocumentEmailed(booking.bookingId, document.documentId);
  return { booking: emailed.booking, document: emailed.document, emailed: true };
}

export async function runOrderBillingAutomation(
  orderOrId: CommerceOrder | string,
  options: {
    trigger: 'created' | 'paid';
    settings?: BillingDocumentAutomationSettings;
  },
): Promise<BillingDocumentAutomationResult<CommerceOrder> | null> {
  const orderId = typeof orderOrId === 'string' ? orderOrId : orderOrId.orderId;
  const settings = options.settings ?? await loadBillingDocumentAutomationSettings();
  let current = await loadOrder(orderId);
  if (!current) return null;

  const actions: BillingDocumentAutomationAction[] = [];
  for (const [type, rule] of ruleForTrigger(settings, 'orders', options.trigger)) {
    if (!rule.enabled) continue;
    if (type === 'receipt' && current.payment.status !== 'paid') {
      actions.push({
        source: 'order',
        ownerId: current.orderId,
        type,
        created: false,
        emailed: false,
        skipped: 'receipt_requires_paid_order',
      });
      continue;
    }

    const issued = await issueOrderDocument(current.orderId, {
      type,
      actor: 'system',
      notes: 'Automatically issued by billing document policy.',
    });
    if (!issued.order || !issued.document) {
      actions.push({
        source: 'order',
        ownerId: current.orderId,
        type,
        created: false,
        emailed: false,
        error: issued.error ?? 'document_issue_failed',
      });
      continue;
    }

    current = issued.order;
    let document = issued.document;
    let emailed = false;
    if (rule.email) {
      const emailResult = await emailOrderDocument(current, document);
      current = emailResult.order;
      document = emailResult.document;
      emailed = emailResult.emailed;
    }

    actions.push({
      source: 'order',
      ownerId: current.orderId,
      type,
      documentId: document.documentId,
      number: document.number,
      created: issued.created,
      emailed,
    });
  }

  return { owner: current, actions };
}

export async function runBookingBillingAutomation(
  bookingOrId: Booking | string,
  options: {
    trigger: 'created' | 'paid';
    settings?: BillingDocumentAutomationSettings;
  },
): Promise<BillingDocumentAutomationResult<Booking> | null> {
  const bookingId = typeof bookingOrId === 'string' ? bookingOrId : bookingOrId.bookingId;
  const settings = options.settings ?? await loadBillingDocumentAutomationSettings();
  let current = await getBooking(bookingId);
  if (!current) return null;

  const actions: BillingDocumentAutomationAction[] = [];
  for (const [type, rule] of ruleForTrigger(settings, 'bookings', options.trigger) as Array<[BookingBillingDocumentType, BillingDocumentAutomationRule]>) {
    if (!rule.enabled) continue;
    if (type === 'receipt' && current.paymentStatus !== 'paid') {
      actions.push({
        source: 'booking',
        ownerId: current.bookingId,
        type,
        created: false,
        emailed: false,
        skipped: 'receipt_requires_paid_booking',
      });
      continue;
    }

    try {
      const issued = await issueBookingBillingDocument(current.bookingId, {
        type,
        actor: 'system',
        notes: 'Automatically issued by billing document policy.',
      });
      current = issued.booking;
      let document = issued.document;
      let emailed = false;
      if (rule.email) {
        const emailResult = await emailBookingDocument(current, document, issued.service);
        current = emailResult.booking;
        document = emailResult.document;
        emailed = emailResult.emailed;
      }

      actions.push({
        source: 'booking',
        ownerId: current.bookingId,
        type,
        documentId: document.documentId,
        number: document.number,
        created: !issued.reused,
        emailed,
      });
    } catch (error) {
      actions.push({
        source: 'booking',
        ownerId: current.bookingId,
        type,
        created: false,
        emailed: false,
        error: error instanceof BookingBillingDocumentError ? error.code : 'document_issue_failed',
      });
    }
  }

  return { owner: current, actions };
}
