/**
 * Phase 26 W204 — Twilio SMS helper.
 *
 * Env required: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER.
 * When missing, returns { ok: false, reason: 'unconfigured' } so callers can
 * degrade silently.
 */

export type SmsResult =
  | { ok: true; sid: string }
  | { ok: false; reason: 'unconfigured' | 'send' | 'network'; details?: string };

export interface SendSmsArgs {
  toE164: string; // e.g. '+821012345678'
  body: string;
}

export async function sendSms(args: SendSmsArgs): Promise<SmsResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID ?? '';
  const authToken = process.env.TWILIO_AUTH_TOKEN ?? '';
  const from = process.env.TWILIO_FROM_NUMBER ?? '';

  if (!accountSid || !authToken || !from) {
    return { ok: false, reason: 'unconfigured' };
  }
  const to = args.toE164.trim();
  if (!/^\+\d{7,15}$/.test(to)) {
    return { ok: false, reason: 'send', details: 'invalid E.164 number' };
  }

  try {
    const basic = Buffer.from(`${accountSid}:${authToken}`, 'utf8').toString('base64');
    const body = new URLSearchParams();
    body.set('From', from);
    body.set('To', to);
    body.set('Body', args.body.slice(0, 1600));

    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return { ok: false, reason: 'send', details: text.slice(0, 200) };
    }
    const data = (await res.json()) as { sid?: string };
    if (!data.sid) return { ok: false, reason: 'send', details: 'missing sid' };
    return { ok: true, sid: data.sid };
  } catch (err) {
    return {
      ok: false,
      reason: 'network',
      details: err instanceof Error ? err.message : String(err),
    };
  }
}
