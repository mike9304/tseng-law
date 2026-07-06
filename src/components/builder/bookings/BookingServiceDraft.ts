import type { BookingDiscountRule, BookingResource, BookingService } from '@/lib/builder/bookings/types';
import { textForLocale } from '@/lib/builder/bookings/types';
import type { Locale } from '@/lib/locales';

export type ServiceDraft = {
  serviceId?: string;
  nameKo: string;
  nameZh: string;
  nameEn: string;
  descriptionKo: string;
  descriptionZh: string;
  descriptionEn: string;
  durationMinutes: number;
  priceTwd: number;
  image: string;
  category: string;
  staffIds: string[];
  requiredResourceIds: string[];
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  maxParticipants: number;
  slotStepMinutes: number;
  isActive: boolean;
  paymentMode: 'free' | 'paid';
  priceAmount: number;
  priceCurrency: 'KRW' | 'USD' | 'TWD' | 'JPY' | 'EUR';
  depositAmount: number;
  collectPaymentLater: boolean;
  staffPriceOverrides: Record<string, number>;
  resourcePriceOverrides: Record<string, number>;
  discountCodes: BookingDiscountRule[];
  meetingMode: 'in-person' | 'zoom' | 'phone' | 'hybrid';
  cancellationPolicyId: string;
  reminderOffsetsHours: Array<1 | 24>;
};

function reminderOffsetsFromService(service?: BookingService): Array<1 | 24> {
  if (service?.reminderOffsetsHours === undefined) return [24];
  return service.reminderOffsetsHours.filter((hours): hours is 1 | 24 => hours === 1 || hours === 24);
}

export function draftFromService(service?: BookingService): ServiceDraft {
  return {
    serviceId: service?.serviceId,
    nameKo: service?.name.ko || '',
    nameZh: service?.name['zh-hant'] || '',
    nameEn: service?.name.en || '',
    descriptionKo: service?.description.ko || '',
    descriptionZh: service?.description['zh-hant'] || '',
    descriptionEn: service?.description.en || '',
    durationMinutes: service?.durationMinutes || 30,
    priceTwd: service?.priceTwd || 0,
    image: service?.image || '',
    category: service?.category || 'consultation',
    staffIds: service?.staffIds || [],
    requiredResourceIds: service?.requiredResourceIds || [],
    bufferBeforeMinutes: service?.bufferBeforeMinutes || 0,
    bufferAfterMinutes: service?.bufferAfterMinutes ?? 15,
    maxParticipants: service?.maxParticipants ?? 1,
    slotStepMinutes: service?.slotStepMinutes ?? 30,
    isActive: service?.isActive ?? true,
    paymentMode: service?.paymentMode ?? 'free',
    priceAmount: service?.priceAmount ?? service?.priceTwd ?? 0,
    priceCurrency: service?.priceCurrency ?? 'TWD',
    depositAmount: service?.depositAmount ?? 0,
    collectPaymentLater: service?.collectPaymentLater ?? false,
    staffPriceOverrides: { ...(service?.staffPriceOverrides ?? {}) },
    resourcePriceOverrides: { ...(service?.resourcePriceOverrides ?? {}) },
    discountCodes: (service?.discountCodes ?? []).map((rule) => ({ ...rule })),
    meetingMode: service?.meetingMode ?? 'in-person',
    cancellationPolicyId: service?.cancellationPolicyId ?? '',
    reminderOffsetsHours: reminderOffsetsFromService(service),
  };
}

function buildStaffPriceOverrides(draft: ServiceDraft): Record<string, number> {
  const pruned: Record<string, number> = {};
  for (const staffId of draft.staffIds) {
    const amount = draft.staffPriceOverrides[staffId];
    if (typeof amount === 'number' && amount > 0) pruned[staffId] = amount;
  }
  return pruned;
}

function buildResourcePriceOverrides(draft: ServiceDraft): Record<string, number> {
  const pruned: Record<string, number> = {};
  for (const resourceId of draft.requiredResourceIds) {
    const amount = draft.resourcePriceOverrides[resourceId];
    if (typeof amount === 'number' && amount > 0) pruned[resourceId] = amount;
  }
  return pruned;
}

function normalizeDraftDiscountCode(code: string): string {
  return code.trim().toUpperCase().slice(0, 32);
}

