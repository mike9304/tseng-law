'use client';

import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderShareButtonsCanvasNode } from '@/lib/builder/canvas/types';
import { getSocialWidgetsCopy, localizedSocialWidgetText, SHARE_BUTTONS_LEGACY_DEFAULTS } from '../social-widgets-copy';
import styles from './ShareButtonsInspector.module.css';

import ShareButtonsRender, { Provider } from './Render';

function ShareButtonsInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const shareNode = node as BuilderShareButtonsCanvasNode;
  const c = shareNode.content;
  const copy = getSocialWidgetsCopy(locale);
  const title = localizedSocialWidgetText(c.title, copy.shareButtons.defaultTitle, SHARE_BUTTONS_LEGACY_DEFAULTS.title);
  const all: Provider[] = ['copy', 'facebook', 'twitter', 'kakao', 'line', 'whatsapp', 'email'];
  return (
    <div className={styles.root} data-builder-share-buttons-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.shareButtons.inspector.title}</span>
        <input
          type="text"
          value={title}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ title: event.target.value })}
        />
      </label>
      <div className={styles.providerGroup}>
        <span className={styles.providerLabel}>{copy.shareButtons.inspector.providerSelection}</span>
        <div className={styles.providerGrid}>
          {all.map((p) => {
            const checked = c.providers.includes(p);
            return (
              <label key={p} className={styles.providerOption}>
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={(event) => {
                    const next = event.target.checked
                      ? [...c.providers, p]
                      : c.providers.filter((value) => value !== p);
                    onUpdate({ providers: next.slice(0, 10) });
                  }}
                />
                <span>{copy.shareProviders[p]}</span>
              </label>
            );
          })}
        </div>
      </div>
      <label className={styles.field}>
        <span className={styles.label}>{copy.shareButtons.inspector.layout}</span>
        <select
          value={c.layout}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ layout: event.target.value as BuilderShareButtonsCanvasNode['content']['layout'] })}
        >
          <option value="row">{copy.layouts.row}</option>
          <option value="column">{copy.layouts.column}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.shareButtons.inspector.size}</span>
        <input
          type="number"
          min={28}
          max={80}
          value={c.size}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ size: Number(event.target.value) })}
        />
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'share-buttons',
  displayName: '공유 버튼',
  category: 'advanced',
  icon: '⇪',
  defaultContent: {
    providers: ['copy', 'facebook', 'twitter', 'kakao'] as Provider[],
    title: SHARE_BUTTONS_LEGACY_DEFAULTS.title,
    layout: 'row' as const,
    size: 40,
  },
  defaultStyle: {},
  defaultRect: { width: 280, height: 96 },
  Render: ShareButtonsRender,
  Inspector: ShareButtonsInspector,
});
