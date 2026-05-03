import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

const root = process.cwd();

function read(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

describe('D-POOL inspector and modal design contracts', () => {
  test('wires inspector tokens and primitive controls into inspector surfaces', () => {
    const layout = read('src/app/(builder)/[locale]/layout.tsx');
    const controls = read('src/components/builder/canvas/InspectorControls.tsx');
    const inspector = read('src/components/builder/canvas/SandboxInspectorPanel.tsx');
    const styleTab = read('src/components/builder/editor/StyleTab.tsx');
    const contentTab = read('src/components/builder/editor/ContentTab.tsx');
    const css = read('src/components/builder/canvas/SandboxPage.module.css');

    expect(layout).toContain("inspector-tokens.css");
    for (const exportName of [
      'MixedValueIndicator',
      'LabeledRow',
      'NumberStepper',
      'SegmentedControl',
      'SwatchRow',
      'SliderRow',
      'ToggleRow',
      'AdvancedDisclosure',
    ]) {
      expect(controls, exportName).toContain(`function ${exportName}`);
    }

    expect(inspector).toContain("activeTab, setActiveTab] = useState<'layout' | 'style' | 'content' | 'animations' | 'a11y' | 'seo'>");
    expect(inspector).toContain('<MixedValueBadge />');
    expect(inspector).toContain('<SegmentedControl');
    expect(styleTab).toContain("from '@/components/builder/canvas/InspectorControls'");
    expect(styleTab).toContain('<AdvancedDisclosure');
    expect(contentTab).toContain("data-inspector-content-adapter=\"true\"");
    expect(css).toContain(".inspectorFormStack[data-inspector-content-adapter='true']");
  });

  test('keeps expanded context menu actions and submenu support', () => {
    const menu = read('src/components/builder/canvas/ContextMenu.tsx');
    const canvas = read('src/components/builder/canvas/CanvasContainer.tsx');
    const css = read('src/components/builder/canvas/SandboxPage.module.css');

    expect(menu).toContain('children?: ContextMenuAction[]');
    expect(menu).toContain("event.key === 'ArrowRight'");
    expect(menu).toContain("event.key === 'ArrowLeft'");
    expect(css).toContain('.contextSubmenu');
    expect(css).toContain("[data-tone='danger']");

    const requiredActionKeys = [
      'edit-text',
      'replace-image',
      'edit-alt',
      'edit-link',
      'remove-link',
      'copy',
      'cut',
      'paste',
      'duplicate',
      'paste-style',
      'copy-style',
      'bring-front',
      'bring-forward',
      'send-backward',
      'send-back',
      'lock',
      'align-left',
      'align-center',
      'align-right',
      'align-top',
      'align-middle',
      'align-bottom',
      'distribute-horizontal',
      'distribute-vertical',
      'match-width',
      'match-height',
      'hide-on-viewport',
      'pin-to-screen',
      'anchor-link',
      'animations',
      'effects',
      'move-to-page',
      'save-as-section',
      'add-to-library',
      'convert-to-component',
      'style-override',
      'reset-style',
      'group',
      'ungroup',
      'delete',
    ];

    for (const key of requiredActionKeys) {
      expect(canvas, key).toContain(`key: '${key}'`);
    }
  });

  test('uses ModalShell for target modals and removes legacy modal keyframes', () => {
    const modalShell = read('src/components/builder/canvas/ModalShell.tsx');
    const modalCss = read('src/components/builder/canvas/ModalShell.module.css');
    const publish = read('src/components/builder/canvas/PublishModal.tsx');
    const settings = read('src/components/builder/canvas/SiteSettingsModal.tsx');
    const gallery = read('src/components/builder/canvas/TemplateGalleryModal.tsx');
    const canvasDirFiles = [
      publish,
      settings,
      gallery,
      read('src/components/builder/canvas/CropModal.tsx'),
    ].join('\n');

    expect(modalShell).toContain('createPortal');
    expect(modalShell).toContain('FOCUSABLE_SELECTOR');
    expect(modalShell).toContain("data-modal-shell=\"true\"");
    expect(modalShell).toContain('scrollLock.acquire');
    expect(modalCss).toContain('z-index: 9500');
    expect(modalCss).toContain('z-index: 9700');
    expect(publish).toContain('<ModalShell');
    expect(settings).toContain('<ModalShell');
    expect(gallery).toContain('<ModalShell');

    for (const legacyName of [
      'publishBackdropIn',
      'publishModalIn',
      'cropBackdropIn',
      'cropModalIn',
      'templateGalleryFadeIn',
      'templateGalleryScaleIn',
    ]) {
      expect(canvasDirFiles, legacyName).not.toContain(legacyName);
    }
  });

  test('renders template thumbnails through the HTML renderer and bounded cache', () => {
    const renderer = read('src/components/builder/canvas/TemplateThumbnailRenderer.tsx');
    const placeholder = read('src/components/builder/canvas/TemplateThumbnailPlaceholder.tsx');
    const cache = read('src/components/builder/canvas/template-thumbnail-cache.ts');
    const gallery = read('src/components/builder/canvas/TemplateGalleryModal.tsx');

    expect(renderer).toContain('data-template-thumbnail-renderer="html-scaled-mock"');
    expect(renderer).toContain('IntersectionObserver');
    expect(renderer).toContain('MAX_RENDERED_NODES = 60');
    expect(placeholder).toContain('<TemplateThumbnailRenderer');
    expect(cache).toContain('WeakMap<PageTemplate');
    expect(cache).toContain('MAX_ENTRIES_PER_TEMPLATE = 6');
    expect(gallery).toContain('<TemplateThumbnailRenderer');
  });
});
