import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildLegalServiceJsonLd } from '@/lib/seo';

const identitySourceFiles = [
  'src/lib/seo.ts',
  'src/lib/builder/seo/record-jsonld.ts',
  'src/lib/builder/columns/storage.ts',
  'src/app/llms.txt/route.ts',
] as const;

describe('canonical attorney SEO identity', () => {
  it('uses the canonical Traditional Chinese name in LegalService JSON-LD', () => {
    const payload = buildLegalServiceJsonLd('zh-hant');

    expect(payload.employee.name).toBe('曾雋崴律師');
  });

  it('preserves the Korean and English LegalService employee names', () => {
    expect(buildLegalServiceJsonLd('ko').employee.name).toBe('증준외 변호사');
    expect(buildLegalServiceJsonLd('en').employee.name).toBe('Attorney Wei Tseng');
  });

  it('does not retain the incorrect Chinese name in identity source files', () => {
    for (const sourceFile of identitySourceFiles) {
      const source = readFileSync(path.join(process.cwd(), sourceFile), 'utf8');

      expect(source, sourceFile).not.toContain('曾俊瑋');
    }
  });
});
