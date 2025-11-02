FROM node:20-alpine
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma
COPY src ./src

RUN pnpm install --frozen-lockfile --prod
RUN pnpm prisma:generate || true
RUN pnpm build || true

EXPOSE 4000
CMD ["node", "dist/index.js"]
