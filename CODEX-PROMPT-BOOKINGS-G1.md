# CODEX 발주 프롬프트 — G1 Bookings MVP (Wix Bookings parity)

> **발행일**: 2026-04-30
> **범위**: 가장 큰 단일 트랙. **1주 풀 투자** 권장. Codex (admin UI 디자인 + 캘린더 시각) + Claude Agent (engine + API + widget logic) **동시 작업**.
> **Wix 디자인 참조**: Wix Bookings — Service Catalog / Staff / Availability Calendar / Booking flow / Bookings List

---

## 1. 목적

호정 법률사무소의 **상담 예약 시스템**. 변호사 상담이 사이트 최대 conversion 채널이므로 Wix Bookings 수준의 완성도 필요.

**사용자 경험**:
1. 방문자가 사이트에서 "상담 예약" 클릭 → service 선택 (`초기 상담 30분` / `심층 상담 1시간` / `방문 상담`) → 변호사 선택 → 가능한 시간 slot 클릭 → 정보 입력 → 예약 완료 → 이메일 확인
2. 호정 직원: 관리자 캘린더에서 모든 예약 보고 + 새 예약 만들기 + 취소/변경 + 변호사 가능 시간 설정

---

## 2. Wix 디자인 패턴 참조

### 2.1 Service Catalog
- 카드 그리드: 각 서비스 (이미지 + 이름 + 가격 + 소요시간 + 설명)
- 카드 클릭 → 예약 흐름 진입

### 2.2 Staff Selector
- "원하는 담당자가 있나요?" → 변호사 카드 그리드 (사진 + 이름 + 전문분야)
- "아무나" 옵션 (자동 배정)

### 2.3 Date Picker + Time Slots
- 좌측 작은 month calendar (사용 가능한 날짜만 강조)
- 우측 시간 slot 리스트 (해당 날짜의 가능 시간들, 30분 단위)
- 선택 시 강조 + Continue 버튼

### 2.4 Customer Info Form
- 이름 / 이메일 / 전화 / 메모 (custom)
- 이용약관 동의

### 2.5 Confirmation
- 예약 요약 + "이메일 확인하셨나요?" + "캘린더에 추가" + "내 예약 보기"

### 2.6 Admin Calendar (Wix Dashboard 패턴)
- 상단 toolbar: 일/주/월 뷰 토글 + 날짜 navigator + 변호사 필터 + "+ 새 예약"
- 메인: 전통적 캘린더 (Google Calendar 패턴)
- 예약 클릭 → 상세 modal (이름/이메일/전화/서비스/시간/취소 버튼)

### 2.7 Staff Availability Editor
- 변호사 선택 → "근무 시간": 요일별 시간 (월 09:00-18:00, 화 09:00-18:00, ...)
- "Buffer time" (예약 사이 휴식 시간 15분)
- "Blocked dates" (휴가 / 회의 / 휴일)

---

## 3. 작업 범위 (4 도메인 + 위젯 + 캘린더)

### 3.1 데이터 모델

```typescript
// src/lib/builder/bookings/types.ts (신규)

export interface BookingService {
  serviceId: string;
  slug: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  durationMinutes: number;        // 30/60/90
  priceTwd?: number;              // 또는 KRW
  image?: string;
  category?: string;
  staffIds: string[];             // 가능 담당자
  bufferBeforeMinutes: number;    // 0
  bufferAfterMinutes: number;     // 15
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Staff {
  staffId: string;
  name: Record<Locale, string>;
  photo?: string;
  title: Record<Locale, string>;  // "변호사" / "律師" / "Attorney"
  bio?: Record<Locale, string>;
  email?: string;                 // 알림용
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StaffAvailability {
  staffId: string;
  weekly: Record<DayOfWeek, Array<{ start: string; end: string }>>;  // 'monday' → [{start:'09:00', end:'18:00'}]
  blockedDates: Array<{ start: string; end: string; reason?: string }>;  // ISO
  timezone: string;               // 'Asia/Taipei'
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Booking {
  bookingId: string;
  serviceId: string;
  staffId: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    notes?: string;
    locale: Locale;
  };
  startAt: string;                // ISO
  endAt: string;                  // ISO (계산 = startAt + service.duration)
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  source: 'web' | 'admin';
  createdAt: string;
  updatedAt: string;
  reminders: Array<{ sentAt: string; type: 'email-confirmation' | 'email-reminder-24h' | 'email-reminder-1h' }>;
}
```

