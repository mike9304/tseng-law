# 기존 러시아어 704–706 캡션 한정 검토 — PASS

검토자 `/root/expand_final_east`, 확인 `2026-10-25T13:37:29.213792+00:00`. Root가 수정한 캡션3줄을 독립 검토했다. 새24편 또는 동유럽6편 원고 manifest에는 포함하지 않는다. 러시아어 법률·ARC 절차·본문 전체·이미지 내용에 관한 새 검수가 아니다.

`Условная сцена`를 `Вымышленная сцена`로 바꾸면 가상 장면이라는 뜻이 분명해진다. 여성 명사와 형용사의 일치가 자연스럽고, 기존 `src/lib/__tests__/column-image-caption-label.test.ts:21`의 러시아어 정본과 정확히 같다. 캡션은 작성 주체나 법률 결과를 주장하지 않는다.

비교한 저장소 HEAD: `5e2d0f5df8c75eb4aca8304b7d9f5110ac422f90`. 기존 테스트 파일 전체를 읽고 그 파일이 HEAD와 byte-identical임을 확인했다. 같은 캡션 등식을 세 파일에 적용했다. Vitest를 별도로 재실행했다는 주장은 하지 않는다.

| 파일:줄 | 최종 SHA-256 | 결과 |
|---|---|---|
| `src/content/columns-ru/704-taiwan-arc-first-application.md:16` | `ab1ee7e62195d68ae6042a3ca8746ec910543fb3b321f3fd62978954a8a6e71a` | PASS |
| `src/content/columns-ru/705-taiwan-visa-residence-work-study-family.md:16` | `7cb92723448d3558487e297b6b89f62d3ab52955fac77bdfd651a80d49d33cdb` | PASS |
| `src/content/columns-ru/706-taiwan-arc-renewal-changes-reentry.md:16` | `b9caf2c6328c7d328f376f9cecdaef142e265fa451a49a5c370edf2f177ffe28` | PASS |

각 파일에서 새 캡션 한 번만 이전 문구로 되돌리면 HEAD의 전체 바이트 및 기록된 수정 전 SHA가 정확히 재현됐다. 본문 SHA도 HEAD와 같다. FAQ·alt·이미지 참조·날짜·법률 내용 등 캡션 외 모든 바이트가 동일하고 이미지 파일 바이트도 HEAD와 동일함을 확인했다. 실제3개 diff와 모든 해시는 JSON에 보존했다.

미해결 finding 없음. 원고나 테스트를 수정하지 않았다. 이 결과는 인간 원어민·변호사 검수나 공개 게시/배포 완료를 뜻하지 않는다.
