/**
 * Marketing sender identity.
 *
 * Owner decision 2026-09-17: marketing mail is sent from the tseng-law.com
 * domain, not from the firm's Workspace domain. Replies still go to the
 * existing office mailbox because tseng-law.com has no MX record, so nothing
 * can be received there.
 *
 * Before the first campaign send, tseng-law.com needs SPF, DKIM, DMARC and
 * Postmaster Tools registration (docs/marketing/CAMPAIGN-BRIEF-SKELETON-2026-Q4.md
 * WO-EM-0ⓐ). This constant only fixes the address the engine defaults to.
 */

export const MARKETING_FROM_ADDRESS = 'newsletter@tseng-law.com';
export const MARKETING_FROM_NAME = '법무법인 호정';
/** tseng-law.com cannot receive mail; replies go to the office mailbox. */
export const MARKETING_REPLY_TO_ADDRESS = 'wei@hoveringlaw.com.tw';
