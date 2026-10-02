# Self-hosted Noto fonts

These are the unchanged WOFF2 files, Unicode ranges, font-display:swap rules and
fallback size/ascent/descent metrics produced by Next.js 15.5.21 from the font
settings in `scripts/font-source.ts`. They replace eager imports of all 17
families with one or two stylesheets for the requested language.

`src/data/font-stylesheets.json` maps CSS variables to content-hashed files.
`node scripts/vendor-built-fonts.mjs <source-build-directory>` reproduces the
assets from a Next build using the retained source settings. Refreshing requires
building those source settings first; ordinary builds use these pinned assets
and do not contact Google Fonts. Keep existing hashed files while deployments
or browser sessions may still reference them.

The fonts are Noto Sans / Noto Serif and their script-specific families, from
Google Fonts: https://github.com/google/fonts/tree/main/ofl . Per-family SIL
Open Font License notices are in `licenses/`. No font binaries were modified.
