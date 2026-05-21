import type { Locale } from '@/lib/locales';

export type CommerceProductStatus = 'draft' | 'active' | 'archived';
export type CommerceCurrency = 'TWD' | 'KRW' | 'USD';
export type CommerceProductMediaType = 'image' | 'video';
export type CommerceProductVariantStatus = 'active' | 'disabled';
export type CommerceProductSortBy = 'updated-desc' | 'title-asc' | 'price-asc' | 'price-desc';
export type CommerceAvailabilityState = 'in-stock' | 'low-stock' | 'out-of-stock' | 'backorder' | 'disabled';
export type CommerceProductCategoryStatus = 'active' | 'hidden';

export interface CommerceProductMedia {
  mediaId: string;
  type: CommerceProductMediaType;
  url: string;
  alt: string;
  caption?: string;
  sortOrder: number;
}

export interface CommerceInventory {
  trackInventory: boolean;
  quantity: number;
  lowStockThreshold: number;
  allowBackorder: boolean;
}

export interface CommerceProductOption {
  optionId: string;
  name: string;
  values: string[];
}

export interface CommerceProductVariant {
  variantId: string;
  title: string;
  sku: string;
  optionValues: Record<string, string>;
  priceCents: number;
  compareAtPriceCents?: number;
  inventory: CommerceInventory;
  mediaId?: string;
  status: CommerceProductVariantStatus;
}

export interface CommerceProductSeo {
  title?: string;
  description?: string;
}

export interface CommerceProduct {
  productId: string;
  locale: Locale;
  slug: string;
  title: string;
  description: string;
  body: string;
  status: CommerceProductStatus;
  sku: string;
  priceCents: number;
  compareAtPriceCents?: number;
  currency: CommerceCurrency;
  inventory: CommerceInventory;
  media: CommerceProductMedia[];
  options: CommerceProductOption[];
  variants: CommerceProductVariant[];
  categoryIds: string[];
  tags: string[];
  seo: CommerceProductSeo;
  createdAt: string;
  updatedAt: string;
}

export interface CommerceProductCategory {
  categoryId: string;
  locale: Locale;
  slug: string;
  name: string;
  description: string;
  status: CommerceProductCategoryStatus;
  sortOrder: number;
  productCount: number;
  seo: CommerceProductSeo;
}

export const DEFAULT_COMMERCE_CURRENCY: CommerceCurrency = 'TWD';

export function commerceInventoryAvailability(
  inventory: Partial<CommerceInventory> | undefined,
  status: CommerceProductVariantStatus = 'active',
): CommerceAvailabilityState {
  if (status === 'disabled') return 'disabled';
  if (!inventory) return 'in-stock';
  const quantity = Number.isFinite(inventory.quantity) ? Number(inventory.quantity) : 0;
  const lowStockThreshold = Number.isFinite(inventory.lowStockThreshold) ? Number(inventory.lowStockThreshold) : 0;
  if (inventory.allowBackorder && quantity <= 0) return 'backorder';
  if (inventory.trackInventory && quantity <= 0) return 'out-of-stock';
  if (inventory.trackInventory && lowStockThreshold > 0 && quantity <= lowStockThreshold) return 'low-stock';
  return 'in-stock';
}

export function slugifyProductTitle(title: string): string {
  const slug = title
    .normalize('NFC')
    .toLowerCase()
    .replace(/[^a-z0-9가-힣一-龥ぁ-んァ-ン]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
  return slug || `product-${Date.now()}`;
}

export function slugifyProductCategory(value: string): string {
  const slug = value
    .normalize('NFC')
    .toLowerCase()
    .replace(/[^a-z0-9가-힣一-龥ぁ-んァ-ン]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
  return slug || `category-${Date.now()}`;
}
