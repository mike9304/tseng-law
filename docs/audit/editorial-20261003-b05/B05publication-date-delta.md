# B05 게시 예정일 조정 — 독립 delta 검수 요청

root 지시에 따라 B05 7편의 `published`·`lastmod`·`date_display` 세 frontmatter 항목만 2026-10-03에서 2026-10-04로 변경했다. 새 값은 Asia/Taipei 게시 예정일이며 실제 게시 완료를 뜻하지 않는다. root는 대만 시간 `2026-10-04T00:00:00+08:00` 이전에 게시하지 않을 예정이다. 기록 시각 `2026-10-04T00:52:36+09:00` KST / `2026-10-03T23:52:36+08:00` Taipei.

새 원고/evidence SHA에 대한 원 법률·문체 검수자의 독립 delta 승인 대기다. 이 작업은 새로운 법률/문체 승인이나 추가 자료 확인을 주장하지 않는다. 검토서·이미지·B04 product checkout은 변경하지 않았다.

| 언어 | 원고 | 새 전체 원고 SHA-256 | 새 evidence SHA-256 |
|---|---|---|---|
| zh-hant | zh-hant-annual-leave-dates-employer-scheduling-taiwan.md | `20a552849dfdac6059e5421f9da59d73d24e80641a98a95649538eaf944324b8` | `de70adc56afc49c931a417055c75e2e4dfd147b269039a1e4cdfea89a19df143` |
| zh-hant | zh-hant-rental-electricity-average-price-bill-taiwan.md | `8c138752c9cac8efddb137a1a2d3c797219ef518142e114068fe44306a0f2696` | `39fc6a7b2fb01aa1358ca8b12ad63da7fdc38b71f126ce5e06c88cdd41d37270` |
| zh-hant | zh-hant-limited-company-shareholder-books-inspection-taiwan.md | `f090d3efa295ffef10c7e67c526df936d859a2b932612de594518d35b3732519` | `9582fbc251ff2293b35e8f530de3d8a711526d1fba018db9c7f26b8754a41cc5` |
| zh-hant | zh-hant-handwritten-will-typed-print-signature-taiwan.md | `85a70f86d213090db354fd6ddc21d2965c2b6c34df7f99f830178309c41ae2ad` | `dc23dd613fab607cf476931749f4ae3755a9ea64424bf064b222729b40643483` |
| ja | ja-taiwan-hotel-typhoon-cancellation-refund-japanese.md | `3198cd71bceb934cd87721d1272e37899bea058059f5ac9f351851cba75c9934` | `5bfe1afdbc652a11caa6c13d9a7a4b3eaa0aabfc5a33bbe3728a081c578d1cb0` |
| en | en-taiwan-personal-data-access-copy-request.md | `b9eaae0327cd4099ef922df690ae3b8dc42103c4ddabd04ff405b20f6aabc668` | `8e2759d725d1fedde5e844284611a0ecd784980e63fd40f56053a33f384d36f9` |
| ko | ko-taiwan-trademark-nonuse-three-years-korean-brand.md | `5c9b97aa5d6351a0857ac3ea111b28b0edb7a03f4eaffd6feaa74a496b431ef1` | `6b41fc1cd25c23585e56b3e10f2957c5606cccc6d4a237d691c0d70b456b33a5` |

## 변경 범위와 역검증

