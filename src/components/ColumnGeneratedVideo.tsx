import { getColumnGeneratedVideo, type ColumnVideoSource } from '@/data/column-generated-videos';
import ColumnVideoPlayer from './ColumnVideoPlayer';
import styles from './ColumnGeneratedVideo.module.css';

export default function ColumnGeneratedVideo({ locale, slug, source = 'column', autoPlay = false }: {
  locale: string;
  slug: string;
  source?: ColumnVideoSource;
  autoPlay?: boolean;
}) {
  const video = getColumnGeneratedVideo(locale, slug, source);
  if (!video) return null;
  const captionId = `column-video-${video.id}-caption`;
  return (
    <figure className={styles.figure} data-column-generated-video={video.id}>
      <ColumnVideoPlayer
        startWhenVisible={autoPlay}
        chapters={video.chapters}
        className={styles.player}
        src={video.src}
        poster={video.poster}
        width={video.width}
        height={video.height}
        controls
        playsInline
        muted
        loop={video.loop === true ? true : undefined}
        preload={autoPlay ? 'metadata' : 'none'}
        aria-label={video.title}
        aria-describedby={captionId}
      />
      <figcaption id={captionId} className={styles.caption}>
        <span className={styles.title}>{video.title}</span>
        <span>{video.description}</span>
        <span data-column-video-disclosure>{video.disclosure}</span>
      </figcaption>
    </figure>
  );
}
