import { normalizeLocale, type Locale } from '@/lib/locales';
import styles from './ColumnList.module.css';
import { getDomainCardWidgetsCopy } from '../domain-card-widgets-copy';

interface ColumnItem {
  slug: string;
  title: string;
  date: string;
  summary: string;
}

interface ColumnListContent {
  locale: string;
  limit: number;
  category?: string;
  items?: ColumnItem[];
}

function ColumnListRender({ node, locale = 'ko' }: { node: { content: ColumnListContent }; locale?: Locale }) {
  const { items = [], limit = 6 } = node.content;
  const copy = getDomainCardWidgetsCopy(normalizeLocale(locale));

  const displayed = items.slice(0, limit);

  if (!displayed.length) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: Math.min(limit, 3) }).map((_, i) => (
          <div key={i} className="builder-widget-empty">
            {copy.columnList.empty}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {displayed.map((item, i) => (
        <div key={i} className={styles.card}>
          <span className={styles.date}>{item.date}</span>
          <h4 className={styles.title}>
            {item.title}
          </h4>
          <p className={styles.summary}>
            {item.summary}
          </p>
        </div>
      ))}
    </div>
  );
}

export type { ColumnItem };

export default ColumnListRender;
