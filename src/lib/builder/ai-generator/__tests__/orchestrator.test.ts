import { afterEach, describe, expect, it } from 'vitest';
import {
  AI_GENERATOR_BLUEPRINT_VERSION,
  AI_GENERATOR_CONTENT_VERSION,
  AI_GENERATOR_PROMPT_CHANGELOG,
  AI_GENERATOR_PROMPT_VERSION,
  generateSiteDraft,
} from '@/lib/builder/ai-generator/orchestrator';
import { siteSpecSchema } from '@/lib/builder/ai-generator/site-spec';
import { selectBlueprint } from '@/lib/builder/ai-generator/template-selector';

describe('AI site generator', () => {
  afterEach(() => {
    delete process.env.OPENAI_API_KEY;
  });

  it('falls back to deterministic stub content when no LLM key is configured', async () => {
    const draft = await generateSiteDraft({
      industry: 'law',
      companyName: '호정국제법률사무소',
      slogan: '대만 진출 전문',
      tone: 'professional',
      colorPreference: 'cool',
      locale: 'ko',
    });
    expect(draft.spec.companyName).toBe('호정국제법률사무소');
    // Slogan takes precedence in the hero headline; without a slogan the headline
    // would include the company name.
    expect(draft.content.hero.headline).toBe('대만 진출 전문');
    expect(draft.content.sections.length).toBeGreaterThanOrEqual(4);
    expect(draft.palette.primary).toMatch(/^#/);
    expect(draft.promptVersion).toBe(AI_GENERATOR_PROMPT_VERSION);
    expect(draft.blueprintVersion).toBe(AI_GENERATOR_BLUEPRINT_VERSION);
    expect(draft.contentVersion).toBe(AI_GENERATOR_CONTENT_VERSION);
    expect(draft.promptChangelog[0]).toMatchObject({
      version: AI_GENERATOR_PROMPT_VERSION,
      label: 'Responsive draft review',
    });
    expect(draft.promptChangelog.length).toBeGreaterThanOrEqual(2);
  });

  it('stamps a selected supported prompt version on the generated draft', async () => {
    const rollbackVersion = AI_GENERATOR_PROMPT_CHANGELOG[1].version;
    const draft = await generateSiteDraft({
      industry: 'law',
      companyName: '호정국제법률사무소',
      tone: 'professional',
      colorPreference: 'cool',
      locale: 'ko',
    }, { promptVersion: rollbackVersion });
    expect(draft.promptVersion).toBe(rollbackVersion);
    expect(draft.promptChangelog.map((entry) => entry.version)).toContain(rollbackVersion);
  });

  it('uses prompt version behavior to change responsive visual guidance', async () => {
    const rollbackVersion = AI_GENERATOR_PROMPT_CHANGELOG[1].version;
    const spec = {
      industry: 'law',
      companyName: '호정국제법률사무소',
      tone: 'professional',
      colorPreference: 'cool',
      locale: 'ko',
    } as const;
    const current = await generateSiteDraft(spec, { promptVersion: AI_GENERATOR_PROMPT_VERSION });
    const rollback = await generateSiteDraft(spec, { promptVersion: rollbackVersion });

    expect(current.plan.visualBrief.treatment).toContain('responsive breakpoint review');
    expect(current.plan.visualBrief.imagePrompt).toContain('Responsive breakpoint review');
    expect(rollback.plan.visualBrief.treatment).not.toContain('responsive breakpoint review');
    expect(current.plan.visualBrief.treatment).not.toBe(rollback.plan.visualBrief.treatment);
  });

  it('uses company name in headline when no slogan provided', async () => {
    const draft = await generateSiteDraft({
      industry: 'law',
      companyName: '호정국제법률사무소',
      tone: 'professional',
      colorPreference: 'cool',
      locale: 'ko',
    });
    expect(draft.content.hero.headline).toContain('호정국제법률사무소');
  });

  it('selects different sections per industry', () => {
    const law = selectBlueprint('law', 'professional');
    const cafe = selectBlueprint('cafe', 'friendly');
    expect(law.sections).toContain('expertise');
    expect(law.sections).toContain('team');
    expect(cafe.sections).toContain('gallery');
    expect(cafe.sections).not.toContain('expertise');
  });

  it('returns a default blueprint for unmapped industries', () => {
    const blueprint = selectBlueprint('manufacturing', 'professional');
    expect(blueprint.sections).toContain('hero');
    expect(blueprint.sections).toContain('contact');
  });

  it('produces palette swatches for every supported color preference', async () => {
    const draft = await generateSiteDraft({
      industry: 'law',
      companyName: 'X',
      tone: 'professional',
      colorPreference: 'pastel',
      locale: 'en',
    });
    expect(draft.palette.primary).toMatch(/^#/);
    expect(draft.palette.background).toMatch(/^#/);
  });

  it('accepts only builder image asset ids for selected hero assets', () => {
    expect(siteSpecSchema.safeParse({
      industry: 'law',
      companyName: '호정국제법률사무소',
      heroImageAsset: {
        assetId: 'builder/assets/ko/uploaded-office-hero.webp',
        filename: 'uploaded-office-hero.webp',
      },
      tone: 'professional',
      colorPreference: 'cool',
      locale: 'ko',
    }).success).toBe(true);

    expect(siteSpecSchema.safeParse({
      industry: 'law',
      companyName: '호정국제법률사무소',
      heroImageAsset: {
        assetId: 'https://example.com/uploaded-office-hero.webp',
        filename: 'uploaded-office-hero.webp',
      },
      tone: 'professional',
      colorPreference: 'cool',
      locale: 'ko',
    }).success).toBe(false);
  });

  it('turns the expanded prompt brief into a sitemap and content plan', async () => {
    const draft = await generateSiteDraft({
      industry: 'law',
      companyName: '호정국제법률사무소',
      audience: '대만 진출을 준비하는 한국 기업',
      goals: ['상담 문의 증가', '칼럼 검색 유입 확보'],
      desiredPages: ['홈', '업무분야', '칼럼', '문의'],
      brandKeywords: ['대만 법률', '한국어 상담'],
      constraints: '모바일 CTA를 우선 노출',
      visualDirection: '타이베이 야경과 인물 없는 전문 상담 장면',
      tone: 'authoritative',
      colorPreference: 'cool',
      locale: 'ko',
    });

    expect(draft.plan.sitemap.map((page) => page.slug)).toEqual(['/', '/services', '/columns', '/contact']);
    expect(draft.plan.brandBrief.audience).toBe('대만 진출을 준비하는 한국 기업');
    expect(draft.plan.brandBrief.goals).toContain('칼럼 검색 유입 확보');
    expect(draft.plan.brandBrief.keywords).toContain('대만 법률');
    expect(draft.plan.brandBrief.constraints).toBe('모바일 CTA를 우선 노출');
    expect(draft.plan.visualBrief.direction).toBe('타이베이 야경과 인물 없는 전문 상담 장면');
    expect(draft.plan.visualBrief.imagePrompt).toContain('No readable text');
    expect(draft.plan.visualBrief.treatment).toContain('documentary-style');
    expect(draft.plan.contentPlan[0]).toMatchObject({
      sectionId: 'hero',
      intent: expect.stringContaining('포지셔닝'),
    });
  });
});
