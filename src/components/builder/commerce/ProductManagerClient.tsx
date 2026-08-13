'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { downloadText } from './download-text';
import type { Locale } from '@/lib/locales';
import {
  commerceInventoryAvailability,
  type CommerceAvailabilityState,
  CommerceCurrency,
  CommerceProduct,
  CommerceProductStatus,
  CommerceProductVariantStatus,
} from '@/lib/builder/commerce/products-shared';
import styles from './ProductManager.module.css';

type StatusFilter = CommerceProductStatus | 'all';
type StockFilter = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock' | 'backorder';
type SortBy = 'updated-desc' | 'title-asc' | 'price-asc' | 'price-desc';

interface ProductManagerClientProps {
  locale: Locale;
  siteTitle: string;
  initialProducts: CommerceProduct[];
}

const COPY = {
  ko: {
    title: '제품',
    subtitle: '제품, 가격, 재고, 변형, 스토어 노출을 관리합니다.',
    orders: '주문',
    payments: '결제',
    currency: '통화',
    taxRules: '세금 규칙',
    shipping: '배송',
    notifications: '알림',
    webhooks: '웹훅',
    addProduct: '제품 추가',
    exportCsv: 'CSV 내보내기',
    productStats: '제품 통계',
    searchPlaceholder: '제목, SKU, 태그, 카테고리 검색',
    allStatuses: '모든 상태',
    active: '활성',
    draft: '초안',
    archived: '보관됨',
    allCategories: '모든 카테고리',
    allStock: '모든 재고',
    inStock: '재고 있음',
    lowStockFilter: '재고 부족',
    outOfStock: '품절',
    backorder: '예약 판매',
    recentlyUpdated: '최근 수정',
    titleSort: '제목',
    priceLowHigh: '가격 낮은 순',
    priceHighLow: '가격 높은 순',
    selected: (count: number) => `${count}개 선택됨`,
    setActive: '활성으로 설정',
    setDraft: '초안으로 설정',
    archive: '보관',
    clear: '해제',
    editProduct: '제품 수정',
    addProductHeading: '제품 추가',
    reset: '초기화',
    titleLabel: '제목',
    slug: '슬러그',
    slugPlaceholder: '최대 120자 · 영문 소문자·숫자·하이픈 · 예: taiwan-startup-guide (비면 제목에서 자동 생성)',
    description: '설명',
    body: '본문',
    status: '상태',
    sku: 'SKU',
    price: '가격',
    compareAt: '비교 가격',
    quantity: '수량',
    lowStock: '재고 부족',
    categories: '카테고리',
    tags: '태그',
    imageUrl: '이미지 URL',
    imageAlt: '이미지 대체 텍스트',
    options: '옵션',
    addOption: '옵션 추가',
    generateVariants: '변형 생성',
    addOptionsHint: '형식이나 지역 같은 옵션을 추가한 뒤 변형 행을 생성하세요.',
    optionName: '이름',
    optionNamePlaceholder: '옵션 이름 · 최대 80자 · 예: 형식',
    optionValues: '값',
    optionValuesPlaceholder: '쉼표 구분, 항목당 최대 80자 · 예: PDF, 상담',
    variantOptionValuesPlaceholder: '이름=값 쌍, 쉼표 구분 · 예: 형식=PDF',
    variants: '변형',
    addVariant: '변형 추가',
    allowBackorder: '예약 판매',
    noProducts: '아직 제품이 없습니다',
    noProductsHint: '첫 제품을 추가해 제품 갤러리, 제품 페이지, 장바구니, 체크아웃을 활성화하세요.',
    productsList: '제품 목록',
    importExport: '가져오기 / 내보내기 CSV',
    importCsvButton: 'CSV 가져오기',
    exportFiltered: '필터된 항목 내보내기',
    duplicate: '복제',
    edit: '편집',
    removeVariant: '변형 삭제',
    seoDescription: 'SEO 설명',
    seoTitle: 'SEO 제목',
    trackInventory: '재고 추적',
    variantLabel: (index) => `변형 ${index + 1}`,
    generatedVariants: (count: number) => `변형 ${count}개 생성됨`,
  },
  'zh-hant': {
    title: '產品',
    subtitle: '管理產品、定價、庫存、變體與商店可見性。',
    orders: '訂單',
    payments: '付款',
    currency: '幣別',
    taxRules: '稅務規則',
    shipping: '運送',
    notifications: '通知',
    webhooks: 'Webhook',
    addProduct: '新增產品',
    exportCsv: '匯出 CSV',
    productStats: '產品統計',
    searchPlaceholder: '搜尋標題、SKU、標籤、類別',
    allStatuses: '所有狀態',
    active: '啟用',
    draft: '草稿',
    archived: '封存',
    allCategories: '所有類別',
    allStock: '所有庫存',
    inStock: '有庫存',
    lowStockFilter: '庫存不足',
    outOfStock: '缺貨',
    backorder: '預購',
    recentlyUpdated: '最近更新',
    titleSort: '標題',
    priceLowHigh: '價格低到高',
    priceHighLow: '價格高到低',
    selected: (count: number) => `已選取 ${count} 筆`,
    setActive: '設為啟用',
    setDraft: '設為草稿',
    archive: '封存',
    clear: '清除',
    editProduct: '編輯產品',
    addProductHeading: '新增產品',
    reset: '重設',
    titleLabel: '標題',
    slug: 'Slug',
    slugPlaceholder: '留白時自動產生 · 最多 120 字 · 小寫英文/數字/連字號 · 例如：taiwan-startup-guide',
    description: '描述',
    body: '內文',
    status: '狀態',
    sku: 'SKU',
    price: '價格',
    compareAt: '比較價格',
    quantity: '數量',
    lowStock: '庫存不足',
    categories: '類別',
    tags: '標籤',
    imageUrl: '圖片 URL',
    imageAlt: '圖片替代文字',
    options: '選項',
    addOption: '新增選項',
    generateVariants: '產生變體',
    addOptionsHint: '加入格式或地區等選項後，產生變體列。',
    optionName: '名稱',
    optionNamePlaceholder: '選項名稱 · 最多 80 字 · 例如：格式',
    optionValues: '值',
    optionValuesPlaceholder: '逗號分隔，每項最多 80 字 · 例如：PDF, 諮詢',
    variantOptionValuesPlaceholder: '名稱=值 配對，逗號分隔 · 例如：格式=PDF',
    variants: '變體',
    addVariant: '新增變體',
    allowBackorder: '預購',
    noProducts: '目前沒有產品',
    noProductsHint: '新增第一個產品以啟用產品圖庫、產品頁、購物車與結帳。',
    productsList: '產品列表',
    importExport: '匯入 / 匯出 CSV',
    importCsvButton: '匯入 CSV',
    exportFiltered: '匯出已篩選項目',
    duplicate: '複製',
    edit: '編輯',
    removeVariant: '刪除變體',
    seoDescription: 'SEO 描述',
    seoTitle: 'SEO 標題',
    trackInventory: '追蹤庫存',
    variantLabel: (index) => `變體 ${index + 1}`,
    generatedVariants: (count: number) => `已產生 ${count} 個變體`,
  },
  en: {
    title: 'Products',
    subtitle: 'Manage products, pricing, inventory, variants, and storefront visibility.',
    orders: 'Orders',
    payments: 'Payments',
    currency: 'Currency',
    taxRules: 'Tax rules',
    shipping: 'Shipping',
    notifications: 'Notifications',
    webhooks: 'Webhooks',
    addProduct: 'Add product',
    exportCsv: 'Export CSV',
    productStats: 'Product stats',
    searchPlaceholder: 'Search title, SKU, tag, category',
    allStatuses: 'All statuses',
    active: 'Active',
    draft: 'Draft',
    archived: 'Archived',
    allCategories: 'All categories',
    allStock: 'All stock',
    inStock: 'In stock',
    lowStockFilter: 'Low stock',
    outOfStock: 'Out of stock',
    backorder: 'Backorder',
    recentlyUpdated: 'Recently updated',
    titleSort: 'Title',
    priceLowHigh: 'Price low-high',
    priceHighLow: 'Price high-low',
    selected: (count: number) => `${count} selected`,
    setActive: 'Set active',
    setDraft: 'Set draft',
    archive: 'Archive',
    clear: 'Clear',
    editProduct: 'Edit product',
    addProductHeading: 'Add product',
    reset: 'Reset',
    titleLabel: 'Title',
    slug: 'Slug',
    slugPlaceholder: 'Max 120 chars · lowercase letters/numbers/hyphens · e.g. taiwan-startup-guide (auto from title if blank)',
    description: 'Description',
    body: 'Body',
    status: 'Status',
    sku: 'SKU',
    price: 'Price',
    compareAt: 'Compare at',
    quantity: 'Quantity',
    lowStock: 'Low stock',
    categories: 'Categories',
    tags: 'Tags',
    imageUrl: 'Image URL',
    imageAlt: 'Image alt',
    options: 'Options',
    addOption: 'Add option',
    generateVariants: 'Generate variants',
    addOptionsHint: 'Add options such as Format or Region, then generate variant rows.',
    optionName: 'Name',
    optionNamePlaceholder: 'Option name · max 80 chars · e.g. Format',
    optionValues: 'Values',
    optionValuesPlaceholder: 'Comma-separated, max 80 each · e.g. PDF, Consultation',
    variantOptionValuesPlaceholder: 'Name=value pairs, comma-separated · e.g. Format=PDF',
    variants: 'Variants',
    addVariant: 'Add variant',
    allowBackorder: 'Allow backorder',
    noProducts: 'No products yet',
    noProductsHint: 'Add your first product to power product galleries, product pages, cart, and checkout.',
    productsList: 'Products list',
    importExport: 'Import / Export CSV',
    importCsvButton: 'Import CSV',
    exportFiltered: 'Export filtered',
    duplicate: 'Duplicate',
    edit: 'Edit',
    removeVariant: 'Remove variant',
    seoDescription: 'SEO description',
    seoTitle: 'SEO title',
    trackInventory: 'Track inventory',
    variantLabel: (index) => `Variant ${index + 1}`,
    generatedVariants: (count: number) => `Generated ${count} variants`,
  },
} satisfies Record<Locale, {
  title: string;
  subtitle: string;
  orders: string;
  payments: string;
  currency: string;
  taxRules: string;
  shipping: string;
  notifications: string;
  webhooks: string;
  addProduct: string;
  exportCsv: string;
  productStats: string;
  searchPlaceholder: string;
  allStatuses: string;
  active: string;
  draft: string;
  archived: string;
  allCategories: string;
  allStock: string;
  inStock: string;
  lowStockFilter: string;
  lowStock: string;
  outOfStock: string;
  backorder: string;
  recentlyUpdated: string;
  titleSort: string;
  priceLowHigh: string;
  priceHighLow: string;
  selected: (count: number) => string;
  setActive: string;
  setDraft: string;
  archive: string;
  clear: string;
  editProduct: string;
  addProductHeading: string;
  reset: string;
  titleLabel: string;
  slug: string;
  slugPlaceholder: string;
  description: string;
  body: string;
  status: string;
  sku: string;
  price: string;
  compareAt: string;
  quantity: string;
  categories: string;
  tags: string;
  imageUrl: string;
  imageAlt: string;
  options: string;
  addOption: string;
  generateVariants: string;
  addOptionsHint: string;
  optionName: string;
  optionNamePlaceholder: string;
  optionValues: string;
  optionValuesPlaceholder: string;
  variantOptionValuesPlaceholder: string;
  variants: string;
  addVariant: string;
  allowBackorder: string;
  noProducts: string;
  noProductsHint: string;
  productsList: string;
  importExport: string;
  importCsvButton: string;
  exportFiltered: string;
  duplicate: string;
  edit: string;
  removeVariant: string;
  seoDescription: string;
  seoTitle: string;
  trackInventory: string;
  variantLabel: (index: number) => string;
  generatedVariants: (count: number) => string;
}>;

