import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

const ORIGINAL_CWD = process.cwd();
let tmpRoot = '';

beforeEach(async () => {
  tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'crm-trk-'));
  process.chdir(tmpRoot);
  delete process.env.BLOB_READ_WRITE_TOKEN;
  process.env.CRM_BACKEND = 'local';
  process.env.CRM_TRACKING_SECRET = 'test-tracking-secret';
});

afterEach(async () => {
  process.chdir(ORIGINAL_CWD);
  await fs.rm(tmpRoot, { recursive: true, force: true });
  delete process.env.CRM_TRACKING_SECRET;
});

describe('tracking token sign/verify', () => {
  it('round-trips an open token', async () => {
    const mod = await import('@/lib/builder/crm/tracking-model');
    const token = mod.signTrackingToken(
      { kind: 'open', contactId: 'ct1', campaignId: 'cmp1' },
      'secret',
    );
    const payload = mod.verifyTrackingToken(token, 'secret');
    expect(payload?.kind).toBe('open');
    expect(payload?.contactId).toBe('ct1');
    expect(payload?.campaignId).toBe('cmp1');
  });

  it('round-trips a click token with bound url', async () => {
    const mod = await import('@/lib/builder/crm/tracking-model');
    const token = mod.signTrackingToken(
      {
        kind: 'click',
        contactId: 'ct1',
        campaignId: 'cmp1',
        url: 'https://example.com/post',
      },
      'secret',
    );
    const payload = mod.verifyTrackingToken(token, 'secret', { expectedKind: 'click' });
    expect(payload?.url).toBe('https://example.com/post');
  });

  it('rejects a token signed with a different secret', async () => {
    const mod = await import('@/lib/builder/crm/tracking-model');
    const token = mod.signTrackingToken(
      { kind: 'open', contactId: 'ct1', campaignId: 'cmp1' },
      'secret-a',
    );
    expect(mod.verifyTrackingToken(token, 'secret-b')).toBeNull();
  });

  it('rejects a tampered payload (signature mismatch)', async () => {
    const mod = await import('@/lib/builder/crm/tracking-model');
    const token = mod.signTrackingToken(
      { kind: 'open', contactId: 'ct1', campaignId: 'cmp1' },
      'secret',
    );
    const [encoded, sig] = token.split('.');
    // Flip a byte inside the encoded payload while keeping the original sig.
    const swapped = `${encoded.replace(/.$/, encoded.endsWith('A') ? 'B' : 'A')}.${sig}`;
    expect(mod.verifyTrackingToken(swapped, 'secret')).toBeNull();
  });

  it('rejects expired tokens (90+ days old)', async () => {
    const mod = await import('@/lib/builder/crm/tracking-model');
    const oldIat = Date.now() - 91 * 24 * 60 * 60 * 1000;
    const token = mod.signTrackingToken(
      { kind: 'open', contactId: 'ct1', campaignId: 'cmp1', iat: oldIat },
      'secret',
    );
    expect(mod.verifyTrackingToken(token, 'secret')).toBeNull();
  });

  it('rejects expectedKind mismatch (open token sent to click verifier)', async () => {
    const mod = await import('@/lib/builder/crm/tracking-model');
    const token = mod.signTrackingToken(
      { kind: 'open', contactId: 'ct1', campaignId: 'cmp1' },
      'secret',
    );
    expect(mod.verifyTrackingToken(token, 'secret', { expectedKind: 'click' })).toBeNull();
  });

  it('rejects click token missing a url', async () => {
    const mod = await import('@/lib/builder/crm/tracking-model');
    // We hand-craft the token because signTrackingToken accepts a missing url.
    // The signed payload itself must lack `url` to exercise the check.
    const token = mod.signTrackingToken(
      { kind: 'click', contactId: 'ct1', campaignId: 'cmp1' },
      'secret',
    );
    expect(mod.verifyTrackingToken(token, 'secret', { expectedKind: 'click' })).toBeNull();
  });

  it('isSafeRedirectUrl gates non-http(s) and overlong URLs', async () => {
    const mod = await import('@/lib/builder/crm/tracking-model');
    expect(mod.isSafeRedirectUrl('https://example.com')).toBe(true);
    expect(mod.isSafeRedirectUrl('http://example.com')).toBe(true);
    expect(mod.isSafeRedirectUrl('javascript:alert(1)')).toBe(false);
    expect(mod.isSafeRedirectUrl('ftp://example.com')).toBe(false);
    expect(mod.isSafeRedirectUrl(undefined)).toBe(false);
    expect(mod.isSafeRedirectUrl('not a url')).toBe(false);
    expect(mod.isSafeRedirectUrl(`https://example.com/${'a'.repeat(2100)}`)).toBe(false);
  });
});

describe('tracking event log', () => {
  it('logs open + click events and summarizes them by campaign', async () => {
    const mod = await import('@/lib/builder/crm/tracking-model');
    await mod.logOpenEvent({ contactId: 'ct1', campaignId: 'cmpA' });
    await mod.logOpenEvent({ contactId: 'ct2', campaignId: 'cmpA' });
    await mod.logClickEvent({
      contactId: 'ct1',
      campaignId: 'cmpA',
      url: 'https://example.com',
    });
    await mod.logClickEvent({
      contactId: 'ct3',
      campaignId: 'cmpB',
      url: 'https://example.com/b',
    });

    const events = await mod.readTrackingEvents();
    expect(events).toHaveLength(4);

    const summary = await mod.summarizeTracking();
    expect(summary.total).toBe(4);
    expect(summary.opens).toBe(2);
    expect(summary.clicks).toBe(2);
    expect(summary.byCampaign.cmpA).toEqual({ opens: 2, clicks: 1 });
    expect(summary.byCampaign.cmpB).toEqual({ opens: 0, clicks: 1 });
  });

  it('persists events to disk so a re-import sees the same log', async () => {
    const first = await import('@/lib/builder/crm/tracking-model');
    await first.logOpenEvent({ contactId: 'ct1', campaignId: 'cmp1' });
    const written = await fs.readFile(
      path.join(tmpRoot, 'runtime-data', 'crm', 'tracking-events.json'),
      'utf8',
    );
    expect(JSON.parse(written).events).toHaveLength(1);
  });

  it('TRACKING_PIXEL_GIF is a valid 43-byte GIF89a header', async () => {
    const mod = await import('@/lib/builder/crm/tracking-model');
    expect(mod.TRACKING_PIXEL_GIF.length).toBe(43);
    expect(mod.TRACKING_PIXEL_GIF.slice(0, 6).toString('ascii')).toBe('GIF89a');
  });
});