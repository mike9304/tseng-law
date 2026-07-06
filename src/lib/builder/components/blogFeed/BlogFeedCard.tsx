import type { CSSProperties } from 'react';
import { DEFAULT_BLOG_CATEGORIES } from '@/lib/builder/blog/blog-engine';
import type { BuilderBlogFeedCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import type { BlogFeedCopy } from './blog-feed-copy';
import type { FeedItem } from './blog-feed-items';
import styles from './BlogFeed.module.css';

type CardStyle = CSSProperties & {
  '--blog-category-color': string;
  '--blog-category-bg': string;
  '--blog-image-bg': string;
};

interface BlogFeedCardProps {
  item: FeedItem;
  index: number;
  content: BuilderBlogFeedCanvasNode['content'];
  layout: BuilderBlogFeedCanvasNode['content']['layout'];
  locale: Locale;
  copy: BlogFeedCopy;
  archiveEnabled: boolean;
}

function categoryMeta(slug?: string, locale?: Locale): { label: string; color: string } {
  const cat = DEFAULT_BLOG_CATEGORIES.find((category) => category.slug === slug);
  return {
    label: cat?.name[locale ?? 'en'] ?? cat?.name.en ?? cat?.name.ko ?? slug ?? 'General',
    color: cat?.color ?? '#2d5c48',
  };
}

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '').trim();
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return `rgba(45, 92, 72, ${alpha})`;
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function imageGradient(color: string): string {
  return `linear-gradient(135deg, ${hexToRgba(color, 0.2)} 0%, #f8fafc 48%, ${hexToRgba(color, 0.12)} 100%)`;
}

export function BlogFeedCard({
  item,
  index,
  content,
  layout,
  locale,
  copy,
  archiveEnabled,
}: BlogFeedCardProps) {
  const meta = categoryMeta(item.category, locale);
  const isHero = layout === 'featured-hero' && index === 0;
  const cardStyle: CardStyle = {
    '--blog-category-color': meta.color,
    '--blog-category-bg': hexToRgba(meta.color, 0.1),
    '--blog-image-bg': imageGradient(meta.color),
  };
  const cardClassName = [
    styles.card,
    isHero ? styles.cardHero : '',
    !content.showFeaturedImage ? styles.cardNoImage : '',
  ].filter(Boolean).join(' ');

  return (
    <article key={item.postId} className={cardClassName} style={cardStyle}>
      <a className={styles.cardLink} href={item.href} aria-label={copy.element.ariaLabel(item.title)}>
        {content.showFeaturedImage ? (
          <div className={styles.media}>
            {item.featuredImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.featuredImage} alt="" loading="lazy" />
            ) : (
              <div className={styles.imagePlaceholder}>
                <span>{meta.label}</span>
              </div>
            )}
            {item.featured ? <span className={styles.featuredBadge}>{copy.element.featuredBadge}</span> : null}
          </div>
        ) : null}
        <div className={styles.body}>
          {content.showCategory && item.category ? (
            <span className={styles.categoryChip}>{meta.label}</span>
          ) : null}
          <h3 className={`${styles.title}${archiveEnabled ? ' columns-card-title' : ''}`}>{item.title}</h3>
          {content.showExcerpt && item.excerpt ? <p className={styles.excerpt}>{item.excerpt}</p> : null}
          <div className={styles.footer}>
            <div className={styles.metaLine}>
              {content.showAuthor && item.authorName ? <span>{item.authorName}</span> : null}
              {content.showDate && item.date ? <span>{item.date}</span> : null}
              {content.showReadingTime && item.readingTimeMinutes > 0 ? (
                <span>{copy.element.readingTimeLabel(item.readingTimeMinutes)}</span>
              ) : null}
            </div>
            {content.showTags && item.tags.length > 0 ? (
              <div className={styles.tags}>
                {item.tags.slice(0, 4).map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            ) : null}
            <span className={styles.readMore}>{copy.element.readMore}</span>
          </div>
        </div>
      </a>
    </article>
  );
}