type Draft = {
  productId?: string;
  title: string;
  slug: string;
  description: string;
  body: string;
  status: CommerceProductStatus;
  sku: string;
  price: string;
  compareAtPrice: string;
  currency: CommerceCurrency;
  trackInventory: boolean;
  quantity: string;
  lowStockThreshold: string;
  allowBackorder: boolean;
  mediaUrl: string;
  mediaAlt: string;
  categoryIds: string;
  tags: string;
  seoTitle: string;
  seoDescription: string;
  options: OptionDraft[];
  variants: VariantDraft[];
};

type OptionDraft = {
  optionId: string;
  name: string;
  values: string;
};

type VariantDraft = {
  variantId: string;
  title: string;
  sku: string;
  optionValues: string;
  price: string;
  compareAtPrice: string;
  quantity: string;
  lowStockThreshold: string;
  allowBackorder: boolean;
  mediaId: string;
  mediaUrl: string;
  status: CommerceProductVariantStatus;
};

function emptyVariantDraft(index = 0): VariantDraft {
  return {
    variantId: index === 0 ? 'default' : `variant-${index + 1}`,
    title: '',
    sku: '',
    optionValues: '',
    price: '',
    compareAtPrice: '',
    quantity: '0',
    lowStockThreshold: '0',
    allowBackorder: false,
    mediaId: '',
    mediaUrl: '',
    status: 'active',
  };
}

