import { promises as dns } from 'node:dns';

/**
 * PR #12 — DNS verification.
 *
 * Two checks are run:
 *   1) `_vercel.<domain>` TXT record contains the expected token.
 *   2) `<domain>` resolves a CNAME pointing at `cname.vercel-dns.com`
 *      (or an A record pointing at Vercel's apex IP when CNAME is not
 *      possible at the zone apex).
 *
 * The Node 18+ `dns/promises` API is used directly — no external lib.
 */

export interface DnsCheckResult {
  txtMatched: boolean;
  cnameMatched: boolean;
  txtValues: string[];
  cnameValues: string[];
  aValues: string[];
  /** Convenience flag: TXT + (CNAME OR Vercel A record). */
  verified: boolean;
}

const VERCEL_CNAME_TARGETS = ['cname.vercel-dns.com', 'cname-china.vercel-dns.com'];
const VERCEL_APEX_IPS = ['76.76.21.21'];

export async function verifyDomainDns(domain: string, expectedToken: string): Promise<DnsCheckResult> {
  const normalized = domain.trim().toLowerCase();
  const result: DnsCheckResult = {
    txtMatched: false,
    cnameMatched: false,
    txtValues: [],
    cnameValues: [],
    aValues: [],
    verified: false,
  };

  try {
    const txts = await dns.resolveTxt(`_vercel.${normalized}`);
    result.txtValues = txts.map((parts) => parts.join(''));
    result.txtMatched = result.txtValues.some((line) => line.includes(expectedToken));
  } catch {
    /* no TXT yet */
  }

  try {
    const cnames = await dns.resolveCname(normalized);
    result.cnameValues = cnames.map((value) => value.toLowerCase());
    result.cnameMatched = result.cnameValues.some((value) => VERCEL_CNAME_TARGETS.includes(value));
  } catch {
    /* not a CNAME */
  }

  if (!result.cnameMatched) {
    try {
      const records = await dns.resolve4(normalized);
      result.aValues = records;
      if (records.some((ip) => VERCEL_APEX_IPS.includes(ip))) {
        result.cnameMatched = true; // Apex A record treated as equivalent.
      }
    } catch {
      /* no A record either */
    }
  }

  result.verified = result.txtMatched && result.cnameMatched;
  return result;
}
