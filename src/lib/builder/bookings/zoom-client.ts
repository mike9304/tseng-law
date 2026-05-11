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

interface ZoomCreateMeetingArgs {
  topic: string;
  startTimeISO: string;
  durationMinutes: number;
  timezone?: string;
  customerEmail?: string;
}

export type ZoomCreateMeetingResult =
  | { ok: true; meetingLink: string; meetingId: string }
  | { ok: false; reason: 'unconfigured' | 'token' | 'meeting' | 'network'; details?: string };

async function fetchAccessToken(): Promise<string | null> {
  const accountId = process.env.ZOOM_ACCOUNT_ID ?? '';
  const clientId = process.env.ZOOM_CLIENT_ID ?? '';
  const clientSecret = process.env.ZOOM_CLIENT_SECRET ?? '';
  if (!accountId || !clientId || !clientSecret) return null;
  try {
    const basic = Buffer.from(`${clientId}:${clientSecret}`, 'utf8').toString('base64');
    const url = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(accountId)}`;
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

export async function createZoomMeeting(args: ZoomCreateMeetingArgs): Promise<ZoomCreateMeetingResult> {
  const token = await fetchAccessToken();
  if (!token) {
    const accountId = process.env.ZOOM_ACCOUNT_ID ?? '';
    if (!accountId) return { ok: false, reason: 'unconfigured' };
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
      const text = await res.text().catch(() => '');
      return { ok: false, reason: 'meeting', details: text.slice(0, 200) };
    }

    const data = (await res.json()) as { join_url?: string; id?: number | string };
    if (!data.join_url || !data.id) {
      return { ok: false, reason: 'meeting', details: 'missing join_url or id' };
    }
    return { ok: true, meetingLink: data.join_url, meetingId: String(data.id) };
  } catch (err) {
    return {
      ok: false,
      reason: 'network',
      details: err instanceof Error ? err.message : String(err),
    };
  }
}
