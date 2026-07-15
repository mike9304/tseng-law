import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';

import type { ComponentProps, ComponentType } from 'react';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';

const pagePanelLifecycle = vi.hoisted(() => ({ mounts: 0, cleanups: 0 }));
const lazyPanelControl = vi.hoisted(() => ({
  releasePages: async () => {},
  resetPages: () => {},
}));

vi.mock('@/components/builder/canvas/PageSwitcher', async () => {
  const { useEffect } = await import('react');

  return {
    default: function FakePageSwitcher() {
      useEffect(() => {
        pagePanelLifecycle.mounts += 1;
        return () => {
          pagePanelLifecycle.cleanups += 1;
        };
      }, []);

      return <div data-pages-panel-real="true" />;
    },
  };
});

vi.mock('next/dynamic', async () => {
  const React = await import('react');
  let dynamicIndex = 0;
  let pageComponent: ComponentType<Record<string, unknown>> | null = null;
  let releaseRequested = false;
  const pageSubscribers = new Set<(
    component: ComponentType<Record<string, unknown>>,
  ) => void>();

  return {
    default: (
      loader: () => Promise<{ default: ComponentType<Record<string, unknown>> }>,
      options: { loading: ComponentType },
    ) => {
      const currentIndex = dynamicIndex;
      dynamicIndex += 1;

      if (currentIndex !== 0) {
        return function DeferredPanel() {
          return <options.loading />;
        };
      }

      const loadPageComponent = async () => {
        if (pageComponent) return pageComponent;
        const loaded = await loader();
        pageComponent = loaded.default;
        for (const subscriber of pageSubscribers) subscriber(pageComponent);
        pageSubscribers.clear();
        return pageComponent;
      };

      lazyPanelControl.releasePages = async () => {
        releaseRequested = true;
        await loadPageComponent();
      };
      lazyPanelControl.resetPages = () => {
        pageComponent = null;
        releaseRequested = false;
        pageSubscribers.clear();
      };

      return function DeferredPagePanel(props: Record<string, unknown>) {
        const [Component, setComponent] = React.useState(() => pageComponent);

        React.useEffect(() => {
          if (pageComponent) {
            setComponent(() => pageComponent);
            return;
          }

          const reveal = (loaded: ComponentType<Record<string, unknown>>) => {
            setComponent(() => loaded);
          };
          pageSubscribers.add(reveal);
          if (releaseRequested) void loadPageComponent();
          return () => {
            pageSubscribers.delete(reveal);
          };
        }, []);

        return Component ? <Component {...props} /> : <options.loading />;
      };
    },
  };
});

vi.mock('@/components/builder/canvas/NavigationEditor', () => ({
  default: function FakeNavigationEditor() {
    return <div />;
  },
}));

vi.mock('@/components/builder/canvas/SandboxCatalogPanel', () => ({
  default: function FakeCatalogPanel() {
    return <div />;
  },
}));

vi.mock('@/components/builder/canvas/ComponentLibraryPanel', () => ({
  default: function FakeLibraryPanel() {
    return <div />;
  },
}));

vi.mock('@/components/builder/canvas/SandboxLayersPanel', () => ({
  default: function FakeLayersPanel() {
    return <div />;
  },
}));

vi.mock('@/components/builder/canvas/UndoStackTimeline', () => ({
  default: function FakeTimeline() {
    return <div data-pages-panel-real="true" />;
  },
}));

vi.mock('@/lib/builder/site/component-design-presets', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/site/component-design-presets')>();
  return {
    ...actual,
    summarizeComponentDesignTargets: vi.fn(actual.summarizeComponentDesignTargets),
  };
});

import SandboxEditorRail from '../SandboxEditorRail';
import { summarizeComponentDesignTargets } from '@/lib/builder/site/component-design-presets';

const summarizeMock = summarizeComponentDesignTargets as unknown as Mock;

type RailProps = ComponentProps<typeof SandboxEditorRail>;

const buttonNode = { id: 'n-button', kind: 'button', content: { style: 'primary-solid' } } as unknown as BuilderCanvasNode;
const cardNode = { id: 'n-card', kind: 'container', content: { variant: 'flat' } } as unknown as BuilderCanvasNode;
const sampleNodes: BuilderCanvasNode[] = [buttonNode, cardNode];

