import { describe, expect, it } from 'vitest';

import { jaLanguageSwitchTarget } from '@/lib/public-route-policy';

describe('Japanese service-detail language switch policy', () => {
  it.each([
    ['/services', '/ja/services'],
    ['/services/investment', '/ja/services/investment'],
    ['/services/civil', '/ja/services/civil'],
    ['/services/family', '/ja/services/family'],
    ['/services/labor', '/ja/services/labor'],
    ['/services/criminal', '/ja/services/criminal'],
    ['/services/ip', '/ja/services/ip'],
    ['/columns/taiwan-company-establishment-basics', '/ja/columns/taiwan-company-establishment-basics'],
    ['/lawyers/wei-tseng', '/ja/lawyers/wei-tseng'],
    // Dedicated JA-served routes must keep the same page (crawlable inbound link).
    ['/taiwan-lawyer', '/ja/taiwan-lawyer'],
    ['/taiwan-company-setup-lawyer', '/ja/taiwan-company-setup-lawyer'],
    ['/taiwan-litigation-lawyer', '/ja/taiwan-litigation-lawyer'],
    ['/korean-lawyer-in-taiwan', '/ja/korean-lawyer-in-taiwan'],
    ['/guides/taiwan-company-setup', '/ja/guides/taiwan-company-setup'],
    ['/store/products/taiwan-business-guide', '/ja/columns'],
  ])('maps %s to %s', (sourcePath, targetPath) => {
    expect(jaLanguageSwitchTarget(sourcePath)).toBe(targetPath);
  });
});
