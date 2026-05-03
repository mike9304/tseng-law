import type {
  PageTemplate,
  TemplateCatalogItem,
  TemplateDensity,
  TemplateLayoutFamily,
  TemplatePageType,
  TemplatePaletteKey,
  TemplateQualityTier,
  TemplateVisualStyle,
} from './types';

export interface TemplateMetadata {
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
}

const CATEGORY_DEFAULTS: Record<PageTemplate['category'], TemplateMetadata> = {
  law: {
    visualStyle: 'executive',
    paletteKey: 'law-editorial',
    density: 'editorial',
    layoutFamily: 'service-index',
    qualityTier: 'standard',
    tags: ['법률', '상담', '전문 서비스'],
  },
  business: {
    visualStyle: 'executive',
    paletteKey: 'neutral-studio',
    density: 'commercial',
    layoutFamily: 'service-index',
    qualityTier: 'standard',
    tags: ['비즈니스', '회사소개'],
  },
  restaurant: {
    visualStyle: 'image-led',
    paletteKey: 'restaurant-warm',
    density: 'commercial',
    layoutFamily: 'booking-first',
    qualityTier: 'standard',
    tags: ['레스토랑', '예약', '메뉴'],
  },
  health: {
    visualStyle: 'clinical',
    paletteKey: 'health-clinical',
    density: 'balanced',
    layoutFamily: 'service-index',
    qualityTier: 'standard',
    tags: ['의료', '예약', '클리닉'],
  },
  realestate: {
    visualStyle: 'calm',
    paletteKey: 'realestate-quiet',
    density: 'commercial',
    layoutFamily: 'service-index',
    qualityTier: 'standard',
    tags: ['부동산', '매물', '상담'],
  },
  education: {
    visualStyle: 'local',
    paletteKey: 'local-warm',
    density: 'balanced',
    layoutFamily: 'service-index',
    qualityTier: 'standard',
    tags: ['교육', '프로그램'],
  },
  creative: {
    visualStyle: 'portfolio',
    paletteKey: 'creative-mono',
    density: 'portfolio',
    layoutFamily: 'masonry-gallery',
    qualityTier: 'standard',
    tags: ['크리에이티브', '포트폴리오'],
  },
  tech: {
    visualStyle: 'product',
    paletteKey: 'startup-product',
    density: 'dashboard',
    layoutFamily: 'product-showcase',
    qualityTier: 'standard',
    tags: ['테크', '제품'],
  },
  beauty: {
    visualStyle: 'luxury',
    paletteKey: 'beauty-luxe',
    density: 'commercial',
    layoutFamily: 'booking-first',
    qualityTier: 'standard',
    tags: ['뷰티', '예약', '시술'],
  },
  fitness: {
    visualStyle: 'high-contrast',
    paletteKey: 'neutral-studio',
    density: 'commercial',
    layoutFamily: 'booking-first',
    qualityTier: 'standard',
    tags: ['피트니스', '체험', '클래스'],
  },
  travel: {
    visualStyle: 'editorial',
    paletteKey: 'travel-editorial',
    density: 'editorial',
    layoutFamily: 'magazine-stack',
    qualityTier: 'standard',
    tags: ['여행', '패키지', '상담'],
  },
  events: {
    visualStyle: 'playful',
    paletteKey: 'local-warm',
    density: 'commercial',
    layoutFamily: 'conversion-landing',
    qualityTier: 'standard',
    tags: ['이벤트', '예약'],
  },
  nonprofit: {
    visualStyle: 'calm',
    paletteKey: 'health-clinical',
    density: 'balanced',
    layoutFamily: 'service-index',
    qualityTier: 'standard',
    tags: ['비영리', '후원'],
  },
  layout: {
    visualStyle: 'minimal',
    paletteKey: 'neutral-studio',
    density: 'minimal',
    layoutFamily: 'editorial-split',
    qualityTier: 'draft',
    tags: ['레이아웃'],
  },
  ecommerce: {
    visualStyle: 'premium',
    paletteKey: 'commerce-studio',
    density: 'commercial',
    layoutFamily: 'product-showcase',
    qualityTier: 'standard',
    tags: ['쇼핑몰', '상품', '구매'],
  },
  photography: {
    visualStyle: 'portfolio',
    paletteKey: 'creative-mono',
    density: 'portfolio',
    layoutFamily: 'masonry-gallery',
    qualityTier: 'standard',
    tags: ['사진', '포트폴리오', '예약'],
  },
  music: {
    visualStyle: 'high-contrast',
    paletteKey: 'creative-mono',
    density: 'portfolio',
    layoutFamily: 'magazine-stack',
    qualityTier: 'standard',
    tags: ['음악', '공연', '팬'],
  },
  blog: {
    visualStyle: 'editorial',
    paletteKey: 'neutral-studio',
    density: 'editorial',
    layoutFamily: 'magazine-stack',
    qualityTier: 'standard',
    tags: ['블로그', '콘텐츠'],
  },
  portfolio: {
    visualStyle: 'portfolio',
    paletteKey: 'creative-mono',
    density: 'portfolio',
    layoutFamily: 'masonry-gallery',
    qualityTier: 'standard',
    tags: ['포트폴리오'],
  },
  consulting: {
    visualStyle: 'executive',
    paletteKey: 'neutral-studio',
    density: 'commercial',
    layoutFamily: 'service-index',
    qualityTier: 'standard',
    tags: ['컨설팅', 'B2B'],
  },
  cafe: {
    visualStyle: 'local',
    paletteKey: 'restaurant-warm',
    density: 'commercial',
    layoutFamily: 'booking-first',
    qualityTier: 'standard',
    tags: ['카페', '메뉴', '멤버십'],
  },
  pet: {
    visualStyle: 'calm',
    paletteKey: 'health-clinical',
    density: 'commercial',
    layoutFamily: 'booking-first',
    qualityTier: 'standard',
    tags: ['반려동물', '예약', '케어'],
  },
  startup: {
    visualStyle: 'product',
    paletteKey: 'startup-product',
    density: 'dashboard',
    layoutFamily: 'product-showcase',
    qualityTier: 'standard',
    tags: ['스타트업', 'SaaS', '제품'],
  },
  agency: {
    visualStyle: 'premium',
    paletteKey: 'neutral-studio',
    density: 'commercial',
    layoutFamily: 'service-index',
    qualityTier: 'standard',
    tags: ['에이전시', '서비스', '프로젝트'],
  },
  saas: {
    visualStyle: 'product',
    paletteKey: 'startup-product',
    density: 'dashboard',
    layoutFamily: 'product-showcase',
    qualityTier: 'standard',
    tags: ['SaaS', '제품', '가격'],
  },
  conference: {
    visualStyle: 'conversion',
    paletteKey: 'startup-product',
    density: 'commercial',
    layoutFamily: 'conversion-landing',
    qualityTier: 'standard',
    tags: ['컨퍼런스', '행사', '등록'],
  },
  podcast: {
    visualStyle: 'editorial',
    paletteKey: 'creative-mono',
    density: 'editorial',
    layoutFamily: 'magazine-stack',
    qualityTier: 'standard',
    tags: ['팟캐스트', '에피소드', '구독'],
  },
  magazine: {
    visualStyle: 'editorial',
    paletteKey: 'neutral-studio',
    density: 'editorial',
    layoutFamily: 'magazine-stack',
    qualityTier: 'standard',
    tags: ['매거진', '기사', '구독'],
  },
  dental: {
    visualStyle: 'clinical',
    paletteKey: 'health-clinical',
    density: 'balanced',
    layoutFamily: 'booking-first',
    qualityTier: 'standard',
    tags: ['치과', '진료', '예약'],
  },
  yoga: {
    visualStyle: 'calm',
    paletteKey: 'local-warm',
    density: 'balanced',
    layoutFamily: 'booking-first',
    qualityTier: 'standard',
    tags: ['요가', '클래스', '스튜디오'],
  },
  freelancer: {
    visualStyle: 'portfolio',
    paletteKey: 'creative-mono',
    density: 'portfolio',
    layoutFamily: 'service-index',
    qualityTier: 'standard',
    tags: ['프리랜서', '포트폴리오', '서비스'],
  },
  wedding: {
    visualStyle: 'luxury',
    paletteKey: 'beauty-luxe',
    density: 'commercial',
    layoutFamily: 'masonry-gallery',
    qualityTier: 'standard',
    tags: ['웨딩', '이벤트', '포트폴리오'],
  },
  carrental: {
    visualStyle: 'premium',
    paletteKey: 'commerce-studio',
    density: 'commercial',
    layoutFamily: 'product-showcase',
    qualityTier: 'standard',
    tags: ['렌터카', '예약', '차량'],
  },
  eventplanner: {
    visualStyle: 'playful',
    paletteKey: 'local-warm',
    density: 'commercial',
    layoutFamily: 'conversion-landing',
    qualityTier: 'standard',
    tags: ['이벤트 기획', '행사', '견적'],
  },
  fashion: {
    visualStyle: 'luxury',
    paletteKey: 'commerce-studio',
    density: 'portfolio',
    layoutFamily: 'product-showcase',
    qualityTier: 'standard',
    tags: ['패션', '컬렉션'],
  },
};

