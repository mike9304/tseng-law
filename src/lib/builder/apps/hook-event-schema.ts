import { z } from 'zod';
import type { AppHookEvent } from './hooks-model';

export class AppHookEventParseError extends Error {
  constructor(kind: string) {
    super(`Unsupported app hook event kind: ${kind}`);
  }
}

const editorPageSaveEventSchema = z.object({
  kind: z.literal('editor.page-save'),
  payload: z.object({
    siteId: z.string().min(1),
    pageId: z.string().min(1),
    revision: z.number().int(),
    savedAt: z.string().min(1),
  }).strict(),
}).strict();

const publicPageRenderEventSchema = z.object({
  kind: z.literal('public.page-render'),
  payload: z.object({
    siteId: z.string().min(1),
    pageId: z.string().min(1),
    slug: z.string(),
    locale: z.string().min(1),
  }).strict(),
}).strict();

const commerceOrderCreatedEventSchema = z.object({
  kind: z.literal('commerce.order-created'),
  payload: z.object({
    orderId: z.string().min(1),
    totalCents: z.number().int(),
    currency: z.string().min(1).optional(),
  }).strict(),
}).strict();

const bookingsReservationCreatedEventSchema = z.object({
  kind: z.literal('bookings.reservation-created'),
  payload: z.object({
    bookingId: z.string().min(1),
    serviceId: z.string().min(1),
    staffId: z.string().min(1).optional(),
    startAt: z.string().min(1),
  }).strict(),
}).strict();

const cmsRecordCreatedEventSchema = z.object({
  kind: z.literal('cms.record-created'),
  payload: z.object({
    collectionId: z.string().min(1),
    recordId: z.string().min(1),
    locale: z.string().min(1).optional(),
  }).strict(),
}).strict();

const publishCompletedEventSchema = z.object({
  kind: z.literal('publish.completed'),
  payload: z.object({
    siteId: z.string().min(1),
    pageId: z.string().min(1),
    revision: z.number().int(),
    publishedAt: z.string().min(1).optional(),
  }).strict(),
}).strict();

export const appHookEventSchema = z.discriminatedUnion('kind', [
  editorPageSaveEventSchema,
  publicPageRenderEventSchema,
  commerceOrderCreatedEventSchema,
  bookingsReservationCreatedEventSchema,
  cmsRecordCreatedEventSchema,
  publishCompletedEventSchema,
]);

export type ParsedAppHookEvent = z.infer<typeof appHookEventSchema>;

function unsupportedEvent(event: never): never {
  throw new AppHookEventParseError(String(event));
}

export function toAppHookEvent(event: ParsedAppHookEvent): AppHookEvent {
  switch (event.kind) {
    case 'editor.page-save':
      return {
        kind: event.kind,
        payload: {
          siteId: event.payload.siteId,
          pageId: event.payload.pageId,
          revision: event.payload.revision,
          savedAt: event.payload.savedAt,
        },
      };
    case 'public.page-render':
      return {
        kind: event.kind,
        payload: {
          siteId: event.payload.siteId,
          pageId: event.payload.pageId,
          slug: event.payload.slug,
          locale: event.payload.locale,
        },
      };
    case 'commerce.order-created':
      return {
        kind: event.kind,
        payload: {
          orderId: event.payload.orderId,
          totalCents: event.payload.totalCents,
          ...(event.payload.currency ? { currency: event.payload.currency } : {}),
        },
      };
    case 'bookings.reservation-created':
      return {
        kind: event.kind,
        payload: {
          bookingId: event.payload.bookingId,
          serviceId: event.payload.serviceId,
          ...(event.payload.staffId ? { staffId: event.payload.staffId } : {}),
          startAt: event.payload.startAt,
        },
      };
    case 'cms.record-created':
      return {
        kind: event.kind,
        payload: {
          collectionId: event.payload.collectionId,
          recordId: event.payload.recordId,
          ...(event.payload.locale ? { locale: event.payload.locale } : {}),
        },
      };
    case 'publish.completed':
      return {
        kind: event.kind,
        payload: {
          siteId: event.payload.siteId,
          pageId: event.payload.pageId,
          revision: event.payload.revision,
          ...(event.payload.publishedAt ? { publishedAt: event.payload.publishedAt } : {}),
        },
      };
    default:
      return unsupportedEvent(event);
  }
}
