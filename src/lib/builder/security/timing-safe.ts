import { timingSafeEqual } from 'node:crypto';

/**
 * Constant-time string comparison. Always allocates buffers of equal length
 * to avoid leaking the unknown string's length via early-return timing.
 *
 * Returns false for unequal lengths (without a length-based fast path) and
 * for any non-string input.
 */
export function safeEqualStrings(a: unknown, b: unknown): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  // timingSafeEqual requires equal length. Compare length in constant time by
  // padding both to the longer length and tracking the length mismatch.
  const len = Math.max(aBuf.length, bBuf.length);
  const aPadded = Buffer.alloc(len);
  const bPadded = Buffer.alloc(len);
  aBuf.copy(aPadded);
  bBuf.copy(bPadded);
  const equal = timingSafeEqual(aPadded, bPadded);
  return equal && aBuf.length === bBuf.length;
}
