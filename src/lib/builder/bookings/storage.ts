import { createHash } from 'node:crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { BlobPreconditionFailedError, del, get, list, put } from '@vercel/blob';
import type {
  Booking,
  BookingCancellationPolicy,
  BookingEmailTemplate,
  BookingEmailTemplateType,
  BookingPackage,
  BookingPackageCredit,
  BookingResource,
  BookingService,
  BookingWaitlistEntry,
  BookingWaitlistStatus,
  DayOfWeek,
  Staff,
  StaffAvailability,
} from '@/lib/builder/bookings/types';
import { createLocalizedText, dayOfWeeks } from '@/lib/builder/bookings/types';
import { recurringAvailabilityTemplates } from '@/lib/builder/bookings/availability-templates';
import { normalizeBookingTimezone } from '@/lib/builder/bookings/timezone';

const BOOKINGS_ROOT = process.env.BUILDER_BOOKINGS_ROOT ?? path.join(process.cwd(), 'runtime-data', 'builder-bookings');
const BLOB_PREFIX = 'builder-bookings/';
const PAYMENT_INTENT_CLAIMS_PREFIX = `${BLOB_PREFIX}payment-intent-claims/`;

const bookingWriteQueues = new Map<string, Promise<void>>();
const paymentIntentClaimQueues = new Map<string, Promise<void>>();
const packageCreditWriteQueues = new Map<string, Promise<void>>();
const PACKAGE_CREDIT_MUTATION_ATTEMPTS = 3;

type Collection =
  | 'services'
  | 'staff'
  | 'availability'
  | 'bookings'
  | 'waitlist'
  | 'email-templates'
  | 'cancellation-policies'
  | 'resources'
  | 'packages'
  | 'package-credits';
type BookingBackend = 'blob' | 'file';

export interface PackageCreditMutation<T> {
  next: BookingPackageCredit;
  result: T;
}

interface PaymentIntentClaimRecord {
  paymentIntentId: string;
  bookingId: string;
  claimedAt: string;
}

export type PaymentIntentClaimResult =
  | { claimed: true; idempotent: boolean }
  | { claimed: false };

function getBackend(): BookingBackend {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return 'file';
  if (process.env.CONSULTATION_LOG_BACKEND === 'local') return 'file';
  if (process.env.BUILDER_BOOKINGS_BACKEND === 'local') return 'file';
  if (process.env.NODE_ENV !== 'production' && process.env.BUILDER_USE_BLOB_IN_DEV !== '1') return 'file';
  return 'blob';
}

/**
 * Public booking mutations need a shared durable store in production. Local
 * development deliberately remains file-backed so contributors can run the
 * booking flows without a Blob token.
 */
export function hasDurableBookingStorage(): boolean {
  return process.env.NODE_ENV !== 'production' || getBackend() === 'blob';
}

/** Shared backend selector for booking durability helpers such as slot leases. */
export function usesBlobBookingStorage(): boolean {
  return getBackend() === 'blob';
}

function collectionPrefix(collection: Collection): string {
  return `${BLOB_PREFIX}${collection}/`;
}

function blobPath(collection: Collection, id: string): string {
  return `${collectionPrefix(collection)}${id}.json`;
}

function filePath(collection: Collection, id: string): string {
  return path.join(BOOKINGS_ROOT, collection, `${id}.json`);
}

function normalizeClaimIdentifier(value: string, label: string): string {
  const normalized = value.trim();
  if (!normalized || normalized.length > 200) {
    throw new TypeError(`${label} must be between 1 and 200 characters.`);
  }
  return normalized;
}

function paymentIntentClaimKey(paymentIntentId: string): string {
  return createHash('sha256').update(paymentIntentId).digest('hex');
}

function paymentIntentClaimBlobPath(paymentIntentId: string): string {
  return `${PAYMENT_INTENT_CLAIMS_PREFIX}${paymentIntentClaimKey(paymentIntentId)}.json`;
}

function paymentIntentClaimFilePath(paymentIntentId: string): string {
  return path.join(
    BOOKINGS_ROOT,
    'payment-intent-claims',
    `${paymentIntentClaimKey(paymentIntentId)}.json`,
  );
}

function parsePaymentIntentClaim(raw: string): PaymentIntentClaimRecord | null {
  try {
    const parsed = JSON.parse(raw) as Partial<PaymentIntentClaimRecord>;
    if (
      typeof parsed.paymentIntentId !== 'string'
      || typeof parsed.bookingId !== 'string'
      || typeof parsed.claimedAt !== 'string'
    ) {
      return null;
    }
    return {
      paymentIntentId: parsed.paymentIntentId,
      bookingId: parsed.bookingId,
      claimedAt: parsed.claimedAt,
    };
  } catch {
    return null;
  }
}

