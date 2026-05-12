# WIX-PARITY-PLAN.md

| ID  | Phase  | 마일스톤                          | W 범위    | 추정 | 의존 | 상태 |
| M00 | Pre    | mergeMissingPages fix             | —         | 1h   | —    | 🟢   |
| M01 | Pre    | Performance 잔여 fix              | —         | 10h  | M00  | 🟢   |
| M02 | Pre    | Hot files split (4파일)           | —         | 14h  | M00  | 🟢   |
| M03 | Pre    | 보안 3건                          | —         | 4h   | M00  | 🟢   |
| M04 | Pre    | AI 검증 인프라 7종                | —         | 6h   | M02  | 🟢   |
| M05 | Pre    | Empty/error state sweep           | —         | 6h   | M02  | 🟢   |
| M06 | Pre    | .next/dev 재시작 의존성 fix       | —         | 3h   | —    | 🟢   |
| M07 | P2     | 모바일 스키마 결정 + 잠금         | —         | 4h   | M00  | 🟢   |
| M08 | P2     | Mobile inspector per-viewport UI  | W31~W38   | 12h  | M07  | 🟢   |
| M09 | P2     | Mobile auto-fit + 자동 변환       | W37,W39   | 8h   | M07  | 🟢   |
| M10 | P2     | Mobile sticky / preview iframe    | W40~W45   | 10h  | M07  | 🟢   |
| M11 | P3a    | Text 위젯 팩                      | W46~W55   | 18h  | M07  | 🟢   |
| M12 | P3b    | Media 위젯 팩                     | W56~W70   | 24h  | M07  | 🟢   |
| M13 | P3c    | Gallery 위젯 팩                   | W71~W78   | 18h  | M11  | 🟢   |
| M14 | P3d    | Layout 위젯 팩                    | W79~W88   | 20h  | M11  | 🟢   |
| M15 | P3e    | Interactive 위젯 팩               | W89~W98   | 18h  | M14  | 🟢   |
| M16 | P3f    | Navigation 위젯 팩                | W99~W105  | 14h  | M11  | 🟢   |
| M17 | P3g    | Social 위젯 팩                    | W106~W113 | 12h  | M11  | 🟢   |
| M18 | P3h    | Maps & Location 팩                | W114~W117 | 8h   | —    | 🟢   |
| M19 | P3i    | Decorative 팩                     | W118~W125 | 14h  | M14  | 🟢   |
| M20 | P3j    | Data Display 팩                   | W126~W135 | 22h  | M14  | 🟢   |
| M21 | P4     | Forms 후반                        | W141~W150 | 30h  | M11  | 🟢   |
| M22 | P5     | Motion 후반                       | W160~W175 | 40h  | M07  | 🟢   |
| M23 | P6     | Design system 마무리              | W184~W185 | 12h  | —    | 🟢   |
| M24 | P7     | SEO + Publish 성숙                | W186~W195 | 24h  | —    | 🟡 자동검증 통과 / W189 후속 분리 |
| M25 | P8     | Bookings 본격 1 (서비스/스태프)   | W196~W202 | 24h  | M21  | 🟡 자동검증 통과 / 사용자 QA 대기 |
| M26 | P8     | Bookings 본격 2 (예약/결제)       | W203~W210 | 28h  | M25  | 🟡 운영 대시보드·고객 링크·calendar pull·Payment Element 자동검증 통과 / provider QA 후속 |
| M27 | P8     | Bookings 본격 3 (다국어/정책)     | W211~W215 | 16h  | M26  | 🟡 W211~W215 자동검증 통과 / 사용자·provider QA 대기 |
| M28 | P9     | 에디터 고도화                     | W216~W225 | 24h  | M02  | 🟡 W216~W225 자동검증 통과 / 사용자 QA 대기 |
| M29 | P2/P7  | Red checkpoint close              | W17,W36,W189 | 8h | M07,M24 | 🟡 W17/W36/W189 자동검증 통과 / 사용자 QA 대기 |
| M30 | QA     | Section template click stability  | W18,W22,W84 | 3h | M28  | 🟡 실제 클릭 자동검증 통과 / 사용자 QA 대기 |
| M31 | P5     | Background parallax runtime       | W161 | 3h | M22 | 🟡 W161 자동검증 통과 / 사용자 QA 대기 |
| M32 | P5     | Elastic easing preset             | W174 | 2h | M22 | 🟡 W174 자동검증 통과 / 사용자 QA 대기 |
| M33 | P6     | Radius/shadow effect presets      | W183 | 3h | M23 | 🟡 W183 자동검증 통과 / 사용자 QA 대기 |
| M34 | P6     | Design token bundle export/import | W181 | 3h | M33 | 🟡 W181 자동검증 통과 / 사용자 QA 대기 |
| M35 | P6     | Custom My Theme save/load         | W178 | 3h | M34 | 🟡 W178 자동검증 통과 / 사용자 QA 대기 |
| M36 | P6     | Brand asset library polish        | W182 | 3h | M35 | 🟡 W182 자동검증 통과 / 사용자 QA 대기 |
| M37 | P6     | Component design presets bulk apply | W179 | 3h | M36 | 🟡 W179 자동검증 통과 / 사용자 QA 대기 |
| M38 | P6     | Typography/source inspector polish | W184~W185 | 2h | M37 | 🟡 W184/W185 자동검증 통과 / 사용자 QA 대기 |
| M39 | P7     | Redirect manager public runtime evidence | W188 | 3h | M24 | 🟡 W188 자동검증 통과 / 사용자 QA 대기 |
| M40 | P7     | Structured data public JSON-LD evidence | W192 | 2h | M24 | 🟡 W192 자동검증 통과 / 사용자 QA 대기 |
| M41 | P7     | Hreflang public metadata evidence | W193 | 2h | M24 | 🟡 W193 자동검증 통과 / 사용자 QA 대기 |
| M42 | P7     | Publish diff viewer 실사용 evidence | W195 | 2h | M24 | 🟡 W195 자동검증 통과 / 사용자 QA 대기 |
| M43 | P1     | Pages CRUD validation hardening | W14 | 2h | M28 | 🟡 W14 자동검증 통과 / 사용자 QA 대기 |
| M44 | QA     | Services template text persistence | W18,W84 | 2h | M30 | 🟡 주요 서비스 텍스트 유지 자동검증 통과 / 사용자 QA 대기 |
| M45 | QA     | Locale page projection guard | W14,W193 | 2h | M43 | 🟡 KO/zh-hant pageId 혼선 자동검증 통과 / 사용자 QA 대기 |
| M46 | QA     | Service section gallery depth | W18,W84 | 2h | M44 | 🟡 서비스 섹션 템플릿 12개/뒤로가기 UX 자동검증 통과 / 사용자 QA 대기 |
| M47 | QA     | Node click movement guard | W18,W84,W216 | 2h | M44 | 🟡 노드 클릭/칼럼/이미지 백지화 회귀 자동검증 통과 / 사용자 QA 대기 |
| M48 | QA     | Section template market search | W18,W84,W216 | 2h | M46 | 🟡 주요업무 검색/디자인팩 UX 자동검증 통과 / 사용자 QA 대기 |
| M49 | QA     | Add panel page template showroom entry | W14,W18,W216 | 2h | M48 | 🟡 Add 패널 261개 페이지 템플릿 진입 자동검증 통과 / 사용자 QA 대기 |
| M50 | QA     | Add-to-page template search handoff | W14,W18,W216 | 1h | M49 | 🟡 Add 검색어 템플릿 쇼룸 전달 자동검증 통과 / 사용자 QA 대기 |
| M51 | QA     | Page template prompt back path | W14,W18,W216 | 1h | M50 | 🟡 템플릿 적용 확인 단계 뒤로가기 자동검증 통과 / 사용자 QA 대기 |
| M52 | QA     | Page template search previews | W14,W18,W216 | 1h | M51 | 🟡 Add 검색 결과 페이지 템플릿 미리보기 자동검증 통과 / 사용자 QA 대기 |
| M53 | QA     | Page template result thumbnails | W14,W18,W216 | 1h | M52 | 🟡 Add 검색 결과 썸네일/품질 배지 자동검증 통과 / 사용자 QA 대기 |
| M54 | QA     | FAQ reveal persistence | W18,W84,W216 | 1h | M44 | 🟡 FAQ 답변 텍스트 유지 자동검증 통과 / 사용자 QA 대기 |
| M55 | QA     | Interactive preview document reset | W18,W84,W216 | 1h | M54 | 🟡 페이지/템플릿 전환 preview 상태 초기화 자동검증 통과 / 사용자 QA 대기 |
