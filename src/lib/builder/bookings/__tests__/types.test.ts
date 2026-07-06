import { describe, expect, it } from 'vitest';
import {
  bookingPackageCreditInputSchema,
  bookingPackageInputSchema,
  bookingResourceInputSchema,
  bookingServiceInputSchema,
  bookingCreateSchema,
  createLocalizedText,
  staffAvailabilitySchema,
} from '@/lib/builder/bookings/types';

const baseServiceInput = {
  name: createLocalizedText('Group consultation'),
  description: createLocalizedText('Capacity-aware class booking'),
  durationMinutes: 45,
  priceTwd: 0,
  image: '',
  category: 'consultation',
  staffIds: ['staff-test'],
  bufferBeforeMinutes: 0,
  bufferAfterMinutes: 0,
  slotStepMinutes: 15,
  isActive: true,
  paymentMode: 'free',
  priceCurrency: 'TWD',
  meetingMode: 'in-person',
} as const;

describe('booking service input schema', () => {
  it('accepts service capacity for group bookings', () => {
    const parsed = bookingServiceInputSchema.parse({
      ...baseServiceInput,
      maxParticipants: 12,
    });

    expect(parsed.maxParticipants).toBe(12);
  });

  it('defaults legacy services to one participant and rejects invalid capacity', () => {
    expect(bookingServiceInputSchema.parse(baseServiceInput).maxParticipants).toBe(1);
    expect(() => bookingServiceInputSchema.parse({ ...baseServiceInput, maxParticipants: 0 })).toThrow();
    expect(() => bookingServiceInputSchema.parse({ ...baseServiceInput, maxParticipants: 251 })).toThrow();
  });

  it('accepts only supported service reminder offsets', () => {
    expect(bookingServiceInputSchema.parse({
      ...baseServiceInput,
      reminderOffsetsHours: [24, 1],
    }).reminderOffsetsHours).toEqual([24, 1]);
    expect(bookingServiceInputSchema.parse({
      ...baseServiceInput,
      reminderOffsetsHours: [],
    }).reminderOffsetsHours).toEqual([]);
    expect(() => bookingServiceInputSchema.parse({ ...baseServiceInput, reminderOffsetsHours: [2] })).toThrow();
  });

  it('accepts required resources on booking services', () => {
    const parsed = bookingServiceInputSchema.parse({
      ...baseServiceInput,
      requiredResourceIds: ['room-a', 'projector-a'],
    });

    expect(parsed.requiredResourceIds).toEqual(['room-a', 'projector-a']);
  });

  it('accepts paid service deposits only below the full payment amount', () => {
    const parsed = bookingServiceInputSchema.parse({
      ...baseServiceInput,
      paymentMode: 'paid',
      priceAmount: 5000,
      depositAmount: 1500,
    });

    expect(parsed.depositAmount).toBe(1500);
    expect(() => bookingServiceInputSchema.parse({
      ...baseServiceInput,
      paymentMode: 'paid',
      priceAmount: 5000,
      depositAmount: 5000,
    })).toThrow();
  });

  it('accepts staff-specific prices only for paid services', () => {
    const parsed = bookingServiceInputSchema.parse({
      ...baseServiceInput,
      paymentMode: 'paid',
      priceAmount: 5000,
      staffPriceOverrides: { 'staff-premium': 8000 },
    });

    expect(parsed.staffPriceOverrides).toEqual({ 'staff-premium': 8000 });
    expect(() => bookingServiceInputSchema.parse({
      ...baseServiceInput,
      paymentMode: 'free',
      staffPriceOverrides: { 'staff-premium': 8000 },
    })).toThrow();
  });

  it('accepts resource-specific prices only for paid services', () => {
    const parsed = bookingServiceInputSchema.parse({
      ...baseServiceInput,
      paymentMode: 'paid',
      priceAmount: 5000,
      resourcePriceOverrides: { 'room-a': 9000 },
    });

    expect(parsed.resourcePriceOverrides).toEqual({ 'room-a': 9000 });
    expect(() => bookingServiceInputSchema.parse({
      ...baseServiceInput,
      paymentMode: 'free',
      resourcePriceOverrides: { 'room-a': 9000 },
    })).toThrow();
  });

  it('accepts discount codes only for paid services', () => {
    const parsed = bookingServiceInputSchema.parse({
      ...baseServiceInput,
      paymentMode: 'paid',
      priceAmount: 5000,
      discountCodes: [{ code: ' legal20 ', type: 'percent', value: 20, active: true }],
    });

    expect(parsed.discountCodes).toEqual([
      expect.objectContaining({
        code: 'LEGAL20',
        type: 'percent',
        value: 20,
        active: true,
        locale: 'all',
      }),
    ]);
    expect(() => bookingServiceInputSchema.parse({
      ...baseServiceInput,
      paymentMode: 'free',
      discountCodes: [{ code: 'LEGAL20', type: 'percent', value: 20, active: true }],
    })).toThrow();
    expect(() => bookingServiceInputSchema.parse({
      ...baseServiceInput,
      paymentMode: 'paid',
      priceAmount: 5000,
      discountCodes: [{ code: 'TOO-MUCH', type: 'percent', value: 101, active: true }],
    })).toThrow();
  });

  it('accepts collect-later paid services and rejects collect-later deposits', () => {
    const parsed = bookingServiceInputSchema.parse({
      ...baseServiceInput,
      paymentMode: 'paid',
      priceAmount: 5000,
      collectPaymentLater: true,
    });

    expect(parsed.collectPaymentLater).toBe(true);
    expect(() => bookingServiceInputSchema.parse({
      ...baseServiceInput,
      paymentMode: 'paid',
      priceAmount: 5000,
      collectPaymentLater: true,
      depositAmount: 1500,
    })).toThrow();
    expect(() => bookingServiceInputSchema.parse({
      ...baseServiceInput,
      paymentMode: 'free',
      collectPaymentLater: true,
    })).toThrow();
  });
});

