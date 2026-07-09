import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { access, chmod, mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const EDITOR_FLOW_GATE_SCRIPT = join(TEST_DIR, 'editor-flow-gate.sh');

async function writeExecutable(path, content) {
  await writeFile(path, content);
  await chmod(path, 0o755);
}

async function exists(path) {
  return access(path).then(
    () => true,
    () => false,
  );
}

async function runEditorFlowGateWithStubs({ curlHttpCode, curlExit = 0, npxExit = 66 }) {
  const binDir = await mkdtemp(join(tmpdir(), 'editor-flow-gate-bin-'));
  const projectDir = await mkdtemp(join(tmpdir(), 'editor-flow-gate-project-'));
  const scriptDir = join(projectDir, 'scripts');
  const npxMarker = join(projectDir, '.npx-invoked');

  try {
    await mkdir(scriptDir, { recursive: true });
    await symlink(EDITOR_FLOW_GATE_SCRIPT, join(scriptDir, 'editor-flow-gate.sh'));
    await writeExecutable(join(binDir, 'curl'), `#!/bin/sh
printf '%s' "$CURL_HTTP_CODE"
exit "$CURL_EXIT"
`);
    await writeExecutable(join(binDir, 'npx'), `#!/bin/sh
: > "$NPX_MARKER"
exit "$NPX_EXIT"
`);

    const result = await new Promise((resolve, reject) => {
      const child = spawn('/bin/bash', ['scripts/editor-flow-gate.sh'], {
        cwd: projectDir,
        env: {
          LANG: 'C',
          TZ: 'UTC',
          PATH: `${binDir}:${process.env.PATH ?? ''}`,
          BASE_URL: 'http://127.0.0.1:9',
          BUILDER_SMOKE_USERNAME: 'admin',
          BUILDER_SMOKE_PASSWORD: 'local-review-2026!',
          CURL_HTTP_CODE: curlHttpCode,
          CURL_EXIT: String(curlExit),
          NPX_EXIT: String(npxExit),
          NPX_MARKER: npxMarker,
        },
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      let stdout = '';
      let stderr = '';
      let timedOut = false;
      const timeout = setTimeout(() => {
        timedOut = true;
        child.kill('SIGTERM');
      }, 10_000);

      child.stdout.setEncoding('utf8');
      child.stderr.setEncoding('utf8');
      child.stdout.on('data', (chunk) => {
        stdout += chunk;
      });
      child.stderr.on('data', (chunk) => {
        stderr += chunk;
      });
      child.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
      child.on('close', (code, signal) => {
        clearTimeout(timeout);
        resolve({ code, signal, stdout, stderr, timedOut });
      });
    });

    return { ...result, npxInvoked: await exists(npxMarker) };
  } finally {
    await rm(binDir, { recursive: true, force: true });
    await rm(projectDir, { recursive: true, force: true });
  }
}

test('unreachable admin-builder chunk fails preflight before Playwright', async () => {
  const result = await runEditorFlowGateWithStubs({
    curlHttpCode: '000',
    curlExit: 7,
  });

  assert.equal(result.timedOut, false);
  assert.equal(result.signal, null);
  assert.equal(result.stderr, '');
  assert.equal(
    result.code,
    1,
    `editor-flow-gate must fail preflight on chunk HTTP=000\nstdout:\n${result.stdout}`,
  );
  assert.doesNotMatch(result.stdout, /preflight OK/);
  assert.match(result.stdout, /PREFLIGHT/);
  assert.match(result.stdout, /HTTP=000/);
  assert.equal(result.npxInvoked, false, 'Playwright npx command must not run after preflight failure');
});

test('stale admin-builder chunk fails preflight before Playwright with restart guidance', async () => {
  const result = await runEditorFlowGateWithStubs({ curlHttpCode: '404' });

  assert.equal(result.timedOut, false);
  assert.equal(result.signal, null);
  assert.equal(result.stderr, '');
  assert.equal(
    result.code,
    1,
    `editor-flow-gate must fail preflight on chunk HTTP=404\nstdout:\n${result.stdout}`,
  );
  assert.doesNotMatch(result.stdout, /preflight OK/);
  assert.match(result.stdout, /PREFLIGHT/);
  assert.match(result.stdout, /HTTP=404/);
  assert.match(result.stdout, /stale \.next/);
  assert.equal(result.npxInvoked, false, 'Playwright npx command must not run after preflight failure');
});
