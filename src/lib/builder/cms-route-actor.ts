import {
  builderCmsPermissionActors,
  type BuilderCmsPermissionActor,
} from '@/lib/builder/cms-types';
import type { GuardResult } from '@/lib/builder/security/guard';

export const CMS_ACTOR_HEADER = 'x-builder-cms-actor';

export interface BuilderCmsRouteActor {
  actor: BuilderCmsPermissionActor;
  actorLabel: string;
  source: 'authenticated-admin' | 'preview-header';
}

export function resolveBuilderCmsRouteActor(
  auth: Pick<GuardResult, 'username'>,
  request: { headers: Headers },
): BuilderCmsRouteActor {
  const requestedActor = normalizeCmsRouteActor(request.headers.get(CMS_ACTOR_HEADER));
  const username = auth.username.trim() || 'admin';
  if (!requestedActor || requestedActor === 'admin') {
    return {
      actor: 'admin',
      actorLabel: username,
      source: 'authenticated-admin',
    };
  }
  return {
    actor: requestedActor,
    actorLabel: `${username} as ${requestedActor}`,
    source: 'preview-header',
  };
}

export function normalizeCmsRouteActor(input: unknown): BuilderCmsPermissionActor | null {
  if (typeof input !== 'string') return null;
  const actor = input.trim();
  return builderCmsPermissionActors.includes(actor as BuilderCmsPermissionActor)
    ? actor as BuilderCmsPermissionActor
    : null;
}
