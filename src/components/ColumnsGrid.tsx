'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  isExistingSiteLocale4,
  isGuidanceLocale4,
  type GuidanceLocale4,
  type PublicLocale8,
} from '@/lib/public-guidance';
import styles from './ColumnsGrid.module.css';

const searchCopy = {
  ko: {
    label: '칼럼 검색',
    placeholder: '제목, 요약, 태그로 검색',
    submit: '검색',
    clear: '검색 지우기',
    resultCount: (n: number) => `${n}개 결과`,
    reset: '필터 초기화 · 모든 칼럼 보기',
    category: '카테고리',
    author: '작성자',
    year: '연도',
    month: '월',
    query: '검색어',
    noMatches: '선택한 조건에 맞는 칼럼이 없습니다. 필터를 초기화하면 모든 칼럼을 볼 수 있습니다.',
    noPosts: '아직 게시된 칼럼이 없습니다.',
  },
  'zh-hant': {
    label: '搜尋專欄',
    placeholder: '依標題、摘要或標籤搜尋',
    submit: '搜尋',
    clear: '清除搜尋',
    resultCount: (n: number) => `${n} 篇結果`,
    reset: '清除篩選 · 查看所有專欄',
    category: '分類',
    author: '作者',
    year: '年份',
    month: '月份',
    query: '關鍵字',
    noMatches: '沒有符合目前條件的專欄。清除篩選即可查看所有專欄。',
    noPosts: '目前尚無已發布的專欄。',
  },
  en: {
    label: 'Search columns',
    placeholder: 'Search title, summary or tag',
    submit: 'Search',
    clear: 'Clear search',
    resultCount: (n: number) => `${n} result${n === 1 ? '' : 's'}`,
    reset: 'Clear filters · View all columns',
    category: 'Category',
    author: 'Author',
    year: 'Year',
    month: 'Month',
    query: 'Search',
    noMatches: 'No columns match the selected filters. Clear filters to view all columns.',
    noPosts: 'No columns have been published yet.',
  },
  ja: {
    label: 'コラム検索',
    placeholder: 'タイトル・要約・タグで検索',
    submit: '検索',
    clear: '検索をクリア',
    resultCount: (n: number) => `${n}件`,
    reset: '絞り込みを解除 · すべてのコラムを見る',
    category: 'カテゴリー',
    author: '著者',
    year: '年',
    month: '月',
    query: '検索語',
    noMatches: '選択した条件に一致するコラムはありません。絞り込みを解除すると、すべてのコラムをご覧いただけます。',
    noPosts: '公開済みのコラムはまだありません。',
  },
} as const;

type ColumnCategory = 'formation' | 'legal' | 'case';

export interface ColumnListItem {
  slug: string;
  title: string;
  date: string;
  dateDisplay: string;
  readTime: string;
  category: ColumnCategory;
  categoryLabel: string;
  blogCategory?: string;
  authorName?: string;
  tags?: string[];
  featuredImage: string;
  summary: string;
}

export interface ColumnsGridFilters {
  category?: string;
  author?: string;
  q?: string;
  year?: string;
  month?: string;
}

const categoryLabels = {
  ko: { all: '전체', formation: '법인설립', legal: '법률정보', case: '소송사례' },
  'zh-hant': { all: '全部', formation: '公司設立', legal: '法律資訊', case: '訴訟案例' },
  en: { all: 'All', formation: 'Company Setup', legal: 'Legal Info', case: 'Case Studies' },
  ja: { all: 'すべて', formation: '台湾会社設立', legal: '台湾法律情報', case: '訴訟事例分析' },
} as const;

/**
 * "All" word already present in reviewed `viewAllLabel` copy
 * (`src/data/international-guidance-content.ts`: vi 'Xem tất cả', id 'Lihat semua',
 * th 'ดูทั้งหมด', fil 'Tingnan lahat', ar 'عرض الكل'). This client file cannot
 * import `guidanceColumnCategoryLabel` from `src/lib/columns.ts` (`fs`).
 */
