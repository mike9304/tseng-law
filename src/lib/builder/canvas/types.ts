import { z } from 'zod';
import { locales, type Locale } from '@/lib/locales';

export const sandboxLocaleSchema = z.enum(locales);

export const canvasNodeKindSchema = z.enum(['text', 'image', 'button']);
export type BuilderCanvasNodeKind = z.infer<typeof canvasNodeKindSchema>;

export const canvasRectSchema = z.object({
  x: z.number().finite(),
  y: z.number().finite(),
  width: z.number().positive(),
  height: z.number().positive(),
});

const baseCanvasNodeSchema = z.object({
  id: z.string().trim().min(1).max(120),
  kind: canvasNodeKindSchema,
  rect: canvasRectSchema,
  zIndex: z.number().int().nonnegative(),
  locked: z.boolean().default(false),
  visible: z.boolean().default(true),
});

const textCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('text'),
  content: z.object({
    text: z.string().max(1000),
    fontSize: z.number().int().min(12).max(72),
    color: z.string().max(32),
    fontWeight: z.enum(['regular', 'medium', 'bold']),
    align: z.enum(['left', 'center', 'right']),
  }),
});

const imageCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('image'),
  content: z.object({
    src: z.string().max(2000),
    alt: z.string().max(300),
    fit: z.enum(['cover', 'contain']),
  }),
});

const buttonCanvasNodeSchema = baseCanvasNodeSchema.extend({
  kind: z.literal('button'),
  content: z.object({
    label: z.string().max(120),
    href: z.string().max(2000),
    style: z.enum(['primary', 'secondary']),
  }),
});

export const builderCanvasNodeSchema = z.discriminatedUnion('kind', [
  textCanvasNodeSchema,
  imageCanvasNodeSchema,
  buttonCanvasNodeSchema,
]);

export type BuilderTextCanvasNode = z.infer<typeof textCanvasNodeSchema>;
export type BuilderImageCanvasNode = z.infer<typeof imageCanvasNodeSchema>;
export type BuilderButtonCanvasNode = z.infer<typeof buttonCanvasNodeSchema>;
export type BuilderCanvasNode = z.infer<typeof builderCanvasNodeSchema>;

export const builderCanvasDocumentSchema = z.object({
  version: z.literal(1),
  locale: sandboxLocaleSchema,
  updatedAt: z.string().datetime({ offset: true }),
  updatedBy: z.string().trim().min(1).max(120),
  nodes: z.array(builderCanvasNodeSchema).max(500),
});

export type BuilderCanvasDocument = z.infer<typeof builderCanvasDocumentSchema>;

export interface BuilderCanvasDraftEnvelope {
  backend: 'blob' | 'file';
  persisted: boolean;
  document: BuilderCanvasDocument;
}

export const CANVAS_SANDBOX_UPDATED_BY = 'sandbox-builder';

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
    nodes: [
      {
        id: 'headline-1',
        kind: 'text',
        rect: { x: 72, y: 64, width: 360, height: 88 },
        zIndex: 0,
        locked: false,
        visible: true,
        content: {
          text: locale === 'ko' ? '대만 법률 문제를 직접 구성하는 자유 캔버스' : 'Build legal landing pages on a free canvas',
          fontSize: 34,
          color: '#0f172a',
          fontWeight: 'bold',
          align: 'left',
        },
      },
      {
        id: 'support-copy-1',
        kind: 'text',
        rect: { x: 72, y: 170, width: 420, height: 72 },
        zIndex: 1,
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
        },
      },
      {
        id: 'cta-button-1',
        kind: 'button',
        rect: { x: 72, y: 280, width: 176, height: 52 },
        zIndex: 2,
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
        zIndex: 3,
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
        zIndex: 4,
        locked: false,
        visible: true,
        content: {
          src: '/images/header-skyline-ratio.webp',
          alt: locale === 'ko' ? '타이베이 스카이라인' : 'Taipei skyline',
          fit: 'cover',
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
    .filter((node) => node.visible)
    .sort((left, right) => left.zIndex - right.zIndex)
    .map((node, index) => ({
      ...node,
      zIndex: index,
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

