/**
 * F99 — Per-user role store for builder RBAC.
 *
 * Sits on top of the existing single-admin basic auth: when an admin
 * authenticates, we look up the authenticated username in this store to
 * find their granular role. Missing records fall back to the implicit
 * `owner` (legacy behavior) so existing deployments keep working.
 *
 * Storage: runtime-data/security/user-roles.json, mediated by a
 * module-level write queue identical to `workspace-store.ts`.
 */

import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { getConfiguredBasicAuthUsernames } from '@/lib/builder/security/basic-auth-users';

export const BUILDER_ROLE_NAMES = [
  'owner',
  'admin',
  'designer',
  'editor',
  'client',
] as const;

export type BuilderRoleName = (typeof BUILDER_ROLE_NAMES)[number];

export interface BuilderUserRoleRecord {
  username: string;
  role: BuilderRoleName;
  addedAt: string;
  addedBy: string;
  lastSeenAt?: string;
}

interface UserRoleDocument {
  users: BuilderUserRoleRecord[];
}

const FILE_NAME = 'user-roles.json';
const SEED_ADDED_BY = 'system';

let storageRoot: string | null = null;
let writeQueue: Promise<void> = Promise.resolve();
let seeded = false;

function defaultStorageRoot(): string {
  return path.join(process.cwd(), 'runtime-data', 'security');
}

function root(): string {
  return storageRoot ?? defaultStorageRoot();
}

function filePath(): string {
  return path.join(root(), FILE_NAME);
}

export function __setUserRoleStorageRootForTests(value: string): void {
  storageRoot = value;
  seeded = false;
}

export function __resetUserRoleStorageRootForTests(): void {
  storageRoot = null;
  seeded = false;
}

function nowIso(): string {
  return new Date().toISOString();
}

function isBuilderRoleName(value: unknown): value is BuilderRoleName {
  return typeof value === 'string'
    && (BUILDER_ROLE_NAMES as readonly string[]).includes(value);
}

export function normalizeUsername(input: string | null | undefined): string {
  return (input ?? '').trim();
}

function normalizeRecord(raw: unknown, fallbackAt: string): BuilderUserRoleRecord | null {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Partial<BuilderUserRoleRecord>;
  const username = normalizeUsername(record.username);
  if (!username) return null;
  const role: BuilderRoleName = isBuilderRoleName(record.role) ? record.role : 'editor';
  return {
    username,
    role,
    addedAt: typeof record.addedAt === 'string' ? record.addedAt : fallbackAt,
    addedBy: typeof record.addedBy === 'string' && record.addedBy.trim()
      ? record.addedBy.trim()
      : SEED_ADDED_BY,
    lastSeenAt: typeof record.lastSeenAt === 'string' ? record.lastSeenAt : undefined,
  };
}

function normalizeDocument(raw: unknown, fallbackAt: string): UserRoleDocument {
  if (!raw || typeof raw !== 'object') return { users: [] };
  const candidate = raw as Partial<UserRoleDocument>;
  const list = Array.isArray(candidate.users) ? candidate.users : [];
  const users: BuilderUserRoleRecord[] = [];
  const seen = new Set<string>();
  for (const entry of list) {
    const record = normalizeRecord(entry, fallbackAt);
    if (!record) continue;
    const key = record.username.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    users.push(record);
  }
  return { users };
}

function isNotFoundError(error: unknown): boolean {
  return Boolean(
    error
      && typeof error === 'object'
      && (error as { code?: unknown }).code === 'ENOENT',
  );
}

async function loadDocument(): Promise<UserRoleDocument> {
  try {
    const raw = await readFile(filePath(), 'utf8');
    return normalizeDocument(JSON.parse(raw), nowIso());
  } catch (error) {
    if (isNotFoundError(error)) return { users: [] };
    throw error;
  }
}

async function persistDocument(doc: UserRoleDocument): Promise<void> {
  await mkdir(root(), { recursive: true, mode: 0o700 });
  await writeFile(filePath(), JSON.stringify(doc, null, 2), { mode: 0o600 });
}

async function withWriteLock<T>(task: () => Promise<T>): Promise<T> {
  const previous = writeQueue;
  let release!: () => void;
  writeQueue = new Promise<void>((resolve) => {
    release = resolve;
  });
  await previous.catch(() => undefined);
  try {
    return await task();
  } finally {
    release();
  }
}

function configuredOwnerUsername(): string {
  const basicAuthOwner = getConfiguredBasicAuthUsernames()[0];
  for (const candidate of [
    process.env.BUILDER_USERNAME,
    process.env.CMS_ADMIN_USERNAME,
    basicAuthOwner,
    'admin',
  ]) {
    const username = normalizeUsername(candidate);
    if (username) return username;
  }
  return '';
}

