import { z } from 'zod';
import { locales, type Locale } from '@/lib/locales';

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
export type BookingReminderType = 'email-confirmation' | 'email-reminder-24h' | 'email-reminder-1h';

export type LocalizedText = Record<Locale, string>;

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
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
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

export interface AvailabilityBlock {
  start: string;
  end: string;
}

export interface BlockedDate {
  start: string;
  end: string;
  reason?: string;
}

export interface StaffAvailability {
  staffId: string;
  weekly: Record<DayOfWeek, AvailabilityBlock[]>;
  blockedDates: BlockedDate[];
  timezone: string;
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
    locale: Locale;
  };
  startAt: string;
  endAt: string;
  status: BookingStatus;
  source: BookingSource;
  createdAt: string;
  updatedAt: string;
  reminders: Array<{ sentAt: string; type: BookingReminderType }>;
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

const optionalLocalizedTextSchema = z.object({
  ko: z.string().trim().max(2000).default(''),
  'zh-hant': z.string().trim().max(2000).default(''),
  en: z.string().trim().max(2000).default(''),
});

const timeSchema = z.string().regex(/^\d{2}:\d{2}$/);
const isoSchema = z.string().datetime({ offset: true });

export const bookingServiceInputSchema = z.object({
  slug: z.string().trim().min(1).max(100).regex(/^[a-z0-9-]+$/).optional(),
  name: localizedTextSchema,
  description: optionalLocalizedTextSchema,
  durationMinutes: z.coerce.number().int().min(15).max(480),
  priceTwd: z.coerce.number().int().min(0).max(2_000_000).optional(),
  image: z.string().url().or(z.literal('')).optional(),
  category: z.string().trim().max(80).optional(),
  staffIds: z.array(z.string().trim().min(1)).default([]),
  bufferBeforeMinutes: z.coerce.number().int().min(0).max(240).default(0),
  bufferAfterMinutes: z.coerce.number().int().min(0).max(240).default(15),
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

export const availabilityBlockSchema = z.object({
  start: timeSchema,
  end: timeSchema,
}).refine((value) => value.start < value.end, {
  message: 'Availability start must be before end.',
});

export const staffAvailabilitySchema = z.object({
  staffId: z.string().trim().min(1),
  weekly: z.object(
    Object.fromEntries(dayOfWeeks.map((day) => [day, z.array(availabilityBlockSchema)])) as Record<
      DayOfWeek,
      z.ZodArray<typeof availabilityBlockSchema>
    >,
  ),
  blockedDates: z.array(z.object({
    start: isoSchema,
    end: isoSchema,
    reason: z.string().trim().max(200).optional(),
  }).refine((value) => value.start < value.end, {
    message: 'Blocked date start must be before end.',
  })).default([]),
  timezone: z.string().trim().min(1).max(80).default('Asia/Taipei'),
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
    locale: z.enum(locales).default('ko'),
  }),
  source: z.enum(['web', 'admin']).default('web'),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed', 'no-show']).default('confirmed'),
});

export const bookingUpdateSchema = z.object({
  startAt: isoSchema.optional(),
  staffId: z.string().trim().min(1).optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed', 'no-show']).optional(),
  customer: z.object({
    name: z.string().trim().min(1).max(120).optional(),
    email: z.string().trim().email().max(200).optional(),
    phone: z.string().trim().max(80).optional(),
    notes: z.string().trim().max(3000).optional(),
  }).optional(),
});

export function createLocalizedText(value: string): LocalizedText {
  return { ko: value, 'zh-hant': value, en: value };
}

export function textForLocale(text: LocalizedText | undefined, locale: Locale): string {
  if (!text) return '';
  return text[locale] || text.ko || text.en || text['zh-hant'] || '';
}
