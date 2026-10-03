import { siteContent } from '@/data/site-content';
import { heroTrustCopy } from '@/components/HeroTrustStrip';
import { taiwanOfficeData, TAIPEI_MAPS_URL } from '@/data/office-locations';
import { teamContent } from '@/data/team-members';
import { getOrganizationName } from '@/lib/seo';
import { JA_KOU_REUSED, JA_KOU_TAB_SUFFIX } from './ja-copy';

/**
 * C3 「光の壁」 facts. Every displayed value names the file it comes from (`source.file`) and a snippet of that file
 * containing the value (`source.snippet`); ja-facts.test.tsx checks both. No count-up, no new number.
 */
export type JaFact = {
  key: string;
  /** What the numeral shows (a digit run, or a word in the display face). */
  value: string;
  /** Optional unit at .3em after the value. */
  unit?: string;
  /** Omitted for the word fact, whose caption is a full sentence. */
  label?: string;
  caption?: string;
  size: 'xl' | 'l' | 'word';
  source: { file: string; snippet: string };
};

const stats = siteContent.ja.stats;
const lead = teamContent.ja.members[0];

/** 台北・台中・高雄・屏東, from the four Japanese office titles minus 「事務所」. */
export const JA_KOU_CITIES: string[] = taiwanOfficeData.ja.map((office) => office.title.replace(new RegExp(`${JA_KOU_TAB_SUFFIX}$`), ''));

export const JA_KOU_FACTS: readonly JaFact[] = [
  {
    key: 'offices',
    value: String(stats.items[0].target),
    label: stats.items[0].label,
    caption: JA_KOU_CITIES.join('・'),
    size: 'xl',
    source: { file: 'src/data/site-content.ts', snippet: `{ target: ${stats.items[0].target}, label: '${stats.items[0].label}' }` },
  },
  {
    key: 'time',
    value: '−1',
    unit: '時間',
    label: JA_KOU_REUSED.officeTimeZoneLabel.text,
    caption: JA_KOU_REUSED.officeTimeZone.text,
    size: 'l',
    source: { file: 'src/components/OfficeMapTabs.tsx', snippet: '事務所の時間帯：台湾時間（日本時間−1時間）' },
  },
  {
    key: 'languages',
    value: String(stats.items[1].target),
    label: stats.items[1].label,
    caption: heroTrustCopy.ja.facts[2],
    size: 'l',
    source: { file: 'src/data/site-content.ts', snippet: `{ target: ${stats.items[1].target}, label: '${stats.items[1].label}' }` },
  },
  {
    key: 'licence',
    value: heroTrustCopy.ja.facts[0],
    caption: `${lead.name}${JA_KOU_REUSED.qualificationTemplate.text}${getOrganizationName('ja')}${JA_KOU_REUSED.qualificationTail.text}`,
    size: 'word',
    source: { file: 'src/components/HeroTrustStrip.tsx', snippet: `facts: ['${heroTrustCopy.ja.facts[0]}'` },
  },
];

/** Text-size facts only (O1: no practice-area count at display size until the content owner settles 7 versus 6). */
export const JA_KOU_TEXT_FACTS = [
  { value: String(stats.items[2].target), label: stats.items[2].label },
  { value: String(stats.items[3].target), label: stats.items[3].label },
] as const;

export const JA_KOU_REVIEWS = { href: TAIPEI_MAPS_URL, label: heroTrustCopy.ja.reviewsLink } as const;
