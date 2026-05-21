import type { Locale } from '@/lib/locales';

export type PortfolioStatus = 'draft' | 'published' | 'archived';
export type PortfolioLayout = 'cards' | 'masonry' | 'featured';
export type PortfolioSortBy = 'date-desc' | 'date-asc' | 'order-asc';

export interface PortfolioGalleryImage {
  imageId: string;
  url: string;
  alt: string;
  caption?: string;
}

export interface PortfolioProject {
  projectId: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  body: string;
  category: string;
  client?: string;
  completedAt: string;
  tags: string[];
  locale: Locale;
  status: PortfolioStatus;
  featured: boolean;
  order: number;
  coverImageUrl?: string;
  gallery: PortfolioGalleryImage[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_PORTFOLIO_CATEGORIES: Array<{ id: string; name: Record<Locale, string> }> = [
  { id: 'company-setup', name: { ko: '회사 설립', 'zh-hant': '公司設立', en: 'Company Setup' } },
  { id: 'labor', name: { ko: '노동법', 'zh-hant': '勞動法', en: 'Labor Law' } },
  { id: 'inheritance', name: { ko: '상속/가사', 'zh-hant': '繼承/家事', en: 'Inheritance / Family' } },
  { id: 'traffic-accident', name: { ko: '교통사고', 'zh-hant': '交通事故', en: 'Traffic Accident' } },
  { id: 'real-estate', name: { ko: '부동산', 'zh-hant': '不動產', en: 'Real Estate' } },
];

export function categoryLabel(category: string, locale: Locale): string {
  return DEFAULT_PORTFOLIO_CATEGORIES.find((item) => item.id === category)?.name[locale] ?? category;
}

export function slugifyPortfolioTitle(title: string): string {
  const slug = title
    .normalize('NFC')
    .toLowerCase()
    .replace(/[^a-z0-9가-힣一-龥ぁ-んァ-ン]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
  return slug || `portfolio-${Date.now()}`;
}
