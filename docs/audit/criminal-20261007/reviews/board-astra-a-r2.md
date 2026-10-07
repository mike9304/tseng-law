# 형사 게시판·서비스 독립 검수 A / r2

검수일: 2026-10-07. 검수자: GPT-6 Astra, AI 독립 검수. 판정: APPROVE.

작업트리: `/Users/son7/Projects/tseng-law-criminal-20261007`.
통합 기준 HEAD: `f1c13d5c458f3d4e5bbee7772fe98dc8a346b749`.
다른 검수자 보고서를 읽거나 의견을 교환하지 않았다. 원고·코드·테스트를 수정하지 않았다.

## r1 지적 해소

| r1 항목 | 확인한 수정 | 결과 |
|---|---|---|
| B-A1 / CMS에서 공개 slug를 바꾸면 형사 보정 누락 | LocalizedServiceCopy와 ServiceDetailRecord가 sourceSlug를 보존한다. getServiceRecord가 sourceSlug를 전달한다. 옛 문구 보정, 게시판 링크, 변호사 검토 문구 제외가 모두 `sourceSlug ?? slug`로 형사 여부를 판단한다. | 해소 |
| B-A2 / 옛 일본어 본문을 강제하는 4개 테스트 실패 | 절차별 기한·적용 범위·원 검사 경유·압수물의 보관 필요성과 별도 임시 반환 요건을 검증하도록 교체됐다. 임의의 120자 하한은 제거했고, 일본어·잘못된 보편적 처벌/기한 금지·조회 안전성 검사는 남아 있다. | 해소 |

변경 slug를 가진 ko/zh-hant/en 레코드에 정확히 일치하는 예전 기본 keyPoints와 custom 항목을 함께 넣는 테스트가 통과한다. 옛 기본 문구는 보정되며 custom 문구/칼럼은 유지된다. 형사 여부의 UI 조건도 같은 안정적인 sourceSlug를 사용함을 소스로 확인했다. 일본어 서비스 실제 SSR 테스트는 네 로컬 칼럼, 게시판 링크, 변호사 검토 주장 제외를 확인한다.

## 검증 결과

최신 main 통합 뒤 다음 명령을 직접 실행했다.

```text
/Users/son7/.nvm/versions/node/v24.14.1/bin/node node_modules/vitest/vitest.mjs run \
  src/lib/__tests__/criminal-litigation-board.test.tsx \
  src/data/__tests__/service-details-ja-criminal.test.ts \
  src/lib/services/__tests__/international-public-copy.test.ts \
  'src/app/[locale]/services/[slug]/__tests__/ja-criminal-page.test.tsx'
```

4개 테스트 파일 / 21개 테스트 모두 통과했다. 게시판 테스트는 다섯 언어의 로컬 네 칼럼, canonical·다섯 언어와 x-default, 서비스 링크, vi 실제 라우팅, 내부 글·중복 제외를 포함한다.

r1에서 직접 확인한 경로·언어 전환·사이트맵·기존 서비스 보정·헤더 등 나머지 8개 관련 테스트 파일 579개도 통과한 상태였다. 통합 전 기준 c7a99a446과 최신 HEAD 사이의 검수 대상 게시판·서비스·라우팅·헤더 소스 변경을 확인했으며, 이 범위에는 upstream 차이가 없었다. 이번 r2는 수정한 네 테스트 파일을 다시 실행했다.

새 테스트 기대값 조정과 문서 등록 변경도 읽었다. 칼럼 수 증가, 네 형사 칼럼의 발행일, sitemap의 게시판 다섯 URL 증가, 실제 로컬 칼럼을 기준으로 한 llms.txt 수량 확인은 새 콘텐츠에 맞춘 변경이다.

새 게시판 공개 문구와 서비스 법률 요약에 r1 이후 새 법률 변경은 없다. r1에서 공식 조문과 대조한 적용 범위와 조건을 유지한다. 새 보완 수정 때문에 필요한 공개 문구·번역·메타데이터·접근성 구조의 추가 반려 사항은 찾지 못했다.

