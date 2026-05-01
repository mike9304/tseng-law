# CODEX 발주 프롬프트 — F5 Forms 확장 (Wix Forms parity)

> **발행일**: 2026-04-30
> **선행**: C2 Forms MVP 완료 (form/form-input/form-textarea/form-submit 4 kinds + `/api/forms/submit`)
> **분담**: Codex 담당 — 시각/UX 디자인 + Form Flow Editor admin UI. 별 트랙 Claude Agent로 schema/conditional engine 진행.
> **Wix 디자인 참조**: Wix Forms — drag-drop 필드 추가, conditional rules editor (visual), multi-step (페이지 분할 + progress), Submissions 관리자 (목록 + 상세 + export)

---

## 1. 목적

C2의 단순 폼을 **Wix Forms 수준**으로. 법률사무소 사이트의 conversion 핵심 채널.

**Wix가 가진 것 / 우리가 부족한 것**:
| Wix 기능 | 현재 호정 | F5 목표 |
|---|---|---|
| select / radio / checkbox | ❌ | ✅ |
| file upload | ❌ | ✅ |
| date / datetime | ❌ | ✅ |
| captcha (hCaptcha/Turnstile) | ❌ | ✅ |
| multi-step (페이지 분할) | ❌ | ✅ |
| conditional logic (이전 답에 따라 표시) | ❌ | ✅ |
| Form Submissions Manager | ❌ | ✅ |
| email response automation | 부분 | ✅ |
| validation messages | 약함 | ✅ |

---

## 2. Wix 디자인 패턴 참조

### 2.1 Form Field Library (카탈로그 패턴)
- 좌측 패널에 카테고리: "기본 / 선택 / 파일 / 날짜 / 고급"
- 각 필드 카드: 아이콘 + 이름 + 한 줄 설명. 드래그-드롭으로 폼에 추가

### 2.2 Conditional Logic Editor (visual)
- "이 필드를 보임 / 숨김 / 필수로 만들기" + "다음 조건일 때:"
- 조건: `{ field, operator: equals|notEquals|contains|isEmpty, value }`
- 다중 조건 AND/OR
- 시각적 If-Then 블록

### 2.3 Multi-step (단계별 폼)
- 폼 위젯에 "단계 추가" 버튼
- 각 단계: 별도 page (필드 그룹) + Next/Previous 버튼
- 진행률 표시 (1/3 / 2/3 / 3/3 또는 dots)
- 마지막 단계만 Submit

### 2.4 Submissions Manager (관리자)
- 목록: 폼별 그룹 → 제출 항목 (제출 시각/이메일/이름)
- 상세: 모든 필드 값 + IP/UA/로케일
- Filter (날짜 / 폼 / 읽음/미읽음)
- Export CSV
- Bulk archive / delete

---

## 3. 작업 범위

### 3.1 신규 5 form kinds

#### `form-select`
```typescript
z.object({
  name: z.string().min(1).max(80),
  label: z.string().max(120),
  required: z.boolean().default(false),
  options: z.array(z.object({
    value: z.string().max(200),
    label: z.string().max(200),
  })).min(1).max(50),
  defaultValue: z.string().optional(),
  placeholder: z.string().max(120).optional(),
  multiple: z.boolean().default(false),
})
```

#### `form-checkbox`
```typescript
z.object({
  name: z.string().min(1).max(80),
  label: z.string().max(200),  // 체크박스는 옆 라벨이 본체
  required: z.boolean().default(false),
  defaultChecked: z.boolean().default(false),
  // 다중 옵션도 지원 (그룹)
  options: z.array(z.object({
    value: z.string(),
    label: z.string(),
  })).optional(),
})
```

#### `form-radio`
```typescript
z.object({
  name: z.string().min(1).max(80),
  label: z.string().max(200),
  required: z.boolean().default(false),
  options: z.array(z.object({
    value: z.string(),
    label: z.string(),
  })).min(2).max(20),
  defaultValue: z.string().optional(),
  layout: z.enum(['vertical', 'horizontal']).default('vertical'),
})
```

#### `form-file`
```typescript
z.object({
  name: z.string().min(1).max(80),
  label: z.string().max(120),
  required: z.boolean().default(false),
  accept: z.string().max(200).default('image/*,application/pdf'),
  maxSizeMb: z.number().int().min(1).max(50).default(10),
  multiple: z.boolean().default(false),
})
```

#### `form-date`
```typescript
z.object({
  name: z.string().min(1).max(80),
  label: z.string().max(120),
  required: z.boolean().default(false),
  type: z.enum(['date', 'datetime-local', 'time', 'month']).default('date'),
  min: z.string().optional(),  // ISO date
  max: z.string().optional(),
  defaultValue: z.string().optional(),
})
```

### 3.2 Captcha 통합

- `form` kind content에 `captcha: 'none' | 'hcaptcha' | 'turnstile'` 추가
- env: `HCAPTCHA_SITE_KEY` / `HCAPTCHA_SECRET` (또는 Cloudflare Turnstile)
- Form Element render에 captcha widget mount
- `/api/forms/submit` 검증

### 3.3 Multi-step

