import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderIconCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderTheme } from '@/lib/builder/site/types';
import ColorPicker from '@/components/builder/editor/ColorPicker';
import { useBuilderTheme } from '@/components/builder/editor/BuilderThemeContext';
import {
  THEME_COLOR_LABELS,
  THEME_COLOR_TOKENS,
  type BuilderColorValue,
  resolveThemeColor,
} from '@/lib/builder/site/theme';
import styles from './Icon.module.css';

function LibraryIcon({
  name,
  set,
  size,
  color,
}: {
  name: string;
  set: BuilderIconCanvasNode['content']['set'];
  size: number;
  color: string;
}) {
  const strokeProps = {
    fill: 'none',
    stroke: color,
    strokeWidth: 2.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  if (set === 'lucide') {
    const normalized = name.toLowerCase();
    if (normalized.includes('briefcase')) {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-label={name}>
          <path {...strokeProps} d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" />
          <rect {...strokeProps} x="3" y="6" width="18" height="14" rx="2" />
          <path {...strokeProps} d="M3 12h18M9 12v2h6v-2" />
        </svg>
      );
    }
    if (normalized.includes('phone')) {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-label={name}>
          <path {...strokeProps} d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6.27 6.27l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
        </svg>
      );
    }
    if (normalized.includes('map')) {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-label={name}>
          <path {...strokeProps} d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle {...strokeProps} cx="12" cy="10" r="3" />
        </svg>
      );
    }
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-label={name}>
        <path {...strokeProps} d="M12 2v20M5 6h14M7 6l-4 8h8L7 6Zm10 0-4 8h8l-4-8ZM8 22h8" />
      </svg>
    );
  }

  if (set === 'fontawesome') {
    const normalized = name.toLowerCase();
    if (normalized.includes('envelope')) {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-label={name}>
          <rect x="3" y="5" width="18" height="14" rx="2" fill={color} opacity="0.16" />
          <path d="M4 7.5 12 13l8-5.5" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke={color} strokeWidth="2.5" />
        </svg>
      );
    }
    if (normalized.includes('building')) {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" aria-label={name}>
          <path d="M5 21V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v17" fill={color} opacity="0.16" />
          <path d="M5 21V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v17M3 21h18M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" />
        </svg>
      );
    }
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-label={name}>
        <path d="M14 4 20 10 10 20H4v-6L14 4Z" fill={color} opacity="0.16" />
        <path d="m14 4 6 6M12 6l6 6M4 20h6L20 10l-6-6L4 14v6Z" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return null;
}

function IconRender({
  node,
  theme,
}: {
  node: BuilderIconCanvasNode;
  theme?: BuilderTheme;
}) {
  const name = node.content.name || '✦';
  const size = Math.max(12, Math.min(120, node.content.size ?? 32));
  const color = resolveThemeColor(node.content.color, theme) ?? '#0f172a';

  return (
    <div
      className={styles.frame}
      data-builder-media-widget={node.content.set === 'lucide' || node.content.set === 'fontawesome' ? 'icon-library' : 'icon'}
    >
      {node.content.set === 'lucide' || node.content.set === 'fontawesome' ? (
        <LibraryIcon name={name} set={node.content.set} size={size} color={color} />
      ) : (
        <span
          className={styles.glyph}
          style={{
            fontSize: size,
            color,
          }}
        >
          {name}
        </span>
      )}
    </div>
  );
}

function IconInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const iconNode = node as BuilderIconCanvasNode;
  const theme = useBuilderTheme();
  const paletteTokens = THEME_COLOR_TOKENS.map((token) => ({
    token,
    label: THEME_COLOR_LABELS[token],
    color: theme.colors[token],
  }));

  return (
    <>
      <label>
        <span>Icon</span>
        <input
          type="text"
          placeholder="이모지 또는 유니코드"
          value={iconNode.content.name}
          disabled={disabled}
          onChange={(event) => onUpdate({ name: event.target.value })}
        />
      </label>
      <label>
        <span>Set</span>
        <select
          value={iconNode.content.set}
          disabled={disabled}
          onChange={(event) => onUpdate({ set: event.target.value })}
        >
          <option value="emoji">Emoji</option>
          <option value="unicode">Unicode</option>
          <option value="lucide">Lucide</option>
          <option value="fontawesome">FontAwesome</option>
        </select>
      </label>
      <label>
        <span>Size</span>
        <input
          type="number"
          min={12}
          max={120}
          step={1}
          value={iconNode.content.size}
          disabled={disabled}
          onChange={(event) => onUpdate({ size: Number(event.target.value) })}
        />
      </label>
      <label>
        <span>Color</span>
        <ColorPicker
          value={iconNode.content.color}
          paletteTokens={paletteTokens}
          disabled={disabled}
          onChange={(color: BuilderColorValue) => onUpdate({ color })}
        />
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'icon',
  displayName: '아이콘',
  category: 'media',
  icon: '✦',
  defaultContent: {
    name: '✦',
    size: 32,
    color: '#0f172a',
    set: 'emoji' as const,
  },
  defaultStyle: {},
  defaultRect: { width: 64, height: 64 },
  Render: IconRender,
  Inspector: IconInspector,
});
