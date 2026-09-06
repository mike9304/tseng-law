import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();
const PHASE2_DIRS = [
  'src/lib/ai-intake/mcp',
  'src/lib/ai-intake/openapi',
  'src/app/api/ai/mcp',
  'src/app/api/ai/openapi.json',
  'src/app/[locale]/ai-intake',
];

const FORBIDDEN_MAIL = /\bnodemailer\b|\bsendMail\b|\bprepareAiIntakeMailSend\b|\bcreateTransport\b|\bSMTP_HOST\b|\bSMTP_PASS\b/;
const FORBIDDEN_FETCH = /(?<![\w.])fetch\s*\(|\baxios\b|\bhttp\.request\b/;
const FORBIDDEN_BOOKING = /\bcreateBooking\b|\btext\/calendar\b|\bVEVENT\b|\bgoogle\.calendar\b|\bics\b/;

function listFiles(dir: string): string[] {
  const abs = join(ROOT, dir);
  const entries = readdirSync(abs);
  const files: string[] = [];
  for (const entry of entries) {
    const path = join(abs, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      if (entry === '__tests__') continue;
      files.push(...listFiles(join(dir, entry)));
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry) && !entry.endsWith('.test.ts') && !entry.endsWith('.test.tsx')) {
      files.push(join(dir, entry));
    }
  }
  return files;
}

describe('Phase 2 adapter/page mail-path boundary', () => {
  it('does not import nodemailer, SMTP, a second mail builder, self-fetch, or booking implementation', () => {
    for (const dir of PHASE2_DIRS) {
      for (const relative of listFiles(dir)) {
        const source = readFileSync(join(ROOT, relative), 'utf8');
        expect(source, relative).not.toMatch(FORBIDDEN_MAIL);
        expect(source, relative).not.toMatch(FORBIDDEN_FETCH);
        expect(source, relative).not.toMatch(FORBIDDEN_BOOKING);
      }
    }
  });
});