const GUIDANCE_FILTER_ALL_LABEL: Record<GuidanceLocale4, string> = {
  vi: 'Tất cả',
  id: 'Semua',
  th: 'ทั้งหมด',
  fil: 'Lahat',
  ar: 'الكل',
  de: 'Alle',
  es: 'Todo',
  fr: 'Tout',
  pt: 'Tudo',
  'zh-hans': '全部',
  ms: 'Semua',
  ru: 'Все',
  tr: 'Tümü',
  it: 'Tutti',
  nl: 'Alles',
  pl: 'Wszystkie',
  hi: 'सभी',
  sv: 'Alla',
  da: 'Alle',
  nb: 'Alle',
  fi: 'Kaikki',
  cs: 'Vše',
  hu: 'Összes',
  ro: 'Toate',
  uk: 'Все',
  el: 'Όλα',
  he: 'הכול',
  bn: 'सभी', // SCAFFOLD(hi)
  ur: 'الكل', // SCAFFOLD(ar)
  fa: 'الكل', // SCAFFOLD(ar)
  my: 'ทั้งหมด', // SCAFFOLD(th)
  ta: 'सभी', // SCAFFOLD(hi)
  ne: 'सभी', // SCAFFOLD(hi)
  km: 'ทั้งหมด', // SCAFFOLD(th)
  mn: 'Все', // SCAFFOLD(ru)
  sk: 'Vše', // SCAFFOLD(cs)
  bg: 'Все', // SCAFFOLD(ru)
  hr: 'Vše', // SCAFFOLD(cs)
  sr: 'Vše', // SCAFFOLD(cs)
  sl: 'Vse',
  lt: 'Visus',
  lv: 'Vše', // SCAFFOLD(cs)
  et: 'Vše', // SCAFFOLD(cs)
  ca: 'Vše', // SCAFFOLD(cs)
  is: 'Vše', // SCAFFOLD(cs)
};

