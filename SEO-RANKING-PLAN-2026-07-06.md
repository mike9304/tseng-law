# tseng-law.com 구글·AI 검색 상위 노출 마스터 플랜

> ⚠️ **2026-07-09 전략 수정:** 사용자 결정으로 **도메인 통합(§2-1, G1) 취소** — wei-wei-lawyer.com은 독립 유지, tseng-law.com만 강화. 아래 §1 G1(구 사이트 301)과 §5-2(DNS 이전)는 **무효**. 대신: tseng-law는 이미 self-canonical이라 사이트 분리해도 불리하지 않고(확인됨), **차별화 신규 콘텐츠(가이드·랜딩·WO-3 net-new 칼럼)** + **독립 권위(GBP·백링크·네이버·GSC)**로 승부한다. 중복 칼럼으로 wei-wei와 경쟁하기보다 wei-wei에 없는 키워드·언어(zh/en)를 점유. 데이터의 wei-wei 아웃바운드 링크는 tseng-law 자기 페이지로 교체 권고(사용자 판단).

작성: 2026-07-06 (Fable 5 진단 · 실행은 Codex GPT-5.5 xhigh 하청)
목표: ① "대만 회사설립"·"대만 변호사" 구글 첫 페이지 ② AI 검색(ChatGPT/Claude/Perplexity/Gemini)에서 "한국어 가능한 대만 변호사" 질의 시 상위 인용

이 문서는 **자립형 지침서**다. 어떤 에이전트든(Codex/Opus/GLM) 이 문서만 읽고 실행할 수 있게 썼다.
실행용 워크오더 파일: `~/glm-workorders/tseng-law-seo/wo-seo-*.txt` (본문 §6에 동일 내용 수록)

---

## 1. 진단 스냅샷 (2026-07-06 실측 증거)

### 이미 잘 되어 있는 것 (재작업 금지)
- robots.txt 정상 (`User-Agent: *` Allow, admin/api만 차단, sitemap 선언) — AI 크롤러(GPTBot/ClaudeBot/PerplexityBot)도 `*`로 이미 허용됨
- sitemap.xml 125 URL + hreflang(ko/zh-Hant/en/x-default) 완비
- 홈 `<title>대만 변호사·대만 소송·대만 회사설립</title>` + 키워드 정합 meta description
- JSON-LD 풍부: LegalService/WebSite/Organization/Person/SearchAction, 칼럼엔 Article+BreadcrumbList
- 구글 색인됨: `site:tseng-law.com` 검색에 en/ko/zh 페이지 노출 확인
- Vercel SSR/SSG (크롤러·AI봇이 완전한 HTML을 받음), www→non-www 리다이렉트
- 칼럼 17편(ko) + 중문판(`src/content/columns-zh/`)

**→ 기술 SEO는 이미 상위권 수준. 순위가 안 나오는 원인은 기술이 아니라 아래 4가지다.**

### 격차 (우선순위순)

| # | 문제 | 증거 | 영향 |
|---|------|------|------|
| G1 | **구 Wix 사이트(wei-wei-lawyer.com)가 살아있고 랭킹 중** | "대만 법인설립" SERP에 `wei-wei-lawyer.com/general-clean`("법인설립 \| 법무법인 호정") 노출. 칼럼 frontmatter `url:` 필드가 구 사이트 출처 증명 → 동일 콘텐츠 이중 게재 | **치명적.** 도메인 권위 분산 + 중복 콘텐츠. 구글이 구 사이트를 원본으로 판단 → 신 사이트가 안 뜨는 근본 원인 |
| G2 | 백링크 사실상 0 (신규 도메인) | 경쟁사(Premia TNC, mirrasia, cpafirm.com.tw)는 수년간 축적 | "대만 변호사" 같은 머니 키워드는 권위 없이 못 뚫음 |
| G3 | GSC/네이버/GBP 등록 여부 미확인 | 확인 필요 (사용자만 가능) | 색인 속도·측정·로컬팩 전부 여기 걸림 |
| G4 | AEO(AI 검색 최적화) 미비 | llms.txt 404, FAQPage 스키마 없음(Article만), AI가 인용할 Q&A 구조 부재 | AI 추천 질의에서 인용 안 됨 |
| G5 | 콘텐츠 폭 부족 | 칼럼 17편 vs 경쟁사 수십 편 클러스터 | long-tail 유입 부족 → 도메인 신뢰 축적 느림 |

