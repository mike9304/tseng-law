import { z } from 'zod';
import { locales, type Locale } from '@/lib/locales';
const imageFiltersSchema = z.object({
  brightness: z.number().min(0).max(200),
  contrast: z.number().min(0).max(200),
  saturation: z.number().min(0).max(200),
  blur: z.number().min(0).max(20),
  grayscale: z.number().min(0).max(100),
  sepia: z.number().min(0).max(100),
}).optional();

export const sandboxLocaleSchema = z.enum(locales);

export const builderCanvasNodeKinds = [
  'text',
  'image',
  'button',
  'heading',
  'container',
  'section',
  'composite',
] as const;

export const compositeComponentKeys = [
  'hero-search',
  'services-bento',
  'home-contact-cta',
  'insights-archive',
  'home-attorney',
  'home-case-results',
  'home-stats',
  'faq-accordion',
  'office-map-tabs',
  'legacy-page-about',
  'legacy-page-services',
  'legacy-page-contact',
  'legacy-page-lawyers',
  'legacy-page-faq',
  'legacy-page-pricing',
  'legacy-page-reviews',
  'legacy-page-privacy',
  'legacy-page-disclaimer',
] as const;

export type CompositeComponentKey = (typeof compositeComponentKeys)[number];

export const canvasNodeKindSchema = z.enum(builderCanvasNodeKinds);
export type BuilderCanvasNodeKind = z.infer<typeof canvasNodeKindSchema>;

export const canvasRectSchema = z.object({
  x: z.number().finite(),
  y: z.number().finite(),
  width: z.number().positive(),
  height: z.number().positive(),
});

const canvasNodeStyleDefaults = {
  backgroundColor: 'transparent',
  borderColor: '#cbd5e1',
  borderStyle: 'solid' as const,
  borderWidth: 0,
  borderRadius: 14,
  shadowX: 0,
  shadowY: 0,
  shadowBlur: 0,
  shadowSpread: 0,
  shadowColor: 'rgba(15, 23, 42, 0.16)',
  opacity: 100,
};

export const builderCanvasNodeStyleSchema = z.object({
  backgroundColor: z.string().max(64),
  borderColor: z.string().max(64),
  borderStyle: z.enum(['solid', 'dashed']),
  borderWidth: z.number().int().min(0).max(12),
  borderRadius: z.number().int().min(0).max(64),
  shadowX: z.number().int().min(-96).max(96),
  shadowY: z.number().int().min(-96).max(96),
  shadowBlur: z.number().int().min(0).max(160),
  shadowSpread: z.number().int().min(-96).max(96),
  shadowColor: z.string().max(64),
  opacity: z.number().int().min(0).max(100),
});

export type BuilderCanvasNodeStyle = z.infer<typeof builderCanvasNodeStyleSchema>;

const baseCanvasNodeSchema = z.object({
  id: z.string().trim().min(1).max(120),
  kind: canvasNodeKindSchema,
  parentId: z.string().max(120).optional(),
  rect: canvasRectSchema,
  style: builderCanvasNodeStyleSchema.default(canvasNodeStyleDefaults),
  zIndex: z.number().int().nonnegative(),
  rotation: z.number().min(0).max(360).default(0),
  locked: z.boolean().default(false),
  visible: z.boolean().default(true),
});

const textShadowSchema = z.object({
  x: z.number().min(-50).max(50),
  y: z.number().min(-50).max(50),
  blur: z.number().min(0).max(100),
  color: z.string().max(64),
}).optional();

const textCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('text'),
  content: z.object({
    text: z.string().max(1000),
    fontSize: z.number().int().min(12).max(72),
    color: z.string().max(32),
    fontWeight: z.enum(['regular', 'medium', 'bold']),
    align: z.enum(['left', 'center', 'right']),
    lineHeight: z.number().min(0.5).max(4).default(1.25),
    letterSpacing: z.number().min(-2).max(10).default(0),
    fontFamily: z.string().max(120).optional(),
    verticalAlign: z.enum(['top', 'center', 'bottom']).optional(),
    textShadow: textShadowSchema,
    backgroundColor: z.string().max(64).optional(),
    textTransform: z.enum(['none', 'uppercase', 'lowercase', 'capitalize']).optional(),
    className: z.string().max(256).optional(),
    as: z.enum(['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']).optional(),
    rawInlineStyle: z.boolean().optional(),
  }),
});

const imageCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('image'),
  content: z.object({
    src: z.string().max(2000),
    alt: z.string().max(300),
    fit: z.enum(['cover', 'contain']),
    cropAspect: z.string().max(20).optional(),
    filters: imageFiltersSchema,
  }),
});

const buttonCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('button'),
  content: z.object({
    label: z.string().max(120),
    href: z.string().max(2000),
    style: z.enum(['primary', 'secondary', 'outline', 'ghost', 'link']),
    className: z.string().max(256).optional(),
    as: z.enum(['a', 'button']).optional(),
    rawInlineStyle: z.boolean().optional(),
    target: z.enum(['_self', '_blank', '_parent', '_top']).optional(),
    rel: z.string().max(120).optional(),
  }),
});

const headingCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('heading'),
  content: z.object({
    text: z.string().max(300),
    level: z.number().int().min(1).max(6),
    color: z.string().max(32),
    align: z.enum(['left', 'center', 'right']),
    fontFamily: z.string().max(120).optional(),
    className: z.string().max(256).optional(),
    rawInlineStyle: z.boolean().optional(),
  }),
});

const flexConfigSchema = z.object({
  direction: z.enum(['row', 'column']).default('row'),
  wrap: z.boolean().default(true),
  justifyContent: z.enum(['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly']).default('flex-start'),
  alignItems: z.enum(['flex-start', 'center', 'flex-end', 'stretch']).default('flex-start'),
  gap: z.number().int().min(0).max(200).default(16),
});

const gridConfigSchema = z.object({
  columns: z.number().int().min(1).max(12).default(3),
  rows: z.number().int().min(1).max(12).default(2),
  columnGap: z.number().int().min(0).max(200).default(16),
  rowGap: z.number().int().min(0).max(200).default(16),
  templateColumns: z.string().max(200).optional(),
  templateRows: z.string().max(200).optional(),
});

const containerCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('container'),
  content: z.object({
    label: z.string().max(120),
    background: z.string().max(64),
    borderColor: z.string().max(64),
    borderStyle: z.enum(['solid', 'dashed']),
    borderWidth: z.number().int().min(0).max(12),
    borderRadius: z.number().int().min(0).max(48),
    padding: z.number().int().min(0).max(96),
    layoutMode: z.enum(['absolute', 'flex', 'grid']).default('absolute'),
    flexConfig: flexConfigSchema.optional(),
    gridConfig: gridConfigSchema.optional(),
    className: z.string().max(256).optional(),
    as: z.enum(['div', 'section', 'article', 'aside', 'header', 'footer', 'main', 'nav']).optional(),
    htmlId: z.string().max(120).optional(),
    dataTone: z.string().max(32).optional(),
    rawInlineStyle: z.boolean().optional(),
  }),
});

const sectionCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('section'),
  content: z.object({
    label: z.string().max(120),
    maxWidth: z.number().int().min(320).max(1440),
    background: z.string().max(64),
    borderColor: z.string().max(64),
    borderWidth: z.number().int().min(0).max(12),
    borderRadius: z.number().int().min(0).max(48),
    padding: z.number().int().min(0).max(144),
  }),
});

const compositeCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('composite'),
  content: z.object({
    componentKey: z.enum(compositeComponentKeys),
    config: z.record(z.string(), z.unknown()).default({}),
  }),
});

export const builderCanvasNodeSchema = z.discriminatedUnion('kind', [
  textCanvasNodeSchema,
  imageCanvasNodeSchema,
  buttonCanvasNodeSchema,
  headingCanvasNodeSchema,
  containerCanvasNodeSchema,
  sectionCanvasNodeSchema,
  compositeCanvasNodeSchema,
]);

export type BuilderTextCanvasNode = z.infer<typeof textCanvasNodeSchema>;
export type BuilderImageCanvasNode = z.infer<typeof imageCanvasNodeSchema>;
export type BuilderButtonCanvasNode = z.infer<typeof buttonCanvasNodeSchema>;
export type BuilderHeadingCanvasNode = z.infer<typeof headingCanvasNodeSchema>;
export type BuilderContainerCanvasNode = z.infer<typeof containerCanvasNodeSchema>;
export type BuilderSectionCanvasNode = z.infer<typeof sectionCanvasNodeSchema>;
export type BuilderCompositeCanvasNode = z.infer<typeof compositeCanvasNodeSchema>;
export type BuilderCanvasNode = z.infer<typeof builderCanvasNodeSchema>;

export const builderCanvasDocumentSchema = z.object({
  version: z.literal(1),
  locale: sandboxLocaleSchema,
  updatedAt: z.string().datetime({ offset: true }),
  updatedBy: z.string().trim().min(1).max(120),
  stageWidth: z.number().int().min(320).max(4000).default(1280),
  stageHeight: z.number().int().min(400).max(20000).default(880),
  nodes: z.array(builderCanvasNodeSchema).max(500),
});

