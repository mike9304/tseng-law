import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Locale, SiteLocale } from './locales';
import { COLUMN_CONTENT_DIR_BY_LOCALE, getColumnAlternateLocales } from './column-locales';
import {
  PUBLIC_LOCALES_8,
  isGuidanceLocale4,
  isPublicLocale8,
  type GuidanceLocale4,
  type PublicLocale8,
} from './public-guidance';
import { insightsArchive } from '../data/insights-archive';
import {
  formatColumnPublicationDate,
  parseColumnPublicationDate,
  sortColumnPostsNewestFirst,
  type ColumnCategory,
  type ColumnFaqItem,
  type ColumnPost,
} from './column-post';

export {
  formatColumnPublicationDate,
  getColumnPublicationDate,
  parseColumnPublicationDate,
  sortColumnPostsNewestFirst,
  type ColumnCategory,
  type ColumnFaqItem,
  type ColumnPost,
} from './column-post';

/**
 * Normalize the optional `faq` frontmatter array into a clean `{ q, a }[]`.
 *
 * Frontmatter shape (gray-matter / YAML):
 *   faq:
 *     - q: "질문"
 *       a: "답"
 *
 * Drops anything that is not an object or is missing a non-empty `q`/`a`
 * string so malformed entries can never reach the FAQPage JSON-LD or the
 * rendered "자주 묻는 질문" section. Exported for unit testing.
 */
export function normalizeColumnFaq(raw: unknown): ColumnFaqItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (item == null || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const q = typeof record.q === 'string' ? record.q.trim() : '';
      const a = typeof record.a === 'string' ? record.a.trim() : '';
      if (!q || !a) return null;
      return { q, a };
    })
    .filter((item): item is ColumnFaqItem => item !== null);
}

export type ColumnContentLocale = Locale | SiteLocale | PublicLocale8;

export type ColumnLoadOptions = {
  /** Absolute markdown directory. Test hook — production omits this. */
  columnsDir?: string;
  cwd?: string;
};

const COLUMNS_DIR = path.join(process.cwd(), 'src/content/columns');

function getColumnsDir(locale: ColumnContentLocale, options?: ColumnLoadOptions): string | null {
  if (options?.columnsDir) {
    return fs.existsSync(options.columnsDir) ? options.columnsDir : null;
  }

  if (isPublicLocale8(locale)) {
    const dir = path.join(options?.cwd ?? process.cwd(), COLUMN_CONTENT_DIR_BY_LOCALE[locale]);
    if (isGuidanceLocale4(locale)) {
      return fs.existsSync(dir) ? dir : null;
    }
    if (!fs.existsSync(dir)) {
      throw new Error(`Missing column directory: ${COLUMN_CONTENT_DIR_BY_LOCALE[locale]}`);
    }
    return dir;
  }

  return COLUMNS_DIR;
}

/**
 * Frontmatter `categories` phrases of the translated columns, exactly as the
 * translation lane wrote them (vi/id/th/fil: 8 formation · 8 legal · 1 case,
 * mirroring en). Before these were known here every guidance-language column
 * fell through to `legal`, so the live vi/id/th/fil homes showed company-setup
 * articles under "Legal Information". Arabic uses the reviewed ar terms.
 */
const FORMATION_CATEGORY_PHRASES = [
  '법인설립',
  '公司設立',
  '台湾会社設立',
  'Thành lập công ty', // vi
  'Pendirian Perusahaan', // id
  'การจัดตั้งบริษัท', // th
  'Pagtatatag ng Kompanya', // fil
  'تأسيس الشركات', // ar
  'Gesellschaftsgründung', // de
  'Constitución de sociedades', // es
  'Création de société à Taïwan', // fr
  'Constituição de sociedades em Taiwan', // pt
  '公司登记', // zh-hans (Taiwan term, simplified)
  'Penubuhan syarikat di Taiwan', // ms
  'Учреждение компании на Тайване', // ru
  'Tayvan’da şirket kuruluşu', // tr
  'Costituzione di società a Taiwan', // it
  'Oprichting van een vennootschap in Taiwan', // nl
  'Zakładanie spółki na Tajwanie', // pl
];
const CASE_CATEGORY_PHRASES = [
  '소송사례',
  '訴訟案例',
  '訴訟事例',
  'Phân tích vụ án', // vi
  'Analisis Kasus', // id
  'การวิเคราะห์คดี', // th
  'Pagsusuri ng Kaso', // fil
  'دراسات قضايا', // ar
  'Fallanalyse', // de
  'Análisis de casos', // es
  'Analyse de cas', // fr
  'Análise de casos', // pt
  '案例分析', // zh-hans
  'Analisis kes', // ms
  'Анализ дел', // ru
  'Vaka analizi', // tr
  'Analisi di casi', // it
  'Casusanalyse', // nl
  'Analiza spraw', // pl
];

