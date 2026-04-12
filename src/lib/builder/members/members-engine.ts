/**
 * Phase 13 — Members Area & Gated Content.
 *
 * MEM-01: Signup/login model
 * MEM-02: Member profile
 * MEM-03: Private/protected pages
 * MEM-04: Roles & content gating
 * MEM-05: App-linked tabs
 */

import { get, put, list } from '@vercel/blob';
import crypto from 'crypto';

// ─── Member Model ─────────────────────────────────────────────────

export type MemberRole = 'free' | 'premium' | 'admin';

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

export interface MemberSession {
  sessionId: string;
  memberId: string;
  expiresAt: string;
  createdAt: string;
}

const MEMBERS_PREFIX = 'builder-members/';
const SESSIONS_PREFIX = 'builder-members/sessions/';

// ─── Password hashing (simple, use bcrypt in prod) ────────────────

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'hojeong-salt-2026').digest('hex');
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// ─── CRUD ─────────────────────────────────────────────────────────

export async function createMember(data: {
  email: string;
  name: string;
  password: string;
  role?: MemberRole;
}): Promise<SiteMember> {
  const existing = await getMemberByEmail(data.email);
  if (existing) throw new Error('이미 가입된 이메일입니다.');

  const member: SiteMember = {
    memberId: `member-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    email: data.email.toLowerCase().trim(),
    name: data.name,
    role: data.role || 'free',
    passwordHash: hashPassword(data.password),
    createdAt: new Date().toISOString(),
    verified: false,
    blocked: false,
  };

  await put(`${MEMBERS_PREFIX}${member.memberId}.json`, JSON.stringify(member), {
    access: 'private', allowOverwrite: true, contentType: 'application/json',
  });
  return member;
}

export async function getMember(memberId: string): Promise<SiteMember | null> {
  try {
    const result = await get(`${MEMBERS_PREFIX}${memberId}.json`, { access: 'private', useCache: false });
    if (result?.statusCode === 200 && result.stream) {
      return JSON.parse(await new Response(result.stream).text()) as SiteMember;
    }
  } catch { /* empty */ }
  return null;
}

export async function getMemberByEmail(email: string): Promise<SiteMember | null> {
  const members = await listMembers();
  return members.find((m) => m.email === email.toLowerCase().trim()) || null;
}

export async function listMembers(): Promise<SiteMember[]> {
  try {
    const result = await list({ prefix: MEMBERS_PREFIX });
    const members: SiteMember[] = [];
    for (const blob of result.blobs) {
      if (blob.pathname.includes('/sessions/')) continue;
      try {
        const res = await get(blob.pathname, { access: 'private', useCache: false });
        if (res?.statusCode === 200 && res.stream) {
          members.push(JSON.parse(await new Response(res.stream).text()) as SiteMember);
        }
      } catch { /* skip */ }
    }
    return members;
  } catch { return []; }
}

// ─── Auth ─────────────────────────────────────────────────────────

export async function loginMember(email: string, password: string): Promise<MemberSession | null> {
  const member = await getMemberByEmail(email);
  if (!member || member.blocked) return null;
  if (!verifyPassword(password, member.passwordHash)) return null;

  const session: MemberSession = {
    sessionId: crypto.randomUUID(),
    memberId: member.memberId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    createdAt: new Date().toISOString(),
  };

  await put(`${SESSIONS_PREFIX}${session.sessionId}.json`, JSON.stringify(session), {
    access: 'private', allowOverwrite: true, contentType: 'application/json',
  });

  member.lastLoginAt = new Date().toISOString();
  await put(`${MEMBERS_PREFIX}${member.memberId}.json`, JSON.stringify(member), {
    access: 'private', allowOverwrite: true, contentType: 'application/json',
  });

  return session;
}

export async function validateSession(sessionId: string): Promise<SiteMember | null> {
  try {
    const result = await get(`${SESSIONS_PREFIX}${sessionId}.json`, { access: 'private', useCache: false });
    if (!result?.stream || result.statusCode !== 200) return null;
    const session = JSON.parse(await new Response(result.stream).text()) as MemberSession;
    if (new Date(session.expiresAt) < new Date()) return null;
    return getMember(session.memberId);
  } catch { return null; }
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
  if (member.blocked) return false;
  if (gate.allowedRoles.length === 0) return true; // any logged-in member
  return gate.allowedRoles.includes(member.role);
}
