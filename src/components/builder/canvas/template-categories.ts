import type { PageTemplate } from '@/lib/builder/templates/types';

export type TemplateCategoryKey = 'all' | PageTemplate['category'];

export interface TemplateCategoryMeta {
  key: TemplateCategoryKey;
  label: string;
  icon: string;
}

export const TEMPLATE_CATEGORIES: TemplateCategoryMeta[] = [
  { key: 'all', label: '전체', icon: '📁' },
  { key: 'law', label: '법률', icon: '⚖️' },
  { key: 'restaurant', label: '음식점', icon: '🍴' },
  { key: 'health', label: '의료', icon: '🏥' },
  { key: 'realestate', label: '부동산', icon: '🏘️' },
  { key: 'education', label: '교육', icon: '🎓' },
  { key: 'creative', label: '크리에이티브', icon: '🎨' },
  { key: 'beauty', label: '뷰티', icon: '💄' },
  { key: 'blog', label: '블로그', icon: '📝' },
  { key: 'cafe', label: '카페', icon: '☕' },
  { key: 'consulting', label: '컨설팅', icon: '💼' },
  { key: 'ecommerce', label: '쇼핑몰', icon: '🛍️' },
  { key: 'fitness', label: '피트니스', icon: '💪' },
  { key: 'music', label: '음악', icon: '🎵' },
  { key: 'pet', label: '반려동물', icon: '🐾' },
  { key: 'photography', label: '사진', icon: '📸' },
  { key: 'startup', label: '스타트업', icon: '🚀' },
  { key: 'travel', label: '여행', icon: '✈️' },
];

export const TEMPLATE_CATEGORY_LABELS = Object.fromEntries(
  TEMPLATE_CATEGORIES.map((category) => [category.key, category.label]),
) as Record<TemplateCategoryKey, string>;
