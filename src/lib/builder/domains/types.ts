/**
 * PR #12 — Custom domain binding.
 *
 * Lifecycle:
 *   pending-dns  — domain registered, waiting for the user to add TXT/CNAME.
 *   verifying    — DNS records exist; Vercel alias creation in flight.
 *   active       — Vercel alias attached and SSL provisioned.
 *   error        — last verification or provisioning attempt failed.
 *   removed      — soft delete (kept for audit).
 */
export type DomainStatus = 'pending-dns' | 'verifying' | 'active' | 'error' | 'removed';

export interface DomainBinding {
  domainId: string;
  /** Apex or subdomain, lowercased. */
  domain: string;
  /** TXT verification token the user must publish under `_vercel.<domain>`. */
  verificationToken: string;
  /** CNAME target the user should point the domain at (`cname.vercel-dns.com`). */
  cnameTarget: string;
  status: DomainStatus;
  lastError?: string;
  lastVerifiedAt?: string;
  vercelDomainId?: string;
  createdAt: string;
  updatedAt: string;
}
