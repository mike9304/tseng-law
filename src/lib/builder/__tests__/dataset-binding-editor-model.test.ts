import { describe, expect, it } from 'vitest';
import type { ColumnPost } from '@/lib/columns';
import { createDefaultBuilderPageDatasets, readBuilderPageDatasetOverviews } from '@/lib/builder/datasets';
import {
  buildDatasetBindingDefaultState,
  buildDatasetBindingEditorState,
} from '@/lib/builder/dataset-binding-editor-model';

const posts: ColumnPost[] = [];

describe('dataset binding editor model', () => {
  it('builds an editor state from the current binding and default schema hints', () => {
    const document = {
      pageKey: 'home' as const,
      datasets: createDefaultBuilderPageDatasets('home'),
    };
    const overviews = readBuilderPageDatasetOverviews('home', document, 'ko', posts);
    const servicesOverview = overviews.find((overview) => overview.targetId === 'home.services.list');
    expect(servicesOverview).toBeTruthy();
    if (!servicesOverview) return;

    const currentState = buildDatasetBindingEditorState(servicesOverview);
    const defaultState = buildDatasetBindingDefaultState(servicesOverview);

    expect(currentState).toMatchObject({
      collectionId: 'service-areas',
      mode: 'list',
      limit: 6,
      filters: [],
      sort: [],
    });
    expect(defaultState).toMatchObject({
      collectionId: 'service-areas',
      mode: 'list',
      limit: 6,
      filters: [],
      sort: [],
    });
  });
});