### 현실적 타임라인 (정직하게)
- long-tail 칼럼 키워드("대만 법인 계좌개설" 등): 2~6주
- "대만 회사설립"/"대만 법인설립": 1~3개월 (G1 해소 + 콘텐츠 전제)
- "대만 변호사" 첫 페이지 첫 칸: 3~6개월+ (GBP 로컬팩은 더 빠를 수 있음)
- AI 검색 인용: 2~8주 (크롤 주기 + 인용원 확보에 좌우)
- ⚠️ 이 진단의 SERP는 미국 IP 기준. 실제 순위는 한국에서 크롬 시크릿창으로 확인할 것.

---

## 2. 전략 요약 — 4개 전선

1. **도메인 통합 (G1)** — 구 Wix 사이트를 tseng-law.com으로 301. 단일 최대 레버. 사용자 작업(§5-2).
2. **콘텐츠 클러스터 (G5)** — "대만 회사설립" 허브 + long-tail 12편 증설. Codex 하청(§6 WO-2/3).
3. **AEO/AI 검색 (G4)** — llms.txt, FAQPage 스키마, AI 인용용 랜딩 페이지. Codex 하청(§6 WO-1/2).
4. **권위·인용원 (G2/G3)** — GSC/네이버/GBP 등록, 백링크·커뮤니티 인용 확보. 대부분 사용자 작업(§5).

AI 검색 상위 인용의 원리: AI는 (a) 자사 크롤러가 읽은 사이트 본문과 (b) 웹에서 그 업체가 언급되는 제3자 문서(커뮤니티·디렉토리·기사)를 근거로 추천한다. (a)는 WO-1/2가 해결, (b)는 §5의 인용원 작업이 해결한다. 둘 다 해야 한다.

---

## 3. 하청 실행 규약 (오케스트레이터/사용자 공통)

### 실행 전 필수 확인 (같은 작업트리 다중 작성자 금지)
```bash
pgrep -fl "codex exec|opencode" ; cd /Users/son7/Projects/tseng-law && git status --short | head -30
```
- 다른 codex/opencode 프로세스가 이 레포에서 작업 중이면 **끝날 때까지 대기**.
- 2026-07-06 현재 활성 Codex 세션(빌더 작업, dev 서버 4547/4537)이 미커밋 다수 보유 중 — 그 세션 종료·커밋 후 SEO WO를 투입할 것.
- 타 세션 미커밋 파일은 절대 건드리지 말 것 (WO마다 수정 허용 파일 명시됨).

### 워크오더 발사 명령 (Studio 로컬)
```bash
mkdir -p ~/glm-workorders/tseng-law-seo/logs
N=1  # 워크오더 번호
nohup zsh -c 'cd /Users/son7/Projects/tseng-law && export PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH && { echo "[WO-SEO-'$N' 시작]"; codex exec -s workspace-write "$(cat ~/glm-workorders/tseng-law-seo/wo-seo-'$N'.txt)" 2>&1; echo "=== WO-SEO-'$N' 종료 ==="; } >> ~/glm-workorders/tseng-law-seo/logs/wo-seo-'$N'.log 2>&1' >/dev/null 2>&1 &
```
- 진행 관찰: `tail -f ~/glm-workorders/tseng-law-seo/logs/wo-seo-N.log` (종료 마커 `=== WO-SEO-N 종료 ===`)
- 순서: WO-1 → 검수·커밋 → WO-2 → 검수·커밋 → WO-3a/3b/3c → WO-4. **동시 투입 금지** (같은 파일 충돌).

