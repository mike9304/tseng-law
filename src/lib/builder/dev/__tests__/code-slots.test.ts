import { describe, expect, it, beforeEach } from 'vitest';
import { clearLogs, listLogs, resetDevLogsMemory } from '@/lib/builder/dev/logs-store';
import {
  createBuilderFunction,
  saveBuilderFunctions,
} from '@/lib/builder/dev/functions-model';
import {
  parseCanvasCodeSlotRunPayload,
  runCanvasCodeSlot,
} from '@/lib/builder/dev/code-slots';

describe('canvas code slot runner', () => {
  beforeEach(async () => {
    clearLogs('function');
    await saveBuilderFunctions([]);
  });

  it('runs executable canvas code blocks and records their logs', async () => {
    const parsed = parseCanvasCodeSlotRunPayload({
      title: 'Canvas score slot',
      language: 'js',
      code: 'ctx.log("canvas slot ran"); return { score: 42 };',
    });

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) throw new Error(parsed.error);

    const result = await runCanvasCodeSlot(parsed.payload);

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect(result.result).toEqual({ score: 42 });
    expect(result.logs).toHaveLength(1);
    expect(result.logs[0]?.message).toBe('canvas slot ran');
    const stored = listLogs('function');
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({
      level: 'log',
      message: 'canvas slot ran',
      reference: 'canvas-code-block:Canvas score slot',
    });

    resetDevLogsMemory();
    expect(listLogs('function', { reference: 'canvas-code-block:Canvas score slot' })[0])
      .toMatchObject({
        message: 'canvas slot ran',
        reference: 'canvas-code-block:Canvas score slot',
      });
  });

  it('rejects non-executable display-only code block languages', () => {
    const parsed = parseCanvasCodeSlotRunPayload({
      title: 'HTML snippet',
      language: 'html',
      code: '<div>not a function body</div>',
    });

    expect(parsed).toMatchObject({
      ok: false,
      errorCode: 'unsupported_language',
      status: 400,
    });
  });

  it('runs stored builder functions from canvas code slot bindings', async () => {
    const fn = createBuilderFunction({
      name: 'Stored slot',
      slug: 'stored-slot',
      code: 'ctx.log("stored slot ran"); return { source: "stored-function" };',
    });
    await saveBuilderFunctions([fn]);

    const parsed = parseCanvasCodeSlotRunPayload({
      mode: 'function',
      title: 'Function canvas slot',
      functionSlug: fn.slug,
    });

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) throw new Error(parsed.error);

    const result = await runCanvasCodeSlot(parsed.payload);

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.error);
    expect(result.result).toEqual({ source: 'stored-function' });
    expect(result.logs[0]?.message).toBe('stored slot ran');
    expect(listLogs('function')[0]).toMatchObject({
      level: 'log',
      message: 'stored slot ran',
      reference: 'canvas-code-block:Function canvas slot:function:stored-slot',
    });
  });

  it('returns a typed error when a canvas slot references a missing function', async () => {
    const parsed = parseCanvasCodeSlotRunPayload({
      mode: 'function',
      title: 'Missing function slot',
      functionSlug: 'missing-slot',
    });

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) throw new Error(parsed.error);

    const result = await runCanvasCodeSlot(parsed.payload);

    expect(result).toMatchObject({
      ok: false,
      status: 404,
      errorCode: 'function_not_found',
      error: 'Function not found',
    });
  });
});
