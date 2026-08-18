import { cookies } from 'next/headers';
import {
  MEMBER_SESSION_COOKIE,
  validateSession,
  type SiteMember,
} from './members-engine';

export async function getCurrentSiteMember(): Promise<SiteMember | null> {
  const sessionId = (await cookies()).get(MEMBER_SESSION_COOKIE)?.value;
  return sessionId ? validateSession(sessionId) : null;
}
