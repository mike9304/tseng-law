import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { BuilderCollectionSummary } from '@/lib/builder/cms';
import type { BuilderPageDatasetOverview } from '@/lib/builder/datasets';
import type {
  BuilderPageDocument,
  BuilderPageSnapshot,
  BuilderPageState,
} from '@/lib/builder/types';
import {
  getBuilderSiteSummary,
  getBuilderWorkspaceSummary,
  type BuilderPageSnapshotOverview,
  type BuilderPageSnapshotSummary,
  type BuilderSitePageSummary,
} from '@/lib/builder/site';
import BuilderPageDatasetsPage from '../page';

const mocks = vi.hoisted(() => ({
  getAllColumnPostsIncludingBlob: vi.fn(),
  readBuilderCollectionSummaries: vi.fn(),
  readBuilderPageDatasetOverviews: vi.fn(),
  readBuilderPageSnapshotOverview: vi.fn(),
  readBuilderSiteOverview: vi.fn(),
  readPreferredBuilderPreviewSnapshot: vi.fn(),
  readSiteDocument: vi.fn(),
}));

vi.mock('@/components/builder/datasets/BuilderDatasetBindingEditor', () => ({
  default: ({
    initialRevision,
    initialTargets,
  }: {
    readonly initialRevision: number;
    readonly initialTargets: readonly BuilderPageDatasetOverview[];
  }) => {
    const firstTarget = initialTargets[0];
    return createElement('div', {
      'data-testid': 'dataset-editor-props',
      'data-initial-revision': initialRevision,
      'data-first-limit': firstTarget?.currentBinding.limit ?? '',
    });
  },
}));

vi.mock('@/lib/consultation/columns-blob-reader', () => ({
  getAllColumnPostsIncludingBlob: mocks.getAllColumnPostsIncludingBlob,
}));

vi.mock('@/lib/builder/cms', () => ({
  readBuilderCollectionSummaries: mocks.readBuilderCollectionSummaries,
}));

vi.mock('@/lib/builder/cms-collection-datasets', () => ({
  listCmsCollectionBindableTargets: () => [],
}));

vi.mock('@/lib/builder/datasets', () => ({
  readBuilderPageDatasetOverviews: mocks.readBuilderPageDatasetOverviews,
}));

vi.mock('@/lib/builder/site', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/site')>();
  return {
    ...actual,
    readBuilderPageSnapshotOverview: mocks.readBuilderPageSnapshotOverview,
    readBuilderSiteOverview: mocks.readBuilderSiteOverview,
    readPreferredBuilderPreviewSnapshot: mocks.readPreferredBuilderPreviewSnapshot,
  };
});

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: mocks.readSiteDocument,
}));

function makeDatasetBinding(limit: number): BuilderPageDocument['datasets'][number] {
  return {
    version: 1,
    datasetId: `dataset-${limit}`,
    targetId: 'home.services.list',
    sectionKey: 'home.services',
    collectionId: 'service-areas',
    mode: 'list',
    limit,
  };
}

function makeDocument(limit: number): BuilderPageDocument {
  return {
    version: 1,
    pageKey: 'home',
    locale: 'ko',
    root: {
      id: 'page-root',
      type: 'page',
      name: 'Home',
      pageKey: 'home',
      children: [],
    },
    datasets: [makeDatasetBinding(limit)],
    updatedAt: '2026-07-04T00:00:00.000Z',
    updatedBy: 'page-test',
  };
}

function makeState(): BuilderPageState {
  return {
    version: 1,
    faqItems: [],
    serviceItems: [],
    overrides: {},
    activeCollectionIndex: {},
  };
}

function makeSnapshot(kind: 'draft' | 'published', revision: number, document: BuilderPageDocument): BuilderPageSnapshot {
  return {
    version: 1,
    kind,
    pageKey: 'home',
    locale: 'ko',
    revision,
    savedAt: `2026-07-04T00:0${revision}:00.000Z`,
    updatedBy: 'page-test',
    document,
    state: makeState(),
  };
}