### 검수 게이트 (각 WO 커밋 전 전부 통과)
1. `git diff --stat` — 허용 파일 밖 수정 없는지
2. `npm run qa` (typecheck+lint+unit+security) 그린
3. `npm run build` 성공
4. 스키마 검증: 변경 페이지 HTML에서 JSON-LD 추출 → https://validator.schema.org 통과 (WO 내 검증 명령 참조)
5. 커밋 메시지: `SEO: <내용> (구현: Codex GPT-5.5 하청 · 설계: Fable 5 SEO 플랜 §6)` — 워커가 직접 커밋 금지, 검수자가 커밋
6. push → Vercel 자동 배포 → 라이브 URL curl로 재확인

---

## 4. 콘텐츠 키워드 맵 (WO-3 원자재)

기존 17편이 이미 커버: 회사설립 기초/심화/자본금 회수/자회사vs지사/화장품 인허가/노동 퇴직금/교통사고 등.
신규 12편 (검색의도 × 기존 공백 기준, 우선순위순):

| # | 제목(안) | 타겟 키워드 | 의도 |
|---|---------|------------|------|
| C1 | 대만 법인설립 비용 총정리 (2026) — 항목별 실비와 대행 수수료 | 대만 법인설립 비용 | 상업적 (경쟁사 최다 유입 키워드) |
| C2 | 대만 유한공사 vs 주식회사(股份有限公司) — 무엇으로 설립할까 | 대만 회사 형태 | 정보→상담 |
| C3 | 대만 투자심의위원회(투심회) 승인 절차와 준비 서류 | 대만 투자 승인 | 정보 |
| C4 | 대만 법인 계좌개설 — 은행별 요건과 실패 사례 | 대만 법인 계좌개설 | 정보 (경쟁사 히트 콘텐츠) |
| C5 | 대만 취업비자·거류증 — 외국인 대표자/주재원 편 | 대만 취업비자 거류증 | 정보 |
| C6 | 대만 법인 세금 기초 — 영업세·영리사업소득세·원천징수 | 대만 법인 세금 | 정보 |
| C7 | 대만 상표등록 절차·비용·소요기간 | 대만 상표등록 | 상업적 |
| C8 | 대만 채권 회수 — 내용증명부터 소송·강제집행까지 | 대만 채권 회수 소송 | 상업적 (소송 키워드) |
| C9 | 대만 계약서 검토 체크리스트 — 한국 기업이 놓치는 조항 | 대만 계약서 검토 | 상업적 |
| C10 | 한국-대만 이중과세 문제와 대응 | 대만 이중과세 | 정보 |
| C11 | 대만 법인 청산·철수 절차 | 대만 법인 청산 철수 | 상업적 |
| C12 | 대만 형사사건 한국인 대응 가이드 — 피의자/피해자별 | 대만 형사 변호사 한국인 | 상업적 (AI 질의 다발) |

작성 원칙 (WO-3에 반영됨): 각 편 2,500자+ / H2-H3 구조 / 서두 3문장 직답(AI 인용 최적) / FAQ 3개(frontmatter `faq:`) / 실무 사례 1개 / 법률 수치·요건엔 `[변호사 검수 필요]` 마커 / 기존 칼럼·서비스 페이지 내부링크 2개+ / CTA(상담 링크). **발행 전 증준외 변호사 검수 필수 — 검수 없이 publish 금지 (변호사법·광고규정 리스크).**

---

## 5. 사용자(사장님) 직접 작업 체크리스트 — 에이전트 불가 항목

우선순위순. 1~3이 코드 작업 전부보다 효과가 크다.

