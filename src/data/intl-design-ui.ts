import type { IntlDesignLocale } from '@/lib/intl-design-locales';

/**
 * Interface and accessibility labels for the 29 Folio locales (review round 1, 2026-10-15).
 *
 * The shared chrome, column list and article shell fell back to English on these pages ("Main menu",
 * "Back to top", "Search columns", "18 results", "Book Consultation", "Related Topics", the English
 * attorney card). Wherever a guidance pack already holds the wording, the components read it from there
 * (nav labels, contactCta, columnsReviewLabel, the team copy for the attorney). This file only holds the
 * labels no pack had. They are plain interface words: no legal fact, fee, reply time, interpreting or
 * outcome promise, and nothing about the consultation languages beyond the existing team data.
 *
 * Split by consumer: the header and scroll-to-top labels live in `intl-design-chrome.ts` (the only part a shared
 * client bundle imports), the column list labels in `intl-design-columns-ui.ts`, and this file holds what the
 * server alone reads (article shell, home image alt). Page-level client components get their Folio labels as
 * props from the server, only on Folio pages, so other locales' bundles and markup stay as they were.
 */

export interface FolioArticleCopy {
  /** Byline link under the article title; the same title + name the pack's key-facts heading uses. */
  byline: string;
  /** Sidebar heading over the services / lawyers links. */
  relatedTopics: string;
  previous: string;
  next: string;
  /**
   * Attorney card heading on AI-written columns: who can be consulted, never a review claim (mirrors
   * `AI_COLUMN_ATTORNEY_HEADING`). Reviewed columns use the pack's `columnsReviewLabel` instead.
   */
  consultingAttorney: string;
  /** Hint (and region label) above a wide table in an article body. */
  tableScrollHint: string;
  /** Table-of-contents label (the guidance article shell carries it even where no contents list renders). */
  contents: string;
}

