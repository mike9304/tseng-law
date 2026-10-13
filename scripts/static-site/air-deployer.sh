#!/bin/bash
# MacBook Air auto-deployer for the static tseng-law.com (docs/static-site/README.md).
#
# launchd (com.son7.tseng-static-deploy) runs it every 10 minutes. When origin/main has moved since
# the last successful deploy it: checks out main in a dedicated worktree → builds the static copy
# from the frozen builder data → uploads new media to R2 → deploys it to Cloudflare Workers static
# assets with this Mac's Cloudflare login (wrangler) → confirms /build-info.json shows the commit.
# Any AI on any machine deploys by pushing to main.
#
#   air-deployer.sh            deploy if main moved
#   air-deployer.sh --force    deploy main now even if it is already live
#
# State and logs: ~/tseng-static-deploy/{state,logs}. status.json = last attempt, last-deployed = SHA.
set -uo pipefail

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
BASE="$HOME/tseng-static-deploy"
WORKTREE="$HOME/Projects/tseng-law-deploy"
MAIN_CHECKOUT="$HOME/Projects/tseng-law"
DATA="$BASE/data/prod-mirror"
MEDIA_ORIGIN="https://media.tseng-law.com"
MEDIA_BUCKET="tseng-law-media"
WRANGLER="wrangler@4.149.0"
# Where the deployed copy is checked: the preview URL until tseng-law.com points at the Worker.
SITE_URL="$(cat "$BASE/site-url" 2>/dev/null || echo https://tseng-law.sejong-law.workers.dev)"
OUT="out-deploy"
STATE="$BASE/state"
LOGS="$BASE/logs"
mkdir -p "$STATE" "$LOGS"

LOCK="$STATE/lock"
if ! mkdir "$LOCK" 2>/dev/null; then
  # A lock older than 3 hours belongs to a run that died (sleep, reboot).
  if [ -n "$(find "$LOCK" -maxdepth 0 -mmin +180 2>/dev/null)" ]; then
    rm -rf "$LOCK" && mkdir "$LOCK" || exit 0
  else
    exit 0
  fi
fi
trap 'rm -rf "$LOCK"' EXIT

now() { date -u +%Y-%m-%dT%H:%M:%SZ; }
write_status() { # state commit detail
  printf '{"state":"%s","commit":"%s","site":"%s","at":"%s","log":"%s","detail":"%s"}\n' \
    "$1" "$2" "$SITE_URL" "$(now)" "${LOG:-}" "$(printf '%s' "${3:-}" | tr '"\n' "' " | cut -c1-300)" > "$STATE/status.json"
}
notify() { osascript -e "display notification \"$1\" with title \"tseng-law 배포\"" >/dev/null 2>&1 || true; }

if [ ! -d "$WORKTREE/.git" ] && [ ! -f "$WORKTREE/.git" ]; then
  git -C "$MAIN_CHECKOUT" worktree add --detach "$WORKTREE" origin/main >/dev/null 2>&1 || { write_status setup-failed "" "worktree"; exit 1; }
fi
git -C "$WORKTREE" fetch -q origin main || { write_status fetch-failed "" "git fetch"; exit 1; }
TARGET="$(git -C "$WORKTREE" rev-parse origin/main)"
LAST="$(cat "$STATE/last-deployed" 2>/dev/null || true)"
if [ "${1:-}" != "--force" ]; then
  [ "$TARGET" = "$LAST" ] && exit 0
  # A commit that failed is retried at most once an hour.
  if [ -f "$STATE/failed-$TARGET" ] && [ -z "$(find "$STATE/failed-$TARGET" -mmin +60 2>/dev/null)" ]; then exit 0; fi
fi

LOG="$LOGS/deploy-$(date +%Y%m%d-%H%M%S)-${TARGET:0:8}.log"
exec >>"$LOG" 2>&1
echo "== $(now) deploy $TARGET (last: ${LAST:-none}, site: $SITE_URL)"
fail() { write_status "$1" "$TARGET" "$2"; touch "$STATE/failed-$TARGET"; notify "배포 실패 ($1): ${TARGET:0:8}"; echo "FAILED: $1 $2"; exit 1; }
write_status building "$TARGET" ""

cd "$WORKTREE" || fail setup "worktree missing"
git checkout -q --detach "$TARGET" && git clean -fdq || fail checkout "git checkout"
LOCK_HASH="$(shasum package-lock.json | cut -d' ' -f1)"
if [ ! -d node_modules ] || [ "$(cat "$STATE/npm-lock-hash" 2>/dev/null)" != "$LOCK_HASH" ]; then
  npm ci --no-audit --no-fund || fail npm "npm ci"
  echo "$LOCK_HASH" > "$STATE/npm-lock-hash"
fi

node scripts/static-site/build.mjs --data="$DATA" --media-origin="$MEDIA_ORIGIN" --out="$OUT" || fail build "static build (see log)"
node scripts/static-site/upload-media.mjs --bucket="$MEDIA_BUCKET" || fail media "R2 upload (see log)"

npx -y "$WRANGLER" deploy --config scripts/static-site/wrangler.jsonc --assets "$OUT" \
  --message "main ${TARGET:0:8}" || fail deploy "wrangler deploy (see log)"

# The edge may take a moment; the deploy counts only when the site reports the new commit.
LIVE=""
for _ in 1 2 3 4 5 6 7 8 9 10 11 12; do
  LIVE="$(curl -fsS "$SITE_URL/build-info.json?t=$(date +%s)" 2>/dev/null | python3 -I -c 'import json,sys; print(json.load(sys.stdin).get("commit",""))' 2>/dev/null)"
  [ "$LIVE" = "$TARGET" ] && break
  sleep 10
done
[ "$LIVE" = "$TARGET" ] || fail verify "build-info.json shows ${LIVE:-nothing}, expected $TARGET"
echo "$TARGET" > "$STATE/last-deployed"
rm -f "$STATE"/failed-*
write_status deployed "$TARGET" "live at $SITE_URL"
find "$LOGS" -name 'deploy-*.log' -mtime +30 -delete
notify "배포 완료: ${TARGET:0:8}"
echo "== $(now) deployed $TARGET"
