import { afterEach, describe, expect, it, vi } from 'vitest';
import { getConsultationPublicMailto } from '@/lib/consultation/public-contact';

describe('semiconductor board consult on static site', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('opens a mailto with the locale subject prefix and unchanged body template', async () => {
    vi.stubEnv('NEXT_PUBLIC_STATIC_SITE', '1');
    vi.resetModules();
    const { getSemiconductorBoardConsultHref } = await import('@/lib/semiconductor-consult-link');
    const href = getSemiconductorBoardConsultHref('ko');
    expect(href.startsWith('mailto:')).toBe(true);
    const parsed = new URL(href);
    const baseline = getConsultationPublicMailto('ko');
    const baselineParsed = new URL(baseline);
    expect(parsed.searchParams.get('body')).toBe(baselineParsed.searchParams.get('body'));
    expect(parsed.searchParams.get('subject')).toBe(
      `[반도체 산업 상담] ${baselineParsed.searchParams.get('subject')}`,
    );
  });
});
