/**
 * Workspace persistence — file-only v1.
 *
 * Stores a single JSON document at `runtime-data/workspace/account.json`
 * describing the singleton account, known sites, and members. Writes are
 * serialized through a module-level promise queue (mirrors `siteWriteQueue`
 * in `site/persistence.ts`) so concurrent admin actions cannot tear the
 * roster.
 *
 * TODO: Blob backend parity once a real multi-tenant workspace ships.
 */

import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import {
  DEFAULT_BUILDER_SITE_ID,
  DEFAULT_BUILDER_WORKSPACE_ID,
} from '@/lib/builder/constants';
import { normalizeBuilderSiteId } from '@/lib/builder/site/identity';
import {
  type BuilderAccount,
  type BuilderWorkspaceDocument,
  type BuilderWorkspaceMember,
  type BuilderWorkspaceRole,
  type BuilderWorkspaceSite,
  isBuilderWorkspaceRole,
  normalizeWorkspaceEmail,
} from './account-model';

const DEFAULT_ACCOUNT_NAME = '호정국제 워크스페이스';
const DEFAULT_ACCOUNT_OWNER_EMAIL = 'admin@hojeong.local';
const ACCOUNT_FILE = 'account.json';

let workspaceStorageRoot: string | null = null;
let writeQueue: Promise<void> = Promise.resolve();

function defaultStorageRoot(): string {
  return path.join(process.cwd(), 'runtime-data', 'workspace');
}

function storageRoot(): string {
  return workspaceStorageRoot ?? defaultStorageRoot();
}

function accountFilePath(): string {
  return path.join(storageRoot(), ACCOUNT_FILE);
}

/**
 * Test seam: pin the workspace storage to a temp directory so unit tests
 * don't write to the developer's local `runtime-data/`.
 */
export function __setWorkspaceStorageRootForTests(root: string): void {
  workspaceStorageRoot = root;
}

export function __resetWorkspaceStorageRootForTests(): void {
  workspaceStorageRoot = null;
}

function nowIso(): string {
  return new Date().toISOString();
}

function createDefaultAccount(): BuilderAccount {
  const now = nowIso();
  return {
    id: DEFAULT_BUILDER_WORKSPACE_ID,
    name: DEFAULT_ACCOUNT_NAME,
    ownerEmail: DEFAULT_ACCOUNT_OWNER_EMAIL,
    createdAt: now,
    updatedAt: now,
  };
}

function createDefaultDocument(): BuilderWorkspaceDocument {
  const account = createDefaultAccount();
  return {
    account,
    sites: [
      {
        siteId: DEFAULT_BUILDER_SITE_ID,
        name: 'Tseng Law — Main Site',
        accountId: account.id,
        role: 'owner',
        createdAt: account.createdAt,
      },
    ],
    members: [
      {
        email: account.ownerEmail,
        accountId: account.id,
        role: 'owner',
        addedAt: account.createdAt,
      },
    ],
  };
}

function normalizeRole(value: unknown, fallback: BuilderWorkspaceRole): BuilderWorkspaceRole {
  return isBuilderWorkspaceRole(value) ? value : fallback;
}

function normalizeSiteEntry(
  raw: unknown,
  accountId: string,
  createdAt: string,
): BuilderWorkspaceSite | null {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Partial<BuilderWorkspaceSite>;
  const siteId = normalizeBuilderSiteId(typeof record.siteId === 'string' ? record.siteId : '');
  if (!siteId) return null;
  return {
    siteId,
    name: typeof record.name === 'string' && record.name.trim()
      ? record.name.trim().slice(0, 120)
      : siteId,
    accountId,
    role: normalizeRole(record.role, 'editor'),
    createdAt: typeof record.createdAt === 'string' ? record.createdAt : createdAt,
  };
}

function normalizeMemberEntry(
  raw: unknown,
  accountId: string,
  addedAt: string,
): BuilderWorkspaceMember | null {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Partial<BuilderWorkspaceMember>;
  const email = normalizeWorkspaceEmail(typeof record.email === 'string' ? record.email : '');
  if (!email || !email.includes('@')) return null;
  return {
    email,
    accountId,
    role: normalizeRole(record.role, 'viewer'),
    addedAt: typeof record.addedAt === 'string' ? record.addedAt : addedAt,
  };
}

