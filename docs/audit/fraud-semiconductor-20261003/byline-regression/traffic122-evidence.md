# Column 122 공개 AI 작성자 푸터 제거 — artifact only

패치와 이 검증 기록만 작성했다. 실제 저장소·원격·소스·인덱스·커밋·배포는 수정하지 않았다. 승인된 네 푸터 줄을 담당자가 검토하여 적용할 수 있다.

- 기준 저장소: `/Users/son7/Projects/tseng-law-fraud-editorial-20261003`
- 기준 HEAD: `15254eed624e13c9f604feea8afe33872444b868`
- 대상 slug: `taiwan-road-rage-reversing-into-tailgater-no-self-defense`
- 변경: KO/EN/JA/ZH 각각 AI 작성 주체 문자열 1개만 삭제. 다른 문자 삽입·대체는 없다.
- frontmatter, 내부 author, 이미지 AI 출처, 법률 내용, URL, 모든 숫자와 확인일, 기타 면책 문구 및 모든 줄바꿈을 보존했다.

## 정확한 변경과 해시

### `src/content/columns/122-taiwan-road-rage-reversing-into-tailgater-no-self-defense.md:116`

- 제거 문자열: `법률 AI 어시스턴트가 `
- 원본 SHA-256: `b0025a337a766cd4f879ff921f68010879e125b94ce40673be2033a74a0b9783`
- 적용 후 예상 SHA-256: `8bf2aab4b729823f79d988d99e2e5275e4b3f55edc1573f7e64e83f2adb5a8c0`

```diff
-이 글은 법률 AI 어시스턴트가 공개 판결문과 법령을 바탕으로 작성했습니다. 자료 확인일: 2026-10-03.
+이 글은 공개 판결문과 법령을 바탕으로 작성했습니다. 자료 확인일: 2026-10-03.
```

### `src/content/columns-en/122-taiwan-road-rage-reversing-into-tailgater-no-self-defense.md:130`

- 제거 문자열: `by the site's Legal AI Assistant `
- 원본 SHA-256: `50f6974dde7ac078849dc907566f9b807bb6675c22414ffcd131e5fe18a866f3`
- 적용 후 예상 SHA-256: `f46a35553250caf9c4330cbc2fface037eba74c3c92643091343fa0609a20a2b`

```diff
-This column was written by the site's Legal AI Assistant from public court judgments and statutes. Sources checked on 3 October 2026.
+This column was written from public court judgments and statutes. Sources checked on 3 October 2026.
```

### `src/content/columns-ja/122-taiwan-road-rage-reversing-into-tailgater-no-self-defense.md:149`

- 제거 문자열: `法律AIアシスタントが`
- 원본 SHA-256: `593d152ca6e69b3b392bcb256fce288cc1cb999d49ebe78534157dd0595db515`
- 적용 후 예상 SHA-256: `c3b69068ffa425e8cd47003d9444acefd5ab7c0a6ca2cb6c2466e894fc254d77`

```diff
-この記事は、法律AIアシスタントが台湾の公開判決文と法令をもとに作成しました。資料確認日：2026年10月3日。
+この記事は、台湾の公開判決文と法令をもとに作成しました。資料確認日：2026年10月3日。
```

### `src/content/columns-zh/122-taiwan-road-rage-reversing-into-tailgater-no-self-defense.md:142`

- 제거 문자열: `由法律AI助理`
- 원본 SHA-256: `46fc1f700ae93f48ab6ac3bad67804d3f7d8a8b6a901e714287ce78e46012d54`
- 적용 후 예상 SHA-256: `8dacce19968145d00eacff36e36934e37f42b5465c69d9cbad1ce63de4b423fa`

```diff
-本文由法律AI助理依據公開判決書與法規撰寫，資料確認日：2026-10-03。
+本文依據公開判決書與法規撰寫，資料確認日：2026-10-03。
```

## 검증 명령 및 결과

검증용 임시 디렉터리에 네 원본 파일만 복사한 다음 아래 명령을 수행했다. 실제 저장소에는 적용하지 않았다.

```text
git apply --check /Users/son7/tseng-fraud-editorial-20261003/ai-byline-regression/traffic122-footer.patch
git apply /Users/son7/tseng-fraud-editorial-20261003/ai-byline-regression/traffic122-footer.patch
git apply --reverse --check /Users/son7/tseng-fraud-editorial-20261003/ai-byline-regression/traffic122-footer.patch
git apply --reverse /Users/son7/tseng-fraud-editorial-20261003/ai-byline-regression/traffic122-footer.patch
PASS all commands: exit 0
PASS exactly one removal in each reserved line: 4 / 4
PASS frontmatter / URLs / digit sequences unchanged: 4 / 4
PASS all bytes before and after removed substring unchanged: 4 / 4
PASS all non-footer lines unchanged: 4 / 4
PASS restoring only removed substring reproduces original bytes: 4 / 4
PASS temporary apply matches expected after bytes: 4 / 4
PASS temporary reverse apply matches original bytes: 4 / 4
PASS actual source bytes remain unchanged after artifact generation: 4 / 4
PASS temporary validation directory cleaned up

git apply --numstat /Users/son7/tseng-fraud-editorial-20261003/ai-byline-regression/traffic122-footer.patch
1	1	src/content/columns/122-taiwan-road-rage-reversing-into-tailgater-no-self-defense.md
1	1	src/content/columns-en/122-taiwan-road-rage-reversing-into-tailgater-no-self-defense.md
1	1	src/content/columns-ja/122-taiwan-road-rage-reversing-into-tailgater-no-self-defense.md
1	1	src/content/columns-zh/122-taiwan-road-rage-reversing-into-tailgater-no-self-defense.md
```

전체 글 범위 탐색은 별도 탐색 에이전트/주 에이전트의 담당이다. 이 산출물의 직접 검증 범위는 승인된 column122 네 파일과 정확한 네 푸터 줄이다.
