import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import type { SiteLocale } from '@/lib/locales';
import {
  ATTORNEY_PERSON_ID,
  buildLegalServiceJsonLd,
  buildProfilePageJsonLd,
} from '@/lib/seo';
import { LawyersLegacyPageBody } from '../legacy-page-bodies';

function renderTeamPerson(locale: SiteLocale) {
  const html = renderToStaticMarkup(
    <LawyersLegacyPageBody
      locale={locale}
      visibleBlockIds={['attorney-profiles.list.seo']}
    />,
  );
  const graphs = Array.from(
    html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g),
    (match) => JSON.parse(match[1]) as Record<string, unknown>,
  );
  const person = graphs.find((graph) => graph['@type'] === 'Person');
  expect(person).toBeDefined();
  return { html, person: person! };
}

describe('Lawyers team structured-data identity', () => {
  it('uses the English profile and employee identity for the rendered team Person', () => {
    const profile = getAttorneyProfile('en', primaryAttorneySlug)!;
    const { html, person } = renderTeamPerson('en');
    const profileGraph = buildProfilePageJsonLd({
      locale: 'en',
      path: `/en/lawyers/${profile.slug}`,
      name: profile.name,
      alternateName: profile.alternateNames,
      description: profile.description,
      image: profile.image,
      email: profile.email,
      jobTitle: profile.role,
      sameAs: profile.sameAs,
      knowsLanguage: profile.languages,
      knowsAbout: profile.practiceAreas,
      alumniOf: profile.education,
    });
    const employee = buildLegalServiceJsonLd('en').employee;

    expect(person['@id']).toBe('https://tseng-law.com/en/lawyers/wei-tseng#person');
    expect(person['@id']).toBe(employee['@id']);
    expect(person['@id']).toBe(profileGraph.mainEntity['@id']);
    expect(person.name).toBe(profile.name);
    expect(person.url).toBe(profileGraph.mainEntity.url);
    expect(person.url).toBe(employee.url);
    expect(html).not.toContain(ATTORNEY_PERSON_ID);
  });

  it.each(['ko', 'zh-hant', 'ja'] as const)(
    'preserves the shared standalone Person identity for %s',
    (locale) => {
      const { person } = renderTeamPerson(locale);
      const profile = getAttorneyProfile(locale, primaryAttorneySlug)!;
      expect(person['@id']).toBe(ATTORNEY_PERSON_ID);
      expect(person.name).toBe(profile.name);
      expect(person.url).toBe(`https://tseng-law.com/${locale}/lawyers/${profile.slug}`);
    },
  );
});
