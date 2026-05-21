/**
 * F104 — Unified builder notification model.
 *
 * All cross-feature notifications (comments, approval state, ecommerce
 * orders, bookings, app installs, publish events) flow through a single
 * inbox under runtime-data/notifications/inbox.json. The kind field
 * preserves origin for UI filtering.
 */

export type BuilderNotificationKind =
  | 'comment'
  | 'approval'
  | 'order'
  | 'booking'
  | 'app-install'
  | 'publish';

export interface BuilderNotificationAudience {
  email?: string;
  role?: 'owner' | 'editor' | 'reviewer' | 'viewer';
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