#!/bin/bash
# Publish a static build of tseng-law.com (build.mjs → out/) to its Codex (ChatGPT) Site.
#
#   codex-sites-deploy.sh <static build dir>
#
# 1. sites-pack.mjs → <site repo>/dist (Worker + gzip pages; Sites refuses archives over 256 MiB expanded)
# 2. site repo: Worker manifest + site-build.json (source commit, pack report) committed on main
# 3. codex exec with codex-sites-wo.md: write credential → push → package → save + deploy with the
#    Site's current audience → status. Access and custom-domain changes stay with the owner.
#
# Env: SITE_REPO (default ~/tseng-sites-deploy/repo), SITES_PROJECT_ID, CODEX (default codex).
set -euo pipefail

OUT="$(cd "${1:?usage: codex-sites-deploy.sh <static build dir>}" && pwd)"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_REPO="${SITE_REPO:-$HOME/tseng-sites-deploy/repo}"
PROJECT_ID="${SITES_PROJECT_ID:-appgprj_6acd9a1a4ce4819184cc51672a764431}"
# Sites plugin 1.1+ ships scripts/package-site.mjs; older versions had skills/sites/scripts/package-site.sh.
SITES_DIR="$HOME/.codex/plugins/cache/openai-curated-remote/sites"
PKG="$(ls -d "$SITES_DIR"/*/scripts/package-site.mjs 2>/dev/null | sort -V | tail -1)"
if [ -n "$PKG" ]; then PACKAGER="node $PKG"; else PACKAGER="bash $(ls -d "$SITES_DIR"/*/skills/sites/scripts/package-site.sh | tail -1)"; fi
STAMP="$(date +%Y%m%d-%H%M%S)"
LOGDIR="$(dirname "$SITE_REPO")/deploy-logs"
mkdir -p "$LOGDIR"
SOURCE_COMMIT="$(node -e "process.stdout.write(require(process.argv[1]).commit || '')" "$OUT/build-info.json")"
[ -n "$SOURCE_COMMIT" ] || { echo "no commit in $OUT/build-info.json" >&2; exit 1; }

node "$HERE/sites-pack.mjs" --out="$OUT" --dist="$SITE_REPO/dist" > "$LOGDIR/pack-$STAMP.json"
cd "$SITE_REPO"
[ -z "$(git status --porcelain --untracked-files=no -- . ':!dist')" ] || git status --short
mkdir -p .openai
printf '{"project_id":"%s"}\n' "$PROJECT_ID" > .openai/hosting.json
printf 'dist/\n' > .gitignore
node -e "
const fs = require('fs');
const [out, pack, dest] = process.argv.slice(1);
const info = JSON.parse(fs.readFileSync(out + '/build-info.json', 'utf8'));
fs.writeFileSync(dest, JSON.stringify({ ...info, pack: JSON.parse(fs.readFileSync(pack, 'utf8')) }, null, 2) + '\n');
" "$OUT" "$LOGDIR/pack-$STAMP.json" site-build.json
# The snapshot of the old static attempt and the Worker probe are no longer part of the Site's source.
git rm -r -q --ignore-unmatch out worker scripts/build-probe.sh >/dev/null
git add .openai/hosting.json .gitignore site-build.json
git commit -q -m "tseng-law.com ${SOURCE_COMMIT:0:8} — Worker build with gzip pages" || echo "nothing new to commit"
HEAD_SHA="$(git rev-parse HEAD)"

ARCHIVE="$(dirname "$SITE_REPO")/site-${HEAD_SHA:0:7}.tar.gz"
RESULTS="$LOGDIR/results-$STAMP"
mkdir -p "$RESULTS"
sed -e "s#__PROJECT_ID__#$PROJECT_ID#g" -e "s#__SITE_REPO__#$SITE_REPO#g" -e "s#__HEAD_SHA__#$HEAD_SHA#g" \
  -e "s#__PACKAGER__#$PACKAGER#g" -e "s#__ARCHIVE__#$ARCHIVE#g" -e "s#__RESULTS__#$RESULTS#g" \
  "$HERE/codex-sites-wo.md" > "$LOGDIR/wo-$STAMP.md"
status=0
"${CODEX:-codex}" exec --ephemeral --skip-git-repo-check -s workspace-write \
  -c sandbox_workspace_write.network_access=true -C "$(dirname "$SITE_REPO")" \
  "$(cat "$LOGDIR/wo-$STAMP.md")" </dev/null > "$LOGDIR/codex-$STAMP.log" 2>&1 || status=$?
tail -40 "$LOGDIR/codex-$STAMP.log"
exit $status
