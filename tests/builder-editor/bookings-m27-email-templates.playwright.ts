import { expect, test, type Page, type Response } from '@playwright/test';
import type { BookingEmailTemplate } from '@/lib/builder/bookings/types';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'bookings-m27-w215';
  const username = process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin';
  const password = process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!';
  return {
    'x-forwarded-for': `pw-${safeScope}`,
    authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
  };
}

const localeCopy = {
  ko: {
    path: '/ko/admin-builder/bookings/email-templates',
    heading: '예약 이메일 템플릿',
    listLabel: '예약 이메일 템플릿 목록',
    editorLabel: '예약 이메일 템플릿 편집기',
    activeButton: '고객 확인',
    subjectLabel: '제목',
    bodyLabel: '본문',
    placeholdersLabel: '사용 가능한 자리표시자',
    previewLabel: '실시간 미리보기',
    saveButton: '템플릿 저장',
    resetButton: '기본값으로 재설정',
    savedMessage: '이메일 템플릿을 저장했습니다.',
    subjectValuePrefix: 'W215 ',
    bodyValuePrefix: '안녕하세요 ',
    bodyServiceLabel: '서비스: ',
    bodyManageLabel: '관리 링크: ',
    previewSubjectPrefix: 'W215 ',
    previewBodyText: '서비스: 초기 상담 30분',
    previewManageUrl: 'booking/manage/demo-token',
    templateLabel: '고객 확인',
    templateDescription: '예약이 생성되거나 대기열에서 승격된 뒤 고객에게 전송됩니다.',
  },
  'zh-hant': {
    path: '/zh-hant/admin-builder/bookings/email-templates',
    heading: '預約電子郵件範本',
    listLabel: '預約電子郵件範本清單',
    editorLabel: '預約電子郵件範本編輯器',
    activeButton: '客戶確認',
    subjectLabel: '主旨',
    bodyLabel: '內文',
    placeholdersLabel: '可用的替代符號',
    previewLabel: '即時預覽',
    saveButton: '儲存範本',
    resetButton: '重設為預設值',
    savedMessage: '已儲存電子郵件範本。',
    subjectValuePrefix: 'W215 ',
    bodyValuePrefix: '您好，',
    bodyServiceLabel: '服務：',
    bodyManageLabel: '管理連結：',
    previewSubjectPrefix: 'W215 ',
    previewBodyText: '服務：初期諮詢 30 分鐘',
    previewManageUrl: 'booking/manage/demo-token',
    templateLabel: '客戶確認',
    templateDescription: '預約建立或從候補名單提升後寄給客戶。',
  },
} as const;

async function runLocale(page: Page, locale: keyof typeof localeCopy) {
  const copy = localeCopy[locale];
  const token = `${locale}-${Date.now().toString(36)}`;
  const headers = mutationHeaders(token);
  let original: BookingEmailTemplate | null = null;
  await page.setExtraHTTPHeaders(headers);

  try {
    const initial = await page.request.get('/api/builder/bookings/email-templates', { headers });
    expect(initial.status()).toBe(200);
    const initialPayload = (await initial.json()) as { templates: BookingEmailTemplate[] };
    original = initialPayload.templates.find((template) => template.type === 'customer-confirmation') ?? null;
    expect(original).toBeTruthy();

    await page.goto(copy.path, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: copy.heading })).toBeVisible();
    await expect(page.getByRole('button', { name: copy.activeButton })).toBeVisible();
    await expect(page.getByLabel(copy.subjectLabel)).toBeVisible();
    await expect(page.getByLabel(copy.bodyLabel)).toBeVisible();
    await expect(page.getByRole('button', { name: copy.saveButton })).toBeVisible();
    await expect(page.getByRole('button', { name: copy.resetButton })).toBeVisible();
    await expect(page.getByRole('region', { name: copy.previewLabel })).toBeVisible();
    await expect(page.getByLabel(copy.placeholdersLabel)).toBeVisible();

    await page.getByRole('button', { name: copy.activeButton }).click();
    await expect(page.getByRole('heading', { name: copy.templateLabel, exact: true })).toBeVisible();
    await expect(page.getByRole('region', { name: copy.editorLabel }).getByText(copy.templateDescription, { exact: true })).toBeVisible();

    await page.getByLabel(copy.subjectLabel).fill(`${copy.subjectValuePrefix}${token}`);
    await page.getByLabel(copy.subjectLabel).focus();
    await expect(page.getByLabel(copy.subjectLabel)).toBeFocused();
    await page.locator('[data-placeholder-token="customerName"]').click();
    await page.getByLabel(copy.bodyLabel).fill(`${copy.bodyValuePrefix}{{customerName}}\n${copy.bodyServiceLabel}{{serviceName}}\n${copy.bodyManageLabel}{{manageUrl}}`);
    await page.getByLabel(copy.bodyLabel).focus();
    await expect(page.getByLabel(copy.bodyLabel)).toBeFocused();
    await expect(page.getByRole('region', { name: copy.previewLabel })).toContainText(`${copy.previewSubjectPrefix}${token}`);
    await expect(page.getByRole('region', { name: copy.previewLabel })).toContainText(copy.previewBodyText);
    await expect(page.getByRole('region', { name: copy.previewLabel })).toContainText(copy.previewManageUrl);

    const saveResponse = page.waitForResponse((response: Response) =>
      response.url().includes('/api/builder/bookings/email-templates/customer-confirmation')
        && response.request().method() === 'PATCH',
      { timeout: 30_000 },
    );
    await page.getByRole('button', { name: copy.saveButton }).click();
    expect((await saveResponse).status()).toBe(200);
    await expect(page.getByText(copy.savedMessage)).toBeVisible();

    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: copy.activeButton }).click();
    await expect(page.getByLabel(copy.subjectLabel)).toHaveValue(new RegExp(`${token}.*\\{\\{customerName\\}\\}`));
  } finally {
    if (original) {
      await page.request.patch('/api/builder/bookings/email-templates/customer-confirmation', {
        headers,
        failOnStatusCode: false,
        data: {
          subject: original.subject,
          body: original.body,
          isActive: original.isActive,
        },
      });
    }
  }
}

test.describe('M27 booking email templates', () => {
  test.setTimeout(90_000);

  test('saves and previews localized booking email templates', async ({ page }) => {
    await runLocale(page, 'ko');
    await runLocale(page, 'zh-hant');
  });
});
