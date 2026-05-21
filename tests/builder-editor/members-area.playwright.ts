import { expect, test, type APIRequestContext } from '@playwright/test';

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
  return json.member!;
}

async function deleteMember(request: APIRequestContext, memberId: string, token: string) {
  await request.delete(`/api/builder/members/${memberId}`, {
    headers: mutationHeaders(`f46-member-delete-${token}`),
    failOnStatusCode: false,
  });
}

async function firstBookingSlot(request: APIRequestContext, token: string) {
  for (const date of ['2099-01-05', '2099-01-06', '2099-01-07', '2099-01-08']) {
    const response = await request.get(`/api/booking/availability?serviceId=svc-initial-consultation&staffId=staff-tseng&date=${date}`, {
      headers: mutationHeaders(`f79-availability-${token}-${date}`),
    });
    expect(response.status()).toBe(200);
    const json = await response.json() as { slots?: Array<{ startAt: string }> };
    const slot = json.slots?.[0]?.startAt;
    if (slot) return slot;
  }
  throw new Error('No future booking slot available for F79 member portal test.');
}

async function cancelBooking(request: APIRequestContext, bookingId: string, token: string) {
  await request.patch(`/api/builder/bookings/${bookingId}`, {
    headers: mutationHeaders(`f79-booking-cancel-${token}`),
    data: { status: 'cancelled', cancellationReason: 'Playwright cleanup' },
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

  try {
    await page.goto(`/${LOCALE}/account`, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/login\\?next=`));
    await expect(page.locator('[data-member-login-page="true"]')).toContainText('회원 로그인');

    await page.getByRole('button', { name: '회원가입' }).click();
    await page.locator('input[name="name"]').fill(`F46 Free Signup ${token}`);
    await page.locator('input[name="email"]').fill(freeEmail);
    await page.locator('input[name="password"]').fill('password123');
    await page.getByRole('button', { name: '회원가입' }).last().click();
    await expect(page).toHaveURL(new RegExp(`/${LOCALE}/account$`));
    await expect(page.locator('[data-member-account-page="true"]')).toContainText(`F46 Free Signup ${token}`);
    await expect(page.locator('[data-member-premium-link="locked"]')).toBeVisible();

    const me = await page.request.get('/api/members/me');
    expect(me.status()).toBe(200);
    freeMemberId = ((await me.json()) as { member?: { memberId?: string } }).member?.memberId ?? null;
    expect(freeMemberId).toBeTruthy();

    const startAt = await firstBookingSlot(page.request, token);
    const bookingResponse = await page.request.post('/api/builder/bookings/admin-create', {
      headers: mutationHeaders(`f79-booking-create-${token}`),
      data: {
        serviceId: 'svc-initial-consultation',
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

    await page.goto(`/${LOCALE}/account`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-member-bookings-link="true"]')).toBeVisible();
    await page.goto(`/${LOCALE}/account/bookings`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-member-bookings-page="true"]')).toContainText('내 예약');
    await expect(page.locator(`[data-member-booking-row="${bookingId}"]`)).toContainText('상담');
    await expect(page.locator(`[data-member-booking-id="${bookingId}"]`)).toContainText(bookingId!);
    const memberBookings = await page.request.get(`/api/members/bookings?locale=${LOCALE}`);
    expect(memberBookings.status()).toBe(200);
    const memberBookingsJson = await memberBookings.json() as { upcoming?: Array<Record<string, unknown> & { bookingId: string }>; past?: Array<{ bookingId: string }> };
    expect(memberBookingsJson.upcoming?.some((booking) => booking.bookingId === bookingId)).toBe(true);
    expect(memberBookingsJson.past?.some((booking) => booking.bookingId === bookingId)).toBe(false);
    const portalBooking = memberBookingsJson.upcoming?.find((booking) => booking.bookingId === bookingId);
    expect(portalBooking).toBeTruthy();
    expect(portalBooking).not.toHaveProperty('managePath');
    expect(portalBooking).not.toHaveProperty('paymentIntentId');
    expect(portalBooking).not.toHaveProperty('billingDocuments');
    expect(portalBooking).not.toHaveProperty('manualPayments');

    await page.goto(`/${LOCALE}/account/premium`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-member-premium-page="true"]')).toHaveAttribute('data-member-role-allowed', 'false');
    await expect(page.locator('[data-member-premium-page="true"]')).toContainText('역할 권한이 필요합니다');

    await page.goto(`/${LOCALE}/account/profile`, { waitUntil: 'domcontentloaded' });
    await page.locator('[data-member-profile-form="true"] input[name="name"]').fill(`F46 Updated ${token}`);
    await page.locator('[data-member-profile-form="true"] input[name="phone"]').fill('+886-2-1234-5678');
    await page.locator('[data-member-profile-form="true"] button[type="submit"]').click();
    await expect(page.locator('[data-member-profile-form="true"]')).toContainText('저장되었습니다.');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-member-profile-form="true"] input[name="name"]')).toHaveValue(`F46 Updated ${token}`);

    await page.goto(`/${LOCALE}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-member-nav-state="signed-in"]').first()).toContainText('내 계정');
    await expect(page.locator('[data-member-role-link="premium"]')).toHaveCount(0);

    await page.request.post('/api/members/logout');
    await page.goto(`/${LOCALE}/account`, { waitUntil: 'domcontentloaded' });
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
    if (freeMemberId) await deleteMember(page.request, freeMemberId, token);
    if (premiumMemberId) await deleteMember(page.request, premiumMemberId, token);
    if (adminCreatedMemberId) await deleteMember(page.request, adminCreatedMemberId, token);
  }
});
