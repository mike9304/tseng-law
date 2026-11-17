import { getAllColumnPosts, type ColumnPost } from '@/lib/columns';
import { COLUMN_TOPICS, isColumnTopic, isColumnTopicUiLocale, type ColumnTopic, type ColumnTopicUiLocale } from '@/lib/column-topics';

// These are the archive languages with native subject labels and truncated topic previews.
export const COLUMN_TOPIC_ARCHIVE_LOCALES = ['ko', 'zh-hant', 'en', 'ja', 'vi'] as const;

export function columnTopicArchivePath(topic: ColumnTopic): string {
  return `/columns/topics/${topic}`;
}

export function getColumnTopicArchives() {
  const records = COLUMN_TOPIC_ARCHIVE_LOCALES.flatMap((locale) => {
    const posts = getAllColumnPosts(locale);
    return COLUMN_TOPICS.flatMap((topic) => {
      const matching = posts.filter((post) => post.topic === topic);
      return matching.length ? [{ locale, topic, posts: matching, path: columnTopicArchivePath(topic) }] : [];
    });
  });
  return records.map((record) => ({
    ...record,
    alternateLocales: records.filter((other) => other.topic === record.topic).map((other) => other.locale),
  }));
}

export function getColumnTopicArchive(locale: string, topic: string): {
  locale: ColumnTopicUiLocale;
  topic: ColumnTopic;
  posts: ColumnPost[];
  path: string;
  alternateLocales: ColumnTopicUiLocale[];
} | undefined {
  if (!isColumnTopicUiLocale(locale) || !isColumnTopic(topic)) return undefined;
  return getColumnTopicArchives().find((record) => record.locale === locale && record.topic === topic);
}
