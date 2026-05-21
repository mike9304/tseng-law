import type { BuilderCanvasNode, BuilderCanvasNodeStyle, BuilderImageCanvasNode } from '@/lib/builder/canvas/types';
import { normalizeSavedSectionSnapshot } from '@/lib/builder/sections/normalize';
import type { SavedSectionCategory } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';
import type { GeneratedSection } from './content-generator';
import type { GeneratedSiteDraft, GeneratedSitePlanPage, GeneratedVisualBrief } from './orchestrator';

/**
 * Converts a GeneratedSiteDraft into a renderable page canvas.
 *
 * Top-level sections are `container` nodes with `content.as = "section"`.
 * The canvas only renders nested children for container-like kinds, so this
 * keeps generated heading/text/card children visible in editor and publish.
 */

type GeneratedCanvasDraft = Pick<GeneratedSiteDraft, 'spec' | 'blueprint' | 'palette' | 'content' | 'plan'>;

interface BuildArgs {
  draft: GeneratedCanvasDraft;
  locale: Locale;
  pageId: string;
}

export interface GeneratedSectionSnapshot {
  rootNodeId: string;
  sectionKey: string;
  name: string;
  description: string;
  category: SavedSectionCategory;
  nodes: BuilderCanvasNode[];
  sectionTemplateId?: string;
  aiSectionTemplateKind?: string;
  variant?: string;
}

type Rect = BuilderCanvasNode['rect'];
type ImageFilters = BuilderImageCanvasNode['content']['filters'];
type Tone = {
  background: string;
  text: string;
  muted: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  accent: string;
  inverse: string;
};
type AiSectionTemplateId = 'services' | 'insights' | 'faq' | 'offices';

const PAGE_WIDTH = 1200;
const HERO_HEIGHT = 720;
const SECTION_HEIGHT = 620;
const CTA_HEIGHT = 440;
const CONTENT_X = 72;
const CONTENT_WIDTH = PAGE_WIDTH - CONTENT_X * 2;
const DARK_TEXT = '#0f172a';
const MUTED_TEXT = '#475569';
const LIGHT_TEXT = '#f8fafc';
const LIGHT_MUTED_TEXT = '#cbd5e1';
const CARD_BORDER = 'rgba(148, 163, 184, 0.28)';

const VARIANTS = [
  'spotlight',
  'split',
  'elevated',
  'editorial',
  'soft',
  'outline',
  'compact',
  'contrast',
] as const;

function makeId(pageId: string, sectionIndex: number, part: string, itemIndex?: number): string {
  const suffix = itemIndex === undefined ? part : `${part}-${itemIndex}`;
  return `ai-${pageId}-${sectionIndex}-${suffix}`.replace(/[^a-zA-Z0-9_-]/g, '-');
}

