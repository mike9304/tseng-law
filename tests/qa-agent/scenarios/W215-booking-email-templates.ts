import { expect, type APIResponse, type Page } from '@playwright/test';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import type { BookingEmailTemplate, BookingEmailTemplateType } from '@/lib/builder/bookings/types';
import type { CheckpointDefinition, CheckpointFinding } from '../types';
import { bookingHeaders } from './W200-booking-widget-helpers';

type StoredTemplateSnapshot = {
  readonly existed: boolean;
  readonly raw: string | null;
};

type TemplateCase = {
  readonly type: BookingEmailTemplateType;
  readonly label: string;
};

const templateCases: readonly TemplateCase[] = [
  { type: 'customer-confirmation', label: '고객 확인' },
  { type: 'admin-notification', label: '관리자 알림' },
  { type: 'customer-reminder', label: '고객 리마인더' },
  { type: 'customer-cancellation', label: '고객 취소' },
];

function blocker(summary: string, detail?: string): CheckpointFinding {
  return detail ? { severity: 'blocker', summary, detail } : { severity: 'blocker', summary };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isBookingEmailTemplate(value: unknown): value is BookingEmailTemplate {
  return isRecord(value) &&
    typeof value.templateId === 'string' &&
    typeof value.type === 'string' &&
    typeof value.subject === 'string' &&
    typeof value.body === 'string' &&
    typeof value.isActive === 'boolean' &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string';
}

async function readJson(response: APIResponse): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      return null;
    }
    throw error;
  }
}

function parseTemplates(payload: unknown): BookingEmailTemplate[] {
  if (!isRecord(payload) || !Array.isArray(payload.templates)) {
    return [];
  }
  return payload.templates.filter(isBookingEmailTemplate);
}

async function fetchTemplates(page: Page, headers: Record<string, string>): Promise<BookingEmailTemplate[]> {
  const response = await page.request.get('/api/builder/bookings/email-templates', { headers });
  expect(response.status()).toBe(200);
  return parseTemplates(await readJson(response));
}

function bookingsRoot(): string {
  return process.env.BUILDER_BOOKINGS_ROOT ?? path.join(process.cwd(), 'runtime-data', 'builder-bookings');
}

function templateFilePath(type: BookingEmailTemplateType): string {
  return path.join(bookingsRoot(), 'email-templates', `${type}.json`);
}

async function snapshotStoredTemplate(type: BookingEmailTemplateType): Promise<StoredTemplateSnapshot> {
  try {
    return { existed: true, raw: await fs.readFile(templateFilePath(type), 'utf8') };
  } catch (error) {
    if (isRecord(error) && error.code === 'ENOENT') {
      return { existed: false, raw: null };
    }
    throw error;
  }
}

async function restoreStoredTemplate(type: BookingEmailTemplateType, snapshot: StoredTemplateSnapshot): Promise<void> {
  const target = templateFilePath(type);
  if (!snapshot.existed || snapshot.raw === null) {
    await fs.rm(target, { force: true });
    return;
  }
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, snapshot.raw, 'utf8');
}

