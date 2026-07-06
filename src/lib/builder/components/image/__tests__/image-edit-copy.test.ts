import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test } from 'vitest';
import ImageElement from '@/components/builder/canvas/elements/ImageElement';
import type { BuilderImageCanvasNode } from '@/lib/builder/canvas/types';
import ImageInspector from '../Inspector';
import { getImageEditCopy } from '../image-edit-copy';

const componentRoot = join(process.cwd(), 'src/lib/builder/components');

function createImageNode(content: Partial<BuilderImageCanvasNode['content']> = {}): BuilderImageCanvasNode {
  return {
    id: 'image-1',
    kind: 'image',
    rect: { x: 0, y: 0, width: 320, height: 180 },
    style: {},
    zIndex: 1,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      src: '/images/placeholder-image.svg',
      alt: '',
      fit: 'cover',
      cropAspect: '',
      clickAction: 'none',
      hoverSrc: undefined,
      hotspots: undefined,
      compare: undefined,
      svg: undefined,
      gif: undefined,
      filters: undefined,
      link: undefined,
      ...content,
    },
  } as BuilderImageCanvasNode;
}

describe('image edit copy', () => {
  test('localizes inspector and dialog labels for ko', () => {
    const copy = getImageEditCopy('ko');
    expect(copy.runtime.imagePlaceholder).toBe('이미지 자리 표시자');
    expect(copy.runtime.clickToAddImage).toBe('이미지를 추가하려면 클릭');
    expect(copy.runtime.changeImageOverlay).toBe('이미지 변경');
    expect(copy.runtime.beforeImageAlt('이미지')).toBe('이미지 이전');
    expect(copy.runtime.afterImageAlt('이미지')).toBe('이미지 이후');
    expect(copy.inspector.openImageEditor).toBe('자르기 / 필터 / Alt');
    expect(copy.dialog.ariaLabel).toBe('자르기, 필터, 대체 텍스트');
    expect(copy.dialog.filterPanelTitle).toBe('이미지 필터');
    expect(copy.dialog.tabs.filter).toBe('필터');
    expect(copy.dialog.crop.modalTitle).toBe('이미지 자르기');
    expect(copy.dialog.crop.previewAlt).toBe('자르기 미리보기');
    expect(copy.dialog.crop.cancel).toBe('취소');
    expect(copy.dialog.crop.aspectRatioLabels.free).toBe('자유');
    expect(copy.dialog.crop.focalPresetLabels.topLeft).toBe('왼쪽 위');
    expect(copy.dialog.crop.focalPresetAriaLabel('왼쪽 위')).toBe('초점 왼쪽 위');
    expect(copy.dialog.filterPresetLabels.highContrast).toBe('고대비');
    expect(copy.dialog.alt.placeholder).toContain('접근성');
    expect(copy.dialog.ai.promptPlaceholder).toContain('법률사무소');
    expect(copy.dialog.ai.presetPrompts.premiumBright).toContain('법률 웹사이트');
    expect(copy.dialog.ai.maskDescriptions.centerFocus).toBe('중앙 초점 마스크');
    expect(copy.dialog.ai.reviewRestored()).toBe('현재 이미지로 검토가 복원되었습니다.');
    expect(copy.dialog.ai.editedImageReady('hero.webp')).toBe('편집한 이미지가 준비되었습니다: hero.webp');
  });

  test('localizes inspector and dialog labels for zh-hant', () => {
    const copy = getImageEditCopy('zh-hant');
    expect(copy.runtime).toMatchObject({
      fallbackAlt: '圖片',
      imagePlaceholder: '圖片預留位置',
      clickToAddImage: '點擊以新增圖片',
      changeImageOverlay: '更換圖片',
      beforeAfterComparison: '前後比較',
      imageDetailFallback: '圖片詳細資訊',
      popupContentFallback: '媒體彈出內容',
      closeLightbox: '關閉燈箱',
      closePopup: '關閉彈出視窗',
    });
    expect(copy.runtime.popupDialogLabel('圖片')).toBe('圖片 彈出視窗');
    expect(copy.runtime.beforeImageAlt('圖片')).toBe('圖片 前圖');
    expect(copy.runtime.afterImageAlt('圖片')).toBe('圖片 後圖');
    expect(copy.runtime.svgIconLabels.shield).toBe('盾牌圖示');
    expect(copy.inspector.openImageEditor).toBe('裁切 / 篩選 / Alt');
    expect(copy.inspector.sourceUrlPlaceholder).toBe('https://example.com/image.jpg');
    expect(copy.inspector.hoverSwapImagePlaceholder).toBe('/images/hover.jpg');
    expect(copy.inspector.svgColorPlaceholder).toBe('#116dff 或預設的主題權杖');
    expect(copy.inspector.gifSearchQueryPlaceholder).toBe('法律辦公室');
    expect(copy.dialog.ariaLabel).toBe('裁切、篩選與替代文字');
    expect(copy.dialog.filterPanelTitle).toBe('圖片篩選');
    expect(copy.dialog.tabs.filter).toBe('篩選');
    expect(copy.dialog.crop.modalDescription).toBe('選擇此圖片的預覽長寬比。');
    expect(copy.dialog.crop.apply).toBe('套用');
    expect(copy.dialog.crop.aspectRatioLabels.free).toBe('自由');
    expect(copy.dialog.crop.focalPresetLabels.bottomRight).toBe('右下');
    expect(copy.dialog.crop.focalPresetAriaLabel('右下')).toBe('焦點右下');
    expect(copy.dialog.filterPresetLabels.soft).toBe('柔和');
    expect(copy.dialog.ai.previewMobile).toBe('行動裝置');
    expect(copy.dialog.ai.previewAltFallback).toBe('圖片預覽');
    expect(copy.dialog.ai.promptPlaceholder).toContain('法律事務所');
    expect(copy.dialog.ai.presetPrompts.editorialCalm).toContain('編輯感');
    expect(copy.dialog.ai.brushMaskDescription).toBe('筆刷遮罩');
    expect(copy.dialog.ai.maskDescriptions.rightDetail).toBe('右側細節遮罩');
    expect(copy.dialog.ai.imageEditFailed).toBe('圖片編輯失敗。');
    expect(copy.dialog.ai.reviewRestored('hero.webp')).toBe('檢視已還原：hero.webp');
    expect(copy.inspector.hotspotsPlaceholder).toBe('42, 55, 預約諮詢, /zh-hant/contact');
    expect(copy.inspector.hotspotsPlaceholder).not.toContain('/ko/contact');
  });

  test('localizes hotspot placeholders for en', () => {
    const copy = getImageEditCopy('en');
    expect(copy.runtime.imagePlaceholder).toBe('Image placeholder');
    expect(copy.runtime.changeImageOverlay).toBe('Change image');
    expect(copy.runtime.popupContentFallback).toBe('Media popup content');
    expect(copy.runtime.beforeAfterComparison).toBe('Before after comparison');
    expect(copy.runtime.svgIconLabels.scales).toBe('Scales icon');
    expect(copy.dialog.filterPanelTitle).toBe('Image filter');
    expect(copy.dialog.crop.modalTitle).toBe('Crop image');
    expect(copy.dialog.crop.noImage).toBe('No image');
    expect(copy.dialog.crop.aspectRatioLabels.free).toBe('Free');
    expect(copy.dialog.crop.focalPresetLabels.topLeft).toBe('Top left');
    expect(copy.dialog.crop.focalPresetAriaLabel('Top left')).toBe('Focal point Top left');
    expect(copy.dialog.filterPresetLabels.highContrast).toBe('High contrast');
    expect(copy.inspector.svgColorPlaceholder).toBe('#116dff or theme token via preset');
    expect(copy.inspector.gifSearchQueryPlaceholder).toBe('law office');
    expect(copy.dialog.ai.promptPlaceholder).toContain('law office');
    expect(copy.dialog.ai.presetPrompts.modernContrast).toContain('modern high-contrast');
    expect(copy.dialog.ai.maskDescriptions.topBand).toBe('Top band mask');
    expect(copy.dialog.ai.reviewRestored()).toBe('Review restored to the current image.');
    expect(copy.dialog.ai.imageEditFailed).toBe('Image edit failed.');
    expect(copy.inspector.hotspotsPlaceholder).toBe('42, 55, schedule consultation, /en/contact');
    expect(copy.inspector.hotspotsPlaceholder).not.toContain('/ko/contact');
  });

  test('renders locale-aware image placeholder copy', () => {
    const html = renderToStaticMarkup(
      React.createElement(ImageElement, {
        node: createImageNode(),
        locale: 'zh-hant',
      }),
    );

    expect(html).toContain('aria-label="圖片預留位置"');
    expect(html).toContain('點擊以新增圖片');
    expect(html).not.toContain('Image placeholder');
    expect(html).not.toContain('Click to add image');
  });

  test('renders locale-aware inline svg accessibility labels', () => {
    const html = renderToStaticMarkup(
      React.createElement(ImageElement, {
        node: createImageNode({
          svg: {
            enabled: true,
            name: 'shield',
            color: '#116dff',
          },
        }),
        locale: 'zh-hant',
      }),
    );

    expect(html).toContain('aria-label="盾牌圖示"');
    expect(html).toContain('更換圖片');
    expect(html).not.toContain('Shield icon');
    expect(html).not.toContain('이미지 변경');
  });

  test('renders service inline svg icons without falling back to img assets', () => {
    const html = renderToStaticMarkup(
      React.createElement(ImageElement, {
        node: createImageNode({
          svg: {
            enabled: true,
            name: 'service-0',
            color: 'currentColor',
          },
        }),
        locale: 'ko',
      }),
    );

    expect(html).toContain('data-builder-media-widget="inline-svg"');
    expect(html).toContain('viewBox="0 0 24 24"');
    expect(html).toContain('d="M4 18h16"');
    expect(html).not.toContain('<img');
    expect(html).not.toContain('/images/home-services/icon-0.svg');
  });

  test('renders locale-aware hotspot placeholders in the inspector', () => {
    const node = createImageNode();

    const zhHtml = renderToStaticMarkup(
      React.createElement(ImageInspector, {
        node,
        locale: 'zh-hant',
        onUpdate: () => undefined,
      }),
    );
    const enHtml = renderToStaticMarkup(
      React.createElement(ImageInspector, {
        node,
        locale: 'en',
        onUpdate: () => undefined,
      }),
    );

    expect(zhHtml).toContain('placeholder="42, 55, 預約諮詢, /zh-hant/contact"');
    expect(zhHtml).toContain('placeholder="#116dff 或預設的主題權杖"');
    expect(zhHtml).toContain('placeholder="法律辦公室"');
    expect(enHtml).toContain('placeholder="42, 55, schedule consultation, /en/contact"');
    expect(enHtml).toContain('placeholder="#116dff or theme token via preset"');
    expect(enHtml).toContain('placeholder="law office"');
    expect(zhHtml).not.toContain('/ko/contact');
    expect(zhHtml).not.toContain('placeholder="law office"');
    expect(zhHtml).not.toContain('theme token via preset');
    expect(enHtml).not.toContain('/ko/contact');
  });

  test('keeps the image inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'image/Inspector.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'image/ImageInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './ImageInspector.module.css';");
    expect(source).toContain('data-builder-image-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.actionRow}',
      'className={styles.actionButton}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={styles.linkSection}',
      'className={styles.sectionLabel}',
      'className={styles.fieldset}',
      'className={styles.legend}',
      'className={`${styles.control} ${styles.textarea}`}',
      'className={styles.checkboxRow}',
      'className={styles.range}',
      'className={styles.cropNotice}',
    ]) {
      expect(source).toContain(classUsage);
    }
    for (const removedPattern of [
      '@/components/builder/canvas/SandboxPage.module.css',
      'inspectorActionRow',
      'inspectorFieldset',
      'style={{',
      'style={',
    ]) {
      expect(source).not.toContain(removedPattern);
    }
    expect(css).toContain('.control:focus-visible');
    expect(css).toContain('.actionRow');
    expect(css).toContain('.fieldset');
    expect(css).toContain('.checkboxRow');
    expect(css).toContain('.cropNotice');
  });
});
