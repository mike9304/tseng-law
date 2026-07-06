#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const wCheckpointPath = '/Users/son7/Desktop/ai memory save 계획/Wix 체크포인트.md';
const auditDir = path.join(rootDir, 'runtime-data', 'audit');
const GREEN_GATE = 203;
const TOTAL_EXPECTED = 225;

const STATUS_EMOJIS = {
  green: '🟢',
  yellow: '🟡',
  red: '🔴',
  black: '⚫',
};

function parseWCheckpointStatuses(markdown) {
  const lines = markdown.split(/\r?\n/);
  const rows = [];
  let currentSection = null;
  let lastRow = null;
  let statusCellIndex = null;

  const rowPattern = /^\|\s*(W\d{1,3})\s*\|/;
  const sectionPattern = /^##\s+(.+?)\s*$/;
  const separatorPattern = /^\|\s*-{2,}/;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    const sectionMatch = line.match(sectionPattern);
    if (sectionMatch) {
      currentSection = sectionMatch[1].trim();
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

    if (separatorPattern.test(line)) {
      lastRow = null;
      continue;
    }

    if (!rowPattern.test(line)) {
      if (lastRow && !line.startsWith('|') && line.trim().length > 0 && !line.startsWith('#')) {
        lastRow.note = (lastRow.note ? lastRow.note + ' ' : '') + line.trim();
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

    const idCell = cells[0] || '';
    const areaCell = cells[1] || '';
    const checkpointCell = cells[2] || '';
    const statusCell = cells[activeStatusCellIndex] || '';
    const statusInfo = extractStatus(statusCell);
    const noteTail = cells.slice(activeStatusCellIndex + 1).join(' | ').trim();

    const row = {
      id: idCell.trim(),
      area: areaCell.trim(),
      checkpoint: checkpointCell.trim(),
      status: statusInfo.status,
      note: joinNotes(statusInfo.note, noteTail),
      _section: currentSection,
    };

    rows.push(row);
    lastRow = row;
  }

  return rows;
}

function parseHeaderStatusCellIndex(line) {
  if (!line.startsWith('|')) return null;

  const cells = splitMarkdownRow(line).map((cell) => cell.trim().toLowerCase());
  const firstCell = cells[0];
  if (firstCell !== 'id' && firstCell !== '#') return null;

  const statusIndex = cells.findIndex((cell) => cell === 'status' || cell === '상태');
  return statusIndex === -1 ? null : statusIndex;
}

function fallbackStatusCellIndex(cellCount) {
  return cellCount >= 5 ? 4 : 3;
}

function splitMarkdownRow(line) {
  let working = line.trim();
  if (working.startsWith('|')) working = working.slice(1);
  if (working.endsWith('|')) working = working.slice(0, -1);
  return working.split('|');
}

function extractStatus(cell) {
  const trimmed = cell.trim();
  const emojiOrder = [
    ['🟢', 'green'],
    ['✅', 'green'],
    ['🟡', 'yellow'],
    ['🔴', 'red'],
    ['⚫', 'black'],
  ];

  for (const [emoji, name] of emojiOrder) {
    const index = trimmed.indexOf(emoji);
    if (index !== -1) {
      const after = trimmed.slice(index + emoji.length).trim();
      return { status: name, note: after };
    }
  }

  return { status: null, note: trimmed };
}

function joinNotes(first, second) {
  if (!first) return second;
  if (!second) return first;
  return `${first} ${second}`;
}

function tallyByStatus(rows) {
  const counts = { green: 0, yellow: 0, red: 0, black: 0, unknown: 0 };
  for (const row of rows) {
    if (row.status && counts[row.status] !== undefined) {
      counts[row.status] += 1;
    } else {
      counts.unknown += 1;
    }
  }
  return counts;
}

function truncate(value, max = 240) {
  if (!value) return '';
  if (value.length <= max) return value;
  return value.slice(0, max - 1).trimEnd() + '…';
}

function buildReport({ rows, counts, gatePassed, generatedAt }) {
  const lines = [];
  lines.push('# W-Layer Audit (W01-W225)');
  lines.push('');
  lines.push(`Generated: ${generatedAt}`);
  lines.push(`Source: ${wCheckpointPath}`);
  lines.push('');
  lines.push('## Gate Summary');
  lines.push('');
  lines.push(`- Gate: ${GREEN_GATE}+ of ${TOTAL_EXPECTED} green required`);
  lines.push(`- Total rows parsed: ${rows.length}`);
  lines.push(`- ${STATUS_EMOJIS.green} Green: ${counts.green}`);
  lines.push(`- ${STATUS_EMOJIS.yellow} Yellow: ${counts.yellow}`);
  lines.push(`- ${STATUS_EMOJIS.red} Red: ${counts.red}`);
  lines.push(`- ${STATUS_EMOJIS.black} Black (blocked/deferred): ${counts.black}`);
  if (counts.unknown > 0) {
    lines.push(`- Unknown status: ${counts.unknown}`);
  }
  lines.push('');
  lines.push(`- Gate result: ${gatePassed ? 'PASS' : 'FAIL'} (${counts.green} green vs ${GREEN_GATE} required)`);
  lines.push('');

  const redRows = rows.filter((row) => row.status === 'red');
  lines.push(`## ${STATUS_EMOJIS.red} Remaining Red (${redRows.length})`);
  lines.push('');
  if (redRows.length === 0) {
    lines.push('_None._');
  } else {
    for (const row of redRows) {
      lines.push(`- **${row.id}** (${row._section || ''} / ${row.area}) — ${truncate(row.checkpoint, 200)}`);
      if (row.note) {
        lines.push(`  - Note: ${truncate(row.note, 240)}`);
      }
    }
  }
  lines.push('');

  const yellowRows = rows.filter((row) => row.status === 'yellow');
  lines.push(`## ${STATUS_EMOJIS.yellow} Yellow In Progress (${yellowRows.length})`);
  lines.push('');
  if (yellowRows.length === 0) {
    lines.push('_None._');
  } else {
    for (const row of yellowRows) {
      lines.push(`- **${row.id}** (${row._section || ''} / ${row.area}) — ${truncate(row.checkpoint, 200)}`);
      if (row.note) {
        lines.push(`  - Note: ${truncate(row.note, 600)}`);
      }
    }
  }
  lines.push('');

  const unknownRows = rows.filter((row) => row.status === null);
  if (unknownRows.length > 0) {
    lines.push(`## Unknown Status (${unknownRows.length})`);
    lines.push('');
    for (const row of unknownRows) {
      lines.push(`- **${row.id}** (${row._section || ''} / ${row.area}) — ${truncate(row.note || row.checkpoint, 260)}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

async function main() {
  let markdown;
  try {
    markdown = await readFile(wCheckpointPath, 'utf8');
  } catch (error) {
    const reason = error && typeof error === 'object' && 'code' in error ? error.code : String(error);
    process.stdout.write(
      `W-layer audit skipped: cannot read ${wCheckpointPath} (${reason}).\n` +
        `This usually means the local checkpoint file is not present on this machine, ` +
        `or shell access to ~/Desktop is restricted by macOS TCC. Exit code 0.\n`,
    );
    process.exit(0);
    return;
  }

  const rows = parseWCheckpointStatuses(markdown);
  const counts = tallyByStatus(rows);
  const gatePassed = counts.green >= GREEN_GATE;
  const generatedAt = new Date().toISOString();
  const isoDate = generatedAt.slice(0, 10);

  const report = buildReport({ rows, counts, gatePassed, generatedAt });
  const reportPath = path.join(auditDir, `w-checkpoint-audit-${isoDate}.md`);

  await mkdir(auditDir, { recursive: true });
  await writeFile(reportPath, report, 'utf8');

  process.stdout.write(report);
  process.stdout.write(`\n\nReport written to ${path.relative(rootDir, reportPath)}\n`);

  if (!gatePassed) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('w-checkpoint-audit: failed to run');
  console.error(error?.stack ?? error);
  process.exit(2);
});