- [ ] **5-1. Google Search Console 등록** (30분): https://search.google.com/search-console → 도메인 속성 `tseng-law.com` → DNS TXT 인증(도메인 등록처 또는 Vercel 대시보드 → Domains) → sitemap.xml 제출 → 주요 페이지 URL 검사로 색인 요청. Bing 웹마스터도 GSC 가져오기로 1분 등록(→ChatGPT 검색은 Bing 계열).
- [ ] **5-2. 구 Wix 사이트 301 이전 (최중요)**: 절차서 `docs/seo/wix-redirect-howto.md` + 매핑표 `docs/seo/wix-redirect-map.csv` (✅2026-07-06 생성 완료, 33행: exact 18 / suggested 15, exact 전부 라이브 200 검증됨). **경로 A(권장)**: WO-SEO-5로 host 기반 301 코드 추가 → Vercel에 wei-wei-lawyer.com 도메인 추가 → DNS 이전 → 구 사이트 GSC 주소 변경 도구. 홈 포함 완전 301 + Wix 구독 해지 가능. **경로 B(응급)**: Wix URL 리디렉션 관리자에 단일 301 수동 입력 — 단 Wix는 홈페이지 301 불가·외부 도메인 그룹 리디렉션 불가·구독 해지 시 리디렉션 소멸(2026-07-06 Wix 공식 문서로 확인). 어느 쪽이든 **도메인 등록은 최소 1년 이상 유지**(만료되면 301도 죽음).
- [ ] **5-3. Google Business Profile** (1시간): https://business.google.com → 타이베이 사무소 주소로 "법무법인 호정 (Hovering International Law Firm)" 등록 → 엽서/전화 인증 → 카테고리 "변호사/법률 사무소", 서비스 지역·한국어 가능 명시, 웹사이트 tseng-law.com 연결. 이후 의뢰인에게 구글 리뷰 요청 루틴(월 2~3건). "대만 변호사" 로컬팩(지도 3칸)은 본문 순위보다 빨리 뚫린다.
- [ ] **5-4. 네이버 서치어드바이저**: https://searchadvisor.naver.com → 사이트 등록 + sitemap 제출. 한국인 "대만 변호사" 검색의 절반은 네이버다. 여력 되면 네이버 블로그에 칼럼 요약본(전문 아닌 요약+원문 링크) 재발행 — 전문 복붙은 중복 페널티.
- [ ] **5-5. 인용원(AI가 읽는 제3자 문서) 확보** — 효과 큰 순:
  - 주타이베이 대한민국 대표부 홈페이지의 "변호사 안내" 목록 등재 요청 (overseas.mofa.go.kr/tw-ko — 이미 회사설립 안내문 게재하는 곳, 공신력 최상)
  - KOTRA 타이베이무역관에 전문가 기고/인터뷰 제안
  - 대만 한인 커뮤니티(네이버 카페 "대만은 지금", 페이스북 대만 한인 그룹)에 프로필 등록·Q&A 활동
  - 기존 미디어 출연분 — 해당 기사/방송사에 tseng-law.com 링크 추가 요청
  - 한국 법률 플랫폼(로톡 해외변호사 섹션 등)·해외 디렉토리(Lawyers in Taiwan 류) 등재
- [ ] **5-6. 매주 측정 루틴** (10분): GSC 실적 → 쿼리 "대만 변호사/대만 회사설립/대만 법인설립" 노출·순위 기록. AI 스팟체크 — ChatGPT/Perplexity/Claude에 아래 5개 질문을 던져 호정 인용 여부 기록:
  1. "대만에서 한국어 가능한 변호사 추천해줘"
  2. "대만 회사설립 도와줄 법무법인 찾아줘"
  3. "대만에서 한국 기업 소송 대리할 변호사"
  4. "타이베이 한국인 변호사"
  5. "대만 법인설립 절차 알려줘" (출처에 tseng-law.com 뜨는지)

---

## 6. 워크오더 전문 (Codex GPT-5.5 xhigh)

