# tseng-law SEO 실행 지시서 — 에이전트 작업 배정표 (단계별)

작성: 2026-07-06 Fable 5. 전략·근거는 `SEO-RANKING-PLAN-2026-07-06.md`(같은 폴더), 이 문서는 **실행 순서표**다.
읽는 사람: 오케스트레이터 에이전트(Claude/Opus/Codex 세션) 또는 사장님 본인.

## 이 문서 사용법

1. 위에서 아래로 STEP 순서대로 진행한다. 각 STEP에 **담당 / 선행조건 / 정확한 명령·프롬프트 / 완료 판정**이 있다.
2. STEP을 끝낼 때마다 아래 진행 보드의 체크박스를 채우고 날짜를 적는다(이 파일을 직접 수정).
3. 에이전트가 이 문서로 작업을 시작할 때 쓰는 시작 프롬프트:

```
/Users/son7/Projects/tseng-law/SEO-EXECUTION-DIRECTIVE-2026-07-06.md 를 읽고,
진행 보드에서 미완료인 가장 이른 STEP부터 지시서 그대로 실행해라.
STEP 0(작업트리 안전 확인)은 매번 먼저. 워커 산출물은 검수 게이트 전부 통과 후에만 커밋하고,
각 STEP 완료 시 이 문서의 진행 보드를 갱신해라. 사용자 담당 STEP은 건너뛰고
"사용자 할 일" 목록으로 정리해 보고해라. 보고는 한국어 3~5줄.
```

## 진행 보드

| STEP | 내용 | 담당 | 상태 | 완료일 |
|------|------|------|------|--------|
| 0 | 작업트리 안전 확인 (매 코드작업 전 반복) | 에이전트 | ✅ 통과(빌더세션 종료, 미커밋 22=빌더잔여, SEO겹침0) | 07-09 |
| 1 | Google Search Console + Bing 등록 | **사용자** | ☐ | |
| 2 | 네이버 서치어드바이저 등록 | **사용자** | ☐ | |
| 3 | Google Business Profile 등록 | **사용자** | ☐ | |
| 4 | WO-SEO-5: 구도메인 301 코드 | GLM 5.2+검수 | ✅ 커밋 f2d8b2d0 + main 배포 (게이트 그린, 전 호스트 no-op) | 07-09 |
| 5 | 구도메인 DNS를 Vercel로 이전 | **사용자** | 🔓 준비됨 — 코드 배포 완료, 사장님 진행 가능 | |
| 6 | WO-SEO-1: llms.txt + FAQ 스키마 | GLM 5.2+검수 | ✅ 커밋 59d7ecd8 + 배포 (인프라+칼럼10편 FAQ+테스트22+merge버그수정, FAQPage 렌더 curl 검증) | 07-09 |
| 7 | WO-SEO-2: 필러 페이지 2종 | GLM 5.2+검수 | ✅ 커밋 698032dc + 배포 (가이드 HowTo+FAQ, 랜딩 LegalService+FAQ, 6페이지 검증). ⚠️[변호사 검수 대기] | 07-09 |
| 8 | WO-SEO-3a: 칼럼 4편 (C1~C4) | **GLM 5.2**+검수 | ☐ 대기 — net-new 법률콘텐츠 → 배포 전 변호사 검수 게이트 필수(사용자 결정) | |
| 9 | 변호사 검수 사이클 (3a분) | **사용자(변호사)** | ☐ | |
| 10 | WO-SEO-3b: 칼럼 4편 (C5~C8) + 검수 | Codex+사용자 | ☐ | |
| 11 | WO-SEO-3c: 칼럼 4편 (C9~C12) + 검수 | Codex+사용자 | ☐ | |
| 12 | 배포 후 라이브 일괄 검증 + 색인 요청 | 에이전트+사용자 | ☐ | |
| 13 | 인용원 확보 캠페인 (문안은 에이전트, 발송은 사용자) | 혼합 | ☐ | |
| 14 | 주간 측정 루틴 확립 | 에이전트 셋업 | ☐ | |
| 15 | 4주차 리뷰 → 2라운드 계획 | 에이전트 | ☐ | |

병렬 규칙: STEP 1·2·3(사용자, 브라우저)은 코드 STEP과 언제든 병렬. 코드 STEP(4,6,7,8,10,11)은 **동시에 하나만**(같은 레포). 13은 아무때나 병렬.