function buildDiscountCodes(draft: ServiceDraft): BookingDiscountRule[] {
  const seen = new Set<string>();
  const rules: BookingDiscountRule[] = [];
  for (const rule of draft.discountCodes) {
    const code = normalizeDraftDiscountCode(rule.code);
    const type = rule.type === 'fixed' ? 'fixed' : 'percent';
    const value = Math.floor(Number(rule.value) || 0);
    if (!code || value <= 0 || (type === 'percent' && value > 100) || seen.has(code)) continue;
    seen.add(code);
    rules.push({
      code,
      type,
      value,
      active: rule.active !== false,
      locale: rule.locale === 'ko' || rule.locale === 'zh-hant' || rule.locale === 'en' ? rule.locale : 'all',
      ...(rule.minSubtotalAmount && rule.minSubtotalAmount > 0 ? { minSubtotalAmount: Math.floor(rule.minSubtotalAmount) } : {}),
      ...(rule.maxDiscountAmount && rule.maxDiscountAmount > 0 ? { maxDiscountAmount: Math.floor(rule.maxDiscountAmount) } : {}),
      ...(rule.startsAt ? { startsAt: rule.startsAt } : {}),
      ...(rule.endsAt ? { endsAt: rule.endsAt } : {}),
    });
  }
  return rules;
}

export function servicePayload(draft: ServiceDraft) {
  const fallback = draft.nameKo || draft.nameEn || 'Consultation';
  return {
    name: { ko: draft.nameKo || fallback, 'zh-hant': draft.nameZh || fallback, en: draft.nameEn || fallback },
    description: {
      ko: draft.descriptionKo,
      'zh-hant': draft.descriptionZh || draft.descriptionKo,
      en: draft.descriptionEn || draft.descriptionKo,
    },
    durationMinutes: draft.durationMinutes,
    priceTwd: draft.priceTwd,
    image: draft.image,
    category: draft.category,
    staffIds: draft.staffIds,
    requiredResourceIds: draft.requiredResourceIds,
    bufferBeforeMinutes: draft.bufferBeforeMinutes,
    bufferAfterMinutes: draft.bufferAfterMinutes,
    maxParticipants: draft.maxParticipants,
    slotStepMinutes: draft.slotStepMinutes,
    isActive: draft.isActive,
    paymentMode: draft.paymentMode,
    priceAmount: draft.paymentMode === 'paid' ? draft.priceAmount : undefined,
    priceCurrency: draft.priceCurrency,
    depositAmount: draft.paymentMode === 'paid' && !draft.collectPaymentLater && draft.depositAmount > 0 ? draft.depositAmount : 0,
    collectPaymentLater: draft.paymentMode === 'paid' ? draft.collectPaymentLater : false,
    staffPriceOverrides: draft.paymentMode === 'paid' ? buildStaffPriceOverrides(draft) : undefined,
    resourcePriceOverrides: draft.paymentMode === 'paid' ? buildResourcePriceOverrides(draft) : undefined,
    discountCodes: draft.paymentMode === 'paid' ? buildDiscountCodes(draft) : undefined,
    meetingMode: draft.meetingMode,
    cancellationPolicyId: draft.cancellationPolicyId || undefined,
    reminderOffsetsHours: draft.reminderOffsetsHours,
  };
}

export function toggleReminderHour(current: Array<1 | 24>, hour: 1 | 24, checked: boolean): Array<1 | 24> {
  const next = checked ? [...current, hour] : current.filter((value) => value !== hour);
  return Array.from(new Set(next)).sort((a, b) => b - a) as Array<1 | 24>;
}

export function inactiveResourceNames(service: BookingService, resourceById: ReadonlyMap<string, BookingResource>, locale: Locale): string[] {
  return inactiveResourceNamesFromIds(service.requiredResourceIds ?? [], resourceById, locale);
}

export function inactiveResourceNamesFromIds(resourceIds: readonly string[], resourceById: ReadonlyMap<string, BookingResource>, locale: Locale): string[] {
  return resourceIds
    .map((id) => resourceById.get(id))
    .filter((resource): resource is BookingResource => Boolean(resource && !resource.isActive))
    .map((resource) => textForLocale(resource.name, locale));
}

export function meetingModeLabel(locale: Locale, meetingMode?: BookingService['meetingMode']): string {
  if (meetingMode === 'zoom') return locale === 'ko' ? 'Zoom 자동 링크' : locale === 'zh-hant' ? 'Zoom 自動連結' : 'Zoom auto link';
  if (meetingMode === 'phone') return locale === 'ko' ? '전화' : locale === 'zh-hant' ? '電話' : 'Phone';
  if (meetingMode === 'hybrid') return locale === 'ko' ? '하이브리드' : locale === 'zh-hant' ? '混合' : 'Hybrid';
  return locale === 'ko' ? '대면' : locale === 'zh-hant' ? '現場' : 'In-person';
}