function makePageSummary(): BuilderSitePageSummary {
  return {
    pageId: 'tseng-law-main-site:home',
    pageKey: 'home',
    pageType: 'static',
    routeType: 'static',
    routeSegment: '',
    parentPageKey: null,
    specialRole: 'homepage',
    title: 'Home',
    description: 'Home page',
    editable: true,
    availableModes: ['edit', 'preview'],
    publicPath: '/ko',
    builderPath: '/ko/builder/home',
    draftPersisted: true,
    publishedPersisted: true,
    draftRevision: 3,
    publishedRevision: 7,
    draftSavedAt: '2026-07-04T00:03:00.000Z',
    publishedSavedAt: '2026-07-04T00:07:00.000Z',
    sectionCount: 0,
    datasetCount: 1,
  };
}

function makeSnapshotSummary(snapshot: BuilderPageSnapshot, persisted: boolean): BuilderPageSnapshotSummary {
  return {
    kind: snapshot.kind,
    persisted,
    revision: snapshot.revision,
    savedAt: persisted ? snapshot.savedAt : null,
    updatedBy: persisted ? snapshot.updatedBy : null,
    snapshot,
  };
}

function makeSiteOverview() {
  return {
    site: {
      id: 'tseng-law-main-site',
    },
  };
}

function makePageOverview(draftSnapshot: BuilderPageSnapshot, publishedSnapshot: BuilderPageSnapshot): BuilderPageSnapshotOverview {
  const workspace = getBuilderWorkspaceSummary();
  const site = getBuilderSiteSummary('ko');
  const draft = makeSnapshotSummary(draftSnapshot, true);
  const published = makeSnapshotSummary(publishedSnapshot, true);

  return {
    workspace,
    site,
    page: makePageSummary(),
    draft,
    published,
    preferred: {
      source: 'draft',
      snapshot: draft,
    },
  };
}

function makeDatasetOverview(document: BuilderPageDocument): BuilderPageDatasetOverview[] {
  const binding = document.datasets[0];
  if (!binding) throw new Error('dataset_binding_missing');

  return [
    {
      targetId: binding.targetId,
      pageKey: 'home',
      sectionKey: binding.sectionKey,
      title: 'Services list',
      description: 'Services list dataset',
      collectionIds: ['service-areas'],
      defaultCollectionId: 'service-areas',
      modeOptions: ['list'],
      defaultLimit: 6,
      limitOptions: [3, 4, 6, 9],
      filterFields: [],
      sortFields: [],
      currentBinding: binding,
      sampleRecords: [],
      repeaterItems: [],
      notes: [],
    },
  ];
}

describe('BuilderPageDatasetsPage', () => {
  it('initializes the dataset editor from the draft snapshot contract', async () => {
    const draftDocument = makeDocument(4);
    const publishedDocument = makeDocument(9);
    const draftSnapshot = makeSnapshot('draft', 3, draftDocument);
    const publishedSnapshot = makeSnapshot('published', 7, publishedDocument);
    const collections: BuilderCollectionSummary[] = [];

    mocks.readBuilderCollectionSummaries.mockReturnValue(collections);
    mocks.readBuilderSiteOverview.mockResolvedValue(makeSiteOverview());
    mocks.readBuilderPageSnapshotOverview.mockResolvedValue(makePageOverview(draftSnapshot, publishedSnapshot));
    mocks.readPreferredBuilderPreviewSnapshot.mockResolvedValue({
      backend: 'file',
      persisted: true,
      snapshot: publishedSnapshot,
    });
    mocks.getAllColumnPostsIncludingBlob.mockResolvedValue([]);
    mocks.readSiteDocument.mockResolvedValue({ cmsCollections: [] });
    mocks.readBuilderPageDatasetOverviews.mockImplementation((pageKey, document) => {
      if (pageKey !== 'home') throw new Error('unexpected_page_key');
      return makeDatasetOverview(document);
    });

    const element = await BuilderPageDatasetsPage({
      params: { locale: 'ko', pageKey: 'home' },
      searchParams: { targetId: 'home.services.list' },
    });
    const markup = renderToStaticMarkup(element);

    expect(markup).toContain('data-initial-revision="3"');
    expect(markup).toContain('data-first-limit="4"');
    expect(mocks.readBuilderPageDatasetOverviews).toHaveBeenCalledWith(
      'home',
      draftDocument,
      'ko',
      [],
      { cmsCollections: [] },
    );
  });
});
