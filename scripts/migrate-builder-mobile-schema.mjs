#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const DEFAULT_SITE_ID = 'tseng-law-main-site';
const LOCKED_AT = '2026-05-10T03:00:00+09:00';
const HAMBURGER_MODES = new Set(['auto', 'off', 'force']);

function argValue(name, fallback = undefined) {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  return process.argv[index + 1] ?? fallback;
}

function hasArg(name) {
  return process.argv.includes(name);
}

function sanitizePhoneHref(phone) {
  const cleaned = String(phone ?? '').replace(/[^\d+]/g, '');
  return cleaned ? `tel:${cleaned}` : 'tel:+886227515255';
}

function defaultBottomBarActions(settings = {}) {
  return [
    {
      id: 'call',
      label: '전화',
      href: sanitizePhoneHref(settings.phone),
      kind: 'phone',
    },
    {
      id: 'consultation',
      label: '상담 예약',
      href: '#contact',
      kind: 'booking',
    },
  ];
}

function normalizeHeaderFooter(headerFooter = {}) {
  const mode = HAMBURGER_MODES.has(headerFooter.mobileHamburger)
    ? headerFooter.mobileHamburger
    : 'auto';
  return {
    ...headerFooter,
    mobileSticky: headerFooter.mobileSticky === true,
    mobileHamburger: mode,
  };
}

function normalizeBottomBar(input = {}, settings = {}) {
  const fallbackActions = defaultBottomBarActions(settings);
  const incoming = Array.isArray(input.actions) ? input.actions.slice(0, 3) : [];
  const actions = fallbackActions.map((fallback, index) => {
    const action = incoming[index] ?? {};
    const kind = ['phone', 'booking', 'custom'].includes(action.kind) ? action.kind : fallback.kind;
    return {
      id: typeof action.id === 'string' && action.id.trim() ? action.id.trim().slice(0, 80) : fallback.id,
      label: typeof action.label === 'string' && action.label.trim() ? action.label.trim().slice(0, 40) : fallback.label,
      href: typeof action.href === 'string' && action.href.trim() ? action.href.trim().slice(0, 500) : fallback.href,
      kind,
    };
  });
  return {
    enabled: input.enabled === true,
    actions,
  };
}

function normalizeSite(site) {
  return {
    ...site,
    headerFooter: normalizeHeaderFooter(site.headerFooter),
    mobileBottomBar: normalizeBottomBar(site.mobileBottomBar, site.settings),
  };
}

function changedKeys(before, after) {
  const keys = [];
  if (JSON.stringify(before.headerFooter ?? null) !== JSON.stringify(after.headerFooter ?? null)) {
    keys.push('headerFooter.mobileSticky/mobileHamburger');
  }
  if (JSON.stringify(before.mobileBottomBar ?? null) !== JSON.stringify(after.mobileBottomBar ?? null)) {
    keys.push('mobileBottomBar');
  }
  return keys;
}

const siteId = argValue('--site', DEFAULT_SITE_ID);
const dryRun = hasArg('--dry-run');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const siteDir = path.join(process.cwd(), 'runtime-data', 'builder-site', siteId);
const sitePath = path.join(siteDir, 'site.json');
const backupKey = `builder-site/${siteId}/backups/before-M07-${timestamp}.json`;
const backupPath = path.join(siteDir, 'backups', `before-M07-${timestamp}.json`);

const raw = await readFile(sitePath, 'utf8');
const before = JSON.parse(raw);
const after = normalizeSite(before);
const changes = changedKeys(before, after);

const summary = {
  dryRun,
  lockedAt: LOCKED_AT,
  siteId,
  backupKey,
  changed: changes.length > 0,
  changes,
};

if (!dryRun) {
  await mkdir(path.dirname(backupPath), { recursive: true });
  await writeFile(backupPath, raw, 'utf8');
  await writeFile(sitePath, JSON.stringify(after), 'utf8');
}

process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
