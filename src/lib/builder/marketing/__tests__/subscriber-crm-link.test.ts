import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { runAutomationsForEvent } from '@/lib/builder/crm/automation-engine';
import { dispatchToIntegrations } from '@/lib/builder/crm/integrations-dispatcher';

vi.mock('@/lib/builder/crm/automation-engine', () => ({
  runAutomationsForEvent: vi.fn(async () => undefined),
}));

vi.mock('@/lib/builder/crm/integrations-dispatcher', () => ({
  dispatchToIntegrations: vi.fn(async () => undefined),
}));

const ORIGINAL_CWD = process.cwd();
const ORIGINAL_CRM_BACKEND = process.env.CRM_BACKEND;
const ORIGINAL_BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

let tmpRoot = '';

beforeEach(async () => {
  vi.resetModules();
  vi.mocked(runAutomationsForEvent).mockClear();
  vi.mocked(dispatchToIntegrations).mockClear();
  tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'subscriber-crm-link-'));
  process.chdir(tmpRoot);
  process.env.CRM_BACKEND = 'local';
  delete process.env.BLOB_READ_WRITE_TOKEN;
});

afterEach(async () => {
  process.chdir(ORIGINAL_CWD);
  if (ORIGINAL_CRM_BACKEND === undefined) delete process.env.CRM_BACKEND;
  else process.env.CRM_BACKEND = ORIGINAL_CRM_BACKEND;
  if (ORIGINAL_BLOB_TOKEN === undefined) delete process.env.BLOB_READ_WRITE_TOKEN;
  else process.env.BLOB_READ_WRITE_TOKEN = ORIGINAL_BLOB_TOKEN;
  await fs.rm(tmpRoot, { recursive: true, force: true });
});

describe('linkSubscriberToCrmContact', () => {
  it('creates a CRM contact for a new subscriber and fires contact-created automation', async () => {
    const { linkSubscriberToCrmContact } = await import('../subscriber-crm-link');
    const { listContacts } = await import('@/lib/builder/crm/contact-store');

    const result = await linkSubscriberToCrmContact({
      email: 'Visitor@Example.test',
      preferredLocale: 'ko',
      source: 'footer-form',
      tags: ['newsletter'],
    });

    const contacts = await listContacts();

    expect(result.created).toBe(true);
    expect(contacts).toHaveLength(1);
    expect(contacts[0]).toMatchObject({
      id: result.contactId,
      email: 'visitor@example.test',
      source: 'form',
      customFields: { preferredLocale: 'ko', subscriberSource: 'footer-form' },
    });
    expect(contacts[0]?.tags.sort()).toEqual(['newsletter', 'subscriber'].sort());
    expect(runAutomationsForEvent).toHaveBeenCalledWith({
      kind: 'contact-created',
      contact: expect.objectContaining({ id: result.contactId }),
      payload: { source: 'marketing-subscriber', subscriberSource: 'footer-form' },
    });
    expect(dispatchToIntegrations).toHaveBeenCalledWith({
      kind: 'contact-created',
      contact: expect.objectContaining({ id: result.contactId }),
      payload: {
        source: 'marketing-subscriber',
        subscriberSource: 'footer-form',
        tags: ['subscriber', 'newsletter'],
      },
    });
  });

  it('merges into an existing contact without duplicating the email row', async () => {
    const { linkSubscriberToCrmContact } = await import('../subscriber-crm-link');
    const { createContact, listContacts } = await import('@/lib/builder/crm/contact-store');
    const existing = await createContact({
      email: 'merge@example.test',
      tags: ['lead'],
      source: 'manual',
    });

    const result = await linkSubscriberToCrmContact({
      email: 'MERGE@example.test',
      preferredLocale: 'en',
      source: 'admin-create',
      tags: ['newsletter'],
    });

    const contacts = await listContacts();

    expect(result).toEqual({ contactId: existing.id, created: false });
    expect(contacts).toHaveLength(1);
    expect(contacts[0]?.tags.sort()).toEqual(['lead', 'newsletter', 'subscriber'].sort());
    expect(runAutomationsForEvent).not.toHaveBeenCalled();
    expect(dispatchToIntegrations).toHaveBeenCalledWith({
      kind: 'tag-added',
      contact: expect.objectContaining({ id: existing.id }),
      payload: {
        source: 'marketing-subscriber',
        subscriberSource: 'admin-create',
        tags: ['subscriber', 'newsletter'],
      },
    });
  });
});
