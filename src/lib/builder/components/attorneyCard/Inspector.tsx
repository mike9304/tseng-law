import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderAttorneyCardCanvasNode } from '@/lib/builder/canvas/types';
import { normalizeLocale } from '@/lib/locales';
import {
  CARD_VARIANTS,
  legacyCardStyleToVariant,
  normalizeCardVariantKey,
} from '@/lib/builder/site/component-variants';
import { getDomainCardWidgetsCopy } from '../domain-card-widgets-copy';
import styles from './AttorneyCardInspector.module.css';

export default function AttorneyCardInspector({ node, locale = 'ko', onUpdate, disabled = false, onRequestAssetLibrary }: BuilderComponentInspectorProps) {
  const cardNode = node as BuilderAttorneyCardCanvasNode;
  const specialties = cardNode.content.specialties ?? [];
  const specialtiesText = specialties.join(', ');
  const copy = getDomainCardWidgetsCopy(normalizeLocale(locale)).attorneyCard.inspector;

  return (
    <div className={styles.root} data-builder-attorney-card-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.name}</span>
        <input type="text" value={cardNode.content.name} disabled={disabled} className={styles.control}
          onChange={(e) => onUpdate({ name: e.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.title}</span>
        <input type="text" value={cardNode.content.title} disabled={disabled} className={styles.control}
          placeholder={copy.titlePlaceholder} onChange={(e) => onUpdate({ title: e.target.value })} />
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
        <span className={styles.label}>{copy.photoUrl}</span>
        <div className={styles.assetRow}>
          <input
            type="text"
            value={cardNode.content.photo}
            disabled={disabled}
            className={`${styles.control} ${styles.assetInput}`}
            onChange={(e) => onUpdate({ photo: e.target.value })} />
          {onRequestAssetLibrary && (
            <button
              type="button"
              disabled={disabled}
              onClick={onRequestAssetLibrary}
              className={styles.assetButton}
              aria-label={copy.photoUrl}
            >
              ...
            </button>
          )}
        </div>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.specialties}</span>
        <input type="text" value={specialtiesText} disabled={disabled} className={styles.control}
          placeholder={copy.specialtiesPlaceholder} onChange={(e) => {
            const next = e.target.value.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 20);
            onUpdate({ specialties: next });
          }} />
      </label>
    </div>
  );
}
