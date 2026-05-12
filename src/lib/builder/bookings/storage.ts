import { promises as fs } from 'fs';
import path from 'path';
import { get, list, put } from '@vercel/blob';
import type {
  Booking,
  BookingService,
  BookingWaitlistEntry,
  BookingWaitlistStatus,
  DayOfWeek,
  Staff,
  StaffAvailability,
} from '@/lib/builder/bookings/types';
import { createLocalizedText, dayOfWeeks } from '@/lib/builder/bookings/types';

const BOOKINGS_ROOT = path.join(process.cwd(), 'runtime-data', 'builder-bookings');
const BLOB_PREFIX = 'builder-bookings/';

type Collection = 'services' | 'staff' | 'availability' | 'bookings' | 'waitlist';
type BookingBackend = 'blob' | 'file';

function getBackend(): BookingBackend {
  return process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'file';
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

function weeklyDefaults(): StaffAvailability['weekly'] {
  return Object.fromEntries(
    dayOfWeeks.map((day) => [
      day,
      day === 'saturday' || day === 'sunday' ? [] : [{ start: '09:00', end: '18:00' }],
    ]),
  ) as Record<DayOfWeek, Array<{ start: string; end: string }>>;
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
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 15,
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
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 15,
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
      bufferBeforeMinutes: 15,
      bufferAfterMinutes: 15,
      slotStepMinutes: 30,
      isActive: true,
      paymentMode: 'free',
      priceCurrency: 'TWD',
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
  const [services, staff] = await Promise.all([
    listJson<BookingService>('services'),
    listJson<Staff>('staff'),
  ]);
  if (services.length > 0 && staff.length > 0) return;

  const timestamp = nowIso();
  const nextServices = services.length > 0 ? services : seedServices(timestamp);
  const nextStaff = staff.length > 0 ? staff : seedStaff(timestamp);

  await Promise.all([
    ...nextServices.map((service) => writeJson('services', service.serviceId, service)),
    ...nextStaff.map((member) => writeJson('staff', member.staffId, member)),
    ...nextStaff.map((member) => writeJson('availability', member.staffId, {
      staffId: member.staffId,
      weekly: weeklyDefaults(),
      blockedDates: [],
      timezone: 'Asia/Taipei',
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

export async function getStaffAvailability(staffId: string): Promise<StaffAvailability> {
  await ensureSeedData();
  const existing = await readJson<StaffAvailability>('availability', staffId);
  if (existing) return existing;
  return {
    staffId,
    weekly: weeklyDefaults(),
    blockedDates: [],
    timezone: 'Asia/Taipei',
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

export async function saveBooking(booking: Booking): Promise<void> {
  await writeJson('bookings', booking.bookingId, booking);
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
