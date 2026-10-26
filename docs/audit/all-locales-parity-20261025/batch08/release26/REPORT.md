B8 로컬 전체 빌드와 QA를 통과했다. 실제 검사한 커밋은 `2beb91021d8a34cb91971973611c0c817b6ee06d`이며, 검증 종료 때도 HEAD와 원고·산출물 해시는 같고 R은 clean이었다. 검증자가 원고·runtime·배포 코드를 바꾸거나 commit/push/deploy하지 않았다.

| 실제 확인 범위 | 결과 |
| --- | --- |
| Node24 full build | exit0, 145.21초, crawl2986 |
| 정적 산출물 | 5,547파일 /489,977,172B /3,178HTML |
| 사이트맵 | 2,981/2,981, 깨진 참조·누락·oversize·Flight 오류0 |
| 사례 칼럼 | 132/132; 각 사례22언어 |
| ARC 칼럼 | 147/147; 각 주제49언어 |
| 본문·FAQ·링크 | 순서 있는 본문 블록9,702개, FAQ815개, 원문 링크 쌍6,914개 |
| 신규42편 브라우저 | desktop42 +mobile42 +slow7 +no-JS7 +home/legacy6 =104/104 |
| 변경·회귀 브라우저 | FI704/706·IS704 양 화면6 +FA915/919 양 화면4 +HE706 mobile1 =11/11 |
| 기본 패키지 | 172,876,306B /164.867693MiB, 256MiB까지91.132307MiB 여유 |
| 패키지 무결성 | HTML gzip3,178개 복원 +기타 자산2,366개 바이트 동일,5,548파일 전체 해시 |

빌드 명령은 다음과 같다. 기존 media origin 옵션을 유지했고 `--skip-build`는 사용하지 않았다.

```text
node scripts/static-site/build.mjs --out=out-all-locales-batch08-release26 --port=4642 --media-origin=https://media.tseng-law.com
```

`--data`를 생략한 local fallback 모드다. Air의 고정 prod-mirror 재현이나 공개 배포 확인을 뜻하지 않는다. 미디어2,164개는 기존 origin으로 분리됐으며 참조1,346개의 로컬 원본 누락은0이다. full-build 로그의 기존 CSS autoprefixer 경고는 보존했다.

279개 기사마다 자기 원문의 title/summary/FAQ, 순서 있는 본문, 표 개수, 링크 href·표시문구, hero/alt/caption, Article 날짜·언어, canonical/HTML·footer·sitemap 다국어 연결을 대조했다. 기존 contact-mail 렌더러가 원문 mailto에 같은 수신자·fragment를 유지하며 subject/body만 추가하는 경우를 명시적으로 허용했고, 다른 링크는 원문과 일치해야 한다. 법적 출처 내용의 재감수나 외부기관 사이트 전체 재접속을 수행한 것은 아니다.

실제 격리 Chromium에서 최초104건과 추가11건 모두 exit0이었다. console/page/asset/RSC 오류0이다. JavaScript를 끈7사례의 알려진 스크립트 preload 차단7개는 원기록에 따로 남아 있으며 일반 요청 실패로 감추지 않았다. 폰트와 메뉴 폰트가 안정된 뒤 실제 문서 이동을 확인했다. 표 수는 원문 AST 기준이고 DOM·CSS·bidi 제어문자를 주입하지 않았다.

FA915와919는 390/1440px 각각 원래 숫자 `۸۵-۱`/`۲۲-۲`를 감싼 실제 `bdi dir=ltr` 두 곳을 확인했다. 혼합 문자 좌표는 모두 한 줄의 LTR 순서였다. HE706 모바일 표의 `23-1`도 쪼개지지 않았다. 대표 화면8개를 직접 열어 확인했고, 모든 페이지의 모든 화면을 시각 검수했다고 확장하지 않는다. 기존 표 스크롤 안내 등 공통 UI의 전면 현지화도 이 검증의 주장이 아니다.

대표 화면은 [FI desktop](checks/browser-screenshots/desktop-fi-915-body.png), [KM mobile](checks/browser-screenshots/mobile-km-920-body.png), [IS mobile](checks/browser-screenshots/mobile-is-919-body.png), [MN mobile](checks/browser-screenshots/mobile-mn-915-body.png), [FA mobile 표](checks/browser-screenshots/mobile-fa-915-rtl-table.png), [HE706 mobile 표](checks/browser-screenshots/mobile-he-706-rtl-table.png)다.

B7 대비 Markdown 변화는 신규42개와 승인된 기존 ARC3개뿐이었다. 총2,412개 원고, 선택한42개 staging본과3개 repair본, 정본6개, 전체 산출물의 검사 전후 바이트가 같았다. 이전 B7/B6 산출물과 증거는 쓰기 대상으로 삼지 않았고 불필요한 전수 재검사를 반복하지 않았다. 기존 기본 packer/Worker 해시도 B7와 같으며 capacity 후보는 포함하지 않았다.

- 원고 트리: `4ec18bbfa87f43adb2dbb0fb72f01a3e86afc130d08ee3f900873ed0e61ff0fb`
- 산출물 트리: `c37aac4ffaa638e99fd8731b38d666a9e01241cf923b5c44c32279b76fd1efba`
- 패키지 트리: `1835931c27a7a2723a830c093e8da91ef6eb25ce3499e0e46af2b4b8304af592`
- [기계 판정·원증거 SHA](checks/FINAL.json), [검사 전후 스냅샷](checks/snapshot-after.json), [패키지 전수 목록](checks/pack-manifest.json)

이 결과는 root 검토용 로컬 배포 준비 증거다. B8 main push·Air 게시·공개 검증은 포함하지 않는다. 별도 B7 공개 관측은 live-batch07에 보존 중이다. 전체49×286 완료, 목표 전체 용량 입증, 사람 원어민 또는 변호사 승인을 주장하지 않는다.
