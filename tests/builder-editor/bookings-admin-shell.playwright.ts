import { expect, test } from '@playwright/test';

const authHeader = `Basic ${Buffer.from(
  `${process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin'}:${process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!'}`,
).toString('base64')}`;

test('renders the localized bookings admin shell in ko and zh-hant', async ({ page }) => {
  await page.setExtraHTTPHeaders({ Authorization: authHeader });

  await page.goto('/ko/admin-builder/bookings/dashboard', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/예약 대시보드/);
  await expect(page.getByText('Wix 예약 MVP')).toBeVisible();
  await expect(page.getByRole('navigation', { name: '예약 관리자' })).toBeVisible();
  await expect(page.getByRole('link', { name: '대시보드', exact: true })).toHaveAttribute('data-active', 'true');
  await expect(page.getByRole('link', { name: '서비스', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: '정책', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: '패키지', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: '자원', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: '담당자', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: '캘린더', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: '이메일', exact: true })).toBeVisible();

  await page.goto('/ko/admin-builder/bookings/services', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-booking-service-card]').filter({ hasText: '대면' }).first()).toBeVisible();
  await expect(page.getByText('in-person', { exact: true })).toHaveCount(0);

  await page.goto('/ko/admin-builder/bookings/calendar', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1', { hasText: '예약 캘린더' })).toBeVisible();
  await expect(page.getByRole('link', { name: '캘린더', exact: true })).toHaveAttribute('data-active', 'true');

  await page.goto('/ko/admin-builder/bookings/policies', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('link', { name: '정책', exact: true })).toHaveAttribute('data-active', 'true');
  await page.getByRole('button', { name: '새 정책', exact: true }).click();
  await expect(page.getByRole('heading', { name: '새 취소 정책', exact: true })).toBeVisible();
  await expect(page.getByLabel('이름')).toBeVisible();
  await page.getByRole('button', { name: '닫기', exact: true }).click();

  await page.goto('/ko/admin-builder/bookings/packages', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('예약 패키지', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: '패키지', exact: true })).toHaveAttribute('data-active', 'true');
  await expect(page.getByRole('button', { name: '크레딧 지급', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '새 패키지', exact: true }).click();
  await expect(page.getByRole('heading', { name: '새 패키지', exact: true })).toBeVisible();
  await expect(page.getByLabel('이름 KO')).toBeVisible();
  await expect(page.getByText('적용 가능한 서비스', { exact: true })).toBeVisible();
  await expect(page.getByText('모두 선택 해제하면 모든 유료 예약 서비스에 크레딧을 적용합니다.')).toBeVisible();
  await page.getByRole('button', { name: '닫기', exact: true }).click();
  await page.getByRole('button', { name: '크레딧 지급', exact: true }).click();
  await expect(page.getByRole('heading', { name: '고객 크레딧 지급', exact: true })).toBeVisible();
  await expect(page.getByLabel('고객 이메일')).toBeVisible();
  await page.getByRole('button', { name: '닫기', exact: true }).click();

  await page.goto('/ko/admin-builder/bookings/resources', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('예약 자원', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: '자원', exact: true })).toHaveAttribute('data-active', 'true');
  await page.getByRole('button', { name: '새 자원', exact: true }).click();
  await expect(page.getByRole('heading', { name: '새 자원', exact: true })).toBeVisible();
  await expect(page.getByLabel('이름 KO')).toBeVisible();
  await expect(page.getByText('반복 주간 시간', { exact: true })).toBeVisible();
  await expect(page.getByText('차단 시간', { exact: true })).toBeVisible();
  await expect(page.getByText('자원 저장', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '닫기', exact: true }).click();

  await page.goto('/ko/admin-builder/bookings/staff', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: '담당자', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: '담당자', exact: true })).toHaveAttribute('data-active', 'true');
  await expect(page.getByText('예약 프로필 담당자', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: '가능 시간', exact: true }).first()).toBeVisible();
  await expect(page.getByText('알림 이메일', { exact: false }).first()).toBeVisible();
  await page.getByRole('link', { name: '가능 시간', exact: true }).first().click();
  await expect(page.getByText('담당자 일정', { exact: true })).toBeVisible();
  await expect(page.getByText('근무 시간', { exact: true })).toBeVisible();
  await expect(page.getByText('차단 날짜', { exact: true })).toBeVisible();
  await expect(page.getByText('날짜 예외', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: '템플릿 적용', exact: true })).toBeVisible();

  await page.goto('/ko/admin-builder/bookings/email-templates', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('예약 이메일 템플릿', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: '이메일', exact: true })).toHaveAttribute('data-active', 'true');
  await expect(page.getByRole('button', { name: '고객 확인' })).toBeVisible();
  await expect(page.getByLabel('제목')).toBeVisible();

  await page.goto('/ko/admin-builder/bookings/calendar-sync', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('캘린더 동기화', { exact: true })).toBeVisible();
  await expect(page.getByText('스태프 OAuth 연결 후 예약은 외부 캘린더로 보내고, 외부 일정은 busy block으로 가져와 공개 예약 슬롯에서 제외합니다.')).toBeVisible();

  await page.goto('/zh-hant/admin-builder/bookings/services', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/預約服務/);
  await expect(page.getByText('Wix 預約 MVP')).toBeVisible();
  await expect(page.getByRole('navigation', { name: '預約管理' })).toBeVisible();
  await expect(page.getByRole('link', { name: '總覽', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: '服務', exact: true })).toHaveAttribute('data-active', 'true');
  await expect(page.getByRole('link', { name: '政策', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: '套餐', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: '資源', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: '員工', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: '行事曆', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: '電子郵件', exact: true })).toBeVisible();

  await page.goto('/zh-hant/admin-builder/bookings/services', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-booking-service-card]').filter({ hasText: '現場' }).first()).toBeVisible();
  await expect(page.getByText('in-person', { exact: true })).toHaveCount(0);

  await page.goto('/zh-hant/admin-builder/bookings/calendar', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1', { hasText: '預約行事曆' })).toBeVisible();
  await expect(page.getByRole('link', { name: '行事曆', exact: true })).toHaveAttribute('data-active', 'true');

  await page.goto('/zh-hant/admin-builder/bookings/policies', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('link', { name: '政策', exact: true })).toHaveAttribute('data-active', 'true');
  await page.getByRole('button', { name: '新增政策', exact: true }).click();
  await expect(page.getByRole('heading', { name: '新增取消政策', exact: true })).toBeVisible();
  await expect(page.getByLabel('名稱')).toBeVisible();
  await page.getByRole('button', { name: '關閉', exact: true }).click();

  await page.goto('/zh-hant/admin-builder/bookings/packages', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('預約套餐', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: '套餐', exact: true })).toHaveAttribute('data-active', 'true');
  await expect(page.getByRole('button', { name: '發放點數', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '新增方案', exact: true }).click();
  await expect(page.getByRole('heading', { name: '新增方案', exact: true })).toBeVisible();
  await expect(page.getByLabel('名稱 KO')).toBeVisible();
  await expect(page.getByText('適用服務', { exact: true })).toBeVisible();
  await expect(page.getByText('全部取消勾選時，點數可套用到任何付費預約服務。')).toBeVisible();
  await page.getByRole('button', { name: '關閉', exact: true }).click();
  await page.getByRole('button', { name: '發放點數', exact: true }).click();
  await expect(page.getByRole('heading', { name: '發放客戶點數', exact: true })).toBeVisible();
  await expect(page.getByLabel('客戶電子郵件')).toBeVisible();
  await page.getByRole('button', { name: '關閉', exact: true }).click();

  await page.goto('/zh-hant/admin-builder/bookings/resources', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('預約資源', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: '資源', exact: true })).toHaveAttribute('data-active', 'true');
  await page.getByRole('button', { name: '新增資源', exact: true }).click();
  await expect(page.getByRole('heading', { name: '新增資源', exact: true })).toBeVisible();
  await expect(page.getByLabel('名稱 KO')).toBeVisible();
  await expect(page.getByText('重複每週時段', { exact: true })).toBeVisible();
  await expect(page.getByText('封鎖時段', { exact: true })).toBeVisible();
  await expect(page.getByText('儲存資源', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '關閉', exact: true }).click();

  await page.goto('/zh-hant/admin-builder/bookings/staff', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: '員工', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: '員工', exact: true })).toHaveAttribute('data-active', 'true');
  await expect(page.getByText('具有預約檔案的員工', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: '可用時段', exact: true }).first()).toBeVisible();
  await expect(page.getByText('通知電子郵件', { exact: false }).first()).toBeVisible();
  await page.getByRole('link', { name: '可用時段', exact: true }).first().click();
  await expect(page.getByText('員工可用時段', { exact: true })).toBeVisible();
  await expect(page.getByText('工作時間', { exact: true })).toBeVisible();
  await expect(page.getByText('封鎖日期', { exact: true })).toBeVisible();
  await expect(page.getByText('日期覆寫', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: '套用範本', exact: true })).toBeVisible();

  await page.goto('/zh-hant/admin-builder/bookings/email-templates', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('預約電子郵件範本', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: '電子郵件', exact: true })).toHaveAttribute('data-active', 'true');
  await expect(page.getByRole('button', { name: '客戶確認' })).toBeVisible();
  await expect(page.getByLabel('主旨')).toBeVisible();

  await page.goto('/zh-hant/admin-builder/bookings/calendar-sync', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('行事曆同步', { exact: true })).toBeVisible();
  await expect(page.getByText('完成員工 OAuth 連線後，將預約送往外部行事曆，並把外部行程匯入為 busy block，以排除公開預約時段。')).toBeVisible();
});
