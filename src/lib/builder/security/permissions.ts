/**
 * PR #6 — Granular permission enum for builder mutation routes.
 *
 * The collab engine (collab-engine.ts) already exposes coarse role strings
 * like 'edit' or 'publish' on the activity/audit surface. This module
 * introduces a finer-grained permission set that maps onto the route map
 * in CODEX-GOAL-WIX-PARITY-COMPLETE.md §4.6 and feeds into guardMutation's
 * permission gate.
 */

import { ROLE_PERMISSIONS as COARSE_PERMISSIONS, type UserRole } from '@/lib/builder/collab/collab-engine';

export const BUILDER_PERMISSIONS = [
  'edit-pages',
  'publish',
  'delete-pages',
  'edit-blog',
  'manage-forms',
  'edit-seo',
  'manage-campaigns',
  'view-campaigns',
  'manage-subscribers',
  'manage-cases',
  'view-cases',
  'manage-contacts',
  'view-contacts',
  'manage-bookings',
  'view-bookings',
  'manage-users',
  'manage-search',
  'settings',
] as const;

export type BuilderPermission = (typeof BUILDER_PERMISSIONS)[number];

/**
 * Mapping from granular permission → coarse legacy permission set.
 *
 * `hasBuilderPermission(role, perm)` consults this table so we don't have to
 * rewrite ROLE_PERMISSIONS or every existing role check at once. Owner can
 * do everything; editor can edit but cannot manage users; reviewer/viewer
 * are read-mostly.
 */
const GRANULAR_TO_COARSE: Record<BuilderPermission, string> = {
  'edit-pages': 'edit',
  publish: 'publish',
  'delete-pages': 'delete',
  'edit-blog': 'edit',
  'manage-forms': 'edit',
  'edit-seo': 'edit',
  'manage-campaigns': 'edit',
  'view-campaigns': 'comment',
  'manage-subscribers': 'edit',
  'manage-cases': 'edit',
  'view-cases': 'comment',
  'manage-contacts': 'edit',
  'view-contacts': 'comment',
  'manage-bookings': 'edit',
  'view-bookings': 'comment',
  'manage-users': 'manage-users',
  'manage-search': 'edit',
  settings: 'settings',
};

export function hasBuilderPermission(role: UserRole, permission: BuilderPermission): boolean {
  const coarse = GRANULAR_TO_COARSE[permission];
  const allowed = COARSE_PERMISSIONS[role] ?? [];
  return allowed.includes(coarse);
}

export function isBuilderPermission(value: unknown): value is BuilderPermission {
  return typeof value === 'string' && (BUILDER_PERMISSIONS as readonly string[]).includes(value);
}
