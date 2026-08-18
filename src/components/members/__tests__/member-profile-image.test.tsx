import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { PublicSiteMember } from '@/lib/builder/members/members-engine';
import MemberProfileClient from '../MemberProfileClient';

const member: PublicSiteMember = {
  memberId: 'member-image-contract',
  email: 'member@example.com',
  name: 'Member Portrait',
  role: 'free',
  profilePhoto: 'https://member-images.example.com/portrait.jpg',
  createdAt: '2026-07-30T00:00:00.000Z',
  verified: true,
  blocked: false,
};

describe('member profile image rendering', () => {
  it('preserves arbitrary member-hosted URLs and the existing eager 72px portrait contract', () => {
    const html = renderToStaticMarkup(
      <MemberProfileClient member={member} locale="en" />,
    );

    expect(html).toContain('src="https://member-images.example.com/portrait.jpg"');
    expect(html).toContain('alt="Member Portrait"');
    expect(html).toContain('width="72"');
    expect(html).toContain('height="72"');
    expect(html).toContain('loading="eager"');
    expect(html).toContain('data-member-profile-photo-preview="true"');
    expect(html).not.toContain('/_next/image?url=https%3A%2F%2Fmember-images.example.com');
  });
});
