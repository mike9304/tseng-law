import {
  listSubscriptions,
  makeDeliveryId,
  saveDelivery,
} from './storage';
import { signWebhookPayload } from './signature';
import { reasonUrlUnsafe } from './url-guard';
import type { WebhookDelivery, WebhookEventType, WebhookSubscription } from './types';

/**
 * PR #13 — Outbound webhook dispatcher.
 *
 * `emitEvent(event, payload)` fans out to every active subscription that
 * subscribed to `event`. Each delivery is recorded so the admin UI can
 * audit / retry. Failures are caught — never block the caller.
 */
async function performDelivery(
  subscription: WebhookSubscription,
  event: WebhookEventType,
  payload: Record<string, unknown>,
  attempt = 1,
): Promise<WebhookDelivery> {
  const now = new Date().toISOString();
  const deliveryId = makeDeliveryId();
  const body = JSON.stringify({ event, payload, deliveredAt: now, webhookId: subscription.webhookId });
  const signature = signWebhookPayload(subscription.secret, body);
  const delivery: WebhookDelivery = {
    deliveryId,
    webhookId: subscription.webhookId,
    event,
    payload,
    status: 'pending',
    attempts: attempt,
    createdAt: now,
  };
  // SECURITY: SSRF guard. Refuse loopback / private / cloud-metadata
  // targets before issuing the fetch so a misconfigured or malicious
  // subscription cannot probe internal services or exfiltrate IMDS
  // credentials. Treated as a "failed" delivery for audit consistency.
  const unsafeReason = reasonUrlUnsafe(subscription.url);
  if (unsafeReason) {
    delivery.status = 'failed';
    delivery.lastTriedAt = new Date().toISOString();
    delivery.error = `Refused: ${unsafeReason}`;
    await saveDelivery(delivery);
    return delivery;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8_000);
  try {
    const res = await fetch(subscription.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hojeong-Signature': signature,
        'X-Hojeong-Event': event,
        'X-Hojeong-Delivery-Id': deliveryId,
      },
      body,
      signal: controller.signal,
    });
    const text = await res.text().catch(() => '');
    delivery.responseStatus = res.status;
    delivery.responseSnippet = text.slice(0, 400);
    delivery.lastTriedAt = new Date().toISOString();
    delivery.status = res.ok ? 'success' : 'failed';
    if (!res.ok) delivery.error = `HTTP ${res.status}`;
  } catch (err) {
    delivery.status = 'failed';
    delivery.lastTriedAt = new Date().toISOString();
    delivery.error = err instanceof Error
      ? (err.name === 'AbortError' ? 'Webhook delivery timed out after 8s' : err.message)
      : String(err);
  } finally {
    clearTimeout(timeoutId);
  }
  await saveDelivery(delivery);
  return delivery;
}

export async function dispatchToSubscription(
  subscription: WebhookSubscription,
  event: WebhookEventType,
  payload: Record<string, unknown>,
): Promise<WebhookDelivery> {
  return performDelivery(subscription, event, payload, 1);
}

export async function retryDelivery(
  subscription: WebhookSubscription,
  prior: WebhookDelivery,
): Promise<WebhookDelivery> {
  return performDelivery(subscription, prior.event, prior.payload, prior.attempts + 1);
}

/**
 * Fire-and-forget: enumerates active subscriptions and dispatches in
 * parallel. The caller does NOT await; the function returns immediately
 * to keep the request hot path tight.
 */
export function emitEvent(event: WebhookEventType, payload: Record<string, unknown>): void {
  void (async () => {
    try {
      const subscriptions = await listSubscriptions();
      const targets = subscriptions.filter((s) => s.active && s.events.includes(event));
      if (targets.length === 0) return;
      await Promise.all(targets.map((sub) => performDelivery(sub, event, payload).catch((err) => {
        console.warn('[webhooks] delivery failed', sub.webhookId, err);
      })));
    } catch (err) {
      console.warn('[webhooks] emitEvent failed', err);
    }
  })();
}