function warnOwnerSeedPersistSkipped(error: unknown): void {
  if (error instanceof Error) {
    console.warn('[user-role-store] owner seed persist skipped (read-only fs?):', error);
    return;
  }
  console.warn('[user-role-store] owner seed persist skipped (read-only fs?):', error);
}

async function ensureSeed(): Promise<void> {
  if (seeded) return;
  await withWriteLock(async () => {
    const doc = await loadDocument();
    const ownerUsername = configuredOwnerUsername();
    if (!ownerUsername) {
      seeded = true;
      return;
    }
    const existing = doc.users.find(
      (entry) => entry.username.toLowerCase() === ownerUsername.toLowerCase(),
    );
    if (existing) {
      seeded = true;
      return;
    }
    const fresh: BuilderUserRoleRecord = {
      username: ownerUsername,
      role: 'owner',
      addedAt: nowIso(),
      addedBy: SEED_ADDED_BY,
    };
    try {
      await persistDocument({ users: [...doc.users, fresh] });
    } catch (error) {
      warnOwnerSeedPersistSkipped(error);
    }
    seeded = true;
  });
}

export async function listUserRoles(): Promise<BuilderUserRoleRecord[]> {
  await ensureSeed();
  const doc = await loadDocument();
  return [...doc.users].sort((a, b) => a.addedAt.localeCompare(b.addedAt));
}

export async function getUserRole(username: string): Promise<BuilderUserRoleRecord | null> {
  const target = normalizeUsername(username);
  if (!target) return null;
  await ensureSeed();
  const doc = await loadDocument();
  return doc.users.find(
    (entry) => entry.username.toLowerCase() === target.toLowerCase(),
  ) ?? null;
}

export interface UpsertUserRoleInput {
  username: string;
  role: BuilderRoleName;
  addedBy: string;
}

export async function upsertUserRole(
  input: UpsertUserRoleInput,
): Promise<BuilderUserRoleRecord> {
  const username = normalizeUsername(input.username);
  if (!username) throw new Error('username is required.');
  if (!isBuilderRoleName(input.role)) throw new Error(`Invalid role: ${String(input.role)}`);
  const addedBy = normalizeUsername(input.addedBy) || SEED_ADDED_BY;
  await ensureSeed();
  return withWriteLock(async () => {
    const doc = await loadDocument();
    const index = doc.users.findIndex(
      (entry) => entry.username.toLowerCase() === username.toLowerCase(),
    );
    if (index === -1) {
      const record: BuilderUserRoleRecord = {
        username,
        role: input.role,
        addedAt: nowIso(),
        addedBy,
      };
      await persistDocument({ users: [...doc.users, record] });
      return record;
    }
    const current = doc.users[index];
    if (current.role === 'owner' && input.role !== 'owner') {
      const ownerCount = doc.users.filter((entry) => entry.role === 'owner').length;
      if (ownerCount <= 1) throw new Error('Cannot demote the only owner.');
    }
    const updated: BuilderUserRoleRecord = {
      ...current,
      role: input.role,
      addedBy,
    };
    const users = [...doc.users];
    users[index] = updated;
    await persistDocument({ users });
    return updated;
  });
}

export async function removeUserRole(username: string): Promise<boolean> {
  const target = normalizeUsername(username);
  if (!target) return false;
  await ensureSeed();
  return withWriteLock(async () => {
    const doc = await loadDocument();
    const record = doc.users.find(
      (entry) => entry.username.toLowerCase() === target.toLowerCase(),
    );
    if (!record) return false;
    if (record.role === 'owner') {
      const ownerCount = doc.users.filter((entry) => entry.role === 'owner').length;
      if (ownerCount <= 1) throw new Error('Cannot remove the only owner.');
    }
    const users = doc.users.filter(
      (entry) => entry.username.toLowerCase() !== target.toLowerCase(),
    );
    await persistDocument({ users });
    return true;
  });
}

export async function recordUserSeen(username: string): Promise<void> {
  const target = normalizeUsername(username);
  if (!target) return;
  await ensureSeed();
  await withWriteLock(async () => {
    const doc = await loadDocument();
    const index = doc.users.findIndex(
      (entry) => entry.username.toLowerCase() === target.toLowerCase(),
    );
    if (index === -1) return;
    const users = [...doc.users];
    users[index] = { ...users[index], lastSeenAt: nowIso() };
    await persistDocument({ users });
  });
}

export function isBuilderRoleNameValue(value: unknown): value is BuilderRoleName {
  return isBuilderRoleName(value);
}
