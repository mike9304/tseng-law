# B7 local release verification

This directory owns the B7 artifact evidence only. The B6 harnesses and previous artifacts remain unchanged. No source editing, commit, push, deployment, remote Worker invocation or infrastructure change is part of these commands.

The explicit content commit is `51286ef9817aab5178b9237fa2041877d4df7c4a`. Every command below requires `EXPECTED_COMMIT` to be set to that full value. Node is `/Users/son7/.nvm/versions/node/v24.14.1/bin/node`.

## Build

From this directory, with Node24 on PATH and the explicit commit in the environment:

```sh
python3 verification/run-full-build.py
```

The wrapper checks clean R HEAD and port 4641, refuses to overwrite an artifact, freezes source Markdown and tracked src/scripts hashes, and runs:

```sh
node scripts/static-site/build.mjs --out=out-all-locales-batch07-release26-r2 --port=4641 --media-origin=https://media.tseng-law.com
```

This is a full build. `--data` is intentionally omitted: the data mode is local fallback, not verified parity with Air's production CMS mirror. The build command, log, media manifest and static report are preserved under `batch07/checks/static-build-release26-r2-*`. A build failure is preserved before any follow-up decision.

## Completed-artifact checks

After build exit 0, run in order:

```sh
python3 verification/snapshot.py before
node verification/static-cases90.mjs
node verification/static-arc147-regression.mjs
python3 verification/run-browser.py primary
python3 verification/run-browser.py he706
python3 verification/run-pack.py
python3 verification/snapshot.py after
```

The static case check covers all 90 actual versions: six original source pages, 42 earlier B6 translations and 42 new B7 translations. Each case must have exactly 15 reciprocal versions in HTML, footer and sitemap. Original publication dates remain October 25; translations use October 26. Modification dates follow each source, including already approved October 26 source corrections. All source body blocks, FAQ, metadata, images and source-AST table counts are compared.

The independent ARC regression covers 147 pages and 49 reciprocal languages. The primary browser run contains 42 desktop (1440px), 42 mobile (390px), seven slow-stream, seven no-JavaScript and six home49/legacyKO3 navigation cases: 104 total. One separate HE706 mobile case checks the unchanged article23-1/table regression. FA's six pages receive true-RTL DOM, ASCII/Persian/Arabic-Indic numeral, letter-digit identifier and table geometry checks. Browser language tags are rendering settings, not nationality assumptions.

The browser is isolated Chromium1248. The source page and opened language menu each wait for font readiness and network idle. No-JavaScript Chromium CSP-blocked script preloads are recorded separately; request, HTTP, runtime and hydration failures otherwise remain failures. Every first-run log/result/screenshot is retained. A retry, if justified, needs a separate result path and an explicit explanation.

The package uses R's unchanged default packer and Worker, with hashes compared to B6. The opt-in capacity candidate is not imported. All packed HTML is gunzipped and compared byte for byte; other assets and headers are compared unchanged. Expanded size, 256MiB headroom, Worker/config bytes, source and artifact hashes are recorded. This is local artifact verification, not a production deployment or a legal/native-language approval.

This R2 build includes root’s legal-identifier bdi renderer fix. The initial release26 artifact and98/104 browser result remain unchanged. Compare all90 case and147 ARC article-body DOMs to the first artifact, allowing only exact bdi dir=ltr wrappers around the same original identifier text. FAQ and href values must remain identical. Capture the actual new FA915/919 links separately; temporary DOM previews are not R2 pass evidence.
