# 작업지시서 · tseng-law.com EN/JA/VI 신규 칼럼 (2026-09-29)

총괄: Opus 5.5 (Claude Code 세션) · 조사·집필: Sonnet 5.5 · 중간검수: Opus 5.5 · 최종검수: Fable 5.1

## 목적
대만 로펌 **Hovering International Law Firm (昊鼎國際法律事務所)**, 광고책임 변호사 **曾雋崴 (Wei Tseng, 여성)** 의 사이트 tseng-law.com 칼럼에,
**영어권·일본·베트남 독자가 실제로 겪는 대만 법률 문제**를 다룬 칼럼을 원어로 새로 쓴다. 목표는 이 세 나라 사람들의 **실제 사건 상담 문의**.
기존 23편(회사설립·노동 퇴직금·교통사고·이혼·상속·화장품·물류·반도체·대만인 배우자 이혼/결혼/출생)은 대부분 한국어 원문의 번역이다. 이번 칼럼은 **해당 언어 독자만을 위해 처음부터 그 언어로 쓴다(번역 금지)**.

## 작업 위치
- 워크트리: `~/Projects/tseng-law-global-columns-20260929` (브랜치 `content/en-ja-vi-columns-20260929`, 기준 origin/main 134bda01)
- **`src/content/` 는 건드리지 말 것.** 산출물은 오직 `work/global-columns-20260929/<ID>/` 에만 쓴다.
- 다른 워크트리(`~/Projects/tseng-law`, `tseng-law-*-20260929` 등)는 읽기만.

## 형식 (반드시 기존 칼럼 형식과 동일)
먼저 예시 파일을 읽고 형식을 맞춘다:
- EN: `src/content/columns-en/020-taiwanese-spouse-divorce-from-abroad.md`, `src/content/columns-en/009-taiwan-voluntary-resignation-severance.md`
- JA: `src/content/columns-ja/023-baby-taiwan-nationality-birth-registration.md`, `src/content/columns-ja/008-taiwan-labor-severance-law.md`
- VI: `src/content/columns-vi/019-taiwanese-spouse-divorce-agreement-registration.md`, `src/content/columns-vi/020-taiwanese-spouse-divorce-from-abroad.md`

Frontmatter 필드 (이 순서):
```
---
title: "..."            # 독자가 검색창에 칠 법한 문제 중심 제목
seoTitle: "..."         # EN(테스트 강제): title+" | Hovering Law"가 60자를 넘을 때만 넣고, 그때 seoTitle은 30–45자·title과 달라야 함. 60자 이하면 seoTitle 줄 자체를 빼기.
                        # JA: 30자 이내 권장(023 예시처럼) / VI: 45자 이내
summary: "..."          # 메타 설명. EN(테스트 강제) 정확히 150–160자, "..."·"…" 금지. JA 80–130자, VI 140–170자. 첫 문장에 핵심 답
published: "2026-09-29"
lastmod: "2026-09-29"
date_display: "September 29, 2026" | "2026年9月29日" | "29 tháng 9 năm 2026"
read_time: "N min read" | "約N分" | "N phút đọc"
categories:
  - "Taiwan Legal Information" | "台湾法律情報" | "Thông tin pháp luật Đài Loan"
topic: "<company|tax|visa|family|inheritance|litigation|labor|lawyer|other 중 하나>"
featured_image: "../images/<NNN-slug>/featured-01.webp"
faq:            # 3개. 각 답은 2–3문장, 본문과 모순 없게, 결과 보장 금지
  - q: "..."
    a: "..."
---
```
본문: `# 제목` 다음 도입 1–2문단 → `##` 소제목 5–8개 → 마지막 `###` 상담 안내 블록(예시 파일의 CTA와 같은 구성: 사무소명, 연락 시 알려줄 정보, 이메일 wei@hoveringlaw.com.tw, 주소 103 臺北市大同區承德路一段35號7樓之2, 광고책임 변호사 曾雋崴 표기) → 마지막 줄 "공식 자료 확인일: 2026-09-29" 문장(언어별 표현, 예시 파일 참조).
- 전화번호는 넣지 않는다(기존 칼럼과 동일). 상담 언어는 "원하는 언어를 알려 달라"고만 쓰고, 특정 언어 상담 가능 여부를 약속하지 않는다.
- 분량: EN 1,300–1,900 words / JA 5,000–7,500字 / VI 1,500–2,200 từ.
- 내부 링크: 관련 기존 칼럼은 `/<locale>/columns/<slug>` 형식(해당 로케일 파일이 실제로 있는 slug만). 랜딩 페이지 링크는 넣지 않는다(통합 단계에서 총괄이 판단).

