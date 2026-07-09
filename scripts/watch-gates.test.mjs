import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { access, chmod, mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const WATCH_GATES_SCRIPT = join(TEST_DIR, 'watch-gates.sh');
const MISSING_CREDENTIALS_MESSAGE = 'set BUILDER_GATE_USER / BUILDER_GATE_PASS for non-local targets';

function shellSingleQuote(value) {
  return `'${value.replaceAll("'", "'\\''")}'`;
}

async function writeExecutable(path, content) {
  await writeFile(path, content);
  await chmod(path, 0o755);
}

async function runWatchGatesWithStubs({
  editorExit = 2,
  editorOutput = [MISSING_CREDENTIALS_MESSAGE],
  localAvailable = false,
  parityExit = 0,
  softCredentials = false,
  staleParityReport = null,
} = {}) {
  const binDir = await mkdtemp(join(tmpdir(), 'watch-gates-bin-'));
  const projectDir = await mkdtemp(join(tmpdir(), 'watch-gates-project-'));
  const scriptDir = join(projectDir, 'scripts');
  const tmpDir = join(projectDir, 'tmp');
  const parityReportPath = join(tmpDir, 'parity-report.json');
  const editorOutputScript = editorOutput
    .map((line) => `    printf '%s\\n' ${shellSingleQuote(line)}`)
    .join('\n');
  try {
    await mkdir(scriptDir, { recursive: true });
    await symlink(WATCH_GATES_SCRIPT, join(scriptDir, 'watch-gates.sh'));
    if (staleParityReport !== null) {
      await mkdir(tmpDir, { recursive: true });
      await writeFile(parityReportPath, staleParityReport);
    }

    await writeExecutable(join(binDir, 'node'), `#!/bin/sh
case "$1" in
  scripts/live-routes-scan.mjs)
    printf '%s\\n' 'route scan: start' 'route scan: /ko ok' 'route scan: /zh-hant ok'
    exit 0
    ;;
  scripts/parity-report.mjs)
    printf '%s\\n' 'parity report: start'
    exit ${parityExit}
    ;;
  scripts/editor-ink-gate.mjs)
${editorOutputScript}
    exit ${editorExit}
    ;;
  -e)
    if [ -f tmp/parity-report.json ]; then
      sed -n 's/.*"avgDiffPct"[[:space:]]*:[[:space:]]*\\([0-9.][0-9.]*\\).*/\\1/p' tmp/parity-report.json | head -1
    else
      printf '%s\\n' 99
    fi
    exit 0
    ;;
  *)
    printf 'unexpected node invocation: %s\\n' "$*" >&2
    exit 64
    ;;
esac
`);
    await writeExecutable(join(binDir, 'curl'), `#!/bin/sh
exit ${localAvailable ? 0 : 7}
`);

    return await new Promise((resolve, reject) => {
      const child = spawn('/bin/zsh', [join(scriptDir, 'watch-gates.sh')], {
        cwd: projectDir,
        env: {
          LANG: 'C',
          TZ: 'UTC',
          PATH: `${binDir}:${process.env.PATH ?? ''}`,
          LIVE_BASE: 'https://tseng-law.com',
          LOCAL_BASE: 'http://127.0.0.1:9',
          ABOUT_KO_PAGE_ID: 'page-test-editor-ink',
          ...(softCredentials ? { WATCH_GATES_SOFT_CREDENTIALS: '1' } : {}),
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
        access(parityReportPath)
          .then(
            () => true,
            () => false,
          )
          .then((parityReportExists) => {
            resolve({ code, signal, stdout, stderr, timedOut, parityReportExists });
          }, reject);
      });
    });
  } finally {
    await rm(binDir, { recursive: true, force: true });
    await rm(projectDir, { recursive: true, force: true });
  }
}

test('strict missing editor credentials still fail watch-gates', async () => {
  const result = await runWatchGatesWithStubs();

  assert.equal(result.timedOut, false);
  assert.equal(result.signal, null);
  assert.equal(result.stderr, '');
  assert.equal(
    result.code,
    1,
    `watch-gates must fail when editor-ink-gate exits 2 through tail\nstdout:\n${result.stdout}`,
  );
  assert.match(result.stdout, /=== \[1\/3\] routes\+console \(https:\/\/tseng-law\.com\)/);
  assert.match(result.stdout, /route scan: \/ko ok/);
  assert.match(result.stdout, /\(.*http:\/\/127\.0\.0\.1:9.*\)/);
  assert.match(result.stdout, /set BUILDER_GATE_USER \/ BUILDER_GATE_PASS for non-local targets/);
  assert.match(result.stdout, /=== WATCH GATES: 1 FAILED/);
  assert.doesNotMatch(result.stdout, /=== WATCH GATES: ALL PASS/);
});

test('soft credentials flag turns missing editor credentials into explicit warning', async () => {
  const result = await runWatchGatesWithStubs({ softCredentials: true });

  assert.equal(result.timedOut, false);
  assert.equal(result.signal, null);
  assert.equal(result.stderr, '');
  assert.equal(
    result.code,
    0,
    `watch-gates must soft-open only the known missing credential blocker\nstdout:\n${result.stdout}`,
  );
  assert.match(result.stdout, /set BUILDER_GATE_USER \/ BUILDER_GATE_PASS for non-local targets/);
  assert.match(result.stdout, /EDITOR INK CREDENTIAL WARNING \(soft-open\)/);
  assert.match(result.stdout, /=== WATCH GATES: 0 FAILED, 1 CREDENTIAL WARNING/);
  assert.doesNotMatch(result.stdout, /=== WATCH GATES: ALL PASS/);
});

test('soft credentials flag does not hide other editor ink errors', async () => {
  const result = await runWatchGatesWithStubs({
    editorOutput: ['editor ink: start', 'editor ink: unexpected selector drift'],
    softCredentials: true,
  });

  assert.equal(result.timedOut, false);
  assert.equal(result.signal, null);
  assert.equal(result.stderr, '');
  assert.equal(
    result.code,
    1,
    `watch-gates must fail non-credential editor errors even with soft credentials\nstdout:\n${result.stdout}`,
  );
  assert.match(result.stdout, /editor ink: unexpected selector drift/);
  assert.match(result.stdout, /=== WATCH GATES: 1 FAILED/);
  assert.doesNotMatch(result.stdout, /CREDENTIAL WARNING/);
  assert.doesNotMatch(result.stdout, /=== WATCH GATES: ALL PASS/);
});

test('failed parity command cannot pass from stale parity report json', async () => {
  const result = await runWatchGatesWithStubs({
    editorExit: 0,
    localAvailable: true,
    parityExit: 2,
    staleParityReport: '{"avgDiffPct":0}\n',
  });

  assert.equal(result.timedOut, false);
  assert.equal(result.signal, null);
  assert.equal(result.stderr, '');
  assert.equal(
    result.code,
    1,
    `watch-gates must fail when parity-report exits 2 even with stale passing JSON\nstdout:\n${result.stdout}`,
  );
  assert.match(result.stdout, /=== \[2\/3\] parity \(live vs http:\/\/127\.0\.0\.1:9\)/);
  assert.match(result.stdout, /PARITY FAIL command/);
  assert.match(result.stdout, /=== WATCH GATES: 1 FAILED/);
  assert.equal(result.parityReportExists, false);
  assert.doesNotMatch(result.stdout, /PARITY OK avg=0%/);
  assert.doesNotMatch(result.stdout, /=== WATCH GATES: ALL PASS/);
});
