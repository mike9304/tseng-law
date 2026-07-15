import { describe, expect, it } from 'vitest';
import {
  parseAiImageEditSuccessResponse,
  readAiImageEditErrorMessage,
} from '../ImageEditDialog';

const SOURCE_URL = '/api/builder/assets/ko/source.png';

function validResponse() {
  return {
    ok: true,
    provider: 'openai',
    model: 'gpt-image-2',
    stub: false,
    operation: 'edit',
    dimensions: { width: 1536, height: 1024 },
    format: 'webp',
    mime: 'image/webp',
    auditState: 'attempted',
    asset: {
      url: '/api/builder/assets/ko/edited.webp',
      filename: 'edited.webp',
      contentType: 'image/webp',
    },
    source: {
      locale: 'ko',
      filename: 'source.png',
      url: SOURCE_URL,
      dimensions: { width: 2048, height: 1365 },
      format: 'png',
      mime: 'image/png',
    },
  };
}

function withoutTopLevel(key: string): Record<string, unknown> {
  const response: Record<string, unknown> = validResponse();
  delete response[key];
  return response;
}

function withoutNested(parent: 'dimensions' | 'asset' | 'source', key: string) {
  const response = validResponse();
  const nested: Record<string, unknown> = { ...response[parent] };
  delete nested[key];
  return { ...response, [parent]: nested };
}

function withoutSourceDimension(key: string) {
  const response = validResponse();
  const dimensions: Record<string, unknown> = { ...response.source.dimensions };
  delete dimensions[key];
  return { ...response, source: { ...response.source, dimensions } };
}

