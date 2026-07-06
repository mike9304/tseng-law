#!/bin/zsh
# run-builder-smoke.sh — run the admin-builder Playwright smoke against an
# ISOLATED copy of builder-site data, via BUILDER_SITE_ROOT.
#
# Why: tests/builder-editor/admin-builder.playwright.ts hits
# GET /ko/admin-builder?reseed=1 as its baseline, which factory-reseeds the
# ko home draft+published. Pointing BUILDER_SITE_ROOT at a throwaway copy
# means reseed=1 only ever destroys the isolated copy, never the shared
# runtime-data/builder-site.
#
# Extension: other stores can be isolated the same way (e.g. set
# BUILDER_EVENTS_ROOT / bookings / commerce roots to paths under
# ISOLATED_ROOT). BUILDER_SITE_ROOT is handled in
# src/lib/builder/site/persistence.ts (localRoot()).

set -e

cd "$(dirname "$0")/.."

# ── Config (env-overridable) ──────────────────────────────────────────
: "${SMOKE_PORT:=4640}"
: "${NEXT_DIST_DIR:=.next-loop-build}"

if [[ ! -d "$NEXT_DIST_DIR" ]]; then
  echo "dist dir missing — build first: NEXT_DIST_DIR=$NEXT_DIST_DIR npx next build" >&2
  exit 1
fi

if lsof -ti :"$SMOKE_PORT" >/dev/null 2>&1; then
  echo "port $SMOKE_PORT already in use — aborting (free it or set SMOKE_PORT)" >&2
  exit 1
fi

# ── Isolated data root (throwaway; kept for forensics) ────────────────
ISOLATED_ROOT=$(mktemp -d /tmp/tseng-smoke-XXXXXX)
mkdir -p "$ISOLATED_ROOT/builder-site"
if [[ -d runtime-data/builder-site/tseng-law-main-site ]]; then
  cp -R runtime-data/builder-site/tseng-law-main-site "$ISOLATED_ROOT/builder-site/"
fi
if [[ -d runtime-data/builder-bookings ]]; then
  cp -R runtime-data/builder-bookings "$ISOLATED_ROOT/"
fi
export BUILDER_BOOKINGS_ROOT="$ISOLATED_ROOT/builder-bookings"
SERVER_LOG="$ISOLATED_ROOT/server.log"

# ── Teardown — ALWAYS runs (trap on EXIT) ─────────────────────────────
SERVER_PID=""
teardown() {
  set +e
  # Kill the background job (npm) if still alive …
  if [[ -n "$SERVER_PID" ]] && kill -0 "$SERVER_PID" 2>/dev/null; then
    kill "$SERVER_PID" 2>/dev/null
  fi
  # … and the actual listener as a fallback (guard against empty output).
  local pids
  pids=$(lsof -ti :"$SMOKE_PORT" 2>/dev/null)
  if [[ -n "$pids" ]]; then
    echo "$pids" | xargs kill 2>/dev/null
  fi
  # Forensics: do NOT delete ISOLATED_ROOT.
  if [[ -n "$ISOLATED_ROOT" ]]; then
    echo "  [teardown] isolated root kept for forensics: $ISOLATED_ROOT"
    echo "  [teardown] server log: $SERVER_LOG"
    echo "  [teardown] remove manually: rm -rf $ISOLATED_ROOT"
  fi
}
trap teardown EXIT

# ── Start production server (mirrors scripts/start-qa-server.sh) ──────
env \
  BLOB_READ_WRITE_TOKEN= \
  BUILDER_SITE_BACKEND=local \
  CONSULTATION_LOG_BACKEND=local \
  BOOKING_PAYMENT_ALLOW_STUB=1 \
  BUILDER_ZOOM_MOCK_ALLOW=1 \
  BOOKING_STRIPE_WEBHOOK_ALLOW_UNSIGNED=1 \
  BILLING_DOCUMENT_STRIPE_WEBHOOK_ALLOW_UNSIGNED=1 \
  COMMERCE_PAYMENT_WEBHOOK_SECRET=local-commerce-webhook-secret \
  BILLING_DOCUMENT_SHARE_SECRET=local-billing-share-secret \
  CRON_SECRET=local-cron-secret \
  BUILDER_MUTATION_RATE_LIMIT=2000 \
  BUILDER_PUBLISH_RATE_LIMIT=500 \
  BUILDER_ASSET_RATE_LIMIT=500 \
  BUILDER_SITE_ROOT="$ISOLATED_ROOT/builder-site" \
  BUILDER_BOOKINGS_ROOT="$BUILDER_BOOKINGS_ROOT" \
  NEXT_DIST_DIR="$NEXT_DIST_DIR" \
  PORT="$SMOKE_PORT" \
  npm run start >"$SERVER_LOG" 2>&1 &
SERVER_PID=$!

# ── Wait for readiness (HTTP 200 on /ko, 1s poll, max 60s) ────────────
echo "[smoke] waiting for http://127.0.0.1:$SMOKE_PORT/ko (up to 60s)…"
READY=0
for i in {1..60}; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:$SMOKE_PORT/ko" 2>/dev/null || true)
  if [[ "$code" == "200" ]]; then
    READY=1
    echo "[smoke] server ready after ${i}s"
    break
  fi
  sleep 1
done
if [[ "$READY" != "1" ]]; then
  echo "[smoke] server did not become ready within 60s; last 20 lines of $SERVER_LOG:" >&2
  tail -n 20 "$SERVER_LOG" >&2 || true
  exit 1
fi

# ── Run the smoke (pass through any extra args, e.g. other specs) ─────
PLAYWRIGHT_EXIT=0
BASE_URL="http://127.0.0.1:$SMOKE_PORT" \
  npx playwright test tests/builder-editor/admin-builder.playwright.ts \
    --project=chromium-builder \
    --reporter=line \
    "$@" || PLAYWRIGHT_EXIT=$?

# ── Result ────────────────────────────────────────────────────────────
if [[ "$PLAYWRIGHT_EXIT" -eq 0 ]]; then
  echo "SMOKE PASS  (isolated root: $ISOLATED_ROOT, log: $SERVER_LOG)"
else
  echo "SMOKE FAIL (exit $PLAYWRIGHT_EXIT)  (isolated root: $ISOLATED_ROOT, log: $SERVER_LOG)"
fi
exit "$PLAYWRIGHT_EXIT"
