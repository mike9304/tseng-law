import type { EnrichedVisitEvent, VisitEvent } from './visit-schema';
import { classifyReferrer } from './classify-referrer';

export interface VisitEnrichmentContext {
  country?: string;
  now: Date;
}

/** Add server-owned metadata without retaining an IP address. */
export function enrichEvents(
  events: VisitEvent[],
  context: VisitEnrichmentContext,
): EnrichedVisitEvent[] {
  const receivedAt = context.now.toISOString();
  const country = context.country;
  return events.map((event) => {
    const base: EnrichedVisitEvent = {
      ...event,
      receivedAt,
      ...(country !== undefined ? { country } : {}),
    };
    if (event.type !== 'pageview') return base;
    const classification = classifyReferrer({
      referrer: event.ref,
      utmSource: event.utm?.source,
      firstLoad: event.firstLoad,
    });
    return { ...base, ...classification };
  });
}
