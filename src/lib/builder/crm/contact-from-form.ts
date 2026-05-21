/**
 * Best-effort adapter from form submissions to CRM contacts.
 *
 * Public form endpoint (`/api/forms/submit`) calls
 * `recordFormSubmissionAsContact` after successful validation. All errors are
 * swallowed and logged — CRM failures must NEVER break the form path.
 */

import { mergeContactByEmail } from './contact-store';
import { runAutomationsForEvent } from './automation-engine';
import { dispatchToIntegrations } from './integrations-dispatcher';

const EMAIL_FIELD_HINTS = /(^|[._-])(email|mail|e_mail|이메일|電郵|信箱)([._-]|$)/i;
const NAME_FIELD_HINTS = /(^|[._-])(name|fullname|이름|姓名)([._-]|$)/i;
const PHONE_FIELD_HINTS = /(^|[._-])(phone|tel|mobile|연락처|電話|手機)([._-]|$)/i;

function pickField(
  fields: Record<string, string>,
  predicate: (key: string) => boolean,
): string | undefined {
  for (const [key, value] of Object.entries(fields)) {
    if (!value || typeof value !== 'string') continue;
    if (predicate(key)) {
      const trimmed = value.trim();
      if (trimmed) return trimmed;
    }
  }
  return undefined;
}

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export interface FormSubmissionExtract {
  formName: string;
  /** Form field id → value, after schema validation. */
  fields: Record<string, string>;
  /** Field ids whose values should be merged into the contact's tag list. */
  tagFieldIds?: readonly string[];
  /** Tags derived from the form definition (always applied). */
  extraTags?: readonly string[];
}

export interface RecordFormSubmissionResult {
  contactId: string;
  created: boolean;
}

/**
 * Public entry point invoked from /api/forms/submit. Returns the resulting
 * contact id (or null when no email is present). Always succeeds; failures
 * are logged.
 */
export async function recordFormSubmissionAsContact(
  submission: FormSubmissionExtract,
): Promise<RecordFormSubmissionResult | null> {
  try {
    const { fields, formName } = submission;

    const explicitEmail =
      pickField(fields, (key) => EMAIL_FIELD_HINTS.test(key)) ??
      pickField(fields, (_) => false) ??
      pickField(fields, () => true && false);
    const fallbackEmail = explicitEmail ?? Object.values(fields).find((value) => typeof value === 'string' && looksLikeEmail(value));
    const email = explicitEmail && looksLikeEmail(explicitEmail) ? explicitEmail : fallbackEmail;
    if (!email || !looksLikeEmail(email)) return null;

    const name = pickField(fields, (key) => NAME_FIELD_HINTS.test(key));
    const phone = pickField(fields, (key) => PHONE_FIELD_HINTS.test(key));

    const tagFromFields = (submission.tagFieldIds ?? [])
      .map((id) => fields[id]?.trim())
      .filter((value): value is string => Boolean(value));
    const tags = Array.from(
      new Set(
        [
          `form:${formName}`,
          ...(submission.extraTags ?? []),
          ...tagFromFields,
        ].filter(Boolean),
      ),
    );

    const { contact, created } = await mergeContactByEmail({
      email,
      name,
      phone,
      source: 'form',
      tags,
    });

    // Fire automations + integrations (best-effort).
    try {
      await runAutomationsForEvent({
        kind: 'form-submitted',
        contact,
        payload: { formName, fields },
      });
      if (created) {
        await runAutomationsForEvent({
          kind: 'contact-created',
          contact,
          payload: { formName, source: 'form' },
        });
      }
      await dispatchToIntegrations({
        kind: 'form-submitted',
        contact,
        payload: { formName, fields },
      });
    } catch (err) {
      console.error('[crm/contact-from-form] post-merge dispatch failed:', err);
    }

    return { contactId: contact.id, created };
  } catch (err) {
    console.error('[crm/contact-from-form] failed to record contact:', err);
    return null;
  }
}