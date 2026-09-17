/**
 * Browser UI regressions for the eight-locale inquiry form.
 * page.route only pins deterministic UI states and the request payload;
 * it is not storage or SMTP proof.
 */
import { expect, test, type Locator, type Page } from '@playwright/test';
import { internationalInquiryCopy } from '@/data/international-inquiry-copy';
import {
  CONSULTATION_LANGUAGES,
  PUBLIC_INQUIRY_LOCALES,
} from '@/lib/consultation/intake-language-contract';
import {
  guidancePublicPath,
  isGuidanceLocale4,
  publicDocumentLanguage,
  type PublicLocale8,
} from '@/lib/public-guidance';

const DESKTOP = { width: 1440, height: 1000 } as const;
const MOBILE = { width: 390, height: 844 } as const;
const VIEWPORTS = [DESKTOP, MOBILE] as const;

const INTERNATIONAL_INQUIRY_API_PATH = '/api/consultation/international';

const RAW_ORIGINAL_TEXT = '  สวัสดีครับ\n  Xin chào, tôi cần tư vấn.  ';
const EDITED_ORIGINAL_TEXT = '  สวัสดีครับ\n  Xin chào, tôi cần tư vấn.\n  follow-up  ';
const PENDING_ORIGINAL_TEXT = '  สวัสดีครับ\n  Xin chào, tôi cần tư vấn.\n  pending-check  ';
const ORIGINAL_LANGUAGE_VALUE = 'ไทย / Tiếng Việt';
const QA_NAME = 'QA Visitor';
const QA_EMAIL = 'qa.inquiry@example.test';

const SENT_INTAKE_ID = '11111111-1111-4111-8111-111111111111';
const PENDING_INTAKE_ID = '22222222-2222-4222-8222-222222222222';

const PREFERRED_VALUES = [
  ...CONSULTATION_LANGUAGES,
  'needs-method-confirmation',
] as const;

type InquiryCopy = (typeof internationalInquiryCopy)[PublicLocale8];

type CapturedInquiryRequest = {
  path: string;
  payload: Record<string, unknown> | null;
};

type InquiryMock = {
  status: number;
  body: Record<string, unknown>;
};

function inquiryForm(page: Page, copy: InquiryCopy): Locator {
  return page.getByRole('form', { name: copy.heading });
}

function isInquiryPath(url: URL): boolean {
  return url.pathname === INTERNATIONAL_INQUIRY_API_PATH;
}

function payloadRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

async function documentOverflowPx(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

async function attachViewportScreenshot(page: Page, name: string): Promise<void> {
  await test.info().attach(name, {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png',
  });
}

async function installInquiryRoute(
  page: Page,
  mock: { current: InquiryMock },
  captured: CapturedInquiryRequest[],
): Promise<void> {
  await page.route(isInquiryPath, async (route) => {
    const request = route.request();
    if (request.method() !== 'POST') {
      await route.continue();
      return;
    }

    const path = new URL(request.url()).pathname;
    captured.push({
      path,
      payload: payloadRecord(request.postDataJSON()),
    });

    await route.fulfill({
      status: mock.current.status,
      contentType: 'application/json',
      body: JSON.stringify(mock.current.body),
    });
  });
}

async function fillInquiryFields(
  form: Locator,
  copy: InquiryCopy,
  originalText: string,
): Promise<void> {
  await form.locator('input[name="name"]').fill(QA_NAME);
  await form.locator('input[name="email"]').fill(QA_EMAIL);
  await form.locator('input[name="originalLanguage"]').fill(ORIGINAL_LANGUAGE_VALUE);
  await expect(
    form.getByLabel(copy.originalLanguageLabel, { exact: true }).locator('xpath=./following-sibling::p'),
  ).toHaveText(copy.preparationNotice);
  await form
    .locator('select[name="preferredConsultationLanguage"]')
    .selectOption('needs-method-confirmation');
  await expect(
    form
      .getByLabel(copy.preferredConsultationLanguageLabel, { exact: true })
      .locator('xpath=./following-sibling::p'),
  ).toHaveText(copy.methodConfirmationNotice);
  await form.locator('select[name="preferredConsultationLanguage"]').selectOption('en');
  await form.locator('textarea[name="originalText"]').fill(originalText);
  await form.locator('input[name="consent"]').check();
}

function assertInquiryPayload(
  captured: CapturedInquiryRequest,
  locale: PublicLocale8,
  originalText: string,
): void {
  expect(captured.path, 'inquiry API path').toBe(INTERNATIONAL_INQUIRY_API_PATH);
  expect(captured.payload).toBeTruthy();
  const payload = captured.payload ?? {};
  expect(payload.uiLocale).toBe(locale);
  expect(payload.name).toBe(QA_NAME);
  expect(payload.email).toBe(QA_EMAIL);
  expect(payload.originalLanguage).toBe(ORIGINAL_LANGUAGE_VALUE);
  expect(payload.preferredConsultationLanguage).toBe('en');
  expect(payload.originalText, 'raw originalText including whitespace').toBe(originalText);
  expect(payload.consent).toBe(true);
  expect(typeof payload.requestId).toBe('string');
  expect(String(payload.requestId)).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  );
}

