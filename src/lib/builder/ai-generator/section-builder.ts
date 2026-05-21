/**
 * F90 — AI Section generator.
 *
 * Pure synchronous builder that turns a {sectionKind, headline, subhead,
 * items, ctaLabel} spec into a self-contained tree of BuilderCanvasNodes.
 *
 * Slim cousin of `canvas-import.ts`: this returns ONE section, not a
 * whole page. The returned nodes are already sorted by zIndex and ready
 * to be inserted under the canvas store via the same import path the
 * AI page generator uses.
 */

import type {
  BuilderCanvasNode,
  BuilderCanvasNodeStyle,
} from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';

export const AI_SECTION_KINDS = [
  'hero',
  'features',
  'testimonials',
  'cta',
  'faq',
] as const;

export type AiSectionKind = (typeof AI_SECTION_KINDS)[number];

export interface AiSectionItem {
  title: string;
  body: string;
}

export interface AiSectionSpec {
  sectionKind: AiSectionKind;
  headline: string;
  subhead?: string;
  items?: AiSectionItem[];
  ctaLabel?: string;
}

export interface AiSectionBuildArgs {
  spec: AiSectionSpec;
  locale: Locale;
  /** Optional unique id seed to keep node ids stable across re-runs. */
  seed?: string;
}

export interface AiSectionBuildResult {
  rootId: string;
  nodes: BuilderCanvasNode[];
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const SECTION_WIDTH = 1200;
const HORIZONTAL_PAD = 72;
const CONTENT_WIDTH = SECTION_WIDTH - HORIZONTAL_PAD * 2;
const DARK_TEXT = '#0f172a';
const MUTED_TEXT = '#475569';
const LIGHT_TEXT = '#f8fafc';
const ACCENT = '#2563eb';

function nextSeed(): string {
  const stamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 7);
  return `${stamp}-${random}`;
}

function makeId(seed: string, part: string, index?: number): string {
  const suffix = typeof index === 'number' ? `${part}-${index}` : part;
  return `ai-section-${seed}-${suffix}`.replace(/[^a-zA-Z0-9_-]/g, '-');
}

function clip(value: string, max: number): string {
  const compact = value.replace(/\s+/g, ' ').trim();
  if (compact.length <= max) return compact;
  return `${compact.slice(0, Math.max(0, max - 3)).trim()}...`;
}

function baseStyle(overrides: Partial<BuilderCanvasNodeStyle> = {}): BuilderCanvasNodeStyle {
  return {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: 0,
    borderRadius: 0,
    shadowX: 0,
    shadowY: 0,
    shadowBlur: 0,
    shadowSpread: 0,
    shadowColor: 'transparent',
    opacity: 100,
    ...overrides,
  };
}

function nodeBase(id: string, parentId: string | undefined, rect: Rect, zIndex: number) {
  return {
    id,
    parentId,
    rect,
    zIndex,
    rotation: 0,
    locked: false,
    visible: true,
  };
}

function containerNode(args: {
  id: string;
  parentId?: string;
  rect: Rect;
  zIndex: number;
  label: string;
  background: string;
  borderColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  padding?: number;
  as?: 'div' | 'section' | 'article' | 'aside';
  className?: string;
  dataTone?: 'dark' | 'light';
  variant?: string;
  mobileRect?: Partial<Rect>;
}): BuilderCanvasNode {
  return {
    ...nodeBase(args.id, args.parentId, args.rect, args.zIndex),
    kind: 'container',
    style: baseStyle({
      backgroundColor: args.background,
      borderColor: args.borderColor ?? 'transparent',
      borderWidth: args.borderWidth ?? 0,
      borderRadius: args.borderRadius ?? 0,
    }),
    responsive: args.mobileRect ? { mobile: { rect: args.mobileRect } } : undefined,
    content: {
      label: clip(args.label, 120),
      background: args.background,
      borderColor: args.borderColor ?? 'transparent',
      borderStyle: 'solid',
      borderWidth: args.borderWidth ?? 0,
      borderRadius: args.borderRadius ?? 0,
      padding: args.padding ?? 0,
      layoutMode: 'absolute',
      as: args.as ?? 'div',
      className: args.className,
      dataTone: args.dataTone,
      variant: args.variant,
      aiSectionTemplateKind: args.as === 'section' ? args.variant : undefined,
    },
  } as BuilderCanvasNode;
}

