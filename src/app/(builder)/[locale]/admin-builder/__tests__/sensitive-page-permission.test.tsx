import { NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { userHasPermission } from '@/lib/builder/security/resolve-permission';
import { listBackups } from '@/lib/builder/backups/backup-engine';
import { listMembers } from '@/lib/builder/members/members-engine';
import {
  listAvailability,
  listBookings,
  listServices,
  listStaff,
  listWaitlistEntries,
} from '@/lib/builder/bookings/storage';
import { listConversations } from '@/lib/builder/live-chat/storage';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { listDomains } from '@/lib/builder/domains/storage';
import { getVercelClient } from '@/lib/builder/domains/vercel-api';
import BackupsPage from '@/app/(builder)/[locale]/admin-builder/backups/page';
import BuilderMembersAdminPage from '@/app/(builder)/[locale]/admin-builder/members/page';
import BookingDashboardPage from '@/app/(builder)/[locale]/admin-builder/bookings/dashboard/page';
import InboxPage from '@/app/(builder)/[locale]/admin-builder/inbox/page';
import CustomCodeAdminPage from '@/app/(builder)/[locale]/admin-builder/custom-code/page';
import DomainsPage from '@/app/(builder)/[locale]/admin-builder/domains/page';

vi.mock('next/headers', () => ({ headers: vi.fn() }));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

vi.mock('@/lib/builder/columns/auth', () => ({ requireBuilderAdminAuth: vi.fn() }));
vi.mock('@/lib/builder/security/resolve-permission', () => ({ userHasPermission: vi.fn() }));
vi.mock('@/lib/builder/backups/backup-engine', () => ({ listBackups: vi.fn() }));
vi.mock('@/lib/builder/members/members-engine', () => ({
  listMembers: vi.fn(),
  publicMember: vi.fn(),
}));
vi.mock('@/lib/builder/bookings/storage', () => ({
  listAvailability: vi.fn(),
  listBookings: vi.fn(),
  listServices: vi.fn(),
  listStaff: vi.fn(),
  listWaitlistEntries: vi.fn(),
}));
vi.mock('@/lib/builder/live-chat/storage', () => ({ listConversations: vi.fn() }));
vi.mock('@/lib/builder/live-chat/types', () => ({ toSafeChatConversation: vi.fn() }));
vi.mock('@/lib/builder/site/persistence', () => ({ readSiteDocument: vi.fn() }));
vi.mock('@/lib/builder/domains/storage', () => ({ listDomains: vi.fn() }));
vi.mock('@/lib/builder/domains/vercel-api', () => ({ getVercelClient: vi.fn() }));
vi.mock('@/components/builder/backups/BackupsAdmin', () => ({ default: () => null }));
vi.mock('@/components/builder/members/MembersAdminClient', () => ({ default: () => null }));
vi.mock('@/components/builder/bookings/BookingsAdminShell', () => ({ default: () => null }));
vi.mock('@/components/builder/bookings/BookingDashboardAdmin', () => ({ default: () => null }));
vi.mock('@/components/builder/live-chat/InboxAdmin', () => ({ default: () => null }));
vi.mock('@/components/builder/CustomCodePanel', () => ({ default: () => null }));
vi.mock('@/components/builder/DevLogsPanel', () => ({ default: () => null }));
vi.mock('@/components/builder/domains/DomainsAdmin', () => ({ default: () => null }));

const headersMock = vi.mocked(headers);
const notFoundMock = vi.mocked(notFound);
const requireBuilderAdminAuthMock = vi.mocked(requireBuilderAdminAuth);
const userHasPermissionMock = vi.mocked(userHasPermission);
const listBackupsMock = vi.mocked(listBackups);
const listMembersMock = vi.mocked(listMembers);
const listAvailabilityMock = vi.mocked(listAvailability);
const listBookingsMock = vi.mocked(listBookings);
const listServicesMock = vi.mocked(listServices);
const listStaffMock = vi.mocked(listStaff);
const listWaitlistEntriesMock = vi.mocked(listWaitlistEntries);
const listConversationsMock = vi.mocked(listConversations);
const readSiteDocumentMock = vi.mocked(readSiteDocument);
const listDomainsMock = vi.mocked(listDomains);
const getVercelClientMock = vi.mocked(getVercelClient);

const pageProps = { params: Promise.resolve({ locale: 'en' as const }) };

describe('sensitive admin page permissions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    headersMock.mockResolvedValue(new Headers({
      authorization: 'Basic denied-request',
      cookie: 'builder_admin_session=denied-session',
    }) as Awaited<ReturnType<typeof headers>>);
    requireBuilderAdminAuthMock.mockReturnValue({ username: 'editor' });
    userHasPermissionMock.mockResolvedValue(false);
  });

  it.each([
    ['backups', 'settings', () => BackupsPage(pageProps), [listBackupsMock]],
    ['members', 'manage-users', () => BuilderMembersAdminPage(pageProps), [listMembersMock]],
    ['booking dashboard', 'manage-bookings', () => BookingDashboardPage(pageProps), [
      listBookingsMock,
      listServicesMock,
      listStaffMock,
      listWaitlistEntriesMock,
      listAvailabilityMock,
    ]],
    ['inbox', 'manage-contacts', () => InboxPage(pageProps), [listConversationsMock]],
    ['custom code', 'settings', () => CustomCodeAdminPage(pageProps), [readSiteDocumentMock]],
    ['domains', 'settings', () => DomainsPage(pageProps), [listDomainsMock, getVercelClientMock]],
  ] as const)('denies editor access to %s before sensitive reads', async (_page, permission, renderPage, reads) => {
    await expect(renderPage()).rejects.toThrow('NEXT_NOT_FOUND');

    expect(userHasPermissionMock).toHaveBeenCalledWith('editor', permission);
    expect(notFoundMock).toHaveBeenCalledTimes(1);
    for (const read of reads) expect(read).not.toHaveBeenCalled();
  });

  it('denies anonymous custom-code deep links before reading the site document', async () => {
    requireBuilderAdminAuthMock.mockReturnValueOnce(
      NextResponse.json({ error: 'Authentication required' }, { status: 401 }),
    );

    await expect(CustomCodeAdminPage(pageProps)).rejects.toThrow('NEXT_NOT_FOUND');

    expect(userHasPermissionMock).not.toHaveBeenCalled();
    expect(readSiteDocumentMock).not.toHaveBeenCalled();
  });
});