function makeDocument(nodes: BuilderCanvasNode[] = []): BuilderCanvasDocument {
  return { version: 1, stageWidth: 1280, nodes } as unknown as BuilderCanvasDocument;
}

function makeProps(overrides: Partial<RailProps> = {}): RailProps {
  return {
    locale: 'ko',
    siteId: 'site-test',
    activeDrawer: null,
    activePageId: 'page-home',
    clipboardCount: 0,
    columnPostsSummary: { loading: false, total: 0, posts: [], error: null },
    columnsPageLookupPending: false,
    currentSlug: 'home',
    document: null,
    nodesById: new Map<string, BuilderCanvasNode>(),
    selectedNode: null,
    focusedNavItemId: null,
    addNavChildParentId: null,
    appWidgets: [],
    onToggleDrawer: vi.fn(),
    onOpenColumnsPanel: vi.fn(),
    onOpenColumnsPage: vi.fn(),
    onCloseDrawer: vi.fn(),
    onOpenSettings: vi.fn(),
    onOpenHistory: vi.fn(),
    onApplyComponentDesignPreset: vi.fn(),
    onSelectPage: vi.fn(),
    onPagesChange: vi.fn(),
    onNavigationChange: vi.fn(),
    onNavFocusHandled: vi.fn(),
    onNavAddChildHandled: vi.fn(),
    onSelectNode: vi.fn(),
    onUpdateNodeContent: vi.fn(),
    onToast: vi.fn(),
    ...overrides,
  };
}

function renderRail(overrides: Partial<RailProps> = {}): string {
  return renderToStaticMarkup(<SandboxEditorRail {...makeProps(overrides)} />);
}

function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0;
  let count = 0;
  let index = haystack.indexOf(needle);
  while (index !== -1) {
    count += 1;
    index = haystack.indexOf(needle, index + needle.length);
  }
  return count;
}

class TestDomNode {
  readonly childNodes: TestDomNode[] = [];
  parentNode: TestDomNode | null = null;
  nodeValue: string | null = null;

  constructor(
    readonly nodeType: number,
    readonly nodeName: string,
    readonly ownerDocument: TestDomDocument,
  ) {}

  appendChild<T extends TestDomNode>(child: T): T {
    child.parentNode?.removeChild(child);
    child.parentNode = this;
    this.childNodes.push(child);
    return child;
  }

  insertBefore<T extends TestDomNode>(child: T, before: TestDomNode | null): T {
    if (!before) return this.appendChild(child);
    const index = this.childNodes.indexOf(before);
    if (index < 0) throw new Error('Reference node is not a child');
    child.parentNode?.removeChild(child);
    child.parentNode = this;
    this.childNodes.splice(index, 0, child);
    return child;
  }

  removeChild<T extends TestDomNode>(child: T): T {
    const index = this.childNodes.indexOf(child);
    if (index < 0) throw new Error('Node is not a child');
    this.childNodes.splice(index, 1);
    child.parentNode = null;
    return child;
  }

  addEventListener(): void {}

  removeEventListener(): void {}

  contains(candidate: TestDomNode | null): boolean {
    for (let current = candidate; current; current = current.parentNode) {
      if (current === this) return true;
    }
    return false;
  }

  get firstChild(): TestDomNode | null {
    return this.childNodes[0] ?? null;
  }

  get lastChild(): TestDomNode | null {
    return this.childNodes.at(-1) ?? null;
  }

  get nextSibling(): TestDomNode | null {
    if (!this.parentNode) return null;
    const index = this.parentNode.childNodes.indexOf(this);
    return this.parentNode.childNodes[index + 1] ?? null;
  }

  get textContent(): string {
    if (this.nodeType === 3 || this.nodeType === 8) return this.nodeValue ?? '';
    return this.childNodes.map((child) => child.textContent).join('');
  }

  set textContent(value: string) {
    this.childNodes.splice(0).forEach((child) => {
      child.parentNode = null;
    });
    if (value) this.appendChild(this.ownerDocument.createTextNode(value));
  }
}

class TestDomElement extends TestDomNode {
  readonly attributes = new Map<string, string>();
  readonly style: Record<string, string | ((name: string, value: string) => void)> = {
    setProperty: (name: string, value: string) => {
      this.style[name] = value;
    },
  };
  readonly tagName: string;
  namespaceURI = 'http://www.w3.org/1999/xhtml';

