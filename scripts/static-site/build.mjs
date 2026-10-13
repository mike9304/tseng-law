#!/usr/bin/env node
// Builds the static copy of the public site for ChatGPT Sites (docs/static-site/README.md).
//
//   node scripts/static-site/build.mjs [--data=<mirror dir>] [--out=out] [--port=4610]
//                                      [--media-origin=https://media.tseng-law.com]
//                                      [--skip-build] [--limit=<pages>]
//
// 1. `next build` with NEXT_PUBLIC_STATIC_SITE=1 into .next-static (src/lib/static-site.ts)
// 2. `next start` on 127.0.0.1, reading builder content from files (--data), never from Blob
// 3. crawl every public page → assemble out/ → verify → static-site-report.json
import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { assembleSite } from './assemble.mjs';
import { crawlSite } from './crawl.mjs';
import { REPO_ROOT, SITE_ORIGIN, STATIC_DIST_DIR } from './shared.mjs';
import { verifySite } from './verify.mjs';

const NEXT_BIN = path.join(REPO_ROOT, 'node_modules', 'next', 'dist', 'bin', 'next');

// Remote stores the snapshot must not read: content comes from the frozen files only.
const REMOTE_STORE_ENV = [
  'BLOB_READ_WRITE_TOKEN',
  'KV_URL',
  'KV_REST_API_URL',
  'KV_REST_API_TOKEN',
  'KV_REST_API_READ_ONLY_TOKEN',
  'REDIS_URL',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'NEXT_PUBLIC_SENTRY_DSN',
];

