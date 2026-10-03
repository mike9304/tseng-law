# B04 게시 예정일 조정 — 독립 delta 검수 요청

root 지시에 따라 B04 7편의 `published`·`lastmod`·`date_display` 세 frontmatter 항목만 2026-10-03에서 2026-10-04로 변경했다. 실제 발행 기준은 Asia/Taipei이며 B04·B05 공동 발행은 모든 검수·QA 게이트 통과 후 root가 수행한다. 기록 시각 `2026-10-04T01:06:43+09:00` KST / `2026-10-04T00:06:43+08:00` Taipei.

새 전체 원고/evidence SHA에 대한 원 법률·문체 검수자의 독립 delta 승인 대기다. 이 작업은 법률·문체 재승인이나 추가 자료 확인을 주장하지 않는다. 저장소·기존 통합 manifest·test repair·검토서·이미지·원 준비 패킷은 변경하지 않았다.

| 언어 | 원고 | 새 전체 원고 SHA-256 | 새 evidence SHA-256 |
|---|---|---|---|
| zh-hant | zh-hant-home-leak-defect-notice-repair-evidence-taiwan.md | `101a2d561218222b8f7701b048c038dcb8b6e74ac36fb773980fedcd4f33dc80` | `1c1b3b83c9822757f2cafafce2dc5f9b6cdeb89c8b56ad7a662818393c6e8a36` |
| zh-hant | zh-hant-contractor-employee-status-control-work-taiwan.md | `79f88bb0b8f3f76992cd51d1fafc3e240158b4dd2270956c00162bda47fbbc81` | `9d449e3b3dbb0c2dbcb274aa9ad9bc5a2a337b9f3c83cc59b8bd1d7f8a1ef0ac` |
| zh-hant | zh-hant-private-loan-joint-guarantor-first-demand-taiwan.md | `7cb00e2151da58e1098fac5a29fb535db6d45adcfc7a092a7ff4abc7dab7df7e` | `202b13a3cf98d2a0f6a7317dff85e6e6604f4d7f4f87e452062909533bd6edac` |
| zh-hant | zh-hant-parent-home-gift-care-obligation-evidence-taiwan.md | `4cf5fa53e8c0481bf04844ed9ddfcf7455026aad1a4b91a96a9122c2f912b2b2` | `f38a8cae5e9b69bc9d2832cbac6cb24fc532cf8774efb4ebb9dd66d75cc2d6a1` |
| ja | ja-taiwan-hotel-luggage-loss-custody-japanese.md | `f7ca172bf0e6b6c91d0913ac6970b26ac192daacdfdc3fc50544e20947b3f447` | `53016097d62a847bf0214a794826507443d40e550ccec033c97d240010408f16` |
| en | en-taiwan-landlord-entry-rental-home-repairs.md | `68f62599bb6548db73112a6f6a5304d15e596a725f51472fdafe19b6645d078f` | `02cbff5a274907fffa6402eaa5041e1d0040248bae34111c4da2a748a73f7b36` |
| ko | ko-taiwan-unpaid-invoice-settlement-release-korean.md | `ae9fc852f7da4409fe9d7b59d140d4785ac40aa8c91e91258129a8c508f135e2` | `b2182f23a6a2fba69ebaf5d1dcf0399aaa7950ca9391e84c743ca1133f56c36b` |

## 변경 범위와 역검증