---

## STEP 0 — 작업트리 안전 확인 (모든 코드 STEP 직전에 반복)

담당: 오케스트레이터. 소요 1분.

```bash
pgrep -fl "codex exec|opencode" ; cd /Users/son7/Projects/tseng-law && git status --short | wc -l && git log --oneline -1
```

판정:
- `codex exec`/`opencode` 프로세스가 이 레포 대상으로 돌고 있으면 → **투입 금지, 종료까지 대기**.
- 미커밋이 수천 건(빌더 세션 잔여)이고 그 목록에 `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/[locale]/columns/` 가 있으면 → 빌더 작업이 커밋되기 전까지 STEP 6·7 투입 금지 (STEP 4는 `next.config.mjs`/`middleware.ts`만 건드리므로 그 두 파일이 미커밋 목록에 없으면 진행 가능).
- 2026-07-06 기준: 빌더 Codex 세션 활성 + 미커밋 3,268건이었다. 이 상태면 사용자에게 "빌더 작업 커밋 필요"를 보고하고 사용자 STEP(1·2·3)만 안내.

---

## STEP 1 — Google Search Console + Bing 웹마스터 등록 (사용자, 30분)

선행조건 없음. 지금 바로.

1. https://search.google.com/search-console 접속 → 속성 추가 → **도메인** 유형 → `tseng-law.com` 입력.
2. 나오는 TXT 레코드 복사 → **Vercel 대시보드 → tseng-law 프로젝트 → Settings → Domains → tseng-law.com → DNS Records**(도메인 DNS를 Vercel이 관리하는 경우) 또는 도메인 등록처 DNS 관리 화면에서 TXT 레코드 추가 → GSC로 돌아와 "확인".
3. 확인되면 GSC 좌측 **Sitemaps** → `https://tseng-law.com/sitemap.xml` 제출.
4. **URL 검사**에 아래 5개를 하나씩 넣고 "색인 생성 요청":
   - `https://tseng-law.com/ko`
   - `https://tseng-law.com/ko/services`
   - `https://tseng-law.com/ko/lawyers`
   - `https://tseng-law.com/ko/columns/taiwan-company-establishment-basics`
   - `https://tseng-law.com/ko/columns` 
5. Bing: https://www.bing.com/webmasters → "GSC에서 가져오기" 클릭 → 1분 완료. (ChatGPT 검색이 Bing 색인을 쓴다 — AI 노출에 직접 효과)

완료 판정: GSC에 도메인 속성 초록 체크 + sitemap "성공" 상태.
⚠️ 구 사이트 `wei-wei-lawyer.com`도 GSC 속성이 없으면 **같은 방법으로 지금 등록**해 둘 것 — STEP 5의 "주소 변경 도구"에 반드시 필요하고, 소유 확인에 며칠 걸릴 수 있어 미리 해야 한다.

## STEP 2 — 네이버 서치어드바이저 (사용자, 20분)

1. https://searchadvisor.naver.com → 웹마스터 도구 → 사이트 등록 `https://tseng-law.com`.
2. 소유 확인: HTML 태그 방식이 나오면 그 메타태그를 에이전트에게 전달("네이버 소유확인 메타태그 추가해줘" — 한 줄 수정이라 아무 에이전트나 즉시 가능). DNS TXT 방식이 있으면 STEP 1과 같은 요령으로 DNS에 추가(코드 수정 불필요, 이쪽이 더 간단).
3. 확인 후: 요청 → 사이트맵 제출 `https://tseng-law.com/sitemap.xml`, 웹 페이지 수집 요청에 홈·서비스·칼럼 목록 URL.

완료 판정: 서치어드바이저에 사이트 "소유확인 완료" + 사이트맵 제출됨.

## STEP 3 — Google Business Profile (사용자, 1시간 + 인증 대기 수일)

1. https://business.google.com → 비즈니스 추가 → 이름 "법무법인 호정 (Hovering International Law Firm)" → 카테고리 "변호사" (보조: 법률 사무소).
2. 주소: 타이베이 사무소 실주소. 서비스 지역: 타이베이 + 대만 전역.
3. 연락처·웹사이트 `https://tseng-law.com/ko`, 영업시간, 소개문(한국어·중국어 상담 가능 명시).
4. 인증(엽서/전화/영상 중 구글이 제시하는 방식) 완료까지 진행.
5. 인증 후: 사진 5장+(사무실 외관·내부·변호사), 서비스 목록(회사설립/소송/투자자문/상표), **첫 게시물** 1건.
6. 이후 운영 루틴: 상담 완료 의뢰인에게 리뷰 링크 발송(월 2~3건 목표). 리뷰가 "대만 변호사" 로컬팩(지도 3칸) 진입의 핵심 변수다.

