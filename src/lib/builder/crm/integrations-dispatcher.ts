/**
 * Fan-out for CRM events to enabled integrations. Slack payloads get a
 * Slack-shaped formatted body; generic webhooks receive the raw event.
 * Legacy `mailchimp-stub` integrations now route to Mailchimp Marketing
 * audience sync when API credentials are configured.
 *
 * Failures are caught per integration; one bad webhook can't break the rest.
 */

import type { CrmContact } from './contact-model';
import { readIntegrations, type CrmIntegration } from './integrations-model';
import { syncMailchimpAudienceMember } from './mailchimp-audience';

export interface CrmIntegrationEvent {
  kind: 'contact-created' | 'form-submitted' | 'tag-added';
  contact: CrmContact;
  payload?: Record<string, unknown>;
}

function formatSlackBlocks(event: CrmIntegrationEvent): Record<string, unknown> {
  const contact = event.contact;
  const headline =
    event.kind === 'contact-created'
      ? `New CRM contact: ${contact.email}`
      : event.kind === 'form-submitted'
      ? `Form submission from ${contact.email}`
      : `Tag added to ${contact.email}`;
  const fields = [
    contact.name ? `*Name:* ${contact.name}` : '',
    contact.phone ? `*Phone:* ${contact.phone}` : '',
    contact.tags.length ? `*Tags:* ${contact.tags.join(', ')}` : '',
  ].filter(Boolean);
  const formName = typeof event.payload?.formName === 'string' ? event.payload.formName : '';
  if (formName) fields.push(`*Form:* ${formName}`);
  return {
    text: headline,
    blocks: [
      { type: 'section', text: { type: 'mrkdwn', text: `*${headline}*` } },
      ...(fields.length
        ? [{ type: 'section', text: { type: 'mrkdwn', text: fields.join('\n') } }]
        : []),
    ],
  };
}

function buildGenericPayload(event: CrmIntegrationEvent): Record<string, unknown> {
  return {
    event: event.kind,
    triggeredAt: new Date().toISOString(),
    contact: {
      id: event.contact.id,
      email: event.contact.email,
      name: event.contact.name,
      phone: event.contact.phone,
      tags: event.contact.tags,
      source: event.contact.source,
    },
    payload: event.payload ?? {},
  };
}

async function dispatchOne(
  integration: CrmIntegration,
  event: CrmIntegrationEvent,
  fetchImpl: typeof fetch,
): Promise<void> {
  if (!integration.enabled) return;
  if (integration.kind === 'mailchimp-stub') {
    const result = await syncMailchimpAudienceMember(event.contact, {
      settings: integration.settings,
      fetchImpl,
    });
    if (!result.ok) {
      console.error('[crm/integrations] mailchimp audience sync failed:', integration.id, result.error);
      return;
    }
    console.info('[crm/integrations] mailchimp audience sync', {
      integrationId: integration.id,
      contactEmail: event.contact.email,
      kind: event.kind,
      status: result.status,
    });
    return;
  }
  if (!integration.webhookUrl) return;

  const body =
    integration.kind === 'slack-webhook'
      ? JSON.stringify(formatSlackBlocks(event))
      : JSON.stringify(buildGenericPayload(event));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);
  try {
    await fetchImpl(integration.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal: controller.signal,
    });
  } catch (err) {
    console.error('[crm/integrations] dispatch failed:', integration.id, err);
  } finally {
    clearTimeout(timeout);
  }
}

export async function dispatchToIntegrations(
  event: CrmIntegrationEvent,
  options: { fetchImpl?: typeof fetch } = {},
): Promise<void> {
  const integrations = await readIntegrations();
  const fetchImpl = options.fetchImpl ?? fetch;
  await Promise.all(integrations.map((integration) => dispatchOne(integration, event, fetchImpl).catch((err) => {
    console.error('[crm/integrations] unhandled dispatch error:', err);
  })));
}