const TEMPLATE_METADATA: Record<string, TemplateMetadata> = {
  'law-home': {
    visualStyle: 'executive',
    paletteKey: 'law-editorial',
    density: 'editorial',
    layoutFamily: 'editorial-split',
    pageType: 'home',
    tags: ['프리미엄', '로펌', '대만', '기업자문'],
    qualityTier: 'premium',
    qaScore: 88,
    featured: true,
    ctaGoal: '사안 검토 요청',
    sections: ['Editorial hero', 'Practice matrix', 'Client proof', 'Intake CTA'],
  },
  'restaurant-home': {
    visualStyle: 'image-led',
    paletteKey: 'restaurant-warm',
    density: 'commercial',
    layoutFamily: 'booking-first',
    pageType: 'home',
    tags: ['프리미엄', '레스토랑', '예약', '메뉴'],
    qualityTier: 'premium',
    qaScore: 86,
    featured: true,
    ctaGoal: '예약 전환',
    sections: ['Dining hero', 'Menu highlights', 'Reservation band', 'Hours/location'],
  },
  'startup-home': {
    visualStyle: 'product',
    paletteKey: 'startup-product',
    density: 'dashboard',
    layoutFamily: 'product-showcase',
    pageType: 'home',
    tags: ['프리미엄', 'SaaS', '제품', '무료체험'],
    qualityTier: 'premium',
    qaScore: 87,
    featured: true,
    ctaGoal: '무료 체험 시작',
    sections: ['Product hero', 'Feature bento', 'Social proof', 'Signup CTA'],
  },
  'ecommerce-home': {
    visualStyle: 'premium',
    paletteKey: 'commerce-studio',
    density: 'commercial',
    layoutFamily: 'product-showcase',
    pageType: 'home',
    tags: ['프리미엄', '쇼핑몰', '컬렉션', '구매전환'],
    qualityTier: 'premium',
    qaScore: 86,
    featured: true,
    ctaGoal: '상품 구매',
    sections: ['Collection hero', 'Product grid', 'Category rail', 'Promotion strip'],
  },
  'creative-home': {
    visualStyle: 'portfolio',
    paletteKey: 'creative-mono',
    density: 'portfolio',
    layoutFamily: 'masonry-gallery',
    pageType: 'home',
    tags: ['프리미엄', '스튜디오', '포트폴리오', '프로젝트 문의'],
    qualityTier: 'premium',
    qaScore: 89,
    featured: true,
    ctaGoal: '프로젝트 문의',
    sections: ['Bold hero', 'Portfolio teaser', 'Service index', 'Client proof'],
  },
};

