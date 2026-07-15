import { existsSync, lstatSync, realpathSync, statSync } from 'node:fs';
import path from 'node:path';

import { JOURNEY_IDS, type JourneyId } from './journey-manifest';

export interface FixtureDocument {
  readonly version: 1;
  readonly isolationRoot: string;
  readonly ownership: {
    readonly sentinel: 'wb-r07-isolated-fixture';
    readonly token: string;
    readonly journeys: readonly JourneyId[];
  };
}

export class FixtureDocumentError extends Error {
  constructor(readonly code: 'ROOT' | 'OWNERSHIP' | 'PATH', message: string) {
    super(message);
    this.name = 'FixtureDocumentError';
  }
}

function isContained(root: string, candidate: string): boolean {
  const relative = path.relative(root, candidate);
  return relative !== '' && relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

function canonicalIsolationRoot(root: string): string {
  if (!path.isAbsolute(root) || path.resolve(root) === path.parse(path.resolve(root)).root) {
    throw new FixtureDocumentError('ROOT', 'fixture isolation root must be absolute, existing, and not the filesystem root');
  }
  const lexical = path.resolve(root);
  if (!existsSync(lexical) || !lstatSync(lexical).isDirectory() || lstatSync(lexical).isSymbolicLink()) {
    throw new FixtureDocumentError('ROOT', 'fixture isolation root must be an existing non-symlink directory');
  }
  const canonical = realpathSync(lexical);
  if (canonical !== lexical) throw new FixtureDocumentError('ROOT', 'fixture isolation root must be canonical without a symlinked parent');
  return canonical;
}

function assertOwnership(token: string, journeys: readonly JourneyId[]): void {
  if (!/^[A-Za-z0-9_-]{16,128}$/u.test(token)) throw new FixtureDocumentError('OWNERSHIP', 'fixture ownership token is invalid');
  if (journeys.length !== JOURNEY_IDS.length || journeys.some((journey, index) => journey !== JOURNEY_IDS[index])) {
    throw new FixtureDocumentError('OWNERSHIP', 'fixture manifest must contain the exact ordered R07 journey ids');
  }
}

/** Builds only an in-memory fixture declaration; this module never creates or writes files. */
export function createFixtureDocument(input: { isolationRoot: string; ownershipToken: string; journeys?: readonly JourneyId[] }): FixtureDocument {
  const journeys = input.journeys ?? JOURNEY_IDS;
  assertOwnership(input.ownershipToken, journeys);
  return {
    version: 1,
    isolationRoot: canonicalIsolationRoot(input.isolationRoot),
    ownership: { sentinel: 'wb-r07-isolated-fixture', token: input.ownershipToken, journeys: [...journeys] },
  };
}

/** Validates an in-memory declaration before read-only fixture path resolution. */
export function validateFixtureDocument(document: FixtureDocument): FixtureDocument {
  if (document.version !== 1 || document.ownership.sentinel !== 'wb-r07-isolated-fixture') {
    throw new FixtureDocumentError('OWNERSHIP', 'fixture sentinel is invalid');
  }
  assertOwnership(document.ownership.token, document.ownership.journeys);
  return { ...document, isolationRoot: canonicalIsolationRoot(document.isolationRoot) };
}

/** Resolves an existing path only, rejecting lexical, leaf, and intermediate symlink/canonical escapes. */
export function resolveFixturePath(document: FixtureDocument, requestedPath: string): string {
  const valid = validateFixtureDocument(document);
  if (!requestedPath || path.isAbsolute(requestedPath) || requestedPath.split(/[\\/]+/u).includes('..')) {
    throw new FixtureDocumentError('PATH', 'fixture path must be a non-empty relative non-traversing path');
  }
  const lexical = path.resolve(valid.isolationRoot, requestedPath);
  if (!isContained(valid.isolationRoot, lexical) || !existsSync(lexical)) {
    throw new FixtureDocumentError('PATH', 'fixture path is missing or outside the isolation root');
  }
  const parts = path.relative(valid.isolationRoot, lexical).split(path.sep);
  let current = valid.isolationRoot;
  for (const part of parts) {
    current = path.join(current, part);
    if (lstatSync(current).isSymbolicLink()) throw new FixtureDocumentError('PATH', 'fixture path contains a symlink');
  }
  const canonical = realpathSync(lexical);
  if (!isContained(valid.isolationRoot, canonical) || (!statSync(canonical).isFile() && !statSync(canonical).isDirectory())) {
    throw new FixtureDocumentError('PATH', 'fixture path canonical escape');
  }
  return canonical;
}
