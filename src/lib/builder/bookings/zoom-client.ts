/**
 * Phase 26 W205 — Zoom meeting creation helper.
 *
 * Uses Zoom Server-to-Server OAuth (account credentials) to mint an access
 * token, then calls POST /users/me/meetings to create a scheduled meeting.
 *
 * Env required: ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET.
 * When any is missing, returns { ok: false, reason: 'unconfigured' } so the
 * booking flow can degrade gracefully (skip meetingLink without erroring).
 */

import { promises as fs } from 'fs';
import path from 'path';

interface ZoomCreateMeetingArgs {
  topic: string;
  startTimeISO: string;
  durationMinutes: number;
  timezone?: string;
  customerEmail?: string;
}

interface ZoomMockConfig {
  meetingLinkBase?: string;
}

export type ZoomCreateMeetingResult =
  | { ok: true; meetingLink: string; meetingId: string }
  | { ok: false; reason: 'unconfigured' | 'token' | 'meeting' | 'network' };

interface ZoomCredentials {
  accountId: string;
  clientId: string;
  clientSecret: string;
}

function loadCredentials(): ZoomCredentials | null {
  const accountId = process.env.ZOOM_ACCOUNT_ID ?? '';
  const clientId = process.env.ZOOM_CLIENT_ID ?? '';
  const clientSecret = process.env.ZOOM_CLIENT_SECRET ?? '';
  if (!accountId || !clientId || !clientSecret) return null;
  return { accountId, clientId, clientSecret };
}

async function fetchAccessToken(credentials: ZoomCredentials): Promise<string | null> {
  try {
    const basic = Buffer.from(`${credentials.clientId}:${credentials.clientSecret}`, 'utf8').toString('base64');
    const url = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(credentials.accountId)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Basic ${basic}` },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { access_token?: string };
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

async function loadMockConfig(): Promise<ZoomMockConfig | null> {
  // Mock meetings are a development/test aid only. Production must fail
  // closed when real Zoom credentials are unavailable.
  if (process.env.NODE_ENV === 'production') return null;
  if (process.env.BUILDER_ZOOM_MOCK_MEETING_LINK) {
    return { meetingLinkBase: process.env.BUILDER_ZOOM_MOCK_MEETING_LINK };
  }
  const candidatePaths = [
    process.env.BUILDER_ZOOM_MOCK_PATH,
    path.join(process.cwd(), 'runtime-data', 'builder-bookings', 'zoom-mock.json'),
  ].filter((value): value is string => Boolean(value));
  for (const mockPath of candidatePaths) {
    try {
      const raw = await fs.readFile(mockPath, 'utf8');
      const parsed = JSON.parse(raw) as ZoomMockConfig | null;
      if (parsed && typeof parsed === 'object') return parsed;
    } catch {
      // Try the next candidate path.
    }
  }
  // Never invent a mock meeting implicitly. Simulation must be explicitly
  // opted into via BUILDER_ZOOM_MOCK_MEETING_LINK or BUILDER_ZOOM_MOCK_PATH.
  return null;
}

export async function createZoomMeeting(args: ZoomCreateMeetingArgs): Promise<ZoomCreateMeetingResult> {
  const mock = await loadMockConfig();
  if (mock?.meetingLinkBase) {
    const url = new URL(mock.meetingLinkBase);
    url.searchParams.set('timezone', args.timezone ?? 'Asia/Seoul');
    url.searchParams.set('start', args.startTimeISO);
    url.searchParams.set('duration', String(Math.max(5, Math.min(720, args.durationMinutes))));
    url.searchParams.set('topic', args.topic.slice(0, 200));
    if (args.customerEmail) {
      url.searchParams.set('customerEmail', args.customerEmail);
    }
    return { ok: true, meetingLink: url.toString(), meetingId: 'mock' };
  }

  const credentials = loadCredentials();
  if (!credentials) return { ok: false, reason: 'unconfigured' };

  const token = await fetchAccessToken(credentials);
  if (!token) {
    return { ok: false, reason: 'token' };
  }

  try {
    const body = {
      topic: args.topic.slice(0, 200),
      type: 2, // scheduled
      start_time: args.startTimeISO,
      duration: Math.max(5, Math.min(720, args.durationMinutes)),
      timezone: args.timezone ?? 'Asia/Seoul',
      settings: {
        join_before_host: false,
        approval_type: 2,
        waiting_room: true,
        registrants_email_notification: Boolean(args.customerEmail),
      },
    };

    const res = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return { ok: false, reason: 'meeting' };
    }

    const data = (await res.json()) as { join_url?: string; id?: number | string };
    if (!data.join_url || !data.id) {
      return { ok: false, reason: 'meeting' };
    }
    return { ok: true, meetingLink: data.join_url, meetingId: String(data.id) };
  } catch {
    return { ok: false, reason: 'network' };
  }
}
