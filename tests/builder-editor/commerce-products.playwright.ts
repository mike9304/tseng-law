import { createHmac } from 'node:crypto';
import { expect, request as playwrightRequest, test, type APIRequestContext, type Page } from '@playwright/test';

const LOCALE = 'ko';
const STORE_APP_ID = 'native-store';

type CommerceProductSummary = {
  productId: string;
  title: string;
  slug: string;
  sku: string;
  status: string;
  options?: Array<{ name: string; values: string[] }>;
  variants?: Array<{
    title: string;
    sku: string;
    optionValues: Record<string, string>;
    priceCents: number;
    mediaId?: string;
    status: string;
    inventory: {
      quantity: number;
      lowStockThreshold: number;
      allowBackorder: boolean;
    };
  }>;
  media?: Array<{ mediaId: string; url: string }>;
};

type CommerceTaxRuleSummary = {
  ruleId: string;
  label: string;
  country: string;
  region?: string;
  rateBps: number;
  active: boolean;
  locale?: string;
  priority: number;
  includedInPrice?: boolean;
};

type CommerceShippingRuleSummary = {
  ruleId: string;
  method: string;
  label: string;
  currency: string;
  country?: string;
  amountCents: number;
  freeShippingMinSubtotalCents?: number;
  active: boolean;
  locale?: string;
  priority: number;
  estimatedDays: string;
};

type CommerceNotificationSettingsSummary = {
  version: 1;
  enabled: boolean;
  senderName: string;
  adminEmail: string;
  abandonedCart: { enabled: boolean; delayMinutes: number };
  paymentReceived: {
    enabled: boolean;
    manualEnabled: boolean;
    hostedEnabled: boolean;
    suppressFullSettlementReceiptOverlap: boolean;
  };
  templates: Record<string, { enabled: boolean; subject: string }>;
  updatedAt: string;
};

type CommerceCurrencySettingsSummary = {
  version: 1;
  baseCurrency: string;
  supportedCurrencies: string[];
  conversionMode: string;
  rates: Array<{ currency: string; enabled: boolean; rateToBase?: number }>;
  updatedAt: string;
};

type CommerceTestLocale = 'ko' | 'zh-hant';

type TestDocument = {
  version: 1;
  locale: typeof LOCALE;
  updatedAt: string;
  updatedBy: string;
  stageWidth: number;
  stageHeight: number;
  nodes: Array<Record<string, unknown>>;
};

const baseStyle = {
  backgroundColor: 'transparent',
  borderColor: '#cbd5e1',
  borderStyle: 'solid',
  borderWidth: 0,
  borderRadius: 0,
  shadowX: 0,
  shadowY: 0,
  shadowBlur: 0,
  shadowSpread: 0,
  shadowColor: 'rgba(15, 23, 42, 0.16)',
  opacity: 100,
};

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'commerce-products';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function webhookSignature(secret: string, rawBody: string, nowSeconds = Math.floor(Date.now() / 1000)): string {
  const signature = createHmac('sha256', secret).update(`${nowSeconds}.${rawBody}`).digest('hex');
  return `t=${nowSeconds},v1=${signature}`;
}

function makeProductGalleryDocument(token: string, categorySlug: string): TestDocument {
  return {
    version: 1,
    locale: LOCALE,
    updatedAt: new Date().toISOString(),
    updatedBy: 'commerce-products-playwright',
    stageWidth: 1280,
    stageHeight: 900,
    nodes: [
      {
        id: `product-gallery-title-${token}`,
        kind: 'text',
        rect: { x: 96, y: 68, width: 760, height: 72 },
        style: baseStyle,
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: `Store Gallery ${token}`,
          tag: 'h1',
          fontSize: 42,
          fontFamily: 'system-ui',
          fontWeight: 'bold',
          color: '#0f172a',
          align: 'left',
          lineHeight: 1.15,
        },
      },
      {
        id: `product-gallery-widget-${token}`,
        kind: 'product-gallery',
        rect: { x: 96, y: 164, width: 1080, height: 660 },
        style: baseStyle,
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        appWidget: {
          appId: STORE_APP_ID,
          widgetId: 'product-gallery',
        },
        content: {
          layout: 'grid',
          category: categorySlug,
          showCategoryFilter: true,
          showSort: true,
          showQuickView: true,
          columns: 3,
          pageSize: 1,
          sortBy: 'updated-desc',
        },
      },
      {
        id: `product-gallery-note-${token}`,
        kind: 'text',
        rect: { x: 96, y: 842, width: 720, height: 42 },
        style: baseStyle,
        zIndex: 3,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: `Primary category: ${categorySlug}`,
          fontSize: 16,
          fontFamily: 'system-ui',
          fontWeight: 'regular',
          color: '#475569',
          align: 'left',
          lineHeight: 1.35,
        },
      },
    ],
  };
}