/**
 * Category phrases derived from the badge labels themselves.
 *
 * The hardcoded phrase lists used to drift from `GUIDANCE_COLUMN_CATEGORY_LABELS`
 * — zh-hans listed `公司登记` while the label (and every column's frontmatter)
 * said `在台湾设立公司`, so nine Simplified Chinese columns resolved to `legal`.
 * Deriving from the label map makes a new locale impossible to get wrong: the
 * label a column writes into its frontmatter is the phrase that classifies it.
 */
function labelPhrases(cat: ColumnCategory): string[] {
  return Object.values(GUIDANCE_COLUMN_CATEGORY_LABELS)
    .map((labels) => labels?.[cat])
    .filter((phrase): phrase is string => Boolean(phrase));
}

function categoryFromString(cat: string): ColumnCategory {
  if (
    FORMATION_CATEGORY_PHRASES.some((phrase) => cat.includes(phrase))
    || labelPhrases('formation').some((phrase) => cat.includes(phrase))
    || /company setup|company formation|incorporation/i.test(cat)
  ) {
    return 'formation';
  }
  if (
    CASE_CATEGORY_PHRASES.some((phrase) => cat.includes(phrase))
    || labelPhrases('case').some((phrase) => cat.includes(phrase))
    || /case study|litigation case|lawsuit case/i.test(cat)
  ) {
    return 'case';
  }
  return 'legal';
}

/**
 * Column category badge for the guidance languages.
 *
 * vi/id/th/fil reuse — verbatim — the `categories` phrase the translation lane
 * already wrote into every column's frontmatter (reviewed copy, 8/8/1 per
 * language, mirroring en). Arabic labels come from the reviewed `ar` guidance
 * vocabulary (WO-M3 review, 2026-09-16). Nothing here is invented; the
 * accompanying test cross-checks each label against the frontmatter on disk.
 */
