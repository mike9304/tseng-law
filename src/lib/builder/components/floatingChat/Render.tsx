import React from 'react';
import type { BuilderFloatingChatCanvasNode } from '@/lib/builder/canvas/types';
import { safeHref as toSafeHref } from '@/lib/builder/links';
import type { Locale } from '@/lib/locales';
import { FLOATING_CHAT_LEGACY_DEFAULTS, getFloatingChatCopy, localizedFloatingChatText } from './floating-chat-copy';

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

export default FloatingChatRender;
