# Link-Ring-Calendar (monorepo)

This repository is a pnpm workspace monorepo for the Link-Ring Calendar project.

Structure
- packages/server - mock tRPC server (TypeScript, Express)
- packages/web - Vite + React web app that consumes the tRPC API

Goals in this scaffold
- Use pnpm workspaces
- Type-safe API surface using tRPC (server defines router types, web consumes them via workspace dependency)
- Fast dev with Vite for the web and ts-node-dev for the server mock

Quick start (requires pnpm installed)

1. Install dependencies

```bash
pnpm install
```

2. Run both packages in parallel (from repo root)

```bash
pnpm dev
```

3. Web app available at http://localhost:5173 and server at http://localhost:4000

Database (PostgreSQL) setup

This project uses Prisma for database access. By default Prisma reads DATABASE_URL from environment.

1. Create a `.env` file in `packages/server` based on `.env.example` and set `DATABASE_URL`.
	- For local quick testing you can use SQLite: `DATABASE_URL="file:./dev.db"`
	- For production/dev with Postgres: `postgresql://USER:PASS@HOST:5432/dbname`

2. Generate Prisma client and run migrations from the server package:

```bash
cd packages/server
pnpm prisma:generate
pnpm prisma:migrate
```

If you prefer not to run migrations yet, you can set `DATABASE_URL="file:./dev.db"` and Prisma will create a sqlite file for quick local testing.

Authentication

This scaffold includes JWT-based authentication endpoints at `/api/auth`. Use `/api/auth/register` and `/api/auth/login` to create accounts and receive JWT access tokens. Frontend stores tokens in localStorage and attaches them as `Authorization: Bearer <token>` when calling protected endpoints.

Token rotation

The server exposes `/api/auth/refresh` which accepts a `refreshToken` (in request body) and returns a new `accessToken`. This is a simple rotation strategy; for stronger security you can store refresh tokens in the database and revoke them on logout.

Docker / Postgres development

We included a `docker-compose.yml` that will start a Postgres database, the server, and the web preview. It is configured to run Prisma migrations on the server service startup.

To start everything locally using Docker:

```bash
docker compose up --build
```

The server will be reachable at http://localhost:4000 and the web preview at http://localhost:5173.

Notes about Postgres vs SQLite
- For local quick testing we use SQLite (`packages/server/.env` points to `file:./dev.db`). To run with Postgres (docker-compose or production), set `DATABASE_URL` to a Postgres connection string and set `provider = "postgresql"` in `packages/server/prisma/schema.prisma`, then run migrations.



Notes
- This is a minimal scaffold and mock server to get the developer flow working.
- Use `pnpm -w -r run build` to build all packages.
- See each package's README for package-specific commands.
# Link-Ring-Calendar
링크링 캘린더 (Link-Ring Calendar)