const GUIDANCE_COLUMN_CATEGORY_LABELS: Partial<Record<GuidanceLocale4, Record<ColumnCategory, string>>> = {
  vi: { formation: 'Thành lập công ty tại Đài Loan', legal: 'Thông tin pháp luật Đài Loan', case: 'Phân tích vụ án tố tụng' },
  id: { formation: 'Pendirian Perusahaan di Taiwan', legal: 'Informasi Hukum Taiwan', case: 'Analisis Kasus Litigasi' },
  th: { formation: 'การจัดตั้งบริษัทในไต้หวัน', legal: 'ข้อมูลกฎหมายไต้หวัน', case: 'การวิเคราะห์คดีตัวอย่าง' },
  fil: { formation: 'Pagtatatag ng Kompanya sa Taiwan', legal: 'Impormasyong Legal sa Taiwan', case: 'Pagsusuri ng Kaso sa Paglilitis' },
  ar: { formation: 'تأسيس الشركات', legal: 'معلومات قانونية', case: 'دراسات قضايا' },
  de: { formation: 'Gesellschaftsgründung in Taiwan', legal: 'Rechtliche Informationen zu Taiwan', case: 'Fallanalyse' },
  es: { formation: 'Constitución de sociedades en Taiwán', legal: 'Información jurídica de Taiwán', case: 'Análisis de casos' },
  fr: { formation: 'Création de société à Taïwan', legal: 'Informations juridiques sur Taïwan', case: 'Analyse de cas' },
  pt: { formation: 'Constituição de sociedades em Taiwan', legal: 'Informações jurídicas sobre Taiwan', case: 'Análise de casos' },
  'zh-hans': { formation: '在台湾设立公司', legal: '台湾法律信息', case: '案例分析' },
  ms: { formation: 'Penubuhan syarikat di Taiwan', legal: 'Maklumat undang-undang Taiwan', case: 'Analisis kes' },
  ru: { formation: 'Учреждение компании на Тайване', legal: 'Правовая информация о Тайване', case: 'Анализ дел' },
  tr: { formation: 'Tayvan’da şirket kuruluşu', legal: 'Tayvan hukuku bilgileri', case: 'Vaka analizi' },
  it: { formation: 'Costituzione di società a Taiwan', legal: 'Informazioni giuridiche su Taiwan', case: 'Analisi di casi' },
  nl: { formation: 'Oprichting van een vennootschap in Taiwan', legal: 'Juridische informatie over Taiwan', case: 'Casusanalyse' },
  pl: { formation: 'Zakładanie spółki na Tajwanie', legal: 'Informacje prawne o Tajwanie', case: 'Analiza spraw' },
  hi: { formation: 'ताइवान में कंपनी स्थापना', legal: 'ताइवान कानूनी जानकारी', case: 'मामला विश्लेषण' },
  sv: { formation: 'Bolagsbildning i Taiwan', legal: 'Juridisk information om Taiwan', case: 'Fallanalys' },
  da: { formation: 'Selskabsstiftelse i Taiwan', legal: 'Juridisk information om Taiwan', case: 'Sagsanalyse' },
  nb: { formation: 'Selskapsstiftelse i Taiwan', legal: 'Juridisk informasjon om Taiwan', case: 'Saksanalyse' },
  fi: { formation: 'Yhtiön perustaminen Taiwanissa', legal: 'Oikeudellista tietoa Taiwanista', case: 'Tapausanalyysi' },
  cs: { formation: 'Zakládání společností na Tchaj-wanu', legal: 'Právní informace o Tchaj-wanu', case: 'Rozbor případu' },
  hu: { formation: 'Cégalapítás Tajvanon', legal: 'Tajvani jogi tájékoztatás', case: 'Esetelemzés' },
  ro: { formation: 'Înființare de societăți în Taiwan', legal: 'Informații juridice despre Taiwan', case: 'Analiză de caz' },
  uk: { formation: 'Створення товариств на Тайвані', legal: 'Правова інформація про Тайвань', case: 'Розбір справи' },
  el: { formation: 'Σύσταση εταιρειών στην Ταϊβάν', legal: 'Νομικές πληροφορίες για την Ταϊβάν', case: 'Ανάλυση υπόθεσης' },
  he: { formation: 'הקמת חברות בטאיוואן', legal: 'מידע משפטי על טאיוואן', case: 'ניתוח מקרה' },
  bn: { formation: 'তাইওয়ানে কোম্পানি গঠন', legal: 'তাইওয়ানের আইনি তথ্য', case: 'মামলা বিশ্লেষণ' },
  ur: { formation: 'تائیوان میں کمپنی کا قیام', legal: 'تائیوان قانونی معلومات', case: 'مقدمے کا جائزہ' },
  fa: { formation: 'تأسیس شرکت در تایوان', legal: 'اطلاعات حقوقی تایوان', case: 'تحلیل پرونده' },
  my: { formation: 'ထိုင်ဝမ်တွင် ကုမ္ပဏီတည်ထောင်ခြင်း', legal: 'ထိုင်ဝမ်ဥပဒေအချက်အလက်', case: 'အမှုနမူနာ သုံးသပ်ချက်' },
  ta: { formation: 'தைவானில் நிறுவனம் அமைத்தல்', legal: 'தைவான் சட்டத் தகவல்', case: 'வழக்குப் பகுப்பாய்வு' },
  ne: { formation: 'ताइवानमा कम्पनी स्थापना', legal: 'ताइवान कानुनी जानकारी', case: 'मुद्दा विश्लेषण' },
  km: { formation: 'การจัดตั้งบริษัทในไต้หวัน', legal: 'ข้อมูลกฎหมายไต้หวัน', case: 'การวิเคราะห์คดีตัวอย่าง' }, // SCAFFOLD(th)
  mn: { formation: 'Тайваньд компани байгуулах', legal: 'Тайванийн эрх зүйн мэдээлэл', case: 'Хэргийн шинжилгээ' },
  sk: { formation: 'Zakladanie spoločností na Taiwane', legal: 'Právne informácie o Taiwane', case: 'Rozbor prípadu' },
  bg: { formation: 'Учредяване на дружество в Тайван', legal: 'Правна информация за Тайван', case: 'Анализ на дела' },
  hr: { formation: 'Osnivanje društava na Tajvanu', legal: 'Pravne informacije o Tajvanu', case: 'Analiza slučaja' },
  sr: { formation: 'Osnivanje društava na Tajvanu', legal: 'Pravne informacije o Tajvanu', case: 'Analiza predmeta' },
  sl: { formation: 'Ustanavljanje družb na Tajvanu', legal: 'Pravne informacije o Tajvanu', case: 'Razčlenitev primera' },
  lt: { formation: 'Įmonių steigimas Taivane', legal: 'Teisinė informacija apie Taivaną', case: 'Bylos analizė' },
  lv: { formation: 'Sabiedrību dibināšana Taivānā', legal: 'Juridiskā informācija par Taivānu', case: 'Lietas izklāsts' },
  et: { formation: 'Ettevõtte asutamine Taiwanis', legal: 'Õigusteave Taiwani kohta', case: 'Juhtumianalüüs' },
  ca: { formation: 'Constitució de societats a Taiwan', legal: 'Informació jurídica de Taiwan', case: 'Anàlisi de casos' },
  is: { formation: 'Félagastofnun á Taívan', legal: 'Lagaupplýsingar um Taívan', case: 'Málsgreining' },
};
const ENGLISH_COLUMN_CATEGORY_LABELS: Record<ColumnCategory, string> = {
  formation: 'Company Setup',
  legal: 'Legal Information',
  case: 'Case Study',
};

