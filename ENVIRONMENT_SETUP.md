# 환경 설정 가이드

이 프로젝트는 로컬 개발 환경과 프로덕션 환경을 구분하여 관리합니다.

## 서버 환경 변수 설정

### 개발 환경

1. `packages/server/.env.development` 파일을 참고하여 `packages/server/.env` 파일을 생성하거나 수정합니다.

```bash
# packages/server/.env
NODE_ENV=development
PORT=4000
DATABASE_URL="file:./dev.db"
JWT_SECRET="dev-secret-key-change-in-production"
CORS_ORIGIN="http://localhost:5173"
```

### 프로덕션 환경

1. `packages/server/.env.production` 파일을 참고하여 `packages/server/.env` 파일을 생성하거나 수정합니다.

```bash
# packages/server/.env
NODE_ENV=production
PORT=4000
DATABASE_URL="postgresql://user:password@localhost:5432/linkring?schema=public"
JWT_SECRET="CHANGE_THIS_TO_A_SECURE_RANDOM_STRING"
CORS_ORIGIN="https://your-production-domain.com"
```

**중요**: 프로덕션에서는 반드시 `JWT_SECRET`을 안전한 랜덤 문자열로 변경하세요.

## 웹 환경 변수 설정

### 개발 환경

`packages/web/.env.development` 파일이 자동으로 사용됩니다:

```bash
# packages/web/.env.development
VITE_API_URL=http://localhost:4000
```

### 프로덕션 환경

`packages/web/.env.production` 파일을 생성하거나 수정합니다:

```bash
# packages/web/.env.production
VITE_API_URL=https://api.your-domain.com
```

## 환경 변수 우선순위

### 서버
1. `.env` 파일 (최우선)
2. `.env.development` 또는 `.env.production` (NODE_ENV에 따라)
3. 시스템 환경 변수

### 웹 (Vite)
1. `.env.production.local` 또는 `.env.development.local` (로컬 오버라이드)
2. `.env.production` 또는 `.env.development` (모드별)
3. `.env.local` (모든 환경)
4. `.env` (기본값)

## 스크립트 사용법

### 개발 환경

```bash
# 루트에서 모든 패키지 개발 모드 실행
pnpm dev

# 또는 개별 패키지
cd packages/server && pnpm dev
cd packages/web && pnpm dev
```

### 프로덕션 빌드

```bash
# 프로덕션 빌드
pnpm build:prod

# 빌드된 파일 실행
pnpm start
```

### 개발 빌드 (테스트용)

```bash
# 개발 모드로 빌드
pnpm build:dev

# 개발 모드로 실행
pnpm start:dev
```

## 환경 변수 설명

### 서버 (packages/server)

| 변수명 | 설명 | 기본값 | 필수 |
|--------|------|--------|------|
| `NODE_ENV` | 실행 환경 (`development` 또는 `production`) | `development` | 아니오 |
| `PORT` | 서버 포트 | `4000` | 아니오 |
| `DATABASE_URL` | 데이터베이스 연결 문자열 | `file:./dev.db` | 예 |
| `JWT_SECRET` | JWT 토큰 서명용 비밀키 | `your-super-secret-key` | 예 |
| `CORS_ORIGIN` | CORS 허용 오리진 | `http://localhost:5173` (개발) | 아니오 |

### 웹 (packages/web)

| 변수명 | 설명 | 기본값 | 필수 |
|--------|------|--------|------|
| `VITE_API_URL` | API 서버 URL | `http://localhost:4000` | 아니오 |

## 주의사항

1. **`.env` 파일은 Git에 커밋하지 마세요** - `.gitignore`에 포함되어 있습니다.
2. **프로덕션 환경에서는 반드시 `JWT_SECRET`을 변경하세요** - 보안상 매우 중요합니다.
3. **데이터베이스 URL**: 개발 환경에서는 SQLite를 사용하고, 프로덕션에서는 PostgreSQL을 사용하는 것을 권장합니다.
4. **CORS 설정**: 프로덕션에서는 실제 도메인을 지정해야 합니다.

