import type { IntlDesignLocale } from '@/lib/intl-design-locales';

/**
 * Folio presentation copy. People, offices, services and disclosures stay in their canonical guidance packs; this
 * file only holds the one line the design adds: the caption under the home hero plate, which says the scene (a
 * generic city by day, Grok Imagine still + 5 s film) is fictional. Operator 2026-10-22: caption it as a fictional scene,
 * in the page language, as a short quiet caption.
 */
export const intlHeroAiCaption: Record<IntlDesignLocale, string> = {
  id: 'Adegan fiksi',
  th: 'ภาพฉากสมมติ',
  de: 'Fiktive Szene',
  es: 'Escena ficticia',
  fr: 'Scène fictive',
  it: 'Scena immaginaria',
  pt: 'Cena fictícia',
  nl: 'Fictieve scène',
  pl: 'Scena fikcyjna',
  ru: 'Вымышленная сцена',
  uk: 'Вигадана сцена',
  el: 'Φανταστική σκηνή',
  sv: 'Fiktiv scen',
  da: 'Fiktiv scene',
  nb: 'Oppdiktet scene',
  fi: 'Kuvitteellinen kohtaus',
  cs: 'Smyšlená scéna',
  hu: 'Kitalált jelenet',
  ro: 'Scenă fictivă',
  sk: 'Vymyslená scéna',
  bg: 'Измислена сцена',
  hr: 'Izmišljena scena',
  sr: 'Izmišljeni prizor',
  sl: 'Izmišljen prizor',
  lt: 'Išgalvota scena',
  lv: 'Izdomāta aina',
  et: 'Väljamõeldud stseen',
  ca: 'Escena fictícia',
  is: 'Skálduð mynd',
};

/**
 * Hero plate media (DIRECTION §5): the still is the trimmed film's first frame, so the fade-in is invisible. All four
 * files sit under public/images so the static build serves them from the media origin (R2), which answers byte-range
 * requests; the Sites origin does not (checked 2026-10-15: 200 without Accept-Ranges), and Safari plays video only
 * with ranges. DIRECTION had the film under public/media (review round 1 moved it).
 */
export const INTL_HERO_MEDIA = {
  still1280: '/images/intl-design/hero-still-1280.webp',
  still640: '/images/intl-design/hero-still-640.webp',
  filmMp4: '/images/intl-design/intl-hero-5s.mp4',
  filmWebm: '/images/intl-design/intl-hero-5s.webm',
  width: 1280,
  height: 720,
} as const;
