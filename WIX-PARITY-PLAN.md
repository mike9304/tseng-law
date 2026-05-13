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
| M56 | P9     | Editor preference normalization | W216~W225 | 1h | M28 | 🟡 editor prefs nested default/legacy 복구 자동검증 통과 / 사용자 QA 대기 |
| M57 | QA     | Template gallery back search + preview sync | W14,W18,W84,W216 | 1h | M56 | 🟡 템플릿 뒤로가기 검색 유지/서비스 글 클릭 회귀 자동검증 통과 / 사용자 QA 대기 |
| M58 | QA     | Template search aliases | W14,W18,W216 | 1h | M57 | 🟡 한국어 업종/페이지/템플릿 사이트 검색 자동검증 통과 / 사용자 QA 대기 |
| M59 | QA     | Public locale page resolution guard | W14,W193 | 1h | M45 | 🟡 `/ko` public/editor 중국어 혼선 자동검증 통과 / 사용자 QA 대기 |
| M60 | QA     | Template internal link locale normalization | W14,W193,W216 | 1h | M59 | 🟡 템플릿 내부 링크 locale prefix 자동검증 통과 / 사용자 QA 대기 |
| M61 | QA     | Initial draft overwrite guard | W18,W84,W216 | 1h | M57 | 🟡 템플릿 삽입 직후 초기 draft overwrite 회귀 자동검증 통과 / 사용자 QA 대기 |
| M62 | QA     | Design panel template discovery | W14,W18,W216 | 1h | M61 | 🟡 Design 패널 섹션/페이지 템플릿 발견성 자동검증 통과 / 사용자 QA 대기 |
| M63 | QA     | Page template create retry state | W14,W18,W216 | 1h | M62 | 🟡 템플릿 페이지 생성 실패 후 재시도/뒤로가기 상태 자동검증 통과 / 사용자 QA 대기 |
| M64 | QA     | Page template create success persistence | W14,W18,W216 | 1h | M63 | 🟡 템플릿 페이지 생성 성공/선택/draft 저장 자동검증 통과 / 사용자 QA 대기 |
| M65 | QA     | Custom shortcut runtime evidence | W216,W219 | 1h | M64 | 🟡 커스텀 단축키 저장/기본 override/실제 복제 dispatch 자동검증 통과 / 사용자 QA 대기 |
| M66 | QA     | Custom shortcut label sync | W216,W219 | 1h | M65 | 🟡 커스텀 단축키 라벨/도움말/메뉴/툴팁 동기화 자동검증 통과 / 사용자 QA 대기 |
| M67 | QA     | Layer focus real pointer actions | W18,W84,W216 | 1h | M66 | 🟡 레이어 선택 후 실제 우클릭 메뉴 자동검증 통과 / 사용자 QA 대기 |
| M68 | QA     | Archive/image click blanking guard | W18,W84,W216 | 1h | M67 | 🟡 칼럼 아카이브/이미지 클릭 백지화 방어 자동검증 강화 / 사용자 QA 대기 |
| M69 | QA     | Page template navigation wiring | W14,W18,W216 | 1h | M64 | 🟡 템플릿 생성 페이지 메뉴 연결/공개 헤더 도달 자동검증 통과 / 사용자 QA 대기 |
| M70 | QA     | Locale template page creation guard | W14,W193,W216 | 1h | M69 | 🟡 zh-hant 템플릿 생성 메뉴 href/템플릿 링크 안전성 자동검증 통과 / 사용자 QA 대기 |
| M71 | QA     | API template link normalization guard | W14,W193,W216 | 1h | M70 | 🟡 zh-hant/en synthetic 템플릿 내부 링크 저장 정규화 자동검증 통과 / 사용자 QA 대기 |
| M72 | QA     | Auto navigation rename/delete sync | W14,W18,W216 | 1h | M69 | 🟡 자동 추가 메뉴 label/href rename/delete 동기화 자동검증 통과 / 사용자 QA 대기 |
| M73 | QA     | Undo timeline action evidence | W216,W225 | 1h | M72 | 🟡 undo timeline 버튼 실제 undo/redo 자동검증 통과 / 사용자 QA 대기 |
| M74 | QA     | Shortcut modal Escape close | W216,W219,W225 | 1h | M73 | 🟡 focused shortcut input Escape 닫기/미저장 자동검증 통과 / 사용자 QA 대기 |
| M75 | QA     | Plus zoom shortcut parser guard | W216,W219 | 1h | M74 | 🟡 `Mod++`/plus key zoom shortcut 자동검증 통과 / 사용자 QA 대기 |
| M76 | QA     | Locale standard page seed guard | W14,W193,W216 | 1h | M75 | 🟡 KO 홈 누락 시 locale별 seed 복구 자동검증 통과 / 사용자 QA 대기 |
| M77 | QA     | Locale navigation projection guard | W14,W18,W193,W216 | 1h | M76 | 🟡 비한국어 자동 메뉴가 한국어 header/footer에 섞이지 않도록 자동검증 통과 / 사용자 QA 대기 |
| M78 | QA     | Service template reload persistence | W18,W84,W216 | 1h | M77 | 🟡 주요업무 템플릿 autosave/reload 후 텍스트 유지 자동검증 통과 / 사용자 QA 대기 |
| M79 | QA     | Shortcut modal focus trap | W216,W219,W225 | 1h | M78 | 🟡 shortcut map Tab 순환/외부 focus 차단/trigger focus 복귀 자동검증 통과 / 사용자 QA 대기 |
| M80 | QA     | Image edit dialog focus trap | W22,W23,W216,W225 | 1h | M79 | 🟡 이미지 편집 dialog focus trap/Escape/canvas shortcut 격리 자동검증 통과 / 사용자 QA 대기 |
| M81 | QA     | Asset library focus trap | W22,W216,W225 | 1h | M80 | 🟡 에셋 라이브러리 focus trap/Escape/canvas focus 누수 방지 자동검증 통과 / 사용자 QA 대기 |
| M82 | QA     | Preview modal focus trap | W40,W45,W216,W225 | 1h | M81 | 🟡 미리보기 modal focus trap/reload shortcut/Escape 복귀 자동검증 통과 / 사용자 QA 대기 |
| M83 | QA     | Page slug prompt focus trap | W14,W18,W216,W225 | 1h | M82 | 🟡 페이지 템플릿 slug prompt focus trap/Escape/back path 자동검증 통과 / 사용자 QA 대기 |
| M84 | QA     | SEO panel focus trap | W186,W190,W216,W225 | 1h | M83 | 🟡 SEO panel focus trap/Escape/toolbar focus 복귀 자동검증 통과 / 사용자 QA 대기 |
| M85 | QA     | Version history focus trap | W195,W216,W225 | 1h | M84 | 🟡 버전 히스토리/복원 확인 focus trap/Escape/toolbar focus 복귀 자동검증 통과 / 사용자 QA 대기 |
| M86 | QA     | Save section modal focus trap | W84,W216,W225 | 1h | M85 | 🟡 섹션 저장 modal focus trap/Escape/context menu 경로 자동검증 통과 / 사용자 QA 대기 |
| M87 | QA     | Template preview ModalShell focus guard | W14,W18,W216,W225 | 1h | M86 | 🟡 템플릿 preview focus trap/외부 focus 차단/trigger 복귀 자동검증 통과 / 사용자 QA 대기 |
| M88 | QA     | Advanced picker popover focus trap | W181,W184,W216,W225 | 1h | M87 | 🟡 color/font picker popover focus trap/Escape/parent modal 격리 자동검증 통과 / 사용자 QA 대기 |
| M89 | QA     | Published media modal blanking guard | W22,W23,W216,W225 | 1h | M88 | 🟡 공개 이미지 lightbox/popup focus trap/이미지 내부 클릭 유지 자동검증 통과 / 사용자 QA 대기 |
| M90 | QA     | Published overlay keyboard focus restore | W23,W98,W216,W225 | 1h | M89 | 🟡 site lightbox/popup Enter/Space trigger/focus restore 자동검증 통과 / 사용자 QA 대기 |
| M91 | QA     | Published auto overlay focus fallback | W23,W98,W216,W225 | 1h | M90 | 🟡 hash lightbox/on-load popup focus fallback 자동검증 통과 / 사용자 QA 대기 |
| M92 | QA     | Cookie consent modal focus trap | W98,W216,W225 | 1h | M91 | 🟡 cookie consent modal focus trap/keyboard reopen 자동검증 통과 / 사용자 QA 대기 |
| M93 | QA     | Published gallery lightbox focus trap | W71,W72,W216,W225 | 1h | M92 | 🟡 gallery lightbox focus trap/portal 자동검증 통과 / 사용자 QA 대기 |
| M94 | QA     | Published mobile header drawer focus trap | W40,W99,W216,W225 | 1h | M93 | 🟡 mobile header drawer focus trap/Escape/restore 자동검증 통과 / 사용자 QA 대기 |
| M95 | QA     | Published menu-bar keyboard navigation | W99,W100,W216,W225 | 1h | M94 | 🟡 menu-bar dropdown/mobile keyboard 자동검증 통과 / 사용자 QA 대기 |
| M96 | QA     | Published header search overlay focus trap | W40,W98,W216,W225 | 1h | M95 | 🟡 header search overlay focus trap/Escape/restore 자동검증 통과 / 사용자 QA 대기 |
| M97 | QA     | Public live chat focus trap | W98,W216,W225 | 1h | M96 | 🟡 live chat dialog focus trap/Escape/restore 자동검증 통과 / 사용자 QA 대기 |
| M98 | QA     | Public AI chat keyboard path guard | W98,W216,W225 | 1h | M97 | 🟡 AI chat focus wrap/Escape/restore 및 hidden chrome guard 자동검증 통과 / 사용자 QA 대기 |
| M99 | QA     | Public mobile drawer focus trap | W40,W99,W216,W225 | 1h | M98 | 🟡 legacy public mobile drawer focus trap/Escape/restore 자동검증 통과 / 사용자 QA 대기 |
| M100 | QA    | Public year-end popup focus trap | W98,W216,W225 | 1h | M99 | 🟡 event popup focus trap/scope guard 자동검증 통과 / 사용자 QA 대기 |
| M101 | QA    | Published site-search keyboard results | W98,W100,W216,W225 | 1h | M100 | 🟡 inline search listbox keyboard 자동검증 통과 / 사용자 QA 대기 |
| M102 | QA    | Published disclosure aria wiring | W18,W84,W98,W216 | 1h | M101 | 🟡 services/FAQ disclosure keyboard+aria 자동검증 통과 / 사용자 QA 대기 |
| M103 | QA    | Published search tablist keyboard | W40,W98,W216,W225 | 1h | M102 | 🟡 search overlay tablist Arrow/Home/End 자동검증 통과 / 사용자 QA 대기 |
| M104 | QA    | Editor click/template regression sweep | W18,W22,W84,W216 | 1h | M103 | 🟡 node-click + section-template suites 15 passed / 사용자 QA 대기 |
| M105 | QA    | Editor modal/focus regression sweep | W03,W216,W225 | 1h | M104 | 🟡 inline text/pageId focus + preview/layer suites 3 passed / 사용자 QA 대기 |
| M106 | QA    | Editor a11y/chrome/mobile sweep | W40,W216,W225 | 1h | M105 | 🟡 axe core states + chrome click + mobile inspector 3 passed / 사용자 QA 대기 |
| M107 | QA    | SEO/history/save-section focus sweep | W84,W186,W195,W216,W225 | 1h | M106 | 🟡 SEO/history/save-section focus traps 3 passed / 사용자 QA 대기 |
| M108 | QA    | Publish/metadata E2E sweep | W26,W27,W28,W187,W192,W193,W195 | 1h | M107 | 🟡 publish/head/robots/JSON-LD/hreflang/diff/UI click 6 passed / 사용자 QA 대기 |
| M109 | QA    | Media/gallery/motion runtime sweep | W22,W23,W71,W72,W161,W174,W216 | 1h | M108 | 🟡 media/gallery catalog + motion runtime 4 passed / 사용자 QA 대기 |
| M110 | QA    | Asset upload/image workflow sweep | W22,W23,W216,W225 | 1h | M109 | 🟡 asset upload security + image workflow 4 passed / 사용자 QA 대기 |