async function readFilePaymentIntentClaim(
  target: string,
  attempts = 1,
): Promise<PaymentIntentClaimRecord | null> {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const claim = parsePaymentIntentClaim(await fs.readFile(target, 'utf8'));
      if (claim || attempt === attempts - 1) return claim;
    } catch (error) {
      if (
        error instanceof Error
        && 'code' in error
        && error.code === 'ENOENT'
      ) {
        return null;
      }
      if (attempt === attempts - 1) return null;
    }
    await new Promise<void>((resolve) => setTimeout(resolve, 5));
  }
  return null;
}

async function readBlobPaymentIntentClaim(
  pathname: string,
): Promise<{ claim: PaymentIntentClaimRecord; etag: string } | null> {
  const result = await get(pathname, { access: 'private', useCache: false });
  if (result?.statusCode !== 200 || !result.stream) return null;
  const claim = parsePaymentIntentClaim(await new Response(result.stream).text());
  if (!claim) return null;
  return { claim, etag: result.blob.etag };
}

async function findPersistedBookingIdsByPaymentIntent(
  paymentIntentId: string,
): Promise<string[]> {
  const bookingIds: string[] = [];

  if (getBackend() === 'blob') {
    let cursor: string | undefined;
    do {
      const result = await list({
        prefix: collectionPrefix('bookings'),
        ...(cursor ? { cursor } : {}),
      });
      for (const blob of result.blobs) {
        const item = await get(blob.pathname, { access: 'private', useCache: false });
        if (item?.statusCode !== 200 || !item.stream) continue;
        const booking = JSON.parse(await new Response(item.stream).text()) as Booking & {
          deleted?: boolean;
        };
        if (!booking.deleted && booking.paymentIntentId === paymentIntentId) {
          bookingIds.push(booking.bookingId);
        }
      }
      if (result.hasMore && !result.cursor) {
        throw new Error('Blob booking list pagination returned no cursor.');
      }
      cursor = result.hasMore ? result.cursor : undefined;
    } while (cursor);
    return bookingIds;
  }

  const directory = path.join(BOOKINGS_ROOT, 'bookings');
  let files: string[];
  try {
    files = await fs.readdir(directory);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const booking = JSON.parse(await fs.readFile(path.join(directory, file), 'utf8')) as Booking & {
      deleted?: boolean;
    };
    if (!booking.deleted && booking.paymentIntentId === paymentIntentId) {
      bookingIds.push(booking.bookingId);
    }
  }
  return bookingIds;
}

