import { describe, expect, it } from 'vitest';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import {
  areDraftDocumentsEquivalentForStaleRevision,
  resolveMissingExpectedRevisionDraftSave,
  shouldAutoDecomposeStandardPageDraft,
  shouldKeepInitialDocumentForInitialDraftLoad,
  shouldOfferDecomposeCurrentPage,
} from '../useSandboxSiteState';

function standardCompositeDocument(
  slug: string,
  options: {
    componentKey?: string;
    config?: Record<string, unknown>;
    extraNode?: Record<string, unknown>;
  } = {},
): BuilderCanvasDocument {
  const rootId = `${slug}-page-root`;
  return {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-06-29T00:00:00.000Z',
    updatedBy: 'site-page-seed',
    stageWidth: 1280,
    stageHeight: 1200,
    nodes: [
      {
        id: rootId,
        kind: 'container',
      },
      {
        id: `${rootId}-composite`,
        kind: 'composite',
        parentId: rootId,
        content: {
          componentKey: options.componentKey ?? `legacy-page-${slug}`,
          config: options.config ?? { locale: 'ko' },
        },
      },
      ...(options.extraNode ? [options.extraNode] : []),
    ],
  } as unknown as BuilderCanvasDocument;
}

function homeCompositeDocument(
  options: { config?: Record<string, unknown>; decomposed?: boolean } = {},
): BuilderCanvasDocument {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-06-29T00:00:00.000Z',
    updatedBy: 'home-seed-v11',
    stageWidth: 1280,
    stageHeight: 1200,
    nodes: [
      {
        id: options.decomposed ? 'home-hero-root' : 'home-hero',
        kind: options.decomposed ? 'section' : 'composite',
        content: options.decomposed
          ? { tagName: 'section' }
          : { componentKey: 'hero-search', config: options.config ?? { locale: 'ko' } },
      },
      {
        id: 'home-insights',
        kind: 'composite',
        content: { componentKey: 'insights-archive', config: { locale: 'ko' } },
      },
    ],
  } as unknown as BuilderCanvasDocument;
}

describe('shouldAutoDecomposeStandardPageDraft', () => {
  it('detects a default non-home standard-page live composite draft', () => {
    expect(shouldAutoDecomposeStandardPageDraft(standardCompositeDocument('about'), 'about')).toBe(true);
  });

  it('does not auto-decompose home, FAQ, custom pages, or mismatched composite keys', () => {
    expect(shouldAutoDecomposeStandardPageDraft(standardCompositeDocument('home'), '')).toBe(false);
    expect(shouldAutoDecomposeStandardPageDraft(standardCompositeDocument('faq'), 'faq')).toBe(false);
    expect(shouldAutoDecomposeStandardPageDraft(standardCompositeDocument('columns'), 'columns')).toBe(false);
    expect(
      shouldAutoDecomposeStandardPageDraft(
        standardCompositeDocument('about', { componentKey: 'legacy-page-services' }),
        'about',
      ),
    ).toBe(false);
  });

  it('leaves already decomposed or customized composite drafts untouched', () => {
    expect(
      shouldAutoDecomposeStandardPageDraft(
        standardCompositeDocument('about', { extraNode: { id: 'about-headline', kind: 'heading' } }),
        'about',
      ),
    ).toBe(false);
    expect(
      shouldAutoDecomposeStandardPageDraft(
        standardCompositeDocument('about', {
          config: { locale: 'ko', overrides: { headline: 'Custom headline' } },
        }),
        'about',
      ),
    ).toBe(false);
  });
});

describe('shouldOfferDecomposeCurrentPage', () => {
  it('offers explicit decompose for pristine home and standard live-mirror pages', () => {
    expect(shouldOfferDecomposeCurrentPage(homeCompositeDocument(), '')).toBe(true);
    expect(shouldOfferDecomposeCurrentPage(standardCompositeDocument('about'), 'about')).toBe(true);
    expect(shouldOfferDecomposeCurrentPage(standardCompositeDocument('faq'), 'faq')).toBe(true);
  });

  it('does not offer decompose for decomposed, customized, or unsupported pages', () => {
    expect(shouldOfferDecomposeCurrentPage(homeCompositeDocument({ decomposed: true }), '')).toBe(false);
    expect(
      shouldOfferDecomposeCurrentPage(
        homeCompositeDocument({ config: { locale: 'ko', overrides: { headline: 'Custom headline' } } }),
        '',
      ),
    ).toBe(false);
    expect(shouldOfferDecomposeCurrentPage(standardCompositeDocument('columns'), 'columns')).toBe(false);
  });
});