export const folioArticleCopy: Record<IntlDesignLocale, FolioArticleCopy> = {
  id: {
    byline: 'Advokat Wei Tseng', relatedTopics: 'Lihat juga', previous: '← Artikel sebelumnya', next: 'Artikel berikutnya →',
    consultingAttorney: 'Advokat untuk konsultasi',
    tableScrollHint: 'Jika tabel lebih lebar dari layar, geser ke samping untuk melihat seluruhnya.',
    contents: 'Daftar isi',
  },
  th: {
    byline: 'ทนายความ Wei Tseng', relatedTopics: 'ดูเพิ่มเติม', previous: '← บทความก่อนหน้า', next: 'บทความถัดไป →',
    consultingAttorney: 'ทนายความผู้ให้คำปรึกษา',
    tableScrollHint: 'หากตารางกว้างกว่าหน้าจอ ให้เลื่อนในแนวนอนเพื่อดูส่วนที่เหลือ',
    contents: 'สารบัญ',
  },
  de: {
    byline: 'Rechtsanwältin Wei Tseng', relatedTopics: 'Siehe auch', previous: '← Vorheriger Beitrag', next: 'Nächster Beitrag →',
    consultingAttorney: 'Rechtsanwältin für Beratungen',
    tableScrollHint: 'Ist die Tabelle breiter als der Bildschirm, lässt sie sich seitlich scrollen.',
    contents: 'Inhalt',
  },
  es: {
    byline: 'Abogada Wei Tseng', relatedTopics: 'Véase también', previous: '← Artículo anterior', next: 'Artículo siguiente →',
    consultingAttorney: 'Abogada para consultas',
    tableScrollHint: 'Si la tabla es más ancha que la pantalla, desplácela en horizontal.',
    contents: 'Índice',
  },
  fr: {
    byline: 'Avocate Wei Tseng', relatedTopics: 'Voir aussi', previous: '← Article précédent', next: 'Article suivant →',
    consultingAttorney: 'Avocate pour les consultations',
    tableScrollHint: 'Si le tableau dépasse la largeur de l’écran, faites-le défiler horizontalement.',
    contents: 'Sommaire',
  },
  it: {
    byline: 'Avvocata Wei Tseng', relatedTopics: 'Vedi anche', previous: '← Articolo precedente', next: 'Articolo successivo →',
    consultingAttorney: 'Avvocata per le consulenze',
    tableScrollHint: 'Se la tabella è più larga dello schermo, si può scorrere in orizzontale.',
    contents: 'Indice',
  },
  pt: {
    byline: 'Advogada Wei Tseng', relatedTopics: 'Ver também', previous: '← Artigo anterior', next: 'Artigo seguinte →',
    consultingAttorney: 'Advogada para consultas',
    tableScrollHint: 'Se a tabela for mais larga do que o ecrã, deslize-a na horizontal.',
    contents: 'Índice',
  },
  nl: {
    byline: 'Advocaat Wei Tseng', relatedTopics: 'Zie ook', previous: '← Vorig artikel', next: 'Volgend artikel →',
    consultingAttorney: 'Advocaat voor consultaties',
    tableScrollHint: 'Is de tabel breder dan het scherm, scroll dan horizontaal.',
    contents: 'Inhoud',
  },
  pl: {
    byline: 'Adwokatka Wei Tseng', relatedTopics: 'Zobacz też', previous: '← Poprzedni artykuł', next: 'Następny artykuł →',
    consultingAttorney: 'Adwokatka do konsultacji',
    tableScrollHint: 'Jeśli tabela jest szersza niż ekran, przewiń ją w poziomie.',
    contents: 'Spis treści',
  },
  ru: {
    byline: 'Адвокат Wei Tseng', relatedTopics: 'См. также', previous: '← Предыдущий материал', next: 'Следующий материал →',
    consultingAttorney: 'Адвокат для консультаций',
    tableScrollHint: 'Если таблица шире экрана, прокрутите её по горизонтали.',
    contents: 'Содержание',
  },
  uk: {
    byline: 'Адвокатка Wei Tseng', relatedTopics: 'Див. також', previous: '← Попередня стаття', next: 'Наступна стаття →',
    consultingAttorney: 'Адвокатка для консультацій',
    tableScrollHint: 'Якщо таблиця ширша за екран, прокрутіть її по горизонталі.',
    contents: 'Зміст',
  },
  el: {
    byline: 'Δικηγόρος Wei Tseng', relatedTopics: 'Δείτε επίσης', previous: '← Προηγούμενο άρθρο', next: 'Επόμενο άρθρο →',
    consultingAttorney: 'Δικηγόρος για συμβουλευτική',
    tableScrollHint: 'Αν ο πίνακας είναι πλατύτερος από την οθόνη, κάντε κύλιση οριζόντια.',
    contents: 'Περιεχόμενα',
  },
  sv: {
    byline: 'Advokat Wei Tseng', relatedTopics: 'Se även', previous: '← Föregående artikel', next: 'Nästa artikel →',
    consultingAttorney: 'Advokat för rådgivning',
    tableScrollHint: 'Om tabellen är bredare än skärmen kan du rulla i sidled.',
    contents: 'Innehåll',
  },
  da: {
    byline: 'Advokat Wei Tseng', relatedTopics: 'Se også', previous: '← Forrige artikel', next: 'Næste artikel →',
    consultingAttorney: 'Advokat til rådgivning',
    tableScrollHint: 'Hvis tabellen er bredere end skærmen, kan du rulle vandret.',
    contents: 'Indhold',
  },
  nb: {
    byline: 'Advokat Wei Tseng', relatedTopics: 'Se også', previous: '← Forrige artikkel', next: 'Neste artikkel →',
    consultingAttorney: 'Advokat for rådgivning',
    tableScrollHint: 'Hvis tabellen er bredere enn skjermen, kan du rulle sidelengs.',
    contents: 'Innhold',
  },
  fi: {
    byline: 'Asianajaja Wei Tseng', relatedTopics: 'Katso myös', previous: '← Edellinen artikkeli', next: 'Seuraava artikkeli →',
    consultingAttorney: 'Neuvontaa antava asianajaja',
    tableScrollHint: 'Jos taulukko on näyttöä leveämpi, vieritä sitä vaakasuunnassa.',
    contents: 'Sisällys',
  },
  cs: {
    byline: 'Advokátka Wei Tseng', relatedTopics: 'Viz také', previous: '← Předchozí článek', next: 'Další článek →',
    consultingAttorney: 'Advokátka pro konzultace',
    tableScrollHint: 'Pokud je tabulka širší než obrazovka, posuňte ji vodorovně.',
    contents: 'Obsah',
  },
  hu: {
    byline: 'Wei Tseng ügyvédnő', relatedTopics: 'Lásd még', previous: '← Előző cikk', next: 'Következő cikk →',
    consultingAttorney: 'Tanácsadó ügyvédnő',
    tableScrollHint: 'Ha a táblázat szélesebb a képernyőnél, görgesse vízszintesen.',
    contents: 'Tartalom',
  },
  ro: {
    byline: 'Avocata Wei Tseng', relatedTopics: 'Vedeți și', previous: '← Articolul anterior', next: 'Articolul următor →',
    consultingAttorney: 'Avocata pentru consultanță',
    tableScrollHint: 'Dacă tabelul este mai lat decât ecranul, derulați-l pe orizontală.',
    contents: 'Cuprins',
  },
  sk: {
    byline: 'Advokátka Wei Tseng', relatedTopics: 'Pozri aj', previous: '← Predchádzajúci príspevok', next: 'Nasledujúci príspevok →',
    consultingAttorney: 'Advokátka pre konzultácie',
    tableScrollHint: 'Ak je tabuľka širšia ako obrazovka, posuňte ju vodorovne.',
    contents: 'Obsah',
  },
  bg: {
    byline: 'Адвокатка Wei Tseng', relatedTopics: 'Вижте също', previous: '← Предишна статия', next: 'Следваща статия →',
    consultingAttorney: 'Адвокатка за консултации',
    tableScrollHint: 'Ако таблицата е по-широка от екрана, превъртете я хоризонтално.',
    contents: 'Съдържание',
  },
  hr: {
    byline: 'Odvjetnica Wei Tseng', relatedTopics: 'Vidi također', previous: '← Prethodni članak', next: 'Sljedeći članak →',
    consultingAttorney: 'Odvjetnica za savjetovanje',
    tableScrollHint: 'Ako je tablica šira od zaslona, pomaknite je vodoravno.',
    contents: 'Sadržaj',
  },
  sr: {
    byline: 'Advokatkinja Wei Tseng', relatedTopics: 'Pogledajte i', previous: '← Prethodni članak', next: 'Sledeći članak →',
    consultingAttorney: 'Advokatkinja za konsultacije',
    tableScrollHint: 'Ako je tabela šira od ekrana, pomerite je vodoravno.',
    contents: 'Sadržaj',
  },
  sl: {
    byline: 'Odvetnica Wei Tseng', relatedTopics: 'Glej tudi', previous: '← Prejšnji članek', next: 'Naslednji članek →',
    consultingAttorney: 'Odvetnica za posvete',
    tableScrollHint: 'Če je tabela širša od zaslona, se po njej pomaknite vodoravno.',
    contents: 'Vsebina',
  },
  lt: {
    byline: 'Advokatė Wei Tseng', relatedTopics: 'Taip pat skaitykite', previous: '← Ankstesnis straipsnis', next: 'Kitas straipsnis →',
    consultingAttorney: 'Konsultuojanti advokatė',
    tableScrollHint: 'Jei lentelė platesnė už ekraną, slinkite ją horizontaliai.',
    contents: 'Turinys',
  },
  lv: {
    byline: 'Advokāte Wei Tseng', relatedTopics: 'Skatīt arī', previous: '← Iepriekšējais raksts', next: 'Nākamais raksts →',
    consultingAttorney: 'Konsultējošā advokāte',
    tableScrollHint: 'Ja tabula ir platāka par ekrānu, ritiniet to horizontāli.',
    contents: 'Saturs',
  },
  et: {
    byline: 'Advokaat Wei Tseng', relatedTopics: 'Vaata ka', previous: '← Eelmine artikkel', next: 'Järgmine artikkel →',
    consultingAttorney: 'Nõustav advokaat',
    tableScrollHint: 'Kui tabel on ekraanist laiem, kerige seda horisontaalselt.',
    contents: 'Sisukord',
  },
  ca: {
    byline: 'Advocada Wei Tseng', relatedTopics: 'Vegeu també', previous: '← Article anterior', next: 'Article següent →',
    consultingAttorney: 'Advocada per a consultes',
    tableScrollHint: 'Si la taula és més ampla que la pantalla, desplaceu-la horitzontalment.',
    contents: 'Índex',
  },
  is: {
    byline: 'Wei Tseng lögmaður', relatedTopics: 'Sjá einnig', previous: '← Fyrri grein', next: 'Næsta grein →',
    consultingAttorney: 'Lögmaður sem veitir ráðgjöf',
    tableScrollHint: 'Ef taflan er breiðari en skjárinn má fletta henni til hliðar.',
    contents: 'Efnisyfirlit',
  },
};

