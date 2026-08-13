/**
 * Phase 13 — Members Area & Gated Content.
 *
 * MEM-01: Signup/login model
 * MEM-02: Member profile
 * MEM-03: Private/protected pages
 * MEM-04: Roles & content gating
 * MEM-05: App-linked tabs
 */

import { promises as fs } from 'fs';
import path from 'path';
import { get, put, list } from '@vercel/blob';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// ─── Member Model ─────────────────────────────────────────────────

export type MemberRole = 'free' | 'premium' | 'admin';
type MembersBackend = 'blob' | 'file';

export interface SiteMember {
  memberId: string;
  email: string;
  name: string;
  role: MemberRole;
  passwordHash: string;
  profilePhoto?: string;
  phone?: string;
  locale?: string;
  customFields?: Record<string, string>;
  createdAt: string;
  lastLoginAt?: string;
  verified: boolean;
  blocked: boolean;
}

export type PublicSiteMember = Omit<SiteMember, 'passwordHash'>;

export interface MemberSession {
  sessionId: string;
  memberId: string;
  expiresAt: string;
  createdAt: string;
  revoked?: boolean;
}

const MEMBERS_PREFIX = 'builder-members/';
const SESSIONS_PREFIX = 'builder-members/sessions/';
export const MEMBER_SESSION_COOKIE = 'builder_member_session';
const DEFAULT_MEMBERS_ROOT = path.join(process.cwd(), 'runtime-data', 'builder-members');

function getBackend(): MembersBackend {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return 'file';
  if (process.env.CONSULTATION_LOG_BACKEND === 'local') return 'file';
  if (process.env.BUILDER_MEMBERS_BACKEND === 'local') return 'file';
  if (process.env.NODE_ENV !== 'production' && process.env.BUILDER_USE_BLOB_IN_DEV !== '1') return 'file';
  return 'blob';
}

function membersRoot(): string {
  return process.env.BUILDER_MEMBERS_ROOT?.trim() || DEFAULT_MEMBERS_ROOT;
}

function memberBlobPath(memberId: string): string {
  return `${MEMBERS_PREFIX}${memberId}.json`;
}

function sessionBlobPath(sessionId: string): string {
  return `${SESSIONS_PREFIX}${sessionId}.json`;
}

function memberFilePath(memberId: string): string {
  return path.join(membersRoot(), 'members', `${memberId}.json`);
}

function sessionFilePath(sessionId: string): string {
  return path.join(membersRoot(), 'sessions', `${sessionId}.json`);
}

async function writeJson(blobPath: string, filePath: string, data: unknown): Promise<void> {
  const body = JSON.stringify(data, null, 2);
  if (getBackend() === 'blob') {
    await put(blobPath, body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, body, 'utf8');
}

async function readJson<T>(blobPath: string, filePath: string): Promise<T | null> {
  try {
    if (getBackend() === 'blob') {
      const result = await get(blobPath, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        return JSON.parse(await new Response(result.stream).text()) as T;
      }
      return null;
    }

    return JSON.parse(await fs.readFile(filePath, 'utf8')) as T;
  } catch {
    return null;
  }
}

async function listMemberJson(): Promise<SiteMember[]> {
  if (getBackend() === 'blob') {
    const result = await list({ prefix: MEMBERS_PREFIX });
    const members: SiteMember[] = [];
    for (const blob of result.blobs) {
      if (blob.pathname.includes('/sessions/')) continue;
      const parsed = await readJson<SiteMember>(
        blob.pathname,
        memberFilePath(path.basename(blob.pathname, '.json')),
      );
      if (parsed) members.push(normalizeMember(parsed));
    }
    return members;
  }

  const dir = path.join(membersRoot(), 'members');
  const files = await fs.readdir(dir).catch(() => []);
  const values = await Promise.all(
    files
      .filter((file) => file.endsWith('.json'))
      .map((file) => readJson<SiteMember>('', path.join(dir, file))),
  );
  return values.filter((value): value is SiteMember => Boolean(value)).map(normalizeMember);
}

function safeTrim(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function normalizeEmail(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function parseEmailAliases(value: unknown): string[] {
  if (typeof value !== 'string') return [];
  const raw = value.trim();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => normalizeEmail(item))
        .filter(Boolean);
    }
  } catch {
    // Fall through to delimiter parsing.
  }
  return raw
    .split(/[\n,;|]+/)
    .map((item) => normalizeEmail(item))
    .filter(Boolean);
}

