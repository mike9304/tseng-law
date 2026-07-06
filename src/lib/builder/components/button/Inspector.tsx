import type { BuilderComponentInspectorProps } from '../define';
import LinkPicker from '@/components/builder/editor/LinkPicker';
import type { BuilderButtonCanvasNode } from '@/lib/builder/canvas/types';
import { linkValueFromLegacy, type LinkValue } from '@/lib/builder/links';
import {
  BUTTON_VARIANTS,
  normalizeButtonVariantKey,
} from '@/lib/builder/site/component-variants';
import { getButtonInspectorCopy, localizedButtonLabel } from './button-copy';
import styles from './ButtonInspector.module.css';

export default function ButtonInspector({
  node,
  onUpdate,
  disabled = false,
  linkPickerContext,
  locale,
}: BuilderComponentInspectorProps) {
  const buttonNode = node as BuilderButtonCanvasNode;
  const content = buttonNode.content;
  const linkValue = linkValueFromLegacy(content);
  const resolvedTag = content.as ?? (linkValue?.href ? 'a' : 'button');
  const copy = getButtonInspectorCopy(locale);
  const label = localizedButtonLabel(content.label, copy.defaultLabel);

  function handleLinkChange(link: LinkValue | null) {
    onUpdate({
      link: link ?? undefined,
      href: link?.href ?? '',
      target: link?.target === '_blank' ? '_blank' : undefined,
      rel: link?.rel,
      title: link?.title,
      ariaLabel: link?.ariaLabel,
    });
  }

  return (
    <div className={styles.root} data-builder-button-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.label}</span>
        <input
          className={styles.control}
          type="text"
          value={label}
          disabled={disabled}
          onChange={(event) => onUpdate({ label: event.target.value })}
        />
      </label>

      <div className={styles.field}>
        <span className={styles.label}>{copy.link}</span>
        <LinkPicker
          value={linkValue}
          onChange={handleLinkChange}
          context={linkPickerContext}
          disabled={disabled}
          locale={locale}
        />
        <span className={styles.hint}>{copy.linkHint}</span>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>{copy.variant}</span>
        <select
          className={styles.control}
          value={normalizeButtonVariantKey(content.style)}
          disabled={disabled}
          onChange={(event) => onUpdate({ style: event.target.value })}
        >
          {BUTTON_VARIANTS.map((variant) => (
            <option key={variant.key} value={variant.key}>
              {copy.variants[variant.key]}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>{copy.htmlTag}</span>
        <select
          className={styles.control}
          value={content.as ?? ''}
          disabled={disabled}
          onChange={(event) => {
            const v = event.target.value;
            onUpdate({ as: v === '' ? undefined : v });
          }}
        >
          <option value="">{copy.autoTag(resolvedTag)}</option>
          <option value="a">{copy.anchorTag}</option>
          <option value="button">{copy.buttonTag}</option>
        </select>
      </label>

      {content.className ? (
        <div className={styles.field}>
          <span className={styles.label}>{copy.className}</span>
          <code className={styles.classNameCode}>
            {content.className}
          </code>
          <span className={styles.hint}>{copy.classHint}</span>
        </div>
      ) : null}
    </div>
  );
}
