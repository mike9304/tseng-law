import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type {
  BuilderAnchorMenuCanvasNode,
  BuilderCodeBlockCanvasNode,
  BuilderParallaxBgCanvasNode,
  BuilderVideoEmbedCanvasNode,
} from '@/lib/builder/canvas/types';
import anchorMenuComponent from '../anchorMenu';
import codeBlockComponent from '../codeBlock';
import parallaxBgComponent from '../parallaxBg';
import {
  ANCHOR_MENU_LEGACY_LABELS,
  CODE_BLOCK_LEGACY_DEFAULTS,
  getUtilityAdvancedWidgetsCopy,
  PARALLAX_BG_LEGACY_DEFAULTS,
} from '../utility-advanced-widgets-copy';
import videoEmbedComponent from '../videoEmbed';

const componentRoot = join(process.cwd(), 'src/lib/builder/components');

describe('utility advanced widget localization', () => {
  it('returns localized helper copy in zh-hant', () => {
    const copy = getUtilityAdvancedWidgetsCopy('zh-hant');

    expect(copy.codeBlock.inspector).toMatchObject({
      title: '標題',
      language: '語言',
      showLineNumbers: '顯示行號',
    });
    expect(copy.codeBlock.languageLabels.text).toBe('純文字');
    expect(copy.videoEmbed.inspector).toMatchObject({
      provider: '供應商',
      sourceUrl: '來源 URL',
      showControls: '顯示控制列',
    });
    expect(copy.videoEmbed.runtime.emptyUrl).toBe('請輸入影片 URL');
    expect(copy.videoEmbed.runtime.invalidUrl('YouTube')).toBe('無效的 YouTube URL');
    expect(copy.videoEmbed.runtime.iframeTitle).toBe('影片嵌入');
    expect(copy.anchorMenu).toMatchObject({
      navLabel: '區段導覽',
      empty: '請在檢查器新增區段 anchor',
    });
    expect(copy.parallaxBg.defaultTitle).toBe('值得信賴的法律夥伴');
  });

  it('seeds anchor menu and parallax defaults from utility legacy constants', () => {
    expect(anchorMenuComponent.defaultContent).toMatchObject({
      items: [
        { label: ANCHOR_MENU_LEGACY_LABELS.about, anchorId: 'about' },
        { label: ANCHOR_MENU_LEGACY_LABELS.services, anchorId: 'services' },
        { label: ANCHOR_MENU_LEGACY_LABELS.contact, anchorId: 'contact' },
      ],
    });
    expect(parallaxBgComponent.defaultContent).toMatchObject({
      contentTitle: PARALLAX_BG_LEGACY_DEFAULTS.title,
      contentSubtitle: PARALLAX_BG_LEGACY_DEFAULTS.subtitle,
    });
  });

  it('renders localized code block and video embed inspector chrome in zh-hant', () => {
    const CodeRender = codeBlockComponent.Render as React.ComponentType<{
      node: BuilderCodeBlockCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const CodeInspector = codeBlockComponent.Inspector as React.ComponentType<{
      node: BuilderCodeBlockCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const VideoInspector = videoEmbedComponent.Inspector as React.ComponentType<{
      node: BuilderVideoEmbedCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const VideoRender = videoEmbedComponent.Render as React.ComponentType<{
      node: BuilderVideoEmbedCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const codeNode = {
      id: 'code-1',
      kind: 'codeBlock',
      content: {
        title: CODE_BLOCK_LEGACY_DEFAULTS.title,
        language: 'text',
        code: '',
        showLineNumbers: true,
      },
    } as unknown as BuilderCodeBlockCanvasNode;
    const videoNode = {
      id: 'video-1',
      kind: 'video-embed',
      content: {
        provider: 'url',
        src: '',
        autoplay: false,
        loop: false,
        muted: false,
        controls: true,
        posterImage: undefined,
      },
    } as unknown as BuilderVideoEmbedCanvasNode;

    const codeHtml = renderToStaticMarkup(<CodeRender node={codeNode} locale="zh-hant" mode="preview" />);
    expect(codeHtml).toContain('程式碼區塊');
    expect(codeHtml).toContain('請輸入程式碼片段');
    expect(codeHtml).toContain('純文字');
    expect(codeHtml).not.toContain('코드 스니펫을 입력하세요');

    const codeInspectorHtml = renderToStaticMarkup(
      <CodeInspector node={codeNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(codeInspectorHtml).toContain('data-builder-code-block-inspector="true"');
    expect(codeInspectorHtml).toContain('標題');
    expect(codeInspectorHtml).toContain('語言');
    expect(codeInspectorHtml).toContain('顯示行號');
    expect(codeInspectorHtml).toContain('需要可執行 HTML/embed 時');
    expect(codeInspectorHtml).toContain('value="程式碼區塊"');

    const videoInspectorHtml = renderToStaticMarkup(
      <VideoInspector node={videoNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(videoInspectorHtml).toContain('data-builder-video-embed-inspector="true"');
    expect(videoInspectorHtml).toContain('供應商');
    expect(videoInspectorHtml).toContain('直接 URL');
    expect(videoInspectorHtml).toContain('封面圖片 URL');
    expect(videoInspectorHtml).toContain('顯示控制列');
    expect(videoInspectorHtml).not.toContain('Show controls');

    const emptyVideoHtml = renderToStaticMarkup(<VideoRender node={videoNode} locale="zh-hant" />);
    expect(emptyVideoHtml).toContain('請輸入影片 URL');
    expect(emptyVideoHtml).not.toContain('영상 URL을 입력하세요');

    const invalidVideoHtml = renderToStaticMarkup(
      <VideoRender node={{ ...videoNode, content: { ...videoNode.content, provider: 'youtube', src: 'https://example.com/not-video' } }} locale="zh-hant" />,
    );
    expect(invalidVideoHtml).toContain('無效的 YouTube URL');
    expect(invalidVideoHtml).not.toContain('잘못된');
  });

  it('keeps the code block inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'codeBlock/Inspector.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'codeBlock/CodeBlockInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './CodeBlockInspector.module.css';");
    expect(source).toContain('data-builder-code-block-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={`${styles.control} ${styles.textarea}`}',
      'className={styles.checkboxRow}',
      'className={styles.caption}',
    ]) {
      expect(source).toContain(classUsage);
    }
    for (const removedPattern of [
      'React.CSSProperties',
      'labelStyle',
      'captionStyle',
      'style={{',
    ]) {
      expect(source).not.toContain(removedPattern);
    }
    expect(css).toContain('.textarea');
    expect(css).toContain('.checkboxRow');
    expect(css).toContain('.control:focus-visible');
  });

  it('keeps the video embed inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'videoEmbed/index.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'videoEmbed/VideoEmbedInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './VideoEmbedInspector.module.css';");
    expect(source).toContain('data-builder-video-embed-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={styles.checkboxRow}',
    ]) {
      expect(source).toContain(classUsage);
    }
    for (const removedInlineStyle of [
      "style={{ display: 'flex', alignItems: 'center', gap: 8 }}",
      'style=',
      'React.CSSProperties',
    ]) {
      expect(source).not.toContain(removedInlineStyle);
    }
    expect(css).toContain('.control:focus-visible');
    expect(css).toContain('.checkboxRow');
  });

  it('renders localized anchor menu and parallax defaults in zh-hant', () => {
    const AnchorRender = anchorMenuComponent.Render as React.ComponentType<{
      node: BuilderAnchorMenuCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const AnchorInspector = anchorMenuComponent.Inspector as React.ComponentType<{
      node: BuilderAnchorMenuCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const ParallaxRender = parallaxBgComponent.Render as React.ComponentType<{
      node: BuilderParallaxBgCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const ParallaxInspector = parallaxBgComponent.Inspector as React.ComponentType<{
      node: BuilderParallaxBgCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const anchorNode = {
      id: 'anchor-1',
      kind: 'anchor-menu',
      content: {
        items: [
          { label: ANCHOR_MENU_LEGACY_LABELS.about, anchorId: 'about' },
          { label: ANCHOR_MENU_LEGACY_LABELS.services, anchorId: 'services' },
          { label: ANCHOR_MENU_LEGACY_LABELS.contact, anchorId: 'contact' },
        ],
        sticky: true,
        offsetTopPx: 80,
        activeColor: '#0f172a',
      },
    } as unknown as BuilderAnchorMenuCanvasNode;
    const emptyAnchorNode = {
      ...anchorNode,
      content: { ...anchorNode.content, items: [] },
    } as BuilderAnchorMenuCanvasNode;
    const parallaxNode = {
      id: 'parallax-1',
      kind: 'parallax-bg',
      content: {
        imageUrl: '',
        overlayColor: 'rgba(15, 23, 42, 0.4)',
        speed: 0.4,
        contentTitle: PARALLAX_BG_LEGACY_DEFAULTS.title,
        contentSubtitle: PARALLAX_BG_LEGACY_DEFAULTS.subtitle,
      },
    } as unknown as BuilderParallaxBgCanvasNode;

    const anchorHtml = renderToStaticMarkup(<AnchorRender node={anchorNode} locale="zh-hant" mode="preview" />);
    expect(anchorHtml).toContain('aria-label="區段導覽"');
    expect(anchorHtml).toContain('介紹');
    expect(anchorHtml).toContain('服務');
    expect(anchorHtml).toContain('聯絡');
    expect(anchorHtml).not.toContain('소개');

    const emptyAnchorHtml = renderToStaticMarkup(<AnchorRender node={emptyAnchorNode} locale="zh-hant" mode="edit" />);
    expect(emptyAnchorHtml).toContain('請在檢查器新增區段 anchor');

    const anchorInspectorHtml = renderToStaticMarkup(
      <AnchorInspector node={anchorNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(anchorInspectorHtml).toContain('data-builder-anchor-menu-inspector="true"');
    expect(anchorInspectorHtml).toContain('項目（label | anchorId）');
    expect(anchorInspectorHtml).toContain('頂部偏移 (px)');
    expect(anchorInspectorHtml).toContain('啟用色彩');
    expect(anchorInspectorHtml).toContain('介紹 | about');

    const parallaxHtml = renderToStaticMarkup(<ParallaxRender node={parallaxNode} locale="zh-hant" mode="preview" />);
    expect(parallaxHtml).toContain('值得信賴的法律夥伴');
    expect(parallaxHtml).toContain('連結韓國與台灣兩套法制的專業顧問');
    expect(parallaxHtml).not.toContain('신뢰의 법무 파트너');

    const parallaxInspectorHtml = renderToStaticMarkup(
      <ParallaxInspector node={parallaxNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(parallaxInspectorHtml).toContain('圖片 URL');
    expect(parallaxInspectorHtml).toContain('覆蓋色彩');
    expect(parallaxInspectorHtml).toContain('視差速度 (0~2)');
    expect(parallaxInspectorHtml).toContain('副標題');
    expect(parallaxInspectorHtml).toContain('value="值得信賴的法律夥伴"');
    expect(parallaxInspectorHtml).not.toContain('한국과 대만');
  });

  it('keeps the anchor menu inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'anchorMenu/index.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'anchorMenu/AnchorMenuInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './AnchorMenuInspector.module.css';");
    expect(source).toContain('data-builder-anchor-menu-inspector="true"');
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
    expect(source).not.toContain("style={{ fontFamily: 'inherit', resize: 'vertical' }}");
    expect(source).not.toContain("style={{ display: 'flex', alignItems: 'center', gap: 6 }}");
    expect(css).toContain('.textarea');
    expect(css).toContain('.control:focus-visible');
    expect(css).toContain('.checkboxRow');
  });
});
