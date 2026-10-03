# 공개 AI 작성자 푸터 회귀 제거 패치 — 2026-10-03

산출물만 준비했다. 소스·worktree 파일·인덱스·커밋·원격 저장소는 수정하지 않았다. 수신 담당자가 통합하고 검증할 수 있는 b04 네 파일 패치이다. 최초 EN118/JA117 두 파일 범위에서 담당자의 추가 지시에 따라 KO116/ZH119까지 포함했다.

- 읽은 저장소: `/Users/son7/Projects/tseng-law-fraud-editorial-20261003`
- 읽은 HEAD: `7816ec280cd7438ca664b6afabae0d78e1e954a9`
- 범위: KO116/JA117/EN118/ZH119의 공개 AI 작성 주체만 제거. KO는 `AI가 `, JA는 `AIが作成した`, ZH는 `由AI`를 삭제했다. EN은 `AI-prepared `를 삭제하고 문장 첫 `general`을 `General`로 대문자화했다.
- frontmatter, 내부 작성자 provenance, 이미지 AI 출처, 나머지 본문, 일반정보/법률자문 제한, 출처 확인일 및 줄바꿈은 그대로 유지했다.
- 각 원문 접두부 문자열은 정확히 1회 발견됐다. 치환은 메모리에서만 수행했다. 치환 앞·뒤 바이트 동일성과 역치환 후 원본 바이트 완전 일치를 검증했다.
- 네 파일 모두 frontmatter, URL 목록 및 숫자열이 원본과 동일하다.

## 파일별 정확한 변경과 해시

### `src/content/columns/116-taiwan-trade-secrets-act-criminal-civil-korean-companies.md:98`

- 원본 SHA-256: `aa41029cb796e76a7a4b910ddbc5ce4813e38723e95996576fed51f779c7c75e`
- 적용 후 예상 SHA-256: `f6582862d8cdaaf1c7a36995fc74c5fb9892fccaab8dce33f27d0ed20988f6dd`
- 정확한 치환: `이 글은 AI가 공개` → `이 글은 공개`

변경 전 푸터:

```text
*이 글은 AI가 공개 법령과 판결을 바탕으로 작성한 일반 정보이며, 개별 사안에 대한 법률 자문이 아닙니다. 자료 확인일: 2026년 10월 3일.*
```

변경 후 푸터:

```text
*이 글은 공개 법령과 판결을 바탕으로 작성한 일반 정보이며, 개별 사안에 대한 법률 자문이 아닙니다. 자료 확인일: 2026년 10월 3일.*
```

### `src/content/columns-ja/117-japanese-materials-supplier-taiwan-nda-trade-secrets.md:119`

- 원본 SHA-256: `4b7806c91651ed7b0b2e928f5a82041213dabd671a6505eecd3d7246f0b5fb3b`
- 적용 후 예상 SHA-256: `6093db1843056ad324eeda92441e7fe53a4ce5e4cdcaeca76c0342d0c94f3146`
- 정확한 치환: `*AIが作成した一般的な情報` → `*一般的な情報`

변경 전 푸터:

```text
*AIが作成した一般的な情報であり、個別案件への法律助言ではありません。資料は2026年10月3日（韓国時間）に確認しました。*
```

변경 후 푸터:

```text
*一般的な情報であり、個別案件への法律助言ではありません。資料は2026年10月3日（韓国時間）に確認しました。*
```

### `src/content/columns-en/118-tsmc-arizona-chips-act-taiwan-outbound-approval.md:106`

- 원본 SHA-256: `f1433ebb20a57d17e28a30b16357c04642424daa7beafa03bf6b6587541ab51c`
- 적용 후 예상 SHA-256: `99bc5d4cf7d81f064c98689af9ea84bae15b13aa2858fb34a2cb973f5e22a0f6`
- 정확한 치환: `*AI-prepared general information` → `*General information`

변경 전 푸터:

```text
*AI-prepared general information, not individualized legal advice. Sources checked October 3, 2026 (Taiwan time).*
```

변경 후 푸터:

```text
*General information, not individualized legal advice. Sources checked October 3, 2026 (Taiwan time).*
```

### `src/content/columns-zh/119-taiwan-semiconductor-employees-overseas-assignment-labor-law.md:145`

- 원본 SHA-256: `d56431bab13c508c357bc264f83ad473e4b1ed3acaf21331cf7fb3546a3d6dc4`
- 적용 후 예상 SHA-256: `8a9fd16f2ae443a122d5fdbc8b2b26b98f0c2781255bbdd1ac5576bcb6ccb16b`
- 정확한 치환: `本文由AI依公開` → `本文依公開`

변경 전 푸터:

```text
*本文由AI依公開資料撰寫，提供一般法律資訊，不是個別案件的法律意見。資料查核日：2026年10月3日（韓國標準時間）。*
```

변경 후 푸터:

```text
*本文依公開資料撰寫，提供一般法律資訊，不是個別案件的法律意見。資料查核日：2026年10月3日（韓國標準時間）。*
```

## 적용 전 읽기 전용 확인

```text
git apply --check /Users/son7/tseng-fraud-editorial-20261003/ai-byline-regression/byline-footer.patch
exit 0
git apply --numstat /Users/son7/tseng-fraud-editorial-20261003/ai-byline-regression/byline-footer.patch
1	1	src/content/columns/116-taiwan-trade-secrets-act-criminal-civil-korean-companies.md
1	1	src/content/columns-ja/117-japanese-materials-supplier-taiwan-nda-trade-secrets.md
1	1	src/content/columns-en/118-tsmc-arizona-chips-act-taiwan-outbound-approval.md
1	1	src/content/columns-zh/119-taiwan-semiconductor-employees-overseas-assignment-labor-law.md
```

## 추가 확인용 KO/ZH 경로

- KO116: `https://tseng-law.com/ko/columns/taiwan-trade-secrets-act-criminal-civil-korean-companies`
- ZH119: `https://tseng-law.com/zh-hant/columns/taiwan-semiconductor-employees-overseas-assignment-labor-law`

위 URL은 경로 확인용이다. 이 작업자는 라이브 검증이나 배포를 수행하지 않았다.

## 결과

```text
PASS exact replacement count: KO116 1, JA117 1, EN118 1, ZH119 1
PASS unchanged frontmatter / URLs / digits: 4 / 4
PASS exact prefix-and-suffix bytes around replacement: 4 / 4
PASS reversible replacement reproduces original bytes: 4 / 4
PASS git apply --check: exit 0
PASS source bytes unchanged after artifact generation: 4 / 4
```
