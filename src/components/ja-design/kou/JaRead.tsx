import type { CSSProperties } from 'react';
import Link from 'next/link';
import DecorativeAutoplayVideo from '@/components/DecorativeAutoplayVideo';
import { DECORATIVE_VIDEO_CONTROL_LABELS } from '@/components/decorative-video-controls';
import { ARCHIVE_INTRO_COPY } from '@/lib/insights/archive-copy';
import { JA_PINNED_COLUMN_SLUGS } from '@/components/ja-design/ja-arrangement';
import { JA_KOU_NEW, JA_KOU_REUSED } from './ja-copy';
import { KOU } from './ja-kou-media';
import JaChevron from './JaChevron';
import JaGallery from './JaGallery';
import JaGlyphCard, { type JaGlyphPost } from './JaGlyphCard';
import JaStageMarkers from './JaStageMarkers';
import { JaPhrases } from './JaPhrases';
import k from './JaKou.module.css';
import r from './JaRead.module.css';

type ReadPost = JaGlyphPost & { date: string };

const dateValue = (post: ReadPost) => {
  const parts = (post.date || post.dateDisplay).match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
  return parts ? Date.UTC(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3])) : Number.NEGATIVE_INFINITY;
};

/** The six cornerstone columns (pinned order), then the six newest others (CONCEPT-V2 §5 C5, D5). */
export function selectJaGalleryPosts(posts: readonly ReadPost[]): ReadPost[] {
  const bySlug = new Map(posts.map((post) => [post.slug, post] as const));
  const pinned = JA_PINNED_COLUMN_SLUGS.map((slug) => bySlug.get(slug)).filter((post): post is ReadPost => Boolean(post));
  const pinnedSlugs = new Set(pinned.map((post) => post.slug));
  const newest = posts
    .map((post, index) => ({ post, index }))
    .filter(({ post }) => !pinnedSlugs.has(post.slug))
    .sort((a, b) => dateValue(b.post) - dateValue(a.post) || a.index - b.index)
    .slice(0, 6)
    .map(({ post }) => post);
  return [...pinned, ...newest];
}

/**
 * C5 「午後の光」: 台湾の法律を、日本語で読む。 (CONCEPT-V2 §5 C5; amendment: a pinned interlude in which the afternoon
 * light pans in and settles, then a gallery whose cards slide in like fusuma). One <section id="insights">.
 */
export default function JaRead({ posts, columnCount }: { posts: readonly ReadPost[]; columnCount: number }) {
  const cards = selectJaGalleryPosts(posts);
  const title = JA_KOU_NEW.readTitle;
  const cut = title.indexOf('、') + 1;
  return (
    <section id="insights" className={r.section} aria-labelledby="ja-read-title">
      <div className={r.interlude} data-ja-stage="read">
        <div className={r.stage}>
          <div className={r.media}>
            <div className={r.mediaDesktop}>
              <DecorativeAutoplayVideo
                className={r.film}
                imageClassName={r.filmImage}
                videoClassName={r.filmImage}
                poster={KOU.glass.poster}
                mp4Src={KOU.glass.mp4}
                webmSrc={KOU.glass.webm}
                alt=""
                sizes="100vw"
                posterUnoptimized
                rootMargin="100% 0px"
                controlLabels={DECORATIVE_VIDEO_CONTROL_LABELS.ja}
              />
            </div>
            <picture className={r.mediaStill} aria-hidden="true">
              <source media="(max-width: 767px)" srcSet={KOU.glass.posterMobile} type="image/webp" />
              <source srcSet={`${KOU.glass.poster960} 960w, ${KOU.glass.poster} 1920w`} sizes="100vw" type="image/webp" />
              {/* eslint-disable-next-line @next/next/no-img-element -- pre-encoded webp still, served as is */}
              <img className={r.filmImage} src={KOU.glass.poster} alt="" width={1920} height={1080} loading="lazy" decoding="async" />
            </picture>
          </div>
          <div className={`${k.wrap} ${r.copy}`}>
            <h2 id="ja-read-title" className={`${r.title} ${k.ph}`}>
              <span className={r.titleLine}>
                <JaPhrases text={title.slice(0, cut)} />
              </span>
              <span className={r.titleLine}>
                <JaPhrases text={title.slice(cut)} />
              </span>
            </h2>
            <p className={`${k.lede} ${r.lede}`}>{ARCHIVE_INTRO_COPY.ja}</p>
          </div>
        </div>
        <JaStageMarkers bounds={[0.34, 0.67]} />
      </div>

      <div className={r.gallery}>
        <div className={`${k.wrap} ${r.galleryHead}`}>
          <p id="ja-read-archive" className={r.eyebrow}>
            {JA_KOU_REUSED.archiveTitle.text}
          </p>
          <p className={r.count}>
            <data className={r.countValue} value={String(columnCount)}>
              {columnCount}
            </data>
            <span className={r.countLabel}>{JA_KOU_REUSED.publishedColumns.text}</span>
          </p>
        </div>
        <JaGallery labelledBy="ja-read-archive" prevLabel={JA_KOU_REUSED.prev.text} nextLabel={JA_KOU_REUSED.next.text}>
          <ul className={r.list}>
            {cards.map((post, index) => (
              <li key={post.slug} className={r.item} style={{ '--i': index } as CSSProperties}>
                <JaGlyphCard post={post} />
              </li>
            ))}
            <li className={r.item} style={{ '--i': cards.length } as CSSProperties}>
              <Link href="/ja/columns" className={`${r.card} ${r.cardAll}`}>
                <span className={r.allLabel}>
                  {JA_KOU_REUSED.viewAllColumns.text}
                  <JaChevron className={r.allChev} />
                </span>
              </Link>
            </li>
          </ul>
        </JaGallery>
      </div>
    </section>
  );
}
