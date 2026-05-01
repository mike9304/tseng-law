import type {
  PageTemplate,
  TemplateDensity,
  TemplatePageType,
  TemplateQualityTier,
  TemplateVisualStyle,
} from './types';
import {
  TEMPLATE_DENSITY_LABELS,
  TEMPLATE_PAGE_TYPE_LABELS,
  TEMPLATE_QUALITY_LABELS,
  TEMPLATE_STYLE_LABELS,
} from './design-system';

const STYLE_FILTER_KEYS = [
  'editorial',
  'executive',
  'luxury',
  'local',
  'product',
  'portfolio',
  'image-led',
  'conversion',
] as const satisfies readonly TemplateVisualStyle[];

export const TEMPLATE_STYLE_FILTERS: Array<{ key: TemplateVisualStyle; label: string }> = STYLE_FILTER_KEYS
  .map((key) => ({ key, label: TEMPLATE_STYLE_LABELS[key] }));

const DENSITY_FILTER_KEYS = [
  'minimal',
  'balanced',
  'editorial',
  'commercial',
  'dashboard',
  'portfolio',
  'conversion',
] as const satisfies readonly TemplateDensity[];

export const TEMPLATE_DENSITY_FILTERS: Array<{ key: TemplateDensity; label: string }> = DENSITY_FILTER_KEYS
  .map((key) => ({ key, label: TEMPLATE_DENSITY_LABELS[key] }));

const PAGE_TYPE_FILTER_KEYS = [
  'home',
  'about',
  'service',
  'contact',
  'pricing',
  'portfolio',
  'gallery',
  'blog',
  'product',
  'booking',
  'faq',
] as const satisfies readonly TemplatePageType[];

export const TEMPLATE_PAGE_TYPE_FILTERS: Array<{ key: TemplatePageType; label: string }> = PAGE_TYPE_FILTER_KEYS
  .map((key) => ({ key, label: TEMPLATE_PAGE_TYPE_LABELS[key] }));

const QUALITY_FILTER_KEYS = [
  'premium',
  'standard',
  'under-review',
  'draft',
] as const satisfies readonly TemplateQualityTier[];

export const TEMPLATE_QUALITY_FILTERS: Array<{ key: TemplateQualityTier; label: string }> = QUALITY_FILTER_KEYS
  .map((key) => ({ key, label: TEMPLATE_QUALITY_LABELS[key] }));

export interface TemplateFilterState {
  style: TemplateVisualStyle | 'all';
  density: TemplateDensity | 'all';
  pageType: TemplatePageType | 'all';
  quality: TemplateQualityTier | 'all';
}

export const DEFAULT_TEMPLATE_FILTERS: TemplateFilterState = {
  style: 'all',
  density: 'all',
  pageType: 'all',
  quality: 'all',
};

export function hasActiveTemplateFilters(filters: TemplateFilterState): boolean {
  return filters.style !== 'all'
    || filters.density !== 'all'
    || filters.pageType !== 'all'
    || filters.quality !== 'all';
}

export function matchesTemplateFilters(template: PageTemplate, filters: TemplateFilterState): boolean {
  if (filters.style !== 'all' && template.visualStyle !== filters.style) return false;
  if (filters.density !== 'all' && template.density !== filters.density) return false;
  if (filters.pageType !== 'all' && template.pageType !== filters.pageType) return false;
  if (filters.quality !== 'all' && template.qualityTier !== filters.quality) return false;
  return true;
}

export function buildTemplateSearchText(template: PageTemplate, categoryLabel: string): string {
  return [
    template.id,
    template.name,
    template.description,
    template.category,
    categoryLabel,
    template.subcategory,
    template.visualStyle,
    template.density,
    template.layoutFamily,
    template.pageType,
    template.qualityTier,
    template.ctaGoal,
    ...(template.tags ?? []),
    ...(template.sections ?? []),
  ].join(' ').toLowerCase();
}