const emptyDraft: Draft = {
  title: '',
  slug: '',
  description: '',
  body: '',
  status: 'draft',
  sku: '',
  price: '0',
  compareAtPrice: '',
  currency: 'TWD',
  trackInventory: true,
  quantity: '0',
  lowStockThreshold: '0',
  allowBackorder: false,
  mediaUrl: '',
  mediaAlt: '',
  categoryIds: '',
  tags: '',
  seoTitle: '',
  seoDescription: '',
  options: [],
  variants: [emptyVariantDraft()],
};

function formatPrice(product: CommerceProduct): string {
  return new Intl.NumberFormat(product.locale === 'ko' ? 'ko-KR' : product.locale === 'zh-hant' ? 'zh-TW' : 'en-US', {
    style: 'currency',
    currency: product.currency,
    maximumFractionDigits: product.currency === 'TWD' || product.currency === 'KRW' ? 0 : 2,
  }).format(product.priceCents / 100);
}

function centsFromInput(value: string): number {
  const number = Number.parseFloat(value.replace(/,/g, ''));
  return Number.isFinite(number) ? Math.max(0, Math.round(number * 100)) : 0;
}

function priceInput(cents?: number): string {
  return typeof cents === 'number' ? String(cents / 100) : '';
}

function csvEscape(value: unknown): string {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cell = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && quoted && line[index + 1] === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      cells.push(cell);
      cell = '';
    } else {
      cell += char;
    }
  }
  cells.push(cell);
  return cells;
}

function productToDraft(product: CommerceProduct): Draft {
  const firstImage = product.media.find((media) => media.type === 'image') ?? product.media[0];
  const mediaById = new Map(product.media.map((media) => [media.mediaId, media]));
  return {
    productId: product.productId,
    title: product.title,
    slug: product.slug,
    description: product.description,
    body: product.body,
    status: product.status,
    sku: product.sku,
    price: priceInput(product.priceCents),
    compareAtPrice: priceInput(product.compareAtPriceCents),
    currency: product.currency,
    trackInventory: product.inventory.trackInventory,
    quantity: String(product.inventory.quantity),
    lowStockThreshold: String(product.inventory.lowStockThreshold),
    allowBackorder: product.inventory.allowBackorder,
    mediaUrl: firstImage?.url ?? '',
    mediaAlt: firstImage?.alt ?? '',
    categoryIds: product.categoryIds.join(', '),
    tags: product.tags.join(', '),
    seoTitle: product.seo.title ?? '',
    seoDescription: product.seo.description ?? '',
    options: product.options.map((option) => ({
      optionId: option.optionId,
      name: option.name,
      values: option.values.join(', '),
    })),
    variants: product.variants.map((variant, index) => {
      const media = variant.mediaId ? mediaById.get(variant.mediaId) : undefined;
      return {
        variantId: variant.variantId || `variant-${index + 1}`,
        title: variant.title,
        sku: variant.sku,
        optionValues: optionValueTextFromRecord(variant.optionValues),
        price: priceInput(variant.priceCents),
        compareAtPrice: priceInput(variant.compareAtPriceCents),
        quantity: String(variant.inventory.quantity),
        lowStockThreshold: String(variant.inventory.lowStockThreshold),
        allowBackorder: variant.inventory.allowBackorder,
        mediaId: variant.mediaId ?? '',
        mediaUrl: media?.url ?? '',
        status: variant.status,
      };
    }),
  };
}

function draftList(value: string): string[] {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

function optionValueTextFromRecord(values: Record<string, string>): string {
  return Object.entries(values).map(([key, value]) => `${key}=${value}`).join(', ');
}

function parseOptionValueText(value: string): Record<string, string> {
  return Object.fromEntries(value.split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [key = '', ...rest] = item.split('=');
      return [key.trim(), rest.join('=').trim()];
    })
    .filter(([key, optionValue]) => key && optionValue));
}

function optionIdFromName(name: string, fallback: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || fallback;
}

function optionsFromDraft(draft: Draft) {
  return draft.options
    .map((option, index) => {
      const values = draftList(option.values);
      if (!option.name.trim() || values.length === 0) return null;
      return {
        optionId: option.optionId.trim() || optionIdFromName(option.name.trim(), `option-${index + 1}`),
        name: option.name.trim(),
        values,
      };
    })
    .filter((option): option is { optionId: string; name: string; values: string[] } => Boolean(option));
}

function variantMediaId(variant: VariantDraft, index: number): string | undefined {
  if (variant.mediaId.trim()) return variant.mediaId.trim();
  if (variant.mediaUrl.trim()) return `variant-media-${index + 1}`;
  return undefined;
}

