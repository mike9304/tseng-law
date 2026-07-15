import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { BuilderBlogPostCardCanvasNode } from '@/lib/builder/canvas/types';
import type { BlogPost } from '@/lib/builder/blog/blog-engine';
import blogPostCardComponent from '../index';
import { getBlogPostCardCopy } from '../blog-post-card-copy';
import { WidgetDataDisclosure } from '../../_shared/WidgetDataDisclosure';

const componentRoot = join(process.cwd(), 'src/lib/builder/components');

const node = {
  id: 'blog-post-card-1',
  kind: 'blog-post-card',
  rect: { x: 0, y: 0, width: 360, height: 360 },
  content: {
    showFeaturedImage: true,
    showCategory: true,
    showAuthor: true,
    showExcerpt: true,
    showDate: true,
    showReadingTime: true,
    cardStyle: 'elevated',
    variant: 'flat',
  },
  style: {},
  locked: false,
  responsive: {},
  children: [],
} as unknown as BuilderBlogPostCardCanvasNode;

type CardRenderMode = 'edit' | 'preview' | 'published';

function countDisclosures(html: string): number {
  return (html.match(/data-builder-demo-disclosure/g) ?? []).length;
}

const zhHantCopy = getBlogPostCardCopy('zh-hant');

// Every field a published non-selected card must never surface. Covers the
// localized mock title/excerpt/author/author-title, the fixed mock date and
// reading time, the featured badge, the read-more affordance, and the mock
// company-formation category label.
const zhHantMockLeakTokens: readonly string[] = [
  zhHantCopy.runtime.mockPost.title,
  zhHantCopy.runtime.mockPost.excerpt,
  zhHantCopy.runtime.mockPost.authorName,
  zhHantCopy.runtime.mockPost.authorTitle,
  '2026-04-12',
  zhHantCopy.runtime.readingTime(6),
  zhHantCopy.runtime.featuredBadge,
  zhHantCopy.runtime.readMore,
  '公司設立',
];

function expectNoPublishedMockLeak(html: string): void {
  for (const token of zhHantMockLeakTokens) {
    expect(html).not.toContain(token);
  }
  expect(countDisclosures(html)).toBe(0);
}

// ─── Public status copy remediation ───
// A published card must never surface builder-only diagnostics, an internal
// post id, the retired "will appear here soon" future promise, or any
// builder-formatted not-found/load-failed title — in any locale.

const testPostIds = ['missing-post', 'doomed-post', 'pending-post', 'fetched-post-1'] as const;
const allCardLocales = ['ko', 'zh-hant', 'en'] as const;

// The three localized builder instruction excerpts (blog-manager/publish/slug).
const builderInstructionExcerpts: readonly string[] = allCardLocales.map(
  (loc) => getBlogPostCardCopy(loc).runtime.errorExcerpt,
);

// The retired future-promise excerpts, pinned literally so a regression to the
// old "a new article will appear here soon" copy is caught even after the copy
// object itself has moved on to present-tense wording.
const retiredFuturePromiseExcerpts: readonly string[] = [
  '이 자리에는 곧 새로운 글이 게시됩니다.',
  '此處即將發布新的文章。',
  'A new article will appear here soon.',
];

// The retired "connected/linked ... yet" unconfigured titles, pinned literally
// so builder-configuration language can never resurface in the published
// unconfigured card even after the copy object has moved on to neutral copy.
const retiredConnectedTitles: readonly string[] = [
  '표시할 게시물이 아직 연결되지 않았습니다.',
  '尚無連結文章',
  'No post connected yet',
];

// The retired "selected blog post" loading excerpts, pinned literally so the
// builder widget-selection language can never resurface in the published
// loading branch.
const retiredSelectedLoadingExcerpts: readonly string[] = [
  '선택한 블로그 글을 불러오는 중입니다.',
  '正在載入選取的部落格文章。',
  'Loading the selected blog post.',
];

// Builder-only diagnostic titles interpolated with each chosen test postId.
const builderDiagnosticTitles: readonly string[] = allCardLocales.flatMap((loc) => {
  const c = getBlogPostCardCopy(loc);
  return testPostIds.flatMap((id) => [c.runtime.postNotFound(id), c.runtime.failedToLoadPost(id)]);
});

const forbiddenPublicTokens: readonly string[] = [
  ...testPostIds,
  ...builderInstructionExcerpts,
  ...retiredFuturePromiseExcerpts,
  ...retiredConnectedTitles,
  ...retiredSelectedLoadingExcerpts,
  ...builderDiagnosticTitles,
];

// Pinned neutral visitor-facing copy for the published unconfigured and
// loading states. These literals are asserted verbatim in the rendered HTML
// (and reconciled with the copy object) so a drift back to builder-state
// language is caught independently of the copy object's current values.
const pinnedPublishedNoPostTitle: Readonly<Record<string, string>> = {
  ko: '표시할 글이 없습니다',
  'zh-hant': '目前沒有可顯示的文章',
  en: 'No article available',
};
const pinnedPublishedLoadingTitle: Readonly<Record<string, string>> = {
  ko: '글을 불러오는 중입니다',
  'zh-hant': '正在載入文章',
  en: 'Loading article',
};
const pinnedPublishedLoadingExcerpt: Readonly<Record<string, string>> = {
  ko: '잠시만 기다려 주세요.',
  'zh-hant': '請稍候。',
  en: 'Please wait while the article loads.',
};

