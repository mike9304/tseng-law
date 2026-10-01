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
import {
  COLUMN_TOPIC_LABELS,
  COLUMN_TOPIC_SECTION_PREVIEW,
  COLUMN_TOPIC_UI_COPY,
  isColumnTopic,
  resolveColumnTopic,
  type ColumnTopic,
} from '@/lib/column-topics';
import { RECOMMENDED_SECTION_TITLE, splitRecommendedColumns } from '@/lib/en-recommended-columns';
import { getAiAuthorCopy, isAiAuthoredColumn } from '@/lib/ai-authored-columns';
import styles from './ColumnsGrid.module.css';
import { typesetTitle } from '@/lib/ko-middot';

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
  topic?: ColumnTopic;
  blogCategory?: string;
  authorName?: string;
  tags?: string[];
  featuredImage: string;
  summary: string;
  publicationDate?: string;
  audience?: string[];
  aiAuthored?: boolean;
  columnNumber?: number;
}

export interface ColumnsGridFilters {
  category?: string;
  topic?: string;
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
  bn: 'সব',
  ur: 'سب',
  fa: 'همه',
  my: 'အားလုံး',
  ta: 'அனைத்தும்',
  ne: 'सबै',
  km: 'ទាំងអស់',
  mn: 'Бүгд',
  sk: 'Všetky',
  bg: 'Всички',
  hr: 'Sve',
  sr: 'Sve',
  sl: 'Vse',
  lt: 'Visus',
  lv: 'Visus',
  et: 'Kõik',
  ca: 'Tot',
  is: 'Allt',
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
  bn: {
    formation: 'তাইওয়ানে কোম্পানি গঠন',
    legal: 'তাইওয়ানের আইনি তথ্য',
    case: 'মামলা বিশ্লেষণ',
  },
  ur: {
    formation: 'تائیوان میں کمپنی کا قیام',
    legal: 'تائیوان قانونی معلومات',
    case: 'مقدمے کا جائزہ',
  },
  fa: {
    formation: 'تأسیس شرکت در تایوان',
    legal: 'اطلاعات حقوقی تایوان',
    case: 'تحلیل پرونده',
  },
  my: {
    formation: 'ထိုင်ဝမ်တွင် ကုမ္ပဏီတည်ထောင်ခြင်း',
    legal: 'ထိုင်ဝမ်ဥပဒေအချက်အလက်',
    case: 'အမှုနမူနာ သုံးသပ်ချက်',
  },
  ta: {
    formation: 'தைவானில் நிறுவனம் அமைத்தல்',
    legal: 'தைவான் சட்டத் தகவல்',
    case: 'வழக்குப் பகுப்பாய்வு',
  },
  ne: {
    formation: 'ताइवानमा कम्पनी स्थापना',
    legal: 'ताइवान कानुनी जानकारी',
    case: 'मुद्दा विश्लेषण',
  },
  km: {
    formation: 'ការបង្កើតក្រុមហ៊ុននៅតៃវ៉ាន់',
    legal: 'ព័ត៌មានច្បាប់តៃវ៉ាន់',
    case: 'ការវិភាគសំណុំរឿង',
  },
  mn: {
    formation: 'Тайваньд компани байгуулах',
    legal: 'Тайванийн эрх зүйн мэдээлэл',
    case: 'Хэргийн шинжилгээ',
  },
  sk: {
    formation: 'Zakladanie spoločností na Taiwane',
    legal: 'Právne informácie o Taiwane',
    case: 'Rozbor prípadu',
  },
  bg: {
    formation: 'Учредяване на дружество в Тайван',
    legal: 'Правна информация за Тайван',
    case: 'Анализ на дела',
  },
  hr: {
    formation: 'Osnivanje društava na Tajvanu',
    legal: 'Pravne informacije o Tajvanu',
    case: 'Analiza slučaja',
  },
  sr: {
    formation: 'Osnivanje društava na Tajvanu',
    legal: 'Pravne informacije o Tajvanu',
    case: 'Analiza predmeta',
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
  lv: {
    formation: 'Sabiedrību dibināšana Taivānā',
    legal: 'Juridiskā informācija par Taivānu',
    case: 'Lietas izklāsts',
  },
  et: {
    formation: 'Ettevõtte asutamine Taiwanis',
    legal: 'Õigusteave Taiwani kohta',
    case: 'Juhtumianalüüs',
  },
  ca: {
    formation: 'Constitució de societats a Taiwan',
    legal: 'Informació jurídica de Taiwan',
    case: 'Anàlisi de casos',
  },
  is: {
    formation: 'Félagastofnun á Taívan',
    legal: 'Lagaupplýsingar um Taívan',
    case: 'Málsgreining',
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
  ms: 'Baca seterusnya',
  ru: 'Читать далее',
  tr: 'Devamını oku',
  it: 'Continua a leggere',
  nl: 'Verder lezen',
  pl: 'Czytaj dalej',
  hi: 'आगे पढ़ें',
  sv: 'Läs vidare',
  da: 'Læs videre',
  nb: 'Les videre',
  fi: 'Lue lisää',
  cs: 'Číst dál',
  hu: 'Tovább olvasom',
  ro: 'Citiți mai departe',
  uk: 'Читати далі',
  el: 'Συνέχεια ανάγνωσης',
  he: 'המשך קריאה',
  bn: 'আরও পড়ুন',
  ur: 'آگے پڑھیں',
  fa: 'ادامهٔ مطلب',
  my: 'ဆက်ဖတ်ရန်',
  ta: 'மேலும் படிக்க',
  ne: 'थप पढ्नुहोस्',
  km: 'អានបន្ដ',
  mn: 'Цааш унших',
  sk: 'Čítať ďalej',
  bg: 'Прочетете още',
  hr: 'Čitajte dalje',
  sr: 'Čitajte dalje',
  sl: 'Preberite več',
  lt: 'Skaityti toliau',
  lv: 'Lasīt tālāk',
  et: 'Lugege edasi',
  ca: 'Continuar llegint',
  is: 'Lesa áfram',
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
  posts: incomingPosts,
  initialFilters = {},
  hrefBase,
  recommendedTitleOverride,
  featuredSlugs,
  openingSlugs,
  topicOrder,
  recommendedOrder,
}: {
  locale: PublicLocale8;
  posts: ColumnListItem[];
  initialFilters?: ColumnsGridFilters;
  /** Card/reset link base; defaults to `/${locale}/columns` (issue board: `/${locale}/columns/issues`). */
  hrefBase?: string;
  /** Heading for the locale-first section (issue board uses its own wording). */
  recommendedTitleOverride?: string;
  /** Optional editorial picks for the opening section (zh-hant), in order; remaining slots fall back to the newest recommended posts. */
  featuredSlugs?: readonly string[];
  /** Optional curated slugs for the opening section, in order and shown in full (ja design). Takes precedence over featuredSlugs. */
  openingSlugs?: readonly string[];
  /** Optional order of the topic sections (zh-hant, ja, en); topics not listed keep their default order after the listed ones. */
  topicOrder?: readonly string[];
  /** Optional slugs shown first in the recommended section (en design); the rest stay newest first. */
  recommendedOrder?: readonly string[];
}) {
  const listHref = hrefBase ?? `/${locale}/columns`;
  // Posts recommended to this locale's readers come first (also in filtered
  // lists) and get their own section above the topic groups.
  const recommendedTitle = recommendedTitleOverride ?? RECOMMENDED_SECTION_TITLE[locale];
  const { recommended, rest: nonRecommended } = useMemo(() => {
    const split = recommendedTitle ? splitRecommendedColumns(locale, incomingPosts) : { recommended: [], rest: [...incomingPosts] };
    if (!recommendedOrder || recommendedOrder.length === 0) return split;
    const rank = (slug: string, index: number) => {
      const position = recommendedOrder.indexOf(slug);
      return position === -1 ? recommendedOrder.length + index : position;
    };
    const ordered = split.recommended
      .map((post, index) => ({ post, rank: rank(post.slug, index) }))
      .sort((a, b) => a.rank - b.rank)
      .map(({ post }) => post);
    return { recommended: ordered, rest: split.rest };
  }, [locale, incomingPosts, recommendedTitle, recommendedOrder]);
  const posts = useMemo(() => [...recommended, ...nonRecommended], [recommended, nonRecommended]);
  const openingPosts = useMemo(() => {
    if (openingSlugs?.length) {
      const bySlug = new Map(posts.map((post) => [post.slug, post] as const));
      return openingSlugs.map((slug) => bySlug.get(slug)).filter((post): post is ColumnListItem => Boolean(post));
    }
    if (!featuredSlugs || featuredSlugs.length === 0) return recommended.slice(0, COLUMN_TOPIC_SECTION_PREVIEW);
    const picked = featuredSlugs
      .map((slug) => posts.find((post) => post.slug === slug))
      .filter((post): post is ColumnListItem => Boolean(post));
    const fill = recommended.filter((post) => !picked.includes(post));
    return [...picked, ...fill].slice(0, COLUMN_TOPIC_SECTION_PREVIEW);
  }, [featuredSlugs, openingSlugs, posts, recommended]);
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
  const requestedTopic = normalizeFilterValue(searchParams ? searchParams.get('topic') : initialFilters.topic);
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
  // Core site locales group the index by topic; translated guidance locales
  // group by the reviewed category labels they already carry.
  const topicMode = isExistingSiteLocale4(locale);
  const topicLabels = COLUMN_TOPIC_LABELS[uiLocale];
  const topicCopy = COLUMN_TOPIC_UI_COPY[uiLocale];
  const topicOf = (post: ColumnListItem): ColumnTopic => post.topic ?? resolveColumnTopic(post.slug, undefined, post.category);
  const activeTopic: ColumnTopic | null = topicMode && isColumnTopic(requestedTopic) ? requestedTopic : null;

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
        if (requestedTopic && topicMode && topicOf(post) !== requestedTopic) return false;
        if (requestedAuthor && post.authorName !== requestedAuthor) return false;
        if (requestedYear && !post.date.startsWith(requestedYear)) return false;
        if (requestedMonth) {
          const month = post.date.slice(5, 7).replace(/^0/, '');
          if (month !== requestedMonth.replace(/^0/, '')) return false;
        }
        return postMatchesQuery(post, appliedQuery);
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- topicOf is derived from props only
    [appliedQuery, posts, requestedAuthor, requestedCategory, requestedMonth, requestedYear, requestedTopic, topicMode],
  );

