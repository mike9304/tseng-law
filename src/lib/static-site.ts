/**
 * Static-site build flag (2026-10-13 ChatGPT Sites migration, docs/static-site/README.md).
 *
 * `scripts/static-site/build.mjs` sets NEXT_PUBLIC_STATIC_SITE=1 for the snapshot build only.
 * Next inlines it at build time, so the server render and the client bundle always agree.
 * In that build there is no server behind the pages, so features that call one (member login,
 * the inquiry form API, AI chat, server search results) switch off; the Vercel build is unchanged.
 */
export const IS_STATIC_SITE = process.env.NEXT_PUBLIC_STATIC_SITE === '1';
