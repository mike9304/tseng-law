/**
 * SSRF guard for outbound webhook delivery.
 *
 * Admin-created subscription URLs are user-controlled. Without this check
 * an admin (or anyone who compromises the admin endpoint) could target:
 *   - loopback / link-local (127.0.0.1, 0.0.0.0, ::1)
 *   - private RFC1918 ranges (10.x, 172.16-31.x, 192.168.x)
 *   - cloud metadata endpoints (169.254.169.254 AWS/GCP IMDS, fd00:ec2::/8)
 *   - file:// gopher:// data: etc. — defense in depth on top of fetch()'s
 *     own protocol restrictions
 *
 * This is admin-level SSRF (the admin already has a strong privilege), but
 * blocking it limits damage from a compromised admin session and prevents
 * accidental misconfiguration that exfiltrates secrets.
 */

import { isIP } from 'node:net';

/**
 * Validate that a URL is safe for outbound webhook delivery.
 *
 * Returns null if the URL passes all checks, otherwise returns a short
 * machine-readable reason string suitable for delivery error logging.
 */
export function reasonUrlUnsafe(rawUrl: string): string | null {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return 'invalid_url';
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return 'protocol_not_allowed';
  }
  const host = url.hostname.toLowerCase();
  if (!host) return 'empty_host';

  // Hostname-based blocks (covers DNS aliases like "localhost").
  if (host === 'localhost' || host.endsWith('.localhost')) return 'loopback_host';
  if (host === '0.0.0.0' || host === '0' || host === '::' || host === '[::]') return 'wildcard_host';

  // If hostname is a literal IP, classify it directly.
  const stripped = host.startsWith('[') && host.endsWith(']') ? host.slice(1, -1) : host;
  const ipKind = isIP(stripped);
  if (ipKind === 4) {
    if (isIpv4Private(stripped)) return 'private_ipv4';
  } else if (ipKind === 6) {
    if (isIpv6Private(stripped)) return 'private_ipv6';
  }
  // Note: DNS rebinding (hostname → private IP at fetch time) is not
  // mitigated here without resolving the address ourselves. For our threat
  // model (admin misconfiguration / compromised admin), the synchronous
  // string-level check above blocks the common cases. A custom dispatcher
  // with DNS resolution + IP recheck would close the rebinding gap but
  // costs an extra DNS round-trip per delivery.

  return null;
}

function isIpv4Private(ip: string): boolean {
  const parts = ip.split('.').map((p) => Number.parseInt(p, 10));
  if (parts.length !== 4 || parts.some((p) => !Number.isInteger(p) || p < 0 || p > 255)) {
    return true; // treat malformed as unsafe
  }
  const [a, b] = parts;
  // 0.0.0.0/8 — "this network"
  if (a === 0) return true;
  // 10.0.0.0/8
  if (a === 10) return true;
  // 100.64.0.0/10 — CGNAT
  if (a === 100 && b >= 64 && b <= 127) return true;
  // 127.0.0.0/8 — loopback
  if (a === 127) return true;
  // 169.254.0.0/16 — link-local (includes AWS/GCP metadata 169.254.169.254)
  if (a === 169 && b === 254) return true;
  // 172.16.0.0/12 — private
  if (a === 172 && b >= 16 && b <= 31) return true;
  // 192.0.0.0/24, 192.0.2.0/24, 192.88.99.0/24
  if (a === 192 && (b === 0 || b === 88)) return true;
  // 192.168.0.0/16 — private
  if (a === 192 && b === 168) return true;
  // 198.18.0.0/15 — benchmarking
  if (a === 198 && (b === 18 || b === 19)) return true;
  // 198.51.100.0/24, 203.0.113.0/24 — documentation
  if (a === 198 && b === 51) return true;
  if (a === 203 && b === 0) return true;
  // 224.0.0.0/4 multicast, 240.0.0.0/4 reserved, 255.255.255.255 broadcast
  if (a >= 224) return true;
  return false;
}

function isIpv6Private(ip: string): boolean {
  const lower = ip.toLowerCase();
  // Loopback ::1
  if (lower === '::1') return true;
  // Unspecified ::
  if (lower === '::' || lower === '0:0:0:0:0:0:0:0') return true;
  // Link-local fe80::/10
  if (lower.startsWith('fe80:') || lower.startsWith('fe8') || lower.startsWith('fe9') || lower.startsWith('fea') || lower.startsWith('feb')) {
    return true;
  }
  // Unique local fc00::/7
  if (lower.startsWith('fc') || lower.startsWith('fd')) return true;
  // IPv4-mapped ::ffff:x.x.x.x — dotted form
  const dottedMatch = lower.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (dottedMatch) return isIpv4Private(dottedMatch[1]);
  // IPv4-mapped ::ffff:XXXX:YYYY — hex form (Node URL canonicalizes to this).
  // Decode the two trailing hex groups into a dotted v4 and re-check.
  const hexMatch = lower.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
  if (hexMatch) {
    const high = Number.parseInt(hexMatch[1], 16);
    const low = Number.parseInt(hexMatch[2], 16);
    if (Number.isFinite(high) && Number.isFinite(low)) {
      const a = (high >> 8) & 0xff;
      const b = high & 0xff;
      const c = (low >> 8) & 0xff;
      const d = low & 0xff;
      return isIpv4Private(`${a}.${b}.${c}.${d}`);
    }
  }
  // Conservative: ANY ::ffff: prefix (other forms) is IPv4-mapped and
  // suspicious enough to block — legitimate webhooks shouldn't use this.
  if (lower.startsWith('::ffff:')) return true;
  return false;
}
