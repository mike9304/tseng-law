import type { AcquisitionCohort } from './visit-rollup';

export const INTENT_ROUTE_LOCALES = ['ko', 'zh-hant', 'en', 'ja'] as const;
export type IntentRouteLocale = (typeof INTENT_ROUTE_LOCALES)[number];

export const DEFAULT_EN_INTENT_ENTRY_PATHS: readonly string[] = [
  '/en',
  '/en/taiwan-lawyer',
  '/en/taiwan-company-setup-lawyer',
  '/en/taiwan-litigation-lawyer',
];

export const INTENT_ROUTE_REPORT_DISCLAIMERS = {
  contactEmailClickIsNotAQualifiedLead: true,
  noQualifiedLeadEstimate: true,
  trackingCoverageIsWithinObservedSessionsOnly: true,
  unobservedPopulationIncludesDntAndSimilar: true,
  byCountryIpIsIpDerivedNotNationality: true,
  unattributedEventsAreDayGlobalNotRouteSpecific: true,
} as const;

export type PathObservation = 'observed' | 'absent-from-selected-paths';
export type CohortDataStatus = 'available' | 'unavailable';

export interface IntentRouteRow {
  entryPath: string;
  observation: PathObservation;
  sessions: number;
  trackedSessions: number;
  intentSessions: number;
  byChannel: Record<string, number>;
  byCountryIp: Record<string, number>;
  observedTrackingCoverage: number | null;
  intentRate: number | null;
}

export interface IntentRouteReport {
  day: string;
  locale: IntentRouteLocale;
  cohortDataStatus: CohortDataStatus;
  rows: IntentRouteRow[];
  unattributedEvents: number | null;
  unattributedEventsScope: 'day-global-not-route-specific';
  ratioAllowed: boolean;
  disclaimers: typeof INTENT_ROUTE_REPORT_DISCLAIMERS;
}

export interface IntentRouteSummaryInput {
  day: string;
  acquisitionCohorts?: AcquisitionCohort[];
  contactIntent?: {
    unattributedEvents?: number;
  };
}