/** "Label: value" in the page language (French puts a no-break space before the colon, as the pack does). */
export function folioLabelValue(locale: IntlDesignLocale, label: string, value: string): string {
  return `${label}${locale === 'fr' ? ' :' : ':'} ${value}`;
}

/**
 * Alt text of the home "past matter" photo (the shared English one is `HOME_RESULTS_SHARED_IMAGE_ALT`). Folio
 * hides that media band, but the image stays in the markup, so its text follows the page language too.
 */
export const folioResultsImageAlt: Record<IntlDesignLocale, string> = {
  id: 'Ruang sidang perdata modern di Taiwan yang terang dan kosong',
  th: 'ห้องพิจารณาคดีแพ่งสมัยใหม่ในไต้หวันที่สว่างและว่างเปล่า',
  de: 'Heller, leerer, moderner Zivilgerichtssaal in Taiwan',
  es: 'Sala de vistas civil moderna en Taiwán, luminosa y vacía',
  fr: 'Salle d’audience civile moderne à Taïwan, claire et vide',
  it: 'Aula civile moderna a Taiwan, luminosa e vuota',
  pt: 'Sala de audiências cível moderna em Taiwan, luminosa e vazia',
  nl: 'Lichte, lege, moderne civiele rechtszaal in Taiwan',
  pl: 'Jasna, pusta, nowoczesna sala rozpraw cywilnych na Tajwanie',
  ru: 'Светлый пустой современный зал для гражданских дел на Тайване',
  uk: 'Світла порожня сучасна зала для цивільних справ на Тайвані',
  el: 'Φωτεινή, άδεια, σύγχρονη αίθουσα πολιτικού δικαστηρίου στην Ταϊβάν',
  sv: 'Ljus, tom och modern rättssal för tvistemål i Taiwan',
  da: 'Lys, tom og moderne retssal for civile sager i Taiwan',
  nb: 'Lys, tom og moderne rettssal for sivile saker i Taiwan',
  fi: 'Valoisa, tyhjä ja moderni riita-asioiden oikeussali Taiwanissa',
  cs: 'Světlá, prázdná a moderní soudní síň pro civilní věci na Tchaj-wanu',
  hu: 'Világos, üres, modern polgári tárgyalóterem Tajvanon',
  ro: 'Sală de judecată civilă modernă din Taiwan, luminoasă și goală',
  sk: 'Svetlá, prázdna a moderná pojednávacia miestnosť pre civilné veci na Taiwane',
  bg: 'Светла, празна, модерна съдебна зала за граждански дела в Тайван',
  hr: 'Svijetla, prazna, moderna sudnica za građanske predmete na Tajvanu',
  sr: 'Svetla, prazna, moderna sudnica za građanske predmete na Tajvanu',
  sl: 'Svetla, prazna, sodobna razpravna dvorana za civilne zadeve na Tajvanu',
  lt: 'Šviesi, tuščia, moderni civilinių bylų teismo salė Taivane',
  lv: 'Gaiša, tukša, moderna civillietu tiesas zāle Taivānā',
  et: 'Valgusküllane, tühi ja moodne tsiviilasjade kohtusaal Taiwanis',
  ca: 'Sala de vistes civil moderna a Taiwan, lluminosa i buida',
  is: 'Bjartur, tómur og nútímalegur réttarsalur fyrir einkamál í Taívan',
};
