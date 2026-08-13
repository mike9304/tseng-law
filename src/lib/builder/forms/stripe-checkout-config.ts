import { createHash } from 'crypto';
import type { NextRequest } from 'next/server';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import type { BuilderFormPaymentCanvasNode } from '@/lib/builder/canvas/types';
import { isLocale, type Locale } from '@/lib/locales';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { findPageMetaForLocale } from '@/lib/builder/site/page-resolution';
import { readPublishedPageCanvas } from '@/lib/builder/site/published-canvas';
import {
  FORM_PAYMENT_KO_DEFAULTS,
  getFormControlsCopy,
  localizedFormControlText,
} from '@/lib/builder/components/form/form-controls-copy';

export interface PublishedStripeCheckoutOffer {
  pageId: string;
  nodeId: string;
  amountCents: number;
  currency: BuilderFormPaymentCanvasNode['content']['currency'];
  description: string;
  successUrl: string;
  cancelUrl: string;
}

interface CheckoutRequestSelection {
  amountCents: number;
  currency: BuilderFormPaymentCanvasNode['content']['currency'];
  description: string;
  successUrl?: string;
  cancelUrl?: string;
}

function publishedPageAddress(request: NextRequest): { locale: Locale; slugPath: string } | null {
  const referer = request.headers.get('referer');
  if (!referer) return null;

  try {
    const url = new URL(referer);
    if (url.origin !== request.nextUrl.origin) return null;
    const segments = url.pathname.split('/').filter(Boolean);
    const locale = segments.shift();
    if (!isLocale(locale)) return null;
    return { locale, slugPath: segments.join('/') };
  } catch {
    return null;
  }
}

function sameOriginRedirect(value: string, origin: string, fallback: string): string | null {
  const candidate = value.trim() || fallback;
  try {
    const parsed = new URL(candidate, origin);
    if (
      parsed.origin !== origin
      || (parsed.protocol !== 'https:' && parsed.protocol !== 'http:')
      || parsed.username
      || parsed.password
    ) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

function requestRedirectMatchesPublished(
  requested: string | undefined,
  published: string,
  origin: string,
): boolean {
  if (requested === undefined) return true;
  const normalizedRequested = sameOriginRedirect(requested, origin, '/');
  const normalizedPublished = sameOriginRedirect(published, origin, '/');
  return normalizedRequested !== null && normalizedRequested === normalizedPublished;
}

/**
 * Resolve the price exclusively from the published page canvas named by the
 * request Referer. Client-supplied payment fields are selectors only; the
 * returned values always come from the persisted, published node.
 */
export async function resolvePublishedStripeCheckoutOffer(
  request: NextRequest,
  selection: CheckoutRequestSelection,
): Promise<PublishedStripeCheckoutOffer | null> {
  const address = publishedPageAddress(request);
  if (!address) return null;

  const site = await readSiteDocument(DEFAULT_BUILDER_SITE_ID, address.locale);
  const page = findPageMetaForLocale(site.pages, address.locale, address.slugPath);
  if (!page?.publishedAt) return null;

  const canvas = await readPublishedPageCanvas(page, DEFAULT_BUILDER_SITE_ID);
  if (!canvas) return null;

  const paymentCopy = getFormControlsCopy(address.locale).paymentWidget;
  const node = canvas.nodes.find((candidate): candidate is BuilderFormPaymentCanvasNode => (
    candidate.kind === 'form-payment'
    && candidate.content.provider !== 'manual'
    && candidate.content.amountCents === selection.amountCents
    && candidate.content.currency === selection.currency
    && localizedFormControlText(
      candidate.content.description,
      paymentCopy.defaults.description,
      FORM_PAYMENT_KO_DEFAULTS.description,
    ).trim() === selection.description
    && requestRedirectMatchesPublished(
      selection.successUrl,
      candidate.content.successUrl,
      request.nextUrl.origin,
    )
    && requestRedirectMatchesPublished(
      selection.cancelUrl,
      candidate.content.cancelUrl,
      request.nextUrl.origin,
    )
  ));
  if (!node) return null;

  const successUrl = sameOriginRedirect(
    node.content.successUrl,
    request.nextUrl.origin,
    `/${address.locale}?payment=success`,
  );
  const cancelUrl = sameOriginRedirect(
    node.content.cancelUrl,
    request.nextUrl.origin,
    `/${address.locale}?payment=cancel`,
  );
  if (!successUrl || !cancelUrl) return null;

  return {
    pageId: page.pageId,
    nodeId: node.id,
    amountCents: node.content.amountCents,
    currency: node.content.currency,
    description: localizedFormControlText(
      node.content.description,
      paymentCopy.defaults.description,
      FORM_PAYMENT_KO_DEFAULTS.description,
    ).trim() || node.content.label.trim() || 'Payment',
    successUrl,
    cancelUrl,
  };
}

export function isStripeCheckoutUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:'
      && !url.username
      && !url.password
      && !url.port
      && (url.hostname === 'stripe.com' || url.hostname.endsWith('.stripe.com'))
    );
  } catch {
    return false;
  }
}

export function stripeCheckoutIdempotencyKey(
  offer: PublishedStripeCheckoutOffer,
  visitorToken: string,
): string {
  const digest = createHash('sha256')
    .update([
      'form-checkout-v1',
      offer.pageId,
      offer.nodeId,
      offer.amountCents,
      offer.currency,
      offer.description,
      offer.successUrl,
      offer.cancelUrl,
      visitorToken,
    ].join('\0'))
    .digest('hex');
  return `form-checkout-${digest}`;
}
