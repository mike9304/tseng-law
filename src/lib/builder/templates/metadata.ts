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

/**
 * Compute a quality score (0–100) from REAL document signals, so the template picker
 * reflects actual page quality instead of a hardcoded literal. Curated hero templates that
 * set an explicit `qaScore` keep it (this is only a fallback). Rewards image-rich, well-sized,
 * section-varied pages — the qualities the Track-C rebuild added (WIX-PERFECT #2/#7).
 */
export function computeTemplateQaScore(template: PageTemplate): number {
  const nodes = template.document?.nodes ?? [];
  const nodeCount = nodes.length;
  const imageCount = nodes.filter((n) => n.kind === 'image').length;
  const distinctKinds = new Set(nodes.map((n) => n.kind)).size;

  let score = 55; // baseline for a valid, schema-passing template
  // Node budget: the registry enforces a Wix-grade 40–70 range; reward the sweet spot.
  if (nodeCount >= 45 && nodeCount <= 66) score += 14;
  else if (nodeCount >= 40 && nodeCount <= 70) score += 8;
  // Real imagery is the single biggest visual-quality signal (lorem skeletons had 0).
  if (imageCount >= 4) score += 16;
  else if (imageCount >= 2) score += 10;
  else if (imageCount >= 1) score += 4;
  // Element variety (heading/text/image/button/container ≈ a real composed page).
  if (distinctKinds >= 5) score += 10;
  else if (distinctKinds >= 4) score += 6;
  // Section richness when known.
  const sectionCount = (template as { sections?: string[] }).sections?.length ?? 0;
  if (sectionCount >= 4) score += 5;
  return Math.max(0, Math.min(100, score));
}

/** Derive a quality tier from a computed score when none is explicitly curated. */
function tierForScore(score: number): TemplateQualityTier {
  if (score >= 85) return 'premium';
  if (score >= 70) return 'standard';
  if (score >= 55) return 'draft';
  return 'under-review';
}

export function getTemplateMetadata(template: PageTemplate): TemplateMetadata {
  const category = CATEGORY_DEFAULTS[template.category] ?? CATEGORY_DEFAULTS.layout;
  const specific = TEMPLATE_METADATA[template.id] ?? {};
  // Per-template CURATED qaScore/qualityTier win (the 5 hero templates). Otherwise compute
  // from real document signals — NOT the category blanket 'standard' — so the picker can't
  // badge a thin page premium nor under-rate a genuinely rich rebuilt one.
  const computedScore = computeTemplateQaScore(template);
  const qaScore = specific.qaScore ?? computedScore;
  const qualityTier = specific.qualityTier ?? tierForScore(computedScore);
  return {
    ...category,
    ...specific,
    qaScore,
    qualityTier,
    pageType: specific.pageType ?? category.pageType ?? inferPageType(template),
    tags: unique([...(category.tags ?? []), ...(specific.tags ?? []), template.subcategory]),
  };
}

/* ── Centralized WCAG-AA contrast floor (applied to served templates) ──────────
 * Many hand-authored templates put dark-ish accent / muted text on a light tint or
 * white, landing below AA (4.5:1 body / 3:1 large). This conservatively darkens ONLY
 * dark-ish text that sits on a LIGHT background — never light/white text (so hero/scrim
 * text over photos is untouched, even where its background can't be resolved). It clones
 * touched nodes (no source mutation) and is idempotent (already-compliant text is left as-is). */
function _cRgb(col: string | undefined | null): [number, number, number] | null {
  if (col == null) return null;
  const s = String(col).trim().toLowerCase();
  if (s === 'white') return [255, 255, 255];
  if (s === 'black') return [0, 0, 0];
  if (s.startsWith('#')) {
    let h = s.slice(1);
    if (h.length === 3) h = h.replace(/./g, '$&$&');
    if (h.length >= 6) return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    return null;
  }
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (m) { const p = m[1].split(',').map((x) => parseFloat(x)); if ((p[3] == null ? 1 : p[3]) < 0.6) return null; return [p[0], p[1], p[2]]; }
  return null;
}
function _cHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}
function _cLum([r, g, b]: [number, number, number]): number {
  const f = (v: number) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function _cRatio(a: [number, number, number], b: [number, number, number]): number {
  const l = [_cLum(a), _cLum(b)].sort((x, y) => y - x);
  return (l[0] + 0.05) / (l[1] + 0.05);
}
function _headingSize(level: number | undefined): number {
  const l = level ?? 2;
  return l === 1 ? 52 : l === 2 ? 36 : l === 3 ? 24 : 19;
}
export function applyContrastFloor(template: PageTemplate): PageTemplate {
  const nodes = template.document?.nodes;
  if (!nodes?.length) return template;
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const resolveBg = (node: typeof nodes[number]): [number, number, number] => {
    let p = node.parentId ? byId.get(node.parentId) : undefined;
    while (p) {
      const c = (p.content ?? {}) as { background?: string };
      const st = (p.style ?? {}) as { backgroundColor?: string };
      const bg = _cRgb(c.background) ?? _cRgb(st.backgroundColor);
      if (bg) return bg;
      p = p.parentId ? byId.get(p.parentId) : undefined;
    }
    return [255, 255, 255]; // page default
  };
  let changed = false;
  const newNodes = nodes.map((n): (typeof nodes)[number] => {
    if (n.kind !== 'text' && n.kind !== 'heading' && n.kind !== 'button') return n;
    const c = (n.content ?? {}) as { color?: string; fontSize?: number; fontWeight?: string; level?: number };
    const fg = _cRgb(c.color);
    if (!fg) return n;
    if (_cLum(fg) > 0.5) return n; // skip light/white text → never break hero/scrim-over-photo text
    const bg = n.kind === 'button' ? (_cRgb((n.style as { backgroundColor?: string } | undefined)?.backgroundColor) ?? resolveBg(n)) : resolveBg(n);
    const bgLum = _cLum(bg);
    // Light bg → darken the dark text; very-dark solid bg → lighten it. Mid-tone bg is ambiguous → leave as authored.
    if (bgLum > 0.25 && bgLum <= 0.5) return n;
    const fs = n.kind === 'heading' ? _headingSize(c.level) : (c.fontSize ?? 16);
    const large = fs >= 24 || (fs >= 18.66 && c.fontWeight === 'bold');
    const need = large ? 3 : 4.5;
    if (_cRatio(fg, bg) >= need) return n;
    let [r, g, b] = fg;
    if (bgLum > 0.5) {
      for (let i = 0; i < 30 && _cRatio([r, g, b], bg) < need; i++) { r *= 0.92; g *= 0.92; b *= 0.92; }
    } else {
      // very-dark solid background (lum ≤ 0.25 — a section, not a photo) → lighten text toward white
      for (let i = 0; i < 30 && _cRatio([r, g, b], bg) < need; i++) { r += (255 - r) * 0.12; g += (255 - g) * 0.12; b += (255 - b) * 0.12; }
    }
    changed = true;
    return { ...n, content: { ...n.content, color: _cHex(r, g, b) } } as (typeof nodes)[number];
  });
  if (!changed) return template;
  return { ...template, document: { ...template.document, nodes: newNodes } };
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
