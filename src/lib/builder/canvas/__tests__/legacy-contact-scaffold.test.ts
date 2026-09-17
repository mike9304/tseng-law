import { describe, expect, it } from 'vitest';

import {
  LEGACY_CONTACT_SCAFFOLD_COMPOSITE_ID,
  LEGACY_CONTACT_SCAFFOLD_ROOT_ID,
  matchLegacyContactScaffold,
} from '@/lib/builder/canvas/legacy-contact-scaffold';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

function makeNode(overrides: Record<string, unknown> = {}): BuilderCanvasNode {
  return {
    id: 'node',
    kind: 'container',
    parentId: undefined,
    rect: { x: 0, y: 0, width: 1280, height: 3057 },
    style: {},
    content: {},
    visible: true,
    locked: false,
    rotation: 0,
    zIndex: 0,
    ...overrides,
  } as BuilderCanvasNode;
}

function exactScaffold(tweaks?: {
  root?: Record<string, unknown>;
  child?: Record<string, unknown>;
}): BuilderCanvasNode[] {
  return [
    makeNode({
      id: LEGACY_CONTACT_SCAFFOLD_ROOT_ID,
      kind: 'container',
      parentId: undefined,
      content: { as: 'main', layoutMode: 'absolute' },
      ...tweaks?.root,
    }),
    makeNode({
      id: LEGACY_CONTACT_SCAFFOLD_COMPOSITE_ID,
      kind: 'composite',
      parentId: LEGACY_CONTACT_SCAFFOLD_ROOT_ID,
      content: { componentKey: 'legacy-page-contact', config: { locale: 'ko' } },
      ...tweaks?.child,
    }),
  ];
}

