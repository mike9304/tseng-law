import { afterEach, describe, expect, it, vi } from 'vitest';
import { INDEXNOW_ENDPOINT, INDEXNOW_HOST, INDEXNOW_KEY, submitIndexNow } from '@/lib/indexnow';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('submitIndexNow', () => {
  it('posts the exact host/key/keyLocation/urlList payload', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const urls = ['https://tseng-law.com/ko', 'https://tseng-law.com/en'];
    const result = await submitIndexNow(urls);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [calledUrl, init] = fetchMock.mock.calls[0];
    expect(calledUrl).toBe(INDEXNOW_ENDPOINT);
    expect(init.method).toBe('POST');
    expect(init.headers).toEqual({ 'Content-Type': 'application/json; charset=utf-8' });

    const body = JSON.parse(init.body as string);
    expect(body).toEqual({
      host: INDEXNOW_HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    });

    expect(result).toEqual({ ok: true, status: 200, submitted: 2 });
  });

  it('returns ok:true, submitted:0 without calling fetch when urls is empty', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const result = await submitIndexNow([]);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toEqual({ ok: true, submitted: 0 });
  });

  it('never throws when fetch rejects, and returns ok:false with an error message', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('network down'));
    vi.stubGlobal('fetch', fetchMock);

    const result = await submitIndexNow(['https://tseng-law.com/ko']);

    expect(result.ok).toBe(false);
    expect(result.submitted).toBe(0);
    expect(result.error).toContain('network down');
  });

  it('returns ok:false with the response status on a non-2xx response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 422 }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await submitIndexNow(['https://tseng-law.com/ko']);

    expect(result).toEqual({ ok: false, status: 422, submitted: 0 });
  });
});
