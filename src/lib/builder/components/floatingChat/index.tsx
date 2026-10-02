import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderFloatingChatCanvasNode } from '@/lib/builder/canvas/types';
import { FLOATING_CHAT_LEGACY_DEFAULTS, getFloatingChatCopy, localizedFloatingChatText } from './floating-chat-copy';
import styles from './FloatingChatInspector.module.css';

import FloatingChatRender from './Render';

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