function inferPageType(template: PageTemplate): TemplatePageType {
  const id = template.id.toLowerCase();
  const subcategory = template.subcategory.toLowerCase();
  if (id.endsWith('-home') || subcategory.includes('home')) return 'home';
  if (id.includes('about')) return 'about';
  if (id.includes('contact')) return 'contact';
  if (id.includes('pricing')) return 'pricing';
  if (id.includes('portfolio')) return 'portfolio';
  if (id.includes('gallery')) return 'gallery';
  if (id.includes('blog') || id.includes('article') || id.includes('insight')) return 'blog';
  if (id.includes('product')) return 'product';
  if (id.includes('faq')) return 'faq';
  if (id.includes('booking') || id.includes('reservation')) return 'booking';
  return 'service';
}

function unique(values: Array<string | undefined>): string[] {
  return [...new Set(values.filter(Boolean) as string[])];
}

export function getTemplateMetadata(template: PageTemplate): TemplateMetadata {
  const category = CATEGORY_DEFAULTS[template.category] ?? CATEGORY_DEFAULTS.layout;
  const specific = TEMPLATE_METADATA[template.id] ?? {};
  return {
    ...category,
    ...specific,
    pageType: specific.pageType ?? category.pageType ?? inferPageType(template),
    tags: unique([...(category.tags ?? []), ...(specific.tags ?? []), template.subcategory]),
  };
}

export function enrichTemplate(template: PageTemplate): PageTemplate {
  const metadata = getTemplateMetadata(template);
  return {
    ...template,
    ...metadata,
    tags: unique([...(template.tags ?? []), ...(metadata.tags ?? [])]),
    thumbnail: template.thumbnail ?? { type: 'auto', alt: `${template.name} 템플릿 미리보기` },
  };
}

export function createTemplateCatalogItem(template: PageTemplate): TemplateCatalogItem {
  const enriched = enrichTemplate(template);
  const sectionCount = enriched.sections?.length
    ?? enriched.document.nodes.filter((node) => node.kind === 'section' || node.kind === 'container').length;
  const { document, ...catalogTemplate } = enriched;
  void document;
  return {
    ...catalogTemplate,
    nodeCount: enriched.document.nodes.length,
    sectionCount,
  };
}