/** Same strings `guidanceColumnCategoryLabel` returns in `src/lib/columns.ts`. */
const GUIDANCE_FILTER_CATEGORY_LABEL: Record<GuidanceLocale4, Record<ColumnCategory, string>> = {
  vi: {
    formation: 'Thành lập công ty tại Đài Loan',
    legal: 'Thông tin pháp luật Đài Loan',
    case: 'Phân tích vụ án tố tụng',
  },
  id: {
    formation: 'Pendirian Perusahaan di Taiwan',
    legal: 'Informasi Hukum Taiwan',
    case: 'Analisis Kasus Litigasi',
  },
  th: {
    formation: 'การจัดตั้งบริษัทในไต้หวัน',
    legal: 'ข้อมูลกฎหมายไต้หวัน',
    case: 'การวิเคราะห์คดีตัวอย่าง',
  },
  fil: {
    formation: 'Pagtatatag ng Kompanya sa Taiwan',
    legal: 'Impormasyong Legal sa Taiwan',
    case: 'Pagsusuri ng Kaso sa Paglilitis',
  },
  ar: {
    formation: 'تأسيس الشركات',
    legal: 'معلومات قانونية',
    case: 'دراسات قضايا',
  },
  de: {
    formation: 'Gesellschaftsgründung in Taiwan',
    legal: 'Rechtliche Informationen zu Taiwan',
    case: 'Fallanalyse',
  },
  es: {
    formation: 'Constitución de sociedades en Taiwán',
    legal: 'Información jurídica de Taiwán',
    case: 'Análisis de casos',
  },
  fr: {
    formation: 'Création de société à Taïwan',
    legal: 'Informations juridiques sur Taïwan',
    case: 'Analyse de cas',
  },
  pt: {
    formation: 'Constituição de sociedades em Taiwan',
    legal: 'Informações jurídicas sobre Taiwan',
    case: 'Análise de casos',
  },
  'zh-hans': {
    formation: '在台湾设立公司',
    legal: '台湾法律信息',
    case: '案例分析',
  },
  ms: {
    formation: 'Penubuhan syarikat di Taiwan',
    legal: 'Maklumat undang-undang Taiwan',
    case: 'Analisis kes',
  },
  ru: {
    formation: 'Учреждение компании на Тайване',
    legal: 'Правовая информация о Тайване',
    case: 'Анализ дел',
  },
  tr: {
    formation: 'Tayvan’da şirket kuruluşu',
    legal: 'Tayvan hukuku bilgileri',
    case: 'Vaka analizi',
  },
  it: {
    formation: 'Costituzione di società a Taiwan',
    legal: 'Informazioni giuridiche su Taiwan',
    case: 'Analisi di casi',
  },
  nl: {
    formation: 'Oprichting van een vennootschap in Taiwan',
    legal: 'Juridische informatie over Taiwan',
    case: 'Casusanalyse',
  },
  pl: {
    formation: 'Zakładanie spółki na Tajwanie',
    legal: 'Informacje prawne o Tajwanie',
    case: 'Analiza spraw',
  },
  hi: {
    formation: 'ताइवान में कंपनी स्थापना',
    legal: 'ताइवान कानूनी जानकारी',
    case: 'मामला विश्लेषण',
  },
  sv: {
    formation: 'Bolagsbildning i Taiwan',
    legal: 'Juridisk information om Taiwan',
    case: 'Fallanalys',
  },
  da: {
    formation: 'Selskabsstiftelse i Taiwan',
    legal: 'Juridisk information om Taiwan',
    case: 'Sagsanalyse',
  },
  nb: {
    formation: 'Selskapsstiftelse i Taiwan',
    legal: 'Juridisk informasjon om Taiwan',
    case: 'Saksanalyse',
  },
  fi: {
    formation: 'Yhtiön perustaminen Taiwanissa',
    legal: 'Oikeudellista tietoa Taiwanista',
    case: 'Tapausanalyysi',
  },
  cs: {
    formation: 'Zakládání společností na Tchaj-wanu',
    legal: 'Právní informace o Tchaj-wanu',
    case: 'Rozbor případu',
  },
  hu: {
    formation: 'Cégalapítás Tajvanon',
    legal: 'Tajvani jogi tájékoztatás',
    case: 'Esetelemzés',
  },
  ro: {
    formation: 'Înființare de societăți în Taiwan',
    legal: 'Informații juridice despre Taiwan',
    case: 'Analiză de caz',
  },
  uk: {
    formation: 'Створення товариств на Тайвані',
    legal: 'Правова інформація про Тайвань',
    case: 'Розбір справи',
  },
  el: {
    formation: 'Σύσταση εταιρειών στην Ταϊβάν',
    legal: 'Νομικές πληροφορίες για την Ταϊβάν',
    case: 'Ανάλυση υπόθεσης',
  },
  he: {
    formation: 'הקמת חברות בטאיוואן',
    legal: 'מידע משפטי על טאיוואן',
    case: 'ניתוח מקרה',
  },
  bn: { // SCAFFOLD(hi)
    formation: 'ताइवान में कंपनी स्थापना',
    legal: 'ताइवान कानूनी जानकारी',
    case: 'मामला विश्लेषण',
  },
  ur: { // SCAFFOLD(ar)
    formation: 'تأسيس الشركات',
    legal: 'معلومات قانونية',
    case: 'دراسات قضايا',
  },
  fa: { // SCAFFOLD(ar)
    formation: 'تأسيس الشركات',
    legal: 'معلومات قانونية',
    case: 'دراسات قضايا',
  },
  my: { // SCAFFOLD(th)
    formation: 'การจัดตั้งบริษัทในไต้หวัน',
    legal: 'ข้อมูลกฎหมายไต้หวัน',
    case: 'การวิเคราะห์คดีตัวอย่าง',
  },
  ta: { // SCAFFOLD(hi)
    formation: 'ताइवान में कंपनी स्थापना',
    legal: 'ताइवान कानूनी जानकारी',
    case: 'मामला विश्लेषण',
  },
  ne: { // SCAFFOLD(hi)
    formation: 'ताइवान में कंपनी स्थापना',
    legal: 'ताइवान कानूनी जानकारी',
    case: 'मामला विश्लेषण',
  },
  km: { // SCAFFOLD(th)
    formation: 'การจัดตั้งบริษัทในไต้หวัน',
    legal: 'ข้อมูลกฎหมายไต้หวัน',
    case: 'การวิเคราะห์คดีตัวอย่าง',
  },
  mn: { // SCAFFOLD(ru)
    formation: 'Учреждение компании на Тайване',
    legal: 'Правовая информация о Тайване',
    case: 'Анализ дел',
  },
  sk: { // SCAFFOLD(cs)
    formation: 'Zakládání společností na Tchaj-wanu',
    legal: 'Právní informace o Tchaj-wanu',
    case: 'Rozbor případu',
  },
  bg: { // SCAFFOLD(ru)
    formation: 'Учреждение компании на Тайване',
    legal: 'Правовая информация о Тайване',
    case: 'Анализ дел',
  },
  hr: { // SCAFFOLD(cs)
    formation: 'Zakládání společností na Tchaj-wanu',
    legal: 'Právní informace o Tchaj-wanu',
    case: 'Rozbor případu',
  },
  sr: { // SCAFFOLD(cs)
    formation: 'Zakládání společností na Tchaj-wanu',
    legal: 'Právní informace o Tchaj-wanu',
    case: 'Rozbor případu',
  },
  sl: {
    formation: 'Ustanavljanje družb na Tajvanu',
    legal: 'Pravne informacije o Tajvanu',
    case: 'Razčlenitev primera',
  },
  lt: {
    formation: 'Įmonių steigimas Taivane',
    legal: 'Teisinė informacija apie Taivaną',
    case: 'Bylos analizė',
  },
  lv: { // SCAFFOLD(cs)
    formation: 'Zakládání společností na Tchaj-wanu',
    legal: 'Právní informace o Tchaj-wanu',
    case: 'Rozbor případu',
  },
  et: { // SCAFFOLD(cs)
    formation: 'Zakládání společností na Tchaj-wanu',
    legal: 'Právní informace o Tchaj-wanu',
    case: 'Rozbor případu',
  },
  ca: { // SCAFFOLD(cs)
    formation: 'Zakládání společností na Tchaj-wanu',
    legal: 'Právní informace o Tchaj-wanu',
    case: 'Rozbor případu',
  },
  is: { // SCAFFOLD(cs)
    formation: 'Zakládání společností na Tchaj-wanu',
    legal: 'Právní informace o Tchaj-wanu',
    case: 'Rozbor případu',
  },
};