describe('areDraftDocumentsEquivalentForStaleRevision', () => {
  it('ignores document-level updatedBy marker normalization for same-content stale saves', () => {
    const current = standardCompositeDocument('about', {
      componentKey: 'legacy-page-about',
    });
    const sameContentWithSanitizedMarker = {
      ...current,
      updatedBy: 'home-seed-v11+insights-source+hero-responsive-parity'.slice(0, 36),
    };

    expect(areDraftDocumentsEquivalentForStaleRevision(current, sameContentWithSanitizedMarker)).toBe(true);
  });

  it('keeps true content differences as conflicts', () => {
    const current = standardCompositeDocument('about');
    const changed = {
      ...current,
      nodes: [
        ...current.nodes,
        { id: 'about-extra-copy', kind: 'text' },
      ],
    } as BuilderCanvasDocument;

    expect(areDraftDocumentsEquivalentForStaleRevision(current, changed)).toBe(false);
  });
});

describe('shouldKeepInitialDocumentForInitialDraftLoad', () => {
  it('keeps the SSR-migrated initial document when the initial draft fetch returns the same revision raw document', () => {
    const fetchedDocument = homeCompositeDocument({ decomposed: true });
    const initialDocument = {
      ...fetchedDocument,
      updatedAt: '2026-07-02T00:00:00.000Z',
      nodes: [
        {
          ...fetchedDocument.nodes[0],
          rect: { x: 0, y: 0, width: 1280, height: 820 },
        },
        ...fetchedDocument.nodes.slice(1),
      ],
    } as BuilderCanvasDocument;
    const draft = {
      revision: 7,
      savedAt: '2026-07-02T00:01:00.000Z',
      updatedBy: 'admin',
    };

    expect(shouldKeepInitialDocumentForInitialDraftLoad({
      activePageId: 'page-home',
      fetchedDocument,
      fetchedDraft: draft,
      initialDocument,
      initialDraft: draft,
      initialPageId: 'page-home',
    })).toBe(true);
  });

  it('loads the fetched draft when a newer revision arrives after SSR', () => {
    const initialDocument = homeCompositeDocument({ decomposed: true });
    const fetchedDocument = {
      ...initialDocument,
      updatedAt: '2026-07-02T00:02:00.000Z',
      nodes: [
        ...initialDocument.nodes,
        { id: 'new-editor-node', kind: 'text' },
      ],
    } as BuilderCanvasDocument;

    expect(shouldKeepInitialDocumentForInitialDraftLoad({
      activePageId: 'page-home',
      fetchedDocument,
      fetchedDraft: { revision: 8, savedAt: '2026-07-02T00:02:00.000Z' },
      initialDocument,
      initialDraft: { revision: 7, savedAt: '2026-07-02T00:01:00.000Z' },
      initialPageId: 'page-home',
    })).toBe(false);
  });
});

describe('resolveMissingExpectedRevisionDraftSave', () => {
  it('accepts a missing-revision retry only when the latest draft already matches the save payload', () => {
    const current = standardCompositeDocument('about');
    const draft = {
      revision: 12,
      savedAt: '2026-07-02T00:00:00.000Z',
    };

    expect(resolveMissingExpectedRevisionDraftSave({ draft, document: current }, current)).toEqual({
      status: 'accept-saved',
      draft,
      document: current,
    });
  });

  it('turns a missing-revision retry into a conflict when the latest draft diverged', () => {
    const current = standardCompositeDocument('about');
    const localSave = {
      ...current,
      nodes: [
        ...current.nodes,
        { id: 'about-local-copy', kind: 'text' },
      ],
    } as BuilderCanvasDocument;
    const draft = {
      revision: 13,
      savedAt: '2026-07-02T00:01:00.000Z',
    };

    expect(resolveMissingExpectedRevisionDraftSave({ draft, document: current }, localSave)).toEqual({
      status: 'conflict',
      draft,
    });
  });
});