function headingNode(args: {
  id: string;
  parentId: string;
  rect: Rect;
  zIndex: number;
  text: string;
  level: 1 | 2 | 3;
  color: string;
  fontSize: number;
  align?: 'left' | 'center';
  className?: string;
  mobileFontSize?: number;
  mobileRect?: Partial<Rect>;
}): BuilderCanvasNode {
  return {
    ...nodeBase(args.id, args.parentId, args.rect, args.zIndex),
    kind: 'heading',
    style: baseStyle(),
    responsive:
      args.mobileRect || args.mobileFontSize
        ? { mobile: { rect: args.mobileRect, fontSize: args.mobileFontSize } }
        : undefined,
    content: {
      text: clip(args.text, 300),
      level: args.level,
      align: args.align ?? 'left',
      color: args.color,
      fontSize: args.fontSize,
      fontWeight: 'bold',
      lineHeight: args.level === 1 ? 1.05 : 1.15,
      letterSpacing: 0,
      fontFamily: 'system-ui',
      className: args.className,
    },
  } as BuilderCanvasNode;
}

function textNode(args: {
  id: string;
  parentId: string;
  rect: Rect;
  zIndex: number;
  text: string;
  color: string;
  fontSize?: number;
  fontWeight?: 'regular' | 'medium' | 'bold';
  align?: 'left' | 'center';
  lineHeight?: number;
  className?: string;
  mobileRect?: Partial<Rect>;
  mobileFontSize?: number;
}): BuilderCanvasNode {
  return {
    ...nodeBase(args.id, args.parentId, args.rect, args.zIndex),
    kind: 'text',
    style: baseStyle(),
    responsive:
      args.mobileRect || args.mobileFontSize
        ? { mobile: { rect: args.mobileRect, fontSize: args.mobileFontSize } }
        : undefined,
    content: {
      text: clip(args.text, 1000),
      align: args.align ?? 'left',
      color: args.color,
      fontSize: args.fontSize ?? 17,
      fontWeight: args.fontWeight ?? 'regular',
      lineHeight: args.lineHeight ?? 1.55,
      letterSpacing: 0,
      fontFamily: 'system-ui',
      as: 'p',
      className: args.className,
    },
  } as BuilderCanvasNode;
}

function buttonNode(args: {
  id: string;
  parentId: string;
  rect: Rect;
  zIndex: number;
  label: string;
  href: string;
  color: string;
  className?: string;
  mobileRect?: Partial<Rect>;
}): BuilderCanvasNode {
  return {
    ...nodeBase(args.id, args.parentId, args.rect, args.zIndex),
    kind: 'button',
    style: baseStyle({
      backgroundColor: args.color,
      borderColor: args.color,
      borderWidth: 1,
      borderRadius: 999,
      shadowY: 14,
      shadowBlur: 28,
      shadowColor: 'rgba(15, 23, 42, 0.2)',
    }),
    responsive: args.mobileRect ? { mobile: { rect: args.mobileRect } } : undefined,
    content: {
      label: clip(args.label, 120),
      href: args.href,
      style: 'cta-shadow',
      className: args.className ?? 'ai-generated-button',
    },
  } as BuilderCanvasNode;
}

function contactHref(locale: Locale): string {
  return locale === 'ko' ? '/ko/contact' : `/${locale}/contact`;
}