export const checkpoint: CheckpointDefinition = {
  id: 'W215',
  title: 'Booking email template customization',
  verification: 'Bookings admin email-template UI에서 subject/body 편집, placeholder 삽입, live preview, 저장, reload persistence를 검증',
  async run({ page, baseUrl, recordEvidence }) {
    const findings: CheckpointFinding[] = [];
    const token = Date.now().toString(36);
    const headers = bookingHeaders(`w215-${token}`);
    const snapshots = new Map<BookingEmailTemplateType, StoredTemplateSnapshot>();

    try {
      for (const item of templateCases) {
        snapshots.set(item.type, await snapshotStoredTemplate(item.type));
      }
      const initialTemplates = await fetchTemplates(page, headers);
      if (!templateCases.every((item) => initialTemplates.some((template) => template.type === item.type))) {
        findings.push(blocker('W215 네 가지 기본 booking email template을 API에서 모두 찾지 못했습니다.'));
        return { findings };
      }

      await page.goto(new URL(`/ko/admin-builder/bookings/email-templates?w215=${token}`, baseUrl).toString(), {
        waitUntil: 'domcontentloaded',
      });
      await expect(page.getByRole('heading', { name: '예약 이메일 템플릿' })).toBeVisible({ timeout: 15_000 });
      await expect(page.locator('[aria-label="예약 이메일 템플릿 목록"]')).toBeVisible();
      await expect(page.getByRole('region', { name: '예약 이메일 템플릿 편집기' })).toBeVisible();
      for (const item of templateCases) {
        await expect(page.getByRole('button', { name: item.label })).toBeVisible();
      }

      for (const item of templateCases) {
        await page.getByRole('button', { name: item.label }).click();
        const subject = page.getByLabel('제목');
        const body = page.getByLabel('본문');
        const preview = page.getByRole('region', { name: '실시간 미리보기' });
        await subject.fill(`W215 ${token} ${item.type} {{serviceName}} `);
        await expect(subject).toBeFocused();
        await page.locator('[data-placeholder-token="customerName"]').click();
        await body.fill(`W215 ${item.type}\n고객: {{customerName}}\n서비스: {{serviceName}}\n관리 링크: {{manageUrl}}\n회의: `);
        await body.click();
        await expect(body).toBeFocused();
        await page.locator('[data-placeholder-token="meetingLink"]').click();
        await expect(body).toHaveValue(/{{meetingLink}}/);

        await expect(preview).toContainText(`W215 ${token}`);
        await expect(preview).toContainText('초기 상담 30분');
        await expect(preview).toContainText('김민수');
        await expect(preview).toContainText('booking/manage/demo-token');
        await expect(preview).toContainText('https://meet.example.com/consultation');
        if (item.type === 'customer-confirmation') {
          await recordEvidence('W215 editor inserts placeholders and renders live preview', page);
        }

        await page.setExtraHTTPHeaders(headers);
        const saveResponse = page.waitForResponse((response) =>
          response.url().includes(`/api/builder/bookings/email-templates/${item.type}`) &&
          response.request().method() === 'PATCH',
        );
        await page.getByRole('button', { name: '템플릿 저장' }).click();
        expect((await saveResponse).status()).toBe(200);
        await page.setExtraHTTPHeaders({});
        await expect(page.getByText('이메일 템플릿을 저장했습니다.')).toBeVisible();
      }

      await page.reload({ waitUntil: 'domcontentloaded' });
      for (const item of templateCases) {
        await page.getByRole('button', { name: item.label }).click();
        await expect(page.getByLabel('제목')).toHaveValue(new RegExp(`W215 ${token} ${item.type}.*\\{\\{customerName\\}\\}`));
        await expect(page.getByLabel('본문')).toHaveValue(new RegExp(`W215 ${item.type}[\\s\\S]*\\{\\{meetingLink\\}\\}`));
      }

      const savedTemplates = await fetchTemplates(page, headers);
      for (const item of templateCases) {
        const saved = savedTemplates.find((template) => template.type === item.type);
        if (!saved || !saved.subject.includes(token) || !saved.subject.includes('{{customerName}}') || !saved.body.includes('{{meetingLink}}')) {
          findings.push(blocker(`W215 ${item.type} 저장 API 값이 UI 편집 내용과 일치하지 않습니다.`));
          return { findings };
        }
      }
      await recordEvidence('W215 saved booking email template persists after reload', page);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      findings.push(blocker('W215 booking email template 검증 중 예외가 발생했습니다.', detail));
    } finally {
      await page.setExtraHTTPHeaders({});
      for (const item of templateCases) {
        const snapshot = snapshots.get(item.type);
        if (snapshot) {
          await restoreStoredTemplate(item.type, snapshot);
        }
      }
    }

    return { findings };
  },
};
