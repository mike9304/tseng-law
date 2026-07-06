import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import floatingChat from '../index';
import {
  builderCanvasNodeSchema,
  type BuilderFloatingChatCanvasNode,
} from '@/lib/builder/canvas/types';
import { FLOATING_CHAT_LEGACY_DEFAULTS, getFloatingChatCopy } from '../floating-chat-copy';

const componentRoot = join(process.cwd(), 'src/lib/builder/components/floatingChat');

describe('floating chat component', () => {
  it('does not render unsafe href protocols', () => {
    const html = renderToStaticMarkup(
      React.createElement(floatingChat.Render, {
        node: makeNode('javascript:alert(document.domain)'),
        mode: 'published',
      }),
    );

    expect(html).toContain('href="#"');
    expect(html).not.toContain('javascript:');
  });

  it('keeps safe chat URLs intact', () => {
    const html = renderToStaticMarkup(
      React.createElement(floatingChat.Render, {
        node: makeNode('https://wa.me/15551234567'),
        mode: 'published',
      }),
    );

    expect(html).toContain('href="https://wa.me/15551234567"');
  });

  it('returns localized floating chat inspector copy in zh-hant', () => {
    const copy = getFloatingChatCopy('zh-hant');

    expect(copy.inspector.provider).toBe('服務商');
    expect(copy.defaultLabel).toBe('聯絡我們');
    expect(copy.inspector.providers['live-chat']).toBe('即時聊天');
    expect(copy.inspector.providers.custom).toBe('自訂');
    expect(copy.inspector.href).toBe('連結（deep link / URL）');
    expect(copy.inspector.label).toBe('標籤');
    expect(copy.inspector.placement).toBe('位置');
    expect(copy.inspector.placements['bottom-right']).toBe('右下');
    expect(copy.inspector.showLabel).toBe('顯示標籤');
    expect(copy.inspector.color).toBe('顏色');
  });

  it('renders localized inspector chrome in zh-hant', () => {
    const html = renderToStaticMarkup(
      React.createElement(floatingChat.Inspector as React.ComponentType<{
        node: BuilderFloatingChatCanvasNode;
        locale?: 'ko' | 'zh-hant' | 'en';
        onUpdate: (props: Record<string, unknown>) => void;
        disabled?: boolean;
      }>, {
        node: makeNode('https://wa.me/15551234567'),
        locale: 'zh-hant',
        onUpdate: () => undefined,
      }),
    );

    expect(html).toContain('服務商');
    expect(html).toContain('data-builder-floating-chat-inspector="true"');
    expect(html).toContain('即時聊天');
    expect(html).toContain('自訂');
    expect(html).toContain('連結（deep link / URL）');
    expect(html).toContain('標籤');
    expect(html).toContain('位置');
    expect(html).toContain('右下');
    expect(html).toContain('左下');
    expect(html).toContain('下方置中');
    expect(html).toContain('顯示標籤');
    expect(html).toContain('顏色');
  });

  it('keeps the floating chat inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'index.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'FloatingChatInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './FloatingChatInspector.module.css';");
    expect(source).toContain('data-builder-floating-chat-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={styles.checkboxRow}',
    ]) {
      expect(source).toContain(classUsage);
    }
    expect(source).not.toContain("style={{ display: 'flex', alignItems: 'center', gap: 6 }}");
    expect(css).toContain('.control:focus-visible');
    expect(css).toContain('.checkboxRow');
    expect(css).toContain('accent-color: #116dff');
  });

  it('localizes the legacy default label in zh-hant without changing custom labels', () => {
    const legacyNode = makeNode('https://wa.me/15551234567', FLOATING_CHAT_LEGACY_DEFAULTS.label, true);
    const customNode = makeNode('https://wa.me/15551234567', 'Chat now', true);

    const legacyHtml = renderToStaticMarkup(
      React.createElement(floatingChat.Render, {
        node: legacyNode,
        mode: 'published',
        locale: 'zh-hant',
      }),
    );
    expect(legacyHtml).toContain('aria-label="聯絡我們"');
    expect(legacyHtml).toContain('聯絡我們');
    expect(legacyHtml).not.toContain('문의하기');

    const inspectorHtml = renderToStaticMarkup(
      React.createElement(floatingChat.Inspector as React.ComponentType<{
        node: BuilderFloatingChatCanvasNode;
        locale?: 'ko' | 'zh-hant' | 'en';
        onUpdate: (props: Record<string, unknown>) => void;
        disabled?: boolean;
      }>, {
        node: legacyNode,
        locale: 'zh-hant',
        onUpdate: () => undefined,
      }),
    );
    expect(inspectorHtml).toContain('value="聯絡我們"');
    expect(inspectorHtml).not.toContain('value="문의하기"');

    const customHtml = renderToStaticMarkup(
      React.createElement(floatingChat.Render, {
        node: customNode,
        mode: 'published',
        locale: 'zh-hant',
      }),
    );
    expect(customHtml).toContain('aria-label="Chat now"');
    expect(customHtml).toContain('Chat now');
    expect(customHtml).not.toContain('聯絡我們');
  });
});

function makeNode(href: string, label = 'Chat', showLabel = false): BuilderFloatingChatCanvasNode {
  return builderCanvasNodeSchema.parse({
    id: 'floating-chat-1',
    kind: 'floating-chat',
    rect: { x: 0, y: 0, width: 64, height: 64 },
    zIndex: 1,
    content: {
      provider: 'whatsapp',
      href,
      label,
      placement: 'bottom-right',
      showLabel,
      color: '#25d366',
    },
  }) as BuilderFloatingChatCanvasNode;
}