- `zh-hant-home-leak-defect-notice-repair-evidence-taiwan.md`: 변경 행 5, 6, 7; 이전 전체 SHA `211230acc5d35e830be4574b7a55fca31043d2d2a648199bab13224100ea7b3e`; 변경 전후 본문 SHA `39d136b370c43fa0783887e5c2a4422130d5be276538792452667250aa62f79d`. 세 필드 역치환 시 이전 전체 bytes/SHA가 복원된다. Evidence 기존 23058 bytes prefix SHA `37effea670492cf343b38a2edd9848f594f57260cfd8193ebd0ac3b01061c29a` 보존.
- `zh-hant-contractor-employee-status-control-work-taiwan.md`: 변경 행 4, 5, 6; 이전 전체 SHA `601a9538e7fd2825ca50d472609d1033de031c0f33e575ab08787947318918f1`; 변경 전후 본문 SHA `c17e95fc7c375a6d62229c8bfe131332ca2e2e68ebe52b47a59c962a5d753677`. 세 필드 역치환 시 이전 전체 bytes/SHA가 복원된다. Evidence 기존 20717 bytes prefix SHA `74cde19227855d42c2991d12aabe1659fe2dc0223e4177484a74b96f7a07805c` 보존.
- `zh-hant-private-loan-joint-guarantor-first-demand-taiwan.md`: 변경 행 5, 6, 7; 이전 전체 SHA `601b32f5b43b2542ad378291f5302866971bcb570733ff6df80d1d0ca45d4180`; 변경 전후 본문 SHA `24aaa004a66e86a55c2827620ca5a04fa9f396ccd00f50f8c80fa67a1bf50202`. 세 필드 역치환 시 이전 전체 bytes/SHA가 복원된다. Evidence 기존 20213 bytes prefix SHA `8b3a189f53970b4eca1a771317d412c0cf6bbef73c13a5b015a5d2f8c0d526ac` 보존.
- `zh-hant-parent-home-gift-care-obligation-evidence-taiwan.md`: 변경 행 5, 6, 7; 이전 전체 SHA `0005830b9498a817704ae7c85b770f5f8aa7fb9f8eed52718537c1b293971941`; 변경 전후 본문 SHA `22a9832eb669a3b07aa77afb6a79276c927d2611586ba592aef3cbcf40d5788e`. 세 필드 역치환 시 이전 전체 bytes/SHA가 복원된다. Evidence 기존 22136 bytes prefix SHA `e95e94431e800a8fa816072fe59acf8e545a4cecee24883c5d4abf0c96c9ab41` 보존.
- `ja-taiwan-hotel-luggage-loss-custody-japanese.md`: 변경 행 5, 6, 7; 이전 전체 SHA `b94444cc0cac1237b94510198862aad5c937ee82147ece2975013856f9904c13`; 변경 전후 본문 SHA `3718397fbce1f0ec17f5cb93131ed85489673a99909a749d06200c62724d9f9c`. 세 필드 역치환 시 이전 전체 bytes/SHA가 복원된다. Evidence 기존 21963 bytes prefix SHA `49025c09ab6b6cd17c2ac52f7126d7f20705c0ff1dbee64a1e5be98fe09f1876` 보존.
- `en-taiwan-landlord-entry-rental-home-repairs.md`: 변경 행 6, 7, 8; 이전 전체 SHA `8073439f8279b4ce9f7ff6205fc19c7231420441d65fed389bdbb15add6b5b46`; 변경 전후 본문 SHA `2df3601635c502686c95184988aa339d8974e811b03692b97d3fd03a333b70f4`. 세 필드 역치환 시 이전 전체 bytes/SHA가 복원된다. Evidence 기존 24348 bytes prefix SHA `f60683d3e4c500689649fb4ee4823984f5f1f666360500da52a50de251a3965e` 보존.
- `ko-taiwan-unpaid-invoice-settlement-release-korean.md`: 변경 행 4, 5, 6; 이전 전체 SHA `1e22e35ae0227cadcb32375007619557329a4f1481d56e86f2f8cc0c3b749e0c`; 변경 전후 본문 SHA `5821b4f2e3e9d2909e1a92c06042bb1b037a56fe25b4c533aecf557d9815ec80`. 세 필드 역치환 시 이전 전체 bytes/SHA가 복원된다. Evidence 기존 22851 bytes prefix SHA `e11f63c987cdfc60de03fdf01deef70cbe10bf160b54a4bb43bf1529d7583c6f` 보존.

본문은 `bytes.split(b'---', 2)[2]`로 계산했다. 본문 전체·source-check/access 날짜·법률 근거 공고/시행/사건 날짜·다른 frontmatter·제목·summary·SEO·내부 author·이미지 경로/alt/caption은 불변이다. 실제 bytes로 원고당 변경 행3개, 본문 동일, 나머지 metadata 동일, 역치환 전체 SHA 동일, evidence 원본 prefix 동일을 assert 확인했다.

## 기존 기록 보존과 다음 단계

원 `RELEASE-PREPARE.json` SHA `7a93e67277dae941b2b335b07fb1a8f614b86b99883b4f7bb82ba886f5b4a5ff`, `RELEASE-PREPARE.md` SHA `092ea2c14c6db1be31dd7e9c2f6a179dde8827e70c78696f2b8cba250bf88e4b`를 그대로 보존했다. 이 기록은 기존 10월3일 원고/날짜의 준비 이력이다. 새 전체 SHA 승인으로 오인하게 덮어쓰거나 최신값으로 표시하지 않았다.

독립 법률·문체 검토서가 새 SHA를 승인한 뒤 root의 별도 신호로 준비/통합 자료 및 날짜 registry를 갱신한다. B04 기존 통합·test repair와 incoming 자료는 이 작업 범위 밖이며 변경하지 않았다. 실제 source-check 날짜를 게시일에 맞추지 않는다.

실제 범위16 = 원고7 수정 + evidence7 append-only + delta보고2. 변경검증7/7 PASS; review0·media0·prepare0·productrepo0·test repair0·테스트0·빌드0·Git쓰기0. 변경 전/후 full/body/evidence SHA, 필드별 값과 행 번호, prefix byte 수는 JSON에 있다. Delta JSON SHA `d2fe3fc72964f4a7d0c2adb6fe91976f23946c6fbf5d88fd087259f7cb509c38`.
