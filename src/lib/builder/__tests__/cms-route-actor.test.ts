import { describe, expect, it } from 'vitest';
import {
  CMS_ACTOR_HEADER,
  normalizeCmsRouteActor,
  resolveBuilderCmsRouteActor,
} from '@/lib/builder/cms-route-actor';

describe('builder CMS route actor', () => {
  it('defaults authenticated requests to admin', () => {
    expect(resolveBuilderCmsRouteActor(
      { username: 'admin' },
      { headers: new Headers() },
    )).toEqual({
      actor: 'admin',
      actorLabel: 'admin',
      source: 'authenticated-admin',
    });
  });

  it('uses the preview actor header for permission-gated CMS record routes', () => {
    const headers = new Headers({ [CMS_ACTOR_HEADER]: 'staff' });
    expect(resolveBuilderCmsRouteActor(
      { username: 'admin' },
      { headers },
    )).toEqual({
      actor: 'staff',
      actorLabel: 'admin as staff',
      source: 'preview-header',
    });
  });

  it('ignores unsupported actor headers', () => {
    expect(normalizeCmsRouteActor('owner')).toBeNull();
    expect(resolveBuilderCmsRouteActor(
      { username: 'admin' },
      { headers: new Headers({ [CMS_ACTOR_HEADER]: 'owner' }) },
    ).actor).toBe('admin');
  });
});
