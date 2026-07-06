import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { Locator, Page } from '@playwright/test';

type LocalizedText = {
  readonly ko: string | undefined;
  readonly en: string | undefined;
  readonly 'zh-hant': string | undefined;
};

export type StaffRecord = {
  readonly staffId: string;
  readonly name: LocalizedText;
  readonly title: LocalizedText;
  readonly bio: LocalizedText;
  readonly email: string | undefined;
  readonly photo: string | undefined;
  readonly isActive: boolean | undefined;
};

export type ServiceRecord = {
  readonly serviceId: string;
  readonly name: LocalizedText;
  readonly staffIds: readonly string[];
};

export type StaffValues = {
  readonly nameKo: string;
  readonly nameEn: string;
  readonly nameZh: string;
  readonly titleKo: string;
  readonly titleEn: string;
  readonly titleZh: string;
  readonly bioKo: string;
  readonly bioEn: string;
  readonly bioZh: string;
  readonly email: string;
  readonly photo: string;
};

type PollRequest<T> = {
  readonly headers: Record<string, string>;
  readonly match: (record: T) => boolean;
};

export type CleanupIds = {
  readonly staffId: string | null;
  readonly serviceId: string | null;
};

const serviceEditorSelector = '[data-booking-service-editor="true"]';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function booleanValue(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}

function localizedValue(value: unknown): LocalizedText {
  const source = isRecord(value) ? value : {};
  return {
    ko: stringValue(source.ko),
    en: stringValue(source.en),
    'zh-hant': stringValue(source['zh-hant']),
  };
}

function stringArrayValue(value: unknown): readonly string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function parseStaff(value: unknown): StaffRecord | null {
  if (!isRecord(value) || typeof value.staffId !== 'string') {
    return null;
  }
  return {
    staffId: value.staffId,
    name: localizedValue(value.name),
    title: localizedValue(value.title),
    bio: localizedValue(value.bio),
    email: stringValue(value.email),
    photo: stringValue(value.photo),
    isActive: booleanValue(value.isActive),
  };
}

function parseService(value: unknown): ServiceRecord | null {
  if (!isRecord(value) || typeof value.serviceId !== 'string') {
    return null;
  }
  return {
    serviceId: value.serviceId,
    name: localizedValue(value.name),
    staffIds: stringArrayValue(value.staffIds),
  };
}

function servicePayload(payload: unknown): ServiceRecord | null {
  return isRecord(payload) ? parseService(payload.service) : null;
}

function staffList(payload: unknown): readonly StaffRecord[] {
  if (!isRecord(payload) || !Array.isArray(payload.staff)) {
    return [];
  }
  return payload.staff.map(parseStaff).filter((staff): staff is StaffRecord => staff !== null);
}

function serviceList(payload: unknown): readonly ServiceRecord[] {
  if (!isRecord(payload) || !Array.isArray(payload.services)) {
    return [];
  }
  return payload.services.map(parseService).filter((service): service is ServiceRecord => service !== null);
}

export function headersFor(token: string): Record<string, string> {
  return { 'x-forwarded-for': `qa-w197-${token}` };
}

export function createValues(token: string): StaffValues {
  return {
    nameKo: `W197 담당자 ${token}`,
    nameEn: `W197 Attorney ${token}`,
    nameZh: `W197 律師 ${token}`,
    titleKo: '국제상속 변호사',
    titleEn: 'Cross-border succession attorney',
    titleZh: '跨境繼承律師',
    bioKo: `생성 검증 ${token}`,
    bioEn: `Created verification ${token}`,
    bioZh: `建立驗證 ${token}`,
    email: `w197-${token}@example.com`,
    photo: `https://example.com/w197-${token}.jpg`,
  };
}

export function updateValues(token: string): StaffValues {
  return {
    ...createValues(token),
    nameKo: `W197 담당자 수정 ${token}`,
    titleKo: '국제가사 파트너 변호사',
    bioKo: `수정 검증 ${token}`,
    email: `w197-edited-${token}@example.com`,
  };
}

async function fetchStaff(page: Page, headers: Record<string, string>): Promise<readonly StaffRecord[]> {
  const response = await page.request.get('/api/builder/bookings/staff?includeInactive=1', { headers });
  if (!response.ok()) {
    return [];
  }
  const payload: unknown = await response.json();
  return staffList(payload);
}

