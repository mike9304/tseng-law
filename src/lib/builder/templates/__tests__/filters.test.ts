import { describe, expect, it } from 'vitest';

import {
  matchesTemplateSearch,
  normalizeTemplateSearchQuery,
  scoreTemplateSearch,
} from '@/lib/builder/templates/filters';
import { getAllTemplates } from '@/lib/builder/templates/registry';

const templates = getAllTemplates();

function getTemplate(id: string) {
  const template = templates.find((item) => item.id === id);
  if (!template) throw new Error(`Missing template fixture: ${id}`);
  return template;
}

describe('template search filters', () => {
  it('normalizes whitespace and Korean casing consistently', () => {
    expect(normalizeTemplateSearchQuery('  AI 디자인 전문 사이트  ')).toBe('ai 디자인 전문 사이트');
  });

  it('matches Korean page-type aliases across the template catalog', () => {
    expect(matchesTemplateSearch(getTemplate('law-home'), '홈페이지')).toBe(true);
    expect(matchesTemplateSearch(getTemplate('law-services'), '주요업무')).toBe(true);
    expect(matchesTemplateSearch(getTemplate('travel-blog'), '칼럼 아카이브')).toBe(true);
    expect(matchesTemplateSearch(getTemplate('dental-booking'), '예약하기')).toBe(true);
  });

  it('matches common industry aliases users expect from external template sites', () => {
    expect(matchesTemplateSearch(getTemplate('ecommerce-home'), '쇼핑몰')).toBe(true);
    expect(matchesTemplateSearch(getTemplate('travel-home'), '여행사')).toBe(true);
    expect(matchesTemplateSearch(getTemplate('dental-home'), '치과')).toBe(true);
    expect(matchesTemplateSearch(getTemplate('pet-services'), '동물병원')).toBe(true);
  });

  it('scores direct and alias matches above unrelated templates', () => {
    expect(scoreTemplateSearch(getTemplate('travel-home'), '홈페이지')).toBeGreaterThan(
      scoreTemplateSearch(getTemplate('travel-contact'), '홈페이지'),
    );
    expect(scoreTemplateSearch(getTemplate('law-home'), '법률')).toBeGreaterThan(
      scoreTemplateSearch(getTemplate('travel-home'), '법률'),
    );
  });

  it('matches template-market phrasing without needing exact template names', () => {
    expect(matchesTemplateSearch(getTemplate('law-home'), 'AI 디자인 전문 사이트')).toBe(true);
    expect(matchesTemplateSearch(getTemplate('law-home'), '템플릿 있는 사이트')).toBe(true);
  });
});