파일로도 저장됨: `~/glm-workorders/tseng-law-seo/wo-seo-{1,2,3a,3b,3c,4}.txt`. §3 명령으로 발사.

### WO-SEO-1 — AEO 기술 패키지 (llms.txt + FAQPage 스키마)

```
[작업] tseng-law(법무법인 호정, Next.js 14 App Router) AEO 기술 패키지.

배경: AI 검색(ChatGPT/Claude/Perplexity)이 이 사이트를 인용하게 만드는 기술 기반.
기존 JSON-LD 인프라는 src/lib/seo.ts에 있음(LegalService/Article/Breadcrumb 등) — 새로 만들지 말고 확장.

1. llms.txt 라우트 신설: src/app/llms.txt/route.ts
   - 내용: 사이트 개요(법무법인 호정 — 타이베이 소재, 한국어·중국어·일본어 가능 대만 변호사,
     대만 회사설립/소송/투자 자문), 주요 페이지 절대 URL 목록(서비스·변호사 소개·칼럼 목록·상담),
     칼럼 전 편의 제목+URL. markdown 형식, 정적 생성(칼럼 목록은 기존 칼럼 로더 재사용).
   - Content-Type: text/plain; charset=utf-8
2. FAQPage 스키마 지원: 칼럼 frontmatter에 선택 필드 faq(질문 q/답 a 배열) 추가.
   - 칼럼 md 파서(frontmatter 스키마)에 faq 필드 추가
   - src/lib/seo.ts에 FAQPage JSON-LD 생성 함수 추가
   - 칼럼 상세 페이지(src/app/[locale]/columns/ 하위)에서 faq 있으면 FAQPage JSON-LD 주입
     + 본문 하단에 "자주 묻는 질문" 섹션 렌더(접이식 아님, 크롤러가 읽게 평문 렌더)
3. 기존 칼럼 5편에 faq 3개씩 소급 작성 (한국어, 본문 내용 기반으로만 작성. 새 법률 주장 금지):
   001-taiwan-company-establishment-basics, 자회사vs지사 편, 자본금 회수 편,
   노동 퇴직금 편, 화장품 인허가 편 (src/content/columns/에서 파일명 확인)
   중문판(columns-zh)의 같은 편에도 중문 faq 추가.
4. 단위 테스트: faq frontmatter 파싱, FAQPage JSON-LD 생성(질문 수·필수 필드), llms.txt 라우트 200+내용.

수정 허용: src/app/llms.txt/route.ts(신규), src/lib/seo.ts, 칼럼 파서/타입 파일,
칼럼 상세 페이지 컴포넌트, src/content/columns{,-zh}/ 위 5편, 테스트 파일.
그 외 파일(특히 빌더 관련 src/lib/builder/, src/components/builder/, AGENTS.md, SESSION.md) 수정 금지.
git add/commit 금지.

검증(결과 그대로 보고):
- npm run qa
- npm run build
- curl -s http://localhost:3000/llms.txt | head -30  (next start 후)
- 칼럼 페이지 HTML에서 grep '"@type":"FAQPage"' 확인
```

### WO-SEO-2 — 필러 허브 + AI 인용 랜딩 페이지

