# B4 release26 날짜 변경 독립 확인

검수자: `column_deploy` AI. 실제 실행: `2026-10-26T00:51:31.565065+09:00`.

판정: 21/21 일치, 오류 0. 보존 원본과 현재 staging·R를 직접 읽어 비교했다. HE706의 별도 URL 정규화를 먼저 역복원하고 날짜 세 줄을 되돌리면 각 최종 독립 검수 당시의 원본 SHA가 정확히 복원된다. 원고·기존 검수 보고서·보존 원본은 수정하지 않았다.

1단계는 front matter의 `published`, `lastmod`, `date_display` 세 줄에서 2026-10-25를 2026-10-26으로 바꾼 것이다. 각 파일의 실제 줄별 차이를 먼저 구한 뒤 허용된 키·값과 대조했다. 이 날짜 단계에서 본문 및 나머지 front matter 전체는 바이트 단위로 동일하다. FAQ·제목·요약·수치·법적 조건·이미지·캡션은 최종 원고에서도 그대로다. 실제 최초 발행일 조정이며, 본문의 24–25일 출처 확인을 26일 재조사로 바꾸지 않았다.

2단계는 HE706의 공식 제34조 URL 두 곳에서 `?flno=34&pcode=D0080132`를 `?pcode=D0080132&flno=34`로 순서만 맞춘 것이다. URL의 scheme·host·path·query key/value·fragment를 독립 파싱해 모두 같음을 확인했다. 최종 원고의 새 URL 두 곳을 역치환하면 날짜-only HE706 SHA `31299ddbd5d1c594ec5ac6198f7a5893013022b1ee86a156e0237e5bf598194a`가 정확히 복원된다. 이 두 주소 외의 바이트 변경은 없다. 최종 HE706 SHA는 `d405faa17ee7ce3fd11adaf843be8b0c7a9bb6ef474d33244b1e4ee945d2f802`다.

각 보존 원본의 해시가 root 날짜 변경표의 before 값과 같고, 그 값이 해당 최종 독립 보고서 본문에 실제 존재함을 확인했다. 독립 보고서 자체의 해시도 고정값과 같다. 날짜-only SHA는 보존된 중간 manifest·변경표 after 값과 일치하며, 최종 staging·R·현재 manifest가 일치한다. 이는 변경 범위와 검수본 연결 확인이며, 이번 작업자가 다른 여섯 언어의 법률·원어 전체 검수를 새로 수행했다는 뜻은 아니다.

최초 실행은 manifest가 정규화 중 갱신돼 예전 SHA 고정 확인에서 exit 1로 멈췄다. 원고 비교를 시작하기 전의 중단이며 `checks/date-change-initial.log`와 `verification/date-change-proof-initial.py`에 보존했다. 새 최종 SHA를 조용히 받아들이는 대신 두 단계의 근거를 명시적으로 추가한 뒤 독립 검사 전체를 다시 실행했다.

## 고정 근거

- root 변경표: `checks/release26-delta.json` — `dc40a62a90f17addec1dcea846022777e95f4c61cf845112e4eb1ddca76fbb47`
- root 중간 manifest: `checks/release26-manifest-date-only.json` — `30b1ce64d193723052e52c113e9978a7ebc9730b2ae6cd853310ed2d78bdd8d1`
- root 최종 manifest: `checks/release26-manifest.json` — `a2f28d027520d79de726c107f146ad8cd05e2ef8c36aaa6d1cc56debb5f2a27a`
- root URL 정규화: `checks/he-source-url-normalization.json` — `197548991e76fd9f0529c3791719284137618d91ce5d48c34e3ef2be3398a601`
- 독립 실행 결과: `release26/checks/date-change-review.json` — `6ba701e23fb8dd15810b9524356d67991926bc2642451acd6eb7f762b2cb8992`
- 재현 스크립트: `release26/verification/date-change-proof.py` (증거 파일이 있으면 덮어쓰기를 거부한다).

## 현지 표시 날짜

| 언어 | 이전 | 현재 |
|---|---|---|
| he | 25 באוקטובר 2026 | 26 באוקטובר 2026 |
| bn | 25 অক্টোবর 2026 | 26 অক্টোবর 2026 |
| ur | 25 اکتوبر 2026 | 26 اکتوبر 2026 |
| fa | 25 اکتبر 2026 | 26 اکتبر 2026 |
| my | 2026 ခုနှစ် အောက်တိုဘာ 25 ရက် | 2026 ခုနှစ် အောက်တိုဘာ 26 ရက် |
| ta | 25 அக்டோபர் 2026 | 26 அக்டோபர் 2026 |
| ne | 25 अक्टोबर 2026 | 26 अक्टोबर 2026 |

## 21편의 검수본 연결

