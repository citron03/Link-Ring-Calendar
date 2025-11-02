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

3. Web app available at http://localhost:5173 and server at http://localhost:4000/trpc

Notes
- This is a minimal scaffold and mock server to get the developer flow working.
- Use `pnpm -w -r run build` to build all packages.
- See each package's README for package-specific commands.
# Link-Ring-Calendar
링크링 캘린더 (Link-Ring Calendar)
