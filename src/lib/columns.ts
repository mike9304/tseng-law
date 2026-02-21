import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Locale } from './locales';
import { insightsArchive, type InsightPost } from '../data/insights-archive';

export type ColumnCategory = 'formation' | 'legal' | 'case';

export interface ColumnPost {
  slug: string;
  title: string;
  date: string;
  dateDisplay: string;
  readTime: string;
  category: ColumnCategory;
  categoryLabel: string;
  featuredImage: string;
  content: string;
  summary: string;
}

const COLUMNS_DIR = path.join(process.cwd(), 'src/content/columns');
const COLUMNS_ZH_DIR = path.join(process.cwd(), 'src/content/columns-zh');

function getColumnsDir(locale: Locale): string {
  if (locale === 'zh-hant' && fs.existsSync(COLUMNS_ZH_DIR)) {
    return COLUMNS_ZH_DIR;
  }
  return COLUMNS_DIR;
}

function categoryFromString(cat: string): ColumnCategory {
  if (cat.includes('법인설립') || cat.includes('公司設立')) return 'formation';
  if (cat.includes('소송사례') || cat.includes('訴訟案例')) return 'case';
  return 'legal';
}

function categoryLabelFn(cat: ColumnCategory, locale: Locale): string {
  if (locale === 'zh-hant') {
    const map: Record<ColumnCategory, string> = { formation: '公司設立', legal: '法律資訊', case: '訴訟案例' };
    return map[cat];
  }
  if (locale === 'en') {
    const map: Record<ColumnCategory, string> = { formation: 'Company Setup', legal: 'Legal Information', case: 'Case Study' };
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
};

const REAL_SLUG_TO_INSIGHT_ID = Object.fromEntries(
  Object.entries(SLUG_ALIASES).map(([insightId, realSlug]) => [realSlug, insightId])
) as Record<string, string>;

function toEnglishDateDisplay(lastmod: string, fallback: string): string {
  if (!lastmod) return fallback;
  const date = new Date(lastmod);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function toEnglishReadTime(value: string): string {
  const minutes = value.match(/\d+/)?.[0];
  return minutes ? `${minutes} min read` : value;
}

function buildEnglishColumnContent(post: InsightPost): string {
  const keywords = post.keywords?.length
    ? post.keywords.slice(0, 5).map((keyword) => `- ${keyword}`).join('\n')
    : '- Taiwan law\n- Cross-border legal strategy\n- Practical compliance';
  return [
    '## Overview',
    post.summary,
    '',
    '## Key Focus Areas',
    keywords,
    '',
    '## Consultation',
    'For a case-specific legal strategy, please contact our team through the consultation page.'
  ].join('\n');
}

export function resolveSlug(slug: string): string {
  return SLUG_ALIASES[slug] || slug;
}

export function getAliasSlugs(): string[] {
  return Object.keys(SLUG_ALIASES);
}

export function getAllColumnPosts(locale: Locale = 'ko'): ColumnPost[] {
  const dir = getColumnsDir(locale);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
    const { data, content } = matter(raw);
    const slug = slugFromFilename(file);
    const categories = (data.categories as string[]) || [];
    const cat = categoryFromString(categories[0] || '');
    const fixedContent = fixImagePaths(content);
    const cleanContent = stripLeadingDuplicates(fixedContent);
    const featuredRaw = (data.featured_image as string) || '';
    const featuredImage = featuredRaw ? featuredRaw.replace(/^\.\.\/images\//, '/images/blog/') : '/images/blog/placeholder.jpg';
    const fallbackTitle = (data.title as string) || '';
    const lastmod = (data.lastmod as string) || '';
    const fallbackDateDisplay = (data.date_display as string) || '';
    const fallbackReadTime = (data.read_time as string) || '';
    const fallbackSummary = extractSummary(fixedContent);

    let title = fallbackTitle;
    let dateDisplay = fallbackDateDisplay;
    let readTime = fallbackReadTime;
    let contentText = cleanContent;
    let summary = fallbackSummary;

    if (locale === 'en') {
      const insightId = REAL_SLUG_TO_INSIGHT_ID[slug];
      const translatedPost = insightId
        ? insightsArchive.en.posts.find((post) => post.id === insightId)
        : undefined;
      if (translatedPost) {
        title = translatedPost.title;
        summary = translatedPost.summary;
        contentText = buildEnglishColumnContent(translatedPost);
      }
      dateDisplay = toEnglishDateDisplay(lastmod, fallbackDateDisplay);
      readTime = toEnglishReadTime(fallbackReadTime);
    }

    return {
      slug,
      title,
      date: lastmod,
      dateDisplay,
      readTime,
      category: cat,
      categoryLabel: categoryLabelFn(cat, locale),
      featuredImage,
      content: contentText,
      summary,
    };
  });
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export function getColumnPost(slug: string, locale: Locale = 'ko'): ColumnPost | undefined {
  const realSlug = resolveSlug(slug);
  return getAllColumnPosts(locale).find((p) => p.slug === realSlug);
}

export function getColumnSlugs(): string[] {
  return getAllColumnPosts('ko').map((p) => p.slug);
}

export function getFeaturedColumns(count = 6, locale: Locale = 'ko'): ColumnPost[] {
  return getAllColumnPosts(locale).slice(0, count);
}