## 사실 정확성 (가장 중요)
1. **법조문·절차·기한·금액·기관명은 모두 공식 출처에서 직접 확인**한다. 기억으로 쓰지 않는다. 오늘은 2026-09-29이며, 법령은 개정될 수 있으니 반드시 현행 조문을 WebFetch로 연다.
   - 법령 원문: 全國法規資料庫 `https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=<코드>&flno=<조>` (영문판 `https://law.moj.gov.tw/ENG/...` 는 참고용, 중국어가 정본)
   - 기관: 勞動部 mol.gov.tw, 勞動力發展署 wda.gov.tw, 內政部移民署 immigration.gov.tw, 司法院 judicial.gov.tw, 法務部 moj.gov.tw, 財政部 mof.gov.tw / 各地區國稅局, 警政署 npa.gov.tw, 金融監督管理委員會 fsc.gov.tw, 法律扶助基金會 laf.org.tw 등 **.gov.tw / 공공기관 도메인 우선**. 블로그·로펌 글은 단서로만 쓰고 인용 근거로 쓰지 않는다.
2. 핵심 주장(요건·기한·형량·금액·예외)마다 **두 번 확인**: (a) 조문 원문 + (b) 주무기관 안내·판결·해설 중 하나. 둘이 어긋나면 조문 원문을 따르고 dossier에 기록.
3. 확인하지 못한 것은 **쓰지 않거나** "관할 기관에 확인하라"고 쓴다. 판례 번호·통계·수수료·소요기간을 지어내지 않는다.
4. 본문 안 인용: 조문은 해당 조문 링크를 건다(예시 파일처럼 `[Article 1050 of Taiwan's Civil Code](URL)`). 한 편당 공식 링크 5–10개.

## 문체 — AI 티 금지
- 대만에서 외국인 사건을 오래 해 온 변호사가 의뢰인에게 설명하듯 쓴다. 구체적 장면(“공항 출국심사대에서 제지당했다”, “회사가 해고 통지 문자를 보냈다”)으로 시작하고, 서류 이름·기관 창구·기한을 구체적으로.
- 금지: "In this article", "It is important to note", "navigate/navigating", "delve", "crucial", "comprehensive", "In conclusion", "Whether you're...", "landscape", 과도한 굵은 글씨, 이모지, 대시(—) 남발, 모든 섹션을 같은 길이·같은 구조(질문-답-요약)로 찍어내기, 불릿 남발. 문장 길이를 섞고, 결론 요약 문단으로 끝내지 않는다.
- JA: です・ます調의 자연스러운 비즈니스 일본어. 직역투(「〜することが重要です」 반복, 「〜について解説します」 서두) 금지. 대만 법률용어는 일본 독자가 알아보게 표기: 예 「勞動基準法（労働基準法）」, 「支付命令（督促手続に相当）」. 번체자 고유명사는 원문 그대로 병기.
- VI: 대만에 사는 베트남인이 실제로 쓰는 자연스러운 베트남어(“chủ thuê”, “công ty môi giới”, “Sở Di dân”, “thẻ cư trú (ARC)”). 한자어 직역투 금지. 핵심 용어는 처음 나올 때 중국어 병기: 예 “lệnh bảo vệ (保護令)”. 독자가 대만 기관 서류를 들고 올 수 있도록.
- EN: 미국·영국·호주·싱가포르 독자가 읽는 평이한 영어. 법률 용어는 처음 한 번 중국어 병기.

## 윤리·광고 규정
- 결과 보장·승소율·“최고/유일” 표현 금지. 다른 로펌 비방 금지. 공포 조장 금지.
- 무료 공공 지원(1955 상담전화, 법률구조재단 등)이 사실이면 숨기지 말고 알려 준다 — 신뢰가 사건으로 이어진다.
- 범죄 관련 글은 “처벌 피하는 요령”이 아니라 권리·절차·변호인 조력 안내로 쓴다. 증거 인멸·도주를 돕는 조언 금지.
- 대표 변호사는 여성(曾雋崴). 성별 표현이 필요한 언어는 여성형.

## 산출물 (각 ID 폴더)
1. `dossier.md` — 조사 기록. 표 형식: `주장 | 출처 URL | 원문 인용(중국어 원문 그대로, 조문번호 포함) | 확인 방법(a/b) | 접속일`. 마지막에 "확인 못 해서 본문에서 뺀 것" 목록.
2. `draft.md` — 완성 칼럼 파일 전체(frontmatter+본문). 파일명 slug는 영어 소문자-하이픈.
3. `NOTES.md` — 3–6줄: 최종 slug, 목표 독자, 검색 의도, 내부링크, 남은 불확실성.

## 자체 점검 (제출 전)
- 모든 조문 링크를 다시 열어 조번호·내용이 맞는지 확인했는가
- 금지 표현 검색(grep)으로 0건인가
- 기존 칼럼과 주제가 겹치지 않는가 (특히 008 퇴직금, 009 자진퇴사, 007 이혼, 016 상속, 019–023 대만인 배우자)
- summary·seoTitle 길이 제한을 지켰는가
