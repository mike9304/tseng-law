import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderSocialBarCanvasNode } from '@/lib/builder/canvas/types';
import { getSocialWidgetsCopy } from '../social-widgets-copy';
import styles from './SocialBarInspector.module.css';

import SocialBarRender from './Render';

function itemsToText(items: BuilderSocialBarCanvasNode['content']['items']): string {
  return items.map((it) => `${it.provider} | ${it.href}`).join('\n');
}

function parseItems(value: string): BuilderSocialBarCanvasNode['content']['items'] {
  const allowed = new Set(['instagram', 'facebook', 'twitter', 'threads', 'youtube', 'linkedin', 'tiktok', 'whatsapp', 'line', 'kakao', 'naver', 'x']);
  const out: BuilderSocialBarCanvasNode['content']['items'] = [];
  for (const rawLine of value.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    const [provider, href] = line.split('|').map((p) => p.trim());
    if (!provider || !allowed.has(provider)) continue;
    out.push({
      provider: provider as BuilderSocialBarCanvasNode['content']['items'][number]['provider'],
      href: (href ?? '').slice(0, 2000),
    });
  }
  return out.slice(0, 20);
}

function SocialBarInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const sbNode = node as BuilderSocialBarCanvasNode;
  const c = sbNode.content;
  const copy = getSocialWidgetsCopy(locale);
  return (
    <div className={styles.root} data-builder-social-bar-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.socialBar.inspector.items}</span>
        <textarea
          rows={5}
          className={`${styles.control} ${styles.textarea}`}
          value={itemsToText(c.items)}
          disabled={disabled}
          onChange={(event) => onUpdate({ items: parseItems(event.target.value) })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.socialBar.inspector.layout}</span>
        <select
          value={c.layout}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ layout: event.target.value as BuilderSocialBarCanvasNode['content']['layout'] })}
        >
          <option value="row">{copy.layouts.row}</option>
          <option value="column">{copy.layouts.column}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.socialBar.inspector.style}</span>
        <select
          value={c.style}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ style: event.target.value as BuilderSocialBarCanvasNode['content']['style'] })}
        >
          <option value="plain">{copy.socialBar.inspector.styles.plain}</option>
          <option value="solid">{copy.socialBar.inspector.styles.solid}</option>
          <option value="outline">{copy.socialBar.inspector.styles.outline}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.socialBar.inspector.size}</span>
        <input
          type="number"
          min={24}
          max={80}
          value={c.size}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ size: Number(event.target.value) })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.socialBar.inspector.color}</span>
        <input
          type="text"
          value={c.color}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ color: event.target.value })}
        />
      </label>
    </div>
  );
}

export default defineComponent({
  kind: 'social-bar',
  displayName: '소셜 바',
  category: 'advanced',
  icon: 'SB',
  defaultContent: {
    items: [
      { provider: 'instagram' as const, href: 'https://instagram.com/' },
      { provider: 'youtube' as const, href: 'https://youtube.com/' },
      { provider: 'linkedin' as const, href: 'https://linkedin.com/' },
    ],
    layout: 'row' as const,
    style: 'plain' as const,
    size: 36,
    color: '#0f172a',
  },
  defaultStyle: {},
  defaultRect: { width: 200, height: 48 },
  Render: SocialBarRender,
  Inspector: SocialBarInspector,
});