export interface IntentRouteCliOptions {
  help: boolean;
  filePath: string | null;
  locale: IntentRouteLocale;
  entryPaths: string[];
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sanitizeEntryPath(path: string): string {
  const cut = path.search(/[?#]/);
  const stripped = cut === -1 ? path : path.slice(0, cut);
  return stripped.length > 0 ? stripped : '/';
}

function isIntentRouteLocale(value: string): value is IntentRouteLocale {
  return (INTENT_ROUTE_LOCALES as readonly string[]).includes(value);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function addCount(counts: Record<string, number>, key: string, amount: number): void {
  counts[key] = (counts[key] ?? 0) + amount;
}

function sortRecord(counts: Record<string, number>): Record<string, number> {
  return Object.fromEntries(
    Object.entries(counts).sort((left, right) => compareText(left[0], right[0])),
  );
}

function uniqueSanitizedPaths(entryPaths: string[]): string[] {
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const path of entryPaths) {
    const sanitized = sanitizeEntryPath(path);
    if (seen.has(sanitized)) continue;
    seen.add(sanitized);
    unique.push(sanitized);
  }
  return unique;
}

function readUnattributedEvents(summary: IntentRouteSummaryInput): number | null {
  const intent = summary.contactIntent;
  if (intent == null) return null;
  if (typeof intent.unattributedEvents !== 'number' || !Number.isFinite(intent.unattributedEvents)) {
    return null;
  }
  return intent.unattributedEvents;
}

function coverageWithinObserved(sessions: number, trackedSessions: number): number | null {
  if (sessions <= 0) return null;
  return trackedSessions / sessions;
}

function computeRatioAllowed(cohortDataStatus: CohortDataStatus, rows: Array<Pick<IntentRouteRow, 'sessions' | 'trackedSessions'>>): boolean {
  if (cohortDataStatus !== 'available') return false;
  const observed = rows.filter((row) => row.sessions > 0);
  if (observed.length === 0) return false;
  return observed.every((row) => row.trackedSessions === row.sessions);
}

function aggregatePath(
  cohorts: AcquisitionCohort[],
  locale: IntentRouteLocale,
  entryPath: string,
): Omit<IntentRouteRow, 'intentRate'> {
  const byChannel: Record<string, number> = {};
  const byCountryIp: Record<string, number> = {};
  let sessions = 0;
  let trackedSessions = 0;
  let intentSessions = 0;
  let matched = false;

  for (const cohort of cohorts) {
    if (cohort.locale !== locale) continue;
    if (sanitizeEntryPath(cohort.entryPath) !== entryPath) continue;
    matched = true;
    sessions += cohort.sessions;
    trackedSessions += cohort.trackedSessions;
    intentSessions += cohort.intentSessions;
    addCount(byChannel, cohort.channel || 'unknown', cohort.sessions);
    addCount(byCountryIp, cohort.country || 'unknown', cohort.sessions);
  }

  return {
    entryPath,
    observation: matched ? 'observed' : 'absent-from-selected-paths',
    sessions,
    trackedSessions,
    intentSessions,
    byChannel: sortRecord(byChannel),
    byCountryIp: sortRecord(byCountryIp),
    observedTrackingCoverage: coverageWithinObserved(sessions, trackedSessions),
  };
}

export function reportIntentRoutes(
  summary: IntentRouteSummaryInput,
  locale: IntentRouteLocale,
  entryPaths: string[],
): IntentRouteReport {
  const selectedPaths = uniqueSanitizedPaths(entryPaths);
  const unattributedEvents = readUnattributedEvents(summary);
  const cohorts = summary.acquisitionCohorts;

  if (cohorts === undefined) {
    return {
      day: summary.day,
      locale,
      cohortDataStatus: 'unavailable',
      rows: [],
      unattributedEvents,
      unattributedEventsScope: 'day-global-not-route-specific',
      ratioAllowed: false,
      disclaimers: INTENT_ROUTE_REPORT_DISCLAIMERS,
    };
  }

  const drafted = selectedPaths.map((entryPath) => aggregatePath(cohorts, locale, entryPath));
  const ratioAllowed = computeRatioAllowed('available', drafted);
  const rows = drafted.map((row) => ({
    ...row,
    intentRate: ratioAllowed && row.sessions > 0 ? row.intentSessions / row.sessions : null,
  }));

  return {
    day: summary.day,
    locale,
    cohortDataStatus: 'available',
    rows,
    unattributedEvents,
    unattributedEventsScope: 'day-global-not-route-specific',
    ratioAllowed,
    disclaimers: INTENT_ROUTE_REPORT_DISCLAIMERS,
  };
}

export function resolveSummaryFileArgument(raw: string): string {
  if (typeof raw !== 'string' || raw.trim() === '') {
    throw new Error('invalid path: a single explicit JSON summary file is required');
  }
  const trimmed = raw.trim();
  if (trimmed.includes('\0')) {
    throw new Error('invalid path: null byte is not allowed');
  }
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed) && !/^[A-Za-z]:[\/]/.test(trimmed)) {
    throw new Error('invalid path: network or URI locations are not accepted');
  }
  return trimmed;
}

export function parseIntentRouteReportArgs(argv: string[]): IntentRouteCliOptions {
  const positional: string[] = [];
  let help = false;
  let locale: IntentRouteLocale = 'en';
  let entryPaths = [...DEFAULT_EN_INTENT_ENTRY_PATHS];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      help = true;
      continue;
    }
    if (arg === '--json') {
      continue;
    }
    if (arg === '--locale') {
      const value = argv[index + 1];
      if (value == null || value.startsWith('--')) {
        throw new Error('invalid --locale: expected ko | zh-hant | en | ja');
      }
      if (!isIntentRouteLocale(value)) {
        throw new Error(`invalid --locale: ${value} (expected ko | zh-hant | en | ja)`);
      }
      locale = value;
      index += 1;
      continue;
    }
    if (arg === '--paths') {
      const value = argv[index + 1];
      if (value == null || value.startsWith('--')) {
        throw new Error('invalid --paths: expected a comma-separated list of entry paths');
      }
      const parsed = value.split(',').map((item) => item.trim()).filter((item) => item.length > 0);
      if (parsed.length === 0) {
        throw new Error('invalid --paths: at least one entry path is required');
      }
      entryPaths = parsed;
      index += 1;
      continue;
    }
    if (arg.startsWith('--')) {
      throw new Error(`unknown option: ${arg}`);
    }
    positional.push(arg);
  }

  if (help) {
    return {
      help: true,
      filePath: positional[0] ? resolveSummaryFileArgument(positional[0]) : null,
      locale,
      entryPaths,
    };
  }

  if (positional.length !== 1) {
    throw new Error('invalid arguments: provide exactly one daily summary JSON file (see --help)');
  }

  return {
    help: false,
    filePath: resolveSummaryFileArgument(positional[0]),
    locale,
    entryPaths,
  };
}