export function guidanceColumnCategoryLabel(cat: ColumnCategory, locale: GuidanceLocale4): string {
  return (GUIDANCE_COLUMN_CATEGORY_LABELS[locale] ?? ENGLISH_COLUMN_CATEGORY_LABELS)[cat];
}

function categoryLabelFn(cat: ColumnCategory, locale: ColumnContentLocale): string {
  if (isGuidanceLocale4(locale)) {
    return guidanceColumnCategoryLabel(cat, locale);
  }
  if (locale === 'zh-hant') {
    const map: Record<ColumnCategory, string> = { formation: '公司設立', legal: '法律資訊', case: '訴訟案例' };
    return map[cat];
  }
  if (locale === 'en') {
    const map: Record<ColumnCategory, string> = { formation: 'Company Setup', legal: 'Legal Information', case: 'Case Study' };
    return map[cat];
  }
  if (locale === 'ja') {
    const map: Record<ColumnCategory, string> = { formation: '台湾会社設立', legal: '台湾法律情報', case: '訴訟事例分析' };
    return map[cat];
  }
  const map: Record<ColumnCategory, string> = { formation: '법인설립', legal: '법률정보', case: '소송사례' };
  return map[cat];
}

function extractSummary(content: string): string {
  const lines = content.split('\n').filter((line) => {
    const t = line.trim();
    return t.length > 0 && !t.startsWith('#') && !t.startsWith('!') && !t.startsWith('[') && !t.startsWith('---') && !t.startsWith('|') && !t.startsWith('>');
  });
  const text = lines.slice(0, 3).join(' ').replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();
  return text.length > 150 ? text.slice(0, 150) + '...' : text;
}

/**
 * Prefer an authored frontmatter `summary` string for meta description,
 * Article JSON-LD, and llms.txt annotations. Empty or non-string values
 * fall back to the first-paragraph extract.
 */
export function resolveColumnSummary(rawSummary: unknown, content: string): string {
  if (typeof rawSummary === 'string') {
    const trimmed = rawSummary.trim();
    if (trimmed) return trimmed;
  }
  return extractSummary(content);
}

