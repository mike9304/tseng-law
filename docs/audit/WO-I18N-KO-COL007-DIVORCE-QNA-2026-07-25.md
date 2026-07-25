# WO-I18N-KO-COL007 — 대만 이혼 절차 Q&A

Date: 2026-07-25 KST
Manager: Codex `/root`

## Purpose

Rewrite the Korean source for column 007 under the approved master contract:

`docs/audit/WO-I18N-COL007-EDITORIAL-LEGAL-CONTRACT-2026-07-25.md`

This is the first locale unit. It must replace the translated and legally
stale twenty-five-question legacy body with a complete, current, neutral
Korean guide. It may consolidate duplicate questions, but it must preserve
every subject in the master's twenty-five-question coverage matrix.

## Ownership and allowed files

The writer owns exactly:

- `src/content/columns/007-taiwan-divorce-lawsuit-qna.md`
- `src/lib/__tests__/columns-ko-family-007.test.ts`

The writer must not edit another locale, shared data, archive copy,
site-content, service details, public search data, embeddings, images, routes,
the builder, another test, or either work order.

The writer must not stage, commit, push, deploy, publish, or operate a server.
Only the manager may commit after all gates pass.

## Exact frontmatter

Use this complete logical value set:

```yaml
title: "대만 이혼 절차 Q&A: 조정·소송·재산분할·자녀"
url: "https://www.wei-wei-lawyer.com/post/taiwan-divorce-lawsuit-qna"
lastmod: "2026-07-25"
date_display: "2025년 9월 13일"
read_time: "<완성 본문의 계산값>분 분량"
categories:
  - "대만 법률정보"
featured_image: "../images/007-taiwan-divorce-lawsuit-qna/featured-01.jpg"
faq:
  - q: "대만에서 협의이혼은 합의서에 서명하면 바로 효력이 생기나요?"
    a: "<FAQ 1 exact answer>"
  - q: "대만 법원의 이혼 조정에는 부부가 반드시 함께 출석해야 하나요?"
    a: "<FAQ 2 exact answer>"
  - q: "혼인파탄에 책임이 있는 배우자도 대만에서 재판상 이혼을 청구할 수 있나요?"
    a: "<FAQ 3 exact answer>"
  - q: "혼전 자금으로 집값을 냈거나 한쪽 명의로 등기하면 소유권과 재산분할이 결정되나요?"
    a: "<FAQ 4 exact answer>"
  - q: "잔여재산 분배, 이혼 손해배상, 배우자 부양과 양육비는 같은 청구인가요?"
    a: "<FAQ 5 exact answer>"
  - q: "대만 법원은 미성년 자녀에 관한 사항을 어떤 기준으로 판단하나요?"
    a: "<FAQ 6 exact answer>"
```

Replace only the read-time placeholder with the calculated integer and only
the FAQ answer placeholders with the exact answers below. `gray-matter` must
parse the resulting object exactly.

The source must contain one raw Markdown H1, exactly:

`# 대만 이혼 절차 Q&A: 조정·소송·재산분할·자녀`

## Exact body image

Place exactly this image immediately after H1:

```md
![대만 이혼 절차와 국제가사 문제를 설명하는 이미지](../images/007-taiwan-divorce-lawsuit-qna/featured-01.jpg)
```

No other body image is allowed. `img-01.jpg` must be absent. Do not delete any
asset file.

## Exact six FAQ answers

Each answer must appear exactly twice in the raw source: once in frontmatter
and once as the first paragraph after its assigned H2.

### FAQ 1

대만 민법 제1050조에 따른 협의이혼은 서면으로 합의하고, 두 사람 이상의 증인이 당사자 쌍방의 진정한 이혼 의사를 확인한 뒤 서명하며, 호정기관에 이혼등기를 해야 효력이 생깁니다. 서명된 합의서만으로 이혼이 완성되는 것은 아니며, 외국 요소가 있으면 준거법·문서 인증·번역과 다른 국가 또는 지역에서의 신고도 별도로 확인해야 합니다.

Assigned to H2 2.

### FAQ 2

항상 그런 것은 아닙니다. 대만 법원은 가사사건의 성질에 따라 당사자나 법정대리인에게 직접 출석을 명할 수 있고, 정당한 이유 없이 따르지 않으면 가사사건법 제13조와 준용되는 민사소송법 제303조에 따라 최초 3만 대만달러 이하의 과태료가 문제될 수 있습니다. 다만 같은 공간에서 반드시 함께 조정해야 하는지, 분리·안전·대리 또는 다른 절차상 조치가 가능한지는 법원과 사건의 사정을 확인해야 합니다.