function buildHeroSection(
  spec: AiSectionSpec,
  locale: Locale,
  seed: string,
): AiSectionBuildResult {
  const nodes: BuilderCanvasNode[] = [];
  const rootId = makeId(seed, 'root');
  nodes.push(
    containerNode({
      id: rootId,
      rect: { x: 0, y: 0, width: SECTION_WIDTH, height: 560 },
      zIndex: 0,
      label: spec.headline,
      background: '#0f172a',
      as: 'section',
      className: 'ai-generated-section',
      dataTone: 'dark',
      variant: 'hero',
      mobileRect: { height: 760 },
    }),
    headingNode({
      id: makeId(seed, 'headline'),
      parentId: rootId,
      rect: { x: HORIZONTAL_PAD, y: 96, width: CONTENT_WIDTH, height: 160 },
      zIndex: 2,
      text: spec.headline,
      level: 1,
      color: LIGHT_TEXT,
      fontSize: 56,
      className: 'hero-title',
      mobileRect: { x: 32, y: 88, width: SECTION_WIDTH - 64 },
      mobileFontSize: 38,
    }),
  );
  if (spec.subhead) {
    nodes.push(
      textNode({
        id: makeId(seed, 'subhead'),
        parentId: rootId,
        rect: { x: HORIZONTAL_PAD, y: 280, width: 720, height: 80 },
        zIndex: 3,
        text: spec.subhead,
        color: '#cbd5e1',
        fontSize: 18,
        lineHeight: 1.6,
        className: 'hero-subtitle',
        mobileRect: { x: 32, y: 264, width: SECTION_WIDTH - 64 },
      }),
    );
  }
  if (spec.ctaLabel) {
    nodes.push(
      buttonNode({
        id: makeId(seed, 'cta'),
        parentId: rootId,
        rect: { x: HORIZONTAL_PAD, y: 408, width: 200, height: 56 },
        zIndex: 4,
        label: spec.ctaLabel,
        href: contactHref(locale),
        color: ACCENT,
        className: 'ai-generated-button hero-cta',
        mobileRect: { x: 32, y: 412, width: 280 },
      }),
    );
  }
  return { rootId, nodes };
}

function buildFeaturesSection(
  spec: AiSectionSpec,
  locale: Locale,
  seed: string,
): AiSectionBuildResult {
  const items = (spec.items ?? []).slice(0, 6);
  const nodes: BuilderCanvasNode[] = [];
  const rootId = makeId(seed, 'root');
  const columns = items.length >= 4 ? 3 : Math.max(1, items.length || 1);
  const cardGap = 24;
  const cardWidth = Math.floor((CONTENT_WIDTH - cardGap * (columns - 1)) / columns);
  const rows = Math.ceil(items.length / columns) || 1;
  const cardsTop = spec.subhead ? 280 : 220;
  const sectionHeight = cardsTop + rows * 192 + 80;

  nodes.push(
    containerNode({
      id: rootId,
      rect: { x: 0, y: 0, width: SECTION_WIDTH, height: sectionHeight },
      zIndex: 0,
      label: spec.headline,
      background: '#ffffff',
      as: 'section',
      className: 'ai-generated-section',
      dataTone: 'light',
      variant: 'features',
      mobileRect: { height: cardsTop + items.length * 196 + 80 },
    }),
    headingNode({
      id: makeId(seed, 'headline'),
      parentId: rootId,
      rect: { x: HORIZONTAL_PAD, y: 88, width: CONTENT_WIDTH, height: 92 },
      zIndex: 2,
      text: spec.headline,
      level: 2,
      color: DARK_TEXT,
      fontSize: 40,
      className: 'section-title',
      mobileRect: { x: 32, y: 80, width: SECTION_WIDTH - 64 },
      mobileFontSize: 30,
    }),
  );
  if (spec.subhead) {
    nodes.push(
      textNode({
        id: makeId(seed, 'subhead'),
        parentId: rootId,
        rect: { x: HORIZONTAL_PAD, y: 196, width: 760, height: 64 },
        zIndex: 3,
        text: spec.subhead,
        color: MUTED_TEXT,
        fontSize: 17,
        lineHeight: 1.55,
        className: 'section-copy',
        mobileRect: { x: 32, y: 172, width: SECTION_WIDTH - 64 },
      }),
    );
  }
  items.forEach((item, index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;
    const cardId = makeId(seed, 'card', index);
    nodes.push(
      containerNode({
        id: cardId,
        parentId: rootId,
        rect: {
          x: HORIZONTAL_PAD + col * (cardWidth + cardGap),
          y: cardsTop + row * 192,
          width: cardWidth,
          height: 168,
        },
        zIndex: 10 + index * 4,
        label: item.title,
        background: '#f8fafc',
        borderColor: 'rgba(148, 163, 184, 0.28)',
        borderRadius: 18,
        borderWidth: 1,
        padding: 22,
        className: 'ai-generated-card features-card',
        mobileRect: { x: 32, y: cardsTop + index * 196, width: SECTION_WIDTH - 64 },
      }),
      textNode({
        id: makeId(seed, 'card-index', index),
        parentId: cardId,
        rect: { x: 22, y: 18, width: 60, height: 22 },
        zIndex: 11 + index * 4,
        text: `0${index + 1}`.slice(-2),
        color: ACCENT,
        fontSize: 13,
        fontWeight: 'bold',
      }),
      headingNode({
        id: makeId(seed, 'card-title', index),
        parentId: cardId,
        rect: { x: 22, y: 48, width: cardWidth - 44, height: 34 },
        zIndex: 12 + index * 4,
        text: item.title,
        level: 3,
        color: DARK_TEXT,
        fontSize: 20,
        className: 'card-title',
      }),
      textNode({
        id: makeId(seed, 'card-body', index),
        parentId: cardId,
        rect: { x: 22, y: 88, width: cardWidth - 44, height: 64 },
        zIndex: 13 + index * 4,
        text: item.body,
        color: MUTED_TEXT,
        fontSize: 14,
        lineHeight: 1.45,
        className: 'card-copy',
      }),
    );
  });
  return { rootId, nodes };
}

