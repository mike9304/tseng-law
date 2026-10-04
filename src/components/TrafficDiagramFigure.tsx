import DecorativeAutoplayVideo from '@/components/DecorativeAutoplayVideo';
import TrafficManualVideo from '@/components/TrafficManualVideo';
import { ZH_VIDEO_CONTROL_ICONS } from '@/components/zh-hant-icons/ZhHantMonoIcon';
import Image from 'next/image';
import type { CSSProperties } from 'react';
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
  if (!copy) return null;
  const captionId = `traffic-diagram-${diagram.id}-caption`;
  const VideoPlayer = diagram.kind !== 'still' && diagram.playback === 'manual' ? TrafficManualVideo : DecorativeAutoplayVideo;
  const aspectRatios = {
    '--diagram-aspect': `${diagram.width} / ${diagram.height}`,
    '--diagram-mobile-aspect': `${diagram.mobileWidth} / ${diagram.mobileHeight}`,
  } as CSSProperties;
  return (
    <figure
      className={[styles.figure, diagram.stills && styles.withStages, diagram.kind !== 'still' && diagram.playbackTools && styles.withPlaybackTools, className].filter(Boolean).join(' ')}
      data-traffic-diagram={diagram.id}
      aria-describedby={captionId}
    >
      <div className={diagram.kind === 'still' ? styles.stillFrame : styles.frame} style={aspectRatios}>
        {diagram.kind === 'still' ? (
          diagram.mobilePoster !== diagram.poster ? (
            <picture>
              <source media={TRAFFIC_DIAGRAM_MOBILE_QUERY} srcSet={diagram.mobilePoster} width={diagram.mobileWidth} height={diagram.mobileHeight} />
              <Image src={diagram.poster} alt={copy.alt} width={diagram.width} height={diagram.height} sizes={sizes} loading="lazy" unoptimized />
            </picture>
          ) : <Image src={diagram.poster} alt={copy.alt} width={diagram.width} height={diagram.height} sizes={sizes} loading="lazy" />
        ) : <VideoPlayer
          mp4Src={diagram.mp4}
          webmSrc={diagram.webm}
          poster={diagram.poster}
          mobileMp4Src={diagram.mobileMp4}
          mobileWebmSrc={diagram.mobileWebm}
          mobilePoster={diagram.mobilePoster}
          mobileMediaQuery={TRAFFIC_DIAGRAM_MOBILE_QUERY}
          alt={copy.alt}
          sizes={sizes}
          width={diagram.width}
          height={diagram.height}
          rootMargin="200px 0px"
          controlLabels={DECORATIVE_VIDEO_CONTROL_LABELS[locale]}
          playbackTools={diagram.playbackTools}
          describedBy={captionId}
          controlIcons={locale === 'zh-hant' ? ZH_VIDEO_CONTROL_ICONS : undefined}
        />}
      </div>
      <figcaption id={captionId} className={styles.caption}>
        <span className={styles.legend}>{copy.legend}</span>
        <span className={styles.text}>{copy.caption}</span>
        <span className={styles.assumption} data-traffic-diagram-assumption>{copy.assumption}</span>
        {copy.videoDescription ? <span className={styles.text} data-traffic-video-description>{copy.videoDescription}</span> : null}
        {enlarge ? (
          <a className={styles.enlarge} href={enlarge.href} target="_blank" rel="noopener noreferrer">
            {enlarge.label} ↗
          </a>
        ) : null}
      </figcaption>
      {copy.longDescription ? (
        <details className={styles.stages} data-traffic-diagram-description>
          <summary>{copy.longDescription.label}</summary>
          <div className={styles.longDescription}>
            {copy.longDescription.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>
        </details>
      ) : null}
      {diagram.stills && copy.stages ? (
        <details className={styles.stages} data-traffic-diagram-stages>
          <summary>{copy.stages.label}</summary>
          <ol className={styles.stageList}>
            {diagram.stills.map((stage, index) => (
              <li key={stage.poster}>
                <picture>
                  <source media={TRAFFIC_DIAGRAM_MOBILE_QUERY} srcSet={stage.mobilePoster} />
                  <Image src={stage.poster} alt={copy.stages!.alts[index]} width={diagram.width} height={diagram.height} sizes={sizes} loading="lazy" unoptimized />
                </picture>
                <p>{copy.stages!.alts[index]}</p>
              </li>
            ))}
          </ol>
        </details>
      ) : null}
    </figure>
  );
}
