#!/usr/bin/env node
// Uploads the videos listed in static-site-media.json (written by build.mjs --media-origin) to the
// Cloudflare R2 bucket behind the media origin. Needs `npx wrangler@4.149.0 login` first.
//
//   node scripts/static-site/upload-media.mjs --bucket=tseng-law-media [--concurrency=4] [--dry-run]
//
// A file whose public copy already has the same Content-Length is skipped, so the script can be
// re-run after an interruption or after new videos are added.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT } from './shared.mjs';

const WRANGLER = ['-y', 'wrangler@4.149.0'];
const TYPES = {
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime', '.m4v': 'video/mp4', '.vtt': 'text/vtt',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
};

function parseArgs(argv) {
  const args = { bucket: null, concurrency: 4, dryRun: false };
  for (const arg of argv) {
    if (arg.startsWith('--bucket=')) args.bucket = arg.slice(9);
    else if (arg.startsWith('--concurrency=')) args.concurrency = Number(arg.slice(14));
    else if (arg === '--dry-run') args.dryRun = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!args.bucket) throw new Error('--bucket is required');
  return args;
}

function wrangler(args) {
  return new Promise((resolve) => {
    const child = spawn('npx', [...WRANGLER, ...args], { cwd: REPO_ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '';
    child.stdout.on('data', (chunk) => { output += chunk; });
    child.stderr.on('data', (chunk) => { output += chunk; });
    child.on('exit', (code) => resolve({ code, output }));
  });
}

async function publicSize(url) {
  try {
    // A unique query string keeps the probe's 404 out of the edge cache entry visitors will use.
    const response = await fetch(`${url}?probe=${Date.now()}`, { method: 'HEAD', signal: AbortSignal.timeout(30_000) });
    return response.ok ? Number(response.headers.get('content-length')) : null;
  } catch {
    return null;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const manifest = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'static-site-media.json'), 'utf8'));

  const results = { uploaded: [], skipped: [], failed: [] };
  let index = 0;
  const worker = async () => {
    while (index < manifest.files.length) {
      const file = manifest.files[index++];
      const url = `${manifest.mediaOrigin}/${file.key}`;
      if ((await publicSize(url)) === file.bytes) {
        results.skipped.push(file.key);
        continue;
      }
      if (args.dryRun) {
        results.uploaded.push(file.key);
        continue;
      }
      let attempt = 0;
      let last;
      while (attempt < 3) {
        attempt += 1;
        last = await wrangler([
          'r2', 'object', 'put', `${args.bucket}/${file.key}`,
          '--file', file.source,
          '--content-type', TYPES[path.extname(file.key).toLowerCase()] ?? 'application/octet-stream',
          '--cache-control', 'public, max-age=86400',
          '--remote',
        ]);
        if (last.code === 0) break;
      }
      if (last.code === 0) results.uploaded.push(file.key);
      else results.failed.push({ key: file.key, output: last.output.slice(-400) });
      const done = results.uploaded.length + results.skipped.length + results.failed.length;
      if (done % 20 === 0) console.log(`[upload-media] ${done}/${manifest.files.length}`);
    }
  };
  await Promise.all(Array.from({ length: args.concurrency }, worker));
  fs.writeFileSync(path.join(REPO_ROOT, 'static-site-media-upload.json'), `${JSON.stringify(results, null, 2)}\n`);
  console.log(`[upload-media] uploaded ${results.uploaded.length}, skipped ${results.skipped.length}, failed ${results.failed.length}`);
  if (results.failed.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
