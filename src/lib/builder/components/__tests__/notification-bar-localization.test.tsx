import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { BuilderNotificationBarCanvasNode } from '@/lib/builder/canvas/types';
import notificationBarComponent from '../notificationBar';
import {
  getNotificationBarCopy,
  NOTIFICATION_BAR_LEGACY_DEFAULTS,
} from '../notificationBar/notification-bar-copy';

const componentRoot = join(process.cwd(), 'src/lib/builder/components/notificationBar');

describe('notification bar localization', () => {
  it('returns localized notification bar copy in zh-hant', () => {
    const copy = getNotificationBarCopy('zh-hant');

    expect(copy.dismiss).toBe('關閉通知');
    expect(copy.defaults.message).toBe('收到新公告。');
    expect(copy.defaults.ctaLabel).toBe('查看詳情');
    expect(copy.inspector.message).toBe('訊息');
    expect(copy.inspector.ctaLabel).toBe('CTA 標籤');
    expect(copy.inspector.tones.info).toBe('資訊');
    expect(copy.inspector.tones.warning).toBe('警告');
    expect(copy.inspector.positions.top).toBe('上方');
    expect(copy.inspector.dismissable).toBe('顯示關閉按鈕');
  });

  it('seeds default content from notification bar legacy defaults', () => {
    expect(notificationBarComponent.defaultContent).toMatchObject({
      message: NOTIFICATION_BAR_LEGACY_DEFAULTS.message,
      ctaLabel: NOTIFICATION_BAR_LEGACY_DEFAULTS.ctaLabel,
    });
  });

  it('renders localized runtime and inspector chrome in zh-hant', () => {
    const Render = notificationBarComponent.Render as React.ComponentType<{
      node: BuilderNotificationBarCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const Inspector = notificationBarComponent.Inspector as React.ComponentType<{
      node: BuilderNotificationBarCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const node = {
      kind: 'notification-bar',
      content: {
        message: '重要公告',
        ctaLabel: '查看',
        ctaHref: '#notice',
        dismissable: true,
        tone: 'info',
        position: 'top',
      },
    } as unknown as BuilderNotificationBarCanvasNode;

    const renderHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="edit" />);
    expect(renderHtml).toContain('aria-label="關閉通知"');

    const inspectorHtml = renderToStaticMarkup(<Inspector node={node} locale="zh-hant" onUpdate={() => undefined} />);
    expect(inspectorHtml).toContain('data-builder-notification-bar-inspector="true"');
    expect(inspectorHtml).toContain('訊息');
    expect(inspectorHtml).toContain('CTA 標籤');
    expect(inspectorHtml).toContain('語氣');
    expect(inspectorHtml).toContain('資訊');
    expect(inspectorHtml).toContain('警告');
    expect(inspectorHtml).toContain('位置');
    expect(inspectorHtml).toContain('上方');
    expect(inspectorHtml).toContain('顯示關閉按鈕');
  });

  it('localizes legacy default notification message and CTA in zh-hant', () => {
    const Render = notificationBarComponent.Render as React.ComponentType<{
      node: BuilderNotificationBarCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const Inspector = notificationBarComponent.Inspector as React.ComponentType<{
      node: BuilderNotificationBarCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const node = {
      kind: 'notification-bar',
      content: {
        message: NOTIFICATION_BAR_LEGACY_DEFAULTS.message,
        ctaLabel: NOTIFICATION_BAR_LEGACY_DEFAULTS.ctaLabel,
        ctaHref: '#notice',
        dismissable: true,
        tone: 'info',
        position: 'top',
      },
    } as unknown as BuilderNotificationBarCanvasNode;

    const renderHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="edit" />);
    expect(renderHtml).toContain('收到新公告。');
    expect(renderHtml).toContain('查看詳情');
    expect(renderHtml).not.toContain('새 공지가 도착했습니다.');
    expect(renderHtml).not.toContain('자세히 보기');

    const inspectorHtml = renderToStaticMarkup(<Inspector node={node} locale="zh-hant" onUpdate={() => undefined} />);
    expect(inspectorHtml).toContain('收到新公告。');
    expect(inspectorHtml).toContain('查看詳情');
  });

  it('keeps the notification bar inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'index.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'NotificationBarInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './NotificationBarInspector.module.css';");
    expect(source).toContain('data-builder-notification-bar-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={`${styles.control} ${styles.textarea}`}',
      'className={styles.checkboxRow}',
    ]) {
      expect(source).toContain(classUsage);
    }
    expect(source).not.toContain("style={{ display: 'flex', alignItems: 'center', gap: 6 }}");
    expect(css).toContain('.textarea');
    expect(css).toContain('.control:focus-visible');
    expect(css).toContain('.checkboxRow');
  });
});
