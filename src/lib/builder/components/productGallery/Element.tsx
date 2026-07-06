'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { BuilderProductGalleryCanvasNode } from '@/lib/builder/canvas/types';
import {
  commerceInventoryAvailability,
  type CommerceProduct,
  type CommerceProductCategory,
  type CommerceProductSortBy,
} from '@/lib/builder/commerce/products-shared';
import { normalizeLocale, type Locale } from '@/lib/locales';
import styles from './ProductGallery.module.css';
import { getProductGalleryCopy, type ProductGalleryCopy } from './product-gallery-copy';

interface ProductGalleryElementProps {
  node: BuilderProductGalleryCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}

type RootStyle = CSSProperties & {
  '--product-gallery-columns': string;
};

const sortOptions: CommerceProductSortBy[] = ['updated-desc', 'title-asc', 'price-asc', 'price-desc'];

function getMockProducts(locale: Locale, copy: ProductGalleryCopy): CommerceProduct[] {
  const [guide, consultation] = copy.mock.products;
  return [
    {
      productId: 'product-gallery-mock-1',
      locale,
      slug: 'taiwan-startup-guide',
      title: guide.title,
      description: guide.description,
      body: guide.body,
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
          alt: guide.mediaAlt,
          sortOrder: 1,
        },
      ],
      options: [{ optionId: 'format', name: guide.optionName, values: guide.optionValues }],
      variants: [],
      categoryIds: ['digital-guides'],
      tags: [guide.tag],
      seo: {},
      createdAt: '2026-05-20T00:00:00.000Z',
      updatedAt: '2026-05-20T00:00:00.000Z',
    },
    {
      productId: 'product-gallery-mock-2',
      locale,
      slug: 'taiwan-consultation-package',
      title: consultation.title,
      description: consultation.description,
      body: consultation.body,
      status: 'active',
      sku: 'TW-CONSULT-KO',
      priceCents: 990000,
      currency: 'TWD',
      inventory: {
        trackInventory: true,
        quantity: 3,
        lowStockThreshold: 3,
        allowBackorder: false,
      },
      media: [
        {
          mediaId: 'consultation-cover',
          type: 'image',
          url: '/images/004-taiwan-employment-contract-guide/featured-01.jpg',
          alt: consultation.mediaAlt,
          sortOrder: 1,
        },
      ],
      options: [],
      variants: [],
      categoryIds: ['consultation'],
      tags: [consultation.tag],
      seo: {},
      createdAt: '2026-05-20T00:00:00.000Z',
      updatedAt: '2026-05-20T00:00:00.000Z',
    },
  ];
}

function getMockCategories(locale: Locale, copy: ProductGalleryCopy): CommerceProductCategory[] {
  const [digitalGuides, consultation] = copy.mock.categories;
  return [
    {
      categoryId: 'digital-guides',
      locale,
      slug: 'digital-guides',
      name: digitalGuides.name,
      description: '',
      status: 'active',
      sortOrder: 10,
      productCount: 1,
      seo: {},
    },
    {
      categoryId: 'consultation',
      locale,
      slug: 'consultation',
      name: consultation.name,
      description: '',
      status: 'active',
      sortOrder: 20,
      productCount: 1,
      seo: {},
    },
  ];
}

function formatPrice(product: CommerceProduct): string {
  return new Intl.NumberFormat(product.locale === 'ko' ? 'ko-KR' : product.locale === 'zh-hant' ? 'zh-TW' : 'en-US', {
    style: 'currency',
    currency: product.currency,
    maximumFractionDigits: product.currency === 'TWD' || product.currency === 'KRW' ? 0 : 2,
  }).format(product.priceCents / 100);
}

function categoryLabel(product: CommerceProduct, categories: CommerceProductCategory[], fallback: string): string {
  const categoryId = product.categoryIds[0] ?? '';
  const match = categories.find((category) => category.slug === categoryId || category.categoryId === categoryId);
  return match?.name || categoryId || fallback;
}

function productHref(locale: Locale, product: CommerceProduct): string {
  return `/${locale}/store/products/${encodeURIComponent(product.slug)}`;
}