  const cats: { id: ColumnCategory | 'all'; label: string }[] = [
    { id: 'all', label: labels.all },
    { id: 'formation', label: labels.formation },
    { id: 'legal', label: labels.legal },
    { id: 'case', label: labels.case },
  ];
  const activeFilters = [
    { key: 'category', label: searchLabels.category, value: requestedCategory ? (active ? labels[active] : requestedCategory) : '' },
    { key: 'topic', label: topicCopy.nav, value: requestedTopic && topicMode ? (activeTopic ? topicLabels[activeTopic] : requestedTopic) : '' },
    { key: 'author', label: searchLabels.author, value: requestedAuthor },
    { key: 'year', label: searchLabels.year, value: requestedYear },
    { key: 'month', label: searchLabels.month, value: requestedMonth },
    { key: 'query', label: searchLabels.query, value: appliedQuery },
  ].filter((filter) => filter.value);
  const hasActiveFilters = activeFilters.length > 0;

  // Grouped view (no filter): every topic gets its own section so one busy
  // topic can no longer push the rest of the archive below the fold.
  const groups = useMemo(() => {
    const order: string[] = [];
    const buckets = new Map<string, ColumnListItem[]>();
    for (const post of posts) {
      const key = topicMode ? topicOf(post) : post.category;
      if (!buckets.has(key)) {
        buckets.set(key, []);
        order.push(key);
      }
      buckets.get(key)!.push(post);
    }
    const defaultOrder: string[] = topicMode
      ? (Object.keys(topicLabels) as ColumnTopic[])
      : ['formation', 'legal', 'case'];
    const canonical = topicMode && topicOrder && topicOrder.length > 0
      ? [...topicOrder.filter((key) => defaultOrder.includes(key)), ...defaultOrder.filter((key) => !topicOrder.includes(key))]
      : defaultOrder;
    return canonical.filter((key) => buckets.has(key)).map((key) => ({ key, posts: buckets.get(key)! }));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- labels/topicOf derive from locale
  }, [posts, topicMode, uiLocale, topicOrder]);
  const groupLabel = (key: string): string =>
    topicMode ? topicLabels[key as ColumnTopic] : labels[key as ColumnCategory];
  const topicChips: { id: ColumnTopic | 'all'; label: string; count: number }[] = [
    { id: 'all', label: labels.all, count: posts.length },
    ...groups.map((group) => ({ id: group.key as ColumnTopic, label: topicLabels[group.key as ColumnTopic], count: group.posts.length })),
  ];
  const selectTopic = (topic: ColumnTopic | 'all', navigation: 'push' | 'replace' = 'replace') => {
    updateUrlSearchParams((next) => {
      if (topic === 'all') next.delete('topic');
      else next.set('topic', topic);
      next.delete('category');
      next.delete('page');
    }, navigation);
  };
  const renderCard = (post: ColumnListItem) => (
    <Link key={post.slug} href={`${listHref}/${post.slug}`} className="columns-card" data-column-topic={topicMode ? topicOf(post) : post.category}>
      <div className="columns-card-img">
        <Image src={post.featuredImage} alt={post.title} width={600} height={340} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
        <div className="columns-card-image-overlay" />
        <div className="columns-card-image-meta">
          <span className="columns-category-badge columns-category-badge--image">{topicMode ? topicLabels[topicOf(post)] : post.categoryLabel}</span>
          {post.dateDisplay ? <time className="columns-card-datechip">{post.dateDisplay}</time> : null}
        </div>
      </div>
      <div className="columns-card-body">
        <div className="columns-card-meta">
          <span className="columns-card-byline">{isAiAuthoredColumn(post) ? getAiAuthorCopy(locale).label : post.authorName || byline}</span>
          {post.readTime ? <span className="columns-readtime-inline">{post.readTime}</span> : null}
        </div>
        <h3 className="columns-card-title">{typesetTitle(locale, post.title)}</h3>
        <p className="columns-card-summary">{post.summary}</p>
        <span className="columns-card-linkhint">
          {columnCardCtaLabel(locale)}
        </span>
      </div>
    </Link>
  );

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
              href={listHref}
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
        {topicMode ? (
          <nav className="columns-filters columns-topic-nav" aria-label={topicCopy.nav} data-columns-topic-nav="true">
            {topicChips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                aria-pressed={chip.id === 'all' ? !activeTopic && !requestedCategory : activeTopic === chip.id}
                onClick={() => selectTopic(chip.id)}
                className={`columns-filter-btn ${(chip.id === 'all' ? !activeTopic && !requestedCategory : activeTopic === chip.id) ? 'active' : ''}`}
                data-columns-topic-chip={chip.id}
              >
                {chip.label}
                <span className="columns-filter-count" aria-hidden="true">{chip.count}</span>
              </button>
            ))}
          </nav>
        ) : (
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
        )}
        {!hasActiveFilters && posts.length > 0 ? (
          <div className="columns-topic-sections" data-columns-grouped="true" data-columns-visible-count={posts.length}>
            {openingPosts.length > 0 ? (
              <section
                className="columns-topic-section"
                aria-labelledby="columns-recommended"
                data-columns-recommended={locale}
              >
                <header className="columns-topic-header">
                  <h2 id="columns-recommended" className="columns-topic-title">{recommendedTitle}</h2>
                  <span className="columns-topic-count">
                    {topicMode ? topicCopy.count(openingPosts.length) : openingPosts.length}
                  </span>
                </header>
                <div className="columns-grid">{openingPosts.map(renderCard)}</div>
              </section>
            ) : null}
            {groups.map((group) => {
              // Recommended posts are already shown above; preview the others.
              const pool = openingPosts.length > 0 ? group.posts.filter((post) => !openingPosts.includes(post)) : group.posts;
              if (pool.length === 0) return null;
              const preview = topicMode ? pool.slice(0, COLUMN_TOPIC_SECTION_PREVIEW) : pool;
              const headingId = `columns-topic-${group.key}`;
              return (
                <section key={group.key} className="columns-topic-section" aria-labelledby={headingId} data-columns-topic-section={group.key}>
                  <header className="columns-topic-header">
                    <h2 id={headingId} className="columns-topic-title">{groupLabel(group.key)}</h2>
                    {topicMode ? <span className="columns-topic-count">{topicCopy.count(group.posts.length)}</span> : null}
                  </header>
                  <div className="columns-grid">{preview.map(renderCard)}</div>
                  {topicMode && group.posts.length > preview.length ? (
                    <button
                      type="button"
                      className="columns-topic-more link-underline"
                      onClick={() => selectTopic(group.key as ColumnTopic, 'push')}
                      data-columns-topic-more={group.key}
                    >
                      {topicCopy.viewAll(groupLabel(group.key), group.posts.length)} →
                    </button>
                  ) : null}
                </section>
              );
            })}
          </div>
        ) : (
          <div className="columns-grid" data-columns-visible-count={filtered.length}>
            {filtered.map(renderCard)}
          </div>
        )}
        {filtered.length === 0 && (
          <p className="columns-empty">
            {hasActiveFilters ? searchLabels.noMatches : searchLabels.noPosts}
          </p>
        )}
      </div>
    </section>
  );
}
