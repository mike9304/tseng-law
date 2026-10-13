#!/bin/bash
# MacBook Air auto-deployer for the static tseng-law.com (docs/static-site/README.md).
#
# launchd (com.son7.tseng-static-deploy) runs it every 10 minutes. When origin/main has moved since
# the last successful deploy it: checks out main in a dedicated worktree → builds the static copy
# from the frozen builder data → uploads new media to R2 → asks Codex (ChatGPT login on this Mac)
# to publish it to the Sites project. Any AI on any machine deploys by pushing to main.
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
SITES_REPO="$HOME/tseng-sites-deploy/repo"
PROJECT_ID="appgprj_6acd9a1a4ce4819184cc51672a764431"
MEDIA_ORIGIN="https://media.tseng-law.com"
MEDIA_BUCKET="tseng-law-media"
ACCESS="$(cat "$BASE/access" 2>/dev/null || echo private)"   # private | public
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
  printf '{"state":"%s","commit":"%s","access":"%s","at":"%s","log":"%s","detail":"%s"}\n' \
    "$1" "$2" "$ACCESS" "$(now)" "${LOG:-}" "$(printf '%s' "${3:-}" | tr '"\n' "' " | cut -c1-300)" > "$STATE/status.json"
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
echo "== $(now) deploy $TARGET (last: ${LAST:-none}, access: $ACCESS)"
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

# Codex runs sandboxed to ~/tseng-sites-deploy, so its result file lives there.
mkdir -p "$HOME/tseng-sites-deploy/results"
RESULT="$HOME/tseng-sites-deploy/results/codex-result-${TARGET:0:8}.json"
rm -f "$RESULT"
WO="$(sed -e "s#__PROJECT_ID__#$PROJECT_ID#g" -e "s#__ACCESS__#$ACCESS#g" -e "s#__OUT_DIR__#$WORKTREE/$OUT#g" \
  -e "s#__SITES_REPO__#$SITES_REPO#g" -e "s#__STAMP__#main ${TARGET:0:8} $(now)#g" \
  -e "s#__ARCHIVE__#$HOME/tseng-sites-deploy/site-${TARGET:0:8}.tar.gz#g" -e "s#__RESULT_FILE__#$RESULT#g" \
  scripts/static-site/codex-deploy-wo.md)"
codex exec --skip-git-repo-check -s workspace-write -c sandbox_workspace_write.network_access=true \
  -C "$HOME/tseng-sites-deploy" "$WO" </dev/null || true

STATUS="$(python3 -I -c 'import json,sys; print(json.load(open(sys.argv[1])).get("status",""))' "$RESULT" 2>/dev/null)"
if [ "$STATUS" != "succeeded" ]; then
  fail deploy "$(python3 -I -c 'import json,sys; print(json.load(open(sys.argv[1])).get("error",""))' "$RESULT" 2>/dev/null || echo 'no result file')"
fi
echo "$TARGET" > "$STATE/last-deployed"
rm -f "$STATE"/failed-*
write_status deployed "$TARGET" "$(cat "$RESULT")"
rm -f "$HOME/tseng-sites-deploy"/site-*.tar.gz
find "$LOGS" -name 'deploy-*.log' -mtime +30 -delete
notify "배포 완료: ${TARGET:0:8}"
echo "== $(now) deployed $TARGET"
