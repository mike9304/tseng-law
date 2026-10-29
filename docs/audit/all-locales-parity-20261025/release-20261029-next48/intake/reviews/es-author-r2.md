# ES920 작성자 한 문장 교정 r2

2026-10-29 KST. root의 추가 지시에 따라 ES920의 지시어 한 문장만 교정했다. 좁은 종결검수는 pending이며, 이 작성자 기록은 독립 승인·게시 승인이 아니다.

수정 전: `El tribunal consideró comunes esas partes e instalaciones.`

수정 후: `El tribunal consideró comunes la pared, el techo y el cuadro eléctrico utilizados para la instalación.`

바로 앞 문장의 `contador propio`까지 `esas partes e instalaciones`의 지시 범위로 읽힐 여지를 없앴다. 공용으로 판단된 벽·천장·전기함을 정확히 열거하고 계량기의 소유권을 판결한 것처럼 확장하지 않는다. ZH920 정본 전문 및 보관 공식 회신 `retained/zh-hant-ev-primary-recovered.md` 전문을 다시 읽었다. 특히 L43의 괄호는 공유 부분(벽·천장)과 시설(공용 전기함)을 명시한다. 이 확인은 보관 회신 열람이며 새 판결문 접근 성공이나 확정 확인이 아니다.

수정 전 SHA: `d9bb6af386a6552bed5f37e7b45f7a0425920ef2fa2d3fd1aee17185d2b32545`.

현재 SHA: `d6a190905068c5889ceb9d0022b7f380ab0c4deac91c7311bc7a0a8b7e8b649e`.

[before bytes](../checks/es-author-r2-before-920.md), [정확한 diff](../checks/es-author-r2-exact.diff), [manifest와 실제 CLI](../checks/es-author-r2-manifest.json)를 보존했다. 단 한 번의 치환이며 역치환하면 원본 전체 바이트가 복원된다. frontmatter 전체·FAQ3·숫자열·URL열은 동일하다. 다른 ES5편과 기존 독립 r1 기록은 바뀌지 않았다. 선택 O3은 수정하지 않았다.

실제 공유 CLI `check <ES920> --lang es`는 exit 0, FAIL 0, WARN 0이다. 38문장, CV .460, 단문 .105로 현재 문장의 수치가 반영됐다. §5 관점에서 대상 한 문장은 법원이 공용으로 분류한 구체 대상을 설명하며, 도입·문단 시작·결말·주체·법정 조건은 바꾸지 않았다. 의미 없는 수치 조정 문장을 추가하지 않았다.

R·공유 도구·타인 원고·release72·기존 감수 파일은 수정하지 않았고 새 빌드·push·배포도 하지 않았다. 다음48 인수 목록에는 현재 SHA와 종결검수 pending 상태를 기록한다.
