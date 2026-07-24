import { describe, expect, it } from 'vitest';

import { jaLanguageSwitchTarget } from '@/lib/public-route-policy';

describe('Japanese service-detail language switch policy', () => {
  it.each([
    ['/services', '/ja/services'],
    ['/services/investment', '/ja/services/investment'],
    ['/services/civil', '/ja/services/civil'],
    ['/services/family', '/ja/services/family'],
    ['/services/labor', '/ja/services'],
    ['/services/criminal', '/ja/services'],
    ['/services/ip', '/ja/services'],
    ['/columns/taiwan-company-establishment-basics', '/ja/columns/taiwan-company-establishment-basics'],
    ['/lawyers/wei-tseng', '/ja/lawyers/wei-tseng'],
    ['/store/products/taiwan-business-guide', '/ja/columns'],
  ])('maps %s to %s', (sourcePath, targetPath) => {
    expect(jaLanguageSwitchTarget(sourcePath)).toBe(targetPath);
  });
});
