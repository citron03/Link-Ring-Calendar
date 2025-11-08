// Export AppRouter type for frontend
export type { AppRouter } from './trpc/router';

// Load environment variables first
import './config/env';
import { config } from './config/env';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { createContext } from './trpc/context';
import { appRouter } from './trpc/router';
// Keep REST API routes for backward compatibility (optional)
import quickLinksRouter from './routes/quicklinks';
import schedulesRouter from './routes/schedules';
import authRouter from './routes/auth';

const app = express();

// Middleware
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

if (!config.databaseUrl) {
  console.warn('[server] WARNING: DATABASE_URL is not set. Prisma requests will fail until you set DATABASE_URL in packages/server/.env or environment. For quick testing you can set DATABASE_URL="file:./dev.db"');
}

// tRPC endpoint
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// REST API routes (kept for backward compatibility, can be removed later)
app.use('/api/auth', authRouter);
app.use('/api/quicklinks', quickLinksRouter);
app.use('/api/schedules', schedulesRouter);

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`[${config.nodeEnv}] Server listening at http://localhost:${config.port}`);
  // eslint-disable-next-line no-console
  console.log(`tRPC endpoint: http://localhost:${config.port}/trpc`);
});
