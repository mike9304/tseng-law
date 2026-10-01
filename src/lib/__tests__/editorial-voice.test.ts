import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { EDITORIAL_VOICE } from '../editorial-voice.generated';
import { buildPrompt, buildBatchPrompt } from '../builder/translations/providers/openai-prompts';
import { buildTextAssistantPrompt, textAssistantSchema } from '../builder/ai-generator/text-assistant';

describe('editorial rules reach AI providers', () => {
  it('ships the complete portable policy without drift', () => {
    expect(EDITORIAL_VOICE).toBe(readFileSync('docs/columns/EDITORIAL-VOICE.md', 'utf8'));
  });
  it('includes the full policy in single and batch translation requests', () => {
    expect(buildPrompt('ko', 'en', '원문')).toContain(EDITORIAL_VOICE);
    expect(buildBatchPrompt('ko', 'en', [{ key: 'title', sourceText: '원문' }])).toContain(EDITORIAL_VOICE);
  });
  it('includes the full policy for rewrite, expansion, shortening, translation and tone', () => {
    for (const action of ['rewrite', 'expand', 'shorten', 'translate', 'tone'] as const) {
      const input = textAssistantSchema.parse({ action, text: '원문', targetLocale: 'en', tone: 'formal' });
      expect(buildTextAssistantPrompt(input).systemPrompt, action).toContain(EDITORIAL_VOICE);
    }
  });
  it('makes the column no-bold rule an exception to translation formatting preservation', () => {
    const source = '**기한**과 <strong>신청 자격</strong>';
    const prompts = [
      buildPrompt('ko', 'en', source),
      buildBatchPrompt('ko', 'en', [{ key: 'body', sourceText: source }]),
      buildTextAssistantPrompt(textAssistantSchema.parse({ action: 'translate', text: source, targetLocale: 'en' })).userPrompt,
    ];
    for (const prompt of prompts) {
      expect(prompt).toContain('except decorative bold wrappers in column content');
      expect(prompt).toContain('preserving their text and links');
      expect(prompt).toContain('Preserve literal symbols in code and source quotations');
    }
    expect(EDITORIAL_VOICE).toContain('칼럼의 굵은 강조 금지 (2026-10-01 사용자 지시)');
  });
});
