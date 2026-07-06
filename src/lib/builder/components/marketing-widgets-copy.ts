import type { CardVariantKey } from '@/lib/builder/site/component-variants';
import type {
  BuilderComparisonTableCanvasNode,
  BuilderPricingTableCanvasNode,
  BuilderTeamMemberCardCanvasNode,
  BuilderTestimonialCarouselCanvasNode,
} from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { getContainerGalleryCopy } from './container-gallery-copy';

type PricingPlan = BuilderPricingTableCanvasNode['content']['plans'][number];
type ComparisonRow = BuilderComparisonTableCanvasNode['content']['rows'][number];
type TeamMemberContent = BuilderTeamMemberCardCanvasNode['content'];
type TestimonialItem = BuilderTestimonialCarouselCanvasNode['content']['items'][number];

export interface MarketingWidgetsCopy {
  pricingTable: {
    empty: string;
    defaultCtaLabel: string;
    defaultPlans: PricingPlan[];
    inspector: {
      plans: string;
    };
  };
  comparisonTable: {
    empty: string;
    defaultColumns: string[];
    defaultRows: ComparisonRow[];
    inspector: {
      columns: string;
      rows: string;
    };
  };
  teamMemberCard: {
    defaultContent: TeamMemberContent;
    inspector: {
      name: string;
      role: string;
      bio: string;
      avatarUrl: string;
      socialLinks: string;
      cardStyle: string;
      cardVariants: Record<CardVariantKey, string>;
    };
  };
  testimonialCarousel: {
    empty: string;
    defaultItems: TestimonialItem[];
    itemAriaLabel: (index: number) => string;
    inspector: {
      items: string;
      autoplayMs: string;
      showStars: string;
    };
  };
}

export const PRICING_TABLE_LEGACY_DEFAULT_PLANS: PricingPlan[] = [
  { name: '기본', price: '50만원', period: '/ 상담', featured: false, ctaLabel: '신청', ctaHref: '/ko/contact', features: ['초기 1시간 상담', '서면 요약', '문의 1회'] },
  { name: '표준', price: '200만원', period: '/ 월', featured: true, ctaLabel: '추천', ctaHref: '/ko/contact', features: ['월 5건 자문', '계약서 검토', '협상 지원', '월간 보고'] },
  { name: '프리미엄', price: '500만원', period: '/ 월', featured: false, ctaLabel: '문의', ctaHref: '/ko/contact', features: ['무제한 자문', '소송 대응', '한·대 양국 협업', '실시간 응대'] },
];

export const COMPARISON_TABLE_LEGACY_DEFAULT_COLUMNS = ['기본', '표준', '프리미엄'];

export const COMPARISON_TABLE_LEGACY_DEFAULT_ROWS: ComparisonRow[] = [
  { feature: '월 상담 건수', values: ['1회', '5회', '무제한'] },
  { feature: '계약 검토', values: ['—', '✓', '✓'] },
  { feature: '소송 대응', values: ['—', '—', '✓'] },
  { feature: '한·대 양국 협업', values: ['—', '✓', '✓'] },
];

export const TEAM_MEMBER_CARD_LEGACY_DEFAULTS = {
  name: '김 변호사',
  role: '대표 변호사 · 한국·대만 자격',
  bio: '국제 기업 자문과 한·대 사이 협상 중재를 전문으로 합니다.',
  avatar: '',
  socialLinks: [
    { label: 'LinkedIn', href: 'https://linkedin.com/' },
  ],
} as const satisfies TeamMemberContent;

export const TESTIMONIAL_CAROUSEL_LEGACY_DEFAULT_ITEMS: TestimonialItem[] = [
  { name: '김 OO', role: '기업 의뢰인', quote: '한·대 양국 법무를 정확하게 검토해 주셔서 협상이 안전했습니다.' },
  { name: '張 OO', role: 'PMC 대표', quote: '시간대 차이를 고려해 빠르게 응답해 주셨고 결과도 만족스러웠습니다.' },
];

