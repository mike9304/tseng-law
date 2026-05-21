import { expect, test } from '@playwright/test';

const LOCALE = 'ko';
const authHeader = `Basic ${Buffer.from(
  `${process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin'}:${process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!'}`,
).toString('base64')}`;

const defaultSettings = {
  orders: {
    invoiceOnCreate: { enabled: false, email: false },
    receiptOnPaid: { enabled: false, email: false },
  },
  bookings: {
    invoiceOnCreate: { enabled: false, email: false },
    receiptOnPaid: { enabled: false, email: false },
  },
  manualPayments: {
    orders: {
      bank_transfer: { enabled: false, title: 'Bank transfer', instructions: '' },
      cash: { enabled: false, title: 'Cash', instructions: '' },
      check: { enabled: false, title: 'Check', instructions: '' },
      other: { enabled: false, title: 'Other', instructions: '' },
    },
    bookings: {
      bank_transfer: { enabled: false, title: 'Bank transfer', instructions: '' },
      cash: { enabled: false, title: 'Cash', instructions: '' },
      check: { enabled: false, title: 'Check', instructions: '' },
      other: { enabled: false, title: 'Other', instructions: '' },
    },
  },
};

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'billing-documents';
  return {
    Authorization: authHeader,
    'x-forwarded-for': `pw-${safeScope}`,
  };
}

function todayPlus(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function nextWeekday(): string {
  for (let offset = 1; offset <= 7; offset += 1) {
    const date = new Date(todayPlus(offset));
    const day = date.getDay();
    if (day >= 1 && day <= 5) return date.toISOString().slice(0, 10);
  }
  return todayPlus(1);
}

test('/ko/admin-builder/commerce/documents manages automatic billing policy', async ({ page, request }) => {
  await request.patch('/api/builder/billing-documents/settings', {
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
      'x-forwarded-for': `pw-billing-reset-${Date.now()}`,
    },
    data: { settings: defaultSettings },
  });

  await page.setExtraHTTPHeaders({ Authorization: authHeader });
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`/${LOCALE}/admin-builder/commerce/documents`, { waitUntil: 'domcontentloaded' });

  await expect(page.locator('[data-billing-auto-policy]')).toBeVisible();
  await expect(page.locator('[data-billing-auto-policy-group="orders"]')).toBeVisible();
  await expect(page.locator('[data-billing-auto-policy-group="bookings"]')).toBeVisible();
  await expect(page.locator('[data-billing-manual-instructions]')).toBeVisible();
  const targetEnabled = !(await page.locator('[data-billing-auto-order-invoice]').isChecked());
  for (const selector of [
    '[data-billing-auto-order-invoice]',
    '[data-billing-auto-order-receipt]',
    '[data-billing-auto-booking-invoice]',
    '[data-billing-auto-booking-receipt]',
  ]) {
    await page.locator(selector).setChecked(targetEnabled);
  }
  await page.locator('[data-billing-manual-instruction-enabled="orders-bank_transfer"]').setChecked(true);
  await page.locator('[data-billing-manual-instruction-title="orders-bank_transfer"]').fill('Wire transfer');
  await page.locator('[data-billing-manual-instruction-body="orders-bank_transfer"]').fill('Bank: Test Trust\nMemo: invoice number');
  await expect(page.locator('[data-billing-auto-policy-save]')).toBeEnabled();
  await page.locator('[data-billing-auto-policy-save]').click();
  await expect(page.locator('[data-billing-auto-policy-notice]')).toContainText('saved');

  const settingsResponse = await request.get('/api/builder/billing-documents/settings', {
    headers: { Authorization: authHeader },
  });
  expect(settingsResponse.ok()).toBe(true);
  const payload = await settingsResponse.json();
  expect(payload.settings.orders.invoiceOnCreate.enabled).toBe(targetEnabled);
  expect(payload.settings.bookings.receiptOnPaid.enabled).toBe(targetEnabled);
  expect(payload.settings.manualPayments.orders.bank_transfer).toMatchObject({
    enabled: true,
    title: 'Wire transfer',
    instructions: 'Bank: Test Trust\nMemo: invoice number',
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);

  await request.patch('/api/builder/billing-documents/settings', {
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
      'x-forwarded-for': `pw-billing-reset-done-${Date.now()}`,
    },
    data: { settings: defaultSettings },
  });
});

