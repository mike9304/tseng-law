#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const checkpointsPath = path.join(rootDir, 'WIX-FULL-PRODUCT-CHECKPOINTS.md');
const auditDir = path.join(rootDir, 'runtime-data', 'audit');
const GREEN_GATE = 96;
const TOTAL_EXPECTED = 120;

const STATUS_EMOJIS = {
  green: '🟢',
  yellow: '🟡',
  red: '🔴',
  black: '⚫',
};

/**
 * Parse the WIX-FULL-PRODUCT-CHECKPOINTS.md markdown into a structured list of
 * F-layer checkpoint rows. Each row has the shape
 *   { id, area, checkpoint, status, note }
 * where status is one of 'green' | 'yellow' | 'red' | 'black' | null.
 *
 * The parser also tracks the current "## M### ..." milestone header so the
 * report can group rows; the milestone is attached as a non-public extra field
 * `_section` on the returned rows for the script's convenience.
 */
function parseCheckpointStatuses(markdown) {
  const lines = markdown.split(/\r?\n/);
  const rows = [];
  let currentSection = null;
  let lastRow = null;

  const rowPattern = /^\|\s*(F\d{1,3})\s*\|/;
  const sectionPattern = /^##\s+(.+?)\s*$/;
  const separatorPattern = /^\|\s*-{2,}/;
  const headerPattern = /^\|\s*ID\s*\|/i;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    const sectionMatch = line.match(sectionPattern);
    if (sectionMatch) {
      currentSection = sectionMatch[1].trim();
      lastRow = null;
      continue;
    }

    if (separatorPattern.test(line) || headerPattern.test(line)) {
      lastRow = null;
      continue;
    }

    if (!rowPattern.test(line)) {
      // Defensive: if the previous F-row was followed by an unparsed pipe-less
      // continuation line that looks like prose, fold it into the note. The
      // current CHECKPOINTS.md keeps every F-row on one line so this branch is
      // a safety net only.
      if (lastRow && line.startsWith('|') === false && line.trim().length > 0 && !line.startsWith('#')) {
        lastRow.note = (lastRow.note ? lastRow.note + ' ' : '') + line.trim();
      }
      continue;
    }

    const cells = splitMarkdownRow(line);
    if (cells.length < 5) {
      lastRow = null;
      continue;
    }

    const [idCell, areaCell, checkpointCell, _doneWhenCell, statusCell] = cells;
    const statusInfo = extractStatus(statusCell);

    const row = {
      id: idCell.trim(),
      area: areaCell.trim(),
      checkpoint: checkpointCell.trim(),
      status: statusInfo.status,
      note: statusInfo.note,
      _section: currentSection,
    };

    rows.push(row);
    lastRow = row;
  }

  return rows;
}

function splitMarkdownRow(line) {
  // Trim leading/trailing pipes and split on '|'. The current file does not use
  // escaped pipes (`\|`) inside cells, so a straight split is safe.
  let working = line.trim();
  if (working.startsWith('|')) working = working.slice(1);
  if (working.endsWith('|')) working = working.slice(0, -1);
  return working.split('|');
}

function extractStatus(cell) {
  const trimmed = cell.trim();
  const emojiOrder = [
    ['🟢', 'green'],
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

function groupBySection(rows) {
  const grouped = new Map();
  for (const row of rows) {
    const key = row._section || 'Uncategorized';
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(row);
  }
  return grouped;
}

function truncate(value, max = 240) {
  if (!value) return '';
  if (value.length <= max) return value;
  return value.slice(0, max - 1).trimEnd() + '…';
}

function buildReport({ rows, counts, gatePassed, generatedAt }) {
  const lines = [];
  lines.push('# M176 Release Audit (F01-F120)');
  lines.push('');
  lines.push(`Generated: ${generatedAt}`);
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
    lines.push('| ID | Section | Area | Checkpoint | Note |');
    lines.push('| --- | --- | --- | --- | --- |');
    for (const row of redRows) {
      lines.push(`| ${row.id} | ${row._section || ''} | ${row.area} | ${truncate(row.checkpoint, 160)} | ${truncate(row.note, 200)} |`);
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
      lines.push(`- **${row.id}** (${row._section || ''} / ${row.area}) — ${row.checkpoint}`);
      if (row.note) {
        lines.push(`  - Note: ${truncate(row.note, 600)}`);
      }
    }
  }
  lines.push('');

  const blackRows = rows.filter((row) => row.status === 'black');
  if (blackRows.length > 0) {
    lines.push(`## ${STATUS_EMOJIS.black} Blocked / Deferred (${blackRows.length})`);
    lines.push('');
    for (const row of blackRows) {
      lines.push(`- **${row.id}** (${row._section || ''} / ${row.area}) — ${row.checkpoint}`);
      if (row.note) {
        lines.push(`  - Note: ${truncate(row.note, 400)}`);
      }
    }
    lines.push('');
  }

  lines.push('## Per-Section Breakdown');
  lines.push('');
  lines.push('| Section | Green | Yellow | Red | Black | Total |');
  lines.push('| --- | --- | --- | --- | --- | --- |');
  const grouped = groupBySection(rows);
  for (const [section, sectionRows] of grouped) {
    const local = tallyByStatus(sectionRows);
    lines.push(`| ${section} | ${local.green} | ${local.yellow} | ${local.red} | ${local.black} | ${sectionRows.length} |`);
  }
  lines.push('');

  return lines.join('\n');
}

async function main() {
  const markdown = await readFile(checkpointsPath, 'utf8');
  const rows = parseCheckpointStatuses(markdown);
  const counts = tallyByStatus(rows);
  const gatePassed = counts.green >= GREEN_GATE;
  const generatedAt = new Date().toISOString();
  const isoDate = generatedAt.slice(0, 10);

  const report = buildReport({ rows, counts, gatePassed, generatedAt });
  const reportPath = path.join(auditDir, `release-audit-${isoDate}.md`);

  await mkdir(auditDir, { recursive: true });
  await writeFile(reportPath, report, 'utf8');

  process.stdout.write(report);
  process.stdout.write(`\n\nReport written to ${path.relative(rootDir, reportPath)}\n`);

  if (!gatePassed) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('release-audit: failed to run');
  console.error(error?.stack ?? error);
  process.exit(2);
});