- `form` kind content에 `steps: Array<{ id, title, fieldNodeIds: string[] }>` 추가 (선택, 없으면 기존 single-step)
- Form Element render 시 active step만 표시 + Next/Previous + 진행률
- 마지막 step에서만 form-submit이 effective

### 3.4 Conditional Logic

`form-input` / `form-select` / 모든 form 필드 공통 schema 확장:
```typescript
showIf: z.object({
  fieldName: z.string(),  // 같은 form 내 다른 field name
  operator: z.enum(['equals', 'notEquals', 'contains', 'isEmpty', 'isNotEmpty']),
  value: z.string().optional(),
}).optional(),
```

Form Element render 시 `showIf` 평가 → 해당 필드 보임/숨김.

`src/lib/builder/forms/conditional.ts` 신규 — evaluator function.

### 3.5 Form Flow Editor (admin)

**라우트**: `/admin-builder/forms-flow`
- 모든 form 노드 목록 (페이지별 그룹화)
- 클릭 시 폼 미니 미리보기 + 단계/조건 편집

이번 배치는 **목록 + 상세 link만**. 본격 visual editor는 후속 (form 노드는 페이지 빌더에서 직접 편집).

### 3.6 Submissions Manager

**라우트**: `/admin-builder/forms/submissions`
- 좌측: 폼 목록 (formName 단위)
- 우측: 선택된 폼의 제출 목록 (date / email / 발신자 / 읽음 상태)
- 클릭 시 상세 (모든 필드 값 + IP / UA / 제출 시각)
- 상단 toolbar: search, date filter, export CSV 버튼, archive bulk
- 백엔드: 기존 `forms-submissions/{formId}/{date}/{id}.json` Blob에서 읽기

**파일**:
- `src/app/(builder)/[locale]/admin-builder/forms/submissions/page.tsx`
- `src/components/builder/forms/SubmissionsListView.tsx`
- `src/components/builder/forms/SubmissionDetailModal.tsx`

### 3.7 Validation messages

각 필드에 inline validation:
- 빈 required → "필수 입력 항목입니다"
- email 형식 → "유효한 이메일 형식이 아닙니다"
- minLength 미달 → "최소 N자 이상 입력하세요"
- pattern 불일치 → custom message (schema에 `errorMessage` 필드 추가)

Form Element render 시 submit 시도 → 클라이언트 검증 → 필드별 빨간 메시지 표시.

### 3.8 Email response automation (확장)

기존 `/api/forms/submit`에 자동 응답 메일 추가:
- form content에 `autoReplyEnabled`, `autoReplyTemplate` 필드 추가
- 제출 후 사용자 이메일로 "접수 확인" 이메일 자동 발송 (Resend)
- 운영자 이메일에는 제출 알림 (기존)

---

## 4. 디자인 톤 (Wix 패턴)

- 폼 필드 카드: minimal border, padding 8px, 제출 시 부드러운 transition
- Captcha widget: 폼 끝 (submit 버튼 위)
- Multi-step progress: dot pagination 또는 thin bar (1/3 / 2/3 / 3/3)
- Conditional 필드 hide 시 fadeOut 200ms (남은 필드 자동 reflow)
- Submissions Manager: 밝은 회색 bg, 행 호버 강조, 새 제출은 강조 dot
- 다크모드 호환

---

## 5. 검증 방법

```bash
cd /Users/son7/Projects/tseng-law
npm run lint
npm run build
npx tsc --noEmit --incremental false
```

**브라우저**:
1. `/ko/admin-builder` 좌측 + 패널에 5 신규 필드 등장
2. Form 추가 + form-select + form-radio 추가 → 각 필드 inspector에서 옵션 추가
3. form-radio 라디오 그룹 표시
4. Conditional: form-radio "사건 유형" → "교통사고" 선택 시 새 form-input "사고 일시" 보임
5. Multi-step: 폼 inspector → "단계 추가" → 폼 분할 → Next/Previous 동작
6. 게시 페이지 form 제출 → captcha 통과 → API 200 → 자동응답 이메일
7. `/admin-builder/forms/submissions` 진입 → 제출 목록 + 상세 → CSV export
8. validation 빈 required → 빨간 메시지

---

## 6. 작업 규칙

- **F1/F2/F3 영역 건드리지 말 것**
- **F4 영역 건드리지 말 것** (Translation Manager)
- **C2 기존 form/form-input/form-textarea/form-submit 보존**
- legacy-*.tsx 본문 수정 금지
- composite/Render.tsx legacy 폴백 제거 금지
- `git push --force`, `--no-verify` 금지

## 7. Definition of Done

- [ ] 5 신규 kinds (form-select / form-checkbox / form-radio / form-file / form-date)
- [ ] Captcha 통합 (hCaptcha 또는 Turnstile)
- [ ] Multi-step 동작
- [ ] Conditional logic engine + 모든 필드 schema 적용
- [ ] Submissions Manager admin
- [ ] Validation messages
- [ ] Email auto-reply
- [ ] lint/build/tsc 통과
- [ ] 브라우저 8단계 통과
- [ ] SESSION.md commit

---

이 프롬프트: `/Users/son7/Projects/tseng-law/CODEX-PROMPT-FORMS-PLUS-F5.md`
