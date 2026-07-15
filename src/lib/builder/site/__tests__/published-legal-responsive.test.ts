import { describe, expect, it } from 'vitest';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { STANDARD_PAGE_DECOMPOSERS } from '@/lib/builder/canvas/seed-pages';
import { buildPublishedResponsiveStylesheet } from '@/lib/builder/site/responsive-stylesheet';

describe('published legal responsive repair', () => {
  it('repairs already-persisted broken privacy mobile overrides without mutating runtime input', () => {
    const input = STANDARD_PAGE_DECOMPOSERS.privacy('ko').nodes.map((node): BuilderCanvasNode => (
      node.id.startsWith('page-privacy-legal')
        || node.id.startsWith('page-privacy-card')
        || node.id.startsWith('page-privacy-section')
        ? {
            ...node,
            responsive: {
              ...(node.responsive ?? {}),
              mobile: {
                ...(node.responsive?.mobile ?? {}),
                rect: { x: 176, y: 0, width: 169, height: 60 },
              },
            },
          }
        : node
    ));
    const before = JSON.stringify(input);

    const css = buildPublishedResponsiveStylesheet(input);

    expect(JSON.stringify(input)).toBe(before);
    expect(css).toContain('[data-node-id="page-privacy-legal-grid"] { position: absolute !important; left: 16px !important; top: 0px !important; width: 343px !important;');
    expect(css).toContain('[data-node-id="page-privacy-card-0"] { position: absolute !important; left: 0px !important; top: 0px !important; width: 343px !important;');
    expect(css).toContain('[data-node-id="page-privacy-card-1"] { position: absolute !important; left: 0px !important;');
    expect(css).toContain('[data-node-id="page-privacy-card-0-title"] { position: absolute !important; left: 24px !important; top: 24px !important; width: 295px !important;');
    expect(css).not.toContain('[data-node-id="page-privacy-card-1"] { position: absolute !important; left: 176px !important; top: 0px !important; width: 169px !important; height: 60px !important; }');
  });
});
