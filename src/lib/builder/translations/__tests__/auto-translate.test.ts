import { describe, expect, it, vi } from 'vitest';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import {
  autoTranslateNodes,
  extractTranslatableNodes,
} from '@/lib/builder/translations/auto-translate';

function seedCanvas(): BuilderCanvasDocument {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-05-20T00:00:00.000Z',
    updatedBy: 'sandbox-builder',
    stageWidth: 1280,
    stageHeight: 880,
    nodes: [
      {
        id: 'h1',
        kind: 'heading',
        rect: { x: 0, y: 0, width: 200, height: 60 },
        style: {} as never,
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: { text: '안녕', level: 1 } as never,
      },
      {
        id: 't1',
        kind: 'text',
        rect: { x: 0, y: 0, width: 200, height: 60 },
        style: {} as never,
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: { text: '본문 내용' } as never,
      },
      {
        id: 'b1',
        kind: 'button',
        rect: { x: 0, y: 0, width: 200, height: 40 },
        style: {} as never,
        zIndex: 2,
        rotation: 0,
        locked: false,
        visible: true,
        content: { label: '연락', href: '/contact', style: 'primary' } as never,
      },
      {
        id: 'd1',
        kind: 'divider',
        rect: { x: 0, y: 0, width: 200, height: 4 },
        style: {} as never,
        zIndex: 3,
        rotation: 0,
        locked: false,
        visible: true,
        content: {} as never,
      },
      {
        id: 'i-empty',
        kind: 'image',
        rect: { x: 0, y: 0, width: 100, height: 100 },
        style: {} as never,
        zIndex: 4,
        rotation: 0,
        locked: false,
        visible: true,
        content: { src: '/x.png', alt: '', fit: 'cover' } as never,
      },
    ] as never,
  };
}

describe('extractTranslatableNodes', () => {
  it('picks up text/heading/button nodes and skips empty/non-text kinds', () => {
    const sources = extractTranslatableNodes(seedCanvas());
    const ids = sources.map((source) => source.nodeId).sort();
    expect(ids).toEqual(['b1', 'h1', 't1']);
    expect(sources.find((s) => s.nodeId === 'b1')?.text).toBe('연락');
  });
});

describe('autoTranslateNodes', () => {
  it('refuses when source and target locales match', async () => {
    const result = await autoTranslateNodes(
      [{ nodeId: 'a', text: 'x' }],
      'ko',
      'ko',
      { fetchImpl: vi.fn() as never },
    );
    expect(result.ok).toBe(false);
    expect(result.errors[0].error).toBe('sourceLocale_eq_targetLocale');
  });

  it('returns proposals from the upstream text endpoint', async () => {
    const fetchImpl = vi.fn(async (_url: RequestInfo | URL, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body ?? '{}')) as { text?: string };
      return new Response(
        JSON.stringify({ ok: true, text: `EN(${body.text ?? ''})` }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      );
    });
    const result = await autoTranslateNodes(
      [
        { nodeId: 'h1', text: '안녕' },
        { nodeId: 'b1', text: '연락' },
      ],
      'ko',
      'en',
      { fetchImpl: fetchImpl as never, concurrency: 2 },
    );
    expect(result.ok).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.proposals.map((p) => p.nodeId).sort()).toEqual(['b1', 'h1']);
    const proposal = result.proposals.find((p) => p.nodeId === 'h1');
    expect(proposal?.text).toBe('EN(안녕)');
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('records individual node failures without throwing', async () => {
    let call = 0;
    const fetchImpl = vi.fn(async () => {
      call += 1;
      if (call === 1) {
        return new Response(
          JSON.stringify({ ok: false, error: 'rate_limit', message: 'slow down' }),
          { status: 429, headers: { 'content-type': 'application/json' } },
        );
      }
      return new Response(
        JSON.stringify({ ok: true, text: 'ok' }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      );
    });
    const result = await autoTranslateNodes(
      [
        { nodeId: 'h1', text: 'a' },
        { nodeId: 'h2', text: 'b' },
      ],
      'ko',
      'en',
      { fetchImpl: fetchImpl as never, concurrency: 1 },
    );
    expect(result.ok).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.proposals).toHaveLength(1);
    expect(result.errors[0].nodeId).toBe('h1');
  });
});