import { z } from 'zod';
import { locales, type Locale } from '@/lib/locales';
import type {
  BillingPaymentLinkHistoryEntry,
  BillingPaymentLinkHistoryReason,
} from '@/lib/builder/billing-payment-link-history';
import { isValidBookingTimezone } from './timezone';

export const dayOfWeeks = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export type DayOfWeek = (typeof dayOfWeeks)[number];

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
export type BookingSource = 'web' | 'admin';
export type BookingWaitlistStatus = 'active' | 'contacted' | 'promoted' | 'closed';
export type HolidayCalendar = 'none' | 'kr' | 'tw' | 'kr-tw';
export type BookingBillingDocumentType = 'invoice' | 'receipt';
export type BookingBillingDocumentStatus = 'issued' | 'emailed_stub' | 'voided' | 'superseded';
export type BookingBillingPaymentLinkRevokedReason = BillingPaymentLinkHistoryReason;
export const bookingEmailTemplateTypes = [
  'customer-confirmation',
  'admin-notification',
  'customer-reminder',
  'customer-cancellation',
] as const;
export type BookingEmailTemplateType = (typeof bookingEmailTemplateTypes)[number];
export type BookingReminderType =
  | 'email-confirmation'
  | 'email-reminder-24h'
  | 'email-reminder-1h'
  | 'sms-reminder-24h'
  | 'sms-reminder-1h';

export type LocalizedText = Record<Locale, string>;

// Phase F77 — Booking discount codes (service-scoped, paid-only).
export type BookingDiscountType = 'percent' | 'fixed';

export interface BookingDiscountRule {
  code: string;
  type: BookingDiscountType;
  value: number;
  active: boolean;
  locale?: Locale | 'all';
  minSubtotalAmount?: number;
  maxDiscountAmount?: number;
  startsAt?: string;
  endsAt?: string;
}

export interface BookingService {
  serviceId: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  durationMinutes: number;
  priceTwd?: number;
  image?: string;
  category?: string;
  staffIds: string[];
  requiredResourceIds?: string[];
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  maxParticipants?: number;
  slotStepMinutes?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Phase 25 — Payment mode (W196~W202).
  paymentMode?: 'free' | 'paid';
  priceAmount?: number;        // smallest currency unit (e.g. cents/won)
  priceCurrency?: 'KRW' | 'USD' | 'TWD' | 'JPY' | 'EUR';
  staffPriceOverrides?: Record<string, number>;
  resourcePriceOverrides?: Record<string, number>;
  // Phase F77 — Service-scoped discount codes (paid services only).
  discountCodes?: BookingDiscountRule[];
  /** Optional fixed amount due online at booking time; remaining balance is collected later. */
  depositAmount?: number;
  collectPaymentLater?: boolean;
  // Phase 27 — Multi-location (W212).
  allowedLocationIds?: string[];
  // Phase 26 — Meeting mode (W205).
  meetingMode?: 'in-person' | 'zoom' | 'phone' | 'hybrid';
  // Phase 26 — Cancellation policy reference (W206).
  cancellationPolicyId?: string;
  // Phase 27 — Reminder schedule offsets in hours before start (W215).
  reminderOffsetsHours?: number[];
}

