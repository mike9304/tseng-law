import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  attorneyProfiles,
  primaryAttorneySlug,
} from '@/data/attorney-profiles';
import { teamContent } from '@/data/team-members';

const canonicalImage = '/images/team/wei-tseng-official.png';
const canonicalProfileUrl = 'https://www.wei-wei-lawyer.com/lawyertseng';
const legacyProfileUrl = 'https://www.wei-wei-lawyer.com/about-8';
const officialPortraitHash =
  '51101195cf46edf4292c61651a52b5d549aa45f8198e1c198012a51d87a8d568';

const profiles = [
  attorneyProfiles.ko[primaryAttorneySlug],
  attorneyProfiles['zh-hant'][primaryAttorneySlug],
  attorneyProfiles.en[primaryAttorneySlug],
  attorneyProfiles.ja[primaryAttorneySlug],
];

const primaryTeamMembers = [
  teamContent.ko.members.find((member) => member.id === 'tseng-junwei'),
  teamContent['zh-hant'].members.find((member) => member.id === 'tseng-junwei'),
  teamContent.en.members.find((member) => member.id === 'tseng-junwei'),
];

describe('canonical attorney identity', () => {
  it('uses the official locale-specific names and alternate names', () => {
    expect(attorneyProfiles.ko[primaryAttorneySlug]).toMatchObject({
      name: '증준외 변호사',
      alternateNames: ['증준외', '曾雋崴', 'Wei Tseng', 'Attorney Wei Tseng'],
    });
    expect(attorneyProfiles['zh-hant'][primaryAttorneySlug]).toMatchObject({
      name: '曾雋崴律師',
      alternateNames: ['曾雋崴', '증준외', 'Wei Tseng', 'Attorney Wei Tseng'],
    });
    expect(attorneyProfiles.en[primaryAttorneySlug]).toMatchObject({
      name: 'Attorney Wei Tseng',
      alternateNames: ['Wei Tseng', '증준외', '曾雋崴'],
    });
    expect(attorneyProfiles.ja[primaryAttorneySlug]).toMatchObject({
      name: '曾雋崴弁護士',
      alternateNames: ['曾雋崴', '증준외', 'Wei Tseng', 'Attorney Wei Tseng'],
    });
  });

  it('contains neither the incorrect Chinese name nor masculine English pronouns', () => {
    expect(JSON.stringify(attorneyProfiles)).not.toContain('曾俊瑋');
    expect(JSON.stringify(attorneyProfiles.en[primaryAttorneySlug])).not.toMatch(
      /\b(?:He|His|Him)\b/,
    );
  });

  it('uses the official portrait for all canonical profiles and team records', () => {
    for (const profile of profiles) {
      expect(profile.image).toBe(canonicalImage);
    }

    for (const member of primaryTeamMembers) {
      expect(member).toBeDefined();
      expect(member?.photo).toBe(canonicalImage);
    }
  });

  it('uses the canonical personal profile URL and removes the redirect URL', () => {
    for (const profile of profiles) {
      expect(profile.sameAs).toContain(canonicalProfileUrl);
      expect(profile.sameAs).not.toContain(legacyProfileUrl);
      expect(profile.externalProfiles.some(({ href }) => href === canonicalProfileUrl)).toBe(true);
      expect(profile.externalProfiles.some(({ href }) => href === legacyProfileUrl)).toBe(false);
    }

    for (const member of primaryTeamMembers) {
      expect(member?.sourceUrl).toBe(canonicalProfileUrl);
    }
  });

  it('matches the verified official portrait SHA-256', () => {
    const portrait = readFileSync(
      join(process.cwd(), 'public/images/team/wei-tseng-official.png'),
    );

    expect(createHash('sha256').update(portrait).digest('hex')).toBe(
      officialPortraitHash,
    );
  });

  it('preserves the internal team ID and public profile slug', () => {
    expect(primaryAttorneySlug).toBe('wei-tseng');

    for (const member of primaryTeamMembers) {
      expect(member).toMatchObject({
        id: 'tseng-junwei',
        profileSlug: 'wei-tseng',
      });
    }
  });
});