export default function ProductGalleryElement({ node, mode = 'edit', locale }: ProductGalleryElementProps) {
  const c = node.content;
  const isBuilder = mode !== 'published';
  const effectiveLocale = normalizeLocale(locale || 'ko');
  const copy = getProductGalleryCopy(effectiveLocale);
  const [products, setProducts] = useState<CommerceProduct[] | null>(null);
  const [categories, setCategories] = useState<CommerceProductCategory[] | null>(null);
  const [activeCategory, setActiveCategory] = useState(c.category ?? '');
  const [sortBy, setSortBy] = useState<CommerceProductSortBy>(c.sortBy);
  const [pageIndex, setPageIndex] = useState(0);
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setActiveCategory(c.category ?? '');
  }, [c.category]);

  useEffect(() => {
    setSortBy(c.sortBy);
  }, [c.sortBy]);

  useEffect(() => {
    setPageIndex(0);
  }, [activeCategory, sortBy, c.pageSize]);

  useEffect(() => {
    let cancelled = false;
    setProducts(null);
    setCategories(null);
    setFailed(false);
    setLoading(!isBuilder);

    const productParams = new URLSearchParams({
      locale: effectiveLocale,
      scope: isBuilder ? 'all' : 'public',
      status: isBuilder ? 'all' : 'active',
      sort: sortBy,
      limit: '200',
    });
    if (activeCategory) productParams.set('category', activeCategory);

    const categoryParams = new URLSearchParams({
      locale: effectiveLocale,
      scope: isBuilder ? 'all' : 'public',
    });

    Promise.all([
      fetch(`/api/builder/commerce/products?${productParams.toString()}`).then((response) => response.json()),
      fetch(`/api/builder/commerce/categories?${categoryParams.toString()}`).then((response) => response.json()),
    ])
      .then(([productJson, categoryJson]) => {
        if (cancelled) return;
        if (!productJson?.ok || !Array.isArray(productJson.products)) {
          setFailed(true);
          return;
        }
        setProducts(productJson.products as CommerceProduct[]);
        setCategories(Array.isArray(categoryJson?.categories) ? categoryJson.categories as CommerceProductCategory[] : []);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeCategory, effectiveLocale, isBuilder, sortBy]);

  const categoryItems = useMemo(() => {
    return categories ?? (isBuilder ? getMockCategories(effectiveLocale, copy) : []);
  }, [categories, copy, effectiveLocale, isBuilder]);

  const sourceProducts = useMemo(() => {
    const source = products ?? (isBuilder ? getMockProducts(effectiveLocale, copy) : []);
    return source.filter((product) => !activeCategory || product.categoryIds.includes(activeCategory));
  }, [activeCategory, copy, effectiveLocale, isBuilder, products]);

  const pageSize = Math.max(1, Math.min(24, c.pageSize));
  const totalPages = Math.max(1, Math.ceil(sourceProducts.length / pageSize));
  const currentPage = Math.min(pageIndex, totalPages - 1);
  const visibleProducts = sourceProducts.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const quickViewProduct = sourceProducts.find((product) => product.productId === quickViewProductId) ?? null;

  const rootStyle: RootStyle = {
    '--product-gallery-columns': String(Math.max(1, Math.min(4, c.columns))),
  };

  if (!isBuilder && loading) {
    return <div className={styles.state} data-builder-product-gallery="true" role="status">{copy.loading}</div>;
  }

  if (!isBuilder && failed) {
    return <div className={styles.state} data-builder-product-gallery="true" role="status">{copy.error}</div>;
  }

  return (
    <section
      className={styles.root}
      data-builder-product-gallery="true"
      data-builder-product-gallery-layout={c.layout}
      data-builder-product-gallery-category={activeCategory || 'all'}
      data-builder-product-gallery-page={currentPage + 1}
      style={rootStyle}
    >
      {(c.showCategoryFilter || c.showSort) ? (
        <div className={styles.toolbar}>
          {c.showCategoryFilter ? (
            <div className={styles.filters} aria-label={copy.categoriesAriaLabel} data-builder-product-gallery-category-filter>
              <button
                type="button"
                className={styles.filter}
                aria-pressed={!activeCategory}
                onClick={() => setActiveCategory('')}
              >
                {copy.allCategories}
              </button>
              {categoryItems.map((category) => (
                <button
                  key={category.slug}
                  type="button"
                  className={styles.filter}
                  aria-pressed={activeCategory === category.slug}
                  data-builder-product-gallery-category-option={category.slug}
                  onClick={() => setActiveCategory(category.slug)}
                >
                  <span>{category.name}</span>
                  <small>{category.productCount}</small>
                </button>
              ))}
            </div>
          ) : null}

          {c.showSort ? (
            <label className={styles.sort} data-builder-product-gallery-sort>
              <span>{copy.sortLabel}</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value as CommerceProductSortBy)}>
                {sortOptions.map((option) => (
                  <option key={option} value={option}>{copy.sortOptions[option]}</option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
      ) : null}

      {visibleProducts.length === 0 ? (
        <div className={styles.state}>{copy.empty}</div>
      ) : (
        <div className={`${styles.grid} ${c.layout === 'list' ? styles.list : ''}`}>
          {visibleProducts.map((product) => {
            const media = [...product.media].sort((left, right) => left.sortOrder - right.sortOrder)[0];
            const availability = commerceInventoryAvailability(product.inventory);
            return (
              <article
                key={product.productId}
                className={styles.card}
                data-builder-product-gallery-card={product.productId}
                data-builder-product-gallery-sku={product.sku}
                data-builder-product-gallery-availability={availability}
              >
                {media?.url ? <img src={media.url} alt={media.alt} /> : <div className={styles.fallback} aria-hidden />}
                <div className={styles.body}>
                  <span className={styles.badge}>{categoryLabel(product, categoryItems, copy.collectionFallback)}</span>
                  <a
                    href={productHref(effectiveLocale, product)}
                    className={styles.title}
                    data-builder-product-gallery-detail-link={product.slug}
                  >
                    {product.title}
                  </a>
                  <p>{product.description}</p>
                  <div className={styles.meta}>
                    <span>{product.sku}</span>
                    <strong>{formatPrice(product)}</strong>
                  </div>
                  <div className={styles.actions}>
                    <span className={styles.availability}>{copy.availabilityLabels[availability]}</span>
                    {c.showQuickView ? (
                      <button
                        type="button"
                        className={styles.quickViewButton}
                        data-builder-product-gallery-quick-view-open={product.productId}
                        onClick={() => setQuickViewProductId(product.productId)}
                      >
                        {copy.quickView}
                      </button>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {totalPages > 1 ? (
        <div className={styles.pagination} data-builder-product-gallery-pagination>
          <button type="button" disabled={currentPage === 0} onClick={() => setPageIndex((value) => Math.max(0, value - 1))}>
            {copy.previousPage}
          </button>
          <span>{currentPage + 1} / {totalPages}</span>
          <button type="button" disabled={currentPage >= totalPages - 1} onClick={() => setPageIndex((value) => Math.min(totalPages - 1, value + 1))}>
            {copy.nextPage}
          </button>
        </div>
      ) : null}

      {quickViewProduct ? (
        <div
          className={styles.quickView}
          data-builder-product-gallery-quick-view="true"
          role="dialog"
          aria-label={copy.quickViewDialog}
          aria-modal="false"
        >
          <div>
            <span className={styles.badge}>{categoryLabel(quickViewProduct, categoryItems, copy.collectionFallback)}</span>
            <strong>{quickViewProduct.title}</strong>
            <p>{quickViewProduct.body || quickViewProduct.description}</p>
            <dl>
              <div>
                <dt>{copy.sku}</dt>
                <dd>{quickViewProduct.sku}</dd>
              </div>
              <div>
                <dt>{copy.price}</dt>
                <dd>{formatPrice(quickViewProduct)}</dd>
              </div>
              <div>
                <dt>{copy.options}</dt>
                <dd>{quickViewProduct.options.map((option) => option.name).join(', ') || copy.defaultProduct}</dd>
              </div>
            </dl>
            <a
              href={productHref(effectiveLocale, quickViewProduct)}
              className={styles.detailLink}
              data-builder-product-gallery-quick-view-detail-link={quickViewProduct.slug}
            >
              {copy.detail}
            </a>
          </div>
          <button type="button" onClick={() => setQuickViewProductId(null)}>{copy.close}</button>
        </div>
      ) : null}
    </section>
  );
}
