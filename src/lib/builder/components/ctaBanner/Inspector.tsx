import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderCtaBannerCanvasNode } from '@/lib/builder/canvas/types';
import { getConversionWidgetsCopy } from '../conversion-widgets-copy';
import styles from './CtaBannerInspector.module.css';

export default function CtaBannerInspector({ node, locale = 'ko', onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const ctaNode = node as BuilderCtaBannerCanvasNode;
  const copy = getConversionWidgetsCopy(locale).ctaBanner.inspector;
  return (
    <div className={styles.root} data-builder-cta-banner-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.title}</span>
        <input type="text" value={ctaNode.content.title} disabled={disabled} className={styles.control}
          onChange={(e) => onUpdate({ title: e.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.description}</span>
        <textarea rows={3} value={ctaNode.content.description} disabled={disabled}
          className={`${styles.control} ${styles.textarea}`}
          onChange={(e) => onUpdate({ description: e.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.buttonText}</span>
        <input type="text" value={ctaNode.content.buttonLabel} disabled={disabled} className={styles.control}
          onChange={(e) => onUpdate({ buttonLabel: e.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.buttonLink}</span>
        <input type="text" value={ctaNode.content.buttonHref} disabled={disabled} className={styles.control}
          placeholder={copy.buttonLinkPlaceholder} onChange={(e) => onUpdate({ buttonHref: e.target.value })} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.backgroundColor}</span>
        <input type="text" value={ctaNode.content.backgroundColor} disabled={disabled} className={styles.control}
          placeholder={copy.backgroundPlaceholder} onChange={(e) => onUpdate({ backgroundColor: e.target.value })} />
        <span
          className={styles.backgroundPreview}
          style={{ background: ctaNode.content.backgroundColor }}
          aria-hidden="true"
        />
      </label>
    </div>
  );
}
