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

const PAGE_TYPE_SEARCH_ALIASES: Record<TemplatePageType, string[]> = {
  home: ['home', 'homepage', 'landing', 'main', '홈', '홈페이지', '메인', '메인 페이지', '랜딩', '랜딩페이지', '첫 화면'],
  about: ['about', 'profile', 'company', '회사소개', '소개', '브랜드 소개', '프로필', '팀 소개'],
  service: ['service', 'services', 'practice', 'practice area', '업무', '업무분야', '업무 분야', '주요업무', '주요 업무', '서비스', '서비스 소개'],
  contact: ['contact', 'inquiry', 'location', '문의', '연락처', '상담문의', '상담 문의', '오시는길', '오시는 길'],
  pricing: ['pricing', 'price', 'fee', 'plan', '가격', '비용', '요금', '플랜', '견적'],
  portfolio: ['portfolio', 'case study', 'work', '포트폴리오', '작업물', '사례', '프로젝트'],
  gallery: ['gallery', 'photo', 'image', '갤러리', '사진', '이미지', '작품'],
  blog: ['blog', 'news', 'article', 'archive', '블로그', '칼럼', '칼럼 아카이브', '뉴스', '아카이브', '소식'],
  product: ['product', 'products', 'shop', 'store', 'commerce', '상품', '제품', '쇼핑몰', '쇼핑', '스토어', '커머스'],
  booking: ['booking', 'reservation', 'schedule', 'appointment', '예약', '예약하기', '일정', '상담예약', '상담 예약', '스케줄'],
  faq: ['faq', 'questions', 'help', '자주묻는질문', '자주 묻는 질문', '질문', '도움말'],
  'legal-detail': ['legal', 'law', 'practice detail', '법률', '법률 상세', '업무 상세', '사건 상세'],
};

const CATEGORY_SEARCH_ALIASES: Partial<Record<PageTemplate['category'], string[]>> = {
  law: ['law', 'legal', 'law firm', '로펌', '법률', '법무법인', '법률사무소', '변호사', '변호사 사무실', '국제법무'],
  business: ['business', 'corporate', '회사', '기업', '비즈니스', '법인'],
  restaurant: ['restaurant', 'food', 'dining', '식당', '음식점', '레스토랑', '맛집', '외식'],
  health: ['health', 'medical', 'clinic', '병원', '의료', '헬스케어', '클리닉', '한의원'],
  realestate: ['real estate', 'property', '부동산', '매물', '중개'],
  education: ['education', 'school', 'academy', '교육', '학교', '학원', '강의'],
  creative: ['creative', 'design', 'agency', '디자인', '크리에이티브', '에이전시'],
  tech: ['tech', 'software', 'it', '기술', '소프트웨어', 'IT'],
  beauty: ['beauty', 'salon', 'spa', '뷰티', '미용', '살롱', '스파'],
  fitness: ['fitness', 'gym', 'workout', '피트니스', '헬스장', '운동'],
  travel: ['travel', 'tour', 'trip', '여행', '여행사', '투어'],
  events: ['event', 'events', '행사', '이벤트', '컨퍼런스'],
  nonprofit: ['nonprofit', 'ngo', '비영리', '후원', '기부'],
  ecommerce: ['ecommerce', 'commerce', 'shop', 'store', '쇼핑몰', '쇼핑', '커머스', '상점', '스토어'],
  photography: ['photography', 'photo', '사진', '촬영', '스튜디오'],
  music: ['music', 'band', '음악', '밴드', '아티스트'],
  blog: ['blog', 'magazine', '블로그', '매거진', '뉴스'],
  portfolio: ['portfolio', 'work', '포트폴리오', '작품', '프로젝트'],
  consulting: ['consulting', 'consultant', '컨설팅', '컨설턴트', '자문'],
  cafe: ['cafe', 'coffee', '카페', '커피'],
  pet: ['pet', 'animal', '동물', '반려동물', '동물병원'],
  startup: ['startup', 'saas', '스타트업', '서비스', '제품'],
  agency: ['agency', 'studio', '에이전시', '스튜디오'],
  saas: ['saas', 'software', '소프트웨어', '구독 서비스'],
  conference: ['conference', '컨퍼런스', '세미나'],
  podcast: ['podcast', '팟캐스트', '방송'],
  magazine: ['magazine', '매거진', '저널'],
  dental: ['dental', 'dentist', '치과'],
  yoga: ['yoga', '요가', '명상'],
  freelancer: ['freelancer', '프리랜서', '1인기업'],
  wedding: ['wedding', '웨딩', '결혼'],
  carrental: ['car rental', '렌터카', '차량'],
  eventplanner: ['event planner', '이벤트 기획', '행사 기획'],
  fashion: ['fashion', '패션', '의류'],
};

