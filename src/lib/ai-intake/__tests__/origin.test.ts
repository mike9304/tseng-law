import { afterEach, describe, expect, it, vi } from 'vitest';
import { siteLocales } from '@/lib/locales';
import { buildRequirementsPayload, publicPrivacyUrl } from '@/lib/ai-intake/copy';
import {
  getAiIntakeMcpAllowedHostnames,
  getAiIntakePublicOrigin,
  isAiIntakePublicPrivacyUrl,
  isExactHostname,
} from '@/lib/ai-intake/origin';
import { aiIntakeRequirementsResponseSchema } from '@/lib/ai-intake/schemas';

const SENTINEL_USER = 'evil-user';
const SENTINEL_PASS = 'leak-pass';
const SENTINEL_HOST = 'hostile.example';
const SENTINELS = [SENTINEL_USER, SENTINEL_PASS, SENTINEL_HOST, '2130706433', '0x7f000001'];

function assertNoSentinels(serialized: string): void {
  for (const sentinel of SENTINELS) {
    expect(serialized).not.toContain(sentinel);
  }
  expect(serialized).not.toContain('?q=');
  expect(serialized).not.toContain('#frag');
}

function assertCanonicalFallback(raw: string): void {
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', raw);
  vi.stubEnv('SITE_URL', raw);
  expect(getAiIntakePublicOrigin()).toBe('https://tseng-law.com');
  expect(getAiIntakePublicOrigin()).not.toContain(raw);
  for (const locale of siteLocales) {
    const privacy = publicPrivacyUrl(locale);
    expect(privacy).toBe(`https://tseng-law.com/${locale}/privacy`);
    const payload = buildRequirementsPayload(locale, 'labor');
    expect(payload.privacyUrl).toBe(privacy);
    const serialized = JSON.stringify(payload);
    assertNoSentinels(serialized);
    expect(serialized).not.toContain(raw);
    expect(aiIntakeRequirementsResponseSchema.safeParse(payload).success).toBe(true);
  }
}

