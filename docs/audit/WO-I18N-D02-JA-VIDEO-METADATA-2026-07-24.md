# WO-I18N-D02 — 일본어 영상 채널 메타데이터 번역

## 목표

`/ja/videos`의 채널 카드에 남아 있는 영문 유형 표기만 자연스러운 일본어로 바꾼다. 다른 언어와 다른 일본어 콘텐츠는 변경하지 않는다.

## 근거

`src/data/site-content.ts`의 `siteContent.ja.videos.items`에 다음 영문 문자열이 남아 있다.

- `Blog`
- `Website` (2건)
- `Contact`

## 정확한 변경

- `Blog` → `ブログ`
- `Website` → `ウェブサイト`
- `Contact` → `お問い合わせ`

## 허용 파일

- `src/data/site-content.ts`
- `src/data/__tests__/ja-videos-copy.test.ts` (신규)

그 외 파일은 읽기만 허용하며 수정하지 않는다.

## 불변 조건

- KO, ZH-Hant, EN 데이터는 byte-for-byte 변경하지 않는다.
- JA 영상 제목, 설명, 링크, 이미지, featured 항목은 변경하지 않는다.
- 현재 잘못된 한자 이름 `曾俊瑋`는 이 워크오더에서 수정하지 않는다. 공식 이름 교정은 별도 P0 identity 워크오더에서 처리한다.
- builder/admin/booking 코드는 변경하지 않는다.
- stage, commit, push, deploy, 서버 시작·종료를 하지 않는다.

## 테스트 요구

신규 테스트는 다음을 검증한다.

1. JA channel item duration 배열이 정확히 `['ブログ', 'ウェブサイト', 'ウェブサイト', 'お問い合わせ']`이다.
2. JA video item duration에 `Blog`, `Website`, `Contact`가 남아 있지 않다.
3. EN video item duration은 기존 영문 배열을 유지한다.

## 검증

```bash
npx vitest run src/data/__tests__/ja-videos-copy.test.ts
npm run typecheck
npx eslint src/data/site-content.ts src/data/__tests__/ja-videos-copy.test.ts
git diff --check
git status --short
```

결과는 명령별로 그대로 보고한다. 허용 파일 외 변경을 발견하면 즉시 중단하고 보고한다.
