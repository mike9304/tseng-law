/**
 * F107 — Structured SDK documentation source.
 *
 * Pure helper returning a typed array of doc sections so the page route can
 * render them and future LLM-fed tooling can ingest the same data without
 * scraping HTML.
 */

import type { Locale } from '@/lib/locales';

export interface SdkDocSection {
  id: string;
  title: string;
  paragraphs: string[];
  types: string[];
  example: string;
}

type SectionId =
  | 'functions'
  | 'pages'
  | 'cms'
  | 'data-sdk'
  | 'media'
  | 'apps'
  | 'bookings'
  | 'commerce'
  | 'publish';

type LocalizedSection = Pick<SdkDocSection, 'title' | 'paragraphs'>;

const SECTION_COPY: Record<'ko' | 'zh-hant' | 'en', Record<SectionId, LocalizedSection>> = {
  ko: {
    functions: {
      title: '함수 API',
      paragraphs: [
        '작은 서버 측 함수를 만들고, 빌더 안에서 바로 테스트 실행하며, 보호된 개발자 엔드포인트로 저장된 함수를 호출할 수 있습니다.',
        '함수는 시간과 로그 보조 기능이 포함된 `ctx` 객체를 받습니다. 테스트 실행은 제한된 `worker-vm` 런타임에서 수행되며 함수 로그는 `/api/builder/dev/logs`에 기록됩니다.',
      ],
    },
    pages: {
      title: '페이지 API',
      paragraphs: [
        '페이지별 초안/발행 캔버스를 CRUD로 관리합니다. `src/lib/builder/site/persistence.ts`를 기반으로 동작합니다.',
        '각 페이지는 슬러그, 수명주기, 선택적 SEO 메타데이터, 그리고 로케일별 링크 테이블을 가집니다.',
      ],
    },
    cms: {
      title: 'CMS API',
      paragraphs: [
        '스키마로 정의된 컬렉션을 타입이 있는 필드, 참조, 정렬된 조회와 함께 제공합니다.',
        '레코드는 초안 또는 발행본일 수 있으며, 쿼리는 필터 + 정렬 + 페이지네이션을 지원합니다.',
      ],
    },
    'data-sdk': {
      title: 'Data SDK',
      paragraphs: [
        '서버 코드(서버리스 함수, 앱 훅)가 HTTP를 직접 호출하지 않고 CMS 데이터를 조회/변경할 수 있는 타입이 있는 서버 측 퍼사드입니다.',
        '기존 CMS 저장 함수를 그대로 재사용하며, 모든 호출은 라우트와 동일한 RBAC 권한 게이트를 먼저 통과합니다. 권한 거부 시 `DataSdkPermissionError`를 던집니다.',
      ],
    },
    media: {
      title: '미디어 API',
      paragraphs: [
        '미디어 자산을 업로드, 목록 조회, 삭제할 수 있습니다. 자산 ID는 모든 캔버스 노드에서 참조 가능한 안정적인 URL입니다.',
        '서버 측 헬퍼가 업로드를 스트리밍하고 감사 이벤트를 자동으로 남깁니다.',
      ],
    },
    apps: {
      title: '앱 API',
      paragraphs: [
        '타사 빌더 앱을 설치/제거합니다. 각 설치는 나중에 검사할 수 있도록 매니페스트 스냅샷을 저장합니다.',
        '앱은 캔버스 컴포넌트, 자동화, 또는 설정 패널을 제공할 수 있습니다.',
      ],
    },
    bookings: {
      title: '예약 API',
      paragraphs: [
        '서비스를 정의하고, 가용성 규칙을 연결하며, 클라이언트 측 예약을 받습니다.',
        '예약 생성 시 `booking` 알림과 웹훅 이벤트가 발생합니다.',
      ],
    },
    commerce: {
      title: '커머스 API',
      paragraphs: [
        '상품 카탈로그, 장바구니, 주문 처리를 담당합니다. 주문은 `order` 알림을 발생시키고 통합 받은편지함에 저장됩니다.',
      ],
    },
    publish: {
      title: '발행 API',
      paragraphs: [
        '페이지를 초안에서 발행본으로 이동합니다. 발행 게이트를 실행하고, 리비전 스냅샷을 기록하고, 경로를 재검증하고, `page.published` 이벤트를 발생시킵니다.',
        '이전 리비전으로 롤백을 지원하며 브랜치 + 승인 흐름과 통합됩니다.',
      ],
    },
  },
  'zh-hant': {
    functions: {
      title: '函式 API',
      paragraphs: [
        '建立小型伺服器端函式，在建構器中直接測試執行，並透過受保護的開發端點呼叫已儲存的函式。',
        '函式會收到包含時間與記錄輔助工具的 `ctx` 物件。測試執行會在受限的 `worker-vm` 執行，函式記錄則寫入 `/api/builder/dev/logs`。',
      ],
    },
    pages: {
      title: '頁面 API',
      paragraphs: [
        '對每個頁面的草稿/已發佈畫布進行 CRUD。底層由 `src/lib/builder/site/persistence.ts` 提供。',
        '每個頁面都有代稱、生命週期、可選的 SEO 中繼資料，以及按語系分組的連結表。',
      ],
    },
    cms: {
      title: 'CMS API',
      paragraphs: [
        '以結構描述定義的集合，具備型別欄位、參照與排序查詢。',
        '紀錄可以是草稿或已發佈；查詢支援篩選、排序與分頁。',
      ],
    },
    'data-sdk': {
      title: 'Data SDK',
      paragraphs: [
        '型別化的伺服器端 facade，讓伺服器程式碼（無伺服器函式、應用鉤子）無須直接呼叫 HTTP 即可查詢與變更 CMS 資料。',
        '直接重用現有 CMS 儲存函式；每次呼叫都會先通過與路由相同的 RBAC 權限閘道，拒絕時擲回 `DataSdkPermissionError`。',
      ],
    },
    media: {
      title: '媒體 API',
      paragraphs: [
        '上傳、列出與刪除媒體資產。資產 ID 是可在任何畫布節點中參照的穩定 URL。',
        '伺服器端工具會串流上傳並自動寫入稽核事件。',
      ],
    },
    apps: {
      title: '應用 API',
      paragraphs: [
        '安裝或移除第三方建構器應用。每次安裝都會保存一份 manifest 快照，方便日後檢查。',
        '應用程式可提供畫布元件、自動化或設定面板。',
      ],
    },
    bookings: {
      title: '預約 API',
      paragraphs: [
        '定義服務、連結可用性規則，並接受前端預約。',
        '建立預約時會觸發 `booking` 通知與 webhook 事件。',
      ],
    },
    commerce: {
      title: '商務 API',
      paragraphs: [
        '商品目錄、購物車與訂單處理。訂單會觸發 `order` 通知，並儲存在整合收件匣中。',
      ],
    },
    publish: {
      title: '發佈 API',
      paragraphs: [
        '將頁面從草稿移到已發佈。會執行發佈閘道、記錄版本快照、重新驗證路由，並觸發 `page.published`。',
        '支援回復到先前版本，並與分支與核准流程整合。',
      ],
    },
  },
  en: {
    functions: {
      title: 'Functions API',
      paragraphs: [
        'Create small server-side functions, test-run them from the builder, and invoke saved functions through guarded dev endpoints.',
        'Functions receive a `ctx` object with time and logging helpers. Test-runs execute in the bounded `worker-vm` runtime and write function logs to `/api/builder/dev/logs`.',
      ],
    },
    pages: {
      title: 'Pages API',
      paragraphs: [
        'CRUD over per-page draft/published canvases. Backed by `src/lib/builder/site/persistence.ts`.',
        'Each page has a slug, lifecycle, optional SEO metadata, and per-locale link table.',
      ],
    },
    cms: {
      title: 'CMS API',
      paragraphs: [
        'Schema-defined collections with typed fields, references, and ordered queries.',
        'Records can be drafts or published; queries support filter + sort + paginate.',
      ],
    },
    'data-sdk': {
      title: 'Data SDK',
      paragraphs: [
        'A typed, permission-checked server-side facade that lets server code (serverless functions, app hooks) query and mutate CMS data without hand-rolling HTTP.',
        'It reuses the existing CMS store functions verbatim; every call first passes the same RBAC permission gate as the routes, throwing `DataSdkPermissionError` on denial.',
      ],
    },
    media: {
      title: 'Media API',
      paragraphs: [
        'Upload, list, and delete media assets. Asset IDs are stable URLs that can be referenced from any canvas node.',
        'Server-side helpers stream uploads and emit audit events automatically.',
      ],
    },
    apps: {
      title: 'Apps API',
      paragraphs: [
        'Install/uninstall third-party builder apps. Each install captures a manifest snapshot for later inspection.',
        'Apps may expose canvas components, automations, or settings panels.',
      ],
    },
    bookings: {
      title: 'Bookings API',
      paragraphs: [
        'Define services, attach availability rules, and accept client-side reservations.',
        'Reservations emit `booking` notifications and webhook events on creation.',
      ],
    },
    commerce: {
      title: 'Commerce API',
      paragraphs: [
        'Product catalog, cart, and order processing. Orders emit `order` notifications and persist to the unified inbox.',
      ],
    },
    publish: {
      title: 'Publish API',
      paragraphs: [
        'Move a page from draft to published. Runs the publish gate, records a revision snapshot, revalidates routes, and emits `page.published`.',
        'Supports rollback to any prior revision and integrates with branches + approvals.',
      ],
    },
  },
};

