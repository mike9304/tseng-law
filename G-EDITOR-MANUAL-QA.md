# G-Editor Manual QA

목적: `/ko/admin-builder`가 Wix Editor처럼 느껴지는지 사용자가 5분 동안 직접 확인하기 위한 최종 체크리스트.

전제:
- 로컬 서버: `http://localhost:3000`
- 편집기 URL: `http://localhost:3000/ko/admin-builder`
- Basic Auth: `admin` / `local-review-2026!`
- 자동 검증은 통과했지만, 체크포인트 Green 판정은 사용자 직접 클릭 검증 후에만 가능

현재 자동 증거:
- 최신 기록 커밋: `6b72b1b G-Editor: record perf follow-up gate`
- `BASE_URL=http://localhost:3000 npm run test:builder-editor -- --workers=1` 통과: 27/27
- `npm run test:unit` 통과: 735/735
- `npm run security:builder-routes` 통과: 71 route files / 62 mutation handlers
- `npm run typecheck` 통과
- `npm run lint` 통과 (기존 `<img>` warnings only)
- `npm run build` 통과 (Google Fonts stylesheet download warning + 기존 `<img>` warnings only)
- `/ko` 200, `/ko/admin-builder` 200
- `Wix 체크포인트.md` 상태: W02/W04/W06/W07/W08/W10/W11/W18~W23/W26~W30 = `자동검증 통과 / 사용자 QA 대기`

## 5분 자유 검증

| W | 항목 | 직접 확인할 행동 | 통과 기준 | 결과 |
|---|---|---|---|---|
| W01 | 첫 화면 | 편집기에 들어간 직후 스크롤하지 않고 화면을 본다 | header, hero, 캔버스가 위에서 바로 보이고 좌우가 잘리지 않는다 |  |
| W02 | 선택 UI | hero 텍스트/이미지/버튼을 클릭한다 | Wix식 파란 테두리, 8개 흰 핸들, 크기 라벨이 보인다 |  |
| W02 | Hover | 선택 안 된 요소 위에 마우스를 올린다 | 얇은 파란 hover outline이 보인다 |  |
| W06 | Drag/Snap | 텍스트나 버튼을 조금 끌어 다른 요소에 맞춘다 | 분홍/주황 snap line과 px chip이 보이고 위치가 자연스럽게 붙는다 |  |
| W07 | Resize | corner/edge handle을 끌고 Shift도 눌러 본다 | 커서 옆 size tooltip이 보이고 Shift 비율 유지가 된다 |  |
| W08 | Rotate | 상단 회전 핸들을 끌고 Shift도 눌러 본다 | degree chip이 보이고 Shift 시 15도 단위로 맞는다 |  |
| W11 | Save chip | 요소를 움직인 뒤 좌하단을 본다 | `Saving...` 후 `Saved`로 바뀐다 |  |
| W10 | Undo/Redo | Cmd/Ctrl+Z, Cmd/Ctrl+Shift+Z 또는 Cmd/Ctrl+Y를 누른다 | `Undid:` / `Redid:` chip과 함께 상태가 복구된다 |  |
| W19-W21 | Top bar | 상단 page dropdown, device toggle, Preview, Publish를 확인한다 | 32px급 Wix식 top bar 구조가 어색하지 않다 |  |
| W04 | Left rail | Pages/Add/Design/Layers/Navigation/Columns를 hover/click한다 | 64px dark rail, tooltip, slide drawer가 자연스럽다 |  |
| W18-W19 | Header edit | 상단 메뉴에 hover하고 `Edit menu`를 누른다 | 버튼이 사라지지 않고 Navigation 편집 패널이 열린다 |  |
| W18/W30 | Columns | Columns rail 또는 칼럼 섹션에서 글 관리/새 글을 연다 | 티스토리처럼 제목/본문 중심으로 바로 작성 가능하다 |  |
| W18/W30 | Columns return | 칼럼 목록/글쓰기에서 편집 홈으로 돌아간다 | 좌하단/상단 복귀 장치로 `/ko/admin-builder`에 돌아온다 |  |
| W23 | Map edit | 지도 노드를 클릭하고 주소/지역/줌을 바꾼다 | iframe 지도, 주소 카드, 길찾기 링크가 즉시 같이 바뀐다 |  |
| W23 | Offices tabs | 오시는길에서 타이중/가오슝 탭을 눌러 본다 | 해당 사무소 layout만 보인다 |  |
| W18 | FAQ/services | 업무분야/FAQ 항목을 눌러 본다 | 공개 사이트처럼 선택 항목만 펼쳐진다 |  |
| W22/W23 | Asset/Image | 이미지 우클릭 후 Replace 또는 Crop/Filter/Alt를 연다 | 자산 폴더/검색/태그/정렬과 통합 이미지 편집 dialog가 자연스럽다 |  |
| W29/W30 | Copy/Paste | 요소 Cmd/Ctrl+C 후 다른 page로 가서 Cmd/Ctrl+V | Pages panel clipboard pill이 보이고 현재 page에 offset 붙여넣기 된다 |  |
| W26-W28 | SEO/History/Publish | SEO, History, Publish modal을 열어 본다 | Google preview, timeline revision, preflight checklist가 보인다 |  |
| W11/W29/W30 | Reload | 변경 후 새로고침한다 | 저장된 draft 상태가 유지된다 |  |

## 판정 규칙

- 모두 통과하면 `Wix 체크포인트.md`의 W02/W06/W07/W08/W10/W11/W18~W23/W26~W30을 Green 후보로 올릴 수 있다.
- 하나라도 어색하면 해당 줄의 행동, 기대와 실제 차이, 가능하면 화면 위치를 남기고 다음 패치 대상으로 잡는다.
- `CODEX-GOAL-WIX-PARITY-COMPLETE.md` 기준 전체 Wix-class 제품 완성은 별도 장기 PR #0~#20 범위이며, 이 QA는 현재 G-Editor desktop parity goal만 다룬다.

## 사용자 판정 기록

- 검증자:
- 검증 일시:
- 브라우저/화면 크기:
- 전체 판정: pass / fail
- fail 항목:
- "이거 Wix를 그대로 쓰는 느낌인데?" 체감 여부:
