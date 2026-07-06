import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { APIResponse, Locator, Page } from '@playwright/test';

import type { CheckpointDefinition, CheckpointFinding } from '../types';

type LocalizedText = {
  readonly ko: string | undefined;
  readonly en: string | undefined;
  readonly 'zh-hant': string | undefined;
};

type ServiceRecord = {
  readonly serviceId: string;
  readonly name: LocalizedText;
  readonly description: LocalizedText;
  readonly durationMinutes: number | undefined;
  readonly priceTwd: number | undefined;
  readonly category: string | undefined;
  readonly isActive: boolean | undefined;
  readonly paymentMode: string | undefined;
  readonly priceAmount: number | undefined;
  readonly depositAmount: number | undefined;
  readonly priceCurrency: string | undefined;
  readonly bufferBeforeMinutes: number | undefined;
  readonly bufferAfterMinutes: number | undefined;
  readonly slotStepMinutes: number | undefined;
  readonly maxParticipants: number | undefined;
  readonly meetingMode: string | undefined;
};

type ServiceFormValues = {
  readonly nameKo: string;
  readonly nameEn: string;
  readonly nameZh: string;
  readonly descriptionKo: string;
  readonly descriptionEn: string;
  readonly descriptionZh: string;
  readonly durationMinutes: string;
  readonly priceTwd: string;
  readonly paymentMode: string;
  readonly priceAmount: string;
  readonly depositAmount: string;
  readonly priceCurrency: string;
  readonly meetingMode: string;
  readonly category: string;
  readonly bufferBeforeMinutes: string;
  readonly bufferAfterMinutes: string;
  readonly maxParticipants: string;
  readonly slotStepMinutes: string;
};

type ServicesPageTarget = {
  readonly baseUrl: string;
  readonly token: string;
  readonly editServiceId: string | null;
};

type ServicePollRequest = {
  readonly headers: Record<string, string>;
  readonly match: (service: ServiceRecord) => boolean;
};

type CleanupRequest = {
  readonly page: Page;
  readonly headers: Record<string, string>;
  readonly token: string;
  readonly serviceId: string | null;
};

const serviceEditorSelector = '[data-booking-service-editor="true"]';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function numberValue(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function booleanValue(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}

function parseLocalized(value: unknown): LocalizedText {
  const source = isRecord(value) ? value : {};
  return {
    ko: stringValue(source.ko),
    en: stringValue(source.en),
    'zh-hant': stringValue(source['zh-hant']),
  };
}

function parseService(value: unknown): ServiceRecord | null {
  if (!isRecord(value)) {
    return null;
  }
  const serviceId = stringValue(value.serviceId);
  if (!serviceId) {
    return null;
  }
  return {
    serviceId,
    name: parseLocalized(value.name),
    description: parseLocalized(value.description),
    durationMinutes: numberValue(value.durationMinutes),
    priceTwd: numberValue(value.priceTwd),
    category: stringValue(value.category),
    isActive: booleanValue(value.isActive),
    paymentMode: stringValue(value.paymentMode),
    priceAmount: numberValue(value.priceAmount),
    depositAmount: numberValue(value.depositAmount),
    priceCurrency: stringValue(value.priceCurrency),
    bufferBeforeMinutes: numberValue(value.bufferBeforeMinutes),
    bufferAfterMinutes: numberValue(value.bufferAfterMinutes),
    slotStepMinutes: numberValue(value.slotStepMinutes),
    maxParticipants: numberValue(value.maxParticipants),
    meetingMode: stringValue(value.meetingMode),
  };
}

function parseServicesPayload(payload: unknown): readonly ServiceRecord[] {
  if (!isRecord(payload) || !Array.isArray(payload.services)) {
    return [];
  }
  const services: ServiceRecord[] = [];
  for (const candidate of payload.services) {
    const service = parseService(candidate);
    if (service) {
      services.push(service);
    }
  }
  return services;
}

function bookingHeaders(scope: string): Record<string, string> {
  const username = process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin';
  const password = process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!';
  return {
    authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
    'x-forwarded-for': `qa-w196-${scope}`,
  };
}

async function readJson(response: APIResponse): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function fetchServices(page: Page, headers: Record<string, string>): Promise<readonly ServiceRecord[]> {
  const response = await page.request.get('/api/builder/bookings/services?includeInactive=1', { headers });
  if (!response.ok()) {
    return [];
  }
  return parseServicesPayload(await readJson(response));
}

async function waitForServiceSnapshot(page: Page, poll: ServicePollRequest): Promise<ServiceRecord | null> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const services = await fetchServices(page, poll.headers);
    const match = services.find(poll.match);
    if (match) {
      return match;
    }
    await page.waitForTimeout(250);
  }
  return null;
}

