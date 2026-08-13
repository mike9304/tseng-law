import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type {
  CommerceProduct,
  CommerceProductCategory,
} from '@/lib/builder/commerce/products-shared';
import PublicProductDetail from '../PublicProductDetail';
import PublicStorefront from '../PublicStorefront';

const category: CommerceProductCategory = {
  categoryId: 'category-1',
  locale: 'en',
  slug: 'legal-services',
  name: 'Legal services',
  description: 'Legal services',
  status: 'active',
  sortOrder: 1,
  productCount: 2,
  seo: {},
};

function makeProduct(
  productId: string,
  media: CommerceProduct['media'],
): CommerceProduct {
  return {
    productId,
    locale: 'en',
    slug: productId,
    title: `Product ${productId}`,
    description: 'Product description',
    body: 'Product details',
    status: 'active',
    sku: `SKU-${productId}`,
    priceCents: 50000,
    currency: 'TWD',
    inventory: {
      trackInventory: false,
      quantity: 0,
      lowStockThreshold: 0,
      allowBackorder: false,
    },
    media,
    options: [],
    variants: [],
    categoryIds: [category.categoryId],
    tags: [],
    seo: {},
    createdAt: '2026-07-30T00:00:00.000Z',
    updatedAt: '2026-07-30T00:00:00.000Z',
  };
}

const product = makeProduct('primary', [
  {
    mediaId: 'remote-cover',
    type: 'image',
    url: 'https://customer-cdn.example.test/products/cover.webp?version=2',
    alt: 'Remote product cover',
    sortOrder: 1,
  },
  {
    mediaId: 'local-detail',
    type: 'image',
    url: '/images/products/detail.webp',
    alt: 'Local product detail',
    sortOrder: 2,
  },
]);

const relatedProduct = makeProduct('related', [
  {
    mediaId: 'related-cover',
    type: 'image',
    url: 'https://another-cdn.example.test/related.jpg',
    alt: 'Related product cover',
    sortOrder: 1,
  },
]);

describe('public commerce image rendering', () => {
  it('keeps arbitrary CMS image URLs direct while reserving responsive dimensions', () => {
    const storefrontHtml = renderToStaticMarkup(
      <PublicStorefront
        locale="en"
        title="Store"
        description="Store description"
        eyebrow="Commerce"
        products={[product]}
        categories={[category]}
      />,
    );
    const detailHtml = renderToStaticMarkup(
      <PublicProductDetail
        locale="en"
        product={product}
        categories={[category]}
        relatedProducts={[relatedProduct]}
      />,
    );

    expect(storefrontHtml).toContain(
      'src="https://customer-cdn.example.test/products/cover.webp?version=2"',
    );
    expect(storefrontHtml).toContain('width="800"');
    expect(storefrontHtml).toContain('height="600"');

    expect(detailHtml).toContain(
      'src="https://customer-cdn.example.test/products/cover.webp?version=2"',
    );
    expect(detailHtml).toContain('alt="Remote product cover"');
    expect(detailHtml).toContain('width="1200"');
    expect(detailHtml).toContain('height="900"');
    expect(detailHtml).toContain('src="/images/products/detail.webp"');
    expect(detailHtml).toContain('src="https://another-cdn.example.test/related.jpg"');
    expect(`${storefrontHtml}${detailHtml}`).not.toContain('/_next/image?url=');
  });

  it('contains no raw img elements in either public commerce surface', () => {
    const detailSource = readFileSync(
      new URL('../PublicProductDetail.tsx', import.meta.url),
      'utf8',
    );
    const storefrontSource = readFileSync(
      new URL('../PublicStorefront.tsx', import.meta.url),
      'utf8',
    );

    expect(detailSource).not.toMatch(/<img\b/);
    expect(storefrontSource).not.toMatch(/<img\b/);
    expect(detailSource.match(/\bunoptimized\b/g)).toHaveLength(4);
    expect(storefrontSource.match(/\bunoptimized\b/g)).toHaveLength(1);
    expect(detailSource.match(/\bsizes=/g)).toHaveLength(4);
    expect(storefrontSource.match(/\bsizes=/g)).toHaveLength(1);
  });
});