완료 판정: 구글 지도에서 "법무법인 호정" 검색 시 프로필 노출.

## STEP 4 — WO-SEO-5: 구도메인 host 기반 301 코드 (Codex, 감독 필요)

선행조건: STEP 0 통과 (특히 `next.config.mjs`·`middleware.ts`가 미커밋 목록에 없을 것). `docs/seo/wix-redirect-map.csv` 존재(✅ 이미 생성됨).

4-1. 발사 (오케스트레이터가 실행):
```bash
mkdir -p ~/glm-workorders/tseng-law-seo/logs
nohup zsh -c 'cd /Users/son7/Projects/tseng-law && export PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH && { echo "[WO-SEO-5 시작]"; codex exec -s workspace-write "$(cat ~/glm-workorders/tseng-law-seo/wo-seo-5.txt)" 2>&1; echo "=== WO-SEO-5 종료 ==="; } >> ~/glm-workorders/tseng-law-seo/logs/wo-seo-5.log 2>&1' >/dev/null 2>&1 &
```

4-2. 감시: `tail -f ~/glm-workorders/tseng-law-seo/logs/wo-seo-5.log` — `=== WO-SEO-5 종료 ===` 마커까지. 30분 넘게 로그 정지면 정체로 판단, 프로세스 확인 후 재발주.

4-3. 검수 게이트 (전부 통과해야 커밋 — 오케스트레이터 직접 또는 Opus 검수 프롬프트[하단 부록] 사용):
```bash
cd /Users/son7/Projects/tseng-law
git status --short                          # 허용 파일(next.config.mjs 또는 middleware.ts, 매핑 데이터, 테스트) 밖 수정 없나
git diff --stat
npm run qa                                  # typecheck+lint+unit+security 전부 그린
npm run build
# 기능 검증 (middleware 구현이면 dev로, next.config이면 build 후 start로):
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" -H "Host: www.wei-wei-lawyer.com" http://localhost:3000/post/taiwan-company-establishment-basics
# 기대: 301 https://tseng-law.com/ko/columns/taiwan-company-establishment-basics
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" -H "Host: www.wei-wei-lawyer.com" http://localhost:3000/
# 기대: 301 https://tseng-law.com/ko
```

4-4. 커밋·배포:
```bash
git add <해당 파일들만>   # 빌더 세션 미커밋 파일 절대 포함 금지 — 파일명 하나하나 지정
git commit -m "SEO: wei-wei-lawyer.com host 301 redirect map (구현: Codex GPT-5.5 하청 · 설계: SEO 플랜 WO-5)"
git push    # Vercel 자동 배포
```
배포 후: `curl -sI https://tseng-law.com/ko | head -3` 으로 사이트 정상 확인.

실패 시: qa 실패 로그를 그대로 새 워크오더에 붙여 재발주("아래 실패를 고쳐라. 스코프 동일"). 2회 실패하면 사용자에게 보고.

## STEP 5 — 구도메인 DNS를 Vercel로 이전 (사용자, 30분 + 전파 대기)

선행조건: STEP 4 배포 완료.

1. Vercel 대시보드 → tseng-law 프로젝트 → Settings → Domains → Add → `wei-wei-lawyer.com` 과 `www.wei-wei-lawyer.com` 추가.
2. Vercel이 제시하는 DNS 값(A 레코드/CNAME)을 복사.
3. wei-wei-lawyer.com 도메인을 관리하는 곳(Wix에서 구매했다면 Wix → 도메인 설정 → DNS 레코드)에서 A/CNAME을 Vercel 값으로 교체.
4. 전파 후(수분~수시간) 확인:
```bash
curl -sI https://www.wei-wei-lawyer.com/post/taiwan-company-establishment-basics | grep -iE "^(HTTP|location)"
# 기대: HTTP/2 301 + location: https://tseng-law.com/ko/columns/...
```
5. 구 사이트 GSC 속성(STEP 1에서 미리 등록해둔 것) → 설정 → **주소 변경** → 대상 tseng-law.com.
6. Wix **사이트 구독**은 이제 해지 가능. **도메인 등록은 절대 해지 금지 — 최소 1년+ 자동갱신 유지** (도메인이 죽으면 301도 죽고 승계 효과가 사라진다).

