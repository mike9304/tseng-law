import { describe, expect, it } from 'vitest';
import { attorneyProfiles } from '@/data/attorney-profiles';

describe('English attorney profile internal links (P1-5③)', () => {
  it('includes the Taiwan litigation lawyer landing with the query-shaped anchor', () => {
    expect(attorneyProfiles.en['wei-tseng'].internalLinks).toContainEqual({
      label: 'Taiwan Litigation Lawyer Guide',
      href: '/en/taiwan-litigation-lawyer',
    });
  });
});