function parseArgs(argv) {
  const args = { data: null, out: 'out', port: 4610, skipBuild: false, limit: Infinity, mediaOrigin: null };
  for (const arg of argv) {
    if (arg.startsWith('--data=')) args.data = path.resolve(arg.slice(7));
    else if (arg.startsWith('--out=')) args.out = arg.slice(6) || args.out;
    else if (arg.startsWith('--port=')) args.port = Number(arg.slice(7));
    else if (arg === '--skip-build') args.skipBuild = true;
    else if (arg.startsWith('--limit=')) args.limit = Number(arg.slice(8));
    else if (arg.startsWith('--media-origin=')) args.mediaOrigin = new URL(arg.slice(15)).origin;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

// Next fills keys that are *undefined* from .env files, so the snapshot refuses to run next to
// one rather than risk reading production stores or enabling Sentry source maps.
const ENV_FILES = ['.env', '.env.local', '.env.production', '.env.production.local'];

function snapshotEnv(data) {
  const present = ENV_FILES.filter((name) => fs.existsSync(path.join(REPO_ROOT, name)));
  if (present.length) throw new Error(`Refusing to build next to ${present.join(', ')}; move them out of the checkout first.`);
  const env = { ...process.env };
  for (const key of REMOTE_STORE_ENV) env[key] = '';
  Object.assign(env, {
    NEXT_PUBLIC_STATIC_SITE: '1',
    NEXT_DIST_DIR: STATIC_DIST_DIR,
    NEXT_PUBLIC_SITE_URL: SITE_ORIGIN,
    NEXT_TELEMETRY_DISABLED: '1',
    // Server-only features stay off in the static copy (no API behind it).
    NEXT_PUBLIC_AI_INTAKE_DISCOVERY_ENABLED: 'false',
    NEXT_PUBLIC_ENABLE_AI_CHAT: '',
  });
  if (data) {
    for (const [key, dir] of [
      ['BUILDER_SITE_ROOT', 'builder-site'],
      ['CONSULTATION_COLUMNS_DIR', 'consultation-columns'],
      ['BUILDER_FAQ_ROOT', 'builder-faq'],
    ]) {
      const full = path.join(data, dir);
      if (!fs.existsSync(full)) throw new Error(`--data is missing ${dir}/ (${full})`);
      env[key] = full;
    }
  }
  return env;
}

function run(command, args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: REPO_ROOT, env, stdio: 'inherit' });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${command} ${args.join(' ')} exited ${code}`))));
  });
}

async function waitForServer(base, child) {
  for (let i = 0; i < 120; i += 1) {
    if (child.exitCode !== null) throw new Error(`next start exited ${child.exitCode}`);
    try {
      const response = await fetch(`${base}/robots.txt`);
      if (response.ok) return;
    } catch {
      // not listening yet
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error('next start did not become ready in 120s');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const env = snapshotEnv(args.data);
  if (!args.data) console.warn('[static-site] no --data: builder pages render from repo files only (legacy fallback).');

  if (!args.skipBuild) {
    // `next build` with a separate distDir rewrites these to point at .next-static; keep the repo clean.
    const tracked = ['tsconfig.json', 'next-env.d.ts'].map((name) => [name, fs.readFileSync(path.join(REPO_ROOT, name))]);
    const restore = () => {
      for (const [name, content] of tracked) fs.writeFileSync(path.join(REPO_ROOT, name), content);
    };
    const onSignal = () => {
      restore();
      process.exit(130);
    };
    process.once('SIGINT', onSignal);
    process.once('SIGTERM', onSignal);
    try {
      // Lint is the QA gate's job (npm run qa); a lint slip elsewhere must not block packaging.
      await run(process.execPath, [NEXT_BIN, 'build', '--no-lint'], env);
    } finally {
      restore();
      process.off('SIGINT', onSignal);
      process.off('SIGTERM', onSignal);
    }
  }

  const base = `http://127.0.0.1:${args.port}`;
  if (await fetch(`${base}/robots.txt`).then(() => true, () => false)) {
    throw new Error(`Port ${args.port} is already serving; stop that server or pass --port.`);
  }
  const server = spawn(process.execPath, [NEXT_BIN, 'start', '-H', '127.0.0.1', '-p', String(args.port)], {
    cwd: REPO_ROOT,
    env: { ...env, NODE_ENV: 'production' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const serverLog = fs.createWriteStream(path.join(REPO_ROOT, '.static-site-server.log'));
  server.stdout.pipe(serverLog);
  server.stderr.pipe(serverLog);

  try {
    await waitForServer(base, server);
    const crawlDir = path.join(REPO_ROOT, '.static-site-crawl');
    fs.rmSync(crawlDir, { recursive: true, force: true });
    const started = Date.now();
    const crawl = await crawlSite({ base, outDir: crawlDir, limit: args.limit, log: (line) => console.log(`[crawl] ${line}`) });
    console.log(`[static-site] crawled ${crawl.pages.length} pages, ${crawl.files.length} files, ${crawl.redirects.length} redirects in ${Math.round((Date.now() - started) / 1000)}s`);

    const outDir = path.resolve(REPO_ROOT, args.out);
    const assembled = await assembleSite({ crawlDir, outDir, crawl, mediaOrigin: args.mediaOrigin });
    // Lets anyone check which commit is live: curl https://tseng-law.com/build-info.json
    const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: REPO_ROOT, encoding: 'utf8' }).trim();
    fs.writeFileSync(path.join(outDir, 'build-info.json'), `${JSON.stringify({ commit, builtAt: new Date().toISOString() }, null, 2)}\n`);
    const verification = verifySite({ outDir });
    const report = {
      generatedAt: new Date().toISOString(),
      data: args.data ? path.relative(REPO_ROOT, args.data) : null,
      crawl: {
        pages: crawl.pages.length,
        files: crawl.files,
        redirects: crawl.redirects,
        missing: crawl.missing,
        serverOnlyLinks: Object.fromEntries(Object.entries(crawl.serverOnlyLinks).map(([k, v]) => [k, { count: v.length, from: v.slice(0, 3) }])),
        notFoundPages: crawl.notFoundPages,
      },
      assembled,
      verification,
    };
    fs.writeFileSync(path.join(REPO_ROOT, 'static-site-report.json'), `${JSON.stringify(report, null, 2)}\n`);
    console.log(`[static-site] out: ${verification.files} files, ${(verification.bytes / 1024 / 1024).toFixed(1)} MB, `
      + `${verification.htmlPages} html; sitemap ${verification.sitemapUrls - verification.sitemapMissing.length}/${verification.sitemapUrls}; `
      + `broken refs ${Object.keys(verification.brokenRefs).length}; oversize ${verification.oversize.length}; crawl missing ${crawl.missing.length}`);
    if (assembled.media.origin) {
      console.log(`[static-site] media: ${assembled.media.files} files (${(assembled.media.bytes / 1024 / 1024).toFixed(1)} MB) → ${assembled.media.origin}; `
        + `${assembled.media.referenced} referenced, missing locally: ${assembled.media.missingReferences.join(', ') || 'none'}`);
    }
    if (verification.sitemapMissing.length || verification.oversize.length) process.exitCode = 1;
  } finally {
    server.kill('SIGTERM');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
