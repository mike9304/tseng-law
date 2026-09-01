#!/bin/zsh
# EN/SEA SEO 브랜치 배포 스크립트 (사용자 승인 후 1회 실행)
# 안전장치: origin/main이 작업 베이스(22d43420)에서 움직였으면 중단한다.
set -euo pipefail
cd "$(dirname "$0")/.."

BASE=22d43420
BRANCH=seo/en-sea-expansion-20260901

git fetch origin
CUR=$(git rev-parse --short=8 origin/main)
if [ "$CUR" != "$BASE" ]; then
  echo "ABORT: origin/main($CUR) != 베이스($BASE) — 다른 배포가 먼저 나감. Fable에게 리베이스 요청할 것." >&2
  exit 2
fi

git push origin "$BRANCH"            # 브랜치 백업
git push origin "$BRANCH":main       # fast-forward → Vercel 자동 배포
echo "DONE: main = $(git rev-parse --short=8 origin/main 2>/dev/null || echo pushed). Vercel 배포 확인: https://tseng-law.com/en"
