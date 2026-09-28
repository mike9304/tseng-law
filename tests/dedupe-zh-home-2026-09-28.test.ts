/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck -- runtime-shape fixtures intentionally exercise the JavaScript CLI boundary.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { formatDedupePlan, planZhHomeDedupe } from '../scripts/dedupe-zh-home-2026-09-28.mjs';
import { builderCanvasDocumentSchema } from '../src/lib/builder/canvas/types.ts';

// The July zh-hant home fixture has the same shape as the live published page:
// nine `home-*-root` static trees plus the nine `home-*` composites.
const fixture = JSON.parse(
  readFileSync(path.join(process.cwd(), 'src/lib/builder/canvas/__tests__/fixtures/legacy-zh-home-july.json'), 'utf8'),
);
const zhDocument = fixture.document ?? fixture;

function koFrom(zh) {
  return {
    ...zh,
    locale: 'ko',
    nodes: zh.nodes
      .filter((node) => !node.parentId && node.kind === 'composite')
      .map((node) => ({ ...node, content: { ...node.content, config: { ...node.content.config, locale: 'ko' } } })),
  };
}

describe('dedupe-zh-home-2026-09-28 planner', () => {
  it('keeps exactly the nine composites and removes every legacy root tree', () => {
    const plan = planZhHomeDedupe(zhDocument, koFrom(zhDocument), { now: '2026-09-28T00:00:00.000Z' });
    expect(plan.ok).toBe(true);
    const composites = zhDocument.nodes.filter((node) => !node.parentId && node.kind === 'composite');
    expect(plan.keptIds).toEqual(composites.map((node) => node.id));
    expect(plan.document.nodes).toEqual(composites);
    expect(plan.removed.map((entry) => entry.rootId)).toEqual(composites.map((node) => `${node.id}-root`));
    expect(plan.removed.reduce((sum, entry) => sum + entry.nodeCount, 0) + composites.length).toBe(zhDocument.nodes.length);
    expect(plan.document.updatedBy).toBe('dedupe-zh-home-2026-09-28');
    expect(builderCanvasDocumentSchema.safeParse(plan.document).success).toBe(true);
    // the original document is not mutated
    expect(zhDocument.nodes.length).toBeGreaterThan(composites.length);
  });

  it('reports the stale amount and duplicated hero title it removes', () => {
    const plan = planZhHomeDedupe(zhDocument, koFrom(zhDocument));
    const text = formatDedupePlan(plan);
    expect(text).toContain('DRY RUN');
    expect(text).toContain('remove home-hero-root');
    expect(text).not.toContain('ABORT');
    expect(text).toContain('Dry-run complete; no persistence write was attempted.');
    expect(plan.removed.flatMap((entry) => entry.flagged).join(' ')).toMatch(/157/);
  });

  it('aborts when the composites differ from the ko home', () => {
    const ko = koFrom(zhDocument);
    ko.nodes = ko.nodes.slice(1);
    const plan = planZhHomeDedupe(zhDocument, ko);
    expect(plan.ok).toBe(false);
    expect(formatDedupePlan(plan)).toContain('ABORT');
  });

  it('aborts on an unexpected top-level node instead of removing it', () => {
    const extra = { ...zhDocument, nodes: [...zhDocument.nodes, { ...zhDocument.nodes.find((node) => node.id === 'home-hero-root'), id: 'home-extra' }] };
    const plan = planZhHomeDedupe(extra, koFrom(zhDocument));
    expect(plan.ok).toBe(false);
    expect(plan.error).toMatch(/unexpected top-level nodes: home-extra/);
  });

  it('aborts when the home is already deduplicated', () => {
    const ko = koFrom(zhDocument);
    const clean = { ...zhDocument, nodes: zhDocument.nodes.filter((node) => !node.parentId && node.kind === 'composite') };
    const plan = planZhHomeDedupe(clean, ko);
    expect(plan.ok).toBe(false);
    expect(plan.error).toMatch(/already deduplicated/);
  });
});