export type BuilderCanvasDocument = z.infer<typeof builderCanvasDocumentSchema>;

export interface BuilderCanvasDraftEnvelope {
  backend: 'blob' | 'file';
  persisted: boolean;
  document: BuilderCanvasDocument;
}

export const CANVAS_SANDBOX_UPDATED_BY = 'sandbox-builder';

export function createDefaultCanvasNodeStyle(
  overrides: Partial<BuilderCanvasNodeStyle> = {},
): BuilderCanvasNodeStyle {
  return {
    ...canvasNodeStyleDefaults,
    ...overrides,
  };
}

function createNow(): string {
  return new Date().toISOString();
}

export function createDefaultCanvasDocument(locale: Locale): BuilderCanvasDocument {
  const updatedAt = createNow();
  return {
    version: 1,
    locale,
    updatedAt,
    updatedBy: CANVAS_SANDBOX_UPDATED_BY,
    stageWidth: 1280,
    stageHeight: 880,
    nodes: [
      {
        id: 'headline-1',
        kind: 'text',
        rect: { x: 72, y: 64, width: 360, height: 88 },
        style: createDefaultCanvasNodeStyle(),
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: locale === 'ko' ? '대만 법률 문제를 직접 구성하는 자유 캔버스' : 'Build legal landing pages on a free canvas',
          fontSize: 34,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
          lineHeight: 1.25,
          letterSpacing: 0,
          fontFamily: 'system-ui',
        },
      },
      {
        id: 'support-copy-1',
        kind: 'text',
        rect: { x: 72, y: 170, width: 420, height: 72 },
        style: createDefaultCanvasNodeStyle(),
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          text: locale === 'ko'
            ? '텍스트, 이미지, 버튼을 직접 배치하고 드래그/리사이즈 동작을 검증하는 Phase 1 sandbox 입니다.'
            : 'Phase 1 sandbox for direct placement, drag, and resize of text, image, and button nodes.',
          fontSize: 17,
          color: '#475569',
          fontWeight: 'regular',
          align: 'left',
          lineHeight: 1.25,
          letterSpacing: 0,
          fontFamily: 'system-ui',
        },
      },
      {
        id: 'cta-button-1',
        kind: 'button',
        rect: { x: 72, y: 280, width: 176, height: 52 },
        style: createDefaultCanvasNodeStyle({
          borderRadius: 999,
          shadowY: 14,
          shadowBlur: 30,
          shadowColor: 'rgba(11, 59, 46, 0.18)',
        }),
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: locale === 'ko' ? '상담 요청하기' : 'Request Consultation',
          href: '/ko/contact',
          style: 'primary',
        },
      },
      {
        id: 'cta-button-2',
        kind: 'button',
        rect: { x: 264, y: 280, width: 160, height: 52 },
        style: createDefaultCanvasNodeStyle({
          borderRadius: 999,
          shadowY: 8,
          shadowBlur: 18,
          shadowColor: 'rgba(15, 23, 42, 0.08)',
        }),
        zIndex: 3,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: locale === 'ko' ? '서비스 보기' : 'View Services',
          href: '/ko/services',
          style: 'secondary',
        },
      },
      {
        id: 'hero-image-1',
        kind: 'image',
        rect: { x: 520, y: 72, width: 360, height: 280 },
        style: createDefaultCanvasNodeStyle({
          borderRadius: 12,
        }),
        zIndex: 4,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          src: '/images/header-skyline-ratio.webp',
          alt: locale === 'ko' ? '타이베이 스카이라인' : 'Taipei skyline',
          fit: 'cover',
          cropAspect: '',
        },
      },
    ],
  };
}

export function normalizeCanvasDocument(
  input: unknown,
  locale: Locale,
): BuilderCanvasDocument {
  const fallback = createDefaultCanvasDocument(locale);
  const parsed = builderCanvasDocumentSchema.safeParse(input);
  if (!parsed.success) return fallback;

  const nodes = [...parsed.data.nodes]
    .sort((left, right) => left.zIndex - right.zIndex)
    .map((node, index) => ({
      ...node,
      parentId: node.parentId,
      zIndex: index,
      rotation: Math.max(0, Math.min(360, Math.round(node.rotation))),
      rect: {
        x: Math.max(0, Math.round(node.rect.x)),
        y: Math.max(0, Math.round(node.rect.y)),
        width: Math.max(40, Math.round(node.rect.width)),
        height: Math.max(32, Math.round(node.rect.height)),
      },
    }));

  return {
    ...parsed.data,
    locale,
    nodes,
  };
}