Assigned to H2 3.

### FAQ 3

현행 민법 제1052조 제2항 단서는 혼인파탄의 중대 사유가 한쪽에게만 책임 있는 경우 원칙적으로 상대방만 이혼을 청구하도록 정합니다. 그러나 대만 헌법재판소 112년 헌판자 제4호(112年憲判字第4號)는 중대 사유가 발생하거나 계속된 상당한 기간을 고려하지 않은 채 유책배우자의 이혼 기회를 완전히 박탈해 개별사건에서 명백히 가혹해지는 범위는 위헌이라고 판단했습니다. 조문은 남아 있으므로 무조건 가능하거나 불가능하다고 단정하지 말고 법원이 판결 취지와 구체적 사실을 어떻게 적용하는지 보아야 합니다.

Assigned to H2 4.

### FAQ 4

아닙니다. 주택 등기명의와 매수자금의 출처는 중요한 증거이지만, 소유권·증여·명의신탁·대여·부당이득 같은 개별 청구와 민법 제1030조의1의 잔여재산 차액분배는 서로 다른 문제입니다. 실제 합의, 취득 원인과 시기, 자금 흐름, 채무, 무상취득 여부와 증거를 나누어 검토해야 하며, 혼전 자금으로 일부 비용을 냈거나 한쪽 명의로 등기되었다는 사실만으로 모든 결론이 정해지지 않습니다.

Assigned to H2 6.

### FAQ 5

같은 권리가 아닙니다. 민법 제1030조의1의 잔여재산 차액분배청구권, 제1056조의 재판상 이혼 손해배상, 제1057조의 무과실 배우자에 대한 곤궁부양, 미성년 자녀의 양육비는 발생요건과 계산·기간이 다릅니다. 잔여재산 차액분배청구권에는 차액을 안 날부터 2년, 법정재산제 소멸부터 5년의 기간이 적용되지만, 이를 다른 청구에 그대로 옮겨서는 안 됩니다.

Assigned to H2 7.

### FAQ 6

대만 민법 제1055조와 제1055조의1에 따라 법원은 미성년 자녀의 최선의 이익을 기준으로 권리·의무의 행사와 부담, 면접교섭 등 자녀 관련 사항을 판단합니다. 자녀의 나이·건강·의사와 발달 필요, 부모의 생활·돌봄 능력과 태도, 자녀와의 정서적 관계, 다른 부모와의 관계를 방해하는지 등 법정 요소와 구체적 자료를 종합하므로, 부모의 소득이나 혼인파탄 책임 하나로 결론을 정할 수 없습니다.

Assigned to H2 8.

## Exact thirteen H2s

Use exactly these raw Markdown H2s in this order:

1. `## 1. 대만 이혼의 세 가지 경로와 국제사건의 첫 확인사항`
2. `## 2. 협의이혼 요건과 호정기관 등록`
3. `## 3. 법원 조정·소송, 출석과 불복절차`
4. `## 4. 재판상 이혼사유와 유책배우자 제한`
5. `## 5. 외국 혼인·외국 이혼과 대만 호적`
6. `## 6. 주택 명의·혼전 자금과 잔여재산 분배`
7. `## 7. 이혼 손해배상·배우자 부양·미혼 동거와 제3자`
8. `## 8. 미성년 자녀의 권리·의무와 최선의 이익`
9. `## 9. 양육비·면접교섭·강제집행과 임시처분`
10. `## 10. 자녀와 함께하는 국제이주`
11. `## 11. 증거와 실무 준비`
12. `## 12. 공식 자료`
13. `## 13. 관련 안내`

H3s may divide a long section, but may not introduce a new conceptual subject
or change this order.

## Required Korean legal-content contract

The body must implement every proposition in the master contract in natural
Korean. The dedicated test must lock the following exact ideas with
substantive phrases, not only article numbers or keywords.

### H2 1 — paths and cross-border questions

- Separate 협의이혼, 법원 조정·화해에 의한 이혼, and 재판상 이혼.
- Before giving a cross-border answer, separately identify Taiwan
  jurisdiction or authority, applicable law, Taiwan recognition or effect,
  Taiwan household registration, and the other jurisdiction's procedure.
- State that nationality or place of marriage alone does not decide all five.

