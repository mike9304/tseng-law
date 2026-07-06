import {
  getService,
  getStaff,
  getStaffAvailability,
  listResources,
  listBookings,
  listStaff,
} from '@/lib/builder/bookings/storage';
import type { BookingResource, DayOfWeek } from '@/lib/builder/bookings/types';
import { dayOfWeeks } from '@/lib/builder/bookings/types';
import { isHolidayDate } from '@/lib/builder/bookings/availability-templates';
import { dateInTimezone, dayOfWeekInTimezone, localDateTimeToUtcIso, normalizeBookingTimezone, timeInTimezone } from './timezone';

export interface SlotRequest {
  serviceId: string;
  staffId: string;
  date: string;
  excludeBookingId?: string;
}

export interface Slot {
  startAt: string;
  endAt: string;
  staffId: string;
  timezone: string;
  capacityRemaining?: number;
  capacityTotal?: number;
}

const SLOT_STEP_MINUTES = 30;

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

function addMinutes(iso: string, minutes: number): string {
  return new Date(new Date(iso).getTime() + minutes * 60_000).toISOString();
}

function intervalsOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart < bEnd && aEnd > bStart;
}

function slotWithinWeeklyAvailability(
  startAt: string,
  endAt: string,
  weekly: BookingResource['weekly'],
  timezone: string,
): boolean {
  if (!weekly) return true;
  const day = dayOfWeekInTimezone(startAt, timezone);
  const blocks = weekly[day] || [];
  if (blocks.length === 0) return false;
  const startTime = timeInTimezone(startAt, timezone);
  const endTime = timeInTimezone(endAt, timezone);
  return blocks.some((block) => block.start <= startTime && endTime <= block.end);
}

function staffAvailabilityBlocksForDate(
  availability: Awaited<ReturnType<typeof getStaffAvailability>>,
  date: string,
): { blocks: Array<{ start: string; end: string }>; overridden: boolean } {
  const override = availability.dateOverrides?.find((item) => item.date === date);
  if (override) return { blocks: override.blocks, overridden: true };
  const day = dayOfWeekForDate(date);
  return { blocks: availability.weekly[day] || [], overridden: false };
}

export { describeStaffAvailabilityForDate, type StaffAvailabilityPreview } from './availability-preview';

function resourceOverlapCount(
  resource: BookingResource,
  bookings: Array<{
    resourceIds?: string[];
    startAt: string;
    endAt: string;
    serviceId: string;
    staffId: string;
  }>,
  candidateStartWithBuffer: string,
  candidateEndWithBuffer: string,
  startAt: string,
  endAt: string,
  serviceId: string,
  staffId: string,
): number {
  return bookings.reduce((count, booking) => {
    if (!booking.resourceIds?.includes(resource.resourceId)) return count;
    const isSameGroupSlot = booking.serviceId === serviceId
      && booking.staffId === staffId
      && booking.startAt === startAt
      && booking.endAt === endAt;
    if (isSameGroupSlot) return count + 1;
    const resourceStart = addMinutes(booking.startAt, -(resource.bufferBeforeMinutes ?? 0));
    const resourceEnd = addMinutes(booking.endAt, resource.bufferAfterMinutes ?? 0);
    return intervalsOverlap(candidateStartWithBuffer, candidateEndWithBuffer, resourceStart, resourceEnd)
      ? count + 1
      : count;
  }, 0);
}