  constructor(tagName: string, ownerDocument: TestDomDocument) {
    const normalizedTagName = tagName.toUpperCase();
    super(1, normalizedTagName, ownerDocument);
    this.tagName = normalizedTagName;
  }

  setAttribute(name: string, value: unknown): void {
    this.attributes.set(name, String(value));
  }

  getAttribute(name: string): string | null {
    return this.attributes.get(name) ?? null;
  }

  hasAttribute(name: string): boolean {
    return this.attributes.has(name);
  }

  removeAttribute(name: string): void {
    this.attributes.delete(name);
  }

  focus(): void {
    this.ownerDocument.activeElement = this;
  }
}

class TestDomDocument extends TestDomNode {
  readonly documentElement: TestDomElement;
  readonly body: TestDomElement;
  activeElement: TestDomElement;
  defaultView: Record<string, unknown> | null = null;

  constructor() {
    super(9, '#document', null as unknown as TestDomDocument);
    Object.defineProperty(this, 'ownerDocument', { value: this });
    this.documentElement = this.createElement('html');
    this.body = this.createElement('body');
    this.documentElement.appendChild(this.body);
    this.appendChild(this.documentElement);
    this.activeElement = this.body;
  }

  createElement(tagName: string): TestDomElement {
    return new TestDomElement(tagName, this);
  }

  createElementNS(namespaceURI: string, tagName: string): TestDomElement {
    const element = this.createElement(tagName);
    element.namespaceURI = namespaceURI;
    return element;
  }

  createTextNode(value: string): TestDomNode {
    const node = new TestDomNode(3, '#text', this);
    node.nodeValue = value;
    return node;
  }

  createComment(value: string): TestDomNode {
    const node = new TestDomNode(8, '#comment', this);
    node.nodeValue = value;
    return node;
  }
}

function findTestElement(
  root: TestDomNode,
  attributeName: string,
  attributeValue: string,
): TestDomElement | null {
  if (
    root instanceof TestDomElement
    && root.getAttribute(attributeName) === attributeValue
  ) {
    return root;
  }
  for (const child of root.childNodes) {
    const match = findTestElement(child, attributeName, attributeValue);
    if (match) return match;
  }
  return null;
}

function installTestDom() {
  const actGlobal = globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
  };
  const previous = {
    document: globalThis.document,
    window: globalThis.window,
    Node: globalThis.Node,
    Element: globalThis.Element,
    HTMLElement: globalThis.HTMLElement,
    HTMLIFrameElement: globalThis.HTMLIFrameElement,
    actEnvironment: actGlobal.IS_REACT_ACT_ENVIRONMENT,
  };
  const document = new TestDomDocument();
  const window = {
    document,
    Node: TestDomNode,
    Element: TestDomElement,
    HTMLElement: TestDomElement,
    HTMLIFrameElement: class TestDomIFrameElement extends TestDomElement {},
    addEventListener: () => {},
    removeEventListener: () => {},
    getComputedStyle: () => ({ display: 'block' }),
    requestAnimationFrame: (callback: FrameRequestCallback) => setTimeout(callback, 0),
    cancelAnimationFrame: (handle: number) => clearTimeout(handle),
  };
  document.defaultView = window;

  Object.assign(globalThis, {
    document,
    window,
    Node: TestDomNode,
    Element: TestDomElement,
    HTMLElement: TestDomElement,
    HTMLIFrameElement: window.HTMLIFrameElement,
    IS_REACT_ACT_ENVIRONMENT: true,
  });

  return {
    document,
    restore: () => {
      Object.assign(globalThis, {
        document: previous.document,
        window: previous.window,
        Node: previous.Node,
        Element: previous.Element,
        HTMLElement: previous.HTMLElement,
        HTMLIFrameElement: previous.HTMLIFrameElement,
        IS_REACT_ACT_ENVIRONMENT: previous.actEnvironment,
      });
    },
  };
}

const DRAWER_IDS = ['pages', 'add', 'design', 'layers', 'nav', 'columns', 'history'] as const;

