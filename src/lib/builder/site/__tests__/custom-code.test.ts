import { describe, expect, it } from 'vitest';
import {
  CUSTOM_CODE_MAX_LENGTH,
  validateCustomCode,
  validateSiteCustomCode,
} from '@/lib/builder/site/custom-code';

describe('validateCustomCode', () => {
  it('returns empty result for nullish input', () => {
    expect(validateCustomCode(undefined)).toEqual({ sanitized: '', warnings: [], oversized: false });
    expect(validateCustomCode(null)).toEqual({ sanitized: '', warnings: [], oversized: false });
  });

  it('passes safe HTML through unchanged', () => {
    const safe = '<meta name="custom" content="x">';
    const result = validateCustomCode(safe);
    expect(result.sanitized).toBe(safe);
    expect(result.warnings).toEqual([]);
    expect(result.oversized).toBe(false);
  });

  it('strips insecure http script src and warns', () => {
    const input = '<script src="http://evil.example.com/x.js"></script><div>ok</div>';
    const result = validateCustomCode(input);
    expect(result.sanitized).toBe('<div>ok</div>');
    expect(result.warnings).toEqual([
      expect.objectContaining({ code: 'insecure_script_src' }),
    ]);
  });

  it('strips iframe tags and warns', () => {
    const input = '<iframe src="https://x.example.com"></iframe>after';
    const result = validateCustomCode(input);
    expect(result.sanitized).toBe('after');
    expect(result.warnings.some((w) => w.code === 'iframe_blocked')).toBe(true);
  });

  it('warns on eval() but does not strip', () => {
    const input = 'function go(){ eval("alert(1)") }';
    const result = validateCustomCode(input);
    expect(result.sanitized).toBe(input);
    expect(result.warnings).toEqual([
      expect.objectContaining({ code: 'eval_warning' }),
    ]);
  });

  it('flags oversized input and returns it unchanged', () => {
    const long = 'a'.repeat(CUSTOM_CODE_MAX_LENGTH + 1);
    const result = validateCustomCode(long);
    expect(result.oversized).toBe(true);
    expect(result.sanitized).toBe(long);
    expect(result.warnings.some((w) => w.code === 'too_long')).toBe(true);
  });

  it('accumulates multiple warnings on a mixed payload', () => {
    const input = '<script src="http://a/x.js"></script><iframe></iframe>eval(1)';
    const result = validateCustomCode(input);
    expect(result.sanitized).toBe('eval(1)');
    const codes = result.warnings.map((w) => w.code).sort();
    expect(codes).toEqual(['eval_warning', 'iframe_blocked', 'insecure_script_src'].sort());
  });
});

describe('validateSiteCustomCode', () => {
  it('aggregates per-slot warnings with slot tag', () => {
    const result = validateSiteCustomCode({
      siteHead: '<iframe></iframe>',
      siteBodyStart: 'console.log(1)',
      siteBodyEnd: '<script src="http://a/x.js"></script>',
    });
    expect(result.oversized).toBe(false);
    expect(result.values.siteHead).toBeUndefined();
    expect(result.values.siteBodyEnd).toBeUndefined();
    expect(result.warnings.some((w) => w.slot === 'siteHead' && w.code === 'iframe_blocked')).toBe(true);
    expect(result.warnings.some((w) => w.slot === 'siteBodyEnd' && w.code === 'insecure_script_src')).toBe(true);
  });

  it('returns empty values when no slots provided', () => {
    const result = validateSiteCustomCode({});
    expect(result.values).toEqual({});
    expect(result.warnings).toEqual([]);
    expect(result.oversized).toBe(false);
  });

  it('marks oversized when any slot exceeds the cap', () => {
    const result = validateSiteCustomCode({ siteHead: 'x'.repeat(CUSTOM_CODE_MAX_LENGTH + 5) });
    expect(result.oversized).toBe(true);
  });
});