/**
 * Prefer an authored frontmatter `seoTitle` for <title> and og:title.
 * Empty or non-string values fall back to the display/H1 title.
 */
export function resolveColumnSeoTitle(rawSeoTitle: unknown, fallbackTitle: string): string {
  if (typeof rawSeoTitle === 'string') {
    const trimmed = rawSeoTitle.trim();
    if (trimmed) return trimmed;
  }
  return fallbackTitle;
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, '').replace(/^\d{3}-/, '');
}

function fixImagePaths(content: string): string {
  return content.replace(/\(\.\.\/images\/([^)]+)\)/g, '(/images/blog/$1)');
}

function stripLeadingDuplicates(content: string): string {
  let result = content.trimStart();
  // Strip leading H1 (already shown in page hero)
  result = result.replace(/^#\s+.+\n*/, '');
  // Strip leading image (already shown as featuredImage in hero)
  result = result.replace(/^\s*!\[[^\]]*\]\([^)]+\)\s*\n*/, '');
  // Strip BOM / zero-width chars
  result = result.replace(/^\s*[\uFEFF\u200B]+\s*\n*/g, '');
  return result.trimStart();
}

function stripInlineImages(content: string): string {
  return content.replace(/\n?\s*!\[[^\]]*\]\([^)]+\)\s*\n?/g, '\n\n').trim();
}

const SLUG_ALIASES: Record<string, string> = {
  'gym-injury-lawsuit': 'taiwan-gym-injury-lawsuit',
  'cosmetics-market-entry': 'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
  'company-advanced-2': 'taiwan-company-establishment-advanced-2',
  'withdraw-capital': 'withdraw-capital-taiwan-company',
  'logistics-business': 'taiwan-logistics-business-setup',
  'company-location': 'taiwan-company-setup-pitch-location',
  'company-advanced-1': 'taiwan-company-establishment-advanced-1',
  'subsidiary-vs-branch': 'taiwan-company-subsidiary-vs-branch',
  'company-basics': 'taiwan-company-establishment-basics',
  'inheritance-custody': 'taiwan-inheritance-custody-analysis',
  'overtaking-accident': 'taiwan-overtaking-accident-liability',
  'severance-exception': 'taiwan-voluntary-resignation-severance',
  'divorce-qna': 'taiwan-divorce-lawsuit-qna',
  'massage-law': 'taiwan-massage-history-law',
  'mandatory-employment': 'taiwan-mandatory-employment-period',
  'labor-severance': 'taiwan-labor-severance-law',
  'traffic-accident-procedure': 'taiwan-traffic-accident-procedure',
  'semiconductor-market-entry': 'taiwan-semiconductor-market-entry',
};

const REAL_SLUG_TO_INSIGHT_ID = Object.fromEntries(
  Object.entries(SLUG_ALIASES).map(([insightId, realSlug]) => [realSlug, insightId])
) as Record<string, string>;

function toEnglishReadTime(value: string): string {
  const minutes = value.match(/\d+/)?.[0];
  return minutes ? `${minutes} min read` : value;
}

export function resolveSlug(slug: string): string {
  return SLUG_ALIASES[slug] || slug;
}

export function getAliasSlugs(): string[] {
  return Object.keys(SLUG_ALIASES);
}

