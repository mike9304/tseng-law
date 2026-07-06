import { describe, expect, it } from 'vitest';
import {
  collectSharedAssetUsageFromValue,
} from '@/lib/builder/workspace/shared-asset-usage';

const usageContext = {
  siteId: 'site-a',
  source: 'page-canvas',
  label: 'Home draft canvas',
  pageId: 'home',
  variant: 'draft',
} as const;

describe('workspace shared asset usage', () => {
  it('collects shared asset URL references from nested JSON string fields', () => {
    const usage = collectSharedAssetUsageFromValue(
      {
        content: {
          src: '/api/builder/workspace/assets/hero.png',
          hoverSrc: 'https://law.example.test/api/builder/workspace/assets/hero.png?v=2',
          ignored: '/api/builder/workspace/assets/other.png',
        },
        nested: [
          { seoImage: '/api/builder/workspace/assets/hero.png' },
        ],
      },
      '/api/builder/workspace/assets/hero.png',
      usageContext,
    );

    expect(usage.total).toBe(3);
    expect(usage.references.map((reference) => reference.path)).toEqual([
      '$.content.src',
      '$.content.hoverSrc',
      '$.nested[0].seoImage',
    ]);
  });
});
