/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck -- runtime-shape fixtures intentionally exercise the JavaScript CLI boundary.
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';
import {
  NEW_H1,
  NEW_SUBTITLE,
  NEW_TYPING_PHRASE,
  OLD_H1,
  OLD_SUBTITLE,
  OLD_TYPING_PHRASE,
  findHomePageMeta,
  formatPatchPlan,
  planZhHeroPatch,
  validatePatchedDocument,
} from '../scripts/patch-zh-hero-2026-07-21.mjs';
import {
  builderCanvasDocumentSchema,
  builderCanvasNodeSchema,
} from '../src/lib/builder/canvas/types.ts';
import {
  writePageCanvas,
  writeSiteDocument,
} from '../src/lib/builder/site/persistence.ts';
import { createDefaultSiteDocument } from '../src/lib/builder/site/types.ts';

const STYLE = {
  backgroundColor: 'transparent',
  borderColor: '#cbd5e1',
  borderStyle: 'solid',
  borderWidth: 0,
  borderRadius: 0,
  shadowX: 0,
  shadowY: 0,
  shadowBlur: 0,
  shadowSpread: 0,
  shadowColor: 'rgba(15, 23, 42, 0.16)',
  opacity: 100,
};

function baseNode(overrides = {}) {
  return {
    id: 'node',
    kind: 'container',
    rect: { x: 0, y: 0, width: 100, height: 100 },
    style: { ...STYLE },
    zIndex: 0,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      label: 'container',
      background: 'transparent',
      borderColor: '#cbd5e1',
      borderStyle: 'solid',
      borderWidth: 0,
      borderRadius: 0,
      padding: 0,
      layoutMode: 'absolute',
    },
    ...overrides,
  };
}

function container(id, parentId, rect, content = {}, overrides = {}) {
  return baseNode({
    id,
    ...(parentId ? { parentId } : {}),
    rect,
    content: {
      ...baseNode().content,
      ...content,
    },
    ...overrides,
  });
}

function text(id, parentId, value, content = {}, overrides = {}) {
  return baseNode({
    id,
    kind: 'text',
    parentId,
    rect: { x: 0, y: 0, width: 500, height: 80 },
    content: {
      text: value,
      fontSize: 32,
      color: '#ffffff',
      fontWeight: 'regular',
      align: 'left',
      lineHeight: 1.25,
      letterSpacing: 0,
      ...content,
    },
    ...overrides,
  });
}

function image(id, parentId, src, rect, overrides = {}) {
  return baseNode({
    id,
    kind: 'image',
    parentId,
    rect,
    content: {
      src,
      alt: 'hero',
      fit: 'cover',
      clickAction: 'none',
    },
    ...overrides,
  });
}

function fixture(locale, geometry = {}) {
  const width = geometry.width ?? (locale === 'ko' ? 1280 : 1080);
  const imageWidth = geometry.imageWidth ?? (locale === 'ko' ? 1280 : 1080);
  const mediaId = geometry.mediaId ?? 'home-hero-media';
  const imageId = geometry.imageId ?? 'home-hero-media-image';
  return {
    version: 1,
    locale,
    updatedAt: '2026-07-20T00:00:00.000Z',
    updatedBy: 'fixture',
    stageWidth: 1280,
    stageHeight: 820,
    nodes: [
      container(
        'home-hero-root',
        undefined,
        { x: 0, y: 0, width, height: 820 },
        { label: 'home hero root', className: 'hero', as: 'section', htmlId: 'hero' },
      ),
      container(
        mediaId,
        'home-hero-root',
        { x: 0, y: 0, width, height: 820 },
        { label: 'hero media', className: 'hero-media' },
      ),
      image(
        imageId,
        mediaId,
        locale === 'ko' ? '/images/ko-hero.webp' : '/images/zh-hero.webp',
        { x: locale === 'ko' ? 0 : 20, y: 0, width: imageWidth, height: 820 },
        {
          responsive: {
            tablet: { rect: { x: 0, width: locale === 'ko' ? 760 : 620 } },
            mobile: { rect: { x: 0, width: locale === 'ko' ? 390 : 330 } },
          },
          content: {
            src: locale === 'ko' ? '/images/ko-hero.webp' : '/images/zh-hero.webp',
            alt: locale === 'ko' ? 'ko hero' : 'zh hero',
            srcByLocale: { [locale]: locale === 'ko' ? '/images/ko-local.webp' : '/images/zh-local.webp' },
            fit: locale === 'ko' ? 'cover' : 'contain',
            clickAction: 'none',
            ...(locale === 'ko' ? { focalPoint: { x: 45, y: 50 } } : {}),
          },
        },
      ),
      text(
        'home-hero-title',
        'home-hero-root',
        locale === 'zh-hant' ? OLD_H1 : '대만 법률을 한국어로 명확하게.',
        { className: 'hero-title', as: 'h1' },
        { rect: { x: 0, y: 56, width: locale === 'ko' ? 780 : 440, height: 167 } },
      ),
      text(
        'home-hero-subtitle',
        'home-hero-root',
        locale === 'zh-hant' ? OLD_SUBTITLE : '한국어 소통이 가능한 팀',
        { className: 'hero-subtitle', as: 'p' },
      ),
      text(
        'home-hero-typing',
        'home-hero-root',
        locale === 'zh-hant' ? OLD_TYPING_PHRASE : '대만 투자 파트너',
        { className: 'hero-typing', as: 'p' },
      ),
    ],
  };
}

