#!/usr/bin/env bash
# Freezes the production builder content (ko/zh-hant pages, header/footer, lawyer columns, FAQ)
# into static-data/prod-mirror with the read-only mirror script (scripts/pull-prod-builder-data.mjs).
#
# Run it yourself: it uses your Vercel CLI login. The production env file exists only inside a
# temporary directory that is deleted on exit; nothing secret is written to the repository.
#
#   bash scripts/static-site/pull-data.sh
set -euo pipefail

repo="$(cd "$(dirname "$0")/../.." && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
chmod 700 "$tmp"

(
  cd "$tmp"
  # Pinned CLI version; stdout is quiet, errors stay visible.
  npx -y vercel@63.1.2 link --yes --project sejong-law --scope mike9304s-projects >/dev/null
  npx -y vercel@63.1.2 env pull "$tmp/.env.production" --environment=production --yes >/dev/null
)

cd "$repo"
node scripts/pull-prod-builder-data.mjs --env="$tmp/.env.production" --out=static-data/prod-mirror
echo "Mirrored into $repo/static-data/prod-mirror"