- `zh-hant-annual-leave-dates-employer-scheduling-taiwan.md`: 행 5, 6, 7, 변경 전 전체 `1604f34edbc7e87dbeaae3138df4496f8292ec907b0e536195227018bc82470f`, 변경 전후 본문 `c6a3b2642a595c7229bd37e5b42e82a608ca1bb77ed38550066710af13ad1c2f`. 세 날짜 값을 역치환하면 변경 전 전체 bytes와 SHA가 복원된다. Evidence의 기존 18506 bytes prefix SHA `ad66f4c2410d022cf52d3f8f25b36a18e71fb4f84744bbc53d5a84e7e704d2aa`를 그대로 보존했다.
- `zh-hant-rental-electricity-average-price-bill-taiwan.md`: 행 5, 6, 7, 변경 전 전체 `b5f2af0ec42bb8a763e636ac3a314147ac1b12644b8cbd0842dd5ba1170bc1df`, 변경 전후 본문 `51563cbc098191263b12580fc5723a99555f19e3e1434f673506d13c5fbc9c87`. 세 날짜 값을 역치환하면 변경 전 전체 bytes와 SHA가 복원된다. Evidence의 기존 20664 bytes prefix SHA `d284b12ef7d8ee900751218248dd891c8ff85205ce95e44355736c5fcd76aebe`를 그대로 보존했다.
- `zh-hant-limited-company-shareholder-books-inspection-taiwan.md`: 행 5, 6, 7, 변경 전 전체 `bebc7a98a30cace2e31ac9508df5f829d3697fea45710fa2d108b1a0bdf26e4d`, 변경 전후 본문 `1cff596a4ab43081a7863a11ae0efd060136ecc569e64e48fcdfd7061a02f82c`. 세 날짜 값을 역치환하면 변경 전 전체 bytes와 SHA가 복원된다. Evidence의 기존 17123 bytes prefix SHA `6c6525ef06780389633f6614cc44ab4b165eff4836f463d13c773fa7c5fa8cfc`를 그대로 보존했다.
- `zh-hant-handwritten-will-typed-print-signature-taiwan.md`: 행 5, 6, 7, 변경 전 전체 `716d115cdfb37120f7ea36e41b53bdc7a2989a83d8c477e51eb5c142f1e72b3c`, 변경 전후 본문 `fd73d243b4fedf4531cbf1452438f4ff2dede885f05264be0fe1b7e7a84cf890`. 세 날짜 값을 역치환하면 변경 전 전체 bytes와 SHA가 복원된다. Evidence의 기존 15711 bytes prefix SHA `fabcbd1369aed3bc5139ac6221a1f653362f7cf893c0651e7a7edf2f779c1d40`를 그대로 보존했다.
- `ja-taiwan-hotel-typhoon-cancellation-refund-japanese.md`: 행 5, 6, 7, 변경 전 전체 `ef885b4d15a7e9e5708d3ccdcb9171aaf69689f1de39095156d356f3072c7c12`, 변경 전후 본문 `f71c98de7df213a10ac48198eeeb8dc3886f66381d04d8f76f32efb8d3955710`. 세 날짜 값을 역치환하면 변경 전 전체 bytes와 SHA가 복원된다. Evidence의 기존 17213 bytes prefix SHA `8f5031ca94ec7c7ee1911f3d0cce92e74b2aa571f00cfa7fcdf1b99343493648`를 그대로 보존했다.
- `en-taiwan-personal-data-access-copy-request.md`: 행 6, 7, 8, 변경 전 전체 `12b95920da8a363e131380e2e1e78cb30bfebdeb3bcb52d9045f597e09d050b9`, 변경 전후 본문 `c5a82c0c924a62e972c5a28dbf58a1c4f2a2cc7b6d827ac52fc0ef4b76891f18`. 세 날짜 값을 역치환하면 변경 전 전체 bytes와 SHA가 복원된다. Evidence의 기존 21012 bytes prefix SHA `4163a4cf2132611d6360ef9238da977e7b88e5fe46f272d2027a1edf34e752db`를 그대로 보존했다.
- `ko-taiwan-trademark-nonuse-three-years-korean-brand.md`: 행 5, 6, 7, 변경 전 전체 `33a642a2ed842fa7f386debc2b507f94eba528ce1859f642f2b75308b8ff6086`, 변경 전후 본문 `3feeb99a783e32670b69f166c480554e613e0325076f3baadbbebd905f4480a9`. 세 날짜 값을 역치환하면 변경 전 전체 bytes와 SHA가 복원된다. Evidence의 기존 19190 bytes prefix SHA `f76dc78592e44e286a1a307e5cf1d441dbf67283f0a02c3ca2f8982a07ff975b`를 그대로 보존했다.

본문 SHA 범위는 `bytes.split(b'---', 2)[2]`다. 본문·실제 자료 확인일·출처 공고/시행/사건 날짜·다른 frontmatter·제목·summary·SEO·내부 author·이미지 경로/alt/caption 모두 불변이다. 원고당 변경 행3개, 본문 동일, 그 외 metadata 동일, 역치환 전체 SHA 동일, evidence prefix 동일을 실제 bytes로 assert 확인했다.

## 준비 패킷 보존과 다음 단계

기존 준비 JSON/MD를 `RELEASE-PREPARE.r1.json`/`RELEASE-PREPARE.r1.md`로 exclusive-create 복사했다. 원래 latest 준비파일2개도 그대로 보존했다. JSON SHA `4ffe8fa15873c625b0aafa05f959d13bc1202d5078e56baedc9351f0c23c04db`, MD SHA `7ec8dcb46ee62971b29196cd50149abe5382434148faea125de082ebde4670a4`이며 각 r1 사본과 전체 bytes가 같다. 아직 이전 10월3일 승인/날짜가 담긴 준비 패킷이므로 통합에 사용하면 안 된다.

독립 법률·문체 검토서가 새 전체 SHA를 승인한 뒤 별도 지시에 따라 준비 패킷·날짜 registry 계획을 갱신한다. 기존 준비파일을 새 승인으로 오인하게 덮어쓰지 않았다. 원본 자료 확인일과 미디어 batch 경로는 게시 예정일에 맞춰 변경하지 않는다.

실제 파일 범위18 = 원고7 수정 + evidence7 append-only + 역사 준비사본2 + delta보고2. 변경검증7/7 PASS, review0·media0·productrepo0·latestprep0·테스트0·빌드0·Git쓰기0. 모든 변경 전/후 full/body/evidence SHA, 필드 값, 행 번호와 prefix byte 수는 JSON에 있다. Delta JSON SHA `365c59e3676c7203ec79436ae77dc8e128f12d1cfe1cc5ffceb587f74fde719e`.
