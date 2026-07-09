import { ACTION_ITEMS, AUTH_SMOKE_MISSING, actionItem } from './action-item-catalog.mjs';
import { basicAuth, buildUrl, fetchWithTimeout, statusOk } from './check-shared.mjs';
import { hasEnv } from './env.mjs';
import { addResult } from './reporting.mjs';

export const ADMIN_PATH = '/ko/admin-builder';

function localCredentialCandidates(env, results) {
  const candidates = [];
  const seen = new Set();

  function addPair(userKey, passKey) {
    if (!hasEnv(env, userKey) || !hasEnv(env, passKey)) return;
    const username = env[userKey].trim();
    const password = env[passKey];
    const fingerprint = `${username}\0${password}`;
    if (seen.has(fingerprint)) return;
    seen.add(fingerprint);
    candidates.push({ username, password });
  }

  addPair('BUILDER_SMOKE_USERNAME', 'BUILDER_SMOKE_PASSWORD');
  addPair('CMS_ADMIN_USERNAME', 'CMS_ADMIN_PASSWORD');

  if (hasEnv(env, 'BUILDER_BASIC_AUTH_USERS')) {
    try {
      const parsed = JSON.parse(env.BUILDER_BASIC_AUTH_USERS);
      if (!Array.isArray(parsed)) {
        addResult(
          results,
          'WARN',
          'auth BUILDER_BASIC_AUTH_USERS is not a JSON array',
          true,
          actionItem(ACTION_ITEMS.basicAuthUsers),
        );
      } else {
        for (const entry of parsed) {
          const username = typeof entry?.username === 'string' ? entry.username.trim() : '';
          const password = typeof entry?.password === 'string' ? entry.password : '';
          if (!username || !password) {
            addResult(
              results,
              'WARN',
              'auth BUILDER_BASIC_AUTH_USERS entry missing username/password',
              true,
              actionItem(ACTION_ITEMS.basicAuthUsers),
            );
            continue;
          }
          const fingerprint = `${username}\0${password}`;
          if (seen.has(fingerprint)) continue;
          seen.add(fingerprint);
          candidates.push({ username, password });
        }
      }
    } catch {
      addResult(
        results,
        'WARN',
        'auth BUILDER_BASIC_AUTH_USERS is not valid JSON',
        true,
        actionItem(ACTION_ITEMS.basicAuthUsers),
      );
    }
  }

  return candidates;
}

export async function checkAdminAuth(baseUrl, env, results) {
  const adminUrl = buildUrl(baseUrl, ADMIN_PATH);

  try {
    const response = await fetchWithTimeout(adminUrl, {
      headers: { accept: 'text/html,*/*;q=0.8' },
      redirect: 'manual',
    });
    if (response.status === 401) {
      addResult(results, 'PASS', `auth no-auth ${ADMIN_PATH} returned 401`, true);
    } else if (statusOk(response.status)) {
      addResult(results, 'FAIL', `auth no-auth ${ADMIN_PATH} returned ${response.status}`, false);
    } else {
      addResult(
        results,
        'OPEN',
        `auth no-auth ${ADMIN_PATH} expected 401, got ${response.status}`,
        false,
        actionItem(ACTION_ITEMS.authBoundary),
      );
    }
    response.body?.cancel();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    addResult(results, 'FAIL', `auth no-auth ${ADMIN_PATH} fetch failed: ${message}`, false);
  }

  const candidates = localCredentialCandidates(env, results);
  if (candidates.length === 0) {
    addResult(
      results,
      'OPEN',
      'auth smoke missing credential candidates: BUILDER_SMOKE_USERNAME/BUILDER_SMOKE_PASSWORD, CMS_ADMIN_USERNAME/CMS_ADMIN_PASSWORD, BUILDER_BASIC_AUTH_USERS',
      false,
      actionItem(ACTION_ITEMS.authSmoke, AUTH_SMOKE_MISSING),
    );
    return;
  }

  let passed = false;
  let requestFailed = false;
  for (const candidate of candidates) {
    try {
      const response = await fetchWithTimeout(adminUrl, {
        headers: {
          accept: 'text/html,*/*;q=0.8',
          authorization: basicAuth(candidate.username, candidate.password),
        },
        redirect: 'manual',
      });
      if (statusOk(response.status)) passed = true;
      response.body?.cancel();
      if (passed) break;
    } catch {
      requestFailed = true;
    }
  }

  if (passed) {
    addResult(
      results,
      'PASS',
      `auth smoke ${ADMIN_PATH} accepted one local credential candidate`,
      true,
    );
  } else if (requestFailed) {
    addResult(
      results,
      'OPEN',
      `auth smoke ${ADMIN_PATH} no credential candidate returned 2xx/3xx (tried ${candidates.length}; request failure observed)`,
      false,
      actionItem(ACTION_ITEMS.authSmoke),
    );
  } else {
    addResult(
      results,
      'OPEN',
      `auth smoke ${ADMIN_PATH} no credential candidate returned 2xx/3xx (tried ${candidates.length})`,
      false,
      actionItem(ACTION_ITEMS.authSmoke),
    );
  }
}