async function writeJson(collection: Collection, id: string, data: unknown): Promise<void> {
  if (getBackend() === 'blob') {
    await put(blobPath(collection, id), JSON.stringify(data, null, 2), {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }

  const target = filePath(collection, id);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, JSON.stringify(data, null, 2), 'utf8');
}

async function readJson<T>(collection: Collection, id: string): Promise<T | null> {
  try {
    if (getBackend() === 'blob') {
      const result = await get(blobPath(collection, id), { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        return JSON.parse(await new Response(result.stream).text()) as T;
      }
      return null;
    }

    const raw = await fs.readFile(filePath(collection, id), 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function listJson<T>(collection: Collection): Promise<T[]> {
  try {
    if (getBackend() === 'blob') {
      const result = await list({ prefix: collectionPrefix(collection) });
      const values: T[] = [];
      for (const blob of result.blobs) {
        try {
          const item = await get(blob.pathname, { access: 'private', useCache: false });
          if (item?.statusCode === 200 && item.stream) {
            const parsed = JSON.parse(await new Response(item.stream).text()) as T & { deleted?: boolean };
            if (!parsed.deleted) values.push(parsed);
          }
        } catch {
          // Skip malformed entries instead of breaking the admin surface.
        }
      }
      return values;
    }

    const dir = path.join(BOOKINGS_ROOT, collection);
    const files = await fs.readdir(dir).catch(() => []);
    const values: T[] = [];
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      try {
        const parsed = JSON.parse(await fs.readFile(path.join(dir, file), 'utf8')) as T & { deleted?: boolean };
        if (!parsed.deleted) values.push(parsed);
      } catch {
        // Skip malformed entries.
      }
    }
    return values;
  } catch {
    return [];
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

async function withBookingWriteLock<T>(bookingId: string, operation: () => Promise<T>): Promise<T> {
  const previous = bookingWriteQueues.get(bookingId) ?? Promise.resolve();
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const queued = previous.catch(() => undefined).then(() => gate);
  bookingWriteQueues.set(bookingId, queued);

  await previous.catch(() => undefined);
  try {
    return await operation();
  } finally {
    release();
    if (bookingWriteQueues.get(bookingId) === queued) {
      bookingWriteQueues.delete(bookingId);
    }
  }
}

async function withPaymentIntentClaimLock<T>(
  paymentIntentId: string,
  operation: () => Promise<T>,
): Promise<T> {
  const key = paymentIntentClaimKey(paymentIntentId);
  const previous = paymentIntentClaimQueues.get(key) ?? Promise.resolve();
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const queued = previous.catch(() => undefined).then(() => gate);
  paymentIntentClaimQueues.set(key, queued);

  await previous.catch(() => undefined);
  try {
    return await operation();
  } finally {
    release();
    if (paymentIntentClaimQueues.get(key) === queued) {
      paymentIntentClaimQueues.delete(key);
    }
  }
}

async function withPackageCreditWriteLock<T>(
  creditId: string,
  operation: () => Promise<T>,
): Promise<T> {
  const previous = packageCreditWriteQueues.get(creditId) ?? Promise.resolve();
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const queued = previous.catch(() => undefined).then(() => gate);
  packageCreditWriteQueues.set(creditId, queued);

  await previous.catch(() => undefined);
  try {
    return await operation();
  } finally {
    release();
    if (packageCreditWriteQueues.get(creditId) === queued) {
      packageCreditWriteQueues.delete(creditId);
    }
  }
}

function unionBookingReminders(
  persisted: Booking['reminders'],
  incoming: Booking['reminders'],
): Booking['reminders'] {
  const byType = new Map<Booking['reminders'][number]['type'], Booking['reminders'][number]>();
  for (const reminder of persisted) byType.set(reminder.type, reminder);
  for (const reminder of incoming) {
    if (!byType.has(reminder.type)) byType.set(reminder.type, reminder);
  }
  return [...byType.values()];
}

function defaultCancellationPolicies(): BookingCancellationPolicy[] {
  const now = nowIso();
  return [
    {
      policyId: 'standard-24h',
      name: 'Standard policy',
      description: 'Full refund 24 hours before start, partial refund 6 hours before start.',
      cancelHoursBefore: 0,
      rescheduleHoursBefore: 6,
      fullRefundHoursBefore: 24,
      partialRefundHoursBefore: 6,
      partialRefundPercent: 50,
      cancellationFeePercent: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      policyId: 'strict-48h',
      name: 'Strict policy',
      description: 'Full refund 48 hours before start, partial refund 24 hours before start.',
      cancelHoursBefore: 6,
      rescheduleHoursBefore: 24,
      fullRefundHoursBefore: 48,
      partialRefundHoursBefore: 24,
      partialRefundPercent: 50,
      cancellationFeePercent: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      policyId: 'flexible-6h',
      name: 'Flexible policy',
      description: 'Full refund 6 hours before start.',
      cancelHoursBefore: 0,
      rescheduleHoursBefore: 0,
      fullRefundHoursBefore: 6,
      partialRefundHoursBefore: 0,
      partialRefundPercent: 0,
      cancellationFeePercent: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function normalizeCancellationPolicy(policy: BookingCancellationPolicy): BookingCancellationPolicy {
  return {
    ...policy,
    cancelHoursBefore: policy.cancelHoursBefore ?? 0,
    rescheduleHoursBefore: policy.rescheduleHoursBefore ?? 0,
    fullRefundHoursBefore: policy.fullRefundHoursBefore ?? 0,
    partialRefundHoursBefore: policy.partialRefundHoursBefore ?? 0,
    partialRefundPercent: policy.partialRefundPercent ?? 0,
    cancellationFeePercent: policy.cancellationFeePercent ?? 0,
    isActive: policy.isActive ?? true,
  };
}

function weeklyDefaults(): StaffAvailability['weekly'] {
  return Object.fromEntries(
    dayOfWeeks.map((day) => [
      day,
      day === 'saturday' || day === 'sunday' ? [] : [{ start: '09:00', end: '18:00' }],
    ]),
  ) as Record<DayOfWeek, Array<{ start: string; end: string }>>;
}

function cloneWeekly(weekly: BookingResource['weekly']): BookingResource['weekly'] {
  if (!weekly) return weekly;
  return Object.fromEntries(
    dayOfWeeks.map((day) => [day, (weekly[day] ?? []).map((block) => ({ ...block }))]),
  ) as NonNullable<BookingResource['weekly']>;
}

function weeklyFromTemplate(templateId: string): BookingResource['weekly'] {
  const template = recurringAvailabilityTemplates.find((item) => item.templateId === templateId)
    ?? recurringAvailabilityTemplates.find((item) => item.templateId === 'weekdays-09-18')
    ?? recurringAvailabilityTemplates[0];
  return Object.fromEntries(
    dayOfWeeks.map((day) => [day, template.weekly[day].map((block) => ({ ...block }))]),
  ) as NonNullable<BookingResource['weekly']>;
}

function normalizeResource(resource: BookingResource): BookingResource {
  const templateId = resource.recurringTemplateId?.trim() || undefined;
  const normalizedTemplateId = templateId ?? (resource.weekly ? undefined : 'weekdays-09-18');
  return {
    ...resource,
    bufferBeforeMinutes: resource.bufferBeforeMinutes ?? 0,
    bufferAfterMinutes: resource.bufferAfterMinutes ?? 0,
    timezone: normalizeBookingTimezone(resource.timezone),
    recurringTemplateId: normalizedTemplateId,
    weekly: cloneWeekly(resource.weekly) ?? weeklyFromTemplate(normalizedTemplateId ?? 'weekdays-09-18'),
    blockedDates: resource.blockedDates?.map((blocked) => ({ ...blocked })) ?? [],
  };
}

function seedServices(timestamp: string): BookingService[] {
  return [
    {
      serviceId: 'svc-initial-consultation',
      slug: 'initial-consultation',
      name: { ko: '초기 상담 30분', 'zh-hant': '初步諮詢 30 分鐘', en: 'Initial Consultation 30 min' },
      description: {
        ko: '회사설립, 비자, 계약, 분쟁 가능성을 빠르게 진단하는 입문 상담입니다.',
        'zh-hant': '快速了解公司設立、簽證、契約或爭議風險的初步諮詢。',
        en: 'A focused first consultation for company setup, visas, contracts, or dispute risk.',
      },
      durationMinutes: 30,
      priceTwd: 3000,
      image: '',
      category: 'consultation',
      staffIds: ['staff-tseng', 'staff-lee'],
      requiredResourceIds: ['res-consultation-room'],
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 15,
      maxParticipants: 1,
      slotStepMinutes: 30,
      isActive: true,
      paymentMode: 'free',
      priceCurrency: 'TWD',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      serviceId: 'svc-deep-consultation',
      slug: 'deep-consultation',
      name: { ko: '심층 상담 1시간', 'zh-hant': '深度諮詢 1 小時', en: 'Deep Consultation 1 hour' },
      description: {
        ko: '자료 검토와 쟁점 정리를 포함한 심층 전략 상담입니다.',
        'zh-hant': '包含資料審閱與爭點整理的深度策略諮詢。',
        en: 'A deeper strategy session with document review and issue mapping.',
      },
      durationMinutes: 60,
      priceTwd: 6000,
      image: '',
      category: 'consultation',
      staffIds: ['staff-tseng', 'staff-lee', 'staff-park'],
      requiredResourceIds: ['res-consultation-room'],
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 15,
      maxParticipants: 1,
      slotStepMinutes: 30,
      isActive: true,
      paymentMode: 'free',
      priceCurrency: 'TWD',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      serviceId: 'svc-office-visit',
      slug: 'office-visit',
      name: { ko: '방문 상담', 'zh-hant': '到所諮詢', en: 'Office Visit Consultation' },
      description: {
        ko: '대만 사무실 방문 또는 화상 회의로 진행하는 사건 검토 상담입니다.',
        'zh-hant': '可於台灣辦公室或線上會議進行的案件審閱諮詢。',
        en: 'Case review at the Taiwan office or by video conference.',
      },
      durationMinutes: 90,
      priceTwd: 9000,
      image: '',
      category: 'consultation',
      staffIds: ['staff-tseng', 'staff-park'],
      requiredResourceIds: ['res-conference-room'],
      bufferBeforeMinutes: 15,
      bufferAfterMinutes: 15,
      maxParticipants: 1,
      slotStepMinutes: 30,
      isActive: true,
      paymentMode: 'free',
      priceCurrency: 'TWD',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];
}

function seedResources(timestamp: string): BookingResource[] {
  return [
    {
      resourceId: 'res-consultation-room',
      name: createLocalizedText('상담실'),
      description: createLocalizedText('일반 상담과 화상 상담에 사용하는 기본 예약 공간입니다.'),
      location: 'Taipei Office',
      capacity: 4,
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 0,
      weekly: weeklyFromTemplate('weekdays-09-18'),
      timezone: 'Asia/Taipei',
      recurringTemplateId: 'weekdays-09-18',
      blockedDates: [],
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      resourceId: 'res-conference-room',
      name: createLocalizedText('회의실'),
      description: createLocalizedText('여러 참석자가 있는 방문 상담과 문서 검토 미팅에 사용하는 회의실입니다.'),
      location: 'Taipei Office',
      capacity: 8,
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 0,
      weekly: weeklyFromTemplate('weekdays-09-18'),
      timezone: 'Asia/Taipei',
      recurringTemplateId: 'weekdays-09-18',
      blockedDates: [],
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];
}

function seedPackages(timestamp: string): BookingPackage[] {
  return [
    {
      packageId: 'pkg-consultation-3',
      name: createLocalizedText('상담 3회 패키지'),
      description: createLocalizedText('결제형 상담 서비스에 사용할 수 있는 3회 세션권입니다.'),
      eligibleServiceIds: ['svc-initial-consultation', 'svc-deep-consultation'],
      credits: 3,
      validityDays: 180,
      priceAmount: 15000,
      priceCurrency: 'TWD',
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];
}

function seedStaff(timestamp: string): Staff[] {
  return [
    {
      staffId: 'staff-tseng',
      name: { ko: '증위명 변호사', 'zh-hant': '曾偉銘 律師', en: 'Attorney Tseng Wei-Ming' },
      title: { ko: '대표 변호사', 'zh-hant': '主持律師', en: 'Managing Attorney' },
      bio: {
        ko: '대만 법인 설립, 투자, 계약 및 분쟁 대응을 총괄합니다.',
        'zh-hant': '專精公司設立、投資、契約與爭議處理。',
        en: 'Leads company setup, investment, contracts, and dispute strategy.',
      },
      email: 'wei@hoveringlaw.com.tw',
      photo: '',
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      staffId: 'staff-lee',
      name: { ko: '이정민 변호사', 'zh-hant': '李貞敏 律師', en: 'Attorney Lee Jung-Min' },
      title: { ko: '기업/비자 담당', 'zh-hant': '企業與簽證顧問', en: 'Corporate and Visa Counsel' },
      bio: createLocalizedText('기업 운영, 취업허가, 거류 및 계약 실무 상담을 담당합니다.'),
      email: '',
      photo: '',
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      staffId: 'staff-park',
      name: { ko: '박서연 변호사', 'zh-hant': '朴書妍 律師', en: 'Attorney Park Seo-Yeon' },
      title: { ko: '분쟁/가사 담당', 'zh-hant': '爭議與家事顧問', en: 'Disputes and Family Counsel' },
      bio: createLocalizedText('분쟁, 교통사고, 상속 및 가사 사건의 초기 전략을 상담합니다.'),
      email: '',
      photo: '',
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];
}

async function ensureSeedData(): Promise<void> {
  const [services, staff, resources, packages] = await Promise.all([
    listJson<BookingService>('services'),
    listJson<Staff>('staff'),
    listJson<BookingResource>('resources'),
    listJson<BookingPackage>('packages'),
  ]);
  if (services.length > 0 && staff.length > 0 && resources.length > 0 && packages.length > 0) return;

  const timestamp = nowIso();
  const nextServices = services.length > 0 ? services : seedServices(timestamp);
  const nextStaff = staff.length > 0 ? staff : seedStaff(timestamp);
  const nextResources = resources.length > 0 ? resources : seedResources(timestamp);
  const nextPackages = packages.length > 0 ? packages : seedPackages(timestamp);

  await Promise.all([
    ...nextServices.map((service) => writeJson('services', service.serviceId, service)),
    ...nextStaff.map((member) => writeJson('staff', member.staffId, member)),
    ...nextResources.map((resource) => writeJson('resources', resource.resourceId, resource)),
    ...nextPackages.map((pkg) => writeJson('packages', pkg.packageId, pkg)),
    ...nextStaff.map((member) => writeJson('availability', member.staffId, {
      staffId: member.staffId,
      weekly: weeklyDefaults(),
      blockedDates: [],
      dateOverrides: [],
      timezone: 'Asia/Taipei',
      recurringTemplateId: 'weekdays-09-18',
      holidayCalendar: 'none',
    } satisfies StaffAvailability)),
  ]);
}

export function makeBookingId(): string {
  return `bk-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function makeWaitlistId(): string {
  return `wl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function makeServiceId(): string {
  return `svc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function makeStaffId(): string {
  return `staff-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function makeResourceId(): string {
  return `res-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function makePackageId(): string {
  return `pkg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function makePackageCreditId(): string {
  return `pc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function makeCancellationPolicyId(): string {
  return `policy-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function slugify(input: string): string {
  const slug = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || `service-${Date.now().toString(36)}`;
}

export async function listServices(includeInactive = false): Promise<BookingService[]> {
  await ensureSeedData();
  const services = await listJson<BookingService>('services');
  return services
    .filter((service) => includeInactive || service.isActive)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function getService(serviceId: string): Promise<BookingService | null> {
  await ensureSeedData();
  return readJson<BookingService>('services', serviceId);
}

export async function saveService(service: BookingService): Promise<void> {
  await writeJson('services', service.serviceId, service);
}

export async function listStaff(includeInactive = false): Promise<Staff[]> {
  await ensureSeedData();
  const staff = await listJson<Staff>('staff');
  return staff
    .filter((member) => includeInactive || member.isActive)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function getStaff(staffId: string): Promise<Staff | null> {
  await ensureSeedData();
  return readJson<Staff>('staff', staffId);
}

export async function saveStaff(staff: Staff): Promise<void> {
  await writeJson('staff', staff.staffId, staff);
}

export async function listCancellationPolicies(includeInactive = false): Promise<BookingCancellationPolicy[]> {
  const policies = await listJson<BookingCancellationPolicy>('cancellation-policies');
  const source = new Map<string, BookingCancellationPolicy>();
  for (const policy of defaultCancellationPolicies()) {
    source.set(policy.policyId, normalizeCancellationPolicy(policy));
  }
  for (const policy of policies) {
    source.set(policy.policyId, normalizeCancellationPolicy(policy));
  }
  return Array.from(source.values())
    .filter((policy) => includeInactive || policy.isActive)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function getCancellationPolicy(policyId: string): Promise<BookingCancellationPolicy | null> {
  const existing = await readJson<BookingCancellationPolicy>('cancellation-policies', policyId);
  if (existing) return normalizeCancellationPolicy(existing);
  const fallback = defaultCancellationPolicies().find((policy) => policy.policyId === policyId);
  return fallback ? normalizeCancellationPolicy(fallback) : null;
}

export async function saveCancellationPolicy(policy: BookingCancellationPolicy): Promise<void> {
  await writeJson('cancellation-policies', policy.policyId, normalizeCancellationPolicy(policy));
}

export async function listResources(includeInactive = false): Promise<BookingResource[]> {
  await ensureSeedData();
  const resources = await listJson<BookingResource>('resources');
  return resources
    .map((resource) => normalizeResource(resource))
    .filter((resource) => includeInactive || resource.isActive)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function getResource(resourceId: string): Promise<BookingResource | null> {
  await ensureSeedData();
  const resource = await readJson<BookingResource>('resources', resourceId);
  return resource ? normalizeResource(resource) : null;
}

export async function saveResource(resource: BookingResource): Promise<void> {
  await writeJson('resources', resource.resourceId, normalizeResource(resource));
}

export async function listPackages(includeInactive = false): Promise<BookingPackage[]> {
  await ensureSeedData();
  const packages = await listJson<BookingPackage>('packages');
  return packages
    .filter((pkg) => includeInactive || pkg.isActive)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function getPackage(packageId: string): Promise<BookingPackage | null> {
  await ensureSeedData();
  return readJson<BookingPackage>('packages', packageId);
}

export async function savePackage(pkg: BookingPackage): Promise<void> {
  await writeJson('packages', pkg.packageId, pkg);
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function listPackageCredits(options: {
  customerEmail?: string;
  packageId?: string;
  status?: BookingPackageCredit['status'];
  includeInactive?: boolean;
} = {}): Promise<BookingPackageCredit[]> {
  await ensureSeedData();
  const credits = await listJson<BookingPackageCredit>('package-credits');
  const customerEmail = options.customerEmail ? normalizeEmail(options.customerEmail) : null;
  return credits
    .filter((credit) => !customerEmail || normalizeEmail(credit.customerEmail) === customerEmail)
    .filter((credit) => !options.packageId || credit.packageId === options.packageId)
    .filter((credit) => !options.status || credit.status === options.status)
    .filter((credit) => options.includeInactive || credit.status === 'active')
    .sort((a, b) => {
      const aExpiry = a.expiresAt || '9999-12-31T23:59:59.999Z';
      const bExpiry = b.expiresAt || '9999-12-31T23:59:59.999Z';
      return aExpiry.localeCompare(bExpiry) || a.createdAt.localeCompare(b.createdAt);
    });
}

export async function getPackageCredit(creditId: string): Promise<BookingPackageCredit | null> {
  await ensureSeedData();
  return readJson<BookingPackageCredit>('package-credits', creditId);
}

export async function savePackageCredit(credit: BookingPackageCredit): Promise<void> {
  await writeJson('package-credits', credit.creditId, {
    ...credit,
    customerEmail: normalizeEmail(credit.customerEmail),
  });
}

function normalizePackageCreditForStorage(credit: BookingPackageCredit): BookingPackageCredit {
  return {
    ...credit,
    customerEmail: normalizeEmail(credit.customerEmail),
  };
}

async function readPackageCreditForMutation(
  creditId: string,
): Promise<{ credit: BookingPackageCredit; etag?: string } | null> {
  if (getBackend() === 'blob') {
    const result = await get(blobPath('package-credits', creditId), {
      access: 'private',
      useCache: false,
    });
    if (result === null) return null;
    if (result.statusCode !== 200 || !result.stream || !result.blob.etag) {
      throw new Error('Package credit storage returned an invalid record.');
    }
    const parsed = JSON.parse(await new Response(result.stream).text()) as BookingPackageCredit;
    if (!parsed || typeof parsed !== 'object' || parsed.creditId !== creditId) {
      throw new Error('Package credit storage contains malformed data.');
    }
    return { credit: parsed, etag: result.blob.etag };
  }

  try {
    const parsed = JSON.parse(await fs.readFile(filePath('package-credits', creditId), 'utf8')) as BookingPackageCredit;
    if (!parsed || typeof parsed !== 'object' || parsed.creditId !== creditId) {
      throw new Error('Package credit storage contains malformed data.');
    }
    return { credit: parsed };
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return null;
    throw error;
  }
}

/**
 * Applies a credit mutation to the existing raw package-credit JSON record.
 * Blob writes are ETag-conditional, preserving the established record format
 * while retrying a pure reducer against a fresh read after contention.
 */
export async function mutatePackageCredit<T>(
  creditId: string,
  reducer: (
    credit: BookingPackageCredit,
  ) => PackageCreditMutation<T> | null | Promise<PackageCreditMutation<T> | null>,
): Promise<T | null> {
  if (getBackend() === 'file') {
    return withPackageCreditWriteLock(creditId, async () => {
      const current = await readPackageCreditForMutation(creditId);
      if (!current) return null;
      const mutation = await reducer(current.credit);
      if (!mutation) return null;
      await savePackageCredit(mutation.next);
      return mutation.result;
    });
  }

  for (let attempt = 0; attempt < PACKAGE_CREDIT_MUTATION_ATTEMPTS; attempt += 1) {
    const current = await readPackageCreditForMutation(creditId);
    if (!current?.etag) return null;
    const mutation = await reducer(current.credit);
    if (!mutation) return null;
    try {
      await put(
        blobPath('package-credits', creditId),
        JSON.stringify(normalizePackageCreditForStorage(mutation.next), null, 2),
        {
          access: 'private',
          addRandomSuffix: false,
          allowOverwrite: true,
          contentType: 'application/json',
          ifMatch: current.etag,
        },
      );
      return mutation.result;
    } catch (error) {
      if (
        !(error instanceof BlobPreconditionFailedError)
        || attempt === PACKAGE_CREDIT_MUTATION_ATTEMPTS - 1
      ) {
        throw error;
      }
    }
  }

  return null;
}

export async function getStaffAvailability(staffId: string): Promise<StaffAvailability> {
  await ensureSeedData();
  const existing = await readJson<StaffAvailability>('availability', staffId);
  if (existing) return existing;
  return {
    staffId,
    weekly: weeklyDefaults(),
    blockedDates: [],
    dateOverrides: [],
    timezone: 'Asia/Taipei',
    recurringTemplateId: 'weekdays-09-18',
    holidayCalendar: 'none',
  };
}

export async function saveStaffAvailability(availability: StaffAvailability): Promise<void> {
  await writeJson('availability', availability.staffId, availability);
}

export async function listAvailability(): Promise<StaffAvailability[]> {
  await ensureSeedData();
  return listJson<StaffAvailability>('availability');
}

export async function getBooking(bookingId: string): Promise<Booking | null> {
  return readJson<Booking>('bookings', bookingId);
}

/**
 * Reserves a Stripe PaymentIntent for one booking. The hashed, fixed pathname
 * prevents identifier traversal and the backend's create-only primitive makes
 * competing booking claims fail closed.
 */
export async function claimBookingPaymentIntent(
  paymentIntentId: string,
  bookingId: string,
): Promise<PaymentIntentClaimResult> {
  const normalizedPaymentIntentId = normalizeClaimIdentifier(paymentIntentId, 'paymentIntentId');
  const normalizedBookingId = normalizeClaimIdentifier(bookingId, 'bookingId');
  const persistedBookingIds = await findPersistedBookingIdsByPaymentIntent(
    normalizedPaymentIntentId,
  );
  if (persistedBookingIds.some((persistedBookingId) => persistedBookingId !== normalizedBookingId)) {
    return { claimed: false };
  }
  const isPersistedBySameBooking = persistedBookingIds.length > 0;
  const claim: PaymentIntentClaimRecord = {
    paymentIntentId: normalizedPaymentIntentId,
    bookingId: normalizedBookingId,
    claimedAt: nowIso(),
  };
  const serialized = JSON.stringify(claim);

  if (getBackend() === 'blob') {
    const pathname = paymentIntentClaimBlobPath(normalizedPaymentIntentId);
    try {
      await put(pathname, serialized, {
        access: 'private',
        addRandomSuffix: false,
        allowOverwrite: false,
        contentType: 'application/json',
      });
      return { claimed: true, idempotent: isPersistedBySameBooking };
    } catch (error) {
      const existing = await readBlobPaymentIntentClaim(pathname);
      if (!existing) throw error;
      if (
        existing.claim.paymentIntentId === normalizedPaymentIntentId
        && existing.claim.bookingId === normalizedBookingId
      ) {
        return { claimed: true, idempotent: true };
      }
      return { claimed: false };
    }
  }

  const target = paymentIntentClaimFilePath(normalizedPaymentIntentId);
  await fs.mkdir(path.dirname(target), { recursive: true });
  return withPaymentIntentClaimLock(normalizedPaymentIntentId, async () => {
    let handle: Awaited<ReturnType<typeof fs.open>> | undefined;
    try {
      handle = await fs.open(target, 'wx');
      await handle.writeFile(serialized, 'utf8');
      return { claimed: true, idempotent: isPersistedBySameBooking };
    } catch (error) {
      if (!(error instanceof Error && 'code' in error && error.code === 'EEXIST')) {
        throw error;
      }
      // Another process can observe EEXIST just before the creator finishes its
      // small JSON write, so retry the read briefly before failing closed.
      const existing = await readFilePaymentIntentClaim(target, 10);
      if (
        existing?.paymentIntentId === normalizedPaymentIntentId
        && existing.bookingId === normalizedBookingId
      ) {
        return { claimed: true, idempotent: true };
      }
      return { claimed: false };
    } finally {
      await handle?.close();
    }
  });
}

/**
 * Releases a claim after a failed booking save. A booking can release only its
 * own claim; Blob deletion is additionally guarded by the version read.
 */
export async function releaseBookingPaymentIntentClaim(
  paymentIntentId: string,
  bookingId: string,
): Promise<boolean> {
  const normalizedPaymentIntentId = normalizeClaimIdentifier(paymentIntentId, 'paymentIntentId');
  const normalizedBookingId = normalizeClaimIdentifier(bookingId, 'bookingId');

  if (getBackend() === 'blob') {
    const pathname = paymentIntentClaimBlobPath(normalizedPaymentIntentId);
    const existing = await readBlobPaymentIntentClaim(pathname);
    if (
      !existing
      || existing.claim.paymentIntentId !== normalizedPaymentIntentId
      || existing.claim.bookingId !== normalizedBookingId
    ) {
      return false;
    }
    await del(pathname, { ifMatch: existing.etag });
    return true;
  }

  const target = paymentIntentClaimFilePath(normalizedPaymentIntentId);
  return withPaymentIntentClaimLock(normalizedPaymentIntentId, async () => {
    const existing = await readFilePaymentIntentClaim(target);
    if (
      !existing
      || existing.paymentIntentId !== normalizedPaymentIntentId
      || existing.bookingId !== normalizedBookingId
    ) {
      return false;
    }
    try {
      await fs.unlink(target);
      return true;
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        return false;
      }
      throw error;
    }
  });
}

export async function saveBooking(booking: Booking): Promise<void> {
  await withBookingWriteLock(booking.bookingId, async () => {
    // F109 — fire bookings.reservation-created only the first time we see this id.
    const prior = await readJson<Booking>('bookings', booking.bookingId);
    const nextBooking = prior
      ? { ...booking, reminders: unionBookingReminders(prior.reminders, booking.reminders) }
      : booking;
    await writeJson('bookings', booking.bookingId, nextBooking);
    if (!prior) {
      void import('@/lib/builder/apps/hook-runtime').then(({ dispatchAppHookEvent }) => (
        dispatchAppHookEvent({
          kind: 'bookings.reservation-created',
          payload: {
            bookingId: booking.bookingId,
            serviceId: booking.serviceId,
            staffId: booking.staffId,
            startAt: booking.startAt,
          },
        })
      )).catch(() => undefined);
    }
  });
}

export async function appendBookingReminderMarker(
  bookingId: string,
  marker: Booking['reminders'][number],
): Promise<{ ok: true; booking: Booking } | { ok: false; reason: 'not_found' }> {
  return withBookingWriteLock(bookingId, async () => {
    const latest = await readJson<Booking>('bookings', bookingId);
    if (!latest) return { ok: false, reason: 'not_found' };
    if (latest.reminders.some((reminder) => reminder.type === marker.type)) {
      return { ok: true, booking: latest };
    }

    const updated: Booking = {
      ...latest,
      reminders: unionBookingReminders(latest.reminders, [marker]),
      updatedAt: nowIso(),
    };
    await writeJson('bookings', bookingId, updated);
    return { ok: true, booking: updated };
  });
}

export async function getWaitlistEntry(waitlistId: string): Promise<BookingWaitlistEntry | null> {
  return readJson<BookingWaitlistEntry>('waitlist', waitlistId);
}

export async function saveWaitlistEntry(entry: BookingWaitlistEntry): Promise<void> {
  await writeJson('waitlist', entry.waitlistId, entry);
}

export async function listWaitlistEntries(options: {
  status?: BookingWaitlistStatus;
  includeClosed?: boolean;
  serviceId?: string;
  staffId?: string;
} = {}): Promise<BookingWaitlistEntry[]> {
  const entries = await listJson<BookingWaitlistEntry>('waitlist');
  return entries
    .filter((entry) => options.includeClosed || entry.status !== 'closed')
    .filter((entry) => !options.status || entry.status === options.status)
    .filter((entry) => !options.serviceId || entry.serviceId === options.serviceId)
    .filter((entry) => !options.staffId || entry.staffId === options.staffId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getBookingEmailTemplate(type: BookingEmailTemplateType): Promise<BookingEmailTemplate | null> {
  return readJson<BookingEmailTemplate>('email-templates', type);
}

export async function saveBookingEmailTemplate(template: BookingEmailTemplate): Promise<void> {
  await writeJson('email-templates', template.type, template);
}

export async function listStoredBookingEmailTemplates(): Promise<BookingEmailTemplate[]> {
  return listJson<BookingEmailTemplate>('email-templates');
}

export async function listBookings(options: {
  from?: string;
  to?: string;
  staffId?: string;
  includeCancelled?: boolean;
} = {}): Promise<Booking[]> {
  const bookings = await listJson<Booking>('bookings');
  return bookings
    .filter((booking) => options.includeCancelled || booking.status !== 'cancelled')
    .filter((booking) => !options.staffId || booking.staffId === options.staffId)
    .filter((booking) => !options.from || booking.endAt >= options.from)
    .filter((booking) => !options.to || booking.startAt <= options.to)
    .sort((a, b) => a.startAt.localeCompare(b.startAt));
}

export function timestamped<T extends object>(value: T, createdAt?: string): T & {
  createdAt: string;
  updatedAt: string;
} {
  const stamp = nowIso();
  return { ...value, createdAt: createdAt || stamp, updatedAt: stamp };
}