저장: Vercel Blob 또는 file fallback. `bookings/{services,staff,availability,bookings}/{id}.json`.

### 3.2 Availability Engine

`src/lib/builder/bookings/availability.ts`:

```typescript
export interface SlotRequest {
  serviceId: string;
  staffId: string;
  date: string;                  // 'YYYY-MM-DD'
}

export interface Slot {
  startAt: string;
  endAt: string;
  staffId: string;
}

export async function computeAvailableSlots(
  request: SlotRequest,
): Promise<Slot[]> {
  // 1. service.durationMinutes 가져오기
  // 2. staff.weeklyAvailability에서 해당 요일 가능 시간 블록 가져오기
  // 3. blockedDates에서 해당 날짜 제외
  // 4. 기존 bookings (해당 staff, status != cancelled) 가져와서 충돌 시간 제외
  // 5. service.bufferBefore/After 적용
  // 6. duration 단위로 slot 생성
}

export async function isSlotAvailable(
  request: { serviceId; staffId; startAt; durationMinutes },
): Promise<boolean> {
  // 단일 slot 검증 (예약 직전 race condition 대비)
}
```

### 3.3 API

신규 API endpoints:

#### Admin (guardMutation)
- `GET /api/builder/bookings/services` — list
- `POST /api/builder/bookings/services` — create
- `PATCH /api/builder/bookings/services/[id]` — update
- `DELETE /api/builder/bookings/services/[id]` — soft delete (isActive=false)
- 같은 패턴으로 `/staff` + `/staff/[id]/availability` (PATCH for editing)
- `GET /api/builder/bookings/calendar?from=&to=&staffId=` — 예약 + 차단 시간 모두
- `POST /api/builder/bookings/admin-create` — admin이 직접 예약
- `PATCH /api/builder/bookings/[id]` — 변경/취소

#### Public (no auth)
- `GET /api/booking/services?locale=` — 활성 서비스 목록 (메타만, 가격/이름)
- `GET /api/booking/staff?serviceId=` — 해당 서비스 가능 staff
- `GET /api/booking/availability?serviceId=&staffId=&date=` — slot 리스트
- `POST /api/booking/book` — 예약 생성 (rate-limit + email regex + slot 재검증)

### 3.4 Admin UI

신규 라우트:
- `/admin-builder/bookings/services` — Service CRUD (카드 그리드 + 생성/편집 modal)
- `/admin-builder/bookings/staff` — Staff CRUD (사진 업로드 + 정보)
- `/admin-builder/bookings/staff/[id]/availability` — 주간 시간 grid + blocked dates calendar
- `/admin-builder/bookings/calendar` — **메인 admin 캘린더** (월/주/일 뷰)

**캘린더 컴포넌트**: 
- 라이브러리 사용 가능: `@fullcalendar/react` 또는 자체 구현 (CSS grid)
- 시각적 일정 표시 + 클릭으로 detail modal
- drag-resize로 시간 변경 (선택)

### 3.5 Booking Widget (페이지 빌더)

**신규 kind**: `booking-widget`

```typescript
content: z.object({
  serviceId: z.string().optional(),     // 비우면 모든 active service 보여줌
  staffId: z.string().optional(),
  defaultMode: z.enum(['service-first', 'staff-first', 'date-first']).default('service-first'),
  showServiceImages: z.boolean().default(true),
  primaryColor: builderColorValueSchema.optional(),
  successMessage: z.string().default('예약이 완료되었습니다'),
  redirectAfterBooking: z.string().optional(),
})
```

Element: 클라이언트 컴포넌트로 4-step 플로우 (Service → Staff → DateTime → Customer Info → Confirm).

### 3.6 이메일 알림 (Resend)

**Template** (자동 응답):
- 사용자에게: 예약 확인 (이름 / 일시 / 변호사 / 위치 / 변경/취소 링크)
- 호정 직원에게: 새 예약 알림 (모든 정보)
- 24h 전 리마인더 (cron 또는 background job)

`src/lib/builder/bookings/notifications.ts`:
```typescript
export async function sendBookingConfirmation(booking: Booking) { /* ... */ }
export async function sendBookingReminder(booking: Booking) { /* ... */ }
```

### 3.7 Google Calendar Sync (선택, 시간 남으면)

