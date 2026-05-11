import type { CapturedError } from './types';

/**
 * PR #16 follow-up — Slack alert side channel.
 *
 * When SLACK_WEBHOOK_URL is set and the captured error severity is
 * `error` or `fatal`, post a compact message to Slack. Best-effort — never
 * throws, never blocks the caller (used via fire-and-forget).
 */
export async function alertSlackForError(entry: CapturedError): Promise<boolean> {
  const url = process.env.SLACK_WEBHOOK_URL ?? '';
  if (!url) return false;
  if (entry.severity !== 'error' && entry.severity !== 'fatal') return false;

  const tagSnippet = entry.tags ? Object.entries(entry.tags).slice(0, 4).map(([k, v]) => `${k}=${v}`).join(' · ') : '';
  const text = `:warning: *[${entry.severity}]* ${entry.origin} — ${entry.message}`;
  const blocks = [
    { type: 'section', text: { type: 'mrkdwn', text } },
    tagSnippet ? { type: 'context', elements: [{ type: 'mrkdwn', text: tagSnippet }] } : null,
    { type: 'context', elements: [{ type: 'mrkdwn', text: `id: \`${entry.errorId}\` · ${entry.capturedAt}` }] },
  ].filter(Boolean);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, blocks }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