describe('AI image edit success response contract', () => {
  it('accepts the exact Image 2 edit provenance and WEBP asset contract', () => {
    const response = validResponse();
    const parsed = parseAiImageEditSuccessResponse(response, SOURCE_URL);

    expect(parsed).toEqual(response);
    expect(parsed).not.toBe(response);
    expect(Object.isFrozen(parsed)).toBe(true);
    expect(Object.isFrozen(parsed?.dimensions)).toBe(true);
    expect(Object.isFrozen(parsed?.asset)).toBe(true);
    expect(Object.isFrozen(parsed?.source)).toBe(true);
    expect(Object.isFrozen(parsed?.source.dimensions)).toBe(true);
  });

  it.each([
    { filename: 'source.png', format: 'png', mime: 'image/png' },
    { filename: 'source.jpg', format: 'jpeg', mime: 'image/jpeg' },
    { filename: 'source.webp', format: 'webp', mime: 'image/webp' },
  ])('accepts truthful $format source metadata', ({ filename, format, mime }) => {
    const sourceUrl = `/api/builder/assets/ko/${filename}`;
    const response = validResponse();
    response.source = { ...response.source, filename, url: sourceUrl, format, mime };

    expect(parseAiImageEditSuccessResponse(response, sourceUrl)).toEqual(response);
  });

  const invalidCases: Array<{ name: string; response: unknown }> = [
    { name: 'a non-object response', response: null },
    { name: 'an array response', response: [] },
    { name: 'missing ok', response: withoutTopLevel('ok') },
    { name: 'non-success ok', response: { ...validResponse(), ok: false } },
    { name: 'missing provider', response: withoutTopLevel('provider') },
    { name: 'a mismatched provider', response: { ...validResponse(), provider: 'internal' } },
    { name: 'missing model', response: withoutTopLevel('model') },
    { name: 'a mismatched model', response: { ...validResponse(), model: 'gpt-image-1' } },
    { name: 'missing stub state', response: withoutTopLevel('stub') },
    { name: 'a stubbed result', response: { ...validResponse(), stub: true } },
    { name: 'missing operation', response: withoutTopLevel('operation') },
    { name: 'a mismatched operation', response: { ...validResponse(), operation: 'generate' } },
    { name: 'missing dimensions', response: withoutTopLevel('dimensions') },
    { name: 'missing dimensions width', response: withoutNested('dimensions', 'width') },
    {
      name: 'a non-positive dimensions width',
      response: { ...validResponse(), dimensions: { width: 0, height: 1024 } },
    },
    {
      name: 'an unexpected positive dimensions width',
      response: { ...validResponse(), dimensions: { width: 1, height: 1024 } },
    },
    { name: 'missing dimensions height', response: withoutNested('dimensions', 'height') },
    {
      name: 'a fractional dimensions height',
      response: { ...validResponse(), dimensions: { width: 1536, height: 1024.5 } },
    },
    {
      name: 'an unexpected positive dimensions height',
      response: { ...validResponse(), dimensions: { width: 1536, height: 1 } },
    },
    { name: 'missing format', response: withoutTopLevel('format') },
    { name: 'a mismatched format', response: { ...validResponse(), format: 'png' } },
    { name: 'missing MIME', response: withoutTopLevel('mime') },
    { name: 'a mismatched MIME', response: { ...validResponse(), mime: 'image/png' } },
    { name: 'missing audit state', response: withoutTopLevel('auditState') },
    {
      name: 'a mismatched audit state',
      response: { ...validResponse(), auditState: 'confirmed' },
    },
    { name: 'missing asset', response: withoutTopLevel('asset') },
    { name: 'missing asset URL', response: withoutNested('asset', 'url') },
    {
      name: 'an empty asset URL',
      response: { ...validResponse(), asset: { ...validResponse().asset, url: ' ' } },
    },
    { name: 'missing asset filename', response: withoutNested('asset', 'filename') },
    {
      name: 'an empty asset filename',
      response: { ...validResponse(), asset: { ...validResponse().asset, filename: '' } },
    },
    {
      name: 'an asset filename containing a path separator',
      response: {
        ...validResponse(),
        asset: {
          ...validResponse().asset,
          filename: 'folder/edited.webp',
          url: '/api/builder/assets/ko/folder/edited.webp',
        },
      },
    },
    {
      name: 'an asset filename containing a query delimiter',
      response: {
        ...validResponse(),
        asset: {
          ...validResponse().asset,
          filename: 'edited.webp?download=1',
          url: '/api/builder/assets/ko/edited.webp?download=1',
        },
      },
    },
    {
      name: 'an asset filename extension inconsistent with WEBP output',
      response: {
        ...validResponse(),
        asset: {
          ...validResponse().asset,
          filename: 'edited.png',
          url: '/api/builder/assets/ko/edited.png',
        },
      },
    },
    {
      name: 'an extensionless asset filename equal to the output format',
      response: {
        ...validResponse(),
        asset: {
          ...validResponse().asset,
          filename: 'webp',
          url: '/api/builder/assets/ko/webp',
        },
      },
    },
    { name: 'missing asset content type', response: withoutNested('asset', 'contentType') },
    {
      name: 'a mismatched asset content type',
      response: { ...validResponse(), asset: { ...validResponse().asset, contentType: 'image/png' } },
    },
    {
      name: 'an external asset URL',
      response: { ...validResponse(), asset: { ...validResponse().asset, url: 'https://example.test/edited.webp' } },
    },
    {
      name: 'an asset URL for a different locale',
      response: { ...validResponse(), asset: { ...validResponse().asset, url: '/api/builder/assets/en/edited.webp' } },
    },
    {
      name: 'an asset URL whose basename differs from its filename',
      response: { ...validResponse(), asset: { ...validResponse().asset, url: '/api/builder/assets/ko/other.webp' } },
    },
    { name: 'missing source', response: withoutTopLevel('source') },
    { name: 'missing source URL', response: withoutNested('source', 'url') },
    {
      name: 'a source URL for a different asset',
      response: { ...validResponse(), source: { ...validResponse().source, url: '/api/builder/assets/ko/other.png' } },
    },
    { name: 'missing source locale', response: withoutNested('source', 'locale') },
    {
      name: 'a source locale inconsistent with its URL',
      response: { ...validResponse(), source: { ...validResponse().source, locale: 'en' } },
    },
    { name: 'missing source filename', response: withoutNested('source', 'filename') },
    {
      name: 'a source filename inconsistent with its URL',
      response: { ...validResponse(), source: { ...validResponse().source, filename: 'other.png' } },
    },
    { name: 'missing source dimensions', response: withoutNested('source', 'dimensions') },
    { name: 'missing source dimensions width', response: withoutSourceDimension('width') },
    {
      name: 'a non-positive source dimensions width',
      response: {
        ...validResponse(),
        source: { ...validResponse().source, dimensions: { width: 0, height: 1365 } },
      },
    },
    { name: 'missing source dimensions height', response: withoutSourceDimension('height') },
    {
      name: 'a fractional source dimensions height',
      response: {
        ...validResponse(),
        source: { ...validResponse().source, dimensions: { width: 2048, height: 1365.5 } },
      },
    },
    { name: 'missing source format', response: withoutNested('source', 'format') },
    {
      name: 'an unsupported source format',
      response: { ...validResponse(), source: { ...validResponse().source, format: 'gif' } },
    },
    { name: 'missing source MIME', response: withoutNested('source', 'mime') },
    {
      name: 'source metadata with a mismatched format and MIME pair',
      response: { ...validResponse(), source: { ...validResponse().source, mime: 'image/jpeg' } },
    },
    {
      name: 'a source filename extension inconsistent with its inspected format',
      response: {
        ...validResponse(),
        source: { ...validResponse().source, format: 'jpeg', mime: 'image/jpeg' },
      },
    },
  ];

  it.each(invalidCases)('rejects $name', ({ response }) => {
    expect(parseAiImageEditSuccessResponse(response, SOURCE_URL)).toBeNull();
  });

  it('fails closed when a plain-looking response accessor throws', () => {
    const response = Object.defineProperty(validResponse(), 'provider', {
      enumerable: true,
      get() {
        throw new Error('untrusted getter');
      },
    });

    expect(() => parseAiImageEditSuccessResponse(response, SOURCE_URL)).not.toThrow();
    expect(parseAiImageEditSuccessResponse(response, SOURCE_URL)).toBeNull();
  });

  it.each([
    'https://example.test/source.png',
    '/api/builder/assets/ko/',
    '/api/builder/assets/ko/source.png?download=1',
    '/api/builder/assets/ko/source.png#preview',
    '/api/builder/assets//ko/source.png',
    '/api/builder/assets/fr/source.png',
    '/api/builder/assets/ko?x/source.png',
    '/api/builder/assets/ko/../source.png',
    '/api/builder/assets/ko/./source.png',
    '/api/builder/assets/ko/source%2Ffake.png',
    '/api/builder/assets/ko/%73ource.png',
  ])('rejects a noncanonical expected source URL: %s', (sourceUrl) => {
    expect(parseAiImageEditSuccessResponse(validResponse(), sourceUrl)).toBeNull();
  });

  it('rejects extensionless source metadata even when its filename equals its format', () => {
    const sourceUrl = '/api/builder/assets/ko/png';
    const response = validResponse();
    response.source = {
      ...response.source,
      filename: 'png',
      url: sourceUrl,
    };

    expect(parseAiImageEditSuccessResponse(response, sourceUrl)).toBeNull();
  });

  it.each([
    { name: 'a secret-bearing message', payload: { message: 'OPENAI_API_KEY=sk-secret-value' } },
    { name: 'an absolute path error', payload: { error: '/Users/son7/private/.env' } },
    { name: 'a provider diagnostic', payload: { message: 'Provider rejected request: trace-123' } },
    { name: 'an internal error code', payload: { message: '', error: 'provider_internal_trace' } },
    { name: 'blank server strings', payload: { message: '\t', error: '  ' } },
    { name: 'a non-object body', payload: null },
  ])('uses only the generic localized failure for $name', ({ payload }) => {
    expect(readAiImageEditErrorMessage(payload, 'Image edit failed')).toBe('Image edit failed');
  });
});
