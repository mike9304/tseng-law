import { isIntlDesignLocale, type IntlDesignLocale } from '@/lib/intl-design-locales';

/**
 * Header, scroll-to-top and summary-region labels for the 29 Folio locales (review round 1). They were English on
 * these pages ("Main menu", "Back to top", "Home", "summary"). Plain interface words. Folio pages draw no breadcrumb
 * trail (review round 2), so its labels are gone.
 * Only server modules import this file (the locale layout, GuidancePageBody); Header and ScrollTopButton get the
 * labels as props. It stays small and imports nothing else: no guidance pack, no JSON (pulling the pack JSON in here
 * split it into a new shared chunk on every page of every locale).
 */
export interface FolioChromeCopy {
  /** Home link label: the pack's own `nav.home` (kept equal by a test; the pack JSON is not imported here). */
  home: string;
  /** aria-label of the header's main navigation. */
  mainMenu: string;
  /** aria-label of the header's small link row (contact, about). */
  utilityMenu: string;
  /** Floating scroll-to-top button. */
  backToTop: string;
  /** aria-label of the answer-summary section on guidance pages. */
  summary: string;
}

export const folioChromeCopy: Record<IntlDesignLocale, FolioChromeCopy> = {
  id: { home: 'Beranda', mainMenu: 'Menu utama', utilityMenu: 'Tautan cepat', backToTop: 'Kembali ke atas', summary: 'Ringkasan' },
  th: { home: 'หน้าแรก', mainMenu: 'เมนูหลัก', utilityMenu: 'ลิงก์ด่วน', backToTop: 'กลับขึ้นด้านบน', summary: 'สรุป' },
  de: { home: 'Startseite', mainMenu: 'Hauptmenü', utilityMenu: 'Schnellzugriff', backToTop: 'Nach oben', summary: 'Zusammenfassung' },
  es: { home: 'Inicio', mainMenu: 'Menú principal', utilityMenu: 'Accesos rápidos', backToTop: 'Volver arriba', summary: 'Resumen' },
  fr: { home: 'Accueil', mainMenu: 'Menu principal', utilityMenu: 'Liens rapides', backToTop: 'Retour en haut', summary: 'Résumé' },
  it: { home: 'Home', mainMenu: 'Menu principale', utilityMenu: 'Collegamenti rapidi', backToTop: 'Torna su', summary: 'Sintesi' },
  pt: { home: 'Início', mainMenu: 'Menu principal', utilityMenu: 'Ligações rápidas', backToTop: 'Voltar ao topo', summary: 'Resumo' },
  nl: { home: 'Home', mainMenu: 'Hoofdmenu', utilityMenu: 'Snelle links', backToTop: 'Naar boven', summary: 'Samenvatting' },
  pl: { home: 'Strona główna', mainMenu: 'Menu główne', utilityMenu: 'Szybkie linki', backToTop: 'Powrót na górę', summary: 'Podsumowanie' },
  ru: { home: 'Главная', mainMenu: 'Главное меню', utilityMenu: 'Быстрые ссылки', backToTop: 'Наверх', summary: 'Краткое изложение' },
  uk: { home: 'Головна', mainMenu: 'Головне меню', utilityMenu: 'Швидкі посилання', backToTop: 'Нагору', summary: 'Короткий виклад' },
  el: { home: 'Αρχική', mainMenu: 'Κύριο μενού', utilityMenu: 'Γρήγοροι σύνδεσμοι', backToTop: 'Επιστροφή στην κορυφή', summary: 'Σύνοψη' },
  sv: { home: 'Hem', mainMenu: 'Huvudmeny', utilityMenu: 'Snabblänkar', backToTop: 'Till toppen', summary: 'Sammanfattning' },
  da: { home: 'Hjem', mainMenu: 'Hovedmenu', utilityMenu: 'Genveje', backToTop: 'Til toppen', summary: 'Sammenfatning' },
  nb: { home: 'Hjem', mainMenu: 'Hovedmeny', utilityMenu: 'Snarveier', backToTop: 'Til toppen', summary: 'Sammendrag' },
  fi: { home: 'Etusivu', mainMenu: 'Päävalikko', utilityMenu: 'Pikalinkit', backToTop: 'Takaisin ylös', summary: 'Yhteenveto' },
  cs: { home: 'Úvod', mainMenu: 'Hlavní nabídka', utilityMenu: 'Rychlé odkazy', backToTop: 'Zpět nahoru', summary: 'Shrnutí' },
  hu: { home: 'Kezdőlap', mainMenu: 'Főmenü', utilityMenu: 'Gyorslinkek', backToTop: 'Vissza az oldal tetejére', summary: 'Összefoglalás' },
  ro: { home: 'Acasă', mainMenu: 'Meniu principal', utilityMenu: 'Linkuri rapide', backToTop: 'Înapoi sus', summary: 'Rezumat' },
  sk: { home: 'Domov', mainMenu: 'Hlavná ponuka', utilityMenu: 'Rýchle odkazy', backToTop: 'Späť hore', summary: 'Zhrnutie' },
  bg: { home: 'Начало', mainMenu: 'Главно меню', utilityMenu: 'Бързи връзки', backToTop: 'Нагоре', summary: 'Резюме' },
  hr: { home: 'Naslovnica', mainMenu: 'Glavni izbornik', utilityMenu: 'Brze poveznice', backToTop: 'Natrag na vrh', summary: 'Sažetak' },
  sr: { home: 'Početna', mainMenu: 'Glavni meni', utilityMenu: 'Brzi linkovi', backToTop: 'Nazad na vrh', summary: 'Sažetak' },
  sl: { home: 'Domov', mainMenu: 'Glavni meni', utilityMenu: 'Hitre povezave', backToTop: 'Na vrh', summary: 'Povzetek' },
  lt: { home: 'Pradžia', mainMenu: 'Pagrindinis meniu', utilityMenu: 'Greitosios nuorodos', backToTop: 'Į viršų', summary: 'Santrauka' },
  lv: { home: 'Sākums', mainMenu: 'Galvenā izvēlne', utilityMenu: 'Ātrās saites', backToTop: 'Uz augšu', summary: 'Kopsavilkums' },
  et: { home: 'Avaleht', mainMenu: 'Peamenüü', utilityMenu: 'Kiirlingid', backToTop: 'Tagasi üles', summary: 'Kokkuvõte' },
  ca: { home: 'Inici', mainMenu: 'Menú principal', utilityMenu: 'Enllaços ràpids', backToTop: 'Torna amunt', summary: 'Resum' },
  is: { home: 'Forsíða', mainMenu: 'Aðalvalmynd', utilityMenu: 'Flýtileiðir', backToTop: 'Efst á síðu', summary: 'Samantekt' },
};

/** Chrome labels for a Folio locale, or null for every other locale. */
export function folioChrome(locale: string): FolioChromeCopy | null {
  return isIntlDesignLocale(locale) ? folioChromeCopy[locale] : null;
}
