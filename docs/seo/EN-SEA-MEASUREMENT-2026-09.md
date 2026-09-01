# EN/SEA 측정 설계 — 2026-09 (D7)

근거: seo-geo-expert 판정 2026-09-01(/tmp/seo-expert-en-sea-verdict-20260901.md, 코퍼스 부팅본) + EN-SEA-BASELINE-2026-09-01.md.
원칙: 실측만. 근거 없는 트래픽/ROI 예측 금지. 첫 판정 게이트 **12주(≈2026-11 말)**.

## 1. 주간 트래커 확장 (metrics-log.md에 EN 행 추가 — 배포 후부터)

기존 표에 다음 칼럼/행을 병행 기록(월요일):
| 항목 | 소스 | 값 |
|---|---|---|
| EN 색인수 | GSC URL 검사/색인 보고서, `/en/` 필터 | 주간 |
| EN 노출·클릭 | GSC Performance 페이지필터 `/en/` (28일 롤링) | 주간 |
| EN 상위 쿼리·국가 | GSC 동일 필터 → 쿼리/국가 탭 | 주간 |
| 생성형 AI 노출 | GSC Search generative AI 리포트(노출수 전용) | 주간 |
| Bing Citation Share | Bing WMT AI Performance (유일한 벤더 1차 인용 지표) | 월간 |
| 고정 질문세트 인용률 | §3 (7런 롤링) | 월간 |

## 2. 콘솔 라운드 (사용자/손빗 — 1회 30분, 분모 고정)

1. GSC Performance → 페이지 `/en/` 필터: 쿼리·국가·노출·클릭 (28일) 추출
2. GSC 국가 필터 SG·MY·PH·US·AU·GB: 상위 쿼리
3. GSC URL 검사: `/en/` 핵심 5 URL(랜딩4+가이드) + EN 칼럼 표본 5 — 색인/미색인/타표준 → **미색인 목록이 P1 아웃리치 앵커 타깃이 된다**
4. GSC Settings → Search generative AI = **Include(기본값) 확인**
5. Bing WMT: Search Performance 국가 분해(가능 시) + AI Performance Citation Share 기준선
6. GBP: 영어 Services·설명 현황 스크린샷(P3 분모)

## 3. 고정 EN 질문세트 (20문 × 표면 6 × 7런, 월간 — Jaccard 변동성 대응)

표면: Google AIO/AI Mode(관측 가능 범위)·ChatGPT·Perplexity·Copilot·Claude·Gemini. 기록: 인용 여부·인용 URL·동반 인용원.
1. best English speaking lawyer in Taipei
2. how to set up a company in Taiwan as a foreigner
3. Taiwan company registration cost
4. Taiwan subsidiary vs branch office
5. how long does company registration take in Taiwan
6. Taiwan work permit lawyer
7. Taiwan gold card legal help
8. sue a Taiwanese company from abroad
9. debt collection from Taiwan company
10. Taiwan civil litigation process for foreigners
11. Taiwan labor law severance foreign employer
12. terminating an employee in Taiwan
13. Taiwan cosmetics registration PIF requirements
14. TFDA cosmetics license lawyer
15. inheritance in Taiwan for foreign heirs
16. Taiwan divorce lawyer for foreigners
17. Korean speaking lawyer Taiwan
18. Taiwan investment review approval foreign company
19. open a corporate bank account in Taiwan foreigner
20. Taiwan trademark registration for foreign company

## 4. KPI·반증 조건 (12주)

- **K-EN1 색인**: `/en/` 핵심 22 URL(홈·서비스·pricing·랜딩4·가이드·칼럼 표본) 색인수. 반증: P0~P2 배포+P1 인용원 진행 8~12주 후 무변화 → 권위 병목 가설 재심(콘텐츠 품질 판정으로 이동), EN 증설 중단.
- **K-EN2 노출**: GSC `/en/` 노출 28일 롤링. 국가 분해(대만 vs SEA vs 서구). **1차 전장=대만 내 expat**(판정 §6④) — 대만발 EN 노출이 먼저 움직이는지 관찰.
- **K-EN3 생성형**: GSC 생성형 노출 + Bing Citation Share. Citation Share만 늘고 GSC가 안 늘면 표면별 분리 대응 방증(판정 §7).
- **K-EN4 인용원**: 참조 도메인 다양성(분기) — 아웃리치 실적 로그와 대조.
- 주의: GA4 'AI Assistants' 채널은 구글 AI 표면 제외·Perplexity/Claude 부재 — 정본으로 쓰지 않는다. 방문 리포트는 visit-metrics(배포 후 scripts/visit-report.mjs — AI 추천 19종·국가 집계)와 병용.

## 5. 2026-09-15 Cloudflare AI 크롤러 기본 차단 발효

자사(Vercel)는 직접 영향 낮음[추정]. 9/16~ 주간 라운드에 인용원(디렉터리·매체) 접근성 스팟체크 1회 추가.
