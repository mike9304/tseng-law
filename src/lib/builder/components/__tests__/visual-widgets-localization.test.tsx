import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  BuilderDividerCanvasNode,
  BuilderFrameCanvasNode,
  BuilderIconCanvasNode,
  BuilderShapeCanvasNode,
  BuilderStickerCanvasNode,
} from '@/lib/builder/canvas/types';
import dividerComponent from '../divider';
import frameComponent from '../frame';
import iconComponent from '../icon';
import shapeComponent from '../shape';
import stickerComponent from '../sticker';
import { getVisualWidgetsCopy, STICKER_LEGACY_DEFAULTS } from '../visual-widgets-copy';

describe('visual widgets localization', () => {
  let consoleErrorSpy: { mockRestore: () => void };
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    originalConsoleError = console.error;
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation((message?: unknown, ...args: unknown[]) => {
      if (typeof message === 'string' && message.includes('useLayoutEffect does nothing on the server')) return;
      originalConsoleError(message, ...args);
    });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('returns localized visual widget copy in zh-hant', () => {
    const copy = getVisualWidgetsCopy('zh-hant');

    expect(copy.themeColorLabels.primary).toBe('主要');
    expect(copy.icon.inspector.icon).toBe('圖示');
    expect(copy.divider.inspector.styles.dashed).toBe('虛線');
    expect(copy.shape.inspector.shapes.blob).toBe('不規則形');
    expect(copy.frame.inspector.styles.corner).toBe('角落強調');
    expect(copy.sticker.defaultLabel).toBe('推薦');
    expect(copy.sticker.inspector.variants.banner).toBe('橫幅');
  });

  it('renders localized icon and divider inspector chrome in zh-hant', () => {
    const IconInspector = iconComponent.Inspector as React.ComponentType<{
      node: BuilderIconCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const DividerInspector = dividerComponent.Inspector as React.ComponentType<{
      node: BuilderDividerCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const iconNode = {
      kind: 'icon',
      content: {
        name: '*',
        size: 32,
        color: '#0f172a',
        set: 'emoji',
      },
    } as unknown as BuilderIconCanvasNode;
    const dividerNode = {
      kind: 'divider',
      content: {
        orientation: 'horizontal',
        thickness: 2,
        color: '#cbd5e1',
        style: 'dashed',
      },
    } as unknown as BuilderDividerCanvasNode;

    const iconHtml = renderToStaticMarkup(<IconInspector node={iconNode} locale="zh-hant" onUpdate={() => undefined} />);
    expect(iconHtml).toContain('圖示');
    expect(iconHtml).toContain('Emoji 或 Unicode');
    expect(iconHtml).toContain('圖示集');
    expect(iconHtml).toContain('尺寸');
    expect(iconHtml).toContain('顏色');

    const dividerHtml = renderToStaticMarkup(<DividerInspector node={dividerNode} locale="zh-hant" onUpdate={() => undefined} />);
    expect(dividerHtml).toContain('方向');
    expect(dividerHtml).toContain('水平');
    expect(dividerHtml).toContain('垂直');
    expect(dividerHtml).toContain('粗細');
    expect(dividerHtml).toContain('實線');
    expect(dividerHtml).toContain('虛線');
    expect(dividerHtml).toContain('點線');
  });

  it('renders localized shape, frame, and sticker inspector chrome in zh-hant', () => {
    const ShapeInspector = shapeComponent.Inspector as React.ComponentType<{
      node: BuilderShapeCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const FrameInspector = frameComponent.Inspector as React.ComponentType<{
      node: BuilderFrameCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const StickerInspector = stickerComponent.Inspector as React.ComponentType<{
      node: BuilderStickerCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const shapeNode = {
      kind: 'shape',
      content: {
        shape: 'blob',
        fill: '#1d4ed8',
        stroke: '#0f172a',
        strokeWidth: 2,
      },
    } as unknown as BuilderShapeCanvasNode;
    const frameNode = {
      kind: 'frame',
      content: {
        style: 'corner',
        color: '#0f172a',
        width: 4,
        radius: 12,
        label: '',
      },
    } as unknown as BuilderFrameCanvasNode;
    const stickerNode = {
      kind: 'sticker',
      content: {
        emoji: '*',
        label: '推薦',
        background: '#fde68a',
        color: '#92400e',
        rotation: -8,
        variant: 'banner',
      },
    } as unknown as BuilderStickerCanvasNode;

    const shapeHtml = renderToStaticMarkup(<ShapeInspector node={shapeNode} locale="zh-hant" onUpdate={() => undefined} />);
    expect(shapeHtml).toContain('形狀');
    expect(shapeHtml).toContain('圓形');
    expect(shapeHtml).toContain('不規則形');
    expect(shapeHtml).toContain('填滿');
    expect(shapeHtml).toContain('外框顏色');
    expect(shapeHtml).toContain('外框粗細');

    const frameHtml = renderToStaticMarkup(<FrameInspector node={frameNode} locale="zh-hant" onUpdate={() => undefined} />);
    expect(frameHtml).toContain('樣式');
    expect(frameHtml).toContain('雙線');
    expect(frameHtml).toContain('角落強調');
    expect(frameHtml).toContain('圓角 (px)');

    const stickerHtml = renderToStaticMarkup(<StickerInspector node={stickerNode} locale="zh-hant" onUpdate={() => undefined} />);
    expect(stickerHtml).toContain('Emoji / 符號');
    expect(stickerHtml).toContain('背景');
    expect(stickerHtml).toContain('文字顏色');
    expect(stickerHtml).toContain('旋轉 (deg, -45~45)');
    expect(stickerHtml).toContain('徽章');
    expect(stickerHtml).toContain('橫幅');
  });

  it('localizes the legacy default sticker label in zh-hant without changing custom labels', () => {
    const StickerRender = stickerComponent.Render as React.ComponentType<{
      node: BuilderStickerCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const StickerInspector = stickerComponent.Inspector as React.ComponentType<{
      node: BuilderStickerCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const legacyNode = {
      kind: 'sticker',
      content: {
        emoji: '*',
        label: STICKER_LEGACY_DEFAULTS.label,
        background: '#fde68a',
        color: '#92400e',
        rotation: -8,
        variant: 'badge',
      },
    } as unknown as BuilderStickerCanvasNode;
    const customNode = {
      ...legacyNode,
      content: {
        ...legacyNode.content,
        label: 'Best pick',
      },
    } as BuilderStickerCanvasNode;

    const legacyHtml = renderToStaticMarkup(<StickerRender node={legacyNode} locale="zh-hant" mode="preview" />);
    expect(legacyHtml).toContain('推薦');
    expect(legacyHtml).not.toContain('추천');

    const legacyInspectorHtml = renderToStaticMarkup(
      <StickerInspector node={legacyNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(legacyInspectorHtml).toContain('value="推薦"');
    expect(legacyInspectorHtml).not.toContain('value="추천"');

    const customHtml = renderToStaticMarkup(<StickerRender node={customNode} locale="zh-hant" mode="preview" />);
    expect(customHtml).toContain('Best pick');
    expect(customHtml).not.toContain('推薦');
  });
});
