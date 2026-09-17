import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAiIntakeMcpAllowedHostnames, getAiIntakePublicOrigin, isExactHostname } from '../origin';

describe('AI intake MCP host allowlist', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('accepts exact hostnames only', () => {
    expect(isExactHostname('localhost')).toBe(true);
    expect(isExactHostname('example.test')).toBe(true);
    expect(isExactHostname('*.vercel.app')).toBe(false);
    expect(isExactHostname('https://example.test')).toBe(false);
  });

  it('combines the documented env list with the canonical site hostname', () => {
    vi.stubEnv('AI_INTAKE_MCP_ALLOWED_HOSTS', 'localhost');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.test');
    vi.stubEnv('SITE_URL', 'https://example.test');
    vi.stubEnv('VERCEL_URL', '');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', '');
    expect(getAiIntakeMcpAllowedHostnames()).toEqual(['localhost', 'example.test']);
    expect(getAiIntakePublicOrigin()).toBe('https://example.test');
  });

  it('fails closed when the explicit allowlist is missing or blank', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://tseng-law.com');
    vi.stubEnv('SITE_URL', 'https://tseng-law.com');
    vi.stubEnv('VERCEL_URL', 'deployment.example');
    vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'tseng-law.com');

    const env = process.env as Record<string, string | undefined>;
    delete env.AI_INTAKE_MCP_ALLOWED_HOSTS;
    expect(getAiIntakeMcpAllowedHostnames()).toBeNull();

    vi.stubEnv('AI_INTAKE_MCP_ALLOWED_HOSTS', '');
    expect(getAiIntakeMcpAllowedHostnames()).toBeNull();

    vi.stubEnv('AI_INTAKE_MCP_ALLOWED_HOSTS', '   ');
    expect(getAiIntakeMcpAllowedHostnames()).toBeNull();

    vi.stubEnv('AI_INTAKE_MCP_ALLOWED_HOSTS', '  ,  ');
    expect(getAiIntakeMcpAllowedHostnames()).toBeNull();
  });

  it('fails closed on wildcards or oversized configuration', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.test');
    vi.stubEnv('AI_INTAKE_MCP_ALLOWED_HOSTS', 'localhost,*.vercel.app');
    expect(getAiIntakeMcpAllowedHostnames()).toBeNull();

    vi.stubEnv('AI_INTAKE_MCP_ALLOWED_HOSTS', `${'a'.repeat(3000)}.test`);
    expect(getAiIntakeMcpAllowedHostnames()).toBeNull();

    vi.stubEnv('AI_INTAKE_MCP_ALLOWED_HOSTS', 'localhost,[::::]');
    expect(getAiIntakeMcpAllowedHostnames()).toBeNull();

    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.test');
    vi.stubEnv('VERCEL_URL', 'deployment.example');
    for (const raw of ['localhost,', ',localhost', 'localhost,,example.test']) {
      vi.stubEnv('AI_INTAKE_MCP_ALLOWED_HOSTS', raw);
      expect(getAiIntakeMcpAllowedHostnames()).toBeNull();
    }
  });
});
