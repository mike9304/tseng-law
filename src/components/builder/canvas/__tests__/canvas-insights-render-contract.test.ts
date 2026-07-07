import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { createInsightsDecomposedNodes } from '@/lib/builder/canvas/decompose-insights';

const root = process.cwd();

function read(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

describe('canvas insights render contract', () => {
  it('keeps decomposed insights text nodes as the editor render source', () => {
    const nodes = createInsightsDecomposedNodes(0, 'zh-hant', 0);
    const listWrap = nodes.find((node) => node.id === 'home-insights-list-wrap');
    const title = nodes.find((node) => node.id === 'home-insights-item-0-title');
    const summary = nodes.find((node) => node.id === 'home-insights-item-0-summary');

    expect(listWrap).toMatchObject({
      kind: 'container',
      content: expect.objectContaining({ className: 'insights-list-wrap' }),
    });
    expect(title).toMatchObject({
      kind: 'text',
      parentId: 'home-insights-item-0-copy',
    });
    expect(summary).toMatchObject({
      kind: 'text',
      parentId: 'home-insights-item-0-copy',
    });
  });

  it('does not append the archive-list widget preview to the decomposed editor wrapper', () => {
    const canvasNode = read('src/components/builder/canvas/CanvasNode.tsx');

    expect(canvasNode).not.toContain("import { InsightsArchiveListPreview } from './CanvasInsightsPreview';");
    expect(canvasNode).not.toContain('showInsightsListPreview');
    expect(canvasNode).not.toContain('<InsightsArchiveListPreview');
    expect(canvasNode).toContain('hideRedundantLegacyInsightsComposite');
    expect(canvasNode).toContain("node.id === 'home-insights'");
    expect(canvasNode).toContain("nodesById.has('home-insights-list-wrap')");
  });
});
