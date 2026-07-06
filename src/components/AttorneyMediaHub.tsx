import { getAllColumnPosts } from '@/lib/columns';
import type { Locale } from '@/lib/locales';
import AttorneyMediaHubView from '@/components/AttorneyMediaHubView';

export default function AttorneyMediaHub({ locale }: { locale: Locale }) {
  const columnCount = getAllColumnPosts(locale).length;
  return <AttorneyMediaHubView locale={locale} columnCount={columnCount} />;
}
