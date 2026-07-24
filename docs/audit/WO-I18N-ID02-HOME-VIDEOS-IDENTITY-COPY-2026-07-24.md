# WO-I18N-ID02 — 홈·영상 공개 화면의 변호사 이름 정합성

## 선행 조건

`WO-I18N-ID01`에서 canonical profile/team 이름과 공식 사진이 교정되었다.

## 문제 증거

2026-07-24 로컬 `/ja/videos` 브라우저 검수에서 공식 사진과 동적 profile row는 `曾雋崴`로 바뀌었지만, 페이지 제목·미디어 허브 제목·설명·버튼은 여전히 `曾俊瑋`를 표시해 같은 화면에 두 이름이 혼재했다.

스크린샷: `/tmp/tseng-id01-official-profile.png`

## 목표

홈과 영상 공개 화면 및 해당 metadata에 하드코딩된 잘못된 한자 `曾俊瑋`를 공식 이름 `曾雋崴`로 교정한다. 이름 외 문장, URL, 레이아웃, 로직은 변경하지 않는다.

## 허용 파일

- `src/data/site-content.ts`
- `src/data/page-copy.ts`
- `src/components/HomeAttorneySplit.tsx`
- `src/components/AttorneyMediaHubView.tsx`
- `src/app/[locale]/videos/page.tsx`
- `src/components/__tests__/ja-videos-components.test.tsx`
- `src/app/[locale]/videos/__tests__/page.test.tsx`

그 외 파일은 읽기만 허용하며 수정하지 않는다.

## 정확한 변경 계약

- 위 5개 제품 파일에서 `曾俊瑋`를 `曾雋崴`로 교정한다.
- JA 표기:
  - `曾雋崴弁護士`
  - 기존 문장 조사·구두점·용어는 그대로 유지한다.
- ZH-Hant 표기:
  - `曾雋崴律師`
  - 기존 문장과 keyword spacing은 그대로 유지한다.
- KO `증준외`, EN `Wei Tseng` 문구는 byte-for-byte 유지한다.
- 영상 페이지의 JA/ZH-Hant metadata keywords도 공식 이름으로 교정한다.

## 테스트 계약

기존 두 테스트를 갱신하고 다음을 검증한다.

1. JA media hub와 video body가 `曾雋崴弁護士`를 표시한다.
2. ZH-Hant media hub가 `曾雋崴律師`를 표시한다.
3. `siteContent`, `pageCopy`, media hub/home copy, videos metadata의 허용된 공개 범위에 `曾俊瑋`가 남아 있지 않다.
4. KO/EN 대표 title은 기존 기대값을 유지한다.
5. JA videos Person JSON-LD 기대값은 `曾雋崴弁護士`다.

## 불변 조건

- canonical profile/team 원장과 공식 사진은 이 워크오더에서 수정하지 않는다.
- 칼럼 markdown, 기타 랜딩 페이지, builder seed, embeddings, 과거 audit 문서는 건드리지 않는다.
- 이름 외 번역 개선을 함께 하지 않는다.
- stage, commit, push, deploy, 서버 시작·종료를 하지 않는다.

## 검증

```bash
npx vitest run \
  src/components/__tests__/ja-videos-components.test.tsx \
  src/app/[locale]/videos/__tests__/page.test.tsx \
  src/data/__tests__/ja-videos-copy.test.ts
npm run typecheck
npx eslint \
  src/data/site-content.ts \
  src/data/page-copy.ts \
  src/components/HomeAttorneySplit.tsx \
  src/components/AttorneyMediaHubView.tsx \
  src/app/[locale]/videos/page.tsx \
  src/components/__tests__/ja-videos-components.test.tsx \
  src/app/[locale]/videos/__tests__/page.test.tsx
git diff --check
git status --short
```

명령별 결과와 실제 변경 파일을 그대로 보고한다. 허용 범위 밖 변경을 발견하면 즉시 중단하고 보고한다.