function assertNonNegativeInteger(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new Error(`malformed summary: ${label} must be a non-negative integer`);
  }
  return value;
}

function assertOptionalString(value: unknown, label: string): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') {
    throw new Error(`malformed summary: ${label} must be a string or null`);
  }
  return value;
}

function assertCohort(value: unknown, index: number): AcquisitionCohort {
  if (!isPlainObject(value)) {
    throw new Error(`malformed summary: acquisitionCohorts[${index}] must be an object`);
  }
  if (typeof value.locale !== 'string' || value.locale.length === 0) {
    throw new Error(`malformed summary: acquisitionCohorts[${index}].locale must be a string`);
  }
  if (typeof value.entryPath !== 'string' || value.entryPath.length === 0) {
    throw new Error(`malformed summary: acquisitionCohorts[${index}].entryPath must be a string`);
  }
  if (typeof value.country !== 'string' || value.country.length === 0) {
    throw new Error(`malformed summary: acquisitionCohorts[${index}].country must be a string`);
  }
  if (typeof value.channel !== 'string' || value.channel.length === 0) {
    throw new Error(`malformed summary: acquisitionCohorts[${index}].channel must be a string`);
  }
  const sessions = assertNonNegativeInteger(value.sessions, `acquisitionCohorts[${index}].sessions`);
  const trackedSessions = assertNonNegativeInteger(value.trackedSessions, `acquisitionCohorts[${index}].trackedSessions`);
  const intentSessions = assertNonNegativeInteger(value.intentSessions, `acquisitionCohorts[${index}].intentSessions`);
  if (trackedSessions > sessions) {
    throw new Error(`malformed summary: acquisitionCohorts[${index}].trackedSessions cannot exceed sessions`);
  }
  if (intentSessions > trackedSessions) {
    throw new Error(`malformed summary: acquisitionCohorts[${index}].intentSessions cannot exceed trackedSessions`);
  }
  return {
    country: value.country,
    locale: value.locale,
    entryPath: value.entryPath,
    channel: value.channel,
    source: assertOptionalString(value.source, `acquisitionCohorts[${index}].source`),
    sessions,
    trackedSessions,
    intentSessions,
  };
}

export function parseDailySummaryJson(text: string): IntentRouteSummaryInput {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('malformed summary: invalid JSON');
  }

  if (Array.isArray(parsed)) {
    throw new Error('malformed summary: expected a daily summary object, not an array (raw events are not accepted)');
  }
  if (!isPlainObject(parsed)) {
    throw new Error('malformed summary: expected a JSON object');
  }
  if (typeof parsed.day !== 'string' || parsed.day.trim() === '') {
    throw new Error('malformed summary: day must be a non-empty string');
  }
  const summary: IntentRouteSummaryInput = { day: parsed.day };
  if (parsed.acquisitionCohorts !== undefined) {
    if (!Array.isArray(parsed.acquisitionCohorts)) {
      throw new Error('malformed summary: acquisitionCohorts must be an array when present');
    }
    summary.acquisitionCohorts = parsed.acquisitionCohorts.map(assertCohort);
  }
  if (parsed.contactIntent !== undefined) {
    if (!isPlainObject(parsed.contactIntent)) {
      throw new Error('malformed summary: contactIntent must be an object when present');
    }
    if (parsed.contactIntent.unattributedEvents !== undefined) {
      summary.contactIntent = {
        unattributedEvents: assertNonNegativeInteger(
          parsed.contactIntent.unattributedEvents,
          'contactIntent.unattributedEvents',
        ),
      };
    } else {
      summary.contactIntent = {};
    }
  }

  return summary;
}

export function formatIntentRouteReportJson(report: IntentRouteReport): string {
  return `${JSON.stringify(report, null, 2)}\n`;
}
