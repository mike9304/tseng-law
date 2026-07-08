# 구 사이트(wei-wei-lawyer.com) → tseng-law.com 301 이전 절차

작성: 2026-07-06. 매핑표: 같은 폴더 `wix-redirect-map.csv` (33행 = exact 18 / suggested 15).
suggested 행은 넣기 전에 사람이 대상 URL을 한 번 확인할 것 (특히 about-1, about-8).

## 왜 하나
"대만 법인설립" 등 SERP에 구 Wix 사이트가 여전히 랭킹 중 + 동일 칼럼이 두 도메인에 존재 →
권위 분산·중복 콘텐츠로 tseng-law.com이 안 뜨는 근본 원인. 301로 구 사이트의 링크 자산과
색인을 신 도메인에 승계시킨다.

## 경로 A — 권장: 구 도메인을 Vercel로 (홈 포함 완전 301)
Wix 리디렉션 관리자는 **홈페이지 301 불가 + 외부 도메인 그룹 리디렉션 불가**라서 반쪽짜리다.
정공법은 도메인 자체를 Vercel로 가져오는 것:

1. [코드] WO-SEO-5 실행 (`~/glm-workorders/tseng-law-seo/wo-seo-5.txt`) —
   host가 wei-wei-lawyer.com이면 매핑표대로 301하는 코드를 tseng-law 프로젝트에 추가.
   DNS 이전과 무관하게 먼저 배포해도 무해(호스트가 안 오면 그냥 안 걸림).
2. [사용자] Vercel 대시보드 → tseng-law 프로젝트 → Settings → Domains →
   `wei-wei-lawyer.com`, `www.wei-wei-lawyer.com` 추가.
3. [사용자] 도메인 등록처(Wix에서 구매했으면 Wix 도메인 설정)에서 DNS를 Vercel 안내값으로 변경
   (A 76.76.21.21 / CNAME cname.vercel-dns.com — Vercel 화면에 뜨는 값 기준).
4. [확인] `curl -sI https://www.wei-wei-lawyer.com/post/taiwan-company-establishment-basics`
   → `301` + `location: https://tseng-law.com/ko/columns/taiwan-company-establishment-basics`
5. [사용자] 구 사이트 GSC 속성에서 **주소 변경 도구** 실행 (설정 → 주소 변경 → tseng-law.com).
   구 사이트 GSC 속성이 없으면 먼저 등록(소유 확인)부터.
6. Wix 사이트 구독은 이후 해지 가능. **단 도메인 등록은 최소 1년 이상 유지** (만료되면 301도 죽는다).

## 경로 B — 응급(오늘 바로, DNS 안 건드림): Wix URL 리디렉션 관리자
Wix 대시보드 → SEO(마케팅&SEO) → 도구 및 설정 → **URL 리디렉션 관리자** → + 새 리디렉션 →
단일 리디렉션 → Old URL에 구 경로(예: `/post/taiwan-company-establishment-basics`),
대상에 신 사이트 전체 URL 입력 → 저장. `wix-redirect-map.csv`의 33행을 하나씩 입력.

한계: ① 홈(`/`)은 리디렉션 관리자로 불가 — 홈은 경로 A로만 해결 ② 외부 도메인은 그룹 리디렉션
불가(단일만) ③ Wix 구독을 해지하면 리디렉션도 사라짐.
한글 경로 행(`/post/대만-노동법…` 등 2건)은 그대로 붙여넣으면 되고, 안 먹으면 URL 인코딩된
형태로 재시도.

## 완료 판정
- 구 사이트 대표 URL 5개가 301 → 신 URL 200
- 2~4주 내 GSC에서 신 사이트 노출 상승 + `site:wei-wei-lawyer.com` 결과 감소
- "대만 법인설립" SERP의 wei-wei-lawyer.com 자리가 tseng-law.com으로 교체
