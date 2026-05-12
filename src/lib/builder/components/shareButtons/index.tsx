'use client';

import { useEffect, useRef, useState } from 'react';
import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderShareButtonsCanvasNode } from '@/lib/builder/canvas/types';

type Provider = BuilderShareButtonsCanvasNode['content']['providers'][number];

const LABEL: Record<Provider, string> = {
  copy: '링크 복사',
  facebook: 'Facebook',
  twitter: 'Twitter',
  kakao: '카카오',
  line: 'LINE',
  whatsapp: 'WhatsApp',
  email: '이메일',
};

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
  mode = 'edit',
}: {
  node: BuilderShareButtonsCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
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
      {c.title ? <strong>{c.title}</strong> : null}
      <div>
        {c.providers.map((p) => (
          <button
            key={p}
            type="button"
            data-builder-share-provider={p}
            onClick={() => void handleClick(p)}
            style={{ width: c.size, height: c.size }}
            aria-label={LABEL[p]}
          >
            {p === 'copy' && copied ? '✓' : LABEL[p].slice(0, 2)}
          </button>
        ))}
      </div>
    </div>
  );
}

function ShareButtonsInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const shareNode = node as BuilderShareButtonsCanvasNode;
  const c = shareNode.content;
  const all: Provider[] = ['copy', 'facebook', 'twitter', 'kakao', 'line', 'whatsapp', 'email'];
  return (
    <>
      <label>
        <span>제목</span>
        <input
          type="text"
          value={c.title}
          disabled={disabled}
          onChange={(event) => onUpdate({ title: event.target.value })}
        />
      </label>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>공급자 선택</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {all.map((p) => {
          const checked = c.providers.includes(p);
          return (
            <label key={p} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
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
              {LABEL[p]}
            </label>
          );
        })}
      </div>
      <label>
        <span>배치</span>
        <select
          value={c.layout}
          disabled={disabled}
          onChange={(event) => onUpdate({ layout: event.target.value as BuilderShareButtonsCanvasNode['content']['layout'] })}
        >
          <option value="row">Row</option>
          <option value="column">Column</option>
        </select>
      </label>
      <label>
        <span>크기</span>
        <input
          type="number"
          min={28}
          max={80}
          value={c.size}
          disabled={disabled}
          onChange={(event) => onUpdate({ size: Number(event.target.value) })}
        />
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'share-buttons',
  displayName: '공유 버튼',
  category: 'advanced',
  icon: '⇪',
  defaultContent: {
    providers: ['copy', 'facebook', 'twitter', 'kakao'] as Provider[],
    title: '공유하기',
    layout: 'row' as const,
    size: 40,
  },
  defaultStyle: {},
  defaultRect: { width: 280, height: 96 },
  Render: ShareButtonsRender,
  Inspector: ShareButtonsInspector,
});
