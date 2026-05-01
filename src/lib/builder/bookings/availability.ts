import {
  getService,
  getStaff,
  getStaffAvailability,
  listBookings,
  listStaff,
} from '@/lib/builder/bookings/storage';
import { dayOfWeeks, type DayOfWeek } from '@/lib/builder/bookings/types';

export interface SlotRequest {
  serviceId: string;
  staffId: string;
  date: string;
}

export interface Slot {
  startAt: string;
  endAt: string;
  staffId: string;
}

const SLOT_STEP_MINUTES = 30;

function timezoneOffset(timezone: string): string {
  if (timezone === 'Asia/Seoul') return '+09:00';
  return '+08:00';
}

function dayOfWeekForDate(date: string): DayOfWeek {
  const index = new Date(`${date}T12:00:00.000Z`).getUTCDay();
  return dayOfWeeks[(index + 6) % 7];
}

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
  const mins = (minutes % 60).toString().padStart(2, '0');
  return `${hours}:${mins}`;
}

function toIso(date: string, time: string, timezone: string): string {
  return new Date(`${date}T${time}:00.000${timezoneOffset(timezone)}`).toISOString();
}

function addMinutes(iso: string, minutes: number): string {
  return new Date(new Date(iso).getTime() + minutes * 60_000).toISOString();
}

function intervalsOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart < bEnd && aEnd > bStart;
}

async function computeSlotsForStaff(serviceId: string, staffId: string, date: string): Promise<Slot[]> {
  const [service, staff, availability] = await Promise.all([
    getService(serviceId),
    getStaff(staffId),
    getStaffAvailability(staffId),
  ]);

  if (!service || !service.isActive || !staff || !staff.isActive) return [];
  if (service.staffIds.length > 0 && !service.staffIds.includes(staffId)) return [];

  const day = dayOfWeekForDate(date);
  const blocks = availability.weekly[day] || [];
  if (blocks.length === 0) return [];

  const from = toIso(date, '00:00', availability.timezone);
  const to = addMinutes(from, 36 * 60);
  const bookings = await listBookings({ from, to, staffId });
  const bufferBefore = service.bufferBeforeMinutes;
  const bufferAfter = service.bufferAfterMinutes;
  const now = new Date().toISOString();

  const slots: Slot[] = [];
  for (const block of blocks) {
    const blockStart = parseTimeToMinutes(block.start);
    const blockEnd = parseTimeToMinutes(block.end);
    const latestStart = blockEnd - service.durationMinutes;

    for (let cursor = blockStart; cursor <= latestStart; cursor += SLOT_STEP_MINUTES) {
      const startAt = toIso(date, minutesToTime(cursor), availability.timezone);
      const endAt = addMinutes(startAt, service.durationMinutes);
      if (startAt <= now) continue;

      const candidateBlocked = availability.blockedDates.some((blocked) =>
        intervalsOverlap(startAt, endAt, blocked.start, blocked.end),
      );
      if (candidateBlocked) continue;

      const candidateStartWithBuffer = addMinutes(startAt, -bufferBefore);
      const candidateEndWithBuffer = addMinutes(endAt, bufferAfter);
      const hasConflict = bookings.some((booking) =>
        intervalsOverlap(candidateStartWithBuffer, candidateEndWithBuffer, booking.startAt, booking.endAt),
      );
      if (!hasConflict) slots.push({ startAt, endAt, staffId });
    }
  }

  return slots;
}

export async function computeAvailableSlots(request: SlotRequest): Promise<Slot[]> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(request.date)) return [];

  if (request.staffId === 'any') {
    const service = await getService(request.serviceId);
    if (!service) return [];
    const staff = await listStaff();
    const candidateIds = (service.staffIds.length > 0 ? service.staffIds : staff.map((member) => member.staffId))
      .filter((staffId) => staff.some((member) => member.staffId === staffId && member.isActive));
    const results = await Promise.all(candidateIds.map((staffId) =>
      computeSlotsForStaff(request.serviceId, staffId, request.date),
    ));
    return results.flat().sort((a, b) => a.startAt.localeCompare(b.startAt));
  }

  return computeSlotsForStaff(request.serviceId, request.staffId, request.date);
}

export async function isSlotAvailable(request: {
  serviceId: string;
  staffId: string;
  startAt: string;
  durationMinutes?: number;
}): Promise<boolean> {
  const date = request.startAt.slice(0, 10);
  const slots = await computeAvailableSlots({
    serviceId: request.serviceId,
    staffId: request.staffId,
    date,
  });
  return slots.some((slot) => slot.startAt === request.startAt);
}

export function addBookingDuration(startAt: string, durationMinutes: number): string {
  return addMinutes(startAt, durationMinutes);
}
