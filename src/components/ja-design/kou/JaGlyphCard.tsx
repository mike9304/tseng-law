import Link from 'next/link';
import { COLUMN_TOPIC_LABELS, type ColumnTopic } from '@/lib/column-topics';
import { getAiAuthorCopy, isAiAuthoredColumn } from '@/lib/ai-authored-columns';
import { JA_KOU_REUSED } from './ja-copy';
import { JaPhrases } from './JaPhrases';
import r from './JaRead.module.css';

/** One decorative kanji per topic (CONCEPT-V2 §5 C5), aria-hidden. */
export const JA_GLYPH_BY_TOPIC: Record<ColumnTopic, string> = {
  company: '社',
  labor: '労',
  litigation: '訴',
  family: '婚',
  inheritance: '続',
  visa: '留',
  tax: '税',
  lawyer: '弁',
  other: '法',
};

export type JaGlyphPost = {
  slug: string;
  title: string;
  dateDisplay: string;
  readTime: string;
  topic?: ColumnTopic;
  aiAuthored?: boolean;
};

/**
 * Type-led column card (CONCEPT-V2 §7.4): topic and date, the title as an H3, the author label exactly as the archive
 * renders it (法律AIアシスタント for AI-written posts, 曾雋崴弁護士監修 otherwise), the read time, and one pale kanji.
 */
export default function JaGlyphCard({ post }: { post: JaGlyphPost }) {
  const topic = post.topic ?? 'other';
  const author = isAiAuthoredColumn(post) ? getAiAuthorCopy('ja').label : JA_KOU_REUSED.attorneyReviewed.text;
  return (
    <Link href={`/ja/columns/${post.slug}`} className={r.card}>
      <span className={r.glyph} aria-hidden="true">
        {JA_GLYPH_BY_TOPIC[topic]}
      </span>
      <p className={r.cardMeta}>
        <span className={r.cardTopic}>{COLUMN_TOPIC_LABELS.ja[topic]}</span>
        <span className={r.cardDate}>{post.dateDisplay}</span>
      </p>
      <h3 className={r.cardTitle}>
        <JaPhrases text={post.title} />
      </h3>
      <p className={r.cardAuthor}>
        <span>{author}</span>
        {post.readTime ? <span className={r.cardRead}>{post.readTime}</span> : null}
      </p>
    </Link>
  );
}
