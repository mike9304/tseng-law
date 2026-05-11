import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderFloatingChatCanvasNode } from '@/lib/builder/canvas/types';

const PROVIDER_GLYPH: Record<BuilderFloatingChatCanvasNode['content']['provider'], string> = {
  whatsapp: 'WA',
  line: 'LN',
  kakao: 'K',
  telegram: 'TG',
  messenger: 'MS',
  custom: '?',
};

const PROVIDER_COLOR_FALLBACK: Record<BuilderFloatingChatCanvasNode['content']['provider'], string> = {
  whatsapp: '#25d366',
  line: '#06c755',
  kakao: '#fee500',
  telegram: '#26a5e4',
  messenger: '#0084ff',
  custom: '#0f172a',
};

function FloatingChatRender({
  node,
  mode = 'edit',
}: {
  node: BuilderFloatingChatCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const safeHref = c.href.trim() || '#';
  const bg = c.color && c.color.trim() ? c.color : PROVIDER_COLOR_FALLBACK[c.provider];

  return (
    <a
      className="builder-social-floating-chat"
      data-builder-social-widget="floating-chat"
      data-builder-floating-provider={c.provider}
      data-builder-floating-placement={c.placement}
      href={safeHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={c.label}
      onClick={(event) => {
        if (mode === 'edit') event.preventDefault();
      }}
      style={{ background: bg }}
    >
      <span aria-hidden="true">{PROVIDER_GLYPH[c.provider]}</span>
      {c.showLabel ? <span className="builder-social-floating-label">{c.label}</span> : null}
    </a>
  );
}

function FloatingChatInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const fcNode = node as BuilderFloatingChatCanvasNode;
  const c = fcNode.content;
  return (
    <>
      <label>
        <span>공급자</span>
        <select
          value={c.provider}
          disabled={disabled}
          onChange={(event) => onUpdate({ provider: event.target.value as BuilderFloatingChatCanvasNode['content']['provider'] })}
        >
          <option value="whatsapp">WhatsApp</option>
          <option value="line">LINE</option>
          <option value="kakao">Kakao</option>
          <option value="telegram">Telegram</option>
          <option value="messenger">Messenger</option>
          <option value="custom">Custom</option>
        </select>
      </label>
      <label>
        <span>링크 (deep link / URL)</span>
        <input
          type="text"
          value={c.href}
          disabled={disabled}
          onChange={(event) => onUpdate({ href: event.target.value })}
        />
      </label>
      <label>
        <span>라벨</span>
        <input
          type="text"
          value={c.label}
          disabled={disabled}
          onChange={(event) => onUpdate({ label: event.target.value })}
        />
      </label>
      <label>
        <span>위치</span>
        <select
          value={c.placement}
          disabled={disabled}
          onChange={(event) => onUpdate({ placement: event.target.value as BuilderFloatingChatCanvasNode['content']['placement'] })}
        >
          <option value="bottom-right">오른쪽 아래</option>
          <option value="bottom-left">왼쪽 아래</option>
          <option value="bottom-center">아래 중앙</option>
        </select>
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input
          type="checkbox"
          checked={c.showLabel}
          disabled={disabled}
          onChange={(event) => onUpdate({ showLabel: event.target.checked })}
        />
        <span>라벨 표시</span>
      </label>
      <label>
        <span>색</span>
        <input
          type="text"
          value={c.color}
          disabled={disabled}
          onChange={(event) => onUpdate({ color: event.target.value })}
        />
      </label>
    </>
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
    label: '문의하기',
    placement: 'bottom-right' as const,
    showLabel: false,
    color: '#25d366',
  },
  defaultStyle: {},
  defaultRect: { width: 64, height: 64 },
  Render: FloatingChatRender,
  Inspector: FloatingChatInspector,
});
