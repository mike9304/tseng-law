import React from 'react';
import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderFloatingChatCanvasNode } from '@/lib/builder/canvas/types';
import { safeHref as toSafeHref } from '@/lib/builder/links';
import type { Locale } from '@/lib/locales';
import {
  FLOATING_CHAT_LEGACY_DEFAULTS,
  getFloatingChatCopy,
  localizedFloatingChatText,
} from './floating-chat-copy';
import styles from './FloatingChatInspector.module.css';

const PROVIDER_GLYPH: Record<BuilderFloatingChatCanvasNode['content']['provider'], string> = {
  whatsapp: 'WA',
  line: 'LN',
  kakao: 'K',
  telegram: 'TG',
  messenger: 'MS',
  'live-chat': 'CHAT',
  custom: '?',
};

const PROVIDER_COLOR_FALLBACK: Record<BuilderFloatingChatCanvasNode['content']['provider'], string> = {
  whatsapp: '#25d366',
  line: '#06c755',
  kakao: '#fee500',
  telegram: '#26a5e4',
  messenger: '#0084ff',
  'live-chat': '#0f172a',
  custom: '#0f172a',
};

function FloatingChatRender({
  node,
  mode = 'edit',
  locale = 'ko',
}: {
  node: BuilderFloatingChatCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
  locale?: Locale;
}) {
  const c = node.content;
  const copy = getFloatingChatCopy(locale);
  const label = localizedFloatingChatText(c.label, copy.defaultLabel, FLOATING_CHAT_LEGACY_DEFAULTS.label);
  const safeHref = toSafeHref(c.href) ?? '#';
  const bg = c.color && c.color.trim() ? c.color : PROVIDER_COLOR_FALLBACK[c.provider];
  const isNativeLiveChat = c.provider === 'live-chat';
  const clickGuard = mode === 'edit'
    ? {
        onClick: (event: React.MouseEvent<HTMLElement>) => {
          event.preventDefault();
        },
      }
    : {};
  const commonProps = {
    className: 'builder-social-floating-chat',
    'data-builder-social-widget': 'floating-chat',
    'data-builder-floating-provider': c.provider,
    'data-builder-floating-placement': c.placement,
    'aria-label': label,
    style: { background: bg },
  } as const;

  const content = (
    <>
      <span aria-hidden="true">{PROVIDER_GLYPH[c.provider]}</span>
      {c.showLabel ? <span className="builder-social-floating-label">{label}</span> : null}
    </>
  );

  if (isNativeLiveChat) {
    return (
      <button
        {...commonProps}
        type="button"
        data-builder-live-chat-trigger="true"
        {...clickGuard}
      >
        {content}
      </button>
    );
  }

  return (
    <a
      {...commonProps}
      href={safeHref}
      target="_blank"
      rel="noopener noreferrer"
      {...clickGuard}
    >
      {content}
    </a>
  );
}

function FloatingChatInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const fcNode = node as BuilderFloatingChatCanvasNode;
  const c = fcNode.content;
  const copy = getFloatingChatCopy(locale);
  const label = localizedFloatingChatText(c.label, copy.defaultLabel, FLOATING_CHAT_LEGACY_DEFAULTS.label);
  return (
    <div className={styles.root} data-builder-floating-chat-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.provider}</span>
        <select
          value={c.provider}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ provider: event.target.value as BuilderFloatingChatCanvasNode['content']['provider'] })}
        >
          <option value="whatsapp">{copy.inspector.providers.whatsapp}</option>
          <option value="line">{copy.inspector.providers.line}</option>
          <option value="kakao">{copy.inspector.providers.kakao}</option>
          <option value="telegram">{copy.inspector.providers.telegram}</option>
          <option value="messenger">{copy.inspector.providers.messenger}</option>
          <option value="live-chat">{copy.inspector.providers['live-chat']}</option>
          <option value="custom">{copy.inspector.providers.custom}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.href}</span>
        <input
          type="text"
          value={c.href}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ href: event.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.label}</span>
        <input
          type="text"
          value={label}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ label: event.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.placement}</span>
        <select
          value={c.placement}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ placement: event.target.value as BuilderFloatingChatCanvasNode['content']['placement'] })}
        >
          <option value="bottom-right">{copy.inspector.placements['bottom-right']}</option>
          <option value="bottom-left">{copy.inspector.placements['bottom-left']}</option>
          <option value="bottom-center">{copy.inspector.placements['bottom-center']}</option>
        </select>
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={c.showLabel}
          disabled={disabled}
          onChange={(event) => onUpdate({ showLabel: event.target.checked })}
        />
        <span>{copy.inspector.showLabel}</span>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.inspector.color}</span>
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
  kind: 'floating-chat',
  displayName: '플로팅 채팅',
  category: 'advanced',
  icon: 'FC',
  defaultContent: {
    provider: 'whatsapp' as const,
    href: 'https://wa.me/',
    label: FLOATING_CHAT_LEGACY_DEFAULTS.label,
    placement: 'bottom-right' as const,
    showLabel: false,
    color: '#25d366',
  },
  defaultStyle: {},
  defaultRect: { width: 64, height: 64 },
  Render: FloatingChatRender,
  Inspector: FloatingChatInspector,
});