| 원고 | 보존 원본 = 역복원 SHA-256 | 현재 staging = R = manifest SHA-256 |
|---|---|---|
| bn 704 | `aff6f713a8777c487cc8e93b4d94af6b4e7c31620e71f662e0121aad9b2d1d5e` | `3bb9fb746cfd2d8bed5e2ef160ecdecf81a959d1d2b55464604a708d8e0782c5` |
| bn 705 | `422be21102c3ca5026d12b27235efbb389d538b43f510eaa9067fe9e7de3eec3` | `a97cacf663e16351a351cdce9fb7d4013ebf2b98ceb16ca559f4ac3ad9d4d2cd` |
| bn 706 | `9632066984317dde87330996651839e7dd2564ee13b9d507b581f6b3e2ddb685` | `4250564b6c98cbcf7a1ae3778b13c817f416c8991cf5ad3fbbb3dfebbfd0e6dc` |
| fa 704 | `19ff8e7f6ac668c9aba8de35e19209d6d1fc0162b5ffc74ed9818690e812491e` | `fe975485d8a8fed7bd467c42860c4d29ad575a2d2a981ce3d3fc7e63113509a3` |
| fa 705 | `5d391fbbdfd0abfab8dbd2a1a076c04fb8a7d737ee3fa9c544711c23f24507f7` | `1c96fab7471e92a166705ec25385ef99980df2237fcc676d294c24efc4c424ab` |
| fa 706 | `4e23c5162d245a912bc6147ae3f50e05a1b066729e50631168b1968698797e21` | `d5e9636efd65707cd86b0e0c24aa700e2d0b1948d6749302e96cd5d81dc9fa77` |
| he 704 | `eb401cf43480269123d91795de21fd48de22e353aac438b1755ceddfd175220f` | `053b4e004dab8579821b95552b731804a6feab7d317c77b1c5a55611c40e16fe` |
| he 705 | `7010616bdd946044f7791e17987ddef10ca5c95b093f42004e7ed4febbf5455c` | `2a9e5b3a802d105b582fd1a579d0a3b8fa8f1b825954c4c56cbfdfe263c08caf` |
| he 706 | `c1430580439966e7c85e23d110e1f152c09db2752d6b0276cab2581843dddea7` | `d405faa17ee7ce3fd11adaf843be8b0c7a9bb6ef474d33244b1e4ee945d2f802` |
| my 704 | `c51dafda1a55c98227987ffd49ac7d07e97bf8af72a5aacbc58e4b447e31af13` | `5dc05c7e2d82c50be381d779bf6c4273e216e4e1564f485ffff7ae2f6131c579` |
| my 705 | `84ff6f5265a571d1ff25ae627d8c816c397b3ada9057082f28d30b64b21b09be` | `567f73364f69d7c2a1b9fba5f92c612a0cb71d952b2454870fdc8f46a0afb6ec` |
| my 706 | `91308d203bfb716ee574c3e16c1b1da27e1a6b3ae6113671a036155ed931888a` | `62197d327d34f575c00853a07609d9aa6b42b6419decb066bc38545e83f40fb4` |
| ne 704 | `21b4819e26d6390871a01e085f3785a102e811feaef93b2f41a7f51a67e18781` | `c54085fe51c726aba838c6f4c16935daa1df73a5a80e834ac5a6ed8c077bdfce` |
| ne 705 | `468bd0d9c56cc8b139a035cb5b8b5259d9aca88b005c82ecaf090955c509427b` | `6910f76946692f0d808e29ccbacd31617e0608e533382697d710c511ddf46b84` |
| ne 706 | `6c53bca6c629daaa8f962de00f75a44d9299e2101384b743572dad237bbd79d5` | `baba14a7e65ff20941900607496fa4bf3e447ade70915cb1bc289bfa81f2f2ce` |
| ta 704 | `a5ae34b980cf3098eafe1bf608fe3d19778fb6a398dbb844c9262b8004f2bb16` | `43281f25b19a64781a4780aaea55de66faf9188507141e04566e20ef064a51c9` |
| ta 705 | `1ad9acf0fabab8205e1373bf0b61b07a14340b937b337bee964bdb1ff2bcb7da` | `ee53660f0cab0a61b271d739f9f9b2d8b0a2f9d95601d2987a78c4b67c8f5758` |
| ta 706 | `a1d3c5176ade7ed841cd5aeee4e588352adf5566d8e90501ebbbe3af02b1e3a2` | `e56fb228bfbba836b2ad8e50879b4ca14c46ea6453feb6405dbe069983c4fe33` |
| ur 704 | `15dff7bda161ff794256f51c006331a5963ba6a1197f26e37712ce5f602de8a9` | `6e92ef71f4728e0194d91c50fb4caa2e2abd191b2bed781deb73453854a5d8e3` |
| ur 705 | `e07a6b499b2e0fd53cfc38234eb9e1f20fa3f9566ef2b102ffad32433e56c58e` | `02a1b2eb83419a9864cfd86cf1ced163ac619cd25922c27e73f978de3b82857c` |
| ur 706 | `8ae69f8dc40663efcaa078d8d88484b4af4517f9ac83deaae189ddca182bbb02` | `51899903b1df3c9dd1a2b94b5e8cbf97cbdc7189e9db35a6624318ab5feb599a` |

종료 시 변경표·manifest·보존 원본·staging·R·기존 독립 보고서의 모든 입력 SHA를 다시 계산해 시작값과 같음을 확인했다. 최종 빌드와 브라우저·RTL·패키지 검증은 root의 빌드 완료 알림 후 별도로 실행한다.