async function clickSubmit(form: Locator, copy: InquiryCopy): Promise<void> {
  const submit = form.getByRole('button', { name: copy.submitLabel, exact: true });
  await expect(submit).toBeEnabled();
  await submit.click();
}

async function assertNoticesBeforeSubmit(form: Locator, copy: InquiryCopy): Promise<void> {
  const notices = form.locator('aside');
  await expect(notices).toBeVisible();
  await expect(notices).toContainText(copy.guidanceNotice);
  await expect(notices).toContainText(copy.consultationNotice);
  await expect(notices).toContainText(copy.methodConfirmationNotice);
  await expect(notices).toContainText(copy.preparationNotice);
  const submit = form.getByRole('button', { name: copy.submitLabel, exact: true });
  await expect(submit).toBeVisible();
  const noticeBox = await notices.boundingBox();
  const submitBox = await submit.boundingBox();
  expect(noticeBox, 'notice geometry').toBeTruthy();
  expect(submitBox, 'submit geometry').toBeTruthy();
  expect((noticeBox?.y ?? 0) + (noticeBox?.height ?? 0)).toBeLessThanOrEqual(
    (submitBox?.y ?? 0) + 1,
  );
}

async function assertDistinctLanguageFields(
  form: Locator,
  locale: PublicLocale8,
  copy: InquiryCopy,
): Promise<void> {
  await expect(form).toHaveAttribute('lang', locale);
  await expect(form.locator('input[name="name"]')).toBeVisible();
  await expect(form.locator('input[name="email"]')).toBeVisible();
  await expect(form.locator('input[name="originalLanguage"]')).toBeVisible();
  await expect(form.locator('select[name="preferredConsultationLanguage"]')).toBeVisible();
  await expect(form.locator('textarea[name="originalText"]')).toBeVisible();
  await expect(form.locator('[name="uiLocale"]')).toHaveCount(0);
  await expect(form.locator('input[name="originalLanguage"]')).toHaveAttribute(
    'placeholder',
    copy.originalLanguagePlaceholder,
  );
  await expect(form.locator('textarea[name="originalText"]')).toHaveAttribute(
    'placeholder',
    copy.originalTextPlaceholder,
  );

  const select = form.locator('select[name="preferredConsultationLanguage"]');
  const values = await select.locator('option').evaluateAll((options) =>
    options
      .map((option) => (option as HTMLOptionElement).value)
      .filter((value) => value.length > 0),
  );
  expect(values).toEqual([...PREFERRED_VALUES]);
  expect(values).toHaveLength(5);
  expect(CONSULTATION_LANGUAGES).toEqual(['en', 'zh-hant', 'ja', 'ko']);

  for (const language of CONSULTATION_LANGUAGES) {
    await expect(
      select.locator(`option[value="${language}"]`),
    ).toHaveText(copy.languageOptions[language]);
  }
  await expect(
    select.locator('option[value="needs-method-confirmation"]'),
  ).toHaveText(copy.languageOptions['needs-method-confirmation']);
}

