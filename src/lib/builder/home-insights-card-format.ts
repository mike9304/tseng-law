import type { ColumnPost } from '@/lib/columns';

export type HomeInsightsCardSource = Pick<ColumnPost, 'content' | 'date' | 'dateDisplay' | 'readTime'>;

export type HomeInsightsCardLabels = {
  readonly date: string;
  readonly readTime: string;
};

function isoDateLabel(value: string): string {
  return /^\d{4}-\d{2}-\d{2}/.exec(value.trim())?.[0] ?? '';
}

function estimatedReadTimeLabel(content: string): string {
  const text = content.trim();
  if (!text) return '';
  return `${Math.max(1, Math.round(text.length / 200))} min`;
}

export function resolveHomeInsightsCardLabels(
  post: HomeInsightsCardSource,
  dateFallback: string,
): HomeInsightsCardLabels {
  return {
    date: isoDateLabel(post.dateDisplay) || post.dateDisplay || isoDateLabel(post.date) || post.date || dateFallback,
    readTime: estimatedReadTimeLabel(post.content) || post.readTime || '',
  };
}