// Phase 27 — Multiple offices (W212).
export interface BookingLocation {
  locationId: string;
  name: LocalizedText;
  address: LocalizedText;
  timezone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Phase 26 — Cancellation policy entity (W206).
export interface BookingCancellationPolicy {
  policyId: string;
  name: string;
  description?: string;
  /** Minimum hours before start required to cancel at all. */
  cancelHoursBefore: number;
  /** Minimum hours before start required to reschedule at all. */
  rescheduleHoursBefore: number;
  /** Minimum hours before start time required to cancel for full refund. */
  fullRefundHoursBefore: number;
  /** Minimum hours before start time required to cancel for partial refund. */
  partialRefundHoursBefore: number;
  /** Partial refund percentage (0~100). */
  partialRefundPercent: number;
  /** Cancellation fee percentage deducted from any refundable amount (0~100). */
  cancellationFeePercent: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Staff {
  staffId: string;
  name: LocalizedText;
  photo?: string;
  title: LocalizedText;
  bio?: LocalizedText;
  email?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookingResource {
  resourceId: string;
  name: LocalizedText;
  description?: LocalizedText;
  location?: string;
  capacity?: number;
  bufferBeforeMinutes?: number;
  bufferAfterMinutes?: number;
  weekly?: Record<DayOfWeek, AvailabilityBlock[]>;
  timezone?: string;
  recurringTemplateId?: string;
  blockedDates?: BlockedDate[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BookingPackageCreditStatus = 'active' | 'used' | 'expired' | 'revoked';

export interface BookingPackage {
  packageId: string;
  name: LocalizedText;
  description?: LocalizedText;
  eligibleServiceIds: string[];
  credits: number;
  validityDays?: number;
  priceAmount?: number;
  priceCurrency?: NonNullable<BookingService['priceCurrency']>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookingPackageCreditRedemption {
  bookingId: string;
  serviceId: string;
  credits: number;
  usedAt: string;
  restoredAt?: string;
}

export interface BookingPackageCredit {
  creditId: string;
  packageId: string;
  customerEmail: string;
  customerName?: string;
  totalCredits: number;
  remainingCredits: number;
  expiresAt?: string;
  status: BookingPackageCreditStatus;
  note?: string;
  redemptions?: BookingPackageCreditRedemption[];
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilityBlock {
  start: string;
  end: string;
}

export interface BlockedDate {
  start: string;
  end: string;
  reason?: string;
}

const timeSchema = z.string().regex(/^\d{2}:\d{2}$/);

export const availabilityBlockSchema = z.object({
  start: timeSchema,
  end: timeSchema,
}).refine((value) => value.start < value.end, {
  message: 'Availability start must be before end.',
});

const weeklyAvailabilitySchema = z.object(
  Object.fromEntries(dayOfWeeks.map((day) => [day, z.array(availabilityBlockSchema)])) as Record<
    DayOfWeek,
    z.ZodArray<typeof availabilityBlockSchema>
  >,
);

const staffAvailabilityDateOverrideSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  blocks: z.array(availabilityBlockSchema).default([]),
  note: z.string().trim().max(300).optional(),
});

const defaultWeeklyAvailability = Object.fromEntries(
  dayOfWeeks.map((day) => [day, day === 'saturday' || day === 'sunday' ? [] : [{ start: '09:00', end: '18:00' }]]),
) as Record<DayOfWeek, Array<{ start: string; end: string }>>;

export interface StaffAvailability {
  staffId: string;
  weekly: Record<DayOfWeek, AvailabilityBlock[]>;
  blockedDates: BlockedDate[];
  dateOverrides?: StaffAvailabilityDateOverride[];
  timezone: string;
  recurringTemplateId?: string;
  holidayCalendar?: HolidayCalendar;
}

export interface StaffAvailabilityDateOverride {
  date: string;
  blocks: AvailabilityBlock[];
  note?: string;
}

export interface BookingBillingDocument {
  documentId: string;
  type: BookingBillingDocumentType;
  number: string;
  numberReservationId?: string;
  status: BookingBillingDocumentStatus;
  currency: NonNullable<BookingService['priceCurrency']>;
  amount: number;
  refundedAmount: number;
  balanceDue: number;
  recipientEmail: string;
  recipientName: string;
  actor: string;
  issuedAt: string;
  emailedAt?: string;
  notes?: string;
  voidedAt?: string;
  voidReason?: string;
  supersedesDocumentId?: string;
  supersededByDocumentId?: string;
  shareLinkCreatedAt?: string;
  shareLinkExpiresAt?: string;
  shareLinkRevokedAt?: string;
  viewedAt?: string;
  viewCount?: number;
  downloadedAt?: string;
  downloadCount?: number;
  paymentLinkId?: string;
  paymentLinkCreatedAt?: string;
  paymentLinkExpiresAt?: string;
  paymentLinkRevokedAt?: string;
  paymentLinkRevokedReason?: BookingBillingPaymentLinkRevokedReason;
  paymentLinkRevokedBalanceDue?: number;
  paymentLinkRevokedByPaymentId?: string;
  paymentLinkEvents?: BillingPaymentLinkHistoryEntry[];
}

export type BookingPaymentStatus = 'unpaid' | 'partially_paid' | 'paid' | 'refunded' | 'partial-refund';
export type BookingManualPaymentMethod = 'cash' | 'bank_transfer' | 'check' | 'other';
export type BookingManualPaymentStatus = 'pending' | 'succeeded' | 'failed' | 'canceled';

export interface BookingManualPayment {
  paymentId: string;
  amountCents: number;
  currency: NonNullable<BookingService['priceCurrency']>;
  method: BookingManualPaymentMethod;
  reference?: string;
  note?: string;
  idempotencyKey?: string;
  status: BookingManualPaymentStatus;
  actor: 'admin' | 'system';
  createdAt: string;
}

export interface Booking {
  bookingId: string;
  serviceId: string;
  staffId: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    notes?: string;
    caseSummary?: string;
    attachmentUrls?: string[];
    customFields?: Array<{ label: string; value: string }>;
    locale: Locale;
  };
  startAt: string;
  endAt: string;
  status: BookingStatus;
  source: BookingSource;
  createdAt: string;
  updatedAt: string;
  reminders: Array<{ sentAt: string; type: BookingReminderType }>;
  // Phase 25~27 extensions.
  paymentStatus?: BookingPaymentStatus;
  paymentIntentId?: string;
  paymentAmount?: number;
  paymentCurrency?: NonNullable<BookingService['priceCurrency']>;
  paymentDueNow?: number;
  onlinePaidAmount?: number;
  depositAmount?: number;
  manualPayments?: BookingManualPayment[];
  billingDocuments?: BookingBillingDocument[];
  resourceIds?: string[];
  packageId?: string;
  packageCreditId?: string;
  packageCreditsUsed?: number;
  packageCreditRestoredAt?: string;
  meetingLink?: string;            // W205 Zoom 자동 링크
  locationId?: string;             // W212 다중 사무소
  cancellationReason?: string;     // W206
  cancelledAt?: string;            // W206
  customerTimezone?: string;       // W214
  // Phase F77 — Discount snapshot persisted at booking time.
  discountCode?: string;           // F77
  discountAmount?: number;         // F77
}

export interface BookingWaitlistEntry {
  waitlistId: string;
  serviceId: string;
  staffId: string;
  requestedDate: string;
  customer: Booking['customer'];
  customerTimezone?: string;
  status: BookingWaitlistStatus;
  source: BookingSource;
  promotedBookingId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingEmailTemplate {
  templateId: BookingEmailTemplateType;
  type: BookingEmailTemplateType;
  subject: string;
  body: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEntry {
  id: string;
  type: 'booking' | 'blocked';
  title: string;
  startAt: string;
  endAt: string;
  staffId: string;
  status?: BookingStatus;
  booking?: Booking;
  reason?: string;
}

const localizedTextSchema = z.object({
  ko: z.string().trim().min(1).max(300),
  'zh-hant': z.string().trim().min(1).max(300),
  en: z.string().trim().min(1).max(300),
});

export const bookingDiscountRuleInputSchema = z.object({
  code: z.string().trim().min(1).max(32).transform((value) => value.toUpperCase()),
  type: z.enum(['percent', 'fixed']),
  value: z.coerce.number().int().min(1).max(100_000_000),
  active: z.coerce.boolean().default(true),
  locale: z.enum(['all', 'ko', 'zh-hant', 'en']).default('all'),
  minSubtotalAmount: z.coerce.number().int().min(0).max(200_000_000).optional(),
  maxDiscountAmount: z.coerce.number().int().min(0).max(200_000_000).optional(),
  startsAt: z.string().trim().max(40).optional(),
  endsAt: z.string().trim().max(40).optional(),
}).refine((value) => value.type !== 'percent' || value.value <= 100, {
  message: 'Percent discount value cannot exceed 100.',
  path: ['value'],
});

const optionalLocalizedTextSchema = z.object({
  ko: z.string().trim().max(2000).default(''),
  'zh-hant': z.string().trim().max(2000).default(''),
  en: z.string().trim().max(2000).default(''),
});
const isoSchema = z.string().datetime({ offset: true });
const timezoneSchema = z.string().trim().min(1).max(80).refine(isValidBookingTimezone, {
  message: 'Invalid timezone.',
});
const blockedDateSchema = z.object({
  start: isoSchema,
  end: isoSchema,
  reason: z.string().trim().max(200).optional(),
}).refine((value) => value.start < value.end, {
  message: 'Blocked date start must be before end.',
});

export const bookingServiceInputSchema = z.object({
  slug: z.string().trim().min(1).max(100).regex(/^[a-z0-9-]+$/).optional(),
  name: localizedTextSchema,
  description: optionalLocalizedTextSchema,
  durationMinutes: z.coerce.number().int().min(15).max(480),
  priceTwd: z.coerce.number().int().min(0).max(2_000_000).optional(),
  image: z.string().url().or(z.literal('')).optional(),
  category: z.string().trim().max(80).optional(),
  staffIds: z.array(z.string().trim().min(1)).default([]),
  requiredResourceIds: z.array(z.string().trim().min(1)).default([]),
  bufferBeforeMinutes: z.coerce.number().int().min(0).max(240).default(0),
  bufferAfterMinutes: z.coerce.number().int().min(0).max(240).default(15),
  maxParticipants: z.coerce.number().int().min(1).max(250).default(1),
  slotStepMinutes: z.coerce.number().int().min(5).max(240).default(30),
  isActive: z.coerce.boolean().default(true),
  paymentMode: z.enum(['free', 'paid']).default('free'),
  priceAmount: z.coerce.number().int().min(0).max(200_000_000).optional(),
  priceCurrency: z.enum(['KRW', 'USD', 'TWD', 'JPY', 'EUR']).default('TWD'),
  staffPriceOverrides: z.record(
    z.string().trim().min(1).max(120),
    z.coerce.number().int().min(0).max(200_000_000),
  ).optional(),
  resourcePriceOverrides: z.record(
    z.string().trim().min(1).max(120),
    z.coerce.number().int().min(0).max(200_000_000),
  ).optional(),
  depositAmount: z.coerce.number().int().min(0).max(200_000_000).optional(),
  collectPaymentLater: z.coerce.boolean().default(false),
  discountCodes: z.array(bookingDiscountRuleInputSchema).max(20).optional(),
  meetingMode: z.enum(['in-person', 'zoom', 'phone', 'hybrid']).default('in-person'),
  cancellationPolicyId: z.string().trim().max(120).optional(),
  reminderOffsetsHours: z.array(z.union([z.literal(1), z.literal(24)])).max(2).optional(),
}).superRefine((value, ctx) => {
  const hasStaffPriceOverrides = Object.keys(value.staffPriceOverrides ?? {}).length > 0;
  const hasResourcePriceOverrides = Object.keys(value.resourcePriceOverrides ?? {}).length > 0;
  const hasDiscountCodes = (value.discountCodes ?? []).length > 0;
  if (value.paymentMode !== 'paid') {
    if (hasStaffPriceOverrides) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Staff-specific prices are only available for paid services.',
        path: ['staffPriceOverrides'],
      });
    }
    if (hasResourcePriceOverrides) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Resource-specific prices are only available for paid services.',
        path: ['resourcePriceOverrides'],
      });
    }
    if (hasDiscountCodes) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Discount codes are only available for paid services.',
        path: ['discountCodes'],
      });
    }
    if (value.collectPaymentLater) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Collect-later payment is only available for paid services.',
        path: ['collectPaymentLater'],
      });
    }
    return;
  }
  if (value.collectPaymentLater && (value.depositAmount ?? 0) > 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Deposit amount is not allowed when payment is collected later.',
      path: ['depositAmount'],
    });
    return;
  }
  if (!value.depositAmount) return;
  const total = value.priceAmount ?? value.priceTwd ?? 0;
  if (value.depositAmount >= total) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Deposit amount must be lower than the full payment amount.',
      path: ['depositAmount'],
    });
  }
});