async function runCurrencySettingsGuardrails(page: Page, locale: CommerceTestLocale) {
  const token = `${locale}-${Date.now().toString(36)}`;
  const originalResponse = await page.request.get('/api/builder/commerce/currency-settings?scope=all', {
    headers: mutationHeaders(`commerce-currency-read-original-${token}`),
  });
  expect(originalResponse.status()).toBe(200);
  const originalPayload = await originalResponse.json() as { ok?: boolean; settings?: CommerceCurrencySettingsSummary };
  const originalSettings = originalPayload.settings;

  const copy = locale === 'ko'
    ? {
        policy: '단일 통화 체크아웃은 계속 적용됩니다',
        saved: '통화 설정이 저장되었습니다.',
        rateReady: '미리보기 비율 준비됨',
        heading: '통화 설정',
      }
    : {
        policy: '仍維持單幣別結帳',
        saved: '幣別設定已儲存。',
        rateReady: '預覽匯率已就緒',
        heading: '幣別設定',
      };

  try {
    await page.goto(`/${locale}/admin-builder/commerce/currency?currency=${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-commerce-currency-admin]')).toBeVisible();
    await expect(page.locator('h1')).toContainText(copy.heading);
    await expect(page.locator('[data-commerce-currency-policy]')).toContainText(copy.policy);
    await page.locator('[data-commerce-currency-base]').selectOption('TWD');
    await page.locator('[data-commerce-currency-mode]').selectOption('manual-preview');
    const usdEnabled = page.locator('[data-commerce-currency-enabled="USD"]');
    if (!(await usdEnabled.isChecked())) await usdEnabled.check();
    const usdRate = page.locator('[data-commerce-currency-rate="USD"]');
    await expect(usdRate).toBeEnabled();
    await usdRate.fill('31.25');
    await page.locator('[data-commerce-currency-save]').click();
    await expect(page.locator('[data-commerce-currency-notice]')).toContainText(copy.saved);
    await expect(page.locator('[data-commerce-currency-rate-status="USD"]')).toContainText(copy.rateReady);

    const publicResponse = await page.request.get('/api/builder/commerce/currency-settings');
    expect(publicResponse.status()).toBe(200);
    const publicPayload = await publicResponse.json() as { ok?: boolean; settings?: CommerceCurrencySettingsSummary };
    expect(publicPayload.settings).toMatchObject({
      baseCurrency: 'TWD',
      conversionMode: 'manual-preview',
    });
    expect(publicPayload.settings?.rates.find((rate) => rate.currency === 'USD')).toMatchObject({
      enabled: true,
      rateToBase: 31.25,
    });

    await page.evaluate(({ locale: innerLocale, token: innerToken }: { locale: CommerceTestLocale; token: string }) => {
      window.localStorage.setItem(`tseng-commerce-cart-v1:${innerLocale}`, JSON.stringify({
        version: 1,
        locale: innerLocale,
        currency: 'TWD',
        items: [{
          itemId: `currency-${innerToken}::default`,
          productId: `currency-${innerToken}`,
          productSlug: `currency-${innerToken}`,
          title: `Currency Guardrail ${innerToken}`,
          sku: `CUR-${innerToken}`,
          priceCents: 12500,
          currency: 'TWD',
          quantity: 1,
          maxQuantity: 5,
          optionValues: {},
        }],
        updatedAt: new Date().toISOString(),
      }));
    }, { locale, token });
    await page.goto(`/${locale}/store/checkout`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-commerce-checkout]')).toHaveAttribute('data-commerce-checkout-hydrated', 'true');
    await expect(page.locator('[data-commerce-checkout-conversion-policy]')).toHaveAttribute('data-commerce-checkout-base-currency', 'TWD');
    await expect(page.locator('[data-commerce-checkout-conversion-policy]')).toHaveAttribute('data-commerce-checkout-conversion-mode', 'manual-preview');
    await expect(page.locator('[data-commerce-checkout-conversion-policy]')).toContainText('TWD');
  } finally {
    if (originalSettings) {
      await page.request.patch('/api/builder/commerce/currency-settings', {
        headers: mutationHeaders(`commerce-currency-restore-${token}`),
        data: { settings: originalSettings },
        failOnStatusCode: false,
      });
    }
  }
}

async function runPaymentAnalyticsLocaleShell(page: Page, locale: CommerceTestLocale) {
  const copy = locale === 'ko'
    ? {
        heading: '결제 분석',
        stats: '결제 통계',
        alerts: '알림',
        sourceQuality: '출처 품질',
        sourceFunnel: '출처 퍼널',
        liveReconciliation: '실시간 대사',
        providerFee: '공급자 수수료 대사',
        trend: '추세 차트',
        providerMix: '공급자 구성',
        providerFees: '공급자 수수료',
        exportJson: 'JSON 내보내기',
        exportTrendCsv: '추세 CSV 내보내기',
      }
    : {
        heading: '付款分析',
        stats: '付款統計',
        alerts: '警示',
        sourceQuality: '來源品質',
        sourceFunnel: '來源漏斗',
        liveReconciliation: '即時對帳',
        providerFee: '供應商費用對帳',
        trend: '趨勢圖',
        providerMix: '供應商組合',
        providerFees: '供應商費用',
        exportJson: '匯出 JSON',
        exportTrendCsv: '匯出趨勢 CSV',
      };

  await page.goto(`/${locale}/admin-builder/commerce/payments`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-payment-analytics-page]')).toBeVisible();
  await expect(page.locator('h1')).toContainText(copy.heading);
  await expect(page.locator(`[aria-label="${copy.stats}"]`)).toBeVisible();
  await expect(page.locator('[data-payment-analytics-alerts]')).toContainText(copy.alerts);
  await expect(page.locator('[data-payment-analytics-sources]')).toContainText(copy.sourceQuality);
  await expect(page.locator('[data-payment-analytics-source-funnel]')).toContainText(copy.sourceFunnel);
  await expect(page.locator('[data-payment-analytics-webhook-reconciliation]')).toContainText(copy.liveReconciliation);
  await expect(page.locator('[data-payment-analytics-webhook-fees]')).toContainText(copy.providerFee);
  await expect(page.locator('[data-payment-analytics-trend]')).toContainText(copy.trend);
  await expect(page.locator('[data-payment-analytics-providers]')).toContainText(copy.providerMix);
  await expect(page.locator('[data-payment-analytics-provider-fees]')).toContainText(copy.providerFees);
  await expect(page.locator('[data-payment-analytics-export="json"]')).toHaveText(copy.exportJson);
  await expect(page.locator('[data-payment-analytics-export="csv"]')).toHaveText(copy.exportTrendCsv);
  await expect(page.locator('a[href$="/commerce/products"]')).toBeVisible();
  await expect(page.locator('a[href$="/commerce/orders"]')).toBeVisible();
  await expect(page.locator('a[href$="/commerce/documents"]')).toBeVisible();
}

async function runPaymentWebhooksShellLocale(page: Page, locale: CommerceTestLocale) {
  const copy = locale === 'ko'
    ? {
        heading: '결제 웹훅',
        subtitle: '결제 이벤트, 주문 매칭, 재시도 상태, 마스킹된 payload를 한곳에서 검토합니다.',
        orders: '주문',
        products: '제품',
        currency: '통화',
        tax: '세금 규칙',
        shipping: '배송',
        notifications: '알림',
        refresh: '새로고침',
        search: '이벤트, 참조, 주문, 오류 검색',
        allProviders: '모든 공급자',
        sandboxCard: '샌드박스 카드',
        manualInvoice: '수동 청구서',
        allStatus: '모든 상태',
        ready: '준비됨',
        replay: '재시도',
        hideDetails: '세부 정보 숨기기',
        showMaskedPayload: '마스킹된 payload 보기',
        eventsLabel: '결제 웹훅 이벤트',
      }
    : {
        heading: '付款 Webhook',
        subtitle: '在同一處檢視付款事件、訂單比對、重試狀態與遮罩後的 payload。',
        orders: '訂單',
        products: '產品',
        currency: '幣別',
        tax: '稅務規則',
        shipping: '運送',
        notifications: '通知',
        refresh: '重新整理',
        search: '搜尋事件、參考、訂單、錯誤',
        allProviders: '所有供應商',
        sandboxCard: '沙盒卡片',
        manualInvoice: '手動發票',
        allStatus: '所有狀態',
        ready: '就緒',
        replay: '重播',
        hideDetails: '隱藏詳細資料',
        showMaskedPayload: '顯示已遮罩的 payload',
        eventsLabel: '付款 Webhook 事件',
      };

  await page.goto(`/${locale}/admin-builder/commerce/webhooks`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-commerce-payment-webhooks-admin]')).toBeVisible();
  await expect(page.getByRole('heading', { name: copy.heading })).toBeVisible();
  await expect(page.locator('header')).toContainText(copy.subtitle);
  await expect(page.getByRole('link', { name: copy.orders })).toBeVisible();
  await expect(page.getByRole('link', { name: copy.products })).toBeVisible();
  await expect(page.getByRole('link', { name: copy.currency })).toBeVisible();
  await expect(page.getByRole('link', { name: copy.tax })).toBeVisible();
  await expect(page.getByRole('link', { name: copy.shipping })).toBeVisible();
  await expect(page.getByRole('link', { name: copy.notifications })).toBeVisible();
  await expect(page.getByRole('button', { name: copy.refresh })).toBeVisible();
  await expect(page.locator('[data-payment-webhooks-search]')).toHaveAttribute('placeholder', copy.search);
  await expect(page.locator('[data-payment-webhooks-provider-filter]')).toContainText(copy.allProviders);
  await expect(page.locator('[data-payment-webhooks-provider-filter]')).toContainText(copy.sandboxCard);
  await expect(page.locator('[data-payment-webhooks-provider-filter]')).toContainText(copy.manualInvoice);
  await expect(page.locator('[data-payment-webhooks-status-filter]')).toContainText(copy.allStatus);
  await expect(page.getByRole('status')).toContainText(copy.ready);
  await expect(page.locator(`[aria-label="${copy.eventsLabel}"]`)).toBeVisible();
}

async function installStoreApp(request: APIRequestContext, scope: string) {
  const response = await request.post(`/api/builder/apps/installations?locale=${LOCALE}`, {
    headers: mutationHeaders(scope),
    data: { appId: STORE_APP_ID },
  });
  expect([200, 201]).toContain(response.status());
}

async function uninstallStoreApp(request: APIRequestContext, scope: string) {
  await request.delete(`/api/builder/apps/installations/${STORE_APP_ID}?locale=${LOCALE}`, {
    headers: mutationHeaders(scope),
    failOnStatusCode: false,
  });
}

async function listProductsByToken(request: APIRequestContext, token: string): Promise<CommerceProductSummary[]> {
  const response = await request.get(
    `/api/builder/commerce/products?locale=${LOCALE}&scope=all&status=all&q=${encodeURIComponent(token)}&limit=100`,
    { headers: mutationHeaders(`commerce-products-read-${token}`) },
  );
  expect(response.status()).toBe(200);
  const payload = await response.json() as { ok?: boolean; products?: CommerceProductSummary[]; error?: string };
  expect(payload.ok, payload.error).toBe(true);
  return payload.products ?? [];
}

async function createPublishedGalleryPage(
  request: APIRequestContext,
  slug: string,
  token: string,
  categorySlug: string,
): Promise<string> {
  const createResponse = await request.post('/api/builder/site/pages', {
    headers: mutationHeaders(`commerce-gallery-page-create-${token}`),
    data: {
      locale: LOCALE,
      slug,
      title: `Store Gallery ${token}`,
      document: makeProductGalleryDocument(token, categorySlug),
    },
  });
  expect(createResponse.status()).toBe(200);
  const created = await createResponse.json() as { success?: boolean; pageId?: string; error?: string };
  expect(created.success, created.error).toBe(true);
  expect(created.pageId).toBeTruthy();

  const publishResponse = await request.post(`/api/builder/site/pages/${created.pageId}/publish?locale=${LOCALE}`, {
    headers: mutationHeaders(`commerce-gallery-page-publish-${token}`),
  });
  expect(publishResponse.status()).toBe(200);
  const published = await publishResponse.json() as { ok?: boolean; error?: string };
  expect(published.ok, published.error).toBe(true);

  return created.pageId!;
}

async function cleanupProductsByToken(request: APIRequestContext, token: string) {
  const products = await listProductsByToken(request, token);
  for (const product of products) {
    await request.delete(`/api/builder/commerce/products/${encodeURIComponent(product.productId)}`, {
      headers: mutationHeaders(`commerce-products-delete-${token}-${product.productId}`),
      failOnStatusCode: false,
    });
  }
}

async function createGalleryProduct(
  request: APIRequestContext,
  token: string,
  index: number,
  categorySlug: string,
  priceCents: number,
): Promise<string> {
  const response = await request.post('/api/builder/commerce/products', {
    headers: mutationHeaders(`commerce-gallery-product-create-${token}-${index}`),
    data: {
      locale: LOCALE,
      title: `F57 Gallery Product ${index} ${token}`,
      description: `Product gallery widget test ${index} ${token}`,
      body: `Quick view body for gallery product ${index} ${token}`,
      status: 'active',
      sku: `F57-SKU-${index}-${token}`,
      priceCents,
      currency: 'TWD',
      inventory: {
        trackInventory: true,
        quantity: index,
        lowStockThreshold: 1,
        allowBackorder: false,
      },
      media: [
        {
          mediaId: `f57-media-${index}-${token}`,
          type: 'image',
          url: index % 2 === 0
            ? '/images/004-taiwan-employment-contract-guide/featured-01.jpg'
            : '/images/001-taiwan-company-establishment-basics/featured-01.jpg',
          alt: `F57 product ${index}`,
          sortOrder: 1,
        },
      ],
      options: [{ optionId: 'format', name: 'Format', values: ['PDF', 'Consultation'] }],
      variants: [],
      categoryIds: [categorySlug],
      tags: ['f57', token],
      seo: {},
    },
  });
  expect(response.status()).toBe(201);
  const payload = await response.json() as { ok?: boolean; product?: { productId: string }; error?: string };
  expect(payload.ok, payload.error).toBe(true);
  expect(payload.product?.productId).toBeTruthy();
  return payload.product!.productId;
}

async function createPdpProduct(
  request: APIRequestContext,
  token: string,
  options: { slug: string; title: string; sku: string; status?: 'active' | 'draft'; categorySlug: string; related?: boolean },
): Promise<string> {
  const response = await request.post('/api/builder/commerce/products', {
    headers: mutationHeaders(`commerce-pdp-product-create-${token}-${options.slug}`),
    data: {
      locale: LOCALE,
      title: options.title,
      slug: options.slug,
      description: options.related
        ? `Related PDP product ${token}`
        : `Variant-rich PDP product ${token}`,
      body: options.related
        ? `Related product body ${token}`
        : `Detailed PDP body for gallery, variants, quantity, availability, and SEO ${token}`,
      status: options.status ?? 'active',
      sku: options.sku,
      priceCents: options.related ? 24000 : 12000,
      compareAtPriceCents: options.related ? undefined : 18000,
      currency: 'TWD',
      inventory: {
        trackInventory: true,
        quantity: options.related ? 4 : 0,
        lowStockThreshold: 1,
        allowBackorder: false,
      },
      media: options.related
        ? [
            {
              mediaId: `f58-related-media-${token}`,
              type: 'image',
              url: '/images/004-taiwan-employment-contract-guide/featured-01.jpg',
              alt: `F58 related product ${token}`,
              sortOrder: 1,
            },
          ]
        : [
            {
              mediaId: `f58-media-pdf-${token}`,
              type: 'image',
              url: '/images/001-taiwan-company-establishment-basics/featured-01.jpg',
              alt: `F58 PDP PDF ${token}`,
              sortOrder: 1,
            },
            {
              mediaId: `f58-media-consult-${token}`,
              type: 'image',
              url: '/images/001-taiwan-company-establishment-basics/img-01.jpg',
              alt: `F58 PDP consultation ${token}`,
              sortOrder: 2,
            },
          ],
      options: options.related
        ? []
        : [
            { optionId: 'format', name: 'Format', values: ['PDF', 'Consultation'] },
            { optionId: 'region', name: 'Region', values: ['Taipei', 'Kaohsiung'] },
          ],
      variants: options.related
        ? []
        : [
            {
              variantId: `f58-pdf-taipei-${token}`,
              title: 'PDF Taipei',
              sku: `${options.sku}-PDF-TP`,
              optionValues: { Format: 'PDF', Region: 'Taipei' },
              priceCents: 12000,
              compareAtPriceCents: 18000,
              inventory: { trackInventory: true, quantity: 0, lowStockThreshold: 1, allowBackorder: false },
              mediaId: `f58-media-pdf-${token}`,
              status: 'active',
            },
            {
              variantId: `f58-pdf-kaohsiung-${token}`,
              title: 'PDF Kaohsiung',
              sku: `${options.sku}-PDF-KH`,
              optionValues: { Format: 'PDF', Region: 'Kaohsiung' },
              priceCents: 18000,
              inventory: { trackInventory: true, quantity: 1, lowStockThreshold: 1, allowBackorder: false },
              mediaId: `f58-media-pdf-${token}`,
              status: 'active',
            },
            {
              variantId: `f58-consult-taipei-${token}`,
              title: 'Consultation Taipei',
              sku: `${options.sku}-CONSULT-TP`,
              optionValues: { Format: 'Consultation', Region: 'Taipei' },
              priceCents: 34000,
              inventory: { trackInventory: true, quantity: 3, lowStockThreshold: 1, allowBackorder: false },
              mediaId: `f58-media-consult-${token}`,
              status: 'active',
            },
            {
              variantId: `f58-consult-kaohsiung-${token}`,
              title: 'Consultation Kaohsiung',
              sku: `${options.sku}-CONSULT-KH`,
              optionValues: { Format: 'Consultation', Region: 'Kaohsiung' },
              priceCents: 36000,
              inventory: { trackInventory: true, quantity: 0, lowStockThreshold: 1, allowBackorder: true },
              mediaId: `f58-media-consult-${token}`,
              status: 'active',
            },
          ],
      categoryIds: [options.categorySlug],
      tags: ['f58', token],
      seo: options.related
        ? {}
        : {
            title: `F58 SEO ${token}`,
            description: `F58 SEO description ${token}`,
          },
    },
  });
  expect(response.status()).toBe(201);
  const payload = await response.json() as { ok?: boolean; product?: { productId: string }; error?: string };
  expect(payload.ok, payload.error).toBe(true);
  expect(payload.product?.productId).toBeTruthy();
  return payload.product!.productId;
}

async function createTaxCheckoutProduct(
  request: APIRequestContext,
  token: string,
): Promise<{ productId: string; slug: string; sku: string }> {
  const slug = `f64-tax-${token}`;
  const sku = `F64-TAX-${token}`;
  const response = await request.post('/api/builder/commerce/products', {
    headers: mutationHeaders(`commerce-tax-product-create-${token}`),
    data: {
      locale: LOCALE,
      title: `F64 Tax Product ${token}`,
      slug,
      description: `Tax rule checkout product ${token}`,
      body: `Tax rule checkout body ${token}`,
      status: 'active',
      sku,
      priceCents: 10000,
      currency: 'TWD',
      inventory: {
        trackInventory: true,
        quantity: 5,
        lowStockThreshold: 1,
        allowBackorder: false,
      },
      media: [],
      options: [],
      variants: [],
      categoryIds: ['tax-rules'],
      tags: ['f64', token],
      seo: {},
    },
  });
  expect(response.status()).toBe(201);
  const payload = await response.json() as { ok?: boolean; product?: { productId: string }; error?: string };
  expect(payload.ok, payload.error).toBe(true);
  expect(payload.product?.productId).toBeTruthy();
  return { productId: payload.product!.productId, slug, sku };
}

async function runProductManagerShellLocale(page: Page, locale: CommerceTestLocale) {
  const copy = locale === 'ko'
    ? {
        heading: '제품',
        subtitle: '제품, 가격, 재고, 변형, 스토어 노출을 관리합니다.',
        addProduct: '제품 추가',
        exportCsv: 'CSV 내보내기',
        stats: '제품 통계',
        search: '제목, SKU, 태그, 카테고리 검색',
        productsList: '제품 목록',
        noProducts: '아직 제품이 없습니다',
        importExport: '가져오기 / 내보내기 CSV',
        seoTitle: 'SEO 제목',
        seoDescription: 'SEO 설명',
        trackInventory: '재고 추적',
        allowBackorder: '예약 판매',
        exportFiltered: '필터된 항목 내보내기',
        importCsvButton: 'CSV 가져오기',
        removeVariant: '변형 삭제',
        optionName: '이름',
        optionValues: '값',
        optionNamePlaceholder: '형식',
        optionValuesPlaceholder: 'PDF, 상담',
        variantOptionValuesPlaceholder: '형식=PDF',
        importPlaceholder: '제목,SKU,가격,통화,상태,수량,카테고리,태그,설명',
        edit: '편집',
        duplicate: '복제',
        archive: '보관',
      }
    : {
        heading: '產品',
        subtitle: '管理產品、定價、庫存、變體與商店可見性。',
        addProduct: '新增產品',
        exportCsv: '匯出 CSV',
        stats: '產品統計',
        search: '搜尋標題、SKU、標籤、類別',
        productsList: '產品列表',
        noProducts: '目前沒有產品',
        importExport: '匯入 / 匯出 CSV',
        seoTitle: 'SEO 標題',
        seoDescription: 'SEO 描述',
        trackInventory: '追蹤庫存',
        allowBackorder: '預購',
        exportFiltered: '匯出已篩選項目',
        importCsvButton: '匯入 CSV',
        removeVariant: '刪除變體',
        optionName: '名稱',
        optionValues: '值',
        optionNamePlaceholder: '格式',
        optionValuesPlaceholder: 'PDF, 諮詢',
        variantOptionValuesPlaceholder: '格式=PDF',
        importPlaceholder: '標題,SKU,價格,幣別,狀態,數量,類別,標籤,描述',
        edit: '編輯',
        duplicate: '複製',
        archive: '封存',
      };

  await page.goto(`/${locale}/admin-builder/commerce/products`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-commerce-products-admin]')).toBeVisible();
  await expect(page.locator('h1')).toContainText(copy.heading);
  await expect(page.locator('header')).toContainText(copy.subtitle);
  await expect(page.locator('header [data-commerce-add-product]').first()).toHaveText(copy.addProduct);
  await expect(page.locator('[data-commerce-product-export="header"]')).toHaveText(copy.exportCsv);
  await expect(page.locator('[aria-label="Products list"], [aria-label="제품 목록"], [aria-label="產品列表"]')).toHaveAttribute('aria-label', copy.productsList);
  await expect(page.locator('[data-commerce-products-search]')).toHaveAttribute('placeholder', copy.search);
  await expect(page.locator('[data-commerce-products-kpi="total"]')).toBeVisible();
  await expect(page.getByRole('heading', { name: copy.importExport })).toBeVisible();
  await expect(page.getByLabel(copy.seoTitle)).toBeVisible();
  await expect(page.getByLabel(copy.seoDescription)).toBeVisible();
  await expect(page.getByRole('checkbox', { name: copy.trackInventory })).toBeVisible();
  await expect(page.locator('[data-commerce-product-allow-backorder]')).toBeVisible();
  await expect(page.locator('[data-commerce-product-export="filtered"]')).toHaveText(copy.exportFiltered);
  await expect(page.locator('[data-commerce-product-import]')).toHaveText(copy.importCsvButton);
  await expect(page.locator('[data-commerce-product-variant-remove]')).toHaveText(copy.removeVariant);
  await expect(page.locator('[data-commerce-product-import-text]')).toHaveAttribute('placeholder', copy.importPlaceholder);
  await page.locator('[data-commerce-product-option-add]').click();
  await expect(page.locator('[data-commerce-product-option-row] input[placeholder]').first()).toHaveAttribute('placeholder', copy.optionNamePlaceholder);
  await expect(page.locator('[data-commerce-product-option-row] input[placeholder]').nth(1)).toHaveAttribute('placeholder', copy.optionValuesPlaceholder);
  await expect(page.locator('[data-commerce-product-variant-option-values]').first()).toHaveAttribute('placeholder', copy.variantOptionValuesPlaceholder);
}

test('/ko/admin-builder/commerce/products localizes shell labels', async ({ page }) => {
  await runProductManagerShellLocale(page, 'ko');
});

test('/zh-hant/admin-builder/commerce/products localizes shell labels', async ({ page }) => {
  await runProductManagerShellLocale(page, 'zh-hant');
});

test('/ko/admin-builder/commerce/webhooks localizes shell labels', async ({ page }) => {
  await runPaymentWebhooksShellLocale(page, 'ko');
});

test('/zh-hant/admin-builder/commerce/webhooks localizes shell labels', async ({ page }) => {
  await runPaymentWebhooksShellLocale(page, 'zh-hant');
});

test('/ko/admin-builder/commerce manages native store products end to end', async ({ page }) => {
  const token = Date.now().toString(36);
  const title = `F54 Product ${token}`;
  const sku = `F54-SKU-${token}`;
  const importTitle = `F54 Import ${token}`;
  const importSku = `F54-IMPORT-${token}`;

  await cleanupProductsByToken(page.request, token);

  try {
    await page.goto(`/${LOCALE}/admin-builder/commerce/products?commerceProducts=${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-commerce-products-admin]')).toBeVisible();
    await expect(page.locator('[data-commerce-products-kpi="total"]')).toBeVisible();
    await expect(page.locator('[data-commerce-product-editor]')).toBeVisible();

    await page.locator('[data-commerce-product-title]').fill(title);
    await page.locator('[data-commerce-product-description]').fill(`Taiwan commerce product manager test ${token}`);
    await page.locator('[data-commerce-product-status-input]').selectOption('active');
    await page.locator('[data-commerce-product-sku]').fill(sku);
    await page.locator('[data-commerce-product-price]').fill('1234');
    await page.locator('[data-commerce-product-quantity]').fill('2');
    await page.locator('[data-commerce-product-low-stock]').fill('3');
    await page.locator('[data-commerce-product-categories]').fill(`f54, commerce-${token}`);
    const firstVariant = page.locator('[data-commerce-product-variant-row="0"]');
    await firstVariant.locator('[data-commerce-product-variant-title]').fill('Digital');
    await firstVariant.locator('[data-commerce-product-variant-sku]').fill(`${sku}-PDF`);
    await firstVariant.locator('[data-commerce-product-variant-price]').fill('1500');
    await firstVariant.locator('[data-commerce-product-variant-quantity]').fill('1');
    await firstVariant.locator('[data-commerce-product-variant-low-stock]').fill('3');
    await page.locator('[data-commerce-product-save]').click();
    await expect(page.getByRole('status')).toContainText('Product saved');

    await page.locator('[data-commerce-products-search]').fill(sku);
    const createdRow = page.locator('[data-commerce-product-row]').filter({ hasText: sku }).first();
    await expect(createdRow).toBeVisible();
    await expect(createdRow).toHaveAttribute('data-commerce-product-status', 'active');
    await expect(createdRow).toHaveAttribute('data-commerce-product-inventory-state', 'low-stock');
    const createdId = await createdRow.getAttribute('data-commerce-product-row');
    expect(createdId).toBeTruthy();

    await createdRow.locator('[data-commerce-product-action="duplicate"]').click();
    await expect(page.getByRole('status')).toContainText('Copy created as draft');
    await page.locator('[data-commerce-products-status-filter]').selectOption('draft');
    const copyRow = page.locator('[data-commerce-product-row]').filter({ hasText: `${title} Copy` }).first();
    await expect(copyRow).toBeVisible();
    await expect(copyRow).toHaveAttribute('data-commerce-product-status', 'draft');

    await page.locator('[data-commerce-products-status-filter]').selectOption('active');
    await page.locator('[data-commerce-products-search]').fill(sku);
    const activeRow = page.locator('[data-commerce-product-row]').filter({ hasText: sku }).first();
    await activeRow.locator(`[data-commerce-product-select="${createdId}"]`).check();
    await expect(page.locator('[data-commerce-products-bulk-bar]')).toBeVisible();
    await page.locator('[data-commerce-products-bulk-bar]').getByRole('button', { name: '보관' }).click();
    await expect(page.getByRole('status')).toContainText('products updated');

    await page.locator('[data-commerce-products-status-filter]').selectOption('archived');
    await page.locator('[data-commerce-products-search]').fill(sku);
    const archivedRow = page.locator('[data-commerce-product-row]').filter({ hasText: sku }).first();
    await expect(archivedRow).toBeVisible();
    await expect(archivedRow).toHaveAttribute('data-commerce-product-status', 'archived');

    await page.locator('[data-commerce-product-export="filtered"]').click();
    await expect(page.locator('[data-commerce-product-import-text]')).toHaveValue(new RegExp(sku));

    await page.locator('[data-commerce-product-import-text]').fill([
      'title,sku,price,currency,status,quantity,categories,tags,description',
      `${importTitle},${importSku},45,TWD,active,7,imports;f54,tag-${token},Imported product ${token}`,
    ].join('\n'));
    await page.locator('[data-commerce-product-import]').click();
    await expect(page.getByRole('status')).toContainText('Imported 1; skipped 0');

    await page.locator('[data-commerce-products-status-filter]').selectOption('active');
    await page.locator('[data-commerce-products-search]').fill(importSku);
    const importedRow = page.locator('[data-commerce-product-row]').filter({ hasText: importSku }).first();
    await expect(importedRow).toBeVisible();
    await expect(importedRow).toHaveAttribute('data-commerce-product-status', 'active');

    await page.setViewportSize({ width: 375, height: 900 });
    await page.locator('[data-commerce-products-search]').fill(token);
    await expect(page.locator('[data-commerce-product-card]').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  } finally {
    await cleanupProductsByToken(page.request, token);
  }
});

test('/ko/admin-builder/commerce/payment-intents exposes provider intents, captures, and failures', async ({ page }) => {
  const token = Date.now().toString(36);
  const anonymous = await playwrightRequest.newContext({
    baseURL: process.env.BASE_URL ?? 'http://127.0.0.1:3000',
    extraHTTPHeaders: {
      authorization: `Basic ${Buffer.from('not-admin:wrong-password').toString('base64')}`,
    },
  });
  try {
    const anonymousResponse = await anonymous.post('/api/builder/commerce/payment-intents', {
      data: {
        provider: 'sandbox-card',
        locale: LOCALE,
        currency: 'TWD',
        amountCents: 12345,
      },
    });
    expect(anonymousResponse.status()).toBe(401);
  } finally {
    await anonymous.dispose();
  }

  const csrfResponse = await page.request.post('/api/builder/commerce/payment-intents', {
    headers: {
      ...mutationHeaders(`commerce-payment-csrf-${token}`),
      origin: 'https://evil.example',
    },
    data: {
      provider: 'sandbox-card',
      locale: LOCALE,
      currency: 'TWD',
      amountCents: 12345,
    },
  });
  expect(csrfResponse.status()).toBe(403);

  const createResponse = await page.request.post('/api/builder/commerce/payment-intents', {
    headers: mutationHeaders(`commerce-payment-create-${token}`),
    data: {
      provider: 'sandbox-card',
      locale: LOCALE,
      currency: 'TWD',
      amountCents: 12345,
    },
  });
  expect(createResponse.status()).toBe(200);
  const created = await createResponse.json() as {
    ok?: boolean;
    paymentStatus?: string;
    intent?: { intentId: string; provider: string; status: string; amountCents: number; clientSecret?: string };
  };
  expect(created).toMatchObject({
    ok: true,
    paymentStatus: 'authorized_stub',
    intent: {
      provider: 'sandbox-card',
      status: 'authorized',
      amountCents: 12345,
    },
  });
  expect(created.intent?.clientSecret).toContain('_secret');

  const captureResponse = await page.request.post('/api/builder/commerce/payment-intents', {
    headers: mutationHeaders(`commerce-payment-capture-${token}`),
    data: {
      action: 'capture',
      paymentIntent: created.intent,
    },
  });
  expect(captureResponse.status()).toBe(200);
  await expect(captureResponse.json()).resolves.toMatchObject({
    ok: true,
    paymentStatus: 'paid',
    intent: { status: 'captured' },
  });

  const failedResponse = await page.request.post('/api/builder/commerce/payment-intents', {
    headers: mutationHeaders(`commerce-payment-failed-${token}`),
    data: {
      provider: 'sandbox-card',
      locale: LOCALE,
      currency: 'TWD',
      amountCents: 12345,
      simulateFailure: true,
    },
  });
  expect(failedResponse.status()).toBe(200);
  await expect(failedResponse.json()).resolves.toMatchObject({
    ok: true,
    paymentStatus: 'failed',
    intent: { status: 'failed', failureCode: 'sandbox_card_declined' },
  });

  const manualResponse = await page.request.post('/api/builder/commerce/payment-intents', {
    headers: mutationHeaders(`commerce-payment-manual-${token}`),
    data: {
      provider: 'manual-invoice',
      locale: LOCALE,
      currency: 'TWD',
      amountCents: 12345,
    },
  });
  expect(manualResponse.status()).toBe(200);
  await expect(manualResponse.json()).resolves.toMatchObject({
    ok: true,
    paymentStatus: 'requires_manual_payment',
    intent: { provider: 'manual-invoice', status: 'requires_manual_payment' },
  });
});

test('/api/builder/commerce/orders DELETE rejects cross-origin admin mutations', async ({ page }) => {
  const token = Date.now().toString(36);
  const anonymous = await playwrightRequest.newContext({
    baseURL: process.env.BASE_URL ?? 'http://127.0.0.1:3000',
    extraHTTPHeaders: {
      authorization: `Basic ${Buffer.from('not-admin:wrong-password').toString('base64')}`,
    },
  });
  try {
    const anonymousResponse = await anonymous.delete(`/api/builder/commerce/orders/missing-delete-guard-${token}`);
    expect(anonymousResponse.status()).toBe(401);
  } finally {
    await anonymous.dispose();
  }

  const csrfResponse = await page.request.delete(`/api/builder/commerce/orders/missing-delete-guard-${token}`, {
    headers: {
      ...mutationHeaders(`commerce-order-delete-csrf-${token}`),
      origin: 'https://evil.example',
    },
  });
  expect(csrfResponse.status()).toBe(403);

  const localResponse = await page.request.delete(`/api/builder/commerce/orders/missing-delete-guard-${token}`, {
    headers: mutationHeaders(`commerce-order-delete-local-${token}`),
  });
  expect(localResponse.status()).toBe(200);
  await expect(localResponse.json()).resolves.toMatchObject({
    ok: true,
    deleted: false,
  });
});

test('/ko/admin-builder/commerce/webhooks reviews and replays signed payment events', async ({ page }) => {
  const token = Date.now().toString(36);
  const secret = process.env.COMMERCE_SANDBOX_CARD_WEBHOOK_SECRET
    ?? process.env.COMMERCE_PAYMENT_WEBHOOK_SECRET
    ?? 'local-commerce-webhook-secret';
  const raw = JSON.stringify({
    id: `evt-pw-${token}`,
    type: 'payment_intent.succeeded',
    data: {
      object: {
        id: `pi-pw-${token}-long-reference-${'x'.repeat(48)}`,
        amount: 12345,
        currency: 'twd',
        card: { last4: '4242', brand: 'visa' },
      },
    },
  });
  const response = await page.request.post('/api/builder/commerce/payment-webhooks/sandbox-card', {
    headers: {
      ...mutationHeaders(`commerce-payment-webhook-${token}`),
      'content-type': 'application/json',
      'commerce-signature': webhookSignature(secret, raw),
    },
    data: raw,
  });
  expect(response.status()).toBe(200);
  await expect(response.json()).resolves.toMatchObject({
    ok: true,
    event: { status: 'unmatched', providerEventId: `evt-pw-${token}` },
  });

  await page.goto(`/${LOCALE}/admin-builder/commerce/webhooks?paymentWebhook=${token}`, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-payment-webhooks-search]').fill(token);
  const row = page.locator('[data-payment-webhook-row]').filter({ hasText: `evt-pw-${token}` }).first();
  await expect(row).toBeVisible();
  await expect(row).toHaveAttribute('data-payment-webhook-status', 'unmatched');
  await expect(page.locator('[data-payment-webhooks-kpi="unmatched"] strong')).not.toHaveText('0');

  await row.locator('[data-payment-webhook-toggle-detail]').click();
  await expect(row.locator('pre')).toContainText('[masked]');

  await row.locator('[data-payment-webhook-replay]').click();
  await expect(page.getByRole('status')).toContainText(/order_not_found|주문을 찾을 수 없음/);
  await expect(row).toContainText('재시도 횟수 1');

  await page.setViewportSize({ width: 375, height: 900 });
  await expect(row).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});

test('/ko/admin-builder/commerce/tax configures checkout tax rules and order visibility', async ({ page }) => {
  const token = Date.now().toString(36);
  const originalResponse = await page.request.get(`/api/builder/commerce/tax-rules?locale=${LOCALE}&scope=all`, {
    headers: mutationHeaders(`commerce-tax-read-original-${token}`),
  });
  expect(originalResponse.status()).toBe(200);
  const originalPayload = await originalResponse.json() as { ok?: boolean; rules?: CommerceTaxRuleSummary[] };
  const originalRules = originalPayload.rules ?? [];

  await cleanupProductsByToken(page.request, token);

  try {
    await page.goto(`/${LOCALE}/admin-builder/commerce/tax?tax=${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-commerce-tax-admin]')).toBeVisible();
    const twRule = page.locator('[data-commerce-tax-rule-row="tax-tw"]');
    await expect(twRule).toBeVisible();
    await page.locator('[data-commerce-tax-label="tax-tw"]').fill(`Taiwan VAT ${token}`);
    await page.locator('[data-commerce-tax-rate="tax-tw"]').fill('800');
    await page.locator('[data-commerce-tax-priority="tax-tw"]').fill('200');
    await page.locator('[data-commerce-tax-save]').click();
    await expect(page.locator('[data-commerce-tax-notice]')).toContainText('Tax rules saved');
    await expect(page.locator('[data-commerce-tax-rate-preview="tax-tw"]')).toContainText('8.00%');

    const publicRulesResponse = await page.request.get(`/api/builder/commerce/tax-rules?locale=${LOCALE}`);
    expect(publicRulesResponse.status()).toBe(200);
    const publicRules = await publicRulesResponse.json() as { ok?: boolean; rules?: CommerceTaxRuleSummary[] };
    expect(publicRules.rules?.find((rule) => rule.ruleId === 'tax-tw')).toMatchObject({
      label: `Taiwan VAT ${token}`,
      rateBps: 800,
    });

    const product = await createTaxCheckoutProduct(page.request, token);
    await page.goto(`/${LOCALE}/store`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(({ locale, productId, slug, sku }) => {
      window.localStorage.setItem(`tseng-commerce-cart-v1:${locale}`, JSON.stringify({
        version: 1,
        locale,
        currency: 'TWD',
        items: [{
          itemId: `${productId}::default`,
          productId,
          productSlug: slug,
          title: `F64 Tax Product ${sku}`,
          sku,
          priceCents: 10000,
          currency: 'TWD',
          quantity: 1,
          maxQuantity: 5,
          optionValues: {},
        }],
        updatedAt: new Date().toISOString(),
      }));
    }, { locale: LOCALE, productId: product.productId, slug: product.slug, sku: product.sku });

    await page.goto(`/${LOCALE}/store/checkout`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-commerce-checkout]')).toHaveAttribute('data-commerce-checkout-hydrated', 'true');
    await expect(page.locator('[data-commerce-checkout-tax]')).toHaveAttribute('data-commerce-checkout-tax-rule-id', 'tax-tw');
    await expect(page.locator('[data-commerce-checkout-tax]')).toContainText('18');
    await expect(page.locator('[data-commerce-checkout-total]')).toContainText('238');

    await page.locator('[data-commerce-checkout-name]').fill(`F64 Customer ${token}`);
    await page.locator('[data-commerce-checkout-email]').fill(`f64-${token}@example.com`);
    await page.locator('[data-commerce-checkout-phone]').fill('0912-345-678');
    await page.locator('[data-commerce-checkout-address-1]').fill('No. 64 Tax Road');
    await page.locator('[data-commerce-checkout-submit]').click();
    await expect(page.locator('[data-commerce-checkout-confirmation]')).toBeVisible();

    const storedConfirmation = await page.evaluate((locale) => {
      const raw = window.localStorage.getItem(`tseng-commerce-checkout-confirmation-v1:${locale}`);
      return raw ? JSON.parse(raw) as { orderId?: string } : null;
    }, LOCALE);
    expect(storedConfirmation?.orderId).toBeTruthy();

    await page.goto(`/${LOCALE}/admin-builder/commerce/orders?tax=${token}`, { waitUntil: 'domcontentloaded' });
    await page.locator('[data-commerce-orders-search]').fill(`f64-${token}@example.com`);
    const orderRow = page.locator(`[data-commerce-order-row="${storedConfirmation!.orderId}"]`);
    await expect(orderRow).toBeVisible();
    await expect(orderRow.locator('[data-commerce-order-tax]')).toContainText(`Taiwan VAT ${token}`);
    await expect(orderRow.locator('[data-commerce-order-tax]')).toContainText('8.00%');
    await expect(orderRow.locator('[data-commerce-order-tax]')).toContainText('18');
  } finally {
    if (originalRules.length > 0) {
      await page.request.patch('/api/builder/commerce/tax-rules', {
        headers: mutationHeaders(`commerce-tax-restore-${token}`),
        data: { rules: originalRules },
        failOnStatusCode: false,
      });
    }
    await cleanupProductsByToken(page.request, token);
  }
});

test('/ko/admin-builder/commerce/shipping configures delivery, pickup, and free shipping', async ({ page }) => {
  const token = Date.now().toString(36);
  const originalResponse = await page.request.get(`/api/builder/commerce/shipping-rules?locale=${LOCALE}&currency=TWD&scope=all`, {
    headers: mutationHeaders(`commerce-shipping-read-original-${token}`),
  });
  expect(originalResponse.status()).toBe(200);
  const originalPayload = await originalResponse.json() as { ok?: boolean; rules?: CommerceShippingRuleSummary[] };
  const originalRules = originalPayload.rules ?? [];

  await cleanupProductsByToken(page.request, token);

  try {
    await page.goto(`/${LOCALE}/admin-builder/commerce/shipping?shipping=${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-commerce-shipping-admin]')).toBeVisible();
    const standardRule = page.locator('[data-commerce-shipping-rule-row="ship-standard-twd"]');
    await expect(standardRule).toBeVisible();
    await page.locator('[data-commerce-shipping-label="ship-standard-twd"]').fill(`Standard Shipping ${token}`);
    await page.locator('[data-commerce-shipping-amount="ship-standard-twd"]').fill('150');
    await page.locator('[data-commerce-shipping-free="ship-standard-twd"]').fill('100');
    await page.locator('[data-commerce-shipping-save]').click();
    await expect(page.locator('[data-commerce-shipping-notice]')).toContainText('Shipping rules saved');

    const publicRulesResponse = await page.request.get(`/api/builder/commerce/shipping-rules?locale=${LOCALE}&currency=TWD`);
    expect(publicRulesResponse.status()).toBe(200);
    const publicRules = await publicRulesResponse.json() as { ok?: boolean; rules?: CommerceShippingRuleSummary[] };
    expect(publicRules.rules?.find((rule) => rule.ruleId === 'ship-standard-twd')).toMatchObject({
      label: `Standard Shipping ${token}`,
      amountCents: 15000,
      freeShippingMinSubtotalCents: 10000,
    });

    const product = await createTaxCheckoutProduct(page.request, token);
    await page.goto(`/${LOCALE}/store`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(({ locale, productId, slug, sku }) => {
      window.localStorage.setItem(`tseng-commerce-cart-v1:${locale}`, JSON.stringify({
        version: 1,
        locale,
        currency: 'TWD',
        items: [{
          itemId: `${productId}::default`,
          productId,
          productSlug: slug,
          title: `F65 Shipping Product ${sku}`,
          sku,
          priceCents: 10000,
          currency: 'TWD',
          quantity: 1,
          maxQuantity: 5,
          optionValues: {},
        }],
        updatedAt: new Date().toISOString(),
      }));
    }, { locale: LOCALE, productId: product.productId, slug: product.slug, sku: product.sku });

    await page.goto(`/${LOCALE}/store/checkout`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-commerce-checkout]')).toHaveAttribute('data-commerce-checkout-hydrated', 'true');
    await expect(page.locator('[data-commerce-checkout-shipping]')).toHaveAttribute('data-commerce-checkout-shipping-rule-id', 'ship-standard-twd');
    await expect(page.locator('[data-commerce-checkout-shipping]')).toHaveAttribute('data-commerce-checkout-free-shipping', 'true');
    await expect(page.locator('[data-commerce-checkout-shipping]')).toContainText('0');
    await page.locator('[data-commerce-checkout-shipping-method]').selectOption('pickup');
    await expect(page.locator('[data-commerce-checkout-shipping]')).toHaveAttribute('data-commerce-checkout-shipping-rule-id', 'ship-pickup-twd');
    await expect(page.locator('[data-commerce-checkout-shipping]')).toContainText('0');

    await page.locator('[data-commerce-checkout-name]').fill(`F65 Customer ${token}`);
    await page.locator('[data-commerce-checkout-email]').fill(`f65-${token}@example.com`);
    await page.locator('[data-commerce-checkout-phone]').fill('0912-345-678');
    await page.locator('[data-commerce-checkout-address-1]').fill('No. 65 Shipping Road');
    await page.locator('[data-commerce-checkout-submit]').click();
    await expect(page.locator('[data-commerce-checkout-confirmation]')).toBeVisible();

    const storedConfirmation = await page.evaluate((locale) => {
      const raw = window.localStorage.getItem(`tseng-commerce-checkout-confirmation-v1:${locale}`);
      return raw ? JSON.parse(raw) as { orderId?: string } : null;
    }, LOCALE);
    expect(storedConfirmation?.orderId).toBeTruthy();

    await page.goto(`/${LOCALE}/admin-builder/commerce/orders?shipping=${token}`, { waitUntil: 'domcontentloaded' });
    await page.locator('[data-commerce-orders-search]').fill(`f65-${token}@example.com`);
    const orderRow = page.locator(`[data-commerce-order-row="${storedConfirmation!.orderId}"]`);
    await expect(orderRow).toBeVisible();
    await expect(orderRow.locator('[data-commerce-order-shipping]')).toContainText('Office pickup');
    await expect(orderRow.locator('[data-commerce-order-shipping]')).toContainText('0');
  } finally {
    if (originalRules.length > 0) {
      await page.request.patch('/api/builder/commerce/shipping-rules', {
        headers: mutationHeaders(`commerce-shipping-restore-${token}`),
        data: { rules: originalRules },
        failOnStatusCode: false,
      });
    }
    await cleanupProductsByToken(page.request, token);
  }
});

test('/ko/admin-builder/commerce/currency configures conversion preview guardrails', async ({ page }) => {
  await runCurrencySettingsGuardrails(page, 'ko');
});

test('/zh-hant/admin-builder/commerce/currency configures conversion preview guardrails', async ({ page }) => {
  await runCurrencySettingsGuardrails(page, 'zh-hant');
});

test('/ko/admin-builder/commerce/payments localizes analytics shell labels', async ({ page }) => {
  await runPaymentAnalyticsLocaleShell(page, 'ko');
});

test('/zh-hant/admin-builder/commerce/payments localizes analytics shell labels', async ({ page }) => {
  await runPaymentAnalyticsLocaleShell(page, 'zh-hant');
});

test('/ko/admin-builder/commerce/notifications queues cart recovery and order hooks', async ({ page }) => {
  const token = Date.now().toString(36);
  const buyerEmail = `f66-${token}@example.com`;
  const adminEmail = `ops-f66-${token}@example.com`;
  const originalResponse = await page.request.get(`/api/builder/commerce/notifications?locale=${LOCALE}`, {
    headers: mutationHeaders(`commerce-notifications-read-original-${token}`),
  });
  expect(originalResponse.status()).toBe(200);
  const originalPayload = await originalResponse.json() as { ok?: boolean; settings?: CommerceNotificationSettingsSummary };
  const originalSettings = originalPayload.settings;

  await cleanupProductsByToken(page.request, token);

  try {
    await page.goto(`/${LOCALE}/admin-builder/commerce/notifications?notifications=${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-commerce-notifications-admin]')).toBeVisible();
    await page.locator('[data-commerce-notifications-admin-email]').fill(adminEmail);
    await page.locator('[data-commerce-notifications-delay]').fill('15');
    await page.locator('[data-commerce-notifications-payment-rules] summary').click();
    await expect(page.locator('[data-commerce-notifications-payment-received-variables]')).toContainText('amountLabel');
    await expect(page.locator('[data-commerce-notifications-payment-received-manual]')).toBeChecked();
    await page.locator('[data-commerce-notifications-payment-received-manual]').uncheck();
    await page.locator('[data-commerce-notifications-payment-received-suppress-receipt-overlap]').check();
    await page.locator('[data-commerce-notification-template-subject="cart.abandoned.customer"]').fill(`Recover cart ${token}`);
    await page.locator('[data-commerce-notifications-save]').click();
    await expect(page.locator('[data-commerce-notifications-notice]')).toContainText(/Notifications saved|알림이 저장되었습니다/);
    const savedNotificationsResponse = await page.request.get(`/api/builder/commerce/notifications?locale=${LOCALE}`, {
      headers: mutationHeaders(`commerce-notifications-read-saved-${token}`),
    });
    const savedNotifications = await savedNotificationsResponse.json() as { settings?: CommerceNotificationSettingsSummary };
    expect(savedNotifications.settings?.paymentReceived).toMatchObject({
      manualEnabled: false,
      suppressFullSettlementReceiptOverlap: true,
    });

    const product = await createTaxCheckoutProduct(page.request, token);
    await page.goto(`/${LOCALE}/store`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(({ locale, productId, slug, sku }) => {
      window.localStorage.setItem(`tseng-commerce-cart-v1:${locale}`, JSON.stringify({
        version: 1,
        locale,
        currency: 'TWD',
        items: [{
          itemId: `${productId}::default`,
          productId,
          productSlug: slug,
          title: `F66 Notification Product ${sku}`,
          sku,
          priceCents: 10000,
          currency: 'TWD',
          quantity: 1,
          maxQuantity: 5,
          optionValues: {},
        }],
        updatedAt: new Date().toISOString(),
      }));
    }, { locale: LOCALE, productId: product.productId, slug: product.slug, sku: product.sku });

    await page.goto(`/${LOCALE}/store/checkout`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-commerce-checkout]')).toHaveAttribute('data-commerce-checkout-hydrated', 'true');
    await page.locator('[data-commerce-checkout-email]').fill(buyerEmail);
    await page.locator('[data-commerce-checkout-email]').blur();
    await expect(page.locator('[data-commerce-checkout]')).toHaveAttribute('data-commerce-checkout-recovery-state', 'saved');

    await page.goto(`/${LOCALE}/admin-builder/commerce/notifications?recovery=${token}`, { waitUntil: 'domcontentloaded' });
    const recoveryRow = page.locator('[data-commerce-recovery-row]').filter({ hasText: buyerEmail }).first();
    await expect(recoveryRow).toBeVisible();
    await expect(recoveryRow).toHaveAttribute('data-commerce-recovery-status', 'captured');
    const recoveryEvent = page.locator('[data-commerce-notification-event-type="cart.abandoned.customer"]').filter({ hasText: buyerEmail }).first();
    await expect(recoveryEvent).toContainText(`Recover cart ${token}`);

    await page.goto(`/${LOCALE}/store/checkout`, { waitUntil: 'domcontentloaded' });
    await page.locator('[data-commerce-checkout-name]').fill(`F66 Customer ${token}`);
    await page.locator('[data-commerce-checkout-email]').fill(buyerEmail);
    await page.locator('[data-commerce-checkout-phone]').fill('0912-345-678');
    await page.locator('[data-commerce-checkout-address-1]').fill('No. 66 Notification Road');
    await page.locator('[data-commerce-checkout-submit]').click();
    await expect(page.locator('[data-commerce-checkout-confirmation]')).toBeVisible();
    const storedConfirmation = await page.evaluate((locale) => {
      const raw = window.localStorage.getItem(`tseng-commerce-checkout-confirmation-v1:${locale}`);
      return raw ? JSON.parse(raw) as { orderId?: string } : null;
    }, LOCALE);
    expect(storedConfirmation?.orderId).toBeTruthy();

    const updateResponse = await page.request.patch(`/api/builder/commerce/orders/${storedConfirmation!.orderId}`, {
      headers: mutationHeaders(`commerce-notifications-order-update-${token}`),
      data: { fulfillmentStatus: 'processing' },
    });
    expect(updateResponse.status()).toBe(200);

    await page.goto(`/${LOCALE}/admin-builder/commerce/notifications?events=${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-commerce-notification-event-type="order.created.customer"]').filter({ hasText: buyerEmail }).first()).toBeVisible();
    await expect(page.locator('[data-commerce-notification-event-type="order.created.admin"]').filter({ hasText: adminEmail }).first()).toBeVisible();
    await expect(page.locator('[data-commerce-notification-event-type="order.updated.customer"]').filter({ hasText: buyerEmail }).first()).toBeVisible();
    await expect(page.locator('[data-commerce-recovery-row]').filter({ hasText: buyerEmail }).filter({ hasText: storedConfirmation!.orderId }).first()).toHaveAttribute('data-commerce-recovery-status', 'converted');
  } finally {
    if (originalSettings) {
      await page.request.patch('/api/builder/commerce/notifications', {
        headers: mutationHeaders(`commerce-notifications-restore-${token}`),
        data: { settings: originalSettings },
        failOnStatusCode: false,
      });
    }
    await cleanupProductsByToken(page.request, token);
  }
});

test('/ko/store/checkout surfaces single-currency policy and rejects mixed-currency payloads', async ({ page }) => {
  const token = Date.now().toString(36);
  const cart = {
    version: 1,
    locale: LOCALE,
    currency: 'TWD',
    items: [
      {
        itemId: `mixed-twd-${token}`,
        productId: `mixed-twd-${token}`,
        productSlug: `mixed-twd-${token}`,
        title: `Mixed currency TWD ${token}`,
        sku: `MIX-TWD-${token}`,
        priceCents: 10000,
        currency: 'TWD',
        quantity: 1,
        maxQuantity: 1,
        optionValues: {},
      },
      {
        itemId: `mixed-usd-${token}`,
        productId: `mixed-usd-${token}`,
        productSlug: `mixed-usd-${token}`,
        title: `Mixed currency USD ${token}`,
        sku: `MIX-USD-${token}`,
        priceCents: 1000,
        currency: 'USD',
        quantity: 1,
        maxQuantity: 1,
        optionValues: {},
      },
    ],
    updatedAt: new Date().toISOString(),
  };

  await page.goto(`/${LOCALE}/store`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ locale, nextCart }) => {
    window.localStorage.setItem(`tseng-commerce-cart-v1:${locale}`, JSON.stringify(nextCart));
  }, { locale: LOCALE, nextCart: cart });
  await page.goto(`/${LOCALE}/store/checkout`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-commerce-checkout-currency-policy]')).toHaveAttribute('data-commerce-checkout-currency', 'TWD');
  await expect(page.locator('[data-commerce-checkout-currency-policy]')).toContainText('TWD');

  const response = await page.request.post('/api/builder/commerce/checkout', {
    data: {
      locale: LOCALE,
      cart,
      customer: { name: `Mixed Currency ${token}`, email: `mixed-${token}@example.com` },
      shippingAddress: {
        country: 'TW',
        region: 'Taipei',
        city: 'Taipei',
        postalCode: '100',
        addressLine1: 'No. 72 Currency Road',
      },
      shippingMethod: 'standard',
      paymentAdapter: 'manual-invoice',
    },
  });
  expect(response.status()).toBe(400);
  const payload = await response.json() as { errors?: string[] };
  expect(payload.errors).toContain('cart_mixed_currency');
});

test('/ko/admin-builder/commerce supports structured options, variants, images, and availability', async ({ page }) => {
  const token = Date.now().toString(36);
  const title = `F55 Product ${token}`;
  const sku = `F55-SKU-${token}`;
  const variantImage = '/images/001-taiwan-company-establishment-basics/img-01.jpg';

  await cleanupProductsByToken(page.request, token);

  try {
    await page.goto(`/${LOCALE}/admin-builder/commerce/products?commerceVariants=${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-commerce-products-admin]')).toBeVisible();

    await page.locator('[data-commerce-product-title]').fill(title);
    await page.locator('[data-commerce-product-description]').fill(`Structured option and variant test ${token}`);
    await page.locator('[data-commerce-product-status-input]').selectOption('active');
    await page.locator('[data-commerce-product-sku]').fill(sku);
    await page.locator('[data-commerce-product-price]').fill('100');
    await page.locator('[data-commerce-product-quantity]').fill('5');
    await page.locator('[data-commerce-product-low-stock]').fill('2');

    await page.locator('[data-commerce-product-option-add]').click();
    await page.locator('[data-commerce-product-option-name]').nth(0).fill('Format');
    await page.locator('[data-commerce-product-option-values]').nth(0).fill('PDF, Consultation');
    await page.locator('[data-commerce-product-option-add]').click();
    await page.locator('[data-commerce-product-option-name]').nth(1).fill('Region');
    await page.locator('[data-commerce-product-option-values]').nth(1).fill('Taipei, Kaohsiung');
    await page.locator('[data-commerce-product-variants-generate]').click();
    await expect(page.getByRole('status')).toContainText('Generated 4 variants');
    await expect(page.locator('[data-commerce-product-variant-row]')).toHaveCount(4);

    const firstVariant = page.locator('[data-commerce-product-variant-row="0"]');
    await expect(firstVariant.locator('[data-commerce-product-variant-option-values]')).toHaveValue('Format=PDF, Region=Taipei');
    await firstVariant.locator('[data-commerce-product-variant-sku]').fill(`${sku}-PDF-TP`);
    await firstVariant.locator('[data-commerce-product-variant-price]').fill('120');
    await firstVariant.locator('[data-commerce-product-variant-quantity]').fill('0');
    await firstVariant.locator('[data-commerce-product-variant-low-stock]').fill('2');
    await expect(firstVariant).toHaveAttribute('data-commerce-product-variant-availability', 'out-of-stock');
    await firstVariant.locator('[data-commerce-product-variant-media-id]').fill('pdf-taipei');
    await firstVariant.locator('[data-commerce-product-variant-media-url]').fill(variantImage);
    await expect(firstVariant.locator('[data-commerce-product-variant-image]')).toBeVisible();

    const secondVariant = page.locator('[data-commerce-product-variant-row="1"]');
    await secondVariant.locator('[data-commerce-product-variant-sku]').fill(`${sku}-PDF-KH`);
    await secondVariant.locator('[data-commerce-product-variant-quantity]').fill('1');
    await secondVariant.locator('[data-commerce-product-variant-low-stock]').fill('2');
    await expect(secondVariant).toHaveAttribute('data-commerce-product-variant-availability', 'low-stock');

    const thirdVariant = page.locator('[data-commerce-product-variant-row="2"]');
    await thirdVariant.locator('[data-commerce-product-variant-sku]').fill(`${sku}-CONSULT-TP`);
    await thirdVariant.locator('[data-commerce-product-variant-status]').selectOption('disabled');
    await expect(thirdVariant).toHaveAttribute('data-commerce-product-variant-availability', 'disabled');

    const fourthVariant = page.locator('[data-commerce-product-variant-row="3"]');
    await fourthVariant.locator('[data-commerce-product-variant-sku]').fill(`${sku}-CONSULT-KH`);
    await fourthVariant.locator('[data-commerce-product-variant-quantity]').fill('0');
    await fourthVariant.locator('[data-commerce-product-variant-backorder]').check();
    await expect(fourthVariant).toHaveAttribute('data-commerce-product-variant-availability', 'backorder');

    await page.locator('[data-commerce-product-save]').click();
    await expect(page.getByRole('status')).toContainText('Product saved');

    const products = await listProductsByToken(page.request, token);
    const product = products.find((item) => item.sku === sku);
    expect(product).toBeTruthy();
    expect(product?.options).toEqual([
      { optionId: 'format', name: 'Format', values: ['PDF', 'Consultation'] },
      { optionId: 'region', name: 'Region', values: ['Taipei', 'Kaohsiung'] },
    ]);
    expect(product?.variants).toHaveLength(4);
    expect(product?.variants?.[0]).toMatchObject({
      sku: `${sku}-PDF-TP`,
      priceCents: 12000,
      optionValues: { Format: 'PDF', Region: 'Taipei' },
      mediaId: 'pdf-taipei',
      inventory: {
        quantity: 0,
        lowStockThreshold: 2,
        allowBackorder: false,
      },
    });
    expect(product?.variants?.[2]).toMatchObject({ status: 'disabled' });
    expect(product?.variants?.[3]).toMatchObject({
      inventory: expect.objectContaining({ allowBackorder: true, quantity: 0 }),
    });
    expect(product?.media?.some((media) => media.mediaId === 'pdf-taipei' && media.url === variantImage)).toBe(true);

    await page.locator('[data-commerce-products-search]').fill(`${sku}-PDF-TP`);
    const row = page.locator('[data-commerce-product-row]').filter({ hasText: title }).first();
    await expect(row).toBeVisible();
    await expect(row).toContainText(/4 variants|4 변형/);

    await row.locator('[data-commerce-product-action="edit"]').click();
    await expect(page.locator('[data-commerce-product-variant-row]')).toHaveCount(4);
    await expect(page.locator('[data-commerce-product-option-name]').nth(0)).toHaveValue('Format');
    await expect(page.locator('[data-commerce-product-variant-row="0"]').locator('[data-commerce-product-variant-media-url]')).toHaveValue(variantImage);
  } finally {
    await cleanupProductsByToken(page.request, token);
  }
});

test('/ko/store categories drive navigation, galleries, and dynamic URLs', async ({ page }) => {
  const token = Date.now().toString(36);
  const categorySlug = `f56-${token}`;
  const title = `F56 Category Product ${token}`;
  const sku = `F56-SKU-${token}`;

  await cleanupProductsByToken(page.request, token);

  try {
    const createResponse = await page.request.post('/api/builder/commerce/products', {
      headers: mutationHeaders(`commerce-category-create-${token}`),
      data: {
        locale: LOCALE,
        title,
        description: `Category route product ${token}`,
        status: 'active',
        sku,
        priceCents: 8800,
        currency: 'TWD',
        inventory: {
          trackInventory: true,
          quantity: 4,
          lowStockThreshold: 1,
          allowBackorder: false,
        },
        categoryIds: [categorySlug],
        tags: ['f56', token],
      },
    });
    expect(createResponse.status()).toBe(201);

    const categoryResponse = await page.request.get(`/api/builder/commerce/categories?locale=${LOCALE}&scope=public`);
    expect(categoryResponse.status()).toBe(200);
    const categoryPayload = await categoryResponse.json() as {
      ok?: boolean;
      categories?: Array<{ slug: string; productCount: number; name: string }>;
    };
    expect(categoryPayload.ok).toBe(true);
    const category = categoryPayload.categories?.find((item) => item.slug === categorySlug);
    expect(category).toMatchObject({ slug: categorySlug, productCount: 1 });

    await page.goto(`/${LOCALE}/store?storeCategory=${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-commerce-storefront]')).toBeVisible();
    await expect(page.locator('[data-commerce-store-eyebrow]')).toContainText('스토어');
    await expect(page.locator('[data-commerce-category-nav]')).toHaveAttribute('aria-label', '상품 카테고리');
    await expect(page.locator('[data-commerce-category-link="all"]')).toContainText('전체 상품');
    await expect(page.locator(`[data-commerce-category-link="${categorySlug}"]`)).toHaveAttribute(
      'href',
      `/${LOCALE}/store/categories/${categorySlug}`,
    );
    await expect(page.locator('[data-commerce-category-gallery]')).toContainText(title);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);

    await page.goto(`/${LOCALE}/store/categories/${categorySlug}?storeCategory=${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-commerce-storefront]')).toHaveAttribute('data-commerce-category-route', categorySlug);
    await expect(page.locator(`[data-commerce-category-link="${categorySlug}"]`)).toHaveAttribute('aria-current', 'true');
    const card = page.locator('[data-commerce-category-card]').filter({ hasText: sku }).first();
    await expect(card).toContainText(title);
    await expect(card).toContainText('88');

    await page.setViewportSize({ width: 375, height: 900 });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-commerce-category-gallery]')).toContainText(title);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  } finally {
    await cleanupProductsByToken(page.request, token);
  }
});

test('/ko/store/products renders product detail pages with variants, quantity, related products, and SEO', async ({ page }) => {
  const token = Date.now().toString(36);
  const categorySlug = `f58-${token}`;
  const slug = `f58-pdp-${token}`;
  const draftSlug = `f58-draft-${token}`;
  const relatedSlug = `f58-related-${token}`;
  const title = `F58 PDP Product ${token}`;
  const sku = `F58-SKU-${token}`;
  const relatedTitle = `F58 Related Product ${token}`;
  let checkoutOrderId: string | null = null;

  await cleanupProductsByToken(page.request, token);

  try {
    const productId = await createPdpProduct(page.request, token, {
      slug,
      title,
      sku,
      categorySlug,
    });
    await createPdpProduct(page.request, token, {
      slug: relatedSlug,
      title: relatedTitle,
      sku: `F58-RELATED-${token}`,
      categorySlug,
      related: true,
    });
    await createPdpProduct(page.request, token, {
      slug: draftSlug,
      title: `F58 Draft Product ${token}`,
      sku: `F58-DRAFT-${token}`,
      status: 'draft',
      categorySlug,
      related: true,
    });

    const draftResponse = await page.goto(`/${LOCALE}/store/products/${draftSlug}?pdpDraft=${token}`, {
      waitUntil: 'domcontentloaded',
    });
    expect(draftResponse?.status()).toBe(404);

    await page.goto(`/${LOCALE}/store/products/${slug}?pdp=${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-commerce-product-detail]')).toBeVisible();
    await expect(page.locator('[data-commerce-product-detail]')).toHaveAttribute('data-commerce-product-hydrated', 'true');
    await expect(page).toHaveTitle(new RegExp(`F58 SEO ${token}`));
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', `F58 SEO description ${token}`);
    await expect(page.locator('[data-commerce-product-detail]')).toHaveAttribute('data-commerce-product-slug', slug);
    await expect(page.locator('[data-commerce-product-detail]')).toHaveAttribute('data-commerce-product-availability', 'out-of-stock');
    await expect(page.locator('[data-commerce-product-back-link]')).toContainText('스토어로 돌아가기');
    await expect(page.locator('[data-commerce-product-media-main]')).toHaveAttribute(
      'data-commerce-product-media-main',
      `f58-media-pdf-${token}`,
    );
    await expect(page.locator('[data-commerce-product-price]')).toContainText('120');
    await expect(page.locator('[data-commerce-product-sku]')).toContainText(`${sku}-PDF-TP`);
    await expect(page.locator('[data-commerce-product-availability-label]')).toContainText('품절');
    await expect(page.locator('[data-commerce-product-add-to-cart]')).toBeDisabled();
    await expect(page.locator('[data-commerce-product-detail]')).toContainText('스토어로 돌아가기');
    await expect(page.locator('[data-commerce-product-detail]')).toContainText('상세 정보');
    await expect(page.locator('[data-commerce-product-detail]')).toContainText('관련 상품');
    await expect(page.locator('[data-commerce-product-thumbnails]')).toHaveAttribute('aria-label', '상품 썸네일');

    await page.locator(`[data-commerce-product-media-thumb="f58-media-consult-${token}"]`).click();
    await expect(page.locator('[data-commerce-product-media-main]')).toHaveAttribute(
      'data-commerce-product-media-main',
      `f58-media-consult-${token}`,
    );

    await page.locator('[data-commerce-product-option-value="format:Consultation"]').click();
    await expect(page.locator('[data-commerce-product-detail]')).toHaveAttribute('data-commerce-product-availability', 'in-stock');
    await expect(page.locator('[data-commerce-product-price]')).toContainText('340');
    await expect(page.locator('[data-commerce-product-sku]')).toContainText(`${sku}-CONSULT-TP`);
    await expect(page.locator('[data-commerce-product-availability-label]')).toContainText('판매 중');
    await expect(page.locator('[data-commerce-product-quantity]')).toHaveValue('1');
    await expect(page.locator('[data-commerce-product-detail]')).toContainText('옵션');
    await expect(page.locator('[data-commerce-product-detail]')).toContainText('수량');
    await page.locator('[data-commerce-product-quantity-increment]').click();
    await expect(page.locator('[data-commerce-product-quantity]')).toHaveValue('2');
    await expect(page.locator('[data-commerce-product-add-to-cart]')).toBeEnabled();
    await page.locator('[data-commerce-product-add-to-cart]').click();
    await expect(page.locator('[data-commerce-cart-drawer]')).toBeVisible();
    await expect(page.locator('[data-commerce-cart-drawer]')).toHaveAttribute('data-commerce-cart-persisted', 'true');
    await expect(page.locator('[data-commerce-cart-toggle]')).toHaveAttribute('data-commerce-cart-count', '2');
    const cartItem = page.locator('[data-commerce-cart-item]').filter({ hasText: `${sku}-CONSULT-TP` }).first();
    await expect(cartItem).toBeVisible();
    await expect(cartItem.locator('[data-commerce-cart-item-quantity]')).toHaveValue('2');
    await expect(page.locator('[data-commerce-cart-subtotal]')).toContainText('680');
    await expect(page.locator('[data-commerce-cart-total]')).toContainText('680');
    await page.locator('[data-commerce-cart-coupon-input]').fill('save10');
    await page.locator('[data-commerce-cart-coupon-apply]').click();
    await expect(page.locator('[data-commerce-cart-coupon-code]')).toContainText('SAVE10');
    await expect(page.locator('[data-commerce-cart-discount]')).toContainText('68');
    await expect(page.locator('[data-commerce-cart-total]')).toContainText('612');
    expect(await page.evaluate(() => {
      const raw = window.localStorage.getItem('tseng-commerce-cart-v1:ko');
      return raw ? JSON.parse(raw).items?.length : 0;
    })).toBe(1);

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-commerce-cart-toggle]')).toHaveAttribute('data-commerce-cart-count', '2');
    await page.locator('[data-commerce-cart-toggle]').click();
    await expect(page.locator('[data-commerce-cart-drawer]')).toContainText(`${sku}-CONSULT-TP`);
    await expect(page.locator('[data-commerce-cart-coupon-code]')).toContainText('SAVE10');
    const persistedItem = page.locator('[data-commerce-cart-item]').filter({ hasText: `${sku}-CONSULT-TP` }).first();
    await persistedItem.locator('[data-commerce-cart-item-increment]').click();
    await expect(persistedItem.locator('[data-commerce-cart-item-quantity]')).toHaveValue('3');
    await persistedItem.locator('[data-commerce-cart-item-remove]').click();
    await expect(page.locator('[data-commerce-cart-empty]')).toBeVisible();
    await page.locator('[data-commerce-cart-close]').click();

    await page.locator('[data-commerce-product-option-value="format:Consultation"]').click();
    await page.locator('[data-commerce-product-quantity-increment]').click();
    await page.locator('[data-commerce-product-add-to-cart]').click();
    await expect(page.locator('[data-commerce-cart-toggle]')).toHaveAttribute('data-commerce-cart-count', '2');
    await expect(page.locator('[data-commerce-cart-checkout]')).toHaveAttribute('data-commerce-cart-checkout-ready', 'true');
    await page.locator('[data-commerce-cart-checkout]').click();
    await expect(page.locator('[data-commerce-checkout]')).toHaveAttribute('data-commerce-checkout-hydrated', 'true');
    await expect(page.locator('[data-commerce-checkout-line]')).toContainText(`${sku}-CONSULT-TP`);
    await expect(page.locator('[data-commerce-checkout-subtotal]')).toContainText('680');
    await expect(page.locator('[data-commerce-checkout-discount]')).toContainText('68');
    await page.locator('[data-commerce-checkout-name]').fill(`F60 Customer ${token}`);
    await page.locator('[data-commerce-checkout-email]').fill(`f60-${token}@example.com`);
    await page.locator('[data-commerce-checkout-phone]').fill('0912-345-678');
    await page.locator('[data-commerce-checkout-address-1]').fill('No. 1 Commerce Road');
    await page.locator('[data-commerce-checkout-shipping-method]').selectOption('express');
    await expect(page.locator('[data-commerce-checkout-shipping]')).toContainText('280');
    await expect(page.locator('[data-commerce-checkout-tax]')).toContainText('45');
    await expect(page.locator('[data-commerce-checkout-total]')).toContainText('937');
    await page.locator('[data-commerce-checkout-payment-adapter]').selectOption('sandbox-card');
    await page.locator('[data-commerce-checkout-submit]').click();
    await expect(page.locator('[data-commerce-checkout-confirmation]')).toBeVisible();
    await expect(page.locator('[data-commerce-checkout-confirmation-number]')).toContainText(/TSENG-/);
    await expect(page.locator('[data-commerce-checkout-payment-status]')).toContainText('authorized_stub');
    expect(await page.evaluate(() => window.localStorage.getItem('tseng-commerce-cart-v1:ko'))).toBeNull();
    const storedConfirmation = await page.evaluate(() => {
      const raw = window.localStorage.getItem('tseng-commerce-checkout-confirmation-v1:ko');
      return raw ? JSON.parse(raw) as { orderId?: string; payment?: { adapter?: string } } : null;
    });
    expect(storedConfirmation?.payment?.adapter).toBe('sandbox-card');
    expect(storedConfirmation?.orderId).toBeTruthy();
    checkoutOrderId = storedConfirmation?.orderId ?? null;
    await expect(page.locator('[data-commerce-checkout-confirmation]')).toHaveAttribute(
      'data-commerce-checkout-order-id',
      checkoutOrderId!,
    );
    const orderResponse = await page.request.get(`/api/builder/commerce/orders/${checkoutOrderId}?locale=${LOCALE}`);
    expect(orderResponse.status()).toBe(200);
    const orderPayload = await orderResponse.json() as {
      ok?: boolean;
      order?: {
        confirmationNumber: string;
        lineItems: Array<{ sku: string; quantity: number }>;
        customer: { email: string };
        payment: { status: string; referenceId?: string };
        fulfillment: { status: string };
        totals: { grandTotalCents: number };
        audit: Array<{ type: string }>;
      };
    };
    expect(orderPayload.ok).toBe(true);
    expect(orderPayload.order).toMatchObject({
      customer: { email: `f60-${token}@example.com` },
      payment: { status: 'authorized_stub' },
      fulfillment: { status: 'unfulfilled' },
      totals: { grandTotalCents: 93660 },
    });
    expect(orderPayload.order?.payment.referenceId).toContain('pi_sandbox_');
    expect(orderPayload.order?.lineItems[0]).toMatchObject({ sku: `${sku}-CONSULT-TP`, quantity: 2 });
    expect(orderPayload.order?.audit.some((event) => event.type === 'order.created')).toBe(true);

    await page.goto(`/${LOCALE}/admin-builder/commerce/orders?orders=${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-commerce-orders-admin]')).toBeVisible();
    await page.locator('[data-commerce-orders-search]').fill(`f60-${token}@example.com`);
    const adminOrderRow = page.locator(`[data-commerce-order-row="${checkoutOrderId}"]`);
    await expect(adminOrderRow).toBeVisible();
    await expect(adminOrderRow.locator('[data-commerce-order-confirmation]')).toContainText('TSENG-');
    await page.locator('[data-commerce-orders-payment-filter]').selectOption('authorized_stub');
    await expect(adminOrderRow).toHaveAttribute('data-commerce-order-payment-status', 'authorized_stub');
    await expect(adminOrderRow.locator('[data-commerce-order-payment-reference]')).toContainText('pi_sandbox_');
    await page.locator('[data-commerce-orders-payment-filter]').selectOption('all');
    await expect(adminOrderRow).toBeVisible();
    await page.locator(`[data-commerce-order-payment-select="${checkoutOrderId}"]`).selectOption('paid');
    await expect(page.getByRole('status')).toContainText('Order updated');
    await expect(adminOrderRow).toHaveAttribute('data-commerce-order-payment-status', 'paid');
    await page.locator('[data-commerce-orders-payment-filter]').selectOption('paid');
    await expect(adminOrderRow).toBeVisible();
    await page.locator(`[data-commerce-order-document-issue="${checkoutOrderId}:invoice"]`).click();
    await expect(page.getByRole('status')).toContainText('Invoice issued');
    await expect(adminOrderRow.locator(`[data-commerce-order-document-row="${checkoutOrderId}:invoice"]`)).toContainText('Invoice');
    await page.locator(`[data-commerce-order-document-email="${checkoutOrderId}:invoice"]`).click();
    await expect(page.getByRole('status')).toContainText('Invoice email queued');
    await expect(adminOrderRow.locator(`[data-commerce-order-document-row="${checkoutOrderId}:invoice"]`)).toHaveAttribute('data-commerce-order-document-status', 'emailed_stub');
    await page.locator(`[data-commerce-order-document-issue="${checkoutOrderId}:receipt"]`).click();
    await expect(page.getByRole('status')).toContainText('Receipt issued');
    await expect(adminOrderRow.locator(`[data-commerce-order-document-row="${checkoutOrderId}:receipt"]`)).toContainText('Receipt');
    await page.locator(`[data-commerce-order-document-email="${checkoutOrderId}:receipt"]`).click();
    await expect(page.getByRole('status')).toContainText('Receipt email queued');
    await expect(adminOrderRow.locator(`[data-commerce-order-document-row="${checkoutOrderId}:receipt"]`)).toHaveAttribute('data-commerce-order-document-status', 'emailed_stub');
    await page.locator('[data-commerce-orders-payment-filter]').selectOption('all');
    await adminOrderRow.locator(`[data-commerce-order-refund-toggle="${checkoutOrderId}"]`).click();
    await expect(adminOrderRow.locator('[data-commerce-order-refund-form]')).toHaveAttribute('data-commerce-order-refund-mode', 'manual');
    await expect(page.locator(`[data-commerce-order-refund-submit="${checkoutOrderId}"]`)).toContainText('Record manual refund');
    await page.locator(`[data-commerce-order-refund-amount="${checkoutOrderId}"]`).fill('100');
    await page.locator(`[data-commerce-order-refund-reason="${checkoutOrderId}"]`).fill(`Partial refund ${token}`);
    await page.locator(`[data-commerce-order-refund-submit="${checkoutOrderId}"]`).click();
    await expect(page.getByRole('status')).toContainText('Manual refund recorded');
    await expect(adminOrderRow).toHaveAttribute('data-commerce-order-payment-status', 'partially_refunded');
    await expect(adminOrderRow.locator('[data-commerce-order-refunded]')).toContainText('Refunded');
    await expect(adminOrderRow.locator('[data-commerce-order-refunds]')).toContainText(`Partial refund ${token}`);
    await expect(adminOrderRow.locator('[data-commerce-order-refund-provider-status]').first()).toContainText('Manual reference');
    await expect(page.locator(`[data-commerce-order-payment-select="${checkoutOrderId}"]`)).toBeDisabled();
    await page.locator('[data-commerce-orders-payment-filter]').selectOption('partially_refunded');
    await expect(adminOrderRow).toBeVisible();
    await page.locator('[data-commerce-order-export="filtered"]').click();
    await expect(page.locator('[data-commerce-order-export-text]')).toHaveValue(/partially_refunded/);
    await page.locator('[data-commerce-orders-payment-filter]').selectOption('all');
    await page.locator(`[data-commerce-order-refund-submit="${checkoutOrderId}"]`).click();
    await expect(page.getByRole('status')).toContainText('Manual refund recorded');
    await expect(adminOrderRow).toHaveAttribute('data-commerce-order-payment-status', 'refunded');
    await page.locator('[data-commerce-orders-payment-filter]').selectOption('refunded');
    await expect(adminOrderRow).toBeVisible();
    await page.locator('[data-commerce-orders-payment-filter]').selectOption('all');
    await page.locator(`[data-commerce-order-fulfillment-select="${checkoutOrderId}"]`).selectOption('fulfilled');
    await expect(page.getByRole('status')).toContainText('Order updated');
    await expect(adminOrderRow).toHaveAttribute('data-commerce-order-fulfillment-status', 'fulfilled');
    await expect(adminOrderRow.locator('[data-commerce-order-audit]')).toContainText('order.updated');
    await page.locator('[data-commerce-order-export="filtered"]').click();
    await expect(page.locator('[data-commerce-order-export-text]')).toHaveValue(new RegExp(`f60-${token}@example.com`));
    await expect(page.locator('[data-commerce-order-export-text]')).toHaveValue(/invoice:/);
    await expect(page.locator('[data-commerce-order-export-text]')).toHaveValue(/receipt:/);

    await page.goto(`/${LOCALE}/store/products/${slug}?manualPay=${token}`, { waitUntil: 'domcontentloaded' });
    await page.locator('[data-commerce-product-option-value="format:Consultation"]').click();
    await page.locator('[data-commerce-product-add-to-cart]').click();
    await expect(page.locator('[data-commerce-cart-checkout]')).toHaveAttribute('data-commerce-cart-checkout-ready', 'true');
    await page.locator('[data-commerce-cart-checkout]').click();
    await expect(page.locator('[data-commerce-checkout]')).toHaveAttribute('data-commerce-checkout-hydrated', 'true');
    await page.locator('[data-commerce-checkout-name]').fill(`Manual Customer ${token}`);
    await page.locator('[data-commerce-checkout-email]').fill(`manual-${token}@example.com`);
    await page.locator('[data-commerce-checkout-phone]').fill('0912-000-111');
    await page.locator('[data-commerce-checkout-address-1]').fill('No. 2 Manual Road');
    await page.locator('[data-commerce-checkout-payment-adapter]').selectOption('manual-invoice');
    await page.locator('[data-commerce-checkout-submit]').click();
    await expect(page.locator('[data-commerce-checkout-confirmation]')).toBeVisible();
    await expect(page.locator('[data-commerce-checkout-payment-status]')).toContainText('requires_manual_payment');
    const manualOrderId = await page.locator('[data-commerce-checkout-confirmation]').getAttribute('data-commerce-checkout-order-id');
    expect(manualOrderId).toBeTruthy();

    await page.goto(`/${LOCALE}/admin-builder/commerce/orders?manualPayments=${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-commerce-orders-admin]')).toBeVisible();
    await page.locator('[data-commerce-orders-search]').fill(`manual-${token}@example.com`);
    const manualOrderRow = page.locator(`[data-commerce-order-row="${manualOrderId}"]`);
    await expect(manualOrderRow).toBeVisible();
    await expect(manualOrderRow).toHaveAttribute('data-commerce-order-payment-status', 'requires_manual_payment');
    await expect(manualOrderRow.locator('[data-commerce-order-manual-balance]')).toContainText('due');
    await manualOrderRow.locator(`[data-commerce-order-manual-payment-toggle="${manualOrderId}"]`).click();
    await page.locator(`[data-commerce-order-manual-payment-amount="${manualOrderId}"]`).fill('100');
    await page.locator(`[data-commerce-order-manual-payment-method="${manualOrderId}"]`).selectOption('bank_transfer');
    await page.locator(`[data-commerce-order-manual-payment-reference="${manualOrderId}"]`).fill(`WIRE-${token}`);
    await page.locator(`[data-commerce-order-manual-payment-note="${manualOrderId}"]`).fill(`Partial manual payment ${token}`);
    await page.locator(`[data-commerce-order-manual-payment-submit="${manualOrderId}"]`).click();
    await expect(page.getByRole('status')).toContainText('Manual payment recorded');
    await expect(manualOrderRow).toHaveAttribute('data-commerce-order-payment-status', 'partially_paid');
    await expect(manualOrderRow.locator('[data-commerce-order-manual-payment-row]')).toContainText(`WIRE-${token}`);
    await expect(manualOrderRow.locator('[data-commerce-order-manual-payment-row]')).toContainText(`Partial manual payment ${token}`);
    await page.locator('[data-commerce-orders-payment-filter]').selectOption('partially_paid');
    await expect(manualOrderRow).toBeVisible();
    await page.locator('[data-commerce-orders-payment-filter]').selectOption('all');
    await page.locator(`[data-commerce-order-manual-payment-submit="${manualOrderId}"]`).click();
    await expect(page.getByRole('status')).toContainText('Manual payment completed balance');
    await expect(manualOrderRow).toHaveAttribute('data-commerce-order-payment-status', 'paid');
    await expect(page.locator(`[data-commerce-order-payment-select="${manualOrderId}"]`)).toBeDisabled();
    await page.locator('[data-commerce-order-export="filtered"]').click();
    await expect(page.locator('[data-commerce-order-export-text]')).toHaveValue(/manualPaymentCount/);
    await expect(page.locator('[data-commerce-order-export-text]')).toHaveValue(new RegExp(`manual-${token}@example.com`));

    await page.goto(`/${LOCALE}/store/products/${slug}?pdpBackorder=${token}`, { waitUntil: 'domcontentloaded' });
    await page.locator('[data-commerce-product-option-value="format:Consultation"]').click();
    await page.locator('[data-commerce-product-option-value="region:Kaohsiung"]').click();
    await expect(page.locator('[data-commerce-product-detail]')).toHaveAttribute('data-commerce-product-availability', 'backorder');
    await expect(page.locator('[data-commerce-product-price]')).toContainText('360');
    await expect(page.locator('[data-commerce-product-sku]')).toContainText(`${sku}-CONSULT-KH`);
    await expect(page.locator('[data-commerce-product-availability-label]')).toContainText('예약 주문');

    const relatedCard = page.locator(`[data-commerce-related-product-card]`).filter({ hasText: relatedTitle }).first();
    await expect(relatedCard).toBeVisible();
    await expect(relatedCard).toHaveAttribute('href', `/${LOCALE}/store/products/${relatedSlug}`);
    await expect(page.locator('[data-commerce-related-products]')).not.toContainText(title);
    const jsonLd = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) => scripts.map((script) => script.textContent ?? ''));
    expect(jsonLd.some((text) => text.includes('"@type":"Product"') && text.includes(title) && text.includes('#product'))).toBe(true);

    await page.goto(`/${LOCALE}/store?pdpLinks=${token}`, { waitUntil: 'domcontentloaded' });
    const storeCard = page.locator('[data-commerce-category-card]').filter({ hasText: title }).first();
    await expect(storeCard.locator(`[data-commerce-product-detail-link="${slug}"]`)).toHaveAttribute(
      'href',
      `/${LOCALE}/store/products/${slug}`,
    );

    await page.goto(`/${LOCALE}/store/categories/${categorySlug}?pdpLinks=${token}`, { waitUntil: 'domcontentloaded' });
    const categoryCard = page.locator('[data-commerce-category-card]').filter({ hasText: title }).first();
    await expect(categoryCard.locator(`[data-commerce-product-detail-link="${slug}"]`)).toHaveAttribute(
      'href',
      `/${LOCALE}/store/products/${slug}`,
    );

    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto(`/${LOCALE}/store/products/${slug}?pdpMobile=${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-commerce-product-detail]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    expect(productId).toBeTruthy();
  } finally {
    if (checkoutOrderId) {
      await page.request.delete(`/api/builder/commerce/orders/${checkoutOrderId}?locale=${LOCALE}`, {
        headers: mutationHeaders(`commerce-order-delete-${token}`),
        failOnStatusCode: false,
      });
    }
    await cleanupProductsByToken(page.request, token);
  }
});

test('/ko published pages render native store product gallery widgets', async ({ page }) => {
  const token = Date.now().toString(36);
  const categorySlug = `f57-${token}`;
  const otherCategorySlug = `f57-other-${token}`;
  const slug = `store-gallery-${token}`;
  let pageId: string | null = null;

  await cleanupProductsByToken(page.request, token);
  await uninstallStoreApp(page.request, `store-gallery-clean-before-${token}`);

  try {
    await installStoreApp(page.request, `store-gallery-install-${token}`);
    await createGalleryProduct(page.request, token, 1, categorySlug, 12000);
    await createGalleryProduct(page.request, token, 2, categorySlug, 34000);
    await createGalleryProduct(page.request, token, 3, otherCategorySlug, 24000);
    pageId = await createPublishedGalleryPage(page.request, slug, token, categorySlug);

    await page.goto(`/${LOCALE}/${slug}?storeGallery=${token}`, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    const widgetNode = page.locator(`[data-node-id="product-gallery-widget-${token}"]`);
    await expect(widgetNode).toHaveAttribute('data-builder-app-widget', 'app:native-store:product-gallery');
    await expect(widgetNode).toHaveAttribute('data-builder-app-runtime-status', 'enabled');
    await expect(widgetNode.locator('[data-builder-product-gallery="true"]')).toBeVisible();
    await expect(widgetNode.locator('[data-builder-product-gallery="true"]')).toHaveAttribute(
      'data-builder-product-gallery-category',
      categorySlug,
    );
    await expect(widgetNode.locator('[data-builder-product-gallery-pagination]')).toContainText('1 / 2');
    await expect(widgetNode.locator('[data-builder-product-gallery-card]')).toContainText(`F57 Gallery Product 2 ${token}`);
    await expect(widgetNode.locator('[data-builder-product-gallery-detail-link]').first()).toHaveAttribute(
      'href',
      /\/ko\/store\/products\//,
    );

    await widgetNode.locator('[data-builder-product-gallery-pagination]').getByRole('button', { name: '다음' }).click();
    await expect(widgetNode.locator('[data-builder-product-gallery-pagination]')).toContainText('2 / 2');
    await expect(widgetNode.locator('[data-builder-product-gallery-card]')).toContainText(`F57 Gallery Product 1 ${token}`);

    await widgetNode.locator('[data-builder-product-gallery-sort] select').selectOption('price-asc');
    await expect(widgetNode.locator('[data-builder-product-gallery-card]')).toContainText(`F57 Gallery Product 1 ${token}`);

    await widgetNode.locator('[data-builder-product-gallery-quick-view-open]').click();
    await expect(widgetNode.locator('[data-builder-product-gallery-quick-view="true"]')).toContainText(`Quick view body for gallery product 1 ${token}`);
    await expect(widgetNode.locator('[data-builder-product-gallery-quick-view="true"]')).toContainText(`F57-SKU-1-${token}`);
    await expect(widgetNode.locator('[data-builder-product-gallery-quick-view-detail-link]')).toHaveAttribute(
      'href',
      /\/ko\/store\/products\//,
    );
    await widgetNode.locator('[data-builder-product-gallery-quick-view="true"]').getByRole('button', { name: '닫기' }).click();
    await expect(widgetNode.locator('[data-builder-product-gallery-quick-view="true"]')).toHaveCount(0);

    await page.setViewportSize({ width: 375, height: 900 });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(widgetNode.locator('[data-builder-product-gallery="true"]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=${LOCALE}`, {
        headers: mutationHeaders(`commerce-gallery-page-delete-${token}`),
        failOnStatusCode: false,
      });
    }
    await cleanupProductsByToken(page.request, token);
    await uninstallStoreApp(page.request, `store-gallery-clean-after-${token}`);
  }
});
