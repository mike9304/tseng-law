import type { BuilderComponentCategory, BuilderComponentDefinition } from '@/lib/builder/components/define';
import {
  createCanvasNodeTemplate,
} from '@/lib/builder/canvas/store';
import type { BuilderCanvasNode, BuilderCanvasNodeKind } from '@/lib/builder/canvas/types';
import type { BuiltInSectionTemplate } from '@/lib/builder/sections/templates';
import {
  matchesTemplateSearch,
  scoreTemplateSearch,
} from '@/lib/builder/templates/filters';
import {
  TEMPLATE_PAGE_TYPE_LABELS,
  TEMPLATE_QUALITY_LABELS,
  TEMPLATE_STYLE_LABELS,
} from '@/lib/builder/templates/design-system';
import type { PageTemplate } from '@/lib/builder/templates/types';
import { TEMPLATE_CATEGORY_LABELS } from './template-categories';

export const STAGE_WIDTH = 1280;
export const STAGE_HEIGHT = 880;
export const PAGE_TEMPLATE_PREVIEW_LIMIT = 8;

export const CATEGORY_ORDER: BuilderComponentCategory[] = ['basic', 'media', 'layout', 'domain'];
export const CATEGORY_LABELS: Record<BuilderComponentCategory, string> = {
  basic: 'Basic',
  media: 'Media',
  layout: 'Layout',
  domain: 'Domain',
  advanced: 'Advanced',
};
export const CATEGORY_SUBLABELS: Record<BuilderComponentCategory, string> = {
  basic: 'text, button, heading',
  media: 'image, gallery, video, audio',
  layout: 'container, section',
  domain: 'composite, domain blocks',
  advanced: 'embed, spacer, divider',
};
export const CATEGORY_ICONS: Record<BuilderComponentCategory, string> = {
  basic: 'Aa',
  media: '◩',
  layout: '▦',
  domain: '◈',
  advanced: '⋯',
};

const KIND_PRIORITY: Partial<Record<BuilderComponentCategory, string[]>> = {
  basic: ['text', 'button', 'heading'],
  media: ['image', 'gallery', 'video', 'video-embed', 'audio', 'lottie', 'icon'],
  layout: ['container', 'section'],
  domain: [
    'composite',
    'form',
    'form-input',
    'form-textarea',
    'form-select',
    'form-radio',
    'form-checkbox',
    'form-date',
    'form-file',
    'form-submit',
  ],
};

export const FEATURED_KINDS: BuilderCanvasNodeKind[] = ['text', 'button', 'image', 'container', 'form'];

type CatalogSearchablePreset = {
  id: string;
  label: string;
  description: string;
  kind: string;
};

function valuesMatchQuery(values: Array<string | number | boolean | null | undefined>, query: string): boolean {
  if (!query) return true;
  return values.some((value) => String(value).toLocaleLowerCase('ko-KR').includes(query));
}

export function resolveCenteredNode(
  kind: BuilderCanvasNodeKind,
  existingCount: number,
  cascadeSeed = existingCount,
) {
  const seed = createCanvasNodeTemplate(kind, 0, 0, existingCount);
  const cascadeOffset = (cascadeSeed % 12) * 22;
  return {
    ...seed,
    rect: {
      ...seed.rect,
      x: Math.round((STAGE_WIDTH - seed.rect.width) / 2 + cascadeOffset),
      y: Math.round((STAGE_HEIGHT - seed.rect.height) / 2 + cascadeOffset),
    },
  };
}

export function resolveSectionInsertOffset(
  nodes: BuilderCanvasNode[],
  template: BuiltInSectionTemplate,
): { x: number; y: number } {
  const root = template.nodes.find((node) => node.id === template.rootNodeId);
  const width = root?.rect.width ?? STAGE_WIDTH;
  const existingBottom = nodes
    .filter((node) => !node.parentId && node.visible)
    .reduce((bottom, node) => Math.max(bottom, node.rect.y + node.rect.height), 0);

  return {
    x: Math.max(0, Math.round((STAGE_WIDTH - width) / 2)),
    y: Math.max(48, existingBottom + 48),
  };
}

export function getDisplayCategory(component: BuilderComponentDefinition): BuilderComponentCategory {
  if (component.kind === 'image') return 'media';
  return component.category;
}

export function compareByCategoryPriority(
  category: BuilderComponentCategory,
  left: BuilderComponentDefinition,
  right: BuilderComponentDefinition,
): number {
  const priority = KIND_PRIORITY[category] ?? [];
  const leftIndex = priority.indexOf(left.kind);
  const rightIndex = priority.indexOf(right.kind);

  if (leftIndex !== -1 || rightIndex !== -1) {
    if (leftIndex === -1) return 1;
    if (rightIndex === -1) return -1;
    return leftIndex - rightIndex;
  }

  return left.displayName.localeCompare(right.displayName, 'ko');
}

