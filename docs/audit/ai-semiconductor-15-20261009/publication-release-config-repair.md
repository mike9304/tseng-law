# Release-config public-font assertion repair

Root authorized this test-only repair after the full gate exposed an existing mismatch. `next.config.mjs` already contains a public `/fonts/:path*` cache rule, but the test selected all cache rules as sensitive.

Changed only `scripts/security-headers-config.test.mjs`. It now asserts exactly one font rule with `public, max-age=31536000, immutable` and no `X-Robots-Tag`. Only that explicitly checked source is excluded from the sensitive set. The complete sensitive-source list and every `private, no-store, max-age=0` / `noindex, noarchive` expectation remain unchanged. Other unexpected cache or robots rules still enter the set and fail the exact comparison.

Validation with bundled Node v24.19.0:

- Direct security-header test:4/4 PASS, exit0.
- `npm run test:release-config`:9/9 PASS, exit0.
- All15 article hashes unchanged. `next.config.mjs` unchanged.
- Scope freeze now22 files. QA-generated `next-env.d.ts` was not modified by this worker and is excluded from release scope; QA owns cleanup.

Updated test SHA256: `154f012399261ccdb6d640c5363503277067114e72751e30d148c899b35642ff`. No commit, push or deployment.
