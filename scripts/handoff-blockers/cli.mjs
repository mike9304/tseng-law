import { checkAdminAuth, checkProviders, checkStaticAssets } from './checks.mjs';
import { loadEnv } from './env.mjs';
import {
  payloadFor,
  payloadWithMetadata,
  exitCodeFor,
  printHuman,
  printJson,
  writeJsonOutput,
} from './reporting.mjs';

const DEFAULT_BASE_URL = 'https://tseng-law.com';

export function parseArgs(argv) {
  const args = {
    base: DEFAULT_BASE_URL,
    help: false,
    json: false,
    metadata: false,
    output: null,
    softOpen: false,
  };
  for (const arg of argv) {
    if (arg === '-h' || arg === '--help') {
      args.help = true;
      continue;
    }
    if (arg === '--json') {
      args.json = true;
      continue;
    }
    if (arg === '--metadata') {
      args.metadata = true;
      continue;
    }
    if (arg === '--soft-open') {
      args.softOpen = true;
      continue;
    }
    if (arg.startsWith('--base=')) {
      args.base = arg.slice('--base='.length);
      continue;
    }
    if (arg.startsWith('--output=')) {
      args.output = arg.slice('--output='.length);
      if (!args.output) throw new Error('--output must not be empty');
      continue;
    }
    throw new Error('Unknown argument');
  }
  return args;
}

export function usage() {
  console.log('Usage: node scripts/handoff-blockers-gate.mjs [--json] [--metadata] [--soft-open] [--base=<url>] [--output=<path>]');
}

function isLoopbackHost(hostname) {
  const normalized = hostname.toLowerCase().replace(/^\[(.*)\]$/, '$1');
  return normalized === 'localhost' || normalized === '127.0.0.1' || normalized === '::1';
}

export function normalizeBaseUrl(raw) {
  let url;
  try {
    url = new URL(raw || DEFAULT_BASE_URL);
  } catch {
    throw new Error('--base must be a valid URL');
  }
  if (url.username || url.password) {
    throw new Error('--base must not include credentials');
  }
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && isLoopbackHost(url.hostname))) {
    throw new Error('--base must use https unless it is loopback http');
  }
  url.hash = '';
  url.search = '';
  return url.toString().replace(/\/+$/, '');
}

function displayBaseUrl(raw) {
  try {
    const url = new URL(raw || DEFAULT_BASE_URL);
    url.username = '';
    url.password = '';
    url.hash = '';
    url.search = '';
    return url.toString().replace(/\/+$/, '');
  } catch {
    return DEFAULT_BASE_URL;
  }
}

function rawBaseFromArgv(argv) {
  const baseArg = argv.find((arg) => arg.startsWith('--base='));
  return baseArg ? baseArg.slice('--base='.length) : DEFAULT_BASE_URL;
}

function errorPayloadFor(error, argv) {
  const message = error instanceof Error ? error.message : 'handoff blocker gate failed';
  const payload = payloadFor(displayBaseUrl(rawBaseFromArgv(argv)), [
    {
      status: 'FAIL',
      line: `FAIL handoff blocker gate: ${message}`,
      ok: false,
    },
  ]);
  if (!argv.includes('--metadata')) return payload;
  return payloadWithMetadata(
    payload,
    { softOpen: argv.includes('--soft-open') },
    new Date().toISOString(),
    1,
  );
}

export async function main(argv) {
  const args = parseArgs(argv);
  if (args.help) {
    usage();
    return 0;
  }

  const baseUrl = normalizeBaseUrl(args.base);
  const env = await loadEnv();
  const results = [];

  await checkStaticAssets(baseUrl, results);
  await checkAdminAuth(baseUrl, env, results);
  checkProviders(env, results);

  const payload = payloadFor(baseUrl, results);
  const effectiveExitCode = exitCodeFor(payload, args);
  const outputPayload = args.metadata
    ? payloadWithMetadata(payload, args, new Date().toISOString(), effectiveExitCode)
    : payload;
  if (args.output) {
    await writeJsonOutput(args.output, outputPayload);
  }
  if (args.json) {
    printJson(outputPayload);
  } else {
    printHuman(outputPayload);
  }
  return effectiveExitCode;
}

export function printError(error, argv) {
  const payload = errorPayloadFor(error, argv);
  if (argv.includes('--json')) {
    printJson(payload);
  } else {
    console.error(payload.results[0].line);
  }
  return 1;
}