describe('SandboxEditorRail lazy mount', () => {
  beforeEach(() => {
    summarizeMock.mockClear();
  });

  it('does not mount the pages panel body when another drawer is active', () => {
    const html = renderRail({ activeDrawer: 'layers' });

    expect(html).not.toContain('data-builder-drawer-body="pages"');
    expect(html).toContain('data-builder-drawer-body="layers"');
  });

  it('keeps every inactive heavy drawer body absent for each active drawer', () => {
    for (const active of DRAWER_IDS) {
      const html = renderRail({ activeDrawer: active });

      const presentBodies = DRAWER_IDS.filter((id) => html.includes(`data-builder-drawer-body="${id}"`));
      expect(presentBodies).toEqual([active]);
    }
  });

  it('mounts zero drawer bodies when the rail is closed', () => {
    const html = renderRail({ activeDrawer: null });

    expect(html).not.toContain('data-builder-drawer-body=');
  });

  it('keeps one heavy panel mounted across document rerenders and cleans it once on switch or close', async () => {
    const testDom = installTestDom();
    const container = testDom.document.createElement('div');
    testDom.document.body.appendChild(container);
    const { createRoot } = await import('react-dom/client');
    const { act } = await import('react');
    const root = createRoot(container as unknown as Element);

    pagePanelLifecycle.mounts = 0;
    pagePanelLifecycle.cleanups = 0;
    summarizeMock.mockClear();

    try {
      await act(async () => {
        root.render(
          <SandboxEditorRail
            {...makeProps({ activeDrawer: 'pages', document: makeDocument(sampleNodes) })}
          />,
        );
      });

      const pagesRailButton = findTestElement(container, 'data-builder-rail-item', 'pages');
      expect(pagesRailButton).not.toBeNull();
      pagesRailButton?.focus();
      expect(testDom.document.activeElement).toBe(pagesRailButton);
      expect(pagePanelLifecycle.mounts).toBe(0);
      expect(summarizeMock).toHaveBeenCalledTimes(1);

      await act(async () => {
        root.render(
          <SandboxEditorRail
            {...makeProps({
              activeDrawer: 'pages',
              document: makeDocument([
                { ...buttonNode, id: 'n-unrelated' } as unknown as BuilderCanvasNode,
              ]),
              selectedNode: buttonNode,
            })}
          />,
        );
      });

      expect(pagePanelLifecycle.mounts).toBe(0);
      expect(pagePanelLifecycle.cleanups).toBe(0);
      expect(summarizeMock).toHaveBeenCalledTimes(1);
      expect(testDom.document.activeElement).toBe(pagesRailButton);

      await act(async () => {
        await lazyPanelControl.releasePages();
      });

      expect(pagePanelLifecycle.mounts).toBe(1);
      expect(pagePanelLifecycle.cleanups).toBe(0);
      expect(testDom.document.activeElement).toBe(pagesRailButton);

      await act(async () => {
        root.render(
          <SandboxEditorRail
            {...makeProps({
              activeDrawer: 'pages',
              document: makeDocument([{ ...cardNode, id: 'n-new' } as unknown as BuilderCanvasNode]),
            })}
          />,
        );
      });

      expect(pagePanelLifecycle.mounts).toBe(1);
      expect(pagePanelLifecycle.cleanups).toBe(0);
      expect(summarizeMock).toHaveBeenCalledTimes(1);

      await act(async () => {
        root.render(<SandboxEditorRail {...makeProps({ activeDrawer: 'layers' })} />);
      });
      expect(pagePanelLifecycle.cleanups).toBe(1);

      await act(async () => {
        root.render(<SandboxEditorRail {...makeProps({ activeDrawer: null })} />);
      });
      expect(pagePanelLifecycle.cleanups).toBe(1);

      const closeContainer = testDom.document.createElement('div');
      testDom.document.body.appendChild(closeContainer);
      const closeRoot = createRoot(closeContainer as unknown as Element);
      const cleanupBaseline = pagePanelLifecycle.cleanups;
      try {
        await act(async () => {
          closeRoot.render(<SandboxEditorRail {...makeProps({ activeDrawer: 'pages' })} />);
        });
        expect(pagePanelLifecycle.mounts).toBe(2);

        await act(async () => {
          closeRoot.render(<SandboxEditorRail {...makeProps({ activeDrawer: null })} />);
        });
        expect(pagePanelLifecycle.cleanups - cleanupBaseline).toBe(1);
      } finally {
        await act(async () => closeRoot.unmount());
      }
    } finally {
      await act(async () => root.unmount());
      lazyPanelControl.resetPages();
      testDom.restore();
    }
  });
});

