import type { IntlDesignLocale } from '@/lib/intl-design-locales';

/**
 * Column-list labels for the 29 Folio locales (review round 1): search, result count, filter chips, empty
 * states and the card byline, which were English on these pages. Kept apart from `intl-design-ui.ts` so only
 * the columns page bundle carries them. Plain interface words; the byline is the pack's own review label.
 */
export interface FolioColumnsCopy {
  label: string;
  placeholder: string;
  submit: string;
  clear: string;
  /** `{n}` is the number of matching articles; worded so no plural agreement is needed. */
  resultCount: string;
  reset: string;
  category: string;
  author: string;
  year: string;
  month: string;
  query: string;
  noMatches: string;
  noPosts: string;
  /** Card byline. Same string as the pack's `home.columnsReviewLabel` (a test keeps them equal). */
  reviewedBy: string;
}

export const folioColumnsCopy: Record<IntlDesignLocale, FolioColumnsCopy> = {
  id: {
    label: 'Cari artikel', placeholder: 'Judul, ringkasan, atau tag', submit: 'Cari', clear: 'Hapus pencarian',
    resultCount: '{n} hasil', reset: 'Hapus filter · Lihat semua artikel', category: 'Kategori', author: 'Penulis',
    year: 'Tahun', month: 'Bulan', query: 'Kata kunci',
    noMatches: 'Tidak ada artikel yang cocok dengan filter yang dipilih. Hapus filter untuk melihat semua artikel.',
    noPosts: 'Belum ada artikel yang diterbitkan.', reviewedBy: 'Ditinjau oleh Advokat Wei Tseng',
  },
  th: {
    label: 'ค้นหาบทความ', placeholder: 'ชื่อเรื่อง สรุป หรือแท็ก', submit: 'ค้นหา', clear: 'ล้างคำค้นหา',
    resultCount: 'ผลลัพธ์ {n} รายการ', reset: 'ล้างตัวกรอง · ดูบทความทั้งหมด', category: 'หมวดหมู่', author: 'ผู้เขียน',
    year: 'ปี', month: 'เดือน', query: 'คำค้นหา',
    noMatches: 'ไม่มีบทความที่ตรงกับตัวกรองที่เลือก ล้างตัวกรองเพื่อดูบทความทั้งหมด',
    noPosts: 'ยังไม่มีบทความที่เผยแพร่', reviewedBy: 'ตรวจสอบโดยทนายความ Wei Tseng',
  },
  de: {
    label: 'Beiträge durchsuchen', placeholder: 'Titel, Zusammenfassung oder Schlagwort', submit: 'Suchen', clear: 'Suche löschen',
    resultCount: 'Ergebnisse: {n}', reset: 'Filter zurücksetzen · Alle Beiträge anzeigen', category: 'Kategorie', author: 'Autor',
    year: 'Jahr', month: 'Monat', query: 'Suchbegriff',
    noMatches: 'Keine Beiträge entsprechen den gewählten Filtern. Setzen Sie die Filter zurück, um alle Beiträge zu sehen.',
    noPosts: 'Es wurden noch keine Beiträge veröffentlicht.', reviewedBy: 'Geprüft von Rechtsanwältin Wei Tseng',
  },
  es: {
    label: 'Buscar artículos', placeholder: 'Título, resumen o etiqueta', submit: 'Buscar', clear: 'Borrar la búsqueda',
    resultCount: 'Resultados: {n}', reset: 'Quitar filtros · Ver todos los artículos', category: 'Categoría', author: 'Autor',
    year: 'Año', month: 'Mes', query: 'Búsqueda',
    noMatches: 'Ningún artículo coincide con los filtros seleccionados. Quite los filtros para ver todos los artículos.',
    noPosts: 'Todavía no hay artículos publicados.', reviewedBy: 'Revisado por la abogada Wei Tseng',
  },
  fr: {
    label: 'Rechercher un article', placeholder: 'Titre, résumé ou mot-clé', submit: 'Rechercher', clear: 'Effacer la recherche',
    resultCount: 'Résultats : {n}', reset: 'Effacer les filtres · Voir tous les articles', category: 'Catégorie', author: 'Auteur',
    year: 'Année', month: 'Mois', query: 'Recherche',
    noMatches: 'Aucun article ne correspond aux filtres choisis. Effacez les filtres pour voir tous les articles.',
    noPosts: 'Aucun article n’a encore été publié.', reviewedBy: 'Révisé par l’avocate Wei Tseng',
  },
  it: {
    label: 'Cerca negli articoli', placeholder: 'Titolo, sintesi o etichetta', submit: 'Cerca', clear: 'Cancella la ricerca',
    resultCount: 'Risultati: {n}', reset: 'Rimuovi i filtri · Tutti gli articoli', category: 'Categoria', author: 'Autore',
    year: 'Anno', month: 'Mese', query: 'Ricerca',
    noMatches: 'Nessun articolo corrisponde ai filtri selezionati. Rimuovendo i filtri si vedono tutti gli articoli.',
    noPosts: 'Non ci sono ancora articoli pubblicati.', reviewedBy: 'Verificato dall’avvocata Wei Tseng',
  },
  pt: {
    label: 'Pesquisar artigos', placeholder: 'Título, resumo ou etiqueta', submit: 'Pesquisar', clear: 'Limpar a pesquisa',
    resultCount: 'Resultados: {n}', reset: 'Limpar filtros · Ver todos os artigos', category: 'Categoria', author: 'Autor',
    year: 'Ano', month: 'Mês', query: 'Pesquisa',
    noMatches: 'Nenhum artigo corresponde aos filtros selecionados. Limpe os filtros para ver todos os artigos.',
    noPosts: 'Ainda não há artigos publicados.', reviewedBy: 'Revisto pela advogada Wei Tseng',
  },
  nl: {
    label: 'Artikelen doorzoeken', placeholder: 'Titel, samenvatting of label', submit: 'Zoeken', clear: 'Zoekopdracht wissen',
    resultCount: 'Resultaten: {n}', reset: 'Filters wissen · Alle artikelen bekijken', category: 'Categorie', author: 'Auteur',
    year: 'Jaar', month: 'Maand', query: 'Zoekterm',
    noMatches: 'Geen artikelen voldoen aan de gekozen filters. Wis de filters om alle artikelen te zien.',
    noPosts: 'Er zijn nog geen artikelen gepubliceerd.', reviewedBy: 'Beoordeeld door advocaat Wei Tseng',
  },
  pl: {
    label: 'Szukaj w artykułach', placeholder: 'Tytuł, streszczenie lub tag', submit: 'Szukaj', clear: 'Wyczyść wyszukiwanie',
    resultCount: 'Wyniki: {n}', reset: 'Wyczyść filtry · Pokaż wszystkie artykuły', category: 'Kategoria', author: 'Autor',
    year: 'Rok', month: 'Miesiąc', query: 'Wyszukiwana fraza',
    noMatches: 'Żaden artykuł nie pasuje do wybranych filtrów. Wyczyść filtry, aby zobaczyć wszystkie artykuły.',
    noPosts: 'Nie opublikowano jeszcze żadnych artykułów.', reviewedBy: 'Sprawdziła adwokatka Wei Tseng',
  },
  ru: {
    label: 'Поиск по материалам', placeholder: 'Заголовок, краткое содержание или тег', submit: 'Найти', clear: 'Очистить поиск',
    resultCount: 'Результаты: {n}', reset: 'Сбросить фильтры · Показать все материалы', category: 'Категория', author: 'Автор',
    year: 'Год', month: 'Месяц', query: 'Запрос',
    noMatches: 'Нет материалов, соответствующих выбранным фильтрам. Сбросьте фильтры, чтобы увидеть все материалы.',
    noPosts: 'Материалы пока не опубликованы.', reviewedBy: 'Проверено адвокатом Wei Tseng (曾雋崴)',
  },
  uk: {
    label: 'Пошук статей', placeholder: 'Назва, короткий зміст або тег', submit: 'Шукати', clear: 'Очистити пошук',
    resultCount: 'Результати: {n}', reset: 'Скинути фільтри · Показати всі статті', category: 'Категорія', author: 'Автор',
    year: 'Рік', month: 'Місяць', query: 'Запит',
    noMatches: 'Жодна стаття не відповідає вибраним фільтрам. Скиньте фільтри, щоб побачити всі статті.',
    noPosts: 'Статті ще не опубліковано.', reviewedBy: 'Перевірила адвокатка Wei Tseng',
  },
  el: {
    label: 'Αναζήτηση άρθρων', placeholder: 'Τίτλος, περίληψη ή ετικέτα', submit: 'Αναζήτηση', clear: 'Απαλοιφή αναζήτησης',
    resultCount: 'Αποτελέσματα: {n}', reset: 'Κατάργηση φίλτρων · Όλα τα άρθρα', category: 'Κατηγορία', author: 'Συντάκτης',
    year: 'Έτος', month: 'Μήνας', query: 'Όρος αναζήτησης',
    noMatches: 'Κανένα άρθρο δεν αντιστοιχεί στα επιλεγμένα φίλτρα. Καταργήστε τα φίλτρα για να δείτε όλα τα άρθρα.',
    noPosts: 'Δεν έχουν δημοσιευτεί ακόμη άρθρα.', reviewedBy: 'Ελέγχθηκε από τη δικηγόρο Wei Tseng',
  },
  sv: {
    label: 'Sök bland artiklarna', placeholder: 'Rubrik, sammanfattning eller tagg', submit: 'Sök', clear: 'Rensa sökningen',
    resultCount: 'Resultat: {n}', reset: 'Rensa filter · Visa alla artiklar', category: 'Kategori', author: 'Författare',
    year: 'År', month: 'Månad', query: 'Sökord',
    noMatches: 'Inga artiklar matchar de valda filtren. Rensa filtren för att se alla artiklar.',
    noPosts: 'Inga artiklar har publicerats ännu.', reviewedBy: 'Granskad av advokat Wei Tseng',
  },
  da: {
    label: 'Søg i artiklerne', placeholder: 'Titel, resumé eller tag', submit: 'Søg', clear: 'Ryd søgningen',
    resultCount: 'Resultater: {n}', reset: 'Nulstil filtre · Vis alle artikler', category: 'Kategori', author: 'Forfatter',
    year: 'År', month: 'Måned', query: 'Søgeord',
    noMatches: 'Ingen artikler matcher de valgte filtre. Nulstil filtrene for at se alle artikler.',
    noPosts: 'Der er endnu ikke offentliggjort nogen artikler.', reviewedBy: 'Gennemgået af advokat Wei Tseng',
  },
  nb: {
    label: 'Søk i artiklene', placeholder: 'Tittel, sammendrag eller stikkord', submit: 'Søk', clear: 'Tøm søket',
    resultCount: 'Resultater: {n}', reset: 'Nullstill filtre · Vis alle artikler', category: 'Kategori', author: 'Forfatter',
    year: 'År', month: 'Måned', query: 'Søkeord',
    noMatches: 'Ingen artikler samsvarer med de valgte filtrene. Nullstill filtrene for å se alle artikler.',
    noPosts: 'Ingen artikler er publisert ennå.', reviewedBy: 'Vurdert av advokat Wei Tseng',
  },
  fi: {
    label: 'Hae artikkeleista', placeholder: 'Otsikko, tiivistelmä tai tunniste', submit: 'Hae', clear: 'Tyhjennä haku',
    resultCount: 'Tuloksia: {n}', reset: 'Tyhjennä suodattimet · Näytä kaikki artikkelit', category: 'Luokka', author: 'Kirjoittaja',
    year: 'Vuosi', month: 'Kuukausi', query: 'Hakusana',
    noMatches: 'Valittuja suodattimia vastaavia artikkeleita ei löytynyt. Tyhjennä suodattimet, niin näet kaikki artikkelit.',
    noPosts: 'Artikkeleita ei ole vielä julkaistu.', reviewedBy: 'Tarkistanut asianajaja Wei Tseng',
  },
  cs: {
    label: 'Hledat v článcích', placeholder: 'Název, shrnutí nebo štítek', submit: 'Hledat', clear: 'Vymazat hledání',
    resultCount: 'Výsledky: {n}', reset: 'Zrušit filtry · Zobrazit všechny články', category: 'Kategorie', author: 'Autor',
    year: 'Rok', month: 'Měsíc', query: 'Hledaný výraz',
    noMatches: 'Zvoleným filtrům neodpovídá žádný článek. Po zrušení filtrů uvidíte všechny články.',
    noPosts: 'Zatím nebyly zveřejněny žádné články.', reviewedBy: 'Posoudila advokátka Wei Tseng',
  },
  hu: {
    label: 'Keresés a cikkekben', placeholder: 'Cím, összefoglaló vagy címke', submit: 'Keresés', clear: 'Keresés törlése',
    resultCount: '{n} találat', reset: 'Szűrők törlése · Az összes cikk', category: 'Kategória', author: 'Szerző',
    year: 'Év', month: 'Hónap', query: 'Keresett kifejezés',
    noMatches: 'A kiválasztott szűrőknek egyetlen cikk sem felel meg. A szűrők törlésével az összes cikk megjelenik.',
    noPosts: 'Még nincs közzétett cikk.', reviewedBy: 'Ellenőrizte Wei Tseng ügyvédnő',
  },
  ro: {
    label: 'Căutați în articole', placeholder: 'Titlu, rezumat sau etichetă', submit: 'Căutați', clear: 'Ștergeți căutarea',
    resultCount: 'Rezultate: {n}', reset: 'Ștergeți filtrele · Toate articolele', category: 'Categorie', author: 'Autor',
    year: 'An', month: 'Lună', query: 'Termen căutat',
    noMatches: 'Niciun articol nu corespunde filtrelor alese. Ștergeți filtrele pentru a vedea toate articolele.',
    noPosts: 'Nu a fost publicat încă niciun articol.', reviewedBy: 'Verificat de avocata Wei Tseng',
  },
  sk: {
    label: 'Hľadať v príspevkoch', placeholder: 'Názov, zhrnutie alebo štítok', submit: 'Hľadať', clear: 'Vymazať hľadanie',
    resultCount: 'Výsledky: {n}', reset: 'Zrušiť filtre · Zobraziť všetky príspevky', category: 'Kategória', author: 'Autor',
    year: 'Rok', month: 'Mesiac', query: 'Hľadaný výraz',
    noMatches: 'Zvoleným filtrom nezodpovedá žiadny príspevok. Po zrušení filtrov uvidíte všetky príspevky.',
    noPosts: 'Zatiaľ neboli uverejnené žiadne príspevky.', reviewedBy: 'Posúdila advokátka Wei Tseng',
  },
  bg: {
    label: 'Търсене в статиите', placeholder: 'Заглавие, резюме или етикет', submit: 'Търсене', clear: 'Изчистване на търсенето',
    resultCount: 'Резултати: {n}', reset: 'Изчистване на филтрите · Всички статии', category: 'Категория', author: 'Автор',
    year: 'Година', month: 'Месец', query: 'Търсен израз',
    noMatches: 'Няма статии, които да отговарят на избраните филтри. Изчистете филтрите, за да видите всички статии.',
    noPosts: 'Все още няма публикувани статии.', reviewedBy: 'Проверено от адвокатка Wei Tseng (曾雋崴)',
  },
  hr: {
    label: 'Pretraži članke', placeholder: 'Naslov, sažetak ili oznaka', submit: 'Pretraži', clear: 'Očisti pretraživanje',
    resultCount: 'Rezultati: {n}', reset: 'Poništi filtre · Prikaži sve članke', category: 'Kategorija', author: 'Autor',
    year: 'Godina', month: 'Mjesec', query: 'Traženi pojam',
    noMatches: 'Nijedan članak ne odgovara odabranim filtrima. Poništite filtre da biste vidjeli sve članke.',
    noPosts: 'Još nema objavljenih članaka.', reviewedBy: 'Pregledala odvjetnica Wei Tseng',
  },
  sr: {
    label: 'Pretraga članaka', placeholder: 'Naslov, rezime ili oznaka', submit: 'Pretraži', clear: 'Obriši pretragu',
    resultCount: 'Rezultati: {n}', reset: 'Poništi filtere · Prikaži sve članke', category: 'Kategorija', author: 'Autor',
    year: 'Godina', month: 'Mesec', query: 'Pojam za pretragu',
    noMatches: 'Nijedan članak ne odgovara izabranim filterima. Poništite filtere da biste videli sve članke.',
    noPosts: 'Još nema objavljenih članaka.', reviewedBy: 'Pregledala advokatkinja Wei Tseng',
  },
  sl: {
    label: 'Iskanje po člankih', placeholder: 'Naslov, povzetek ali oznaka', submit: 'Išči', clear: 'Počisti iskanje',
    resultCount: 'Rezultati: {n}', reset: 'Počisti filtre · Prikaži vse članke', category: 'Kategorija', author: 'Avtor',
    year: 'Leto', month: 'Mesec', query: 'Iskalni niz',
    noMatches: 'Izbranim filtrom ne ustreza noben članek. Počistite filtre, da vidite vse članke.',
    noPosts: 'Objavljenih člankov še ni.', reviewedBy: 'Pregledala odvetnica Wei Tseng',
  },
  lt: {
    label: 'Ieškoti straipsnių', placeholder: 'Pavadinimas, santrauka arba žyma', submit: 'Ieškoti', clear: 'Išvalyti paiešką',
    resultCount: 'Rezultatai: {n}', reset: 'Išvalyti filtrus · Rodyti visus straipsnius', category: 'Kategorija', author: 'Autorius',
    year: 'Metai', month: 'Mėnuo', query: 'Paieškos žodis',
    noMatches: 'Pasirinktus filtrus atitinkančių straipsnių nėra. Išvalykite filtrus, kad matytumėte visus straipsnius.',
    noPosts: 'Straipsnių dar nepaskelbta.', reviewedBy: 'Įvertino advokatė Wei Tseng',
  },
  lv: {
    label: 'Meklēt rakstos', placeholder: 'Virsraksts, kopsavilkums vai birka', submit: 'Meklēt', clear: 'Notīrīt meklēšanu',
    resultCount: 'Rezultāti: {n}', reset: 'Notīrīt filtrus · Rādīt visus rakstus', category: 'Kategorija', author: 'Autors',
    year: 'Gads', month: 'Mēnesis', query: 'Meklētais vārds',
    noMatches: 'Izvēlētajiem filtriem neatbilst neviens raksts. Notīriet filtrus, lai redzētu visus rakstus.',
    noPosts: 'Raksti vēl nav publicēti.', reviewedBy: 'Pārbaudījusi advokāte Wei Tseng',
  },
  et: {
    label: 'Otsi artiklitest', placeholder: 'Pealkiri, kokkuvõte või silt', submit: 'Otsi', clear: 'Tühjenda otsing',
    resultCount: 'Tulemused: {n}', reset: 'Tühjenda filtrid · Näita kõiki artikleid', category: 'Kategooria', author: 'Autor',
    year: 'Aasta', month: 'Kuu', query: 'Otsingusõna',
    noMatches: 'Valitud filtritele ei vasta ükski artikkel. Tühjendage filtrid, et näha kõiki artikleid.',
    noPosts: 'Artikleid pole veel avaldatud.', reviewedBy: 'Läbi vaadanud advokaat Wei Tseng',
  },
  ca: {
    label: 'Cerca als articles', placeholder: 'Títol, resum o etiqueta', submit: 'Cerca', clear: 'Esborra la cerca',
    resultCount: 'Resultats: {n}', reset: 'Treu els filtres · Mostra tots els articles', category: 'Categoria', author: 'Autor',
    year: 'Any', month: 'Mes', query: 'Cerca',
    noMatches: 'Cap article no coincideix amb els filtres seleccionats. Tregui els filtres per veure tots els articles.',
    noPosts: 'Encara no s’ha publicat cap article.', reviewedBy: 'Revisat per l’advocada Wei Tseng',
  },
  is: {
    label: 'Leita í greinum', placeholder: 'Titill, samantekt eða merki', submit: 'Leita', clear: 'Hreinsa leit',
    resultCount: 'Niðurstöður: {n}', reset: 'Hreinsa síur · Sýna allar greinar', category: 'Flokkur', author: 'Höfundur',
    year: 'Ár', month: 'Mánuður', query: 'Leitarorð',
    noMatches: 'Engar greinar samsvara völdum síum. Hreinsaðu síurnar til að sjá allar greinar.',
    noPosts: 'Engar greinar hafa verið birtar enn.', reviewedBy: 'Yfirfarið af lögmanninum Wei Tseng',
  },
};