### H2 2 — Article 1050 and registration

- The first paragraph must be FAQ 1 exactly.
- Explain writing, at least two witnesses who perceived the genuine mutual
  intent, and household registration as distinct requirements.
- State that a private signed agreement alone is not effective.
- Use the current official registration guide for applicants, documents,
  foreign authentication and Chinese translation.
- Qualify the general thirty-day registration application period by finality
  of a Taiwan judgment or establishment of court mediation or settlement.
- Explain that a qualifying Taiwan court result may be directly registered
  after notice when no party applies; missing the application or online window
  does not undo the divorce.

### H2 3 — mediation, litigation, appearance, duration, and review

- The first paragraph must be FAQ 2 exactly.
- Explain ordinary pre-litigation family mediation without saying every case
  follows one unalterable sequence.
- State that Article 13 applies only where the court orders personal
  appearance; Article 303 is applied mutatis mutandis, the first monetary
  penalty is up to
  NTD 30,000, no arrest is available through that incorporation, and repeated
  sanctions may follow another lawful notice and unjustified nonappearance.
- Do not promise separate rooms, remote appearance, counsel-only attendance,
  or a fixed completion time.
- Distinguish successful mediation or settlement, final judgment, and the
  type-specific route and period for review or appeal.

### H2 4 — Article 1052 and the constitutional judgment

- The first paragraph must be FAQ 3 exactly.
- Explain the ten paragraph 1 grounds and the paragraph 2 serious-cause rule
  as separate structures.
- Preserve the statutory distinctions among life or death unknown for more
  than three years, continuing malicious desertion, and another serious cause.
- State that a missing-person report can be evidence but is not a universal
  prerequisite.
- State that a prior cohabitation-performance action is not a universal
  prerequisite.
- State that several months away from home alone does not establish a ground.
- Do not equate adultery with an automatic divorce, property, damages, child,
  or support result.

### H2 5 — foreign records and foreign elements

- Reject the legacy two-choice rule of registering the marriage first or
  filing a Taiwan lawsuit.
- Identify nationality, domicile or habitual residence, place and form of
  marriage or divorce, current household records, existing foreign judgment
  or certificate, service and procedural fairness, and requested Taiwan
  effect.
- Explain authentication and Chinese translation as fact- and
  document-specific, including separate Mainland China, Hong Kong, and Macau
  verification routes.
- Do not say foreign local law or a foreign certificate alone completes every
  Taiwan step.

### H2 6 — property ownership and Article 1030-1

- The first paragraph must be FAQ 4 exactly.
- Separate registered title, an underlying gift/nominee registration/loan/
  trust/unjust-enrichment theory, and residual-property calculation.
- Explain Article 1017 classification and presumption without turning it into
  an ownership shortcut.
- Preserve evidence guidance: transfers, purchase and loan agreements,
  receipts, messages, tax, registration, acquisition source and timing.
- Explain Article 1030-1 qualifying net residual-property difference,
  inherited or gratuitously acquired property and consolation-damages
  exclusions, and court adjustment or exemption where equality is manifestly
  unfair under the statutory circumstances.
- State that adultery itself does not automatically bar or reduce a claim.
- Lock the knowledge-two-year and regime-termination-five-year periods only
  to this claim.

### H2 7 — separate adult claims

- The first paragraph must be FAQ 5 exactly.
- Separate Article 1056 pecuniary/non-pecuniary damages, Article 1057
  post-divorce support, residual-property distribution, parent-child support,
  and separate tort or property claims.
- For Article 1057, preserve judicial divorce, claimant without fault, and
  financial hardship as requirements; do not use average monthly consumption
  as a binding formula.
- Explain that unmarried cohabitants do not obtain divorce rights, while an
  actual co-owned asset, loan, contract, nominee registration, trust, unjust
  enrichment, or tort may require separate analysis.
- State that an in-law is not an Article 1057 obligor; a third-party claim
  needs a separate legal basis and evidence.
- Do not attach one five-year period to all rights.

### H2 8 — minor children

- The first paragraph must be FAQ 6 exactly.
- Explain Taiwan's full `미성년 자녀에 대한 권리·의무의 행사와 부담`
  concept before using 친권 or 양육권 as shorthand.
- Explain agreement, court determination or change, and adverse-to-the-child
  review under Articles 1055 and 1055-1.
- State that a signed divorce agreement does not eliminate later
  best-interests review.
