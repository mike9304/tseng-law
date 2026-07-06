import { describe, expect, it } from 'vitest';
import {
  getBuilderCmsPublishCandidateRecordIds,
  summarizeBuilderCmsPublishReadiness,
} from '@/lib/builder/cms-publish-readiness';

describe('cms publish readiness', () => {
  it('summarizes record status counts and publishable candidates', () => {
    const summary = summarizeBuilderCmsPublishReadiness([
      { status: 'published' },
      { status: 'draft' },
      { status: 'pending' },
      { status: 'approved' },
      { status: 'rejected' },
      { status: 'archived' },
      { status: 'draft' },
    ]);

    expect(summary).toMatchObject({
      total: 7,
      published: 1,
      draft: 2,
      pending: 1,
      approved: 1,
      rejected: 1,
      archived: 1,
      publishable: 5,
    });
  });

  it('selects only unpublished candidate record ids', () => {
    expect(
      getBuilderCmsPublishCandidateRecordIds([
        { recordId: 'r1', status: 'draft' },
        { recordId: 'r2', status: 'published' },
        { recordId: 'r3', status: 'archived' },
        { recordId: 'r4', status: 'pending' },
      ]),
    ).toEqual(['r1', 'r4']);
  });

  it('can limit publishable candidate ids to a filtered record set', () => {
    expect(
      getBuilderCmsPublishCandidateRecordIds([
        { recordId: 'r1', status: 'draft' },
        { recordId: 'r2', status: 'published' },
        { recordId: 'r3', status: 'pending' },
        { recordId: 'r4', status: 'approved' },
      ], {
        recordIds: ['r1', 'r4'],
      }),
    ).toEqual(['r1', 'r4']);
  });
});
