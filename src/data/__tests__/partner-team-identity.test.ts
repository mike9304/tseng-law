import { describe, expect, it } from 'vitest';
import { guidanceContent } from '@/data/international-guidance-content';
import { guidanceTeamCopy } from '@/data/international-guidance-team';
import { TEAM_NAME_BY_LOCALE } from '@/data/team-name';
import { GUIDANCE_LOCALES_4 } from '@/lib/public-guidance';
import { buildGuidancePersonJsonLd } from '@/lib/guidance-structured-data';

describe('partner and named-team identity across guidance languages', () => {
  it.each(GUIDANCE_LOCALES_4)('%s keeps the page, roster and search identity consistent', (locale) => {
    const page = guidanceContent[locale].pages.lawyers;
    const roster = guidanceTeamCopy[locale];
    expect(page.title).toBe(TEAM_NAME_BY_LOCALE[locale]);
    expect(roster.title).toBe(page.title);
    expect(page.description).toBe(roster.description);
    expect(roster.title).toMatch(/Wei Tseng|曾雋崴/);
    expect(buildGuidancePersonJsonLd(locale)?.jobTitle).toBe(roster.roles['tseng-junwei']);
    expect(JSON.stringify(roster)).not.toMatch(/Managing Attorney|主任律师|主持律師/);
  });

  it('keeps Croatian and Serbian wording separate despite their former identical title', () => {
    expect(guidanceContent.hr.pages.lawyers.title).toBe('Odvjetnica Wei Tseng i njezin tim');
    expect(guidanceContent.sr.pages.lawyers.title).toBe('Advokatkinja Wei Tseng i njen tim');
  });
});