- Do not treat agreement changes as only a household-registration formality.
- Explain why completing divorce while child or property issues remain open is
  not a universal shortcut; identify agreements, orders, and interim
  protection that may still be needed.

### H2 9 — child support, contact, and enforcement

- State under Article 1116-2 that parent-child support continues after divorce
  and is not Article 1057 spouse support.
- Explain modification using current child needs, both parents' resources and
  circumstances, the existing instrument, and best interests; do not require
  an unforeseeable event in every case.
- Explain court determination, change, enforcement, or interim relief where
  contact is obstructed.
- Under Family Act Article 194, qualify direct and indirect compulsory methods
  by the child's best interests.
- Do not promise force, immediate handover, punishment, or a change of
  parental responsibility.

### H2 10 — international relocation

- Reject Korean living costs as a standalone support formula.
- Separate authority over residence and travel, agreement or court order,
  best interests and continuing contact, passport/entry/exit/immigration,
  cross-border enforceability, actual expenses and resources, and urgent
  interim protection.
- State that the 1980 Hague Child Abduction Convention must not be assumed to
  apply automatically to Taiwan.
- Do not encourage removal or retention contrary to an agreement or order.

### H2 11 — evidence and privacy

Use the exact nine-category ordered checklist in the master contract, rendered
in clear Korean. It must cover:

1. status, nationality, domicile, habitual residence and addresses;
2. divorce, service, mediation, judgment and finality documents;
3. foreign records, authentication, translation and recognition;
4. matrimonial regime, assets, debt, title, acquisition, tax and valuation;
5. divorce-ground chronology and lawfully available evidence;
6. child circumstances and best-interests material;
7. child orders, payments, contact, travel and relocation plan;
8. every deadline tied to its correct trigger; and
9. privacy-safe handling.

Prohibit unlawful surveillance, account or device intrusion, tracking,
unlawful recording, child-data disclosure, retaliation, asset concealment, and
unauthorized child removal.

## Exact official-source links

Under H2 12, use exactly these ten links in this order and once each:

1. `[대만 전국법규자료고: 민법](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000001)`
2. `[대만 법무부: 민법 영문본](https://mojlaw.moj.gov.tw/ENG/LawContentE.aspx?LSID=FL001351)`
3. `[대만 전국법규자료고: 가사사건법](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0010048)`
4. `[대만 전국법규자료고: 민사소송법 제303조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=303&pcode=B0010001)`
5. `[대만 전국법규자료고: 가사비송사건 임시처분 관련 규정](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0010056)`
6. `[대만 전국법규자료고: 호적법](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0030006)`
7. `[대만 내정부 호정사: 이혼등기 안내](https://www.ris.gov.tw/documents/html/2/3/1/384.html)`
8. `[대만 전국법규자료고: 섭외민사법률적용법](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000007)`
9. `[대만 헌법재판소: 112년 헌판자 제4호(112年憲判字第4號)](https://cons.judicial.gov.tw/docdata.aspx?fid=52&id=310013)`
10. `[대만 헌법재판소: 112년 헌판자 제4호 영문본](https://cons.judicial.gov.tw/en/docdata.aspx?fid=5534&id=352234)`

No other external link is allowed.

## Exact related links

Under H2 13, use exactly these three links in this order and once each:

1. `[대만 가사소송 서비스](/ko/services/family)`
2. `[대만 소송 변호사 안내](/ko/taiwan-litigation-lawyer)`
3. `[상담 문의](/ko/contact)`

No `/zh-hant/`, `/en/`, or `/ja/` internal route is allowed in this source.

## Exact ending

After the three related links, insert a thematic break and end with exactly:

```md
이 글은 대만의 이혼, 국제가사, 부부재산 및 미성년 자녀 제도를 일반적으로 설명하기 위한 교육 목적의 자료이며, 개별 사건에 대한 법률 자문이 아닙니다. 관할, 준거법, 외국 재판의 승인, 혼인·호적 상태, 재산제, 자녀에 관한 기존 합의나 재판, 사실관계와 증거 및 최신 공식 규정에 따라 절차와 결과가 달라질 수 있습니다. 등록·불복·청구·집행 기한은 행동하기 전에 각 권리와 절차의 정확한 기산점을 기준으로 개별적으로 확인하시기 바랍니다.

**증준외 변호사(曾雋崴, Wei Tseng)**
```

Nothing may follow the author line.

## Length and read-time contract

The body must be complete, not padded and not compressed. Target 2,300–3,600
visible Korean eojeol after removing Markdown syntax and link targets.

