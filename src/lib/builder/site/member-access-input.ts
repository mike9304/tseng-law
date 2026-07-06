import { z } from 'zod';
import type { MemberRole } from '@/lib/builder/members/members-engine';
import type { BuilderMemberAccessMeta } from '@/lib/builder/site/types';

const MEMBER_ACCESS_INPUT_SCHEMA = z.object({
  requireLogin: z.unknown(),
  allowedRoles: z.array(z.unknown()).optional(),
  redirectPath: z.string().optional(),
}).passthrough();

function memberRoleFromInput(value: unknown): MemberRole | null {
  return value === 'free' || value === 'premium' || value === 'admin' ? value : null;
}

export function normalizeMemberAccessInput(value: unknown): BuilderMemberAccessMeta | null {
  const parsed = MEMBER_ACCESS_INPUT_SCHEMA.safeParse(value);
  if (!parsed.success || parsed.data.requireLogin !== true) return null;

  const allowedRoles = parsed.data.allowedRoles
    ? Array.from(new Set(parsed.data.allowedRoles.map(memberRoleFromInput).filter((role): role is MemberRole => Boolean(role))))
    : [];
  const rawRedirectPath = parsed.data.redirectPath?.trim() ?? '';
  const redirectPath = rawRedirectPath.startsWith('/') && rawRedirectPath.length <= 500
    ? rawRedirectPath
    : undefined;

  return {
    requireLogin: true,
    ...(allowedRoles.length > 0 ? { allowedRoles } : {}),
    ...(redirectPath ? { redirectPath } : {}),
  };
}