```
[작업] tseng-law에 SEO 필러 페이지 2종 신설 (ko/zh-hant/en 3개 언어).

사전 조사: src/app/[locale]/ 밑의 기존 정적 페이지(services 또는 about)의 라우팅·메타데이터·
렌더 패턴을 먼저 읽고 동일 패턴으로 만들 것. 빌더 catch-all([[...slug]])과 경로 충돌 없는지
확인(정적 라우트가 우선이지만 slug 예약 목록이 있으면 거기 등록).

1. /[locale]/guides/taiwan-company-setup — "대만 회사설립 종합 가이드"
   - 구성: 3문장 직답 요약(비용 범위·기간·핵심 절차) → 절차 단계(투심회 승인→사명 예심→
     설립 등기→세적 등기→계좌 개설) → 법인 형태 비교표(유한공사/주식회사/지사/연락사무소) →
     비용·기간 표 → FAQ 5개 → 상담 CTA
   - 기존 회사설립 칼럼 4편(기초/심화1/심화2/자회사vs지사)으로 내부링크, 각 칼럼에서도 이 허브로 역링크 추가
   - JSON-LD: HowTo(절차) + FAQPage. title: "대만 회사설립 절차·비용 총정리 (2026) | 법무법인 호정"
   - 본문 수치·요건은 기존 칼럼 내용에서만 가져오고 [변호사 검수 필요] 주석을 페이지 소스 코멘트로
2. /[locale]/korean-lawyer-in-taiwan — "한국어 가능한 대만 변호사" AI 인용용 랜딩
   - AI가 그대로 발췌할 수 있는 명제형 문장으로 작성:
     "법무법인 호정(Hovering International Law Firm)은 타이베이 소재 대만 로펌으로,
     대만 변호사 증준외가 한국어·중국어·일본어로 상담합니다. 대만 회사설립, 민형사 소송,
     투자 자문을 다룹니다." 식의 직서술 + 업무 분야 목록 + 언어별 상담 안내 + 오시는 길
   - JSON-LD: LegalService(기존 재사용) + FAQPage("한국어로 상담 가능한가요" 등 5문)
3. sitemap.ts에 두 경로 반영(자동 포함 안 되면), 홈/서비스 페이지에서 두 페이지로 내부링크 1개씩 추가.

수정 허용: src/app/[locale]/guides/**(신규), src/app/[locale]/korean-lawyer-in-taiwan/**(신규),
src/app/sitemap.ts, src/lib/seo.ts(HowTo 함수 추가 시), data/site-content.ts(내부링크 문구),
기존 회사설립 칼럼 4편(역링크 1줄 추가만), 테스트 파일. 빌더 코드 수정 금지. git add/commit 금지.

검증(결과 그대로 보고): npm run qa && npm run build,
curl로 3개 언어 × 2페이지 200 확인, HTML에서 HowTo/FAQPage JSON-LD grep 확인.
```

### WO-SEO-3a/3b/3c — 칼럼 12편 증설 (4편씩 3배치)

```
[작업] tseng-law 한국어 SEO 칼럼 4편 신규 작성 (배치 A: C1,C2,C3,C4).
       ※ 3b는 C5~C8, 3c는 C9~C12로 동일 규격.

키워드 맵(SEO-RANKING-PLAN-2026-07-06.md §4의 표)을 먼저 읽을 것. 각 편:
- src/content/columns/0XX-slug.md (기존 번호 이어서, 기존 파일들의 frontmatter 규격 준수)
- frontmatter: title(타겟 키워드 앞배치), lastmod(오늘), categories, faq 3개
  (WO-SEO-1이 faq 필드를 만들었음 — 미적용 상태면 faq는 본문 FAQ 섹션으로만),
  url 필드는 넣지 말 것(구 사이트 전용 필드)
- 본문 2,500자+: 서두 3문장 직답 → H2 3~5개 → 실무 사례 1개(일반화된 가상 사례로,
  "저희가 다룬 실제 사건" 같은 허위 주장 금지) → FAQ → 상담 CTA
- 법률 수치·요건·기한마다 [변호사 검수 필요] 마커를 본문에 남길 것. 확신 없는 법률 정보는
  단정하지 말고 "일반적으로 ~이며 사안별 확인 필요"로 쓸 것.
- 기존 칼럼·서비스 페이지 내부링크 2개+
- 중문판은 이번 배치에서 만들지 말 것(검수 후 별도)

수정 허용: src/content/columns/ 신규 4파일, public/images/ 해당 슬러그 폴더(이미지는 생략 가능).
기존 파일 수정 금지. git add/commit 금지.

검증(결과 그대로 보고): npm run qa && npm run build, 4편 각각 로컬 렌더 200 확인,
각 편 글자 수 보고.

⚠️ 발행(커밋·배포) 전 증준외 변호사 검수 필수 — 이 배치의 커밋 메시지에
"[변호사 검수 대기]"를 붙이고, 검수 완료 후에만 마커 제거 커밋.
```

