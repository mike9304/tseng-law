# B4 초기 미디어 용량 증가 원인

2026-10-26 KST, column_deploy 읽기 전용 조사. Root가 보존한 `R/out-all-locales-batch04-release26-with-local-media`와 B3 최종 산출물, 실제 build/assemble/packer 코드를 대조했다. 원본 삭제, 미디어 업로드, 인프라 변경은 하지 않았다.

원인: B4 최초 build 명령에서 기존 `--media-origin=https://media.tseng-law.com` 옵션이 빠졌다. 새 영상이 추가되거나 패키저 정책이 바뀐 것이 아니다. B3 커밋 `3b4cc3f4793e1b3593c9621cc8733019a8078e5d`와 B4 커밋 `42f2d1e2c92b871f91a5e03b57300ea85f387852` 사이의 `public/` 및 `scripts/static-site/` git diff는 비어 있다.

| 읽은 산출물 | 파일 수 | 바이트 |
|---|---:|---:|
| B3 release26 | 5,347 | 463,006,310 |
| B4 최초, 미디어 로컬 포함 | 7,510 | 3,576,761,792 |
| 기존 assemble 미디어 분리 조건에 해당하는 B4 파일 | 2,146 | 3,108,691,513 |

해당 미디어 2,146개는 모두 B3 산출물에 없으며, B4 보존본과 현행 `public/` 원본의 크기와 SHA-256이 파일별로 정확히 같다. B3 `static-build-release26.log`에는 이미 `media: 2146 files (2964.7 MB) → https://media.tseng-law.com; 1334 referenced, missing locally: none`이 기록돼 있다. B4에서 새로 만든 영화로 판단할 근거가 없다.

`assemble.mjs`는 먼저 `public/`을 복사한다. media origin을 받았을 때 기존 `moveMediaToOrigin()`이 HTML/JS/CSS의 영상·이미지 URL과 CSP를 기존 origin에 맞추고, `videos/` 및 `images/`의 파일을 로컬 산출물에서 분리한다. `images/brand/`는 로컬에 남긴다. 이는 문서 `docs/static-site/README.md`의 기존 자동 배포 명령에 있는 과정이다. 조사는 이 코드를 읽었으며 해당 변경 동작을 직접 실행하지 않았다.

`sites-pack.mjs`에는 일반 영상·이미지 제외 규칙이 없다. `.static-site-out`, `_redirects`, `_headers`, `.DS_Store`, AppleDouble `._` 파일을 건너뛰고, HTML은 gzip-9로 저장하며 나머지 자산은 그대로 복사한다. B4 최초 산출물에 원래 규칙을 적용하면 HTML을 빼고도 자산 3,196,351,689B를 저장해야 한다. 이는 256MiB 한도보다 최소 2,927,916,233B 많으며, HTML gzip과 Worker를 더하기 전의 하한이다.

따라서 보존본으로 중복 3GB 패키지를 만들거나 임의로 영상을 제외하지 않았다. Root는 같은 성공한 컴파일에 기존 `--skip-build --media-origin=https://media.tseng-law.com`을 적용해 재수집을 수행한다. 수정 산출물은 완료 통보 후 새로 해시를 고정하고 ARC 62개·별도 ZH 메타데이터 3개·RTL·원래 packer로 검증한다. 그 결과는 이 원인 조사와 구분한다.

증거: `media-build-diagnosis.json` SHA `5365824436dcb5ac8ffcf73d8cf31676fd5b9f41289c0413b340b11fefa3865b`. 미디어 전수 SHA, B3/B4 추가·삭제 파일 목록, 원 코드·명령·로그 SHA와 재현 스크립트 `../verification/media-build-diagnosis.py`를 보존했다.
