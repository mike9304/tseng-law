import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('canonical home canvas stage height contract', () => {
  it('derives the active viewport height before adding interactive preview expansion', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'src/components/builder/canvas/CanvasContainer.tsx'),
      'utf8',
    );

    expect(source).toContain('computeEffectiveViewportStageHeight,');
    expect(source).toContain('const viewportStageHeight = useMemo(() => computeEffectiveViewportStageHeight({');
    expect(source).toContain('fallbackStageHeight: documentStageHeight,');
    expect(source).toContain('viewport: currentViewport,');
    expect(source).toContain('const effectiveStageHeight = viewportStageHeight + previewStageExtra;');
    expect(source).not.toContain('const effectiveStageHeight = documentStageHeight + previewStageExtra;');
  });
});