async function computeSlotsForStaff(
  serviceId: string,
  staffId: string,
  date: string,
  excludeBookingId?: string,
): Promise<Slot[]> {
  const [service, staff, availability] = await Promise.all([
    getService(serviceId),
    getStaff(staffId),
    getStaffAvailability(staffId),
  ]);

  if (!service || !service.isActive || !staff || !staff.isActive) return [];
  if (service.staffIds.length > 0 && !service.staffIds.includes(staffId)) return [];
  const timezone = normalizeBookingTimezone(availability.timezone);
  const { blocks, overridden } = staffAvailabilityBlocksForDate(availability, date);
  if (!overridden && isHolidayDate(date, availability.holidayCalendar)) return [];
  if (blocks.length === 0) return [];

  const from = localDateTimeToUtcIso(date, '00:00', timezone);
  const to = addMinutes(from, 36 * 60);
  const requiredResourceIds = service.requiredResourceIds ?? [];
  const [allStaffBookings, allResourceBookings, resources] = await Promise.all([
    listBookings({ from, to, staffId }),
    requiredResourceIds.length > 0 ? listBookings({ from, to }) : Promise.resolve([]),
    requiredResourceIds.length > 0 ? listResources(true) : Promise.resolve([]),
  ]);
  const staffBookings = allStaffBookings.filter((booking) => booking.bookingId !== excludeBookingId);
  const resourceBookings = allResourceBookings.filter((booking) => booking.bookingId !== excludeBookingId);
  const requiredResources = resources.filter((resource) => requiredResourceIds.includes(resource.resourceId));
  const bufferBefore = service.bufferBeforeMinutes;
  const bufferAfter = service.bufferAfterMinutes;
  const maxParticipants = Math.max(1, service.maxParticipants ?? 1);
  const slotStepMinutes = service.slotStepMinutes ?? SLOT_STEP_MINUTES;
  const now = new Date().toISOString();

  const slots: Slot[] = [];
  for (const block of blocks) {
    const blockStart = parseTimeToMinutes(block.start);
    const blockEnd = parseTimeToMinutes(block.end);
    const latestStart = blockEnd - service.durationMinutes;

    for (let cursor = blockStart; cursor <= latestStart; cursor += slotStepMinutes) {
      const startAt = localDateTimeToUtcIso(date, minutesToTime(cursor), timezone);
      const endAt = addMinutes(startAt, service.durationMinutes);
      if (startAt <= now) continue;

      const candidateBlocked = availability.blockedDates.some((blocked) =>
        intervalsOverlap(startAt, endAt, blocked.start, blocked.end),
      );
      if (candidateBlocked) continue;

      const candidateStartWithBuffer = addMinutes(startAt, -bufferBefore);
      const candidateEndWithBuffer = addMinutes(endAt, bufferAfter);
      const overlappingBookings = staffBookings.filter((booking) =>
        intervalsOverlap(candidateStartWithBuffer, candidateEndWithBuffer, booking.startAt, booking.endAt),
      );
      const exactSlotBookings = overlappingBookings.filter((booking) =>
        booking.serviceId === service.serviceId
        && booking.staffId === staffId
        && booking.startAt === startAt
        && booking.endAt === endAt,
      );
      const conflictingBookings = overlappingBookings.filter((booking) => !exactSlotBookings.includes(booking));

      const hasResourceBlockedTime = requiredResources.some((resource) =>
        (resource.blockedDates ?? []).some((blocked) => {
          const resourceStart = addMinutes(blocked.start, -(resource.bufferBeforeMinutes ?? 0));
          const resourceEnd = addMinutes(blocked.end, resource.bufferAfterMinutes ?? 0);
          return intervalsOverlap(candidateStartWithBuffer, candidateEndWithBuffer, resourceStart, resourceEnd);
        }),
      );
      const hasResourceWeeklyConflict = requiredResources.some((resource) => {
        const resourceTimezone = normalizeBookingTimezone(resource.timezone ?? timezone);
        return !slotWithinWeeklyAvailability(startAt, endAt, resource.weekly, resourceTimezone);
      });
      const hasResourceCapacityConflict = requiredResources.some((resource) => {
        const capacity = Math.max(1, resource.capacity ?? 1);
        return resourceOverlapCount(
          resource,
          resourceBookings,
          candidateStartWithBuffer,
          candidateEndWithBuffer,
          startAt,
          endAt,
          service.serviceId,
          staffId,
        ) >= capacity;
      });

      if (!hasResourceBlockedTime && !hasResourceWeeklyConflict && !hasResourceCapacityConflict && conflictingBookings.length === 0 && exactSlotBookings.length < maxParticipants) {
        slots.push({
          startAt,
          endAt,
          staffId,
          timezone,
          capacityRemaining: maxParticipants - exactSlotBookings.length,
          capacityTotal: maxParticipants,
        });
      }
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
      computeSlotsForStaff(request.serviceId, staffId, request.date, request.excludeBookingId),
    ));
    return results.flat().sort((a, b) => a.startAt.localeCompare(b.startAt));
  }

  return computeSlotsForStaff(request.serviceId, request.staffId, request.date, request.excludeBookingId);
}

export async function isSlotAvailable(request: {
  serviceId: string;
  staffId: string;
  startAt: string;
  durationMinutes?: number;
  excludeBookingId?: string;
}): Promise<boolean> {
  const availability = await getStaffAvailability(request.staffId);
  const date = dateInTimezone(request.startAt, availability.timezone);
  const slots = await computeAvailableSlots({
    serviceId: request.serviceId,
    staffId: request.staffId,
    date,
    excludeBookingId: request.excludeBookingId,
  });
  return slots.some((slot) => slot.startAt === request.startAt);
}

export function addBookingDuration(startAt: string, durationMinutes: number): string {
  return addMinutes(startAt, durationMinutes);
}