당장 DNS 이전이 부담스러우면 임시로: Wix 대시보드 → 마케팅&SEO → SEO 도구 → URL 리디렉션 관리자에 `docs/seo/wix-redirect-map.csv` 33행을 단일 리디렉션으로 수동 입력(홈은 불가, Wix 구독 유지 필요 — 상세 `docs/seo/wix-redirect-howto.md` 경로 B). 단 이건 응급이고, 최종적으로는 경로 A(DNS 이전)로 갈 것.

## STEP 6 — WO-SEO-1: llms.txt + FAQPage 스키마 (Codex)

선행조건: STEP 0 통과 + **빌더 세션의 미커밋이 커밋된 후** (columns 페이지·robots·sitemap 겹침).

6-1. 발사: STEP 4-1과 동일 명령에서 `wo-seo-5` → `wo-seo-1` 로만 교체.
6-2. 검수 게이트:
```bash
cd /Users/son7/Projects/tseng-law
git status --short && git diff --stat      # 스코프: llms.txt 라우트, src/lib/seo.ts, 칼럼 파서/페이지, 칼럼 5편, 테스트만
npm run qa && npm run build
# next start(또는 dev) 후:
curl -s http://localhost:3000/llms.txt | head -20                    # 사이트 개요+칼럼 목록 markdown
curl -s http://localhost:3000/ko/columns/taiwan-company-establishment-basics | grep -c '"@type":"FAQPage"'   # 기대: 1
curl -s http://localhost:3000/ko/columns/taiwan-company-establishment-basics | grep -o "자주 묻는 질문"      # 본문 렌더 확인
```
- FAQ **내용 품질 검수**: 5편의 faq가 본문에 실제로 있는 내용인지 대조(새 법률 주장 섞였으면 반려). 중문판 faq도 존재 확인.
6-3. 커밋: `SEO: llms.txt + FAQPage schema + 기존 칼럼 5편 FAQ (구현: Codex 하청 · WO-1)` → push → 배포 후 `curl -s https://tseng-law.com/llms.txt | head -5` 재확인.

## STEP 7 — WO-SEO-2: 필러 페이지 2종 (Codex)

선행조건: STEP 6 커밋 완료 (같은 src/lib/seo.ts를 건드리므로 반드시 순차).

7-1. 발사: 동일 명령, `wo-seo-2`.
7-2. 검수 게이트:
```bash
npm run qa && npm run build
for L in ko zh-hant en; do for P in guides/taiwan-company-setup korean-lawyer-in-taiwan; do
  curl -s -o /dev/null -w "%{http_code} /$L/$P\n" http://localhost:3000/$L/$P; done; done   # 6개 전부 200
curl -s http://localhost:3000/ko/guides/taiwan-company-setup | grep -oE '"@type":"(HowTo|FAQPage)"' | sort | uniq -c
curl -s http://localhost:3000/sitemap.xml | grep -c "korean-lawyer-in-taiwan"               # 기대: 1 이상
```
- 내용 검수 포인트: ① 수치·요건이 기존 칼럼 범위 안인가(새 주장 반려) ② korean-lawyer-in-taiwan 페이지가 명제형 직서술인가(AI 발췌용) ③ 빌더 발행 페이지와 경로 충돌 없나(`/ko/guides/...`가 빌더 catch-all에 잡히지 않고 정적 라우트로 뜨는지).
7-3. 커밋 `SEO: 회사설립 종합가이드 + 한국어 가능 변호사 랜딩 (WO-2)` → push → 라이브 2페이지 200 + **변호사에게 두 페이지 URL 전달해 내용 확인 요청** (법률 수치 [변호사 검수 필요] 주석 해소).

## STEP 8 — WO-SEO-3a: 칼럼 C1~C4 초안 (Codex)

선행조건: STEP 0. (STEP 6·7과 파일 안 겹치므로 빌더 세션만 정리됐다면 먼저 돌려도 됨. 단 코드 STEP과 동시 투입은 금지.)

