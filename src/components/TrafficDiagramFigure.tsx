import DecorativeAutoplayVideo from '@/components/DecorativeAutoplayVideo';
import { DECORATIVE_VIDEO_CONTROL_LABELS } from '@/components/decorative-video-controls';
import {
  TRAFFIC_DIAGRAMS,
  TRAFFIC_DIAGRAM_MOBILE_QUERY,
  type TrafficDiagram,
  type TrafficDiagramId,
  type TrafficDiagramLocale,
} from '@/data/traffic-diagrams';
import styles from './TrafficDiagramFigure.module.css';

/**
 * Looping Blender diagram with a localized caption.
 *
 * Playback goes through DecorativeAutoplayVideo: the poster is server-rendered
 * (responsive <picture>), and the `<video autoplay muted loop playsinline
 * preload="metadata">` is mounted only near the viewport, never under
 * `prefers-reduced-motion: reduce` or Save-Data (poster only), pauses off
 * screen and exposes a pause/play button.
 */
export default function TrafficDiagramFigure({
  diagramId,
  locale,
  className,
  sizes = '(max-width: 640px) calc(100vw - 40px), 1120px',
  enlarge,
}: {
  diagramId: TrafficDiagramId;
  locale: TrafficDiagramLocale;
  className?: string;
  sizes?: string;
  enlarge?: { href: string; label: string };
}) {
  const diagram: TrafficDiagram = (TRAFFIC_DIAGRAMS as Record<string, TrafficDiagram>)[diagramId];
  const copy = diagram.copy[locale];
  const captionId = `traffic-diagram-${diagram.id}-caption`;
  return (
    <figure
      className={[styles.figure, className].filter(Boolean).join(' ')}
      data-traffic-diagram={diagram.id}
      aria-describedby={captionId}
    >
      <div className={styles.frame}>
        <DecorativeAutoplayVideo
          mp4Src={diagram.mp4}
          webmSrc={diagram.webm}
          poster={diagram.poster}
          mobileMp4Src={diagram.mobileMp4}
          mobileWebmSrc={diagram.mobileWebm}
          mobilePoster={diagram.mobilePoster}
          mobileMediaQuery={TRAFFIC_DIAGRAM_MOBILE_QUERY}
          alt={copy.alt}
          sizes={sizes}
          rootMargin="200px 0px"
          controlLabels={DECORATIVE_VIDEO_CONTROL_LABELS[locale]}
        />
      </div>
      <figcaption id={captionId} className={styles.caption}>
        <strong className={styles.legend}>{copy.legend}</strong>
        <span className={styles.text}>{copy.caption}</span>
        <span className={styles.assumption} data-traffic-diagram-assumption>{copy.assumption}</span>
        {enlarge ? (
          <a className={styles.enlarge} href={enlarge.href} target="_blank" rel="noopener noreferrer">
            {enlarge.label} ↗
          </a>
        ) : null}
      </figcaption>
    </figure>
  );
}