describe('SandboxEditorRail immediate shell / loading semantics', () => {
  it('shows the accessible panel loading shell immediately while the heavy page chunk is deferred', () => {
    const html = renderRail({ activeDrawer: 'pages' });

    expect(html).toContain('data-builder-drawer-body="pages"');
    expect(html).toContain('data-builder-panel-loading="true"');
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-label="Loading panel"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('Loading…');
    expect(html).not.toContain('data-pages-panel-real="true"');
  });

  it('shows an immediate lightweight shell for the add drawer alongside the static shortcut', () => {
    const html = renderRail({ activeDrawer: 'add' });

    expect(html).toContain('data-builder-drawer-body="add"');
    expect(countOccurrences(html, 'data-builder-panel-loading="true"')).toBeGreaterThanOrEqual(1);
  });
});

describe('SandboxEditorRail bounded open work', () => {
  beforeEach(() => {
    summarizeMock.mockClear();
  });

  it('does not run the design audit over real document nodes while the design drawer is closed', () => {
    renderRail({ activeDrawer: 'pages', document: makeDocument(sampleNodes) });

    expect(summarizeMock).toHaveBeenCalled();
    const callArgs = summarizeMock.mock.calls.map((call) => call[0]);
    for (const nodes of callArgs) {
      expect(Array.isArray(nodes) ? nodes.length : -1).toBe(0);
    }
    expect(summarizeMock).not.toHaveBeenCalledWith(sampleNodes);
  });

  it('runs the design audit over the real document nodes only when the design drawer is open', () => {
    renderRail({ activeDrawer: 'design', document: makeDocument(sampleNodes) });

    expect(summarizeMock).toHaveBeenCalledWith(sampleNodes);
  });
});

describe('SandboxEditorRail no-click-through boundary and a11y', () => {
  function asideOpenTag(html: string): string {
    const start = html.indexOf('<aside');
    expect(start).not.toBe(-1);
    const end = html.indexOf('>', start);
    return html.slice(start, end + 1);
  }

  it('exposes a drawer boundary only while a drawer is visible and hides it when closed', () => {
    const openHtml = renderRail({ activeDrawer: 'pages' });
    const closedHtml = renderRail({ activeDrawer: null });
    const openAside = asideOpenTag(openHtml);
    const closedAside = asideOpenTag(closedHtml);

    expect(openAside).toContain('data-builder-drawer="pages"');
    expect(openAside).toContain('data-builder-drawer-boundary="true"');
    expect(openAside).toContain('aria-hidden="false"');

    expect(closedAside).toContain('aria-hidden="true"');
    expect(closedAside).not.toContain('data-builder-drawer-boundary');
    expect(closedAside).not.toContain('data-builder-drawer-body');
    expect(closedHtml).not.toContain('data-builder-drawer-body=');
  });

  it('preserves rail-level data hooks and callbacks across the lazy refactor', () => {
    const html = renderRail({ activeDrawer: 'history' });

    expect(html).toContain('data-builder-rail-item="pages"');
    expect(html).toContain('data-builder-rail-item="layers"');
    expect(html).toContain('data-builder-rail-item="nav"');
    expect(html).toContain('data-builder-rail-item="history"');
    expect(html).toContain('data-builder-drawer="history"');
    expect(html).toContain('data-builder-drawer-body="history"');
    expect(html).toContain('data-builder-panel-loading="true"');
  });
});

describe('SandboxEditorRail smoothness source-of-truth contract', () => {
  it('defines dynamic panel loaders at module scope (stable identity, no remount loops) and stops pointer propagation on the drawer', () => {
    const railSource = readFileSync(
      path.join(process.cwd(), 'src/components/builder/canvas/SandboxEditorRail.tsx'),
      'utf8',
    );

    expect(railSource).toMatch(/const DynamicPageSwitcher = dynamic\(/);
    expect(railSource).toMatch(/const DynamicSandboxLayersPanel = dynamic\(/);
    expect(railSource).toMatch(/const DynamicNavigationEditor = dynamic\(/);
    expect(railSource).toMatch(/const DynamicUndoStackTimeline = dynamic\(/);
    expect(railSource).toContain('ssr: false');
    expect(railSource).toContain('onPointerDown={(event) => event.stopPropagation()}');
    expect(railSource).toContain('templateGalleryInitialSearch={pageTemplateGalleryRequest.query}');
  });
});