function samePricingPlan(left: PricingPlan, right: PricingPlan): boolean {
  return left.name === right.name
    && left.price === right.price
    && (left.period ?? '') === (right.period ?? '')
    && Boolean(left.featured) === Boolean(right.featured)
    && left.ctaLabel === right.ctaLabel
    && left.ctaHref === right.ctaHref
    && left.features.length === right.features.length
    && left.features.every((feature, index) => feature === right.features[index]);
}

function isLegacyPricingPlans(plans: PricingPlan[]): boolean {
  return plans.length === PRICING_TABLE_LEGACY_DEFAULT_PLANS.length
    && plans.every((plan, index) => samePricingPlan(plan, PRICING_TABLE_LEGACY_DEFAULT_PLANS[index]));
}

export function localizedPricingPlans(plans: PricingPlan[], localizedDefaults: PricingPlan[]): PricingPlan[] {
  return isLegacyPricingPlans(plans) ? localizedDefaults : plans;
}

function sameStringArray(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function sameComparisonRow(left: ComparisonRow, right: ComparisonRow): boolean {
  return left.feature === right.feature && sameStringArray(left.values, right.values);
}

function isLegacyComparisonTable(columns: string[], rows: ComparisonRow[]): boolean {
  return sameStringArray(columns, COMPARISON_TABLE_LEGACY_DEFAULT_COLUMNS)
    && rows.length === COMPARISON_TABLE_LEGACY_DEFAULT_ROWS.length
    && rows.every((row, index) => sameComparisonRow(row, COMPARISON_TABLE_LEGACY_DEFAULT_ROWS[index]));
}

export function localizedComparisonTableDefaults(
  columns: string[],
  rows: ComparisonRow[],
  localizedColumns: string[],
  localizedRows: ComparisonRow[],
): { columns: string[]; rows: ComparisonRow[] } {
  if (!isLegacyComparisonTable(columns, rows)) return { columns, rows };
  return { columns: localizedColumns, rows: localizedRows };
}

export function localizedMarketingWidgetText(
  value: string | undefined,
  localized: string,
  legacyDefault: string,
): string {
  const current = value ?? '';
  return current === legacyDefault ? localized : current;
}

export function localizedTeamMemberContent(
  content: TeamMemberContent,
  localized: TeamMemberContent,
): TeamMemberContent {
  return {
    ...content,
    name: localizedMarketingWidgetText(content.name, localized.name, TEAM_MEMBER_CARD_LEGACY_DEFAULTS.name),
    role: localizedMarketingWidgetText(content.role, localized.role, TEAM_MEMBER_CARD_LEGACY_DEFAULTS.role),
    bio: localizedMarketingWidgetText(content.bio, localized.bio, TEAM_MEMBER_CARD_LEGACY_DEFAULTS.bio),
  };
}

function sameTestimonialItem(left: TestimonialItem, right: TestimonialItem): boolean {
  return left.name === right.name
    && (left.role ?? '') === (right.role ?? '')
    && left.quote === right.quote
    && (left.avatar ?? '') === (right.avatar ?? '');
}

function isLegacyTestimonialItems(items: TestimonialItem[]): boolean {
  return items.length === TESTIMONIAL_CAROUSEL_LEGACY_DEFAULT_ITEMS.length
    && items.every((item, index) => sameTestimonialItem(item, TESTIMONIAL_CAROUSEL_LEGACY_DEFAULT_ITEMS[index]));
}

export function localizedTestimonialItems(
  items: TestimonialItem[],
  localizedDefaults: TestimonialItem[],
): TestimonialItem[] {
  return isLegacyTestimonialItems(items) ? localizedDefaults : items;
}

export function getMarketingWidgetsCopy(locale: Locale): MarketingWidgetsCopy {
  const cardVariants = getContainerGalleryCopy(locale).container.cardVariants;

  if (locale === 'zh-hant') {
    return {
      pricingTable: {
        empty: '請在檢查器新增方案',
        defaultCtaLabel: '選擇',
        defaultPlans: [
          { name: '基礎', price: 'NT$15,000', period: '/ 諮詢', featured: false, ctaLabel: '申請', ctaHref: '/zh-hant/contact', features: ['初次 1 小時諮詢', '書面摘要', '一次後續提問'] },
          { name: '標準', price: 'NT$60,000', period: '/ 月', featured: true, ctaLabel: '推薦', ctaHref: '/zh-hant/contact', features: ['每月 5 件諮詢', '合約審閱', '談判支援', '月度報告'] },
          { name: '進階', price: 'NT$150,000', period: '/ 月', featured: false, ctaLabel: '聯絡我們', ctaHref: '/zh-hant/contact', features: ['不限次數諮詢', '訴訟應對', '韓台雙邊協作', '即時回覆'] },
        ],
        inspector: {
          plans: '方案（name | price | period | featured | ctaLabel | ctaHref | feature1; feature2）',
        },
      },
      comparisonTable: {
        empty: '請在檢查器新增比較項目',
        defaultColumns: ['基礎', '標準', '進階'],
        defaultRows: [
          { feature: '每月諮詢件數', values: ['1 次', '5 次', '不限次數'] },
          { feature: '合約審閱', values: ['—', '✓', '✓'] },
          { feature: '訴訟應對', values: ['—', '—', '✓'] },
          { feature: '韓台雙邊協作', values: ['—', '✓', '✓'] },
        ],
        inspector: {
          columns: '欄位（每行一個）',
          rows: '列（feature | value1 | value2 ...）',
        },
      },
      teamMemberCard: {
        defaultContent: {
          name: '王律師',
          role: '合夥律師 · 韓國與台灣資格',
          bio: '專精跨國企業顧問與韓台雙邊協商。',
          avatar: '',
          socialLinks: [
            { label: 'LinkedIn', href: 'https://linkedin.com/' },
          ],
        },
        inspector: {
          name: '姓名',
          role: '職稱',
          bio: '簡介',
          avatarUrl: '頭像 URL',
          socialLinks: '社群（label | href）',
          cardStyle: '卡片樣式',
          cardVariants,
        },
      },
      testimonialCarousel: {
        empty: '請在檢查器新增客戶推薦',
        defaultItems: [
          { name: '台灣科技公司', role: '法務主管', quote: '韓台雙邊法務風險被清楚拆解，內部決策更有依據。' },
          { name: '韓國製造企業', role: '海外事業負責人', quote: '跨時區溝通迅速，合約談判節奏也掌握得很好。' },
        ],
        itemAriaLabel: (index) => `推薦 ${index}`,
        inspector: {
          items: '推薦（name | role | quote）',
          autoplayMs: '自動切換（ms，0 = 關閉）',
          showStars: '顯示星等',
        },
      },
    };
  }

  if (locale === 'en') {
    return {
      pricingTable: {
        empty: 'Add pricing plans in the inspector',
        defaultCtaLabel: 'Select',
        defaultPlans: [
          { name: 'Basic', price: '$400', period: '/ consult', featured: false, ctaLabel: 'Apply', ctaHref: '/en/contact', features: ['Initial 1-hour consultation', 'Written summary', 'One follow-up question'] },
          { name: 'Standard', price: '$1,600', period: '/ mo', featured: true, ctaLabel: 'Recommended', ctaHref: '/en/contact', features: ['5 advisory matters per month', 'Contract review', 'Negotiation support', 'Monthly report'] },
          { name: 'Premium', price: '$4,000', period: '/ mo', featured: false, ctaLabel: 'Contact us', ctaHref: '/en/contact', features: ['Unlimited advisory', 'Litigation support', 'Korea-Taiwan collaboration', 'Real-time response'] },
        ],
        inspector: {
          plans: 'Plans (name | price | period | featured | ctaLabel | ctaHref | feature1; feature2)',
        },
      },
      comparisonTable: {
        empty: 'Add comparison items in the inspector',
        defaultColumns: ['Basic', 'Standard', 'Premium'],
        defaultRows: [
          { feature: 'Monthly advisory matters', values: ['1', '5', 'Unlimited'] },
          { feature: 'Contract review', values: ['—', '✓', '✓'] },
          { feature: 'Litigation support', values: ['—', '—', '✓'] },
          { feature: 'Korea-Taiwan collaboration', values: ['—', '✓', '✓'] },
        ],
        inspector: {
          columns: 'Columns (one per line)',
          rows: 'Rows (feature | value1 | value2 ...)',
        },
      },
      teamMemberCard: {
        defaultContent: {
          name: 'Attorney Kim',
          role: 'Managing attorney · Korea and Taiwan qualified',
          bio: 'Focused on international business advisory and Korea-Taiwan negotiations.',
          avatar: '',
          socialLinks: [
            { label: 'LinkedIn', href: 'https://linkedin.com/' },
          ],
        },
        inspector: {
          name: 'Name',
          role: 'Role',
          bio: 'Bio',
          avatarUrl: 'Avatar URL',
          socialLinks: 'Social links (label | href)',
          cardStyle: 'Card style',
          cardVariants,
        },
      },
      testimonialCarousel: {
        empty: 'Add testimonials in the inspector',
        defaultItems: [
          { name: 'Taiwan technology company', role: 'Legal lead', quote: 'Korea-Taiwan legal risks were mapped clearly, making internal decisions easier.' },
          { name: 'Korean manufacturer', role: 'Overseas business lead', quote: 'The team responded quickly across time zones and kept negotiations moving.' },
        ],
        itemAriaLabel: (index) => `testimonial ${index}`,
        inspector: {
          items: 'Testimonials (name | role | quote)',
          autoplayMs: 'Autoplay (ms, 0 = off)',
          showStars: 'Show stars',
        },
      },
    };
  }

  return {
    pricingTable: {
      empty: '요금제를 인스펙터에서 추가하세요',
      defaultCtaLabel: '선택',
      defaultPlans: PRICING_TABLE_LEGACY_DEFAULT_PLANS,
      inspector: {
        plans: '요금제 (name | price | period | featured | ctaLabel | ctaHref | feature1; feature2)',
      },
    },
    comparisonTable: {
      empty: '비교 항목을 인스펙터에서 추가하세요',
      defaultColumns: COMPARISON_TABLE_LEGACY_DEFAULT_COLUMNS,
      defaultRows: COMPARISON_TABLE_LEGACY_DEFAULT_ROWS,
      inspector: {
        columns: '컬럼 (한 줄에 하나)',
        rows: '행 (feature | value1 | value2 ...)',
      },
    },
    teamMemberCard: {
      defaultContent: { ...TEAM_MEMBER_CARD_LEGACY_DEFAULTS, socialLinks: TEAM_MEMBER_CARD_LEGACY_DEFAULTS.socialLinks.map((link) => ({ ...link })) },
      inspector: {
        name: '이름',
        role: '직책',
        bio: '소개',
        avatarUrl: '아바타 URL',
        socialLinks: '소셜 (label | href)',
        cardStyle: '카드 스타일',
        cardVariants,
      },
    },
    testimonialCarousel: {
      empty: '의뢰인 후기를 인스펙터에서 추가하세요',
      defaultItems: TESTIMONIAL_CAROUSEL_LEGACY_DEFAULT_ITEMS,
      itemAriaLabel: (index) => `testimonial ${index}`,
      inspector: {
        items: '후기 (name | role | quote)',
        autoplayMs: '자동 전환 (ms, 0 = 끔)',
        showStars: '별점 표시',
      },
    },
  };
}
