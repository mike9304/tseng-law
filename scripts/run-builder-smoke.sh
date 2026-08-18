#!/bin/zsh
# Run the admin-builder smoke only through the attested QA harness. The harness
# owns isolation, deterministic credentials/backends, manifest publication,
# and canonical-data checksum verification.

set -eu
set -o pipefail

SCRIPT_DIR="${0:A:h}"
REPO_ROOT="${SCRIPT_DIR:h}"
cd "$REPO_ROOT"

: "${SMOKE_PORT:=4640}"
: "${NEXT_DIST_DIR:?NEXT_DIST_DIR is required (build a clean dist before running the smoke)}"

if [[ ! "$SMOKE_PORT" =~ '^[0-9]+$' ]] \
  || (( SMOKE_PORT < 1 || SMOKE_PORT > 65535 ))
then
  echo "invalid SMOKE_PORT: expected an integer from 1 to 65535" >&2
  exit 2
fi

if [[ ! -d "$NEXT_DIST_DIR" ]]; then
  echo "dist dir missing: NEXT_DIST_DIR=$NEXT_DIST_DIR" >&2
  exit 1
fi

if lsof -tiTCP:"$SMOKE_PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "port $SMOKE_PORT already has a listener; refusing to start QA harness" >&2
  exit 2
fi

QA_BASE_URL="http://127.0.0.1:$SMOKE_PORT"
MANIFEST_PATH=$(node "$REPO_ROOT/scripts/qa-runtime-isolation-contract.mjs" manifest-path \
  --tmp-base "${TMPDIR:-/tmp}" \
  --repository-root "$REPO_ROOT" \
  --base-url "$QA_BASE_URL")
FORENSICS_ROOT=$(mktemp -d "${TMPDIR:-/tmp}/tseng-builder-smoke-XXXXXX")
HARNESS_LOG="$FORENSICS_ROOT/qa-harness.log"
HARNESS_PID=""

teardown() {
  local original_status=$?
  local harness_status=0
  trap - EXIT INT TERM HUP
  set +e
  if [[ -n "$HARNESS_PID" ]] && kill -0 "$HARNESS_PID" 2>/dev/null; then
    kill -TERM "$HARNESS_PID" 2>/dev/null
  fi
  if [[ -n "$HARNESS_PID" ]]; then
    # start-qa-server.sh performs its canonical checksum proof in its own EXIT
    # trap. Waiting here ensures that proof finishes before this wrapper exits.
    wait "$HARNESS_PID" 2>/dev/null
    harness_status=$?
  fi
  # SIGTERM (143) is the expected controlled shutdown. If Playwright passed
  # but the harness checksum/lifecycle trap failed, preserve that hard failure.
  if (( original_status == 0 && harness_status != 0 && harness_status != 143 )); then
    original_status=$harness_status
  fi
  echo "[smoke] QA harness log kept for forensics: $HARNESS_LOG"
  echo "[smoke] wrapper artifacts kept for forensics: $FORENSICS_ROOT"
  exit "$original_status"
}
trap teardown EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
trap 'exit 129' HUP

env \
  PORT="$SMOKE_PORT" \
  QA_BASE_URL="$QA_BASE_URL" \
  NEXT_DIST_DIR="$NEXT_DIST_DIR" \
  "$REPO_ROOT/scripts/start-qa-server.sh" >"$HARNESS_LOG" 2>&1 &
HARNESS_PID=$!

echo "[smoke] waiting for isolated QA harness at $QA_BASE_URL (up to 90s)"
ready=0
for second in {1..90}; do
  if ! kill -0 "$HARNESS_PID" 2>/dev/null; then
    echo "QA harness exited before readiness; last 40 log lines:" >&2
    tail -n 40 "$HARNESS_LOG" >&2 || true
    exit 1
  fi

  http_status=$(curl \
    --silent \
    --output /dev/null \
    --write-out '%{http_code}' \
    --max-time 1 \
    "$QA_BASE_URL/ko" 2>/dev/null || true)
  if [[ "$http_status" == "200" ]] && node -e '
    const fs = require("node:fs");
    const [manifestPath, baseUrl, repositoryRoot, ownerPidInput] = process.argv.slice(1);
    const expectedOwnerPid = Number(ownerPidInput);
    let descriptor;
    const alive = (pid) => {
      if (!Number.isSafeInteger(pid) || pid <= 0) return false;
      try { process.kill(pid, 0); return true; }
      catch (error) { return Boolean(error && error.code === "EPERM"); }
    };
    try {
      descriptor = fs.openSync(manifestPath, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
      const stats = fs.fstatSync(descriptor);
      if (!stats.isFile() || (stats.mode & 0o777) !== 0o600) process.exit(1);
      const manifest = JSON.parse(fs.readFileSync(descriptor, "utf8"));
      const ready = manifest
        && manifest.schemaVersion === 3
        && manifest.state === "ready"
        && manifest.baseUrl === baseUrl
        && manifest.manifestPath === manifestPath
        && manifest.repositoryRoot === repositoryRoot
        && /^[a-f0-9]{32}$/.test(manifest.runId)
        && manifest.ownerPid === expectedOwnerPid
        && alive(manifest.ownerPid)
        && alive(manifest.serverPid);
      process.exit(ready ? 0 : 1);
    } catch { process.exit(1); }
    finally { if (descriptor !== undefined) fs.closeSync(descriptor); }
  ' "$MANIFEST_PATH" "$QA_BASE_URL" "$REPO_ROOT" "$HARNESS_PID" 2>/dev/null; then
    ready=1
    echo "[smoke] QA harness HTTP + ready-manifest gate passed after ${second}s"
    break
  fi
  sleep 1
done

if [[ "$ready" != "1" ]]; then
  echo "QA harness did not become ready; last 40 log lines:" >&2
  tail -n 40 "$HARNESS_LOG" >&2 || true
  exit 1
fi

# Playwright config reloads the fixed ready manifest and global setup proves a
# fresh challenge-response attestation before any test is scheduled.
set +e
BASE_URL="$QA_BASE_URL" \
  npx playwright test tests/builder-editor/admin-builder.playwright.ts \
    --project=chromium-builder \
    --reporter=line \
    "$@"
playwright_status=$?
set -e

if (( playwright_status == 0 )); then
  echo "SMOKE PASS (harness log: $HARNESS_LOG)"
else
  echo "SMOKE FAIL (exit $playwright_status; harness log: $HARNESS_LOG)" >&2
fi
exit "$playwright_status"
