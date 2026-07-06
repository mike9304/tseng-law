import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { BuilderContainerCanvasNode } from '@/lib/builder/canvas/types';
import containerComponent from '../container';
import containerInspector from '../container/Inspector';
import galleryInspector from '../gallery/Inspector';
import { getContainerGalleryCopy } from '../container-gallery-copy';

const componentRoot = join(process.cwd(), 'src/lib/builder/components');

describe('container and gallery inspector localization', () => {
  it('returns localized helper copy in zh-hant', () => {
    const copy = getContainerGalleryCopy('zh-hant');
    expect(copy.container).toMatchObject({
      label: '標籤',
      padding: '內距',
      cardVariant: '卡片變體',
      layoutMode: '版面模式',
      anchorTargetPlaceholder: 'services',
      stickyLabel: '發佈頁固定',
      hoverContentFallback: '懸停內容',
      columns: '欄數',
    });
    expect(copy.gallery).toMatchObject({
      layout: '版面',
      captionMode: '標題模式',
      showCaptions: '顯示標題',
      proStyle: '專業樣式',
      images: '圖片',
    });
  });

  it('renders localized container and gallery labels in zh-hant', () => {
    const ContainerInspector = containerInspector as React.ComponentType<{
      node: unknown;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
      linkPickerContext?: unknown;
    }>;
    const GalleryInspector = galleryInspector as React.ComponentType<{
      node: unknown;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;

    const containerHtml = renderToStaticMarkup(
      <ContainerInspector
        node={{
          content: {
            label: 'Hero',
            padding: 24,
            variant: 'elevated',
            link: null,
            layoutMode: 'flex',
            flexConfig: { direction: 'row', wrap: false, justifyContent: 'center', alignItems: 'center', gap: 12 },
            gridConfig: { columns: 2, rows: 2, columnGap: 8, rowGap: 8 },
            layoutItems: [{ title: 'Item 1', description: 'Desc', image: 'https://example.com/image.jpg' }],
            activeIndex: 0,
            sticky: true,
          },
        }}
        locale="zh-hant"
        onUpdate={() => undefined}
        disabled={false}
      />,
    );
    expect(containerHtml).toContain('標籤');
    expect(containerHtml).toContain('內距');
    expect(containerHtml).toContain('卡片變體');
    expect(containerHtml).toContain('點擊連結');
    expect(containerHtml).toContain('版面模式');
    expect(containerHtml).toContain('彈性設定');
    expect(containerHtml).toContain('橫向');
    expect(containerHtml).toContain('直向');
    expect(containerHtml).toContain('placeholder="services"');
    expect(containerHtml).toContain('data-builder-container-inspector="true"');

    const containerGridHtml = renderToStaticMarkup(
      <ContainerInspector
        node={{
          content: {
            label: 'Hero',
            padding: 24,
            variant: 'elevated',
            link: null,
            layoutMode: 'grid',
            flexConfig: { direction: 'row', wrap: false, justifyContent: 'center', alignItems: 'center', gap: 12 },
            gridConfig: { columns: 2, rows: 2, columnGap: 8, rowGap: 8 },
            layoutItems: [{ title: 'Item 1', description: 'Desc', image: 'https://example.com/image.jpg' }],
            activeIndex: 0,
            sticky: true,
          },
        }}
        locale="zh-hant"
        onUpdate={() => undefined}
        disabled={false}
      />,
    );
    expect(containerGridHtml).toContain('格狀設定');
    expect(containerGridHtml).toContain('欄數');

    const galleryHtml = renderToStaticMarkup(
      <GalleryInspector
        node={{
          content: {
            layout: 'pro',
            columns: 3,
            gap: 12,
            captionMode: 'overlay',
            showCaptions: true,
            activeFilter: 'all',
            proStyle: 'editorial',
            autoplay: true,
            interval: 2400,
            thumbnailPosition: 'right',
            images: [
              {
                src: 'https://example.com/image.jpg',
                alt: 'Alt',
                caption: 'Caption',
                tags: ['office', 'service'],
              },
            ],
          },
        }}
        locale="zh-hant"
        onUpdate={() => undefined}
        disabled={false}
      />,
    );
    expect(galleryHtml).toContain('data-builder-gallery-inspector="true"');
    expect(galleryHtml).toContain('版面');
    expect(galleryHtml).toContain('欄數');
    expect(galleryHtml).toContain('標題模式');
    expect(galleryHtml).toContain('顯示標題');
    expect(galleryHtml).toContain('專業樣式');
    expect(galleryHtml).toContain('圖片 URL');
    expect(galleryHtml).toContain('替代文字（alt）');
    expect(galleryHtml).toContain('新增圖片');
  });

  it('keeps the gallery inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'gallery/Inspector.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'gallery/GalleryInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './GalleryInspector.module.css';");
    expect(source).toContain('data-builder-gallery-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.inlineFields}',
      'className={styles.range}',
      'className={styles.checkboxRow}',
      'className={styles.imageList}',
      'className={styles.imageCard}',
      'className={styles.dangerButton}',
      'className={styles.primaryButton}',
    ]) {
      expect(source).toContain(classUsage);
    }
    for (const removedPattern of [
      'React.CSSProperties',
      'fieldStyle',
      'labelStyle',
      'inputStyle',
      'rowStyle',
      'style={{',
    ]) {
      expect(source).not.toContain(removedPattern);
    }
    expect(css).toContain('.inlineFields');
    expect(css).toContain('.checkboxRow');
    expect(css).toContain('.imageCard');
    expect(css).toContain('.control:focus-visible');
  });

  it('keeps the container inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'container/Inspector.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'container/ContainerInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './ContainerInspector.module.css';");
    expect(source).toContain('data-builder-container-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.sectionLabel}',
      'className={styles.linkSection}',
      'className={styles.control}',
      'className={`${styles.control} ${styles.textarea}`}',
      'className={styles.checkboxRow}',
    ]) {
      expect(source).toContain(classUsage);
    }
    for (const removedPattern of [
      'React.CSSProperties',
      'sectionLabelStyle',
      'selectStyle',
      'smallInputStyle',
      'style={{',
    ]) {
      expect(source).not.toContain(removedPattern);
    }
    expect(css).toContain('.linkSection');
    expect(css).toContain('.textarea');
    expect(css).toContain('.checkboxRow');
    expect(css).toContain('.control:focus-visible');
  });

  it('renders localized container hover-box fallback content in zh-hant', () => {
    const Render = containerComponent.Render as React.ComponentType<{
      node: BuilderContainerCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const node = {
      id: 'container-1',
      kind: 'container',
      content: {
        label: 'Hero',
        background: '#ffffff',
        borderColor: '#cbd5e1',
        borderStyle: 'solid',
        borderWidth: 0,
        borderRadius: 16,
        padding: 20,
        layoutMode: 'hoverBox',
        layoutItems: [{ title: '服務' }],
        activeIndex: 0,
        sticky: false,
        anchorTarget: undefined,
        variant: undefined,
        cardStyle: undefined,
        link: undefined,
      },
    } as unknown as BuilderContainerCanvasNode;

    const html = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="preview" />);
    expect(html).toContain('服務');
    expect(html).toContain('懸停內容');
    expect(html).not.toContain('Hover content');
  });
});
