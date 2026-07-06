import { describe, expect, it } from 'vitest';
import {
  readBuilderCollectionDetail,
  readBuilderCollectionSummaries,
} from '@/lib/builder/cms';

describe('builder cms collection summaries', () => {
  it('exposes bindable targets for live source collections', () => {
    const summaries = readBuilderCollectionSummaries('ko');
    const columns = summaries.find((summary) => summary.id === 'columns');
    const services = summaries.find((summary) => summary.id === 'service-areas');
    const attorneys = summaries.find((summary) => summary.id === 'attorney-profiles');

    expect(columns?.bindableTargets.map((target) => target.targetId)).toEqual(['home.insights.feed']);
    expect(services?.bindableTargets.map((target) => target.targetId)).toEqual(['home.services.list']);
    expect(attorneys?.bindableTargets.map((target) => target.targetId)).toEqual(['home.attorney.profile']);
  });

  it('keeps bindable targets on the detail view with sample records', () => {
    const detail = readBuilderCollectionDetail('columns', 'ko');
    expect(detail.bindableTargets[0]).toMatchObject({
      targetId: 'home.insights.feed',
      pageKey: 'home',
      sectionKey: 'home.insights',
    });
    expect(detail.sampleRecords.length).toBeGreaterThan(0);
  });
});