export const bookingCancellationPolicyInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional(),
  cancelHoursBefore: z.coerce.number().int().min(0).max(240).default(0),
  rescheduleHoursBefore: z.coerce.number().int().min(0).max(240).default(0),
  fullRefundHoursBefore: z.coerce.number().int().min(0).max(240).default(0),
  partialRefundHoursBefore: z.coerce.number().int().min(0).max(240).default(0),
  partialRefundPercent: z.coerce.number().int().min(0).max(100).default(0),
  cancellationFeePercent: z.coerce.number().int().min(0).max(100).default(0),
  isActive: z.coerce.boolean().default(true),
});

export const staffInputSchema = z.object({
  name: localizedTextSchema,
  photo: z.string().url().or(z.literal('')).optional(),
  title: localizedTextSchema,
  bio: optionalLocalizedTextSchema.optional(),
  email: z.string().email().or(z.literal('')).optional(),
  isActive: z.coerce.boolean().default(true),
});

export const bookingResourceInputSchema = z.object({
  name: localizedTextSchema,
  description: optionalLocalizedTextSchema.optional(),
  location: z.string().trim().max(160).optional(),
  capacity: z.coerce.number().int().min(1).max(500).default(1),
  bufferBeforeMinutes: z.coerce.number().int().min(0).max(240).default(0),
  bufferAfterMinutes: z.coerce.number().int().min(0).max(240).default(0),
  weekly: weeklyAvailabilitySchema.default(defaultWeeklyAvailability),
  timezone: timezoneSchema.default('Asia/Taipei'),
  recurringTemplateId: z.string().trim().max(80).optional(),
  blockedDates: z.array(blockedDateSchema).default([]),
  isActive: z.coerce.boolean().default(true),
});