function buildTestimonialsSection(
  spec: AiSectionSpec,
  locale: Locale,
  seed: string,
): AiSectionBuildResult {
  const items = (spec.items ?? []).slice(0, 3);
  const nodes: BuilderCanvasNode[] = [];
  const rootId = makeId(seed, 'root');
  const cardWidth = Math.floor((CONTENT_WIDTH - 48) / Math.max(1, items.length || 1));
  const sectionHeight = 480;

  nodes.push(
    containerNode({
      id: rootId,
      rect: { x: 0, y: 0, width: SECTION_WIDTH, height: sectionHeight },
      zIndex: 0,
      label: spec.headline,
      background: '#f8fafc',
      as: 'section',
      className: 'ai-generated-section',
      dataTone: 'light',
      variant: 'testimonials',
      mobileRect: { height: 240 + items.length * 220 },
    }),
    headingNode({
      id: makeId(seed, 'headline'),
      parentId: rootId,
      rect: { x: HORIZONTAL_PAD, y: 72, width: CONTENT_WIDTH, height: 72 },
      zIndex: 2,
      text: spec.headline,
      level: 2,
      color: DARK_TEXT,
      fontSize: 36,
      align: 'center',
      className: 'section-title',
      mobileRect: { x: 32, y: 64, width: SECTION_WIDTH - 64 },
      mobileFontSize: 28,
    }),
  );
  if (spec.subhead) {
    nodes.push(
      textNode({
        id: makeId(seed, 'subhead'),
        parentId: rootId,
        rect: { x: HORIZONTAL_PAD, y: 152, width: CONTENT_WIDTH, height: 48 },
        zIndex: 3,
        text: spec.subhead,
        color: MUTED_TEXT,
        fontSize: 16,
        align: 'center',
        className: 'section-copy',
        mobileRect: { x: 32, y: 140, width: SECTION_WIDTH - 64 },
      }),
    );
  }
  items.forEach((item, index) => {
    const cardId = makeId(seed, 'quote', index);
    nodes.push(
      containerNode({
        id: cardId,
        parentId: rootId,
        rect: {
          x: HORIZONTAL_PAD + index * (cardWidth + 24),
          y: 232,
          width: cardWidth,
          height: 196,
        },
        zIndex: 10 + index * 3,
        label: item.title,
        background: '#ffffff',
        borderColor: 'rgba(148, 163, 184, 0.24)',
        borderRadius: 20,
        borderWidth: 1,
        padding: 24,
        className: 'ai-generated-card testimonial-card',
        mobileRect: { x: 32, y: 232 + index * 220, width: SECTION_WIDTH - 64 },
      }),
      textNode({
        id: makeId(seed, 'quote-body', index),
        parentId: cardId,
        rect: { x: 24, y: 24, width: cardWidth - 48, height: 96 },
        zIndex: 11 + index * 3,
        text: `“${item.body}”`,
        color: DARK_TEXT,
        fontSize: 16,
        lineHeight: 1.55,
        className: 'card-copy',
      }),
      textNode({
        id: makeId(seed, 'quote-author', index),
        parentId: cardId,
        rect: { x: 24, y: 134, width: cardWidth - 48, height: 28 },
        zIndex: 12 + index * 3,
        text: `— ${item.title}`,
        color: MUTED_TEXT,
        fontSize: 13,
        fontWeight: 'medium',
        className: 'card-copy',
      }),
    );
  });
  return { rootId, nodes };
}