const TEMPLATE_MARKET_ALIASES = [
  'page template',
  'page templates',
  'template',
  'templates',
  'template market',
  'template showroom',
  'ai design',
  'ai디자인',
  'ai 디자인',
  '전문 템플릿',
  '디자인 템플릿',
  '랜딩 템플릿',
  '홈페이지 템플릿',
  '템플릿 마켓',
  '템플릿 쇼룸',
  '템플릿 사이트',
  '템플릿 있는 사이트',
  '디자인 사이트',
  '디자인 전문 사이트',
  'ai 디자인 전문 사이트',
  '전문 사이트',
  '페이지 템플릿',
];

export function normalizeTemplateSearchQuery(value: string): string {
  return value.trim().toLocaleLowerCase('ko-KR');
}

function normalizedTextMatchesQuery(value: string, query: string): boolean {
  if (value.includes(query)) return true;
  const tokens = query.split(/\s+/).filter(Boolean);
  return tokens.length > 1 && tokens.every((token) => value.includes(token));
}

function getTemplateSearchAliases(template: PageTemplate): string[] {
  return [
    ...(template.pageType ? PAGE_TYPE_SEARCH_ALIASES[template.pageType] : []),
    ...(CATEGORY_SEARCH_ALIASES[template.category] ?? []),
    ...TEMPLATE_MARKET_ALIASES,
  ];
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
    ...getTemplateSearchAliases(template),
  ].join(' ').toLocaleLowerCase('ko-KR');
}

export function matchesTemplateSearch(template: PageTemplate, query: string, categoryLabel: string = template.category): boolean {
  const normalizedQuery = normalizeTemplateSearchQuery(query);
  if (!normalizedQuery) return true;
  return normalizedTextMatchesQuery(buildTemplateSearchText(template, categoryLabel), normalizedQuery);
}

export function scoreTemplateSearch(template: PageTemplate, query: string, categoryLabel: string = template.category): number {
  const normalizedQuery = normalizeTemplateSearchQuery(query);
  if (!normalizedQuery) return 0;
  const includes = (value: unknown) => normalizedTextMatchesQuery(
    normalizeTemplateSearchQuery(String(value ?? '')),
    normalizedQuery,
  );
  let score = 0;
  if (includes(template.name)) score += 100;
  if (includes(template.id)) score += 80;
  if (includes(template.subcategory)) score += 70;
  if (includes(template.description)) score += 60;
  if (template.tags?.some(includes)) score += 45;
  if (template.sections?.some(includes)) score += 35;
  if (includes(categoryLabel) || includes(template.category)) score += 30;
  if (includes(template.pageType)) score += 24;
  if (template.pageType && PAGE_TYPE_SEARCH_ALIASES[template.pageType].some(includes)) score += 55;
  if (CATEGORY_SEARCH_ALIASES[template.category]?.some(includes)) score += 45;
  if (TEMPLATE_MARKET_ALIASES.some(includes)) score += 12;
  if (template.featured) score += 6;
  if (template.qualityTier === 'premium') score += 4;
  return score;
}