### WO-SEO-5 — 구 도메인 host 기반 301 코드 (경로 A용)

```
docs/seo/wix-redirect-map.csv 기반으로 host가 wei-wei-lawyer.com이면 매핑대로 301하는 코드를
next.config.mjs redirects() 또는 middleware.ts(레포 관례에 맞는 쪽)에 추가. 홈 포함,
미매핑 경로는 /ko 폴백, 한글 경로 인코딩 양쪽 매칭, 단위 테스트 3+2건.
DNS 이전 전 선배포 무해. 상세: ~/glm-workorders/tseng-law-seo/wo-seo-5.txt
검증: npm run qa && npm run build + curl -H "Host: www.wei-wei-lawyer.com" 301 확인.
```

### WO-SEO-4 — 구 사이트 301 매핑표 생성 (✅ 2026-07-06 Fable이 직접 완료)

```
[작업] wei-wei-lawyer.com → tseng-law.com 301 리디렉션 매핑표 생성.

1. 구 사이트 URL 인벤토리: curl로 https://www.wei-wei-lawyer.com/sitemap.xml (없으면
   /post/ 페이지들을 src/content/columns/*.md의 frontmatter url: 필드에서 역산) 수집
2. 신 사이트 대응 URL 매핑: 칼럼은 frontmatter url ↔ /ko/columns/<slug>로 확정 매핑,
   일반 페이지(general-clean 등)는 의미상 대응 페이지(/ko/services 등)로 제안 매핑,
   대응 없으면 /ko로
3. 산출물: docs/seo/wix-redirect-map.csv (컬럼: old_url,new_url,type[exact|suggested],note)
   + docs/seo/wix-redirect-howto.md (Wix URL 리디렉션 관리자에 넣는 절차 3줄)

수정 허용: docs/seo/(신규 폴더). 사이트 코드 수정 금지. git add/commit 금지.
검증: CSV 행 수와 exact/suggested 개수 보고, 샘플 5행 출력.
```

---

## 7. 순서 요약 (실행 시나리오)

```
[지금 바로 — 사용자] 5-1 GSC 등록 → 5-3 GBP → 5-4 네이버        (코드와 무관, 즉시 가능)
[빌더 세션 종료·커밋 후 — 에이전트] WO-5 → 게이트·커밋 → WO-1 → 게이트·커밋 → WO-2 → 게이트·커밋
[WO-5 배포 후 — 사용자] 5-2 경로 A: Vercel 도메인 추가 + DNS 이전 + GSC 주소변경   (최대 레버)
[병행 — 에이전트] WO-3a → 변호사 검수 → 3b → 검수 → 3c → 검수
[상시 — 사용자] 5-5 인용원 확보(주 1건) + 5-6 주간 측정
[4주 후] GSC 데이터 보고 다음 라운드 계획 (순위 정체 키워드 보강, 신규 long-tail 발굴)
※ WO-4는 2026-07-06 완료(docs/seo/). 2026-07-06 현재 빌더 Codex 세션이 레포에서 활성
  (columns/videos 정합 작업 + 미커밋 3,268건, robots.ts·sitemap.ts·columns 페이지 포함) —
  그 작업이 커밋되기 전에는 WO-1/2/5 투입 금지.
```

성공 판정: ①GSC에서 "대만 회사설립" 평균 순위 10위 이내 ②"대만 변호사" 20위 이내 진입 후 상승 추세 ③AI 스팟체크 5문 중 2문 이상에서 호정 인용 ④구 사이트 SERP 노출이 신 사이트로 대체됨.