function buildCtaSection(
  spec: AiSectionSpec,
  locale: Locale,
  seed: string,
): AiSectionBuildResult {
  const nodes: BuilderCanvasNode[] = [];
  const rootId = makeId(seed, 'root');
  nodes.push(
    containerNode({
      id: rootId,
      rect: { x: 0, y: 0, width: SECTION_WIDTH, height: 380 },
      zIndex: 0,
      label: spec.headline,
      background: '#0f172a',
      as: 'section',
      className: 'ai-generated-section',
      dataTone: 'dark',
      variant: 'cta',
      mobileRect: { height: 460 },
    }),
    headingNode({
      id: makeId(seed, 'headline'),
      parentId: rootId,
      rect: { x: 240, y: 92, width: 720, height: 80 },
      zIndex: 2,
      text: spec.headline,
      level: 2,
      color: LIGHT_TEXT,
      fontSize: 40,
      align: 'center',
      className: 'hero-title',
      mobileRect: { x: 32, y: 80, width: SECTION_WIDTH - 64 },
      mobileFontSize: 30,
    }),
  );
  if (spec.subhead) {
    nodes.push(
      textNode({
        id: makeId(seed, 'subhead'),
        parentId: rootId,
        rect: { x: 320, y: 188, width: 560, height: 56 },
        zIndex: 3,
        text: spec.subhead,
        color: '#cbd5e1',
        fontSize: 17,
        align: 'center',
        lineHeight: 1.55,
        className: 'hero-subtitle',
        mobileRect: { x: 32, y: 200, width: SECTION_WIDTH - 64 },
      }),
    );
  }
  nodes.push(
    buttonNode({
      id: makeId(seed, 'cta'),
      parentId: rootId,
      rect: { x: 504, y: 268, width: 192, height: 54 },
      zIndex: 4,
      label: spec.ctaLabel || (locale === 'ko' ? '문의하기' : 'Contact us'),
      href: contactHref(locale),
      color: ACCENT,
      className: 'ai-generated-button hero-cta',
      mobileRect: { x: 460, y: 320, width: 280 },
    }),
  );
  return { rootId, nodes };
}

