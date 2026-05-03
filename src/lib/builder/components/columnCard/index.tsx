import { defineComponent } from '../define';
import ColumnCardInspector from './Inspector';
import type { BuilderTheme } from '@/lib/builder/site/types';
import {
  legacyCardStyleToVariant,
  resolveCardVariantStyle,
} from '@/lib/builder/site/component-variants';
import styles from './ColumnCard.module.css';

interface ColumnCardContent {
  slug: string;
  locale: string;
  title?: string;
  date?: string;
  summary?: string;
  cardStyle?: string;
  variant?: string;
}

function ColumnCardRender({
  node,
  theme,
}: {
  node: { content: ColumnCardContent };
  theme?: BuilderTheme;
}) {
  const { title = '', date = '', summary = '', slug = '' } = node.content;
  const variantStyle = resolveCardVariantStyle(
    node.content.variant ?? legacyCardStyleToVariant(node.content.cardStyle),
    theme,
  );

  if (!title && !slug) {
    return (
      <div
        className="builder-widget-empty"
        style={{
          width: '100%',
          height: '100%',
          background: variantStyle.background,
          border: variantStyle.border,
          borderRadius: variantStyle.borderRadius,
          boxShadow: variantStyle.boxShadow,
          backdropFilter: variantStyle.backdropFilter,
          WebkitBackdropFilter: variantStyle.WebkitBackdropFilter,
        }}
      >
        Column Card
      </div>
    );
  }

  return (
    <div
      className={styles.card}
      style={{
        borderRadius: variantStyle.borderRadius,
        border: variantStyle.border,
        background: variantStyle.background,
        boxShadow: variantStyle.boxShadow,
        backdropFilter: variantStyle.backdropFilter,
        WebkitBackdropFilter: variantStyle.WebkitBackdropFilter,
      }}
    >
      {date && (
        <span className={styles.date}>{date}</span>
      )}
      <h3 className={styles.title}>
        {title || slug}
      </h3>
      {summary && (
        <p className={styles.summary}>
          {summary}
        </p>
      )}
    </div>
  );
}

export default defineComponent({
  kind: 'columnCard',
  displayName: 'columnCard',
  category: 'domain',
  icon: '◻',
  defaultContent: {
    slug: '',
    locale: 'ko',
    title: '',
    date: '',
    summary: '',
    variant: 'flat' as const,
  },
  defaultStyle: {},
  defaultRect: { width: 400, height: 250 },
  Render: ColumnCardRender,
  Inspector: ColumnCardInspector,
});