function clipText(value: string, maxLength: number): string {
  const compact = value.replace(/\s+/g, ' ').trim();
  if (compact.length <= maxLength) return compact;
  return `${compact.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
}

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.trim().replace(/^#/, '');
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return `rgba(37, 99, 235, ${alpha})`;
  const value = Number.parseInt(normalized, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function style(overrides: Partial<BuilderCanvasNodeStyle> = {}): BuilderCanvasNodeStyle {
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

function makeContainerNode(args: {
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
  variant?: (typeof VARIANTS)[number];
  className?: string;
  as?: 'div' | 'section' | 'article' | 'aside';
  dataTone?: string;
  sectionTemplateId?: AiSectionTemplateId;
  aiSectionTemplateKind?: string;
  style?: Partial<BuilderCanvasNodeStyle>;
  mobileRect?: Partial<Rect>;
}): BuilderCanvasNode {
  const contentRadius = Math.min(args.borderRadius ?? 0, 48);
  return {
    ...nodeBase(args.id, args.parentId, args.rect, args.zIndex),
    kind: 'container',
    style: style({
      backgroundColor: args.background,
      borderColor: args.borderColor ?? 'transparent',
      borderWidth: args.borderWidth ?? 0,
      borderRadius: contentRadius,
      shadowColor: 'rgba(15, 23, 42, 0.12)',
      ...args.style,
    }),
    responsive: args.mobileRect ? { mobile: { rect: args.mobileRect } } : undefined,
    content: {
      label: clipText(args.label, 120),
      background: args.background,
      borderColor: args.borderColor ?? 'transparent',
      borderStyle: 'solid',
      borderWidth: args.borderWidth ?? 0,
      borderRadius: contentRadius,
      padding: args.padding ?? 0,
      layoutMode: 'absolute',
      as: args.as ?? 'div',
      className: args.className,
      dataTone: args.dataTone,
      sectionTemplateId: args.sectionTemplateId,
      aiSectionTemplateKind: args.aiSectionTemplateKind,
      variant: args.variant,
    },
  } as BuilderCanvasNode;
}

function makeHeadingNode(args: {
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
  mobileRect?: Partial<Rect>;
  mobileFontSize?: number;
}): BuilderCanvasNode {
  return {
    ...nodeBase(args.id, args.parentId, args.rect, args.zIndex),
    kind: 'heading',
    style: style(),
    responsive: args.mobileRect || args.mobileFontSize
      ? {
          mobile: {
            rect: args.mobileRect,
            fontSize: args.mobileFontSize,
          },
        }
      : undefined,
    content: {
      text: clipText(args.text, 300),
      level: args.level,
      align: args.align ?? 'left',
      color: args.color,
      fontSize: args.fontSize,
      fontWeight: 'bold',
      lineHeight: args.level === 1 ? 1.04 : 1.12,
      letterSpacing: 0,
      fontFamily: 'system-ui',
      className: args.className,
    },
  } as BuilderCanvasNode;
}

function makeTextNode(args: {
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
  textTransform?: 'none' | 'uppercase';
  className?: string;
  mobileRect?: Partial<Rect>;
  mobileFontSize?: number;
}): BuilderCanvasNode {
  return {
    ...nodeBase(args.id, args.parentId, args.rect, args.zIndex),
    kind: 'text',
    style: style(),
    responsive: args.mobileRect || args.mobileFontSize
      ? {
          mobile: {
            rect: args.mobileRect,
            fontSize: args.mobileFontSize,
          },
        }
      : undefined,
    content: {
      text: clipText(args.text, 1000),
      align: args.align ?? 'left',
      color: args.color,
      fontSize: args.fontSize ?? 17,
      fontWeight: args.fontWeight ?? 'regular',
      lineHeight: args.lineHeight ?? 1.55,
      letterSpacing: 0,
      fontFamily: 'system-ui',
      textTransform: args.textTransform,
      as: 'p',
      className: args.className,
    },
  } as BuilderCanvasNode;
}

function makeButtonNode(args: {
  id: string;
  parentId: string;
  rect: Rect;
  zIndex: number;
  label: string;
  href: string;
  color: string;
  borderColor?: string;
  mode?: 'primary' | 'secondary';
  className?: string;
  mobileRect?: Partial<Rect>;
}): BuilderCanvasNode {
  const isSecondary = args.mode === 'secondary';
  return {
    ...nodeBase(args.id, args.parentId, args.rect, args.zIndex),
    kind: 'button',
    style: style({
      backgroundColor: isSecondary ? 'rgba(255, 255, 255, 0.08)' : args.color,
      borderColor: args.borderColor ?? (isSecondary ? 'rgba(255, 255, 255, 0.34)' : args.color),
      borderWidth: 1,
      borderRadius: 999,
      shadowY: isSecondary ? 0 : 14,
      shadowBlur: isSecondary ? 0 : 28,
      shadowColor: isSecondary ? 'transparent' : 'rgba(15, 23, 42, 0.2)',
    }),
    responsive: args.mobileRect ? { mobile: { rect: args.mobileRect } } : undefined,
    content: {
      label: clipText(args.label, 120),
      href: args.href,
      style: isSecondary ? 'primary-outline' : 'cta-shadow',
      className: args.className ?? 'ai-generated-button',
    },
  } as BuilderCanvasNode;
}

function makeImageNode(args: {
  id: string;
  parentId: string;
  rect: Rect;
  zIndex: number;
  src: string;
  alt: string;
  borderRadius?: number;
  mobileRect?: Partial<Rect>;
  focalPoint?: { x: number; y: number };
  filters?: ImageFilters;
  generationPrompt?: string;
  visualDirection?: string;
}): BuilderCanvasNode {
  return {
    ...nodeBase(args.id, args.parentId, args.rect, args.zIndex),
    kind: 'image',
    style: style({
      borderRadius: args.borderRadius ?? 18,
      shadowY: 16,
      shadowBlur: 34,
      shadowColor: 'rgba(15, 23, 42, 0.18)',
    }),
    responsive: args.mobileRect ? { mobile: { rect: args.mobileRect } } : undefined,
    content: {
      src: args.src,
      alt: clipText(args.alt, 240),
      fit: 'cover',
      cropAspect: '',
      focalPoint: args.focalPoint,
      filters: args.filters,
      generationPrompt: args.generationPrompt ? clipText(args.generationPrompt, 1000) : undefined,
      visualDirection: args.visualDirection ? clipText(args.visualDirection, 600) : undefined,
      link: null,
    },
  } as BuilderCanvasNode;
}

function toneFor(draft: GeneratedCanvasDraft, index: number, dark = false): Tone {
  if (dark) {
    return {
      background: '#0f172a',
      text: LIGHT_TEXT,
      muted: LIGHT_MUTED_TEXT,
      surface: 'rgba(255, 255, 255, 0.1)',
      surfaceAlt: 'rgba(255, 255, 255, 0.16)',
      border: 'rgba(255, 255, 255, 0.2)',
      accent: draft.palette.accent,
      inverse: '#ffffff',
    };
  }

  const warmSurface = index % 2 === 0 ? '#ffffff' : '#f8fafc';
  return {
    background: index % 2 === 0 ? draft.palette.background : '#ffffff',
    text: DARK_TEXT,
    muted: MUTED_TEXT,
    surface: warmSurface,
    surfaceAlt: '#eef2ff',
    border: CARD_BORDER,
    accent: index % 3 === 0 ? draft.palette.primary : draft.palette.accent,
    inverse: '#ffffff',
  };
}

function formatEyebrow(section: GeneratedSection, index: number): string {
  const label = section.sectionId.replace(/[-_]+/g, ' ');
  return index === 0 ? 'AI starter page' : label;
}

function cardTitle(text: string, fallback: string): string {
  const clean = text.replace(/^["'“”]+|["'“”]+$/g, '').trim();
  const split = clean.split(/[:.。]/)[0]?.trim();
  return (split || clean || fallback).slice(0, 72);
}

function cardBody(text: string): string {
  const clean = text.replace(/^["'“”]+|["'“”]+$/g, '').trim();
  if (clean.length <= 160) return clean;
  return `${clean.slice(0, 157).trim()}...`;
}

function fallbackVisualBrief(draft: GeneratedCanvasDraft): GeneratedVisualBrief {
  const direction = draft.spec.visualDirection?.trim()
    || draft.plan.brandBrief.constraints
    || `${draft.spec.industry} website hero image with polished editorial styling`;
  return {
    direction,
    imagePrompt: clipText([
      `Create a polished website hero image for ${draft.spec.companyName}.`,
      `Industry: ${draft.spec.industry}.`,
      `Direction: ${direction}.`,
      'No readable text, no logos, no private documents.',
    ].join(' '), 900),
    treatment: 'professional split hero with layered media card, subtle image filter, proof cards, and accent chips',
    composition: 'Clear headline block, media-ready hero card, reusable content cards, and mobile-safe vertical stacking.',
  };
}

function visualBriefFor(draft: GeneratedCanvasDraft): GeneratedVisualBrief {
  return draft.plan.visualBrief || fallbackVisualBrief(draft);
}

function imageFiltersFor(draft: GeneratedCanvasDraft): ImageFilters {
  if (draft.spec.tone === 'luxury') {
    return { brightness: 92, contrast: 112, saturation: 88, blur: 0, grayscale: 0, sepia: 6 };
  }
  if (draft.spec.tone === 'playful' || draft.spec.colorPreference === 'pastel') {
    return { brightness: 104, contrast: 96, saturation: 114, blur: 0, grayscale: 0, sepia: 0 };
  }
  if (draft.spec.tone === 'authoritative' || draft.spec.colorPreference === 'high-contrast') {
    return { brightness: 86, contrast: 118, saturation: 90, blur: 0, grayscale: 12, sepia: 0 };
  }
  return { brightness: 96, contrast: 108, saturation: 96, blur: 0, grayscale: 0, sepia: 0 };
}

function builderAssetUrlFromId(assetId: string, locale: Locale): string | null {
  const match = /^builder\/assets\/(ko|en|zh-hant)\/([A-Za-z0-9._-]+\.(?:jpe?g|png|webp|gif|svg))$/i.exec(assetId);
  if (!match || match[1] !== locale) return null;
  return `/api/builder/assets/${match[1]}/${match[2]}`;
}

function heroMediaFor(draft: GeneratedCanvasDraft): { src: string; alt: string; focalPoint?: { x: number; y: number } } {
  const isKorean = draft.spec.locale === 'ko';
  const visualBrief = visualBriefFor(draft);
  const heroImageAsset = draft.spec.heroImageAsset;
  const heroAssetUrl = heroImageAsset ? builderAssetUrlFromId(heroImageAsset.assetId, draft.spec.locale) : null;
  if (heroImageAsset && heroAssetUrl) {
    return {
      src: heroAssetUrl,
      alt: clipText(heroImageAsset.alt || heroImageAsset.filename || visualBrief.direction, 240),
      focalPoint: { x: 50, y: 50 },
    };
  }
  const visualText = `${visualBrief.direction} ${visualBrief.imagePrompt}`.toLowerCase();
  if (/(taipei|대만|타이베이|city|도시|skyline|스카이라인)/i.test(visualText)) {
    return {
      src: '/images/header-skyline-buildings.webp',
      alt: clipText(visualBrief.direction, 240),
      focalPoint: { x: 52, y: 44 },
    };
  }
  if (/(office|사무소|회의|consult|상담|professional|전문)/i.test(visualText)) {
    return {
      src: '/images/header-skyline-ratio.webp',
      alt: clipText(visualBrief.direction, 240),
      focalPoint: { x: 50, y: 44 },
    };
  }
  if (['law', 'accounting', 'consulting', 'tech', 'saas', 'agency'].includes(draft.spec.industry)) {
    return {
      src: '/images/header-skyline-buildings.webp',
      alt: clipText(visualBrief.direction || (isKorean ? '도시 스카이라인과 전문 서비스 이미지' : 'City skyline for a professional service website'), 240),
      focalPoint: { x: 52, y: 44 },
    };
  }
  if (['restaurant', 'cafe', 'bakery'].includes(draft.spec.industry)) {
    return {
      src: '/images/hero-bg-03.webp',
      alt: clipText(visualBrief.direction || (isKorean ? '브랜드 공간을 보여주는 대표 이미지' : 'Brand space hero image'), 240),
      focalPoint: { x: 50, y: 50 },
    };
  }
  if (['medical', 'dental', 'fitness', 'yoga', 'beauty'].includes(draft.spec.industry)) {
    return {
      src: '/images/hero-bg-02.webp',
      alt: clipText(visualBrief.direction || (isKorean ? '상담과 케어를 표현하는 대표 이미지' : 'Care and consultation hero image'), 240),
      focalPoint: { x: 50, y: 48 },
    };
  }
  return {
    src: '/images/hero-bg-01.webp',
    alt: clipText(visualBrief.direction || (isKorean ? '브랜드 소개용 대표 이미지' : 'Brand introduction hero image'), 240),
    focalPoint: { x: 50, y: 50 },
  };
}

function makeSectionRoot(args: {
  pageId: string;
  sectionIndex: number;
  y: number;
  height: number;
  section: GeneratedSection;
  tone: Tone;
  dark?: boolean;
  mobileHeight?: number;
}): BuilderCanvasNode {
  const sectionTemplateId = sectionTemplateFor(args.section.sectionId);
  return makeContainerNode({
    id: makeId(args.pageId, args.sectionIndex, 'section'),
    rect: { x: 0, y: args.y, width: PAGE_WIDTH, height: args.height },
    zIndex: args.sectionIndex * 100,
    label: args.section.headline,
    background: args.tone.background,
    borderColor: 'transparent',
    borderRadius: 0,
    className: 'ai-generated-section',
    as: 'section',
    dataTone: args.dark ? 'dark' : 'light',
    sectionTemplateId,
    aiSectionTemplateKind: sectionTemplateId ?? args.section.sectionId,
    variant: VARIANTS[args.sectionIndex % VARIANTS.length],
    mobileRect: args.mobileHeight ? { height: args.mobileHeight } : undefined,
  });
}

function sectionTemplateFor(sectionId: string): AiSectionTemplateId | undefined {
  if (['services', 'expertise', 'process', 'pricing', 'team'].includes(sectionId)) return 'services';
  if (['faq'].includes(sectionId)) return 'faq';
  if (['reviews', 'gallery', 'about'].includes(sectionId)) return 'insights';
  if (['contact'].includes(sectionId)) return 'offices';
  return undefined;
}

function cardClassNameFor(templateId: AiSectionTemplateId | undefined, index: number): string {
  const base = 'ai-generated-card';
  if (templateId === 'services') return `${base} services-detail-card`;
  if (templateId === 'faq') return `${base} faq-item`;
  if (templateId === 'insights') return `${base} ${index === 0 ? 'insights-featured' : 'insights-list-wrap'}`;
  if (templateId === 'offices') return `${base} office-card`;
  return base;
}

function pushHero(nodes: BuilderCanvasNode[], draft: GeneratedCanvasDraft, pageId: string): number {
  const section = draft.content.hero;
  const tone = toneFor(draft, 0, true);
  const root = makeSectionRoot({
    pageId,
    sectionIndex: 0,
    y: 0,
    height: HERO_HEIGHT,
    section,
    tone,
    dark: true,
    mobileHeight: 1240,
  });
  nodes.push(root);
  const rootId = root.id;

  nodes.push(
    makeTextNode({
      id: makeId(pageId, 0, 'eyebrow'),
      parentId: rootId,
      rect: { x: CONTENT_X, y: 82, width: 280, height: 32 },
      zIndex: 1,
      text: formatEyebrow(section, 0),
      color: tone.accent,
      fontSize: 13,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      className: 'hero-eyebrow',
    }),
    makeHeadingNode({
      id: makeId(pageId, 0, 'headline'),
      parentId: rootId,
      rect: { x: CONTENT_X, y: 132, width: 640, height: 162 },
      zIndex: 2,
      text: section.headline,
      level: 1,
      color: tone.text,
      fontSize: 56,
      className: 'hero-title',
      mobileRect: { x: 48, y: 118, width: 1060 },
      mobileFontSize: 42,
    }),
    makeTextNode({
      id: makeId(pageId, 0, 'body'),
      parentId: rootId,
      rect: { x: CONTENT_X, y: 318, width: 560, height: 96 },
      zIndex: 3,
      text: section.body,
      color: tone.muted,
      fontSize: 18,
      lineHeight: 1.6,
      className: 'hero-subtitle',
      mobileRect: { x: 48, y: 310, width: 1040 },
    }),
  );

  const ctaLabel = section.ctaLabel || 'Get started';
  nodes.push(
    makeButtonNode({
      id: makeId(pageId, 0, 'primary-cta'),
      parentId: rootId,
      rect: { x: CONTENT_X, y: 456, width: 184, height: 54 },
      zIndex: 4,
      label: ctaLabel,
      href: draft.spec.locale === 'ko' ? '/ko/contact' : `/${draft.spec.locale}/contact`,
      color: tone.accent,
      className: 'ai-generated-button hero-cta',
      mobileRect: { x: 48, y: 438, width: 280 },
    }),
    makeButtonNode({
      id: makeId(pageId, 0, 'secondary-cta'),
      parentId: rootId,
      rect: { x: 276, y: 456, width: 184, height: 54 },
      zIndex: 5,
      label: draft.spec.locale === 'ko' ? '서비스 보기' : 'View services',
      href: draft.spec.locale === 'ko' ? '/ko/services' : `/${draft.spec.locale}/services`,
      color: tone.accent,
      mode: 'secondary',
      className: 'ai-generated-button hero-cta',
      mobileRect: { x: 348, y: 438, width: 280 },
    }),
  );

  const proofItems = [
    ...(draft.spec.goals && draft.spec.goals.length > 0 ? draft.spec.goals : []),
    draft.blueprint.heroHeadlineHint,
    draft.spec.audience || 'Clear next step',
    draft.spec.brandKeywords?.[0] || 'Fast launch',
  ].filter(Boolean).slice(0, 3);
  proofItems.forEach((item, index) => {
    const cardId = makeId(pageId, 0, 'proof-card', index);
    nodes.push(
      makeContainerNode({
        id: cardId,
        parentId: rootId,
        rect: { x: CONTENT_X + index * 196, y: 556, width: 176, height: 82 },
        zIndex: 10 + index * 3,
        label: `Proof ${index + 1}`,
        background: tone.surface,
        borderColor: tone.border,
        borderRadius: 18,
        borderWidth: 1,
        padding: 18,
        className: 'ai-generated-proof-card stat-card',
        variant: 'soft',
        style: {
          shadowY: 18,
          shadowBlur: 36,
          shadowColor: 'rgba(0, 0, 0, 0.18)',
        },
        mobileRect: { x: 48, y: 548 + index * 94, width: 1040, height: 78 },
      }),
      makeTextNode({
        id: makeId(pageId, 0, 'proof-label', index),
        parentId: cardId,
        rect: { x: 18, y: 14, width: 130, height: 20 },
        zIndex: 11 + index * 3,
        text: `0${index + 1}`,
        color: tone.accent,
        fontSize: 12,
        fontWeight: 'bold',
        mobileRect: { x: 18, y: 16, width: 54 },
      }),
      makeTextNode({
        id: makeId(pageId, 0, 'proof-copy', index),
        parentId: cardId,
        rect: { x: 18, y: 38, width: 136, height: 30 },
        zIndex: 12 + index * 3,
        text: item,
        color: tone.text,
        fontSize: 13,
        fontWeight: 'medium',
        lineHeight: 1.2,
        className: 'card-copy',
        mobileRect: { x: 92, y: 16, width: 890, height: 44 },
      }),
    );
  });

  const visualId = makeId(pageId, 0, 'visual');
  const visualBrief = visualBriefFor(draft);
  const heroMedia = heroMediaFor(draft);
  const visualAccent = hexToRgba(draft.palette.accent, 0.16);
  const visualRule = hexToRgba(draft.palette.primary, 0.18);
  nodes.push(
    makeContainerNode({
      id: visualId,
      parentId: rootId,
      rect: { x: 760, y: 92, width: 356, height: 470 },
      zIndex: 28,
      label: 'Brand system preview',
      background: '#ffffff',
      borderColor: 'rgba(255, 255, 255, 0.28)',
      borderRadius: 28,
      borderWidth: 1,
      padding: 28,
      className: 'ai-generated-visual-card split-image',
      variant: 'spotlight',
      style: {
        shadowY: 30,
        shadowBlur: 70,
        shadowColor: 'rgba(0, 0, 0, 0.28)',
      },
      mobileRect: { x: 48, y: 846, width: 1060, height: 360 },
    }),
    makeContainerNode({
      id: makeId(pageId, 0, 'visual-frame'),
      parentId: visualId,
      rect: { x: 18, y: 18, width: 320, height: 170 },
      zIndex: 29,
      label: 'Visual frame',
      background: visualAccent,
      borderColor: hexToRgba(draft.palette.accent, 0.22),
      borderRadius: 24,
      borderWidth: 1,
      className: 'ai-generated-visual-frame',
      variant: 'soft',
      mobileRect: { x: 18, y: 18, width: 420, height: 312 },
    }),
    makeImageNode({
      id: makeId(pageId, 0, 'hero-media'),
      parentId: visualId,
      rect: { x: 28, y: 28, width: 300, height: 150 },
      zIndex: 30,
      src: heroMedia.src,
      alt: heroMedia.alt,
      borderRadius: 20,
      focalPoint: heroMedia.focalPoint,
      filters: imageFiltersFor(draft),
      generationPrompt: visualBrief.imagePrompt,
      visualDirection: visualBrief.direction,
      mobileRect: { x: 28, y: 26, width: 390, height: 292 },
    }),
    makeContainerNode({
      id: makeId(pageId, 0, 'media-badge'),
      parentId: visualId,
      rect: { x: 48, y: 136, width: 142, height: 28 },
      zIndex: 31,
      label: 'Media badge',
      background: 'rgba(15, 23, 42, 0.78)',
      borderColor: 'rgba(255, 255, 255, 0.26)',
      borderRadius: 999,
      borderWidth: 1,
      className: 'ai-generated-media-badge',
      variant: 'compact',
      mobileRect: { x: 54, y: 274, width: 168 },
    }),
    makeTextNode({
      id: makeId(pageId, 0, 'media-badge-text'),
      parentId: makeId(pageId, 0, 'media-badge'),
      rect: { x: 14, y: 7, width: 114, height: 14 },
      zIndex: 32,
      text: draft.spec.locale === 'ko' ? 'Image 2.0 준비' : 'Image 2.0 ready',
      color: '#ffffff',
      fontSize: 12,
      fontWeight: 'bold',
      lineHeight: 1,
      className: 'ai-generated-media-badge-text',
    }),
    makeContainerNode({
      id: makeId(pageId, 0, 'prompt-chip'),
      parentId: visualId,
      rect: { x: 206, y: 136, width: 112, height: 28 },
      zIndex: 33,
      label: 'Image prompt safety chip',
      background: 'rgba(255, 255, 255, 0.86)',
      borderColor: 'rgba(15, 23, 42, 0.12)',
      borderRadius: 999,
      borderWidth: 1,
      className: 'ai-generated-prompt-chip',
      variant: 'compact',
      mobileRect: { x: 240, y: 274, width: 150, height: 28 },
    }),
    makeTextNode({
      id: makeId(pageId, 0, 'prompt-chip-text'),
      parentId: makeId(pageId, 0, 'prompt-chip'),
      rect: { x: 12, y: 7, width: 88, height: 14 },
      zIndex: 34,
      text: draft.spec.locale === 'ko' ? '텍스트 없는 이미지' : 'No text image',
      color: DARK_TEXT,
      fontSize: 12,
      fontWeight: 'bold',
      lineHeight: 1,
      className: 'ai-generated-prompt-chip-text',
      mobileRect: { x: 12, y: 7, width: 126, height: 14 },
    }),
    makeContainerNode({
      id: makeId(pageId, 0, 'visual-rule'),
      parentId: visualId,
      rect: { x: 30, y: 192, width: 270, height: 2 },
      zIndex: 35,
      label: 'Visual rhythm rule',
      background: visualRule,
      borderColor: 'transparent',
      borderRadius: 999,
      className: 'ai-generated-visual-rule',
      variant: 'compact',
      mobileRect: { x: 460, y: 168, width: 520, height: 2 },
    }),
    makeTextNode({
      id: makeId(pageId, 0, 'visual-kicker'),
      parentId: visualId,
      rect: { x: 30, y: 202, width: 230, height: 24 },
      zIndex: 36,
      text: draft.spec.companyName,
      color: draft.palette.primary,
      fontSize: 13,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      mobileRect: { x: 460, y: 44, width: 520, height: 24 },
    }),
    makeHeadingNode({
      id: makeId(pageId, 0, 'visual-title'),
      parentId: visualId,
      rect: { x: 30, y: 238, width: 268, height: 72 },
      zIndex: 37,
      text: draft.plan.brandBrief.audience,
      level: 3,
      color: DARK_TEXT,
      fontSize: 26,
      className: 'card-title',
      mobileRect: { x: 460, y: 80, width: 520, height: 86 },
      mobileFontSize: 30,
    }),
    makeTextNode({
      id: makeId(pageId, 0, 'visual-copy'),
      parentId: visualId,
      rect: { x: 30, y: 324, width: 270, height: 54 },
      zIndex: 38,
      text: visualBrief.treatment,
      color: MUTED_TEXT,
      fontSize: 14,
      lineHeight: 1.35,
      className: 'card-copy',
      mobileRect: { x: 460, y: 190, width: 520, height: 72 },
    }),
  );

  const keywordItems = draft.plan.brandBrief.keywords.slice(0, 3);
  keywordItems.forEach((keyword, index) => {
    nodes.push(
      makeContainerNode({
        id: makeId(pageId, 0, 'keyword-chip', index),
        parentId: visualId,
        rect: { x: 30 + index * 94, y: 404, width: 86, height: 30 },
        zIndex: 42 + index,
        label: `Keyword ${index + 1}`,
        background: index === 0 ? draft.palette.primary : '#f8fafc',
        borderColor: index === 0 ? draft.palette.primary : '#e2e8f0',
        borderRadius: 999,
        borderWidth: 1,
        className: 'ai-generated-chip',
        variant: 'compact',
        mobileRect: { x: 460 + index * 170, y: 284, width: 150, height: 32 },
      }),
      makeTextNode({
        id: makeId(pageId, 0, 'keyword-text', index),
        parentId: makeId(pageId, 0, 'keyword-chip', index),
        rect: { x: 10, y: 6, width: 66, height: 18 },
        zIndex: 46 + index,
        text: keyword,
        color: index === 0 ? '#ffffff' : DARK_TEXT,
        fontSize: 12,
        fontWeight: 'medium',
        mobileRect: { x: 12, y: 7, width: 126, height: 18 },
      }),
    );
  });

  const paletteSwatches = [draft.palette.primary, draft.palette.accent, draft.palette.background];
  paletteSwatches.forEach((color, index) => {
    nodes.push(
      makeContainerNode({
        id: makeId(pageId, 0, 'palette-swatch', index),
        parentId: visualId,
        rect: { x: 30 + index * 44, y: 448, width: 36, height: 8 },
        zIndex: 50 + index,
        label: `Palette swatch ${index + 1}`,
        background: color,
        borderColor: index === 2 ? 'rgba(15, 23, 42, 0.12)' : color,
        borderRadius: 999,
        borderWidth: 1,
        className: 'ai-generated-palette-swatch',
        variant: 'compact',
        mobileRect: { x: 460 + index * 52, y: 332, width: 42, height: 10 },
      }),
    );
  });

  return HERO_HEIGHT;
}

function pushContentSection(
  nodes: BuilderCanvasNode[],
  draft: GeneratedCanvasDraft,
  pageId: string,
  section: GeneratedSection,
  sectionIndex: number,
  y: number,
): number {
  const tone = toneFor(draft, sectionIndex);
  const bullets = (section.bullets && section.bullets.length > 0 ? section.bullets : [section.body]).slice(0, 6);
  const top = 304;
  const mobileCardTop = section.ctaLabel ? 444 : top;
  const mobileHeight = Math.max(SECTION_HEIGHT, mobileCardTop + bullets.length * 152 + 80);
  const root = makeSectionRoot({
    pageId,
    sectionIndex,
    y,
    height: SECTION_HEIGHT,
    section,
    tone,
    mobileHeight,
  });
  nodes.push(root);
  const rootId = root.id;
  const sectionTemplateId = sectionTemplateFor(section.sectionId);

  nodes.push(
    makeContainerNode({
      id: makeId(pageId, sectionIndex, 'accent-rail'),
      parentId: rootId,
      rect: { x: 48, y: 74, width: 8, height: 154 },
      zIndex: sectionIndex * 100 + 1,
      label: 'Editorial accent rail',
      background: hexToRgba(tone.accent, 0.82),
      borderColor: 'transparent',
      borderRadius: 999,
      className: 'ai-generated-section-accent-rail',
      variant: 'compact',
      mobileRect: { x: 48, y: 74, width: 96, height: 6 },
    }),
    makeContainerNode({
      id: makeId(pageId, sectionIndex, 'section-number-pill'),
      parentId: rootId,
      rect: { x: 1020, y: 70, width: 92, height: 38 },
      zIndex: sectionIndex * 100 + 2,
      label: 'Section number pill',
      background: sectionIndex % 2 === 0 ? hexToRgba(tone.accent, 0.12) : '#ffffff',
      borderColor: tone.border,
      borderRadius: 999,
      borderWidth: 1,
      className: 'ai-generated-section-number-pill',
      variant: 'compact',
      mobileRect: { x: 958, y: 58, width: 120, height: 38 },
    }),
    makeTextNode({
      id: makeId(pageId, sectionIndex, 'section-number-text'),
      parentId: makeId(pageId, sectionIndex, 'section-number-pill'),
      rect: { x: 18, y: 10, width: 56, height: 18 },
      zIndex: sectionIndex * 100 + 3,
      text: `S-${String(sectionIndex).padStart(2, '0')}`,
      color: tone.text,
      fontSize: 12,
      fontWeight: 'bold',
      lineHeight: 1,
      className: 'ai-generated-section-number-text',
      mobileRect: { x: 18, y: 10, width: 84, height: 18 },
    }),
    makeTextNode({
      id: makeId(pageId, sectionIndex, 'eyebrow'),
      parentId: rootId,
      rect: { x: CONTENT_X, y: 70, width: 320, height: 28 },
      zIndex: sectionIndex * 100 + 4,
      text: formatEyebrow(section, sectionIndex),
      color: tone.accent,
      fontSize: 13,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      className: 'section-label',
    }),
    makeHeadingNode({
      id: makeId(pageId, sectionIndex, 'headline'),
      parentId: rootId,
      rect: { x: CONTENT_X, y: 114, width: 520, height: 110 },
      zIndex: sectionIndex * 100 + 5,
      text: section.headline,
      level: 2,
      color: tone.text,
      fontSize: 42,
      className: 'section-title',
      mobileRect: { x: 48, y: 108, width: 1040 },
      mobileFontSize: 34,
    }),
    makeTextNode({
      id: makeId(pageId, sectionIndex, 'body'),
      parentId: rootId,
      rect: { x: 690, y: 116, width: 420, height: 112 },
      zIndex: sectionIndex * 100 + 6,
      text: section.body,
      color: tone.muted,
      fontSize: 17,
      lineHeight: 1.58,
      className: 'section-copy',
      mobileRect: { x: 48, y: 228, width: 1040 },
    }),
  );

  const columns = bullets.length >= 4 ? 3 : Math.max(1, bullets.length);
  const cardWidth = columns === 3 ? 320 : columns === 2 ? 504 : CONTENT_WIDTH;
  const cardGap = 32;
  bullets.forEach((bullet, index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;
    const cardId = makeId(pageId, sectionIndex, 'card', index);
    const cardX = CONTENT_X + col * (cardWidth + cardGap);
    const cardY = top + row * 156;
    nodes.push(
      makeContainerNode({
        id: cardId,
        parentId: rootId,
        rect: { x: cardX, y: cardY, width: cardWidth, height: 132 },
        zIndex: sectionIndex * 100 + 10 + index * 4,
        label: `${section.sectionId} card ${index + 1}`,
        background: index === 0 && sectionIndex % 2 === 1 ? tone.surfaceAlt : tone.surface,
        borderColor: tone.border,
        borderRadius: 22,
        borderWidth: 1,
        padding: 22,
        className: cardClassNameFor(sectionTemplateId, index),
        variant: VARIANTS[sectionIndex % VARIANTS.length],
        style: {
          shadowY: 18,
          shadowBlur: 42,
          shadowColor: 'rgba(15, 23, 42, 0.09)',
        },
        mobileRect: { x: 48, y: mobileCardTop + index * 152, width: 1040 },
      }),
      makeTextNode({
        id: makeId(pageId, sectionIndex, 'card-index', index),
        parentId: cardId,
        rect: { x: 22, y: 18, width: 42, height: 22 },
        zIndex: sectionIndex * 100 + 11 + index * 4,
        text: `${index + 1}`.padStart(2, '0'),
        color: tone.accent,
        fontSize: 13,
        fontWeight: 'bold',
      }),
      makeHeadingNode({
        id: makeId(pageId, sectionIndex, 'card-title', index),
        parentId: cardId,
        rect: { x: 22, y: 48, width: cardWidth - 44, height: 30 },
        zIndex: sectionIndex * 100 + 12 + index * 4,
        text: cardTitle(bullet, section.headline),
        level: 3,
        color: tone.text,
        fontSize: 20,
        className: 'card-title',
      }),
      makeTextNode({
        id: makeId(pageId, sectionIndex, 'card-body', index),
        parentId: cardId,
        rect: { x: 22, y: 82, width: cardWidth - 44, height: 34 },
        zIndex: sectionIndex * 100 + 13 + index * 4,
        text: cardBody(bullet),
        color: tone.muted,
        fontSize: 14,
        lineHeight: 1.35,
        className: 'card-copy',
      }),
    );
  });

  if (section.ctaLabel) {
    nodes.push(makeButtonNode({
      id: makeId(pageId, sectionIndex, 'cta'),
      parentId: rootId,
      rect: { x: CONTENT_X, y: 236, width: 184, height: 50 },
      zIndex: sectionIndex * 100 + 70,
      label: section.ctaLabel,
      href: draft.spec.locale === 'ko' ? '/ko/contact' : `/${draft.spec.locale}/contact`,
      color: tone.accent,
      className: 'ai-generated-button hero-cta',
      mobileRect: { x: 48, y: 360, width: 1040, height: 56 },
    }));
  }

  return SECTION_HEIGHT;
}

function pushFinalCta(nodes: BuilderCanvasNode[], draft: GeneratedCanvasDraft, pageId: string, y: number): number {
  const tone = toneFor(draft, 99, true);
  const section: GeneratedSection = draft.content.sections.find((item) => item.sectionId === 'cta') ?? {
    sectionId: 'cta',
    headline: `Ready to work with ${draft.spec.companyName}?`,
    body: draft.plan.brandBrief.goals[0] || 'Start with a focused consultation and move with a clear plan.',
    ctaLabel: '상담 예약',
  };
  const sectionIndex = draft.content.sections.length + 1;
  const root = makeSectionRoot({
    pageId,
    sectionIndex,
    y,
    height: CTA_HEIGHT,
    section,
    tone,
    dark: true,
    mobileHeight: CTA_HEIGHT,
  });
  nodes.push(root);
  const rootId = root.id;
  nodes.push(
    makeTextNode({
      id: makeId(pageId, sectionIndex, 'eyebrow'),
      parentId: rootId,
      rect: { x: 440, y: 72, width: 320, height: 28 },
      zIndex: sectionIndex * 100 + 1,
      text: 'Next step',
      color: tone.accent,
      fontSize: 13,
      fontWeight: 'bold',
      align: 'center',
      textTransform: 'uppercase',
      className: 'hero-eyebrow',
    }),
    makeHeadingNode({
      id: makeId(pageId, sectionIndex, 'headline'),
      parentId: rootId,
      rect: { x: 240, y: 118, width: 720, height: 104 },
      zIndex: sectionIndex * 100 + 2,
      text: section.headline,
      level: 2,
      color: tone.text,
      fontSize: 44,
      align: 'center',
      className: 'hero-title',
      mobileRect: { x: 48, y: 108, width: 1040 },
      mobileFontSize: 34,
    }),
    makeTextNode({
      id: makeId(pageId, sectionIndex, 'body'),
      parentId: rootId,
      rect: { x: 328, y: 246, width: 544, height: 64 },
      zIndex: sectionIndex * 100 + 3,
      text: section.body,
      color: tone.muted,
      fontSize: 17,
      align: 'center',
      lineHeight: 1.5,
      className: 'hero-subtitle',
      mobileRect: { x: 64, y: 238, width: 1010 },
    }),
    makeButtonNode({
      id: makeId(pageId, sectionIndex, 'cta'),
      parentId: rootId,
      rect: { x: 508, y: 338, width: 184, height: 54 },
      zIndex: sectionIndex * 100 + 4,
      label: section.ctaLabel || 'Start now',
      href: draft.spec.locale === 'ko' ? '/ko/contact' : `/${draft.spec.locale}/contact`,
      color: tone.accent,
      className: 'ai-generated-button hero-cta',
      mobileRect: { x: 460, y: 340, width: 280 },
    }),
    makeContainerNode({
      id: makeId(pageId, sectionIndex, 'trust-strip'),
      parentId: rootId,
      rect: { x: 338, y: 402, width: 524, height: 28 },
      zIndex: sectionIndex * 100 + 5,
      label: 'CTA trust strip',
      background: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'rgba(255, 255, 255, 0.18)',
      borderRadius: 999,
      borderWidth: 1,
      className: 'ai-generated-cta-trust-strip',
      variant: 'compact',
      mobileRect: { x: 48, y: 400, width: 1040, height: 30 },
    }),
    makeTextNode({
      id: makeId(pageId, sectionIndex, 'trust-strip-text'),
      parentId: makeId(pageId, sectionIndex, 'trust-strip'),
      rect: { x: 22, y: 7, width: 480, height: 14 },
      zIndex: sectionIndex * 100 + 6,
      text: draft.spec.locale === 'ko'
        ? '편집 가능한 AI 레이아웃 / 모바일 안전 CTA / 브랜드 톤 유지'
        : 'Editable AI layout / mobile-safe CTA / brand tone preserved',
      color: tone.muted,
      fontSize: 12,
      fontWeight: 'medium',
      align: 'center',
      lineHeight: 1,
      className: 'ai-generated-cta-trust-strip-text',
      mobileRect: { x: 24, y: 8, width: 992, height: 14 },
    }),
  );

  return CTA_HEIGHT;
}

export function draftToCanvasNodes(args: BuildArgs): BuilderCanvasNode[] {
  const { draft, pageId } = args;
  const nodes: BuilderCanvasNode[] = [];
  let y = pushHero(nodes, draft, pageId);

  const contentSections = draft.content.sections.filter((section) => section.sectionId !== 'cta');
  contentSections.forEach((section, index) => {
    y += pushContentSection(nodes, draft, pageId, section, index + 1, y);
  });
  pushFinalCta(nodes, draft, pageId, y);

  return nodes.sort((left, right) => left.zIndex - right.zIndex);
}

export function draftToSitemapPageCanvasNodes(
  args: BuildArgs & { page: GeneratedSitePlanPage },
): BuilderCanvasNode[] {
  const { draft, page, pageId } = args;
  const nodes: BuilderCanvasNode[] = [];
  const tone = toneFor(draft, 2);
  const mobileCardY = 492;
  const section: GeneratedSection = {
    sectionId: page.sections.includes('faq') ? 'faq' : page.sections.includes('services') ? 'services' : 'overview',
    headline: page.title,
    body: page.purpose,
    ctaLabel: draft.spec.locale === 'ko' ? '문의하기' : 'Contact',
    bullets: page.sections.map((item) => item.replace(/[-_]+/g, ' ')),
  };
  const root = makeSectionRoot({
    pageId,
    sectionIndex: 0,
    y: 0,
    height: 700,
    section,
    tone,
    mobileHeight: Math.max(900, 450 + page.sections.length * 122 + 80),
  });
  nodes.push(root);
  const rootId = root.id;
  nodes.push(
    makeTextNode({
      id: makeId(pageId, 0, 'eyebrow'),
      parentId: rootId,
      rect: { x: CONTENT_X, y: 76, width: 320, height: 28 },
      zIndex: 1,
      text: 'AI sitemap draft',
      color: tone.accent,
      fontSize: 13,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      className: 'section-label',
    }),
    makeContainerNode({
      id: makeId(pageId, 0, 'sitemap-page-frame'),
      parentId: rootId,
      rect: { x: 720, y: 88, width: 408, height: 322 },
      zIndex: 1,
      label: 'Editable sitemap page frame',
      background: hexToRgba(tone.accent, 0.08),
      borderColor: hexToRgba(tone.accent, 0.18),
      borderRadius: 28,
      borderWidth: 1,
      className: 'ai-generated-sitemap-page-frame',
      mobileRect: { x: 24, y: 52, width: 1092, height: 412 },
    }),
    makeContainerNode({
      id: makeId(pageId, 0, 'sitemap-accent-band'),
      parentId: rootId,
      rect: { x: CONTENT_X, y: 64, width: 128, height: 6 },
      zIndex: 1,
      label: 'Sitemap accent band',
      background: tone.accent,
      borderRadius: 999,
      className: 'ai-generated-sitemap-accent-band',
      mobileRect: { x: 48, y: 82, width: 112, height: 6 },
    }),
    makeContainerNode({
      id: makeId(pageId, 0, 'sitemap-page-pill'),
      parentId: rootId,
      rect: { x: 980, y: 72, width: 118, height: 38 },
      zIndex: 2,
      label: 'AI sitemap page marker',
      background: tone.surface,
      borderColor: tone.border,
      borderRadius: 999,
      borderWidth: 1,
      padding: 12,
      className: 'ai-generated-sitemap-page-pill',
      mobileRect: { x: 920, y: 58, width: 148, height: 36 },
    }),
    makeTextNode({
      id: makeId(pageId, 0, 'sitemap-page-pill-text'),
      parentId: makeId(pageId, 0, 'sitemap-page-pill'),
      rect: { x: 18, y: 8, width: 82, height: 18 },
      zIndex: 3,
      text: draft.spec.locale === 'ko' ? 'AI 페이지' : 'AI page',
      color: tone.accent,
      fontSize: 12,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      className: 'ai-generated-sitemap-page-pill-text',
    }),
    makeHeadingNode({
      id: makeId(pageId, 0, 'headline'),
      parentId: rootId,
      rect: { x: CONTENT_X, y: 124, width: 640, height: 104 },
      zIndex: 2,
      text: page.title,
      level: 1,
      color: tone.text,
      fontSize: 48,
      className: 'hero-title',
      mobileRect: { x: 48, y: 112, width: 1040 },
      mobileFontSize: 38,
    }),
    makeTextNode({
      id: makeId(pageId, 0, 'body'),
      parentId: rootId,
      rect: { x: CONTENT_X, y: 252, width: 580, height: 96 },
      zIndex: 3,
      text: page.purpose,
      color: tone.muted,
      fontSize: 18,
      lineHeight: 1.55,
      className: 'hero-subtitle',
      mobileRect: { x: 48, y: 244, width: 1040 },
    }),
    makeButtonNode({
      id: makeId(pageId, 0, 'primary-cta'),
      parentId: rootId,
      rect: { x: CONTENT_X, y: 384, width: 184, height: 54 },
      zIndex: 4,
      label: section.ctaLabel ?? 'Contact',
      href: draft.spec.locale === 'ko' ? '/ko/contact' : `/${draft.spec.locale}/contact`,
      color: tone.accent,
      className: 'ai-generated-button hero-cta',
      mobileRect: { x: 48, y: 358, width: 280 },
    }),
    makeContainerNode({
      id: makeId(pageId, 0, 'sitemap-plan-strip'),
      parentId: rootId,
      rect: { x: 300, y: 398, width: 408, height: 32 },
      zIndex: 5,
      label: 'Sitemap plan strip',
      background: hexToRgba(tone.accent, 0.11),
      borderColor: hexToRgba(tone.accent, 0.18),
      borderRadius: 999,
      borderWidth: 1,
      padding: 16,
      className: 'ai-generated-sitemap-plan-strip',
      mobileRect: { x: 48, y: 426, width: 1040, height: 30 },
    }),
    makeTextNode({
      id: makeId(pageId, 0, 'sitemap-plan-strip-text'),
      parentId: makeId(pageId, 0, 'sitemap-plan-strip'),
      rect: { x: 18, y: 6, width: 372, height: 18 },
      zIndex: 6,
      text: draft.spec.locale === 'ko'
        ? `섹션 ${page.sections.length}개 / SEO 준비 / 메뉴 안전`
        : `${page.sections.length} sections / SEO-ready / nav-safe`,
      color: tone.text,
      fontSize: 12,
      fontWeight: 'medium',
      className: 'ai-generated-sitemap-plan-strip-text',
    }),
  );

  page.sections.slice(0, 6).forEach((item, index) => {
    const cardId = makeId(pageId, 0, 'section-card', index);
    const col = index % 3;
    const row = Math.floor(index / 3);
    nodes.push(
      makeContainerNode({
        id: cardId,
        parentId: rootId,
        rect: { x: CONTENT_X + col * 352, y: 480 + row * 118, width: 320, height: 92 },
        zIndex: 20 + index * 3,
        label: `Planned section ${index + 1}`,
        background: tone.surface,
        borderColor: tone.border,
        borderRadius: 18,
        borderWidth: 1,
        padding: 18,
        className: 'ai-generated-card sitemap-draft-card',
        variant: VARIANTS[index % VARIANTS.length],
        mobileRect: { x: 48, y: mobileCardY + index * 122, width: 1040, height: 96 },
      }),
      makeTextNode({
        id: makeId(pageId, 0, 'section-card-label', index),
        parentId: cardId,
        rect: { x: 18, y: 16, width: 54, height: 20 },
        zIndex: 21 + index * 3,
        text: `${index + 1}`.padStart(2, '0'),
        color: tone.accent,
        fontSize: 12,
        fontWeight: 'bold',
      }),
      makeHeadingNode({
        id: makeId(pageId, 0, 'section-card-title', index),
        parentId: cardId,
        rect: { x: 82, y: 16, width: 210, height: 30 },
        zIndex: 22 + index * 3,
        text: item.replace(/[-_]+/g, ' '),
        level: 3,
        color: tone.text,
        fontSize: 20,
        className: 'card-title',
        mobileRect: { x: 92, y: 16, width: 860 },
      }),
    );
  });

  return nodes.sort((left, right) => left.zIndex - right.zIndex);
}

function snapshotCategoryFor(
  root: BuilderCanvasNode,
  index: number,
  total: number,
): SavedSectionCategory {
  if (index === 0) return 'hero';
  if (index === total - 1) return 'cta';
  if (root.kind === 'container' && root.content.aiSectionTemplateKind === 'reviews') {
    return 'testimonials';
  }
  return 'features';
}

function snapshotNameFor(draft: GeneratedCanvasDraft, root: BuilderCanvasNode, index: number): string {
  const label = root.kind === 'container' ? root.content.label : '';
  const fallback = index === 0 ? 'Hero' : `Section ${index + 1}`;
  const sectionName = (label || fallback).replace(/\s+/g, ' ').trim();
  return `AI ${draft.spec.companyName} - ${clipText(sectionName, 72)}`;
}

export function draftToSavedSectionSnapshots(args: BuildArgs): GeneratedSectionSnapshot[] {
  const nodes = draftToCanvasNodes(args);
  const roots = nodes.filter((node) => (
    !node.parentId
    && node.kind === 'container'
    && node.content.as === 'section'
    && node.content.className?.includes('ai-generated-section')
  ));

  return roots.map((root, index) => {
    const normalizedNodes = normalizeSavedSectionSnapshot(nodes, root.id);
    const content = root.kind === 'container' ? root.content : undefined;
    const category = snapshotCategoryFor(root, index, roots.length);
    const descriptionParts = [
      content?.aiSectionTemplateKind ? `AI kind: ${content.aiSectionTemplateKind}` : undefined,
      content?.sectionTemplateId ? `template: ${content.sectionTemplateId}` : undefined,
      content?.variant ? `variant: ${content.variant}` : undefined,
    ].filter(Boolean);

    return {
      rootNodeId: root.id,
      sectionKey: root.id,
      name: snapshotNameFor(args.draft, root, index),
      description: descriptionParts.join(' / ') || 'AI generated reusable section',
      category,
      nodes: normalizedNodes,
      sectionTemplateId: content?.sectionTemplateId,
      aiSectionTemplateKind: content?.aiSectionTemplateKind,
      variant: content?.variant,
    };
  });
}
