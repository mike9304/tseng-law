import Link from 'next/link';
import { COLUMN_TOPIC_LABELS, type ColumnTopic } from '@/lib/column-topics';
import { JaPhrases } from './JaPhrases';
import r from './JaRead.module.css';

/** One decorative kanji per topic (CONCEPT-V2 §5 C5), aria-hidden. */
export const JA_GLYPH_BY_TOPIC: Record<ColumnTopic, string> = {
  criminal: '訴',
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

/** Topic, date, title, reading time and a decorative kanji; no public author attribution. */
export default function JaGlyphCard({ post }: { post: JaGlyphPost }) {
  const topic = post.topic ?? 'other';
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
      {post.readTime ? (
        <p className={r.cardAuthor}>
          {post.readTime ? <span className={r.cardRead}>{post.readTime}</span> : null}
        </p>
      ) : null}
    </Link>
  );
}
