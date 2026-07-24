import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const productSources = [
  'src/lib/builder/canvas/decompose-attorney.ts',
  'src/lib/builder/canvas/decompose-insights.ts',
  'src/lib/builder/canvas/seed-home.ts',
  'src/components/builder/canvas/CanvasInsightsPreview.tsx',
] as const;

const fixtureSources = [
  'src/lib/builder/canvas/__tests__/seed-home-layout.test.ts',
  'src/components/builder/canvas/__tests__/site-header-responsive-contract.test.ts',
  'src/lib/builder/__tests__/dataset-field-binding.test.ts',
] as const;

function read(relativePath: string): string {
  return readFileSync(path.join(process.cwd(), relativePath), 'utf8');
}

describe('canonical builder attorney identity', () => {
  it('keeps builder product copy and fixtures free of the former attorney identity', () => {
    for (const relativePath of [...productSources, ...fixtureSources]) {
      const source = read(relativePath);

      expect(source, relativePath).not.toContain('曾俊瑋');
      expect(source, relativePath).not.toContain('tseng-junwei.png');
      expect(source, relativePath).not.toContain('tseng-junwei%2Epng');
    }
  });

  it('keeps the verified name and official portrait represented in builder sources', () => {
    const productCopy = productSources.map(read).join('\n');
    const seedFixture = read('src/lib/builder/canvas/__tests__/seed-home-layout.test.ts');
    const headerFixture = read('src/components/builder/canvas/__tests__/site-header-responsive-contract.test.ts');
    const datasetFixture = read('src/lib/builder/__tests__/dataset-field-binding.test.ts');

    expect(productCopy).toContain('曾雋崴律師');
    expect(productCopy).toContain('曾雋崴律師審閱');
    expect(seedFixture).toContain('曾雋崴 · 代表律師');
    expect(seedFixture).toContain('wei-tseng-official%2Epng');
    expect(headerFixture).toContain('曾雋崴(준외)');
    expect(datasetFixture).toContain('/images/team/wei-tseng-official.png');
  });
});
