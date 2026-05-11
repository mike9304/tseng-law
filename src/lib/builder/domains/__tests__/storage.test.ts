import { describe, expect, it } from 'vitest';
import {
  makeDomainId,
  makeVerificationToken,
} from '@/lib/builder/domains/storage';

describe('domain storage helpers', () => {
  it('normalizes the domain id deterministically', () => {
    expect(makeDomainId('Example.com')).toBe('dom_example.com');
    expect(makeDomainId('Sub.Example.COM')).toBe('dom_sub.example.com');
  });

  it('strips unsafe characters from the id', () => {
    expect(makeDomainId('weird/path?domain.com')).toBe('dom_weird_path_domain.com');
  });

  it('produces a token shaped like the Vercel TXT convention', () => {
    const token = makeVerificationToken();
    expect(token.startsWith('vercel-verify=')).toBe(true);
    expect(token.length).toBeGreaterThan(20);
  });
});