const SCHEMAS = { builderCanvasDocumentSchema, builderCanvasNodeSchema };
const execFileAsync = promisify(execFile);

describe('planZhHeroPatch', () => {
  it('replaces locked copy, widens h1, and copies only safe ko geometry/fit fields', () => {
    const zh = fixture('zh-hant');
    const ko = fixture('ko');
    const result = planZhHeroPatch(zh, ko, { now: '2026-07-21T00:00:00.000Z' });

    expect(result.ok).toBe(true);
    const byId = new Map(result.document.nodes.map((node) => [node.id, node]));
    expect(byId.get('home-hero-title').content.text).toBe(NEW_H1);
    expect(byId.get('home-hero-subtitle').content.text).toBe(NEW_SUBTITLE);
    expect(byId.get('home-hero-typing').content.text).toBe(NEW_TYPING_PHRASE);
    expect(byId.get('home-hero-title').rect.width).toBe(780);
    expect(byId.get('home-hero-root').rect.width).toBe(1280);
    expect(byId.get('home-hero-media').rect.width).toBe(1280);
    expect(byId.get('home-hero-media-image').rect).toEqual({ x: 0, y: 0, width: 1280, height: 820 });
    expect(byId.get('home-hero-media-image').responsive.tablet.rect.width).toBe(760);
    expect(byId.get('home-hero-media-image').content.fit).toBe('cover');
    expect(byId.get('home-hero-media-image').content.focalPoint).toEqual({ x: 45, y: 50 });

    // Locale-owned media and unrelated copy are not imported from ko.
    expect(byId.get('home-hero-media-image').content.src).toBe('/images/zh-hero.webp');
    expect(byId.get('home-hero-media-image').content.srcByLocale).toEqual({
      'zh-hant': '/images/zh-local.webp',
    });
    expect(byId.get('home-hero-media-image').content.alt).toBe('zh hero');

    expect(zh.nodes.find((node) => node.id === 'home-hero-title').content.text).toBe(OLD_H1);
    expect(result.geometryCandidates).toEqual([]);
    expect(validatePatchedDocument(result.document, SCHEMAS)).toMatchObject({ ok: true });
    expect(result.document.nodes.every((node) => builderCanvasNodeSchema.safeParse(node).success)).toBe(true);

    const output = formatPatchPlan(result);
    expect(output).toContain('home-hero-title :: content.text');
    expect(output).toContain(`${JSON.stringify(OLD_H1)} -> ${JSON.stringify(NEW_H1)}`);
    expect(output).toContain('Dry-run complete; no persistence write was attempted.');
  });

  it('fails closed with an unchanged document when the exact old h1 is missing', () => {
    const zh = fixture('zh-hant');
    zh.nodes.find((node) => node.id === 'home-hero-title').content.text = NEW_H1;
    const before = structuredClone(zh);
    const result = planZhHeroPatch(zh, fixture('ko'));

    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/was not found/);
    expect(result.changes).toEqual([]);
    expect(result.document).toEqual(before);
  });

  it('fails closed when more than one hero h1 carries the locked old value', () => {
    const zh = fixture('zh-hant');
    zh.nodes.push(text(
      'home-hero-title-copy',
      'home-hero-root',
      OLD_H1,
      { className: 'hero-title', as: 'h1' },
    ));
    const result = planZhHeroPatch(zh, fixture('ko'));

    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/ambiguous \(2 matches\)/);
    expect(result.changes).toEqual([]);
  });

  it('prints role candidates but does not copy geometry when exact ids are absent', () => {
    const zh = fixture('zh-hant', {
      width: 1110,
      imageWidth: 1090,
      mediaId: 'zh-hero-media-role',
      imageId: 'zh-hero-image-role',
    });
    const result = planZhHeroPatch(zh, fixture('ko'));
    const byId = new Map(result.document.nodes.map((node) => [node.id, node]));

    expect(result.ok).toBe(true);
    expect(byId.get('zh-hero-media-role').rect.width).toBe(1110);
    expect(byId.get('zh-hero-image-role').rect.width).toBe(1090);
    expect(result.geometryCandidates.map((entry) => entry.role)).toEqual([
      'hero-media',
      'hero-image-primary',
    ]);
    expect(result.geometryCandidates[0].targetCandidates).toEqual([
      expect.objectContaining({ id: 'zh-hero-media-role', className: 'hero-media' }),
    ]);
    expect(formatPatchPlan(result)).toContain('CANDIDATES ONLY: hero-media');
  });
});