function expectNoForbiddenPublicTokens(html: string): void {
  for (const token of forbiddenPublicTokens) {
    expect(html).not.toContain(token);
  }
}

// ─── Minimal in-memory DOM for flushing client effects (node env) ───
// Pattern adapted from sandbox-editor-rail-smoothness.test.tsx and
// useSandboxSiteState.test.ts — the repo's established way to exercise
// 'use client' components with useEffect in vitest's default node env.

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
    const idx = this.childNodes.indexOf(before);
    if (idx < 0) throw new Error('Reference node is not a child');
    child.parentNode?.removeChild(child);
    child.parentNode = this;
    this.childNodes.splice(idx, 0, child);
    return child;
  }

  removeChild<T extends TestDomNode>(child: T): T {
    const idx = this.childNodes.indexOf(child);
    if (idx < 0) throw new Error('Node is not a child');
    this.childNodes.splice(idx, 1);
    child.parentNode = null;
    return child;
  }

  addEventListener(): void {}
  removeEventListener(): void {}

  get textContent(): string {
    if (this.nodeType === 3 || this.nodeType === 8) return this.nodeValue ?? '';
    return this.childNodes.map((c) => c.textContent).join('');
  }

  set textContent(value: string) {
    this.childNodes.splice(0).forEach((c) => {
      c.parentNode = null;
    });
    if (value) this.appendChild(this.ownerDocument.createTextNode(value));
  }
}

class TestDomElement extends TestDomNode {
  readonly attributes = new Map<string, string>();
  readonly style: Record<string, string> & {
    setProperty: (name: string, value: string) => void;
  } = {
    setProperty: (name: string, value: string) => {
      this.style[name] = value;
    },
  } as never;
  readonly tagName: string;
  namespaceURI = 'http://www.w3.org/1999/xhtml';

  constructor(tagName: string, ownerDocument: TestDomDocument) {
    const normalized = tagName.toUpperCase();
    super(1, normalized, ownerDocument);
    this.tagName = normalized;
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

  focus(): void {}
}

class TestDomDocument extends TestDomNode {
  readonly documentElement: TestDomElement;
  readonly body: TestDomElement;
  activeElement: TestDomElement | null = null;
  defaultView: Record<string, unknown> | null = null;

  constructor() {
    super(9, '#document', null as unknown as TestDomDocument);
    Object.defineProperty(this, 'ownerDocument', { value: this });
    this.documentElement = this.createElement('html');
    this.body = this.createElement('body');
    this.documentElement.appendChild(this.body);
    this.appendChild(this.documentElement);
  }

  createElement(tagName: string): TestDomElement {
    return new TestDomElement(tagName, this);
  }