describe('matchLegacyContactScaffold', () => {
  it('returns root and composite ids for the exact 2-node fixture', () => {
    expect(matchLegacyContactScaffold(exactScaffold())).toEqual({
      rootId: LEGACY_CONTACT_SCAFFOLD_ROOT_ID,
      compositeId: LEGACY_CONTACT_SCAFFOLD_COMPOSITE_ID,
    });
  });

  it('matches when root layoutMode is absent and native 390/768 widths are present', () => {
    const nodes = exactScaffold({
      root: {
        content: { as: 'main' },
        responsive: {
          tablet: { rect: { width: 768 } },
          mobile: { rect: { width: 390 } },
        },
      },
      child: {
        responsive: {
          tablet: { rect: { width: 768 } },
          mobile: { rect: { width: 390 } },
        },
      },
    });
    expect(matchLegacyContactScaffold(nodes)).not.toBeNull();
  });

  it('does not mutate the input nodes', () => {
    const nodes = exactScaffold();
    const snapshot = JSON.stringify(nodes);
    matchLegacyContactScaffold(nodes);
    expect(JSON.stringify(nodes)).toBe(snapshot);
  });

  it('returns null when an extra widget is present, including a hidden one', () => {
    const withVisibleExtra = [
      ...exactScaffold(),
      makeNode({ id: 'extra-widget', kind: 'text', parentId: LEGACY_CONTACT_SCAFFOLD_ROOT_ID }),
    ];
    expect(matchLegacyContactScaffold(withVisibleExtra)).toBeNull();

    const withHiddenExtra = [
      ...exactScaffold(),
      makeNode({
        id: 'hidden-extra',
        kind: 'text',
        parentId: LEGACY_CONTACT_SCAFFOLD_ROOT_ID,
        visible: false,
      }),
    ];
    expect(matchLegacyContactScaffold(withHiddenExtra)).toBeNull();
  });

  it('returns null when the child is moved', () => {
    expect(
      matchLegacyContactScaffold(
        exactScaffold({
          child: { rect: { x: 24, y: 0, width: 1280, height: 3057 } },
        }),
      ),
    ).toBeNull();
  });

  it('returns null when the child is resized', () => {
    expect(
      matchLegacyContactScaffold(
        exactScaffold({
          child: { rect: { x: 0, y: 0, width: 1280, height: 2400 } },
        }),
      ),
    ).toBeNull();
  });

  it('returns null for a different composite componentKey', () => {
    expect(
      matchLegacyContactScaffold(
        exactScaffold({
          child: { content: { componentKey: 'legacy-page-about', config: { locale: 'ko' } } },
        }),
      ),
    ).toBeNull();
  });

  it('returns null when the root uses flex layout', () => {
    expect(
      matchLegacyContactScaffold(
        exactScaffold({
          root: { content: { as: 'main', layoutMode: 'flex' } },
        }),
      ),
    ).toBeNull();
  });

  it('returns null when the root kind is section', () => {
    expect(
      matchLegacyContactScaffold(
        exactScaffold({
          root: { kind: 'section' },
        }),
      ),
    ).toBeNull();
  });

  it('returns null when the child is hidden', () => {
    expect(
      matchLegacyContactScaffold(
        exactScaffold({
          child: { visible: false },
        }),
      ),
    ).toBeNull();
  });

  it('returns null when either node is sticky', () => {
    expect(
      matchLegacyContactScaffold(
        exactScaffold({
          root: { sticky: { offset: 0 } },
        }),
      ),
    ).toBeNull();
    expect(
      matchLegacyContactScaffold(
        exactScaffold({
          child: { sticky: { offset: 8, from: 'top' } },
        }),
      ),
    ).toBeNull();
    expect(
      matchLegacyContactScaffold(
        exactScaffold({
          root: { content: { as: 'main', layoutMode: 'absolute', sticky: true } },
        }),
      ),
    ).toBeNull();
  });

  it('returns null when either node is rotated', () => {
    expect(
      matchLegacyContactScaffold(
        exactScaffold({
          root: { rotation: 15 },
        }),
      ),
    ).toBeNull();
    expect(
      matchLegacyContactScaffold(
        exactScaffold({
          child: { rotation: -90 },
        }),
      ),
    ).toBeNull();
  });

  it('returns null when the child responsive rect is independently moved or resized', () => {
    expect(
      matchLegacyContactScaffold(
        exactScaffold({
          child: {
            responsive: {
              mobile: { rect: { x: 16, y: 40, width: 300, height: 800 } },
            },
          },
        }),
      ),
    ).toBeNull();
    expect(
      matchLegacyContactScaffold(
        exactScaffold({
          root: {
            responsive: { mobile: { rect: { width: 390, height: 4000 } } },
          },
          child: {
            responsive: { mobile: { rect: { width: 390, height: 2200 } } },
          },
        }),
      ),
    ).toBeNull();
  });

  it('returns null when the child has a mobile width override and the root has none', () => {
    expect(
      matchLegacyContactScaffold(
        exactScaffold({
          child: {
            responsive: { mobile: { rect: { width: 500 } } },
          },
        }),
      ),
    ).toBeNull();
  });

  it('returns null when root and child share a nonzero mobile origin', () => {
    expect(
      matchLegacyContactScaffold(
        exactScaffold({
          root: {
            responsive: { mobile: { rect: { x: 10 } } },
          },
          child: {
            responsive: { mobile: { rect: { x: 10 } } },
          },
        }),
      ),
    ).toBeNull();
  });

  it('matches when mobile inherits matching tablet full-bleed widths', () => {
    expect(
      matchLegacyContactScaffold(
        exactScaffold({
          root: {
            responsive: { tablet: { rect: { width: 768 } } },
          },
          child: {
            responsive: { tablet: { rect: { width: 768 } } },
          },
        }),
      ),
    ).not.toBeNull();
  });

  it('returns null when the child mobile width differs from the inherited tablet width', () => {
    expect(
      matchLegacyContactScaffold(
        exactScaffold({
          root: {
            responsive: { tablet: { rect: { width: 768 } } },
          },
          child: {
            responsive: {
              tablet: { rect: { width: 768 } },
              mobile: { rect: { width: 500 } },
            },
          },
        }),
      ),
    ).toBeNull();
  });
});
