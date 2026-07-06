'use client';

import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderCodeBlockCanvasNode } from '@/lib/builder/canvas/types';
import {
  CODE_BLOCK_LEGACY_DEFAULTS,
  getUtilityAdvancedWidgetsCopy,
  localizedUtilityText,
} from '../utility-advanced-widgets-copy';
import CodeBlockRunPanel from './CodeBlockRunPanel';
import styles from './CodeBlockInspector.module.css';

export default function CodeBlockInspector({ node, locale = 'ko', onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  if (node.kind !== 'codeBlock') return null;
  const codeNode: BuilderCodeBlockCanvasNode = node;
  const copy = getUtilityAdvancedWidgetsCopy(locale).codeBlock;
  const titleValue = localizedUtilityText(
    codeNode.content.title,
    copy.titleFallback,
    CODE_BLOCK_LEGACY_DEFAULTS.title,
  );

  return (
    <div className={styles.root} data-builder-code-block-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.title}</span>
        <input
          className={styles.control}
          type="text"
          value={titleValue}
          disabled={disabled}
          onChange={(event) => onUpdate({ title: event.target.value })}
          placeholder={copy.inspector.titlePlaceholder}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.language}</span>
        <select
          className={styles.control}
          value={codeNode.content.language}
          disabled={disabled}
          onChange={(event) => onUpdate({ language: event.target.value })}
        >
          {Object.entries(copy.languageLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.code}</span>
        <textarea
          className={`${styles.control} ${styles.textarea}`}
          rows={12}
          value={codeNode.content.code}
          disabled={disabled}
          onChange={(event) => onUpdate({ code: event.target.value })}
        />
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={codeNode.content.showLineNumbers}
          disabled={disabled}
          onChange={(event) => onUpdate({ showLineNumbers: event.target.checked })}
        />
        <span>{copy.inspector.showLineNumbers}</span>
      </label>
      <p className={styles.caption}>
        {copy.inspector.caption}
      </p>
      <CodeBlockRunPanel
        codeNode={codeNode}
        titleValue={titleValue}
        disabled={disabled}
        copy={copy.inspector}
        onUpdate={onUpdate}
      />
    </div>
  );
}
