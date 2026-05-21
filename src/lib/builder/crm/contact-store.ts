/**
 * Higher-level CRM contact operations. All mutations go through
 * `mutateCrmContacts` so concurrent form submits don't race.
 */

import {
  type CrmContact,
  type CrmContactSource,
  makeContactId,
  mutateCrmContacts,
  normalizeContactEmail,
  readCrmContacts,
} from './contact-model';

export interface ListContactsFilter {
  tag?: string;
  source?: CrmContactSource;
  /** Free-text search across email, name, phone. */
  q?: string;
}

export interface ContactInput {
  email: string;
  name?: string;
  phone?: string;
  source?: CrmContactSource;
  tags?: string[];
  notes?: string;
  customFields?: Record<string, string>;
}

export interface MergeContactInput extends ContactInput {
  /** Tags to merge in addition to any existing tags. */
  additionalTags?: string[];
}

function applyFilter(list: CrmContact[], filter: ListContactsFilter | undefined): CrmContact[] {
  if (!filter) return list;
  const search = filter.q?.trim().toLowerCase();
  return list.filter((contact) => {
    if (filter.tag && !contact.tags.includes(filter.tag)) return false;
    if (filter.source && contact.source !== filter.source) return false;
    if (search) {
      const haystack = [contact.email, contact.name ?? '', contact.phone ?? ''].join(' ').toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}

export async function listContacts(filter?: ListContactsFilter): Promise<CrmContact[]> {
  const all = await readCrmContacts();
  return applyFilter(all, filter).sort((a, b) =>
    b.lastActivityAt.localeCompare(a.lastActivityAt),
  );
}

export async function getContact(id: string): Promise<CrmContact | null> {
  const all = await readCrmContacts();
  return all.find((c) => c.id === id) ?? null;
}

export async function createContact(input: ContactInput): Promise<CrmContact> {
  return mutateCrmContacts((current) => {
    const email = normalizeContactEmail(input.email);
    const existing = current.find((c) => c.email === email);
    if (existing) {
      // Merge instead of duplicating on email collision.
      const merged = mergeOne(existing, { ...input, email });
      return {
        next: current.map((c) => (c.id === existing.id ? merged : c)),
        result: merged,
      };
    }
    const now = new Date().toISOString();
    const contact: CrmContact = {
      id: makeContactId(),
      email,
      name: input.name,
      phone: input.phone,
      source: input.source ?? 'manual',
      tags: Array.from(new Set((input.tags ?? []).filter(Boolean))),
      notes: input.notes,
      customFields: input.customFields,
      createdAt: now,
      lastActivityAt: now,
    };
    return { next: [...current, contact], result: contact };
  });
}

export async function updateContact(
  id: string,
  patch: Partial<Omit<CrmContact, 'id' | 'createdAt'>>,
): Promise<CrmContact | null> {
  return mutateCrmContacts((current) => {
    const index = current.findIndex((c) => c.id === id);
    if (index === -1) return { next: current, result: null };
    const existing = current[index];
    const next: CrmContact = {
      ...existing,
      ...patch,
      id: existing.id,
      createdAt: existing.createdAt,
      email: patch.email ? normalizeContactEmail(patch.email) : existing.email,
      tags: patch.tags
        ? Array.from(new Set(patch.tags.filter(Boolean)))
        : existing.tags,
      lastActivityAt: new Date().toISOString(),
    };
    const updated = [...current];
    updated[index] = next;
    return { next: updated, result: next };
  });
}

export async function deleteContact(id: string): Promise<boolean> {
  return mutateCrmContacts((current) => {
    const next = current.filter((c) => c.id !== id);
    return { next, result: next.length !== current.length };
  });
}

export async function addTagsToContact(id: string, tags: string[]): Promise<CrmContact | null> {
  const clean = tags.map((t) => t.trim()).filter(Boolean);
  if (clean.length === 0) return getContact(id);
  return mutateCrmContacts((current) => {
    const index = current.findIndex((c) => c.id === id);
    if (index === -1) return { next: current, result: null };
    const existing = current[index];
    const merged = Array.from(new Set([...existing.tags, ...clean]));
    if (merged.length === existing.tags.length) {
      return { next: current, result: existing };
    }
    const next: CrmContact = {
      ...existing,
      tags: merged,
      lastActivityAt: new Date().toISOString(),
    };
    const updated = [...current];
    updated[index] = next;
    return { next: updated, result: next };
  });
}

function mergeOne(existing: CrmContact, input: MergeContactInput): CrmContact {
  const tagSet = new Set([
    ...existing.tags,
    ...(input.tags ?? []),
    ...(input.additionalTags ?? []),
  ]);
  return {
    ...existing,
    name: input.name?.trim() || existing.name,
    phone: input.phone?.trim() || existing.phone,
    notes: input.notes?.trim() || existing.notes,
    tags: Array.from(tagSet),
    customFields: input.customFields
      ? { ...(existing.customFields ?? {}), ...input.customFields }
      : existing.customFields,
    source: existing.source ?? input.source ?? 'manual',
    lastActivityAt: new Date().toISOString(),
  };
}

/**
 * Find-or-create by email. Used by form-submission and booking integrations
 * so that one customer = one contact across channels. Returns the new or
 * merged contact plus a `created` flag so callers can fire `contact-created`
 * automations only on the first sighting.
 */
export async function mergeContactByEmail(
  input: MergeContactInput,
): Promise<{ contact: CrmContact; created: boolean }> {
  const email = normalizeContactEmail(input.email);
  return mutateCrmContacts<{ contact: CrmContact; created: boolean }>((current) => {
    const existing = current.find((c) => c.email === email);
    if (existing) {
      const merged = mergeOne(existing, { ...input, email });
      return {
        next: current.map((c) => (c.id === existing.id ? merged : c)),
        result: { contact: merged, created: false },
      };
    }
    const now = new Date().toISOString();
    const contact: CrmContact = {
      id: makeContactId(),
      email,
      name: input.name?.trim() || undefined,
      phone: input.phone?.trim() || undefined,
      source: input.source ?? 'form',
      tags: Array.from(
        new Set([...(input.tags ?? []), ...(input.additionalTags ?? [])].filter(Boolean)),
      ),
      notes: input.notes?.trim() || undefined,
      customFields: input.customFields,
      createdAt: now,
      lastActivityAt: now,
    };
    return { next: [...current, contact], result: { contact, created: true } };
  });
}