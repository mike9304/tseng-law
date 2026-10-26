# B8 HU6 저자 후속 R2 — 분원 명칭과 지시 대상

2026-10-26T17:19:22.023220+09:00. Root가 승인한 독립 R1 M01과 선택 O01/O02를 최소 반영했다. 원고는 이 버전으로 다시 동결한다. 원 `hu-author.md`, `hu-final-manifest.json`, 독립 R1 보고서 및 모든 초기 실패/중간/Markdown 경계 증거를 보존했다. 본 기록은 모델 저자 검토이며 독립 검수자의 R2 종결·사람 원어민/변호사 승인을 대신하지 않는다.

## 실제 5치환과 의미

- M01 / 918: `Tajvani Felsőbíróság Taichungi Tanácsa` → `Tajvani Felsőbíróság taichungi kirendeltsége`.
- M01 / 920: `Tajvani Felsőbíróság Kaohsiungi Tanácsa` → `Tajvani Felsőbíróság kaohsiungi kirendeltsége`.
- M01 / 920: `Tajvani Felsőbíróság, Kaohsiungi Tanács` → `Tajvani Felsőbíróság, kaohsiungi kirendeltség`.
- O01 / 916: `a dolgozók kitettségéről` → `a dolgozók vegyi anyagoknak való kitettségéről`.
- O02 / 920: `és a hozzá tartozó mérőórához` → `és a lakó mérőórájához`.

M01: 사건 법원의 分院을 지리적 분원으로 설명한다. 공식 헝가리어 기관 명칭을 확보했다고 주장하지 않는다. 원래 날짜의 서수점/Markdown escape·사건번호·항소 및 추가 청구 기각·918 추가 상소 불가·920 확정 미확인·출처 URL은 그대로다. 919의 별도 행정소송 재판부 표현은 바꾸지 않았다.

O01: 916 FAQ3의 노출 대상을 기존 본문과 같은 화학물질로 명시했다. FAQ의 의미를 더 분명히 했으며 새로운 피해·인과관계·책임 조건을 추가하지 않았다. FAQ3 답변만 바뀌었으므로 frontmatter/FAQ가 전부 불변이라고 기록하지 않는다. 본문은 바이트 동일하다.

O02: 920 첫 문단의 지시어를 주민의 계량기로 명확히 했다. 해당 계량기의 사용 연결을 설명하며 법적 소유권을 별도로 확정한 판결로 바꾸지 않았다. 공용 벽·천장·전력함의 범위와 필요한 동의도 같다.

## 현재 SHA와 실제 검사

| ID | 현재 SHA-256 | CV | CLI 증거 |
|---|---|---:|---|
| 915 | `6659ae1fc0f21374b23de7592c07db1ea40e59c7d5c098c4576e134ac805887d` | 0.509 | R1 실제 실행 재사용 |
| 916 | `cd2edf272341f53231e55246994f431a59da1f5ea83e7dda16c588a6928859ee` | 0.484 | 이번 실제 실행 |
| 918 | `44ce1490aeec719f4ec8ae26ec5654368939cfd689f7781f5b1f66d16c951f5e` | 0.484 | 이번 실제 실행 |
| 919 | `1ac72ef840a1bd2b09b0462269afc8ca420cc6208bb99b350b52d91b414efb4a` | 0.479 | R1 실제 실행 재사용 |
| 920 | `a0af0c0413587cf3bff740f7c42ac38f3177d4d7c65eb88d53947166576e4898` | 0.48 | 이번 실제 실행 |
| 921 | `b1a400ffc4a2aae73c631a3851df2f2d86570beb59c1c18c0decc03ca56f5a09` | 0.518 | R1 실제 실행 재사용 |

변경된 916·918·920만 현재 파일 SHA로 실제 공유 `--lang hu`를 실행했다. 세 편 모두 exit0 / FAIL0이며 CV는 .484/.484/.480이다. 915·919·921은 원고 SHA가 그대로여서 R1 실제 실행을 재사용했다. 같은 SHA의 전체 검사 반복은 없다. 현재 전체 본문223개 중220개는 R1과 같고 918의 기관 명칭1문장, 920의 계량기/기관 명칭2문장만 바뀌었다. 날짜 및 조문 경계는 유지된다.

변경3편을 실제 ReactMarkdown/remarkGfm으로 다시 렌더한 문단의 표시텍스트도 읽었다. 공유 추출과 41/37/35개 문장이 정확히 일치하고 연도 시작이 목록으로 바뀐 곳은 없다. 이는 서버 렌더링 확인이며 브라우저 전체 페이지나 공개 배포 검증은 아니다. 구조 검사도 변경3편에만 EN916/ZH918·920 sourceLocale·정본 별칭을 적용해 errors0이다.

§5: 원래 분산된 도입과 고지 직전 실질 결말은 보존했다. 920 지시어 문장은25→24단어, 두 법원 명칭 문장은19→19 및15→15단어다. 같은 단어 반복을 늘리거나 조건절을 끊지 않았고 긴 문장·짧은 문장 배치도 유지된다. MONOTONY: 이번 명칭·지시어 교정 때문에 생긴 반려 항목 없음. 단위·임계값·문장 분리 도구는 바꾸지 않았다.

## 보존과 감사 근거

`hu-review-r1-preserved.json`에 수정 전 여섯 원고 바이트와 기존 저자/manifest/독립 R1 SHA를 저장했다. `hu-review-r1-edits.json`에는 정확한5 old/new, 파일별 실제 diff와 역치환을 남겼다. 현재 여섯 파일을 역복원하면 R1 여섯 SHA와 모두 일치한다. 모든 URL 값·순서와 법률 숫자는 그대로다. 916 FAQ3 외 frontmatter/FAQ는 불변이고 920 출처 링크의 표제 한 곳만 변했다.

실제 영향3편 실행은 `hu-review-r2-variety.json`, 구조/렌더는 `hu-review-r2-structure-render.json`, 전체 current linkage·역복원·223개 배열 중 변경3개는 `hu-review-r2-integrity.json`에 있다. 새 current manifest는 `hu-final-manifest-r2.json`이다. R1을 덮어쓰지 않는다.

최신 LESSONS 17:05 전문을 앞선 IS6 검수 중 읽고, 같은 SHA `86710ef330b108a916a7bb92a75f1ffa62dea53412e8a75f38472d9fa9b33130`를 다시 확인했다. 15:05 입력 기록도 보존한다. 현행 shared expansion은 `ea03abaa59249d7d914e1c98a5231a5c1636528dd1ecda326b0d4638edf17975`이며 네 검사 파일 SHA는 실제 실행 기록에 연결돼 있다. R·공유 도구·다른 언어·검수자 파일·Git·배포를 수정하지 않았다.