function normalizeDocument(raw: unknown): BuilderWorkspaceDocument {
  if (!raw || typeof raw !== 'object') return createDefaultDocument();
  const candidate = raw as Partial<BuilderWorkspaceDocument>;
  const fallback = createDefaultAccount();
  const accountInput = candidate.account && typeof candidate.account === 'object'
    ? candidate.account as Partial<BuilderAccount>
    : null;
  const account: BuilderAccount = {
    id: typeof accountInput?.id === 'string' && accountInput.id.trim()
      ? accountInput.id.trim()
      : fallback.id,
    name: typeof accountInput?.name === 'string' && accountInput.name.trim()
      ? accountInput.name.trim().slice(0, 120)
      : fallback.name,
    ownerEmail: normalizeWorkspaceEmail(accountInput?.ownerEmail) || fallback.ownerEmail,
    createdAt: typeof accountInput?.createdAt === 'string' ? accountInput.createdAt : fallback.createdAt,
    updatedAt: typeof accountInput?.updatedAt === 'string' ? accountInput.updatedAt : fallback.updatedAt,
  };

  const sites: BuilderWorkspaceSite[] = [];
  const seenSiteIds = new Set<string>();
  for (const rawSite of Array.isArray(candidate.sites) ? candidate.sites : []) {
    const site = normalizeSiteEntry(rawSite, account.id, account.createdAt);
    if (!site || seenSiteIds.has(site.siteId)) continue;
    seenSiteIds.add(site.siteId);
    sites.push(site);
  }

  const members: BuilderWorkspaceMember[] = [];
  const seenEmails = new Set<string>();
  for (const rawMember of Array.isArray(candidate.members) ? candidate.members : []) {
    const member = normalizeMemberEntry(rawMember, account.id, account.createdAt);
    if (!member || seenEmails.has(member.email)) continue;
    seenEmails.add(member.email);
    members.push(member);
  }

  return { account, sites, members };
}