- staff에 `googleCalendarId` 추가
- 예약 생성 시 GCal 이벤트 자동 생성 (OAuth 통한 Calendar API)
- 양방향 sync는 후속

---

## 4. 디자인 톤 (Wix Bookings 패턴)

- Service 카드: 큰 이미지 + 짧은 카피 + 가격 강조
- Staff 카드: 동그란 사진 + 이름 + 전문분야 chip + 짧은 bio
- Date picker: month calendar 좁고 깔끔, 가능한 날 primary, 가능한 날 없는 달은 회색
- Time slot: pill 모양 chip, 클릭 시 fill primary
- Confirmation: 큰 체크 아이콘 + 예약 요약 box
- Admin calendar: Google Calendar 패턴, primary color event blocks
- Empty state: 친근한 일러스트
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
1. `/ko/admin-builder/bookings/services` → "새 서비스" → 이름/소요시간/가격 입력 → 저장
2. `/ko/admin-builder/bookings/staff` → 변호사 등록 + 사진
3. staff 가능 시간 편집 (월~금 09:00-18:00, blocked: 휴일)
4. 페이지에 booking-widget 추가 → 게시
5. 게시 페이지에서 예약 흐름 끝까지 (service 선택 → staff → 날짜 → slot → 정보 입력 → 완료)
6. 이메일 확인 (Resend dev sandbox)
7. `/admin-builder/bookings/calendar` 월 뷰에 예약 표시
8. 예약 클릭 → 상세 modal → 취소

---

## 6. 작업 분담 (Codex + Claude Agent 동시)

### Codex 영역 (디자인 + admin UI)
- Service 카드 그리드 + 생성/편집 modal 시각
- Staff 사진 + 정보 카드
- Availability editor (요일 grid + blocked dates calendar)
- **메인 admin 캘린더 시각** (월/주/일 뷰 + event blocks)
- Booking widget 4-step 플로우 시각 (Wix 패턴)
- 이메일 템플릿 디자인

### Claude Agent 영역 (engine + API + logic)
- 4 도메인 schema (BookingService/Staff/StaffAvailability/Booking)
- Availability engine (computeAvailableSlots)
- 12+ API routes (admin + public)
- Booking widget Element 클라이언트 로직 (state machine)
- Email 발송 통합 (Resend)
- 데이터 저장 (Blob/file persistence)

### 파일 분리
- Codex: `src/components/builder/bookings/{ServicesList,StaffList,AvailabilityEditor,Calendar,BookingFlowSteps}.tsx` + 관련 CSS
- Claude: `src/lib/builder/bookings/{types,availability,persistence,notifications}.ts` + API routes + `src/lib/builder/components/bookingWidget/`

### 충돌 회피
- 기존 트랙(F1/F2/F3/F4/F5/B-E 시리즈)과 무관 (신규 도메인)
- bookings/* 폴더 모두 신규
- 데이터 저장은 별도 prefix (`bookings/...`)

---

## 7. Definition of Done

- [ ] Service CRUD (admin UI + API)
- [ ] Staff CRUD (admin UI + API)
- [ ] StaffAvailability editor (주간 시간 + blocked dates)
- [ ] Availability engine (slot 자동 계산)
- [ ] Admin calendar (월/주/일 뷰 + event 표시)
- [ ] booking-widget kind + 4-step 플로우
- [ ] Public booking API (`/api/booking/*`)
- [ ] Email 확인 + 24h 리마인더 (선택: cron)
- [ ] Race condition 방어 (slot 재검증)
- [ ] lint/build/tsc 통과
- [ ] 브라우저 8단계 통과
- [ ] SESSION.md commit + 한줄 요약 갱신

---

## 8. 인수인계

작업 완료 시 commit 분할:
- `G1-1 bookings data model + persistence`
- `G1-2 availability engine + public API`
- `G1-3 admin services/staff/availability CRUD`
- `G1-4 admin calendar`
- `G1-5 booking widget + booking flow`
- `G1-6 email notifications`

다음 후속 (G1.5 또는 별도 트랙):
- Google Calendar sync 양방향
- SMS 알림 (Twilio)
- 결제 통합 (서비스 가격 결제 — Stripe)
- Recurring availability (월 반복 휴무)
- Group booking (여러 명 한 번에)

---

이 프롬프트: `/Users/son7/Projects/tseng-law/CODEX-PROMPT-BOOKINGS-G1.md`
