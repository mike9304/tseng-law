import { describe, expect, it } from 'vitest';
import { projectTeamBreadcrumbLabel } from '../team-breadcrumb-label';

describe('published team breadcrumb stock-label migration', () => {
  it.each([
    ['ko', '호정 한국·대만 업무팀', '호정 대만·한국 팀'],
    ['zh-hant', '昊鼎 韓國·台灣 業務團隊', '昊鼎韓國台灣團隊'],
  ] as const)('projects only the verified %s lawyers stock label', (locale, oldTitle, newTitle) => {
    expect(projectTeamBreadcrumbLabel(locale, 'lawyers', oldTitle)).toBe(newTitle);
    expect(projectTeamBreadcrumbLabel(locale, 'about', oldTitle)).toBe(oldTitle);
    expect(projectTeamBreadcrumbLabel(locale, 'lawyers/wei-tseng', oldTitle)).toBe(oldTitle);
    expect(projectTeamBreadcrumbLabel(locale, 'lawyers', `${oldTitle} custom`)).toBe(`${oldTitle} custom`);
    expect(projectTeamBreadcrumbLabel(locale, 'lawyers', newTitle)).toBe(newTitle);
  });

  it('preserves other locales and arbitrary publisher titles', () => {
    expect(projectTeamBreadcrumbLabel('en', 'lawyers', '호정 한국·대만 업무팀')).toBe('호정 한국·대만 업무팀');
    expect(projectTeamBreadcrumbLabel('ja', 'lawyers', 'Our selected team')).toBe('Our selected team');
    expect(projectTeamBreadcrumbLabel('ko', 'lawyers', '')).toBe('');
  });
});
