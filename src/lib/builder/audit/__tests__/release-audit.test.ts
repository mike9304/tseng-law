import { describe, expect, it } from 'vitest';

import {
  parseCheckpointStatuses,
  passesReleaseGate,
  tallyCheckpointRows,
} from '@/lib/builder/audit/release-audit';

const FIXTURE = `# WIX-FULL-PRODUCT-CHECKPOINTS.md

Status legend:
- 🔴 not started
- 🟡 in progress
- 🟢 verified
- ⚫ blocked

## M157 Benchmark And Scoring

| ID | Area | Checkpoint | Done when | Status |
| --- | --- | --- | --- | --- |
| F01 | Benchmark | Official source manifest | Source list exists | 🟢 |
| F02 | Dynamic | Visitor filters | Public filter UI ships | 🟡 First slice shipped for /columns; SSR and multi-collection remain |
| F05 | Bookings | Calendar depth | Calendar workflow ships | ✅ Legacy verified row |

## M158 Misc

| ID | Area | Checkpoint | Done when | Status |
| --- | --- | --- | --- | --- |
| F03 | Apps | Hook lifecycle | Hook registry exists | 🔴 |
| F04 | Workflow | CRDT decision | Conflict model picked | ⚫ Deferred — needs CRDT decision |
`;

describe('parseCheckpointStatuses', () => {
  it('parses every status emoji into a typed row', () => {
    const rows = parseCheckpointStatuses(FIXTURE);

    expect(rows).toHaveLength(5);

    expect(rows[0]).toEqual({
      id: 'F01',
      area: 'Benchmark',
      checkpoint: 'Official source manifest',
      status: 'green',
      note: '',
    });

    expect(rows[1].id).toBe('F02');
    expect(rows[1].status).toBe('yellow');
    expect(rows[1].note).toContain('First slice shipped for /columns');

    expect(rows[2].id).toBe('F05');
    expect(rows[2].status).toBe('green');
    expect(rows[2].note).toBe('Legacy verified row');

    expect(rows[3]).toEqual({
      id: 'F03',
      area: 'Apps',
      checkpoint: 'Hook lifecycle',
      status: 'red',
      note: '',
    });

    expect(rows[4].id).toBe('F04');
    expect(rows[4].status).toBe('black');
    expect(rows[4].note).toContain('Deferred');
  });

  it('skips section headers and table header/separator rows', () => {
    const rows = parseCheckpointStatuses(FIXTURE);
    const ids = rows.map((row) => row.id);
    expect(ids).toEqual(['F01', 'F02', 'F05', 'F03', 'F04']);
    expect(ids).not.toContain('ID');
  });

  it('returns null status when no recognized emoji is present', () => {
    const malformed = `| ID | Area | Checkpoint | Done when | Status |
| --- | --- | --- | --- | --- |
| F99 | Misc | Unfinished row | Done | needs triage |
`;
    const rows = parseCheckpointStatuses(malformed);
    expect(rows).toHaveLength(1);
    expect(rows[0].status).toBeNull();
    expect(rows[0].note).toBe('needs triage');
  });

  it('parses W-layer tables where 상태 is not the last column', () => {
    const wLayer = `| # | 동작 | 검증 방법 | 상태 | 마지막 검증 |
|---|---|---|---|---|
| W01 | Builder opens | See the real site in editor | 🟢 | user verified |
| W02 | Selection handles | Click a hero node | 🟡 자동검증 통과 / 사용자 QA 대기 | browser proof exists |
`;

    const rows = parseCheckpointStatuses(wLayer);

    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({
      id: 'W01',
      area: 'Builder opens',
      checkpoint: 'See the real site in editor',
      status: 'green',
      note: 'user verified',
    });
    expect(rows[1]).toEqual({
      id: 'W02',
      area: 'Selection handles',
      checkpoint: 'Click a hero node',
      status: 'yellow',
      note: '자동검증 통과 / 사용자 QA 대기 browser proof exists',
    });
  });

  it('folds trailing prose lines into the previous row note', () => {
    const folded = `| ID | Area | Checkpoint | Done when | Status |
| --- | --- | --- | --- | --- |
| F10 | Area | Checkpoint | Done | 🟡 base note |
extra continuation prose
`;
    const rows = parseCheckpointStatuses(folded);
    expect(rows).toHaveLength(1);
    expect(rows[0].note).toBe('base note extra continuation prose');
  });
});

describe('tallyCheckpointRows', () => {
  it('counts each status independently', () => {
    const rows = parseCheckpointStatuses(FIXTURE);
    const tally = tallyCheckpointRows(rows);
    expect(tally).toEqual({ green: 2, yellow: 1, red: 1, black: 1, unknown: 0 });
  });

  it('records unknown-status rows', () => {
    const rows = parseCheckpointStatuses(
      `| ID | Area | Checkpoint | Done when | Status |
| --- | --- | --- | --- | --- |
| F50 | X | Y | Z | needs triage |
`,
    );
    const tally = tallyCheckpointRows(rows);
    expect(tally.unknown).toBe(1);
    expect(tally.green).toBe(0);
  });
});

describe('passesReleaseGate', () => {
  it('returns true when the green count meets the gate', () => {
    const rows: ReturnType<typeof parseCheckpointStatuses> = Array.from({ length: 5 }, (_, i) => ({
      id: `F${i + 1}`,
      area: 'x',
      checkpoint: 'y',
      status: 'green',
      note: '',
    }));
    expect(passesReleaseGate(rows, 5)).toBe(true);
    expect(passesReleaseGate(rows, 6)).toBe(false);
  });

  it('defaults to the F-layer gate of 96', () => {
    const rows = parseCheckpointStatuses(FIXTURE);
    expect(passesReleaseGate(rows)).toBe(false);
  });
});