test.describe('international inquiry public form', () => {
  for (const locale of PUBLIC_INQUIRY_LOCALES) {
    for (const viewport of VIEWPORTS) {
      test(`${locale} @${viewport.width} notices, four consult languages, validation, retry id, raw text, sent vs pending receipt`, async ({
        page,
      }) => {
        const copy = internationalInquiryCopy[locale];
        const captured: CapturedInquiryRequest[] = [];
        const mock: { current: InquiryMock } = {
          current: {
            status: 500,
            body: { success: false, error: 'network-failure' },
          },
        };

        await page.setViewportSize(viewport);
        await installInquiryRoute(page, mock, captured);

        const response = await page.goto(guidancePublicPath(locale, 'contact'), {
          waitUntil: 'domcontentloaded',
        });
        expect(response?.ok(), `/${locale}/contact`).toBeTruthy();
        await expect(page.locator('html')).toHaveAttribute(
          'lang',
          publicDocumentLanguage(locale),
        );

        const form = inquiryForm(page, copy);
        await expect(form).toBeVisible();
        if (isGuidanceLocale4(locale)) {
          await expect(page.locator('[data-guidance-shell="true"]')).toBeVisible();
        }

        await assertNoticesBeforeSubmit(form, copy);
        await assertDistinctLanguageFields(form, locale, copy);
        await expect.poll(() => documentOverflowPx(page)).toBeLessThanOrEqual(1);
        await attachViewportScreenshot(page, `inquiry-${locale}-${viewport.width}`);

        await clickSubmit(form, copy);
        await expect(form.locator('input[name="name"]')).toHaveAttribute('aria-invalid', 'true');
        await expect(form.locator('input[name="email"]')).toHaveAttribute('aria-invalid', 'true');
        await expect(form.locator('input[name="originalLanguage"]')).toHaveAttribute('aria-invalid', 'true');
        await expect(form.locator('select[name="preferredConsultationLanguage"]')).toHaveAttribute(
          'aria-invalid',
          'true',
        );
        await expect(form.locator('textarea[name="originalText"]')).toHaveAttribute('aria-invalid', 'true');
        await expect(form.locator('input[name="consent"]')).toHaveAttribute('aria-invalid', 'true');
        await expect(form.getByText(copy.requiredMessage)).toHaveCount(6);
        expect(captured).toHaveLength(0);

        await fillInquiryFields(form, copy, RAW_ORIGINAL_TEXT);
        await clickSubmit(form, copy);
        await expect(form.getByRole('alert')).toContainText(copy.failureMessage);
        expect(captured).toHaveLength(1);
        assertInquiryPayload(captured[0], locale, RAW_ORIGINAL_TEXT);
        const firstRequestId = String(captured[0]?.payload?.requestId);

        await clickSubmit(form, copy);
        await expect(form.getByRole('alert')).toContainText(copy.failureMessage);
        expect(captured).toHaveLength(2);
        assertInquiryPayload(captured[1], locale, RAW_ORIGINAL_TEXT);
        expect(captured[1]?.payload?.requestId, 'retry keeps requestId').toBe(firstRequestId);

        await form.locator('textarea[name="originalText"]').fill(EDITED_ORIGINAL_TEXT);
        await clickSubmit(form, copy);
        await expect(form.getByRole('alert')).toContainText(copy.failureMessage);
        expect(captured).toHaveLength(3);
        assertInquiryPayload(captured[2], locale, EDITED_ORIGINAL_TEXT);
        const editedRequestId = String(captured[2]?.payload?.requestId);
        expect(editedRequestId, 'edited payload issues a new requestId').not.toBe(firstRequestId);

        mock.current = {
          status: 201,
          body: {
            success: true,
            intakeId: SENT_INTAKE_ID,
            notification: 'sent',
          },
        };
        await clickSubmit(form, copy);
        const sentStatus = form.getByRole('status');
        await expect(sentStatus).toContainText(copy.successMessage);
        await expect(sentStatus).toContainText(copy.receiptIdLabel);
        await expect(sentStatus.locator('code')).toHaveText(SENT_INTAKE_ID);
        expect(captured).toHaveLength(4);
        assertInquiryPayload(captured[3], locale, EDITED_ORIGINAL_TEXT);
        expect(captured[3]?.payload?.requestId).toBe(editedRequestId);

        mock.current = {
          status: 202,
          body: {
            success: true,
            intakeId: PENDING_INTAKE_ID,
            notification: 'pending',
          },
        };
        await form.locator('textarea[name="originalText"]').fill(PENDING_ORIGINAL_TEXT);
        await clickSubmit(form, copy);
        const pendingStatus = form.getByRole('status');
        await expect(pendingStatus).toContainText(copy.savedNotificationPendingMessage);
        await expect(pendingStatus).toContainText(copy.receiptIdLabel);
        await expect(pendingStatus.locator('code')).toHaveText(PENDING_INTAKE_ID);
        expect(captured).toHaveLength(5);
        assertInquiryPayload(captured[4], locale, PENDING_ORIGINAL_TEXT);
        expect(captured[4]?.payload?.requestId).not.toBe(editedRequestId);
        expect(captured[4]?.payload?.requestId).not.toBe(firstRequestId);

        await expect(pendingStatus).toContainText(copy.savedNotificationPendingMessage);
        await expect(pendingStatus).not.toContainText(copy.successMessage);
        await expect(pendingStatus).not.toContainText(copy.failureMessage);
      });
    }
  }
});
