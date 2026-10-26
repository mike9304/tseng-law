# B8 HU6 독립 검수 R2 — 승인된 5치환의 표적 종결

판정: M01·O01·O02 닫힘. 미해결 필수 0, 새 필수 0. 이번 판단은 아래 동결 SHA의 변경 부분에 대한 AI 독립 검수이며, 사람 원어민/변호사 승인 또는 공개 배포 완료를 뜻하지 않는다.

R1 보고서 `hu-independent.md` SHA `72c85b55bc27d2c3ccb901c355e2934625c52d565e5958dbf341e255ed47f287`와 R1 manifest `2b12807d6a46ba4ea31568fd3d453cfe83033e3d9d23793b7b3f6c1bd47ac8dc`를 그대로 보존했다. R1의 REQUEST_CHANGES 및 최초 SHA를 덮어쓰지 않았다.

## 변경 의미와 범위

- M01: 918 본문 `Taichungi Tanácsa`를 `taichungi kirendeltsége`로, 920 본문 `Kaohsiungi Tanácsa`를 `kaohsiungi kirendeltsége`로, 920 출처 표제의 `Kaohsiungi Tanács`를 `kaohsiungi kirendeltség`로 바꿨다. 원래 제안과 정확히 같다. 지역 분원을 설명하며 공식 헝가리어 명칭 확보를 주장하지 않는다. 919의 별도 행정소송 재판부 표현은 그대로다.
- O01: 916 FAQ3의 `a dolgozók kitettségéről`에 `vegyi anyagoknak való`를 넣어 화학물질 노출을 명시했다. 본문과 일치하고 새 인과관계나 책임 조건을 만들지 않는다. 현재 FAQ3 답변 전체를 다시 읽었다. 본문은 바이트 동일하다.
- O02: 920 첫 문단의 `és a hozzá tartozó mérőórához`를 `és a lakó mérőórájához`로 바꿨다. 계량기 지시 대상이 분명해졌으며 계량기의 법적 소유권에 관한 새 판단은 추가하지 않았다. 공용 부분·동의 조건은 그대로다.

918의 항소/추가 청구 기각과 상소불가, 920의 철거·복구 및 후속 확정 미확인, 날짜·사건번호·출처 URL이 유지된다. 현재 본문 변경 세 문장과 앞뒤 문단, 바뀐 FAQ 답변 및 출처 표제를 직접 읽고 확인했다.

## 직접 검증한 증거

저자의 `hu-review-r1-edits.json`을 읽는 데 그치지 않고, 독립 R1의 정확한 제안5개를 현재 파일에서 역치환했다. 여섯 파일 모두 독립 R1 SHA와 일치하고, 저자 보존 원본 바이트와도 같다. 915·919·921은 무변경이다. 모든 링크의 값·순서 및 숫자열은 같으며, frontmatter 변화는 916 FAQ3 하나뿐이다. 920 출처 링크는 표제만 변했다.

저자는 변경3편에만 실제 shared `--lang hu`를 실행했다. 916·918·920의 exit0/FAIL0, CV .484/.484/.480 및 현재 SHA를 직접 연결했다. 916은 FAQ만 바뀌어 본문 배열이 불변이지만 저자가 실제 재실행한 사실을 그대로 기록한다. 검수자는 추가 CLI를 실행하지 않았다.

전체223분절 중220개는 R1과 같고 918 기관 명칭1문장·920 계량기 및 기관 명칭2문장만 바뀌었다. 변경3편의 실제 ReactMarkdown 표시문단에서 얻은113분절과 현재 CLI 배열도 완전히 같다. 정상 서수점·날짜 및 Markdown escape는 유지되며 새 문장 오분할을 발견하지 않았다. 영향3편 구조 검사 errors0도 실제 파일 SHA에 결합돼 있다. 전면 재검사나 새 브라우저 확인을 수행했다고 표시하지 않는다.

R2 manifest의 경로/해시 선언24개와 R1 독립 산출물의 현재 바이트를 직접 확인했다. 원 저자 보고서와 final manifest도 각각 `55c570…dea35a`, `c86464…f07c`로 보존돼 있다. shared 도구4개는 기존 승인 설치본이며 수정하지 않았다.

§5/MONOTONY: 시작과 결말·조건절 배열은 유지됐고, 계량기 문장의 모호한 대명사가 구체 명사로 바뀌었다. 기관 명칭 수정은 새로운 반복 구조를 만들지 않았다. 이번 변경으로 인한 MONOTONY 반려 사항 없음. 변경하지 않은 부분의 전문 검수는 R1 증거를 재사용한다.

## 현재 SHA

| 원고 | SHA256 |
|---|---|
| 915 | `6659ae1fc0f21374b23de7592c07db1ea40e59c7d5c098c4576e134ac805887d` |
| 916 | `cd2edf272341f53231e55246994f431a59da1f5ea83e7dda16c588a6928859ee` |
| 918 | `44ce1490aeec719f4ec8ae26ec5654368939cfd689f7781f5b1f66d16c951f5e` |
| 919 | `1ac72ef840a1bd2b09b0462269afc8ca420cc6208bb99b350b52d91b414efb4a` |
| 920 | `a0af0c0413587cf3bff740f7c42ac38f3177d4d7c65eb88d53947166576e4898` |
| 921 | `b1a400ffc4a2aae73c631a3851df2f2d86570beb59c1c18c0decc03ca56f5a09` |

저자 R2: `hu-author-r2.md`, SHA `0528471de934e07b474c18b90efcef6d053e4d6405fc49baa22c7bdf561d1982`.

저자 R2 manifest: `hu-final-manifest-r2.json`, SHA `a39258c8ec0988a12e2b8377b593a828bd85f994b6142e8407cf521dfef7149a`.

독립 실제 역복원·배열·해시 확인: `checks/hu-independent-r2-verification.json`, SHA `1792fa0f5e1794523dcfb63947b5b461a07401d8902aeba72efc6de5531af7b7`.

이 후속 검수는 원고, 저자 기록, R, 공유 도구와 공개 사이트를 변경하지 않았다. 네트워크 재조회도 하지 않았으며 R1의 공식 자료 열람 범위와 한계가 계속 적용된다.
