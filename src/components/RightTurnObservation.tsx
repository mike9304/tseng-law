import TrafficManualVideo from './TrafficManualVideo';
import { DECORATIVE_VIDEO_CONTROL_LABELS } from './decorative-video-controls';
import { RIGHT_TURN_OBSERVATION as clip } from '@/data/right-turn-observation';
import styles from './RightTurnObservation.module.css';

export default function RightTurnObservation() {
  const captionId = `${clip.id}-caption`;
  return (
    <section className={styles.section} data-traffic-observation="right-turn" aria-labelledby={clip.id}>
      <h2 id={clip.id}>{clip.title}</h2>
      <p className={styles.disclosure} data-observation-disclosure>{clip.disclosure}</p>
      <figure className={styles.figure} aria-describedby={captionId}>
        <div className={styles.player}>
          <TrafficManualVideo
            mp4Src={clip.mp4} mobileMp4Src={clip.mobileMp4}
            webmSrc={clip.webm} mobileWebmSrc={clip.mobileWebm}
            poster={clip.poster} mobilePoster={clip.mobilePoster}
            mobileMediaQuery="(max-width: 640px)" width={1280} height={960}
            alt={clip.alt} posterAlt={clip.posterAlt}
            sizes="(max-width: 640px) calc(100vw - 40px), 760px"
            controlLabels={DECORATIVE_VIDEO_CONTROL_LABELS['zh-hant']}
            playbackTools describedBy={captionId}
          />
        </div>
        <noscript><p>影片文字說明在下方。亦可直接開啟<a href={clip.mp4}>橫式影片</a>或<a href={clip.mobileMp4}>直式影片</a>。</p></noscript>
        <figcaption id={captionId} className={styles.caption}>
          {clip.caption.map(text => <p key={text}>{text}</p>)}
        </figcaption>
        <details className={styles.description} data-observation-description>
          <summary>影片完整文字說明</summary>
          {clip.description.map(text => <p key={text}>{text}</p>)}
        </details>
      </figure>
    </section>
  );
}