export const bookingPackageInputSchema = z.object({
  name: localizedTextSchema,
  description: optionalLocalizedTextSchema.optional(),
  eligibleServiceIds: z.array(z.string().trim().min(1)).default([]),
  credits: z.coerce.number().int().min(1).max(250).default(1),
  validityDays: z.coerce.number().int().min(1).max(3650).optional(),
  priceAmount: z.coerce.number().int().min(0).max(200_000_000).optional(),
  priceCurrency: z.enum(['KRW', 'USD', 'TWD', 'JPY', 'EUR']).default('TWD'),
  isActive: z.coerce.boolean().default(true),
});

export const bookingPackageCreditInputSchema = z.object({
  packageId: z.string().trim().min(1),
  customerEmail: z.string().trim().email().max(200),
  customerName: z.string().trim().max(120).optional(),
  totalCredits: z.coerce.number().int().min(1).max(250).optional(),
  expiresAt: isoSchema.optional(),
  note: z.string().trim().max(1000).optional(),
  status: z.enum(['active', 'used', 'expired', 'revoked']).default('active'),
});

export const bookingPackageCreditUpdateSchema = z.object({
  customerName: z.string().trim().max(120).optional(),
  totalCredits: z.coerce.number().int().min(1).max(250).optional(),
  remainingCredits: z.coerce.number().int().min(0).max(250).optional(),
  expiresAt: isoSchema.or(z.literal('')).optional(),
  note: z.string().trim().max(1000).optional(),
  status: z.enum(['active', 'used', 'expired', 'revoked']).optional(),
});

