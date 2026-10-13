#!/bin/bash
# Installs the MacBook Air auto-deployer (air-deployer.sh) as a launchd agent that runs every
# 10 minutes. Re-run after changing air-deployer.sh. Only on the Mac whose Codex is logged into the
# ChatGPT account that owns the Sites project.
#
#   bash scripts/static-site/install-air-deployer.sh <frozen data dir> [private|public]
set -euo pipefail

DATA_SOURCE="${1:?usage: install-air-deployer.sh <frozen data dir (prod-mirror)> [private|public]}"
ACCESS="${2:-private}"
BASE="$HOME/tseng-static-deploy"
LABEL="com.son7.tseng-static-deploy"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
HERE="$(cd "$(dirname "$0")" && pwd)"

mkdir -p "$BASE/bin" "$BASE/data" "$BASE/state" "$BASE/logs"
install -m 755 "$HERE/air-deployer.sh" "$BASE/bin/air-deployer.sh"
rsync -a --delete "${DATA_SOURCE%/}/" "$BASE/data/prod-mirror/"
echo "$ACCESS" > "$BASE/access"

cat > "$PLIST" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>$LABEL</string>
  <key>ProgramArguments</key>
  <array><string>/bin/bash</string><string>$BASE/bin/air-deployer.sh</string></array>
  <key>StartInterval</key><integer>600</integer>
  <key>RunAtLoad</key><true/>
  <key>StandardOutPath</key><string>$BASE/logs/launchd.log</string>
  <key>StandardErrorPath</key><string>$BASE/logs/launchd.log</string>
</dict>
</plist>
PLIST

launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$PLIST"
echo "installed $LABEL (access: $ACCESS); status: cat $BASE/state/status.json"