function createValues(token: string): ServiceFormValues {
  return {
    nameKo: `W196 상담 ${token}`,
    nameEn: `W196 Service ${token}`,
    nameZh: `W196 諮詢 ${token}`,
    descriptionKo: `생성 검증 ${token}`,
    descriptionEn: `Created verification ${token}`,
    descriptionZh: `建立驗證 ${token}`,
    durationMinutes: '45',
    priceTwd: '7000',
    paymentMode: 'paid',
    priceAmount: '7000',
    depositAmount: '2000',
    priceCurrency: 'TWD',
    meetingMode: 'zoom',
    category: `w196-${token}`,
    bufferBeforeMinutes: '5',
    bufferAfterMinutes: '10',
    maxParticipants: '3',
    slotStepMinutes: '20',
  };
}

function updateValues(token: string): ServiceFormValues {
  return {
    nameKo: `W196 상담 수정 ${token}`,
    nameEn: `W196 Service Edited ${token}`,
    nameZh: `W196 諮詢更新 ${token}`,
    descriptionKo: `수정 검증 ${token}`,
    descriptionEn: `Edited verification ${token}`,
    descriptionZh: `更新驗證 ${token}`,
    durationMinutes: '60',
    priceTwd: '9000',
    paymentMode: 'paid',
    priceAmount: '9000',
    depositAmount: '3000',
    priceCurrency: 'TWD',
    meetingMode: 'hybrid',
    category: `w196-edited-${token}`,
    bufferBeforeMinutes: '10',
    bufferAfterMinutes: '15',
    maxParticipants: '4',
    slotStepMinutes: '30',
  };
}

async function fillByLabel(page: Page, label: string, value: string): Promise<void> {
  await page.locator('label').filter({ hasText: label }).first().locator('input, textarea').first().fill(value);
}

async function selectByLabel(page: Page, label: string, value: string): Promise<void> {
  await page.locator('label').filter({ hasText: label }).first().locator('select').first().selectOption(value);
}

async function fillServiceForm(page: Page, values: ServiceFormValues): Promise<void> {
  await fillByLabel(page, '이름 KO', values.nameKo);
  await fillByLabel(page, '이름 EN', values.nameEn);
  await fillByLabel(page, '이름 ZH', values.nameZh);
  await fillByLabel(page, '소요 시간(분)', values.durationMinutes);
  await fillByLabel(page, '가격(TWD)', values.priceTwd);
  await selectByLabel(page, '결제 방식', values.paymentMode);
  await fillByLabel(page, '결제 금액', values.priceAmount);
  await fillByLabel(page, '지금 결제할 보증금', values.depositAmount);
  await selectByLabel(page, '결제 통화', values.priceCurrency);
  await selectByLabel(page, '상담 방식', values.meetingMode);
  await fillByLabel(page, '카테고리', values.category);
  await fillByLabel(page, '버퍼 시작 전', values.bufferBeforeMinutes);
  await fillByLabel(page, '버퍼 종료 후', values.bufferAfterMinutes);
  await fillByLabel(page, '정원', values.maxParticipants);
  await fillByLabel(page, '예약 간격', values.slotStepMinutes);
  await fillByLabel(page, '설명 KO', values.descriptionKo);
  await fillByLabel(page, '설명 EN', values.descriptionEn);
  await fillByLabel(page, '설명 ZH', values.descriptionZh);
}

async function goToServicesPage(page: Page, target: ServicesPageTarget): Promise<void> {
  const url = new URL('/ko/admin-builder/bookings/services', target.baseUrl);
  url.searchParams.set('w196', target.token);
  if (target.editServiceId) {
    url.searchParams.set('edit', target.editServiceId);
  }
  await page.goto(url.toString(), { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: '새 서비스' }).waitFor({ state: 'visible', timeout: 15_000 });
}

async function saveService(page: Page): Promise<boolean> {
  const editor = page.locator(serviceEditorSelector).first();
  await page.getByRole('button', { name: '서비스 저장' }).click();
  return editor.waitFor({ state: 'detached', timeout: 12_000 }).then(
    () => true,
    () => false,
  );
}

async function visibleServiceCard(page: Page, serviceId: string): Promise<Locator | null> {
  const pageSize = page.locator('[data-pagination-page-size]').first();
  if ((await pageSize.count()) > 0) {
    await pageSize.selectOption('100');
    await page.waitForTimeout(300);
  }
  const card = page.locator(`[data-booking-service-card="${serviceId}"]`).first();
  for (let attempt = 0; attempt < 10; attempt += 1) {
    if (await card.isVisible().catch(() => false)) {
      return card;
    }
    const next = page.locator('[data-pagination-next]').first();
    const nextVisible = await next.isVisible().catch(() => false);
    const nextDisabled = await next.isDisabled().catch(() => true);
    if (!nextVisible || nextDisabled) {
      return null;
    }
    await next.click();
    await page.waitForTimeout(300);
  }
  return null;
}

