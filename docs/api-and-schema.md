## 🛠️ 링크링 캘린더 API 엔드포인트 및 데이터 스키마 초안

### 1. 인증 및 사용자 관리 (Auth & User)

| HTTP Method | 엔드포인트 (Endpoint) | 설명 | **보호 (JWT 필요)** |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | 사용자 계정 생성 (회원가입). | ❌ |
| `POST` | `/api/auth/login` | 로그인 및 Access/Refresh Token 발급. | ❌ |
| `POST` | `/api/auth/refresh` | Refresh Token을 사용하여 새 Access Token 발급. | ❌ |
| `POST` | `/api/auth/logout` | 로그아웃 처리 (Refresh Token 무효화). | ❌ |
| `GET` | `/api/user/profile` | 현재 로그인된 사용자 정보 조회. | ✅ |
| `PUT` | `/api/user/theme` | 사용자 테마 설정 변경. | ✅ |

#### 데이터 스키마 (Request / Response)

| API | 요청 (Request Body) | 응답 (Response Body) |
| :--- | :--- | :--- |
| `/api/auth/register` | `email: string`, `password: string`, `nickname: string` | `message: string` (성공 메시지) |
| `/api/auth/login` | `email: string`, `password: string` | `accessToken: string`, `refreshToken: string`, `user: {id: number, email: string, nickname: string}` |
| `/api/user/theme` | `themeName: 'Classic' | 'Anime' | 'Gothic'` | `message: string`, `currentTheme: string` |

-----

### 2. 일정 관리 (Schedule)

일정(Schedule) API는 사용자 ID 기반으로 데이터를 처리하며, 일정 항목 자체에 하이퍼링크 필드가 포함됩니다.

| HTTP Method | 엔드포인트 (Endpoint) | 설명 | **보호 (JWT 필요)** |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/schedules` | 새 일정 생성. | ✅ |
| `GET` | `/api/schedules` | 특정 기간의 일정 목록 조회. | ✅ |
| `GET` | `/api/schedules/:id` | 단일 일정 상세 조회. | ✅ |
| `PUT` | `/api/schedules/:id` | 기존 일정 수정. | ✅ |
| `DELETE` | `/api/schedules/:id` | 일정 삭제. | ✅ |

#### 데이터 스키마 (Request / Response)

| API | 요청 (Request Body) | 응답 (Response Body) |
| :--- | :--- | :--- |
| `POST /api/schedules` | `title: string`, `content: string`, `date: string` (ISO 8601), `**hyperlinkUrl: string**` | `schedule: ScheduleObject` (생성된 객체) |
| `GET /api/schedules` | **Query Params:** `startDate: string`, `endDate: string` | `schedules: ScheduleObject[]` |
| `PUT /api/schedules/:id` | `title?: string`, `content?: string`, `date?: string`, `hyperlinkUrl?: string` | `message: string` |

$*$ **ScheduleObject 타입 정의:**

```typescript
interface ScheduleObject {
  id: number;
  title: string;
  content: string;
  date: string; // ISO 8601
  hyperlinkUrl: string;
  userId: number;
}
```

-----

### 3. 퀵-링크 보드 (QuickLink)

퀵-링크 API는 캘린더와 독립적으로, 사용자가 개인화된 링크를 관리할 수 있도록 지원합니다.

| HTTP Method | 엔드포인트 (Endpoint) | 설명 | **보호 (JWT 필요)** |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/quicklinks` | 새 퀵-링크 등록. | ✅ |
| `GET` | `/api/quicklinks` | 사용자 소유의 모든 퀵-링크 목록 조회 (OrderIndex 순). | ✅ |
| `PUT` | `/api/quicklinks/:id` | 퀵-링크 정보 수정. | ✅ |
| `PUT` | `/api/quicklinks/reorder` | 퀵-링크 목록의 순서(OrderIndex) 일괄 수정 (D&D 처리용). | ✅ |
| `DELETE` | `/api/quicklinks/:id` | 퀵-링크 삭제. | ✅ |

#### 데이터 스키마 (Request / Response)

| API | 요청 (Request Body) | 응답 (Response Body) |
| :--- | :--- | :--- |
| `POST /api/quicklinks` | `title: string`, `url: string` | `quickLink: QuickLinkObject` (생성된 객체) |
| `GET /api/quicklinks` | N/A | `quickLinks: QuickLinkObject[]` |
| `PUT /api/quicklinks/reorder` | `updates: { id: number, orderIndex: number }[]` | `message: string` (순서 변경 성공 메시지) |

$*$ **QuickLinkObject 타입 정의:**

```typescript
interface QuickLinkObject {
  id: number;
  title: string;
  url: string;
  orderIndex: number;
  iconUrl?: string; // 선택적 필드
  userId: number;
}
```