/** Reviewed `home.columnsReadMoreLabel` — same CTA GuidanceHomeBody already uses. */
const GUIDANCE_CARD_READ_MORE_LABEL: Record<GuidanceLocale4, string> = {
  vi: 'Đọc tiếp',
  id: 'Baca selengkapnya',
  th: 'อ่านต่อ',
  fil: 'Basahin pa',
  ar: 'اقرأ المزيد',
  de: 'Weiterlesen',
  es: 'Seguir leyendo',
  fr: 'Lire la suite',
  pt: 'Continuar a ler',
  'zh-hans': '继续阅读',
  ms: 'Baca selanjutnya',
  ru: 'Читать далее',
  tr: 'Devamını oku',
  it: 'Continua a leggere',
  nl: 'Verder lezen',
  pl: 'Czytaj dalej',
  hi: 'आगे पढ़ें',
  sv: 'Läs vidare',
  da: 'Læs videre',
  nb: 'Les videre',
  fi: 'Lukekaa lisää',
  cs: 'Číst dál',
  hu: 'Tovább olvasom',
  ro: 'Citiți mai departe',
  uk: 'Читати далі',
  el: 'Συνέχεια ανάγνωσης',
  he: 'המשך קריאה',
  bn: 'आगे पढ़ें', // SCAFFOLD(hi)
  ur: 'اقرأ المزيد', // SCAFFOLD(ar)
  fa: 'اقرأ المزيد', // SCAFFOLD(ar)
  my: 'อ่านต่อ', // SCAFFOLD(th)
  ta: 'आगे पढ़ें', // SCAFFOLD(hi)
  ne: 'आगे पढ़ें', // SCAFFOLD(hi)
  km: 'อ่านต่อ', // SCAFFOLD(th)
  mn: 'Читать далее', // SCAFFOLD(ru)
  sk: 'Číst dál', // SCAFFOLD(cs)
  bg: 'Читать далее', // SCAFFOLD(ru)
  hr: 'Číst dál', // SCAFFOLD(cs)
  sr: 'Číst dál', // SCAFFOLD(cs)
  sl: 'Berite dalje',
  lt: 'Skaityti toliau',
  lv: 'Číst dál', // SCAFFOLD(cs)
  et: 'Číst dál', // SCAFFOLD(cs)
  ca: 'Číst dál', // SCAFFOLD(cs)
  is: 'Číst dál', // SCAFFOLD(cs)
};

function categoryFilterLabels(locale: PublicLocale8) {
  if (isGuidanceLocale4(locale)) {
    return {
      all: GUIDANCE_FILTER_ALL_LABEL[locale],
      ...GUIDANCE_FILTER_CATEGORY_LABEL[locale],
    };
  }
  return categoryLabels[locale];
}

