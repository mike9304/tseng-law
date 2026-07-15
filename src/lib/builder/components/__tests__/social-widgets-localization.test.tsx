import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type {
  BuilderShareButtonsCanvasNode,
  BuilderSocialBarCanvasNode,
  BuilderSocialEmbedCanvasNode,
} from '@/lib/builder/canvas/types';
import shareButtonsComponent from '../shareButtons';
import socialBarComponent from '../socialBar';
import socialEmbedComponent from '../socialEmbed';
import {
  getSocialWidgetsCopy,
  localizedSocialWidgetText,
  SHARE_BUTTONS_LEGACY_DEFAULTS,
} from '../social-widgets-copy';

const componentRoot = join(process.cwd(), 'src/lib/builder/components');

describe('social widgets localization', () => {
  it('returns localized social widget copy in zh-hant', () => {
    const copy = getSocialWidgetsCopy('zh-hant');

    expect(copy.socialBar.navLabel).toBe('社群連結');
    expect(copy.socialBar.inspector.items).toBe('項目（provider | href）');
    expect(copy.socialBar.inspector.styles.solid).toBe('填滿');
    expect(copy.shareProviders.copy).toBe('複製連結');
    expect(copy.shareButtons.defaultTitle).toBe('分享');
    expect(copy.shareButtons.inspector.providerSelection).toBe('選擇服務商');
    expect(copy.socialEmbed.providers['instagram-feed']).toBe('Instagram 動態');
    expect(copy.socialEmbed.layouts.grid).toBe('網格');
    expect(copy.socialEmbed.editSdkHint).toBe('公開頁面會載入 SDK');
  });

  it('renders localized social bar runtime and inspector chrome in zh-hant', () => {
    const Render = socialBarComponent.Render as React.ComponentType<{
      node: BuilderSocialBarCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const Inspector = socialBarComponent.Inspector as React.ComponentType<{
      node: BuilderSocialBarCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const node = {
      kind: 'social-bar',
      content: {
        items: [{ provider: 'naver', href: 'https://naver.com' }],
        layout: 'row',
        style: 'solid',
        size: 36,
        color: '#0f172a',
      },
    } as unknown as BuilderSocialBarCanvasNode;

    const renderHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" />);
    expect(renderHtml).toContain('aria-label="社群連結"');
    expect(renderHtml).toContain('aria-label="Naver"');

    const inspectorHtml = renderToStaticMarkup(<Inspector node={node} locale="zh-hant" onUpdate={() => undefined} />);
    expect(inspectorHtml).toContain('data-builder-social-bar-inspector="true"');
    expect(inspectorHtml).toContain('項目（provider | href）');
    expect(inspectorHtml).toContain('排列');
    expect(inspectorHtml).toContain('橫向');
    expect(inspectorHtml).toContain('直向');
    expect(inspectorHtml).toContain('填滿');
    expect(inspectorHtml).toContain('外框');
    expect(inspectorHtml).toContain('尺寸');
    expect(inspectorHtml).toContain('顏色');
  });

  it('keeps the social bar inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'socialBar/index.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'socialBar/SocialBarInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './SocialBarInspector.module.css';");
    expect(source).toContain('data-builder-social-bar-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={`${styles.control} ${styles.textarea}`}',
    ]) {
      expect(source).toContain(classUsage);
    }
    expect(source).not.toContain("style={{ fontFamily: 'inherit', resize: 'vertical' }}");
    expect(css).toContain('.textarea');
    expect(css).toContain('.control:focus-visible');
  });

  it('renders localized share button runtime and inspector chrome in zh-hant', () => {
    const Render = shareButtonsComponent.Render as React.ComponentType<{
      node: BuilderShareButtonsCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const Inspector = shareButtonsComponent.Inspector as React.ComponentType<{
      node: BuilderShareButtonsCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const node = {
      kind: 'share-buttons',
      content: {
        providers: ['copy', 'email'],
        title: '分享',
        layout: 'row',
        size: 40,
      },
    } as unknown as BuilderShareButtonsCanvasNode;

    const renderHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="edit" />);
    expect(renderHtml).toContain('aria-label="複製連結"');
    expect(renderHtml).toContain('aria-label="電子郵件"');

    const inspectorHtml = renderToStaticMarkup(<Inspector node={node} locale="zh-hant" onUpdate={() => undefined} />);
    expect(inspectorHtml).toContain('data-builder-share-buttons-inspector="true"');
    expect(inspectorHtml).toContain('標題');
    expect(inspectorHtml).toContain('選擇服務商');
    expect(inspectorHtml).toContain('複製連結');
    expect(inspectorHtml).toContain('電子郵件');
    expect(inspectorHtml).toContain('排列');
    expect(inspectorHtml).toContain('尺寸');
  });

  it('keeps the share buttons inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'shareButtons/index.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'shareButtons/ShareButtonsInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './ShareButtonsInspector.module.css';");
    expect(source).toContain('data-builder-share-buttons-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={styles.providerGroup}',
      'className={styles.providerGrid}',
      'className={styles.providerOption}',
    ]) {
      expect(source).toContain(classUsage);
    }
    expect(source).not.toContain("style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}");
    expect(source).not.toContain("style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}");
    expect(source).not.toContain("style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}");
    expect(css).toContain('.providerGrid');
    expect(css).toContain('.providerOption:has(input:checked)');
    expect(css).toContain('.control:focus-visible');
  });

  it('localizes legacy default share button title in zh-hant without changing custom titles', () => {
    const Render = shareButtonsComponent.Render as React.ComponentType<{
      node: BuilderShareButtonsCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const Inspector = shareButtonsComponent.Inspector as React.ComponentType<{
      node: BuilderShareButtonsCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const legacyNode = {
      kind: 'share-buttons',
      content: {
        providers: ['copy', 'email'],
        title: SHARE_BUTTONS_LEGACY_DEFAULTS.title,
        layout: 'row',
        size: 40,
      },
    } as unknown as BuilderShareButtonsCanvasNode;
    const customNode = {
      ...legacyNode,
      content: {
        ...legacyNode.content,
        title: 'Custom share',
      },
    } as BuilderShareButtonsCanvasNode;
    const zhCopy = getSocialWidgetsCopy('zh-hant');

    expect(localizedSocialWidgetText(legacyNode.content.title, zhCopy.shareButtons.defaultTitle, SHARE_BUTTONS_LEGACY_DEFAULTS.title)).toBe('分享');
    expect(localizedSocialWidgetText(customNode.content.title, zhCopy.shareButtons.defaultTitle, SHARE_BUTTONS_LEGACY_DEFAULTS.title)).toBe('Custom share');

    const legacyHtml = renderToStaticMarkup(<Render node={legacyNode} locale="zh-hant" mode="edit" />);
    expect(legacyHtml).toContain('分享');
    expect(legacyHtml).not.toContain('공유하기');

    const legacyInspectorHtml = renderToStaticMarkup(<Inspector node={legacyNode} locale="zh-hant" onUpdate={() => undefined} />);
    expect(legacyInspectorHtml).toContain('value="分享"');
    expect(legacyInspectorHtml).not.toContain('공유하기');

    const customHtml = renderToStaticMarkup(<Render node={customNode} locale="zh-hant" mode="edit" />);
    expect(customHtml).toContain('Custom share');
    expect(customHtml).not.toContain('分享');
  });

  it('renders localized social embed runtime and inspector chrome in zh-hant', () => {
    const Render = socialEmbedComponent.Render as React.ComponentType<{
      node: BuilderSocialEmbedCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const Inspector = socialEmbedComponent.Inspector as React.ComponentType<{
      node: BuilderSocialEmbedCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const node = {
      kind: 'social-embed',
      content: {
        provider: 'instagram-feed',
        handle: '',
        channelId: '',
        layout: 'grid',
        count: 2,
        showHeader: true,
      },
    } as unknown as BuilderSocialEmbedCanvasNode;

    const renderHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="edit" />);
    expect(renderHtml).toContain('Instagram 動態');
    expect(renderHtml).toContain('@帳號');
    expect(renderHtml).toContain('Instagram 動態 外部嵌入區塊');
    expect(renderHtml).toContain('公開頁面會載入 SDK');

    const inspectorHtml = renderToStaticMarkup(<Inspector node={node} locale="zh-hant" onUpdate={() => undefined} />);
    expect(inspectorHtml).toContain('data-builder-social-embed-inspector="true"');
    expect(inspectorHtml).toContain('服務商');
    expect(inspectorHtml).toContain('Instagram 動態');
    expect(inspectorHtml).toContain('YouTube 訂閱');
    expect(inspectorHtml).toContain('帳號 / Channel ID');
    expect(inspectorHtml).toContain('網格');
    expect(inspectorHtml).toContain('列表');
    expect(inspectorHtml).toContain('數量');
    expect(inspectorHtml).toContain('顯示標頭');
  });

  it('keeps the social embed inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'socialEmbed/index.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'socialEmbed/SocialEmbedInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './SocialEmbedInspector.module.css';");
    expect(source).toContain('data-builder-social-embed-inspector="true"');
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
    expect(css).toContain('.checkboxRow');
    expect(css).toContain('.control:focus-visible');
  });

  it('discloses an unavailable social embed in preview and published across ko/zh-hant/en without synthetic tiles', () => {
    const Render = socialEmbedComponent.Render as React.ComponentType<{
      node: BuilderSocialEmbedCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const node = {
      kind: 'social-embed',
      content: {
        provider: 'instagram-feed',
        handle: '',
        channelId: '',
        layout: 'grid',
        count: 6,
        showHeader: true,
      },
    } as unknown as BuilderSocialEmbedCanvasNode;

    const locales = ['ko', 'zh-hant', 'en'] as const;

    for (const locale of locales) {
      const copy = getSocialWidgetsCopy(locale);
      for (const mode of ['preview', 'published'] as const) {
        const html = renderToStaticMarkup(<Render node={node} locale={locale} mode={mode} />);

        expect(html).toContain('data-builder-demo-disclosure="social-embed-placeholder"');
        expect(html).toContain(copy.socialEmbed.unavailableTitle);
        expect(html).toContain(copy.socialEmbed.unavailableMessage);
        expect(html).not.toContain('data-builder-social-tile');
        expect(html).not.toContain('data-builder-social-count');
        expect(html).not.toContain('builder-social-embed-grid');
      }
    }
  });

  it('keeps social embed edit guidance with disclosure and no synthetic tiles across ko/zh-hant/en', () => {
    const Render = socialEmbedComponent.Render as React.ComponentType<{
      node: BuilderSocialEmbedCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const node = {
      kind: 'social-embed',
      content: {
        provider: 'tiktok-feed',
        handle: '@creator',
        channelId: '',
        layout: 'list',
        count: 4,
        showHeader: false,
      },
    } as unknown as BuilderSocialEmbedCanvasNode;

    for (const locale of ['ko', 'zh-hant', 'en'] as const) {
      const copy = getSocialWidgetsCopy(locale);
      const html = renderToStaticMarkup(<Render node={node} locale={locale} mode="edit" />);

      expect(html).toContain('data-builder-demo-disclosure="social-embed-placeholder"');
      expect(html).toContain(copy.socialEmbed.editPlaceholder(copy.socialEmbed.providers['tiktok-feed']));
      expect(html).toContain(copy.socialEmbed.editSdkHint);
      expect(html).not.toContain('data-builder-social-tile');
    }
  });
});
