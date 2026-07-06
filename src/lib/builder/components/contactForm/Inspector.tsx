import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderContactFormCanvasNode } from '@/lib/builder/canvas/types';
import styles from './ContactFormInspector.module.css';
import {
  CONTACT_FORM_LEGACY_DEFAULTS,
  CONTACT_FORM_FIELDS,
  getConversionWidgetsCopy,
  localizedContactFormSubmitLabel,
} from '../conversion-widgets-copy';

export default function ContactFormInspector({ node, locale = 'ko', onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const formNode = node as BuilderContactFormCanvasNode;
  const fields = formNode.content.fields ?? [];
  const copy = getConversionWidgetsCopy(locale).contactForm;
  const submitLabel = localizedContactFormSubmitLabel(formNode.content.submitLabel, copy.defaultSubmitLabel);

  const toggleField = (key: string) => {
    const next = fields.includes(key) ? fields.filter((f) => f !== key) : [...fields, key];
    if (next.length === 0) return;
    onUpdate({ fields: next });
  };

  return (
    <div className={styles.root} data-builder-contact-form-inspector="true">
      <div className={styles.field}>
        <span className={styles.label}>{copy.fieldsLabel(fields.length)}</span>
        <div className={styles.fieldChipList}>
          {CONTACT_FORM_FIELDS.map((key) => {
            const selected = fields.includes(key);
            return (
              <button
                key={key}
                type="button"
                disabled={disabled}
                onClick={() => toggleField(key)}
                className={`${styles.fieldChip} ${selected ? styles.fieldChipActive : ''}`}
                data-selected={selected ? 'true' : 'false'}
                aria-pressed={selected}
              >
                {copy.fieldLabels[key] ?? key}
              </button>
            );
          })}
        </div>
      </div>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.submitLabel}</span>
        <input type="text" value={submitLabel} disabled={disabled} className={styles.control}
          onChange={(e) => onUpdate({ submitLabel: e.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.actionUrl}</span>
        <input type="text" value={formNode.content.action} disabled={disabled} className={styles.control}
          placeholder={CONTACT_FORM_LEGACY_DEFAULTS.action} onChange={(e) => onUpdate({ action: e.target.value })} />
      </label>
    </div>
  );
}
