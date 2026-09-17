import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

type FunctionProbe = {
  readonly calls: unknown[][];
  restore(): void;
};

function isZodFunctionProbeOrCompile(args: unknown[]): boolean {
  if (args.length === 1 && args[0] === '') return true;
  const body = args[args.length - 1];
  return typeof body === 'string' && body.includes('\n');
}

function installFunctionProbe(): FunctionProbe {
  const OriginalFunction = globalThis.Function;
  const calls: unknown[][] = [];
  globalThis.Function = new Proxy(OriginalFunction, {
    apply(target, thisArg, argArray) {
      calls.push([...argArray]);
      return Reflect.apply(target, thisArg, argArray);
    },
    construct(target, argArray, newTarget) {
      calls.push([...argArray]);
      return Reflect.construct(target, argArray, newTarget);
    },
  });
  return {
    calls,
    restore() {
      globalThis.Function = OriginalFunction;
    },
  };
}

function restoreJitless(previous: boolean | undefined): void {
  const config = z.config() as { jitless?: boolean };
  if (previous === undefined) {
    delete config.jitless;
    return;
  }
  config.jitless = previous;
}

describe('instrumentation-client Zod jitless startup hook', () => {
  let previousJitless: boolean | undefined;
  let probe: FunctionProbe | undefined;

  beforeEach(() => {
    previousJitless = z.config().jitless;
    vi.resetModules();
  });

  afterEach(() => {
    probe?.restore();
    probe = undefined;
    restoreJitless(previousJitless);
  });

  it('sets jitless before link and inquiry object schemas construct, without Function probe/compile', async () => {
    probe = installFunctionProbe();

    await import('@/instrumentation-client');
    expect(z.config().jitless).toBe(true);

    const { linkValueSchema } = await import('@/lib/builder/links');
    const { inquiryLanguageSchema } = await import('@/lib/consultation/intake-language-contract');

    expect(probe.calls.filter(isZodFunctionProbeOrCompile)).toEqual([]);

    expect(linkValueSchema.safeParse({ href: '/about' }).success).toBe(true);
    expect(linkValueSchema.safeParse({ href: 'https://example.com' }).success).toBe(true);
    expect(linkValueSchema.safeParse({ href: 'javascript:alert(1)' }).success).toBe(false);
    expect(linkValueSchema.safeParse({ href: 'data:text/html,<h1>x</h1>' }).success).toBe(false);
    expect(linkValueSchema.safeParse({ href: '//evil.com' }).success).toBe(false);

    expect(inquiryLanguageSchema.safeParse({
      uiLocale: 'ko',
      originalLanguage: 'Korean',
      preferredConsultationLanguage: 'ko',
      originalText: '상담을 요청합니다',
      consent: true,
    }).success).toBe(true);
    expect(inquiryLanguageSchema.safeParse({
      uiLocale: 'ko',
      originalLanguage: 'Korean',
      preferredConsultationLanguage: 'ko',
      originalText: '   ',
      consent: true,
    }).success).toBe(false);

    expect(probe.calls.filter(isZodFunctionProbeOrCompile)).toEqual([]);
  });
});