function serializeEmailAliases(emails: string[]): string {
  return JSON.stringify([...new Set(emails.map((email) => normalizeEmail(email)).filter(Boolean))]);
}

function normalizeRole(role: unknown): MemberRole {
  return role === 'premium' || role === 'admin' ? role : 'free';
}

function normalizeMember(input: Partial<SiteMember>): SiteMember {
  const now = new Date().toISOString();
  return {
    memberId: safeTrim(input.memberId, 120) || `member-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    email: safeTrim(input.email, 180).toLowerCase(),
    name: safeTrim(input.name, 120) || safeTrim(input.email, 180).split('@')[0] || 'Member',
    role: normalizeRole(input.role),
    passwordHash: safeTrim(input.passwordHash, 240),
    ...(safeTrim(input.profilePhoto, 2000) ? { profilePhoto: safeTrim(input.profilePhoto, 2000) } : {}),
    ...(safeTrim(input.phone, 80) ? { phone: safeTrim(input.phone, 80) } : {}),
    ...(safeTrim(input.locale, 20) ? { locale: safeTrim(input.locale, 20) } : {}),
    ...(input.customFields && typeof input.customFields === 'object' ? { customFields: input.customFields } : {}),
    createdAt: input.createdAt && Number.isFinite(Date.parse(input.createdAt)) ? input.createdAt : now,
    ...(input.lastLoginAt && Number.isFinite(Date.parse(input.lastLoginAt)) ? { lastLoginAt: input.lastLoginAt } : {}),
    verified: Boolean(input.verified),
    blocked: Boolean(input.blocked),
  };
}

export function publicMember(member: SiteMember): PublicSiteMember {
  const { passwordHash, ...safe } = normalizeMember(member);
  void passwordHash;
  return safe;
}

export function getMemberPortalEmails(member: SiteMember): string[] {
  return [...new Set([normalizeEmail(member.email), ...parseEmailAliases(member.customFields?.memberEmailAliases)])].filter(Boolean);
}

// ─── Password hashing (bcrypt, production-safe) ──────────────────

const BCRYPT_ROUNDS = 10;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ─── CRUD ─────────────────────────────────────────────────────────

export async function createMember(data: {
  email: string;
  name: string;
  password: string;
  role?: MemberRole;
  verified?: boolean;
}): Promise<SiteMember> {
  const existing = await getMemberByEmail(data.email);
  if (existing) throw new Error('이미 가입된 이메일입니다.');

  const member = normalizeMember({
    memberId: `member-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    email: data.email,
    name: data.name,
    role: data.role || 'free',
    passwordHash: await hashPassword(data.password),
    createdAt: new Date().toISOString(),
    verified: data.verified ?? false,
    blocked: false,
  });

  await writeJson(memberBlobPath(member.memberId), memberFilePath(member.memberId), member);
  // PR #13 — fire webhook event (best-effort dynamic import to avoid circular deps).
  void import('@/lib/builder/webhooks/dispatcher').then(({ emitEvent }) => {
    emitEvent('member.registered', {
      memberId: member.memberId,
      email: member.email,
      name: member.name,
      role: member.role,
    });
  }).catch(() => undefined);
  return member;
}

export async function getMember(memberId: string): Promise<SiteMember | null> {
  const member = await readJson<SiteMember>(memberBlobPath(memberId), memberFilePath(memberId));
  return member ? normalizeMember(member) : null;
}

export async function getMemberByEmail(email: string): Promise<SiteMember | null> {
  const members = await listMembers();
  return members.find((m) => m.email === email.toLowerCase().trim()) || null;
}

export async function listMembers(): Promise<SiteMember[]> {
  return listMemberJson();
}

export async function saveMember(member: SiteMember): Promise<SiteMember> {
  const normalized = normalizeMember(member);
  await writeJson(memberBlobPath(normalized.memberId), memberFilePath(normalized.memberId), normalized);
  return normalized;
}

