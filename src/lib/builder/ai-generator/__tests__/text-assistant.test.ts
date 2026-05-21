import { describe, expect, it } from 'vitest';
import {
  buildTextAssistantPrompt,
  describeTextAssistantAction,
  textAssistantSchema,
} from '@/lib/builder/ai-generator/text-assistant';

describe('text-assistant prompt builder', () => {
  it('builds a rewrite prompt that quotes the source text and stays in source locale', () => {
    const parsed = textAssistantSchema.parse({
      text: '간결하고 신뢰감 있는 카피로 다듬어 주세요.',
      action: 'rewrite',
      sourceLocale: 'ko',
    });
    const prompt = buildTextAssistantPrompt(parsed);
    expect(prompt.systemPrompt).toContain('Korean');
    expect(prompt.userPrompt).toContain('Rewrite the source text');
    expect(prompt.userPrompt).toContain('간결하고 신뢰감 있는');
  });

  it('routes translate action to the explicit target locale label', () => {
    const parsed = textAssistantSchema.parse({
      text: 'Source copy',
      action: 'translate',
      sourceLocale: 'ko',
      targetLocale: 'zh-hant',
    });
    const prompt = buildTextAssistantPrompt(parsed);
    expect(prompt.userPrompt).toContain('Traditional Chinese');
    expect(prompt.systemPrompt).toContain('Traditional Chinese');
  });

  it('routes tone action with a recognizable tone descriptor', () => {
    const parsed = textAssistantSchema.parse({
      text: '이 문장을 톤만 바꿔주세요.',
      action: 'tone',
      sourceLocale: 'ko',
      tone: 'persuasive',
    });
    const prompt = buildTextAssistantPrompt(parsed);
    expect(prompt.userPrompt).toContain('persuasive and confident');
  });

  it('rejects translate action without targetLocale', () => {
    const result = textAssistantSchema.safeParse({
      text: 'Source copy',
      action: 'translate',
      sourceLocale: 'ko',
    });
    expect(result.success).toBe(false);
  });

  it('rejects tone action without tone selection', () => {
    const result = textAssistantSchema.safeParse({
      text: 'Source copy',
      action: 'tone',
      sourceLocale: 'ko',
    });
    expect(result.success).toBe(false);
  });

  it('describeTextAssistantAction returns concise labels per action', () => {
    expect(describeTextAssistantAction({ action: 'rewrite' })).toBe('Rewrite');
    expect(describeTextAssistantAction({ action: 'expand' })).toBe('Expand');
    expect(describeTextAssistantAction({ action: 'shorten' })).toBe('Shorten');
    expect(describeTextAssistantAction({ action: 'translate', targetLocale: 'en' })).toContain('English');
    expect(describeTextAssistantAction({ action: 'tone', tone: 'concise' })).toContain('concise');
  });

  it('forwards element/site/brand hints into the system prompt when provided', () => {
    const parsed = textAssistantSchema.parse({
      text: 'Hero headline copy.',
      action: 'shorten',
      sourceLocale: 'en',
      siteName: 'Tseng Law',
      brandTone: 'precise, calm, expert',
      elementHint: 'hero headline',
    });
    const prompt = buildTextAssistantPrompt(parsed);
    expect(prompt.systemPrompt).toContain('Tseng Law');
    expect(prompt.systemPrompt).toContain('precise, calm, expert');
    expect(prompt.systemPrompt).toContain('hero headline');
  });
});
