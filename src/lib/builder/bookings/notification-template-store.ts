/**
 * F80 Booking notifications template editor — per-locale email templates.
 *
 * File-backed at `runtime-data/bookings/notification-templates.json`.
 * Holds an `{ [id]: NotificationTemplate }` map keyed by `eventType__locale`.
 *
 * Distinct from the existing `BookingEmailTemplate` (single subject/body,
 * placeholder-driven, one record per event type). This store carries
 * pre-rendered subject + html + plain triples for each (event, locale)
 * pair so the admin UI can edit localized copy without juggling shared
 * template tokens.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { defaultLocale, locales, type Locale } from '@/lib/locales';

export const notificationEventTypes = [
  'booking-confirmed',
  'booking-cancelled',
  'booking-reminder',
  'booking-rescheduled',
] as const;

export type NotificationEventType = (typeof notificationEventTypes)[number];

export interface NotificationTemplate {
  id: string;
  eventType: NotificationEventType;
  locale: Locale;
  subject: string;
  html: string;
  plain: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NotificationTemplateInput = Pick<
  NotificationTemplate,
  'eventType' | 'locale' | 'subject' | 'html' | 'plain'
> & { isActive?: boolean };

export type NotificationTemplatePatch = Partial<
  Pick<NotificationTemplate, 'subject' | 'html' | 'plain' | 'isActive'>
>;

interface NotificationTemplateFile {
  version: 1;
  templates: Record<string, NotificationTemplate>;
}

const TEMPLATES_DIR = path.join(process.cwd(), 'runtime-data', 'bookings');
const TEMPLATES_FILE = path.join(TEMPLATES_DIR, 'notification-templates.json');

export const notificationTemplateInputSchema = z.object({
  eventType: z.enum(notificationEventTypes),
  locale: z.enum(locales),
  subject: z.string().trim().min(1).max(300),
  html: z.string().trim().min(1).max(40000),
  plain: z.string().trim().min(1).max(40000),
  isActive: z.coerce.boolean().optional(),
});

export const notificationTemplatePatchSchema = z.object({
  subject: z.string().trim().min(1).max(300).optional(),
  html: z.string().trim().min(1).max(40000).optional(),
  plain: z.string().trim().min(1).max(40000).optional(),
  isActive: z.coerce.boolean().optional(),
});

export function isNotificationEventType(value: string): value is NotificationEventType {
  return (notificationEventTypes as readonly string[]).includes(value);
}

export function makeNotificationTemplateId(eventType: NotificationEventType, locale: Locale): string {
  return `${eventType}__${locale}`;
}

export function parseNotificationTemplateId(
  id: string,
): { eventType: NotificationEventType; locale: Locale } | null {
  const [eventTypeRaw, localeRaw] = id.split('__');
  if (!eventTypeRaw || !localeRaw) return null;
  if (!isNotificationEventType(eventTypeRaw)) return null;
  if (!(locales as readonly string[]).includes(localeRaw)) return null;
  return { eventType: eventTypeRaw, locale: localeRaw as Locale };
}

function nowIso(): string {
  return new Date().toISOString();
}

// Mutable path so tests can redirect reads/writes to a tmpdir.
let activeFilePath: string = TEMPLATES_FILE;
let activeDirPath: string = TEMPLATES_DIR;

export function _setTemplatesPathForTests(filePath: string): void {
  activeFilePath = filePath;
  activeDirPath = path.dirname(filePath);
}

export function _resetTemplatesPathForTests(): void {
  activeFilePath = TEMPLATES_FILE;
  activeDirPath = TEMPLATES_DIR;
}

async function readActiveFile(): Promise<NotificationTemplateFile> {
  try {
    const raw = await fs.readFile(activeFilePath, 'utf8');
    const parsed = JSON.parse(raw) as Partial<NotificationTemplateFile>;
    if (!parsed || typeof parsed !== 'object' || parsed.version !== 1 || !parsed.templates) {
      return { version: 1, templates: {} };
    }
    return { version: 1, templates: parsed.templates };
  } catch {
    return { version: 1, templates: {} };
  }
}

async function writeActiveFile(file: NotificationTemplateFile): Promise<void> {
  await fs.mkdir(activeDirPath, { recursive: true });
  await fs.writeFile(activeFilePath, JSON.stringify(file, null, 2), 'utf8');
}

export async function listNotificationTemplates(options: {
  eventType?: NotificationEventType;
  locale?: Locale;
} = {}): Promise<NotificationTemplate[]> {
  const file = await readActiveFile();
  return Object.values(file.templates)
    .filter((template) => !options.eventType || template.eventType === options.eventType)
    .filter((template) => !options.locale || template.locale === options.locale)
    .sort((a, b) => a.eventType.localeCompare(b.eventType) || a.locale.localeCompare(b.locale));
}

export async function getNotificationTemplate(id: string): Promise<NotificationTemplate | null> {
  const file = await readActiveFile();
  return file.templates[id] ?? null;
}

export async function createNotificationTemplate(
  input: NotificationTemplateInput,
): Promise<{ ok: true; template: NotificationTemplate } | { ok: false; error: string }> {
  const id = makeNotificationTemplateId(input.eventType, input.locale);
  const file = await readActiveFile();
  if (file.templates[id]) {
    return {
      ok: false,
      error: `Template for ${input.eventType} (${input.locale}) already exists`,
    };
  }
  const stamp = nowIso();
  const template: NotificationTemplate = {
    id,
    eventType: input.eventType,
    locale: input.locale,
    subject: input.subject,
    html: input.html,
    plain: input.plain,
    isActive: input.isActive ?? true,
    createdAt: stamp,
    updatedAt: stamp,
  };
  file.templates[id] = template;
  await writeActiveFile(file);
  return { ok: true, template };
}

export async function updateNotificationTemplate(
  id: string,
  patch: NotificationTemplatePatch,
): Promise<{ ok: true; template: NotificationTemplate } | { ok: false; error: string }> {
  const file = await readActiveFile();
  const existing = file.templates[id];
  if (!existing) return { ok: false, error: 'Template not found' };
  const next: NotificationTemplate = {
    ...existing,
    subject: patch.subject ?? existing.subject,
    html: patch.html ?? existing.html,
    plain: patch.plain ?? existing.plain,
    isActive: patch.isActive ?? existing.isActive,
    updatedAt: nowIso(),
  };
  file.templates[id] = next;
  await writeActiveFile(file);
  return { ok: true, template: next };
}

export async function deleteNotificationTemplate(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const file = await readActiveFile();
  if (!file.templates[id]) return { ok: false, error: 'Template not found' };
  delete file.templates[id];
  await writeActiveFile(file);
  return { ok: true };
}

/**
 * Resolve the active template for an (eventType, locale) pair with
 * a locale fallback chain. Returns `null` when nothing exists.
 *
 * Fallback order:
 *   1. exact locale match (active)
 *   2. defaultLocale ('ko') match (active)
 *   3. any other locale match (active)
 *   4. exact locale match even if inactive (last resort)
 */
export async function resolveNotificationTemplate(
  eventType: NotificationEventType,
  locale: Locale,
): Promise<NotificationTemplate | null> {
  const file = await readActiveFile();
  const candidates = Object.values(file.templates).filter(
    (template) => template.eventType === eventType,
  );
  if (candidates.length === 0) return null;

  const exactActive = candidates.find((t) => t.locale === locale && t.isActive);
  if (exactActive) return exactActive;

  const defaultActive = candidates.find((t) => t.locale === defaultLocale && t.isActive);
  if (defaultActive) return defaultActive;

  const anyActive = candidates.find((t) => t.isActive);
  if (anyActive) return anyActive;

  const exactInactive = candidates.find((t) => t.locale === locale);
  return exactInactive ?? candidates[0] ?? null;
}