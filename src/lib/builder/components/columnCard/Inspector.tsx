import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderColumnCardCanvasNode } from '@/lib/builder/canvas/types';
import { normalizeLocale } from '@/lib/locales';
import {
  CARD_VARIANTS,
  legacyCardStyleToVariant,
  normalizeCardVariantKey,
} from '@/lib/builder/site/component-variants';
import { getDomainCardWidgetsCopy } from '../domain-card-widgets-copy';
import styles from './ColumnCardInspector.module.css';

export default function ColumnCardInspector({ node, locale = 'ko', onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const cardNode = node as BuilderColumnCardCanvasNode;
  const domainCopy = getDomainCardWidgetsCopy(normalizeLocale(locale));
  const copy = domainCopy.columnCard.inspector;
  const localeLabels = domainCopy.localeOptions;
  return (
    <div className={styles.root} data-builder-column-card-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.slug}</span>
        <input type="text" value={cardNode.content.slug} disabled={disabled} className={styles.control}
          placeholder={copy.slugPlaceholder} onChange={(e) => onUpdate({ slug: e.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.locale}</span>
        <select value={cardNode.content.locale} disabled={disabled} className={styles.control} onChange={(e) => onUpdate({ locale: e.target.value })}>
          <option value="ko">{localeLabels.ko}</option>
          <option value="zh-hant">{localeLabels['zh-hant']}</option>
          <option value="en">{localeLabels.en}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.cardVariant}</span>
        <select
          value={normalizeCardVariantKey(cardNode.content.variant ?? legacyCardStyleToVariant(cardNode.content.cardStyle))}
          disabled={disabled}
          className={styles.control}
          onChange={(e) => onUpdate({ variant: e.target.value })}
        >
          {CARD_VARIANTS.map((variant) => (
            <option key={variant.key} value={variant.key}>
              {copy.cardVariants[variant.key]}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.titleOverride}</span>
        <input type="text" value={cardNode.content.title ?? ''} disabled={disabled} className={styles.control}
          onChange={(e) => onUpdate({ title: e.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.date}</span>
        <input type="text" value={cardNode.content.date ?? ''} disabled={disabled} className={styles.control}
          placeholder={copy.datePlaceholder} onChange={(e) => onUpdate({ date: e.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.summary}</span>
        <textarea rows={3} value={cardNode.content.summary ?? ''} disabled={disabled}
          className={`${styles.control} ${styles.textarea}`}
          onChange={(e) => onUpdate({ summary: e.target.value })} />
      </label>
    </div>
  );
}
