import type {
  TemplateDensity,
  TemplateLayoutFamily,
  TemplatePageType,
  TemplatePaletteKey,
  TemplateQualityTier,
  TemplateVisualStyle,
} from './types';

export interface TemplatePalette {
  key: TemplatePaletteKey;
  label: string;
  canvas: string;
  surface: string;
  surfaceAlt: string;
  ink: string;
  mutedInk: string;
  accent: string;
  accentSoft: string;
  line: string;
  inverse: string;
  focus: string;
}

export const TEMPLATE_PALETTES: Record<TemplatePaletteKey, TemplatePalette> = {
  'law-editorial': {
    key: 'law-editorial',
    label: 'Editorial law',
    canvas: '#f7f2e8',
    surface: '#fffaf0',
    surfaceAlt: '#e8dfcf',
    ink: '#171717',
    mutedInk: '#6f665a',
    accent: '#b18a4a',
    accentSoft: '#eadfca',
    line: '#d8c9af',
    inverse: '#ffffff',
    focus: '#7f5f2a',
  },
  'restaurant-warm': {
    key: 'restaurant-warm',
    label: 'Warm dining',
    canvas: '#fff4df',
    surface: '#fffaf1',
    surfaceAlt: '#efd9b7',
    ink: '#211814',
    mutedInk: '#6d5548',
    accent: '#b9432f',
    accentSoft: '#f3c5b7',
    line: '#e4c79f',
    inverse: '#ffffff',
    focus: '#7f2f22',
  },
  'startup-product': {
    key: 'startup-product',
    label: 'Product launch',
    canvas: '#eef5ff',
    surface: '#ffffff',
    surfaceAlt: '#dbeafe',
    ink: '#16191f',
    mutedInk: '#5f6b7a',
    accent: '#116dff',
    accentSoft: '#cfe1ff',
    line: '#bfd3f2',
    inverse: '#ffffff',
    focus: '#0b4db8',
  },
  'commerce-studio': {
    key: 'commerce-studio',
    label: 'Studio commerce',
    canvas: '#f6f0e7',
    surface: '#fffaf3',
    surfaceAlt: '#ead8ca',
    ink: '#0d0d0d',
    mutedInk: '#62564d',
    accent: '#b56d4c',
    accentSoft: '#efcdbd',
    line: '#d7c5b4',
    inverse: '#ffffff',
    focus: '#7b432d',
  },
  'creative-mono': {
    key: 'creative-mono',
    label: 'Mono creative',
    canvas: '#ffffff',
    surface: '#f4f4f1',
    surfaceAlt: '#111111',
    ink: '#050505',
    mutedInk: '#666666',
    accent: '#d8ea20',
    accentSoft: '#f2ff3d',
    line: '#d8d8d2',
    inverse: '#ffffff',
    focus: '#879500',
  },
  'health-clinical': {
    key: 'health-clinical',
    label: 'Clinical care',
    canvas: '#f8fbfa',
    surface: '#ffffff',
    surfaceAlt: '#cfeee4',
    ink: '#123c32',
    mutedInk: '#57746b',
    accent: '#2f8f75',
    accentSoft: '#dff5ee',
    line: '#c5ded7',
    inverse: '#ffffff',
    focus: '#1d6f5b',
  },
  'realestate-quiet': {
    key: 'realestate-quiet',
    label: 'Quiet property',
    canvas: '#faf7f1',
    surface: '#ffffff',
    surfaceAlt: '#d8d2c6',
    ink: '#26313d',
    mutedInk: '#67717b',
    accent: '#8b745b',
    accentSoft: '#e8ded2',
    line: '#d6cbbd',
    inverse: '#ffffff',
    focus: '#5f4d3a',
  },
  'beauty-luxe': {
    key: 'beauty-luxe',
    label: 'Luxe beauty',
    canvas: '#fbf5f2',
    surface: '#fffaf8',
    surfaceAlt: '#ead0cd',
    ink: '#2b1c18',
    mutedInk: '#80655e',
    accent: '#d5b778',
    accentSoft: '#f2e2c1',
    line: '#dec7c1',
    inverse: '#ffffff',
    focus: '#9b7b3d',
  },
  'travel-editorial': {
    key: 'travel-editorial',
    label: 'Editorial travel',
    canvas: '#f6ecd8',
    surface: '#fff8ed',
    surfaceAlt: '#9cc7dc',
    ink: '#101827',
    mutedInk: '#657184',
    accent: '#d88a3d',
    accentSoft: '#f0d2a8',
    line: '#d9c29d',
    inverse: '#ffffff',
    focus: '#945b24',
  },
  'local-warm': {
    key: 'local-warm',
    label: 'Local warm',
    canvas: '#fbf6ec',
    surface: '#ffffff',
    surfaceAlt: '#efe1c8',
    ink: '#1f2622',
    mutedInk: '#687169',
    accent: '#c26f3d',
    accentSoft: '#efd4be',
    line: '#ddcdb8',
    inverse: '#ffffff',
    focus: '#894b27',
  },
  'neutral-studio': {
    key: 'neutral-studio',
    label: 'Neutral studio',
    canvas: '#f7f7f5',
    surface: '#ffffff',
    surfaceAlt: '#e4e4df',
    ink: '#111111',
    mutedInk: '#64645d',
    accent: '#3f5f5b',
    accentSoft: '#d8e2df',
    line: '#d8d8d2',
    inverse: '#ffffff',
    focus: '#29423e',
  },
};

