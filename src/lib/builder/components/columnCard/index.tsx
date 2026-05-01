import { defineComponent } from '../define';
import ColumnCardInspector from './Inspector';
import type { BuilderTheme } from '@/lib/builder/site/types';
import {
  legacyCardStyleToVariant,
  resolveCardVariantStyle,
} from '@/lib/builder/site/component-variants';

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
        style={{
          width: '100%',
          height: '100%',
          background: variantStyle.background,
          border: variantStyle.border,
          borderRadius: variantStyle.borderRadius,
          boxShadow: variantStyle.boxShadow,
          backdropFilter: variantStyle.backdropFilter,
          WebkitBackdropFilter: variantStyle.WebkitBackdropFilter,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
          fontSize: 13,
        }}
      >
        Column Card
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: 20,
        borderRadius: variantStyle.borderRadius,
        border: variantStyle.border,
        background: variantStyle.background,
        boxShadow: variantStyle.boxShadow,
        backdropFilter: variantStyle.backdropFilter,
        WebkitBackdropFilter: variantStyle.WebkitBackdropFilter,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        overflow: 'hidden',
      }}
    >
      {date && (
        <span style={{ fontSize: 12, color: '#94a3b8' }}>{date}</span>
      )}
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
        {title || slug}
      </h3>
      {summary && (
        <p
          style={{
            margin: 0,
            fontSize: 14,
            color: '#64748b',
            lineHeight: 1.5,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
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