export function normalizeSearchTerm(value: string): string {
  return value.trim().toLocaleLowerCase('ko-KR');
}

export function componentMatchesSearch(component: BuilderComponentDefinition, query: string): boolean {
  return valuesMatchQuery([
    component.displayName,
    component.kind,
    component.category,
    getDisplayCategory(component),
  ], query);
}

export function textWidgetMatchesSearch(preset: CatalogSearchablePreset, query: string): boolean {
  return valuesMatchQuery([preset.label, preset.description, preset.id, preset.kind, 'text widget'], query);
}

export function mediaWidgetMatchesSearch(preset: CatalogSearchablePreset, query: string): boolean {
  return valuesMatchQuery([preset.label, preset.description, preset.id, preset.kind, 'media widget'], query);
}

export function galleryWidgetMatchesSearch(preset: CatalogSearchablePreset, query: string): boolean {
  return valuesMatchQuery([preset.label, preset.description, preset.id, preset.kind, 'gallery widget'], query);
}

export function layoutWidgetMatchesSearch(preset: CatalogSearchablePreset, query: string): boolean {
  return valuesMatchQuery([preset.label, preset.description, preset.id, preset.kind, 'layout widget'], query);
}

export function interactiveWidgetMatchesSearch(preset: CatalogSearchablePreset, query: string): boolean {
  return valuesMatchQuery([
    preset.label,
    preset.description,
    preset.id,
    preset.kind,
    'interactive widget',
    'countdown',
    'progress',
    'rating',
    'notification',
    'back to top',
  ], query);
}

export function navigationWidgetMatchesSearch(preset: CatalogSearchablePreset, query: string): boolean {
  return valuesMatchQuery([
    preset.label,
    preset.description,
    preset.id,
    preset.kind,
    'navigation widget',
    'menu',
    'breadcrumb',
    'anchor',
  ], query);
}

export function decorativeWidgetMatchesSearch(preset: CatalogSearchablePreset, query: string): boolean {
  return valuesMatchQuery([
    preset.label,
    preset.description,
    preset.id,
    preset.kind,
    'decorative widget',
    'shape',
    'pattern',
    'frame',
    'sticker',
    'parallax',
  ], query);
}

export function designerWidgetMatchesSearch(preset: CatalogSearchablePreset, query: string): boolean {
  return valuesMatchQuery([
    preset.label,
    preset.description,
    preset.id,
    preset.kind,
    'designer widget',
    'designer blocks',
    'professional',
    'wix',
    'counter',
    'testimonial',
    'pricing',
    'timeline',
    'profile',
    'comparison',
    'service',
  ], query);
}

export function locationWidgetMatchesSearch(preset: CatalogSearchablePreset, query: string): boolean {
  return valuesMatchQuery([
    preset.label,
    preset.description,
    preset.id,
    preset.kind,
    'location widget',
    'maps',
    'address',
    'hours',
  ], query);
}

export function socialWidgetMatchesSearch(preset: CatalogSearchablePreset, query: string): boolean {
  return valuesMatchQuery([
    preset.label,
    preset.description,
    preset.id,
    preset.kind,
    'social widget',
    'instagram',
    'youtube',
    'linkedin',
    'whatsapp',
    'line',
    'kakao',
    'share',
  ], query);
}

export function getPageTemplateSectionCount(template: PageTemplate): number {
  return template.sections?.length
    ?? template.document.nodes.filter((node) => node.kind === 'section' || node.kind === 'container').length;
}

export function getPageTemplateCategoryLabel(template: PageTemplate): string {
  return TEMPLATE_CATEGORY_LABELS[template.category] ?? template.category;
}

export function pageTemplateMatchesSearch(template: PageTemplate, query: string): boolean {
  return matchesTemplateSearch(template, query, getPageTemplateCategoryLabel(template));
}

export function pageTemplateSearchScore(template: PageTemplate, query: string): number {
  return scoreTemplateSearch(template, query, getPageTemplateCategoryLabel(template));
}

export function getPageTemplateMeta(template: PageTemplate): string {
  const pageType = template.pageType ? TEMPLATE_PAGE_TYPE_LABELS[template.pageType] : '페이지';
  const style = template.visualStyle ? TEMPLATE_STYLE_LABELS[template.visualStyle] : 'Standard';
  return `${pageType} · ${style} · ${getPageTemplateSectionCount(template)} sections`;
}

export function getPageTemplateQualityLabel(template: PageTemplate): string {
  if (!template.qualityTier) return 'Standard';
  return TEMPLATE_QUALITY_LABELS[template.qualityTier];
}
