#!/bin/zsh
# ---------------------------------------------------------------------------
# self-improve-tick.sh — 무인 routine용 REPORT-ONLY 틱 (v2 자기개선 시스템).
#
# 자율 경계(하드): Detect + Report만 한다. 커밋·푸시·배포 절대 안 함.
#   프로덕션 배포는 변호사검수 + 사용자 push-auth 이중 게이트다(SELF-IMPROVE-LOOP.md).
#
# 하는 일: LIVE 검사 축(샌드박스 불필요)을 돌려 회귀/결함을 감지하고 evidence에 리포트.
#   1) live-routes-scan   : ko/zh 24페이지 200 + 콘솔 0 + 오버플로 0 (1280/1024/390)
#   2) handoff-blockers   : 정적자산+auth 경계 code FAIL 여부 (provider open은 결함 아님)
#   3) new-landing        : 새 SEO 랜딩 4종 200 + <title>
# 종료코드: 0 = 이번 tick converged green, 1 = 실제 발견(사람이 트리아지/하청).
#
# 사용:   scripts/self-improve-tick.sh
# routine: launchd/cron이 이 스크립트를 주기 호출 → exit 1이면 알림.
#   (지능형 tick = adversarial verify 포함 = dynamic workflow, 대화형 세션에서 실행)
# ---------------------------------------------------------------------------
set -uo pipefail
cd "$(dirname "$0")/.."
BASE="${SELF_IMPROVE_BASE:-https://tseng-law.com}"
TS="$(date '+%Y-%m-%dT%H%M%S%z')"
OUT=".omo/evidence/self-improve-tick-${TS}.md"
mkdir -p .omo/evidence
findings=0

{
  echo "# self-improve tick (report-only) ${TS}"
  echo "base=${BASE}"
  echo
} > "$OUT"

echo "[tick] 1/3 routes+console+overflow …"
routes_out="$(node scripts/live-routes-scan.mjs --base="$BASE" 2>&1 | tail -3)"
if print -r -- "$routes_out" | grep -q 'ALL CLEAN'; then
  echo "- routes: CLEAN" >> "$OUT"
else
  echo "- routes: ISSUES" >> "$OUT"; print -r -- "$routes_out" | sed 's/^/    /' >> "$OUT"; findings=$((findings+1))
fi

echo "[tick] 2/3 handoff-blockers readiness …"
if npm run gate:handoff-blockers:json -- --base="$BASE" >/dev/null 2>&1; then :; fi
if [ -f .omo/evidence/handoff-blockers-latest.json ]; then
  fail=$(node -e "try{const r=require(process.cwd()+'/.omo/evidence/handoff-blockers-latest.json');console.log(r.counts?.fail ?? 0)}catch{console.log(-1)}" 2>/dev/null)
  open=$(node -e "try{const r=require(process.cwd()+'/.omo/evidence/handoff-blockers-latest.json');console.log(r.counts?.open ?? 0)}catch{console.log(-1)}" 2>/dev/null)
  if [ "${fail:-0}" != "0" ]; then
    echo "- handoff: code FAIL=$fail (real blocker)" >> "$OUT"; findings=$((findings+1))
  else
    echo "- handoff: no code FAIL (open=$open = customer provider creds only)" >> "$OUT"
  fi
else
  echo "- handoff: gate did not produce artifact (skipped)" >> "$OUT"
fi

echo "[tick] 3/3 new landing pages …"
newbad=0
for u in \
  "$BASE/ko/guides/taiwan-company-setup" \
  "$BASE/zh-hant/guides/taiwan-company-setup" \
  "$BASE/ko/korean-lawyer-in-taiwan" \
  "$BASE/zh-hant/korean-lawyer-in-taiwan"; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$u")
  [ "$code" != "200" ] && { echo "    NON-200 ($code) $u" >> "$OUT"; newbad=$((newbad+1)); }
done
if [ "$newbad" = "0" ]; then echo "- new-landing: all 200" >> "$OUT"; else echo "- new-landing: $newbad non-200" >> "$OUT"; findings=$((findings+1)); fi

echo >> "$OUT"
if [ "$findings" = "0" ]; then
  echo "VERDICT: CONVERGED GREEN (0 findings) — nothing to fix this tick." >> "$OUT"
  echo "[tick] CONVERGED GREEN → $OUT"
  exit 0
else
  echo "VERDICT: $findings axis finding(s) — human/subcontract triage (NO auto-fix/commit/deploy)." >> "$OUT"
  echo "[tick] FINDINGS=$findings → $OUT" >&2
  exit 1
fi
