/**
 * Pure markdown parser for the WIX-FULL-PRODUCT-CHECKPOINTS.md (F01-F120) and
 * compatible W-layer markdown grids. Used by:
 *   - scripts/run-release-audit.mjs (release gate report)
 *   - scripts/run-w-checkpoint-audit.mjs (W-layer report)
 *   - future CI step / admin surface programmatic consumers
 *
 * Intentionally has no I/O, no Node fs dependency, and no logging so it can be
 * unit-tested with raw string fixtures and reused in API/route handlers.
 */

export type CheckpointStatus = 'green' | 'yellow' | 'red' | 'black';

export interface CheckpointRow {
  /** Stable identifier, e.g. "F01", "W203". */
  id: string;
  /** Area column (column 2). */
  area: string;
  /** Checkpoint name column (column 3). */
  checkpoint: string;
  /** Parsed status, or null when no recognized emoji is present. */
  status: CheckpointStatus | null;
  /** Text remainder after the status emoji inside the status cell. */
  note: string;
}

const STATUS_EMOJI_MAP: ReadonlyArray<readonly [string, CheckpointStatus]> = [
  ['🟢', 'green'],
  ['✅', 'green'],
  ['🟡', 'yellow'],
  ['🔴', 'red'],
  ['⚫', 'black'],
];

const ROW_PATTERN = /^\|\s*([FW]\d{1,3})\s*\|/;
const SEPARATOR_PATTERN = /^\|\s*-{2,}/;
const SECTION_PATTERN = /^##\s+/;
const DEFAULT_STATUS_CELL_INDEX = 4;
const W_LAYER_STATUS_CELL_INDEX = 3;

/**
 * Parse a checkpoint markdown document and return one entry per F/W row.
 *
 * The expected row format is:
 *   `| ID | Area | Checkpoint | Done when | Status |`
 *
 * - Section headers (`## M### ...`) and table headers/separators are skipped.
 * - Rows without a recognized status emoji return `status: null` and put the
 *   raw status-cell content into `note` for downstream visibility.
 * - Non-row prose lines that immediately follow an F/W row are folded into
 *   the previous row's `note` field. This is defensive — the current
 *   CHECKPOINTS.md keeps every row on a single line.
 */
export function parseCheckpointStatuses(markdown: string): CheckpointRow[] {
  const lines = markdown.split(/\r?\n/);
  const rows: CheckpointRow[] = [];
  let lastRow: CheckpointRow | null = null;
  let statusCellIndex: number | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (SECTION_PATTERN.test(line)) {
      lastRow = null;
      statusCellIndex = null;
      continue;
    }

    const headerStatusCellIndex = parseHeaderStatusCellIndex(line);
    if (headerStatusCellIndex !== null) {
      statusCellIndex = headerStatusCellIndex;
      lastRow = null;
      continue;
    }

    if (SEPARATOR_PATTERN.test(line)) {
      lastRow = null;
      continue;
    }

    if (!ROW_PATTERN.test(line)) {
      if (
        lastRow &&
        !line.startsWith('|') &&
        line.trim().length > 0 &&
        !line.startsWith('#')
      ) {
        lastRow.note = lastRow.note ? `${lastRow.note} ${line.trim()}` : line.trim();
      }
      continue;
    }

    const cells = splitMarkdownRow(line);
    if (cells.length < 4) {
      lastRow = null;
      continue;
    }

    const activeStatusCellIndex = statusCellIndex ?? fallbackStatusCellIndex(cells.length);
    if (activeStatusCellIndex >= cells.length) {
      lastRow = null;
      continue;
    }

    const idCell = cells[0];
    const areaCell = cells[1];
    const checkpointCell = cells[2];
    const statusCell = cells[activeStatusCellIndex];
    const statusInfo = extractStatus(statusCell);
    const noteTail = cells.slice(activeStatusCellIndex + 1).join(' | ').trim();

    const row: CheckpointRow = {
      id: idCell.trim(),
      area: areaCell.trim(),
      checkpoint: checkpointCell.trim(),
      status: statusInfo.status,
      note: joinNotes(statusInfo.note, noteTail),
    };

    rows.push(row);
    lastRow = row;
  }

  return rows;
}

function parseHeaderStatusCellIndex(line: string): number | null {
  if (!line.startsWith('|')) return null;

  const cells = splitMarkdownRow(line).map((cell) => cell.trim().toLowerCase());
  const firstCell = cells[0];
  if (firstCell !== 'id' && firstCell !== '#') return null;

  const statusIndex = cells.findIndex((cell) => cell === 'status' || cell === '상태');
  return statusIndex === -1 ? null : statusIndex;
}

function fallbackStatusCellIndex(cellCount: number): number {
  return cellCount >= DEFAULT_STATUS_CELL_INDEX + 1
    ? DEFAULT_STATUS_CELL_INDEX
    : W_LAYER_STATUS_CELL_INDEX;
}

function splitMarkdownRow(line: string): string[] {
  let working = line.trim();
  if (working.startsWith('|')) working = working.slice(1);
  if (working.endsWith('|')) working = working.slice(0, -1);
  return working.split('|');
}

function extractStatus(cell: string): { status: CheckpointStatus | null; note: string } {
  const trimmed = cell.trim();

  for (const [emoji, status] of STATUS_EMOJI_MAP) {
    const index = trimmed.indexOf(emoji);
    if (index !== -1) {
      const after = trimmed.slice(index + emoji.length).trim();
      return { status, note: after };
    }
  }

  return { status: null, note: trimmed };
}

function joinNotes(first: string, second: string): string {
  if (!first) return second;
  if (!second) return first;
  return `${first} ${second}`;
}

export interface CheckpointTally {
  green: number;
  yellow: number;
  red: number;
  black: number;
  unknown: number;
}

/**
 * Reduce a row list into a status tally. Pure function so callers can build
 * gate decisions and progress UI without re-parsing.
 */
export function tallyCheckpointRows(rows: ReadonlyArray<CheckpointRow>): CheckpointTally {
  const tally: CheckpointTally = { green: 0, yellow: 0, red: 0, black: 0, unknown: 0 };
  for (const row of rows) {
    if (row.status) {
      tally[row.status] += 1;
    } else {
      tally.unknown += 1;
    }
  }
  return tally;
}

/**
 * Return true when the green count meets the release gate.
 * Default gate matches the F-layer requirement of 96+ green rows.
 */
export function passesReleaseGate(
  rows: ReadonlyArray<CheckpointRow>,
  gate = 96,
): boolean {
  return tallyCheckpointRows(rows).green >= gate;
}