export const staffAvailabilitySchema = z.object({
  staffId: z.string().trim().min(1),
  weekly: weeklyAvailabilitySchema,
  blockedDates: z.array(blockedDateSchema).default([]),
  dateOverrides: z.array(staffAvailabilityDateOverrideSchema).default([]),
  timezone: timezoneSchema.default('Asia/Taipei'),
  recurringTemplateId: z.string().trim().max(80).optional(),
  holidayCalendar: z.enum(['none', 'kr', 'tw', 'kr-tw']).default('none'),
});

export const bookingCreateSchema = z.object({
  serviceId: z.string().trim().min(1),
  staffId: z.string().trim().min(1),
  startAt: isoSchema,
  customer: z.object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(200),
    phone: z.string().trim().max(80).optional(),
    notes: z.string().trim().max(3000).optional(),
    caseSummary: z.string().trim().max(4000).optional(),
    attachmentUrls: z.array(z.string().trim().url().max(2000)).max(8).optional(),
    customFields: z.array(z.object({
      label: z.string().trim().min(1).max(120),
      value: z.string().trim().max(2000),
    })).max(12).optional(),
    locale: z.enum(locales).default('ko'),
  }),
  customerTimezone: timezoneSchema.optional(),
  source: z.enum(['web', 'admin']).default('web'),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed', 'no-show']).default('confirmed'),
  paymentIntentId: z.string().trim().min(1).max(200).optional(),
  discountCode: z.string().trim().min(1).max(32).optional(),
});

