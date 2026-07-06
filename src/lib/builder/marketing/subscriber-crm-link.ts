import { runAutomationsForEvent } from '@/lib/builder/crm/automation-engine';
import { dispatchToIntegrations } from '@/lib/builder/crm/integrations-dispatcher';
import { mergeContactByEmail } from '@/lib/builder/crm/contact-store';
import type { Locale } from '@/lib/locales';

export interface SubscriberCrmLinkInput {
  email: string;
  preferredLocale: Locale;
  source: string;
  tags: readonly string[];
}

export interface SubscriberCrmLinkResult {
  contactId: string;
  created: boolean;
}

function normalizeSubscriberTags(tags: readonly string[]): string[] {
  return Array.from(new Set(['subscriber', ...tags.map((tag) => tag.trim()).filter(Boolean)]));
}

export async function linkSubscriberToCrmContact(
  input: SubscriberCrmLinkInput,
): Promise<SubscriberCrmLinkResult> {
  const subscriberTags = normalizeSubscriberTags(input.tags);
  const { contact, created } = await mergeContactByEmail({
    email: input.email,
    source: 'form',
    tags: subscriberTags,
    customFields: {
      preferredLocale: input.preferredLocale,
      subscriberSource: input.source,
    },
  });

  if (created) {
    try {
      await runAutomationsForEvent({
        kind: 'contact-created',
        contact,
        payload: { source: 'marketing-subscriber', subscriberSource: input.source },
      });
    } catch (error) {
      console.error('[builder/marketing/subscriber-crm-link] automation dispatch failed:', error);
    }
  }

  try {
    await dispatchToIntegrations({
      kind: created ? 'contact-created' : 'tag-added',
      contact,
      payload: {
        source: 'marketing-subscriber',
        subscriberSource: input.source,
        tags: subscriberTags,
      },
    });
  } catch (error) {
    console.error('[builder/marketing/subscriber-crm-link] integration dispatch failed:', error);
  }

  return { contactId: contact.id, created };
}