export async function updateMemberProfile(
  memberId: string,
  patch: { email?: string; name?: string; phone?: string; profilePhoto?: string; customFields?: Record<string, string> },
): Promise<SiteMember | null> {
  const member = await getMember(memberId);
  if (!member) return null;
  const nextEmail = normalizeEmail(patch.email);
  if (nextEmail && nextEmail !== member.email) {
    const existing = await getMemberByEmail(nextEmail);
    if (existing && existing.memberId !== member.memberId) {
      throw new Error('duplicate_email');
    }
  }

  // `memberEmailAliases` is an authorization-sensitive, server-managed field:
  // getMemberPortalEmails() grants booking/billing portal access to every email
  // it contains, and the only legitimate writer is the old-email accumulation
  // below (when a member changes their address). An unprivileged self-service
  // PATCH must never set it directly — otherwise a member could append a
  // victim's email and read/cancel/refund their bookings & invoices (IDOR).
  const incomingCustomFields = { ...(patch.customFields ?? {}) };
  delete incomingCustomFields.memberEmailAliases;
  const nextCustomFields = {
    ...(member.customFields ?? {}),
    ...incomingCustomFields,
  };
  if (nextEmail && nextEmail !== member.email) {
    const aliases = new Set([
      ...parseEmailAliases(nextCustomFields.memberEmailAliases),
      member.email,
    ]);
    nextCustomFields.memberEmailAliases = serializeEmailAliases([...aliases]);
  }

  return saveMember({
    ...member,
    ...(nextEmail ? { email: nextEmail } : {}),
    ...(patch.name != null ? { name: safeTrim(patch.name, 120) || member.name } : {}),
    ...(patch.phone != null ? { phone: safeTrim(patch.phone, 80) } : {}),
    ...(patch.profilePhoto != null ? { profilePhoto: safeTrim(patch.profilePhoto, 2000) } : {}),
    customFields: nextCustomFields,
  });
}

export async function updateMemberAdmin(
  memberId: string,
  patch: { role?: MemberRole; verified?: boolean; blocked?: boolean; name?: string; phone?: string },
): Promise<SiteMember | null> {
  const member = await getMember(memberId);
  if (!member) return null;
  return saveMember({
    ...member,
    ...(patch.role ? { role: patch.role } : {}),
    ...(patch.verified != null ? { verified: patch.verified } : {}),
    ...(patch.blocked != null ? { blocked: patch.blocked } : {}),
    ...(patch.name != null ? { name: safeTrim(patch.name, 120) || member.name } : {}),
    ...(patch.phone != null ? { phone: safeTrim(patch.phone, 80) } : {}),
  });
}

export async function deleteMember(memberId: string): Promise<void> {
  const existing = await getMember(memberId);
  if (!existing) return;
  await saveMember({
    ...existing,
    blocked: true,
    email: `${existing.email}.deleted.${Date.now()}`,
  });
}

// ─── Auth ─────────────────────────────────────────────────────────

export async function loginMember(email: string, password: string): Promise<MemberSession | null> {
  const member = await getMemberByEmail(email);
  if (!member || member.blocked || !member.verified) return null;
  if (!(await verifyPassword(password, member.passwordHash))) return null;

  const session: MemberSession = {
    sessionId: crypto.randomUUID(),
    memberId: member.memberId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    createdAt: new Date().toISOString(),
  };

  await writeJson(sessionBlobPath(session.sessionId), sessionFilePath(session.sessionId), session);

  member.lastLoginAt = new Date().toISOString();
  await saveMember(member);

  return session;
}

export async function validateSession(sessionId: string): Promise<SiteMember | null> {
  const session = await readJson<MemberSession>(sessionBlobPath(sessionId), sessionFilePath(sessionId));
  if (!session || session.revoked || new Date(session.expiresAt) < new Date()) return null;
  const member = await getMember(session.memberId);
  if (!member || member.blocked || !member.verified) return null;
  return member;
}

export async function revokeSession(sessionId: string): Promise<void> {
  const session = await readJson<MemberSession>(sessionBlobPath(sessionId), sessionFilePath(sessionId));
  if (!session) return;
  await writeJson(
    sessionBlobPath(sessionId),
    sessionFilePath(sessionId),
    { ...session, revoked: true, expiresAt: new Date(0).toISOString() },
  );
}

// ─── Content Gating ───────────────────────────────────────────────

export interface ContentGate {
  pageId: string;
  allowedRoles: MemberRole[];
  requireLogin: boolean;
  redirectUrl?: string;
}

export function checkAccess(gate: ContentGate, member: SiteMember | null): boolean {
  if (!gate.requireLogin) return true;
  if (!member) return false;
  if (member.blocked || !member.verified) return false;
  if (gate.allowedRoles.length === 0) return true; // any logged-in member
  return gate.allowedRoles.includes(member.role);
}
