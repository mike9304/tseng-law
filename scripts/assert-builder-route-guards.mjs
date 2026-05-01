#!/usr/bin/env node

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const routesDir = path.join(rootDir, 'src', 'app', 'api', 'builder');
const mutationMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const routeFilePattern = /^route\.(?:ts|tsx|js|jsx|mjs|cjs)$/;
const handlerAllowCommentPattern =
  /builder-route-guard:\s*(?:allow-public|allow-unguarded-mutation|ignore)/i;
const fileAllowCommentPattern = /builder-route-guard:\s*allow-file/i;

const strongGuardPattern = /\bguardMutation\s*\(/;
const obviousAuthGuardPattern =
  /\b(?:requireBuilderAdminAuth|guardBuilderMutation|requireBuilderAuth|assertBuilderAdminAuth)\s*\(/;

function toProjectPath(filePath) {
  return path.relative(rootDir, filePath).split(path.sep).join('/');
}

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');
}

async function collectRouteFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectRouteFiles(fullPath));
      continue;
    }

    if (entry.isFile() && routeFilePattern.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

function findExportedHandlers(source) {
  const handlers = [];
  const handlerPattern =
    /^\s*export\s+(?:(?:async\s+)?function\s+|const\s+)(GET|HEAD|OPTIONS|POST|PUT|PATCH|DELETE)\b/gm;

  let match;
  while ((match = handlerPattern.exec(source)) !== null) {
    handlers.push({
      method: match[1],
      start: match.index,
    });
  }

  return handlers.map((handler, index) => {
    const nextHandler = handlers[index + 1];
    return {
      ...handler,
      source: source.slice(handler.start, nextHandler?.start ?? source.length),
    };
  });
}

function findGuardedHelpers(source) {
  const stripped = stripComments(source);
  const helperNames = new Set();
  const helperPattern =
    /(?:function\s+([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*{|const\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>\s*{)/g;

  let match;
  while ((match = helperPattern.exec(stripped)) !== null) {
    const name = match[1] ?? match[2];
    const nextHelper = stripped.indexOf('\nfunction ', helperPattern.lastIndex);
    const nextConst = stripped.indexOf('\nconst ', helperPattern.lastIndex);
    const candidates = [nextHelper, nextConst].filter((index) => index >= 0);
    const end = candidates.length > 0 ? Math.min(...candidates) : stripped.length;
    const body = stripped.slice(match.index, end);

    if (strongGuardPattern.test(body)) {
      helperNames.add(name);
    }
  }

  return helperNames;
}

function classifyProtection(handlerSource, guardedHelpers) {
  if (handlerAllowCommentPattern.test(handlerSource)) {
    return 'allowlisted';
  }

  const stripped = stripComments(handlerSource);
  if (strongGuardPattern.test(stripped)) {
    return 'guardMutation';
  }

  if (obviousAuthGuardPattern.test(stripped)) {
    return 'obvious-auth';
  }

  for (const helperName of guardedHelpers) {
    const helperCallPattern = new RegExp(`\\b${helperName}\\s*\\(`);
    if (helperCallPattern.test(stripped)) {
      return 'guarded-helper';
    }
  }

  return 'missing';
}

const routeFiles = await collectRouteFiles(routesDir);
const missing = [];
const authOnly = [];
const allowlisted = [];
let mutationHandlerCount = 0;

for (const filePath of routeFiles) {
  const source = await readFile(filePath, 'utf8');
  const projectPath = toProjectPath(filePath);
  const guardedHelpers = findGuardedHelpers(source);
  const fileAllowlisted = fileAllowCommentPattern.test(source);

  for (const handler of findExportedHandlers(source)) {
    if (!mutationMethods.has(handler.method)) {
      continue;
    }

    mutationHandlerCount += 1;
    const classification = fileAllowlisted
      ? 'allowlisted'
      : classifyProtection(handler.source, guardedHelpers);

    if (classification === 'missing') {
      missing.push(`${projectPath} ${handler.method}`);
    } else if (classification === 'obvious-auth') {
      authOnly.push(`${projectPath} ${handler.method}`);
    } else if (classification === 'allowlisted') {
      allowlisted.push(`${projectPath} ${handler.method}`);
    }
  }
}

if (missing.length > 0) {
  console.error('Builder mutation routes missing guardMutation protection:');
  for (const entry of missing) {
    console.error(`- ${entry}`);
  }
  console.error(
    '\nAdd guardMutation(request) or an inline `builder-route-guard: allow-public` comment for intentional public routes.',
  );
  process.exit(1);
}

if (authOnly.length > 0) {
  console.error('Builder mutation routes using auth-only protection must be upgraded to guardMutation:');
  for (const entry of authOnly) {
    console.error(`- ${entry}`);
  }
  process.exit(1);
}

console.log(
  `Checked ${routeFiles.length} builder route file(s); ${mutationHandlerCount} mutation handler(s) have guard coverage.`,
);

if (allowlisted.length > 0) {
  console.warn(`Warning: ${allowlisted.length} mutation handler(s) are allowlisted by comment.`);
}
