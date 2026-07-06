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
  -e BASE_URL=http://localhost:3000 \
  -e NEXT_PUBLIC_SENTRY_DSN='' \
  -e BUILDER_ALLOWED_ORIGINS='http://localhost:3000,https://tseng-law.com' \
  "$IMAGE" bash -lc '
    set -euo pipefail
    npm ci
    npm run build
    npm run start -- -p 3000 > /tmp/next.log 2>&1 &
    for i in $(seq 1 60); do
      if curl -fsS -u admin:local-review-2026! http://localhost:3000/ko/admin-builder >/dev/null 2>&1; then break; fi
      sleep 2
    done
    npx playwright test --config=playwright.config.ts \
      tests/builder-editor/visual-regression.playwright.ts \
      --project=chromium-builder -g "template visual regression" \
      --update-snapshots --workers=2
  '

echo "Linux template baselines written under tests/visual/baseline/. Review + commit them."
