import { createHmac } from 'node:crypto';
import { safeEqualStrings } from '@/lib/builder/security/timing-safe';

const SIGNATURE_DOMAIN = 'tseng-law/marketing-click/v1';
const MAX_FIELD_LENGTH = 0xffff_ffff;

function encodeLengthDelimitedField(value: string): Buffer {
  const bytes = Buffer.from(value, 'utf8');
  if (bytes.length > MAX_FIELD_LENGTH) {
    throw new RangeError('Marketing click signature field is too large.');
  }
  const length = Buffer.allocUnsafe(4);
  length.writeUInt32BE(bytes.length);
  return Buffer.concat([length, bytes]);
}

function signaturePayload(trackingToken: string, destinationUrl: string): Buffer {
  return Buffer.concat([
    encodeLengthDelimitedField(SIGNATURE_DOMAIN),
    encodeLengthDelimitedField(trackingToken),
    encodeLengthDelimitedField(destinationUrl),
  ]);
}

export function resolveMarketingTrackingSecret(): string | null {
  const candidates = [
    process.env.MARKETING_TRACKING_SECRET,
    process.env.CRM_TRACKING_SECRET,
    process.env.CRM_WEBHOOK_SECRET,
    process.env.NEXTAUTH_SECRET,
    process.env.BUILDER_WEBHOOK_SECRET,
  ];
  for (const candidate of candidates) {
    const trimmed = candidate?.trim();
    if (trimmed) return trimmed;
  }
  return null;
}

export function createMarketingClickSignature(
  trackingToken: string,
  destinationUrl: string,
  secret: string,
): string {
  return createHmac('sha256', secret)
    .update(signaturePayload(trackingToken, destinationUrl))
    .digest('base64url');
}

export function verifyMarketingClickSignature(
  trackingToken: string,
  destinationUrl: string,
  signature: string,
  secret: string,
): boolean {
  let expected: string;
  try {
    expected = createMarketingClickSignature(trackingToken, destinationUrl, secret);
  } catch {
    return false;
  }
  return safeEqualStrings(signature, expected);
}
