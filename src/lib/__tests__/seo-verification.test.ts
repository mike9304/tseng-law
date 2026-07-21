import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getSearchEngineVerification } from '@/lib/seo';

const verificationEnvKeys = [
  'NAVER_SITE_VERIFICATION',
  'BING_SITE_VERIFICATION',
  'GOOGLE_SITE_VERIFICATION',
] as const;

const originalEnv = Object.fromEntries(
  verificationEnvKeys.map((key) => [key, process.env[key]]),
) as Record<(typeof verificationEnvKeys)[number], string | undefined>;

describe('getSearchEngineVerification', () => {
  beforeEach(() => {
    for (const key of verificationEnvKeys) delete process.env[key];
  });

  afterEach(() => {
    for (const key of verificationEnvKeys) {
      const originalValue = originalEnv[key];
      if (originalValue === undefined) delete process.env[key];
      else process.env[key] = originalValue;
    }
  });

  it('maps configured ownership tokens to Next.js verification metadata', () => {
    process.env.NAVER_SITE_VERIFICATION = '  naver-token  ';
    process.env.BING_SITE_VERIFICATION = '  bing-token  ';
    process.env.GOOGLE_SITE_VERIFICATION = '  google-token  ';

    expect(getSearchEngineVerification()).toEqual({
      google: 'google-token',
      other: {
        'naver-site-verification': 'naver-token',
        'msvalidate.01': 'bing-token',
      },
    });
  });

  it('omits verification metadata when all ownership tokens are absent or empty', () => {
    process.env.NAVER_SITE_VERIFICATION = '';
    process.env.BING_SITE_VERIFICATION = '   ';

    expect(getSearchEngineVerification()).toBeUndefined();
  });
});
