/**
 * Unit tests for the CRM contact store. Uses a tmp `runtime-data/crm` root
 * via process.cwd() temp override.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

const ORIGINAL_CWD = process.cwd();

let tmpRoot = '';

beforeEach(async () => {
  tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'crm-test-'));
  process.chdir(tmpRoot);
  delete process.env.BLOB_READ_WRITE_TOKEN;
  process.env.CRM_BACKEND = 'local';
});

afterEach(async () => {
  process.chdir(ORIGINAL_CWD);
  await fs.rm(tmpRoot, { recursive: true, force: true });
});

async function freshImport(): Promise<typeof import('@/lib/builder/crm/contact-store')> {
  // Reset the cached module so each test gets its own write queue / file path resolution.
  // Vitest's module cache survives `chdir`, but contact-model captures `process.cwd()`
  // inside helpers, not at import time, so re-import is optional. We still re-import
  // for determinism.
  return await import('@/lib/builder/crm/contact-store');
}

describe('CRM contact store — file backend', () => {
  it('creates a contact and lists it', async () => {
    const { createContact, listContacts } = await freshImport();
    const contact = await createContact({
      email: 'Alice@example.com',
      name: 'Alice',
      tags: ['lead'],
    });
    expect(contact.email).toBe('alice@example.com');
    const list = await listContacts();
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(contact.id);
  });

  it('merges by email and unions tags, preserving original id', async () => {
    const { createContact, mergeContactByEmail, listContacts } = await freshImport();
    const first = await createContact({ email: 'bob@example.com', tags: ['lead'] });
    const { contact, created } = await mergeContactByEmail({
      email: 'BOB@example.com',
      name: 'Bob',
      phone: '+82 10 0000 0000',
      tags: ['form:contact-us'],
    });
    expect(created).toBe(false);
    expect(contact.id).toBe(first.id);
    expect(contact.email).toBe('bob@example.com');
    expect(contact.name).toBe('Bob');
    expect(contact.phone).toBe('+82 10 0000 0000');
    expect(contact.tags.sort()).toEqual(['form:contact-us', 'lead'].sort());
    const list = await listContacts();
    expect(list).toHaveLength(1);
  });

  it('mergeContactByEmail creates a new contact when no match exists', async () => {
    const { mergeContactByEmail } = await freshImport();
    const { contact, created } = await mergeContactByEmail({
      email: 'NEW@example.com',
      tags: ['lead'],
    });
    expect(created).toBe(true);
    expect(contact.email).toBe('new@example.com');
    expect(contact.tags).toEqual(['lead']);
  });

  it('addTagsToContact unions tags without losing existing tags', async () => {
    const { createContact, addTagsToContact } = await freshImport();
    const contact = await createContact({ email: 'c@example.com', tags: ['existing'] });
    const updated = await addTagsToContact(contact.id, ['existing', 'fresh']);
    expect(updated?.tags.sort()).toEqual(['existing', 'fresh'].sort());
  });

  it('filters list by tag, source, and free-text', async () => {
    const { createContact, listContacts } = await freshImport();
    await createContact({ email: 'a@example.com', name: 'Alice', tags: ['lead'], source: 'form' });
    await createContact({ email: 'b@example.com', name: 'Bob', tags: ['vip'], source: 'manual' });
    await createContact({ email: 'c@example.com', name: 'Carla', tags: ['lead', 'vip'], source: 'booking' });

    const leads = await listContacts({ tag: 'lead' });
    expect(leads.map((c) => c.email).sort()).toEqual(['a@example.com', 'c@example.com'].sort());

    const manual = await listContacts({ source: 'manual' });
    expect(manual.map((c) => c.email)).toEqual(['b@example.com']);

    const search = await listContacts({ q: 'CARLA' });
    expect(search.map((c) => c.email)).toEqual(['c@example.com']);
  });

  it('updates a contact and bumps lastActivityAt', async () => {
    const { createContact, updateContact } = await freshImport();
    const created = await createContact({ email: 'u@example.com' });
    await new Promise((r) => setTimeout(r, 5));
    const updated = await updateContact(created.id, { name: 'Updated', notes: 'note' });
    expect(updated?.name).toBe('Updated');
    expect(updated?.notes).toBe('note');
    expect((updated?.lastActivityAt ?? '') > created.lastActivityAt).toBe(true);
  });

  it('deletes a contact', async () => {
    const { createContact, deleteContact, listContacts } = await freshImport();
    const created = await createContact({ email: 'd@example.com' });
    const ok = await deleteContact(created.id);
    expect(ok).toBe(true);
    expect(await listContacts()).toHaveLength(0);
  });

  it('createContact with a duplicate email merges into the existing row', async () => {
    const { createContact, listContacts } = await freshImport();
    const a = await createContact({ email: 'dup@example.com', tags: ['a'] });
    const b = await createContact({ email: 'dup@example.com', name: 'Dup', tags: ['b'] });
    expect(b.id).toBe(a.id);
    expect(b.tags.sort()).toEqual(['a', 'b'].sort());
    expect(b.name).toBe('Dup');
    expect(await listContacts()).toHaveLength(1);
  });
});