describe('booking resource input schema', () => {
  it('validates room and equipment resources', () => {
    const parsed = bookingResourceInputSchema.parse({
      name: createLocalizedText('Conference room'),
      description: createLocalizedText('Shared room'),
      location: 'Taipei Office',
      capacity: 8,
      bufferBeforeMinutes: 15,
      bufferAfterMinutes: 30,
      blockedDates: [{
        start: '2099-01-05T00:00:00.000Z',
        end: '2099-01-05T01:00:00.000Z',
        reason: 'Maintenance',
      }],
      isActive: true,
    });

    expect(parsed.capacity).toBe(8);
    expect(parsed.location).toBe('Taipei Office');
    expect(parsed.bufferBeforeMinutes).toBe(15);
    expect(parsed.bufferAfterMinutes).toBe(30);
    expect(parsed.blockedDates).toHaveLength(1);
  });

  it('accepts recurring weekly calendars and resource timezones', () => {
    const parsed = bookingResourceInputSchema.parse({
      name: createLocalizedText('Recurring room'),
      weekly: {
        monday: [{ start: '09:00', end: '09:45' }],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      },
      timezone: 'America/New_York',
      recurringTemplateId: 'weekdays-09-18',
    });

    expect(parsed.weekly.monday).toEqual([{ start: '09:00', end: '09:45' }]);
    expect(parsed.timezone).toBe('America/New_York');
    expect(parsed.recurringTemplateId).toBe('weekdays-09-18');
  });

  it('rejects invalid resource capacity', () => {
    expect(() => bookingResourceInputSchema.parse({
      name: createLocalizedText('Invalid room'),
      capacity: 0,
    })).toThrow();
    expect(() => bookingResourceInputSchema.parse({
      name: createLocalizedText('Invalid blocked room'),
      blockedDates: [{
        start: '2099-01-05T01:00:00.000Z',
        end: '2099-01-05T00:00:00.000Z',
      }],
    })).toThrow();
  });
});

describe('booking timezone schemas', () => {
  it('accepts valid IANA timezones and rejects invalid timezone strings', () => {
    const availability = staffAvailabilitySchema.parse({
      staffId: 'staff-test',
      weekly: {
        monday: [{ start: '09:00', end: '17:00' }],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      },
      blockedDates: [],
      timezone: 'America/New_York',
    });

    expect(availability.timezone).toBe('America/New_York');
    expect(() => staffAvailabilitySchema.parse({ ...availability, timezone: 'Mars/Base' })).toThrow();
    expect(() => bookingCreateSchema.parse({
      serviceId: 'svc-test',
      staffId: 'staff-test',
      startAt: '2099-01-05T14:00:00.000Z',
      customerTimezone: 'Not/AZone',
      customer: {
        name: 'Client',
        email: 'client@example.com',
        locale: 'ko',
      },
    })).toThrow();
  });
});

describe('booking package input schema', () => {
  it('validates session packages and customer credits', () => {
    const pkg = bookingPackageInputSchema.parse({
      name: createLocalizedText('Three consultations'),
      description: createLocalizedText('Three prepaid sessions'),
      eligibleServiceIds: ['svc-test'],
      credits: 3,
      validityDays: 180,
      priceAmount: 15000,
      priceCurrency: 'TWD',
      isActive: true,
    });

    const credit = bookingPackageCreditInputSchema.parse({
      packageId: 'pkg-test',
      customerEmail: 'CLIENT@EXAMPLE.COM',
      totalCredits: 3,
      expiresAt: '2099-01-05T00:00:00.000Z',
    });

    expect(pkg.credits).toBe(3);
    expect(credit.status).toBe('active');
  });

  it('rejects invalid package credits', () => {
    expect(() => bookingPackageInputSchema.parse({
      name: createLocalizedText('Invalid package'),
      credits: 0,
    })).toThrow();
    expect(() => bookingPackageCreditInputSchema.parse({
      packageId: 'pkg-test',
      customerEmail: 'not-email',
    })).toThrow();
  });
});
