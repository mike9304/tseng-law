import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

type NativePreviewContract = {
  file: string;
  imageCount: number;
  sources: string[];
};

const contracts: NativePreviewContract[] = [
  {
    file: 'ai-generator/AiGeneratorWizard.tsx',
    imageCount: 1,
    sources: ['asset.url'],
  },
  {
    file: 'canvas/RepeaterMultiRecordPreview.tsx',
    imageCount: 1,
    sources: ['record.seo.image'],
  },
  {
    file: 'commerce/ProductManagerClient.tsx',
    imageCount: 2,
    sources: ['variant.mediaUrl', 'product.media[0].url'],
  },
  {
    file: 'portfolio/PortfolioAdminClient.tsx',
    imageCount: 1,
    sources: ['project.coverImageUrl'],
  },
];

function readComponent(relativePath: string): string {
  return readFileSync(
    path.join(process.cwd(), 'src/components/builder', relativePath),
    'utf8',
  );
}

describe('dynamic builder preview native image contract', () => {
  it.each(contracts)(
    'keeps every arbitrary URL preview in $file on a documented per-element lint exception',
    ({ file, imageCount, sources }) => {
      const source = readComponent(file);
      const nativeImages = source.match(/<img\b/g) ?? [];
      const documentedExceptions = source.match(
        /\{\/\* eslint-disable-next-line @next\/next\/no-img-element -- [^*]+\*\/\}\s*<img\b/g,
      ) ?? [];

      expect(nativeImages).toHaveLength(imageCount);
      expect(documentedExceptions).toHaveLength(imageCount);
      expect(source).not.toContain('/* eslint-disable @next/next/no-img-element');

      for (const dynamicSource of sources) {
        expect(source).toContain(`src={${dynamicSource}}`);
      }
    },
  );
});
