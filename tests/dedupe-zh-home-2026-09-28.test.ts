/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck -- runtime-shape fixtures intentionally exercise the JavaScript CLI boundary.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  APPLY_DISABLED_MESSAGE,
  current9LayoutFrom,
  formatDedupePlan,
  parseArgs,
  planZhHomeDedupe,
  runZhHomeDedupe,
} from '../scripts/dedupe-zh-home-2026-09-28.mjs';
import * as parity from '../src/lib/builder/canvas/home-composite-parity.ts';
import { createHomePageCanvasDocument } from '../src/lib/builder/canvas/seed-home.ts';
import {
  builderCanvasDocumentSchema,
  createDefaultCanvasNodeStyle,
  normalizeCanvasDocument,
} from '../src/lib/builder/canvas/types.ts';
import { matchCurrent9PublishedHomeEditorial } from '../src/lib/builder/site/published-home-editorial.ts';

// The July zh-hant home fixture has the same shape as the live published page:
// nine `home-*-root` static trees plus the nine `home-*` composites.
const fixture = JSON.parse(
  readFileSync(path.join(process.cwd(), 'src/lib/builder/canvas/__tests__/fixtures/legacy-zh-home-july.json'), 'utf8'),
);
const zhDocument = fixture.document ?? fixture;
const layout = current9LayoutFrom(parity, createDefaultCanvasNodeStyle);

function koFrom(zh) {
  return {
    ...zh,
    locale: 'ko',
    nodes: zh.nodes
      .filter((node) => !node.parentId && node.kind === 'composite')
      .map((node) => ({ ...node, content: { ...node.content, config: { ...node.content.config, locale: 'ko' } } })),
  };
}

function plan(zh = zhDocument, ko = koFrom(zhDocument)) {
  return planZhHomeDedupe(zh, ko, { now: '2026-09-28T00:00:00.000Z', layout });
}

describe('dedupe-zh-home-2026-09-28 planner', () => {
  it('removes every legacy root tree and keeps the nine composites', () => {
    const result = plan();
    expect(result.ok).toBe(true);
    const composites = zhDocument.nodes.filter((node) => !node.parentId && node.kind === 'composite');
    expect(result.keptIds).toEqual([...parity.HOME_COMPOSITE_SECTION_IDS]);
    expect(result.removed.map((entry) => entry.rootId)).toEqual(composites.map((node) => `${node.id}-root`));
    expect(result.removed.reduce((sum, entry) => sum + entry.nodeCount, 0) + composites.length).toBe(zhDocument.nodes.length);
    expect(result.removed.flatMap((entry) => entry.flagged).join(' ')).toMatch(/157/);
    // the original document is not mutated
    expect(zhDocument.nodes.length).toBeGreaterThan(composites.length);
  });

  it('rebuilds the composites in the current9 shape the public renderer recognises', () => {
    const result = plan();
    const { document } = result;
    expect(document.stageHeight).toBe(parity.PUBLISHED_HOME_COMPOSITE_STAGE_HEIGHT_BY_LOCALE['zh-hant']);
    document.nodes.forEach((node, index) => {
      expect(node.zIndex).toBe(index);
      expect(node).not.toHaveProperty('anchorName');
      expect(node.content).toEqual({ componentKey: node.content.componentKey, config: { locale: 'zh-hant' } });
    });
    expect(matchCurrent9PublishedHomeEditorial({ document, locale: 'zh-hant', slugPath: '' })).toEqual({ locale: 'zh-hant' });

    // --apply publishes the schema-parsed document, so that must still match.
    const parsed = builderCanvasDocumentSchema.safeParse(document);
    expect(parsed.success).toBe(true);
    expect(matchCurrent9PublishedHomeEditorial({ document: parsed.data, locale: 'zh-hant', slugPath: '' })).toEqual({ locale: 'zh-hant' });

    // Same nodes as the canonical zh-hant home the seed produces (rendered by published-home-editorial-render.test).
    const seed = normalizeCanvasDocument(createHomePageCanvasDocument('zh-hant'), 'zh-hant');
    expect(matchCurrent9PublishedHomeEditorial({ document: seed, locale: 'zh-hant', slugPath: '' })).toEqual({ locale: 'zh-hant' });
    expect(parsed.data.nodes).toEqual(seed.nodes);
  });

  it('prints a dry-run plan without any write', () => {
    const text = formatDedupePlan(plan());
    expect(text).toContain('DRY RUN');
    expect(text).toContain('remove home-hero-root');
    expect(text).toContain('rebuilt in the current9 shape (stage height 7122)');
    expect(text).not.toContain('ABORT');
    expect(text).toContain('Dry-run complete; no persistence write was attempted.');
  });

  it('aborts when the composites differ from the ko home', () => {
    const ko = koFrom(zhDocument);
    ko.nodes = ko.nodes.slice(1);
    const result = plan(zhDocument, ko);
    expect(result.ok).toBe(false);
    expect(formatDedupePlan(result)).toContain('ABORT');
  });

  it('aborts on an unexpected top-level node instead of removing it', () => {
    const extra = { ...zhDocument, nodes: [...zhDocument.nodes, { ...zhDocument.nodes.find((node) => node.id === 'home-hero-root'), id: 'home-extra' }] };
    const result = plan(extra);
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/unexpected top-level nodes: home-extra/);
  });

  it('aborts when the home is already deduplicated, or without the current9 layout', () => {
    const clean = { ...zhDocument, nodes: zhDocument.nodes.filter((node) => !node.parentId && node.kind === 'composite') };
    expect(plan(clean).error).toMatch(/already deduplicated/);
    expect(planZhHomeDedupe(zhDocument, koFrom(zhDocument)).error).toMatch(/current9 layout/);
  });
});

