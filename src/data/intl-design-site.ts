import type { IntlDesignLocale } from '@/lib/intl-design-locales';

/**
 * Folio presentation copy. People, offices, services and disclosures stay in their canonical guidance packs; this
 * file only holds the one line the design adds: the caption under the home hero plate, which says the scene (a
 * generic city by day, Grok Imagine still + 5 s film) is AI-generated. Operator 2026-10-15: label it visibly,
 * in the page language, as a short quiet caption. Wording follows each language's usual term for AI
 * (KI in de/nb, IA in Romance languages, ИИ/ШІ, DI/MI in lt/lv, native words in fi/et/hu/hr/sr/sl/is/el).
 */
export const intlHeroAiCaption: Record<IntlDesignLocale, string> = {
  id: 'Gambar dibuat dengan AI',
  th: 'ภาพที่สร้างด้วย AI',
  de: 'Mit KI erzeugtes Bild',
  es: 'Imagen generada con IA',
  fr: 'Image générée par IA',
  it: 'Immagine generata con IA',
  pt: 'Imagem gerada com IA',
  nl: 'Beeld gemaakt met AI',
  pl: 'Obraz wygenerowany przez AI',
  ru: 'Изображение создано с помощью ИИ',
  uk: 'Зображення створено за допомогою ШІ',
  el: 'Εικόνα δημιουργημένη με τεχνητή νοημοσύνη',
  sv: 'Bild skapad med AI',
  da: 'Billede skabt med AI',
  nb: 'Bilde laget med KI',
  fi: 'Tekoälyllä luotu kuva',
  cs: 'Obrázek vytvořený pomocí AI',
  hu: 'Mesterséges intelligenciával készült kép',
  ro: 'Imagine generată cu IA',
  sk: 'Obrázok vytvorený pomocou AI',
  bg: 'Изображение, създадено с AI',
  hr: 'Slika izrađena umjetnom inteligencijom',
  sr: 'Slika napravljena veštačkom inteligencijom',
  sl: 'Slika, ustvarjena z umetno inteligenco',
  lt: 'DI sukurtas vaizdas',
  lv: 'Ar MI radīts attēls',
  et: 'Tehisintellektiga loodud pilt',
  ca: 'Imatge generada amb IA',
  is: 'Mynd gerð með gervigreind',
};

/** Hero plate media (DIRECTION §5): the still is the trimmed film's first frame, so the fade-in is invisible. */
export const INTL_HERO_MEDIA = {
  still1280: '/images/intl-design/hero-still-1280.webp',
  still640: '/images/intl-design/hero-still-640.webp',
  filmMp4: '/media/intl-design/intl-hero-5s.mp4',
  filmWebm: '/media/intl-design/intl-hero-5s.webm',
  width: 1280,
  height: 720,
} as const;