describe('page and schema guards', () => {
  it('requires exactly one locale-owned home page', () => {
    const pages = [
      { pageId: 'ko-home', locale: 'ko', slug: '', isHomePage: true },
      { pageId: 'zh-home', locale: 'zh-hant', slug: '', isHomePage: true },
    ];
    expect(findHomePageMeta(pages, 'zh-hant').pageId).toBe('zh-home');
    expect(() => findHomePageMeta(pages, 'en')).toThrow(/found 0/);
    expect(() => findHomePageMeta([...pages, { ...pages[1], pageId: 'zh-home-2' }], 'zh-hant'))
      .toThrow(/found 2/);
  });

  it('reports node-level schema failures before document persistence', () => {
    const invalid = fixture('zh-hant');
    invalid.nodes[0].rect.width = 0;
    const validation = validatePatchedDocument(invalid, SCHEMAS);
    expect(validation.ok).toBe(false);
    expect(validation.error).toBe('builderCanvasNodeSchema validation failed');
    expect(validation.nodeIssues[0].nodeId).toBe('home-hero-root');
  });

  it('runs a successful dry-run through the isolated local file backend without changing bytes', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'zh-hero-dry-run-'));
    const previous = {
      root: process.env.BUILDER_SITE_ROOT,
      backend: process.env.BUILDER_SITE_BACKEND,
      consultation: process.env.CONSULTATION_LOG_BACKEND,
    };
    process.env.BUILDER_SITE_ROOT = root;
    process.env.BUILDER_SITE_BACKEND = 'local';
    process.env.CONSULTATION_LOG_BACKEND = 'local';

    try {
      const siteId = 'tseng-law-main-site';
      const site = createDefaultSiteDocument('ko', siteId);
      const koPage = {
        ...site.pages[0],
        pageId: 'home-ko',
        locale: 'ko',
        slug: '',
        isHomePage: true,
        publishedAt: '2026-07-20T00:00:00.000Z',
      };
      const zhPage = {
        ...koPage,
        pageId: 'home-zh-hant',
        locale: 'zh-hant',
      };
      site.pages = [koPage, zhPage];
      await writeSiteDocument(site, { preserveMissingPages: false });
      await writePageCanvas(siteId, koPage.pageId, 'published', fixture('ko'));
      await writePageCanvas(siteId, zhPage.pageId, 'published', fixture('zh-hant'));

      const zhPath = path.join(root, siteId, 'pages', `${zhPage.pageId}.published.json`);
      const before = await readFile(zhPath, 'utf8');
      const childEnv = {
        ...process.env,
        BUILDER_SITE_ROOT: root,
        BUILDER_SITE_BACKEND: 'local',
        CONSULTATION_LOG_BACKEND: 'local',
      };
      delete childEnv.NO_COLOR;
      delete childEnv.FORCE_COLOR;
      const { stdout, stderr } = await execFileAsync(
        process.execPath,
        [path.resolve('scripts/patch-zh-hero-2026-07-21.mjs')],
        {
          cwd: path.resolve('.'),
          env: childEnv,
        },
      );

      expect(stderr).toBe('');
      expect(stdout).toContain('zh-hant home hero patch (DRY RUN)');
      expect(stdout).toContain('Schema validation: PASS');
      expect(await readFile(zhPath, 'utf8')).toBe(before);
    } finally {
      if (previous.root === undefined) delete process.env.BUILDER_SITE_ROOT;
      else process.env.BUILDER_SITE_ROOT = previous.root;
      if (previous.backend === undefined) delete process.env.BUILDER_SITE_BACKEND;
      else process.env.BUILDER_SITE_BACKEND = previous.backend;
      if (previous.consultation === undefined) delete process.env.CONSULTATION_LOG_BACKEND;
      else process.env.CONSULTATION_LOG_BACKEND = previous.consultation;
      await rm(root, { recursive: true, force: true });
    }
  });
});