8-1. 발사: 동일 명령, `wo-seo-3a`.
8-2. 검수 게이트:
```bash
git status --short    # 신규 4개 md (+이미지 폴더)만. 기존 파일 수정 있으면 반려
npm run qa && npm run build
for S in $(git status --short | grep "^??" | grep columns | awk '{print $2}'); do wc -c "$S"; done   # 각 5,000바이트+(한글 2,500자)
grep -L "변호사 검수 필요" src/content/columns/0{18,19,20,21}*.md 2>/dev/null   # 마커 없는 파일 나오면 확인
```
- 내용 검수: 서두 3문장 직답 구조인가, 허위 실적 주장("저희가 수임한 실제 사건") 없는가, 내부링크 2개+ 작동하나, frontmatter에 `url:` 필드 없나.
8-3. 커밋: `SEO: 칼럼 C1~C4 초안 [변호사 검수 대기] (WO-3a)` — **push는 하되**, 검수 전이므로 이 상태로 배포되어도 마커가 본문에 보인다는 점을 사용자에게 알릴 것. 마커 노출이 싫으면 push를 STEP 9 후로 미룬다(권장: push 보류).

## STEP 9 — 변호사 검수 사이클 (사용자/변호사)

9-1. 에이전트가 검수 시트 생성:
```bash
cd /Users/son7/Projects/tseng-law
grep -n "변호사 검수 필요" src/content/columns/*.md src/app/[locale]/guides -r 2>/dev/null > docs/seo/review-sheet-$(date +%F).txt
```
9-2. 사용자: 시트의 각 항목을 증준외 변호사가 확인 — 수치/요건 맞으면 마커만 삭제, 틀리면 본문 수정.
   (변호사가 직접 파일 수정이 어려우면: 시트에 답을 적어 에이전트에게 주고 "이대로 반영+마커 제거" 워크오더 발주.)
9-3. 에이전트: 마커 0 확인(`grep -rc "변호사 검수 필요" src/content/columns/ → 전부 0`) → `SEO: C1~C4 변호사 검수 반영` 커밋 → push.

## STEP 10 · 11 — WO-SEO-3b (C5~C8) · WO-SEO-3c (C9~C12)

STEP 8·9와 완전 동일 절차, 워크오더 파일만 `wo-seo-3b.txt` / `wo-seo-3c.txt`. 배치 간 간격을 1~2주 두면 색인 신선도에 유리(한꺼번에 12편보다 매주 4편이 낫다).

## STEP 12 — 배포 후 라이브 일괄 검증 + 색인 요청

12-1. 에이전트:
```bash
for U in https://tseng-law.com/llms.txt https://tseng-law.com/ko/guides/taiwan-company-setup https://tseng-law.com/ko/korean-lawyer-in-taiwan; do curl -s -o /dev/null -w "%{http_code} $U\n" $U; done
curl -s https://tseng-law.com/sitemap.xml | grep -c "<loc>"     # 신규 페이지 반영으로 125보다 증가했는지
curl -sI https://www.wei-wei-lawyer.com/ | grep -iE "^(HTTP|location)"   # 301 살아있는지 (STEP 5 후)
```
12-2. 사용자: GSC URL 검사로 신규 페이지 전부(가이드/랜딩/칼럼 12편) 색인 생성 요청. 네이버 수집 요청도 동일하게.

## STEP 13 — 인용원 확보 캠페인 (문안: 에이전트 / 발송·등재: 사용자)

에이전트에게 시킬 것 (코딩 아님 — 아무 세션에서나, 각 항목이 독립 태스크):
- **13a**: 주타이베이 대한민국 대표부(overseas.mofa.go.kr/tw-ko) "현지 변호사 안내" 등재 요청 이메일 초안 (한국어, 사무소 정보·자격·연락처 포함)
- **13b**: KOTRA 타이베이무역관 전문가 기고 제안서 초안 (주제: "대만 법인설립 실무 최신 동향" — 칼럼 C1 기반)
- **13c**: 대만 한인 커뮤니티(네이버 카페 "대만은 지금" 등) 프로필/소개글 문안 (광고성 아닌 정보성)
- **13d**: 등재 가능한 디렉토리 목록 조사 15곳+ (한국 법률 플랫폼 해외변호사 섹션, Taiwan lawyer directory, 한인 비즈니스 디렉토리) — 각 등재 URL·조건·비용 표
- **13e**: 기존 미디어 출연분 목록화 + 각 매체에 보낼 "기사에 사이트 링크 추가 요청" 문안

