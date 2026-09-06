import { describe, expect, it } from 'vitest';
import { readBoundedJson } from '@/lib/ai-intake/http';

function streamRequest(chunks: Uint8Array[], headers?: HeadersInit): Request {
  return new Request('http://localhost/api/ai/intake/preview', {
    method: 'POST',
    headers,
    body: new ReadableStream({
      start(controller) {
        for (const chunk of chunks) controller.enqueue(chunk);
        controller.close();
      },
    }),
    duplex: 'half',
  } as RequestInit);
}

const encoder = new TextEncoder();

describe('readBoundedJson', () => {
  it('accepts valid JSON at the exact byte boundary', async () => {
    const payload = '{"ok":true}';
    const bytes = encoder.encode(payload);
    const result = await readBoundedJson(streamRequest([bytes], {
      'content-length': String(bytes.byteLength),
    }), bytes.byteLength);
    expect(result).toEqual({ ok: true, value: { ok: true } });
  });

  it('rejects boundary+1 without buffering the extra payload', async () => {
    const payload = '{"ok":true}';
    const bytes = encoder.encode(payload);
    const result = await readBoundedJson(streamRequest([bytes]), bytes.byteLength - 1);
    expect(result).toEqual({ ok: false, reason: 'too_large' });
  });

  it('rejects multibyte UTF-8 that exceeds the byte limit', async () => {
    const payload = '{"x":"한한"}';
    const bytes = encoder.encode(payload);
    expect(bytes.byteLength).toBeGreaterThan([...payload].length);
    const result = await readBoundedJson(streamRequest([bytes]), [...payload].length);
    expect(result).toEqual({ ok: false, reason: 'too_large' });
  });

  it('rejects content-length-free chunked bodies that exceed the limit', async () => {
    const first = encoder.encode('{"a":"');
    const second = encoder.encode(`${'x'.repeat(40)}"}`);
    const result = await readBoundedJson(streamRequest([first, second]), 20);
    expect(result).toEqual({ ok: false, reason: 'too_large' });
  });

  it('rejects malformed UTF-8 as invalid_json', async () => {
    const result = await readBoundedJson(streamRequest([new Uint8Array([0x7b, 0xff, 0x7d])]), 32);
    expect(result).toEqual({ ok: false, reason: 'invalid_json' });
  });

  it('rejects an empty body as invalid_json', async () => {
    const empty = await readBoundedJson(streamRequest([]), 32);
    expect(empty).toEqual({ ok: false, reason: 'invalid_json' });
    const spaces = await readBoundedJson(streamRequest([encoder.encode('   ')]), 32);
    expect(spaces).toEqual({ ok: false, reason: 'invalid_json' });
  });

  it('honors a valid oversized Content-Length early and still rejects a lying small Content-Length', async () => {
    const early = await readBoundedJson(streamRequest([encoder.encode('{}')], {
      'content-length': '100',
    }), 10);
    expect(early).toEqual({ ok: false, reason: 'too_large' });

    const lying = encoder.encode(`{"x":"${'a'.repeat(40)}"}`);
    const counted = await readBoundedJson(streamRequest([lying], {
      'content-length': '2',
    }), 16);
    expect(counted).toEqual({ ok: false, reason: 'too_large' });
  });
});
