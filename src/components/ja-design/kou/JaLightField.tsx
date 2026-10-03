import type { ReactNode } from 'react';
import { KOU } from './ja-kou-media';
import JaSequence from './JaSequence';
import l from './JaLight.module.css';

/**
 * The sunlit wall behind C2 and C3 (CONCEPT-V2 §7.5, §8.3; amendment: scroll-scrubbed sequence). A sticky backdrop:
 * the morning still is always there (reduced motion, Save-Data, before the frames arrive); the canvas draws the
 * wall-day frames over it as the reader scrolls, so the light walks across the wall from morning to noon.
 */
export default function JaLightField({ children }: { children: ReactNode }) {
  return (
    <div className={l.wrap} data-ja-light="">
      <div className={l.field} aria-hidden="true">
        <picture>
          <source media="(max-width: 767px)" srcSet={KOU.wall.morningMobile} type="image/webp" />
          <source srcSet={`${KOU.wall.morning960} 960w, ${KOU.wall.morning} 1920w`} sizes="100vw" type="image/webp" />
          {/* eslint-disable-next-line @next/next/no-img-element -- pre-encoded webp still, served as is */}
          <img className={l.still} src={KOU.wall.morning} alt="" width={1920} height={1080} loading="lazy" decoding="async" />
        </picture>
        <JaSequence className={l.canvas} />
      </div>
      <div className={l.content}>{children}</div>
    </div>
  );
}