const BASE_SECTIONS: Array<SdkDocSection & { id: SectionId }> = [
  {
    id: 'functions',
    title: 'Functions API',
    paragraphs: [],
    types: [
      'BuilderServerlessFunction { id; name; slug; code; runtime; enabled; createdAt; updatedAt }',
      'BuilderFunctionInvocationResult { ok; result?; error?; logs: InvocationLog[]; runtime: "worker-vm"; durationMs; timedOut? }',
      'Function ctx { now(): string; log(...args); info(...args); warn(...args); error(...args) }',
    ],
    example: [
      "const created = await fetch('/api/builder/dev/functions', {",
      "  method: 'POST',",
      "  headers: { 'Content-Type': 'application/json' },",
      "  body: JSON.stringify({",
      "    name: 'Lead scoring hook',",
      "    slug: 'lead-score',",
      "    code: 'ctx.log(\"scoring\", ctx.now()); return { score: 42 };',",
      "  }),",
      "});",
      "",
      "const invoked = await fetch('/api/builder/dev/functions/{slug-or-id}/invoke', { method: 'POST' });",
      "const result = await invoked.json();",
    ].join('\n'),
  },
  {
    id: 'pages',
    title: 'Pages API',
    paragraphs: [],
    types: [
      'BuilderPageMeta { pageId; slug; title: Record<Locale, string>; locale; createdAt; updatedAt; publishedAt? }',
      'BuilderCanvasDocument { schemaVersion; locale; slug; nodes: BuilderCanvasNode[]; updatedAt }',
      'PageCanvasRecord { revision: number; savedAt: string; updatedBy?: string; document: BuilderCanvasDocument }',
    ],
    example: [
      "import { listPages, writePageCanvas } from '@/lib/builder/site/persistence';",
      "",
      "const pages = await listPages('default', 'ko');",
      "await writePageCanvas('default', pages[0].pageId, 'draft', updatedDoc, {",
      "  updatedBy: 'admin',",
      "});",
    ].join('\n'),
  },
  {
    id: 'cms',
    title: 'CMS API',
    paragraphs: [],
    types: [
      'BuilderCmsCollection { id; name; fields: BuilderCmsField[]; references?: BuilderCmsReference[] }',
      'BuilderCmsRecord { id; collectionId; values: Record<string, unknown>; status: "draft"|"published" }',
      'BuilderCmsQuery { collectionId; filters?: BuilderCmsFilter[]; sort?: BuilderCmsSort[]; limit?; offset? }',
    ],
    example: [
      "import { listCmsRecords } from '@/lib/builder/cms';",
      "",
      "const posts = await listCmsRecords({",
      "  collectionId: 'blog-posts',",
      "  filters: [{ field: 'status', op: 'eq', value: 'published' }],",
      "  sort: [{ field: 'publishedAt', direction: 'desc' }],",
      "  limit: 10,",
      "});",
    ].join('\n'),
  },
  {
    id: 'data-sdk',
    title: 'Data SDK',
    paragraphs: [],
    types: [
      'DataSdk { actor; siteId; locale; collections; records }',
      'DataSdk.collections { list(): BuilderCmsCollectionSummary[] }',
      'DataSdk.records { list(collectionId, query?); get(collectionId, recordId); create(collectionId, fields); update(collectionId, recordId, fields); delete(collectionId, recordId) }',
      'DataSdkRecordListResult { records: BuilderCmsRecord[]; total; page; pageSize; pageCount }',
      'DataSdkPermissionError { actor; permission: "edit-pages"; action } (subclass of DataSdkError)',
    ],
    example: [
      "import { createDataSdk } from '@/lib/builder/dev/data-sdk';",
      "",
      "// Server-side only. `actor` is the authenticated username resolved",
      "// through the same RBAC layer as the CMS collection routes.",
      "const sdk = createDataSdk({ actor: 'admin' });",
      "",
      "const summaries = await sdk.collections.list();",
      "",
      "const result = await sdk.records.list('articles', {",
      "  filters: [{ filterId: 'f1', fieldKey: 'status', operator: 'is', value: 'published' }],",
      "  sortBy: 'updatedAt',",
      "  sortDirection: 'desc',",
      "  page: 1,",
      "  pageSize: 10,",
      "});",
      "",
      "const created = await sdk.records.create('articles', { title: 'New post', slug: 'new-post' });",
      "await sdk.records.update('articles', created.recordId, { title: 'Edited' });",
    ].join('\n'),
  },
  {
    id: 'media',
    title: 'Media API',
    paragraphs: [],
    types: [
      'BuilderMediaAsset { id; mime; size; url; uploadedAt; uploadedBy? }',
      'MediaUploadResult { asset: BuilderMediaAsset; duplicated: boolean }',
    ],
    example: [
      "import { uploadAsset } from '@/lib/builder/assets/uploader';",
      "",
      "const { asset } = await uploadAsset({",
      "  file: blob,",
      "  mime: 'image/png',",
      "  uploadedBy: 'admin',",
      "});",
    ].join('\n'),
  },
  {
    id: 'apps',
    title: 'Apps API',
    paragraphs: [],
    types: [
      'BuilderAppManifest { appId; name; version; entry?; capabilities: BuilderAppCapability[] }',
      'BuilderInstalledApp { appId; installedAt; manifest: BuilderAppManifest; settings: Record<string, unknown> }',
    ],
    example: [
      "import { installApp, listInstalledApps } from '@/lib/builder/apps';",
      "",
      "await installApp({ appId: 'reviews-pro', settings: { theme: 'light' } });",
      "const installed = await listInstalledApps();",
    ].join('\n'),
  },
  {
    id: 'bookings',
    title: 'Bookings API',
    paragraphs: [],
    types: [
      'BuilderBookingService { id; name; durationMin; price?; locations?: BuilderBookingLocation[] }',
      'BuilderBookingReservation { id; serviceId; contactId?; start: string; end: string; status }',
    ],
    example: [
      "import { createReservation } from '@/lib/builder/bookings/store';",
      "",
      "await createReservation({",
      "  serviceId: 'consult-30',",
      "  contactId: 'c_abc',",
      "  start: '2026-06-01T10:00:00Z',",
      "  end: '2026-06-01T10:30:00Z',",
      "});",
    ].join('\n'),
  },
  {
    id: 'commerce',
    title: 'Commerce API',
    paragraphs: [],
    types: [
      'BuilderProduct { id; sku; title: Record<Locale, string>; priceCents; inventory? }',
      'BuilderOrder { id; lineItems: BuilderOrderLine[]; subtotalCents; status: "pending"|"paid"|"fulfilled" }',
    ],
    example: [
      "import { createOrder } from '@/lib/builder/commerce/orders';",
      "",
      "const order = await createOrder({",
      "  lineItems: [{ sku: 'BRIEF-2026', quantity: 1, unitPriceCents: 29900 }],",
      "  contactEmail: 'buyer@example.com',",
      "});",
    ].join('\n'),
  },
  {
    id: 'publish',
    title: 'Publish API',
    paragraphs: [],
    types: [
      'PublishResult { revisionId; revision; publishedRevisionId; revalidatedPaths: string[]; warnings: string[] }',
      'PublishCheckResult { passed; warnings: string[]; errors: string[]; suite?: PublishCheckSuite }',
    ],
    example: [
      "import { publishPage } from '@/lib/builder/site/publish';",
      "",
      "const result = await publishPage('default', 'page-home');",
      "console.log(result.revalidatedPaths);",
    ].join('\n'),
  },
];

export function getSdkDocSections(locale: Locale = 'en'): SdkDocSection[] {
  const copy = SECTION_COPY[locale as 'ko' | 'zh-hant' | 'en'] ?? SECTION_COPY.en;
  return BASE_SECTIONS.map((section) => ({
    id: section.id,
    title: copy[section.id].title,
    paragraphs: copy[section.id].paragraphs,
    types: section.types,
    example: section.example,
  }));
}
