import process from 'node:process';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import {
  assertSiteDocumentInvariants,
  SiteInvariantError,
} from '@/lib/builder/site/site-invariants';

const SAFE_SITE_ID = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
const VALIDATION_MODE = 'migration';

function requiredArg(name: '--site' | '--mode'): string {
  const indexes = process.argv.reduce<number[]>((matches, value, index) => {
    if (value === name) matches.push(index);
    return matches;
  }, []);
  if (indexes.length !== 1) throw new Error('Invalid validator context.');
  const value = process.argv[indexes[0] + 1];
  if (!value || value.startsWith('--')) throw new Error('Invalid validator context.');
  return value;
}

function readValidationContext(): { siteId: string; mode: typeof VALIDATION_MODE } {
  const siteId = requiredArg('--site');
  const mode = requiredArg('--mode');
  if (!SAFE_SITE_ID.test(siteId) || mode !== VALIDATION_MODE) {
    throw new Error('Invalid validator context.');
  }
  return { siteId, mode };
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}

async function main(): Promise<void> {
  try {
    const context = readValidationContext();
    const document = JSON.parse(await readStdin()) as { siteId?: unknown; pages?: unknown[] };
    if (document.siteId !== context.siteId) throw new Error('Invalid validator context.');
    assertSiteDocumentInvariants(
      document as Parameters<typeof assertSiteDocumentInvariants>[0],
      {
        forbidInternalSandboxPages:
          context.mode === VALIDATION_MODE && context.siteId === DEFAULT_BUILDER_SITE_ID,
      },
    );
    process.stdout.write('{"ok":true}\n');
  } catch (error) {
    if (error instanceof SiteInvariantError) {
      const codes = [...new Set(error.issues.map((issue) => issue.code))].sort();
      process.stderr.write(`SITE_DOCUMENT_INVALID ${JSON.stringify({ codes, issueCount: error.issues.length })}\n`);
    } else {
      process.stderr.write('SITE_DOCUMENT_INVALID {"codes":["DOCUMENT_PARSE_OR_VALIDATION_ERROR"]}\n');
    }
    process.exitCode = 1;
  }
}

void main();
