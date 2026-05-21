import { describe, expect, it } from 'vitest';
import {
  buildCodeAssistantPrompt,
  buildUnifiedDiff,
  codeAssistantResponseSchema,
  codeAssistantSchema,
  describeCodeAction,
  CODE_ASSISTANT_ACTIONS,
} from '@/lib/builder/ai-generator/code-assistant';

describe('code-assistant schema', () => {
  it('accepts a minimal explain payload defaulting language to ts', () => {
    const parsed = codeAssistantSchema.parse({
      code: 'return 1 + 1;',
      action: 'explain',
    });
    expect(parsed.language).toBe('ts');
    expect(parsed.action).toBe('explain');
  });

  it('rejects empty code and over-length code', () => {
    expect(codeAssistantSchema.safeParse({ code: '', action: 'explain' }).success).toBe(false);
    const big = 'a'.repeat(20_001);
    expect(codeAssistantSchema.safeParse({ code: big, action: 'explain' }).success).toBe(false);
  });

  it('lists exactly the documented actions', () => {
    expect(CODE_ASSISTANT_ACTIONS).toEqual(['explain', 'fix', 'optimize', 'comment']);
  });
});

describe('code-assistant prompt builder', () => {
  it('embeds the source code in fenced triple quotes', () => {
    const parsed = codeAssistantSchema.parse({
      code: 'function noop(){ return null }',
      action: 'explain',
      language: 'js',
    });
    const prompt = buildCodeAssistantPrompt(parsed);
    expect(prompt.userPrompt).toContain('function noop()');
    expect(prompt.systemPrompt).toContain('JavaScript');
    expect(prompt.systemPrompt).toContain('JSON');
  });

  it('switches directive per action', () => {
    const base = { code: 'x', language: 'ts' as const };
    expect(
      buildCodeAssistantPrompt(codeAssistantSchema.parse({ ...base, action: 'explain' })).userPrompt,
    ).toContain('Explain what the given code does');
    expect(
      buildCodeAssistantPrompt(codeAssistantSchema.parse({ ...base, action: 'fix' })).userPrompt,
    ).toContain('Identify any bugs');
    expect(
      buildCodeAssistantPrompt(codeAssistantSchema.parse({ ...base, action: 'optimize' })).userPrompt,
    ).toContain('optimized version');
    expect(
      buildCodeAssistantPrompt(codeAssistantSchema.parse({ ...base, action: 'comment' })).userPrompt,
    ).toContain('Add explanatory comments');
  });

  it('forwards editor context into the user prompt when provided', () => {
    const parsed = codeAssistantSchema.parse({
      code: 'return ctx.now;',
      action: 'fix',
      language: 'ts',
      context: 'This function powers /api/builder/dev/functions/now/invoke',
    });
    const prompt = buildCodeAssistantPrompt(parsed);
    expect(prompt.userPrompt).toContain('Editor context');
    expect(prompt.userPrompt).toContain('/api/builder/dev/functions/now/invoke');
  });

  it('always asks for JSON response shape', () => {
    const parsed = codeAssistantSchema.parse({
      code: 'noop()',
      action: 'comment',
    });
    const prompt = buildCodeAssistantPrompt(parsed);
    expect(prompt.systemPrompt).toContain('"explanation"');
    expect(prompt.systemPrompt).toContain('"fixedCode"');
  });
});

describe('code-assistant response schema', () => {
  it('accepts explanation-only response', () => {
    const result = codeAssistantResponseSchema.safeParse({
      explanation: 'This returns the sum of two literals.',
      fixedCode: null,
    });
    expect(result.success).toBe(true);
  });

  it('accepts explanation + fixedCode', () => {
    const result = codeAssistantResponseSchema.safeParse({
      explanation: 'Renamed variable, removed unused import.',
      fixedCode: 'export default function() { return 2; }',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty explanation', () => {
    const result = codeAssistantResponseSchema.safeParse({ explanation: '', fixedCode: null });
    expect(result.success).toBe(false);
  });
});

describe('buildUnifiedDiff', () => {
  it('returns empty string when before equals after', () => {
    expect(buildUnifiedDiff('a\nb', 'a\nb')).toBe('');
  });

  it('returns a unified diff with header and +/- lines when changed', () => {
    const diff = buildUnifiedDiff('a\nb', 'a\nc', 'fn.ts');
    expect(diff).toContain('--- a/fn.ts');
    expect(diff).toContain('+++ b/fn.ts');
    expect(diff).toContain('-a');
    expect(diff).toContain('-b');
    expect(diff).toContain('+a');
    expect(diff).toContain('+c');
  });
});

describe('describeCodeAction', () => {
  it('returns a stable label for each action', () => {
    expect(describeCodeAction('explain')).toBe('Explain');
    expect(describeCodeAction('fix')).toBe('Fix bugs');
    expect(describeCodeAction('optimize')).toBe('Optimize');
    expect(describeCodeAction('comment')).toBe('Add comments');
  });
});