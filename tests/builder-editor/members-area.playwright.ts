import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test, type APIRequestContext } from '@playwright/test';
import { getBookingFlowCopy } from '@/lib/builder/bookings/bookings-copy';

const LOCALE = 'ko';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'members-area';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function createAdminMember(request: APIRequestContext, token: string, role: 'free' | 'premium' | 'admin') {
  const response = await request.post('/api/builder/members', {
    headers: mutationHeaders(`f46-member-create-${token}`),
    data: {
      email: `f46-${role}-${token}@example.com`,
      name: `F46 ${role} member ${token}`,
      password: 'password123',
      role,
      verified: true,
    },
  });
  expect(response.status()).toBe(201);
  const json = await response.json() as { ok?: boolean; member?: { memberId: string; email: string }; error?: string };
  expect(json.ok, json.error).toBe(true);
  expect(json.member?.memberId).toBeTruthy();
  const member = json.member;
  if (!member) throw new Error('Failed to create member.');
  return member;
}

async function deleteMember(request: APIRequestContext, memberId: string, token: string) {
  await request.delete(`/api/builder/members/${memberId}`, {
    headers: mutationHeaders(`f46-member-delete-${token}`),
    failOnStatusCode: false,
  });
}

async function firstBookingSlotOnDate(request: APIRequestContext, token: string, serviceId: string, date: string) {
  const response = await request.get(`/api/booking/availability?serviceId=${serviceId}&staffId=staff-tseng&date=${date}`, {
    headers: mutationHeaders(`f79-availability-${token}-${date}`),
  });
  expect(response.status()).toBe(200);
  const json = await response.json() as { slots?: Array<{ startAt: string }> };
  const slot = json.slots?.[0]?.startAt;
  if (!slot) throw new Error(`No future booking slot available for F79 member portal test on ${date}.`);
  return slot;
}

async function firstBookingSlotOnDateForStaff(request: APIRequestContext, token: string, serviceId: string, staffId: string, date: string) {
  const response = await request.get(`/api/booking/availability?serviceId=${serviceId}&staffId=${staffId}&date=${date}`, {
    headers: mutationHeaders(`f79-availability-${token}-${staffId}-${date}`),
  });
  expect(response.status()).toBe(200);
  const json = await response.json() as { slots?: Array<{ startAt: string }> };
  const slot = json.slots?.[0]?.startAt;
  if (!slot) throw new Error(`No future booking slot available for F79 member portal test on ${date} and staff ${staffId}.`);
  return slot;
}

function formatDateInTimezone(iso: string, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(iso));
  const year = parts.find((part) => part.type === 'year')?.value ?? '';
  const month = parts.find((part) => part.type === 'month')?.value ?? '';
  const day = parts.find((part) => part.type === 'day')?.value ?? '';
  return `${year}-${month}-${day}`;
}

async function cancelBooking(request: APIRequestContext, bookingId: string, token: string) {
  await request.patch(`/api/builder/bookings/${bookingId}`, {
    headers: mutationHeaders(`f79-booking-cancel-${token}`),
    data: { status: 'cancelled', cancellationReason: 'Playwright cleanup' },
    failOnStatusCode: false,
  });
}

async function deleteService(request: APIRequestContext, token: string, serviceId: string) {
  await request.delete(`/api/builder/bookings/services/${serviceId}`, {
    headers: mutationHeaders(`f79-service-delete-${token}`),
    failOnStatusCode: false,
  });
}

