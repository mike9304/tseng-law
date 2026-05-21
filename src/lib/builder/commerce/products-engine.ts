/**
 * Native commerce product engine.
 *
 * F53 covers the product schema foundation for Wix-style Stores: title,
 * description/body, media, price, inventory, SKU, SEO, variants, and status.
 * Later F54-F66 milestones build manager UI, PDP, cart, checkout, and orders
 * on this shared source of truth.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { get, list, put } from '@vercel/blob';
import type { Locale } from '@/lib/locales';
import {
  DEFAULT_COMMERCE_CURRENCY,
  slugifyProductCategory,
  slugifyProductTitle,
  type CommerceCurrency,
  type CommerceInventory,
  type CommerceProduct,
  type CommerceProductCategory,
  type CommerceProductMedia,
  type CommerceProductOption,
  type CommerceProductSortBy,
  type CommerceProductStatus,
  type CommerceProductVariant,
} from '@/lib/builder/commerce/products-shared';

export {
  DEFAULT_COMMERCE_CURRENCY,
  slugifyProductCategory,
  slugifyProductTitle,
} from '@/lib/builder/commerce/products-shared';
export type {
  CommerceCurrency,
  CommerceInventory,
  CommerceProduct,
  CommerceProductCategory,
  CommerceProductCategoryStatus,
  CommerceProductMedia,
  CommerceProductMediaType,
  CommerceProductOption,
  CommerceProductSeo,
  CommerceProductSortBy,
  CommerceProductStatus,
  CommerceProductVariant,
  CommerceProductVariantStatus,
} from '@/lib/builder/commerce/products-shared';

type CommerceBackend = 'blob' | 'file';
type StoredCommerceProduct = CommerceProduct & { deleted?: boolean };

const PRODUCTS_PREFIX = 'builder-commerce/products/';
const DEFAULT_COMMERCE_ROOT = path.join(process.cwd(), 'runtime-data', 'builder-commerce');

const SEEDED_PRODUCTS: CommerceProduct[] = [
  {
    productId: 'product-taiwan-startup-guide-ko',
    locale: 'ko',
    slug: 'taiwan-startup-guide',
    title: '대만 창업 준비 가이드',
    description: '대만 법인 설립 전 확인해야 할 회사 형태, 세무, 노무 체크리스트입니다.',
    body: '전자문서 형태의 창업 준비 가이드 예시 상품입니다. 실제 결제/배송은 F60 이후 checkout milestone에서 연결합니다.',
    status: 'active',
    sku: 'TW-STARTUP-GUIDE-KO',
    priceCents: 390000,
    currency: 'TWD',
    inventory: {
      trackInventory: false,
      quantity: 0,
      lowStockThreshold: 0,
      allowBackorder: true,
    },
    media: [
      {
        mediaId: 'startup-guide-cover',
        type: 'image',
        url: '/images/001-taiwan-company-establishment-basics/featured-01.jpg',
        alt: '대만 창업 준비 가이드 표지',
        sortOrder: 1,
      },
    ],
    options: [
      {
        optionId: 'format',
        name: 'Format',
        values: ['PDF', 'Consultation bundle'],
      },
    ],
    variants: [
      {
        variantId: 'startup-guide-pdf',
        title: 'PDF',
        sku: 'TW-STARTUP-GUIDE-KO-PDF',
        optionValues: { format: 'PDF' },
        priceCents: 390000,
        inventory: {
          trackInventory: false,
          quantity: 0,
          lowStockThreshold: 0,
          allowBackorder: true,
        },
        mediaId: 'startup-guide-cover',
        status: 'active',
      },
      {
        variantId: 'startup-guide-consultation',
        title: 'Consultation bundle',
        sku: 'TW-STARTUP-GUIDE-KO-CONSULT',
        optionValues: { format: 'Consultation bundle' },
        priceCents: 990000,
        inventory: {
          trackInventory: true,
          quantity: 8,
          lowStockThreshold: 2,
          allowBackorder: false,
        },
        mediaId: 'startup-guide-cover',
        status: 'active',
      },
    ],
    categoryIds: ['digital-guides'],
    tags: ['대만창업', '회사설립', '가이드'],
    seo: {
      title: '대만 창업 준비 가이드',
      description: '대만 법인 설립 전 확인할 창업 체크리스트 상품입니다.',
    },
    createdAt: '2026-05-20T00:00:00.000Z',
    updatedAt: '2026-05-20T00:00:00.000Z',
  },
];

const SEEDED_CATEGORIES: CommerceProductCategory[] = [
  {
    categoryId: 'digital-guides',
    locale: 'ko',
    slug: 'digital-guides',
    name: '디지털 가이드',
    description: '대만 진출과 법률 준비를 빠르게 확인할 수 있는 다운로드형 자료입니다.',
    status: 'active',
    sortOrder: 10,
    productCount: 0,
    seo: {
      title: '디지털 가이드',
      description: '대만 법률 실무를 위한 디지털 가이드 상품 모음입니다.',
    },
  },
  {
    categoryId: 'consultation',
    locale: 'ko',
    slug: 'consultation',
    name: '상담 패키지',
    description: '상담권과 검토 패키지 상품을 모아둔 컬렉션입니다.',
    status: 'active',
    sortOrder: 20,
    productCount: 0,
    seo: {
      title: '상담 패키지',
      description: '대만 법률 상담 패키지와 번들 상품 모음입니다.',
    },
  },
  {
    categoryId: 'imports',
    locale: 'ko',
    slug: 'imports',
    name: '가져온 상품',
    description: 'CSV 가져오기로 등록된 상품 컬렉션입니다.',
    status: 'active',
    sortOrder: 90,
    productCount: 0,
    seo: {},
  },
];

function getBackend(): CommerceBackend {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return 'file';
  if (process.env.CONSULTATION_LOG_BACKEND === 'local') return 'file';
  if (process.env.BUILDER_COMMERCE_BACKEND === 'local') return 'file';
  if (process.env.NODE_ENV !== 'production' && process.env.BUILDER_USE_BLOB_IN_DEV !== '1') return 'file';
  return 'blob';
}

function commerceRoot(): string {
  return process.env.BUILDER_COMMERCE_ROOT?.trim() || DEFAULT_COMMERCE_ROOT;
}

function productBlobPath(productId: string): string {
  return `${PRODUCTS_PREFIX}${productId}.json`;
}

function productFilePath(productId: string): string {
  return path.join(commerceRoot(), 'products', `${productId}.json`);
}

function nowIso(): string {
  return new Date().toISOString();
}

function safeTrim(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function normalizeLocale(value: unknown): Locale {
  return value === 'zh-hant' || value === 'en' ? value : 'ko';
}

function normalizeCurrency(value: unknown): CommerceCurrency {
  return value === 'KRW' || value === 'USD' || value === 'TWD' ? value : DEFAULT_COMMERCE_CURRENCY;
}

function categoryNameFromId(categoryId: string): string {
  return categoryId
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part ? `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}` : part)
    .join(' ') || 'Collection';
}

function normalizeNonNegativeInteger(value: unknown, fallback = 0): number {
  return Number.isFinite(value) ? Math.max(0, Math.round(Number(value))) : fallback;
}

async function writeJson(blobPath: string, filePath: string, data: unknown): Promise<void> {
  const body = JSON.stringify(data, null, 2);
  if (getBackend() === 'blob') {
    await put(blobPath, body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, body, 'utf8');
}

async function readJson<T>(blobPath: string, filePath: string): Promise<T | null> {
  try {
    if (getBackend() === 'blob') {
      const result = await get(blobPath, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        return JSON.parse(await new Response(result.stream).text()) as T;
      }
      return null;
    }

    return JSON.parse(await fs.readFile(filePath, 'utf8')) as T;
  } catch {
    return null;
  }
}

async function listProductJson(): Promise<StoredCommerceProduct[]> {
  if (getBackend() === 'blob') {
    const result = await list({ prefix: PRODUCTS_PREFIX });
    const values: StoredCommerceProduct[] = [];
    for (const blob of result.blobs) {
      const productId = path.basename(blob.pathname, '.json');
      const parsed = await readJson<StoredCommerceProduct>(blob.pathname, productFilePath(productId));
      if (parsed) values.push(parsed);
    }
    return values;
  }

  const dir = path.join(commerceRoot(), 'products');
  const files = await fs.readdir(dir).catch(() => []);
  const values: StoredCommerceProduct[] = [];
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const raw = await fs.readFile(path.join(dir, file), 'utf8').catch(() => '');
    if (!raw) continue;
    try {
      values.push(JSON.parse(raw) as StoredCommerceProduct);
    } catch {
      // Skip malformed local records.
    }
  }
  return values;
}

export function makeCommerceProductId(): string {
  return `prd-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function makeVariantId(index: number): string {
  return `variant-${index + 1}`;
}

function normalizeInventory(input: Partial<CommerceInventory> | undefined): CommerceInventory {
  return {
    trackInventory: Boolean(input?.trackInventory),
    quantity: normalizeNonNegativeInteger(input?.quantity),
    lowStockThreshold: normalizeNonNegativeInteger(input?.lowStockThreshold),
    allowBackorder: Boolean(input?.allowBackorder),
  };
}

function normalizeProductMedia(input: unknown): CommerceProductMedia[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item, index) => {
      if (typeof item === 'string') {
        const url = item.trim().slice(0, 2000);
        if (!url) return null;
        return {
          mediaId: `media-${index + 1}`,
          type: 'image',
          url,
          alt: 'Product image',
          sortOrder: index + 1,
        } satisfies CommerceProductMedia;
      }
      if (!item || typeof item !== 'object') return null;
      const source = item as Partial<CommerceProductMedia>;
      const url = safeTrim(source.url, 2000);
      if (!url) return null;
      return {
        mediaId: safeTrim(source.mediaId, 120) || `media-${index + 1}`,
        type: source.type === 'video' ? 'video' : 'image',
        url,
        alt: safeTrim(source.alt, 240) || 'Product image',
        ...(safeTrim(source.caption, 240) ? { caption: safeTrim(source.caption, 240) } : {}),
        sortOrder: Number.isFinite(source.sortOrder) ? Math.round(source.sortOrder ?? index + 1) : index + 1,
      } satisfies CommerceProductMedia;
    })
    .filter((item): item is CommerceProductMedia => Boolean(item))
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 40);
}

function normalizeOptions(input: unknown): CommerceProductOption[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null;
      const source = item as Partial<CommerceProductOption>;
      const name = safeTrim(source.name, 80);
      const values = Array.isArray(source.values)
        ? Array.from(new Set(source.values.map((value) => safeTrim(value, 80)).filter(Boolean))).slice(0, 30)
        : [];
      if (!name || values.length === 0) return null;
      return {
        optionId: safeTrim(source.optionId, 80) || name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `option-${index + 1}`,
        name,
        values,
      } satisfies CommerceProductOption;
    })
    .filter((item): item is CommerceProductOption => Boolean(item))
    .slice(0, 6);
}

function normalizeVariant(
  input: Partial<CommerceProductVariant>,
  index: number,
  product: Pick<CommerceProduct, 'sku' | 'priceCents' | 'compareAtPriceCents' | 'inventory'>,
): CommerceProductVariant {
  const optionValues = input.optionValues && typeof input.optionValues === 'object'
    ? Object.fromEntries(Object.entries(input.optionValues).map(([key, value]) => [safeTrim(key, 80), safeTrim(value, 80)]).filter(([key, value]) => key && value))
    : {};
  const title = safeTrim(input.title, 180) || Object.values(optionValues).join(' / ') || 'Default';
  const priceCents = normalizeNonNegativeInteger(input.priceCents, product.priceCents);
  const compareAtPriceCents = normalizeNonNegativeInteger(input.compareAtPriceCents);

  return {
    variantId: safeTrim(input.variantId, 120) || makeVariantId(index),
    title,
    sku: safeTrim(input.sku, 120) || `${product.sku}-${index + 1}`,
    optionValues,
    priceCents,
    ...(compareAtPriceCents > priceCents ? { compareAtPriceCents } : {}),
    inventory: normalizeInventory(input.inventory ?? product.inventory),
    ...(safeTrim(input.mediaId, 120) ? { mediaId: safeTrim(input.mediaId, 120) } : {}),
    status: input.status === 'disabled' ? 'disabled' : 'active',
  };
}

function normalizeVariants(
  input: unknown,
  product: Pick<CommerceProduct, 'sku' | 'priceCents' | 'compareAtPriceCents' | 'inventory'>,
): CommerceProductVariant[] {
  const variants = Array.isArray(input)
    ? input.map((item, index) => (
      item && typeof item === 'object'
        ? normalizeVariant(item as Partial<CommerceProductVariant>, index, product)
        : null
    )).filter((item): item is CommerceProductVariant => Boolean(item)).slice(0, 300)
    : [];

  if (variants.length > 0) return variants;
  return [normalizeVariant({
    variantId: 'default',
    title: 'Default',
    sku: product.sku,
    priceCents: product.priceCents,
    compareAtPriceCents: product.compareAtPriceCents,
    inventory: product.inventory,
  }, 0, product)];
}

export function normalizeCommerceProduct(input: Partial<CommerceProduct>): CommerceProduct {
  const at = nowIso();
  const title = safeTrim(input.title, 180) || 'Untitled product';
  const productId = safeTrim(input.productId, 120) || makeCommerceProductId();
  const sku = safeTrim(input.sku, 120) || productId.toUpperCase();
  const priceCents = normalizeNonNegativeInteger(input.priceCents);
  const compareAtPriceCents = normalizeNonNegativeInteger(input.compareAtPriceCents);
  const inventory = normalizeInventory(input.inventory);
  const media = normalizeProductMedia(input.media);
  const baseProduct = {
    sku,
    priceCents,
    ...(compareAtPriceCents > priceCents ? { compareAtPriceCents } : {}),
    inventory,
  };

  return {
    productId,
    locale: normalizeLocale(input.locale),
    slug: safeTrim(input.slug, 120) || slugifyProductTitle(title),
    title,
    description: safeTrim(input.description, 2000),
    body: safeTrim(input.body, 8000) || safeTrim(input.description, 2000),
    status: input.status === 'active' || input.status === 'archived' ? input.status : 'draft',
    sku,
    priceCents,
    ...(compareAtPriceCents > priceCents ? { compareAtPriceCents } : {}),
    currency: normalizeCurrency(input.currency),
    inventory,
    media,
    options: normalizeOptions(input.options),
    variants: normalizeVariants(input.variants, baseProduct),
    categoryIds: Array.isArray(input.categoryIds)
      ? Array.from(new Set(input.categoryIds.map((categoryId) => safeTrim(categoryId, 120)).filter(Boolean))).slice(0, 30)
      : [],
    tags: Array.isArray(input.tags)
      ? Array.from(new Set(input.tags.map((tag) => safeTrim(tag, 80)).filter(Boolean))).slice(0, 30)
      : [],
    seo: {
      ...(safeTrim(input.seo?.title, 180) ? { title: safeTrim(input.seo?.title, 180) } : {}),
      ...(safeTrim(input.seo?.description, 320) ? { description: safeTrim(input.seo?.description, 320) } : {}),
    },
    createdAt: input.createdAt && Number.isFinite(Date.parse(input.createdAt)) ? input.createdAt : at,
    updatedAt: input.updatedAt && Number.isFinite(Date.parse(input.updatedAt)) ? input.updatedAt : at,
  };
}

function productSkus(product: CommerceProduct): Set<string> {
  return new Set([
    product.sku,
    ...product.variants.map((variant) => variant.sku),
  ].map((sku) => sku.trim()).filter(Boolean));
}

function findSkuConflict(candidate: CommerceProduct, products: CommerceProduct[]): string | null {
  const candidateSkus = productSkus(candidate);
  for (const product of products) {
    if (product.productId === candidate.productId) continue;
    const existingSkus = productSkus(product);
    for (const sku of candidateSkus) {
      if (existingSkus.has(sku)) return sku;
    }
  }
  return null;
}

async function assertUniqueProductSkus(product: CommerceProduct): Promise<void> {
  const conflict = findSkuConflict(product, await listProducts());
  if (conflict) {
    throw new Error(`commerce_product_sku_conflict:${conflict}`);
  }
}

export async function saveProduct(product: CommerceProduct): Promise<CommerceProduct> {
  const normalized = normalizeCommerceProduct({ ...product, updatedAt: nowIso() });
  await assertUniqueProductSkus(normalized);
  await writeJson(productBlobPath(normalized.productId), productFilePath(normalized.productId), normalized);
  return normalized;
}

export async function createProduct(input: Partial<CommerceProduct>): Promise<CommerceProduct> {
  const normalized = normalizeCommerceProduct(input);
  await assertUniqueProductSkus(normalized);
  const existing = await findProductBySlug(normalized.locale, normalized.slug);
  const product = existing
    ? { ...normalized, slug: `${normalized.slug}-${normalized.productId.slice(-6)}` }
    : normalized;
  await writeJson(productBlobPath(product.productId), productFilePath(product.productId), product);
  return product;
}

export async function loadProduct(productId: string): Promise<CommerceProduct | null> {
  const parsed = await readJson<StoredCommerceProduct>(productBlobPath(productId), productFilePath(productId));
  if (!parsed || parsed.deleted) return null;
  return normalizeCommerceProduct(parsed);
}

export async function listProducts(): Promise<CommerceProduct[]> {
  const stored = await listProductJson();
  const storedIds = new Set(stored.map((product) => product.productId));
  return [
    ...stored.filter((product) => !product.deleted).map((product) => normalizeCommerceProduct(product)),
    ...SEEDED_PRODUCTS.filter((product) => !storedIds.has(product.productId)),
  ];
}

export async function deleteProduct(productId: string): Promise<void> {
  const existing = await loadProduct(productId);
  await writeJson(productBlobPath(productId), productFilePath(productId), {
    ...(existing ?? { productId }),
    deleted: true,
    updatedAt: nowIso(),
  });
}

export async function archiveProduct(productId: string): Promise<CommerceProduct | null> {
  const product = await loadProduct(productId);
  if (!product) return null;
  return saveProduct({ ...product, status: 'archived' });
}

export async function duplicateProduct(productId: string): Promise<CommerceProduct | null> {
  const product = await loadProduct(productId);
  if (!product) return null;
  const suffix = Date.now().toString(36).slice(-6);
  return createProduct({
    ...product,
    productId: undefined,
    title: `${product.title} Copy`,
    slug: `${product.slug}-copy-${suffix}`,
    status: 'draft',
    sku: `${product.sku}-COPY-${suffix}`,
    variants: product.variants.map((variant) => ({
      ...variant,
      variantId: `${variant.variantId}-copy-${suffix}`,
      sku: `${variant.sku}-COPY-${suffix}`,
    })),
    createdAt: undefined,
    updatedAt: undefined,
  });
}

export async function findProductBySlug(locale: Locale, slug: string): Promise<CommerceProduct | null> {
  return (await listProducts()).find((product) => product.locale === locale && product.slug === slug) ?? null;
}

export async function findProductBySku(sku: string): Promise<CommerceProduct | null> {
  const target = sku.trim();
  if (!target) return null;
  return (await listProducts()).find((product) => productSkus(product).has(target)) ?? null;
}

export function filterProductsByLocale(products: CommerceProduct[], locale: Locale): CommerceProduct[] {
  return products.filter((product) => product.locale === locale);
}

export function filterProductsByStatus(
  products: CommerceProduct[],
  status: CommerceProductStatus | 'all',
): CommerceProduct[] {
  if (status === 'all') return products;
  return products.filter((product) => product.status === status);
}

export function filterProductsByCategory(products: CommerceProduct[], categoryId?: string): CommerceProduct[] {
  if (!categoryId) return products;
  const normalized = slugifyProductCategory(categoryId);
  return products.filter((product) => product.categoryIds.some((id) => id === categoryId || slugifyProductCategory(id) === normalized));
}

export function searchProducts(products: CommerceProduct[], query?: string): CommerceProduct[] {
  const q = query?.trim().toLowerCase();
  if (!q) return products;
  return products.filter((product) => [
    product.title,
    product.description,
    product.body,
    product.sku,
    ...product.categoryIds,
    ...product.tags,
    ...product.variants.map((variant) => `${variant.title} ${variant.sku}`),
  ].some((value) => value.toLowerCase().includes(q)));
}

export function sortProducts(products: CommerceProduct[], sortBy: CommerceProductSortBy): CommerceProduct[] {
  const sorted = [...products];
  if (sortBy === 'title-asc') return sorted.sort((a, b) => a.title.localeCompare(b.title));
  if (sortBy === 'price-asc') return sorted.sort((a, b) => a.priceCents - b.priceCents || a.title.localeCompare(b.title));
  if (sortBy === 'price-desc') return sorted.sort((a, b) => b.priceCents - a.priceCents || a.title.localeCompare(b.title));
  return sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.title.localeCompare(b.title));
}

export function validateProduct(product: Partial<CommerceProduct>): string[] {
  const errors: string[] = [];
  if (!product.title?.trim()) errors.push('상품명을 입력하세요.');
  if (!product.description?.trim()) errors.push('상품 설명을 입력하세요.');
  if (!product.sku?.trim()) errors.push('SKU를 입력하세요.');
  if (!Number.isFinite(product.priceCents) || Number(product.priceCents) < 0) errors.push('상품 가격은 0 이상이어야 합니다.');
  if (product.compareAtPriceCents && product.compareAtPriceCents <= (product.priceCents ?? 0)) {
    errors.push('비교 가격은 판매 가격보다 커야 합니다.');
  }
  if (product.inventory?.quantity !== undefined && product.inventory.quantity < 0) errors.push('재고 수량은 0 이상이어야 합니다.');
  if (product.status === 'active' && !product.slug?.trim()) errors.push('판매 중 상품에는 slug가 필요합니다.');

  const variantSkus = new Set<string>();
  for (const variant of product.variants ?? []) {
    if (!variant.sku?.trim()) errors.push('모든 상품 옵션에는 SKU가 필요합니다.');
    if (variant.sku && variantSkus.has(variant.sku)) errors.push(`중복 옵션 SKU가 있습니다: ${variant.sku}`);
    if (variant.sku) variantSkus.add(variant.sku);
    if (!Number.isFinite(variant.priceCents) || variant.priceCents < 0) errors.push('옵션 가격은 0 이상이어야 합니다.');
    if (variant.inventory?.quantity !== undefined && variant.inventory.quantity < 0) errors.push('옵션 재고 수량은 0 이상이어야 합니다.');
  }

  return Array.from(new Set(errors));
}

export async function listProductCategories(
  locale?: Locale,
  options: { includeHidden?: boolean; products?: CommerceProduct[] } = {},
): Promise<CommerceProductCategory[]> {
  const products = options.products ?? await listProducts();
  const localeProducts = locale ? filterProductsByLocale(products, locale) : products;
  const publicProducts = localeProducts.filter((product) => product.status === 'active');
  const countByCategory = new Map<string, number>();
  for (const product of publicProducts) {
    for (const categoryId of product.categoryIds) {
      const normalized = slugifyProductCategory(categoryId);
      countByCategory.set(normalized, (countByCategory.get(normalized) ?? 0) + 1);
    }
  }

  const categories = new Map<string, CommerceProductCategory>();
  for (const category of SEEDED_CATEGORIES) {
    if (locale && category.locale !== locale) continue;
    const slug = slugifyProductCategory(category.slug || category.categoryId);
    if (!options.includeHidden && category.status === 'hidden' && !countByCategory.has(slug)) continue;
    categories.set(slug, {
      ...category,
      slug,
      productCount: countByCategory.get(slug) ?? 0,
    });
  }

  for (const [slug, productCount] of countByCategory.entries()) {
    if (categories.has(slug)) continue;
    categories.set(slug, {
      categoryId: slug,
      locale: locale ?? 'ko',
      slug,
      name: categoryNameFromId(slug),
      description: `${categoryNameFromId(slug)} product collection.`,
      status: 'active',
      sortOrder: 100,
      productCount,
      seo: {
        title: categoryNameFromId(slug),
        description: `${categoryNameFromId(slug)} products.`,
      },
    });
  }

  return Array.from(categories.values())
    .filter((category) => options.includeHidden || category.status === 'active')
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}

export async function findProductCategoryBySlug(locale: Locale, slug: string): Promise<CommerceProductCategory | null> {
  const normalized = slugifyProductCategory(slug);
  return (await listProductCategories(locale)).find((category) => category.slug === normalized) ?? null;
}

export async function listActiveProductsForCategory(locale: Locale, categorySlug: string): Promise<CommerceProduct[]> {
  const category = await findProductCategoryBySlug(locale, categorySlug);
  if (!category) return [];
  return filterProductsByCategory(
    filterProductsByStatus(filterProductsByLocale(await listProducts(), locale), 'active'),
    category.categoryId,
  );
}
