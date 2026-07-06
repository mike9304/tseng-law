import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type {
  BuilderMenuBarCanvasNode,
  BuilderSectionCanvasNode,
  BuilderSpacerCanvasNode,
} from '@/lib/builder/canvas/types';
import {
  getLayoutNavigationWidgetsCopy,
  MENU_BAR_LEGACY_DEFAULT_ITEMS,
} from '../layout-navigation-widgets-copy';
import menuBarComponent from '../menuBar';
import sectionComponent from '../section';
import spacerComponent from '../spacer';

const componentRoot = join(process.cwd(), 'src/lib/builder/components');

describe('layout and navigation widget localization', () => {
  it('returns localized helper copy in zh-hant', () => {
    const copy = getLayoutNavigationWidgetsCopy('zh-hant');

    expect(copy.section).toMatchObject({
      defaultLabel: '區段',
      maxWidthDisplay: '最大寬度',
      inspector: {
        label: '標籤',
        padding: '內距',
      },
    });
    expect(copy.spacer.editLabel(48)).toBe('間距 48px');
    expect(copy.menuBar).toMatchObject({
      navLabel: '主要導覽',
      openMenu: '開啟選單',
      empty: '請在檢查器新增選單項目',
    });
    expect(copy.menuBar.defaultItems[0]).toMatchObject({ label: '服務', href: '/zh-hant/services' });
    expect(copy.menuBar.inspector.variantOptions.mega).toBe('大型選單');
  });

  it('seeds menu bar default content from legacy default items', () => {
    expect(menuBarComponent.defaultContent.items).toEqual(MENU_BAR_LEGACY_DEFAULT_ITEMS);
  });

  it('renders localized section and spacer chrome in zh-hant', () => {
    const SectionRender = sectionComponent.Render as React.ComponentType<{
      node: BuilderSectionCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const SectionInspector = sectionComponent.Inspector as React.ComponentType<{
      node: BuilderSectionCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const SpacerRender = spacerComponent.Render as React.ComponentType<{
      node: BuilderSpacerCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const SpacerInspector = spacerComponent.Inspector as React.ComponentType<{
      node: BuilderSpacerCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const sectionNode = {
      id: 'section-1',
      kind: 'section',
      rect: { width: 1120, height: 280 },
      content: {
        label: 'Section',
        maxWidth: 1120,
        background: '#fff',
        borderColor: '#94a3b8',
        borderWidth: 2,
        borderRadius: 28,
        padding: 24,
      },
    } as unknown as BuilderSectionCanvasNode;
    const spacerNode = {
      id: 'spacer-1',
      kind: 'spacer',
      content: { size: 48 },
    } as unknown as BuilderSpacerCanvasNode;

    const sectionHtml = renderToStaticMarkup(<SectionRender node={sectionNode} locale="zh-hant" />);
    expect(sectionHtml).toContain('區段');
    expect(sectionHtml).toContain('最大寬度 1120px');
    expect(sectionHtml).not.toContain('max width');

    const sectionInspectorHtml = renderToStaticMarkup(
      <SectionInspector node={sectionNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(sectionInspectorHtml).toContain('標籤');
    expect(sectionInspectorHtml).toContain('最大寬度');
    expect(sectionInspectorHtml).toContain('內距');
    expect(sectionInspectorHtml).toContain('value="區段"');
    expect(sectionInspectorHtml).not.toContain('Label');
    expect(sectionInspectorHtml).not.toContain('Padding');

    const spacerHtml = renderToStaticMarkup(<SpacerRender node={spacerNode} locale="zh-hant" mode="edit" />);
    expect(spacerHtml).toContain('間距 48px');
    expect(spacerHtml).not.toContain('Spacer 48px');

    const spacerInspectorHtml = renderToStaticMarkup(
      <SpacerInspector node={spacerNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(spacerInspectorHtml).toContain('尺寸 (px)');
    expect(spacerInspectorHtml).not.toContain('Size (px)');
  });

  it('renders localized menu bar runtime and inspector chrome in zh-hant', () => {
    const Render = menuBarComponent.Render as React.ComponentType<{
      node: BuilderMenuBarCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const Inspector = menuBarComponent.Inspector as React.ComponentType<{
      node: BuilderMenuBarCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const node = {
      id: 'menu-1',
      kind: 'menu-bar',
      content: {
        items: MENU_BAR_LEGACY_DEFAULT_ITEMS,
        orientation: 'horizontal',
        variant: 'mega',
        activeHref: '',
        showMobileHamburger: true,
      },
    } as unknown as BuilderMenuBarCanvasNode;

    const renderHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="preview" />);
    expect(renderHtml).toContain('aria-label="主要導覽"');
    expect(renderHtml).toContain('aria-label="開啟選單"');
    expect(renderHtml).toContain('服務');
    expect(renderHtml).toContain('/zh-hant/services');
    expect(renderHtml).toContain('專欄');
    expect(renderHtml).not.toContain('primary navigation');
    expect(renderHtml).not.toContain('/ko/services');
    expect(renderHtml).not.toContain('소식');

    const inspectorHtml = renderToStaticMarkup(
      <Inspector node={node} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(inspectorHtml).toContain('data-builder-menu-bar-inspector="true"');
    expect(inspectorHtml).toContain('方向');
    expect(inspectorHtml).toContain('水平');
    expect(inspectorHtml).toContain('垂直');
    expect(inspectorHtml).toContain('樣式');
    expect(inspectorHtml).toContain('大型選單');
    expect(inspectorHtml).toContain('啟用 href');
    expect(inspectorHtml).toContain('選單項目（label | href）');
    expect(inspectorHtml).toContain('服務 | /zh-hant/services');
    expect(inspectorHtml).toContain('行動版漢堡選單');
    expect(inspectorHtml).not.toContain('Horizontal');
    expect(inspectorHtml).not.toContain('Mega menu');
  });

  it('keeps the menu bar inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'menuBar/index.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'menuBar/MenuBarInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './MenuBarInspector.module.css';");
    expect(source).toContain('data-builder-menu-bar-inspector="true"');
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
    expect(css).toContain('.checkboxRow');
    expect(css).toContain('.control:focus-visible');
  });
});
