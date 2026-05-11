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
| M21 | P4     | Forms 후반                        | W141~W150 | 30h  | M11  | 🟡   |
| M22 | P5     | Motion 후반                       | W160~W175 | 40h  | M07  | 🟡   |
| M23 | P6     | Design system 마무리              | W184~W185 | 12h  | —    | 🟡   |
| M24 | P7     | SEO + Publish 성숙                | W186~W195 | 24h  | —    | 🟡   |
| M25 | P8     | Bookings 본격 1 (서비스/스태프)   | W196~W202 | 24h  | M21  | 🟡   |
| M26 | P8     | Bookings 본격 2 (예약/결제)       | W203~W210 | 28h  | M25  | 🟡   |
| M27 | P8     | Bookings 본격 3 (다국어/정책)     | W211~W215 | 16h  | M26  | 🟡   |
| M28 | P9     | 에디터 고도화                     | W216~W225 | 24h  | M02  | 🟡   |