export const bookingWaitlistCreateSchema = z.object({
  serviceId: z.string().trim().min(1),
  staffId: z.string().trim().min(1),
  requestedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  customer: z.object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(200),
    phone: z.string().trim().max(80).optional(),
    notes: z.string().trim().max(3000).optional(),
    caseSummary: z.string().trim().max(4000).optional(),
    attachmentUrls: z.array(z.string().trim().url().max(2000)).max(8).optional(),
    customFields: z.array(z.object({
      label: z.string().trim().min(1).max(120),
      value: z.string().trim().max(2000),
    })).max(12).optional(),
    locale: z.enum(locales).default('ko'),
  }),
  customerTimezone: timezoneSchema.optional(),
  source: z.enum(['web', 'admin']).default('web'),
});

export const bookingWaitlistUpdateSchema = z.object({
  status: z.enum(['active', 'contacted', 'closed']),
});

export const bookingWaitlistPromoteSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  staffId: z.string().trim().min(1).optional(),
});

export const bookingEmailTemplateInputSchema = z.object({
  subject: z.string().trim().min(1).max(300),
  body: z.string().trim().min(1).max(8000),
  isActive: z.coerce.boolean().default(true),
});

export const bookingUpdateSchema = z.object({
  startAt: isoSchema.optional(),
  staffId: z.string().trim().min(1).optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed', 'no-show']).optional(),
  cancellationReason: z.string().trim().max(300).optional(),
  customer: z.object({
    name: z.string().trim().min(1).max(120).optional(),
    email: z.string().trim().email().max(200).optional(),
    phone: z.string().trim().max(80).optional(),
    notes: z.string().trim().max(3000).optional(),
    caseSummary: z.string().trim().max(4000).optional(),
    attachmentUrls: z.array(z.string().trim().url().max(2000)).max(8).optional(),
    customFields: z.array(z.object({
      label: z.string().trim().min(1).max(120),
      value: z.string().trim().max(2000),
    })).max(12).optional(),
  }).optional(),
  customerTimezone: timezoneSchema.optional(),
});

export function createLocalizedText(value: string): LocalizedText {
  return { ko: value, 'zh-hant': value, en: value };
}

export function textForLocale(text: LocalizedText | undefined, locale: Locale): string {
  if (!text) return '';
  return text[locale] || text.ko || text.en || text['zh-hant'] || '';
}