test('native Members area gates account pages, profile editing, and role-aware navigation', async ({ page }) => {
  const token = Date.now().toString(36);
  const freeEmail = `f46-free-signup-${token}@example.com`;
  let freeMemberId: string | null = null;
  let premiumMemberId: string | null = null;
  let adminCreatedMemberId: string | null = null;
  let bookingId: string | null = null;
  let secondaryBookingId: string | null = null;
  let staffBookingId: string | null = null;
  let serviceId: string | null = null;
  let unpaidServiceId: string | null = null;
  let staffFilterServiceId: string | null = null;
  let staffFilterStaffId: string | null = null;
  let packageId: string | null = null;
  let packageCreditId: string | null = null;
  let rebookBookingId: string | null = null;
  let renewalDocumentId: string | null = null;
  const bookingFlowCopy = getBookingFlowCopy(LOCALE);

  try {
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

    await page.goto(`/${LOCALE}/account`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/login\\?next=`));
    await expect(page).toHaveTitle('회원 로그인');
    await expect(page.locator('[data-member-login-page="true"]')).toContainText('회원 로그인');

    await page.getByRole('button', { name: '회원가입' }).click();
    await page.locator('input[name="name"]').fill(`F46 Free Signup ${token}`);
    await page.locator('input[name="email"]').fill(freeEmail);
    await page.locator('input[name="password"]').fill('password123');
    await page.getByRole('button', { name: '회원가입' }).last().click();
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/account$`));
    await expect(page).toHaveTitle('회원 계정');
    await expect(page.locator('[data-member-account-page="true"]')).toContainText(`F46 Free Signup ${token}`);
    await expect(page.locator('[data-member-premium-link="locked"]')).toBeVisible();
    await expect(page.locator('[data-member-billing-link="true"]')).toHaveAttribute('href', new RegExp(`/${LOCALE}/account/billing`));

    const me = await page.request.get('/api/members/me');
    expect(me.status()).toBe(200);
    freeMemberId = ((await me.json()) as { member?: { memberId?: string } }).member?.memberId ?? null;
    expect(freeMemberId).toBeTruthy();

    const serviceResponse = await page.request.post('/api/builder/bookings/services', {
      headers: mutationHeaders(`f79-service-create-${token}`),
      data: {
        name: {
          ko: `F79 예약 서비스 ${token}`,
          'zh-hant': `F79 預約服務 ${token}`,
          en: `F79 booking service ${token}`,
        },
        description: {
          ko: '패키지/크레딧 상세 노출을 검증하는 임시 결제형 상담 서비스입니다.',
          'zh-hant': '用於驗證方案/點數詳情顯示的臨時付費諮詢服務。',
          en: 'Temporary paid consultation service for package visibility testing.',
        },
        durationMinutes: 30,
        priceTwd: 3000,
        image: '',
        category: 'consultation',
        staffIds: ['staff-tseng'],
        requiredResourceIds: ['res-consultation-room'],
        bufferBeforeMinutes: 0,
        bufferAfterMinutes: 15,
        maxParticipants: 1,
        slotStepMinutes: 30,
        isActive: true,
        paymentMode: 'paid',
        priceAmount: 15000,
        priceCurrency: 'TWD',
        meetingMode: 'in-person',
        cancellationPolicyId: '',
        reminderOffsetsHours: [24],
      },
    });
    expect(serviceResponse.status()).toBe(201);
    serviceId = ((await serviceResponse.json()) as { service?: { serviceId?: string } }).service?.serviceId ?? null;
    expect(serviceId).toBeTruthy();
    if (!serviceId) throw new Error('Failed to create temporary paid service.');
    const createdServiceId = serviceId;

    const packageResponse = await page.request.post('/api/builder/bookings/packages', {
      headers: mutationHeaders(`f79-package-create-${token}`),
      data: {
        name: {
          ko: `F79 상담 패키지 ${token}`,
          'zh-hant': `F79 諮詢方案 ${token}`,
          en: `F79 consultation package ${token}`,
        },
        description: {
          ko: '회원 예약 상세에서 보이는 패키지/크레딧 테스트용 패키지입니다.',
          'zh-hant': '用於會員預約詳情頁方案/點數顯示測試。',
          en: 'Package used by the member booking detail package visibility test.',
        },
        eligibleServiceIds: [createdServiceId],
        credits: 3,
        validityDays: 180,
        priceAmount: 15000,
        priceCurrency: 'TWD',
        isActive: true,
      },
    });
    expect(packageResponse.status()).toBe(201);
    packageId = ((await packageResponse.json()) as { package?: { packageId?: string } }).package?.packageId ?? null;
    expect(packageId).toBeTruthy();
    if (!packageId) throw new Error('Failed to create package.');
    const createdPackageId = packageId;

    const packageCreditResponse = await page.request.post('/api/builder/bookings/package-credits', {
      headers: mutationHeaders(`f79-package-credit-create-${token}`),
      data: {
        packageId: createdPackageId,
        customerEmail: freeEmail,
        customerName: `F46 Free Signup ${token}`,
        totalCredits: 3,
        status: 'active',
      },
    });
    expect(packageCreditResponse.status()).toBe(201);
    packageCreditId = ((await packageCreditResponse.json()) as { credit?: { creditId?: string } }).credit?.creditId ?? null;
    expect(packageCreditId).toBeTruthy();
    if (!packageCreditId) throw new Error('Failed to create package credit.');

    const unpaidServiceResponse = await page.request.post('/api/builder/bookings/services', {
      headers: mutationHeaders(`f79-unpaid-service-create-${token}`),
      data: {
        name: {
          ko: `F79 미결제 서비스 ${token}`,
          'zh-hant': `F79 未付款服務 ${token}`,
          en: `F79 unpaid booking service ${token}`,
        },
        description: {
          ko: '결제 상태 필터 검증용 두 번째 상담 서비스입니다.',
          'zh-hant': '用於驗證付款狀態篩選的第二個諮詢服務。',
          en: 'Second consultation service used to verify payment filters.',
        },
        durationMinutes: 30,
        priceTwd: 2800,
        image: '',
        category: 'consultation',
        staffIds: ['staff-tseng'],
        requiredResourceIds: [],
        bufferBeforeMinutes: 0,
        bufferAfterMinutes: 0,
        maxParticipants: 1,
        slotStepMinutes: 30,
        isActive: true,
        paymentMode: 'paid',
        priceAmount: 12000,
        priceCurrency: 'TWD',
        meetingMode: 'in-person',
        cancellationPolicyId: '',
        reminderOffsetsHours: [24],
      },
    });
    expect(unpaidServiceResponse.status()).toBe(201);
    unpaidServiceId = ((await unpaidServiceResponse.json()) as { service?: { serviceId?: string } }).service?.serviceId ?? null;
    expect(unpaidServiceId).toBeTruthy();
    if (!unpaidServiceId) throw new Error('Failed to create unpaid test service.');

    const staffResponse = await page.request.post('/api/builder/bookings/staff', {
      headers: mutationHeaders(`f79-staff-create-${token}`),
      data: {
        name: {
          ko: `F79 담당자 ${token}`,
          'zh-hant': `F79 負責人 ${token}`,
          en: `F79 staff ${token}`,
        },
        title: {
          ko: '추가 담당자',
          'zh-hant': '額外負責人',
          en: 'Additional staff',
        },
        bio: {
          ko: '담당자 필터 검증용 두 번째 담당자입니다.',
          'zh-hant': '用於驗證負責人篩選的第二位負責人。',
          en: 'Secondary staff used to verify staff filtering.',
        },
        email: '',
        photo: '',
        isActive: true,
      },
    });
    expect(staffResponse.status()).toBe(201);
    staffFilterStaffId = ((await staffResponse.json()) as { staff?: { staffId?: string } }).staff?.staffId ?? null;
    expect(staffFilterStaffId).toBeTruthy();
    if (!staffFilterStaffId) throw new Error('Failed to create staff filter test staff.');

    const staffFilterServiceResponse = await page.request.post('/api/builder/bookings/services', {
      headers: mutationHeaders(`f79-staff-filter-service-create-${token}`),
      data: {
        name: {
          ko: `F79 담당자 서비스 ${token}`,
          'zh-hant': `F79 負責人服務 ${token}`,
          en: `F79 staff service ${token}`,
        },
        description: {
          ko: '담당자 필터와 CSV 내보내기 검증용 상담 서비스입니다.',
          'zh-hant': '用於驗證負責人篩選與 CSV 匯出的諮詢服務。',
          en: 'Consultation service used to verify staff filtering and CSV export.',
        },
        durationMinutes: 30,
        priceTwd: 2800,
        image: '',
        category: 'consultation',
        staffIds: [staffFilterStaffId],
        requiredResourceIds: [],
        bufferBeforeMinutes: 0,
        bufferAfterMinutes: 0,
        maxParticipants: 1,
        slotStepMinutes: 30,
        isActive: true,
        paymentMode: 'paid',
        priceAmount: 12000,
        priceCurrency: 'TWD',
        meetingMode: 'in-person',
        cancellationPolicyId: '',
        reminderOffsetsHours: [24],
      },
    });
    expect(staffFilterServiceResponse.status()).toBe(201);
    staffFilterServiceId = ((await staffFilterServiceResponse.json()) as { service?: { serviceId?: string } }).service?.serviceId ?? null;
    expect(staffFilterServiceId).toBeTruthy();
    if (!staffFilterServiceId) throw new Error('Failed to create staff filter test service.');

    const startAt = await firstBookingSlotOnDate(page.request, token, createdServiceId, '2099-01-05');
    const bookingResponse = await page.request.post('/api/builder/bookings/admin-create', {
      headers: mutationHeaders(`f79-booking-create-${token}`),
      data: {
        serviceId: createdServiceId,
        staffId: 'staff-tseng',
        startAt,
        status: 'confirmed',
        customer: {
          name: `F46 Free Signup ${token}`,
          email: freeEmail,
          phone: '+886-2-1234-5678',
          locale: LOCALE,
        },
      },
    });
    expect(bookingResponse.status()).toBe(201);
    bookingId = ((await bookingResponse.json()) as { booking?: { bookingId?: string } }).booking?.bookingId ?? null;
    expect(bookingId).toBeTruthy();
    if (!bookingId) throw new Error('Failed to create primary booking.');
    const createdBookingId = bookingId;

    const staffBookingStartAt = await firstBookingSlotOnDateForStaff(page.request, token, staffFilterServiceId, staffFilterStaffId, '2099-01-06');
    const staffBookingResponse = await page.request.post('/api/builder/bookings/admin-create', {
      headers: mutationHeaders(`f79-staff-booking-create-${token}`),
      data: {
        serviceId: staffFilterServiceId,
        staffId: staffFilterStaffId,
        startAt: staffBookingStartAt,
        customerTimezone: 'America/New_York',
        status: 'confirmed',
        customer: {
          name: `F46 Free Signup ${token}`,
          email: freeEmail,
          phone: '+886-2-1234-5678',
          locale: LOCALE,
        },
      },
    });
    expect(staffBookingResponse.status()).toBe(201);
    staffBookingId = ((await staffBookingResponse.json()) as { booking?: { bookingId?: string } }).booking?.bookingId ?? null;
    expect(staffBookingId).toBeTruthy();
    if (!staffBookingId) throw new Error('Failed to create staff-filter test booking.');
    const createdStaffBookingId = staffBookingId;

    const invoiceResponse = await page.request.post(`/api/builder/bookings/${createdBookingId}/documents`, {
      headers: mutationHeaders(`f79-booking-invoice-${token}`),
      data: { type: 'invoice', email: false },
    });
    expect(invoiceResponse.status()).toBe(200);
    const invoiceJson = await invoiceResponse.json() as { document?: { documentId?: string; number?: string } };
    const invoiceDocumentId = invoiceJson.document?.documentId ?? null;
    const invoiceNumber = invoiceJson.document?.number ?? null;
    expect(invoiceDocumentId).toBeTruthy();
    expect(invoiceNumber).toBeTruthy();
    if (!invoiceDocumentId || !invoiceNumber) throw new Error('Failed to create invoice document.');

    const shareLinkResponse = await page.request.post(`/api/builder/billing-documents/booking/${createdBookingId}/${invoiceDocumentId}/share-link`, {
      headers: mutationHeaders(`f79-booking-document-share-${token}`),
      data: { expiresAt: '2099-12-31T00:00:00.000Z' },
    });
    expect(shareLinkResponse.status()).toBe(200);

    await page.goto(`/${LOCALE}/account/profile`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle('회원 프로필');
    // The login email is read-only on the profile form now.
    await expect(
      page.locator('[data-member-profile-form="true"] input[name="email"]'),
    ).toHaveAttribute('data-member-profile-email-readonly', 'true');
    await page.locator('[data-member-profile-form="true"] input[name="name"]').fill(`F46 Updated ${token}`);
    await page.locator('[data-member-profile-form="true"] input[name="phone"]').fill('+886-2-1234-5678');
    const profilePhoto = await page.evaluate((suffix) => {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" rx="40" fill="#111827"/><text x="40" y="48" text-anchor="middle" font-size="26" fill="#ffffff">${suffix}</text></svg>`;
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    }, token.slice(0, 1).toUpperCase());
    await page.locator('[data-member-profile-form="true"] input[name="profilePhoto"]').fill(profilePhoto);
    await page.locator('[data-member-profile-form="true"] textarea[name="profileNote"]').fill(`Prefers calls for follow-up ${token}`);
    await page.locator('[data-member-profile-form="true"] input[name="bookingEmailReminders"]').check();
    await page.locator('[data-member-profile-form="true"] input[name="billingEmails"]').check();
    await page.locator('[data-member-profile-form="true"] button[type="submit"]').click();
    await expect(page.locator('[data-member-profile-form="true"]')).toContainText('저장되었습니다.');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-member-profile-form="true"] input[name="name"]')).toHaveValue(`F46 Updated ${token}`);
    await expect(page.locator('[data-member-profile-form="true"] input[name="email"]')).toHaveValue(freeEmail);
    await expect(page.locator('[data-member-profile-form="true"] input[name="profilePhoto"]')).toHaveValue(profilePhoto);
    await expect(page.locator('[data-member-profile-photo-preview="true"]')).toHaveAttribute('src', profilePhoto);
    await expect(page.locator('[data-member-profile-note-preview="true"]')).toContainText(`Prefers calls for follow-up ${token}`);
    // Self-service email change is blocked (email_change_requires_verification),
    // so no alias chip can accumulate for this member — the row must stay absent.
    await expect(page.locator('[data-member-profile-aliases="true"]')).toHaveCount(0);
    await expect(page.locator('[data-member-profile-form="true"] input[name="bookingEmailReminders"]')).toBeChecked();
    await expect(page.locator('[data-member-profile-form="true"] input[name="bookingSmsReminders"]')).not.toBeChecked();
    await expect(page.locator('[data-member-profile-form="true"] input[name="billingEmails"]')).toBeChecked();
    await expect(page.locator('[data-member-profile-notification-summary="true"]')).toContainText('예약 이메일');
    await expect(page.locator('[data-member-profile-notification-summary="true"]')).toContainText('청구서 이메일');

    await page.goto(`/${LOCALE}/account`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle('회원 계정');
    await expect(page.locator('[data-member-bookings-link="true"]')).toBeVisible();
    await page.goto(`/${LOCALE}/account/bookings`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle('내 예약');
    await expect(page.locator('[data-member-bookings-page="true"]')).toContainText('내 예약');
    await expect(page.locator(`[data-member-booking-row="${bookingId}"]`)).toContainText('F79 예약 서비스');
    await expect(page.locator(`[data-member-booking-id="${createdBookingId}"]`)).toContainText(createdBookingId);
    const detailLink = page.locator(`[data-member-booking-detail="${bookingId}"]`);
    await expect(detailLink).toBeVisible();
    await expect(detailLink).toHaveAttribute('href', new RegExp(`/${LOCALE}/account/bookings/${bookingId}`));
    await detailLink.click();
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/account/bookings/${bookingId}$`));
    await expect(page).toHaveTitle('예약 상세');
    await expect(page.locator('[data-member-booking-detail-page="true"]')).toContainText('예약 상세');
    await expect(page.locator('[data-member-booking-id-detail="true"]')).toHaveText(createdBookingId);
    await expect(page.locator(`[data-member-booking-detail-manage="${bookingId}"]`)).toBeVisible();
    await expect(page.locator('[data-member-booking-detail-page="true"]')).toContainText(freeEmail);
    await expect(page.locator('[data-member-booking-office-time="true"]')).toBeVisible();
    await expect(page.locator('[data-member-booking-office-time="true"]')).toContainText('사무실 시간');
    await expect(page.locator('[data-member-booking-office-timezone="true"]')).toContainText('사무실 시간대');
    await expect(page.locator('[data-member-booking-office-timezone="true"]')).toContainText('Asia/Taipei');
    await expect(page.locator('[data-member-booking-package="true"]')).toBeVisible();
    await expect(page.locator('[data-member-booking-package="true"]')).toContainText(`F79 상담 패키지 ${token}`);
    await expect(page.locator('[data-member-booking-package-status="true"]')).toHaveText('활성');
    await expect(page.locator('[data-member-booking-package="true"]')).toContainText('남은 크레딧');
    await expect(page.locator('[data-member-booking-package="true"]')).toContainText('사용 이력');
    await expect(page.locator('[data-member-booking-policy="true"]')).toBeVisible();
    await expect(page.locator('[data-member-booking-policy="true"]')).toContainText('예약 정책');
    await expect(page.locator('[data-member-booking-policy-card="status"]')).toContainText('가능');
    await expect(page.locator('[data-member-booking-policy-card="reschedule"]')).toContainText('가능');
    await expect(page.locator('[data-member-booking-rebook="true"]')).toBeVisible();
    await page.locator('[data-member-booking-rebook-toggle="true"] summary').click();
    const rebookFlow = page.locator('[data-member-booking-rebook-flow="true"]').first();
    await expect(rebookFlow).toBeVisible();
    await expect(rebookFlow.locator(`[data-booking-service-id="${createdServiceId}"]`)).toHaveAttribute('data-active', 'true');
    await rebookFlow.getByRole('button', { name: bookingFlowCopy.labels.continue }).click();
    await expect(rebookFlow.locator(`[data-booking-staff-id="staff-tseng"]`)).toHaveAttribute('data-active', 'true');
    await rebookFlow.getByRole('button', { name: bookingFlowCopy.labels.continue }).click();
    const rebookDateCandidates = ['2099-01-07', '2099-01-08'];
    let rebookDate = '';
    let rebookStartAt = '';
    for (const candidate of rebookDateCandidates) {
      try {
        rebookStartAt = await firstBookingSlotOnDate(page.request, token, createdServiceId, candidate);
        rebookDate = candidate;
        break;
      } catch {
        continue;
      }
    }
    expect(rebookStartAt).toBeTruthy();
    await rebookFlow.getByLabel(bookingFlowCopy.labels.date).fill(rebookDate);
    await expect(rebookFlow.locator('[data-booking-slot-start]').first()).toBeVisible();
    await rebookFlow.locator(`[data-booking-slot-start="${rebookStartAt}"]`).click();
    await rebookFlow.getByRole('button', { name: bookingFlowCopy.labels.continue }).click();
    await expect(rebookFlow.getByLabel(bookingFlowCopy.labels.name)).toHaveValue(`F46 Free Signup ${token}`);
    await expect(rebookFlow.getByLabel(bookingFlowCopy.labels.email)).toHaveValue(freeEmail);
    await expect(rebookFlow.getByLabel(bookingFlowCopy.labels.phone)).toHaveValue('+886-2-1234-5678');
    await rebookFlow.locator('input[type="checkbox"]').check();
    const rebookPaymentResponse = page.waitForResponse((response) =>
      response.url().includes('/api/booking/payment-intent') && response.request().method() === 'POST',
    );
    await rebookFlow.getByRole('button', { name: '결제 준비' }).click();
    expect((await rebookPaymentResponse).status()).toBe(200);
    const packagePaymentNotice = rebookFlow.locator('[data-booking-payment-confirmed="true"]');
    if (await packagePaymentNotice.isVisible()) {
      await expect(packagePaymentNotice).toContainText('세션권');
    } else {
      await expect(rebookFlow.locator('[data-booking-payment-element="stub"]')).toBeVisible();
      await rebookFlow.getByRole('button', { name: '테스트 결제 완료' }).click();
      await expect(packagePaymentNotice).toBeVisible();
    }
    const rebookBookResponsePromise = page.waitForResponse((response) =>
      response.url().includes('/api/booking/book') && response.request().method() === 'POST',
      { timeout: 30_000 },
    );
    await rebookFlow.getByRole('button', { name: bookingFlowCopy.labels.confirmBooking }).click();
    const rebookBookResponse = await rebookBookResponsePromise;
    expect(rebookBookResponse.status()).toBe(201);
    const rebookBookPayload = (await rebookBookResponse.json()) as { bookingId?: string };
    rebookBookingId = rebookBookPayload.bookingId ?? null;
    expect(rebookBookingId).toBeTruthy();
    const detailManageCopyButton = page.locator('[data-member-booking-detail-page="true"]').getByRole('button', { name: '예약 링크 복사' });
    await detailManageCopyButton.click();
    const manageCopiedLink = await page.evaluate(() => navigator.clipboard.readText());
    expect(manageCopiedLink).toContain('/bookings/manage/');
    await expect(page.locator(`[data-member-booking-detail-calendar="${bookingId}"]`)).toHaveAttribute('href', new RegExp(`/${LOCALE}/account/bookings/${bookingId}/calendar$`));
    const calendarDownloadPromise = page.waitForEvent('download');
    await page.locator(`[data-member-booking-detail-calendar="${bookingId}"]`).click();
    const calendarDownload = await calendarDownloadPromise;
    expect(calendarDownload.suggestedFilename()).toMatch(/booking-.*\.ics$/);
    const calendarPath = join(tmpdir(), `member-booking-calendar-${token}.ics`);
    await calendarDownload.saveAs(calendarPath);
    const calendarText = readFileSync(calendarPath, 'utf8');
    expect(calendarText).toContain('BEGIN:VCALENDAR');
    expect(calendarText).toContain('BEGIN:VEVENT');
    expect(calendarText).toContain('DTSTART:');
    expect(calendarText).toContain('DTEND:');
    expect(calendarText).toContain(`SUMMARY:예약: F79 예약 서비스 ${token}`);
    expect(calendarText).toContain(`DESCRIPTION:예약 ID: ${bookingId}`);
    await expect(page.locator('[data-member-booking-documents="true"]')).toBeVisible();
    await expect(page.locator('[data-member-booking-documents="true"]')).toContainText('청구서 및 영수증');
    await expect(page.locator(`[data-member-booking-document-card="${invoiceDocumentId}"]`)).toContainText(invoiceNumber);
    await expect(page.locator(`[data-member-booking-document-card="${invoiceDocumentId}"]`)).toContainText('문서 열기');
    await expect(page.locator(`[data-member-booking-document-card="${invoiceDocumentId}"]`)).toContainText('PDF 다운로드');
    await expect(page.locator(`[data-member-booking-document-card="${invoiceDocumentId}"]`)).toContainText('PDF 링크 복사');
    await expect(page.locator(`[data-member-booking-document-card="${invoiceDocumentId}"]`)).toContainText('이메일로 보내기');
    await expect(page.locator(`[data-member-booking-document-download="${invoiceDocumentId}"]`)).toHaveAttribute('href', /format=pdf/);
    await expect(page.locator(`[data-member-booking-document-card="${invoiceDocumentId}"]`).getByRole('button', { name: '새 결제 링크 요청' })).toHaveCount(0);
    const detailCopyButton = page.locator(`[data-member-booking-document-card="${invoiceDocumentId}"]`).getByRole('button', { name: 'PDF 링크 복사' });
    await detailCopyButton.click();
    const detailCopiedLink = await page.evaluate(() => navigator.clipboard.readText());
    expect(detailCopiedLink).toContain('format=pdf');
    const detailEmailResponsePromise = page.waitForResponse((response) =>
      response.url().includes(`/account/bookings/${bookingId}/documents/${invoiceDocumentId}/email`) && response.request().method() === 'POST',
    );
    const detailEmailButton = page.locator(`[data-send-email="${invoiceDocumentId}"]`);
    await detailEmailButton.click();
    expect((await detailEmailResponsePromise).status()).toBe(200);
    await expect(detailEmailButton).toHaveText('발송됨');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator(`[data-member-booking-document-card="${invoiceDocumentId}"]`)).toContainText('이메일 발송됨');
    const detailDownloadPromise = page.waitForEvent('download');
    await page.locator(`[data-member-booking-document-download="${invoiceDocumentId}"]`).click();
    const detailDownload = await detailDownloadPromise;
    expect(detailDownload).toBeTruthy();
    expect(detailDownload.suggestedFilename()).toContain('.pdf');

    const rescheduleStartAt = await firstBookingSlotOnDate(page.request, token, createdServiceId, '2099-01-08');
    const rescheduleInputValue = await page.evaluate((iso) => {
      const date = new Date(iso);
      const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
      return local.toISOString().slice(0, 16);
    }, rescheduleStartAt);
    await expect(page.locator('[data-member-booking-reschedule-panel="true"]')).toBeVisible();
    const rescheduleResponsePromise = page.waitForResponse((response) =>
      response.url().includes(`/account/bookings/${bookingId}/reschedule`) && response.request().method() === 'POST',
    );
    await page.locator(`[data-member-booking-detail-reschedule-start="${bookingId}"]`).fill(rescheduleInputValue);
    await page.locator(`[data-member-booking-detail-reschedule-submit="${bookingId}"]`).click();
    expect((await rescheduleResponsePromise).status()).toBe(200);
    await page.reload({ waitUntil: 'domcontentloaded' });
    const postRescheduleBookings = await page.request.get(`/api/members/bookings?locale=${LOCALE}`);
    expect(postRescheduleBookings.status()).toBe(200);
    const postRescheduleJson = await postRescheduleBookings.json() as { upcoming?: Array<{ bookingId: string; startAt: string; customerTimezone?: string }>; past?: Array<{ bookingId: string }> };
    const rescheduledBooking = postRescheduleJson.upcoming?.find((booking) => booking.bookingId === bookingId);
    expect(rescheduledBooking?.startAt).toBe(rescheduleStartAt);
    await expect(page.locator('[data-member-booking-detail-page="true"]')).toContainText('예약 상세');
    await expect(page.locator(`[data-member-booking-detail-reschedule-start="${bookingId}"]`)).toHaveValue(rescheduleInputValue);

    await page.goto(`/${LOCALE}/account/billing`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle('청구서 포털');
    await expect(page.locator('[data-billing-portal-state="signed-in"]')).toBeVisible();
    await expect(page.locator('[data-billing-portal-state="signed-in"]')).toContainText(freeEmail);
    await expect(page.locator(`[data-billing-document-card="${invoiceDocumentId}"]`)).toContainText(invoiceNumber);
    await expect(page.locator(`[data-billing-document-card="${invoiceDocumentId}"]`)).toContainText('합계');
    await expect(page.locator(`[data-billing-document-card="${invoiceDocumentId}"]`)).toContainText('PDF 링크 복사');
    await expect(page.locator(`[data-billing-document-card="${invoiceDocumentId}"]`)).toContainText('이메일로 보내기');
    await expect(page.locator(`[data-billing-document-card="${invoiceDocumentId}"]`).getByRole('button', { name: '새 결제 링크 요청' })).toHaveCount(0);
    await expect(page.locator(`[data-billing-download-link="${invoiceDocumentId}"]`)).toHaveAttribute('href', /format=pdf/);
    const billingCopyButton = page.locator(`[data-billing-document-card="${invoiceDocumentId}"]`).getByRole('button', { name: 'PDF 링크 복사' });
    await billingCopyButton.click();
    const billingCopiedLink = await page.evaluate(() => navigator.clipboard.readText());
    expect(billingCopiedLink).toContain('format=pdf');
    await page.goto(`/${LOCALE}/account/bookings/${bookingId}`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle('예약 상세');
    const billingEmailResponsePromise = page.waitForResponse((response) =>
      response.url().includes(`/account/bookings/${bookingId}/documents/${invoiceDocumentId}/email`) && response.request().method() === 'POST',
    );
    const billingEmailButton = page.locator(`[data-send-email="${invoiceDocumentId}"]`);
    await billingEmailButton.click();
    expect((await billingEmailResponsePromise).status()).toBe(200);
    await expect(billingEmailButton).toHaveText('발송됨');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.goto(`/${LOCALE}/account/bookings/${bookingId}`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle('예약 상세');
    const detailManageHref = await page.locator(`[data-member-booking-detail-manage="${bookingId}"]`).getAttribute('href');
    expect(detailManageHref).toContain(`/ko/bookings/manage/`);
    const manageToken = detailManageHref?.split('/bookings/manage/')[1];
    expect(manageToken).toBeTruthy();
    if (!manageToken) throw new Error('Missing manage token for locale-copied manage page check.');
    await page.locator(`[data-member-booking-detail-manage="${bookingId}"]`).click();
    await expect(page.locator('[data-booking-manage="true"]')).toBeVisible();
    await expect(page.locator('[data-booking-manage="true"]')).toContainText(`F46 Free Signup ${token}`);
    await page.goto(`/zh-hant/bookings/manage/${manageToken}`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle('管理預約');
    await expect(page.locator('[data-booking-manage="true"]')).toBeVisible();
    await expect(page.getByRole('heading', { name: '管理預約' })).toBeVisible();
    await expect(page.locator('[data-booking-manage-policy="true"]')).toContainText('可取消');
    await expect(page.getByRole('button', { name: '儲存新時間' })).toBeVisible();
    await expect(page.getByRole('button', { name: '取消預約' })).toBeVisible();
    await page.goto(`/${LOCALE}/account/bookings/${bookingId}`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle('예약 상세');
    await page.goto(`/${LOCALE}/account/bookings`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle('내 예약');
    const manageLink = page.locator(`[data-member-booking-manage="${bookingId}"]`);
    await expect(manageLink).toBeVisible();
    await expect(manageLink).toHaveAttribute('href', new RegExp(`/${LOCALE}/bookings/manage/`));
    await expect(page.locator(`[data-member-booking-calendar="${bookingId}"]`)).toHaveAttribute('href', new RegExp(`/${LOCALE}/account/bookings/${bookingId}/calendar$`));
    const listManageCopyButton = page.locator(`[data-member-booking-row="${bookingId}"]`).getByRole('button', { name: '예약 링크 복사' });
    await listManageCopyButton.click();
    const listCopiedLink = await page.evaluate(() => navigator.clipboard.readText());
    expect(listCopiedLink).toContain('/bookings/manage/');
    await manageLink.click();
    await expect(page.locator('[data-booking-manage="true"]')).toBeVisible();
    await expect(page.locator('[data-booking-manage="true"]')).toContainText(`F46 Free Signup ${token}`);
    await page.goto(`/${LOCALE}/account/bookings`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle('내 예약');
    await page.locator('[data-member-booking-sort-filter="earliest"]').click();
    await expect(page.locator('[data-member-booking-sort-filter="earliest"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-member-booking-row]')).toHaveCount(3);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-member-booking-sort-filter="earliest"]')).toHaveAttribute('aria-pressed', 'true');
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/account/bookings$`));
    await expect(page.locator('[data-member-booking-sort-filter="latest"]')).toHaveAttribute('aria-pressed', 'true');
    const secondaryStartAt = await firstBookingSlotOnDate(page.request, token, unpaidServiceId, '2099-01-06');
    const secondaryBookingResponse = await page.request.post('/api/builder/bookings/admin-create', {
      headers: mutationHeaders(`f79-booking-create-secondary-${token}`),
      data: {
        serviceId: unpaidServiceId,
        staffId: 'staff-tseng',
        startAt: secondaryStartAt,
        status: 'confirmed',
        customer: {
          name: `F46 Free Signup ${token}`,
          email: freeEmail,
          phone: '+886-2-1234-5678',
          locale: LOCALE,
        },
      },
    });
    expect(secondaryBookingResponse.status()).toBe(201);
    secondaryBookingId = ((await secondaryBookingResponse.json()) as { booking?: { bookingId?: string } }).booking?.bookingId ?? null;
    expect(secondaryBookingId).toBeTruthy();
    if (!secondaryBookingId) throw new Error('Failed to create secondary booking.');
    const filteredBookingId = secondaryBookingId;

    const renewalInvoiceResponse = await page.request.post(`/api/builder/bookings/${secondaryBookingId}/documents`, {
      headers: mutationHeaders(`f79-booking-renewal-invoice-${token}`),
      data: { type: 'invoice', email: false },
    });
    expect(renewalInvoiceResponse.status()).toBe(200);
    const renewalInvoiceJson = await renewalInvoiceResponse.json() as { document?: { documentId?: string; balanceDue?: number; number?: string } };
    renewalDocumentId = renewalInvoiceJson.document?.documentId ?? null;
    expect(renewalDocumentId).toBeTruthy();
    if (!renewalDocumentId) throw new Error('Failed to create renewal invoice document.');
    expect(renewalInvoiceJson.document?.balanceDue ?? 0).toBeGreaterThan(0);
    expect(renewalInvoiceJson.document?.number).toBeTruthy();

    await page.goto(`/${LOCALE}/account/bookings`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle('내 예약');
    await page.locator(`[data-member-booking-detail="${secondaryBookingId}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/account/bookings/${secondaryBookingId}$`));
    await expect(page.locator('[data-member-booking-detail-page="true"]')).toContainText('예약 상세');
    await expect(page.locator(`[data-member-booking-document-card="${renewalDocumentId}"]`)).toContainText('새 결제 링크 요청');

    await page.goto(`/${LOCALE}/account/billing`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle('청구서 포털');
    const renewalCard = page.locator(`[data-billing-document-card="${renewalDocumentId}"]`);
    await expect(renewalCard).toContainText('새 결제 링크 요청');
    const renewalButton = renewalCard.getByRole('button', { name: '새 결제 링크 요청' });
    const renewalResponsePromise = page.waitForResponse((response) =>
      response.url().includes(`/account/billing/documents/${renewalDocumentId}/payment-link`) && response.request().method() === 'POST',
    );
    await renewalButton.click();
    expect((await renewalResponsePromise).status()).toBe(200);
    await expect(renewalCard).toContainText('결제하기');
    await expect(page.locator(`[data-billing-pay-link="${renewalDocumentId}"]`)).toBeVisible();
    const billingCopyPaymentButton = renewalCard.getByRole('button', { name: '결제 링크 복사' });
    await expect(billingCopyPaymentButton).toBeVisible();
    await billingCopyPaymentButton.click();
    const billingCopiedPaymentLink = await page.evaluate(() => navigator.clipboard.readText());
    expect(billingCopiedPaymentLink).toContain('/api/billing-documents/');
    await expect(renewalCard.getByRole('button', { name: '새 결제 링크 요청' })).toHaveCount(0);
    await page.goto(`/${LOCALE}/account/bookings/${secondaryBookingId}`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle('예약 상세');
    await expect(page.locator(`[data-member-booking-document-card="${renewalDocumentId}"]`)).toContainText('결제하기');
    await expect(page.locator(`[data-member-booking-document-card="${renewalDocumentId}"]`).getByRole('button', { name: '새 결제 링크 요청' })).toHaveCount(0);
    const bookingCopyPaymentButton = page.locator(`[data-member-booking-document-card="${renewalDocumentId}"]`).getByRole('button', { name: '결제 링크 복사' });
    await expect(bookingCopyPaymentButton).toBeVisible();
    await bookingCopyPaymentButton.click();
    const bookingCopiedPaymentLink = await page.evaluate(() => navigator.clipboard.readText());
    expect(bookingCopiedPaymentLink).toContain('/api/billing-documents/');

    await page.goto(`/${LOCALE}/account/bookings`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle('내 예약');
    await expect(page.locator('[data-member-booking-search-form="true"]')).toBeVisible();
    await expect(page.locator('[data-member-booking-search-input="true"]')).toHaveValue('');
    await page.locator('[data-member-booking-search-input="true"]').fill(filteredBookingId);
    await page.locator('[data-member-booking-search-input="true"]').press('Enter');
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/account/bookings\\?q=`));
    await expect(page.locator('[data-member-booking-search-input="true"]')).toHaveValue(filteredBookingId);
    await expect(page.locator('[data-member-booking-row]')).toHaveCount(1);
    await expect(page.locator(`[data-member-booking-row="${filteredBookingId}"]`)).toBeVisible();
    await expect(page.locator(`[data-member-booking-row="${bookingId}"]`)).toHaveCount(0);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-member-booking-search-input="true"]')).toHaveValue(filteredBookingId);
    await expect(page.locator('[data-member-booking-row]')).toHaveCount(1);
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/account/bookings$`));
    await expect(page.locator('[data-member-booking-search-input="true"]')).toHaveValue('');
    await expect(page.locator('[data-member-booking-row]')).toHaveCount(4);

    await page.locator(`[data-member-booking-service-filter="${unpaidServiceId}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/account/bookings\\?service=${unpaidServiceId}$`));
    await expect(page.locator(`[data-member-booking-service-filter="${unpaidServiceId}"]`)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-member-booking-row]')).toHaveCount(1);
    await expect(page.locator(`[data-member-booking-row="${secondaryBookingId}"]`)).toBeVisible();
    await expect(page.locator('[data-member-bookings-export="true"]')).toHaveAttribute('href', new RegExp(`service=${unpaidServiceId}`));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator(`[data-member-booking-service-filter="${unpaidServiceId}"]`)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-member-booking-row]')).toHaveCount(1);
    const serviceExportDownloadPromise = page.waitForEvent('download');
    await page.locator('[data-member-bookings-export="true"]').click();
    const serviceExportDownload = await serviceExportDownloadPromise;
    expect(serviceExportDownload.suggestedFilename()).toBe('member-bookings-history.csv');
    const serviceExportPath = join(tmpdir(), `member-bookings-history-service-${token}.csv`);
    await serviceExportDownload.saveAs(serviceExportPath);
    const serviceCsv = readFileSync(serviceExportPath, 'utf8');
    expect(serviceCsv).toContain(filteredBookingId);
    expect(serviceCsv).not.toContain(createdBookingId);
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/account/bookings$`));
    await expect(page.locator('[data-member-booking-row]')).toHaveCount(4);

    await page.locator(`[data-member-booking-staff-filter="${staffFilterStaffId}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/account/bookings\\?staff=${staffFilterStaffId}$`));
    await expect(page.locator(`[data-member-booking-staff-filter="${staffFilterStaffId}"]`)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-member-booking-row]')).toHaveCount(1);
    await expect(page.locator(`[data-member-booking-row="${staffBookingId}"]`)).toBeVisible();
    await expect(page.locator(`[data-member-booking-row="${secondaryBookingId}"]`)).toHaveCount(0);
    await expect(page.locator('[data-member-bookings-export="true"]')).toHaveAttribute('href', new RegExp(`staff=${staffFilterStaffId}`));
    const staffExportDownloadPromise = page.waitForEvent('download');
    await page.locator('[data-member-bookings-export="true"]').click();
    const staffExportDownload = await staffExportDownloadPromise;
    expect(staffExportDownload.suggestedFilename()).toBe('member-bookings-history.csv');
    const staffExportPath = join(tmpdir(), `member-bookings-history-staff-${token}.csv`);
    await staffExportDownload.saveAs(staffExportPath);
    const staffCsv = readFileSync(staffExportPath, 'utf8');
    expect(staffCsv).toContain(createdStaffBookingId);
    expect(staffCsv).not.toContain(filteredBookingId);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator(`[data-member-booking-staff-filter="${staffFilterStaffId}"]`)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-member-booking-row]')).toHaveCount(1);
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/account/bookings$`));
    await expect(page.locator('[data-member-booking-row]')).toHaveCount(4);

    await page.locator('[data-member-booking-timezone-filter="America/New_York"]').click();
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/account/bookings\\?timezone=America%2FNew_York$`));
    await expect(page.locator('[data-member-booking-timezone-filter="America/New_York"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-member-booking-row]')).toHaveCount(1);
    await expect(page.locator(`[data-member-booking-row="${staffBookingId}"]`)).toBeVisible();
    await expect(page.locator('[data-member-bookings-export="true"]')).toHaveAttribute('href', new RegExp(`timezone=America%2FNew_York`));
    const timezoneExportDownloadPromise = page.waitForEvent('download');
    await page.locator('[data-member-bookings-export="true"]').click();
    const timezoneExportDownload = await timezoneExportDownloadPromise;
    expect(timezoneExportDownload.suggestedFilename()).toBe('member-bookings-history.csv');
    const timezoneExportPath = join(tmpdir(), `member-bookings-history-timezone-${token}.csv`);
    await timezoneExportDownload.saveAs(timezoneExportPath);
    const timezoneCsv = readFileSync(timezoneExportPath, 'utf8');
    expect(timezoneCsv).toContain(createdStaffBookingId);
    expect(timezoneCsv).not.toContain(filteredBookingId);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-member-booking-timezone-filter="America/New_York"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-member-booking-row]')).toHaveCount(1);
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/account/bookings$`));
    await expect(page.locator('[data-member-booking-row]')).toHaveCount(4);

    const bookingDate = formatDateInTimezone(staffBookingStartAt, 'America/New_York');
    await page.locator('[data-member-booking-timezone-filter="America/New_York"]').click();
    await expect(page.locator('[data-member-booking-timezone-filter="America/New_York"]')).toHaveAttribute('aria-pressed', 'true');
    await page.locator('[data-member-booking-date-from="true"]').fill(bookingDate);
    await page.locator('[data-member-booking-date-to="true"]').fill(bookingDate);
    await page.getByRole('button', { name: '예약 검색' }).click();
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/account/bookings\\?timezone=America%2FNew_York&dateFrom=${bookingDate}&dateTo=${bookingDate}$`));
    await expect(page.locator('[data-member-booking-date-from="true"]')).toHaveValue(bookingDate);
    await expect(page.locator('[data-member-booking-date-to="true"]')).toHaveValue(bookingDate);
    await expect(page.locator('[data-member-booking-row]')).toHaveCount(1);
    await expect(page.locator(`[data-member-booking-row="${staffBookingId}"]`)).toBeVisible();
    await expect(page.locator(`[data-member-booking-row="${secondaryBookingId}"]`)).toHaveCount(0);
    await expect(page.locator('[data-member-bookings-export="true"]')).toHaveAttribute('href', new RegExp(`timezone=America%2FNew_York`));
    await expect(page.locator('[data-member-bookings-export="true"]')).toHaveAttribute('href', new RegExp(`dateFrom=${bookingDate}`));
    await expect(page.locator('[data-member-bookings-export="true"]')).toHaveAttribute('href', new RegExp(`dateTo=${bookingDate}`));
    const dateExportDownloadPromise = page.waitForEvent('download');
    await page.locator('[data-member-bookings-export="true"]').click();
    const dateExportDownload = await dateExportDownloadPromise;
    expect(dateExportDownload.suggestedFilename()).toBe('member-bookings-history.csv');
    const dateExportPath = join(tmpdir(), `member-bookings-history-date-${token}.csv`);
    await dateExportDownload.saveAs(dateExportPath);
    const dateCsv = readFileSync(dateExportPath, 'utf8');
    expect(dateCsv).toContain(createdStaffBookingId);
    expect(dateCsv).not.toContain(filteredBookingId);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-member-booking-timezone-filter="America/New_York"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-member-booking-date-from="true"]')).toHaveValue(bookingDate);
    await expect(page.locator('[data-member-booking-date-to="true"]')).toHaveValue(bookingDate);
    await expect(page.locator('[data-member-booking-row]')).toHaveCount(1);
    await expect(page.locator(`[data-member-booking-row="${staffBookingId}"]`)).toBeVisible();
    await page.locator('[data-member-booking-search-reset="true"]').click();
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/account/bookings$`));
    await expect(page.locator('[data-member-booking-date-from="true"]')).toHaveValue('');
    await expect(page.locator('[data-member-booking-date-to="true"]')).toHaveValue('');
    await expect(page.locator('[data-member-booking-row]')).toHaveCount(4);
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/account/bookings\\?timezone=America%2FNew_York&dateFrom=${bookingDate}&dateTo=${bookingDate}$`));
    await expect(page.locator('[data-member-booking-timezone-filter="America/New_York"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-member-booking-date-from="true"]')).toHaveValue(bookingDate);
    await expect(page.locator('[data-member-booking-date-to="true"]')).toHaveValue(bookingDate);
    await expect(page.locator('[data-member-booking-row]')).toHaveCount(1);
    await expect(page.locator(`[data-member-booking-row="${staffBookingId}"]`)).toBeVisible();
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/account/bookings\\?timezone=America%2FNew_York$`));
    await expect(page.locator('[data-member-booking-timezone-filter="America/New_York"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-member-booking-date-from="true"]')).toHaveValue('');
    await expect(page.locator('[data-member-booking-date-to="true"]')).toHaveValue('');
    await expect(page.locator('[data-member-booking-row]')).toHaveCount(1);
    await expect(page.locator(`[data-member-booking-row="${staffBookingId}"]`)).toBeVisible();
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/account/bookings$`));
    await expect(page.locator('[data-member-booking-date-from="true"]')).toHaveValue('');
    await expect(page.locator('[data-member-booking-date-to="true"]')).toHaveValue('');
    await expect(page.locator('[data-member-booking-row]')).toHaveCount(4);

    await page.goto(`/${LOCALE}/account/bookings`, { waitUntil: 'domcontentloaded' });
    const noResultsQuery = `no-results-${token}`;
    await page.locator('[data-member-booking-search-input="true"]').fill(noResultsQuery);
    await page.getByRole('button', { name: '예약 검색' }).click();
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/account/bookings\\?q=${noResultsQuery}$`));
    await expect(page.locator('[data-member-bookings-no-results="true"]')).toBeVisible();
    await expect(page.locator('[data-member-bookings-no-results="true"]')).toContainText('현재 필터와 일치하는 예약이 없습니다.');
    await expect(page.locator('[data-member-bookings-no-results="true"]')).toContainText('적용된 필터');
    await expect(page.locator('[data-member-bookings-no-results-filters="true"]')).toContainText('예약 검색');
    await expect(page.locator('[data-member-bookings-no-results-filters="true"]')).toContainText(noResultsQuery);
    await expect(page.locator('[data-member-bookings-upcoming="true"]')).toHaveCount(0);
    await expect(page.locator('[data-member-bookings-past="true"]')).toHaveCount(0);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-member-bookings-no-results="true"]')).toBeVisible();
    await expect(page.locator('[data-member-booking-search-input="true"]')).toHaveValue(noResultsQuery);
    await page.locator('[data-member-bookings-no-results-reset="true"]').click();
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/account/bookings$`));
    await expect(page.locator('[data-member-bookings-no-results="true"]')).toHaveCount(0);
    await expect(page.locator('[data-member-booking-search-input="true"]')).toHaveValue('');
    await expect(page.locator('[data-member-booking-row]')).toHaveCount(4);
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/account/bookings\\?q=${noResultsQuery}$`));
    await expect(page.locator('[data-member-bookings-no-results="true"]')).toBeVisible();
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/account/bookings$`));
    await expect(page.locator('[data-member-booking-row]')).toHaveCount(4);

    await page.goto(`/${LOCALE}/account/bookings?payment=paid`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-member-booking-payment-filter="paid"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator(`[data-member-booking-row="${bookingId}"]`)).toBeVisible();
    await expect(page.locator(`[data-member-booking-row="${secondaryBookingId}"]`)).toHaveCount(0);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-member-booking-payment-filter="paid"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator(`[data-member-booking-row="${bookingId}"]`)).toBeVisible();
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/account/bookings$`));
    await expect(page.locator('[data-member-booking-row]')).toHaveCount(4);

    await page.goto(`/${LOCALE}/account/bookings?payment=unpaid`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-member-booking-payment-filter="unpaid"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator(`[data-member-booking-row="${secondaryBookingId}"]`)).toBeVisible();
    await expect(page.locator(`[data-member-booking-row="${bookingId}"]`)).toHaveCount(0);
    await page.goto(`/${LOCALE}/account/bookings?sort=earliest`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-member-booking-sort-filter="earliest"]')).toHaveAttribute('aria-pressed', 'true');
    await page.goto(`/${LOCALE}/account/bookings?payment=paid&sort=earliest`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-member-bookings-export="true"]')).toHaveAttribute('href', new RegExp(`payment=paid`));
    await expect(page.locator('[data-member-bookings-export="true"]')).toHaveAttribute('href', new RegExp(`sort=earliest`));
    const exportDownloadPromise = page.waitForEvent('download');
    await page.locator('[data-member-bookings-export="true"]').click();
    const exportDownload = await exportDownloadPromise;
    expect(exportDownload.suggestedFilename()).toBe('member-bookings-history.csv');
    const exportPath = join(tmpdir(), `member-bookings-history-${token}.csv`);
    await exportDownload.saveAs(exportPath);
    const csv = readFileSync(exportPath, 'utf8');
    expect(csv).toContain(createdBookingId);
    expect(csv).not.toContain(filteredBookingId);
    expect(csv).toContain('serviceName');

    await page.goto(`/${LOCALE}/account/bookings/${bookingId}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-member-booking-detail-page="true"]')).toContainText('예약 상세');
    await expect(page.locator(`[data-member-booking-detail-cancel="${bookingId}"]`)).toBeVisible();
    const memberCancelResponsePromise = page.waitForResponse((response) =>
      response.url().includes(`/account/bookings/${bookingId}/cancel`) && response.request().method() === 'POST',
    );
    await page.locator(`[data-member-booking-detail-cancel="${bookingId}"]`).click();
    expect((await memberCancelResponsePromise).status()).toBe(200);
    await expect(page.locator(`[data-member-booking-status="${'cancelled'}"]`)).toBeVisible();
    await expect(page.locator('[data-member-booking-policy-card="status"]')).toContainText('불가');
    await expect(page.locator('[data-member-booking-policy-card="reschedule"]')).toContainText('불가');

    await page.goto(`/${LOCALE}/account/bookings`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle('내 예약');
    await expect(page.locator('[data-member-booking-row]')).toHaveCount(4);
    await page.locator('[data-member-booking-status-filter="cancelled"]').click();
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/account/bookings\\?status=cancelled$`));
    await expect(page.locator('[data-member-booking-row]')).toHaveCount(1);
    await expect(page.locator(`[data-member-booking-row="${bookingId}"]`)).toBeVisible();
    await expect(page.locator(`[data-member-booking-status="${'cancelled'}"]`)).toBeVisible();
    await expect(page.locator('[data-member-booking-search-input="true"]')).toHaveValue('');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-member-booking-status-filter="cancelled"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-member-booking-row]')).toHaveCount(1);
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/account/bookings$`));
    await expect(page.locator('[data-member-booking-row]')).toHaveCount(4);

    const memberBookings = await page.request.get(`/api/members/bookings?locale=${LOCALE}`);
    expect(memberBookings.status()).toBe(200);
    const memberBookingsJson = await memberBookings.json() as { upcoming?: Array<Record<string, unknown> & { bookingId: string }>; past?: Array<{ bookingId: string }> };
    expect(memberBookingsJson.upcoming?.some((booking) => booking.bookingId === bookingId)).toBe(false);
    expect(memberBookingsJson.upcoming?.some((booking) => booking.bookingId === secondaryBookingId)).toBe(true);
    expect(memberBookingsJson.upcoming?.some((booking) => booking.bookingId === staffBookingId)).toBe(true);
    expect(memberBookingsJson.past?.some((booking) => booking.bookingId === bookingId)).toBe(true);
    const portalBooking = memberBookingsJson.past?.find((booking) => booking.bookingId === bookingId);
    expect(portalBooking).toBeTruthy();
    expect(portalBooking).not.toHaveProperty('managePath');
    expect(portalBooking).not.toHaveProperty('paymentIntentId');
    expect(portalBooking).not.toHaveProperty('billingDocuments');
    expect(portalBooking).not.toHaveProperty('manualPayments');

    await page.goto(`/${LOCALE}/account/premium`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle('프리미엄 회원 영역');
    await expect(page.locator('[data-member-premium-page="true"]')).toHaveAttribute('data-member-role-allowed', 'false');
    await expect(page.locator('[data-member-premium-page="true"]')).toContainText('역할 권한이 필요합니다');

    await page.goto(`/${LOCALE}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-member-nav-state="signed-in"]').first()).toContainText('내 계정');
    await expect(page.locator('[data-member-role-link="premium"]')).toHaveCount(0);

    await page.request.post('/api/members/logout');
    await page.goto(`/${LOCALE}/account`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle('회원 로그인');
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/login\\?next=`));

    const premium = await createAdminMember(page.request, token, 'premium');
    premiumMemberId = premium.memberId;
    await page.locator('input[name="email"]').fill(premium.email);
    await page.locator('input[name="password"]').fill('password123');
    await page.getByRole('button', { name: '로그인' }).last().click();
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/account$`));

    await page.goto(`/${LOCALE}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-member-nav-state="signed-in"]').first()).toContainText('내 계정');
    await expect(page.locator('[data-member-role-link="premium"]').first()).toContainText('프리미엄');

    await page.goto(`/${LOCALE}/account/premium`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle('프리미엄 회원 영역');
    await expect(page.locator('[data-member-premium-page="true"]')).toHaveAttribute('data-member-role-allowed', 'true');
    await expect(page.locator('[data-member-premium-page="true"]')).toContainText('프리미엄 회원 영역');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    const adminEmail = `f46-admin-ui-${token}@example.com`;
    await page.goto(`/${LOCALE}/admin-builder/members`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-builder-members-admin="true"]')).toContainText('회원 관리');
    await expect(page.locator('[data-builder-members-create-form="true"]')).toBeVisible();
    await page.locator('[data-builder-members-create-form="true"] input[name="name"]').fill(`F46 Admin UI ${token}`);
    await page.locator('[data-builder-members-create-form="true"] input[name="email"]').fill(adminEmail);
    await page.locator('[data-builder-members-create-form="true"] input[name="password"]').fill('password123');
    await page.locator('[data-builder-members-create-form="true"] select[name="role"]').selectOption('premium');
    await page.locator('[data-builder-members-create-form="true"] button[type="submit"]').click();
    await expect(page.locator('[data-builder-members-admin="true"]')).toContainText('회원이 생성되었습니다.');
    await expect(page.locator('[data-builder-members-admin="true"]')).toContainText(adminEmail);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    const membersResponse = await page.request.get('/api/builder/members?role=premium');
    expect(membersResponse.status()).toBe(200);
    const membersJson = await membersResponse.json() as { members?: Array<{ memberId: string; email: string }> };
    adminCreatedMemberId = membersJson.members?.find((member) => member.email === adminEmail)?.memberId ?? null;
    expect(adminCreatedMemberId).toBeTruthy();
  } finally {
    if (bookingId) await cancelBooking(page.request, bookingId, token);
    if (secondaryBookingId) await cancelBooking(page.request, secondaryBookingId, token);
    if (staffBookingId) await cancelBooking(page.request, staffBookingId, token);
    if (rebookBookingId) await cancelBooking(page.request, rebookBookingId, token);
    if (packageCreditId) {
      await page.request.delete(`/api/builder/bookings/package-credits/${packageCreditId}`, {
        headers: mutationHeaders(`f79-package-credit-delete-${token}`),
        failOnStatusCode: false,
      });
    }
    if (packageId) {
      await page.request.delete(`/api/builder/bookings/packages/${packageId}`, {
        headers: mutationHeaders(`f79-package-delete-${token}`),
        failOnStatusCode: false,
      });
    }
    if (serviceId) {
      await deleteService(page.request, token, serviceId);
    }
    if (unpaidServiceId) {
      await deleteService(page.request, token, unpaidServiceId);
    }
    if (staffFilterServiceId) {
      await deleteService(page.request, token, staffFilterServiceId);
    }
    if (staffFilterStaffId) {
      await page.request.delete(`/api/builder/bookings/staff/${staffFilterStaffId}`, {
        headers: mutationHeaders(`f79-staff-delete-${token}`),
        failOnStatusCode: false,
      });
    }
    if (freeMemberId) await deleteMember(page.request, freeMemberId, token);
    if (premiumMemberId) await deleteMember(page.request, premiumMemberId, token);
    if (adminCreatedMemberId) await deleteMember(page.request, adminCreatedMemberId, token);
  }
});