Calculate:

`read_time = ceil(visible_eojeol_count / 180)`

The test must freeze the final visible count and assert the calculated
frontmatter value. FAQ frontmatter is not part of the visible body count.

## Forbidden Korean legacy wording

The dedicated test must reject at least:

- `부양비와 재산 분할 청구권 모두 이혼일로부터 5년`
- `평균 월 소비 지출에 따라`
- `외국에서 결혼하고 외국에서 이혼하고자 한다면`
- `대만에서 이혼하려면 두 가지 방법`
- `집의 소유권을 회수할 수 없습니다`
- `집의 소유권을 회수할 가능성이 있습니다`
- `외도한 쪽은 이혼 소송을 제기할 수 없습니다`
- `현재 법 개정은 이루어지지 않았으므로`
- `먼저 경찰서에 실종 신고`
- `먼저 법원에 동거 의무 이행을 청구`
- `한국의 물가 수준에 맞춰 양육비`
- `법원에 강제 집행을 요청할 수 있습니다` when used as an
  unqualified automatic remedy;
- `댓글이나 연락주세요`
- `부****양****비`
- `증준외 대만변호사입니다`
- `曾俊瑋`
- `img-01.jpg`
- any `/zh-hant/`, `/en/`, or `/ja/` internal link.

The test must also reject semantic equivalents of the master's prohibited
claims even if the exact legacy string changes.

## New dedicated test

Create:

`src/lib/__tests__/columns-ko-family-007.test.ts`

Follow the strong semantic patterns in:

- `src/lib/__tests__/columns-ko-family-016.test.ts`
- `src/lib/__tests__/columns-ko-labor-014.test.ts`
- `src/lib/__tests__/columns-ko-litigation-010.test.ts`

The new test must implement every minimum in the master contract, including:

- exact parsed frontmatter;
- canonical and `divorce-qna` alias loader behavior;
- exact H1, image, six FAQs and thirteen H2s;
- FAQ answer repetition and assigned-section first paragraphs;
- at least one exact proposition for each of the twenty-five legacy topics;
- ten official and three internal links as the only body links;
- exact ending;
- wrong identity, wrong locale, wrong image and forbidden claims absent;
- visible count/read-time; and
- loaded `post` title, date, display date, category, image, FAQ and content.

A test that checks only article numbers, headings, or keywords is insufficient.

## Writer verification

Run:

```bash
npx vitest run \
  src/lib/__tests__/columns-ko-family-007.test.ts \
  src/lib/__tests__/columns-faq.test.ts \
  src/lib/__tests__/columns-ja-content.test.ts \
  src/lib/__tests__/columns-zh-content.test.ts \
  src/lib/__tests__/columns-en-content.test.ts
npm run -s typecheck
npx eslint \
  src/lib/__tests__/columns-ko-family-007.test.ts
git diff --check -- \
  src/content/columns/007-taiwan-divorce-lawsuit-qna.md \
  src/lib/__tests__/columns-ko-family-007.test.ts
```

## Independent review gates

After implementation:

1. an independent current-Taiwan-family-law reviewer must compare the complete
   Korean body with the master and official sources;
2. an independent native Korean editorial reviewer must inspect clarity,
   legal terminology, repetition, translated phrasing, gender neutrality, and
   non-promotional tone;
3. all findings return to the same writer;
4. repeat both reviews until both pass.

## Manager browser gate

At `http://127.0.0.1:3765` or another manager-confirmed local port, inspect:

- `/ko/columns/taiwan-divorce-lawsuit-qna`;
- desktop and mobile;
- exact title, H2s, FAQs, official sources, related links, disclaimer and
  author;
- `html lang="ko"`, canonical, alternates, Article/FAQ/Breadcrumb JSON-LD;
- image request and localized alt;
- no horizontal overflow;
- no console, page, request, or bad-response error; and
- all four mobile flag controls:
  - `🇰🇷 KR` keeps the Korean canonical route;
  - `🇯🇵 JP` opens the Japanese canonical slug with `html lang="ja"`;
  - `🇹🇼 TW` opens the ZH-Hant canonical slug with
    `html lang="zh-Hant"`;
  - `🇺🇸 EN` opens the English canonical slug with `html lang="en"`.

Do not edit public archive, related-card, search, service, or embedding copy in
this Korean unit. Those belong to the later bounded public-sync and embedding
units.

Do not push or deploy.
