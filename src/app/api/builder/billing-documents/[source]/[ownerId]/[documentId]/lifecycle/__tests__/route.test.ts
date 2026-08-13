import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  parseBillingDocumentSource,
  supersedeBuilderBillingDocument,
  voidBuilderBillingDocument,
} from '@/lib/builder/billing-documents';
import { guardMutation } from '@/lib/builder/security/guard';
import { POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({
    username: 'admin',
    permission: 'manage-commerce',
  })),
}));

vi.mock('@/lib/builder/billing-documents', () => ({
  parseBillingDocumentSource: vi.fn((source: string) => (
    source === 'order' || source === 'booking' ? source : null
  )),
  supersedeBuilderBillingDocument: vi.fn(async () => ({ document: null, supersededDocument: null })),
  voidBuilderBillingDocument: vi.fn(async () => null),
}));

const guardMutationMock = vi.mocked(guardMutation);
const parseBillingDocumentSourceMock = vi.mocked(parseBillingDocumentSource);
const supersedeBuilderBillingDocumentMock = vi.mocked(supersedeBuilderBillingDocument);
const voidBuilderBillingDocumentMock = vi.mocked(voidBuilderBillingDocument);

function postRequest(source = 'order', query = '', body: unknown = { action: 'void' }): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/billing-documents/${source}/owner-1/doc-1/lifecycle${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('builder billing document lifecycle API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({
      username: 'admin',
      permission: 'manage-commerce',
    } as never);
    parseBillingDocumentSourceMock.mockImplementation((source) => (
      source === 'order' || source === 'booking' ? source as never : null
    ));
    supersedeBuilderBillingDocumentMock.mockResolvedValue({ document: null, supersededDocument: null } as never);
    voidBuilderBillingDocumentMock.mockResolvedValue(null);
  });

  it('returns 403 and short-circuits lifecycle stores when permission is denied', async () => {
    const deniedRequest = postRequest('order', 'locale=en');
    guardMutationMock.mockResolvedValueOnce(
      NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 }) as never,
    );

    const response = await POST(deniedRequest, {
      params: Promise.resolve({ source: 'order', ownerId: 'owner-1', documentId: 'doc-1' }),
    });

    expect(response.status).toBe(403);
    expect(guardMutationMock).toHaveBeenCalledWith(deniedRequest, {
      bucket: 'mutation',
      permission: 'manage-commerce',
    });
    expect(voidBuilderBillingDocumentMock).not.toHaveBeenCalled();
    expect(supersedeBuilderBillingDocumentMock).not.toHaveBeenCalled();
  });

  it('returns localized source errors', async () => {
    const response = await POST(postRequest('bad', 'locale=zh-hant'), {
      params: Promise.resolve({ source: 'bad', ownerId: 'owner-1', documentId: 'doc-1' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '不支援的帳單文件來源。',
      errorCode: 'invalid_document_source',
    });
    expect(voidBuilderBillingDocumentMock).not.toHaveBeenCalled();
    expect(supersedeBuilderBillingDocumentMock).not.toHaveBeenCalled();
  });

  it('returns localized validation errors for invalid lifecycle payloads', async () => {
    const response = await POST(postRequest('order', 'locale=ko', { action: 'archive' }), {
      params: Promise.resolve({ source: 'order', ownerId: 'owner-1', documentId: 'doc-1' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '문서 상태 변경 요청 정보를 확인해 주세요.',
      errorCode: 'invalid_document_lifecycle_payload',
    });
    expect(payload.issues).toBeDefined();
    expect(voidBuilderBillingDocumentMock).not.toHaveBeenCalled();
  });

  it('returns localized unavailable errors when a document cannot be voided', async () => {
    const response = await POST(postRequest('order', 'locale=zh-hant', {
      action: 'void',
      reason: 'duplicate',
    }), {
      params: Promise.resolve({ source: 'order', ownerId: 'owner-1', documentId: 'doc-1' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '此文件無法變更狀態。',
      errorCode: 'document_lifecycle_unavailable',
    });
  });

  it('returns localized unavailable errors when a document cannot be superseded', async () => {
    const response = await POST(postRequest('order', 'locale=en', {
      action: 'supersede',
      notes: 'correct total',
    }), {
      params: Promise.resolve({ source: 'order', ownerId: 'owner-1', documentId: 'doc-1' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: 'This document cannot change status.',
      errorCode: 'document_lifecycle_unavailable',
    });
  });

  it('returns localized lifecycle failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    voidBuilderBillingDocumentMock.mockRejectedValueOnce(new Error('lifecycle secret leaked'));

    const response = await POST(postRequest('order', 'locale=ko', { action: 'void' }), {
      params: Promise.resolve({ source: 'order', ownerId: 'owner-1', documentId: 'doc-1' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '문서 상태 변경에 실패했습니다.',
      errorCode: 'document_lifecycle_failed',
    });
    expect(payload.error).not.toContain('lifecycle secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/billing-documents/lifecycle] POST failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('voids and supersedes documents while preserving success response shapes', async () => {
    const voided = { documentId: 'doc-1', status: 'voided' };
    const replacement = { documentId: 'doc-2', status: 'issued' };
    const superseded = { documentId: 'doc-1', status: 'superseded' };
    voidBuilderBillingDocumentMock.mockResolvedValueOnce(voided as never);
    supersedeBuilderBillingDocumentMock.mockResolvedValueOnce({
      document: replacement,
      supersededDocument: superseded,
    } as never);

    const voidResponse = await POST(postRequest('order', 'locale=en', {
      action: 'void',
      reason: 'duplicate',
    }), {
      params: Promise.resolve({ source: 'order', ownerId: 'owner-1', documentId: 'doc-1' }),
    });
    const voidPayload = await voidResponse.json();
    const supersedeResponse = await POST(postRequest('booking', 'locale=en', {
      action: 'supersede',
      notes: 'correct service',
      reason: 'reissued',
    }), {
      params: Promise.resolve({ source: 'booking', ownerId: 'owner-1', documentId: 'doc-1' }),
    });
    const supersedePayload = await supersedeResponse.json();

    expect(voidResponse.status).toBe(200);
    expect(voidPayload).toEqual({ ok: true, document: voided });
    expect(guardMutationMock).toHaveBeenCalledWith(expect.any(NextRequest), {
      bucket: 'mutation',
      permission: 'manage-commerce',
    });
    expect(voidBuilderBillingDocumentMock).toHaveBeenCalledWith('order', 'owner-1', 'doc-1', {
      reason: 'duplicate',
    });
    expect(supersedeResponse.status).toBe(200);
    expect(supersedePayload).toEqual({
      ok: true,
      document: replacement,
      supersededDocument: superseded,
    });
    expect(supersedeBuilderBillingDocumentMock).toHaveBeenCalledWith('booking', 'owner-1', 'doc-1', {
      notes: 'correct service',
      reason: 'reissued',
    });
  });
});