describe('AI intake trusted origin/hostname boundary', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('accepts canonical IPv4, localhost, DNS, and exact IPv6 brackets', () => {
    expect(isExactHostname('127.0.0.1')).toBe(true);
    expect(isExactHostname('192.0.2.128')).toBe(true);
    expect(isExactHostname('0.0.0.0')).toBe(true);
    expect(isExactHostname('localhost')).toBe(true);
    expect(isExactHostname('example.test')).toBe(true);
    expect(isExactHostname('a1.example.test')).toBe(true);
    expect(isExactHostname('123.example.test')).toBe(true);
    expect(isExactHostname('[::1]')).toBe(true);
    expect(isExactHostname('[2001:db8::1]')).toBe(true);
    expect(isExactHostname('[::ffff:192.0.2.128]')).toBe(true);
  });

  it('rejects fake IPv6, zone ids, bracket mismatches, and IPv4 aliases', () => {
    expect(isExactHostname('[::::]')).toBe(false);
    expect(isExactHostname('[a]')).toBe(false);
    expect(isExactHostname('[dead:beef]')).toBe(false);
    expect(isExactHostname('[fe80::1%lo0]')).toBe(false);
    expect(isExactHostname('[fe80::1%25lo0]')).toBe(false);
    expect(isExactHostname('[::1')).toBe(false);
    expect(isExactHostname('::1]')).toBe(false);
    expect(isExactHostname('::1')).toBe(false);
    expect(isExactHostname('[[::1]]')).toBe(false);
    expect(isExactHostname('256.0.0.1')).toBe(false);
    expect(isExactHostname('999.999.999.999')).toBe(false);
    expect(isExactHostname('2130706433')).toBe(false);
    expect(isExactHostname('0177.0.0.1')).toBe(false);
    expect(isExactHostname('127.1')).toBe(false);
    expect(isExactHostname('0x7f000001')).toBe(false);
    expect(isExactHostname('0x7f.0.0.1')).toBe(false);
    expect(isExactHostname('01.02.03.004')).toBe(false);
    expect(isExactHostname('*.vercel.app')).toBe(false);
  });

  it('fails closed on an invalid explicit allowlist even when the site URL is valid', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.test');
    vi.stubEnv('SITE_URL', 'https://example.test');
    vi.stubEnv('VERCEL_URL', '');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', '');
    vi.stubEnv('AI_INTAKE_MCP_ALLOWED_HOSTS', 'localhost,[::::]');
    expect(getAiIntakeMcpAllowedHostnames()).toBeNull();
    vi.stubEnv('AI_INTAKE_MCP_ALLOWED_HOSTS', 'localhost,256.0.0.1');
    expect(getAiIntakeMcpAllowedHostnames()).toBeNull();
  });

  it('fails closed when the explicit allowlist contains empty members', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.test');
    vi.stubEnv('SITE_URL', 'https://example.test');
    vi.stubEnv('VERCEL_URL', 'deployment.example');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'tseng-law.com');
    for (const raw of ['localhost,', ',localhost', 'localhost,,example.test', 'localhost, ', ' ,localhost']) {
      vi.stubEnv('AI_INTAKE_MCP_ALLOWED_HOSTS', raw);
      expect(getAiIntakeMcpAllowedHostnames()).toBeNull();
    }
    vi.stubEnv('AI_INTAKE_MCP_ALLOWED_HOSTS', '  ,  ');
    expect(getAiIntakeMcpAllowedHostnames()).toBeNull();
  });

  it('still combines a valid nonempty allowlist with safe canonical and deployment hosts', () => {
    vi.stubEnv('AI_INTAKE_MCP_ALLOWED_HOSTS', 'localhost');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.test');
    vi.stubEnv('SITE_URL', 'https://example.test');
    vi.stubEnv('VERCEL_URL', '');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', '');
    expect(getAiIntakeMcpAllowedHostnames()).toEqual(['localhost', 'example.test']);
  });

  it('returns only origin for IPv6 and DNS URLs with path, query, and fragment', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://[::1]:8443/path?q=x#f');
    vi.stubEnv('SITE_URL', 'https://[::1]:8443/path?q=x#f');
    expect(getAiIntakePublicOrigin()).toBe('https://[::1]:8443');
    expect(getAiIntakePublicOrigin()).not.toContain('[[');
    expect(publicPrivacyUrl('en')).toBe('https://[::1]:8443/en/privacy');

    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.test:8443/docs?q=1#top');
    vi.stubEnv('SITE_URL', 'https://example.test:8443/docs?q=1#top');
    expect(getAiIntakePublicOrigin()).toBe('https://example.test:8443');
    expect(publicPrivacyUrl('ja')).toBe('https://example.test:8443/ja/privacy');
  });

  it('accepts canonical IPv4, DNS with numeric labels, scheme-less host:port, and default-port origin syntax', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://127.0.0.1');
    expect(getAiIntakePublicOrigin()).toBe('https://127.0.0.1');

    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://123.example.test');
    expect(getAiIntakePublicOrigin()).toBe('https://123.example.test');

    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'localhost:3000');
    expect(getAiIntakePublicOrigin()).toBe('https://localhost:3000');

    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'example.test:8443/path');
    expect(getAiIntakePublicOrigin()).toBe('https://example.test:8443');

    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.test:443/docs');
    expect(getAiIntakePublicOrigin()).toBe('https://example.test');
  });

  it('falls back to the canonical origin for credentials, aliases, recovery schemes, and malformed authority', () => {
    const hostile = [
      `https://${SENTINEL_USER}:${SENTINEL_PASS}@${SENTINEL_HOST}/secret?q=1#frag`,
      `https://@${SENTINEL_HOST}`,
      `https://:@${SENTINEL_HOST}`,
      'https://2130706433',
      'https://0177.0.0.1',
      'https://0x7f000001',
      'https://127.1',
      'https://01.02.03.004',
      'ftp://example.test',
      'https:/example.test',
      'http:/example.test',
      'https:///example.test',
      '//example.test',
      'http:\\\\example.test',
      `https://${SENTINEL_HOST}\\path`,
      'https://example%2etest',
      'https://example.test%2f',
      'https://example.test:99999',
      'https://example.test:65536',
      'https://example.test:abc',
      'https://example.test:',
      'http:80',
      'HTTP:80/path',
      'https:443',
      'HtTpS:443/path',
      'ftp:21',
      'file:80',
      'ws:80',
      'wss:443',
      'data:80',
      'javascript:80',
      'mailto:25',
      ' https://example.test:8443/path ',
      `https://example.test/${'x'.repeat(400)}`,
    ];
    for (const raw of hostile) {
      assertCanonicalFallback(raw);
    }
  });

  it('rejects privacy URLs with userinfo, query, fragment, or confused paths', () => {
    expect(isAiIntakePublicPrivacyUrl('https://tseng-law.com/en/privacy')).toBe(true);
    expect(isAiIntakePublicPrivacyUrl('https://[::1]:8443/ko/privacy')).toBe(true);
    expect(isAiIntakePublicPrivacyUrl(`https://${SENTINEL_USER}:${SENTINEL_PASS}@example.test/en/privacy`)).toBe(false);
    expect(isAiIntakePublicPrivacyUrl('https://example.test/en/privacy?q=1')).toBe(false);
    expect(isAiIntakePublicPrivacyUrl('https://example.test/en/privacy#f')).toBe(false);
    expect(isAiIntakePublicPrivacyUrl('https://example.test/en/privacy/extra')).toBe(false);
    expect(isAiIntakePublicPrivacyUrl('https://example.test/privacy')).toBe(false);

    const noncanonical = [
      'https://2130706433/en/privacy',
      'https://0177.0.0.1/en/privacy',
      'https://0x7f000001/en/privacy',
      'https://127.1/en/privacy',
      'https://01.02.03.004/en/privacy',
      'https://example.test\\en/privacy',
      ' https://example.test/en/privacy',
      'https://example.test/en/privacy ',
      'https://exa%6dple.test/en/privacy',
      'https://%31%32%37.0.0.1/en/privacy',
      'https://example%2etest/en/privacy',
      'https://example.test/%65n/privacy',
      'https:/example.test/en/privacy',
      'http:/example.test/en/privacy',
      'https:///example.test/en/privacy',
      'https:example.test/en/privacy',
      'https://example.test:/en/privacy',
      'https://example.test:443/en/privacy',
      'http://example.test:80/en/privacy',
      'https://example.test:0443/en/privacy',
      'https://example.test:65536/en/privacy',
    ];
    for (const value of noncanonical) {
      expect(isAiIntakePublicPrivacyUrl(value), value).toBe(false);
    }
  });
});
