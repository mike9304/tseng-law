import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderFaqListCanvasNode } from '@/lib/builder/canvas/types';
import { DEFAULT_FAQ_CATEGORIES } from '@/lib/builder/faq/faq-shared';
import { getFaqListCopy } from './faq-list-copy';
import styles from './FaqListInspector.module.css';

export default function FaqListInspector({ node, locale = 'ko', onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const faqNode = node as BuilderFaqListCanvasNode;
  const items = faqNode.content.items ?? [];
  const source = faqNode.content.source ?? 'static';
  const copy = getFaqListCopy(locale);

  const updateItem = (index: number, patch: { question?: string; answer?: string }) => {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    onUpdate({ items: next });
  };
  const addItem = () => onUpdate({ items: [...items, { question: '', answer: '' }] });
  const removeItem = (index: number) => onUpdate({ items: items.filter((_, i) => i !== index) });

  return (
    <div className={styles.root} data-builder-faq-list-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.source}</span>
        <select
          className={styles.control}
          value={source}
          disabled={disabled}
          onChange={(e) => onUpdate({ source: e.currentTarget.value })}
        >
          <option value="static">{copy.inspector.sourceStatic}</option>
          <option value="app">{copy.inspector.sourceApp}</option>
        </select>
      </label>
      <div className={styles.inlineFields}>
        <label className={styles.field}>
          <span className={styles.label}>{copy.inspector.category}</span>
          <select
            className={styles.control}
            value={faqNode.content.categoryId ?? 'all'}
            disabled={disabled}
            onChange={(e) => onUpdate({ categoryId: e.currentTarget.value })}
        >
            <option value="all">{copy.all}</option>
            {DEFAULT_FAQ_CATEGORIES.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>{category.label[locale]}</option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>{copy.inspector.limit}</span>
          <input
            className={styles.control}
            type="number"
            min={1}
            max={100}
            value={faqNode.content.limit ?? 50}
            disabled={disabled}
            onChange={(e) => onUpdate({ limit: Number(e.currentTarget.value) })}
          />
        </label>
      </div>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={faqNode.content.showSearch ?? false}
          disabled={disabled}
          onChange={(e) => onUpdate({ showSearch: e.currentTarget.checked })}
        />
        {copy.inspector.showSearch}
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={faqNode.content.showCategoryFilter ?? true}
          disabled={disabled}
          onChange={(e) => onUpdate({ showCategoryFilter: e.currentTarget.checked })}
        />
        {copy.inspector.showCategoryFilter}
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={faqNode.content.expandFirst ?? true}
          disabled={disabled}
          onChange={(e) => onUpdate({ expandFirst: e.currentTarget.checked })}
        />
        {copy.inspector.expandFirst}
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={faqNode.content.schemaEnabled ?? true}
          disabled={disabled}
          onChange={(e) => onUpdate({ schemaEnabled: e.currentTarget.checked })}
        />
        {copy.inspector.schemaEnabled}
      </label>
      <span className={styles.sectionLabel}>{copy.inspector.items(items.length)}</span>
      <div className={styles.items}>
        {items.map((item, i) => (
          <div key={i} className={styles.itemCard}>
            <input
              className={styles.control}
              type="text"
              placeholder={copy.inspector.questionPlaceholder}
              value={item.question}
              disabled={disabled}
              onChange={(e) => updateItem(i, { question: e.target.value })}
            />
            <textarea
              className={`${styles.control} ${styles.textarea}`}
              rows={3}
              placeholder={copy.inspector.answerPlaceholder}
              value={item.answer}
              disabled={disabled}
              onChange={(e) => updateItem(i, { answer: e.target.value })}
            />
            <button className={styles.dangerButton} type="button" disabled={disabled} onClick={() => removeItem(i)}>
              {copy.inspector.removeItem}
            </button>
          </div>
        ))}
      </div>
      <button className={styles.primaryButton} type="button" disabled={disabled} onClick={addItem}>
        {copy.inspector.addItem}
      </button>
    </div>
  );
}