function variantsFromDraft(draft: Draft) {
  return draft.variants
    .map((variant, index) => {
      if (!variant.title.trim() && !variant.sku.trim()) return null;
      const compareAtPriceCents = variant.compareAtPrice ? centsFromInput(variant.compareAtPrice) : undefined;
      const mediaId = variantMediaId(variant, index);
      return {
        variantId: variant.variantId.trim() || `variant-${index + 1}`,
        title: variant.title.trim() || `Variant ${index + 1}`,
        sku: variant.sku.trim() || `${draft.sku}-${index + 1}`,
        optionValues: parseOptionValueText(variant.optionValues),
        priceCents: centsFromInput(variant.price || draft.price),
        ...(compareAtPriceCents ? { compareAtPriceCents } : {}),
        inventory: {
          trackInventory: draft.trackInventory,
          quantity: Math.max(0, Number.parseInt(variant.quantity || draft.quantity, 10) || 0),
          lowStockThreshold: Math.max(0, Number.parseInt(variant.lowStockThreshold || draft.lowStockThreshold, 10) || 0),
          allowBackorder: variant.allowBackorder,
        },
        ...(mediaId ? { mediaId } : {}),
        status: variant.status,
      };
    })
    .filter((variant): variant is {
      variantId: string;
      title: string;
      sku: string;
      optionValues: Record<string, string>;
      priceCents: number;
      compareAtPriceCents?: number;
      inventory: {
        trackInventory: boolean;
        quantity: number;
        lowStockThreshold: number;
        allowBackorder: boolean;
      };
      mediaId?: string;
      status: CommerceProductVariantStatus;
    } => Boolean(variant));
}

function payloadFromDraft(locale: Locale, draft: Draft) {
  const priceCents = centsFromInput(draft.price);
  const compareAtPriceCents = draft.compareAtPrice ? centsFromInput(draft.compareAtPrice) : undefined;
  const variantMedia = draft.variants
    .map((variant, index) => {
      const mediaId = variantMediaId(variant, index);
      const url = variant.mediaUrl.trim();
      if (!mediaId || !url) return null;
      return {
        mediaId,
        type: 'image' as const,
        url,
        alt: `${variant.title || draft.title || 'Variant'} image`,
        sortOrder: index + 2,
      };
    })
    .filter((media): media is { mediaId: string; type: 'image'; url: string; alt: string; sortOrder: number } => Boolean(media));
  return {
    locale,
    title: draft.title,
    ...(draft.slug ? { slug: draft.slug } : {}),
    description: draft.description,
    body: draft.body,
    status: draft.status,
    sku: draft.sku,
    priceCents,
    ...(compareAtPriceCents ? { compareAtPriceCents } : {}),
    currency: draft.currency,
    inventory: {
      trackInventory: draft.trackInventory,
      quantity: Math.max(0, Number.parseInt(draft.quantity, 10) || 0),
      lowStockThreshold: Math.max(0, Number.parseInt(draft.lowStockThreshold, 10) || 0),
      allowBackorder: draft.allowBackorder,
    },
    media: [
      ...(draft.mediaUrl ? [{
      mediaId: 'cover',
      type: 'image' as const,
      url: draft.mediaUrl,
      alt: draft.mediaAlt || draft.title || 'Product image',
      sortOrder: 1,
    }] : []),
      ...variantMedia,
    ],
    options: optionsFromDraft(draft),
    categoryIds: draftList(draft.categoryIds),
    tags: draftList(draft.tags),
    variants: variantsFromDraft(draft),
    seo: {
      ...(draft.seoTitle ? { title: draft.seoTitle } : {}),
      ...(draft.seoDescription ? { description: draft.seoDescription } : {}),
    },
  };
}

function inventoryState(product: CommerceProduct): StockFilter {
  const state = commerceInventoryAvailability(product.inventory);
  return state === 'disabled' ? 'out-of-stock' : state;
}

function variantAvailability(variant: VariantDraft, trackInventory: boolean): CommerceAvailabilityState {
  return commerceInventoryAvailability({
    trackInventory,
    quantity: Math.max(0, Number.parseInt(variant.quantity, 10) || 0),
    lowStockThreshold: Math.max(0, Number.parseInt(variant.lowStockThreshold, 10) || 0),
    allowBackorder: variant.allowBackorder,
  }, variant.status);
}

function productCsv(products: CommerceProduct[]): string {
  const rows = [
    ['title', 'sku', 'price', 'currency', 'status', 'quantity', 'categories', 'tags', 'description'],
    ...products.map((product) => [
      product.title,
      product.sku,
      product.priceCents / 100,
      product.currency,
      product.status,
      product.inventory.quantity,
      product.categoryIds.join(';'),
      product.tags.join(';'),
      product.description,
    ]),
  ];
  return rows.map((row) => row.map(csvEscape).join(',')).join('\n');
}

function parseImportCsv(locale: Locale, text: string) {
  const [headerLine, ...lines] = text.split(/\r?\n/).filter((line) => line.trim());
  if (!headerLine) return [];
  const headers = parseCsvLine(headerLine).map((header) => header.trim());
  return lines.map((line) => {
    const cells = parseCsvLine(line);
    const row = Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? '']));
    return {
      locale,
      title: row.title,
      description: row.description || row.title,
      status: row.status === 'active' || row.status === 'archived' ? row.status : 'draft',
      sku: row.sku,
      priceCents: centsFromInput(row.price),
      currency: row.currency === 'KRW' || row.currency === 'USD' || row.currency === 'TWD' ? row.currency : 'TWD',
      inventory: {
        trackInventory: true,
        quantity: Math.max(0, Number.parseInt(row.quantity ?? '0', 10) || 0),
        lowStockThreshold: 0,
        allowBackorder: false,
      },
      categoryIds: (row.categories ?? '').split(';').map((item) => item.trim()).filter(Boolean),
      tags: (row.tags ?? '').split(';').map((item) => item.trim()).filter(Boolean),
    };
  });
}

