import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const { getCurrentSiteMember } = vi.hoisted(() => ({
  getCurrentSiteMember: vi.fn(),
}));

vi.mock('@/lib/builder/members/current-member', () => ({
  getCurrentSiteMember,
}));

import MemberAccountPage from '../page';

describe('member account profile image rendering', () => {
  it('preserves arbitrary member-hosted URLs and the existing eager 64px summary contract', async () => {
    getCurrentSiteMember.mockResolvedValue({
      memberId: 'member-account-image-contract',
      email: 'member@example.com',
      name: 'Account Portrait',
      role: 'free',
      profilePhoto: 'https://member-images.example.com/account.jpg',
      createdAt: '2026-07-30T00:00:00.000Z',
      verified: true,
      blocked: false,
    });

    const page = await MemberAccountPage({ params: Promise.resolve({ locale: 'en' }) });
    const html = renderToStaticMarkup(page);

    expect(html).toContain('src="https://member-images.example.com/account.jpg"');
    expect(html).toContain('alt="Account Portrait"');
    expect(html).toContain('width="64"');
    expect(html).toContain('height="64"');
    expect(html).toContain('loading="eager"');
    expect(html).toContain('data-member-account-profile-photo="true"');
    expect(html).not.toContain('/_next/image?url=https%3A%2F%2Fmember-images.example.com');
  });
});
