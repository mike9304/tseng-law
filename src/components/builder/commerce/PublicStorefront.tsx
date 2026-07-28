import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import type {
  CommerceProduct,
  CommerceProductCategory,
} from '@/lib/builder/commerce/products-shared';
import styles from './PublicStorefront.module.css';

const copy: Record<Locale, { all: string; categories: string; empty: string; products: string; collectionFallback: string }> = {
  ko: {
    all: '전체 상품',
    categories: '상품 카테고리',
    empty: '현재 이 컬렉션에 공개된 상품이 없습니다.',
    products: '상품',
    collectionFallback: '컬렉션',
  },
  'zh-hant': {
    all: '全部商品',
    categories: '商品分類',
    empty: '此系列目前沒有公開商品。',
    products: '商品',
    collectionFallback: '系列',
  },
  en: {
    all: 'All products',
    categories: 'Store categories',
    empty: 'No public products are available in this collection.',
    products: 'Products',
    collectionFallback: 'Collection',
  },
};

function productHref(locale: Locale, product: CommerceProduct): string {
  return `/${locale}/store/products/${encodeURIComponent(product.slug)}`;
}

function formatPrice(product: CommerceProduct): string {
  return new Intl.NumberFormat(product.locale === 'ko' ? 'ko-KR' : product.locale === 'zh-hant' ? 'zh-TW' : 'en-US', {
    style: 'currency',
    currency: product.currency,
    maximumFractionDigits: product.currency === 'TWD' || product.currency === 'KRW' ? 0 : 2,
  }).format(product.priceCents / 100);
}

interface PublicStorefrontProps {
  locale: Locale;
  title: string;
  description: string;
  eyebrow: string;
  products: CommerceProduct[];
  categories: CommerceProductCategory[];
  activeCategory?: CommerceProductCategory;
}

export default function PublicStorefront({
  locale,
  title,
  description,
  eyebrow,
  products,
  categories,
  activeCategory,
}: PublicStorefrontProps) {
  const categoryNameByKey = new Map<string, string>();
  for (const category of categories) {
    categoryNameByKey.set(category.categoryId, category.name);
    categoryNameByKey.set(category.slug, category.name);
  }
  const resolveCategoryBadge = (product: CommerceProduct): string => {
    const primaryCategoryKey = product.categoryIds[0];
    return (primaryCategoryKey && categoryNameByKey.get(primaryCategoryKey)) || copy[locale].collectionFallback;
  };
  return (
    <main
      className={styles.page}
      data-commerce-storefront
      data-commerce-category-route={activeCategory?.slug ?? 'all'}
    >
      <section className={styles.hero}>
        <div className={styles.inner}>
          <p className={styles.eyebrow} data-commerce-store-eyebrow>{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </section>

      <div className={styles.inner}>
        <nav className={styles.categoryNav} aria-label={copy[locale].categories} data-commerce-category-nav>
          <Link
            href={`/${locale}/store`}
            aria-current={!activeCategory ? 'true' : undefined}
            data-commerce-category-link="all"
          >
            {copy[locale].all}
          </Link>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/${locale}/store/categories/${encodeURIComponent(category.slug)}`}
              aria-current={activeCategory?.slug === category.slug ? 'true' : undefined}
              data-commerce-category-link={category.slug}
            >
              <span>{category.name}</span>
              <small>{category.productCount}</small>
            </Link>
          ))}
        </nav>

        {products.length === 0 ? (
          <div className={styles.empty}>{copy[locale].empty}</div>
        ) : (
          <section className={styles.grid} aria-label={copy[locale].products} data-commerce-category-gallery>
            {products.map((product) => (
              <article
                key={product.productId}
                className={styles.card}
                data-commerce-category-card={product.productId}
                data-commerce-product-slug={product.slug}
              >
                {product.media[0]?.url ? (
                  <img src={product.media[0].url} alt={product.media[0].alt} />
                ) : (
                  <div className={styles.imageFallback} aria-hidden />
                )}
                <div className={styles.cardBody}>
                <span className={styles.badge}>{resolveCategoryBadge(product)}</span>
                  <Link
                    href={productHref(locale, product)}
                    className={styles.productLink}
                    data-commerce-product-detail-link={product.slug}
                  >
                    {product.title}
                  </Link>
                  <p>{product.description}</p>
                  <div className={styles.meta}>
                    <span>{product.sku}</span>
                    <strong>{formatPrice(product)}</strong>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
