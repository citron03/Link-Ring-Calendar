FROM node:20-alpine
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml* ./
COPY src ./src
COPY index.html ./
COPY vite.config.ts ./

RUN pnpm install --frozen-lockfile --prod
RUN pnpm build || true

EXPOSE 4173
CMD ["pnpm", "preview", "--port", "4173"]