async function cleanupServiceFiles(serviceIds: readonly string[]): Promise<void> {
  const bookingsRoot = process.env.BUILDER_BOOKINGS_ROOT ?? path.join(process.cwd(), 'runtime-data', 'builder-bookings');
  const uniqueIds = new Set(serviceIds.filter((serviceId) => serviceId.length > 0));
  for (const serviceId of uniqueIds) {
    const servicePath = path.join(bookingsRoot, 'services', `${serviceId}.json`);
    await fs.rm(servicePath, { force: true }).catch(() => undefined);
  }
}

async function cleanupCreatedServices(request: CleanupRequest): Promise<void> {
  const services = await fetchServices(request.page, request.headers).catch(() => []);
  const matchingIds = services
    .filter((service) => service.serviceId === request.serviceId || service.name.ko?.includes(request.token) || service.category?.includes(request.token))
    .map((service) => service.serviceId);
  const allIds = request.serviceId ? [...matchingIds, request.serviceId] : matchingIds;
  await cleanupServiceFiles(allIds);
}

export const checkpoint: CheckpointDefinition = {
  id: 'W196',
  title: 'Services catalog CRUD',
  verification: 'Admin Bookings 서비스 화면에서 서비스 추가 → 편집 → 비활성화 후 API 저장값까지 확인',
  async run({ page, baseUrl, recordEvidence }) {
    const findings: CheckpointFinding[] = [];
    const token = Date.now().toString(36);
    const headers = bookingHeaders(token);
    let serviceId: string | null = null;

    try {
      await page.addInitScript(() => {
        window.localStorage.setItem('booking-services-page-size', '100');
      });
      await page.setExtraHTTPHeaders(headers);

      await goToServicesPage(page, { baseUrl, token, editServiceId: null });
      await page.getByRole('button', { name: '새 서비스' }).click();
      await page.locator(serviceEditorSelector).waitFor({ state: 'visible', timeout: 10_000 });
      await fillServiceForm(page, createValues(token));
      if (!(await saveService(page))) {
        findings.push({ severity: 'blocker', summary: '서비스 생성 저장 후 편집 모달이 닫히지 않았습니다.' });
        return { findings };
      }

      const created = await waitForServiceSnapshot(page, {
        headers,
        match: (service) => service.name.ko === `W196 상담 ${token}` && service.durationMinutes === 45 && service.priceTwd === 7000 && service.isActive === true,
      });
      if (!created) {
        findings.push({ severity: 'blocker', summary: '서비스 생성 후 API 저장값을 확인하지 못했습니다.' });
        return { findings };
      }
      serviceId = created.serviceId;
      await recordEvidence('W196 service created through admin UI and persisted via API', page);

      await goToServicesPage(page, { baseUrl, token, editServiceId: serviceId });
      await page.locator(serviceEditorSelector).waitFor({ state: 'visible', timeout: 10_000 });
      await fillServiceForm(page, updateValues(token));
      if (!(await saveService(page))) {
        findings.push({ severity: 'blocker', summary: '서비스 편집 저장 후 편집 모달이 닫히지 않았습니다.' });
        return { findings };
      }

      const updated = await waitForServiceSnapshot(page, {
        headers,
        match: (service) =>
          service.serviceId === serviceId &&
          service.name.ko === `W196 상담 수정 ${token}` &&
          service.description.ko === `수정 검증 ${token}` &&
          service.durationMinutes === 60 &&
          service.priceTwd === 9000 &&
          service.paymentMode === 'paid' &&
          service.priceAmount === 9000 &&
          service.depositAmount === 3000 &&
          service.priceCurrency === 'TWD' &&
          service.meetingMode === 'hybrid' &&
          service.category === `w196-edited-${token}` &&
          service.bufferBeforeMinutes === 10 &&
          service.bufferAfterMinutes === 15 &&
          service.slotStepMinutes === 30 &&
          service.maxParticipants === 4,
      });
      if (!updated) {
        findings.push({ severity: 'blocker', summary: '서비스 편집 후 API 저장값을 확인하지 못했습니다.' });
        return { findings };
      }
      await recordEvidence('W196 service edited through admin UI and persisted via API', page);

      await goToServicesPage(page, { baseUrl, token, editServiceId: null });
      const card = await visibleServiceCard(page, serviceId);
      if (!card) {
        findings.push({ severity: 'blocker', summary: '서비스 목록에서 생성한 서비스 카드를 찾지 못해 삭제 UI를 검증할 수 없습니다.' });
        return { findings };
      }
      await card.getByRole('button', { name: '비활성화' }).click();
      const inactive = await waitForServiceSnapshot(page, {
        headers,
        match: (service) => service.serviceId === serviceId && service.isActive === false,
      });
      if (!inactive) {
        findings.push({ severity: 'blocker', summary: '서비스 비활성화 후 API에서 isActive=false 상태를 확인하지 못했습니다.' });
        return { findings };
      }
      await recordEvidence('W196 service deactivated through admin UI and persisted via API', page);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      findings.push({ severity: 'blocker', summary: `서비스 CRUD 검증 중 예외가 발생했습니다: ${detail}` });
    } finally {
      await cleanupCreatedServices({ page, headers, token, serviceId });
    }

    return { findings };
  },
};
