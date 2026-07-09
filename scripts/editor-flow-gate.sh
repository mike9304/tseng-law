#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# editor-flow-gate — 빌더 에디터 실사용 플로우(칼럼 생성→편집→미디어→발행→삭제)를
# 격리 dev 샌드박스에서 검증하는 신뢰 에디터 게이트.
#
# watch-gates.sh는 공개 사이트(routes/parity/ink)만 본다 — 이 게이트가 에디터 축을 맡는다.
#
# 왜 columns-ui-workflow인가(L23): 이 테스트는 자기 데이터를 생성·정리하므로 시드 드리프트에
# 무관하고, 딥 에디터 스위트(693개)의 환경 false-fail(nextjs-portal dev오버레이 a11y,
# 공유 home 드래프트 오염, 시드 드리프트)을 겪지 않는다. 딥스위트는 CI의 fresh-seed+
# 프로덕션 빌드에서만 유효.
#
# 사용:  BASE_URL=http://127.0.0.1:4722 scripts/editor-flow-gate.sh
#        (BUILDER_SMOKE_USERNAME/PASSWORD 또는 기본 admin/local-review-2026! httpCredentials 사용)
# 종료코드: 0 = 통과, 1 = 실패(청크 stale 프리플라이트 포함).
# ---------------------------------------------------------------------------
set -uo pipefail
BASE_URL="${BASE_URL:-http://127.0.0.1:4722}"
CRED_U="${BUILDER_SMOKE_USERNAME:-admin}"
CRED_P="${BUILDER_SMOKE_PASSWORD:-local-review-2026!}"

echo "[editor-flow-gate] BASE_URL=$BASE_URL"

# --- L22 프리플라이트: admin-builder JS 청크가 200인지 확인 ---
# 장수명 dev 샌드박스는 세션 중 core파일 hot-reload가 누적되면 청크 해시가 어긋나
# _next/static/chunks/app/(builder)/[locale]/admin-builder/layout.js를 404(text/html)로
# 서빙한다 → JS 미로드 → React 미하이드레이트 → useEffect 미실행 → UI 테스트가 제품버그처럼
# false-fail. 페이지 200 워밍으론 안 고쳐진다. 클린 재시작(npm run dev = clean-next-build)이 정답.
CHUNK_URL="$BASE_URL/_next/static/chunks/app/(builder)/%5Blocale%5D/admin-builder/layout.js"
CHUNK_CODE=$(curl -s -o /dev/null -w '%{http_code}' "$CHUNK_URL" -u "$CRED_U:$CRED_P" --max-time 15 2>/dev/null || true)
CHUNK_CODE="${CHUNK_CODE:-000}"
if [ "$CHUNK_CODE" != "200" ]; then
  if [ "$CHUNK_CODE" = "404" ]; then
    echo "[editor-flow-gate] ✗ PREFLIGHT: admin-builder chunk fetch failed (HTTP=404, stale .next). 샌드박스를 클린 재시작하세요:"
    echo "    lsof -ti :\${PORT} | xargs kill; BUILDER_SITE_ROOT=<sbx>/tseng-law-main-site BUILDER_SITE_BACKEND=local PORT=\${PORT} npm run dev"
  else
    echo "[editor-flow-gate] ✗ PREFLIGHT: admin-builder chunk fetch failed (HTTP=$CHUNK_CODE/unreachable). Check BASE_URL reachability and credentials."
  fi
  exit 1
fi
echo "[editor-flow-gate] preflight OK (chunk HTTP=$CHUNK_CODE)"

# --- 자기시딩 에디터 워크플로 테스트 ---
BASE_URL="$BASE_URL" BUILDER_SMOKE_USERNAME="$CRED_U" BUILDER_SMOKE_PASSWORD="$CRED_P" \
  npx playwright test --config=playwright.config.ts \
  tests/builder-editor/columns-ui-workflow.playwright.ts \
  --project=chromium-builder
RESULT=$?

if [ "$RESULT" = "0" ]; then
  echo "[editor-flow-gate] EDITOR FLOW: PASS (생성·편집·미디어·발행·삭제 워크플로 그린)"
else
  echo "[editor-flow-gate] EDITOR FLOW: FAIL (exit=$RESULT)"
fi
exit $RESULT
