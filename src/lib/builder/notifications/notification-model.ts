/**
 * F104 — Unified builder notification model.
 *
 * All cross-feature notifications (comments, approval state, ecommerce
 * orders, bookings, app installs, publish events) flow through a single
 * inbox under runtime-data/notifications/inbox.json. The kind field
 * preserves origin for UI filtering.
 */

import type { BuilderRoleName } from '@/lib/builder/security/user-role-store';

export type BuilderNotificationKind =
  | 'comment'
  | 'approval'
  | 'order'
  | 'booking'
  | 'app-install'
  | 'publish';

export interface BuilderNotificationAudience {
  email?: string;
  /**
   * Current builder roles are stored verbatim. The legacy collaboration
   * roles remain readable for existing inbox documents, but are never
   * implicitly promoted to a current role.
   */
  role?: BuilderRoleName | 'reviewer' | 'viewer';
}

export interface BuilderNotificationAudienceScope {
  principal: string;
  role: BuilderRoleName;
}

export interface BuilderNotification {
  id: string;
  kind: BuilderNotificationKind;
  subject: string;
  body: string;
  audience: BuilderNotificationAudience;
  createdAt: string;
  readAt?: string;
  /** Optional deep-link path inside the admin builder. */
  link?: string;
}

export interface BuilderNotificationInboxFile {
  version: 1;
  updatedAt: string;
  notifications: BuilderNotification[];
}

export function emptyInbox(): BuilderNotificationInboxFile {
  return { version: 1, updatedAt: new Date(0).toISOString(), notifications: [] };
}

export class NotificationAudienceForbiddenError extends Error {
  constructor() {
    super('notification_audience_forbidden');
    this.name = 'NotificationAudienceForbiddenError';
  }
}
