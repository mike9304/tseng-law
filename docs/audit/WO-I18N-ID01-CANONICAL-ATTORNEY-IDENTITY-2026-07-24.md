# WO-I18N-ID01 — 대표 변호사 공식 신원 원장과 사진 교정

## 우선순위

P0. 이후의 일본어 변호사 소개·영상 페이지와 4개 언어 SEO 검수보다 먼저 완료한다.

## 공식 근거

- 昊鼎國際法律事務所 공식 프로필: `https://www.hoveringlaw.com.tw/zh/wei.html`
  - 공식 한자명: `曾雋崴`
  - 공식 프로필 사진 원본: `https://www.hoveringlaw.com.tw/images/p12.png`
- 개인 공식 프로필: `https://www.wei-wei-lawyer.com/lawyertseng`
  - 한국어 이름: `증준외`
  - 한자명: `曾雋崴`
  - 영문명은 기존 공개 표기 `Wei Tseng`을 유지한다.

2026-07-24에 위 두 공식 페이지를 직접 확인했다.

관리자가 내려받아 육안 확인한 공식 사진 파일:

- 입력: `/tmp/official-tseng-p12.png`
- PNG, 309 × 459
- SHA-256: `51101195cf46edf4292c61651a52b5d549aa45f8198e1c198012a51d87a8d568`

## 목표

1. 대표 변호사의 canonical profile과 team 원장에서 잘못된 한자 `曾俊瑋`를 공식 이름 `曾雋崴`로 교정한다.
2. KO 이름 `증준외`, EN 이름 `Wei Tseng`, slug `wei-tseng`은 유지한다.
3. JA 이름은 `曾雋崴弁護士`, ZH-Hant 이름은 `曾雋崴律師`로 표기한다.
4. 현재 비공식 인물 사진 대신 공식 사무소 사진을 새 canonical asset으로 연결한다.
5. 공식 개인 프로필 URL은 redirect 전 주소 `/about-8` 대신 현재 canonical `/lawyertseng`를 사용한다.
6. 공식 자료상 여성 변호사이므로 영문 profile에 남아 있는 `He`/`His`를 `She`/`Her`로 교정한다.

## 허용 파일

- `src/data/attorney-profiles.ts`
- `src/data/team-members.ts`
- `public/images/team/wei-tseng-official.png` (신규, `/tmp/official-tseng-p12.png`의 byte-for-byte 복사)
- `src/data/__tests__/attorney-profiles-ja.test.ts`
- `src/data/__tests__/canonical-attorney-identity.test.ts` (신규)

그 외 파일은 읽기만 허용하며 수정하지 않는다.

## 정확한 구현 계약

### attorney profiles

- KO alternate name의 잘못된 한자도 `曾雋崴`로 교정한다.
- ZH-Hant profile의 `name`, `alternateNames`, `title`, `description`, summaries, keywords, search terms, FAQ 등 모든 canonical profile 필드에서 잘못된 한자를 교정한다.
- EN profile의 alternate name을 `曾雋崴`로 교정하고, 사람을 지칭하는 `He`/`His`를 `She`/`Her`로 교정한다.
- JA profile의 `name`, `alternateNames`, `title`, `description`, summaries, keywords, search terms, FAQ 등 모든 canonical profile 필드에서 잘못된 한자를 교정한다.
- 4개 locale의 `image`를 `/images/team/wei-tseng-official.png`로 통일한다.
- `commonSameAs`와 4개 locale의 개인 프로필 link를 `https://www.wei-wei-lawyer.com/lawyertseng`로 교정한다.

### team data

- 내부 ID `tseng-junwei`와 `profileSlug: wei-tseng`은 호환성 때문에 유지한다.
- ZH-Hant 표시명만 `曾雋崴`로 교정한다.
- KO/EN 표시명은 각각 `증준외`, `Wei Tseng`으로 유지한다.
- KO/ZH-Hant/EN 대표 변호사 사진을 `/images/team/wei-tseng-official.png`로 통일한다.
- KO/ZH-Hant/EN 대표 변호사 source URL을 `https://www.wei-wei-lawyer.com/lawyertseng`로 통일한다.

### image

- `/tmp/official-tseng-p12.png`를 `public/images/team/wei-tseng-official.png`에 byte-for-byte 복사한다.
- 기존 `public/images/team/tseng-junwei.png`는 이 워크오더에서 삭제하지 않는다. 참조가 모두 사라진 후 별도 정리한다.

## 테스트 요구

신규 canonical identity 테스트는 최소 다음을 검증한다.

1. KO/ZH-Hant/EN/JA canonical profile 이름과 alternate name이 공식 계약을 따른다.
2. serialized `attorneyProfiles`에 잘못된 한자 `曾俊瑋`가 없다.
3. EN canonical profile에 독립 단어 `He`, `His`, `Him`이 없다.
4. 4개 profile과 3개 team record가 새 공식 이미지 경로를 사용한다.
5. canonical profile/team 개인 URL이 `/lawyertseng`를 사용하고 `/about-8`을 사용하지 않는다.
6. 새 PNG의 SHA-256이 위 공식 파일 hash와 일치한다.
7. 내부 team ID와 public profile slug는 그대로 유지된다.

기존 JA profile 테스트의 공식 이름 기대값도 함께 갱신한다.

## 불변 조건

- 학력, 경력, 업무분야, 대표 사례, 연락처, 내부 링크, slug, team ID는 변경하지 않는다.
- 공개 UI에 하드코딩된 잘못된 이름, 칼럼 원문, builder seed, embedding은 이 워크오더에서 건드리지 않는다. 후속 ID02/ID03에서 처리한다.
- 과거 `docs/audit` 문서는 수정하지 않는다.
- stage, commit, push, deploy, 서버 시작·종료를 하지 않는다.

## 검증

```bash
npx vitest run \
  src/data/__tests__/canonical-attorney-identity.test.ts \
  src/data/__tests__/attorney-profiles-ja.test.ts \
  src/data/__tests__/site-remediation-content.test.ts
npm run typecheck
npx eslint \
  src/data/attorney-profiles.ts \
  src/data/team-members.ts \
  src/data/__tests__/attorney-profiles-ja.test.ts \
  src/data/__tests__/canonical-attorney-identity.test.ts
git diff --check
git status --short
```

명령별 결과와 실제 변경 파일을 그대로 보고한다. 허용 파일 밖 변경을 발견하면 즉시 중단하고 보고한다.
