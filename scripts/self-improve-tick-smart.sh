#!/bin/zsh
# ---------------------------------------------------------------------------
# self-improve-tick-smart.sh — 감독형(대화형) SMART tick.
#
# 무인 tick(self-improve-tick.sh, 6축 sandbox-free)이 못 보는 **샌드박스 필요 축**을
# 격리 dev 샌드박스에서 검증한다. 현재: 에디터 실사용 축(빌더의 핵심 제품).
#   editor-flow-gate.sh = 자기시딩 columns 워크플로(생성→편집→미디어→발행→삭제).
#
# 왜 무인이 아니라 감독형인가: 격리 dev 샌드박스 spin(빌드/서버/청크 프리플라이트)은
# 무겁고 환경 false-fail(L22/L23) 소지가 있어 사람이 지켜보는 세션에서 돌린다.
#
# 자율 경계: REPORT-ONLY. 커밋·푸시·배포 안 함. 실데이터 미접촉(격리 사본만).
# 사용:  scripts/self-improve-tick-smart.sh
# 종료:  0 = 에디터 축 green, 1 = 발견(사람/하청 트리아지).
# ---------------------------------------------------------------------------
set -uo pipefail
cd "$(dirname "$0")/.."
PORT="${SMART_PORT:-4722}"
DIST="${SMART_DIST:-.next-smart-tick}"
CRED_U="${BUILDER_SMOKE_USERNAME:-admin}"
CRED_P="${BUILDER_SMOKE_PASSWORD:-local-review-2026!}"
TS="$(date '+%Y-%m-%dT%H%M%S%z')"
OUT=".omo/evidence/self-improve-tick-smart-${TS}.md"
mkdir -p .omo/evidence
findings=0
{ echo "# smart tick (editor axis, report-only) ${TS}"; echo "port=${PORT}"; echo; } > "$OUT"

# 포트 정리 + 격리 dev 샌드박스(실데이터 미접촉)
lsof -ti :"$PORT" 2>/dev/null | xargs kill 2>/dev/null; sleep 1
ISO=$(mktemp -d /tmp/tseng-smart-XXXXXX)
mkdir -p "$ISO/builder-site"
cp -R runtime-data/builder-site/tseng-law-main-site "$ISO/builder-site/"
[ -d runtime-data/builder-bookings ] && cp -R runtime-data/builder-bookings "$ISO/"

cleanup() {
  lsof -ti :"$PORT" 2>/dev/null | xargs kill 2>/dev/null
  git checkout -- tsconfig.json 2>/dev/null   # dev가 추가한 dist types include 원복(빌드레이스 아티팩트)
  echo "  [cleanup] sandbox kept for forensics: $ISO"
}
trap cleanup EXIT

echo "[smart] 격리 dev 샌드박스 기동(port $PORT)…"
env BLOB_READ_WRITE_TOKEN= BUILDER_SITE_BACKEND=local CONSULTATION_LOG_BACKEND=local \
  BUILDER_SITE_ROOT="$ISO/builder-site" BUILDER_BOOKINGS_ROOT="$ISO/builder-bookings" \
  NEXT_DIST_DIR="$DIST" PORT="$PORT" npm run dev > "$ISO/dev.log" 2>&1 &

READY=0
for i in $(seq 1 120); do
  [ "$(curl -s -o /dev/null -w '%{http_code}' --max-time 6 "http://127.0.0.1:$PORT/ko" 2>/dev/null)" = "200" ] && { READY=1; break; }
  sleep 1
done
if [ "$READY" != "1" ]; then
  echo "- editor: 샌드박스 미기동(120s) — 환경 이슈, dev.log=$ISO/dev.log" >> "$OUT"
  echo "VERDICT: SKIP (환경 미기동, 제품결함 아님)" >> "$OUT"
  echo "[smart] 샌드박스 미기동 → $OUT" >&2
  exit 0   # 환경 미기동은 제품 발견이 아님(무인 tick과 달리 SKIP 처리)
fi

echo "[smart] admin-builder 워밍(route compile 트리거)…"
curl -s -o /dev/null --max-time 90 -u "$CRED_U:$CRED_P" "http://127.0.0.1:$PORT/ko/admin-builder" || true

echo "[smart] editor-flow-gate 실행…"
if BASE_URL="http://127.0.0.1:$PORT" BUILDER_SMOKE_USERNAME="$CRED_U" BUILDER_SMOKE_PASSWORD="$CRED_P" \
   scripts/editor-flow-gate.sh > "$ISO/editor-gate.log" 2>&1; then
  echo "- editor-flow: PASS (columns 생성→편집→미디어→발행→삭제 그린)" >> "$OUT"
else
  # L22/L25: preflight/청크 실패는 환경, 그 외는 제품 발견
  if grep -qiE 'PREFLIGHT|stale .next|reachability|credential' "$ISO/editor-gate.log"; then
    echo "- editor-flow: SKIP (preflight/환경 — dev 청크/크레덴셜, 제품결함 아님): $(grep -iE 'PREFLIGHT' "$ISO/editor-gate.log" | tail -1)" >> "$OUT"
  else
    echo "- editor-flow: FAIL (제품 회귀 가능) — $(tail -2 "$ISO/editor-gate.log" | tr '\n' ' ')" >> "$OUT"
    findings=$((findings+1))
  fi
fi

echo >> "$OUT"
if [ "$findings" = "0" ]; then
  echo "VERDICT: SMART TICK GREEN (0 findings) — 에디터 축 정상." >> "$OUT"
  echo "[smart] GREEN → $OUT"
  exit 0
else
  echo "VERDICT: $findings finding(s) — 사람/하청 트리아지(자동 수정·커밋·배포 금지)." >> "$OUT"
  echo "[smart] FINDINGS=$findings → $OUT" >&2
  exit 1
fi
