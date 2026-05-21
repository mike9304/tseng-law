import { mkdtemp, rm } from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  createProduct,
  deleteProduct,
  archiveProduct,
  duplicateProduct,
  filterProductsByCategory,
  filterProductsByLocale,
  filterProductsByStatus,
  findProductBySku,
  findProductBySlug,
  listProducts,
  normalizeCommerceProduct,
  saveProduct,
  searchProducts,
  sortProducts,
  validateProduct,
} from '@/lib/builder/commerce/products-engine';
import { commerceInventoryAvailability } from '@/lib/builder/commerce/products-shared';

let root: string;
const previousRoot = process.env.BUILDER_COMMERCE_ROOT;
const previousBackend = process.env.BUILDER_COMMERCE_BACKEND;

describe('commerce products engine', () => {
  beforeEach(async () => {
    root = await mkdtemp(path.join(os.tmpdir(), 'commerce-products-'));
    process.env.BUILDER_COMMERCE_ROOT = root;
    process.env.BUILDER_COMMERCE_BACKEND = 'local';
  });

  afterEach(async () => {
    process.env.BUILDER_COMMERCE_ROOT = previousRoot;
    process.env.BUILDER_COMMERCE_BACKEND = previousBackend;
    await rm(root, { recursive: true, force: true });
  });

  it('normalizes the full F53 product schema surface', () => {
    const product = normalizeCommerceProduct({
      locale: 'ko',
      title: '대만 법인 설립 패키지',
      description: '회사 설립 체크리스트와 상담 번들',
      body: '법인 설립 전 준비할 서류와 상담권을 포함합니다.',
      status: 'active',
      sku: 'TW-COMPANY-PACK',
      priceCents: 1500000,
      compareAtPriceCents: 1800000,
      currency: 'TWD',
      inventory: {
        trackInventory: true,
        quantity: 12,
        lowStockThreshold: 3,
        allowBackorder: false,
      },
      media: [
        { mediaId: 'cover', type: 'image', url: '/images/store/company-pack.jpg', alt: '상품 표지', sortOrder: 2 },
        { mediaId: 'intro-video', type: 'video', url: '/videos/company-pack.mp4', alt: '상품 소개 영상', sortOrder: 1 },
      ],
      options: [
        { optionId: 'format', name: 'Format', values: ['PDF', 'Consultation'] },
      ],
      variants: [
        {
          variantId: 'pdf',
          title: 'PDF',
          sku: 'TW-COMPANY-PACK-PDF',
          optionValues: { format: 'PDF' },
          priceCents: 1500000,
          inventory: {
            trackInventory: false,
            quantity: 0,
            lowStockThreshold: 0,
            allowBackorder: true,
          },
          mediaId: 'cover',
          status: 'active',
        },
        {
          variantId: 'consultation',
          title: 'Consultation',
          sku: 'TW-COMPANY-PACK-CONSULT',
          optionValues: { format: 'Consultation' },
          priceCents: 2500000,
          inventory: {
            trackInventory: true,
            quantity: 2,
            lowStockThreshold: 1,
            allowBackorder: false,
          },
          mediaId: 'intro-video',
          status: 'active',
        },
      ],
      categoryIds: ['digital-guides', 'consultation'],
      tags: ['회사설립', '대만진출'],
      seo: {
        title: '대만 법인 설립 패키지',
        description: '대만 회사 설립 준비를 돕는 상품입니다.',
      },
    });

    expect(product).toMatchObject({
      slug: '대만-법인-설립-패키지',
      status: 'active',
      sku: 'TW-COMPANY-PACK',
      priceCents: 1500000,
      compareAtPriceCents: 1800000,
      currency: 'TWD',
      inventory: {
        trackInventory: true,
        quantity: 12,
        lowStockThreshold: 3,
        allowBackorder: false,
      },
      seo: {
        title: '대만 법인 설립 패키지',
        description: '대만 회사 설립 준비를 돕는 상품입니다.',
      },
    });
    expect(product.media.map((media) => media.mediaId)).toEqual(['intro-video', 'cover']);
    expect(product.options).toEqual([
      { optionId: 'format', name: 'Format', values: ['PDF', 'Consultation'] },
    ]);
    expect(product.variants).toEqual([
      expect.objectContaining({
        variantId: 'pdf',
        sku: 'TW-COMPANY-PACK-PDF',
        priceCents: 1500000,
        optionValues: { format: 'PDF' },
      }),
      expect.objectContaining({
        variantId: 'consultation',
        sku: 'TW-COMPANY-PACK-CONSULT',
        priceCents: 2500000,
        inventory: expect.objectContaining({ quantity: 2 }),
      }),
    ]);
  });

  it('creates, finds, updates, filters, searches, sorts, and soft deletes products', async () => {
    const created = await createProduct({
      locale: 'ko',
      title: '대만 창업 상담권',
      description: '창업 전 법률 상담권',
      body: '회사 형태와 세무 등록을 검토합니다.',
      status: 'active',
      sku: 'TW-STARTUP-CONSULT',
      priceCents: 450000,
      currency: 'TWD',
      inventory: {
        trackInventory: true,
        quantity: 4,
        lowStockThreshold: 1,
        allowBackorder: false,
      },
      media: [{ mediaId: 'cover', type: 'image', url: '/images/store/startup-consult.jpg', alt: '상담권 표지', sortOrder: 1 }],
      categoryIds: ['consultation'],
      tags: ['창업', '상담'],
      seo: { title: '대만 창업 상담권' },
    });

    expect(created.slug).toBe('대만-창업-상담권');
    expect(created.variants[0]).toMatchObject({
      variantId: 'default',
      sku: 'TW-STARTUP-CONSULT',
      priceCents: 450000,
      inventory: expect.objectContaining({ quantity: 4 }),
    });
    expect(await findProductBySlug('ko', created.slug)).toMatchObject({ productId: created.productId });
    expect(await findProductBySku('TW-STARTUP-CONSULT')).toMatchObject({ productId: created.productId });

    await expect(createProduct({
      locale: 'ko',
      title: '중복 SKU 상품',
      description: '이미 존재하는 SKU를 쓰는 상품',
      status: 'draft',
      sku: 'TW-STARTUP-CONSULT',
      priceCents: 1000,
    })).rejects.toThrow('commerce_product_sku_conflict:TW-STARTUP-CONSULT');

    const duplicate = await createProduct({
      locale: 'ko',
      title: '대만 창업 상담권',
      description: '중복 slug 상품',
      status: 'draft',
      sku: 'TW-STARTUP-CONSULT-2',
      priceCents: 500000,
    });
    expect(duplicate.slug).toMatch(/^대만-창업-상담권-/);

    const saved = await saveProduct({ ...created, status: 'draft', priceCents: 550000 });
    expect(saved.status).toBe('draft');
    expect(saved.priceCents).toBe(550000);

    const listed = await listProducts();
    const koProducts = filterProductsByLocale(listed, 'ko');
    expect(koProducts.some((product) => product.productId === created.productId)).toBe(true);
    expect(filterProductsByStatus(koProducts, 'draft').some((product) => product.productId === created.productId)).toBe(true);
    expect(filterProductsByCategory(koProducts, 'consultation').some((product) => product.productId === created.productId)).toBe(true);
    expect(searchProducts(koProducts, 'STARTUP-CONSULT').some((product) => product.productId === created.productId)).toBe(true);
    expect(sortProducts([created, saved], 'price-desc')[0]?.priceCents).toBe(550000);

    const copy = await duplicateProduct(created.productId);
    expect(copy).toMatchObject({
      status: 'draft',
      title: '대만 창업 상담권 Copy',
    });
    expect(copy?.slug).toContain('대만-창업-상담권-copy-');
    expect(copy?.sku).toContain('TW-STARTUP-CONSULT-COPY-');

    const archived = await archiveProduct(created.productId);
    expect(archived).toMatchObject({ status: 'archived' });

    await deleteProduct(created.productId);
    expect((await listProducts()).map((product) => product.productId)).not.toContain(created.productId);
  });

  it('validates required product, price, inventory, and variant constraints', () => {
    const errors = validateProduct({
      title: '',
      description: '',
      status: 'active',
      slug: '',
      sku: '',
      priceCents: -1,
      compareAtPriceCents: 0,
      inventory: {
        trackInventory: true,
        quantity: -2,
        lowStockThreshold: 0,
        allowBackorder: false,
      },
      variants: [
        {
          variantId: 'one',
          title: 'One',
          sku: 'DUP',
          optionValues: {},
          priceCents: 100,
          inventory: {
            trackInventory: true,
            quantity: 1,
            lowStockThreshold: 0,
            allowBackorder: false,
          },
          status: 'active',
        },
        {
          variantId: 'two',
          title: 'Two',
          sku: 'DUP',
          optionValues: {},
          priceCents: -1,
          inventory: {
            trackInventory: true,
            quantity: -1,
            lowStockThreshold: 0,
            allowBackorder: false,
          },
          status: 'active',
        },
      ],
    });

    expect(errors).toEqual(expect.arrayContaining([
      '상품명을 입력하세요.',
      '상품 설명을 입력하세요.',
      'SKU를 입력하세요.',
      '상품 가격은 0 이상이어야 합니다.',
      '재고 수량은 0 이상이어야 합니다.',
      '판매 중 상품에는 slug가 필요합니다.',
      '중복 옵션 SKU가 있습니다: DUP',
      '옵션 가격은 0 이상이어야 합니다.',
      '옵션 재고 수량은 0 이상이어야 합니다.',
    ]));
  });

  it('classifies variant availability from inventory and status', () => {
    expect(commerceInventoryAvailability({
      trackInventory: true,
      quantity: 0,
      lowStockThreshold: 2,
      allowBackorder: false,
    })).toBe('out-of-stock');
    expect(commerceInventoryAvailability({
      trackInventory: true,
      quantity: 1,
      lowStockThreshold: 2,
      allowBackorder: false,
    })).toBe('low-stock');
    expect(commerceInventoryAvailability({
      trackInventory: true,
      quantity: 0,
      lowStockThreshold: 2,
      allowBackorder: true,
    })).toBe('backorder');
    expect(commerceInventoryAvailability({
      trackInventory: true,
      quantity: 10,
      lowStockThreshold: 2,
      allowBackorder: false,
    }, 'disabled')).toBe('disabled');
  });
});
