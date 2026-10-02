'use client';

import { useEffect, useRef, useState } from 'react';
import type { BuilderShareButtonsCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { getSocialWidgetsCopy, localizedSocialWidgetText, SHARE_BUTTONS_LEGACY_DEFAULTS } from '../social-widgets-copy';

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

export type { Provider };

export default ShareButtonsRender;
