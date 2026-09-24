import { describe, expect, it } from 'vitest';
import { buildJhsuIntakeEmail, resolveJhsuRecipients } from '../send-jhsu-intake-email';

describe('send-jhsu-intake-email', () => {
  it('defaults to both lawyers as recipients', () => {
    const prev = process.env.JHSU_NOTIFY_EMAIL;
    delete process.env.JHSU_NOTIFY_EMAIL;
    expect(resolveJhsuRecipients()).toEqual(['jjhsu@hoveringlaw.com.tw', 'wei@hoveringlaw.com.tw']);
    if (prev !== undefined) process.env.JHSU_NOTIFY_EMAIL = prev;
  });

  it('rejects an invalid configured recipient list', () => {
    const prev = process.env.JHSU_NOTIFY_EMAIL;
    process.env.JHSU_NOTIFY_EMAIL = 'not-an-email';
    expect(() => resolveJhsuRecipients()).toThrow();
    if (prev === undefined) delete process.env.JHSU_NOTIFY_EMAIL; else process.env.JHSU_NOTIFY_EMAIL = prev;
  });

  it('escapes HTML in the message body and keeps all fields', () => {
    const { subject, html, text } = buildJhsuIntakeEmail({
      name: '王小明', phone: '0912', email: 'a@b.test', role: '家屬', stage: '家人被拘提或羈押',
      message: '<script>alert(1)</script>\n第二行', counterparty: '某公司',
    }, 'JH-ABCDEF12', '2026-09-25 00:10');
    expect(subject).toContain('JH-ABCDEF12');
    expect(subject).toContain('家屬／家人被拘提或羈押');
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>');
    expect(html).toContain('第二行');
    expect(html).toContain('某公司');
    expect(text).toContain('簡述情況:\n<script>alert(1)</script>');
  });
});
