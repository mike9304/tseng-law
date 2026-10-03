import type { FAQItem } from '@/data/faq-content';
import JaPageShell from '@/components/ja-design/JaPageShell';
import JaHero from './JaHero';
import JaSukashi from './JaSukashi';
import JaLightField from './JaLightField';
import JaNeeds from './JaNeeds';
import JaNumbers from './JaNumbers';
import JaMotion from './JaMotion';
import k from './JaKou.module.css';

export type JaHomePost = {
  slug: string;
  title: string;
  date: string;
  dateDisplay: string;
  readTime: string;
  categoryLabel: string;
  featuredImage: string;
  summary: string;
  topic?: import('@/lib/column-topics').ColumnTopic;
  aiAuthored?: boolean;
};

/**
 * ja home 「昊 — 光の升目」 (CONCEPT-V2 + operator amendment 2026-10-02). Chapters C0–C12 in the spec's order.
 * `HomeLegacyPage` keeps emitting the Person and FAQ JSON-LD exactly as before.
 */
export default function JaHomeBody({ posts, faqItems }: { posts: readonly JaHomePost[]; faqItems: FAQItem[] }) {
  void posts;
  void faqItems;
  return (
    <JaPageShell page="home" className={k.root}>
      <link rel="preload" href="/fonts/ja-kou-display.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <JaHero />
      <JaSukashi />
      <JaLightField>
        <JaNeeds />
        <JaNumbers />
      </JaLightField>
      <JaMotion rootId="ja-home" />
    </JaPageShell>
  );
}
