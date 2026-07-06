import type { Metadata } from 'next';
import Link from 'next/link';
import {
  DEFAULT_PORTFOLIO_CATEGORIES,
  categoryLabel,
  filterProjectsByCategory,
  filterProjectsByLocale,
  filterProjectsByStatus,
  listProjects,
  sortProjects,
} from '@/lib/builder/portfolio/portfolio-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';
import styles from './PortfolioPublic.module.css';

export const dynamic = 'force-dynamic';

const copy: Record<Locale, { title: string; description: string; eyebrow: string; empty: string; all: string; navLabel: string }> = {
  ko: {
    title: '포트폴리오',
    description: '대만 법률 자문, 회사 설립, 분쟁 대응 사례를 카테고리별로 확인하세요.',
    eyebrow: '포트폴리오',
    empty: '현재 공개된 포트폴리오가 없습니다.',
    all: '전체',
    navLabel: '포트폴리오 카테고리',
  },
  'zh-hant': {
    title: '案例作品集',
    description: '依類別瀏覽台灣法律諮詢、公司設立與爭議處理案例。',
    eyebrow: '作品集',
    empty: '目前沒有公開案例。',
    all: '全部',
    navLabel: '作品集分類',
  },
  en: {
    title: 'Portfolio',
    description: 'Browse Taiwan legal advisory, company setup, and dispute-resolution case studies.',
    eyebrow: 'Portfolio',
    empty: 'No public portfolio projects are available.',
    all: 'All',
    navLabel: 'Portfolio categories',
  },
};

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: copy[locale].title,
    description: copy[locale].description,
    path: '/portfolio',
    noindex: locale === 'en',
  });
}

export default async function PortfolioPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams?: { category?: string };
}) {
  const locale = normalizeLocale(params.locale);
  const activeCategory = searchParams?.category?.trim() || '';
  const projects = sortProjects(
    filterProjectsByCategory(
      filterProjectsByStatus(filterProjectsByLocale(await listProjects(), locale), 'published'),
      activeCategory,
    ),
    'order-asc',
  );

  return (
    <main className={styles.page} data-public-portfolio-page="true">
      <section className={styles.hero}>
        <div className={styles.inner}>
          <p className={styles.eyebrow} data-public-portfolio-eyebrow="true">
            {copy[locale].eyebrow}
          </p>
          <h1>{copy[locale].title}</h1>
          <p>{copy[locale].description}</p>
        </div>
      </section>

      <div className={styles.inner}>
        <nav className={styles.filters} aria-label={copy[locale].navLabel} data-public-portfolio-filters="true">
          <Link href={`/${locale}/portfolio`} aria-current={!activeCategory ? 'true' : undefined}>
            {copy[locale].all}
          </Link>
          {DEFAULT_PORTFOLIO_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/${locale}/portfolio?category=${encodeURIComponent(category.id)}`}
              aria-current={activeCategory === category.id ? 'true' : undefined}
            >
              {category.name[locale]}
            </Link>
          ))}
        </nav>

        {projects.length === 0 ? (
          <div className={styles.empty}>{copy[locale].empty}</div>
        ) : (
          <section className={styles.grid} aria-label={copy[locale].title}>
            {projects.map((project) => (
              <Link
                key={project.projectId}
                className={styles.card}
                href={`/${locale}/portfolio/${project.slug}`}
                data-public-portfolio-card={project.projectId}
              >
                {project.coverImageUrl ? (
                  <img src={project.coverImageUrl} alt="" />
                ) : (
                  <div className={styles.imageFallback} aria-hidden />
                )}
                <div className={styles.cardBody}>
                  <span className={styles.badge}>{categoryLabel(project.category, locale)}</span>
                  <strong>{project.title}</strong>
                  <span className={styles.meta}>{project.completedAt}</span>
                  <p>{project.summary}</p>
                </div>
              </Link>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
