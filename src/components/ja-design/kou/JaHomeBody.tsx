import type { FAQItem } from '@/data/faq-content';
import type { ColumnTopic } from '@/lib/column-topics';
import { getAllColumnPosts } from '@/lib/columns';
import { siteContent } from '@/data/site-content';
import { getConsultationCtaLabel, getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import JaPageShell from '@/components/ja-design/JaPageShell';
import JaHero from './JaHero';
import JaSukashi from './JaSukashi';
import JaLightField from './JaLightField';
import JaNeeds from './JaNeeds';
import JaNumbers from './JaNumbers';
import JaPracticeIndex from './JaPracticeIndex';
import JaRead from './JaRead';
import JaAttorney from './JaAttorney';
import JaCase from './JaCase';
import JaFees from './JaFees';
import JaFlow from './JaFlow';
import JaFaqRows from './JaFaqRows';
import JaOffices from './JaOffices';
import JaClosing from './JaClosing';
import JaCapsule from './JaCapsule';
import JaMotion from './JaMotion';
import JaPhraseEnhancer from './JaPhraseEnhancer';
import k from './JaKou.module.css';

/** Headings that shared components render as plain text; phrase breaks are added after hydration. */
const PHRASE_HEADINGS = ['#about .split-title', '#results .split-title', '#faq .section-title', '#offices .section-title', '#contact .section-title'] as const;

export type JaHomePost = {
  slug: string;
  title: string;
  date: string;
  dateDisplay: string;
  readTime: string;
  categoryLabel: string;
  featuredImage: string;
  summary: string;
  topic?: ColumnTopic;
  aiAuthored?: boolean;
};

/**
 * ja home 「昊 — 光の升目」 (CONCEPT-V2 + operator amendment 2026-10-02), chapters C0–C12 in the spec's order:
 * hero, ja-sukashi, ja-needs, stats, practice, insights, about, results, ja-fees, ja-flow, faq, offices, contact.
 * `HomeLegacyPage` keeps emitting the Person and FAQ JSON-LD exactly as before.
 */
export default function JaHomeBody({ posts, faqItems }: { posts: readonly JaHomePost[]; faqItems: FAQItem[] }) {
  const columnCount = getAllColumnPosts('ja').length;
  const capsuleLabel = siteContent.ja.contact.cta.label;
  return (
    <JaPageShell page="home" className={k.root}>
      <JaHero />
      <JaSukashi />
      <JaLightField>
        <JaNeeds />
        <JaNumbers />
      </JaLightField>
      <JaPracticeIndex />
      <JaRead posts={posts} columnCount={columnCount} />
      <JaAttorney />
      <JaCase />
      <JaFees />
      <JaFlow />
      <JaFaqRows items={faqItems} />
      <JaOffices />
      <JaClosing />
      <JaCapsule
        href={getConsultationPublicMailto('ja')}
        label={capsuleLabel}
        ariaLabel={`${capsuleLabel} — ${getConsultationCtaLabel('ja')}`}
      />
      <JaMotion rootId="ja-home" />
      <JaPhraseEnhancer rootId="ja-home" selectors={PHRASE_HEADINGS} />
    </JaPageShell>
  );
}
