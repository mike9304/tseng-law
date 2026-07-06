import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  categoryLabel,
  findProjectBySlug,
} from '@/lib/builder/portfolio/portfolio-engine';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';
import styles from '../PortfolioPublic.module.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { locale: Locale; slug: string } }): Promise<Metadata> {
  const locale = normalizeLocale(params.locale);
  const project = await findProjectBySlug(locale, params.slug);
  if (!project || project.status !== 'published') return {};
  return buildSeoMetadata({
    locale,
    title: project.seoTitle ?? project.title,
    description: project.seoDescription ?? project.summary,
    path: `/portfolio/${project.slug}`,
    images: project.coverImageUrl,
    type: 'article',
    noindex: locale === 'en',
  });
}

export default async function PortfolioDetailPage({ params }: { params: { locale: Locale; slug: string } }) {
  const locale = normalizeLocale(params.locale);
  const project = await findProjectBySlug(locale, params.slug);
  if (!project || project.status !== 'published') return notFound();
  const backLabel = locale === 'ko'
    ? '포트폴리오 목록으로'
    : locale === 'zh-hant'
      ? '返回作品集列表'
      : 'Back to portfolio';
  const eyebrow = locale === 'ko' ? '포트폴리오' : locale === 'zh-hant' ? '作品集' : 'Portfolio';
  const galleryLabel = locale === 'ko' ? '프로젝트 갤러리' : locale === 'zh-hant' ? '專案圖庫' : 'Project gallery';

  return (
    <main className={styles.page} data-public-portfolio-detail="true">
      <section className={styles.hero}>
        <div className={styles.inner}>
          <Link className={styles.back} href={`/${locale}/portfolio`}>
            {backLabel}
          </Link>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
        </div>
      </section>

      <section className={`${styles.inner} ${styles.detail}`}>
        <article className={styles.detailCard}>
          <p>{project.description}</p>
          <p>{project.body}</p>
          {project.gallery.length > 0 ? (
            <div className={styles.gallery} aria-label={galleryLabel}>
              {project.gallery.map((image) => (
                <figure key={image.imageId} data-public-portfolio-gallery-image={image.imageId}>
                  <img src={image.url} alt={image.alt} />
                  {image.caption ? <figcaption>{image.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
          ) : null}
        </article>

        <aside className={styles.sideCard}>
          <div>
            <span>{locale === 'ko' ? '카테고리' : locale === 'zh-hant' ? '類別' : 'Category'}</span>
            <strong>{categoryLabel(project.category, locale)}</strong>
          </div>
          {project.client ? (
            <div>
              <span>{locale === 'ko' ? '클라이언트' : locale === 'zh-hant' ? '客戶' : 'Client'}</span>
              <strong>{project.client}</strong>
            </div>
          ) : null}
          <div>
            <span>{locale === 'ko' ? '완료일' : locale === 'zh-hant' ? '完工日' : 'Completed'}</span>
            <strong>{project.completedAt}</strong>
          </div>
          {project.tags.length > 0 ? (
            <div className={styles.tags}>
              {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          ) : null}
        </aside>
      </section>
    </main>
  );
}