export function getAllColumnPosts(
  locale: ColumnContentLocale = 'ko',
  options?: ColumnLoadOptions,
): ColumnPost[] {
  const dir = getColumnsDir(locale, options);
  if (!dir) return [];
  const files = fs.readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort((a, b) => a.localeCompare(b, 'en'));
  const sourceOrder = new Map(files.map((file, index) => [slugFromFilename(file), index]));
  const postsWithArchiveDate = files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
    const { data, content } = matter(raw);
    const slug = slugFromFilename(file);
    const categories = (data.categories as string[]) || [];
    const cat = categoryFromString(categories[0] || '');
    const fixedContent = fixImagePaths(content);
    const cleanContent = stripInlineImages(stripLeadingDuplicates(fixedContent));
    const featuredRaw = (data.featured_image as string) || '';
    const featuredImage = featuredRaw ? featuredRaw.replace(/^\.\.\/images\//, '/images/blog/') : '/images/blog/placeholder.jpg';
    const fallbackTitle = (data.title as string) || '';
    const lastmod = (data.lastmod as string) || '';
    const fallbackDateDisplay = (data.date_display as string) || '';
    const publicationDate = parseColumnPublicationDate(data.published as string)
      || parseColumnPublicationDate(fallbackDateDisplay);
    const fallbackReadTime = (data.read_time as string) || '';
    const fallbackSummary = resolveColumnSummary(data.summary, fixedContent);
    const fallbackSeoTitle = resolveColumnSeoTitle(data.seoTitle, fallbackTitle);
    const faq = normalizeColumnFaq(data.faq);

    // When EN files live in columns-en/, frontmatter and body are already English.
    // Legacy fallback: if EN still resolves to KO directory (no columns-en), overlay
    // archive titles only and keep Korean body — never invent stub Overview content.
    let title = fallbackTitle;
    let dateDisplay = fallbackDateDisplay;
    let readTime = fallbackReadTime;
    const contentText = cleanContent;
    let summary = fallbackSummary;
    let seoTitle = fallbackSeoTitle;

    if (publicationDate) {
      dateDisplay = formatColumnPublicationDate(publicationDate, locale, fallbackDateDisplay);
    }

    if (locale === 'en' && dir === COLUMNS_DIR) {
      const insightId = REAL_SLUG_TO_INSIGHT_ID[slug];
      const translatedPost = insightId
        ? insightsArchive.en.posts.find((post) => post.id === insightId)
        : undefined;
      if (translatedPost) {
        title = translatedPost.title;
        summary = translatedPost.summary;
        seoTitle = resolveColumnSeoTitle(data.seoTitle, title);
      }
      readTime = toEnglishReadTime(fallbackReadTime);
    }

    return {
      publicationDate,
      post: {
        slug,
        title,
        publicationDate,
        date: lastmod,
        dateDisplay,
        readTime,
        category: cat,
        categoryLabel: categoryLabelFn(cat, locale),
        blogCategory: cat === 'formation' ? 'company-formation' : 'general',
        tags: [],
        featuredImage,
        content: contentText,
        summary,
        seoTitle,
        ...(faq.length ? { faq } : {}),
      },
    };
  });
  return sortColumnPostsNewestFirst(
    postsWithArchiveDate.map(({ post }) => post),
    sourceOrder,
  );
}

export function getColumnPost(
  slug: string,
  locale: ColumnContentLocale = 'ko',
  options?: ColumnLoadOptions,
): ColumnPost | undefined {
  const realSlug = resolveSlug(slug);
  return getAllColumnPosts(locale, options).find((p) => p.slug === realSlug);
}

export function hasColumnTranslation(
  locale: ColumnContentLocale,
  slug: string,
  options?: ColumnLoadOptions,
): boolean {
  return Boolean(getColumnPost(slug, locale, options));
}

export function getColumnSlugs(): string[] {
  return getAllColumnPosts('ko').map((p) => p.slug);
}

/**
 * WO-O22 A: on-disk column slugs per public locale, for the language switcher.
 * Server-only (reads `src/content/columns-*`); the public locale layout hands
 * the result to `PublicColumnSlugsProvider` so a client switcher can link the
 * same article in another language without ever guessing a 404 URL.
 */
export function publicColumnSlugsByLocale(): Record<PublicLocale8, string[]> {
  return Object.fromEntries(
    PUBLIC_LOCALES_8.map((locale) => [locale, getAllColumnPosts(locale).map((post) => post.slug)]),
  ) as Record<PublicLocale8, string[]>;
}

export function getFeaturedColumns(count = 6, locale: ColumnContentLocale = 'ko'): ColumnPost[] {
  return getAllColumnPosts(locale).slice(0, count);
}

export function fileBackedColumnAlternateLocales(slug: string): PublicLocale8[] {
  const realSlug = resolveSlug(slug);
  return getColumnAlternateLocales(realSlug, {
    hasTranslation: (locale, value) => hasColumnTranslation(locale, value),
  });
}
