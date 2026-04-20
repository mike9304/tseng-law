import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';

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
    | 'fashion';
  subcategory: string;
  description: string;
  thumbnail?: string; // future: preview image path
  document: BuilderCanvasDocument;
}
