import { getColumnPost } from '@/lib/columns';
import { COLUMN_TOPIC_LABELS } from '@/lib/column-topics';
import { siteContent } from '@/data/site-content';
import { getServiceSlugs } from '@/data/service-details';

/**
 * C1 「透かし」 pairs (CONCEPT-V2 §5 C1): a Taiwanese legal term and its rendering, both quoted verbatim from the cited
 * file and line (ja-copy.test.ts checks them), each linked to the page that explains it. Link labels are read from the
 * column front matter and the service data at build time, never retyped. 資遣費 → 退職金 is deliberately not used.
 */
export type SukashiPair = {
  term: string;
  /** lang of the term: the Japanese 戸 in 戸政事務所 is written as the site writes it. */
  lang: 'zh-Hant-TW' | 'ja';
  rendering: string;
  source: { file: string; line: number };
  /** Existing label shown above the term on the stage (only the four stage terms have one). */
  eyebrow?: string;
  link: { kind: 'column' | 'service'; slug: string };
};

const services = siteContent.ja.services.items;
const serviceTitle = (slug: string) => services[getServiceSlugs().indexOf(slug)]?.title ?? '';

export const SUKASHI_PAIRS: readonly SukashiPair[] = [
  {
    term: '分公司',
    lang: 'zh-Hant-TW',
    rendering: '台湾支店',
    source: { file: 'src/data/faq-content.ts', line: 236 },
    eyebrow: COLUMN_TOPIC_LABELS.ja.company,
    link: { kind: 'column', slug: 'taiwan-company-subsidiary-vs-branch' },
  },
  {
    term: '最低服務年限',
    lang: 'zh-Hant-TW',
    rendering: '最低勤務期間',
    source: { file: 'src/data/faq-content.ts', line: 257 },
    eyebrow: COLUMN_TOPIC_LABELS.ja.labor,
    link: { kind: 'column', slug: 'taiwan-mandatory-employment-period' },
  },
  {
    term: '戸政事務所',
    lang: 'ja',
    rendering: '日本の市区町村の戸籍窓口に相当',
    source: { file: 'src/content/columns-ja/019-taiwanese-spouse-divorce-agreement-registration.md', line: 46 },
    eyebrow: COLUMN_TOPIC_LABELS.ja.family,
    link: { kind: 'column', slug: 'taiwanese-spouse-divorce-agreement-registration' },
  },
  {
    term: '羈押',
    lang: 'zh-Hant-TW',
    rendering: '勾留',
    source: { file: 'src/data/faq-content.ts', line: 287 },
    eyebrow: serviceTitle('criminal'),
    link: { kind: 'service', slug: 'criminal' },
  },
  {
    term: '存證信函',
    lang: 'zh-Hant-TW',
    rendering: '日本の内容証明郵便にあたる',
    source: { file: 'src/content/columns-ja/035-taiwan-unpaid-invoice-debt-collection.md', line: 65 },
    link: { kind: 'column', slug: 'taiwan-unpaid-invoice-debt-collection' },
  },
  {
    term: '假扣押',
    lang: 'zh-Hant-TW',
    rendering: '仮差押え',
    source: { file: 'src/content/columns-ja/035-taiwan-unpaid-invoice-debt-collection.md', line: 87 },
    link: { kind: 'service', slug: 'civil' },
  },
];

export function sukashiHref(pair: SukashiPair): string {
  return pair.link.kind === 'column' ? `/ja/columns/${pair.link.slug}` : `/ja/services/${pair.link.slug}`;
}

export function sukashiLinkLabel(pair: SukashiPair): string {
  if (pair.link.kind === 'service') return serviceTitle(pair.link.slug);
  return getColumnPost(pair.link.slug, 'ja')?.title ?? '';
}