async function fetchServices(page: Page, headers: Record<string, string>): Promise<readonly ServiceRecord[]> {
  const response = await page.request.get('/api/builder/bookings/services?includeInactive=1', { headers });
  if (!response.ok()) {
    return [];
  }
  const payload: unknown = await response.json();
  return serviceList(payload);
}

export async function waitForStaff(page: Page, poll: PollRequest<StaffRecord>): Promise<StaffRecord | null> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const match = (await fetchStaff(page, poll.headers)).find(poll.match);
    if (match) {
      return match;
    }
    await page.waitForTimeout(250);
  }
  return null;
}

export async function waitForService(page: Page, poll: PollRequest<ServiceRecord>): Promise<ServiceRecord | null> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const match = (await fetchServices(page, poll.headers)).find(poll.match);
    if (match) {
      return match;
    }
    await page.waitForTimeout(250);
  }
  return null;
}

export async function createServiceFixture(page: Page, token: string, headers: Record<string, string>): Promise<ServiceRecord | null> {
  const response = await page.request.post('/api/builder/bookings/services?locale=ko', {
    headers,
    data: {
      name: { ko: `W197 배정 서비스 ${token}`, en: `W197 Assignment ${token}`, 'zh-hant': `W197 指派 ${token}` },
      description: { ko: `W197 배정 검증 ${token}`, en: '', 'zh-hant': '' },
      durationMinutes: 30,
      priceTwd: 0,
      category: `w197-${token}`,
      staffIds: [],
      isActive: true,
    },
  });
  if (!response.ok()) {
    return null;
  }
  const payload: unknown = await response.json();
  return servicePayload(payload);
}

async function fillField(page: Page, label: string, value: string): Promise<void> {
  await page.locator('label').filter({ hasText: label }).first().locator('input, textarea').first().fill(value);
}

export async function fillStaffForm(page: Page, values: StaffValues): Promise<void> {
  await fillField(page, '이름 (KO)', values.nameKo);
  await fillField(page, '이름 (EN)', values.nameEn);
  await fillField(page, '이름 (ZH)', values.nameZh);
  await fillField(page, '이메일', values.email);
  await fillField(page, '직책 (KO)', values.titleKo);
  await fillField(page, '직책 (EN)', values.titleEn);
  await fillField(page, '직책 (ZH)', values.titleZh);
  await fillField(page, '사진 URL', values.photo);
  await fillField(page, '소개 (KO)', values.bioKo);
  await fillField(page, '소개 (EN)', values.bioEn);
  await fillField(page, '소개 (ZH)', values.bioZh);
}

export async function goStaffPage(page: Page, baseUrl: string, token: string): Promise<void> {
  const url = new URL('/ko/admin-builder/bookings/staff', baseUrl);
  url.searchParams.set('w197', token);
  await page.goto(url.toString(), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: '새 담당자' }).waitFor({ state: 'visible', timeout: 15_000 });
}

export async function goServiceEditor(page: Page, baseUrl: string, token: string, serviceId: string): Promise<void> {
  const url = new URL('/ko/admin-builder/bookings/services', baseUrl);
  url.searchParams.set('w197', token);
  url.searchParams.set('edit', serviceId);
  await page.goto(url.toString(), { waitUntil: 'networkidle' });
  await page.locator(serviceEditorSelector).waitFor({ state: 'visible', timeout: 15_000 });
}

export async function saveStaffDialog(page: Page, title: string): Promise<void> {
  const heading = page.getByRole('heading', { name: title }).first();
  await page.getByRole('button', { name: '담당자 저장' }).click();
  await heading.waitFor({ state: 'hidden', timeout: 12_000 });
}

export async function saveServiceDialog(page: Page): Promise<void> {
  const editor = page.locator(serviceEditorSelector).first();
  await page.getByRole('button', { name: '서비스 저장' }).click();
  await editor.waitFor({ state: 'hidden', timeout: 12_000 });
}

export function staffCard(page: Page, token: string): Locator {
  return page.locator('article').filter({ hasText: token }).first();
}

export async function cleanupFiles(ids: CleanupIds): Promise<void> {
  const bookingsRoot = process.env.BUILDER_BOOKINGS_ROOT ?? path.join(process.cwd(), 'runtime-data', 'builder-bookings');
  if (ids.staffId) {
    await fs.rm(path.join(bookingsRoot, 'staff', `${ids.staffId}.json`), { force: true });
  }
  if (ids.serviceId) {
    await fs.rm(path.join(bookingsRoot, 'services', `${ids.serviceId}.json`), { force: true });
  }
}