function columnCardCtaLabel(locale: PublicLocale8): string {
  if (isGuidanceLocale4(locale)) {
    return `${GUIDANCE_CARD_READ_MORE_LABEL[locale]} →`;
  }
  return locale === 'ko'
    ? '칼럼 보기 →'
    : locale === 'zh-hant'
      ? '查看專欄 →'
      : locale === 'ja'
        ? 'コラムを読む →'
        : 'Open column →';
}

function normalizeFilterValue(value: string | string[] | null | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

function postMatchesQuery(post: ColumnListItem, query: string): boolean {
  if (!query) return true;
  const normalized = query.toLowerCase();
  return [
    post.title,
    post.summary,
    post.categoryLabel,
    post.blogCategory,
    post.authorName,
    ...(post.tags ?? []),
  ].filter(Boolean).join(' ').toLowerCase().includes(normalized);
}

export default function ColumnsGrid({
  locale,
  posts,
  initialFilters = {},
}: {
  locale: PublicLocale8;
  posts: ColumnListItem[];
  initialFilters?: ColumnsGridFilters;
}) {
  const uiLocale = isExistingSiteLocale4(locale) ? locale : 'en';
  const labels = categoryFilterLabels(locale);
  const byline =
    locale === 'ko'
      ? '증준외 변호사 검토'
      : locale === 'zh-hant'
        ? '曾雋崴律師審閱'
        : locale === 'ja'
          ? '曾雋崴弁護士監修'
          : 'Reviewed by Wei Tseng';
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedCategory = normalizeFilterValue(searchParams ? searchParams.get('category') : initialFilters.category);
  const requestedAuthor = normalizeFilterValue(searchParams ? searchParams.get('author') : initialFilters.author);
  const requestedQuery = normalizeFilterValue(searchParams ? searchParams.get('q') : initialFilters.q);
  const requestedYear = normalizeFilterValue(searchParams ? searchParams.get('year') : initialFilters.year);
  const requestedMonth = normalizeFilterValue(searchParams ? searchParams.get('month') : initialFilters.month);
  const active = requestedCategory === 'formation' || requestedCategory === 'legal' || requestedCategory === 'case'
    ? requestedCategory
    : requestedCategory ? null : 'all';
  const [searchInput, setSearchInput] = useState(requestedQuery);
  const [appliedQuery, setAppliedQuery] = useState(requestedQuery);
  const searchLabels = searchCopy[uiLocale];

  useEffect(() => {
    setSearchInput(requestedQuery);
    setAppliedQuery(requestedQuery);
  }, [requestedQuery]);

  const updateUrlSearchParams = (mutate: (next: URLSearchParams) => void, navigation: 'push' | 'replace' = 'replace') => {
    // Consecutive filter clicks can precede the next router render. Start from
    // the current URL so a newly submitted query is not lost to a stale hook.
    const next = new URLSearchParams(
      typeof window !== 'undefined' ? window.location.search : searchParams?.toString() ?? '',
    );
    mutate(next);
    const target = pathname ? `${pathname}${next.toString() ? `?${next.toString()}` : ''}` : '';
    if (typeof window !== 'undefined') {
      window.history[navigation === 'push' ? 'pushState' : 'replaceState'](null, '', target || '?');
    }
    router.replace(target || '?', { scroll: false });
  };

  const updateSearchParam = (nextQuery: string) => {
    const trimmed = nextQuery.trim();
    setAppliedQuery(trimmed);
    updateUrlSearchParams((next) => {
      if (trimmed) {
        next.set('q', trimmed);
      } else {
        next.delete('q');
      }
      next.delete('page');
    });
  };
  const filtered = useMemo(
    () =>
      posts.filter((post) => {
        const categoryMatches = requestedCategory
          ? post.blogCategory === requestedCategory || post.category === requestedCategory
          : true;
        if (!categoryMatches) return false;
        if (requestedAuthor && post.authorName !== requestedAuthor) return false;
        if (requestedYear && !post.date.startsWith(requestedYear)) return false;
        if (requestedMonth) {
          const month = post.date.slice(5, 7).replace(/^0/, '');
          if (month !== requestedMonth.replace(/^0/, '')) return false;
        }
        return postMatchesQuery(post, appliedQuery);
      }),
    [appliedQuery, posts, requestedAuthor, requestedCategory, requestedMonth, requestedYear],
  );

  const cats: { id: ColumnCategory | 'all'; label: string }[] = [
    { id: 'all', label: labels.all },
    { id: 'formation', label: labels.formation },
    { id: 'legal', label: labels.legal },
    { id: 'case', label: labels.case },
  ];
  const activeFilters = [
    { key: 'category', label: searchLabels.category, value: requestedCategory ? (active ? labels[active] : requestedCategory) : '' },
    { key: 'author', label: searchLabels.author, value: requestedAuthor },
    { key: 'year', label: searchLabels.year, value: requestedYear },
    { key: 'month', label: searchLabels.month, value: requestedMonth },
    { key: 'query', label: searchLabels.query, value: appliedQuery },
  ].filter((filter) => filter.value);
  const hasActiveFilters = activeFilters.length > 0;

  return (
    <section className={`section section--light ${styles.root}`}>
      <div className="container">
        <form
          className="columns-search"
          role="search"
          data-columns-search="true"
          onSubmit={(event) => {
            event.preventDefault();
            updateSearchParam(searchInput);
          }}
        >
          <label className="columns-search-label" htmlFor="columns-search-input">
            {searchLabels.label}
          </label>
          <div className="columns-search-row">
            <input
              id="columns-search-input"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder={searchLabels.placeholder}
              className="columns-search-input"
              data-columns-search-input="true"
            />
            <button type="submit" className="columns-search-submit">
              {searchLabels.submit}
            </button>
            {appliedQuery ? (
              <button
                type="button"
                className="columns-search-clear"
                onClick={() => {
                  setSearchInput('');
                  updateSearchParam('');
                }}
                data-columns-search-clear="true"
              >
                {searchLabels.clear}
              </button>
            ) : null}
          </div>
        </form>
        <div className="columns-filter-summary">
          <div role="status" aria-live="polite" aria-atomic="true">
            <p className="columns-search-status" data-columns-search-results={filtered.length}>
              {searchLabels.resultCount(filtered.length)}
            </p>
            {hasActiveFilters ? (
              <ul className="columns-active-filters">
                {activeFilters.map((filter) => (
                  <li key={filter.key}>
                    <span>{filter.label}: </span>{filter.value}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          {hasActiveFilters ? (
            <Link
              href={`/${locale}/columns`}
              className="columns-filter-reset link-underline"
              data-columns-filter-reset="true"
              onNavigate={() => {
                // Reset can precede the submitted query's router hook commit.
                setSearchInput('');
                setAppliedQuery('');
              }}
            >
              {searchLabels.reset}
            </Link>
          ) : null}
        </div>
        <div className="columns-filters">
          {cats.map((cat) => (
            <button
              key={cat.id}
              type="button"
              aria-pressed={active === cat.id}
              onClick={() => {
                updateUrlSearchParams((next) => {
                  if (cat.id === 'all') next.delete('category');
                  else next.set('category', cat.id);
                  next.delete('page');
                });
              }}
              className={`columns-filter-btn ${active === cat.id ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="columns-grid" data-columns-visible-count={filtered.length}>
          {filtered.map((post) => (
            <Link key={post.slug} href={`/${locale}/columns/${post.slug}`} className="columns-card">
              <div className="columns-card-img">
                <Image src={post.featuredImage} alt={post.title} width={600} height={340} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                <div className="columns-card-image-overlay" />
                <div className="columns-card-image-meta">
                  <span className="columns-category-badge columns-category-badge--image">{post.categoryLabel}</span>
                  {post.dateDisplay ? <time className="columns-card-datechip">{post.dateDisplay}</time> : null}
                </div>
              </div>
              <div className="columns-card-body">
                <div className="columns-card-meta">
                  <span className="columns-card-byline">{post.authorName || byline}</span>
                  {post.readTime ? <span className="columns-readtime-inline">{post.readTime}</span> : null}
                </div>
                <h3 className="columns-card-title">{post.title}</h3>
                <p className="columns-card-summary">{post.summary}</p>
                <span className="columns-card-linkhint">
                  {columnCardCtaLabel(locale)}
                </span>
              </div>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="columns-empty">
            {hasActiveFilters ? searchLabels.noMatches : searchLabels.noPosts}
          </p>
        )}
      </div>
    </section>
  );
}
