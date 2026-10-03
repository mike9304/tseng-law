import HomeContactCta from '@/components/HomeContactCta';
import { KOU } from './ja-kou-media';
import JaStageMarkers from './JaStageMarkers';
import c from './JaChapters.module.css';

/**
 * C12 「夕」: the day ends in a square of dusk light (CONCEPT-V2 §5 C12; amendment: afternoon → dusk). The closing copy
 * and actions (HomeContactCta, unchanged) sit over a pinned backdrop in which the afternoon glints give way to the dusk
 * square while it settles from a close crop to the full frame. The wrapper itself is never animated.
 */
export default function JaClosing() {
  return (
    <div className={c.closing} data-ja-stage="closing">
      <div className={c.backdrop} aria-hidden="true">
        <picture>
          <source media="(max-width: 767px)" srcSet={KOU.glass.posterMobile} type="image/webp" />
          <source srcSet={`${KOU.glass.poster960} 960w, ${KOU.glass.poster} 1920w`} sizes="100vw" type="image/webp" />
          {/* eslint-disable-next-line @next/next/no-img-element -- pre-encoded webp still, served as is */}
          <img className={`${c.dusk} ${c.afternoon}`} src={KOU.glass.poster} alt="" width={1920} height={1080} loading="lazy" decoding="async" />
        </picture>
        <picture>
          <source media="(max-width: 767px)" srcSet={KOU.dusk.stillMobile} type="image/webp" />
          <source srcSet={`${KOU.dusk.still960} 960w, ${KOU.dusk.still} 1920w`} sizes="100vw" type="image/webp" />
          {/* eslint-disable-next-line @next/next/no-img-element -- pre-encoded webp still, served as is */}
          <img className={`${c.dusk} ${c.duskLight}`} src={KOU.dusk.still} alt="" width={1920} height={1080} loading="lazy" decoding="async" />
        </picture>
      </div>
      <div className={c.closingContent}>
        <HomeContactCta locale="ja" />
      </div>
      <div className={c.closingRunway} aria-hidden="true" />
      <JaStageMarkers bounds={[0.34, 0.67]} />
    </div>
  );
}
