#!/usr/bin/env bash
# visual-baselines-docker.sh — regenerate template visual baselines in the SAME Linux render
# the CI job uses (mcr.microsoft.com/playwright:v1.59.1), so committed baselines == CI render.
#
# WIX-PERFECT #5: local macOS baselines false-fail on ubuntu CI (no {platform} in
# snapshotPathTemplate). Run this (Docker required) to author Linux baselines before committing.
#
# Usage:  ./scripts/visual-baselines-docker.sh
# Requires: Docker running. The app is built + started inside the container; baselines are
# written to tests/visual/baseline/ on the host via the bind mount.
set -euo pipefail

IMAGE="mcr.microsoft.com/playwright:v1.59.1-noble"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required but not installed." >&2
  exit 1
fi

docker run --rm -t \
  -v "$ROOT":/work -w /work \
  -e BASE_URL=http://127.0.0.1:3000 \
  -e NEXT_DIST_DIR=.next-build \
  -e NEXT_PUBLIC_SENTRY_DSN='' \
  -e BUILDER_ALLOWED_ORIGINS='http://127.0.0.1:3000,https://tseng-law.com' \
  "$IMAGE" bash -lc '
    set -euo pipefail
    apt-get update
    apt-get install -y --no-install-recommends zsh
    rm -rf /var/lib/apt/lists/*
    npm ci
    node --test scripts/ci-playwright-qa-harness.test.mjs
    NEXT_DIST_DIR=.next-build npm run build

    QA_PORT=3000
    QA_HARNESS_LOG=/tmp/visual-baselines-qa-harness.log
    QA_MANIFEST_PATH="$(
      node scripts/qa-runtime-isolation-contract.mjs manifest-path \
        --tmp-base "${TMPDIR:-/tmp}" \
        --repository-root "$PWD" \
        --base-url "$BASE_URL"
    )"
    QA_HARNESS_PID=""

    cleanup_qa_harness() {
      local original_status=$?
      local harness_status=0
      trap - EXIT INT TERM HUP
      set +e
      if [[ -n "$QA_HARNESS_PID" ]] && kill -0 "$QA_HARNESS_PID" 2>/dev/null; then
        kill -TERM "$QA_HARNESS_PID" 2>/dev/null
      fi
      if [[ -n "$QA_HARNESS_PID" ]]; then
        # Waiting is mandatory: the harness proves canonical checksums in its
        # own EXIT trap before this Docker command may finish.
        wait "$QA_HARNESS_PID" 2>/dev/null
        harness_status=$?
      fi
      if (( original_status == 0 && harness_status != 0 && harness_status != 143 )); then
        original_status=$harness_status
      fi
      if (( original_status != 0 )); then
        tail -n 80 "$QA_HARNESS_LOG" >&2 || true
      fi
      exit "$original_status"
    }
    trap cleanup_qa_harness EXIT
    trap "exit 130" INT
    trap "exit 143" TERM
    trap "exit 129" HUP

    PORT="$QA_PORT" NEXT_DIST_DIR="$NEXT_DIST_DIR" \
      ./scripts/start-qa-server.sh >"$QA_HARNESS_LOG" 2>&1 &
    QA_HARNESS_PID=$!

    ready=0
    for i in $(seq 1 90); do
      if ! kill -0 "$QA_HARNESS_PID" 2>/dev/null; then
        echo "QA harness exited before readiness" >&2
        exit 1
      fi
      if curl -fsS "$BASE_URL/ko" >/dev/null 2>&1 \
        && node -e '"'"'
          const fs = require("node:fs");
          const [manifestPath, baseUrl, repositoryRoot, ownerPid] = process.argv.slice(1);
          try {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
            process.exit(
              manifest.schemaVersion === 3
              && manifest.state === "ready"
              && manifest.baseUrl === baseUrl
              && manifest.repositoryRoot === repositoryRoot
              && manifest.ownerPid === Number(ownerPid)
              ? 0 : 1
            );
          } catch {
            process.exit(1);
          }
        '"'"' "$QA_MANIFEST_PATH" "$BASE_URL" "$PWD" "$QA_HARNESS_PID"
      then
        ready=1
        break
      fi
      sleep 2
    done
    if [[ "$ready" != "1" ]]; then
      echo "QA harness did not publish a ready attestation manifest" >&2
      exit 1
    fi

    npx playwright test --config=playwright.config.ts \
      tests/builder-editor/visual-regression.playwright.ts \
      --project=chromium-builder -g "template visual regression" \
      --update-snapshots --workers=2
  '

echo "Linux template baselines written under tests/visual/baseline/. Review + commit them."
