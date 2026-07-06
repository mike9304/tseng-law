import { describe, expect, it } from 'vitest';
import { invokeBuilderFunctionCode } from '@/lib/builder/dev/function-invoker';

describe('invokeBuilderFunctionCode', () => {
  it('runs code in the bounded worker context and captures logs', async () => {
    const persisted: string[] = [];
    const result = await invokeBuilderFunctionCode(
      'ctx.log("hello", { ok: true }); console.warn("warned"); return 2 + 2;',
      {
        onLog: (entry) => persisted.push(`${entry.level}:${entry.message}`),
        timeoutMs: 500,
      },
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.result).toBe(4);
    }
    expect(result.runtime).toBe('worker-vm');
    expect(result.logs.map((entry) => `${entry.level}:${entry.message}`)).toEqual([
      'log:hello {"ok":true}',
      'warn:warned',
    ]);
    expect(persisted).toEqual(['log:hello {"ok":true}', 'warn:warned']);
  });

  it('does not expose process or require to user code', async () => {
    const result = await invokeBuilderFunctionCode('return `${typeof process}:${typeof require}`;', {
      timeoutMs: 500,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.result).toBe('undefined:undefined');
    }
  });

  it('does not leak host process through injected log functions', async () => {
    const result = await invokeBuilderFunctionCode(
      [
        'const fromCtx = ctx.log.constructor.constructor(\'return typeof process === "undefined" ? "blocked" : process.versions.node\')();',
        'const fromConsole = console.warn.constructor.constructor(\'return typeof process === "undefined" ? "blocked" : process.versions.node\')();',
        'return `${fromCtx}:${fromConsole}`;',
      ].join('\n'),
      { timeoutMs: 500 },
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.result).toBe('blocked:blocked');
    }
  });

  it('terminates async work that exceeds the invocation timeout', async () => {
    const result = await invokeBuilderFunctionCode('await new Promise(() => {});', {
      timeoutMs: 100,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.timedOut).toBe(true);
      expect(result.error).toContain('100ms timeout');
    }
  });
});