  createElementNS(namespaceURI: string, tagName: string): TestDomElement {
    const el = this.createElement(tagName);
    el.namespaceURI = namespaceURI;
    return el;
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

const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img',
  'input', 'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

function serializeDom(node: TestDomNode): string {
  if (node.nodeType === 3) return node.nodeValue ?? '';
  if (node.nodeType === 8) return `<!--${node.nodeValue ?? ''}-->`;
  if (node instanceof TestDomElement) {
    const attrs = Array.from(node.attributes.entries())
      .map(([k, v]) => (v !== '' ? `${k}="${v}"` : k))
      .join(' ');
    const attrStr = attrs ? ` ${attrs}` : '';
    const tag = node.tagName.toLowerCase();
    if (VOID_TAGS.has(tag)) return `<${tag}${attrStr} />`;
    const children = node.childNodes.map(serializeDom).join('');
    return `<${tag}${attrStr}>${children}</${tag}>`;
  }
  return node.childNodes.map((c) => serializeDom(c)).join('');
}

function installClientDom(): { container: TestDomElement } {
  const document = new TestDomDocument();
  const container = document.createElement('div');
  document.body.appendChild(container);
  const windowObj = {
    document,
    Node: TestDomNode,
    Element: TestDomElement,
    HTMLElement: TestDomElement,
    HTMLIFrameElement: class TestDomIFrameElement extends TestDomElement {},
    addEventListener: () => {},
    removeEventListener: () => {},
    getComputedStyle: () => ({ display: 'block' }),
    requestAnimationFrame: (cb: FrameRequestCallback) => setTimeout(cb, 0),
    cancelAnimationFrame: (handle: number) => clearTimeout(handle),
  };
  document.defaultView = windowObj;

  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.stubGlobal('document', document);
  vi.stubGlobal('window', windowObj);
  vi.stubGlobal('Node', TestDomNode);
  vi.stubGlobal('Element', TestDomElement);
  vi.stubGlobal('HTMLElement', TestDomElement);

  return { container };
}

function deferred<T>(): {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
} {
  let resolve!: (value: T | PromiseLike<T>) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

const settle = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

const CardRender = blogPostCardComponent.Render as React.ComponentType<{
  node: BuilderBlogPostCardCanvasNode;
  locale?: string;
  mode?: CardRenderMode;
}>;

interface ClientCardHandle {
  readonly html: string;
  flush: () => Promise<void>;
  unmount: () => Promise<void>;
}

async function mountClientCard(
  node: BuilderBlogPostCardCanvasNode,
  mode: CardRenderMode,
  fetchImpl: typeof fetch,
  locale: 'ko' | 'zh-hant' | 'en' = 'zh-hant',
): Promise<ClientCardHandle> {
  const { container } = installClientDom();
  vi.stubGlobal('fetch', fetchImpl);
  const root = createRoot(container as unknown as Element);

  await act(async () => {
    root.render(<CardRender node={node} locale={locale} mode={mode} />);
    await settle();
  });

  return {
    get html() {
      return serializeDom(container);
    },
    async flush() {
      await act(async () => {
        await settle();
        await new Promise<void>((r) => setImmediate(r));
        await settle();
      });
    },
    async unmount() {
      await act(async () => root.unmount());
      vi.unstubAllGlobals();
    },
  };
}

describe('blog post card localization', () => {
  it('returns localized helper copy in zh-hant', () => {
    const copy = getBlogPostCardCopy('zh-hant');
    expect(copy.section.post).toBe('文章');
    expect(copy.inspector.cardVariant).toBe('卡片變體');
    expect(copy.inspector.manualPostIdPlaceholder).toBe('custom-slug');
    expect(copy.variants.flat).toBe('平面');
    expect(copy.inspector.readingTime).toBe('閱讀時間');
    expect(copy.runtime.featuredBadge).toBe('精選');
    expect(copy.runtime.readingTime(6)).toBe('閱讀 6 分鐘');
    expect(copy.runtime.postNotFound('post-1')).toBe('找不到文章：post-1');
  });

  it('renders localized inspector labels in zh-hant', () => {
    const Inspector = blogPostCardComponent.Inspector as React.ComponentType<{
      node: BuilderBlogPostCardCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;

    const html = renderToStaticMarkup(
      <Inspector node={node} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(html).toContain('文章');
    expect(html).toContain('文章（slug）');
    expect(html).toContain('手動覆寫 postId');
    expect(html).toContain('placeholder="custom-slug"');
    expect(html).toContain('卡片變體');
    expect(html).toContain('精選圖片');
    expect(html).toContain('閱讀時間');
    expect(html).toContain('data-builder-blog-post-card-inspector="true"');
  });

  it('keeps the blog post card inspector on shared CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'blogPostCard/Inspector.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'BlogWidgetInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from '../BlogWidgetInspector.module.css';");
    expect(source).toContain('data-builder-blog-post-card-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.sectionLabel}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={styles.checkboxRow}',
    ]) {
      expect(source).toContain(classUsage);
    }
    for (const removedPattern of [
      'React.CSSProperties',
      'sectionLabelStyle',
      'selectStyle',
      'style={{',
    ]) {
      expect(source).not.toContain(removedPattern);
    }
    expect(css).toContain('.sectionLabel');
    expect(css).toContain('.checkboxRow');
    expect(css).toContain('.control:focus-visible');
  });

  it('renders localized runtime card chrome in zh-hant', () => {
    const Render = blogPostCardComponent.Render as React.ComponentType<{
      node: BuilderBlogPostCardCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;

    const html = renderToStaticMarkup(
      <Render node={node} locale="zh-hant" mode="preview" />,
    );

    expect(html).toContain('台灣公司設立指南');
    expect(html).toContain('公司設立');
    expect(html).toContain('精選');
    expect(html).toContain('選擇文章');
    expect(html).toContain('閱讀 6 分鐘');
    expect(html).toContain('閱讀更多');
    expect(html).not.toContain('Featured');
    expect(html).not.toContain('Select post');
    expect(html).not.toContain('자세히 보기');
  });
});

describe('blog post card builder demo disclosure', () => {
  const Render = blogPostCardComponent.Render as React.ComponentType<{
    node: BuilderBlogPostCardCanvasNode;
    locale?: 'ko' | 'zh-hant' | 'en';
    mode?: 'edit' | 'preview' | 'published';
  }>;

  it('renders exactly one demo disclosure for the no-post selected mock in edit and preview; published renders a neutral status card with zero mock leakage', () => {
    const editHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="edit" />);
    const previewHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="preview" />);
    const publishedHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="published" />);

    expect(countDisclosures(editHtml)).toBe(1);
    expect(countDisclosures(previewHtml)).toBe(1);
    expect(countDisclosures(publishedHtml)).toBe(0);

    // Builder edit/preview keep the intentional mock design card and the select-post notice.
    expect(editHtml).toContain(zhHantCopy.runtime.mockPost.title);
    expect(editHtml).toContain('選擇文章');
    expect(previewHtml).toContain(zhHantCopy.runtime.mockPost.title);
    expect(previewHtml).toContain('選擇文章');

    // Published renders an honest neutral unconfigured card — never the builder
    // select-post instruction, never any field derived from the mock post.
    expect(publishedHtml).toContain(zhHantCopy.runtime.publishedNoPostTitle);
    expect(publishedHtml).toContain(zhHantCopy.runtime.publishedNoPostExcerpt);
    expect(publishedHtml).toContain('data-builder-blog-card-status="unconfigured"');
    expect(publishedHtml).not.toContain('選擇文章');
    expectNoPublishedMockLeak(publishedHtml);
    expectNoForbiddenPublicTokens(publishedHtml);

    // The disclosure leads the shared wrapper, ahead of the card surface.
    const disclosureAt = editHtml.indexOf('data-builder-demo-disclosure');
    const cardAt = editHtml.indexOf('data-builder-blog-card="true"');
    expect(disclosureAt).toBeGreaterThanOrEqual(0);
    expect(cardAt).toBeGreaterThan(disclosureAt);
  });

  it('renders exactly one demo disclosure for the unresolved-post mock in edit and preview; published renders a neutral not-found status card with zero mock leakage', () => {
    // Static initial state with a postId: post=null, loading=false, error=null -> not-found branch.
    const unresolvedNode = { ...node, content: { ...node.content, postId: 'missing-post' } } as unknown as BuilderBlogPostCardCanvasNode;
    const editHtml = renderToStaticMarkup(<Render node={unresolvedNode} locale="zh-hant" mode="edit" />);
    const previewHtml = renderToStaticMarkup(<Render node={unresolvedNode} locale="zh-hant" mode="preview" />);
    const publishedHtml = renderToStaticMarkup(<Render node={unresolvedNode} locale="zh-hant" mode="published" />);

    expect(countDisclosures(editHtml)).toBe(1);
    expect(countDisclosures(previewHtml)).toBe(1);
    expect(countDisclosures(publishedHtml)).toBe(0);

    // Builder edit/preview show the mock not-found card: mock author/date/category survive
    // alongside the not-found title (the title/excerpt/featured are overridden).
    expect(editHtml).toContain('找不到文章：missing-post');
    expect(editHtml).toContain(zhHantCopy.runtime.mockPost.authorName);
    expect(editHtml).toContain('2026-04-12');
    expect(previewHtml).toContain('找不到文章：missing-post');

    // Published keeps the genuine public not-found state as a NEUTRAL status card —
    // never the builder diagnostic title, never the postId, never mock metadata,
    // never a builder instruction excerpt, never a demo disclosure.
    expect(publishedHtml).not.toContain('找不到文章：missing-post');
    expect(publishedHtml).toContain(zhHantCopy.runtime.publishedUnavailableTitle);
    expect(publishedHtml).toContain(zhHantCopy.runtime.publishedUnavailableExcerpt);
    expect(publishedHtml).toContain('data-builder-blog-card-status="not-found"');
    expectNoPublishedMockLeak(publishedHtml);
    expectNoForbiddenPublicTokens(publishedHtml);

    const disclosureAt = editHtml.indexOf('data-builder-demo-disclosure');
    const cardAt = editHtml.indexOf('data-builder-blog-card="true"');
    expect(disclosureAt).toBeGreaterThanOrEqual(0);
    expect(cardAt).toBeGreaterThan(disclosureAt);
  });

  it('routes the non-static loading and selected branches through the same final wrapper', () => {
    // Structural guard retained independently of the behavioural proofs below:
    // the Element source must contain exactly one disclosure expression so a
    // second wrapper cannot silently appear in a future edit.
    const source = readFileSync(join(componentRoot, 'blogPostCard/Element.tsx'), 'utf8');
    const disclosureExpression = '{isBuilder ? <WidgetDataDisclosure locale={effectiveLocale} /> : null}';
    expect(source.split(disclosureExpression).length - 1).toBe(1);
    expect(source).toContain("import { WidgetDataDisclosure } from '../_shared/WidgetDataDisclosure';");
  });
});

describe('blog post card client-fetch disclosure', () => {
  const copy = getBlogPostCardCopy('zh-hant');

  // ── Loading branch: fetch stays pending ──────────────────────────

  it('renders exactly one disclosure with loading content while the fetch is pending in edit/preview, none in published', async () => {
    const loadingNode = {
      ...node,
      content: { ...node.content, postId: 'pending-post' },
    } as unknown as BuilderBlogPostCardCanvasNode;

    for (const mode of ['edit', 'preview', 'published'] as const) {
      const fetchDeferred = deferred<Response>();
      const fetchMock = vi.fn((): Promise<Response> => fetchDeferred.promise);
      const renderer = await mountClientCard(loadingNode, mode, fetchMock);
      try {
        const html = renderer.html;

        // Branch guard — loadingNotice proves we flushed the effect and are
        // genuinely in the loading branch, not no-post or not-found.
        expect(html).toContain(copy.runtime.loadingNotice);
        expect(html).not.toContain('找不到文章：pending-post');

        expect(countDisclosures(html)).toBe(mode === 'published' ? 0 : 1);

        if (mode === 'published') {
          // Published loading is a neutral visitor-facing status card: pinned
          // public loading copy, no builder "selected post" language, no mock
          // metadata, no postId, no builder diagnostic, no disclosure.
          expect(html).toContain('data-builder-blog-card-status="loading"');
          expect(html).toContain(copy.runtime.publishedLoadingTitle);
          expect(html).toContain(copy.runtime.publishedLoadingExcerpt);
          expect(html).not.toContain(copy.runtime.loadingTitle);
          expect(html).not.toContain(copy.runtime.loadingExcerpt);
          expectNoPublishedMockLeak(html);
          expectNoForbiddenPublicTokens(html);
        } else {
          // Builder loading keeps the mock design card with the builder
          // selected-post loading copy — mock author/date/category survive
          // (title/excerpt are overridden by loading copy) with one disclosure.
          expect(html).toContain(copy.runtime.loadingTitle);
          expect(html).toContain(copy.runtime.loadingExcerpt);
          expect(html).toContain(copy.runtime.mockPost.authorName);
          expect(html).toContain('2026-04-12');
          expect(html).toContain('公司設立');
          const disclosureAt = html.indexOf('data-builder-demo-disclosure');
          const cardAt = html.indexOf('data-builder-blog-card');
          expect(disclosureAt).toBeGreaterThanOrEqual(0);
          expect(cardAt).toBeGreaterThan(disclosureAt);
        }
      } finally {
        fetchDeferred.resolve(Response.json({ ok: true, posts: [] }));
        await renderer.flush();
        await renderer.unmount();
      }
    }
  });

  it('published loading renders pinned visitor-facing loading copy and zero forbidden tokens across ko/zh-hant/en', async () => {
    const loadingNode = {
      ...node,
      content: { ...node.content, postId: 'pending-post' },
    } as unknown as BuilderBlogPostCardCanvasNode;

    for (const locale of allCardLocales) {
      const locCopy = getBlogPostCardCopy(locale);
      const fetchDeferred = deferred<Response>();
      const fetchMock = vi.fn((): Promise<Response> => fetchDeferred.promise);
      const renderer = await mountClientCard(loadingNode, 'published', fetchMock, locale);
      try {
        const html = renderer.html;

        // Branch guard — loadingNotice proves we flushed the effect.
        expect(html).toContain(locCopy.runtime.loadingNotice);
        expect(html).toContain('data-builder-blog-card-status="loading"');

        // Pinned public loading copy (literal + copy-object reconciliation).
        expect(html).toContain(pinnedPublishedLoadingTitle[locale]);
        expect(html).toContain(pinnedPublishedLoadingExcerpt[locale]);
        expect(pinnedPublishedLoadingTitle[locale]).toBe(locCopy.runtime.publishedLoadingTitle);
        expect(pinnedPublishedLoadingExcerpt[locale]).toBe(locCopy.runtime.publishedLoadingExcerpt);

        // The builder "selected blog post" loading copy must never reach a visitor.
        expect(html).not.toContain(locCopy.runtime.loadingTitle);
        expect(html).not.toContain(locCopy.runtime.loadingExcerpt);

        expectNoForbiddenPublicTokens(html);
        expect(countDisclosures(html)).toBe(0);
      } finally {
        fetchDeferred.resolve(Response.json({ ok: true, posts: [] }));
        await renderer.flush();
        await renderer.unmount();
      }
    }
  });

  // ── Resolved selected branch: fetch returns a real post ──────────

  it('renders exactly one disclosure with the fetched post (not the mock) after the fetch resolves', async () => {
    const fetchedPost: BlogPost = {
      postId: 'fetched-post-1',
      slug: 'cross-border-ma-guide',
      locale: 'zh-hant',
      title: '跨境併購法律實務要點',
      excerpt: '解析跨國併購的盡職調查與交割流程。',
      bodyHtml: '',
      bodyMarkdown: '',
      author: { name: '林志明律師', title: '資深合夥人' },
      category: 'company-formation',
      tags: [],
      readingTimeMinutes: 9,
      publishedAt: '2026-03-15T00:00:00.000Z',
      updatedAt: '2026-03-16T00:00:00.000Z',
      featured: true,
    };
    const resolvedNode = {
      ...node,
      content: { ...node.content, postId: 'fetched-post-1' },
    } as unknown as BuilderBlogPostCardCanvasNode;

    for (const mode of ['edit', 'preview', 'published'] as const) {
      const fetchMock = vi.fn(async () => Response.json({ ok: true, posts: [fetchedPost] }));
      const renderer = await mountClientCard(resolvedNode, mode, fetchMock);
      try {
        await renderer.flush();

        const html = renderer.html;

        // Branch guard — the fetched post content proves we are in the
        // resolved selected branch, not loading, not-found, or mock.
        expect(html).toContain('跨境併購法律實務要點');
        expect(html).toContain('解析跨國併購的盡職調查與交割流程。');
        expect(html).toContain('林志明律師');
        expect(html).toContain('閱讀 9 分鐘');
        expect(html).toContain('2026-03-15');
        // Real fetched content, never the mock item.
        expect(html).not.toContain(copy.runtime.mockPost.title);
        expect(html).not.toContain(copy.runtime.mockPost.excerpt);
        expect(html).not.toContain(copy.runtime.mockPost.authorName);
        expect(html).not.toContain(copy.runtime.loadingTitle);
        expect(html).not.toContain('找不到文章：fetched-post-1');
        // A resolved card is a real card, never a status shell.
        expect(html).not.toContain('data-builder-blog-card-status');

        expect(countDisclosures(html)).toBe(mode === 'published' ? 0 : 1);

        if (mode !== 'published') {
          const disclosureAt = html.indexOf('data-builder-demo-disclosure');
          const cardAt = html.indexOf('data-builder-blog-card');
          expect(disclosureAt).toBeGreaterThanOrEqual(0);
          expect(cardAt).toBeGreaterThan(disclosureAt);
        } else {
          // Published resolved carries the public URL, real data, and zero demo
          // disclosure — and never leaks an internal postId or builder diagnostic.
          expect(html).toContain('/zh-hant/columns/cross-border-ma-guide');
          expect(html).not.toContain('data-builder-demo-disclosure');
          expectNoForbiddenPublicTokens(html);
        }
      } finally {
        await renderer.unmount();
      }
    }
  });

  // ── Load-failed branch: fetch resolves with ok:false ─────────────

  it('published load-failed renders a neutral status card with zero mock leakage while builder keeps the mock diagnostic card', async () => {
    const failedNode = {
      ...node,
      content: { ...node.content, postId: 'doomed-post' },
    } as unknown as BuilderBlogPostCardCanvasNode;

    for (const mode of ['edit', 'preview', 'published'] as const) {
      const fetchMock = vi.fn(async () => Response.json({ ok: false }));
      const renderer = await mountClientCard(failedNode, mode, fetchMock);
      try {
        await renderer.flush();

        const html = renderer.html;

        // Branch guard — we flushed the effect and are genuinely in the
        // load-failed branch, not loading or not-found.
        expect(html).not.toContain(copy.runtime.loadingTitle);

        expect(countDisclosures(html)).toBe(mode === 'published' ? 0 : 1);

        if (mode === 'published') {
          // Published load-failed is a NEUTRAL status card: never the builder
          // diagnostic title, never the postId, never the builder instruction
          // excerpt, zero forbidden tokens, zero disclosures.
          expect(html).toContain('data-builder-blog-card-status="load-failed"');
          expect(html).toContain(copy.runtime.publishedUnavailableTitle);
          expect(html).toContain(copy.runtime.publishedUnavailableExcerpt);
          expect(html).not.toContain(copy.runtime.failedToLoadPost('doomed-post'));
          expect(html).not.toContain(copy.runtime.postNotFound('doomed-post'));
          expectNoPublishedMockLeak(html);
          expectNoForbiddenPublicTokens(html);
        } else {
          // Builder load-failed keeps the diagnostic title (with postId) and the
          // mock design card — mock author/date survive — with one disclosure.
          expect(html).toContain(copy.runtime.failedToLoadPost('doomed-post'));
          expect(html).not.toContain(copy.runtime.postNotFound('doomed-post'));
          expect(html).toContain(copy.runtime.mockPost.authorName);
          expect(html).toContain('2026-04-12');
        }
      } finally {
        await renderer.unmount();
      }
    }
  });

  // ── Client not-found branch: fetch resolves ok with an empty post list ──

  it('published client not-found (fetch resolves ok with empty posts) renders a neutral status card with zero forbidden tokens; builder keeps the mock diagnostic', async () => {
    const notFoundNode = {
      ...node,
      content: { ...node.content, postId: 'missing-post' },
    } as unknown as BuilderBlogPostCardCanvasNode;

    for (const mode of ['edit', 'preview', 'published'] as const) {
      const fetchMock = vi.fn(async () => Response.json({ ok: true, posts: [] }));
      const renderer = await mountClientCard(notFoundNode, mode, fetchMock);
      try {
        await renderer.flush();

        // Proves this is the resolved client path (fetch ran and returned an
        // empty list), distinct from the SSR initial-state not-found proof.
        expect(fetchMock).toHaveBeenCalled();

        const html = renderer.html;

        expect(countDisclosures(html)).toBe(mode === 'published' ? 0 : 1);

        if (mode === 'published') {
          // Published client not-found is a NEUTRAL status card: never the
          // builder diagnostic title, never the postId, zero forbidden tokens.
          expect(html).toContain('data-builder-blog-card-status="not-found"');
          expect(html).toContain(copy.runtime.publishedUnavailableTitle);
          expect(html).toContain(copy.runtime.publishedUnavailableExcerpt);
          expect(html).not.toContain(copy.runtime.postNotFound('missing-post'));
          expect(html).not.toContain(copy.runtime.failedToLoadPost('missing-post'));
          expectNoPublishedMockLeak(html);
          expectNoForbiddenPublicTokens(html);
        } else {
          // Builder not-found keeps the diagnostic title (with postId) and the
          // mock design card with one disclosure.
          expect(html).toContain(copy.runtime.postNotFound('missing-post'));
          expect(html).not.toContain(copy.runtime.failedToLoadPost('missing-post'));
          expect(html).toContain(copy.runtime.mockPost.authorName);
          expect(html).toContain('2026-04-12');
        }
      } finally {
        await renderer.unmount();
      }
    }
  });

  // ── Mutation probe: early returns bypass the disclosure wrapper ──

  it('mutation probe: an early return in loading or selected drops disclosures to zero (the behavioural assertion would fail)', () => {
    // These mutants mirror what would happen if a developer inserted an
    // early `return <CardShell …/>` inside the loading or selected branch
    // of Element.tsx, bypassing the shared `{isBuilder ? <WidgetDataDisclosure/> : null}`
    // wrapper. Both produce ZERO disclosures in edit mode — proving that
    // countDisclosures(html) === 1 is non-vacuous and would catch the mutation.

    function LoadingEarlyReturnMutant({ mode }: { mode: CardRenderMode }) {
      const isBuilder = mode !== 'published';
      const loading = true;
      const selectedItem = null;
      if (loading && !selectedItem) {
        return <article data-builder-blog-card="true">{copy.runtime.loadingTitle}</article>;
      }
      return (
        <>
          {isBuilder ? <WidgetDataDisclosure locale="zh-hant" /> : null}
          <article data-builder-blog-card="true">content</article>
        </>
      );
    }

    function SelectedEarlyReturnMutant({ mode }: { mode: CardRenderMode }) {
      const isBuilder = mode !== 'published';
      const selectedItem: { title: string } | null = { title: 'fetched post' };
      if (selectedItem) {
        return <article data-builder-blog-card="true">{selectedItem.title}</article>;
      }
      return (
        <>
          {isBuilder ? <WidgetDataDisclosure locale="zh-hant" /> : null}
          <article data-builder-blog-card="true">content</article>
        </>
      );
    }

    const loadingHtml = renderToStaticMarkup(<LoadingEarlyReturnMutant mode="edit" />);
    expect(countDisclosures(loadingHtml)).toBe(0);
    expect(loadingHtml).toContain('data-builder-blog-card');

    const selectedHtml = renderToStaticMarkup(<SelectedEarlyReturnMutant mode="edit" />);
    expect(countDisclosures(selectedHtml)).toBe(0);
    expect(selectedHtml).toContain('data-builder-blog-card');
  });
});

describe('blog post card published mock-leak remediation', () => {
  const Render = blogPostCardComponent.Render as React.ComponentType<{
    node: BuilderBlogPostCardCanvasNode;
    locale?: 'ko' | 'zh-hant' | 'en';
    mode?: 'edit' | 'preview' | 'published';
  }>;

  it('renders the localized published unconfigured copy in ko and en without mock leakage', () => {
    const koCopy = getBlogPostCardCopy('ko');
    const enCopy = getBlogPostCardCopy('en');
    const koHtml = renderToStaticMarkup(<Render node={node} locale="ko" mode="published" />);
    const enHtml = renderToStaticMarkup(<Render node={node} locale="en" mode="published" />);

    expect(koHtml).toContain(koCopy.runtime.publishedNoPostTitle);
    expect(koHtml).toContain(koCopy.runtime.publishedNoPostExcerpt);
    expect(enHtml).toContain(enCopy.runtime.publishedNoPostTitle);
    expect(enHtml).toContain(enCopy.runtime.publishedNoPostExcerpt);
    expect(koHtml).toContain('data-builder-blog-card-status="unconfigured"');
    expect(enHtml).toContain('data-builder-blog-card-status="unconfigured"');

    for (const token of [koCopy.runtime.mockPost.title, enCopy.runtime.mockPost.title, '2026-04-12']) {
      expect(koHtml).not.toContain(token);
      expect(enHtml).not.toContain(token);
    }
    expect(countDisclosures(koHtml)).toBe(0);
    expect(countDisclosures(enHtml)).toBe(0);
  });

  it('renders localized neutral published copy for unconfigured and not-found across ko/zh-hant/en with zero forbidden tokens', () => {
    const locales = ['ko', 'zh-hant', 'en'] as const;
    const notFoundNode = {
      ...node,
      content: { ...node.content, postId: 'missing-post' },
    } as unknown as BuilderBlogPostCardCanvasNode;

    for (const locale of locales) {
      const locCopy = getBlogPostCardCopy(locale);
      const unconfiguredHtml = renderToStaticMarkup(<Render node={node} locale={locale} mode="published" />);
      const notFoundHtml = renderToStaticMarkup(<Render node={notFoundNode} locale={locale} mode="published" />);

      // Unconfigured neutral copy (present-tense, no future promise) — pinned
      // literally and reconciled with the copy object.
      expect(unconfiguredHtml).toContain(pinnedPublishedNoPostTitle[locale]);
      expect(pinnedPublishedNoPostTitle[locale]).toBe(locCopy.runtime.publishedNoPostTitle);
      expect(unconfiguredHtml).toContain(locCopy.runtime.publishedNoPostTitle);
      expect(unconfiguredHtml).toContain(locCopy.runtime.publishedNoPostExcerpt);
      expect(unconfiguredHtml).toContain('data-builder-blog-card-status="unconfigured"');

      // Not-found neutral copy — the localized builder diagnostic must not leak.
      expect(notFoundHtml).toContain(locCopy.runtime.publishedUnavailableTitle);
      expect(notFoundHtml).toContain(locCopy.runtime.publishedUnavailableExcerpt);
      expect(notFoundHtml).toContain('data-builder-blog-card-status="not-found"');
      expect(notFoundHtml).not.toContain(locCopy.runtime.postNotFound('missing-post'));

      for (const html of [unconfiguredHtml, notFoundHtml]) {
        expectNoForbiddenPublicTokens(html);
        expect(countDisclosures(html)).toBe(0);
        // No locale-specific mock metadata and no builder instruction excerpt.
        expect(html).not.toContain(locCopy.runtime.mockPost.title);
        expect(html).not.toContain(locCopy.runtime.mockPost.excerpt);
        expect(html).not.toContain(locCopy.runtime.mockPost.authorName);
        expect(html).not.toContain(locCopy.runtime.errorExcerpt);
      }
    }
  });

  it('source guard: published non-selected branches route through StatusShell and cannot reference or spread mockPost', () => {
    const source = readFileSync(join(componentRoot, 'blogPostCard/Element.tsx'), 'utf8');

    // The mock-consuming branch is gated behind isBuilder so published renders can
    // never reach it.
    expect(source).toContain('} else if (isBuilder) {');

    // Brace-match the builder branch to isolate the published `else` block, then prove
    // it contains no mockPost/createMockPost reference at all — only StatusShell calls.
    const builderKeyword = '} else if (isBuilder) {';
    const builderStart = source.indexOf(builderKeyword);
    expect(builderStart).toBeGreaterThan(0);
    const builderOpen = source.indexOf('{', builderStart);
    let depth = 1;
    let cursor = builderOpen + 1;
    while (cursor < source.length && depth > 0) {
      const code = source.charCodeAt(cursor);
      if (code === 123) depth += 1;
      else if (code === 125) depth -= 1;
      cursor += 1;
    }
    const afterBuilder = source.slice(cursor);
    const builderBlock = source.slice(builderStart, cursor);
    const elseIndex = afterBuilder.indexOf('else {');
    expect(elseIndex).toBeGreaterThanOrEqual(0);
    const returnIndex = afterBuilder.indexOf('return (', elseIndex);
    expect(returnIndex).toBeGreaterThan(elseIndex);
    const publishedBlock = afterBuilder.slice(elseIndex, returnIndex);

    expect(publishedBlock).not.toContain('mockPost');
    expect(publishedBlock).not.toContain('createMockPost');
    expect(publishedBlock).not.toContain('c.postId');
    expect(publishedBlock).not.toContain('errorExcerpt');
    expect(publishedBlock).not.toContain('postNotFound');
    expect(publishedBlock).not.toContain('failedToLoadPost');
    // The published loading branch must use the public-only fields and never
    // reference the builder "selected post" loading copy.
    expect(publishedBlock).not.toContain('loadingTitle');
    expect(publishedBlock).not.toContain('loadingExcerpt');
    expect(publishedBlock).toContain('publishedLoadingTitle');
    expect(publishedBlock).toContain('publishedLoadingExcerpt');
    expect(publishedBlock).toContain('StatusShell');
    expect(publishedBlock).toContain('status="unconfigured"');
    expect(publishedBlock).toContain('status="loading"');
    expect(publishedBlock).toContain('status="load-failed"');
    expect(publishedBlock).toContain('status="not-found"');

    // Builder edit/preview still own the selected-post loading diagnostics.
    expect(builderBlock).toContain('loadingTitle');
    expect(builderBlock).toContain('loadingExcerpt');

    // Registry invariants: exactly one disclosure expression and its import stay intact.
    const disclosureExpression = '{isBuilder ? <WidgetDataDisclosure locale={effectiveLocale} /> : null}';
    expect(source.split(disclosureExpression).length - 1).toBe(1);
    expect(source).toContain("import { WidgetDataDisclosure } from '../_shared/WidgetDataDisclosure';");
  });

  it('source guard: mock item is spread only inside the builder branch (exactly three item usages)', () => {
    const source = readFileSync(join(componentRoot, 'blogPostCard/Element.tsx'), 'utf8');
    // The builder branch consumes the mock item exactly three times: the no-post
    // direct item, the loading spread, and the not-found/load-failed spread.
    expect(source.split('item={mockPost}').length - 1).toBe(1);
    expect(source.split('...mockPost').length - 1).toBe(2);
  });
});