이 판정은 독립 코드 검토와 명시한 단위/SSR 검사에 대한 것이다. 전체 npm run qa, 실제 브라우저에서의 대비·모바일 헤더·키보드 조작, 배포 성공을 내가 완료했다는 뜻은 아니다. 해당 실행은 주 작업자의 최종 검증 기록으로 확인해야 한다.

내용 20편의 별도 APPROVE와 전체 SHA는 [final-astra-a-r2.md](./final-astra-a-r2.md)에 기록했다. 최신 main 통합 뒤에도 20개 모두 manifest 및 보고서와 다시 일치함을 확인했다.

## 검수 버전의 SHA256

작업트리 기준 상대 경로이며, 게시판·서비스 핵심 소스와 수정된 회귀 테스트의 파일 지문이다.

```json
{
  "src/lib/criminal-litigation-board.ts": "933a54c9f7195b78e4bccdf6a1367b6222d10bf1bb11da2a049b541e60271f3c",
  "src/components/CriminalBoardLink.tsx": "cc70b47b06c7eb2eead6f606b44f47bffb51235c9a53d6eb21a2bc540a6b437f",
  "src/app/[locale]/criminal-litigation/page.tsx": "cf1d88b68315b88c23221637e130928baccc5616aa15ae224823419594bac850",
  "src/data/criminal-service-copy.ts": "1c45fdb1f32c670848bd813f375f5c0e746bfdeb179b0453202e3d34e92aae58",
  "src/lib/services/international-public-copy.ts": "d302008663a8dd01f1116bf51865e1a32e7d6fedf094952ea1109f38e6a3b37e",
  "src/app/[locale]/services/[slug]/page.tsx": "0ffe856846362b1a02bfa0a44ae36e1fbfc908da28283f2302fa389879863a70",
  "src/data/service-details.ts": "34e71027ca87c7eb73cccbef0355fc1e9f25fb28af1a451ccb88238e3d641bf2",
  "src/data/service-details-ja.ts": "e690967462050e58220e11374fd671f7cdab7407247a7fcaed370445276ea5ed",
  "src/app/[locale]/columns/page.tsx": "3f9ec7d08deab0298f03f3aaa7fa705938acd291277722fef6372a8751e93ff9",
  "src/app/[locale]/columns/JaColumnsView.tsx": "7ade70688efb9e1bf64878198ce3748dbcc0b318941129459a201c1c6ca9bdcf",
  "src/components/Header.tsx": "717e042858e26412797cac8e55677c4bc5eae1c5bf621b20feed0021a6a453d8",
  "src/components/GuidancePageBody.tsx": "971c816666a5aac25d954fe2a70c874ef64657f4747ab7cf6d203f9ee732a8ec",
  "src/lib/public-guidance.ts": "c00a193d0dd583145e544a2cc505efad75a4379f5c334a811655a689d6df8d85",
  "src/lib/public-route-policy.ts": "7a71128c423d76057bd50e791189533ab96789594aef994f4346f4ead2c6607c",
  "src/lib/builder/site/public-route-ownership.ts": "493dad5189d46b8c956c51c8552e45f10284d84fb766677906501ec109aeb7f4",
  "src/app/sitemap.ts": "9ec47d13315dac1d7a84b2214b8760ce87b398f30b2a532fd09e868eb48207e5",
  "src/lib/__tests__/criminal-litigation-board.test.tsx": "93d62f1bdf206a8d6ca655ce57db660ae878e35ee16b74b3ba95f59665a69b9f",
  "src/data/__tests__/service-details-ja-criminal.test.ts": "0b179bca9cadfa918cdf7efbf73764227e89a444b2faad80a04af016c82572cf",
  "src/app/[locale]/services/[slug]/__tests__/ja-criminal-page.test.tsx": "244a07c32554fe58cf6407cf8db4fc8df851f7279b73daf7c8ed9ff7eea0ef53"
}
```