export default function ProductManagerClient({ locale, siteTitle, initialProducts }: ProductManagerClientProps) {
  const copy = COPY[locale];
  const [products, setProducts] = useState(initialProducts);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [category, setCategory] = useState('all');
  const [stock, setStock] = useState<StockFilter>('all');
  const [sort, setSort] = useState<SortBy>('updated-desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [notice, setNotice] = useState('Ready');
  const [busy, setBusy] = useState(false);
  const [transferText, setTransferText] = useState('');

  const categories = useMemo(() => Array.from(new Set(products.flatMap((product) => product.categoryIds))).sort(), [products]);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const searched = products.filter((product) => {
      if (status !== 'all' && product.status !== status) return false;
      if (category !== 'all' && !product.categoryIds.includes(category)) return false;
      if (stock !== 'all' && inventoryState(product) !== stock) return false;
      if (!query) return true;
      return [
        product.title,
        product.slug,
        product.sku,
        product.description,
        ...product.categoryIds,
        ...product.tags,
        ...product.variants.map((variant) => `${variant.title} ${variant.sku}`),
      ].some((value) => value.toLowerCase().includes(query));
    });
    const sorted = [...searched];
    if (sort === 'title-asc') return sorted.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'price-asc') return sorted.sort((a, b) => a.priceCents - b.priceCents || a.title.localeCompare(b.title));
    if (sort === 'price-desc') return sorted.sort((a, b) => b.priceCents - a.priceCents || a.title.localeCompare(b.title));
    return sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [category, products, search, sort, status, stock]);

  const counts = useMemo(() => ({
    total: products.length,
    active: products.filter((product) => product.status === 'active').length,
    draft: products.filter((product) => product.status === 'draft').length,
    archived: products.filter((product) => product.status === 'archived').length,
    lowStock: products.filter((product) => inventoryState(product) === 'low-stock').length,
    outOfStock: products.filter((product) => inventoryState(product) === 'out-of-stock').length,
  }), [products]);

  async function refresh() {
    const response = await fetch(`/api/builder/commerce/products?locale=${locale}&scope=all&status=all&sort=updated-desc`, {
      cache: 'no-store',
    });
    const payload = await response.json() as { ok?: boolean; products?: CommerceProduct[] };
    if (payload.ok && Array.isArray(payload.products)) setProducts(payload.products);
  }

  async function saveDraft() {
    setBusy(true);
    setNotice('Saving product...');
    try {
      const response = await fetch(
        draft.productId
          ? `/api/builder/commerce/products/${encodeURIComponent(draft.productId)}?locale=${encodeURIComponent(locale)}`
          : `/api/builder/commerce/products?locale=${encodeURIComponent(locale)}`,
        {
          method: draft.productId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadFromDraft(locale, draft)),
        },
      );
      const payload = await response.json().catch(() => ({})) as { ok?: boolean; product?: CommerceProduct; error?: string; message?: string };
      if (!response.ok || !payload.ok || !payload.product) {
        setNotice(payload.message ?? payload.error ?? 'Product save failed');
        return;
      }
      setDraft(productToDraft(payload.product));
      await refresh();
      setNotice('Product saved');
    } finally {
      setBusy(false);
    }
  }

  async function runProductAction(productId: string, action: 'duplicate' | 'archive') {
    setBusy(true);
    setNotice(`${action} pending`);
    try {
      const response = await fetch(`/api/builder/commerce/products/${encodeURIComponent(productId)}?locale=${encodeURIComponent(locale)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const payload = await response.json().catch(() => ({})) as { ok?: boolean; product?: CommerceProduct; error?: string };
      if (!response.ok || !payload.ok) {
        setNotice(payload.error ?? `${action} failed`);
        return;
      }
      await refresh();
      setNotice(action === 'duplicate' ? 'Copy created as draft' : 'Product archived');
    } finally {
      setBusy(false);
    }
  }

  async function applyBulkStatus(nextStatus: CommerceProductStatus) {
    if (selectedIds.length === 0) return;
    setBusy(true);
    setNotice('Bulk update pending');
    try {
      const response = await fetch(`/api/builder/commerce/products?locale=${encodeURIComponent(locale)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: selectedIds, status: nextStatus }),
      });
      const payload = await response.json().catch(() => ({})) as { ok?: boolean; updated?: number; error?: string };
      if (!response.ok || !payload.ok) {
        setNotice(payload.error ?? 'Bulk update failed');
        return;
      }
      setSelectedIds([]);
      await refresh();
      setNotice(`${payload.updated ?? 0} products updated`);
    } finally {
      setBusy(false);
    }
  }

  async function importCsv() {
    const rows = parseImportCsv(locale, transferText);
    if (rows.length === 0) {
      setNotice('No import rows found');
      return;
    }
    setBusy(true);
    setNotice('Import pending');
    let created = 0;
    let failed = 0;
    try {
      for (const row of rows) {
        const response = await fetch(`/api/builder/commerce/products?locale=${encodeURIComponent(locale)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(row),
        });
        if (response.ok) created += 1;
        else failed += 1;
      }
      await refresh();
      setNotice(`Imported ${created}; skipped ${failed}`);
    } finally {
      setBusy(false);
    }
  }

  function toggleSelected(productId: string, checked: boolean) {
    setSelectedIds((current) => (
      checked ? Array.from(new Set([...current, productId])) : current.filter((id) => id !== productId)
    ));
  }

  function updateOption(index: number, patch: Partial<OptionDraft>) {
    setDraft((current) => ({
      ...current,
      options: current.options.map((option, optionIndex) => (optionIndex === index ? { ...option, ...patch } : option)),
    }));
  }

  function addOption() {
    setDraft((current) => ({
      ...current,
      options: [
        ...current.options,
        { optionId: '', name: '', values: '' },
      ],
    }));
  }

  function removeOption(index: number) {
    setDraft((current) => ({
      ...current,
      options: current.options.filter((_, optionIndex) => optionIndex !== index),
    }));
  }

  function updateVariant(index: number, patch: Partial<VariantDraft>) {
    setDraft((current) => ({
      ...current,
      variants: current.variants.map((variant, variantIndex) => (variantIndex === index ? { ...variant, ...patch } : variant)),
    }));
  }

  function addVariant() {
    setDraft((current) => ({
      ...current,
      variants: [...current.variants, emptyVariantDraft(current.variants.length)],
    }));
  }

  function removeVariant(index: number) {
    setDraft((current) => ({
      ...current,
      variants: current.variants.length > 1
        ? current.variants.filter((_, variantIndex) => variantIndex !== index)
        : [emptyVariantDraft()],
    }));
  }

  function generateVariantsFromOptions() {
    const options = optionsFromDraft(draft);
    if (options.length === 0) {
      setNotice('Add options before generating variants');
      return;
    }

    const combinations = options.reduce<Array<Array<{ name: string; value: string }>>>((acc, option) => {
      const next = option.values.map((value) => ({ name: option.name, value }));
      if (acc.length === 0) return next.map((item) => [item]);
      return acc.flatMap((items) => next.map((item) => [...items, item]));
    }, []);
    const variants = combinations.slice(0, 120).map((items, index) => ({
      ...emptyVariantDraft(index),
      title: items.map((item) => item.value).join(' / '),
      sku: `${draft.sku || 'SKU'}-${index + 1}`,
      optionValues: items.map((item) => `${item.name}=${item.value}`).join(', '),
      price: draft.price,
      quantity: draft.quantity,
      lowStockThreshold: draft.lowStockThreshold,
      allowBackorder: draft.allowBackorder,
    }));

    setDraft((current) => ({ ...current, variants }));
    setNotice(`Generated ${variants.length} variants`);
  }

  return (
    <main className={styles.page} data-commerce-products-admin>
      <header className={styles.header}>
        <div>
          <span>{siteTitle}</span>
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
        </div>
        <div className={styles.headerActions}>
          <Link href={`/${locale}/admin-builder/commerce/orders`}>{copy.orders}</Link>
          <Link href={`/${locale}/admin-builder/commerce/payments`}>{copy.payments}</Link>
          <Link href={`/${locale}/admin-builder/commerce/currency`}>{copy.currency}</Link>
          <Link href={`/${locale}/admin-builder/commerce/tax`}>{copy.taxRules}</Link>
          <Link href={`/${locale}/admin-builder/commerce/shipping`}>{copy.shipping}</Link>
          <Link href={`/${locale}/admin-builder/commerce/notifications`}>{copy.notifications}</Link>
          <Link href={`/${locale}/admin-builder/commerce/webhooks`}>{copy.webhooks}</Link>
          <button type="button" onClick={() => setDraft(emptyDraft)} data-commerce-add-product>{copy.addProduct}</button>
          <button type="button" onClick={() => { const csv = productCsv(filtered); setTransferText(csv); downloadText('products.csv', csv); }} data-commerce-product-export="header">{copy.exportCsv}</button>
        </div>
      </header>

      <section className={styles.kpis} aria-label={copy.productStats}>
        {Object.entries(counts).map(([key, value]) => (
          <article key={key} data-commerce-products-kpi={key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}>
            <strong>{value}</strong>
            <span>{key.replace(/[A-Z]/g, (match) => ` ${match.toLowerCase()}`)}</span>
          </article>
        ))}
      </section>

      <section className={styles.toolbar}>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={copy.searchPlaceholder}
          data-commerce-products-search
        />
        <select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)} data-commerce-products-status-filter>
          <option value="all">{copy.allStatuses}</option>
          <option value="active">{copy.active}</option>
          <option value="draft">{copy.draft}</option>
          <option value="archived">{copy.archived}</option>
        </select>
        <select value={category} onChange={(event) => setCategory(event.target.value)} data-commerce-products-category-filter>
          <option value="all">{copy.allCategories}</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={stock} onChange={(event) => setStock(event.target.value as StockFilter)} data-commerce-products-stock-filter>
          <option value="all">{copy.allStock}</option>
          <option value="in-stock">{copy.inStock}</option>
          <option value="low-stock">{copy.lowStockFilter}</option>
          <option value="out-of-stock">{copy.outOfStock}</option>
          <option value="backorder">{copy.backorder}</option>
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value as SortBy)} data-commerce-products-sort>
          <option value="updated-desc">{copy.recentlyUpdated}</option>
          <option value="title-asc">{copy.titleSort}</option>
          <option value="price-asc">{copy.priceLowHigh}</option>
          <option value="price-desc">{copy.priceHighLow}</option>
        </select>
      </section>

      {selectedIds.length > 0 ? (
        <section className={styles.bulkBar} data-commerce-products-bulk-bar>
          <strong>{copy.selected(selectedIds.length)}</strong>
          <button type="button" disabled={busy} onClick={() => void applyBulkStatus('active')}>{copy.setActive}</button>
          <button type="button" disabled={busy} onClick={() => void applyBulkStatus('draft')}>{copy.setDraft}</button>
          <button type="button" disabled={busy} onClick={() => void applyBulkStatus('archived')}>{copy.archive}</button>
          <button type="button" onClick={() => setSelectedIds([])}>{copy.clear}</button>
        </section>
      ) : null}

      <section className={styles.shell}>
        <form className={styles.editor} data-commerce-product-editor onSubmit={(event) => { event.preventDefault(); void saveDraft(); }}>
          <div className={styles.panelHead}>
            <h2>{draft.productId ? copy.editProduct : copy.addProductHeading}</h2>
            <button type="button" onClick={() => setDraft(emptyDraft)}>{copy.reset}</button>
          </div>
          <label><span>{copy.titleLabel}</span><input required value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} data-commerce-product-title /></label>
          <label><span>{copy.slug}</span><input value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} placeholder={copy.slugPlaceholder} /></label>
          <label><span>{copy.description}</span><textarea required rows={3} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} data-commerce-product-description /></label>
          <label><span>{copy.body}</span><textarea rows={4} value={draft.body} onChange={(event) => setDraft({ ...draft, body: event.target.value })} /></label>
          <div className={styles.grid2}>
            <label><span>{copy.status}</span><select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as CommerceProductStatus })} data-commerce-product-status-input><option value="draft">{copy.draft}</option><option value="active">{copy.active}</option><option value="archived">{copy.archived}</option></select></label>
            <label><span>{copy.sku}</span><input required value={draft.sku} onChange={(event) => setDraft({ ...draft, sku: event.target.value })} data-commerce-product-sku /></label>
            <label><span>{copy.price}</span><input type="number" min="0" step="0.01" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} data-commerce-product-price /></label>
            <label><span>{copy.compareAt}</span><input type="number" min="0" step="0.01" value={draft.compareAtPrice} onChange={(event) => setDraft({ ...draft, compareAtPrice: event.target.value })} /></label>
            <label><span>{copy.currency}</span><select value={draft.currency} onChange={(event) => setDraft({ ...draft, currency: event.target.value as CommerceCurrency })}><option value="TWD">TWD</option><option value="KRW">KRW</option><option value="USD">USD</option></select></label>
            <label><span>{copy.quantity}</span><input type="number" min="0" value={draft.quantity} onChange={(event) => setDraft({ ...draft, quantity: event.target.value })} data-commerce-product-quantity /></label>
            <label><span>{copy.lowStock}</span><input type="number" min="0" value={draft.lowStockThreshold} onChange={(event) => setDraft({ ...draft, lowStockThreshold: event.target.value })} data-commerce-product-low-stock /></label>
            <label><span>{copy.categories}</span><input value={draft.categoryIds} onChange={(event) => setDraft({ ...draft, categoryIds: event.target.value })} data-commerce-product-categories /></label>
          </div>
          <label><span>{copy.tags}</span><input value={draft.tags} onChange={(event) => setDraft({ ...draft, tags: event.target.value })} /></label>
          <label><span>{copy.imageUrl}</span><input value={draft.mediaUrl} onChange={(event) => setDraft({ ...draft, mediaUrl: event.target.value })} /></label>
          <label><span>{copy.imageAlt}</span><input value={draft.mediaAlt} onChange={(event) => setDraft({ ...draft, mediaAlt: event.target.value })} /></label>
          <section className={styles.variantSection} data-commerce-product-options>
            <div className={styles.panelHead}>
              <h3>{copy.options}</h3>
              <div>
                <button type="button" onClick={addOption} data-commerce-product-option-add>{copy.addOption}</button>
                <button type="button" onClick={generateVariantsFromOptions} data-commerce-product-variants-generate>{copy.generateVariants}</button>
              </div>
            </div>
            {draft.options.length === 0 ? (
              <p className={styles.muted}>{copy.addOptionsHint}</p>
            ) : draft.options.map((option, index) => (
              <div key={`${option.optionId}-${index}`} className={styles.optionRow} data-commerce-product-option-row>
                <label>
                  <span>{copy.optionName}</span>
                  <input
                    value={option.name}
                    onChange={(event) => updateOption(index, { name: event.target.value })}
                    placeholder={copy.optionNamePlaceholder}
                    data-commerce-product-option-name
                  />
                </label>
                <label>
                  <span>{copy.optionValues}</span>
                  <input
                    value={option.values}
                    onChange={(event) => updateOption(index, { values: event.target.value })}
                    placeholder={copy.optionValuesPlaceholder}
                    data-commerce-product-option-values
                  />
                </label>
                <button type="button" onClick={() => removeOption(index)} data-commerce-product-option-remove>{copy.clear}</button>
              </div>
            ))}
          </section>

          <section className={styles.variantSection} data-commerce-product-variants>
            <div className={styles.panelHead}>
              <h3>{copy.variants}</h3>
              <button type="button" onClick={addVariant} data-commerce-product-variant-add>{copy.addVariant}</button>
            </div>
            {draft.variants.map((variant, index) => {
              const availability = variantAvailability(variant, draft.trackInventory);
              return (
                <article
                  key={`${variant.variantId}-${index}`}
                  className={styles.variantRow}
                  data-commerce-product-variant-row={index}
                  data-commerce-product-variant-availability={availability}
                >
                  <div className={styles.variantHead}>
                    <strong>{variant.title || copy.variantLabel(index)}</strong>
                    <span>{availability}</span>
                  </div>
                  <div className={styles.grid2}>
                    <label><span>{copy.titleLabel}</span><input value={variant.title} onChange={(event) => updateVariant(index, { title: event.target.value })} data-commerce-product-variant-title /></label>
                    <label><span>{copy.sku}</span><input value={variant.sku} onChange={(event) => updateVariant(index, { sku: event.target.value })} data-commerce-product-variant-sku /></label>
                    <label><span>{locale === 'ko' ? '옵션 값' : locale === 'zh-hant' ? '選項值' : 'Option values'}</span><input value={variant.optionValues} onChange={(event) => updateVariant(index, { optionValues: event.target.value })} placeholder={copy.variantOptionValuesPlaceholder} data-commerce-product-variant-option-values /></label>
                    <label><span>{copy.status}</span><select value={variant.status} onChange={(event) => updateVariant(index, { status: event.target.value as CommerceProductVariantStatus })} data-commerce-product-variant-status><option value="active">{copy.active}</option><option value="disabled">{locale === 'ko' ? '비활성' : locale === 'zh-hant' ? '已停用' : 'Disabled'}</option></select></label>
                    <label><span>{copy.price}</span><input type="number" min="0" step="0.01" value={variant.price} onChange={(event) => updateVariant(index, { price: event.target.value })} data-commerce-product-variant-price /></label>
                    <label><span>{copy.compareAt}</span><input type="number" min="0" step="0.01" value={variant.compareAtPrice} onChange={(event) => updateVariant(index, { compareAtPrice: event.target.value })} /></label>
                    <label><span>{copy.quantity}</span><input type="number" min="0" value={variant.quantity} onChange={(event) => updateVariant(index, { quantity: event.target.value })} data-commerce-product-variant-quantity /></label>
                    <label><span>{copy.lowStock}</span><input type="number" min="0" value={variant.lowStockThreshold} onChange={(event) => updateVariant(index, { lowStockThreshold: event.target.value })} data-commerce-product-variant-low-stock /></label>
                    <label><span>{locale === 'ko' ? '미디어 ID' : locale === 'zh-hant' ? '媒體 ID' : 'Media ID'}</span><input value={variant.mediaId} onChange={(event) => updateVariant(index, { mediaId: event.target.value })} data-commerce-product-variant-media-id /></label>
                    <label><span>{copy.imageUrl}</span><input value={variant.mediaUrl} onChange={(event) => updateVariant(index, { mediaUrl: event.target.value })} data-commerce-product-variant-media-url /></label>
                  </div>
                  <div className={styles.variantActions}>
                    <label><input type="checkbox" checked={variant.allowBackorder} onChange={(event) => updateVariant(index, { allowBackorder: event.target.checked })} data-commerce-product-variant-backorder />{copy.backorder}</label>
                    {variant.mediaUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element -- This live editor preview must render arbitrary user-entered remote/blob/data URLs without optimizer allowlisting. */}
                        <img src={variant.mediaUrl} alt="" data-commerce-product-variant-image />
                      </>
                    ) : null}
                    <button type="button" onClick={() => removeVariant(index)} data-commerce-product-variant-remove>{copy.removeVariant}</button>
                  </div>
                </article>
              );
            })}
          </section>
          <div className={styles.grid2}>
            <label><span>{copy.seoTitle}</span><input value={draft.seoTitle} onChange={(event) => setDraft({ ...draft, seoTitle: event.target.value })} /></label>
            <label><span>{copy.seoDescription}</span><input value={draft.seoDescription} onChange={(event) => setDraft({ ...draft, seoDescription: event.target.value })} /></label>
          </div>
          <div className={styles.checks}>
            <label><input type="checkbox" checked={draft.trackInventory} onChange={(event) => setDraft({ ...draft, trackInventory: event.target.checked })} data-commerce-product-track-inventory />{copy.trackInventory}</label>
            <label><input type="checkbox" checked={draft.allowBackorder} onChange={(event) => setDraft({ ...draft, allowBackorder: event.target.checked })} data-commerce-product-allow-backorder />{copy.allowBackorder}</label>
          </div>
          <button type="submit" disabled={busy} data-commerce-product-save>{draft.productId ? (locale === 'ko' ? '제품 저장' : locale === 'zh-hant' ? '儲存產品' : 'Save product') : (locale === 'ko' ? '제품 생성' : locale === 'zh-hant' ? '建立產品' : 'Create product')}</button>
          <p role="status" className={styles.notice}>{notice}</p>
        </form>

        <section className={styles.list} aria-label={copy.productsList}>
          {filtered.length === 0 ? (
            <article className={styles.empty} data-commerce-products-empty>
              <strong>{copy.noProducts}</strong>
              <span>{copy.noProductsHint}</span>
              <button type="button" onClick={() => setDraft(emptyDraft)} data-commerce-add-product>{copy.addProduct}</button>
            </article>
          ) : (
            filtered.map((product) => {
              const state = inventoryState(product);
              const selected = selectedIds.includes(product.productId);
              return (
                <article
                  key={product.productId}
                  className={styles.row}
                  data-commerce-product-row={product.productId}
                  data-commerce-product-card={product.productId}
                  data-commerce-product-status={product.status}
                  data-commerce-product-inventory-state={state}
                >
                  <label className={styles.selectBox}>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={(event) => toggleSelected(product.productId, event.target.checked)}
                      data-commerce-product-select={product.productId}
                    />
                  </label>
                  {product.media[0]?.url ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element -- Product media is builder-managed and can reference arbitrary remote/blob/data preview URLs. */}
                      <img src={product.media[0].url} alt="" />
                    </>
                  ) : <div className={styles.thumbFallback} />}
                  <div className={styles.identity}>
                    <strong>{product.title}</strong>
                    <span>/{product.slug}</span>
                    <small>{product.categoryIds.join(', ') || (locale === 'ko' ? '분류 없음' : locale === 'zh-hant' ? '未分類' : 'Uncategorized')}</small>
                  </div>
                  <div className={styles.meta}>
                    <span>{product.sku}</span>
                    <strong>{formatPrice(product)}</strong>
                  </div>
                  <div className={styles.chips}>
                    <span>{product.status}</span>
                    <span>{state}</span>
                    <span>{product.variants.length} {locale === 'ko' ? '변형' : locale === 'zh-hant' ? '變體' : 'variants'}</span>
                  </div>
                  <div className={styles.actions}>
                    <button type="button" onClick={() => setDraft(productToDraft(product))} data-commerce-product-action="edit">{copy.edit}</button>
                    <button type="button" disabled={busy} onClick={() => void runProductAction(product.productId, 'duplicate')} data-commerce-product-action="duplicate">{copy.duplicate}</button>
                    <button type="button" disabled={busy} onClick={() => void runProductAction(product.productId, 'archive')} data-commerce-product-action="archive">{copy.archive}</button>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </section>

      <section className={styles.transfer}>
        <div className={styles.panelHead}>
          <h2>{copy.importExport}</h2>
          <div>
            <button type="button" onClick={() => { const csv = productCsv(filtered); setTransferText(csv); downloadText('products.csv', csv); }} data-commerce-product-export="filtered">{copy.exportFiltered}</button>
            <button type="button" disabled={busy} onClick={() => void importCsv()} data-commerce-product-import>{copy.importCsvButton}</button>
          </div>
        </div>
          <textarea
            value={transferText}
            onChange={(event) => setTransferText(event.target.value)}
            rows={6}
            placeholder={locale === 'ko' ? '제목,SKU,가격,통화,상태,수량,카테고리,태그,설명' : locale === 'zh-hant' ? '標題,SKU,價格,幣別,狀態,數量,類別,標籤,描述' : 'title,sku,price,currency,status,quantity,categories,tags,description'}
            data-commerce-product-import-text
          />
      </section>
    </main>
  );
}
