'use client';

import { useEffect, useRef, useState } from 'react';
import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderShareButtonsCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import {
  getSocialWidgetsCopy,
  localizedSocialWidgetText,
  SHARE_BUTTONS_LEGACY_DEFAULTS,
} from '../social-widgets-copy';
import styles from './ShareButtonsInspector.module.css';

type Provider = BuilderShareButtonsCanvasNode['content']['providers'][number];

function buildShareHref(provider: Provider, pageUrl: string, pageTitle: string): string {
  const encUrl = encodeURIComponent(pageUrl);
  const encTitle = encodeURIComponent(pageTitle);
  switch (provider) {
    case 'facebook': return `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`;
    case 'twitter': return `https://twitter.com/intent/tweet?url=${encUrl}&text=${encTitle}`;
    case 'whatsapp': return `https://wa.me/?text=${encTitle}%20${encUrl}`;
    case 'line': return `https://social-plugins.line.me/lineit/share?url=${encUrl}`;
    case 'kakao': return `https://story.kakao.com/share?url=${encUrl}`;
    case 'email': return `mailto:?subject=${encTitle}&body=${encUrl}`;
    case 'copy': return pageUrl;
    default: return pageUrl;
  }
}

function ShareButtonsRender({
  node,
  locale = 'ko',
  mode = 'edit',
}: {
  node: BuilderShareButtonsCanvasNode;
  locale?: Locale;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const copy = getSocialWidgetsCopy(locale);
  const title = localizedSocialWidgetText(c.title, copy.shareButtons.defaultTitle, SHARE_BUTTONS_LEGACY_DEFAULTS.title);
  const [copied, setCopied] = useState(false);
  const copiedTimerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (copiedTimerRef.current !== null) window.clearTimeout(copiedTimerRef.current);
  }, []);

  async function handleClick(provider: Provider) {
    if (mode === 'edit') return;
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const pageTitle = typeof document !== 'undefined' ? document.title : '';
    if (provider === 'copy') {
      try {
        await navigator.clipboard.writeText(pageUrl);
        setCopied(true);
        if (copiedTimerRef.current !== null) window.clearTimeout(copiedTimerRef.current);
        copiedTimerRef.current = window.setTimeout(() => setCopied(false), 2000);
      } catch {
        /* ignore */
      }
      return;
    }
    const href = buildShareHref(provider, pageUrl, pageTitle);
    window.open(href, '_blank', 'noopener,noreferrer,width=640,height=540');
  }

  return (
    <div
      className="builder-social-share-buttons"
      data-builder-social-widget="share"
      data-builder-share-layout={c.layout}
    >
      {title ? <strong>{title}</strong> : null}
      <div>
        {c.providers.map((p) => (
          <button
            key={p}
            type="button"
            data-builder-share-provider={p}
            onClick={() => void handleClick(p)}
            style={{ width: c.size, height: c.size }}
            aria-label={copy.shareProviders[p]}
          >
            {p === 'copy' && copied ? '✓' : copy.shareProviders[p].slice(0, 2)}
          </button>
        ))}
      </div>
    </div>
  );
}

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
