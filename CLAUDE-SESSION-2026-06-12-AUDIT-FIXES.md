# Claude 감사 세션 — 2026-06-12 (병행 세션과 분리된 감사·수정 차선)

## 배경
- 시작 시점에 **다른 세션이 배치3(170 테스트) 그린화 작업을 진행 중**이었음 (StyleTab 리팩터 + 테스트 파일 수정 + seo-publish-history 스냅샷 재생성).
- 충돌 방지를 위해 이 세션은 **서버(:3000) 무접촉 / 테스트 파일·스냅샷 무수정** 원칙으로
  공개 사이트 디자인 감사 + 콜드 영역(persistence/redirects/identity) 코드 감사만 수행.
- 검증은 별도 distDir(.next-dev) dev 서버(:3007, 사용 후 종료)와 vitest로만 수행.

## 수정 1 — 레거시 공개 페이지 reveal-stagger 영구 비표시 버그 (디자인, HIGH)
**증상**: /ko/contact의 "문의 유형"·"사무소 위치" 카드, /ko/about 하단 문의 그리드,
/ko/privacy·/ko/disclaimer·/ko/accessibility 법적 고지 카드, /ko/videos 비디오 그리드가
**라벨만 남고 영구 투명(opacity 0)** 상태로 서비스되고 있었음.

**원인**: `.reveal-stagger > *`는 CSS상 opacity 0에서 시작하고, 이를 보이게 하는 유일한
메커니즘은 `<Reveal>` 래퍼(`.reveal.is-visible` 조상)뿐. home-legacy는 모든 섹션을
`<Reveal>`로 감싸지만 contact/about/legal/videos 호출부는 감싸지 않았음.

**수정**: 컴포넌트가 스스로 `<Reveal>`을 감싸도록 변경 (correct-by-construction):
- `src/components/ContactBlocks.tsx`
- `src/components/ConsultationGuideSection.tsx`
- `src/components/LegalPageSections.tsx` (stagger 섹션만 래핑)
- `src/components/VideoChannel.tsx`

**검증**: :3007 dev 서버에서 /ko/contact·/ko/privacy·/ko/about·/ko/videos 라이브 DOM 프로브
→ 모든 stagger 자식 opacity 1 / translate 0. 스크린샷 /tmp/design-audit-contact-fixed-*.png.

**⚠ 그린화 세션 참고**: 위 공개 페이지가 비주얼 베이스라인에 포함되어 있다면
다음 리빌드 후 해당 페이지 스냅샷이 달라질 수 있음(이전 베이스라인은 "빈 섹션"이 정상으로 찍혀 있던 상태).

## 수정 2 — 리다이렉트 동시 생성 silent data loss (기능, HIGH)
**증상**: 두 클라이언트가 같은 `from`으로 동시에 리다이렉트 생성 시, 나중 쓰기의 룰이
`reconcileSiteDocumentRedirectsForWrite` 머지에서 조용히 폐기되는데도 **양쪽 모두 성공 응답**을 받음.

**수정**: `src/lib/builder/site/redirects.ts` `createRedirect` — 쓰기 후 persisted 문서를
재독해 자기 redirectId 생존 확인, 미생존 시 기존 중복 오류(`from "..." already has an active redirect`)로 반환.
(update는 분석상 자기 룰이 latest에 존재해 머지에서 보존되므로 해당 없음)

**테스트**: `src/lib/builder/__tests__/redirects-concurrency.test.ts` (신규 3개) —
실제 reconcile 로직을 사용한 인메모리 persistence 모킹으로 동시 생성 레이스를 결정적으로 재현.

## 수정 3 — siteId/pageId 경로 주입 하드닝 (보안, 방어적)
- `src/lib/builder/site/identity.ts` `normalizeBuilderSiteId`: 안전 슬러그(`^[a-z0-9][a-z0-9_-]*$/i`)
  외 입력은 DEFAULT로 폴백. collab 스토어들(comments/presence/review-markers)이 `input.siteId`를
  FS 경로에 조인하므로 도달 가능성 실재했음.
- `src/lib/builder/site/persistence.ts` `pagePathname`: pageId 동일 차셋 가드(throw).
  Next 동적 세그먼트는 URL 디코딩되어 도달하므로 `..%2F` 류 방어.
  (기존 ID 전수: `page-\d+-\d+`, `global-header/footer` — 모두 통과 확인)
- 테스트: `src/lib/builder/site/__tests__/identity.test.ts`에 normalize 케이스 통합.

## 기각한 감사 항목 (수정 안 함, 근거)
- **redirect 엣지캐시 무효화 누락**: 로컬 오리진은 캐시 우회 + no-store(QA 환경 비해당).
  프로덕션 60s TTL은 redirects-edge.ts 헤더 주석에 문서화된 의도적 설계이고,
  엣지/노드 런타임 격리로 API 라우트에서 `invalidateRedirectsCache()` 호출은 효과 없음.
- **locale silent 폴백**: `normalizeLocale`의 의도된 패턴. 400 전환 시 기존 클라이언트 파손 위험.
- **a11y strong 색 대비 (QA 문서 잔여 항목)**: 현 빌드에서 axe 재현 불가 —
  6/10 운영데이터 정리(헤더/푸터 데모 정크 제거)로 이미 해소된 스테일 항목으로 판단.
- **통계 카드 모노 숫자 폰트**: `--font-mono`가 .stat-number/.counter/.year/.phone-number에
  일관 적용된 디자인 시스템 — 결함 아님.
- **풀페이지 스크린샷의 홈/지도 백지**: 스크롤 리빌 + lazy iframe 캡처 아티팩트 (위 수정 1과 별개).

## 관찰 (수정 안 함, 판단 필요)
- 프로모 팝업("2026년 기념 리뷰 이벤트")이 진입 즉시 전 페이지 차단 + AI 상담 위젯이
  모든 페이지에서 기본 펼침 — 둘 다 콘텐츠/설정 영역이라 제품 결정 사항.
- site.json에 slug `contact`가 두 페이지(page-1779434820410-9, page-1780212875241-4)에 중복 —
  빌더 published 라우팅 전환 시 모호성 유발 가능. (현재 공개 /contact는 레거시가 우선 서빙 중이라 무해)
- 빌더 published 페이지 문서의 text 노드 props가 null (콘텐츠는 별도 표면에 있는 듯) — 추적 안 함.

## 게이트 상태 (이 세션 변경 반영 후)
- typecheck ✅ / eslint(변경 파일) ✅ / vitest 전체 3492 ✅ / security:builder-routes 250 guarded ✅
- Playwright는 병행 세션 소유라 실행 안 함. **리빌드 필요**: 위 수정은 .next-build에 미반영.