test('/ko/admin-builder/commerce/documents creates booking invoice payment links and records manual payments', async ({ page, request }) => {
  const token = Date.now().toString(36);
  const headers = mutationHeaders(`billing-booking-pay-${token}`);
  let staffId: string | null = null;
  let serviceId: string | null = null;
  let bookingId: string | null = null;

  await page.setExtraHTTPHeaders(headers);

  try {
    await request.patch('/api/builder/billing-documents/settings', {
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      data: {
        settings: {
          ...defaultSettings,
          manualPayments: {
            ...defaultSettings.manualPayments,
            bookings: {
              ...defaultSettings.manualPayments.bookings,
              bank_transfer: {
                enabled: true,
                title: 'Booking wire',
                instructions: `Booking account ${token}\nUse invoice number as memo.`,
              },
            },
          },
        },
      },
    });

    const staffResponse = await request.post('/api/builder/bookings/staff', {
      headers,
      data: {
        name: { ko: `문서 변호사 ${token}`, 'zh-hant': `文件律師 ${token}`, en: `Document Attorney ${token}` },
        title: { ko: '결제 링크 검증', 'zh-hant': '付款連結測試', en: 'Payment link test' },
        bio: { ko: '예약 인보이스 결제 링크 검증', 'zh-hant': '預約發票付款連結測試', en: 'Booking invoice pay link test' },
        email: '',
        photo: '',
        isActive: true,
      },
    });
    expect(staffResponse.status()).toBe(201);
    staffId = ((await staffResponse.json()) as { staff: { staffId: string } }).staff.staffId;

    const serviceResponse = await request.post('/api/builder/bookings/services', {
      headers,
      data: {
        name: { ko: `문서 상담 ${token}`, 'zh-hant': `文件諮詢 ${token}`, en: `Document Consultation ${token}` },
        description: { ko: '중앙 문서 결제 링크 검증', 'zh-hant': '中央文件付款連結測試', en: 'Central document payment link check' },
        durationMinutes: 30,
        priceTwd: 8800,
        image: '',
        category: 'consultation',
        staffIds: [staffId],
        bufferBeforeMinutes: 0,
        bufferAfterMinutes: 0,
        slotStepMinutes: 30,
        isActive: true,
        paymentMode: 'paid',
        priceAmount: 8800,
        priceCurrency: 'TWD',
        meetingMode: 'zoom',
        cancellationPolicyId: 'standard-24h',
      },
    });
    expect(serviceResponse.status()).toBe(201);
    serviceId = ((await serviceResponse.json()) as { service: { serviceId: string } }).service.serviceId;

    const bookingDate = nextWeekday();
    const slotResponse = await request.get(`/api/booking/availability?serviceId=${serviceId}&staffId=${staffId}&date=${bookingDate}`, {
      headers,
      timeout: 45_000,
    });
    expect(slotResponse.status()).toBe(200);
    const slots = ((await slotResponse.json()) as { slots: Array<{ startAt: string }> }).slots;
    expect(slots.length).toBeGreaterThan(0);

    const bookingResponse = await request.post('/api/builder/bookings/admin-create', {
      headers,
      timeout: 45_000,
      data: {
        serviceId,
        staffId,
        startAt: slots[0].startAt,
        status: 'pending',
        paymentIntentId: `pi_billing_booking_${token}`,
        customerTimezone: 'Asia/Seoul',
        customer: {
          name: `문서 고객 ${token}`,
          email: `billing-booking-${token}@example.com`,
          phone: '+82105550123',
          notes: 'central billing payment-link smoke',
          caseSummary: '예약 인보이스 결제 링크를 중앙 문서 화면에서 만든다.',
          locale: 'ko',
        },
      },
    });
    expect(bookingResponse.status()).toBe(201);
    bookingId = ((await bookingResponse.json()) as { booking: { bookingId: string } }).booking.bookingId;

    const invoiceResponse = await request.post(`/api/builder/bookings/${bookingId}/documents`, {
      headers,
      data: { type: 'invoice' },
    });
    expect(invoiceResponse.status()).toBe(200);
    const invoice = ((await invoiceResponse.json()) as { document: { documentId: string; number: string; type: string } }).document;
    expect(invoice.type).toBe('invoice');

    await page.goto(`/${LOCALE}/admin-builder/commerce/documents`, { waitUntil: 'domcontentloaded' });
    await page.locator('[data-billing-documents-search]').fill(token);
    await page.locator('[data-billing-documents-source]').selectOption('booking');

    const rowKey = `booking:${invoice.documentId}`;
    const row = page.locator(`[data-billing-document-row="${rowKey}"]`);
    await expect(row).toBeVisible();
    await expect(row).toHaveAttribute('data-billing-document-currency-code', 'TWD');
    await expect(page.locator(`[data-billing-document-currency="${rowKey}"]`)).toContainText('TWD');
    await expect(page.locator(`[data-billing-document-payment-link-status="${rowKey}"]`)).toContainText('No pay link');

    const createResponse = page.waitForResponse((response) =>
      response.url().includes(`/api/builder/billing-documents/booking/${bookingId}/${invoice.documentId}/payment-link`)
      && response.request().method() === 'POST',
      { timeout: 45_000 },
    );
    await page.locator(`[data-billing-document-create-payment="${rowKey}"]`).click();
    const createPayload = (await (await createResponse).json()) as {
      document: {
        paymentLinkId: string;
        paymentLinkPath: string;
        paymentLinkStatus: string;
        paymentLinkEvents: Array<{ type: string }>;
      };
    };
    expect(createPayload.document.paymentLinkStatus).toBe('active');
    expect(createPayload.document.paymentLinkPath).toContain('/api/billing-documents/booking/');
    expect(createPayload.document.paymentLinkEvents).toEqual([expect.objectContaining({ type: 'created' })]);
    await expect(page.locator(`[data-billing-document-payment-link-status="${rowKey}"]`)).toContainText('Pay link active');
    await page.locator(`[data-billing-document-activity-toggle="${rowKey}"]`).click();
    await expect(page.locator(`[data-billing-document-payment-link-history="${rowKey}"]`)).toContainText('Pay link created');
    await expect(page.locator(`[data-billing-document-payment="${rowKey}"]`)).toBeVisible();

    const webhookEventId = `evt_billing_ui_${token}`;
    const webhookResponse = await request.post('/api/billing-documents/stripe-webhook', {
      data: {
        id: webhookEventId,
        type: 'payment_intent.requires_action',
        data: {
          object: {
            id: `pi_billing_ui_${token}`,
            amount: 8800,
            currency: 'twd',
            metadata: {
              billing_source: 'booking',
              billing_owner_id: bookingId,
              billing_document_id: invoice.documentId,
              billing_payment_link_id: createPayload.document.paymentLinkId,
              billing_document_number: invoice.number,
            },
          },
        },
      },
    });
    expect(webhookResponse.status()).toBe(200);
    const webhookPayload = await webhookResponse.json() as {
      ok: boolean;
      handled: boolean;
      event: { providerEventId: string; status: string };
    };
    expect(webhookPayload).toMatchObject({
      ok: true,
      handled: true,
      event: {
        providerEventId: webhookEventId,
        status: 'ignored',
      },
    });

    const unmatchedWebhookEventId = `evt_billing_orphan_${token}`;
    const unmatchedWebhookResponse = await request.post('/api/billing-documents/stripe-webhook', {
      data: {
        id: unmatchedWebhookEventId,
        type: 'checkout.session.async_payment_failed',
        data: {
          object: {
            id: `cs_billing_orphan_${token}`,
            amount_total: 8800,
            currency: 'twd',
            payment_intent: `pi_billing_orphan_${token}`,
            metadata: {
              billing_source: 'booking',
              billing_owner_id: `missing-booking-${token}`,
              billing_document_id: `missing-doc-${token}`,
              billing_payment_link_id: `missing-pay-${token}`,
              billing_document_number: `INV-MISSING-${token}`,
            },
          },
        },
      },
    });
    expect(unmatchedWebhookResponse.status()).toBe(200);
    await expect(unmatchedWebhookResponse.json()).resolves.toMatchObject({
      ok: true,
      handled: true,
      event: {
        providerEventId: unmatchedWebhookEventId,
        status: 'ignored',
      },
    });

    const refreshWebhooks = page.waitForResponse((response) =>
      response.url().includes('/api/builder/billing-documents/webhooks')
      && response.request().method() === 'GET',
      { timeout: 45_000 },
    );
    await page.locator('[data-billing-documents-refresh]').click();
    await refreshWebhooks;
    await expect(page.locator(`[data-billing-document-webhook-status="${rowKey}"]`)).toContainText('Webhook ignored');
    await expect(page.locator(`[data-billing-document-webhook-history="${rowKey}"]`)).toContainText(webhookEventId.slice(0, 10));
    await expect(page.locator(`[data-billing-document-webhook-history="${rowKey}"]`)).toContainText('payment_intent.requires_action');
    await expect(page.locator(`[data-billing-document-webhook-history="${rowKey}"] [data-billing-document-webhook-replay]`).first()).toBeVisible();
    await expect(page.locator('[data-billing-document-webhook-exceptions]')).toContainText('Billing webhook exceptions');
    await expect(page.locator('[data-billing-document-webhook-exceptions]')).toContainText(unmatchedWebhookEventId.slice(0, 10));
    await expect(page.locator('[data-billing-document-webhook-exceptions]')).toContainText(`missing-doc-${token}`);
    await expect(page.locator('[data-billing-document-webhook-exceptions] [data-billing-document-webhook-exception-replay]').first()).toBeVisible();

    const publicPayResponse = await request.get(createPayload.document.paymentLinkPath);
    expect(publicPayResponse.status()).toBe(200);
    const publicPayHtml = await publicPayResponse.text();
    expect(publicPayHtml).toContain('Pay invoice');
    expect(publicPayHtml).toContain('Manual payment instructions');
    expect(publicPayHtml).toContain(`Booking account ${token}`);
    expect(publicPayHtml).toContain('data-public-billing-document-currency');
    expect(publicPayHtml).toContain('No currency conversion is applied');

    const invalidPayPath = createPayload.document.paymentLinkPath.replace(/token=[^&]+/, 'token=invalid-payment-token');
    const invalidPayResponse = await request.get(invalidPayPath);
    expect(invalidPayResponse.status()).toBe(403);
    const invalidPayHtml = await invalidPayResponse.text();
    expect(invalidPayHtml).toContain('data-public-billing-payment-unavailable');
    expect(invalidPayHtml).not.toContain(`billing-booking-${token}@example.com`);
    expect(invalidPayHtml).not.toContain(`Booking account ${token}`);

    await page.locator(`[data-billing-document-manual-payment-toggle="${rowKey}"]`).click();
    const manualForm = page.locator(`[data-billing-document-manual-payment-form="${rowKey}"]`);
    await expect(manualForm).toBeVisible();
    await expect(page.locator(`[data-billing-document-manual-payment-helper="${rowKey}"]`)).toContainText('Only succeeded');
    await expect(page.locator(`[data-billing-document-manual-payment-currency="${rowKey}"]`)).toContainText('TWD');
    await page.locator(`[data-billing-document-manual-payment-status="${rowKey}"]`).selectOption('failed');
    await page.locator(`[data-billing-document-manual-payment-amount="${rowKey}"]`).fill('10.00');
    await page.locator(`[data-billing-document-manual-payment-method="${rowKey}"]`).selectOption('bank_transfer');
    await page.locator(`[data-billing-document-manual-payment-reference="${rowKey}"]`).fill(`WIRE-FAILED-${token}`);
    await page.locator(`[data-billing-document-manual-payment-note="${rowKey}"]`).fill('central billing failed payment attempt');

    const failedManualResponse = page.waitForResponse((response) =>
      response.url().includes(`/api/builder/billing-documents/booking/${bookingId}/${invoice.documentId}/manual-payments`)
      && response.request().method() === 'POST',
      { timeout: 45_000 },
    );
    await page.locator(`[data-billing-document-manual-payment-submit="${rowKey}"]`).click();
    const failedManualPayload = (await (await failedManualResponse).json()) as {
      document: { balanceDue: number; paymentStatus: string; paymentLinkStatus: string; paymentLinkPath: string };
      manualPayment: { status: string };
    };
    expect(failedManualPayload.manualPayment.status).toBe('failed');
    expect(failedManualPayload.document.balanceDue).toBe(8800);
    expect(failedManualPayload.document.paymentStatus).toBe('unpaid');
    expect(failedManualPayload.document.paymentLinkStatus).toBe('active');
    expect(failedManualPayload.document.paymentLinkPath).toBe(createPayload.document.paymentLinkPath);
    await expect(page.locator(`[data-billing-document-payment-link-status="${rowKey}"]`)).toContainText('Pay link active');

    await page.locator(`[data-billing-document-manual-payment-status="${rowKey}"]`).selectOption('succeeded');
    await page.locator(`[data-billing-document-manual-payment-amount="${rowKey}"]`).fill('20.00');
    await page.locator(`[data-billing-document-manual-payment-method="${rowKey}"]`).selectOption('bank_transfer');
    await page.locator(`[data-billing-document-manual-payment-reference="${rowKey}"]`).fill(`WIRE-${token}`);
    await page.locator(`[data-billing-document-manual-payment-note="${rowKey}"]`).fill('central billing partial payment');

    const manualResponse = page.waitForResponse((response) =>
      response.url().includes(`/api/builder/billing-documents/booking/${bookingId}/${invoice.documentId}/manual-payments`)
      && response.request().method() === 'POST',
      { timeout: 45_000 },
    );
    await page.locator(`[data-billing-document-manual-payment-submit="${rowKey}"]`).click();
    const manualPayload = (await (await manualResponse).json()) as {
      document: {
        balanceDue: number;
        paymentStatus: string;
        paymentLinkStatus: string;
        paymentLinkPath: string;
        paymentReconciliationStatus: string;
        paymentLinkRevokedReason: string;
        paymentLinkRenewalNeeded: boolean;
        paymentLinkEvents: Array<{ type: string; reason?: string; paymentId?: string }>;
      };
      manualPayment: { paymentId: string; status: string };
    };
    expect(manualPayload.document.balanceDue).toBe(6800);
    expect(manualPayload.document.paymentStatus).toBe('partially_paid');
    expect(manualPayload.document.paymentLinkStatus).toBe('revoked');
    expect(manualPayload.document.paymentLinkRevokedReason).toBe('balance_changed');
    expect(manualPayload.document.paymentReconciliationStatus).toBe('renew_required');
    expect(manualPayload.document.paymentLinkRenewalNeeded).toBe(true);
    expect(manualPayload.document.paymentLinkPath).toBe('');
    expect(manualPayload.document.paymentLinkEvents).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'revoked', reason: 'balance_changed', paymentId: manualPayload.manualPayment.paymentId }),
    ]));
    await expect(page.locator(`[data-billing-document-payment-status="${rowKey}"]`)).toContainText('partially paid');
    await expect(page.locator(`[data-billing-document-payment-link-reconcile="${rowKey}"]`)).toContainText('Pay link needs renewal');
    await expect(page.locator(`[data-billing-document-payment-link-history="${rowKey}"]`)).toContainText('Pay link stale after payment');
    await expect(page.locator(`[data-billing-document-create-payment="${rowKey}"]`)).toContainText('Renew pay');

    const notificationResponse = await request.get(`/api/builder/commerce/notifications?locale=${LOCALE}&type=billing.payment_received.customer`, {
      headers,
    });
    expect(notificationResponse.status()).toBe(200);
    const notificationPayload = await notificationResponse.json() as {
      events: Array<{ type: string; recipient: { email: string }; payload: { paymentId?: string; source?: string; documentId?: string; amount?: number } }>;
    };
    const paymentEvent = notificationPayload.events.find((event) => event.payload.paymentId === manualPayload.manualPayment.paymentId);
    expect(paymentEvent).toMatchObject({
      type: 'billing.payment_received.customer',
      recipient: { email: `billing-booking-${token}@example.com` },
      payload: {
        source: 'booking',
        documentId: invoice.documentId,
        amount: 2000,
      },
    });

    await page.goto(`/${LOCALE}/admin-builder/commerce/notifications?paymentReceived=${token}`, { waitUntil: 'domcontentloaded' });
    const paymentEventRow = page
      .locator('[data-commerce-notification-event-type="billing.payment_received.customer"]')
      .filter({ hasText: manualPayload.manualPayment.paymentId })
      .first();
    await expect(paymentEventRow).toBeVisible();
    await expect(paymentEventRow.locator('[data-commerce-notification-event-summary]')).toContainText(invoice.number);
    await expect(paymentEventRow.locator('[data-commerce-notification-event-summary]')).toContainText('Manual payment');

    const stalePayResponse = await request.get(createPayload.document.paymentLinkPath);
    expect(stalePayResponse.status()).toBe(410);
    const stalePayHtml = await stalePayResponse.text();
    expect(stalePayHtml).toContain('data-public-billing-payment-unavailable');
    expect(stalePayHtml).not.toContain(`billing-booking-${token}@example.com`);
    expect(stalePayHtml).not.toContain(`Booking account ${token}`);
  } finally {
    if (bookingId) {
      await request.patch(`/api/builder/bookings/${bookingId}`, {
        headers,
        data: { status: 'cancelled' },
        failOnStatusCode: false,
      });
    }
    if (serviceId) {
      await request.delete(`/api/builder/bookings/services/${serviceId}`, {
        headers,
        failOnStatusCode: false,
      });
    }
    if (staffId) {
      await request.delete(`/api/builder/bookings/staff/${staffId}`, {
        headers,
        failOnStatusCode: false,
      });
    }
  }
});
