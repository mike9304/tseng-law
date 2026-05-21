import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin', permission: 'edit-pages' })),
}));

const originalApiKey = process.env.OPENAI_API_KEY;
const originalModel = process.env.OPENAI_TEXT_ASSISTANT_MODEL;

function postRequest(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/ai-generator/text', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('/api/builder/ai-generator/text', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.OPENAI_API_KEY = 'test-openai-key';
    process.env.OPENAI_TEXT_ASSISTANT_MODEL = 'gpt-4o-mini';
  });

  afterEach(() => {
    if (originalApiKey === undefined) {
      delete process.env.OPENAI_API_KEY;
    } else {
      process.env.OPENAI_API_KEY = originalApiKey;
    }
    if (originalModel === undefined) {
      delete process.env.OPENAI_TEXT_ASSISTANT_MODEL;
    } else {
      process.env.OPENAI_TEXT_ASSISTANT_MODEL = originalModel;
    }
    vi.unstubAllGlobals();
  });

  it('returns the rewritten text from a rewrite action', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            choices: [{ message: { content: '간결하고 신뢰감 있는 새 카피' }, finish_reason: 'stop' }],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    );

    const { POST } = await import('../route');
    const response = await POST(
      postRequest({
        text: '이 텍스트는 길고 어색해서 더 자연스럽게 다듬어야 합니다.',
        action: 'rewrite',
        sourceLocale: 'ko',
      }),
    );

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload).toMatchObject({
      ok: true,
      action: 'rewrite',
      text: '간결하고 신뢰감 있는 새 카피',
      model: 'gpt-4o-mini',
    });

    const fetchMock = vi.mocked(globalThis.fetch);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('https://api.openai.com/v1/chat/completions');
    expect(init?.method).toBe('POST');
    const requestBody = JSON.parse((init?.body as string) ?? '{}');
    expect(requestBody.model).toBe('gpt-4o-mini');
    expect(requestBody.messages?.[0]?.role).toBe('system');
    expect(requestBody.messages?.[1]?.role).toBe('user');
    expect(requestBody.messages?.[1]?.content).toContain('Rewrite the source text');
  });

  it('rejects translate action without a target locale', async () => {
    const { POST } = await import('../route');
    const response = await POST(
      postRequest({
        text: 'Source text for translation',
        action: 'translate',
        sourceLocale: 'ko',
      }),
    );
    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.ok).toBe(false);
    expect(payload.error).toBe('invalid_text_assistant_request');
  });

  it('rejects tone action without a tone selection', async () => {
    const { POST } = await import('../route');
    const response = await POST(
      postRequest({
        text: 'Source text for tone change',
        action: 'tone',
        sourceLocale: 'ko',
      }),
    );
    expect(response.status).toBe(400);
    const payload = await response.json();
    expect(payload.ok).toBe(false);
    expect(payload.error).toBe('invalid_text_assistant_request');
  });

  it('returns 503 when the OpenAI key is missing', async () => {
    delete process.env.OPENAI_API_KEY;
    const { POST } = await import('../route');
    const response = await POST(
      postRequest({
        text: 'Source text',
        action: 'rewrite',
        sourceLocale: 'ko',
      }),
    );
    expect(response.status).toBe(503);
    const payload = await response.json();
    expect(payload.ok).toBe(false);
    expect(payload.error).toBe('missing_openai_api_key');
  });

  it('returns 502 when OpenAI returns empty content', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(JSON.stringify({ choices: [{ message: { content: '' } }] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
    const { POST } = await import('../route');
    const response = await POST(
      postRequest({
        text: 'Source text',
        action: 'rewrite',
        sourceLocale: 'ko',
      }),
    );
    expect(response.status).toBe(502);
    const payload = await response.json();
    expect(payload.error).toBe('missing_text_payload');
  });

  it('forwards translation target locale into the prompt', async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({ choices: [{ message: { content: 'Translated copy.' } }] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const { POST } = await import('../route');
    const response = await POST(
      postRequest({
        text: '이 텍스트는 번역되어야 합니다.',
        action: 'translate',
        sourceLocale: 'ko',
        targetLocale: 'en',
      }),
    );
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.text).toBe('Translated copy.');
    expect(payload.targetLocale).toBe('en');
    const requestBody = JSON.parse((fetchMock.mock.calls[0]?.[1] as RequestInit | undefined)?.body as string ?? '{}');
    expect(requestBody.messages?.[1]?.content).toContain('Translate the source text into English');
  });
});