describe('dedupe-zh-home-2026-09-28 writes are disabled (A4 P1)', () => {
  const quiet = { stdout: { write() {} } };
  const pages = [
    { pageId: 'zh-home', locale: 'zh-hant', isHomePage: true },
    { pageId: 'ko-home', locale: 'ko', isHomePage: true },
  ];

  function recordingDeps(overrides = {}) {
    const writes = [];
    const forbidden = (name) => async () => {
      writes.push(name);
      throw new Error(`${name} must not be called`);
    };
    return {
      writes,
      deps: {
        readSiteDocument: async () => ({ pages }),
        readPublishedPageCanvas: async (page) => (page.locale === 'zh-hant' ? zhDocument : koFrom(zhDocument)),
        current9Layout: layout,
        matchCurrent9PublishedHomeEditorial,
        builderCanvasDocumentSchema,
        // Write-capable functions a caller might still pass; none may be reached.
        updatePageCanvasRecord: forbidden('updatePageCanvasRecord'),
        publishPageThroughPipeline: forbidden('publishPageThroughPipeline'),
        runPublishChecks: forbidden('runPublishChecks'),
        ...overrides,
      },
    };
  }

  it('rejects --apply on the CLI and keeps the dry-run default', () => {
    expect(() => parseArgs(['--apply'])).toThrow(APPLY_DISABLED_MESSAGE);
    expect(() => parseArgs(['--dry-run', '--apply'])).toThrow(APPLY_DISABLED_MESSAGE);
    expect(parseArgs([]).apply).toBe(false);
    expect(() => parseArgs(['--backup-dir=/tmp/x'])).toThrow(/Unknown argument/);
  });

  it('rejects { apply: true } on the exported runner before any read or write', async () => {
    const reads = [];
    const { deps, writes } = recordingDeps({
      readSiteDocument: async () => {
        reads.push('readSiteDocument');
        return { pages };
      },
    });
    await expect(runZhHomeDedupe({ apply: true, siteId: 'tseng-law-main-site' }, deps, quiet)).rejects.toThrow(APPLY_DISABLED_MESSAGE);
    expect(reads).toEqual([]);
    expect(writes).toEqual([]);
  });

  it('a dry run through the runner validates the plan and never reaches a write or publish function', async () => {
    const { deps, writes } = recordingDeps();
    const result = await runZhHomeDedupe({ apply: false, siteId: 'tseng-law-main-site' }, deps, quiet);
    expect(result.ok).toBe(true);
    expect(result.applied).toBe(false);
    expect(writes).toEqual([]);
  });

  it('leaves no persistence write, backup or publish call in the script source', () => {
    const source = readFileSync(path.join(process.cwd(), 'scripts/dedupe-zh-home-2026-09-28.mjs'), 'utf8');
    expect(source).not.toMatch(/updatePageCanvasRecord|publishPage|runPublishChecks|writeFile|mkdir|\.\.\.persistence/);
  });
});
