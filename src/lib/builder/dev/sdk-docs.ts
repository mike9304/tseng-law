/**
 * F107 — Structured SDK documentation source.
 *
 * Pure helper returning a typed array of doc sections so the page route can
 * render them and future LLM-fed tooling can ingest the same data without
 * scraping HTML.
 */

export interface SdkDocSection {
  id: string;
  title: string;
  paragraphs: string[];
  types: string[];
  example: string;
}

export function getSdkDocSections(): SdkDocSection[] {
  return [
    {
      id: 'pages',
      title: 'Pages API',
      paragraphs: [
        'CRUD over per-page draft/published canvases. Backed by `src/lib/builder/site/persistence.ts`.',
        'Each page has a slug, lifecycle, optional SEO metadata, and per-locale link table.',
      ],
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
      paragraphs: [
        'Schema-defined collections with typed fields, references, and ordered queries.',
        'Records can be drafts or published; queries support filter + sort + paginate.',
      ],
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
      id: 'media',
      title: 'Media API',
      paragraphs: [
        'Upload, list, and delete media assets. Asset IDs are stable URLs that can be referenced from any canvas node.',
        'Server-side helpers stream uploads and emit audit events automatically.',
      ],
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
      paragraphs: [
        'Install/uninstall third-party builder apps. Each install captures a manifest snapshot for later inspection.',
        'Apps may expose canvas components, automations, or settings panels.',
      ],
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
      paragraphs: [
        'Define services, attach availability rules, and accept client-side reservations.',
        'Reservations emit `booking` notifications and webhook events on creation.',
      ],
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
      paragraphs: [
        'Product catalog, cart, and order processing. Orders emit `order` notifications and persist to the unified inbox.',
      ],
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
      paragraphs: [
        'Move a page from draft to published. Runs the publish gate, records a revision snapshot, revalidates routes, and emits `page.published`.',
        'Supports rollback to any prior revision and integrates with branches + approvals.',
      ],
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
}