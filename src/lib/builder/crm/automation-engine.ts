/**
 * Runs CRM automations for inbound events. Concise MVP: linear scan, trigger
 * match, single-action execution. Add-tag actions can chain into
 * `tag-added` triggers, so we pass a recursion depth and cap it at 3.
 */

import { createHmac } from 'node:crypto';
import { addTagsToContact } from './contact-store';
import type { CrmContact } from './contact-model';
import {
  appendOutboxEntry,
  type CrmAutomation,
  type CrmAutomationTriggerKind,
  makeOutboxEntryId,
  readAutomations,
} from './automation-model';

export interface CrmAutomationEvent {
  kind: CrmAutomationTriggerKind;
  contact: CrmContact;
  payload?: Record<string, unknown>;
}

interface RunOptions {
  depth?: number;
  fetchImpl?: typeof fetch;
}

const MAX_DEPTH = 3;
export const CRM_EMAIL_SIMULATION_UNAVAILABLE = 'crm_email_simulation_unavailable';

class CrmAutomationActionUnavailableError extends Error {
  readonly code = CRM_EMAIL_SIMULATION_UNAVAILABLE;

  constructor() {
    super('CRM email simulation is unavailable in production.');
    this.name = 'CrmAutomationActionUnavailableError';
  }
}

function matchesTrigger(automation: CrmAutomation, event: CrmAutomationEvent): boolean {
  if (!automation.enabled) return false;
  if (automation.trigger.kind !== event.kind) return false;
  const { matchTag, matchFormName } = automation.trigger;
  if (matchTag && !event.contact.tags.includes(matchTag)) return false;
  if (matchFormName) {
    const payloadForm = typeof event.payload?.formName === 'string' ? event.payload.formName : '';
    if (payloadForm !== matchFormName) return false;
  }
  return true;
}

function resolveHmacSecret(): string | null {
  const candidate =
    process.env.CRM_WEBHOOK_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.BUILDER_WEBHOOK_SECRET ||
    '';
  const trimmed = candidate.trim();
  return trimmed ? trimmed : null;
}

export function signCrmWebhookBody(body: string, secret: string): string {
  return createHmac('sha256', secret).update(body).digest('hex');
}

async function performAction(
  automation: CrmAutomation,
  event: CrmAutomationEvent,
  options: RunOptions,
): Promise<void> {
  const action = automation.action;
  switch (action.kind) {
    case 'simulate-email': {
      if (process.env.NODE_ENV === 'production') {
        throw new CrmAutomationActionUnavailableError();
      }
      await appendOutboxEntry({
        entryId: makeOutboxEntryId(),
        automationId: automation.id,
        contactId: event.contact.id,
        contactEmail: event.contact.email,
        templateId: action.templateId,
        triggeredAt: new Date().toISOString(),
        payload: event.payload,
      });
      return;
    }
    case 'add-tag': {
      if (!action.addTag) return;
      const updated = await addTagsToContact(event.contact.id, [action.addTag]);
      // Chain `tag-added` if the tag was actually new.
      if (updated && updated.tags.includes(action.addTag)) {
        const alreadyHadTag = event.contact.tags.includes(action.addTag);
        if (!alreadyHadTag) {
          await runAutomationsForEvent(
            {
              kind: 'tag-added',
              contact: updated,
              payload: { addedTag: action.addTag, originAutomationId: automation.id },
            },
            { depth: (options.depth ?? 0) + 1, fetchImpl: options.fetchImpl },
          );
        }
      }
      return;
    }
    case 'webhook': {
      if (!action.webhookUrl) return;
      const fetchImpl = options.fetchImpl ?? fetch;
      const body = JSON.stringify({
        automationId: automation.id,
        event: event.kind,
        contact: {
          id: event.contact.id,
          email: event.contact.email,
          name: event.contact.name,
          tags: event.contact.tags,
        },
        payload: event.payload ?? {},
        triggeredAt: new Date().toISOString(),
      });
      const secret = resolveHmacSecret();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (secret) {
        headers['x-crm-signature'] = signCrmWebhookBody(body, secret);
      } else {
        console.warn('[crm/automation] webhook called without HMAC secret; set CRM_WEBHOOK_SECRET or NEXTAUTH_SECRET');
      }
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5_000);
      try {
        await fetchImpl(action.webhookUrl, {
          method: 'POST',
          headers,
          body,
          signal: controller.signal,
        });
      } catch (err) {
        console.error('[crm/automation] webhook failed:', err);
      } finally {
        clearTimeout(timeout);
      }
      return;
    }
    default:
      return;
  }
}

export async function runAutomationsForEvent(
  event: CrmAutomationEvent,
  options: RunOptions = {},
): Promise<void> {
  const depth = options.depth ?? 0;
  if (depth >= MAX_DEPTH) {
    console.warn('[crm/automation] max recursion depth reached, skipping');
    return;
  }

  const automations = await readAutomations();
  const matching = automations.filter((a) => matchesTrigger(a, event));
  for (const automation of matching) {
    try {
      await performAction(automation, event, options);
    } catch (err) {
      if (err instanceof CrmAutomationActionUnavailableError) {
        console.error('[crm/automation] action unavailable', {
          automationId: automation.id,
          actionKind: automation.action.kind,
          errorCode: err.code,
        });
        continue;
      }
      console.error('[crm/automation] action failed for automation', automation.id, err);
    }
  }
}