async function loadDocument(): Promise<BuilderWorkspaceDocument | null> {
  try {
    const raw = await readFile(accountFilePath(), 'utf8');
    return normalizeDocument(JSON.parse(raw));
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
}

async function persistDocument(doc: BuilderWorkspaceDocument): Promise<void> {
  await mkdir(storageRoot(), { recursive: true, mode: 0o700 });
  await writeFile(accountFilePath(), JSON.stringify(doc, null, 2), { mode: 0o600 });
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

async function readDocument(): Promise<BuilderWorkspaceDocument> {
  const existing = await loadDocument();
  return existing ?? createDefaultDocument();
}

/**
 * Returns the current account record without mutating storage.
 */
export async function readAccount(): Promise<BuilderAccount> {
  const doc = await readDocument();
  return doc.account;
}

/**
 * Ensures a workspace document exists on disk (idempotent — only writes on
 * first call when nothing has been persisted yet).
 */
export async function ensureDefaultAccount(): Promise<BuilderAccount> {
  return withWriteLock(async () => {
    const existing = await loadDocument();
    if (existing) return existing.account;
    const fresh = createDefaultDocument();
    await persistDocument(fresh);
    return fresh.account;
  });
}

export async function updateAccountName(name: string): Promise<BuilderAccount> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Account name is required.');
  return withWriteLock(async () => {
    const doc = (await loadDocument()) ?? createDefaultDocument();
    const account: BuilderAccount = {
      ...doc.account,
      name: trimmed.slice(0, 120),
      updatedAt: nowIso(),
    };
    await persistDocument({ ...doc, account });
    return account;
  });
}

export async function listWorkspaceSites(): Promise<BuilderWorkspaceSite[]> {
  const doc = await readDocument();
  return [...doc.sites].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function addSite(input: {
  siteId: string;
  name?: string;
  role?: BuilderWorkspaceRole;
}): Promise<BuilderWorkspaceSite> {
  const siteId = normalizeBuilderSiteId(input.siteId);
  if (!siteId) throw new Error('siteId is required.');
  return withWriteLock(async () => {
    const doc = (await loadDocument()) ?? createDefaultDocument();
    const existing = doc.sites.find((site) => site.siteId === siteId);
    if (existing) return existing;
    const site: BuilderWorkspaceSite = {
      siteId,
      name: input.name?.trim().slice(0, 120) || siteId,
      accountId: doc.account.id,
      role: input.role ?? 'editor',
      createdAt: nowIso(),
    };
    const next: BuilderWorkspaceDocument = { ...doc, sites: [...doc.sites, site] };
    await persistDocument(next);
    return site;
  });
}

export async function removeSite(siteId: string): Promise<boolean> {
  const normalized = normalizeBuilderSiteId(siteId);
  return withWriteLock(async () => {
    const doc = (await loadDocument()) ?? createDefaultDocument();
    const before = doc.sites.length;
    const sites = doc.sites.filter((site) => site.siteId !== normalized);
    if (sites.length === before) return false;
    await persistDocument({ ...doc, sites });
    return true;
  });
}

export async function listMembers(): Promise<BuilderWorkspaceMember[]> {
  const doc = await readDocument();
  return [...doc.members].sort((a, b) => a.addedAt.localeCompare(b.addedAt));
}

export async function addMember(input: {
  email: string;
  role?: BuilderWorkspaceRole;
}): Promise<BuilderWorkspaceMember> {
  const email = normalizeWorkspaceEmail(input.email);
  if (!email || !email.includes('@')) throw new Error('A valid member email is required.');
  return withWriteLock(async () => {
    const doc = (await loadDocument()) ?? createDefaultDocument();
    const existing = doc.members.find((member) => member.email === email);
    if (existing) return existing;
    const member: BuilderWorkspaceMember = {
      email,
      accountId: doc.account.id,
      role: input.role ?? 'viewer',
      addedAt: nowIso(),
    };
    const next: BuilderWorkspaceDocument = { ...doc, members: [...doc.members, member] };
    await persistDocument(next);
    return member;
  });
}

export async function updateMemberRole(
  email: string,
  role: BuilderWorkspaceRole,
): Promise<BuilderWorkspaceMember | null> {
  const normalized = normalizeWorkspaceEmail(email);
  if (!normalized) return null;
  if (!isBuilderWorkspaceRole(role)) throw new Error(`Invalid role: ${String(role)}`);
  return withWriteLock(async () => {
    const doc = (await loadDocument()) ?? createDefaultDocument();
    const index = doc.members.findIndex((member) => member.email === normalized);
    if (index === -1) return null;
    const ownerCount = doc.members.filter((member) => member.role === 'owner').length;
    const current = doc.members[index];
    if (current.role === 'owner' && role !== 'owner' && ownerCount <= 1) {
      throw new Error('Cannot demote the only owner.');
    }
    const updated: BuilderWorkspaceMember = { ...current, role };
    const members = [...doc.members];
    members[index] = updated;
    await persistDocument({ ...doc, members });
    return updated;
  });
}

export async function removeMember(email: string): Promise<boolean> {
  const normalized = normalizeWorkspaceEmail(email);
  if (!normalized) return false;
  return withWriteLock(async () => {
    const doc = (await loadDocument()) ?? createDefaultDocument();
    const member = doc.members.find((entry) => entry.email === normalized);
    if (!member) return false;
    const ownerCount = doc.members.filter((entry) => entry.role === 'owner').length;
    if (member.role === 'owner' && ownerCount <= 1) {
      throw new Error('Cannot remove the only owner.');
    }
    const members = doc.members.filter((entry) => entry.email !== normalized);
    await persistDocument({ ...doc, members });
    return true;
  });
}

function isNotFoundError(error: unknown): boolean {
  return Boolean(
    error
      && typeof error === 'object'
      && (error as { code?: unknown }).code === 'ENOENT',
  );
}