function buildFaqSection(
  spec: AiSectionSpec,
  locale: Locale,
  seed: string,
): AiSectionBuildResult {
  const items = (spec.items ?? []).slice(0, 8);
  const nodes: BuilderCanvasNode[] = [];
  const rootId = makeId(seed, 'root');
  const cardsTop = spec.subhead ? 240 : 180;
  const sectionHeight = cardsTop + items.length * 112 + 64;

  nodes.push(
    containerNode({
      id: rootId,
      rect: { x: 0, y: 0, width: SECTION_WIDTH, height: sectionHeight },
      zIndex: 0,
      label: spec.headline,
      background: '#ffffff',
      as: 'section',
      className: 'ai-generated-section',
      dataTone: 'light',
      variant: 'faq',
      mobileRect: { height: cardsTop + items.length * 132 + 64 },
    }),
    headingNode({
      id: makeId(seed, 'headline'),
      parentId: rootId,
      rect: { x: HORIZONTAL_PAD, y: 76, width: CONTENT_WIDTH, height: 72 },
      zIndex: 2,
      text: spec.headline,
      level: 2,
      color: DARK_TEXT,
      fontSize: 36,
      className: 'section-title',
      mobileRect: { x: 32, y: 64, width: SECTION_WIDTH - 64 },
      mobileFontSize: 28,
    }),
  );
  if (spec.subhead) {
    nodes.push(
      textNode({
        id: makeId(seed, 'subhead'),
        parentId: rootId,
        rect: { x: HORIZONTAL_PAD, y: 152, width: 760, height: 56 },
        zIndex: 3,
        text: spec.subhead,
        color: MUTED_TEXT,
        fontSize: 16,
        lineHeight: 1.55,
        className: 'section-copy',
        mobileRect: { x: 32, y: 144, width: SECTION_WIDTH - 64 },
      }),
    );
  }
  items.forEach((item, index) => {
    const cardId = makeId(seed, 'faq-item', index);
    nodes.push(
      containerNode({
        id: cardId,
        parentId: rootId,
        rect: {
          x: HORIZONTAL_PAD,
          y: cardsTop + index * 112,
          width: CONTENT_WIDTH,
          height: 96,
        },
        zIndex: 10 + index * 3,
        label: item.title,
        background: '#f8fafc',
        borderColor: 'rgba(148, 163, 184, 0.24)',
        borderRadius: 16,
        borderWidth: 1,
        padding: 20,
        className: 'ai-generated-card faq-item',
        mobileRect: { x: 32, y: cardsTop + index * 132, width: SECTION_WIDTH - 64, height: 116 },
      }),
      headingNode({
        id: makeId(seed, 'faq-q', index),
        parentId: cardId,
        rect: { x: 22, y: 18, width: CONTENT_WIDTH - 44, height: 28 },
        zIndex: 11 + index * 3,
        text: item.title,
        level: 3,
        color: DARK_TEXT,
        fontSize: 18,
        className: 'card-title',
      }),
      textNode({
        id: makeId(seed, 'faq-a', index),
        parentId: cardId,
        rect: { x: 22, y: 50, width: CONTENT_WIDTH - 44, height: 32 },
        zIndex: 12 + index * 3,
        text: item.body,
        color: MUTED_TEXT,
        fontSize: 14,
        lineHeight: 1.5,
        className: 'card-copy',
      }),
    );
  });
  return { rootId, nodes };
}

export function buildSectionNodes(args: AiSectionBuildArgs): AiSectionBuildResult {
  const seed = args.seed ?? nextSeed();
  const dispatch: Record<AiSectionKind, (spec: AiSectionSpec, locale: Locale, seed: string) => AiSectionBuildResult> = {
    hero: buildHeroSection,
    features: buildFeaturesSection,
    testimonials: buildTestimonialsSection,
    cta: buildCtaSection,
    faq: buildFaqSection,
  };
  const builder = dispatch[args.spec.sectionKind];
  const result = builder(args.spec, args.locale, seed);
  return {
    rootId: result.rootId,
    nodes: [...result.nodes].sort((left, right) => left.zIndex - right.zIndex),
  };
}

export function describeAiSection(kind: AiSectionKind): string {
  switch (kind) {
    case 'hero':
      return 'Hero';
    case 'features':
      return 'Features grid';
    case 'testimonials':
      return 'Testimonials';
    case 'cta':
      return 'Call to action';
    case 'faq':
      return 'FAQ';
    default:
      return 'Section';
  }
}