사용자가 할 것: 위 문안 검토 후 발송/등재. **주 1건 페이스**면 충분 — 한 번에 몰아서 하면 부자연스러운 링크 패턴.

## STEP 14 — 주간 측정 루틴 (에이전트가 셋업, 이후 매주 반복)

14-1. 기록 파일 생성: `docs/seo/metrics-log.md` — 표 형식:
```
| 날짜 | 대만 변호사(순위/노출) | 대만 회사설립 | 대만 법인설립 | 총클릭 | AI 스팟체크(5문 중 인용 수) | 비고 |
```
14-2. 매주(권장: 월요일) 수행 항목:
- GSC → 실적 → 검색어 필터 "대만" → 3개 키워드의 평균 순위·노출·클릭 기록
- 한국 기준 실순위: 크롬 시크릿창(또는 VPN 한국)에서 "대만 변호사", "대만 회사설립" 직접 검색 → tseng-law.com 위치 기록
- AI 스팟체크 5문 (ChatGPT·Perplexity·Claude 중 2곳+에서):
  ① "대만에서 한국어 가능한 변호사 추천해줘" ② "대만 회사설립 도와줄 법무법인 찾아줘"
  ③ "대만에서 한국 기업 소송 대리할 변호사" ④ "타이베이 한국인 변호사"
  ⑤ "대만 법인설립 절차 알려줘"(출처에 tseng-law.com 뜨는지)
  → 호정/tseng-law.com 인용된 문항 수 기록
- `site:wei-wei-lawyer.com` 결과 수 (감소 추세 확인 — 301 승계 진행 지표)

## STEP 15 — 4주차 리뷰 (에이전트)

metrics-log 4주치 + GSC 데이터를 근거로:
- 순위 15~30위에 걸린 키워드 → 해당 페이지 보강 워크오더(내부링크 추가·본문 확장·FAQ 추가) 작성
- 노출은 있는데 클릭 0인 페이지 → title/description 리라이트 워크오더
- AI 스팟체크 0이면 → llms.txt 내용 보강 + 인용원(STEP 13) 강화에 집중
- 신규 long-tail 4편 키워드맵 작성 → WO-3d로 발주
판정 기준(플랜 §7): "대만 회사설립" 10위 이내 / "대만 변호사" 20위 이내 진입 / AI 5문 중 2문 인용 / 구사이트 SERP 자리 교체.

---

## 부록 A — Opus 검수 서브에이전트 프롬프트 (오케스트레이터가 검수를 위임할 때)

```
/Users/son7/Projects/tseng-law 에서 방금 완료된 워크오더 WO-SEO-N의 검수자다.
1) ~/glm-workorders/tseng-law-seo/wo-seo-N.txt 를 읽고 허용 스코프를 파악하라.
2) git status --short 와 git diff 로 스코프 밖 수정·기존 기능 삭제·테스트 약화가 없는지 확인하라.
3) npm run qa 와 npm run build 를 직접 실행해 결과를 확인하라 (워커 보고 신뢰 금지).
4) 지시서 STEP N의 기능 검증 curl 명령을 직접 실행하라.
5) 판정만 보고하라: PASS(커밋 가능) 또는 FAIL(사유 + 실패 로그 원문). 커밋은 하지 마라.
```

## 부록 B — 자주 실패하는 지점

- **codex가 PATH 못 찾음**: 비대화식 셸엔 node PATH 없음 → 발사 명령의 `export PATH=...nvm...` 절대 삭제 금지.
- **워커가 스코프 밖 파일 수정**: 커밋 전 `git status`에서 발견 즉시 해당 파일만 `git checkout -- <파일>` (단, 그 파일이 빌더 세션의 미커밋 수정본이면 checkout 금지 — 손대지 말고 사용자 보고).
- **`git add .` 금지**: 빌더 세션 미커밋 3천여 건이 섞여 들어간다. 항상 파일명 명시 add.
- **qa는 Playwright 미포함**: 빌더 쪽 파일을 조금이라도 건드렸으면 `npm run test:builder-editor` 별도 실행.
- **콘텐츠 워크오더가 법률 수치를 지어냄**: 마커 없이 단정된 수치 발견 시 반려가 원칙. 검수 시트에 반드시 올릴 것.
- **Wix 도메인 만료**: 301 승계의 생명줄. 도메인 자동갱신 상태를 분기 1회 확인.
