/**
 * ja home media (CONCEPT-V2 §10; assets committed in public/, see spectacle/ja/ASSETS.md). Every pixel is Grok's.
 * The wall-day sequence (C2–C3) is cut from the Grok image-to-video clip that produced the noon still S2b
 * (spectacle/ja/grok/v6, v6m): 80 desktop frames at 1280x720 and 48 phone frames at 600x800, webp.
 */
const img = (name: string) => `/images/editorial/${name}`;

export const KOU = {
  hero: {
    poster: img('ja-kou-hero-light.webp'),
    posterMobile: img('ja-kou-hero-light-mobile.webp'),
    mp4: '/videos/ja-kou-hero-light.mp4',
    webm: '/videos/ja-kou-hero-light.webm',
    mp4Mobile: '/videos/ja-kou-hero-light-mobile.mp4',
    webmMobile: '/videos/ja-kou-hero-light-mobile.webm',
    mobileQuery: '(max-width: 899px)',
  },
  sukashi: {
    a: img('ja-kou-sukashi-a.webp'),
    b: img('ja-kou-sukashi-b.webp'),
    c: img('ja-kou-sukashi-c.webp'),
    a960: img('ja-kou-sukashi-a-960.webp'),
    b960: img('ja-kou-sukashi-b-960.webp'),
    c960: img('ja-kou-sukashi-c-960.webp'),
    aMobile: img('ja-kou-sukashi-a-mobile.webp'),
    bMobile: img('ja-kou-sukashi-b-mobile.webp'),
    cMobile: img('ja-kou-sukashi-c-mobile.webp'),
  },
  wall: {
    morning: img('ja-kou-wall-morning.webp'),
    morning960: img('ja-kou-wall-morning-960.webp'),
    morningMobile: img('ja-kou-wall-morning-mobile.webp'),
    noon: img('ja-kou-wall-noon.webp'),
    noon960: img('ja-kou-wall-noon-960.webp'),
    noonMobile: img('ja-kou-wall-noon-mobile.webp'),
  },
  glass: {
    poster: img('ja-kou-patterned-glass.webp'),
    poster960: img('ja-kou-patterned-glass-960.webp'),
    posterMobile: img('ja-kou-patterned-glass-mobile.webp'),
    mp4: '/videos/ja-kou-patterned-glass.mp4',
    webm: '/videos/ja-kou-patterned-glass.webm',
  },
  dusk: {
    still: img('ja-kou-dusk-light.webp'),
    still960: img('ja-kou-dusk-light-960.webp'),
    stillMobile: img('ja-kou-dusk-light-mobile.webp'),
  },
} as const;

/** Scroll-scrubbed image sequence: the light on the wall moves from morning to noon. */
export const KOU_WALL_SEQUENCE = {
  desktop: { base: img('ja-kou-wall-day/d-'), count: 80, width: 1280, height: 720 },
  phone: { base: img('ja-kou-wall-day/m-'), count: 48, width: 600, height: 800 },
  phoneQuery: '(max-width: 767px)',
} as const;

export function kouSequenceFrame(base: string, index: number): string {
  return `${base}${String(index + 1).padStart(3, '0')}.webp`;
}
