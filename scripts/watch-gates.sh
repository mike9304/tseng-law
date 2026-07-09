#!/bin/zsh
# ---------------------------------------------------------------------------
# watch-gates — 회귀 감시 스탠딩 스위트를 한 번에 실행한다.
#   1) live-routes-scan   : ko/zh 전 페이지 200 + 콘솔 에러 0
#   2) parity-report      : 오버레이 표준 페이지 라이브 vs 로컬(스테이징) 0% 게이트
#   3) editor-ink-gate    : 에디터 어토니 카드 라벨 잉크(양방향)
#
# 필요 환경:
#   BUILDER_GATE_USER / BUILDER_GATE_PASS  (프로드 에디터 basic auth)
#   LOCAL_BASE (기본 http://127.0.0.1:4722 — BUILDER_SITE_ROOT 격리 샌드박스,
#               4개 표준 페이지가 decompose+publish된 상태여야 파리티가 유효)
#   ABOUT_KO_PAGE_ID (기본: 프로드 page-1779434820405-7)
#   WATCH_GATES_SOFT_CREDENTIALS=1  (스케줄러용: editor ink 크레덴셜 부재만 WARN 처리)
#
# 사용:  BUILDER_GATE_USER=.. BUILDER_GATE_PASS=.. ./scripts/watch-gates.sh
# 종료코드: 0 = 전 게이트 통과.
# ---------------------------------------------------------------------------
set -u
set -o pipefail
cd "$(dirname "$0")/.."
LIVE_BASE="${LIVE_BASE:-https://tseng-law.com}"
LOCAL_BASE="${LOCAL_BASE:-http://127.0.0.1:4722}"
ABOUT_KO_PAGE_ID="${ABOUT_KO_PAGE_ID:-page-1779434820405-7}"
EDITOR_INK_MISSING_CREDENTIALS="set BUILDER_GATE_USER / BUILDER_GATE_PASS for non-local targets"
fails=0
credential_warnings=0

echo "=== [1/3] routes+console ($LIVE_BASE)"
node scripts/live-routes-scan.mjs --base="$LIVE_BASE" | tail -3 || fails=$((fails+1))

echo "=== [2/3] parity (live vs $LOCAL_BASE)"
if curl -s -o /dev/null --max-time 8 "$LOCAL_BASE/ko"; then
  rm -f tmp/parity-report.json
  if node scripts/parity-report.mjs \
    --live="$LIVE_BASE" --local="$LOCAL_BASE" \
    --pages=/ko/about,/ko/contact,/ko/pricing,/zh-hant/about \
    --viewports=1280x900,375x812 2>&1 | sed -n '/평균 diff/p;/┌/,/└/p'; then
    # 평균 diff가 0.5% 초과면 실패로 간주
    avg=$(node -e "
      try { const r = require(process.cwd() + '/tmp/parity-report.json');
        console.log(r.avgDiffPct ?? 99); } catch { console.log(99); }" 2>/dev/null)
    if (( $(echo "$avg > 0.5" | bc -l) )); then echo "PARITY FAIL avg=$avg%"; fails=$((fails+1)); else echo "PARITY OK avg=$avg%"; fi
    # L30: diff%는 최소높이 크롭이라 stageHeight 높이차(Δh)에 눈이 먼다 — heightGate로 미시딩/height 회귀 잡기.
    hgt=$(node -e "try{const r=require(process.cwd()+'/tmp/parity-report.json');console.log((r.heightGate&&r.heightGate.count)||0);}catch{console.log(0);}" 2>/dev/null)
    if [ "${hgt:-0}" != "0" ]; then echo "PARITY FAIL height-drift count=$hgt (Δh 미시딩/회귀)"; fails=$((fails+1)); else echo "PARITY HEIGHT OK (drift=0)"; fi
  else
    echo "PARITY FAIL command"
    fails=$((fails+1))
  fi
else
  echo "(로컬 샌드박스 $LOCAL_BASE 미가동 — 파리티 게이트 스킵)"
fi

echo "=== [3/3] editor ink gate (about ko)"
editor_ink_output=$(node scripts/editor-ink-gate.mjs --url="$LIVE_BASE/ko/admin-builder?pageId=$ABOUT_KO_PAGE_ID" 2>&1)
editor_ink_status=$?
printf '%s\n' "$editor_ink_output" | tail -2
if (( editor_ink_status != 0 )); then
  editor_ink_nonempty_output=$(printf '%s\n' "$editor_ink_output" | sed '/^[[:space:]]*$/d')
  if [[ "${WATCH_GATES_SOFT_CREDENTIALS:-0}" == "1" && "$editor_ink_nonempty_output" == "$EDITOR_INK_MISSING_CREDENTIALS" ]]; then
    credential_warnings=$((credential_warnings+1))
    echo "EDITOR INK CREDENTIAL WARNING (soft-open): $EDITOR_INK_MISSING_CREDENTIALS"
  else
    fails=$((fails+1))
  fi
fi

if (( fails == 0 && credential_warnings > 0 )); then
  echo "=== WATCH GATES: 0 FAILED, $credential_warnings CREDENTIAL WARNING"
else
  echo "=== WATCH GATES: $([ $fails -eq 0 ] && echo ALL PASS || echo "$fails FAILED")"
fi
exit $fails
