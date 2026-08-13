import { NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { userHasPermission } from '@/lib/builder/security/resolve-permission';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { listOrders } from '@/lib/builder/commerce/orders-engine';
import { listBillingDocuments } from '@/lib/builder/billing-documents';
import { loadBillingDocumentAutomationSettings } from '@/lib/builder/billing-document-automation';
import { listBillingDocumentWebhookEvents } from '@/lib/builder/billing-document-webhooks';
import CommerceOrdersPage from '@/app/(builder)/[locale]/admin-builder/commerce/orders/page';
import CommerceBillingDocumentsPage from '@/app/(builder)/[locale]/admin-builder/commerce/documents/page';

vi.mock('next/headers', () => ({
  headers: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

vi.mock('@/lib/builder/columns/auth', () => ({
  requireBuilderAdminAuth: vi.fn(),
}));

vi.mock('@/lib/builder/security/resolve-permission', () => ({
  userHasPermission: vi.fn(),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
}));

vi.mock('@/lib/builder/commerce/orders-engine', () => ({
  listOrders: vi.fn(),
}));

vi.mock('@/lib/builder/billing-documents', () => ({
  listBillingDocuments: vi.fn(),
}));

vi.mock('@/lib/builder/billing-document-automation', () => ({
  loadBillingDocumentAutomationSettings: vi.fn(),
}));

vi.mock('@/lib/builder/billing-document-webhooks', () => ({
  listBillingDocumentWebhookEvents: vi.fn(),
}));

vi.mock('@/components/builder/commerce/OrderManagerClient', () => ({
  default: () => null,
}));

vi.mock('@/components/builder/commerce/BillingDocumentsClient', () => ({
  default: () => null,
}));

const headersMock = vi.mocked(headers);
const notFoundMock = vi.mocked(notFound);
const requireBuilderAdminAuthMock = vi.mocked(requireBuilderAdminAuth);
const userHasPermissionMock = vi.mocked(userHasPermission);
const readSiteDocumentMock = vi.mocked(readSiteDocument);
const listOrdersMock = vi.mocked(listOrders);
const listBillingDocumentsMock = vi.mocked(listBillingDocuments);
const loadBillingDocumentAutomationSettingsMock = vi.mocked(loadBillingDocumentAutomationSettings);
const listBillingDocumentWebhookEventsMock = vi.mocked(listBillingDocumentWebhookEvents);

describe('commerce admin deep-link permissions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    headersMock.mockResolvedValue(new Headers({
      authorization: 'Basic deep-link-request',
      cookie: 'builder_admin_session=deep-link-session',
    }) as Awaited<ReturnType<typeof headers>>);
    userHasPermissionMock.mockResolvedValue(false);
  });

  it('rejects an editor opening the orders page before any order or site read', async () => {
    requireBuilderAdminAuthMock.mockReturnValueOnce({ username: 'editor' });

    await expect(CommerceOrdersPage({
      params: Promise.resolve({ locale: 'en' }),
    })).rejects.toThrow('NEXT_NOT_FOUND');

    expect(userHasPermissionMock).toHaveBeenCalledWith('editor', 'view-commerce');
    expect(notFoundMock).toHaveBeenCalledTimes(1);
    expect(readSiteDocumentMock).not.toHaveBeenCalled();
    expect(listOrdersMock).not.toHaveBeenCalled();
  });

  it('rejects a designer opening billing documents before any billing data read', async () => {
    requireBuilderAdminAuthMock.mockReturnValueOnce({ username: 'designer' });

    await expect(CommerceBillingDocumentsPage({
      params: Promise.resolve({ locale: 'en' }),
    })).rejects.toThrow('NEXT_NOT_FOUND');

    expect(userHasPermissionMock).toHaveBeenCalledWith('designer', 'view-commerce');
    expect(notFoundMock).toHaveBeenCalledTimes(1);
    expect(readSiteDocumentMock).not.toHaveBeenCalled();
    expect(listBillingDocumentsMock).not.toHaveBeenCalled();
    expect(loadBillingDocumentAutomationSettingsMock).not.toHaveBeenCalled();
    expect(listBillingDocumentWebhookEventsMock).not.toHaveBeenCalled();
  });

  it('keeps an anonymous orders deep link fail-closed before store reads', async () => {
    requireBuilderAdminAuthMock.mockReturnValueOnce(
      NextResponse.json({ error: 'Authentication required' }, { status: 401 }),
    );

    await expect(CommerceOrdersPage({
      params: Promise.resolve({ locale: 'en' }),
    })).rejects.toThrow('NEXT_NOT_FOUND');

    expect(notFoundMock).toHaveBeenCalledTimes(1);
    expect(userHasPermissionMock).not.toHaveBeenCalled();
    expect(readSiteDocumentMock).not.toHaveBeenCalled();
    expect(listOrdersMock).not.toHaveBeenCalled();
  });
});