export const DEFAULT_TEMPLATE_PALETTE_KEY: TemplatePaletteKey = 'neutral-studio';

export function getTemplatePalette(key?: TemplatePaletteKey): TemplatePalette {
  return TEMPLATE_PALETTES[key ?? DEFAULT_TEMPLATE_PALETTE_KEY] ?? TEMPLATE_PALETTES[DEFAULT_TEMPLATE_PALETTE_KEY];
}

export const TEMPLATE_STYLE_LABELS: Record<TemplateVisualStyle, string> = {
  editorial: '에디토리얼',
  executive: '임원용',
  luxury: '럭셔리',
  clinical: '클리니컬',
  local: '로컬',
  product: '제품 중심',
  portfolio: '포트폴리오',
  'high-contrast': '하이 콘트라스트',
  calm: '차분함',
  minimal: '미니멀',
  playful: '플레이풀',
  premium: '프리미엄',
  'image-led': '이미지 중심',
  conversion: '전환 중심',
};

export const TEMPLATE_DENSITY_LABELS: Record<TemplateDensity, string> = {
  minimal: '미니멀',
  balanced: '균형형',
  editorial: '에디토리얼',
  commercial: '상업형',
  dashboard: '대시보드형',
  portfolio: '포트폴리오형',
  conversion: '전환형',
};

export const TEMPLATE_PAGE_TYPE_LABELS: Record<TemplatePageType, string> = {
  home: '홈',
  about: '소개',
  service: '서비스',
  contact: '문의',
  pricing: '가격',
  portfolio: '포트폴리오',
  gallery: '갤러리',
  blog: '블로그',
  product: '상품',
  booking: '예약',
  faq: 'FAQ',
  'legal-detail': '법률 상세',
};

export const TEMPLATE_LAYOUT_LABELS: Record<TemplateLayoutFamily, string> = {
  'cinematic-hero': '시네마틱 히어로',
  'editorial-split': '에디토리얼 분할',
  'bento-grid': '벤토 그리드',
  'product-showcase': '제품 쇼케이스',
  'magazine-stack': '매거진 스택',
  'service-index': '서비스 인덱스',
  'booking-first': '예약 우선',
  'masonry-gallery': '메이슨리 갤러리',
  'conversion-landing': '전환 랜딩',
};

export const TEMPLATE_QUALITY_LABELS: Record<TemplateQualityTier, string> = {
  premium: 'Premium',
  standard: 'Standard',
  draft: 'Draft',
  'under-review': 'Under review',
};
