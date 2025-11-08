# 로컬 테스트 체크리스트

## ✅ 완료된 항목

### 1. 환경 설정
- [x] `.env` 파일 존재 확인 (`packages/server/.env`)
- [x] `DATABASE_URL` 설정 확인 (`file:./dev.db` - SQLite)
- [x] 의존성 설치 완료 (`pnpm install`)
- [x] Prisma 클라이언트 생성 완료 (`pnpm prisma:generate`)

### 2. 코드 수정
- [x] `Calendar.tsx` 중복 코드 제거
- [x] TypeScript 오류 수정 (vite-env.d.ts 추가, useQuery 타입 수정)
- [x] 누락된 API 엔드포인트 추가:
  - `GET /api/schedules/:id` - 일정 상세 조회
  - `PUT /api/schedules/:id` - 일정 수정
  - `DELETE /api/schedules/:id` - 일정 삭제
  - `PUT /api/quicklinks/:id` - 퀵링크 수정
  - `PUT /api/quicklinks/reorder` - 퀵링크 순서 변경

### 3. 프로젝트 구조
- [x] 서버: Express + TypeScript + Prisma (SQLite)
- [x] 프론트엔드: React + TypeScript + Vite
- [x] 인증: JWT (Access Token + Refresh Token)
- [x] API: REST API (tRPC는 설정되어 있으나 사용되지 않음)

## ⚠️ 주의사항

### 1. tRPC 설정
- `packages/web/src/trpc.ts` 파일이 존재하지만 실제로는 사용되지 않음
- 현재 프로젝트는 REST API를 사용 중
- 필요시 tRPC를 제거하거나 REST API를 tRPC로 마이그레이션 고려

### 2. 데이터베이스
- 현재 SQLite 사용 중 (`file:./dev.db`)
- PostgreSQL로 전환하려면:
  1. `packages/server/prisma/schema.prisma`에서 `provider = "postgresql"`로 변경
  2. `DATABASE_URL`을 PostgreSQL 연결 문자열로 변경
  3. 마이그레이션 재실행

### 3. 환경 변수
- `JWT_SECRET`이 기본값 사용 중 (프로덕션에서는 반드시 변경 필요)
- `VITE_API_URL`은 기본값 `http://localhost:4000/api` 사용

## 🚀 로컬 실행 방법

### 방법 1: pnpm으로 직접 실행
```bash
# 루트 디렉토리에서
pnpm dev
```

이 명령은 `packages/server`와 `packages/web`을 동시에 실행합니다.
- 서버: http://localhost:4000
- 웹: http://localhost:5173

### 방법 2: Docker Compose 사용
```bash
docker compose up --build
```

- 서버: http://localhost:4000
- 웹: http://localhost:5173 (docker-compose.yml에서는 5173:4173으로 매핑)

### 방법 3: 개별 실행
```bash
# 터미널 1: 서버 실행
cd packages/server
pnpm dev

# 터미널 2: 웹 실행
cd packages/web
pnpm dev
```

## 📋 테스트 시나리오

1. **회원가입**
   - `POST /api/auth/register`
   - email, password, nickname 필요

2. **로그인**
   - `POST /api/auth/login`
   - Access Token과 Refresh Token 발급

3. **일정 생성**
   - `POST /api/schedules` (JWT 필요)
   - title, date, hyperlinkUrl 필요

4. **일정 조회**
   - `GET /api/schedules` (JWT 필요)
   - 사용자의 모든 일정 조회

5. **퀵링크 생성**
   - `POST /api/quicklinks` (JWT 필요)
   - title, url 필요

## 🔍 확인된 문제점

1. ✅ **해결됨**: Calendar.tsx 중복 코드
2. ✅ **해결됨**: TypeScript 타입 오류
3. ✅ **해결됨**: 누락된 API 엔드포인트

## 📝 추가 작업 권장사항

1. **에러 핸들링 개선**: 프론트엔드에서 API 에러 처리 강화
2. **테스트 코드 작성**: API 엔드포인트에 대한 단위 테스트 추가
3. **환경 변수 검증**: 서버 시작 시 필수 환경 변수 확인
4. **로깅 개선**: 구조화된 로깅 시스템 도입
5. **API 문서화**: Swagger/OpenAPI 문서 생성

