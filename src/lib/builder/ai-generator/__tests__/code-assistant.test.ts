import { describe, expect, it } from 'vitest';
import {
  applySelectedDiffHunks,
  buildCodeAssistantPrompt,
  buildUnifiedDiffResult,
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

  it('accepts canvas-friendly code block languages', () => {
    expect(codeAssistantSchema.parse({ code: '<div />', action: 'explain', language: 'html' }).language).toBe('html');
    expect(codeAssistantSchema.parse({ code: '.x{color:red}', action: 'comment', language: 'css' }).language).toBe('css');
    expect(codeAssistantSchema.parse({ code: '{"ok":true}', action: 'fix', language: 'json' }).language).toBe('json');
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

  it('uses canvas-oriented guidance for non-Node code snippets', () => {
    const parsed = codeAssistantSchema.parse({
      code: '<section>Hello</section>',
      action: 'comment',
      language: 'html',
      context: 'This lives in a canvas codeBlock node.',
    });
    const prompt = buildCodeAssistantPrompt(parsed);
    expect(prompt.systemPrompt).toContain('builder canvas or editor');
    expect(prompt.systemPrompt).toContain('HTML');
    expect(prompt.userPrompt).toContain('canvas codeBlock node');
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

  it('returns a focused unified diff with context when changed', () => {
    const diff = buildUnifiedDiff('a\nb', 'a\nc', 'fn.ts');
    expect(diff).toContain('--- a/fn.ts');
    expect(diff).toContain('+++ b/fn.ts');
    expect(diff).toContain('-b');
    expect(diff).toContain('+c');
    expect(diff).toContain(' a');
    expect(diff).not.toContain('-a');
    expect(diff).not.toContain('+a');
  });

  it('splits distant changes into separate semantic hunks', () => {
    const before = Array.from({ length: 12 }, (_, index) => `line ${index + 1}`);
    const after = [...before];
    after[1] = 'changed 2';
    after[9] = 'changed 10';

    const diff = buildUnifiedDiff(before.join('\n'), after.join('\n'), 'fn.ts');
    expect(diff.match(/^@@/gm)).toHaveLength(2);
    expect(diff).toContain('-line 2');
    expect(diff).toContain('+changed 2');
    expect(diff).toContain('-line 10');
    expect(diff).toContain('+changed 10');
  });

  it('does not emit a phantom deletion for empty input', () => {
    const diff = buildUnifiedDiff('', 'return true;', 'fn.ts');
    expect(diff).toContain('@@ -0,0 +1,1 @@');
    expect(diff).toContain('+return true;');
    expect(diff).not.toContain('-\n');
  });

  it('returns structured hunks for chunk-level review', () => {
    const before = Array.from({ length: 12 }, (_, index) => `line ${index + 1}`);
    const after = [...before];
    after[1] = 'changed 2';
    after[9] = 'changed 10';

    const result = buildUnifiedDiffResult(before.join('\n'), after.join('\n'), 'fn.ts');
    expect(result.text.match(/^@@/gm)).toHaveLength(2);
    expect(result.hunks).toHaveLength(2);
    expect(result.hunks[0].lines.some((line) => line.type === 'delete' && line.text === 'line 2')).toBe(true);
    expect(result.hunks[1].lines.some((line) => line.type === 'insert' && line.text === 'changed 10')).toBe(true);
  });
});

describe('applySelectedDiffHunks', () => {
  it('applies only the selected semantic hunk', () => {
    const before = Array.from({ length: 12 }, (_, index) => `line ${index + 1}`);
    const after = [...before];
    after[1] = 'changed 2';
    after[9] = 'changed 10';
    const result = buildUnifiedDiffResult(before.join('\n'), after.join('\n'), 'fn.ts');

    const patched = applySelectedDiffHunks(before.join('\n'), result.hunks, [result.hunks[1].id]);
    expect(patched).not.toBeNull();
    expect(patched?.split('\n')[1]).toBe('line 2');
    expect(patched?.split('\n')[9]).toBe('changed 10');
  });

  it('rejects a selected hunk when the current source no longer matches', () => {
    const result = buildUnifiedDiffResult('return 1;', 'return 2;', 'fn.ts');
    expect(applySelectedDiffHunks('return 3;', result.hunks, [result.hunks[0].id])).toBeNull();
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
