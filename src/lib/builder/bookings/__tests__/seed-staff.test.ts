import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const storageSource = readFileSync(
  path.resolve(__dirname, '../storage.ts'),
  'utf8',
);

function functionBody(name: string, nextName: string): string {
  const start = storageSource.indexOf(`function ${name}`);
  const end = storageSource.indexOf(`function ${nextName}`);
  expect(start).toBeGreaterThan(-1);
  expect(end).toBeGreaterThan(start);
  return storageSource.slice(start, end);
}

describe('booking seed staff', () => {
  it('seeds only the real attorney and does not attach fake staff ids to services', () => {
    const seedStaff = functionBody('seedStaff', 'ensureSeedData');
    const seedServices = functionBody('seedServices', 'seedResources');

    expect(seedStaff).toContain("staffId: 'staff-tseng'");
    expect(seedStaff).toContain('증준외');
    expect(seedStaff).toContain('曾雋崴');
    expect(seedStaff).not.toContain('staff-lee');
    expect(seedStaff).not.toContain('staff-park');
    expect(seedStaff).not.toContain('이정민');
    expect(seedStaff).not.toContain('박서연');
    expect(seedStaff).not.toContain('증위명');
    expect(seedStaff).not.toContain('曾偉銘');

    expect(seedServices).toContain("staffIds: ['staff-tseng']");
    expect(seedServices).not.toContain('staff-lee');
    expect(seedServices).not.toContain('staff-park');
  });
});
