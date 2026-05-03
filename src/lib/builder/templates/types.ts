import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';

export type TemplateVisualStyle =
  | 'editorial'
  | 'executive'
  | 'luxury'
  | 'clinical'
  | 'local'
  | 'product'
  | 'portfolio'
  | 'high-contrast'
  | 'calm'
  | 'minimal'
  | 'playful'
  | 'premium'
  | 'image-led'
  | 'conversion';

export type TemplatePaletteKey =
  | 'law-editorial'
  | 'restaurant-warm'
  | 'startup-product'
  | 'commerce-studio'
  | 'creative-mono'
  | 'health-clinical'
  | 'realestate-quiet'
  | 'beauty-luxe'
  | 'travel-editorial'
  | 'local-warm'
  | 'neutral-studio';

export type TemplateDensity =
  | 'minimal'
  | 'balanced'
  | 'editorial'
  | 'commercial'
  | 'dashboard'
  | 'portfolio'
  | 'conversion';

export type TemplateLayoutFamily =
  | 'cinematic-hero'
  | 'editorial-split'
  | 'bento-grid'
  | 'product-showcase'
  | 'magazine-stack'
  | 'service-index'
  | 'booking-first'
  | 'masonry-gallery'
  | 'conversion-landing';

export type TemplatePageType =
  | 'home'
  | 'about'
  | 'service'
  | 'contact'
  | 'pricing'
  | 'portfolio'
  | 'gallery'
  | 'blog'
  | 'product'
  | 'booking'
  | 'faq'
  | 'legal-detail';

export type TemplateQualityTier = 'premium' | 'standard' | 'draft' | 'under-review';

export interface TemplateThumbnailConfig {
  type: 'image' | 'auto';
  src?: string;
  alt?: string;
}

export interface PageTemplate {
  id: string;
  name: string;
  category:
    | 'law'
    | 'business'
    | 'restaurant'
    | 'health'
    | 'realestate'
    | 'education'
    | 'creative'
    | 'tech'
    | 'beauty'
    | 'fitness'
    | 'travel'
    | 'events'
    | 'nonprofit'
    | 'layout'
    | 'ecommerce'
    | 'photography'
    | 'music'
    | 'blog'
    | 'portfolio'
    | 'consulting'
    | 'cafe'
    | 'pet'
    | 'startup'
    | 'agency'
    | 'saas'
    | 'conference'
    | 'podcast'
    | 'magazine'
    | 'dental'
    | 'yoga'
    | 'freelancer'
    | 'wedding'
    | 'carrental'
    | 'eventplanner'
    | 'fashion';
  subcategory: string;
  description: string;
  thumbnail?: string | TemplateThumbnailConfig;
  visualStyle?: TemplateVisualStyle;
  paletteKey?: TemplatePaletteKey;
  density?: TemplateDensity;
  layoutFamily?: TemplateLayoutFamily;
  pageType?: TemplatePageType;
  tags?: string[];
  qualityTier?: TemplateQualityTier;
  qaScore?: number;
  featured?: boolean;
  ctaGoal?: string;
  sections?: string[];
  document: BuilderCanvasDocument;
}

export type TemplateCatalogItem = Omit<PageTemplate, 'document'> & {
  nodeCount: number;
  sectionCount: number;
};
